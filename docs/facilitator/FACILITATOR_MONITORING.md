# 📊 Agent 4: Monitoring & Analytics

## 🎯 Mission

Build the analytics, metrics, and monitoring infrastructure for the facilitator. You track every payment, collect metrics, and provide dashboards for operations and business insights.

---

## 📋 Context

You are working on the `universal-crypto-mcp` repository. Agents 1-3 are building the core facilitator, settlement, and API. You consume their events and provide observability.

**Your Dependencies:**
- Events from Agent 1's `FacilitatorServer`
- Events from Agent 2's `SettlementEngine`
- Integrates with Agent 3's API for metrics endpoints

**Key Reference Files:**
- `/workspaces/universal-crypto-mcp/deploy/prometheus.yml` - Existing monitoring
- `/workspaces/universal-crypto-mcp/packages/marketplace/src/analytics/` - Analytics patterns

---

## 🏗️ Phase 1: Metrics Collection

### Task 1.1: Create Analytics Types

Create `src/analytics/types.ts`:

```typescript
/**
 * Analytics and metrics types
 */

// ═══════════════════════════════════════════════════════════════
// Time Series Types
// ═══════════════════════════════════════════════════════════════

export type TimeWindow = '1h' | '6h' | '24h' | '7d' | '30d' | '90d';

export interface TimeSeriesPoint {
  timestamp: number;
  value: number;
}

export interface TimeSeries {
  name: string;
  window: TimeWindow;
  points: TimeSeriesPoint[];
  aggregation: 'sum' | 'avg' | 'min' | 'max' | 'count';
}

// ═══════════════════════════════════════════════════════════════
// Payment Analytics
// ═══════════════════════════════════════════════════════════════

export interface PaymentMetrics {
  totalPayments: number;
  successfulPayments: number;
  failedPayments: number;
  totalVolume: string;
  totalFees: string;
  averagePaymentSize: string;
  medianPaymentSize: string;
  averageSettlementTime: number;
  p95SettlementTime: number;
  p99SettlementTime: number;
}

export interface NetworkMetrics {
  chainId: string;
  chainName: string;
  totalPayments: number;
  totalVolume: string;
  totalFees: string;
  averageGasCost: string;
  totalGasSpent: string;
  successRate: number;
  averageConfirmationTime: number;
}

export interface HourlyStats {
  hour: number; // 0-23
  payments: number;
  volume: string;
  fees: string;
}

export interface DailyStats {
  date: string; // YYYY-MM-DD
  payments: number;
  volume: string;
  fees: string;
  uniquePayers: number;
  uniquePayees: number;
}

// ═══════════════════════════════════════════════════════════════
// Revenue Analytics
// ═══════════════════════════════════════════════════════════════

export interface RevenueMetrics {
  totalRevenue: string;
  revenueByNetwork: Record<string, string>;
  revenueByDay: DailyStats[];
  projectedMonthlyRevenue: string;
  growthRate: number; // Percentage
}

export interface RevenueBreakdown {
  facilitatorFees: string;
  gasSponsorship: string;
  premiumFeatures: string;
  total: string;
}

// ═══════════════════════════════════════════════════════════════
// Top Lists
// ═══════════════════════════════════════════════════════════════

export interface TopPayer {
  address: string;
  totalPaid: string;
  paymentCount: number;
  lastPayment: number;
}

export interface TopPayee {
  address: string;
  totalReceived: string;
  paymentCount: number;
  uniquePayers: number;
}

export interface TopRoute {
  payer: string;
  payee: string;
  volume: string;
  count: number;
}

// ═══════════════════════════════════════════════════════════════
// Prometheus Metrics
// ═══════════════════════════════════════════════════════════════

export interface PrometheusMetric {
  name: string;
  help: string;
  type: 'counter' | 'gauge' | 'histogram' | 'summary';
  labels?: string[];
}

export const PROMETHEUS_METRICS: PrometheusMetric[] = [
  {
    name: 'facilitator_payments_total',
    help: 'Total number of payments processed',
    type: 'counter',
    labels: ['network', 'status'],
  },
  {
    name: 'facilitator_volume_usd',
    help: 'Total payment volume in USD',
    type: 'counter',
    labels: ['network'],
  },
  {
    name: 'facilitator_fees_usd',
    help: 'Total fees collected in USD',
    type: 'counter',
    labels: ['network'],
  },
  {
    name: 'facilitator_settlement_duration_seconds',
    help: 'Time to settle payments',
    type: 'histogram',
    labels: ['network'],
  },
  {
    name: 'facilitator_gas_used',
    help: 'Gas used for settlements',
    type: 'histogram',
    labels: ['network'],
  },
  {
    name: 'facilitator_pending_payments',
    help: 'Number of payments pending settlement',
    type: 'gauge',
    labels: ['network'],
  },
  {
    name: 'facilitator_active_websocket_clients',
    help: 'Number of connected WebSocket clients',
    type: 'gauge',
  },
];
```

