/**
 * Trading Engine Types
 * 
 * Core type definitions for Solana DEX integrations including
 * Jupiter, Raydium, Orca, PumpFun, and the trade execution engine.
 */

import type { VersionedTransaction, TransactionSignature } from '@solana/web3.js';

// ============================================================================
// Common Types
// ============================================================================

/**
 * Network environment
 */
export type NetworkCluster = 'mainnet-beta' | 'devnet' | 'testnet';

/**
 * DEX protocol identifier
 */
export type DexProtocol = 'jupiter' | 'raydium' | 'orca' | 'pumpfun';

/**
 * Token information for trading
 */
export interface TokenInfo {
  /** Token mint address */
  mint: string;
  /** Token symbol */
  symbol: string;
  /** Token name */
  name: string;
  /** Decimal places */
  decimals: number;
  /** Logo URI */
  logoURI?: string;
  /** CoinGecko ID */
  coingeckoId?: string;
  /** Token tags */
  tags?: string[];
  /** Whether it's a native token (SOL) */
  isNative?: boolean;
}

/**
 * Transaction result
 */
export interface TransactionResult {
  /** Transaction signature */
  signature: TransactionSignature;
  /** Confirmation status */
  confirmed: boolean;
  /** Slot the transaction was confirmed in */
  slot?: number;
  /** Block time */
  blockTime?: number;
  /** Error message if failed */
  error?: string;
  /** Transaction fee in lamports */
  fee?: number;
}

/**
 * Swap route leg
 */
export interface RouteLeg {
  /** Source token mint */
  inputMint: string;
  /** Destination token mint */
  outputMint: string;
  /** Amount in (raw) */
  amountIn: bigint;
  /** Amount out (raw) */
  amountOut: bigint;
  /** DEX/AMM used */
  protocol: string;
  /** Pool/market address */
  poolAddress: string;
  /** Fee in basis points */
  feeBps: number;
}

/**
 * Complete swap route
 */
export interface Route {
  /** Route legs */
  legs: RouteLeg[];
  /** Total input amount */
  inputAmount: bigint;
  /** Total output amount */
  outputAmount: bigint;
  /** Price impact percentage */
  priceImpactPct: number;
  /** Total fees in basis points */
  totalFeeBps: number;
  /** Estimated execution time in ms */
  estimatedTimeMs?: number;
}

// ============================================================================
// Jupiter Types
// ============================================================================

/**
 * Jupiter quote request parameters
 */
export interface QuoteParams {
  /** Input token mint */
  inputMint: string;
  /** Output token mint */
  outputMint: string;
  /** Amount in (raw) */
  amount: bigint;
  /** Slippage tolerance in basis points */
  slippageBps?: number;
  /** Only direct routes (no intermediate hops) */
  onlyDirectRoutes?: boolean;
  /** DEXs to include */
  includeDexes?: string[];
  /** DEXs to exclude */
  excludeDexes?: string[];
  /** Max accounts for transaction */
  maxAccounts?: number;
  /** Swap mode: ExactIn or ExactOut */
  swapMode?: 'ExactIn' | 'ExactOut';
  /** Platform fee in basis points */
  platformFeeBps?: number;
  /** Restrict intermediate tokens for better routes (default: true) */
  restrictIntermediateTokens?: boolean;
  /** Use shared accounts (default: true) */
  useSharedAccounts?: boolean;
  /** As legacy transaction (default: false) */
  asLegacyTransaction?: boolean;
}

/**
 * Jupiter quote response
 */
export interface QuoteResponse {
  /** Input token mint */
  inputMint: string;
  /** Output token mint */
  outputMint: string;
  /** Input amount (raw) */
  inAmount: string;
  /** Output amount (raw) */
  outAmount: string;
  /** Other amount threshold for slippage */
  otherAmountThreshold: string;
  /** Swap mode */
  swapMode: 'ExactIn' | 'ExactOut';
  /** Slippage basis points */
  slippageBps: number;
  /** Price impact percentage */
  priceImpactPct: string;
  /** Route plan with market info */
  routePlan: JupiterRoutePlan[];
  /** Context slot */
  contextSlot?: number;
  /** Time taken for quote in ms */
  timeTaken?: number;
}

/**
 * Jupiter route plan entry
 */
export interface JupiterRoutePlan {
  /** Swap info */
  swapInfo: {
    ammKey: string;
    label: string;
    inputMint: string;
    outputMint: string;
    inAmount: string;
    outAmount: string;
    feeAmount: string;
    feeMint: string;
  };
  /** Percentage of route */
  percent: number;
}

