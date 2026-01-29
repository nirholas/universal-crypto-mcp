/**
 * Solana Core Types
 * Production type definitions for Solana infrastructure
 */

import {
  Connection,
  PublicKey,
  Keypair,
  TransactionInstruction,
  VersionedTransaction,
  AddressLookupTableAccount,
  AccountInfo,
  Commitment,
  SignatureStatus,
  TransactionConfirmationStatus,
  GetProgramAccountsFilter,
  SimulatedTransactionResponse,
} from '@solana/web3.js';

// ============================================================================
// Network Configuration
// ============================================================================

export type SolanaCluster = 'mainnet-beta' | 'devnet' | 'testnet';

export interface RpcEndpoint {
  url: string;
  name: string;
  weight: number; // Higher = preferred
  rateLimit: number; // Requests per second
  wsUrl?: string;
  apiKey?: string;
  features: RpcFeatures;
}

export interface RpcFeatures {
  getPriorityFeeEstimate: boolean;
  enhancedTransactions: boolean;
  dasApi: boolean; // Digital Asset Standard
  webhooks: boolean;
}

export interface RpcHealth {
  endpoint: string;
  healthy: boolean;
  latencyMs: number;
  lastChecked: Date;
  currentSlot: number;
  errors: number;
}

// ============================================================================
// Connection Manager
// ============================================================================

export interface ConnectionManagerConfig {
  cluster: SolanaCluster;
  commitment: Commitment;
  endpoints: RpcEndpoint[];
  healthCheckIntervalMs: number;
  maxRetries: number;
  timeoutMs: number;
  enableLogging: boolean;
}

export interface SolanaConnectionManager {
  getConnection(): Connection;
  getHealthyEndpoint(): Promise<RpcEndpoint>;
  getAllEndpointHealth(): Promise<RpcHealth[]>;
  subscribeToAccount(
    pubkey: PublicKey,
    callback: (accountInfo: AccountInfo<Buffer>, slot: number) => void
  ): number;
  subscribeToProgramAccounts(
    programId: PublicKey,
    filters: GetProgramAccountsFilter[],
    callback: (keyedAccountInfo: { pubkey: PublicKey; accountInfo: AccountInfo<Buffer> }) => void
  ): number;
  subscribeToSlot(callback: (slot: number) => void): number;
  subscribeToSignature(
    signature: string,
    callback: (result: SignatureStatus | null, context: { slot: number }) => void
  ): number;
  estimatePriorityFee(accounts: PublicKey[], percentile?: number): Promise<number>;
  unsubscribe(subscriptionId: number): Promise<void>;
  close(): Promise<void>;
}

// ============================================================================
// Transaction Builder
// ============================================================================

export interface TransactionBuilderConfig {
  connection: Connection;
  payer: PublicKey;
  recentBlockhash?: string;
  computeUnitLimit?: number;
  computeUnitPrice?: number;
  addressLookupTables?: AddressLookupTableAccount[];
}

export interface SimulationResult {
  success: boolean;
  unitsConsumed: number;
  logs: string[];
  error?: string;
  accounts?: SimulatedTransactionResponse['accounts'];
}

export interface TransactionResult {
  signature: string;
  slot: number;
  confirmationStatus: TransactionConfirmationStatus;
  error?: string;
  logs?: string[];
  fee: number;
  computeUnitsUsed?: number;
}

export interface SendOptions {
  skipPreflight?: boolean;
  preflightCommitment?: Commitment;
  maxRetries?: number;
  minContextSlot?: number;
}

export interface JitoSendOptions {
  tipLamports: number;
  tipAccount?: PublicKey;
  bundleOnly?: boolean;
}

export interface TransactionBuilder {
  addInstruction(ix: TransactionInstruction): TransactionBuilder;
  addInstructions(ixs: TransactionInstruction[]): TransactionBuilder;
  setComputeUnits(units: number): TransactionBuilder;
  setPriorityFee(microLamports: number): TransactionBuilder;
  setFeePayer(payer: PublicKey): TransactionBuilder;
  useAddressLookupTable(alt: AddressLookupTableAccount): TransactionBuilder;
  useAddressLookupTables(alts: AddressLookupTableAccount[]): TransactionBuilder;
  simulate(): Promise<SimulationResult>;
  build(): Promise<VersionedTransaction>;
  buildAndSign(signers: Keypair[]): Promise<VersionedTransaction>;
  buildLegacy(): Promise<import('@solana/web3.js').Transaction>;
  estimateComputeUnits(): Promise<number>;
  getSerializedSize(): Promise<number>;
}

