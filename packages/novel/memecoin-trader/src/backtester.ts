/**
 * Backtesting & Dry Run Module
 * 
 * Based on backtesting concepts from Jesse (MIT License) and Freqtrade
 * https://github.com/jesse-ai/jesse
 * https://github.com/freqtrade/freqtrade
 * 
 * Allows testing strategies without risking real funds
 */

import { TokenAnalyzer } from './token-analyzer';
import { TradingStrategy } from './strategy';
import { RiskManager, RiskConfig } from './risk-manager';

export interface BacktestConfig {
  startBalance: number;
  startDate: Date;
  endDate: Date;
  dryRun: boolean; // If true, simulates trades without execution
  logTrades: boolean;
}

export interface BacktestResult {
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  totalProfit: number;
  totalLoss: number;
  netProfit: number;
  maxDrawdown: number;
  sharpeRatio: number;
  profitFactor: number;
  averageWin: number;
  averageLoss: number;
  largestWin: number;
  largestLoss: number;
  trades: BacktestTrade[];
}

export interface BacktestTrade {
  timestamp: number;
  token: string;
  type: 'BUY' | 'SELL';
  price: number;
  amount: number;
  confidence: number;
  profit?: number;
  percentChange?: number;
  holdTime?: number;
  exitReason?: string;
}

export class Backtester {
  private config: BacktestConfig;
  private analyzer: TokenAnalyzer;
  private strategy: TradingStrategy;
  private riskManager: RiskManager;
  private trades: BacktestTrade[] = [];
  private openPositions: Map<string, BacktestTrade> = new Map();
  
  constructor(
    config: BacktestConfig,
    riskConfig: RiskConfig,
    analyzer: TokenAnalyzer,
    strategy: TradingStrategy
  ) {
    this.config = config;
    this.analyzer = analyzer;
    this.strategy = strategy;
    this.riskManager = new RiskManager(riskConfig, config.startBalance);
  }
  
  /**
   * Run backtest on historical data
   */
  async runBacktest(historicalData: any[]): Promise<BacktestResult> {
    console.log(`
[Backtester] Starting backtest...
  Period: ${this.config.startDate.toISOString()} to ${this.config.endDate.toISOString()}
  Starting Balance: ${this.config.startBalance} SOL
  Mode: ${this.config.dryRun ? 'DRY RUN' : 'SIMULATED'}
    `.trim());
    
    for (const dataPoint of historicalData) {
      await this.processDataPoint(dataPoint);
    }
    
    // Close any remaining open positions
    this.closeAllPositions('Backtest ended');
    
    return this.generateResults();
  }
  
  /**
   * Process a single data point (candle/tick)
   */
  private async processDataPoint(data: any): Promise<void> {
    const { token, price, timestamp } = data;
    
    // Check if we have an open position for this token
    const openPosition = this.openPositions.get(token);
    
    if (openPosition) {
      // Check exit conditions
      const shouldExit = await this.checkExitConditions(openPosition, price);
      if (shouldExit.exit) {
        this.closePosition(token, price, timestamp, shouldExit.reason);
      }
    } else {
      // Check entry conditions
      const shouldEnter = await this.checkEntryConditions(token, price, data);
      if (shouldEnter.enter && this.riskManager.canTrade()) {
        this.openPosition(token, price, timestamp, shouldEnter.confidence);
      }
    }
  }
  
  /**
   * Check if we should enter a position
   */
  private async checkEntryConditions(
    token: string,
    price: number,
    data: any
  ): Promise<{ enter: boolean; confidence: number }> {
    try {
      // Analyze token
      const analysis = await this.analyzer.analyzeToken(token);
      
      // Get trading signal
      const signal = await this.strategy.analyze(analysis);
      
      if (signal.action === 'BUY') {
        return { enter: true, confidence: signal.confidence };
      }
      
      return { enter: false, confidence: 0 };
    } catch (error) {
      return { enter: false, confidence: 0 };
    }
  }
  
  /**
   * Check if we should exit a position
   */
  private async checkExitConditions(
    position: BacktestTrade,
    currentPrice: number
  ): Promise<{ exit: boolean; reason: string }> {
    const percentChange = ((currentPrice - position.price) / position.price) * 100;
    
    // Take profit
    if (percentChange >= 50) {
      return { exit: true, reason: 'Take profit hit' };
    }
    
    // Stop loss
    if (percentChange <= -10) {
      return { exit: true, reason: 'Stop loss hit' };
    }
    
    // Time-based exit (24 hours max hold)
    const holdTime = Date.now() - position.timestamp;
    if (holdTime > 24 * 60 * 60 * 1000) {
      return { exit: true, reason: 'Max hold time reached' };
    }
    
    return { exit: false, reason: '' };
  }
  
  /**
   * Open a new position
   */
  private openPosition(
    token: string,
    price: number,
    timestamp: number,
    confidence: number
  ): void {
    const amount = this.riskManager.calculatePositionSize(price, confidence);
    
    if (amount === 0) {
      return;
    }
    
    const trade: BacktestTrade = {
      timestamp,
      token,
      type: 'BUY',
      price,
      amount,
      confidence
    };
    
    this.openPositions.set(token, trade);
    this.trades.push(trade);
    
    if (this.config.logTrades) {
      console.log(`[Backtest] BUY ${token} @ ${price} (Amount: ${amount}, Confidence: ${(confidence * 100).toFixed(0)}%)`);
    }
  }
  