/**
 * Jupiter swap parameters
 */
export interface SwapParams {
  /** User's public key */
  userPublicKey: string;
  /** Quote response from getQuote */
  quoteResponse: QuoteResponse;
  /** Wrap/unwrap SOL */
  wrapAndUnwrapSol?: boolean;
  /** Use shared accounts */
  useSharedAccounts?: boolean;
  /** Fee account for platform fees */
  feeAccount?: string;
  /** Compute unit price in micro-lamports */
  computeUnitPriceMicroLamports?: number;
  /** Priority level: min, low, medium, high, veryHigh */
  prioritizationFeeLamports?: number | 'auto';
  /** Skip user accounts RPC request */
  skipUserAccountsRpcRequest?: boolean;
  /** Dynamic compute unit limit */
  dynamicComputeUnitLimit?: boolean;
  /** Destination token account (optional) */
  destinationTokenAccount?: string;
}

/**
 * Execute swap parameters
 */
export interface ExecuteSwapParams extends SwapParams {
  /** Private key or signer function */
  signer: Uint8Array | ((tx: VersionedTransaction) => Promise<VersionedTransaction>);
  /** Send options */
  sendOptions?: {
    skipPreflight?: boolean;
    maxRetries?: number;
    preflightCommitment?: 'processed' | 'confirmed' | 'finalized';
  };
}

/**
 * DCA (Dollar Cost Average) order parameters
 */
export interface DCAParams {
  /** User's public key */
  userPublicKey: string;
  /** Input token mint */
  inputMint: string;
  /** Output token mint */
  outputMint: string;
  /** Total input amount */
  inAmount: bigint;
  /** Amount per cycle */
  inAmountPerCycle: bigint;
  /** Cycle frequency in seconds */
  cycleFrequency: number;
  /** Minimum output amount per cycle */
  minOutAmountPerCycle?: bigint;
  /** Maximum output amount per cycle */
  maxOutAmountPerCycle?: bigint;
  /** Start time (unix timestamp) */
  startAt?: number;
}

/**
 * Limit order parameters
 */
export interface LimitOrderParams {
  /** User's public key */
  userPublicKey: string;
  /** Input token mint */
  inputMint: string;
  /** Output token mint */
  outputMint: string;
  /** Input amount */
  inAmount: bigint;
  /** Output amount (defines the limit price) */
  outAmount: bigint;
  /** Expiry time (unix timestamp, 0 for no expiry) */
  expiredAt?: number;
}

// ============================================================================
// Raydium Types
// ============================================================================

/**
 * Raydium pool types
 */
export type RaydiumPoolType = 'AMM_V4' | 'CLMM' | 'CPMM';

/**
 * Raydium pool info
 */
export interface RaydiumPoolInfo {
  /** Pool ID */
  id: string;
  /** Pool type */
  type: RaydiumPoolType;
  /** Base token mint */
  baseMint: string;
  /** Quote token mint */
  quoteMint: string;
  /** Base token vault */
  baseVault: string;
  /** Quote token vault */
  quoteVault: string;
  /** LP token mint */
  lpMint: string;
  /** Base token reserve */
  baseReserve: bigint;
  /** Quote token reserve */
  quoteReserve: bigint;
  /** Base token decimals */
  baseDecimals: number;
  /** Quote token decimals */
  quoteDecimals: number;
  /** LP supply */
  lpSupply: bigint;
  /** Pool open time */
  openTime: number;
  /** Fee rate (basis points) */
  feeRate: number;
  /** Swap fee numerator */
  swapFeeNumerator: number;
  /** Swap fee denominator */
  swapFeeDenominator: number;
  /** Current price (base/quote) */
  price: number;
  /** 24h volume in USD */
  volume24h?: number;
  /** TVL in USD */
  tvlUsd?: number;
  /** APR percentage */
  apr?: number;
}

/**
 * Raydium CLMM pool info (extends base)
 */
export interface RaydiumCLMMPoolInfo extends RaydiumPoolInfo {
  type: 'CLMM';
  /** Current tick */
  currentTick: number;
  /** Current sqrt price */
  currentSqrtPrice: bigint;
  /** Tick spacing */
  tickSpacing: number;
  /** Fee growth global (token A) */
  feeGrowthGlobalA: bigint;
  /** Fee growth global (token B) */
  feeGrowthGlobalB: bigint;
  /** Liquidity */
  liquidity: bigint;
  /** Total value locked in USD */
  tvl?: number;
}