### Task 1.2: Create Metrics Collector

Create `src/analytics/MetricsCollector.ts`:

```typescript
/**
 * Metrics Collector
 * Prometheus-compatible metrics collection
 */

import { Counter, Gauge, Histogram, Registry } from 'prom-client';
import type { FacilitatorEvent } from '../core/types.js';
import { PROMETHEUS_METRICS } from './types.js';
import { createLogger } from '../utils/logger.js';

const log = createLogger('MetricsCollector');

export class MetricsCollector {
  private registry: Registry;
  
  // Counters
  private paymentsTotal: Counter;
  private volumeUsd: Counter;
  private feesUsd: Counter;
  
  // Gauges
  private pendingPayments: Gauge;
  private activeWebsocketClients: Gauge;
  
  // Histograms
  private settlementDuration: Histogram;
  private gasUsed: Histogram;

  constructor() {
    this.registry = new Registry();
    
    // Initialize counters
    this.paymentsTotal = new Counter({
      name: 'facilitator_payments_total',
      help: 'Total number of payments processed',
      labelNames: ['network', 'status'],
      registers: [this.registry],
    });

    this.volumeUsd = new Counter({
      name: 'facilitator_volume_usd',
      help: 'Total payment volume in USD',
      labelNames: ['network'],
      registers: [this.registry],
    });

    this.feesUsd = new Counter({
      name: 'facilitator_fees_usd',
      help: 'Total fees collected in USD',
      labelNames: ['network'],
      registers: [this.registry],
    });

    // Initialize gauges
    this.pendingPayments = new Gauge({
      name: 'facilitator_pending_payments',
      help: 'Number of payments pending settlement',
      labelNames: ['network'],
      registers: [this.registry],
    });

    this.activeWebsocketClients = new Gauge({
      name: 'facilitator_active_websocket_clients',
      help: 'Number of connected WebSocket clients',
      registers: [this.registry],
    });

    // Initialize histograms
    this.settlementDuration = new Histogram({
      name: 'facilitator_settlement_duration_seconds',
      help: 'Time to settle payments',
      labelNames: ['network'],
      buckets: [0.1, 0.5, 1, 2, 5, 10, 30, 60],
      registers: [this.registry],
    });

    this.gasUsed = new Histogram({
      name: 'facilitator_gas_used',
      help: 'Gas used for settlements',
      labelNames: ['network'],
      buckets: [21000, 50000, 100000, 200000, 500000, 1000000],
      registers: [this.registry],
    });

    log.info('Metrics collector initialized');
  }

  /**
   * Handle facilitator event and update metrics
   */
  handleEvent(event: FacilitatorEvent): void {
    switch (event.type) {
      case 'payment:received':
        this.pendingPayments.labels(event.data.network).inc();
        break;

      case 'payment:verified':
        // Verification tracked, waiting for settlement
        break;

      case 'payment:settled':
        this.paymentsTotal.labels(event.data.network || 'unknown', 'success').inc();
        this.feesUsd.labels(event.data.network || 'unknown').inc(parseFloat(event.data.fee));
        this.settlementDuration
          .labels(event.data.network || 'unknown')
          .observe(event.data.settlementTime / 1000);
        this.pendingPayments.labels(event.data.network || 'unknown').dec();
        break;

      case 'payment:failed':
        this.paymentsTotal.labels('unknown', 'failed').inc();
        this.pendingPayments.labels('unknown').dec();
        break;

      case 'batch:settled':
        if (event.data.gasUsed) {
          this.gasUsed
            .labels('batch')
            .observe(parseFloat(event.data.gasUsed));
        }
        break;
    }
  }

  /**
   * Record payment volume
   */
  recordVolume(network: string, amount: string): void {
    this.volumeUsd.labels(network).inc(parseFloat(amount));
  }

  /**
   * Set WebSocket client count
   */
  setWebsocketClients(count: number): void {
    this.activeWebsocketClients.set(count);
  }

  /**
   * Get Prometheus metrics output
   */
  async getMetrics(): Promise<string> {
    return this.registry.metrics();
  }

  /**
   * Get content type for Prometheus
   */
  getContentType(): string {
    return this.registry.contentType;
  }

  /**
   * Reset all metrics (for testing)
   */
  reset(): void {
    this.registry.resetMetrics();
  }
}
```

