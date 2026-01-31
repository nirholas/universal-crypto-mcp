/**
 * MCP Server Endpoint Registry and Routing
 * 
 * @author nirholas (Nich)
 * @license Apache-2.0
 */

import { Request, Response, NextFunction, Router } from 'express';
import { Logger } from './logger';

// ============================================================================
// Types
// ============================================================================

export interface EndpointConfig {
  id: string;
  name: string;
  description: string;
  category: 'defi' | 'trading' | 'market-data' | 'nft' | 'payments' | 'wallets' | 'security' | 'novel';
  path: string;
  methods: ('GET' | 'POST' | 'PUT' | 'DELETE')[];
  pricing: {
    free: boolean;
    priceUsd: string;
    token: string;
    network: string;
  };
  rateLimit: {
    free: number;
    paid: number;
  };
  parameters?: ParameterSpec[];
  examples?: Example[];
  upstreamUrl?: string;
  handler?: EndpointHandler;
}

export interface ParameterSpec {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  required: boolean;
  description: string;
  default?: unknown;
  enum?: string[];
}

export interface Example {
  name: string;
  request: {
    params?: Record<string, string>;
    query?: Record<string, string>;
    body?: Record<string, unknown>;
  };
  response: Record<string, unknown>;
}

export type EndpointHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void>;

// ============================================================================
// Endpoint Registry
// ============================================================================

export class EndpointRegistry {
  private endpoints: Map<string, EndpointConfig> = new Map();
  private router: Router;
  private logger: Logger;

  constructor(logger: Logger) {
    this.router = Router();
    this.logger = logger.child({ component: 'EndpointRegistry' });
    this.initializeDefaultEndpoints();
  }

  /**
   * Register an endpoint
   */
  register(config: EndpointConfig): void {
    this.endpoints.set(config.id, config);
    this.logger.info(`Registered endpoint: ${config.id}`, {
      path: config.path,
      methods: config.methods,
      category: config.category,
    });
  }

  /**
   * Get an endpoint by ID
   */
  get(id: string): EndpointConfig | undefined {
    return this.endpoints.get(id);
  }

  /**
   * Get all endpoints
   */
  getAll(): EndpointConfig[] {
    return Array.from(this.endpoints.values());
  }

  /**
   * Get endpoints by category
   */
  getByCategory(category: string): EndpointConfig[] {
    return this.getAll().filter((e) => e.category === category);
  }

  /**
   * Get router with all registered endpoints
   */
  getRouter(): Router {
    return this.router;
  }

  /**
   * Find endpoint config for a given path and method
   */
  findByPath(path: string, method: string): EndpointConfig | undefined {
    for (const endpoint of this.endpoints.values()) {
      // Simple path matching (could be enhanced with path-to-regexp)
      const pathPattern = endpoint.path.replace(/:[\w]+/g, '[^/]+');
      const regex = new RegExp(`^${pathPattern}$`);
      if (regex.test(path) && endpoint.methods.includes(method as 'GET' | 'POST' | 'PUT' | 'DELETE')) {
        return endpoint;
      }
    }
    return undefined;
  }

