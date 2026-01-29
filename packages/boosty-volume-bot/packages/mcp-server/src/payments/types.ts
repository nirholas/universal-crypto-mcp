/**
 * x402 Payment Types
 * Type definitions for HTTP 402 micropayment integration
 */

// Note: @x402/core/types imports will be available after pnpm install
// import type { Network as X402Network } from '@x402/core/types';

// ===========================================
// PAYMENT CONFIGURATION
// ===========================================

/**
 * Supported payment networks
 */
export type PaymentNetwork = 
  | 'eip155:8453'      // Base Mainnet
  | 'eip155:84532'     // Base Sepolia (testnet)
  | 'eip155:1'         // Ethereum Mainnet
  | 'eip155:42161'     // Arbitrum One
  | 'eip155:10'        // Optimism
  | 'eip155:137'       // Polygon
  | 'solana:mainnet'   // Solana Mainnet
  | 'solana:devnet';   // Solana Devnet

/**
 * Price specification - can be string like "$0.01" or detailed object
 */
export type PriceSpec = 
  | string  // e.g., "$0.01", "$1.00"
  | {
      amount: string;     // Amount in smallest unit
      asset: {
        address: string;  // Token contract address
        decimals: number;
        symbol: string;
      };
    };

/**
 * Tool pricing configuration
 */
export interface ToolPricing {
  /** Tool name */
  tool: string;
  /** Price in USD (e.g., "$0.001") or token amount */
  price: PriceSpec;
  /** Payment network */
  network: PaymentNetwork;
  /** Description shown in payment UI */
  description?: string;
  /** Whether this tool requires payment */
  requiresPayment: boolean;
}

/**
 * Category-based pricing configuration
 */
export interface CategoryPricing {
  /** Category name (matches tool categories) */
  category: 'swaps' | 'walletOps' | 'campaigns' | 'queries' | 'bots' | 'analysis';
  /** Default price for tools in this category */
  price: PriceSpec;
  /** Network for payments */
  network: PaymentNetwork;
  /** Whether category requires payment by default */
  requiresPayment: boolean;
}

/**
 * Complete x402 payment configuration
 */
export interface X402Config {
  /** Whether x402 payments are enabled */
  enabled: boolean;
  
  /** Address to receive payments (EVM or Solana) */
  payToAddress: string;
  
  /** Default network for payments */
  defaultNetwork: PaymentNetwork;
  
  /** Facilitator URL (default: https://x402.org/facilitator) */
  facilitatorUrl?: string;
  
  /** Per-tool pricing overrides */
  toolPricing?: ToolPricing[];
  
  /** Category-based pricing defaults */
  categoryPricing?: CategoryPricing[];
  
  /** Default price for tools without specific pricing */
  defaultPrice: PriceSpec;
  
  /** Tools that are always free (no payment required) */
  freeTools?: string[];
  
  /** Paywall UI configuration */
  paywall?: {
    appName?: string;
    appLogo?: string;
    /** CDP client key for Coinbase Pay integration */
    cdpClientKey?: string;
  };
}

// ===========================================
// PAYMENT STATE
// ===========================================

/**
 * Payment verification result
 */
export interface PaymentVerification {
  isValid: boolean;
  payer?: string;
  amount?: string;
  network?: PaymentNetwork;
  invalidReason?: string;
}

/**
 * Payment settlement result
 */
export interface PaymentSettlement {
  success: boolean;
  transactionHash?: string;
  error?: string;
  settledAt?: Date;
}

/**
 * Active payment session
 */
export interface PaymentSession {
  sessionId: string;
  payer: string;
  tool: string;
  amount: string;
  network: PaymentNetwork;
  verified: boolean;
  settled: boolean;
  createdAt: Date;
  expiresAt: Date;
}

// ===========================================
// PAYMENT REQUIREMENTS
// ===========================================

/**
 * Payment requirements for a specific tool call
 */
export interface ToolPaymentRequirements {
  tool: string;
  price: PriceSpec;
  network: PaymentNetwork;
  payTo: string;
  description: string;
  resource: string;
}

/**
 * HTTP 402 response body
 */
export interface PaymentRequiredResponse {
  x402Version: number;
  error: string;
  accepts: PaymentRequirementsList[];
}

/**
 * Payment requirements list item
 */
export interface PaymentRequirementsList {
  scheme: 'exact';
  network: PaymentNetwork;
  maxAmountRequired: string;
  resource: string;
  description: string;
  mimeType: string;
  payTo: string;
  maxTimeoutSeconds: number;
  asset: {
    address: string;
    decimals: number;
    symbol: string;
  };
  extra?: Record<string, unknown>;
}

// ===========================================
// EVENTS
// ===========================================

/**
 * Payment event for logging/tracking
 */
export interface PaymentEvent {
  type: 'payment_required' | 'payment_verified' | 'payment_settled' | 'payment_failed';
  tool: string;
  payer?: string;
  amount?: string;
  network?: PaymentNetwork;
  error?: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

/**
 * Payment event handler
 */
export type PaymentEventHandler = (event: PaymentEvent) => void | Promise<void>;
