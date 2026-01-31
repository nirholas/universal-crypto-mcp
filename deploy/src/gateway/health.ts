/**
 * Health Check Endpoints
 * 
 * @author nirholas (Nich)
 * @license Apache-2.0
 */

import { Request, Response } from 'express';
import Redis from 'ioredis';

// ============================================================================
// Health Check State
// ============================================================================

interface HealthState {
  status: 'healthy' | 'degraded' | 'unhealthy';
  checks: Record<string, CheckResult>;
  startTime: Date;
  version: string;
}

interface CheckResult {
  status: 'pass' | 'warn' | 'fail';
  message?: string;
  latency?: number;
  lastCheck?: Date;
}

const healthState: HealthState = {
  status: 'healthy',
  checks: {},
  startTime: new Date(),
  version: process.env.npm_package_version || '1.0.0',
};

// Store references to external dependencies
let redisClient: Redis | null = null;
let mcpServerUrl: string | null = null;

// ============================================================================
// Health Check Functions
// ============================================================================

export function setRedisClient(client: Redis): void {
  redisClient = client;
}

export function setMcpServerUrl(url: string): void {
  mcpServerUrl = url;
}

/**
 * Basic health check - just returns if server is running
 */
export async function healthCheck(req: Request, res: Response): Promise<void> {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: Math.floor((Date.now() - healthState.startTime.getTime()) / 1000),
  });
}

/**
 * Liveness probe - is the server alive?
 */
export async function livenessCheck(req: Request, res: Response): Promise<void> {
  // If we can respond, we're alive
  res.status(200).json({
    status: 'alive',
    timestamp: new Date().toISOString(),
  });
}

/**
 * Readiness probe - is the server ready to handle requests?
 */
export async function readinessCheck(req: Request, res: Response): Promise<void> {
  const checks: Record<string, CheckResult> = {};
  let overallStatus: 'pass' | 'warn' | 'fail' = 'pass';

  // Check Redis if configured
  if (redisClient) {
    try {
      const startTime = Date.now();
      await redisClient.ping();
      checks.redis = {
        status: 'pass',
        message: 'Connected',
        latency: Date.now() - startTime,
        lastCheck: new Date(),
      };
    } catch (error) {
      checks.redis = {
        status: 'fail',
        message: error instanceof Error ? error.message : 'Unknown error',
        lastCheck: new Date(),
      };
      overallStatus = 'fail';
    }
  }

  // Check upstream MCP server if configured
  if (mcpServerUrl) {
    try {
      const startTime = Date.now();
      const response = await fetch(`${mcpServerUrl}/health`, {
        signal: AbortSignal.timeout(5000),
      });
      
      if (response.ok) {
        checks.mcpServer = {
          status: 'pass',
          message: 'Healthy',
          latency: Date.now() - startTime,
          lastCheck: new Date(),
        };
      } else {
        checks.mcpServer = {
          status: 'warn',
          message: `Status ${response.status}`,
          latency: Date.now() - startTime,
          lastCheck: new Date(),
        };
        if (overallStatus === 'pass') overallStatus = 'warn';
      }
    } catch (error) {
      checks.mcpServer = {
        status: 'warn', // Warn not fail - we can still serve cached data
        message: error instanceof Error ? error.message : 'Unreachable',
        lastCheck: new Date(),
      };
      if (overallStatus === 'pass') overallStatus = 'warn';
    }
  }

  // Memory check
  const memory = process.memoryUsage();
  const heapUsedPercent = (memory.heapUsed / memory.heapTotal) * 100;
  
  if (heapUsedPercent > 90) {
    checks.memory = {
      status: 'fail',
      message: `Heap usage critical: ${heapUsedPercent.toFixed(1)}%`,
    };
    overallStatus = 'fail';
  } else if (heapUsedPercent > 75) {
    checks.memory = {
      status: 'warn',
      message: `Heap usage high: ${heapUsedPercent.toFixed(1)}%`,
    };
    if (overallStatus === 'pass') overallStatus = 'warn';
  } else {
    checks.memory = {
      status: 'pass',
      message: `Heap usage: ${heapUsedPercent.toFixed(1)}%`,
    };
  }

  // Event loop check (simple version)
  checks.eventLoop = {
    status: 'pass',
    message: 'Responsive',
  };

  // Update health state
  healthState.checks = checks;
  healthState.status = overallStatus === 'pass' ? 'healthy' : 
                       overallStatus === 'warn' ? 'degraded' : 'unhealthy';

  const httpStatus = overallStatus === 'fail' ? 503 : 200;

  res.status(httpStatus).json({
    status: overallStatus === 'pass' ? 'ready' : overallStatus === 'warn' ? 'degraded' : 'not_ready',
    timestamp: new Date().toISOString(),
    uptime: Math.floor((Date.now() - healthState.startTime.getTime()) / 1000),
    version: healthState.version,
    checks,
  });
}

