/**
 * Marketplace API Backend
 *
 * Provides a marketplace where users can discover and use paid APIs.
 * Supports listings, reviews, stats, and search functionality.
 */

import express from "express";

export interface APIListing {
  id: string;
  name: string;
  description: string;
  owner: `0x${string}`;
  url: string;
  category: string[];
  pricing: {
    model: "per-call" | "subscription" | "credits";
    basePrice: string;
    currency: "USDC" | "USDT" | "DAI";
  };
  stats: {
    totalCalls: number;
    totalRevenue: string;
    rating: number;
    reviews: number;
  };
  verified: boolean;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: string;
  apiId: string;
  reviewer: `0x${string}`;
  rating: number;
  comment: string;
  timestamp: Date;
}

export interface MarketplaceFilters {
  category?: string;
  minRating?: number;
  maxPrice?: string;
  verified?: boolean;
  search?: string;
}

export interface SubmitAPIData {
  name: string;
  description: string;
  owner: `0x${string}`;
  url: string;
  category: string[];
  pricing: APIListing["pricing"];
}

/**
 * Marketplace API class
 *
 * Manages API listings, reviews, and statistics for the marketplace.
 */
export class MarketplaceAPI {
  private listings: Map<string, APIListing> = new Map();
  private reviews: Map<string, Review[]> = new Map();

  /**
   * Submit a new API to the marketplace
   */
  async submitAPI(data: SubmitAPIData): Promise<APIListing> {
    const listing: APIListing = {
      id: `api_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      ...data,
      stats: {
        totalCalls: 0,
        totalRevenue: "0",
        rating: 0,
        reviews: 0,
      },
      verified: false,
      featured: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.listings.set(listing.id, listing);
    return listing;
  }

  /**
   * Get a specific listing by ID
   */
  async getListing(id: string): Promise<APIListing | undefined> {
    return this.listings.get(id);
  }

  /**
   * Get all listings with optional filters
   */
  async getListings(filters?: MarketplaceFilters): Promise<APIListing[]> {
    let results = Array.from(this.listings.values());

    if (filters) {
      if (filters.category) {
        results = results.filter((l) => l.category.includes(filters.category!));
      }
      if (filters.minRating) {
        results = results.filter((l) => l.stats.rating >= filters.minRating!);
      }
      if (filters.verified !== undefined) {
        results = results.filter((l) => l.verified === filters.verified);
      }
      if (filters.maxPrice) {
        const maxPriceNum = parseFloat(filters.maxPrice);
        results = results.filter(
          (l) => parseFloat(l.pricing.basePrice) <= maxPriceNum
        );
      }
      if (filters.search) {
        const term = filters.search.toLowerCase();
        results = results.filter(
          (l) =>
            l.name.toLowerCase().includes(term) ||
            l.description.toLowerCase().includes(term)
        );
      }
    }

    // Sort by featured, then rating, then revenue
    return results.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      if (a.stats.rating !== b.stats.rating) {
        return b.stats.rating - a.stats.rating;
      }
      return parseFloat(b.stats.totalRevenue) - parseFloat(a.stats.totalRevenue);
    });
  }

  /**
   * Submit a review for an API
   */
  async submitReview(
    apiId: string,
    reviewer: `0x${string}`,
    rating: number,
    comment: string
  ): Promise<Review> {
    const review: Review = {
      id: `review_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      apiId,
      reviewer,
      rating: Math.max(1, Math.min(5, rating)), // Clamp 1-5
      comment,
      timestamp: new Date(),
    };

    const existing = this.reviews.get(apiId) || [];
    existing.push(review);
    this.reviews.set(apiId, existing);

    // Update API stats
    const listing = this.listings.get(apiId);
    if (listing) {
      const allReviews = this.reviews.get(apiId) || [];
      const avgRating =
        allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

      listing.stats.rating = avgRating;
      listing.stats.reviews = allReviews.length;
      listing.updatedAt = new Date();
    }

    return review;
  }

  /**
   * Get reviews for an API
   */
  async getReviews(apiId: string): Promise<Review[]> {
    return this.reviews.get(apiId) || [];
  }

  /**
   * Update API stats (called by analytics)
   */
  async updateAPIStats(
    apiId: string,
    calls: number,
    revenue: string
  ): Promise<void> {
    const listing = this.listings.get(apiId);
    if (listing) {
      listing.stats.totalCalls += calls;
      listing.stats.totalRevenue = (
        parseFloat(listing.stats.totalRevenue) + parseFloat(revenue)
      ).toFixed(6);
      listing.updatedAt = new Date();
    }
  }

  /**
   * Verify an API listing (admin function)
   */
  async verifyAPI(apiId: string, verified: boolean): Promise<void> {
    const listing = this.listings.get(apiId);
    if (listing) {
      listing.verified = verified;
      listing.updatedAt = new Date();
    }
  }

  /**
   * Feature an API listing (admin function)
   */
  async featureAPI(apiId: string, featured: boolean): Promise<void> {
    const listing = this.listings.get(apiId);
    if (listing) {
      listing.featured = featured;
      listing.updatedAt = new Date();
    }
  }

