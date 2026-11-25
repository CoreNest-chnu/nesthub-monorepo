#!/usr/bin/env bash
# Removes everything deploy.sh created in LocalStack (the data in the table too).
set -euo pipefail
source "$(dirname "$0")/common.sh"

require_localstack

ID="$(api_id)"
[[ "$ID" != "None" ]] && awsl apigateway delete-rest-api --rest-api-id "$ID" && echo "deleted REST API $ID"
awsl lambda delete-function --function-name "$FUNCTION" >/dev/null 2>&1 && echo "deleted function $FUNCTION" || true
awsl iam delete-role-policy --role-name "$ROLE" --policy-name reviews-access 2>/dev/null || true
awsl iam delete-role --role-name "$ROLE" 2>/dev/null && echo "deleted role $ROLE" || true
awsl dynamodb delete-table --table-name "$TABLE" >/dev/null 2>&1 && echo "deleted table $TABLE" || true
