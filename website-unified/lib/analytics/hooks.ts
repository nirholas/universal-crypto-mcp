'use client';

/**
 * Analytics Hooks
 * 
 * React hooks for portfolio analytics, market data, and real-time updates
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import type {
  Portfolio,
  HistoricalData,
  Timeframe,
  AllocationData,
  PnLSummary,
  MarketOverview,
  TokenData,
  TokenDetails,
  TrendingToken,
  DeFiPosition,
  DeFiSummary,
  ProtocolData,
  Transaction,
  TransactionSummary,
  Alert,
  Notification,
  CostBasisMethod,
  ScreenerFilter,
  ChartDataPoint,
  DrawdownData,
} from './types';
import * as api from './api';

// ============================================================================
// Generic Data Hook
// ============================================================================

interface UseDataResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

function useData<T>(
  fetchFn: () => Promise<T>,
  deps: unknown[] = []
): UseDataResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFn();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, deps);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
}

// ============================================================================
// Portfolio Hooks
// ============================================================================

export function usePortfolio(walletAddresses: string[]): UseDataResult<Portfolio> {
  return useData(
    () => api.fetchPortfolio(walletAddresses),
    [walletAddresses.join(',')]
  );
}

export function usePortfolioHistory(
  walletAddresses: string[],
  timeframe: Timeframe
): UseDataResult<HistoricalData> {
  return useData(
    () => api.fetchPortfolioHistory(walletAddresses, timeframe),
    [walletAddresses.join(','), timeframe]
  );
}

export function useAllocation(walletAddresses: string[]): UseDataResult<AllocationData> {
  return useData(
    () => api.fetchAllocation(walletAddresses),
    [walletAddresses.join(',')]
  );
}

export function usePnL(
  walletAddresses: string[],
  method: CostBasisMethod
): UseDataResult<PnLSummary> {
  return useData(
    () => api.fetchPnL(walletAddresses, method),
    [walletAddresses.join(','), method]
  );
}

// ============================================================================
// Market Hooks
// ============================================================================

export function useMarketOverview(): UseDataResult<MarketOverview> {
  return useData(() => api.fetchMarketOverview(), []);
}

export function useTopTokens(
  limit: number = 100,
  page: number = 1
): UseDataResult<{ tokens: TokenData[]; total: number }> {
  return useData(() => api.fetchTopTokens(limit, page), [limit, page]);
}

export function useTokenDetails(id: string): UseDataResult<TokenDetails> {
  return useData(() => api.fetchTokenDetails(id), [id]);
}

export function useTokenPrice(
  id: string,
  timeframe: Timeframe
): UseDataResult<HistoricalData> {
  return useData(() => api.fetchTokenPrice(id, timeframe), [id, timeframe]);
}

export function useTrendingTokens(): UseDataResult<TrendingToken[]> {
  return useData(() => api.fetchTrendingTokens(), []);
}

export function useTokenSearch(query: string): UseDataResult<TokenData[]> {
  return useData(() => api.searchTokens(query), [query]);
}

export function useMarketScreener(
  filters: ScreenerFilter[]
): UseDataResult<TokenData[]> {
  return useData(() => api.screenTokens(filters), [JSON.stringify(filters)]);
}

// ============================================================================
// DeFi Hooks
// ============================================================================

export function useDeFiPositions(
  walletAddresses: string[]
): UseDataResult<DeFiPosition[]> {
  return useData(
    () => api.fetchDeFiPositions(walletAddresses),
    [walletAddresses.join(',')]
  );
}

export function useDeFiSummary(
  walletAddresses: string[]
): UseDataResult<DeFiSummary> {
  return useData(
    () => api.fetchDeFiSummary(walletAddresses),
    [walletAddresses.join(',')]
  );
}

export function useYieldOpportunities(): UseDataResult<import('./types').YieldOpportunity[]> {
  return useData(() => api.fetchYieldOpportunities(), []);
}

export function useProtocols(
  category?: string
): UseDataResult<ProtocolData[]> {
  return useData(() => api.fetchProtocols(category), [category]);
}

// ============================================================================
// Transaction Hooks
// ============================================================================

export function useTransactions(
  walletAddresses: string[],
  options?: {
    limit?: number;
    offset?: number;
    chain?: string;
    type?: string;
  }
): UseDataResult<{ transactions: Transaction[]; total: number }> {
  return useData(
    () => api.fetchTransactions(walletAddresses, options),
    [walletAddresses.join(','), JSON.stringify(options)]
  );
}

export function useTransactionSummary(
  walletAddresses: string[]
): UseDataResult<TransactionSummary> {
  return useData(
    () => api.fetchTransactionSummary(walletAddresses),
    [walletAddresses.join(',')]
  );
}

// ============================================================================
// Alert Hooks
// ============================================================================

interface UseAlertsResult {
  alerts: Alert[];
  isLoading: boolean;
  error: Error | null;
  createAlert: (alert: Omit<Alert, 'id' | 'createdAt' | 'triggerCount'>) => Promise<Alert>;
  updateAlert: (id: string, updates: Partial<Alert>) => Promise<Alert>;
  deleteAlert: (id: string) => Promise<void>;
  refetch: () => Promise<void>;
}

export function useAlerts(): UseAlertsResult {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await api.fetchAlerts();
      setAlerts(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch alerts'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const createAlert = useCallback(async (alertData: Omit<Alert, 'id' | 'createdAt' | 'triggerCount'>) => {
    const newAlert = await api.createAlert(alertData);
    setAlerts(prev => [...prev, newAlert]);
    return newAlert;
  }, []);

  const updateAlert = useCallback(async (id: string, updates: Partial<Alert>) => {
    const updatedAlert = await api.updateAlert(id, updates);
    setAlerts(prev => prev.map(a => a.id === id ? updatedAlert : a));
    return updatedAlert;
  }, []);

  const deleteAlert = useCallback(async (id: string) => {
    await api.deleteAlert(id);
    setAlerts(prev => prev.filter(a => a.id !== id));
  }, []);

  return {
    alerts,
    isLoading,
    error,
    createAlert,
    updateAlert,
    deleteAlert,
    refetch,
  };
}

interface UseNotificationsResult {
  notifications: Notification[];
  isLoading: boolean;
  error: Error | null;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  refetch: () => Promise<void>;
}

export function useNotifications(unreadOnly?: boolean): UseNotificationsResult {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await api.fetchNotifications(unreadOnly);
      setNotifications(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch notifications'));
    } finally {
      setIsLoading(false);
    }
  }, [unreadOnly]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const markAsRead = useCallback(async (id: string) => {
    await api.markNotificationRead(id);
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  }, []);

  const markAllAsRead = useCallback(async () => {
    await api.markAllNotificationsRead();
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  return {
    notifications,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    refetch,
  };
}

// ============================================================================
// Watchlist Hooks
// ============================================================================

export function useWatchlists(): UseDataResult<import('./types').Watchlist[]> {
  return useData(() => api.fetchWatchlists(), []);
}

// ============================================================================
// Chart Utilities
// ============================================================================

export function useChartData(
  historicalData: HistoricalData | null
): ChartDataPoint[] {
  return useMemo(() => {
    if (!historicalData) return [];
    return historicalData.timestamps.map((timestamp, index) => ({
      timestamp: new Date(timestamp).getTime(),
      value: historicalData.values[index],
    }));
  }, [historicalData]);
}

export function useDrawdownData(
  historicalData: HistoricalData | null
): DrawdownData[] {
  return useMemo(() => {
    if (!historicalData) return [];
    
    let peak = 0;
    return historicalData.timestamps.map((timestamp, index) => {
      const value = historicalData.values[index];
      peak = Math.max(peak, value);
      const drawdown = peak > 0 ? ((peak - value) / peak) * 100 : 0;
      
      return {
        timestamp: new Date(timestamp).getTime(),
        drawdown,
        peak,
        current: value,
      };
    });
  }, [historicalData]);
}

// ============================================================================
// Real-time Updates Hook
// ============================================================================

export function useRealtimePrices(tokenIds: string[]) {
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (tokenIds.length === 0) return;

    // WebSocket connection for real-time prices
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'wss://api.example.com/ws';
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      setConnected(true);
      ws.send(JSON.stringify({ type: 'subscribe', tokens: tokenIds }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'price_update') {
        setPrices((prev: Record<string, number>) => ({
          ...prev,
          [data.tokenId]: data.price,
        }));
      }
    };

    ws.onclose = () => {
      setConnected(false);
    };

    return () => {
      ws.close();
    };
  }, [tokenIds.join(',')]);

  return { prices, connected };
}

// ============================================================================
// Local Storage Hooks
// ============================================================================

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev: T) => {
        const newValue = value instanceof Function ? value(prev) : value;
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(newValue));
        }
        return newValue;
      });
    },
    [key]
  );

  return [storedValue, setValue];
}

// ============================================================================
// Formatting Utilities
// ============================================================================

export function formatCurrency(value: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPercentage(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

export function formatNumber(value: number): string {
  if (value >= 1e12) return `${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(2)}K`;
  return value.toFixed(2);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}
