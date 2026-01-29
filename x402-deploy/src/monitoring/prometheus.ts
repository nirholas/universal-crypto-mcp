/**
 * Prometheus Metrics
 * Production-grade metrics collection for x402-deploy
 */

import type { Request, Response, NextFunction, RequestHandler } from "express";

/**
 * Metric types
 */
export type MetricType = "counter" | "gauge" | "histogram" | "summary";

export interface MetricOptions {
  name: string;
  help: string;
  labelNames?: string[];
}

export interface HistogramOptions extends MetricOptions {
  buckets?: number[];
}

export interface CounterValue {
  labels: Record<string, string>;
  value: number;
}

export interface GaugeValue {
  labels: Record<string, string>;
  value: number;
}

export interface HistogramValue {
  labels: Record<string, string>;
  sum: number;
  count: number;
  buckets: { le: number | string; count: number }[];
}

/**
 * Simple Counter implementation
 */
class Counter {
  private values: Map<string, number> = new Map();
  private options: MetricOptions;

  constructor(options: MetricOptions) {
    this.options = options;
  }

  private getLabelKey(labels: Record<string, string>): string {
    return Object.entries(labels)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}="${v}"`)
      .join(",");
  }

  inc(labels: Record<string, string | number> = {}, value = 1): void {
    const stringLabels = Object.fromEntries(
      Object.entries(labels).map(([k, v]) => [k, String(v)])
    );
    const key = this.getLabelKey(stringLabels);
    this.values.set(key, (this.values.get(key) || 0) + value);
  }

  get(): CounterValue[] {
    return Array.from(this.values.entries()).map(([key, value]) => {
      const labels: Record<string, string> = {};
      if (key) {
        for (const pair of key.split(",")) {
          const match = pair.match(/^(.+)="(.+)"$/);
          if (match) {
            labels[match[1]] = match[2];
          }
        }
      }
      return { labels, value };
    });
  }

  format(): string {
    const lines: string[] = [];
    lines.push(`# HELP ${this.options.name} ${this.options.help}`);
    lines.push(`# TYPE ${this.options.name} counter`);
    
    for (const { labels, value } of this.get()) {
      const labelStr = Object.entries(labels)
        .map(([k, v]) => `${k}="${v}"`)
        .join(",");
      lines.push(`${this.options.name}${labelStr ? `{${labelStr}}` : ""} ${value}`);
    }
    
    return lines.join("\n");
  }
}

/**
 * Simple Gauge implementation
 */
class Gauge {
  private values: Map<string, number> = new Map();
  private options: MetricOptions;

  constructor(options: MetricOptions) {
    this.options = options;
  }

  private getLabelKey(labels: Record<string, string>): string {
    return Object.entries(labels)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}="${v}"`)
      .join(",");
  }

  set(value: number, labels: Record<string, string> = {}): void {
    const key = this.getLabelKey(labels);
    this.values.set(key, value);
  }

  inc(labels: Record<string, string> = {}, value = 1): void {
    const key = this.getLabelKey(labels);
    this.values.set(key, (this.values.get(key) || 0) + value);
  }

  dec(labels: Record<string, string> = {}, value = 1): void {
    const key = this.getLabelKey(labels);
    this.values.set(key, (this.values.get(key) || 0) - value);
  }

  get(): GaugeValue[] {
    return Array.from(this.values.entries()).map(([key, value]) => {
      const labels: Record<string, string> = {};
      if (key) {
        for (const pair of key.split(",")) {
          const match = pair.match(/^(.+)="(.+)"$/);
          if (match) {
            labels[match[1]] = match[2];
          }
        }
      }
      return { labels, value };
    });
  }

  format(): string {
    const lines: string[] = [];
    lines.push(`# HELP ${this.options.name} ${this.options.help}`);
    lines.push(`# TYPE ${this.options.name} gauge`);
    
    for (const { labels, value } of this.get()) {
      const labelStr = Object.entries(labels)
        .map(([k, v]) => `${k}="${v}"`)
        .join(",");
      lines.push(`${this.options.name}${labelStr ? `{${labelStr}}` : ""} ${value}`);
    }
    
    return lines.join("\n");
  }
}

/**
 * Simple Histogram implementation
 */
class Histogram {
  private values: Map<
    string,
    { sum: number; count: number; bucketCounts: Map<number, number> }
  > = new Map();
  private options: HistogramOptions;
  private buckets: number[];

  constructor(options: HistogramOptions) {
    this.options = options;
    this.buckets = options.buckets || [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10];
  }

