> **Part of [Universal Crypto MCP](https://github.com/nirholas/universal-crypto-mcp)**  
> By [nich](https://x.com/nichxbt)  
> See [ATTRIBUTION.md](./ATTRIBUTION.md) for original source

---

# Web3 MCP Server

Web3 utilities and blockchain interactions for Model Context Protocol.

## Features

- Multi-chain Web3 connections
- Smart contract interactions
- Transaction building and sending
- Event monitoring
- Gas estimation

## Installation

```bash
pnpm install @nirholas/web3-mcp
```

## Usage

```typescript
import { Web3MCP } from '@nirholas/web3-mcp'

const mcp = new Web3MCP({
  rpcUrl: 'https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY'
})

// Get balance
const balance = await mcp.getBalance('0x...')

// Send transaction
const tx = await mcp.sendTransaction({
  to: '0x...',
  value: '1000000000000000000'
})
```

## Author

**nich** (@nirholas)
- Twitter: [x.com/nichxbt](https://x.com/nichxbt)
- GitHub: [github.com/nirholas](https://github.com/nirholas)
