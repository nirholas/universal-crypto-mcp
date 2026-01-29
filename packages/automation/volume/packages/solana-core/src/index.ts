/**
 * Solana Core - Main Entry Point
 * Production-ready Solana infrastructure for DeFi MCP Server
 */

// Types
export * from './types.js';

// Connection Management
export {
  ConnectionManager,
  createConnectionManager,
  HealthChecker,
  WebSocketManager,
  RpcPool,
} from './connection/index.js';

// Transaction Building & Sending
export {
  TransactionBuilder,
  createTransactionBuilder,
  TransactionSender,
  createTransactionSender,
  JitoBundleSender,
  createJitoBundleSender,
  loadAddressLookupTable,
  loadAddressLookupTables,
  estimateComputeUnits,
  createComputeBudgetInstructions,
  calculateTransactionFee,
  getPriorityFeeTiers,
} from './transactions/index.js';

// Token Operations
export {
  // SPL Token
  getTokenAccount,
  getTokenMint,
  getTokenAccountsByOwner,
  getATA,
  createInitializeMintInstructions,
  createATAInstruction,
  createMintInstruction,
  createTokenTransferInstruction,
  createBurnTokenInstruction,
  createCloseTokenAccountInstruction,
  createApproveTokenInstruction,
  createRevokeTokenInstruction,
  createSetMintAuthorityInstruction,
  ataExists,
  getOrCreateATAInstructions,
  toTokenAmount,
  fromTokenAmount,
  // Token-2022
  getToken2022Mint,
  getToken2022AccountsByOwner,
  calculateToken2022MintSize,
  createToken2022MintInstructions,
  createTransferWithFeeInstruction,
  getToken2022ATA,
  createToken2022ATAInstruction,
  isToken2022Mint,
  getTokenProgramForMint,
  // ATA Management
  getAssociatedTokenAccount,
  checkATAExists,
  getOrCreateATA,
  getATAsForMints,
  determineTokenProgram,
  getAllATAs,
  // Metadata
  getMetadataPDA,
  getMasterEditionPDA,
  getTokenMetadata,
  getMultipleTokenMetadata,
  hasMetadata,
  getTokenMetadataWithFallback,
} from './tokens/index.js';

// Oracle Integration
export {
  PythOracle,
  createPythOracle,
  SwitchboardOracle,
  createSwitchboardOracle,
} from './oracles/index.js';

// DEX Integration (Jupiter)
export {
  JupiterClient,
  createJupiterClient,
  TOKEN_MINTS,
  type SwapQuote,
  type RoutePlan,
  type TokenPrice,
  type SwapParams,
} from './dex/index.js';

// DEX Pool Monitoring (Raydium, Orca, Meteora)
export {
  PoolMonitor,
  createPoolMonitor,
  DEX_PROGRAMS,
  decodeRaydiumAmmPool,
  decodeOrcaWhirlpool,
  decodeMeteoraPool,
  type BasePoolState,
  type RaydiumAmmPool,
  type OrcaWhirlpool,
  type MeteoraPool,
  type PoolState,
} from './dex/index.js';

// Utilities
export {
  logger,
  logRpc,
  logTransaction,
  logSubscription,
} from './utils/logger.js';

export {
  sleep,
  isValidPublicKey,
  shortenAddress,
  lamportsToSol,
  solToLamports,
  formatTokenAmount,
  parseTokenAmount,
  chunkArray,
  retryWithBackoff,
  nowMs,
  msSince,
  ACCOUNT_SIZES,
  estimateRentExemption,
  estimateTokenAccountRent,
  estimateMintRent,
  RateLimiter,
  batchProcess,
  debounce,
  throttle,
} from './utils/helpers.js';

// Re-export commonly used Solana types
export {
  Connection,
  PublicKey,
  Keypair,
  Transaction,
  VersionedTransaction,
  TransactionInstruction,
  TransactionMessage,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js';

export {
  TOKEN_PROGRAM_ID,
  TOKEN_2022_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
