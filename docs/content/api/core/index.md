---
title: "Core API Reference"
description: "API documentation for Core & Infrastructure packages"
category: "api"
keywords: ["api", "core", "infrastructure", "mcp", "utilities"]
order: 1
---

# Core & Infrastructure API Reference

Core packages provide the foundation for the Universal Crypto MCP ecosystem.

## Packages

| Package | Description |
|---------|-------------|
| `@nirholas/crypto-mcp-core` | MCP server core functionality |
| `@nirholas/mcp-utils` | MCP utility functions |
| `@nirholas/evm-utils` | EVM chain utilities |
| `@nirholas/copilot-terminal` | Terminal integration for Copilot |
| `@nirholas/infrastructure` | Service discovery and infrastructure |

## @nirholas/crypto-mcp-core

The core package provides the foundation for building MCP servers.

### Installation

```bash
pnpm add @nirholas/crypto-mcp-core
```

### Key Exports

```typescript
// Server creation
export function createMcpServer(config: ServerConfig): McpServer
export function startServer(server: McpServer): Promise<void>

// Tool registration
export function registerTool(server: McpServer, tool: Tool): void
export function registerTools(server: McpServer, tools: Tool[]): void

// Resource management
export function registerResource(server: McpServer, resource: Resource): void

// Prompt templates
export function registerPrompt(server: McpServer, prompt: Prompt): void
```

### Types

#### ServerConfig

```typescript
interface ServerConfig {
  /** Server name */
  name: string
  /** Server version */
  version: string
  /** Server description */
  description?: string
  /** Transport type */
  transport?: 'stdio' | 'http' | 'sse'
  /** HTTP port (for http/sse transport) */
  port?: number
  /** Enable request logging */
  logging?: boolean
}
```

#### Tool

```typescript
interface Tool {
  /** Tool name (must be unique) */
  name: string
  /** Tool description */
  description: string
  /** Input schema (JSON Schema) */
  inputSchema: JsonSchema
  /** Tool handler function */
  handler: (params: unknown) => Promise<ToolResult>
}
```

#### ToolResult

```typescript
interface ToolResult {
  /** Result content */
  content: Array<{
    type: 'text' | 'image' | 'resource'
    text?: string
    data?: string
    mimeType?: string
  }>
  /** Whether the tool call had an error */
  isError?: boolean
}
```

### Example

```typescript
import { createMcpServer, registerTool, startServer } from '@nirholas/crypto-mcp-core'

const server = createMcpServer({
  name: 'my-crypto-server',
  version: '1.0.0',
  description: 'My custom crypto MCP server',
})

registerTool(server, {
  name: 'get_balance',
  description: 'Get token balance for an address',
  inputSchema: {
    type: 'object',
    properties: {
      address: { type: 'string', description: 'Wallet address' },
      token: { type: 'string', description: 'Token address' },
      chain: { type: 'string', description: 'Chain name' },
    },
    required: ['address', 'chain'],
  },
  handler: async (params) => {
    const { address, token, chain } = params as any
    const balance = await getBalance(address, token, chain)
    return {
      content: [{ type: 'text', text: `Balance: ${balance}` }],
    }
  },
})

await startServer(server)
```

---

## Chain Configuration

### Supported Chains

The core package includes configuration for 60+ blockchain networks:

```typescript
import { chains, getChain, getChainById } from '@nirholas/crypto-mcp-core/chains'

// Get chain by name
const ethereum = getChain('ethereum')
const arbitrum = getChain('arbitrum')

// Get chain by ID
const polygon = getChainById(137)

// All chains
console.log(chains.length) // 60+
```

### Chain Type

```typescript
interface Chain {
  /** Chain ID */
  id: number
  /** Chain name */
  name: string
  /** Display name */
  displayName: string
  /** Native currency symbol */
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  }
  /** RPC URLs */
  rpcUrls: {
    default: { http: string[] }
    public?: { http: string[] }
  }
  /** Block explorer */
  blockExplorers?: {
    default: {
      name: string
      url: string
    }
  }
  /** Is testnet */
  testnet?: boolean
}
```

### EVM Chains

