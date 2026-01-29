# @universal-crypto-mcp/x402-ecosystem

x402 ecosystem utilities for AI agents using the Model Context Protocol (MCP).

## Overview

This package extends the official x402 protocol with ecosystem utilities specifically designed for AI agents. It provides tools for managing agent payments, discovering paid tools, handling subscriptions, and earning yield on agent funds.

## Features

- **PayableAgent**: AI agent with built-in payment capabilities and spending limits
- **Tool Marketplace**: Discover and pay for premium MCP tools
- **Premium Tiers**: Subscription-based access levels
- **Yield Integration**: Earn yield on idle agent funds

## Installation

```bash
pnpm add @universal-crypto-mcp/x402-ecosystem
```

## Usage

### PayableAgent

Create an AI agent that can autonomously make payments:

```typescript
import { PayableAgent } from "@universal-crypto-mcp/x402-ecosystem";

const agent = new PayableAgent(
  {
    privateKey: "0x...",
    chain: "base",
  },
  {
    maxPaymentPerRequest: "1.00",
    maxPaymentPerHour: "10.00",
    maxPaymentPerDay: "100.00",
    allowedTokens: ["USDC"],
  }
);

// Handle x402 payment required
const result = await agent.handlePaymentRequired({
  amount: "0.50",
  token: "USDC",
  recipient: "0x...",
  description: "Premium API access",
});
```

### Tool Marketplace

Discover and use paid MCP tools:

```typescript
import { ToolMarketplace } from "@universal-crypto-mcp/x402-ecosystem";

const marketplace = new ToolMarketplace();

// Search for trading tools
const tools = marketplace.search({
  category: "trading",
  maxPrice: "0.10",
});

// Get featured tools
const featured = marketplace.getFeatured();
```

### Premium Tiers

Manage subscription-based access:

```typescript
import { PremiumManager } from "@universal-crypto-mcp/x402-ecosystem";

const premium = new PremiumManager();

// Get available tiers
const tiers = premium.getTiers();

// Subscribe a user
const subscription = premium.subscribe("user_123", "pro");

// Check if user can make request
const canRequest = premium.canMakeRequest("user_123");
```

### Yield Integration

Earn yield on agent funds:

```typescript
import { YieldProjector } from "@universal-crypto-mcp/x402-ecosystem";

const projector = new YieldProjector();

// Find best strategy
const strategy = projector.getBestStrategy({
  amount: "1000",
  chain: "arbitrum",
  maxRisk: "low",
});

// Project yield
const projection = projector.projectYield("1000", "usds-arbitrum", 30);
console.log(`30-day yield: ${projection.projectedYield} USDC`);
```

## Premium Tiers

| Tier | Price | Requests/Day | Features |
|------|-------|--------------|----------|
| Free | $0 | 100 | Basic access |
| Starter | $9.99/mo | 1,000 | Priority support |
| Pro | $49.99/mo | 10,000 | Real-time data |
| Enterprise | $299.99/mo | Unlimited | SLA guarantee |

## Related Packages

- [@x402/core](https://www.npmjs.com/package/@x402/core) - Official x402 protocol
- [@universal-crypto-mcp/payments-shared](../shared/) - Shared payment types
- [@universal-crypto-mcp/defi-sperax](../../defi/sperax/) - Sperax USDs integration

## License

Apache-2.0
