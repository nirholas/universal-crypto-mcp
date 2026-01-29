/**
 * x402 Earnings Dashboard Module
 *
 * This module provides tools for viewing and analyzing x402 payment earnings:
 * - Dashboard API client for fetching earnings data
 * - Analytics calculations for revenue and route stats
 * - CLI formatters for terminal output
 * - Webhook handlers for real-time payment notifications
 */

// Types
export type {
  PaymentRecord,
  EarningsSummary,
  RouteStats,
  DashboardData,
  WebhookEvent,
  WebhookEventType,
  DashboardConfig,
} from "./types.js";

// API Client
export { DashboardAPI, createDashboardAPI } from "./api.js";

// Analytics
export {
  calculateSummary,
  calculateRouteStats,
  calculateDailyTrends,
  calculateTopPayers,
  buildDashboardData,
  projectRevenue,
  calculateGrowthRate,
  comparePeriods,
} from "./analytics.js";

// Formatters
export {
  formatDashboardCLI,
  formatEarningsJSON,
  formatCompactSummary,
  formatPayment,
  formatRouteTable,
  formatTrendsChart,
  formatLoading,
  formatError,
  formatSuccess,
  formatNoData,
} from "./formatters.js";

// Webhooks
export type { WebhookConfig, WebhookDeliveryResult } from "./webhooks.js";
export {
  sendWebhook,
  sendWebhookWithRetry,
  createPaymentEvent,
  createPaymentReceivedEvent,
  createPaymentSettledEvent,
  createPaymentFailedEvent,
  verifyWebhookSignature,
  WebhookHandler,
} from "./webhooks.js";
