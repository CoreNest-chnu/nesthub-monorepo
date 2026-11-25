#!/usr/bin/env bash
# End-to-end check of the deployed API with curl: create, get, list, delete,
# plus the error cases. Exits non-zero on the first unexpected status.
set -euo pipefail
source "$(dirname "$0")/common.sh"

require_localstack
URL="$(api_url)/reviews"
echo "API: $URL"

# call <expected-status> <curl args...>: prints the request and the response.
call() {
  local expected=$1; shift
  echo
  echo "\$ curl $*"
  local out status
  out="$(curl -s -w '\n%{http_code}' "$@")"
  status="${out##*$'\n'}"
  body="${out%$'\n'*}"
  echo "HTTP $status"
  [[ -n "$body" ]] && (echo "$body" | jq . 2>/dev/null || echo "$body")
  if [[ "$status" != "$expected" ]]; then
    echo "FAIL: expected HTTP $expected" >&2
    exit 1
  fi
}

PRODUCT="prod-$RANDOM"

call 201 -X POST "$URL" -H 'Content-Type: application/json' \
  -d "{\"productId\":\"$PRODUCT\",\"author\":\"Olena\",\"rating\":5,\"text\":\"Fast delivery, works great\"}"
ID="$(echo "$body" | jq -r .id)"

call 201 -X POST "$URL" -H 'Content-Type: application/json' \
  -d "{\"productId\":\"$PRODUCT\",\"author\":\"Taras\",\"rating\":4}"

call 200 "$URL/$ID"
call 200 "$URL?productId=$PRODUCT"
call 400 -X POST "$URL" -H 'Content-Type: application/json' -d '{"productId":"x","author":"y","rating":9}'
call 204 -X DELETE "$URL/$ID"
call 404 "$URL/$ID"

echo
echo "\$ aws dynamodb scan --table-name $TABLE (items of $PRODUCT)"
awsl dynamodb scan --table-name "$TABLE" \
  --filter-expression 'productId = :p' --expression-attribute-values "{\":p\":{\"S\":\"$PRODUCT\"}}" \
  --query 'Items[].{id:id.S,author:author.S,rating:rating.N}' --output table

echo
echo "All checks passed."
