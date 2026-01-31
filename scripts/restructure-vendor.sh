#!/bin/bash
# Restructure vendor folder by function/category
# Preserves all ATTRIBUTION.md files and licenses
# Author: nirholas (nich) - x.com/nichxbt

set -e

VENDOR_DIR="/workspaces/universal-crypto-mcp/vendor"
NEW_VENDOR_DIR="/workspaces/universal-crypto-mcp/vendor-new"

echo "============================================================"
echo "   Restructuring Vendor by Function (Enterprise Layout)    "
echo "   All credits and licenses preserved                      "
echo "============================================================"
echo ""

# Create new category structure
mkdir -p "$NEW_VENDOR_DIR"/{wallet,ui,charts,editor,workflow,forms,api,auth,database,state,realtime,testing,docs,ai-agents,contracts,payments,simulation,account-abstraction,defi,devops}

# Function to move with metadata preservation
move_repo() {
  local src="$1"
  local dest_category="$2"
  local new_name="$3"
  
  if [ -d "$VENDOR_DIR/$src" ]; then
    echo "  📦 Moving $src → $dest_category/$new_name"
    cp -r "$VENDOR_DIR/$src" "$NEW_VENDOR_DIR/$dest_category/$new_name"
  else
    echo "  ⚠️  Not found: $src"
  fi
}

echo "🔄 Reorganizing by category..."
echo ""

# ============================================================
# WALLET - Web3 wallet connection & management
# ============================================================
echo "📁 wallet/"
move_repo "wagmi" "wallet" "evm-hooks"
move_repo "viem" "wallet" "evm-client"
move_repo "rainbowkit" "wallet" "connect-modal"
move_repo "connectkit" "wallet" "connect-kit"
move_repo "web3modal" "wallet" "wallet-connect"
move_repo "solana-wallet-adapter" "wallet" "solana-adapter"
move_repo "safe-core-sdk" "wallet" "multisig-sdk"
move_repo "siwe" "wallet" "sign-in-ethereum"
echo ""

# ============================================================
# UI - Component libraries
# ============================================================
echo "📁 ui/"
move_repo "shadcn-ui" "ui" "components"
move_repo "radix-ui" "ui" "primitives"
move_repo "tremor" "ui" "dashboard"
echo ""

# ============================================================
# CHARTS - Data visualization
# ============================================================
echo "📁 charts/"
move_repo "recharts" "charts" "react-charts"
move_repo "nivo" "charts" "visualization"
echo ""

# ============================================================
# EDITOR - Code/text editors
# ============================================================
echo "📁 editor/"
move_repo "monaco-react" "editor" "monaco"
move_repo "monaco-editor" "editor" "monaco-core"
move_repo "codemirror" "editor" "codemirror"
echo ""

# ============================================================
# WORKFLOW - Visual workflow builders
# ============================================================
echo "📁 workflow/"
move_repo "reactflow" "workflow" "node-editor"
move_repo "react-flow" "workflow" "flow-builder"
echo ""

# ============================================================
# FORMS - Form handling & validation
# ============================================================
echo "📁 forms/"
move_repo "json-schema-form" "forms" "schema-form"
move_repo "zod" "forms" "validation"
echo ""

# ============================================================
# API - API frameworks & tooling
# ============================================================
echo "📁 api/"
move_repo "trpc" "api" "typesafe-rpc"
move_repo "hono" "api" "edge-framework"
move_repo "openapi-typescript" "api" "openapi-types"
echo ""

# ============================================================
# AUTH - Authentication & authorization
# ============================================================
echo "📁 auth/"
move_repo "next-auth" "auth" "nextjs-auth"
move_repo "iron-session" "auth" "session-manager"
move_repo "jose" "auth" "jwt-library"
move_repo "passport" "auth" "middleware"
echo ""

# ============================================================
# DATABASE - ORM & query builders
# ============================================================
echo "📁 database/"
move_repo "prisma" "database" "orm-prisma"
move_repo "drizzle-orm" "database" "orm-drizzle"
move_repo "kysely" "database" "query-builder"
echo ""

# ============================================================
# STATE - State management
# ============================================================
echo "📁 state/"
move_repo "zustand" "state" "store"
move_repo "jotai" "state" "atomic"
move_repo "tanstack-query" "state" "async-state"
move_repo "immer" "state" "immutable"
echo ""

# ============================================================
# REALTIME - WebSocket & real-time communication
# ============================================================
echo "📁 realtime/"
move_repo "socket.io" "realtime" "websocket-engine"
move_repo "ws" "realtime" "websocket-core"
move_repo "ioredis" "realtime" "redis-client"
move_repo "pusher-js" "realtime" "pusher-client"
echo ""

# ============================================================
# TESTING - Test frameworks & utilities
# ============================================================
echo "📁 testing/"
move_repo "vitest" "testing" "test-runner"
move_repo "playwright" "testing" "e2e-browser"
move_repo "msw" "testing" "api-mocking"
move_repo "testing-library" "testing" "react-testing"
echo ""

# ============================================================
# DOCS - Documentation frameworks
# ============================================================
echo "📁 docs/"
move_repo "docusaurus" "docs" "docusaurus"
move_repo "nextra" "docs" "nextra"
move_repo "fumadocs" "docs" "fumadocs"
move_repo "typedoc" "docs" "api-docs"
echo ""

