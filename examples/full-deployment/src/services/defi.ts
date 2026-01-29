/**
 * DeFi Service
 * 
 * Real implementations for DeFi analytics using DefiLlama API.
 * Provides TVL, yields, protocol data, and more.
 * 
 * @author Universal Crypto MCP
 * @license Apache-2.0
 */

// Simple in-memory cache
const cache = new Map<string, { data: any; expires: number }>();
const CACHE_TTL = 60000; // 1 minute

function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (entry && Date.now() < entry.expires) {
    return entry.data as T;
  }
  cache.delete(key);
  return null;
}

function setCache(key: string, data: any): void {
  cache.set(key, { data, expires: Date.now() + CACHE_TTL });
}

export interface Protocol {
  id: string;
  name: string;
  symbol: string;
  chain: string;
  chains: string[];
  tvl: number;
  tvlFormatted: string;
  change24h: number;
  change7d: number;
  category: string;
  url: string;
  logo: string;
}

export interface YieldPool {
  pool: string;
  chain: string;
  project: string;
  symbol: string;
  tvlUsd: number;
  apy: number;
  apyBase: number;
  apyReward: number;
  rewardTokens: string[];
  stablecoin: boolean;
  ilRisk: string;
  exposure: string;
}

export interface ChainTVL {
  chain: string;
  tvl: number;
  tvlFormatted: string;
  change24h: number;
  protocols: number;
}

/**
 * Get top DeFi protocols by TVL
 */
export async function getTopProtocols(limit: number = 20): Promise<Protocol[]> {
  const cacheKey = `protocols:top:${limit}`;
  
  const cached = getCached<Protocol[]>(cacheKey);
  if (cached) return cached;
  
  const response = await fetch("https://api.llama.fi/protocols");
  
  if (!response.ok) {
    throw new Error(`DefiLlama API error: ${response.status}`);
  }
  
  const data = await response.json();
  
  const formatTVL = (tvl: number): string => {
    if (tvl >= 1e9) return `$${(tvl / 1e9).toFixed(2)}B`;
    if (tvl >= 1e6) return `$${(tvl / 1e6).toFixed(2)}M`;
    if (tvl >= 1e3) return `$${(tvl / 1e3).toFixed(2)}K`;
    return `$${tvl.toFixed(2)}`;
  };
  
  const protocols: Protocol[] = data
    .slice(0, limit)
    .map((p: any) => ({
      id: p.slug,
      name: p.name,
      symbol: p.symbol || "",
      chain: p.chain || "Multi-chain",
      chains: p.chains || [],
      tvl: p.tvl || 0,
      tvlFormatted: formatTVL(p.tvl || 0),
      change24h: p.change_1d || 0,
      change7d: p.change_7d || 0,
      category: p.category || "Unknown",
      url: p.url || "",
      logo: p.logo || "",
    }));
  
  setCache(cacheKey, protocols);
  return protocols;
}

/**
 * Get protocol details
 */
