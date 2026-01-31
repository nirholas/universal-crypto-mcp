/**
 * Universal Crypto MCP Gateway - Enterprise x402 Payment Gateway
 * 
 * This gateway wraps ALL MCP servers and APIs with x402 payment protocol,
 * rate limiting, and enterprise-grade monitoring.
 * 
 * @author nirholas (Nich)
 * @website x.com/nichxbt
 * @license Apache-2.0
 */

import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { rateLimit } from 'express-rate-limit';
import Redis from 'ioredis';
import { v4 as uuidv4 } from 'uuid';

import { x402Gateway } from './x402-gateway.js';
import { metricsMiddleware, metricsEndpoint } from './metrics.js';
import { healthCheck, readinessCheck, livenessCheck } from './health.js';
import { requestLogger, errorLogger } from './logging.js';
import { loadGatewayConfig, GatewayConfig } from './config.js';
import { EndpointRegistry } from './endpoints.js';
import { logger as Logger } from './logger.js';
import { MCPManager } from './mcp-manager.js';
import { MCP_SERVERS } from './mcp-servers.config.js';

// ============================================================================
// Gateway Server
// ============================================================================

export class UniversalCryptoGateway {
  private app: Express;
  private config: GatewayConfig;
  private redis: Redis | null = null;
  private mcpManager: MCPManager;
  private endpoints: EndpointRegistry;
  private x402: x402Gateway;

