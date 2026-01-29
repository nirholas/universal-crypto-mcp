# Agent 5: MCP Server Integration Specialist

You are Claude Opus 4.5, an expert in Model Context Protocol and system integration. Your task is to finalize the `packages/mcp-server` package - the unified interface for the complete Orbitt MCP system.

## Your Mission

Complete the MCP Server that:
1. Integrates all Orbitt packages (wallet-manager, token-launcher, trading-engine, volume-bots)
2. Exposes 50+ tools via MCP protocol
3. Provides resources and prompts for guided workflows
4. Implements enterprise-grade auth, rate limiting, and audit logging

## Build Order Context

This is the **FINAL** package to build. It depends on all others:
- `@boosty/wallet-manager` - Wallet operations
- `@boosty/token-launcher` - Token creation & LP
- `@boosty/trading-engine` - Swap execution
- `@boosty/volume-bots` - Bot orchestration

## Package: `packages/mcp-server`

### Complete Tool Registry

```typescript
// All tools exposed via MCP
const TOOLS = {
  // Wallet Tools (10)
  wallet: [
    'create_wallet',
    'create_wallet_swarm',
    'import_wallet',
    'import_mnemonic',
    'get_wallet',
    'list_wallets',
    'get_balance',
    'distribute_funds',
    'consolidate_funds',
    'transfer',
  ],

  // Token Launch Tools (8)
  token: [
    'create_token',
    'create_token_with_metadata',
    'create_raydium_pool',
    'create_pumpfun_token',
    'create_meteora_pool',
    'bundled_launch',
    'snipe_launch',
    'get_token_info',
  ],

  // Trading Tools (12)
  trading: [
    'get_swap_quote',
    'execute_swap',
    'execute_batch_swaps',
    'buy_token',
    'sell_token',
    'swap_on_raydium',
    'swap_on_pumpfun',
    'swap_on_meteora',
    'get_pool_info',
    'find_best_pool',
    'get_token_price',
    'estimate_price_impact',
  ],

  // Volume Bot Tools (15)
  bots: [
    'create_volume_campaign',
    'start_campaign',
    'pause_campaign',
    'resume_campaign',
    'stop_campaign',
    'set_campaign_speed',
    'merge_bots',
    'split_bots',
    'quick_volume_package',
    'get_campaign_status',
    'get_bot_status',
    'estimate_volume',
    'add_dexscreener_reactions',
    'add_holders',
    'get_volume_stats',
  ],

  // Analysis Tools (5)
  analysis: [
    'analyze_token',
    'get_holder_analysis',
    'get_liquidity_analysis',
    'get_volume_analysis',
    'get_market_data',
  ],
};
```

### Tool Handler Architecture

```typescript
// tools/handlers/index.ts
import { WalletManager } from '@boosty/wallet-manager';
import { TokenLauncher } from '@boosty/token-launcher';
import { TradingEngine } from '@boosty/trading-engine';
import { VolumeBots } from '@boosty/volume-bots';

export class ToolHandlers {
  private walletManager: WalletManager;
  private tokenLauncher: TokenLauncher;
  private tradingEngine: TradingEngine;
  private volumeBots: VolumeBots;

  constructor(private config: OrbittConfig) {
    this.walletManager = new WalletManager(config.database, config.encryption);
    this.tokenLauncher = new TokenLauncher(config.rpc, this.walletManager);
    this.tradingEngine = new TradingEngine(config.rpc, this.walletManager);
    this.volumeBots = new VolumeBots(this.tradingEngine, this.walletManager);
  }

  async handle(toolName: string, args: Record<string, unknown>): Promise<ToolResult> {
    const category = this.getCategory(toolName);
    
    switch (category) {
      case 'wallet':
        return this.handleWalletTool(toolName, args);
      case 'token':
        return this.handleTokenTool(toolName, args);
      case 'trading':
        return this.handleTradingTool(toolName, args);
      case 'bots':
        return this.handleBotTool(toolName, args);
      case 'analysis':
        return this.handleAnalysisTool(toolName, args);
      default:
        throw new Error(`Unknown tool: ${toolName}`);
    }
  }
}
```

### Resource Providers

