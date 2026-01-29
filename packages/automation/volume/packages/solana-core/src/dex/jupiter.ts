/**
 * Jupiter Aggregator Integration
 * Real-time swap quotes and route finding via Jupiter API
 */

import { PublicKey, VersionedTransaction } from '@solana/web3.js';
import { logger } from '../utils/logger.js';

const JUPITER_API_URL = 'https://quote-api.jup.ag/v6';
const JUPITER_PRICE_API_URL = 'https://price.jup.ag/v6';
const JUPITER_TOKEN_LIST_URL = 'https://token.jup.ag/all';
const JUPITER_LIMIT_ORDER_URL = 'https://jup.ag/api/limit/v1';

// Well-known token mints - comprehensive list
export const TOKEN_MINTS = {
  // Native & Wrapped
  SOL: 'So11111111111111111111111111111111111111112',
  WSOL: 'So11111111111111111111111111111111111111112',
  // Stablecoins
  USDC: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  USDT: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
  PYUSD: '2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo',
  DAI: 'EjmyN6qEC1Tf1JxiG1ae7UTJhUxSwk1TCCyiC4J9hN7f',
  USDD: '4TUNzC3rhnQa3RHqPkRqY7Y3k4vSjLKgPpJY9UJCDF5B',
  // Memecoins
  BONK: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
  WIF: 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm',
  POPCAT: '7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr',
  MEW: 'MEW1gQWJ3nEXg2qgERiKu7FAFj79PHvQVREQUzScPP5',
  PNUT: '2qEHjDLDLbuBgRYvsxhc5D6uDWAivNFZGan56P1tpump',
  FWOG: 'A8C3xuqscfmyLrte3VmTqrAq8kgMASius9AFNANwpump',
  GOAT: 'CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump',
  // DeFi Tokens
  JUP: 'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN',
  RAY: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R',
  ORCA: 'orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE',
  MNDE: 'MNDEFzGvMt87ueuHvVU9VcTqsAP5b3fTGPsHuuPA5ey',
  DRIFT: 'DriFtupJYLTosbwoN8koMbEYSx54aFAVLddWsbksjwg7',
  TENSOR: 'TNSRxcUxoT9xBG3de7PiJyTDYu7kskLqcpddxnEJAS6',
  // Liquid Staking
  MSOL: 'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So',
  JITOSOL: 'J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn',
  BSOL: 'bSo13r4TkiE4KumL71LsHTPpL2euBYLFx6h9HP3piy1',
  STSOL: '7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trKn1Y7ARj',
  INF: '5oVNBeEEQvYi1cX3ir8Dx5n1P7pdxydbGF2X4TxVusJm',
  // Infrastructure
  PYTH: 'HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3',
  RENDER: 'rndrizKT3MK1iimdxRdWabcF7Zg7AR5T4nud4EkHBof',
  HNT: 'hntyVP6YFm1Hg25TN9WGLqM12b8TQmcknKrdu1oxWux',
  MOBILE: 'mb1eu7TzEc71KxDpsmsKoucSSuuoGLv1drys1oP2jh6',
  IOT: 'iotEVVZLEywoTn1QdwNPddxPWszn3zFhEot3MfL9fns',
  // AI Tokens
  AI16Z: 'HeLp6NuQkmYB4pYWo2zYs22mESHXPQYzXbB8n4V98jwC',
  GRIFFAIN: 'KENJSUYLASHUMfHyy5o4Hp2FdNqZg1AsUPhfH2kYvEP',
  VIRTUAL: 'ED5nyyWEzpPPiWimP8vYm7sD7TD3LAt3Q3gRTWHzPJBY',
  ZEREBRO: 'ZEREBroW1YuoZZHQxpFZJH9Q9qvDjvLM9noW6sPBKdu',
} as const;

export interface TokenInfo {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  logoURI?: string;
  tags?: string[];
  daily_volume?: number;
}

export interface LimitOrder {
  publicKey: string;
  account: {
    maker: string;
    inputMint: string;
    outputMint: string;
    makingAmount: string;
    takingAmount: string;
    expiredAt: number | null;
    feeBps: number;
  };
}

