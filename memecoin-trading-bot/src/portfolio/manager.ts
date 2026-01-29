import { Position, Portfolio, Trade, TokenInfo } from '../types.js';
import { config } from '../config.js';
import { logger } from '../utils/logger.js';
import { riskManager } from '../risk/manager.js';
import { v4 as uuidv4 } from 'uuid';

export class PortfolioManager {
  private positions: Map<string, Position> = new Map();
  private trades: Trade[] = [];
  private initialCapital: number;
  private availableBalance: number;

  constructor() {
    this.initialCapital = config.initialCapital;
    this.availableBalance = config.initialCapital;
    logger.info(`Portfolio initialized with $${this.initialCapital}`);
  }

  addPosition(token: TokenInfo, entryPrice: number, amount: number, txHash: string): Position {
    const position: Position = {
      id: uuidv4(),
      token,
      entryPrice,
      currentPrice: entryPrice,
      amount,
      value: entryPrice * amount,
      pnl: 0,
      pnlPercent: 0,
      entryTime: Date.now(),
      stopLoss: riskManager.calculateStopLoss(entryPrice),
      takeProfit: riskManager.calculateTakeProfit(entryPrice),
    };

    this.positions.set(token.address, position);
    this.availableBalance -= position.value;

    const trade: Trade = {
      id: uuidv4(),
      type: 'BUY',
      token,
      price: entryPrice,
      amount,
      value: position.value,
      fee: position.value * 0.003, // Assume 0.3% fee
      txHash,
      timestamp: Date.now(),
      reason: 'Entry signal',
    };

    this.trades.push(trade);

    logger.info(
      `Position opened: ${token.symbol} | Entry: $${entryPrice.toFixed(6)} | Amount: ${amount.toFixed(4)} | Value: $${position.value.toFixed(2)}`
    );

    return position;
  }

  closePosition(tokenAddress: string, exitPrice: number, txHash: string, reason: string): Position | null {
    const position = this.positions.get(tokenAddress);
    if (!position) {
      logger.warn(`No position found for ${tokenAddress}`);
      return null;
    }

    const exitValue = exitPrice * position.amount;
    const pnl = exitValue - position.value;
    const pnlPercent = (pnl / position.value) * 100;

    this.availableBalance += exitValue;
    this.positions.delete(tokenAddress);

    const trade: Trade = {
      id: uuidv4(),
      type: 'SELL',
      token: position.token,
      price: exitPrice,
      amount: position.amount,
      value: exitValue,
      fee: exitValue * 0.003,
      txHash,
      timestamp: Date.now(),
      reason,
    };

    this.trades.push(trade);
    riskManager.updateDailyPnl(pnl);

    const holdTime = (Date.now() - position.entryTime) / 1000 / 60; // minutes

    logger.info(
      `Position closed: ${position.token.symbol} | Exit: $${exitPrice.toFixed(6)} | P&L: $${pnl.toFixed(2)} (${pnlPercent.toFixed(2)}%) | Hold: ${holdTime.toFixed(1)}m | Reason: ${reason}`
    );

    return {
      ...position,
      currentPrice: exitPrice,
      value: exitValue,
      pnl,
      pnlPercent,
    };
  }

  updatePositionPrices(prices: Map<string, number>): void {
    for (const [address, position] of this.positions.entries()) {
      const currentPrice = prices.get(address);
      if (currentPrice) {
        position.currentPrice = currentPrice;
        position.value = currentPrice * position.amount;
        position.pnl = position.value - position.entryPrice * position.amount;
        position.pnlPercent = (position.pnl / (position.entryPrice * position.amount)) * 100;
      }
    }
  }

  getPosition(tokenAddress: string): Position | undefined {
    return this.positions.get(tokenAddress);
  }

  getAllPositions(): Position[] {
    return Array.from(this.positions.values());
  }

  getPortfolio(): Portfolio {
    const positions = this.getAllPositions();
    const positionsValue = positions.reduce((sum, p) => sum + p.value, 0);
    const totalValue = this.availableBalance + positionsValue;
    
    const totalPnl = totalValue - this.initialCapital;
    const dailyMetrics = riskManager.getDailyMetrics();

    return {
      totalValue,
      availableBalance: this.availableBalance,
      positions,
      dailyPnl: dailyMetrics.pnl,
      totalPnl,
    };
  }

  getTrades(limit: number = 50): Trade[] {
    return this.trades.slice(-limit);
  }

  getStats(): {
    totalTrades: number;
    winningTrades: number;
    losingTrades: number;
    winRate: number;
    avgWin: number;
    avgLoss: number;
    profitFactor: number;
  } {
    const sellTrades = this.trades.filter(t => t.type === 'SELL');
    const winningTrades = sellTrades.filter((_, i) => {
      const buyTrade = this.trades.find(
        t => t.type === 'BUY' && t.token.address === sellTrades[i].token.address
      );
      return buyTrade && sellTrades[i].price > buyTrade.price;
    });

    const losingTrades = sellTrades.filter((_, i) => {
      const buyTrade = this.trades.find(
        t => t.type === 'BUY' && t.token.address === sellTrades[i].token.address
      );
      return buyTrade && sellTrades[i].price <= buyTrade.price;
    });

    const wins = winningTrades.length;
    const losses = losingTrades.length;
    const totalTrades = sellTrades.length;
    const winRate = totalTrades > 0 ? (wins / totalTrades) * 100 : 0;

    let totalWin = 0;
    let totalLoss = 0;

    sellTrades.forEach(sellTrade => {
      const buyTrade = this.trades.find(
        t => t.type === 'BUY' && t.token.address === sellTrade.token.address
      );
      if (buyTrade) {
        const pnl = (sellTrade.price - buyTrade.price) * sellTrade.amount;
        if (pnl > 0) totalWin += pnl;
        else totalLoss += Math.abs(pnl);
      }
    });

    const avgWin = wins > 0 ? totalWin / wins : 0;
    const avgLoss = losses > 0 ? totalLoss / losses : 0;
    const profitFactor = totalLoss > 0 ? totalWin / totalLoss : totalWin > 0 ? Infinity : 0;

    return {
      totalTrades,
      winningTrades: wins,
      losingTrades: losses,
      winRate,
      avgWin,
      avgLoss,
      profitFactor,
    };
  }

  setAvailableBalance(balance: number): void {
    this.availableBalance = balance;
  }
}

export const portfolioManager = new PortfolioManager();