```typescript
// resources/index.ts
const RESOURCES = [
  // Wallet resources
  {
    uri: 'orbitt://wallets',
    name: 'All Wallets',
    description: 'List all managed wallets with balances',
    mimeType: 'application/json',
  },
  {
    uri: 'orbitt://wallets/{id}',
    name: 'Wallet Details',
    description: 'Get wallet details including balances and history',
    mimeType: 'application/json',
  },
  {
    uri: 'orbitt://swarms',
    name: 'Wallet Swarms',
    description: 'List all wallet swarms',
    mimeType: 'application/json',
  },

  // Campaign resources
  {
    uri: 'orbitt://campaigns',
    name: 'Volume Campaigns',
    description: 'List all active and historical campaigns',
    mimeType: 'application/json',
  },
  {
    uri: 'orbitt://campaigns/{id}',
    name: 'Campaign Details',
    description: 'Get campaign status, stats, and bot details',
    mimeType: 'application/json',
  },
  {
    uri: 'orbitt://campaigns/{id}/stats',
    name: 'Campaign Statistics',
    description: 'Get detailed volume and transaction statistics',
    mimeType: 'application/json',
  },

  // Market resources
  {
    uri: 'orbitt://tokens/{mint}',
    name: 'Token Info',
    description: 'Get token metadata and market data',
    mimeType: 'application/json',
  },
  {
    uri: 'orbitt://pools/{poolId}',
    name: 'Pool Info',
    description: 'Get liquidity pool details',
    mimeType: 'application/json',
  },

  // System resources
  {
    uri: 'orbitt://system/status',
    name: 'System Status',
    description: 'Get Orbitt system health and status',
    mimeType: 'application/json',
  },
  {
    uri: 'orbitt://system/config',
    name: 'Configuration',
    description: 'Get current configuration (non-sensitive)',
    mimeType: 'application/json',
  },
];
```

### Prompt Templates

```typescript
// prompts/index.ts
const PROMPTS = [
  {
    name: 'launch_token',
    description: 'Guided workflow for launching a new token',
    arguments: [
      { name: 'name', description: 'Token name', required: true },
      { name: 'symbol', description: 'Token symbol', required: true },
      { name: 'supply', description: 'Total supply', required: true },
      { name: 'platform', description: 'Launch platform (pumpfun, raydium)', required: true },
    ],
  },
  {
    name: 'start_volume_campaign',
    description: 'Guided workflow for starting a volume boosting campaign',
    arguments: [
      { name: 'token', description: 'Token mint address', required: true },
      { name: 'budget', description: 'SOL budget for campaign', required: true },
      { name: 'duration', description: 'Campaign duration (hours)', required: true },
    ],
  },
  {
    name: 'setup_wallet_swarm',
    description: 'Guided workflow for creating and funding a wallet swarm',
    arguments: [
      { name: 'count', description: 'Number of wallets', required: true },
      { name: 'funding', description: 'SOL per wallet', required: true },
    ],
  },
  {
    name: 'analyze_token',
    description: 'Comprehensive token analysis workflow',
    arguments: [
      { name: 'token', description: 'Token mint address', required: true },
    ],
  },
  {
    name: 'dca_strategy',
    description: 'Set up dollar cost averaging strategy',
    arguments: [
      { name: 'token', description: 'Token to accumulate', required: true },
      { name: 'totalAmount', description: 'Total SOL to invest', required: true },
      { name: 'intervals', description: 'Number of buys', required: true },
    ],
  },
];
```

### Authentication & Security

```typescript
// auth/api-key.ts
interface ApiKeyConfig {
  key: string;
  permissions: Permission[];
  rateLimit: {
    maxRequests: number;
    windowMs: number;
  };
  allowedTools?: string[];
  allowedResources?: string[];
}

enum Permission {
  READ_WALLETS = 'read:wallets',
  WRITE_WALLETS = 'write:wallets',
  READ_CAMPAIGNS = 'read:campaigns',
  WRITE_CAMPAIGNS = 'write:campaigns',
  EXECUTE_TRADES = 'execute:trades',
  LAUNCH_TOKENS = 'launch:tokens',
  ADMIN = 'admin',
}

class ApiKeyAuth {
  async validateKey(key: string): Promise<ApiKeyConfig | null>;
  async checkPermission(key: string, permission: Permission): Promise<boolean>;
  async checkToolAccess(key: string, toolName: string): Promise<boolean>;
  async recordUsage(key: string): Promise<void>;
}
```

### Rate Limiting

