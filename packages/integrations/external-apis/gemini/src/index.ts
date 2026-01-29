/**
 * Gemini Exchange API Integration
 * 
 * Provides comprehensive integration with Gemini cryptocurrency exchange:
 * - Market data (tickers, orderbook, trades)
 * - Trading (spot, limit, market orders)
 * - Account management (balances, transfers)
 * - WebSocket support for real-time data
 * 
 * @module gemini-api
 * @see https://docs.gemini.com/rest-api/
 */

import crypto from 'crypto';

export const GEMINI_API = {
  BASE_URL: 'https://api.gemini.com',
  SANDBOX_URL: 'https://api.sandbox.gemini.com',
  WS_URL: 'wss://api.gemini.com/v1/marketdata',
} as const;

export interface GeminiCredentials {
  apiKey: string;
  apiSecret: string;
  sandbox?: boolean;
}

export interface GeminiTicker {
  symbol: string;
  bid: string;
  ask: string;
  last: string;
  volume: {
    [currency: string]: string;
  };
}

export interface GeminiOrderbook {
  bids: Array<{ price: string; amount: string }>;
  asks: Array<{ price: string; amount: string }>;
}

export interface GeminiTrade {
  timestamp: number;
  timestampms: number;
  tid: number;
  price: string;
  amount: string;
  exchange: string;
  type: 'buy' | 'sell';
}

export interface GeminiBalance {
  currency: string;
  amount: string;
  available: string;
  availableForWithdrawal: string;
  type: 'exchange';
}

export interface GeminiOrder {
  order_id: string;
  id: string;
  symbol: string;
  exchange: string;
  avg_execution_price: string;
  side: 'buy' | 'sell';
  type: 'exchange limit' | 'exchange market';
  timestamp: string;
  timestampms: number;
  is_live: boolean;
  is_cancelled: boolean;
  is_hidden: boolean;
  was_forced: boolean;
  executed_amount: string;
  remaining_amount: string;
  options: string[];
  price: string;
  original_amount: string;
}

/**
 * Create authenticated request headers for Gemini API
 */
function createAuthHeaders(
  credentials: GeminiCredentials,
  endpoint: string,
  payload: Record<string, any> = {}
): Record<string, string> {
  const nonce = Date.now();
  const requestPayload = {
    request: endpoint,
    nonce: nonce.toString(),
    ...payload,
  };

  const b64Payload = Buffer.from(JSON.stringify(requestPayload)).toString('base64');
  const signature = crypto
    .createHmac('sha384', credentials.apiSecret)
    .update(b64Payload)
    .digest('hex');

  return {
    'Content-Type': 'text/plain',
    'Content-Length': '0',
    'X-GEMINI-APIKEY': credentials.apiKey,
    'X-GEMINI-PAYLOAD': b64Payload,
    'X-GEMINI-SIGNATURE': signature,
    'Cache-Control': 'no-cache',
  };
}

/**
 * Make authenticated request to Gemini API
 */
async function authenticatedRequest<T>(
  credentials: GeminiCredentials,
  endpoint: string,
  payload: Record<string, any> = {}
): Promise<T> {
  const baseUrl = credentials.sandbox ? GEMINI_API.SANDBOX_URL : GEMINI_API.BASE_URL;
  const headers = createAuthHeaders(credentials, endpoint, payload);

  const response = await fetch(`${baseUrl}${endpoint}`, {
    method: 'POST',
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || `Gemini API error: ${response.status}`);
  }

  return response.json();
}

/**
 * Make public request to Gemini API
 */
