# 🧱 Core Package

> Shared types, utilities, and configuration for Universal Crypto MCP

## Overview

This package provides the foundational building blocks used across all Universal Crypto MCP servers. It includes type definitions, utility functions, and common configurations.

## Installation

```bash
npm install @nirholas/crypto-mcp-core
# or
pnpm add @nirholas/crypto-mcp-core
```

## Features

### Types
- `Network` - Blockchain network definitions
- `Wallet` - Wallet address types
- `Token` - ERC-20 token types
- `Transaction` - Transaction types
- `PriceData` - Market price data
- `X402Payment` - x402 payment types
- `MCPServerConfig` - Server configuration

### Utilities
- `isValidAddress()` - Validate Ethereum addresses
- `checksumAddress()` - Checksum addresses
- `truncateAddress()` - Truncate for display
- `formatUnits()` - Format token amounts
- `parseUnits()` - Parse token amounts
- `formatNumber()` - Format with commas
- `formatCurrency()` - Format as currency
- `sleep()` - Async delay
- `withRetry()` - Retry with exponential backoff
- `MCPError` - Custom error class

## Usage

```typescript
import { 
  isValidAddress, 
  formatUnits, 
  withRetry,
  type Network,
  type Token 
} from '@nirholas/crypto-mcp-core';

// Validate address
if (isValidAddress('0x...')) {
  console.log('Valid!');
}

// Format token balance
const balance = formatUnits(1000000000000000000n, 18); // "1"

// Retry failed operations
const result = await withRetry(
  () => fetch('https://api.example.com'),
  { maxRetries: 3 }
);
```

## API Reference

### Address Utilities

```typescript
isValidAddress(address: string): boolean
checksumAddress(address: string): Address
truncateAddress(address: string, chars?: number): string
```

### Number Utilities

```typescript
formatUnits(value: bigint, decimals: number): string
parseUnits(value: string, decimals: number): bigint
formatNumber(num: number, decimals?: number): string
formatCurrency(value: number, currency?: string): string
```

### Async Utilities

```typescript
sleep(ms: number): Promise<void>
withRetry<T>(fn: () => Promise<T>, options?: RetryOptions): Promise<T>
```

### Error Utilities

```typescript
class MCPError extends Error {
  constructor(message: string, code: string, details?: Record<string, unknown>)
}
createErrorResponse(error: unknown): { error: string; code: string }
```

---

## 👤 Author

**nich** - Building the most extensive crypto MCP repository

- 🐙 GitHub: [@nirholas](https://github.com/nirholas)
- 🐦 Twitter: [@nichxbt](https://x.com/nichxbt)
- 📦 NPM: [@nirholas](https://www.npmjs.com/~nirholas)

## 🤝 Contributing

Contributions welcome! See [CONTRIBUTING.md](../../CONTRIBUTING.md)

## 📄 License

Apache-2.0 - see [LICENSE](../../LICENSE)
