# 💳 Payments MCP Servers

> x402 payment protocol, USDC transfers, and stablecoin tools

## Overview

This package provides payment infrastructure for AI agents using the x402 payment protocol. Enable pay-per-call APIs, micro-payments, and stablecoin transfers.

## Package Structure

```
packages/payments/
├── shared/           # Shared payment types and utilities
├── x402/             # Full x402 reference implementation
├── x402-protocol/    # Reference to official Coinbase x402
├── x402-ecosystem/   # Ecosystem utilities (PayableAgent, marketplace)
└── x402-stablecoin/  # Stablecoin utilities (USDC, USDs, bridging)
```

## Available Packages

| Package | Description |
|---------|-------------|
| `@universal-crypto-mcp/payments-shared` | Shared payment types and utilities |
| `@universal-crypto-mcp/x402-ecosystem` | PayableAgent, marketplace, premium tiers |
| `@universal-crypto-mcp/x402-stablecoin` | USDC, USDs, cross-chain bridging |

## What is x402?

x402 is an HTTP-native payment protocol that uses the `402 Payment Required` status code. It enables:

- **Pay-per-call APIs** - Charge for API usage
- **Micro-payments** - Sub-cent transactions on L2s
- **Instant settlement** - No chargebacks
- **Developer-friendly** - Simple HTTP headers

## Available Servers

### 💰 x402 Payment Suite
- **x402 Core** - Protocol implementation
- **x402 Server** - Payment middleware
- **USDC Transfers** - Free USDC transfer tools
- **Stablecoin Toolkit** - Multi-stablecoin support

## Installation

```bash
# From workspace root
pnpm install

# Build payment packages
pnpm --filter "@nirholas/crypto-payments" build
```

## Configuration

```bash
# x402 Configuration
X402_PRIVATE_KEY=0x...
X402_NETWORK=base  # or base-sepolia for testnet

# Facilitator (optional)
X402_FACILITATOR_URL=https://facilitator.x402.org
```

## Usage

### Claude Desktop Configuration

```json
{
  "mcpServers": {
    "x402-payments": {
      "command": "node",
      "args": ["packages/payments/x402/dist/index.js"],
      "env": {
        "X402_PRIVATE_KEY": "your_key",
        "X402_NETWORK": "base"
      }
    }
  }
}
```

### Creating a Paid MCP Server

```typescript
import { createX402Server } from '@nirholas/crypto-payments';

const server = createX402Server({
  payTo: '0xYourAddress',
  price: '0.001', // $0.001 per call
  network: 'base',
  token: 'USDC',
});

// Your tools are now monetized!
server.tool('expensive_analysis', {
  price: '0.01', // $0.01 for this specific tool
}, async (args) => {
  // Tool implementation
});
```

## Available Tools

### Payment Tools
| Tool | Description |
|------|-------------|
| `send_usdc` | Send USDC to address |
| `check_balance` | Check USDC balance |
| `create_payment_request` | Generate 402 payment request |
| `verify_payment` | Verify payment was made |

### x402 Tools
| Tool | Description |
|------|-------------|
| `get_payment_header` | Get x402 payment header |
| `sign_payment` | Sign a payment |
| `estimate_fee` | Estimate transaction fee |

## Supported Networks

| Network | Token | Fee |
|---------|-------|-----|
| Base | USDC | ~$0.001 |
| Base Sepolia | USDC (test) | Free |
| Ethereum | USDC | ~$1-5 |
| Arbitrum | USDC | ~$0.01 |
| Optimism | USDC | ~$0.01 |

## x402 Flow

```
Client                    Server                    Blockchain
  │                         │                           │
  ├─── Request API ────────>│                           │
  │<── 402 + Price ─────────┤                           │
  │                         │                           │
  ├─── Sign Payment ───────>│                           │
  │                         ├─── Verify & Submit ──────>│
  │                         │<── Confirmed ─────────────┤
  │<── 200 + Response ──────┤                           │
  │                         │                           │
```

## Monetization Guide

### 1. Basic Setup
```typescript
// server.json
{
  "x402": {
    "payTo": "0xYourAddress",
    "defaultPrice": "0.001",
    "network": "base"
  }
}
```

### 2. Per-Tool Pricing
```typescript
// Premium tools cost more
tools: {
  "basic_query": { price: "0.001" },
  "advanced_analysis": { price: "0.01" },
  "full_report": { price: "0.10" }
}
```

### 3. Free Tier
```typescript
// First N calls free
rateLimits: {
  freeCallsPerDay: 10,
  freeCallsPerMonth: 100
}
```

## Security

⚠️ **Payment keys control funds**

- Use dedicated payment wallets
- Set spending limits
- Monitor transactions
- Test on testnet first

## License

Apache-2.0

---

## 👤 Author

**nich** - Building the most extensive crypto MCP repository

- 🐙 GitHub: [@nirholas](https://github.com/nirholas)
- 🐦 Twitter: [@nichxbt](https://x.com/nichxbt)
- 📦 NPM: [@nirholas](https://www.npmjs.com/~nirholas)

## 🤝 Contributing

Contributions welcome! See [CONTRIBUTING.md](../../CONTRIBUTING.md)

## 📄 License

Apache-2.0 - see [LICENSE](../../LICENSE)
