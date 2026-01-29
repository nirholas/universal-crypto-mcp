# boosty MCP Prices Server

Real-time DeFi price data server using Model Context Protocol.

## Installation

```bash
npm install @boosty/mcp-prices
```

## Usage

### As MCP Server

```bash
# Run directly
npx boosty-mcp-prices

# Or install globally
npm install -g @boosty/mcp-prices
boosty-mcp-prices
```

### With Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "prices": {
      "command": "npx",
      "args": ["boosty-mcp-prices"]
    }
  }
}
```

### Programmatic Usage

```typescript
import { pricesServer, getTokenPrice, comparePrices } from '@boosty/mcp-prices';

// Get single token price
const btcPrice = await getTokenPrice({ symbol: 'BTC' });
console.log(btcPrice);

// Compare multiple tokens
const comparison = await comparePrices({
  symbols: ['BTC', 'ETH', 'ARB'],
  currency: 'usd'
});
console.log(comparison);
```

## Available Tools

### getTokenPrice

Get current price and market data for a token.

**Input:**
- `symbol` (string, required): Token symbol (e.g., BTC, ETH, ARB)
- `currency` (string, optional): Currency for price (default: usd)

**Output:**
```json
{
  "symbol": "BTC",
  "price": 50000,
  "change24h": 2.5,
  "marketCap": 1000000000000,
  "volume24h": 50000000000,
  "currency": "USD",
  "lastUpdated": "2024-01-01T00:00:00.000Z"
}
```

### getTokenPriceHistory

Get historical price data for a token.

**Input:**
- `symbol` (string, required): Token symbol
- `days` (number, required): Number of days of history (1-365)
- `currency` (string, optional): Currency for price (default: usd)

**Output:**
```json
{
  "symbol": "BTC",
  "currency": "USD",
  "days": 7,
  "prices": [
    { "timestamp": 1704067200000, "date": "2024-01-01T00:00:00.000Z", "price": 42000 }
  ],
  "highestPrice": 44000,
  "lowestPrice": 42000,
  "averagePrice": 43000,
  "priceChange": 2000,
  "priceChangePercent": 4.76
}
```

### getGasPrices

Get current gas prices for EVM chains.

**Input:**
- `chain` (string, optional): Chain name (ethereum, arbitrum, base, polygon, optimism, avalanche)

**Output:**
```json
{
  "gasPrices": [
    {
      "chain": "Ethereum",
      "chainId": 1,
      "low": 20,
      "medium": 25,
      "high": 30,
      "baseFee": 18,
      "timestamp": "2024-01-01T00:00:00.000Z",
      "unit": "gwei"
    }
  ],
  "supportedChains": ["ethereum", "arbitrum", "base", "polygon", "optimism", "avalanche"]
}
```

### getTopMovers

Get top gaining and losing tokens.

**Input:**
- `timeframe` (string, optional): "1h", "24h", or "7d" (default: 24h)
- `limit` (number, optional): Number of tokens per category (default: 10, max: 50)
- `direction` (string, optional): "gainers", "losers", or "both" (default: both)

**Output:**
```json
{
  "timeframe": "24h",
  "gainers": [
    { "rank": 1, "symbol": "TEST", "name": "Test", "price": 1, "priceChange": 25, "marketCap": 1000000, "volume24h": 100000 }
  ],
  "losers": [
    { "rank": 2, "symbol": "FAIL", "name": "Fail", "price": 0.5, "priceChange": -10, "marketCap": 500000, "volume24h": 50000 }
  ],
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### getFearGreedIndex

Get the Crypto Fear & Greed Index.

**Input:** None

**Output:**
```json
{
  "value": 65,
  "classification": "Greed",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "timeUntilUpdate": "3600",
  "historicalComparison": {
    "yesterday": 60,
    "lastWeek": 55,
    "lastMonth": 45
  }
}
```

### comparePrices

Compare prices of multiple tokens.

**Input:**
- `symbols` (string[], required): Array of token symbols (max 25)
- `currency` (string, optional): Currency for price (default: usd)

**Output:**
```json
{
  "currency": "USD",
  "tokens": [
    { "symbol": "BTC", "price": 50000, "change24h": 2.5, "marketCap": 1000000000000, "volume24h": 50000000000, "rank": 1 }
  ],
  "highestPrice": { "symbol": "BTC", ... },
  "lowestPrice": { "symbol": "DOGE", ... },
  "highestChange": { "symbol": "TEST", ... },
  "lowestChange": { "symbol": "FAIL", ... },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `COINGECKO_API_KEY` | Optional CoinGecko demo API key for higher rate limits |
| `COINGECKO_PRO_API_KEY` | Optional CoinGecko Pro API key |
| `ETHERSCAN_API_KEY` | API key for Etherscan gas oracle |
| `ARBISCAN_API_KEY` | API key for Arbiscan gas oracle |
| `BASESCAN_API_KEY` | API key for Basescan gas oracle |
| `POLYGONSCAN_API_KEY` | API key for Polygonscan gas oracle |
| `OPTIMISM_ETHERSCAN_API_KEY` | API key for Optimism explorer |
| `SNOWTRACE_API_KEY` | API key for Snowtrace (Avalanche) |
| `ETHEREUM_RPC_URL` | Custom Ethereum RPC URL |
| `ARBITRUM_RPC_URL` | Custom Arbitrum RPC URL |
| `BASE_RPC_URL` | Custom Base RPC URL |
| `POLYGON_RPC_URL` | Custom Polygon RPC URL |
| `OPTIMISM_RPC_URL` | Custom Optimism RPC URL |
| `AVALANCHE_RPC_URL` | Custom Avalanche RPC URL |

## Data Sources

- **Token Prices**: CoinGecko API (free tier, 50 req/min)
- **Gas Prices**: Block explorer APIs (Etherscan, Arbiscan, etc.) or public RPCs
- **Fear & Greed Index**: alternative.me API

## Caching

| Data | Cache Duration |
|------|----------------|
| Token Price | 30 seconds |
| Price History | 5 minutes |
| Gas Prices | 10 seconds |
| Top Movers | 1 minute |
| Fear & Greed Index | 1 hour |

## License

MIT
