/**
 * Secrets Management Abstraction
 * 
 * Provides a unified interface for secret management with support for
 * environment variables, file-based secrets, and vault integrations.
 * 
 * @module secrets
 * @author nich <nich@nichxbt.com>
 */

import { ConfigurationError } from '../errors/index.js';

// ============================================================================
// Types
// ============================================================================

export interface SecretProvider {
  name: string;
  get(key: string): Promise<string | undefined>;
  has(key: string): Promise<boolean>;
  set?(key: string, value: string): Promise<void>;
  delete?(key: string): Promise<void>;
  list?(): Promise<string[]>;
}

export interface SecretsConfig {
  /** Primary provider */
  provider: SecretProvider;
  /** Fallback providers (checked in order) */
  fallback?: SecretProvider[];
  /** Cache secrets in memory */
  cache?: boolean;
  /** Cache TTL in milliseconds */
  cacheTtl?: number;
  /** Required secrets (throw if missing) */
  required?: string[];
  /** Secret key prefix */
  prefix?: string;
}

export interface CachedSecret {
  value: string;
  expiresAt: number;
}

// ============================================================================
// Environment Variable Provider
// ============================================================================

/**
 * Provider that reads secrets from environment variables
 */
export class EnvSecretProvider implements SecretProvider {
  name = 'env';
  private prefix: string;

  constructor(prefix: string = '') {
    this.prefix = prefix;
  }

  async get(key: string): Promise<string | undefined> {
    return process.env[this.prefix + key];
  }

  async has(key: string): Promise<boolean> {
    return (this.prefix + key) in process.env;
  }

  async set(key: string, value: string): Promise<void> {
    process.env[this.prefix + key] = value;
  }

  async delete(key: string): Promise<void> {
    delete process.env[this.prefix + key];
  }

  async list(): Promise<string[]> {
    return Object.keys(process.env)
      .filter(k => k.startsWith(this.prefix))
      .map(k => k.slice(this.prefix.length));
  }
}

// ============================================================================
// File-based Provider
// ============================================================================

/**
 * Provider that reads secrets from files (Docker secrets, Kubernetes, etc.)
 */
export class FileSecretProvider implements SecretProvider {
  name = 'file';
  private basePath: string;
  private cache = new Map<string, string>();

  constructor(basePath: string = '/run/secrets') {
    this.basePath = basePath;
  }

  async get(key: string): Promise<string | undefined> {
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }

    try {
      const fs = await import('fs/promises');
      const filePath = `${this.basePath}/${key}`;
      const content = await fs.readFile(filePath, 'utf-8');
      const value = content.trim();
      this.cache.set(key, value);
      return value;
    } catch {
      return undefined;
    }
  }

  async has(key: string): Promise<boolean> {
    const value = await this.get(key);
    return value !== undefined;
  }

  async list(): Promise<string[]> {
    try {
      const fs = await import('fs/promises');
      return await fs.readdir(this.basePath);
    } catch {
      return [];
    }
  }
}

// ============================================================================
// Memory Provider (for testing)
// ============================================================================

/**
 * In-memory provider for testing
 */
export class MemorySecretProvider implements SecretProvider {
  name = 'memory';
  private secrets = new Map<string, string>();

  constructor(initial?: Record<string, string>) {
    if (initial) {
      for (const [key, value] of Object.entries(initial)) {
        this.secrets.set(key, value);
      }
    }
  }

  async get(key: string): Promise<string | undefined> {
    return this.secrets.get(key);
  }

  async has(key: string): Promise<boolean> {
    return this.secrets.has(key);
  }

  async set(key: string, value: string): Promise<void> {
    this.secrets.set(key, value);
  }

  async delete(key: string): Promise<void> {
    this.secrets.delete(key);
  }

  async list(): Promise<string[]> {
    return Array.from(this.secrets.keys());
  }
}

// ============================================================================
// Secrets Manager
// ============================================================================

/**
 * Unified secrets manager with caching and multiple providers
 */
export class SecretsManager {
  private provider: SecretProvider;
  private fallback: SecretProvider[];
  private cache: Map<string, CachedSecret> = new Map();
  private cacheEnabled: boolean;
  private cacheTtl: number;
  private prefix: string;
  private required: Set<string>;
  private validated = false;

  constructor(config: SecretsConfig) {
    this.provider = config.provider;
    this.fallback = config.fallback ?? [];
    this.cacheEnabled = config.cache ?? true;
    this.cacheTtl = config.cacheTtl ?? 5 * 60 * 1000; // 5 minutes default
    this.prefix = config.prefix ?? '';
    this.required = new Set(config.required ?? []);
  }

