/**
 * DefiLlama API client for DeFi positions
 * Production-ready implementation
 */

import { HttpClient, Cache, RateLimiter, type Chain } from '../lib';

interface DefiLlamaPosition {
  protocol: string;
  name: string;
  category: string;
  chain: string;
  balanceUsd: number;
  rewardUsd?: number;
  debtUsd?: number;
}

interface DefiLlamaProtocol {
  slug: string;
  name: string;
  chain: string;
  category: string;
  tvl: number;
  apy?: number;
}

class DefiLlamaClient {
  private httpClient: HttpClient;
  private cache: Cache;
  private rateLimiter: RateLimiter;

  constructor() {
    this.httpClient = new HttpClient({
      baseUrl: 'https://api.llama.fi',
      timeout: 30000,
    });
    this.cache = new Cache({ defaultTTL: 120 }); // 2 minute cache
    this.rateLimiter = new RateLimiter({
      maxRequests: 10,
      windowMs: 1000,
    });
  }

  async getPositions(address: string): Promise<DefiLlamaPosition[]> {
    const cacheKey = `positions:${address}`;
    const cached = this.cache.get<DefiLlamaPosition[]>(cacheKey);
    if (cached) return cached;

    await this.rateLimiter.waitForRequest();

    try {
      const response = await this.httpClient.get<{
        protocols: DefiLlamaPosition[];
      }>(`/users/${address}`);

      const positions = response.data.protocols || [];
      this.cache.set(cacheKey, positions);
      return positions;
    } catch (error) {
      // DefiLlama might not have data for all addresses
      return [];
    }
  }

  async getProtocols(): Promise<DefiLlamaProtocol[]> {
    const cacheKey = 'protocols';
    const cached = this.cache.get<DefiLlamaProtocol[]>(cacheKey);
    if (cached) return cached;

    await this.rateLimiter.waitForRequest();

    const response = await this.httpClient.get<DefiLlamaProtocol[]>('/protocols');

    this.cache.set(cacheKey, response.data, 300000); // Cache for 5 minutes
    return response.data;
  }

  async getYields(): Promise<Array<{
    pool: string;
    project: string;
    chain: string;
    symbol: string;
    tvlUsd: number;
    apy: number;
    apyBase?: number;
    apyReward?: number;
    stablecoin: boolean;
    ilRisk: string;
  }>> {
    const cacheKey = 'yields';
    const cached = this.cache.get<any[]>(cacheKey);
    if (cached) return cached;

    await this.rateLimiter.waitForRequest();

    const response = await this.httpClient.get<{
      data: Array<{
        pool: string;
        project: string;
        chain: string;
        symbol: string;
        tvlUsd: number;
        apy: number;
        apyBase?: number;
        apyReward?: number;
        stablecoin: boolean;
        ilRisk: string;
      }>;
    }>('/pools');

    this.cache.set(cacheKey, response.data.data, 300000);
    return response.data.data;
  }
}

export const defiLlamaClient = new DefiLlamaClient();
