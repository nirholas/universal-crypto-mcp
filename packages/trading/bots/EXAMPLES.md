# Trading Bot Integration Examples

**Maintained by:** Nicholas (nirholas)  
**GitHub:** https://github.com/nirholas  
**Twitter:** https://x.com/nichxbt

These examples show how to use the integrated trading bots through the Universal Crypto MCP interface.

---

## Quick Start

```bash
# Setup all bots
npm run setup:all

# Build the integration layer
npm run build

# Start using in your code
npm install
```

---

## Example 1: List All Available Bots

```typescript
import { createTradingBotManager } from '@universal-crypto-mcp/trading-bots'

const manager = createTradingBotManager({
  maintainer: {
    name: 'Nicholas',
    github: 'nirholas',
    twitter: 'nichxbt'
  }
})

// List all bots with attribution
const bots = manager.listBots()

bots.forEach(bot => {
  console.log(`${bot.name} (${bot.stars}⭐)`)
  console.log(`  By: ${bot.originalAuthor}`)
  console.log(`  GitHub: ${bot.github}`)
  console.log(`  License: ${bot.license}`)
  console.log()
})
```

**Output:**
```
Crypto-Signal (5442⭐)
  By: CryptoSignal Team
  GitHub: https://github.com/CryptoSignal/Crypto-Signal
  License: MIT

TradingView Webhook Bot (1674⭐)
  By: fabston
  GitHub: https://github.com/fabston/TradingView-Webhook-Bot
  License: MIT

... (8 more bots)
```

---

## Example 2: Get Detailed Bot Information

```typescript
const botInfo = manager.getBotInfo('crypto-signal')

console.log(botInfo)
```

**Output:**
```json
{
  "name": "Crypto-Signal",
  "originalProject": "CryptoSignal/Crypto-Signal",
  "originalAuthor": "CryptoSignal Team",
  "stars": 5442,
  "license": "MIT",
  "github": "https://github.com/CryptoSignal/Crypto-Signal",
  "description": "Trading & Technical Analysis Bot"
}
```

---

## Example 3: Execute Trading Strategy

```typescript
const result = await manager.executeTrade({
  bot: 'crypto-signal',
  strategy: 'RSI',
  pair: 'BTC/USDT',
  amount: 100,
  side: 'buy'
})

console.log(result)
```

**Output:**
```json
{
  "success": true,
  "bot": "Crypto-Signal",
  "originalAuthor": "CryptoSignal Team",
  "message": "Trade execution delegated to original bot implementation",
  "attribution": "Powered by Crypto-Signal by CryptoSignal Team"
}
```

---

## Example 4: Use with AI Agents (Claude Desktop)

Add to your MCP configuration:

```json
{
  "mcpServers": {
    "trading-bots": {
      "command": "node",
      "args": [
        "/path/to/universal-crypto-mcp/packages/trading/bots/dist/mcp-server.js"
      ]
    }
  }
}
```

Then ask Claude:

```
User: "What trading bots are available?"

Claude: I can see 10 integrated open-source trading bots:

1. **Crypto-Signal** (5,442⭐) by CryptoSignal Team
   - Technical analysis and trading signals
   - GitHub: https://github.com/CryptoSignal/Crypto-Signal

2. **TradingView Webhook Bot** (1,674⭐) by fabston
   - Send alerts to Telegram, Discord, Slack
   - GitHub: https://github.com/fabston/TradingView-Webhook-Bot

... [shows all 10 with proper attribution]

All bots are MIT licensed and credit goes to their original authors.
Integration maintained by Nicholas (@nirholas).
```

---

## Example 5: Display Attribution in UI

```typescript
const attribution = manager.getAttributionText('binance-sentiment')

console.log(attribution)
```

**Output:**
```
Powered by Binance News Sentiment Bot (1641⭐) by CyberPunkMetalHead
Licensed under MIT - https://github.com/CyberPunkMetalHead/Binance-News-Sentiment-Bot
Integration by Nicholas (@nirholas)
```

---

## Example 6: Create Custom Strategy with Attribution

```typescript
import { AVAILABLE_BOTS } from '@universal-crypto-mcp/trading-bots'

class CustomStrategy {
  constructor() {
    // Use multiple bots with proper attribution
    this.bots = {
      signals: AVAILABLE_BOTS['crypto-signal'],
      sentiment: AVAILABLE_BOTS['binance-sentiment'],
      arbitrage: AVAILABLE_BOTS['crypto-arbitrage']
    }
  }

  async analyze(pair: string) {
    console.log('Running analysis using:')
    console.log(`  - ${this.bots.signals.name} by ${this.bots.signals.originalAuthor}`)
    console.log(`  - ${this.bots.sentiment.name} by ${this.bots.sentiment.originalAuthor}`)
    console.log(`  - ${this.bots.arbitrage.name} by ${this.bots.arbitrage.originalAuthor}`)
    
    // Your custom logic here that delegates to original bots
    return {
      pair,
      signal: 'buy',
      attribution: Object.values(this.bots).map(b => 
        `${b.name} by ${b.originalAuthor} (${b.github})`
      )
    }
  }
}
```

---

## Example 7: Batch Operations

```typescript
// Run sentiment analysis across multiple bots
const sentimentBots = ['binance-sentiment', 'intelligent-trading']

const results = await Promise.all(
  sentimentBots.map(async botId => {
    const bot = manager.getBotInfo(botId)
    const result = await manager.executeTrade({
      bot: botId,
      strategy: 'sentiment',
      pair: 'BTC/USDT'
    })
    
    return {
      bot: bot?.name,
      author: bot?.originalAuthor,
      github: bot?.github,
      result
    }
  })
)

// All results include proper attribution
console.log(JSON.stringify(results, null, 2))
```

---

## Important Notes

### ✅ Legal Use
- All bots are MIT licensed
- Original copyright notices are preserved
- Proper attribution is maintained
- License files are kept intact

### 🙏 Attribution
Every operation includes attribution to:
- Original project authors
- Project GitHub repositories
- Integration maintainer (Nicholas)

### 📚 Documentation
Refer to each bot's original documentation:
- Installation instructions
- Configuration options
- API keys setup
- Strategy customization

### ⭐ Support Original Authors
Please star the original projects on GitHub:
- [Crypto-Signal](https://github.com/CryptoSignal/Crypto-Signal)
- [TradingView-Webhook-Bot](https://github.com/fabston/TradingView-Webhook-Bot)
- [And 8 more...](./README.md)

---

**Integration maintained by Nicholas (@nirholas)**  
**Contact:** https://github.com/nirholas | https://x.com/nichxbt

This integration layer adds value by providing:
- Unified interface across multiple bots
- MCP protocol support for AI agents
- Consistent error handling
- Proper attribution tracking
