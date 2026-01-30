# Memecoin Trading Bot 🚀

⚠️ **IMPORTANT**: This bot integrates **battle-tested risk management** from proven open-source projects (Freqtrade 15k⭐, Jesse AI, CCXT 28k⭐) to protect your capital.

## 🛡️ Safety Features (NEW)

### Proven Risk Management from Freqtrade
- ✅ **Position Sizing**: Automatic calculation based on capital
- ✅ **Max Drawdown Protection**: Stops trading at 15% loss (default)
- ✅ **Daily Loss Limits**: Prevents bad trading days
- ✅ **Emergency Stop**: Critical 25% total loss trigger
- ✅ **Cooldown Periods**: Time-based trading restrictions after losses
- ✅ **Consecutive Loss Protection**: Stops after 3+ consecutive losses

### Backtesting & Dry-Run (from Jesse AI)
- ✅ **Paper Trading Mode**: Test without real money
- ✅ **Historical Backtesting**: Validate strategies on past data
- ✅ **Performance Metrics**: Win rate, profit factor, drawdown analysis

## ⚠️ CRITICAL WARNINGS

**READ THIS BEFORE RUNNING THE BOT:**

1. **Memecoins are EXTREMELY risky** - You can lose 100% of your investment
2. **Start with DRY-RUN mode** - Test without real money first
3. **Use SMALL amounts** - Start with 0.05-0.1 SOL maximum
4. **Monitor constantly** - Automated doesn't mean unsupervised
5. **Only trade what you can afford to LOSE COMPLETELY**

**The authors assume NO responsibility for your trading losses. This software is provided AS-IS for educational purposes.**

## Features

### 🎯 Core Trading
- **Pump.fun Integration**: Direct interaction with Pump.fun bonding curves
- **Jupiter Aggregation**: Fallback to Jupiter for best execution
- **Real-time Monitoring**: Continuous scanning of new token launches
- **Position Management**: Automatic tracking of all open positions

### 🛡️ Risk Management
- **Rug Pull Detection**: Multi-factor analysis to identify scam tokens
  - Mint authority checks
  - Holder distribution analysis
  - Liquidity depth verification
  - Creator wallet monitoring
- **Stop Loss**: Automatic exit on downside limit
- **Take Profit**: Lock in gains at target levels
- **Max Position Size**: Capital allocation limits

### 🎲 Trading Strategies
- **Sniping Mode**: Ultra-fast entry on fresh launches
- **RSI Analysis**: Oversold/overbought indicators
- **Volume Spike Detection**: Identify momentum
- **Social Sentiment**: Twitter/Telegram activity tracking
- **Volatility Analysis**: Risk-adjusted positioning

### 📊 Analytics
- **Token Scoring**: Multi-dimensional rating system
- **Liquidity Analysis**: Volume-to-liquidity ratios
- **Holder Distribution**: Whale concentration metrics
- **Social Metrics**: Community engagement scores

## Installation

```bash
cd packages/novel/memecoin-trader
pnpm install
```

## Configuration

### Risk Management Configuration (NEW)

Choose a risk profile based on your experience and risk tolerance:

```typescript
import { CONSERVATIVE_RISK, MODERATE_RISK, AGGRESSIVE_RISK } from '@universal-crypto/memecoin-trader';

// CONSERVATIVE (RECOMMENDED for beginners)
// - 2% position size
// - 5% daily loss limit
// - 15% max drawdown
const bot = new MemecoinTradingBot(config, CONSERVATIVE_RISK);

// MODERATE (For experienced traders)
// - 5% position size
// - 8% daily loss limit
// - 20% max drawdown
const bot = new MemecoinTradingBot(config, MODERATE_RISK);

// AGGRESSIVE (NOT RECOMMENDED - High risk)
// - 10% position size
// - 12% daily loss limit
// - 25% max drawdown
const bot = new MemecoinTradingBot(config, AGGRESSIVE_RISK);
```

### Environment Configuration

Create `.env` file:

```env
# Required
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
WALLET_PRIVATE_KEY=your_base58_private_key

# Trading Parameters
BUY_AMOUNT=0.1              # SOL per trade
TAKE_PROFIT=50              # Exit at +50%
STOP_LOSS=30                # Exit at -30%
MAX_POSITION=1.0            # Max 1 SOL per position
MIN_LIQUIDITY=5000          # Min $5k liquidity
MAX_RUG_RISK=30             # Max 30/100 rug score

# Sniping (High Risk)
ENABLE_SNIPING=false        # Enable new launch sniping
SNIPE_AMOUNT=0.05           # SOL per snipe

# Optional API Keys
HELIUS_API_KEY=xxx          # For holder data
BIRDEYE_API_KEY=xxx         # For price/volume data
```

## Usage

### 1. START WITH DRY-RUN MODE (REQUIRED)

**NEVER skip this step!** Test without risking real money first:

```bash
# Dry-run mode - simulates trades, no real transactions
pnpm run dev -- --dry-run
```

```typescript
// Dry-run in code
const bot = new MemecoinTradingBot(config, CONSERVATIVE_RISK, true); // true = dry-run
await bot.start();
```

### 2. Backtest Your Strategy

Test on historical data before live trading:

```typescript
import { Backtester } from '@universal-crypto/memecoin-trader';

const backtester = new Backtester({
  initialBalance: 1.0, // 1 SOL
  riskConfig: CONSERVATIVE_RISK
});

const results = await backtester.runBacktest(historicalData);
backtester.printResults();

// Check metrics before going live:
// - Win Rate > 55%?
// - Profit Factor > 1.5?
// - Max Drawdown < 20%?
```

### 3. Start Live Trading (With Small Amounts)

