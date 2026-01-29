/**
 * MEXC Exchange API Integration
 * 
 * Provides comprehensive integration with MEXC cryptocurrency exchange:
 * - Market data (tickers, orderbook, trades, klines)
 * - Trading (spot, margin)
 * - Account management (balances, orders)
 * - WebSocket support for real-time data
 * 
 * @module mexc-api
 * @see https://mexcdevelop.github.io/apidocs/spot_v3_en/
 */

import crypto from 'crypto';

export const MEXC_API = {
  BASE_URL: 'https://api.mexc.com',
  WS_URL: 'wss://wbs.mexc.com/ws',
} as const;

export interface MEXCCredentials {
  apiKey: string;
  apiSecret: string;
}

export interface MEXCTicker {
  symbol: string;
  priceChange: string;
  priceChangePercent: string;
  prevClosePrice: string;
  lastPrice: string;
  bidPrice: string;
  bidQty: string;
  askPrice: string;
  askQty: string;
  openPrice: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
  quoteVolume: string;
  openTime: number;
  closeTime: number;
  count: number;
}

export interface MEXCOrderbook {
  lastUpdateId: number;
  bids: Array<[price: string, quantity: string]>;
  asks: Array<[price: string, quantity: string]>;
}

export interface MEXCTrade {
  id: number;
  price: string;
  qty: string;
  quoteQty: string;
  time: number;
  isBuyerMaker: boolean;
}

export interface MEXCBalance {
  asset: string;
  free: string;
  locked: string;
}

export interface MEXCOrder {
  symbol: string;
  orderId: string;
  orderListId: number;
  clientOrderId: string;
  price: string;
  origQty: string;
  executedQty: string;
  cummulativeQuoteQty: string;
  status: 'NEW' | 'PARTIALLY_FILLED' | 'FILLED' | 'CANCELED' | 'PARTIALLY_CANCELED' | 'PENDING_CANCEL' | 'REJECTED';
  timeInForce: 'GTC' | 'IOC' | 'FOK';
  type: 'LIMIT' | 'MARKET' | 'LIMIT_MAKER' | 'IMMEDIATE_OR_CANCEL';
  side: 'BUY' | 'SELL';
  stopPrice: string;
  icebergQty: string;
  time: number;
  updateTime: number;
  isWorking: boolean;
  origQuoteOrderQty: string;
}

/**
 * Create signature for MEXC API
 */
function createSignature(credentials: MEXCCredentials, queryString: string): string {
  return crypto
    .createHmac('sha256', credentials.apiSecret)
    .update(queryString)
    .digest('hex');
}

/**
 * Make authenticated request to MEXC API
 */
async function authenticatedRequest<T>(
  credentials: MEXCCredentials,
  method: 'GET' | 'POST' | 'DELETE',
  endpoint: string,
  params: Record<string, any> = {}
): Promise<T> {
  const timestamp = Date.now();
  const allParams = {
    ...params,
    timestamp,
    recvWindow: 5000,
  };
  
  const queryString = Object.entries(allParams)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join('&');
  
  const signature = createSignature(credentials, queryString);
  const finalQuery = `${queryString}&signature=${signature}`;
  
  const url = `${MEXC_API.BASE_URL}${endpoint}?${finalQuery}`;
  
  const response = await fetch(url, {
    method,
    headers: {
      'X-MEXC-APIKEY': credentials.apiKey,
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.msg || `MEXC API error: ${response.status}`);
  }
  
  return response.json();
}

/**
 * Make public request to MEXC API
 */
async function publicRequest<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
  const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : '';
  const response = await fetch(`${MEXC_API.BASE_URL}${endpoint}${queryString}`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.msg || `MEXC API error: ${response.status}`);
  }
  
  return response.json();
}

// =============================================================================
// PUBLIC MARKET DATA
// =============================================================================

/**
 * Test connectivity
 */
