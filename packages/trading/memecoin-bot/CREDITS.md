# Credits and Attributions

This memecoin trading bot integrates code and patterns from several open-source projects. We give full credit to the original authors and maintain their MIT licenses.

## Core Dependencies

### Jupiter Exchange
- **Project**: Jupiter Aggregator SDK
- **Repository**: https://github.com/jup-ag/jupiter-swap-api-client
- **License**: MIT
- **Usage**: Swap routing, quote fetching, transaction building
- **Authors**: Jupiter Labs
- **Integration**: `/src/services/jupiter.ts`

### Raydium SDK V2
- **Project**: Raydium SDK Version 2
- **Repository**: https://github.com/raydium-io/raydium-sdk-v2
- **License**: MIT (implied from public code)
- **Usage**: AMM pool interactions, swap computations
- **Authors**: Raydium Team
- **Integration**: `/src/services/raydium.ts` (if implemented)

### Solana Web3.js
- **Project**: Solana JavaScript API
- **Repository**: https://github.com/solana-labs/solana-web3.js
- **License**: Apache 2.0
- **Usage**: Blockchain interactions, transaction handling
- **Authors**: Solana Labs

## Safety Implementations

This bot includes several safety features to protect users:

1. **Slippage Protection**: Based on Jupiter SDK examples
2. **Circuit Breakers**: Daily loss limits and position size caps
3. **Paper Trading Mode**: Test strategies without real funds
4. **Rug Pull Detection**: Multi-factor safety scoring
5. **Token Safety Checks**: Mint/freeze authority verification

## Original Author

**Primary Developer**: nich (@nirholas)
- Twitter/X: https://x.com/nichxbt
- GitHub: https://github.com/nirholas

## Disclaimer

**⚠️ TRADING RISK WARNING ⚠️**

Trading memecoins is extremely risky. This bot is provided as-is with no guarantees:

- You can lose 100% of your investment
- Past performance doesn't indicate future results
- Always test in paper trading mode first
- Never invest more than you can afford to lose
- The developers are not responsible for any financial losses

## License

This project is MIT licensed. See LICENSE file for details.

## Contributing

Contributions are welcome! Please ensure any code you contribute:
1. Includes proper attribution for external sources
2. Maintains compatibility with existing licenses
3. Includes tests and documentation
4. Follows the established code style

## Support

If you find this project helpful, consider:
- ⭐ Starring the repository
- 🐛 Reporting bugs and issues
- 💡 Suggesting improvements
- 🤝 Contributing code

---

Built with ❤️ by the community, for the community.
