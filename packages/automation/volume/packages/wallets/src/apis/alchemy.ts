/**
 * Alchemy API client for wallet data
 * Production-ready implementation with proper error handling
 */

import { HttpClient, Cache, RateLimiter, type Chain } from '../lib';

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY || '';

if (!ALCHEMY_API_KEY) {
  console.warn('Warning: ALCHEMY_API_KEY not set. Alchemy API calls will fail.');
}

interface AlchemyTokenBalance {
  contractAddress: string;
  tokenBalance: string;
}

interface AlchemyTokenMetadata {
  name: string;
  symbol: string;
  decimals: number;
  logo?: string;
}

interface AlchemyNFT {
  contract: { address: string };
  tokenId: string;
  title: string;
  description: string;
  media: Array<{ gateway: string }>;
  collection?: { name: string };
}

interface AlchemyAssetTransfer {
  hash: string;
  from: string;
  to: string | null;
  value: number | null;
  asset: string;
  category: string;
  blockNum: string;
  metadata: { blockTimestamp: string };
}

const CHAIN_NETWORKS: Record<Chain, string> = {
  ethereum: 'eth-mainnet',
  arbitrum: 'arb-mainnet',
  base: 'base-mainnet',
  polygon: 'polygon-mainnet',
  optimism: 'opt-mainnet',
  avalanche: 'avax-mainnet',
  bsc: 'bnb-mainnet',
};

class AlchemyClient {
  private httpClient: HttpClient;
  private cache: Cache;
  private rateLimiter: RateLimiter;

  constructor() {
    this.httpClient = new HttpClient({
      timeout: 30000,
    });
    this.cache = new Cache({ defaultTTL: 60 }); // 1 minute cache
    this.rateLimiter = new RateLimiter({
      maxRequests: 25,
      windowMs: 1000,
    });
  }

