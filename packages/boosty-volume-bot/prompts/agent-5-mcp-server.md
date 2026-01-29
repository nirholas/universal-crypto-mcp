# Agent 5: MCP Server Implementation

You are Claude Opus 4.5 building the MCP server for Claude Desktop. Create `/packages/mcp-server/`.

## Context
- MCP protocol for Claude Desktop integration
- Imports all other packages as dependencies
- Exposes tools, resources, and prompts

## Build These Components

### 1. MCP Server Core (`src/server.ts`)
```typescript
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

const server = new Server({
  name: 'defi-mcp-server',
  version: '1.0.0',
}, {
  capabilities: {
    tools: {},
    resources: {},
    prompts: {},
  },
});
```

### 2. Wallet Tools (`src/tools/wallet-tools.ts`)
```typescript
const tools = [
  {
    name: 'create_master_wallet',
    description: 'Create a new HD master wallet with mnemonic',
    inputSchema: {
      type: 'object',
      properties: {
        password: { type: 'string', description: 'Encryption password (min 12 chars)' },
      },
      required: ['password'],
    },
  },
  {
    name: 'create_wallet_swarm',
    description: 'Derive multiple wallets from master for trading',
    inputSchema: {
      type: 'object',
      properties: {
        masterWalletId: { type: 'string' },
        count: { type: 'number', maximum: 1000 },
        tag: { type: 'string' },
        fundEachSol: { type: 'number' },
        password: { type: 'string' },
      },
      required: ['masterWalletId', 'count', 'password'],
    },
  },
  {
    name: 'get_wallet_balances',
    description: 'Get SOL and token balances for wallets',
    inputSchema: {
      type: 'object',
      properties: {
        walletIds: { type: 'array', items: { type: 'string' } },
        tag: { type: 'string', description: 'Or filter by tag' },
      },
    },
  },
  {
    name: 'distribute_funds',
    description: 'Distribute SOL from source to multiple wallets',
    inputSchema: {
      type: 'object',
      properties: {
        sourceWalletId: { type: 'string' },
        destinationWalletIds: { type: 'array', items: { type: 'string' } },
        totalAmountSol: { type: 'number' },
        distribution: { type: 'string', enum: ['even', 'random', 'weighted'] },
        password: { type: 'string' },
      },
      required: ['sourceWalletId', 'destinationWalletIds', 'totalAmountSol', 'password'],
    },
  },
  {
    name: 'consolidate_funds',
    description: 'Collect all funds back to a single wallet',
    inputSchema: {
      type: 'object',
      properties: {
        sourceWalletIds: { type: 'array', items: { type: 'string' } },
        destinationWalletId: { type: 'string' },
        password: { type: 'string' },
      },
      required: ['sourceWalletIds', 'destinationWalletId', 'password'],
    },
  },
];
```

### 3. Trading Tools (`src/tools/trading-tools.ts`)
```typescript
const tools = [
  {
    name: 'get_swap_quote',
    description: 'Get quote for token swap via Jupiter',
    inputSchema: {
      type: 'object',
      properties: {
        inputToken: { type: 'string', description: 'Token mint or "SOL"' },
        outputToken: { type: 'string', description: 'Token mint or "SOL"' },
        amount: { type: 'string', description: 'Amount in token units' },
        slippageBps: { type: 'number', default: 100 },
      },
      required: ['inputToken', 'outputToken', 'amount'],
    },
  },
  {
    name: 'execute_swap',
    description: 'Execute a token swap',
    inputSchema: {
      type: 'object',
      properties: {
        walletId: { type: 'string' },
        inputToken: { type: 'string' },
        outputToken: { type: 'string' },
        amount: { type: 'string' },
        slippageBps: { type: 'number' },
        useMevProtection: { type: 'boolean' },
        password: { type: 'string' },
      },
      required: ['walletId', 'inputToken', 'outputToken', 'amount', 'password'],
    },
  },
  {
    name: 'get_token_info',
    description: 'Get token information including price and liquidity',
    inputSchema: {
      type: 'object',
      properties: {
        mint: { type: 'string' },
      },
      required: ['mint'],
    },
  },
  {
    name: 'get_pool_info',
    description: 'Get DEX pool information',
    inputSchema: {
      type: 'object',
      properties: {
        poolId: { type: 'string' },
        dex: { type: 'string', enum: ['raydium', 'orca', 'pumpfun'] },
      },
      required: ['poolId'],
    },
  },
];
```

