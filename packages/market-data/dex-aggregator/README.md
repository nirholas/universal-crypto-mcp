# DexPaprika MCP Server

> Real-time DEX analytics, liquidity pools, and token data across multiple chains.

## Attribution

**Original Author:** [CoinPaprika](https://github.com/coinpaprika)  
**Original Repository:** [dexpaprika-mcp](https://github.com/coinpaprika/dexpaprika-mcp)  
**License:** MIT

**Integration & Enhancements by:** Nich ([@nichxbt](https://x.com/nichxbt))

## Supported Chains

| Chain | DEXs |
|-------|------|
| Ethereum | Uniswap V2/V3, SushiSwap, Curve |
| Arbitrum | Uniswap V3, Camelot, GMX |
| Base | Uniswap V3, Aerodrome |
| Polygon | QuickSwap, Uniswap V3 |
| BNB Chain | PancakeSwap, BiSwap |
| Solana | Raydium, Orca, Jupiter |
| Avalanche | Trader Joe, Pangolin |

## Features

### From Original Implementation
- ✅ Real-time DEX data
- ✅ Liquidity pool analytics
- ✅ Token information
- ✅ Trading pair data
- ✅ Volume statistics
- ✅ Price feeds

### Our Enhancements (Apache-2.0)
- ✅ Cross-chain pool comparison
- ✅ Impermanent loss calculator
- ✅ Liquidity depth analysis
- ✅ MEV protection scoring
- ✅ Pool health metrics
- ✅ New pool alerts

## Installation

```bash
pnpm add @nirholas/dexpaprika-mcp
```

## Usage

### With MCP Server

```typescript
import { registerDexPaprikaTools } from '@nirholas/dexpaprika-mcp';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

const server = new McpServer({ name: 'my-dex-server', version: '1.0.0' });
registerDexPaprikaTools(server);
```

### Standalone

```typescript
import { DexPaprikaClient } from '@nirholas/dexpaprika-mcp';

const client = new DexPaprikaClient();

// Get top pools on Ethereum
const pools = await client.getTopPools('ethereum', 10);

// Get token info
const token = await client.getTokenInfo('ethereum', '0x...');

// Find best liquidity for a swap
const liquidity = await client.findBestLiquidity('ETH', 'USDC', 10000);
```

## Available Tools

| Tool | Description |
|------|-------------|
| `dex_pools` | Get liquidity pools for a chain/DEX |
| `dex_pool_details` | Get detailed pool information |
| `dex_token_info` | Get token information on a DEX |
| `dex_pairs` | Get trading pairs |
| `dex_volume` | Get volume statistics |
| `dex_top_pools` | Get top pools by TVL or volume |
| `dex_new_pools` | Get recently created pools |
| `dex_impermanent_loss` | Calculate IL for a pool position |

## Example Queries

```
What are the top Uniswap V3 pools by TVL?
```

```
Find the deepest liquidity pool for ETH/USDC
```

```
Calculate impermanent loss for my ETH/USDC LP position
```

## License

- Original Implementation: MIT (CoinPaprika)
- Enhancements: Apache-2.0 (Nich)
