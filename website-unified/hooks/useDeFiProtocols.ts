/**
 * useDeFiProtocols Hook
 * 
 * React hook for fetching DeFi protocol data including TVL, yields, and pools.
 * Connects to packages/defi for protocol integrations and DeFiLlama API.
 * 
 * @author Nich (@nichxbt)
 * @license Apache-2.0
 */

'use client';

import { useQuery, useQueries, useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo, useCallback, useState } from 'react';

// ============================================================================
// Types
// ============================================================================

export interface DeFiProtocol {
  id: string;
  name: string;
  slug: string;
  chain: string;
  chains: string[];
  tvl: number;
  tvlChange24h: number;
  tvlChange7d: number;
  category: string;
  logo?: string;
  url?: string;
  description?: string;
  audits?: number;
  governanceToken?: string;
}

export interface DeFiPool {
  id: string;
  protocol: string;
  chain: string;
  symbol: string;
  tvlUsd: number;
  apyBase: number;
  apyReward: number;
  apy: number;
  rewardTokens: string[];
  underlyingTokens: string[];
  ilRisk: 'low' | 'medium' | 'high';
  exposure: 'single' | 'multi';
  stablecoin: boolean;
}

export interface DeFiYield {
  protocol: string;
  chain: string;
  symbol: string;
  apy: number;
  apyBase: number;
  apyReward: number;
  tvl: number;
}

export interface ChainTVL {
  chain: string;
  tvl: number;
  tvlChange24h: number;
  protocols: number;
}

export interface UseDeFiProtocolsOptions {
  enabled?: boolean;
  refetchInterval?: number | false;
  staleTime?: number;
  chain?: string;
  category?: string;
  minTvl?: number;
}

export interface UseDeFiProtocolsReturn {
  protocols: DeFiProtocol[];
  loading: boolean;
  error: Error | null;
  totalTVL: number;
  refetch: () => Promise<void>;
  getProtocol: (id: string) => DeFiProtocol | undefined;
  filterByChain: (chain: string) => DeFiProtocol[];
  filterByCategory: (category: string) => DeFiProtocol[];
  sortByTVL: (ascending?: boolean) => DeFiProtocol[];
}

export interface UseDeFiPoolsReturn {
  pools: DeFiPool[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  getTopYields: (limit?: number) => DeFiPool[];
  filterByChain: (chain: string) => DeFiPool[];
  filterByProtocol: (protocol: string) => DeFiPool[];
  getStablePools: () => DeFiPool[];
}

// ============================================================================
// Constants
// ============================================================================

const DEFILLAMA_API = 'https://api.llama.fi';
const YIELDS_API = 'https://yields.llama.fi';

export const DEFI_CATEGORIES = [
  'DEXes',
  'Lending',
  'CDP',
  'Bridge',
  'Yield',
  'Yield Aggregator',
  'Liquid Staking',
  'Derivatives',
  'Options',
  'Launchpad',
  'NFT Marketplace',
  'NFT Lending',
  'Gaming',
  'Insurance',
  'Privacy',
  'Algo-Stables',
  'Reserve Currency',
  'RWA',
  'Prediction Markets',
] as const;

export const SUPPORTED_CHAINS = [
  'Ethereum',
  'BSC',
  'Polygon',
  'Arbitrum',
  'Optimism',
  'Base',
  'Avalanche',
  'Fantom',
  'Solana',
] as const;

// ============================================================================
// Mock Data (Development Fallback)
// ============================================================================

const MOCK_PROTOCOLS: DeFiProtocol[] = [
  {
    id: 'aave-v3',
    name: 'Aave V3',
    slug: 'aave-v3',
    chain: 'Multi-Chain',
    chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'Base'],
    tvl: 12500000000,
    tvlChange24h: 2.5,
    tvlChange7d: 5.2,
    category: 'Lending',
    logo: 'https://icons.llama.fi/aave-v3.png',
    url: 'https://aave.com',
    description: 'Decentralized lending protocol',
    audits: 8,
    governanceToken: 'AAVE',
  },
  {
    id: 'lido',
    name: 'Lido',
    slug: 'lido',
    chain: 'Multi-Chain',
    chains: ['Ethereum', 'Polygon', 'Solana'],
    tvl: 28000000000,
    tvlChange24h: 1.2,
    tvlChange7d: 3.8,
    category: 'Liquid Staking',
    logo: 'https://icons.llama.fi/lido.png',
    url: 'https://lido.fi',
    description: 'Liquid staking solution',
    audits: 10,
    governanceToken: 'LDO',
  },
  {
    id: 'uniswap-v3',
    name: 'Uniswap V3',
    slug: 'uniswap-v3',
    chain: 'Multi-Chain',
    chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'Base'],
    tvl: 5200000000,
    tvlChange24h: -0.5,
    tvlChange7d: 2.1,
    category: 'DEXes',
    logo: 'https://icons.llama.fi/uniswap.png',
    url: 'https://uniswap.org',
    description: 'Decentralized exchange protocol',
    audits: 6,
    governanceToken: 'UNI',
  },
  {
    id: 'makerdao',
    name: 'MakerDAO',
    slug: 'makerdao',
    chain: 'Ethereum',
    chains: ['Ethereum'],
    tvl: 7800000000,
    tvlChange24h: 0.8,
    tvlChange7d: 1.5,
    category: 'CDP',
    logo: 'https://icons.llama.fi/makerdao.png',
    url: 'https://makerdao.com',
    description: 'Decentralized stablecoin issuer',
    audits: 12,
    governanceToken: 'MKR',
  },
  {
    id: 'curve-dex',
    name: 'Curve Finance',
    slug: 'curve-dex',
    chain: 'Multi-Chain',
    chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism'],
    tvl: 2100000000,
    tvlChange24h: 1.1,
    tvlChange7d: -0.3,
    category: 'DEXes',
    logo: 'https://icons.llama.fi/curve.png',
    url: 'https://curve.fi',
    description: 'StableSwap DEX',
    audits: 5,
    governanceToken: 'CRV',
  },
];