### Task 1.3: Create Analytics Service

Create `src/analytics/AnalyticsService.ts`:

```typescript
/**
 * Analytics Service
 * Business intelligence and reporting
 */

import type {
  PaymentMetrics,
  NetworkMetrics,
  RevenueMetrics,
  DailyStats,
  TopPayer,
  TopPayee,
  TimeWindow,
  TimeSeries,
} from './types.js';
import type { FacilitatorEvent } from '../core/types.js';
import { createLogger } from '../utils/logger.js';

const log = createLogger('AnalyticsService');

// In-memory storage (replace with database in production)
interface PaymentRecord {
  id: string;
  payer: string;
  payee: string;
  amount: number;
  fee: number;
  network: string;
  status: 'verified' | 'settled' | 'failed';
  verifiedAt: number;
  settledAt?: number;
  transaction?: string;
}

export class AnalyticsService {
  private payments: Map<string, PaymentRecord> = new Map();
  private dailyStats: Map<string, DailyStats> = new Map();

  constructor() {
    log.info('Analytics service initialized');
  }

  /**
   * Handle facilitator event
   */
  handleEvent(event: FacilitatorEvent): void {
    switch (event.type) {
      case 'payment:received':
        this.recordPaymentReceived(event.data);
        break;
      case 'payment:settled':
        this.recordPaymentSettled(event.data);
        break;
      case 'payment:failed':
        this.recordPaymentFailed(event.data);
        break;
    }
  }

  /**
   * Get payment metrics for a time window
   */
  async getPaymentMetrics(window: TimeWindow = '24h'): Promise<PaymentMetrics> {
    const cutoff = this.getWindowCutoff(window);
    const payments = Array.from(this.payments.values())
      .filter(p => p.verifiedAt >= cutoff);

    const successful = payments.filter(p => p.status === 'settled');
    const failed = payments.filter(p => p.status === 'failed');
    
    const amounts = successful.map(p => p.amount);
    const settlementTimes = successful
      .filter(p => p.settledAt)
      .map(p => p.settledAt! - p.verifiedAt);

    return {
      totalPayments: payments.length,
      successfulPayments: successful.length,
      failedPayments: failed.length,
      totalVolume: amounts.reduce((a, b) => a + b, 0).toFixed(6),
      totalFees: successful.reduce((a, p) => a + p.fee, 0).toFixed(6),
      averagePaymentSize: amounts.length > 0 
        ? (amounts.reduce((a, b) => a + b, 0) / amounts.length).toFixed(6)
        : '0',
      medianPaymentSize: this.calculateMedian(amounts).toFixed(6),
      averageSettlementTime: settlementTimes.length > 0
        ? settlementTimes.reduce((a, b) => a + b, 0) / settlementTimes.length
        : 0,
      p95SettlementTime: this.calculatePercentile(settlementTimes, 95),
      p99SettlementTime: this.calculatePercentile(settlementTimes, 99),
    };
  }

  /**
   * Get metrics by network
   */
  async getNetworkMetrics(window: TimeWindow = '24h'): Promise<NetworkMetrics[]> {
    const cutoff = this.getWindowCutoff(window);
    const payments = Array.from(this.payments.values())
      .filter(p => p.verifiedAt >= cutoff);

    const byNetwork = new Map<string, PaymentRecord[]>();
    for (const payment of payments) {
      const existing = byNetwork.get(payment.network) || [];
      existing.push(payment);
      byNetwork.set(payment.network, existing);
    }

    const metrics: NetworkMetrics[] = [];
    for (const [chainId, networkPayments] of byNetwork) {
      const successful = networkPayments.filter(p => p.status === 'settled');
      
      metrics.push({
        chainId,
        chainName: this.getChainName(chainId),
        totalPayments: networkPayments.length,
        totalVolume: successful.reduce((a, p) => a + p.amount, 0).toFixed(6),
        totalFees: successful.reduce((a, p) => a + p.fee, 0).toFixed(6),
        averageGasCost: '0.001', // TODO: Track actual gas
        totalGasSpent: '0',
        successRate: networkPayments.length > 0
          ? (successful.length / networkPayments.length) * 100
          : 0,
        averageConfirmationTime: 2000, // TODO: Track actual times
      });
    }

    return metrics;
  }

  /**
   * Get revenue metrics
   */
  async getRevenueMetrics(window: TimeWindow = '30d'): Promise<RevenueMetrics> {
    const cutoff = this.getWindowCutoff(window);
    const payments = Array.from(this.payments.values())
      .filter(p => p.status === 'settled' && p.settledAt && p.settledAt >= cutoff);

    const totalRevenue = payments.reduce((a, p) => a + p.fee, 0);
    
    // Calculate by network
    const revenueByNetwork: Record<string, string> = {};
    for (const payment of payments) {
      const current = parseFloat(revenueByNetwork[payment.network] || '0');
      revenueByNetwork[payment.network] = (current + payment.fee).toFixed(6);
    }

    // Calculate daily revenue
    const dailyRevenue = new Map<string, number>();
    for (const payment of payments) {
      const date = new Date(payment.settledAt!).toISOString().split('T')[0];
      dailyRevenue.set(date, (dailyRevenue.get(date) || 0) + payment.fee);
    }

    const revenueByDay: DailyStats[] = Array.from(dailyRevenue.entries())
      .map(([date, fees]) => ({
        date,
        payments: payments.filter(p => 
          new Date(p.settledAt!).toISOString().startsWith(date)
        ).length,
        volume: '0', // TODO: Calculate
        fees: fees.toFixed(6),
        uniquePayers: 0,
        uniquePayees: 0,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Calculate growth rate
    const halfPoint = Math.floor(revenueByDay.length / 2);
    const firstHalf = revenueByDay.slice(0, halfPoint);
    const secondHalf = revenueByDay.slice(halfPoint);
    
    const firstHalfTotal = firstHalf.reduce((a, d) => a + parseFloat(d.fees), 0);
    const secondHalfTotal = secondHalf.reduce((a, d) => a + parseFloat(d.fees), 0);
    
    const growthRate = firstHalfTotal > 0
      ? ((secondHalfTotal - firstHalfTotal) / firstHalfTotal) * 100
      : 0;

    return {
      totalRevenue: totalRevenue.toFixed(6),
      revenueByNetwork,
      revenueByDay,
      projectedMonthlyRevenue: (totalRevenue * (30 / this.getWindowDays(window))).toFixed(6),
      growthRate,
    };
  }

  /**
   * Get top payers
   */
  async getTopPayers(limit: number = 10): Promise<TopPayer[]> {
    const payerTotals = new Map<string, { total: number; count: number; last: number }>();
    
    for (const payment of this.payments.values()) {
      if (payment.status !== 'settled') continue;
      
      const current = payerTotals.get(payment.payer) || { total: 0, count: 0, last: 0 };
      current.total += payment.amount;
      current.count++;
      current.last = Math.max(current.last, payment.settledAt || 0);
      payerTotals.set(payment.payer, current);
    }

    return Array.from(payerTotals.entries())
      .map(([address, data]) => ({
        address,
        totalPaid: data.total.toFixed(6),
        paymentCount: data.count,
        lastPayment: data.last,
      }))
      .sort((a, b) => parseFloat(b.totalPaid) - parseFloat(a.totalPaid))
      .slice(0, limit);
  }

  /**
   * Get top payees
   */
  async getTopPayees(limit: number = 10): Promise<TopPayee[]> {
    const payeeTotals = new Map<string, { total: number; count: number; payers: Set<string> }>();
    
    for (const payment of this.payments.values()) {
      if (payment.status !== 'settled') continue;
      
      const current = payeeTotals.get(payment.payee) || { total: 0, count: 0, payers: new Set() };
      current.total += payment.amount;
      current.count++;
      current.payers.add(payment.payer);
      payeeTotals.set(payment.payee, current);
    }

    return Array.from(payeeTotals.entries())
      .map(([address, data]) => ({
        address,
        totalReceived: data.total.toFixed(6),
        paymentCount: data.count,
        uniquePayers: data.payers.size,
      }))
      .sort((a, b) => parseFloat(b.totalReceived) - parseFloat(a.totalReceived))
      .slice(0, limit);
  }

  /**
   * Get time series data
   */
  async getTimeSeries(
    metric: 'volume' | 'fees' | 'payments',
    window: TimeWindow
  ): Promise<TimeSeries> {
    const cutoff = this.getWindowCutoff(window);
    const payments = Array.from(this.payments.values())
      .filter(p => p.status === 'settled' && p.settledAt && p.settledAt >= cutoff);

    // Group by hour or day depending on window
    const groupBy = ['1h', '6h', '24h'].includes(window) ? 'hour' : 'day';
    const points = new Map<number, number>();

    for (const payment of payments) {
      const timestamp = groupBy === 'hour'
        ? Math.floor(payment.settledAt! / 3600000) * 3600000
        : Math.floor(payment.settledAt! / 86400000) * 86400000;

      let value = points.get(timestamp) || 0;
      
      switch (metric) {
        case 'volume':
          value += payment.amount;
          break;
        case 'fees':
          value += payment.fee;
          break;
        case 'payments':
          value += 1;
          break;
      }
      
      points.set(timestamp, value);
    }

    return {
      name: metric,
      window,
      points: Array.from(points.entries())
        .map(([timestamp, value]) => ({ timestamp, value }))
        .sort((a, b) => a.timestamp - b.timestamp),
      aggregation: metric === 'payments' ? 'count' : 'sum',
    };
  }

  // ═══════════════════════════════════════════════════════════════
  // Private Helpers
  // ═══════════════════════════════════════════════════════════════

  private recordPaymentReceived(data: any): void {
    this.payments.set(data.paymentId, {
      id: data.paymentId,
      payer: data.payer,
      payee: data.payee,
      amount: parseFloat(data.amount),
      fee: 0,
      network: data.network,
      status: 'verified',
      verifiedAt: data.timestamp,
    });
  }

  private recordPaymentSettled(data: any): void {
    const payment = this.payments.get(data.paymentId);
    if (payment) {
      payment.status = 'settled';
      payment.settledAt = data.timestamp;
      payment.fee = parseFloat(data.fee);
      payment.transaction = data.transaction;
    }
  }

  private recordPaymentFailed(data: any): void {
    const payment = this.payments.get(data.paymentId);
    if (payment) {
      payment.status = 'failed';
    }
  }

  private getWindowCutoff(window: TimeWindow): number {
    const now = Date.now();
    const ms: Record<TimeWindow, number> = {
      '1h': 3600000,
      '6h': 21600000,
      '24h': 86400000,
      '7d': 604800000,
      '30d': 2592000000,
      '90d': 7776000000,
    };
    return now - ms[window];
  }

  private getWindowDays(window: TimeWindow): number {
    const days: Record<TimeWindow, number> = {
      '1h': 1/24,
      '6h': 0.25,
      '24h': 1,
      '7d': 7,
      '30d': 30,
      '90d': 90,
    };
    return days[window];
  }

  private getChainName(chainId: string): string {
    const names: Record<string, string> = {
      'eip155:8453': 'Base',
      'eip155:42161': 'Arbitrum',
      'eip155:10': 'Optimism',
      'eip155:137': 'Polygon',
      'eip155:1': 'Ethereum',
    };
    return names[chainId] || chainId;
  }

  private calculateMedian(values: number[]): number {
    if (values.length === 0) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0
      ? sorted[mid]
      : (sorted[mid - 1] + sorted[mid]) / 2;
  }

  private calculatePercentile(values: number[], percentile: number): number {
    if (values.length === 0) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[Math.max(0, index)];
  }
}
```

