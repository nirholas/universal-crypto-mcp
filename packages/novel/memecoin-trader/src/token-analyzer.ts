import { PublicKey } from '@solana/web3.js';
import type { SolanaClient } from './solana-client';
import type { TokenInfo, RugAnalysis, SocialMetrics } from './types';
import axios from 'axios';

const HELIUS_API = process.env.HELIUS_API_KEY || '';
const BIRDEYE_API = process.env.BIRDEYE_API_KEY || '';

export class TokenAnalyzer {
  private solana: SolanaClient;

  constructor(solanaClient: SolanaClient) {
    this.solana = solanaClient;
  }

  async analyzeToken(mint: string): Promise<{
    info: TokenInfo | null;
    rugAnalysis: RugAnalysis;
    social: SocialMetrics;
  }> {
    const [info, rugAnalysis, social] = await Promise.all([
      this.getTokenInfo(mint),
      this.analyzeRugRisk(mint),
      this.getSocialMetrics(mint),
    ]);

    return { info, rugAnalysis, social };
  }

  async getTokenInfo(mint: string): Promise<TokenInfo | null> {
    try {
      const response = await axios.get(
        `https://api.birdeye.so/defi/token_overview`,
        {
          headers: { 'X-API-KEY': BIRDEYE_API },
          params: { address: mint },
        }
      );

      const data = response.data.data;
      return {
        mint,
        symbol: data.symbol || 'UNKNOWN',
        name: data.name || 'Unknown',
        decimals: data.decimals || 9,
        totalSupply: data.supply || 0,
        price: data.price || 0,
        priceChange24h: data.priceChange24h || 0,
        volume24h: data.volume24h || 0,
        liquidity: data.liquidity || 0,
        marketCap: data.mc || 0,
        holders: data.holder || 0,
        createdAt: data.createdAt || Date.now(),
      };
    } catch (error) {
      console.error('Error fetching token info:', error);
      return null;
    }
  }

  async analyzeRugRisk(mint: string): Promise<RugAnalysis> {
    const analysis: RugAnalysis = {
      riskScore: 0,
      liquidityLocked: false,
      lpBurnPercentage: 0,
      topHoldersPercentage: 0,
      creatorBalance: 0,
      contractVerified: false,
      suspiciousActivity: [],
    };

    try {
      // Get token holders
      const holders = await this.getTopHolders(mint);
      
      if (holders.length > 0) {
        const topHolderPercentage = holders
          .slice(0, 10)
          .reduce((sum, h) => sum + h.percentage, 0);
        
        analysis.topHoldersPercentage = topHolderPercentage;

        // High risk if top 10 holders own > 50%
        if (topHolderPercentage > 50) {
          analysis.riskScore += 30;
          analysis.suspiciousActivity.push('Top 10 holders own >50% of supply');
        }

        // Check creator balance
        if (holders[0]) {
          analysis.creatorBalance = holders[0].percentage;
          if (holders[0].percentage > 20) {
            analysis.riskScore += 20;
            analysis.suspiciousActivity.push('Creator holds >20% of supply');
          }
        }
      }

      // Check liquidity
      const tokenInfo = await this.getTokenInfo(mint);
      if (tokenInfo) {
        if (tokenInfo.liquidity < 5000) {
          analysis.riskScore += 25;
          analysis.suspiciousActivity.push('Low liquidity (<$5k)');
        }

        // Check if liquidity is locked (would need specialized API)
        // For now, assume not locked
        analysis.liquidityLocked = false;

        // Low holder count is suspicious
        if (tokenInfo.holders < 50) {
          analysis.riskScore += 15;
          analysis.suspiciousActivity.push('Very few holders (<50)');
        }
      }

      // Check mint authority
      const mintInfo = await this.solana.getTokenInfo(new PublicKey(mint));
      if (mintInfo.mintAuthority) {
        analysis.riskScore += 10;
        analysis.suspiciousActivity.push('Mint authority not revoked');
      }

      if (mintInfo.freezeAuthority) {
        analysis.riskScore += 10;
        analysis.suspiciousActivity.push('Freeze authority not revoked');
      }

      return analysis;
    } catch (error) {
      console.error('Error analyzing rug risk:', error);
      analysis.riskScore = 100; // Max risk on error
      analysis.suspiciousActivity.push('Failed to analyze token');
      return analysis;
    }
  }

  async getTopHolders(mint: string): Promise<
    Array<{ address: string; balance: number; percentage: number }>
  > {
    try {
      const response = await axios.get(
        `https://api.helius.xyz/v0/token-metadata`,
        {
          params: { api_key: HELIUS_API },
        }
      );

      // Simplified - would need proper holder tracking
      return [];
    } catch (error) {
      return [];
    }
  }

  async getSocialMetrics(mint: string): Promise<SocialMetrics> {
    try {
      const response = await axios.get(
        `https://api.birdeye.so/defi/token_trending`,
        {
          headers: { 'X-API-KEY': BIRDEYE_API },
          params: { address: mint },
        }
      );

      const data = response.data.data;
      return {
        mentions24h: data.mentions24h || 0,
        sentiment: data.sentiment || 0,
        trending: data.trending || false,
      };
    } catch (error) {
      return {
        mentions24h: 0,
        sentiment: 0,
        trending: false,
      };
    }
  }

  async calculateVolatility(mint: string, periods: number = 24): Promise<number> {
    try {
      const response = await axios.get(
        `https://api.birdeye.so/defi/history_price`,
        {
          headers: { 'X-API-KEY': BIRDEYE_API },
          params: {
            address: mint,
            address_type: 'token',
            type: '1H',
            time_from: Date.now() - periods * 3600000,
            time_to: Date.now(),
          },
        }
      );

      const prices = response.data.data.items.map((item: any) => item.value);
      
      if (prices.length < 2) return 0;

      const returns = [];
      for (let i = 1; i < prices.length; i++) {
        returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
      }

      const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
      const variance =
        returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) /
        returns.length;

      return Math.sqrt(variance) * 100;
    } catch (error) {
      return 0;
    }
  }

  calculateRSI(prices: number[], period: number = 14): number {
    if (prices.length < period + 1) return 50;

    let gains = 0;
    let losses = 0;

    for (let i = 1; i <= period; i++) {
      const change = prices[i] - prices[i - 1];
      if (change > 0) {
        gains += change;
      } else {
        losses -= change;
      }
    }

    const avgGain = gains / period;
    const avgLoss = losses / period;

    if (avgLoss === 0) return 100;

    const rs = avgGain / avgLoss;
    return 100 - 100 / (1 + rs);
  }
}
