/**
 * API Route Handler Utilities
 * Universal Crypto MCP - API Layer
 * 
 * @author nich
 * @license Apache-2.0
 */

import { NextRequest, NextResponse } from 'next/server';
import { ZodSchema, ZodError } from 'zod';
import type { APIResponse, APIResponseMeta, RateLimitInfo, RequestContext } from './types';
import { APIException, handleError, ValidationError, RateLimitError, logError } from './errors';

// ============================================================================
// Rate Limiter
// ============================================================================

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory rate limiter (for edge runtime)
// In production, use Redis or similar
const rateLimitStore = new Map<string, RateLimitEntry>();

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  keyPrefix?: string;
}

const DEFAULT_RATE_LIMIT: RateLimitConfig = {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100,
  keyPrefix: 'rl',
};

function getRateLimitKey(request: NextRequest, prefix: string): string {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
    request.headers.get('x-real-ip') ||
    'unknown';
  const userId = request.headers.get('x-user-id');
  return `${prefix}:${userId || ip}`;
}

function checkRateLimit(
  key: string,
  config: RateLimitConfig
): { allowed: boolean; info: RateLimitInfo } {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetTime) {
    // Reset or initialize
    const resetTime = now + config.windowMs;
    rateLimitStore.set(key, { count: 1, resetTime });
    return {
      allowed: true,
      info: {
        limit: config.maxRequests,
        remaining: config.maxRequests - 1,
        reset: Math.floor(resetTime / 1000),
      },
    };
  }

  entry.count++;
  const remaining = Math.max(0, config.maxRequests - entry.count);
  const resetSeconds = Math.floor(entry.resetTime / 1000);

  if (entry.count > config.maxRequests) {
    return {
      allowed: false,
      info: {
        limit: config.maxRequests,
        remaining: 0,
        reset: resetSeconds,
        retryAfter: Math.ceil((entry.resetTime - now) / 1000),
      },
    };
  }

  return {
    allowed: true,
    info: {
      limit: config.maxRequests,
      remaining,
      reset: resetSeconds,
    },
  };
}

// Cleanup old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 60 * 1000); // Every minute

// ============================================================================
// Request Context
// ============================================================================

function generateRequestId(): string {
  return `req_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 9)}`;
}

export function createRequestContext(request: NextRequest): RequestContext {
  return {
    requestId: generateRequestId(),
    ip: request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      'unknown',
    userAgent: request.headers.get('user-agent') || 'unknown',
    userId: request.headers.get('x-user-id') || undefined,
    walletAddress: request.headers.get('x-wallet-address') || undefined,
    timestamp: Date.now(),
    path: request.nextUrl.pathname,
    method: request.method,
  };
}

// ============================================================================
// Response Builder
// ============================================================================

export function createResponse<T>(
  data: T,
  options?: {
    status?: number;
    meta?: APIResponseMeta;
    headers?: Record<string, string>;
  }
): NextResponse<APIResponse<T>> {
  const response: APIResponse<T> = {
    success: true,
    data,
    meta: {
      ...options?.meta,
      timestamp: new Date().toISOString(),
    },
  };

  return NextResponse.json(response, {
    status: options?.status || 200,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
}

export function createErrorResponse(
  error: APIException | Error | unknown,
  requestId?: string
): NextResponse<APIResponse> {
  const apiResponse = handleError(error);
  
  if (requestId && apiResponse.meta) {
    apiResponse.meta.requestId = requestId;
  } else if (requestId) {
    apiResponse.meta = { requestId };
  }

  const statusCode = error instanceof APIException ? error.statusCode : 500;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Add rate limit headers if applicable
  if (error instanceof RateLimitError) {
    headers['X-RateLimit-Limit'] = String(error.limit);
    headers['X-RateLimit-Remaining'] = String(error.remaining);
    headers['X-RateLimit-Reset'] = String(error.reset);
    headers['Retry-After'] = String(error.retryAfter);
  }

  return NextResponse.json(apiResponse, {
    status: statusCode,
    headers,
  });
}

// ============================================================================
// Request Validation
// ============================================================================

export async function parseBody<T>(
  request: NextRequest,
  schema: ZodSchema<T>
): Promise<T> {
  try {
    const body = await request.json();
    return schema.parse(body);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new ValidationError(
        error.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        }))
      );
    }
    if (error instanceof SyntaxError) {
      throw new ValidationError([
        { field: 'body', message: 'Invalid JSON in request body' },
      ]);
    }
    throw error;
  }
}

export function parseQuery<T>(
  request: NextRequest,
  schema: ZodSchema<T>
): T {
  try {
    const params = Object.fromEntries(request.nextUrl.searchParams.entries());
    return schema.parse(params);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new ValidationError(
        error.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        }))
      );
    }
    throw error;
  }
}

