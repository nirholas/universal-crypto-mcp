/**
 * HTX (Huobi) Exchange API Integration
 * 
 * Provides comprehensive integration with HTX (formerly Huobi) cryptocurrency exchange:
 * - Market data (tickers, orderbook, trades, klines)
 * - Trading (spot, margin, futures)
 * - Account management (balances, transfers)
 * - WebSocket support for real-time data
 * 
 * @module htx-api
 * @see https://www.htx.com/en-us/opend/newApiPages/
 */

import crypto from 'crypto';
import {
  RateLimiter,
  retry,
  withTimeout,
  CircuitBreaker,
  ApiError,
  RateLimitError,
  TimeoutError,
  Logger,
} from '@ucmcp/shared-utils';

// Initialize rate limiter for HTX API (10 requests per second for market data)
const rateLimiter = new RateLimiter({
  maxRequests: 10,
  windowMs: 1000,
  name: 'htx-api',
});

// Circuit breaker for API health monitoring
const circuitBreaker = new CircuitBreaker({
  failureThreshold: 5,
  resetTimeout: 30000,
  halfOpenRequests: 2,
  name: 'htx-api',
});

// Logger for HTX integration
const logger = new Logger({
  context: { service: 'htx-api' },
  redactPaths: ['apiKey', 'apiSecret', 'Signature', 'AccessKeyId'],
});

export const HTX_API = {
  BASE_URL: 'https://api.huobi.pro',
  AWS_URL: 'https://api-aws.huobi.pro',
  WS_URL: 'wss://api.huobi.pro/ws',
  WS_FEED: 'wss://api.huobi.pro/feed',
} as const;

export interface HTXCredentials {
  apiKey: string;
  apiSecret: string;
}

export interface HTXTicker {
  symbol: string;
  open: number;
  high: number;
  low: number;
  close: number;
  amount: number;
  vol: number;
  count: number;
  bid: number;
  bidSize: number;
  ask: number;
  askSize: number;
}

export interface HTXOrderbook {
  bids: Array<[price: number, amount: number]>;
  asks: Array<[price: number, amount: number]>;
  ts: number;
}

export interface HTXTrade {
  id: number;
  ts: number;
  tradeId: number;
  amount: number;
  price: number;
  direction: 'buy' | 'sell';
}

export interface HTXBalance {
  currency: string;
  type: 'trade' | 'frozen';
  balance: string;
}

export interface HTXOrder {
  id: number;
  symbol: string;
  accountId: number;
  clientOrderId: string;
  amount: string;
  price: string;
  createdAt: number;
  type: string;
  filledAmount: string;
  filledCashAmount: string;
  filledFees: string;
  source: string;
  state: 'submitted' | 'partial-filled' | 'filled' | 'canceled' | 'partial-canceled';
}

/**
 * Create signature for HTX API
 */
