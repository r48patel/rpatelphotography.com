from __future__ import print_function

import json
import urllib
import boto3
import os
from base64 import b64decode
from  db import *

def get_all_s3_objects(s3, bucket, prefix=None):
    print("get_all_s3_objects(%s, %s, %s)" % (s3, bucket, prefix) )
    """Return all of the objects in a bucket with given prefix"""
    paginator = s3.get_paginator('list_objects_v2')
    if prefix:
        results = paginator.paginate(Bucket=bucket, Prefix=prefix)
    else:
        results = paginator.paginate(Bucket=bucket)

    items = []
    for result in results:
        for content in result['Contents']:
            if content['Size'] > 0 and '-thumb.' not in content['Key']:
                items.append(content)

    return items

def delete_psql_entry(folder, term):
    print("delete_psql_entry(%s - %s)" % (folder, term))
    if 'DATABASE_URL' not in os.environ:
        raise Exception('DATABASE_URL not defined as env variable')

    profile=None
    if 'USER' in os.environ:
        profile='personal'
    session = boto3.Session(profile_name=profile)
    s3 = session.client('s3')
    
    DATABASE_URL = os.environ['DATABASE_URL']
    psql = PSQL(DATABASE_URL)

    return psql.delete('rpatelphotography', "title = '%s' and term = '%s'" % (folder, term))

def update_psql(bucket, key):
    print("update_psql(%s, %s)" % (bucket, key))
    if 'DATABASE_URL' not in os.environ:
        raise Exception('DATABASE_URL not defined as env variable')

    profile=None
    if 'USER' in os.environ:
        profile='personal'
    session = boto3.Session(profile_name=profile)
    s3 = session.client('s3')

    DATABASE_URL = os.environ['DATABASE_URL']
    psql = PSQL(DATABASE_URL)


    prefix = key.split('/')[0]
    prefix_array = prefix.split('-')
    
    if len(prefix_array) != 4:
        raise Exception('Failed to parse s3 folder %s. Make it is formmated properly' % prefix_array)

    title = prefix_array[0].strip()
    location = prefix_array[1].strip()
    term = prefix_array[2].strip()
    taken_date = prefix_array[3].strip().replace('_', '-') if prefix_array[3] != '' else None
    link_prefix = "https://s3.amazonaws.com/rpatelphotography/%s/" % prefix.replace(' ', '+')
    total_items = len(get_all_s3_objects(s3, bucket, prefix))

    select_results = psql.select('*', 'rpatelphotography', conditions="title='%s'"%title)
    if total_items == 0:
        command = delete_psql_entry(title, term )
    else:
        if len(select_results) > 0:
            command = psql.update('rpatelphotography', 'items', total_items, "title = '%s'" % title)
        else:
            if taken_date:
                command = psql.insert(
                    'rpatelphotography', "title,location,term,taken_date,link_prefix,items", 
                    "('%s', '%s', '%s', '%s', '%s', %s)" % (title, location, term, taken_date, link_prefix, total_items))
            else:
                command =  psql.insert(
                    'rpatelphotography', "title,location,term,taken_date,link_prefix,items", 
                    "('%s', '%s', '%s', NULL, '%s', %s)" % (title, location, term, link_prefix, total_items))

    return command

def lambda_handler(event, context):

    
    # Get the object from the event and show its content type
    bucket = event['Records'][0]['s3']['bucket']['name']
    key = urllib.unquote_plus(event['Records'][0]['s3']['object']['key'].encode('utf8'))
    event_type = event['Records'][0]['eventName']
    print ("bucket: " + bucket)
    print ("key: " + key)
    print ("event_type: " + event_type)
    
    try:
        if 'ObjectCreated:' in event_type:
            command_result = update_psql(bucket, key)
        elif 'ObjectRemoved:' in event_type:
            key_split = key.split('/')
            print("key_split: %s" % key_split)
            if len(key_split[0].split('-')) != 4:
                raise Exception('Failed to parse s3 folder %s. Make it is formmated properly' % key_split[0])
            if key_split[1] == '': # When Folder is deleted
                title = key_split[0].split('-')[0].strip()
                command_result = delete_psql_entry(title)
            else: # When files are deleted
                command_result = update_psql(bucket, key)
                
        print (command_result)           
        return 'Updated info for %s/%s' % (bucket, key)
    except Exception as e:
        print(e)
        print('Error getting object {} from bucket {}. Make sure they exist and your bucket is in the same region as this function.'.format(key, bucket))
        raise e
        

if __name__ == '__main__':
    update_psql('rpatelphotography', 'Engagement Photoshoot')