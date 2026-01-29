/**
 * Wallet Manager Types
 * Comprehensive type definitions for HD wallet management, secure key storage,
 * and fund distribution operations.
 */

import type { PublicKey, VersionedTransaction } from '@solana/web3.js';

// ============================================================================
// HD Wallet Types
// ============================================================================

/**
 * Mnemonic strength options (12 or 24 words)
 */
export type MnemonicStrength = 128 | 256;

/**
 * Master wallet containing the root HD wallet
 */
export interface MasterWallet {
  /** Unique identifier */
  id: string;
  /** Master public key (not used for signing, for identification only) */
  publicKey: string;
  /** Creation timestamp */
  createdAt: Date;
  /** Number of wallets derived from this master */
  derivedCount: number;
  /** Optional label for the wallet */
  label?: string;
}

/**
 * A wallet derived from a master wallet
 */
export interface DerivedWallet {
  /** Unique identifier */
  id: string;
  /** Derivation index in the HD tree */
  index: number;
  /** Base58-encoded public key */
  publicKey: string;
  /** Solana address (same as public key for Solana) */
  address: string;
  /** Full BIP44 derivation path */
  derivationPath: string;
  /** Reference to the master wallet */
  masterWalletId: string;
  /** Optional label */
  label?: string;
  /** Tags for categorization */
  tags?: string[];
}

/**
 * HD Wallet Factory interface
 */
export interface HDWalletFactory {
  generateMnemonic(strength?: MnemonicStrength): string;
  validateMnemonic(mnemonic: string): boolean;
  createMasterWallet(mnemonic: string, passphrase?: string): Promise<MasterWallet>;
  deriveWallet(master: MasterWallet, index: number): Promise<DerivedWallet>;
  deriveWalletBatch(master: MasterWallet, startIndex: number, count: number): Promise<DerivedWallet[]>;
  exportMnemonic(master: MasterWallet, password: string): Promise<string>;
  importMnemonic(encrypted: string, password: string): Promise<MasterWallet>;
}

// ============================================================================
// Key Vault Types
// ============================================================================

/**
 * Encryption algorithm configuration
 */
export interface EncryptionConfig {
  algorithm: 'aes-256-gcm';
  keyLength: number;
  saltLength: number;
  ivLength: number;
  tagLength: number;
  scryptN: number;
  scryptR: number;
  scryptP: number;
}

/**
 * Key storage entry
 */
export interface StoredKey {
  walletId: string;
  encryptedKey: string;
  createdAt: Date;
  lastAccessedAt: Date;
  accessCount: number;
}

/**
 * Key Vault interface for secure key storage
 */
export interface KeyVault {
  storeKey(walletId: string, privateKey: Uint8Array, password: string): Promise<void>;
  retrieveKey(walletId: string, password: string): Promise<Uint8Array>;
  rotateEncryption(walletId: string, oldPassword: string, newPassword: string): Promise<void>;
  deleteKey(walletId: string, password: string): Promise<void>;
  listWalletIds(): Promise<string[]>;
  exportVault(password: string): Promise<string>;
  importVault(encrypted: string, password: string): Promise<void>;
  hasKey(walletId: string): Promise<boolean>;
}

/**
 * HSM configuration for hardware security module support
 */
export interface HSMConfig {
  enabled: boolean;
  provider: 'aws-cloudhsm' | 'azure-keyvault' | 'hashicorp-vault' | 'local';
  endpoint?: string;
  credentials?: {
    keyId?: string;
    secretKey?: string;
  };
}

/**
 * HSM Adapter interface
 */
export interface HSMAdapter {
  initialize(): Promise<void>;
  encrypt(data: Uint8Array, keyId: string): Promise<Uint8Array>;
  decrypt(data: Uint8Array, keyId: string): Promise<Uint8Array>;
  generateKey(keyId: string): Promise<void>;
  deleteKey(keyId: string): Promise<void>;
  isAvailable(): boolean;
}

// ============================================================================
// Wallet Operations Types
// ============================================================================

/**
 * Token balance information
 */
export interface TokenBalance {
  /** Token mint address */
  mint: string;
  /** Token symbol */
  symbol: string;
  /** Token name */
  name: string;
  /** Raw balance in smallest units */
  amount: bigint;
  /** Token decimals */
  decimals: number;
  /** Human-readable balance */
  uiAmount: number;
  /** USD value if available */
  usdValue?: number;
  /** Token account address */
  tokenAccount: string;
}

/**
 * Complete wallet balance
 */
