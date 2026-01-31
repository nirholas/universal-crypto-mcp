---
title: "Hono Adapter"
description: "x402 payments for Hono - perfect for edge and serverless"
category: "x402"
keywords: ["x402", "hono", "edge", "serverless", "cloudflare workers"]
order: 2
---

# Hono Adapter

The `@x402/hono` package provides middleware for Hono applications. It's optimized for edge runtimes like Cloudflare Workers, Deno Deploy, and Bun.

## Installation

```bash
pnpm add @x402/hono @x402/core @x402/evm
```

## Quick Start

```typescript
import { Hono } from 'hono';
import { paymentMiddleware } from '@x402/hono';

const app = new Hono();

// Add payment middleware
app.use('/api/premium/*', paymentMiddleware({
  facilitatorUrl: 'https://x402.org/facilitator',
  routes: {
    'GET /api/premium/data': {
      accepts: {
        scheme: 'exact',
        network: 'eip155:8453',
        payTo: '0xYourAddress',
        price: '$0.01',
      },
    },
  },
}));

app.get('/api/premium/data', (c) => {
  return c.json({ 
    data: 'Premium content!',
    paidBy: c.get('x402')?.payer,
  });
});

export default app;
```

## Cloudflare Workers

```typescript
import { Hono } from 'hono';
import { paymentMiddleware } from '@x402/hono';

type Bindings = {
  PAYMENT_ADDRESS: string;
  FACILITATOR_URL: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use('/api/*', async (c, next) => {
  const middleware = paymentMiddleware({
    facilitatorUrl: c.env.FACILITATOR_URL,
    routes: {
      'GET /api/data': {
        accepts: {
          scheme: 'exact',
          network: 'eip155:8453',
          payTo: c.env.PAYMENT_ADDRESS,
          price: '$0.01',
        },
      },
    },
  });
  return middleware(c, next);
});

app.get('/api/data', (c) => {
  return c.json({ success: true });
});

export default app;
```

## Context Extensions

After successful payment, access payment info via context:

```typescript
app.get('/api/premium', (c) => {
  const payment = c.get('x402');
  
  return c.json({
    payer: payment?.payer,
    amount: payment?.amount.toString(),
    network: payment?.network,
  });
});
```

## Deno Deploy

```typescript
import { Hono } from 'https://deno.land/x/hono/mod.ts';
import { paymentMiddleware } from '@x402/hono';

const app = new Hono();

app.use('/api/*', paymentMiddleware({
  facilitatorUrl: Deno.env.get('FACILITATOR_URL'),
  routes: {
    'GET /api/data': {
      accepts: {
        scheme: 'exact',
        network: 'eip155:8453',
        payTo: Deno.env.get('PAYMENT_ADDRESS'),
        price: '$0.01',
      },
    },
  },
}));

Deno.serve(app.fetch);
```

## Bun

```typescript
import { Hono } from 'hono';
import { paymentMiddleware } from '@x402/hono';

const app = new Hono();

app.use('/api/*', paymentMiddleware({
  facilitatorUrl: process.env.FACILITATOR_URL,
  routes: {
    'GET /api/data': {
      accepts: {
        scheme: 'exact',
        network: 'eip155:8453',
        payTo: process.env.PAYMENT_ADDRESS,
        price: '$0.01',
      },
    },
  },
}));

export default app;
```

## See Also

- [Express Adapter](./express.md) - For Node.js
- [Next.js Adapter](./nextjs.md) - For Next.js
- [Core SDK](../core.md) - Low-level API
