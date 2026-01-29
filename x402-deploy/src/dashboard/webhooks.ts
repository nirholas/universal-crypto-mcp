/**
 * Webhook handlers for real-time payment notifications
 */

import type { WebhookEvent, PaymentRecord, WebhookEventType } from "./types.js";

export interface WebhookConfig {
  url: string;
  secret?: string;
  events?: WebhookEventType[];
  retries?: number;
  retryDelay?: number;
}

export interface WebhookDeliveryResult {
  success: boolean;
  statusCode?: number;
  error?: string;
  retryCount: number;
}

/**
 * Send a webhook notification
 */
export async function sendWebhook(
  config: WebhookConfig,
  event: WebhookEvent
): Promise<boolean> {
  try {
    // Check if this event type should be sent
    if (config.events && !config.events.includes(event.type)) {
      return true; // Skip silently
    }

    const payload = JSON.stringify(event);

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      "X-Webhook-Event": event.type,
      "X-Webhook-Timestamp": event.timestamp.toISOString(),
    };

    if (config.secret) {
      const signature = await signPayload(payload, config.secret);
      headers["X-Webhook-Signature"] = signature;
    }

    const response = await fetch(config.url, {
      method: "POST",
      headers,
      body: payload,
    });

    return response.ok;
  } catch (error) {
    console.error("Webhook delivery failed:", error);
    return false;
  }
}

/**
 * Send webhook with retry logic
 */
export async function sendWebhookWithRetry(
  config: WebhookConfig,
  event: WebhookEvent
): Promise<WebhookDeliveryResult> {
  const maxRetries = config.retries ?? 3;
  const retryDelay = config.retryDelay ?? 1000;

  let lastError: string | undefined;
  let retryCount = 0;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // Check if this event type should be sent
      if (config.events && !config.events.includes(event.type)) {
        return { success: true, retryCount: 0 };
      }

      const payload = JSON.stringify(event);

      const headers: HeadersInit = {
        "Content-Type": "application/json",
        "X-Webhook-Event": event.type,
        "X-Webhook-Timestamp": event.timestamp.toISOString(),
        "X-Webhook-Retry": attempt.toString(),
      };

      if (config.secret) {
        const signature = await signPayload(payload, config.secret);
        headers["X-Webhook-Signature"] = signature;
      }

      const response = await fetch(config.url, {
        method: "POST",
        headers,
        body: payload,
      });

      if (response.ok) {
        return {
          success: true,
          statusCode: response.status,
          retryCount: attempt,
        };
      }

      lastError = `HTTP ${response.status}: ${response.statusText}`;
      retryCount = attempt;
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
      retryCount = attempt;
    }

    // Wait before retrying (if not last attempt)
    if (attempt < maxRetries) {
      await sleep(retryDelay * Math.pow(2, attempt)); // Exponential backoff
    }
  }

  return {
    success: false,
    error: lastError,
    retryCount,
  };
}

/**
 * Sign a payload using HMAC-SHA256
 */
async function signPayload(payload: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(payload)
  );

  return Buffer.from(signature).toString("hex");
}

/**
 * Create a payment received event
 */
export function createPaymentEvent(
  type: WebhookEventType,
  payment: PaymentRecord
): WebhookEvent {
  return {
    type,
    data: payment,
    timestamp: new Date(),
  };
}

/**
 * Create a payment received event
 */
export function createPaymentReceivedEvent(
  payment: PaymentRecord
): WebhookEvent {
  return createPaymentEvent("payment.received", payment);
}

/**
 * Create a payment settled event
 */
export function createPaymentSettledEvent(
  payment: PaymentRecord
): WebhookEvent {
  return createPaymentEvent("payment.settled", payment);
}

/**
 * Create a payment failed event
 */
export function createPaymentFailedEvent(payment: PaymentRecord): WebhookEvent {
  return createPaymentEvent("payment.failed", payment);
}

/**
 * Verify a webhook signature
 */
export async function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): Promise<boolean> {
  try {
    const expectedSignature = await signPayload(payload, secret);
    return timingSafeEqual(signature, expectedSignature);
  } catch {
    return false;
  }
}

/**
 * Timing-safe string comparison to prevent timing attacks
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return result === 0;
}

/**
 * Sleep helper for retry delays
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Webhook handler registry for incoming webhooks
 */
export class WebhookHandler {
  private handlers: Map<WebhookEventType, ((event: WebhookEvent) => void | Promise<void>)[]> =
    new Map();

  /**
   * Register a handler for a specific event type
   */
  on(
    eventType: WebhookEventType,
    handler: (event: WebhookEvent) => void | Promise<void>
  ): void {
    const existing = this.handlers.get(eventType) || [];
    existing.push(handler);
    this.handlers.set(eventType, existing);
  }

  /**
   * Handle an incoming webhook event
   */
  async handle(event: WebhookEvent): Promise<void> {
    const handlers = this.handlers.get(event.type) || [];
    for (const handler of handlers) {
      await handler(event);
    }
  }

  /**
   * Parse and handle a raw webhook request
   */
  async handleRequest(
    body: string,
    signature?: string,
    secret?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Verify signature if provided
      if (signature && secret) {
        const isValid = await verifyWebhookSignature(body, signature, secret);
        if (!isValid) {
          return { success: false, error: "Invalid signature" };
        }
      }

      const event = JSON.parse(body) as WebhookEvent;
      await this.handle(event);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }
}
