/**
 * DexScreener API Service
 * Author: nich (@nirholas) - x.com/nichxbt
 */

import axios from 'axios'
import { LiquidityPool, TokenMetrics } from '../types'
import { config } from '../config/config'

const DEXSCREENER_API = 'https://api.dexscreener.com/latest'

export class DexScreenerService {
  async getTokenPairs(tokenAddress: string): Promise<LiquidityPool[]> {
    try {
      const response = await axios.get(`${DEXSCREENER_API}/dex/tokens/${tokenAddress}`)
      
      if (!response.data.pairs) {
        return []
      }
      
      return response.data.pairs
        .filter((pair: any) => pair.chainId === 'solana')
        .map((pair: any) => ({
          address: pair.pairAddress,
          tokenA: pair.baseToken.address,
          tokenB: pair.quoteToken.address,
          reserveA: pair.liquidity?.base || '0',
          reserveB: pair.liquidity?.quote || '0',
          liquidity: parseFloat(pair.liquidity?.usd || '0'),
          volume24h: parseFloat(pair.volume?.h24 || '0'),
          priceUsd: parseFloat(pair.priceUsd || '0'),
          priceChange24h: parseFloat(pair.priceChange?.h24 || '0'),
          dex: pair.dexId,
          createdAt: new Date(pair.pairCreatedAt || Date.now())
        }))
    } catch (error) {
      console.error('Failed to fetch token pairs:', error)
      return []
    }
  }
  
  async getNewPairs(limit: number = 50): Promise<LiquidityPool[]> {
    try {
      const response = await axios.get(`${DEXSCREENER_API}/dex/search`, {
        params: {
          q: 'solana',
          limit
        }
      })
      
      if (!response.data.pairs) {
        return []
      }
      
      return response.data.pairs
        .filter((pair: any) => {
          const age = Date.now() - new Date(pair.pairCreatedAt).getTime()
          const ageHours = age / (1000 * 60 * 60)
          return ageHours <= config.maxTokenAge
        })
        .map((pair: any) => ({
          address: pair.pairAddress,
          tokenA: pair.baseToken.address,
          tokenB: pair.quoteToken.address,
          reserveA: pair.liquidity?.base || '0',
          reserveB: pair.liquidity?.quote || '0',
          liquidity: parseFloat(pair.liquidity?.usd || '0'),
          volume24h: parseFloat(pair.volume?.h24 || '0'),
          priceUsd: parseFloat(pair.priceUsd || '0'),
          priceChange24h: parseFloat(pair.priceChange?.h24 || '0'),
          dex: pair.dexId,
          createdAt: new Date(pair.pairCreatedAt)
        }))
    } catch (error) {
      console.error('Failed to fetch new pairs:', error)
      return []
    }
  }
  
  async getTokenMetrics(tokenAddress: string): Promise<TokenMetrics | null> {
    try {
      const pairs = await this.getTokenPairs(tokenAddress)
      
      if (pairs.length === 0) {
        return null
      }
      
      // Aggregate metrics from all pairs
      const totalLiquidity = pairs.reduce((sum, p) => sum + p.liquidity, 0)
      const totalVolume = pairs.reduce((sum, p) => sum + p.volume24h, 0)
      const avgPriceChange = pairs.reduce((sum, p) => sum + p.priceChange24h, 0) / pairs.length
      
      // Get additional info from Birdeye if available
      let holders = 0
      let marketCap = 0
      
      if (config.birdeyeApiKey) {
        const birdeyeData = await this.getBirdeyeData(tokenAddress)
        if (birdeyeData) {
          holders = birdeyeData.holders || 0
          marketCap = birdeyeData.marketCap || 0
        }
      }
      
      return {
        address: tokenAddress,
        holders,
        marketCap,
        liquidity: totalLiquidity,
        volume24h: totalVolume,
        priceChange24h: avgPriceChange,
        priceChange1h: 0, // Not available from DexScreener
        buys24h: 0,
        sells24h: 0,
        uniqueBuyers24h: 0,
        uniqueSellers24h: 0,
        rugPullScore: 0,
        honeypotRisk: 0,
        timestamp: new Date()
      }
    } catch (error) {
      console.error('Failed to get token metrics:', error)
      return null
    }
  }
  
  private async getBirdeyeData(tokenAddress: string): Promise<any> {
    if (!config.birdeyeApiKey) {
      return null
    }
    
    try {
      const response = await axios.get(`https://public-api.birdeye.so/defi/token_overview`, {
        params: { address: tokenAddress },
        headers: { 'X-API-KEY': config.birdeyeApiKey }
      })
      
      return response.data.data
    } catch (error) {
      return null
    }
  }
}
