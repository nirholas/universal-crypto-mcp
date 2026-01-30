# Contributors & Attributions

This project integrates and builds upon several open-source MCP servers from the community. We maintain proper attribution to all original authors while adding our own improvements and integrations.

## Maintainer & Primary Contributor

- **Nich** ([@nichxbt](https://x.com/nichxbt)) - [github.com/nirholas](https://github.com/nirholas)
  - Project architecture and unified integration
  - Adapter layers and API harmonization
  - Documentation and deployment infrastructure

## Integrated Third-Party MCP Servers

### Community Crypto MCP Servers

#### 1. Crypto Technical Indicators MCP
- **Original Repository**: [kukapay/crypto-indicators-mcp](https://github.com/kukapay/crypto-indicators-mcp)
- **Original Author**: Kukapay
- **License**: MIT
- **Description**: Technical analysis indicators and strategies for cryptocurrencies
- **Integration Path**: `packages/market-data/crypto-indicators/`
- **Our Modifications**: Unified API adapter, additional indicators, real-time streaming

#### 2. Crypto Sentiment Analysis MCP
- **Original Repository**: [kukapay/crypto-sentiment-mcp](https://github.com/kukapay/crypto-sentiment-mcp)
- **Original Author**: Kukapay
- **License**: MIT
- **Description**: Cryptocurrency sentiment analysis from multiple sources
- **Integration Path**: `packages/market-data/crypto-sentiment/`
- **Our Modifications**: Enhanced data aggregation, caching layer, webhook support

#### 3. Crypto Fear & Greed Index MCP
- **Original Repository**: [kukapay/crypto-feargreed-mcp](https://github.com/kukapay/crypto-feargreed-mcp)
- **Original Author**: Kukapay
- **License**: MIT
- **Description**: Real-time and historical Crypto Fear & Greed Index data
- **Integration Path**: `packages/market-data/crypto-feargreed/`
- **Our Modifications**: Historical data caching, predictive analytics

#### 4. CryptoPanic News MCP
- **Original Repository**: [kukapay/cryptopanic-mcp-server](https://github.com/kukapay/cryptopanic-mcp-server)
- **Original Author**: Kukapay
- **License**: MIT
- **Description**: Latest cryptocurrency news from CryptoPanic
- **Integration Path**: `packages/market-data/cryptopanic/`
- **Our Modifications**: News categorization, sentiment scoring, deduplication

#### 5. CoinMarketCap API MCP
- **Original Repository**: [shinzo-labs/coinmarketcap-mcp](https://github.com/shinzo-labs/coinmarketcap-mcp)
- **Original Author**: Shinzo Labs
- **License**: MIT
- **Description**: Complete CoinMarketCap API implementation
- **Integration Path**: `packages/market-data/coinmarketcap/`
- **Our Modifications**: Rate limiting, response caching, batch operations

#### 6. Algorand Blockchain MCP
- **Original Repository**: [GoPlausible/algorand-mcp](https://github.com/GoPlausible/algorand-mcp)
- **Original Author**: GoPlausible
- **License**: MIT
- **Description**: Comprehensive Algorand blockchain interaction tools (40+ tools, 60+ resources)
- **Integration Path**: `packages/defi/protocols/algorand/`
- **Our Modifications**: Unified wallet integration, enhanced asset management

#### 7. Bybit Exchange MCP
- **Original Repository**: [ethancod1ng/bybit-mcp-server](https://github.com/ethancod1ng/bybit-mcp-server)
- **Original Author**: ethancod1ng
- **License**: MIT
- **Description**: Bybit cryptocurrency exchange API integration
- **Integration Path**: `packages/integrations/exchanges/bybit/`
- **Our Modifications**: WebSocket streaming, order management enhancements

#### 8. BSC Operations MCP
- **Original Repository**: [TermiX-official/bsc-mcp](https://github.com/TermiX-official/bsc-mcp)
- **Original Author**: TermiX Official
- **License**: MIT
- **Description**: BNB Chain operations including transfer, swap, launch, security checks
- **Integration Path**: `packages/defi/chain-tools/bsc-operations/`
- **Our Modifications**: Security scanning improvements, gas optimization

---

## 🚀 Wave 2 Integrations (January 30, 2026)

### Market Data & Analytics

#### 9. CoinGecko MCP (Official)
- **Original Repository**: [coingecko/coingecko-typescript](https://github.com/coingecko/coingecko-typescript/tree/main/packages/mcp-server)
- **Original Author**: CoinGecko
- **License**: MIT
- **Description**: Official CoinGecko API - 200+ blockchains, 8M+ tokens
- **Integration Path**: `packages/market-data/coingecko/`
- **Our Modifications**: Caching layer, batch queries, unified API

#### 10. DexPaprika MCP
- **Original Repository**: [coinpaprika/dexpaprika-mcp](https://github.com/coinpaprika/dexpaprika-mcp)
- **Original Author**: CoinPaprika
- **License**: MIT
- **Description**: Real-time DEX data, liquidity pools, trading analytics
- **Integration Path**: `packages/market-data/dexpaprika/`
- **Our Modifications**: Impermanent loss calculator, cross-chain comparison

### DeFi Protocols

#### 11. DeFi Rates MCP
- **Original Repository**: [qingfeng/defi-rates-mcp](https://github.com/qingfeng/defi-rates-mcp)
- **Original Author**: qingfeng
- **License**: MIT
- **Description**: Lending rates across 13+ protocols (Aave, Compound, Morpho, Venus, etc.)
- **Integration Path**: `packages/defi/rates/`
- **Our Modifications**: Rate comparison, looping strategy calculator, best rate finder

#### 12. BNB Chain MCP (Official)
- **Original Repository**: [bnb-chain/bnbchain-mcp](https://github.com/bnb-chain/bnbchain-mcp)
- **Original Author**: BNB Chain
- **License**: MIT
- **Description**: Official BSC, opBNB, and Greenfield blockchain interaction
- **Integration Path**: `packages/defi/bnbchain-mcp/`
- **Our Modifications**: PancakeSwap integration, multi-network support

### Security & Analytics

#### 13. ChainAware Behavioral Prediction MCP
- **Original Repository**: [ChainAware/behavioral-prediction-mcp](https://github.com/ChainAware/behavioral-prediction-mcp)
- **Original Author**: ChainAware
- **License**: MIT
- **Description**: Wallet behavior prediction, fraud detection, rug pull prediction
- **Integration Path**: `packages/security/chainaware/`
- **Our Modifications**: Batch analysis, risk scoring normalization

### Trading & Exchanges

#### 14. Binance MCP
- **Original Repository**: [ethancod1ng/binance-mcp-server](https://github.com/ethancod1ng/binance-mcp-server)
- **Original Author**: ethancod1ng
- **License**: MIT
- **Description**: Binance exchange integration - trading, market data, account management
- **Integration Path**: `packages/trading/binance-mcp/`
- **Our Modifications**: Smart order routing, cross-exchange comparison

---

## Original Components

The following components are original work developed specifically for this project:

- Core EVM module (`src/evm/`)
- Universal wallet management (`packages/wallets/`)
- x402 payment protocol (`packages/payments/x402/`)
- Marketplace infrastructure (`packages/marketplace/`)
- Trading automation (`packages/trading/`)
- Agent framework (`packages/agents/`)

## License Compliance

All integrated third-party code maintains its original license and copyright notices. Our modifications and additions are licensed under Apache-2.0 unless otherwise specified. See individual package directories for specific license files.

## How to Contribute

If you're an original author of an integrated package and want to:
- Update your component
- Remove your component
- Suggest improvements
- Claim additional attribution

Please open an issue or contact: [@nichxbt](https://x.com/nichxbt)

## Acknowledgments

We thank all the open-source developers in the MCP ecosystem who make projects like this possible. The crypto and blockchain MCP community continues to grow, and we're proud to contribute to and build upon this foundation.

### Special Thanks To

| Author | Projects | Contribution |
|--------|----------|--------------|
| Kukapay | 4 | Technical indicators, sentiment, fear/greed, news |
| CoinGecko | 1 | Official price/market data API |
| CoinPaprika | 1 | DEX analytics and liquidity data |
| BNB Chain | 1 | Official BSC/opBNB blockchain tools |
| ChainAware | 1 | Security and fraud detection |
| qingfeng | 1 | DeFi lending rates |
| ethancod1ng | 2 | Exchange integrations (Binance, Bybit) |
| Shinzo Labs | 1 | CoinMarketCap integration |
| GoPlausible | 1 | Algorand blockchain tools |
| TermiX | 1 | BSC operations |

---

**Last Updated**: January 30, 2026
**Total Integrated Servers**: 14
**Wave 1**: 8 servers (January 29, 2026)
**Wave 2**: 6 servers (January 30, 2026)
