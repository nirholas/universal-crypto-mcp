/**
 * CLI Interface for Memecoin Trading Bot
 * Author: nich (@nirholas) - x.com/nichxbt
 */

import { Command } from 'commander'
import chalk from 'chalk'
import ora from 'ora'
import { MemecoinTradingBot } from './bot'
import { config } from './config/config'
import { TokenAnalyzer } from './services/analyzer'
import { TradingStrategy } from './services/strategy'
import { Database } from './services/database'
import chalk from 'chalk'
import ora from 'ora'
import { config } from './config/config'

const program = new Command()

program
  .name('memecoin-bot')
  .description('Memecoin trading bot CLI')
  .version('1.0.0')

// Start command
program
  .command('start')
  .description('Start the trading bot')
  .action(async () => {
    const bot = new TradingBot()
    
    process.on('SIGINT', async () => {
      await bot.cleanup()
      process.exit(0)
    })
    
    await bot.start()
  })

// Monitor command
program
  .command('monitor')
  .description('Monitor bot performance without trading')
  .action(async () => {
    const db = new Database()
    
    console.log(chalk.cyan.bold('\n📊 Bot Monitor\n'))
    
    // Display stats every 5 seconds
    setInterval(async () => {
      const stats = await db.getStats()
      const positions = await db.getOpenPositions()
      
      console.clear()
      console.log(chalk.cyan.bold('📊 Bot Statistics'))
      console.log(chalk.gray('─'.repeat(60)))
      console.log(`Total Trades: ${stats.totalTrades}`)
      console.log(`Win Rate: ${stats.winRate.toFixed(2)}%`)
      
      const pnlColor = stats.totalPnl >= 0 ? chalk.green : chalk.red
      console.log(pnlColor(`Total PnL: ${stats.totalPnl.toFixed(4)} SOL`))
      console.log(`Daily PnL: ${stats.dailyPnl.toFixed(4)} SOL`)
      console.log(`Active Positions: ${stats.activePositions}`)
      console.log(chalk.gray('─'.repeat(60)))
      
      if (positions.length > 0) {
        console.log(chalk.cyan('\n📈 Open Positions'))
        console.log(chalk.gray('─'.repeat(60)))
        
        for (const pos of positions) {
          const pnlColor = pos.pnl >= 0 ? chalk.green : chalk.red
          console.log(
            `${pos.symbol.padEnd(10)} | ` +
            `Entry: $${pos.entryPrice.toFixed(6)} | ` +
            `Current: $${pos.currentPrice.toFixed(6)} | ` +
            pnlColor(`PnL: ${pos.pnlPercent.toFixed(2)}%`)
          )
        }
      }
      
      console.log(chalk.gray(`\nLast updated: ${new Date().toLocaleTimeString()}`))
    }, 5000)
  })

