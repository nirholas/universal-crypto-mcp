/**
 * Type definitions for x402 ecosystem
 */

import { z } from "zod";

/**
 * Agent configuration schema
 */
export const AgentConfigSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  walletAddress: z.string(),
  chain: z.string(),
  maxPaymentPerRequest: z.string().default("1.00"),
  maxPaymentPerHour: z.string().default("10.00"),
  maxPaymentPerDay: z.string().default("100.00"),
  allowedTokens: z.array(z.string()).default(["USDC"]),
  yieldStrategy: z.string().optional(),
});
export type AgentConfig = z.infer<typeof AgentConfigSchema>;

/**
 * Tool purchase schema
 */
export const ToolPurchaseSchema = z.object({
  toolId: z.string(),
  price: z.string(),
  token: z.string(),
  chain: z.string(),
  purchasedAt: z.number(),
  txHash: z.string(),
  expiresAt: z.number().optional(),
});
export type ToolPurchase = z.infer<typeof ToolPurchaseSchema>;

/**
 * Subscription schema
 */
export const SubscriptionSchema = z.object({
  tierId: z.string(),
  userId: z.string(),
  startedAt: z.number(),
  expiresAt: z.number(),
  price: z.string(),
  token: z.string(),
  chain: z.string(),
  autoRenew: z.boolean().default(false),
});
export type Subscription = z.infer<typeof SubscriptionSchema>;

/**
 * Payment event schema
 */
export const PaymentEventSchema = z.object({
  type: z.enum(["payment", "refund", "subscription", "purchase"]),
  timestamp: z.number(),
  amount: z.string(),
  token: z.string(),
  chain: z.string(),
  from: z.string(),
  to: z.string(),
  txHash: z.string(),
  metadata: z.record(z.string()).optional(),
});
export type PaymentEvent = z.infer<typeof PaymentEventSchema>;

/**
 * Agent spending report schema
 */
export const SpendingReportSchema = z.object({
  period: z.enum(["hour", "day", "week", "month"]),
  startTime: z.number(),
  endTime: z.number(),
  totalSpent: z.string(),
  transactionCount: z.number(),
  byToken: z.record(z.string()),
  byRecipient: z.record(z.string()),
});
export type SpendingReport = z.infer<typeof SpendingReportSchema>;
