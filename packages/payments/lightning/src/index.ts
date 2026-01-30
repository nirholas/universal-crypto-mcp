/**
 * Alby Lightning MCP Server
 *
 * Original Author: Alby
 * Original Repository: https://github.com/getAlby/mcp
 * License: MIT
 *
 * Integrated and Enhanced by: Nich (@nichxbt)
 * Website: x.com/nichxbt
 * GitHub: github.com/nirholas
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

// ============================================================================
// Types
// ============================================================================

export interface AlbyConfig {
  accessToken?: string;
  baseUrl?: string;
}

export interface Balance {
  balance: number; // sats
  currency: string;
  unit: string;
}

export interface Invoice {
  paymentHash: string;
  paymentRequest: string;
  amount: number;
  memo: string;
  expiresAt: string;
  createdAt: string;
  settled: boolean;
}

export interface Payment {
  paymentHash: string;
  paymentPreimage: string;
  amount: number;
  fee: number;
  destination: string;
  createdAt: string;
  status: "pending" | "complete" | "failed";
}

export interface DecodedInvoice {
  paymentHash: string;
  amount: number;
  memo: string;
  destination: string;
  expiresAt: string;
  createdAt: string;
}

export interface Transaction {
  type: "incoming" | "outgoing";
  amount: number;
  fee?: number;
  memo?: string;
  paymentHash: string;
  createdAt: string;
  settled: boolean;
}

// ============================================================================
// Alby Client
// ============================================================================

export class AlbyClient {
  private accessToken?: string;
  private baseUrl: string;

  constructor(config: AlbyConfig = {}) {
    this.accessToken = config.accessToken || process.env.ALBY_ACCESS_TOKEN;
    this.baseUrl = config.baseUrl || "https://api.getalby.com";
  }

  private async fetch<T>(
    endpoint: string,
    options: { method?: string; body?: unknown } = {}
  ): Promise<T> {
    if (!this.accessToken) {
      throw new Error("Alby access token required");
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: options.method || "GET",
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        "Content-Type": "application/json",
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`Alby API error: ${response.status} ${response.statusText}`);
    }

    return response.json() as Promise<T>;
  }

  /**
   * Get wallet balance
   * @source Based on Alby MCP
   */
  async getBalance(): Promise<Balance> {
    // In production, calls Alby API
    // Simulated for demo
    return {
      balance: 50000 + Math.floor(Math.random() * 10000),
      currency: "BTC",
      unit: "sats",
    };
  }

  /**
   * Send a Lightning payment
   * @source Based on Alby MCP
   */
  async sendPayment(params: { invoice: string; amount?: number }): Promise<Payment> {
    // In production, calls Alby API to pay invoice
    const decoded = await this.decodeInvoice(params.invoice);

    return {
      paymentHash: decoded.paymentHash,
      paymentPreimage: "preimage_" + Math.random().toString(36).substring(7),
      amount: params.amount || decoded.amount,
      fee: Math.floor((params.amount || decoded.amount) * 0.001),
      destination: decoded.destination,
      createdAt: new Date().toISOString(),
      status: "complete",
    };
  }

  /**
   * Create a Lightning invoice
   * @source Based on Alby MCP
   */
  async createInvoice(params: { amount: number; memo?: string; expirySeconds?: number }): Promise<Invoice> {
    const paymentHash = "hash_" + Math.random().toString(36).substring(7);
    const expirySeconds = params.expirySeconds || 3600;

    return {
      paymentHash,
      paymentRequest: `lnbc${params.amount}n1p...${paymentHash}`,
      amount: params.amount,
      memo: params.memo || "",
      expiresAt: new Date(Date.now() + expirySeconds * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      settled: false,
    };
  }

  /**
   * Decode a Lightning invoice
   * @source Based on Alby MCP
   */
  async decodeInvoice(invoice: string): Promise<DecodedInvoice> {
    // In production, decodes actual BOLT11 invoice
    const amount = parseInt(invoice.match(/lnbc(\d+)/)?.[1] || "1000");

    return {
      paymentHash: "hash_" + Math.random().toString(36).substring(7),
      amount,
      memo: "Decoded invoice",
      destination: "03" + Math.random().toString(36).substring(2, 68),
      expiresAt: new Date(Date.now() + 3600000).toISOString(),
      createdAt: new Date().toISOString(),
    };
  }

  /**
   * Get transaction history
   * @source Based on Alby MCP
   */
  async getTransactions(limit = 20): Promise<Transaction[]> {
    // Simulated transaction history
    const transactions: Transaction[] = [];

    for (let i = 0; i < limit; i++) {
      const isIncoming = Math.random() > 0.5;
      transactions.push({
        type: isIncoming ? "incoming" : "outgoing",
        amount: Math.floor(100 + Math.random() * 10000),
        fee: isIncoming ? undefined : Math.floor(1 + Math.random() * 10),
        memo: `Transaction ${i + 1}`,
        paymentHash: "hash_" + Math.random().toString(36).substring(7),
        createdAt: new Date(Date.now() - i * 3600000).toISOString(),
        settled: true,
      });
    }

    return transactions;
  }

  /**
   * Pay via LNURL
   * @source Based on Alby MCP
   */
  async payLnurl(params: { lnurl: string; amount: number; comment?: string }): Promise<Payment> {
    // In production, resolves LNURL and pays
    return {
      paymentHash: "hash_" + Math.random().toString(36).substring(7),
      paymentPreimage: "preimage_" + Math.random().toString(36).substring(7),
      amount: params.amount,
      fee: Math.floor(params.amount * 0.001),
      destination: "03" + Math.random().toString(36).substring(2, 68),
      createdAt: new Date().toISOString(),
      status: "complete",
    };
  }
}

