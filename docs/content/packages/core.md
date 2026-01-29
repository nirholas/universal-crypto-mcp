# Core Package

The core package provides shared types, utilities, and configuration for all Universal Crypto MCP packages.

## Installation

```bash
npm install @universal-crypto-mcp/core
```

## Features

- **Type Definitions**: Shared TypeScript types
- **Configuration**: Centralized config management
- **Utilities**: Common helper functions
- **Base Classes**: Abstract classes for tools
- **Logging**: Structured logging utilities
- **Error Handling**: Standardized error types

## Usage

### Configuration

```typescript
import { Config, loadConfig } from "@universal-crypto-mcp/core";

// Load configuration from environment/file
const config = loadConfig();

// Access configuration
console.log(config.logLevel);  // 'INFO'
console.log(config.modules);   // ['trading', 'market-data', ...]
```

### Types

```typescript
import {
  Chain,
  Token,
  Balance,
  Transaction,
  SwapQuote,
  LendingPosition,
} from "@universal-crypto-mcp/core/types";

// Chain definition
const ethereum: Chain = {
  id: 1,
  name: "Ethereum",
  network: "mainnet",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: ["https://eth.llamarpc.com"],
  blockExplorers: ["https://etherscan.io"],
};

// Token definition
const usdc: Token = {
  address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  symbol: "USDC",
  name: "USD Coin",
  decimals: 6,
  chainId: 1,
};

// Balance type
const balance: Balance = {
  raw: "1000000000000000000",
  formatted: "1.0",
  decimals: 18,
  symbol: "ETH",
};
```

### Logging

```typescript
import { createLogger } from "@universal-crypto-mcp/core/logging";

const logger = createLogger("my-module");

logger.info("Starting operation", { userId: "123" });
logger.error("Operation failed", { error: err });
logger.debug("Debug info", { data: someData });
```

### Error Handling

```typescript
import {
  MCPError,
  InsufficientFundsError,
  InvalidAddressError,
  NetworkError,
} from "@universal-crypto-mcp/core/errors";

try {
  await executeSwap(params);
} catch (error) {
  if (error instanceof InsufficientFundsError) {
    console.log("Not enough balance:", error.required, error.available);
  } else if (error instanceof NetworkError) {
    console.log("Network issue:", error.chainId);
  }
}
```

### Base Tool Class

```typescript
import { BaseTool, ToolResult } from "@universal-crypto-mcp/core";

export class MyCustomTool extends BaseTool {
  name = "my_custom_tool";
  description = "Does something useful";
  
  inputSchema = {
    type: "object",
    properties: {
      param1: { type: "string", description: "First parameter" },
      param2: { type: "number", description: "Second parameter" },
    },
    required: ["param1"],
  };

  async execute(params: { param1: string; param2?: number }): Promise<ToolResult> {
    // Implementation
    return {
      success: true,
      data: { result: "..." },
    };
  }
}
```

## Utility Functions

### Address Utilities

```typescript
import {
  isValidAddress,
  checksumAddress,
  shortenAddress,
} from "@universal-crypto-mcp/core/utils";

isValidAddress("0x1234...");  // true/false
checksumAddress("0x1234...");  // "0x1234..." (checksummed)
shortenAddress("0x1234567890...", 4);  // "0x12...7890"
```

### Number Utilities

```typescript
import {
  formatUnits,
  parseUnits,
  formatCurrency,
} from "@universal-crypto-mcp/core/utils";

formatUnits("1000000000000000000", 18);  // "1.0"
parseUnits("1.5", 18);  // "1500000000000000000"
formatCurrency(1234.56);  // "$1,234.56"
```

### Chain Utilities

```typescript
import {
  getChain,
  getChainById,
  isEVMChain,
  getExplorerUrl,
} from "@universal-crypto-mcp/core/chains";

const ethereum = getChainById(1);
const txUrl = getExplorerUrl(1, "0x...", "tx");  // Etherscan URL
```

## Configuration Schema

```typescript
interface Config {
  // Core settings
  logLevel: "DEBUG" | "INFO" | "WARN" | "ERROR";
  transport: "stdio" | "http" | "sse";
  port: number;
  
  // Enabled modules
  modules: string[];
  
  // Chain configuration
  chains: Record<string, ChainConfig>;
  
  // API keys
  apiKeys: {
    coingecko?: string;
    etherscan?: string;
    infura?: string;
    alchemy?: string;
  };
  
  // Wallet configuration
  wallet?: {
    privateKey?: string;
    mnemonic?: string;
  };
}
```

## Supported Chains

The core package includes definitions for 20+ chains:

| Chain | Chain ID | Type |
|-------|----------|------|
| Ethereum | 1 | EVM |
| BNB Smart Chain | 56 | EVM |
| Polygon | 137 | EVM |
| Arbitrum One | 42161 | EVM |
| Base | 8453 | EVM |
| Optimism | 10 | EVM |
| Avalanche | 43114 | EVM |
| Fantom | 250 | EVM |
| zkSync Era | 324 | EVM |
| Linea | 59144 | EVM |
| Scroll | 534352 | EVM |
| Blast | 81457 | EVM |

## Related Packages

- [Shared Package](../shared/index.md) - Additional utilities
- [Trading Package](trading.md) - Exchange integrations
- [Wallets Package](wallets.md) - Wallet management
