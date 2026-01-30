import { PublicKey } from '@solana/web3.js';
import { SolanaClient } from './solana-client';
import { PumpFunClient } from './pump-fun-client';
import { JupiterClient } from './jupiter-client';
import { TokenAnalyzer } from './token-analyzer';
import { TradingStrategy } from './strategy';
import { RiskManager, CONSERVATIVE_RISK, RiskConfig } from './risk-manager';
import { Backtester } from './backtester';

/**
 * IMPORTANT SAFETY NOTICE:
 * 
 * This bot integrates proven risk management from battle-tested open-source projects:
 * - Freqtrade (15k+ stars, MIT License): Risk management, position sizing, protections
 * - Jesse AI (MIT License): Backtesting framework concepts
 * - CCXT (28k+ stars, MIT License): Exchange abstraction layer
 * 
 * ALWAYS:
 * 1. Start with DRY RUN mode
 * 2. Test with SMALL amounts
 * 3. Use CONSERVATIVE risk settings
 * 4. Monitor trades CLOSELY
 * 5. Set EMERGENCY STOP levels
 * 
 * Trading memecoins is EXTREMELY RISKY. Only trade what you can afford to lose.
 */
import type { Position, TradeConfig, TradingSignal } from './types';
import * as dotenv from 'dotenv';

dotenv.config();

export class MemecoinTradingBot {
  private solana: SolanaClient;
  private pumpFun: PumpFunClient;
  private jupiter: JupiterClient;
  private analyzer: TokenAnalyzer;
  private strategy: TradingStrategy;
  private riskManager: RiskManager;
  private positions: Map<string, Position> = new Map();
  private config: TradeConfig;
  private isRunning = false;
  private dryRun: boolean;

  constructor(config: TradeConfig, riskConfig: RiskConfig = CONSERVATIVE_RISK, dryRun: boolean = false) {
    this.config = config;
    this.dryRun = dryRun;
    this.riskManager = new RiskManager(riskConfig, 0); // Will update balance in start()

    const rpcUrl = process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
    const privateKey = process.env.WALLET_PRIVATE_KEY || '';

    if (!privateKey) {
      throw new Error('WALLET_PRIVATE_KEY not set in environment');
    }

    this.solana = new SolanaClient(rpcUrl, privateKey);
    this.pumpFun = new PumpFunClient(this.solana);
    this.jupiter = new JupiterClient(this.solana);
    this.analyzer = new TokenAnalyzer(this.solana);
    this.strategy = new TradingStrategy(config);

    if (dryRun) {
      console.log('🧪 DRY-RUN MODE: No real trades will be executed');
    }
  }

  async start(): Promise<void> {
    this.isRunning = true;
    
    // Initialize risk manager with current balance
    const balance = await this.solana.getBalance();
    this.riskManager = new RiskManager(this.riskManager['config'], balance);
    
    console.log('🤖 Memecoin Trading Bot Started');
    console.log(`💰 Wallet: ${this.solana.getPublicKey().toBase58()}`);
    console.log(`💵 Balance: ${balance} SOL`);
    console.log(`🛡️ Risk Profile: ${this.riskManager['config'].maxPositionSizePercent * 100}% position size, ${this.riskManager['config'].maxDailyLossPercent * 100}% daily loss limit`);
    console.log(`${this.dryRun ? '🧪 DRY-RUN MODE ACTIVE' : '⚠️ LIVE TRADING ACTIVE'}\n`);

    // Monitor new tokens
    this.monitorNewTokens();

    // Monitor existing positions
    this.monitorPositions();
  }

  stop(): void {
    this.isRunning = false;
    console.log('🛑 Bot stopped');
  }

  private async monitorNewTokens(): Promise<void> {
    while (this.isRunning) {
      try {
        const newTokens = await this.pumpFun.getNewTokens(20);

        for (const token of newTokens) {
          if (this.positions.has(token.mint)) continue;

          // Quick analysis for sniping opportunities
          const analysis = await this.analyzer.analyzeToken(token.mint);

          if (!analysis.info) continue;

          // Check if we should snipe
          const { shouldSnipe, reason } = this.strategy.analyzeSnipe(
            analysis.info,
            analysis.rugAnalysis
          );

          if (shouldSnipe) {
            console.log(`🎯 SNIPE OPPORTUNITY: ${token.symbol}`);
            console.log(`   Reason: ${reason}`);
            await this.executeBuy(token.mint, this.config.snipeAmount, 60); // Moderate confidence for snipes
          } else {
            // Regular analysis
            const signal = this.strategy.analyze(
              analysis.info,
              analysis.rugAnalysis,
              analysis.social
            );

            if (signal.action === 'BUY' && signal.confidence >= 70) {
              console.log(`\n📊 SIGNAL: ${signal.action} ${token.symbol}`);
              console.log(`   Confidence: ${signal.confidence}%`);
              console.log(`   Reason: ${signal.reason}`);
              
              await this.executeBuy(token.mint, this.config.buyAmount, signal.confidence);
            }
          }

          // Rate limiting
          await this.sleep(1000);
        }

        await this.sleep(10000); // Check every 10 seconds
      } catch (error) {
        console.error('Error monitoring new tokens:', error);
        await this.sleep(5000);
      }
    }
  }

