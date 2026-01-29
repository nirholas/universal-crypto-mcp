/**
 * Balance checking utilities
 * 
 * Multi-token balance queries and portfolio tracking.
 */

import type { PublicClient } from "viem";
import { formatUnits } from "viem";
import type { PaymentToken } from "./types.js";
import { TOKEN_ADDRESSES } from "./types.js";

/**
 * Token balance with metadata
 */
export interface TokenBalance {
  token: PaymentToken;
  address: string;
  balance: bigint;
  formatted: string;
  decimals: number;
}

/**
 * Portfolio of token balances
 */
export interface Portfolio {
  address: `0x${string}`;
  nativeBalance: bigint;
  nativeFormatted: string;
  tokens: TokenBalance[];
  totalTokens: number;
}

/**
 * ERC20 ABI for balance queries
 */
const ERC20_ABI = [
  {
    inputs: [{ name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

/**
 * Get native token balance (ETH, BNB, etc.)
 */
export async function getNativeBalance(
  publicClient: PublicClient,
  address: `0x${string}`
): Promise<bigint> {
  return await publicClient.getBalance({ address });
}

/**
 * Get ERC20 token balance
 */
export async function getTokenBalance(
  publicClient: PublicClient,
  tokenAddress: `0x${string}`,
  userAddress: `0x${string}`
): Promise<bigint> {
  const balance = await publicClient.readContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: [userAddress],
  });

  return balance as bigint;
}

/**
 * Get token decimals
 */
export async function getTokenDecimals(
  publicClient: PublicClient,
  tokenAddress: `0x${string}`
): Promise<number> {
  const decimals = await publicClient.readContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: "decimals",
  });

  return decimals as number;
}

/**
 * Get multiple token balances in parallel
 */
export async function getMultipleTokenBalances(
  publicClient: PublicClient,
  tokens: Array<{ address: `0x${string}`; name: PaymentToken }>,
  userAddress: `0x${string}`
): Promise<TokenBalance[]> {
  const balances = await Promise.all(
    tokens.map(async (token) => {
      try {
        const [balance, decimals] = await Promise.all([
          getTokenBalance(publicClient, token.address, userAddress),
          getTokenDecimals(publicClient, token.address),
        ]);

        return {
          token: token.name,
          address: token.address,
          balance,
          formatted: formatUnits(balance, decimals),
          decimals,
        };
      } catch (error) {
        // Return zero balance if token query fails
        return {
          token: token.name,
          address: token.address,
          balance: 0n,
          formatted: "0",
          decimals: 18,
        };
      }
    })
  );

  return balances;
}

/**
 * Get complete portfolio for an address on a chain
 */
export async function getPortfolio(
  publicClient: PublicClient,
  userAddress: `0x${string}`,
  chainTokens: Record<PaymentToken, string>
): Promise<Portfolio> {
  const nativeBalance = await getNativeBalance(publicClient, userAddress);

  const tokens = Object.entries(chainTokens).map(([token, address]) => ({
    address: address as `0x${string}`,
    name: token as PaymentToken,
  }));

  const tokenBalances = await getMultipleTokenBalances(
    publicClient,
    tokens,
    userAddress
  );

  return {
    address: userAddress,
    nativeBalance,
    nativeFormatted: formatUnits(nativeBalance, 18),
    tokens: tokenBalances,
    totalTokens: tokenBalances.filter((t) => t.balance > 0n).length,
  };
}

/**
 * Check if address has sufficient balance for payment
 */
export async function hasSufficientBalance(
  publicClient: PublicClient,
  tokenAddress: `0x${string}`,
  userAddress: `0x${string}`,
  requiredAmount: bigint
): Promise<boolean> {
  const balance = await getTokenBalance(publicClient, tokenAddress, userAddress);
  return balance >= requiredAmount;
}

/**
 * Check native token balance is sufficient (including gas)
 */
export async function hasSufficientNativeBalance(
  publicClient: PublicClient,
  userAddress: `0x${string}`,
  requiredAmount: bigint,
  estimatedGas: bigint
): Promise<{ sufficient: boolean; shortfall?: bigint }> {
  const balance = await getNativeBalance(publicClient, userAddress);
  const totalRequired = requiredAmount + estimatedGas;

  if (balance >= totalRequired) {
    return { sufficient: true };
  }

  return {
    sufficient: false,
    shortfall: totalRequired - balance,
  };
}

/**
 * Get token balance with retry on failure
 */
export async function getTokenBalanceWithRetry(
  publicClient: PublicClient,
  tokenAddress: `0x${string}`,
  userAddress: `0x${string}`,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<bigint> {
  let lastError: Error | undefined;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await getTokenBalance(publicClient, tokenAddress, userAddress);
    } catch (error: any) {
      lastError = error;
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delayMs * (i + 1)));
      }
    }
  }

  throw new Error(
    `Failed to get token balance after ${maxRetries} attempts: ${lastError?.message}`
  );
}

/**
 * Compare balances before and after transaction
 */
export interface BalanceChange {
  before: bigint;
  after: bigint;
  change: bigint;
  increased: boolean;
}

export async function trackBalanceChange(
  publicClient: PublicClient,
  tokenAddress: `0x${string}`,
  userAddress: `0x${string}`,
  operation: () => Promise<void>
): Promise<BalanceChange> {
  const before = await getTokenBalance(publicClient, tokenAddress, userAddress);
  
  await operation();
  
  const after = await getTokenBalance(publicClient, tokenAddress, userAddress);
  const change = after > before ? after - before : before - after;

  return {
    before,
    after,
    change,
    increased: after > before,
  };
}