export interface SwapQuote {
  inputMint: string;
  outputMint: string;
  inputAmount: string;
  outputAmount: string;
  otherAmountThreshold: string;
  swapMode: 'ExactIn' | 'ExactOut';
  slippageBps: number;
  priceImpactPct: number;
  routePlan: RoutePlan[];
  contextSlot: number;
  timeTaken: number;
}

export interface RoutePlan {
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
  percent: number;
}

export interface TokenPrice {
  id: string;
  mintSymbol: string;
  vsToken: string;
  vsTokenSymbol: string;
  price: number;
  confidence?: number;
}

export interface SwapParams {
  inputMint: string;
  outputMint: string;
  amount: bigint;
  slippageBps?: number;
  swapMode?: 'ExactIn' | 'ExactOut';
  userPublicKey: PublicKey;
  onlyDirectRoutes?: boolean;
  asLegacyTransaction?: boolean;
  maxAccounts?: number;
}

export class JupiterClient {
  private readonly apiUrl: string;
  private readonly priceApiUrl: string;
  private priceCache: Map<string, { price: TokenPrice; timestamp: number }> = new Map();
  private readonly cacheTtlMs: number = 10000; // 10 seconds

  constructor(apiUrl?: string, priceApiUrl?: string) {
    this.apiUrl = apiUrl || JUPITER_API_URL;
    this.priceApiUrl = priceApiUrl || JUPITER_PRICE_API_URL;
    
    logger.info('Jupiter client initialized');
  }

