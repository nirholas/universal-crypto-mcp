/**
 * x402 Marketplace Module
 *
 * This module provides the marketplace functionality for discovering and
 * listing paid APIs. Features include:
 * - API listings with categories and pricing
 * - Review and rating system
 * - Statistics and analytics
 * - Express router for API endpoints
 *
 * @example
 * ```typescript
 * import {
 *   MarketplaceAPI,
 *   createMarketplaceRouter,
 * } from "x402-deploy/marketplace";
 *
 * // Use programmatically
 * const marketplace = new MarketplaceAPI();
 * const listing = await marketplace.submitAPI({
 *   name: "My API",
 *   description: "A great API",
 *   owner: "0x1234...",
 *   url: "https://api.example.com",
 *   category: ["AI/ML"],
 *   pricing: { model: "per-call", basePrice: "0.001", currency: "USDC" }
 * });
 *
 * // Use with Express
 * import express from "express";
 * const app = express();
 * app.use("/marketplace", createMarketplaceRouter());
 * ```
 */

export {
  MarketplaceAPI,
  createMarketplaceRouter,
  type APIListing,
  type Review,
  type MarketplaceFilters,
  type SubmitAPIData,
} from "./api.js";
