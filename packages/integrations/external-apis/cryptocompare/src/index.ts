/**
 * CryptoCompare API Integration
 * 
 * Provides comprehensive crypto market data and analytics from CryptoCompare:
 * - Real-time and historical prices
 * - OHLCV data and charts
 * - News and social sentiment
 * - Exchange information
 * - On-chain data
 * 
 * @module cryptocompare-api
 * @see https://min-api.cryptocompare.com/documentation
 */

export const CRYPTOCOMPARE_API = {
  BASE_URL: 'https://min-api.cryptocompare.com',
  DATA_API: 'https://data-api.cryptocompare.com',
  WS_URL: 'wss://streamer.cryptocompare.com/v2',
} as const;

export interface CryptoCompareCredentials {
  apiKey?: string; // Optional for public endpoints, required for premium features
}

export interface CryptoComparePrice {
  [currency: string]: number;
}

export interface CryptoCompareOHLCV {
  time: number;
  high: number;
  low: number;
  open: number;
  volumefrom: number;
  volumeto: number;
  close: number;
  conversionType: string;
  conversionSymbol: string;
}

export interface CryptoCompareCoin {
  Id: string;
  Url: string;
  ImageUrl: string;
  ContentCreatedOn: number;
  Name: string;
  Symbol: string;
  CoinName: string;
  FullName: string;
  Algorithm: string;
  ProofType: string;
  FullyPremined: string;
  TotalCoinSupply: string;
  BuiltOn: string;
  SmartContractAddress: string;
  Rating: {
    Weiss: {
      Rating: string;
      TechnologyAdoptionRating: string;
      MarketPerformanceRating: string;
    };
  };
}

export interface CryptoCompareNews {
  id: string;
  guid: string;
  published_on: number;
  imageurl: string;
  title: string;
  url: string;
  source: string;
  body: string;
  tags: string;
  categories: string;
  upvotes: string;
  downvotes: string;
  lang: string;
  source_info: {
    name: string;
    lang: string;
    img: string;
  };
}

/**
 * Make request to CryptoCompare API
 */
async function makeRequest<T>(
  endpoint: string,
  params: Record<string, any> = {},
  credentials?: CryptoCompareCredentials
): Promise<T> {
  const queryString = new URLSearchParams(params as any).toString();
  const url = `${CRYPTOCOMPARE_API.BASE_URL}${endpoint}${queryString ? `?${queryString}` : ''}`;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (credentials?.apiKey) {
    headers['Authorization'] = `Apikey ${credentials.apiKey}`;
  }
  
  const response = await fetch(url, { headers });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.Message || `CryptoCompare API error: ${response.status}`);
  }
  
  const data = await response.json();
  
  if (data.Response === 'Error') {
    throw new Error(data.Message || 'CryptoCompare API error');
  }
  
  return data;
}

// =============================================================================
// PRICE DATA
// =============================================================================

/**
 * Get current price for a cryptocurrency
 */
export async function getPrice(
  fsym: string,
  tsyms: string[],
  credentials?: CryptoCompareCredentials
): Promise<CryptoComparePrice> {
  return makeRequest('/data/price', { fsym, tsyms: tsyms.join(',') }, credentials);
}

/**
 * Get current prices for multiple cryptocurrencies
 */
export async function getMultiPrice(
  fsyms: string[],
  tsyms: string[],
  credentials?: CryptoCompareCredentials
): Promise<Record<string, CryptoComparePrice>> {
  return makeRequest('/data/pricemulti', { fsyms: fsyms.join(','), tsyms: tsyms.join(',') }, credentials);
}

/**
 * Get full price data including exchange info
 */
export async function getPriceFull(
  fsyms: string[],
  tsyms: string[],
  credentials?: CryptoCompareCredentials
): Promise<any> {
  const data: any = await makeRequest('/data/pricemultifull', { fsyms: fsyms.join(','), tsyms: tsyms.join(',') }, credentials);
  return data.RAW || data.DISPLAY;
}

/**
 * Get historical price at a specific timestamp
 */
