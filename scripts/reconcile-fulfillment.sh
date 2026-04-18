#!/usr/bin/env bash
set -euo pipefail

: "${BASE_URL:?BASE_URL is required (example: https://www.recoverycompass.co)}"
: "${COMMERCE_RECONCILE_SECRET:?COMMERCE_RECONCILE_SECRET is required}"

RECONCILE_LIMIT="${RECONCILE_LIMIT:-100}"
RECONCILE_MAX_AGE_MINUTES="${RECONCILE_MAX_AGE_MINUTES:-5}"
CURL_TIMEOUT_SECONDS="${CURL_TIMEOUT_SECONDS:-20}"

payload=$(printf '{"limit":%s,"maxAgeMinutes":%s}' "$RECONCILE_LIMIT" "$RECONCILE_MAX_AGE_MINUTES")

curl \
  --silent \
  --show-error \
  --fail-with-body \
  --max-time "${CURL_TIMEOUT_SECONDS}" \
  --request POST \
  "${BASE_URL%/}/api/checkout/reconcile-fulfillment" \
  --header "Authorization: Bearer ${COMMERCE_RECONCILE_SECRET}" \
  --header "Content-Type: application/json" \
  --data "${payload}"
