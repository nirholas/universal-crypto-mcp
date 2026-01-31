---
title: "@x402/core - Core SDK"
description: "Complete reference for @x402/core - transport-agnostic client, server, and facilitator"
category: "x402"
keywords: ["x402", "core", "client", "server", "facilitator"]
order: 2
---

# @x402/core

The core package provides transport-agnostic client, server, and facilitator implementations. It's the foundation that all HTTP adapters build upon.

## Installation

```bash
pnpm add @x402/core
```

## Client

The x402 client handles payment creation and signing on the payer's side.

### Creating a Client

```typescript
import { x402Client } from '@x402/core/client';
import { x402HTTPClient } from '@x402/core/http';
import { ExactEvmScheme } from '@x402/evm/exact/client';

// Create core client with payment schemes
const coreClient = new x402Client()
  .register('eip155:*', new ExactEvmScheme(evmSigner));

// Wrap with HTTP utilities
const client = new x402HTTPClient(coreClient);
```

### Client Methods

#### `register(pattern, scheme)`

Register a payment scheme for network patterns.

```typescript
client.register('eip155:*', evmScheme);      // All EVM chains
client.register('eip155:8453', baseScheme);  // Specific chain
client.register('solana:*', svmScheme);      // All Solana networks
```

#### `createPaymentPayload(paymentRequired)`

Create a signed payment payload.

```typescript
const paymentRequired = {
  scheme: 'exact',
  network: 'eip155:8453',
  price: { amount: 10000n, currency: 'USDC', decimals: 6 },
  payTo: '0xRecipientAddress',
  validUntil: Date.now() + 60000,
  nonce: 'unique-nonce',
};

const payload = await client.createPaymentPayload(paymentRequired);
// { header: 'x402-payment', value: 'base64-encoded-payment' }
```

### HTTP Client Utilities

#### `getPaymentRequiredResponse(getHeader, body)`

Parse a 402 response.

```typescript
const paymentRequired = client.getPaymentRequiredResponse(
  (name) => response.headers.get(name),
  await response.json()
);
```

#### `encodePaymentSignatureHeader(payload)`

Encode payment for request headers.

```typescript
const headers = client.encodePaymentSignatureHeader(payload);
// { 'X-Payment': 'base64...' }
```

#### `getPaymentSettleResponse(getHeader)`

Parse settlement confirmation.

```typescript
const settlement = client.getPaymentSettleResponse(
  (name) => response.headers.get(name)
);
console.log(settlement.transaction); // '0x...'
```

## Resource Server

The resource server protects endpoints and handles payment verification.

### Creating a Server

```typescript
import { x402ResourceServer, HTTPFacilitatorClient } from '@x402/core/server';
import { x402HTTPResourceServer } from '@x402/core/http';
import { ExactEvmScheme } from '@x402/evm/exact/server';

// Connect to facilitator
const facilitatorClient = new HTTPFacilitatorClient({
  url: 'https://x402.org/facilitator',
});

// Create resource server
const resourceServer = new x402ResourceServer(facilitatorClient)
  .register('eip155:*', new ExactEvmScheme());

// Initialize (fetches facilitator capabilities)
await resourceServer.initialize();
```

### Route Configuration

Define payment requirements per route:

```typescript
const routes = {
  // Single payment option
  'GET /api/data': {
    accepts: {
      scheme: 'exact',
      network: 'eip155:8453',
      payTo: '0xYourAddress',
      price: '$0.01',
    },
    description: 'Premium data access',
    mimeType: 'application/json',
  },
  
  // Multiple payment options
  'POST /api/ai': {
    accepts: [
      {
        scheme: 'exact',
        network: 'eip155:8453',
        payTo: evmAddress,
        price: '$0.05',
      },
      {
        scheme: 'exact',
        network: 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp',
        payTo: svmAddress,
        price: '$0.05',
      },
    ],
    description: 'AI generation endpoint',
  },
  
  // Wildcard routes
  'GET /api/premium/*': {
    accepts: {
      scheme: 'exact',
      network: 'eip155:8453',
      payTo: '0xYourAddress',
      price: '$0.02',
    },
  },
};
```