  /**
   * Get a secret value
   */
  async get(key: string): Promise<string | undefined> {
    const fullKey = this.prefix + key;

    // Check cache first
    if (this.cacheEnabled) {
      const cached = this.cache.get(fullKey);
      if (cached && cached.expiresAt > Date.now()) {
        return cached.value;
      }
    }

    // Try primary provider
    let value = await this.provider.get(fullKey);

    // Try fallback providers
    if (value === undefined) {
      for (const provider of this.fallback) {
        value = await provider.get(fullKey);
        if (value !== undefined) break;
      }
    }

    // Cache the result
    if (value !== undefined && this.cacheEnabled) {
      this.cache.set(fullKey, {
        value,
        expiresAt: Date.now() + this.cacheTtl,
      });
    }

    return value;
  }

  /**
   * Get a required secret (throws if missing)
   */
  async getRequired(key: string): Promise<string> {
    const value = await this.get(key);
    if (value === undefined) {
      throw new ConfigurationError(`Required secret not found: ${key}`, { configKey: key });
    }
    return value;
  }

  /**
   * Get a secret with a default value
   */
  async getOrDefault(key: string, defaultValue: string): Promise<string> {
    const value = await this.get(key);
    return value ?? defaultValue;
  }

  /**
   * Check if a secret exists
   */
  async has(key: string): Promise<boolean> {
    const fullKey = this.prefix + key;
    
    if (await this.provider.has(fullKey)) return true;
    
    for (const provider of this.fallback) {
      if (await provider.has(fullKey)) return true;
    }
    
    return false;
  }

  /**
   * Validate all required secrets exist
   */
  async validate(): Promise<void> {
    if (this.validated) return;

    const missing: string[] = [];
    for (const key of this.required) {
      if (!(await this.has(key))) {
        missing.push(key);
      }
    }

    if (missing.length > 0) {
      throw new ConfigurationError(
        `Missing required secrets: ${missing.join(', ')}`,
        { context: { missing } }
      );
    }

    this.validated = true;
  }

  /**
   * Get multiple secrets at once
   */
  async getMany(keys: string[]): Promise<Record<string, string | undefined>> {
    const results: Record<string, string | undefined> = {};
    await Promise.all(
      keys.map(async key => {
        results[key] = await this.get(key);
      })
    );
    return results;
  }

  /**
   * Clear the cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; hits: number; misses: number } {
    return {
      size: this.cache.size,
      hits: 0, // Would need to track
      misses: 0,
    };
  }
}

// ============================================================================
// Factory Functions
// ============================================================================

/**
 * Create a secrets manager with environment variables
 */
export function createEnvSecretsManager(
  options?: { prefix?: string; required?: string[] }
): SecretsManager {
  return new SecretsManager({
    provider: new EnvSecretProvider(options?.prefix),
    cache: true,
    required: options?.required,
  });
}

/**
 * Create a secrets manager with file-based secrets
 */
export function createFileSecretsManager(
  basePath?: string,
  options?: { required?: string[] }
): SecretsManager {
  return new SecretsManager({
    provider: new FileSecretProvider(basePath),
    fallback: [new EnvSecretProvider()],
    cache: true,
    required: options?.required,
  });
}

/**
 * Create a testing secrets manager
 */
export function createTestSecretsManager(
  secrets: Record<string, string>
): SecretsManager {
  return new SecretsManager({
    provider: new MemorySecretProvider(secrets),
    cache: false,
  });
}

// ============================================================================
// Default Instance
// ============================================================================

/**
 * Default secrets manager using environment variables
 */
export const secrets = createEnvSecretsManager();

// ============================================================================
// Credential Types
// ============================================================================

/**
 * API credentials structure
 */
export interface ApiCredentials {
  apiKey: string;
  apiSecret?: string;
  passphrase?: string;
}

/**
 * Get API credentials from secrets
 */
export async function getApiCredentials(
  manager: SecretsManager,
  prefix: string
): Promise<ApiCredentials | undefined> {
  const apiKey = await manager.get(`${prefix}_API_KEY`);
  if (!apiKey) return undefined;

  return {
    apiKey,
    apiSecret: await manager.get(`${prefix}_API_SECRET`),
    passphrase: await manager.get(`${prefix}_PASSPHRASE`),
  };
}

/**
 * Get blockchain credentials
 */
export async function getBlockchainCredentials(
  manager: SecretsManager
): Promise<{ privateKey?: string; mnemonic?: string }> {
  return {
    privateKey: await manager.get('PRIVATE_KEY'),
    mnemonic: await manager.get('MNEMONIC'),
  };
}
