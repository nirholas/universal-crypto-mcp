# Crypto Price Oracle MCP

> **Part of [Universal Crypto MCP](https://github.com/nirholas/universal-crypto-mcp)**  
> By [nich](https://x.com/nichxbt)

Multi-source crypto price aggregation with advanced oracle features.

## Features

- 📊 **Multi-Source Aggregation** - Binance, Coinbase, CoinGecko, Kraken, OKX
- 📈 **TWAP/VWAP** - Time and Volume weighted averages
- ✅ **Confidence Scoring** - Outlier detection and reliability metrics
- 📉 **Historical Data** - Price history with high/low analysis
- ⚡ **Arbitrage Detection** - Cross-source price comparison

## Tools

| Tool | Description |
|------|-------------|
| `price_oracle_get` | Get aggregated price with confidence |
| `price_oracle_historical` | Get historical price data |
| `price_oracle_compare` | Compare prices across sources |

## Usage

```typescript
import { registerCryptoPriceOracle } from '@nirholas/crypto-price-oracle';

registerCryptoPriceOracle(server);
```

## License

MIT - See [LICENSE](./LICENSE)

---
**Author**: nich (@nichxbt) | [x.com/nichxbt](https://x.com/nichxbt)
