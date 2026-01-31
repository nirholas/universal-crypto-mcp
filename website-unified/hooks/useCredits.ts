'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

// Types
export interface CreditBalance {
  available: number;
  pending: number;
  spent: number;
  currency: string;
}

export interface CreditTransaction {
  id: string;
  type: 'purchase' | 'usage' | 'refund' | 'bonus' | 'withdrawal';
  amount: number;
  balance: number;
  description: string;
  serviceId?: string;
  serviceName?: string;
  timestamp: number;
}

export interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
  currency: string;
  bonus?: number;
  popular?: boolean;
}

export interface UsageStats {
  totalRequests: number;
  totalCreditsUsed: number;
  avgCreditsPerRequest: number;
  byService: Array<{
    serviceId: string;
    serviceName: string;
    requests: number;
    creditsUsed: number;
  }>;
  byDay: Array<{
    date: string;
    requests: number;
    creditsUsed: number;
  }>;
}

// API Functions
async function fetchCreditBalance(): Promise<CreditBalance> {
  const response = await fetch('/api/credits/balance');
  if (!response.ok) throw new Error('Failed to fetch credit balance');
  return response.json();
}

async function fetchCreditTransactions(params?: {
  type?: CreditTransaction['type'];
  limit?: number;
  before?: number;
}): Promise<CreditTransaction[]> {
  const searchParams = new URLSearchParams();
  if (params?.type) searchParams.set('type', params.type);
  if (params?.limit) searchParams.set('limit', String(params.limit));
  if (params?.before) searchParams.set('before', String(params.before));

  const response = await fetch(`/api/credits/transactions?${searchParams}`);
  if (!response.ok) throw new Error('Failed to fetch transactions');
  return response.json();
}

async function fetchCreditPackages(): Promise<CreditPackage[]> {
  const response = await fetch('/api/credits/packages');
  if (!response.ok) throw new Error('Failed to fetch packages');
  return response.json();
}

async function purchaseCredits(packageId: string): Promise<{
  success: boolean;
  transactionId?: string;
  newBalance?: number;
  error?: string;
}> {
  const response = await fetch('/api/credits/purchase', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ packageId }),
  });
  return response.json();
}

async function fetchUsageStats(params?: {
  period?: '7d' | '30d' | '90d';
}): Promise<UsageStats> {
  const searchParams = new URLSearchParams();
  if (params?.period) searchParams.set('period', params.period);

  const response = await fetch(`/api/credits/usage?${searchParams}`);
  if (!response.ok) throw new Error('Failed to fetch usage stats');
  return response.json();
}

// Hooks
export function useCreditBalance() {
  return useQuery({
    queryKey: ['credit-balance'],
    queryFn: fetchCreditBalance,
    staleTime: 15000, // 15 seconds
    refetchInterval: 60000, // 1 minute
  });
}

export function useCreditTransactions(params?: {
  type?: CreditTransaction['type'];
  limit?: number;
}) {
  return useQuery({
    queryKey: ['credit-transactions', params],
    queryFn: () => fetchCreditTransactions(params),
    staleTime: 30000,
  });
}

export function useCreditPackages() {
  return useQuery({
    queryKey: ['credit-packages'],
    queryFn: fetchCreditPackages,
    staleTime: 300000, // 5 minutes
  });
}

export function useUsageStats(period: '7d' | '30d' | '90d' = '30d') {
  return useQuery({
    queryKey: ['usage-stats', period],
    queryFn: () => fetchUsageStats({ period }),
    staleTime: 60000, // 1 minute
  });
}

export function usePurchaseCredits() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: purchaseCredits,
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['credit-balance'] });
        queryClient.invalidateQueries({ queryKey: ['credit-transactions'] });
      }
    },
  });

  return {
    purchase: mutation.mutateAsync,
    isPurchasing: mutation.isPending,
    error: mutation.error,
  };
}

// Combined hook for credits management
export function useCredits() {
  const { data: balance, isLoading: balanceLoading } = useCreditBalance();
  const { data: transactions = [], isLoading: txLoading } = useCreditTransactions({ limit: 20 });
  const { data: packages = [], isLoading: packagesLoading } = useCreditPackages();
  const { data: usage, isLoading: usageLoading } = useUsageStats();
  const { purchase, isPurchasing } = usePurchaseCredits();

  // Calculate spending rate
  const recentSpending = transactions
    .filter((tx) => tx.type === 'usage')
    .slice(0, 10)
    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

  const avgDailySpending = usage?.byDay?.length
    ? usage.byDay.reduce((sum, day) => sum + day.creditsUsed, 0) / usage.byDay.length
    : 0;

  // Estimate days until credits run out
  const daysRemaining = balance && avgDailySpending > 0
    ? Math.floor(balance.available / avgDailySpending)
    : Infinity;

  // Low balance warning
  const isLowBalance = balance ? balance.available < avgDailySpending * 7 : false;

  return {
    // Balance
    balance,
    balanceLoading,

    // Transactions
    transactions,
    txLoading,

    // Packages
    packages,
    packagesLoading,

    // Usage
    usage,
    usageLoading,

    // Calculated values
    recentSpending,
    avgDailySpending,
    daysRemaining,
    isLowBalance,

    // Actions
    purchase,
    isPurchasing,

    isLoading: balanceLoading || txLoading || packagesLoading || usageLoading,
  };
}

export default useCredits;
