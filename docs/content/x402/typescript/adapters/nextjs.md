---
title: "Next.js Adapter"
description: "Add x402 payments to Next.js API routes and Server Actions"
category: "x402"
keywords: ["x402", "nextjs", "react", "server actions", "api routes"]
order: 3
---

# Next.js Adapter

The `@x402/next` package integrates x402 payments with Next.js applications, supporting both App Router and Pages Router.

## Installation

```bash
pnpm add @x402/next @x402/core @x402/evm
```

## App Router (API Routes)

### Route Handler

```typescript
// app/api/premium/route.ts
import { withPayment } from '@x402/next';

export const GET = withPayment(
  async (request) => {
    const payment = request.x402;
    
    return Response.json({
      data: 'Premium content!',
      paidBy: payment?.payer,
    });
  },
  {
    facilitatorUrl: process.env.FACILITATOR_URL!,
    accepts: {
      scheme: 'exact',
      network: 'eip155:8453',
      payTo: process.env.PAYMENT_ADDRESS!,
      price: '$0.01',
    },
  }
);
```

### Dynamic Pricing

```typescript
// app/api/generate/route.ts
import { withPayment } from '@x402/next';

export const POST = withPayment(
  async (request) => {
    const { prompt } = await request.json();
    const result = await generateText(prompt);
    return Response.json({ result });
  },
  {
    facilitatorUrl: process.env.FACILITATOR_URL!,
    accepts: {
      scheme: 'exact',
      network: 'eip155:8453',
      payTo: process.env.PAYMENT_ADDRESS!,
      price: async (request) => {
        const body = await request.clone().json();
        const tokens = body.maxTokens || 100;
        return `$${(tokens * 0.0001).toFixed(4)}`;
      },
    },
  }
);
```

## Server Actions

Use the `paidAction` wrapper for Server Actions:

```typescript
// app/actions.ts
'use server';

import { paidAction } from '@x402/next';

export const generateImage = paidAction(
  async (formData: FormData, payment) => {
    const prompt = formData.get('prompt') as string;
    const image = await generateImageFromPrompt(prompt);
    
    return {
      image,
      paidBy: payment.payer,
    };
  },
  {
    facilitatorUrl: process.env.FACILITATOR_URL!,
    accepts: {
      scheme: 'exact',
      network: 'eip155:8453',
      payTo: process.env.PAYMENT_ADDRESS!,
      price: '$0.10',
    },
  }
);
```

Use in your component:

```typescript
// app/page.tsx
'use client';

import { useX402 } from '@x402/next/client';
import { generateImage } from './actions';

export default function Page() {
  const { payAndExecute, isLoading } = useX402();

  async function handleSubmit(formData: FormData) {
    const result = await payAndExecute(() => generateImage(formData));
    console.log(result.image);
  }

  return (
    <form action={handleSubmit}>
      <input name="prompt" placeholder="Describe an image..." />
      <button type="submit" disabled={isLoading}>
        Generate ($0.10)
      </button>
    </form>
  );
}
```

## Middleware

Protect entire route segments:

```typescript
// middleware.ts
import { createX402Middleware } from '@x402/next';

export const middleware = createX402Middleware({
  facilitatorUrl: process.env.FACILITATOR_URL!,
  routes: {
    '/api/premium/:path*': {
      accepts: {
        scheme: 'exact',
        network: 'eip155:8453',
        payTo: process.env.PAYMENT_ADDRESS!,
        price: '$0.01',
      },
    },
  },
});

export const config = {
  matcher: '/api/premium/:path*',
};
```

## Pages Router

```typescript
// pages/api/premium.ts
import { withPaymentHandler } from '@x402/next/pages';

export default withPaymentHandler(
  async (req, res) => {
    res.json({
      data: 'Premium content!',
      paidBy: req.x402?.payer,
    });
  },
  {
    facilitatorUrl: process.env.FACILITATOR_URL!,
    accepts: {
      scheme: 'exact',
      network: 'eip155:8453',
      payTo: process.env.PAYMENT_ADDRESS!,
      price: '$0.01',
    },
  }
);
```

## Client-Side Provider

Wrap your app with the x402 provider for client-side payment handling:

```typescript
// app/providers.tsx
'use client';

import { X402Provider } from '@x402/next/client';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <X402Provider
      config={{
        network: 'eip155:8453',
        // Optional: provide wallet connector
      }}
    >
      {children}
    </X402Provider>
  );
}
```

## Paywall Component

Add paywalls to your content:

```typescript
import { Paywall } from '@x402/next/client';

export default function PremiumContent() {
  return (
    <Paywall
      price="$0.10"
      network="eip155:8453"
      payTo="0xYourAddress"
      onSuccess={() => console.log('Paid!')}
    >
      <div>
        <h1>Premium Content</h1>
        <p>This content requires payment to access.</p>
      </div>
    </Paywall>
  );
}
```

## Environment Variables

```env
# .env.local
FACILITATOR_URL=https://x402.org/facilitator
PAYMENT_ADDRESS=0xYourPaymentAddress
```

## See Also

- [Express Adapter](./express.md)
- [Paywall Component](./paywall.md)
- [React Integration](../integrations/react.md)
