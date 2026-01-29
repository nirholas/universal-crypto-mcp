# Your First Tool

This guide walks you through using your first Universal Crypto MCP tool.

## Prerequisites

- [Installation complete](installation.md)
- Claude Desktop, Cursor, or another MCP-compatible client

## Step 1: Start the Server

Make sure the MCP server is configured in your client. For Claude Desktop:

```json
{
  "mcpServers": {
    "universal-crypto": {
      "command": "npx",
      "args": ["@nirholas/universal-crypto-mcp"]
    }
  }
}
```

Restart Claude Desktop after updating the config.

## Step 2: Check Available Tools

Ask Claude to list available tools:

> "What crypto tools do you have available?"

Claude will show you the 380+ tools organized by category:
- Market Data
- Trading
- DeFi
- Wallets
- Payments
- And more...

## Step 3: Get a Price

Let's start with a simple price check:

> "What's the current price of Bitcoin?"

Claude will use the `get_price` tool to fetch real-time data:

```
🪙 Bitcoin (BTC)
💰 Price: $67,234.56
📈 24h Change: +2.3%
📊 Market Cap: $1.32T
💹 Volume: $28.5B
```

## Step 4: Check Trending Coins

> "What coins are trending right now?"

Claude will use the `get_trending` tool:

```
🔥 Trending Coins

1. PEPE - $0.00001234 (+45%)
2. WIF - $2.34 (+23%)
3. BONK - $0.00003456 (+18%)
...
```

## Step 5: Portfolio Check (with wallet)

If you've configured a wallet, check your portfolio:

> "Show my portfolio across all chains"

Claude will scan your wallet across supported chains:

```
📊 Portfolio Summary

Ethereum:
  • 0.5 ETH ($1,234.56)
  • 1,000 USDC ($1,000.00)

Arbitrum:
  • 0.1 ETH ($246.91)
  • 500 USDC ($500.00)

Total: $2,981.47
```

## Step 6: Token Security Check

Before buying any token, check its safety:

> "Is this token safe: 0x1234...?"

Claude will use security tools:

```
🛡️ Token Security Report

✅ Not a honeypot
✅ Liquidity locked
✅ Contract verified
⚠️ Top 10 holders own 45%

Risk Score: MEDIUM
```

## Common Use Cases

### Price Alerts

> "Set an alert when Bitcoin goes above $70,000"

### DEX Swaps

> "Swap 0.1 ETH for USDC on Uniswap"

### Lending Positions

> "Check my Aave position on Ethereum"

### Gas Prices

> "What's the current gas price on Ethereum?"

### Bridge Quotes

> "Get a quote to bridge 100 USDC from Ethereum to Arbitrum"

## Tools by Category

### Market Data Tools

| Tool | Description |
|------|-------------|
| `get_price` | Get current price |
| `get_trending` | Get trending coins |
| `get_market_cap` | Get market cap data |
| `get_ohlcv` | Get OHLCV candles |
| `get_news` | Get crypto news |

### Wallet Tools

| Tool | Description |
|------|-------------|
| `get_balance` | Get wallet balance |
| `get_portfolio` | Multi-chain portfolio |
| `get_nfts` | Get NFT holdings |
| `get_history` | Transaction history |

### DeFi Tools

| Tool | Description |
|------|-------------|
| `get_swap_quote` | Get swap quote |
| `execute_swap` | Execute a swap |
| `get_lending_position` | Check lending |
| `deposit_lending` | Deposit to lending |

### Security Tools

| Tool | Description |
|------|-------------|
| `check_token` | Token security |
| `check_honeypot` | Honeypot detection |
| `check_contract` | Contract analysis |
| `check_rug_pull` | Rug pull detection |

## Tips

### Be Specific

The more specific your request, the better:

✅ "Get the price of PEPE on Ethereum"  
❌ "What's pepe worth"

### Use Chain Names

Specify the chain when relevant:

> "Check my balance on Arbitrum"
> "Swap USDC for ETH on Base"

### Confirm Transactions

For any transaction, Claude will ask for confirmation:

```
⚠️ Confirm Transaction

Action: Swap 100 USDC → ETH
Expected Output: 0.0412 ETH
Gas Estimate: $2.34
Slippage: 0.5%

Proceed? (yes/no)
```

## Troubleshooting

### "Tool not found"

Restart your MCP client after configuration changes.

### "API key required"

Some tools require API keys. See [Configuration](configuration.md).

### "Wallet not connected"

Set up your wallet with `PRIVATE_KEY` or `MNEMONIC` environment variable.

## Next Steps

- [Deployment](deployment.md) - Deploy to production
- [Package Overview](../packages/overview.md) - Explore all packages
- [x402 Payments](../x402-deploy/overview.md) - Set up AI payments
