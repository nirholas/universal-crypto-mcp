/**
 * Tools Index
 * Export all MCP tools and their definitions
 */

// getTokenPrice
export {
  getTokenPrice,
  getTokenPriceDefinition,
  type GetTokenPriceInput,
  type GetTokenPriceOutput,
} from './getTokenPrice.js';

// getTokenPriceHistory
export {
  getTokenPriceHistory,
  getTokenPriceHistoryDefinition,
  type GetTokenPriceHistoryInput,
  type GetTokenPriceHistoryOutput,
  type PricePoint,
} from './getTokenPriceHistory.js';

// getGasPrices
export {
  getGasPrices,
  getGasPricesDefinition,
  type GetGasPricesInput,
  type GetGasPricesOutput,
} from './getGasPrices.js';

// getTopMovers
export {
  getTopMovers,
  getTopMoversDefinition,
  type GetTopMoversInput,
  type GetTopMoversOutput,
  type TokenMover,
  type Timeframe,
  type Direction,
} from './getTopMovers.js';

// getFearGreedIndex
export {
  getFearGreedIndex,
  getFearGreedIndexDefinition,
  type GetFearGreedIndexInput,
  type GetFearGreedIndexOutput,
} from './getFearGreedIndex.js';

// comparePrices
export {
  comparePrices,
  comparePricesDefinition,
  type ComparePricesInput,
  type ComparePricesOutput,
  type TokenComparison,
} from './comparePrices.js';

// All tool definitions for easy registration
export const ALL_TOOL_DEFINITIONS = [
  // Dynamically import to avoid circular dependencies
] as const;
