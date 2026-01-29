

## 🔘 AGENT 10: Documentation, Examples & Tests

### Context
You are responsible for all documentation, examples, and test infrastructure.

### Your Workspace
```
/workspaces/universal-crypto-mcp/docs/
/workspaces/universal-crypto-mcp/examples/
/workspaces/universal-crypto-mcp/tests/
```

### Detailed Instructions

```markdown
## AGENT 10: Documentation, Examples & Tests

You are responsible for documentation, examples, and tests.

### YOUR RESPONSIBILITIES:
1. Update /docs/ with new structure documentation
2. Create /examples/ with working examples
3. Update /tests/ infrastructure
4. Create getting started guide
5. Create API reference documentation
6. Create contribution guidelines

### DO NOT TOUCH:
- Source code in /packages/
- /x402-deploy/ source code
- Configuration files

### TARGET STRUCTURE:

```
docs/
├── content/
│   ├── index.md                    # Home
│   ├── getting-started/
│   │   ├── installation.md
│   │   ├── configuration.md
│   │   ├── first-tool.md
│   │   └── deployment.md
│   ├── packages/
│   │   ├── overview.md
│   │   ├── core.md
│   │   ├── trading.md
│   │   ├── market-data.md
│   │   ├── wallets.md
│   │   ├── defi.md
│   │   └── payments.md
│   ├── x402-deploy/
│   │   ├── overview.md
│   │   ├── quick-start.md
│   │   ├── configuration.md
│   │   ├── providers.md
│   │   └── discovery.md
│   ├── api-reference/
│   │   └── ...
│   └── contributing/
│       ├── development.md
│       ├── testing.md
│       └── releases.md

examples/
├── README.md
├── basic-mcp-server/
│   ├── package.json
│   ├── src/
│   │   └── index.ts
│   └── README.md
├── trading-bot/
│   ├── package.json
│   ├── src/
│   └── README.md
├── paid-api/
│   ├── package.json
│   ├── src/
│   ├── x402.config.json
│   └── README.md
└── full-deployment/
    ├── package.json
    ├── src/
    ├── x402.config.json
    └── README.md

tests/
├── setup.ts
├── utils/
│   ├── mocks.ts
│   └── fixtures.ts
├── integration/
│   ├── trading.test.ts
│   ├── wallets.test.ts
│   └── payments.test.ts
└── e2e/
    ├── mcp-server.test.ts
    └── x402-deploy.test.ts
```

### STEP-BY-STEP INSTRUCTIONS:

#### STEP 1: Create Getting Started Guide

Create `docs/content/getting-started/installation.md`:
```markdown
# Installation

## Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Git

## Quick Install

\`\`\`bash
# Install the main package
npm install @nirholas/universal-crypto-mcp

# Or individual packages
npm install @universal-crypto-mcp/trading-binance
npm install @universal-crypto-mcp/wallet-evm
\`\`\`

## For Development

\`\`\`bash
# Clone the repo
git clone https://github.com/nirholas/universal-crypto-mcp.git
cd universal-crypto-mcp

# Install dependencies
pnpm install

# Build all packages
pnpm build
\`\`\`

## Add to Claude Desktop

\`\`\`json
{
  "mcpServers": {
    "universal-crypto": {
      "command": "npx",
      "args": ["@nirholas/universal-crypto-mcp"]
    }
  }
}
\`\`\`
```

#### STEP 2: Create Basic Example

Create `examples/basic-mcp-server/src/index.ts`:
```typescript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerMarketDataTools } from "@universal-crypto-mcp/market-data-aggregator";
import { registerBalanceTools } from "@universal-crypto-mcp/wallet-evm";

async function main() {
  const server = new McpServer({
    name: "my-crypto-mcp",
    version: "1.0.0",
  });
  
  // Register tools
  registerMarketDataTools(server);
  // registerBalanceTools requires a wallet instance
  
  // Start server
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  console.error("MCP server running");
}

main().catch(console.error);
```

Create `examples/basic-mcp-server/README.md`:
```markdown
# Basic MCP Server Example

A minimal example showing how to create an MCP server with crypto tools.

## Run

\`\`\`bash
npm install
npm start
\`\`\`

## Tools Included

- `get_price` - Get cryptocurrency prices
- `get_trending` - Get trending coins
```

#### STEP 3: Create Paid API Example

Create `examples/paid-api/x402.config.json`:
```json
{
  "name": "my-paid-api",
  "payment": {
    "wallet": "0x...",
    "network": "eip155:42161"
  },
  "pricing": {
    "routes": {
      "GET /api/price/*": "$0.0001",
      "GET /api/premium/*": "$0.01"
    }
  },
  "discovery": {
    "instructions": "Premium crypto data API"
  }
}
```