  private getBaseUrl(chain: Chain): string {
    const network = CHAIN_NETWORKS[chain] || 'eth-mainnet';
    return `https://${network}.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;
  }

  async getTokenBalances(
    address: string,
    chain: Chain = 'ethereum'
  ): Promise<Array<{ contractAddress: string; balance: string; metadata?: AlchemyTokenMetadata }>> {
    const cacheKey = `balances:${chain}:${address}`;
    const cached = this.cache.get<Array<{ contractAddress: string; balance: string; metadata?: AlchemyTokenMetadata }>>(cacheKey);
    if (cached) return cached;

    await this.rateLimiter.waitForRequest();

    const baseUrl = this.getBaseUrl(chain);
    const response = await this.httpClient.post<{
      result: { tokenBalances: AlchemyTokenBalance[] };
    }>(`${baseUrl}`, {
      jsonrpc: '2.0',
      id: 1,
      method: 'alchemy_getTokenBalances',
      params: [address, 'erc20'],
    });

    // Filter out zero balances and get metadata
    const nonZeroBalances = response.data.result.tokenBalances.filter(
      (token: AlchemyTokenBalance) => token.tokenBalance !== '0x0' && token.tokenBalance !== '0'
    );

    // Get metadata for each token
    const balancesWithMetadata = await Promise.all(
      nonZeroBalances.slice(0, 50).map(async (token: AlchemyTokenBalance) => {
        try {
          const metadata = await this.getTokenMetadata(token.contractAddress, chain);
          return {
            contractAddress: token.contractAddress,
            balance: token.tokenBalance,
            metadata,
          };
        } catch {
          return {
            contractAddress: token.contractAddress,
            balance: token.tokenBalance,
          };
        }
      })
    );

    this.cache.set(cacheKey, balancesWithMetadata);
    return balancesWithMetadata;
  }

  async getTokenMetadata(contractAddress: string, chain: Chain = 'ethereum'): Promise<AlchemyTokenMetadata> {
    const cacheKey = `metadata:${chain}:${contractAddress}`;
    const cached = this.cache.get<AlchemyTokenMetadata>(cacheKey);
    if (cached) return cached;

    await this.rateLimiter.waitForRequest();

    const baseUrl = this.getBaseUrl(chain);
    const response = await this.httpClient.post<{
      result: AlchemyTokenMetadata;
    }>(`${baseUrl}`, {
      jsonrpc: '2.0',
      id: 1,
      method: 'alchemy_getTokenMetadata',
      params: [contractAddress],
    });

    this.cache.set(cacheKey, response.data.result);
    return response.data.result;
  }

  async getNFTs(
    address: string,
    chain: Chain = 'ethereum'
  ): Promise<AlchemyNFT[]> {
    const cacheKey = `nfts:${chain}:${address}`;
    const cached = this.cache.get<AlchemyNFT[]>(cacheKey);
    if (cached) return cached;

    await this.rateLimiter.waitForRequest();

    const baseUrl = this.getBaseUrl(chain);
    const response = await this.httpClient.get<{
      ownedNfts: AlchemyNFT[];
    }>(`${baseUrl}/getNFTs?owner=${address}&withMetadata=true`);

    this.cache.set(cacheKey, response.data.ownedNfts || []);
    return response.data.ownedNfts || [];
  }

  async getETHBalance(address: string, chain: Chain = 'ethereum'): Promise<string> {
    const cacheKey = `eth:${chain}:${address}`;
    const cached = this.cache.get<string>(cacheKey);
    if (cached) return cached;

    await this.rateLimiter.waitForRequest();

    const baseUrl = this.getBaseUrl(chain);
    const response = await this.httpClient.post<{
      result: string;
    }>(`${baseUrl}`, {
      jsonrpc: '2.0',
      id: 1,
      method: 'eth_getBalance',
      params: [address, 'latest'],
    });

    this.cache.set(cacheKey, response.data.result);
    return response.data.result;
  }

  async getHistory(
    address: string,
    chain: Chain = 'ethereum',
    limit: number = 50
  ): Promise<Array<{
    hash: string;
    type: string;
    from: string;
    to: string;
    value: string;
    timestamp: number;
    status: 'success' | 'failed' | 'pending';
    gasUsed?: string;
    gasPrice?: string;
    blockNumber?: number;
    chain: Chain;
  }>> {
    const cacheKey = `history:${chain}:${address}:${limit}`;
    const cached = this.cache.get<Array<{
      hash: string;
      type: string;
      from: string;
      to: string;
      value: string;
      timestamp: number;
      status: 'success' | 'failed' | 'pending';
      chain: Chain;
    }>>(cacheKey);
    if (cached) return cached;

    await this.rateLimiter.waitForRequest();

    const baseUrl = this.getBaseUrl(chain);
    
    // Get asset transfers using Alchemy's enhanced API
    const response = await this.httpClient.post<{
      result: {
        transfers: Array<{
          hash: string;
          from: string;
          to: string;
          value: number;
          asset: string;
          category: string;
          blockNum: string;
          metadata: { blockTimestamp: string };
        }>;
      };
    }>(`${baseUrl}`, {
      jsonrpc: '2.0',
      id: 1,
      method: 'alchemy_getAssetTransfers',
      params: [{
        fromAddress: address,
        category: ['external', 'erc20', 'erc721', 'erc1155'],
        maxCount: `0x${Math.floor(limit / 2).toString(16)}`,
        order: 'desc',
        withMetadata: true,
      }],
    });

    // Also get incoming transfers
    const incomingResponse = await this.httpClient.post<{
      result: {
        transfers: Array<{
          hash: string;
          from: string;
          to: string;
          value: number;
          asset: string;
          category: string;
          blockNum: string;
          metadata: { blockTimestamp: string };
        }>;
      };
    }>(`${baseUrl}`, {
      jsonrpc: '2.0',
      id: 1,
      method: 'alchemy_getAssetTransfers',
      params: [{
        toAddress: address,
        category: ['external', 'erc20', 'erc721', 'erc1155'],
        maxCount: `0x${Math.floor(limit / 2).toString(16)}`,
        order: 'desc',
        withMetadata: true,
      }],
    });

    // Combine and sort by timestamp
    const allTransfers = [
      ...(response.data.result?.transfers || []),
      ...(incomingResponse.data.result?.transfers || []),
    ];

    // Deduplicate by hash and sort by timestamp
    const uniqueTransfers = Array.from(
      new Map(allTransfers.map(t => [t.hash, t])).values()
    ).sort((a, b) => {
      const timeA = new Date(a.metadata?.blockTimestamp || 0).getTime();
      const timeB = new Date(b.metadata?.blockTimestamp || 0).getTime();
      return timeB - timeA;
    }).slice(0, limit);

    const transactions = uniqueTransfers.map(transfer => ({
      hash: transfer.hash,
      type: this.mapCategoryToType(transfer.category),
      from: transfer.from,
      to: transfer.to || '',
      value: transfer.value?.toString() || '0',
      timestamp: new Date(transfer.metadata?.blockTimestamp || 0).getTime(),
      status: 'success' as const,
      blockNumber: parseInt(transfer.blockNum, 16),
      chain,
    }));

    this.cache.set(cacheKey, transactions);
    return transactions;
  }

  private mapCategoryToType(category: string): string {
    const mapping: Record<string, string> = {
      external: 'transfer',
      erc20: 'transfer',
      erc721: 'transfer',
      erc1155: 'transfer',
      internal: 'contract_interaction',
    };
    return mapping[category] || 'unknown';
  }
}

export const alchemyClient = new AlchemyClient();
export { AlchemyClient };

export function getAlchemyClient(): AlchemyClient {
  return alchemyClient;
}
