/**
 * Token Launcher Types
 * Comprehensive type definitions for token creation, LP deployment, and launch sniping
 */

// ============================================================================
// Token Creation Types
// ============================================================================

/**
 * Parameters for creating a new SPL token
 */
export interface CreateTokenParams {
  /** Token name */
  name: string;
  /** Token symbol (ticker) */
  symbol: string;
  /** Number of decimals (typically 6 or 9) */
  decimals: number;
  /** Total supply to mint */
  totalSupply: string;
  /** Wallet ID to use as mint authority */
  walletId: string;
  
  /** Optional: Revoke mint authority after creation */
  revokeMintAuthority?: boolean;
  /** Optional: Revoke freeze authority after creation */
  revokeFreezeAuthority?: boolean;
}

/**
 * Extended token creation with metadata
 */
export interface CreateTokenWithMetadataParams extends CreateTokenParams {
  /** Token description */
  description?: string;
  /** Image URL (IPFS preferred) */
  image?: string;
  /** External website URL */
  externalUrl?: string;
  /** Social links */
  socials?: {
    twitter?: string;
    telegram?: string;
    discord?: string;
    website?: string;
  };
  /** Custom attributes */
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;
}

/**
 * Result of token creation
 */
export interface CreateTokenResult {
  success: boolean;
  mint: string;
  mintAuthority?: string;
  freezeAuthority?: string;
  metadataAddress?: string;
  signature: string;
  totalSupply: string;
  decimals: number;
}

// ============================================================================
// Liquidity Pool Types
// ============================================================================

/**
 * Supported DEXes for LP creation
 */
export type DEXType = 'raydium' | 'raydium-cpmm' | 'meteora' | 'orca';

/**
 * Parameters for creating a Raydium AMM pool
 */
export interface CreateRaydiumPoolParams {
  /** Token mint address */
  tokenMint: string;
  /** Quote token (usually SOL or USDC) */
  quoteMint: string;
  /** Initial token amount for liquidity */
  tokenAmount: string;
  /** Initial quote amount for liquidity (SOL/USDC) */
  quoteAmount: string;
  /** Wallet ID for pool creation */
  walletId: string;
  /** Starting price (quote per token) */
  startPrice?: number;
  /** Pool type */
  poolType?: 'amm' | 'cpmm' | 'clmm';
  /** Open time (Unix timestamp) for delayed launch */
  openTime?: number;
}

/**
 * Parameters for creating a Meteora DLMM pool
 */
export interface CreateMeteoraPoolParams {
  /** Token mint address */
  tokenMint: string;
  /** Quote token (usually SOL) */
  quoteMint: string;
  /** Initial token amount */
  tokenAmount: string;
  /** Initial quote amount */
  quoteAmount: string;
  /** Wallet ID */
  walletId: string;
  /** Bin step (price granularity) */
  binStep: number;
  /** Base fee in bps */
  baseFee: number;
  /** Activation type */
  activationType: 'instant' | 'delayed';
  /** Activation slot (for delayed) */
  activationSlot?: number;
}

/**
 * Result of pool creation
 */
export interface CreatePoolResult {
  success: boolean;
  poolId: string;
  poolType: DEXType;
  lpMint?: string;
  tokenAmount: string;
  quoteAmount: string;
  initialPrice: number;
  signature: string;
  openTime?: number;
}

// ============================================================================
// PumpFun Types
// ============================================================================

/**
 * Parameters for creating a token on PumpFun.
 *
 * The coin is a Token-2022 mint created with `create_v2`. It is paired with
 * SOL unless `quoteMint` names another quote `create_v2` accepts: a mint on
 * the pump `Global` whitelist (USDC), one in the quote control list, or an
 * existing pump coin.
 */
export interface CreatePumpFunTokenParams {
  /** Token name */
  name: string;
  /** Token symbol */
  symbol: string;
  /** Token description */
  description: string;
  /** Image URL, written into the metadata JSON */
  image: string;
  /** Wallet ID of the creator (signs and pays) */
  walletId: string;
  /** Social links */
  socials?: {
    twitter?: string;
    telegram?: string;
    website?: string;
  };
  /** Quote mint the coin trades against; SOL when omitted */
  quoteMint?: string;
  /** Create the coin in mayhem mode */
  mayhemMode?: boolean;
  /** Creator's first buy, in whole quote mint units (SOL unless `quoteMint` is set) */
  initialBuyAmount?: string;
  /** Slippage for the first buy (bps) */
  slippageBps?: number;
}

