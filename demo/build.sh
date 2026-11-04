#!/usr/bin/env bash
# Assembles ./public from the static site and the vendored wallet kit.
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
cd "$here"
rm -rf public
cp -r site public
mkdir -p public/kit
cp kit/kit.js kit/kit.css public/kit/
[ -e node_modules ] || npm install --no-audit --no-fund
echo "Built $(find public -type f | wc -l) files into $here/public"
