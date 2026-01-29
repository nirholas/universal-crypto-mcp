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

## Advanced Features

### Gas Optimization

Professional gas price tracking and optimization for transactions:

```typescript
import { getCurrentGasPrices, GasPriceTracker, getGasOptimizationRecommendation } from "@universal-crypto-mcp/defi-shared";

// Get current gas prices
const prices = await getCurrentGasPrices(publicClient);
console.log(`Standard gas: ${prices.standard} wei`);

// Track gas prices over time
const tracker = new GasPriceTracker();
tracker.record(prices);

// Get optimization recommendations
const recommendation = await getGasOptimizationRecommendation(
  publicClient,
  tracker,
  "low" // urgency
);

if (recommendation.shouldExecuteNow) {
  console.log(recommendation.recommendedAction);
} else {
  console.log(`Wait! ${recommendation.reason}`);
  console.log(`Potential savings: ${recommendation.estimatedSavings}`);
}
```

### Price Oracles

Real-time price feeds from Chainlink and Uniswap V3 TWAP:

```typescript
import { PriceOracle, CHAINLINK_FEEDS } from "@universal-crypto-mcp/defi-shared";

const oracle = new PriceOracle(1); // Ethereum mainnet

// Get Chainlink price
const ethPrice = await oracle.getChainlinkPrice("ETH/USD");
console.log(`ETH: $${ethPrice.price}`);

// Get Uniswap V3 TWAP price
const poolAddress = "0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640"; // USDC/ETH
const twapPrice = await oracle.getUniswapV3Price(poolAddress, 1800); // 30 min TWAP

// Monitor price with alerts
const stopWatching = await oracle.watchPrice(
  "ETH/USD",
  3000, // Target price
  "above", // Trigger when above
  (priceData) => {
    console.log(`Alert! ETH reached $${priceData.price}`);
  }
);
```

### Multicall Operations

Batch multiple contract calls for efficiency:

```typescript
import { MulticallClient, multicallChunked } from "@universal-crypto-mcp/defi-shared";

const multicall = new MulticallClient(1); // Ethereum

// Get multiple token balances in one call
const tokens = [
  "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
  "0xdAC17F958D2ee523a2206206994597C13D831ec7", // USDT
  "0x6B175474E89094C44Da98b954EedeAC495271d0F", // DAI
];

const balances = await multicall.getTokenBalances(
  tokens,
  "0x..." // Your address
);

// Get LP positions in one call
const lpInfo = await multicall.batchGetLPInfo(
  lpTokenAddresses,
  "0x..." // Your address
);

// Get complete portfolio data
const portfolio = await multicall.getPortfolio(
  tokens,
  "0x...", // Your address
  "0x..." // Spender address (optional)
);
```

### Risk Management

Professional risk assessment and slippage protection:

```typescript
import { 
  assessTradeRisk, 
  calculateSlippageWithImpact,
  detectSandwichAttack,
  splitTradeIntoChunks 
} from "@universal-crypto-mcp/defi-shared";

// Assess trade risk
const riskAssessment = assessTradeRisk({
  priceImpact: 2.5,
  slippagePercentage: 1.0,
  liquidityDepth: parseEther("1000000"),
  tradeSize: parseEther("50000"),
  volatility: 25,
  gasPrice: parseGwei("50"),
});

if (!riskAssessment.shouldProceed) {
  console.log(`Risk level: ${riskAssessment.riskLevel}`);
  console.log(`Recommendations: ${riskAssessment.recommendations.join(", ")}`);
}

// Calculate optimal slippage with price impact
const slippage = calculateSlippageWithImpact(
  amountIn,
  expectedOutput,
  reserveIn,
  reserveOut,
  { percentage: 0.5, dynamicAdjustment: true }
);

// Detect sandwich attacks
const sandwichRisk = detectSandwichAttack({
  recentPriceChanges: [0.5, -0.3, 0.8],
  memPoolActivity: 150,
  gasPrice: parseGwei("100"),
  averageGasPrice: parseGwei("50"),
});

if (sandwichRisk.detected) {
  console.log(`⚠️ ${sandwichRisk.recommendation}`);
}

// Split large trades to minimize impact
const chunks = splitTradeIntoChunks(
  totalAmount,
  reserveIn,
  reserveOut,
  1.0 // Max 1% impact per trade
);
```

### Event Monitoring

Real-time blockchain event tracking:

```typescript
import { EventMonitor, createEventMonitor } from "@universal-crypto-mcp/defi-shared";

const monitor = createEventMonitor(1); // Ethereum

// Watch token transfers
const transferId = await monitor.watchTransfers(
  tokenAddress,
  (from, to, amount) => {
    console.log(`Transfer: ${from} → ${to}: ${amount}`);
  }
);

// Watch DEX swaps
const swapId = await monitor.watchSwaps(
  poolAddress,
  (sender, amount0In, amount1In, amount0Out, amount1Out) => {
    console.log(`Swap executed by ${sender}`);
  }
);

// Watch for large transactions (whale watching)
await monitor.watchLargeTransfers(
  tokenAddress,
  parseEther("100000"), // Alert on transfers > 100k tokens
  (from, to, amount) => {
    console.log(`🐋 Whale alert! ${formatEther(amount)} tokens moved`);
  }
);

// Track transaction status
await monitor.watchTransaction(
  txHash,
  (notification) => {
    console.log(`Status: ${notification.status}`);
    console.log(`Confirmations: ${notification.confirmations}`);
  },
  3 // Wait for 3 confirmations
);

// Create price alerts
await monitor.createPriceAlert(
  "ETH/USD",
  3000,
  "above",
  (price) => {
    console.log(`ETH crossed $3000! Current: $${price}`);
  }
);

// Cleanup
monitor.unsubscribeAll();
```

### Portfolio Tracking

Comprehensive DeFi portfolio management:

```typescript
import { PortfolioTracker } from "@universal-crypto-mcp/defi-shared";

const tracker = new PortfolioTracker();

// Update portfolio data
tracker.updatePortfolio({
  address: "0x...",
  tokens: [/* token positions */],
  lpPositions: [/* LP positions */],
  lendingPositions: [/* lending positions */],
  stakingPositions: [/* staking positions */],
  totalValueUSD: 150000,
  lastUpdated: Date.now(),
});

// Get performance metrics
const performance = tracker.getPerformance("0x...");
console.log(`Total Value: $${performance.totalValueUSD}`);
console.log(`24h Change: ${performance.totalValueChangePercent24h.toFixed(2)}%`);
console.log(`All-Time High: $${performance.allTimeHigh}`);
console.log(`Sharpe Ratio: ${performance.sharpeRatio?.toFixed(2)}`);

// Calculate diversification
const diversificationScore = tracker.calculateDiversificationScore("0x...");
console.log(`Diversification Score: ${diversificationScore.toFixed(1)}/100`);

// Get allocation breakdown
const allocation = tracker.getAllocationBreakdown("0x...");
console.log(`Tokens: ${allocation.tokens.toFixed(1)}%`);
console.log(`LP: ${allocation.lp.toFixed(1)}%`);
console.log(`Lending: ${allocation.lending.toFixed(1)}%`);
console.log(`Staking: ${allocation.staking.toFixed(1)}%`);

// Calculate total yield
const yieldData = tracker.calculateTotalYield("0x...");
console.log(`Total Yield: ${yieldData.totalYieldPercent.toFixed(2)}% APY`);
console.log(`Annual earnings: $${yieldData.totalYieldUSD.toFixed(2)}`);

// Export portfolio
const exported = tracker.exportPortfolio("0x...");
```

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
