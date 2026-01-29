/**
 * Smart Order Router
 * 
 * Determines the optimal execution path for trades across multiple DEXs.
 */

import type {
  Route,
  RouteLeg,
  DexProtocol,
  TradingEngineConfig,
  QuoteResponse,
} from '../types.js';
import { KNOWN_TOKENS } from '../types.js';
import { JupiterClient } from '../jupiter/client.js';
import { RaydiumClient } from '../raydium/client.js';
import { OrcaClient } from '../orca/client.js';
import { PumpFunClient } from '../pumpfun/client.js';

/**
 * Route option from a single DEX
 */
interface RouteOption {
  dex: DexProtocol;
  outputAmount: bigint;
  priceImpactPct: number;
  route: Route;
  estimatedFees: bigint;
}

/**
 * Smart Order Router - finds optimal execution paths
 */
export class SmartRouter {
  private readonly jupiter: JupiterClient;
  private readonly raydium: RaydiumClient;
  private readonly orca: OrcaClient;
  private readonly pumpfun: PumpFunClient;

  constructor(config: TradingEngineConfig) {
    this.jupiter = new JupiterClient(config);
    this.raydium = new RaydiumClient(config);
    this.orca = new OrcaClient(config);
    this.pumpfun = new PumpFunClient(config);
  }

  /**
   * Find the optimal route for a trade
   */
  async findOptimalRoute(
    inputMint: string,
    outputMint: string,
    amount: bigint,
    slippageBps: number = 100
  ): Promise<Route> {
    // Get routes from all available DEXs in parallel
    const routeOptions = await this.getRouteOptions(inputMint, outputMint, amount, slippageBps);

    if (routeOptions.length === 0) {
      throw new Error(`No routes found for ${inputMint} -> ${outputMint}`);
    }

    // Find the best route (highest output)
    const bestOption = routeOptions.reduce((best, current) =>
      current.outputAmount > best.outputAmount ? current : best
    );

    return bestOption.route;
  }

  /**
   * Get route options from all DEXs
   */
  async getRouteOptions(
    inputMint: string,
    outputMint: string,
    amount: bigint,
    slippageBps: number
  ): Promise<RouteOption[]> {
    const routePromises: Promise<RouteOption | null>[] = [];

    // Always try Jupiter (aggregator)
    routePromises.push(this.getJupiterRoute(inputMint, outputMint, amount, slippageBps));

    // Check if this might be a PumpFun token
    const isPumpFunToken = await this.isPumpFunToken(inputMint) || 
                           await this.isPumpFunToken(outputMint);
    if (isPumpFunToken) {
      routePromises.push(this.getPumpFunRoute(inputMint, outputMint, amount, slippageBps));
    }

    // Try Raydium direct
    routePromises.push(this.getRaydiumRoute(inputMint, outputMint, amount, slippageBps));

    // Try Orca direct
    routePromises.push(this.getOrcaRoute(inputMint, outputMint, amount, slippageBps));

    // Execute all route searches in parallel
    const results = await Promise.allSettled(routePromises);

    // Filter successful results
    const validRoutes: RouteOption[] = [];
    for (const result of results) {
      if (result.status === 'fulfilled' && result.value !== null) {
        validRoutes.push(result.value);
      }
    }

    return validRoutes;
  }

  /**
   * Get route from Jupiter
   */
  private async getJupiterRoute(
    inputMint: string,
    outputMint: string,
    amount: bigint,
    slippageBps: number
  ): Promise<RouteOption | null> {
    try {
      const quote = await this.jupiter.getQuote({
        inputMint,
        outputMint,
        amount,
        slippageBps,
      });

      const route = this.jupiterQuoteToRoute(quote);

      return {
        dex: 'jupiter',
        outputAmount: BigInt(quote.outAmount),
        priceImpactPct: parseFloat(quote.priceImpactPct),
        route,
        estimatedFees: 5000n, // Base transaction fee
      };
    } catch {
      return null;
    }
  }

  /**
   * Get route from Raydium
   */
  private async getRaydiumRoute(
    inputMint: string,
    outputMint: string,
    amount: bigint,
    slippageBps: number
  ): Promise<RouteOption | null> {
    try {
      const bestPool = await this.raydium.findBestPool(inputMint, outputMint, amount);
      if (!bestPool) return null;

      const output = await this.raydium.calculateSwapOutput(
        bestPool.poolId,
        amount,
        inputMint,
        slippageBps
      );

      const route: Route = {
        legs: [{
          inputMint,
          outputMint,
          amountIn: amount,
          amountOut: output.amountOut,
          protocol: `raydium-${bestPool.poolType.toLowerCase()}`,
          poolAddress: bestPool.poolId,
          feeBps: 25, // Typical Raydium fee
        }],
        inputAmount: amount,
        outputAmount: output.amountOut,
        priceImpactPct: output.priceImpact,
        totalFeeBps: 25,
      };

      return {
        dex: 'raydium',
        outputAmount: output.amountOut,
        priceImpactPct: output.priceImpact,
        route,
        estimatedFees: 5000n,
      };
    } catch {
      return null;
    }
  }

