/**
 * Internal library exports
 */

export { HttpClient, createHttpClient, type HttpClientConfig, type HttpResponse } from './http-client';
export { Cache, createCache, type CacheConfig } from './cache';
export { RateLimiter, createRateLimiter, type RateLimiterConfig } from './rate-limiter';

// Chain types
export type Chain = 'ethereum' | 'arbitrum' | 'polygon' | 'optimism' | 'base' | 'avalanche' | 'bsc';

export const CHAIN_IDS: Record<Chain, number> = {
  ethereum: 1,
  arbitrum: 42161,
  polygon: 137,
  optimism: 10,
  base: 8453,
  avalanche: 43114,
  bsc: 56,
};
