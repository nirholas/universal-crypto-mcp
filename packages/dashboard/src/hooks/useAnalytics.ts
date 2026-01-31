import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useWebSocket } from './useWebSocket';
import {
  fetchStats,
  fetchRevenueData,
  fetchRecentPayments,
  fetchNetworkMetrics,
} from '../services/api';
import type { RealTimeStats, WebSocketMessage } from '../types/analytics';

export function useRealTimeStats() {
  const [stats, setStats] = useState<RealTimeStats | null>(null);

  const handleMessage = useCallback((message: WebSocketMessage) => {
    if (message.type === 'stats:update') {
      setStats(message.data as RealTimeStats);
    }
  }, []);

  const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8080/ws';
  const { isConnected } = useWebSocket(wsUrl, {
    onMessage: handleMessage,
    channels: ['stats'],
  });

  // Fallback to polling if WebSocket not available
  const { data: polledStats } = useQuery({
    queryKey: ['stats'],
    queryFn: fetchStats,
    refetchInterval: isConnected ? false : 5000,
    enabled: !isConnected,
  });

  return {
    stats: stats || polledStats || null,
    isConnected,
  };
}

export function useAnalytics(window: '24h' | '7d' | '30d' = '24h') {
  const { data: revenueData, isLoading: isLoadingRevenue } = useQuery({
    queryKey: ['revenue', window],
    queryFn: () => fetchRevenueData(window),
    refetchInterval: 60000, // Refresh every minute
  });

  const { data: payments, isLoading: isLoadingPayments } = useQuery({
    queryKey: ['payments'],
    queryFn: () => fetchRecentPayments(20),
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  const { data: networks, isLoading: isLoadingNetworks } = useQuery({
    queryKey: ['networks'],
    queryFn: fetchNetworkMetrics,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  return {
    revenueData: revenueData || [],
    payments: payments || [],
    networks: networks || [],
    isLoading: isLoadingRevenue || isLoadingPayments || isLoadingNetworks,
  };
}
