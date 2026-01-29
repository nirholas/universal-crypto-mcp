/**
 * Risk Management Service
 * Author: nich (@nirholas) - x.com/nichxbt
 */

import { config } from '../config/config'
import { Position, Trade } from '../types'

export interface RiskLimits {
  maxPositionSize: number
  minPositionSize: number
  maxDailyLoss: number
  currentDailyLoss: number
  canTrade: boolean
}

export class RiskManagementService {
  private dailyPnL: number = 0
  private dailyTrades: number = 0
  private lastResetDate: string = new Date().toISOString().split('T')[0]
  
  /**
   * Check if a trade meets risk criteria
   */
  canExecuteTrade(
    amountSOL: number,
    currentPositions: Position[]
  ): { allowed: boolean, reason?: string } {
    // Reset daily metrics if new day
    this.checkAndResetDaily()
    
    // Check daily loss limit
    if (this.dailyPnL <= -config.maxDailyLoss) {
      return {
        allowed: false,
        reason: `Daily loss limit reached: ${this.dailyPnL.toFixed(4)} SOL`
      }
    }
    
    // Check position size limits
    if (amountSOL < config.minPositionSize) {
      return {
        allowed: false,
        reason: `Position size ${amountSOL} SOL below minimum ${config.minPositionSize} SOL`
      }
    }
    
    if (amountSOL > config.maxPositionSize) {
      return {
        allowed: false,
        reason: `Position size ${amountSOL} SOL exceeds maximum ${config.maxPositionSize} SOL`
      }
    }
    
    // Check total exposure
    const totalExposure = currentPositions.reduce(
      (sum, pos) => sum + pos.currentValue,
      0
    )
    
    const maxTotalExposure = config.maxPositionSize * 5 // Max 5 concurrent positions
    if (totalExposure + amountSOL > maxTotalExposure) {
      return {
        allowed: false,
        reason: `Total exposure ${(totalExposure + amountSOL).toFixed(4)} SOL would exceed limit ${maxTotalExposure} SOL`
      }
    }
    
    return { allowed: true }
  }
  
  /**
   * Calculate position size based on risk
   */
  calculatePositionSize(
    tokenPrice: number,
    riskScore: number,
    availableBalance: number
  ): number {
    // Base position size
    let size = config.buyAmount
    
    // Adjust based on risk score (0-100, higher = riskier)
    if (riskScore > 70) {
      size *= 0.5 // High risk = 50% size
    } else if (riskScore > 50) {
      size *= 0.75 // Medium risk = 75% size
    }
    
    // Ensure within limits
    size = Math.max(config.minPositionSize, Math.min(size, config.maxPositionSize))
    
    // Ensure we have balance
    size = Math.min(size, availableBalance * 0.9) // Use max 90% of balance
    
    return size
  }
  
  /**
   * Check if position should be closed based on stop loss/take profit
   */
  shouldClosePosition(position: Position): { 
    should: boolean
    reason?: string
    type?: 'stop-loss' | 'take-profit' | 'trailing-stop'
  } {
    // Check stop loss
    const lossPercent = ((position.currentPrice - position.entryPrice) / position.entryPrice) * 100
    if (lossPercent <= -position.stopLoss) {
      return {
        should: true,
        reason: `Stop loss triggered: ${lossPercent.toFixed(2)}%`,
        type: 'stop-loss'
      }
    }
    
    // Check take profit
    const gainPercent = ((position.currentPrice - position.entryPrice) / position.entryPrice) * 100
    if (gainPercent >= position.takeProfit) {
      return {
        should: true,
        reason: `Take profit triggered: ${gainPercent.toFixed(2)}%`,
        type: 'take-profit'
      }
    }
    
    // Check trailing stop
    if (position.highestPrice > position.entryPrice) {
      const trailingStopPrice = position.highestPrice * (1 - position.trailingStop / 100)
      if (position.currentPrice <= trailingStopPrice) {
        return {
          should: true,
          reason: `Trailing stop triggered at ${trailingStopPrice.toFixed(8)}`,
          type: 'trailing-stop'
        }
      }
    }
    
    return { should: false }
  }
  
  /**
   * Update position with trailing stop
   */
  updateTrailingStop(position: Position, currentPrice: number): Position {
    return {
      ...position,
      currentPrice,
      highestPrice: Math.max(position.highestPrice, currentPrice),
      currentValue: position.currentValue,
      pnl: (currentPrice - position.entryPrice) * parseFloat(position.amount),
      pnlPercent: ((currentPrice - position.entryPrice) / position.entryPrice) * 100,
      updatedAt: new Date()
    }
  }
  
  /**
   * Record trade result
   */
  recordTrade(trade: Trade, pnl: number): void {
    this.checkAndResetDaily()
    this.dailyPnL += pnl
    this.dailyTrades++
  }
  
  /**
   * Get current risk limits
   */
  getRiskLimits(): RiskLimits {
    this.checkAndResetDaily()
    
    return {
      maxPositionSize: config.maxPositionSize,
      minPositionSize: config.minPositionSize,
      maxDailyLoss: config.maxDailyLoss,
      currentDailyLoss: Math.abs(Math.min(0, this.dailyPnL)),
      canTrade: this.dailyPnL > -config.maxDailyLoss
    }
  }
  
  /**
   * Get daily statistics
   */
  getDailyStats(): {
    pnl: number
    trades: number
    date: string
  } {
    this.checkAndResetDaily()
    
    return {
      pnl: this.dailyPnL,
      trades: this.dailyTrades,
      date: this.lastResetDate
    }
  }
  
  /**
   * Check and reset daily metrics
   */
  private checkAndResetDaily(): void {
    const today = new Date().toISOString().split('T')[0]
    
    if (today !== this.lastResetDate) {
      console.log(`Daily reset: PnL was ${this.dailyPnL.toFixed(4)} SOL, ${this.dailyTrades} trades`)
      this.dailyPnL = 0
      this.dailyTrades = 0
      this.lastResetDate = today
    }
  }
  
  /**
   * Calculate Kelly Criterion for optimal position sizing
   */
  calculateKellyCriterion(
    winRate: number,
    avgWin: number,
    avgLoss: number
  ): number {
    if (winRate <= 0 || winRate >= 1 || avgLoss === 0) {
      return 0.25 // Default conservative 25%
    }
    
    const winLossRatio = avgWin / Math.abs(avgLoss)
    const kelly = (winRate * winLossRatio - (1 - winRate)) / winLossRatio
    
    // Use half Kelly for safety
    return Math.max(0, Math.min(kelly * 0.5, 0.5))
  }
}