# ============================================================
# AI-AGENTS - AI/ML agent frameworks
# ============================================================
echo "📁 ai-agents/"
move_repo "langchain" "ai-agents" "langchain"
move_repo "eliza" "ai-agents" "eliza"
move_repo "crewai" "ai-agents" "crew-orchestration"
move_repo "autogpt" "ai-agents" "autonomous-agent"
move_repo "babyagi" "ai-agents" "task-agent"
move_repo "phidata" "ai-agents" "phi-assistants"
move_repo "mem0" "ai-agents" "memory-layer"
move_repo "goat" "ai-agents" "web3-toolkit"
move_repo "coinbase-agentkit" "ai-agents" "coinbase-kit"
move_repo "openai-agents" "ai-agents" "openai-sdk"
move_repo "anthropic-sdk" "ai-agents" "anthropic-sdk"
move_repo "zerepy" "ai-agents" "python-agents"
echo ""

# ============================================================
# CONTRACTS - Smart contract tooling
# ============================================================
echo "📁 contracts/"
move_repo "abitype" "contracts" "abi-types"
move_repo "foundry" "contracts" "foundry-toolkit"
move_repo "permit2" "contracts" "permit-approvals"
move_repo "ethers-integration" "contracts" "ethers"
echo ""

# ============================================================
# PAYMENTS - Payment processing
# ============================================================
echo "📁 payments/"
move_repo "stripe-node" "payments" "stripe-sdk"
move_repo "coinbase-sdk" "payments" "coinbase-sdk"
echo ""

# ============================================================
# SIMULATION - Transaction simulation
# ============================================================
echo "📁 simulation/"
move_repo "tenderly-sdk" "simulation" "tenderly"
echo ""

# ============================================================
# ACCOUNT-ABSTRACTION - AA/Smart accounts
# ============================================================
echo "📁 account-abstraction/"
move_repo "aa-sdk" "account-abstraction" "alchemy-aa"
echo ""

# ============================================================
# DEFI - DeFi protocols & adapters
# ============================================================
echo "📁 defi/"
move_repo "defillama-adapters" "defi" "tvl-adapters"
echo ""

# ============================================================
# DEVOPS - Docker & deployment
# ============================================================
echo "📁 devops/"
move_repo "docker-node" "devops" "docker-images"
echo ""

# Copy root files
echo "📄 Copying root documentation..."
cp "$VENDOR_DIR/README.md" "$NEW_VENDOR_DIR/" 2>/dev/null || true
cp "$VENDOR_DIR/INTEGRATION-GUIDE.md" "$NEW_VENDOR_DIR/" 2>/dev/null || true

# Create category index
cat > "$NEW_VENDOR_DIR/README.md" << 'EOF'
# Vendor Dependencies (Organized by Function)

Enterprise-grade organization of open source dependencies with full attribution.

## Categories

| Category | Description | Contents |
|----------|-------------|----------|
| `wallet/` | Web3 wallet connection & management | EVM hooks, Solana adapter, multisig |
| `ui/` | Component libraries | shadcn, Radix primitives, Tremor |
| `charts/` | Data visualization | Recharts, Nivo |
| `editor/` | Code/text editors | Monaco, CodeMirror |
| `workflow/` | Visual workflow builders | React Flow |
| `forms/` | Form handling & validation | JSON Schema Form, Zod |
| `api/` | API frameworks & tooling | tRPC, Hono, OpenAPI |
| `auth/` | Authentication & authorization | NextAuth, iron-session, JWT |
| `database/` | ORM & query builders | Prisma, Drizzle, Kysely |
| `state/` | State management | Zustand, Jotai, TanStack Query |
| `realtime/` | WebSocket & real-time | Socket.io, ws, Redis |
| `testing/` | Test frameworks | Vitest, Playwright, MSW |
| `docs/` | Documentation frameworks | Docusaurus, Nextra |
| `ai-agents/` | AI/ML agent frameworks | LangChain, Eliza, CrewAI, AutoGPT |
| `contracts/` | Smart contract tooling | Foundry, ABIType, Permit2 |
| `payments/` | Payment processing | Stripe, Coinbase |
| `simulation/` | Transaction simulation | Tenderly |
| `account-abstraction/` | Smart accounts/AA | Alchemy AA SDK |
| `defi/` | DeFi protocols | DefiLlama adapters |
| `devops/` | Docker & deployment | Node.js Docker images |

## Attribution

All packages maintain their original licenses and ATTRIBUTION.md files.
See individual package directories for specific license information.

## Maintainer

- **Nich** ([@nichxbt](https://x.com/nichxbt)) - [github.com/nirholas](https://github.com/nirholas)
EOF

echo ""
echo "============================================================"
echo "                    RESTRUCTURE COMPLETE                    "
echo "============================================================"
echo ""
echo "New structure created in: vendor-new/"
echo ""
echo "To apply the restructure:"
echo "  rm -rf vendor && mv vendor-new vendor"
echo ""
echo "Or review first with: ls -la vendor-new/"
echo ""
