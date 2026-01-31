/**
 * Messari API Integration
 * 
 * Provides comprehensive crypto research data and analytics from Messari:
 * - Asset profiles and metrics
 * - Market data and timeseries
 * - News and research
 * - Quantitative metrics
 * - On-chain data
 * 
 * @module messari-api
 * @see https://messari.io/api/docs
 */

import {
  RateLimiter,
  retry,
  withTimeout,
  CircuitBreaker,
  ApiError,
  RateLimitError,
  Logger,
} from '@ucmcp/shared-utils';

// Initialize rate limiter for Messari API (20 requests per minute for free tier)
const rateLimiter = new RateLimiter({
  maxRequests: 20,
  windowMs: 60000,
  name: 'messari-api',
});

// Circuit breaker for API health monitoring
const circuitBreaker = new CircuitBreaker({
  failureThreshold: 5,
  resetTimeout: 30000,
  halfOpenRequests: 2,
  name: 'messari-api',
});

// Logger for Messari integration
const logger = new Logger({
  context: { service: 'messari-api' },
  redactPaths: ['apiKey', 'x-messari-api-key'],
});

export const MESSARI_API = {
  BASE_URL: 'https://data.messari.io/api',
  V1: 'https://data.messari.io/api/v1',
  V2: 'https://data.messari.io/api/v2',
} as const;

export interface MessariCredentials {
  apiKey: string;
}

export interface MessariAsset {
  id: string;
  symbol: string;
  name: string;
  slug: string;
  metrics: {
    market_data: {
      price_usd: number;
      price_btc: number;
      volume_last_24_hours: number;
      real_volume_last_24_hours: number;
      volume_last_24_hours_overstatement_multiple: number;
      percent_change_usd_last_1_hour: number;
      percent_change_usd_last_24_hours: number;
      percent_change_btc_last_24_hours: number;
      ohlcv_last_1_hour: {
        open: number;
        high: number;
        low: number;
        close: number;
        volume: number;
      };
      ohlcv_last_24_hour: {
        open: number;
        high: number;
        low: number;
        close: number;
        volume: number;
      };
      last_trade_at: string;
    };
    marketcap: {
      current_marketcap_usd: number;
      y_2050_marketcap_usd: number;
      y_plus10_marketcap_usd: number;
      liquid_marketcap_usd: number;
      volume_turnover_last_24_hours_percent: number;
    };
    supply: {
      y_2050: number;
      y_plus10: number;
      liquid: number;
      circulating: number;
      y_2050_issued_percent: number;
      annual_inflation_percent: number;
      stock_to_flow: number;
    };
  };
}

export interface MessariNews {
  id: string;
  title: string;
  content: string;
  references: Array<{
    name: string;
    url: string;
  }>;
  reference_title: string;
  published_at: string;
  author: {
    name: string;
  };
  tags: string[];
  url: string;
}

