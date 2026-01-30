/**
 * Risk Management Module
 * 
 * Based on Freqtrade's risk management system (MIT License)
 * https://github.com/freqtrade/freqtrade
 * 
 * This module implements proven risk management strategies to protect capital:
 * - Position sizing based on available capital
 * - Maximum drawdown protection
 * - Daily/session loss limits
 * - Cooldown periods after losses
 * - Emergency stop mechanisms
 */

export interface RiskConfig {
  // Position sizing
  maxPositionSize: number; // Max % of capital per trade (e.g., 0.05 = 5%)
  minPositionSize: number; // Min trade size in base currency
  
  // Loss protection
  maxDailyLoss: number; // Max daily loss % (e.g., 0.05 = 5%)
  maxSessionLoss: number; // Max session loss % (e.g., 0.10 = 10%)
  maxConsecutiveLosses: number; // Stop after X consecutive losses
  
  // Drawdown protection
  maxDrawdown: number; // Max drawdown % (e.g., 0.15 = 15%)
  
  // Cooldown periods
  lossCooldownMinutes: number; // Wait time after a loss
  consecutiveLossCooldownMinutes: number; // Wait time after consecutive losses
  
  // Emergency stops
  enableEmergencyStop: boolean;
  emergencyStopLoss: number; // Critical loss level (e.g., 0.20 = 20%)
}

export interface TradeRecord {
  timestamp: number;
  profit: number;
  percentChange: number;
  exitReason: string;
}

export class RiskManager {
  private config: RiskConfig;
  private initialBalance: number;
  private currentBalance: number;
  private peakBalance: number;
  private tradeHistory: TradeRecord[] = [];
  private consecutiveLosses: number = 0;
  private lastTradeTimestamp: number = 0;
  private dailyStartBalance: number;
  private sessionStartBalance: number;
  private emergencyStopActive: boolean = false;
  
  constructor(config: RiskConfig, initialBalance: number) {
    this.config = config;
    this.initialBalance = initialBalance;
    this.currentBalance = initialBalance;
    this.peakBalance = initialBalance;
    this.dailyStartBalance = initialBalance;
    this.sessionStartBalance = initialBalance;
  }
  
  /**
   * Calculate position size based on available capital and risk parameters
   * Based on Freqtrade's stake amount calculation
   */
  calculatePositionSize(price: number, confidence: number = 1.0): number {
    // Check if trading is allowed
    if (!this.canTrade()) {
      return 0;
    }
    
    // Calculate max position size
    const maxSize = this.currentBalance * this.config.maxPositionSize;
    
    // Scale by confidence (0-1)
    const scaledSize = maxSize * confidence;
    
    // Ensure minimum size
    const minSize = this.config.minPositionSize;
    if (scaledSize < minSize) {
      return 0;
    }
    
    // Calculate affordable amount
    const affordable = Math.floor(scaledSize / price * 10000) / 10000;
    
    return affordable;
  }
  
  /**
   * Check if trading is allowed based on current risk conditions
   * Implements Freqtrade's protection mechanisms
   */
  canTrade(): boolean {
    // Emergency stop active
    if (this.emergencyStopActive) {
      console.log('[Risk Manager] Emergency stop active - trading disabled');
      return false;
    }
    
    // Check daily loss limit
    const dailyLoss = (this.dailyStartBalance - this.currentBalance) / this.dailyStartBalance;
    if (dailyLoss >= this.config.maxDailyLoss) {
      console.log(`[Risk Manager] Daily loss limit reached: ${(dailyLoss * 100).toFixed(2)}%`);
      return false;
    }
    
    // Check session loss limit
    const sessionLoss = (this.sessionStartBalance - this.currentBalance) / this.sessionStartBalance;
    if (sessionLoss >= this.config.maxSessionLoss) {
      console.log(`[Risk Manager] Session loss limit reached: ${(sessionLoss * 100).toFixed(2)}%`);
      return false;
    }
    
    // Check max drawdown
    const drawdown = (this.peakBalance - this.currentBalance) / this.peakBalance;
    if (drawdown >= this.config.maxDrawdown) {
      console.log(`[Risk Manager] Max drawdown reached: ${(drawdown * 100).toFixed(2)}%`);
      return false;
    }
    
    // Check consecutive losses
    if (this.consecutiveLosses >= this.config.maxConsecutiveLosses) {
      console.log(`[Risk Manager] Max consecutive losses reached: ${this.consecutiveLosses}`);
      return false;
    }
    
    // Check cooldown after loss
    if (this.consecutiveLosses > 0) {
      const now = Date.now();
      const cooldownMs = this.consecutiveLosses >= 3 
        ? this.config.consecutiveLossCooldownMinutes * 60 * 1000
        : this.config.lossCooldownMinutes * 60 * 1000;
      
      if (now - this.lastTradeTimestamp < cooldownMs) {
        const remainingMinutes = Math.ceil((cooldownMs - (now - this.lastTradeTimestamp)) / 60000);
        console.log(`[Risk Manager] In cooldown period: ${remainingMinutes} minutes remaining`);
        return false;
      }
    }
    
    // Check emergency stop condition
    if (this.config.enableEmergencyStop) {
      const totalLoss = (this.initialBalance - this.currentBalance) / this.initialBalance;
      if (totalLoss >= this.config.emergencyStopLoss) {
        this.emergencyStopActive = true;
        console.log(`[Risk Manager] EMERGENCY STOP TRIGGERED - Total loss: ${(totalLoss * 100).toFixed(2)}%`);
        return false;
      }
    }
    
    return true;
  }
  
