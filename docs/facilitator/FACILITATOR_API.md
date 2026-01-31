# 🌐 Agent 3: REST API & WebSocket

## 🎯 Mission

Build the HTTP API and WebSocket server that exposes the facilitator to resource servers and clients. You create the interface that the world uses to interact with our payment infrastructure.

---

## 📋 Context

You are working on the `universal-crypto-mcp` repository. Agent 1 built the core facilitator, Agent 2 built the settlement engine. You expose these via HTTP/WebSocket.

**Your Dependencies:**
- Agent 1's `FacilitatorServer` from `src/core/`
- Agent 2's `SettlementEngine` from `src/settlement/`
- All types from both agents

**Key Reference Files:**
- `/workspaces/universal-crypto-mcp/x402/typescript/packages/` - x402 API patterns
- `/workspaces/universal-crypto-mcp/deploy/src/` - Existing server patterns

---

## 🏗️ Phase 1: HTTP Server Foundation

### Task 1.1: Create Server Types

Create `src/api/types.ts`:

```typescript
/**
 * API types for the facilitator HTTP/WebSocket server
 */

import type {
  PaymentRequirements,
  PaymentProof,
  PaymentResult,
  FacilitatorStats,
} from '../core/types.js';

// ═══════════════════════════════════════════════════════════════
// Request/Response Types
// ═══════════════════════════════════════════════════════════════

export interface VerifyRequest {
  proof: PaymentProof;
  requirements: PaymentRequirements;
}

export interface VerifyResponse {
  success: boolean;
  paymentId?: string;
  status?: string;
  error?: string;
  fee?: string;
}

export interface SettleRequest {
  paymentId: string;
}

export interface SettleResponse {
  success: boolean;
  paymentId: string;
  status: string;
  transaction?: string;
  error?: string;
}

export interface StatusRequest {
  paymentId: string;
}

export interface StatusResponse {
  found: boolean;
  payment?: PaymentResult;
}

export interface StatsResponse {
  stats: FacilitatorStats;
  uptime: number;
  version: string;
}

export interface HealthResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  checks: {
    database: boolean;
    redis: boolean;
    networks: Record<string, boolean>;
  };
  timestamp: number;
}

// ═══════════════════════════════════════════════════════════════
// WebSocket Types
// ═══════════════════════════════════════════════════════════════

export type WebSocketMessageType =
  | 'subscribe'
  | 'unsubscribe'
  | 'payment:received'
  | 'payment:verified'
  | 'payment:settled'
  | 'payment:failed'
  | 'stats:update'
  | 'error';

export interface WebSocketMessage {
  type: WebSocketMessageType;
  data: unknown;
  timestamp: number;
}

export interface SubscribeMessage {
  type: 'subscribe';
  channels: ('payments' | 'stats' | 'errors')[];
  filter?: {
    network?: string;
    payee?: string;
  };
}

// ═══════════════════════════════════════════════════════════════
// API Configuration
// ═══════════════════════════════════════════════════════════════

export interface APIConfig {
  port: number;
  host: string;
  cors: {
    origins: string[];
    methods: string[];
  };
  rateLimit: {
    windowMs: number;
    maxRequests: number;
  };
  auth: {
    apiKeyHeader: string;
    jwtSecret?: string;
  };
  websocket: {
    path: string;
    pingInterval: number;
  };
}
```

### Task 1.2: Create Hono Server

Create `src/api/server.ts`:

