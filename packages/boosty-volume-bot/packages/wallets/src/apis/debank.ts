/**
 * DeBank API Client
 * Provides access to portfolio and DeFi position data
 */

import { HttpClient, Cache, type Chain } from '../lib';
import type { DeFiPosition, WalletPortfolio, TokenBalance, DeFiPositionType } from '../types';

const DEBANK_BASE_URL = 'https://pro-openapi.debank.com/v1';

// Chain ID mapping for DeBank API
const DEBANK_CHAIN_IDS: Record<Chain, string> = {
  ethereum: 'eth',
  arbitrum: 'arb',
  polygon: 'matic',
  optimism: 'op',
  base: 'base',
  avalanche: 'avax',
  bsc: 'bsc',
};

interface DeBankTokenBalance {
  id: string;
  chain: string;
  name: string;
  symbol: string;
  decimals: number;
  logo_url?: string;
  price: number;
  amount: number;
  raw_amount: number;
}

interface DeBankProtocol {
  id: string;
  chain: string;
  name: string;
  site_url?: string;
  logo_url?: string;
  portfolio_item_list: DeBankPortfolioItem[];
}

interface DeBankPortfolioItem {
  name: string;
  detail_types: string[];
  detail: {
    supply_token_list?: DeBankTokenBalance[];
    borrow_token_list?: DeBankTokenBalance[];
    reward_token_list?: DeBankTokenBalance[];
  };
  stats: {
    asset_usd_value: number;
    debt_usd_value: number;
    net_usd_value: number;
  };
}

export class DeBankClient {
  private httpClient: HttpClient;
  private cache: Cache;
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.DEBANK_API_KEY || '';
    
    this.httpClient = new HttpClient({
      baseUrl: DEBANK_BASE_URL,
      timeout: 30000,
      headers: {
        'AccessKey': this.apiKey,
      },
    });

