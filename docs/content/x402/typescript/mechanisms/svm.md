---
title: "SVM Mechanism (Solana)"
description: "x402 payments on Solana and SVM chains"
category: "x402"
keywords: ["x402", "solana", "svm", "spl tokens"]
order: 2
---

# SVM Mechanism (Solana)

The `@x402/svm` package provides payment mechanisms for Solana and SVM-compatible chains.

## Installation

```bash
pnpm add @x402/svm @solana/web3.js
```

## Supported Networks

| Network | CAIP-2 ID | Status |
|---------|-----------|--------|
| Solana Mainnet | `solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp` | ✅ Production |
| Solana Devnet | `solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1` | ✅ Testnet |

## Client Setup

```typescript
import { x402Client } from '@x402/core/client';
import { ExactSvmScheme } from '@x402/svm/exact/client';
import { Keypair, Connection } from '@solana/web3.js';
import bs58 from 'bs58';

// Create keypair from private key
const keypair = Keypair.fromSecretKey(
  bs58.decode(process.env.SOLANA_PRIVATE_KEY!)
);

// Create connection
const connection = new Connection(
  process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com'
);

// Create x402 client with Solana support
const client = new x402Client()
  .register('solana:*', new ExactSvmScheme(keypair, connection));
```

## Server Setup

```typescript
import { x402ResourceServer } from '@x402/core/server';
import { ExactSvmScheme } from '@x402/svm/exact/server';

const server = new x402ResourceServer(facilitatorClient)
  .register('solana:*', new ExactSvmScheme());

await server.initialize();
```

## Route Configuration

### Single Network

```typescript
const routes = {
  'GET /api/data': {
    accepts: {
      scheme: 'exact',
      network: 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp',
      payTo: 'YourSolanaAddress...',
      price: '$0.01',
    },
  },
};
```

### Multi-Chain (EVM + Solana)

Accept payments from both EVM and Solana:

```typescript
const routes = {
  'GET /api/data': {
    accepts: [
      {
        scheme: 'exact',
        network: 'eip155:8453', // Base
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
};
```

## Token Support

### USDC (Default)

```typescript
price: '$0.01' // Uses USDC by default
```

### SPL Tokens

```typescript
price: {
  amount: 1000000n, // 1 USDC (6 decimals)
  currency: 'USDC',
  decimals: 6,
  mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC mint
}
```

## Facilitator Setup

```typescript
import { x402Facilitator } from '@x402/core/facilitator';
import { registerExactSvmScheme } from '@x402/svm/exact/facilitator';
import { Keypair, Connection } from '@solana/web3.js';

const facilitator = new x402Facilitator();

const keypair = Keypair.fromSecretKey(/* facilitator key */);
const connection = new Connection(process.env.SOLANA_RPC_URL!);

registerExactSvmScheme(facilitator, {
  keypair,
  connection,
  networks: ['solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp'],
});
```

## Transaction Handling

Solana transactions are confirmed differently than EVM:

```typescript
const settlement = await facilitator.settle(payment, requirements);

console.log('Signature:', settlement.transaction); // Solana tx signature
console.log('Slot:', settlement.slot);
console.log('Confirmations:', settlement.confirmations);
```

## Error Handling

```typescript
import {
  InsufficientBalanceError,
  TransactionExpiredError,
  InvalidSignatureError,
} from '@x402/svm/errors';

try {
  const payment = await client.createPaymentPayload(paymentRequired);
} catch (error) {
  if (error instanceof InsufficientBalanceError) {
    console.error('Insufficient SOL or token balance');
  } else if (error instanceof TransactionExpiredError) {
    console.error('Transaction expired, please retry');
  }
}
```

## Token Addresses

### USDC

| Network | Mint Address |
|---------|--------------|
| Mainnet | `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v` |
| Devnet | `4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU` |

## See Also

- [EVM Mechanism](./evm.md) - Ethereum & EVM chains
- [Core SDK](../core.md) - Transport-agnostic API
