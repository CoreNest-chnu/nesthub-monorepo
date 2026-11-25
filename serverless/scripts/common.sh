# Shared settings of the deploy / smoke-test / destroy scripts. Sourced, not run.

# Every AWS CLI call goes to LocalStack, never to a real AWS account.
ENDPOINT="${LOCALSTACK_ENDPOINT:-http://localhost:4566}"
export AWS_DEFAULT_REGION="${AWS_DEFAULT_REGION:-eu-central-1}"
# LocalStack accepts any credentials; these dummy values only keep the CLI
# from looking for a real profile.
export AWS_ACCESS_KEY_ID=test
export AWS_SECRET_ACCESS_KEY=test
export AWS_PAGER=""

REGION="$AWS_DEFAULT_REGION"
ACCOUNT_ID=000000000000 # LocalStack's default account

TABLE=nesthub-reviews
FUNCTION=nesthub-reviews
ROLE=nesthub-reviews-lambda
API_NAME=nesthub-reviews-api
API_CUSTOM_ID=reviews
STAGE=dev

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LAMBDA_DIR="$SCRIPT_DIR/../lambda/reviews"

awsl() { aws --endpoint-url "$ENDPOINT" "$@"; }
log() { printf '\n\033[1;36m==> %s\033[0m\n' "$*"; }

require_localstack() {
  if ! curl -sf "$ENDPOINT/_localstack/health" >/dev/null; then
    echo "LocalStack is not reachable at $ENDPOINT." >&2
    echo "Start it: docker compose -f serverless/docker-compose.yaml up -d --wait" >&2
    exit 1
  fi
}

api_id() {
  awsl apigateway get-rest-apis --query "items[?name=='$API_NAME'].id | [0]" --output text
}

# Invoke URL of the stage. LocalStack also serves
# http://reviews.execute-api.localhost.localstack.cloud:4566/<stage>/...
api_url() {
  echo "$ENDPOINT/restapis/$(api_id)/$STAGE/_user_request_"
}
