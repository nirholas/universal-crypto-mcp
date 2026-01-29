# Yields MCP Server

MCP server for DeFi yield discovery and comparison, powered by DeFiLlama.

## Installation

```bash
npm install @boosty/mcp-yields
```

## Usage

### As CLI

```bash
npx boosty-mcp-yields
```

### As Library

```typescript
import { createYieldsServer } from '@boosty/mcp-yields';

const server = createYieldsServer();
await server.run();
```

## Available Tools

### getTopYields
Get top DeFi yields across protocols and chains.

**Input:**
- `chain` (optional): Filter by blockchain
- `minTvl` (optional): Minimum TVL in USD
- `minApy` (optional): Minimum APY percentage
- `maxRisk` (optional): Maximum risk score (1-10)
- `limit` (optional): Maximum results (default: 20)
- `stablecoinOnly` (optional): Only stablecoin pools

### getPoolDetails
Get detailed information about a specific yield pool.

**Input:**
- `poolId` (required): Pool identifier from DeFiLlama

### getYieldHistory
Get historical APY and TVL data for a pool.

**Input:**
- `poolId` (required): Pool identifier
- `days` (optional): Days of history (default: 30)

### compareYields
Compare multiple yield pools with recommendations.

**Input:**
- `poolIds` (required): Array of pool identifiers

### getStablecoinYields
Get yield opportunities for stablecoins.

**Input:**
- `stablecoin` (optional): Specific stablecoin (USDC, USDT, etc.)
- `chain` (optional): Filter by blockchain
- `minApy` (optional): Minimum APY percentage

### getLPYields
Find LP pool yields for a token pair.

**Input:**
- `token0` (required): First token symbol
- `token1` (required): Second token symbol
- `chain` (optional): Filter by blockchain

### estimateReturns
Estimate potential returns for an investment.

**Input:**
- `poolId` (required): Pool identifier
- `amount` (required): Investment amount in USD
- `days` (required): Investment period in days

### getRiskAssessment
Get comprehensive risk assessment for a pool.

**Input:**
- `poolId` (required): Pool identifier

**Output:**
- `overallRisk`: Score from 1-10
- `factors`: IL risk, smart contract risk, protocol risk, chain risk
- `audits`: Audit links
- `warnings`: Risk warnings

## Data Source

All yield data is sourced from [DeFiLlama](https://defillama.com/yields).

## License

MIT