---

## 🏗️ Phase 2: Revenue Tracking

### Task 2.1: Create Revenue Tracker

Create `src/analytics/RevenueTracker.ts`:

```typescript
/**
 * Revenue Tracker
 * Real-time revenue tracking and projections
 */

import { EventEmitter } from 'events';
import type { RevenueBreakdown, DailyStats } from './types.js';
import type { FacilitatorEvent } from '../core/types.js';
import { createLogger } from '../utils/logger.js';

const log = createLogger('RevenueTracker');

interface RevenueRecord {
  timestamp: number;
  type: 'facilitator_fee' | 'gas_sponsorship' | 'premium';
  amount: number;
  network: string;
  paymentId: string;
}

export class RevenueTracker extends EventEmitter {
  private records: RevenueRecord[] = [];
  private dailyTotals: Map<string, number> = new Map();
  private hourlyTotals: Map<string, number> = new Map();

  constructor() {
    super();
    this.startHourlyRollup();
    log.info('Revenue tracker initialized');
  }

  /**
   * Handle payment settled event
   */
  handleSettlement(event: { paymentId: string; fee: string; network: string; timestamp: number }): void {
    const record: RevenueRecord = {
      timestamp: event.timestamp,
      type: 'facilitator_fee',
      amount: parseFloat(event.fee),
      network: event.network || 'unknown',
      paymentId: event.paymentId,
    };

    this.records.push(record);
    this.updateTotals(record);
    
    this.emit('revenue', record);
    
    log.debug('Revenue recorded', {
      amount: record.amount,
      type: record.type,
      network: record.network,
    });
  }

  /**
   * Get current revenue breakdown
   */
  getBreakdown(): RevenueBreakdown {
    const facilitatorFees = this.records
      .filter(r => r.type === 'facilitator_fee')
      .reduce((sum, r) => sum + r.amount, 0);

    const gasSponsorship = this.records
      .filter(r => r.type === 'gas_sponsorship')
      .reduce((sum, r) => sum + r.amount, 0);

    const premiumFeatures = this.records
      .filter(r => r.type === 'premium')
      .reduce((sum, r) => sum + r.amount, 0);

    return {
      facilitatorFees: facilitatorFees.toFixed(6),
      gasSponsorship: gasSponsorship.toFixed(6),
      premiumFeatures: premiumFeatures.toFixed(6),
      total: (facilitatorFees + gasSponsorship + premiumFeatures).toFixed(6),
    };
  }

  /**
   * Get revenue for today
   */
  getTodayRevenue(): string {
    const today = new Date().toISOString().split('T')[0];
    return (this.dailyTotals.get(today) || 0).toFixed(6);
  }

  /**
   * Get revenue for this hour
   */
  getThisHourRevenue(): string {
    const hour = new Date().toISOString().slice(0, 13);
    return (this.hourlyTotals.get(hour) || 0).toFixed(6);
  }

  /**
   * Get revenue by network
   */
  getRevenueByNetwork(): Record<string, string> {
    const byNetwork: Record<string, number> = {};
    
    for (const record of this.records) {
      byNetwork[record.network] = (byNetwork[record.network] || 0) + record.amount;
    }

    return Object.fromEntries(
      Object.entries(byNetwork).map(([k, v]) => [k, v.toFixed(6)])
    );
  }

  /**
   * Get daily revenue for last N days
   */
  getDailyRevenue(days: number = 30): DailyStats[] {
    const stats: DailyStats[] = [];
    const now = new Date();

    for (let i = 0; i < days; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayRecords = this.records.filter(r => 
        new Date(r.timestamp).toISOString().startsWith(dateStr)
      );

      stats.push({
        date: dateStr,
        payments: dayRecords.length,
        volume: '0', // Would need payment amounts
        fees: dayRecords.reduce((sum, r) => sum + r.amount, 0).toFixed(6),
        uniquePayers: new Set(dayRecords.map(r => r.paymentId)).size,
        uniquePayees: 0,
      });
    }

    return stats.reverse();
  }

  /**
   * Project monthly revenue based on current trend
   */
  getProjectedMonthlyRevenue(): string {
    const last7Days = this.records.filter(
      r => r.timestamp > Date.now() - 7 * 24 * 60 * 60 * 1000
    );
    
    const weeklyTotal = last7Days.reduce((sum, r) => sum + r.amount, 0);
    const dailyAverage = weeklyTotal / 7;
    const monthlyProjection = dailyAverage * 30;

    return monthlyProjection.toFixed(6);
  }

  /**
   * Update daily and hourly totals
   */
  private updateTotals(record: RevenueRecord): void {
    const date = new Date(record.timestamp);
    const dayKey = date.toISOString().split('T')[0];
    const hourKey = date.toISOString().slice(0, 13);

    this.dailyTotals.set(dayKey, (this.dailyTotals.get(dayKey) || 0) + record.amount);
    this.hourlyTotals.set(hourKey, (this.hourlyTotals.get(hourKey) || 0) + record.amount);
  }

  /**
   * Start hourly rollup job
   */
  private startHourlyRollup(): void {
    // Clean up old hourly data every hour
    setInterval(() => {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 7);
      const cutoffKey = cutoff.toISOString().slice(0, 13);

      for (const key of this.hourlyTotals.keys()) {
        if (key < cutoffKey) {
          this.hourlyTotals.delete(key);
        }
      }
    }, 60 * 60 * 1000);
  }

  /**
   * Export records for backup
   */
  exportRecords(): RevenueRecord[] {
    return [...this.records];
  }

  /**
   * Import records from backup
   */
  importRecords(records: RevenueRecord[]): void {
    this.records = records;
    for (const record of records) {
      this.updateTotals(record);
    }
    log.info('Imported revenue records', { count: records.length });
  }
}
```

