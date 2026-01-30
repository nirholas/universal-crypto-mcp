/**
 * Safety Configuration Examples
 * Author: nich (@nirholas) - x.com/nichxbt
 * 
 * These are recommended safe configurations for different risk profiles.
 * Always test in paper trading mode first!
 */

// CONSERVATIVE - Minimal risk, small positions
export const CONSERVATIVE_CONFIG = {
  maxPositionSize: 0.1, // 0.1 SOL max per trade
  minPositionSize: 0.05, // 0.05 SOL min
  maxSlippage: 0.5, // 0.5% max slippage
  buyAmount: 0.05, // Small positions
  
  // Strict risk management
  stopLoss: 5, // Exit at -5%
  takeProfit: 15, // Target +15%
  trailingStop: 5, // Protect profits at -5% from peak
  maxDailyLoss: 0.5, // Stop if lose 0.5 SOL in a day
  
  // High standards for tokens
  minLiquidity: 50000, // $50k minimum liquidity
  maxMarketCap: 500000, // $500k max (early but not too early)
  minVolume24h: 10000, // $10k daily volume
  minHolders: 100, // At least 100 holders
  maxTokenAge: 24, // Less than 24 hours old
  
  priorityFee: 10000 // 0.00001 SOL priority
}

// MODERATE - Balanced risk/reward
export const MODERATE_CONFIG = {
  maxPositionSize: 0.5, // 0.5 SOL max per trade
  minPositionSize: 0.1, // 0.1 SOL min
  maxSlippage: 1.0, // 1% max slippage
  buyAmount: 0.25, // Medium positions
  
  // Balanced risk management
  stopLoss: 10, // Exit at -10%
  takeProfit: 30, // Target +30%
  trailingStop: 10, // Protect profits at -10% from peak
  maxDailyLoss: 2, // Stop if lose 2 SOL in a day
  
  // Moderate token standards
  minLiquidity: 25000, // $25k minimum liquidity
  maxMarketCap: 1000000, // $1M max market cap
  minVolume24h: 5000, // $5k daily volume
  minHolders: 50, // At least 50 holders
  maxTokenAge: 48, // Less than 48 hours old
  
  priorityFee: 20000 // 0.00002 SOL priority
}

// AGGRESSIVE - Higher risk for higher potential returns
export const AGGRESSIVE_CONFIG = {
  maxPositionSize: 1.0, // 1 SOL max per trade
  minPositionSize: 0.2, // 0.2 SOL min
  maxSlippage: 2.0, // 2% max slippage
  buyAmount: 0.5, // Larger positions
  
  // Aggressive risk management
  stopLoss: 15, // Exit at -15%
  takeProfit: 50, // Target +50%
  trailingStop: 15, // Protect profits at -15% from peak
  maxDailyLoss: 5, // Stop if lose 5 SOL in a day
  
  // Lower token standards (higher risk)
  minLiquidity: 10000, // $10k minimum liquidity
  maxMarketCap: 2000000, // $2M max market cap
  minVolume24h: 2000, // $2k daily volume
  minHolders: 20, // At least 20 holders
  maxTokenAge: 72, // Less than 72 hours old
  
  priorityFee: 50000 // 0.00005 SOL priority (faster execution)
}

// PAPER TRADING - For testing strategies risk-free
export const PAPER_TRADING_CONFIG = {
  maxPositionSize: 1.0,
  minPositionSize: 0.1,
  maxSlippage: 1.0,
  buyAmount: 0.5,
  
  stopLoss: 10,
  takeProfit: 30,
  trailingStop: 10,
  maxDailyLoss: 5,
  
  minLiquidity: 25000,
  maxMarketCap: 1000000,
  minVolume24h: 5000,
  minHolders: 50,
  maxTokenAge: 48,
  
  priorityFee: 20000,
  
  // Paper trading specific
  startingBalance: 10, // Start with 10 SOL virtual balance
  enablePaperTrading: true
}

/**
 * Risk Assessment Helpers
 */