/**
 * Raydium swap parameters
 */
export interface RaydiumSwapParams {
  /** Pool ID */
  poolId: string;
  /** User's public key */
  userPublicKey: string;
  /** Input token mint */
  inputMint: string;
  /** Amount in (raw) */
  amountIn: bigint;
  /** Minimum amount out (raw) */
  minAmountOut: bigint;
  /** Fixed input or output side */
  fixedSide: 'in' | 'out';
  /** Compute budget config */
  computeBudgetConfig?: {
    units?: number;
    microLamports?: number;
  };
}

/**
 * Add liquidity parameters
 */
export interface AddLiquidityParams {
  /** Pool ID */
  poolId: string;
  /** User's public key */
  userPublicKey: string;
  /** Base token amount */
  baseAmount: bigint;
  /** Quote token amount */
  quoteAmount: bigint;
  /** Fixed side: base or quote */
  fixedSide: 'base' | 'quote';
  /** Slippage tolerance in basis points */
  slippageBps?: number;
}

/**
 * Remove liquidity parameters
 */
export interface RemoveLiquidityParams {
  /** Pool ID */
  poolId: string;
  /** User's public key */
  userPublicKey: string;
  /** LP token amount to burn */
  lpAmount: bigint;
  /** Minimum base amount out */
  minBaseAmount?: bigint;
  /** Minimum quote amount out */
  minQuoteAmount?: bigint;
}

// ============================================================================
// Orca Types
// ============================================================================

/**
 * Orca Whirlpool info
 */
export interface WhirlpoolInfo {
  /** Pool address */
  address: string;
  /** Token A mint */
  tokenMintA: string;
  /** Token B mint */
  tokenMintB: string;
  /** Token A vault */
  tokenVaultA: string;
  /** Token B vault */
  tokenVaultB: string;
  /** Fee rate (in hundredths of a basis point) */
  feeRate: number;
  /** Protocol fee rate */
  protocolFeeRate: number;
  /** Current tick index */
  tickCurrentIndex: number;
  /** Current sqrt price */
  sqrtPrice: bigint;
  /** Liquidity */
  liquidity: bigint;
  /** Tick spacing */
  tickSpacing: number;
  /** Fee growth global A */
  feeGrowthGlobalA: bigint;
  /** Fee growth global B */
  feeGrowthGlobalB: bigint;
  /** Reward infos */
  rewardInfos: WhirlpoolRewardInfo[];
  /** Total value locked in USD */
  tvl?: number;
  /** 24h volume in USD */
  volume24h?: number;
}

/**
 * Whirlpool reward info
 */
export interface WhirlpoolRewardInfo {
  /** Reward mint */
  mint: string;
  /** Reward vault */
  vault: string;
  /** Emissions per second */
  emissionsPerSecond: bigint;
  /** Growth global */
  growthGlobal: bigint;
}

/**
 * Orca swap parameters
 */
export interface OrcaSwapParams {
  /** Whirlpool address */
  whirlpoolAddress: string;
  /** User's public key */
  userPublicKey: string;
  /** Input token mint */
  inputMint: string;
  /** Amount (raw) */
  amount: bigint;
  /** Is exact input */
  isExactIn: boolean;
  /** Slippage tolerance in basis points */
  slippageBps?: number;
}

/**
 * Orca position info
 */
export interface OrcaPosition {
  /** Position address */
  address: string;
  /** Whirlpool address */
  whirlpool: string;
  /** Position mint (NFT) */
  positionMint: string;
  /** Lower tick */
  tickLowerIndex: number;
  /** Upper tick */
  tickUpperIndex: number;
  /** Liquidity */
  liquidity: bigint;
  /** Fee owed A */
  feeOwedA: bigint;
  /** Fee owed B */
  feeOwedB: bigint;
  /** Reward infos */
  rewardInfos: {
    growthInsideLast: bigint;
    amountOwed: bigint;
  }[];
}

// ============================================================================
// PumpFun Types
// ============================================================================

/**
 * PumpFun token info
 */
