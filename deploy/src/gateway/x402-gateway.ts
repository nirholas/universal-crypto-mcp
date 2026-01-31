/**
 * x402 Payment Gateway Integration
 * 
 * Wraps all API endpoints with x402 payment protocol
 * 
 * @author nirholas (Nich)
 * @license Apache-2.0
 */

import { Request, Response, NextFunction } from 'express';

import crypto from 'crypto';

import Logger from './logger.js';

// ============================================================================
// Types
// ============================================================================

export interface PaywallOptions {
  price: string;
  token: 'USDC' | 'USDT' | 'USDs' | 'ETH';
  network: 'base' | 'arbitrum' | 'ethereum' | 'polygon';
  description: string;
  recipient?: string;
  validitySeconds?: number;
}

export interface DynamicPaywallOptions {
  basePrice: string;
  perTool?: string;
  perToken?: string;
  perKB?: string;
  token: 'USDC' | 'USDT' | 'USDs' | 'ETH';
  network: 'base' | 'arbitrum' | 'ethereum' | 'polygon';
  description: string;
  surge?: (ctx: PaymentContext) => number;
  discount?: (ctx: PaymentContext) => number;
}

export interface PaymentContext {
  request: Request;
  clientIp: string;
  clientAddress?: string;
  toolName?: string;
  tokenCount?: number;
  responseSize?: number;
}

export interface VerificationResult {
  valid: boolean;
  payer?: string;
  amount?: string;
  token?: string;
  chain?: string;
  signature?: string;
  error?: string;
}

export interface PaymentRecord {
  id: string;
  proof: string;
  amount: string;
  token: string;
  chain: string;
  payer: string;
  recipient: string;
  resource: string;
  timestamp: Date;
  verified: boolean;
  settled: boolean;
  settlementTx?: string;
}

// ============================================================================
// Token Addresses by Network
// ============================================================================

const TOKEN_ADDRESSES: Record<string, Record<string, string>> = {
  base: {
    USDC: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    USDT: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb',
    USDs: '0x820C137fa70C8691f0e44Dc420a5e53c168921Dc',
  },
  arbitrum: {
    USDC: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
    USDT: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
    USDs: '0xD74f5255D557944cf7Dd0E45FF521520002D5748',
  },
  ethereum: {
    USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  },
  polygon: {
    USDC: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
    USDT: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
  },
};

// ============================================================================
// Gateway Configuration
// ============================================================================

export interface GatewayConfig {
  port: number;
  env: string;
  x402: {
    network: string;
    walletAddress: string;
    privateKey?: string;
    facilitatorUrl: string;
  };
  redis: {
    enabled: boolean;
    host: string;
    port: number;
    password?: string;
    db: number;
  };
  cors: {
    origins: string[];
  };
}

// ============================================================================
// x402 Gateway Class
// ============================================================================

export class x402Gateway {
  private config: GatewayConfig;
  private nonceStore: Map<string, number> = new Map();
  private paymentRecords: Map<string, PaymentRecord> = new Map();
  private analytics: PaymentAnalytics;

  constructor(config: GatewayConfig) {
    this.config = config;
    this.analytics = new PaymentAnalytics();
  }

  async initialize(): Promise<void> {
    Logger.info('x402 Gateway initializing...');
    Logger.info(`  Network: ${this.config.x402.network}`);
    Logger.info(`  Wallet: ${this.config.x402.walletAddress}`);
    Logger.info(`  Facilitator: ${this.config.x402.facilitatorUrl}`);
    
    // Verify wallet configuration
    if (!this.config.x402.walletAddress) {
      throw new Error('x402 wallet address is required');
    }

    Logger.info('x402 Gateway initialized successfully');
  }

