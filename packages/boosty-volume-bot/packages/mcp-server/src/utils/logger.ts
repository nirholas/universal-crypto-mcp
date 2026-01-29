/**
 * Logger utility using pino
 */

import pino from 'pino';

const level = process.env.LOG_LEVEL || 'info';
const pretty = process.env.LOG_PRETTY === 'true';

export const logger = pino({
  level,
  transport: pretty
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
        },
      }
    : undefined,
  base: {
    service: 'defi-mcp-server',
  },
});

export function createChildLogger(name: string) {
  return logger.child({ component: name });
}
