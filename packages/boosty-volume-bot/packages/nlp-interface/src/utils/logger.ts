/**
 * Production Logger
 * Winston-based structured logging
 */

import winston from 'winston';

const { combine, timestamp, errors, json, printf, colorize } = winston.format;

// Custom format for development
const devFormat = printf(({ level, message, timestamp, ...meta }) => {
  const metaStr = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
  return `${timestamp} [${level}]: ${message} ${metaStr}`;
});

// Determine if we're in production
const isProduction = process.env.NODE_ENV === 'production';

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug'),
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
    errors({ stack: true }),
    isProduction ? json() : combine(colorize(), devFormat)
  ),
  defaultMeta: { service: 'nlp-interface' },
  transports: [
    new winston.transports.Console(),
  ],
});

// Add file transport in production
if (isProduction) {
  logger.add(new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error',
    maxsize: 10485760, // 10MB
    maxFiles: 5,
  }));
  logger.add(new winston.transports.File({
    filename: 'logs/combined.log',
    maxsize: 10485760,
    maxFiles: 10,
  }));
}

export function createChildLogger(context: Record<string, unknown>) {
  return logger.child(context);
}
