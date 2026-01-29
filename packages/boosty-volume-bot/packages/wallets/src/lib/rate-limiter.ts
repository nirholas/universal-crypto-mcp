/**
 * Rate Limiter
 * Token bucket algorithm for API rate limiting
 */

export interface RateLimiterConfig {
  maxRequests: number;
  windowMs: number;
}

export class RateLimiter {
  private tokens: number;
  private maxTokens: number;
  private refillRate: number;
  private lastRefill: number;
  private queue: Array<() => void> = [];

  constructor(config: RateLimiterConfig) {
    this.maxTokens = config.maxRequests;
    this.tokens = config.maxRequests;
    this.refillRate = config.maxRequests / (config.windowMs / 1000);
    this.lastRefill = Date.now();
  }

  private refillTokens(): void {
    const now = Date.now();
    const timePassed = (now - this.lastRefill) / 1000;
    const tokensToAdd = timePassed * this.refillRate;
    
    this.tokens = Math.min(this.maxTokens, this.tokens + tokensToAdd);
    this.lastRefill = now;
  }

  async waitForRequest(): Promise<void> {
    this.refillTokens();

    if (this.tokens >= 1) {
      this.tokens -= 1;
      return;
    }

    // Calculate wait time for next token
    const waitTime = ((1 - this.tokens) / this.refillRate) * 1000;
    
    return new Promise((resolve) => {
      setTimeout(() => {
        this.refillTokens();
        this.tokens -= 1;
        resolve();
      }, Math.ceil(waitTime));
    });
  }

  getAvailableTokens(): number {
    this.refillTokens();
    return this.tokens;
  }
}

export function createRateLimiter(config: RateLimiterConfig): RateLimiter {
  return new RateLimiter(config);
}