---

## 🏗️ Phase 3: Dashboard Data

### Task 3.1: Create Dashboard Service

Create `src/analytics/Dashboard.ts`:

```typescript
/**
 * Dashboard Service
 * Aggregates data for dashboard display
 */

import type { AnalyticsService } from './AnalyticsService.js';
import type { RevenueTracker } from './RevenueTracker.js';
import type { MetricsCollector } from './MetricsCollector.js';
import type { TimeWindow } from './types.js';
import { createLogger } from '../utils/logger.js';

const log = createLogger('Dashboard');

export interface DashboardData {
  summary: {
    totalRevenue: string;
    todayRevenue: string;
    totalPayments: number;
    successRate: number;
    activeNetworks: number;
  };
  charts: {
    revenueTimeSeries: { timestamp: number; value: number }[];
    paymentTimeSeries: { timestamp: number; value: number }[];
    networkDistribution: { network: string; volume: number }[];
  };
  topLists: {
    topPayers: { address: string; amount: string }[];
    topPayees: { address: string; amount: string }[];
  };
  health: {
    status: 'healthy' | 'degraded' | 'critical';
    pendingPayments: number;
    averageSettlementTime: number;
    errorRate: number;
  };
}

export class DashboardService {
  private analytics: AnalyticsService;
  private revenue: RevenueTracker;
  private metrics: MetricsCollector;

  constructor(
    analytics: AnalyticsService,
    revenue: RevenueTracker,
    metrics: MetricsCollector
  ) {
    this.analytics = analytics;
    this.revenue = revenue;
    this.metrics = metrics;
  }

  /**
   * Get complete dashboard data
   */
  async getDashboardData(window: TimeWindow = '24h'): Promise<DashboardData> {
    const [
      paymentMetrics,
      networkMetrics,
      revenueMetrics,
      topPayers,
      topPayees,
      revenueTimeSeries,
      paymentTimeSeries,
    ] = await Promise.all([
      this.analytics.getPaymentMetrics(window),
      this.analytics.getNetworkMetrics(window),
      this.analytics.getRevenueMetrics(window as any),
      this.analytics.getTopPayers(5),
      this.analytics.getTopPayees(5),
      this.analytics.getTimeSeries('fees', window),
      this.analytics.getTimeSeries('payments', window),
    ]);

    const errorRate = paymentMetrics.totalPayments > 0
      ? (paymentMetrics.failedPayments / paymentMetrics.totalPayments) * 100
      : 0;

    return {
      summary: {
        totalRevenue: revenueMetrics.totalRevenue,
        todayRevenue: this.revenue.getTodayRevenue(),
        totalPayments: paymentMetrics.totalPayments,
        successRate: paymentMetrics.totalPayments > 0
          ? (paymentMetrics.successfulPayments / paymentMetrics.totalPayments) * 100
          : 100,
        activeNetworks: networkMetrics.length,
      },
      charts: {
        revenueTimeSeries: revenueTimeSeries.points,
        paymentTimeSeries: paymentTimeSeries.points,
        networkDistribution: networkMetrics.map(n => ({
          network: n.chainName,
          volume: parseFloat(n.totalVolume),
        })),
      },
      topLists: {
        topPayers: topPayers.map(p => ({
          address: p.address,
          amount: p.totalPaid,
        })),
        topPayees: topPayees.map(p => ({
          address: p.address,
          amount: p.totalReceived,
        })),
      },
      health: {
        status: this.calculateHealthStatus(errorRate, paymentMetrics.averageSettlementTime),
        pendingPayments: 0, // TODO: Get from metrics
        averageSettlementTime: paymentMetrics.averageSettlementTime,
        errorRate,
      },
    };
  }

  /**
   * Get real-time stats for live updates
   */
  async getRealTimeStats(): Promise<{
    paymentsPerMinute: number;
    revenuePerHour: string;
    pendingSettlements: number;
    activeConnections: number;
  }> {
    return {
      paymentsPerMinute: 0, // TODO: Calculate from recent payments
      revenuePerHour: this.revenue.getThisHourRevenue(),
      pendingSettlements: 0,
      activeConnections: 0,
    };
  }

  /**
   * Calculate health status
   */
  private calculateHealthStatus(
    errorRate: number,
    avgSettlementTime: number
  ): 'healthy' | 'degraded' | 'critical' {
    if (errorRate > 10 || avgSettlementTime > 60000) {
      return 'critical';
    }
    if (errorRate > 5 || avgSettlementTime > 30000) {
      return 'degraded';
    }
    return 'healthy';
  }
}
```

