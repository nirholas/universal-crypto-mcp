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

    // ========================================
    // Layer 2 Endpoints
    // ========================================

    this.register({
      id: 'layer2.arbitrum.bridge',
      name: 'Arbitrum Bridge',
      description: 'Bridge assets to/from Arbitrum',
      category: 'layer2',
      path: '/api/v1/layer2/arbitrum/bridge',
      methods: ['POST'],
      pricing: { free: false, priceUsd: '0.05', token: 'USDC', network: 'base' },
      rateLimit: { free: 0, paid: 100 },
    });

    this.register({
      id: 'layer2.base.info',
      name: 'Base Chain Info',
      description: 'Get Base chain information and stats',
      category: 'layer2',
      path: '/api/v1/layer2/base/info',
      methods: ['GET'],
      pricing: { free: true, priceUsd: '0', token: 'USDC', network: 'base' },
      rateLimit: { free: 50, paid: 5000 },
    });

    this.register({
      id: 'layer2.optimism.bridge',
      name: 'Optimism Bridge',
      description: 'Bridge assets to/from Optimism',
      category: 'layer2',
      path: '/api/v1/layer2/optimism/bridge',
      methods: ['POST'],
      pricing: { free: false, priceUsd: '0.05', token: 'USDC', network: 'base' },
      rateLimit: { free: 0, paid: 100 },
    });

    this.register({
      id: 'layer2.polygon-zkevm.bridge',
      name: 'Polygon zkEVM Bridge',
      description: 'Bridge assets to/from Polygon zkEVM',
      category: 'layer2',
      path: '/api/v1/layer2/polygon-zkevm/bridge',
      methods: ['POST'],
      pricing: { free: false, priceUsd: '0.05', token: 'USDC', network: 'base' },
      rateLimit: { free: 0, paid: 100 },
    });

    // ========================================
    // Binance Trading Endpoints
    // ========================================

    this.register({
      id: 'binance.ticker',
      name: 'Binance Ticker',
      description: 'Get Binance price ticker',
      category: 'trading',
      path: '/api/v1/binance/ticker/:symbol',
      methods: ['GET'],
      pricing: { free: true, priceUsd: '0', token: 'USDC', network: 'base' },
      rateLimit: { free: 100, paid: 10000 },
    });

    this.register({
      id: 'binance.orderbook',
      name: 'Binance Order Book',
      description: 'Get Binance order book depth',
      category: 'trading',
      path: '/api/v1/binance/orderbook/:symbol',
      methods: ['GET'],
      pricing: { free: false, priceUsd: '0.005', token: 'USDC', network: 'base' },
      rateLimit: { free: 10, paid: 1000 },
    });

    this.register({
      id: 'binance.klines',
      name: 'Binance Klines',
      description: 'Get Binance candlestick data',
      category: 'trading',
      path: '/api/v1/binance/klines/:symbol',
      methods: ['GET'],
      pricing: { free: false, priceUsd: '0.01', token: 'USDC', network: 'base' },
      rateLimit: { free: 5, paid: 500 },
    });

    // ========================================
    // CoinGecko Pro Endpoints
    // ========================================

    this.register({
      id: 'coingecko.coins.list',
      name: 'CoinGecko Coins List',
      description: 'Get list of all coins on CoinGecko',
      category: 'market-data',
      path: '/api/v1/coingecko/coins',
      methods: ['GET'],
      pricing: { free: true, priceUsd: '0', token: 'USDC', network: 'base' },
      rateLimit: { free: 20, paid: 2000 },
    });

    this.register({
      id: 'coingecko.coin.detail',
      name: 'CoinGecko Coin Detail',
      description: 'Get detailed coin information',
      category: 'market-data',
      path: '/api/v1/coingecko/coins/:id',
      methods: ['GET'],
      pricing: { free: false, priceUsd: '0.01', token: 'USDC', network: 'base' },
      rateLimit: { free: 5, paid: 500 },
    });

    this.register({
      id: 'coingecko.global',
      name: 'CoinGecko Global Data',
      description: 'Get global crypto market data',
      category: 'market-data',
      path: '/api/v1/coingecko/global',
      methods: ['GET'],
      pricing: { free: true, priceUsd: '0', token: 'USDC', network: 'base' },
      rateLimit: { free: 50, paid: 5000 },
    });

    // ========================================
    // DeFiLlama Endpoints
    // ========================================

    this.register({
      id: 'defillama.tvl',
      name: 'DefiLlama TVL',
      description: 'Get TVL data for protocols',
      category: 'market-data',
      path: '/api/v1/defillama/tvl/:protocol',
      methods: ['GET'],
      pricing: { free: true, priceUsd: '0', token: 'USDC', network: 'base' },
      rateLimit: { free: 50, paid: 5000 },
    });

    this.register({
      id: 'defillama.yields',
      name: 'DefiLlama Yields',
      description: 'Get DeFi yield data',
      category: 'market-data',
      path: '/api/v1/defillama/yields',
      methods: ['GET'],
      pricing: { free: false, priceUsd: '0.01', token: 'USDC', network: 'base' },
      rateLimit: { free: 10, paid: 1000 },
    });

    this.register({
      id: 'defillama.chains',
      name: 'DefiLlama Chains',
      description: 'Get chain TVL rankings',
      category: 'market-data',
      path: '/api/v1/defillama/chains',
      methods: ['GET'],
      pricing: { free: true, priceUsd: '0', token: 'USDC', network: 'base' },
      rateLimit: { free: 50, paid: 5000 },
    });

    // ========================================
    // Dune Analytics Endpoints
    // ========================================

    this.register({
      id: 'dune.query.execute',
      name: 'Dune Execute Query',
      description: 'Execute a Dune Analytics query',
      category: 'analytics',
      path: '/api/v1/dune/query/:queryId/execute',
      methods: ['POST'],
      pricing: { free: false, priceUsd: '0.50', token: 'USDC', network: 'base' },
      rateLimit: { free: 0, paid: 50 },
    });

    this.register({
      id: 'dune.query.results',
      name: 'Dune Query Results',
      description: 'Get Dune Analytics query results',
      category: 'analytics',
      path: '/api/v1/dune/query/:queryId/results',
      methods: ['GET'],
      pricing: { free: false, priceUsd: '0.10', token: 'USDC', network: 'base' },
      rateLimit: { free: 0, paid: 100 },
    });

    // ========================================
    // Agent Endpoints
    // ========================================

    this.register({
      id: 'agents.defi.execute',
      name: 'DeFi Agent Execute',
      description: 'Execute DeFi strategy via AI agent',
      category: 'agents',
      path: '/api/v1/agents/defi/execute',
      methods: ['POST'],
      pricing: { free: false, priceUsd: '1.00', token: 'USDC', network: 'base' },
      rateLimit: { free: 0, paid: 20 },
    });

    this.register({
      id: 'agents.trading.analyze',
      name: 'Trading Agent Analyze',
      description: 'AI agent trading analysis',
      category: 'agents',
      path: '/api/v1/agents/trading/analyze',
      methods: ['POST'],
      pricing: { free: false, priceUsd: '0.50', token: 'USDC', network: 'base' },
      rateLimit: { free: 0, paid: 50 },
    });

    this.register({
      id: 'agents.ucai.chat',
      name: 'UCAI Chat',
      description: 'Universal Crypto AI assistant',
      category: 'agents',
      path: '/api/v1/agents/ucai/chat',
      methods: ['POST'],
      pricing: { free: false, priceUsd: '0.05', token: 'USDC', network: 'base' },
      rateLimit: { free: 5, paid: 200 },
    });

    // ========================================
    // Automation Endpoints
    // ========================================

    this.register({
      id: 'automation.social.post',
      name: 'Social Media Post',
      description: 'Automated social media posting',
      category: 'automation',
      path: '/api/v1/automation/social/post',
      methods: ['POST'],
      pricing: { free: false, priceUsd: '0.10', token: 'USDC', network: 'base' },
      rateLimit: { free: 0, paid: 100 },
    });

    this.register({
      id: 'automation.sweep.execute',
      name: 'Token Sweep',
      description: 'Sweep tokens to consolidation wallet',
      category: 'automation',
      path: '/api/v1/automation/sweep',
      methods: ['POST'],
      pricing: { free: false, priceUsd: '0.50', token: 'USDC', network: 'base' },
      rateLimit: { free: 0, paid: 20 },
    });

    this.register({
      id: 'automation.volume.create',
      name: 'Volume Bot',
      description: 'Create trading volume strategy',
      category: 'automation',
      path: '/api/v1/automation/volume',
      methods: ['POST'],
      pricing: { free: false, priceUsd: '2.00', token: 'USDC', network: 'base' },
      rateLimit: { free: 0, paid: 10 },
    });

    // ========================================
    // GMX Endpoints
    // ========================================

    this.register({
      id: 'defi.gmx.positions',
      name: 'GMX Positions',
      description: 'Get GMX perpetual positions',
      category: 'defi',
      path: '/api/v1/defi/gmx/positions/:address',
      methods: ['GET'],
      pricing: { free: false, priceUsd: '0.02', token: 'USDC', network: 'base' },
      rateLimit: { free: 5, paid: 500 },
    });

    this.register({
      id: 'defi.gmx.markets',
      name: 'GMX Markets',
      description: 'Get GMX V2 markets data',
      category: 'defi',
      path: '/api/v1/defi/gmx/markets',
      methods: ['GET'],
      pricing: { free: false, priceUsd: '0.01', token: 'USDC', network: 'base' },
      rateLimit: { free: 10, paid: 1000 },
    });

    // ========================================
    // Lido Endpoints
    // ========================================

    this.register({
      id: 'defi.lido.stats',
      name: 'Lido Stats',
      description: 'Get Lido staking statistics',
      category: 'defi',
      path: '/api/v1/defi/lido/stats',
      methods: ['GET'],
      pricing: { free: true, priceUsd: '0', token: 'USDC', network: 'base' },
      rateLimit: { free: 50, paid: 5000 },
    });

    this.register({
      id: 'defi.lido.stake',
      name: 'Lido Stake',
      description: 'Stake ETH via Lido',
      category: 'defi',
      path: '/api/v1/defi/lido/stake',
      methods: ['POST'],
      pricing: { free: false, priceUsd: '0.10', token: 'USDC', network: 'base' },
      rateLimit: { free: 0, paid: 50 },
    });

    // ========================================
    // Yearn Endpoints
    // ========================================

    this.register({
      id: 'defi.yearn.vaults',
      name: 'Yearn Vaults',
      description: 'Get Yearn vault data',
      category: 'defi',
      path: '/api/v1/defi/yearn/vaults',
      methods: ['GET'],
      pricing: { free: false, priceUsd: '0.01', token: 'USDC', network: 'base' },
      rateLimit: { free: 10, paid: 1000 },
    });

    // ========================================
    // Fear & Greed / Sentiment
    // ========================================

    this.register({
      id: 'market.feargreed',
      name: 'Fear & Greed Index',
      description: 'Get crypto fear and greed index',
      category: 'market-data',
      path: '/api/v1/market/feargreed',
      methods: ['GET'],
      pricing: { free: true, priceUsd: '0', token: 'USDC', network: 'base' },
      rateLimit: { free: 100, paid: 10000 },
    });

    this.register({
      id: 'market.sentiment',
      name: 'Market Sentiment',
      description: 'Get aggregated market sentiment',
      category: 'market-data',
      path: '/api/v1/market/sentiment/:token',
      methods: ['GET'],
      pricing: { free: false, priceUsd: '0.02', token: 'USDC', network: 'base' },
      rateLimit: { free: 5, paid: 500 },
    });

    // ========================================
    // News Endpoints
    // ========================================

    this.register({
      id: 'market.news',
      name: 'Crypto News',
      description: 'Get latest crypto news',
      category: 'market-data',
      path: '/api/v1/market/news',
      methods: ['GET'],
      pricing: { free: true, priceUsd: '0', token: 'USDC', network: 'base' },
      rateLimit: { free: 50, paid: 5000 },
    });

    this.register({
      id: 'market.news.token',
      name: 'Token News',
      description: 'Get news for specific token',
      category: 'market-data',
      path: '/api/v1/market/news/:token',
      methods: ['GET'],
      pricing: { free: false, priceUsd: '0.01', token: 'USDC', network: 'base' },
      rateLimit: { free: 10, paid: 1000 },
    });

    // ========================================
    // Indicators Endpoints
    // ========================================

    this.register({
      id: 'market.indicators',
      name: 'Technical Indicators',
      description: 'Get technical indicators (RSI, MACD, etc)',
      category: 'market-data',
      path: '/api/v1/market/indicators/:symbol',
      methods: ['GET'],
      pricing: { free: false, priceUsd: '0.02', token: 'USDC', network: 'base' },
      rateLimit: { free: 5, paid: 500 },
    });

    // ========================================
    // BNB Chain Endpoints
    // ========================================

    this.register({
      id: 'bnbchain.info',
      name: 'BNB Chain Info',
      description: 'Get BNB Chain information',
      category: 'defi',
      path: '/api/v1/bnbchain/info',
      methods: ['GET'],
      pricing: { free: true, priceUsd: '0', token: 'USDC', network: 'base' },
      rateLimit: { free: 50, paid: 5000 },
    });

    this.register({
      id: 'bnbchain.tokens',
      name: 'BNB Chain Tokens',
      description: 'Get BEP-20 token list',
      category: 'defi',
      path: '/api/v1/bnbchain/tokens',
      methods: ['GET'],
      pricing: { free: false, priceUsd: '0.01', token: 'USDC', network: 'base' },
      rateLimit: { free: 10, paid: 1000 },
    });

    // ========================================
    // MCP Server Endpoints (Generic)
    // ========================================

    this.register({
      id: 'mcp.tools.list',
      name: 'List MCP Tools',
      description: 'List all available MCP tools',
      category: 'mcp',
      path: '/api/v1/mcp/tools',
      methods: ['GET'],
      pricing: { free: true, priceUsd: '0', token: 'USDC', network: 'base' },
      rateLimit: { free: 100, paid: 10000 },
    });

    this.register({
      id: 'mcp.tools.call',
      name: 'Call MCP Tool',
      description: 'Execute any MCP tool',
      category: 'mcp',
      path: '/api/v1/mcp/tools/:toolName/call',
      methods: ['POST'],
      pricing: { free: false, priceUsd: '0.10', token: 'USDC', network: 'base' },
      rateLimit: { free: 0, paid: 100 },
    });

    this.register({
      id: 'mcp.resources.list',
      name: 'List MCP Resources',
      description: 'List all available MCP resources',
      category: 'mcp',
      path: '/api/v1/mcp/resources',
      methods: ['GET'],
      pricing: { free: true, priceUsd: '0', token: 'USDC', network: 'base' },
      rateLimit: { free: 100, paid: 10000 },
    });

    this.register({
      id: 'mcp.resources.read',
      name: 'Read MCP Resource',
      description: 'Read an MCP resource',
      category: 'mcp',
      path: '/api/v1/mcp/resources/:resourceUri',
      methods: ['GET'],
      pricing: { free: false, priceUsd: '0.05', token: 'USDC', network: 'base' },
      rateLimit: { free: 5, paid: 500 },
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