export interface MessariTimeseries {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

/**
 * Make request to Messari API
 */
async function makeRequest<T>(
  endpoint: string,
  credentials?: MessariCredentials,
  params: Record<string, any> = {}
): Promise<T> {
  await rateLimiter.acquire();
  
  return circuitBreaker.execute(async () => {
    return retry(
      async () => {
        const queryParams = new URLSearchParams(params as any);
        const url = `${MESSARI_API.V1}${endpoint}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        
        if (credentials?.apiKey) {
          headers['x-messari-api-key'] = credentials.apiKey;
        }
        
        logger.debug('Messari request', { endpoint });
        
        const response = await withTimeout(
          fetch(url, { headers }),
          15000,
          `Messari API request timeout: ${endpoint}`
        );
        
        if (response.status === 429) {
          const retryAfter = parseInt(response.headers.get('retry-after') || '60', 10);
          throw new RateLimitError('Messari API rate limit exceeded', 'messari-api', retryAfter * 1000);
        }
        
        if (!response.ok) {
          const error = await response.json().catch(() => ({}));
          throw new ApiError(
            error.status?.error_message || `Messari API error: ${response.status}`,
            response.status,
            'messari-api',
            endpoint,
            error
          );
        }
        
        const data = await response.json();
        return data.data;
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
// ASSETS
// =============================================================================

/**
 * Get all assets
 */
export async function getAllAssets(
  params?: { fields?: string; limit?: number },
  credentials?: MessariCredentials
): Promise<MessariAsset[]> {
  return makeRequest('/assets', credentials, params);
}

/**
 * Get asset by slug or symbol
 */
export async function getAsset(
  assetKey: string,
  params?: { fields?: string },
  credentials?: MessariCredentials
): Promise<MessariAsset> {
  return makeRequest(`/assets/${assetKey}`, credentials, params);
}

/**
 * Get asset profile
 */
export async function getAssetProfile(
  assetKey: string,
  params?: { fields?: string },
  credentials?: MessariCredentials
): Promise<any> {
  return makeRequest(`/assets/${assetKey}/profile`, credentials, params);
}

/**
 * Get asset metrics
 */
export async function getAssetMetrics(
  assetKey: string,
  params?: { fields?: string },
  credentials?: MessariCredentials
): Promise<any> {
  return makeRequest(`/assets/${assetKey}/metrics`, credentials, params);
}

/**
 * Get market data for asset
 */
export async function getAssetMarketData(
  assetKey: string,
  params?: { fields?: string },
  credentials?: MessariCredentials
): Promise<any> {
  return makeRequest(`/assets/${assetKey}/metrics/market-data`, credentials, params);
}

// =============================================================================
// TIMESERIES
// =============================================================================

/**
 * Get price timeseries
 */
export async function getPriceTimeseries(
  assetKey: string,
  params?: {
    start?: string;
    end?: string;
    interval?: '1d' | '1w' | '1m' | '1y';
    columns?: string;
    format?: 'json' | 'csv';
    timestamp_format?: 'rfc3339' | 'unix';
  },
  credentials?: MessariCredentials
): Promise<{ values: MessariTimeseries[] }> {
  return makeRequest(`/assets/${assetKey}/metrics/price/time-series`, credentials, params);
}

/**
 * Get volume timeseries
 */
export async function getVolumeTimeseries(
  assetKey: string,
  params?: {
    start?: string;
    end?: string;
    interval?: '1d' | '1w' | '1m' | '1y';
    columns?: string;
    format?: 'json' | 'csv';
    timestamp_format?: 'rfc3339' | 'unix';
  },
  credentials?: MessariCredentials
): Promise<{ values: any[] }> {
  return makeRequest(`/assets/${assetKey}/metrics/volume/time-series`, credentials, params);
}

/**
 * Get marketcap timeseries
 */
export async function getMarketcapTimeseries(
  assetKey: string,
  params?: {
    start?: string;
    end?: string;
    interval?: '1d' | '1w' | '1m' | '1y';
    columns?: string;
    format?: 'json' | 'csv';
    timestamp_format?: 'rfc3339' | 'unix';
  },
  credentials?: MessariCredentials
): Promise<{ values: any[] }> {
  return makeRequest(`/assets/${assetKey}/metrics/marketcap/time-series`, credentials, params);
}

/**
 * Get realized cap timeseries
 */
export async function getRealizedCapTimeseries(
  assetKey: string,
  params?: {
    start?: string;
    end?: string;
    interval?: '1d' | '1w' | '1m' | '1y';
    columns?: string;
    format?: 'json' | 'csv';
    timestamp_format?: 'rfc3339' | 'unix';
  },
  credentials?: MessariCredentials
): Promise<{ values: any[] }> {
  return makeRequest(`/assets/${assetKey}/metrics/mcap.realized/time-series`, credentials, params);
}

/**
 * Get MVRV ratio timeseries
 */
export async function getMVRVTimeseries(
  assetKey: string,
  params?: {
    start?: string;
    end?: string;
    interval?: '1d' | '1w' | '1m' | '1y';
    columns?: string;
    format?: 'json' | 'csv';
    timestamp_format?: 'rfc3339' | 'unix';
  },
  credentials?: MessariCredentials
): Promise<{ values: any[] }> {
  return makeRequest(`/assets/${assetKey}/metrics/mvrv.ratio/time-series`, credentials, params);
}

/**
 * Get NVT ratio timeseries
 */
export async function getNVTTimeseries(
  assetKey: string,
  params?: {
    start?: string;
    end?: string;
    interval?: '1d' | '1w' | '1m' | '1y';
    columns?: string;
    format?: 'json' | 'csv';
    timestamp_format?: 'rfc3339' | 'unix';
  },
  credentials?: MessariCredentials
): Promise<{ values: any[] }> {
  return makeRequest(`/assets/${assetKey}/metrics/nvt/time-series`, credentials, params);
}

/**
 * Get active addresses timeseries
 */
export async function getActiveAddressesTimeseries(
  assetKey: string,
  params?: {
    start?: string;
    end?: string;
    interval?: '1d' | '1w' | '1m' | '1y';
    columns?: string;
    format?: 'json' | 'csv';
    timestamp_format?: 'rfc3339' | 'unix';
  },
  credentials?: MessariCredentials
): Promise<{ values: any[] }> {
  return makeRequest(`/assets/${assetKey}/metrics/act.addr.cnt/time-series`, credentials, params);
}

/**
 * Get transaction count timeseries
 */
export async function getTransactionCountTimeseries(
  assetKey: string,
  params?: {
    start?: string;
    end?: string;
    interval?: '1d' | '1w' | '1m' | '1y';
    columns?: string;
    format?: 'json' | 'csv';
    timestamp_format?: 'rfc3339' | 'unix';
  },
  credentials?: MessariCredentials
): Promise<{ values: any[] }> {
  return makeRequest(`/assets/${assetKey}/metrics/txn.cnt/time-series`, credentials, params);
}

// =============================================================================
// MARKETS
// =============================================================================

/**
 * Get all markets for an asset
 */
export async function getMarkets(
  assetKey: string,
  credentials?: MessariCredentials
): Promise<any[]> {
  return makeRequest(`/assets/${assetKey}/markets`, credentials);
}

/**
 * Get market timeseries
 */
export async function getMarketTimeseries(
  marketKey: string,
  params?: {
    start?: string;
    end?: string;
    interval?: '1m' | '5m' | '15m' | '30m' | '1h' | '1d' | '1w';
    columns?: string;
    format?: 'json' | 'csv';
    timestamp_format?: 'rfc3339' | 'unix';
  },
  credentials?: MessariCredentials
): Promise<{ values: MessariTimeseries[] }> {
  return makeRequest(`/markets/${marketKey}/metrics/price.ohlcv/time-series`, credentials, params);
}

// =============================================================================
// NEWS
// =============================================================================

/**
 * Get all news articles
 */
export async function getAllNews(
  params?: { fields?: string; page?: number; limit?: number },
  credentials?: MessariCredentials
): Promise<MessariNews[]> {
  return makeRequest('/news', credentials, params);
}

/**
 * Get news for a specific asset
 */
export async function getAssetNews(
  assetKey: string,
  params?: { fields?: string; page?: number; limit?: number },
  credentials?: MessariCredentials
): Promise<MessariNews[]> {
  return makeRequest(`/news/${assetKey}`, credentials, params);
}

// =============================================================================
// RESEARCH
// =============================================================================

/**
 * Get all research articles
 */
export async function getAllResearch(
  params?: { page?: number; limit?: number },
  credentials?: MessariCredentials
): Promise<any[]> {
  return makeRequest('/research', credentials, params);
}

/**
 * Get research for a specific asset
 */
export async function getAssetResearch(
  assetKey: string,
  params?: { page?: number; limit?: number },
  credentials?: MessariCredentials
): Promise<any[]> {
  return makeRequest(`/research/${assetKey}`, credentials, params);
}

// =============================================================================
// QUANTITATIVE METRICS
// =============================================================================

/**
 * Get quantitative metrics for an asset
 */
export async function getQuantMetrics(
  assetKey: string,
  credentials?: MessariCredentials
): Promise<any> {
  return makeRequest(`/assets/${assetKey}/metrics/quantitative`, credentials);
}

/**
 * Get mining stats
 */
export async function getMiningStats(
  assetKey: string,
  credentials?: MessariCredentials
): Promise<any> {
  return makeRequest(`/assets/${assetKey}/metrics/mining-stats`, credentials);
}

/**
 * Get miner flows
 */
export async function getMinerFlows(
  assetKey: string,
  credentials?: MessariCredentials
): Promise<any> {
  return makeRequest(`/assets/${assetKey}/metrics/miner-flows`, credentials);
}

/**
 * Get supply activity
 */
export async function getSupplyActivity(
  assetKey: string,
  credentials?: MessariCredentials
): Promise<any> {
  return makeRequest(`/assets/${assetKey}/metrics/supply-activity`, credentials);
}

/**
 * Get exchange flows
 */
export async function getExchangeFlows(
  assetKey: string,
  credentials?: MessariCredentials
): Promise<any> {
  return makeRequest(`/assets/${assetKey}/metrics/exchange-flows`, credentials);
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Test API connection and credentials
 */
export async function testConnection(credentials?: MessariCredentials): Promise<boolean> {
  try {
    await getAsset('bitcoin', {}, credentials);
    return true;
  } catch (error) {
    return false;
  }
}

export default {
  getAllAssets,
  getAsset,
  getAssetProfile,
  getAssetMetrics,
  getAssetMarketData,
  getPriceTimeseries,
  getVolumeTimeseries,
  getMarketcapTimeseries,
  getRealizedCapTimeseries,
  getMVRVTimeseries,
  getNVTTimeseries,
  getActiveAddressesTimeseries,
  getTransactionCountTimeseries,
  getMarkets,
  getMarketTimeseries,
  getAllNews,
  getAssetNews,
  getAllResearch,
  getAssetResearch,
  getQuantMetrics,
  getMiningStats,
  getMinerFlows,
  getSupplyActivity,
  getExchangeFlows,
  testConnection,
};
