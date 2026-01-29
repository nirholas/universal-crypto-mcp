/**
 * Solana Core Logger
 * Production logging with structured output
 */

import winston from 'winston';

const { combine, timestamp, errors, json, printf, colorize } = winston.format;

const isProduction = process.env.NODE_ENV === 'production';
const enableRpcLogging = process.env.SOLANA_LOG_RPC === 'true';

const devFormat = printf(({ level, message, timestamp, ...meta }) => {
  const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
  return `${timestamp} [solana-core] ${level}: ${message}${metaStr}`;
});

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug'),
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
    errors({ stack: true }),
    isProduction ? json() : combine(colorize(), devFormat)
  ),
  defaultMeta: { service: 'solana-core' },
  transports: [new winston.transports.Console()],
  silent: process.env.NODE_ENV === 'test',
});

export function logRpc(method: string, endpoint: string, durationMs: number, error?: Error): void {
  if (!enableRpcLogging) return;
  
  if (error) {
    logger.warn('RPC call failed', { method, endpoint, durationMs, error: error.message });
  } else {
    logger.debug('RPC call', { method, endpoint, durationMs });
  }
}

export function logTransaction(signature: string, status: string, details?: Record<string, unknown>): void {
  logger.info('Transaction', { signature: signature.slice(0, 16) + '...', status, ...details });
}

export function logSubscription(type: string, id: number, target: string): void {
  logger.debug('Subscription', { type, id, target });
}
