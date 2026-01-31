/**
 * Analytics Types
 */

export interface RealTimeStats {
  paymentsPerMinute: number;
  revenuePerHour: string;
  pendingSettlements: number;
  activeConnections: number;
  trend: 'up' | 'down' | 'stable';
}

export interface RevenueData {
  timestamp: number;
  value: number;
}

export interface PaymentRecord {
  paymentId: string;
  payer: string;
  payee: string;
  amount: string;
  network: string;
  status: 'pending' | 'settled' | 'failed';
  settledAt: string;
  createdAt: string;
}

export interface NetworkMetrics {
  chainId: number;
  chainName: string;
  totalVolume: string;
  totalPayments: number;
  successRate: number;
  averageConfirmationTime: number;
  status: 'healthy' | 'degraded' | 'down';
}

export interface TopEntity {
  address: string;
  volume: string;
  count: number;
  percentage: number;
}

export interface AnalyticsSummary {
  totalRevenue: string;
  totalPayments: number;
  successRate: number;
  averagePaymentSize: string;
  uniquePayers: number;
  uniquePayees: number;
}

export interface TimeWindow {
  value: '24h' | '7d' | '30d';
  label: string;
}

export const TIME_WINDOWS: TimeWindow[] = [
  { value: '24h', label: 'Last 24 Hours' },
  { value: '7d', label: 'Last 7 Days' },
  { value: '30d', label: 'Last 30 Days' },
];

export interface WebSocketMessage {
  type: string;
  data: unknown;
}

export interface DashboardState {
  stats: RealTimeStats | null;
  revenueData: RevenueData[];
  payments: PaymentRecord[];
  networks: NetworkMetrics[];
  isConnected: boolean;
  lastUpdate: Date | null;
}
