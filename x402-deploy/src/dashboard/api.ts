/**
 * Dashboard API client for fetching earnings and analytics data
 */

import type { DashboardData, EarningsSummary, PaymentRecord, DashboardConfig } from "./types.js";

export class DashboardAPI {
  private baseUrl: string;
  private apiKey?: string;

  constructor(config: DashboardConfig = {}) {
    this.baseUrl = config.baseUrl || "https://api.x402.host/dashboard";
    this.apiKey = config.apiKey || process.env.X402_API_KEY;
  }

  /**
   * Get earnings summary for a project
   */
  async getEarnings(
    projectName: string,
    period: "day" | "week" | "month" | "all" = "week"
  ): Promise<EarningsSummary> {
    const response = await fetch(
      `${this.baseUrl}/projects/${projectName}/earnings?period=${period}`,
      {
        headers: this.getHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch earnings: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get full dashboard data including all analytics
   */
  async getFullDashboard(projectName: string): Promise<DashboardData> {
    const response = await fetch(
      `${this.baseUrl}/projects/${projectName}/dashboard`,
      {
        headers: this.getHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch dashboard: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get recent payments for a project
   */
  async getRecentPayments(
    projectName: string,
    limit: number = 10
  ): Promise<PaymentRecord[]> {
    const response = await fetch(
      `${this.baseUrl}/projects/${projectName}/payments?limit=${limit}`,
      {
        headers: this.getHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch payments: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get route-specific analytics
   */
  async getRouteAnalytics(
    projectName: string,
    route: string
  ): Promise<{
    route: string;
    totalRevenue: string;
    totalCalls: number;
    avgPayment: string;
    recentPayments: PaymentRecord[];
  }> {
    const response = await fetch(
      `${this.baseUrl}/projects/${projectName}/routes/${encodeURIComponent(route)}`,
      {
        headers: this.getHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch route analytics: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get payer statistics
   */
  async getPayerStats(
    projectName: string,
    limit: number = 10
  ): Promise<{
    totalUnique: number;
    topPayers: { address: string; totalPaid: string; calls: number }[];
  }> {
    const response = await fetch(
      `${this.baseUrl}/projects/${projectName}/payers?limit=${limit}`,
      {
        headers: this.getHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch payer stats: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get daily trends for charting
   */
  async getDailyTrends(
    projectName: string,
    days: number = 30
  ): Promise<{ date: string; revenue: string; calls: number }[]> {
    const response = await fetch(
      `${this.baseUrl}/projects/${projectName}/trends?days=${days}`,
      {
        headers: this.getHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch trends: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get pending earnings from escrow
   */
  async getPendingEarnings(
    projectName: string
  ): Promise<{
    pending: number;
    escrowBalance: string;
    pendingWithdrawals: Array<{
      amount: string;
      timestamp: number;
      status: "pending" | "processing" | "completed";
    }>;
  }> {
    try {
      const response = await fetch(
        `${this.baseUrl}/projects/${projectName}/escrow`,
        {
          headers: this.getHeaders(),
        }
      );

      if (!response.ok) {
        // Return default if endpoint doesn't exist yet
        return {
          pending: 0,
          escrowBalance: "0",
          pendingWithdrawals: [],
        };
      }

      return response.json();
    } catch (error) {
      // Gracefully handle API errors
      return {
        pending: 0,
        escrowBalance: "0",
        pendingWithdrawals: [],
      };
    }
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (this.apiKey) {
      headers["Authorization"] = `Bearer ${this.apiKey}`;
    }

    return headers;
  }
}

/**
 * Create a dashboard API client with default configuration
 */
export function createDashboardAPI(config?: DashboardConfig): DashboardAPI {
  return new DashboardAPI(config);
}
