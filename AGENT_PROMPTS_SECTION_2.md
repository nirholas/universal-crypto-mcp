

## ⚫ AGENT 8: Wallet Packages

### Context
You are responsible for reorganizing all wallet-related packages (EVM and Solana) into a clean structure.

### Your Workspace
```
/workspaces/universal-crypto-mcp/packages/wallets/
```

### Detailed Instructions

```markdown
## AGENT 8: Wallet Packages Reorganization

You are responsible for organizing wallet packages.

### YOUR RESPONSIBILITIES:
1. Create /packages/wallets/ structure
2. Move and update EVM wallet tools
3. Move and update Solana wallet tools
4. Create shared wallet utilities
5. Ensure consistent interfaces across chains

### PACKAGES YOU HANDLE:
- ethereum-wallet-toolkit → packages/wallets/evm/
- solana-wallet-toolkit → packages/wallets/solana/
- Any wallet-related code in other packages

### DO NOT TOUCH:
- /x402-deploy/ directory
- Packages assigned to other agents
- /docs/ directory

### TARGET STRUCTURE:

```
packages/
└── wallets/
    ├── shared/
    │   ├── package.json
    │   ├── src/
    │   │   ├── index.ts
    │   │   ├── interfaces.ts    # Common wallet interface
    │   │   ├── types.ts         # Shared types
    │   │   └── utils.ts         # Common utilities
    │   └── tsconfig.json
    │
    ├── evm/
    │   ├── package.json
    │   ├── README.md
    │   ├── src/
    │   │   ├── index.ts
    │   │   ├── wallet.ts
    │   │   ├── tools/
    │   │   │   ├── balance.ts
    │   │   │   ├── transfer.ts
    │   │   │   ├── sign.ts
    │   │   │   ├── tokens.ts
    │   │   │   └── nft.ts
    │   │   ├── providers/
    │   │   │   ├── viem.ts
    │   │   │   └── ethers.ts (optional)
    │   │   └── types.ts
    │   └── tsconfig.json
    │
    └── solana/
        ├── package.json
        ├── README.md
        ├── src/
        │   ├── index.ts
        │   ├── wallet.ts
        │   ├── tools/
        │   │   ├── balance.ts
        │   │   ├── transfer.ts
        │   │   ├── sign.ts
        │   │   ├── tokens.ts
        │   │   └── nft.ts
        │   └── types.ts
        └── tsconfig.json
```

### STEP-BY-STEP INSTRUCTIONS:

#### STEP 1: Create Shared Wallet Interface

Create `packages/wallets/shared/src/interfaces.ts`:
```typescript
export interface WalletProvider {
  readonly chain: string;
  readonly address: string;
  
  // Balance operations
  getBalance(): Promise<Balance>;
  getTokenBalance(token: string): Promise<Balance>;
  
  // Transfer operations
  transfer(to: string, amount: string): Promise<TransactionResult>;
  transferToken(token: string, to: string, amount: string): Promise<TransactionResult>;
  
  // Signing
  signMessage(message: string): Promise<string>;
  signTypedData(data: TypedData): Promise<string>;
  
  // Transaction
  sendTransaction(tx: TransactionRequest): Promise<TransactionResult>;
}

export interface Balance {
  raw: string;
  formatted: string;
  decimals: number;
  symbol: string;
}

export interface TransactionResult {
  hash: string;
  status: "pending" | "confirmed" | "failed";
  blockNumber?: number;
  gasUsed?: string;
}

export interface TransactionRequest {
  to: string;
  value?: string;
  data?: string;
  gasLimit?: string;
}

export interface TypedData {
  domain: Record<string, any>;
  types: Record<string, any[]>;
  primaryType: string;
  message: Record<string, any>;
}
```

Create `packages/wallets/shared/src/types.ts`:
```typescript
import { z } from "zod";

export const BalanceRequestSchema = z.object({
  address: z.string().optional(),
  token: z.string().optional(),
});

export const TransferRequestSchema = z.object({
  to: z.string(),
  amount: z.string(),
  token: z.string().optional(),
});

export const SignMessageRequestSchema = z.object({
  message: z.string(),
});

