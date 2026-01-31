/**
 * Structured Logging Utility
 * 
 * @author nirholas (Nich)
 * @license Apache-2.0
 */

import { Request, Response, NextFunction } from 'express';

// ============================================================================
// Types
// ============================================================================

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
  requestId?: string;
  traceId?: string;
  spanId?: string;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

export interface LoggerConfig {
  level: LogLevel;
  format: 'json' | 'text';
  pretty: boolean;
  includeTimestamp: boolean;
  includePid: boolean;
  redactFields: string[];
}

// ============================================================================
// Logger Class
// ============================================================================

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  fatal: 4,
};

export class Logger {
  private config: LoggerConfig;
  private context: Record<string, unknown>;

  constructor(
    config: Partial<LoggerConfig> = {},
    context: Record<string, unknown> = {},
  ) {
    this.config = {
      level: config.level || (process.env.LOG_LEVEL as LogLevel) || 'info',
      format: config.format || 'json',
      pretty: config.pretty ?? process.env.NODE_ENV !== 'production',
      includeTimestamp: config.includeTimestamp ?? true,
      includePid: config.includePid ?? true,
      redactFields: config.redactFields || [
        'password',
        'token',
        'apiKey',
        'api_key',
        'secret',
        'privateKey',
        'private_key',
        'authorization',
        'cookie',
      ],
    };
    this.context = context;
  }

  /**
   * Create a child logger with additional context
   */
  child(context: Record<string, unknown>): Logger {
    return new Logger(this.config, { ...this.context, ...context });
  }

  /**
   * Check if a log level should be output
   */
  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVELS[level] >= LOG_LEVELS[this.config.level];
  }

  /**
   * Redact sensitive fields from an object
   */
  private redact(obj: unknown): unknown {
    if (obj === null || obj === undefined) return obj;
    if (typeof obj !== 'object') return obj;

    if (Array.isArray(obj)) {
      return obj.map((item) => this.redact(item));
    }

    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      if (
        this.config.redactFields.some((field) =>
          key.toLowerCase().includes(field.toLowerCase()),
        )
      ) {
        result[key] = '[REDACTED]';
      } else if (typeof value === 'object') {
        result[key] = this.redact(value);
      } else {
        result[key] = value;
      }
    }
    return result;
  }

  /**
   * Format a log entry
   */
  private format(entry: LogEntry): string {
    const redactedEntry = this.redact(entry) as LogEntry;

    if (this.config.format === 'json') {
      if (this.config.pretty) {
        return JSON.stringify(redactedEntry, null, 2);
      }
      return JSON.stringify(redactedEntry);
    }

    // Text format
    const parts: string[] = [];
    
    if (this.config.includeTimestamp) {
      parts.push(`[${entry.timestamp}]`);
    }
    
    parts.push(`[${entry.level.toUpperCase()}]`);
    
    if (this.config.includePid) {
      parts.push(`[${process.pid}]`);
    }
    
    if (entry.requestId) {
      parts.push(`[${entry.requestId}]`);
    }
    
    parts.push(entry.message);

    if (entry.context && Object.keys(entry.context).length > 0) {
      parts.push(JSON.stringify(this.redact(entry.context)));
    }

    if (entry.error) {
      parts.push(`\n  Error: ${entry.error.name}: ${entry.error.message}`);
      if (entry.error.stack) {
        parts.push(`\n${entry.error.stack}`);
      }
    }

    return parts.join(' ');
  }

  /**
   * Output a log entry
   */
  private output(level: LogLevel, entry: LogEntry): void {
    const formatted = this.format(entry);
    
    switch (level) {
      case 'debug':
        console.debug(formatted);
        break;
      case 'info':
        console.info(formatted);
        break;
      case 'warn':
        console.warn(formatted);
        break;
      case 'error':
      case 'fatal':
        console.error(formatted);
        break;
    }
  }

  /**
   * Create a log entry
   */
  private log(
    level: LogLevel,
    message: string,
    context?: Record<string, unknown>,
    error?: Error,
  ): void {
    if (!this.shouldLog(level)) return;

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context: { ...this.context, ...context },
    };

    if (error) {
      entry.error = {
        name: error.name,
        message: error.message,
        stack: error.stack,
      };
    }

    this.output(level, entry);
  }

  debug(message: string, context?: Record<string, unknown>): void {
    this.log('debug', message, context);
  }

  info(message: string, context?: Record<string, unknown>): void {
    this.log('info', message, context);
  }

  warn(message: string, context?: Record<string, unknown>): void {
    this.log('warn', message, context);
  }

  error(message: string, error?: Error | Record<string, unknown>, context?: Record<string, unknown>): void {
    if (error instanceof Error) {
      this.log('error', message, context, error);
    } else {
      this.log('error', message, { ...error, ...context });
    }
  }

  fatal(message: string, error?: Error | Record<string, unknown>, context?: Record<string, unknown>): void {
    if (error instanceof Error) {
      this.log('fatal', message, context, error);
    } else {
      this.log('fatal', message, { ...error, ...context });
    }
  }
}

