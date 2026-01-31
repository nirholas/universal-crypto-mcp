---
title: "x402 TypeScript SDK"
description: "Complete guide to the x402 TypeScript SDK - 16+ packages for HTTP 402 payments"
category: "x402"
keywords: ["x402", "typescript", "sdk", "payments", "api monetization"]
order: 1
---

# x402 TypeScript SDK

The x402 TypeScript SDK is the most feature-complete implementation of the x402 payment protocol. With 16+ packages, it provides everything you need to add programmable payments to any TypeScript/JavaScript application.

## Why TypeScript?

- **First-class support**: The reference implementation of x402
- **Type safety**: Full TypeScript types for all APIs
- **Tree-shakeable**: Import only what you need
- **Multi-runtime**: Works in Node.js, Deno, Bun, and browsers

## Package Overview

| Package | Purpose | Install |
|---------|---------|---------|
| `@x402/core` | Core client, server, facilitator | `pnpm add @x402/core` |
| `@x402/evm` | Ethereum/EVM chain support | `pnpm add @x402/evm` |
| `@x402/svm` | Solana chain support | `pnpm add @x402/svm` |
| `@x402/express` | Express.js middleware | `pnpm add @x402/express` |
| `@x402/hono` | Hono middleware | `pnpm add @x402/hono` |
| `@x402/next` | Next.js integration | `pnpm add @x402/next` |
| `@x402/axios` | Axios interceptor | `pnpm add @x402/axios` |
| `@x402/fetch` | Fetch wrapper | `pnpm add @x402/fetch` |
| `@x402/paywall` | React paywall component | `pnpm add @x402/paywall` |

## Quick Start

### 1. Install Dependencies

```bash
pnpm add @x402/core @x402/evm @x402/express
```

### 2. Create a Paid API (Server)

```typescript
import express from 'express';
import { paymentMiddleware } from '@x402/express';

const app = express();

// Add payment middleware
app.use(paymentMiddleware({
  facilitatorUrl: 'https://x402.org/facilitator',
  routes: {
    'GET /api/premium': {
      accepts: {
        scheme: 'exact',
        network: 'eip155:8453', // Base
        payTo: '0xYourAddress',
        price: '$0.01',
      },
      description: 'Premium API access',
    },
  },
}));

app.get('/api/premium', (req, res) => {
  res.json({ data: 'Premium content!' });
});

app.listen(3000);
```

### 3. Make Paid Requests (Client)

```typescript
import { x402Client } from '@x402/core/client';
import { x402HTTPClient } from '@x402/core/http';
import { ExactEvmScheme } from '@x402/evm/exact/client';
import { createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { base } from 'viem/chains';

// Create wallet
const account = privateKeyToAccount(process.env.PRIVATE_KEY);
const wallet = createWalletClient({
  account,
  chain: base,
  transport: http(),
});

// Create x402 client
const client = new x402HTTPClient(
  new x402Client().register('eip155:*', new ExactEvmScheme(wallet))
);

// Make paid request
const response = await fetch('https://api.example.com/premium');

if (response.status === 402) {
  const paymentRequired = client.getPaymentRequiredResponse(
    (name) => response.headers.get(name),
    await response.json()
  );
  
  const payment = await client.createPaymentPayload(paymentRequired);
  
  const paidResponse = await fetch('https://api.example.com/premium', {
    headers: client.encodePaymentSignatureHeader(payment),
  });
  
  console.log(await paidResponse.json()); // Premium content!
}
```

## Architecture

The TypeScript SDK follows a modular architecture:

```
┌─────────────────────────────────────────────────────┐
│                    HTTP Layer                        │
│  @x402/express  @x402/hono  @x402/next  @x402/axios │
└─────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────┐
│                  @x402/core                          │
│    x402Client    x402ResourceServer    x402Facilitator│
└─────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────┐
│                 Mechanisms Layer                     │
│           @x402/evm           @x402/svm             │
└─────────────────────────────────────────────────────┘
```

## Supported Networks

### EVM Networks (via `@x402/evm`)

| Network | Chain ID | CAIP-2 ID |
|---------|----------|-----------|
| Ethereum Mainnet | 1 | `eip155:1` |
| Base | 8453 | `eip155:8453` |
| Base Sepolia | 84532 | `eip155:84532` |
| Arbitrum One | 42161 | `eip155:42161` |
| Optimism | 10 | `eip155:10` |

### Solana (via `@x402/svm`)

| Network | CAIP-2 ID |
|---------|-----------|
| Solana Mainnet | `solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp` |
| Solana Devnet | `solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1` |

## Next Steps

- [Core SDK Guide](./core.md) - Deep dive into @x402/core
- [EVM Integration](./mechanisms/evm.md) - Ethereum & EVM chains
- [HTTP Adapters](./adapters/index.md) - Express, Hono, Next.js
- [Examples](./examples/index.md) - Real-world code samples
