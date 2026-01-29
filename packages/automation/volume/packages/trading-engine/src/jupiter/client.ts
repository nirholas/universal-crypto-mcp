/**
 * Jupiter Client
 * 
 * Main client for interacting with Jupiter aggregator.
 * Provides quote fetching, swap execution, DCA, and limit orders.
 */

import { Connection, VersionedTransaction } from '@solana/web3.js';
import { JupiterQuote } from './quote.js';
import { JupiterSwap } from './swap.js';
import { JupiterDCA, type DCAAccountState } from './dca.js';
import { JupiterLimitOrders, type LimitOrderState } from './limit-orders.js';
import type {
  QuoteParams,
  QuoteResponse,
  SwapParams,
  ExecuteSwapParams,
  DCAParams,
  LimitOrderParams,
  TransactionResult,
  TokenInfo,
  TradingEngineConfig,
  IJupiterClient,
} from '../types.js';

/**
 * Token from Jupiter API
 */
interface JupiterToken {
  address: string;
  chainId: number;
  decimals: number;
  name: string;
  symbol: string;
  logoURI?: string;
  tags?: string[];
  extensions?: {
    coingeckoId?: string;
  };
}

/**
 * Route map response
 */
interface RouteMapResponse {
  mintKeys: string[];
  indexedRouteMap: Record<string, number[]>;
}

/**
 * Jupiter Client - Full integration with Jupiter V6 API
 */
export class JupiterClient implements IJupiterClient {
  private readonly connection: Connection;
  private readonly config: TradingEngineConfig;
  private readonly quote: JupiterQuote;
  private readonly swap: JupiterSwap;
  private readonly dca: JupiterDCA;
  private readonly limitOrders: JupiterLimitOrders;
  
  // Caches
  private tokenListCache: TokenInfo[] | null = null;
  private tokenListCacheTime: number = 0;
  private routeMapCache: Map<string, string[]> | null = null;
  private routeMapCacheTime: number = 0;

  constructor(config: Partial<TradingEngineConfig> = {}) {
    // Import DEFAULT_TRADING_CONFIG dynamically to avoid circular deps
    const defaultConfig: TradingEngineConfig = {
      rpcEndpoint: 'https://api.mainnet-beta.solana.com',
      cluster: 'mainnet-beta',
      defaultSlippageBps: 100,
      maxSlippageBps: 5000,
      jupiterApiUrl: 'https://quote-api.jup.ag/v6',
      enableMEVProtection: false,
      defaultJitoTipLamports: 10_000,
      tokenListCacheTtlMs: 5 * 60 * 1000,
      routeMapCacheTtlMs: 5 * 60 * 1000,
      jupiterRateLimit: 600,
    };

    this.config = { ...defaultConfig, ...config };
    this.connection = new Connection(this.config.rpcEndpoint, 'confirmed');
    this.quote = new JupiterQuote(this.config);
    this.swap = new JupiterSwap(this.config);
    this.dca = new JupiterDCA(this.config);
    this.limitOrders = new JupiterLimitOrders(this.config);
  }

  /**
   * Get a quote for a swap
   */
  async getQuote(params: QuoteParams): Promise<QuoteResponse> {
    // Validate slippage
    const slippageBps = params.slippageBps ?? this.config.defaultSlippageBps;
    this.quote.validateSlippage(slippageBps, this.config.maxSlippageBps);

    return this.quote.getQuote({
      ...params,
      slippageBps,
    });
  }

  /**
   * Get the best quote by trying multiple routing strategies
   */
  async getBestQuote(params: QuoteParams): Promise<QuoteResponse> {
    const slippageBps = params.slippageBps ?? this.config.defaultSlippageBps;
    this.quote.validateSlippage(slippageBps, this.config.maxSlippageBps);

    return this.quote.getBestQuote({
      ...params,
      slippageBps,
    });
  }

  /**
   * Get a swap transaction
   */
  async getSwapTransaction(params: SwapParams): Promise<VersionedTransaction> {
    return this.swap.getSwapTransaction(params);
  }

  /**
   * Execute a swap
   */
  async executeSwap(params: ExecuteSwapParams): Promise<TransactionResult> {
    return this.swap.executeSwap(params);
  }

  /**
   * Simulate a swap without executing
   */
  async simulateSwap(params: SwapParams): Promise<{
    success: boolean;
    logs?: string[];
    unitsConsumed?: number;
    error?: string;
  }> {
    return this.swap.simulateSwap(params);
  }

