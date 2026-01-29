# @defi-mcp/wallet-manager

Comprehensive HD wallet management, secure key storage, and fund distribution system for Solana.

## Features

- **HD Wallet Derivation**: BIP39 mnemonic generation and BIP44 derivation paths for Solana (`m/44'/501'/x'/0'`)
- **Secure Key Storage**: AES-256-GCM encryption with scrypt key derivation
- **Wallet Operations**: Balance checking, transaction history, token account management
- **Fund Distribution**: Batch transfers with even, random, or weighted distribution strategies
- **Transaction Signing**: Rate-limited signing queue with audit logging
- **Database Persistence**: PostgreSQL storage with Drizzle ORM

## Installation

```bash
pnpm add @defi-mcp/wallet-manager
```

## Quick Start

```typescript
import {
  createWalletManager,
  generateMnemonic,
  validateMnemonic,
} from '@defi-mcp/wallet-manager';

// Create wallet manager instance
const manager = createWalletManager({
  database: {
    host: 'localhost',
    port: 5432,
    database: 'wallets',
    user: 'postgres',
    password: 'secret',
  },
  solana: {
    rpcUrl: 'https://api.mainnet-beta.solana.com',
    commitment: 'confirmed',
  },
});

// Generate a new mnemonic (24 words)
const mnemonic = generateMnemonic(256);
console.log('Mnemonic:', mnemonic);

// Validate mnemonic
if (validateMnemonic(mnemonic)) {
  // Create master wallet
  const masterWallet = await manager.hdWallet.createMasterWallet(mnemonic);
  console.log('Master wallet ID:', masterWallet.id);

  // Derive 100 wallets
  const wallets = await manager.hdWallet.deriveWalletBatch(masterWallet, 0, 100);
  console.log('Derived', wallets.length, 'wallets');
}
```

## HD Wallet Derivation

### Generate Mnemonic

```typescript
import { generateMnemonic, validateMnemonic, getWordCount } from '@defi-mcp/wallet-manager';

// Generate 12-word mnemonic
const mnemonic12 = generateMnemonic(128);

// Generate 24-word mnemonic (more secure)
const mnemonic24 = generateMnemonic(256);

// Validate mnemonic
const isValid = validateMnemonic(mnemonic24);

// Get word count
const wordCount = getWordCount(mnemonic24); // 24
```

### Create and Derive Wallets

```typescript
import { HDWalletFactory } from '@defi-mcp/wallet-manager';

// Create master wallet from mnemonic
const master = await HDWalletFactory.createMasterWallet(mnemonic, 'optional-passphrase');

// Derive single wallet
const wallet0 = await HDWalletFactory.deriveWallet(master, 0);
console.log('Address:', wallet0.address);
console.log('Path:', wallet0.derivationPath); // m/44'/501'/0'/0'

// Batch derive wallets (up to 10,000)
const wallets = await HDWalletFactory.deriveWalletBatch(master, 0, 1000);
```

## Secure Key Storage

### Password Requirements

- Minimum 12 characters
- Must contain uppercase, lowercase, number, and special character

### Store and Retrieve Keys

```typescript
import { KeyVault, encryptData, decryptData } from '@defi-mcp/wallet-manager';

const password = 'MySecurePassword123!';

// Store a private key
await KeyVault.storeKey(walletId, privateKeyBytes, password);

// Retrieve a private key
const privateKey = await KeyVault.retrieveKey(walletId, password);

// Rotate encryption password
await KeyVault.rotateEncryption(walletId, oldPassword, newPassword);

// Export entire vault (encrypted backup)
const backup = await KeyVault.exportVault(password);

// Import vault from backup
await KeyVault.importVault(backup, password);
```

## Wallet Operations

### Check Balances

```typescript
import { Connection } from '@solana/web3.js';
import { getWalletBalance, getWalletBalances, getAllTokenBalances } from '@defi-mcp/wallet-manager';

const connection = new Connection('https://api.mainnet-beta.solana.com');

// Get single wallet balance
const balance = await getWalletBalance(connection, walletAddress, solPriceUsd);
console.log('SOL:', balance.sol);
console.log('Total USD:', balance.totalValueUsd);
console.log('Tokens:', balance.tokens);

// Batch balance check
const balances = await getWalletBalances(connection, [addr1, addr2, addr3], solPriceUsd);

// Get all token balances
const tokens = await getAllTokenBalances(connection, walletAddress);
```

### Transaction History

```typescript
import { getTransactionHistory } from '@defi-mcp/wallet-manager';

const history = await getTransactionHistory(connection, walletAddress, 50);

for (const tx of history) {
  console.log(`${tx.type}: ${tx.signature} - ${tx.success ? 'Success' : 'Failed'}`);
}
```

