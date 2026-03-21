#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SYMPHONY_ROOT="${SYMPHONY_ROOT:-/Users/jackzerby/Sites/symphony}"
SYMPHONY_ELIXIR_DIR="${SYMPHONY_ELIXIR_DIR:-$SYMPHONY_ROOT/elixir}"
WORKFLOW_PATH="${WORKFLOW_PATH:-$ROOT_DIR/WORKFLOW.md}"
LOGS_ROOT="${SYMPHONY_LOGS_ROOT:-$ROOT_DIR/log/symphony}"
PORT="${SYMPHONY_PORT:-}"
ENV_FILE="${SYMPHONY_ENV_FILE:-$HOME/.config/markdown-link/symphony.env}"

if [[ -f "$ENV_FILE" ]]; then
  set -a
  source "$ENV_FILE"
  set +a
fi

if [[ ! -d "$SYMPHONY_ELIXIR_DIR" ]]; then
  echo "error: Symphony checkout not found at $SYMPHONY_ELIXIR_DIR" >&2
  exit 1
fi

if [[ ! -f "$WORKFLOW_PATH" ]]; then
  echo "error: workflow file not found at $WORKFLOW_PATH" >&2
  exit 1
fi

if [[ -z "${LINEAR_API_KEY:-}" ]]; then
  echo "error: LINEAR_API_KEY is not set" >&2
  exit 1
fi

export SYMPHONY_WORKSPACE_ROOT="${SYMPHONY_WORKSPACE_ROOT:-$HOME/symphony-workspaces/markdown-link}"
mkdir -p "$SYMPHONY_WORKSPACE_ROOT" "$LOGS_ROOT"

args=(
  "--i-understand-that-this-will-be-running-without-the-usual-guardrails"
  "$WORKFLOW_PATH"
  "--logs-root"
  "$LOGS_ROOT"
)

if [[ -n "$PORT" ]]; then
  args+=( "--port" "$PORT" )
fi

while [[ $# -gt 0 ]]; do
  case "$1" in
    --port)
      shift
      PORT="${1:-}"
      if [[ -z "$PORT" ]]; then
        echo "error: --port requires a value" >&2
        exit 1
      fi
      args=(
        "--i-understand-that-this-will-be-running-without-the-usual-guardrails"
        "$WORKFLOW_PATH"
        "--logs-root"
        "$LOGS_ROOT"
        "--port"
        "$PORT"
      )
      ;;
    *)
      echo "error: unknown option $1" >&2
      exit 1
      ;;
  esac
  shift
done

echo "Starting Symphony"
echo "  workflow:  $WORKFLOW_PATH"
echo "  workspaces:$SYMPHONY_WORKSPACE_ROOT"
echo "  logs:      $LOGS_ROOT"
if [[ -n "$PORT" ]]; then
  echo "  dashboard: http://127.0.0.1:$PORT"
fi

cd "$SYMPHONY_ELIXIR_DIR"
exec /opt/homebrew/bin/mise exec -- ./bin/symphony "${args[@]}"
