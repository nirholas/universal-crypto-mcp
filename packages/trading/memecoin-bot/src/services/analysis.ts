/**
 * Technical Analysis Service
 * Author: nich (@nirholas) - x.com/nichxbt
 */

import axios from 'axios'
import { TokenMetrics, TradingSignal } from '../types'

export interface PriceData {
  timestamp: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface Indicators {
  rsi: number
  macd: {
    macd: number
    signal: number
    histogram: number
  }
  ma7: number
  ma25: number
  ma99: number
  volume: number
  volumeMA: number
  bollingerBands: {
    upper: number
    middle: number
    lower: number
  }
}

export class TechnicalAnalysisService {
  /**
   * Calculate RSI (Relative Strength Index)
   */
  calculateRSI(prices: number[], period: number = 14): number {
    if (prices.length < period + 1) return 50
    
    const changes = []
    for (let i = 1; i < prices.length; i++) {
      changes.push(prices[i] - prices[i - 1])
    }
    
    let gains = 0
    let losses = 0
    
    for (let i = 0; i < period; i++) {
      if (changes[i] > 0) gains += changes[i]
      else losses += Math.abs(changes[i])
    }
    
    const avgGain = gains / period
    const avgLoss = losses / period
    
    if (avgLoss === 0) return 100
    
    const rs = avgGain / avgLoss
    const rsi = 100 - (100 / (1 + rs))
    
    return rsi
  }
  
  /**
   * Calculate MACD (Moving Average Convergence Divergence)
   */
  calculateMACD(prices: number[]): { macd: number, signal: number, histogram: number } {
    if (prices.length < 26) {
      return { macd: 0, signal: 0, histogram: 0 }
    }
    
    const ema12 = this.calculateEMA(prices, 12)
    const ema26 = this.calculateEMA(prices, 26)
    const macd = ema12 - ema26
    
    // Signal line is 9-day EMA of MACD
    const macdLine = prices.slice(-9).map(() => macd)
    const signal = this.calculateEMA(macdLine, 9)
    
    return {
      macd,
      signal,
      histogram: macd - signal
    }
  }
  
  /**
   * Calculate EMA (Exponential Moving Average)
   */
  calculateEMA(prices: number[], period: number): number {
    if (prices.length < period) return prices[prices.length - 1] || 0
    
    const multiplier = 2 / (period + 1)
    let ema = prices.slice(0, period).reduce((sum, price) => sum + price, 0) / period
    
    for (let i = period; i < prices.length; i++) {
      ema = (prices[i] - ema) * multiplier + ema
    }
    
    return ema
  }
  
  /**
   * Calculate SMA (Simple Moving Average)
   */
  calculateSMA(prices: number[], period: number): number {
    if (prices.length < period) return prices[prices.length - 1] || 0
    
    const slice = prices.slice(-period)
    return slice.reduce((sum, price) => sum + price, 0) / period
  }
  
  /**
   * Calculate Bollinger Bands
   */
  calculateBollingerBands(
    prices: number[],
    period: number = 20,
    stdDev: number = 2
  ): { upper: number, middle: number, lower: number } {
    if (prices.length < period) {
      const lastPrice = prices[prices.length - 1] || 0
      return { upper: lastPrice, middle: lastPrice, lower: lastPrice }
    }
    
    const slice = prices.slice(-period)
    const middle = this.calculateSMA(prices, period)
    
    // Calculate standard deviation
    const squaredDiffs = slice.map(price => Math.pow(price - middle, 2))
    const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / period
    const standardDeviation = Math.sqrt(variance)
    
    return {
      upper: middle + (standardDeviation * stdDev),
      middle,
      lower: middle - (standardDeviation * stdDev)
    }
  }
  
  /**
   * Calculate all indicators for a token
   */
  async calculateIndicators(
    tokenAddress: string,
    priceHistory: number[],
    volumeHistory: number[]
  ): Promise<Indicators> {
    const currentPrice = priceHistory[priceHistory.length - 1] || 0
    const currentVolume = volumeHistory[volumeHistory.length - 1] || 0
    
    return {
      rsi: this.calculateRSI(priceHistory, 14),
      macd: this.calculateMACD(priceHistory),
      ma7: this.calculateSMA(priceHistory, 7),
      ma25: this.calculateSMA(priceHistory, 25),
      ma99: this.calculateSMA(priceHistory, 99),
      volume: currentVolume,
      volumeMA: this.calculateSMA(volumeHistory, 20),
      bollingerBands: this.calculateBollingerBands(priceHistory, 20, 2)
    }
  }
  
