---
title: "Getting Started"
description: "Get started with Universal Crypto MCP in 5 minutes"
category: "getting-started"
keywords: ["quickstart", "installation", "setup", "tutorial"]
order: 1
---

# Getting Started

Welcome to Universal Crypto MCP! This guide will get you up and running in 5 minutes.

## What is Universal Crypto MCP?

Universal Crypto MCP is a Model Context Protocol (MCP) server that gives AI assistants access to 380+ blockchain tools across 60+ networks. It enables AI agents to:

- 💰 Check balances and transfer tokens
- 🔄 Execute DeFi swaps and lending
- 📊 Fetch real-time market data
- 💳 Make HTTP 402 payments (x402 protocol)
- 🤖 Run autonomous trading agents

## Quick Start

### Option 1: One-Line Setup (Recommended)

```bash
npx @nirholas/universal-crypto-mcp
```

This starts an MCP server that you can connect to Claude, ChatGPT, or any MCP-compatible client.

### Option 2: Install Globally

```bash
npm install -g @nirholas/universal-crypto-mcp
universal-crypto-mcp
```

### Option 3: Use with Claude Desktop

Add to your Claude Desktop configuration (`~/.claude/config.json`):

```json
{
  "mcpServers": {
    "universal-crypto-mcp": {
      "command": "npx",
      "args": ["@nirholas/universal-crypto-mcp"],
      "env": {
        "ETHEREUM_RPC_URL": "https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY"
      }
    }
  }
}
```

## Configuration

### Environment Variables

Create a `.env` file:

```bash
# RPC Endpoints (at least one required)
ETHEREUM_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY
BASE_RPC_URL=https://base-mainnet.g.alchemy.com/v2/YOUR_KEY

# For transactions (optional)
PRIVATE_KEY=0x...

# For x402 payments (optional)
X402_PRIVATE_KEY=0x...

# For CEX trading (optional)
BINANCE_API_KEY=...
BINANCE_SECRET_KEY=...
```

### Get RPC URLs

Free RPC providers:
- [Alchemy](https://alchemy.com) - 300M requests/month free
- [Infura](https://infura.io) - 100K requests/day free
- [QuickNode](https://quicknode.com) - Free tier available

## Your First Commands

Once connected to an MCP client, try these commands:

### Check a Wallet Balance

```
Check the ETH balance of vitalik.eth
```

### Get Token Prices

```
What's the current price of ETH and BTC?
```

### Analyze a Token

```
Is the token at 0x... safe to trade?
```

### Get DeFi Rates

```
What are the current lending rates on Aave for USDC?
```

## Enable Features

### Transactions (Requires Private Key)

```bash
PRIVATE_KEY=0x... npx @nirholas/universal-crypto-mcp
```

Now you can:
```
Swap 0.1 ETH to USDC on Uniswap
```

### x402 Payments

```bash
X402_PRIVATE_KEY=0x... npx @nirholas/universal-crypto-mcp
```

Now you can:
```
Make a paid request to https://api.example.com/premium
```

### CEX Trading

```bash
BINANCE_API_KEY=... BINANCE_SECRET_KEY=... npx @nirholas/universal-crypto-mcp
```

Now you can:
```
Buy 0.01 BTC on Binance
```

## Project Structure

For developers building with Universal Crypto MCP:

```typescript
import { UniversalCryptoMCP } from '@nirholas/universal-crypto-mcp';

const mcp = new UniversalCryptoMCP({
  rpcUrls: {
    ethereum: process.env.ETHEREUM_RPC_URL,
    base: process.env.BASE_RPC_URL,
  },
  privateKey: process.env.PRIVATE_KEY,
});

// Start the MCP server
await mcp.start();
```

## Available Modules

| Module | Description | Enabled By Default |
|--------|-------------|-------------------|
| `wallet` | Balance, transfers, signing | ✅ Yes |
| `market-data` | Prices, charts, analytics | ✅ Yes |
| `defi` | Swaps, lending, staking | ✅ Yes (read-only) |
| `trading` | CEX trading | ❌ No (needs API keys) |
| `x402` | HTTP payments | ❌ No (needs key) |
| `agents` | Automation | ❌ No (needs config) |

Enable specific modules:

```bash
MODULES=wallet,defi,market-data npx @nirholas/universal-crypto-mcp
```

## Security Notes

⚠️ **Important Security Practices:**

1. **Never share your private key** - Use environment variables
2. **Use testnets first** - Test on Sepolia, Base Sepolia
3. **Start with read-only** - Don't add private key until needed
4. **Use limited approvals** - Don't approve unlimited amounts
5. **Monitor transactions** - Set up wallet alerts

## Next Steps

- [Installation Guide](./installation.md) - Detailed setup instructions
- [Configuration](./configuration.md) - All configuration options
- [First Tool Tutorial](./first-tool.md) - Build your first tool
- [Tool Catalog](../tools/catalog.md) - Browse all 380+ tools
- [x402 Protocol](../x402/overview.md) - HTTP 402 payments

## Getting Help

- [GitHub Issues](https://github.com/nirholas/universal-crypto-mcp/issues)
- [Discord Community](https://discord.gg/universal-crypto-mcp)
- [FAQ](../faq.md)
