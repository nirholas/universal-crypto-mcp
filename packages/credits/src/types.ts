/**
 * Credit System Types
 * 
 * Types for the credit purchase system that bridges fiat payments
 * to x402 crypto payments.
 */

/**
 * User's credit balance
 */
export interface CreditBalance {
  userId: string;
  balance: number;       // Credits (1 credit = $0.01)
  reserved: number;      // Credits reserved for pending payments
  totalPurchased: number;
  totalUsed: number;
  lastTopUp: Date | null;
  updatedAt: Date;
}

/**
 * Credit purchase record
 */
export interface CreditPurchase {
  id: string;
  userId: string;
  credits: number;
  usdAmount: string;
  stripePaymentId: string;
  stripeSessionId?: string;
  status: CreditPurchaseStatus;
  createdAt: Date;
  completedAt?: Date;
}

/**
 * Credit purchase status
 */
export type CreditPurchaseStatus = "pending" | "completed" | "failed" | "refunded";

/**
 * Credit usage record
 */
export interface CreditUsage {
  id: string;
  userId: string;
  creditsUsed: number;
  paymentId: string;      // Links to x402 payment
  serviceId: string;
  endpoint?: string;
  reservationId?: string;
  createdAt: Date;
}

/**
 * Credit reservation for pending payments
 */
export interface CreditReservation {
  id: string;
  userId: string;
  amount: number;
  purpose: string;
  expiresAt: Date;
  status: "active" | "confirmed" | "released";
  createdAt: Date;
}

/**
 * Auto top-up configuration
 */
export interface AutoTopUpConfig {
  enabled: boolean;
  threshold: number;      // Top up when balance falls below this
  amount: number;         // Credits to purchase
  paymentMethodId: string;
  maxPerMonth: number;    // Maximum top-ups per month
  currentMonthTopUps: number;
  lastTopUpAt?: Date;
}

/**
 * Credit pricing tiers
 */
export interface CreditPricingTier {
  credits: number;
  price: string;          // USD price
  pricePerCredit: string;
  discount: number;       // Percentage discount
}

/**
 * Default pricing tiers with volume discounts
 */
export const CREDIT_PRICING: CreditPricingTier[] = [
  { credits: 100, price: "1.00", pricePerCredit: "0.0100", discount: 0 },
  { credits: 500, price: "4.75", pricePerCredit: "0.0095", discount: 5 },
  { credits: 1000, price: "9.00", pricePerCredit: "0.0090", discount: 10 },
  { credits: 5000, price: "42.50", pricePerCredit: "0.0085", discount: 15 },
  { credits: 10000, price: "80.00", pricePerCredit: "0.0080", discount: 20 },
];

/**
 * Credit service configuration
 */
export interface CreditServiceConfig {
  stripeSecretKey: string;
  stripeWebhookSecret: string;
  databaseUrl?: string;
  redisUrl?: string;
  facilitatorUrl?: string;
  baseUrl: string;        // For Stripe redirect URLs
}

/**
 * Checkout session request
 */
export interface CreateCheckoutRequest {
  userId: string;
  credits: number;
  successUrl?: string;
  cancelUrl?: string;
}

/**
 * Checkout session response
 */
export interface CheckoutSessionResponse {
  sessionId: string;
  checkoutUrl: string;
  credits: number;
  price: string;
}

/**
 * Credit history query options
 */
export interface CreditHistoryOptions {
  limit?: number;
  offset?: number;
  startDate?: Date;
  endDate?: Date;
  type?: "purchase" | "usage" | "all";
}

/**
 * Credit history response
 */
export interface CreditHistoryResponse {
  purchases: CreditPurchase[];
  usage: CreditUsage[];
  totalPurchased: number;
  totalUsed: number;
}

/**
 * Payment requirements from x402
 */
export interface PaymentRequirements {
  scheme: string;
  network: string;
  maxAmountRequired: string;
  resource: string;
  description?: string;
  mimeType?: string;
  payTo: string;
  maxTimeoutSeconds?: number;
  asset?: string;
  extra?: Record<string, unknown>;
}

/**
 * Payment proof for x402
 */
export interface PaymentProof {
  x402Version: number;
  scheme: string;
  network: string;
  payload: unknown;
}

/**
 * Conversion result
 */
export interface ConversionResult {
  success: boolean;
  creditsUsed: number;
  paymentProof?: PaymentProof;
  error?: string;
}

/**
 * Calculate price for a credit amount
 */
export function calculateCreditPrice(credits: number): {
  price: string;
  pricePerCredit: string;
  discount: number;
} {
  // Find the best tier
  const sortedTiers = [...CREDIT_PRICING].sort((a, b) => b.credits - a.credits);
  
  for (const tier of sortedTiers) {
    if (credits >= tier.credits) {
      const totalPrice = (credits * parseFloat(tier.pricePerCredit)).toFixed(2);
      return {
        price: totalPrice,
        pricePerCredit: tier.pricePerCredit,
        discount: tier.discount,
      };
    }
  }

  // Default to base rate
  const baseRate = 0.01;
  return {
    price: (credits * baseRate).toFixed(2),
    pricePerCredit: baseRate.toFixed(4),
    discount: 0,
  };
}

/**
 * Convert credits to USD value
 */
export function creditsToUsd(credits: number): string {
  return (credits * 0.01).toFixed(2);
}

/**
 * Convert USD to credits
 */
export function usdToCredits(usd: string | number): number {
  const amount = typeof usd === "string" ? parseFloat(usd) : usd;
  return Math.floor(amount * 100);
}