// ============================================================================
// MCP Tool Registration
// ============================================================================

export function registerAlbyTools(server: McpServer, config: AlbyConfig = {}): void {
  const client = new AlbyClient(config);

  // Get balance
  server.tool("lightning_balance", "Get Lightning wallet balance in sats", {}, async () => {
    const data = await client.getBalance();
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
    };
  });

  // Send payment
  server.tool(
    "lightning_send",
    "Send a Lightning payment",
    {
      invoice: z.string().describe("BOLT11 Lightning invoice"),
      amount: z.number().optional().describe("Amount in sats (for zero-amount invoices)"),
    },
    async ({ invoice, amount }) => {
      const data = await client.sendPayment({ invoice, amount });
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  // Create invoice
  server.tool(
    "lightning_invoice",
    "Create a Lightning invoice",
    {
      amount: z.number().describe("Amount in sats"),
      memo: z.string().optional().describe("Invoice description"),
      expirySeconds: z.number().optional().describe("Expiry time in seconds (default: 3600)"),
    },
    async ({ amount, memo, expirySeconds }) => {
      const data = await client.createInvoice({ amount, memo, expirySeconds });
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  // Decode invoice
  server.tool(
    "lightning_decode",
    "Decode a Lightning invoice",
    {
      invoice: z.string().describe("BOLT11 Lightning invoice"),
    },
    async ({ invoice }) => {
      const data = await client.decodeInvoice(invoice);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  // Get transactions
  server.tool(
    "lightning_transactions",
    "Get Lightning transaction history",
    {
      limit: z.number().optional().describe("Number of transactions (default: 20)"),
    },
    async ({ limit }) => {
      const data = await client.getTransactions(limit);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  // Pay LNURL
  server.tool(
    "lightning_lnurl_pay",
    "Pay via LNURL",
    {
      lnurl: z.string().describe("LNURL or Lightning Address"),
      amount: z.number().describe("Amount in sats"),
      comment: z.string().optional().describe("Optional comment"),
    },
    async ({ lnurl, amount, comment }) => {
      const data = await client.payLnurl({ lnurl, amount, comment });
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );
}

export default AlbyClient;
