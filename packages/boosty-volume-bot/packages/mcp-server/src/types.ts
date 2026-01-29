/**
 * DeFi MCP Server Type Definitions
 * Comprehensive types for wallet management, trading, campaigns, and MCP tools
 */

import { z } from 'zod';

// ===========================================
// SOLANA NETWORK TYPES
// ===========================================

export type SolanaNetwork = 'mainnet-beta' | 'devnet' | 'testnet' | 'localnet';
export type CommitmentLevel = 'processed' | 'confirmed' | 'finalized';

// ===========================================
// WALLET TYPES
// ===========================================

export interface WalletInfo {
  id: string;
  address: string;
  tags: string[];
  balance: {
    sol: string;
    solUsd: number;
  };
  createdAt: string;
  lastUsedAt?: string;
}

export interface WalletSwarmResult {
  count: number;
  tag: string;
  wallets: Array<{
    id: string;
    address: string;
  }>;
  totalFunded: string;
}

export interface WalletBalanceResult {
  walletId: string;
  address: string;
  sol: string;
  solUsd: number;
  tokens: Array<{
    mint: string;
    symbol: string;
    balance: string;
    valueUsd: number;
  }>;
  totalValueUsd: number;
}

export interface FundDistributionResult {
  sourceWallet: string;
  distributions: Array<{
    walletId: string;
    address: string;
    amount: string;
    signature: string;
    status: 'success' | 'failed';
    error?: string;
  }>;
  totalDistributed: string;
  successCount: number;
  failCount: number;
}

export interface ConsolidationResult {
  targetWallet: string;
  consolidations: Array<{
    sourceWalletId: string;
    sourceAddress: string;
    amount: string;
    signature: string;
    status: 'success' | 'failed';
    error?: string;
  }>;
  totalConsolidated: string;
  successCount: number;
  failCount: number;
}

// ===========================================
// TRADING TYPES
// ===========================================

export interface SwapQuote {
  inputMint: string;
  outputMint: string;
  inputAmount: string;
  outputAmount: string;
  priceImpactPct: number;
  slippageBps: number;
  fee: string;
  route: RouteStep[];
  expiresAt: string;
}

export interface RouteStep {
  dex: string;
  poolId: string;
  inputMint: string;
  outputMint: string;
  inAmount: string;
  outAmount: string;
  fee: number;
}

export interface SwapResult {
  signature: string;
  status: 'success' | 'failed';
  inputAmount: string;
  outputAmount: string;
  inputToken: string;
  outputToken: string;
  priceImpact: number;
  fee: string;
  slot?: number;
  error?: string;
}

export interface BatchSwapResult {
  total: number;
  successful: number;
  failed: number;
  results: SwapResult[];
}

// ===========================================
// CAMPAIGN TYPES
// ===========================================

export type CampaignMode = 'aggressive' | 'moderate' | 'stealth';
export type CampaignStatus = 'draft' | 'active' | 'paused' | 'completed' | 'failed';

export interface CampaignConfig {
  name: string;
  targetToken: string;
  targetVolume24h: string;
  botCount: number;
  duration: number;
  mode: CampaignMode;
  walletTag?: string;
}

export interface Campaign {
  id: string;
  name: string;
  status: CampaignStatus;
  config: CampaignConfig;
  metrics: CampaignMetrics;
  botIds: string[];
  createdAt: string;
  startedAt?: string;
  endedAt?: string;
}

export interface CampaignMetrics {
  volumeGenerated: string;
  volumeGeneratedUsd: number;
  transactionCount: number;
  uniqueWalletsUsed: number;
  averageTradeSize: string;
  successRate: number;
  totalFeesPaid: string;
  elapsedHours: number;
  progressPercent: number;
  estimatedCompletion?: string;
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
  minTradeSize: string;
  maxTradeSize: string;
  minIntervalMs: number;
  maxIntervalMs: number;
  buyProbability: number;
  maxDailyTrades: number;
  maxDailyVolume: string;
}