  /**
   * Initialize default MCP server endpoints
   */
  private initializeDefaultEndpoints(): void {
    // ========================================
    // DeFi Endpoints
    // ========================================
    
    this.register({
      id: 'defi.protocols.list',
      name: 'List DeFi Protocols',
      description: 'Get list of supported DeFi protocols',
      category: 'defi',
      path: '/api/v1/defi/protocols',
      methods: ['GET'],
      pricing: { free: true, priceUsd: '0', token: 'USDC', network: 'base' },
      rateLimit: { free: 100, paid: 10000 },
    });

    this.register({
      id: 'defi.aave.markets',
      name: 'Aave Markets',
      description: 'Get Aave lending markets data',
      category: 'defi',
      path: '/api/v1/defi/aave/markets',
      methods: ['GET'],
      pricing: { free: false, priceUsd: '0.001', token: 'USDC', network: 'base' },
      rateLimit: { free: 10, paid: 1000 },
      parameters: [
        { name: 'network', type: 'string', required: false, description: 'Network (mainnet, polygon, arbitrum)', enum: ['mainnet', 'polygon', 'arbitrum', 'optimism', 'base'] },
      ],
    });

    this.register({
      id: 'defi.aave.position',
      name: 'Aave Position',
      description: 'Get user position in Aave',
      category: 'defi',
      path: '/api/v1/defi/aave/position/:address',
      methods: ['GET'],
      pricing: { free: false, priceUsd: '0.005', token: 'USDC', network: 'base' },
      rateLimit: { free: 5, paid: 500 },
    });

    this.register({
      id: 'defi.uniswap.quote',
      name: 'Uniswap Quote',
      description: 'Get swap quote from Uniswap',
      category: 'defi',
      path: '/api/v1/defi/uniswap/quote',
      methods: ['POST'],
      pricing: { free: false, priceUsd: '0.01', token: 'USDC', network: 'base' },
      rateLimit: { free: 5, paid: 500 },
      parameters: [
        { name: 'tokenIn', type: 'string', required: true, description: 'Input token address' },
        { name: 'tokenOut', type: 'string', required: true, description: 'Output token address' },
        { name: 'amount', type: 'string', required: true, description: 'Amount to swap' },
      ],
    });

    this.register({
      id: 'defi.curve.pools',
      name: 'Curve Pools',
      description: 'Get Curve Finance pools data',
      category: 'defi',
      path: '/api/v1/defi/curve/pools',
      methods: ['GET'],
      pricing: { free: false, priceUsd: '0.001', token: 'USDC', network: 'base' },
      rateLimit: { free: 10, paid: 1000 },
    });

    this.register({
      id: 'defi.compound.markets',
      name: 'Compound Markets',
      description: 'Get Compound lending markets',
      category: 'defi',
      path: '/api/v1/defi/compound/markets',
      methods: ['GET'],
      pricing: { free: false, priceUsd: '0.001', token: 'USDC', network: 'base' },
      rateLimit: { free: 10, paid: 1000 },
    });

    // ========================================
    // Trading Endpoints
    // ========================================

    this.register({
      id: 'trading.signals',
      name: 'Trading Signals',
      description: 'AI-powered trading signals',
      category: 'trading',
      path: '/api/v1/trading/signals/:symbol',
      methods: ['GET'],
      pricing: { free: false, priceUsd: '0.05', token: 'USDC', network: 'base' },
      rateLimit: { free: 0, paid: 100 },
    });

    this.register({
      id: 'trading.analysis',
      name: 'Technical Analysis',
      description: 'Technical analysis for trading pairs',
      category: 'trading',
      path: '/api/v1/trading/analysis/:symbol',
      methods: ['GET'],
      pricing: { free: false, priceUsd: '0.02', token: 'USDC', network: 'base' },
      rateLimit: { free: 5, paid: 500 },
    });

    this.register({
      id: 'trading.memecoin.detect',
      name: 'Memecoin Detection',
      description: 'Detect new memecoin launches',
      category: 'trading',
      path: '/api/v1/trading/memecoin/detect',
      methods: ['GET'],
      pricing: { free: false, priceUsd: '0.10', token: 'USDC', network: 'base' },
      rateLimit: { free: 0, paid: 50 },
    });

    this.register({
      id: 'trading.memecoin.analyze',
      name: 'Memecoin Analysis',
      description: 'Analyze memecoin for safety and potential',
      category: 'trading',
      path: '/api/v1/trading/memecoin/analyze/:address',
      methods: ['GET'],
      pricing: { free: false, priceUsd: '0.20', token: 'USDC', network: 'base' },
      rateLimit: { free: 0, paid: 25 },
    });

    // ========================================
    // Market Data Endpoints
    // ========================================

    this.register({
      id: 'market.prices',
      name: 'Token Prices',
      description: 'Get token prices from multiple sources',
      category: 'market-data',
      path: '/api/v1/market/prices',
      methods: ['GET'],
      pricing: { free: true, priceUsd: '0', token: 'USDC', network: 'base' },
      rateLimit: { free: 50, paid: 5000 },
      parameters: [
        { name: 'tokens', type: 'string', required: true, description: 'Comma-separated token IDs' },
        { name: 'currency', type: 'string', required: false, description: 'Quote currency', default: 'usd' },
      ],
    });

    this.register({
      id: 'market.prices.historical',
      name: 'Historical Prices',
      description: 'Get historical price data',
      category: 'market-data',
      path: '/api/v1/market/prices/historical/:token',
      methods: ['GET'],
      pricing: { free: false, priceUsd: '0.01', token: 'USDC', network: 'base' },
      rateLimit: { free: 5, paid: 500 },
      parameters: [
        { name: 'days', type: 'number', required: false, description: 'Number of days', default: 30 },
      ],
    });

    this.register({
      id: 'market.trending',
      name: 'Trending Tokens',
      description: 'Get trending tokens on CoinGecko',
      category: 'market-data',
      path: '/api/v1/market/trending',
      methods: ['GET'],
      pricing: { free: true, priceUsd: '0', token: 'USDC', network: 'base' },
      rateLimit: { free: 20, paid: 1000 },
    });

    this.register({
      id: 'market.dexscreener.pairs',
      name: 'DEX Pairs',
      description: 'Get DEX trading pairs from DexScreener',
      category: 'market-data',
      path: '/api/v1/market/dex/pairs/:chainId/:pairAddress',
      methods: ['GET'],
      pricing: { free: false, priceUsd: '0.005', token: 'USDC', network: 'base' },
      rateLimit: { free: 10, paid: 1000 },
    });

    this.register({
      id: 'market.dexscreener.token',
      name: 'Token DEX Data',
      description: 'Get all pairs for a token on DEXes',
      category: 'market-data',
      path: '/api/v1/market/dex/token/:address',
      methods: ['GET'],
      pricing: { free: false, priceUsd: '0.01', token: 'USDC', network: 'base' },
      rateLimit: { free: 5, paid: 500 },
    });

    // ========================================
    // NFT Endpoints
    // ========================================

    this.register({
      id: 'nft.collections',
      name: 'NFT Collections',
      description: 'Get NFT collection data',
      category: 'nft',
      path: '/api/v1/nft/collections',
      methods: ['GET'],
      pricing: { free: true, priceUsd: '0', token: 'USDC', network: 'base' },
      rateLimit: { free: 20, paid: 1000 },
    });

    this.register({
      id: 'nft.collection.floor',
      name: 'Collection Floor Price',
      description: 'Get floor price for NFT collection',
      category: 'nft',
      path: '/api/v1/nft/collections/:slug/floor',
      methods: ['GET'],
      pricing: { free: false, priceUsd: '0.005', token: 'USDC', network: 'base' },
      rateLimit: { free: 10, paid: 1000 },
    });

    // ========================================
    // Wallet Endpoints
    // ========================================

    this.register({
      id: 'wallet.balance',
      name: 'Wallet Balance',
      description: 'Get wallet token balances',
      category: 'wallets',
      path: '/api/v1/wallet/:address/balance',
      methods: ['GET'],
      pricing: { free: true, priceUsd: '0', token: 'USDC', network: 'base' },
      rateLimit: { free: 20, paid: 2000 },
    });

    this.register({
      id: 'wallet.transactions',
      name: 'Wallet Transactions',
      description: 'Get wallet transaction history',
      category: 'wallets',
      path: '/api/v1/wallet/:address/transactions',
      methods: ['GET'],
      pricing: { free: false, priceUsd: '0.01', token: 'USDC', network: 'base' },
      rateLimit: { free: 5, paid: 500 },
    });

    this.register({
      id: 'wallet.nfts',
      name: 'Wallet NFTs',
      description: 'Get NFTs owned by wallet',
      category: 'wallets',
      path: '/api/v1/wallet/:address/nfts',
      methods: ['GET'],
      pricing: { free: false, priceUsd: '0.01', token: 'USDC', network: 'base' },
      rateLimit: { free: 5, paid: 500 },
    });

    // ========================================
    // Security Endpoints
    // ========================================

    this.register({
      id: 'security.audit',
      name: 'Contract Audit',
      description: 'Quick security audit of smart contract',
      category: 'security',
      path: '/api/v1/security/audit/:address',
      methods: ['GET'],
      pricing: { free: false, priceUsd: '0.50', token: 'USDC', network: 'base' },
      rateLimit: { free: 0, paid: 50 },
    });

    this.register({
      id: 'security.rugcheck',
      name: 'Rug Pull Check',
      description: 'Check token for rug pull indicators',
      category: 'security',
      path: '/api/v1/security/rugcheck/:address',
      methods: ['GET'],
      pricing: { free: false, priceUsd: '0.10', token: 'USDC', network: 'base' },
      rateLimit: { free: 2, paid: 200 },
    });

    // ========================================
    // Payments/x402 Endpoints
    // ========================================

    this.register({
      id: 'payments.quote',
      name: 'Payment Quote',
      description: 'Get x402 payment quote for endpoint',
      category: 'payments',
      path: '/api/v1/payments/quote',
      methods: ['POST'],
      pricing: { free: true, priceUsd: '0', token: 'USDC', network: 'base' },
      rateLimit: { free: 100, paid: 10000 },
    });

    this.register({
      id: 'payments.verify',
      name: 'Verify Payment',
      description: 'Verify x402 payment receipt',
      category: 'payments',
      path: '/api/v1/payments/verify',
      methods: ['POST'],
      pricing: { free: true, priceUsd: '0', token: 'USDC', network: 'base' },
      rateLimit: { free: 100, paid: 10000 },
    });
  }
}

