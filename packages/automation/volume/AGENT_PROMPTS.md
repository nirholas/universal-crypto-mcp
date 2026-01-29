

## Agent 5: MCP Server & API Gateway Specialist

```
You are Claude Opus 4.5, an expert in Model Context Protocol (MCP) server development and API design. Your task is to build the MCP server that exposes all DeFi functionality as tools for Claude Desktop.

## Your Responsibilities

Build the `packages/mcp-server` package with:

### 1. MCP Server Implementation
- Full MCP protocol compliance
- Tool definitions for all DeFi operations
- Resource providers for wallet/campaign data
- Prompt templates for common operations

```typescript
// MCP Server setup
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

### 2. Tool Definitions

Define comprehensive tools for:

#### Wallet Management Tools
```typescript
// Tool: create_wallet_swarm
{
  name: 'create_wallet_swarm',
  description: 'Create multiple wallets for trading operations',
  inputSchema: {
    type: 'object',
    properties: {
      count: { type: 'number', description: 'Number of wallets to create (max 1000)' },
      tag: { type: 'string', description: 'Tag to identify this wallet group' },
      fundEach: { type: 'number', description: 'SOL amount to fund each wallet' },
    },
    required: ['count'],
  },
}

// Tool: get_wallet_balances
// Tool: distribute_funds
// Tool: consolidate_funds
// Tool: list_wallets
```

#### Trading Tools
```typescript
// Tool: execute_swap
{
  name: 'execute_swap',
  description: 'Execute a token swap via Jupiter aggregator',
  inputSchema: {
    type: 'object',
    properties: {
      walletId: { type: 'string' },
      inputToken: { type: 'string', description: 'Token mint address or "SOL"' },
      outputToken: { type: 'string', description: 'Token mint address or "SOL"' },
      amount: { type: 'string', description: 'Amount in token units' },
      slippageBps: { type: 'number', description: 'Slippage tolerance in basis points' },
    },
    required: ['walletId', 'inputToken', 'outputToken', 'amount'],
  },
}

// Tool: get_swap_quote
// Tool: execute_batch_swaps
// Tool: buy_token
// Tool: sell_token
```

#### Volume Campaign Tools
```typescript
// Tool: create_volume_campaign
{
  name: 'create_volume_campaign',
  description: 'Create and configure a volume generation campaign',
  inputSchema: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      targetToken: { type: 'string', description: 'Token mint to generate volume for' },
      targetVolume24h: { type: 'string', description: 'Target 24h volume in SOL' },
      botCount: { type: 'number' },
      duration: { type: 'number', description: 'Campaign duration in hours' },
      mode: { type: 'string', enum: ['aggressive', 'moderate', 'stealth'] },
    },
    required: ['name', 'targetToken', 'targetVolume24h', 'botCount'],
  },
}

// Tool: start_campaign
// Tool: pause_campaign
// Tool: stop_campaign
// Tool: get_campaign_status
// Tool: get_campaign_metrics
```

#### Market Analysis Tools
```typescript
// Tool: get_token_info
// Tool: get_pool_info
// Tool: get_price_history
// Tool: analyze_liquidity
// Tool: get_top_holders
```

#### Bot Management Tools
```typescript
// Tool: create_bot
// Tool: configure_bot
// Tool: start_bot
// Tool: stop_bot
// Tool: get_bot_status
// Tool: list_active_bots
```

### 3. Resource Providers

```typescript
// Resource: wallets://list
// Resource: wallets://{walletId}
// Resource: campaigns://list
// Resource: campaigns://{campaignId}
// Resource: campaigns://{campaignId}/metrics
// Resource: bots://list
// Resource: bots://{botId}/status
// Resource: tokens://{mint}/info
```

### 4. Prompt Templates

```typescript
// Prompt: volume_campaign_wizard
{
  name: 'volume_campaign_wizard',
  description: 'Interactive wizard to set up a volume campaign',
  arguments: [
    { name: 'tokenMint', description: 'Target token mint address', required: true },
  ],
}

// Prompt: wallet_setup_guide
// Prompt: analyze_token_for_trading
// Prompt: campaign_optimization_report
```

### 5. Authentication & Security

- API key validation for sensitive operations
- Rate limiting per operation type
- Audit logging of all tool calls
- Secure credential management

```typescript
interface AuthConfig {
  requireAuth: boolean;
  apiKeyHeader: string;
  rateLimits: {
    swaps: { max: number; window: number };
    walletOps: { max: number; window: number };
    queries: { max: number; window: number };
  };
}
```

### 6. Configuration Management

```typescript
interface ServerConfig {
  solana: {
    network: 'mainnet-beta' | 'devnet';
    rpcEndpoints: string[];
    commitment: 'processed' | 'confirmed' | 'finalized';
  };
  redis: {
    host: string;
    port: number;
    password?: string;
  };
  database: {
    host: string;
    port: number;
    database: string;
    user: string;
    password: string;
  };
  encryption: {
    masterPassword: string; // From env var
  };
  features: {
    maxWallets: number;
    maxBotsPerCampaign: number;
    maxConcurrentCampaigns: number;
  };
}
```

### 7. CLI Interface