export interface Bot {
  id: string;
  config: BotConfig;
  status: BotStatus;
  stats: BotStats;
  createdAt: string;
  lastTradeAt?: string;
  campaignId?: string;
}

export interface BotStats {
  totalTrades: number;
  totalVolume: string;
  successfulTrades: number;
  failedTrades: number;
  totalFees: string;
  profitLoss: string;
}

// ===========================================
// MARKET ANALYSIS TYPES
// ===========================================

export interface TokenInfo {
  mint: string;
  symbol: string;
  name: string;
  decimals: number;
  totalSupply: string;
  price: number;
  priceChange24h: number;
  volume24h: number;
  marketCap: number;
  logoUrl?: string;
}

export interface PoolInfo {
  id: string;
  dex: string;
  tokenA: {
    mint: string;
    symbol: string;
    reserve: string;
  };
  tokenB: {
    mint: string;
    symbol: string;
    reserve: string;
  };
  price: number;
  tvl: number;
  volume24h: number;
  fee: number;
}

export interface LiquidityAnalysis {
  tokenMint: string;
  totalLiquidity: number;
  pools: PoolInfo[];
  slippageAt: {
    '100SOL': number;
    '500SOL': number;
    '1000SOL': number;
  };
  recommendation: 'good' | 'moderate' | 'poor';
}

export interface TopHolder {
  address: string;
  balance: string;
  percentage: number;
  isContract: boolean;
  label?: string;
}

// ===========================================
// MCP TOOL TYPES
// ===========================================

export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, PropertySchema>;
    required?: string[];
  };
}

export interface PropertySchema {
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  description: string;
  enum?: string[];
  items?: PropertySchema;
  properties?: Record<string, PropertySchema>;
  required?: string[];
  minimum?: number;
  maximum?: number;
  default?: unknown;
}

export interface ToolResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

// ===========================================
// MCP RESOURCE TYPES
// ===========================================

export interface ResourceTemplate {
  uriTemplate: string;
  name: string;
  description: string;
  mimeType?: string;
}

export interface Resource {
  uri: string;
  name: string;
  mimeType: string;
  description?: string;
}

// ===========================================
// MCP PROMPT TYPES
// ===========================================

export interface PromptDefinition {
  name: string;
  description: string;
  arguments?: PromptArgument[];
}

export interface PromptArgument {
  name: string;
  description: string;
  required?: boolean;
}

export interface PromptMessage {
  role: 'user' | 'assistant';
  content: {
    type: 'text';
    text: string;
  };
}

// ===========================================
// AUTH TYPES
// ===========================================

export interface AuthConfig {
  requireAuth: boolean;
  apiKeyHeader: string;
  rateLimits: {
    swaps: RateLimitConfig;
    walletOps: RateLimitConfig;
    campaigns: RateLimitConfig;
    queries: RateLimitConfig;
  };
}

export interface RateLimitConfig {
  max: number;
  windowMs: number;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  tool: string;
  params: Record<string, unknown>;
  result: 'success' | 'error';
  duration: number;
  apiKey?: string;
  error?: string;
}

// ===========================================
// CONFIGURATION TYPES
// ===========================================

export interface ServerConfig {
  solana: {
    network: SolanaNetwork;
    rpcEndpoints: string[];
    commitment: CommitmentLevel;
    maxRetries: number;
  };
  redis: {
    host: string;
    port: number;
    password?: string;
    db?: number;
  };
  database: {
    host: string;
    port: number;
    database: string;
    user: string;
    password: string;
    ssl?: boolean;
  };
  encryption: {
    masterPassword: string;
    algorithm: string;
  };
  features: {
    maxWallets: number;
    maxBotsPerCampaign: number;
    maxConcurrentCampaigns: number;
    maxBatchSize: number;
  };
  auth: AuthConfig;
  logging: {
    level: 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';
    pretty: boolean;
  };
}