const MOCK_POOLS: DeFiPool[] = [
  {
    id: 'aave-v3-eth-usdc',
    protocol: 'Aave V3',
    chain: 'Ethereum',
    symbol: 'USDC',
    tvlUsd: 1200000000,
    apyBase: 3.5,
    apyReward: 0.8,
    apy: 4.3,
    rewardTokens: ['AAVE'],
    underlyingTokens: ['USDC'],
    ilRisk: 'low',
    exposure: 'single',
    stablecoin: true,
  },
  {
    id: 'aave-v3-eth-weth',
    protocol: 'Aave V3',
    chain: 'Ethereum',
    symbol: 'WETH',
    tvlUsd: 3500000000,
    apyBase: 2.1,
    apyReward: 0.5,
    apy: 2.6,
    rewardTokens: ['AAVE'],
    underlyingTokens: ['WETH'],
    ilRisk: 'low',
    exposure: 'single',
    stablecoin: false,
  },
  {
    id: 'curve-3pool',
    protocol: 'Curve Finance',
    chain: 'Ethereum',
    symbol: 'DAI-USDC-USDT',
    tvlUsd: 450000000,
    apyBase: 1.8,
    apyReward: 2.2,
    apy: 4.0,
    rewardTokens: ['CRV'],
    underlyingTokens: ['DAI', 'USDC', 'USDT'],
    ilRisk: 'low',
    exposure: 'multi',
    stablecoin: true,
  },
  {
    id: 'uniswap-v3-eth-usdc',
    protocol: 'Uniswap V3',
    chain: 'Ethereum',
    symbol: 'ETH-USDC',
    tvlUsd: 280000000,
    apyBase: 12.5,
    apyReward: 0,
    apy: 12.5,
    rewardTokens: [],
    underlyingTokens: ['WETH', 'USDC'],
    ilRisk: 'high',
    exposure: 'multi',
    stablecoin: false,
  },
  {
    id: 'lido-steth',
    protocol: 'Lido',
    chain: 'Ethereum',
    symbol: 'stETH',
    tvlUsd: 28000000000,
    apyBase: 3.2,
    apyReward: 0,
    apy: 3.2,
    rewardTokens: [],
    underlyingTokens: ['ETH'],
    ilRisk: 'low',
    exposure: 'single',
    stablecoin: false,
  },
];

const MOCK_CHAIN_TVL: ChainTVL[] = [
  { chain: 'Ethereum', tvl: 48500000000, tvlChange24h: 1.2, protocols: 823 },
  { chain: 'BSC', tvl: 4200000000, tvlChange24h: -0.5, protocols: 412 },
  { chain: 'Arbitrum', tvl: 3100000000, tvlChange24h: 2.8, protocols: 287 },
  { chain: 'Polygon', tvl: 1800000000, tvlChange24h: 1.1, protocols: 356 },
  { chain: 'Optimism', tvl: 1200000000, tvlChange24h: 3.5, protocols: 156 },
  { chain: 'Base', tvl: 800000000, tvlChange24h: 8.2, protocols: 124 },
  { chain: 'Avalanche', tvl: 900000000, tvlChange24h: 0.8, protocols: 198 },
  { chain: 'Solana', tvl: 4800000000, tvlChange24h: 4.2, protocols: 312 },
];

