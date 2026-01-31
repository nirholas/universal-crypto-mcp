/**
 * defi Types
 *
 * Auto-extracted from vendor/defi/
 */

// ============================================================
// Interfaces from vendor code
// ============================================================

interface User {
  id: string;
  reserves: {
    usageAsCollateralEnabledOnUser: boolean;
    reserve: {
      symbol: string;
      usageAsCollateralEnabled: boolean;
      underlyingAsset: string;
      price: {
        priceInEth: string;
      }

interface PositionHistory {
  transactionHash: string;
}

interface PositionMainOwner {
  address: string;
}

interface PositionMain {
  lastOwner: PositionMainOwner;
}

interface Position {
  tick: number;
  tickVersion: string;
  index: string;
  validator: string;
  recipient: string;
  amount: string;
  startPrice: string;
  liquidationPenalty: number;
  totalExpo: string;
  amountReceived: string;
  amountRemaining: string;
  profit: string;
  liquidationPrice: string | null;
  effectiveTickPrice: string | null;
  type: string;
  status: string;
  history: PositionHistory[];
  mainPosition: PositionMain;
}

interface ApiResponse {
  serverTimestamp: number;
  positions: Position[];
}

export interface Bins {
  [token: string]: {
    bins: {
      [bin: number]: number;
    }

export interface Liq {
  owner: string;
  liqPrice: number;
  collateral: string;
  collateralAmount: string;
  extra?: {
    displayName?: string;
    url: string;
  }

// ============================================================
// Types from vendor code
// ============================================================

type AaveAdapterResource = {
  name: "aave";

type VaultData = {
  id: string;

type Account = {
  id: string;

type Balance = {
  amount: string;

type Asset = {
  id: string;

type Tier = "collateral" | "isolated" | "cross";

type AssetConfig = {
  borrowFactor: string;

type MappedAsset = {
  id: string;

type MulticallResponse<T> = {
  output: {
    input: any;

type SystemState = {
  price: string;

type Trove = {
  id: string;

type Urn = {
  ink: string;

type Ilk = {
  Art: string;

type Spot = {
  pip: string;

type CollateralConfig = {
  id: string;

type MarketConfig = {
  name: string;

// ============================================================
// UCM DeFi Types - Production Definitions
// ============================================================

/**
 * DeFi protocol definition
 */
export interface Protocol {
  /** Protocol identifier */
  id: string;
  /** Protocol name */
  name: string;
  /** Protocol type (DEX, lending, yield, etc.) */
  type: 'dex' | 'lending' | 'yield' | 'derivatives' | 'bridge' | 'aggregator';
  /** Supported chains */
  chains: string[];
  /** Protocol website */
  website?: string;
  /** TVL in USD */
  tvl?: string;
  /** Router/main contract address per chain */
  contracts: Record<string, string>;
  /** Is protocol active */
  active: boolean;
}

/**
 * Liquidity pool definition
 */
export interface Pool {
  /** Pool address */
  address: string;
  /** Pool name/identifier */
  name: string;
  /** Protocol this pool belongs to */
  protocol: string;
  /** Chain ID */
  chainId: number;
  /** Token addresses in the pool */
  tokens: string[];
  /** Token symbols */
  tokenSymbols: string[];
  /** Pool type (AMM, stable, concentrated, etc.) */
  type: 'amm' | 'stable' | 'concentrated' | 'weighted';
  /** Fee tier (in basis points) */
  feeBps: number;
  /** Total value locked */
  tvl?: string;
  /** 24h volume */
  volume24h?: string;
  /** APR if applicable */
  apr?: string;
}

/**
 * Swap parameters
 */
export interface SwapParams {
  /** Token to swap from */
  tokenIn: string;
  /** Token to swap to */
  tokenOut: string;
  /** Amount to swap (in wei) */
  amountIn: string;
  /** Minimum amount to receive (in wei) */
  amountOutMin: string;
  /** Recipient address */
  recipient: string;
  /** Deadline timestamp */
  deadline: number;
  /** Slippage tolerance in basis points */
  slippageBps?: number;
  /** Swap path (for multi-hop) */
  path?: string[];
  /** Use native ETH/MATIC/etc */
  useNative?: boolean;
}

/**
 * Pool statistics
 */
export interface PoolStats {
  /** Pool address */
  pool: string;
  /** Total value locked in USD */
  tvlUsd: string;
  /** 24h trading volume in USD */
  volume24hUsd: string;
  /** 7d trading volume in USD */
  volume7dUsd: string;
  /** Current APR */
  apr: string;
  /** Fee APR component */
  feeApr: string;
  /** Reward APR component (if any) */
  rewardApr?: string;
  /** Token reserves */
  reserves: Record<string, string>;
  /** Token prices in USD */
  prices: Record<string, string>;
  /** Last update timestamp */
  updatedAt: number;
}
