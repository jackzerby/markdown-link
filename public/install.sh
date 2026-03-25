#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${MDSHARE_BASE_URL:-${MARKDOWN_LINK_BASE_URL:-https://mdshare.link}}"
INSTALL_DIR="${MDSHARE_INSTALL_DIR:-${MARKDOWN_LINK_INSTALL_DIR:-$HOME/.local/bin}}"
TARGET="$INSTALL_DIR/mdshare"
LEGACY_TARGET="$INSTALL_DIR/markdown.link"

command -v node >/dev/null 2>&1 || {
  echo "error: node is required" >&2
  exit 1
}

mkdir -p "$INSTALL_DIR"

echo "downloading mdshare cli..."
curl -fsSL "$BASE_URL/cli/mdshare.js" -o "$TARGET"
chmod 755 "$TARGET"
ln -sf "mdshare" "$LEGACY_TARGET"

if [[ ! ":$PATH:" == *":$INSTALL_DIR:"* ]]; then
  cat <<EOF
installed mdshare to $TARGET
add $INSTALL_DIR to your PATH to use it directly:

  export PATH="$INSTALL_DIR:\$PATH"
EOF
else
  echo "installed mdshare to $TARGET"
fi
