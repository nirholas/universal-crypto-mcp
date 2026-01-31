/**
 * Structured Logging with Pino
 * 
 * Provides consistent, structured logging across all packages.
 * Supports log levels, context, and sensitive data masking.
 * 
 * @module logger
 * @author nich <nich@nichxbt.com>
 */

// ============================================================================
// Types
// ============================================================================

export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';

export interface LogContext {
  [key: string]: unknown;
}

export interface Logger {
  trace(msg: string, context?: LogContext): void;
  debug(msg: string, context?: LogContext): void;
  info(msg: string, context?: LogContext): void;
  warn(msg: string, context?: LogContext): void;
  error(msg: string, context?: LogContext): void;
  fatal(msg: string, context?: LogContext): void;
  child(bindings: LogContext): Logger;
}

export interface LoggerConfig {
  name: string;
  level?: LogLevel;
  pretty?: boolean;
  destination?: 'stdout' | 'stderr' | string;
  redact?: string[];
}

// ============================================================================
// Sensitive Data Patterns
// ============================================================================

const DEFAULT_REDACT_PATTERNS = [
  'password',
  'apiKey',
  'api_key',
  'apiSecret',
  'api_secret',
  'privateKey',
  'private_key',
  'secret',
  'token',
  'accessToken',
  'access_token',
  'refreshToken',
  'refresh_token',
  'authorization',
  'auth',
  'credential',
  'mnemonic',
  'seed',
  'passphrase',
];

// ============================================================================
// Console Logger (No External Dependencies)
// ============================================================================

const LOG_LEVELS: Record<LogLevel, number> = {
  trace: 10,
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  fatal: 60,
};

const LOG_COLORS: Record<LogLevel, string> = {
  trace: '\x1b[90m',  // Gray
  debug: '\x1b[36m',  // Cyan
  info: '\x1b[32m',   // Green
  warn: '\x1b[33m',   // Yellow
  error: '\x1b[31m',  // Red
  fatal: '\x1b[35m',  // Magenta
};

const RESET = '\x1b[0m';

/**
 * Redact sensitive values from an object
 */
function redactSensitive(
  obj: unknown,
  patterns: string[] = DEFAULT_REDACT_PATTERNS
): unknown {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === 'string') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => redactSensitive(item, patterns));
  }

  if (typeof obj === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      const shouldRedact = patterns.some(
        pattern => key.toLowerCase().includes(pattern.toLowerCase())
      );
      result[key] = shouldRedact ? '[REDACTED]' : redactSensitive(value, patterns);
    }
    return result;
  }

  return obj;
}

/**
 * Format log message for console output
 */
function formatLogMessage(
  level: LogLevel,
  name: string,
  msg: string,
  context?: LogContext,
  pretty: boolean = true
): string {
  const timestamp = new Date().toISOString();
  const color = pretty ? LOG_COLORS[level] : '';
  const reset = pretty ? RESET : '';
  
  const levelStr = level.toUpperCase().padEnd(5);
  const contextStr = context && Object.keys(context).length > 0
    ? ` ${JSON.stringify(redactSensitive(context))}`
    : '';

  return `${color}${timestamp} [${levelStr}] ${name}: ${msg}${contextStr}${reset}`;
}

/**
 * Console-based logger implementation
 */
class ConsoleLogger implements Logger {
  private name: string;
  private level: LogLevel;
  private pretty: boolean;
  private redactPatterns: string[];
  private bindings: LogContext;

  constructor(config: LoggerConfig, bindings: LogContext = {}) {
    this.name = config.name;
    this.level = config.level ?? 'info';
    this.pretty = config.pretty ?? (process.env.NODE_ENV !== 'production');
    this.redactPatterns = [...DEFAULT_REDACT_PATTERNS, ...(config.redact ?? [])];
    this.bindings = bindings;
  }

  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVELS[level] >= LOG_LEVELS[this.level];
  }

  private log(level: LogLevel, msg: string, context?: LogContext): void {
    if (!this.shouldLog(level)) return;

    const mergedContext = { ...this.bindings, ...context };
    const formattedMsg = formatLogMessage(level, this.name, msg, mergedContext, this.pretty);

    if (level === 'error' || level === 'fatal') {
      console.error(formattedMsg);
    } else if (level === 'warn') {
      console.warn(formattedMsg);
    } else {
      console.log(formattedMsg);
    }
  }

  trace(msg: string, context?: LogContext): void {
    this.log('trace', msg, context);
  }

  debug(msg: string, context?: LogContext): void {
    this.log('debug', msg, context);
  }

  info(msg: string, context?: LogContext): void {
    this.log('info', msg, context);
  }

  warn(msg: string, context?: LogContext): void {
    this.log('warn', msg, context);
  }

  error(msg: string, context?: LogContext): void {
    this.log('error', msg, context);
  }

  fatal(msg: string, context?: LogContext): void {
    this.log('fatal', msg, context);
  }

  child(bindings: LogContext): Logger {
    return new ConsoleLogger(
      { name: this.name, level: this.level, pretty: this.pretty, redact: this.redactPatterns },
      { ...this.bindings, ...bindings }
    );
  }
}

// ============================================================================
// Logger Factory
// ============================================================================

const loggers = new Map<string, Logger>();

/**
 * Create or get a logger instance
 */
export function createLogger(config: LoggerConfig | string): Logger {
  const name = typeof config === 'string' ? config : config.name;
  
  if (loggers.has(name)) {
    return loggers.get(name)!;
  }

  const fullConfig: LoggerConfig = typeof config === 'string' 
    ? { name: config }
    : config;

  // Override level from environment if set
  if (process.env.LOG_LEVEL) {
    fullConfig.level = process.env.LOG_LEVEL as LogLevel;
  }

  const logger = new ConsoleLogger(fullConfig);
  loggers.set(name, logger);
  return logger;
}

/**
 * Get an existing logger
 */
export function getLogger(name: string): Logger | undefined {
  return loggers.get(name);
}

/**
 * Set global log level for all loggers
 */
export function setGlobalLogLevel(level: LogLevel): void {
  process.env.LOG_LEVEL = level;
}

// ============================================================================
// Default Logger
// ============================================================================

export const logger = createLogger({
  name: 'universal-crypto-mcp',
  level: (process.env.LOG_LEVEL as LogLevel) ?? 'info',
  pretty: process.env.NODE_ENV !== 'production',
});

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Create a logger for a specific module/package
 */
export function moduleLogger(moduleName: string): Logger {
  return createLogger({
    name: `ucmcp:${moduleName}`,
    level: (process.env.LOG_LEVEL as LogLevel) ?? 'info',
  });
}

/**
 * Log function execution with timing
 */
export async function withLogging<T>(
  log: Logger,
  operation: string,
  fn: () => Promise<T>,
  context?: LogContext
): Promise<T> {
  const start = Date.now();
  log.debug(`Starting: ${operation}`, context);

  try {
    const result = await fn();
    const duration = Date.now() - start;
    log.info(`Completed: ${operation}`, { ...context, durationMs: duration });
    return result;
  } catch (error) {
    const duration = Date.now() - start;
    log.error(`Failed: ${operation}`, {
      ...context,
      durationMs: duration,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}

/**
 * Redact sensitive data for logging
 */
export { redactSensitive };

/**
 * Log levels for reference
 */
export { LOG_LEVELS };
