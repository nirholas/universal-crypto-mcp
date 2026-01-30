# Usage Guide - Memecoin Trading Bot

## Quick Start

### 1. Paper Trading (ALWAYS START HERE!)

```bash
# Test the bot with fake money
npm run trade -- --paper-trading

# Use conservative settings
npm run trade -- --paper-trading --config conservative

# Run for specific duration
npm run trade -- --paper-trading --duration 24h
```

**Why paper trading?**
- No risk
- Learn how the bot works
- Test your configuration
- See realistic results
- Find problems before they cost money

**Run paper trading for at least 7 days before considering real money.**

### 2. Monitor Mode (Read-Only)

```bash
# Watch tokens without trading
npm run trade -- --monitor

# See what the bot would trade
npm run trade -- --dry-run
```

### 3. Real Trading (After Extensive Testing)

```bash
# Start with minimal amount
npm run trade -- --max-position 0.1

# Use conservative configuration
npm run trade -- --config conservative

# Full auto mode
npm run trade -- start
```

## Command Reference

### Starting the Bot

```bash
# Paper trading mode (safe)
npm run trade -- --paper-trading

# Real trading with limits
npm run trade -- start --max-daily-loss 1.0

# With specific configuration
npm run trade -- start --config ./my-config.json

# Background mode (tmux/screen recommended)
npm run trade -- start --daemon
```

### Monitoring

```bash
# Check current status
npm run trade -- status

# View open positions
npm run trade -- positions

# See recent trades
npm run trade -- history

# Show detailed statistics
npm run trade -- stats

# View logs in real-time
npm run trade -- logs --follow
```

### Managing Positions

```bash
# Close all positions
npm run trade -- close-all

# Close specific position
npm run trade -- close <tokenAddress>

# Emergency stop (closes all and stops)
npm run trade -- emergency-stop
```

### Analysis Tools

```bash
# Analyze token before trading
npm run trade -- analyze <tokenAddress>

# Check token safety score
npm run trade -- safety-check <tokenAddress>

# View market conditions
npm run trade -- market-overview
```

## Configuration Examples

### Conservative Setup (Recommended for Beginners)

```bash
# Create config file
cat > conservative-config.json << EOF
{
  "maxPositionSize": 0.1,
  "stopLoss": 5,
  "takeProfit": 15,
  "trailingStop": 5,
  "maxDailyLoss": 0.5,
  "minLiquidity": 50000,
  "maxMarketCap": 500000,
  "minHolders": 100
}
EOF

# Use it
npm run trade -- start --config conservative-config.json
```

### Moderate Setup (Balanced Risk/Reward)

```bash
cat > moderate-config.json << EOF
{
  "maxPositionSize": 0.5,
  "stopLoss": 10,
  "takeProfit": 30,
  "trailingStop": 10,
  "maxDailyLoss": 2.0,
  "minLiquidity": 25000,
  "maxMarketCap": 1000000,
  "minHolders": 50
}
EOF

npm run trade -- start --config moderate-config.json
```

### Aggressive Setup (High Risk - Experts Only)

```bash
cat > aggressive-config.json << EOF
{
  "maxPositionSize": 1.0,
  "stopLoss": 15,
  "takeProfit": 50,
  "trailingStop": 15,
  "maxDailyLoss": 5.0,
  "minLiquidity": 10000,
  "maxMarketCap": 2000000,
  "minHolders": 20
}
EOF

npm run trade -- start --config aggressive-config.json
```

## Common Workflows

### Testing a New Strategy

```bash
# 1. Start with paper trading
npm run trade -- --paper-trading --config my-strategy.json

# 2. Run for 1 week minimum
# Monitor daily

# 3. Review results
npm run trade -- stats --paper

# 4. If profitable after 7+ days, consider small real test
npm run trade -- start --config my-strategy.json --max-position 0.05
```

### Daily Monitoring Routine

```bash
# Morning check
npm run trade -- status
npm run trade -- positions
npm run trade -- stats

# Check for errors
npm run trade -- logs --level error

# Review overnight trades
npm run trade -- history --since yesterday
```

### Weekly Review

```bash
# Generate comprehensive report
npm run trade -- report --period week

# Export trade data
npm run trade -- export --format csv --output trades-week.csv

# Analyze performance
npm run trade -- analyze-performance
```

## Environment Variables

You can override config with environment variables:

```bash
# Use different RPC
SOLANA_RPC_URL=https://my-rpc.com npm run trade -- start

# Adjust position size
MAX_POSITION_SIZE=0.2 npm run trade -- start

# Enable debug logging
LOG_LEVEL=debug npm run trade -- start

# Paper trading with custom balance
PAPER_TRADING_BALANCE=100 npm run trade -- --paper-trading
```

## Running in Production

### Using tmux (Recommended)

