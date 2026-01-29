import { config } from './config.js';
import { logger, notifier } from './utils/logger.js';
import { PancakeSwapClient } from './dex/pancakeswap.js';
import { RaydiumClient } from './dex/raydium.js';
import { IDexClient } from './dex/pancakeswap.js';
import { portfolioManager } from './portfolio/manager.js';
import { riskManager } from './risk/manager.js';
import { tradingStrategy } from './strategy/trading.js';
import { tokenScanner } from './scanner/tokens.js';
import { TokenInfo } from './types.js';
import cron from 'node-cron';

class MemecoinTradingBot {
  private dexClient: IDexClient;
  private isRunning: boolean = false;
  private scanInterval: NodeJS.Timeout | null = null;
  private watchedTokens: Set<string> = new Set();

  constructor() {
    // Initialize DEX client based on network
    if (config.network === 'bsc') {
      this.dexClient = new PancakeSwapClient();
      logger.info('Initialized with PancakeSwap on BSC');
    } else if (config.network === 'solana') {
      this.dexClient = new RaydiumClient();
      logger.info('Initialized with Raydium on Solana');
    } else {
      throw new Error(`Unsupported network: ${config.network}`);
    }

    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    process.on('SIGINT', () => this.shutdown());
    process.on('SIGTERM', () => this.shutdown());
    process.on('unhandledRejection', (error) => {
      logger.error('Unhandled rejection:', error);
    });
  }

  async start(): Promise<void> {
    logger.info('🚀 Starting Memecoin Trading Bot...');
    logger.info(`Network: ${config.network}`);
    logger.info(`Initial Capital: $${config.initialCapital}`);
    logger.info(`Max Position Size: ${config.maxPositionSizePercent}%`);
    logger.info(`Stop Loss: ${config.stopLossPercent}%`);
    logger.info(`Take Profit: ${config.takeProfitPercent}%`);

    await notifier.sendMessage('🤖 <b>Bot Started</b>\n' +
      `Network: ${config.network}\n` +
      `Capital: $${config.initialCapital}`
    );

    this.isRunning = true;

    // Sync initial balance
    await this.syncBalance();

    // Start main trading loop
    this.scanInterval = setInterval(() => this.mainLoop(), config.scanIntervalMs);

    // Schedule daily stats report
    cron.schedule('0 0 * * *', () => this.reportDailyStats());

    logger.info('✅ Bot is running');
  }

  private async mainLoop(): Promise<void> {
    try {
      // 1. Scan for trending tokens
      const trendingTokens = await tokenScanner.scanTrendingTokens(
        config.network as 'bsc' | 'solana',
        10
      );

      // 2. Check existing positions for exit signals
      await this.checkPositions();

      // 3. Analyze trending tokens for entry signals
      for (const token of trendingTokens) {
        if (this.watchedTokens.has(token.address)) {
          continue; // Already watching this token
        }

        await this.analyzeAndTrade(token);
        await this.sleep(500); // Rate limiting
      }

      // 4. Log portfolio status
      this.logPortfolioStatus();
    } catch (error) {
      logger.error('Error in main loop:', error);
    }
  }

  private async analyzeAndTrade(token: TokenInfo): Promise<void> {
    try {
      const priceData = await this.dexClient.getTokenPrice(token.address);
      
      // Generate trading signal
      const signal = tradingStrategy.analyzeToken(token, priceData);

      if (signal.type === 'BUY' && tradingStrategy.shouldEnter(signal)) {
        await this.executeBuy(token, priceData, signal.confidence);
      }
    } catch (error) {
      logger.error(`Failed to analyze ${token.symbol}:`, error);
    }
  }

  private async executeBuy(token: TokenInfo, priceData: any, confidence: number): Promise<void> {
    const portfolio = portfolioManager.getPortfolio();
    
    // Risk assessment
    const riskAssessment = riskManager.assessTradeRisk(portfolio, token, priceData, 'BUY');
    
    if (!riskAssessment.allowed) {
      logger.info(`❌ Buy rejected for ${token.symbol}: ${riskAssessment.reasons.join(', ')}`);
      return;
    }

    logger.info(`✅ Buy approved for ${token.symbol} with ${confidence}% confidence`);
    logger.info(`Risk: ${riskAssessment.reasons.join(' | ')}`);

    try {
      // Calculate amounts
      const positionValueUsd = riskAssessment.positionSize;
      const nativeAmount = config.network === 'bsc' ? positionValueUsd / 600 : positionValueUsd / 150; // Rough BNB/SOL prices
      const minTokenAmount = (nativeAmount * 0.98) / priceData.price; // 2% slippage

      // Execute trade
      const txHash = await this.dexClient.executeBuy(token, nativeAmount, minTokenAmount);

      // Get actual amount received (simplified - should parse transaction)
      const tokenAmount = minTokenAmount * 0.99; // Approximate

      // Add position
      portfolioManager.addPosition(token, priceData.price, tokenAmount, txHash);
      this.watchedTokens.add(token.address);

      await notifier.notifyTrade({
        type: 'BUY',
        token: token.symbol,
        price: priceData.price,
        amount: tokenAmount,
      });

      logger.info(`🟢 BUY executed: ${token.symbol} | ${tokenAmount.toFixed(4)} @ $${priceData.price.toFixed(6)} | TX: ${txHash}`);
    } catch (error) {
      logger.error(`Failed to execute buy for ${token.symbol}:`, error);
      await notifier.notifyAlert(`Failed to buy ${token.symbol}: ${error}`);
    }
  }

