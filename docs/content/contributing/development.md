# Development Guide

This guide covers setting up a development environment for Universal Crypto MCP.

## Prerequisites

- **Node.js** 18+ (LTS recommended)
- **pnpm** 8+ (package manager)
- **Git** 2.30+
- **VS Code** (recommended editor)

## Setup

### 1. Clone the Repository

```bash
git clone https://github.com/nirholas/universal-crypto-mcp.git
cd universal-crypto-mcp
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Build All Packages

```bash
pnpm build
```

### 4. Run Tests

```bash
pnpm test
```

## Project Structure

```
universal-crypto-mcp/
├── packages/           # Monorepo packages
│   ├── core/           # Shared types and utilities
│   ├── trading/        # Exchange integrations
│   ├── market-data/    # Price and analytics
│   ├── wallets/        # Wallet management
│   ├── defi/           # DeFi protocols
│   └── payments/       # Payment infrastructure
├── x402-deploy/        # x402 deployment toolkit
├── src/                # Main MCP server source
├── docs/               # Documentation
├── examples/           # Example projects
└── tests/              # Test infrastructure
```

## Development Workflow

### Running in Development Mode

```bash
# Run the main server in dev mode
pnpm dev

# Run a specific package in dev mode
pnpm --filter @universal-crypto-mcp/trading-binance dev
```

### Building

```bash
# Build all packages
pnpm build

# Build a specific package
pnpm --filter @universal-crypto-mcp/core build

# Build with watch mode
pnpm build:watch
```

### Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run e2e tests
pnpm test:e2e

# Run tests for a specific package
pnpm --filter @universal-crypto-mcp/core test
```

### Linting and Formatting

```bash
# Check linting
pnpm lint

# Fix linting issues
pnpm lint:fix

# Check formatting
pnpm format:check

# Fix formatting
pnpm format
```

## Creating a New Package

### 1. Create Package Directory

```bash
mkdir -p packages/my-package/src
```

### 2. Create package.json

```json
{
  "name": "@universal-crypto-mcp/my-package",
  "version": "1.0.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "test": "vitest"
  },
  "dependencies": {
    "@universal-crypto-mcp/core": "workspace:*"
  }
}
```

### 3. Create tsup.config.ts

```typescript
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  clean: true,
});
```

### 4. Create Source Files

```typescript
// src/index.ts
export * from "./tools";
export * from "./types";
```

## Adding New Tools

### 1. Create Tool File

```typescript
// src/tools/my-tool.ts
import { BaseTool, ToolResult } from "@universal-crypto-mcp/core";

export class MyTool extends BaseTool {
  name = "my_tool";
  description = "Does something useful";
  
  inputSchema = {
    type: "object",
    properties: {
      param1: { type: "string", description: "First parameter" },
    },
    required: ["param1"],
  };

  async execute(params: { param1: string }): Promise<ToolResult> {
    // Implementation
    return {
      success: true,
      data: { result: "..." },
    };
  }
}
```

### 2. Register Tool

```typescript
// src/register.ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { MyTool } from "./tools/my-tool";

export function registerMyTools(server: McpServer) {
  const myTool = new MyTool();
  server.registerTool(myTool.name, myTool.inputSchema, myTool.execute);
}
```

### 3. Add Tests

```typescript
// src/tools/my-tool.test.ts
import { describe, it, expect } from "vitest";
import { MyTool } from "./my-tool";

describe("MyTool", () => {
  it("should return expected result", async () => {
    const tool = new MyTool();
    const result = await tool.execute({ param1: "test" });
    expect(result.success).toBe(true);
  });
});
```

## Environment Variables

Create a `.env` file for local development:

```bash
# API Keys (for testing)
COINGECKO_API_KEY=your-key
BINANCE_API_KEY=your-key
BINANCE_API_SECRET=your-secret

# Wallet (for testing - use testnet!)
PRIVATE_KEY=0x...

# x402 (for testing)
X402_PRIVATE_KEY=0x...
X402_CHAIN=arbitrum

# Logging
LOG_LEVEL=DEBUG
```

## Debugging

### VS Code Launch Configuration

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug MCP Server",
      "program": "${workspaceFolder}/src/index.ts",
      "runtimeArgs": ["-r", "tsx/cjs"],
      "console": "integratedTerminal"
    },
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Tests",
      "program": "${workspaceFolder}/node_modules/vitest/vitest.mjs",
      "args": ["run", "--reporter=verbose"],
      "console": "integratedTerminal"
    }
  ]
}
```

### Console Logging

```typescript
import { createLogger } from "@universal-crypto-mcp/core";

const logger = createLogger("my-module");

logger.debug("Debug info", { data: someData });
logger.info("Operation complete");
logger.error("Error occurred", { error });
```

## Code Style

### TypeScript Guidelines

- Use strict TypeScript settings
- Prefer interfaces over types for objects
- Use explicit return types for public functions
- Document public APIs with JSDoc

### Naming Conventions

- Files: `kebab-case.ts`
- Classes: `PascalCase`
- Functions/methods: `camelCase`
- Constants: `UPPER_SNAKE_CASE`
- Tool names: `snake_case`

### Example

```typescript
/**
 * Gets the current price of a cryptocurrency.
 * @param symbol - The token symbol (e.g., "BTC", "ETH")
 * @returns The current price data
 */
export async function getPrice(symbol: string): Promise<PriceData> {
  // Implementation
}
```

## Next Steps

- [Testing Guide](testing.md) - Writing and running tests
- [Release Process](releases.md) - How to release new versions