  /**
   * Get swap quote from Jupiter
   */
  async getQuote(params: {
    inputMint: string;
    outputMint: string;
    amount: string;
    slippageBps?: number;
    swapMode?: 'ExactIn' | 'ExactOut';
    onlyDirectRoutes?: boolean;
    maxAccounts?: number;
  }): Promise<SwapQuote> {
    const queryParams = new URLSearchParams({
      inputMint: params.inputMint,
      outputMint: params.outputMint,
      amount: params.amount,
      slippageBps: String(params.slippageBps || 50),
      swapMode: params.swapMode || 'ExactIn',
    });

    if (params.onlyDirectRoutes) {
      queryParams.set('onlyDirectRoutes', 'true');
    }
    if (params.maxAccounts) {
      queryParams.set('maxAccounts', String(params.maxAccounts));
    }

    const response = await fetch(`${this.apiUrl}/quote?${queryParams}`);
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Jupiter quote failed: ${error}`);
    }

    const quote = await response.json() as SwapQuote;
    
    logger.debug('Jupiter quote received', {
      inputMint: params.inputMint.slice(0, 8),
      outputMint: params.outputMint.slice(0, 8),
      inputAmount: params.amount,
      outputAmount: quote.outputAmount,
      priceImpact: quote.priceImpactPct,
    });

    return quote;
  }

  /**
   * Get swap transaction from Jupiter
   */
  async getSwapTransaction(
    quote: SwapQuote,
    userPublicKey: PublicKey,
    options?: {
      wrapAndUnwrapSol?: boolean;
      computeUnitPriceMicroLamports?: number;
      asLegacyTransaction?: boolean;
      dynamicComputeUnitLimit?: boolean;
    }
  ): Promise<VersionedTransaction> {
    const response = await fetch(`${this.apiUrl}/swap`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        quoteResponse: quote,
        userPublicKey: userPublicKey.toBase58(),
        wrapAndUnwrapSol: options?.wrapAndUnwrapSol ?? true,
        computeUnitPriceMicroLamports: options?.computeUnitPriceMicroLamports,
        asLegacyTransaction: options?.asLegacyTransaction ?? false,
        dynamicComputeUnitLimit: options?.dynamicComputeUnitLimit ?? true,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Jupiter swap transaction failed: ${error}`);
    }

    const { swapTransaction } = await response.json() as { swapTransaction: string };
    
    // Decode the transaction
    const transactionBuffer = Buffer.from(swapTransaction, 'base64');
    const transaction = VersionedTransaction.deserialize(transactionBuffer);

    return transaction;
  }

  /**
   * Get token price from Jupiter
   */
  async getPrice(mintAddress: string, vsToken: string = TOKEN_MINTS.USDC): Promise<TokenPrice | null> {
    const cacheKey = `${mintAddress}-${vsToken}`;
    const cached = this.priceCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTtlMs) {
      return cached.price;
    }

    try {
      const response = await fetch(
        `${this.priceApiUrl}/price?ids=${mintAddress}&vsToken=${vsToken}`
      );

      if (!response.ok) {
        return null;
      }

      const data = await response.json() as { data: Record<string, TokenPrice> };
      const price = data.data[mintAddress];

      if (price) {
        this.priceCache.set(cacheKey, { price, timestamp: Date.now() });
      }

      return price || null;
    } catch (error) {
      logger.debug('Failed to get Jupiter price', { mintAddress, error: (error as Error).message });
      return null;
    }
  }

  /**
   * Get prices for multiple tokens
   */
  async getPrices(mintAddresses: string[], vsToken: string = TOKEN_MINTS.USDC): Promise<Map<string, TokenPrice>> {
    const results = new Map<string, TokenPrice>();
    const toFetch: string[] = [];

    // Check cache first
    for (const mint of mintAddresses) {
      const cacheKey = `${mint}-${vsToken}`;
      const cached = this.priceCache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < this.cacheTtlMs) {
        results.set(mint, cached.price);
      } else {
        toFetch.push(mint);
      }
    }

    if (toFetch.length === 0) {
      return results;
    }

    try {
      const response = await fetch(
        `${this.priceApiUrl}/price?ids=${toFetch.join(',')}&vsToken=${vsToken}`
      );

      if (response.ok) {
        const data = await response.json() as { data: Record<string, TokenPrice> };
        
        for (const [mint, price] of Object.entries(data.data)) {
          if (price) {
            results.set(mint, price);
            this.priceCache.set(`${mint}-${vsToken}`, { price, timestamp: Date.now() });
          }
        }
      }
    } catch (error) {
      logger.debug('Failed to get Jupiter prices', { error: (error as Error).message });
    }

    return results;
  }

  /**
   * Resolve token symbol to mint address
   */
  resolveTokenMint(symbolOrMint: string): string {
    const upperSymbol = symbolOrMint.toUpperCase();
    
    // Check if it's a known symbol
    if (upperSymbol in TOKEN_MINTS) {
      return TOKEN_MINTS[upperSymbol as keyof typeof TOKEN_MINTS];
    }
    
    // Assume it's already a mint address
    return symbolOrMint;
  }

  /**
   * Get a simple swap quote with human-readable amounts
   */
  async getSimpleQuote(params: {
    inputToken: string;
    outputToken: string;
    amount: number;
    inputDecimals?: number;
    slippageBps?: number;
  }): Promise<{
    inputAmount: number;
    outputAmount: number;
    priceImpactPct: number;
    route: string[];
    minimumReceived: number;
  }> {
    const inputMint = this.resolveTokenMint(params.inputToken);
    const outputMint = this.resolveTokenMint(params.outputToken);
    const decimals = params.inputDecimals || 9;
    
    const amountRaw = BigInt(Math.floor(params.amount * Math.pow(10, decimals)));
    
    const quote = await this.getQuote({
      inputMint,
      outputMint,
      amount: amountRaw.toString(),
      slippageBps: params.slippageBps,
    });

    // Get output decimals from route
    const outputDecimals = 9; // Default, ideally fetch from token metadata

    const outputAmount = Number(quote.outputAmount) / Math.pow(10, outputDecimals);
    const minimumReceived = Number(quote.otherAmountThreshold) / Math.pow(10, outputDecimals);

    return {
      inputAmount: params.amount,
      outputAmount,
      priceImpactPct: quote.priceImpactPct,
      route: quote.routePlan.map(r => r.swapInfo.label),
      minimumReceived,
    };
  }

  /**
   * Fetch tradeable token list from Jupiter
   */
  async getTokenList(options?: { 
    strict?: boolean;
    minDailyVolume?: number;
  }): Promise<TokenInfo[]> {
    try {
      const url = options?.strict 
        ? 'https://token.jup.ag/strict'
        : JUPITER_TOKEN_LIST_URL;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch token list');
      }

      const tokens = await response.json() as TokenInfo[];
      
      // Filter by daily volume if specified
      if (options?.minDailyVolume) {
        return tokens.filter(t => 
          (t.daily_volume || 0) >= options.minDailyVolume!
        );
      }
      
      return tokens;
    } catch (error) {
      logger.error('Failed to fetch Jupiter token list', { error: (error as Error).message });
      return [];
    }
  }

  /**
   * Search for tokens by name or symbol
   */
  async searchTokens(query: string, limit: number = 20): Promise<TokenInfo[]> {
    const tokens = await this.getTokenList({ strict: true });
    const lowerQuery = query.toLowerCase();
    
    return tokens
      .filter(t => 
        t.symbol.toLowerCase().includes(lowerQuery) ||
        t.name.toLowerCase().includes(lowerQuery) ||
        t.address === query
      )
      .slice(0, limit);
  }

  /**
   * Get open limit orders for a wallet
   */
  async getOpenOrders(walletAddress: string): Promise<LimitOrder[]> {
    try {
      const response = await fetch(
        `${JUPITER_LIMIT_ORDER_URL}/openOrders?wallet=${walletAddress}`
      );
      
      if (!response.ok) {
        return [];
      }

      const orders = await response.json() as LimitOrder[];
      return orders;
    } catch (error) {
      logger.debug('Failed to fetch limit orders', { error: (error as Error).message });
      return [];
    }
  }

  /**
   * Get order history for a wallet
   */
  async getOrderHistory(walletAddress: string): Promise<LimitOrder[]> {
    try {
      const response = await fetch(
        `${JUPITER_LIMIT_ORDER_URL}/orderHistory?wallet=${walletAddress}`
      );
      
      if (!response.ok) {
        return [];
      }

      return await response.json() as LimitOrder[];
    } catch (error) {
      logger.debug('Failed to fetch order history', { error: (error as Error).message });
      return [];
    }
  }

  /**
   * Get trading volume statistics for a token
   */
  async getTokenStats(mint: string): Promise<{
    volume24h: number;
    priceChange24h: number;
    liquidity: number;
  } | null> {
    try {
      // Use DexScreener API for comprehensive stats
      const response = await fetch(
        `https://api.dexscreener.com/latest/dex/tokens/${mint}`
      );
      
      if (!response.ok) return null;

      const data = await response.json() as {
        pairs?: Array<{
          volume: { h24: number };
          priceChange: { h24: number };
          liquidity: { usd: number };
        }>;
      };
      
      if (!data.pairs || data.pairs.length === 0) return null;

      // Aggregate across all pairs
      const stats = data.pairs.reduce((acc, pair) => ({
        volume24h: acc.volume24h + (pair.volume?.h24 || 0),
        priceChange24h: pair.priceChange?.h24 || acc.priceChange24h,
        liquidity: acc.liquidity + (pair.liquidity?.usd || 0),
      }), { volume24h: 0, priceChange24h: 0, liquidity: 0 });

      return stats;
    } catch (error) {
      logger.debug('Failed to fetch token stats', { mint, error: (error as Error).message });
      return null;
    }
  }

  /**
   * Get trending tokens from Jupiter
   */
  async getTrendingTokens(limit: number = 10): Promise<Array<{
    mint: string;
    symbol: string;
    volume24h: number;
  }>> {
    try {
      // Use Birdeye API for trending data
      const response = await fetch(
        `https://public-api.birdeye.so/defi/token_trending?sort_by=volume24hUSD&sort_type=desc&limit=${limit}`,
        {
          headers: {
            'X-API-KEY': process.env.BIRDEYE_API_KEY || 'public',
          }
        }
      );
      
      if (!response.ok) return [];

      const data = await response.json() as {
        data?: { items?: Array<{
          address: string;
          symbol: string;
          volume24hUSD: number;
        }> };
      };
      
      return (data.data?.items || []).map(item => ({
        mint: item.address,
        symbol: item.symbol,
        volume24h: item.volume24hUSD,
      }));
    } catch (error) {
      logger.debug('Failed to fetch trending tokens', { error: (error as Error).message });
      return [];
    }
  }

  /**
   * Clear price cache
   */
  clearCache(): void {
    this.priceCache.clear();
  }
}

/**
 * Create Jupiter client
 */
export function createJupiterClient(): JupiterClient {
  return new JupiterClient();
}

