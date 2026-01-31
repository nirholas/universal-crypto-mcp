/**
 * Prometheus Metrics for Gateway
 * 
 * @author nirholas (Nich)
 * @license Apache-2.0
 */

import { Request, Response, NextFunction } from 'express';

// ============================================================================
// Metrics Collection
// ============================================================================

class Counter {
  private name: string;
  private help: string;
  private labelNames: string[];
  private values: Map<string, number> = new Map();

  constructor(options: { name: string; help: string; labelNames?: string[] }) {
    this.name = options.name;
    this.help = options.help;
    this.labelNames = options.labelNames || [];
  }

  inc(labels: Record<string, string> = {}, value = 1): void {
    const key = this.labelsToKey(labels);
    this.values.set(key, (this.values.get(key) || 0) + value);
  }

  get(labels: Record<string, string> = {}): number {
    return this.values.get(this.labelsToKey(labels)) || 0;
  }

  private labelsToKey(labels: Record<string, string>): string {
    return JSON.stringify(labels);
  }

  toPrometheus(): string {
    const lines: string[] = [];
    lines.push(`# HELP ${this.name} ${this.help}`);
    lines.push(`# TYPE ${this.name} counter`);
    
    for (const [key, value] of this.values) {
      const labels = JSON.parse(key);
      const labelStr = Object.entries(labels)
        .map(([k, v]) => `${k}="${v}"`)
        .join(',');
      lines.push(`${this.name}${labelStr ? `{${labelStr}}` : ''} ${value}`);
    }
    
    return lines.join('\n');
  }
}

class Gauge {
  private name: string;
  private help: string;
  private labelNames: string[];
  private values: Map<string, number> = new Map();

  constructor(options: { name: string; help: string; labelNames?: string[] }) {
    this.name = options.name;
    this.help = options.help;
    this.labelNames = options.labelNames || [];
  }

  set(labels: Record<string, string>, value: number): void {
    this.values.set(this.labelsToKey(labels), value);
  }

  inc(labels: Record<string, string> = {}, value = 1): void {
    const key = this.labelsToKey(labels);
    this.values.set(key, (this.values.get(key) || 0) + value);
  }

  dec(labels: Record<string, string> = {}, value = 1): void {
    const key = this.labelsToKey(labels);
    this.values.set(key, (this.values.get(key) || 0) - value);
  }

  private labelsToKey(labels: Record<string, string>): string {
    return JSON.stringify(labels);
  }

  toPrometheus(): string {
    const lines: string[] = [];
    lines.push(`# HELP ${this.name} ${this.help}`);
    lines.push(`# TYPE ${this.name} gauge`);
    
    for (const [key, value] of this.values) {
      const labels = JSON.parse(key);
      const labelStr = Object.entries(labels)
        .map(([k, v]) => `${k}="${v}"`)
        .join(',');
      lines.push(`${this.name}${labelStr ? `{${labelStr}}` : ''} ${value}`);
    }
    
    return lines.join('\n');
  }
}

class Histogram {
  private name: string;
  private help: string;
  private labelNames: string[];
  private buckets: number[];
  private values: Map<string, { sum: number; count: number; buckets: number[] }> = new Map();

  constructor(options: { name: string; help: string; labelNames?: string[]; buckets?: number[] }) {
    this.name = options.name;
    this.help = options.help;
    this.labelNames = options.labelNames || [];
    this.buckets = options.buckets || [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10];
  }

  observe(labels: Record<string, string>, value: number): void {
    const key = this.labelsToKey(labels);
    let data = this.values.get(key);
    
    if (!data) {
      data = { sum: 0, count: 0, buckets: new Array(this.buckets.length).fill(0) };
      this.values.set(key, data);
    }

    data.sum += value;
    data.count++;
    
    for (let i = 0; i < this.buckets.length; i++) {
      if (value <= this.buckets[i]) {
        data.buckets[i]++;
      }
    }
  }

  private labelsToKey(labels: Record<string, string>): string {
    return JSON.stringify(labels);
  }

  toPrometheus(): string {
    const lines: string[] = [];
    lines.push(`# HELP ${this.name} ${this.help}`);
    lines.push(`# TYPE ${this.name} histogram`);
    
    for (const [key, data] of this.values) {
      const labels = JSON.parse(key);
      const labelStr = Object.entries(labels)
        .map(([k, v]) => `${k}="${v}"`)
        .join(',');
      const labelPrefix = labelStr ? `{${labelStr},` : '{';
      
      let cumulative = 0;
      for (let i = 0; i < this.buckets.length; i++) {
        cumulative += data.buckets[i];
        lines.push(`${this.name}_bucket${labelPrefix}le="${this.buckets[i]}"} ${cumulative}`);
      }
      lines.push(`${this.name}_bucket${labelPrefix}le="+Inf"} ${data.count}`);
      lines.push(`${this.name}_sum${labelStr ? `{${labelStr}}` : ''} ${data.sum}`);
      lines.push(`${this.name}_count${labelStr ? `{${labelStr}}` : ''} ${data.count}`);
    }
    
    return lines.join('\n');
  }
}

// ============================================================================
// Gateway Metrics
// ============================================================================

