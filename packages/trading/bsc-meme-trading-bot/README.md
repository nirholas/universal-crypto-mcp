# BSC Meme Trading Bot MCP Server

**Author:** [nirholas (Nich)](https://x.com/nichxbt) | [GitHub](https://github.com/nirholas)  
**License:** MIT

A production-ready Model Context Protocol (MCP) server for automated meme coin trading on Binance Smart Chain. Features real-time price monitoring, honeypot detection, automated trading strategies, risk management, and PancakeSwap integration.

## 🚀 Features

- **Automated Trading**: Scalp, swing, and HODL strategies with configurable profit targets
- **Safety Analysis**: Honeypot detection, liquidity checks, holder distribution analysis
- **Real-time Monitoring**: Continuous position tracking with auto-sell triggers
- **Risk Management**: Position size limits, exposure controls, emergency stop losses
- **PancakeSwap Integration**: Direct DEX trading with slippage protection
- **Token Discovery**: Find newly launched tokens on BSC
- **Position Tracking**: Real-time P/L calculations and portfolio monitoring

## 📋 Prerequisites

- Node.js 18+
- BSC RPC endpoint (default: bsc-dataseed1.binance.org)
- Private key with BNB for gas fees
- API keys (optional):
  - DEXScreener API
  - BSCScan API
  - Honeypot.is (public API)

## 🔧 Installation

```bash
pnpm install
pnpm build
```

## ⚙️ Configuration

Set environment variables:

```bash
export BSC_RPC_URL="https://bsc-dataseed1.binance.org"
export PRIVATE_KEY="your_private_key_here"
export BSCSCAN_API_KEY="your_bscscan_key" # Optional
export DEXSCREENER_API_KEY="your_dexscreener_key" # Optional
```

## 🎮 Usage

### Start the MCP Server

```bash
pnpm start
```

### Available Tools

#### 1. `meme_buy_token`
Buy a meme token with BNB.

```json
{
  "tokenAddress": "0x...",
  "amountBNB": 0.1,
  "slippagePercent": 15
}
```

#### 2. `meme_sell_token`
Sell tokens for BNB.

```json
{
  "tokenAddress": "0x...",
  "percentToSell": 100,
  "slippagePercent": 15
}
```

#### 3. `meme_analyze_token`
Comprehensive safety analysis with scoring.

```json
{
  "tokenAddress": "0x..."
}
```

**Returns:**
- Safety score (0-100)
- Honeypot detection
- Liquidity analysis
- Holder distribution
- Price data
- Contract verification status

#### 4. `meme_start_autotrading`
Enable automated trading with profit targets.

```json
{
  "tokenAddress": "0x...",
  "strategy": "scalp",
  "profitTarget": 20,
  "stopLoss": -10,
  "trailingStop": 5
}
```

**Strategies:**
- `scalp`: Quick 20% profits
- `swing`: Medium-term 100% profits
- `hodl`: Long-term 500%+ profits

#### 5. `meme_check_positions`
View all open positions with real-time P/L.

```json
{}
```

#### 6. `meme_find_new_tokens`
Discover newly launched tokens.

```json
{
  "minLiquidityBNB": 10,
  "maxAgeHours": 24
}
```

#### 7. `meme_set_risk_limits`
Configure risk management parameters.

```json
{
  "maxPositionSizeBNB": 1.0,
  "maxTotalExposureBNB": 5.0,
  "maxPositions": 10,
  "minLiquidityBNB": 10.0
}
```

## 🔐 Safety Features

### Honeypot Detection
- Checks if token can be sold
- Validates buy/sell tax levels
- Detects malicious contracts

### Risk Management
- Position size limits
- Total exposure controls
- Emergency stop losses at -50%
- Liquidity requirements

### Smart Execution
- Slippage protection
- Gas optimization
- Deadline enforcement (10 minutes)
- Transaction retry logic

## 📊 Trading Strategies

### Scalp Strategy
- **Profit Target:** 20%
- **Stop Loss:** -10%
- **Trailing Stop:** 5%
- **Ideal For:** High-volume trading

### Swing Strategy
- **Profit Target:** 100%
- **Stop Loss:** -15%
- **Trailing Stop:** 10%
- **Ideal For:** Medium-term holds

### HODL Strategy
- **Profit Target:** 500%
- **Stop Loss:** -20%
- **Trailing Stop:** 15%
- **Ideal For:** Long-term plays

## 🏗️ Architecture

```
src/
├── index.ts              # MCP server entry point
├── tools/
│   └── index.ts          # Tool definitions
├── services/
│   ├── pancakeswap.ts    # DEX trading logic
│   ├── analyzer.ts       # Token analysis & safety
│   ├── strategy.ts       # Auto-trading strategies
│   ├── positions.ts      # Position tracking
│   └── risk.ts           # Risk management
└── utils/
    └── logger.ts         # Logging utility
```

## 🔗 Smart Contracts

- **PancakeSwap Router V2:** `0x10ED43C718714eb63d5aA57B78B54704E256024E`
- **WBNB:** `0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c`
- **Chain ID:** 56 (BSC Mainnet)

## ⚠️ Risk Disclaimer

**USE AT YOUR OWN RISK.** This software is provided as-is without any guarantees. Meme coin trading is extremely high-risk and you can lose all your funds. Always:

- Start with small amounts
- Use testnets first
- Never invest more than you can afford to lose
- Research tokens thoroughly before trading
- Be aware of rug pulls and scams

## 🛠️ Development

### Build

```bash
pnpm build
```

### Watch Mode

```bash
pnpm dev
```

### Testing

```bash
# Test on BSC Testnet first
export BSC_RPC_URL="https://data-seed-prebsc-1-s1.binance.org:8545"
pnpm start
```

## 📝 Example Workflow

1. **Analyze a token:**
   ```
   meme_analyze_token { tokenAddress: "0x..." }
   ```

2. **Buy if safe:**
   ```
   meme_buy_token { tokenAddress: "0x...", amountBNB: 0.1 }
   ```

3. **Enable auto-trading:**
   ```
   meme_start_autotrading { 
     tokenAddress: "0x...", 
     strategy: "scalp" 
   }
   ```

4. **Monitor positions:**
   ```
   meme_check_positions {}
   ```

## 🤝 Contributing

Contributions welcome! Please ensure:
- All code follows existing style
- Tests pass
- Real implementations only (no mocks)
- MIT license compatible

## 📄 License

MIT © [nirholas (Nich)](https://github.com/nirholas)

## 🔗 Links

- **Twitter/X:** [@nichxbt](https://x.com/nichxbt)
- **GitHub:** [nirholas](https://github.com/nirholas)
- **Website:** [Universal Crypto MCP](https://github.com/nirholas/universal-crypto-mcp)

---

Built with 🚀 by [nirholas](https://github.com/nirholas)
