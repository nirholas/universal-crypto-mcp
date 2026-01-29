/**
 * Bitfinex Exchange API Integration
 * 
 * Provides comprehensive integration with Bitfinex cryptocurrency exchange:
 * - Market data (tickers, orderbook, trades, candles)
 * - Trading (spot, margin, derivatives)
 * - Account management (balances, wallets, positions)
 * - WebSocket support for real-time data
 * 
 * @module bitfinex-api
 * @see https://docs.bitfinex.com/docs
 */

import crypto from 'crypto';

export const BITFINEX_API = {
  BASE_URL: 'https://api-pub.bitfinex.com',
  BASE_URL_V2: 'https://api-pub.bitfinex.com/v2',
  WS_URL: 'wss://api-pub.bitfinex.com/ws/2',
} as const;

export interface BitfinexCredentials {
  apiKey: string;
  apiSecret: string;
}

export interface BitfinexTicker {
  symbol: string;
  bid: number;
  bidSize: number;
  ask: number;
  askSize: number;
  dailyChange: number;
  dailyChangeRelative: number;
  lastPrice: number;
  volume: number;
  high: number;
  low: number;
}

export interface BitfinexOrderbook {
  bids: Array<[price: number, count: number, amount: number]>;
  asks: Array<[price: number, count: number, amount: number]>;
}

export interface BitfinexTrade {
  id: number;
  mts: number;
  amount: number;
  price: number;
}

export interface BitfinexBalance {
  type: 'exchange' | 'margin' | 'funding';
  currency: string;
  balance: number;
  available: number;
}

export interface BitfinexOrder {
  id: number;
  gid: number | null;
  cid: number;
  symbol: string;
  mtsCreate: number;
  mtsUpdate: number;
  amount: number;
  amountOrig: number;
  type: string;
  typePrev: string | null;
  flags: number;
  status: string;
  price: number;
  priceAvg: number;
  priceTrailing: number;
  priceAuxLimit: number;
  notify: number;
  placedId: number | null;
}

/**
 * Create authenticated request headers for Bitfinex API
 */
function createAuthHeaders(
  credentials: BitfinexCredentials,
  path: string,
  body: any = {}
): Record<string, string> {
  const nonce = Date.now().toString();
  const signature = `/api${path}${nonce}${JSON.stringify(body)}`;
  
  const sig = crypto
    .createHmac('sha384', credentials.apiSecret)
    .update(signature)
    .digest('hex');

  return {
    'Content-Type': 'application/json',
    'bfx-nonce': nonce,
    'bfx-apikey': credentials.apiKey,
    'bfx-signature': sig,
  };
}

/**
 * Make authenticated request to Bitfinex API
 */
async function authenticatedRequest<T>(
  credentials: BitfinexCredentials,
  path: string,
  body: any = {}
): Promise<T> {
  const headers = createAuthHeaders(credentials, path, body);

  const response = await fetch(`${BITFINEX_API.BASE_URL}${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Bitfinex API error: ${response.status} - ${error}`);
  }

  return response.json();
}

/**
 * Make public request to Bitfinex API
 */
async function publicRequest<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${BITFINEX_API.BASE_URL_V2}${endpoint}`);

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Bitfinex API error: ${response.status} - ${error}`);
  }

  return response.json();
}

// =============================================================================
// PUBLIC MARKET DATA
// =============================================================================

/**
 * Get ticker for a symbol
 * @param symbol - Trading pair (e.g., 'tBTCUSD', 'tETHUSD')
 */
export async function getTicker(symbol: string): Promise<BitfinexTicker> {
  const data: any = await publicRequest(`/ticker/${symbol}`);
  
  return {
    symbol,
    bid: data[0],
    bidSize: data[1],
    ask: data[2],
    askSize: data[3],
    dailyChange: data[4],
    dailyChangeRelative: data[5],
    lastPrice: data[6],
    volume: data[7],
    high: data[8],
    low: data[9],
  };
}

/**
 * Get tickers for multiple symbols
 */
export async function getTickers(symbols: string[]): Promise<BitfinexTicker[]> {
  const symbolsParam = symbols.join(',');
  const data: any = await publicRequest(`/tickers?symbols=${symbolsParam}`);
  
  return data.map((item: any) => ({
    symbol: item[0],
    bid: item[1],
    bidSize: item[2],
    ask: item[3],
    askSize: item[4],
    dailyChange: item[5],
    dailyChangeRelative: item[6],
    lastPrice: item[7],
    volume: item[8],
    high: item[9],
    low: item[10],
  }));
}

/**
 * Get orderbook for a symbol
 */
export async function getOrderbook(
  symbol: string,
  precision: 'P0' | 'P1' | 'P2' | 'P3' | 'P4' | 'R0' = 'P0'
): Promise<BitfinexOrderbook> {
  const data: any = await publicRequest(`/book/${symbol}/${precision}`);
  
  const bids: any[] = [];
  const asks: any[] = [];
  
  for (const item of data) {
    if (item[2] > 0) {
      bids.push(item);
    } else {
      asks.push([item[0], item[1], Math.abs(item[2])]);
    }
  }
  
  return { bids, asks };
}

/**
 * Get recent trades for a symbol
 */
export async function getTrades(
  symbol: string,
  params?: { limit?: number; start?: number; end?: number; sort?: 1 | -1 }
): Promise<BitfinexTrade[]> {
  const query = params ? `?${new URLSearchParams(params as any).toString()}` : '';
  const data: any = await publicRequest(`/trades/${symbol}/hist${query}`);
  
  return data.map((item: any) => ({
    id: item[0],
    mts: item[1],
    amount: item[2],
    price: item[3],
  }));
}

/**
 * Get candles/OHLC data
 */
