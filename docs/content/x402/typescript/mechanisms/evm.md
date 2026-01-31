---
title: "EVM Mechanism"
description: "x402 payments on Ethereum and EVM-compatible chains"
category: "x402"
keywords: ["x402", "evm", "ethereum", "base", "arbitrum", "optimism"]
order: 1
---

# EVM Mechanism

The `@x402/evm` package provides payment mechanisms for Ethereum and all EVM-compatible chains.

## Installation

```bash
pnpm add @x402/evm viem
```

## Supported Networks

| Network | Chain ID | CAIP-2 ID | Status |
|---------|----------|-----------|--------|
| Ethereum Mainnet | 1 | `eip155:1` | ✅ Production |
| Base | 8453 | `eip155:8453` | ✅ Production |
| Base Sepolia | 84532 | `eip155:84532` | ✅ Testnet |
| Arbitrum One | 42161 | `eip155:42161` | ✅ Production |
| Optimism | 10 | `eip155:10` | ✅ Production |
| Polygon | 137 | `eip155:137` | ✅ Production |

## Client Setup

### With Viem

```typescript
import { x402Client } from '@x402/core/client';
import { ExactEvmScheme } from '@x402/evm/exact/client';
import { createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { base } from 'viem/chains';

// Create wallet
const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`);
const wallet = createWalletClient({
  account,
  chain: base,
  transport: http(),
});

// Create x402 client with EVM support
const client = new x402Client()
  .register('eip155:*', new ExactEvmScheme(wallet));
```

### With Ethers.js

```typescript
import { x402Client } from '@x402/core/client';
import { ExactEvmScheme } from '@x402/evm/exact/client';
import { ethers } from 'ethers';

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const client = new x402Client()
  .register('eip155:*', new ExactEvmScheme(signer));
```

### Multi-Chain Support

```typescript
import { base, arbitrum, optimism } from 'viem/chains';

// Register multiple chains with different wallets
const client = new x402Client()
  .register('eip155:8453', new ExactEvmScheme(baseWallet))
  .register('eip155:42161', new ExactEvmScheme(arbitrumWallet))
  .register('eip155:10', new ExactEvmScheme(optimismWallet));
```

## Server Setup

```typescript
import { x402ResourceServer } from '@x402/core/server';
import { ExactEvmScheme } from '@x402/evm/exact/server';

const server = new x402ResourceServer(facilitatorClient)
  .register('eip155:*', new ExactEvmScheme());

await server.initialize();
```

## Facilitator Setup

```typescript
import { x402Facilitator } from '@x402/core/facilitator';
import { registerExactEvmScheme } from '@x402/evm/exact/facilitator';
import { createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { base } from 'viem/chains';

const facilitator = new x402Facilitator();

// Create signer for settlement
const account = privateKeyToAccount(process.env.FACILITATOR_KEY as `0x${string}`);
const signer = createWalletClient({
  account,
  chain: base,
  transport: http(),
});

registerExactEvmScheme(facilitator, {
  signer,
  networks: ['eip155:8453', 'eip155:84532'],
});
```

## Payment Flow

### Exact Scheme

The "exact" scheme transfers an exact amount of tokens:

```
┌─────────┐         ┌─────────┐         ┌─────────────┐
│  Client │         │  Server │         │ Facilitator │
└────┬────┘         └────┬────┘         └──────┬──────┘
     │                   │                      │
     │  1. Request       │                      │
     │──────────────────>│                      │
     │                   │                      │
     │  2. 402 + Price   │                      │
     │<──────────────────│                      │
     │                   │                      │
     │  3. Sign Payment  │                      │
     │───────────────────│──────────────────────│
     │                   │                      │
     │  4. Request + Sig │                      │
     │──────────────────>│                      │
     │                   │  5. Verify           │
     │                   │─────────────────────>│
     │                   │  6. Valid            │
     │                   │<─────────────────────│
     │                   │  7. Settle (on-chain)│
     │                   │─────────────────────>│
     │                   │  8. Tx Hash          │
     │                   │<─────────────────────│
     │  9. Response      │                      │
     │<──────────────────│                      │
```

## Token Support

### USDC (Default)

```typescript
const routes = {
  'GET /api/data': {
    accepts: {
      scheme: 'exact',
      network: 'eip155:8453',
      payTo: '0xYourAddress',
      price: '$0.01', // USDC by default
    },
  },
};
```

### Other Tokens

```typescript
const routes = {
  'GET /api/data': {
    accepts: {
      scheme: 'exact',
      network: 'eip155:8453',
      payTo: '0xYourAddress',
      price: {
        amount: 1000000000000000000n, // 1 token (18 decimals)
        currency: 'WETH',
        decimals: 18,
        token: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // WETH address
      },
    },
  },
};
```

## Gas Optimization

### EIP-3009 (Gasless Transfers)

For supported tokens (USDC), use gasless transfers where the facilitator pays gas:

```typescript
import { GaslessEvmScheme } from '@x402/evm/gasless/client';

const client = new x402Client()
  .register('eip155:8453', new GaslessEvmScheme(wallet));
```

### Batch Payments

```typescript
import { BatchEvmScheme } from '@x402/evm/batch/client';

// Pay multiple requests in a single transaction
const client = new x402Client()
  .register('eip155:8453', new BatchEvmScheme(wallet));
```

## Error Handling

```typescript
import {
  InsufficientBalanceError,
  InsufficientAllowanceError,
  TransactionFailedError,
  InvalidSignatureError,
} from '@x402/evm/errors';

try {
  const payment = await client.createPaymentPayload(paymentRequired);
} catch (error) {
  if (error instanceof InsufficientBalanceError) {
    console.error(`Need ${error.required}, have ${error.available}`);
  } else if (error instanceof InsufficientAllowanceError) {
    console.error('Need to approve token spending');
  }
}
```

## Contract Addresses

### USDC

| Network | Address |
|---------|---------|
| Ethereum | `0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48` |
| Base | `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913` |
| Arbitrum | `0xaf88d065e77c8cC2239327C5EDb3A432268e5831` |
| Optimism | `0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85` |

## See Also

- [SVM Mechanism](./svm.md) - Solana support
- [Core SDK](../core.md) - Transport-agnostic API
- [Express Adapter](../adapters/express.md) - Quick server setup