---

## 🏗️ Phase 4: Export & Integration

### Task 4.1: Create Analytics Index

Create `src/analytics/index.ts`:

```typescript
/**
 * Analytics module exports
 */

export { AnalyticsService } from './AnalyticsService.js';
export { MetricsCollector } from './MetricsCollector.js';
export { RevenueTracker } from './RevenueTracker.js';
export { DashboardService, type DashboardData } from './Dashboard.js';
export * from './types.js';

// Factory function to create all analytics components
import type { FacilitatorServer } from '../core/FacilitatorServer.js';

export interface AnalyticsComponents {
  analytics: AnalyticsService;
  metrics: MetricsCollector;
  revenue: RevenueTracker;
  dashboard: DashboardService;
}

export function createAnalyticsStack(
  facilitator: FacilitatorServer
): AnalyticsComponents {
  const analytics = new AnalyticsService();
  const metrics = new MetricsCollector();
  const revenue = new RevenueTracker();
  const dashboard = new DashboardService(analytics, revenue, metrics);

  // Wire up event handlers
  facilitator.on('event', (event) => {
    analytics.handleEvent(event);
    metrics.handleEvent(event);
    
    if (event.type === 'payment:settled') {
      revenue.handleSettlement(event.data);
    }
  });

  return { analytics, metrics, revenue, dashboard };
}
```

