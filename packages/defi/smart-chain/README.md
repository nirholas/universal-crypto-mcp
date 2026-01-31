# @universal-crypto-mcp/defi-bnb-chain

BNB Chain DeFi integrations for Model Context Protocol (MCP).

## Overview

This package provides tools for interacting with DeFi protocols on BNB Chain (formerly BSC), including PancakeSwap for swaps and Venus for lending.

## Features

- **PancakeSwap Integration**: Token swaps on the leading BNB Chain DEX
- **Venus Protocol**: Lending and borrowing operations
- **Pool Information**: Query liquidity pools and APYs
- **Price Feeds**: Token price queries

## Installation

```bash
pnpm add @universal-crypto-mcp/defi-bnb-chain
```

## Usage

### PancakeSwap Swaps

```typescript
import { PancakeSwapClient } from "@universal-crypto-mcp/defi-bnb-chain";

const client = new PancakeSwapClient({
  privateKey: "0x...",
});

// Get quote
const quote = await client.getQuote({
  tokenIn: "0x...", // WBNB
  tokenOut: "0x...", // USDT
  amountIn: "1.0",
});

// Execute swap
const txHash = await client.executeSwap({
  tokenIn: "0x...",
  tokenOut: "0x...",
  amountIn: "1.0",
  slippage: 0.5,
});
```

### Venus Lending

```typescript
import { VenusClient } from "@universal-crypto-mcp/defi-bnb-chain";

const client = new VenusClient();

// Get supply APY
const apy = await client.getSupplyAPY("0x..."); // vBNB address

// Get user position
const position = await client.getPosition("0x...");
```

## Supported Protocols

| Protocol | Type | Features |
|----------|------|----------|
| PancakeSwap | DEX | Swaps, Liquidity |
| Venus | Lending | Supply, Borrow |

## Contract Addresses

| Contract | Address |
|----------|---------|
| PancakeSwap Router | `0x13f4EA83D0bd40E75C8222255bc855a974568Dd4` |
| Venus Comptroller | `0xfD36E2c2a6789Db23113685031d7F16329158384` |
| vBNB | `0xA07c5b74C9B40447a954e1466938b865b6BBea36` |

## License

Apache-2.0
