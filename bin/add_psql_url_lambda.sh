#!/bin/bash
DATABASE_URL=$(heroku config:get DATABASE_URL --app rpatelphotography)
aws --profile personal lambda update-function-configuration --kms-key-arn '' --function-name rpatelphotography_psql_update --environment Variables={DATABASE_URL=$DATABASE_URL}