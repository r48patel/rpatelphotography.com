#!/bin/bash
DATABASE_URL="$(aws kms encrypt --profile personal --key-id alias/rpatelphotography --plaintext `heroku config:get DATABASE_URL --app rpatelphotography` --output text --query CiphertextBlob)"
aws --profile personal lambda update-function-configuration --function-name rpatelphotography_psql_update --environment Variables={DATABASE_URL=$DATABASE_URL}