/**
 * PumpFun token creation result
 */
export interface PumpFunTokenResult {
  success: boolean;
  mint: string;
  bondingCurve: string;
  /** The curve's Token-2022 token account */
  associatedBondingCurve: string;
  /** Normalized quote mint (WSOL for SOL-paired coins) */
  quoteMint: string;
  metadataUri: string;
  /** The create transaction; it also holds the first buy whenever both fit one transaction */
  signature: string;
  /**
   * Set when the first buy did not fit the create transaction (a coin quoted
   * in another pump coin carries that coin's curve accounts) and was sent
   * right after the create confirmed
   */
  devBuySignature?: string;
  /** Tokens the first buy was quoted for, in base units */
  devBuyAmount?: string;
}

/** Where a pump coin trades now. */
export type PumpFunVenue = 'curve' | 'completed' | 'pumpswap' | 'raydium';

/**
 * PumpFun bonding curve state, decoded by `@pump-fun/pump-sdk`.
 * Reserve amounts are base-unit integers as strings.
 */
export interface BondingCurveState {
  mint: string;
  bondingCurve: string;
  /** The curve's token account for the coin */
  associatedBondingCurve: string;
  /** Token program of the coin (Token-2022 for `create_v2` coins) */
  tokenProgram: string;
  tokenDecimals: number;
  /** Normalized quote mint (WSOL for SOL-paired coins) */
  quoteMint: string;
  quoteTokenProgram: string;
  quoteDecimals: number;
  creator: string;
  virtualQuoteReserves: string;
  virtualTokenReserves: string;
  realQuoteReserves: string;
  realTokenReserves: string;
  tokenTotalSupply: string;
  /** Curve sold out; no curve trades after this */
  complete: boolean;
  /** Curve migrated its liquidity to an AMM pool */
  migrated: boolean;
  isMayhemMode: boolean;
  /** Cashback coins trade on the curve only through `buy_v2` / `sell_v2` */
  isCashbackCoin: boolean;
  /**
   * `curve` while trading on the bonding curve, `completed` while awaiting
   * migration, `pumpswap` once its canonical PumpSwap pool exists, `raydium`
   * for coins that migrated before PumpSwap existed.
   */
  venue: PumpFunVenue;
  /** Canonical PumpSwap pool once migrated there */
  pumpSwapPool?: string;
}

// ============================================================================
// Bundled Launch Types
// ============================================================================

/**
 * Bundled launch parameters (token + LP + snipe in one bundle)
 */
export interface BundledLaunchParams {
  /** Token parameters */
  token: CreateTokenWithMetadataParams;
  /** Pool parameters */
  pool: {
    dex: DEXType;
    tokenAmount: string;
    quoteAmount: string;
    openTime?: number;
  };
  /** Snipe parameters (buy with multiple wallets at launch) */
  snipe?: {
    walletIds: string[];
    amountPerWallet: string;
    slippageBps: number;
  };
  /** Use Jito bundle for atomicity */
  useJito: boolean;
  /** Jito tip in lamports */
  jitoTipLamports?: string;
}

/**
 * Bundled launch result
 */
export interface BundledLaunchResult {
  success: boolean;
  mint: string;
  poolId: string;
  bundleId?: string;
  signatures: {
    tokenCreate: string;
    poolCreate: string;
    snipeTxs: string[];
  };
  snipeResults: Array<{
    walletId: string;
    success: boolean;
    tokensReceived?: string;
    error?: string;
  }>;
}

// ============================================================================
// Snipe Types
// ============================================================================

/**
 * Parameters for sniping a token launch
 */
export interface SnipeLaunchParams {
  /** Token mint to snipe */
  tokenMint: string;
  /** Pool ID (if known) */
  poolId?: string;
  /** DEX to snipe on */
  dex: DEXType | 'pumpfun';
  /** Wallets to use for sniping */
  walletIds: string[];
  /** Amount per wallet in whole quote mint units (SOL for SOL-paired coins) */
  amountPerWallet: string;
  /** Max slippage in bps */
  slippageBps: number;
  /** Use Jito for frontrun protection */
  useJito: boolean;
  /** Jito tip in lamports */
  jitoTipLamports?: string;
  /** Max retries per wallet */
  maxRetries?: number;
}

