/**
 * Credit Service
 * 
 * Main service for credit purchase and management.
 * Integrates Stripe for payments and CreditWallet for balance tracking.
 */

import { v4 as uuidv4 } from "uuid";
import { StripeIntegration } from "./StripeIntegration.js";
import { CreditWallet, type CreditWalletStorage } from "./CreditWallet.js";
import type {
  CreditServiceConfig,
  CreditBalance,
  CreditPurchase,
  AutoTopUpConfig,
  CreateCheckoutRequest,
  CheckoutSessionResponse,
  CreditHistoryOptions,
  CreditHistoryResponse,
} from "./types.js";
import { calculateCreditPrice } from "./types.js";

/**
 * Auto top-up storage interface
 */
interface AutoTopUpStorage {
  get(userId: string): Promise<AutoTopUpConfig | null>;
  set(userId: string, config: AutoTopUpConfig): Promise<void>;
  delete(userId: string): Promise<void>;
}

/**
 * In-memory auto top-up storage
 */
class InMemoryAutoTopUpStorage implements AutoTopUpStorage {
  private configs = new Map<string, AutoTopUpConfig>();

  async get(userId: string): Promise<AutoTopUpConfig | null> {
    return this.configs.get(userId) || null;
  }

  async set(userId: string, config: AutoTopUpConfig): Promise<void> {
    this.configs.set(userId, config);
  }

  async delete(userId: string): Promise<void> {
    this.configs.delete(userId);
  }
}

/**
 * Customer storage interface
 */
interface CustomerStorage {
  getStripeCustomerId(userId: string): Promise<string | null>;
  setStripeCustomerId(userId: string, customerId: string): Promise<void>;
}

/**
 * In-memory customer storage
 */
class InMemoryCustomerStorage implements CustomerStorage {
  private customers = new Map<string, string>();

  async getStripeCustomerId(userId: string): Promise<string | null> {
    return this.customers.get(userId) || null;
  }

  async setStripeCustomerId(userId: string, customerId: string): Promise<void> {
    this.customers.set(userId, customerId);
  }
}

/**
 * Credit Service - Main entry point for credit operations
 */
export class CreditService {
  private stripe: StripeIntegration;
  private wallet: CreditWallet;
  private autoTopUpStorage: AutoTopUpStorage;
  private customerStorage: CustomerStorage;

  constructor(
    config: CreditServiceConfig,
    walletStorage?: CreditWalletStorage,
    autoTopUpStorage?: AutoTopUpStorage,
    customerStorage?: CustomerStorage
  ) {
    this.stripe = new StripeIntegration(config);
    this.wallet = new CreditWallet(walletStorage);
    this.autoTopUpStorage = autoTopUpStorage || new InMemoryAutoTopUpStorage();
    this.customerStorage = customerStorage || new InMemoryCustomerStorage();
  }

  // ============ Purchase Credits ============

  /**
   * Create a checkout session for credit purchase
   */
  async createCheckoutSession(
    request: CreateCheckoutRequest
  ): Promise<CheckoutSessionResponse> {
    return this.stripe.createCheckoutSession(request);
  }

  /**
   * Handle Stripe webhook events
   */
  async handleStripeWebhook(
    signature: string,
    payload: Buffer | string
  ): Promise<{ success: boolean; message: string }> {
    const result = await this.stripe.handleWebhook(signature, payload);

    if (result.error) {
      return { success: false, message: result.error };
    }

    if (result.purchase && result.type === "checkout.session.completed") {
      // Add credits to user's balance
      await this.wallet.addCredits(
        result.purchase.userId,
        result.purchase.credits,
        result.purchase
      );
      return {
        success: true,
        message: `Added ${result.purchase.credits} credits to user ${result.purchase.userId}`,
      };
    }

    if (result.purchase && result.type === "payment_intent.succeeded") {
      // Auto top-up success
      await this.wallet.addCredits(
        result.purchase.userId,
        result.purchase.credits,
        result.purchase
      );
      return {
        success: true,
        message: `Auto top-up: Added ${result.purchase.credits} credits`,
      };
    }

    if (result.purchase && result.type === "charge.refunded") {
      // Handle refund - deduct credits if possible
      // In practice, you might want more complex logic here
      return {
        success: true,
        message: `Refund processed for ${result.purchase.credits} credits`,
      };
    }

    return { success: true, message: `Processed event: ${result.type}` };
  }

  // ============ Balance Management ============

  /**
   * Get user's credit balance
   */
  async getBalance(userId: string): Promise<CreditBalance> {
    return this.wallet.getBalance(userId);
  }

