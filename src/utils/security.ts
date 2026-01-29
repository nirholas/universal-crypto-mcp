/**
 * Security utilities and middleware for production deployments
 * Includes rate limiting, input validation, and security headers
 * 
 * @author nich
 * @github github.com/nirholas
 * @license Apache-2.0
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
declare const globalThis: {
  setInterval?: (fn: () => void, ms: number) => { unref?: () => void };
  clearInterval?: (timer: unknown) => void;
};

/**
 * Generic HTTP request interface (framework-agnostic)
 */
export interface HttpRequest {
  method: string;
  path: string;
  url: string;
  ip?: string;
  headers: Record<string, string | string[] | undefined>;
  socket?: { remoteAddress?: string };
  on?: (event: string, callback: (data: { length: number }) => void) => void;
  destroy?: () => void;
}

/**
 * Generic HTTP response interface (framework-agnostic)
 */
export interface HttpResponse {
  status(code: number): HttpResponse;
  json(body: unknown): HttpResponse;
  end(): HttpResponse;
  setHeader(name: string, value: string): void;
  removeHeader(name: string): void;
}

/**
 * Next function type
 */
export type NextFunction = (err?: Error) => void;

/**
 * Middleware function type
 */
export type Middleware = (req: HttpRequest, res: HttpResponse, next: NextFunction) => void;

/**
 * Express-like app interface
 */
interface ExpressApp {
  use(handler: Middleware): void;
  set(setting: string, value: unknown): void;
}

/**
 * Rate limiter configuration
 */
export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  message?: string;
  keyGenerator?: (req: HttpRequest) => string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
  onLimitReached?: (req: HttpRequest, res: HttpResponse) => void;
}

/**
 * In-memory rate limit store
 */
interface RateLimitEntry {
  count: number;
  resetAt: number;
}

/**
 * Rate limiter middleware
 */
export class RateLimiter {
  private store: Map<string, RateLimitEntry> = new Map();
  private config: Required<RateLimitConfig>;
  private cleanupTimer: unknown = null;

  constructor(config: Partial<RateLimitConfig> = {}) {
    this.config = {
      windowMs: config.windowMs || 15 * 60 * 1000, // 15 minutes
      maxRequests: config.maxRequests || 100,
      message: config.message || 'Too many requests, please try again later.',
      keyGenerator: config.keyGenerator || this.defaultKeyGenerator.bind(this),
      skipSuccessfulRequests: config.skipSuccessfulRequests || false,
      skipFailedRequests: config.skipFailedRequests || false,
      onLimitReached: config.onLimitReached || (() => {}),
    };

    // Clean up expired entries every minute using globalThis
    if (globalThis.setInterval) {
      const timer = globalThis.setInterval(() => this.cleanup(), 60000);
      if (timer && timer.unref) {
        timer.unref();
      }
      this.cleanupTimer = timer;
    }
  }

