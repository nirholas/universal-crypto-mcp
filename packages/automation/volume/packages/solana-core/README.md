# Solana Core Infrastructure

Production-ready Solana infrastructure for the DeFi MCP Server.

## Features

- **Multi-RPC Connection Manager**: Automatic failover, health checking, connection pooling
- **Transaction Builder**: Versioned transactions, Address Lookup Tables, compute budget optimization
- **Jito Bundle Support**: MEV protection via Jito block engine
- **Token Operations**: SPL Token, Token-2022 with extensions, ATA management
- **Oracle Integration**: Pyth and Switchboard price feeds
- **WebSocket Subscriptions**: Real-time account, program, and slot monitoring

## Installation

```bash
pnpm add @defi-mcp/solana-core
```

## Environment Variables

```env
# RPC Endpoints (at least one required)
HELIUS_API_KEY=your-helius-api-key
QUICKNODE_ENDPOINT=https://your-quicknode-endpoint
SOLANA_CLUSTER=mainnet-beta

# Optional
SOLANA_LOG_RPC=true
LOG_LEVEL=debug
```

## Usage

### Connection Manager

```typescript
import { createConnectionManager } from '@defi-mcp/solana-core';

const manager = createConnectionManager({
  cluster: 'mainnet-beta',
  commitment: 'confirmed',
});

// Get connection (automatically selects healthiest endpoint)
const connection = manager.getConnection();

// Get balance
const balance = await manager.getBalance(publicKey);

// Subscribe to account changes
const subId = manager.subscribeToAccount(publicKey, (accountInfo, slot) => {
  console.log('Account updated at slot', slot);
});

// Estimate priority fee
const priorityFee = await manager.estimatePriorityFee([account1, account2]);

// Cleanup
await manager.close();
```

### Transaction Builder

```typescript
import { 
  createConnectionManager, 
  createTransactionBuilder,
  createTransactionSender,
  getPriorityFeeTiers,
} from '@defi-mcp/solana-core';

const manager = createConnectionManager();
const connection = manager.getConnection();

// Build transaction
const builder = createTransactionBuilder(connection, payer.publicKey);

builder
  .addInstruction(transferInstruction)
  .addInstruction(swapInstruction)
  .setComputeUnits(200_000)
  .setPriorityFee(getPriorityFeeTiers().medium);

// Simulate first
const simulation = await builder.simulate();
if (!simulation.success) {
  console.error('Simulation failed:', simulation.error);
}

// Build and sign
const transaction = await builder.buildAndSign([payer]);

// Send
const sender = createTransactionSender(connection);
const result = await sender.sendAndConfirm(transaction);

console.log('Transaction confirmed:', result.signature);
```

### Jito Bundles (MEV Protection)

```typescript
import { 
  createJitoBundleSender, 
  JitoBundleSender 
} from '@defi-mcp/solana-core';

const jitoSender = createJitoBundleSender(connection);

// Add tip to transaction
const tipInstruction = jitoSender.createTipInstruction(
  payer.publicKey,
  JitoBundleSender.getRecommendedTip('high')
);

// Send via Jito
const result = await jitoSender.sendTransaction(transaction, {
  tipLamports: 100_000,
});
```

### Token Operations

```typescript
import {
  getTokenAccount,
  getTokenMetadataWithFallback,
  getOrCreateATA,
  createTokenTransferInstruction,
  toTokenAmount,
} from '@defi-mcp/solana-core';

// Get token account info
const tokenAccount = await getTokenAccount(connection, tokenAccountAddress);

// Get metadata (with fallback for well-known tokens)
const metadata = await getTokenMetadataWithFallback(connection, mintAddress);

// Get or create ATA
const { ata, instructions } = await getOrCreateATA(
  connection,
  mintAddress,
  ownerAddress,
  payerAddress
);

// Transfer tokens
const transferIx = createTokenTransferInstruction({
  mint: mintAddress,
  source: sourceATA,
  destination: destATA,
  owner: ownerAddress,
  amount: toTokenAmount(100, 6), // 100 tokens with 6 decimals
  decimals: 6,
});
```

### Oracle Price Feeds

```typescript
import { createPythOracle, createSwitchboardOracle } from '@defi-mcp/solana-core';

// Pyth Oracle
const pyth = createPythOracle(connection);

// Get SOL price
const solPrice = await pyth.getPrice('SOL/USD');
console.log(`SOL: $${solPrice?.price.toFixed(2)}`);

// Subscribe to price updates
const subscription = pyth.subscribeToPrice('BTC/USD', (price) => {
  console.log(`BTC: $${price.price.toFixed(2)}`);
}, 1000); // Update every second

// Cleanup
subscription.unsubscribe();

// Switchboard Oracle
const switchboard = createSwitchboardOracle(connection);
const ethPrice = await switchboard.getPrice('ETH/USD');
```

## API Reference

### ConnectionManager

| Method | Description |
|--------|-------------|
| `getConnection()` | Get a healthy connection |
| `getHealthyEndpoint()` | Get the healthiest RPC endpoint |
| `subscribeToAccount()` | Subscribe to account changes |
| `subscribeToProgramAccounts()` | Subscribe to program account changes |
| `subscribeToSlot()` | Subscribe to slot changes |
| `estimatePriorityFee()` | Estimate priority fee for accounts |
| `execute()` | Execute RPC call with failover |
| `close()` | Close all connections |

### TransactionBuilder

| Method | Description |
|--------|-------------|
| `addInstruction()` | Add single instruction |
| `addInstructions()` | Add multiple instructions |
| `setComputeUnits()` | Set compute unit limit |
| `setPriorityFee()` | Set priority fee |
| `useAddressLookupTable()` | Use ALT for compression |
| `simulate()` | Simulate transaction |
| `build()` | Build versioned transaction |
| `buildAndSign()` | Build and sign transaction |
| `estimateComputeUnits()` | Estimate CU needed |

### JitoBundleSender

| Method | Description |
|--------|-------------|
| `sendTransaction()` | Send single transaction via Jito |
| `sendBundle()` | Send bundle of transactions |
| `createTipInstruction()` | Create tip instruction |
| `getRecommendedTip()` | Get recommended tip amount |

## Error Handling

All methods throw typed errors:

```typescript
try {
  const result = await sender.sendAndConfirm(transaction);
} catch (error) {
  if (error.message.includes('blockhash')) {
    // Blockhash expired - rebuild transaction
  } else if (error.message.includes('insufficient')) {
    // Insufficient funds
  }
}
```

## License

MIT
