# ⚠️ SAFETY GUIDE - READ BEFORE TRADING ⚠️

## Critical Warning

**Memecoin trading is extremely risky. You can lose 100% of your investment.**

This bot does NOT:
- Guarantee profits
- Eliminate risk
- Make you rich

This bot DOES:
- Automate trading execution
- Apply risk management rules
- Provide market analysis tools

**Never invest more than you can afford to lose completely.**

## Pre-Trading Checklist

Before running the bot with real funds, ensure you have:

### 1. Tested in Paper Trading Mode ✅
```bash
# Always start here!
npm run trade -- --paper-trading
```

Run paper trading for at least 7 days to:
- Understand how the bot behaves
- Test your configuration
- See typical results
- Identify problems

### 2. Understood the Configuration ✅

Review every setting in your config:
- `maxPositionSize`: Maximum SOL per trade
- `stopLoss`: When to exit losing trades (%)
- `takeProfit`: When to take profits (%)
- `maxDailyLoss`: Circuit breaker limit
- `minLiquidity`: Minimum token liquidity required

**If you don't understand a setting, don't change it.**

### 3. Secured Your Private Key ✅

⚠️ **NEVER share your private key with anyone**

- Store in `.env` file (never commit to git)
- Use a dedicated wallet for trading
- Keep minimal funds in the trading wallet
- Never screenshot or paste your private key

### 4. Tested Your RPC Connection ✅