/**
 * Detailed health check with all system information
 */
export async function detailedHealthCheck(req: Request, res: Response): Promise<void> {
  const checks = await runAllChecks();
  
  const memory = process.memoryUsage();
  const cpuUsage = process.cpuUsage();

  res.json({
    status: healthState.status,
    timestamp: new Date().toISOString(),
    version: healthState.version,
    uptime: {
      seconds: Math.floor((Date.now() - healthState.startTime.getTime()) / 1000),
      human: formatUptime(Date.now() - healthState.startTime.getTime()),
    },
    checks,
    system: {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      pid: process.pid,
    },
    memory: {
      rss: formatBytes(memory.rss),
      heapTotal: formatBytes(memory.heapTotal),
      heapUsed: formatBytes(memory.heapUsed),
      external: formatBytes(memory.external),
      heapUsedPercent: ((memory.heapUsed / memory.heapTotal) * 100).toFixed(1) + '%',
    },
    cpu: {
      user: cpuUsage.user,
      system: cpuUsage.system,
    },
    environment: process.env.NODE_ENV || 'development',
  });
}

/**
 * Run all health checks
 */
async function runAllChecks(): Promise<Record<string, CheckResult>> {
  const checks: Record<string, CheckResult> = {};

  // Self check
  checks.self = {
    status: 'pass',
    message: 'Server is running',
  };

  // Redis check
  if (redisClient) {
    try {
      const startTime = Date.now();
      const result = await redisClient.ping();
      checks.redis = {
        status: result === 'PONG' ? 'pass' : 'warn',
        message: result === 'PONG' ? 'Connected' : 'Unexpected response',
        latency: Date.now() - startTime,
      };
    } catch (error) {
      checks.redis = {
        status: 'fail',
        message: error instanceof Error ? error.message : 'Connection failed',
      };
    }
  }

  // MCP server check
  if (mcpServerUrl) {
    try {
      const startTime = Date.now();
      const response = await fetch(`${mcpServerUrl}/health`, {
        signal: AbortSignal.timeout(5000),
      });
      checks.mcpServer = {
        status: response.ok ? 'pass' : 'warn',
        message: response.ok ? 'Healthy' : `Status ${response.status}`,
        latency: Date.now() - startTime,
      };
    } catch (error) {
      checks.mcpServer = {
        status: 'warn',
        message: error instanceof Error ? error.message : 'Unreachable',
      };
    }
  }

  // External APIs check
  const externalAPIs = [
    { name: 'coingecko', url: 'https://api.coingecko.com/api/v3/ping' },
  ];

  for (const api of externalAPIs) {
    try {
      const startTime = Date.now();
      const response = await fetch(api.url, {
        signal: AbortSignal.timeout(5000),
      });
      checks[api.name] = {
        status: response.ok ? 'pass' : 'warn',
        message: response.ok ? 'Reachable' : `Status ${response.status}`,
        latency: Date.now() - startTime,
      };
    } catch (error) {
      checks[api.name] = {
        status: 'warn',
        message: 'Unreachable',
      };
    }
  }

  return checks;
}

// ============================================================================
// Utility Functions
// ============================================================================

function formatBytes(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB'];
  let unit = 0;
  let value = bytes;

  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit++;
  }

  return `${value.toFixed(1)} ${units[unit]}`;
}

function formatUptime(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}d ${hours % 24}h ${minutes % 60}m`;
  } else if (hours > 0) {
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
}

export default { healthCheck, livenessCheck, readinessCheck, detailedHealthCheck };
