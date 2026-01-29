/**
 * Configuration Management
 * Environment-based configuration for production deployment
 */

import { config as dotenvConfig } from 'dotenv';
import { NLPConfig } from './types.js';

// Load environment variables
dotenvConfig();

function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key];
  if (!value && defaultValue === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value || defaultValue || '';
}

function getEnvVarOptional(key: string): string | undefined {
  return process.env[key];
}

function getEnvVarNumber(key: string, defaultValue: number): number {
  const value = process.env[key];
  if (!value) return defaultValue;
  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) return defaultValue;
  return parsed;
}

function getEnvVarBoolean(key: string, defaultValue: boolean): boolean {
  const value = process.env[key];
  if (!value) return defaultValue;
  return value.toLowerCase() === 'true' || value === '1';
}

export const config: NLPConfig = {
  openaiApiKey: getEnvVarOptional('OPENAI_API_KEY'),
  embeddingModel: getEnvVar('EMBEDDING_MODEL', 'text-embedding-3-small'),
  completionModel: getEnvVar('COMPLETION_MODEL', 'gpt-4-turbo-preview'),
  maxTokens: getEnvVarNumber('MAX_TOKENS', 1000),
  temperature: parseFloat(getEnvVar('TEMPERATURE', '0.3')),
  sessionTTL: getEnvVarNumber('SESSION_TTL', 3600), // 1 hour
  redisUrl: getEnvVarOptional('REDIS_URL'),
  rateLimitPerMinute: getEnvVarNumber('RATE_LIMIT_PER_MINUTE', 60),
  enableCaching: getEnvVarBoolean('ENABLE_CACHING', true),
  debugMode: getEnvVarBoolean('DEBUG_MODE', false),
};

export const serverConfig = {
  port: getEnvVarNumber('PORT', 3100),
  host: getEnvVar('HOST', '0.0.0.0'),
  corsOrigins: getEnvVar('CORS_ORIGINS', '*').split(','),
  apiPrefix: getEnvVar('API_PREFIX', '/api/v1'),
  trustProxy: getEnvVarBoolean('TRUST_PROXY', false),
};

// MCP Backend URLs - connect to existing servers
export const mcpEndpoints = {
  prices: getEnvVar('MCP_PRICES_URL', 'http://localhost:3001'),
  wallets: getEnvVar('MCP_WALLETS_URL', 'http://localhost:3002'),
  yields: getEnvVar('MCP_YIELDS_URL', 'http://localhost:3003'),
  combined: getEnvVar('MCP_COMBINED_URL', 'http://localhost:3000'),
};

export function validateConfig(): void {
  const warnings: string[] = [];
  
  if (!config.openaiApiKey) {
    warnings.push('OPENAI_API_KEY not set - falling back to local NLP processing');
  }
  
  if (!config.redisUrl) {
    warnings.push('REDIS_URL not set - using in-memory session storage (not recommended for production)');
  }
  
  if (warnings.length > 0) {
    console.warn('Configuration warnings:');
    warnings.forEach(w => console.warn(`  - ${w}`));
  }
}