```typescript
// auth/rate-limiter.ts
interface RateLimitConfig {
  // Global limits
  globalMaxRequestsPerMinute: number;
  globalMaxRequestsPerHour: number;

  // Per-tool limits
  toolLimits: Record<string, {
    maxPerMinute: number;
    maxPerHour: number;
    cooldownMs?: number;
  }>;

  // Trading-specific
  tradingLimits: {
    maxSwapsPerMinute: number;
    maxVolumePerDay: string;  // In SOL
    maxConcurrentCampaigns: number;
  };
}

class RateLimiter {
  async checkLimit(key: string, tool: string): Promise<RateLimitResult>;
  async recordRequest(key: string, tool: string): Promise<void>;
  async getRemainingQuota(key: string): Promise<QuotaStatus>;
}
```

### Audit Logging

```typescript
// utils/audit-logger.ts
interface AuditEntry {
  id: string;
  timestamp: Date;
  apiKey: string;
  tool: string;
  args: Record<string, unknown>;  // Sanitized
  result: 'success' | 'error';
  error?: string;
  executionTimeMs: number;

  // Context
  walletAddress?: string;
  tokenMint?: string;
  transactionSignature?: string;
  solAmount?: string;
}

class AuditLogger {
  async log(entry: Omit<AuditEntry, 'id' | 'timestamp'>): Promise<void>;
  async query(filter: AuditFilter): Promise<AuditEntry[]>;
  async getStats(timeframe: 'hour' | 'day' | 'week'): Promise<AuditStats>;
}
```

### Server Implementation

```typescript
// server.ts
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

export async function createOrbittServer(config: OrbittConfig): Promise<Server> {
  const server = new Server({
    name: 'orbitt-mcp',
    version: '1.0.0',
  }, {
    capabilities: {
      tools: {},
      resources: {},
      prompts: {},
    },
  });

  // Initialize handlers
  const handlers = new ToolHandlers(config);
  const resourceProviders = new ResourceProviders(config);
  const promptGenerator = new PromptGenerator();
  const rateLimiter = new RateLimiter(config.rateLimits);
  const auditLogger = new AuditLogger(config.database);

  // List tools
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return { tools: getAllToolDefinitions() };
  });

  // Call tool
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    const startTime = Date.now();

    try {
      // Rate limiting
      const limitResult = await rateLimiter.checkLimit(request.apiKey, name);
      if (!limitResult.allowed) {
        throw new RateLimitError(limitResult.retryAfter);
      }

      // Execute tool
      const result = await handlers.handle(name, args);

      // Audit log
      await auditLogger.log({
        apiKey: request.apiKey,
        tool: name,
        args: sanitizeArgs(args),
        result: 'success',
        executionTimeMs: Date.now() - startTime,
        transactionSignature: result.signature,
      });

      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    } catch (error) {
      await auditLogger.log({
        apiKey: request.apiKey,
        tool: name,
        args: sanitizeArgs(args),
        result: 'error',
        error: error.message,
        executionTimeMs: Date.now() - startTime,
      });

      return { content: [{ type: 'text', text: `Error: ${error.message}` }], isError: true };
    }
  });

  // List resources
  server.setRequestHandler(ListResourcesRequestSchema, async () => {
    return { resources: RESOURCES };
  });

  // Read resource
  server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const data = await resourceProviders.get(request.params.uri);
    return { contents: [{ uri: request.params.uri, mimeType: 'application/json', text: JSON.stringify(data) }] };
  });

  // List prompts
  server.setRequestHandler(ListPromptsRequestSchema, async () => {
    return { prompts: PROMPTS };
  });

  // Get prompt
  server.setRequestHandler(GetPromptRequestSchema, async (request) => {
    const messages = await promptGenerator.generate(request.params.name, request.params.arguments);
    return { messages };
  });

  return server;
}
```

### CLI Integration

```typescript
// cli.ts
import { Command } from 'commander';

const program = new Command()
  .name('orbitt')
  .description('Orbitt MCP Server')
  .version('1.0.0');

program
  .command('start')
  .description('Start the MCP server')
  .option('--dev', 'Run in development mode (devnet)')
  .option('--port <port>', 'HTTP port for health checks', '3000')
  .action(async (options) => {
    const config = await loadConfig(options.dev);
    const server = await createOrbittServer(config);
    const transport = new StdioServerTransport();
    await server.connect(transport);
  });

program
  .command('validate')
  .description('Validate configuration')
  .action(async () => {
    const config = await loadConfig(false);
    console.log('✓ Configuration valid');
  });

program
  .command('db:init')
  .description('Initialize database schema')
  .action(async () => {
    await initializeDatabase();
    console.log('✓ Database initialized');
  });

program.parse();
```

