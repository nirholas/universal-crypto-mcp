/**
 * Memecoin Scanner Service - Real-time token discovery
 * Author: nich (@nirholas) - x.com/nichxbt
 */

import axios from 'axios'
import { EventEmitter } from 'events'
import { config } from '../config/config'
import { LiquidityPool, TokenMetrics } from '../types'

const BIRDEYE_API = 'https://public-api.birdeye.so'
const DEXSCREENER_API = 'https://api.dexscreener.com/latest/dex'
const HELIUS_API = 'https://api.helius.xyz/v0'

export interface NewToken {
  address: string
  symbol: string
  name: string
  liquidity: number
  marketCap: number
  priceUsd: number
  volume24h: number
  priceChange24h: number
  poolAddress: string
  dex: string
  createdAt: number
}

export class ScannerService extends EventEmitter {
  private scanning: boolean = false
  private knownTokens: Set<string> = new Set()
  private scanInterval: NodeJS.Timeout | null = null
  
  async startScanning(): Promise<void> {
    if (this.scanning) {
      console.log('Scanner already running')
      return
    }
    
    this.scanning = true
    console.log('🔍 Starting memecoin scanner...')
    
    // Initial scan
    await this.scanNewTokens()
    
    // Set up interval scanning
    this.scanInterval = setInterval(
      () => this.scanNewTokens(),
      config.newPairCheckInterval
    )
  }
  
  stopScanning(): void {
    if (this.scanInterval) {
      clearInterval(this.scanInterval)
      this.scanInterval = null
    }
    this.scanning = false
    console.log('Scanner stopped')
  }
  
  /**
   * Scan for new tokens using multiple sources
   */
  private async scanNewTokens(): Promise<void> {
    try {
      // Parallel scanning from multiple sources
      const [birdeyeTokens, dexscreenerTokens] = await Promise.all([
        this.scanBirdeye(),
        this.scanDexScreener()
      ])
      
      const allTokens = [...birdeyeTokens, ...dexscreenerTokens]
      
      // Filter and emit new tokens
      for (const token of allTokens) {
        if (!this.knownTokens.has(token.address)) {
          this.knownTokens.add(token.address)
          
          // Check if token meets criteria
          if (await this.meetsFilterCriteria(token)) {
            this.emit('newToken', token)
          }
        }
      }
    } catch (error) {
      console.error('Scanning error:', error)
    }
  }
  
  /**
   * Scan new tokens from Birdeye API
   */
  private async scanBirdeye(): Promise<NewToken[]> {
    if (!config.birdeyeApiKey) {
      return []
    }
    
    try {
      const response = await axios.get(
        `${BIRDEYE_API}/defi/v3/token/new-listing`,
        {
          headers: {
            'X-API-KEY': config.birdeyeApiKey
          },
          params: {
            chain: 'solana',
            sort_by: 'created_at',
            sort_type: 'desc',
            offset: 0,
            limit: 50
          },
          timeout: 10000
        }
      )
      
      if (response.data?.data?.items) {
        return response.data.data.items.map((item: any) => ({
          address: item.address,
          symbol: item.symbol || 'UNKNOWN',
          name: item.name || 'Unknown',
          liquidity: item.liquidity || 0,
          marketCap: item.mc || 0,
          priceUsd: item.price || 0,
          volume24h: item.v24h || 0,
          priceChange24h: item.price24hPercent || 0,
          poolAddress: item.poolAddress || '',
          dex: 'raydium',
          createdAt: item.created_at || Date.now()
        }))
      }
    } catch (error) {
      console.error('Birdeye scan error:', error)
    }
    
    return []
  }
  
  /**
   * Scan new tokens from DexScreener API
   */
  private async scanDexScreener(): Promise<NewToken[]> {
    try {
      const response = await axios.get(
        `${DEXSCREENER_API}/tokens/solana`,
        {
          params: {
            sort: 'createdAt',
            order: 'desc',
            limit: 50
          },
          timeout: 10000
        }
      )
      
      if (response.data?.pairs) {
        return response.data.pairs
          .filter((pair: any) => pair.chainId === 'solana')
          .map((pair: any) => ({
            address: pair.baseToken.address,
            symbol: pair.baseToken.symbol || 'UNKNOWN',
            name: pair.baseToken.name || 'Unknown',
            liquidity: parseFloat(pair.liquidity?.usd || '0'),
            marketCap: parseFloat(pair.fdv || '0'),
            priceUsd: parseFloat(pair.priceUsd || '0'),
            volume24h: parseFloat(pair.volume?.h24 || '0'),
            priceChange24h: parseFloat(pair.priceChange?.h24 || '0'),
            poolAddress: pair.pairAddress,
            dex: pair.dexId || 'raydium',
            createdAt: pair.pairCreatedAt || Date.now()
          }))
      }
    } catch (error) {
      console.error('DexScreener scan error:', error)
    }
    
    return []
  }
  