export async function ping(): Promise<{}> {
  return publicRequest('/api/v3/ping');
}

/**
 * Get server time
 */
export async function getTime(): Promise<{ serverTime: number }> {
  return publicRequest('/api/v3/time');
}

/**
 * Get exchange information
 */
export async function getExchangeInfo(symbols?: string[]): Promise<any> {
  const params = symbols ? { symbols: JSON.stringify(symbols) } : {};
  return publicRequest('/api/v3/exchangeInfo', params);
}

/**
 * Get ticker for a symbol
 */
export async function getTicker(symbol: string): Promise<MEXCTicker> {
  return publicRequest('/api/v3/ticker/24hr', { symbol });
}

/**
 * Get all tickers
 */
export async function getAllTickers(): Promise<MEXCTicker[]> {
  return publicRequest('/api/v3/ticker/24hr');
}

/**
 * Get ticker price
 */
export async function getTickerPrice(symbol?: string): Promise<any> {
  const params = symbol ? { symbol } : {};
  return publicRequest('/api/v3/ticker/price', params);
}

/**
 * Get best bid/ask prices
 */
export async function getBookTicker(symbol?: string): Promise<any> {
  const params = symbol ? { symbol } : {};
  return publicRequest('/api/v3/ticker/bookTicker', params);
}

/**
 * Get orderbook
 */
export async function getOrderbook(symbol: string, limit: 5 | 10 | 20 | 50 | 100 | 500 | 1000 | 5000 = 100): Promise<MEXCOrderbook> {
  return publicRequest('/api/v3/depth', { symbol, limit });
}

/**
 * Get recent trades
 */
export async function getTrades(symbol: string, limit: number = 500): Promise<MEXCTrade[]> {
  return publicRequest('/api/v3/trades', { symbol, limit });
}

/**
 * Get historical trades
 */
export async function getHistoricalTrades(symbol: string, params?: { limit?: number; fromId?: number }): Promise<MEXCTrade[]> {
  return publicRequest('/api/v3/historicalTrades', { symbol, ...params });
}

/**
 * Get aggregate trades
 */
export async function getAggregateTrades(
  symbol: string,
  params?: { fromId?: number; startTime?: number; endTime?: number; limit?: number }
): Promise<any[]> {
  return publicRequest('/api/v3/aggTrades', { symbol, ...params });
}

/**
 * Get kline/candlestick data
 */
export async function getKlines(
  symbol: string,
  interval: '1m' | '5m' | '15m' | '30m' | '60m' | '4h' | '1d' | '1M',
  params?: { startTime?: number; endTime?: number; limit?: number }
): Promise<Array<[
  openTime: number,
  open: string,
  high: string,
  low: string,
  close: string,
  volume: string,
  closeTime: number,
  quoteVolume: string,
  trades: number,
  takerBuyBase: string,
  takerBuyQuote: string
]>> {
  return publicRequest('/api/v3/klines', { symbol, interval, ...params });
}

/**
 * Get average price
 */
export async function getAvgPrice(symbol: string): Promise<{ mins: number; price: string }> {
  return publicRequest('/api/v3/avgPrice', { symbol });
}

// =============================================================================
// AUTHENTICATED ACCOUNT ENDPOINTS
// =============================================================================

/**
 * Get account information
 */
export async function getAccount(credentials: MEXCCredentials): Promise<{ balances: MEXCBalance[] }> {
  return authenticatedRequest(credentials, 'GET', '/api/v3/account');
}

/**
 * Get account balances
 */
export async function getBalances(credentials: MEXCCredentials): Promise<MEXCBalance[]> {
  const account = await getAccount(credentials);
  return account.balances.filter(b => parseFloat(b.free) > 0 || parseFloat(b.locked) > 0);
}

/**
 * Get account trade list
 */