export const metrics = {
  // HTTP metrics
  httpRequestsTotal: new Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'path', 'status'],
  }),

  httpRequestDuration: new Histogram({
    name: 'http_request_duration_seconds',
    help: 'HTTP request duration in seconds',
    labelNames: ['method', 'path', 'status'],
    buckets: [0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
  }),

  httpActiveRequests: new Gauge({
    name: 'http_active_requests',
    help: 'Number of active HTTP requests',
    labelNames: ['method'],
  }),

  // x402 Payment metrics
  x402PaymentsTotal: new Counter({
    name: 'x402_payments_total',
    help: 'Total number of x402 payment attempts',
    labelNames: ['status', 'token', 'chain'],
  }),

  x402PaymentAmount: new Histogram({
    name: 'x402_payment_amount_usd',
    help: 'x402 payment amounts in USD',
    labelNames: ['token', 'chain'],
    buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1, 5, 10, 50, 100],
  }),

  x402RevenueTotal: new Counter({
    name: 'x402_revenue_total_usd',
    help: 'Total x402 revenue in USD',
    labelNames: ['token', 'chain', 'resource'],
  }),

  // Rate limiting metrics
  rateLimitHits: new Counter({
    name: 'rate_limit_hits_total',
    help: 'Total number of rate limit hits',
    labelNames: ['tier', 'path'],
  }),

  // MCP metrics
  mcpToolCalls: new Counter({
    name: 'mcp_tool_calls_total',
    help: 'Total number of MCP tool calls',
    labelNames: ['tool', 'status'],
  }),

  mcpToolDuration: new Histogram({
    name: 'mcp_tool_duration_seconds',
    help: 'MCP tool execution duration',
    labelNames: ['tool'],
    buckets: [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10, 30],
  }),

  // System metrics
  processMemoryBytes: new Gauge({
    name: 'process_memory_bytes',
    help: 'Process memory usage in bytes',
    labelNames: ['type'],
  }),

  processUptimeSeconds: new Gauge({
    name: 'process_uptime_seconds',
    help: 'Process uptime in seconds',
  }),
};

// ============================================================================
// Middleware
// ============================================================================

export function metricsMiddleware(req: Request, res: Response, next: NextFunction): void {
  const startTime = process.hrtime.bigint();
  const method = req.method;

  // Track active requests
  metrics.httpActiveRequests.inc({ method });

  // Capture original end function
  const originalEnd = res.end;
  
  res.end = function(...args: Parameters<typeof originalEnd>): ReturnType<typeof originalEnd> {
    const duration = Number(process.hrtime.bigint() - startTime) / 1e9;
    const path = normalizePath(req.path);
    const status = res.statusCode.toString();

    // Record metrics
    metrics.httpRequestsTotal.inc({ method, path, status });
    metrics.httpRequestDuration.observe({ method, path, status }, duration);
    metrics.httpActiveRequests.dec({ method });

    // Track x402 payments
    if (res.statusCode === 402) {
      metrics.x402PaymentsTotal.inc({ status: 'required', token: 'USDC', chain: 'base' });
    } else if (req.x402Payment?.verified) {
      metrics.x402PaymentsTotal.inc({ status: 'success', token: req.x402Payment.token, chain: req.x402Payment.chain });
      metrics.x402PaymentAmount.observe(
        { token: req.x402Payment.token, chain: req.x402Payment.chain },
        parseFloat(req.x402Payment.amount)
      );
      metrics.x402RevenueTotal.inc(
        { token: req.x402Payment.token, chain: req.x402Payment.chain, resource: path },
        parseFloat(req.x402Payment.amount)
      );
    }

    return originalEnd.apply(this as any, args);
  } as typeof originalEnd;

  next();
}

/**
 * Normalize path for metrics (remove IDs and parameters)
 */
function normalizePath(path: string): string {
  return path
    .replace(/\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, '/:id')
    .replace(/\/0x[0-9a-fA-F]{40}/g, '/:address')
    .replace(/\/[0-9]+/g, '/:id')
    .replace(/\/[A-Z]{2,10}/g, '/:symbol');
}

/**
 * Update system metrics
 */
function updateSystemMetrics(): void {
  const memory = process.memoryUsage();
  metrics.processMemoryBytes.set({ type: 'rss' }, memory.rss);
  metrics.processMemoryBytes.set({ type: 'heapTotal' }, memory.heapTotal);
  metrics.processMemoryBytes.set({ type: 'heapUsed' }, memory.heapUsed);
  metrics.processMemoryBytes.set({ type: 'external' }, memory.external);
  metrics.processUptimeSeconds.set({}, process.uptime());
}

// Update system metrics every 15 seconds
setInterval(updateSystemMetrics, 15000);
updateSystemMetrics();

// ============================================================================
// Metrics Endpoint
// ============================================================================

export function metricsEndpoint(_req: Request, res: Response): void {
  const lines: string[] = [];

  // Add all metrics
  lines.push(metrics.httpRequestsTotal.toPrometheus());
  lines.push(metrics.httpRequestDuration.toPrometheus());
  lines.push(metrics.httpActiveRequests.toPrometheus());
  lines.push(metrics.x402PaymentsTotal.toPrometheus());
  lines.push(metrics.x402PaymentAmount.toPrometheus());
  lines.push(metrics.x402RevenueTotal.toPrometheus());
  lines.push(metrics.rateLimitHits.toPrometheus());
  lines.push(metrics.mcpToolCalls.toPrometheus());
  lines.push(metrics.mcpToolDuration.toPrometheus());
  lines.push(metrics.processMemoryBytes.toPrometheus());
  lines.push(metrics.processUptimeSeconds.toPrometheus());

  res.set('Content-Type', 'text/plain; version=0.0.4');
  res.send(lines.join('\n\n'));
}

export default metrics;

