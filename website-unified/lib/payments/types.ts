/**
 * Payment Gateway Types
 * 
 * Core type definitions for x402 payment protocol integration
 * 
 * @author Nich (@nichxbt)
 * @license Apache-2.0
 */

// ============================================
// Core Address Types
// ============================================

export type Address = `0x${string}`;
export type Hash = `0x${string}`;
export type ChainId = number;
export type Caip2ChainId = `eip155:${number}` | `solana:${string}`;

// ============================================
// Token Types
// ============================================

export interface Token {
  address: Address;
  symbol: string;
  name: string;
  decimals: number;
  chainId: ChainId;
  logoUrl?: string;
  isNative?: boolean;
}

export interface TokenBalance {
  token: Token;
  balance: bigint;
  balanceFormatted: string;
  valueUsd?: string;
}

// ============================================
// Payment Types
// ============================================

export type PaymentStatus = 
  | 'pending'
  | 'processing'
  | 'confirming'
  | 'completed'
  | 'failed'
  | 'refunded'
  | 'expired';

export type PaymentType = 
  | 'one-time'
  | 'subscription'
  | 'usage-based'
  | 'tip';

export interface PaymentParams {
  amount: string;
  token: string;
  chainId: ChainId;
  recipient: Address;
  description?: string;
  metadata?: PaymentMetadata;
  expiresIn?: number; // seconds
}

export interface PaymentMetadata {
  serviceId?: string;
  subscriptionId?: string;
  userId?: string;
  orderId?: string;
  description: string;
  customData?: Record<string, unknown>;
}

export interface PaymentRequest {
  id: string;
  amount: string;
  amountWei: bigint;
  token: Token;
  recipient: Address;
  sender?: Address;
  chainId: ChainId;
  description: string;
  metadata: PaymentMetadata;
  expiresAt: number;
  signature?: string;
  nonce: string;
  createdAt: number;
}

export interface PaymentResult {
  success: boolean;
  paymentId: string;
  txHash?: Hash;
  amount: string;
  token: string;
  recipient: Address;
  sender: Address;
  chainId: ChainId;
  status: PaymentStatus;
  timestamp: number;
  error?: string;
  confirmations?: number;
}

export interface Payment {
  id: string;
  type: PaymentType;
  status: PaymentStatus;
  amount: string;
  amountUsd: string;
  token: Token;
  sender: Address;
  recipient: Address;
  chainId: ChainId;
  txHash?: Hash;
  description: string;
  metadata: PaymentMetadata;
  createdAt: number;
  completedAt?: number;
  expiresAt?: number;
  error?: string;
  refundId?: string;
}

export interface PaymentVerification {
  isValid: boolean;
  paymentId: string;
  amount: string;
  token: string;
  sender: Address;
  recipient: Address;
  timestamp: number;
  expiresAt: number;
  signature: string;
  verified: boolean;
  onChainConfirmed?: boolean;
}

export interface PaymentDetails {
  payment: Payment;
  transaction?: TransactionDetails;
  refund?: RefundDetails;
}

export interface TransactionDetails {
  hash: Hash;
  blockNumber: number;
  blockHash: Hash;
  confirmations: number;
  gasUsed: bigint;
  effectiveGasPrice: bigint;
  from: Address;
  to: Address;
  value: bigint;
  timestamp: number;
}

// ============================================
// Refund Types
// ============================================

export type RefundStatus = 'pending' | 'processing' | 'processed' | 'failed';

export interface RefundRequest {
  paymentId: string;
  reason: string;
  amount?: string; // For partial refunds
  requestedBy: Address;
}

export interface RefundDetails {
  id: string;
  paymentId: string;
  amount: string;
  amountUsd: string;
  reason: string;
  status: RefundStatus;
  txHash?: Hash;
  requestedAt: number;
  processedAt?: number;
  error?: string;
}

// ============================================
// Subscription Types
// ============================================

export type SubscriptionStatus = 
  | 'active'
  | 'paused'
  | 'cancelled'
  | 'past_due'
  | 'expired';

export type BillingPeriod = 
  | 'hourly'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'yearly';

export interface SubscriptionTier {
  id: string;
  name: string;
  description: string;
  price: string;
  priceUsd: string;
  period: BillingPeriod;
  features: string[];
  limits: {
    apiCalls?: number;
    storage?: number;
    bandwidth?: number;
    [key: string]: number | undefined;
  };
}

