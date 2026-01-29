/**
 * x402 Payment Middleware
 * MCP tool payment gating middleware
 */

import type { X402Config, PaymentRequiredResponse } from './types.js';
import { X402PaymentService } from './service.js';
import { logger } from '../utils/logger.js';
import { getToolCategory } from '../auth/index.js';

/**
 * MCP Tool call context with payment info
 */
export interface ToolCallContext {
  toolName: string;
  arguments: Record<string, unknown>;
  headers?: Record<string, string>;
  metadata?: Record<string, unknown>;
}

/**
 * Payment middleware result
 */
export interface PaymentMiddlewareResult {
  allowed: boolean;
  paymentRequired?: PaymentRequiredResponse;
  paymentVerified?: boolean;
  settlementPending?: boolean;
  error?: string;
}

/**
 * x402 Payment Middleware for MCP Tools
 * 
 * Intercepts tool calls and enforces payment requirements:
 * 1. Check if tool requires payment
 * 2. If no payment header, return 402 with requirements
 * 3. If payment header present, verify payment
 * 4. If verified, allow tool execution
 * 5. After execution, settle payment
 */
export class X402PaymentMiddleware {
  private service: X402PaymentService;

  constructor(config: X402Config) {
    this.service = new X402PaymentService(config);
  }

  /**
   * Check if a tool call is allowed (pre-execution)
   */
  async checkToolCall(context: ToolCallContext): Promise<PaymentMiddlewareResult> {
    const { toolName, headers } = context;
    const category = getToolCategory(toolName);

    // Check if payment is required
    if (!this.service.requiresPayment(toolName, category)) {
      return { allowed: true };
    }

    // Get payment header
    const paymentHeader = headers?.['x-payment'] || headers?.['X-PAYMENT'];

    // No payment provided - return 402
    if (!paymentHeader) {
      logger.debug({ toolName }, 'Payment required for tool');
      
      return {
        allowed: false,
        paymentRequired: this.service.buildPaymentRequiredResponse(
          toolName,
          category,
          `tool://${toolName}`
        ),
      };
    }

    // Verify payment
    const verification = await this.service.verifyPayment(
      paymentHeader,
      toolName,
      category
    );

    if (!verification.isValid) {
      logger.warn({ toolName, reason: verification.invalidReason }, 'Payment verification failed');
      
      return {
        allowed: false,
        error: verification.invalidReason || 'Payment verification failed',
        paymentRequired: this.service.buildPaymentRequiredResponse(
          toolName,
          category,
          `tool://${toolName}`
        ),
      };
    }

    logger.info({ 
      toolName, 
      payer: verification.payer,
      amount: verification.amount,
    }, 'Payment verified');

    return {
      allowed: true,
      paymentVerified: true,
      settlementPending: true,
    };
  }

  /**
   * Settle payment after successful tool execution
   */
  async settleAfterExecution(
    context: ToolCallContext,
    success: boolean
  ): Promise<{ settled: boolean; transactionHash?: string; error?: string }> {
    const { toolName, headers } = context;
    const paymentHeader = headers?.['x-payment'] || headers?.['X-PAYMENT'];

    // Only settle if payment was provided and execution succeeded
    if (!paymentHeader || !success) {
      return { settled: false };
    }

    const category = getToolCategory(toolName);
    
    // Use retry logic for settlement
    const settlement = await this.service.settlePaymentWithRetry(
      paymentHeader,
      toolName,
      category
    );

    if (settlement.success) {
      logger.info({ 
        toolName, 
        transactionHash: settlement.transactionHash,
      }, 'Payment settled');
    } else {
      logger.error({ 
        toolName, 
        error: settlement.error,
      }, 'Payment settlement failed');
    }

    return {
      settled: settlement.success,
      transactionHash: settlement.transactionHash,
      error: settlement.error,
    };
  }

  /**
   * Get payment service instance
   */
  getService(): X402PaymentService {
    return this.service;
  }

  /**
   * Add event handler
   */
  onPaymentEvent(handler: (event: any) => void): void {
    this.service.onEvent(handler);
  }
}

/**
 * Create payment-gated tool wrapper
 * Wraps a tool handler with payment verification
 */
export function withPaymentGating<TInput, TOutput>(
  middleware: X402PaymentMiddleware,
  toolName: string,
  handler: (input: TInput) => Promise<TOutput>
): (input: TInput, headers?: Record<string, string>) => Promise<TOutput | PaymentRequiredResponse> {
  return async (input: TInput, headers?: Record<string, string>) => {
    // Check payment
    const result = await middleware.checkToolCall({
      toolName,
      arguments: input as Record<string, unknown>,
      headers,
    });

    // Payment required
    if (!result.allowed && result.paymentRequired) {
      return result.paymentRequired;
    }

    // Payment error
    if (!result.allowed) {
      throw new Error(result.error || 'Payment required');
    }

    // Execute handler
    let success = false;
    let output: TOutput;
    
    try {
      output = await handler(input);
      success = true;
    } catch (error) {
      // Don't settle on failure
      throw error;
    }

    // Settle payment
    if (result.settlementPending) {
      await middleware.settleAfterExecution(
        { toolName, arguments: input as Record<string, unknown>, headers },
        success
      );
    }

    return output;
  };
}

/**
 * Create x402 middleware from environment
 */
export function createX402MiddlewareFromEnv(): X402PaymentMiddleware | null {
  const payToAddress = process.env.X402_PAY_TO_ADDRESS;
  
  if (!payToAddress) {
    logger.info('x402 payments disabled (X402_PAY_TO_ADDRESS not set)');
    return null;
  }

  const network = (process.env.X402_NETWORK || 'eip155:8453') as any;
  const facilitatorUrl = process.env.X402_FACILITATOR_URL || 'https://x402.org/facilitator';

  const config: X402Config = {
    enabled: true,
    payToAddress,
    defaultNetwork: network,
    facilitatorUrl,
    defaultPrice: process.env.X402_DEFAULT_PRICE || '$0.001',
    paywall: {
      appName: process.env.X402_APP_NAME || 'Boosty DeFi',
      appLogo: process.env.X402_APP_LOGO,
      cdpClientKey: process.env.CDP_CLIENT_KEY,
    },
  };

  return new X402PaymentMiddleware(config);
}