// ============================================================================
// Proxy Handler for Upstream MCP Servers
// ============================================================================

export function createProxyHandler(
  upstreamUrl: string,
  logger: Logger,
): EndpointHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const targetUrl = new URL(req.path, upstreamUrl);
      
      // Copy query params
      for (const [key, value] of Object.entries(req.query)) {
        if (typeof value === 'string') {
          targetUrl.searchParams.set(key, value);
        }
      }

      const headers: Record<string, string> = {};
      
      // Forward relevant headers
      const forwardHeaders = ['content-type', 'accept', 'x-request-id'];
      for (const header of forwardHeaders) {
        const value = req.headers[header];
        if (typeof value === 'string') {
          headers[header] = value;
        }
      }

      const response = await fetch(targetUrl.toString(), {
        method: req.method,
        headers,
        body: ['POST', 'PUT', 'PATCH'].includes(req.method) 
          ? JSON.stringify(req.body) 
          : undefined,
      });

      const data = await response.json();
      res.status(response.status).json(data);
    } catch (error) {
      logger.error('Proxy error', error instanceof Error ? error : undefined, {
        upstreamUrl,
        path: req.path,
      });
      next(error);
    }
  };
}

// ============================================================================
// API Documentation Generator
// ============================================================================

export function generateApiDocs(registry: EndpointRegistry): object {
  const endpoints = registry.getAll();
  
  const categories = new Set(endpoints.map((e) => e.category));
  const grouped: Record<string, EndpointConfig[]> = {};
  
  for (const category of categories) {
    grouped[category] = endpoints.filter((e) => e.category === category);
  }

  return {
    version: '1.0.0',
    title: 'Universal Crypto MCP Gateway',
    description: 'Enterprise API gateway for crypto MCP servers with x402 payments',
    baseUrl: process.env.API_BASE_URL || 'https://api.universalcrypto.io',
    authentication: {
      methods: ['API Key', 'x402 Payment'],
      apiKeyHeader: 'x-api-key',
      x402Header: 'x-402-receipt',
    },
    pricing: {
      currency: 'USD',
      defaultToken: 'USDC',
      defaultNetwork: 'base',
      tiers: {
        free: 'Limited free access (10 req/min)',
        basic: 'Basic tier ($10/month, 100 req/min)',
        pro: 'Pro tier ($50/month, 1000 req/min)',
        enterprise: 'Enterprise tier (custom)',
        x402: 'Pay-per-request with crypto',
      },
    },
    categories: Object.fromEntries(
      Object.entries(grouped).map(([cat, eps]) => [
        cat,
        eps.map((e) => ({
          id: e.id,
          name: e.name,
          description: e.description,
          path: e.path,
          methods: e.methods,
          free: e.pricing.free,
          price: e.pricing.free ? 'Free' : `$${e.pricing.priceUsd}`,
          parameters: e.parameters,
          examples: e.examples,
        })),
      ]),
    ),
  };
}

export default EndpointRegistry;
