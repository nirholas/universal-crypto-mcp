/**
 * API Key Authentication
 */

import { createChildLogger } from '../utils/logger.js';

const logger = createChildLogger('auth');

export interface ApiKeyConfig {
  requireAuth: boolean;
  apiKeyHeader: string;
  validKeys?: string[];
}

export class ApiKeyAuth {
  private config: ApiKeyConfig;
  private validKeys: Set<string>;

  constructor(config: ApiKeyConfig) {
    this.config = config;
    this.validKeys = new Set(config.validKeys || []);
    
    // Load keys from environment
    const envKeys = process.env.API_KEYS?.split(',').map(k => k.trim()).filter(Boolean);
    if (envKeys) {
      envKeys.forEach(key => this.validKeys.add(key));
    }
    
    logger.info({ keyCount: this.validKeys.size, requireAuth: config.requireAuth }, 'API key auth initialized');
  }

  validate(apiKey: string | undefined): boolean {
    if (!this.config.requireAuth) {
      return true;
    }

    if (!apiKey) {
      logger.warn('Missing API key');
      return false;
    }

    const isValid = this.validKeys.has(apiKey);
    if (!isValid) {
      logger.warn('Invalid API key provided');
    }

    return isValid;
  }

  addKey(key: string): void {
    this.validKeys.add(key);
    logger.info('API key added');
  }

  removeKey(key: string): void {
    this.validKeys.delete(key);
    logger.info('API key removed');
  }
}