export interface WalletBalance {
  /** SOL balance in lamports */
  sol: bigint;
  /** SOL value in USD */
  solUsd: number;
  /** All token balances */
  tokens: TokenBalance[];
  /** Total portfolio value in USD */
  totalValueUsd: number;
  /** Last update timestamp */
  lastUpdated: Date;
}

/**
 * Token account information
 */
export interface TokenAccount {
  /** Token account address */
  address: string;
  /** Token mint */
  mint: string;
  /** Owner address */
  owner: string;
  /** Token amount */
  amount: bigint;
  /** Token decimals */
  decimals: number;
  /** Whether the account is a delegate */
  isDelegate: boolean;
  /** Rent-exempt reserve */
  rentExemptReserve: bigint;
}

/**
 * Transaction status
 */
export type TransactionStatus = 'pending' | 'confirmed' | 'finalized' | 'failed';

/**
 * Transaction result
 */
export interface TransactionResult {
  /** Transaction signature */
  signature: string;
  /** Transaction status */
  status: TransactionStatus;
  /** Block slot */
  slot?: number;
  /** Block time */
  blockTime?: number;
  /** Error message if failed */
  error?: string;
  /** Logs from the transaction */
  logs?: string[];
}

/**
 * Historical transaction
 */
export interface Transaction {
  /** Transaction signature */
  signature: string;
  /** Block slot */
  slot: number;
  /** Block time */
  blockTime: number;
  /** Transaction type */
  type: TransactionType;
  /** Fee paid */
  fee: bigint;
  /** Success status */
  success: boolean;
  /** Instructions in the transaction */
  instructions: TransactionInstructionInfo[];
  /** Token transfers in the transaction */
  tokenTransfers: TokenTransfer[];
  /** SOL transfers */
  solTransfers: SolTransfer[];
}

/**
 * Transaction types
 */
export type TransactionType =
  | 'transfer'
  | 'token_transfer'
  | 'swap'
  | 'stake'
  | 'unstake'
  | 'create_account'
  | 'close_account'
  | 'mint'
  | 'burn'
  | 'nft'
  | 'governance'
  | 'lending'
  | 'unknown';

/**
 * Instruction info for display
 */
export interface TransactionInstructionInfo {
  programId: string;
  data: string;
  accounts: string[];
}

/**
 * Token transfer details
 */
export interface TokenTransfer {
  mint: string;
  source: string;
  destination: string;
  amount: bigint;
  decimals: number;
}

/**
 * SOL transfer details
 */
export interface SolTransfer {
  source: string;
  destination: string;
  amount: bigint;
}

/**
 * Wallet Operations interface
 */
export interface WalletOperations {
  getBalance(walletId: string): Promise<WalletBalance>;
  getBalances(walletIds: string[]): Promise<Map<string, WalletBalance>>;
  getTokenBalance(walletId: string, tokenMint: string): Promise<TokenBalance>;
  getAllTokenBalances(walletId: string): Promise<TokenBalance[]>;
  getTransactionHistory(walletId: string, limit?: number): Promise<Transaction[]>;
  getTokenAccounts(walletId: string): Promise<TokenAccount[]>;
  closeEmptyTokenAccounts(walletId: string): Promise<TransactionResult>;
}

// ============================================================================
// Fund Distribution Types
// ============================================================================

/**
 * Distribution strategy
 */
export type DistributionStrategy = 'even' | 'random' | 'weighted';

/**
 * SOL distribution parameters
 */
export interface DistributeParams {
  /** Source wallet ID */
  sourceWalletId: string;
  /** Destination wallet IDs */
  destinationWalletIds: string[];
  /** Total amount in lamports */
  totalAmount: bigint;
  /** Distribution strategy */
  distribution: DistributionStrategy;
  /** Weights for weighted distribution (must sum to 1 or be normalized) */
  weights?: number[];
  /** Minimum amount per wallet */
  minPerWallet?: bigint;
  /** Maximum amount per wallet */
  maxPerWallet?: bigint;
}

/**
 * Token distribution parameters
 */
export interface TokenDistributeParams extends DistributeParams {
  /** Token mint address */
  tokenMint: string;
}

/**
 * Distribution result
 */
export interface DistributionResult {
  /** Transaction signatures */
  signatures: string[];
  /** Number of successful transfers */
  successCount: number;
  /** Number of failed transfers */
  failedCount: number;
  /** Total amount distributed */
  totalDistributed: bigint;
  /** Individual transfer results */
  transfers: TransferResult[];
  /** Total fees paid */
  totalFees: bigint;
}

