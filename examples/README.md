# Examples

This directory contains working examples of Universal Crypto MCP usage.

## Available Examples

### [basic-mcp-server](./basic-mcp-server/)

A minimal MCP server with crypto tools. Perfect for getting started.

```bash
cd basic-mcp-server
npm install
npm start
```

### [trading-bot](./trading-bot/)

An automated trading bot using the trading package.

```bash
cd trading-bot
npm install
npm start
```

### [paid-api](./paid-api/)

A paid API using x402-deploy for cryptocurrency payments.

```bash
cd paid-api
npm install
npm start
```

### [marketplace-migration](./marketplace-migration/)

Step-by-step example migrating from x402 to the AI Service Marketplace.

```bash
cd marketplace-migration
pnpm install

# Run before migration (x402 only)
pnpm demo:before

# Run after migration (x402 + marketplace)
pnpm demo:after

# Run with MigrationHelper
pnpm demo:full
```

### [marketplace-service](./marketplace-service/)

A complete AI service registered in the marketplace.

```bash
cd marketplace-service
npm install
npm start
```

### [full-deployment](./full-deployment/)

A complete production deployment with all features.

```bash
cd full-deployment
npm install
npm start
```

## Quick Start

1. Choose an example that matches your use case
2. Follow the README in that directory
3. Customize for your needs

## Requirements

All examples require:
- Node.js 18+
- npm or pnpm

Some examples require additional setup:
- API keys (Binance, CoinGecko, etc.)
- Private keys (for wallet/payment features)
- Network access

## Contributing

Have a cool example? We'd love to include it! See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.
