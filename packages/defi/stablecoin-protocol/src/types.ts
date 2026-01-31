/**
 * Type definitions for Sperax integration
 */

import { z } from "zod";

/**
 * USDs balance response
 */
export const USDsBalanceSchema = z.object({
  address: z.string(),
  balance: z.string(),
  formattedBalance: z.string(),
  chain: z.literal("arbitrum"),
});
export type USDsBalance = z.infer<typeof USDsBalanceSchema>;

/**
 * Yield tracking configuration
 */
export const YieldConfigSchema = z.object({
  address: z.string(),
  trackingInterval: z.number().default(3600000), // 1 hour
  snapshotRetention: z.number().default(30), // 30 days
});
export type YieldConfig = z.infer<typeof YieldConfigSchema>;

/**
 * USDs operation types
 */
export const USDsOperationSchema = z.enum([
  "transfer",
  "approve",
  "mint",
  "redeem",
]);
export type USDsOperation = z.infer<typeof USDsOperationSchema>;

/**
 * Transaction result
 */
export const TransactionResultSchema = z.object({
  hash: z.string(),
  status: z.enum(["pending", "confirmed", "failed"]),
  blockNumber: z.number().optional(),
  gasUsed: z.string().optional(),
});
export type TransactionResult = z.infer<typeof TransactionResultSchema>;

/**
 * Collateral information
 */
export const CollateralInfoSchema = z.object({
  token: z.string(),
  symbol: z.string(),
  balance: z.string(),
  price: z.number(),
  valueUSD: z.number(),
});
export type CollateralInfo = z.infer<typeof CollateralInfoSchema>;

/**
 * Vault status
 */
export const VaultStatusSchema = z.object({
  totalCollateral: z.number(),
  totalUSDs: z.string(),
  collateralizationRatio: z.number(),
  collaterals: z.array(CollateralInfoSchema),
});
export type VaultStatus = z.infer<typeof VaultStatusSchema>;
