/**
 * Configuration Loader
 * Loads configuration from environment variables and config files
 */

import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { ServerConfigSchema, type ValidatedServerConfig } from './schema.js';
import type { ServerConfig } from '../types.js';

// ===========================================
// ENVIRONMENT VARIABLE PARSING
// ===========================================

function parseEnvArray(value: string | undefined, defaultValue: string[] = []): string[] {
  if (!value) return defaultValue;
  return value.split(',').map((s) => s.trim()).filter(Boolean);
}

function parseEnvNumber(value: string | undefined, defaultValue: number): number {
  if (!value) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

function parseEnvBoolean(value: string | undefined, defaultValue: boolean): boolean {
  if (!value) return defaultValue;
  return value.toLowerCase() === 'true' || value === '1';
}

// ===========================================
// CONFIG LOADER
// ===========================================

/**
 * Load configuration from environment variables
 */
function loadFromEnv(): Partial<ServerConfig> {
  return {
    solana: {
      network: (process.env.SOLANA_NETWORK as any) || 'mainnet-beta',
      rpcEndpoints: parseEnvArray(
        process.env.SOLANA_RPC_URLS || process.env.SOLANA_RPC_URL || process.env.HELIUS_RPC_URL,
        ['https://api.mainnet-beta.solana.com']
      ),
      commitment: (process.env.SOLANA_COMMITMENT as any) || 'confirmed',
      maxRetries: parseEnvNumber(process.env.SOLANA_MAX_RETRIES, 3),
    },
    redis: {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseEnvNumber(process.env.REDIS_PORT, 6379),
      password: process.env.REDIS_PASSWORD,
      db: parseEnvNumber(process.env.REDIS_DB, 0),
    },
    database: {
      host: process.env.DATABASE_HOST || process.env.PGHOST || 'localhost',
      port: parseEnvNumber(process.env.DATABASE_PORT || process.env.PGPORT, 5432),
      database: process.env.DATABASE_NAME || process.env.PGDATABASE || 'defi_mcp',
      user: process.env.DATABASE_USER || process.env.PGUSER || 'postgres',
      password: process.env.DATABASE_PASSWORD || process.env.PGPASSWORD || '',
      ssl: parseEnvBoolean(process.env.DATABASE_SSL, false),
    },
    encryption: {
      masterPassword: process.env.MASTER_PASSWORD || process.env.ENCRYPTION_KEY || '',
      algorithm: process.env.ENCRYPTION_ALGORITHM || 'aes-256-gcm',
    },
    features: {
      maxWallets: parseEnvNumber(process.env.MAX_WALLETS, 1000),
      maxBotsPerCampaign: parseEnvNumber(process.env.MAX_BOTS_PER_CAMPAIGN, 500),
      maxConcurrentCampaigns: parseEnvNumber(process.env.MAX_CONCURRENT_CAMPAIGNS, 10),
      maxBatchSize: parseEnvNumber(process.env.MAX_BATCH_SIZE, 100),
    },
    auth: {
      requireAuth: parseEnvBoolean(process.env.REQUIRE_AUTH, true),
      apiKeyHeader: process.env.API_KEY_HEADER || 'x-api-key',
      rateLimits: {
        swaps: {
          max: parseEnvNumber(process.env.RATE_LIMIT_SWAPS_MAX, 100),
          windowMs: parseEnvNumber(process.env.RATE_LIMIT_SWAPS_WINDOW, 60000),
        },
        walletOps: {
          max: parseEnvNumber(process.env.RATE_LIMIT_WALLET_MAX, 50),
          windowMs: parseEnvNumber(process.env.RATE_LIMIT_WALLET_WINDOW, 60000),
        },
        campaigns: {
          max: parseEnvNumber(process.env.RATE_LIMIT_CAMPAIGNS_MAX, 20),
          windowMs: parseEnvNumber(process.env.RATE_LIMIT_CAMPAIGNS_WINDOW, 60000),
        },
        queries: {
          max: parseEnvNumber(process.env.RATE_LIMIT_QUERIES_MAX, 500),
          windowMs: parseEnvNumber(process.env.RATE_LIMIT_QUERIES_WINDOW, 60000),
        },
      },
    },
    logging: {
      level: (process.env.LOG_LEVEL as any) || 'info',
      pretty: parseEnvBoolean(process.env.LOG_PRETTY, false),
    },
  };
}

/**
 * Load configuration from a JSON file
 */
function loadFromFile(configPath: string): Partial<ServerConfig> {
  if (!existsSync(configPath)) {
    throw new Error(`Configuration file not found: ${configPath}`);
  }

  try {
    const content = readFileSync(configPath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    throw new Error(`Failed to parse configuration file: ${configPath}`);
  }
}

/**
 * Deep merge configuration objects
 */
function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const result = { ...target };

  for (const key of Object.keys(source) as Array<keyof T>) {
    const sourceValue = source[key];
    const targetValue = target[key];

    if (
      sourceValue !== undefined &&
      typeof sourceValue === 'object' &&
      !Array.isArray(sourceValue) &&
      sourceValue !== null &&
      typeof targetValue === 'object' &&
      !Array.isArray(targetValue) &&
      targetValue !== null
    ) {
      result[key] = deepMerge(targetValue, sourceValue as any);
    } else if (sourceValue !== undefined) {
      result[key] = sourceValue as T[keyof T];
    }
  }

  return result;
}

// ===========================================
// PUBLIC API
// ===========================================

export interface LoadConfigOptions {
  configPath?: string;
  skipEnv?: boolean;
  skipValidation?: boolean;
}

/**
 * Load and validate server configuration
 * Priority: config file > environment variables > defaults
 */
export function loadConfig(options: LoadConfigOptions = {}): ValidatedServerConfig {
  const { configPath, skipEnv = false, skipValidation = false } = options;

  // Start with defaults
  let config: Partial<ServerConfig> = {};

  // Load from environment
  if (!skipEnv) {
    config = deepMerge(config as any, loadFromEnv());
  }

  // Load from config file if specified
  if (configPath) {
    const absolutePath = resolve(process.cwd(), configPath);
    const fileConfig = loadFromFile(absolutePath);
    config = deepMerge(config as any, fileConfig);
  }

  // Try to load default config file
  const defaultConfigPaths = [
    resolve(process.cwd(), 'config.json'),
    resolve(process.cwd(), 'config/default.json'),
    resolve(__dirname, '../../config/default.json'),
  ];

  for (const path of defaultConfigPaths) {
    if (!configPath && existsSync(path)) {
      try {
        const fileConfig = loadFromFile(path);
        config = deepMerge(config as any, fileConfig);
        break;
      } catch {
        // Skip invalid files
      }
    }
  }

  // Validate configuration
  if (!skipValidation) {
    const result = ServerConfigSchema.safeParse(config);
    if (!result.success) {
      const errors = result.error.issues.map((i) => `  - ${i.path.join('.')}: ${i.message}`);
      throw new Error(`Invalid configuration:\n${errors.join('\n')}`);
    }
    return result.data;
  }

  return config as ValidatedServerConfig;
}

/**
 * Create a minimal development configuration
 */
export function createDevConfig(): ValidatedServerConfig {
  return {
    solana: {
      network: 'devnet',
      rpcEndpoints: ['https://api.devnet.solana.com'],
      commitment: 'confirmed',
      maxRetries: 3,
    },
    redis: {
      host: 'localhost',
      port: 6379,
      db: 0,
    },
    database: {
      host: 'localhost',
      port: 5432,
      database: 'defi_mcp_dev',
      user: 'postgres',
      password: 'postgres',
      ssl: false,
    },
    encryption: {
      masterPassword: 'dev-password-not-for-production',
      algorithm: 'aes-256-gcm',
    },
    features: {
      maxWallets: 100,
      maxBotsPerCampaign: 50,
      maxConcurrentCampaigns: 5,
      maxBatchSize: 20,
    },
    auth: {
      requireAuth: false,
      apiKeyHeader: 'x-api-key',
      rateLimits: {
        swaps: { max: 1000, windowMs: 60000 },
        walletOps: { max: 500, windowMs: 60000 },
        campaigns: { max: 200, windowMs: 60000 },
        queries: { max: 5000, windowMs: 60000 },
      },
    },
    logging: {
      level: 'debug',
      pretty: true,
    },
  };
}

export { ServerConfigSchema };
