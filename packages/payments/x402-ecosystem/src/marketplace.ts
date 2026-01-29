/**
 * Tool Marketplace for x402-enabled MCP tools
 *
 * Discover and pay for premium MCP tools.
 */

import { z } from "zod";
import type { PaymentToken, PaymentChain } from "@universal-crypto-mcp/payments-shared";

/**
 * Tool listing in the marketplace
 */
export interface ToolListing {
  id: string;
  name: string;
  description: string;
  provider: string;
  providerAddress: `0x${string}`;
  price: string;
  token: PaymentToken;
  chain: PaymentChain;
  category: string;
  rating: number;
  usageCount: number;
  endpoint: string;
}

/**
 * Tool category
 */
export type ToolCategory =
  | "market-data"
  | "trading"
  | "analytics"
  | "social"
  | "development"
  | "ai"
  | "other";

/**
 * Marketplace search filters
 */
export interface MarketplaceFilters {
  category?: ToolCategory;
  maxPrice?: string;
  minRating?: number;
  chain?: PaymentChain;
  token?: PaymentToken;
  provider?: string;
}

/**
 * Tool Marketplace client
 */
export class ToolMarketplace {
  private listings: Map<string, ToolListing> = new Map();
  private purchasedTools: Set<string> = new Set();

  constructor() {
    // Listings are registered by tool providers
  }

  /**
   * Search for tools in the marketplace
   */
  search(filters: MarketplaceFilters = {}): ToolListing[] {
    let results = Array.from(this.listings.values());

    if (filters.category) {
      results = results.filter((t) => t.category === filters.category);
    }

    if (filters.maxPrice) {
      const maxPrice = parseFloat(filters.maxPrice);
      results = results.filter((t) => parseFloat(t.price) <= maxPrice);
    }

    if (filters.minRating) {
      results = results.filter((t) => t.rating >= filters.minRating!);
    }

    if (filters.chain) {
      results = results.filter((t) => t.chain === filters.chain);
    }

    if (filters.token) {
      results = results.filter((t) => t.token === filters.token);
    }

    if (filters.provider) {
      results = results.filter((t) =>
        t.provider.toLowerCase().includes(filters.provider!.toLowerCase())
      );
    }

    return results;
  }

  /**
   * Get a specific tool by ID
   */
  getTool(id: string): ToolListing | undefined {
    return this.listings.get(id);
  }

  /**
   * Get featured tools
   */
  getFeatured(): ToolListing[] {
    return Array.from(this.listings.values())
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 10);
  }

  /**
   * Get tools by category
   */
  getByCategory(category: ToolCategory): ToolListing[] {
    return this.search({ category });
  }

  /**
   * Register a tool purchase
   */
  registerPurchase(toolId: string): void {
    this.purchasedTools.add(toolId);
    
    const tool = this.listings.get(toolId);
    if (tool) {
      tool.usageCount++;
    }
  }

  /**
   * Check if a tool has been purchased
   */
  isPurchased(toolId: string): boolean {
    return this.purchasedTools.has(toolId);
  }

  /**
   * Get all purchased tools
   */
  getPurchasedTools(): ToolListing[] {
    return Array.from(this.purchasedTools)
      .map((id) => this.listings.get(id))
      .filter((t): t is ToolListing => t !== undefined);
  }

  /**
   * Register a new tool in the marketplace
   */
  registerTool(listing: Omit<ToolListing, "id" | "rating" | "usageCount">): string {
    const id = `tool_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    
    this.listings.set(id, {
      ...listing,
      id,
      rating: 0,
      usageCount: 0,
    });

    return id;
  }

}