  private getLabelKey(labels: Record<string, string>): string {
    return Object.entries(labels)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}="${v}"`)
      .join(",");
  }

  observe(labels: Record<string, string | number>, value: number): void {
    const stringLabels = Object.fromEntries(
      Object.entries(labels).map(([k, v]) => [k, String(v)])
    );
    const key = this.getLabelKey(stringLabels);
    
    let data = this.values.get(key);
    if (!data) {
      data = { sum: 0, count: 0, bucketCounts: new Map() };
      for (const bucket of this.buckets) {
        data.bucketCounts.set(bucket, 0);
      }
      this.values.set(key, data);
    }

    data.sum += value;
    data.count++;

    for (const bucket of this.buckets) {
      if (value <= bucket) {
        data.bucketCounts.set(bucket, (data.bucketCounts.get(bucket) || 0) + 1);
      }
    }
  }

  get(): HistogramValue[] {
    return Array.from(this.values.entries()).map(([key, data]) => {
      const labels: Record<string, string> = {};
      if (key) {
        for (const pair of key.split(",")) {
          const match = pair.match(/^(.+)="(.+)"$/);
          if (match) {
            labels[match[1]] = match[2];
          }
        }
      }

      const buckets = this.buckets.map((le) => ({
        le,
        count: data.bucketCounts.get(le) || 0,
      }));
      buckets.push({ le: "+Inf", count: data.count });

      // Make buckets cumulative
      let cumulative = 0;
      for (const bucket of buckets) {
        if (typeof bucket.le === "number") {
          cumulative += bucket.count;
          bucket.count = cumulative;
        } else {
          bucket.count = data.count;
        }
      }

      return { labels, sum: data.sum, count: data.count, buckets };
    });
  }

  format(): string {
    const lines: string[] = [];
    lines.push(`# HELP ${this.options.name} ${this.options.help}`);
    lines.push(`# TYPE ${this.options.name} histogram`);
    
    for (const { labels, sum, count, buckets } of this.get()) {
      const labelStr = Object.entries(labels)
        .map(([k, v]) => `${k}="${v}"`)
        .join(",");
      const labelPrefix = labelStr ? `{${labelStr},` : "{";
      
      for (const bucket of buckets) {
        lines.push(
          `${this.options.name}_bucket${labelPrefix}le="${bucket.le}"} ${bucket.count}`
        );
      }
      
      lines.push(`${this.options.name}_sum${labelStr ? `{${labelStr}}` : ""} ${sum}`);
      lines.push(`${this.options.name}_count${labelStr ? `{${labelStr}}` : ""} ${count}`);
    }
    
    return lines.join("\n");
  }
}

/**
 * Metrics Collector for x402-deploy
 * Provides production-grade metrics collection
 */
export class MetricsCollector {
  private startTime: number;

  // Counters
  private requestsTotal: Counter;
  private paymentsTotal: Counter;
  private revenueTotal: Counter;
  private errorsTotal: Counter;
  private creditsUsedTotal: Counter;
  private subscriptionsTotal: Counter;

  // Gauges
  private activeConnections: Gauge;
  private creditsBalance: Gauge;
  private activeSubscriptions: Gauge;

  // Histograms
  private requestDuration: Histogram;
  private paymentVerificationDuration: Histogram;

  constructor() {
    this.startTime = Date.now();

    // Custom metrics
    this.requestsTotal = new Counter({
      name: "x402_requests_total",
      help: "Total number of API requests",
      labelNames: ["method", "route", "status"],
    });

    this.paymentsTotal = new Counter({
      name: "x402_payments_total",
      help: "Total number of payments received",
      labelNames: ["network", "token"],
    });

    this.revenueTotal = new Counter({
      name: "x402_revenue_total",
      help: "Total revenue in USD (6 decimals)",
      labelNames: ["network", "token"],
    });

    this.errorsTotal = new Counter({
      name: "x402_errors_total",
      help: "Total number of errors",
      labelNames: ["type", "code"],
    });

    this.creditsUsedTotal = new Counter({
      name: "x402_credits_used_total",
      help: "Total credits used",
      labelNames: ["route"],
    });

    this.subscriptionsTotal = new Counter({
      name: "x402_subscriptions_total",
      help: "Total subscriptions created",
      labelNames: ["plan"],
    });

    this.activeConnections = new Gauge({
      name: "x402_active_connections",
      help: "Number of active connections",
    });

    this.creditsBalance = new Gauge({
      name: "x402_credits_balance_total",
      help: "Total credits balance across all users",
    });

    this.activeSubscriptions = new Gauge({
      name: "x402_active_subscriptions",
      help: "Number of active subscriptions",
      labelNames: ["plan"],
    });

    this.requestDuration = new Histogram({
      name: "x402_request_duration_seconds",
      help: "Request duration in seconds",
      labelNames: ["method", "route"],
      buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5],
    });