export interface SubscriptionParams {
  tierId: string;
  token: string;
  chainId: ChainId;
  autoRenew: boolean;
  metadata?: Record<string, unknown>;
}

export interface Subscription {
  id: string;
  userId: string;
  serviceId: string;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  token: Token;
  chainId: ChainId;
  currentPeriodStart: number;
  currentPeriodEnd: number;
  cancelledAt?: number;
  autoRenew: boolean;
  paymentMethod?: Address;
  lastPaymentId?: string;
  nextPaymentAmount: string;
  nextPaymentDate: number;
  createdAt: number;
  updatedAt: number;
}

// ============================================
// Usage Types
// ============================================

export interface UsageData {
  subscriptionId: string;
  period: {
    start: number;
    end: number;
  };
  usage: {
    apiCalls: number;
    storage: number;
    bandwidth: number;
    [key: string]: number;
  };
  limits: {
    apiCalls?: number;
    storage?: number;
    bandwidth?: number;
    [key: string]: number | undefined;
  };
  overage: {
    apiCalls: number;
    storage: number;
    bandwidth: number;
    [key: string]: number;
  };
  overageCharges: string;
}

export interface UsageEvent {
  subscriptionId: string;
  type: string;
  quantity: number;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

// ============================================
// Invoice Types
// ============================================

export type InvoiceStatus = 
  | 'draft'
  | 'pending'
  | 'paid'
  | 'overdue'
  | 'cancelled'
  | 'refunded';

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: string;
  amount: string;
  metadata?: Record<string, unknown>;
}

export interface Invoice {
  id: string;
  number: string;
  subscriptionId?: string;
  userId: string;
  status: InvoiceStatus;
  lineItems: InvoiceLineItem[];
  subtotal: string;
  tax: string;
  taxRate: number;
  total: string;
  amountPaid: string;
  amountDue: string;
  currency: string;
  dueDate: number;
  paidAt?: number;
  paymentId?: string;
  billingDetails: BillingDetails;
  createdAt: number;
  updatedAt: number;
}

export interface BillingDetails {
  name?: string;
  email?: string;
  company?: string;
  address?: {
    line1: string;
    line2?: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
  };
  taxId?: string;
}

// ============================================
// Analytics Types
// ============================================

export interface PaymentSummary {
  totalSent: string;
  totalReceived: string;
  totalFees: string;
  paymentCount: number;
  successRate: number;
  averageAmount: string;
  period: {
    start: number;
    end: number;
  };
}

export interface RevenueData {
  period: string;
  revenue: string;
  revenueUsd: string;
  payments: number;
  subscriptions: number;
  newSubscriptions: number;
  churnedSubscriptions: number;
  mrr: string;
  arr: string;
}

export interface PaymentAnalytics {
  summary: PaymentSummary;
  revenueByPeriod: RevenueData[];
  revenueByService: { serviceId: string; revenue: string }[];
  revenueByTier: { tierId: string; revenue: string }[];
  paymentsByStatus: { status: PaymentStatus; count: number }[];
  paymentsByChain: { chainId: ChainId; count: number; volume: string }[];
  topCustomers: { address: Address; totalSpent: string }[];
}

// ============================================
// Alert Types
// ============================================

export type AlertType = 
  | 'low_balance'
  | 'payment_failed'
  | 'subscription_renewal'
  | 'unusual_activity'
  | 'payout_ready'
  | 'refund_requested'
  | 'invoice_due';

export type AlertSeverity = 'info' | 'warning' | 'error' | 'critical';

export interface PaymentAlert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  read: boolean;
  createdAt: number;
  expiresAt?: number;
}

// ============================================
// Configuration Types
// ============================================

export interface NetworkPaymentConfig {
  rpc: string;
  paymentContract: Address;
  supportedTokens: Token[];
  confirmationsRequired: number;
  gasLimit?: bigint;
}

export interface X402Config {
  networks: Record<ChainId, NetworkPaymentConfig>;
  defaultToken: string;
  defaultChainId: ChainId;
  minPayment: bigint;
  maxPayment: bigint;
  paymentTimeout: number; // seconds
  retryAttempts: number;
  retryDelay: number; // ms
  webhookUrl?: string;
  webhookSecret?: string;
}

export interface PaymentGatewayConfig extends X402Config {
  enableSubscriptions: boolean;
  enableRefunds: boolean;
  enableAnalytics: boolean;
  feePercentage: number; // 0-100
  feeRecipient: Address;
}
