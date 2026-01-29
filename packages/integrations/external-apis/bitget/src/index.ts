/**
 * Bitget Exchange API Integration
 * 
 * Provides comprehensive integration with Bitget cryptocurrency exchange:
 * - Market data (tickers, orderbook, trades, candles)
 * - Trading (spot, futures, margin)
 * - Account management (balances, positions)
 * - WebSocket support for real-time data
 * 
 * @module bitget-api
 * @see https://www.bitget.com/api-doc/common/intro
 */

import crypto from 'crypto';

export const BITGET_API = {
  BASE_URL: 'https://api.bitget.com',
  WS_URL: 'wss://ws.bitget.com/v2/ws/public',
} as const;

export interface BitgetCredentials {
  apiKey: string;
  apiSecret: string;
  passphrase: string;
}

export interface BitgetTicker {
  symbol: string;
  high24h: string;
  low24h: string;
  close: string;
  quoteVol: string;
  baseVol: string;
  usdtVol: string;
  ts: string;
  bidPr: string;
  askPr: string;
  bidSz: string;
  askSz: string;
  openUtc: string;
  changeUtc24h: string;
  change24h: string;
}

export interface BitgetOrderbook {
  asks: Array<[price: string, quantity: string]>;
  bids: Array<[price: string, quantity: string]>;
  ts: string;
}

export interface BitgetTrade {
  symbol: string;
  tradeId: string;
  side: 'buy' | 'sell';
  fillPrice: string;
  fillQuantity: string;
  fillTime: string;
}

export interface BitgetBalance {
  coin: string;
  available: string;
  frozen: string;
  locked: string;
  limitAvailable: string;
  uTime: string;
}

export interface BitgetOrder {
  userId: string;
  symbol: string;
  orderId: string;
  clientOid: string;
  price: string;
  size: string;
  orderType: 'limit' | 'market' | 'post_only';
  side: 'buy' | 'sell';
  status: 'init' | 'new' | 'partial_fill' | 'full_fill' | 'cancelled';
  priceAvg: string;
  baseVolume: string;
  quoteVolume: string;
  enterPointSource: string;
  feeDetail: string;
  orderSource: string;
  cTime: string;
  uTime: string;
}

/**
 * Create signature for Bitget API
 */
function createSignature(
  credentials: BitgetCredentials,
  timestamp: string,
  method: string,
  requestPath: string,
  body: string = ''
): string {
  const message = timestamp + method.toUpperCase() + requestPath + body;
  
  const signature = crypto
    .createHmac('sha256', credentials.apiSecret)
    .update(message)
    .digest('base64');
  
  return signature;
}

/**
 * Make authenticated request to Bitget API
 */
async function authenticatedRequest<T>(
  credentials: BitgetCredentials,
  method: 'GET' | 'POST' | 'DELETE',
  path: string,
  params: Record<string, any> = {},
  body: any = null
): Promise<T> {
  const timestamp = Date.now().toString();
  const requestPath = path + (Object.keys(params).length > 0 ? `?${new URLSearchParams(params as any).toString()}` : '');
  const bodyString = body ? JSON.stringify(body) : '';
  
  const signature = createSignature(credentials, timestamp, method, requestPath, bodyString);
  const passphrase = crypto
    .createHmac('sha256', credentials.apiSecret)
    .update(credentials.passphrase)
    .digest('base64');
  
  const url = `${BITGET_API.BASE_URL}${requestPath}`;
  
  const headers: Record<string, string> = {
    'ACCESS-KEY': credentials.apiKey,
    'ACCESS-SIGN': signature,
    'ACCESS-TIMESTAMP': timestamp,
    'ACCESS-PASSPHRASE': passphrase,
    'Content-Type': 'application/json',
    'locale': 'en-US',
  };
  
  const response = await fetch(url, {
    method,
    headers,
    ...(body && { body: bodyString }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.msg || `Bitget API error: ${response.status}`);
  }
  
  const data = await response.json();
  
  if (data.code !== '00000') {
    throw new Error(data.msg || 'Bitget API error');
  }
  
  return data.data;
}

/**
 * Make public request to Bitget API
 */
async function publicRequest<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
  const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : '';
  const response = await fetch(`${BITGET_API.BASE_URL}${endpoint}${queryString}`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.msg || `Bitget API error: ${response.status}`);
  }
  
  const data = await response.json();
  
  if (data.code !== '00000') {
    throw new Error(data.msg || 'Bitget API error');
  }
  
  return data.data;
}