// ===========================================
// ZOD SCHEMAS FOR VALIDATION
// ===========================================

export const SolanaNetworkSchema = z.enum(['mainnet-beta', 'devnet', 'testnet', 'localnet']);
export const CommitmentSchema = z.enum(['processed', 'confirmed', 'finalized']);
export const CampaignModeSchema = z.enum(['aggressive', 'moderate', 'stealth']);
export const CampaignStatusSchema = z.enum(['draft', 'active', 'paused', 'completed', 'failed']);
export const BotModeSchema = z.enum(['volume', 'market-make', 'accumulate', 'distribute']);
export const BotStatusSchema = z.enum(['idle', 'running', 'paused', 'stopped', 'error']);

// Tool input schemas
export const CreateWalletSwarmSchema = z.object({
  count: z.number().min(1).max(1000).describe('Number of wallets to create'),
  tag: z.string().optional().describe('Tag to identify this wallet group'),
  fundEach: z.number().min(0).optional().describe('SOL amount to fund each wallet'),
});

export const GetWalletBalancesSchema = z.object({
  walletIds: z.array(z.string()).optional().describe('Specific wallet IDs to query'),
  tag: z.string().optional().describe('Filter by wallet tag'),
  includeTokens: z.boolean().optional().default(true).describe('Include token balances'),
});

export const DistributeFundsSchema = z.object({
  sourceWalletId: z.string().describe('Source wallet ID'),
  targetWalletIds: z.array(z.string()).optional().describe('Target wallet IDs'),
  targetTag: z.string().optional().describe('Target wallets by tag'),
  amountEach: z.string().describe('SOL amount to send to each wallet'),
});

export const ConsolidateFundsSchema = z.object({
  sourceWalletIds: z.array(z.string()).optional().describe('Source wallet IDs'),
  sourceTag: z.string().optional().describe('Source wallets by tag'),
  targetWalletId: z.string().describe('Target wallet to consolidate funds to'),
  leaveMinimum: z.string().optional().default('0.005').describe('Minimum SOL to leave in each source wallet'),
});

export const ExecuteSwapSchema = z.object({
  walletId: z.string().describe('Wallet ID to use for the swap'),
  inputToken: z.string().describe('Input token mint address or "SOL"'),
  outputToken: z.string().describe('Output token mint address or "SOL"'),
  amount: z.string().describe('Amount to swap in input token units'),
  slippageBps: z.number().min(1).max(5000).optional().default(50).describe('Slippage tolerance in basis points'),
  useMevProtection: z.boolean().optional().default(true).describe('Use MEV protection'),
});

export const GetSwapQuoteSchema = z.object({
  inputToken: z.string().describe('Input token mint address or "SOL"'),
  outputToken: z.string().describe('Output token mint address or "SOL"'),
  amount: z.string().describe('Amount to swap in input token units'),
  slippageBps: z.number().min(1).max(5000).optional().default(50).describe('Slippage tolerance in basis points'),
});

export const ExecuteBatchSwapsSchema = z.object({
  swaps: z.array(z.object({
    walletId: z.string(),
    inputToken: z.string(),
    outputToken: z.string(),
    amount: z.string(),
    slippageBps: z.number().optional(),
  })).max(100).describe('Array of swap operations to execute'),
  parallel: z.boolean().optional().default(false).describe('Execute swaps in parallel'),
});

export const CreateVolumeCampaignSchema = z.object({
  name: z.string().min(1).max(100).describe('Campaign name'),
  targetToken: z.string().describe('Token mint to generate volume for'),
  targetVolume24h: z.string().describe('Target 24h volume in SOL'),
  botCount: z.number().min(1).max(500).describe('Number of bots to use'),
  duration: z.number().min(1).max(720).optional().default(24).describe('Campaign duration in hours'),
  mode: CampaignModeSchema.optional().default('moderate').describe('Campaign intensity mode'),
  walletTag: z.string().optional().describe('Use wallets with this tag'),
});

