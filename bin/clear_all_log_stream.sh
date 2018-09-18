#!/bin/bash
LOG_GROUP_NAME="${1}"
aws logs describe-log-streams --profile personal --log-group-name $LOG_GROUP_NAME --query 'logStreams[*].logStreamName' --output table --max-item 2000 | awk '{print $2}' | grep -v ^$ | while read x; do aws logs delete-log-stream --profile personal --log-group-name $LOG_GROUP_NAME --log-stream-name $x; done