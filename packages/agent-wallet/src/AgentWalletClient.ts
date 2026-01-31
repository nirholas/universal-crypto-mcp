/**
 * Agent Wallet Client
 * 
 * Client SDK for AI agents to use their wallets for x402 payments.
 * Designed for use in MCP servers and autonomous agents.
 */

import axios, { AxiosInstance, AxiosError } from "axios";
import { v4 as uuidv4 } from "uuid";
import type {
  AgentWalletClientConfig,
  WalletBudget,
  PolicyCheckResult,
  PaymentRequirements,
  PaymentProof,
  AuthorizePaymentResult,
} from "./types.js";

/**
 * x402 Client interface
 */
export interface X402Client {
  pay(requirements: PaymentRequirements): Promise<PaymentProof>;
  verify(proof: PaymentProof, requirements: PaymentRequirements): Promise<boolean>;
}

/**
 * Agent Wallet Client
 * 
 * Use this in your AI agent or MCP server to make payments.
 * 
 * @example
 * ```typescript
 * const client = new AgentWalletClient({
 *   walletId: process.env.AGENT_WALLET_ID,
 *   apiKey: process.env.AGENT_WALLET_API_KEY,
 *   facilitatorUrl: 'https://facilitator.example.com'
 * });
 * 
 * // Check budget before making calls
 * const budget = await client.getBudget();
 * console.log(`Daily remaining: $${budget.dailyRemaining}`);
 * 
 * // Wrap axios for automatic payments
 * const api = client.wrapAxios(axios.create({ baseURL: 'https://api.example.com' }));
 * const data = await api.get('/paid-endpoint'); // Auto-pays on 402
 * ```
 */
export class AgentWalletClient {
  private config: AgentWalletClientConfig;
  private httpClient: AxiosInstance;

  constructor(config: AgentWalletClientConfig) {
    this.config = config;
    this.httpClient = axios.create({
      baseURL: config.facilitatorUrl,
      headers: {
        "X-Wallet-Id": config.walletId,
        "X-Api-Key": config.apiKey,
        "Content-Type": "application/json",
      },
    });
  }

  /**
   * Check if a payment is allowed
   */
  async canPay(
    amount: string,
    serviceId?: string
  ): Promise<PolicyCheckResult> {
    const response = await this.httpClient.post("/v1/agent/check", {
      amount,
      serviceId,
    });

    return response.data;
  }

  /**
   * Get remaining budget
   */
  async getBudget(): Promise<WalletBudget> {
    const response = await this.httpClient.get("/v1/agent/budget");
    return response.data;
  }

  /**
   * Request payment authorization
   */
  async authorizePayment(
    requirements: PaymentRequirements
  ): Promise<AuthorizePaymentResult> {
    try {
      const response = await this.httpClient.post("/v1/agent/authorize", {
        requirements,
      });

      return {
        authorized: true,
        authorizationId: response.data.authorizationId,
        paymentProof: response.data.proof,
      };
    } catch (error) {
      const err = error as AxiosError<{ reason?: string }>;
      return {
        authorized: false,
        reason: err.response?.data?.reason as PolicyCheckResult["reason"],
      };
    }
  }

  /**
   * Create an x402 client that uses this wallet
   */
  createX402Client(): X402Client {
    return {
      pay: async (requirements: PaymentRequirements) => {
        const result = await this.authorizePayment(requirements);
        if (!result.authorized || !result.paymentProof) {
          throw new Error(`Payment not authorized: ${result.reason}`);
        }
        return result.paymentProof;
      },
      verify: async (_proof: PaymentProof, _requirements: PaymentRequirements) => {
        // Verification is handled by the facilitator
        return true;
      },
    };
  }

  /**
   * Wrap an axios instance to auto-pay with this wallet
   */
  wrapAxios<T extends AxiosInstance>(client: T): T {
    // Add response interceptor for 402 handling
    client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status !== 402) {
          throw error;
        }

        // Extract payment requirements
        const requirements = this.extractPaymentRequirements(error.response);
        if (!requirements) {
          throw new Error("Could not extract payment requirements from 402 response");
        }

        // Authorize payment
        const result = await this.authorizePayment(requirements);
        if (!result.authorized || !result.paymentProof) {
          throw new Error(`Payment not authorized: ${result.reason}`);
        }

        // Retry request with payment proof
        const originalRequest = error.config!;
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers["X-Payment"] = this.encodePaymentHeader(result.paymentProof);
        originalRequest.headers["X-Payment-Proof"] = JSON.stringify(result.paymentProof);

        return client.request(originalRequest);
      }
    );

    return client;
  }

  /**
   * Get wallet status
   */
  async getStatus(): Promise<{
    id: string;
    status: string;
    balance: string;
    network: string;
  }> {
    const response = await this.httpClient.get("/v1/agent/status");
    return response.data;
  }

  // ============ Private Helpers ============

  private extractPaymentRequirements(
    response: AxiosError["response"]
  ): PaymentRequirements | null {
    if (!response) return null;

    // Check WWW-Authenticate header
    const wwwAuth = response.headers["www-authenticate"];
    if (wwwAuth && typeof wwwAuth === "string" && wwwAuth.startsWith("x402")) {
      return this.parseWwwAuthenticate(wwwAuth);
    }

    // Check response body
    const data = response.data as Record<string, unknown>;
    if (data && typeof data === "object") {
      if (data.x402) {
        return data.x402 as PaymentRequirements;
      }
      if (data.paymentRequired) {
        return data.paymentRequired as PaymentRequirements;
      }
      if (data.accepts && Array.isArray(data.accepts)) {
        return data.accepts[0] as PaymentRequirements;
      }
    }

    return null;
  }

  private parseWwwAuthenticate(header: string): PaymentRequirements {
    const result: Record<string, string> = {};
    const params = header.substring(5); // Remove "x402 "
    const regex = /(\w+)="([^"]+)"/g;
    let match;

    while ((match = regex.exec(params)) !== null) {
      result[match[1]] = match[2];
    }

    return result as unknown as PaymentRequirements;
  }

  private encodePaymentHeader(proof: PaymentProof): string {
    return Buffer.from(JSON.stringify(proof)).toString("base64");
  }
}