### Price Formats

Multiple ways to specify prices:

```typescript
// String with currency symbol
price: '$0.01'           // 0.01 USD in USDC
price: '€0.01'           // 0.01 EUR

// Object format
price: {
  amount: 10000n,        // Raw amount (6 decimals for USDC)
  currency: 'USDC',
  decimals: 6,
}

// Dynamic pricing
price: async (req) => {
  const complexity = await calculateComplexity(req);
  return `$${complexity * 0.001}`;
}
```

### Server Methods

#### `handleRequest(route, paymentHeader)`

Process an incoming request.

```typescript
const result = await resourceServer.handleRequest(
  'GET /api/data',
  request.headers['x-payment']
);

if (result.type === 'payment-required') {
  return new Response(JSON.stringify(result.body), {
    status: 402,
    headers: result.headers,
  });
}

if (result.type === 'payment-settled') {
  // Payment successful, serve content
  return new Response(JSON.stringify(data), {
    headers: result.headers, // Includes settlement info
  });
}
```

## Facilitator

The facilitator verifies and settles payments.

### Creating a Facilitator

```typescript
import { x402Facilitator } from '@x402/core/facilitator';
import { registerExactEvmScheme } from '@x402/evm/exact/facilitator';

const facilitator = new x402Facilitator();

// Register payment schemes
registerExactEvmScheme(facilitator, {
  signer: evmSigner,
  networks: ['eip155:8453', 'eip155:84532'],
});
```

### Facilitator Methods

#### `verify(payload, requirements)`

Verify a payment is valid.

```typescript
const result = await facilitator.verify(paymentPayload, paymentRequirements);

if (result.isValid) {
  console.log('Payment verified');
} else {
  console.error('Invalid:', result.error);
}
```

#### `settle(payload, requirements)`

Settle (execute) a verified payment.

```typescript
const result = await facilitator.settle(paymentPayload, paymentRequirements);

console.log('Transaction:', result.transaction);
console.log('Block:', result.blockNumber);
```

#### `getSupportedKinds()`

Get supported payment schemes.

```typescript
const kinds = await facilitator.getSupportedKinds();
// ['eip155:8453/exact', 'eip155:84532/exact', 'solana:.../exact']
```

## Types

### PaymentRequired

```typescript
interface PaymentRequired {
  scheme: string;
  network: string;
  price: Price;
  payTo: string;
  validUntil: number;
  nonce: string;
  resource?: string;
  extra?: Record<string, unknown>;
}
```

### PaymentPayload

```typescript
interface PaymentPayload {
  scheme: string;
  network: string;
  amount: bigint;
  currency: string;
  payTo: string;
  payFrom: string;
  validUntil: number;
  nonce: string;
  signature: string;
}
```

### SettleResult

```typescript
interface SettleResult {
  transaction: string;
  blockNumber?: number;
  gasUsed?: bigint;
  effectiveGasPrice?: bigint;
}
```

## Error Handling

```typescript
import {
  X402Error,
  PaymentRequiredError,
  PaymentVerificationError,
  PaymentSettlementError,
  UnsupportedSchemeError,
} from '@x402/core/errors';

try {
  await client.createPaymentPayload(paymentRequired);
} catch (error) {
  if (error instanceof UnsupportedSchemeError) {
    console.error('Scheme not registered:', error.scheme);
  } else if (error instanceof PaymentVerificationError) {
    console.error('Verification failed:', error.message);
  }
}
```

## Next Steps

- [EVM Mechanism](./mechanisms/evm.md) - EVM chain integration
- [SVM Mechanism](./mechanisms/svm.md) - Solana integration
- [Express Adapter](./adapters/express.md) - Express.js middleware
