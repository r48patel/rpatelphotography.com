#!/bin/bash

## Always execute from the location of the script
pushd $(dirname $0) 1>/dev/null
echo 'Sleeping for 30s'
sleep 30s
python db.py --url `heroku config:get DATABASE_URL --app rpatelphotography` --table rpatelphotography --action drop_table
popd 1>/dev/null