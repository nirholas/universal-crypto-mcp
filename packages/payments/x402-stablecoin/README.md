# @universal-crypto-mcp/x402-stablecoin

Stablecoin utilities for x402 payments in the Model Context Protocol (MCP).

## Overview

This package provides stablecoin operations for x402 payments, including USDC transfers, USDs yield-bearing payments, and cross-chain bridging.

## Features

- **USDC Client**: Multi-chain USDC operations
- **USDs Integration**: Yield-bearing payments via Sperax
- **Cross-chain Bridge**: Bridge stablecoins between chains

## Installation

```bash
pnpm add @universal-crypto-mcp/x402-stablecoin
```

## Usage

### USDC Operations

```typescript
import { USDCClient } from "@universal-crypto-mcp/x402-stablecoin";

const client = new USDCClient({
  chain: "base",
  privateKey: "0x...",
});

// Get balance
const balance = await client.getBalance("0x...");

// Transfer USDC
const txHash = await client.transfer("0xrecipient...", "10.00");
```

### Yield-Bearing Payments with USDs

```typescript
import { USDsPaymentClient } from "@universal-crypto-mcp/x402-stablecoin";

const client = new USDsPaymentClient({
  privateKey: "0x...",
  enableYieldTracking: true,
});

// Pay with USDs (earns yield until spent)
const txHash = await client.pay("0xrecipient...", "100.00");

// Get yield projections
const projections = await client.getYieldProjections("1000");
console.log(`Monthly yield: ${projections.monthly.projectedYield}`);
```

### Cross-chain Bridging

```typescript
import { StablecoinBridge } from "@universal-crypto-mcp/x402-stablecoin";

const bridge = new StablecoinBridge();

// Get quote
const quote = await bridge.getQuote(
  "ethereum",
  "arbitrum",
  "USDC",
  "100"
);

console.log(`Bridge fee: ${quote.fee}`);
console.log(`ETA: ${quote.estimatedTime} seconds`);

// Find cheapest route
const cheapest = bridge.findCheapestRoute("ethereum", "base");
```

## Supported Chains

| Chain | USDC | USDs |
|-------|------|------|
| Ethereum | ✅ | ❌ |
| Arbitrum | ✅ | ✅ |
| Optimism | ✅ | ❌ |
| Base | ✅ | ❌ |
| Polygon | ✅ | ❌ |
| BSC | ✅ | ❌ |

## Why USDs?

USDs is a yield-bearing stablecoin that automatically earns ~8-10% APY through rebasing. This makes it ideal for AI agents that hold funds between transactions.

```typescript
import { calculateYieldAdvantage } from "@universal-crypto-mcp/x402-stablecoin";

const advantage = calculateYieldAdvantage("1000", 30, 8.5);
console.log(`30-day advantage: $${advantage.advantage}`);
// Output: 30-day advantage: $6.98
```

## Bridge Routes

| From | To | Provider | Avg Time | Avg Fee |
|------|-----|----------|----------|---------|
| Ethereum | Arbitrum | Arbitrum Bridge | 10 min | $0.50 |
| Ethereum | Base | Base Bridge | 10 min | $0.50 |
| Arbitrum | Base | Across | 2 min | $0.10 |

## License

Apache-2.0