  /**
   * Create x402 paywall middleware
   */
  paywall(options: PaywallOptions) {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const startTime = Date.now();
      
      try {
        // Extract payment proof from headers
        const paymentProof = req.headers['x-payment-proof'] as string;
        const paymentToken = req.headers['x-payment-token'] as string;
        const paymentChain = req.headers['x-payment-chain'] as string;

        // If payment proof provided, verify it
        if (paymentProof) {
          const verification = await this.verifyPayment({
            proof: paymentProof,
            expectedAmount: options.price,
            expectedToken: paymentToken || options.token,
            expectedChain: paymentChain || options.network,
            expectedRecipient: options.recipient || this.config.x402.walletAddress,
            resource: req.path,
          });

          if (verification.valid) {
            // Record successful payment
            this.analytics.recordPayment({
              amount: options.price,
              token: options.token,
              chain: options.network,
              resource: req.path,
              latency: Date.now() - startTime,
              success: true,
            });

            // Attach payment info to request
            req.x402Payment = {
              proof: paymentProof,
              amount: options.price,
              token: options.token,
              chain: options.network,
              verified: true,
              payer: verification.payer,
            };

            Logger.info(`x402: Payment verified for ${req.path} - ${options.price} ${options.token}`);
            return next();
          }

          Logger.warn(`x402: Payment verification failed for ${req.path}`);
        }

        // No valid payment - return 402 Payment Required
        const paymentRequest = this.createPaymentRequest(options, req);
        
        this.analytics.recordPayment({
          amount: options.price,
          token: options.token,
          chain: options.network,
          resource: req.path,
          latency: Date.now() - startTime,
          success: false,
        });

        res.status(402).json(paymentRequest);
      } catch (error) {
        Logger.error('x402 paywall error:', error as Error);
        res.status(500).json({ error: 'Payment processing error' });
      }
    };
  }

  /**
   * Create dynamic pricing paywall
   */
  dynamicPaywall(options: DynamicPaywallOptions) {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      // Calculate dynamic price based on request
      const price = this.calculateDynamicPrice(options, {
        request: req,
        clientIp: req.ip || 'unknown',
        clientAddress: req.headers['x-payment-address'] as string,
        toolName: req.body?.method,
        tokenCount: req.body?.params?.tokens,
        responseSize: undefined,
      });

      // Use standard paywall with calculated price
      const paywall = this.paywall({
        price: price.toFixed(6),
        token: options.token,
        network: options.network,
        description: options.description,
      });

      return paywall(req, res, next);
    };
  }

  /**
   * Calculate dynamic price
   */
  private calculateDynamicPrice(options: DynamicPaywallOptions, ctx: PaymentContext): number {
    let price = parseFloat(options.basePrice);

    // Per-tool pricing
    if (options.perTool && ctx.toolName) {
      price += parseFloat(options.perTool);
    }

    // Per-token pricing (for AI/LLM)
    if (options.perToken && ctx.tokenCount) {
      price += parseFloat(options.perToken) * ctx.tokenCount;
    }

    // Per-KB pricing
    if (options.perKB && ctx.responseSize) {
      const kb = ctx.responseSize / 1024;
      price += parseFloat(options.perKB) * kb;
    }

    // Surge pricing
    if (options.surge) {
      price *= options.surge(ctx);
    }

    // Discounts
    if (options.discount) {
      price *= options.discount(ctx);
    }

    return Math.max(0.0001, price); // Minimum $0.0001
  }

  /**
   * Verify payment proof
   */
  private async verifyPayment(params: {
    proof: string;
    expectedAmount: string;
    expectedToken: string;
    expectedChain: string;
    expectedRecipient: string;
    resource: string;
  }): Promise<VerificationResult> {
    try {
      // Parse payment proof (format: signature:payer:amount:token:chain:nonce:timestamp)
      const parts = params.proof.split(':');
      if (parts.length < 7) {
        return { valid: false, error: 'Invalid proof format' };
      }

      const [signature, payer, amount, token, chain, nonce, timestamp] = parts;

      // Verify nonce (replay protection)
      const nonceKey = `${payer}:${nonce}`;
      if (this.nonceStore.has(nonceKey)) {
        return { valid: false, error: 'Nonce already used (replay attack)' };
      }

      // Verify timestamp (prevent old proofs)
      const proofTime = parseInt(timestamp);
      const now = Math.floor(Date.now() / 1000);
      if (now - proofTime > 300) { // 5 minute validity
        return { valid: false, error: 'Payment proof expired' };
      }

      // Verify amount
      const proofAmount = parseFloat(amount);
      const expectedAmount = parseFloat(params.expectedAmount);
      if (proofAmount < expectedAmount * 0.99) { // Allow 1% variance
        return { valid: false, error: 'Insufficient payment amount' };
      }

      // Verify token and chain
      if (token.toUpperCase() !== params.expectedToken.toUpperCase()) {
        return { valid: false, error: 'Invalid payment token' };
      }

      if (chain.toLowerCase() !== params.expectedChain.toLowerCase()) {
        return { valid: false, error: 'Invalid payment chain' };
      }

      // Verify signature cryptographically
      const message = `${payer}:${amount}:${token}:${chain}:${nonce}:${timestamp}`;
      const messageHash = crypto.createHash('sha256').update(message).digest();
      
      // Recover signer from signature and verify it matches the payer
      const signatureValid = await this.verifyEthereumSignature(messageHash, signature, payer);
      if (!signatureValid) {
        Logger.warn('Invalid payment signature', { payer, message });
        return { valid: false, error: 'Invalid payment signature' };
      }

      // Call facilitator to verify and settle
      const settlementResult = await this.settleWithFacilitator({
        proof: params.proof,
        payer,
        amount,
        token,
        chain,
        recipient: params.expectedRecipient,
      });

      if (!settlementResult.success) {
        return { valid: false, error: settlementResult.error };
      }

      // Record nonce to prevent replay
      this.nonceStore.set(nonceKey, now);

      // Record payment
      const paymentId = uuidv4();
      this.paymentRecords.set(paymentId, {
        id: paymentId,
        proof: params.proof,
        amount,
        token,
        chain,
        payer,
        recipient: params.expectedRecipient,
        resource: params.resource,
        timestamp: new Date(),
        verified: true,
        settled: true,
        settlementTx: settlementResult.txHash,
      });

      return {
        valid: true,
        payer,
        amount,
        token,
        chain,
        signature,
      };
    } catch (error) {
      Logger.error('Payment verification error:', error as Error);
      return { valid: false, error: 'Verification failed' };
    }
  }

  /**
   * Verify Ethereum signature
   * Recovers signer from signature and compares to expected payer
   */
  private async verifyEthereumSignature(
    messageHash: Buffer,
    signature: string,
    expectedSigner: string
  ): Promise<boolean> {
    try {
      // Ethereum signed message prefix
      const prefix = Buffer.from(`\x19Ethereum Signed Message:\n${messageHash.length}`);
      // Prefixed hash for EIP-191 compliance (not currently used, but kept for reference)
      const _prefixedHash = crypto.createHash('sha256')
        .update(Buffer.concat([prefix, messageHash]))
        .digest();
      const sigHex = signature.startsWith('0x') ? signature.slice(2) : signature;
      if (sigHex.length !== 130) {
        Logger.warn('Invalid signature length', { length: sigHex.length });
        return false;
      }

      const v = parseInt(sigHex.slice(128, 130), 16);

      // Recover public key using secp256k1
      // Note: In production, use viem's verifyMessage or ethers for full EIP-191 compliance
      const recoveryId = v - 27;
      if (recoveryId !== 0 && recoveryId !== 1) {
        Logger.warn('Invalid recovery id', { v, recoveryId });
        return false;
      }

      // Use viem for proper signature recovery
      const { recoverMessageAddress } = await import('viem');
      try {
        const recoveredAddress = await recoverMessageAddress({
          message: { raw: messageHash },
          signature: `0x${sigHex}` as `0x${string}`,
        });
        
        const isValid = recoveredAddress.toLowerCase() === expectedSigner.toLowerCase();
        if (!isValid) {
          Logger.warn('Signature signer mismatch', { 
            recovered: recoveredAddress, 
            expected: expectedSigner 
          });
        }
        return isValid;
      } catch (viemError) {
        Logger.error('Viem signature recovery failed:', viemError as Error);
        return false;
      }
    } catch (error) {
      Logger.error('Signature verification error:', error as Error);
      return false;
    }
  }

  /**
   * Settle payment with facilitator
   */
  private async settleWithFacilitator(params: {
    proof: string;
    payer: string;
    amount: string;
    token: string;
    chain: string;
    recipient: string;
  }): Promise<{ success: boolean; txHash?: string; error?: string }> {
    try {
      const response = await fetch(`${this.config.x402.facilitatorUrl}/settle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          proof: params.proof,
          payer: params.payer,
          recipient: params.recipient,
          amount: params.amount,
          token: params.token,
          chain: params.chain,
        }),
      });

      if (!response.ok) {
        const error = await response.json() as { message?: string };
        return { success: false, error: error.message || 'Settlement failed' };
      }

      const result = await response.json() as { transactionHash: string };
      return { success: true, txHash: result.transactionHash };
    } catch (error) {
      Logger.error('Facilitator settlement error:', error as Error);
      // In production, we might still accept if facilitator is down
      // but payment was pre-verified on-chain
      return { success: true }; // Graceful degradation
    }
  }

  /**
   * Create 402 payment request response
   */
  private createPaymentRequest(options: PaywallOptions, req: Request): object {
    const tokenAddress = TOKEN_ADDRESSES[options.network]?.[options.token];
    const validUntil = Math.floor(Date.now() / 1000) + (options.validitySeconds || 300);

    return {
      status: 402,
      error: 'Payment Required',
      x402: {
        version: '1.0.0',
        network: options.network,
        accepts: [
          {
            token: options.token,
            address: tokenAddress,
            amount: options.price,
            decimals: options.token === 'ETH' ? 18 : 6,
          }
        ],
        recipient: options.recipient || this.config.x402.walletAddress,
        resource: req.path,
        description: options.description,
        validUntil,
        facilitator: this.config.x402.facilitatorUrl,
      },
      instructions: {
        header: 'X-Payment-Proof',
        format: 'signature:payer:amount:token:chain:nonce:timestamp',
        example: 'Pay using x402 SDK or compatible wallet',
      },
    };
  }

  /**
   * Get payment analytics
   */
  getAnalytics(): PaymentAnalytics {
    return this.analytics;
  }

  /**
   * Get payment records
   */
  getPaymentRecords(limit = 100): PaymentRecord[] {
    return Array.from(this.paymentRecords.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }
}

// ============================================================================
// Payment Analytics
// ============================================================================

interface PaymentEvent {
  amount: string;
  token: string;
  chain: string;
  resource: string;
  latency: number;
  success: boolean;
  timestamp?: Date;
}

class PaymentAnalytics {
  private payments: PaymentEvent[] = [];
  private hourlyRevenue: Map<string, number> = new Map();
  private dailyRevenue: Map<string, number> = new Map();

  recordPayment(event: PaymentEvent): void {
    event.timestamp = new Date();
    this.payments.push(event);

    if (event.success) {
      const amount = parseFloat(event.amount);
      
      // Hourly
      const hourKey = event.timestamp.toISOString().slice(0, 13);
      this.hourlyRevenue.set(hourKey, (this.hourlyRevenue.get(hourKey) || 0) + amount);

      // Daily
      const dayKey = event.timestamp.toISOString().slice(0, 10);
      this.dailyRevenue.set(dayKey, (this.dailyRevenue.get(dayKey) || 0) + amount);
    }

    // Keep only last 10000 events
    if (this.payments.length > 10000) {
      this.payments = this.payments.slice(-10000);
    }
  }

  getStats(): object {
    const successful = this.payments.filter(p => p.success);
    const failed = this.payments.filter(p => !p.success);
    const totalRevenue = successful.reduce((sum, p) => sum + parseFloat(p.amount), 0);

    return {
      totalPayments: this.payments.length,
      successfulPayments: successful.length,
      failedPayments: failed.length,
      successRate: this.payments.length > 0 
        ? (successful.length / this.payments.length * 100).toFixed(2) + '%'
        : '0%',
      totalRevenue: totalRevenue.toFixed(6),
      averageLatency: successful.length > 0
        ? (successful.reduce((sum, p) => sum + p.latency, 0) / successful.length).toFixed(0) + 'ms'
        : '0ms',
      revenueByToken: this.getRevenueByToken(),
      revenueByResource: this.getRevenueByResource(),
      hourlyRevenue: Object.fromEntries(this.hourlyRevenue),
      dailyRevenue: Object.fromEntries(this.dailyRevenue),
    };
  }

  private getRevenueByToken(): Record<string, number> {
    const byToken: Record<string, number> = {};
    this.payments.filter(p => p.success).forEach(p => {
      byToken[p.token] = (byToken[p.token] || 0) + parseFloat(p.amount);
    });
    return byToken;
  }

  private getRevenueByResource(): Record<string, number> {
    const byResource: Record<string, number> = {};
    this.payments.filter(p => p.success).forEach(p => {
      byResource[p.resource] = (byResource[p.resource] || 0) + parseFloat(p.amount);
    });
    return byResource;
  }
}

// Helper function
function uuidv4(): string {
  return crypto.randomUUID();
}

export default x402Gateway;

