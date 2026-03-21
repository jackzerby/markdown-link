#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SOURCE="$SCRIPT_DIR/../cli/markdown.link.js"
INSTALL_DIR="${MARKDOWN_LINK_INSTALL_DIR:-$HOME/.local/bin}"
TARGET="$INSTALL_DIR/markdown.link"

command -v node >/dev/null 2>&1 || {
  echo "error: node is required" >&2
  exit 1
}

mkdir -p "$INSTALL_DIR"
cp "$SOURCE" "$TARGET"
chmod 755 "$TARGET"

if [[ ! ":$PATH:" == *":$INSTALL_DIR:"* ]]; then
  cat <<EOF
installed markdown.link to $TARGET
add $INSTALL_DIR to your PATH to use it directly
EOF
else
  echo "installed markdown.link to $TARGET"
fi
