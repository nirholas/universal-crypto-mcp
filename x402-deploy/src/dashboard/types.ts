/**
 * Dashboard types for x402 earnings and analytics
 */

export interface PaymentRecord {
  id: string;
  timestamp: Date;
  payer: string;
  route: string;
  amount: string;
  token: string;
  network: string;
  transactionHash: string;
}

export interface EarningsSummary {
  totalRevenue: string;
  totalPayments: number;
  uniquePayers: number;
  period: "day" | "week" | "month" | "all";
}

export interface RouteStats {
  route: string;
  revenue: string;
  calls: number;
  avgPayment: string;
  percentage: number;
}

export interface DashboardData {
  summary: EarningsSummary;
  recentPayments: PaymentRecord[];
  topRoutes: RouteStats[];
  payerStats: {
    totalUnique: number;
    topPayers: { address: string; totalPaid: string; calls: number }[];
  };
  trends: {
    daily: { date: string; revenue: string; calls: number }[];
  };
}

export interface WebhookEvent {
  type: "payment.received" | "payment.settled" | "payment.failed";
  data: PaymentRecord;
  timestamp: Date;
}

export type WebhookEventType = WebhookEvent["type"];

export interface DashboardConfig {
  baseUrl?: string;
  apiKey?: string;
  projectName?: string;
}
