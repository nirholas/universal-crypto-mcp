/**
 * Stripe Integration for Credit Purchases
 * 
 * Handles Stripe checkout sessions, payment intents, and webhooks
 * for credit purchases.
 */

import Stripe from "stripe";
import { v4 as uuidv4 } from "uuid";
import type {
  CreditPurchase,
  CreateCheckoutRequest,
  CheckoutSessionResponse,
  AutoTopUpConfig,
  CreditServiceConfig,
} from "./types.js";
import { calculateCreditPrice, CREDIT_PRICING } from "./types.js";

/**
 * Stripe integration for credit purchases
 */
export class StripeIntegration {
  private stripe: Stripe;
  private webhookSecret: string;
  private baseUrl: string;

  constructor(config: CreditServiceConfig) {
    this.stripe = new Stripe(config.stripeSecretKey, {
      apiVersion: "2023-10-16",
    });
    this.webhookSecret = config.stripeWebhookSecret;
    this.baseUrl = config.baseUrl;
  }

  /**
   * Create a checkout session for credit purchase
   */
  async createCheckoutSession(
    request: CreateCheckoutRequest
  ): Promise<CheckoutSessionResponse> {
    const { userId, credits, successUrl, cancelUrl } = request;
    const pricing = calculateCreditPrice(credits);

    // Find matching product or create line item
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${credits.toLocaleString()} Credits`,
              description: `Purchase ${credits.toLocaleString()} credits for API payments`,
              metadata: {
                credits: credits.toString(),
                userId,
              },
            },
            unit_amount: Math.round(parseFloat(pricing.price) * 100), // Stripe uses cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: successUrl || `${this.baseUrl}/credits/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${this.baseUrl}/credits/cancel`,
      client_reference_id: userId,
      metadata: {
        userId,
        credits: credits.toString(),
        purchaseId: uuidv4(),
      },
    });

    return {
      sessionId: session.id,
      checkoutUrl: session.url!,
      credits,
      price: pricing.price,
    };
  }

  /**
   * Create a payment intent for auto top-up
   */
  async createPaymentIntent(params: {
    userId: string;
    credits: number;
    paymentMethodId: string;
    customerId: string;
  }): Promise<Stripe.PaymentIntent> {
    const pricing = calculateCreditPrice(params.credits);

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(parseFloat(pricing.price) * 100),
      currency: "usd",
      customer: params.customerId,
      payment_method: params.paymentMethodId,
      off_session: true,
      confirm: true,
      metadata: {
        userId: params.userId,
        credits: params.credits.toString(),
        purchaseId: uuidv4(),
        autoTopUp: "true",
      },
    });

    return paymentIntent;
  }

  /**
   * Handle Stripe webhook events
   */
  async handleWebhook(
    signature: string,
    payload: Buffer | string
  ): Promise<{
    type: string;
    purchase?: CreditPurchase;
    error?: string;
  }> {
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        this.webhookSecret
      );
    } catch (err) {
      const error = err as Error;
      return { type: "error", error: `Webhook signature verification failed: ${error.message}` };
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        return {
          type: "checkout.session.completed",
          purchase: this.sessionToPurchase(session, "completed"),
        };
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        return {
          type: "payment_intent.succeeded",
          purchase: this.paymentIntentToPurchase(paymentIntent, "completed"),
        };
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        return {
          type: "payment_intent.payment_failed",
          purchase: this.paymentIntentToPurchase(paymentIntent, "failed"),
        };
      }

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        return {
          type: "charge.refunded",
          purchase: {
            id: charge.metadata.purchaseId || uuidv4(),
            userId: charge.metadata.userId || "",
            credits: parseInt(charge.metadata.credits || "0", 10),
            usdAmount: (charge.amount / 100).toFixed(2),
            stripePaymentId: charge.payment_intent as string,
            status: "refunded",
            createdAt: new Date(charge.created * 1000),
          },
        };
      }

      default:
        return { type: event.type };
    }
  }

  /**
   * Get or create a Stripe customer for a user
   */
  async getOrCreateCustomer(
    userId: string,
    email?: string
  ): Promise<Stripe.Customer> {
    // Search for existing customer
    const existingCustomers = await this.stripe.customers.list({
      limit: 1,
      email,
    });

    if (existingCustomers.data.length > 0) {
      return existingCustomers.data[0];
    }

    // Create new customer
    return this.stripe.customers.create({
      email,
      metadata: { userId },
    });
  }

  /**
   * Attach a payment method to a customer for auto top-up
   */
  async attachPaymentMethod(
    customerId: string,
    paymentMethodId: string
  ): Promise<Stripe.PaymentMethod> {
    const paymentMethod = await this.stripe.paymentMethods.attach(
      paymentMethodId,
      { customer: customerId }
    );

    // Set as default payment method
    await this.stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    return paymentMethod;
  }

  /**
   * Create a setup intent for saving payment method
   */
  async createSetupIntent(customerId: string): Promise<Stripe.SetupIntent> {
    return this.stripe.setupIntents.create({
      customer: customerId,
      payment_method_types: ["card"],
    });
  }

  /**
   * Get available credit pricing tiers for display
   */
  getPricingTiers(): typeof CREDIT_PRICING {
    return CREDIT_PRICING;
  }

  /**
   * Retrieve a checkout session
   */
  async getSession(sessionId: string): Promise<Stripe.Checkout.Session> {
    return this.stripe.checkout.sessions.retrieve(sessionId);
  }

  // ============ Private Helpers ============

  private sessionToPurchase(
    session: Stripe.Checkout.Session,
    status: CreditPurchase["status"]
  ): CreditPurchase {
    return {
      id: session.metadata?.purchaseId || uuidv4(),
      userId: session.metadata?.userId || session.client_reference_id || "",
      credits: parseInt(session.metadata?.credits || "0", 10),
      usdAmount: ((session.amount_total || 0) / 100).toFixed(2),
      stripePaymentId: session.payment_intent as string,
      stripeSessionId: session.id,
      status,
      createdAt: new Date(session.created * 1000),
      completedAt: status === "completed" ? new Date() : undefined,
    };
  }

  private paymentIntentToPurchase(
    paymentIntent: Stripe.PaymentIntent,
    status: CreditPurchase["status"]
  ): CreditPurchase {
    return {
      id: paymentIntent.metadata?.purchaseId || uuidv4(),
      userId: paymentIntent.metadata?.userId || "",
      credits: parseInt(paymentIntent.metadata?.credits || "0", 10),
      usdAmount: (paymentIntent.amount / 100).toFixed(2),
      stripePaymentId: paymentIntent.id,
      status,
      createdAt: new Date(paymentIntent.created * 1000),
      completedAt: status === "completed" ? new Date() : undefined,
    };
  }
}