```typescript
/**
 * Hono HTTP Server for Facilitator
 * Fast, lightweight, and TypeScript-first
 */

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';
import { prettyJSON } from 'hono/pretty-json';
import { timing } from 'hono/timing';
import { serve } from '@hono/node-server';
import { createNodeWebSocket } from '@hono/node-ws';

import type { APIConfig } from './types.js';
import type { FacilitatorServer } from '../core/FacilitatorServer.js';
import { createVerifyRoute } from './routes/verify.js';
import { createSettleRoute } from './routes/settle.js';
import { createStatusRoute } from './routes/status.js';
import { createAnalyticsRoute } from './routes/analytics.js';
import { createHealthRoute } from './routes/health.js';
import { authMiddleware } from './middleware/auth.js';
import { rateLimitMiddleware } from './middleware/rateLimit.js';
import { errorHandler } from './middleware/errorHandler.js';
import { PaymentStream } from './websocket/PaymentStream.js';
import { createLogger } from '../utils/logger.js';

const log = createLogger('APIServer');

export class FacilitatorAPI {
  private app: Hono;
  private config: APIConfig;
  private facilitator: FacilitatorServer;
  private paymentStream: PaymentStream;
  private server?: ReturnType<typeof serve>;

  constructor(facilitator: FacilitatorServer, config: APIConfig) {
    this.facilitator = facilitator;
    this.config = config;
    this.paymentStream = new PaymentStream(facilitator);
    this.app = this.createApp();
  }

  /**
   * Create the Hono app with all middleware and routes
   */
  private createApp(): Hono {
    const app = new Hono();

    // Global middleware
    app.use('*', logger());
    app.use('*', timing());
    app.use('*', secureHeaders());
    app.use('*', prettyJSON());
    
    // CORS
    app.use('*', cors({
      origin: this.config.cors.origins,
      allowMethods: this.config.cors.methods,
      allowHeaders: ['Content-Type', 'Authorization', 'X-API-Key', 'X-Payment'],
      exposeHeaders: ['X-Request-Id', 'X-Response-Time'],
    }));

    // Error handling
    app.onError(errorHandler);

    // Health check (no auth required)
    app.route('/health', createHealthRoute(this.facilitator));

    // API v1 routes with auth
    const v1 = new Hono();
    
    // Rate limiting
    v1.use('*', rateLimitMiddleware(this.config.rateLimit));
    
    // Optional auth (some routes may be public)
    v1.use('*', authMiddleware(this.config.auth));

    // Mount routes
    v1.route('/verify', createVerifyRoute(this.facilitator));
    v1.route('/settle', createSettleRoute(this.facilitator));
    v1.route('/status', createStatusRoute(this.facilitator));
    v1.route('/analytics', createAnalyticsRoute(this.facilitator));

    app.route('/v1', v1);

    // WebSocket upgrade
    const { injectWebSocket, upgradeWebSocket } = createNodeWebSocket({ app });
    
    app.get(
      this.config.websocket.path,
      upgradeWebSocket((c) => this.paymentStream.handleConnection(c))
    );

    // Root info
    app.get('/', (c) => c.json({
      name: 'x402 Facilitator',
      version: '1.0.0',
      docs: '/docs',
      health: '/health',
      api: '/v1',
      websocket: this.config.websocket.path,
    }));

    return app;
  }

  /**
   * Start the HTTP server
   */
  async start(): Promise<void> {
    log.info('Starting API server', {
      port: this.config.port,
      host: this.config.host,
    });

    this.server = serve({
      fetch: this.app.fetch,
      port: this.config.port,
      hostname: this.config.host,
    });

    log.info('API server started', {
      url: `http://${this.config.host}:${this.config.port}`,
    });
  }

  /**
   * Stop the HTTP server
   */
  async stop(): Promise<void> {
    log.info('Stopping API server');
    
    if (this.server) {
      this.server.close();
    }
    
    this.paymentStream.shutdown();
    
    log.info('API server stopped');
  }

  /**
   * Get the Hono app instance (for testing)
   */
  getApp(): Hono {
    return this.app;
  }
}
```

### Task 1.3: Create Verify Route

Create `src/api/routes/verify.ts`:

```typescript
/**
 * Verify Route
 * Validates payment proofs and queues for settlement
 */

import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import type { FacilitatorServer } from '../../core/FacilitatorServer.js';
import type { VerifyRequest, VerifyResponse } from '../types.js';
import { createLogger } from '../../utils/logger.js';

const log = createLogger('VerifyRoute');

