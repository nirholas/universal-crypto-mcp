/**
 * Payment Request Handler
 * 
 * Handles X-PAYMENT header validation and 402 Payment Required responses
 * 
 * @author Nich (@nichxbt)
 * @license Apache-2.0
 */

import { NextRequest, NextResponse } from 'next/server';
import { getX402Client } from './x402Client';
import type { 
  PaymentVerification, 
  PaymentRequest, 
  Address,
  ChainId 
} from './types';

// ============================================
// Types
// ============================================

export interface PaymentRequirement {
  amount: string;
  token: string;
  chainId: ChainId;
  recipient: Address;
  description: string;
  serviceId?: string;
}

export interface RequestHandlerOptions {
  requirePayment: boolean;
  paymentRequirement?: PaymentRequirement;
  allowedTokens?: string[];
  allowedChains?: ChainId[];
  maxAge?: number; // Max age of payment in seconds
}

export interface PaymentHandlerResult {
  authorized: boolean;
  verification?: PaymentVerification;
  paymentRequest?: PaymentRequest;
  error?: string;
}

// ============================================
// Payment Header Constants
// ============================================

const X_PAYMENT_HEADER = 'X-PAYMENT';
const X_PAYMENT_REQUEST_HEADER = 'X-PAYMENT-REQUEST';
const X_PAYMENT_STATUS_HEADER = 'X-PAYMENT-STATUS';

// ============================================
// Request Handler Class
// ============================================

export class PaymentRequestHandler {
  private x402Client = getX402Client();

  /**
   * Handle incoming request with payment verification
   */
  async handleRequest(
    request: NextRequest,
    options: RequestHandlerOptions
  ): Promise<PaymentHandlerResult> {
    // Check if payment is required
    if (!options.requirePayment) {
      return { authorized: true };
    }

    // Get payment header
    const paymentHeader = request.headers.get(X_PAYMENT_HEADER);

    // No payment header - return 402 Payment Required
    if (!paymentHeader) {
      if (!options.paymentRequirement) {
        return {
          authorized: false,
          error: 'Payment required but no requirement specified',
        };
      }

      // Create payment request
      const paymentRequest = this.x402Client.createPaymentRequest({
        amount: options.paymentRequirement.amount,
        token: options.paymentRequirement.token,
        chainId: options.paymentRequirement.chainId,
        recipient: options.paymentRequirement.recipient,
        description: options.paymentRequirement.description,
        metadata: {
          serviceId: options.paymentRequirement.serviceId,
          description: options.paymentRequirement.description,
        },
      });

      return {
        authorized: false,
        paymentRequest,
        error: 'Payment required',
      };
    }

    // Verify payment header
    try {
      const verification = await this.x402Client.verifyPayment(paymentHeader);

      // Check if payment is valid
      if (!verification.isValid) {
        return {
          authorized: false,
          verification,
          error: 'Payment verification failed',
        };
      }

      // Check if payment is expired
      const now = Math.floor(Date.now() / 1000);
      if (now > verification.expiresAt) {
        return {
          authorized: false,
          verification,
          error: 'Payment expired',
        };
      }

      // Check max age
      if (options.maxAge && now - verification.timestamp > options.maxAge) {
        return {
          authorized: false,
          verification,
          error: 'Payment too old',
        };
      }

      // Check allowed tokens
      if (options.allowedTokens && !options.allowedTokens.includes(verification.token)) {
        return {
          authorized: false,
          verification,
          error: `Token ${verification.token} not accepted`,
        };
      }

      // Verify amount matches requirement
      if (options.paymentRequirement) {
        const requiredAmount = parseFloat(options.paymentRequirement.amount);
        const paidAmount = parseFloat(verification.amount);
        
        if (paidAmount < requiredAmount) {
          return {
            authorized: false,
            verification,
            error: `Insufficient payment: required ${requiredAmount}, received ${paidAmount}`,
          };
        }
      }

      return {
        authorized: true,
        verification,
      };
    } catch (error) {
      return {
        authorized: false,
        error: error instanceof Error ? error.message : 'Payment verification failed',
      };
    }
  }

