/**
 * boosty MCP Prices
 * 
 * Real-time DeFi price data server using Model Context Protocol.
 * 
 * @packageDocumentation
 */

// ============================================================================
// Server Exports
// ============================================================================

export { PricesServer, createPricesServer, type PricesServerOptions } from './server.js';

// ============================================================================
// Tool Exports
// ============================================================================

export {
  // getTokenPrice
  getTokenPrice,
  getTokenPriceDefinition,
  type GetTokenPriceInput,
  type GetTokenPriceOutput,

  // getTokenPriceHistory
  getTokenPriceHistory,
  getTokenPriceHistoryDefinition,
  type GetTokenPriceHistoryInput,
  type GetTokenPriceHistoryOutput,
  type PricePoint,

  // getGasPrices
  getGasPrices,
  getGasPricesDefinition,
  type GetGasPricesInput,
  type GetGasPricesOutput,

  // getTopMovers
  getTopMovers,
  getTopMoversDefinition,
  type GetTopMoversInput,
  type GetTopMoversOutput,
  type TokenMover,
  type Timeframe,
  type Direction,

  // getFearGreedIndex
  getFearGreedIndex,
  getFearGreedIndexDefinition,
  type GetFearGreedIndexInput,
  type GetFearGreedIndexOutput,

  // comparePrices
  comparePrices,
  comparePricesDefinition,
  type ComparePricesInput,
  type ComparePricesOutput,
  type TokenComparison,
} from './tools/index.js';

// ============================================================================
// API Client Exports
// ============================================================================

export {
  // CoinGecko
  CoinGeckoClient,
  getCoingeckoClient,
  resetCoingeckoClient,
  coingeckoClient,
  type CoinGeckoClientOptions,
  type TokenPrice,
  type PriceHistoryPoint,
  type TopCoin,
  type SearchResult,

  // Gas
  GasFetcher,
  getGasFetcher,
  resetGasFetcher,
  gasFetcher,
  type GasPrice,
} from './apis/index.js';
