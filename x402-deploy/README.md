# x402-deploy

> 1-Click Deployment and Monetization for MCP Servers and APIs

[![npm version](https://badge.fury.io/js/%40nirholas%2Fx402-deploy.svg)](https://www.npmjs.com/package/@nirholas/x402-deploy)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

## Overview

**x402-deploy** is a revolutionary 1-click deployment and monetization platform for MCP servers and APIs. It allows developers to add x402 payment capabilities to any project with minimal configuration.

Think of it as "The Stripe for AI Tools, but on-chain" - enabling instant micropayments for API calls without the complexity of traditional payment infrastructure.

## Features

- 🚀 **1-Click Deployment** - Deploy to Railway, Fly.io, Vercel, or Docker
- 💰 **Instant Monetization** - Add per-call pricing to any API route
- 🔗 **On-Chain Payments** - Native USDC payments on Arbitrum, Base, Polygon, and more
- 🔍 **Auto-Discovery** - Register on x402scan for discoverability
- 📊 **Earnings Dashboard** - Track revenue in real-time
- 🤖 **MCP Native** - First-class support for Model Context Protocol servers

## Installation

```bash
npm install -g @nirholas/x402-deploy
# or
npx @nirholas/x402-deploy
```

## Quick Start

```bash
# Initialize in your project
x402-deploy init

# Deploy with payments enabled
x402-deploy deploy

# View earnings
x402-deploy dashboard
```

## Configuration

After running `init`, a `x402.config.json` file is created:

```json
{
  "name": "my-api",
  "version": "1.0.0",
  "payment": {
    "wallet": "0x...",
    "network": "eip155:42161",
    "token": "USDC"
  },
  "pricing": {
    "model": "per-call",
    "default": "$0.001",
    "routes": {
      "GET /api/premium/*": "$0.01",
      "POST /api/generate": "$0.10"
    }
  },
  "discovery": {
    "enabled": true,
    "autoRegister": true
  },
  "deploy": {
    "provider": "railway"
  }
}
```

## CLI Commands

### `x402-deploy init`

Initialize x402 configuration in your project.

```bash
x402-deploy init
x402-deploy init -y --wallet 0x... --network eip155:42161
```

### `x402-deploy deploy`

Deploy your project with x402 payments enabled.

```bash
x402-deploy deploy
x402-deploy deploy --provider fly
x402-deploy deploy --dry-run
```

### `x402-deploy pricing`

Manage pricing configuration.

```bash
x402-deploy pricing --list
x402-deploy pricing --route "GET /api/*" --price "$0.01"
```

### `x402-deploy dashboard`

View earnings and analytics.

```bash
x402-deploy dashboard
x402-deploy dashboard --days 30 --json
```

### `x402-deploy status`

Check deployment status and health.

```bash
x402-deploy status
```

### `x402-deploy logs`

View deployment logs.

```bash
x402-deploy logs
x402-deploy logs -f --lines 200
```

## Supported Networks

| Network | Chain ID (CAIP-2) | Status |
|---------|-------------------|--------|
| Arbitrum One | `eip155:42161` | ✅ Recommended |
| Base | `eip155:8453` | ✅ Supported |
| Base Sepolia | `eip155:84532` | ✅ Testnet |
| Polygon | `eip155:137` | ✅ Supported |
| Optimism | `eip155:10` | ✅ Supported |
| Ethereum | `eip155:1` | ✅ Supported |
| Solana | `solana:...` | 🔜 Coming Soon |

## Supported Project Types

- **MCP Servers** - Model Context Protocol servers
- **Express APIs** - Node.js Express applications
- **Hono APIs** - Hono framework applications
- **FastAPI** - Python FastAPI applications
- **Next.js** - Next.js API routes

## Deployment Providers

| Provider | Command | Notes |
|----------|---------|-------|
| Railway | `--provider railway` | Recommended, automatic scaling |
| Fly.io | `--provider fly` | Edge deployment |
| Vercel | `--provider vercel` | Best for Next.js |
| Docker | `--provider docker` | Self-hosted |

## Programmatic Usage

```typescript
import { 
  X402Config, 
  buildProject, 
  deployToProvider,
  registerWithX402Scan 
} from "@nirholas/x402-deploy";

const config: X402Config = {
  name: "my-api",
  payment: {
    wallet: "0x...",
    network: "eip155:42161",
    token: "USDC"
  },
  pricing: {
    model: "per-call",
    default: "$0.001"
  }
};

// Build and deploy
const buildResult = await buildProject(config, process.cwd());
const deployResult = await deployToProvider(config, process.cwd());

// Register for discovery
await registerWithX402Scan(config, deployResult.url);

console.log(`Deployed to: ${deployResult.url}`);
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `X402_WALLET` | Default wallet address for payments |
| `X402_PRIVATE_KEY` | Private key for signing (optional) |
| `RAILWAY_TOKEN` | Railway deployment token |
| `FLY_API_TOKEN` | Fly.io API token |
| `VERCEL_TOKEN` | Vercel deployment token |

## How It Works

1. **Initialize**: `x402-deploy init` detects your project type and creates a configuration file
2. **Configure**: Set your wallet address, pricing, and deployment preferences
3. **Deploy**: `x402-deploy deploy` builds your project and deploys it with x402 payment middleware
4. **Earn**: Every API call triggers a micropayment directly to your wallet

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     x402-deploy CLI                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │   Gateway   │  │  Templates  │  │     Discovery       │ │
│  │  (Wrapper)  │  │  (Deploy)   │  │   (x402scan)        │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                 x402 Payment Layer                   │   │
│  │    ┌──────────┐  ┌──────────┐  ┌──────────┐        │   │
│  │    │ @x402/   │  │ @x402/   │  │ @x402/   │        │   │
│  │    │  core    │  │ express  │  │   evm    │        │   │
│  │    └──────────┘  └──────────┘  └──────────┘        │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## License

Apache-2.0 - See [LICENSE](./LICENSE) for details.

## Links

- [Documentation](https://github.com/nirholas/universal-crypto-mcp/tree/main/x402-deploy)
- [x402 Protocol](https://x402.org)
- [x402scan](https://x402scan.com)
- [Model Context Protocol](https://modelcontextprotocol.io)
