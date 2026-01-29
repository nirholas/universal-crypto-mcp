/**
 * Example: Simple Backtest Script
 * Author: nich (@nirholas) - x.com/nichxbt
 */

import { DexScreenerService } from '../services/dexscreener'
import { TokenAnalyzer } from '../services/analyzer'
import { TradingStrategy } from '../services/strategy'
import { SolanaService } from '../services/solana'
import { config } from '../config/config'
import chalk from 'chalk'

interface BacktestResult {
  totalTrades: number
  wins: number
  losses: number
  winRate: number
  totalPnl: number
  averageProfit: number
  averageLoss: number
}

async function backtest() {
  console.log(chalk.cyan.bold('\n📊 Memecoin Strategy Backtest\n'))
  
  const solana = new SolanaService()
  const dexScreener = new DexScreenerService()
  const analyzer = new TokenAnalyzer(solana)
  const strategy = new TradingStrategy(analyzer, dexScreener)
  
  const results: BacktestResult = {
    totalTrades: 0,
    wins: 0,
    losses: 0,
    winRate: 0,
    totalPnl: 0,
    averageProfit: 0,
    averageLoss: 0
  }
  
  const trades: { pnl: number }[] = []
  
  console.log(chalk.gray('Fetching historical pairs...'))
  
  // Get recent pairs
  const pairs = await dexScreener.getNewPairs(100)
  
  console.log(chalk.gray(`Analyzing ${pairs.length} pairs...\n`))
  
  for (const pair of pairs) {
    try {
      // Evaluate token
      const signal = await strategy.evaluateToken(pair.tokenA)
      
      // Only consider buy signals
      const shouldBuy = await strategy.shouldBuy(signal)
      
      if (shouldBuy) {
        results.totalTrades++
        
        // Simulate trade outcome
        // In real backtest, you'd use historical price data
        const randomOutcome = Math.random()
        
        // 60% win rate simulation
        if (randomOutcome > 0.4) {
          // Win - random profit between 10% and 200%
          const profit = (Math.random() * 1.9 + 0.1) * config.buyAmount
          const pnl = profit - config.buyAmount
          
          results.wins++
          trades.push({ pnl })
          results.totalPnl += pnl
          
          console.log(
            chalk.green(`✅ ${pair.tokenA.slice(0, 8)}... | `) +
            chalk.green(`+${((pnl / config.buyAmount) * 100).toFixed(2)}%`)
          )
        } else {
          // Loss - stop loss at 20%
          const loss = config.stopLoss / 100
          const pnl = -config.buyAmount * loss
          
          results.losses++
          trades.push({ pnl })
          results.totalPnl += pnl
          
          console.log(
            chalk.red(`❌ ${pair.tokenA.slice(0, 8)}... | `) +
            chalk.red(`${((pnl / config.buyAmount) * 100).toFixed(2)}%`)
          )
        }
      }
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 500))
    } catch (error: any) {
      console.error(chalk.gray(`Skipped ${pair.tokenA}: ${error.message}`))
    }
  }
  
  // Calculate statistics
  if (results.totalTrades > 0) {
    results.winRate = (results.wins / results.totalTrades) * 100
    
    const profits = trades.filter(t => t.pnl > 0)
    const losses = trades.filter(t => t.pnl < 0)
    
    if (profits.length > 0) {
      results.averageProfit = profits.reduce((sum, t) => sum + t.pnl, 0) / profits.length
    }
    
    if (losses.length > 0) {
      results.averageLoss = losses.reduce((sum, t) => sum + t.pnl, 0) / losses.length
    }
  }
  
  // Display results
  console.log(chalk.cyan('\n\n📊 Backtest Results'))
  console.log(chalk.gray('─'.repeat(60)))
  console.log(`Total Trades: ${results.totalTrades}`)
  console.log(chalk.green(`Wins: ${results.wins}`))
  console.log(chalk.red(`Losses: ${results.losses}`))
  console.log(`Win Rate: ${results.winRate.toFixed(2)}%`)
  
  const pnlColor = results.totalPnl >= 0 ? chalk.green : chalk.red
  console.log(pnlColor(`\nTotal P&L: ${results.totalPnl.toFixed(4)} SOL`))
  console.log(chalk.green(`Average Profit: ${results.averageProfit.toFixed(4)} SOL`))
  console.log(chalk.red(`Average Loss: ${results.averageLoss.toFixed(4)} SOL`))
  
  const profitFactor = Math.abs(results.averageProfit * results.wins / (results.averageLoss * results.losses))
  console.log(`\nProfit Factor: ${profitFactor.toFixed(2)}`)
  console.log(chalk.gray('─'.repeat(60)))
}

backtest().catch(console.error)
