/**
 * Example: Monitor Specific Tokens
 * Author: nich (@nirholas) - x.com/nichxbt
 */

import { DexScreenerService } from '../services/dexscreener'
import { JupiterService } from '../services/jupiter'
import { SolanaService } from '../services/solana'
import { config, WSOL } from '../config/config'
import chalk from 'chalk'

// Tokens to monitor (add your own)
const WATCHLIST = [
  'So11111111111111111111111111111111111111112', // WSOL
  'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC
  // Add more token addresses here
]

async function monitorTokens() {
  console.log(chalk.cyan.bold('\n👀 Token Watchlist Monitor\n'))
  
  const solana = new SolanaService()
  const jupiter = new JupiterService(solana.getConnection(), solana.getWallet())
  const dexScreener = new DexScreenerService()
  
  const previousPrices = new Map<string, number>()
  
  // Monitor loop
  setInterval(async () => {
    console.clear()
    console.log(chalk.cyan.bold('👀 Token Watchlist Monitor'))
    console.log(chalk.gray(`Updated: ${new Date().toLocaleTimeString()}\n`))
    console.log(chalk.gray('─'.repeat(80)))
    
    for (const token of WATCHLIST) {
      try {
        // Get metrics
        const metrics = await dexScreener.getTokenMetrics(token)
        
        if (!metrics) {
          console.log(chalk.gray(`${token.slice(0, 8)}... | No data`))
          continue
        }
        
        // Get current price
        const price = await jupiter.getPrice(token, 'So11111111111111111111111111111111111111112')
        
        // Calculate change since last check
        const previousPrice = previousPrices.get(token)
        let changePercent = 0
        
        if (previousPrice && previousPrice > 0) {
          changePercent = ((price - previousPrice) / previousPrice) * 100
        }
        
        previousPrices.set(token, price)
        
        // Format output
        const changeColor = changePercent >= 0 ? chalk.green : chalk.red
        const changeSymbol = changePercent >= 0 ? '▲' : '▼'
        
        console.log(
          `${token.slice(0, 8)}... | ` +
          `Price: $${price.toFixed(8)} | ` +
          changeColor(`${changeSymbol} ${Math.abs(changePercent).toFixed(2)}% `) + `| ` +
          `Vol: $${(metrics.volume24h / 1000).toFixed(1)}K | ` +
          `Liq: $${(metrics.liquidity / 1000).toFixed(1)}K | ` +
          `24h: ${metrics.priceChange24h.toFixed(2)}%`
        )
        
        // Alert on significant moves
        if (Math.abs(changePercent) >= 5) {
          console.log(chalk.yellow(`  ⚠️  ${Math.abs(changePercent).toFixed(2)}% move detected!`))
        }
        
      } catch (error: any) {
        console.log(chalk.red(`${token.slice(0, 8)}... | Error: ${error.message}`))
      }
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
    
    console.log(chalk.gray('─'.repeat(80)))
    
  }, 10000) // Update every 10 seconds
}

monitorTokens().catch(console.error)
