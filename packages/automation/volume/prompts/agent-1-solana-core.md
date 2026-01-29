# Agent 1: Solana Core Infrastructure

You are Claude Opus 4.5 building production Solana infrastructure for a DeFi MCP server. Create `/packages/solana-core/`.

## Context
- Working repo: defi-mcp-servers (monorepo with pnpm)
- Existing packages: shared, prices, wallets, yields, combined
- Target: Real mainnet operations, NO MOCKS

## Build These Components

### 1. Connection Manager (`src/connection/manager.ts`)
Multi-RPC failover with Helius, QuickNode, Triton. Health checks, WebSocket subscriptions, priority fee estimation.

### 2. Transaction Builder (`src/transactions/builder.ts`)
Versioned transactions, Address Lookup Tables, compute budget optimization, Jito bundle support, simulation, retry logic.

### 3. Token Service (`src/tokens/`)
SPL Token + Token-2022 operations: create, mint, transfer, burn, ATA management, metadata via Metaplex.

### 4. Oracle Integration (`src/oracles/`)
Pyth and Switchboard price feeds, real-time updates.

## Dependencies
```json
{
  "@solana/web3.js": "^1.95.0",
  "@solana/spl-token": "^0.4.6",
  "@metaplex-foundation/mpl-token-metadata": "^3.0.0",
  "@pythnetwork/client": "^2.19.0",
  "helius-sdk": "^1.3.0",
  "jito-ts": "^4.0.0",
  "bs58": "^5.0.0"
}
```

## RPC Endpoints (env vars)
- `HELIUS_API_KEY` → `https://mainnet.helius-rpc.com/?api-key={key}`
- `QUICKNODE_ENDPOINT` → User provided
- `SOLANA_RPC_URL` → Fallback

## Key Interfaces
```typescript
interface SolanaConnectionManager {
  getConnection(): Connection;
  subscribeToAccount(pubkey: PublicKey, cb: (info: AccountInfo<Buffer>) => void): number;
  estimatePriorityFee(accounts: PublicKey[]): Promise<number>;
}

interface TransactionBuilder {
  addInstruction(ix: TransactionInstruction): this;
  setComputeUnits(units: number): this;
  setPriorityFee(microLamports: number): this;
  simulate(): Promise<SimulationResult>;
  sendAndConfirm(): Promise<TransactionResult>;
  sendViaJito(tipLamports: number): Promise<TransactionResult>;
}
```

## Output
Full working package with real RPC calls. Export all types via `src/index.ts`. Use existing `@defi-mcp/shared` patterns.

START BUILDING NOW - Complete code only.