  /**
   * Generate trading signal based on technical analysis
   */
  generateSignal(
    indicators: Indicators,
    metrics: TokenMetrics,
    currentPrice: number
  ): TradingSignal {
    const reasons: string[] = []
    let buyScore = 0
    let sellScore = 0
    
    // RSI Analysis
    if (indicators.rsi < 30) {
      buyScore += 25
      reasons.push(`RSI oversold (${indicators.rsi.toFixed(2)})`)
    } else if (indicators.rsi > 70) {
      sellScore += 25
      reasons.push(`RSI overbought (${indicators.rsi.toFixed(2)})`)
    }
    
    // MACD Analysis
    if (indicators.macd.histogram > 0 && indicators.macd.macd > indicators.macd.signal) {
      buyScore += 20
      reasons.push('MACD bullish crossover')
    } else if (indicators.macd.histogram < 0 && indicators.macd.macd < indicators.macd.signal) {
      sellScore += 20
      reasons.push('MACD bearish crossover')
    }
    
    // Moving Average Analysis
    if (currentPrice > indicators.ma7 && indicators.ma7 > indicators.ma25) {
      buyScore += 15
      reasons.push('Price above MA7 and MA25')
    } else if (currentPrice < indicators.ma7 && indicators.ma7 < indicators.ma25) {
      sellScore += 15
      reasons.push('Price below MA7 and MA25')
    }
    
    // Bollinger Bands Analysis
    if (currentPrice < indicators.bollingerBands.lower) {
      buyScore += 15
      reasons.push('Price below lower Bollinger Band')
    } else if (currentPrice > indicators.bollingerBands.upper) {
      sellScore += 15
      reasons.push('Price above upper Bollinger Band')
    }
    
    // Volume Analysis
    if (indicators.volume > indicators.volumeMA * 1.5) {
      buyScore += 10
      reasons.push('High volume spike')
    }
    
    // Metrics Analysis
    if (metrics.priceChange1h > 10) {
      buyScore += 10
      reasons.push(`Strong 1h momentum (+${metrics.priceChange1h.toFixed(2)}%)`)
    } else if (metrics.priceChange1h < -10) {
      sellScore += 10
      reasons.push(`Weak 1h momentum (${metrics.priceChange1h.toFixed(2)}%)`)
    }
    
    // Buy/Sell pressure
    const buyPressure = metrics.buys24h / (metrics.buys24h + metrics.sells24h)
    if (buyPressure > 0.6) {
      buyScore += 10
      reasons.push(`Strong buy pressure (${(buyPressure * 100).toFixed(0)}%)`)
    } else if (buyPressure < 0.4) {
      sellScore += 10
      reasons.push(`Strong sell pressure (${((1 - buyPressure) * 100).toFixed(0)}%)`)
    }
    
    // Risk factors
    if (metrics.rugPullScore > 70) {
      sellScore += 30
      reasons.push(`High rug risk (${metrics.rugPullScore})`)
    }
    
    if (metrics.honeypotRisk > 70) {
      sellScore += 30
      reasons.push(`High honeypot risk (${metrics.honeypotRisk})`)
    }
    
    // Determine action
    let action: 'buy' | 'sell' | 'hold'
    let confidence: number
    
    if (buyScore > sellScore && buyScore >= 40) {
      action = 'buy'
      confidence = Math.min(buyScore, 100)
    } else if (sellScore > buyScore && sellScore >= 40) {
      action = 'sell'
      confidence = Math.min(sellScore, 100)
    } else {
      action = 'hold'
      confidence = 50
    }
    
    return {
      tokenAddress: metrics.address,
      action,
      confidence,
      reasons,
      metrics,
      timestamp: new Date()
    }
  }
  
  /**
   * Detect price patterns
   */
  detectPatterns(priceHistory: number[]): string[] {
    const patterns: string[] = []
    
    if (priceHistory.length < 3) return patterns
    
    const recent = priceHistory.slice(-3)
    
    // Double bottom
    if (recent[0] < recent[1] && recent[2] < recent[1] && 
        Math.abs(recent[0] - recent[2]) / recent[0] < 0.05) {
      patterns.push('Double Bottom (Bullish)')
    }
    
    // Double top
    if (recent[0] > recent[1] && recent[2] > recent[1] && 
        Math.abs(recent[0] - recent[2]) / recent[0] < 0.05) {
      patterns.push('Double Top (Bearish)')
    }
    
    // Strong uptrend
    if (recent.every((price, i) => i === 0 || price > recent[i - 1])) {
      patterns.push('Uptrend')
    }
    
    // Strong downtrend
    if (recent.every((price, i) => i === 0 || price < recent[i - 1])) {
      patterns.push('Downtrend')
    }
    
    return patterns
  }
}
