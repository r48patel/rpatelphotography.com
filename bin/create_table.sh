#!/bin/bash

## Always execute from the location of the script
pushd $(dirname $0) 1>/dev/null
python db.py --url `heroku config:get DATABASE_URL` --table rpateltravels --action create_table --columns "title VARCHAR PRIMARY KEY, location VARCHAR, term VARCHAR, link_prefix VARCHAR, items INTEGER"
popd 1>/dev/null