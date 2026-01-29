/**
 * Pricing Engine for x402-deploy
 * 
 * @module gateway/pricing-engine
 * @description Dynamic pricing engine with support for flat, tiered, and load-based pricing
 */

import type { 
  Network,
  Price,
  PricingConfig, 
  PricingTier, 
  DynamicPricing,
  PaymentRecord 
} from "./types.js";

/**
 * Parse a price string (e.g., "$0.001", "0.001 USDC") to a normalized value
 */
export function parsePrice(price: string): { value: number; currency: string } {
  // Handle dollar notation: $0.001, $1.50
  if (price.startsWith("$")) {
    const value = parseFloat(price.slice(1));
    return { value, currency: "USD" };
  }

  // Handle token notation: 0.001 USDC, 1000000 wei
  const match = price.match(/^([\d.]+)\s*(\w+)?$/);
  if (match) {
    const value = parseFloat(match[1]);
    const currency = match[2]?.toUpperCase() || "USD";
    return { value, currency };
  }

  throw new Error(`Invalid price format: ${price}`);
}

/**
 * Format a price value back to string
 */
export function formatPrice(value: number, currency: string = "USD"): string {
  if (currency === "USD") {
    return `$${value.toFixed(6)}`;
  }
  return `${value} ${currency}`;
}

/**
 * Convert price to x402 format (asset amount in wei/smallest unit)
 */
export function priceToX402Format(price: string, decimals: number = 6): Price {
  const { value, currency } = parsePrice(price);
  
  // Convert to smallest unit (e.g., 6 decimals for USDC)
  const amount = Math.floor(value * Math.pow(10, decimals)).toString();
  
  return {
    asset: currency === "USD" ? "USDC" : currency,
    amount,
  };
}

/**
 * Pricing Engine for dynamic price calculation
 */
export class PricingEngine {
  private basePricing: PricingConfig;
  private dynamicPricing: Map<string, DynamicPricing> = new Map();
  private payerHistory: Map<string, PaymentRecord[]> = new Map();
  private currentLoad: number = 0;

  constructor(pricing: PricingConfig) {
    this.basePricing = pricing;
  }

  /**
   * Set dynamic pricing configuration for a route
   */
  setDynamicPricing(route: string, config: DynamicPricing): void {
    this.dynamicPricing.set(route, config);
  }

  /**
   * Get dynamic pricing configuration for a route
   */
  getDynamicPricing(route: string): DynamicPricing | undefined {
    return this.dynamicPricing.get(route);
  }

  /**
   * Update current load factor (0-1 scale)
   */
  updateLoad(load: number): void {
    this.currentLoad = Math.max(0, Math.min(1, load));
  }

  /**
   * Record a payment for volume tracking
   */
  recordPayment(payer: string, record: PaymentRecord): void {
    const history = this.payerHistory.get(payer) || [];
    history.push(record);
    this.payerHistory.set(payer, history);
  }

  /**
   * Get payment history for a payer
   */
  getPayerHistory(payer: string): PaymentRecord[] {
    return this.payerHistory.get(payer) || [];
  }

  /**
   * Get payment count for a payer on a specific route
   */
  getPayerRequestCount(payer: string, route?: string): number {
    const history = this.payerHistory.get(payer) || [];
    if (route) {
      return history.filter(p => p.route === route).length;
    }
    return history.length;
  }

  /**
   * Calculate price for a route, considering dynamic pricing
   */
  calculatePrice(route: string, payer?: string): string {
    const basePrice = this.basePricing[route];
    if (!basePrice) {
      throw new Error(`No pricing configured for route: ${route}`);
    }

    const dynamicConfig = this.dynamicPricing.get(route);
    if (!dynamicConfig) {
      return basePrice;
    }

    let { value, currency } = parsePrice(dynamicConfig.basePrice);

    // Apply volume-based tiered pricing
    if (dynamicConfig.tiers && payer) {
      const requestCount = this.getPayerRequestCount(payer, route);
      const tier = this.findTier(dynamicConfig.tiers, requestCount);
      if (tier) {
        const tierPrice = parsePrice(tier.price);
        value = tierPrice.value;
        currency = tierPrice.currency;
      }
    }

    // Apply load-based multiplier
    if (dynamicConfig.loadMultiplier !== undefined) {
      const loadFactor = 1 + (this.currentLoad * (dynamicConfig.loadMultiplier - 1));
      value *= loadFactor;
    }

    // Apply time-based pricing
    if (dynamicConfig.timePricing) {
      const currentHour = new Date().getUTCHours();
      if (dynamicConfig.timePricing.peakHours.includes(currentHour)) {
        value *= dynamicConfig.timePricing.peakMultiplier;
      }
    }

    return formatPrice(value, currency);
  }

