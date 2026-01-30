# Memecoin Trading Bot

A fully automated cryptocurrency trading bot for memecoins with technical analysis, risk management, and multi-DEX support.

## Features

- **Multi-Chain Support**: BSC (PancakeSwap), Solana (Raydium/Jupiter)
- **Technical Analysis**: RSI, EMA, MACD, Bollinger Bands, Volume analysis
- **Risk Management**: Position sizing, stop-loss, take-profit, daily loss limits
- **Real-time Trading**: Automated buy/sell execution with slippage protection
- **Portfolio Management**: Track positions, P&L, and trading statistics
- **Telegram Notifications**: Real-time alerts for trades and important events
- **Token Scanner**: Automatically discovers trending tokens with high volume

## Installation

```bash
cd memecoin-trading-bot
npm install
```

## Configuration

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

### Required Settings

**For BSC (PancakeSwap):**
```env
NETWORK=bsc
ETH_RPC_URL=https://bsc-dataseed1.binance.org
PRIVATE_KEY=your_private_key
```

**For Solana (Raydium):**
```env
NETWORK=solana
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
SOLANA_PRIVATE_KEY=your_base58_private_key
```

### Trading Parameters

```env
INITIAL_CAPITAL=1000              # Starting capital in USD
MAX_POSITION_SIZE_PERCENT=10      # Max 10% per trade
STOP_LOSS_PERCENT=5               # Exit at -5%
TAKE_PROFIT_PERCENT=20            # Exit at +20%
MAX_SLIPPAGE_PERCENT=2            # Max 2% slippage
MAX_DAILY_LOSS_PERCENT=15         # Stop trading at -15% daily
MAX_CONCURRENT_POSITIONS=5        # Hold max 5 positions
MIN_LIQUIDITY_USD=50000           # Minimum $50k liquidity
```

### Technical Analysis

```env
RSI_PERIOD=14
RSI_OVERSOLD=30
RSI_OVERBOUGHT=70
EMA_SHORT_PERIOD=9
EMA_LONG_PERIOD=21
VOLUME_SPIKE_MULTIPLIER=3
```

### Optional: Telegram Notifications

```env
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id
```

