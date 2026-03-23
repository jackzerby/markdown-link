#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PORT="${PORT:-3001}"
APP_URL="${APP_URL:-http://localhost:${PORT}}"

cleanup() {
  local exit_code=$?

  if [[ -n "${STRIPE_PID:-}" ]] && kill -0 "$STRIPE_PID" 2>/dev/null; then
    kill "$STRIPE_PID" 2>/dev/null || true
    wait "$STRIPE_PID" 2>/dev/null || true
  fi

  if [[ -n "${DEV_PID:-}" ]] && kill -0 "$DEV_PID" 2>/dev/null; then
    kill "$DEV_PID" 2>/dev/null || true
    wait "$DEV_PID" 2>/dev/null || true
  fi

  exit "$exit_code"
}

trap cleanup INT TERM EXIT

cd "$ROOT_DIR"

if ! command -v stripe >/dev/null 2>&1; then
  echo "Stripe CLI is not installed. Run: brew tap stripe/stripe-cli && brew install stripe" >&2
  exit 1
fi

echo "Starting Next dev server on ${APP_URL}"
npm run dev -- --port "$PORT" &
DEV_PID=$!

echo "Waiting for ${APP_URL} to respond..."
for _ in {1..60}; do
  if curl -fsS "${APP_URL}" >/dev/null 2>&1; then
    break
  fi
  sleep 1
done

if ! curl -fsS "${APP_URL}" >/dev/null 2>&1; then
  echo "Dev server did not become ready at ${APP_URL}" >&2
  exit 1
fi

echo "Starting Stripe webhook forwarding"
APP_URL="$APP_URL" "$ROOT_DIR/scripts/stripe-listen.sh" &
STRIPE_PID=$!

wait "$DEV_PID"
