/**
 * Multi-chain Gas Price Fetcher
 * 
 * Production-ready gas price fetcher supporting multiple EVM chains.
 * Uses block explorer APIs with RPC fallback for reliability.
 * 
 * Supported Chains:
 * - Ethereum (mainnet)
 * - Arbitrum One
 * - Base
 * - Polygon (PoS)
 * - Optimism
 * - Avalanche C-Chain
 */

import {
  SimpleCache,
  RateLimiter,
  HttpClient,
  ChainNotSupportedError,
  APIError,
} from '@boosty/mcp-shared';

// ============================================================================
// Types & Interfaces
// ============================================================================

export interface GasPrice {
  chain: string;
  chainId: number;
  low: number;
  medium: number;
  high: number;
  baseFee?: number;
  timestamp: string;
  unit: string;
}

interface ChainConfig {
  name: string;
  chainId: number;
  rpcUrl: string;
  explorerApiUrl?: string;
  explorerApiKeyEnv?: string;
  unit: string;
  isL2?: boolean;
}

interface ExplorerGasResponse {
  status: string;
  message: string;
  result: {
    LastBlock?: string;
    SafeGasPrice?: string;
    ProposeGasPrice?: string;
    FastGasPrice?: string;
    suggestBaseFee?: string;
    gasUsedRatio?: string;
  } | string;
}

interface RpcResponse<T> {
  jsonrpc: string;
  id: number;
  result: T;
  error?: {
    code: number;
    message: string;
  };
}

// ============================================================================
// Chain Configurations
// ============================================================================

const CHAIN_CONFIGS: Record<string, ChainConfig> = {
  ethereum: {
    name: 'Ethereum',
    chainId: 1,
    rpcUrl: process.env.ETHEREUM_RPC_URL || 'https://eth.llamarpc.com',
    explorerApiUrl: 'https://api.etherscan.io/api',
    explorerApiKeyEnv: 'ETHERSCAN_API_KEY',
    unit: 'gwei',
  },
  arbitrum: {
    name: 'Arbitrum One',
    chainId: 42161,
    rpcUrl: process.env.ARBITRUM_RPC_URL || 'https://arb1.arbitrum.io/rpc',
    explorerApiUrl: 'https://api.arbiscan.io/api',
    explorerApiKeyEnv: 'ARBISCAN_API_KEY',
    unit: 'gwei',
    isL2: true,
  },
  base: {
    name: 'Base',
    chainId: 8453,
    rpcUrl: process.env.BASE_RPC_URL || 'https://mainnet.base.org',
    explorerApiUrl: 'https://api.basescan.org/api',
    explorerApiKeyEnv: 'BASESCAN_API_KEY',
    unit: 'gwei',
    isL2: true,
  },
  polygon: {
    name: 'Polygon',
    chainId: 137,
    rpcUrl: process.env.POLYGON_RPC_URL || 'https://polygon-rpc.com',
    explorerApiUrl: 'https://api.polygonscan.com/api',
    explorerApiKeyEnv: 'POLYGONSCAN_API_KEY',
    unit: 'gwei',
  },
  optimism: {
    name: 'Optimism',
    chainId: 10,
    rpcUrl: process.env.OPTIMISM_RPC_URL || 'https://mainnet.optimism.io',
    explorerApiUrl: 'https://api-optimistic.etherscan.io/api',
    explorerApiKeyEnv: 'OPTIMISM_API_KEY',
    unit: 'gwei',
    isL2: true,
  },
  avalanche: {
    name: 'Avalanche C-Chain',
    chainId: 43114,
    rpcUrl: process.env.AVALANCHE_RPC_URL || 'https://api.avax.network/ext/bc/C/rpc',
    explorerApiUrl: 'https://api.snowtrace.io/api',
    explorerApiKeyEnv: 'SNOWTRACE_API_KEY',
    unit: 'nAVAX',
  },
};

// ============================================================================
// Gas Fetcher Implementation
// ============================================================================

export class GasFetcher {
  private cache: SimpleCache<GasPrice>;
  private rateLimiter: RateLimiter;