    this.cache = new Cache({
      defaultTTL: 60, // 1 minute default
    });
  }

  /**
   * Check if the client is configured with an API key
   */
  isConfigured(): boolean {
    return !!this.apiKey;
  }

  /**
   * Get total portfolio balance for a wallet
   */
  async getPortfolio(address: string, chains?: Chain[]): Promise<WalletPortfolio> {
    const cacheKey = `debank:portfolio:${address}:${chains?.join(',') || 'all'}`;
    
    const cached = this.cache.get<WalletPortfolio>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      // Get total balance
      const balanceResponse = await this.httpClient.get<{ total_usd_value: number }>(
        '/user/total_balance',
        { params: { id: address } }
      );

      // Get token list
      const tokensResponse = await this.httpClient.get<DeBankTokenBalance[]>(
        '/user/all_token_list',
        { params: { id: address, is_all: 'false' } }
      );

      const tokens = tokensResponse.data
        .filter((token: DeBankTokenBalance) => {
          if (!chains) return true;
          const chainId = this.debankChainToChain(token.chain);
          return chainId && chains.includes(chainId);
        })
        .map((token: DeBankTokenBalance) => ({
          symbol: token.symbol,
          balance: token.amount.toString(),
          value: token.amount * token.price,
          chain: this.debankChainToChain(token.chain) || 'ethereum' as Chain,
          address: token.id,
        }))
        .sort((a: { value: number }, b: { value: number }) => b.value - a.value);

      const portfolio: WalletPortfolio = {
        address,
        totalValue: balanceResponse.data.total_usd_value,
        tokens,
        lastUpdated: new Date().toISOString(),
      };

      this.cache.set(cacheKey, portfolio, 60);
      return portfolio;
    } catch (error) {
      throw new Error(`DeBank API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get token balances for a wallet
   */
  async getTokenBalances(address: string, chain?: Chain): Promise<TokenBalance[]> {
    const cacheKey = `debank:balances:${address}:${chain || 'all'}`;
    
    const cached = this.cache.get<TokenBalance[]>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const endpoint = chain 
        ? '/user/token_list'
        : '/user/all_token_list';
      
      const params: Record<string, string> = { id: address };
      if (chain) {
        params.chain_id = DEBANK_CHAIN_IDS[chain] || chain;
      } else {
        params.is_all = 'false';
      }

      const response = await this.httpClient.get<DeBankTokenBalance[]>(endpoint, { params });

      const balances: TokenBalance[] = response.data.map((token: DeBankTokenBalance) => ({
        token: token.id,
        symbol: token.symbol,
        balance: token.amount.toString(),
        decimals: token.decimals,
        value: token.amount * token.price,
        price: token.price,
        chain: this.debankChainToChain(token.chain),
      }));

      this.cache.set(cacheKey, balances, 30);
      return balances;
    } catch (error) {
      throw new Error(`DeBank API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get DeFi positions for a wallet
   */
  async getDeFiPositions(address: string, chains?: Chain[]): Promise<DeFiPosition[]> {
    const cacheKey = `debank:defi:${address}:${chains?.join(',') || 'all'}`;
    
    const cached = this.cache.get<DeFiPosition[]>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const response = await this.httpClient.get<DeBankProtocol[]>(
        '/user/all_complex_protocol_list',
        { params: { id: address } }
      );

      const positions: DeFiPosition[] = [];

      for (const protocol of response.data) {
        const chainId = this.debankChainToChain(protocol.chain);
        
        // Filter by chains if specified
        if (chains && chainId && !chains.includes(chainId)) {
          continue;
        }

        for (const item of protocol.portfolio_item_list) {
          const type = this.mapDeBankTypeToPositionType(item.detail_types);
          const tokens: DeFiPosition['tokens'] = [];

          // Add supply tokens
          if (item.detail.supply_token_list) {
            for (const token of item.detail.supply_token_list) {
              tokens.push({
                symbol: token.symbol,
                balance: token.amount.toString(),
                value: token.amount * token.price,
              });
            }
          }

          // Add borrow tokens (negative values)
          if (item.detail.borrow_token_list) {
            for (const token of item.detail.borrow_token_list) {
              tokens.push({
                symbol: token.symbol,
                balance: `-${token.amount}`,
                value: -(token.amount * token.price),
              });
            }
          }

          positions.push({
            protocol: protocol.name,
            protocolLogo: protocol.logo_url,
            type,
            tokens,
            value: item.stats.net_usd_value,
            chain: chainId || 'ethereum',
          });
        }
      }

      this.cache.set(cacheKey, positions, 120);
      return positions;
    } catch (error) {
      throw new Error(`DeBank API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Convert DeBank chain ID to our Chain type
   */
  private debankChainToChain(debankChain: string): Chain | undefined {
    const mapping: Record<string, Chain> = {
      eth: 'ethereum',
      arb: 'arbitrum',
      matic: 'polygon',
      op: 'optimism',
      base: 'base',
      avax: 'avalanche',
      bsc: 'bsc',
    };
    return mapping[debankChain];
  }

  /**
   * Map DeBank detail types to our DeFi position type
   */
  private mapDeBankTypeToPositionType(detailTypes: string[]): DeFiPositionType {
    if (detailTypes.includes('lending')) return 'lending';
    if (detailTypes.includes('borrowing')) return 'borrowing';
    if (detailTypes.includes('staked')) return 'staking';
    if (detailTypes.includes('liquidity')) return 'liquidity';
    if (detailTypes.includes('farming') || detailTypes.includes('yield')) return 'farming';
    if (detailTypes.includes('vesting')) return 'vesting';
    if (detailTypes.includes('reward')) return 'reward';
    return 'staking'; // Default
  }
}

// Export singleton factory
let debankClientInstance: DeBankClient | null = null;

export function getDeBankClient(): DeBankClient {
  if (!debankClientInstance) {
    debankClientInstance = new DeBankClient();
  }
  return debankClientInstance;
}
