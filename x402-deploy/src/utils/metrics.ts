/**
 * Performance monitoring and metrics collection
 * @module utils/metrics
 */

export interface MetricPoint {
  timestamp: number;
  value: number;
  tags?: Record<string, string>;
}

export interface TimerResult {
  duration: number;
  end: () => number;
}

/**
 * Metrics collector for performance monitoring
 * 
 * @example
 * ```typescript
 * const metrics = new MetricsCollector();
 * 
 * // Record a counter
 * metrics.increment('requests.total');
 * 
 * // Record a gauge
 * metrics.gauge('active.connections', 42);
 * 
 * // Time an operation
 * const timer = metrics.startTimer();
 * await doWork();
 * metrics.histogram('operation.duration', timer.end());
 * ```
 */
export class MetricsCollector {
  private counters = new Map<string, number>();
  private gauges = new Map<string, number>();
  private histograms = new Map<string, number[]>();
  private timers = new Map<string, number>();
  
  /**
   * Increment a counter
   */
  increment(name: string, value: number = 1, tags?: Record<string, string>): void {
    const key = this.buildKey(name, tags);
    this.counters.set(key, (this.counters.get(key) || 0) + value);
  }
  
  /**
   * Decrement a counter
   */
  decrement(name: string, value: number = 1, tags?: Record<string, string>): void {
    this.increment(name, -value, tags);
  }
  
  /**
   * Set a gauge value
   */
  gauge(name: string, value: number, tags?: Record<string, string>): void {
    const key = this.buildKey(name, tags);
    this.gauges.set(key, value);
  }
  
  /**
   * Record a histogram value
   */
  histogram(name: string, value: number, tags?: Record<string, string>): void {
    const key = this.buildKey(name, tags);
    const values = this.histograms.get(key) || [];
    values.push(value);
    this.histograms.set(key, values);
  }
  
  /**
   * Start a timer
   */
  startTimer(): TimerResult {
    const start = Date.now();
    return {
      duration: 0,
      end: () => {
        const duration = Date.now() - start;
        return duration;
      },
    };
  }
  
  /**
   * Time an operation
   */
  async time<T>(
    name: string,
    fn: () => Promise<T> | T,
    tags?: Record<string, string>
  ): Promise<T> {
    const timer = this.startTimer();
    try {
      const result = await fn();
      this.histogram(name, timer.end(), tags);
      return result;
    } catch (error) {
      this.histogram(name, timer.end(), { ...tags, error: 'true' });
      throw error;
    }
  }
  
  /**
   * Get counter value
   */
  getCounter(name: string, tags?: Record<string, string>): number {
    const key = this.buildKey(name, tags);
    return this.counters.get(key) || 0;
  }
  
  /**
   * Get gauge value
   */
  getGauge(name: string, tags?: Record<string, string>): number | undefined {
    const key = this.buildKey(name, tags);
    return this.gauges.get(key);
  }
  
  /**
   * Get histogram statistics
   */
  getHistogramStats(name: string, tags?: Record<string, string>) {
    const key = this.buildKey(name, tags);
    const values = this.histograms.get(key) || [];
    
    if (values.length === 0) {
      return null;
    }
    
    const sorted = [...values].sort((a, b) => a - b);
    const sum = values.reduce((a, b) => a + b, 0);
    
    return {
      count: values.length,
      sum,
      mean: sum / values.length,
      min: sorted[0],
      max: sorted[sorted.length - 1],
      p50: this.percentile(sorted, 0.5),
      p95: this.percentile(sorted, 0.95),
      p99: this.percentile(sorted, 0.99),
    };
  }
  
  /**
   * Calculate percentile
   */
  private percentile(sorted: number[], p: number): number {
    const index = Math.ceil(sorted.length * p) - 1;
    return sorted[Math.max(0, index)];
  }
  
  /**
   * Build metric key with tags
   */
  private buildKey(name: string, tags?: Record<string, string>): string {
    if (!tags || Object.keys(tags).length === 0) {
      return name;
    }
    
    const tagStr = Object.entries(tags)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}=${v}`)
      .join(',');
    
    return `${name}{${tagStr}}`;
  }
  
  /**
   * Reset all metrics
   */
  reset(): void {
    this.counters.clear();
    this.gauges.clear();
    this.histograms.clear();
    this.timers.clear();
  }
  
  /**
   * Get all metrics
   */
  getAllMetrics() {
    return {
      counters: Object.fromEntries(this.counters),
      gauges: Object.fromEntries(this.gauges),
      histograms: Object.fromEntries(
        Array.from(this.histograms.entries()).map(([key, values]) => [
          key,
          this.getHistogramStats(key),
        ])
      ),
    };
  }
  
  /**
   * Export metrics in Prometheus format
   */
  exportPrometheus(): string {
    const lines: string[] = [];
    
    // Counters
    this.counters.forEach((value, key) => {
      lines.push(`# TYPE ${key} counter`);
      lines.push(`${key} ${value}`);
    });
    
    // Gauges
    this.gauges.forEach((value, key) => {
      lines.push(`# TYPE ${key} gauge`);
      lines.push(`${key} ${value}`);
    });
    
    // Histograms
    this.histograms.forEach((values, key) => {
      const stats = this.getHistogramStats(key);
      if (stats) {
        lines.push(`# TYPE ${key} histogram`);
        lines.push(`${key}_count ${stats.count}`);
        lines.push(`${key}_sum ${stats.sum}`);
        lines.push(`${key}{quantile="0.5"} ${stats.p50}`);
        lines.push(`${key}{quantile="0.95"} ${stats.p95}`);
        lines.push(`${key}{quantile="0.99"} ${stats.p99}`);
      }
    });
    
    return lines.join('\n');
  }
}

/**
 * Global metrics instance
 */
export const globalMetrics = new MetricsCollector();

/**
 * Create a metrics collector
 */
export function createMetrics(): MetricsCollector {
  return new MetricsCollector();
}

/**
 * Express middleware for request metrics
 */
export function metricsMiddleware(metrics: MetricsCollector = globalMetrics) {
  return (req: any, res: any, next: any) => {
    const timer = metrics.startTimer();
    
    // Track request
    metrics.increment('http.requests.total', 1, {
      method: req.method,
      route: req.route?.path || req.path,
    });
    
    res.on('finish', () => {
      const duration = timer.end();
      
      // Track duration
      metrics.histogram('http.request.duration', duration, {
        method: req.method,
        route: req.route?.path || req.path,
        status: String(res.statusCode),
      });
      
      // Track status codes
      metrics.increment('http.responses.total', 1, {
        status: String(res.statusCode),
      });
    });
    
    next();
  };
}