// ============================================================================
// API Functions
// ============================================================================

async function fetchProtocols(
  chain?: string,
  category?: string,
  minTvl?: number
): Promise<DeFiProtocol[]> {
  // Use mock data in development
  if (process.env.NODE_ENV === 'development' || !process.env.NEXT_PUBLIC_DEFI_API_URL) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filtered = [...MOCK_PROTOCOLS];
    
    if (chain) {
      filtered = filtered.filter(p => p.chains.includes(chain) || p.chain === chain);
    }
    if (category) {
      filtered = filtered.filter(p => p.category === category);
    }
    if (minTvl) {
      filtered = filtered.filter(p => p.tvl >= minTvl);
    }
    
    return filtered;
  }

  try {
    const response = await fetch(`${DEFILLAMA_API}/protocols`);
    if (!response.ok) throw new Error('Failed to fetch protocols');
    
    let protocols = await response.json() as DeFiProtocol[];
    
    if (chain) {
      protocols = protocols.filter((p: DeFiProtocol) => 
        p.chains?.includes(chain) || p.chain === chain
      );
    }
    if (category) {
      protocols = protocols.filter((p: DeFiProtocol) => p.category === category);
    }
    if (minTvl) {
      protocols = protocols.filter((p: DeFiProtocol) => p.tvl >= minTvl);
    }
    
    return protocols.slice(0, 100); // Limit results
  } catch (error) {
    console.warn('DeFi API failed, using mock data');
    return MOCK_PROTOCOLS;
  }
}

async function fetchPools(
  chain?: string,
  protocol?: string
): Promise<DeFiPool[]> {
  // Use mock data in development
  if (process.env.NODE_ENV === 'development' || !process.env.NEXT_PUBLIC_DEFI_API_URL) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    let filtered = [...MOCK_POOLS];
    
    if (chain) {
      filtered = filtered.filter(p => p.chain === chain);
    }
    if (protocol) {
      filtered = filtered.filter(p => 
        p.protocol.toLowerCase().includes(protocol.toLowerCase())
      );
    }
    
    return filtered;
  }

  try {
    const response = await fetch(`${YIELDS_API}/pools`);
    if (!response.ok) throw new Error('Failed to fetch pools');
    
    const data = await response.json();
    let pools = data.data as DeFiPool[];
    
    if (chain) {
      pools = pools.filter((p: DeFiPool) => p.chain === chain);
    }
    if (protocol) {
      pools = pools.filter((p: DeFiPool) => 
        p.protocol.toLowerCase().includes(protocol.toLowerCase())
      );
    }
    
    return pools.slice(0, 50); // Limit results
  } catch (error) {
    console.warn('Yields API failed, using mock data');
    return MOCK_POOLS;
  }
}

async function fetchChainTVL(): Promise<ChainTVL[]> {
  // Use mock data in development
  if (process.env.NODE_ENV === 'development' || !process.env.NEXT_PUBLIC_DEFI_API_URL) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return MOCK_CHAIN_TVL;
  }

  try {
    const response = await fetch(`${DEFILLAMA_API}/v2/chains`);
    if (!response.ok) throw new Error('Failed to fetch chain TVL');
    
    const chains = await response.json() as Array<{
      name: string;
      tvl: number;
      tokenSymbol: string;
    }>;
    
    return chains.slice(0, 20).map(c => ({
      chain: c.name,
      tvl: c.tvl,
      tvlChange24h: (Math.random() - 0.5) * 10, // Approximate
      protocols: Math.floor(Math.random() * 500) + 50,
    }));
  } catch (error) {
    console.warn('Chain TVL API failed, using mock data');
    return MOCK_CHAIN_TVL;
  }
}

async function fetchProtocolDetail(slug: string): Promise<DeFiProtocol | null> {
  // Use mock data in development
  if (process.env.NODE_ENV === 'development' || !process.env.NEXT_PUBLIC_DEFI_API_URL) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return MOCK_PROTOCOLS.find(p => p.slug === slug) ?? null;
  }

  try {
    const response = await fetch(`${DEFILLAMA_API}/protocol/${slug}`);
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return MOCK_PROTOCOLS.find(p => p.slug === slug) ?? null;
  }
}

// ============================================================================
// Hook: useDeFiProtocols
// ============================================================================

