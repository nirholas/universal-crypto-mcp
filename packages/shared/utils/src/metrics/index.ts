/**
 * Metrics Collection
 * 
 * Provides metrics collection for observability.
 * Compatible with Prometheus format.
 * 
 * @module metrics
 * @author nich <nich@nichxbt.com>
 */

// ============================================================================
// Types
// ============================================================================

export type MetricType = 'counter' | 'gauge' | 'histogram' | 'summary';

export interface MetricLabels {
  [key: string]: string | number | boolean;
}

export interface Metric {
  name: string;
  type: MetricType;
  help: string;
  labels?: MetricLabels;
}

export interface CounterMetric extends Metric {
  type: 'counter';
  value: number;
}

export interface GaugeMetric extends Metric {
  type: 'gauge';
  value: number;
}

export interface HistogramMetric extends Metric {
  type: 'histogram';
  buckets: number[];
  values: number[];
  sum: number;
  count: number;
}

// ============================================================================
// Counter
// ============================================================================

/**
 * Counter metric - monotonically increasing value
 */
export class Counter {
  private name: string;
  private help: string;
  private values = new Map<string, number>();

  constructor(name: string, help: string) {
    this.name = name;
    this.help = help;
  }

  /**
   * Increment counter by value (default 1)
   */
  inc(labels?: MetricLabels, value: number = 1): void {
    const key = this.labelsToKey(labels);
    const current = this.values.get(key) ?? 0;
    this.values.set(key, current + value);
  }

  /**
   * Get current value
   */
  get(labels?: MetricLabels): number {
    return this.values.get(this.labelsToKey(labels)) ?? 0;
  }

  /**
   * Reset counter
   */
  reset(labels?: MetricLabels): void {
    if (labels) {
      this.values.delete(this.labelsToKey(labels));
    } else {
      this.values.clear();
    }
  }

  /**
   * Export in Prometheus format
   */
  toPrometheus(): string {
    const lines = [`# HELP ${this.name} ${this.help}`, `# TYPE ${this.name} counter`];
    
    for (const [key, value] of this.values) {
      const labelStr = key ? `{${key}}` : '';
      lines.push(`${this.name}${labelStr} ${value}`);
    }
    
    return lines.join('\n');
  }

  private labelsToKey(labels?: MetricLabels): string {
    if (!labels) return '';
    return Object.entries(labels)
      .map(([k, v]) => `${k}="${v}"`)
      .join(',');
  }
}

// ============================================================================
// Gauge
// ============================================================================

/**
 * Gauge metric - value that can go up and down
 */
export class Gauge {
  private name: string;
  private help: string;
  private values = new Map<string, number>();

  constructor(name: string, help: string) {
    this.name = name;
    this.help = help;
  }

  /**
   * Set value
   */
  set(value: number, labels?: MetricLabels): void {
    this.values.set(this.labelsToKey(labels), value);
  }

  /**
   * Increment value
   */
  inc(labels?: MetricLabels, value: number = 1): void {
    const key = this.labelsToKey(labels);
    const current = this.values.get(key) ?? 0;
    this.values.set(key, current + value);
  }

  /**
   * Decrement value
   */
  dec(labels?: MetricLabels, value: number = 1): void {
    this.inc(labels, -value);
  }

  /**
   * Get current value
   */
  get(labels?: MetricLabels): number {
    return this.values.get(this.labelsToKey(labels)) ?? 0;
  }

  /**
   * Export in Prometheus format
   */
  toPrometheus(): string {
    const lines = [`# HELP ${this.name} ${this.help}`, `# TYPE ${this.name} gauge`];
    
    for (const [key, value] of this.values) {
      const labelStr = key ? `{${key}}` : '';
      lines.push(`${this.name}${labelStr} ${value}`);
    }
    
    return lines.join('\n');
  }

  private labelsToKey(labels?: MetricLabels): string {
    if (!labels) return '';
    return Object.entries(labels)
      .map(([k, v]) => `${k}="${v}"`)
      .join(',');
  }
}

// ============================================================================
// Histogram
// ============================================================================

const DEFAULT_BUCKETS = [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10];

/**
 * Histogram metric - distribution of values
 */
export class Histogram {
  private name: string;
  private help: string;
  private buckets: number[];
  private bucketValues = new Map<string, number[]>();
  private sums = new Map<string, number>();
  private counts = new Map<string, number>();

  constructor(name: string, help: string, buckets: number[] = DEFAULT_BUCKETS) {
    this.name = name;
    this.help = help;
    this.buckets = [...buckets].sort((a, b) => a - b);
  }

  /**
   * Observe a value
   */
  observe(value: number, labels?: MetricLabels): void {
    const key = this.labelsToKey(labels);
    
    // Initialize if needed
    if (!this.bucketValues.has(key)) {
      this.bucketValues.set(key, new Array(this.buckets.length).fill(0));
      this.sums.set(key, 0);
      this.counts.set(key, 0);
    }

    // Update buckets
    const bucketCounts = this.bucketValues.get(key)!;
    for (let i = 0; i < this.buckets.length; i++) {
      if (value <= this.buckets[i]) {
        bucketCounts[i]++;
      }
    }

    // Update sum and count
    this.sums.set(key, (this.sums.get(key) ?? 0) + value);
    this.counts.set(key, (this.counts.get(key) ?? 0) + 1);
  }

