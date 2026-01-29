/**
 * Wallet Manager - Main Entry Point
 *
 * Comprehensive wallet management system for Solana including:
 * - HD Wallet derivation (BIP39/BIP44)
 * - Secure key storage (AES-256-GCM)
 * - Wallet operations (balance, history, tokens)
 * - Fund distribution and consolidation
 * - Transaction signing with rate limiting
 * - Database persistence
 *
 * @packageDocumentation
 */

// =============================================================================
// Types
// =============================================================================

export type {
  // HD Wallet types
  MnemonicStrength,
  MasterWallet,
  DerivedWallet,
  HDWalletFactory,
  
  // Key Vault types
  EncryptionConfig,
  StoredKey,
  KeyVault,
  HSMConfig,
  HSMAdapter,
  
  // Wallet operations types
  TokenBalance,
  WalletBalance,
  TokenAccount,
  TransactionStatus,
  TransactionResult,
  Transaction,
  TransactionType,
  TransactionInstructionInfo,
  TokenTransfer,
  SolTransfer,
  WalletOperations,
  
  // Distribution types
  DistributionStrategy,
  DistributeParams,
  TokenDistributeParams,
  DistributionResult,
  TransferResult,
  CostEstimate,
  FundDistributor,
  
  // Signing types
  SigningQueueEntry,
  SigningOptions,
  TransactionSigner,
  
  // Database types
  Wallet,
  MasterWalletEntity,
  CreateWalletInput,
  UpdateWalletInput,
  WalletFilter,
  WalletRepository,
  
  // Audit types
  AuditAction,
  AuditLogEntry,
  AuditLogger,
  
  // Configuration types
  DatabaseConfig,
  SolanaConfig,
  RateLimitConfig,
  WalletManagerConfig,
} from './types.js';

export {
  WalletErrorCode,
  WalletManagerError,
} from './types.js';

// =============================================================================
// HD Wallet Module
// =============================================================================

export {
  // Mnemonic utilities
  generateMnemonic,
  validateMnemonic,
  mnemonicToSeed,
  mnemonicToEntropy,
  entropyToMnemonic,
  getWordCount,
  normalizeMnemonic,
  
  // Derivation utilities
  SOLANA_COIN_TYPE,
  SOLANA_DERIVATION_PATH_TEMPLATE,
  buildDerivationPath,
  deriveKeypair,
  deriveKeypairBatch,
  getPublicKeyFromSecretKey,
  validateSolanaAddress,
  createDerivedWallet,
  
  // Factory
  hdWalletFactory,
  HDWalletFactoryImpl,
} from './hd-wallet/index.js';

// =============================================================================
// Vault Module
// =============================================================================

export {
  // Encryption utilities
  DEFAULT_ENCRYPTION_CONFIG,
  MIN_PASSWORD_LENGTH,
  validatePassword,
  deriveKey,
  encryptData,
  decryptData,
  generateRandomKey,
  secureCompare,
  clearSensitiveData,
  
  // Key Vault
  keyVault,
  KeyVaultImpl,
  
  // HSM Adapters
  LocalHSMAdapter,
  AWSCloudHSMAdapter,
  AzureKeyVaultAdapter,
  HashiCorpVaultAdapter,
  createHSMAdapter,
} from './vault/index.js';

// =============================================================================
// Operations Module
// =============================================================================

export {
  // Balance operations
  getWalletBalance,
  getWalletBalances,
  getAllTokenBalances,
  getTokenBalance,
  setTokenMetadata,
  clearTokenMetadataCache,
  
  // History operations
  getTransactionHistory,
  getLatestSignature,
  waitForConfirmation,
  
  // Token account operations
  getTokenAccounts,
  getEmptyTokenAccounts,
  getAssociatedTokenAccountAddress,
  tokenAccountExists,
  createTokenAccountInstruction,
  createCloseTokenAccountInstruction,
  buildCloseEmptyAccountsTransaction,
  estimateRentRecovery,
  getTokenAccountForMint,
} from './operations/index.js';

// =============================================================================
// Distribution Module
// =============================================================================

