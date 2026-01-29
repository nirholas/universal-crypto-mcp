/**
 * Supported blockchain networks
 */
export type Chain = 
  | 'ethereum'
  | 'arbitrum'
  | 'base'
  | 'optimism'
  | 'polygon'
  | 'avalanche'
  | 'bsc'
  | 'solana';

/**
 * Token information
 */
export interface TokenInfo {
  /** Token contract address */
  address: string;
  /** Token symbol (e.g., 'ETH', 'USDC') */
  symbol: string;
  /** Token name (e.g., 'Ethereum', 'USD Coin') */
  name: string;
  /** Number of decimals */
  decimals: number;
  /** Chain the token is on */
  chain: Chain;
  /** Logo URL (optional) */
  logoUrl?: string;
  /** CoinGecko ID (optional) */
  coingeckoId?: string;
}

/**
 * Price data for a token
 */
export interface PriceData {
  /** Token address */
  address: string;
  /** Token symbol */
  symbol: string;
  /** Chain */
  chain: Chain;
  /** Current price in USD */
  priceUsd: number;
  /** 24-hour price change percentage */
  change24h?: number;
  /** 24-hour trading volume in USD */
  volume24h?: number;
  /** Market cap in USD */
  marketCap?: number;
  /** Last updated timestamp (ISO 8601) */
  updatedAt: string;
}

/**
 * Wallet token balance
 */
export interface WalletBalance {
  /** Token information */
  token: TokenInfo;
  /** Raw balance (as string to handle large numbers) */
  rawBalance: string;
  /** Formatted balance (human readable) */
  balance: number;
  /** Balance value in USD */
  valueUsd: number;
}

/**
 * NFT metadata
 */
export interface NFTInfo {
  /** Contract address */
  contractAddress: string;
  /** Token ID */
  tokenId: string;
  /** NFT name */
  name: string;
  /** NFT description */
  description?: string;
  /** Image URL */
  imageUrl?: string;
  /** Collection name */
  collectionName?: string;
  /** Chain */
  chain: Chain;
  /** Floor price in native token */
  floorPrice?: number;
  /** Estimated value in USD */
  estimatedValueUsd?: number;
}

/**
 * DeFi protocol position
 */
export interface DeFiPosition {
  /** Protocol name (e.g., 'Aave', 'Uniswap') */
  protocol: string;
  /** Position type */
  type: 'lending' | 'borrowing' | 'liquidity' | 'staking' | 'farming';
  /** Chain */
  chain: Chain;
  /** Tokens involved */
  tokens: TokenInfo[];
  /** Total value in USD */
  valueUsd: number;
  /** APY/APR if applicable */
  apy?: number;
  /** Health factor for lending/borrowing */
  healthFactor?: number;
  /** Additional metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Yield opportunity
 */
export interface YieldOpportunity {
  /** Unique identifier */
  id: string;
  /** Pool/vault name */
  name: string;
  /** Protocol name */
  protocol: string;
  /** Chain */
  chain: Chain;
  /** Tokens in the pool */
  tokens: TokenInfo[];
  /** Current APY */
  apy: number;
  /** Base APY (without rewards) */
  baseApy?: number;
  /** Reward APY */
  rewardApy?: number;
  /** Total value locked in USD */
  tvlUsd: number;
  /** Risk level */
  riskLevel: 'low' | 'medium' | 'high';
  /** Pool category */
  category: 'stablecoin' | 'volatile' | 'lsd' | 'other';
}

/**
 * Gas price information
 */
export interface GasPrices {
  /** Chain */
  chain: Chain;
  /** Slow gas price (gwei) */
  slow: number;
  /** Standard gas price (gwei) */
  standard: number;
  /** Fast gas price (gwei) */
  fast: number;
  /** Instant gas price (gwei) */
  instant?: number;
  /** Base fee (for EIP-1559 chains) */
  baseFee?: number;
  /** Last updated timestamp */
  updatedAt: string;
}

/**
 * Token approval info
 */
export interface TokenApproval {
  /** Token being approved */
  token: TokenInfo;
  /** Spender contract address */
  spender: string;
  /** Spender name/protocol */
  spenderName?: string;
  /** Approved amount (raw) */
  allowance: string;
  /** Is unlimited approval */
  isUnlimited: boolean;
  /** Value at risk in USD */
  valueAtRiskUsd?: number;
}

/**
 * API response wrapper
 */
export interface ApiResponse<T> {
  /** Whether the request succeeded */
  success: boolean;
  /** Response data */
  data?: T;
  /** Error message if failed */
  error?: string;
  /** Error code */
  errorCode?: string;
}

/**
 * Pagination params
 */
export interface PaginationParams {
  /** Page number (1-indexed) */
  page?: number;
  /** Items per page */
  limit?: number;
  /** Sort field */
  sortBy?: string;
  /** Sort direction */
  sortOrder?: 'asc' | 'desc';
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  /** Items */
  items: T[];
  /** Total count */
  total: number;
  /** Current page */
  page: number;
  /** Items per page */
  limit: number;
  /** Total pages */
  totalPages: number;
  /** Has more pages */
  hasMore: boolean;
}
