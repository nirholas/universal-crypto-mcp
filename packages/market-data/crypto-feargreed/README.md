# Crypto Fear & Greed Index MCP

**Original Author**: Kukapay  
**Original Repository**: https://github.com/kukapay/crypto-feargreed-mcp  
**License**: MIT  
**Integrated By**: Nich (@nichxbt)

## Overview

Real-time and historical Crypto Fear & Greed Index data. The Fear & Greed Index analyzes:

- Market volatility (25%)
- Market momentum/volume (25%)
- Social media sentiment (15%)
- Surveys (15%)
- Bitcoin dominance (10%)
- Google Trends (10%)

## Features

### From Original Implementation
- Current Fear & Greed Index value
- Historical data access
- Index classification (Extreme Fear → Extreme Greed)

### Our Enhancements
- **Predictive Analytics**: ML model for index forecasting
- **Custom Indices**: Create weighted indices for specific assets
- **Alert Triggers**: Notifications at extreme values
- **Correlation Analysis**: Compare index with price movements
- **API Caching**: Faster responses with intelligent caching

## Usage

```typescript
import { FearGreedIndex } from '@nirholas/universal-crypto-mcp/market-data/crypto-feargreed'

const fgi = new FearGreedIndex()

// Current index
const current = await fgi.getCurrent()
console.log(current) // { value: 45, classification: 'Fear', timestamp: ... }

// Historical data
const history = await fgi.getHistory(30) // Last 30 days

// Predictions
const forecast = await fgi.predict(7) // 7-day forecast
```

## MCP Integration

```json
{
  "mcpServers": {
    "fear-greed": {
      "command": "npx",
      "args": ["-y", "@nirholas/crypto-feargreed-mcp"]
    }
  }
}
```

## Attribution

Original implementation by Kukapay. Enhanced and integrated by Nich for Universal Crypto MCP.

## License

MIT (Original) + Apache-2.0 (Modifications)