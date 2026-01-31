---
title: "Uniswap V3"
description: "Uniswap V3 MCP integration - swaps, liquidity, and position management"
category: "packages/defi"
keywords: ["uniswap", "dex", "swap", "liquidity", "amm"]
order: 2
---

# Uniswap V3

Uniswap V3 is the most widely used decentralized exchange protocol. This package provides full integration with Uniswap V3 for swaps, liquidity provision, and position management.

## Installation

```bash
pnpm add @universal-crypto-mcp/defi-uniswap-v3
```

## Supported Networks

| Network | Router Address | Status |
|---------|---------------|--------|
| Ethereum | `0xE592427A0AEce92De3Edee1F18E0157C05861564` | ✅ |
| Arbitrum | `0xE592427A0AEce92De3Edee1F18E0157C05861564` | ✅ |
| Optimism | `0xE592427A0AEce92De3Edee1F18E0157C05861564` | ✅ |
| Polygon | `0xE592427A0AEce92De3Edee1F18E0157C05861564` | ✅ |
| Base | `0x2626664c2603336E57B271c5C0b26F421741e481` | ✅ |
| BNB Chain | `0xB971eF87ede563556b2ED4b1C0b0019111Dd85d2` | ✅ |

## Quick Start

```typescript
import { UniswapV3 } from '@universal-crypto-mcp/defi-uniswap-v3';

const uniswap = new UniswapV3({
  rpcUrl: process.env.ETHEREUM_RPC_URL,
  chainId: 1,
});

// Get a swap quote
const quote = await uniswap.getQuote({
  tokenIn: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // WETH
  tokenOut: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
  amount: '1000000000000000000', // 1 ETH
  fee: 3000, // 0.3% pool
});

console.log(`1 ETH = ${quote.amountOut / 1e6} USDC`);
```

## MCP Tools

### `uniswap_swap`

Execute a token swap.

```typescript
const result = await uniswap.swap({
  tokenIn: 'ETH',
  tokenOut: 'USDC',
  amount: '1.0',
  slippage: 0.5, // 0.5%
  recipient: '0xYourAddress',
});
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `tokenIn` | `string` | Yes | Input token (symbol or address) |
| `tokenOut` | `string` | Yes | Output token (symbol or address) |
| `amount` | `string` | Yes | Amount to swap |
| `slippage` | `number` | No | Slippage tolerance (default: 0.5%) |
| `recipient` | `string` | No | Recipient address |
| `deadline` | `number` | No | Transaction deadline (seconds) |

### `uniswap_quote`

Get a swap quote without executing.

```typescript
const quote = await uniswap.getQuote({
  tokenIn: 'ETH',
  tokenOut: 'USDC',
  amount: '1.0',
});

console.log(`Expected output: ${quote.amountOut}`);
console.log(`Price impact: ${quote.priceImpact}%`);
console.log(`Route: ${quote.route.join(' → ')}`);
```

### `uniswap_add_liquidity`

Add liquidity to a V3 pool.

```typescript
const position = await uniswap.addLiquidity({
  token0: 'ETH',
  token1: 'USDC',
  amount0: '1.0',
  amount1: '2000',
  fee: 3000, // 0.3% pool
  tickLower: -887220,
  tickUpper: 887220,
});

console.log(`Position NFT ID: ${position.tokenId}`);
```

### `uniswap_remove_liquidity`

Remove liquidity from a position.

```typescript
await uniswap.removeLiquidity({
  tokenId: 12345,
  percentage: 100, // Remove 100%
  recipient: '0xYourAddress',
});
```

### `uniswap_positions`

Get all LP positions for an address.

```typescript
const positions = await uniswap.getPositions('0xYourAddress');

for (const pos of positions) {
  console.log(`Token ID: ${pos.tokenId}`);
  console.log(`Pool: ${pos.token0}/${pos.token1}`);
  console.log(`Liquidity: ${pos.liquidity}`);
  console.log(`Unclaimed Fees: ${pos.fees0} ${pos.token0}, ${pos.fees1} ${pos.token1}`);
}
```

### `uniswap_collect_fees`

Collect accumulated fees from a position.

```typescript
const fees = await uniswap.collectFees({
  tokenId: 12345,
  recipient: '0xYourAddress',
});

console.log(`Collected: ${fees.amount0} ${fees.token0}, ${fees.amount1} ${fees.token1}`);
```

## Pool Information

### `uniswap_pool_info`

Get pool details.

```typescript
const pool = await uniswap.getPool({
  token0: 'ETH',
  token1: 'USDC',
  fee: 3000,
});

console.log(`Pool Address: ${pool.address}`);
console.log(`Liquidity: ${pool.liquidity}`);
console.log(`Current Tick: ${pool.tick}`);
console.log(`Price: ${pool.price}`);
console.log(`24h Volume: ${pool.volume24h}`);
console.log(`TVL: ${pool.tvl}`);
```

### Fee Tiers

| Fee Tier | Value | Best For |
|----------|-------|----------|
| 0.01% | 100 | Very stable pairs (USDC/USDT) |
| 0.05% | 500 | Stable pairs (ETH/stETH) |
| 0.30% | 3000 | Most pairs (ETH/USDC) |
| 1.00% | 10000 | Exotic pairs |

## Advanced Usage

### Multi-Hop Swaps

```typescript
const quote = await uniswap.getQuote({
  tokenIn: 'WBTC',
  tokenOut: 'DAI',
  amount: '0.1',
  // Automatically finds best route through multiple pools
});

console.log(`Route: ${quote.route.join(' → ')}`);
// Route: WBTC → WETH → DAI
```

### Exact Output Swaps

```typescript
const swap = await uniswap.swap({
  tokenIn: 'ETH',
  tokenOut: 'USDC',
  amountOut: '1000', // Get exactly 1000 USDC
  type: 'exactOutput',
});
```

### Concentrated Liquidity

```typescript
// Add liquidity in a specific price range
const position = await uniswap.addLiquidity({
  token0: 'ETH',
  token1: 'USDC',
  amount0: '1.0',
  amount1: '2000',
  fee: 3000,
  // Active from $1800 to $2200
  priceLower: 1800,
  priceUpper: 2200,
});
```

## Error Handling

```typescript
import {
  InsufficientLiquidityError,
  SlippageExceededError,
  InvalidPairError,
} from '@universal-crypto-mcp/defi-uniswap-v3';

try {
  await uniswap.swap({ ... });
} catch (error) {
  if (error instanceof InsufficientLiquidityError) {
    console.error('Not enough liquidity for this swap');
  } else if (error instanceof SlippageExceededError) {
    console.error('Price moved too much, increase slippage');
  }
}
```

## See Also

- [Curve](./curve.md) - Better for stablecoin swaps
- [DeFi Overview](./overview.md) - All DeFi protocols
- [Chain Documentation](../chains/evm/ethereum.md) - Network details
