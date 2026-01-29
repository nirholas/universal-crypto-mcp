/**
 * @boosty/mcp-trading-engine
 * 
 * Comprehensive Solana DeFi trading engine with support for:
 * - Jupiter V6 aggregation
 * - Raydium AMM V4 and CLMM
 * - Orca Whirlpool
 * - PumpFun bonding curve
 * - Smart order routing
 * - MEV protection
 * - Price impact analytics
 */

// Types
export * from './types.js';

// Jupiter
export { JupiterClient } from './jupiter/client.js';
export { JupiterQuote } from './jupiter/quote.js';
export { JupiterSwap } from './jupiter/swap.js';
export { JupiterDCA, type DCAAccountState } from './jupiter/dca.js';
export { JupiterLimitOrders, type LimitOrderState } from './jupiter/limit-orders.js';

// Raydium
export { RaydiumClient } from './raydium/client.js';
export { RaydiumAMM } from './raydium/amm.js';
export { RaydiumCLMM } from './raydium/clmm.js';
export { RaydiumLiquidity, type LiquidityCalculation, type RemoveLiquidityCalculation } from './raydium/liquidity.js';

// Orca
export { OrcaClient } from './orca/client.js';
export { OrcaWhirlpool } from './orca/whirlpool.js';

// PumpFun
export { PumpFunClient } from './pumpfun/client.js';
export { PumpFunBondingCurve } from './pumpfun/bonding-curve.js';
export { PumpFunMonitor } from './pumpfun/monitor.js';

// Executor
export { TradeExecutor } from './executor/trade-executor.js';
export { BatchExecutor } from './executor/batch-executor.js';
export { SmartRouter } from './executor/router.js';

// Analytics
export { 
  PriceImpactCalculator, 
  priceImpactCalculator 
} from './analytics/price-impact.js';
export type { PriceImpactAnalysis } from './analytics/price-impact.js';
export { 
  LiquidityAnalyzer, 
  liquidityAnalyzer 
} from './analytics/liquidity.js';
export type { LiquidityDepth, PoolComparison } from './analytics/liquidity.js';

// Re-export submodules for namespaced access
export * as jupiter from './jupiter/index.js';
export * as raydium from './raydium/index.js';
export * as orca from './orca/index.js';
export * as pumpfun from './pumpfun/index.js';
export * as executor from './executor/index.js';
export * as analytics from './analytics/index.js';
