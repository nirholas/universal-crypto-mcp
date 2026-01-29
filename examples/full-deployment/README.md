# Full Deployment Example

A production-ready MCP server with **fully implemented** market data, DeFi analytics, wallet operations, technical analysis, and x402 payment integrations.

## 🌟 Features

This example provides **27 real, working tools** across 5 categories:

### 📊 Market Data (7 tools)
- `get_price` - Real-time crypto prices from CoinGecko
- `get_prices` - Batch price queries for multiple assets
- `get_market_overview` - Global market cap, volume, dominance
- `get_trending` - Top 10 trending cryptocurrencies
- `get_coin_details` - Comprehensive coin information
- `get_fear_greed_index` - Market sentiment indicator
- `get_ohlcv` - Candlestick data for charting

### 🏦 DeFi Analytics (7 tools)
- `get_defi_protocols` - Top protocols by TVL from DefiLlama
- `get_protocol_details` - Detailed protocol information
- `get_best_yields` - Best yield farming opportunities
- `get_chain_tvl` - TVL comparison across chains
- `get_stablecoins` - Stablecoin market data
- `get_dex_volume` - DEX trading volumes
- `get_bridge_volume` - Cross-chain bridge activity

### 👛 Wallet Operations (6 tools)
- `get_wallet_balance` - Native token balances (ETH, MATIC, etc.)
- `get_token_balance` - ERC20 token balances
- `get_gas_price` - Current gas prices with EIP-1559 data
- `get_block_number` - Latest block number
- `get_transaction` - Transaction details by hash
- `get_supported_chains` - List of supported networks

### 📈 Technical Analysis (2 tools)
- `get_trading_signal` - Comprehensive signals with RSI, MACD, Bollinger Bands
- `get_support_resistance` - Support/resistance levels with pivot points

### 💰 x402 Payments (5 tools)
- `x402_get_balance` - USDC balance for payments
- `x402_estimate_payment` - Gas cost estimation
- `x402_verify_payment` - Transaction verification
- `x402_get_networks` - Supported payment networks
- `x402_get_endpoints` - Payment-enabled API endpoints

## 🏗️ Architecture

\`\`\`
src/
├── server.ts              # Main MCP server with all tools
├── test.ts                # Integration tests
└── services/
    ├── index.ts           # Service exports
    ├── market-data.ts     # CoinGecko integration
    ├── defi.ts            # DefiLlama integration
    ├── wallet.ts          # Multi-chain RPC calls
    ├── technical-analysis.ts  # RSI, MACD, Bollinger
    └── x402.ts            # Payment protocol
\`\`\`

## 🚀 Quick Start

\`\`\`bash
# Install dependencies
pnpm install

# Run tests to verify everything works
pnpm test

# Start the server
pnpm start

# Or for development with hot reload
pnpm dev
\`\`\`

## 📡 Supported Chains

| Chain | Native Token | Chain ID |
|-------|--------------|----------|
| Ethereum | ETH | 1 |
| Arbitrum One | ETH | 42161 |
| Base | ETH | 8453 |
| Optimism | ETH | 10 |
| Polygon | MATIC | 137 |
| BNB Smart Chain | BNB | 56 |
| Avalanche C-Chain | AVAX | 43114 |

## 🔗 API Sources

All data comes from **real, free APIs**:

- **CoinGecko** - Market data, prices, trending coins
- **DefiLlama** - DeFi TVL, yields, protocols, DEX volume
- **Alternative.me** - Fear & Greed Index
- **Public RPCs** - Wallet balances, gas prices, transactions

## 📊 Example Outputs

### Trading Signal
\`\`\`json
{
  "symbol": "BTC",
  "signal": "buy",
  "score": 35,
  "confidence": 0.44,
  "indicators": {
    "rsi": { "current": 45.2, "signal": "neutral" },
    "macd": { "histogram": 150.5, "trend": "bullish" },
    "bollinger": { "percentB": 0.65, "signal": "neutral" },
    "movingAverages": { "priceVsSma200": "above" }
  },
  "analysis": "MACD shows bullish momentum. Price is above the 200-day SMA."
}
\`\`\`

### DeFi Yields
\`\`\`json
[
  {
    "pool": "0x...",
    "chain": "Ethereum",
    "project": "Aave V3",
    "symbol": "USDC",
    "tvlUsd": 500000000,
    "apy": 4.5,
    "stablecoin": true
  }
]
\`\`\`

## 🧪 Running Tests

\`\`\`bash
# Run all integration tests
pnpm test

# Expected output:
# ✅ getPrice - Bitcoin
# ✅ getMarketOverview
# ✅ getTrending
# ... (27+ tests)
# 📋 Test Summary: X passed, 0 failed
\`\`\`

## 🔧 Configuration

### MCP Client Setup

Add to your Claude Desktop or MCP client config:

\`\`\`json
{
  "mcpServers": {
    "universal-crypto": {
      "command": "node",
      "args": ["/path/to/examples/full-deployment/dist/server.js"]
    }
  }
}
\`\`\`

### Environment Variables (Optional)

\`\`\`bash
# For higher rate limits (optional)
COINGECKO_API_KEY=your_api_key

# For x402 payments
X402_NETWORK=base-mainnet
X402_PAY_TO=0x...
\`\`\`

## 📝 Technical Indicators

### RSI (Relative Strength Index)
- Period: 14
- Oversold: < 30
- Overbought: > 70

### MACD
- Fast EMA: 12
- Slow EMA: 26
- Signal: 9

### Bollinger Bands
- Period: 20
- Standard Deviations: 2

### Moving Averages
- SMA 20, 50, 200
- EMA 12, 26
- Golden/Death Cross detection

## 📄 License

Apache-2.0
