/**
 * Health Checks
 * Production-grade health monitoring for x402-deploy
 */

import type { Request, Response, RequestHandler } from "express";
import type { MultiChainPaymentVerifier } from "../gateway/multi-chain.js";

export interface HealthStatus {
  status: "healthy" | "degraded" | "unhealthy";
  timestamp: string;
  uptime: number;
  version?: string;
  checks: {
    [key: string]: HealthCheckResult;
  };
}

export interface HealthCheckResult {
  status: "pass" | "warn" | "fail";
  message?: string;
  duration?: number;
  metadata?: Record<string, unknown>;
}

export interface HealthCheckerOptions {
  paymentVerifier?: MultiChainPaymentVerifier;
  customChecks?: Record<string, () => Promise<HealthCheckResult>>;
  version?: string;
}

/**
 * Health checker for x402-deploy services
 */
export class HealthChecker {
  private startTime: number;
  private paymentVerifier?: MultiChainPaymentVerifier;
  private customChecks: Record<string, () => Promise<HealthCheckResult>>;
  private version?: string;

  constructor(options?: HealthCheckerOptions) {
    this.startTime = Date.now();
    this.paymentVerifier = options?.paymentVerifier;
    this.customChecks = options?.customChecks || {};
    this.version = options?.version;
  }

  /**
   * Run all health checks
   */
  async check(): Promise<HealthStatus> {
    const checks: HealthStatus["checks"] = {};

    // Core checks
    const checkPromises: Promise<void>[] = [];

    // Memory check
    checkPromises.push(
      (async () => {
        checks.memory = this.checkMemory();
      })()
    );

    // Disk check
    checkPromises.push(
      (async () => {
        const start = Date.now();
        checks.disk = await this.checkDiskSpace();
        checks.disk.duration = Date.now() - start;
      })()
    );

    // RPC check (if payment verifier available)
    if (this.paymentVerifier) {
      checkPromises.push(
        (async () => {
          const start = Date.now();
          checks.rpc = await this.checkRPC();
          checks.rpc.duration = Date.now() - start;
        })()
      );
    }

    // Event loop check
    checkPromises.push(
      (async () => {
        const start = Date.now();
        checks.eventLoop = await this.checkEventLoop();
        checks.eventLoop.duration = Date.now() - start;
      })()
    );

    // Run custom checks
    for (const [name, checkFn] of Object.entries(this.customChecks)) {
      checkPromises.push(
        (async () => {
          const start = Date.now();
          try {
            checks[name] = await checkFn();
          } catch (error) {
            checks[name] = { status: "fail", message: String(error) };
          }
          checks[name].duration = Date.now() - start;
        })()
      );
    }

    await Promise.all(checkPromises);

    // Determine overall status
    const hasFailures = Object.values(checks).some((c) => c.status === "fail");
    const hasWarnings = Object.values(checks).some((c) => c.status === "warn");

    return {
      status: hasFailures ? "unhealthy" : hasWarnings ? "degraded" : "healthy",
      timestamp: new Date().toISOString(),
      uptime: Date.now() - this.startTime,
      version: this.version,
      checks,
    };
  }

  /**
   * Quick liveness check (is the process running?)
   */
  liveness(): HealthStatus {
    return {
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: Date.now() - this.startTime,
      version: this.version,
      checks: {
        process: { status: "pass", message: "Process is running" },
      },
    };
  }

  /**
   * Readiness check (is the service ready to accept traffic?)
   */
  async readiness(): Promise<HealthStatus> {
    const checks: HealthStatus["checks"] = {};

    // Check memory isn't critically low
    const memCheck = this.checkMemory();
    checks.memory = memCheck;

    // Check RPC if available
    if (this.paymentVerifier) {
      checks.rpc = await this.checkRPC();
    }

    const hasFailures = Object.values(checks).some((c) => c.status === "fail");

    return {
      status: hasFailures ? "unhealthy" : "healthy",
      timestamp: new Date().toISOString(),
      uptime: Date.now() - this.startTime,
      version: this.version,
      checks,
    };
  }

  /**
   * Check memory usage
   */
  private checkMemory(): HealthCheckResult {
    const used = process.memoryUsage();
    const heapUsedMB = used.heapUsed / 1024 / 1024;
    const heapTotalMB = used.heapTotal / 1024 / 1024;
    const usagePercent = (heapUsedMB / heapTotalMB) * 100;
    const rssMB = used.rss / 1024 / 1024;

    const metadata = {
      heapUsedMB: Math.round(heapUsedMB * 100) / 100,
      heapTotalMB: Math.round(heapTotalMB * 100) / 100,
      rssMB: Math.round(rssMB * 100) / 100,
      usagePercent: Math.round(usagePercent * 10) / 10,
    };

    if (usagePercent > 90) {
      return {
        status: "fail",
        message: `Memory usage critical at ${usagePercent.toFixed(1)}%`,
        metadata,
      };
    }

    if (usagePercent > 80) {
      return {
        status: "warn",
        message: `Memory usage high at ${usagePercent.toFixed(1)}%`,
        metadata,
      };
    }

    return {
      status: "pass",
      message: `Memory usage at ${usagePercent.toFixed(1)}%`,
      metadata,
    };
  }