// Request validation schema
const verifySchema = z.object({
  proof: z.object({
    scheme: z.enum(['exact', 'upto', 'stream']),
    network: z.string(),
    signature: z.string(),
    payload: z.object({
      amount: z.string(),
      asset: z.string(),
      from: z.string(),
      to: z.string(),
      nonce: z.string(),
      deadline: z.number(),
      validAfter: z.number().optional(),
      validBefore: z.number().optional(),
    }),
  }),
  requirements: z.object({
    scheme: z.enum(['exact', 'upto', 'stream']),
    network: z.string(),
    amount: z.string(),
    asset: z.string(),
    payTo: z.string(),
    maxAge: z.number().optional(),
    description: z.string().optional(),
    resource: z.string().optional(),
  }),
});

export function createVerifyRoute(facilitator: FacilitatorServer): Hono {
  const app = new Hono();

  /**
   * POST /verify
   * Verify a payment proof and queue for settlement
   */
  app.post(
    '/',
    zValidator('json', verifySchema),
    async (c) => {
      const startTime = Date.now();
      const requestId = c.req.header('X-Request-Id') || crypto.randomUUID();

      try {
        const body = c.req.valid('json') as VerifyRequest;

        log.info('Verifying payment', {
          requestId,
          network: body.proof.network,
          amount: body.proof.payload.amount,
        });

        const result = await facilitator.verify(body.proof, body.requirements);

        const response: VerifyResponse = {
          success: true,
          paymentId: result.paymentId,
          status: result.status,
          fee: result.amount, // Include fee info
        };

        log.info('Payment verified', {
          requestId,
          paymentId: result.paymentId,
          duration: Date.now() - startTime,
        });

        return c.json(response, 200);

      } catch (error) {
        log.error('Verification failed', {
          requestId,
          error: error instanceof Error ? error.message : 'Unknown error',
        });

        const response: VerifyResponse = {
          success: false,
          error: error instanceof Error ? error.message : 'Verification failed',
        };

        // Determine status code based on error type
        const status = getErrorStatus(error);
        return c.json(response, status);
      }
    }
  );

  /**
   * POST /verify/batch
   * Verify multiple payment proofs at once
   */
  app.post('/batch', async (c) => {
    const body = await c.req.json<{ payments: VerifyRequest[] }>();
    
    const results = await Promise.allSettled(
      body.payments.map(p => facilitator.verify(p.proof, p.requirements))
    );

    return c.json({
      results: results.map((r, i) => ({
        index: i,
        success: r.status === 'fulfilled',
        paymentId: r.status === 'fulfilled' ? r.value.paymentId : undefined,
        error: r.status === 'rejected' ? r.reason.message : undefined,
      })),
    });
  });

  return app;
}

function getErrorStatus(error: unknown): number {
  if (error instanceof Error) {
    if (error.message.includes('expired')) return 410;
    if (error.message.includes('Invalid')) return 400;
    if (error.message.includes('Insufficient')) return 402;
    if (error.message.includes('Unsupported')) return 501;
  }
  return 400;
}
```

### Task 1.4: Create Settle Route

Create `src/api/routes/settle.ts`:

```typescript
/**
 * Settle Route
 * Triggers settlement of verified payments
 */

import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import type { FacilitatorServer } from '../../core/FacilitatorServer.js';
import type { SettleResponse } from '../types.js';
import { createLogger } from '../../utils/logger.js';

const log = createLogger('SettleRoute');

const settleSchema = z.object({
  paymentId: z.string().uuid(),
});

const batchSettleSchema = z.object({
  paymentIds: z.array(z.string().uuid()).min(1).max(100),
});

