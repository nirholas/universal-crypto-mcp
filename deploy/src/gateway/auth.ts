/**
 * Authentication Middleware for x402 Gateway
 * 
 * @author nirholas (Nich)
 * @license Apache-2.0
 */

import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

// ============================================================================
// Types
// ============================================================================

export interface AuthenticatedRequest extends Request {
  auth?: {
    type: 'api_key' | 'x402' | 'jwt' | 'anonymous';
    userId?: string;
    tier?: string;
    rateLimit?: number;
    metadata?: Record<string, unknown>;
  };
}

export interface ApiKey {
  id: string;
  key: string;
  userId: string;
  tier: 'free' | 'basic' | 'pro' | 'enterprise';
  rateLimit: number;
  allowedEndpoints: string[];
  createdAt: Date;
  expiresAt?: Date;
  lastUsedAt?: Date;
  metadata?: Record<string, unknown>;
}

export interface AuthConfig {
  apiKeyHeader: string;
  apiKeyPrefix: string;
  requireAuth: boolean;
  allowAnonymous: boolean;
  anonymousTier: string;
  anonymousRateLimit: number;
}

// ============================================================================
// Default Configuration
// ============================================================================

const defaultAuthConfig: AuthConfig = {
  apiKeyHeader: 'x-api-key',
  apiKeyPrefix: 'ucm_',
  requireAuth: false,
  allowAnonymous: true,
  anonymousTier: 'free',
  anonymousRateLimit: 10,
};

// ============================================================================
// API Key Store (in-memory for demo, use database in production)
// ============================================================================

class ApiKeyStore {
  private keys: Map<string, ApiKey> = new Map();
  private keysByUserId: Map<string, Set<string>> = new Map();

  async get(keyHash: string): Promise<ApiKey | undefined> {
    return this.keys.get(keyHash);
  }

  async set(key: ApiKey): Promise<void> {
    const keyHash = this.hashKey(key.key);
    this.keys.set(keyHash, key);
    
    if (!this.keysByUserId.has(key.userId)) {
      this.keysByUserId.set(key.userId, new Set());
    }
    this.keysByUserId.get(key.userId)!.add(keyHash);
  }

  async delete(keyHash: string): Promise<boolean> {
    const key = this.keys.get(keyHash);
    if (key) {
      this.keysByUserId.get(key.userId)?.delete(keyHash);
      return this.keys.delete(keyHash);
    }
    return false;
  }

  async getByUserId(userId: string): Promise<ApiKey[]> {
    const keyHashes = this.keysByUserId.get(userId);
    if (!keyHashes) return [];
    
    const keys: ApiKey[] = [];
    for (const hash of keyHashes) {
      const key = this.keys.get(hash);
      if (key) keys.push(key);
    }
    return keys;
  }

  async updateLastUsed(keyHash: string): Promise<void> {
    const key = this.keys.get(keyHash);
    if (key) {
      key.lastUsedAt = new Date();
    }
  }

  hashKey(key: string): string {
    return crypto.createHash('sha256').update(key).digest('hex');
  }

  generateKey(): string {
    const random = crypto.randomBytes(24).toString('base64url');
    return `ucm_${random}`;
  }
}

export const apiKeyStore = new ApiKeyStore();

// ============================================================================
// Authentication Middleware
// ============================================================================

export function authMiddleware(
  config: Partial<AuthConfig> = {},
): (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void> {
  const cfg = { ...defaultAuthConfig, ...config };

  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // Check for API key
    const apiKey = extractApiKey(req, cfg);
    
    if (apiKey) {
      const keyHash = apiKeyStore.hashKey(apiKey);
      const keyData = await apiKeyStore.get(keyHash);

      if (keyData) {
        // Check expiration
        if (keyData.expiresAt && keyData.expiresAt < new Date()) {
          res.status(401).json({
            error: 'API key expired',
            code: 'API_KEY_EXPIRED',
          });
          return;
        }

        // Check endpoint access
        const endpoint = req.path;
        if (keyData.allowedEndpoints.length > 0) {
          const allowed = keyData.allowedEndpoints.some(
            (pattern) => matchEndpoint(endpoint, pattern),
          );
          if (!allowed) {
            res.status(403).json({
              error: 'Endpoint not allowed for this API key',
              code: 'ENDPOINT_NOT_ALLOWED',
            });
            return;
          }
        }

        // Update last used
        await apiKeyStore.updateLastUsed(keyHash);

        // Set auth context
        req.auth = {
          type: 'api_key',
          userId: keyData.userId,
          tier: keyData.tier,
          rateLimit: keyData.rateLimit,
          metadata: keyData.metadata,
        };

        return next();
      }

      // Invalid API key
      res.status(401).json({
        error: 'Invalid API key',
        code: 'INVALID_API_KEY',
      });
      return;
    }

    // Check for x402 payment (handled by x402 middleware)
    const x402Header = req.headers['x-402-receipt'];
    if (x402Header) {
      // x402 payments are handled by x402 middleware
      // Set as x402 auth type here
      req.auth = {
        type: 'x402',
        tier: 'x402',
        rateLimit: 100000, // High limit for paying users
      };
      return next();
    }

    // No authentication provided
    if (!cfg.allowAnonymous && cfg.requireAuth) {
      res.status(401).json({
        error: 'Authentication required',
        code: 'AUTH_REQUIRED',
        methods: ['API key', 'x402 payment'],
      });
      return;
    }

    // Allow anonymous access
    req.auth = {
      type: 'anonymous',
      tier: cfg.anonymousTier,
      rateLimit: cfg.anonymousRateLimit,
    };
    
    next();
  };
}

