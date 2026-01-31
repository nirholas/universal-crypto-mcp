---
title: "x402 Protocol Overview"
description: "HTTP 402 Payment Required - AI-native internet payments"
category: "x402"
keywords: ["x402", "http 402", "payments", "api monetization"]
order: 1
---

# x402 Protocol

x402 is an open standard for internet-native payments. It uses the HTTP 402 "Payment Required" status code to enable AI agents to autonomously pay for API access.

## Why x402?

Traditional API monetization requires:
- ❌ User accounts and authentication
- ❌ Credit card details
- ❌ Monthly subscriptions
- ❌ Human approval for each payment

With x402:
- ✅ No accounts needed
- ✅ Pay-per-request with crypto
- ✅ AI agents can pay autonomously
- ✅ Micropayments from $0.001

## How It Works

```
┌─────────────────────────────────────────────────────────────┐
│                        x402 Flow                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Client makes request                                     │
│     GET /api/premium                                        │
│                          ↓                                   │
│  2. Server returns 402 with price                           │
│     HTTP/1.1 402 Payment Required                           │
│     X-Payment-Required: {"price": "$0.01", ...}            │
│                          ↓                                   │
│  3. Client signs payment                                     │
│     Creates cryptographic payment proof                      │
│                          ↓                                   │
│  4. Client retries with payment                             │
│     GET /api/premium                                        │
│     X-Payment: <signed-payment>                             │
│                          ↓                                   │
│  5. Facilitator verifies & settles                          │
│     On-chain transaction executed                            │
│                          ↓                                   │
│  6. Server returns content                                   │
│     HTTP/1.1 200 OK                                         │
│     X-Payment-Settlement: {"tx": "0x..."}                   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Key Concepts

### Payment Required (402)

When an endpoint requires payment, the server responds with:

```http
HTTP/1.1 402 Payment Required
Content-Type: application/json
X-Payment-Required: ...

{
  "accepts": [{
    "scheme": "exact",
    "network": "eip155:8453",
    "payTo": "0x...",
    "price": "$0.01"
  }],
  "description": "Premium API access",
  "resource": "/api/premium"
}
```

### Payment Schemes

| Scheme | Description | Networks |
|--------|-------------|----------|
| `exact` | Pay exact amount | EVM, Solana |
| `streaming` | Pay-per-byte (coming) | EVM |

### Supported Networks

| Network | CAIP-2 ID | Currency |
|---------|-----------|----------|
| Base | `eip155:8453` | USDC |
| Ethereum | `eip155:1` | USDC |
| Arbitrum | `eip155:42161` | USDC |
| Solana | `solana:...` | USDC |

## Quick Start

### Server (Express)

```typescript
import express from 'express';
import { paymentMiddleware } from '@x402/express';

const app = express();

app.use(paymentMiddleware({
  facilitatorUrl: 'https://x402.org/facilitator',
  routes: {
    'GET /api/premium': {
      accepts: {
        scheme: 'exact',
        network: 'eip155:8453',
        payTo: '0xYourAddress',
        price: '$0.01',
      },
    },
  },
}));

app.get('/api/premium', (req, res) => {
  res.json({ data: 'Premium content!' });
});
```

### Client (MCP)

```typescript
// With Universal Crypto MCP, just ask:
// "Make a paid request to https://api.example.com/premium"

// Or use the x402 tools directly:
const result = await x402_pay_request({
  url: 'https://api.example.com/premium',
  maxPayment: '0.10', // Max $0.10
});
```

## Use Cases

### 1. API Monetization

Charge per request for AI/ML APIs:

```typescript
routes: {
  'POST /api/generate': {
    accepts: {
      price: async (req) => {
        const tokens = req.body.maxTokens;
        return `$${tokens * 0.00002}`;
      },
    },
  },
}
```

### 2. Premium Content

Paywall articles, data, or research:

```typescript
routes: {
  'GET /api/report/:id': {
    accepts: { price: '$5.00' },
    description: 'Full research report',
  },
}
```

### 3. AI Agent Expenses

Let AI agents pay for tools and services:

```typescript
// Agent wallet with spending limits
const wallet = new AgentWallet({
  dailyLimit: '$10.00',
  perRequestLimit: '$1.00',
});
```

## Architecture

### Components

| Component | Role |
|-----------|------|
| **Client** | Creates and signs payments |
| **Server** | Defines prices, returns content |
| **Facilitator** | Verifies and settles payments |

### Facilitator

The facilitator is a trusted third party that:
1. Verifies payment signatures
2. Executes on-chain transactions
3. Handles payment failures

You can use the public facilitator or run your own:

```bash
# Public facilitator
https://x402.org/facilitator

# Self-hosted
docker run -p 8080:8080 x402/facilitator
```

## Language SDKs

| Language | Package | Status |
|----------|---------|--------|
| [TypeScript](./typescript/overview.md) | `@x402/core` | ✅ Production |
| [Python](./python/overview.md) | `x402` | ✅ Production |
| [Go](./go/overview.md) | `x402-go` | ✅ Beta |
| [Java](./java/overview.md) | `x402-java` | 🔄 Alpha |

## Security

- **Non-custodial**: Payments are peer-to-peer
- **Verifiable**: All payments are on-chain
- **Revocable**: Payments can include deadlines
- **Audited**: Smart contracts are audited

See [Security Best Practices](../security/overview.md) for more.

## Next Steps

- [TypeScript SDK](./typescript/overview.md) - Full TypeScript guide
- [Python SDK](./python/overview.md) - Python implementation
- [Architecture](./architecture/overview.md) - Deep dive
- [Examples](./examples/index.md) - Real-world examples
