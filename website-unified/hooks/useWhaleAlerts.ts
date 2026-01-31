'use client';

import { useQuery } from '@tanstack/react-query';
import { useState, useEffect, useCallback, useRef } from 'react';

// Types
export interface WhaleTransaction {
  id: string;
  hash: string;
  chain: string;
  from: {
    address: string;
    label?: string;
    isExchange?: boolean;
    isWhale?: boolean;
  };
  to: {
    address: string;
    label?: string;
    isExchange?: boolean;
    isWhale?: boolean;
  };
  token: {
    symbol: string;
    name: string;
    address?: string;
    logo?: string;
  };
  amount: string;
  amountUsd: number;
  timestamp: number;
  blockNumber: number;
  type: 'transfer' | 'swap' | 'bridge' | 'mint' | 'burn';
  significance: 'medium' | 'high' | 'extreme';
}

export interface WhaleWallet {
  address: string;
  label?: string;
  chain: string;
  netWorth: number;
  tokens: Array<{
    symbol: string;
    balance: string;
    valueUsd: number;
    percentOfHoldings: number;
  }>;
  recentActivity: WhaleTransaction[];
  tradingVolume24h: number;
  isExchange: boolean;
  tags: string[];
}

export interface WhaleAlertConfig {
  minAmount: number; // USD
  tokens?: string[]; // Filter by token symbols
  chains?: string[]; // Filter by chain
  types?: WhaleTransaction['type'][];
  exchanges?: boolean; // Include exchange movements
}

// API Functions
async function fetchWhaleTransactions(params?: {
  chain?: string;
  token?: string;
  minAmount?: number;
  limit?: number;
}): Promise<WhaleTransaction[]> {
  const searchParams = new URLSearchParams();
  if (params?.chain) searchParams.set('chain', params.chain);
  if (params?.token) searchParams.set('token', params.token);
  if (params?.minAmount) searchParams.set('minAmount', String(params.minAmount));
  searchParams.set('limit', String(params?.limit || 50));

  const response = await fetch(`/api/market/whales?${searchParams}`);
  if (!response.ok) throw new Error('Failed to fetch whale transactions');
  return response.json();
}

async function fetchWhaleWallet(address: string): Promise<WhaleWallet> {
  const response = await fetch(`/api/market/whales/wallet/${address}`);
  if (!response.ok) throw new Error('Failed to fetch whale wallet');
  return response.json();
}

async function fetchTopWhales(params?: {
  chain?: string;
  limit?: number;
}): Promise<WhaleWallet[]> {
  const searchParams = new URLSearchParams();
  if (params?.chain) searchParams.set('chain', params.chain);
  searchParams.set('limit', String(params?.limit || 20));

  const response = await fetch(`/api/market/whales/top?${searchParams}`);
  if (!response.ok) throw new Error('Failed to fetch top whales');
  return response.json();
}

// Hooks
export function useWhaleTransactions(params?: {
  chain?: string;
  token?: string;
  minAmount?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ['whale-transactions', params],
    queryFn: () => fetchWhaleTransactions(params),
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // 1 minute
  });
}

export function useWhaleWallet(address: string | undefined) {
  return useQuery({
    queryKey: ['whale-wallet', address],
    queryFn: () => fetchWhaleWallet(address!),
    enabled: !!address,
    staleTime: 60000, // 1 minute
  });
}

export function useTopWhales(params?: { chain?: string; limit?: number }) {
  return useQuery({
    queryKey: ['top-whales', params],
    queryFn: () => fetchTopWhales(params),
    staleTime: 120000, // 2 minutes
    refetchInterval: 300000, // 5 minutes
  });
}

// Real-time whale alerts using WebSocket
export function useWhaleAlerts(config: WhaleAlertConfig) {
  const [alerts, setAlerts] = useState<WhaleTransaction[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const configRef = useRef(config);
  configRef.current = config;

  const filterTransaction = useCallback((tx: WhaleTransaction): boolean => {
    const cfg = configRef.current;
    
    if (tx.amountUsd < cfg.minAmount) return false;
    if (cfg.tokens?.length && !cfg.tokens.includes(tx.token.symbol)) return false;
    if (cfg.chains?.length && !cfg.chains.includes(tx.chain)) return false;
    if (cfg.types?.length && !cfg.types.includes(tx.type)) return false;
    if (!cfg.exchanges && (tx.from.isExchange || tx.to.isExchange)) return false;
    
    return true;
  }, []);

  useEffect(() => {
    const wsUrl = process.env.NEXT_PUBLIC_WHALE_WS_URL || 'wss://api.example.com/whales';
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      ws.send(JSON.stringify({
        type: 'subscribe',
        channel: 'whale-alerts',
        config: {
          minAmount: config.minAmount,
          chains: config.chains,
          tokens: config.tokens,
        },
      }));
    };

    ws.onclose = () => {
      setIsConnected(false);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'whale_alert' && filterTransaction(data.transaction)) {
          setAlerts((prev) => [data.transaction, ...prev].slice(0, 100));
        }
      } catch {
        // Ignore invalid messages
      }
    };

    return () => {
      ws.close();
    };
  }, [config.minAmount, config.chains?.join(','), config.tokens?.join(','), filterTransaction]);

  const clearAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  return {
    alerts,
    isConnected,
    clearAlerts,
  };
}

// Combined hook for whale monitoring
export function useWhaleMonitoring(chain?: string) {
  const { data: transactions = [], isLoading: txLoading } = useWhaleTransactions({
    chain,
    minAmount: 100000, // $100k minimum
    limit: 50,
  });

  const { data: topWhales = [], isLoading: whalesLoading } = useTopWhales({
    chain,
    limit: 20,
  });

  const [alertConfig, setAlertConfig] = useState<WhaleAlertConfig>({
    minAmount: 1000000, // $1M
    exchanges: true,
  });

  const { alerts, isConnected } = useWhaleAlerts(alertConfig);

  // Analytics
  const stats = {
    totalVolume24h: transactions.reduce((sum, tx) => sum + tx.amountUsd, 0),
    largestTransaction: transactions.reduce(
      (max, tx) => (tx.amountUsd > max.amountUsd ? tx : max),
      transactions[0] || { amountUsd: 0 }
    ),
    exchangeInflow: transactions
      .filter((tx) => tx.to.isExchange)
      .reduce((sum, tx) => sum + tx.amountUsd, 0),
    exchangeOutflow: transactions
      .filter((tx) => tx.from.isExchange)
      .reduce((sum, tx) => sum + tx.amountUsd, 0),
    transactionCount: transactions.length,
  };

  // Token breakdown
  const tokenBreakdown = transactions.reduce<Record<string, { count: number; volume: number }>>(
    (acc, tx) => {
      if (!acc[tx.token.symbol]) {
        acc[tx.token.symbol] = { count: 0, volume: 0 };
      }
      acc[tx.token.symbol].count += 1;
      acc[tx.token.symbol].volume += tx.amountUsd;
      return acc;
    },
    {}
  );

  return {
    // Transactions
    transactions,
    txLoading,

    // Top whales
    topWhales,
    whalesLoading,

    // Real-time alerts
    alerts,
    isConnected,
    alertConfig,
    setAlertConfig,

    // Analytics
    stats,
    tokenBreakdown,

    isLoading: txLoading || whalesLoading,
  };
}

export default useWhaleAlerts;