  /**
   * Create 402 Payment Required response
   */
  create402Response(
    paymentRequest: PaymentRequest,
    message?: string
  ): NextResponse {
    const paymentRequestEncoded = Buffer.from(
      JSON.stringify({
        id: paymentRequest.id,
        amount: paymentRequest.amount,
        token: paymentRequest.token.symbol,
        chainId: paymentRequest.chainId,
        recipient: paymentRequest.recipient,
        description: paymentRequest.description,
        expiresAt: paymentRequest.expiresAt,
        nonce: paymentRequest.nonce,
      })
    ).toString('base64');

    return NextResponse.json(
      {
        error: 'Payment Required',
        message: message || 'Payment is required to access this resource',
        payment: {
          id: paymentRequest.id,
          amount: paymentRequest.amount,
          token: paymentRequest.token.symbol,
          chainId: paymentRequest.chainId,
          recipient: paymentRequest.recipient,
          description: paymentRequest.description,
          expiresAt: paymentRequest.expiresAt,
        },
      },
      {
        status: 402,
        headers: {
          [X_PAYMENT_REQUEST_HEADER]: paymentRequestEncoded,
          'Content-Type': 'application/json',
        },
      }
    );
  }

  /**
   * Create success response with payment status header
   */
  createSuccessResponse<T>(
    data: T,
    verification: PaymentVerification
  ): NextResponse {
    return NextResponse.json(data, {
      status: 200,
      headers: {
        [X_PAYMENT_STATUS_HEADER]: 'verified',
        'X-Payment-Id': verification.paymentId,
      },
    });
  }

  /**
   * Create error response
   */
  createErrorResponse(error: string, status: number = 400): NextResponse {
    return NextResponse.json(
      { error, success: false },
      { status }
    );
  }
}

// ============================================
// Middleware Helper
// ============================================

export interface PaymentMiddlewareConfig {
  paths: {
    pattern: RegExp | string;
    requirement: PaymentRequirement;
  }[];
  excludePaths?: (RegExp | string)[];
}

/**
 * Create payment middleware
 */
export function createPaymentMiddleware(config: PaymentMiddlewareConfig) {
  const handler = new PaymentRequestHandler();

  return async (request: NextRequest): Promise<NextResponse | null> => {
    const path = request.nextUrl.pathname;

    // Check excluded paths
    if (config.excludePaths) {
      for (const excluded of config.excludePaths) {
        if (typeof excluded === 'string' && path === excluded) {
          return null;
        }
        if (excluded instanceof RegExp && excluded.test(path)) {
          return null;
        }
      }
    }

    // Find matching path
    for (const { pattern, requirement } of config.paths) {
      const matches =
        typeof pattern === 'string'
          ? path === pattern
          : pattern.test(path);

      if (matches) {
        const result = await handler.handleRequest(request, {
          requirePayment: true,
          paymentRequirement: requirement,
        });

        if (!result.authorized) {
          if (result.paymentRequest) {
            return handler.create402Response(result.paymentRequest);
          }
          return handler.createErrorResponse(result.error || 'Payment failed');
        }
      }
    }

    return null; // Continue to next middleware
  };
}

// ============================================
// Route Handler Decorator
// ============================================

type RouteHandler = (
  request: NextRequest,
  context?: { params: Record<string, string> }
) => Promise<NextResponse>;

/**
 * Wrap route handler with payment requirement
 */
export function withPayment(
  requirement: PaymentRequirement,
  handler: RouteHandler
): RouteHandler {
  const paymentHandler = new PaymentRequestHandler();

  return async (request: NextRequest, context?: { params: Record<string, string> }) => {
    const result = await paymentHandler.handleRequest(request, {
      requirePayment: true,
      paymentRequirement: requirement,
    });

    if (!result.authorized) {
      if (result.paymentRequest) {
        return paymentHandler.create402Response(result.paymentRequest);
      }
      return paymentHandler.createErrorResponse(result.error || 'Payment failed');
    }

    // Add payment verification to request headers for downstream use
    if (result.verification) {
      request.headers.set('X-Payment-Verified', 'true');
      request.headers.set('X-Payment-Id', result.verification.paymentId);
      request.headers.set('X-Payment-Sender', result.verification.sender);
    }

    return handler(request, context);
  };
}

// ============================================
// Singleton Instance
// ============================================

let handlerInstance: PaymentRequestHandler | null = null;

export function getPaymentHandler(): PaymentRequestHandler {
  if (!handlerInstance) {
    handlerInstance = new PaymentRequestHandler();
  }
  return handlerInstance;
}

export default PaymentRequestHandler;