### Task 4.2: Create Prometheus Endpoint

Add to Agent 3's routes - `src/api/routes/metrics.ts`:

```typescript
/**
 * Prometheus Metrics Endpoint
 */

import { Hono } from 'hono';
import type { MetricsCollector } from '../../analytics/MetricsCollector.js';

export function createMetricsRoute(metrics: MetricsCollector): Hono {
  const app = new Hono();

  app.get('/', async (c) => {
    const output = await metrics.getMetrics();
    return c.text(output, 200, {
      'Content-Type': metrics.getContentType(),
    });
  });

  return app;
}
```

---

## 📋 Phase Completion Checklists

### Phase 1 Checklist
- [ ] Analytics types defined
- [ ] MetricsCollector tracks all events
- [ ] AnalyticsService computes metrics
- [ ] Prometheus format output works

### Phase 2 Checklist
- [ ] RevenueTracker records all fees
- [ ] Daily/hourly aggregations work
- [ ] Projections calculated correctly

### Phase 3 Checklist
- [ ] Dashboard aggregates all data
- [ ] Real-time stats available
- [ ] Health status computed

### Phase 4 Checklist
- [ ] All components exported
- [ ] Factory function creates stack
- [ ] Prometheus endpoint integrated

---

## ⏭️ After Analytics Completion

