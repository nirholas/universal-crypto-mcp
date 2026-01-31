import axios from 'axios';
import type {
  RealTimeStats,
  RevenueData,
  PaymentRecord,
  NetworkMetrics,
  TopEntity,
  AnalyticsSummary,
} from '../types/analytics';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function fetchStats(): Promise<RealTimeStats> {
  const response = await api.get('/v1/analytics/stats');
  return response.data;
}

export async function fetchRevenueData(window: string): Promise<RevenueData[]> {
  const response = await api.get(`/v1/analytics/revenue?window=${window}`);
  return response.data;
}

export async function fetchRecentPayments(limit = 20): Promise<PaymentRecord[]> {
  const response = await api.get(`/v1/analytics/payments?limit=${limit}`);
  return response.data;
}

export async function fetchNetworkMetrics(): Promise<NetworkMetrics[]> {
  const response = await api.get('/v1/analytics/networks');
  return response.data;
}

export async function fetchTopPayers(limit = 10): Promise<TopEntity[]> {
  const response = await api.get(`/v1/analytics/top-payers?limit=${limit}`);
  return response.data;
}

export async function fetchTopPayees(limit = 10): Promise<TopEntity[]> {
  const response = await api.get(`/v1/analytics/top-payees?limit=${limit}`);
  return response.data;
}

export async function fetchSummary(window: string): Promise<AnalyticsSummary> {
  const response = await api.get(`/v1/analytics/summary?window=${window}`);
  return response.data;
}

export async function fetchPaymentDetails(paymentId: string): Promise<PaymentRecord> {
  const response = await api.get(`/v1/analytics/payments/${paymentId}`);
  return response.data;
}

export { api };