export function createSettleRoute(facilitator: FacilitatorServer): Hono {
  const app = new Hono();

  /**
   * POST /settle
   * Settle a single verified payment
   */
  app.post(
    '/',
    zValidator('json', settleSchema),
    async (c) => {
      const { paymentId } = c.req.valid('json');
      const requestId = c.req.header('X-Request-Id') || crypto.randomUUID();

      try {
        log.info('Settling payment', { requestId, paymentId });

        const result = await facilitator.settle(paymentId);

        const response: SettleResponse = {
          success: result.success,
          paymentId: result.paymentId,
          status: result.status,
          transaction: result.transaction,
        };

        log.info('Payment settlement complete', {
          requestId,
          paymentId,
          transaction: result.transaction,
        });

        return c.json(response, 200);

      } catch (error) {
        log.error('Settlement failed', {
          requestId,
          paymentId,
          error: error instanceof Error ? error.message : 'Unknown',
        });

        return c.json({
          success: false,
          paymentId,
          status: 'failed',
          error: error instanceof Error ? error.message : 'Settlement failed',
        }, 500);
      }
    }
  );

  /**
   * POST /settle/batch
   * Settle multiple payments at once
   */
  app.post(
    '/batch',
    zValidator('json', batchSettleSchema),
    async (c) => {
      const { paymentIds } = c.req.valid('json');

      const results = await Promise.allSettled(
        paymentIds.map(id => facilitator.settle(id))
      );

      return c.json({
        total: paymentIds.length,
        succeeded: results.filter(r => r.status === 'fulfilled').length,
        failed: results.filter(r => r.status === 'rejected').length,
        results: results.map((r, i) => ({
          paymentId: paymentIds[i],
          success: r.status === 'fulfilled',
          transaction: r.status === 'fulfilled' ? r.value.transaction : undefined,
          error: r.status === 'rejected' ? r.reason.message : undefined,
        })),
      });
    }
  );

  return app;
}
```

### Task 1.5: Create Status Route

Create `src/api/routes/status.ts`:

```typescript
/**
 * Status Route
 * Check payment status and facilitator stats
 */

import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import type { FacilitatorServer } from '../../core/FacilitatorServer.js';
import type { StatusResponse, StatsResponse } from '../types.js';

export function createStatusRoute(facilitator: FacilitatorServer): Hono {
  const app = new Hono();

  /**
   * GET /status/:paymentId
   * Get status of a specific payment
   */
  app.get('/:paymentId', async (c) => {
    const paymentId = c.req.param('paymentId');
    
    const payment = await facilitator.getPaymentStatus(paymentId);

    const response: StatusResponse = {
      found: !!payment,
      payment: payment || undefined,
    };

    return c.json(response, payment ? 200 : 404);
  });

  /**
   * GET /status
   * Get overall facilitator stats
   */
  app.get('/', async (c) => {
    const stats = await facilitator.getStats();

    const response: StatsResponse = {
      stats,
      uptime: process.uptime(),
      version: '1.0.0',
    };

    return c.json(response);
  });

  /**
   * POST /status/batch
   * Get status of multiple payments
   */
  app.post(
    '/batch',
    zValidator('json', z.object({
      paymentIds: z.array(z.string()).max(100),
    })),
    async (c) => {
      const { paymentIds } = c.req.valid('json');

      const results = await Promise.all(
        paymentIds.map(async (id) => {
          const payment = await facilitator.getPaymentStatus(id);
          return { paymentId: id, found: !!payment, payment };
        })
      );

      return c.json({ results });
    }
  );

  return app;
}
```

---

## 🏗️ Phase 2: Middleware

### Task 2.1: Create Auth Middleware

Create `src/api/middleware/auth.ts`:

```typescript
/**
 * Authentication Middleware
 * Validates API keys and JWTs
 */

import { Context, Next } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { verify } from 'hono/jwt';
import { createLogger } from '../../utils/logger.js';

const log = createLogger('AuthMiddleware');

interface AuthConfig {
  apiKeyHeader: string;
  jwtSecret?: string;
}

// In-memory API key store (replace with database in production)
const validApiKeys = new Set([
  process.env.FACILITATOR_API_KEY,
  process.env.INTERNAL_API_KEY,
].filter(Boolean));

