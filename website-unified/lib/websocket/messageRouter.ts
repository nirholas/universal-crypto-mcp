/**
 * Message Router
 * 
 * Routes incoming WebSocket messages to appropriate handlers
 * with middleware support and error handling
 */

import type {
  WSMessage,
  WSRequest,
  WSResponse,
  MessageHandler,
  WSMiddleware,
  Connection,
} from './types';

export interface RouteDefinition {
  type: string;
  handler: MessageHandler;
  middleware?: WSMiddleware[];
  description?: string;
}

export interface RouteContext {
  connection: Connection;
  message: WSRequest;
  params: Record<string, unknown>;
  startTime: number;
}

export class MessageRouter {
  private routes: Map<string, RouteDefinition> = new Map();
  private globalMiddleware: WSMiddleware[] = [];
  private errorHandler: ((error: Error, ctx: RouteContext) => WSResponse) | null = null;

  // ============================================================================
  // Route Registration
  // ============================================================================

  /**
   * Register a message handler
   */
  register(
    type: string,
    handler: MessageHandler,
    options: { middleware?: WSMiddleware[]; description?: string } = {}
  ): void {
    this.routes.set(type, {
      type,
      handler,
      middleware: options.middleware,
      description: options.description,
    });
    console.log(`[Router] Registered handler for: ${type}`);
  }

  /**
   * Unregister a message handler
   */
  unregister(type: string): void {
    this.routes.delete(type);
  }

  /**
   * Add global middleware
   */
  use(middleware: WSMiddleware): void {
    this.globalMiddleware.push(middleware);
  }

  /**
   * Set error handler
   */
  onError(handler: (error: Error, ctx: RouteContext) => WSResponse): void {
    this.errorHandler = handler;
  }

  // ============================================================================
  // Message Routing
  // ============================================================================

  /**
   * Route a message to its handler
   */
  async route(connection: Connection, message: WSRequest): Promise<WSResponse> {
    const startTime = performance.now();
    
    const ctx: RouteContext = {
      connection,
      message,
      params: {},
      startTime,
    };

    try {
      // Find route
      const route = this.routes.get(message.type);
      if (!route) {
        return this.createErrorResponse(message.id, 'UNKNOWN_TYPE', `Unknown message type: ${message.type}`);
      }

      // Execute global middleware
      for (const middleware of this.globalMiddleware) {
        const shouldContinue = await this.executeMiddleware(middleware, ctx);
        if (!shouldContinue) {
          return this.createErrorResponse(message.id, 'MIDDLEWARE_REJECTED', 'Request rejected by middleware');
        }
      }

      // Execute route-specific middleware
      if (route.middleware) {
        for (const middleware of route.middleware) {
          const shouldContinue = await this.executeMiddleware(middleware, ctx);
          if (!shouldContinue) {
            return this.createErrorResponse(message.id, 'MIDDLEWARE_REJECTED', 'Request rejected by middleware');
          }
        }
      }

      // Execute handler
      const result = await route.handler(message, connection);
      
      const duration = performance.now() - startTime;
      console.log(`[Router] ${message.type} handled in ${duration.toFixed(2)}ms`);

      return this.createSuccessResponse(message.id, message.type, result);

    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      console.error(`[Router] Error handling ${message.type}:`, err.message);

      if (this.errorHandler) {
        return this.errorHandler(err, ctx);
      }

      return this.createErrorResponse(
        message.id,
        'HANDLER_ERROR',
        process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
      );
    }
  }

  /**
   * Execute middleware
   */
  private async executeMiddleware(
    middleware: WSMiddleware,
    ctx: RouteContext
  ): Promise<boolean> {
    return new Promise((resolve) => {
      let nextCalled = false;
      
      const next = () => {
        nextCalled = true;
        resolve(true);
      };

      try {
        const result = middleware(ctx.message, ctx.connection, next);
        
        // Handle async middleware
        if (result instanceof Promise) {
          result
            .then(() => {
              if (!nextCalled) {
                resolve(false);
              }
            })
            .catch(() => {
              resolve(false);
            });
        } else {
          // For sync middleware, wait a tick to see if next was called
          setTimeout(() => {
            if (!nextCalled) {
              resolve(false);
            }
          }, 0);
        }
      } catch {
        resolve(false);
      }
    });
  }

  // ============================================================================
  // Response Helpers
  // ============================================================================

  /**
   * Create a success response
   */
  private createSuccessResponse(
    id: string,
    type: string,
    data: unknown
  ): WSResponse {
    return {
      id,
      type: `${type}:response`,
      success: true,
      data,
      timestamp: Date.now(),
    };
  }

  /**
   * Create an error response
   */
  private createErrorResponse(
    id: string,
    code: string,
    message: string
  ): WSResponse {
    return {
      id,
      type: 'error',
      success: false,
      error: {
        code,
        message,
      },
      timestamp: Date.now(),
    };
  }

  // ============================================================================
  // Utilities
  // ============================================================================

  /**
   * Get all registered routes
   */
  getRoutes(): RouteDefinition[] {
    return Array.from(this.routes.values());
  }

  /**
   * Check if a route exists
   */
  hasRoute(type: string): boolean {
    return this.routes.has(type);
  }

  /**
   * Clear all routes
   */
  clear(): void {
    this.routes.clear();
    this.globalMiddleware = [];
  }
}

// ============================================================================
// Built-in Middleware
// ============================================================================

/**
 * Logging middleware
 */
export const loggingMiddleware: WSMiddleware = (message, connection, next) => {
  console.log(`[WS] ${connection.id} -> ${message.type}`, message.payload);
  next();
};

/**
 * Rate limiting middleware factory
 */
export function rateLimitMiddleware(
  maxRequests: number,
  windowMs: number
): WSMiddleware {
  const requests = new Map<string, { count: number; resetAt: number }>();

  return (message, connection, next) => {
    const now = Date.now();
    const key = connection.userId || connection.id;
    
    let record = requests.get(key);
    if (!record || now > record.resetAt) {
      record = { count: 0, resetAt: now + windowMs };
      requests.set(key, record);
    }

    record.count++;
    
    if (record.count > maxRequests) {
      console.warn(`[RateLimit] ${key} exceeded limit`);
      // Don't call next - reject the request
      return;
    }

    next();
  };
}

/**
 * Authentication middleware
 */
export const authMiddleware: WSMiddleware = (message, connection, next) => {
  if (!connection.userId) {
    console.warn(`[Auth] Unauthenticated request from ${connection.id}`);
    // Don't call next - reject unauthenticated requests
    return;
  }
  next();
};

/**
 * Validation middleware factory
 */
export function validationMiddleware(
  schema: {
    required?: string[];
    types?: Record<string, string>;
  }
): WSMiddleware {
  return (message, _connection, next) => {
    const payload = (message.payload || {}) as Record<string, unknown>;

    // Check required fields
    if (schema.required) {
      for (const field of schema.required) {
        if (!(field in payload)) {
          console.warn(`[Validation] Missing required field: ${field}`);
          return;
        }
      }
    }

    // Check types
    if (schema.types) {
      for (const [field, expectedType] of Object.entries(schema.types)) {
        if (field in payload && typeof payload[field] !== expectedType) {
          console.warn(`[Validation] Invalid type for ${field}: expected ${expectedType}`);
          return;
        }
      }
    }

    next();
  };
}

// Export singleton instance
export const messageRouter = new MessageRouter();
