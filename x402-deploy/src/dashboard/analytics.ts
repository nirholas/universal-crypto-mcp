/**
 * Analytics calculations for dashboard earnings data
 */

import type { PaymentRecord, EarningsSummary, RouteStats, DashboardData } from "./types.js";

/**
 * Calculate earnings summary for a given period
 */
export function calculateSummary(
  payments: PaymentRecord[],
  period: "day" | "week" | "month" | "all"
): EarningsSummary {
  const now = new Date();
  const cutoff = getCutoffDate(now, period);

  const filtered = payments.filter((p) => new Date(p.timestamp) >= cutoff);

  const totalRevenue = filtered.reduce(
    (sum, p) => sum + parseFloat(p.amount),
    0
  );

  const uniquePayers = new Set(filtered.map((p) => p.payer)).size;

  return {
    totalRevenue: totalRevenue.toFixed(6),
    totalPayments: filtered.length,
    uniquePayers,
    period,
  };
}

/**
 * Calculate statistics for each route
 */
export function calculateRouteStats(payments: PaymentRecord[]): RouteStats[] {
  const routeMap = new Map<string, { revenue: number; calls: number }>();

  for (const payment of payments) {
    const existing = routeMap.get(payment.route) || { revenue: 0, calls: 0 };
    routeMap.set(payment.route, {
      revenue: existing.revenue + parseFloat(payment.amount),
      calls: existing.calls + 1,
    });
  }

  const totalRevenue = Array.from(routeMap.values()).reduce(
    (sum, r) => sum + r.revenue,
    0
  );

  // Handle case where there's no revenue
  if (totalRevenue === 0) {
    return [];
  }

  return Array.from(routeMap.entries())
    .map(([route, stats]) => ({
      route,
      revenue: stats.revenue.toFixed(6),
      calls: stats.calls,
      avgPayment: (stats.revenue / stats.calls).toFixed(6),
      percentage: (stats.revenue / totalRevenue) * 100,
    }))
    .sort((a, b) => parseFloat(b.revenue) - parseFloat(a.revenue));
}

/**
 * Get the cutoff date for a given period
 */
function getCutoffDate(now: Date, period: string): Date {
  const cutoff = new Date(now);

  switch (period) {
    case "day":
      cutoff.setDate(cutoff.getDate() - 1);
      break;
    case "week":
      cutoff.setDate(cutoff.getDate() - 7);
      break;
    case "month":
      cutoff.setMonth(cutoff.getMonth() - 1);
      break;
    default:
      return new Date(0); // All time
  }

  return cutoff;
}

/**
 * Project future revenue based on current trends
 */
export function projectRevenue(
  currentRevenue: number,
  days: number,
  projectionDays: number
): number {
  if (days <= 0) return 0;
  const dailyAverage = currentRevenue / days;
  return dailyAverage * projectionDays;
}

/**
 * Calculate daily trends from payment records
 */
export function calculateDailyTrends(
  payments: PaymentRecord[],
  days: number = 30
): { date: string; revenue: string; calls: number }[] {
  const now = new Date();
  const dailyMap = new Map<string, { revenue: number; calls: number }>();

  // Initialize all days with zero values
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateKey = date.toISOString().split("T")[0];
    dailyMap.set(dateKey, { revenue: 0, calls: 0 });
  }

  // Aggregate payments by day
  for (const payment of payments) {
    const dateKey = new Date(payment.timestamp).toISOString().split("T")[0];
    const existing = dailyMap.get(dateKey);
    if (existing) {
      dailyMap.set(dateKey, {
        revenue: existing.revenue + parseFloat(payment.amount),
        calls: existing.calls + 1,
      });
    }
  }

  return Array.from(dailyMap.entries())
    .map(([date, stats]) => ({
      date,
      revenue: stats.revenue.toFixed(6),
      calls: stats.calls,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Calculate top payers from payment records
 */
export function calculateTopPayers(
  payments: PaymentRecord[],
  limit: number = 10
): { address: string; totalPaid: string; calls: number }[] {
  const payerMap = new Map<string, { totalPaid: number; calls: number }>();

  for (const payment of payments) {
    const existing = payerMap.get(payment.payer) || { totalPaid: 0, calls: 0 };
    payerMap.set(payment.payer, {
      totalPaid: existing.totalPaid + parseFloat(payment.amount),
      calls: existing.calls + 1,
    });
  }

  return Array.from(payerMap.entries())
    .map(([address, stats]) => ({
      address,
      totalPaid: stats.totalPaid.toFixed(6),
      calls: stats.calls,
    }))
    .sort((a, b) => parseFloat(b.totalPaid) - parseFloat(a.totalPaid))
    .slice(0, limit);
}

/**
 * Build complete dashboard data from payment records
 */
export function buildDashboardData(
  payments: PaymentRecord[],
  period: "day" | "week" | "month" | "all" = "week"
): DashboardData {
  const summary = calculateSummary(payments, period);
  const topRoutes = calculateRouteStats(payments);
  const topPayers = calculateTopPayers(payments);
  const trends = calculateDailyTrends(payments);

  // Sort by timestamp descending for recent payments
  const recentPayments = [...payments]
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
    .slice(0, 10);

  return {
    summary,
    recentPayments,
    topRoutes,
    payerStats: {
      totalUnique: summary.uniquePayers,
      topPayers,
    },
    trends: {
      daily: trends,
    },
  };
}

/**
 * Calculate growth rate between two periods
 */
export function calculateGrowthRate(
  currentPeriodRevenue: number,
  previousPeriodRevenue: number
): number {
  if (previousPeriodRevenue === 0) {
    return currentPeriodRevenue > 0 ? 100 : 0;
  }
  return ((currentPeriodRevenue - previousPeriodRevenue) / previousPeriodRevenue) * 100;
}

/**
 * Get period comparison data
 */
export function comparePeriods(
  payments: PaymentRecord[],
  period: "day" | "week" | "month"
): {
  current: EarningsSummary;
  previous: EarningsSummary;
  growthRate: number;
} {
  const now = new Date();
  const currentCutoff = getCutoffDate(now, period);
  const previousCutoff = getCutoffDate(currentCutoff, period);

  const currentPayments = payments.filter(
    (p) => new Date(p.timestamp) >= currentCutoff
  );
  const previousPayments = payments.filter(
    (p) =>
      new Date(p.timestamp) >= previousCutoff &&
      new Date(p.timestamp) < currentCutoff
  );

  const current = calculateSummary(currentPayments, period);
  const previous = calculateSummary(previousPayments, period);

  const growthRate = calculateGrowthRate(
    parseFloat(current.totalRevenue),
    parseFloat(previous.totalRevenue)
  );

  return {
    current,
    previous,
    growthRate,
  };
}