function createSignature(
  credentials: HTXCredentials,
  method: string,
  host: string,
  path: string,
  params: Record<string, any>
): string {
  const timestamp = new Date().toISOString().slice(0, -5);
  
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}=${encodeURIComponent(params[key])}`)
    .join('&');
  
  const meta = [method, host, path, sortedParams].join('\n');
  
  const hash = crypto
    .createHmac('sha256', credentials.apiSecret)
    .update(meta)
    .digest('base64');
  
  return hash;
}

/**
 * Make authenticated request to HTX API
 */
async function authenticatedRequest<T>(
  credentials: HTXCredentials,
  method: 'GET' | 'POST',
  path: string,
  params: Record<string, any> = {}
): Promise<T> {
  await rateLimiter.acquire();
  
  return circuitBreaker.execute(async () => {
    return retry(
      async () => {
        const timestamp = new Date().toISOString().slice(0, -5);
        const host = 'api.huobi.pro';
        
        const authParams = {
          AccessKeyId: credentials.apiKey,
          SignatureMethod: 'HmacSHA256',
          SignatureVersion: '2',
          Timestamp: timestamp,
          ...params,
        };
        
        const signature = createSignature(credentials, method, host, path, authParams);
        authParams['Signature'] = signature;
        
        const url = `${HTX_API.BASE_URL}${path}?${new URLSearchParams(authParams as any).toString()}`;
        
        logger.debug('HTX authenticated request', { method, path });
        
        const response = await withTimeout(
          fetch(url, {
            method,
            headers: {
              'Content-Type': 'application/json',
            },
          }),
          15000,
          `HTX API request timeout: ${path}`
        );
        
        if (response.status === 429) {
          const retryAfter = parseInt(response.headers.get('retry-after') || '60', 10);
          throw new RateLimitError('HTX API rate limit exceeded', 'htx-api', retryAfter * 1000);
        }
        
        if (!response.ok) {
          const error = await response.json().catch(() => ({}));
          throw new ApiError(
            error['err-msg'] || `HTX API error: ${response.status}`,
            response.status,
            'htx-api',
            path,
            error
          );
        }
        
        const data = await response.json();
        
        if (data.status === 'error') {
          throw new ApiError(data['err-msg'] || 'HTX API error', 400, 'htx-api', path, data);
        }
        
        return data.data || data;
      },
      {
        maxAttempts: 3,
        baseDelay: 1000,
        maxDelay: 10000,
        shouldRetry: (error) => {
          if (error instanceof RateLimitError) return true;
          if (error instanceof ApiError && error.statusCode >= 500) return true;
          return false;
        },
      }
    );
  });
}

/**
 * Make public request to HTX API
 */
async function publicRequest<T>(endpoint: string): Promise<T> {
  await rateLimiter.acquire();
  
  return circuitBreaker.execute(async () => {
    return retry(
      async () => {
        logger.debug('HTX public request', { endpoint });
        
        const response = await withTimeout(
          fetch(`${HTX_API.BASE_URL}${endpoint}`),
          15000,
          `HTX API request timeout: ${endpoint}`
        );
        
        if (response.status === 429) {
          const retryAfter = parseInt(response.headers.get('retry-after') || '60', 10);
          throw new RateLimitError('HTX API rate limit exceeded', 'htx-api', retryAfter * 1000);
        }
        
        if (!response.ok) {
          const error = await response.json().catch(() => ({}));
          throw new ApiError(
            error['err-msg'] || `HTX API error: ${response.status}`,
            response.status,
            'htx-api',
            endpoint,
            error
          );
        }
        
        const data = await response.json();
        
        if (data.status === 'error') {
          throw new ApiError(data['err-msg'] || 'HTX API error', 400, 'htx-api', endpoint, data);
        }
        
        return data.data || data;
      },
      {
        maxAttempts: 3,
        baseDelay: 1000,
        maxDelay: 10000,
        shouldRetry: (error) => {
          if (error instanceof RateLimitError) return true;
          if (error instanceof ApiError && error.statusCode >= 500) return true;
          return false;
        },
      }
    );
  });
}

// =============================================================================
// PUBLIC MARKET DATA
// =============================================================================

/**
 * Get ticker for a symbol
 */
export async function getTicker(symbol: string): Promise<HTXTicker> {
  const data: any = await publicRequest(`/market/detail/merged?symbol=${symbol}`);
  
  return {
    symbol,
    open: data.open,
    high: data.high,
    low: data.low,
    close: data.close,
    amount: data.amount,
    vol: data.vol,
    count: data.count,
    bid: data.bid[0],
    bidSize: data.bid[1],
    ask: data.ask[0],
    askSize: data.ask[1],
  };
}

/**
 * Get all tickers
 */
export async function getAllTickers(): Promise<any[]> {
  const data: any = await publicRequest('/market/tickers');
  return data;
}

/**
 * Get orderbook for a symbol
 */
export async function getOrderbook(
  symbol: string,
  depth: 5 | 10 | 20 = 20
): Promise<HTXOrderbook> {
  const data: any = await publicRequest(`/market/depth?symbol=${symbol}&depth=${depth}&type=step0`);
  
  return {
    bids: data.bids,
    asks: data.asks,
    ts: data.ts,
  };
}

/**
 * Get recent trades for a symbol
 */
export async function getTrades(symbol: string, size: number = 100): Promise<HTXTrade[]> {
  const data: any = await publicRequest(`/market/history/trade?symbol=${symbol}&size=${size}`);
  
  const trades: HTXTrade[] = [];
  for (const item of data) {
    for (const trade of item.data) {
      trades.push({
        id: trade.id,
        ts: trade.ts,
        tradeId: trade['trade-id'],
        amount: trade.amount,
        price: trade.price,
        direction: trade.direction,
      });
    }
  }
  
  return trades;
}

/**
 * Get kline/candlestick data
 */
export async function getKlines(
  symbol: string,
  period: '1min' | '5min' | '15min' | '30min' | '60min' | '4hour' | '1day' | '1mon' | '1week' | '1year',
  size: number = 150
): Promise<Array<{ id: number; open: number; close: number; low: number; high: number; amount: number; vol: number; count: number }>> {
  const data: any = await publicRequest(`/market/history/kline?symbol=${symbol}&period=${period}&size=${size}`);
  return data;
}

/**
 * Get all trading symbols
 */
export async function getSymbols(): Promise<any[]> {
  const data: any = await publicRequest('/v1/common/symbols');
  return data;
}

/**
 * Get all currencies
 */
export async function getCurrencies(): Promise<any[]> {
  const data: any = await publicRequest('/v1/common/currencys');
  return data;
}

/**
 * Get server timestamp
 */
export async function getTimestamp(): Promise<number> {
  const data: any = await publicRequest('/v1/common/timestamp');
  return data;
}

// =============================================================================
// AUTHENTICATED ACCOUNT ENDPOINTS
// =============================================================================

/**
 * Get all accounts
 */
export async function getAccounts(credentials: HTXCredentials): Promise<any[]> {
  return authenticatedRequest(credentials, 'GET', '/v1/account/accounts');
}

/**
 * Get account balance
 */
export async function getBalance(credentials: HTXCredentials, accountId: string): Promise<HTXBalance[]> {
  const data: any = await authenticatedRequest(credentials, 'GET', `/v1/account/accounts/${accountId}/balance`);
  return data.list;
}

/**
 * Get account history
 */
export async function getAccountHistory(
  credentials: HTXCredentials,
  accountId: string,
  params?: { currency?: string; transactTypes?: string; startTime?: number; endTime?: number; sort?: 'asc' | 'desc'; size?: number }
): Promise<any[]> {
  return authenticatedRequest(credentials, 'GET', `/v1/account/history`, { 'account-id': accountId, ...params });
}

// =============================================================================
// AUTHENTICATED TRADING ENDPOINTS
// =============================================================================

/**
 * Place an order
 */
export async function placeOrder(
  credentials: HTXCredentials,
  params: {
    accountId: string;
    symbol: string;
    type: 'buy-market' | 'sell-market' | 'buy-limit' | 'sell-limit' | 'buy-ioc' | 'sell-ioc' | 'buy-limit-maker' | 'sell-limit-maker' | 'buy-stop-limit' | 'sell-stop-limit';
    amount: string;
    price?: string;
    source?: string;
    clientOrderId?: string;
    stopPrice?: string;
    operator?: 'gte' | 'lte';
  }
): Promise<string> {
  const body = {
    'account-id': params.accountId,
    symbol: params.symbol,
    type: params.type,
    amount: params.amount,
    ...(params.price && { price: params.price }),
    ...(params.source && { source: params.source }),
    ...(params.clientOrderId && { 'client-order-id': params.clientOrderId }),
    ...(params.stopPrice && { 'stop-price': params.stopPrice }),
    ...(params.operator && { operator: params.operator }),
  };
  
  return authenticatedRequest(credentials, 'POST', '/v1/order/orders/place', body);
}

/**
 * Cancel an order
 */
export async function cancelOrder(credentials: HTXCredentials, orderId: string): Promise<string> {
  return authenticatedRequest(credentials, 'POST', `/v1/order/orders/${orderId}/submitcancel`);
}

/**
 * Cancel all orders
 */
export async function cancelAllOrders(
  credentials: HTXCredentials,
  params: {
    accountId: string;
    symbol?: string;
    side?: 'buy' | 'sell';
    size?: number;
  }
): Promise<any> {
  return authenticatedRequest(credentials, 'POST', '/v1/order/orders/batchcancel', params);
}

/**
 * Get order info
 */
export async function getOrder(credentials: HTXCredentials, orderId: string): Promise<HTXOrder> {
  return authenticatedRequest(credentials, 'GET', `/v1/order/orders/${orderId}`);
}

/**
 * Get open orders
 */
export async function getOpenOrders(
  credentials: HTXCredentials,
  params: {
    accountId: string;
    symbol?: string;
    side?: 'buy' | 'sell';
    size?: number;
  }
): Promise<HTXOrder[]> {
  return authenticatedRequest(credentials, 'GET', '/v1/order/openOrders', params);
}

/**
 * Get order history
 */
export async function getOrderHistory(
  credentials: HTXCredentials,
  params: {
    symbol: string;
    states?: string;
    types?: string;
    startDate?: string;
    endDate?: string;
    from?: string;
    direct?: 'prev' | 'next';
    size?: number;
  }
): Promise<HTXOrder[]> {
  return authenticatedRequest(credentials, 'GET', '/v1/order/orders', params);
}

/**
 * Get match results (trades)
 */
export async function getMatchResults(
  credentials: HTXCredentials,
  params: {
    symbol: string;
    types?: string;
    startDate?: string;
    endDate?: string;
    from?: string;
    direct?: 'prev' | 'next';
    size?: number;
  }
): Promise<any[]> {
  return authenticatedRequest(credentials, 'GET', '/v1/order/matchresults', params);
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Test API connection and credentials
 */
export async function testConnection(credentials: HTXCredentials): Promise<boolean> {
  try {
    await getAccounts(credentials);
    return true;
  } catch (error) {
    return false;
  }
}

export default {
  getTicker,
  getAllTickers,
  getOrderbook,
  getTrades,
  getKlines,
  getSymbols,
  getCurrencies,
  getTimestamp,
  getAccounts,
  getBalance,
  getAccountHistory,
  placeOrder,
  cancelOrder,
  cancelAllOrders,
  getOrder,
  getOpenOrders,
  getOrderHistory,
  getMatchResults,
  testConnection,
};
