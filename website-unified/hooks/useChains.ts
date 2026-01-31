/**
 * useChains Hook
 * 
 * React hook for accessing chain configurations, utilities, and network data.
 * Connects to packages/core for chain definitions and provides chain switching utilities.
 * 
 * @author Nich (@nichxbt)
 * @license Apache-2.0
 */

'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useCallback, useState } from 'react';

// ============================================================================
// Types
// ============================================================================

export type SupportedChainId = 
  | 'eip155:1'      // Ethereum Mainnet
  | 'eip155:42161'  // Arbitrum One
  | 'eip155:8453'   // Base
  | 'eip155:84532'  // Base Sepolia (testnet)
  | 'eip155:137'    // Polygon
  | 'eip155:10'     // Optimism
  | 'eip155:56';    // BNB Chain

export interface Chain {
  id: SupportedChainId;
  numericId: number;
  name: string;
  shortName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrl: string;
  explorerUrl: string;
  iconUrl?: string;
  isTestnet: boolean;
  isL2: boolean;
  parentChain?: SupportedChainId;
  avgBlockTime: number; // in seconds
  gasTokenAddress?: string; // For L2s with different gas tokens
}

export interface ChainStatus {
  chainId: SupportedChainId;
  isHealthy: boolean;
  latency: number; // ms
  blockNumber: number;
  gasPrice: string; // in gwei
  lastChecked: number;
}

export interface ChainGasPrice {
  chainId: SupportedChainId;
  slow: { price: string; time: number };
  standard: { price: string; time: number };
  fast: { price: string; time: number };
  baseFee?: string;
  priorityFee?: string;
}

export interface UseChainsOptions {
  enabled?: boolean;
  includeTestnets?: boolean;
  refetchInterval?: number | false;
}

export interface UseChainsReturn {
  // Chain data
  chains: Chain[];
  loading: boolean;
  error: Error | null;
  
  // Single chain access
  getChain: (id: SupportedChainId) => Chain | undefined;
  getChainByNumericId: (numericId: number) => Chain | undefined;
  
  // Chain utilities
  isSupported: (id: string) => boolean;
  getExplorerUrl: (chainId: SupportedChainId, type: 'tx' | 'address' | 'token', hash: string) => string;
  getRpcUrl: (chainId: SupportedChainId) => string;
  
  // Filtering
  getMainnets: () => Chain[];
  getTestnets: () => Chain[];
  getL2Chains: () => Chain[];
  
  // Refetch
  refetch: () => Promise<void>;
}

export interface UseChainStatusReturn {
  status: Map<SupportedChainId, ChainStatus>;
  loading: boolean;
  error: Error | null;
  getStatus: (chainId: SupportedChainId) => ChainStatus | undefined;
  isHealthy: (chainId: SupportedChainId) => boolean;
  refetch: () => Promise<void>;
}

export interface UseChainGasReturn {
  gasPrice: ChainGasPrice | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  getEstimatedCost: (gasLimit: number, speed?: 'slow' | 'standard' | 'fast') => string;
}

// ============================================================================
// Chain Configurations
// ============================================================================

export const CHAINS: Record<SupportedChainId, Chain> = {
  'eip155:1': {
    id: 'eip155:1',
    numericId: 1,
    name: 'Ethereum',
    shortName: 'ETH',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrl: 'https://eth.llamarpc.com',
    explorerUrl: 'https://etherscan.io',
    iconUrl: '/icons/chains/ethereum.svg',
    isTestnet: false,
    isL2: false,
    avgBlockTime: 12,
  },
  'eip155:42161': {
    id: 'eip155:42161',
    numericId: 42161,
    name: 'Arbitrum One',
    shortName: 'ARB',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    explorerUrl: 'https://arbiscan.io',
    iconUrl: '/icons/chains/arbitrum.svg',
    isTestnet: false,
    isL2: true,
    parentChain: 'eip155:1',
    avgBlockTime: 0.25,
  },
  'eip155:8453': {
    id: 'eip155:8453',
    numericId: 8453,
    name: 'Base',
    shortName: 'BASE',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrl: 'https://mainnet.base.org',
    explorerUrl: 'https://basescan.org',
    iconUrl: '/icons/chains/base.svg',
    isTestnet: false,
    isL2: true,
    parentChain: 'eip155:1',
    avgBlockTime: 2,
  },
  'eip155:84532': {
    id: 'eip155:84532',
    numericId: 84532,
    name: 'Base Sepolia',
    shortName: 'BASE-SEP',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrl: 'https://sepolia.base.org',
    explorerUrl: 'https://sepolia.basescan.org',
    iconUrl: '/icons/chains/base.svg',
    isTestnet: true,
    isL2: true,
    parentChain: 'eip155:1',
    avgBlockTime: 2,
  },
  'eip155:137': {
    id: 'eip155:137',
    numericId: 137,
    name: 'Polygon',
    shortName: 'MATIC',
    nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
    rpcUrl: 'https://polygon-rpc.com',
    explorerUrl: 'https://polygonscan.com',
    iconUrl: '/icons/chains/polygon.svg',
    isTestnet: false,
    isL2: true,
    parentChain: 'eip155:1',
    avgBlockTime: 2,
  },
  'eip155:10': {
    id: 'eip155:10',
    numericId: 10,
    name: 'Optimism',
    shortName: 'OP',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrl: 'https://mainnet.optimism.io',
    explorerUrl: 'https://optimistic.etherscan.io',
    iconUrl: '/icons/chains/optimism.svg',
    isTestnet: false,
    isL2: true,
    parentChain: 'eip155:1',
    avgBlockTime: 2,
  },
  'eip155:56': {
    id: 'eip155:56',
    numericId: 56,
    name: 'BNB Chain',
    shortName: 'BNB',
    nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
    rpcUrl: 'https://bsc-dataseed.binance.org',
    explorerUrl: 'https://bscscan.com',
    iconUrl: '/icons/chains/bnb.svg',
    isTestnet: false,
    isL2: false,
    avgBlockTime: 3,
  },
};

