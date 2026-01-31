'use client';

import { useState, useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Types
export interface YieldFarm {
  id: string;
  protocol: string;
  name: string;
  chain: string;
  asset: {
    symbol: string;
    address: string;
    logo?: string;
  };
  tvl: number;
  apy: number;
  apyBase: number;
  apyReward: number;
  rewardTokens: Array<{
    symbol: string;
    address: string;
    logo?: string;
    apy: number;
  }>;
  depositToken: string;
  risk: 'low' | 'medium' | 'high';
  lockupPeriod?: number; // days
  minDeposit?: number;
}

export interface YieldPosition {
  id: string;
  farm: YieldFarm;
  deposited: string;
  depositedUsd: number;
  pendingRewards: Array<{
    token: string;
    amount: string;
    valueUsd: number;
  }>;
  totalRewardsClaimed: number;
  entryTime: number;
  unlockTime?: number;
  currentApy: number;
}

export interface StakeParams {
  farmId: string;
  amount: string;
}

export interface UnstakeParams {
  positionId: string;
  amount: string;
  claimRewards?: boolean;
}

// API Functions
async function fetchYieldFarms(params?: {
  chain?: string;
  protocol?: string;
  minApy?: number;
  sortBy?: 'apy' | 'tvl' | 'risk';
}): Promise<YieldFarm[]> {
  const searchParams = new URLSearchParams();
  if (params?.chain) searchParams.set('chain', params.chain);
  if (params?.protocol) searchParams.set('protocol', params.protocol);
  if (params?.minApy) searchParams.set('minApy', String(params.minApy));
  if (params?.sortBy) searchParams.set('sortBy', params.sortBy);

  const response = await fetch(`/api/defi/farms?${searchParams}`);
  if (!response.ok) throw new Error('Failed to fetch farms');
  return response.json();
}

async function fetchUserFarmPositions(address: string): Promise<YieldPosition[]> {
  const response = await fetch(`/api/defi/farm-positions?address=${address}`);
  if (!response.ok) throw new Error('Failed to fetch positions');
  return response.json();
}

async function stake(params: StakeParams): Promise<{ success: boolean; txHash?: string; error?: string }> {
  const response = await fetch('/api/defi/stake', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return response.json();
}

async function unstake(params: UnstakeParams): Promise<{ success: boolean; txHash?: string; error?: string }> {
  const response = await fetch('/api/defi/unstake', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return response.json();
}

async function claimRewards(positionId: string): Promise<{ success: boolean; txHash?: string; error?: string }> {
  const response = await fetch('/api/defi/claim', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ positionId }),
  });
  return response.json();
}

async function compoundRewards(positionId: string): Promise<{ success: boolean; txHash?: string; error?: string }> {
  const response = await fetch('/api/defi/compound', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ positionId }),
  });
  return response.json();
}

// Hooks
export function useYieldFarms(params?: {
  chain?: string;
  protocol?: string;
  minApy?: number;
  sortBy?: 'apy' | 'tvl' | 'risk';
}) {
  return useQuery({
    queryKey: ['yield-farms', params],
    queryFn: () => fetchYieldFarms(params),
    staleTime: 60000, // 1 minute
    refetchInterval: 300000, // 5 minutes
  });
}

export function useUserYieldPositions(address: string | undefined) {
  return useQuery({
    queryKey: ['yield-positions', address],
    queryFn: () => fetchUserFarmPositions(address!),
    enabled: !!address,
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // 1 minute
  });
}

export function useYieldMutations() {
  const queryClient = useQueryClient();
  const [isStaking, setIsStaking] = useState(false);
  const [isUnstaking, setIsUnstaking] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [isCompounding, setIsCompounding] = useState(false);

  const stakeMutation = useMutation({
    mutationFn: stake,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['yield-positions'] });
      queryClient.invalidateQueries({ queryKey: ['token-balances'] });
    },
  });

  const unstakeMutation = useMutation({
    mutationFn: unstake,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['yield-positions'] });
      queryClient.invalidateQueries({ queryKey: ['token-balances'] });
    },
  });

  const claimMutation = useMutation({
    mutationFn: claimRewards,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['yield-positions'] });
    },
  });

  const compoundMutation = useMutation({
    mutationFn: compoundRewards,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['yield-positions'] });
    },
  });

  return {
    stake: useCallback(
      async (params: StakeParams) => {
        setIsStaking(true);
        try {
          return await stakeMutation.mutateAsync(params);
        } finally {
          setIsStaking(false);
        }
      },
      [stakeMutation]
    ),

    unstake: useCallback(
      async (params: UnstakeParams) => {
        setIsUnstaking(true);
        try {
          return await unstakeMutation.mutateAsync(params);
        } finally {
          setIsUnstaking(false);
        }
      },
      [unstakeMutation]
    ),

    claim: useCallback(
      async (positionId: string) => {
        setIsClaiming(true);
        try {
          return await claimMutation.mutateAsync(positionId);
        } finally {
          setIsClaiming(false);
        }
      },
      [claimMutation]
    ),

    compound: useCallback(
      async (positionId: string) => {
        setIsCompounding(true);
        try {
          return await compoundMutation.mutateAsync(positionId);
        } finally {
          setIsCompounding(false);
        }
      },
      [compoundMutation]
    ),

    isStaking,
    isUnstaking,
    isClaiming,
    isCompounding,
  };
}

// Combined hook for yield farming
export function useYield(walletAddress?: string, chain?: string) {
  const { data: farms = [], isLoading: farmsLoading } = useYieldFarms({
    chain,
    sortBy: 'apy',
  });

  const { data: positions = [], isLoading: positionsLoading } = useUserYieldPositions(walletAddress);

  const mutations = useYieldMutations();

  // Calculated values
  const stats = useMemo(() => {
    const totalDeposited = positions.reduce((sum, p) => sum + p.depositedUsd, 0);
    const totalPendingRewards = positions.reduce(
      (sum, p) => sum + p.pendingRewards.reduce((s, r) => s + r.valueUsd, 0),
      0
    );
    const avgApy = positions.length > 0
      ? positions.reduce((sum, p) => sum + p.currentApy * p.depositedUsd, 0) / totalDeposited
      : 0;

    return {
      totalDeposited,
      totalPendingRewards,
      avgApy: isNaN(avgApy) ? 0 : avgApy,
      positionCount: positions.length,
    };
  }, [positions]);

  // Top farms by APY (filtered by risk)
  const topFarms = useMemo(() => ({
    lowRisk: farms.filter((f) => f.risk === 'low').slice(0, 5),
    mediumRisk: farms.filter((f) => f.risk === 'medium').slice(0, 5),
    highRisk: farms.filter((f) => f.risk === 'high').slice(0, 5),
    all: farms.slice(0, 20),
  }), [farms]);

  return {
    // Farms
    farms,
    topFarms,
    farmsLoading,

    // User positions
    positions,
    positionsLoading,

    // Stats
    stats,

    // Actions
    ...mutations,
  };
}

export default useYield;
