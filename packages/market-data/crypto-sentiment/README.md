# Crypto Sentiment Analysis MCP

**Original Author**: Kukapay  
**Original Repository**: https://github.com/kukapay/crypto-sentiment-mcp  
**License**: MIT  
**Integrated By**: Nich (@nichxbt)

## Overview

Cryptocurrency sentiment analysis from social media, news, and market data. Aggregates sentiment signals from:

- Twitter/X crypto discussions
- Reddit cryptocurrency communities
- News article sentiment
- On-chain metrics correlation
- Social volume trends

## Original Features

Core sentiment analysis algorithms from Kukapay's original implementation.

## Our Enhancements

- **Multi-source Aggregation**: Combine sentiment from 10+ sources
- **Real-time Updates**: WebSocket streams for live sentiment
- **Historical Analysis**: Track sentiment trends over time
- **Predictive Scoring**: ML-enhanced sentiment predictions
- **Alert System**: Notifications for sentiment extremes

## Usage

```typescript
import { CryptoSentiment } from '@nirholas/universal-crypto-mcp/market-data/crypto-sentiment'

const sentiment = new CryptoSentiment()

// Get current sentiment
const btcSentiment = await sentiment.analyze('BTC')
console.log(btcSentiment) // { score: 0.75, trend: 'bullish', confidence: 0.82 }

// Historical sentiment
const history = await sentiment.getHistory('ETH', '7d')
```

## Attribution

Original implementation by Kukapay. Enhanced and integrated by Nich for Universal Crypto MCP.

## License

MIT (Original) + Apache-2.0 (Modifications)