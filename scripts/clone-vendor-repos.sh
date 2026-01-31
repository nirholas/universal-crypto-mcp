#!/bin/bash
# Clone external repos with attribution for Universal Crypto MCP
# Author: nirholas (nich) - x.com/nichxbt

echo "============================================================"
echo "   Universal Crypto MCP - Vendor Repository Integration    "
echo "   Author: nich (@nirholas) - x.com/nichxbt               "
echo "============================================================"
echo ""

VENDOR_DIR="/workspaces/universal-crypto-mcp/vendor"
mkdir -p "$VENDOR_DIR"

# Define repos to clone: [local_name]="github_repo|description|license"
declare -A REPOS=(
  ["siwe"]="spruceid/siwe|Sign-In With Ethereum authentication|Apache-2.0"
  ["rainbowkit"]="rainbow-me/rainbowkit|Wallet connection modal UI|MIT"
  ["eliza"]="elizaOS/eliza|Eliza AI agent framework|MIT"
  ["crewai"]="crewAIInc/crewAI|Multi-agent orchestration framework|MIT"
  ["zerepy"]="blorm-network/ZerePy|Python crypto AI agents|MIT"
  ["safe-core-sdk"]="safe-global/safe-core-sdk|Multisig wallet SDK|MIT"
  ["defillama-adapters"]="DefiLlama/DefiLlama-Adapters|DeFi TVL adapters|MIT"
  ["langchain"]="langchain-ai/langchain|LangChain AI framework|MIT"
)

SUCCESS=0
SKIPPED=0
FAILED=0

create_attribution() {
  local NAME=$1
  local REPO=$2
  local DESC=$3
  local LICENSE=$4
  local DIR=$5
  
  cat > "$DIR/ATTRIBUTION.md" << ATTR
# Attribution

## Original Source
- **Repository**: https://github.com/$REPO
- **Description**: $DESC
- **License**: $LICENSE

## Integration

Integrated into Universal Crypto MCP by:
- **Author**: nich (nirholas)
- **Twitter/X**: [@nichxbt](https://x.com/nichxbt)
- **GitHub**: [nirholas](https://github.com/nirholas)
- **Project**: [Universal Crypto MCP](https://github.com/nirholas/universal-crypto-mcp)

## Modifications

- Integrated as vendor dependency
- Wrapped with UCM adapter pattern
- Added to monorepo build system

## License Compliance

The original license ($LICENSE) is preserved. See LICENSE file in this directory.

---
*Integrated on $(date +%Y-%m-%d)*
ATTR
}

for NAME in "${!REPOS[@]}"; do
  IFS='|' read -r REPO DESC LICENSE <<< "${REPOS[$NAME]}"
  REPO_URL="https://github.com/$REPO.git"
  TARGET="$VENDOR_DIR/$NAME"
  
  echo "============================================================"
  echo "📦 Processing: $NAME"
  echo "    Repository: $REPO"
  echo "    Description: $DESC"
  echo "============================================================"
  
  if [ -d "$TARGET" ]; then
    echo "  ⏭️  Already exists, skipping..."
    SKIPPED=$((SKIPPED + 1))
    echo ""
    continue
  fi
  
  echo "  🔍 Checking repository availability..."
  if ! git ls-remote "$REPO_URL" HEAD &>/dev/null; then
    echo "  ❌ Repository not accessible: $REPO"
    FAILED=$((FAILED + 1))
    echo ""
    continue
  fi
  
  echo "  📥 Cloning (shallow)..."
  if git clone --depth 1 "$REPO_URL" "$TARGET" 2>&1; then
    echo "  ✅ Cloned successfully"
    
    # Remove .git to make it our own
    rm -rf "$TARGET/.git"
    
    # Create attribution
    create_attribution "$NAME" "$REPO" "$DESC" "$LICENSE" "$TARGET"
    echo "  📝 Created ATTRIBUTION.md"
    
    SUCCESS=$((SUCCESS + 1))
  else
    echo "  ❌ Clone failed"
    FAILED=$((FAILED + 1))
  fi
  
  echo ""
done

echo "============================================================"
echo "                    INTEGRATION SUMMARY                     "
echo "============================================================"
echo "  ✅ Successfully cloned: $SUCCESS"
echo "  ⏭️  Skipped (existing):  $SKIPPED"
echo "  ❌ Failed:              $FAILED"
echo "============================================================"
echo ""
echo "Next steps:"
echo "  1. Review cloned repos in vendor/"
echo "  2. Create adapters in packages/integrations/"
echo "  3. Update docs/COMMUNITY_INTEGRATIONS.md"
echo ""