export async function getProtocol(slug: string): Promise<{
  name: string;
  description: string;
  tvl: number;
  tvlFormatted: string;
  chains: string[];
  chainTvls: Record<string, number>;
  change24h: number;
  change7d: number;
  category: string;
  audits: string[];
  twitter: string;
  url: string;
}> {
  const cacheKey = `protocol:${slug}`;
  
  const cached = getCached<any>(cacheKey);
  if (cached) return cached;
  
  const response = await fetch(`https://api.llama.fi/protocol/${slug}`);
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Protocol "${slug}" not found`);
    }
    throw new Error(`DefiLlama API error: ${response.status}`);
  }
  
  const data = await response.json();
  
  const formatTVL = (tvl: number): string => {
    if (tvl >= 1e9) return `$${(tvl / 1e9).toFixed(2)}B`;
    if (tvl >= 1e6) return `$${(tvl / 1e6).toFixed(2)}M`;
    return `$${tvl.toFixed(2)}`;
  };
  
  const result = {
    name: data.name,
    description: data.description || "",
    tvl: data.tvl || 0,
    tvlFormatted: formatTVL(data.tvl || 0),
    chains: data.chains || [],
    chainTvls: data.chainTvls || {},
    change24h: data.change_1d || 0,
    change7d: data.change_7d || 0,
    category: data.category || "Unknown",
    audits: data.audits || [],
    twitter: data.twitter || "",
    url: data.url || "",
  };
  
  setCache(cacheKey, result);
  return result;
}

/**
 * Get best yield opportunities
 */
export async function getBestYields(options: {
  chain?: string;
  stablecoinOnly?: boolean;
  minTvl?: number;
  limit?: number;
}): Promise<YieldPool[]> {
  const { chain, stablecoinOnly = false, minTvl = 100000, limit = 20 } = options;
  const cacheKey = `yields:${chain || "all"}:${stablecoinOnly}:${minTvl}:${limit}`;
  
  const cached = getCached<YieldPool[]>(cacheKey);
  if (cached) return cached;
  
  const response = await fetch("https://yields.llama.fi/pools");
  
  if (!response.ok) {
    throw new Error(`DefiLlama Yields API error: ${response.status}`);
  }
  
  const { data } = await response.json();
  
  let pools: YieldPool[] = data
    .filter((p: any) => {
      if (p.tvlUsd < minTvl) return false;
      if (chain && p.chain.toLowerCase() !== chain.toLowerCase()) return false;
      if (stablecoinOnly && !p.stablecoin) return false;
      return true;
    })
    .sort((a: any, b: any) => b.apy - a.apy)
    .slice(0, limit)
    .map((p: any) => ({
      pool: p.pool,
      chain: p.chain,
      project: p.project,
      symbol: p.symbol,
      tvlUsd: p.tvlUsd,
      apy: p.apy,
      apyBase: p.apyBase || 0,
      apyReward: p.apyReward || 0,
      rewardTokens: p.rewardTokens || [],
      stablecoin: p.stablecoin || false,
      ilRisk: p.ilRisk || "unknown",
      exposure: p.exposure || "single",
    }));
  
  setCache(cacheKey, pools);
  return pools;
}

/**
 * Get TVL by chain
 */
export async function getChainTVLs(): Promise<ChainTVL[]> {
  const cacheKey = "chains:tvl";
  
  const cached = getCached<ChainTVL[]>(cacheKey);
  if (cached) return cached;
  
  const response = await fetch("https://api.llama.fi/v2/chains");
  
  if (!response.ok) {
    throw new Error(`DefiLlama API error: ${response.status}`);
  }
  
  const data = await response.json();
  
  const formatTVL = (tvl: number): string => {
    if (tvl >= 1e9) return `$${(tvl / 1e9).toFixed(2)}B`;
    if (tvl >= 1e6) return `$${(tvl / 1e6).toFixed(2)}M`;
    return `$${tvl.toFixed(2)}`;
  };
  
  const chains: ChainTVL[] = data
    .sort((a: any, b: any) => b.tvl - a.tvl)
    .slice(0, 30)
    .map((c: any) => ({
      chain: c.name,
      tvl: c.tvl,
      tvlFormatted: formatTVL(c.tvl),
      change24h: c.change_1d || 0,
      protocols: c.protocols || 0,
    }));
  
  setCache(cacheKey, chains);
  return chains;
}

/**
 * Get stablecoin data
 */
export async function getStablecoins(): Promise<Array<{
  name: string;
  symbol: string;
  pegType: string;
  circulating: number;
  circulatingFormatted: string;
  price: number;
  pegDeviation: number;
  chains: string[];
}>> {
  const cacheKey = "stablecoins";
  
  const cached = getCached<any>(cacheKey);
  if (cached) return cached;
  
  const response = await fetch("https://stablecoins.llama.fi/stablecoins?includePrices=true");
  
  if (!response.ok) {
    throw new Error(`DefiLlama Stablecoins API error: ${response.status}`);
  }
  
  const { peggedAssets } = await response.json();
  
  const formatCirculating = (val: number): string => {
    if (val >= 1e9) return `$${(val / 1e9).toFixed(2)}B`;
    if (val >= 1e6) return `$${(val / 1e6).toFixed(2)}M`;
    return `$${val.toFixed(2)}`;
  };
  
  const result = peggedAssets
    .slice(0, 20)
    .map((s: any) => ({
      name: s.name,
      symbol: s.symbol,
      pegType: s.pegType,
      circulating: s.circulating?.peggedUSD || 0,
      circulatingFormatted: formatCirculating(s.circulating?.peggedUSD || 0),
      price: s.price || 1,
      pegDeviation: s.price ? Math.abs(1 - s.price) * 100 : 0,
      chains: s.chains || [],
    }));
  
  setCache(cacheKey, result);
  return result;
}

/**
 * Get DEX volume
 */
export async function getDexVolume(chain?: string): Promise<{
  total24h: number;
  total24hFormatted: string;
  change24h: number;
  topDexes: Array<{
    name: string;
    volume24h: number;
    volume24hFormatted: string;
    change24h: number;
  }>;
}> {
  const cacheKey = `dex:volume:${chain || "all"}`;
  
  const cached = getCached<any>(cacheKey);
  if (cached) return cached;
  
  const url = chain
    ? `https://api.llama.fi/overview/dexs/${chain}`
    : "https://api.llama.fi/overview/dexs";
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`DefiLlama DEX API error: ${response.status}`);
  }
  
  const data = await response.json();
  
  const formatVolume = (vol: number): string => {
    if (vol >= 1e9) return `$${(vol / 1e9).toFixed(2)}B`;
    if (vol >= 1e6) return `$${(vol / 1e6).toFixed(2)}M`;
    return `$${vol.toFixed(2)}`;
  };
  
  const result = {
    total24h: data.total24h || 0,
    total24hFormatted: formatVolume(data.total24h || 0),
    change24h: data.change_1d || 0,
    topDexes: (data.protocols || [])
      .slice(0, 10)
      .map((d: any) => ({
        name: d.name,
        volume24h: d.total24h || 0,
        volume24hFormatted: formatVolume(d.total24h || 0),
        change24h: d.change_1d || 0,
      })),
  };
  
  setCache(cacheKey, result);
  return result;
}