/**
 * Individual transfer result
 */
export interface TransferResult {
  /** Destination wallet ID */
  destinationWalletId: string;
  /** Amount transferred */
  amount: bigint;
  /** Transaction signature */
  signature?: string;
  /** Success status */
  success: boolean;
  /** Error if failed */
  error?: string;
}

/**
 * Cost estimate for distribution
 */
export interface CostEstimate {
  /** Number of transactions needed */
  transactionCount: number;
  /** Estimated total fees in lamports */
  totalFees: bigint;
  /** Estimated compute units */
  computeUnits: number;
  /** Estimated time in seconds */
  estimatedTime: number;
}

/**
 * Fund Distributor interface
 */
export interface FundDistributor {
  distributeSol(params: DistributeParams): Promise<DistributionResult>;
  distributeToken(params: TokenDistributeParams): Promise<DistributionResult>;
  consolidateSol(walletIds: string[], destinationWallet: string): Promise<TransactionResult>;
  consolidateToken(
    walletIds: string[],
    tokenMint: string,
    destinationWallet: string
  ): Promise<TransactionResult>;
  estimateDistributionCost(walletCount: number): Promise<CostEstimate>;
}

// ============================================================================
// Transaction Signing Types
// ============================================================================

/**
 * Signing queue entry
 */
export interface SigningQueueEntry {
  id: string;
  walletId: string;
  transaction: VersionedTransaction;
  priority: number;
  createdAt: Date;
  status: 'pending' | 'signing' | 'completed' | 'failed';
  error?: string;
}

/**
 * Signing options
 */
export interface SigningOptions {
  /** Skip preflight checks */
  skipPreflight?: boolean;
  /** Maximum retries */
  maxRetries?: number;
  /** Confirmation commitment */
  commitment?: 'processed' | 'confirmed' | 'finalized';
}

/**
 * Transaction Signer interface
 */
export interface TransactionSigner {
  signTransaction(
    walletId: string,
    transaction: VersionedTransaction,
    password: string
  ): Promise<VersionedTransaction>;
  signAllTransactions(
    walletId: string,
    transactions: VersionedTransaction[],
    password: string
  ): Promise<VersionedTransaction[]>;
  signMessage(walletId: string, message: Uint8Array, password: string): Promise<Uint8Array>;
  getPublicKey(walletId: string): Promise<PublicKey>;
}

// ============================================================================
// Database Types
// ============================================================================

/**
 * Wallet entity for database storage
 */
export interface Wallet {
  id: string;
  address: string;
  derivationIndex: number | null;
  masterWalletId: string | null;
  encryptedKey: string;
  label: string | null;
  tags: string[];
  createdAt: Date;
  lastUsedAt: Date | null;
  totalTrades: number;
  totalVolumeSol: bigint;
  isActive: boolean;
}

/**
 * Master wallet entity for database storage
 */
export interface MasterWalletEntity {
  id: string;
  encryptedMnemonic: string;
  derivedCount: number;
  label: string | null;
  createdAt: Date;
}

/**
 * Wallet creation input
 */
export interface CreateWalletInput {
  address: string;
  derivationIndex?: number;
  masterWalletId?: string;
  encryptedKey: string;
  label?: string;
  tags?: string[];
}

/**
 * Wallet update input
 */
export interface UpdateWalletInput {
  label?: string;
  tags?: string[];
  lastUsedAt?: Date;
  totalTrades?: number;
  totalVolumeSol?: bigint;
  isActive?: boolean;
}

/**
 * Wallet filter for queries
 */
export interface WalletFilter {
  masterWalletId?: string;
  tags?: string[];
  isActive?: boolean;
  minTrades?: number;
  minVolume?: bigint;
  createdAfter?: Date;
  createdBefore?: Date;
  limit?: number;
  offset?: number;
}

/**
 * Wallet Repository interface
 */
export interface WalletRepository {
  createWallet(wallet: CreateWalletInput): Promise<Wallet>;
  getWallet(walletId: string): Promise<Wallet | null>;
  getWalletByAddress(address: string): Promise<Wallet | null>;
  listWallets(filter?: WalletFilter): Promise<Wallet[]>;
  updateWallet(walletId: string, update: UpdateWalletInput): Promise<Wallet>;
  deleteWallet(walletId: string): Promise<void>;
  addTag(walletId: string, tag: string): Promise<void>;
  removeTag(walletId: string, tag: string): Promise<void>;
  getWalletsByTag(tag: string): Promise<Wallet[]>;
  getWalletCount(filter?: WalletFilter): Promise<number>;
  