  constructor() {
    // Cache with 10 second TTL for gas prices
    this.cache = new SimpleCache(10_000, 50);
    
    // Rate limiter: 1 token/sec = 60/min
    this.rateLimiter = new RateLimiter({
      maxTokens: 15,
      refillRate: 1,
      initialTokens: 15,
    });
  }

  /**
   * Convert wei to gwei
   */
  private weiToGwei(wei: bigint): number {
    return Number(wei) / 1e9;
  }

  /**
   * Parse hex string to bigint
   */
  private hexToBigInt(hex: string): bigint {
    return BigInt(hex);
  }

  /**
   * Fetch gas price via JSON-RPC
   */
  private async fetchGasViaRpc(
    rpcUrl: string
  ): Promise<{ gasPrice: bigint; baseFee?: bigint }> {
    const client = new HttpClient({ baseUrl: rpcUrl, timeout: 10_000 });

    // Fetch current gas price
    const gasPriceResponse = await client.post<RpcResponse<string>>('', {
      jsonrpc: '2.0',
      method: 'eth_gasPrice',
      params: [],
      id: 1,
    });

    if (gasPriceResponse.error) {
      throw new APIError(`RPC error: ${gasPriceResponse.error.message}`, {
        endpoint: rpcUrl,
        details: gasPriceResponse.error,
      });
    }

    const gasPrice = this.hexToBigInt(gasPriceResponse.result);

    // Try to get base fee from latest block (EIP-1559)
    let baseFee: bigint | undefined;
    try {
      const blockResponse = await client.post<RpcResponse<{ baseFeePerGas?: string } | null>>(
        '',
        {
          jsonrpc: '2.0',
          method: 'eth_getBlockByNumber',
          params: ['latest', false],
          id: 2,
        }
      );

      if (blockResponse.result?.baseFeePerGas) {
        baseFee = this.hexToBigInt(blockResponse.result.baseFeePerGas);
      }
    } catch {
      // Base fee not available on all chains/blocks
    }

    return { gasPrice, baseFee };
  }

  /**
   * Fetch gas oracle from block explorer API
   */
  private async fetchGasViaExplorer(
    config: ChainConfig
  ): Promise<{ low: number; medium: number; high: number; baseFee?: number } | null> {
    if (!config.explorerApiUrl) return null;

    const apiKey = config.explorerApiKeyEnv
      ? process.env[config.explorerApiKeyEnv]
      : undefined;

    try {
      const client = new HttpClient({ baseUrl: config.explorerApiUrl, timeout: 10_000 });
      
      const queryParams = new URLSearchParams({
        module: 'gastracker',
        action: 'gasoracle',
      });
      
      if (apiKey) {
        queryParams.append('apikey', apiKey);
      }

      const response = await client.get<ExplorerGasResponse>(`?${queryParams.toString()}`);

      if (response.status === '1' && typeof response.result === 'object') {
        const result = response.result;
        
        // Parse gas prices (they come as strings)
        const low = parseFloat(result.SafeGasPrice || '0');
        const medium = parseFloat(result.ProposeGasPrice || '0');
        const high = parseFloat(result.FastGasPrice || '0');
        const baseFee = result.suggestBaseFee 
          ? parseFloat(result.suggestBaseFee) 
          : undefined;

        // Validate we got real data
        if (low > 0 || medium > 0 || high > 0) {
          return { low, medium, high, baseFee };
        }
      }
    } catch (error) {
      // Explorer API failed, will fallback to RPC
      console.warn(`Explorer API failed for ${config.name}:`, error);
    }

    return null;
  }

