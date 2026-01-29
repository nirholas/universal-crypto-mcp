# Trading Bot Example

An automated trading bot demonstrating the trading package.

## ⚠️ WARNING

**This is for educational purposes only!**

- Do NOT use with real funds without extensive testing
- Trading cryptocurrencies carries significant risk
- Past performance does not guarantee future results
- You could lose all your capital

## Features

- RSI + Moving Average crossover strategy
- Automatic stop-loss and take-profit
- Position sizing based on balance percentage
- Dry-run mode for paper trading
- Detailed logging

## Strategy

The bot uses a simple RSI + MA crossover strategy:

### Buy Conditions
- RSI below 30 (oversold) + Short MA above Long MA
- OR RSI below 30 alone (lower confidence)

### Sell Conditions
- RSI above 70 (overbought) + Short MA below Long MA
- OR RSI above 70 alone (lower confidence)

### Risk Management
- Stop Loss: 2% below entry
- Take Profit: 4% above entry
- Position Size: 10% of balance

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure

Edit `src/index.ts` to customize:

```typescript
const CONFIG = {
  symbol: "BTCUSDT",
  strategy: {
    rsiOversold: 30,
    rsiOverbought: 70,
    shortMaPeriod: 9,
    longMaPeriod: 21,
    positionSize: 0.1,
    stopLossPercent: 0.02,
    takeProfitPercent: 0.04,
  },
  checkIntervalMs: 60000,
  dryRun: true, // Set to false for live trading
};
```

### 3. Set Environment (for live trading)

```bash
export BINANCE_API_KEY=your-api-key
export BINANCE_API_SECRET=your-api-secret
```

### 4. Run

```bash
# Development (dry run)
npm run dev

# Production
npm run build
npm start
```

## Sample Output

```
🤖 Trading Bot Started
============================================================
Symbol: BTCUSDT
Mode: DRY RUN (no real trades)
Starting Balance: $10000.00
Check Interval: 60s
============================================================
📊 Checking BTCUSDT...
   Price: $67890.12
   RSI: 28.5
   MA: 67950.00 / 67800.00
   Signal: BUY (75%)
   Reason: RSI oversold (28.5) + Bullish MA crossover
📈 BUY ORDER: 0.014728 BTCUSDT @ $67890.12
   [DRY RUN - No actual order placed]
✅ Position opened:
   Entry: $67890.12
   Size: 0.014728 BTCUSDT
   Stop Loss: $66532.32
   Take Profit: $70605.72
   Reason: RSI oversold (28.5) + Bullish MA crossover
```

## Project Structure

```
trading-bot/
├── src/
│   └── index.ts      # Bot logic
├── package.json      # Dependencies
└── README.md         # This file
```

## Customization

### Different Strategies

```typescript
// MACD Strategy
function analyzeMarket(data: MarketData): TradeSignal {
  if (data.macd.histogram > 0 && data.macd.histogram > data.prevMacdHistogram) {
    return { action: "buy", reason: "MACD bullish crossover", confidence: 0.7 };
  }
  // ...
}

// Bollinger Bands Strategy
function analyzeMarket(data: MarketData): TradeSignal {
  if (data.price < data.bollingerBands.lower) {
    return { action: "buy", reason: "Price below lower band", confidence: 0.65 };
  }
  // ...
}
```

### Multiple Pairs

```typescript
const PAIRS = ["BTCUSDT", "ETHUSDT", "SOLUSDT"];

async function tradingLoop() {
  for (const symbol of PAIRS) {
    const data = await getMarketData(symbol);
    // ... analyze and trade
  }
}
```

### Live Trading

To enable live trading:

1. Set `CONFIG.dryRun = false`
2. Uncomment the real trading imports
3. Configure API keys
4. Test thoroughly on testnet first!

## Risk Disclaimer

- This bot is provided as-is, without warranty
- The authors are not responsible for any losses
- Always start with small amounts
- Never risk more than you can afford to lose
- Consider using a testnet first

## Next Steps

- Add more indicators (MACD, Bollinger Bands)
- Implement backtesting
- Add notification system
- See [trading package docs](../../docs/content/packages/trading.md)