  /**
   * Check disk space
   */
  private async checkDiskSpace(): Promise<HealthCheckResult> {
    try {
      const { execSync } = await import("child_process");
      const output = execSync("df -h /").toString();
      const lines = output.split("\n")[1];
      const match = lines?.match(/(\d+)%/);
      const usage = parseInt(match?.[1] || "0");

      const metadata = { usagePercent: usage };

      if (usage > 90) {
        return {
          status: "fail",
          message: `Disk usage critical at ${usage}%`,
          metadata,
        };
      }

      if (usage > 80) {
        return {
          status: "warn",
          message: `Disk usage high at ${usage}%`,
          metadata,
        };
      }

      return {
        status: "pass",
        message: `Disk usage at ${usage}%`,
        metadata,
      };
    } catch (error) {
      return {
        status: "warn",
        message: "Could not check disk space",
      };
    }
  }

  /**
   * Check RPC connections
   */
  private async checkRPC(): Promise<HealthCheckResult> {
    if (!this.paymentVerifier) {
      return { status: "warn", message: "Payment verifier not configured" };
    }

    try {
      // Try to get block number from Base (primary network)
      const blockNumber = await this.paymentVerifier.getBlockNumber("eip155:8453");

      if (blockNumber > 0n) {
        return {
          status: "pass",
          message: `RPC connected, block ${blockNumber}`,
          metadata: { blockNumber: blockNumber.toString() },
        };
      }

      return { status: "fail", message: "Invalid block number" };
    } catch (error) {
      return { status: "fail", message: `RPC error: ${error}` };
    }
  }

  /**
   * Check event loop responsiveness
   */
  private async checkEventLoop(): Promise<HealthCheckResult> {
    const start = Date.now();

    // Measure time for a setImmediate to execute
    const delay = await new Promise<number>((resolve) => {
      setImmediate(() => resolve(Date.now() - start));
    });

    const metadata = { lagMs: delay };

    if (delay > 100) {
      return {
        status: "fail",
        message: `Event loop lag critical at ${delay}ms`,
        metadata,
      };
    }

    if (delay > 50) {
      return {
        status: "warn",
        message: `Event loop lag high at ${delay}ms`,
        metadata,
      };
    }

    return {
      status: "pass",
      message: `Event loop responsive (${delay}ms)`,
      metadata,
    };
  }

  /**
   * Add a custom health check
   */
  addCheck(name: string, checkFn: () => Promise<HealthCheckResult>): void {
    this.customChecks[name] = checkFn;
  }

  /**
   * Remove a custom health check
   */
  removeCheck(name: string): void {
    delete this.customChecks[name];
  }

  /**
   * Get uptime in milliseconds
   */
  getUptime(): number {
    return Date.now() - this.startTime;
  }
}

/**
 * Create Express endpoint for full health check
 */
export function healthEndpoint(checker: HealthChecker): RequestHandler {
  return async (req: Request, res: Response) => {
    const health = await checker.check();

    const statusCode =
      health.status === "healthy"
        ? 200
        : health.status === "degraded"
          ? 200
          : 503;

    res.status(statusCode).json(health);
  };
}

/**
 * Create Express endpoint for liveness probe
 */
export function livenessEndpoint(checker: HealthChecker): RequestHandler {
  return (req: Request, res: Response) => {
    const health = checker.liveness();
    res.status(200).json(health);
  };
}

/**
 * Create Express endpoint for readiness probe
 */
export function readinessEndpoint(checker: HealthChecker): RequestHandler {
  return async (req: Request, res: Response) => {
    const health = await checker.readiness();
    const statusCode = health.status === "healthy" ? 200 : 503;
    res.status(statusCode).json(health);
  };
}

/**
 * Create database health check function
 */
export function createDatabaseCheck(
  testConnection: () => Promise<boolean>
): () => Promise<HealthCheckResult> {
  return async () => {
    try {
      const connected = await testConnection();
      return connected
        ? { status: "pass", message: "Database connected" }
        : { status: "fail", message: "Database connection failed" };
    } catch (error) {
      return { status: "fail", message: `Database error: ${error}` };
    }
  };
}

/**
 * Create Redis health check function
 */
export function createRedisCheck(
  ping: () => Promise<string>
): () => Promise<HealthCheckResult> {
  return async () => {
    try {
      const response = await ping();
      return response === "PONG"
        ? { status: "pass", message: "Redis connected" }
        : { status: "fail", message: `Unexpected response: ${response}` };
    } catch (error) {
      return { status: "fail", message: `Redis error: ${error}` };
    }
  };
}

/**
 * Create external service health check function
 */
export function createExternalServiceCheck(
  url: string,
  timeoutMs: number = 5000
): () => Promise<HealthCheckResult> {
  return async () => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        method: "HEAD",
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (response.ok) {
        return { status: "pass", message: `${url} reachable` };
      }

      return {
        status: "warn",
        message: `${url} returned ${response.status}`,
      };
    } catch (error) {
      clearTimeout(timeout);
      return { status: "fail", message: `${url} unreachable: ${error}` };
    }
  };
}
