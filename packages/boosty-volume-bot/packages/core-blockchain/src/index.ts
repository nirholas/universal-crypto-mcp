// Core Blockchain Package - Production DeFi Infrastructure
// Real blockchain interactions only - no mocks

// Solana exports
export {
  SolanaClient,
  SolanaConnectionManager,
  type SolanaClientConfig,
  type SolanaConnectionConfig,
} from './solana/client.js';

export {
  SolanaTransactionBuilder,
  type TransactionInstruction,
  type TransactionOptions,
} from './solana/transaction-builder.js';

export {
  SolanaTokenService,
  type TokenCreateParams,
  type TokenMintParams,
  type TokenTransferParams,
} from './solana/token-service.js';

// EVM exports
export {
  EVMClient,
  EVMConnectionManager,
  type EVMClientConfig,
  type EVMChainConfig,
} from './evm/client.js';

export {
  EVMTransactionBuilder,
  type EVMTransactionOptions,
} from './evm/transaction-builder.js';

export {
  EVMTokenService,
  type ERC20DeployParams,
  type ERC20TransferParams,
} from './evm/token-service.js';

// Shared types
export {
  type BlockchainNetwork,
  type TransactionResult,
  type TransactionStatus,
  type GasEstimate,
  type AccountInfo,
  type TokenBalance,
  type SignedTransaction,
} from './types.js';

// Utilities
export {
  encryptPrivateKey,
  decryptPrivateKey,
  generateMnemonic,
  mnemonicToSeed,
  validateAddress,
  formatUnits,
  parseUnits,
} from './utils/crypto.js';

// Constants
export {
  SOLANA_NETWORKS,
  EVM_NETWORKS,
  DEFAULT_COMMITMENT,
  MAX_RETRIES,
  RETRY_DELAY_MS,
} from './constants.js';

// Logger
export { createLogger, type Logger } from './utils/logger.js';
