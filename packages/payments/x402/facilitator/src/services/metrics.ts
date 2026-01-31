/**
 * Prometheus Metrics Service
 * 
 * Exposes metrics for monitoring the facilitator in production.
 * Provides insights into payment volume, fees, latency, and errors.
 * 
 * @author nich
 * @license MIT
 */

import { Registry, Counter, Gauge, Histogram, collectDefaultMetrics } from 'prom-client';
import { logger } from '../middleware/logger.js';

/**
 * Metrics registry
 */
const register = new Registry();

// Add default Node.js metrics
collectDefaultMetrics({ register });

/**
 * Payment counters
 */
export const paymentVerifyTotal = new Counter({
  name: 'facilitator_payment_verify_total',
  help: 'Total number of payment verifications',
  labelNames: ['network', 'token', 'status'],
  registers: [register],
});

export const paymentSettleTotal = new Counter({
  name: 'facilitator_payment_settle_total',
  help: 'Total number of payment settlements',
  labelNames: ['network', 'token', 'status'],
  registers: [register],
});

export const paymentQuoteTotal = new Counter({
  name: 'facilitator_payment_quote_total',
  help: 'Total number of payment quotes generated',
  labelNames: ['network', 'token'],
  registers: [register],
});

/**
 * Volume metrics
 */
export const paymentVolumeTotal = new Counter({
  name: 'facilitator_payment_volume_total',
  help: 'Total payment volume processed in USD',
  labelNames: ['network', 'token'],
  registers: [register],
});

export const feesCollectedTotal = new Counter({
  name: 'facilitator_fees_collected_total',
  help: 'Total fees collected in USD',
  labelNames: ['network', 'token'],
  registers: [register],
});

/**
 * Active gauges
 */
export const activeConnections = new Gauge({
  name: 'facilitator_active_connections',
  help: 'Number of active connections',
  registers: [register],
});

export const pendingSettlements = new Gauge({
  name: 'facilitator_pending_settlements',
  help: 'Number of pending settlements',
  labelNames: ['network'],
  registers: [register],
});

export const cacheSize = new Gauge({
  name: 'facilitator_cache_size',
  help: 'Number of items in payment cache',
  registers: [register],
});

export const blockHeight = new Gauge({
  name: 'facilitator_block_height',
  help: 'Current block height by network',
  labelNames: ['network'],
  registers: [register],
});

/**
 * Latency histograms
 */
export const verifyLatency = new Histogram({
  name: 'facilitator_verify_duration_seconds',
  help: 'Payment verification latency in seconds',
  labelNames: ['network', 'status'],
  buckets: [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
  registers: [register],
});

export const settleLatency = new Histogram({
  name: 'facilitator_settle_duration_seconds',
  help: 'Payment settlement latency in seconds',
  labelNames: ['network', 'status'],
  buckets: [0.1, 0.5, 1, 2.5, 5, 10, 30, 60],
  registers: [register],
});

export const rpcLatency = new Histogram({
  name: 'facilitator_rpc_duration_seconds',
  help: 'RPC call latency in seconds',
  labelNames: ['network', 'method'],
  buckets: [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
  registers: [register],
});

/**
 * Error counters
 */
export const errorsTotal = new Counter({
  name: 'facilitator_errors_total',
  help: 'Total number of errors',
  labelNames: ['type', 'network', 'operation'],
  registers: [register],
});

export const rpcErrorsTotal = new Counter({
  name: 'facilitator_rpc_errors_total',
  help: 'Total number of RPC errors',
  labelNames: ['network', 'method'],
  registers: [register],
});

/**
 * Health metrics
 */
export const healthStatus = new Gauge({
  name: 'facilitator_health_status',
  help: 'Health status (1 = healthy, 0 = unhealthy)',
  registers: [register],
});

export const uptimeSeconds = new Gauge({
  name: 'facilitator_uptime_seconds',
  help: 'Server uptime in seconds',
  registers: [register],
});

/**
 * Business metrics
 */
export const uniquePayersTotal = new Gauge({
  name: 'facilitator_unique_payers_total',
  help: 'Total number of unique payers',
  registers: [register],
});

export const uniquePayeesTotal = new Gauge({
  name: 'facilitator_unique_payees_total',
  help: 'Total number of unique payees',
  registers: [register],
});

export const avgPaymentSize = new Gauge({
  name: 'facilitator_avg_payment_size',
  help: 'Average payment size in USD',
  labelNames: ['network'],
  registers: [register],
});

/**
 * Get metrics registry
 */
export function getMetricsRegistry(): Registry {
  return register;
}

/**
 * Get metrics as string for Prometheus scraping
 */
export async function getMetrics(): Promise<string> {
  return register.metrics();
}

/**
 * Get content type for metrics endpoint
 */
export function getMetricsContentType(): string {
  return register.contentType;
}

/**
 * Helper to time async operations
 */
export function createTimer(histogram: Histogram, labels: Record<string, string>) {
  const startTime = Date.now();
  
  return {
    end: (overrideLabels?: Record<string, string>) => {
      const duration = (Date.now() - startTime) / 1000;
      histogram.observe({ ...labels, ...overrideLabels }, duration);
      return duration;
    },
  };
}

/**
 * Record a payment verification
 */
export function recordVerification(params: {
  network: string;
  token: string;
  success: boolean;
  durationMs: number;
}): void {
  const status = params.success ? 'success' : 'failure';
  
  paymentVerifyTotal.inc({
    network: params.network,
    token: params.token,
    status,
  });
  
  verifyLatency.observe(
    { network: params.network, status },
    params.durationMs / 1000
  );
}

/**
 * Record a payment settlement
 */
export function recordSettlement(params: {
  network: string;
  token: string;
  success: boolean;
  amount: number;
  fee: number;
  durationMs: number;
}): void {
  const status = params.success ? 'success' : 'failure';
  
  paymentSettleTotal.inc({
    network: params.network,
    token: params.token,
    status,
  });
  
  if (params.success) {
    paymentVolumeTotal.inc(
      { network: params.network, token: params.token },
      params.amount
    );
    
    feesCollectedTotal.inc(
      { network: params.network, token: params.token },
      params.fee
    );
  }
  
  settleLatency.observe(
    { network: params.network, status },
    params.durationMs / 1000
  );
}

/**
 * Record an error
 */
export function recordError(params: {
  type: string;
  network?: string;
  operation: string;
}): void {
  errorsTotal.inc({
    type: params.type,
    network: params.network || 'unknown',
    operation: params.operation,
  });
}

/**
 * Update health status
 */
export function updateHealth(healthy: boolean): void {
  healthStatus.set(healthy ? 1 : 0);
  uptimeSeconds.set(process.uptime());
}

/**
 * Metrics middleware for Express
 */
export function metricsMiddleware() {
  return async (req: any, res: any, next: any) => {
    if (req.path === '/metrics') {
      try {
        const metrics = await getMetrics();
        res.set('Content-Type', getMetricsContentType());
        res.send(metrics);
      } catch (error) {
        logger.error('Error generating metrics', { error });
        res.status(500).send('Error generating metrics');
      }
    } else {
      next();
    }
  };
}

logger.info('Prometheus metrics initialized');
