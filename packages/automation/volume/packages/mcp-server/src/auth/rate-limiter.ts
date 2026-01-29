/**
 * Rate Limiter for MCP Tools
 */

import { createChildLogger } from '../utils/logger.js';
import type { RateLimitConfig } from '../types.js';

const logger = createChildLogger('rate-limiter');

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

export class RateLimiter {
  private limits: Map<string, RateLimitEntry> = new Map();
  private config: Record<string, RateLimitConfig>;

  constructor(config: Record<string, RateLimitConfig>) {
    this.config = config;
    
    // Cleanup expired entries periodically
    setInterval(() => this.cleanup(), 60000);
  }

  /**
   * Check if a request is allowed
   */
  check(category: string, identifier: string = 'default'): boolean {
    const limitConfig = this.config[category];
    if (!limitConfig) {
      return true;
    }

    const key = `${category}:${identifier}`;
    const now = Date.now();
    const entry = this.limits.get(key);

    if (!entry || now >= entry.resetAt) {
      this.limits.set(key, {
        count: 1,
        resetAt: now + limitConfig.windowMs,
      });
      return true;
    }

    if (entry.count >= limitConfig.max) {
      logger.warn({ category, identifier, count: entry.count }, 'Rate limit exceeded');
      return false;
    }

    entry.count++;
    return true;
  }

  /**
   * Get remaining requests for a category
   */
  getRemaining(category: string, identifier: string = 'default'): number {
    const limitConfig = this.config[category];
    if (!limitConfig) {
      return Infinity;
    }

    const key = `${category}:${identifier}`;
    const entry = this.limits.get(key);
    const now = Date.now();

    if (!entry || now >= entry.resetAt) {
      return limitConfig.max;
    }

    return Math.max(0, limitConfig.max - entry.count);
  }

  /**
   * Get time until reset in ms
   */
  getResetTime(category: string, identifier: string = 'default'): number {
    const key = `${category}:${identifier}`;
    const entry = this.limits.get(key);
    const now = Date.now();

    if (!entry || now >= entry.resetAt) {
      return 0;
    }

    return entry.resetAt - now;
  }

  /**
   * Clean up expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, entry] of this.limits.entries()) {
      if (now >= entry.resetAt) {
        this.limits.delete(key);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      logger.debug({ cleaned }, 'Cleaned up rate limit entries');
    }
  }
}

/**
 * Get rate limit category for a tool
 */
export function getToolCategory(toolName: string): string {
  if (toolName.includes('swap') || toolName.includes('buy') || toolName.includes('sell')) {
    return 'swaps';
  }
  if (toolName.includes('wallet') || toolName.includes('fund') || toolName.includes('consolidate')) {
    return 'walletOps';
  }
  if (toolName.includes('campaign')) {
    return 'campaigns';
  }
  return 'queries';
}
