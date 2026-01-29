/**
 * @universal-crypto-mcp/core
 * 
 * Shared utilities, types, and configuration for Universal Crypto MCP
 * The most extensive crypto MCP repository
 * 
 * @author nich
 * @license Apache-2.0
 * @see https://github.com/nirholas/universal-crypto-mcp
 * @see https://x.com/nichxbt
 */

// Re-export chain configurations
export * from './chains.js';

// Re-export token configurations
export * from './tokens.js';

// Re-export all types
export * from './types/index.js';

// Re-export all utilities
export * from './utils/index.js';

// Version info
export const VERSION = '1.0.0';
export const PACKAGE_NAME = '@universal-crypto-mcp/core';
export const AUTHOR = {
  name: 'nich',
  github: 'https://github.com/nirholas',
  twitter: 'https://x.com/nichxbt',
};
