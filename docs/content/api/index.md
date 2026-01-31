---
title: "API Reference"
description: "Complete TypeScript API documentation for Universal Crypto MCP"
category: "api"
keywords: ["api", "reference", "documentation", "typescript"]
order: 1
---

# API Reference

Welcome to the Universal Crypto MCP API Reference. This documentation covers all 83+ packages in the ecosystem.

## Overview

The Universal Crypto MCP ecosystem is organized into the following categories:

| Category | Packages | Description |
|----------|----------|-------------|
| **Core & Infrastructure** | 5 | MCP server core, shared utilities, infrastructure |
| **DeFi Protocols** | 15 | Uniswap, Aave, Compound, Curve, and more |
| **Wallets & Identity** | 8 | EVM, Solana, Safe, ENS, WalletConnect |
| **Trading & CEX** | 6 | Binance, trading bots, strategies |
| **Market Data** | 17 | Price feeds, analytics, indicators |
| **AI Agents** | 5 | Agenti, UCAI, DeFi agents |
| **Payments & x402** | 8 | x402 protocol, micropayments |
| **NFT & Gaming** | 4 | OpenSea, Blur, Axie |
| **Security** | 3 | MEV protection, rugpull detection |
| **Novel Primitives** | 7 | Experimental blockchain features |
| **Automation** | 15 | Social automation, volume bots |
| **Marketplace** | 4 | AI service marketplace, credits |

## Installation

```bash
# Install the main package
pnpm add @nirholas/universal-crypto-mcp

# Or install specific packages
pnpm add @nirholas/crypto-mcp-core
pnpm add @nirholas/defi
pnpm add @nirholas/wallets
```

## Quick Links

### Core Packages
- [@nirholas/crypto-mcp-core](/docs/api/core) - Core MCP functionality
- [@nirholas/shared](/docs/api/shared) - Shared utilities and types

### DeFi
- [@nirholas/defi](/docs/api/defi) - DeFi protocol integrations

### Wallets
- [@nirholas/wallets](/docs/api/wallets) - Multi-chain wallet management

### Trading
- [@nirholas/trading](/docs/api/trading) - CEX integrations and bots

### x402 Protocol
- [@x402/core](/docs/api/x402-core) - x402 core SDK
- [@x402/evm](/docs/api/x402-evm) - EVM payment mechanism

## TypeScript Support

All packages include full TypeScript support with:

- Comprehensive type definitions
- JSDoc documentation
- IntelliSense support
- Strict type checking

```typescript
import type { Chain, Token, SwapParams } from '@nirholas/crypto-mcp-core'
import { createMcpServer, registerTools } from '@nirholas/crypto-mcp-core'

// Full type safety
const server = createMcpServer({
  name: 'my-server',
  version: '1.0.0',
})
```

## Documentation Standards

All APIs follow consistent documentation patterns:

```typescript
/**
 * Swap tokens on a DEX
 * 
 * @param params - Swap parameters
 * @param params.tokenIn - Input token address
 * @param params.tokenOut - Output token address
 * @param params.amount - Amount to swap (in wei)
 * @param params.slippage - Maximum slippage (0-1)
 * @returns Transaction receipt
 * 
 * @example
 * ```typescript
 * const receipt = await swap({
 *   tokenIn: USDC,
 *   tokenOut: WETH,
 *   amount: '1000000000', // 1000 USDC
 *   slippage: 0.01, // 1% slippage
 * })
 * ```
 * 
 * @throws {InsufficientLiquidityError} When pool has insufficient liquidity
 * @throws {SlippageExceededError} When price moves beyond slippage tolerance
 * 
 * @see {@link quote} for getting a quote before swapping
 */
export async function swap(params: SwapParams): Promise<TransactionReceipt>
```

## Symbol Types

The API reference uses the following symbol types:

| Icon | Type | Description |
|------|------|-------------|
| 📦 | Module | Package or module export |
| 🏛️ | Class | Class definition |
| 📋 | Interface | TypeScript interface |
| 🏷️ | Type | Type alias |
| ⚡ | Function | Standalone function |
| 📌 | Variable | Exported constant or variable |
| 🔢 | Enum | Enumeration type |
| 🔧 | Method | Class method |
| 🔑 | Property | Class or interface property |

## Contributing

To contribute to the API documentation:

1. Add JSDoc comments to all exported members
2. Include `@example` tags with working code
3. Link related APIs using `@see` tags
4. Run `pnpm docs:api` to regenerate documentation

## Support

- 📚 [Main Documentation](/docs)
- 💬 [Discord Community](https://discord.gg/universal-crypto-mcp)
- 🐛 [Report Issues](https://github.com/nirholas/universal-crypto-mcp/issues)