export interface TransactionSender {
  send(transaction: VersionedTransaction, options?: SendOptions): Promise<string>;
  sendAndConfirm(
    transaction: VersionedTransaction,
    options?: SendOptions & { commitment?: Commitment }
  ): Promise<TransactionResult>;
  sendViaJito(
    transaction: VersionedTransaction,
    options: JitoSendOptions
  ): Promise<TransactionResult>;
  sendBundle(
    transactions: VersionedTransaction[],
    options: JitoSendOptions
  ): Promise<TransactionResult[]>;
  confirmTransaction(
    signature: string,
    commitment?: Commitment
  ): Promise<TransactionResult>;
}

// ============================================================================
// Token Types
// ============================================================================

export interface TokenAccountInfo {
  address: PublicKey;
  mint: PublicKey;
  owner: PublicKey;
  amount: bigint;
  decimals: number;
  isNative: boolean;
  delegatedAmount?: bigint;
  delegate?: PublicKey;
  closeAuthority?: PublicKey;
  state: 'initialized' | 'frozen' | 'uninitialized';
}

export interface TokenMintInfo {
  address: PublicKey;
  supply: bigint;
  decimals: number;
  mintAuthority: PublicKey | null;
  freezeAuthority: PublicKey | null;
  isInitialized: boolean;
}

export interface TokenMetadata {
  mint: PublicKey;
  name: string;
  symbol: string;
  uri: string;
  decimals: number;
  image?: string;
  description?: string;
  attributes?: Array<{ trait_type: string; value: string }>;
}

export interface Token2022Extensions {
  transferFeeConfig?: {
    transferFeeBasisPoints: number;
    maximumFee: bigint;
    withheldAmount: bigint;
  };
  interestBearingConfig?: {
    currentRate: number;
    lastUpdateTimestamp: number;
  };
  permanentDelegate?: PublicKey;
  nonTransferable?: boolean;
  confidentialTransfers?: boolean;
}

export interface CreateTokenParams {
  decimals: number;
  mintAuthority: PublicKey;
  freezeAuthority?: PublicKey | null;
  initialSupply?: bigint;
  tokenStandard?: 'spl' | 'token2022';
  extensions?: Token2022Extensions;
}

export interface TransferTokenParams {
  mint: PublicKey;
  source: PublicKey;
  destination: PublicKey;
  amount: bigint;
  decimals: number;
  owner: PublicKey;
  memo?: string;
}

// ============================================================================
// Oracle Types
// ============================================================================

export interface PriceData {
  symbol: string;
  price: number;
  confidence: number;
  publishTime: Date;
  source: 'pyth' | 'switchboard';
  feedAddress: PublicKey;
  status: 'trading' | 'halted' | 'unknown';
  ema?: number;
}

export interface PriceFeed {
  feedAddress: PublicKey;
  productAddress?: PublicKey;
  symbol: string;
  assetType: string;
  base: string;
  quote: string;
}

export interface OracleSubscription {
  feedAddress: PublicKey;
  callback: (price: PriceData) => void;
  unsubscribe: () => void;
}

// ============================================================================
// DEX / Pool Types
// ============================================================================

export interface PoolInfo {
  address: PublicKey;
  protocol: 'raydium' | 'orca' | 'meteora' | 'lifinity' | 'phoenix';
  tokenA: {
    mint: PublicKey;
    vault: PublicKey;
    reserve: bigint;
    decimals: number;
  };
  tokenB: {
    mint: PublicKey;
    vault: PublicKey;
    reserve: bigint;
    decimals: number;
  };
  lpMint: PublicKey;
  lpSupply: bigint;
  feeRate: number;
  tvl?: number;
  volume24h?: number;
  apy?: number;
}

export interface SwapQuote {
  inputMint: PublicKey;
  outputMint: PublicKey;
  inputAmount: bigint;
  outputAmount: bigint;
  minOutputAmount: bigint;
  priceImpact: number;
  fee: bigint;
  route: SwapRoute[];
}

export interface SwapRoute {
  pool: PublicKey;
  protocol: string;
  inputMint: PublicKey;
  outputMint: PublicKey;
  percentage: number;
}

// ============================================================================
// Utility Types
// ============================================================================

export interface AccountRentInfo {
  dataSize: number;
  lamports: number;
  exemptionThreshold: number;
}

export interface RecentBlockhash {
  blockhash: string;
  lastValidBlockHeight: number;
  slot: number;
  fetchedAt: Date;
}

export type TransactionStatus = 
  | 'pending'
  | 'processing'
  | 'confirmed'
  | 'finalized'
  | 'failed'
  | 'expired';

export interface TransactionTracker {
  signature: string;
  status: TransactionStatus;
  slot?: number;
  confirmations: number;
  error?: string;
  startTime: Date;
  endTime?: Date;
}