  /**
   * Time a function and observe its duration
   */
  async time<T>(fn: () => Promise<T>, labels?: MetricLabels): Promise<T> {
    const start = Date.now();
    try {
      return await fn();
    } finally {
      this.observe((Date.now() - start) / 1000, labels);
    }
  }

  /**
   * Create a timer that can be stopped later
   */
  startTimer(labels?: MetricLabels): () => number {
    const start = Date.now();
    return () => {
      const duration = (Date.now() - start) / 1000;
      this.observe(duration, labels);
      return duration;
    };
  }

  /**
   * Export in Prometheus format
   */
  toPrometheus(): string {
    const lines = [
      `# HELP ${this.name} ${this.help}`,
      `# TYPE ${this.name} histogram`,
    ];
    
    for (const [key, bucketCounts] of this.bucketValues) {
      const labelPrefix = key ? `${key},` : '';
      
      for (let i = 0; i < this.buckets.length; i++) {
        lines.push(`${this.name}_bucket{${labelPrefix}le="${this.buckets[i]}"} ${bucketCounts[i]}`);
      }
      lines.push(`${this.name}_bucket{${labelPrefix}le="+Inf"} ${this.counts.get(key)}`);
      lines.push(`${this.name}_sum{${key}} ${this.sums.get(key)}`);
      lines.push(`${this.name}_count{${key}} ${this.counts.get(key)}`);
    }
    
    return lines.join('\n');
  }

  private labelsToKey(labels?: MetricLabels): string {
    if (!labels) return '';
    return Object.entries(labels)
      .map(([k, v]) => `${k}="${v}"`)
      .join(',');
  }
}

// ============================================================================
// Metrics Registry
// ============================================================================

/**
 * Central registry for all metrics
 */
export class MetricsRegistry {
  private counters = new Map<string, Counter>();
  private gauges = new Map<string, Gauge>();
  private histograms = new Map<string, Histogram>();
  private prefix: string;

  constructor(prefix: string = '') {
    this.prefix = prefix;
  }

  /**
   * Create or get a counter
   */
  counter(name: string, help: string): Counter {
    const fullName = this.prefix + name;
    let counter = this.counters.get(fullName);
    if (!counter) {
      counter = new Counter(fullName, help);
      this.counters.set(fullName, counter);
    }
    return counter;
  }

  /**
   * Create or get a gauge
   */
  gauge(name: string, help: string): Gauge {
    const fullName = this.prefix + name;
    let gauge = this.gauges.get(fullName);
    if (!gauge) {
      gauge = new Gauge(fullName, help);
      this.gauges.set(fullName, gauge);
    }
    return gauge;
  }

  /**
   * Create or get a histogram
   */
  histogram(name: string, help: string, buckets?: number[]): Histogram {
    const fullName = this.prefix + name;
    let histogram = this.histograms.get(fullName);
    if (!histogram) {
      histogram = new Histogram(fullName, help, buckets);
      this.histograms.set(fullName, histogram);
    }
    return histogram;
  }

  /**
   * Export all metrics in Prometheus format
   */
  toPrometheus(): string {
    const sections: string[] = [];
    
    for (const counter of this.counters.values()) {
      sections.push(counter.toPrometheus());
    }
    for (const gauge of this.gauges.values()) {
      sections.push(gauge.toPrometheus());
    }
    for (const histogram of this.histograms.values()) {
      sections.push(histogram.toPrometheus());
    }
    
    return sections.join('\n\n');
  }

  /**
   * Reset all metrics
   */
  reset(): void {
    this.counters.clear();
    this.gauges.clear();
    this.histograms.clear();
  }
}

// ============================================================================
// Default Registry and Common Metrics
// ============================================================================

export const metrics = new MetricsRegistry('ucmcp_');

// Common pre-defined metrics
export const httpRequestsTotal = metrics.counter(
  'http_requests_total',
  'Total number of HTTP requests'
);

export const httpRequestDuration = metrics.histogram(
  'http_request_duration_seconds',
  'HTTP request duration in seconds'
);

export const apiCallsTotal = metrics.counter(
  'api_calls_total',
  'Total number of API calls'
);

export const apiCallDuration = metrics.histogram(
  'api_call_duration_seconds',
  'API call duration in seconds'
);

export const rateLimitHits = metrics.counter(
  'rate_limit_hits_total',
  'Total number of rate limit hits'
);

export const circuitBreakerState = metrics.gauge(
  'circuit_breaker_state',
  'Circuit breaker state (0=closed, 1=half-open, 2=open)'
);

export const activeConnections = metrics.gauge(
  'active_connections',
  'Number of active connections'
);

export const errorsTotal = metrics.counter(
  'errors_total',
  'Total number of errors'
);

// ============================================================================
// HTTP Handler for /metrics endpoint
// ============================================================================

/**
 * Get metrics in Prometheus format (for HTTP handler)
 */
export function getMetricsHandler(): { contentType: string; body: string } {
  return {
    contentType: 'text/plain; charset=utf-8',
    body: metrics.toPrometheus(),
  };
}