// Analyze command
program
  .command('analyze <token>')
  .description('Analyze a token')
  .action(async (token: string) => {
    const spinner = ora('Analyzing token...').start()
    
    const solana = new SolanaService()
    const jupiter = new JupiterService(solana)
    const dexScreener = new DexScreenerService()
    const analyzer = new TokenAnalyzer(solana)
    const strategy = new TradingStrategy(analyzer, dexScreener)
    
    try {
      // Safety check
      spinner.text = 'Running safety checks...'
      const safety = await analyzer.analyzeToken(token)
      
      // Get signal
      spinner.text = 'Evaluating trading signal...'
      const signal = await strategy.evaluateToken(token)
      
      spinner.succeed('Analysis complete')
      
      console.log(chalk.cyan.bold('\n🔍 Token Analysis'))
      console.log(chalk.gray('─'.repeat(60)))
      console.log(`Token: ${token}`)
      console.log(chalk.gray('─'.repeat(60)))
      
      console.log(chalk.cyan('\n🛡️  Safety Check'))
      const safetyColor = safety.isSafe ? chalk.green : chalk.red
      console.log(safetyColor(`Status: ${safety.isSafe ? 'SAFE' : 'UNSAFE'}`))
      console.log(`Score: ${safety.score}/100`)
      
      if (safety.issues.length > 0) {
        console.log(chalk.red('\nIssues:'))
        safety.issues.forEach(issue => console.log(chalk.red(`  • ${issue}`)))
      }
      
      if (safety.warnings.length > 0) {
        console.log(chalk.yellow('\nWarnings:'))
        safety.warnings.forEach(warning => console.log(chalk.yellow(`  • ${warning}`)))
      }
      
      console.log(chalk.cyan('\n📊 Metrics'))
      console.log(`Liquidity: $${signal.metrics.liquidity.toLocaleString()}`)
      console.log(`Market Cap: $${signal.metrics.marketCap.toLocaleString()}`)
      console.log(`Volume 24h: $${signal.metrics.volume24h.toLocaleString()}`)
      console.log(`Holders: ${signal.metrics.holders}`)
      console.log(`Price Change 24h: ${signal.metrics.priceChange24h.toFixed(2)}%`)
      
      console.log(chalk.cyan('\n🎯 Trading Signal'))
      const actionColor = signal.action === 'buy' ? chalk.green : 
                          signal.action === 'sell' ? chalk.red : chalk.yellow
      console.log(actionColor(`Action: ${signal.action.toUpperCase()}`))
      console.log(`Confidence: ${signal.confidence}%`)
      console.log('\nReasons:')
      signal.reasons.forEach(reason => console.log(`  • ${reason}`))
      
    } catch (error: any) {
      spinner.fail('Analysis failed')
      console.error(chalk.red(`Error: ${error.message}`))
    }
  })

// Balance command
program
  .command('balance')
  .description('Check wallet balance')
  .action(async () => {
    const solana = new SolanaService()
    
    const spinner = ora('Fetching balance...').start()
    
    try {
      const balance = await solana.getBalance()
      spinner.succeed('Balance fetched')
      
      console.log(chalk.cyan.bold('\n💰 Wallet Balance'))
      console.log(chalk.gray('─'.repeat(60)))
      console.log(`Address: ${solana.getPublicKey().toString()}`)
      console.log(chalk.green(`Balance: ${balance.toFixed(4)} SOL`))
    } catch (error: any) {
      spinner.fail('Failed to fetch balance')
      console.error(chalk.red(`Error: ${error.message}`))
    }
  })

// Stats command
program
  .command('stats')
  .description('Show bot statistics')
  .action(async () => {
    const bot = new TradingBot()
    await bot.getStats()
  })

// Buy command (manual)
program
  .command('buy <token> <amount>')
  .description('Manually buy a token')
  .action(async (token: string, amount: string) => {
    const spinner = ora('Executing buy...').start()
    
    const solana = new SolanaService()
    const jupiter = new JupiterService(solana)
    
    try {
      const result = await jupiter.buy(token, parseFloat(amount))
      
      if (result.success) {
        spinner.succeed('Buy successful')
        console.log(chalk.green(`\n✅ Purchase complete`))
        console.log(`TX: ${result.signature}`)
        console.log(`Amount: ${result.amountOut} tokens`)
        console.log(`Price: ${result.price}`)
      } else {
        spinner.fail('Buy failed')
        console.error(chalk.red(`Error: ${result.error}`))
      }
    } catch (error: any) {
      spinner.fail('Buy failed')
      console.error(chalk.red(`Error: ${error.message}`))
    }
  })

// Sell command (manual)
program
  .command('sell <token> <amount>')
  .description('Manually sell a token')
  .action(async (token: string, amount: string) => {
    const spinner = ora('Executing sell...').start()
    
    const solana = new SolanaService()
    const jupiter = new JupiterService(solana)
    
    try {
      const result = await jupiter.sell(token, amount)
      
      if (result.success) {
        spinner.succeed('Sell successful')
        console.log(chalk.green(`\n✅ Sell complete`))
        console.log(`TX: ${result.signature}`)
        console.log(`Received: ${parseFloat(result.amountOut) / 1e9} SOL`)
      } else {
        spinner.fail('Sell failed')
        console.error(chalk.red(`Error: ${result.error}`))
      }
    } catch (error: any) {
      spinner.fail('Sell failed')
      console.error(chalk.red(`Error: ${error.message}`))
    }
  })

program.parse()
