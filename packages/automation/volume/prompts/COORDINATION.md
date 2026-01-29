# Multi-Agent Coordination Guide

## Quick Start

Copy each agent prompt from `/prompts/agent-{1-5}-*.md` into separate Claude Opus 4.5 sessions. Run them in dependency order.

## Build Order

```
1. Agent 1: solana-core      (no dependencies)
2. Agent 4: wallet-manager   (depends on solana-core)
3. Agent 2: trading-engine   (depends on solana-core)
4. Agent 3: orchestrator     (depends on trading-engine, wallet-manager)
5. Agent 5: mcp-server       (depends on all above)
```

## Parallel Execution

Agents 1 can run first, then 2 and 4 can run in parallel, then 3, then 5.

```
        ┌─────────────┐
        │   Agent 1   │
        │ solana-core │
        └──────┬──────┘
               │
       ┌───────┴───────┐
       │               │
┌──────▼─────┐  ┌──────▼─────┐
│  Agent 4   │  │  Agent 2   │
│wallet-mgr  │  │trading-eng │
└──────┬─────┘  └──────┬─────┘
       │               │
       └───────┬───────┘
               │
        ┌──────▼──────┐
        │   Agent 3   │
        │orchestrator │
        └──────┬──────┘
               │
        ┌──────▼──────┐
        │   Agent 5   │
        │ mcp-server  │
        └─────────────┘
```

## Environment Setup

Before running agents, ensure these are available:

### Required Services
```bash
# PostgreSQL
docker run -d --name postgres \
  -e POSTGRES_USER=defi \
  -e POSTGRES_PASSWORD=defi123 \
  -e POSTGRES_DB=defi \
  -p 5432:5432 \
  postgres:16

# Redis
docker run -d --name redis \
  -p 6379:6379 \
  redis:7-alpine
```

### Required API Keys
- `HELIUS_API_KEY` - Get from https://helius.dev
- `QUICKNODE_ENDPOINT` - Get from https://quicknode.com (optional)

### Environment File
Create `.env` in repo root:
```env
# Solana
SOLANA_NETWORK=mainnet-beta
HELIUS_API_KEY=your-helius-key
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com

# Database
DATABASE_URL=postgresql://defi:defi123@localhost:5432/defi

# Redis
REDIS_URL=redis://localhost:6379

# Security
MASTER_PASSWORD=your-32-char-secure-password-here
ENCRYPTION_KEY=auto-derived-from-master

# Logging
LOG_LEVEL=info
NODE_ENV=production
```

## Integration Testing

After all agents complete, test integration:

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run database migrations
pnpm --filter @defi-mcp/mcp-server db:migrate

# Start MCP server
pnpm --filter @defi-mcp/mcp-server start
```

## Claude Desktop Setup

Add to Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json` on Mac):

```json
{
  "mcpServers": {
    "defi": {
      "command": "node",
      "args": ["/path/to/defi-mcp-servers/packages/mcp-server/dist/cli.js", "start"],
      "env": {
        "SOLANA_RPC_URL": "https://mainnet.helius-rpc.com/?api-key=YOUR_KEY",
        "HELIUS_API_KEY": "your-helius-key",
        "REDIS_URL": "redis://localhost:6379",
        "DATABASE_URL": "postgresql://defi:defi123@localhost:5432/defi",
        "MASTER_PASSWORD": "your-secure-password"
      }
    }
  }
}
```

## Example Usage in Claude

Once configured, you can ask Claude:

```
"Create 100 wallets tagged 'campaign-1' and fund each with 0.1 SOL"

"Set up a volume campaign for token ABC123... with 50 SOL target over 24 hours"

"Show me the status of all active campaigns"

"Get a swap quote for 1 SOL to BONK"

"Execute a swap of 0.5 SOL to USDC using my wallet xyz"
```

## Troubleshooting

### Agent Issues

1. **Missing dependencies**: Run `pnpm install` in repo root
2. **Type errors**: Ensure agents use shared interfaces from `@defi-mcp/shared`
3. **Import errors**: All packages must export via `src/index.ts`

### Runtime Issues

1. **RPC errors**: Check API keys, try fallback endpoints
2. **Database connection**: Ensure PostgreSQL is running
3. **Redis connection**: Ensure Redis is running

## Package Structure Summary

```
packages/
├── shared/          # Existing - shared utilities
├── solana-core/     # Agent 1 - Solana primitives
├── wallet-manager/  # Agent 4 - Wallet management
├── trading-engine/  # Agent 2 - DEX integrations
├── orchestrator/    # Agent 3 - Bot coordination
└── mcp-server/      # Agent 5 - MCP protocol server
```
