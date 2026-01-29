/**
 * x402 Discovery Document Generation
 *
 * Generates /.well-known/x402 discovery documents according to the x402 spec.
 * These documents allow clients and x402scan to discover payable resources.
 */

import type { X402Config } from "../types/config.js";

/**
 * Discovery document structure (x402 spec v1)
 */
export interface DiscoveryDocument {
  /** Discovery document version */
  version: 1;
  /** List of payable resource URLs */
  resources: string[];
  /** Optional ownership proof signatures */
  ownershipProofs?: string[];
  /** Optional human-readable instructions */
  instructions?: string;
  /** Optional metadata about the service */
  metadata?: DiscoveryMetadata;
}

/**
 * Optional metadata for enhanced discovery
 */
export interface DiscoveryMetadata {
  /** Service name */
  name?: string;
  /** Service description */
  description?: string;
  /** Service version */
  version?: string;
  /** Contact information */
  contact?: string;
  /** Terms of service URL */
  termsUrl?: string;
  /** Documentation URL */
  docsUrl?: string;
  /** Supported payment tokens */
  supportedTokens?: string[];
  /** Supported networks (CAIP-2) */
  supportedNetworks?: string[];
}

/**
 * Options for document generation
 */
export interface GenerateDocumentOptions {
  /** Include metadata in the document */
  includeMetadata?: boolean;
  /** Additional resources to include */
  additionalResources?: string[];
  /** Override ownership proofs */
  ownershipProofs?: string[];
  /** Override instructions */
  instructions?: string;
}

/**
 * Generate a discovery document from x402 config
 *
 * @param config - The x402 deployment configuration
 * @param baseUrl - The base URL of the deployed service
 * @param options - Optional generation options
 * @returns The discovery document
 *
 * @example
 * ```typescript
 * const doc = generateDiscoveryDocument(config, "https://api.example.com");
 * // Serve at /.well-known/x402
 * ```
 */
export function generateDiscoveryDocument(
  config: X402Config,
  baseUrl: string,
  options: GenerateDocumentOptions = {}
): DiscoveryDocument {
  // Normalize base URL (remove trailing slash)
  const normalizedBaseUrl = baseUrl.replace(/\/$/, "");

  // Collect resources from pricing routes
  const resources: string[] = [];

  if (config.pricing?.routes) {
    for (const route of Object.keys(config.pricing.routes)) {
      // Parse route pattern: "GET /api/resource" or just "/api/resource"
      const routeUrl = parseRouteToUrl(route, normalizedBaseUrl);
      if (routeUrl) {
        resources.push(routeUrl);
      }
    }
  }

  // If no routes defined, add default endpoints based on project type
  if (resources.length === 0) {
    const defaultResources = getDefaultResources(config.type, normalizedBaseUrl);
    resources.push(...defaultResources);
  }

  // Add any additional resources from options
  if (options.additionalResources) {
    for (const resource of options.additionalResources) {
      // Ensure full URL
      const fullUrl = resource.startsWith("http")
        ? resource
        : `${normalizedBaseUrl}${resource.startsWith("/") ? "" : "/"}${resource}`;
      resources.push(fullUrl);
    }
  }

  // Build the discovery document
  const document: DiscoveryDocument = {
    version: 1,
    resources: [...new Set(resources)], // Deduplicate
  };

  // Add ownership proofs
  const ownershipProofs =
    options.ownershipProofs ?? config.discovery?.ownershipProofs;
  if (ownershipProofs && ownershipProofs.length > 0) {
    document.ownershipProofs = ownershipProofs;
  }

  // Add instructions
  const instructions = options.instructions ?? config.discovery?.instructions;
  if (instructions) {
    document.instructions = instructions;
  }

  // Add metadata if requested
  if (options.includeMetadata) {
    document.metadata = {
      name: config.name,
      description: config.description,
      version: config.version,
      supportedTokens: [config.payment.token],
      supportedNetworks: [config.payment.network],
    };
  }

  return document;
}

/**
 * Parse a route pattern to a full URL
 */
function parseRouteToUrl(route: string, baseUrl: string): string | null {
  // Handle "METHOD /path" format
  const methodPathMatch = route.match(/^(GET|POST|PUT|DELETE|PATCH|HEAD|OPTIONS)\s+(.+)$/i);
  if (methodPathMatch) {
    const path = methodPathMatch[2];
    return `${baseUrl}${path.startsWith("/") ? "" : "/"}${path}`;
  }

  // Handle just "/path" format
  if (route.startsWith("/")) {
    return `${baseUrl}${route}`;
  }

  // Handle full URL
  if (route.startsWith("http")) {
    return route;
  }

  // Default: treat as path
  return `${baseUrl}/${route}`;
}

/**
 * Get default resource URLs based on project type
 */
function getDefaultResources(
  projectType: string | undefined,
  baseUrl: string
): string[] {
  switch (projectType) {
    case "mcp-server":
      return [
        `${baseUrl}/mcp`,
        `${baseUrl}/mcp/*`,
      ];

    case "express-api":
    case "hono-api":
      return [
        `${baseUrl}/api/*`,
      ];

    case "fastapi":
      return [
        `${baseUrl}/api/*`,
        `${baseUrl}/docs`,
      ];

    case "nextjs":
      return [
        `${baseUrl}/api/*`,
      ];

    default:
      return [
        `${baseUrl}/*`,
      ];
  }
}

/**
 * Serialize discovery document to JSON
 */
export function serializeDiscoveryDocument(doc: DiscoveryDocument): string {
  return JSON.stringify(doc, null, 2);
}

/**
 * Parse a discovery document from JSON
 */
export function parseDiscoveryDocument(json: string): DiscoveryDocument {
  const parsed = JSON.parse(json);

  if (parsed.version !== 1) {
    throw new Error(`Unsupported discovery document version: ${parsed.version}`);
  }

  if (!Array.isArray(parsed.resources)) {
    throw new Error("Discovery document must have a resources array");
  }

  return parsed as DiscoveryDocument;
}

/**
 * Create a minimal discovery document
 */
export function createMinimalDocument(resources: string[]): DiscoveryDocument {
  return {
    version: 1,
    resources,
  };
}