Use a reliable RPC provider:
- [Helius](https://helius.dev) (recommended)
- [QuickNode](https://quicknode.com)
- [Alchemy](https://alchemy.com)

Free public RPCs are:
- Slow
- Rate limited  
- Unreliable for trading

### 5. Understood Gas Fees ✅

Each trade costs:
- Transaction fee: ~0.00025 SOL
- Priority fee: 0.00001-0.0001 SOL
- DEX fees: 0.25-1% of trade value

Budget for ~100 trades to test properly.

## Risk Management Levels

### Conservative (Recommended for Beginners)
```typescript
import { CONSERVATIVE_CONFIG } from './src/config/safety-configs'
```

**Profile:**
- Max position: 0.1 SOL
- Stop loss: 5%
- Take profit: 15%
- Daily loss limit: 0.5 SOL

**Who it's for:**
- First-time bot users
- Learning the system
- Low-risk tolerance
- Small capital (<10 SOL)

**Expected results:**
- Lower returns
- Fewer trades
- Better safety
- Good for learning

### Moderate (Balanced Approach)
```typescript
import { MODERATE_CONFIG } from './src/config/safety-configs'
```

**Profile:**
- Max position: 0.5 SOL
- Stop loss: 10%
- Take profit: 30%
- Daily loss limit: 2 SOL

**Who it's for:**
- Experienced users
- Medium risk tolerance
- Some capital (10-50 SOL)
- Understand the risks

**Expected results:**
- Moderate returns
- Regular trades
- Balanced risk/reward
- Active monitoring needed

### Aggressive (High Risk)
```typescript
import { AGGRESSIVE_CONFIG } from './src/config/safety-configs'
```

**Profile:**
- Max position: 1 SOL
- Stop loss: 15%
- Take profit: 50%
- Daily loss limit: 5 SOL

**Who it's for:**
- Expert traders only
- High risk tolerance
- Larger capital (50+ SOL)
- Accept potential losses

**Expected results:**
- Higher potential returns
- More trades
- Higher risk
- Requires constant monitoring

⚠️ **WARNING**: Aggressive mode can lose money FAST. Only use if you:
- Have tested extensively in paper mode
- Can afford to lose the entire amount
- Monitor the bot actively

## Common Mistakes to Avoid

### 1. Starting with Real Money ❌
**Mistake**: "Let me try with just 1 SOL to see if it works"

**Problem**: You will likely lose it

**Solution**: Use paper trading mode first, no exceptions

### 2. Using Too Much Capital ❌
**Mistake**: "I'll put in 50 SOL to make good profits"

**Problem**: Large losses if something goes wrong

**Solution**: Start with minimal amount (1-5 SOL) even after testing

### 3. Ignoring Stop Losses ❌
**Mistake**: Disabling stop losses to "let winners run"

**Problem**: Small losses become catastrophic losses

**Solution**: Always use stop losses, no exceptions

### 4. Revenge Trading ❌
**Mistake**: Increasing position size after losses to "make it back"

**Problem**: Leads to even bigger losses

**Solution**: Stick to your configured position sizes

### 5. Ignoring Daily Loss Limits ❌
**Mistake**: "Just one more trade to recover"

**Problem**: Bad days become disastrous days

**Solution**: Respect the `maxDailyLoss` limit, stop when hit

### 6. Not Monitoring the Bot ❌
**Mistake**: "I'll just let it run while I sleep"

**Problem**: Bot can malfunction or market conditions change

**Solution**: Monitor actively, especially during first weeks

### 7. Trading Without Liquidity ❌
**Mistake**: Setting `minLiquidity` too low

**Problem**: Can't exit positions, stuck in illiquid tokens

**Solution**: Keep `minLiquidity` at least $10,000

### 8. Chasing Pumps ❌
**Mistake**: Buying tokens already up 100%+

**Problem**: Usually the top, followed by crashes

**Solution**: Let the bot's filters handle this automatically

## Token Safety Checks

The bot performs these safety checks:

### ✅ Automated Checks
- Liquidity sufficient
- Mint authority renounced
- Freeze authority renounced
- Minimum holder count
- Volume verification
- Rug pull score calculation

### ⚠️ Cannot Detect
- Social engineering scams
- Team dumps coordinated
- Slow rugs over time
- Market manipulation
- External events

**The bot reduces risk but cannot eliminate it.**

## Emergency Procedures

### If Something Goes Wrong

1. **Stop the bot immediately**
   ```bash
   # Press Ctrl+C or
   npm run trade -- stop
   ```

2. **Check your positions**
   ```bash
   npm run trade -- status
   ```

3. **Close positions manually if needed**
   - Use [Jupiter](https://jup.ag) to swap tokens back to SOL
   - Check transactions on [Solscan](https://solscan.io)

4. **Review logs**
   ```bash
   cat logs/bot.log
   ```

5. **Report issues**
   - GitHub Issues: [Report here]
   - Include logs (remove private keys!)

### Daily Loss Limit Hit

When `maxDailyLoss` is reached:
1. Bot stops automatically
2. Positions remain open
3. Resumes next day (00:00 UTC)

**Don't override this - it's protecting you.**

## Monitoring Checklist

Check these regularly:

### Every Hour (Active Trading)
- [ ] Bot is running
- [ ] Open positions look reasonable
- [ ] No errors in logs
- [ ] Gas balance sufficient (>0.1 SOL)

### Daily
- [ ] Review PnL
- [ ] Check win rate
- [ ] Analyze closed trades
- [ ] Adjust configuration if needed

### Weekly
- [ ] Compare vs paper trading results
- [ ] Review risk management effectiveness
- [ ] Update token filters if needed
- [ ] Check for bot updates

## Red Flags - Stop Immediately If:

🚨 **Immediate Stop Required:**
- Losing >10% of capital in one day
- Bot making irrational trades
- Unable to close positions
- Consistent slippage >5%
- RPC connection failing repeatedly
- Wallet balance draining unexpectedly

## Getting Help

### Before Asking for Help
1. Check the logs first
2. Read this safety guide completely
3. Review your configuration
4. Test in paper trading mode

### When Asking for Help
Include:
- Bot version
- Configuration (without private keys!)
- Error messages
- What you were trying to do
- Logs (sanitized)

**Never share:**
- Private keys
- Wallet addresses publicly
- Transaction signatures

## Legal Disclaimer

This software is provided "as is" without warranty of any kind. The developers:

- Are NOT financial advisors
- Do NOT guarantee profits
- Are NOT responsible for losses
- Do NOT endorse trading memecoins

By using this bot, you acknowledge:
- You understand the risks
- You can afford to lose your investment
- You are responsible for your trading decisions
- You will comply with local regulations

## Final Reminder

**⚠️ ONLY TRADE WITH MONEY YOU CAN AFFORD TO LOSE ⚠️**

Memecoins are:
- Extremely volatile
- Often manipulated
- Frequently rugpulled
- Not investments

This bot is a tool. Like any tool, it can be misused. Use responsibly.

---

**Still want to proceed? Start with paper trading mode.**

```bash
npm run trade -- --paper-trading --config conservative
```

No real money will be used. Test for at least 7 days. Then reconsider if you really want to trade memecoins with real funds.

Good luck, and trade safely! 🛡️
