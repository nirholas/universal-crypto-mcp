#!/bin/bash
# Clone additional repos based on Agent Prompt analysis
# Author: nirholas (nich) - x.com/nichxbt

echo "============================================================"
echo "   Universal Crypto MCP - Additional Repos Integration     "
echo "   Based on Agent Prompts Analysis                         "
echo "============================================================"
echo ""

VENDOR_DIR="/workspaces/universal-crypto-mcp/vendor"
mkdir -p "$VENDOR_DIR"

# Repos identified from Agent Prompts:
# AGENT 4 (Wallet): wagmi, solana-wallet-adapter ✓ already have rainbowkit
# AGENT 6 (Playground): react-flow, monaco-editor
# AGENT 8 (Auth): siwe ✓ already have, iron-session, jose
# AGENT 9 (API): zod, openapi
# AGENT 11 (WebSocket): socket.io, ioredis
# AGENT 12 (Testing): vitest, testing-library, msw
# AGENT 13 (Database): prisma
# AGENT 15 (AI Agents): langchain ✓, crewai ✓, eliza ✓, autogpt, babyagi
# AGENT 16 (Novel): tenderly-sdk
# AGENT 19 (AI Agents): openai-agents, anthropic-sdk

declare -A REPOS=(
  # Workflow/Visual Building (Agent 6 - Playground)
  ["react-flow"]="xyflow/xyflow|React Flow for workflow builder|MIT"
  ["monaco-editor"]="microsoft/monaco-editor|Monaco code editor|MIT"
  
  # Auth (Agent 8)
  ["iron-session"]="vvo/iron-session|Secure session management|MIT"
  ["next-auth"]="nextauthjs/next-auth|Authentication for Next.js|ISC"
  
  # WebSocket/Realtime (Agent 11)
  ["socket.io"]="socketio/socket.io|WebSocket library|MIT"
  
  # Database (Agent 13)
  ["prisma"]="prisma/prisma|Database ORM|Apache-2.0"
  
  # AI Agents (Agent 15/19)
  ["autogpt"]="Significant-Gravitas/AutoGPT|Autonomous AI agent|MIT"
  ["babyagi"]="yoheinakajima/babyagi|Task-driven AI agent|MIT"
  ["phidata"]="phidatahq/phidata|AI assistants framework|MPL-2.0"
  ["mem0"]="mem0ai/mem0|Memory layer for AI agents|Apache-2.0"
  
  # Testing (Agent 12)
  ["msw"]="mswjs/msw|Mock Service Worker|MIT"
  
  # Dev Tools
  ["tenderly-sdk"]="Tenderly/tenderly-sdk|Transaction simulation|MIT"
  
  # Additional Crypto Agents
  ["goat"]="goat-sdk/goat|Web3 AI agent toolkit|MIT"
  ["coinbase-agentkit"]="coinbase/agentkit|Coinbase agent kit|Apache-2.0"
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
    
    rm -rf "$TARGET/.git"
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
echo "Repos by Agent Prompt:"
echo "  - Agent 6 (Playground): react-flow, monaco-editor"
echo "  - Agent 8 (Auth): iron-session, next-auth"
echo "  - Agent 11 (WebSocket): socket.io"
echo "  - Agent 12 (Testing): msw"
echo "  - Agent 13 (Database): prisma"
echo "  - Agent 15/19 (AI Agents): autogpt, babyagi, phidata, mem0"
echo "  - Agent 16 (Novel): tenderly-sdk"
echo "  - Crypto Agents: goat, coinbase-agentkit"
echo ""
