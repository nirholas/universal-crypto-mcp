# Memecoin Trading Bot

**⚠️ EXTREMELY HIGH RISK - READ SAFETY.md BEFORE USING ⚠️**

**Battle-tested automated trading bot for Solana memecoins**

[![Author](https://img.shields.io/badge/author-nich-blue)](https://x.com/nichxbt)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![Safety](https://img.shields.io/badge/READ-SAFETY.md-red)](SAFETY.md)

by **nich** (@nirholas) - [x.com/nichxbt](https://x.com/nichxbt)

## 🚨 Critical Warnings

**YOU CAN LOSE ALL YOUR MONEY**

- Memecoin trading is extremely risky
- This bot does NOT guarantee profits
- Always start with **PAPER TRADING MODE**
- Never invest more than you can afford to lose
- Read [SAFETY.md](SAFETY.md) completely before proceeding

## 🎯 What This Bot Does

### Automated Features
- 🔍 **Real-time Scanner**: Discovers new tokens from Birdeye & DexScreener
- 🛡️ **Safety Analysis**: Multi-factor rug pull detection
- 📊 **Technical Analysis**: RSI, MACD, Bollinger Bands
- 💱 **Smart Execution**: Jupiter aggregator for best swap routes
- 📈 **Risk Management**: Stop loss, take profit, trailing stops
- 📉 **Position Tracking**: Live P&L monitoring
- 🗄️ **Data Storage**: SQLite database for all trades
- 🧪 **Paper Trading**: Test strategies without real funds

### What It Doesn't Do
- ❌ Guarantee profits
- ❌ Eliminate risk
- ❌ Prevent all losses
- ❌ Make you rich

## 🏆 Credits & Attribution

This bot integrates code from several MIT-licensed projects:

### Core Technologies
- **Jupiter Aggregator** ([GitHub](https://github.com/jup-ag/jupiter-swap-api-client))
  - Best-in-class DEX aggregation
  - Slippage optimization
  - Transaction building patterns
  
- **Raydium SDK V2** ([GitHub](https://github.com/raydium-io/raydium-sdk-v2))
  - AMM pool interactions
  - Swap computation patterns
  
- **Solana Web3.js** ([GitHub](https://github.com/solana-labs/solana-web3.js))
  - Blockchain interaction layer

See [CREDITS.md](CREDITS.md) for complete attribution.

## 🛠️ Installation

### Prerequisites
- Node.js 18+ or higher
- pnpm package manager
- Solana wallet with private key
- Reliable RPC endpoint (Helius recommended)

### Quick Start

```bash
# Install dependencies
pnpm install

# Build the bot
pnpm build

# Setup configuration
cp .env.example .env
# Edit .env with your settings
```

## ⚙️ Configuration

### Step 1: Create Environment File

Create a `.env` file:

```env
# Network - Use a reliable RPC provider
SOLANA_RPC_URL=https://rpc.helius.xyz/?api-key=YOUR_KEY
SOLANA_WS_URL=wss://rpc.helius.xyz/?api-key=YOUR_KEY

# Wallet (⚠️ KEEP SECRET - NEVER SHARE)
WALLET_PRIVATE_KEY=your_base58_private_key_here
WALLET_ADDRESS=your_wallet_address

# Trading Parameters
BUY_AMOUNT=0.5              # SOL per trade
MAX_POSITION_SIZE=2.0       # Maximum SOL per position
MIN_POSITION_SIZE=0.1       # Minimum SOL per position
MAX_SLIPPAGE=5              # Max slippage %

# Risk Management
STOP_LOSS=20                # Stop loss %
TAKE_PROFIT=100             # Take profit %
TRAILING_STOP=15            # Trailing stop %
MAX_DAILY_LOSS=5            # Max daily loss in SOL

# Filters
MIN_LIQUIDITY=10000         # Minimum liquidity in USD
MAX_MARKET_CAP=1000000      # Maximum market cap in USD
MIN_VOLUME_24H=5000         # Minimum 24h volume in USD
MIN_HOLDERS=50              # Minimum token holders
MAX_TOKEN_AGE=24            # Maximum token age in hours

# Detection
NEW_PAIR_CHECK_INTERVAL=5000      # Check interval in ms
PRICE_UPDATE_INTERVAL=1000        # Price update interval in ms

# DEX
DEXES=raydium,jupiter        # Supported DEXes
PRIORITY_FEE=10000          # Priority fee in lamports

# API Keys (Optional but recommended)
BIRDEYE_API_KEY=your_key_here
DEXSCREENER_API_KEY=your_key_here
HELIUS_API_KEY=your_key_here
```

## 🎯 Usage

### Start the Bot

```bash
# Start automated trading
pnpm start

# Or use the CLI
pnpm trade start
```

### Monitor Performance

```bash
# Real-time monitoring dashboard
pnpm trade monitor

# View statistics
pnpm trade stats
```

### Analyze Tokens

```bash
# Analyze a specific token
pnpm trade analyze <TOKEN_ADDRESS>

# Example:
pnpm trade analyze 7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr
```

### Manual Trading

```bash
# Check balance
pnpm trade balance

# Manual buy
pnpm trade buy <TOKEN_ADDRESS> <SOL_AMOUNT>

# Manual sell
pnpm trade sell <TOKEN_ADDRESS> <TOKEN_AMOUNT>
```

## 📈 How It Works

1. **Scanning**: Bot continuously scans for new token pairs on Solana DEXes
2. **Analysis**: Each token goes through safety checks and metrics evaluation
3. **Signal Generation**: Trading signals generated based on multiple factors:
   - Liquidity and volume thresholds
   - Market cap requirements
   - Holder distribution
   - Price momentum
   - Safety score
4. **Execution**: If signal confidence > 70%, execute buy via Jupiter
5. **Management**: Monitor positions and auto-sell based on:
   - Take profit targets
   - Stop loss triggers
   - Trailing stop conditions

## 🛡️ Safety Features

- **Mint Authority Check**: Ensures supply can't be inflated
- **Freeze Authority Check**: Ensures tokens can't be frozen
- **Top Holder Analysis**: Detects whale concentration
- **Rug Pull Detection**: Integrates with RugCheck API
- **Honeypot Detection**: Tests token sellability
- **Daily Loss Limits**: Automatic circuit breaker

## 📊 Database Schema

The bot uses SQLite with three main tables:

- **trades**: All executed trades with tx signatures
- **positions**: Open and closed positions with P&L
- **token_metrics**: Token analysis data

## 🔧 API Integrations

### Required
- **Solana RPC**: Blockchain interaction
- **Jupiter**: Swap execution and routing

### Optional (Recommended)
- **DexScreener**: New pair discovery and metrics
- **Birdeye**: Enhanced token data
- **Helius**: Advanced RPC features
- **RugCheck**: Rug pull detection

## ⚠️ Risk Disclaimer

**IMPORTANT**: This bot trades real money and can result in significant losses.

- Only use funds you can afford to lose
- Start with small position sizes
- Test thoroughly on devnet first
- Monitor the bot regularly
- Understand the risks of memecoin trading
- This software is provided as-is with no guarantees

## 🐛 Troubleshooting

### Transaction Failures
- Increase `PRIORITY_FEE` for faster execution
- Increase `MAX_SLIPPAGE` for volatile tokens
- Check RPC endpoint reliability

### Low Win Rate
- Adjust filters to be more strict
- Increase minimum confidence threshold
- Reduce position sizes
- Enable more safety checks

### API Rate Limits
- Use paid RPC endpoints (Helius, QuickNode)
- Increase check intervals
- Implement exponential backoff

## 📝 Development

```bash
# Run in development mode
pnpm dev

# Run tests
pnpm test

# Format code
pnpm format

# Lint
pnpm lint
```

## 🤝 Contributing

Contributions welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 📄 License

MIT License - see [LICENSE](LICENSE) file

## 👨‍💻 Author

**nich** (@nirholas)
- X: [x.com/nichxbt](https://x.com/nichxbt)
- GitHub: [github.com/nirholas](https://github.com/nirholas)

## 🙏 Acknowledgments

- Jupiter Exchange for swap aggregation
- DexScreener for market data
- Solana community for tools and support

---

**⚡ Trade smart, not hard.**

*Built with ❤️ by [nich](https://x.com/nichxbt)*