export function authMiddleware(config: AuthConfig) {
  return async (c: Context, next: Next) => {
    // Skip auth for public endpoints
    const publicPaths = ['/health', '/v1/status'];
    if (publicPaths.some(p => c.req.path.startsWith(p))) {
      return next();
    }

    // Check API key
    const apiKey = c.req.header(config.apiKeyHeader);
    if (apiKey && validApiKeys.has(apiKey)) {
      c.set('authMethod', 'apiKey');
      return next();
    }

    // Check JWT
    const authHeader = c.req.header('Authorization');
    if (authHeader?.startsWith('Bearer ') && config.jwtSecret) {
      const token = authHeader.slice(7);
      
      try {
        const payload = await verify(token, config.jwtSecret);
        c.set('authMethod', 'jwt');
        c.set('user', payload);
        return next();
      } catch (error) {
        log.warn('Invalid JWT', { error });
      }
    }

    // Check x402 payment header (self-paying API)
    const paymentHeader = c.req.header('X-Payment');
    if (paymentHeader) {
      // Validate payment and allow access
      // This enables the API to be self-monetizing
      c.set('authMethod', 'x402');
      return next();
    }

    // No valid auth
    log.warn('Unauthorized request', {
      path: c.req.path,
      ip: c.req.header('X-Forwarded-For') || 'unknown',
    });

    throw new HTTPException(401, {
      message: 'Unauthorized. Provide API key, JWT, or x402 payment.',
    });
  };
}
```

### Task 2.2: Create Rate Limit Middleware

Create `src/api/middleware/rateLimit.ts`:

```typescript
/**
 * Rate Limiting Middleware
 * Token bucket algorithm with Redis support
 */

import { Context, Next } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { createLogger } from '../../utils/logger.js';

const log = createLogger('RateLimit');

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// In-memory store (replace with Redis for production)
const rateLimitStore = new Map<string, RateLimitEntry>();

export function rateLimitMiddleware(config: RateLimitConfig) {
  // Cleanup old entries periodically
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitStore) {
      if (entry.resetAt < now) {
        rateLimitStore.delete(key);
      }
    }
  }, config.windowMs);

  return async (c: Context, next: Next) => {
    const key = getClientKey(c);
    const now = Date.now();
    
    let entry = rateLimitStore.get(key);
    
    if (!entry || entry.resetAt < now) {
      entry = {
        count: 0,
        resetAt: now + config.windowMs,
      };
    }

    entry.count++;
    rateLimitStore.set(key, entry);

    // Set rate limit headers
    c.header('X-RateLimit-Limit', config.maxRequests.toString());
    c.header('X-RateLimit-Remaining', Math.max(0, config.maxRequests - entry.count).toString());
    c.header('X-RateLimit-Reset', Math.ceil(entry.resetAt / 1000).toString());

    if (entry.count > config.maxRequests) {
      log.warn('Rate limit exceeded', { key, count: entry.count });
      
      throw new HTTPException(429, {
        message: 'Too many requests. Please try again later.',
      });
    }

    return next();
  };
}

function getClientKey(c: Context): string {
  // Use API key if present, otherwise IP
  const apiKey = c.req.header('X-API-Key');
  if (apiKey) {
    return `apikey:${apiKey.slice(0, 8)}`;
  }

  const ip = c.req.header('X-Forwarded-For')?.split(',')[0] ||
             c.req.header('X-Real-IP') ||
             'unknown';
  
  return `ip:${ip}`;
}
```

### Task 2.3: Create Error Handler

Create `src/api/middleware/errorHandler.ts`:

```typescript
/**
 * Global Error Handler
 * Consistent error responses across all routes
 */

import { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { ZodError } from 'zod';
import { FacilitatorError, ErrorCode } from '../../utils/errors.js';
import { createLogger } from '../../utils/logger.js';

const log = createLogger('ErrorHandler');

interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
  requestId?: string;
  timestamp: number;
}

export function errorHandler(error: Error, c: Context): Response {
  const requestId = c.req.header('X-Request-Id') || crypto.randomUUID();
  
  let status = 500;
  let code = 'INTERNAL_ERROR';
  let message = 'An unexpected error occurred';
  let details: unknown = undefined;

  if (error instanceof HTTPException) {
    status = error.status;
    code = `HTTP_${status}`;
    message = error.message;
  } else if (error instanceof ZodError) {
    status = 400;
    code = 'VALIDATION_ERROR';
    message = 'Request validation failed';
    details = error.errors.map(e => ({
      path: e.path.join('.'),
      message: e.message,
    }));
  } else if (error instanceof FacilitatorError) {
    status = getStatusFromErrorCode(error.code);
    code = error.code;
    message = error.message;
  }

  // Log error
  if (status >= 500) {
    log.error('Server error', {
      requestId,
      error: error.message,
      stack: error.stack,
    });
  } else {
    log.warn('Client error', {
      requestId,
      status,
      code,
      message,
    });
  }

  const response: ErrorResponse = {
    error: {
      code,
      message,
      details,
    },
    requestId,
    timestamp: Date.now(),
  };

  return c.json(response, status as any);
}