export async function getCandles(
  symbol: string,
  timeframe: '1m' | '5m' | '15m' | '30m' | '1h' | '3h' | '6h' | '12h' | '1D' | '7D' | '14D' | '1M',
  params?: { limit?: number; start?: number; end?: number; sort?: 1 | -1 }
): Promise<Array<{ mts: number; open: number; close: number; high: number; low: number; volume: number }>> {
  const query = params ? `?${new URLSearchParams(params as any).toString()}` : '';
  const data: any = await publicRequest(`/candles/trade:${timeframe}:${symbol}/hist${query}`);
  
  return data.map((item: any) => ({
    mts: item[0],
    open: item[1],
    close: item[2],
    high: item[3],
    low: item[4],
    volume: item[5],
  }));
}

/**
 * Get platform status
 */
export async function getPlatformStatus(): Promise<{ status: number }> {
  const data: any = await publicRequest('/platform/status');
  return { status: data[0] };
}

// =============================================================================
// AUTHENTICATED ACCOUNT ENDPOINTS
// =============================================================================

/**
 * Get account balances
 */
export async function getBalances(credentials: BitfinexCredentials): Promise<BitfinexBalance[]> {
  const data: any = await authenticatedRequest(credentials, '/v2/auth/r/wallets');
  
  return data.map((item: any) => ({
    type: item[0],
    currency: item[1],
    balance: item[2],
    available: item[4] || item[2],
  }));
}

/**
 * Get account information
 */
export async function getAccountInfo(credentials: BitfinexCredentials): Promise<any> {
  return authenticatedRequest(credentials, '/v2/auth/r/info/user');
}

/**
 * Get margin information
 */
export async function getMarginInfo(credentials: BitfinexCredentials, symbol?: string): Promise<any> {
  const path = symbol ? `/v2/auth/r/info/margin/${symbol}` : '/v2/auth/r/info/margin/base';
  return authenticatedRequest(credentials, path);
}

// =============================================================================
// AUTHENTICATED TRADING ENDPOINTS
// =============================================================================

/**
 * Submit a new order
 */
export async function submitOrder(
  credentials: BitfinexCredentials,
  params: {
    type: 'LIMIT' | 'MARKET' | 'STOP' | 'STOP LIMIT' | 'TRAILING STOP' | 'FOK' | 'IOC';
    symbol: string;
    amount: number;
    price?: number;
    flags?: number;
  }
): Promise<any> {
  return authenticatedRequest(credentials, '/v2/auth/w/order/submit', params);
}

/**
 * Update an existing order
 */
export async function updateOrder(
  credentials: BitfinexCredentials,
  params: {
    id: number;
    amount?: number;
    price?: number;
    flags?: number;
  }
): Promise<any> {
  return authenticatedRequest(credentials, '/v2/auth/w/order/update', params);
}

/**
 * Cancel an order
 */
export async function cancelOrder(
  credentials: BitfinexCredentials,
  orderId: number
): Promise<any> {
  return authenticatedRequest(credentials, '/v2/auth/w/order/cancel', { id: orderId });
}

/**
 * Cancel all orders
 */
export async function cancelAllOrders(credentials: BitfinexCredentials): Promise<any> {
  return authenticatedRequest(credentials, '/v2/auth/w/order/cancel/multi', { all: 1 });
}

/**
 * Get active orders
 */
export async function getActiveOrders(credentials: BitfinexCredentials, symbol?: string): Promise<BitfinexOrder[]> {
  const path = symbol ? `/v2/auth/r/orders/${symbol}` : '/v2/auth/r/orders';
  const data: any = await authenticatedRequest(credentials, path);
  
  return data.map((item: any) => ({
    id: item[0],
    gid: item[1],
    cid: item[2],
    symbol: item[3],
    mtsCreate: item[4],
    mtsUpdate: item[5],
    amount: item[6],
    amountOrig: item[7],
    type: item[8],
    typePrev: item[9],
    flags: item[12],
    status: item[13],
    price: item[16],
    priceAvg: item[17],
    priceTrailing: item[18],
    priceAuxLimit: item[19],
    notify: item[23],
    placedId: item[25],
  }));
}

/**
 * Get order history
 */
export async function getOrderHistory(
  credentials: BitfinexCredentials,
  symbol?: string,
  params?: { start?: number; end?: number; limit?: number }
): Promise<any[]> {
  const path = symbol ? `/v2/auth/r/orders/${symbol}/hist` : '/v2/auth/r/orders/hist';
  const query = params ? `?${new URLSearchParams(params as any).toString()}` : '';
  return authenticatedRequest(credentials, `${path}${query}`);
}

/**
 * Get trade history
 */
export async function getTradeHistory(
  credentials: BitfinexCredentials,
  symbol?: string,
  params?: { start?: number; end?: number; limit?: number }
): Promise<any[]> {
  const path = symbol ? `/v2/auth/r/trades/${symbol}/hist` : '/v2/auth/r/trades/hist';
  const query = params ? `?${new URLSearchParams(params as any).toString()}` : '';
  return authenticatedRequest(credentials, `${path}${query}`);
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Test API connection and credentials
 */
export async function testConnection(credentials: BitfinexCredentials): Promise<boolean> {
  try {
    await getBalances(credentials);
    return true;
  } catch (error) {
    return false;
  }
}

export default {
  getTicker,
  getTickers,
  getOrderbook,
  getTrades,
  getCandles,
  getPlatformStatus,
  getBalances,
  getAccountInfo,
  getMarginInfo,
  submitOrder,
  updateOrder,
  cancelOrder,
  cancelAllOrders,
  getActiveOrders,
  getOrderHistory,
  getTradeHistory,
  testConnection,
};