  private defaultKeyGenerator(req: HttpRequest): string {
    // Use X-Forwarded-For for proxied requests, otherwise use IP
    const forwarded = req.headers['x-forwarded-for'];
    if (typeof forwarded === 'string') {
      const firstIp = forwarded.split(',')[0];
      return firstIp ? firstIp.trim() : 'unknown';
    }
    return req.ip || req.socket?.remoteAddress || 'unknown';
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.store) {
      if (now > entry.resetAt) {
        this.store.delete(key);
      }
    }
  }

  /**
   * Check if request should be rate limited
   */
  isRateLimited(key: string): { limited: boolean; remaining: number; resetAt: number } {
    const now = Date.now();
    let entry = this.store.get(key);

    if (!entry || now > entry.resetAt) {
      entry = {
        count: 0,
        resetAt: now + this.config.windowMs,
      };
      this.store.set(key, entry);
    }

    entry.count++;
    const remaining = Math.max(0, this.config.maxRequests - entry.count);
    const limited = entry.count > this.config.maxRequests;

    return { limited, remaining, resetAt: entry.resetAt };
  }

  /**
   * Express middleware
   */
  middleware(): Middleware {
    return (req: HttpRequest, res: HttpResponse, next: NextFunction) => {
      const key = this.config.keyGenerator(req);
      const { limited, remaining, resetAt } = this.isRateLimited(key);

      // Set rate limit headers
      res.setHeader('X-RateLimit-Limit', this.config.maxRequests.toString());
      res.setHeader('X-RateLimit-Remaining', remaining.toString());
      res.setHeader('X-RateLimit-Reset', Math.ceil(resetAt / 1000).toString());

      if (limited) {
        this.config.onLimitReached(req, res);
        res.setHeader('Retry-After', Math.ceil((resetAt - Date.now()) / 1000).toString());
        res.status(429).json({
          error: this.config.message,
          code: 'RATE_LIMIT_EXCEEDED',
          retryAfter: Math.ceil((resetAt - Date.now()) / 1000),
        });
        return;
      }

      next();
    };
  }

  /**
   * Destroy and clean up
   */
  destroy(): void {
    if (this.cleanupTimer && globalThis.clearInterval) {
      globalThis.clearInterval(this.cleanupTimer);
    }
    this.store.clear();
  }
}

/**
 * Security headers configuration
 */
export interface SecurityHeadersConfig {
  contentSecurityPolicy?: {
    defaultSrc?: string[];
    scriptSrc?: string[];
    styleSrc?: string[];
    imgSrc?: string[];
    connectSrc?: string[];
    fontSrc?: string[];
    objectSrc?: string[];
    mediaSrc?: string[];
    frameSrc?: string[];
  };
  hsts?: {
    maxAge?: number;
    includeSubDomains?: boolean;
    preload?: boolean;
  };
  noSniff?: boolean;
  xssFilter?: boolean;
  frameOptions?: 'DENY' | 'SAMEORIGIN' | false;
  referrerPolicy?: string;
}

/**
 * Apply security headers (helmet-like functionality)
 */
export function securityHeaders(config: SecurityHeadersConfig = {}): Middleware {
  return (_req: HttpRequest, res: HttpResponse, next: NextFunction) => {
    // Content Security Policy
    if (config.contentSecurityPolicy) {
      const csp = config.contentSecurityPolicy;
      const directives: string[] = [];

      if (csp.defaultSrc) directives.push(`default-src ${csp.defaultSrc.join(' ')}`);
      if (csp.scriptSrc) directives.push(`script-src ${csp.scriptSrc.join(' ')}`);
      if (csp.styleSrc) directives.push(`style-src ${csp.styleSrc.join(' ')}`);
      if (csp.imgSrc) directives.push(`img-src ${csp.imgSrc.join(' ')}`);
      if (csp.connectSrc) directives.push(`connect-src ${csp.connectSrc.join(' ')}`);
      if (csp.fontSrc) directives.push(`font-src ${csp.fontSrc.join(' ')}`);
      if (csp.objectSrc) directives.push(`object-src ${csp.objectSrc.join(' ')}`);
      if (csp.mediaSrc) directives.push(`media-src ${csp.mediaSrc.join(' ')}`);
      if (csp.frameSrc) directives.push(`frame-src ${csp.frameSrc.join(' ')}`);

      if (directives.length > 0) {
        res.setHeader('Content-Security-Policy', directives.join('; '));
      }
    }

    // HTTP Strict Transport Security
    if (config.hsts) {
      const { maxAge = 31536000, includeSubDomains = true, preload = true } = config.hsts;
      let hstsValue = `max-age=${maxAge}`;
      if (includeSubDomains) hstsValue += '; includeSubDomains';
      if (preload) hstsValue += '; preload';
      res.setHeader('Strict-Transport-Security', hstsValue);
    }

    // X-Content-Type-Options
    if (config.noSniff !== false) {
      res.setHeader('X-Content-Type-Options', 'nosniff');
    }

    // X-XSS-Protection
    if (config.xssFilter !== false) {
      res.setHeader('X-XSS-Protection', '1; mode=block');
    }

    // X-Frame-Options
    if (config.frameOptions !== false) {
      res.setHeader('X-Frame-Options', config.frameOptions || 'DENY');
    }

    // Referrer-Policy
    if (config.referrerPolicy) {
      res.setHeader('Referrer-Policy', config.referrerPolicy);
    } else {
      res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    }

    // Remove X-Powered-By
    res.removeHeader('X-Powered-By');

    next();
  };
}

