# CoinStats MCP Server

> Official CoinStats API integration for portfolio tracking and market data.

## Attribution

**Original Author:** [CoinStats](https://github.com/CoinStatsHQ)  
**Original Repository:** [coinstats-mcp](https://github.com/CoinStatsHQ/coinstats-mcp)  
**License:** MIT

**Integration & Enhancements by:** Nich ([@nichxbt](https://x.com/nichxbt))

## Features

### From Original Implementation
- ✅ Portfolio tracking
- ✅ Real-time market data
- ✅ Crypto news aggregation
- ✅ Price alerts
- ✅ Multi-wallet support
- ✅ Transaction history

### Our Enhancements (Apache-2.0)
- ✅ Unified API compatibility
- ✅ Cross-portfolio analytics
- ✅ PnL calculations
- ✅ Tax reporting helpers
- ✅ Portfolio rebalancing suggestions

## Installation

```bash
pnpm add @nirholas/coinstats-mcp
```

## Configuration

```bash
export COINSTATS_API_KEY=your_api_key
```

Get your API key at [CoinStats API](https://coinstats.app/api)

## Usage

### With MCP Server

```typescript
import { registerCoinStatsTools } from '@nirholas/coinstats-mcp';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

const server = new McpServer({ name: 'my-portfolio-server', version: '1.0.0' });
registerCoinStatsTools(server);
```

### Standalone

```typescript
import { CoinStatsClient } from '@nirholas/coinstats-mcp';

const client = new CoinStatsClient({ apiKey: process.env.COINSTATS_API_KEY });

// Get portfolio summary
const portfolio = await client.getPortfolio();

// Get market data
const markets = await client.getMarkets({ limit: 100 });

// Get crypto news
const news = await client.getNews({ limit: 20 });
```

## Available Tools

| Tool | Description |
|------|-------------|
| `coinstats_portfolio` | Get portfolio summary and holdings |
| `coinstats_markets` | Get market data for cryptocurrencies |
| `coinstats_coin` | Get detailed coin information |
| `coinstats_news` | Get latest crypto news |
| `coinstats_portfolio_pnl` | Calculate portfolio profit/loss |
| `coinstats_transactions` | Get transaction history |
| `coinstats_alerts` | Manage price alerts |

## Example Queries

```
Show my crypto portfolio performance
```

```
What are the top 20 cryptocurrencies by market cap?
```

```
Get the latest crypto news
```

## License

- Original Implementation: MIT (CoinStats)
- Enhancements: Apache-2.0 (Nich)
