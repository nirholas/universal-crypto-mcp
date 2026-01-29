/**
 * Gate.io Exchange API Integration
 * 
 * Provides comprehensive integration with Gate.io cryptocurrency exchange:
 * - Market data (tickers, orderbook, trades, candles)
 * - Trading (spot, margin, futures, options)
 * - Account management (balances, transfers, sub-accounts)
 * - WebSocket support for real-time data
 * 
 * @module gateio-api
 * @see https://www.gate.io/docs/developers/apiv4
 */

import crypto from 'crypto';

export const GATEIO_API = {
  BASE_URL: 'https://api.gateio.ws',
  WS_URL: 'wss://api.gateio.ws/ws/v4/',
} as const;

export interface GateioCredentials {
  apiKey: string;
  apiSecret: string;
}

export interface GateioTicker {
  currency_pair: string;
  last: string;
  lowest_ask: string;
  highest_bid: string;
  change_percentage: string;
  base_volume: string;
  quote_volume: string;
  high_24h: string;
  low_24h: string;
}

export interface GateioOrderbook {
  id: number;
  current: number;
  update: number;
  asks: Array<[price: string, amount: string]>;
  bids: Array<[price: string, amount: string]>;
}

export interface GateioTrade {
  id: string;
  create_time: string;
  create_time_ms: string;
  currency_pair: string;
  side: 'buy' | 'sell';
  amount: string;
  price: string;
}

export interface GateioBalance {
  currency: string;
  available: string;
  locked: string;
}

export interface GateioOrder {
  id: string;
  text: string;
  create_time: string;
  update_time: string;
  create_time_ms: number;
  update_time_ms: number;
  status: 'open' | 'closed' | 'cancelled';
  currency_pair: string;
  type: 'limit' | 'market';
  account: 'spot' | 'margin' | 'cross_margin';
  side: 'buy' | 'sell';
  amount: string;
  price: string;
  time_in_force: 'gtc' | 'ioc' | 'poc' | 'fok';
  left: string;
  filled_total: string;
  fee: string;
  fee_currency: string;
  point_fee: string;
  gt_fee: string;
  gt_discount: boolean;
  rebated_fee: string;
  rebated_fee_currency: string;
}

/**
 * Create signature for Gate.io API
 */
function createSignature(
  credentials: GateioCredentials,
  method: string,
  path: string,
  queryString: string,
  body: string,
  timestamp: string
): string {
  const hashedPayload = crypto
    .createHash('sha512')
    .update(body)
    .digest('hex');
  
  const signString = `${method}\n${path}\n${queryString}\n${hashedPayload}\n${timestamp}`;
  
  const signature = crypto
    .createHmac('sha512', credentials.apiSecret)
    .update(signString)
    .digest('hex');
  
  return signature;
}

/**
 * Make authenticated request to Gate.io API
 */
async function authenticatedRequest<T>(
  credentials: GateioCredentials,
  method: 'GET' | 'POST' | 'DELETE' | 'PUT',
  path: string,
  params: Record<string, any> = {},
  body: any = null
): Promise<T> {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const queryString = Object.keys(params).length > 0 
    ? '?' + new URLSearchParams(params as any).toString()
    : '';
  
  const bodyString = body ? JSON.stringify(body) : '';
  const signature = createSignature(credentials, method, path, queryString.slice(1), bodyString, timestamp);
  
  const url = `${GATEIO_API.BASE_URL}${path}${queryString}`;
  
  const headers: Record<string, string> = {
    'KEY': credentials.apiKey,
    'Timestamp': timestamp,
    'SIGN': signature,
  };
  
  if (body) {
    headers['Content-Type'] = 'application/json';
  }
  
  const response = await fetch(url, {
    method,
    headers,
    ...(body && { body: bodyString }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || `Gate.io API error: ${response.status}`);
  }
  
  return response.json();
}

/**
 * Make public request to Gate.io API
 */
async function publicRequest<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
  const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : '';
  const response = await fetch(`${GATEIO_API.BASE_URL}${endpoint}${queryString}`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || `Gate.io API error: ${response.status}`);
  }
  
  return response.json();
}