export const CampaignActionSchema = z.object({
  campaignId: z.string().describe('Campaign ID'),
});

export const GetCampaignMetricsSchema = z.object({
  campaignId: z.string().describe('Campaign ID'),
  detailed: z.boolean().optional().default(false).describe('Include detailed per-bot metrics'),
});

export const GetTokenInfoSchema = z.object({
  mint: z.string().describe('Token mint address'),
});

export const GetPoolInfoSchema = z.object({
  tokenMint: z.string().describe('Token mint address'),
  dex: z.string().optional().describe('Filter by DEX (raydium, orca, meteora)'),
});

export const AnalyzeLiquiditySchema = z.object({
  tokenMint: z.string().describe('Token mint address'),
  tradeSize: z.string().optional().describe('Analyze slippage for this trade size in SOL'),
});

export const GetTopHoldersSchema = z.object({
  tokenMint: z.string().describe('Token mint address'),
  limit: z.number().min(1).max(100).optional().default(20).describe('Number of holders to return'),
});

export const CreateBotSchema = z.object({
  walletId: z.string().describe('Wallet ID for the bot to use'),
  targetToken: z.string().describe('Token mint to trade'),
  mode: BotModeSchema.describe('Bot operating mode'),
  minTradeSize: z.string().describe('Minimum trade size in SOL'),
  maxTradeSize: z.string().describe('Maximum trade size in SOL'),
  minIntervalMs: z.number().min(1000).optional().default(30000).describe('Minimum interval between trades'),
  maxIntervalMs: z.number().min(1000).optional().default(300000).describe('Maximum interval between trades'),
  buyProbability: z.number().min(0).max(1).optional().default(0.5).describe('Probability of buying vs selling'),
});

export const ConfigureBotSchema = z.object({
  botId: z.string().describe('Bot ID to configure'),
  config: z.object({
    minTradeSize: z.string().optional(),
    maxTradeSize: z.string().optional(),
    minIntervalMs: z.number().optional(),
    maxIntervalMs: z.number().optional(),
    buyProbability: z.number().optional(),
    maxDailyTrades: z.number().optional(),
    maxDailyVolume: z.string().optional(),
  }).describe('Configuration updates'),
});

export const BotActionSchema = z.object({
  botId: z.string().describe('Bot ID'),
});

export type CreateWalletSwarmInput = z.infer<typeof CreateWalletSwarmSchema>;
export type GetWalletBalancesInput = z.infer<typeof GetWalletBalancesSchema>;
export type DistributeFundsInput = z.infer<typeof DistributeFundsSchema>;
export type ConsolidateFundsInput = z.infer<typeof ConsolidateFundsSchema>;
export type ExecuteSwapInput = z.infer<typeof ExecuteSwapSchema>;
export type GetSwapQuoteInput = z.infer<typeof GetSwapQuoteSchema>;
export type ExecuteBatchSwapsInput = z.infer<typeof ExecuteBatchSwapsSchema>;
export type CreateVolumeCampaignInput = z.infer<typeof CreateVolumeCampaignSchema>;
export type CampaignActionInput = z.infer<typeof CampaignActionSchema>;
export type GetCampaignMetricsInput = z.infer<typeof GetCampaignMetricsSchema>;
export type GetTokenInfoInput = z.infer<typeof GetTokenInfoSchema>;
export type GetPoolInfoInput = z.infer<typeof GetPoolInfoSchema>;
export type AnalyzeLiquidityInput = z.infer<typeof AnalyzeLiquiditySchema>;
export type GetTopHoldersInput = z.infer<typeof GetTopHoldersSchema>;
export type CreateBotInput = z.infer<typeof CreateBotSchema>;
export type ConfigureBotInput = z.infer<typeof ConfigureBotSchema>;
export type BotActionInput = z.infer<typeof BotActionSchema>;
