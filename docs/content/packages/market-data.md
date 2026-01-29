# Market Data Package

The market data package provides comprehensive cryptocurrency price data, analytics, and news from multiple providers.

## Installation

```bash
npm install @universal-crypto-mcp/market-data-aggregator
npm install @universal-crypto-mcp/market-data-coingecko
npm install @universal-crypto-mcp/market-data-news
```

## Supported Providers

| Provider | Package | Features |
|----------|---------|----------|
| CoinGecko | `market-data-coingecko` | Prices, market cap, OHLCV |
| DexPaprika | `market-data-aggregator` | DEX prices, pools |
| CryptoPanic | `market-data-news` | News, sentiment |
| DefiLlama | `market-data-aggregator` | TVL, yields, protocols |
| LunarCrush | `market-data-aggregator` | Social sentiment |

## Configuration

### Environment Variables

```bash
COINGECKO_API_KEY=your-api-key  # Optional, increases rate limits
CRYPTOPANIC_API_KEY=your-api-key  # Required for news
```

## Available Tools

### Price Tools

| Tool | Description |
|------|-------------|
| `get_price` | Get current price for a token |
| `get_prices` | Get prices for multiple tokens |
| `get_ohlcv` | Get OHLCV candlestick data |
| `get_price_history` | Get historical prices |
| `get_price_change` | Get price change over time |

### Market Tools

| Tool | Description |
|------|-------------|
| `get_market_cap` | Get market capitalization |
| `get_volume` | Get trading volume |
| `get_trending` | Get trending coins |
| `get_top_gainers` | Get top gaining coins |
| `get_top_losers` | Get top losing coins |

### Analytics Tools

| Tool | Description |
|------|-------------|
| `get_fear_greed` | Get Fear & Greed Index |
| `get_whale_activity` | Track whale movements |
| `get_tvl` | Get protocol TVL |
| `get_yields` | Get DeFi yields |
| `get_social_sentiment` | Get social metrics |

### News Tools

| Tool | Description |
|------|-------------|
| `get_news` | Get crypto news |
| `get_news_by_coin` | Get news for specific coin |
| `get_trending_topics` | Get trending topics |

## Usage Examples

### Get Token Price

```typescript
import { registerMarketDataTools } from "@universal-crypto-mcp/market-data-aggregator";

registerMarketDataTools(server);

// AI command: "What's the price of ETH?"
// Tool called: get_price
// Response:
{
  symbol: "ETH",
  name: "Ethereum",
  price: 3456.78,
  change24h: 2.34,
  marketCap: 415000000000,
  volume24h: 12500000000,
  lastUpdated: "2024-01-15T12:00:00Z"
}
```

### Get Multiple Prices

```typescript
// AI command: "Get prices for BTC, ETH, and SOL"
// Tool called: get_prices
// Parameters:
{
  symbols: ["BTC", "ETH", "SOL"]
}

// Response:
{
  prices: [
    { symbol: "BTC", price: 67890.12, change24h: 1.5 },
    { symbol: "ETH", price: 3456.78, change24h: 2.34 },
    { symbol: "SOL", price: 123.45, change24h: -0.8 }
  ]
}
```

### Get OHLCV Data

```typescript
// AI command: "Get daily BTC candles for the last week"
// Tool called: get_ohlcv
// Parameters:
{
  symbol: "BTC",
  interval: "1d",
  limit: 7
}

// Response:
{
  symbol: "BTC",
  interval: "1d",
  candles: [
    {
      timestamp: "2024-01-15T00:00:00Z",
      open: 67000,
      high: 68500,
      low: 66500,
      close: 67890,
      volume: 25000000000
    },
    // ... more candles
  ]
}
```

### Get Trending Coins

```typescript
// AI command: "What coins are trending right now?"
// Tool called: get_trending
// Response:
{
  trending: [
    {
      rank: 1,
      symbol: "PEPE",
      name: "Pepe",
      price: 0.00001234,
      change24h: 45.6,
      marketCap: 5000000000
    },
    // ... more trending coins
  ]
}
```

### Get Fear & Greed Index

```typescript
// AI command: "What's the current market sentiment?"
// Tool called: get_fear_greed
// Response:
{
  value: 72,
  classification: "Greed",
  timestamp: "2024-01-15T12:00:00Z",
  history: [
    { date: "2024-01-14", value: 68, classification: "Greed" },
    { date: "2024-01-13", value: 65, classification: "Greed" },
    // ... more history
  ]
}
```

### Get Crypto News

```typescript
// AI command: "Get the latest crypto news"
// Tool called: get_news
// Parameters:
{
  limit: 10,
  filter: "hot"
}

// Response:
{
  articles: [
    {
      title: "Bitcoin Hits New High...",
      source: "CoinDesk",
      url: "https://...",
      publishedAt: "2024-01-15T10:00:00Z",
      sentiment: "positive",
      coins: ["BTC"]
    },
    // ... more articles
  ]
}
```

### Get Protocol TVL

```typescript
// AI command: "What's the TVL on Aave?"
// Tool called: get_tvl
// Parameters:
{
  protocol: "aave"
}

// Response:
{
  protocol: "Aave",
  tvl: 12500000000,
  change24h: 1.2,
  chains: {
    ethereum: 8000000000,
    polygon: 2000000000,
    arbitrum: 1500000000,
    avalanche: 1000000000
  }
}
```

## Provider Aggregation

The aggregator package combines data from multiple sources:

```typescript
import { MarketDataAggregator } from "@universal-crypto-mcp/market-data-aggregator";

const aggregator = new MarketDataAggregator({
  providers: ["coingecko", "dexpaprika", "defillama"],
  caching: {
    enabled: true,
    ttl: 30000  // 30 seconds
  }
});

// Get price with fallback
const price = await aggregator.getPrice("ETH");
// Tries CoinGecko first, falls back to DexPaprika if unavailable
```

## Caching

Market data is cached to reduce API calls:

```typescript
import { setCache } from "@universal-crypto-mcp/market-data-aggregator";

setCache({
  enabled: true,
  ttl: {
    prices: 30000,    // 30 seconds
    ohlcv: 60000,     // 1 minute
    trending: 300000, // 5 minutes
    news: 600000      // 10 minutes
  }
});
```

## Rate Limiting

Each provider has different rate limits:

| Provider | Free Tier | Pro Tier |
|----------|-----------|----------|
| CoinGecko | 10-30/min | 500/min |
| DexPaprika | 100/min | Unlimited |
| CryptoPanic | 5/min | 100/min |
| DefiLlama | Unlimited | Unlimited |

The package handles rate limiting automatically.

## Related Packages

- [Trading Package](trading.md) - Exchange trading
- [DeFi Package](defi.md) - Protocol analytics
- [Core Package](core.md) - Shared utilities
