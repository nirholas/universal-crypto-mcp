/**
 * Conversion Engine
 * 
 * Automatically converts credit usage to x402 payments.
 * Wraps HTTP clients to handle 402 responses using credits.
 */

import axios, { AxiosInstance, AxiosError } from "axios";
import { v4 as uuidv4 } from "uuid";
import type {
  PaymentRequirements,
  PaymentProof,
  ConversionResult,
} from "./types.js";
import { usdToCredits } from "./types.js";
import type { CreditService } from "./CreditService.js";

/**
 * Conversion engine configuration
 */
export interface ConversionEngineConfig {
  creditService: CreditService;
  facilitatorUrl?: string;
  facilitatorApiKey?: string;
}

/**
 * Conversion Engine - Wraps HTTP clients to use credits for x402 payments
 */
export class ConversionEngine {
  private creditService: CreditService;
  private facilitatorUrl: string;
  private facilitatorApiKey?: string;

  constructor(config: ConversionEngineConfig) {
    this.creditService = config.creditService;
    this.facilitatorUrl = config.facilitatorUrl || "https://facilitator.x402.org";
    this.facilitatorApiKey = config.facilitatorApiKey;
  }

  /**
   * Wrap an axios instance to automatically pay with credits
   */
  wrapWithCredits<T extends AxiosInstance>(
    client: T,
    userId: string
  ): T {
    // Add response interceptor for 402 handling
    client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status !== 402) {
          throw error;
        }

        // Extract payment requirements from response
        const requirements = this.extractPaymentRequirements(error.response);

        if (!requirements) {
          throw new Error("Could not extract payment requirements from 402 response");
        }

        // Handle payment with credits
        const result = await this.handlePaymentRequired(userId, requirements);

        if (!result.success || !result.paymentProof) {
          throw new Error(result.error || "Payment failed");
        }

        // Retry the original request with payment proof
        const originalRequest = error.config!;
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers["X-Payment-Proof"] = JSON.stringify(result.paymentProof);
        originalRequest.headers["X-Payment"] = this.encodePaymentHeader(result.paymentProof);

        return client.request(originalRequest);
      }
    );

    return client;
  }

  /**
   * Handle a 402 Payment Required response using credits
   */
  async handlePaymentRequired(
    userId: string,
    requirements: PaymentRequirements
  ): Promise<ConversionResult> {
    try {
      // Calculate credits needed
      const creditsNeeded = this.calculateCreditsNeeded(requirements);

      // Reserve credits
      const reservationId = await this.creditService.reserveCredits(
        userId,
        creditsNeeded
      );

      try {
        // Convert to on-chain payment via facilitator
        const paymentProof = await this.convertToPayment(creditsNeeded, requirements);

        // Confirm credit usage
        const paymentId = uuidv4();
        await this.creditService.confirmUsage(
          reservationId,
          paymentId,
          requirements.resource
        );

        return {
          success: true,
          creditsUsed: creditsNeeded,
          paymentProof,
        };
      } catch (error) {
        // Release reservation on failure
        await this.creditService.releaseReservation(reservationId);
        throw error;
      }
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        creditsUsed: 0,
        error: err.message,
      };
    }
  }

  /**
   * Convert credits to on-chain payment
   */
  private async convertToPayment(
    _credits: number,
    requirements: PaymentRequirements
  ): Promise<PaymentProof> {
    // Call facilitator to make the payment
    const response = await axios.post(
      `${this.facilitatorUrl}/v1/pay`,
      {
        requirements,
        paymentMethod: "credits",
      },
      {
        headers: {
          "Content-Type": "application/json",
          ...(this.facilitatorApiKey && {
            Authorization: `Bearer ${this.facilitatorApiKey}`,
          }),
        },
      }
    );

    return response.data.proof;
  }

  /**
   * Calculate credits needed for a payment
   */
  private calculateCreditsNeeded(requirements: PaymentRequirements): number {
    // Parse the amount from requirements
    const amount = requirements.maxAmountRequired;

    // Amount is typically in wei or smallest unit
    // For USDC on most chains, it's 6 decimals
    // $1.00 = 1,000,000 units = 100 credits

    // Handle string amount (could be in various formats)
    let usdAmount: number;

    if (amount.startsWith("$")) {
      usdAmount = parseFloat(amount.substring(1));
    } else {
      // Assume it's in smallest unit (6 decimals for USDC)
      usdAmount = parseFloat(amount) / 1_000_000;
    }

    // Convert USD to credits (1 credit = $0.01)
    const credits = usdToCredits(usdAmount);

    // Add small buffer for price fluctuations
    return Math.ceil(credits * 1.01);
  }

  /**
   * Extract payment requirements from 402 response
   */
  private extractPaymentRequirements(
    response: AxiosError["response"]
  ): PaymentRequirements | null {
    if (!response) return null;

    // Check WWW-Authenticate header
    const wwwAuth = response.headers["www-authenticate"];
    if (wwwAuth && wwwAuth.startsWith("x402")) {
      // Parse x402 header
      const params = this.parseWwwAuthenticate(wwwAuth);
      return params as PaymentRequirements;
    }

    // Check response body
    const data = response.data as Record<string, unknown>;
    if (data && typeof data === "object") {
      // Look for x402 requirements in body
      if (data.x402) {
        return data.x402 as PaymentRequirements;
      }
      if (data.paymentRequired) {
        return data.paymentRequired as PaymentRequirements;
      }
      if (data.accepts && Array.isArray(data.accepts)) {
        // Use first accepted payment method
        return data.accepts[0] as PaymentRequirements;
      }
    }

    return null;
  }

  /**
   * Parse WWW-Authenticate header
   */
  private parseWwwAuthenticate(header: string): Record<string, string> {
    const result: Record<string, string> = {};
    
    // Remove "x402 " prefix
    const params = header.substring(5);
    
    // Parse key=value pairs
    const regex = /(\w+)="([^"]+)"/g;
    let match;
    
    while ((match = regex.exec(params)) !== null) {
      result[match[1]] = match[2];
    }

    return result;
  }

  /**
   * Encode payment proof as header value
   */
  private encodePaymentHeader(proof: PaymentProof): string {
    return Buffer.from(JSON.stringify(proof)).toString("base64");
  }

  /**
   * Create a wrapped axios instance for a user
   */
  createClient(userId: string, baseURL?: string): AxiosInstance {
    const client = axios.create({ baseURL });
    return this.wrapWithCredits(client, userId);
  }
}