| Chain | ID | Symbol |
|-------|-----|--------|
| Ethereum | 1 | ETH |
| Arbitrum One | 42161 | ETH |
| Optimism | 10 | ETH |
| Base | 8453 | ETH |
| Polygon | 137 | MATIC |
| BNB Chain | 56 | BNB |
| Avalanche | 43114 | AVAX |
| Fantom | 250 | FTM |
| zkSync Era | 324 | ETH |
| Linea | 59144 | ETH |

---

## Token Utilities

### Token Type

```typescript
interface Token {
  /** Token address */
  address: `0x${string}`
  /** Token symbol */
  symbol: string
  /** Token name */
  name: string
  /** Decimals */
  decimals: number
  /** Chain ID */
  chainId: number
  /** Logo URI */
  logoURI?: string
}
```

### Token Functions

```typescript
// Get token by symbol on a chain
export function getToken(chainId: number, symbol: string): Token | undefined

// Get token by address
export function getTokenByAddress(chainId: number, address: string): Token | undefined

// Format token amount
export function formatTokenAmount(amount: bigint, decimals: number): string

// Parse token amount
export function parseTokenAmount(amount: string, decimals: number): bigint
```

---

## Utility Functions

### Address Utilities

```typescript
// Validate Ethereum address
export function isAddress(address: string): boolean

// Checksum address
export function checksumAddress(address: string): `0x${string}`

// Compare addresses (case-insensitive)
export function isSameAddress(a: string, b: string): boolean

// Shorten address for display
export function shortenAddress(address: string, chars?: number): string
// Example: "0x1234...5678"
```

### Number Utilities

```typescript
// Format large numbers with abbreviations
export function formatNumber(value: number | bigint): string
// Examples: "1.5K", "2.3M", "1.2B"

// Format currency
export function formatCurrency(value: number, currency?: string): string
// Example: "$1,234.56"

// Format percentage
export function formatPercentage(value: number, decimals?: number): string
// Example: "12.34%"
```

### Transaction Utilities

```typescript
// Calculate gas estimate with buffer
export function estimateGasWithBuffer(
  estimate: bigint, 
  bufferPercentage?: number
): bigint

// Format transaction hash
export function formatTxHash(hash: string): string
// Example: "0x1234...5678"

// Get explorer URL for transaction
export function getExplorerTxUrl(chainId: number, hash: string): string
```

---

## Error Handling

### Custom Error Types

```typescript
// Base error class
export class McpError extends Error {
  code: string
  details?: unknown
}

// Specific errors
export class ChainNotSupportedError extends McpError {}
export class TokenNotFoundError extends McpError {}
export class InsufficientBalanceError extends McpError {}
export class TransactionFailedError extends McpError {}
export class RpcError extends McpError {}
export class ValidationError extends McpError {}
```

### Error Handling Example

```typescript
import { 
  InsufficientBalanceError, 
  TransactionFailedError 
} from '@nirholas/crypto-mcp-core'

try {
  await executeSwap(params)
} catch (error) {
  if (error instanceof InsufficientBalanceError) {
    console.error('Not enough tokens:', error.details)
  } else if (error instanceof TransactionFailedError) {
    console.error('Transaction failed:', error.message)
  } else {
    throw error
  }
}
```

---

## Configuration

### Environment Variables

```bash
# RPC URLs
ETHEREUM_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY
ARBITRUM_RPC_URL=https://arb-mainnet.g.alchemy.com/v2/YOUR_KEY

# API Keys
COINGECKO_API_KEY=your_key
DUNE_API_KEY=your_key

# Wallet (for signing)
PRIVATE_KEY=0x...
MNEMONIC=word1 word2 word3...

# Server
PORT=3000
LOG_LEVEL=info
```

### Configuration File

```typescript
// mcp.config.ts
import { defineConfig } from '@nirholas/crypto-mcp-core'

export default defineConfig({
  server: {
    name: 'my-server',
    version: '1.0.0',
  },
  chains: ['ethereum', 'arbitrum', 'base'],
  tools: {
    defi: true,
    wallets: true,
    trading: false,
  },
  rateLimit: {
    windowMs: 60000,
    max: 100,
  },
})
```
