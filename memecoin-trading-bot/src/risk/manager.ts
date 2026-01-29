import { Portfolio, Position, RiskAssessment, TokenInfo, PriceData } from '../types.js';
import { config } from '../config.js';
import { logger } from '../utils/logger.js';

export class RiskManager {
  private dailyTrades: number = 0;
  private dailyPnl: number = 0;
  private lastResetDate: string = new Date().toDateString();

  resetDailyMetrics(): void {
    const today = new Date().toDateString();
    if (today !== this.lastResetDate) {
      this.dailyTrades = 0;
      this.dailyPnl = 0;
      this.lastResetDate = today;
      logger.info('Daily metrics reset');
    }
  }

  assessTradeRisk(
    portfolio: Portfolio,
    token: TokenInfo,
    priceData: PriceData,
    action: 'BUY' | 'SELL'
  ): RiskAssessment {
    this.resetDailyMetrics();

    const reasons: string[] = [];
    let allowed = true;

    // Check daily loss limit
    const dailyLossLimit = config.initialCapital * (config.maxDailyLossPercent / 100);
    if (Math.abs(this.dailyPnl) >= dailyLossLimit && this.dailyPnl < 0) {
      allowed = false;
      reasons.push(`Daily loss limit reached: $${Math.abs(this.dailyPnl).toFixed(2)}`);
    }

    // Check concurrent positions limit
    if (action === 'BUY' && portfolio.positions.length >= config.maxConcurrentPositions) {
      allowed = false;
      reasons.push(`Max concurrent positions reached: ${portfolio.positions.length}`);
    }

    // Check liquidity requirement
    if (priceData.liquidity < config.minLiquidityUsd) {
      allowed = false;
      reasons.push(`Insufficient liquidity: $${priceData.liquidity.toFixed(0)} < $${config.minLiquidityUsd}`);
    }

    // Check if already have position in this token
    if (action === 'BUY') {
      const existingPosition = portfolio.positions.find(p => p.token.address === token.address);
      if (existingPosition) {
        allowed = false;
        reasons.push(`Already have position in ${token.symbol}`);
      }
    }

    // Calculate position size
    const maxPositionValue = portfolio.totalValue * (config.maxPositionSizePercent / 100);
    const positionSize = Math.min(maxPositionValue, portfolio.availableBalance * 0.9);

    // Check if enough balance
    if (action === 'BUY' && positionSize > portfolio.availableBalance) {
      allowed = false;
      reasons.push(`Insufficient balance: $${portfolio.availableBalance.toFixed(2)}`);
    }

    // Calculate confidence score (0-100)
    let confidence = 100;
    
    // Reduce confidence for low liquidity
    if (priceData.liquidity < config.minLiquidityUsd * 2) {
      confidence -= 20;
      reasons.push('Low liquidity reduces confidence');
    }

    // Reduce confidence for high volatility
    if (Math.abs(priceData.priceChange24h) > 50) {
      confidence -= 15;
      reasons.push('High volatility reduces confidence');
    }

    // Boost confidence for high volume
    if (priceData.volume24h > priceData.liquidity * 0.5) {
      confidence += 10;
      reasons.push('High volume increases confidence');
    }

    confidence = Math.max(0, Math.min(100, confidence));

    if (allowed) {
      reasons.push(`Position size: $${positionSize.toFixed(2)}`);
      reasons.push(`Confidence: ${confidence}%`);
    }

    return {
      allowed,
      reasons,
      positionSize,
      confidence,
    };
  }

  updateDailyPnl(pnl: number): void {
    this.dailyPnl += pnl;
    this.dailyTrades++;
    logger.info(`Daily P&L updated: $${this.dailyPnl.toFixed(2)} (${this.dailyTrades} trades)`);
  }

  shouldStopLoss(position: Position): boolean {
    return position.currentPrice <= position.stopLoss;
  }

  shouldTakeProfit(position: Position): boolean {
    return position.currentPrice >= position.takeProfit;
  }

  calculateStopLoss(entryPrice: number): number {
    return entryPrice * (1 - config.stopLossPercent / 100);
  }

  calculateTakeProfit(entryPrice: number): number {
    return entryPrice * (1 + config.takeProfitPercent / 100);
  }

  getDailyMetrics(): { trades: number; pnl: number } {
    this.resetDailyMetrics();
    return {
      trades: this.dailyTrades,
      pnl: this.dailyPnl,
    };
  }
}

export const riskManager = new RiskManager();
