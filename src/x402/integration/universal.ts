/**
 * Universal x402 Integration
 * @description Integrates x402 payments across all MCP tools and packages
 * @author nirholas
 * @license Apache-2.0
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { createX402Client } from "../client.js";
import { loadX402Config, isX402Configured } from "../config.js";
import Logger from "@/utils/logger.js";

export interface UniversalX402Config {
  enabled: boolean;
  autoPayment: boolean;
  maxPayment: string;
  preferredChain: string;
  fallbackChains: string[];
  yieldOptimization: boolean;
}

export class UniversalX402Integration {
  private config: UniversalX402Config;
  private client: any;
  private logger = Logger;

  constructor(config?: Partial<UniversalX402Config>) {
    this.config = {
      enabled: process.env.X402_ENABLED !== 'false',
      autoPayment: process.env.X402_AUTO_PAYMENT === 'true',
      maxPayment: process.env.X402_MAX_PAYMENT || '1.00',
      preferredChain: process.env.X402_CHAIN || 'base',
      fallbackChains: (process.env.X402_FALLBACK_CHAINS || 'ethereum,arbitrum,optimism').split(','),
      yieldOptimization: process.env.X402_YIELD_OPTIMIZATION === 'true',
      ...config
    };
  }

  async initialize(): Promise<void> {
    if (!this.config.enabled) {
      this.logger.info('[x402] Integration disabled');
      return;
    }

    if (!isX402Configured()) {
      this.logger.warn('[x402] Not configured - set X402_EVM_PRIVATE_KEY or X402_SVM_PRIVATE_KEY');
      this.config.enabled = false;
      return;
    }

    try {
      const x402Config = loadX402Config();
      const { client } = await createX402Client({
        ...x402Config,
        enablePayments: this.config.autoPayment
      });
      
      this.client = client;
      this.logger.info('[x402] Initialized successfully', {
        chain: this.config.preferredChain,
        autoPayment: this.config.autoPayment,
        yieldOptimization: this.config.yieldOptimization
      });
    } catch (error) {
      this.logger.error('[x402] Initialization failed:', error);
      this.config.enabled = false;
    }
  }

  /**
   * Wrap any API call with x402 payment handling
   */
  async wrapApiCall<T>(
    apiCall: () => Promise<T>,
    options?: {
      paymentRequired?: boolean;
      maxPayment?: string;
      chain?: string;
    }
  ): Promise<T> {
    if (!this.config.enabled) {
      return apiCall();
    }

    try {
      return await apiCall();
    } catch (error: any) {
      // Check if it's a 402 Payment Required error
      if (error.response?.status === 402 || error.status === 402) {
        if (!this.config.autoPayment) {
          throw new Error('Payment required but auto-payment is disabled');
        }

        return this.handlePaymentRequired(apiCall, error, options);
      }
      throw error;
    }
  }

  private async handlePaymentRequired<T>(
    apiCall: () => Promise<T>,
    error: any,
    options?: any
  ): Promise<T> {
    const paymentInfo = this.extractPaymentInfo(error);
    
    this.logger.info('[x402] Payment required:', paymentInfo);

    // Validate payment amount
    const maxPayment = parseFloat(options?.maxPayment || this.config.maxPayment);
    const requestedAmount = parseFloat(paymentInfo.amount);
    
    if (requestedAmount > maxPayment) {
      throw new Error(`Payment amount ${requestedAmount} exceeds max ${maxPayment}`);
    }

    // Execute payment
    await this.makePayment(paymentInfo);

    // Retry the API call
    return apiCall();
  }

  private extractPaymentInfo(error: any): {
    amount: string;
    recipient: string;
    chain: string;
    token: string;
  } {
    const headers = error.response?.headers || {};
    return {
      amount: headers['x402-amount'] || headers['x-payment-amount'] || '0',
      recipient: headers['x402-address'] || headers['x-payment-address'] || '',
      chain: headers['x402-chain'] || this.config.preferredChain,
      token: headers['x402-token'] || 'USDC'
    };
  }

  private async makePayment(info: any): Promise<void> {
    if (!this.client) {
      throw new Error('x402 client not initialized');
    }

    this.logger.info('[x402] Making payment:', info);
    
    // Use the x402 client to make the payment
    await this.client.send({
      to: info.recipient,
      amount: info.amount,
      token: info.token,
      chain: info.chain
    });
  }

  /**
   * Inject x402 payment headers into request
   */
  injectPaymentHeaders(headers: Record<string, string>, proof?: string): Record<string, string> {
    if (!this.config.enabled || !proof) {
      return headers;
    }

    return {
      ...headers,
      'X-Payment-Proof': proof,
      'X-402-Protocol': 'v1',
      'X-402-Client': 'universal-crypto-mcp'
    };
  }

  /**
   * Check if tool requires payment
   */
  requiresPayment(toolName: string): boolean {
    const paidTools = [
      'dex_swap',
      'dex_quote',
      'get_token_price',
      'get_market_data',
      'execute_trade',
      'get_portfolio_value'
    ];

    return paidTools.includes(toolName);
  }

  /**
   * Get payment info for tool
   */
  getToolPaymentInfo(toolName: string): {
    required: boolean;
    amount: string;
    tier: 'free' | 'basic' | 'premium';
  } {
    const paymentTiers: Record<string, any> = {
      // Free tier
      'get_balance': { required: false, amount: '0', tier: 'free' },
      'get_address': { required: false, amount: '0', tier: 'free' },
      
      // Basic tier (0.01 USDC)
      'get_token_price': { required: true, amount: '0.01', tier: 'basic' },
      'get_market_data': { required: true, amount: '0.01', tier: 'basic' },
      
      // Premium tier (0.05 USDC)
      'dex_swap': { required: true, amount: '0.05', tier: 'premium' },
      'execute_trade': { required: true, amount: '0.05', tier: 'premium' },
      'get_portfolio_value': { required: true, amount: '0.02', tier: 'premium' }
    };

    return paymentTiers[toolName] || { required: false, amount: '0', tier: 'free' };
  }

  isEnabled(): boolean {
    return this.config.enabled;
  }

  getConfig(): UniversalX402Config {
    return { ...this.config };
  }
}

// Global instance
let globalIntegration: UniversalX402Integration | null = null;

export async function initializeX402(): Promise<UniversalX402Integration> {
  if (!globalIntegration) {
    globalIntegration = new UniversalX402Integration();
    await globalIntegration.initialize();
  }
  return globalIntegration;
}

export function getX402(): UniversalX402Integration | null {
  return globalIntegration;
}

/**
 * Register x402 with MCP server
 */
export async function registerX402WithServer(server: McpServer): Promise<void> {
  const integration = await initializeX402();
  
  if (!integration.isEnabled()) {
    Logger.info('[x402] Not enabled, skipping registration');
    return;
  }

  Logger.info('[x402] Registering with MCP server');
  
  // The actual tool registration is done by the tools.ts file
  // This just ensures the integration is initialized
}
