# ArmorWallet MCP Server

> Multi-chain DeFi interface with swap, bridge, and staking capabilities.

## Attribution

**Original Author:** [Nicholas Oxford](https://github.com/nicholasoxford)  
**Original Repository:** [ArmorWallet](https://github.com/nicholasoxford/ArmorWallet)  
**License:** MIT

**Integration & Enhancements by:** Nich ([@nichxbt](https://x.com/nichxbt))

## Supported Chains

| Chain | Swap | Bridge | Staking | Balance |
|-------|------|--------|---------|---------|
| Ethereum | ✅ | ✅ | ✅ | ✅ |
| Polygon | ✅ | ✅ | ✅ | ✅ |
| Arbitrum | ✅ | ✅ | ✅ | ✅ |
| Optimism | ✅ | ✅ | ✅ | ✅ |
| Base | ✅ | ✅ | ✅ | ✅ |
| Avalanche | ✅ | ✅ | ✅ | ✅ |
| BSC | ✅ | ✅ | ✅ | ✅ |

## Features

### From Original Implementation
- ✅ Multi-chain wallet management
- ✅ Cross-chain token swaps
- ✅ Bridge between chains
- ✅ Token balance aggregation
- ✅ Gas estimation
- ✅ Transaction history

### Our Enhancements (Apache-2.0)
- ✅ Staking position management
- ✅ Portfolio analytics
- ✅ Best route finding
- ✅ Slippage protection
- ✅ Price impact calculation

## Installation

```bash
pnpm add @nirholas/armorwallet-mcp
```

## Configuration

```bash
export ARMOR_PRIVATE_KEY=your_wallet_private_key
export ARMOR_RPC_ETHEREUM=https://mainnet.infura.io/v3/...
export ARMOR_RPC_POLYGON=https://polygon-rpc.com
```

## Usage

### With MCP Server

```typescript
import { registerArmorTools } from '@nirholas/armorwallet-mcp';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

const server = new McpServer({ name: 'my-defi-server', version: '1.0.0' });
registerArmorTools(server);
```

### Standalone

```typescript
import { ArmorWalletClient } from '@nirholas/armorwallet-mcp';

const client = new ArmorWalletClient({
  privateKey: process.env.ARMOR_PRIVATE_KEY,
});

// Get balances across chains
const balances = await client.getBalances();

// Quote a swap
const quote = await client.getSwapQuote({
  chain: 'ethereum',
  tokenIn: 'ETH',
  tokenOut: 'USDC',
  amount: '1.0',
});

// Execute swap
const tx = await client.executeSwap({
  chain: 'ethereum',
  tokenIn: 'ETH',
  tokenOut: 'USDC',
  amount: '1.0',
  slippage: 0.5,
});

// Bridge tokens
const bridge = await client.bridge({
  sourceChain: 'ethereum',
  destChain: 'polygon',
  token: 'USDC',
  amount: '100',
});
```

## Available Tools

| Tool | Description |
|------|-------------|
| `armor_balances` | Get token balances across all chains |
| `armor_swap_quote` | Get swap quote for token pair |
| `armor_swap` | Execute a token swap |
| `armor_bridge` | Bridge tokens between chains |
| `armor_bridge_status` | Check bridge transaction status |
| `armor_stake` | Stake tokens |
| `armor_unstake` | Unstake tokens |
| `armor_staking_positions` | View staking positions |
| `armor_transactions` | Get transaction history |
| `armor_gas_price` | Get current gas prices |

## Example Queries

```
Show my balances across all chains
```

```
Swap 1 ETH to USDC on Ethereum
```

```
Bridge 100 USDC from Ethereum to Polygon
```

```
Show my staking positions
```

## Supported DEXes

- Uniswap V2/V3
- SushiSwap
- QuickSwap (Polygon)
- Trader Joe (Avalanche)
- PancakeSwap (BSC)
- Velodrome (Optimism)
- Aerodrome (Base)

## License

- Original Implementation: MIT (Nicholas Oxford)
- Enhancements: Apache-2.0 (Nich)
