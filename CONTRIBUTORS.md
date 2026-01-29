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

---

**Last Updated**: January 29, 2026
