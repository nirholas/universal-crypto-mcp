/**
 * Express Middleware for serving /.well-known/x402
 *
 * This middleware serves the x402 discovery document at the
 * standard well-known endpoint.
 */

import type { Request, Response, NextFunction, RequestHandler } from "express";
import type { X402Config } from "../types/config.js";
import {
  generateDiscoveryDocument,
  type DiscoveryDocument,
  type GenerateDocumentOptions,
} from "./document.js";

/**
 * Middleware options
 */
export interface DiscoveryMiddlewareOptions {
  /** Static discovery document (takes precedence) */
  document?: DiscoveryDocument;
  /** x402 config for dynamic document generation */
  config?: X402Config;
  /** Base URL override (defaults to request host) */
  baseUrl?: string;
  /** Document generation options */
  documentOptions?: GenerateDocumentOptions;
  /** Custom path (defaults to /.well-known/x402) */
  path?: string;
  /** Cache duration in seconds (defaults to 300) */
  cacheDuration?: number;
  /** Enable CORS for discovery endpoint */
  enableCors?: boolean;
}

/**
 * Create Express middleware to serve the x402 discovery document
 *
 * @param options - Middleware configuration
 * @returns Express middleware
 *
 * @example
 * ```typescript
 * import express from "express";
 * import { discoveryMiddleware } from "x402-deploy/discovery";
 *
 * const app = express();
 *
 * // With static document
 * app.use(discoveryMiddleware({
 *   document: {
 *     version: 1,
 *     resources: ["https://api.example.com/resource"],
 *   },
 * }));
 *
 * // Or with config for dynamic generation
 * app.use(discoveryMiddleware({
 *   config: x402Config,
 *   baseUrl: "https://api.example.com",
 * }));
 * ```
 */
export function discoveryMiddleware(
  options: DiscoveryMiddlewareOptions
): RequestHandler {
  const {
    document: staticDocument,
    config,
    baseUrl,
    documentOptions,
    path = "/.well-known/x402",
    cacheDuration = 300,
    enableCors = true,
  } = options;

  // Pre-generate document if static
  let cachedDocument: DiscoveryDocument | null = staticDocument || null;
  let cachedBaseUrl: string | null = baseUrl || null;

  return (req: Request, res: Response, next: NextFunction): void => {
    // Only handle the discovery path
    if (req.path !== path) {
      next();
      return;
    }

    // Only handle GET requests
    if (req.method !== "GET") {
      res.status(405).json({ error: "Method not allowed" });
      return;
    }

    try {
      // CORS headers
      if (enableCors) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");
      }

      // Handle preflight
      if (req.method === "OPTIONS") {
        res.status(204).end();
        return;
      }

      // Determine the document to serve
      let documentToServe: DiscoveryDocument;

      if (cachedDocument && cachedBaseUrl) {
        documentToServe = cachedDocument;
      } else if (config) {
        // Generate document dynamically
        const resolvedBaseUrl =
          baseUrl || `${req.protocol}://${req.get("host")}`;

        documentToServe = generateDiscoveryDocument(
          config,
          resolvedBaseUrl,
          documentOptions
        );

        // Cache it if base URL was provided
        if (baseUrl) {
          cachedDocument = documentToServe;
          cachedBaseUrl = baseUrl;
        }
      } else {
        res.status(500).json({
          error: "Discovery middleware not configured properly",
        });
        return;
      }

      // Set cache headers
      res.setHeader("Cache-Control", `public, max-age=${cacheDuration}`);
      res.setHeader("Content-Type", "application/json");

      // Send the document
      res.json(documentToServe);
    } catch (error) {
      console.error("Error serving discovery document:", error);
      res.status(500).json({
        error: "Failed to generate discovery document",
      });
    }
  };
}

/**
 * Create a simple handler function for non-Express environments
 */
export function createDiscoveryHandler(
  options: DiscoveryMiddlewareOptions
): (request: { url: string; method: string; host?: string }) => {
  status: number;
  headers: Record<string, string>;
  body: string;
} | null {
  const {
    document: staticDocument,
    config,
    baseUrl,
    documentOptions,
    path = "/.well-known/x402",
    cacheDuration = 300,
    enableCors = true,
  } = options;

  return (request) => {
    // Check path
    const url = new URL(request.url, `http://${request.host || "localhost"}`);
    if (url.pathname !== path) {
      return null;
    }

    // Method check
    if (request.method !== "GET" && request.method !== "OPTIONS") {
      return {
        status: 405,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Method not allowed" }),
      };
    }

    // CORS headers
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "Cache-Control": `public, max-age=${cacheDuration}`,
    };

    if (enableCors) {
      headers["Access-Control-Allow-Origin"] = "*";
      headers["Access-Control-Allow-Methods"] = "GET, OPTIONS";
      headers["Access-Control-Allow-Headers"] = "Content-Type";
    }

    // Handle preflight
    if (request.method === "OPTIONS") {
      return {
        status: 204,
        headers,
        body: "",
      };
    }

    try {
      let document: DiscoveryDocument;

      if (staticDocument) {
        document = staticDocument;
      } else if (config) {
        const resolvedBaseUrl = baseUrl || `https://${request.host}`;
        document = generateDiscoveryDocument(
          config,
          resolvedBaseUrl,
          documentOptions
        );
      } else {
        return {
          status: 500,
          headers,
          body: JSON.stringify({ error: "Not configured" }),
        };
      }

      return {
        status: 200,
        headers,
        body: JSON.stringify(document, null, 2),
      };
    } catch (error) {
      return {
        status: 500,
        headers,
        body: JSON.stringify({ error: "Failed to generate document" }),
      };
    }
  };
}

/**
 * Hono middleware for serving discovery documents
 */
export function honoDiscoveryMiddleware(options: DiscoveryMiddlewareOptions) {
  const handler = createDiscoveryHandler(options);

  return async (c: any, next: () => Promise<void>) => {
    const result = handler({
      url: c.req.url,
      method: c.req.method,
      host: c.req.header("host"),
    });

    if (!result) {
      return next();
    }

    for (const [key, value] of Object.entries(result.headers)) {
      c.header(key, value);
    }

    return c.body(result.body, result.status);
  };
}
