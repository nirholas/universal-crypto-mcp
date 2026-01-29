# DeFi MCP Server

Production-ready MCP server for DeFi operations on Solana, including wallet management, trading, and volume generation campaigns.

## Features

- **Wallet Management**: Create, fund, and manage multiple wallets
- **Trading**: Execute swaps via Jupiter aggregator with MEV protection
- **Volume Campaigns**: Automated volume generation with configurable bots
- **Market Analysis**: Token info, liquidity analysis, holder distribution
- **Full MCP Compliance**: Tools, Resources, and Prompts

## Installation

```bash
npm install @defi-mcp/server
# or
pnpm add @defi-mcp/server
```

## Usage

### CLI

```bash
# Start the MCP server
npx @defi-mcp/server start

# With custom config
npx @defi-mcp/server start --config ./config.json

# Development mode
npx @defi-mcp/server start --dev

# Initialize database
npx @defi-mcp/server db:init

# Validate configuration
npx @defi-mcp/server validate
```

### Claude Desktop Configuration

Add to your Claude Desktop config:

```json
{
  "mcpServers": {
    "defi": {
      "command": "npx",
      "args": ["@defi-mcp/server", "start"],
      "env": {
        "SOLANA_RPC_URL": "https://mainnet.helius-rpc.com/?api-key=YOUR_KEY",
        "DATABASE_URL": "postgresql://user:pass@localhost:5432/defi",
        "MASTER_PASSWORD": "your-secure-password",
        "LOG_LEVEL": "info"
      }
    }
  }
}
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `SOLANA_RPC_URL` | Solana RPC endpoint | `https://api.mainnet-beta.solana.com` |
| `SOLANA_NETWORK` | Network (mainnet-beta/devnet) | `mainnet-beta` |
| `DATABASE_HOST` | PostgreSQL host | `localhost` |
| `DATABASE_PORT` | PostgreSQL port | `5432` |
| `DATABASE_NAME` | Database name | `defi_mcp` |
| `DATABASE_USER` | Database user | `postgres` |
| `DATABASE_PASSWORD` | Database password | - |
| `REDIS_HOST` | Redis host | `localhost` |
| `REDIS_PORT` | Redis port | `6379` |
| `MASTER_PASSWORD` | Encryption master password | - |
| `LOG_LEVEL` | Log level | `info` |
| `REQUIRE_AUTH` | Require API key auth | `true` |
| `API_KEYS` | Comma-separated API keys | - |

## Available Tools

### Wallet Management
- `create_wallet_swarm` - Create multiple wallets
- `get_wallet_balances` - Get wallet balances
- `distribute_funds` - Distribute SOL to wallets
- `consolidate_funds` - Consolidate SOL from wallets
- `list_wallets` - List all wallets
- `delete_wallet` - Delete a wallet

### Trading
- `execute_swap` - Execute a token swap
- `get_swap_quote` - Get a swap quote
- `execute_batch_swaps` - Execute multiple swaps
- `buy_token` - Buy a token with SOL
- `sell_token` - Sell a token for SOL

### Campaigns
- `create_volume_campaign` - Create a campaign
- `start_campaign` - Start a campaign
- `pause_campaign` - Pause a campaign
- `stop_campaign` - Stop a campaign
- `get_campaign_status` - Get campaign status
- `get_campaign_metrics` - Get campaign metrics
- `list_campaigns` - List all campaigns

### Market Analysis
- `get_token_info` - Get token information
- `get_pool_info` - Get liquidity pool info
- `get_price_history` - Get price history
- `analyze_liquidity` - Analyze token liquidity
- `get_top_holders` - Get top token holders
- `get_market_overview` - Get market overview

### Bot Management
- `create_bot` - Create a trading bot
- `configure_bot` - Configure a bot
- `start_bot` - Start a bot
- `stop_bot` - Stop a bot
- `get_bot_status` - Get bot status
- `list_active_bots` - List active bots

## Resources

- `wallets://list` - List all wallets
- `wallets://{walletId}` - Wallet details
- `campaigns://list` - List campaigns
- `campaigns://{campaignId}` - Campaign details
- `campaigns://{campaignId}/metrics` - Campaign metrics
- `bots://list` - List bots
- `bots://{botId}/status` - Bot status
- `tokens://{mint}/info` - Token info

## Prompts

- `volume_campaign_wizard` - Interactive campaign setup
- `wallet_setup_guide` - Wallet setup guide
- `analyze_token_for_trading` - Token analysis
- `campaign_optimization_report` - Campaign optimization

## License

MIT
