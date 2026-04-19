#!/usr/bin/env bash
set -euo pipefail

: "${BASE_URL:?BASE_URL is required (example: https://www.recoverycompass.co)}"
: "${COMMERCE_RECONCILE_SECRET:?COMMERCE_RECONCILE_SECRET is required}"

CURL_TIMEOUT_SECONDS="${CURL_TIMEOUT_SECONDS:-20}"

response="$(
  curl \
    --silent \
    --show-error \
    --fail-with-body \
    --max-time "${CURL_TIMEOUT_SECONDS}" \
    --request GET \
    "${BASE_URL%/}/api/checkout/fulfillment-health" \
    --header "Authorization: Bearer ${COMMERCE_RECONCILE_SECRET}"
)"

echo "${response}"

echo "${response}" | node -e '
const fs = require("node:fs");
const raw = fs.readFileSync(0, "utf8");

let parsed;
try {
  parsed = JSON.parse(raw);
} catch (error) {
  console.error("[commerce-health] Invalid JSON response");
  process.exit(3);
}

if (parsed?.status !== "ok" || !parsed.snapshot) {
  console.error("[commerce-health] Unexpected response shape");
  process.exit(3);
}

const pending = Number(parsed.snapshot.paidPendingCount ?? 0);
const failed = Number(parsed.snapshot.paidFailedCount ?? 0);
const fulfilled = Number(parsed.snapshot.paidFulfilledCount ?? 0);

if (pending + failed > 0) {
  console.error(`[commerce-health] backlog detected pending=${pending} failed=${failed} fulfilled=${fulfilled}`);
  process.exit(2);
}

console.log(`[commerce-health] healthy pending=${pending} failed=${failed} fulfilled=${fulfilled}`);
'