export type BalanceRequest = z.infer<typeof BalanceRequestSchema>;
export type TransferRequest = z.infer<typeof TransferRequestSchema>;
export type SignMessageRequest = z.infer<typeof SignMessageRequestSchema>;
```

Create `packages/wallets/shared/package.json`:
```json
{
  "name": "@universal-crypto-mcp/wallets-shared",
  "version": "1.0.0",
  "description": "Shared wallet interfaces and utilities",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": "./dist/index.js",
    "./interfaces": "./dist/interfaces.js",
    "./types": "./dist/types.js"
  },
  "dependencies": {
    "zod": "^3.22.0"
  }
}
```

#### STEP 2: Create EVM Wallet Package

Create `packages/wallets/evm/package.json`:
```json
{
  "name": "@universal-crypto-mcp/wallet-evm",
  "version": "1.0.0",
  "description": "EVM wallet tools for MCP",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "scripts": {
    "build": "tsup src/index.ts --format esm --dts",
    "dev": "tsup --watch",
    "test": "vitest"
  },
  "dependencies": {
    "@universal-crypto-mcp/core": "workspace:*",
    "@universal-crypto-mcp/wallets-shared": "workspace:*",
    "@modelcontextprotocol/sdk": "^1.12.0",
    "viem": "^2.0.0",
    "zod": "^3.22.0"
  }
}
```

Create `packages/wallets/evm/src/wallet.ts`:
```typescript
import { 
  createWalletClient, 
  createPublicClient, 
  http,
  type WalletClient,
  type PublicClient,
  type Chain,
  formatEther,
  parseEther,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import type { 
  WalletProvider, 
  Balance, 
  TransactionResult 
} from "@universal-crypto-mcp/wallets-shared/interfaces";
import { getChain } from "@universal-crypto-mcp/core/chains";

export class EVMWallet implements WalletProvider {
  readonly chain: string;
  readonly address: string;
  
  private walletClient: WalletClient;
  private publicClient: PublicClient;
  private viemChain: Chain;
  
  constructor(privateKey: `0x${string}`, chainId: string, rpcUrl?: string) {
    this.chain = chainId;
    this.viemChain = getChain(chainId);
    
    const account = privateKeyToAccount(privateKey);
    this.address = account.address;
    
    const transport = http(rpcUrl);
    
    this.walletClient = createWalletClient({
      account,
      chain: this.viemChain,
      transport,
    });
    
    this.publicClient = createPublicClient({
      chain: this.viemChain,
      transport,
    });
  }
  
  async getBalance(): Promise<Balance> {
    const balance = await this.publicClient.getBalance({
      address: this.address as `0x${string}`,
    });
    
    return {
      raw: balance.toString(),
      formatted: formatEther(balance),
      decimals: 18,
      symbol: this.viemChain.nativeCurrency.symbol,
    };
  }
  
  async getTokenBalance(tokenAddress: string): Promise<Balance> {
    // Implement ERC20 balance check
    throw new Error("Not implemented");
  }
  
  async transfer(to: string, amount: string): Promise<TransactionResult> {
    const hash = await this.walletClient.sendTransaction({
      to: to as `0x${string}`,
      value: parseEther(amount),
    });
    
    return {
      hash,
      status: "pending",
    };
  }
  
  async transferToken(
    token: string, 
    to: string, 
    amount: string
  ): Promise<TransactionResult> {
    // Implement ERC20 transfer
    throw new Error("Not implemented");
  }
  
  async signMessage(message: string): Promise<string> {
    return this.walletClient.signMessage({
      message,
    });
  }
  
  async signTypedData(data: any): Promise<string> {
    return this.walletClient.signTypedData(data);
  }
  
  async sendTransaction(tx: any): Promise<TransactionResult> {
    const hash = await this.walletClient.sendTransaction(tx);
    return {
      hash,
      status: "pending",
    };
  }
}
```

#### STEP 3: Create Solana Wallet Package

Create `packages/wallets/solana/package.json`:
```json
{
  "name": "@universal-crypto-mcp/wallet-solana",
  "version": "1.0.0",
  "description": "Solana wallet tools for MCP",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "dependencies": {
    "@universal-crypto-mcp/core": "workspace:*",
    "@universal-crypto-mcp/wallets-shared": "workspace:*",
    "@modelcontextprotocol/sdk": "^1.12.0",
    "@solana/web3.js": "^1.87.0",
    "@solana/spl-token": "^0.3.0",
    "zod": "^3.22.0"
  }
}
```

Create similar wallet implementation for Solana following the shared interface.

#### STEP 4: Create MCP Tool Registrations

For each wallet package, create tools that register with MCP:

`packages/wallets/evm/src/tools/balance.ts`:
```typescript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { EVMWallet } from "../wallet.js";

export function registerBalanceTools(server: McpServer, wallet: EVMWallet) {
  server.registerTool(
    "evm_get_balance",
    {
      title: "Get EVM Balance",
      description: "Get the native token balance for an address",
      inputSchema: z.object({
        address: z.string().optional().describe("Address to check (defaults to wallet address)"),
      }),
    },
    async (args) => {
      const balance = await wallet.getBalance();
      return {
        content: [{
          type: "text",
          text: JSON.stringify(balance, null, 2),
        }],
      };
    }
  );
  
  server.registerTool(
    "evm_get_token_balance",
    {
      title: "Get ERC20 Token Balance",
      description: "Get the balance of an ERC20 token",
      inputSchema: z.object({
        token: z.string().describe("Token contract address"),
        address: z.string().optional().describe("Address to check"),
      }),
    },
    async (args) => {
      const balance = await wallet.getTokenBalance(args.token);
      return {
        content: [{
          type: "text",
          text: JSON.stringify(balance, null, 2),
        }],
      };
    }
  );
}
```

### FINAL CHECKLIST:
- [ ] /packages/wallets/shared/ created
- [ ] /packages/wallets/evm/ created with full implementation
- [ ] /packages/wallets/solana/ created with full implementation
- [ ] Common interface implemented by both
- [ ] MCP tools registered for all operations
- [ ] Old packages removed
- [ ] All imports updated
```

---

## ⚪ AGENT 9: DeFi & Payments Packages

### Context
You are responsible for reorganizing all DeFi protocol integrations and payment-related packages (including x402).

### Your Workspace
```
/workspaces/universal-crypto-mcp/packages/defi/
/workspaces/universal-crypto-mcp/packages/payments/
```

### Detailed Instructions

```markdown
## AGENT 9: DeFi & Payments Reorganization

You are responsible for organizing DeFi and payment packages.

### YOUR RESPONSIBILITIES:
1. Create /packages/defi/ structure
2. Create /packages/payments/ structure
3. Organize x402 related packages
4. Organize Sperax/USDs packages
5. Organize BNB Chain packages
6. Create shared DeFi utilities

### PACKAGES YOU HANDLE:
- sperax-mcp-server → packages/defi/sperax/
- bnbchain-mcp-server → packages/defi/bnb-chain/
- x402/ (root) → packages/payments/x402-protocol/ (reference)
- x402-stablecoin → packages/payments/x402-stablecoin/
- x402-ecosystem → packages/payments/x402-ecosystem/

### DO NOT TOUCH:
- /x402-deploy/ directory (separate product)
- Packages assigned to other agents
- /docs/ directory

### TARGET STRUCTURE:

```
packages/
├── defi/
│   ├── shared/
│   │   ├── package.json
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── protocols.ts    # Protocol registry
│   │   │   ├── types.ts        # DeFi types
│   │   │   └── abis/           # Common ABIs
│   │   └── tsconfig.json
│   │
│   ├── sperax/
│   │   ├── package.json
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── usds.ts         # USDs operations
│   │   │   ├── yield.ts        # Yield tracking
│   │   │   ├── tools/
│   │   │   └── types.ts
│   │   └── README.md
│   │
│   └── bnb-chain/
│       ├── package.json
│       ├── src/
│       └── README.md
│
└── payments/
    ├── shared/
    │   ├── package.json
    │   └── src/
    │       ├── index.ts
    │       └── types.ts
    │
    ├── x402-protocol/           # Reference to coinbase/x402
    │   └── README.md            # Points to npm packages
    │
    ├── x402-ecosystem/          # Your ecosystem additions
    │   ├── package.json
    │   ├── src/
    │   │   ├── index.ts
    │   │   ├── agent.ts        # PayableAgent
    │   │   ├── marketplace.ts  # Tool marketplace
    │   │   ├── premium.ts      # Premium tiers
    │   │   └── yield.ts        # Yield projector
    │   └── README.md
    │
    └── x402-stablecoin/
        ├── package.json
        ├── src/
        └── README.md
```

### STEP-BY-STEP INSTRUCTIONS:

#### STEP 1: Create DeFi Shared Package

Create `packages/defi/shared/src/types.ts`:
```typescript
import { z } from "zod";

export const ProtocolSchema = z.enum([
  "uniswap",
  "sushiswap", 
  "curve",
  "aave",
  "compound",
  "sperax",
  "pancakeswap",
]);
export type Protocol = z.infer<typeof ProtocolSchema>;

export const SwapRequestSchema = z.object({
  tokenIn: z.string(),
  tokenOut: z.string(),
  amountIn: z.string(),
  slippage: z.number().default(0.5),
  deadline: z.number().optional(),
});
export type SwapRequest = z.infer<typeof SwapRequestSchema>;

export const SwapQuoteSchema = z.object({
  tokenIn: z.string(),
  tokenOut: z.string(),
  amountIn: z.string(),
  amountOut: z.string(),
  priceImpact: z.number(),
  route: z.array(z.string()),
  protocol: ProtocolSchema,
});
export type SwapQuote = z.infer<typeof SwapQuoteSchema>;

export const PoolInfoSchema = z.object({
  address: z.string(),
  token0: z.string(),
  token1: z.string(),
  reserve0: z.string(),
  reserve1: z.string(),
  fee: z.number(),
  apy: z.number().optional(),
});
export type PoolInfo = z.infer<typeof PoolInfoSchema>;

export const StakeRequestSchema = z.object({
  protocol: ProtocolSchema,
  token: z.string(),
  amount: z.string(),
});
export type StakeRequest = z.infer<typeof StakeRequestSchema>;

export interface DeFiProtocol {
  name: string;
  chain: string;
  getQuote(request: SwapRequest): Promise<SwapQuote>;
  executeSwap(request: SwapRequest): Promise<string>;
  getPools(): Promise<PoolInfo[]>;
}
```

#### STEP 2: Create Sperax Package

Create `packages/defi/sperax/package.json`:
```json
{
  "name": "@universal-crypto-mcp/defi-sperax",
  "version": "1.0.0",
  "description": "Sperax USDs integration for MCP",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "dependencies": {
    "@universal-crypto-mcp/core": "workspace:*",
    "@universal-crypto-mcp/defi-shared": "workspace:*",
    "@universal-crypto-mcp/wallet-evm": "workspace:*",
    "@modelcontextprotocol/sdk": "^1.12.0",
    "viem": "^2.0.0",
    "zod": "^3.22.0"
  }
}
```

Create `packages/defi/sperax/src/usds.ts`:
```typescript
import { 
  createPublicClient, 
  createWalletClient,
  http,
  formatUnits,
  parseUnits,
} from "viem";
import { arbitrum } from "viem/chains";
import { USDs } from "@universal-crypto-mcp/core/tokens";

const USDS_ABI = [
  // Add USDs contract ABI
] as const;

export class USDsClient {
  private publicClient;
  private walletClient;
  
  constructor(privateKey?: `0x${string}`) {
    const transport = http();
    
    this.publicClient = createPublicClient({
      chain: arbitrum,
      transport,
    });
    
    if (privateKey) {
      // Initialize wallet client
    }
  }
  
  async getBalance(address: `0x${string}`): Promise<string> {
    const balance = await this.publicClient.readContract({
      address: USDs.address,
      abi: USDS_ABI,
      functionName: "balanceOf",
      args: [address],
    });
    
    return formatUnits(balance as bigint, 18);
  }
  
  async getYieldEarned(address: `0x${string}`): Promise<string> {
    // Calculate yield earned through rebasing
    throw new Error("Not implemented");
  }
  
  async getCurrentAPY(): Promise<number> {
    // Get current APY from Sperax
    throw new Error("Not implemented");
  }
  
  async projectYield(
    balance: string,
    days: number
  ): Promise<{ projected: string; apy: number }> {
    const apy = await this.getCurrentAPY();
    const dailyRate = apy / 365 / 100;
    const projected = parseFloat(balance) * Math.pow(1 + dailyRate, days);
    
    return {
      projected: projected.toFixed(6),
      apy,
    };
  }
}
```

#### STEP 3: Organize Payments Package

Create `packages/payments/x402-protocol/README.md`:
```markdown
# x402 Protocol Reference

This directory references the official x402 protocol packages.

## Official Packages

Install from npm:

\`\`\`bash
npm install @x402/core @x402/express @x402/evm
\`\`\`

## Documentation

- [x402 Docs](https://docs.x402.org)
- [x402 GitHub](https://github.com/coinbase/x402)

## Integration

See [@universal-crypto-mcp/x402-ecosystem](../x402-ecosystem/) for our ecosystem additions.
```

Update `packages/payments/x402-ecosystem/package.json`:
```json
{
  "name": "@universal-crypto-mcp/x402-ecosystem",
  "version": "1.0.0",
  "description": "x402 ecosystem utilities for AI agents",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": "./dist/index.js",
    "./agent": "./dist/agent.js",
    "./marketplace": "./dist/marketplace.js",
    "./premium": "./dist/premium.js",
    "./yield": "./dist/yield.js"
  },
  "dependencies": {
    "@universal-crypto-mcp/core": "workspace:*",
    "@x402/core": "^0.4.0",
    "@x402/express": "^0.4.0",
    "@modelcontextprotocol/sdk": "^1.12.0",
    "viem": "^2.0.0",
    "zod": "^3.22.0"
  }
}
```

### FINAL CHECKLIST:
- [ ] /packages/defi/shared/ created
- [ ] /packages/defi/sperax/ created with USDs integration
- [ ] /packages/defi/bnb-chain/ moved and updated
- [ ] /packages/payments/x402-protocol/ reference created
- [ ] /packages/payments/x402-ecosystem/ updated
- [ ] /packages/payments/x402-stablecoin/ moved
- [ ] All package.json files updated
- [ ] All imports working
```

---

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