  /**
   * Get featured APIs
   */
  async getFeaturedListings(): Promise<APIListing[]> {
    return Array.from(this.listings.values())
      .filter((l) => l.featured)
      .sort((a, b) => b.stats.rating - a.stats.rating);
  }

  /**
   * Get top APIs by revenue
   */
  async getTopByRevenue(limit = 10): Promise<APIListing[]> {
    return Array.from(this.listings.values())
      .sort(
        (a, b) =>
          parseFloat(b.stats.totalRevenue) - parseFloat(a.stats.totalRevenue)
      )
      .slice(0, limit);
  }

  /**
   * Get top APIs by rating
   */
  async getTopByRating(limit = 10): Promise<APIListing[]> {
    return Array.from(this.listings.values())
      .filter((l) => l.stats.reviews >= 5) // Minimum 5 reviews
      .sort((a, b) => b.stats.rating - a.stats.rating)
      .slice(0, limit);
  }

  /**
   * Get categories with counts
   */
  async getCategories(): Promise<{ category: string; count: number }[]> {
    const categoryMap = new Map<string, number>();

    for (const listing of this.listings.values()) {
      for (const category of listing.category) {
        categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
      }
    }

    return Array.from(categoryMap.entries())
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);
  }
}

/**
 * Create Express router for marketplace API
 */
export function createMarketplaceRouter(): express.Router {
  const router = express.Router();
  const marketplace = new MarketplaceAPI();

  // GET /marketplace - List all APIs
  router.get("/", async (req, res) => {
    try {
      const filters: MarketplaceFilters = {
        category: req.query.category as string,
        minRating: req.query.minRating
          ? parseFloat(req.query.minRating as string)
          : undefined,
        maxPrice: req.query.maxPrice as string,
        verified: req.query.verified === "true" ? true : undefined,
        search: req.query.search as string,
      };

      const listings = await marketplace.getListings(filters);
      res.json({ listings, total: listings.length });
    } catch (error) {
      res.status(500).json({ error: String(error) });
    }
  });

  // GET /marketplace/featured - Get featured APIs
  router.get("/featured", async (_req, res) => {
    try {
      const listings = await marketplace.getFeaturedListings();
      res.json({ listings, total: listings.length });
    } catch (error) {
      res.status(500).json({ error: String(error) });
    }
  });

  // GET /marketplace/categories - Get all categories
  router.get("/categories", async (_req, res) => {
    try {
      const categories = await marketplace.getCategories();
      res.json({ categories });
    } catch (error) {
      res.status(500).json({ error: String(error) });
    }
  });

  // GET /marketplace/top/revenue - Get top APIs by revenue
  router.get("/top/revenue", async (req, res) => {
    try {
      const limit = req.query.limit
        ? parseInt(req.query.limit as string, 10)
        : 10;
      const listings = await marketplace.getTopByRevenue(limit);
      res.json({ listings, total: listings.length });
    } catch (error) {
      res.status(500).json({ error: String(error) });
    }
  });

  // GET /marketplace/top/rating - Get top APIs by rating
  router.get("/top/rating", async (req, res) => {
    try {
      const limit = req.query.limit
        ? parseInt(req.query.limit as string, 10)
        : 10;
      const listings = await marketplace.getTopByRating(limit);
      res.json({ listings, total: listings.length });
    } catch (error) {
      res.status(500).json({ error: String(error) });
    }
  });

  // POST /marketplace - Submit new API
  router.post("/", async (req, res) => {
    try {
      const listing = await marketplace.submitAPI(req.body);
      res.status(201).json(listing);
    } catch (error) {
      res.status(400).json({ error: String(error) });
    }
  });

  // GET /marketplace/:id - Get specific API
  router.get("/:id", async (req, res) => {
    try {
      const listing = await marketplace.getListing(req.params.id);

      if (!listing) {
        return res.status(404).json({ error: "API not found" });
      }

      const reviews = await marketplace.getReviews(listing.id);
      res.json({ ...listing, reviews });
    } catch (error) {
      res.status(500).json({ error: String(error) });
    }
  });

  // POST /marketplace/:id/reviews - Submit review
  router.post("/:id/reviews", async (req, res) => {
    try {
      const { reviewer, rating, comment } = req.body;
      const review = await marketplace.submitReview(
        req.params.id,
        reviewer,
        rating,
        comment
      );
      res.status(201).json(review);
    } catch (error) {
      res.status(400).json({ error: String(error) });
    }
  });

  // GET /marketplace/:id/reviews - Get reviews for an API
  router.get("/:id/reviews", async (req, res) => {
    try {
      const reviews = await marketplace.getReviews(req.params.id);
      res.json({ reviews, total: reviews.length });
    } catch (error) {
      res.status(500).json({ error: String(error) });
    }
  });

  // PATCH /marketplace/:id/stats - Update API stats
  router.patch("/:id/stats", async (req, res) => {
    try {
      const { calls, revenue } = req.body;
      await marketplace.updateAPIStats(req.params.id, calls, revenue);
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: String(error) });
    }
  });

  return router;
}

export default MarketplaceAPI;