/**
 * Apply all security middleware to an Express app
 */
export function applySecurityMiddleware(app: ExpressApp, options: {
  rateLimit?: Partial<RateLimitConfig>;
  headers?: SecurityHeadersConfig;
  trustProxy?: boolean;
} = {}): void {
  // Trust proxy for accurate IP detection behind load balancers
  if (options.trustProxy !== false) {
    app.set('trust proxy', 1);
  }

  // Security headers
  app.use(securityHeaders({
    contentSecurityPolicy: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'", 'https:'],
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
    ...options.headers,
  }));

  // Rate limiting
  const rateLimiter = new RateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
    ...options.rateLimit,
  });
  app.use(rateLimiter.middleware());

  // Content-Type validation for POST requests
  app.use((req: HttpRequest, res: HttpResponse, next: NextFunction) => {
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
      const contentType = req.headers['content-type'];
      const ct = typeof contentType === 'string' ? contentType : '';
      if (ct && !ct.includes('application/json') && !ct.includes('multipart/form-data')) {
        res.status(415).json({
          error: 'Unsupported Media Type',
          code: 'UNSUPPORTED_MEDIA_TYPE',
          message: 'Content-Type must be application/json',
        });
        return;
      }
    }
    next();
  });
}

/**
 * Sanitize user input to prevent XSS and injection attacks
 */
export function sanitizeInput(input: string, options: {
  maxLength?: number;
  allowHtml?: boolean;
  trim?: boolean;
} = {}): string {
  const { maxLength = 1000, allowHtml = false, trim = true } = options;

  let sanitized = input;

  // Trim whitespace
  if (trim) {
    sanitized = sanitized.trim();
  }

  // Remove HTML tags if not allowed
  if (!allowHtml) {
    sanitized = sanitized
      .replace(/[<>]/g, '') // Remove angle brackets
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/data:/gi, '') // Remove data: protocol
      .replace(/vbscript:/gi, '') // Remove vbscript: protocol
      .replace(/on\w+=/gi, ''); // Remove event handlers
  }

  // Enforce max length
  if (sanitized.length > maxLength) {
    sanitized = sanitized.slice(0, maxLength);
  }

  return sanitized;
}

/**
 * Sanitize an object recursively
 */
export function sanitizeObject<T extends Record<string, unknown>>(
  obj: T,
  options: {
    maxLength?: number;
    allowHtml?: boolean;
    maxDepth?: number;
  } = {},
  depth = 0
): T {
  const { maxDepth = 10 } = options;

  if (depth > maxDepth) {
    return {} as T;
  }

  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    const sanitizedKey = sanitizeInput(key, { maxLength: 100 });

    if (typeof value === 'string') {
      result[sanitizedKey] = sanitizeInput(value, options);
    } else if (Array.isArray(value)) {
      result[sanitizedKey] = value.map((item) =>
        typeof item === 'string'
          ? sanitizeInput(item, options)
          : typeof item === 'object' && item !== null
            ? sanitizeObject(item as Record<string, unknown>, options, depth + 1)
            : item
      );
    } else if (typeof value === 'object' && value !== null) {
      result[sanitizedKey] = sanitizeObject(value as Record<string, unknown>, options, depth + 1);
    } else {
      result[sanitizedKey] = value;
    }
  }

  return result as T;
}

/**
 * Validate Ethereum address format
 */