export {
  // Batch transfer utilities
  MAX_INSTRUCTIONS_PER_TX,
  COMPUTE_UNITS_PER_TRANSFER,
  COMPUTE_UNITS_PER_TOKEN_TRANSFER,
  buildBatchSolTransfers,
  buildBatchTokenTransfers,
  calculateDistribution,
  estimateBatchTransferFees,
  
  // Fund Distributor
  FundDistributorImpl,
  createFundDistributor,
  
  // Consolidation
  consolidateSolSequential,
  consolidateTokenSequential,
  estimateConsolidation,
  type ConsolidationResult,
  type ConsolidationWalletResult,
} from './distribution/index.js';

// =============================================================================
// Signing Module
// =============================================================================

export {
  // Signing Queue
  SigningQueue,
  createSigningQueue,
  
  // Transaction Signer
  TransactionSignerImpl,
  createTransactionSigner,
} from './signing/index.js';

// =============================================================================
// Database Module
// =============================================================================

export {
  // Entities
  masterWallets,
  wallets,
  auditLogs,
  walletGroups,
  walletGroupMembers,
  
  // Repository
  WalletRepositoryImpl,
  createWalletRepository,
  
  // Migrations
  runMigrations,
  rollbackLastMigration,
  checkMigrationStatus,
} from './database/index.js';

// =============================================================================
// Convenience Factory Functions
// =============================================================================

import { Connection } from '@solana/web3.js';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import type { WalletManagerConfig } from './types.js';
import { HDWalletFactoryImpl } from './hd-wallet/index.js';
import { KeyVaultImpl } from './vault/index.js';
import { createTransactionSigner } from './signing/index.js';
import { createFundDistributor } from './distribution/index.js';
import { createWalletRepository } from './database/index.js';

/**
 * Wallet Manager instance with all components
 */
export interface WalletManagerInstance {
  hdWallet: HDWalletFactoryImpl;
  keyVault: KeyVaultImpl;
  signer: ReturnType<typeof createTransactionSigner>;
  repository: ReturnType<typeof createWalletRepository>;
  connection: Connection;
  createDistributor: (password: string) => ReturnType<typeof createFundDistributor>;
}

/**
 * Create a fully configured wallet manager instance
 */
export function createWalletManager(config: WalletManagerConfig): WalletManagerInstance {
  // Create Solana connection
  const connection = new Connection(config.solana.rpcUrl, {
    commitment: config.solana.commitment || 'confirmed',
    wsEndpoint: config.solana.wsUrl,
  });

  // Create database connection
  const client = postgres({
    host: config.database.host,
    port: config.database.port,
    database: config.database.database,
    username: config.database.user,
    password: config.database.password,
    ssl: config.database.ssl,
    max: config.database.poolSize || 10,
  });
  const db = drizzle(client);

  // Create HD wallet factory
  const hdWallet = new HDWalletFactoryImpl();

  // Create key vault with audit logging
  const repository = createWalletRepository(db);
  const keyVault = new KeyVaultImpl({
    auditLog: async (action, walletId, success, error) => {
      if ('logAudit' in repository) {
        await (repository as any).logAudit(action, walletId, success, {}, error);
      }
    },
  });

  // Create transaction signer
  const signer = createTransactionSigner({
    keyVault,
    rateLimitPerMinute: config.rateLimits?.signingRatePerMinute || 60,
    auditLog: async (action, walletId, success, error) => {
      if ('logAudit' in repository) {
        await (repository as any).logAudit(action, walletId, success, {}, error);
      }
    },
  });

  // Factory function for creating distributors (requires password)
  const createDistributor = (password: string) => {
    return createFundDistributor({
      connection,
      signTransaction: async (walletId, tx, pwd) => {
        return signer.signTransaction(walletId, tx, pwd);
      },
      getAddress: async (walletId) => {
        const publicKey = await signer.getPublicKey(walletId);
        return publicKey.toString();
      },
      password,
    });
  };

  return {
    hdWallet,
    keyVault,
    signer,
    repository,
    connection,
    createDistributor,
  };
}
