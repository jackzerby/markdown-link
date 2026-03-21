#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PLIST_SOURCE="${PLIST_SOURCE:-$ROOT_DIR/ops/com.markdownlink.symphony.plist}"
HEARTBEAT_SOURCE="${HEARTBEAT_SOURCE:-$ROOT_DIR/ops/com.markdownlink.symphony-heartbeat.plist}"
LAUNCH_AGENTS_DIR="${LAUNCH_AGENTS_DIR:-$HOME/Library/LaunchAgents}"
PLIST_TARGET="$LAUNCH_AGENTS_DIR/com.markdownlink.symphony.plist"
HEARTBEAT_TARGET="$LAUNCH_AGENTS_DIR/com.markdownlink.symphony-heartbeat.plist"

mkdir -p "$LAUNCH_AGENTS_DIR"

if [[ ! -f "$PLIST_SOURCE" ]]; then
  echo "error: missing plist template at $PLIST_SOURCE" >&2
  exit 1
fi

if [[ ! -f "$HEARTBEAT_SOURCE" ]]; then
  echo "error: missing heartbeat plist template at $HEARTBEAT_SOURCE" >&2
  exit 1
fi

cp "$PLIST_SOURCE" "$PLIST_TARGET"
cp "$HEARTBEAT_SOURCE" "$HEARTBEAT_TARGET"

launchctl bootout "gui/$(id -u)/com.markdownlink.symphony" >/dev/null 2>&1 || true
launchctl bootout "gui/$(id -u)/com.markdownlink.symphony-heartbeat" >/dev/null 2>&1 || true

launchctl bootstrap "gui/$(id -u)" "$PLIST_TARGET"
launchctl bootstrap "gui/$(id -u)" "$HEARTBEAT_TARGET"
launchctl enable "gui/$(id -u)/com.markdownlink.symphony"
launchctl enable "gui/$(id -u)/com.markdownlink.symphony-heartbeat"
launchctl kickstart -k "gui/$(id -u)/com.markdownlink.symphony"
launchctl kickstart -k "gui/$(id -u)/com.markdownlink.symphony-heartbeat"

echo "Installed launchd services:"
echo "  com.markdownlink.symphony"
echo "  com.markdownlink.symphony-heartbeat"
echo
launchctl print "gui/$(id -u)/com.markdownlink.symphony" | sed -n '1,80p'
