# 📈 Market Data MCP Servers

> Real-time prices, news, analytics, whale tracking, and sentiment data for AI agents

## Overview

This package provides comprehensive market data tools for AI agents. Get real-time prices, breaking crypto news, on-chain analytics, whale movement tracking, and market sentiment indicators.

## Available Servers

### 💰 Prices
Multi-source price data:
- **CoinGecko** - Comprehensive crypto prices, market caps, volume
- **DexPaprika** - DEX prices and liquidity data
- **CoinMarketCap** - Top cryptocurrencies data

### 📰 News
Real-time crypto news:
- **CryptoPanic** - Breaking news and social media aggregation
- **Free Crypto News** - Open news feed

### 🔬 Analytics
On-chain analytics:
- **Whale Tracker** - Track large wallet movements
- **Fear & Greed Index** - Market sentiment indicators
- **Dune Analytics** - Custom on-chain queries
- **Web3 Stats** - Network statistics

### 🔮 Predictions
Market predictions and signals:
- AI-powered price predictions
- Technical analysis indicators

## Installation

```bash
# From workspace root
pnpm install

# Build market-data packages
pnpm --filter "@nirholas/crypto-market-data" build
```

## Configuration

```bash
# CryptoPanic
CRYPTOPANIC_API_KEY=your_api_key

# CoinGecko Pro (optional)
COINGECKO_API_KEY=your_api_key

# Dune Analytics
DUNE_API_KEY=your_api_key
```

## Usage

### Claude Desktop Configuration

```json
{
  "mcpServers": {
    "market-data": {
      "command": "node",
      "args": ["packages/market-data/prices/coingecko/dist/index.js"]
    },
    "crypto-news": {
      "command": "node",
      "args": ["packages/market-data/news/cryptopanic/dist/index.js"],
      "env": {
        "CRYPTOPANIC_API_KEY": "your_key"
      }
    },
    "whale-tracker": {
      "command": "node",
      "args": ["packages/market-data/analytics/whale-tracker/dist/index.js"]
    }
  }
}
```

## Available Tools

### Price Tools
| Tool | Description |
|------|-------------|
| `get_price` | Get current price for a coin |
| `get_prices` | Get prices for multiple coins |
| `get_market_data` | Get comprehensive market data |
| `get_historical_prices` | Get historical price data |
| `get_dex_price` | Get DEX price and liquidity |

### News Tools
| Tool | Description |
|------|-------------|
| `get_latest_news` | Get breaking crypto news |
| `search_news` | Search news by keyword/coin |
| `get_trending_news` | Get trending stories |

### Analytics Tools
| Tool | Description |
|------|-------------|
| `track_whales` | Monitor large wallet movements |
| `get_fear_greed_index` | Get current fear/greed value |
| `run_dune_query` | Execute Dune Analytics queries |
| `get_network_stats` | Get blockchain network statistics |

## Data Sources

| Source | Rate Limit | Free Tier |
|--------|------------|-----------|
| CoinGecko | 10-50 req/min | Yes |
| CryptoPanic | 5 req/sec | Yes |
| Dune | 10 req/min | Yes |
| DexPaprika | 100 req/min | Yes |

## License

Apache-2.0 / MIT (varies by integration)

---

## 👤 Author

**nich** - Building the most extensive crypto MCP repository

- 🐙 GitHub: [@nirholas](https://github.com/nirholas)
- 🐦 Twitter: [@nichxbt](https://x.com/nichxbt)
- 📦 NPM: [@nirholas](https://www.npmjs.com/~nirholas)

## 🤝 Contributing

Contributions welcome! See [CONTRIBUTING.md](../../CONTRIBUTING.md)

## 📄 License

Apache-2.0 - see [LICENSE](../../LICENSE)