export async function getPriceHistorical(
  fsym: string,
  tsyms: string[],
  timestamp: number,
  credentials?: CryptoCompareCredentials
): Promise<any> {
  return makeRequest('/data/pricehistorical', { fsym, tsyms: tsyms.join(','), ts: timestamp }, credentials);
}

/**
 * Get day average price
 */
export async function getDayAverage(
  fsym: string,
  tsym: string,
  params?: { toTs?: number; avgType?: 'HourVWAP' | 'MidHighLow' | 'VolFVolT' },
  credentials?: CryptoCompareCredentials
): Promise<any> {
  return makeRequest('/data/dayAvg', { fsym, tsym, ...params }, credentials);
}

// =============================================================================
// HISTORICAL OHLCV DATA
// =============================================================================

/**
 * Get hourly historical data
 */
export async function getHistoHour(
  fsym: string,
  tsym: string,
  params?: { limit?: number; toTs?: number; aggregate?: number },
  credentials?: CryptoCompareCredentials
): Promise<{ Data: CryptoCompareOHLCV[] }> {
  return makeRequest('/data/v2/histohour', { fsym, tsym, ...params }, credentials);
}

/**
 * Get daily historical data
 */
export async function getHistoDay(
  fsym: string,
  tsym: string,
  params?: { limit?: number; toTs?: number; aggregate?: number; allData?: boolean },
  credentials?: CryptoCompareCredentials
): Promise<{ Data: CryptoCompareOHLCV[] }> {
  return makeRequest('/data/v2/histoday', { fsym, tsym, ...params }, credentials);
}

/**
 * Get minute historical data
 */
export async function getHistoMinute(
  fsym: string,
  tsym: string,
  params?: { limit?: number; toTs?: number; aggregate?: number },
  credentials?: CryptoCompareCredentials
): Promise<{ Data: CryptoCompareOHLCV[] }> {
  return makeRequest('/data/v2/histominute', { fsym, tsym, ...params }, credentials);
}

// =============================================================================
// COIN INFORMATION
// =============================================================================

/**
 * Get list of all coins
 */
export async function getCoinList(credentials?: CryptoCompareCredentials): Promise<Record<string, CryptoCompareCoin>> {
  const data: any = await makeRequest('/data/all/coinlist', {}, credentials);
  return data.Data;
}

/**
 * Get top coins by market cap
 */
export async function getTopByMarketCap(
  tsym: string = 'USD',
  limit: number = 10,
  credentials?: CryptoCompareCredentials
): Promise<any[]> {
  const data: any = await makeRequest('/data/top/mktcapfull', { limit, tsym }, credentials);
  return data.Data;
}

/**
 * Get top coins by volume
 */
export async function getTopByVolume(
  tsym: string = 'USD',
  limit: number = 10,
  credentials?: CryptoCompareCredentials
): Promise<any[]> {
  const data: any = await makeRequest('/data/top/totalvolfull', { limit, tsym }, credentials);
  return data.Data;
}

/**
 * Get top trading pairs
 */
export async function getTopPairs(
  fsym: string,
  limit: number = 5,
  credentials?: CryptoCompareCredentials
): Promise<any[]> {
  const data: any = await makeRequest('/data/top/pairs', { fsym, limit }, credentials);
  return data.Data;
}

// =============================================================================
// EXCHANGE DATA
// =============================================================================

/**
 * Get all exchanges
 */
export async function getExchanges(credentials?: CryptoCompareCredentials): Promise<any> {
  const data: any = await makeRequest('/data/all/exchanges', {}, credentials);
  return data.Data;
}

/**
 * Get top exchanges by volume
 */
export async function getTopExchanges(
  fsym: string,
  tsym: string,
  limit: number = 5,
  credentials?: CryptoCompareCredentials
): Promise<any[]> {
  const data: any = await makeRequest('/data/top/exchanges', { fsym, tsym, limit }, credentials);
  return data.Data;
}

/**
 * Get exchange volume for a pair
 */