  private async monitorPositions(): Promise<void> {
    while (this.isRunning) {
      try {
        for (const [mint, position] of this.positions.entries()) {
          const currentPrice = await this.getCurrentPrice(mint);
          
          position.currentPrice = currentPrice;
          position.value = position.amount * currentPrice;
          position.pnl = position.value - (position.amount * position.entryPrice);
          position.pnlPercent = ((currentPrice - position.entryPrice) / position.entryPrice) * 100;

          console.log(`\n💼 Position: ${mint.slice(0, 8)}...`);
          console.log(`   Entry: $${position.entryPrice.toFixed(8)}`);
          console.log(`   Current: $${currentPrice.toFixed(8)}`);
          console.log(`   PnL: ${position.pnlPercent.toFixed(2)}% ($${position.pnl.toFixed(4)})`);

          // Check take profit
          if (this.strategy.shouldTakeProfit(position.entryPrice, currentPrice)) {
            console.log(`✅ TAKE PROFIT triggered at +${position.pnlPercent.toFixed(2)}%`);
            await this.executeSell(mint, position.amount);
          }
          // Check stop loss
          else if (this.strategy.shouldStopLoss(position.entryPrice, currentPrice)) {
            console.log(`🛑 STOP LOSS triggered at ${position.pnlPercent.toFixed(2)}%`);
            await this.executeSell(mint, position.amount);
          }
        }

        await this.sleep(30000); // Check positions every 30 seconds
      } catch (error) {
        console.error('Error monitoring positions:', error);
        await this.sleep(10000);
      }
    }
  }

  private async executeBuy(mint: string, amount: number, confidence: number = 50): Promise<void> {
    try {
      // Check risk manager approval FIRST
      if (!this.riskManager.canTrade()) {
        const stats = this.riskManager.getStatistics();
        console.log(`\n⚠️ RISK MANAGER BLOCKED TRADE`);
        console.log(`   Reason: ${stats.consecutiveLosses >= 3 ? 'Too many consecutive losses' : 'Daily/session loss limit reached'}`);
        console.log(`   Current Drawdown: ${stats.maxDrawdown.toFixed(2)}%`);
        console.log(`   Daily Loss: ${((stats.initialBalance - stats.currentBalance) / stats.initialBalance * 100).toFixed(2)}%`);
        return;
      }

      // Calculate position size based on risk management
      const currentPrice = await this.getCurrentPrice(mint);
      const calculatedAmount = this.riskManager.calculatePositionSize(currentPrice, confidence / 100);
      const finalAmount = Math.min(amount, calculatedAmount);

      console.log(`\n🔵 Executing BUY: ${mint}`);
      console.log(`   Requested: ${amount} SOL`);
      console.log(`   Risk-Adjusted: ${finalAmount.toFixed(4)} SOL (confidence: ${confidence}%)`);

      if (this.dryRun) {
        console.log(`🧪 DRY-RUN: Would buy ${finalAmount.toFixed(4)} SOL worth of tokens`);
        console.log(`   Simulated entry price: $${currentPrice.toFixed(8)}`);
        
        // Record simulated position
        const position: Position = {
          token: mint,
          mint: new PublicKey(mint),
          entryPrice: currentPrice,
          currentPrice: currentPrice,
          amount: finalAmount / currentPrice,
          value: finalAmount,
          pnl: 0,
          pnlPercent: 0,
          entryTime: Date.now(),
        };
        this.positions.set(mint, position);
        return;
      }

      // Check balance
      const balance = await this.solana.getBalance();
      if (balance < finalAmount) {
        console.log(`❌ Insufficient balance: ${balance} SOL`);
        return;
      }

      // Try Pump.fun first
      let signature: string;
      let tokensBought: number;

      try {
        const mintPk = new PublicKey(mint);
        signature = await this.pumpFun.buy(mintPk, finalAmount, this.config.maxSlippage);
        tokensBought = await this.solana.getTokenBalance(mintPk);
      } catch (error) {
        console.log('   Pump.fun failed, trying Jupiter...');
        signature = await this.jupiter.buyToken(mint, finalAmount, this.config.maxSlippage);
        const mintPk = new PublicKey(mint);
        tokensBought = await this.solana.getTokenBalance(mintPk);
      }

      const price = await this.getCurrentPrice(mint);

      // Record position
      const position: Position = {
        token: mint,
        mint: new PublicKey(mint),
        entryPrice: price,
        currentPrice: price,
        amount: tokensBought,
        value: tokensBought * price,
        pnl: 0,
        pnlPercent: 0,
        entryTime: Date.now(),
      };

      this.positions.set(mint, position);

      console.log(`✅ BUY SUCCESS`);
      console.log(`   Tx: ${signature}`);
      console.log(`   Tokens: ${tokensBought.toLocaleString()}`);
      console.log(`   Entry Price: $${price.toFixed(8)}`);
    } catch (error) {
      console.error(`❌ BUY FAILED:`, error);
    }
  }

