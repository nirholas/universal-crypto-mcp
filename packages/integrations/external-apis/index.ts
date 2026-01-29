/**
 * Universal Crypto MCP - External API Integrations
 * 
 * Centralized exports for all cryptocurrency exchange and data provider integrations.
 * 
 * @module external-apis
 */

// Exchange APIs
export * as gemini from './gemini/src/index.js';
export * as bitfinex from './bitfinex/src/index.js';
export * as htx from './htx/src/index.js';
export * as gateio from './gateio/src/index.js';
export * as mexc from './mexc/src/index.js';
export * as bitget from './bitget/src/index.js';

// Data & Analytics APIs
export * as cryptocompare from './cryptocompare/src/index.js';
export * as messari from './messari/src/index.js';
export * as glassnode from './glassnode/src/index.js';

// Re-export types
export type { GeminiCredentials, GeminiTicker, GeminiOrderbook, GeminiBalance, GeminiOrder } from './gemini/src/index.js';
export type { BitfinexCredentials, BitfinexTicker, BitfinexOrderbook, BitfinexBalance, BitfinexOrder } from './bitfinex/src/index.js';
export type { HTXCredentials, HTXTicker, HTXOrderbook, HTXBalance, HTXOrder } from './htx/src/index.js';
export type { GateioCredentials, GateioTicker, GateioOrderbook, GateioBalance, GateioOrder } from './gateio/src/index.js';
export type { MEXCCredentials, MEXCTicker, MEXCOrderbook, MEXCBalance, MEXCOrder } from './mexc/src/index.js';
export type { BitgetCredentials, BitgetTicker, BitgetOrderbook, BitgetBalance, BitgetOrder } from './bitget/src/index.js';
export type { CryptoCompareCredentials, CryptoComparePrice, CryptoCompareOHLCV, CryptoCompareCoin, CryptoCompareNews } from './cryptocompare/src/index.js';
export type { MessariCredentials, MessariAsset, MessariNews, MessariTimeseries } from './messari/src/index.js';
export type { GlassnodeCredentials, GlassnodeDataPoint, GlassnodeAsset } from './glassnode/src/index.js';

/**
 * List of all integrated exchange APIs
 */
export const EXCHANGES = [
  'binance',
  'coinbase',
  'kraken',
  'okx',
  'bybit',
  'kucoin',
  'gemini',
  'bitfinex',
  'htx',
  'gateio',
  'mexc',
  'bitget',
] as const;

/**
 * List of all integrated data provider APIs
 */
export const DATA_PROVIDERS = [
  'coingecko',
  'defillama',
  'cryptocompare',
  'messari',
  'glassnode',
] as const;

export type Exchange = typeof EXCHANGES[number];
export type DataProvider = typeof DATA_PROVIDERS[number];
