# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

#### 🏪 AI Service Marketplace (Major Feature)
- **Complete marketplace ecosystem** for AI service monetization and discovery
- **Smart Contract** (`AIServiceMarketplace.sol`):
  - On-chain service registry with metadata
  - Payment escrow with automatic settlement
  - Reputation system with weighted ratings
  - Subscription management with auto-renewal
  - Dispute resolution mechanism
  - Earnings withdrawal for service owners
- **TypeScript SDK** (`@nirholas/universal-crypto-mcp-marketplace`):
  - `MarketplaceService` class for service management
  - `SubscriptionManager` for on-chain subscriptions
  - Service discovery with advanced filtering
  - Rating and review submission
  - Analytics and metrics tracking
  - Dispute filing and resolution
- **REST API Server**:
  - Express.js-based marketplace API
  - Service registration and discovery endpoints
  - Subscription management endpoints
  - Rating and analytics endpoints
  - Webhook support for events
- **Flexible Pricing Models**:
  - Pay-per-use pricing
  - Daily, weekly, monthly, annual subscriptions
  - Free tier support
  - Multi-token payment support (USDC, DAI, etc.)
- **Documentation**:
  - Complete API reference
  - Step-by-step tutorial
  - Production-ready example (Weather AI service)
  - Use case guides
  - Best practices and security guidelines
- **Testing**:
  - Comprehensive unit tests
  - Service registration tests
  - Discovery and filtering tests
  - Rating system tests
  - Subscription tests

#### Other Additions
- CI/CD pipeline with GitHub Actions
- Comprehensive test suite with Vitest
- Security scanning with CodeQL
- Dependabot for automated dependency updates
- **Documentation Overhaul**:
  - Animated SVG demo in README
  - Architecture documentation with Mermaid diagrams
  - Troubleshooting guide with common issues
  - Quick Start guide (2-minute setup)
  - 50+ copy-paste example prompts
  - Comprehensive examples documentation
  - Resources & Learning page with external links
  - "Who's Using This" section
- **Developer Experience**:
  - TypeDoc API documentation generation
  - GitHub issue templates (bug reports, feature requests)
  - PR template for better contributions
  - FUNDING.yml for GitHub Sponsors
- **SEO & Discoverability**:
  - Enhanced package.json keywords (25 keywords)
  - Comparison table vs other MCP servers
  - Community links section (Discord, Twitter, GitHub Discussions)
  - Professional badges with logos

### Changed
- License updated from MIT to Apache-2.0
- Lowered test coverage thresholds to realistic levels
- Updated mkdocs navigation with new pages

## [0.1.0] - 2026-01-22

### Added
- Initial release
- Support for all major EVM chains (Ethereum, BSC, Polygon, Arbitrum, Base, Optimism, opBNB)
- 50+ MCP tools for blockchain interactions
- Multiple transport modes (stdio, HTTP, SSE)
- Integration with DeFi protocols (Aave, Compound, Uniswap, etc.)
- Cross-chain bridge support
- Security scanning tools (GoPlus integration)
- Market data from CoinGecko, DefiLlama, LunarCrush
- DEX analytics from DexPaprika and GeckoTerminal

[Unreleased]: https://github.com/nirholas/universal-crypto-mcp/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/nirholas/universal-crypto-mcp/releases/tag/v0.1.0

