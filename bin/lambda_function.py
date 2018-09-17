from __future__ import print_function

import json
import urllib
import boto3
import os
from base64 import b64decode
from  db import *

def get_all_s3_objects(s3, bucket, prefix=None):
        """Return all of the objects in a bucket with given prefix"""
        paginator = s3.get_paginator('list_objects_v2')
        if prefix:
            results = paginator.paginate(Bucket=bucket, Prefix=prefix)
        else:
            results = paginator.paginate(Bucket=bucket)

        items = []
        for result in results:
            for content in result['Contents']:
                if content['Size'] > 0:
                    items.append(content)

        return items

def delete_psql_entry(folder):
    if 'DATABASE_URL' not in os.environ:
        raise Exception('DATABASE_URL not defined as env variable')

    if 'USER' in os.environ:
        session = boto3.Session(profile_name='personal')
        kms = session.client('kms')
        s3 = session.client('s3')
    else:
        kms = boto3.client('kms')
        s3 = boto3.client('s3')

    ENCRYPTED_DATABASE_URL = os.environ['DATABASE_URL']
    DATABASE_URL = kms.decrypt(CiphertextBlob=b64decode(ENCRYPTED_DATABASE_URL))['Plaintext']
    psql = PSQL(DATABASE_URL)

    return psql.delete('rpateltravels', "title = '%s'" % folder)

def update_psql(bucket, key):
    if 'DATABASE_URL' not in os.environ:
        raise Exception('DATABASE_URL not defined as env variable')

    if 'USER' in os.environ:
        session = boto3.Session(profile_name='personal')
        kms = session.client('kms')
        s3 = session.client('s3')
    else:
        kms = boto3.client('kms')
        s3 = boto3.client('s3')

    ENCRYPTED_DATABASE_URL = os.environ['DATABASE_URL']
    DATABASE_URL = kms.decrypt(CiphertextBlob=b64decode(ENCRYPTED_DATABASE_URL))['Plaintext']
    psql = PSQL(DATABASE_URL)

    prefix = key.split('/')[0]
    prefix_array = prefix.split('-')
    title = prefix_array[0].strip()
    location = prefix_array[1].strip()
    term = prefix_array[2].strip()
    taken_date = prefix_array[3].strip().replace('_', '-')
    link_prefix = "https://s3.amazonaws.com/rpateltravels/%s/" % prefix.replace(' ', '+')
    total_items = len(get_all_s3_objects(s3, bucket, prefix))

    select_results = psql.select('*', 'rpateltravels', conditions="title='%s'"%title)
    if total_items == 0:
        command = delete_psql_entry(title)
    else:
        if len(select_results) > 0:
            command = psql.update('rpateltravels', 'items', total_items, "title = '%s'" % title)
        else:
            command = psql.insert('rpateltravels', "title,location,term,taken_date,link_prefix,items", "('%s', '%s', '%s', '%s', '%s', %s)" % (title, location, term, taken_date, link_prefix, total_items))

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
    update_psql('rpateltravels', 'Engagement Photoshoot')