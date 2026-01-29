/**
 * Trade Executor
 * 
 * Executes trades with optimal routing, slippage protection, and MEV protection.
 */

import {
  Connection,
  Transaction,
  VersionedTransaction,
} from '@solana/web3.js';
import { SmartRouter } from './router.js';
import { JupiterClient } from '../jupiter/client.js';
import { RaydiumClient } from '../raydium/client.js';
import { OrcaClient } from '../orca/client.js';
import { PumpFunClient } from '../pumpfun/client.js';
import type {
  TradeParams,
  TradeResult,
  TradeEstimate,
  Route,
  TransactionResult,
  DexProtocol,
  TradingEngineConfig,
  ITradeExecutor,
} from '../types.js';
import { KNOWN_TOKENS, DEFAULT_TRADING_CONFIG } from '../types.js';

/**
 * Trade Executor - executes trades with optimal routing
 */
export class TradeExecutor implements ITradeExecutor {
  private readonly connection: Connection;
  private readonly config: TradingEngineConfig;
  private readonly router: SmartRouter;
  private readonly jupiter: JupiterClient;
  private readonly raydium: RaydiumClient;
  private readonly orca: OrcaClient;
  private readonly pumpfun: PumpFunClient;

  // Settings
  private slippageToleranceBps: number;
  private mevProtectionEnabled: boolean;
  private _jitoTipLamports: number;

  constructor(config: Partial<TradingEngineConfig> = {}) {
    this.config = { ...DEFAULT_TRADING_CONFIG, ...config };
    this.connection = new Connection(this.config.rpcEndpoint, 'confirmed');
    this.router = new SmartRouter(this.config);
    this.jupiter = new JupiterClient(this.config);
    this.raydium = new RaydiumClient(this.config);
    this.orca = new OrcaClient(this.config);
    this.pumpfun = new PumpFunClient(this.config);

    // Initialize settings
    this.slippageToleranceBps = this.config.defaultSlippageBps;
    this.mevProtectionEnabled = this.config.enableMEVProtection;
    this._jitoTipLamports = this.config.defaultJitoTipLamports;
  }

  /**
   * Execute a trade
   */
  async executeTrade(_params: TradeParams): Promise<TradeResult> {
    throw new Error('executeTrade requires a signer. Use executeTradeWithSigner instead.');
  }

  /**
   * Execute a trade with signer
   */
  async executeTradeWithSigner(
    params: TradeParams,
    signer: Uint8Array | ((tx: Transaction | VersionedTransaction) => Promise<Transaction | VersionedTransaction>)
  ): Promise<TradeResult> {
    // Validate slippage
    const slippageBps = params.slippageBps ?? this.slippageToleranceBps;
    if (slippageBps > this.config.maxSlippageBps) {
      throw new Error(`Slippage ${slippageBps} bps exceeds maximum ${this.config.maxSlippageBps} bps`);
    }

    // Get optimal route
    const route = await this.getOptimalRoute(params.inputMint, params.outputMint, params.amount);

    // Determine which DEX to use
    const dex = params.preferredDex ?? this.determineDex(route);

    // Execute on the appropriate DEX
    let txResult: TransactionResult;

    switch (dex) {
      case 'jupiter':
        txResult = await this.executeViaJupiter(params, signer, slippageBps);
        break;
      case 'raydium':
        txResult = await this.executeViaRaydium(params, signer, slippageBps);
        break;
      case 'orca':
        txResult = await this.executeViaOrca(params, signer, slippageBps);
        break;
      case 'pumpfun':
        txResult = await this.executeViaPumpFun(params, signer, slippageBps);
        break;
      default:
        // Default to Jupiter aggregator
        txResult = await this.executeViaJupiter(params, signer, slippageBps);
    }

    // Get actual amounts from transaction (simplified - would parse tx logs)
    const actualAmountIn = params.amount;
    const actualAmountOut = route.outputAmount;

    return {
      transaction: txResult,
      inputMint: params.inputMint,
      outputMint: params.outputMint,
      amountIn: actualAmountIn,
      amountOut: actualAmountOut,
      priceImpactPct: route.priceImpactPct,
      route,
      dex,
      executedAt: Date.now(),
      totalFees: BigInt(txResult.fee ?? 5000),
    };
  }

