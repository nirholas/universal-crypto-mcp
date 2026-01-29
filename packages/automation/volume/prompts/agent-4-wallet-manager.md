# Agent 4: Wallet Manager & Security

You are Claude Opus 4.5 building secure wallet management for a DeFi MCP server. Create `/packages/wallet-manager/`.

## Context
- HD wallet derivation (BIP39/BIP44)
- AES-256-GCM encryption
- PostgreSQL for metadata storage
- Support 10,000+ wallets

## Build These Components

### 1. HD Wallet Factory (`src/hd-wallet/`)
```typescript
interface HDWalletFactory {
  generateMnemonic(strength?: 128 | 256): string;
  validateMnemonic(mnemonic: string): boolean;
  createMaster(mnemonic: string, passphrase?: string): Promise<MasterWallet>;
  deriveWallet(master: MasterWallet, index: number): DerivedWallet;
  deriveBatch(master: MasterWallet, start: number, count: number): DerivedWallet[];
}
```
- BIP44 path: `m/44'/501'/{index}'/0'`
- Batch generation up to 10,000 wallets

### 2. Key Vault (`src/vault/`)
```typescript
interface KeyVault {
  store(walletId: string, privateKey: Uint8Array, password: string): Promise<void>;
  retrieve(walletId: string, password: string): Promise<Uint8Array>;
  rotate(walletId: string, oldPw: string, newPw: string): Promise<void>;
  delete(walletId: string, password: string): Promise<void>;
  exportVault(password: string): Promise<string>;
  importVault(encrypted: string, password: string): Promise<void>;
}
```
- AES-256-GCM encryption
- Scrypt key derivation (N=16384, r=8, p=1)
- Never expose keys in logs

### 3. Wallet Operations (`src/operations/`)
```typescript
interface WalletOperations {
  getBalance(walletId: string): Promise<WalletBalance>;
  getBalances(walletIds: string[]): Promise<Map<string, WalletBalance>>;
  getAllTokens(walletId: string): Promise<TokenBalance[]>;
  getHistory(walletId: string, limit?: number): Promise<Transaction[]>;
  closeEmptyAccounts(walletId: string): Promise<TransactionResult>;
}
```

### 4. Fund Distributor (`src/distribution/`)
```typescript
interface FundDistributor {
  distributeSol(params: DistributeParams): Promise<DistributionResult>;
  distributeToken(params: TokenDistributeParams): Promise<DistributionResult>;
  consolidateSol(walletIds: string[], destination: string): Promise<TransactionResult>;
  consolidateToken(walletIds: string[], mint: string, dest: string): Promise<TransactionResult>;
  estimateCost(walletCount: number): Promise<CostEstimate>;
}

interface DistributeParams {
  sourceWalletId: string;
  destinationWalletIds: string[];
  totalAmount: bigint;
  distribution: 'even' | 'random' | 'weighted';
  weights?: number[];
}
```

### 5. Transaction Signer (`src/signing/`)
```typescript
interface TransactionSigner {
  sign(walletId: string, tx: VersionedTransaction, password: string): Promise<VersionedTransaction>;
  signAll(walletId: string, txs: VersionedTransaction[], password: string): Promise<VersionedTransaction[]>;
  signMessage(walletId: string, message: Uint8Array, password: string): Promise<Uint8Array>;
  getPublicKey(walletId: string): Promise<PublicKey>;
}
```

### 6. Database Repository (`src/database/`)
```typescript
interface WalletRepository {
  create(wallet: CreateWalletInput): Promise<Wallet>;
  get(walletId: string): Promise<Wallet | null>;
  getByAddress(address: string): Promise<Wallet | null>;
  list(filter?: WalletFilter): Promise<Wallet[]>;
  update(walletId: string, update: Partial<Wallet>): Promise<Wallet>;
  delete(walletId: string): Promise<void>;
  addTag(walletId: string, tag: string): Promise<void>;
  getByTag(tag: string): Promise<Wallet[]>;
}
```

## Database Schema
```sql
CREATE TABLE master_wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  encrypted_mnemonic TEXT NOT NULL,
  derived_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  address VARCHAR(44) UNIQUE NOT NULL,
  derivation_index INTEGER NOT NULL,
  master_wallet_id UUID REFERENCES master_wallets(id),
  encrypted_private_key TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_used_at TIMESTAMPTZ,
  total_trades INTEGER DEFAULT 0,
  total_volume_lamports BIGINT DEFAULT 0
);

CREATE INDEX idx_wallets_address ON wallets(address);
CREATE INDEX idx_wallets_tags ON wallets USING GIN(tags);
```

## Dependencies
```json
{
  "bip39": "^3.1.0",
  "ed25519-hd-key": "^1.3.0",
  "tweetnacl": "^1.0.3",
  "pg": "^8.11.0",
  "drizzle-orm": "^0.30.0"
}
```

## Security Requirements
1. NEVER log private keys or mnemonics
2. Minimum password: 12 characters
3. Rate limit signing: 100/min per wallet
4. Audit log all wallet access
5. Memory-safe: zero out keys after use

## Environment Variables
```
DATABASE_URL=postgresql://user:pass@localhost:5432/defi
MASTER_PASSWORD=<32+ char secure password>
ENCRYPTION_KEY=<from env, not hardcoded>
```

START BUILDING NOW - Complete code only.