  private async checkPositions(): Promise<void> {
    const positions = portfolioManager.getAllPositions();
    
    if (positions.length === 0) {
      return;
    }

    // Update prices
    const prices = new Map<string, number>();
    for (const position of positions) {
      try {
        const priceData = await this.dexClient.getTokenPrice(position.token.address);
        prices.set(position.token.address, priceData.price);
      } catch (error) {
        logger.error(`Failed to get price for ${position.token.symbol}:`, error);
      }
    }

    portfolioManager.updatePositionPrices(prices);

    // Check for exit signals
    for (const position of positions) {
      const shouldExit = await this.shouldExitPosition(position);
      if (shouldExit.exit) {
        await this.executeSell(position, shouldExit.reason);
      }
    }
  }

  private async shouldExitPosition(position: any): Promise<{ exit: boolean; reason: string }> {
    // Check stop loss
    if (riskManager.shouldStopLoss(position)) {
      return { exit: true, reason: 'Stop loss triggered' };
    }

    // Check take profit
    if (riskManager.shouldTakeProfit(position)) {
      return { exit: true, reason: 'Take profit triggered' };
    }

    // Check technical exit signal
    try {
      const priceData = await this.dexClient.getTokenPrice(position.token.address);
      const signal = tradingStrategy.analyzeToken(position.token, priceData);
      
      if (tradingStrategy.shouldExit(signal)) {
        return { exit: true, reason: `Technical exit signal (${signal.confidence}% confidence)` };
      }
    } catch (error) {
      logger.error(`Failed to check exit signal for ${position.token.symbol}:`, error);
    }

    return { exit: false, reason: '' };
  }

  private async executeSell(position: any, reason: string): Promise<void> {
    try {
      logger.info(`Executing sell for ${position.token.symbol}: ${reason}`);

      const minNativeAmount = (position.amount * position.currentPrice * 0.98) / 
        (config.network === 'bsc' ? 600 : 150);

      const txHash = await this.dexClient.executeSell(
        position.token,
        position.amount,
        minNativeAmount
      );

      const closedPosition = portfolioManager.closePosition(
        position.token.address,
        position.currentPrice,
        txHash,
        reason
      );

      this.watchedTokens.delete(position.token.address);

      if (closedPosition) {
        await notifier.notifyTrade({
          type: 'SELL',
          token: position.token.symbol,
          price: position.currentPrice,
          amount: position.amount,
          pnl: closedPosition.pnl,
        });

        logger.info(`🔴 SELL executed: ${position.token.symbol} | P&L: $${closedPosition.pnl.toFixed(2)} (${closedPosition.pnlPercent.toFixed(2)}%) | TX: ${txHash}`);
      }
    } catch (error) {
      logger.error(`Failed to execute sell for ${position.token.symbol}:`, error);
      await notifier.notifyAlert(`Failed to sell ${position.token.symbol}: ${error}`);
    }
  }

  private async syncBalance(): Promise<void> {
    try {
      const balance = config.network === 'bsc' 
        ? await (this.dexClient as PancakeSwapClient).getNativeBalance()
        : await (this.dexClient as RaydiumClient).getSolBalance();

      const balanceUsd = balance * (config.network === 'bsc' ? 600 : 150);
      portfolioManager.setAvailableBalance(balanceUsd);
      logger.info(`💰 Balance synced: ${balance.toFixed(4)} ${config.network === 'bsc' ? 'BNB' : 'SOL'} ($${balanceUsd.toFixed(2)})`);
    } catch (error) {
      logger.error('Failed to sync balance:', error);
    }
  }

  private logPortfolioStatus(): void {
    const portfolio = portfolioManager.getPortfolio();
    const stats = portfolioManager.getStats();

    logger.info('📊 Portfolio Status:');
    logger.info(`  Total Value: $${portfolio.totalValue.toFixed(2)}`);
    logger.info(`  Available: $${portfolio.availableBalance.toFixed(2)}`);
    logger.info(`  Positions: ${portfolio.positions.length}`);
    logger.info(`  Daily P&L: $${portfolio.dailyPnl.toFixed(2)}`);
    logger.info(`  Total P&L: $${portfolio.totalPnl.toFixed(2)} (${((portfolio.totalPnl / config.initialCapital) * 100).toFixed(2)}%)`);
    logger.info(`  Win Rate: ${stats.winRate.toFixed(2)}% (${stats.winningTrades}W/${stats.losingTrades}L)`);
  }

  private async reportDailyStats(): Promise<void> {
    const portfolio = portfolioManager.getPortfolio();
    const stats = portfolioManager.getStats();

    const report = `📈 <b>Daily Report</b>\n\n` +
      `Total Value: $${portfolio.totalValue.toFixed(2)}\n` +
      `Daily P&L: $${portfolio.dailyPnl.toFixed(2)}\n` +
      `Total P&L: $${portfolio.totalPnl.toFixed(2)}\n` +
      `Win Rate: ${stats.winRate.toFixed(2)}%\n` +
      `Trades: ${stats.totalTrades}\n` +
      `Profit Factor: ${stats.profitFactor.toFixed(2)}`;

    await notifier.sendMessage(report);
    logger.info(report);
  }

  private async shutdown(): Promise<void> {
    logger.info('🛑 Shutting down bot...');
    this.isRunning = false;

    if (this.scanInterval) {
      clearInterval(this.scanInterval);
    }

    this.logPortfolioStatus();
    await notifier.sendMessage('🛑 <b>Bot Stopped</b>');

    process.exit(0);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Start the bot
const bot = new MemecoinTradingBot();
bot.start().catch((error) => {
  logger.error('Fatal error:', error);
  process.exit(1);
});