// =============================================================================
// PUBLIC MARKET DATA
// =============================================================================

/**
 * Get server time
 */
export async function getTime(): Promise<{ serverTime: string }> {
  return publicRequest('/api/v2/public/time');
}

/**
 * Get all tickers
 */
export async function getAllTickers(productType: 'SPOT' | 'USDT-FUTURES' | 'COIN-FUTURES' | 'USDC-FUTURES' | 'SUSDT-FUTURES' | 'SCOIN-FUTURES' = 'SPOT'): Promise<BitgetTicker[]> {
  return publicRequest(`/api/v2/spot/market/tickers`, { productType });
}

/**
 * Get ticker for a symbol
 */
export async function getTicker(symbol: string): Promise<BitgetTicker> {
  const data: any = await publicRequest(`/api/v2/spot/market/ticker`, { symbol });
  return data[0];
}

/**
 * Get orderbook
 */
export async function getOrderbook(symbol: string, limit: 'max5' | 'max15' | 'max50' = 'max15'): Promise<BitgetOrderbook> {
  return publicRequest(`/api/v2/spot/market/orderbook`, { symbol, type: limit });
}

/**
 * Get recent trades
 */
export async function getTrades(symbol: string, limit: number = 100): Promise<BitgetTrade[]> {
  return publicRequest(`/api/v2/spot/market/fills`, { symbol, limit: limit.toString() });
}

/**
 * Get candlestick data
 */
export async function getCandles(
  symbol: string,
  granularity: '1m' | '5m' | '15m' | '30m' | '1H' | '4H' | '12H' | '1D' | '3D' | '1W' | '1M',
  params?: { startTime?: string; endTime?: string; limit?: string }
): Promise<Array<[timestamp: string, open: string, high: string, low: string, close: string, volume: string, quoteVolume: string]>> {
  return publicRequest(`/api/v2/spot/market/candles`, { symbol, granularity, ...params });
}

/**
 * Get all symbols
 */
export async function getSymbols(): Promise<any[]> {
  return publicRequest('/api/v2/spot/public/symbols');
}

/**
 * Get all coins
 */
export async function getCoins(): Promise<any[]> {
  return publicRequest('/api/v2/spot/public/coins');
}

// =============================================================================
// AUTHENTICATED ACCOUNT ENDPOINTS
// =============================================================================

/**
 * Get account assets
 */
export async function getBalances(credentials: BitgetCredentials, coin?: string): Promise<BitgetBalance[]> {
  const params = coin ? { coin } : {};
  return authenticatedRequest(credentials, 'GET', '/api/v2/spot/account/assets', params);
}

/**
 * Get account info
 */
export async function getAccountInfo(credentials: BitgetCredentials): Promise<any> {
  return authenticatedRequest(credentials, 'GET', '/api/v2/spot/account/info');
}

/**
 * Get bills (transaction history)
 */
export async function getBills(
  credentials: BitgetCredentials,
  params?: {
    coin?: string;
    groupType?: string;
    bizType?: string;
    after?: string;
    before?: string;
    limit?: string;
  }
): Promise<any[]> {
  return authenticatedRequest(credentials, 'GET', '/api/v2/spot/account/bills', params);
}

/**
 * Get transfer records
 */
export async function getTransferRecords(
  credentials: BitgetCredentials,
  params?: {
    coin?: string;
    fromType?: string;
    after?: string;
    before?: string;
    limit?: string;
  }
): Promise<any[]> {
  return authenticatedRequest(credentials, 'GET', '/api/v2/spot/account/transferRecords', params);
}