  /**
   * Close a position
   */
  private closePosition(
    token: string,
    exitPrice: number,
    timestamp: number,
    exitReason: string
  ): void {
    const openTrade = this.openPositions.get(token);
    if (!openTrade) return;
    
    const profit = (exitPrice - openTrade.price) * openTrade.amount;
    const percentChange = ((exitPrice - openTrade.price) / openTrade.price) * 100;
    const holdTime = timestamp - openTrade.timestamp;
    
    const closeTrade: BacktestTrade = {
      timestamp,
      token,
      type: 'SELL',
      price: exitPrice,
      amount: openTrade.amount,
      confidence: openTrade.confidence,
      profit,
      percentChange,
      holdTime,
      exitReason
    };
    
    this.trades.push(closeTrade);
    this.openPositions.delete(token);
    
    // Update risk manager
    this.riskManager.recordTrade(
      openTrade.price,
      exitPrice,
      openTrade.amount,
      0, // No fees in backtest for simplicity
      exitReason
    );
    
    if (this.config.logTrades) {
      console.log(`[Backtest] SELL ${token} @ ${exitPrice} | PnL: ${profit.toFixed(4)} SOL (${percentChange.toFixed(2)}%) | Reason: ${exitReason}`);
    }
  }
  
  /**
   * Close all open positions
   */
  private closeAllPositions(reason: string): void {
    for (const [token, position] of this.openPositions.entries()) {
      this.closePosition(token, position.price, Date.now(), reason);
    }
  }
  
  /**
   * Generate backtest results
   */
  private generateResults(): BacktestResult {
    const completedTrades = this.trades.filter(t => t.type === 'SELL');
    const winningTrades = completedTrades.filter(t => t.profit! > 0);
    const losingTrades = completedTrades.filter(t => t.profit! <= 0);
    
    const totalProfit = winningTrades.reduce((sum, t) => sum + t.profit!, 0);
    const totalLoss = Math.abs(losingTrades.reduce((sum, t) => sum + t.profit!, 0));
    const netProfit = totalProfit - totalLoss;
    
    const averageWin = winningTrades.length > 0 ? totalProfit / winningTrades.length : 0;
    const averageLoss = losingTrades.length > 0 ? totalLoss / losingTrades.length : 0;
    
    const largestWin = winningTrades.length > 0 ? Math.max(...winningTrades.map(t => t.profit!)) : 0;
    const largestLoss = losingTrades.length > 0 ? Math.min(...losingTrades.map(t => t.profit!)) : 0;
    
    const winRate = completedTrades.length > 0 ? (winningTrades.length / completedTrades.length) * 100 : 0;
    const profitFactor = totalLoss > 0 ? totalProfit / totalLoss : 0;
    
    const stats = this.riskManager.getStatistics();
    
    const result: BacktestResult = {
      totalTrades: completedTrades.length,
      winningTrades: winningTrades.length,
      losingTrades: losingTrades.length,
      winRate,
      totalProfit,
      totalLoss,
      netProfit,
      maxDrawdown: parseFloat(stats.drawdown),
      sharpeRatio: 0, // Would need risk-free rate to calculate
      profitFactor,
      averageWin,
      averageLoss,
      largestWin,
      largestLoss,
      trades: completedTrades
    };
    
    this.printResults(result);
    
    return result;
  }
  
  /**
   * Print backtest results
   */
  private printResults(results: BacktestResult): void {
    console.log(`
╔═══════════════════════════════════════════════════════════╗
║                   BACKTEST RESULTS                        ║
╠═══════════════════════════════════════════════════════════╣
║ Total Trades:        ${results.totalTrades.toString().padStart(10)}                       ║
║ Winning Trades:      ${results.winningTrades.toString().padStart(10)}                       ║
║ Losing Trades:       ${results.losingTrades.toString().padStart(10)}                       ║
║ Win Rate:            ${results.winRate.toFixed(2).padStart(10)}%                      ║
╠═══════════════════════════════════════════════════════════╣
║ Total Profit:        ${results.totalProfit.toFixed(4).padStart(10)} SOL                  ║
║ Total Loss:          ${results.totalLoss.toFixed(4).padStart(10)} SOL                  ║
║ Net Profit:          ${results.netProfit.toFixed(4).padStart(10)} SOL                  ║
║ Profit Factor:       ${results.profitFactor.toFixed(2).padStart(10)}                       ║
╠═══════════════════════════════════════════════════════════╣
║ Average Win:         ${results.averageWin.toFixed(4).padStart(10)} SOL                  ║
║ Average Loss:        ${results.averageLoss.toFixed(4).padStart(10)} SOL                  ║
║ Largest Win:         ${results.largestWin.toFixed(4).padStart(10)} SOL                  ║
║ Largest Loss:        ${results.largestLoss.toFixed(4).padStart(10)} SOL                  ║
║ Max Drawdown:        ${results.maxDrawdown.toFixed(2).padStart(10)}%                      ║
╚═══════════════════════════════════════════════════════════╝
    `.trim());
  }
}