  /**
   * Check if token meets filter criteria
   */
  private async meetsFilterCriteria(token: NewToken): Promise<boolean> {
    // Check liquidity
    if (token.liquidity < config.minLiquidity) {
      return false
    }
    
    // Check market cap
    if (token.marketCap > config.maxMarketCap) {
      return false
    }
    
    // Check 24h volume
    if (token.volume24h < config.minVolume24h) {
      return false
    }
    
    // Check token age
    const ageHours = (Date.now() - token.createdAt) / (1000 * 60 * 60)
    if (ageHours > config.maxTokenAge) {
      return false
    }
    
    return true
  }
  
  /**
   * Get detailed token metrics
   */
  async getTokenMetrics(tokenAddress: string): Promise<TokenMetrics | null> {
    try {
      // Fetch from Birdeye if available
      if (config.birdeyeApiKey) {
        const response = await axios.get(
          `${BIRDEYE_API}/defi/token_overview`,
          {
            headers: {
              'X-API-KEY': config.birdeyeApiKey
            },
            params: {
              address: tokenAddress
            },
            timeout: 10000
          }
        )
        
        const data = response.data?.data
        if (data) {
          return {
            address: tokenAddress,
            holders: data.holder || 0,
            marketCap: data.mc || 0,
            liquidity: data.liquidity || 0,
            volume24h: data.v24h || 0,
            priceChange24h: data.price24hPercent || 0,
            priceChange1h: data.price1hPercent || 0,
            buys24h: data.buy24h || 0,
            sells24h: data.sell24h || 0,
            uniqueBuyers24h: data.uniqueWallet24h?.buy || 0,
            uniqueSellers24h: data.uniqueWallet24h?.sell || 0,
            rugPullScore: this.calculateRugScore(data),
            honeypotRisk: this.calculateHoneypotRisk(data),
            timestamp: new Date()
          }
        }
      }
      
      // Fallback to DexScreener
      const response = await axios.get(
        `${DEXSCREENER_API}/tokens/${tokenAddress}`,
        { timeout: 10000 }
      )
      
      if (response.data?.pairs?.[0]) {
        const pair = response.data.pairs[0]
        return {
          address: tokenAddress,
          holders: 0, // Not available in DexScreener
          marketCap: parseFloat(pair.fdv || '0'),
          liquidity: parseFloat(pair.liquidity?.usd || '0'),
          volume24h: parseFloat(pair.volume?.h24 || '0'),
          priceChange24h: parseFloat(pair.priceChange?.h24 || '0'),
          priceChange1h: parseFloat(pair.priceChange?.h1 || '0'),
          buys24h: parseInt(pair.txns?.h24?.buys || '0'),
          sells24h: parseInt(pair.txns?.h24?.sells || '0'),
          uniqueBuyers24h: 0,
          uniqueSellers24h: 0,
          rugPullScore: 50, // Default
          honeypotRisk: 50, // Default
          timestamp: new Date()
        }
      }
    } catch (error) {
      console.error('Error fetching token metrics:', error)
    }
    
    return null
  }
  
  /**
   * Calculate rug pull risk score
   */
  private calculateRugScore(data: any): number {
    let score = 0
    
    // Low liquidity = higher risk
    if (data.liquidity < 5000) score += 30
    else if (data.liquidity < 20000) score += 15
    
    // Few holders = higher risk
    if (data.holder < 50) score += 25
    else if (data.holder < 100) score += 10
    
    // High concentration = higher risk
    if (data.top10HolderPercent > 50) score += 20
    else if (data.top10HolderPercent > 30) score += 10
    
    // Unusual sell pressure
    if (data.sell24h > data.buy24h * 2) score += 25
    
    return Math.min(score, 100)
  }
  
  /**
   * Calculate honeypot risk
   */
  private calculateHoneypotRisk(data: any): number {
    let risk = 0
    
    // Check sell transactions
    if (data.sell24h === 0 && data.buy24h > 10) risk += 50
    
    // Very low sell volume compared to buys
    if (data.buy24h > 0 && data.sell24h / data.buy24h < 0.1) risk += 30
    
    // Abnormal price action
    if (data.price24hPercent > 1000) risk += 20
    
    return Math.min(risk, 100)
  }
}