### 4. Campaign Tools (`src/tools/campaign-tools.ts`)
```typescript
const tools = [
  {
    name: 'create_volume_campaign',
    description: 'Create a volume generation campaign for a token',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        targetToken: { type: 'string', description: 'Token mint address' },
        targetVolume24hSol: { type: 'number' },
        botCount: { type: 'number', maximum: 10000 },
        durationHours: { type: 'number' },
        mode: { type: 'string', enum: ['aggressive', 'moderate', 'stealth'] },
        walletTag: { type: 'string', description: 'Tag of wallets to use' },
        password: { type: 'string' },
      },
      required: ['name', 'targetToken', 'targetVolume24hSol', 'botCount', 'password'],
    },
  },
  {
    name: 'start_campaign',
    description: 'Start a volume campaign',
    inputSchema: {
      type: 'object',
      properties: {
        campaignId: { type: 'string' },
      },
      required: ['campaignId'],
    },
  },
  {
    name: 'pause_campaign',
    description: 'Pause a running campaign',
    inputSchema: {
      type: 'object',
      properties: {
        campaignId: { type: 'string' },
      },
      required: ['campaignId'],
    },
  },
  {
    name: 'stop_campaign',
    description: 'Stop and finalize a campaign',
    inputSchema: {
      type: 'object',
      properties: {
        campaignId: { type: 'string' },
      },
      required: ['campaignId'],
    },
  },
  {
    name: 'get_campaign_status',
    description: 'Get current status and metrics of a campaign',
    inputSchema: {
      type: 'object',
      properties: {
        campaignId: { type: 'string' },
      },
      required: ['campaignId'],
    },
  },
  {
    name: 'list_campaigns',
    description: 'List all campaigns',
    inputSchema: {
      type: 'object',
      properties: {
        status: { type: 'string', enum: ['active', 'paused', 'completed', 'all'] },
      },
    },
  },
];
```

### 5. Bot Tools (`src/tools/bot-tools.ts`)
```typescript
const tools = [
  {
    name: 'create_trading_bot',
    description: 'Create a single trading bot',
    inputSchema: {
      type: 'object',
      properties: {
        walletId: { type: 'string' },
        targetToken: { type: 'string' },
        mode: { type: 'string', enum: ['volume', 'market-make', 'accumulate', 'distribute'] },
        minTradeSol: { type: 'number' },
        maxTradeSol: { type: 'number' },
        minIntervalSec: { type: 'number' },
        maxIntervalSec: { type: 'number' },
        buyProbability: { type: 'number', minimum: 0, maximum: 1 },
      },
      required: ['walletId', 'targetToken', 'mode'],
    },
  },
  {
    name: 'start_bot',
    description: 'Start a trading bot',
    inputSchema: {
      type: 'object',
      properties: {
        botId: { type: 'string' },
      },
      required: ['botId'],
    },
  },
  {
    name: 'stop_bot',
    description: 'Stop a trading bot',
    inputSchema: {
      type: 'object',
      properties: {
        botId: { type: 'string' },
      },
      required: ['botId'],
    },
  },
  {
    name: 'get_bot_status',
    description: 'Get status and performance of a bot',
    inputSchema: {
      type: 'object',
      properties: {
        botId: { type: 'string' },
      },
      required: ['botId'],
    },
  },
];
```

### 6. Resources (`src/resources/`)
```typescript
// Wallet resources
'wallets://list' // List all wallets
'wallets://{id}' // Get wallet details
'wallets://tag/{tag}' // Get wallets by tag

// Campaign resources  
'campaigns://list'
'campaigns://{id}'
'campaigns://{id}/metrics'

// Bot resources
'bots://list'
'bots://{id}'
'bots://active'
```

### 7. Prompts (`src/prompts/`)
```typescript
const prompts = [
  {
    name: 'volume_campaign_wizard',
    description: 'Interactive guide to set up a volume campaign',
    arguments: [
      { name: 'tokenMint', description: 'Target token', required: true },
    ],
  },
  {
    name: 'wallet_setup',
    description: 'Guide to create and fund wallets for trading',
    arguments: [
      { name: 'walletCount', description: 'How many wallets', required: true },
    ],
  },
];
```

### 8. CLI (`src/cli.ts`)
```bash
# Start server
defi-mcp start

# With config
defi-mcp start --config ./config.json

# Database setup
defi-mcp db:init
defi-mcp db:migrate
```

## Claude Desktop Config
```json
{
  "mcpServers": {
    "defi": {
      "command": "npx",
      "args": ["@defi-mcp/server", "start"],
      "env": {
        "SOLANA_RPC_URL": "https://mainnet.helius-rpc.com/?api-key=YOUR_KEY",
        "HELIUS_API_KEY": "your-helius-key",
        "REDIS_URL": "redis://localhost:6379",
        "DATABASE_URL": "postgresql://user:pass@localhost:5432/defi",
        "MASTER_PASSWORD": "your-secure-master-password"
      }
    }
  }
}
```

## Dependencies
```json
{
  "@modelcontextprotocol/sdk": "^1.0.0",
  "zod": "^3.23.0",
  "pino": "^9.0.0",
  "commander": "^12.0.0"
}
```

## Output Structure
```
packages/mcp-server/
├── package.json
├── mcp-manifest.json
├── src/
│   ├── index.ts
│   ├── server.ts
│   ├── cli.ts
│   ├── tools/
│   │   ├── index.ts
│   │   ├── wallet-tools.ts
│   │   ├── trading-tools.ts
│   │   ├── campaign-tools.ts
│   │   └── bot-tools.ts
│   ├── resources/
│   │   └── index.ts
│   ├── prompts/
│   │   └── index.ts
│   └── config/
│       └── schema.ts
```

START BUILDING NOW - Complete code only.
