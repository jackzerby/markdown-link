#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${ENV_FILE:-$ROOT_DIR/.env}"

if [[ -f "$ENV_FILE" ]]; then
  set -a
  # shellcheck disable=SC1090
  source "$ENV_FILE"
  set +a
fi

if ! command -v stripe >/dev/null 2>&1; then
  echo "Stripe CLI is not installed. Run: brew tap stripe/stripe-cli && brew install stripe" >&2
  exit 1
fi

: "${STRIPE_SECRET_KEY:?Set STRIPE_SECRET_KEY in .env first.}"

APP_BASE_URL="${APP_URL:-http://localhost:3001}"
FORWARD_TO="${STRIPE_FORWARD_TO:-${APP_BASE_URL%/}/api/stripe/webhook}"
SECRET_FILE="${STRIPE_WEBHOOK_SECRET_FILE:-$ROOT_DIR/.stripe-webhook-secret}"
EVENTS="${STRIPE_LISTEN_EVENTS:-checkout.session.completed,customer.subscription.created,customer.subscription.updated,customer.subscription.deleted,invoice.paid,invoice.payment_failed}"

mkdir -p "$(dirname "$SECRET_FILE")"
rm -f "$SECRET_FILE"

echo "Forwarding Stripe events to $FORWARD_TO"
echo "Writing local webhook secret to $SECRET_FILE"

stripe listen \
  --skip-update \
  --api-key "$STRIPE_SECRET_KEY" \
  --events "$EVENTS" \
  --forward-to "$FORWARD_TO" 2>&1 | while IFS= read -r line; do
    echo "$line"

    if [[ ! -f "$SECRET_FILE" && "$line" =~ (whsec_[A-Za-z0-9]+) ]]; then
      printf '%s\n' "${BASH_REMATCH[1]}" > "$SECRET_FILE"
      chmod 600 "$SECRET_FILE"
      echo "Saved Stripe webhook secret to $SECRET_FILE"
    fi
  done
