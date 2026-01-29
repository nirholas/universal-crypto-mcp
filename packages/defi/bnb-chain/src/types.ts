/**
 * Type definitions for BNB Chain integrations
 */

import { z } from "zod";

/**
 * Supported BNB Chain protocols
 */
export const BNBProtocolSchema = z.enum([
  "pancakeswap",
  "venus",
  "alpaca",
  "biswap",
]);
export type BNBProtocol = z.infer<typeof BNBProtocolSchema>;

/**
 * Token info on BNB Chain
 */
export const BNBTokenSchema = z.object({
  address: z.string(),
  symbol: z.string(),
  name: z.string(),
  decimals: z.number(),
  logoURI: z.string().optional(),
});
export type BNBToken = z.infer<typeof BNBTokenSchema>;

/**
 * Swap parameters for BNB Chain DEXes
 */
export const BNBSwapParamsSchema = z.object({
  tokenIn: z.string(),
  tokenOut: z.string(),
  amountIn: z.string(),
  slippage: z.number().default(0.5),
  protocol: BNBProtocolSchema.default("pancakeswap"),
});
export type BNBSwapParams = z.infer<typeof BNBSwapParamsSchema>;

/**
 * Lending parameters for Venus
 */
export const VenusLendParamsSchema = z.object({
  asset: z.string(),
  amount: z.string(),
  action: z.enum(["supply", "withdraw", "borrow", "repay"]),
});
export type VenusLendParams = z.infer<typeof VenusLendParamsSchema>;

/**
 * Pool liquidity info
 */
export const BNBPoolSchema = z.object({
  address: z.string(),
  token0: BNBTokenSchema,
  token1: BNBTokenSchema,
  reserve0: z.string(),
  reserve1: z.string(),
  fee: z.number(),
  tvl: z.number(),
  apy: z.number().optional(),
});
export type BNBPool = z.infer<typeof BNBPoolSchema>;

/**
 * Common BNB Chain tokens
 */
export const BNB_TOKENS = {
  WBNB: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
  BUSD: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
  USDT: "0x55d398326f99059fF775485246999027B3197955",
  USDC: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
  CAKE: "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82",
  XVS: "0xcF6BB5389c92Bdda8a3747Ddb454cB7a64626C63",
} as const;
