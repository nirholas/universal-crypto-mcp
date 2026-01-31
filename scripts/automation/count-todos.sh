#!/usr/bin/env bash
#
# count-todos.sh
# Counts remaining TODOs in the codebase
#
# Usage:
#   ./scripts/automation/count-todos.sh
#
# Author: nirholas

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "  TODO/FIXME Counter"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Count different patterns
TODO_COUNT=$(grep -r "// TODO" "$ROOT_DIR/src" "$ROOT_DIR/packages" "$ROOT_DIR/deploy/src" --include="*.ts" 2>/dev/null | wc -l || echo "0")
FIXME_COUNT=$(grep -r "// FIXME" "$ROOT_DIR/src" "$ROOT_DIR/packages" "$ROOT_DIR/deploy/src" --include="*.ts" 2>/dev/null | wc -l || echo "0")
HACK_COUNT=$(grep -r "// HACK" "$ROOT_DIR/src" "$ROOT_DIR/packages" "$ROOT_DIR/deploy/src" --include="*.ts" 2>/dev/null | wc -l || echo "0")
EMPTY_CATCH=$(grep -r "catch.*{[[:space:]]*}" "$ROOT_DIR/src" "$ROOT_DIR/packages" "$ROOT_DIR/deploy/src" --include="*.ts" 2>/dev/null | wc -l || echo "0")
CONSOLE_LOG=$(grep -r "console\.log" "$ROOT_DIR/src" "$ROOT_DIR/deploy/src" --include="*.ts" 2>/dev/null | wc -l || echo "0")
IT_TODO=$(grep -r "it\.todo" "$ROOT_DIR" --include="*.test.ts" --include="*.spec.ts" 2>/dev/null | wc -l || echo "0")
IT_SKIP=$(grep -r "it\.skip\|describe\.skip" "$ROOT_DIR" --include="*.test.ts" --include="*.spec.ts" 2>/dev/null | wc -l || echo "0")

echo "┌─────────────────────────────┬─────────┐"
echo "│ Category                    │ Count   │"
echo "├─────────────────────────────┼─────────┤"
printf "│ %-27s │ %7s │\n" "TODO comments" "$TODO_COUNT"
printf "│ %-27s │ %7s │\n" "FIXME comments" "$FIXME_COUNT"
printf "│ %-27s │ %7s │\n" "HACK comments" "$HACK_COUNT"
printf "│ %-27s │ %7s │\n" "Empty catch blocks" "$EMPTY_CATCH"
printf "│ %-27s │ %7s │\n" "Console.log statements" "$CONSOLE_LOG"
printf "│ %-27s │ %7s │\n" "Pending tests (it.todo)" "$IT_TODO"
printf "│ %-27s │ %7s │\n" "Skipped tests" "$IT_SKIP"
echo "└─────────────────────────────┴─────────┘"

TOTAL=$((TODO_COUNT + FIXME_COUNT + HACK_COUNT + EMPTY_CATCH + IT_TODO))
echo ""
echo "Total actionable items: $TOTAL"
echo ""

# Show high-priority TODOs
echo "─────────────────────────────────────────────────────────────"
echo "High Priority TODOs (security/deployment):"
echo "─────────────────────────────────────────────────────────────"
grep -rn "// TODO.*[Vv]erify\|// TODO.*[Dd]eploy\|// TODO.*[Ss]ecur\|// TODO.*[Rr]efund" \
  "$ROOT_DIR/src" "$ROOT_DIR/packages" "$ROOT_DIR/deploy/src" \
  --include="*.ts" 2>/dev/null | head -10 || echo "None found"
echo ""
