/**
 * x402 Payment Service
 * Core payment verification and settlement using the x402 protocol
 */

import type {
  X402Config,
  PaymentVerification,
  PaymentSettlement,
  PaymentSession,
  ToolPaymentRequirements,
  PaymentRequiredResponse,
  PaymentRequirementsList,
  PaymentEvent,
  PaymentEventHandler,
  PaymentNetwork,
} from './types.js';
import { getToolPrice, parsePrice } from './config.js';
import { logger } from '../utils/logger.js';

// USDC token addresses per network - comprehensive list
const USDC_ADDRESSES: Record<string, { address: string; decimals: number; symbol: string; chainName: string }> = {
  // EVM Networks
  'eip155:8453': {
    address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    decimals: 6,
    symbol: 'USDC',
    chainName: 'Base Mainnet',
  },
  'eip155:84532': {
    address: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
    decimals: 6,
    symbol: 'USDC',
    chainName: 'Base Sepolia',
  },
  'eip155:1': {
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    decimals: 6,
    symbol: 'USDC',
    chainName: 'Ethereum Mainnet',
  },
  'eip155:42161': {
    address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
    decimals: 6,
    symbol: 'USDC',
    chainName: 'Arbitrum One',
  },
  'eip155:10': {
    address: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85',
    decimals: 6,
    symbol: 'USDC',
    chainName: 'Optimism',
  },
  'eip155:137': {
    address: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
    decimals: 6,
    symbol: 'USDC',
    chainName: 'Polygon',
  },
  // Solana Networks
  'solana:mainnet': {
    address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    decimals: 6,
    symbol: 'USDC',
    chainName: 'Solana Mainnet',
  },
  'solana:devnet': {
    address: '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU',
    decimals: 6,
    symbol: 'USDC',
    chainName: 'Solana Devnet',
  },
};

// Payment analytics tracking
interface PaymentAnalytics {
  totalPayments: number;
  totalRevenue: bigint; // in atomic units
  paymentsByTool: Map<string, { count: number; revenue: bigint }>;
  paymentsByNetwork: Map<string, { count: number; revenue: bigint }>;
  failedPayments: number;
  averageSettlementTime: number;
}

// Webhook configuration
interface WebhookConfig {
  url: string;
  secret?: string;
  events: ('payment_required' | 'payment_verified' | 'payment_settled' | 'payment_failed')[];
}

// Settlement retry configuration
const SETTLEMENT_RETRY_CONFIG = {
  maxRetries: 3,
  initialDelayMs: 1000,
  maxDelayMs: 10000,
  backoffMultiplier: 2,
};

/**
 * x402 Payment Service
 * Handles payment verification, settlement, and session management
 */
export class X402PaymentService {
  private config: X402Config;
  private sessions: Map<string, PaymentSession> = new Map();
  private eventHandlers: PaymentEventHandler[] = [];
  private webhooks: WebhookConfig[] = [];
  
  // Lazy-loaded x402 modules (to avoid import issues if not installed)
  private resourceServer: any = null;
  private facilitatorClient: any = null;
  private initialized: boolean = false;

  // Analytics tracking
  private analytics: PaymentAnalytics = {
    totalPayments: 0,
    totalRevenue: BigInt(0),
    paymentsByTool: new Map(),
    paymentsByNetwork: new Map(),
    failedPayments: 0,
    averageSettlementTime: 0,
  };
  private settlementTimes: number[] = [];

  constructor(config: X402Config) {
    this.config = config;
    
    if (config.enabled) {
      logger.info({ 
        payTo: config.payToAddress,
        network: config.defaultNetwork,
        facilitator: config.facilitatorUrl,
        supportedNetworks: Object.keys(USDC_ADDRESSES).filter(n => n.startsWith('eip155:') || n.startsWith('solana:')),
      }, 'x402 Payment Service initialized');

      // Load webhooks from env
      this.loadWebhooksFromEnv();
      
      // Start session cleanup interval
      setInterval(() => this.cleanupSessions(), 60000);
    }
  }

