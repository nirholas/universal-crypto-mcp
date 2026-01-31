/**
 * Universal Crypto MCP - Payment System
 * 
 * Complete payment infrastructure for crypto payments
 * including X402 protocol, subscriptions, and analytics
 * 
 * @author Nich (@nichxbt)
 * @license Apache-2.0
 */

// ============================================
// Core Types
// ============================================

export type {
  Payment,
  PaymentRequest,
  PaymentResult,
  PaymentMethod,
  PaymentReceipt,
  PaymentStatus,
  PaymentType,
  RefundRequest,
  RefundResult,
  Subscription,
  SubscriptionTier,
  SubscriptionStatus,
  Invoice,
  InvoiceLineItem,
  UsageData,
  UsageAlert,
  X402Config,
  PaymentHeaderData,
  RevenueData,
  NetworkConfig,
  TokenConfig,
} from './types';

// ============================================
// Configuration
// ============================================

export {
  NETWORK_CONFIGS,
  USDC_MAINNET,
  USDC_POLYGON,
  USDC_ARBITRUM,
  USDC_BASE,
  USDC_OPTIMISM,
  USDS_MAINNET,
  USDS_ARBITRUM,
  getNetworkConfig,
  getToken,
  formatTokenAmount,
  parseTokenAmount,
  generatePaymentId,
} from './config';

// ============================================
// X402 Protocol Client
// ============================================

export {
  X402Client,
  x402Client,
} from './x402Client';

// ============================================
// Request Handler
// ============================================

export {
  PaymentRequestHandler,
  paymentHandler,
  withPayment,
} from './requestHandler';

// ============================================
// Wallet Payment
// ============================================

export {
  WalletPaymentManager,
  walletPaymentManager,
  SolanaPaymentManager,
  solanaPaymentManager,
} from './walletPayment';

// ============================================
// Subscription Management
// ============================================

export {
  SubscriptionManager,
  subscriptionManager,
} from './subscriptionManager';

// ============================================
// Billing
// ============================================

export {
  BillingCycleHandler,
  billingHandler,
} from './billingCycle';

// ============================================
// Usage Metering
// ============================================

export {
  UsageMetering,
  usageMetering,
} from './usageMetering';

// ============================================
// Invoice Generation
// ============================================

export {
  InvoiceGenerator,
  invoiceGenerator,
} from './invoiceGenerator';