export interface PumpFunTokenInfo {
  /** Token mint address */
  mint: string;
  /** Token name */
  name: string;
  /** Token symbol */
  symbol: string;
  /** Token description */
  description?: string;
  /** Image URI */
  imageUri?: string;
  /** Creator address */
  creator: string;
  /** Creation timestamp */
  createdAt: number;
  /** Is migrated to Raydium */
  isMigrated: boolean;
  /** Raydium pool ID if migrated */
  raydiumPoolId?: string;
  /** Market cap in SOL */
  marketCapSol: number;
  /** Current price in SOL */
  priceInSol: number;
  /** 24h volume in SOL */
  volume24hSol?: number;
  /** Holder count */
  holderCount?: number;
  /** Reply count */
  replyCount?: number;
}

/**
 * Bonding curve state
 */
export interface BondingCurveState {
  /** Bonding curve address */
  address: string;
  /** Token mint */
  mint: string;
  /** Virtual SOL reserves */
  virtualSolReserves: bigint;
  /** Virtual token reserves */
  virtualTokenReserves: bigint;
  /** Real SOL reserves */
  realSolReserves: bigint;
  /** Real token reserves */
  realTokenReserves: bigint;
  /** Total supply */
  tokenTotalSupply: bigint;
  /** Is complete (migrated) */
  complete: boolean;
  /** Migration progress (0-100) */
  migrationProgress: number;
}

/**
 * PumpFun buy parameters
 */
export interface PumpFunBuyParams {
  /** Token mint address */
  mint: string;
  /** User's public key */
  userPublicKey: string;
  /** SOL amount to spend */
  solAmount: bigint;
  /** Minimum tokens to receive */
  minTokenAmount?: bigint;
  /** Slippage tolerance in basis points */
  slippageBps?: number;
}

/**
 * PumpFun sell parameters
 */
export interface PumpFunSellParams {
  /** Token mint address */
  mint: string;
  /** User's public key */
  userPublicKey: string;
  /** Token amount to sell */
  tokenAmount: bigint;
  /** Minimum SOL to receive */
  minSolAmount?: bigint;
  /** Slippage tolerance in basis points */
  slippageBps?: number;
}

/**
 * New PumpFun token event
 */
export interface NewPumpFunToken {
  /** Token mint */
  mint: string;
  /** Token name */
  name: string;
  /** Token symbol */
  symbol: string;
  /** Creator address */
  creator: string;
  /** Bonding curve address */
  bondingCurve: string;
  /** Creation signature */
  signature: string;
  /** Creation timestamp */
  timestamp: number;
  /** Initial market cap in SOL */
  initialMarketCapSol: number;
}

// ============================================================================
// Trade Executor Types
// ============================================================================

/**
 * Trade parameters
 */
export interface TradeParams {
  /** Input token mint */
  inputMint: string;
  /** Output token mint */
  outputMint: string;
  /** Amount (raw) */
  amount: bigint;
  /** Is exact input */
  isExactIn: boolean;
  /** User's public key */
  userPublicKey: string;
  /** Slippage tolerance in basis points (default: 100 = 1%) */
  slippageBps?: number;
  /** Preferred DEX (optional, auto-routes if not specified) */
  preferredDex?: DexProtocol;
  /** Priority fee in lamports */
  priorityFee?: number;
  /** Use MEV protection via Jito */
  useMEVProtection?: boolean;
  /** Jito tip amount in lamports */
  jitoTipLamports?: number;
}

/**
 * Trade result
 */
export interface TradeResult {
  /** Transaction result */
  transaction: TransactionResult;
  /** Input token mint */
  inputMint: string;
  /** Output token mint */
  outputMint: string;
  /** Amount in (actual) */
  amountIn: bigint;
  /** Amount out (actual) */
  amountOut: bigint;
  /** Price impact percentage */
  priceImpactPct: number;
  /** Route taken */
  route: Route;
  /** DEX used */
  dex: DexProtocol;
  /** Execution timestamp */
  executedAt: number;
  /** Total fees paid (lamports) */
  totalFees: bigint;
}

/**
 * Trade estimate
 */
export interface TradeEstimate {
  /** Estimated output amount */
  outputAmount: bigint;
  /** Estimated price impact */
  priceImpactPct: number;
  /** Estimated fees (lamports) */
  estimatedFees: bigint;
  /** Estimated execution time (ms) */
  estimatedTimeMs: number;
  /** Route to be used */
  route: Route;
  /** Recommended DEX */
  recommendedDex: DexProtocol;
  /** Quote expiry time */
  expiresAt: number;
}

/**
 * Batch trade result
 */