## Usage

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm run build
npm start
```

## How It Works

### 1. Token Discovery

The bot continuously scans for trending tokens using DexScreener API:
- Filters by minimum liquidity ($50k+)
- Prioritizes high volume tokens
- Analyzes price momentum

### 2. Technical Analysis

For each token, calculates:
- **RSI**: Identifies overbought/oversold conditions
- **EMA Crossover**: Detects trend direction
- **MACD**: Confirms momentum
- **Bollinger Bands**: Identifies volatility extremes
- **Volume Analysis**: Detects unusual activity

### 3. Signal Generation

Buy signals generated when:
- RSI < 30 (oversold)
- Short EMA crosses above Long EMA
- MACD histogram positive
- Price below lower Bollinger Band
- Volume spike detected

Sell signals generated when:
- RSI > 70 (overbought)
- Short EMA crosses below Long EMA
- MACD histogram negative
- Price above upper Bollinger Band
- Or stop-loss/take-profit triggered

### 4. Risk Management

Before executing trades:
- Checks daily loss limit
- Verifies position limit
- Validates liquidity
- Calculates position size
- Assesses confidence score

### 5. Execution

- Buys tokens with approved signals (>60% confidence)
- Sets stop-loss and take-profit automatically
- Monitors positions continuously
- Exits on technical signals or risk triggers

## Trading Strategy

### Entry Criteria

1. High confidence buy signal (>60%)
2. Sufficient liquidity (>$50k)
3. Within position limits
4. Below daily loss threshold
5. Positive risk assessment

### Exit Criteria

1. Stop-loss hit (-5%)
2. Take-profit hit (+20%)
3. Technical sell signal (>50% confidence)
4. RSI overbought (>70)
5. Bearish EMA crossover

## Portfolio Tracking

The bot tracks:
- Total portfolio value
- Available balance
- Open positions with real-time P&L
- Daily P&L
- Total P&L
- Win rate and profit factor
- Trade history

## Risk Warnings

⚠️ **IMPORTANT DISCLAIMERS**

1. **High Risk**: Memecoin trading is extremely risky
2. **No Guarantees**: Past performance ≠ future results
3. **Possible Losses**: You can lose your entire investment
4. **Test First**: Use testnet or paper trading first
5. **Start Small**: Begin with amounts you can afford to lose
6. **Monitor Closely**: Automated doesn't mean hands-off
7. **Rug Pulls**: Memecoins are susceptible to scams
8. **Gas Fees**: Consider transaction costs in your calculations

## Safety Features

- Position size limits
- Daily loss limits
- Stop-loss on every trade
- Liquidity verification
- Slippage protection
- Concurrent position limits
- Risk confidence scoring

## Monitoring

### Logs

Check logs in:
- `logs/combined.log` - All activity
- `logs/error.log` - Errors only

### Telegram Alerts

Receive notifications for:
- Bot start/stop
- Buy/sell executions
- Daily reports
- Important alerts

### Console Output

Real-time display of:
- Scanned tokens
- Generated signals
- Trade executions
- Portfolio status
- Position updates

## Advanced Configuration

### Custom Trading Logic

Modify `src/strategy/trading.ts` to:
- Adjust signal weights
- Add custom indicators
- Change entry/exit logic
- Implement different strategies

### DEX Integration

Add new DEXs by implementing `IDexClient` interface in:
- `src/dex/your-dex.ts`

### Additional Chains

Extend support by:
1. Implementing DEX client
2. Adding chain configuration
3. Updating network selection

## Performance Optimization

- Adjust `SCAN_INTERVAL_MS` for faster/slower scanning
- Increase `MAX_CONCURRENT_POSITIONS` for more diversification
- Tune technical indicator periods
- Adjust confidence thresholds

## Troubleshooting

### "Insufficient liquidity" errors
- Lower `MIN_LIQUIDITY_USD`
- Check token has active trading pairs

### Transactions failing
- Increase `MAX_SLIPPAGE_PERCENT`
- Verify wallet has sufficient balance
- Check RPC endpoint is responsive

### No buy signals
- Lower confidence threshold in code
- Adjust technical indicator parameters
- Verify tokens are being scanned

### High gas fees
- Use different RPC endpoint
- Trade during off-peak hours
- Increase minimum position size

## Development

### Build

```bash
npm run build
```

### Test

```bash
npm test
```

### Lint

```bash
npm run lint
```

## Architecture

```
memecoin-trading-bot/
├── src/
│   ├── analysis/          # Technical indicators
│   │   └── technical.ts
│   ├── dex/              # DEX integrations
│   │   ├── pancakeswap.ts
│   │   └── raydium.ts
│   ├── portfolio/        # Position management
│   │   └── manager.ts
│   ├── risk/             # Risk management
│   │   └── manager.ts
│   ├── scanner/          # Token discovery
│   │   └── tokens.ts
│   ├── strategy/         # Trading logic
│   │   └── trading.ts
│   ├── utils/            # Utilities
│   │   └── logger.ts
│   ├── config.ts         # Configuration
│   ├── types.ts          # TypeScript types
│   └── index.ts          # Main bot
├── logs/                 # Log files
├── .env                  # Configuration
└── package.json
```

## License

Apache-2.0

## Disclaimer

This software is provided "as is" for educational purposes. The authors are not responsible for any financial losses incurred. Cryptocurrency trading carries substantial risk. Always do your own research and never invest more than you can afford to lose.

## Support

For issues and questions:
- Open a GitHub issue
- Check logs for error details
- Review configuration settings

## Future Enhancements

- [ ] Machine learning price prediction
- [ ] Multi-DEX arbitrage
- [ ] Advanced order types (limit, trailing stop)
- [ ] Backtesting framework
- [ ] Web dashboard
- [ ] More technical indicators
- [ ] Social sentiment analysis
- [ ] Smart contract risk scoring
- [ ] Layer 2 support

---

