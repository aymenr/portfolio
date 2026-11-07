#!/bin/sh
# Rebuilds Design Mode in its own repo and copies the browser build into this project.
set -e
REPO="${DESIGN_MODE_REPO:-$HOME/Documents/apps/design-mode}"
HERE="$(cd "$(dirname "$0")" && pwd)"
(cd "$REPO" && npm run build --silent)
# Wrapped in its own function so its variable names can't clash with the page's scripts
# (it loads as a plain script, which shares names with them, so it also works on file:// pages).
{ printf '(() => {\n'; cat "$REPO/site/design-mode.js"; printf '\n})();\n'; } > "$HERE/design-mode.js"
echo "Design Mode updated from $REPO"
# Our copy has a wider panel (300px -> 460px) so the Site tab sliders have room; reapply after a rebuild.
sed -i.bak "s/\.panel { position: fixed; width: 300px;/.panel { position: fixed; width: 460px;/" "$HERE/design-mode.js" && rm -f "$HERE/design-mode.js.bak"