  private async executeSell(mint: string, amount: number, reason: string = 'Manual'): Promise<void> {
    try {
      const position = this.positions.get(mint);
      if (!position) {
        console.log(`❌ No position found for ${mint}`);
        return;
      }

      console.log(`\n🔴 Executing SELL: ${mint}`);
      console.log(`   Amount: ${amount.toLocaleString()} tokens`);
      console.log(`   Reason: ${reason}`);

      const currentPrice = await this.getCurrentPrice(mint);
      const solReceived = (amount * currentPrice) / 1e9; // Estimate SOL received

      if (this.dryRun) {
        console.log(`🧪 DRY-RUN: Would sell ${amount.toLocaleString()} tokens`);
        console.log(`   Simulated exit price: $${currentPrice.toFixed(8)}`);
        console.log(`   Estimated SOL: ${solReceived.toFixed(4)}`);
        
        // Record trade in risk manager
        this.riskManager.recordTrade(
          position.entryPrice,
          currentPrice,
          amount,
          0.002, // Simulated 0.2% fee
          reason
        );
        
        const stats = this.riskManager.getStatistics();
        console.log(`\n📊 Risk Manager Stats:`);
        console.log(`   Total Trades: ${stats.totalTrades}`);
        console.log(`   Win Rate: ${stats.winRate.toFixed(1)}%`);
        console.log(`   Total PnL: ${stats.totalPnL.toFixed(4)} SOL`);
        console.log(`   Max Drawdown: ${stats.maxDrawdown.toFixed(2)}%`);
        
        this.positions.delete(mint);
        return;
      }

      let signature: string;

      try {
        const mintPk = new PublicKey(mint);
        signature = await this.pumpFun.sell(mintPk, amount, this.config.maxSlippage);
      } catch (error) {
        console.log('   Pump.fun failed, trying Jupiter...');
        signature = await this.jupiter.sellToken(mint, amount, this.config.maxSlippage);
      }

      // Record trade in risk manager
      this.riskManager.recordTrade(
        position.entryPrice,
        currentPrice,
        amount,
        0.002, // Estimate 0.2% fees
        reason
      );

      console.log(`✅ SELL SUCCESS`);
      console.log(`   Tx: ${signature}`);
      console.log(`   Final PnL: ${position.pnlPercent.toFixed(2)}% ($${position.pnl.toFixed(4)})`);
      console.log(`   Hold Time: ${((Date.now() - position.entryTime) / 60000).toFixed(1)} minutes`);

      // Show risk manager statistics
      const stats = this.riskManager.getStatistics();
      console.log(`\n📊 Risk Manager Stats:`);
      console.log(`   Total Trades: ${stats.totalTrades}`);
      console.log(`   Win Rate: ${stats.winRate.toFixed(1)}%`);
      console.log(`   Total PnL: ${stats.totalPnL.toFixed(4)} SOL`);
      console.log(`   Consecutive ${stats.consecutiveLosses > 0 ? 'Losses' : 'Wins'}: ${stats.consecutiveLosses || stats.consecutiveWins}`);
      console.log(`   Max Drawdown: ${stats.maxDrawdown.toFixed(2)}%`);

      this.positions.delete(mint);
    } catch (error) {
      console.error(`❌ SELL FAILED:`, error);
    }
  }

  private async getCurrentPrice(mint: string): Promise<number> {
    try {
      return await this.jupiter.getPrice(mint);
    } catch (error) {
      const mintPk = new PublicKey(mint);
      return await this.pumpFun.getBondingCurvePrice(mintPk);
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  getPositions(): Position[] {
    return Array.from(this.positions.values());
  }

  async getPortfolioValue(): Promise<number> {
    let total = await this.solana.getBalance();
    
    for (const position of this.positions.values()) {
      total += position.value;
    }

    return total;
  }
}

// CLI Entry Point
if (import.meta.url === `file://${process.argv[1]}`) {
  const config: TradeConfig = {
    maxSlippage: 10,
    buyAmount: parseFloat(process.env.BUY_AMOUNT || '0.1'),
    takeProfit: parseFloat(process.env.TAKE_PROFIT || '50'),
    stopLoss: parseFloat(process.env.STOP_LOSS || '30'),
    maxPositionSize: parseFloat(process.env.MAX_POSITION || '1'),
    minLiquidity: parseFloat(process.env.MIN_LIQUIDITY || '5000'),
    maxRugRisk: parseFloat(process.env.MAX_RUG_RISK || '30'),
    enableSniping: process.env.ENABLE_SNIPING === 'true',
    snipeAmount: parseFloat(process.env.SNIPE_AMOUNT || '0.05'),
  };

  const bot = new MemecoinTradingBot(config);

  bot.start().catch(console.error);

  process.on('SIGINT', () => {
    bot.stop();
    process.exit(0);
  });
}

export default MemecoinTradingBot;