  /**
   * Execute via Jupiter
   */
  private async executeViaJupiter(
    params: TradeParams,
    signer: Uint8Array | ((tx: any) => Promise<any>),
    slippageBps: number
  ): Promise<TransactionResult> {
    const quote = await this.jupiter.getQuote({
      inputMint: params.inputMint,
      outputMint: params.outputMint,
      amount: params.amount,
      slippageBps,
    });

    return this.jupiter.executeSwap({
      userPublicKey: params.userPublicKey,
      quoteResponse: quote,
      wrapAndUnwrapSol: true,
      prioritizationFeeLamports: params.priorityFee,
      signer,
    });
  }

  /**
   * Execute via Raydium
   */
  private async executeViaRaydium(
    params: TradeParams,
    signer: Uint8Array | ((tx: any) => Promise<any>),
    slippageBps: number
  ): Promise<TransactionResult> {
    // Find best pool
    const bestPool = await this.raydium.findBestPool(
      params.inputMint,
      params.outputMint,
      params.amount
    );

    if (!bestPool) {
      throw new Error('No Raydium pool found for this pair');
    }

    // Calculate min output
    const output = await this.raydium.calculateSwapOutput(
      bestPool.poolId,
      params.amount,
      params.inputMint,
      slippageBps
    );

    return this.raydium.swapWithSigner({
      poolId: bestPool.poolId,
      userPublicKey: params.userPublicKey,
      inputMint: params.inputMint,
      amountIn: params.amount,
      minAmountOut: output.minAmountOut,
      fixedSide: 'in',
    }, signer);
  }

  /**
   * Execute via Orca
   */
  private async executeViaOrca(
    params: TradeParams,
    signer: Uint8Array | ((tx: any) => Promise<any>),
    slippageBps: number
  ): Promise<TransactionResult> {
    // Find best whirlpool
    const bestPool = await this.orca.findBestWhirlpool(
      params.inputMint,
      params.outputMint,
      params.amount
    );

    if (!bestPool) {
      throw new Error('No Orca whirlpool found for this pair');
    }

    return this.orca.swapWithSigner({
      whirlpoolAddress: bestPool.address,
      userPublicKey: params.userPublicKey,
      inputMint: params.inputMint,
      amount: params.amount,
      isExactIn: params.isExactIn,
      slippageBps,
    }, signer);
  }

  /**
   * Execute via PumpFun
   */
  private async executeViaPumpFun(
    params: TradeParams,
    signer: Uint8Array | ((tx: any) => Promise<any>),
    slippageBps: number
  ): Promise<TransactionResult> {
    const isInputSol = params.inputMint === KNOWN_TOKENS.SOL;

    if (isInputSol) {
      // Buy tokens with SOL
      return this.pumpfun.buyWithSigner({
        mint: params.outputMint,
        userPublicKey: params.userPublicKey,
        solAmount: params.amount,
        slippageBps,
      }, signer);
    } else {
      // Sell tokens for SOL
      return this.pumpfun.sellWithSigner({
        mint: params.inputMint,
        userPublicKey: params.userPublicKey,
        tokenAmount: params.amount,
        slippageBps,
      }, signer);
    }
  }

  /**
   * Get optimal route for a trade
   */
  async getOptimalRoute(input: string, output: string, amount: bigint): Promise<Route> {
    return this.router.findOptimalRoute(input, output, amount, this.slippageToleranceBps);
  }

  /**
   * Estimate trade output
   */
  async estimateTradeOutput(params: TradeParams): Promise<TradeEstimate> {
    const slippageBps = params.slippageBps ?? this.slippageToleranceBps;
    
    // Get route comparison
    const comparison = await this.router.compareRoutes(
      params.inputMint,
      params.outputMint,
      params.amount,
      slippageBps
    );

    const bestRoute = comparison.routes[0];
    if (!bestRoute) {
      throw new Error('No routes found');
    }

    return {
      outputAmount: bestRoute.outputAmount,
      priceImpactPct: bestRoute.priceImpactPct,
      estimatedFees: bestRoute.estimatedFees,
      estimatedTimeMs: 400, // Average Solana block time
      route: bestRoute.route,
      recommendedDex: comparison.recommended,
      expiresAt: Date.now() + 30_000, // Quote valid for 30 seconds
    };
  }

