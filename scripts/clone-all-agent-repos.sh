#!/bin/bash
# Clone MIT-licensed repos for ALL Agent Prompts
# Universal Crypto MCP - Complete Open Source Integration
# Author: nirholas (nich) - x.com/nichxbt

echo "============================================================"
echo "   Universal Crypto MCP - Complete Agent Repos Cloning     "
echo "   MIT-Licensed Repos for ALL Agent Prompts                "
echo "   Author: nich (@nirholas) - x.com/nichxbt               "
echo "============================================================"
echo ""

VENDOR_DIR="/workspaces/universal-crypto-mcp/vendor"
mkdir -p "$VENDOR_DIR"

# ============================================================
# COMPLETE MIT REPO MAPPING BY AGENT PROMPT
# ============================================================
#
# AGENT 3 (Marketplace): UI components, service discovery
# AGENT 4 (Wallet): wagmi, rainbowkit, wallet-adapter, safe-sdk
# AGENT 5 (Analytics): recharts, lightweight-charts, tremor
# AGENT 6 (Playground): react-flow, monaco, json-schema-form
# AGENT 9 (API Routes): trpc, hono, openapi
# AGENT 10 (Payment/x402): x402 protocol libs
# AGENT 11 (WebSocket): socket.io, ws, ioredis
# AGENT 12 (Auth): siwe, next-auth, iron-session
# AGENT 13 (Database): prisma, drizzle, kysely
# AGENT 14 (Smart Contracts): wagmi, viem, ethers
# AGENT 15 (State): zustand, jotai, tanstack-query
# AGENT 16 (Testing): vitest, playwright, msw
# AGENT 17 (DevOps): docker configs
# AGENT 18 (Documentation): docusaurus, nextra, mintlify
# AGENT 19 (AI Agents): langchain, eliza, crewai, autogpt
# AGENT 20 (Novel): agent wallets, tenderly

