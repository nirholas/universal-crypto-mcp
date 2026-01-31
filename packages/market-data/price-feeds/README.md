# CoinGecko MCP Server

> Official CoinGecko API integration for comprehensive cryptocurrency market data.

## Attribution

**Original Author:** [CoinGecko](https://github.com/coingecko)  
**Original Repository:** [coingecko-typescript](https://github.com/coingecko/coingecko-typescript/tree/main/packages/mcp-server)  
**License:** MIT

**Integration & Enhancements by:** Nich ([@nichxbt](https://x.com/nichxbt))

## Features

### From Original CoinGecko SDK
- ✅ 200+ blockchain networks
- ✅ 8M+ tokens coverage
- ✅ Real-time price data
- ✅ Market cap rankings
- ✅ 24h volume data
- ✅ Historical price data
- ✅ OHLC data
- ✅ Trending coins
- ✅ Exchange data
- ✅ NFT data

### Our Enhancements (Apache-2.0)
- ✅ Unified API compatibility
- ✅ Batch token queries
- ✅ Caching layer for rate limits
- ✅ WebSocket streaming support
- ✅ Multi-currency comparisons
- ✅ Portfolio tracking integration

## Installation

```bash
pnpm add @nirholas/coingecko-mcp
```

## Usage

### With MCP Server

```typescript
import { registerCoinGeckoTools } from '@nirholas/coingecko-mcp';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

const server = new McpServer({ name: 'my-crypto-server', version: '1.0.0' });
registerCoinGeckoTools(server);
```

### Standalone

```typescript
import { CoinGeckoClient } from '@nirholas/coingecko-mcp';

const client = new CoinGeckoClient({ apiKey: process.env.COINGECKO_API_KEY });

// Get Bitcoin price
const btcPrice = await client.getPrice('bitcoin', 'usd');

// Get top 100 coins by market cap
const topCoins = await client.getTopCoins(100);

// Get historical data
const history = await client.getHistoricalData('ethereum', 30);
```

## Available Tools

| Tool | Description |
|------|-------------|
| `coingecko_price` | Get current price for a coin |
| `coingecko_prices_batch` | Get prices for multiple coins |
| `coingecko_market_data` | Get comprehensive market data |
| `coingecko_top_coins` | Get top coins by market cap |
| `coingecko_trending` | Get trending coins |
| `coingecko_historical` | Get historical price data |
| `coingecko_ohlc` | Get OHLC candlestick data |
| `coingecko_exchanges` | Get exchange data |
| `coingecko_search` | Search for coins/tokens |
| `coingecko_global` | Get global crypto stats |

## API Key

Get your API key at [CoinGecko API](https://www.coingecko.com/en/api).

```bash
export COINGECKO_API_KEY=your_api_key_here
```

## License

- Original Implementation: MIT (CoinGecko)
- Enhancements: Apache-2.0 (Nich)
