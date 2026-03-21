#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${MARKDOWN_LINK_BASE_URL:-https://markdown.link}"
INSTALL_DIR="${MARKDOWN_LINK_INSTALL_DIR:-$HOME/.local/bin}"
TARGET="$INSTALL_DIR/markdown.link"

command -v node >/dev/null 2>&1 || {
  echo "error: node is required" >&2
  exit 1
}

mkdir -p "$INSTALL_DIR"

echo "downloading markdown.link cli..."
curl -fsSL "$BASE_URL/cli/markdown.link.js" -o "$TARGET"
chmod 755 "$TARGET"

if [[ ! ":$PATH:" == *":$INSTALL_DIR:"* ]]; then
  cat <<EOF
installed markdown.link to $TARGET
add $INSTALL_DIR to your PATH to use it directly:

  export PATH="\$HOME/.local/bin:\$PATH"
EOF
else
  echo "installed markdown.link to $TARGET"
fi