function getStatusFromErrorCode(code: ErrorCode): number {
  switch (code) {
    case ErrorCode.INVALID_PROOF:
    case ErrorCode.INVALID_SIGNATURE:
      return 400;
    case ErrorCode.EXPIRED_PROOF:
      return 410;
    case ErrorCode.INSUFFICIENT_AMOUNT:
      return 402;
    case ErrorCode.UNSUPPORTED_NETWORK:
      return 501;
    case ErrorCode.REQUIREMENTS_NOT_MET:
      return 422;
    case ErrorCode.NOT_IMPLEMENTED:
      return 501;
    default:
      return 500;
  }
}
```

---

## 🏗️ Phase 3: WebSocket

### Task 3.1: Create Payment Stream

Create `src/api/websocket/PaymentStream.ts`:

```typescript
/**
 * WebSocket Payment Stream
 * Real-time updates for payments and stats
 */

import type { ServerWebSocket } from 'bun';
import type { Context } from 'hono';
import type { FacilitatorServer } from '../../core/FacilitatorServer.js';
import type { FacilitatorEvent } from '../../core/types.js';
import type { WebSocketMessage, SubscribeMessage } from '../types.js';
import { createLogger } from '../../utils/logger.js';

const log = createLogger('PaymentStream');

interface Client {
  id: string;
  ws: ServerWebSocket;
  channels: Set<string>;
  filter?: {
    network?: string;
    payee?: string;
  };
}

export class PaymentStream {
  private clients: Map<string, Client> = new Map();
  private facilitator: FacilitatorServer;

  constructor(facilitator: FacilitatorServer) {
    this.facilitator = facilitator;
    this.setupEventListeners();
  }

  /**
   * Handle new WebSocket connection
   */
  handleConnection(c: Context) {
    return {
      onOpen: (_event: Event, ws: ServerWebSocket) => {
        const clientId = crypto.randomUUID();
        
        const client: Client = {
          id: clientId,
          ws,
          channels: new Set(['payments']), // Default subscription
        };
        
        this.clients.set(clientId, client);
        
        log.info('Client connected', { clientId, total: this.clients.size });
        
        // Send welcome message
        this.sendToClient(client, {
          type: 'connected',
          data: {
            clientId,
            channels: Array.from(client.channels),
          },
          timestamp: Date.now(),
        });
      },

      onMessage: (event: MessageEvent, ws: ServerWebSocket) => {
        const clientId = this.findClientId(ws);
        if (!clientId) return;

        try {
          const message = JSON.parse(event.data.toString());
          this.handleMessage(clientId, message);
        } catch (error) {
          log.error('Invalid message', { clientId, error });
        }
      },

      onClose: (_event: CloseEvent, ws: ServerWebSocket) => {
        const clientId = this.findClientId(ws);
        if (clientId) {
          this.clients.delete(clientId);
          log.info('Client disconnected', { clientId, total: this.clients.size });
        }
      },

      onError: (event: Event, ws: ServerWebSocket) => {
        const clientId = this.findClientId(ws);
        log.error('WebSocket error', { clientId, error: event });
      },
    };
  }

  /**
   * Handle incoming message from client
   */
  private handleMessage(clientId: string, message: SubscribeMessage): void {
    const client = this.clients.get(clientId);
    if (!client) return;

    switch (message.type) {
      case 'subscribe':
        message.channels.forEach(ch => client.channels.add(ch));
        if (message.filter) {
          client.filter = message.filter;
        }
        log.debug('Client subscribed', {
          clientId,
          channels: Array.from(client.channels),
        });
        break;

      case 'unsubscribe':
        message.channels.forEach(ch => client.channels.delete(ch));
        break;

      default:
        log.warn('Unknown message type', { clientId, type: (message as any).type });
    }
  }