### File Structure

```
packages/mcp-server/
├── package.json
├── tsconfig.json
├── mcp-manifest.json
├── config/
│   └── default.json
├── src/
│   ├── index.ts
│   ├── server.ts
│   ├── cli.ts
│   ├── types.ts
│   ├── tools/
│   │   ├── index.ts
│   │   ├── definitions/
│   │   │   ├── wallet.ts
│   │   │   ├── token.ts
│   │   │   ├── trading.ts
│   │   │   ├── bots.ts
│   │   │   └── analysis.ts
│   │   └── handlers/
│   │       ├── index.ts
│   │       ├── wallet.ts
│   │       ├── token.ts
│   │       ├── trading.ts
│   │       ├── bots.ts
│   │       └── analysis.ts
│   ├── resources/
│   │   ├── index.ts
│   │   ├── wallets.ts
│   │   ├── campaigns.ts
│   │   ├── tokens.ts
│   │   └── system.ts
│   ├── prompts/
│   │   ├── index.ts
│   │   └── templates.ts
│   ├── auth/
│   │   ├── api-key.ts
│   │   └── rate-limiter.ts
│   ├── config/
│   │   ├── schema.ts
│   │   └── loader.ts
│   └── utils/
│       ├── logger.ts
│       └── audit.ts
```

### MCP Manifest

```json
{
  "name": "orbitt-mcp",
  "version": "1.0.0",
  "description": "Volume boosting and token management for Solana",
  "tools": [
    {
      "name": "create_wallet_swarm",
      "description": "Create multiple wallets for trading operations",
      "inputSchema": {
        "type": "object",
        "properties": {
          "count": { "type": "number", "description": "Number of wallets (max 100)" },
          "fundingSol": { "type": "string", "description": "SOL per wallet" }
        },
        "required": ["count"]
      }
    },
    {
      "name": "start_volume_campaign",
      "description": "Start a volume boosting campaign",
      "inputSchema": {
        "type": "object",
        "properties": {
          "tokenMint": { "type": "string", "description": "Token mint address" },
          "budgetSol": { "type": "string", "description": "SOL budget" },
          "targetVolumeUsd": { "type": "number", "description": "Target 24h volume in USD" },
          "durationHours": { "type": "number", "description": "Campaign duration" }
        },
        "required": ["tokenMint", "budgetSol"]
      }
    }
  ],
  "resources": [
    {
      "uri": "orbitt://wallets",
      "name": "Managed Wallets",
      "mimeType": "application/json"
    },
    {
      "uri": "orbitt://campaigns",
      "name": "Volume Campaigns",
      "mimeType": "application/json"
    }
  ],
  "prompts": [
    {
      "name": "launch_token",
      "description": "Launch a new token with volume boosting"
    },
    {
      "name": "start_volume_campaign",
      "description": "Start a volume boosting campaign"
    }
  ]
}
```

### Dependencies

```json
{
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.0.0",
    "@boosty/wallet-manager": "workspace:*",
    "@boosty/token-launcher": "workspace:*",
    "@boosty/trading-engine": "workspace:*",
    "@boosty/volume-bots": "workspace:*",
    "commander": "^12.0.0",
    "zod": "^3.22.0",
    "pino": "^8.17.0"
  }
}
```

## Integration Checklist

- [ ] All wallet-manager tools exposed
- [ ] All token-launcher tools exposed
- [ ] All trading-engine tools exposed
- [ ] All volume-bots tools exposed
- [ ] All resources return proper data
- [ ] All prompts generate valid workflows
- [ ] Rate limiting functional
- [ ] Audit logging captures all operations
- [ ] Error handling graceful
- [ ] CLI commands work
- [ ] Health check endpoint
- [ ] Metrics collection

## Testing

1. Unit tests for each tool handler
2. Integration tests with actual packages
3. E2E tests via MCP client
4. Load testing for concurrent operations

Begin implementation immediately. Ensure seamless integration of all packages.