  /**
   * Get route from Orca
   */
  private async getOrcaRoute(
    inputMint: string,
    outputMint: string,
    amount: bigint,
    slippageBps: number
  ): Promise<RouteOption | null> {
    try {
      const bestPool = await this.orca.findBestWhirlpool(inputMint, outputMint, amount);
      if (!bestPool) return null;

      const output = await this.orca.calculateSwapOutput(
        bestPool.address,
        amount,
        inputMint,
        true,
        slippageBps
      );

      const route: Route = {
        legs: [{
          inputMint,
          outputMint,
          amountIn: amount,
          amountOut: output.amountOut,
          protocol: 'orca-whirlpool',
          poolAddress: bestPool.address,
          feeBps: bestPool.feeRate / 100, // Convert from hundredths of bp
        }],
        inputAmount: amount,
        outputAmount: output.amountOut,
        priceImpactPct: output.priceImpact,
        totalFeeBps: bestPool.feeRate / 100,
      };

      return {
        dex: 'orca',
        outputAmount: output.amountOut,
        priceImpactPct: output.priceImpact,
        route,
        estimatedFees: 5000n,
      };
    } catch {
      return null;
    }
  }

  /**
   * Get route from PumpFun
   */
  private async getPumpFunRoute(
    inputMint: string,
    outputMint: string,
    amount: bigint,
    _slippageBps: number
  ): Promise<RouteOption | null> {
    try {
      // PumpFun only supports SOL <-> Token trades
      const isInputSol = inputMint === KNOWN_TOKENS.SOL;
      const isOutputSol = outputMint === KNOWN_TOKENS.SOL;

      if (!isInputSol && !isOutputSol) {
        return null; // PumpFun doesn't support token-to-token
      }

      const tokenMint = isInputSol ? outputMint : inputMint;

      // Check if it's a PumpFun token and not migrated
      const isMigrated = await this.pumpfun.isMigrated(tokenMint);
      if (isMigrated) return null;

      let outputAmount: bigint;
      let priceImpact: number;

      if (isInputSol) {
        const output = await this.pumpfun.calculateBuyOutput(tokenMint, amount);
        outputAmount = output.tokenAmount;
        priceImpact = output.priceImpact;
      } else {
        const output = await this.pumpfun.calculateSellOutput(tokenMint, amount);
        outputAmount = output.solAmount;
        priceImpact = output.priceImpact;
      }

      const state = await this.pumpfun.getBondingCurveState(tokenMint);

      const route: Route = {
        legs: [{
          inputMint,
          outputMint,
          amountIn: amount,
          amountOut: outputAmount,
          protocol: 'pumpfun',
          poolAddress: state.address,
          feeBps: 100, // 1% PumpFun fee
        }],
        inputAmount: amount,
        outputAmount,
        priceImpactPct: priceImpact,
        totalFeeBps: 100,
      };

      return {
        dex: 'pumpfun',
        outputAmount,
        priceImpactPct: priceImpact,
        route,
        estimatedFees: 5000n,
      };
    } catch {
      return null;
    }
  }

  /**
   * Convert Jupiter quote to Route
   */
  private jupiterQuoteToRoute(quote: QuoteResponse): Route {
    const legs: RouteLeg[] = quote.routePlan.map(step => ({
      inputMint: step.swapInfo.inputMint,
      outputMint: step.swapInfo.outputMint,
      amountIn: BigInt(step.swapInfo.inAmount),
      amountOut: BigInt(step.swapInfo.outAmount),
      protocol: step.swapInfo.label,
      poolAddress: step.swapInfo.ammKey,
      feeBps: Math.round(Number(step.swapInfo.feeAmount) * 10000 / Number(step.swapInfo.inAmount)),
    }));

    // Calculate total fees
    const totalFeeBps = legs.reduce((sum, leg) => sum + leg.feeBps, 0);

    return {
      legs,
      inputAmount: BigInt(quote.inAmount),
      outputAmount: BigInt(quote.outAmount),
      priceImpactPct: parseFloat(quote.priceImpactPct),
      totalFeeBps,
    };
  }

  /**
   * Check if a token is a PumpFun token
   */
  private async isPumpFunToken(mint: string): Promise<boolean> {
    // Skip known tokens
    if (Object.values(KNOWN_TOKENS).includes(mint as any)) {
      return false;
    }

    try {
      await this.pumpfun.getBondingCurveState(mint);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get recommended DEX for a trade
   */
  async getRecommendedDex(
    inputMint: string,
    outputMint: string,
    amount: bigint
  ): Promise<DexProtocol> {
    const routes = await this.getRouteOptions(inputMint, outputMint, amount, 100);
    
    if (routes.length === 0) {
      return 'jupiter'; // Default to aggregator
    }

    // Find best route
    const best = routes.reduce((best, current) =>
      current.outputAmount > best.outputAmount ? current : best
    );

    return best.dex;
  }

  /**
   * Compare routes from different DEXs
   */
  async compareRoutes(
    inputMint: string,
    outputMint: string,
    amount: bigint,
    slippageBps: number = 100
  ): Promise<{
    routes: RouteOption[];
    recommended: DexProtocol;
    savings: {
      dex: DexProtocol;
      extraOutput: bigint;
      extraOutputPercent: number;
    } | null;
  }> {
    const routes = await this.getRouteOptions(inputMint, outputMint, amount, slippageBps);

    if (routes.length === 0) {
      throw new Error('No routes found');
    }

    // Sort by output amount (descending)
    routes.sort((a, b) => Number(b.outputAmount - a.outputAmount));

    const best = routes[0]!;
    const worst = routes[routes.length - 1]!;

    let savings = null;
    if (routes.length > 1 && best.outputAmount > worst.outputAmount) {
      const extraOutput = best.outputAmount - worst.outputAmount;
      const extraOutputPercent = Number(extraOutput * 10000n / worst.outputAmount) / 100;
      savings = {
        dex: best.dex,
        extraOutput,
        extraOutputPercent,
      };
    }

    return {
      routes,
      recommended: best.dex,
      savings,
    };
  }
}