  /**
   * Setup event listeners on facilitator
   */
  private setupEventListeners(): void {
    this.facilitator.on('event', (event: FacilitatorEvent) => {
      this.broadcastEvent(event);
    });
  }

  /**
   * Broadcast event to subscribed clients
   */
  private broadcastEvent(event: FacilitatorEvent): void {
    const message: WebSocketMessage = {
      type: event.type as any,
      data: event.data,
      timestamp: Date.now(),
    };

    for (const client of this.clients.values()) {
      // Check if client is subscribed to this channel
      if (!client.channels.has('payments')) continue;

      // Apply filter if present
      if (client.filter) {
        const data = event.data as any;
        if (client.filter.network && data.network !== client.filter.network) {
          continue;
        }
        if (client.filter.payee && data.payee !== client.filter.payee) {
          continue;
        }
      }

      this.sendToClient(client, message);
    }
  }

  /**
   * Send message to a specific client
   */
  private sendToClient(client: Client, message: unknown): void {
    try {
      client.ws.send(JSON.stringify(message));
    } catch (error) {
      log.error('Failed to send to client', {
        clientId: client.id,
        error,
      });
      this.clients.delete(client.id);
    }
  }

  /**
   * Find client ID by WebSocket instance
   */
  private findClientId(ws: ServerWebSocket): string | undefined {
    for (const [id, client] of this.clients) {
      if (client.ws === ws) return id;
    }
    return undefined;
  }

  /**
   * Broadcast stats update to all subscribed clients
   */
  async broadcastStats(): Promise<void> {
    const stats = await this.facilitator.getStats();
    
    const message: WebSocketMessage = {
      type: 'stats:update',
      data: stats,
      timestamp: Date.now(),
    };

    for (const client of this.clients.values()) {
      if (client.channels.has('stats')) {
        this.sendToClient(client, message);
      }
    }
  }

  /**
   * Shutdown and disconnect all clients
   */
  shutdown(): void {
    for (const client of this.clients.values()) {
      try {
        client.ws.close(1000, 'Server shutting down');
      } catch {
        // Ignore close errors
      }
    }
    this.clients.clear();
    log.info('PaymentStream shut down');
  }

  /**
   * Get connected client count
   */
  getClientCount(): number {
    return this.clients.size;
  }
}
```

---

## 🏗️ Phase 4: Health & Analytics Routes

### Task 4.1: Create Health Route

Create `src/api/routes/health.ts`:

```typescript
/**
 * Health Check Route
 * For load balancers and monitoring
 */

import { Hono } from 'hono';
import type { FacilitatorServer } from '../../core/FacilitatorServer.js';
import type { HealthResponse } from '../types.js';

export function createHealthRoute(facilitator: FacilitatorServer): Hono {
  const app = new Hono();

  app.get('/', async (c) => {
    const checks = await runHealthChecks(facilitator);
    
    const allHealthy = Object.values(checks).every(v => 
      typeof v === 'boolean' ? v : Object.values(v).every(Boolean)
    );

    const response: HealthResponse = {
      status: allHealthy ? 'healthy' : 'degraded',
      checks: checks as any,
      timestamp: Date.now(),
    };

    return c.json(response, allHealthy ? 200 : 503);
  });

  app.get('/live', (c) => {
    return c.json({ status: 'ok' });
  });

  app.get('/ready', async (c) => {
    try {
      await facilitator.getStats();
      return c.json({ status: 'ready' });
    } catch {
      return c.json({ status: 'not ready' }, 503);
    }
  });

  return app;
}

async function runHealthChecks(facilitator: FacilitatorServer) {
  const checks: Record<string, boolean | Record<string, boolean>> = {
    database: true, // TODO: Check database connection
    redis: true,    // TODO: Check Redis connection
    networks: {},
  };

  // Check each network
  try {
    const stats = await facilitator.getStats();
    for (const network of Object.keys(stats.networkStats)) {
      (checks.networks as Record<string, boolean>)[network] = true;
    }
  } catch {
    // Networks unavailable
  }

  return checks;
}
```

### Task 4.2: Create Analytics Route

Create `src/api/routes/analytics.ts`:

```typescript
/**
 * Analytics Route
 * Revenue tracking and metrics
 */

