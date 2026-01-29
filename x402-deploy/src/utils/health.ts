/**
 * Health check utilities for monitoring service health
 * @module utils/health
 */

export type HealthStatus = 'healthy' | 'degraded' | 'unhealthy';

export interface HealthCheck {
  name: string;
  check: () => Promise<HealthCheckResult> | HealthCheckResult;
  critical?: boolean;
  timeout?: number;
}

export interface HealthCheckResult {
  status: HealthStatus;
  message?: string;
  metadata?: Record<string, any>;
  responseTime?: number;
}

export interface SystemHealth {
  status: HealthStatus;
  timestamp: string;
  uptime: number;
  checks: Record<string, HealthCheckResult>;
  version?: string;
}

/**
 * Health checker for monitoring system health
 * 
 * @example
 * ```typescript
 * const health = new HealthChecker();
 * 
 * health.registerCheck({
 *   name: 'database',
 *   check: async () => {
 *     const connected = await db.ping();
 *     return {
 *       status: connected ? 'healthy' : 'unhealthy',
 *       message: connected ? 'Connected' : 'Connection failed'
 *     };
 *   },
 *   critical: true
 * });
 * 
 * const result = await health.check();
 * ```
 */
export class HealthChecker {
  private checks = new Map<string, HealthCheck>();
  private startTime = Date.now();
  private version?: string;
  
  constructor(version?: string) {
    this.version = version;
  }
  
  /**
   * Register a health check
   */
  registerCheck(check: HealthCheck): void {
    this.checks.set(check.name, check);
  }
  
  /**
   * Remove a health check
   */
  unregisterCheck(name: string): boolean {
    return this.checks.delete(name);
  }
  
  /**
   * Run all health checks
   */
  async check(): Promise<SystemHealth> {
    const results: Record<string, HealthCheckResult> = {};
    let overallStatus: HealthStatus = 'healthy';
    
    // Run all checks in parallel
    const checkPromises = Array.from(this.checks.entries()).map(
      async ([name, check]) => {
        const start = Date.now();
        
        try {
          // Run check with timeout
          const timeout = check.timeout || 5000;
          const result = await Promise.race([
            Promise.resolve(check.check()),
            new Promise<HealthCheckResult>((_, reject) =>
              setTimeout(() => reject(new Error('Timeout')), timeout)
            ),
          ]);
          
          results[name] = {
            ...result,
            responseTime: Date.now() - start,
          };
          
          // Update overall status
          if (check.critical && result.status === 'unhealthy') {
            overallStatus = 'unhealthy';
          } else if (result.status === 'degraded' && overallStatus === 'healthy') {
            overallStatus = 'degraded';
          }
        } catch (error) {
          results[name] = {
            status: 'unhealthy',
            message: (error as Error).message,
            responseTime: Date.now() - start,
          };
          
          if (check.critical) {
            overallStatus = 'unhealthy';
          }
        }
      }
    );
    
    await Promise.all(checkPromises);
    
    return {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      uptime: Date.now() - this.startTime,
      checks: results,
      version: this.version,
    };
  }
  
  /**
   * Get readiness status (can service accept traffic?)
   */
  async ready(): Promise<boolean> {
    const health = await this.check();
    return health.status !== 'unhealthy';
  }
  
  /**
   * Get liveness status (is service alive?)
   */
  alive(): boolean {
    return true; // If we can execute this, we're alive
  }
}

/**
 * Built-in health checks
 */
export const builtInChecks = {
  /**
   * Memory usage check
   */
  memory: (threshold: number = 0.9): HealthCheck => ({
    name: 'memory',
    check: () => {
      const used = process.memoryUsage();
      const total = used.heapTotal;
      const percentage = used.heapUsed / total;
      
      return {
        status: percentage > threshold ? 'degraded' : 'healthy',
        message: `${(percentage * 100).toFixed(2)}% used`,
        metadata: {
          used: used.heapUsed,
          total: total,
          external: used.external,
        },
      };
    },
  }),
  
  /**
   * CPU usage check (requires sampling)
   */
  cpu: (threshold: number = 0.8): HealthCheck => ({
    name: 'cpu',
    check: async () => {
      const usage = process.cpuUsage();
      const total = usage.user + usage.system;
      
      return {
        status: 'healthy',
        message: 'CPU metrics available',
        metadata: {
          user: usage.user,
          system: usage.system,
          total,
        },
      };
    },
  }),
  
  /**
   * Event loop lag check
   */
  eventLoop: (threshold: number = 100): HealthCheck => ({
    name: 'eventLoop',
    check: async () => {
      const start = Date.now();
      await new Promise(resolve => setImmediate(resolve));
      const lag = Date.now() - start;
      
      return {
        status: lag > threshold ? 'degraded' : 'healthy',
        message: `${lag}ms lag`,
        metadata: { lag },
      };
    },
  }),
  
  /**
   * Database connection check
   */
  database: (pingFn: () => Promise<boolean>): HealthCheck => ({
    name: 'database',
    check: async () => {
      try {
        const connected = await pingFn();
        return {
          status: connected ? 'healthy' : 'unhealthy',
          message: connected ? 'Connected' : 'Disconnected',
        };
      } catch (error) {
        return {
          status: 'unhealthy',
          message: (error as Error).message,
        };
      }
    },
    critical: true,
  }),
  
  /**
   * HTTP endpoint check
   */
  http: (url: string, expectedStatus: number = 200): HealthCheck => ({
    name: 'http',
    check: async () => {
      try {
        const response = await fetch(url);
        return {
          status: response.status === expectedStatus ? 'healthy' : 'degraded',
          message: `HTTP ${response.status}`,
          metadata: { status: response.status },
        };
      } catch (error) {
        return {
          status: 'unhealthy',
          message: (error as Error).message,
        };
      }
    },
  }),
};

/**
 * Create a health checker instance
 */
export function createHealthChecker(version?: string): HealthChecker {
  return new HealthChecker(version);
}

/**
 * Express middleware for health endpoints
 */
export function healthMiddleware(checker: HealthChecker) {
  return {
    // Liveness probe
    liveness: (_req: any, res: any) => {
      res.status(200).json({ status: 'ok' });
    },
    
    // Readiness probe
    readiness: async (_req: any, res: any) => {
      const ready = await checker.ready();
      res.status(ready ? 200 : 503).json({ ready });
    },
    
    // Full health check
    health: async (_req: any, res: any) => {
      const health = await checker.check();
      const status = health.status === 'healthy' ? 200 : 503;
      res.status(status).json(health);
    },
  };
}