/**
 * Get bridge volume
 */
export async function getBridgeVolume(): Promise<{
  total24h: number;
  total24hFormatted: string;
  bridges: Array<{
    name: string;
    volume24h: number;
    volume24hFormatted: string;
    chains: string[];
  }>;
}> {
  const cacheKey = "bridges:volume";
  
  const cached = getCached<any>(cacheKey);
  if (cached) return cached;
  
  const response = await fetch("https://bridges.llama.fi/bridges?includeChains=true");
  
  if (!response.ok) {
    throw new Error(`DefiLlama Bridges API error: ${response.status}`);
  }
  
  const { bridges } = await response.json();
  
  const formatVolume = (vol: number): string => {
    if (vol >= 1e9) return `$${(vol / 1e9).toFixed(2)}B`;
    if (vol >= 1e6) return `$${(vol / 1e6).toFixed(2)}M`;
    return `$${vol.toFixed(2)}`;
  };
  
  const total = bridges.reduce((sum: number, b: any) => sum + (b.lastDailyVolume || 0), 0);
  
  const result = {
    total24h: total,
    total24hFormatted: formatVolume(total),
    bridges: bridges
      .sort((a: any, b: any) => (b.lastDailyVolume || 0) - (a.lastDailyVolume || 0))
      .slice(0, 15)
      .map((b: any) => ({
        name: b.displayName || b.name,
        volume24h: b.lastDailyVolume || 0,
        volume24hFormatted: formatVolume(b.lastDailyVolume || 0),
        chains: b.chains || [],
      })),
  };
  
  setCache(cacheKey, result);
  return result;
}
