/**
 * SDK Generator Types
 * Common types and interfaces for SDK generation
 *
 * @author nich
 * @github github.com/nirholas
 * @license Apache-2.0
 */

/**
 * Configuration for SDK generation
 */
export interface SDKConfig {
  /** Name of the API */
  apiName: string;
  /** Base URL of the API */
  apiUrl: string;
  /** Wallet address to receive payments */
  wallet: `0x${string}`;
  /** Facilitator service URL */
  facilitator: string;
  /** Route definitions with prices (e.g., "GET /users" -> "0.001") */
  routes: Record<string, string>;
}

/**
 * SDK generation result
 */
export interface SDKGenerationResult {
  /** The language of the generated SDK */
  language: 'typescript' | 'python' | 'go';
  /** The generated code */
  code: string;
  /** The file extension */
  extension: string;
  /** The output directory name */
  directory: string;
}

/**
 * Helper to convert string to PascalCase
 */
export function toPascalCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
    .replace(/^./, c => c.toUpperCase());
}

/**
 * Helper to convert string to camelCase
 */
export function toCamelCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
    .replace(/^./, c => c.toLowerCase());
}

/**
 * Helper to convert string to snake_case
 */
export function toSnakeCase(str: string): string {
  return str
    .replace(/([A-Z])/g, '_$1')
    .replace(/[-\s]+/g, '_')
    .toLowerCase()
    .replace(/^_/, '');
}

/**
 * Extract path parameters from a route path
 * e.g., "/users/:id/posts/:postId" -> ["id", "postId"]
 */
export function extractPathParams(path: string): string[] {
  const matches = path.match(/:(\w+)/g);
  return matches ? matches.map(m => m.slice(1)) : [];
}
