#!/bin/bash
# Disable GitHub Actions for ALL repos owned by nirholas
# Usage: ./scripts/disable-all-actions.sh [--dry-run]

OWNER="nirholas"
DRY_RUN=false

if [[ "$1" == "--dry-run" ]]; then
  DRY_RUN=true
  echo "🔍 DRY RUN MODE - No changes will be made"
fi

echo "📋 Fetching all repositories for $OWNER..."

# Get all repos
REPOS=$(gh repo list "$OWNER" --limit 500 --json name -q '.[].name')
TOTAL=$(echo "$REPOS" | wc -l)

echo "Found $TOTAL repositories"
echo ""

SUCCESS=0
FAILED=0
SKIPPED=0

while IFS= read -r repo; do
  [[ -z "$repo" ]] && continue
  
  if [[ "$DRY_RUN" == true ]]; then
    echo "  [DRY RUN] Would disable actions for: $OWNER/$repo"
    SUCCESS=$((SUCCESS + 1))
  else
    echo -n "  Disabling actions for $OWNER/$repo... "
    
    # Try to disable actions
    if gh api -X PUT "/repos/$OWNER/$repo/actions/permissions" \
      -f enabled=false \
      --silent 2>/dev/null; then
      echo "✅"
      SUCCESS=$((SUCCESS + 1))
    else
      echo "⚠️ Skipped"
      SKIPPED=$((SKIPPED + 1))
    fi
  fi
done <<< "$REPOS"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Summary:"
echo "   ✅ Disabled: $SUCCESS"
echo "   ⚠️  Skipped: $SKIPPED"
echo "   ❌ Failed:   $FAILED"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [[ "$DRY_RUN" == true ]]; then
  echo ""
  echo "Run without --dry-run to actually disable actions"
fi