import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import type { FacilitatorServer } from '../../core/FacilitatorServer.js';

export function createAnalyticsRoute(facilitator: FacilitatorServer): Hono {
  const app = new Hono();

  /**
   * GET /analytics/overview
   * Get overall analytics
   */
  app.get('/overview', async (c) => {
    const stats = await facilitator.getStats();
    
    return c.json({
      totalVolume: stats.totalVolumeUsd,
      totalFees: stats.totalFeesCollected,
      totalPayments: stats.totalPaymentsProcessed,
      averageSettlementTime: stats.averageSettlementTime,
      uptime: stats.uptimePercentage,
    });
  });

  /**
   * GET /analytics/networks
   * Get per-network analytics
   */
  app.get('/networks', async (c) => {
    const stats = await facilitator.getStats();
    
    return c.json({
      networks: Object.entries(stats.networkStats).map(([id, ns]) => ({
        chainId: id,
        volume: ns.volumeUsd,
        fees: ns.feesCollected,
        payments: ns.paymentsProcessed,
        averageGas: ns.averageGasCost,
        lastActivity: ns.lastSettlement,
      })),
    });
  });

  /**
   * GET /analytics/revenue
   * Get revenue breakdown
   */
  app.get(
    '/revenue',
    zValidator('query', z.object({
      period: z.enum(['day', 'week', 'month', 'year']).default('day'),
    })),
    async (c) => {
      const { period } = c.req.valid('query');
      
      // Agent 4 will implement detailed revenue tracking
      const stats = await facilitator.getStats();
      
      return c.json({
        period,
        totalFees: stats.totalFeesCollected,
        byNetwork: stats.networkStats,
      });
    }
  );

  return app;
}
```

---

## 📋 Phase Completion Checklists

### Phase 1 Checklist
- [ ] API types defined
- [ ] Hono server setup complete
- [ ] Verify route handles proofs
- [ ] Settle route triggers settlement
- [ ] Status route returns payment info

### Phase 2 Checklist
- [ ] Auth middleware validates API keys and JWTs
- [ ] Rate limiting works correctly
- [ ] Error handler formats errors consistently

### Phase 3 Checklist
- [ ] WebSocket accepts connections
- [ ] Subscription filtering works
- [ ] Events broadcast to clients

### Phase 4 Checklist
- [ ] Health checks pass
- [ ] Analytics routes return metrics

---

## ⏭️ After API Completion

### Your Next Project: Agent Wallet SDK

Once facilitator is complete, move to building the agent wallet:

**See:** `AGENT_3_PHASE2_AGENT_WALLET.md`

Key components:
1. Wallet creation and management
2. Spending limits and allowlists
3. Auto-topup from parent wallet
4. MCP integration for AI agents

---

## 🧪 Testing Requirements

Create `tests/api.test.ts`:

```typescript
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { FacilitatorAPI } from '../src/api/server.js';

describe('Facilitator API', () => {
  let api: FacilitatorAPI;

  beforeAll(async () => {
    // Setup test server
  });

  it('returns 200 on health check', async () => {
    const res = await api.getApp().request('/health');
    expect(res.status).toBe(200);
  });

  it('verifies valid payment proof', async () => {
    // Test verification
  });

  it('rejects invalid proof', async () => {
    // Test error handling
  });
});
```

---

## 🔗 Files You'll Create

```
packages/facilitator/src/api/
├── index.ts
├── types.ts
├── server.ts
├── routes/
│   ├── verify.ts
│   ├── settle.ts
│   ├── status.ts
│   ├── analytics.ts
│   └── health.ts
├── middleware/
│   ├── auth.ts
│   ├── rateLimit.ts
│   ├── logging.ts
│   └── errorHandler.ts
└── websocket/
    └── PaymentStream.ts
```