  /**
   * Get gas prices for a specific chain
   * 
   * @param chain - Chain identifier (e.g., 'ethereum', 'arbitrum')
   * @returns Gas price data
   * @throws ChainNotSupportedError if chain is not supported
   */
  async getGasPrice(chain: string): Promise<GasPrice> {
    const normalizedChain = chain.toLowerCase().trim();
    const config = CHAIN_CONFIGS[normalizedChain];

    if (!config) {
      throw new ChainNotSupportedError(chain, Object.keys(CHAIN_CONFIGS));
    }

    // Check cache
    const cacheKey = `gas:${normalizedChain}`;
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;

    await this.rateLimiter.acquire();

    // Try explorer API first (more detailed gas tiers)
    const explorerData = await this.fetchGasViaExplorer(config);

    if (explorerData) {
      const result: GasPrice = {
        chain: config.name,
        chainId: config.chainId,
        low: Math.round(explorerData.low * 100) / 100,
        medium: Math.round(explorerData.medium * 100) / 100,
        high: Math.round(explorerData.high * 100) / 100,
        baseFee: explorerData.baseFee 
          ? Math.round(explorerData.baseFee * 100) / 100 
          : undefined,
        timestamp: new Date().toISOString(),
        unit: config.unit,
      };

      this.cache.set(cacheKey, result, 10_000);
      return result;
    }

    // Fallback to RPC
    const rpcData = await this.fetchGasViaRpc(config.rpcUrl);
    const gasPriceGwei = this.weiToGwei(rpcData.gasPrice);

    // Estimate tiers from current gas price
    // L2s typically have more stable gas, so smaller spreads
    const spreadMultiplier = config.isL2 ? 0.1 : 0.2;

    const result: GasPrice = {
      chain: config.name,
      chainId: config.chainId,
      low: Math.round(gasPriceGwei * (1 - spreadMultiplier) * 100) / 100,
      medium: Math.round(gasPriceGwei * 100) / 100,
      high: Math.round(gasPriceGwei * (1 + spreadMultiplier) * 100) / 100,
      baseFee: rpcData.baseFee 
        ? Math.round(this.weiToGwei(rpcData.baseFee) * 100) / 100 
        : undefined,
      timestamp: new Date().toISOString(),
      unit: config.unit,
    };

    this.cache.set(cacheKey, result, 10_000);
    return result;
  }

  /**
   * Get gas prices for all supported chains
   * 
   * @returns Array of gas prices for all chains
   */
  async getAllGasPrices(): Promise<GasPrice[]> {
    const chains = Object.keys(CHAIN_CONFIGS);
    const results: GasPrice[] = [];
    const errors: Array<{ chain: string; error: string }> = [];

    // Fetch all chains in parallel
    const promises = chains.map(async (chain) => {
      try {
        return await this.getGasPrice(chain);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        errors.push({ chain, error: errorMessage });
        return null;
      }
    });

    const responses = await Promise.all(promises);
    
    for (const response of responses) {
      if (response) {
        results.push(response);
      }
    }

    // Log errors for monitoring but don't fail
    if (errors.length > 0) {
      console.warn('Failed to fetch gas for some chains:', errors);
    }

    return results;
  }

  /**
   * Get list of supported chain identifiers
   */
  getSupportedChains(): string[] {
    return Object.keys(CHAIN_CONFIGS);
  }

  /**
   * Get chain configuration
   */
  getChainConfig(chain: string): ChainConfig | undefined {
    return CHAIN_CONFIGS[chain.toLowerCase().trim()];
  }

  /**
   * Clear cached gas prices
   */
  clearCache(): void {
    this.cache.clear();
  }
}

// ============================================================================
// Singleton Instance
// ============================================================================

let fetcherInstance: GasFetcher | null = null;

/**
 * Get or create the GasFetcher singleton
 */
export function getGasFetcher(): GasFetcher {
  if (!fetcherInstance) {
    fetcherInstance = new GasFetcher();
  }
  return fetcherInstance;
}

/**
 * Reset the fetcher singleton (useful for testing)
 */
export function resetGasFetcher(): void {
  fetcherInstance = null;
}

// Convenience export
export const gasFetcher = {
  getGasPrice: (chain: string) => getGasFetcher().getGasPrice(chain),
  getAllGasPrices: () => getGasFetcher().getAllGasPrices(),
  getSupportedChains: () => getGasFetcher().getSupportedChains(),
};