  /**
   * Get the route map (which tokens can swap to which)
   */
  async getRouteMap(): Promise<Map<string, string[]>> {
    // Check cache
    if (
      this.routeMapCache &&
      Date.now() - this.routeMapCacheTime < this.config.routeMapCacheTtlMs
    ) {
      return this.routeMapCache;
    }

    const response = await fetch(`${this.config.jupiterApiUrl}/indexed-route-map`, {
      headers: { 'Accept': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch route map: ${response.status}`);
    }

    const data = await response.json() as RouteMapResponse;
    
    // Convert indexed route map to a Map
    const routeMap = new Map<string, string[]>();
    const { mintKeys, indexedRouteMap } = data;

    for (const [indexStr, targetIndices] of Object.entries(indexedRouteMap)) {
      const sourceIndex = parseInt(indexStr, 10);
      const sourceMint = mintKeys[sourceIndex];
      if (sourceMint) {
        const targetMints = targetIndices
          .map(i => mintKeys[i])
          .filter((mint): mint is string => mint !== undefined);
        routeMap.set(sourceMint, targetMints);
      }
    }

    // Update cache
    this.routeMapCache = routeMap;
    this.routeMapCacheTime = Date.now();

    return routeMap;
  }

  /**
   * Get the Jupiter token list
   */
  async getTokenList(): Promise<TokenInfo[]> {
    // Check cache
    if (
      this.tokenListCache &&
      Date.now() - this.tokenListCacheTime < this.config.tokenListCacheTtlMs
    ) {
      return this.tokenListCache;
    }

    const response = await fetch('https://token.jup.ag/all', {
      headers: { 'Accept': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch token list: ${response.status}`);
    }

    const tokens = await response.json() as JupiterToken[];

    const tokenList: TokenInfo[] = tokens.map(token => ({
      mint: token.address,
      symbol: token.symbol,
      name: token.name,
      decimals: token.decimals,
      logoURI: token.logoURI,
      coingeckoId: token.extensions?.coingeckoId,
      tags: token.tags,
      isNative: token.address === 'So11111111111111111111111111111111111111112',
    }));

    // Update cache
    this.tokenListCache = tokenList;
    this.tokenListCacheTime = Date.now();

    return tokenList;
  }

  /**
   * Get token info by mint address
   */
  async getTokenInfo(mint: string): Promise<TokenInfo | undefined> {
    const tokenList = await this.getTokenList();
    return tokenList.find(token => token.mint === mint);
  }

  /**
   * Search for tokens by symbol or name
   */
  async searchTokens(query: string): Promise<TokenInfo[]> {
    const tokenList = await this.getTokenList();
    const lowerQuery = query.toLowerCase();
    
    return tokenList.filter(token =>
      token.symbol.toLowerCase().includes(lowerQuery) ||
      token.name.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Create a DCA order
   */
  async createDCAOrder(_params: DCAParams): Promise<TransactionResult> {
    // This requires a signer - throw helpful error
    throw new Error(
      'createDCAOrder requires a signer. Use createDCAOrderWithSigner instead.'
    );
  }

  /**
   * Create a DCA order with signer
   */
  async createDCAOrderWithSigner(
    params: DCAParams,
    signer: Uint8Array | ((tx: any) => Promise<any>)
  ): Promise<TransactionResult> {
    return this.dca.createDCAOrder(params, signer);
  }

  /**
   * Get DCA account state
   */
  async getDCAAccount(dcaAccountAddress: string): Promise<DCAAccountState | null> {
    return this.dca.getDCAAccount(dcaAccountAddress);
  }

  /**
   * Get all DCA accounts for a user
   */
  async getUserDCAAccounts(userPublicKey: string): Promise<DCAAccountState[]> {
    return this.dca.getUserDCAAccounts(userPublicKey);
  }

  /**
   * Close a DCA account
   */
  async closeDCAAccount(
    dcaAccountAddress: string,
    userPublicKey: string,
    signer: Uint8Array | ((tx: any) => Promise<any>)
  ): Promise<TransactionResult> {
    return this.dca.closeDCAAccount(dcaAccountAddress, userPublicKey, signer);
  }

  /**
   * Create a limit order
   */
  async createLimitOrder(_params: LimitOrderParams): Promise<TransactionResult> {
    // This requires a signer - throw helpful error
    throw new Error(
      'createLimitOrder requires a signer. Use createLimitOrderWithSigner instead.'
    );
  }

  /**
   * Create a limit order with signer
   */
  async createLimitOrderWithSigner(
    params: LimitOrderParams,
    signer: Uint8Array | ((tx: any) => Promise<any>)
  ): Promise<TransactionResult> {
    return this.limitOrders.createLimitOrder(params, signer);
  }

  /**
   * Get limit order state
   */
  async getLimitOrder(orderAddress: string): Promise<LimitOrderState | null> {
    return this.limitOrders.getLimitOrder(orderAddress);
  }

  /**
   * Get all limit orders for a user
   */
  async getUserLimitOrders(userPublicKey: string): Promise<LimitOrderState[]> {
    return this.limitOrders.getUserLimitOrders(userPublicKey);
  }

  /**
   * Cancel a limit order
   */
  async cancelLimitOrder(
    orderAddress: string,
    userPublicKey: string,
    signer: Uint8Array | ((tx: any) => Promise<any>)
  ): Promise<TransactionResult> {
    return this.limitOrders.cancelLimitOrder(orderAddress, userPublicKey, signer);
  }

  /**
   * Get connection instance
   */
  getConnection(): Connection {
    return this.connection;
  }

  /**
   * Get current configuration
   */
  getConfig(): TradingEngineConfig {
    return { ...this.config };
  }

  /**
   * Clear all caches
   */
  clearCaches(): void {
    this.tokenListCache = null;
    this.tokenListCacheTime = 0;
    this.routeMapCache = null;
    this.routeMapCacheTime = 0;
  }
}
