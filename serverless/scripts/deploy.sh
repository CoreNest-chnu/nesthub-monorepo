#!/usr/bin/env bash
# Deploys the reviews API to LocalStack with the AWS CLI:
#   DynamoDB table -> IAM role -> Lambda function -> API Gateway REST API -> stage.
# Safe to run again: existing resources are reused or updated, the REST API is
# recreated so its routes always match this script.
set -euo pipefail
source "$(dirname "$0")/common.sh"

require_localstack

log "1/5 DynamoDB table $TABLE"
if awsl dynamodb describe-table --table-name "$TABLE" >/dev/null 2>&1; then
  echo "exists"
else
  # id = partition key; GSI productId-index serves GET /reviews?productId=...
  awsl dynamodb create-table \
    --table-name "$TABLE" \
    --attribute-definitions AttributeName=id,AttributeType=S AttributeName=productId,AttributeType=S \
    --key-schema AttributeName=id,KeyType=HASH \
    --global-secondary-indexes \
      'IndexName=productId-index,KeySchema=[{AttributeName=productId,KeyType=HASH}],Projection={ProjectionType=ALL}' \
    --billing-mode PAY_PER_REQUEST \
    --query 'TableDescription.[TableName,TableStatus]' --output text
  awsl dynamodb wait table-exists --table-name "$TABLE"
fi

log "2/5 IAM role $ROLE"
if ! awsl iam get-role --role-name "$ROLE" >/dev/null 2>&1; then
  awsl iam create-role --role-name "$ROLE" \
    --assume-role-policy-document '{
      "Version": "2012-10-17",
      "Statement": [{"Effect": "Allow", "Principal": {"Service": "lambda.amazonaws.com"}, "Action": "sts:AssumeRole"}]
    }' >/dev/null
fi
# Least privilege: only the item operations the function uses, only on this
# table and its index, plus writing its own logs.
awsl iam put-role-policy --role-name "$ROLE" --policy-name reviews-access --policy-document "{
  \"Version\": \"2012-10-17\",
  \"Statement\": [
    {\"Effect\": \"Allow\",
     \"Action\": [\"dynamodb:PutItem\", \"dynamodb:GetItem\", \"dynamodb:DeleteItem\", \"dynamodb:Query\"],
     \"Resource\": [\"arn:aws:dynamodb:$REGION:$ACCOUNT_ID:table/$TABLE\",
                    \"arn:aws:dynamodb:$REGION:$ACCOUNT_ID:table/$TABLE/index/*\"]},
    {\"Effect\": \"Allow\",
     \"Action\": [\"logs:CreateLogGroup\", \"logs:CreateLogStream\", \"logs:PutLogEvents\"],
     \"Resource\": \"*\"}
  ]
}"
ROLE_ARN="arn:aws:iam::$ACCOUNT_ID:role/$ROLE"
echo "$ROLE_ARN"

log "3/5 Lambda function $FUNCTION"
ZIP="$(mktemp -d)/reviews.zip"
(cd "$LAMBDA_DIR" && zip -q "$ZIP" index.mjs)
if awsl lambda get-function --function-name "$FUNCTION" >/dev/null 2>&1; then
  awsl lambda update-function-code --function-name "$FUNCTION" --zip-file "fileb://$ZIP" \
    --query 'LastUpdateStatus' --output text
  awsl lambda wait function-updated-v2 --function-name "$FUNCTION"
else
  awsl lambda create-function \
    --function-name "$FUNCTION" \
    --runtime nodejs22.x \
    --handler index.handler \
    --role "$ROLE_ARN" \
    --zip-file "fileb://$ZIP" \
    --timeout 10 \
    --memory-size 256 \
    --environment "Variables={TABLE_NAME=$TABLE}" \
    --query 'FunctionArn' --output text
  # The first start pulls the nodejs22.x runtime image, which can take a while.
  awsl lambda wait function-active-v2 --function-name "$FUNCTION"
fi
FUNCTION_ARN="arn:aws:lambda:$REGION:$ACCOUNT_ID:function:$FUNCTION"

log "4/5 API Gateway REST API $API_NAME"
OLD_ID="$(api_id)"
if [[ "$OLD_ID" != "None" ]]; then
  awsl apigateway delete-rest-api --rest-api-id "$OLD_ID"
fi
# _custom_id_ is a LocalStack extension: a fixed API id, so the URL stays the
# same after every redeploy (real AWS always generates a random id).
API_ID="$(awsl apigateway create-rest-api --name "$API_NAME" \
  --description 'NestHub product reviews' --tags "_custom_id_=$API_CUSTOM_ID" \
  --query 'id' --output text)"
ROOT_ID="$(awsl apigateway get-resources --rest-api-id "$API_ID" \
  --query "items[?path=='/'].id | [0]" --output text)"
REVIEWS_ID="$(awsl apigateway create-resource --rest-api-id "$API_ID" \
  --parent-id "$ROOT_ID" --path-part reviews --query 'id' --output text)"
REVIEW_ID="$(awsl apigateway create-resource --rest-api-id "$API_ID" \
  --parent-id "$REVIEWS_ID" --path-part '{id}' --query 'id' --output text)"

# Lambda proxy integration: API Gateway passes the whole request to the
# function and returns its {statusCode, headers, body} as the HTTP response.
INTEGRATION_URI="arn:aws:apigateway:$REGION:lambda:path/2015-03-31/functions/$FUNCTION_ARN/invocations"
route() { # route <resource-id> <method> <path>
  awsl apigateway put-method --rest-api-id "$API_ID" --resource-id "$1" \
    --http-method "$2" --authorization-type NONE >/dev/null
  awsl apigateway put-integration --rest-api-id "$API_ID" --resource-id "$1" \
    --http-method "$2" --type AWS_PROXY --integration-http-method POST \
    --uri "$INTEGRATION_URI" >/dev/null
  echo "$2 $3"
}
route "$REVIEWS_ID" POST /reviews
route "$REVIEWS_ID" GET /reviews
route "$REVIEW_ID" GET '/reviews/{id}'
route "$REVIEW_ID" DELETE '/reviews/{id}'

# Allow this API (any stage, method and path) to invoke the function.
awsl lambda remove-permission --function-name "$FUNCTION" --statement-id apigateway-invoke >/dev/null 2>&1 || true
awsl lambda add-permission --function-name "$FUNCTION" --statement-id apigateway-invoke \
  --action lambda:InvokeFunction --principal apigateway.amazonaws.com \
  --source-arn "arn:aws:execute-api:$REGION:$ACCOUNT_ID:$API_ID/*/*/*" >/dev/null

log "5/5 Deployment, stage $STAGE"
awsl apigateway create-deployment --rest-api-id "$API_ID" --stage-name "$STAGE" \
  --description "deploy.sh $(date -u +%Y-%m-%dT%H:%M:%SZ)" --query 'id' --output text

log "Done"
echo "API: $(api_url)/reviews"
echo "Try: ./serverless/scripts/smoke-test.sh"