// ============================================================================
// Mock Data (Development Fallback)
// ============================================================================

function generateMockChainStatus(): Map<SupportedChainId, ChainStatus> {
  const statusMap = new Map<SupportedChainId, ChainStatus>();
  
  Object.keys(CHAINS).forEach(chainId => {
    const id = chainId as SupportedChainId;
    statusMap.set(id, {
      chainId: id,
      isHealthy: Math.random() > 0.1, // 90% healthy
      latency: Math.floor(50 + Math.random() * 200),
      blockNumber: Math.floor(18000000 + Math.random() * 1000000),
      gasPrice: (5 + Math.random() * 50).toFixed(2),
      lastChecked: Date.now(),
    });
  });
  
  return statusMap;
}

function generateMockGasPrice(chainId: SupportedChainId): ChainGasPrice {
  const baseGas = chainId === 'eip155:1' ? 30 : 0.1; // ETH mainnet vs L2s
  
  return {
    chainId,
    slow: {
      price: (baseGas * 0.8).toFixed(2),
      time: 120,
    },
    standard: {
      price: baseGas.toFixed(2),
      time: 30,
    },
    fast: {
      price: (baseGas * 1.5).toFixed(2),
      time: 15,
    },
    baseFee: (baseGas * 0.9).toFixed(2),
    priorityFee: (baseGas * 0.1).toFixed(2),
  };
}

// ============================================================================
// API Functions
// ============================================================================

async function fetchChainStatus(): Promise<Map<SupportedChainId, ChainStatus>> {
  if (process.env.NODE_ENV === 'development' || !process.env.NEXT_PUBLIC_CHAIN_API_URL) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return generateMockChainStatus();
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_CHAIN_API_URL}/status`);
    if (!response.ok) throw new Error('Failed to fetch chain status');
    const data = await response.json() as ChainStatus[];
    
    const statusMap = new Map<SupportedChainId, ChainStatus>();
    data.forEach(status => statusMap.set(status.chainId, status));
    return statusMap;
  } catch (error) {
    console.warn('Chain status API failed, using mock data');
    return generateMockChainStatus();
  }
}

async function fetchGasPrice(chainId: SupportedChainId): Promise<ChainGasPrice> {
  if (process.env.NODE_ENV === 'development' || !process.env.NEXT_PUBLIC_CHAIN_API_URL) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return generateMockGasPrice(chainId);
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_CHAIN_API_URL}/gas/${chainId}`
    );
    if (!response.ok) throw new Error('Failed to fetch gas price');
    return await response.json();
  } catch (error) {
    console.warn('Gas price API failed, using mock data');
    return generateMockGasPrice(chainId);
  }
}

// ============================================================================
// Hook: useChains
// ============================================================================

export function useChains(options: UseChainsOptions = {}): UseChainsReturn {
  const {
    enabled = true,
    includeTestnets = false,
  } = options;

  const queryClient = useQueryClient();

  // Use static chain data (no API needed for chain configs)
  const chains = useMemo(() => {
    let chainList = Object.values(CHAINS);
    if (!includeTestnets) {
      chainList = chainList.filter(c => !c.isTestnet);
    }
    return chainList;
  }, [includeTestnets]);

  const getChain = useCallback(
    (id: SupportedChainId) => CHAINS[id],
    []
  );

  const getChainByNumericId = useCallback(
    (numericId: number) => Object.values(CHAINS).find(c => c.numericId === numericId),
    []
  );

  const isSupported = useCallback(
    (id: string) => id in CHAINS,
    []
  );

  const getExplorerUrl = useCallback(
    (chainId: SupportedChainId, type: 'tx' | 'address' | 'token', hash: string) => {
      const chain = CHAINS[chainId];
      if (!chain) return '';
      
      const pathMap = {
        tx: 'tx',
        address: 'address',
        token: 'token',
      };
      
      return `${chain.explorerUrl}/${pathMap[type]}/${hash}`;
    },
    []
  );

  const getRpcUrl = useCallback(
    (chainId: SupportedChainId) => CHAINS[chainId]?.rpcUrl ?? '',
    []
  );

  const getMainnets = useCallback(
    () => chains.filter(c => !c.isTestnet),
    [chains]
  );

  const getTestnets = useCallback(
    () => Object.values(CHAINS).filter(c => c.isTestnet),
    []
  );

  const getL2Chains = useCallback(
    () => chains.filter(c => c.isL2),
    [chains]
  );

  const refetch = useCallback(async () => {
    // No actual refetch needed for static chain data
    // But can be used to invalidate related queries
    await queryClient.invalidateQueries({ queryKey: ['chain-status'] });
  }, [queryClient]);

  return {
    chains,
    loading: false, // Static data, never loading
    error: null,
    getChain,
    getChainByNumericId,
    isSupported,
    getExplorerUrl,
    getRpcUrl,
    getMainnets,
    getTestnets,
    getL2Chains,
    refetch,
  };
}

