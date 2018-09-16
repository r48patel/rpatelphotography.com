#!/bin/bash
DATABASE_URL="$(aws kms encrypt --profile personal --key-id alias/rpateltravels --plaintext `heroku config:get DATABASE_URL` --output text --query CiphertextBlob)"
aws --profile personal lambda update-function-configuration --function-name rpateltravels_psql_update --environment Variables={DATABASE_URL=$DATABASE_URL}