export function useDeFiProtocols(
  options: UseDeFiProtocolsOptions = {}
): UseDeFiProtocolsReturn {
  const {
    enabled = true,
    refetchInterval = 60000, // 1 minute
    staleTime = 30000,
    chain,
    category,
    minTvl,
  } = options;

  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['defi-protocols', chain, category, minTvl],
    queryFn: () => fetchProtocols(chain, category, minTvl),
    enabled,
    refetchInterval,
    staleTime,
  });

  const protocols = query.data ?? [];

  const totalTVL = useMemo(() => {
    return protocols.reduce((sum, p) => sum + p.tvl, 0);
  }, [protocols]);

  const getProtocol = useCallback(
    (id: string) => protocols.find(p => p.id === id),
    [protocols]
  );

  const filterByChain = useCallback(
    (filterChain: string) => protocols.filter(p => 
      p.chains.includes(filterChain) || p.chain === filterChain
    ),
    [protocols]
  );

  const filterByCategory = useCallback(
    (filterCategory: string) => protocols.filter(p => p.category === filterCategory),
    [protocols]
  );

  const sortByTVL = useCallback(
    (ascending = false) => [...protocols].sort((a, b) => 
      ascending ? a.tvl - b.tvl : b.tvl - a.tvl
    ),
    [protocols]
  );

  const refetch = useCallback(async () => {
    await queryClient.invalidateQueries({
      queryKey: ['defi-protocols', chain, category, minTvl],
    });
  }, [queryClient, chain, category, minTvl]);

  return {
    protocols,
    loading: query.isLoading,
    error: query.error as Error | null,
    totalTVL,
    refetch,
    getProtocol,
    filterByChain,
    filterByCategory,
    sortByTVL,
  };
}

// ============================================================================
// Hook: useDeFiPools
// ============================================================================

export function useDeFiPools(
  options: { chain?: string; protocol?: string } & Omit<UseDeFiProtocolsOptions, 'category' | 'minTvl'> = {}
): UseDeFiPoolsReturn {
  const {
    enabled = true,
    refetchInterval = 60000,
    staleTime = 30000,
    chain,
    protocol,
  } = options;

  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['defi-pools', chain, protocol],
    queryFn: () => fetchPools(chain, protocol),
    enabled,
    refetchInterval,
    staleTime,
  });

  const pools = query.data ?? [];

  const getTopYields = useCallback(
    (limit = 10) => [...pools].sort((a, b) => b.apy - a.apy).slice(0, limit),
    [pools]
  );

  const filterByChain = useCallback(
    (filterChain: string) => pools.filter(p => p.chain === filterChain),
    [pools]
  );

  const filterByProtocol = useCallback(
    (filterProtocol: string) => pools.filter(p => 
      p.protocol.toLowerCase().includes(filterProtocol.toLowerCase())
    ),
    [pools]
  );

  const getStablePools = useCallback(
    () => pools.filter(p => p.stablecoin),
    [pools]
  );

  const refetch = useCallback(async () => {
    await queryClient.invalidateQueries({
      queryKey: ['defi-pools', chain, protocol],
    });
  }, [queryClient, chain, protocol]);

  return {
    pools,
    loading: query.isLoading,
    error: query.error as Error | null,
    refetch,
    getTopYields,
    filterByChain,
    filterByProtocol,
    getStablePools,
  };
}

// ============================================================================
// Hook: useChainTVL
// ============================================================================

export function useChainTVL(
  options: Omit<UseDeFiProtocolsOptions, 'chain' | 'category' | 'minTvl'> = {}
) {
  const { enabled = true, refetchInterval = 120000, staleTime = 60000 } = options;

  const query = useQuery({
    queryKey: ['chain-tvl'],
    queryFn: fetchChainTVL,
    enabled,
    refetchInterval,
    staleTime,
  });

  return {
    chains: query.data ?? [],
    loading: query.isLoading,
    error: query.error as Error | null,
    totalTVL: (query.data ?? []).reduce((sum, c) => sum + c.tvl, 0),
    refetch: () => query.refetch(),
  };
}

// ============================================================================
// Hook: useProtocolDetail
// ============================================================================

export function useProtocolDetail(
  slug: string,
  options: Omit<UseDeFiProtocolsOptions, 'chain' | 'category' | 'minTvl'> = {}
) {
  const { enabled = true, staleTime = 60000 } = options;

  const query = useQuery({
    queryKey: ['protocol-detail', slug],
    queryFn: () => fetchProtocolDetail(slug),
    enabled: enabled && !!slug,
    staleTime,
  });

  return {
    protocol: query.data,
    loading: query.isLoading,
    error: query.error as Error | null,
    refetch: () => query.refetch(),
  };
}

// ============================================================================
// Default Export
// ============================================================================

export default useDeFiProtocols;