async function publicRequest<T>(endpoint: string, sandbox = false): Promise<T> {
  const baseUrl = sandbox ? GEMINI_API.SANDBOX_URL : GEMINI_API.BASE_URL;
  const response = await fetch(`${baseUrl}${endpoint}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || `Gemini API error: ${response.status}`);
  }

  return response.json();
}

// =============================================================================
// PUBLIC MARKET DATA
// =============================================================================

/**
 * Get ticker for a symbol
 */
export async function getTicker(symbol: string, sandbox = false): Promise<GeminiTicker> {
  return publicRequest(`/v1/pubticker/${symbol}`, sandbox);
}

/**
 * Get orderbook for a symbol
 */
export async function getOrderbook(symbol: string, sandbox = false): Promise<GeminiOrderbook> {
  return publicRequest(`/v1/book/${symbol}`, sandbox);
}

/**
 * Get recent trades for a symbol
 */
export async function getTrades(
  symbol: string,
  params?: { since?: number; limit_trades?: number; include_breaks?: boolean },
  sandbox = false
): Promise<GeminiTrade[]> {
  const query = params ? `?${new URLSearchParams(params as any).toString()}` : '';
  return publicRequest(`/v1/trades/${symbol}${query}`, sandbox);
}

/**
 * Get list of available trading symbols
 */
export async function getSymbols(sandbox = false): Promise<string[]> {
  return publicRequest('/v1/symbols', sandbox);
}

/**
 * Get detailed symbol information
 */
export async function getSymbolDetails(symbol: string, sandbox = false): Promise<any> {
  return publicRequest(`/v1/symbols/details/${symbol}`, sandbox);
}

// =============================================================================
// AUTHENTICATED ACCOUNT ENDPOINTS
// =============================================================================

/**
 * Get account balances
 */
export async function getBalances(credentials: GeminiCredentials): Promise<GeminiBalance[]> {
  return authenticatedRequest(credentials, '/v1/balances');
}

/**
 * Get account transfer history
 */
export async function getTransfers(
  credentials: GeminiCredentials,
  params?: { timestamp?: number; limit_transfers?: number }
): Promise<any[]> {
  return authenticatedRequest(credentials, '/v1/transfers', params);
}

/**
 * Get deposit addresses
 */
export async function getDepositAddresses(
  credentials: GeminiCredentials,
  currency: string
): Promise<any> {
  return authenticatedRequest(credentials, '/v1/deposit/address', { currency });
}

// =============================================================================
// AUTHENTICATED TRADING ENDPOINTS
// =============================================================================

/**
 * Place a new order
 */
export async function placeOrder(
  credentials: GeminiCredentials,
  params: {
    symbol: string;
    amount: string;
    price?: string;
    side: 'buy' | 'sell';
    type: 'exchange limit' | 'exchange market';
    options?: string[];
  }
): Promise<GeminiOrder> {
  return authenticatedRequest(credentials, '/v1/order/new', params);
}

/**
 * Cancel an order
 */
export async function cancelOrder(
  credentials: GeminiCredentials,
  orderId: string
): Promise<GeminiOrder> {
  return authenticatedRequest(credentials, '/v1/order/cancel', { order_id: orderId });
}

/**
 * Cancel all active orders
 */
export async function cancelAllOrders(credentials: GeminiCredentials): Promise<{ result: string }> {
  return authenticatedRequest(credentials, '/v1/order/cancel/all');
}

/**
 * Get order status
 */
export async function getOrderStatus(
  credentials: GeminiCredentials,
  orderId: string
): Promise<GeminiOrder> {
  return authenticatedRequest(credentials, '/v1/order/status', { order_id: orderId });
}

/**
 * Get active orders
 */
export async function getActiveOrders(credentials: GeminiCredentials): Promise<GeminiOrder[]> {
  return authenticatedRequest(credentials, '/v1/orders');
}

/**
 * Get past trades
 */
export async function getPastTrades(
  credentials: GeminiCredentials,
  params: {
    symbol: string;
    limit_trades?: number;
    timestamp?: number;
  }
): Promise<any[]> {
  return authenticatedRequest(credentials, '/v1/mytrades', params);
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Test API connection and credentials
 */
export async function testConnection(credentials: GeminiCredentials): Promise<boolean> {
  try {
    await getBalances(credentials);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Get current server time
 */
export async function getServerTime(sandbox = false): Promise<{ server_time_ms: number }> {
  const baseUrl = sandbox ? GEMINI_API.SANDBOX_URL : GEMINI_API.BASE_URL;
  const response = await fetch(`${baseUrl}/v1/time`);
  return response.json();
}

export default {
  getTicker,
  getOrderbook,
  getTrades,
  getSymbols,
  getSymbolDetails,
  getBalances,
  getTransfers,
  getDepositAddresses,
  placeOrder,
  cancelOrder,
  cancelAllOrders,
  getOrderStatus,
  getActiveOrders,
  getPastTrades,
  testConnection,
  getServerTime,
};
