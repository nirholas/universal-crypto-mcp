/**
 * Security utilities for request validation and protection
 * @module utils/security
 */

import crypto from 'crypto';

/**
 * Generate a random token
 */
export function generateToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Generate a secure random string
 */
export function generateSecureRandom(length: number = 16): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const bytes = crypto.randomBytes(length);
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars[bytes[i] % chars.length];
  }
  
  return result;
}

/**
 * Hash a string with SHA-256
 */
export function sha256(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}

/**
 * Hash a string with HMAC-SHA256
 */
export function hmacSha256(data: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(data).digest('hex');
}

/**
 * Verify HMAC signature
 */
export function verifyHmac(data: string, signature: string, secret: string): boolean {
  const expected = hmacSha256(data, secret);
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  );
}

/**
 * Generate API key
 */
export function generateApiKey(prefix = 'sk'): string {
  return `${prefix}_${generateToken(32)}`;
}

/**
 * Rate limit in-memory store
 */
export class RateLimitStore {
  private requests = new Map<string, number[]>();
  private cleanupInterval: NodeJS.Timeout;
  
  constructor(private cleanupIntervalMs = 60000) {
    this.cleanupInterval = setInterval(() => this.cleanup(), cleanupIntervalMs);
  }
  
  /**
   * Record a request
   */
  increment(key: string): void {
    const now = Date.now();
    const requests = this.requests.get(key) || [];
    requests.push(now);
    this.requests.set(key, requests);
  }
  
  /**
   * Get request count in window
   */
  getCount(key: string, windowMs: number): number {
    const now = Date.now();
    const requests = this.requests.get(key) || [];
    const recentRequests = requests.filter(time => time > now - windowMs);
    this.requests.set(key, recentRequests);
    return recentRequests.length;
  }
  
  /**
   * Check if rate limit exceeded
   */
  isLimited(key: string, limit: number, windowMs: number): boolean {
    return this.getCount(key, windowMs) >= limit;
  }
  
  /**
   * Clean up old entries
   */
  private cleanup(): void {
    const now = Date.now();
    const maxAge = 3600000; // 1 hour
    
    this.requests.forEach((requests, key) => {
      const recent = requests.filter(time => time > now - maxAge);
      if (recent.length === 0) {
        this.requests.delete(key);
      } else {
        this.requests.set(key, recent);
      }
    });
  }
  
  /**
   * Clear all entries
   */
  clear(): void {
    this.requests.clear();
  }
  
  /**
   * Destroy store
   */
  destroy(): void {
    clearInterval(this.cleanupInterval);
    this.clear();
  }
}

/**
 * CORS configuration helper
 */
export interface CorsOptions {
  origins?: string[] | string;
  methods?: string[];
  allowedHeaders?: string[];
  exposedHeaders?: string[];
  credentials?: boolean;
  maxAge?: number;
}

export function getCorsHeaders(
  origin: string,
  options: CorsOptions = {}
): Record<string, string> {
  const headers: Record<string, string> = {};
  
  // Check origin
  const allowedOrigins = options.origins || '*';
  if (Array.isArray(allowedOrigins)) {
    if (allowedOrigins.includes(origin)) {
      headers['Access-Control-Allow-Origin'] = origin;
    }
  } else if (allowedOrigins === '*') {
    headers['Access-Control-Allow-Origin'] = '*';
  } else if (allowedOrigins === origin) {
    headers['Access-Control-Allow-Origin'] = origin;
  }
  
  // Methods
  if (options.methods) {
    headers['Access-Control-Allow-Methods'] = options.methods.join(', ');
  }
  
  // Headers
  if (options.allowedHeaders) {
    headers['Access-Control-Allow-Headers'] = options.allowedHeaders.join(', ');
  }
  
  if (options.exposedHeaders) {
    headers['Access-Control-Expose-Headers'] = options.exposedHeaders.join(', ');
  }
  
  // Credentials
  if (options.credentials) {
    headers['Access-Control-Allow-Credentials'] = 'true';
  }
  
  // Max age
  if (options.maxAge) {
    headers['Access-Control-Max-Age'] = String(options.maxAge);
  }
  
  return headers;
}

