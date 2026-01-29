# Testing Guide

This guide covers the testing infrastructure for Universal Crypto MCP.

## Test Framework

We use [Vitest](https://vitest.dev/) for testing:

- Fast execution
- Native TypeScript support
- Jest-compatible API
- Built-in coverage

## Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run with coverage
pnpm test:coverage

# Run e2e tests
pnpm test:e2e

# Run specific test file
pnpm test src/tools/price.test.ts

# Run tests matching pattern
pnpm test --grep "price"
```

## Test Structure

```
tests/
├── setup.ts              # Global test setup
├── utils/
│   ├── mocks.ts          # Mock utilities
│   ├── fixtures.ts       # Test fixtures
│   └── assertions.ts     # Custom assertions
├── integration/
│   ├── trading.test.ts   # Trading integration tests
│   ├── wallets.test.ts   # Wallet integration tests
│   └── payments.test.ts  # Payment integration tests
└── e2e/
    ├── mcp-server.test.ts    # MCP server e2e tests
    └── x402-deploy.test.ts   # x402-deploy e2e tests
```

## Writing Tests

### Unit Tests

```typescript
import { describe, it, expect, vi } from "vitest";
import { getPrice } from "../src/tools/price";

describe("getPrice", () => {
  it("should return price for valid symbol", async () => {
    const result = await getPrice("BTC");
    
    expect(result).toHaveProperty("symbol", "BTC");
    expect(result).toHaveProperty("price");
    expect(typeof result.price).toBe("number");
  });

  it("should throw for invalid symbol", async () => {
    await expect(getPrice("INVALID")).rejects.toThrow("Symbol not found");
  });
});
```

### Using Mocks

```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";
import { createMockMcpServer, createMockWallet } from "../utils/mocks";

describe("WalletTools", () => {
  let mockServer;
  let mockWallet;

  beforeEach(() => {
    mockServer = createMockMcpServer();
    mockWallet = createMockWallet();
    vi.clearAllMocks();
  });

  it("should register wallet tools", () => {
    registerWalletTools(mockServer, mockWallet);
    expect(mockServer.registerTool).toHaveBeenCalled();
  });

  it("should get balance", async () => {
    mockWallet.getBalance.mockResolvedValue({
      raw: "1000000000000000000",
      formatted: "1.0",
      symbol: "ETH",
    });

    const result = await getBalance(mockWallet);
    expect(result.formatted).toBe("1.0");
  });
});
```

### Using Fixtures

```typescript
import { describe, it, expect } from "vitest";
import { ETH_MAINNET_ADDRESSES, SAMPLE_TRANSACTIONS } from "../utils/fixtures";

describe("TransactionParser", () => {
  it("should parse transfer transaction", () => {
    const tx = SAMPLE_TRANSACTIONS.ERC20_TRANSFER;
    const parsed = parseTransaction(tx);
    
    expect(parsed.type).toBe("transfer");
    expect(parsed.token).toBe(ETH_MAINNET_ADDRESSES.USDC);
  });
});
```

### Integration Tests

```typescript
import { describe, it, expect, beforeAll, afterAll } from "vitest";

describe("Trading Integration", () => {
  let server;

  beforeAll(async () => {
    server = await createTestServer();
  });

  afterAll(async () => {
    await server.close();
  });

  it("should get real market data", async () => {
    const result = await server.callTool("get_price", { symbol: "BTC" });
    
    expect(result.success).toBe(true);
    expect(result.data.price).toBeGreaterThan(0);
  });
});
```

### E2E Tests

```typescript
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { spawn } from "child_process";

describe("MCP Server E2E", () => {
  let serverProcess;

  beforeAll(async () => {
    serverProcess = spawn("node", ["dist/index.js"]);
    await waitForServer(serverProcess);
  });

  afterAll(() => {
    serverProcess.kill();
  });

  it("should list available tools", async () => {
    const response = await sendMcpRequest({
      method: "tools/list",
    });

    expect(response.tools).toBeInstanceOf(Array);
    expect(response.tools.length).toBeGreaterThan(0);
  });

  it("should execute tool", async () => {
    const response = await sendMcpRequest({
      method: "tools/call",
      params: {
        name: "get_price",
        arguments: { symbol: "ETH" },
      },
    });

    expect(response.content[0].type).toBe("text");
  });
});
```

## Mock Utilities

### createMockMcpServer

```typescript
import { vi } from "vitest";

export function createMockMcpServer() {
  return {
    registerTool: vi.fn(),
    registerResource: vi.fn(),
    registerPrompt: vi.fn(),
    connect: vi.fn(),
    close: vi.fn(),
  };
}
```

### createMockWallet

```typescript
export function createMockWallet() {
  return {
    address: "0x1234567890123456789012345678901234567890",
    getBalance: vi.fn().mockResolvedValue({
      raw: "1000000000000000000",
      formatted: "1.0",
      decimals: 18,
      symbol: "ETH",
    }),
    transfer: vi.fn().mockResolvedValue({
      hash: "0xabc123...",
      status: "pending",
    }),
    signMessage: vi.fn().mockResolvedValue("0xsignature..."),
  };
}
```

### createMockX402Response

```typescript
export function createMockX402Response() {
  return {
    status: 402,
    body: {
      x402Version: 2,
      accepts: [
        {
          scheme: "exact",
          network: "eip155:42161",
          maxAmountRequired: "1000000",
          payTo: "0x...",
          asset: "0x...",
        },
      ],
    },
  };
}
```

## Test Fixtures

### Addresses

```typescript
export const ETH_MAINNET_ADDRESSES = {
  VITALIK: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
  USDC: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  WETH: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  UNISWAP_V3_ROUTER: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
  AAVE_V3_POOL: "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2",
};
```

### Transactions

```typescript
export const SAMPLE_TRANSACTIONS = {
  ETH_TRANSFER: {
    hash: "0x...",
    from: "0x...",
    to: "0x...",
    value: "1000000000000000000",
  },
  ERC20_TRANSFER: {
    hash: "0x...",
    from: "0x...",
    to: "0x...",
    data: "0xa9059cbb...",
  },
};
```

## Coverage

### Running Coverage

```bash
pnpm test:coverage
```

### Coverage Thresholds

Configured in `vitest.config.ts`:

```typescript
export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
});
```

## CI/CD Integration

Tests run automatically on:
- Pull requests
- Push to main
- Release tags

See `.github/workflows/test.yml` for configuration.

## Best Practices

1. **Test behavior, not implementation**
2. **Use descriptive test names**
3. **Keep tests focused and small**
4. **Mock external dependencies**
5. **Use fixtures for test data**
6. **Clean up after tests**

## Next Steps

- [Development Guide](development.md) - Development workflow
- [Release Process](releases.md) - How to release
