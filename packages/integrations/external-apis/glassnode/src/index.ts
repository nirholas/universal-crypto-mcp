/**
 * Glassnode API Integration
 * 
 * Provides comprehensive on-chain data and analytics from Glassnode:
 * - On-chain metrics (addresses, transactions, UTXOs)
 * - Market indicators (MVRV, NVT, Puell Multiple)
 * - Mining data (hash rate, difficulty, revenue)
 * - Exchange flows and balances
 * - DeFi metrics
 * - Derivatives data
 * 
 * @module glassnode-api
 * @see https://docs.glassnode.com/api/
 */

export const GLASSNODE_API = {
  BASE_URL: 'https://api.glassnode.com',
  V1: 'https://api.glassnode.com/v1',
  V2: 'https://api.glassnode.com/v2',
} as const;

export interface GlassnodeCredentials {
  apiKey: string;
}

export interface GlassnodeDataPoint {
  t: number; // timestamp
  v: number; // value
}

export type GlassnodeAsset = 'BTC' | 'ETH' | 'LTC' | 'AAVE' | 'ABT' | 'AMPL' | 'ANT' | 'ARMOR' | 'BADGER' | 'BAL' | 'BAND' | 'BAT' | 'BNT' | 'BOND' | 'BRD' | 'BUSD' | 'BZRX' | 'CELR' | 'CHSB' | 'CND' | 'COMP' | 'CREAM' | 'CRO' | 'CRV' | 'CVC' | 'CVP' | 'DAI' | 'DDX' | 'DENT' | 'DGX' | 'DHT' | 'DMG' | 'DODO' | 'DOUGH' | 'DRGN' | 'ELF' | 'ENG' | 'ENJ' | 'EURS' | 'FET' | 'FTT' | 'FUN' | 'GNO' | 'GUSD' | 'HEGIC' | 'HOT' | 'HPT' | 'HT' | 'HUSD' | 'INDEX' | 'KCS' | 'LAMB' | 'LBA' | 'LDO' | 'LEO' | 'LINK' | 'LOOM' | 'LRC' | 'MANA' | 'MATIC' | 'MCB' | 'MCO' | 'MFT' | 'MIR' | 'MKR' | 'MLN' | 'MPH' | 'MTA' | 'MTL' | 'MX' | 'NDX' | 'NEXO' | 'NFTX' | 'NMR' | 'Nsure' | 'OCEAN' | 'OKB' | 'OMG' | 'PAX' | 'PAY' | 'PERP' | 'PICKLE' | 'PNK' | 'PNT' | 'POLY' | 'POWR' | 'PPT' | 'QASH' | 'QKC' | 'QNT' | 'RDN' | 'REN' | 'REP' | 'RLC' | 'ROOK' | 'RPL' | 'RSR' | 'SAI' | 'SAN' | 'SNT' | 'SNX' | 'STAKE' | 'STORJ' | 'sUSD' | 'SUSHI' | 'TEL' | 'TOP' | 'UBT' | 'UMA' | 'UNI' | 'USDC' | 'USDK' | 'USDT' | 'UTK' | 'VERI' | 'WaBi' | 'WAX' | 'WBTC' | 'WETH' | 'wNXM' | 'WTC' | 'YAM' | 'YFI' | 'ZRX';

export type GlassnodeInterval = '24h' | '1h' | '10m' | '1w' | '1month';
export type GlassnodeFormat = 'JSON' | 'CSV';
export type Glassnode Currency = 'NATIVE' | 'USD';

/**
 * Make request to Glassnode API
 */
