#!/bin/bash

## Always execute from the location of the script
pushd $(dirname $0) 1>/dev/null
python db.py --url `heroku config:get DATABASE_URL --app rpateltravels` --table rpateltravels --action drop_table
popd 1>/dev/null