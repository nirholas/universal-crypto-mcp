/**
 * Cross-chain bridge utilities for stablecoins
 *
 * Enables bridging stablecoins between chains for x402 payments.
 */

import { z } from "zod";
import type { PaymentChain, PaymentToken } from "@universal-crypto-mcp/payments-shared";

/**
 * Bridge quote
 */
export interface BridgeQuote {
  sourceChain: PaymentChain;
  destChain: PaymentChain;
  token: PaymentToken;
  amountIn: string;
  amountOut: string;
  fee: string;
  estimatedTime: number; // seconds
  route: string;
}

/**
 * Bridge transaction
 */
export interface BridgeTransaction {
  id: string;
  quote: BridgeQuote;
  status: "pending" | "bridging" | "completed" | "failed";
  sourceTxHash?: string;
  destTxHash?: string;
  startedAt: number;
  completedAt?: number;
}

/**
 * Supported bridge routes with real provider data
 * Note: Times and fees are estimates and vary based on network conditions
 */
export const BRIDGE_ROUTES: Array<{
  source: PaymentChain;
  dest: PaymentChain;
  provider: string;
  avgTime: number;
  avgFee: string;
}> = [
  { source: "ethereum", dest: "arbitrum", provider: "Arbitrum Bridge", avgTime: 600, avgFee: "0" }, // Official bridge, variable gas
  { source: "ethereum", dest: "optimism", provider: "Optimism Bridge", avgTime: 600, avgFee: "0" }, // Official bridge, variable gas
  { source: "ethereum", dest: "base", provider: "Base Bridge", avgTime: 600, avgFee: "0" }, // Official bridge, variable gas
  { source: "ethereum", dest: "polygon", provider: "Polygon PoS Bridge", avgTime: 1800, avgFee: "0" }, // Official bridge, variable gas
  { source: "arbitrum", dest: "ethereum", provider: "Arbitrum Bridge", avgTime: 604800, avgFee: "0" }, // 7 day challenge period
  { source: "arbitrum", dest: "base", provider: "Across Protocol", avgTime: 120, avgFee: "0" }, // Fee varies by liquidity
  { source: "base", dest: "arbitrum", provider: "Across Protocol", avgTime: 120, avgFee: "0" }, // Fee varies by liquidity
  { source: "optimism", dest: "base", provider: "Across Protocol", avgTime: 120, avgFee: "0" }, // Fee varies by liquidity
];

/**
 * Stablecoin Bridge Client
 */
export class StablecoinBridge {
  private pendingTransactions: Map<string, BridgeTransaction> = new Map();

  /**
   * Get quote for bridging stablecoins
   */
  async getQuote(
    sourceChain: PaymentChain,
    destChain: PaymentChain,
    token: PaymentToken,
    amount: string
  ): Promise<BridgeQuote | null> {
    const route = BRIDGE_ROUTES.find(
      (r) => r.source === sourceChain && r.dest === destChain
    );

    if (!route) {
      return null;
    }

    const amountNum = parseFloat(amount);
    const feeNum = parseFloat(route.avgFee);
    const amountOut = amountNum - feeNum;

    return {
      sourceChain,
      destChain,
      token,
      amountIn: amount,
      amountOut: amountOut.toFixed(6),
      fee: route.avgFee,
      estimatedTime: route.avgTime,
      route: route.provider,
    };
  }

  /**
   * Get all available routes from a source chain
   */
  getRoutesFrom(sourceChain: PaymentChain): typeof BRIDGE_ROUTES {
    return BRIDGE_ROUTES.filter((r) => r.source === sourceChain);
  }

  /**
   * Get all available routes to a destination chain
   */
  getRoutesTo(destChain: PaymentChain): typeof BRIDGE_ROUTES {
    return BRIDGE_ROUTES.filter((r) => r.dest === destChain);
  }

  /**
   * Initiate a bridge transaction (simulation)
   */
  async initiateBridge(quote: BridgeQuote): Promise<BridgeTransaction> {
    const id = `bridge_${Date.now()}_${Math.random().toString(36).slice(2)}`;

    const transaction: BridgeTransaction = {
      id,
      quote,
      status: "pending",
      startedAt: Date.now(),
    };

    this.pendingTransactions.set(id, transaction);

    // In production, this would initiate the actual bridge
    return transaction;
  }

  /**
   * Get transaction status
   */
  getTransaction(id: string): BridgeTransaction | undefined {
    return this.pendingTransactions.get(id);
  }

  /**
   * Get all pending transactions
   */
  getPendingTransactions(): BridgeTransaction[] {
    return Array.from(this.pendingTransactions.values()).filter(
      (t) => t.status === "pending" || t.status === "bridging"
    );
  }

  /**
   * Find cheapest route between chains
   */
  findCheapestRoute(
    sourceChain: PaymentChain,
    destChain: PaymentChain
  ): typeof BRIDGE_ROUTES[0] | null {
    const routes = BRIDGE_ROUTES.filter(
      (r) => r.source === sourceChain && r.dest === destChain
    );

    if (routes.length === 0) {
      return null;
    }

    return routes.reduce((cheapest, route) =>
      parseFloat(route.avgFee) < parseFloat(cheapest.avgFee) ? route : cheapest
    );
  }

  /**
   * Find fastest route between chains
   */
  findFastestRoute(
    sourceChain: PaymentChain,
    destChain: PaymentChain
  ): typeof BRIDGE_ROUTES[0] | null {
    const routes = BRIDGE_ROUTES.filter(
      (r) => r.source === sourceChain && r.dest === destChain
    );

    if (routes.length === 0) {
      return null;
    }

    return routes.reduce((fastest, route) =>
      route.avgTime < fastest.avgTime ? route : fastest
    );
  }
}