```bash
# Start with 0.05-0.1 SOL maximum
pnpm run dev
```

### Programmatic Usage

```typescript
import { MemecoinTradingBot } from '@universal-crypto/memecoin-trader';

const config = {
  maxSlippage: 10,
  buyAmount: 0.1,
  takeProfit: 50,
  stopLoss: 30,
  maxPositionSize: 1.0,
  minLiquidity: 5000,
  maxRugRisk: 30,
  enableSniping: false,
  snipeAmount: 0.05,
};

const bot = new MemecoinTradingBot(config);
await bot.start();

// Check portfolio
const positions = bot.getPositions();
const value = await bot.getPortfolioValue();

// Stop bot
bot.stop();
```

## How It Works

### 1. Token Discovery
- Monitors Pump.fun API for new launches
- Fetches trending tokens every 10 seconds
- Scans for volume spikes and social signals

### 2. Risk Analysis
```
Rug Score = 0-100 (lower is better)
- Top 10 holders >50%: +30 points
- Creator holds >20%: +20 points  
- Liquidity <$5k: +25 points
- Holders <50: +15 points
- Mint authority: +10 points
- Freeze authority: +10 points
```

### 3. Signal Generation
```
Confidence = 0-100
- Volume analysis: 25% weight
- Price momentum: 20% weight
- Social metrics: 20% weight
- RSI: 15% weight
- Holder distribution: 15% weight
- Market cap: 10% weight
```

### 4. Execution
- **BUY Signal**: Confidence ≥70% + Rug Risk ≤30
- **SELL Signal**: Take profit hit OR stop loss hit
- **HOLD**: All other conditions

### 5. Position Monitoring
- Updates every 30 seconds
- Calculates real-time PnL
- Checks exit conditions
- Logs performance metrics

## Trading Strategies

### Conservative (Recommended for Beginners)
```env
BUY_AMOUNT=0.05
TAKE_PROFIT=30
STOP_LOSS=20
MAX_RUG_RISK=20
ENABLE_SNIPING=false
```

### Moderate
```env
BUY_AMOUNT=0.1
TAKE_PROFIT=50
STOP_LOSS=30
MAX_RUG_RISK=30
ENABLE_SNIPING=false
```

### Aggressive (High Risk)
```env
BUY_AMOUNT=0.2
TAKE_PROFIT=100
STOP_LOSS=40
MAX_RUG_RISK=40
ENABLE_SNIPING=true
SNIPE_AMOUNT=0.1
```

### Sniper (Extreme Risk)
```env
BUY_AMOUNT=0.05
TAKE_PROFIT=200
STOP_LOSS=50
MAX_RUG_RISK=20
ENABLE_SNIPING=true
SNIPE_AMOUNT=0.2
```

## Architecture

```
┌─────────────────┐
│  Bot Controller │
└────────┬────────┘
         │
    ┌────┴────┬──────────┬──────────┐
    │         │          │          │
┌───▼──┐ ┌───▼───┐ ┌────▼────┐ ┌──▼──────┐
│Pump  │ │Jupiter│ │Analyzer │ │Strategy │
│ Fun  │ │Client │ │         │ │Engine   │
└──────┘ └───────┘ └─────────┘ └─────────┘
```

## API Integrations

### Pump.fun
- Token launches
- Bonding curve trades
- Price data

### Jupiter
- Multi-DEX aggregation
- Best price routing
- Slippage protection

### Birdeye (Optional)
- Token analytics
- Historical prices
- Social metrics

### Helius (Optional)
- Holder data
- Transaction history
- Token metadata

## Safety Features

1. **Pre-trade Checks**
   - Balance verification
   - Liquidity validation
   - Rug risk assessment

2. **Execution Safety**
   - Slippage limits
   - Priority fees
   - Transaction retries

3. **Position Limits**
   - Max position size
   - Portfolio allocation
   - Concurrent trade limits

4. **Emergency Stop**
   - CTRL+C to exit
   - Graceful shutdown
   - Position preservation

## Performance Metrics

The bot tracks:
- Win rate
- Average PnL per trade
- Hold time distribution
- Strategy effectiveness
- Gas costs
- Slippage impact

## Warnings ⚠️

1. **High Risk**: Memecoins are extremely volatile
2. **Rug Pulls**: Analysis reduces but doesn't eliminate risk
3. **Slippage**: Fast-moving tokens can have high slippage
4. **Gas Fees**: Many trades = significant fee costs
5. **Not Financial Advice**: Use at your own risk

## Testing

```bash
# Run tests
pnpm test

# Test specific strategy
pnpm test src/strategy.test.ts

# Test with coverage
pnpm test --coverage
```

## Monitoring

The bot logs:
```
🤖 Bot Started
💰 Wallet: 7xKXt...
💵 Balance: 10.5 SOL

🎯 SNIPE: BONK
   Reason: Fresh launch, low rug risk
   
🔵 BUY: 9xQw...
   Amount: 0.1 SOL
   
✅ SUCCESS
   Tx: 2sKm...
   Tokens: 1,000,000
   Price: $0.0001

💼 Position: 9xQw...
   Entry: $0.0001
   Current: $0.00015
   PnL: +50% (+0.05 SOL)
   
✅ TAKE PROFIT at +50%
```

## Roadmap

- [ ] MEV protection
- [ ] Multi-wallet support
- [ ] Discord/Telegram alerts
- [ ] Dashboard UI
- [ ] Backtesting engine
- [ ] Strategy builder
- [ ] Copy trading
- [ ] Portfolio rebalancing

## License

MIT

## Disclaimer

This bot is for educational purposes. Cryptocurrency trading carries significant risk. Only invest what you can afford to lose. The developers are not responsible for any financial losses.