export interface BatchTradeResult {
  /** Individual trade results */
  results: TradeResult[];
  /** Successful trades count */
  successCount: number;
  /** Failed trades count */
  failedCount: number;
  /** Total execution time (ms) */
  totalTimeMs: number;
}

// ============================================================================
// Analytics Types
// ============================================================================

/**
 * Price impact analysis
 */
export interface PriceImpactAnalysis {
  /** Trade amount */
  amount: bigint;
  /** Price impact percentage */
  priceImpactPct: number;
  /** Impact level */
  impactLevel: 'low' | 'medium' | 'high' | 'severe';
  /** Recommended max amount for low impact */
  recommendedMaxAmount?: bigint;
  /** Breakdown by route leg */
  legImpacts?: {
    leg: RouteLeg;
    impactPct: number;
  }[];
}

/**
 * Liquidity depth analysis
 */
export interface LiquidityDepthAnalysis {
  /** Token pair */
  inputMint: string;
  outputMint: string;
  /** Liquidity at various price levels */
  levels: LiquidityLevel[];
  /** Total available liquidity */
  totalLiquidityUsd: number;
  /** Best available price */
  bestPrice: number;
  /** Spread percentage */
  spreadPct: number;
}

/**
 * Liquidity level
 */
export interface LiquidityLevel {
  /** Price level */
  price: number;
  /** Price deviation from mid */
  priceDeviationPct: number;
  /** Available liquidity at this level */
  liquidityUsd: number;
  /** Cumulative liquidity */
  cumulativeLiquidityUsd: number;
  /** Source pools */
  sources: {
    dex: DexProtocol;
    poolId: string;
    liquidityUsd: number;
  }[];
}

/**
 * Pool TVL info
 */
export interface PoolTVLInfo {
  /** Pool ID */
  poolId: string;
  /** DEX protocol */
  dex: DexProtocol;
  /** Token A mint */
  tokenA: string;
  /** Token B mint */
  tokenB: string;
  /** Token A reserve (raw) */
  reserveA: bigint;
  /** Token B reserve (raw) */
  reserveB: bigint;
  /** TVL in USD */
  tvlUsd: number;
  /** 24h volume in USD */
  volume24hUsd: number;
  /** 7d volume in USD */
  volume7dUsd?: number;
  /** Fee APR */
  feeApr: number;
  /** Last updated */
  updatedAt: number;
}

/**
 * Historical trade info
 */
export interface HistoricalTrade {
  /** Transaction signature */
  signature: string;
  /** Input token */
  inputMint: string;
  /** Output token */
  outputMint: string;
  /** Amount in */
  amountIn: bigint;
  /** Amount out */
  amountOut: bigint;
  /** Price at execution */
  price: number;
  /** DEX used */
  dex: DexProtocol;
  /** User address */
  user: string;
  /** Timestamp */
  timestamp: number;
  /** Block slot */
  slot: number;
}

// ============================================================================
// Client Interfaces
// ============================================================================

/**
 * Jupiter client interface
 */
export interface IJupiterClient {
  getQuote(params: QuoteParams): Promise<QuoteResponse>;
  getSwapTransaction(params: SwapParams): Promise<VersionedTransaction>;
  executeSwap(params: ExecuteSwapParams): Promise<TransactionResult>;
  getRouteMap(): Promise<Map<string, string[]>>;
  getTokenList(): Promise<TokenInfo[]>;
  createDCAOrder(params: DCAParams): Promise<TransactionResult>;
  createLimitOrder(params: LimitOrderParams): Promise<TransactionResult>;
}

/**
 * Raydium client interface
 */
export interface IRaydiumClient {
  getPoolInfo(poolId: string): Promise<RaydiumPoolInfo>;
  getPoolsByToken(mint: string): Promise<RaydiumPoolInfo[]>;
  swap(params: RaydiumSwapParams): Promise<TransactionResult>;
  addLiquidity(params: AddLiquidityParams): Promise<TransactionResult>;
  removeLiquidity(params: RemoveLiquidityParams): Promise<TransactionResult>;
  getPrice(poolId: string): Promise<number>;
}

/**
 * Orca client interface
 */
export interface IOrcaClient {
  getWhirlpoolInfo(address: string): Promise<WhirlpoolInfo>;
  getWhirlpoolsByToken(mint: string): Promise<WhirlpoolInfo[]>;
  swap(params: OrcaSwapParams): Promise<TransactionResult>;
  getPosition(positionAddress: string): Promise<OrcaPosition>;
  getPositionsByOwner(owner: string): Promise<OrcaPosition[]>;
}

