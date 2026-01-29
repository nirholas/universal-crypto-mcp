// Shared blockchain types - used by all packages
import { PublicKey } from '@solana/web3.js';

// ===========================================
// NETWORK TYPES
// ===========================================

export type SolanaNetwork = 'mainnet-beta' | 'devnet' | 'testnet' | 'localnet';
export type EVMNetwork = 'ethereum' | 'polygon' | 'arbitrum' | 'optimism' | 'base' | 'bsc' | 'avalanche';

// ===========================================
// TRANSACTION TYPES
// ===========================================

export type TransactionStatus = 
  | 'pending' 
  | 'submitted' 
  | 'confirmed' 
  | 'finalized' 
  | 'failed' 
  | 'timeout';

export interface TransactionResult {
  signature: string;
  status: TransactionStatus;
  slot?: number;
  blockTime?: number;
  fee?: bigint;
  error?: string;
  logs?: string[];
  confirmations?: number;
}

export interface TransactionOptions {
  skipPreflight?: boolean;
  maxRetries?: number;
  commitment?: 'processed' | 'confirmed' | 'finalized';
  timeout?: number;
}

// ===========================================
// ACCOUNT TYPES
// ===========================================

export interface AccountBalance {
  address: string;
  lamports: bigint;
  sol: number;
}

export interface TokenAccountInfo {
  address: string;
  mint: string;
  owner: string;
  amount: bigint;
  decimals: number;
  uiAmount: number;
}

export interface WalletBalance {
  address: string;
  sol: bigint;
  solUsd: number;
  tokens: TokenAccountInfo[];
  totalValueUsd: number;
  lastUpdated: Date;
}

// ===========================================
// TOKEN TYPES
// ===========================================

export interface TokenInfo {
  mint: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
  coingeckoId?: string;
  tags?: string[];
}

export interface TokenMetadata {
  name: string;
  symbol: string;
  uri: string;
  sellerFeeBasisPoints: number;
  creators?: Array<{
    address: string;
    verified: boolean;
    share: number;
  }>;
}

// ===========================================
// POOL TYPES
// ===========================================

export type DEXType = 'raydium' | 'orca' | 'meteora' | 'pumpfun' | 'jupiter';

export interface PoolInfo {
  id: string;
  dex: DEXType;
  tokenA: TokenInfo;
  tokenB: TokenInfo;
  reserveA: bigint;
  reserveB: bigint;
  price: number;
  tvlUsd: number;
  volume24h: number;
  fee: number;
  lpMint?: string;
}

export interface BondingCurveState {
  mint: string;
  virtualSolReserves: bigint;
  virtualTokenReserves: bigint;
  realSolReserves: bigint;
  realTokenReserves: bigint;
  tokenTotalSupply: bigint;
  complete: boolean;
}

// ===========================================
// TRADE TYPES
// ===========================================

export interface SwapQuote {
  inputMint: string;
  outputMint: string;
  inputAmount: bigint;
  outputAmount: bigint;
  priceImpactPct: number;
  slippageBps: number;
  fee: bigint;
  route: RouteInfo[];
  expiresAt: Date;
}

export interface RouteInfo {
  dex: DEXType;
  poolId: string;
  inputMint: string;
  outputMint: string;
  inAmount: bigint;
  outAmount: bigint;
  fee: number;
}

export interface TradeParams {
  walletId: string;
  inputToken: string;
  outputToken: string;
  amount: bigint;
  slippageBps: number;
  useMevProtection?: boolean;
}

export interface TradeResult extends TransactionResult {
  inputAmount: bigint;
  outputAmount: bigint;
  priceImpact: number;
  route: RouteInfo[];
}

// ===========================================
// WALLET TYPES
// ===========================================

export interface MasterWallet {
  id: string;
  publicKey: string;
  derivedCount: number;
  createdAt: Date;
}

export interface DerivedWallet {
  id: string;
  address: string;
  derivationIndex: number;
  masterWalletId: string;
  tags: string[];
  createdAt: Date;
  lastUsedAt?: Date;
}

export interface WalletFilter {
  tags?: string[];
  masterWalletId?: string;
  minBalance?: bigint;
  maxBalance?: bigint;
  limit?: number;
  offset?: number;
}

// ===========================================
// BOT TYPES
// ===========================================

export type BotMode = 'volume' | 'market-make' | 'accumulate' | 'distribute';
export type BotStatus = 'idle' | 'running' | 'paused' | 'stopped' | 'error';

