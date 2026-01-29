import type { X402Config } from "../types/config.js";
import type { Express, Request, Response, NextFunction } from "express";
import { x402Middleware, x402WithFreeRoutes } from "./middleware.js";

export interface ExpressWrapperOptions {
  config: X402Config;
  app: Express;
  testMode?: boolean;
  freeRoutes?: string[];
  onPaymentVerified?: (payment: any) => void;
  onPaymentFailed?: (error: Error, req: Request) => void;
}

/**
 * Wrap an Express app with x402 payment middleware
 * @param options Configuration options
 * @returns The wrapped Express app
 */
export function wrapExpressApp(options: ExpressWrapperOptions): Express {
  const { config, app, testMode, freeRoutes, onPaymentVerified, onPaymentFailed } = options;

  // Add health endpoint if not already present
  app.get("/health", (req, res) => {
    res.json({ status: "ok", version: config.version });
  });

  // Add discovery document endpoint
  app.get("/.well-known/x402", (req, res) => {
    const origin = `${req.protocol}://${req.get("host")}`;
    res.json({
      name: config.name,
      version: config.version,
      description: config.description,
      payment: config.payment,
      pricing: config.pricing,
      endpoints: extractEndpoints(app),
    });
  });

  // Apply x402 middleware globally or with free routes
  if (freeRoutes && freeRoutes.length > 0) {
    app.use(x402WithFreeRoutes(
      { config, testMode, onPaymentVerified, onPaymentFailed },
      freeRoutes
    ));
  } else {
    app.use(x402Middleware({ config, testMode, onPaymentVerified, onPaymentFailed }));
  }

  return app;
}

/**
 * Create an Express wrapper with x402 payment support
 * @param options Configuration options
 */
export function createExpressWrapper(options: ExpressWrapperOptions): Express {
  return wrapExpressApp(options);
}

/**
 * Extract registered routes from Express app
 */
function extractEndpoints(app: Express): Array<{method: string; path: string}> {
  const endpoints: Array<{method: string; path: string}> = [];
  
  try {
    // Access Express internals to get routes
    const router = (app as any)._router;
    if (router && router.stack) {
      router.stack.forEach((layer: any) => {
        if (layer.route) {
          const methods = Object.keys(layer.route.methods);
          methods.forEach((method) => {
            endpoints.push({
              method: method.toUpperCase(),
              path: layer.route.path,
            });
          });
        }
      });
    }
  } catch (error) {
    // Silently fail if we can't extract routes
    console.warn("Could not extract Express routes:", error);
  }
  
  return endpoints;
}
