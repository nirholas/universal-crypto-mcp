/**
 * Main Entry Point for Memecoin Trading Bot
 * Author: nich (@nirholas) - x.com/nichxbt
 */

import { TradingBot } from './bot'
import chalk from 'chalk'

async function main() {
  console.log(chalk.cyan.bold('\n🚀 Memecoin Trading Bot'))
  console.log(chalk.gray('by nich (@nirholas) - x.com/nichxbt\n'))
  
  const bot = new TradingBot()
  
  // Handle graceful shutdown
  process.on('SIGINT', async () => {
    console.log(chalk.yellow('\n\n⏸️  Shutting down...'))
    await bot.cleanup()
    process.exit(0)
  })
  
  process.on('SIGTERM', async () => {
    console.log(chalk.yellow('\n\n⏸️  Shutting down...'))
    await bot.cleanup()
    process.exit(0)
  })
  
  // Start the bot
  await bot.start()
}

main().catch((error) => {
  console.error(chalk.red('Fatal error:'), error)
  process.exit(1)
})