declare -A REPOS=(
  # ============================================================
  # AGENT 3: MARKETPLACE (Service Discovery, UI Components)
  # ============================================================
  ["shadcn-ui"]="shadcn-ui/ui|Beautifully designed components|MIT"
  ["radix-ui"]="radix-ui/primitives|Unstyled accessible components|MIT"
  
  # ============================================================
  # AGENT 4: WALLET (Already have: rainbowkit, safe-core-sdk, siwe)
  # ============================================================
  ["wagmi"]="wevm/wagmi|React Hooks for Ethereum|MIT"
  ["viem"]="wevm/viem|TypeScript Ethereum library|MIT"
  ["solana-wallet-adapter"]="anza-xyz/wallet-adapter|Solana wallet adapter|Apache-2.0"
  ["web3modal"]="WalletConnect/web3modal|Web3 modal SDK|Apache-2.0"
  ["connectkit"]="family/connectkit|Wallet connection kit|MIT"
  
  # ============================================================
  # AGENT 5: ANALYTICS (Charts, Data Visualization)
  # ============================================================
  ["recharts"]="recharts/recharts|React charting library|MIT"
  ["lightweight-charts"]="niconiahi/lightweight-charts-react-wrapper|TradingView charts|MIT"
  ["tremor"]="tremorlabs/tremor|React dashboard components|Apache-2.0"
  ["nivo"]="plouc/nivo|Data visualization components|MIT"
  
  # ============================================================
  # AGENT 6: PLAYGROUND (Workflow Builder, Code Editor)
  # ============================================================
  ["reactflow"]="xyflow/xyflow|Workflow/node-based UI|MIT"
  ["monaco-react"]="suren-atoyan/monaco-react|Monaco editor for React|MIT"
  ["json-schema-form"]="rjsf-team/react-jsonschema-form|JSON Schema forms|Apache-2.0"
  ["codemirror"]="codemirror/dev|Code editor|MIT"
  
  # ============================================================
  # AGENT 9: API ROUTES (API Framework, Validation)
  # ============================================================
  ["trpc"]="trpc/trpc|End-to-end typesafe APIs|MIT"
  ["hono"]="honojs/hono|Ultrafast web framework|MIT"
  ["zod"]="colinhacks/zod|TypeScript schema validation|MIT"
  ["openapi-typescript"]="drwpow/openapi-typescript|OpenAPI TypeScript|MIT"
  
  # ============================================================
  # AGENT 10: PAYMENT GATEWAY (x402, Crypto Payments)
  # ============================================================
  ["stripe-node"]="stripe/stripe-node|Stripe API for Node|MIT"
  ["coinbase-sdk"]="coinbase/coinbase-sdk-nodejs|Coinbase SDK|Apache-2.0"
  
  # ============================================================
  # AGENT 11: WEBSOCKET (Real-time Communication)
  # ============================================================
  ["socket.io"]="socketio/socket.io|Real-time engine|MIT"
  ["ws"]="websockets/ws|WebSocket library|MIT"
  ["ioredis"]="redis/ioredis|Redis client|MIT"
  ["pusher-js"]="pusher/pusher-js|Pusher client|MIT"
  
  # ============================================================
  # AGENT 12: AUTH & SECURITY (Already have: siwe)
  # ============================================================
  ["next-auth"]="nextauthjs/next-auth|Authentication for Next.js|ISC"
  ["iron-session"]="vvo/iron-session|Secure session management|MIT"
  ["jose"]="panva/jose|JWT/JWE/JWS library|MIT"
  ["passport"]="jaredhanson/passport|Authentication middleware|MIT"
  
  # ============================================================
  # AGENT 13: DATABASE (ORM, Query Builders)
  # ============================================================
  ["prisma"]="prisma/prisma|Next-gen ORM|Apache-2.0"
  ["drizzle-orm"]="drizzle-team/drizzle-orm|TypeScript ORM|Apache-2.0"
  ["kysely"]="kysely-org/kysely|Type-safe SQL builder|MIT"
  
  # ============================================================
  # AGENT 14: SMART CONTRACTS (Already have via viem/wagmi)
  # ============================================================
  ["abitype"]="wevm/abitype|ABI TypeScript utilities|MIT"
  ["foundry"]="foundry-rs/foundry|Smart contract toolchain|Apache-2.0"
  
  # ============================================================
  # AGENT 15: STATE MANAGEMENT
  # ============================================================
  ["zustand"]="pmndrs/zustand|Bear state management|MIT"
  ["jotai"]="pmndrs/jotai|Primitive atomic state|MIT"
  ["tanstack-query"]="TanStack/query|Async state management|MIT"
  ["immer"]="immerjs/immer|Immutable state|MIT"
  
  # ============================================================
  # AGENT 16: TESTING
  # ============================================================
  ["vitest"]="vitest-dev/vitest|Blazing fast test runner|MIT"
  ["playwright"]="microsoft/playwright|Browser automation|Apache-2.0"
  ["msw"]="mswjs/msw|API mocking library|MIT"
  ["testing-library"]="testing-library/react-testing-library|React testing utils|MIT"
  
  # ============================================================
  # AGENT 17: DEVOPS (Docker, CI/CD)
  # ============================================================
  ["docker-node"]="nodejs/docker-node|Node.js Docker images|MIT"
  
  # ============================================================
  # AGENT 18: DOCUMENTATION
  # ============================================================
  ["docusaurus"]="facebook/docusaurus|Documentation framework|MIT"
  ["nextra"]="shuding/nextra|Next.js docs framework|MIT"
  ["fumadocs"]="fuma-nama/fumadocs|Next.js docs framework|MIT"
  ["typedoc"]="TypeStrong/typedoc|TypeScript documentation|Apache-2.0"
  
  # ============================================================
  # AGENT 19: AI AGENTS (Already have: langchain, eliza, crewai, zerepy)
  # ============================================================
  ["autogpt"]="Significant-Gravitas/AutoGPT|Autonomous AI agent|MIT"
  ["babyagi"]="yoheinakajima/babyagi|Task-driven AI|MIT"
  ["phidata"]="phidatahq/phidata|AI assistants|MPL-2.0"
  ["mem0"]="mem0ai/mem0|Memory for AI|Apache-2.0"
  ["goat"]="goat-sdk/goat|Web3 AI toolkit|MIT"
  ["coinbase-agentkit"]="coinbase/agentkit|Coinbase AI agents|Apache-2.0"
  ["openai-agents"]="openai/openai-agents-python|OpenAI agents SDK|MIT"
  ["anthropic-sdk"]="anthropics/anthropic-sdk-typescript|Anthropic SDK|MIT"
  
  # ============================================================
  # AGENT 20: NOVEL PRIMITIVES (Agent Wallets, Simulation)
  # ============================================================
  ["tenderly-sdk"]="Tenderly/tenderly-sdk|Transaction simulation|MIT"
  ["permit2"]="Uniswap/permit2|Token approvals|MIT"
  ["aa-sdk"]="alchemyplatform/aa-sdk|Account abstraction|MIT"
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

## Usage in UCM

This package is used as a vendor dependency for building enterprise-grade 
cryptocurrency infrastructure. All original copyrights and licenses are preserved.

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
  echo "    License: $LICENSE"
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

echo ""
echo "============================================================"
echo "                    INTEGRATION SUMMARY                     "
echo "============================================================"
echo "  ✅ Successfully cloned: $SUCCESS"
echo "  ⏭️  Skipped (existing):  $SKIPPED"
echo "  ❌ Failed:              $FAILED"
echo "============================================================"
echo ""
echo "📋 Repos by Agent Prompt:"
echo ""
echo "  AGENT 3 (Marketplace):    shadcn-ui, radix-ui"
echo "  AGENT 4 (Wallet):         wagmi, viem, wallet-adapter, web3modal, connectkit"
echo "  AGENT 5 (Analytics):      recharts, lightweight-charts, tremor, nivo"
echo "  AGENT 6 (Playground):     reactflow, monaco-react, json-schema-form, codemirror"
echo "  AGENT 9 (API Routes):     trpc, hono, zod, openapi-typescript"
echo "  AGENT 10 (Payments):      stripe-node, coinbase-sdk"
echo "  AGENT 11 (WebSocket):     socket.io, ws, ioredis, pusher-js"
echo "  AGENT 12 (Auth):          next-auth, iron-session, jose, passport"
echo "  AGENT 13 (Database):      prisma, drizzle-orm, kysely"
echo "  AGENT 14 (Contracts):     abitype, foundry"
echo "  AGENT 15 (State):         zustand, jotai, tanstack-query, immer"
echo "  AGENT 16 (Testing):       vitest, playwright, msw, testing-library"
echo "  AGENT 17 (DevOps):        docker-node"
echo "  AGENT 18 (Docs):          docusaurus, nextra, fumadocs, typedoc"
echo "  AGENT 19 (AI Agents):     autogpt, babyagi, phidata, mem0, goat, etc."
echo "  AGENT 20 (Novel):         tenderly-sdk, permit2, aa-sdk"
echo ""
echo "============================================================"
echo "Total vendor integrations provide foundation for:"
echo "  - 16 Agent Prompts"
echo "  - 50+ MIT/Apache-2.0 licensed repos"
echo "  - Complete Web3/AI infrastructure"
echo "============================================================"
