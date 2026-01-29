import { TokenInfo, PriceData } from '../types.js';
import { logger } from '../utils/logger.js';

export class TokenScanner {
  private dexscreenerCache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly CACHE_TTL = 60000; // 1 minute

  async scanTrendingTokens(chain: 'bsc' | 'solana' | 'ethereum', limit: number = 20): Promise<TokenInfo[]> {
    try {
      logger.info(`Scanning trending tokens on ${chain}...`);

      // Use DexScreener API to find trending tokens
      const response = await fetch(`https://api.dexscreener.com/latest/dex/search?q=${chain}`);
      const data = await response.json();

      if (!data.pairs || data.pairs.length === 0) {
        logger.warn(`No pairs found on ${chain}`);
        return [];
      }

      // Filter and sort by volume and liquidity
      const tokens = data.pairs
        .filter((pair: any) => {
          return (
            pair.liquidity?.usd > 10000 &&
            pair.volume?.h24 > 5000 &&
            pair.priceChange?.h24 !== undefined
          );
        })
        .sort((a: any, b: any) => {
          // Sort by combination of volume and price change
          const scoreA = (a.volume?.h24 || 0) * (1 + Math.abs(a.priceChange?.h24 || 0) / 100);
          const scoreB = (b.volume?.h24 || 0) * (1 + Math.abs(b.priceChange?.h24 || 0) / 100);
          return scoreB - scoreA;
        })
        .slice(0, limit)
        .map((pair: any) => this.pairToTokenInfo(pair, chain));

      logger.info(`Found ${tokens.length} trending tokens on ${chain}`);
      return tokens;
    } catch (error) {
      logger.error(`Failed to scan trending tokens on ${chain}:`, error);
      return [];
    }
  }

  async getTokenInfo(address: string, chain: string): Promise<TokenInfo | null> {
    try {
      const cacheKey = `${chain}:${address}`;
      const cached = this.dexscreenerCache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
        return this.pairToTokenInfo(cached.data, chain);
      }

      const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${address}`);
      const data = await response.json();

      if (!data.pairs || data.pairs.length === 0) {
        return null;
      }

      const mainPair = data.pairs[0];
      this.dexscreenerCache.set(cacheKey, { data: mainPair, timestamp: Date.now() });

      return this.pairToTokenInfo(mainPair, chain);
    } catch (error) {
      logger.error(`Failed to get token info for ${address}:`, error);
      return null;
    }
  }

  async getTokenPrice(address: string, chain: string): Promise<PriceData | null> {
    try {
      const cacheKey = `${chain}:${address}`;
      const cached = this.dexscreenerCache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
        return this.pairToPriceData(cached.data);
      }

      const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${address}`);
      const data = await response.json();

      if (!data.pairs || data.pairs.length === 0) {
        return null;
      }

      const mainPair = data.pairs[0];
      this.dexscreenerCache.set(cacheKey, { data: mainPair, timestamp: Date.now() });

      return this.pairToPriceData(mainPair);
    } catch (error) {
      logger.error(`Failed to get token price for ${address}:`, error);
      return null;
    }
  }

  private pairToTokenInfo(pair: any, chain: string): TokenInfo {
    return {
      address: pair.baseToken.address,
      symbol: pair.baseToken.symbol,
      name: pair.baseToken.name,
      decimals: 18, // Default, will be fetched from contract
      chain,
    };
  }

  private pairToPriceData(pair: any): PriceData {
    return {
      price: parseFloat(pair.priceUsd || pair.priceNative || 0),
      volume24h: parseFloat(pair.volume?.h24 || 0),
      liquidity: parseFloat(pair.liquidity?.usd || 0),
      priceChange24h: parseFloat(pair.priceChange?.h24 || 0),
      timestamp: Date.now(),
    };
  }

  clearCache(): void {
    this.dexscreenerCache.clear();
  }
}

export const tokenScanner = new TokenScanner();
