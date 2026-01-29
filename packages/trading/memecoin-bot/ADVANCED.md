# Memecoin Trading Bot - Advanced Guide

## 🎯 Strategy Optimization

### Risk Management Settings

#### Conservative (Low Risk)
```env
BUY_AMOUNT=0.1
MAX_POSITION_SIZE=0.5
STOP_LOSS=15
TAKE_PROFIT=50
TRAILING_STOP=10
MAX_DAILY_LOSS=1
MIN_LIQUIDITY=50000
MIN_VOLUME_24H=20000
MIN_HOLDERS=100
```

#### Moderate (Medium Risk)
```env
BUY_AMOUNT=0.5
MAX_POSITION_SIZE=2.0
STOP_LOSS=20
TAKE_PROFIT=100
TRAILING_STOP=15
MAX_DAILY_LOSS=5
MIN_LIQUIDITY=10000
MIN_VOLUME_24H=5000
MIN_HOLDERS=50
```

#### Aggressive (High Risk)
```env
BUY_AMOUNT=1.0
MAX_POSITION_SIZE=5.0
STOP_LOSS=30
TAKE_PROFIT=200
TRAILING_STOP=20
MAX_DAILY_LOSS=10
MIN_LIQUIDITY=5000
MIN_VOLUME_24H=1000
MIN_HOLDERS=20
```

## 📊 Performance Metrics

### Key Performance Indicators (KPIs)

1. **Win Rate**: Percentage of profitable trades
   - Good: > 60%
   - Excellent: > 70%

2. **Profit Factor**: Total profits / Total losses
   - Good: > 1.5
   - Excellent: > 2.0

3. **Sharpe Ratio**: Risk-adjusted returns
   - Good: > 1.0
   - Excellent: > 2.0

4. **Max Drawdown**: Largest peak-to-trough decline
   - Good: < 20%
   - Excellent: < 10%

## 🔧 Advanced Configuration

### RPC Optimization

For best performance, use a premium RPC provider:

```env
# Helius (Recommended)
SOLANA_RPC_URL=https://mainnet.helius-rpc.com/?api-key=YOUR_KEY
HELIUS_API_KEY=YOUR_KEY

# QuickNode
SOLANA_RPC_URL=https://your-node.quiknode.pro/YOUR_KEY

# GenesysGo
SOLANA_RPC_URL=https://ssc-dao.genesysgo.net/
```

### Priority Fees

Adjust based on network congestion:

```env
# Low congestion
PRIORITY_FEE=10000

# Medium congestion
PRIORITY_FEE=50000

# High congestion
PRIORITY_FEE=100000
```

## 🎨 Custom Strategies

### Example: Momentum Strategy

Focus on tokens with strong price momentum:

```typescript
// In strategy.ts, modify evaluateToken()

// Increase weight on momentum
if (metrics.priceChange24h > 100) {
  confidence += 25  // Increased from 15
  reasons.push('Very strong momentum')
}

// Add volume spike detection
const volumeToLiquidityRatio = metrics.volume24h / metrics.liquidity
if (volumeToLiquidityRatio > 2) {
  confidence += 15
  reasons.push('High volume spike detected')
}
```

### Example: Value Strategy

Focus on undervalued tokens with good fundamentals:

```typescript
// Prioritize low market cap with high liquidity
if (metrics.marketCap < 100000 && metrics.liquidity > 50000) {
  confidence += 20
  reasons.push('Undervalued with strong liquidity')
}

// Look for holder growth
if (metrics.holders > config.minHolders * 2) {
  confidence += 10
  reasons.push('Strong holder base')
}
```

## 🔍 Token Filtering

### Creating Whitelist/Blacklist

```typescript
// In bot.ts, add before evaluateToken()

const BLACKLIST = [
  '...',  // Known scam tokens
]

const WHITELIST_DEXES = [
  'raydium',
  'orca'
]

// Filter logic
if (BLACKLIST.includes(pair.tokenA)) {
  continue
}

if (!WHITELIST_DEXES.includes(pair.dex)) {
  continue
}
```

## 📈 Advanced Analysis

### Technical Indicators

Add custom indicators:

