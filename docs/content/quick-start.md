---
title: Quick Start
description: Get started with Universal Crypto MCP in under 5 minutes
category: Getting Started
keywords: [quickstart, tutorial, installation, setup]
order: 2
published: true
date: 2024-01-29
---

# Quick Start Guide

Get Universal Crypto MCP up and running in under 5 minutes.

<Callout type="info" title="Prerequisites">
- Node.js 18 or higher
- pnpm (recommended) or npm
- An Ethereum RPC endpoint (Infura, Alchemy, or local node)
</Callout>

## Installation

Install Universal Crypto MCP via pnpm:

```bash
pnpm add universal-crypto-mcp
```

Or using npm:

```bash
npm install universal-crypto-mcp
```

## Configuration

Create a `.env` file in your project root:

```bash
# RPC Endpoints
ETHEREUM_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY
POLYGON_RPC_URL=https://polygon-mainnet.g.alchemy.com/v2/YOUR_KEY

# API Keys (optional)
COINGECKO_API_KEY=your_api_key
ETHERSCAN_API_KEY=your_api_key
```

<Callout type="warning" title="Security">
Never commit your `.env` file to version control. Add it to `.gitignore`.
</Callout>

## Your First Script

Create a file `index.ts`:

```typescript
import { UniversalCryptoMCP } from 'universal-crypto-mcp'

async function main() {
  // Initialize the MCP server
  const mcp = new UniversalCryptoMCP({
    chain: 'ethereum',
    provider: process.env.ETHEREUM_RPC_URL!,
  })

  // Get ETH price
  const price = await mcp.market.getPrice('ethereum')
  console.log(`Current ETH price: $${price}`)

  // Get token balance
  const balance = await mcp.wallet.getBalance(
    '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    'USDC'
  )
  console.log(`USDC Balance: ${balance}`)

  // Get gas price
  const gas = await mcp.chain.getGasPrice()
  console.log(`Current gas price: ${gas} gwei`)
}

main()
```

Run it:

```bash
npx tsx index.ts
```

Expected output:

```
Current ETH price: $2,345.67
USDC Balance: 1250.50
Current gas price: 25 gwei
```

## Using with Claude Desktop

Add Universal Crypto MCP to your Claude Desktop config:

```json
{
  "mcpServers": {
    "universal-crypto": {
      "command": "node",
      "args": ["/path/to/universal-crypto-mcp/dist/index.js"],
      "env": {
        "ETHEREUM_RPC_URL": "your_rpc_url"
      }
    }
  }
}
```

Restart Claude Desktop and try:

> "What's the current price of Bitcoin?"
> "Check my ETH balance at 0x742d35..."
> "Show me gas prices across all chains"

## Common Operations

### Check Token Balance

```typescript
const balance = await mcp.wallet.getBalance(
  '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
  'USDC'
)
```

### Get Token Price

```typescript
const price = await mcp.market.getPrice('ethereum')
const usdtPrice = await mcp.market.getPrice('tether')
```

### Swap Tokens

```typescript
const quote = await mcp.defi.getSwapQuote({
  from: 'ETH',
  to: 'USDC',
  amount: '1',
  chain: 'ethereum'
})

console.log(`1 ETH = ${quote.outputAmount} USDC`)
```

### Check DeFi Position

```typescript
const position = await mcp.defi.getPosition({
  protocol: 'aave',
  address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'
})

console.log(`Supplied: ${position.supplied}`)
console.log(`Borrowed: ${position.borrowed}`)
```

## Multi-Chain Support

Switch between chains easily:

```typescript
// Ethereum
const ethMcp = new UniversalCryptoMCP({ chain: 'ethereum' })

// Polygon
const polyMcp = new UniversalCryptoMCP({ chain: 'polygon' })

// BSC
const bscMcp = new UniversalCryptoMCP({ chain: 'bsc' })

// Arbitrum
const arbMcp = new UniversalCryptoMCP({ chain: 'arbitrum' })
```

<Card
  title="Supported Chains"
  description="View all supported blockchain networks"
  href="/docs/integrations/chains"
/>

## Error Handling

Always wrap calls in try-catch blocks:

```typescript
try {
  const balance = await mcp.wallet.getBalance(address, 'USDC')
  console.log(`Balance: ${balance}`)
} catch (error) {
  if (error.code === 'INVALID_ADDRESS') {
    console.error('Invalid Ethereum address')
  } else if (error.code === 'NETWORK_ERROR') {
    console.error('Network connection failed')
  } else {
    console.error('Unknown error:', error.message)
  }
}
```

## Next Steps

<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
  <Card
    title="Core Concepts"
    description="Understand the architecture and design"
    href="/docs/architecture"
  />
  <Card
    title="API Reference"
    description="Complete API documentation"
    href="/docs/api/core"
  />
  <Card
    title="Building Agents"
    description="Create AI agents with blockchain capabilities"
    href="/docs/guides/building-agents"
  />
  <Card
    title="DeFi Integration"
    description="Integrate with DeFi protocols"
    href="/docs/integrations/defi"
  />
</div>

## Troubleshooting

### Module Not Found

If you see `Cannot find module 'universal-crypto-mcp'`:

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### RPC Connection Failed

Ensure your RPC URL is valid and accessible:

```typescript
// Test connection
const mcp = new UniversalCryptoMCP({
  chain: 'ethereum',
  provider: process.env.ETHEREUM_RPC_URL!,
  timeout: 5000, // 5 second timeout
})

await mcp.chain.getBlockNumber() // Should succeed
```

### Rate Limiting

If you're hitting rate limits:

```typescript
const mcp = new UniversalCryptoMCP({
  chain: 'ethereum',
  provider: process.env.ETHEREUM_RPC_URL!,
  cache: true, // Enable caching
  rateLimit: {
    requests: 100,
    window: 60000, // per minute
  }
})
```

<Callout type="success" title="All Set!">
You're now ready to build with Universal Crypto MCP. Check out our [tutorials](/docs/tutorials) for more examples.
</Callout>

## Getting Help

- **Documentation**: [Full docs](/docs)
- **GitHub Issues**: [Report bugs](https://github.com/nirholas/universal-crypto-mcp/issues)
- **Discord**: Join our community
- **Email**: support@universal-crypto-mcp.dev