  /**
   * Record a completed trade
   * Updates balance, drawdown, and loss tracking
   */
  recordTrade(
    entryPrice: number,
    exitPrice: number,
    amount: number,
    fees: number,
    exitReason: string
  ): void {
    const profit = (exitPrice - entryPrice) * amount - fees;
    const percentChange = ((exitPrice - entryPrice) / entryPrice) * 100;
    
    // Update balance
    this.currentBalance += profit;
    
    // Update peak balance
    if (this.currentBalance > this.peakBalance) {
      this.peakBalance = this.currentBalance;
    }
    
    // Track losses
    if (profit < 0) {
      this.consecutiveLosses++;
    } else {
      this.consecutiveLosses = 0;
    }
    
    // Record trade
    const trade: TradeRecord = {
      timestamp: Date.now(),
      profit,
      percentChange,
      exitReason
    };
    
    this.tradeHistory.push(trade);
    this.lastTradeTimestamp = trade.timestamp;
    
    // Log status
    const totalPnL = ((this.currentBalance - this.initialBalance) / this.initialBalance) * 100;
    const drawdown = ((this.peakBalance - this.currentBalance) / this.peakBalance) * 100;
    
    console.log(`
[Risk Manager] Trade Recorded:
  PnL: ${profit.toFixed(4)} SOL (${percentChange.toFixed(2)}%)
  Reason: ${exitReason}
  Consecutive Losses: ${this.consecutiveLosses}
  Current Balance: ${this.currentBalance.toFixed(4)} SOL
  Total PnL: ${totalPnL.toFixed(2)}%
  Current Drawdown: ${drawdown.toFixed(2)}%
    `.trim());
  }
  
  /**
   * Get current risk statistics
   */
  getStatistics() {
    const totalTrades = this.tradeHistory.length;
    const winningTrades = this.tradeHistory.filter(t => t.profit > 0).length;
    const losingTrades = this.tradeHistory.filter(t => t.profit < 0).length;
    const totalProfit = this.tradeHistory.reduce((sum, t) => sum + t.profit, 0);
    const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
    const drawdown = ((this.peakBalance - this.currentBalance) / this.peakBalance) * 100;
    const dailyLoss = ((this.dailyStartBalance - this.currentBalance) / this.dailyStartBalance) * 100;
    
    return {
      totalTrades,
      winningTrades,
      losingTrades,
      winRate: winRate.toFixed(2) + '%',
      totalProfit: totalProfit.toFixed(4) + ' SOL',
      currentBalance: this.currentBalance.toFixed(4) + ' SOL',
      peakBalance: this.peakBalance.toFixed(4) + ' SOL',
      drawdown: drawdown.toFixed(2) + '%',
      dailyLoss: dailyLoss.toFixed(2) + '%',
      consecutiveLosses: this.consecutiveLosses,
      canTrade: this.canTrade(),
      emergencyStopActive: this.emergencyStopActive
    };
  }
  
  /**
   * Reset daily statistics (call at start of each trading day)
   */
  resetDaily(): void {
    this.dailyStartBalance = this.currentBalance;
    console.log('[Risk Manager] Daily statistics reset');
  }
  
  /**
   * Reset emergency stop (manual intervention required)
   */
  resetEmergencyStop(): void {
    this.emergencyStopActive = false;
    console.log('[Risk Manager] Emergency stop reset');
  }
  
  /**
   * Get recent trade history
   */
  getRecentTrades(limit: number = 10): TradeRecord[] {
    return this.tradeHistory.slice(-limit);
  }
}

/**
 * Default conservative risk configuration
 * Based on Freqtrade recommended settings for volatile assets
 */
export const CONSERVATIVE_RISK: RiskConfig = {
  maxPositionSize: 0.02, // 2% per trade
  minPositionSize: 0.01, // 0.01 SOL minimum
  maxDailyLoss: 0.05, // 5% daily max loss
  maxSessionLoss: 0.10, // 10% session max loss
  maxConsecutiveLosses: 3,
  maxDrawdown: 0.15, // 15% max drawdown
  lossCooldownMinutes: 15,
  consecutiveLossCooldownMinutes: 60,
  enableEmergencyStop: true,
  emergencyStopLoss: 0.25 // 25% total loss triggers emergency stop
};

/**
 * Moderate risk configuration
 */
export const MODERATE_RISK: RiskConfig = {
  maxPositionSize: 0.05, // 5% per trade
  minPositionSize: 0.01,
  maxDailyLoss: 0.08,
  maxSessionLoss: 0.15,
  maxConsecutiveLosses: 4,
  maxDrawdown: 0.20,
  lossCooldownMinutes: 10,
  consecutiveLossCooldownMinutes: 45,
  enableEmergencyStop: true,
  emergencyStopLoss: 0.30
};

/**
 * Aggressive risk configuration (NOT RECOMMENDED for memecoins)
 */
export const AGGRESSIVE_RISK: RiskConfig = {
  maxPositionSize: 0.10, // 10% per trade
  minPositionSize: 0.01,
  maxDailyLoss: 0.12,
  maxSessionLoss: 0.20,
  maxConsecutiveLosses: 5,
  maxDrawdown: 0.25,
  lossCooldownMinutes: 5,
  consecutiveLossCooldownMinutes: 30,
  enableEmergencyStop: true,
  emergencyStopLoss: 0.40
};