// ============================================================================
// Hook: useChainStatus
// ============================================================================

export function useChainStatus(
  options: { enabled?: boolean; refetchInterval?: number } = {}
): UseChainStatusReturn {
  const { enabled = true, refetchInterval = 30000 } = options;
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['chain-status'],
    queryFn: fetchChainStatus,
    enabled,
    refetchInterval,
    staleTime: 10000,
  });

  const status = query.data ?? new Map();

  const getStatus = useCallback(
    (chainId: SupportedChainId) => status.get(chainId),
    [status]
  );

  const isHealthy = useCallback(
    (chainId: SupportedChainId) => status.get(chainId)?.isHealthy ?? false,
    [status]
  );

  const refetch = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ['chain-status'] });
  }, [queryClient]);

  return {
    status,
    loading: query.isLoading,
    error: query.error as Error | null,
    getStatus,
    isHealthy,
    refetch,
  };
}

// ============================================================================
// Hook: useChainGas
// ============================================================================

export function useChainGas(
  chainId: SupportedChainId,
  options: { enabled?: boolean; refetchInterval?: number } = {}
): UseChainGasReturn {
  const { enabled = true, refetchInterval = 15000 } = options;
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['chain-gas', chainId],
    queryFn: () => fetchGasPrice(chainId),
    enabled: enabled && !!chainId,
    refetchInterval,
    staleTime: 5000,
  });

  const gasPrice = query.data ?? null;

  const getEstimatedCost = useCallback(
    (gasLimit: number, speed: 'slow' | 'standard' | 'fast' = 'standard') => {
      if (!gasPrice) return '0';
      
      const priceGwei = parseFloat(gasPrice[speed].price);
      const costWei = BigInt(Math.floor(priceGwei * 1e9)) * BigInt(gasLimit);
      const costEth = Number(costWei) / 1e18;
      
      return costEth.toFixed(6);
    },
    [gasPrice]
  );

  const refetch = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ['chain-gas', chainId] });
  }, [queryClient, chainId]);

  return {
    gasPrice,
    loading: query.isLoading,
    error: query.error as Error | null,
    refetch,
    getEstimatedCost,
  };
}

// ============================================================================
// Hook: useCurrentChain (for wallet integration)
// ============================================================================

export function useCurrentChain() {
  const [currentChainId, setCurrentChainId] = useState<SupportedChainId>('eip155:1');
  const { getChain, isSupported } = useChains();

  const chain = useMemo(() => getChain(currentChainId), [currentChainId, getChain]);

  const switchChain = useCallback(
    async (chainId: SupportedChainId) => {
      if (!isSupported(chainId)) {
        throw new Error(`Chain ${chainId} is not supported`);
      }
      
      // In a real implementation, this would call wallet.switchChain()
      setCurrentChainId(chainId);
      
      // Simulate wallet switch
      await new Promise(resolve => setTimeout(resolve, 100));
    },
    [isSupported]
  );

  return {
    chain,
    chainId: currentChainId,
    switchChain,
    isSupported,
  };
}

// ============================================================================
// Utility Functions (exported for direct use)
// ============================================================================

export function getChainName(chainId: SupportedChainId): string {
  return CHAINS[chainId]?.name ?? 'Unknown Chain';
}

export function getChainIcon(chainId: SupportedChainId): string | undefined {
  return CHAINS[chainId]?.iconUrl;
}

export function parseChainId(caip2Id: string): number | undefined {
  const match = caip2Id.match(/^eip155:(\d+)$/);
  return match ? parseInt(match[1], 10) : undefined;
}

export function formatChainId(numericId: number): SupportedChainId | undefined {
  const chainId = `eip155:${numericId}` as SupportedChainId;
  return chainId in CHAINS ? chainId : undefined;
}

export function getTxExplorerUrl(chainId: SupportedChainId, txHash: string): string {
  const chain = CHAINS[chainId];
  return chain ? `${chain.explorerUrl}/tx/${txHash}` : '';
}

export function getAddressExplorerUrl(chainId: SupportedChainId, address: string): string {
  const chain = CHAINS[chainId];
  return chain ? `${chain.explorerUrl}/address/${address}` : '';
}

// ============================================================================
// Default Export
// ============================================================================

export default useChains;