/**
 * Extract API key from request
 */
function extractApiKey(req: Request, config: AuthConfig): string | undefined {
  // Check header
  const headerKey = req.headers[config.apiKeyHeader.toLowerCase()] as string;
  if (headerKey) {
    return headerKey;
  }

  // Check Authorization header with Bearer scheme
  const authHeader = req.headers['authorization'];
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    if (token.startsWith(config.apiKeyPrefix)) {
      return token;
    }
  }

  // Check query parameter (not recommended for production)
  const queryKey = req.query['api_key'] as string;
  if (queryKey && queryKey.startsWith(config.apiKeyPrefix)) {
    return queryKey;
  }

  return undefined;
}

/**
 * Match endpoint against pattern
 */
function matchEndpoint(endpoint: string, pattern: string): boolean {
  // Simple wildcard matching
  if (pattern === '*') return true;
  if (pattern.endsWith('*')) {
    const prefix = pattern.slice(0, -1);
    return endpoint.startsWith(prefix);
  }
  return endpoint === pattern;
}

// ============================================================================
// Require Specific Tier Middleware
// ============================================================================

export function requireTier(
  ...allowedTiers: string[]
): (req: AuthenticatedRequest, res: Response, next: NextFunction) => void {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.auth) {
      res.status(401).json({
        error: 'Authentication required',
        code: 'AUTH_REQUIRED',
      });
      return;
    }

    const tier = req.auth.tier || 'free';
    if (!allowedTiers.includes(tier)) {
      res.status(403).json({
        error: 'Insufficient tier',
        code: 'TIER_REQUIRED',
        required: allowedTiers,
        current: tier,
      });
      return;
    }

    next();
  };
}

// ============================================================================
// Require x402 Payment Middleware
// ============================================================================

export function requireX402(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void {
  if (req.auth?.type !== 'x402') {
    res.status(402).json({
      error: 'Payment required',
      code: 'PAYMENT_REQUIRED',
      x402: {
        accepts: 'x402',
        price: 'See endpoint pricing',
        tokens: ['USDC', 'USDT', 'ETH'],
        networks: ['base', 'arbitrum', 'ethereum'],
      },
    });
    return;
  }

  next();
}

// ============================================================================
// API Key Management Routes
// ============================================================================

export interface ApiKeyRoutes {
  create: (req: AuthenticatedRequest, res: Response) => Promise<void>;
  list: (req: AuthenticatedRequest, res: Response) => Promise<void>;
  revoke: (req: AuthenticatedRequest, res: Response) => Promise<void>;
}

export const apiKeyRoutes: ApiKeyRoutes = {
  async create(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { tier = 'free', allowedEndpoints = ['*'], expiresIn } = req.body;
    
    // Generate new API key
    const key = apiKeyStore.generateKey();
    const apiKey: ApiKey = {
      id: crypto.randomUUID(),
      key,
      userId: req.auth?.userId || 'anonymous',
      tier: tier as 'free' | 'basic' | 'pro' | 'enterprise',
      rateLimit: getTierRateLimit(tier),
      allowedEndpoints,
      createdAt: new Date(),
      expiresAt: expiresIn ? new Date(Date.now() + expiresIn) : undefined,
    };

    await apiKeyStore.set(apiKey);

    res.status(201).json({
      id: apiKey.id,
      key, // Only shown once!
      tier: apiKey.tier,
      rateLimit: apiKey.rateLimit,
      allowedEndpoints: apiKey.allowedEndpoints,
      createdAt: apiKey.createdAt.toISOString(),
      expiresAt: apiKey.expiresAt?.toISOString(),
      warning: 'Store this key securely. It will not be shown again.',
    });
  },

  async list(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.auth?.userId) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const keys = await apiKeyStore.getByUserId(req.auth.userId);
    
    res.json({
      keys: keys.map((k) => ({
        id: k.id,
        keyPrefix: k.key.slice(0, 8) + '...',
        tier: k.tier,
        rateLimit: k.rateLimit,
        allowedEndpoints: k.allowedEndpoints,
        createdAt: k.createdAt.toISOString(),
        expiresAt: k.expiresAt?.toISOString(),
        lastUsedAt: k.lastUsedAt?.toISOString(),
      })),
    });
  },

  async revoke(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { keyId } = req.params;
    
    // Find and delete key
    // Note: In production, use database with proper indexing
    const deleted = await apiKeyStore.delete(keyId);
    
    if (deleted) {
      res.json({ success: true, message: 'API key revoked' });
    } else {
      res.status(404).json({ error: 'API key not found' });
    }
  },
};

function getTierRateLimit(tier: string): number {
  switch (tier) {
    case 'enterprise':
      return 10000;
    case 'pro':
      return 1000;
    case 'basic':
      return 100;
    default:
      return 10;
  }
}

export default authMiddleware;
