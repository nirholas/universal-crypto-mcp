# Community Integration Guide

## Overview

Universal Crypto MCP now integrates **8+ additional community MCP servers** with proper attribution to original authors. All integrations maintain MIT license compliance while adding enhancements for unified API access.

## Maintainer

- **Nich** ([@nichxbt](https://x.com/nichxbt)) - [github.com/nirholas](https://github.com/nirholas)

## New Market Data Capabilities

### 1. Technical Indicators (Kukapay)

Calculate technical analysis indicators for any cryptocurrency:

```typescript
// RSI (Relative Strength Index)
const rsi = await tools.calculate_rsi({
  symbol: "BTC/USDT",
  period: 14,
  timeframe: "1h"
});

// MACD
const macd = await tools.calculate_macd({
  symbol: "ETH/USDT",
  fast: 12,
  slow: 26,
  signal: 9
});

// Bollinger Bands
const bands = await tools.calculate_bollinger_bands({
  symbol: "SOL/USDT",
  period: 20,
  stdDev: 2
});
```

**Available Indicators:**
- RSI (Relative Strength Index)
- MACD (Moving Average Convergence Divergence)
- Bollinger Bands
- SMA (Simple Moving Average)
- EMA (Exponential Moving Average)
- Stochastic Oscillator
- ATR (Average True Range)

### 2. Sentiment Analysis (Kukapay)

Multi-source cryptocurrency sentiment analysis:

```typescript
const sentiment = await tools.analyze_sentiment({
  symbol: "BTC",
  sources: ["twitter", "reddit", "news"],
  timeframe: "24h"
});
```

**Data Sources:**
- Twitter/X mentions and hashtags
- Reddit discussions (r/cryptocurrency, r/Bitcoin, etc.)
- News article sentiment
- Social volume metrics
- Influencer sentiment tracking

### 3. Fear & Greed Index (Kukapay)

Track market psychology with the Fear & Greed Index:

```typescript
// Current index
const current = await tools.get_fear_greed_index({ days: 1 });

// Historical data
const history = await tools.get_fear_greed_index({ days: 30 });

// With ML predictions
const forecast = await tools.get_fear_greed_index({ 
  days: 7,
  includePrediction: true 
});
```

**Index Components:**
- Volatility (25%)
- Market Momentum/Volume (25%)
- Social Media (15%)
- Surveys (15%)
- Bitcoin Dominance (10%)
- Google Trends (10%)

### 4. Unified Market Overview

Get a complete market analysis combining all signals:

```typescript
const overview = await tools.get_market_overview({
  symbol: "BTC",
  includeIndicators: true,
  includeSentiment: true,
  includeFearGreed: true,
  includeNews: true
});
```

**Returns:**
- Technical indicators (RSI, MACD, Bollinger)
- Sentiment score and trend
- Fear & Greed Index
- Latest news headlines
- **AI-generated trading recommendation**

## Claude Desktop Example

```json
{
  "mcpServers": {
    "universal-crypto": {
      "command": "npx",
      "args": ["-y", "@nirholas/universal-crypto-mcp@latest"]
    }
  }
}
```

Then ask Claude:

> "What's the technical analysis for Bitcoin? Include RSI, MACD, sentiment, and Fear & Greed Index"

Claude will use the integrated tools to provide a comprehensive analysis.

## Example Prompts

### Technical Analysis
```
Analyze BTC with RSI, MACD and Bollinger Bands
```
```
Is Ethereum overbought or oversold right now?
```
```
Show me the MACD signal for SOL on the 4h timeframe
```

### Sentiment Analysis
```
What's the current sentiment for Bitcoin on social media?
```
```
Compare sentiment for ETH and SOL over the last 24 hours
```
```
Is crypto Twitter bullish or bearish right now?
```

### Fear & Greed
```
What's the current Fear & Greed Index?
```
```
Show me Fear & Greed trends for the last 30 days
```
```
Predict the Fear & Greed Index for next week
```

### Combined Analysis
```
Give me a complete market overview for Bitcoin including technical indicators, sentiment, and Fear & Greed
```
```
Should I buy ETH based on technical indicators and sentiment?
```
```
What are the strongest buy signals across indicators right now?
```

## Attribution

All integrated packages maintain proper attribution:

| Package | Original Author | License | Our Enhancements |
|---------|----------------|---------|------------------|
| crypto-indicators-mcp | Kukapay | MIT | Real-time streaming, batch processing, strategy builder |
| crypto-sentiment-mcp | Kukapay | MIT | Multi-source aggregation, ML predictions, alerts |
| crypto-feargreed-mcp | Kukapay | MIT | Historical caching, predictive analytics, custom indices |
| cryptopanic-mcp | Kukapay | MIT | Sentiment scoring, deduplication, categorization |
| coinmarketcap-mcp | Shinzo Labs | MIT | Rate limiting, caching, batch operations |
| algorand-mcp | GoPlausible | MIT | Wallet integration, enhanced asset management |
| bybit-mcp-server | ethancod1ng | MIT | WebSocket streaming, order management |
| bsc-mcp | TermiX | MIT | Security scanning, gas optimization |

## License Compliance

- **Original Code**: MIT License (maintained with original copyright)
- **Our Enhancements**: Apache-2.0 License
- **Combined Work**: MIT + Apache-2.0 (dual licensed)

All modifications and enhancements are clearly documented with attribution to original authors.

## API Compatibility

All integrated tools work seamlessly with:
- ✅ Claude Desktop
- ✅ ChatGPT Developer Mode
- ✅ Cursor IDE
- ✅ VS Code with MCP Extension
- ✅ Any MCP-compatible client

## Support & Issues

**For integration issues:**
- Open an issue: [github.com/nirholas/universal-crypto-mcp/issues](https://github.com/nirholas/universal-crypto-mcp/issues)
- Contact: [@nichxbt](https://x.com/nichxbt)

**For original package issues:**
- Refer to the original repository links in [CONTRIBUTORS.md](../CONTRIBUTORS.md)

## Contributing

Want to add more community packages? See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines on:
- Finding compatible packages
- Maintaining proper attribution
- Adding enhancements
- Testing integrations

---

**Last Updated**: January 29, 2026  
**Maintained By**: Nich (@nichxbt) - [x.com/nichxbt](https://x.com/nichxbt)