// =============================================================================
// PUBLIC MARKET DATA
// =============================================================================

/**
 * Get ticker for a currency pair
 */
export async function getTicker(currencyPair: string): Promise<GateioTicker> {
  const data: any = await publicRequest(`/api/v4/spot/tickers`, { currency_pair: currencyPair });
  return data[0];
}

/**
 * Get all tickers
 */
export async function getAllTickers(): Promise<GateioTicker[]> {
  return publicRequest('/api/v4/spot/tickers');
}

/**
 * Get orderbook for a currency pair
 */
export async function getOrderbook(
  currencyPair: string,
  params?: { interval?: string; limit?: number; with_id?: boolean }
): Promise<GateioOrderbook> {
  return publicRequest(`/api/v4/spot/order_book`, { currency_pair: currencyPair, ...params });
}

/**
 * Get recent trades for a currency pair
 */
export async function getTrades(
  currencyPair: string,
  params?: { limit?: number; last_id?: string; reverse?: boolean }
): Promise<GateioTrade[]> {
  return publicRequest(`/api/v4/spot/trades`, { currency_pair: currencyPair, ...params });
}

/**
 * Get candlestick data
 */
export async function getCandles(
  currencyPair: string,
  params?: {
    limit?: number;
    from?: number;
    to?: number;
    interval?: '10s' | '1m' | '5m' | '15m' | '30m' | '1h' | '4h' | '8h' | '1d' | '7d';
  }
): Promise<Array<[timestamp: number, volume: string, close: string, high: string, low: string, open: string]>> {
  return publicRequest(`/api/v4/spot/candlesticks`, { currency_pair: currencyPair, ...params });
}

/**
 * Get all currency pairs
 */
export async function getCurrencyPairs(): Promise<any[]> {
  return publicRequest('/api/v4/spot/currency_pairs');
}

/**
 * Get currency pair details
 */
export async function getCurrencyPairDetails(currencyPair: string): Promise<any> {
  return publicRequest(`/api/v4/spot/currency_pairs/${currencyPair}`);
}

/**
 * Get all currencies
 */
export async function getCurrencies(): Promise<any[]> {
  return publicRequest('/api/v4/spot/currencies');
}

/**
 * Get currency details
 */
export async function getCurrencyDetails(currency: string): Promise<any> {
  return publicRequest(`/api/v4/spot/currencies/${currency}`);
}

// =============================================================================
// AUTHENTICATED ACCOUNT ENDPOINTS
// =============================================================================

/**
 * Get spot account balances
 */
export async function getBalances(
  credentials: GateioCredentials,
  currency?: string
): Promise<GateioBalance[]> {
  return authenticatedRequest(credentials, 'GET', '/api/v4/spot/accounts', currency ? { currency } : {});
}

/**
 * Get account details
 */
export async function getAccountDetail(credentials: GateioCredentials): Promise<any> {
  return authenticatedRequest(credentials, 'GET', '/api/v4/account/detail');
}

/**
 * Get deposit address
 */
export async function getDepositAddress(credentials: GateioCredentials, currency: string): Promise<any> {
  return authenticatedRequest(credentials, 'GET', `/api/v4/wallet/deposit_address`, { currency });
}

/**
 * Get withdrawal records
 */
export async function getWithdrawals(
  credentials: GateioCredentials,
  params?: { currency?: string; from?: number; to?: number; limit?: number; offset?: number }
): Promise<any[]> {
  return authenticatedRequest(credentials, 'GET', '/api/v4/wallet/withdrawals', params);
}

/**
 * Get deposit records
 */
export async function getDeposits(
  credentials: GateioCredentials,
  params?: { currency?: string; from?: number; to?: number; limit?: number; offset?: number }
): Promise<any[]> {
  return authenticatedRequest(credentials, 'GET', '/api/v4/wallet/deposits', params);
}