export interface BotConfig {
  walletId: string;
  targetToken: string;
  mode: BotMode;
  minTradeSize: bigint;
  maxTradeSize: bigint;
  minIntervalMs: number;
  maxIntervalMs: number;
  buyProbability: number;
  maxDailyTrades: number;
  maxDailyVolume: bigint;
  enabled: boolean;
}

export interface Bot {
  id: string;
  config: BotConfig;
  status: BotStatus;
  stats: BotStats;
  createdAt: Date;
  lastTradeAt?: Date;
}

export interface BotStats {
  totalTrades: number;
  totalVolume: bigint;
  successfulTrades: number;
  failedTrades: number;
  totalFees: bigint;
  profitLoss: bigint;
}

// ===========================================
// CAMPAIGN TYPES
// ===========================================

export type CampaignMode = 'aggressive' | 'moderate' | 'stealth';
export type CampaignStatus = 'draft' | 'active' | 'paused' | 'completed' | 'failed';

export interface CampaignConfig {
  name: string;
  targetToken: string;
  targetVolume24h: bigint;
  targetTransactionCount24h: number;
  durationHours: number;
  botCount: number;
  walletTag: string;
  mode: CampaignMode;
}

export interface Campaign {
  id: string;
  config: CampaignConfig;
  status: CampaignStatus;
  metrics: CampaignMetrics;
  botIds: string[];
  createdAt: Date;
  startedAt?: Date;
  endedAt?: Date;
}

export interface CampaignMetrics {
  volumeGenerated: bigint;
  transactionCount: number;
  uniqueWalletsUsed: number;
  averageTradeSize: bigint;
  successRate: number;
  totalFeesPaid: bigint;
  elapsedHours: number;
  progressPercent: number;
}

// ===========================================
// TASK QUEUE TYPES
// ===========================================

export type TaskType = 'swap' | 'transfer' | 'check-balance' | 'migrate-pool' | 'consolidate';
export type TaskPriority = 'low' | 'normal' | 'high' | 'critical';
export type TaskStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'retry';

export interface Task {
  id: string;
  type: TaskType;
  payload: Record<string, unknown>;
  priority: TaskPriority;
  status: TaskStatus;
  maxRetries: number;
  retryCount: number;
  timeout: number;
  walletId?: string;
  botId?: string;
  campaignId?: string;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  error?: string;
}

// ===========================================
// METRICS TYPES
// ===========================================

export interface VolumeMetrics {
  tokenMint: string;
  period: '1h' | '24h' | '7d';
  totalVolume: bigint;
  buyVolume: bigint;
  sellVolume: bigint;
  transactionCount: number;
  uniqueWallets: number;
  averageTradeSize: bigint;
}

export interface SystemMetrics {
  activeBots: number;
  activeCampaigns: number;
  pendingTasks: number;
  processingTasks: number;
  failedTasksLast1h: number;
  rpcLatencyMs: number;
  redisLatencyMs: number;
  dbLatencyMs: number;
}

// ===========================================
// ERROR TYPES
// ===========================================

export class DeFiError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'DeFiError';
  }
}

export class InsufficientBalanceError extends DeFiError {
  constructor(required: bigint, available: bigint) {
    super(
      `Insufficient balance: required ${required}, available ${available}`,
      'INSUFFICIENT_BALANCE',
      { required: required.toString(), available: available.toString() }
    );
  }
}

export class SlippageExceededError extends DeFiError {
  constructor(expected: bigint, actual: bigint, slippageBps: number) {
    super(
      `Slippage exceeded: expected ${expected}, got ${actual}`,
      'SLIPPAGE_EXCEEDED',
      { expected: expected.toString(), actual: actual.toString(), slippageBps }
    );
  }
}

export class TransactionFailedError extends DeFiError {
  constructor(signature: string, error: string) {
    super(
      `Transaction failed: ${error}`,
      'TRANSACTION_FAILED',
      { signature, error }
    );
  }
}

export class WalletNotFoundError extends DeFiError {
  constructor(walletId: string) {
    super(
      `Wallet not found: ${walletId}`,
      'WALLET_NOT_FOUND',
      { walletId }
    );
  }
}

export class InvalidPasswordError extends DeFiError {
  constructor() {
    super('Invalid password', 'INVALID_PASSWORD');
  }
}