/**
 * PumpFun client interface
 */
export interface IPumpFunClient {
  getTokenInfo(mint: string): Promise<PumpFunTokenInfo>;
  getBondingCurveState(mint: string): Promise<BondingCurveState>;
  buy(params: PumpFunBuyParams): Promise<TransactionResult>;
  sell(params: PumpFunSellParams): Promise<TransactionResult>;
  subscribeToNewTokens(callback: (token: NewPumpFunToken) => void): () => void;
  isMigrated(mint: string): Promise<boolean>;
}

/**
 * Trade executor interface
 */
export interface ITradeExecutor {
  executeTrade(params: TradeParams): Promise<TradeResult>;
  executeBatchTrades(trades: TradeParams[]): Promise<BatchTradeResult>;
  getOptimalRoute(input: string, output: string, amount: bigint): Promise<Route>;
  estimateTradeOutput(params: TradeParams): Promise<TradeEstimate>;
  setSlippageTolerance(bps: number): void;
  setMEVProtection(enabled: boolean, tipLamports?: number): void;
}

// ============================================================================
// Configuration Types
// ============================================================================

/**
 * Trading engine configuration
 */
export interface TradingEngineConfig {
  /** Solana RPC endpoint */
  rpcEndpoint: string;
  /** WebSocket endpoint */
  wsEndpoint?: string;
  /** Network cluster */
  cluster: NetworkCluster;
  /** Default slippage in basis points */
  defaultSlippageBps: number;
  /** Maximum slippage in basis points */
  maxSlippageBps: number;
  /** Jupiter API URL */
  jupiterApiUrl: string;
  /** Enable MEV protection by default */
  enableMEVProtection: boolean;
  /** Default Jito tip in lamports */
  defaultJitoTipLamports: number;
  /** Cache TTL for token list (ms) */
  tokenListCacheTtlMs: number;
  /** Cache TTL for route map (ms) */
  routeMapCacheTtlMs: number;
  /** Rate limit for Jupiter API (requests per minute) */
  jupiterRateLimit: number;
  /** Helius API key (optional) */
  heliusApiKey?: string;
}

/**
 * Default configuration
 */
export const DEFAULT_TRADING_CONFIG: TradingEngineConfig = {
  rpcEndpoint: 'https://api.mainnet-beta.solana.com',
  cluster: 'mainnet-beta',
  defaultSlippageBps: 100, // 1%
  maxSlippageBps: 5000, // 50%
  jupiterApiUrl: 'https://quote-api.jup.ag/v6',
  enableMEVProtection: false,
  defaultJitoTipLamports: 10_000, // 0.00001 SOL
  tokenListCacheTtlMs: 5 * 60 * 1000, // 5 minutes
  routeMapCacheTtlMs: 5 * 60 * 1000, // 5 minutes
  jupiterRateLimit: 600, // 600 requests per minute
};

// ============================================================================
// Constants
// ============================================================================

/**
 * Well-known token mints
 */
export const KNOWN_TOKENS = {
  SOL: 'So11111111111111111111111111111111111111112',
  USDC: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  USDT: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
  BONK: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
  WIF: 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm',
  JUP: 'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN',
  RAY: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R',
  ORCA: 'orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE',
} as const;

/**
 * PumpFun program IDs
 */
export const PUMPFUN_PROGRAM_IDS = {
  PROGRAM: '6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P',
  FEE_RECIPIENT: 'CebN5WGQ4jvEPvsVU4EoHEpgzq1VV7AbicfhtW4xC9iM',
  EVENT_AUTHORITY: 'Ce6TQqeHC9p8KetsN6JsjHK7UTZk7nasjjnr7XxXp9F1',
  GLOBAL: '4wTV1YmiEkRvAtNtsSGPtUrqRYQMe5SKy2uB4Jjaxnjf',
} as const;

/**
 * Raydium program IDs
 */
export const RAYDIUM_PROGRAM_IDS = {
  AMM_V4: '675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8',
  CLMM: 'CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK',
  CPMM: 'CPMMoo8L3F4NbTegBCKVNunggL7H1ZpdTHKxQB5qKP1C',
} as const;

/**
 * Orca program IDs
 */
export const ORCA_PROGRAM_IDS = {
  WHIRLPOOL: 'whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc',
} as const;
