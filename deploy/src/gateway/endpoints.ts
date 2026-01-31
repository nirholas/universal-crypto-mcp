/**
 * MCP Server Endpoint Registry and Routing
 * 
 * @author nirholas (Nich)
 * @license Apache-2.0
 */

import { Request, Response, NextFunction, Router } from 'express';
import { Logger } from './logger';
import { MCPManager } from './mcp-manager.js';

// ============================================================================
// Types
// ============================================================================

export interface EndpointConfig {
  id: string;
  name: string;
  description: string;
  category: 'defi' | 'trading' | 'market-data' | 'nft' | 'payments' | 'wallets' | 'security' | 'novel' | 'layer2' | 'analytics' | 'agents' | 'automation' | 'mcp' | 'infrastructure' | 'generators' | 'blockchain-explorers' | 'bridges';
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
  private mcpManager: MCPManager | null = null;

  constructor(logger: Logger, mcpManager?: MCPManager) {
    this.router = Router();
    this.logger = logger.child({ component: 'EndpointRegistry' });
    this.mcpManager = mcpManager || null;
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
   * Get public endpoints for API documentation
   */
  getPublicEndpoints(): EndpointConfig[] {
    return this.getAll().map(e => ({
      ...e,
      handler: undefined, // Don't expose handlers
    }));
  }

  /**
   * Forward request to MCP server
   */
  async forwardTo(server: string, method: string, params: Record<string, unknown>): Promise<unknown> {
    if (!this.mcpManager) {
      throw new Error('MCP Manager not initialized');
    }

    this.logger.info(`Forwarding to ${server}.${method}`, params);
    
    try {
      const result = await this.mcpManager.callTool(server, method, params);
      return result;
    } catch (error) {
      this.logger.error(`Failed to forward to ${server}.${method}:`, error as Error);
      throw error;
    }
  }

  /**
   * Execute MCP tool by name (format: serverId.toolName)
   */
  async executeMCPTool(toolName: string, params: Record<string, unknown>): Promise<unknown> {
    if (!this.mcpManager) {
      throw new Error('MCP Manager not initialized');
    }

    this.logger.info(`Executing MCP tool: ${toolName}`, params);
    
    // Parse toolName as serverId.toolName
    const parts = toolName.split('.');
    if (parts.length < 2) {
      throw new Error('Tool name must be in format: serverId.toolName');
    }

    const [serverId, ...toolParts] = parts;
    const actualToolName = toolParts.join('.');
    
    try {
      const result = await this.mcpManager.callTool(serverId, actualToolName, params);
      return result;
    } catch (error) {
      this.logger.error(`Failed to execute tool ${toolName}:`, error as Error);
      throw error;
    }
  }

  /**
   * List available MCP tools
   */
  async listMCPTools(): Promise<unknown[]> {
    if (!this.mcpManager) {
      return this.getAll().map(e => ({
        name: e.id,
        description: e.description,
        category: e.category,
        parameters: e.parameters,
      }));
    }

    try {
      const allTools = await this.mcpManager.listAllTools();
      const flattened = allTools.flatMap(({ serverId, tools }) =>
        tools.map(tool => ({
          name: `${serverId}.${tool.name}`,
          description: tool.description,
          serverId,
          inputSchema: tool.inputSchema,
        }))
      );
      return flattened;
    } catch (error) {
      this.logger.error('Failed to list MCP tools:', error as Error);
      throw error;
    }
  }

  /**
   * Stream MCP server response
   * Implements Server-Sent Events for real-time MCP tool execution
   */
  streamMCP(req: Request, res: Response): void {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no'); // Disable nginx buffering

    const clientId = `client_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    this.logger.info(`SSE client connected: ${clientId}`);

    // Send initial connection event
    res.write(`event: connected\ndata: ${JSON.stringify({ clientId, timestamp: Date.now() })}\n\n`);

    // Heartbeat to keep connection alive
    const heartbeat = setInterval(() => {
      res.write(`event: heartbeat\ndata: ${JSON.stringify({ timestamp: Date.now() })}\n\n`);
    }, 30000);

    // Handle incoming tool execution requests via query params or body
    const toolName = req.query.tool as string;
    const params = req.query.params ? JSON.parse(req.query.params as string) : {};

    if (toolName) {
      this.executeToolWithStreaming(toolName, params, res, clientId).catch(error => {
        res.write(`event: error\ndata: ${JSON.stringify({ error: (error as Error).message })}\n\n`);
      });
    }

    // Handle client disconnect
    req.on('close', () => {
      clearInterval(heartbeat);
      this.logger.info(`SSE client disconnected: ${clientId}`);
      res.end();
    });
  }

  /**
   * Execute MCP tool with streaming updates
   */
  private async executeToolWithStreaming(
    toolName: string,
    params: Record<string, unknown>,
    res: Response,
    clientId: string
  ): Promise<void> {
    try {
      // Parse tool name (format: serverId.toolName)
      const [serverId, ...toolParts] = toolName.split('.');
      const actualToolName = toolParts.join('.');

      // Send start event
      res.write(`event: tool_start\ndata: ${JSON.stringify({ 
        tool: toolName, 
        params,
        timestamp: Date.now() 
      })}\n\n`);

      // Execute the tool
      const startTime = Date.now();
      
      if (this.mcpManager) {
        // Get server and execute tool
        const result = await this.mcpManager.callTool(serverId, actualToolName, params);
        
        // Send progress updates for long-running operations
        if (result && typeof result === 'object' && 'progress' in result) {
          for await (const progress of result.progress as AsyncIterable<{ percent: number; message: string }>) {
            res.write(`event: progress\ndata: ${JSON.stringify(progress)}\n\n`);
          }
        }

        // Send completion event
        res.write(`event: tool_complete\ndata: ${JSON.stringify({
          tool: toolName,
          result,
          duration: Date.now() - startTime,
          timestamp: Date.now()
        })}\n\n`);
      } else {
        throw new Error('MCP manager not initialized');
      }
    } catch (error) {
      res.write(`event: tool_error\ndata: ${JSON.stringify({
        tool: toolName,
        error: (error as Error).message,
        timestamp: Date.now()
      })}\n\n`);
    }
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

    // ========================================
    // Blockchain Explorer Endpoints
    // ========================================

    this.register({
      id: 'explorer.etherscan',
      name: 'Etherscan Advanced',
      description: 'Advanced Etherscan API queries',
      category: 'blockchain-explorers',
      path: '/api/v1/explorer/etherscan/:address',
      methods: ['GET'],
      pricing: { free: false, priceUsd: '0.01', token: 'USDC', network: 'base' },
      rateLimit: { free: 10, paid: 1000 },
    });

    this.register({
      id: 'explorer.bscscan',
      name: 'BSCScan',
      description: 'BNB Chain block explorer',
      category: 'blockchain-explorers',
      path: '/api/v1/explorer/bscscan/:address',
      methods: ['GET'],
      pricing: { free: false, priceUsd: '0.01', token: 'USDC', network: 'base' },
      rateLimit: { free: 10, paid: 1000 },
    });

    this.register({
      id: 'explorer.basescan',
      name: 'BaseScan',
      description: 'Base network explorer',
      category: 'blockchain-explorers',
      path: '/api/v1/explorer/basescan/:address',
      methods: ['GET'],
      pricing: { free: false, priceUsd: '0.01', token: 'USDC', network: 'base' },
      rateLimit: { free: 10, paid: 1000 },
    });

    this.register({
      id: 'explorer.arbiscan',
      name: 'ArbiScan',
      description: 'Arbitrum block explorer',
      category: 'blockchain-explorers',
      path: '/api/v1/explorer/arbiscan/:address',
      methods: ['GET'],
      pricing: { free: false, priceUsd: '0.01', token: 'USDC', network: 'base' },
      rateLimit: { free: 10, paid: 1000 },
    });

    this.register({
      id: 'explorer.optimism',
      name: 'Optimism Explorer',
      description: 'Optimism block explorer',
      category: 'blockchain-explorers',
      path: '/api/v1/explorer/optimism/:address',
      methods: ['GET'],
      pricing: { free: false, priceUsd: '0.01', token: 'USDC', network: 'base' },
      rateLimit: { free: 10, paid: 1000 },
    });

    this.register({
      id: 'explorer.polygonscan',
      name: 'PolygonScan',
      description: 'Polygon block explorer',
      category: 'blockchain-explorers',
      path: '/api/v1/explorer/polygonscan/:address',
      methods: ['GET'],
      pricing: { free: false, priceUsd: '0.01', token: 'USDC', network: 'base' },
      rateLimit: { free: 10, paid: 1000 },
    });

    this.register({
      id: 'explorer.avalanche',
      name: 'Avalanche Explorer',
      description: 'Avalanche C-Chain explorer',
      category: 'blockchain-explorers',
      path: '/api/v1/explorer/avalanche/:address',
      methods: ['GET'],
      pricing: { free: false, priceUsd: '0.01', token: 'USDC', network: 'base' },
      rateLimit: { free: 10, paid: 1000 },
    });

    // ========================================
    // Alternative Blockchain Endpoints
    // ========================================

    this.register({
      id: 'blockchain.solana',
      name: 'Solana Network',
      description: 'Solana blockchain queries',
      category: 'wallets',
      path: '/api/v1/blockchain/solana/:address',
      methods: ['GET'],
      pricing: { free: false, priceUsd: '0.01', token: 'USDC', network: 'base' },
      rateLimit: { free: 10, paid: 1000 },
    });

    this.register({
      id: 'blockchain.aptos',
      name: 'Aptos Network',
      description: 'Aptos blockchain queries',
      category: 'wallets',
      path: '/api/v1/blockchain/aptos/:address',
      methods: ['GET'],
      pricing: { free: false, priceUsd: '0.01', token: 'USDC', network: 'base' },
      rateLimit: { free: 10, paid: 1000 },
    });

    this.register({
      id: 'blockchain.sui',
      name: 'Sui Network',
      description: 'Sui blockchain queries',
      category: 'wallets',
      path: '/api/v1/blockchain/sui/:address',
      methods: ['GET'],
      pricing: { free: false, priceUsd: '0.01', token: 'USDC', network: 'base' },
      rateLimit: { free: 10, paid: 1000 },
    });

    this.register({
      id: 'blockchain.cardano',
      name: 'Cardano Network',
      description: 'Cardano blockchain queries',
      category: 'wallets',
      path: '/api/v1/blockchain/cardano/:address',
      methods: ['GET'],
      pricing: { free: false, priceUsd: '0.01', token: 'USDC', network: 'base' },
      rateLimit: { free: 10, paid: 1000 },
    });

    this.register({
      id: 'blockchain.polkadot',
      name: 'Polkadot Network',
      description: 'Polkadot blockchain queries',
      category: 'wallets',
      path: '/api/v1/blockchain/polkadot/:address',
      methods: ['GET'],
      pricing: { free: false, priceUsd: '0.01', token: 'USDC', network: 'base' },
      rateLimit: { free: 10, paid: 1000 },
    });

    this.register({
      id: 'blockchain.cosmos',
      name: 'Cosmos Hub',
      description: 'Cosmos blockchain queries',
      category: 'wallets',
      path: '/api/v1/blockchain/cosmos/:address',
      methods: ['GET'],
      pricing: { free: false, priceUsd: '0.01', token: 'USDC', network: 'base' },
      rateLimit: { free: 10, paid: 1000 },
    });

    this.register({
      id: 'blockchain.near',
      name: 'NEAR Protocol',
      description: 'NEAR blockchain queries',
      category: 'wallets',
      path: '/api/v1/blockchain/near/:address',
      methods: ['GET'],
      pricing: { free: false, priceUsd: '0.01', token: 'USDC', network: 'base' },
      rateLimit: { free: 10, paid: 1000 },
    });

    // ========================================
    // NFT Marketplace Endpoints
    // ========================================

    this.register({
      id: 'nft.opensea.collection',
      name: 'OpenSea Collection',
      description: 'Get OpenSea collection data',
      category: 'nft',
      path: '/api/v1/nft/opensea/collection/:slug',
      methods: ['GET'],
      pricing: { free: false, priceUsd: '0.02', token: 'USDC', network: 'base' },
      rateLimit: { free: 5, paid: 500 },
    });

    this.register({
      id: 'nft.blur.collection',
      name: 'Blur Collection',
      description: 'Get Blur marketplace collection data',
      category: 'nft',
      path: '/api/v1/nft/blur/collection/:slug',
      methods: ['GET'],
      pricing: { free: false, priceUsd: '0.02', token: 'USDC', network: 'base' },
      rateLimit: { free: 5, paid: 500 },
    });

    this.register({
      id: 'nft.axie.stats',
      name: 'Axie Infinity Stats',
      description: 'Get Axie Infinity game stats',
      category: 'nft',
      path: '/api/v1/nft/axie/stats',
      methods: ['GET'],
      pricing: { free: false, priceUsd: '0.01', token: 'USDC', network: 'base' },
      rateLimit: { free: 10, paid: 1000 },
    });

    // ========================================
    // Wallet Services
    // ========================================

    this.register({
      id: 'wallet.ens.resolve',
      name: 'ENS Resolve',
      description: 'Resolve ENS domain to address',
      category: 'wallets',
      path: '/api/v1/wallet/ens/resolve/:name',
      methods: ['GET'],
      pricing: { free: true, priceUsd: '0', token: 'USDC', network: 'base' },
      rateLimit: { free: 50, paid: 5000 },
    });

    this.register({
      id: 'wallet.ens.reverse',
      name: 'ENS Reverse Lookup',
      description: 'Get ENS name from address',
      category: 'wallets',
      path: '/api/v1/wallet/ens/reverse/:address',
      methods: ['GET'],
      pricing: { free: true, priceUsd: '0', token: 'USDC', network: 'base' },
      rateLimit: { free: 50, paid: 5000 },
    });

    this.register({
      id: 'wallet.safe.info',
      name: 'Safe Wallet Info',
      description: 'Get Gnosis Safe wallet information',
      category: 'wallets',
      path: '/api/v1/wallet/safe/:address',
      methods: ['GET'],
      pricing: { free: false, priceUsd: '0.01', token: 'USDC', network: 'base' },
      rateLimit: { free: 10, paid: 1000 },
    });

    this.register({
      id: 'wallet.walletconnect.session',
      name: 'WalletConnect Session',
      description: 'Manage WalletConnect sessions',
      category: 'wallets',
      path: '/api/v1/wallet/walletconnect/session',
      methods: ['POST'],
      pricing: { free: false, priceUsd: '0.05', token: 'USDC', network: 'base' },
      rateLimit: { free: 0, paid: 100 },
    });

    // ========================================
    // Intelligence & Analytics
    // ========================================

    this.register({
      id: 'intelligence.nansen',
      name: 'Nansen Intelligence',
      description: 'Nansen on-chain intelligence',
      category: 'analytics',
      path: '/api/v1/intelligence/nansen/:address',
      methods: ['GET'],
      pricing: { free: false, priceUsd: '0.50', token: 'USDC', network: 'base' },
      rateLimit: { free: 0, paid: 50 },
    });

    this.register({
      id: 'intelligence.arkham',
      name: 'Arkham Intelligence',
      description: 'Arkham entity tracking',
      category: 'analytics',
      path: '/api/v1/intelligence/arkham/:address',
      methods: ['GET'],
      pricing: { free: false, priceUsd: '0.30', token: 'USDC', network: 'base' },
      rateLimit: { free: 0, paid: 100 },
    });

    this.register({
      id: 'intelligence.whale-watcher',
      name: 'Whale Watcher',
      description: 'Track whale wallet movements',
      category: 'analytics',
      path: '/api/v1/intelligence/whales',
      methods: ['GET'],
      pricing: { free: false, priceUsd: '0.20', token: 'USDC', network: 'base' },
      rateLimit: { free: 0, paid: 100 },
    });

    // ========================================
    // Novel/Advanced Features
    // ========================================

    this.register({
      id: 'novel.intent-solver',
      name: 'Intent Solver',
      description: 'Solve user intents with optimal execution',
      category: 'novel',
      path: '/api/v1/novel/intent-solver',
      methods: ['POST'],
      pricing: { free: false, priceUsd: '0.50', token: 'USDC', network: 'base' },
      rateLimit: { free: 0, paid: 50 },
    });

    this.register({
      id: 'novel.privacy-pools',
      name: 'Privacy Pools',
      description: 'Private transaction pools',
      category: 'novel',
      path: '/api/v1/novel/privacy-pools',
      methods: ['POST'],
      pricing: { free: false, priceUsd: '1.00', token: 'USDC', network: 'base' },
      rateLimit: { free: 0, paid: 20 },
    });

    this.register({
      id: 'novel.temporal-oracles',
      name: 'Temporal Oracles',
      description: 'Time-based oracle data',
      category: 'novel',
      path: '/api/v1/novel/temporal-oracles/:query',
      methods: ['GET'],
      pricing: { free: false, priceUsd: '0.10', token: 'USDC', network: 'base' },
      rateLimit: { free: 0, paid: 100 },
    });

    this.register({
      id: 'novel.quantum-resistant',
      name: 'Quantum Resistant Signatures',
      description: 'Post-quantum cryptography',
      category: 'novel',
      path: '/api/v1/novel/quantum/sign',
      methods: ['POST'],
      pricing: { free: false, priceUsd: '0.20', token: 'USDC', network: 'base' },
      rateLimit: { free: 0, paid: 50 },
    });

    this.register({
      id: 'novel.reputation-graphs',
      name: 'Reputation Graphs',
      description: 'On-chain reputation scoring',
      category: 'novel',
      path: '/api/v1/novel/reputation/:address',
      methods: ['GET'],
      pricing: { free: false, priceUsd: '0.15', token: 'USDC', network: 'base' },
      rateLimit: { free: 0, paid: 100 },
    });

    this.register({
      id: 'novel.verbwire',
      name: 'Verbwire API',
      description: 'Verbwire NFT infrastructure',
      category: 'novel',
      path: '/api/v1/novel/verbwire/:action',
      methods: ['POST'],
      pricing: { free: false, priceUsd: '0.10', token: 'USDC', network: 'base' },
      rateLimit: { free: 0, paid: 100 },
    });

    // ========================================
    // Generator Tools
    // ========================================

    this.register({
      id: 'generators.repo-to-mcp',
      name: 'Repo to MCP',
      description: 'Convert GitHub repo to MCP server',
      category: 'generators',
      path: '/api/v1/generators/repo-to-mcp',
      methods: ['POST'],
      pricing: { free: false, priceUsd: '0.50', token: 'USDC', network: 'base' },
      rateLimit: { free: 0, paid: 50 },
    });

    this.register({
      id: 'generators.abi-to-mcp',
      name: 'ABI to MCP',
      description: 'Generate MCP from contract ABI',
      category: 'generators',
      path: '/api/v1/generators/abi-to-mcp',
      methods: ['POST'],
      pricing: { free: false, priceUsd: '0.20', token: 'USDC', network: 'base' },
      rateLimit: { free: 0, paid: 100 },
    });

    this.register({
      id: 'generators.discovery',
      name: 'MCP Discovery',
      description: 'Discover and index MCP servers',
      category: 'generators',
      path: '/api/v1/generators/discovery',
      methods: ['GET'],
      pricing: { free: true, priceUsd: '0', token: 'USDC', network: 'base' },
      rateLimit: { free: 50, paid: 5000 },
    });

    // ========================================
    // Security (Additional)
    // ========================================

    this.register({
      id: 'security.mev-protection',
      name: 'MEV Protection',
      description: 'MEV-protected transaction submission',
      category: 'security',
      path: '/api/v1/security/mev-protect',
      methods: ['POST'],
      pricing: { free: false, priceUsd: '0.20', token: 'USDC', network: 'base' },
      rateLimit: { free: 0, paid: 100 },
    });

    this.register({
      id: 'security.chainaware',
      name: 'ChainAware Security',
      description: 'Multi-chain security monitoring',
      category: 'security',
      path: '/api/v1/security/chainaware/:address',
      methods: ['GET'],
      pricing: { free: false, priceUsd: '0.10', token: 'USDC', network: 'base' },
      rateLimit: { free: 5, paid: 500 },
    });

    // ========================================
    // Payments (Additional x402)
    // ========================================

    this.register({
      id: 'payments.x402.create',
      name: 'Create x402 Invoice',
      description: 'Create payment invoice',
      category: 'payments',
      path: '/api/v1/payments/x402/invoice',
      methods: ['POST'],
      pricing: { free: true, priceUsd: '0', token: 'USDC', network: 'base' },
      rateLimit: { free: 100, paid: 10000 },
    });

    this.register({
      id: 'payments.lightning',
      name: 'Lightning Network',
      description: 'Bitcoin Lightning payments',
      category: 'payments',
      path: '/api/v1/payments/lightning/invoice',
      methods: ['POST'],
      pricing: { free: false, priceUsd: '0.01', token: 'USDC', network: 'base' },
      rateLimit: { free: 10, paid: 1000 },
    });

    // ========================================
    // Aggregators & Oracles
    // ========================================

    this.register({
      id: 'oracle.price',
      name: 'Price Oracle',
      description: 'Aggregated price oracle data',
      category: 'market-data',
      path: '/api/v1/oracle/price/:token',
      methods: ['GET'],
      pricing: { free: false, priceUsd: '0.01', token: 'USDC', network: 'base' },
      rateLimit: { free: 10, paid: 1000 },
    });

    this.register({
      id: 'aggregator.dex',
      name: 'DEX Aggregator',
      description: 'Best swap routes across DEXes',
      category: 'defi',
      path: '/api/v1/aggregator/dex/quote',
      methods: ['POST'],
      pricing: { free: false, priceUsd: '0.05', token: 'USDC', network: 'base' },
      rateLimit: { free: 5, paid: 500 },
    });

    this.register({
      id: 'tracker.token',
      name: 'Token Tracker',
      description: 'Track token across chains',
      category: 'market-data',
      path: '/api/v1/tracker/token/:address',
      methods: ['GET'],
      pricing: { free: false, priceUsd: '0.02', token: 'USDC', network: 'base' },
      rateLimit: { free: 10, paid: 1000 },
    });

    // ========================================
    // Infrastructure
    // ========================================

    this.register({
      id: 'infra.proxy',
      name: 'RPC Proxy',
      description: 'Managed RPC proxy service',
      category: 'infrastructure',
      path: '/api/v1/infra/proxy/:network',
      methods: ['POST'],
      pricing: { free: false, priceUsd: '0.001', token: 'USDC', network: 'base' },
      rateLimit: { free: 50, paid: 50000 },
    });

    this.register({
      id: 'infra.ipfs',
      name: 'IPFS Gateway',
      description: 'IPFS upload and retrieval',
      category: 'infrastructure',
      path: '/api/v1/infra/ipfs/upload',
      methods: ['POST'],
      pricing: { free: false, priceUsd: '0.05', token: 'USDC', network: 'base' },
      rateLimit: { free: 5, paid: 500 },
    });

    // ========================================
    // Marketplace
    // ========================================

    this.register({
      id: 'marketplace.tools.list',
      name: 'Marketplace Tools',
      description: 'List all marketplace MCP tools',
      category: 'mcp',
      path: '/api/v1/marketplace/tools',
      methods: ['GET'],
      pricing: { free: true, priceUsd: '0', token: 'USDC', network: 'base' },
      rateLimit: { free: 100, paid: 10000 },
    });

    this.register({
      id: 'marketplace.tools.install',
      name: 'Install Marketplace Tool',
      description: 'Install tool from marketplace',
      category: 'mcp',
      path: '/api/v1/marketplace/tools/:toolId/install',
      methods: ['POST'],
      pricing: { free: false, priceUsd: '0.10', token: 'USDC', network: 'base' },
      rateLimit: { free: 0, paid: 100 },
    });

    // ========================================
    // CRYPTOCOMPARE API (26 endpoints)
    // ========================================

    this.register({
      id: 'cryptocompare.price',
      name: 'CryptoCompare Price',
      description: 'Get current crypto price',
      category: 'market-data',
      path: '/api/v1/cryptocompare/price/:fsym/:tsyms',
      methods: ['GET'],
      pricing: { free: true, priceUsd: '0', token: 'USDC', network: 'base' },
      rateLimit: { free: 50, paid: 5000 },
    });

    this.register({
      id: 'cryptocompare.multiprice',
      name: 'CryptoCompare Multi Price',
      description: 'Get multiple crypto prices',
      category: 'market-data',
      path: '/api/v1/cryptocompare/multiprice',
      methods: ['POST'],
      pricing: { free: true, priceUsd: '0', token: 'USDC', network: 'base' },
      rateLimit: { free: 50, paid: 5000 },
    });

    this.register({
      id: 'cryptocompare.pricefull',
      name: 'CryptoCompare Price Full',
      description: 'Get full price data',
      category: 'market-data',
      path: '/api/v1/cryptocompare/pricefull/:fsym/:tsyms',
      methods: ['GET'],
      pricing: { free: true, priceUsd: '0', token: 'USDC', network: 'base' },
      rateLimit: { free: 50, paid: 5000 },
    });

    this.register({
      id: 'cryptocompare.histohour',
      name: 'CryptoCompare Hourly OHLCV',
      description: 'Historical hourly price data',
      category: 'market-data',
      path: '/api/v1/cryptocompare/histohour/:fsym/:tsym',
      methods: ['GET'],
      pricing: { free: false, priceUsd: '0.01', token: 'USDC', network: 'base' },
      rateLimit: { free: 10, paid: 1000 },
    });

    this.register({
      id: 'cryptocompare.histoday',
      name: 'CryptoCompare Daily OHLCV',
      description: 'Historical daily price data',
      category: 'market-data',
      path: '/api/v1/cryptocompare/histoday/:fsym/:tsym',
      methods: ['GET'],
      pricing: { free: false, priceUsd: '0.01', token: 'USDC', network: 'base' },
      rateLimit: { free: 10, paid: 1000 },
    });

    this.register({
      id: 'cryptocompare.histominute',
      name: 'CryptoCompare Minute OHLCV',
      description: 'Historical minute price data',
      category: 'market-data',
      path: '/api/v1/cryptocompare/histominute/:fsym/:tsym',
      methods: ['GET'],
      pricing: { free: false, priceUsd: '0.01', token: 'USDC', network: 'base' },
      rateLimit: { free: 10, paid: 1000 },
    });

    this.register({
      id: 'cryptocompare.news',
      name: 'CryptoCompare News',
      description: 'Latest crypto news articles',
      category: 'analytics',
      path: '/api/v1/cryptocompare/news',
      methods: ['GET'],
      pricing: { free: false, priceUsd: '0.02', token: 'USDC', network: 'base' },
      rateLimit: { free: 10, paid: 1000 },
    });

    this.register({
      id: 'cryptocompare.newsfeeds',
      name: 'CryptoCompare News Feeds',
      description: 'Available news feed sources',
      category: 'analytics',
      path: '/api/v1/cryptocompare/newsfeeds',
      methods: ['GET'],
      pricing: { free: true, priceUsd: '0', token: 'USDC', network: 'base' },
      rateLimit: { free: 20, paid: 2000 },
    });

    this.register({
      id: 'cryptocompare.newscategories',
      name: 'CryptoCompare News Categories',
      description: 'Available news categories',
      category: 'analytics',
      path: '/api/v1/cryptocompare/newscategories',
      methods: ['GET'],
      pricing: { free: true, priceUsd: '0', token: 'USDC', network: 'base' },
      rateLimit: { free: 20, paid: 2000 },
    });

    this.register({
      id: 'cryptocompare.coinlist',
      name: 'CryptoCompare Coin List',
      description: 'List all cryptocurrencies',
      category: 'market-data',
      path: '/api/v1/cryptocompare/coinlist',
      methods: ['GET'],
      pricing: { free: true, priceUsd: '0', token: 'USDC', network: 'base' },
      rateLimit: { free: 20, paid: 2000 },
    });

    this.register({
      id: 'cryptocompare.topmarketcap',
      name: 'Top by Market Cap',
      description: 'Top coins by market capitalization',
      category: 'market-data',
      path: '/api/v1/cryptocompare/topmarketcap/:tsym',
      methods: ['GET'],
      pricing: { free: true, priceUsd: '0', token: 'USDC', network: 'base' },
      rateLimit: { free: 20, paid: 2000 },
    });

    this.register({
      id: 'cryptocompare.topvolume',
      name: 'Top by Volume',
      description: 'Top coins by trading volume',
      category: 'market-data',
      path: '/api/v1/cryptocompare/topvolume/:tsym',
      methods: ['GET'],
      pricing: { free: true, priceUsd: '0', token: 'USDC', network: 'base' },
      rateLimit: { free: 20, paid: 2000 },
    });

    this.register({
      id: 'cryptocompare.socialstats',
      name: 'Social Stats',
      description: 'Social media statistics for coin',
      category: 'analytics',
      path: '/api/v1/cryptocompare/social/:coinId',
      methods: ['GET'],
      pricing: { free: false, priceUsd: '0.05', token: 'USDC', network: 'base' },
      rateLimit: { free: 5, paid: 500 },
    });

    this.register({
      id: 'cryptocompare.blockchain',
      name: 'Blockchain Data',
      description: 'On-chain blockchain statistics',
      category: 'analytics',
      path: '/api/v1/cryptocompare/blockchain/:fsym',
      methods: ['GET'],
      pricing: { free: false, priceUsd: '0.05', token: 'USDC', network: 'base' },
      rateLimit: { free: 5, paid: 500 },
    });

    this.register({
      id: 'cryptocompare.mining',
      name: 'Mining Equipment',
      description: 'Mining hardware and contracts',
      category: 'analytics',
      path: '/api/v1/cryptocompare/mining',
      methods: ['GET'],
      pricing: { free: false, priceUsd: '0.10', token: 'USDC', network: 'base' },
      rateLimit: { free: 5, paid: 500 },
    });

    // ========================================
    // MESSARI API (23 endpoints)
    // ========================================

    this.register({
      id: 'messari.assets',
      name: 'Messari All Assets',
      description: 'Get all crypto assets',
      category: 'market-data',
      path: '/api/v1/messari/assets',
      methods: ['GET'],
      pricing: { free: false, priceUsd: '0.05', token: 'USDC', network: 'base' },
      rateLimit: { free: 5, paid: 500 },
    });

    this.register({
      id: 'messari.asset',
      name: 'Messari Asset',
      description: 'Get asset details',
      category: 'market-data',
      path: '/api/v1/messari/asset/:assetKey',
      methods: ['GET'],
      pricing: { free: false, priceUsd: '0.02', token: 'USDC', network: 'base' },
      rateLimit: { free: 10, paid: 1000 },
    });

    this.register({
      id: 'messari.asset.profile',
      name: 'Messari Asset Profile',
      description: 'Detailed asset profile',
      category: 'analytics',
      path: '/api/v1/messari/asset/:assetKey/profile',
      methods: ['GET'],
      pricing: { free: false, priceUsd: '0.10', token: 'USDC', network: 'base' },
      rateLimit: { free: 5, paid: 500 },
    });

    this.register({
      id: 'messari.asset.metrics',
      name: 'Messari Asset Metrics',
      description: 'Quantitative asset metrics',
      category: 'analytics',
      path: '/api/v1/messari/asset/:assetKey/metrics',
      methods: ['GET'],
      pricing: { free: false, priceUsd: '0.05', token: 'USDC', network: 'base' },
      rateLimit: { free: 5, paid: 500 },
    });

    this.register({
      id: 'messari.price.timeseries',
      name: 'Messari Price Timeseries',
      description: 'Historical price data',
      category: 'market-data',
      path: '/api/v1/messari/timeseries/:assetKey/price',
      methods: ['GET'],
      pricing: { free: false, priceUsd: '0.02', token: 'USDC', network: 'base' },
      rateLimit: { free: 10, paid: 1000 },
    });

    this.register({
      id: 'messari.volume.timeseries',
      name: 'Messari Volume Timeseries',
      description: 'Historical volume data',
      category: 'market-data',
      path: '/api/v1/messari/timeseries/:assetKey/volume',
      methods: ['GET'],
      pricing: { free: false, priceUsd: '0.02', token: 'USDC', network: 'base' },
      rateLimit: { free: 10, paid: 1000 },
    });

    this.register({
      id: 'messari.marketcap.timeseries',
      name: 'Messari Market Cap Timeseries',
      description: 'Historical market cap data',
      category: 'market-data',
      path: '/api/v1/messari/timeseries/:assetKey/marketcap',
      methods: ['GET'],
      pricing: { free: false, priceUsd: '0.02', token: 'USDC', network: 'base' },
      rateLimit: { free: 10, paid: 1000 },
    });

    this.register({
      id: 'messari.mvrv',
      name: 'Messari MVRV Ratio',
      description: 'Market-Value-to-Realized-Value ratio',
      category: 'analytics',
      path: '/api/v1/messari/timeseries/:assetKey/mvrv',
      methods: ['GET'],
      pricing: { free: false, priceUsd: '0.10', token: 'USDC', network: 'base' },
      rateLimit: { free: 5, paid: 500 },
    });

    this.register({
      id: 'messari.nvt',
      name: 'Messari NVT Ratio',
      description: 'Network-Value-to-Transaction ratio',
      category: 'analytics',
      path: '/api/v1/messari/timeseries/:assetKey/nvt',
      methods: ['GET'],
      pricing: { free: false, priceUsd: '0.10', token: 'USDC', network: 'base' },
      rateLimit: { free: 5, paid: 500 },
    });

    this.register({
      id: 'messari.news',
      name: 'Messari News',
      description: 'Crypto news and research',
      category: 'analytics',
      path: '/api/v1/messari/news',
      methods: ['GET'],
      pricing: { free: false, priceUsd: '0.05', token: 'USDC', network: 'base' },
      rateLimit: { free: 10, paid: 1000 },
    });

    this.register({
      id: 'messari.asset.news',
      name: 'Messari Asset News',
      description: 'News for specific asset',
      category: 'analytics',
      path: '/api/v1/messari/news/:assetKey',
      methods: ['GET'],
      pricing: { free: false, priceUsd: '0.05', token: 'USDC', network: 'base' },
      rateLimit: { free: 10, paid: 1000 },
    });

    this.register({
      id: 'messari.research',
      name: 'Messari Research',
      description: 'Research reports',
      category: 'analytics',
      path: '/api/v1/messari/research',
      methods: ['GET'],
      pricing: { free: false, priceUsd: '0.20', token: 'USDC', network: 'base' },
      rateLimit: { free: 5, paid: 500 },
    });

    // ========================================
    // GLASSNODE API (24 endpoints)
    // ========================================

    this.register({
      id: 'glassnode.addresses.active',
      name: 'Glassnode Active Addresses',
      description: 'Number of active addresses',
      category: 'analytics',
      path: '/api/v1/glassnode/:asset/addresses/active',
      methods: ['GET'],
      pricing: { free: false, priceUsd: '0.10', token: 'USDC', network: 'base' },
      rateLimit: { free: 5, paid: 500 },
    });

    this.register({
      id: 'glassnode.addresses.new',
      name: 'Glassnode New Addresses',
      description: 'Number of new addresses',
      category: 'analytics',
      path: '/api/v1/glassnode/:asset/addresses/new',
      methods: ['GET'],
      pricing: { free: false, priceUsd: '0.10', token: 'USDC', network: 'base' },
      rateLimit: { free: 5, paid: 500 },
    });

    this.register({
      id: 'glassnode.mvrv',
      name: 'Glassnode MVRV',
      description: 'Market-Value-to-Realized-Value',
      category: 'analytics',
      path: '/api/v1/glassnode/:asset/mvrv',
      methods: ['GET'],
      pricing: { free: false, priceUsd: '0.15', token: 'USDC', network: 'base' },
      rateLimit: { free: 5, paid: 500 },
    });

    this.register({
      id: 'glassnode.nvt',
      name: 'Glassnode NVT',
      description: 'Network-Value-to-Transaction',
      category: 'analytics',
      path: '/api/v1/glassnode/:asset/nvt',
      methods: ['GET'],
      pricing: { free: false, priceUsd: '0.15', token: 'USDC', network: 'base' },
      rateLimit: { free: 5, paid: 500 },
    });

    this.register({
      id: 'glassnode.hashrate',
      name: 'Glassnode Hash Rate',
      description: 'Network hash rate',
      category: 'analytics',
      path: '/api/v1/glassnode/:asset/mining/hashrate',
      methods: ['GET'],
      pricing: { free: false, priceUsd: '0.10', token: 'USDC', network: 'base' },
      rateLimit: { free: 5, paid: 500 },
    });

    this.register({
      id: 'glassnode.difficulty',
      name: 'Glassnode Difficulty',
      description: 'Mining difficulty',
      category: 'analytics',
      path: '/api/v1/glassnode/:asset/mining/difficulty',
      methods: ['GET'],
      pricing: { free: false, priceUsd: '0.10', token: 'USDC', network: 'base' },
      rateLimit: { free: 5, paid: 500 },
    });

    this.register({
      id: 'glassnode.exchange.inflow',
      name: 'Glassnode Exchange Inflow',
      description: 'Exchange inflow volume',
      category: 'analytics',
      path: '/api/v1/glassnode/:asset/exchange/inflow',
      methods: ['GET'],
      pricing: { free: false, priceUsd: '0.20', token: 'USDC', network: 'base' },
      rateLimit: { free: 5, paid: 500 },
    });

    this.register({
      id: 'glassnode.exchange.outflow',
      name: 'Glassnode Exchange Outflow',
      description: 'Exchange outflow volume',
      category: 'analytics',
      path: '/api/v1/glassnode/:asset/exchange/outflow',
      methods: ['GET'],
      pricing: { free: false, priceUsd: '0.20', token: 'USDC', network: 'base' },
      rateLimit: { free: 5, paid: 500 },
    });

    this.register({
      id: 'glassnode.supply.whales',
      name: 'Glassnode Whale Supply',
      description: 'Supply held by whales',
      category: 'analytics',
      path: '/api/v1/glassnode/:asset/supply/whales',
      methods: ['GET'],
      pricing: { free: false, priceUsd: '0.25', token: 'USDC', network: 'base' },
      rateLimit: { free: 5, paid: 500 },
    });

    // ========================================
    // EXCHANGE APIS (~140 endpoints total)
    // ========================================

    // GEMINI (16 endpoints)
    ['getTicker', 'getOrderbook', 'getTrades', 'getSymbols', 'getSymbolDetails',
     'getBalances', 'getTransfers', 'getDepositAddresses', 'placeOrder',
     'cancelOrder', 'cancelAllOrders', 'getOrderStatus', 'getActiveOrders',
     'getPastTrades', 'testConnection', 'getServerTime'].forEach((method, i) => {
      this.register({
        id: `gemini.${method}`,
        name: `Gemini ${method.replace(/([A-Z])/g, ' $1').trim()}`,
        description: `Gemini ${method}`,
        category: 'trading',
        path: `/api/v1/exchange/gemini/${method.toLowerCase()}`,
        methods: method.startsWith('get') ? ['GET'] : ['POST'],
        pricing: { free: false, priceUsd: '0.01', token: 'USDC', network: 'base' },
        rateLimit: { free: 0, paid: 1000 },
      });
    });

    // BITFINEX (18 endpoints)
    ['getTicker', 'getTickers', 'getOrderbook', 'getTrades', 'getCandles',
     'getPlatformStatus', 'getBalances', 'getAccountInfo', 'getMarginInfo',
     'submitOrder', 'updateOrder', 'cancelOrder', 'cancelAllOrders',
     'getActiveOrders', 'getOrderHistory', 'getTradeHistory', 'testConnection'].forEach((method) => {
      this.register({
        id: `bitfinex.${method}`,
        name: `Bitfinex ${method.replace(/([A-Z])/g, ' $1').trim()}`,
        description: `Bitfinex ${method}`,
        category: 'trading',
        path: `/api/v1/exchange/bitfinex/${method.toLowerCase()}`,
        methods: method.startsWith('get') ? ['GET'] : ['POST'],
        pricing: { free: false, priceUsd: '0.01', token: 'USDC', network: 'base' },
        rateLimit: { free: 0, paid: 1000 },
      });
    });

    // HTX (18 endpoints)
    ['getTicker', 'getAllTickers', 'getOrderbook', 'getTrades', 'getKlines',
     'getSymbols', 'getCurrencies', 'getTimestamp', 'getAccounts', 'getBalance',
     'getAccountHistory', 'placeOrder', 'cancelOrder', 'cancelAllOrders',
     'getOrder', 'getOpenOrders', 'getOrderHistory', 'getMatchResults'].forEach((method) => {
      this.register({
        id: `htx.${method}`,
        name: `HTX ${method.replace(/([A-Z])/g, ' $1').trim()}`,
        description: `HTX ${method}`,
        category: 'trading',
        path: `/api/v1/exchange/htx/${method.toLowerCase()}`,
        methods: method.startsWith('get') ? ['GET'] : ['POST'],
        pricing: { free: false, priceUsd: '0.01', token: 'USDC', network: 'base' },
        rateLimit: { free: 0, paid: 1000 },
      });
    });

    // GATE.IO (26 endpoints)
    ['getTicker', 'getAllTickers', 'getOrderbook', 'getTrades', 'getCandles',
     'getCurrencyPairs', 'getCurrencyPairDetails', 'getCurrencies', 'getCurrencyDetails',
     'getBalances', 'getAccountDetail', 'getDepositAddress', 'getWithdrawals',
     'getDeposits', 'placeOrder', 'cancelOrder', 'cancelAllOrders', 'getOrder',
     'getOpenOrders', 'getOrderHistory', 'getMyTrades', 'testConnection', 'getServerTime'].forEach((method) => {
      this.register({
        id: `gateio.${method}`,
        name: `Gate.io ${method.replace(/([A-Z])/g, ' $1').trim()}`,
        description: `Gate.io ${method}`,
        category: 'trading',
        path: `/api/v1/exchange/gateio/${method.toLowerCase()}`,
        methods: method.startsWith('get') ? ['GET'] : ['POST'],
        pricing: { free: false, priceUsd: '0.01', token: 'USDC', network: 'base' },
        rateLimit: { free: 0, paid: 1000 },
      });
    });

    // MEXC (21 endpoints)
    ['ping', 'getTime', 'getExchangeInfo', 'getTicker', 'getAllTickers',
     'getTickerPrice', 'getBookTicker', 'getOrderbook', 'getTrades',
     'getHistoricalTrades', 'getAggregateTrades', 'getKlines', 'getAvgPrice',
     'getAccount', 'getBalances', 'getMyTrades', 'testOrder', 'placeOrder',
     'cancelOrder', 'cancelAllOrders', 'getOrder', 'getOpenOrders', 'getAllOrders'].forEach((method) => {
      this.register({
        id: `mexc.${method}`,
        name: `MEXC ${method.replace(/([A-Z])/g, ' $1').trim()}`,
        description: `MEXC ${method}`,
        category: 'trading',
        path: `/api/v1/exchange/mexc/${method.toLowerCase()}`,
        methods: method.startsWith('get') || method === 'ping' ? ['GET'] : ['POST'],
        pricing: { free: false, priceUsd: '0.01', token: 'USDC', network: 'base' },
        rateLimit: { free: 0, paid: 1000 },
      });
    });

    // BITGET (21 endpoints)
    ['getTime', 'getAllTickers', 'getTicker', 'getOrderbook', 'getTrades',
     'getCandles', 'getSymbols', 'getCoins', 'getBalances', 'getAccountInfo',
     'getBills', 'getTransferRecords', 'placeOrder', 'placeBatchOrders',
     'cancelOrder', 'cancelBatchOrders', 'getOrder', 'getOpenOrders',
     'getOrderHistory', 'getFills', 'testConnection'].forEach((method) => {
      this.register({
        id: `bitget.${method}`,
        name: `Bitget ${method.replace(/([A-Z])/g, ' $1').trim()}`,
        description: `Bitget ${method}`,
        category: 'trading',
        path: `/api/v1/exchange/bitget/${method.toLowerCase()}`,
        methods: method.startsWith('get') ? ['GET'] : ['POST'],
        pricing: { free: false, priceUsd: '0.01', token: 'USDC', network: 'base' },
        rateLimit: { free: 0, paid: 1000 },
      });
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