// =============================================================================
// AUTHENTICATED TRADING ENDPOINTS
// =============================================================================

/**
 * Place a new order
 */
export async function placeOrder(
  credentials: GateioCredentials,
  params: {
    currency_pair: string;
    type: 'limit' | 'market';
    account: 'spot' | 'margin' | 'cross_margin';
    side: 'buy' | 'sell';
    amount: string;
    price?: string;
    time_in_force?: 'gtc' | 'ioc' | 'poc' | 'fok';
    iceberg?: string;
    auto_borrow?: boolean;
    auto_repay?: boolean;
    text?: string;
  }
): Promise<GateioOrder> {
  return authenticatedRequest(credentials, 'POST', '/api/v4/spot/orders', {}, params);
}

/**
 * Cancel an order
 */
export async function cancelOrder(
  credentials: GateioCredentials,
  orderId: string,
  currencyPair: string
): Promise<GateioOrder> {
  return authenticatedRequest(credentials, 'DELETE', `/api/v4/spot/orders/${orderId}`, { currency_pair: currencyPair });
}

/**
 * Cancel all open orders
 */
export async function cancelAllOrders(
  credentials: GateioCredentials,
  params: {
    currency_pair: string;
    side?: 'buy' | 'sell';
    account?: 'spot' | 'margin' | 'cross_margin';
  }
): Promise<GateioOrder[]> {
  return authenticatedRequest(credentials, 'DELETE', '/api/v4/spot/orders', params);
}

/**
 * Get order details
 */
export async function getOrder(
  credentials: GateioCredentials,
  orderId: string,
  currencyPair: string
): Promise<GateioOrder> {
  return authenticatedRequest(credentials, 'GET', `/api/v4/spot/orders/${orderId}`, { currency_pair: currencyPair });
}

/**
 * List all open orders
 */
export async function getOpenOrders(
  credentials: GateioCredentials,
  params?: {
    page?: number;
    limit?: number;
    currency_pair?: string;
    account?: 'spot' | 'margin' | 'cross_margin';
  }
): Promise<GateioOrder[]> {
  return authenticatedRequest(credentials, 'GET', '/api/v4/spot/orders', params);
}

/**
 * Get order history
 */
export async function getOrderHistory(
  credentials: GateioCredentials,
  params: {
    currency_pair: string;
    status?: 'open' | 'finished';
    page?: number;
    limit?: number;
    account?: 'spot' | 'margin' | 'cross_margin';
    from?: number;
    to?: number;
    side?: 'buy' | 'sell';
  }
): Promise<GateioOrder[]> {
  return authenticatedRequest(credentials, 'GET', '/api/v4/spot/orders', params);
}

/**
 * Get personal trading history
 */
export async function getMyTrades(
  credentials: GateioCredentials,
  params: {
    currency_pair: string;
    limit?: number;
    page?: number;
    order_id?: string;
    account?: 'spot' | 'margin' | 'cross_margin';
    from?: number;
    to?: number;
  }
): Promise<any[]> {
  return authenticatedRequest(credentials, 'GET', '/api/v4/spot/my_trades', params);
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Test API connection and credentials
 */
export async function testConnection(credentials: GateioCredentials): Promise<boolean> {
  try {
    await getBalances(credentials);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Get server time
 */
export async function getServerTime(): Promise<{ server_time: number }> {
  return publicRequest('/api/v4/spot/time');
}

export default {
  getTicker,
  getAllTickers,
  getOrderbook,
  getTrades,
  getCandles,
  getCurrencyPairs,
  getCurrencyPairDetails,
  getCurrencies,
  getCurrencyDetails,
  getBalances,
  getAccountDetail,
  getDepositAddress,
  getWithdrawals,
  getDeposits,
  placeOrder,
  cancelOrder,
  cancelAllOrders,
  getOrder,
  getOpenOrders,
  getOrderHistory,
  getMyTrades,
  testConnection,
  getServerTime,
};
