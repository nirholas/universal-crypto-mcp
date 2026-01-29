/**
 * Trading Strategy and Signal Generator
 * Author: nich (@nirholas) - x.com/nichxbt
 */

import { TokenMetrics, TradingSignal, LiquidityPool } from '../types'
import { config } from '../config/config'
import { TokenAnalyzer } from './analyzer'
import { DexScreenerService } from './dexscreener'

export class TradingStrategy {
  private analyzer: TokenAnalyzer
  private dexScreener: DexScreenerService
  
  constructor(analyzer: TokenAnalyzer, dexScreener: DexScreenerService) {
    this.analyzer = analyzer
    this.dexScreener = dexScreener
  }
  
  async evaluateToken(tokenAddress: string): Promise<TradingSignal> {
    const reasons: string[] = []
    let confidence = 50
    let action: 'buy' | 'sell' | 'hold' = 'hold'
    
    // Get token metrics
    const metrics = await this.dexScreener.getTokenMetrics(tokenAddress)
    if (!metrics) {
      return {
        tokenAddress,
        action: 'hold',
        confidence: 0,
        reasons: ['Unable to fetch token metrics'],
        metrics: this.getEmptyMetrics(tokenAddress),
        timestamp: new Date()
      }
    }
    
    // Safety check
    const safetyCheck = await this.analyzer.analyzeToken(tokenAddress)
    if (!safetyCheck.isSafe) {
      return {
        tokenAddress,
        action: 'hold',
        confidence: 0,
        reasons: ['Token failed safety checks', ...safetyCheck.issues],
        metrics,
        timestamp: new Date()
      }
    }
    
    // Filter 1: Liquidity
    if (metrics.liquidity < config.minLiquidity) {
      reasons.push(`Liquidity too low: $${metrics.liquidity.toFixed(0)}`)
      confidence -= 20
    } else {
      reasons.push(`Good liquidity: $${metrics.liquidity.toFixed(0)}`)
      confidence += 10
    }
    
    // Filter 2: Market cap
    if (metrics.marketCap > config.maxMarketCap) {
      reasons.push(`Market cap too high: $${metrics.marketCap.toFixed(0)}`)
      confidence -= 15
    } else if (metrics.marketCap > 0) {
      reasons.push(`Suitable market cap: $${metrics.marketCap.toFixed(0)}`)
      confidence += 5
    }
    
    // Filter 3: Volume
    if (metrics.volume24h < config.minVolume24h) {
      reasons.push(`Volume too low: $${metrics.volume24h.toFixed(0)}`)
      confidence -= 15
    } else {
      reasons.push(`Good volume: $${metrics.volume24h.toFixed(0)}`)
      confidence += 10
    }
    
    // Filter 4: Holders
    if (metrics.holders > 0 && metrics.holders < config.minHolders) {
      reasons.push(`Not enough holders: ${metrics.holders}`)
      confidence -= 10
    } else if (metrics.holders >= config.minHolders) {
      reasons.push(`Sufficient holders: ${metrics.holders}`)
      confidence += 5
    }
    
    // Momentum indicators
    if (metrics.priceChange24h > 50) {
      reasons.push(`Strong 24h momentum: +${metrics.priceChange24h.toFixed(2)}%`)
      confidence += 15
    } else if (metrics.priceChange24h > 20) {
      reasons.push(`Good 24h momentum: +${metrics.priceChange24h.toFixed(2)}%`)
      confidence += 10
    } else if (metrics.priceChange24h < -20) {
      reasons.push(`Negative momentum: ${metrics.priceChange24h.toFixed(2)}%`)
      confidence -= 20
    }
    
    // Buy/sell ratio
    if (metrics.buys24h > 0 && metrics.sells24h > 0) {
      const buyRatio = metrics.buys24h / (metrics.buys24h + metrics.sells24h)
      if (buyRatio > 0.6) {
        reasons.push(`High buy pressure: ${(buyRatio * 100).toFixed(0)}%`)
        confidence += 10
      } else if (buyRatio < 0.4) {
        reasons.push(`High sell pressure: ${((1 - buyRatio) * 100).toFixed(0)}%`)
        confidence -= 10
      }
    }
    
    // Determine action
    if (confidence >= 70) {
      action = 'buy'
      reasons.push('✅ BUY signal generated')
    } else if (confidence <= 30) {
      action = 'sell'
      reasons.push('⚠️ SELL signal generated')
    } else {
      action = 'hold'
      reasons.push('⏸️ HOLD - insufficient confidence')
    }
    
    return {
      tokenAddress,
      action,
      confidence: Math.max(0, Math.min(100, confidence)),
      reasons,
      metrics,
      timestamp: new Date()
    }
  }
  
  async shouldBuy(signal: TradingSignal): Promise<boolean> {
    if (signal.action !== 'buy') return false
    if (signal.confidence < 70) return false
    
    // Additional safety checks
    const safetyCheck = await this.analyzer.analyzeToken(signal.tokenAddress)
    if (!safetyCheck.isSafe) return false
    
    // Check if it's a honeypot
    const isHoneypot = await this.analyzer.isHoneypot(signal.tokenAddress)
    if (isHoneypot) return false
    
    return true
  }
  
  shouldSell(currentPrice: number, entryPrice: number, highestPrice: number): {
    shouldSell: boolean
    reason: string
  } {
    const pnlPercent = ((currentPrice - entryPrice) / entryPrice) * 100
    
    // Take profit
    if (pnlPercent >= config.takeProfit) {
      return { shouldSell: true, reason: 'Take profit target reached' }
    }
    
    // Stop loss
    if (pnlPercent <= -config.stopLoss) {
      return { shouldSell: true, reason: 'Stop loss triggered' }
    }
    
    // Trailing stop
    const dropFromHigh = ((highestPrice - currentPrice) / highestPrice) * 100
    if (dropFromHigh >= config.trailingStop && pnlPercent > 0) {
      return { shouldSell: true, reason: 'Trailing stop triggered' }
    }
    
    return { shouldSell: false, reason: '' }
  }
  
  private getEmptyMetrics(tokenAddress: string): TokenMetrics {
    return {
      address: tokenAddress,
      holders: 0,
      marketCap: 0,
      liquidity: 0,
      volume24h: 0,
      priceChange24h: 0,
      priceChange1h: 0,
      buys24h: 0,
      sells24h: 0,
      uniqueBuyers24h: 0,
      uniqueSellers24h: 0,
      rugPullScore: 0,
      honeypotRisk: 0,
      timestamp: new Date()
    }
  }
}