### Your Next Project: Analytics Dashboard UI

Once facilitator is complete, build the dashboard frontend:

**See:** `AGENT_4_PHASE2_DASHBOARD_UI.md`

Key components:
1. React dashboard with charts
2. Real-time WebSocket updates
3. Revenue and payment visualizations
4. Network health monitoring

---

## 🧪 Testing Requirements

Create `tests/analytics.test.ts`:

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { AnalyticsService } from '../src/analytics/AnalyticsService.js';
import { MetricsCollector } from '../src/analytics/MetricsCollector.js';
import { RevenueTracker } from '../src/analytics/RevenueTracker.js';

describe('AnalyticsService', () => {
  let analytics: AnalyticsService;

  beforeEach(() => {
    analytics = new AnalyticsService();
  });

  it('calculates payment metrics correctly', async () => {
    // Simulate events
    analytics.handleEvent({
      type: 'payment:settled',
      data: { paymentId: '1', fee: '0.01', timestamp: Date.now() },
    });

    const metrics = await analytics.getPaymentMetrics('24h');
    expect(metrics.successfulPayments).toBe(1);
  });
});

describe('RevenueTracker', () => {
  it('tracks daily revenue', () => {
    const tracker = new RevenueTracker();
    tracker.handleSettlement({
      paymentId: '1',
      fee: '1.00',
      network: 'base',
      timestamp: Date.now(),
    });

    expect(parseFloat(tracker.getTodayRevenue())).toBe(1);
  });
});
```

---

## 🔗 Files You'll Create

```
packages/facilitator/src/analytics/
├── index.ts
├── types.ts
├── AnalyticsService.ts
├── MetricsCollector.ts
├── RevenueTracker.ts
└── Dashboard.ts
```
