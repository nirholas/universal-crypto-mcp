import { PublicKey } from '@solana/web3.js';
import { SolanaClient } from './solana-client';
import { PumpFunClient } from './pump-fun-client';
import { JupiterClient } from './jupiter-client';
import { TokenAnalyzer } from './token-analyzer';
import { TradingStrategy } from './strategy';
import type { Position, TradeConfig, TradingSignal } from './types';
import * as dotenv from 'dotenv';

dotenv.config();

export class MemecoinTradingBot {
  private solana: SolanaClient;
  private pumpFun: PumpFunClient;
  private jupiter: JupiterClient;
  private analyzer: TokenAnalyzer;
  private strategy: TradingStrategy;
  private positions: Map<string, Position> = new Map();
  private config: TradeConfig;
  private isRunning = false;

  constructor(config: TradeConfig) {
    this.config = config;

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
  }

  async start(): Promise<void> {
    this.isRunning = true;
    console.log('🤖 Memecoin Trading Bot Started');
    console.log(`💰 Wallet: ${this.solana.getPublicKey().toBase58()}`);
    console.log(`💵 Balance: ${await this.solana.getBalance()} SOL\n`);

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
            await this.executeBuy(token.mint, this.config.snipeAmount);
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
              
              await this.executeBuy(token.mint, this.config.buyAmount);
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

  private async executeBuy(mint: string, amount: number): Promise<void> {
    try {
      console.log(`\n🔵 Executing BUY: ${mint}`);
      console.log(`   Amount: ${amount} SOL`);

      // Check balance
      const balance = await this.solana.getBalance();
      if (balance < amount) {
        console.log(`❌ Insufficient balance: ${balance} SOL`);
        return;
      }

      // Try Pump.fun first
      let signature: string;
      let tokensBought: number;

      try {
        const mintPk = new PublicKey(mint);
        signature = await this.pumpFun.buy(mintPk, amount, this.config.maxSlippage);
        tokensBought = await this.solana.getTokenBalance(mintPk);
      } catch (error) {
        console.log('   Pump.fun failed, trying Jupiter...');
        signature = await this.jupiter.buyToken(mint, amount, this.config.maxSlippage);
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

  private async executeSell(mint: string, amount: number): Promise<void> {
    try {
      console.log(`\n🔴 Executing SELL: ${mint}`);
      console.log(`   Amount: ${amount.toLocaleString()} tokens`);

      let signature: string;

      try {
        const mintPk = new PublicKey(mint);
        signature = await this.pumpFun.sell(mintPk, amount, this.config.maxSlippage);
      } catch (error) {
        console.log('   Pump.fun failed, trying Jupiter...');
        signature = await this.jupiter.sellToken(mint, amount, this.config.maxSlippage);
      }

      const position = this.positions.get(mint);
      if (position) {
        console.log(`✅ SELL SUCCESS`);
        console.log(`   Tx: ${signature}`);
        console.log(`   Final PnL: ${position.pnlPercent.toFixed(2)}% ($${position.pnl.toFixed(4)})`);
        console.log(`   Hold Time: ${((Date.now() - position.entryTime) / 60000).toFixed(1)} minutes`);
      }

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
