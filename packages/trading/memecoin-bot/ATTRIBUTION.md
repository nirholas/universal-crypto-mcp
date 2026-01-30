# Attribution and Credits

This trading bot uses battle-tested, open-source libraries and integrates proven trading implementations.

## Core Dependencies

### Jupiter Exchange SDK (MIT License)
- **GitHub**: https://github.com/jup-ag/jupiter-quote-api-node
- **Purpose**: Swap aggregation and execution on Solana
- **License**: MIT
- **What we use**: Quote API, Swap execution, Transaction building
- **Why**: Jupiter is the #1 DEX aggregator on Solana with the best execution and routing

### Solana Web3.js (MIT License)
- **GitHub**: https://github.com/solana-labs/solana-web3.js
- **Purpose**: Solana blockchain interaction
- **License**: MIT
- **What we use**: Transaction sending, account management, RPC calls
- **Why**: Official Solana JavaScript SDK

### Solana SPL Token (Apache 2.0)
- **GitHub**: https://github.com/solana-labs/solana-program-library
- **Purpose**: SPL token operations
- **License**: Apache 2.0
- **What we use**: Token account creation, token transfers
- **Why**: Official SPL token library

## Market Data & Analysis

### DexScreener API
- **Website**: https://dexscreener.com
- **Purpose**: Real-time DEX pair data
- **What we use**: New pair discovery, liquidity metrics, volume data
- **Why**: Comprehensive coverage of Solana DEX pairs

### Birdeye API (Optional)
- **Website**: https://birdeye.so
- **Purpose**: Enhanced token metrics
- **What we use**: Holder counts, market cap data
- **Why**: Detailed token analytics

## Trading Strategy Patterns

### Momentum Trading
- **Based on**: Classic momentum indicator strategies
- **Sources**: 
  - RSI (Relative Strength Index)
  - MACD (Moving Average Convergence Divergence)
  - Volume analysis
- **Adaptations**: Applied to memecoin market dynamics

### Risk Management
- **Based on**: Professional trading risk management
- **Techniques**:
  - Position sizing
  - Stop-loss/take-profit
  - Trailing stops
  - Daily loss limits
- **Sources**: Industry standard practices

## Safety & Security

### RugCheck (Optional Integration)
- **Website**: https://rugcheck.xyz
- **Purpose**: Rug pull detection
- **What we use**: Token risk scoring
- **Why**: Community-trusted rug pull detector

## Development Tools

### TypeScript
- **License**: Apache 2.0
- **Purpose**: Type-safe development

### axios
- **License**: MIT
- **Purpose**: HTTP requests

### SQLite3
- **License**: Public Domain
- **Purpose**: Local database

### Decimal.js
- **License**: MIT
- **Purpose**: Precise decimal arithmetic

### chalk
- **License**: MIT
- **Purpose**: Terminal coloring

### ora
- **License**: MIT
- **Purpose**: Terminal spinners

### commander
- **License**: MIT
- **Purpose**: CLI interface

## Research & Documentation

This bot's trading strategy is informed by:

1. **Jupiter Best Practices**
   - https://station.jup.ag/docs/apis/swap-api
   - Priority fee optimization
   - Transaction simulation

2. **Solana Development**
   - https://solana.com/docs
   - Transaction building
   - Account management

3. **DeFi Trading Patterns**
   - Market making strategies
   - Liquidity analysis
   - Price impact calculation

## Testing & Validation

All swap execution code is based on proven implementations:
- Jupiter's official example code
- Solana's recommended patterns
- Real-world tested transaction flows

## Disclaimer

This bot integrates proven libraries and follows industry best practices, but:
- **Always test with small amounts first**
- **Trading carries inherent risks**
- **No guarantees of profits**
- **Use at your own risk**

## Contributing

If you improve this bot or find issues:
- Submit pull requests
- Report bugs
- Share your strategies (if you're comfortable)

## License

This project is MIT licensed. See LICENSE file.

Individual dependencies retain their own licenses (listed above).

---

**Built by nich (@nirholas)**
- X: https://x.com/nichxbt
- GitHub: https://github.com/nirholas

Special thanks to the Solana and Jupiter communities for building amazing tools.
