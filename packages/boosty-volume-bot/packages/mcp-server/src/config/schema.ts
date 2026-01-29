/**
 * Configuration Schema and Loader
 * Validates and loads server configuration from environment and files
 */

import { z } from 'zod';
import type { ServerConfig } from '../types.js';

// ===========================================
// CONFIGURATION SCHEMA
// ===========================================

export const ServerConfigSchema = z.object({
  solana: z.object({
    network: z.enum(['mainnet-beta', 'devnet', 'testnet', 'localnet']).default('mainnet-beta'),
    rpcEndpoints: z.array(z.string().url()).min(1),
    commitment: z.enum(['processed', 'confirmed', 'finalized']).default('confirmed'),
    maxRetries: z.number().min(1).max(10).default(3),
  }),
  redis: z.object({
    host: z.string().default('localhost'),
    port: z.number().default(6379),
    password: z.string().optional(),
    db: z.number().default(0),
  }),
  database: z.object({
    host: z.string().default('localhost'),
    port: z.number().default(5432),
    database: z.string().default('defi_mcp'),
    user: z.string().default('postgres'),
    password: z.string(),
    ssl: z.boolean().default(false),
  }),
  encryption: z.object({
    masterPassword: z.string().min(16, 'Master password must be at least 16 characters'),
    algorithm: z.string().default('aes-256-gcm'),
  }),
  features: z.object({
    maxWallets: z.number().default(1000),
    maxBotsPerCampaign: z.number().default(500),
    maxConcurrentCampaigns: z.number().default(10),
    maxBatchSize: z.number().default(100),
  }),
  auth: z.object({
    requireAuth: z.boolean().default(true),
    apiKeyHeader: z.string().default('x-api-key'),
    rateLimits: z.object({
      swaps: z.object({
        max: z.number().default(100),
        windowMs: z.number().default(60000),
      }),
      walletOps: z.object({
        max: z.number().default(50),
        windowMs: z.number().default(60000),
      }),
      campaigns: z.object({
        max: z.number().default(20),
        windowMs: z.number().default(60000),
      }),
      queries: z.object({
        max: z.number().default(500),
        windowMs: z.number().default(60000),
      }),
    }),
  }),
  logging: z.object({
    level: z.enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal']).default('info'),
    pretty: z.boolean().default(false),
  }),
});

export type ValidatedServerConfig = z.infer<typeof ServerConfigSchema>;