// ============================================================================
// Route Handler Wrapper
// ============================================================================

type RouteHandler = (
  request: NextRequest,
  context: RequestContext
) => Promise<NextResponse>;

interface HandlerOptions {
  rateLimit?: RateLimitConfig | false;
  requireAuth?: boolean;
  cors?: {
    origin?: string | string[];
    methods?: string[];
    headers?: string[];
  };
}

const DEFAULT_CORS = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  headers: ['Content-Type', 'Authorization', 'X-Wallet-Address', 'X-User-Id'],
};

export function withHandler(
  handler: RouteHandler,
  options: HandlerOptions = {}
): (request: NextRequest) => Promise<NextResponse> {
  return async (request: NextRequest): Promise<NextResponse> => {
    const startTime = Date.now();
    const ctx = createRequestContext(request);

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return handleCors(request, options.cors);
    }

    try {
      // Rate limiting
      if (options.rateLimit !== false) {
        const config = { ...DEFAULT_RATE_LIMIT, ...options.rateLimit };
        const key = getRateLimitKey(request, config.keyPrefix || 'rl');
        const { allowed, info } = checkRateLimit(key, config);

        if (!allowed) {
          throw new RateLimitError({
            retryAfter: info.retryAfter || 60,
            limit: info.limit,
            remaining: info.remaining,
            reset: info.reset,
          });
        }
      }

      // Authentication check (placeholder)
      if (options.requireAuth) {
        // TODO: Implement actual auth check
        const authHeader = request.headers.get('authorization');
        if (!authHeader) {
          throw new APIException('UNAUTHORIZED', 'Authentication required');
        }
      }

      // Execute handler
      const response = await handler(request, ctx);
      
      // Add execution time
      const executionTime = Date.now() - startTime;
      response.headers.set('X-Request-Id', ctx.requestId);
      response.headers.set('X-Execution-Time', `${executionTime}ms`);
      
      // Add CORS headers
      addCorsHeaders(response, request, options.cors);
      
      return response;
    } catch (error) {
      logError(error, { requestId: ctx.requestId, path: ctx.path });
      const response = createErrorResponse(error, ctx.requestId);
      addCorsHeaders(response, request, options.cors);
      return response;
    }
  };
}

function handleCors(
  request: NextRequest,
  corsConfig?: HandlerOptions['cors']
): NextResponse {
  const config = { ...DEFAULT_CORS, ...corsConfig };
  const origin = request.headers.get('origin') || '*';
  
  const headers: Record<string, string> = {
    'Access-Control-Allow-Origin': Array.isArray(config.origin)
      ? config.origin.includes(origin) ? origin : config.origin[0]
      : config.origin || '*',
    'Access-Control-Allow-Methods': config.methods?.join(', ') || 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': config.headers?.join(', ') || 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };

  return new NextResponse(null, { status: 204, headers });
}

function addCorsHeaders(
  response: NextResponse,
  request: NextRequest,
  corsConfig?: HandlerOptions['cors']
): void {
  const config = { ...DEFAULT_CORS, ...corsConfig };
  const origin = request.headers.get('origin') || '*';

  response.headers.set(
    'Access-Control-Allow-Origin',
    Array.isArray(config.origin)
      ? config.origin.includes(origin) ? origin : config.origin[0]
      : config.origin || '*'
  );
}

// ============================================================================
// Pagination Helper
// ============================================================================

export function paginate<T>(
  items: T[],
  page: number,
  limit: number
): { items: T[]; meta: APIResponseMeta } {
  const total = items.length;
  const totalPages = Math.ceil(total / limit);
  const offset = (page - 1) * limit;
  const paginatedItems = items.slice(offset, offset + limit);

  return {
    items: paginatedItems,
    meta: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrevious: page > 1,
    },
  };
}

// ============================================================================
// Cache Headers Helper
// ============================================================================

export function setCacheHeaders(
  response: NextResponse,
  options: {
    maxAge?: number;
    staleWhileRevalidate?: number;
    private?: boolean;
  }
): void {
  const directives: string[] = [];
  
  if (options.private) {
    directives.push('private');
  } else {
    directives.push('public');
  }
  
  if (options.maxAge !== undefined) {
    directives.push(`max-age=${options.maxAge}`);
  }
  
  if (options.staleWhileRevalidate !== undefined) {
    directives.push(`stale-while-revalidate=${options.staleWhileRevalidate}`);
  }
  
  response.headers.set('Cache-Control', directives.join(', '));
}

// ============================================================================
// Export all utilities
// ============================================================================

export { parseBody as validateBody, parseQuery as validateQuery };
