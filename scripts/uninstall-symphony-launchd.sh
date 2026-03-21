#!/usr/bin/env bash
set -euo pipefail

LAUNCH_AGENTS_DIR="${LAUNCH_AGENTS_DIR:-$HOME/Library/LaunchAgents}"
PLIST_TARGET="$LAUNCH_AGENTS_DIR/com.markdownlink.symphony.plist"
HEARTBEAT_TARGET="$LAUNCH_AGENTS_DIR/com.markdownlink.symphony-heartbeat.plist"

launchctl bootout "gui/$(id -u)/com.markdownlink.symphony-heartbeat" >/dev/null 2>&1 || true
launchctl bootout "gui/$(id -u)/com.markdownlink.symphony" >/dev/null 2>&1 || true

rm -f "$PLIST_TARGET" "$HEARTBEAT_TARGET"

echo "Removed launchd services for markdown.link Symphony."