// ============================================================================
// Express Request Logging Middleware
// ============================================================================

export interface RequestLogOptions {
  includeBody: boolean;
  includeQuery: boolean;
  includeHeaders: boolean;
  maxBodySize: number;
  skipPaths: string[];
  sensitiveHeaders: string[];
}

const defaultRequestLogOptions: RequestLogOptions = {
  includeBody: false,
  includeQuery: true,
  includeHeaders: false,
  maxBodySize: 1000,
  skipPaths: ['/health', '/healthz', '/ready', '/live', '/metrics'],
  sensitiveHeaders: ['authorization', 'cookie', 'x-api-key'],
};

export function requestLogger(
  logger: Logger,
  options: Partial<RequestLogOptions> = {},
): (req: Request, res: Response, next: NextFunction) => void {
  const opts = { ...defaultRequestLogOptions, ...options };

  return (req: Request, res: Response, next: NextFunction) => {
    // Skip logging for health checks etc
    if (opts.skipPaths.some((path) => req.path.startsWith(path))) {
      return next();
    }

    const startTime = Date.now();
    const requestId = (req.headers['x-request-id'] as string) || crypto.randomUUID();

    // Add request ID to headers
    res.setHeader('x-request-id', requestId);

    // Create request-scoped logger
    const reqLogger = logger.child({ requestId });

    // Build log context
    const logContext: Record<string, unknown> = {
      method: req.method,
      path: req.path,
      ip: req.ip || req.socket.remoteAddress,
      userAgent: req.get('user-agent'),
    };

    if (opts.includeQuery && Object.keys(req.query).length > 0) {
      logContext.query = req.query;
    }

    if (opts.includeHeaders) {
      const headers = { ...req.headers };
      for (const header of opts.sensitiveHeaders) {
        if (headers[header]) {
          headers[header] = '[REDACTED]';
        }
      }
      logContext.headers = headers;
    }

    if (opts.includeBody && req.body) {
      const bodyStr = JSON.stringify(req.body);
      if (bodyStr.length <= opts.maxBodySize) {
        logContext.body = req.body;
      } else {
        logContext.body = '[TRUNCATED]';
      }
    }

    // Log incoming request
    reqLogger.info('Incoming request', logContext);

    // Capture response
    const originalEnd = res.end.bind(res);
    
    res.end = function (chunk?: unknown, encoding?: BufferEncoding | (() => void), cb?: () => void): Response {
      const duration = Date.now() - startTime;
      
      const responseContext: Record<string, unknown> = {
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        duration: `${duration}ms`,
        contentLength: res.get('content-length'),
      };

      // Log at appropriate level based on status code
      if (res.statusCode >= 500) {
        reqLogger.error('Request completed with error', responseContext);
      } else if (res.statusCode >= 400) {
        reqLogger.warn('Request completed with client error', responseContext);
      } else {
        reqLogger.info('Request completed', responseContext);
      }

      // Call original end
      if (typeof encoding === 'function') {
        return originalEnd(chunk, encoding);
      }
      return originalEnd(chunk, encoding, cb);
    };

    next();
  };
}

// ============================================================================
// Error Logging Middleware
// ============================================================================

export function errorLogger(
  logger: Logger,
): (err: Error, req: Request, res: Response, next: NextFunction) => void {
  return (err: Error, req: Request, res: Response, next: NextFunction) => {
    const requestId = (req.headers['x-request-id'] as string) || 'unknown';
    const reqLogger = logger.child({ requestId });

    reqLogger.error('Unhandled error', err, {
      method: req.method,
      path: req.path,
      ip: req.ip,
      userAgent: req.get('user-agent'),
    });

    next(err);
  };
}

// ============================================================================
// Singleton Logger Instance
// ============================================================================

export const logger = new Logger();

export default logger;

