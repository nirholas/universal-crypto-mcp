import { z } from "zod";

export const ProtocolSchema = z.enum([
  "uniswap",
  "sushiswap", 
  "curve",
  "aave",
  "compound",
  "sperax",
  "pancakeswap",
]);
export type Protocol = z.infer<typeof ProtocolSchema>;

export const SwapRequestSchema = z.object({
  tokenIn: z.string(),
  tokenOut: z.string(),
  amountIn: z.string(),
  slippage: z.number().default(0.5),
  deadline: z.number().optional(),
});
export type SwapRequest = z.infer<typeof SwapRequestSchema>;

export const SwapQuoteSchema = z.object({
  tokenIn: z.string(),
  tokenOut: z.string(),
  amountIn: z.string(),
  amountOut: z.string(),
  priceImpact: z.number(),
  route: z.array(z.string()),
  protocol: ProtocolSchema,
});
export type SwapQuote = z.infer<typeof SwapQuoteSchema>;

export const PoolInfoSchema = z.object({
  address: z.string(),
  token0: z.string(),
  token1: z.string(),
  reserve0: z.string(),
  reserve1: z.string(),
  fee: z.number(),
  apy: z.number().optional(),
});
export type PoolInfo = z.infer<typeof PoolInfoSchema>;

export const StakeRequestSchema = z.object({
  protocol: ProtocolSchema,
  token: z.string(),
  amount: z.string(),
});
export type StakeRequest = z.infer<typeof StakeRequestSchema>;

export interface DeFiProtocol {
  name: string;
  chain: string;
  getQuote(request: SwapRequest): Promise<SwapQuote>;
  executeSwap(request: SwapRequest): Promise<string>;
  getPools(): Promise<PoolInfo[]>;
}