export class RiskAssessment {
  /**
   * Calculate recommended position size based on risk profile
   */
  static calculatePositionSize(
    balance: number,
    riskProfile: 'conservative' | 'moderate' | 'aggressive'
  ): number {
    const riskPercentages = {
      conservative: 0.01, // 1% of balance per trade
      moderate: 0.02, // 2% of balance
      aggressive: 0.05 // 5% of balance
    }
    
    return balance * riskPercentages[riskProfile]
  }
  
  /**
   * Check if token meets safety criteria
   */
  static evaluateTokenSafety(token: {
    liquidity: number
    marketCap: number
    volume24h: number
    holders: number
    age: number // in hours
    rugScore: number
  }): {
    safe: boolean
    risk: 'low' | 'medium' | 'high'
    reasons: string[]
  } {
    const reasons: string[] = []
    let riskPoints = 0
    
    // Check liquidity
    if (token.liquidity < 10000) {
      reasons.push('Very low liquidity (<$10k)')
      riskPoints += 3
    } else if (token.liquidity < 25000) {
      reasons.push('Low liquidity (<$25k)')
      riskPoints += 1
    }
    
    // Check volume
    if (token.volume24h < 2000) {
      reasons.push('Very low volume (<$2k/24h)')
      riskPoints += 2
    }
    
    // Check holders
    if (token.holders < 20) {
      reasons.push('Very few holders (<20)')
      riskPoints += 3
    } else if (token.holders < 50) {
      reasons.push('Few holders (<50)')
      riskPoints += 1
    }
    
    // Check age
    if (token.age < 1) {
      reasons.push('Token less than 1 hour old')
      riskPoints += 2
    }
    
    // Check rug score
    if (token.rugScore > 70) {
      reasons.push('High rug pull risk score')
      riskPoints += 3
    } else if (token.rugScore > 50) {
      reasons.push('Moderate rug pull risk score')
      riskPoints += 1
    }
    
    // Determine overall risk
    let risk: 'low' | 'medium' | 'high'
    let safe: boolean
    
    if (riskPoints >= 7) {
      risk = 'high'
      safe = false
    } else if (riskPoints >= 3) {
      risk = 'medium'
      safe = true
    } else {
      risk = 'low'
      safe = true
    }
    
    return { safe, risk, reasons }
  }
  
  /**
   * Calculate Kelly Criterion for position sizing
   * Based on win rate and average win/loss ratio
   */
  static kellyPositionSize(
    winRate: number, // 0-1
    avgWin: number,
    avgLoss: number,
    balance: number
  ): number {
    if (avgLoss === 0) return 0
    
    const winLossRatio = Math.abs(avgWin / avgLoss)
    const kelly = (winRate * winLossRatio - (1 - winRate)) / winLossRatio
    
    // Use half-Kelly for safety
    const halfKelly = kelly / 2
    
    // Cap at 10% of balance
    const maxPercent = 0.1
    const safeKelly = Math.min(Math.max(halfKelly, 0), maxPercent)
    
    return balance * safeKelly
  }
}

/**
 * Configuration Validator
 */
export class ConfigValidator {
  static validate(config: any): { valid: boolean; errors: string[] } {
    const errors: string[] = []
    
    // Check required fields
    if (!config.maxPositionSize) errors.push('maxPositionSize is required')
    if (!config.stopLoss) errors.push('stopLoss is required')
    if (!config.takeProfit) errors.push('takeProfit is required')
    
    // Validate ranges
    if (config.maxSlippage > 5) {
      errors.push('maxSlippage should not exceed 5% (500 bps)')
    }
    
    if (config.stopLoss > 25) {
      errors.push('stopLoss should not exceed 25% to prevent large losses')
    }
    
    if (config.maxPositionSize > 5) {
      errors.push('maxPositionSize should not exceed 5 SOL for safety')
    }
    
    // Check logic
    if (config.takeProfit < config.stopLoss) {
      errors.push('takeProfit should be greater than stopLoss')
    }
    
    if (config.minPositionSize > config.maxPositionSize) {
      errors.push('minPositionSize cannot be greater than maxPositionSize')
    }
    
    return {
      valid: errors.length === 0,
      errors
    }
  }
}
