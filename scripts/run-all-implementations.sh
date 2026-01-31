#!/bin/bash
#
# Master Implementation Script
#
# Runs all vendor extraction and implementation generation scripts.
#
# Usage: ./scripts/run-all-implementations.sh [--dry-run]
#

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

DRY_RUN=""
if [[ "$1" == "--dry-run" ]]; then
  DRY_RUN="--dry-run"
  echo "🔍 DRY RUN MODE"
fi

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Universal Crypto MCP - Implementation Generator           ║"
echo "╠════════════════════════════════════════════════════════════╣"
echo "║                                                            ║"
echo "║  This script generates implementations from vendor repos   ║"
echo "║                                                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Check prerequisites
if [[ ! -d "$ROOT_DIR/vendor" ]]; then
  echo "❌ Error: vendor/ directory not found!"
  echo ""
  echo "Run these scripts first:"
  echo "  ./scripts/clone-all-agent-repos.sh"
  echo "  ./scripts/restructure-vendor.sh"
  echo ""
  exit 1
fi

VENDOR_COUNT=$(find "$ROOT_DIR/vendor" -mindepth 2 -maxdepth 2 -type d 2>/dev/null | wc -l)
echo "📦 Found $VENDOR_COUNT vendor repos"
echo ""

# Step 1: Generate basic scaffolding
echo "═══════════════════════════════════════════════════════════"
echo "Step 1: Generate Implementation Scaffolding"
echo "═══════════════════════════════════════════════════════════"
bash "$SCRIPT_DIR/generate-implementations.sh" $DRY_RUN

# Step 2: Extract vendor code patterns
echo ""
echo "═══════════════════════════════════════════════════════════"
echo "Step 2: Extract Vendor Code Patterns"  
echo "═══════════════════════════════════════════════════════════"
bash "$SCRIPT_DIR/extract-vendor-code.sh" all

# Step 3: Run complete implementation generator
echo ""
echo "═══════════════════════════════════════════════════════════"
echo "Step 3: Complete Implementation Generator"
echo "═══════════════════════════════════════════════════════════"
node "$SCRIPT_DIR/complete-implementation.mjs" $DRY_RUN

# Summary
echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║  ✅ Implementation Generation Complete!                    ║"
echo "╠════════════════════════════════════════════════════════════╣"
echo "║                                                            ║"
echo "║  Generated files are in packages/*/src/vendors/            ║"
echo "║                                                            ║"
echo "║  Each file contains:                                       ║"
echo "║  - Extracted interfaces and types from vendor repos        ║"
echo "║  - Function stubs matching expected exports                ║"
echo "║  - TODOs pointing to reference implementations             ║"
echo "║                                                            ║"
echo "║  Next steps:                                               ║"
echo "║  1. Review generated files                                 ║"
echo "║  2. Copy/adapt code from vendor/ references                ║"
echo "║  3. Run: pnpm build                                        ║"
echo "║  4. Run: pnpm test                                         ║"
echo "║                                                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