  constructor() {
    this.app = express();
    this.config = loadGatewayConfig();
    this.mcpManager = new MCPManager(Logger);
    this.endpoints = new EndpointRegistry(Logger, this.mcpManager);
    this.x402 = new x402Gateway(this.config);
    
    this.initializeMCPServers();
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  private initializeMCPServers(): void {
    Logger.info(`Registering ${MCP_SERVERS.length} MCP servers...`);
    for (const serverConfig of MCP_SERVERS) {
      this.mcpManager.registerServer(serverConfig);
    }
    Logger.info('MCP servers registered');
  }

  private async initRedis(): Promise<void> {
    if (this.config.redis.enabled) {
      this.redis = new Redis({
        host: this.config.redis.host,
        port: this.config.redis.port,
        password: this.config.redis.password,
        db: this.config.redis.db,
        maxRetriesPerRequest: 3,
        retryStrategy: (times: number) => {
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
      });

      this.redis.on('error', (err) => {
        Logger.error('Redis connection error:', err);
      });

      this.redis.on('connect', () => {
        Logger.info('Redis connected successfully');
      });
    }
  }

  private setupMiddleware(): void {
    // Security headers
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:', 'https:'],
        },
      },
      crossOriginEmbedderPolicy: false,
    }));

    // CORS
    this.app.use(cors({
      origin: this.config.cors.origins,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-API-Key',
        'X-Payment-Proof',
        'X-Payment-Token',
        'X-Payment-Chain',
        'X-Payment-Address',
        'X-Request-ID',
      ],
      exposedHeaders: [
        'X-RateLimit-Limit',
        'X-RateLimit-Remaining',
        'X-RateLimit-Reset',
        'X-Payment-Required',
        'X-Payment-Amount',
        'X-Request-ID',
      ],
      credentials: true,
    }));

    // Compression
    this.app.use(compression());

    // Body parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Request ID
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      req.id = req.headers['x-request-id'] as string || uuidv4();
      if (req.id) {
        res.setHeader('X-Request-ID', req.id);
      }
      next();
    });

    // Request logging
    this.app.use(requestLogger);

    // Metrics collection
    this.app.use(metricsMiddleware);
  }

  private setupRoutes(): void {
    // Health endpoints (no auth required)
    this.app.get('/health', healthCheck);
    this.app.get('/ready', readinessCheck);
    this.app.get('/live', livenessCheck);
    this.app.get('/metrics', metricsEndpoint);

    // API documentation
    this.app.get('/api', (_req, res) => {
      res.json({
        name: 'Universal Crypto MCP Gateway',
        version: '1.0.0',
        description: 'Enterprise x402 payment gateway for crypto MCP services',
        endpoints: this.endpoints.getPublicEndpoints(),
        pricing: {
          free: 'Limited free access (10 req/min)',
          basic: 'Basic tier ($10/month, 100 req/min)',
          pro: 'Pro tier ($50/month, 1000 req/min)',
          enterprise: 'Enterprise tier (custom)',
          x402: 'Pay-per-request with crypto',
        },
        documentation: 'https://docs.universal-crypto-mcp.com',
        support: 'support@universal-crypto-mcp.com',
      });
    });

    // Rate limited endpoints (with x402 payments)
    this.setupPaywallRoutes();

    // MCP-specific routes
    this.setupMCPRoutes();
  }

  private setupPaywallRoutes(): void {
    // =========================================================================
    // TIER 1: FREE (Rate Limited)
    // =========================================================================
    
    const freeTierLimiter = rateLimit({
      windowMs: 60 * 1000, // 1 minute
      max: 10, // 10 requests per minute
      standardHeaders: true,
      legacyHeaders: false,
      message: {
        error: 'Rate limit exceeded',
        upgrade: 'Pay with x402 for unlimited access',
        pricing: '/api/pricing',
      },
    });

    this.app.get('/api/v1/prices/:symbol', freeTierLimiter, async (req, res) => {
      try {
        const { symbol } = req.params;
        // Forward to CoinGecko MCP
        const data = await this.endpoints.forwardTo('coingecko', 'getPrice', { symbol });
        res.json(data);
      } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
      }
    });

    // =========================================================================
    // TIER 2: PAID (x402 Payment Required)
    // =========================================================================

    // Market Data - $0.001 per request
    this.app.get('/api/v1/market/:symbol/full',
      this.x402.paywall({
        price: '0.001',
        token: 'USDC',
        network: 'base',
        description: 'Full market data for crypto asset',
      }),
      async (req, res) => {
        const { symbol } = req.params;
        const data = await this.endpoints.forwardTo('market-data', 'getFullMarketData', { symbol });
        res.json(data);
      }
    );

    // Trading Signals - $0.01 per request
    this.app.get('/api/v1/trading/signals/:symbol',
      this.x402.paywall({
        price: '0.01',
        token: 'USDC',
        network: 'base',
        description: 'AI-powered trading signals',
      }),
      async (req, res) => {
        const { symbol } = req.params;
        const data = await this.endpoints.forwardTo('trading', 'getSignals', { symbol });
        res.json(data);
      }
    );

    // DeFi Protocol Data - $0.005 per request
    this.app.get('/api/v1/defi/:protocol/rates',
      this.x402.paywall({
        price: '0.005',
        token: 'USDC',
        network: 'base',
        description: 'DeFi protocol lending/borrowing rates',
      }),
      async (req, res) => {
        const { protocol } = req.params;
        const data = await this.endpoints.forwardTo('defi', 'getProtocolRates', { protocol });
        res.json(data);
      }
    );

    // Wallet Analysis - $0.02 per request
    this.app.get('/api/v1/wallet/:address/analysis',
      this.x402.paywall({
        price: '0.02',
        token: 'USDC',
        network: 'base',
        description: 'Comprehensive wallet analysis',
      }),
      async (req, res) => {
        const { address } = req.params;
        const data = await this.endpoints.forwardTo('wallets', 'analyzeWallet', { address });
        res.json(data);
      }
    );

    // =========================================================================
    // TIER 3: PREMIUM (Higher Value Services)
    // =========================================================================

    // AI Trading Bot Execution - $0.10 per trade
    this.app.post('/api/v1/trading/execute',
      this.x402.paywall({
        price: '0.10',
        token: 'USDC',
        network: 'base',
        description: 'Execute trade via AI trading bot',
      }),
      async (req, res) => {
        const data = await this.endpoints.forwardTo('trading-bot', 'executeTrade', req.body);
        res.json(data);
      }
    );

    // MEV Analysis - $0.05 per request
    this.app.post('/api/v1/mev/analyze',
      this.x402.paywall({
        price: '0.05',
        token: 'USDC',
        network: 'base',
        description: 'MEV opportunity analysis',
      }),
      async (req, res) => {
        const data = await this.endpoints.forwardTo('mev-bot', 'analyzeOpportunity', req.body);
        res.json(data);
      }
    );

    // Smart Contract Audit - $1.00 per contract
    this.app.post('/api/v1/security/audit',
      this.x402.paywall({
        price: '1.00',
        token: 'USDC',
        network: 'base',
        description: 'AI-powered smart contract security audit',
      }),
      async (req, res) => {
        const data = await this.endpoints.forwardTo('security', 'auditContract', req.body);
        res.json(data);
      }
    );
  }

  private setupMCPRoutes(): void {
    // MCP Protocol endpoint (for AI agents)
    this.app.post('/mcp',
      this.x402.dynamicPaywall({
        basePrice: '0.001',
        perTool: '0.005',
        token: 'USDC',
        network: 'base',
        description: 'MCP tool execution',
      }),
      async (req, res) => {
        const { method, params } = req.body;
        const result = await this.endpoints.executeMCPTool(method, params);
        res.json(result);
      }
    );

    // List available MCP tools
    this.app.get('/mcp/tools', async (_req, res) => {
      const tools = await this.endpoints.listMCPTools();
      res.json({
        tools,
        pricing: {
          free: 'Limited free access',
          x402: 'Pay-per-use with crypto',
        },
      });
    });

    // SSE endpoint for streaming
    this.app.get('/mcp/sse',
      this.x402.paywall({
        price: '0.01',
        token: 'USDC',
        network: 'base',
        description: 'MCP SSE streaming session',
        validitySeconds: 3600, // 1 hour session
      }),
      async (req, res) => {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        
        // Handle SSE streaming
        this.endpoints.streamMCP(req, res);
      }
    );
  }

  private setupErrorHandling(): void {
    // Error logging
    this.app.use(errorLogger);

    // 404 handler
    this.app.use((req: Request, res: Response) => {
      res.status(404).json({
        error: 'Not Found',
        message: `Endpoint ${req.method} ${req.path} does not exist`,
        documentation: '/api',
      });
    });

    // Global error handler
    this.app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
      Logger.error('Unhandled error:', err);

      // Don't leak error details in production
      const isDev = this.config.env === 'development';
      
      res.status(500).json({
        error: 'Internal Server Error',
        message: isDev ? err.message : 'An unexpected error occurred',
        requestId: req.id,
        ...(isDev && { stack: err.stack }),
      });
    });
  }

  async start(): Promise<void> {
    await this.initRedis();
    await this.x402.initialize();
    
    // Start all MCP servers
    Logger.info('Starting MCP servers...');
    await this.mcpManager.startAll();
    Logger.info('MCP servers started successfully');

    const port = this.config.port;
    
    this.app.listen(port, () => {
      Logger.info(`🚀 Universal Crypto MCP Gateway started`);
      Logger.info(`   Port: ${port}`);
      Logger.info(`   Environment: ${this.config.env}`);
      Logger.info(`   x402 Network: ${this.config.x402.network}`);
      Logger.info(`   x402 Wallet: ${this.config.x402.walletAddress}`);
      Logger.info(`   Redis: ${this.config.redis.enabled ? 'enabled' : 'disabled'}`);
      Logger.info(`   MCP Servers: ${this.mcpManager.getAllServerInfo().length} active`);
      Logger.info(`   Health: http://localhost:${port}/health`);
      Logger.info(`   API Docs: http://localhost:${port}/api`);
    });
  }

  async shutdown(): Promise<void> {
    Logger.info('Shutting down gateway...');
    await this.mcpManager.stopAll();
    if (this.redis) {
      await this.redis.quit();
    }
    Logger.info('Gateway shutdown complete');
  }
}

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      id?: string;
      x402Payment?: {
        proof: string;
        amount: string;
        token: string;
        chain: string;
        verified: boolean;
        payer?: string;
      };
    }
  }
}

// Start the gateway if this is the main module
const gateway = new UniversalCryptoGateway();
gateway.start().catch((err) => {
  console.error('Failed to start gateway:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  Logger.info('SIGTERM received, shutting down gracefully...');
  await gateway.shutdown();
  process.exit(0);
});

process.on('SIGINT', async () => {
  Logger.info('SIGINT received, shutting down gracefully...');
  await gateway.shutdown();
  process.exit(0);
});

// Export types and classes for external use
export { x402Gateway } from './x402-gateway.js';
export { RateLimiter, MemoryRateLimitStore } from './rate-limiter.js';
export type { X402Config } from './config.js';

export { default as x402Middleware } from './x402-gateway.js';

export default UniversalCryptoGateway;
