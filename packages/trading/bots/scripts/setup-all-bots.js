#!/usr/bin/env node

/**
 * Setup Script for Trading Bot Integrations
 * 
 * This script clones and sets up all MIT-licensed trading bots
 * while maintaining proper attribution to original authors.
 * 
 * @maintainer Nicholas (nirholas)
 * @github https://github.com/nirholas
 * @twitter https://x.com/nichxbt
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const BOTS = [
  {
    id: 'crypto-signal',
    repo: 'https://github.com/CryptoSignal/Crypto-Signal.git',
    dir: 'crypto-signal-integration',
  },
  {
    id: 'tradingview-webhook',
    repo: 'https://github.com/fabston/TradingView-Webhook-Bot.git',
    dir: 'tradingview-webhook',
  },
  {
    id: 'binance-sentiment',
    repo: 'https://github.com/CyberPunkMetalHead/Binance-News-Sentiment-Bot.git',
    dir: 'binance-sentiment',
  },
  {
    id: 'intelligent-trading',
    repo: 'https://github.com/asavinov/intelligent-trading-bot.git',
    dir: 'intelligent-trading',
  },
  {
    id: 'algotrading-framework',
    repo: 'https://github.com/ivopetiz/algotrading.git',
    dir: 'algotrading-framework',
  },
  {
    id: 'python-advanced',
    repo: 'https://github.com/Roibal/Cryptocurrency-Trading-Bots-Python-Beginner-Advance.git',
    dir: 'python-advanced',
  },
  {
    id: 'gateio-announcements',
    repo: 'https://github.com/CyberPunkMetalHead/gateio-crypto-trading-bot-binance-announcements-new-coins.git',
    dir: 'gateio-announcements',
  },
  {
    id: 'crypto-arbitrage',
    repo: 'https://github.com/kelvinau/crypto-arbitrage.git',
    dir: 'crypto-arbitrage',
  },
  {
    id: 'crypto-trader-lib',
    repo: 'https://github.com/pirate/crypto-trader.git',
    dir: 'crypto-trader-lib',
  },
  {
    id: 'alpha-rptr',
    repo: 'https://github.com/TheFourGreatErrors/alpha-rptr.git',
    dir: 'alpha-rptr',
  },
]

console.log('🤖 Universal Crypto MCP - Trading Bot Setup')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('Integration maintained by: Nicholas (@nirholas)')
console.log('GitHub: https://github.com/nirholas')
console.log('Twitter: https://x.com/nichxbt')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

const botsDir = path.join(__dirname, '..')

BOTS.forEach((bot, index) => {
  console.log(`\n[${index + 1}/${BOTS.length}] Setting up ${bot.id}...`)
  
  const botPath = path.join(botsDir, bot.dir)
  
  // Skip if already exists
  if (fs.existsSync(botPath)) {
    console.log(`  ✓ Already exists at ${bot.dir}`)
    return
  }

  try {
    // Clone the repository
    console.log(`  📥 Cloning from ${bot.repo}`)
    execSync(`git clone ${bot.repo} ${botPath}`, {
      stdio: 'ignore',
    })
    
    // Create attribution file
    const attributionPath = path.join(botPath, 'INTEGRATION-ATTRIBUTION.md')
    const attribution = `# Integration Attribution

This project is part of Universal Crypto MCP's trading bot integrations.

## Original Project
This is a clone of an open-source project. All rights belong to the original authors.

**Original Repository:** ${bot.repo}
**License:** MIT (see LICENSE file in this directory)
**Original Authors:** See original repository for contributor list

## Integration Information
**Integrated by:** Nicholas (nirholas)
**Integration Repository:** https://github.com/nirholas/universal-crypto-mcp
**GitHub:** https://github.com/nirholas
**Twitter:** https://x.com/nichxbt

## Purpose
This integration provides a unified interface to access this bot through the
Universal Crypto MCP server, enabling AI agents like Claude to interact with it.

## License Compliance
- All original copyright notices are preserved
- Original LICENSE file is maintained
- This integration respects the MIT license terms
- Proper attribution is given to original authors

## How to Use
See the main README.md in the parent directory for integration instructions.

**Note:** This integration does not claim ownership of the original code.
All credit goes to the original project authors and contributors.
`

    fs.writeFileSync(attributionPath, attribution)
    
    console.log(`  ✓ Successfully cloned to ${bot.dir}`)
    console.log(`  ✓ Added integration attribution file`)
    
  } catch (error) {
    console.error(`  ✗ Failed to clone ${bot.id}:`, error.message)
  }
})

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('✨ Setup complete!')
console.log('\n📚 Next steps:')
console.log('  1. Review individual bot documentation in each directory')
console.log('  2. Configure API keys as needed')
console.log('  3. Run bots through the unified MCP interface')
console.log('\n🙏 Remember to star the original projects on GitHub!')
console.log('   All integrated bots are created and maintained by their')
console.log('   respective authors. This is just an integration layer.\n')