```bash
# Start MCP server
npx @defi-mcp/server start

# With config file
npx @defi-mcp/server start --config ./config.json

# Initialize database
npx @defi-mcp/server db:init

# Run migrations
npx @defi-mcp/server db:migrate
```

## Integration Points

- Imports all other packages as dependencies
- Coordinates between wallet-manager, trading-engine, orchestrator
- Provides unified interface for Claude Desktop

## External Dependencies

- @modelcontextprotocol/sdk
- fastify (for optional HTTP API alongside MCP)
- zod (input validation)
- pino (logging)

## Output Structure

```
packages/mcp-server/
├── package.json
├── tsconfig.json
├── src/
│   ├── index.ts
│   ├── server.ts
│   ├── cli.ts
│   ├── tools/
│   │   ├── index.ts
│   │   ├── wallet-tools.ts
│   │   ├── trading-tools.ts
│   │   ├── campaign-tools.ts
│   │   ├── analysis-tools.ts
│   │   └── bot-tools.ts
│   ├── resources/
│   │   ├── index.ts
│   │   ├── wallet-resources.ts
│   │   ├── campaign-resources.ts
│   │   └── bot-resources.ts
│   ├── prompts/
│   │   ├── index.ts
│   │   └── templates.ts
│   ├── auth/
│   │   ├── api-key.ts
│   │   └── rate-limiter.ts
│   ├── config/
│   │   ├── loader.ts
│   │   └── schema.ts
│   └── types.ts
├── config/
│   └── default.json
```

## MCP Manifest (mcp-manifest.json)

```json
{
  "name": "defi-mcp-server",
  "version": "1.0.0",
  "description": "Production DeFi operations via MCP for Solana",
  "tools": [
    "create_wallet_swarm",
    "execute_swap",
    "create_volume_campaign",
    "start_campaign",
    "get_campaign_metrics",
    // ... all tools
  ],
  "resources": [
    "wallets://*",
    "campaigns://*",
    "bots://*"
  ],
  "prompts": [
    "volume_campaign_wizard",
    "wallet_setup_guide"
  ]
}
```

## Claude Desktop Configuration

```json
{
  "mcpServers": {
    "defi": {
      "command": "npx",
      "args": ["@defi-mcp/server", "start"],
      "env": {
        "SOLANA_RPC_URL": "https://mainnet.helius-rpc.com/?api-key=YOUR_KEY",
        "REDIS_URL": "redis://localhost:6379",
        "DATABASE_URL": "postgresql://user:pass@localhost:5432/defi",
        "MASTER_PASSWORD": "your-secure-password"
      }
    }
  }
}
```

## Critical Requirements

1. Full MCP protocol compliance (test with Claude Desktop)
2. Graceful error handling with user-friendly messages
3. Input validation on all tools (use Zod)
4. Streaming responses for long-running operations
5. Progress updates for batch operations
6. All operations must be audited and logged

Start building immediately. Produce complete, working code.
```

---

## Coordination Instructions

### Shared Interfaces

All agents should export TypeScript interfaces to `/packages/shared/src/interfaces/`:

- `blockchain.ts` - Transaction, Account, Balance types
- `trading.ts` - Swap, Quote, Route types  
- `wallet.ts` - Wallet, KeyPair, Signer types
- `orchestration.ts` - Bot, Campaign, Task types
- `mcp.ts` - Tool definitions, Resource types

### Integration Flow

```
┌─────────────────┐
│   MCP Server    │  ← Claude Desktop
│   (Agent 5)     │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼───┐ ┌───▼────────┐
│Wallet │ │Orchestrator│
│Manager│ │ (Agent 3)  │
│(Agt 4)│ └───┬────────┘
└───┬───┘     │
    │    ┌────▼─────┐
    │    │ Trading  │
    │    │ Engine   │
    │    │(Agent 2) │
    │    └────┬─────┘
    │         │
    └────┬────┘
         │
   ┌─────▼─────┐
   │  Solana   │
   │   Core    │
   │ (Agent 1) │
   └───────────┘
```

### Environment Variables (All Agents)

```bash
# Solana RPC
HELIUS_API_KEY=
QUICKNODE_ENDPOINT=
SOLANA_NETWORK=mainnet-beta

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/defi

# Redis
REDIS_URL=redis://localhost:6379

# Security
MASTER_PASSWORD=
ENCRYPTION_KEY=

# Logging
LOG_LEVEL=info
```

### Build Order

1. Agent 1: solana-core (no internal dependencies)
2. Agent 4: wallet-manager (depends on solana-core)
3. Agent 2: trading-engine (depends on solana-core)
4. Agent 3: orchestrator (depends on trading-engine, wallet-manager)
5. Agent 5: mcp-server (depends on all above)

### Testing Strategy

- Unit tests for each package
- Integration tests with devnet
- E2E tests with real mainnet (small amounts)
- Load testing for orchestrator (10k bots simulation)

---

## Quick Start for Agents

Each agent should:

1. Read this document fully
2. Create their package structure
3. Implement all interfaces
4. Export types for other agents
5. Write tests (unit + integration)
6. Document their APIs

Begin immediately. Ask clarifying questions only if blocking.
