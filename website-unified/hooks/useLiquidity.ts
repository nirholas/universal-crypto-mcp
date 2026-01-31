'use client';

import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Types
export interface LiquidityPool {
  id: string;
  protocol: string;
  name: string;
  symbol: string;
  chain: string;
  token0: {
    symbol: string;
    address: string;
    logo?: string;
  };
  token1: {
    symbol: string;
    address: string;
    logo?: string;
  };
  tvl: number;
  volume24h: number;
  apy: number;
  apyBase?: number;
  apyReward?: number;
  rewardTokens?: string[];
  fee: number;
}

export interface LPPosition {
  id: string;
  pool: LiquidityPool;
  shares: string;
  sharePercent: number;
  value: number;
  token0Amount: string;
  token1Amount: string;
  uncollectedFees: {
    token0: string;
    token1: string;
    valueUsd: number;
  };
  pnl: {
    absolute: number;
    percent: number;
  };
  entryTime: number;
}

export interface AddLiquidityParams {
  poolId: string;
  token0Amount: string;
  token1Amount: string;
  slippage?: number;
}

export interface RemoveLiquidityParams {
  positionId: string;
  percent: number; // 0-100
  slippage?: number;
}

// API Functions
async function fetchPools(params?: {
  chain?: string;
  protocol?: string;
  minTvl?: number;
  sortBy?: 'tvl' | 'apy' | 'volume';
}): Promise<LiquidityPool[]> {
  const searchParams = new URLSearchParams();
  if (params?.chain) searchParams.set('chain', params.chain);
  if (params?.protocol) searchParams.set('protocol', params.protocol);
  if (params?.minTvl) searchParams.set('minTvl', String(params.minTvl));
  if (params?.sortBy) searchParams.set('sortBy', params.sortBy);

  const response = await fetch(`/api/defi/pools?${searchParams}`);
  if (!response.ok) throw new Error('Failed to fetch pools');
  return response.json();
}

async function fetchUserPositions(address: string): Promise<LPPosition[]> {
  const response = await fetch(`/api/defi/positions?address=${address}`);
  if (!response.ok) throw new Error('Failed to fetch positions');
  return response.json();
}

async function fetchPoolDetails(poolId: string): Promise<LiquidityPool & { positions: LPPosition[] }> {
  const response = await fetch(`/api/defi/pools/${poolId}`);
  if (!response.ok) throw new Error('Failed to fetch pool details');
  return response.json();
}

async function addLiquidity(params: AddLiquidityParams): Promise<{ success: boolean; txHash?: string; error?: string }> {
  const response = await fetch('/api/defi/liquidity/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return response.json();
}

async function removeLiquidity(params: RemoveLiquidityParams): Promise<{ success: boolean; txHash?: string; error?: string }> {
  const response = await fetch('/api/defi/liquidity/remove', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return response.json();
}

// Hooks
export function useLiquidityPools(params?: {
  chain?: string;
  protocol?: string;
  minTvl?: number;
  sortBy?: 'tvl' | 'apy' | 'volume';
}) {
  return useQuery({
    queryKey: ['liquidity-pools', params],
    queryFn: () => fetchPools(params),
    staleTime: 60000, // 1 minute
    refetchInterval: 120000, // 2 minutes
  });
}

export function useUserLPPositions(address: string | undefined) {
  return useQuery({
    queryKey: ['lp-positions', address],
    queryFn: () => fetchUserPositions(address!),
    enabled: !!address,
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // 1 minute
  });
}

export function usePoolDetails(poolId: string | undefined) {
  return useQuery({
    queryKey: ['pool-details', poolId],
    queryFn: () => fetchPoolDetails(poolId!),
    enabled: !!poolId,
    staleTime: 30000,
  });
}

export function useLiquidityMutations() {
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const addMutation = useMutation({
    mutationFn: addLiquidity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lp-positions'] });
      queryClient.invalidateQueries({ queryKey: ['token-balances'] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: removeLiquidity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lp-positions'] });
      queryClient.invalidateQueries({ queryKey: ['token-balances'] });
    },
  });

  const add = useCallback(
    async (params: AddLiquidityParams) => {
      setIsAdding(true);
      try {
        return await addMutation.mutateAsync(params);
      } finally {
        setIsAdding(false);
      }
    },
    [addMutation]
  );

  const remove = useCallback(
    async (params: RemoveLiquidityParams) => {
      setIsRemoving(true);
      try {
        return await removeMutation.mutateAsync(params);
      } finally {
        setIsRemoving(false);
      }
    },
    [removeMutation]
  );

  return {
    addLiquidity: add,
    removeLiquidity: remove,
    isAdding,
    isRemoving,
  };
}

// Combined hook for liquidity management
export function useLiquidity(walletAddress?: string, chain?: string) {
  const { data: pools = [], isLoading: poolsLoading } = useLiquidityPools({
    chain,
    sortBy: 'tvl',
  });

  const { data: positions = [], isLoading: positionsLoading } = useUserLPPositions(walletAddress);

  const { addLiquidity, removeLiquidity, isAdding, isRemoving } = useLiquidityMutations();

  // Calculate total value of positions
  const totalPositionValue = positions.reduce((sum, p) => sum + p.value, 0);
  const totalUncollectedFees = positions.reduce((sum, p) => sum + p.uncollectedFees.valueUsd, 0);

  // Top pools by APY
  const topPools = [...pools].sort((a, b) => b.apy - a.apy).slice(0, 10);

  return {
    // Pools
    pools,
    topPools,
    poolsLoading,

    // User positions
    positions,
    positionsLoading,
    totalPositionValue,
    totalUncollectedFees,

    // Actions
    addLiquidity,
    removeLiquidity,
    isAdding,
    isRemoving,
  };
}

export default useLiquidity;
