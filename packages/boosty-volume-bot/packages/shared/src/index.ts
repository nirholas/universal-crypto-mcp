// Cache utilities
export { SimpleCache, createCacheKey } from './cache.js';
// Backwards compatibility aliases
export { SimpleCache as Cache } from './cache.js';
export { createCache, type CacheOptions } from './cache.js';

// Rate limiter
export { 
  RateLimiter, 
  RateLimiterRegistry,
  createRateLimiter,
  type RateLimiterOptions 
} from './rate-limiter.js';

// HTTP client
export {
  fetchWithRetry,
  fetchJson,
  HttpClient,
  createHttpClient,
  type FetchOptions,
  type RetryOptions,
  type HttpClientOptions,
} from './http-client.js';

// Errors
export {
  MCPError,
  RateLimitError,
  APIError,
  ValidationError,
  NetworkError,
  ChainNotSupportedError,
  TokenNotFoundError,
  isMCPError,
  wrapError,
} from './errors.js';

// Types
export type {
  Chain,
  TokenInfo,
  PriceData,
  WalletBalance,
  NFTInfo,
  DeFiPosition,
  YieldOpportunity,
  GasPrices,
  TokenApproval,
  ApiResponse,
  PaginationParams,
  PaginatedResponse,
} from './types.js';

// Constants
export {
  SUPPORTED_CHAINS,
  CHAIN_IDS,
  NATIVE_TOKEN_ADDRESS,
  NATIVE_TOKEN_SYMBOL,
  API_ENDPOINTS,
  RPC_ENDPOINTS,
  BLOCK_EXPLORERS,
  TIMEOUTS,
  CACHE_TTL,
  RATE_LIMITS,
  STABLECOINS_ETH,
  MAX_VALUES,
} from './constants.js';

// Chain utilities (backwards compatibility)
export { 
  SUPPORTED_CHAINS as CHAIN_CONFIGS,
  getChainConfig,
  getChainById,
  getEVMChains,
  isEVMChain,
  CHAIN_NAMES,
  type ChainConfig,
} from './chains.js';

// Formatters
export {
  formatCurrency,
  formatPercentage,
  formatNumber,
  shortenAddress,
  formatRelativeTime,
  formatTokenAmount,
} from './formatters.js';

// Shared interfaces for multi-package integration
export * from './interfaces/index.js';