Create `examples/paid-api/src/index.ts`:
```typescript
import express from "express";
import { wrapExpressWithX402 } from "@nirholas/x402-deploy/gateway";
import config from "../x402.config.json";

const app = express();

app.get("/api/price/:symbol", (req, res) => {
  res.json({
    symbol: req.params.symbol,
    price: Math.random() * 100000,
    timestamp: Date.now(),
  });
});

app.get("/api/premium/analysis/:symbol", (req, res) => {
  res.json({
    symbol: req.params.symbol,
    analysis: "Premium analysis data...",
    prediction: "bullish",
    confidence: 0.85,
  });
});

// Wrap with x402 payments
const wrappedApp = wrapExpressWithX402(app, config);

wrappedApp.listen(3000, () => {
  console.log("Paid API running on http://localhost:3000");
});
```

#### STEP 4: Create Test Utilities

Create `tests/utils/mocks.ts`:
```typescript
import { vi } from "vitest";

export function createMockMcpServer() {
  return {
    registerTool: vi.fn(),
    registerResource: vi.fn(),
    registerPrompt: vi.fn(),
    connect: vi.fn(),
  };
}

export function createMockWallet() {
  return {
    address: "0x1234567890123456789012345678901234567890",
    getBalance: vi.fn().mockResolvedValue({
      raw: "1000000000000000000",
      formatted: "1.0",
      decimals: 18,
      symbol: "ETH",
    }),
    transfer: vi.fn().mockResolvedValue({
      hash: "0xabc123...",
      status: "pending",
    }),
    signMessage: vi.fn().mockResolvedValue("0xsignature..."),
  };
}

export function createMockX402Response() {
  return {
    status: 402,
    body: {
      x402Version: 2,
      accepts: [
        {
          scheme: "exact",
          network: "eip155:42161",
          maxAmountRequired: "1000000",
          payTo: "0x...",
          asset: "0x...",
        },
      ],
    },
  };
}
```

Create `tests/setup.ts`:
```typescript
import { beforeAll, afterAll, afterEach } from "vitest";
import { vi } from "vitest";

beforeAll(() => {
  // Global test setup
});

afterAll(() => {
  // Global test cleanup
});

afterEach(() => {
  vi.clearAllMocks();
});
```

#### STEP 5: Update Root README

Update `/workspaces/universal-crypto-mcp/README.md` with:
- New package structure overview
- Quick start guide
- Links to documentation
- x402-deploy section
- Contributing section

### FINAL CHECKLIST:
- [ ] Getting started guide complete
- [ ] Package documentation for each package group
- [ ] x402-deploy documentation
- [ ] Basic example working
- [ ] Paid API example working
- [ ] Test utilities created
- [ ] Root README updated
- [ ] CONTRIBUTING.md updated
- [ ] All links working
```

---

## 📌 Running All 10 Agents

### Execution Order

These agents can run **simultaneously** with the following considerations:

| Wave | Agents | Dependencies |
|------|--------|--------------|
| Wave 1 | 1, 6, 10 | None - start immediately |
| Wave 2 | 2, 3, 4, 5, 7, 8, 9 | Wait for directory structure from Agent 1 & 6 |

### Conflict Prevention

Each agent has a clearly defined directory scope:

- **Agent 1**: `/x402-deploy/` root files + `/src/cli/`, `/src/types/`, `/src/utils/`
- **Agent 2**: `/x402-deploy/src/gateway/`
- **Agent 3**: `/x402-deploy/src/templates/`, `/src/builders/`, `/src/deployers/`
- **Agent 4**: `/x402-deploy/src/discovery/`
- **Agent 5**: `/x402-deploy/src/dashboard/`
- **Agent 6**: `/packages/core/`, `/packages/shared/`, `/packages/agents/`, `/packages/automation/`, `/packages/generators/`
- **Agent 7**: `/packages/trading/`, `/packages/market-data/`
- **Agent 8**: `/packages/wallets/`
- **Agent 9**: `/packages/defi/`, `/packages/payments/`
- **Agent 10**: `/docs/`, `/examples/`, `/tests/`

### Verification

After all agents complete:

1. Run `pnpm install` in root
2. Run `pnpm build` to verify compilation
3. Run `pnpm test` to verify tests
4. Check for any import errors

---

## 📋 Summary

| Agent | Focus | Est. Files | Complexity |
|-------|-------|------------|------------|
| 1 | CLI & Core Types | 15-20 | High |
| 2 | Gateway/Wrapper | 10-15 | High |
| 3 | Deploy Templates | 15-20 | Medium |
| 4 | Discovery | 8-10 | Medium |
| 5 | Dashboard | 8-10 | Medium |
| 6 | Restructure Master | 20-30 | High |
| 7 | Trading/Market | 15-20 | Medium |
| 8 | Wallets | 15-20 | Medium |
| 9 | DeFi/Payments | 15-20 | Medium |
| 10 | Docs/Examples | 20-25 | Low |

**Total estimated new/modified files: 140-190**

---

*These prompts are designed for Claude Opus 4.5 agents working in parallel. Each agent should be given its complete prompt section and work independently within its designated directories.*