```bash
# Start new tmux session
tmux new -s memecoin-bot

# Start the bot
npm run trade -- start

# Detach: Press Ctrl+B, then D

# Reattach later
tmux attach -t memecoin-bot
```

### Using screen

```bash
# Start new screen session
screen -S memecoin-bot

# Start the bot
npm run trade -- start

# Detach: Press Ctrl+A, then D

# Reattach later
screen -r memecoin-bot
```

### Using PM2 (Process Manager)

```bash
# Install PM2
npm install -g pm2

# Start bot with PM2
pm2 start "npm run trade -- start" --name memecoin-bot

# Monitor
pm2 monit

# View logs
pm2 logs memecoin-bot

# Stop
pm2 stop memecoin-bot

# Restart
pm2 restart memecoin-bot
```

## Logging

### View Logs

```bash
# Follow live logs
tail -f logs/bot.log

# Filter for errors
grep ERROR logs/bot.log

# View last 100 lines
tail -n 100 logs/bot.log

# Search for specific token
grep "TokenMintAddress" logs/bot.log
```

### Log Levels

```bash
# Minimal output
npm run trade -- start --log-level error

# Normal output
npm run trade -- start --log-level info

# Detailed output
npm run trade -- start --log-level debug

# Everything
npm run trade -- start --log-level trace
```

## Troubleshooting

### Bot Won't Start

```bash
# Check configuration
npm run trade -- validate-config

# Test RPC connection
npm run trade -- test-connection

# Verify wallet
npm run trade -- check-wallet

# View detailed errors
npm run trade -- start --log-level debug
```

### Can't Execute Trades

```bash
# Check balances
npm run trade -- balance

# Test swap manually
npm run trade -- test-swap --token <address> --amount 0.01

# Verify Jupiter API
npm run trade -- test-jupiter
```

### High Slippage

```bash
# Reduce position size
npm run trade -- start --max-position 0.05

# Use only liquid DEXes
npm run trade -- start --dexes Raydium,Orca

# Increase slippage tolerance (carefully!)
npm run trade -- start --max-slippage 2.0
```

## Safety Commands

### Emergency Procedures

```bash
# Stop immediately
Ctrl+C

# Or from another terminal
npm run trade -- stop

# Force stop if unresponsive
npm run trade -- kill

# Close all positions now
npm run trade -- emergency-exit
```

### Pre-Flight Checks

```bash
# Before starting, always run:
npm run trade -- preflight

# This checks:
# - Configuration valid
# - RPC connection working
# - Wallet has funds
# - APIs accessible
# - Database initialized
```

## Backup and Recovery

### Backup Database

```bash
# Manual backup
cp data/bot.db data/bot-backup-$(date +%Y%m%d).db

# Automated backup script
npm run trade -- backup --destination ./backups
```

### Export Data

```bash
# Export all trades
npm run trade -- export --type trades --format json

# Export positions
npm run trade -- export --type positions --format csv

# Export configuration
npm run trade -- export-config
```

### Restore from Backup

```bash
# Stop bot first
npm run trade -- stop

# Restore database
cp backups/bot-20240125.db data/bot.db

# Verify
npm run trade -- verify-database

# Restart
npm run trade -- start
```

## Tips and Best Practices

### Start Small
```bash
# First real money trade
npm run trade -- start --max-position 0.05 --max-daily-loss 0.2
```

### Monitor Actively
```bash
# Set up monitoring dashboard
npm run trade -- dashboard
```

### Regular Backups
```bash
# Add to crontab for daily backups
0 0 * * * cd /path/to/bot && npm run trade -- backup
```

### Test Changes
```bash
# Always test config changes in paper mode first
npm run trade -- --paper-trading --config new-config.json
```

## Getting Help

### Check Documentation First
- [SAFETY.md](SAFETY.md) - Critical safety information
- [CREDITS.md](CREDITS.md) - Attribution and licenses
- [README.md](README.md) - Overview and installation

### Diagnostic Information
```bash
# Generate diagnostic report
npm run trade -- diagnostics > diagnostics.txt

# Include this when asking for help
```

### Report Issues
- GitHub Issues: Include sanitized logs and configuration
- Never share private keys
- Include bot version and OS

## Advanced Usage

### Custom Scripts

```javascript
// custom-strategy.js
const bot = require('./dist/bot')

bot.on('newToken', async (token) => {
  // Your custom logic
  console.log('New token:', token.address)
})

bot.start()
```

### API Integration

```javascript
// monitor-api.js
const express = require('express')
const bot = require('./dist/bot')

const app = express()

app.get('/status', (req, res) => {
  res.json(bot.getStatus())
})

app.listen(3000)
```

---

Remember: **Always start with paper trading mode. Test extensively before risking real funds.**

Need help? Read [SAFETY.md](SAFETY.md) and check the logs first!
