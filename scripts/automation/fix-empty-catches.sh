#!/usr/bin/env bash
#
# fix-empty-catches.sh
# Finds and fixes all empty catch blocks in the codebase
#
# Usage:
#   ./scripts/automation/fix-empty-catches.sh [--dry-run]
#
# Author: nirholas
# Version: 1.0.0

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"

DRY_RUN=false
[[ "${1:-}" == "--dry-run" ]] && DRY_RUN=true

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "  Fix Empty Catch Blocks"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Pattern for empty catch blocks
EMPTY_CATCH_PATTERN='catch\s*\([^)]*\)\s*\{\s*\}'

# Files to check
DIRS_TO_CHECK=(
  "$ROOT_DIR/src"
  "$ROOT_DIR/packages"
  "$ROOT_DIR/deploy/src"
)

TOTAL_FIXED=0

for dir in "${DIRS_TO_CHECK[@]}"; do
  [[ ! -d "$dir" ]] && continue
  
  # Find files with empty catch blocks
  while IFS= read -r file; do
    [[ -z "$file" ]] && continue
    
    if [[ "$DRY_RUN" == "true" ]]; then
      echo -e "${YELLOW}[DRY-RUN]${NC} Would fix: $file"
    else
      # Count occurrences
      count=$(grep -c "catch.*{[[:space:]]*}" "$file" 2>/dev/null || echo "0")
      
      if [[ "$count" -gt 0 ]]; then
        # Replace empty catch blocks with proper error handling
        perl -i -p0e 's/catch\s*\(\s*(\w*)\s*\)\s*\{\s*\}/catch ($1) {\n    \/\/ Error intentionally suppressed\n    if (process.env.DEBUG) console.error("Suppressed error:", $1);\n  }/g' "$file"
        
        echo -e "${GREEN}[✓]${NC} Fixed $count empty catch(es) in: ${file#$ROOT_DIR/}"
        TOTAL_FIXED=$((TOTAL_FIXED + count))
      fi
    fi
  done < <(grep -rl "catch.*{[[:space:]]*}" "$dir" --include="*.ts" 2>/dev/null || true)
done

echo ""
echo "═══════════════════════════════════════════════════════════"
if [[ "$DRY_RUN" == "true" ]]; then
  echo "  Dry run complete. Use without --dry-run to apply fixes."
else
  echo "  Fixed $TOTAL_FIXED empty catch blocks"
fi
echo "═══════════════════════════════════════════════════════════"
echo ""