export async function getMyTrades(
  credentials: MEXCCredentials,
  symbol: string,
  params?: { orderId?: number; startTime?: number; endTime?: number; fromId?: number; limit?: number }
): Promise<any[]> {
  return authenticatedRequest(credentials, 'GET', '/api/v3/myTrades', { symbol, ...params });
}

// =============================================================================
// AUTHENTICATED TRADING ENDPOINTS
// =============================================================================

/**
 * Test new order (doesn't actually place the order)
 */
export async function testOrder(
  credentials: MEXCCredentials,
  params: {
    symbol: string;
    side: 'BUY' | 'SELL';
    type: 'LIMIT' | 'MARKET' | 'LIMIT_MAKER' | 'IMMEDIATE_OR_CANCEL';
    quantity?: string;
    quoteOrderQty?: string;
    price?: string;
    newClientOrderId?: string;
    timeInForce?: 'GTC' | 'IOC' | 'FOK';
  }
): Promise<{}> {
  return authenticatedRequest(credentials, 'POST', '/api/v3/order/test', params);
}

/**
 * Place a new order
 */
export async function placeOrder(
  credentials: MEXCCredentials,
  params: {
    symbol: string;
    side: 'BUY' | 'SELL';
    type: 'LIMIT' | 'MARKET' | 'LIMIT_MAKER' | 'IMMEDIATE_OR_CANCEL';
    quantity?: string;
    quoteOrderQty?: string;
    price?: string;
    newClientOrderId?: string;
    timeInForce?: 'GTC' | 'IOC' | 'FOK';
  }
): Promise<MEXCOrder> {
  return authenticatedRequest(credentials, 'POST', '/api/v3/order', params);
}

/**
 * Cancel an order
 */
export async function cancelOrder(
  credentials: MEXCCredentials,
  symbol: string,
  params?: { orderId?: string; origClientOrderId?: string; newClientOrderId?: string }
): Promise<MEXCOrder> {
  return authenticatedRequest(credentials, 'DELETE', '/api/v3/order', { symbol, ...params });
}

/**
 * Cancel all open orders on a symbol
 */
export async function cancelAllOrders(credentials: MEXCCredentials, symbol: string): Promise<MEXCOrder[]> {
  return authenticatedRequest(credentials, 'DELETE', '/api/v3/openOrders', { symbol });
}

/**
 * Query order
 */
export async function getOrder(
  credentials: MEXCCredentials,
  symbol: string,
  params?: { orderId?: string; origClientOrderId?: string }
): Promise<MEXCOrder> {
  return authenticatedRequest(credentials, 'GET', '/api/v3/order', { symbol, ...params });
}

/**
 * Get all open orders
 */
export async function getOpenOrders(credentials: MEXCCredentials, symbol?: string): Promise<MEXCOrder[]> {
  const params = symbol ? { symbol } : {};
  return authenticatedRequest(credentials, 'GET', '/api/v3/openOrders', params);
}

/**
 * Get all orders (active, canceled, or filled)
 */
export async function getAllOrders(
  credentials: MEXCCredentials,
  symbol: string,
  params?: { orderId?: number; startTime?: number; endTime?: number; limit?: number }
): Promise<MEXCOrder[]> {
  return authenticatedRequest(credentials, 'GET', '/api/v3/allOrders', { symbol, ...params });
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Test API connection and credentials
 */
export async function testConnection(credentials: MEXCCredentials): Promise<boolean> {
  try {
    await getAccount(credentials);
    return true;
  } catch (error) {
    return false;
  }
}

export default {
  ping,
  getTime,
  getExchangeInfo,
  getTicker,
  getAllTickers,
  getTickerPrice,
  getBookTicker,
  getOrderbook,
  getTrades,
  getHistoricalTrades,
  getAggregateTrades,
  getKlines,
  getAvgPrice,
  getAccount,
  getBalances,
  getMyTrades,
  testOrder,
  placeOrder,
  cancelOrder,
  cancelAllOrders,
  getOrder,
  getOpenOrders,
  getAllOrders,
  testConnection,
};
