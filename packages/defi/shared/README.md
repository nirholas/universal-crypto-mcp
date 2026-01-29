# @universal-crypto-mcp/defi-shared

Shared DeFi utilities and types for Universal Crypto MCP integrations.

## Overview

This package provides common types, interfaces, and utilities used across all DeFi protocol integrations in the Universal Crypto MCP ecosystem.

## Installation

```bash
pnpm add @universal-crypto-mcp/defi-shared
```

## Features

- **Protocol Registry**: Centralized registry of supported DeFi protocols
- **Common Types**: Shared type definitions for swaps, pools, and staking
- **Protocol Interface**: Standard interface for DeFi protocol adapters
- **Chain Support**: Multi-chain protocol information

## Usage

### Protocol Registry

```typescript
import {
  PROTOCOL_REGISTRY,
  getProtocolsByChain,
  getProtocolsByType,
} from "@universal-crypto-mcp/defi-shared";

// Get all DEX protocols on Arbitrum
const arbitrumDexes = getProtocolsByChain("arbitrum").filter(
  (p) => p.type === "dex"
);

// Get all lending protocols
const lendingProtocols = getProtocolsByType("lending");

// Access protocol config
const uniswapConfig = PROTOCOL_REGISTRY.uniswap;
console.log(`${uniswapConfig.displayName}: ${uniswapConfig.website}`);
```

### Types

```typescript
import type {
  Protocol,
  SwapRequest,
  SwapQuote,
  PoolInfo,
  StakeRequest,
  DeFiProtocol,
} from "@universal-crypto-mcp/defi-shared";

// Build a swap request
const swapRequest: SwapRequest = {
  tokenIn: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", // WETH
  tokenOut: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
  amountIn: "1000000000000000000", // 1 ETH
  slippage: 0.5, // 0.5%
};

// Process a swap quote
function displayQuote(quote: SwapQuote) {
  console.log(`
Protocol: ${quote.protocol}
Amount In: ${quote.amountIn}
Amount Out: ${quote.amountOut}
Price Impact: ${quote.priceImpact}%
Route: ${quote.route.join(" → ")}
  `);
}
```

### Protocol Adapter

```typescript
import type { DeFiProtocol } from "@universal-crypto-mcp/defi-shared";

class MyProtocolAdapter implements DeFiProtocol {
  name = "MyProtocol";
  chain = "ethereum";

  async getQuote(request: SwapRequest): Promise<SwapQuote> {
    // Implementation
  }

  async executeSwap(request: SwapRequest): Promise<string> {
    // Implementation
  }

  async getPools(): Promise<PoolInfo[]> {
    // Implementation
  }
}

// Register with the protocol registry
import { registerProtocol } from "@universal-crypto-mcp/defi-shared";
registerProtocol("myprotocol" as any, new MyProtocolAdapter());
```

## Supported Protocols

| Protocol | Type | Chains |
|----------|------|--------|
| Uniswap | DEX | Ethereum, Polygon, Arbitrum, Optimism, Base |
| SushiSwap | DEX | Ethereum, Polygon, Arbitrum, Avalanche, Fantom |
| Curve | DEX | Ethereum, Polygon, Arbitrum, Optimism, Avalanche |
| Aave | Lending | Ethereum, Polygon, Arbitrum, Optimism, Avalanche |
| Compound | Lending | Ethereum, Polygon, Arbitrum, Base |
| Sperax | Stablecoin | Arbitrum |
| PancakeSwap | DEX | BSC, Ethereum, Arbitrum, Base |

## API Reference

### Types

#### `Protocol`
```typescript
type Protocol = 
  | "uniswap"
  | "sushiswap"
  | "curve"
  | "aave"
  | "compound"
  | "sperax"
  | "pancakeswap";
```

#### `SwapRequest`
```typescript
interface SwapRequest {
  tokenIn: string;
  tokenOut: string;
  amountIn: string;
  slippage?: number; // Default: 0.5
  deadline?: number; // Unix timestamp
}
```

#### `SwapQuote`
```typescript
interface SwapQuote {
  tokenIn: string;
  tokenOut: string;
  amountIn: string;
  amountOut: string;
  priceImpact: number; // Percentage
  route: string[]; // Token addresses in swap route
  protocol: Protocol;
}
```

#### `PoolInfo`
```typescript
interface PoolInfo {
  address: string;
  token0: string;
  token1: string;
  reserve0: string;
  reserve1: string;
  fee: number; // Basis points
  apy?: number; // Annual percentage yield
}
```

#### `StakeRequest`
```typescript
interface StakeRequest {
  protocol: Protocol;
  token: string;
  amount: string;
}
```

#### `DeFiProtocol`
```typescript
interface DeFiProtocol {
  name: string;
  chain: string;
  getQuote(request: SwapRequest): Promise<SwapQuote>;
  executeSwap(request: SwapRequest): Promise<string>;
  getPools(): Promise<PoolInfo[]>;
}
```

### Functions

#### `getProtocolsByChain(chain: string): ProtocolConfig[]`
Get all protocols available on a specific chain.

#### `getProtocolsByType(type: "dex" | "lending" | "yield" | "stablecoin"): ProtocolConfig[]`
Get all protocols of a specific type.

#### `registerProtocol(protocol: Protocol, adapter: DeFiProtocol): void`
Register a protocol adapter implementation.

#### `getProtocol(protocol: Protocol): DeFiProtocol | undefined`
Get a registered protocol adapter.

#### `getAllProtocols(): Map<Protocol, DeFiProtocol>`
Get all registered protocol adapters.

## Development

```bash
# Build
pnpm build

# Watch mode
pnpm dev

# Test
pnpm test

# Lint
pnpm lint
```

## Contributing

Contributions are welcome! Please read the [CONTRIBUTING.md](../../../CONTRIBUTING.md) guide.

## License

Apache-2.0

## Author

**nich** - Building the most extensive crypto MCP repository

- 🐙 GitHub: [@nirholas](https://github.com/nirholas)
- 🐦 Twitter: [@nichxbt](https://x.com/nichxbt)
- 📦 NPM: [@nirholas](https://www.npmjs.com/~nirholas)
