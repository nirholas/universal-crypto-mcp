/**
 * Marketplace Migration Example
 *
 * This package demonstrates migrating from x402 to the AI Service Marketplace.
 *
 * Available demos:
 * - before-migration: x402-only API (port 3001)
 * - after-migration: x402 + Marketplace (port 3002)
 * - full-migration: Using MigrationHelper (port 3003)
 *
 * Run with:
 *   pnpm demo:before
 *   pnpm demo:after
 *   pnpm demo:full
 */

export * from "./before-migration.js";
export * from "./after-migration.js";
export * from "./full-migration.js";