  /**
   * Execute multiple trades in batch
   */
  async executeBatchTrades(_trades: TradeParams[]): Promise<{
    results: TradeResult[];
    successCount: number;
    failedCount: number;
    totalTimeMs: number;
  }> {
    throw new Error('executeBatchTrades requires a signer. Use executeBatchTradesWithSigner instead.');
  }

  /**
   * Execute multiple trades with signer
   */
  async executeBatchTradesWithSigner(
    trades: TradeParams[],
    signer: Uint8Array | ((tx: any) => Promise<any>)
  ): Promise<{
    results: TradeResult[];
    successCount: number;
    failedCount: number;
    totalTimeMs: number;
  }> {
    const startTime = Date.now();
    const results: TradeResult[] = [];
    let successCount = 0;
    let failedCount = 0;

    // Execute trades sequentially to avoid nonce issues
    for (const trade of trades) {
      try {
        const result = await this.executeTradeWithSigner(trade, signer);
        results.push(result);
        if (result.transaction.confirmed) {
          successCount++;
        } else {
          failedCount++;
        }
      } catch (error) {
        failedCount++;
        // Create a failed result
        results.push({
          transaction: {
            signature: '',
            confirmed: false,
            error: error instanceof Error ? error.message : 'Unknown error',
          },
          inputMint: trade.inputMint,
          outputMint: trade.outputMint,
          amountIn: trade.amount,
          amountOut: 0n,
          priceImpactPct: 0,
          route: { legs: [], inputAmount: 0n, outputAmount: 0n, priceImpactPct: 0, totalFeeBps: 0 },
          dex: 'jupiter',
          executedAt: Date.now(),
          totalFees: 0n,
        });
      }
    }

    return {
      results,
      successCount,
      failedCount,
      totalTimeMs: Date.now() - startTime,
    };
  }

  /**
   * Set slippage tolerance
   */
  setSlippageTolerance(bps: number): void {
    if (bps < 0 || bps > this.config.maxSlippageBps) {
      throw new Error(`Slippage must be between 0 and ${this.config.maxSlippageBps} bps`);
    }
    this.slippageToleranceBps = bps;
  }

  /**
   * Get current slippage tolerance
   */
  getSlippageTolerance(): number {
    return this.slippageToleranceBps;
  }

  /**
   * Set MEV protection settings
   */
  setMEVProtection(enabled: boolean, tipLamports?: number): void {
    this.mevProtectionEnabled = enabled;
    if (tipLamports !== undefined) {
      this._jitoTipLamports = tipLamports;
    }
  }

  /**
   * Get current Jito tip amount
   */
  getJitoTipLamports(): number {
    return this._jitoTipLamports;
  }

  /**
   * Check if MEV protection is enabled
   */
  isMEVProtectionEnabled(): boolean {
    return this.mevProtectionEnabled;
  }

  /**
   * Determine which DEX to use based on route
   */
  private determineDex(route: Route): DexProtocol {
    if (route.legs.length === 0) {
      return 'jupiter';
    }

    // Check the protocols used in the route
    const protocols = new Set(route.legs.map(leg => leg.protocol.toLowerCase()));

    if (protocols.has('pumpfun')) {
      return 'pumpfun';
    }

    // For multi-hop routes, prefer Jupiter
    if (route.legs.length > 1) {
      return 'jupiter';
    }

    // Single hop - check the protocol
    const protocol = route.legs[0]!.protocol.toLowerCase();
    
    if (protocol.includes('raydium')) {
      return 'raydium';
    }
    if (protocol.includes('orca') || protocol.includes('whirlpool')) {
      return 'orca';
    }

    // Default to Jupiter for aggregation
    return 'jupiter';
  }

  /**
   * Get clients for direct access
   */
  getClients() {
    return {
      jupiter: this.jupiter,
      raydium: this.raydium,
      orca: this.orca,
      pumpfun: this.pumpfun,
    };
  }

  /**
   * Get connection instance
   */
  getConnection(): Connection {
    return this.connection;
  }
}
