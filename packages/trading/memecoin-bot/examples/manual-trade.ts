/**
 * Example: Manual Trading Strategy
 * Author: nich (@nirholas) - x.com/nichxbt
 */

import { SolanaService } from '../services/solana'
import { JupiterService } from '../services/jupiter'
import { TokenAnalyzer } from '../services/analyzer'
import { config } from '../config/config'
import chalk from 'chalk'

async function manualTrade() {
  console.log(chalk.cyan.bold('\n🎯 Manual Token Analysis & Trade\n'))
  
  // Token address to analyze
  const TOKEN_ADDRESS = '7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr' // Replace with target token
  
  const solana = new SolanaService()
  const jupiter = new JupiterService(solana.getConnection(), solana.getWallet())
  const analyzer = new TokenAnalyzer(solana)
  
  try {
    // Step 1: Safety Analysis
    console.log(chalk.blue('🛡️  Running safety checks...'))
    const safetyCheck = await analyzer.analyzeToken(TOKEN_ADDRESS)
    
    console.log(chalk.gray('─'.repeat(60)))
    console.log(`Safety Score: ${safetyCheck.score}/100`)
    console.log(`Status: ${safetyCheck.isSafe ? chalk.green('SAFE') : chalk.red('UNSAFE')}`)
    
    if (safetyCheck.issues.length > 0) {
      console.log(chalk.red('\n⚠️  Issues Found:'))
      safetyCheck.issues.forEach(issue => console.log(chalk.red(`  • ${issue}`)))
    }
    
    if (safetyCheck.warnings.length > 0) {
      console.log(chalk.yellow('\n⚠️  Warnings:'))
      safetyCheck.warnings.forEach(warning => console.log(chalk.yellow(`  • ${warning}`)))
    }
    
    // Step 2: Check if honeypot
    console.log(chalk.blue('\n🍯 Checking for honeypot...'))
    const isHoneypot = await analyzer.isHoneypot(TOKEN_ADDRESS)
    console.log(`Honeypot Risk: ${isHoneypot ? chalk.red('HIGH') : chalk.green('LOW')}`)
    
    // Step 3: Get current price
    console.log(chalk.blue('\n💰 Fetching price...'))
    const price = await jupiter.getPrice(TOKEN_ADDRESS, 'So11111111111111111111111111111111111111112')
    console.log(`Current Price: ${price}`)
    
    // Step 4: Decision
    console.log(chalk.cyan('\n\n📋 Analysis Summary'))
    console.log(chalk.gray('─'.repeat(60)))
    
    if (!safetyCheck.isSafe) {
      console.log(chalk.red('❌ RECOMMENDATION: DO NOT TRADE'))
      console.log(chalk.red('Token failed safety checks'))
      return
    }
    
    if (isHoneypot) {
      console.log(chalk.red('❌ RECOMMENDATION: DO NOT TRADE'))
      console.log(chalk.red('High honeypot risk detected'))
      return
    }
    
    console.log(chalk.green('✅ RECOMMENDATION: SAFE TO TRADE'))
    console.log(chalk.gray('\nTo execute trade:'))
    console.log(chalk.gray(`  pnpm trade buy ${TOKEN_ADDRESS} 0.1`))
    
  } catch (error: any) {
    console.error(chalk.red(`\n❌ Error: ${error.message}`))
  }
}

manualTrade().catch(console.error)