  /**
   * Find the applicable pricing tier based on request count
   */
  private findTier(tiers: PricingTier[], requestCount: number): PricingTier | undefined {
    // Sort tiers by minRequests descending
    const sortedTiers = [...tiers].sort((a, b) => b.minRequests - a.minRequests);
    
    for (const tier of sortedTiers) {
      if (requestCount >= tier.minRequests) {
        if (tier.maxRequests === undefined || requestCount <= tier.maxRequests) {
          return tier;
        }
      }
    }

    return undefined;
  }

  /**
   * Get price for a route (simple lookup without dynamic calculation)
   */
  getPrice(route: string): string | undefined {
    return this.basePricing[route];
  }

  /**
   * Check if a route has pricing configured
   */
  hasPrice(route: string): boolean {
    return route in this.basePricing;
  }

  /**
   * Get all configured routes with their base prices
   */
  getAllPrices(): PricingConfig {
    return { ...this.basePricing };
  }

  /**
   * Add or update pricing for a route
   */
  setPrice(route: string, price: string): void {
    // Validate price format
    parsePrice(price);
    this.basePricing[route] = price;
  }

  /**
   * Remove pricing for a route
   */
  removePrice(route: string): void {
    delete this.basePricing[route];
    this.dynamicPricing.delete(route);
  }

  /**
   * Convert pricing config to x402 routes config
   */
  toX402Routes(
    wallet: string, 
    network: Network,
    options?: { 
      maxTimeoutSeconds?: number;
      decimals?: number;
    }
  ): Record<string, { accepts: { scheme: string; payTo: string; price: Price; network: Network; maxTimeoutSeconds?: number } }> {
    const routes: Record<string, { 
      accepts: { 
        scheme: string; 
        payTo: string; 
        price: Price; 
        network: Network; 
        maxTimeoutSeconds?: number;
      } 
    }> = {};

    for (const [route, priceStr] of Object.entries(this.basePricing)) {
      const price = priceToX402Format(priceStr, options?.decimals);
      routes[route] = {
        accepts: {
          scheme: "exact",
          payTo: wallet,
          price,
          network,
          ...(options?.maxTimeoutSeconds && { maxTimeoutSeconds: options.maxTimeoutSeconds }),
        },
      };
    }

    return routes;
  }

  /**
   * Validate all configured prices
   */
  validatePrices(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    for (const [route, price] of Object.entries(this.basePricing)) {
      try {
        const parsed = parsePrice(price);
        if (parsed.value < 0) {
          errors.push(`Route "${route}" has negative price: ${price}`);
        }
        if (parsed.value === 0) {
          errors.push(`Route "${route}" has zero price: ${price}`);
        }
      } catch (e) {
        errors.push(`Route "${route}" has invalid price format: ${price}`);
      }
    }

    return { valid: errors.length === 0, errors };
  }

  /**
   * Clear payer history (useful for testing or memory management)
   */
  clearHistory(): void {
    this.payerHistory.clear();
  }

  /**
   * Export pricing statistics
   */
  getStats(): {
    totalRoutes: number;
    dynamicRoutes: number;
    uniquePayers: number;
    totalPayments: number;
  } {
    let totalPayments = 0;
    for (const history of this.payerHistory.values()) {
      totalPayments += history.length;
    }

    return {
      totalRoutes: Object.keys(this.basePricing).length,
      dynamicRoutes: this.dynamicPricing.size,
      uniquePayers: this.payerHistory.size,
      totalPayments,
    };
  }
}

/**
 * Create a pricing engine from a pricing configuration
 */
export function createPricingEngine(pricing: PricingConfig): PricingEngine {
  return new PricingEngine(pricing);
}
