/**
 * Type definitions for x402 stablecoin utilities
 */

import { z } from "zod";

/**
 * Stablecoin info schema
 */
export const StablecoinInfoSchema = z.object({
  symbol: z.string(),
  name: z.string(),
  address: z.string(),
  chain: z.string(),
  decimals: z.number(),
  isYieldBearing: z.boolean(),
  apy: z.number().optional(),
});
export type StablecoinInfo = z.infer<typeof StablecoinInfoSchema>;

/**
 * Balance across chains
 */
export const MultiChainBalanceSchema = z.object({
  token: z.string(),
  balances: z.record(z.string()), // chain -> balance
  totalUSD: z.number(),
});
export type MultiChainBalance = z.infer<typeof MultiChainBalanceSchema>;

/**
 * Payment route
 */
export const PaymentRouteSchema = z.object({
  sourceChain: z.string(),
  destChain: z.string(),
  token: z.string(),
  amount: z.string(),
  route: z.array(z.string()),
  estimatedFee: z.string(),
  estimatedTime: z.number(),
});
export type PaymentRoute = z.infer<typeof PaymentRouteSchema>;

/**
 * Stablecoin conversion
 */
export const ConversionSchema = z.object({
  fromToken: z.string(),
  toToken: z.string(),
  fromAmount: z.string(),
  toAmount: z.string(),
  rate: z.number(),
  fee: z.string(),
});
export type Conversion = z.infer<typeof ConversionSchema>;

/**
 * Supported stablecoins registry
 */
export const STABLECOINS: StablecoinInfo[] = [
  {
    symbol: "USDC",
    name: "USD Coin",
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    chain: "ethereum",
    decimals: 6,
    isYieldBearing: false,
  },
  {
    symbol: "USDT",
    name: "Tether USD",
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    chain: "ethereum",
    decimals: 6,
    isYieldBearing: false,
  },
  {
    symbol: "DAI",
    name: "Dai Stablecoin",
    address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    chain: "ethereum",
    decimals: 18,
    isYieldBearing: false,
  },
  {
    symbol: "USDs",
    name: "Sperax USD",
    address: "0xD74f5255D557944cf7Dd0E45FF521520002D5748",
    chain: "arbitrum",
    decimals: 18,
    isYieldBearing: true,
    apy: 0, // Dynamic - must fetch from protocol
  },
];