    this.paymentVerificationDuration = new Histogram({
      name: "x402_payment_verification_duration_seconds",
      help: "Payment verification duration in seconds",
      labelNames: ["network"],
      buckets: [0.05, 0.1, 0.2, 0.5, 1, 2],
    });
  }

  /**
   * Track an API request
   */
  trackRequest(method: string, route: string, status: number, duration: number): void {
    this.requestsTotal.inc({ method, route, status });
    this.requestDuration.observe({ method, route }, duration / 1000);
  }

  /**
   * Track a payment
   */
  trackPayment(network: string, token: string, amount: number): void {
    this.paymentsTotal.inc({ network, token });
    this.revenueTotal.inc({ network, token }, amount);
  }

  /**
   * Track an error
   */
  trackError(type: string, code: string): void {
    this.errorsTotal.inc({ type, code });
  }

  /**
   * Track credits usage
   */
  trackCreditsUsed(route: string, amount: number): void {
    this.creditsUsedTotal.inc({ route }, amount);
  }

  /**
   * Track subscription creation
   */
  trackSubscription(plan: string): void {
    this.subscriptionsTotal.inc({ plan });
  }

  /**
   * Set active connections count
   */
  setActiveConnections(count: number): void {
    this.activeConnections.set(count);
  }

  /**
   * Set total credits balance
   */
  setCreditsBalance(balance: number): void {
    this.creditsBalance.set(balance);
  }

  /**
   * Set active subscriptions count
   */
  setActiveSubscriptions(plan: string, count: number): void {
    this.activeSubscriptions.set(count, { plan });
  }

  /**
   * Track payment verification duration
   */
  trackPaymentVerification(network: string, duration: number): void {
    this.paymentVerificationDuration.observe({ network }, duration / 1000);
  }

  /**
   * Get uptime in seconds
   */
  getUptime(): number {
    return (Date.now() - this.startTime) / 1000;
  }

  /**
   * Get all metrics in Prometheus format
   */
  async getMetrics(): Promise<string> {
    const sections: string[] = [];

    // Add process metrics
    const mem = process.memoryUsage();
    sections.push(`# HELP process_resident_memory_bytes Resident memory size in bytes`);
    sections.push(`# TYPE process_resident_memory_bytes gauge`);
    sections.push(`process_resident_memory_bytes ${mem.rss}`);

    sections.push(`# HELP process_heap_bytes Heap memory size in bytes`);
    sections.push(`# TYPE process_heap_bytes gauge`);
    sections.push(`process_heap_bytes ${mem.heapUsed}`);

    sections.push(`# HELP process_uptime_seconds Process uptime in seconds`);
    sections.push(`# TYPE process_uptime_seconds gauge`);
    sections.push(`process_uptime_seconds ${this.getUptime()}`);

    // Add custom metrics
    sections.push(this.requestsTotal.format());
    sections.push(this.paymentsTotal.format());
    sections.push(this.revenueTotal.format());
    sections.push(this.errorsTotal.format());
    sections.push(this.creditsUsedTotal.format());
    sections.push(this.subscriptionsTotal.format());
    sections.push(this.activeConnections.format());
    sections.push(this.creditsBalance.format());
    sections.push(this.activeSubscriptions.format());
    sections.push(this.requestDuration.format());
    sections.push(this.paymentVerificationDuration.format());

    return sections.join("\n\n") + "\n";
  }

  /**
   * Get content type for Prometheus
   */
  getContentType(): string {
    return "text/plain; version=0.0.4; charset=utf-8";
  }

  /**
   * Create Express endpoint for metrics
   */
  createMetricsEndpoint(): RequestHandler {
    return async (req: Request, res: Response) => {
      res.setHeader("Content-Type", this.getContentType());
      res.send(await this.getMetrics());
    };
  }
}

/**
 * Express middleware to track all requests
 */
export function metricsMiddleware(collector: MetricsCollector): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();

    res.on("finish", () => {
      const duration = Date.now() - start;
      collector.trackRequest(req.method, req.path, res.statusCode, duration);
    });

    next();
  };
}

/**
 * Singleton metrics collector instance
 */
let globalCollector: MetricsCollector | undefined;

/**
 * Get or create the global metrics collector
 */
export function getMetricsCollector(): MetricsCollector {
  if (!globalCollector) {
    globalCollector = new MetricsCollector();
  }
  return globalCollector;
}

/**
 * Reset the global metrics collector (useful for testing)
 */
export function resetMetricsCollector(): void {
  globalCollector = undefined;
}
