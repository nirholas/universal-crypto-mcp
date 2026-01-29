# @universal-crypto-mcp/defi-sperax

Sperax USDs stablecoin integration for Model Context Protocol (MCP).

## Overview

This package provides tools for interacting with Sperax USDs, a yield-bearing stablecoin on Arbitrum. USDs automatically earns yield through rebasing, making it an attractive option for AI agents managing funds.

## Features

- **Balance Tracking**: Query USDs balances on Arbitrum
- **Yield Monitoring**: Track yield earned through rebasing
- **Yield Projection**: Project future earnings based on current APY
- **Transfer Operations**: Send USDs between addresses
- **Approval Management**: Manage token approvals

## Installation

```bash
pnpm add @universal-crypto-mcp/defi-sperax
```

## Usage

### Basic Balance Query

```typescript
import { USDsClient } from "@universal-crypto-mcp/defi-sperax";

const client = new USDsClient();

const balance = await client.getBalance("0x...");
console.log(`USDs Balance: ${balance}`);
```

### Yield Tracking

```typescript
import { USDsClient, USDsYieldTracker } from "@universal-crypto-mcp/defi-sperax";

const client = new USDsClient();
const tracker = new USDsYieldTracker(client);

// Take a snapshot
await tracker.takeSnapshot("0x...");

// Get projections
const projections = await tracker.getYieldProjections("1000");
console.log(`Yearly yield: ${projections.yearly.projectedYield} USDs`);
```

### Transfer Operations

```typescript
import { USDsClient } from "@universal-crypto-mcp/defi-sperax";

const client = new USDsClient({
  privateKey: "0x...",
});

const txHash = await client.transfer("0xrecipient...", "100");
console.log(`Transfer tx: ${txHash}`);
```

## Why USDs?

- **Auto-Yield**: Earn ~8-10% APY automatically through rebasing
- **No Staking Required**: Yield is distributed to all holders
- **Stable Value**: Pegged to USD with overcollateralization
- **Low Gas**: Operates on Arbitrum for minimal transaction costs

## Contract Addresses

| Contract | Address |
|----------|---------|
| USDs | `0xD74f5255D557944cf7Dd0E45FF521520002D5748` |
| Vault | `0x6Bbc476Ee35CBA9e9c3A59fc5b10d7a0BC6f74Ca` |

## License

Apache-2.0