  // Master wallet operations
  createMasterWallet(encryptedMnemonic: string, label?: string): Promise<MasterWalletEntity>;
  getMasterWallet(id: string): Promise<MasterWalletEntity | null>;
  updateMasterWalletDerivedCount(id: string, count: number): Promise<void>;
  listMasterWallets(): Promise<MasterWalletEntity[]>;
  deleteMasterWallet(id: string): Promise<void>;
}

// ============================================================================
// Audit Log Types
// ============================================================================

/**
 * Audit action types
 */
export type AuditAction =
  | 'key_access'
  | 'key_store'
  | 'key_delete'
  | 'key_rotate'
  | 'wallet_create'
  | 'wallet_delete'
  | 'sign_transaction'
  | 'sign_message'
  | 'distribute_funds'
  | 'consolidate_funds'
  | 'export_vault'
  | 'import_vault';

/**
 * Audit log entry
 */
export interface AuditLogEntry {
  id: string;
  timestamp: Date;
  action: AuditAction;
  walletId?: string;
  success: boolean;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
  error?: string;
}

/**
 * Audit Logger interface
 */
export interface AuditLogger {
  log(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): Promise<void>;
  getEntries(walletId: string, limit?: number): Promise<AuditLogEntry[]>;
  getRecentEntries(limit?: number): Promise<AuditLogEntry[]>;
  getEntriesByAction(action: AuditAction, limit?: number): Promise<AuditLogEntry[]>;
}

// ============================================================================
// Configuration Types
// ============================================================================

/**
 * Database configuration
 */
export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  ssl?: boolean;
  poolSize?: number;
}

/**
 * Solana configuration
 */
export interface SolanaConfig {
  rpcUrl: string;
  wsUrl?: string;
  commitment?: 'processed' | 'confirmed' | 'finalized';
}

/**
 * Rate limit configuration
 */
export interface RateLimitConfig {
  signingRatePerMinute: number;
  balanceQueryRatePerMinute: number;
  transactionRatePerMinute: number;
}

/**
 * Wallet Manager configuration
 */
export interface WalletManagerConfig {
  database: DatabaseConfig;
  solana: SolanaConfig;
  hsm?: HSMConfig;
  rateLimits?: RateLimitConfig;
  passwordMinLength?: number;
  auditLogRetentionDays?: number;
}

// ============================================================================
// Error Types
// ============================================================================

/**
 * Wallet manager error codes
 */
export enum WalletErrorCode {
  // Key/Vault errors
  KEY_NOT_FOUND = 'KEY_NOT_FOUND',
  INVALID_PASSWORD = 'INVALID_PASSWORD',
  PASSWORD_TOO_WEAK = 'PASSWORD_TOO_WEAK',
  ENCRYPTION_FAILED = 'ENCRYPTION_FAILED',
  DECRYPTION_FAILED = 'DECRYPTION_FAILED',
  
  // Wallet errors
  WALLET_NOT_FOUND = 'WALLET_NOT_FOUND',
  WALLET_ALREADY_EXISTS = 'WALLET_ALREADY_EXISTS',
  INVALID_MNEMONIC = 'INVALID_MNEMONIC',
  DERIVATION_FAILED = 'DERIVATION_FAILED',
  
  // Transaction errors
  SIGNING_FAILED = 'SIGNING_FAILED',
  TRANSACTION_FAILED = 'TRANSACTION_FAILED',
  INSUFFICIENT_FUNDS = 'INSUFFICIENT_FUNDS',
  
  // Distribution errors
  DISTRIBUTION_FAILED = 'DISTRIBUTION_FAILED',
  CONSOLIDATION_FAILED = 'CONSOLIDATION_FAILED',
  
  // Rate limit errors
  RATE_LIMITED = 'RATE_LIMITED',
  
  // Database errors
  DATABASE_ERROR = 'DATABASE_ERROR',
  
  // HSM errors
  HSM_UNAVAILABLE = 'HSM_UNAVAILABLE',
  HSM_ERROR = 'HSM_ERROR',
}

/**
 * Base wallet manager error
 */
export class WalletManagerError extends Error {
  constructor(
    public code: WalletErrorCode,
    message: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'WalletManagerError';
    // Never include sensitive data in error messages
    if (details) {
      delete details.password;
      delete details.privateKey;
      delete details.mnemonic;
    }
  }
}