  /**
   * Reserve credits for a pending payment
   */
  async reserveCredits(
    userId: string,
    amount: number
  ): Promise<string> {
    // Check if auto top-up is needed
    const balance = await this.wallet.getBalance(userId);
    const available = balance.balance - balance.reserved;

    if (available < amount) {
      const topped = await this.checkAndTopUp(userId);
      if (!topped) {
        throw new Error(
          `Insufficient credits. Available: ${available}, Required: ${amount}`
        );
      }
    }

    const reservation = await this.wallet.reserveCredits(userId, amount);
    return reservation.id;
  }

  /**
   * Confirm credit usage after payment
   */
  async confirmUsage(
    reservationId: string,
    paymentId: string,
    serviceId: string
  ): Promise<void> {
    await this.wallet.confirmReservation(reservationId, paymentId, serviceId);
  }

  /**
   * Release a credit reservation
   */
  async releaseReservation(reservationId: string): Promise<void> {
    await this.wallet.releaseReservation(reservationId);
  }

  /**
   * Use credits directly
   */
  async useCredits(
    userId: string,
    amount: number,
    paymentId: string,
    serviceId: string
  ): Promise<void> {
    await this.wallet.useCredits(userId, amount, paymentId, serviceId);
  }

  // ============ Auto Top-up ============

  /**
   * Configure auto top-up for a user
   */
  async setAutoTopUp(
    userId: string,
    config: Omit<AutoTopUpConfig, "currentMonthTopUps" | "lastTopUpAt">
  ): Promise<void> {
    // Get or create Stripe customer
    let customerId = await this.customerStorage.getStripeCustomerId(userId);
    
    if (!customerId) {
      const customer = await this.stripe.getOrCreateCustomer(userId);
      customerId = customer.id;
      await this.customerStorage.setStripeCustomerId(userId, customerId);
    }

    // Attach payment method if provided
    if (config.paymentMethodId) {
      await this.stripe.attachPaymentMethod(customerId, config.paymentMethodId);
    }

    const fullConfig: AutoTopUpConfig = {
      ...config,
      currentMonthTopUps: 0,
      lastTopUpAt: undefined,
    };

    await this.autoTopUpStorage.set(userId, fullConfig);
  }

  /**
   * Get auto top-up configuration
   */
  async getAutoTopUp(userId: string): Promise<AutoTopUpConfig | null> {
    return this.autoTopUpStorage.get(userId);
  }

  /**
   * Disable auto top-up
   */
  async disableAutoTopUp(userId: string): Promise<void> {
    await this.autoTopUpStorage.delete(userId);
  }

  /**
   * Check and execute auto top-up if needed
   */
  async checkAndTopUp(userId: string): Promise<boolean> {
    const config = await this.autoTopUpStorage.get(userId);

    if (!config || !config.enabled) {
      return false;
    }

    // Check if already topped up max times this month
    if (config.currentMonthTopUps >= config.maxPerMonth) {
      return false;
    }

    const balance = await this.wallet.getBalance(userId);
    const available = balance.balance - balance.reserved;

    if (available >= config.threshold) {
      return false; // No top-up needed
    }

    // Execute top-up
    try {
      const customerId = await this.customerStorage.getStripeCustomerId(userId);
      if (!customerId) {
        return false;
      }

      const paymentIntent = await this.stripe.createPaymentIntent({
        userId,
        credits: config.amount,
        paymentMethodId: config.paymentMethodId,
        customerId,
      });

      if (paymentIntent.status === "succeeded") {
        // Update config
        config.currentMonthTopUps++;
        config.lastTopUpAt = new Date();
        await this.autoTopUpStorage.set(userId, config);
        return true;
      }

      return false;
    } catch (error) {
      console.error("Auto top-up failed:", error);
      return false;
    }
  }

  // ============ History ============

  /**
   * Get credit history for a user
   */
  async getHistory(
    userId: string,
    options?: CreditHistoryOptions
  ): Promise<CreditHistoryResponse> {
    return this.wallet.getHistory(userId, options);
  }

  // ============ Utilities ============

  /**
   * Calculate price for a credit amount
   */
  calculatePrice(credits: number): {
    price: string;
    pricePerCredit: string;
    discount: number;
  } {
    return calculateCreditPrice(credits);
  }

  /**
   * Get pricing tiers
   */
  getPricingTiers() {
    return this.stripe.getPricingTiers();
  }

  /**
   * Create setup intent for saving payment method
   */
  async createSetupIntent(userId: string): Promise<{ clientSecret: string }> {
    let customerId = await this.customerStorage.getStripeCustomerId(userId);
    
    if (!customerId) {
      const customer = await this.stripe.getOrCreateCustomer(userId);
      customerId = customer.id;
      await this.customerStorage.setStripeCustomerId(userId, customerId);
    }

    const setupIntent = await this.stripe.createSetupIntent(customerId);
    return { clientSecret: setupIntent.client_secret! };
  }
}
