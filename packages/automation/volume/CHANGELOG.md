# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-01-26

### Added

#### @boosty/mcp-shared (v0.1.0)
- Cache utility with TTL support and automatic cleanup
- RateLimiter for API request management
- HttpClient with retry logic and rate limiting
- Chain configuration for Ethereum, Arbitrum, Base, Polygon
- Common type definitions for DeFi data

#### @boosty/mcp-prices (v0.1.0)
- `getTokenPrice` - Get current price and market data for tokens
- `getGasPrices` - Get gas prices across multiple chains
- `getTopMovers` - Get top gaining/losing tokens
- `getFearGreedIndex` - Get crypto Fear & Greed Index
- `comparePrices` - Compare multiple token prices
- `getTokenPriceHistory` - Get historical price data

#### @boosty/mcp-wallets (v0.1.0)
- `getWalletPortfolio` - Complete portfolio overview
- `getTokenBalances` - Detailed ERC20 balances
- `getNFTs` - NFT holdings with metadata
- `getDeFiPositions` - DeFi protocol positions
- `getApprovals` - Token approval analysis

#### @boosty/mcp-yields (v0.1.0)
- `getTopYields` - Top yield opportunities
- `getPoolDetails` - Detailed pool information
- `compareYields` - Compare multiple pools
- `getStablecoinYields` - Stablecoin-specific yields
- `getRiskAssessment` - Pool risk analysis
- `getYieldHistory` - Historical APY data
- `getLPYields` - Liquidity provider yields
- `estimateReturns` - Return projections

#### @boosty/mcp-defi (v0.1.0)
- Combined server with all tools
- CLI with selective tool enabling
- MCP manifest for tool discovery
- Integration tests

### Infrastructure
- Monorepo setup with pnpm workspaces
- TypeScript configuration
- Vitest for testing
- GitHub Actions CI/CD pipeline
- Comprehensive documentation

---

## Future Roadmap

### [0.2.0] - Planned
- WebSocket support for real-time price updates
- Additional chain support (Avalanche, BSC)
- Enhanced risk scoring with ML models
- Portfolio tracking over time

### [0.3.0] - Planned
- Transaction simulation
- Swap routing optimization
- Cross-chain yield comparison
- Protocol health monitoring
