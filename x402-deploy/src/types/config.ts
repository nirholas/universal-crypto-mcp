import { z } from "zod";

/**
 * Supported deployment providers
 */
export const DeployProviderSchema = z.enum([
  "railway",
  "fly",
  "vercel",
  "docker",
  "self-hosted",
]);
export type DeployProvider = z.infer<typeof DeployProviderSchema>;

/**
 * Supported blockchain networks (CAIP-2 format)
 */
export const NetworkSchema = z.enum([
  "eip155:1",        // Ethereum Mainnet
  "eip155:42161",    // Arbitrum One
  "eip155:8453",     // Base
  "eip155:84532",    // Base Sepolia (testnet)
  "eip155:137",      // Polygon
  "eip155:10",       // Optimism
  "eip155:56",       // BSC
  "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp",  // Solana Mainnet
  "solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1",  // Solana Devnet
]);
export type Network = z.infer<typeof NetworkSchema>;

/**
 * Pricing model types
 */
export const PricingModelSchema = z.enum([
  "per-call",      // Charge per API call
  "subscription",  // Monthly/yearly subscription
  "tiered",        // Volume-based pricing
  "dynamic",       // Dynamic pricing based on usage
]);
export type PricingModel = z.infer<typeof PricingModelSchema>;

/**
 * Route pricing configuration
 */
export const RoutePricingSchema = z.union([
  z.string(), // Simple price like "$0.01"
  z.object({
    price: z.string(),
    currency: z.string().optional(),
    description: z.string().optional(),
    rateLimit: z.object({
      requests: z.number(),
      window: z.string(),
    }).optional(),
    premium: z.boolean().optional(),
    route: z.string().optional(),
  }),
]);
export type RoutePricing = z.infer<typeof RoutePricingSchema>;

/**
 * Payment configuration
 */
export const PaymentConfigSchema = z.object({
  wallet: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid EVM address"),
  network: NetworkSchema,
  token: z.string().default("USDC"),
  facilitator: z.string().url().optional(),
});
export type PaymentConfig = z.infer<typeof PaymentConfigSchema>;

/**
 * Pricing configuration
 */
export const PricingConfigSchema = z.object({
  model: PricingModelSchema.default("per-call"),
  default: z.string().optional(), // Default price for unlisted routes
  routes: z.record(z.string(), RoutePricingSchema).optional(),
});
export type PricingConfig = z.infer<typeof PricingConfigSchema>;

/**
 * Discovery configuration for x402scan
 */
export const DiscoveryConfigSchema = z.object({
  enabled: z.boolean().default(true),
  autoRegister: z.boolean().default(true),
  instructions: z.string().optional(),
  ownershipProofs: z.array(z.string()).optional(),
});
export type DiscoveryConfig = z.infer<typeof DiscoveryConfigSchema>;

/**
 * Deployment configuration
 */
export const DeployConfigSchema = z.object({
  provider: DeployProviderSchema.default("railway"),
  region: z.string().optional(),
  domain: z.string().optional(),
  scaling: z.object({
    min: z.number().default(1),
    max: z.number().default(10),
    targetCPU: z.number().default(80),
  }).optional(),
  env: z.record(z.string(), z.string()).optional(),
});
export type DeployConfig = z.infer<typeof DeployConfigSchema>;

/**
 * Webhook configuration
 */
export const WebhookConfigSchema = z.object({
  url: z.string().url(),
  secret: z.string().optional(),
  events: z.array(z.string()).optional(),
});
export type WebhookConfig = z.infer<typeof WebhookConfigSchema>;

/**
 * Dashboard configuration
 */
export const DashboardConfigSchema = z.object({
  enabled: z.boolean().default(true),
  port: z.number().optional(),
  webhooks: z.array(WebhookConfigSchema).optional(),
});
export type DashboardConfig = z.infer<typeof DashboardConfigSchema>;

/**
 * Analytics configuration
 */
export const AnalyticsConfigSchema = z.object({
  enabled: z.boolean().default(true),
  webhookUrl: z.string().url().optional(),
  retainDays: z.number().default(90),
});
export type AnalyticsConfig = z.infer<typeof AnalyticsConfigSchema>;

/**
 * Project type detection
 */
export const ProjectTypeSchema = z.enum([
  "mcp-server",
  "express-api",
  "hono-api",
  "fastapi",
  "nextjs",
  "unknown",
]);
export type ProjectType = z.infer<typeof ProjectTypeSchema>;

/**
 * Main x402 Deploy configuration schema
 */
export const X402ConfigSchema = z.object({
  $schema: z.string().optional(),
  name: z.string().min(1, "Project name is required"),
  version: z.string().default("1.0.0"),
  description: z.string().optional(),
  
  // Project detection (auto-filled or manual)
  type: ProjectTypeSchema.optional(),
  entrypoint: z.string().optional(),
  
  // Payment settings
  payment: PaymentConfigSchema,
  
  // Pricing settings
  pricing: PricingConfigSchema,
  
  // Discovery settings
  discovery: DiscoveryConfigSchema.optional(),
  
  // Deployment settings
  deploy: DeployConfigSchema.optional(),
  
  // Analytics settings
  analytics: AnalyticsConfigSchema.optional(),
  
  // Dashboard settings
  dashboard: DashboardConfigSchema.optional(),
});
export type X402Config = z.infer<typeof X402ConfigSchema>;

/**
 * Default configuration values
 */
export const DEFAULT_CONFIG: Partial<X402Config> = {
  version: "1.0.0",
  pricing: {
    model: "per-call",
    default: "$0.001",
  },
  discovery: {
    enabled: true,
    autoRegister: true,
  },
  deploy: {
    provider: "railway",
    scaling: {
      min: 1,
      max: 10,
      targetCPU: 80,
    },
  },
  analytics: {
    enabled: true,
    retainDays: 90,
  },
};
