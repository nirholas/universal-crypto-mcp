/**
 * Shared types for payment integrations
 */

import { z } from "zod";

/**
 * Supported payment tokens
 */
export const PaymentTokenSchema = z.enum([
  "USDC",
  "USDT",
  "DAI",
  "USDs",
  "EURC",
]);
export type PaymentToken = z.infer<typeof PaymentTokenSchema>;

/**
 * Supported payment chains
 */
export const PaymentChainSchema = z.enum([
  "ethereum",
  "polygon",
  "arbitrum",
  "optimism",
  "base",
  "bsc",
]);
export type PaymentChain = z.infer<typeof PaymentChainSchema>;

/**
 * Payment request schema
 */
export const PaymentRequestSchema = z.object({
  token: PaymentTokenSchema,
  amount: z.string(),
  chain: PaymentChainSchema,
  recipient: z.string(),
  memo: z.string().optional(),
  expiresAt: z.number().optional(),
});
export type PaymentRequest = z.infer<typeof PaymentRequestSchema>;

/**
 * Payment result schema
 */
export const PaymentResultSchema = z.object({
  success: z.boolean(),
  transactionHash: z.string().optional(),
  error: z.string().optional(),
  confirmedAt: z.number().optional(),
  blockNumber: z.number().optional(),
});
export type PaymentResult = z.infer<typeof PaymentResultSchema>;

/**
 * Payment verification schema
 */
export const PaymentVerificationSchema = z.object({
  transactionHash: z.string(),
  chain: PaymentChainSchema,
  expectedAmount: z.string(),
  expectedRecipient: z.string(),
  expectedToken: PaymentTokenSchema,
});
export type PaymentVerification = z.infer<typeof PaymentVerificationSchema>;

/**
 * Payment verification result
 */
export const VerificationResultSchema = z.object({
  verified: z.boolean(),
  actualAmount: z.string().optional(),
  actualRecipient: z.string().optional(),
  error: z.string().optional(),
});
export type VerificationResult = z.infer<typeof VerificationResultSchema>;

/**
 * Paywall configuration
 */
export const PaywallConfigSchema = z.object({
  price: z.string(),
  token: PaymentTokenSchema,
  chain: PaymentChainSchema,
  recipient: z.string(),
  description: z.string().optional(),
  ttl: z.number().default(3600), // 1 hour
});
export type PaywallConfig = z.infer<typeof PaywallConfigSchema>;

/**
 * Payment gateway interface
 */
export interface PaymentGateway {
  name: string;
  supportedTokens: PaymentToken[];
  supportedChains: PaymentChain[];
  
  createPaymentRequest(config: PaywallConfig): Promise<PaymentRequest>;
  verifyPayment(verification: PaymentVerification): Promise<VerificationResult>;
  getTransactionStatus(hash: string, chain: PaymentChain): Promise<PaymentResult>;
}

/**
 * Token addresses by chain
 */
export const TOKEN_ADDRESSES: Record<PaymentChain, Record<PaymentToken, string>> = {
  ethereum: {
    USDC: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    USDT: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    DAI: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    USDs: "", // Not on Ethereum
    EURC: "0x1aBaEA1f7C830bD89Acc67eC4af516284b1bC33c",
  },
  polygon: {
    USDC: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
    USDT: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
    DAI: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
    USDs: "",
    EURC: "",
  },
  arbitrum: {
    USDC: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
    USDT: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
    DAI: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
    USDs: "0xD74f5255D557944cf7Dd0E45FF521520002D5748",
    EURC: "",
  },
  optimism: {
    USDC: "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85",
    USDT: "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58",
    DAI: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
    USDs: "",
    EURC: "",
  },
  base: {
    USDC: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    USDT: "",
    DAI: "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb",
    USDs: "",
    EURC: "",
  },
  bsc: {
    USDC: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
    USDT: "0x55d398326f99059fF775485246999027B3197955",
    DAI: "0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3",
    USDs: "",
    EURC: "",
  },
};
