/**
 * Quick Start Guide - Memecoin Trading Bot
 * Author: nich (@nirholas) - x.com/nichxbt
 */

# 🚀 Quick Start Guide

## Prerequisites

1. **Node.js**: v18 or higher
2. **pnpm**: Package manager
3. **Solana Wallet**: With SOL for trading
4. **RPC Access**: Solana RPC endpoint

## Installation

```bash
cd packages/trading/memecoin-bot
pnpm install
```

## Configuration

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit `.env` and add your credentials:
```env
# REQUIRED
WALLET_PRIVATE_KEY=your_base58_private_key
WALLET_ADDRESS=your_wallet_address
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com

# OPTIONAL (but recommended)
BIRDEYE_API_KEY=your_key
HELIUS_API_KEY=your_key
```

## Build

```bash
pnpm build
```

## First Run

### 1. Check Your Balance

```bash
pnpm trade balance
```

### 2. Analyze a Token

```bash
pnpm trade analyze TOKEN_ADDRESS
```

### 3. Monitor Mode (No Trading)

```bash
pnpm trade monitor
```

### 4. Start Trading

```bash
pnpm start
```

## Safety First

⚠️ **Before live trading:**

1. Test with small amounts first
2. Set conservative limits in `.env`:
   - `BUY_AMOUNT=0.1`
   - `MAX_DAILY_LOSS=1`
3. Monitor for the first hour
4. Understand all risks

## Common Commands

```bash
# Start bot
pnpm start

# Monitor performance
pnpm trade monitor

# View statistics
pnpm trade stats

# Analyze token
pnpm trade analyze <TOKEN_ADDRESS>

# Manual buy
pnpm trade buy <TOKEN_ADDRESS> <AMOUNT>

# Manual sell  
pnpm trade sell <TOKEN_ADDRESS> <AMOUNT>
```

## Troubleshooting

### "Insufficient balance"
- Add more SOL to your wallet
- Check `pnpm trade balance`

### "Transaction failed"
- Increase `PRIORITY_FEE` in `.env`
- Check RPC endpoint status
- Increase `MAX_SLIPPAGE`

### "No pairs found"
- Lower filtering thresholds
- Check network connectivity
- Verify DexScreener API access

## Next Steps

1. Read [README.md](README.md) for full documentation
2. See [ADVANCED.md](ADVANCED.md) for optimization
3. Check [examples/](examples/) for custom scripts

## Support

- GitHub: [github.com/nirholas](https://github.com/nirholas)
- X: [@nichxbt](https://x.com/nichxbt)

---

**⚡ Start small, scale smart!**
