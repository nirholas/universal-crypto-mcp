/**
 * @author nich
 * @website x.com/nichxbt
 * @github github.com/nirholas
 * @license Apache-2.0
 */
import * as util from "node:util"

enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

type LogLevelStrings = keyof typeof LogLevel

class Logger {
  private static currentLevel: LogLevel = Logger.getLogLevelFromEnv()

  private static getLogLevelFromEnv(): LogLevel {
    const envLevel = (
      process.env.LOG_LEVEL || "INFO"
    ).toUpperCase() as LogLevelStrings
    return LogLevel[envLevel] ?? LogLevel.INFO
  }

  private static shouldLog(level: LogLevel): boolean {
    return level >= this.currentLevel
  }

  private static formatMessage(
    level: LogLevelStrings,
    message: string,
    meta?: any
  ): string {
    const timestamp = new Date().toISOString()
    const metaStr = meta
      ? " " + util.inspect(meta, { depth: 5, colors: true })
      : ""
    return `[${timestamp}] ${level}: ${message}${metaStr}`
  }

  static setLogLevel(level: LogLevelStrings) {
    this.currentLevel = LogLevel[level]
  }

  static debug(message: string, meta?: any) {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.debug(this.formatMessage("DEBUG", message, meta))
    }
  }

  static info(message: string, meta?: any) {
    if (this.shouldLog(LogLevel.INFO)) {
      console.info(this.formatMessage("INFO", message, meta))
    }
  }

  static warn(message: string, meta?: any) {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(this.formatMessage("WARN", message, meta))
    }
  }

  static error(message: string, meta?: any) {
    if (this.shouldLog(LogLevel.ERROR)) {
      console.error(this.formatMessage("ERROR", message, meta))
    }
  }

  static getLevel(): LogLevelStrings {
    return LogLevel[this.currentLevel] as LogLevelStrings
  }

  /**
   * Log payment event with structured data
   */
  static payment(event: {
    type: 'received' | 'verified' | 'failed' | 'refunded';
    from: string;
    to?: string;
    amount: string;
    token?: string;
    network?: string;
    txHash?: string;
    route?: string;
    error?: string;
  }) {
    const logData = {
      eventType: 'payment',
      paymentType: event.type,
      from: event.from,
      to: event.to,
      amount: event.amount,
      token: event.token || 'USDC',
      network: event.network || 'base',
      txHash: event.txHash,
      route: event.route,
      error: event.error,
      timestamp: Date.now()
    };

    if (event.type === 'failed') {
      this.error(`Payment ${event.type}: ${event.amount} from ${event.from}`, logData);
    } else {
      this.info(`Payment ${event.type}: ${event.amount} from ${event.from}`, logData);
    }
  }

  /**
   * Log deployment event
   */
  static deployment(event: {
    provider: string;
    projectName: string;
    url?: string;
    status: 'started' | 'success' | 'failed';
    duration?: number;
    error?: string;
  }) {
    const logData = {
      eventType: 'deployment',
      provider: event.provider,
      projectName: event.projectName,
      url: event.url,
      status: event.status,
      duration: event.duration,
      error: event.error,
      timestamp: Date.now()
    };

    if (event.status === 'failed') {
      this.error(`Deployment ${event.status}: ${event.projectName} on ${event.provider}`, logData);
    } else if (event.status === 'success') {
      this.info(`Deployment ${event.status}: ${event.projectName} on ${event.provider} → ${event.url}`, logData);
    } else {
      this.info(`Deployment ${event.status}: ${event.projectName} on ${event.provider}`, logData);
    }
  }

  /**
   * Log API request
   */
  static request(event: {
    method: string;
    path: string;
    statusCode: number;
    duration: number;
    ip?: string;
    userAgent?: string;
    error?: string;
  }) {
    const logData = {
      eventType: 'request',
      method: event.method,
      path: event.path,
      statusCode: event.statusCode,
      duration: event.duration,
      ip: event.ip,
      userAgent: event.userAgent,
      error: event.error,
      timestamp: Date.now()
    };

    if (event.statusCode >= 500) {
      this.error(`${event.method} ${event.path} ${event.statusCode} ${event.duration}ms`, logData);
    } else if (event.statusCode >= 400) {
      this.warn(`${event.method} ${event.path} ${event.statusCode} ${event.duration}ms`, logData);
    } else {
      this.debug(`${event.method} ${event.path} ${event.statusCode} ${event.duration}ms`, logData);
    }
  }

  /**
   * Log cache event
   */
  static cache(event: {
    action: 'hit' | 'miss' | 'set' | 'evict' | 'clear';
    key?: string;
    hitRate?: number;
    size?: number;
  }) {
    this.debug(`Cache ${event.action}${event.key ? `: ${event.key}` : ''}`, {
      eventType: 'cache',
      ...event,
      timestamp: Date.now()
    });
  }

  /**
   * Log security event
   */
  static security(event: {
    type: 'rate_limit' | 'invalid_input' | 'auth_failed' | 'suspicious';
    ip: string;
    path?: string;
    message: string;
    details?: Record<string, unknown>;
  }) {
    this.warn(`Security ${event.type}: ${event.message}`, {
      eventType: 'security',
      ...event,
      timestamp: Date.now()
    });
  }

  /**
   * Create a child logger with context
   */
  static child(context: Record<string, unknown>) {
    return {
      debug: (msg: string, meta?: any) => Logger.debug(msg, { ...context, ...meta }),
      info: (msg: string, meta?: any) => Logger.info(msg, { ...context, ...meta }),
      warn: (msg: string, meta?: any) => Logger.warn(msg, { ...context, ...meta }),
      error: (msg: string, meta?: any) => Logger.error(msg, { ...context, ...meta }),
      payment: (event: Parameters<typeof Logger.payment>[0]) => Logger.payment({ ...event }),
      deployment: (event: Parameters<typeof Logger.deployment>[0]) => Logger.deployment({ ...event }),
    };
  }
}

/**
 * Convenience functions for payment logging
 */
export function logPayment(event: {
  from: string;
  amount: string;
  route: string;
  txHash?: string;
  network?: string;
}) {
  Logger.payment({
    type: 'received',
    from: event.from,
    amount: event.amount,
    route: event.route,
    txHash: event.txHash,
    network: event.network
  });
}

/**
 * Convenience function for deployment logging
 */
export function logDeployment(provider: string, url: string, projectName?: string) {
  Logger.deployment({
    provider,
    projectName: projectName || 'unknown',
    url,
    status: 'success'
  });
}

/**
 * Convenience function for error logging
 */
export function logError(error: Error, context?: Record<string, unknown>) {
  Logger.error(error.message, {
    error: error.message,
    stack: error.stack,
    name: error.name,
    ...context
  });
}

export default Logger