async function makeRequest<T>(
  endpoint: string,
  credentials: GlassnodeCredentials,
  params: Record<string, any> = {}
): Promise<T> {
  const queryParams = new URLSearchParams({
    ...params,
    api_key: credentials.apiKey,
  } as any);
  
  const url = `${GLASSNODE_API.V1}${endpoint}?${queryParams.toString()}`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Glassnode API error: ${response.status} - ${error}`);
  }
  
  return response.json();
}

// =============================================================================
// ADDRESSES
// =============================================================================

/**
 * Get active addresses count
 */
export async function getActiveAddresses(
  credentials: GlassnodeCredentials,
  asset: GlassnodeAsset,
  params?: {
    since?: number;
    until?: number;
    interval?: GlassnodeInterval;
    format?: GlassnodeFormat;
    currency?: GlassNodeCurrency;
  }
): Promise<GlassnodeDataPoint[]> {
  return makeRequest(`/metrics/addresses/active_count`, credentials, { a: asset, ...params });
}

/**
 * Get new addresses count
 */
export async function getNewAddresses(
  credentials: GlassnodeCredentials,
  asset: GlassnodeAsset,
  params?: {
    since?: number;
    until?: number;
    interval?: GlassnodeInterval;
    format?: GlassnodeFormat;
  }
): Promise<GlassnodeDataPoint[]> {
  return makeRequest(`/metrics/addresses/new_non_zero_count`, credentials, { a: asset, ...params });
}

/**
 * Get sending addresses count
 */
export async function getSendingAddresses(
  credentials: GlassnodeCredentials,
  asset: GlassnodeAsset,
  params?: {
    since?: number;
    until?: number;
    interval?: GlassnodeInterval;
    format?: GlassnodeFormat;
  }
): Promise<GlassnodeDataPoint[]> {
  return makeRequest(`/metrics/addresses/sending_count`, credentials, { a: asset, ...params });
}

/**
 * Get receiving addresses count
 */
export async function getReceivingAddresses(
  credentials: GlassnodeCredentials,
  asset: GlassnodeAsset,
  params?: {
    since?: number;
    until?: number;
    interval?: GlassnodeInterval;
    format?: GlassnodeFormat;
  }
): Promise<GlassnodeDataPoint[]> {
  return makeRequest(`/metrics/addresses/receiving_count`, credentials, { a: asset, ...params });
}

/**
 * Get addresses with balance > 0
 */
export async function getAddressesWithBalance(
  credentials: GlassnodeCredentials,
  asset: GlassnodeAsset,
  params?: {
    since?: number;
    until?: number;
    interval?: GlassnodeInterval;
    format?: GlassnodeFormat;
  }
): Promise<GlassnodeDataPoint[]> {
  return makeRequest(`/metrics/addresses/non_zero_count`, credentials, { a: asset, ...params });
}

// =============================================================================
// MARKET INDICATORS
// =============================================================================

/**
 * Get MVRV ratio
 */
export async function getMVRV(
  credentials: GlassnodeCredentials,
  asset: GlassnodeAsset,
  params?: {
    since?: number;
    until?: number;
    interval?: GlassnodeInterval;
    format?: GlassnodeFormat;
  }
): Promise<GlassnodeDataPoint[]> {
  return makeRequest(`/metrics/market/mvrv`, credentials, { a: asset, ...params });
}

/**
 * Get NVT ratio
 */
export async function getNVT(
  credentials: GlassnodeCredentials,
  asset: GlassnodeAsset,
  params?: {
    since?: number;
    until?: number;
    interval?: GlassnodeInterval;
    format?: GlassnodeFormat;
  }
): Promise<GlassnodeDataPoint[]> {
  return makeRequest(`/metrics/market/nvt`, credentials, { a: asset, ...params });
}

/**
 * Get realized cap
 */
export async function getRealizedCap(
  credentials: GlassnodeCredentials,
  asset: GlassnodeAsset,
  params?: {
    since?: number;
    until?: number;
    interval?: GlassnodeInterval;
    format?: GlassnodeFormat;
    currency?: GlassnodeCurrency;
  }
): Promise<GlassnodeDataPoint[]> {
  return makeRequest(`/metrics/market/marketcap_realized_usd`, credentials, { a: asset, ...params });
}

/**
 * Get market cap
 */
export async function getMarketCap(
  credentials: GlassnodeCredentials,
  asset: GlassnodeAsset,
  params?: {
    since?: number;
    until?: number;
    interval?: GlassnodeInterval;
    format?: GlassnodeFormat;
    currency?: GlassnodeCurrency;
  }
): Promise<GlassnodeDataPoint[]> {
  return makeRequest(`/metrics/market/marketcap_usd`, credentials, { a: asset, ...params });
}

/**
 * Get price
 */
export async function getPrice(
  credentials: GlassnodeCredentials,
  asset: GlassnodeAsset,
  params?: {
    since?: number;
    until?: number;
    interval?: GlassnodeInterval;
    format?: GlassnodeFormat;
    currency?: GlassnodeCurrency;
  }
): Promise<GlassnodeDataPoint[]> {
  return makeRequest(`/metrics/market/price_usd_close`, credentials, { a: asset, ...params });
}

// =============================================================================
// MINING
// =============================================================================

/**
 * Get hash rate
 */
export async function getHashRate(
  credentials: GlassnodeCredentials,
  asset: GlassnodeAsset,
  params?: {
    since?: number;
    until?: number;
    interval?: GlassnodeInterval;
    format?: GlassnodeFormat;
  }
): Promise<GlassnodeDataPoint[]> {
  return makeRequest(`/metrics/mining/hash_rate_mean`, credentials, { a: asset, ...params });
}

/**
 * Get mining difficulty
 */
export async function getDifficulty(
  credentials: GlassnodeCredentials,
  asset: GlassnodeAsset,
  params?: {
    since?: number;
    until?: number;
    interval?: GlassnodeInterval;
    format?: GlassnodeFormat;
  }
): Promise<GlassnodeDataPoint[]> {
  return makeRequest(`/metrics/mining/difficulty_latest`, credentials, { a: asset, ...params });
}

/**
 * Get miner revenue
 */
export async function getMinerRevenue(
  credentials: GlassnodeCredentials,
  asset: GlassnodeAsset,
  params?: {
    since?: number;
    until?: number;
    interval?: GlassnodeInterval;
    format?: GlassnodeFormat;
    currency?: GlassnodeCurrency;
  }
): Promise<GlassnodeDataPoint[]> {
  return makeRequest(`/metrics/mining/revenue_sum`, credentials, { a: asset, ...params });
}

/**
 * Get Puell Multiple
 */
export async function getPuellMultiple(
  credentials: GlassnodeCredentials,
  asset: GlassnodeAsset,
  params?: {
    since?: number;
    until?: number;
    interval?: GlassnodeInterval;
    format?: GlassnodeFormat;
  }
): Promise<GlassnodeDataPoint[]> {
  return makeRequest(`/metrics/indicators/puell_multiple`, credentials, { a: asset, ...params });
}

// =============================================================================
// TRANSACTIONS
// =============================================================================

/**
 * Get transaction count
 */
export async function getTransactionCount(
  credentials: GlassnodeCredentials,
  asset: GlassnodeAsset,
  params?: {
    since?: number;
    until?: number;
    interval?: GlassnodeInterval;
    format?: GlassnodeFormat;
  }
): Promise<GlassnodeDataPoint[]> {
  return makeRequest(`/metrics/transactions/count`, credentials, { a: asset, ...params });
}

/**
 * Get transaction rate
 */
export async function getTransactionRate(
  credentials: GlassnodeCredentials,
  asset: GlassnodeAsset,
  params?: {
    since?: number;
    until?: number;
    interval?: GlassnodeInterval;
    format?: GlassnodeFormat;
  }
): Promise<GlassnodeDataPoint[]> {
  return makeRequest(`/metrics/transactions/rate`, credentials, { a: asset, ...params });
}

/**
 * Get transaction volume
 */
export async function getTransactionVolume(
  credentials: GlassnodeCredentials,
  asset: GlassnodeAsset,
  params?: {
    since?: number;
    until?: number;
    interval?: GlassnodeInterval;
    format?: GlassnodeFormat;
    currency?: GlassnodeCurrency;
  }
): Promise<GlassnodeDataPoint[]> {
  return makeRequest(`/metrics/transactions/transfers_volume_sum`, credentials, { a: asset, ...params });
}

/**
 * Get mean transaction size
 */
export async function getMeanTransactionSize(
  credentials: GlassnodeCredentials,
  asset: GlassnodeAsset,
  params?: {
    since?: number;
    until?: number;
    interval?: GlassnodeInterval;
    format?: GlassnodeFormat;
    currency?: GlassnodeCurrency;
  }
): Promise<GlassnodeDataPoint[]> {
  return makeRequest(`/metrics/transactions/transfers_volume_mean`, credentials, { a: asset, ...params });
}

// =============================================================================
// SUPPLY
// =============================================================================

/**
 * Get current supply
 */
export async function getCurrentSupply(
  credentials: GlassnodeCredentials,
  asset: GlassnodeAsset,
  params?: {
    since?: number;
    until?: number;
    interval?: GlassnodeInterval;
    format?: GlassnodeFormat;
  }
): Promise<GlassnodeDataPoint[]> {
  return makeRequest(`/metrics/supply/current`, credentials, { a: asset, ...params });
}

/**
 * Get circulating supply
 */
export async function getCirculatingSupply(
  credentials: GlassnodeCredentials,
  asset: GlassnodeAsset,
  params?: {
    since?: number;
    until?: number;
    interval?: GlassnodeInterval;
    format?: GlassnodeFormat;
  }
): Promise<GlassnodeDataPoint[]> {
  return makeRequest(`/metrics/supply/circulating`, credentials, { a: asset, ...params });
}

/**
 * Get supply held by addresses with balance > 1k
 */
export async function getSupplyWhales(
  credentials: GlassnodeCredentials,
  asset: GlassnodeAsset,
  params?: {
    since?: number;
    until?: number;
    interval?: GlassnodeInterval;
    format?: GlassnodeFormat;
  }
): Promise<GlassnodeDataPoint[]> {
  return makeRequest(`/metrics/distribution/balance_1k_10k`, credentials, { a: asset, ...params });
}

// =============================================================================
// EXCHANGE FLOWS
// =============================================================================

/**
 * Get exchange inflow
 */
export async function getExchangeInflow(
  credentials: GlassnodeCredentials,
  asset: GlassnodeAsset,
  params?: {
    since?: number;
    until?: number;
    interval?: GlassnodeInterval;
    format?: GlassnodeFormat;
    currency?: GlassnodeCurrency;
  }
): Promise<GlassnodeDataPoint[]> {
  return makeRequest(`/metrics/transactions/transfers_volume_to_exchanges_sum`, credentials, { a: asset, ...params });
}

/**
 * Get exchange outflow
 */
export async function getExchangeOutflow(
  credentials: GlassnodeCredentials,
  asset: GlassnodeAsset,
  params?: {
    since?: number;
    until?: number;
    interval?: GlassnodeInterval;
    format?: GlassnodeFormat;
    currency?: GlassnodeCurrency;
  }
): Promise<GlassnodeDataPoint[]> {
  return makeRequest(`/metrics/transactions/transfers_volume_from_exchanges_sum`, credentials, { a: asset, ...params });
}

/**
 * Get exchange net flow
 */
export async function getExchangeNetFlow(
  credentials: GlassnodeCredentials,
  asset: GlassnodeAsset,
  params?: {
    since?: number;
    until?: number;
    interval?: GlassnodeInterval;
    format?: GlassnodeFormat;
    currency?: GlassnodeCurrency;
  }
): Promise<GlassnodeDataPoint[]> {
  return makeRequest(`/metrics/transactions/transfers_volume_exchanges_net`, credentials, { a: asset, ...params });
}

/**
 * Get exchange balance
 */
export async function getExchangeBalance(
  credentials: GlassnodeCredentials,
  asset: GlassnodeAsset,
  params?: {
    since?: number;
    until?: number;
    interval?: GlassnodeInterval;
    format?: GlassnodeFormat;
  }
): Promise<GlassnodeDataPoint[]> {
  return makeRequest(`/metrics/distribution/balance_exchanges`, credentials, { a: asset, ...params });
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Test API connection and credentials
 */
export async function testConnection(credentials: GlassnodeCredentials): Promise<boolean> {
  try {
    await getPrice(credentials, 'BTC', { since: Math.floor(Date.now() / 1000) - 86400 });
    return true;
  } catch (error) {
    return false;
  }
}

export default {
  getActiveAddresses,
  getNewAddresses,
  getSendingAddresses,
  getReceivingAddresses,
  getAddressesWithBalance,
  getMVRV,
  getNVT,
  getRealizedCap,
  getMarketCap,
  getPrice,
  getHashRate,
  getDifficulty,
  getMinerRevenue,
  getPuellMultiple,
  getTransactionCount,
  getTransactionRate,
  getTransactionVolume,
  getMeanTransactionSize,
  getCurrentSupply,
  getCirculatingSupply,
  getSupplyWhales,
  getExchangeInflow,
  getExchangeOutflow,
  getExchangeNetFlow,
  getExchangeBalance,
  testConnection,
};
