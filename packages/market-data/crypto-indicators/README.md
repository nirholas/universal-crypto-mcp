# Crypto Indicators MCP

**Original Author**: Kukapay  
**Original Repository**: https://github.com/kukapay/crypto-indicators-mcp  
**License**: MIT  
**Integrated By**: Nich (@nichxbt)

## Overview

Technical analysis indicators and strategies for cryptocurrency trading. This integration provides:

- Moving averages (SMA, EMA, WMA)
- Momentum indicators (RSI, MACD, Stochastic)
- Volatility indicators (Bollinger Bands, ATR)
- Volume indicators (OBV, VWAP)
- Custom trading strategies

## Original Features

All core indicator calculations are from the original Kukapay implementation with proper attribution maintained in source files.

## Our Enhancements

- **Real-time Streaming**: WebSocket support for live indicator updates
- **Batch Processing**: Calculate multiple indicators simultaneously
- **Historical Analysis**: Backtest indicators on historical data
- **Strategy Builder**: Combine indicators into trading strategies
- **Performance Metrics**: Track indicator accuracy and profitability

## Installation

```bash
cd packages/market-data/crypto-indicators
pnpm install
```

## Usage

```typescript
import { CryptoIndicators } from '@nirholas/universal-crypto-mcp/market-data/crypto-indicators'

const indicators = new CryptoIndicators()

// Calculate RSI
const rsi = await indicators.calculateRSI('BTC/USDT', 14)

// Get multiple indicators
const analysis = await indicators.getFullAnalysis('ETH/USDT', {
  indicators: ['rsi', 'macd', 'bollinger'],
  period: '1d'
})
```

## MCP Tool Integration

```json
{
  "mcpServers": {
    "crypto-indicators": {
      "command": "npx",
      "args": ["-y", "@nirholas/universal-crypto-mcp-indicators"]
    }
  }
}
```

## Attribution

Original implementation by Kukapay. Enhanced and integrated by Nich for Universal Crypto MCP.

## License

MIT (Original) + Apache-2.0 (Modifications)