/**
 * Snipe result
 */
export interface SnipeResult {
  success: boolean;
  totalWallets: number;
  successfulSnipes: number;
  failedSnipes: number;
  /** Quote spent by successful buys, in base units (lamports for SOL-paired coins) */
  totalSolSpent: string;
  /** Tokens the successful buys were quoted for, in base units */
  totalTokensReceived: string;
  bundleId?: string;
  results: Array<{
    walletId: string;
    success: boolean;
    signature?: string;
    /** Tokens the buy was quoted for at send time, in base units */
    tokensReceived?: string;
    /** Quote spent, in whole quote mint units */
    solSpent?: string;
    error?: string;
  }>;
}

// ============================================================================
// Token Info Types
// ============================================================================

/**
 * Token information
 */
export interface TokenInfo {
  mint: string;
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: string;
  circulatingSupply?: string;
  mintAuthority?: string;
  freezeAuthority?: string;
  metadata?: {
    uri?: string;
    image?: string;
    description?: string;
  };
  pool?: {
    dex: DEXType;
    poolId: string;
    liquidity: string;
    price: number;
  };
}

// ============================================================================
// Error Types
// ============================================================================

export enum TokenLaunchErrorCode {
  INVALID_PARAMS = 'INVALID_PARAMS',
  INSUFFICIENT_FUNDS = 'INSUFFICIENT_FUNDS',
  TOKEN_EXISTS = 'TOKEN_EXISTS',
  POOL_EXISTS = 'POOL_EXISTS',
  POOL_NOT_FOUND = 'POOL_NOT_FOUND',
  TRANSACTION_FAILED = 'TRANSACTION_FAILED',
  BUNDLE_FAILED = 'BUNDLE_FAILED',
  SLIPPAGE_EXCEEDED = 'SLIPPAGE_EXCEEDED',
  RPC_ERROR = 'RPC_ERROR',
  METADATA_UPLOAD_FAILED = 'METADATA_UPLOAD_FAILED',
}

export class TokenLaunchError extends Error {
  constructor(
    public code: TokenLaunchErrorCode,
    message: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'TokenLaunchError';
  }
}

// ============================================================================
// Configuration Types
// ============================================================================

export interface TokenLauncherConfig {
  /** Solana RPC URL */
  rpcUrl: string;
  /** Commitment level */
  commitment?: 'processed' | 'confirmed' | 'finalized';
  /** Jito block engine URL */
  jitoUrl?: string;
  /** IPFS gateway for metadata */
  ipfsGateway?: string;
  /** PumpFun API URL */
  pumpFunApiUrl?: string;
}

// ============================================================================
// Constants
// ============================================================================

export const CONSTANTS = {
  // Program IDs
  TOKEN_PROGRAM_ID: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  TOKEN_2022_PROGRAM_ID: 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb',
  ASSOCIATED_TOKEN_PROGRAM_ID: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
  METADATA_PROGRAM_ID: 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  
  // DEX Program IDs
  RAYDIUM_AMM_PROGRAM: '675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8',
  RAYDIUM_CPMM_PROGRAM: 'CPMMoo8L3F4NbTegBCKVNunggL7H1ZpdTHKxQB5qKP1C',
  PUMPFUN_PROGRAM: '6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P',
  PUMPSWAP_PROGRAM: 'pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA',
  METEORA_DLMM_PROGRAM: 'LBUZKhRxPF3XUpBCjp4YzTKgLccjZhTSDM9YuVaPwxo',
  
  // Common tokens
  SOL_MINT: 'So11111111111111111111111111111111111111112',
  USDC_MINT: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  
  // PumpFun constants
  PUMPFUN_GLOBAL: '4wTV1YmiEkRvAtNtsSGPtUrqRYQMe5SKy2uB4Jjaxnjf',
  /** pump.fun's address lookup table (pump programs, fee accounts, listed quote mints); keeps `create_v2` with a first buy under the transaction size limit */
  PUMPFUN_LOOKUP_TABLE: '2dW7nGf9DyN94a2RH9JUiAMyGqft3J61xmx1txmQyyPJ',
  
  // Defaults
  DEFAULT_DECIMALS: 9,
  DEFAULT_SLIPPAGE_BPS: 100, // 1%
} as const;