```typescript
// RSI (Relative Strength Index)
function calculateRSI(prices: number[], period: number = 14): number {
  if (prices.length < period) return 50
  
  let gains = 0
  let losses = 0
  
  for (let i = 1; i <= period; i++) {
    const change = prices[i] - prices[i - 1]
    if (change > 0) gains += change
    else losses += Math.abs(change)
  }
  
  const avgGain = gains / period
  const avgLoss = losses / period
  
  if (avgLoss === 0) return 100
  
  const rs = avgGain / avgLoss
  return 100 - (100 / (1 + rs))
}

// Use in strategy
const rsi = calculateRSI(historicalPrices)
if (rsi < 30) {
  confidence += 15
  reasons.push('Oversold (RSI < 30)')
}
```

## 🚨 Alert System

### Telegram Notifications

```typescript
import axios from 'axios'

async function sendTelegramAlert(message: string) {
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID
  
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return
  
  await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    chat_id: TELEGRAM_CHAT_ID,
    text: message,
    parse_mode: 'HTML'
  })
}

// Use in bot.ts
await sendTelegramAlert(`
🚀 <b>New Position</b>
Token: ${signal.tokenAddress}
Amount: ${config.buyAmount} SOL
Confidence: ${signal.confidence}%
`)
```

## 🔄 Portfolio Management

### Position Sizing (Kelly Criterion)

```typescript
function calculateKellySize(winRate: number, avgWin: number, avgLoss: number): number {
  const p = winRate
  const q = 1 - winRate
  const b = avgWin / avgLoss
  
  const kelly = (p * b - q) / b
  
  // Use half-Kelly for safety
  return Math.max(0, Math.min(0.25, kelly / 2))
}

// Adjust buy amount dynamically
const stats = await db.getStats()
if (stats.totalTrades > 10) {
  const kellyFraction = calculateKellySize(
    stats.winRate / 100,
    stats.averageProfit,
    Math.abs(stats.averageLoss)
  )
  
  const balance = await solana.getBalance()
  config.buyAmount = balance * kellyFraction
}
```

## 🛠️ Debugging

### Enable Verbose Logging

```typescript
// Add to config.ts
export const DEBUG = process.env.DEBUG === 'true'

// Use throughout code
if (DEBUG) {
  console.log('Quote response:', JSON.stringify(quote, null, 2))
}
```

### Transaction Simulation

```typescript
// Before executing real trades
if (process.env.DRY_RUN === 'true') {
  console.log('DRY RUN: Would execute buy', params)
  return {
    signature: 'dry-run',
    success: true,
    // ... mock data
  }
}
```

## 📊 Data Export

### Export Trading History

```typescript
async function exportToCSV() {
  const trades = await db.all('SELECT * FROM trades')
  
  const csv = [
    'Date,Type,Token,Amount In,Amount Out,Price,PnL,Status',
    ...trades.map(t => 
      `${t.timestamp},${t.type},${t.token_address},${t.amount_in},${t.amount_out},${t.price},${t.pnl},${t.status}`
    )
  ].join('\n')
  
  fs.writeFileSync('trades.csv', csv)
}
```

## 🎓 Best Practices

1. **Start Small**: Begin with minimum position sizes
2. **Test Thoroughly**: Use devnet/testnet first
3. **Monitor Closely**: Watch the bot for the first few days
4. **Adjust Gradually**: Make incremental changes to strategy
5. **Keep Records**: Export data regularly for analysis
6. **Stay Updated**: Monitor Solana network status
7. **Secure Keys**: Never expose private keys
8. **Use Limits**: Always set daily loss limits
9. **Diversify**: Don't put all funds in the bot
10. **Learn**: Study successful and failed trades

## 🔐 Security Checklist

- [ ] Private key stored securely
- [ ] .env file in .gitignore
- [ ] Daily loss limit configured
- [ ] Position size limits set
- [ ] RPC endpoint has rate limits
- [ ] Database backed up regularly
- [ ] Monitoring alerts configured
- [ ] Emergency stop procedure tested

## 📞 Support

For issues or questions:
- GitHub: [github.com/nirholas](https://github.com/nirholas)
- X: [@nichxbt](https://x.com/nichxbt)

---

**Happy trading! 🚀**

*Built by [nich](https://x.com/nichxbt) with ❤️*
