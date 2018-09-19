#!/bin/bash

## Always execute from the location of the script
pushd $(dirname $0) 1>/dev/null
python db.py --url `heroku config:get DATABASE_URL --app rpatelphotography` --table rpatelphotography --action create_table --columns "title VARCHAR PRIMARY KEY, location VARCHAR NOT NULL, term VARCHAR NOT NULL, taken_date DATE, link_prefix VARCHAR NOT NULL, items INTEGER NOT NULL"
popd 1>/dev/null