### Token Account Management

```typescript
import {
  getTokenAccounts,
  getEmptyTokenAccounts,
  estimateRentRecovery,
  buildCloseEmptyAccountsTransaction,
} from '@defi-mcp/wallet-manager';

// Get all token accounts
const accounts = await getTokenAccounts(connection, walletAddress);

// Find empty accounts (can be closed to recover rent)
const emptyAccounts = await getEmptyTokenAccounts(connection, walletAddress);

// Estimate rent recovery
const { accountCount, totalRentSol } = await estimateRentRecovery(connection, walletAddress);
console.log(`Can recover ${totalRentSol} SOL from ${accountCount} empty accounts`);

// Build transaction to close empty accounts
const { transaction, rentToRecover } = await buildCloseEmptyAccountsTransaction(connection, walletAddress);
```

## Fund Distribution

### Distribute SOL

```typescript
import { createFundDistributor, calculateDistribution } from '@defi-mcp/wallet-manager';

const distributor = createFundDistributor({
  connection,
  signTransaction: async (walletId, tx, password) => { /* ... */ },
  getAddress: async (walletId) => { /* ... */ },
  password: 'MySecurePassword123!',
});

// Calculate distribution (preview)
const amounts = calculateDistribution(
  BigInt(1_000_000_000), // 1 SOL in lamports
  10, // 10 wallets
  'even' // even | random | weighted
);

// Execute distribution
const result = await distributor.distributeSol({
  sourceWalletId: 'main-wallet',
  destinationWalletIds: ['wallet-1', 'wallet-2', ...],
  totalAmount: BigInt(1_000_000_000),
  distribution: 'even',
});

console.log(`Distributed to ${result.successCount} wallets`);
console.log(`Total fees: ${result.totalFees} lamports`);
```

### Consolidate Funds

```typescript
import { consolidateSolSequential, estimateConsolidation } from '@defi-mcp/wallet-manager';

// Estimate consolidation
const estimate = await estimateConsolidation(connection, walletIds, getAddress);
console.log(`Can consolidate ${estimate.totalSol} lamports from ${estimate.walletCount} wallets`);

// Execute consolidation
const result = await consolidateSolSequential(
  connection,
  walletIds,
  destinationAddress,
  signTransaction,
  getAddress,
  password
);
```

## Transaction Signing

### Rate-Limited Signing

```typescript
import { createTransactionSigner, SigningQueue } from '@defi-mcp/wallet-manager';

const signer = createTransactionSigner({
  keyVault,
  rateLimitPerMinute: 60, // Max 60 signings per minute
});

// Register wallet
signer.registerWallet(walletId, walletAddress);

// Sign transaction
const signedTx = await signer.signTransaction(walletId, transaction, password);

// Sign message
const signature = await signer.signMessage(walletId, messageBytes, password);

// Check rate limit status
const { currentRate, remainingCapacity } = signer.getQueueStats();
```

## Database Operations

### Run Migrations

```bash
# Set database URL
export DATABASE_URL="postgresql://user:pass@localhost:5432/wallets"

# Run migrations
pnpm db:migrate

# Check migration status
pnpm db:migrate status
```

### Repository Usage

```typescript
import { createWalletRepository } from '@defi-mcp/wallet-manager';

const repository = createWalletRepository(db);

// Create wallet
const wallet = await repository.createWallet({
  address: 'ABC123...',
  encryptedKey: '...',
  tags: ['trading', 'bot'],
});

// Query wallets
const activeWallets = await repository.listWallets({
  isActive: true,
  minTrades: 10,
  limit: 100,
});

// Add/remove tags
await repository.addTag(walletId, 'high-volume');
await repository.removeTag(walletId, 'testing');

// Get wallets by tag
const tradingWallets = await repository.getWalletsByTag('trading');
```

## Security Best Practices

1. **Never log private keys** - All sensitive data is automatically scrubbed from logs
2. **Use strong passwords** - Minimum 12 characters with uppercase, lowercase, numbers, and special characters
3. **Rate limit signing** - Prevents abuse with configurable rate limits
4. **Audit all access** - Every key access, signing operation, and wallet modification is logged
5. **Encrypt at rest** - All private keys are encrypted with AES-256-GCM
6. **Clear memory** - Sensitive data is cleared from memory after use (best effort in JS)

## Environment Variables

```bash
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/wallets

# Solana
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com

# Optional: HSM configuration
HSM_ENABLED=false
HSM_PROVIDER=local
```

## API Reference

See [types.ts](./src/types.ts) for complete type definitions.

## License

MIT
