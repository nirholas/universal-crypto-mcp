/**
 * @nirholas/credits
 * 
 * Credit purchase system that bridges fiat payments to x402 crypto payments.
 * 
 * Features:
 * - 💳 Stripe integration for fiat purchases
 * - 💰 Credit balance tracking
 * - 🔄 Auto top-up when balance is low
 * - ⚡ Automatic conversion to x402 payments
 * 
 * @example
 * ```typescript
 * import { CreditService, ConversionEngine } from '@nirholas/credits';
 * 
 * // Initialize credit service
 * const creditService = new CreditService({
 *   stripeSecretKey: process.env.STRIPE_SECRET_KEY,
 *   stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
 *   baseUrl: 'https://api.example.com'
 * });
 * 
 * // Create checkout session for credit purchase
 * const session = await creditService.createCheckoutSession({
 *   userId: 'user_123',
 *   credits: 1000  // $9.00 with 10% discount
 * });
 * console.log(`Checkout URL: ${session.checkoutUrl}`);
 * 
 * // Get balance
 * const balance = await creditService.getBalance('user_123');
 * console.log(`Available credits: ${balance.balance - balance.reserved}`);
 * 
 * // Set up auto top-up
 * await creditService.setAutoTopUp('user_123', {
 *   enabled: true,
 *   threshold: 100,    // Top up when below 100 credits
 *   amount: 1000,      // Add 1000 credits
 *   paymentMethodId: 'pm_xxx',
 *   maxPerMonth: 5
 * });
 * 
 * // Wrap HTTP client to auto-pay with credits
 * const engine = new ConversionEngine({ creditService });
 * const client = engine.createClient('user_123', 'https://api.example.com');
 * 
 * // This will automatically pay with credits if 402 is returned
 * const response = await client.get('/paid-endpoint');
 * ```
 * 
 * @packageDocumentation
 */

// Main service
export { CreditService } from "./CreditService.js";

// Stripe integration
export { StripeIntegration } from "./StripeIntegration.js";

// Credit wallet
export {
  CreditWallet,
  type CreditWalletStorage,
  InMemoryCreditWalletStorage,
} from "./CreditWallet.js";

// Conversion engine
export {
  ConversionEngine,
  type ConversionEngineConfig,
} from "./ConversionEngine.js";

// Types
export {
  type CreditBalance,
  type CreditPurchase,
  type CreditPurchaseStatus,
  type CreditUsage,
  type CreditReservation,
  type AutoTopUpConfig,
  type CreditPricingTier,
  type CreditServiceConfig,
  type CreateCheckoutRequest,
  type CheckoutSessionResponse,
  type CreditHistoryOptions,
  type CreditHistoryResponse,
  type PaymentRequirements,
  type PaymentProof,
  type ConversionResult,
  CREDIT_PRICING,
  calculateCreditPrice,
  creditsToUsd,
  usdToCredits,
} from "./types.js";
