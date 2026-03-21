#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${SYMPHONY_ENV_FILE:-$HOME/.config/markdown-link/symphony.env}"
LOGS_ROOT="${SYMPHONY_LOGS_ROOT:-$ROOT_DIR/log/symphony}"
PORT="${SYMPHONY_PORT:-4100}"
STATE_URL="http://127.0.0.1:${PORT}/api/v1/state"
STATE_FILE="$LOGS_ROOT/heartbeat-state.json"

mkdir -p "$LOGS_ROOT"

if [[ -f "$ENV_FILE" ]]; then
  set -a
  source "$ENV_FILE"
  set +a
  PORT="${SYMPHONY_PORT:-$PORT}"
  STATE_URL="http://127.0.0.1:${PORT}/api/v1/state"
fi

timestamp="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
service_id="gui/$(id -u)/com.markdownlink.symphony"

if curl -fsS "$STATE_URL" >"$STATE_FILE.tmp"; then
  mv "$STATE_FILE.tmp" "$STATE_FILE"
  echo "[$timestamp] healthy: $(jq -r '.counts.running // 0' "$STATE_FILE") running, $(jq -r '.counts.retrying // 0' "$STATE_FILE") retrying" >>"$LOGS_ROOT/heartbeat.log"
  exit 0
fi

rm -f "$STATE_FILE.tmp"

if launchctl print "$service_id" 2>/dev/null | grep -q "state = running"; then
  echo "[$timestamp] warming-up: service is running but state endpoint is not ready yet" >>"$LOGS_ROOT/heartbeat.log"
  exit 0
fi

echo "[$timestamp] unhealthy: state endpoint unavailable, restarting service" >>"$LOGS_ROOT/heartbeat.log"
launchctl kickstart -k "$service_id"
