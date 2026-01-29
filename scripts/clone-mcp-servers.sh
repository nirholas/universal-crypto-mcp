#!/bin/bash
# Clone and integrate MCP servers
# Author: nirholas (nich) - x.com/nichxbt

set -e

echo "============================================================"
echo "   Universal Crypto MCP - External Server Integration      "
echo "   Author: nich (@nirholas)                                "
echo "   x.com/nichxbt                                           "
echo "============================================================"
echo ""

TARGET_DIR="packages/integrations/external-mcp"
mkdir -p "$TARGET_DIR"

cd "$TARGET_DIR"

# List of repos to clone (these are examples, actual repos may not exist)
declare -A REPOS=(
  ["solana-agent-kit"]="sendaifun/solana-agent-kit"
  ["crypto-price-oracle"]="crypto-oracle/mcp-server"
  ["defillama-mcp"]="DefiLlama/mcp-server"
  ["coingecko-enhanced-mcp"]="coingecko/mcp-enhanced"
  ["dune-analytics-mcp"]="duneanalytics/dune-mcp"
  ["nansen-mcp"]="nansen-ai/nansen-mcp"
  ["arkham-intelligence-mcp"]="arkham-intel/mcp-server"
  ["etherscan-advanced-mcp"]="etherscan-io/mcp-advanced"
  ["polygonscan-mcp"]="polygonscan/mcp-server"
  ["bscscan-mcp"]="bscscan-com/mcp-server"
  ["arbitrum-scan-mcp"]="arbiscan-io/mcp-server"
  ["optimism-scan-mcp"]="optimistic-explorer/mcp-server"
  ["base-scan-mcp"]="basescan-org/mcp-server"
  ["avalanche-explorer-mcp"]="avalanche/explorer-mcp"
  ["cosmos-hub-mcp"]="cosmos/cosmos-mcp"
  ["near-protocol-mcp"]="near/near-mcp-server"
  ["aptos-mcp"]="aptos-labs/aptos-mcp"
  ["sui-network-mcp"]="mystenlabs/sui-mcp"
  ["polkadot-mcp"]="paritytech/polkadot-mcp"
  ["cardano-mcp"]="cardano-foundation/cardano-mcp"
)

SUCCESS=0
SKIPPED=0
FAILED=0

for NAME in "${!REPOS[@]}"; do
  REPO="${REPOS[$NAME]}"
  REPO_URL="https://github.com/$REPO.git"
  
  echo "============================================================"
  echo "📦 Processing: $NAME (Rank: ?)"
  echo "    Repository: $REPO"
  echo "============================================================"
  
  if [ -d "$NAME" ]; then
    echo "  ⚠️  Already exists, skipping..."
    ((SKIPPED++))
    echo ""
    continue
  fi
  
  echo "  Checking if repository exists..."
  if ! git ls-remote "$REPO_URL" &>/dev/null; then
    echo "  ⚠️  Repository not found: $REPO"
    ((FAILED++))
    echo ""
    continue
  fi
  
  echo "  Cloning repository..."
  if git clone --depth 1 "$REPO_URL" "$NAME" &>/dev/null; then
    echo "  ✅ Cloned successfully"
    
    # Remove .git to make it our own
    rm -rf "$NAME/.git"
    
    # Create ATTRIBUTION.md
    cat > "$NAME/ATTRIBUTION.md" << EOF
# Attribution

This MCP server was originally from: $REPO
Original Repository: https://github.com/$REPO

## Integration and Modifications

Integrated into Universal Crypto MCP by:
- **Author**: nich (nirholas)
- **Twitter/X**: x.com/nichxbt
- **GitHub**: github.com/nirholas
- **Repository**: https://github.com/nirholas/universal-crypto-mcp

## Modifications

- Rebranded for Universal Crypto MCP
- Integrated with unified tooling
- Restructured for monorepo architecture

---

*Maintained as part of the Universal Crypto MCP project*
*For issues and contributions, visit: https://github.com/nirholas/universal-crypto-mcp*
EOF
    
    # Update package.json if it exists
    if [ -f "$NAME/package.json" ]; then
      echo "  Updating package.json..."
      # Add nirholas scope and update author
      sed -i 's/"name":\s*"/"name": "@nirholas\//' "$NAME/package.json" 2>/dev/null || true
      sed -i 's/"author":\s*"[^"]*"/"author": "nich <nich@nichxbt.com>"/' "$NAME/package.json" 2>/dev/null || true
    fi
    
    # Add header to README if it exists
    if [ -f "$NAME/README.md" ]; then
      echo "  Updating README.md..."
      HEADER="> **Part of [Universal Crypto MCP](https://github.com/nirholas/universal-crypto-mcp)**  
> By [nich](https://x.com/nichxbt)  
> See [ATTRIBUTION.md](./ATTRIBUTION.md) for original source

---

"
      echo "$HEADER$(cat $NAME/README.md)" > "$NAME/README.md.tmp"
      mv "$NAME/README.md.tmp" "$NAME/README.md"
    fi
    
    ((SUCCESS++))
    echo "  ✅ Successfully integrated!"
  else
    echo "  ❌ Failed to clone"
    ((FAILED++))
  fi
  
  echo ""
done

echo "============================================================"
echo "📊 Integration Summary"
echo "============================================================"
echo "✅ Successfully integrated: $SUCCESS"
echo "⚠️  Skipped (already exists): $SKIPPED"
echo "❌ Failed: $FAILED"
echo "============================================================"
echo ""

if [ $SUCCESS -gt 0 ]; then
  echo "🎉 Integration complete!"
  echo ""
  echo "Next steps:"
  echo "  1. Review integrated servers: cd packages/integrations/external-mcp"
  echo "  2. Run: pnpm install"
  echo "  3. Commit changes"
  echo ""
fi
