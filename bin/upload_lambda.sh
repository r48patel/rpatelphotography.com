#!/bin/bash

## Always execute from the location of the script
pushd $(dirname $0) 1>/dev/null
echo "Copy db.py"
cp db.py lambda/
echo "Copy lambda_function.py"
cp lambda_function.py lambda/
echo "Zip lambda"
cd lambda/
zip -r ../lambda.zip . 1>/dev/null
echo "Remove lambda/db.py"
rm db.py
echo "Remove lambda/lambda_function.py"
rm lambda_function.py
cd ..
echo "Upload lambda.zip"
aws lambda update-function-code --function-name rpatelphotography_psql_update --zip-file fileb://lambda.zip --profile personal 1>/dev/null
echo "Remove lambda.zip"
rm lambda.zip
popd 1>/dev/null