  /**
   * Load webhook configurations from environment
   */
  private loadWebhooksFromEnv(): void {
    const webhookUrl = process.env.X402_WEBHOOK_URL;
    if (webhookUrl) {
      this.webhooks.push({
        url: webhookUrl,
        secret: process.env.X402_WEBHOOK_SECRET,
        events: ['payment_verified', 'payment_settled', 'payment_failed'],
      });
      logger.info({ url: webhookUrl }, 'x402 webhook configured');
    }
  }

  /**
   * Add a webhook for payment events
   */
  addWebhook(config: WebhookConfig): void {
    this.webhooks.push(config);
  }

  /**
   * Initialize x402 SDK (lazy loading)
   */
  private async initializeX402(): Promise<void> {
    if (this.initialized || !this.config.enabled) {
      return;
    }

    try {
      // Dynamic imports to handle missing packages gracefully
      const { x402ResourceServer, HTTPFacilitatorClient } = await import('@x402/core/server');
      const { ExactEvmScheme } = await import('@x402/evm/exact/server');

      // Create facilitator client
      this.facilitatorClient = new HTTPFacilitatorClient({
        url: this.config.facilitatorUrl || 'https://x402.org/facilitator',
      });

      // Create resource server with EVM support
      this.resourceServer = new x402ResourceServer(this.facilitatorClient);
      
      // Register EVM schemes for supported networks
      if (this.config.defaultNetwork.startsWith('eip155:')) {
        this.resourceServer.register(this.config.defaultNetwork, new ExactEvmScheme());
      }

      // Try to add Solana support if available
      try {
        const { ExactSvmScheme } = await import('@x402/svm/exact/server');
        if (this.config.defaultNetwork.startsWith('solana:')) {
          this.resourceServer.register(this.config.defaultNetwork, new ExactSvmScheme());
        }
      } catch {
        // Solana support not available
        logger.debug('Solana x402 support not available');
      }

      this.initialized = true;
      logger.info('x402 SDK initialized successfully');
    } catch (error) {
      logger.warn({ error }, 'x402 SDK not available - payments disabled');
      this.config.enabled = false;
    }
  }

  /**
   * Check if a tool requires payment
   */
  requiresPayment(toolName: string, category?: string): boolean {
    if (!this.config.enabled) {
      return false;
    }

    const pricing = getToolPrice(this.config, toolName, category);
    return pricing.requiresPayment;
  }

  /**
   * Get payment requirements for a tool
   */
  getPaymentRequirements(
    toolName: string,
    category?: string,
    resourceUrl?: string
  ): ToolPaymentRequirements {
    const pricing = getToolPrice(this.config, toolName, category);

    return {
      tool: toolName,
      price: pricing.price,
      network: pricing.network,
      payTo: this.config.payToAddress,
      description: `Payment for ${toolName} tool`,
      resource: resourceUrl || `tool://${toolName}`,
    };
  }

  /**
   * Build HTTP 402 Payment Required response
   */
  buildPaymentRequiredResponse(
    toolName: string,
    category?: string,
    resourceUrl?: string
  ): PaymentRequiredResponse {
    const requirements = this.getPaymentRequirements(toolName, category, resourceUrl);
    const asset = USDC_ADDRESSES[requirements.network];
    
    if (!asset) {
      throw new Error(`No USDC address configured for network: ${requirements.network}`);
    }
    
    const atomicAmount = parsePrice(
      typeof requirements.price === 'string' ? requirements.price : requirements.price.amount,
      asset.decimals
    );

    const accepts: PaymentRequirementsList[] = [{
      scheme: 'exact',
      network: requirements.network,
      maxAmountRequired: atomicAmount,
      resource: requirements.resource,
      description: requirements.description,
      mimeType: 'application/json',
      payTo: requirements.payTo,
      maxTimeoutSeconds: 300,
      asset,
    }];

    this.emitEvent({
      type: 'payment_required',
      tool: toolName,
      amount: atomicAmount,
      network: requirements.network,
      timestamp: new Date(),
    });

    return {
      x402Version: 2,
      error: 'Payment Required',
      accepts,
    };
  }