// =============================================================================
// AUTHENTICATED TRADING ENDPOINTS
// =============================================================================

/**
 * Place an order
 */
export async function placeOrder(
  credentials: BitgetCredentials,
  params: {
    symbol: string;
    side: 'buy' | 'sell';
    orderType: 'limit' | 'market' | 'post_only';
    force: 'gtc' | 'ioc' | 'fok' | 'post_only';
    size: string;
    price?: string;
    clientOid?: string;
  }
): Promise<BitgetOrder> {
  return authenticatedRequest(credentials, 'POST', '/api/v2/spot/trade/place-order', {}, params);
}

/**
 * Place multiple orders
 */
export async function placeBatchOrders(
  credentials: BitgetCredentials,
  symbol: string,
  orderList: Array<{
    side: 'buy' | 'sell';
    orderType: 'limit' | 'market';
    force: 'gtc' | 'ioc' | 'fok' | 'post_only';
    size: string;
    price?: string;
    clientOid?: string;
  }>
): Promise<any> {
  return authenticatedRequest(credentials, 'POST', '/api/v2/spot/trade/batch-orders', {}, { symbol, orderList });
}

/**
 * Cancel an order
 */
export async function cancelOrder(credentials: BitgetCredentials, symbol: string, orderId: string): Promise<any> {
  return authenticatedRequest(credentials, 'POST', '/api/v2/spot/trade/cancel-order', {}, { symbol, orderId });
}

/**
 * Cancel batch orders
 */
export async function cancelBatchOrders(credentials: BitgetCredentials, symbol: string, orderIds: string[]): Promise<any> {
  return authenticatedRequest(credentials, 'POST', '/api/v2/spot/trade/batch-cancel-order', {}, { symbol, orderIds });
}

/**
 * Get order details
 */
export async function getOrder(credentials: BitgetCredentials, symbol: string, orderId: string): Promise<BitgetOrder> {
  return authenticatedRequest(credentials, 'GET', '/api/v2/spot/trade/orderInfo', { symbol, orderId });
}

/**
 * Get open orders
 */
export async function getOpenOrders(credentials: BitgetCredentials, symbol?: string): Promise<BitgetOrder[]> {
  const params = symbol ? { symbol } : {};
  return authenticatedRequest(credentials, 'GET', '/api/v2/spot/trade/unfilled-orders', params);
}

/**
 * Get order history
 */
export async function getOrderHistory(
  credentials: BitgetCredentials,
  symbol: string,
  params?: {
    startTime?: string;
    endTime?: string;
    limit?: string;
    idLessThan?: string;
  }
): Promise<BitgetOrder[]> {
  return authenticatedRequest(credentials, 'GET', '/api/v2/spot/trade/history-orders', { symbol, ...params });
}

/**
 * Get fills (trade history)
 */
export async function getFills(
  credentials: BitgetCredentials,
  symbol: string,
  params?: {
    orderId?: string;
    startTime?: string;
    endTime?: string;
    limit?: string;
    idLessThan?: string;
  }
): Promise<any[]> {
  return authenticatedRequest(credentials, 'GET', '/api/v2/spot/trade/fills', { symbol, ...params });
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Test API connection and credentials
 */
export async function testConnection(credentials: BitgetCredentials): Promise<boolean> {
  try {
    await getAccountInfo(credentials);
    return true;
  } catch (error) {
    return false;
  }
}

export default {
  getTime,
  getAllTickers,
  getTicker,
  getOrderbook,
  getTrades,
  getCandles,
  getSymbols,
  getCoins,
  getBalances,
  getAccountInfo,
  getBills,
  getTransferRecords,
  placeOrder,
  placeBatchOrders,
  cancelOrder,
  cancelBatchOrders,
  getOrder,
  getOpenOrders,
  getOrderHistory,
  getFills,
  testConnection,
};