/**
 * Content Security Policy builder
 */
export class CspBuilder {
  private directives = new Map<string, string[]>();
  
  addDirective(name: string, values: string[]): this {
    this.directives.set(name, values);
    return this;
  }
  
  defaultSrc(...values: string[]): this {
    return this.addDirective('default-src', values);
  }
  
  scriptSrc(...values: string[]): this {
    return this.addDirective('script-src', values);
  }
  
  styleSrc(...values: string[]): this {
    return this.addDirective('style-src', values);
  }
  
  imgSrc(...values: string[]): this {
    return this.addDirective('img-src', values);
  }
  
  connectSrc(...values: string[]): this {
    return this.addDirective('connect-src', values);
  }
  
  fontSrc(...values: string[]): this {
    return this.addDirective('font-src', values);
  }
  
  objectSrc(...values: string[]): this {
    return this.addDirective('object-src', values);
  }
  
  mediaSrc(...values: string[]): this {
    return this.addDirective('media-src', values);
  }
  
  frameSrc(...values: string[]): this {
    return this.addDirective('frame-src', values);
  }
  
  build(): string {
    const directives: string[] = [];
    
    this.directives.forEach((values, name) => {
      directives.push(`${name} ${values.join(' ')}`);
    });
    
    return directives.join('; ');
  }
}

/**
 * Security headers middleware
 */
export function securityHeaders(options: {
  csp?: string;
  hsts?: boolean;
  noSniff?: boolean;
  frameOptions?: 'DENY' | 'SAMEORIGIN';
  xssProtection?: boolean;
} = {}) {
  return (_req: any, res: any, next: any) => {
    // Content Security Policy
    if (options.csp) {
      res.setHeader('Content-Security-Policy', options.csp);
    }
    
    // HSTS
    if (options.hsts !== false) {
      res.setHeader(
        'Strict-Transport-Security',
        'max-age=31536000; includeSubDomains'
      );
    }
    
    // X-Content-Type-Options
    if (options.noSniff !== false) {
      res.setHeader('X-Content-Type-Options', 'nosniff');
    }
    
    // X-Frame-Options
    if (options.frameOptions) {
      res.setHeader('X-Frame-Options', options.frameOptions);
    }
    
    // X-XSS-Protection
    if (options.xssProtection !== false) {
      res.setHeader('X-XSS-Protection', '1; mode=block');
    }
    
    // Remove X-Powered-By
    res.removeHeader('X-Powered-By');
    
    next();
  };
}

/**
 * Request signature verification
 */
export function verifyRequestSignature(
  body: string,
  signature: string,
  secret: string,
  algorithm: 'sha1' | 'sha256' = 'sha256'
): boolean {
  const hmac = crypto.createHmac(algorithm, secret);
  hmac.update(body);
  const expected = hmac.digest('hex');
  
  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expected)
    );
  } catch {
    return false;
  }
}

/**
 * Encrypt data with AES-256-GCM
 */
export function encrypt(data: string, key: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(key, 'hex'), iv);
  
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

/**
 * Decrypt data encrypted with AES-256-GCM
 */
export function decrypt(encryptedData: string, key: string): string {
  const [ivHex, authTagHex, encrypted] = encryptedData.split(':');
  
  const decipher = crypto.createDecipheriv(
    'aes-256-gcm',
    Buffer.from(key, 'hex'),
    Buffer.from(ivHex, 'hex')
  );
  
  decipher.setAuthTag(Buffer.from(authTagHex, 'hex'));
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

/**
 * Generate encryption key
 */
export function generateEncryptionKey(): string {
  return crypto.randomBytes(32).toString('hex');
}