  /**
   * Verify a payment from the X-PAYMENT header
   */
  async verifyPayment(
    paymentHeader: string,
    toolName: string,
    category?: string
  ): Promise<PaymentVerification> {
    if (!this.config.enabled) {
      return { isValid: true };
    }

    await this.initializeX402();

    if (!this.resourceServer) {
      logger.warn('x402 not initialized, allowing request');
      return { isValid: true };
    }

    try {
      // Decode payment payload
      const paymentPayload = JSON.parse(
        Buffer.from(paymentHeader, 'base64').toString('utf-8')
      );

      // Get requirements for this tool
      const requirements = this.getPaymentRequirements(toolName, category);
      const asset = USDC_ADDRESSES[requirements.network];
      
      if (!asset) {
        throw new Error(`No USDC address configured for network: ${requirements.network}`);
      }
      
      const atomicAmount = parsePrice(
        typeof requirements.price === 'string' ? requirements.price : requirements.price.amount,
        asset.decimals
      );

      // Build payment requirements for verification
      const paymentRequirements = {
        scheme: 'exact' as const,
        network: requirements.network,
        maxAmountRequired: atomicAmount,
        payTo: requirements.payTo,
        asset,
      };

      // Verify with x402
      const result = await this.resourceServer.verifyPayment(
        paymentPayload,
        paymentRequirements
      );

      if (result.isValid) {
        // Create session for settlement
        const session: PaymentSession = {
          sessionId: this.generateSessionId(),
          payer: result.payer || 'unknown',
          tool: toolName,
          amount: atomicAmount,
          network: requirements.network,
          verified: true,
          settled: false,
          createdAt: new Date(),
          expiresAt: new Date(Date.now() + 300000), // 5 minutes
        };
        this.sessions.set(session.sessionId, session);

        this.emitEvent({
          type: 'payment_verified',
          tool: toolName,
          payer: result.payer,
          amount: atomicAmount,
          network: requirements.network,
          timestamp: new Date(),
        });

        return {
          isValid: true,
          payer: result.payer,
          amount: atomicAmount,
          network: requirements.network,
        };
      }

      this.emitEvent({
        type: 'payment_failed',
        tool: toolName,
        error: result.invalidReason,
        timestamp: new Date(),
      });

      return {
        isValid: false,
        invalidReason: result.invalidReason,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error({ error, toolName }, 'Payment verification failed');

      this.emitEvent({
        type: 'payment_failed',
        tool: toolName,
        error: errorMessage,
        timestamp: new Date(),
      });

      return {
        isValid: false,
        invalidReason: errorMessage,
      };
    }
  }

  /**
   * Settle a verified payment
   */
  async settlePayment(
    paymentHeader: string,
    toolName: string,
    category?: string
  ): Promise<PaymentSettlement> {
    const startTime = Date.now();
    
    if (!this.config.enabled) {
      return { success: true };
    }

    await this.initializeX402();

    if (!this.resourceServer) {
      return { success: true };
    }

    try {
      // Decode payment payload
      const paymentPayload = JSON.parse(
        Buffer.from(paymentHeader, 'base64').toString('utf-8')
      );

      // Get requirements
      const requirements = this.getPaymentRequirements(toolName, category);
      const asset = USDC_ADDRESSES[requirements.network];
      if (!asset) {
        throw new Error(`Unsupported network: ${requirements.network}`);
      }
      
      const atomicAmount = parsePrice(
        typeof requirements.price === 'string' ? requirements.price : requirements.price.amount,
        asset.decimals
      );

      const paymentRequirements = {
        scheme: 'exact' as const,
        network: requirements.network,
        maxAmountRequired: atomicAmount,
        payTo: requirements.payTo,
        asset,
      };

      // Settle with x402
      const result = await this.resourceServer.settlePayment(
        paymentPayload,
        paymentRequirements
      );

      if (result.success) {
        // Track analytics
        this.trackPayment(toolName, atomicAmount, requirements.network);
        this.trackSettlementTime(startTime);

        this.emitEvent({
          type: 'payment_settled',
          tool: toolName,
          amount: atomicAmount,
          network: requirements.network,
          timestamp: new Date(),
          metadata: { transactionHash: result.transaction },
        });

        return {
          success: true,
          transactionHash: result.transaction,
          settledAt: new Date(),
        };
      }

      this.trackFailedPayment();
      return {
        success: false,
        error: result.errorMessage || 'Settlement failed',
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error({ error, toolName }, 'Payment settlement failed');
      this.trackFailedPayment();

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Add event handler for payment events
   */
  onEvent(handler: PaymentEventHandler): void {
    this.eventHandlers.push(handler);
  }

  /**
   * Emit payment event to all handlers and webhooks
   */
  private emitEvent(event: PaymentEvent): void {
    // Call local handlers
    for (const handler of this.eventHandlers) {
      try {
        handler(event);
      } catch (error) {
        logger.error({ error }, 'Payment event handler error');
      }
    }

    // Deliver to webhooks asynchronously
    this.deliverWebhooks(event).catch(err => {
      logger.error({ error: err }, 'Webhook delivery failed');
    });
  }

  /**
   * Deliver event to configured webhooks
   */
  private async deliverWebhooks(event: PaymentEvent): Promise<void> {
    const relevantWebhooks = this.webhooks.filter(
      w => w.events.includes(event.type)
    );

    for (const webhook of relevantWebhooks) {
      try {
        const payload = JSON.stringify({
          event: event.type,
          data: event,
          timestamp: event.timestamp.toISOString(),
        });

        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          'X-Boosty-Event': event.type,
        };

        // Add signature if secret configured
        if (webhook.secret) {
          const crypto = await import('crypto');
          const signature = crypto
            .createHmac('sha256', webhook.secret)
            .update(payload)
            .digest('hex');
          headers['X-Boosty-Signature'] = `sha256=${signature}`;
        }

        await fetch(webhook.url, {
          method: 'POST',
          headers,
          body: payload,
        });

        logger.debug({ url: webhook.url, event: event.type }, 'Webhook delivered');
      } catch (error) {
        logger.error({ error, url: webhook.url }, 'Webhook delivery failed');
      }
    }
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return `x402_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  /**
   * Clean up expired sessions
   */
  cleanupSessions(): void {
    const now = new Date();
    for (const [id, session] of this.sessions) {
      if (session.expiresAt < now) {
        this.sessions.delete(id);
      }
    }
  }

  /**
   * Get payment statistics
   */
  getStats(): {
    enabled: boolean;
    activeSessions: number;
    network: PaymentNetwork;
    payTo: string;
  } {
    return {
      enabled: this.config.enabled,
      activeSessions: this.sessions.size,
      network: this.config.defaultNetwork,
      payTo: this.config.payToAddress,
    };
  }

  /**
   * Get detailed analytics
   */
  getAnalytics(): {
    totalPayments: number;
    totalRevenue: string;
    failedPayments: number;
    successRate: number;
    averageSettlementTimeMs: number;
    topTools: Array<{ tool: string; count: number; revenue: string }>;
    networkBreakdown: Array<{ network: string; count: number; revenue: string }>;
  } {
    const topTools = Array.from(this.analytics.paymentsByTool.entries())
      .sort((a, b) => Number(b[1].revenue - a[1].revenue))
      .slice(0, 10)
      .map(([tool, data]) => ({
        tool,
        count: data.count,
        revenue: this.formatAtomicAmount(data.revenue),
      }));

    const networkBreakdown = Array.from(this.analytics.paymentsByNetwork.entries())
      .map(([network, data]) => ({
        network,
        count: data.count,
        revenue: this.formatAtomicAmount(data.revenue),
      }));

    const totalAttempts = this.analytics.totalPayments + this.analytics.failedPayments;
    const successRate = totalAttempts > 0 
      ? (this.analytics.totalPayments / totalAttempts) * 100 
      : 100;

    return {
      totalPayments: this.analytics.totalPayments,
      totalRevenue: this.formatAtomicAmount(this.analytics.totalRevenue),
      failedPayments: this.analytics.failedPayments,
      successRate: Math.round(successRate * 100) / 100,
      averageSettlementTimeMs: Math.round(this.analytics.averageSettlementTime),
      topTools,
      networkBreakdown,
    };
  }

  /**
   * Track successful payment for analytics
   */
  private trackPayment(tool: string, amount: string, network: string): void {
    const amountBigInt = BigInt(amount);
    
    this.analytics.totalPayments++;
    this.analytics.totalRevenue += amountBigInt;

    // Track by tool
    const toolStats = this.analytics.paymentsByTool.get(tool) || { count: 0, revenue: BigInt(0) };
    toolStats.count++;
    toolStats.revenue += amountBigInt;
    this.analytics.paymentsByTool.set(tool, toolStats);

    // Track by network
    const networkStats = this.analytics.paymentsByNetwork.get(network) || { count: 0, revenue: BigInt(0) };
    networkStats.count++;
    networkStats.revenue += amountBigInt;
    this.analytics.paymentsByNetwork.set(network, networkStats);
  }

  /**
   * Track failed payment for analytics
   */
  private trackFailedPayment(): void {
    this.analytics.failedPayments++;
  }

  /**
   * Track settlement time
   */
  private trackSettlementTime(startTime: number): void {
    const duration = Date.now() - startTime;
    this.settlementTimes.push(duration);
    
    // Keep only last 100 settlement times
    if (this.settlementTimes.length > 100) {
      this.settlementTimes.shift();
    }
    
    // Calculate average
    this.analytics.averageSettlementTime = 
      this.settlementTimes.reduce((a, b) => a + b, 0) / this.settlementTimes.length;
  }

  /**
   * Format atomic amount to human readable
   */
  private formatAtomicAmount(amount: bigint, decimals: number = 6): string {
    const divisor = BigInt(10 ** decimals);
    const whole = amount / divisor;
    const fraction = amount % divisor;
    return `$${whole}.${fraction.toString().padStart(decimals, '0').slice(0, 2)}`;
  }

  /**
   * Settle payment with retry logic
   */
  async settlePaymentWithRetry(
    paymentHeader: string,
    toolName: string,
    category?: string
  ): Promise<PaymentSettlement> {
    let lastError: string | undefined;
    let delay = SETTLEMENT_RETRY_CONFIG.initialDelayMs;

    for (let attempt = 1; attempt <= SETTLEMENT_RETRY_CONFIG.maxRetries; attempt++) {
      const result = await this.settlePayment(paymentHeader, toolName, category);
      
      if (result.success) {
        return result;
      }

      lastError = result.error;
      logger.warn({ attempt, toolName, error: lastError }, 'Settlement attempt failed, retrying...');

      // Wait before retry with exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay));
      delay = Math.min(delay * SETTLEMENT_RETRY_CONFIG.backoffMultiplier, SETTLEMENT_RETRY_CONFIG.maxDelayMs);
    }

    logger.error({ toolName, attempts: SETTLEMENT_RETRY_CONFIG.maxRetries }, 'Settlement failed after all retries');
    return {
      success: false,
      error: `Settlement failed after ${SETTLEMENT_RETRY_CONFIG.maxRetries} attempts: ${lastError}`,
    };
  }

  /**
   * Get supported networks with USDC info
   */
  getSupportedNetworks(): Array<{ network: string; chainName: string; usdcAddress: string }> {
    return Object.entries(USDC_ADDRESSES).map(([network, info]) => ({
      network,
      chainName: info.chainName,
      usdcAddress: info.address,
    }));
  }

  /**
   * Validate that a network is supported
   */
  isNetworkSupported(network: string): boolean {
    return network in USDC_ADDRESSES;
  }

  /**
   * Get USDC info for a network
   */
  getUsdcInfo(network: string): { address: string; decimals: number; symbol: string; chainName: string } | null {
    return USDC_ADDRESSES[network] || null;
  }
}