export async function getExchangeVolume(
  tsym: string,
  limit: number = 20,
  credentials?: CryptoCompareCredentials
): Promise<any> {
  return makeRequest('/data/top/exchanges/full', { tsym, limit }, credentials);
}

// =============================================================================
// NEWS AND SOCIAL DATA
// =============================================================================

/**
 * Get latest crypto news
 */
export async function getNews(
  params?: { feeds?: string; categories?: string; excludeCategories?: string; lTs?: number },
  credentials?: CryptoCompareCredentials
): Promise<CryptoCompareNews[]> {
  const data: any = await makeRequest('/data/v2/news/', params, credentials);
  return data.Data;
}

/**
 * Get news feeds
 */
export async function getNewsFeeds(credentials?: CryptoCompareCredentials): Promise<any[]> {
  const data: any = await makeRequest('/data/news/feeds', {}, credentials);
  return data;
}

/**
 * Get news categories
 */
export async function getNewsCategories(credentials?: CryptoCompareCredentials): Promise<any[]> {
  const data: any = await makeRequest('/data/news/categories', {}, credentials);
  return data;
}

/**
 * Get social stats for a coin
 */
export async function getSocialStats(
  coinId: number,
  credentials?: CryptoCompareCredentials
): Promise<any> {
  const data: any = await makeRequest('/data/social/coin/latest', { coinId }, credentials);
  return data.Data;
}

/**
 * Get historical social stats
 */
export async function getSocialStatsHistorical(
  coinId: number,
  params?: { limit?: number; aggregate?: number; toTs?: number },
  credentials?: CryptoCompareCredentials
): Promise<any[]> {
  const data: any = await makeRequest('/data/social/coin/histo/day', { coinId, ...params }, credentials);
  return data.Data;
}

// =============================================================================
// BLOCKCHAIN DATA
// =============================================================================

/**
 * Get blockchain data for a coin
 */
export async function getBlockchainData(
  fsym: string,
  credentials?: CryptoCompareCredentials
): Promise<any> {
  const data: any = await makeRequest('/data/blockchain/latest', { fsym }, credentials);
  return data.Data;
}

/**
 * Get historical blockchain data
 */
export async function getBlockchainHistorical(
  fsym: string,
  params?: { limit?: number; aggregate?: number; toTs?: number },
  credentials?: CryptoCompareCredentials
): Promise<any[]> {
  const data: any = await makeRequest('/data/blockchain/histo/day', { fsym, ...params }, credentials);
  return data.Data;
}

// =============================================================================
// MINING DATA
// =============================================================================

/**
 * Get mining equipment
 */
export async function getMiningEquipment(credentials?: CryptoCompareCredentials): Promise<any> {
  const data: any = await makeRequest('/data/mining/equipment', {}, credentials);
  return data.Data;
}

/**
 * Get mining contracts
 */
export async function getMiningContracts(credentials?: CryptoCompareCredentials): Promise<any> {
  const data: any = await makeRequest('/data/mining/contracts', {}, credentials);
  return data.Data;
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Test API connection
 */
export async function testConnection(credentials?: CryptoCompareCredentials): Promise<boolean> {
  try {
    await getPrice('BTC', ['USD'], credentials);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Get rate limits info
 */
export async function getRateLimits(credentials?: CryptoCompareCredentials): Promise<any> {
  return makeRequest('/stats/rate/limit', {}, credentials);
}

export default {
  getPrice,
  getMultiPrice,
  getPriceFull,
  getPriceHistorical,
  getDayAverage,
  getHistoHour,
  getHistoDay,
  getHistoMinute,
  getCoinList,
  getTopByMarketCap,
  getTopByVolume,
  getTopPairs,
  getExchanges,
  getTopExchanges,
  getExchangeVolume,
  getNews,
  getNewsFeeds,
  getNewsCategories,
  getSocialStats,
  getSocialStatsHistorical,
  getBlockchainData,
  getBlockchainHistorical,
  getMiningEquipment,
  getMiningContracts,
  testConnection,
  getRateLimits,
};
