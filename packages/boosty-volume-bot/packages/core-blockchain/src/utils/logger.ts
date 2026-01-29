import pino from 'pino';

export type Logger = pino.Logger;

export interface LoggerOptions {
  name: string;
  level?: 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';
  pretty?: boolean;
}

/**
 * Create a structured logger instance
 */
export function createLogger(options: LoggerOptions): Logger {
  const { name, level = 'info', pretty = process.env.NODE_ENV !== 'production' } = options;

  return pino({
    name,
    level: process.env.LOG_LEVEL || level,
    transport: pretty
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
          },
        }
      : undefined,
    formatters: {
      level: (label) => ({ level: label }),
    },
    timestamp: pino.stdTimeFunctions.isoTime,
  });
}

/**
 * Create a child logger with additional context
 */
export function createChildLogger(parent: Logger, context: Record<string, unknown>): Logger {
  return parent.child(context);
}