export function isValidAddress(address: string): boolean {
  if (!address || typeof address !== 'string') return false;
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Validate transaction hash format
 */
export function isValidTxHash(hash: string): boolean {
  if (!hash || typeof hash !== 'string') return false;
  return /^0x[a-fA-F0-9]{64}$/.test(hash);
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  // Simple URL validation without using URL constructor
  if (!url || typeof url !== 'string') return false;
  const urlPattern = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;
  return urlPattern.test(url);
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

/**
 * Validate API key format (alphanumeric with hyphens/underscores)
 */
export function isValidApiKey(key: string): boolean {
  if (!key || typeof key !== 'string') return false;
  return /^[a-zA-Z0-9_-]{16,128}$/.test(key);
}

/**
 * Parse and validate JSON safely
 */
export function safeJsonParse<T>(json: string, defaultValue?: T): T | undefined {
  try {
    return JSON.parse(json) as T;
  } catch {
    return defaultValue;
  }
}

/**
 * CORS configuration helper
 */
export interface CorsConfig {
  origin?: string | string[] | RegExp | ((origin: string) => boolean);
  methods?: string[];
  allowedHeaders?: string[];
  exposedHeaders?: string[];
  credentials?: boolean;
  maxAge?: number;
}

/**
 * CORS middleware
 */
export function cors(config: CorsConfig = {}): Middleware {
  const {
    origin = '*',
    methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders = ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Payment', 'X-Payment-Response'],
    exposedHeaders = ['X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset'],
    credentials = false,
    maxAge = 86400, // 24 hours
  } = config;

  return (req: HttpRequest, res: HttpResponse, next: NextFunction) => {
    const originHeader = req.headers.origin;
    const requestOrigin = typeof originHeader === 'string' ? originHeader : '';

    // Determine if origin is allowed
    let allowedOrigin: string = '';
    if (origin === '*') {
      allowedOrigin = '*';
    } else if (typeof origin === 'string') {
      allowedOrigin = origin;
    } else if (Array.isArray(origin)) {
      if (origin.includes(requestOrigin)) {
        allowedOrigin = requestOrigin;
      }
    } else if (origin instanceof RegExp) {
      if (origin.test(requestOrigin)) {
        allowedOrigin = requestOrigin;
      }
    } else if (typeof origin === 'function') {
      if (origin(requestOrigin)) {
        allowedOrigin = requestOrigin;
      }
    }

    if (allowedOrigin) {
      res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
    }

    res.setHeader('Access-Control-Allow-Methods', methods.join(', '));
    res.setHeader('Access-Control-Allow-Headers', allowedHeaders.join(', '));
    res.setHeader('Access-Control-Expose-Headers', exposedHeaders.join(', '));
    res.setHeader('Access-Control-Max-Age', maxAge.toString());

    if (credentials) {
      res.setHeader('Access-Control-Allow-Credentials', 'true');
    }

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      res.status(204).end();
      return;
    }

    next();
  };
}

/**
 * Request body size limiter
 */
export function bodySizeLimit(maxBytes: number = 1024 * 1024): Middleware { // 1MB default
  return (req: HttpRequest, res: HttpResponse, next: NextFunction) => {
    const contentLength = req.headers['content-length'];
    const cl = typeof contentLength === 'string' ? contentLength : '';

    if (cl && parseInt(cl, 10) > maxBytes) {
      res.status(413).json({
        error: 'Payload too large',
        code: 'PAYLOAD_TOO_LARGE',
        maxSize: maxBytes,
      });
      return;
    }

    // For streaming body size check
    if (req.on) {
      let size = 0;
      req.on('data', (chunk: { length: number }) => {
        size += chunk.length;
        if (size > maxBytes && req.destroy) {
          req.destroy();
          res.status(413).json({
            error: 'Payload too large',
            code: 'PAYLOAD_TOO_LARGE',
            maxSize: maxBytes,
          });
        }
      });
    }

    next();
  };
}

export default {
  RateLimiter,
  securityHeaders,
  applySecurityMiddleware,
  sanitizeInput,
  sanitizeObject,
  isValidAddress,
  isValidTxHash,
  isValidUrl,
  isValidEmail,
  isValidApiKey,
  safeJsonParse,
  cors,
  bodySizeLimit,
};
