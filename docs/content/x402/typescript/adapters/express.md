---
title: "Express.js Adapter"
description: "Add x402 payments to Express.js applications with simple middleware"
category: "x402"
keywords: ["x402", "express", "middleware", "nodejs"]
order: 1
---

# Express.js Adapter

The `@x402/express` package provides middleware for Express.js applications to accept x402 payments.

## Installation

```bash
pnpm add @x402/express @x402/core @x402/evm
```

## Quick Start

```typescript
import express from 'express';
import { paymentMiddleware } from '@x402/express';

const app = express();

// Add x402 payment middleware
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

// Your protected endpoint
app.get('/api/premium', (req, res) => {
  res.json({ 
    message: 'Premium content!',
    paidBy: req.x402?.payer, // Access payment info
  });
});

app.listen(3000);
```

## Configuration

### `paymentMiddleware(options)`

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `facilitatorUrl` | `string` | Yes | URL of the x402 facilitator |
| `routes` | `RouteConfig` | Yes | Payment requirements per route |
| `fallthrough` | `boolean` | No | Pass non-matching routes to next handler (default: true) |
| `onPayment` | `Function` | No | Callback when payment is received |
| `onError` | `Function` | No | Custom error handler |

### Route Configuration

```typescript
const routes = {
  // Exact match
  'GET /api/data': { accepts: { ... } },
  
  // Wildcard
  'POST /api/*': { accepts: { ... } },
  
  // Multiple methods
  'GET|POST /api/resource': { accepts: { ... } },
};
```

## Payment Options

### Single Payment Option

```typescript
routes: {
  'GET /api/data': {
    accepts: {
      scheme: 'exact',
      network: 'eip155:8453',
      payTo: '0xYourAddress',
      price: '$0.01',
    },
    description: 'Premium data endpoint',
  },
}
```

### Multiple Networks

Accept payments from different chains:

```typescript
routes: {
  'GET /api/data': {
    accepts: [
      {
        scheme: 'exact',
        network: 'eip155:8453',       // Base
        payTo: '0xEvmAddress',
        price: '$0.01',
      },
      {
        scheme: 'exact',
        network: 'eip155:42161',      // Arbitrum
        payTo: '0xEvmAddress',
        price: '$0.01',
      },
      {
        scheme: 'exact',
        network: 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp',
        payTo: 'SolanaAddress...',
        price: '$0.01',
      },
    ],
  },
}
```

### Dynamic Pricing

```typescript
routes: {
  'POST /api/generate': {
    accepts: {
      scheme: 'exact',
      network: 'eip155:8453',
      payTo: '0xYourAddress',
      price: async (req) => {
        const tokens = req.body.maxTokens || 100;
        return `$${(tokens * 0.0001).toFixed(4)}`;
      },
    },
  },
}
```

## Request Object Extensions

The middleware adds an `x402` object to requests after successful payment:

```typescript
app.get('/api/premium', (req, res) => {
  const { x402 } = req;
  
  console.log(x402.payer);        // '0x...' - payer's address
  console.log(x402.amount);       // BigInt - amount paid
  console.log(x402.currency);     // 'USDC'
  console.log(x402.network);      // 'eip155:8453'
  console.log(x402.transaction);  // '0x...' - settlement tx
});
```

## Callbacks

### `onPayment`

Called when a payment is successfully processed:

```typescript
app.use(paymentMiddleware({
  facilitatorUrl: '...',
  routes: { ... },
  onPayment: async (payment, req, res) => {
    await db.payments.create({
      payer: payment.payer,
      amount: payment.amount.toString(),
      transaction: payment.transaction,
      endpoint: req.path,
      timestamp: new Date(),
    });
  },
}));
```

### `onError`

Custom error handling:

```typescript
app.use(paymentMiddleware({
  facilitatorUrl: '...',
  routes: { ... },
  onError: (error, req, res) => {
    console.error('Payment error:', error);
    
    if (error.code === 'INSUFFICIENT_FUNDS') {
      res.status(402).json({
        error: 'Insufficient funds',
        required: error.required,
        available: error.available,
      });
    } else {
      res.status(500).json({ error: 'Payment processing failed' });
    }
  },
}));
```

## TypeScript

Add types to your Express application:

```typescript
import { X402Request } from '@x402/express';

app.get('/api/premium', (req: X402Request, res) => {
  // req.x402 is properly typed
  const payer = req.x402?.payer;
});
```

Or extend the Express Request type:

```typescript
declare global {
  namespace Express {
    interface Request {
      x402?: {
        payer: string;
        amount: bigint;
        currency: string;
        network: string;
        transaction: string;
      };
    }
  }
}
```

## Complete Example

```typescript
import express from 'express';
import { paymentMiddleware } from '@x402/express';

const app = express();
app.use(express.json());

// Health check (free)
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Payment middleware
app.use(paymentMiddleware({
  facilitatorUrl: process.env.FACILITATOR_URL || 'https://x402.org/facilitator',
  routes: {
    'GET /api/premium': {
      accepts: {
        scheme: 'exact',
        network: 'eip155:8453',
        payTo: process.env.PAYMENT_ADDRESS!,
        price: '$0.01',
      },
      description: 'Premium API access',
      mimeType: 'application/json',
    },
    'POST /api/generate/*': {
      accepts: [
        {
          scheme: 'exact',
          network: 'eip155:8453',
          payTo: process.env.PAYMENT_ADDRESS!,
          price: '$0.05',
        },
      ],
      description: 'AI generation endpoints',
    },
  },
  onPayment: async (payment) => {
    console.log(`Payment received: ${payment.amount} ${payment.currency}`);
  },
}));

// Premium endpoint
app.get('/api/premium', (req, res) => {
  res.json({
    data: 'This is premium content!',
    paidBy: req.x402?.payer,
  });
});

// Generation endpoint
app.post('/api/generate/text', async (req, res) => {
  const { prompt } = req.body;
  const result = await generateText(prompt);
  res.json({ result });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## See Also

- [Hono Adapter](./hono.md) - For edge and serverless
- [Next.js Adapter](./nextjs.md) - For Next.js applications
- [Core SDK](../core.md) - Low-level API access
