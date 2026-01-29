/**
 * Multicall utilities for batch contract reads
 * 
 * Efficiently batch multiple contract calls into single transaction.
 */

import type { PublicClient } from "viem";
import { encodeFunctionData, decodeFunctionResult } from "viem";

/**
 * Multicall3 contract address (deployed on most chains)
 */
export const MULTICALL3_ADDRESS = "0xcA11bde05977b3631167028862bE2a173976CA11" as const;

/**
 * Multicall3 ABI
 */
const MULTICALL3_ABI = [
  {
    inputs: [
      {
        components: [
          { name: "target", type: "address" },
          { name: "allowFailure", type: "bool" },
          { name: "callData", type: "bytes" },
        ],
        name: "calls",
        type: "tuple[]",
      },
    ],
    name: "aggregate3",
    outputs: [
      {
        components: [
          { name: "success", type: "bool" },
          { name: "returnData", type: "bytes" },
        ],
        name: "returnData",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

/**
 * Call to be batched
 */
export interface Call {
  target: `0x${string}`;
  callData: `0x${string}`;
  allowFailure?: boolean;
}

/**
 * Multicall result
 */
export interface CallResult {
  success: boolean;
  returnData: `0x${string}`;
}

/**
 * Execute multiple calls in a single transaction
 */
export async function multicall(
  publicClient: PublicClient,
  calls: Call[]
): Promise<CallResult[]> {
  const multicallCalls = calls.map((call) => ({
    target: call.target,
    allowFailure: call.allowFailure ?? true,
    callData: call.callData,
  }));

  const results = await publicClient.readContract({
    address: MULTICALL3_ADDRESS,
    abi: MULTICALL3_ABI,
    functionName: "aggregate3",
    args: [multicallCalls],
  });

  return results as CallResult[];
}

/**
 * Batch read multiple ERC20 balances
 */
export async function batchGetBalances(
  publicClient: PublicClient,
  tokens: `0x${string}`[],
  account: `0x${string}`
): Promise<Map<`0x${string}`, bigint>> {
  const balanceOfAbi = [
    {
      inputs: [{ name: "account", type: "address" }],
      name: "balanceOf",
      outputs: [{ name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
  ] as const;

  const calls: Call[] = tokens.map((token) => ({
    target: token,
    callData: encodeFunctionData({
      abi: balanceOfAbi,
      functionName: "balanceOf",
      args: [account],
    }),
  }));

  const results = await multicall(publicClient, calls);

  const balances = new Map<`0x${string}`, bigint>();
  
  results.forEach((result, index) => {
    if (result.success) {
      try {
        const balance = decodeFunctionResult({
          abi: balanceOfAbi,
          functionName: "balanceOf",
          data: result.returnData,
        }) as bigint;
        
        balances.set(tokens[index], balance);
      } catch {
        balances.set(tokens[index], 0n);
      }
    } else {
      balances.set(tokens[index], 0n);
    }
  });

  return balances;
}

/**
 * Batch read token decimals
 */
export async function batchGetDecimals(
  publicClient: PublicClient,
  tokens: `0x${string}`[]
): Promise<Map<`0x${string}`, number>> {
  const decimalsAbi = [
    {
      inputs: [],
      name: "decimals",
      outputs: [{ name: "", type: "uint8" }],
      stateMutability: "view",
      type: "function",
    },
  ] as const;

  const calls: Call[] = tokens.map((token) => ({
    target: token,
    callData: encodeFunctionData({
      abi: decimalsAbi,
      functionName: "decimals",
    }),
  }));

  const results = await multicall(publicClient, calls);

  const decimals = new Map<`0x${string}`, number>();
  
  results.forEach((result, index) => {
    if (result.success) {
      try {
        const decimal = decodeFunctionResult({
          abi: decimalsAbi,
          functionName: "decimals",
          data: result.returnData,
        }) as number;
        
        decimals.set(tokens[index], decimal);
      } catch {
        decimals.set(tokens[index], 18); // Default to 18
      }
    } else {
      decimals.set(tokens[index], 18);
    }
  });

  return decimals;
}

/**
 * Batch check token allowances
 */
export async function batchGetAllowances(
  publicClient: PublicClient,
  tokens: `0x${string}`[],
  owner: `0x${string}`,
  spender: `0x${string}`
): Promise<Map<`0x${string}`, bigint>> {
  const allowanceAbi = [
    {
      inputs: [
        { name: "owner", type: "address" },
        { name: "spender", type: "address" },
      ],
      name: "allowance",
      outputs: [{ name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
  ] as const;

  const calls: Call[] = tokens.map((token) => ({
    target: token,
    callData: encodeFunctionData({
      abi: allowanceAbi,
      functionName: "allowance",
      args: [owner, spender],
    }),
  }));

  const results = await multicall(publicClient, calls);

  const allowances = new Map<`0x${string}`, bigint>();
  
  results.forEach((result, index) => {
    if (result.success) {
      try {
        const allowance = decodeFunctionResult({
          abi: allowanceAbi,
          functionName: "allowance",
          data: result.returnData,
        }) as bigint;
        
        allowances.set(tokens[index], allowance);
      } catch {
        allowances.set(tokens[index], 0n);
      }
    } else {
      allowances.set(tokens[index], 0n);
    }
  });

  return allowances;
}

/**
 * Batch get token metadata (symbol, name, decimals)
 */
export interface TokenMetadata {
  symbol: string;
  name: string;
  decimals: number;
}

export async function batchGetTokenMetadata(
  publicClient: PublicClient,
  tokens: `0x${string}`[]
): Promise<Map<`0x${string}`, TokenMetadata>> {
  const metadataAbi = [
    {
      inputs: [],
      name: "symbol",
      outputs: [{ name: "", type: "string" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "name",
      outputs: [{ name: "", type: "string" }],
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
  ] as const;

  const calls: Call[] = tokens.flatMap((token) => [
    {
      target: token,
      callData: encodeFunctionData({
        abi: metadataAbi,
        functionName: "symbol",
      }),
    },
    {
      target: token,
      callData: encodeFunctionData({
        abi: metadataAbi,
        functionName: "name",
      }),
    },
    {
      target: token,
      callData: encodeFunctionData({
        abi: metadataAbi,
        functionName: "decimals",
      }),
    },
  ]);

  const results = await multicall(publicClient, calls);

  const metadata = new Map<`0x${string}`, TokenMetadata>();
  
  for (let i = 0; i < tokens.length; i++) {
    const symbolResult = results[i * 3];
    const nameResult = results[i * 3 + 1];
    const decimalsResult = results[i * 3 + 2];

    let symbol = "UNKNOWN";
    let name = "Unknown Token";
    let decimals = 18;

    if (symbolResult.success) {
      try {
        symbol = decodeFunctionResult({
          abi: metadataAbi,
          functionName: "symbol",
          data: symbolResult.returnData,
        }) as string;
      } catch {}
    }

    if (nameResult.success) {
      try {
        name = decodeFunctionResult({
          abi: metadataAbi,
          functionName: "name",
          data: nameResult.returnData,
        }) as string;
      } catch {}
    }

    if (decimalsResult.success) {
      try {
        decimals = decodeFunctionResult({
          abi: metadataAbi,
          functionName: "decimals",
          data: decimalsResult.returnData,
        }) as number;
      } catch {}
    }

    metadata.set(tokens[i], { symbol, name, decimals });
  }

  return metadata;
}

/**
 * Advanced multicall features
 */

/**
 * Batched portfolio tracker
 */
export interface PortfolioPosition {
  token: `0x${string}`;
  balance: bigint;
  symbol: string;
  decimals: number;
  allowance?: bigint;
}

/**
 * Get complete portfolio data in one call
 */
export async function getPortfolio(
  publicClient: PublicClient,
  tokens: `0x${string}`[],
  account: `0x${string}`,
  spender?: `0x${string}`
): Promise<PortfolioPosition[]> {
  const balances = await batchGetBalances(publicClient, tokens, account);
  const metadata = await batchGetTokenMetadata(publicClient, tokens);

  let allowances: Map<`0x${string}`, bigint> | undefined;
  if (spender) {
    allowances = await batchGetAllowances(publicClient, tokens, account, spender);
  }

  return tokens.map(token => ({
    token,
    balance: balances.get(token) || 0n,
    symbol: metadata.get(token)?.symbol || "UNKNOWN",
    decimals: metadata.get(token)?.decimals || 18,
    allowance: allowances?.get(token),
  }));
}

/**
 * Batch check if multiple tokens are approved for spender
 */
export async function batchCheckApprovals(
  publicClient: PublicClient,
  tokens: `0x${string}`[],
  owner: `0x${string}`,
  spender: `0x${string}`,
  requiredAmounts: bigint[]
): Promise<Map<`0x${string}`, boolean>> {
  const allowances = await batchGetAllowances(publicClient, tokens, owner, spender);

  const approvalStatus = new Map<`0x${string}`, boolean>();

  tokens.forEach((token, index) => {
    const allowance = allowances.get(token) || 0n;
    const required = requiredAmounts[index] || 0n;
    approvalStatus.set(token, allowance >= required);
  });

  return approvalStatus;
}

/**
 * Batch get LP token information
 */
export interface LPTokenInfo {
  token: `0x${string}`;
  token0: `0x${string}`;
  token1: `0x${string}`;
  reserves0: bigint;
  reserves1: bigint;
  totalSupply: bigint;
  balance: bigint;
}

/**
 * Get LP token information for multiple pools
 */
export async function batchGetLPInfo(
  publicClient: PublicClient,
  lpTokens: `0x${string}`[],
  account: `0x${string}`
): Promise<Map<`0x${string}`, LPTokenInfo>> {
  const lpAbi = [
    {
      inputs: [],
      name: "token0",
      outputs: [{ name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "token1",
      outputs: [{ name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getReserves",
      outputs: [
        { name: "reserve0", type: "uint112" },
        { name: "reserve1", type: "uint112" },
        { name: "blockTimestampLast", type: "uint32" },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "totalSupply",
      outputs: [{ name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ name: "account", type: "address" }],
      name: "balanceOf",
      outputs: [{ name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
  ] as const;

  const calls: Call[] = lpTokens.flatMap(lp => [
    {
      target: lp,
      callData: encodeFunctionData({
        abi: lpAbi,
        functionName: "token0",
      }),
    },
    {
      target: lp,
      callData: encodeFunctionData({
        abi: lpAbi,
        functionName: "token1",
      }),
    },
    {
      target: lp,
      callData: encodeFunctionData({
        abi: lpAbi,
        functionName: "getReserves",
      }),
    },
    {
      target: lp,
      callData: encodeFunctionData({
        abi: lpAbi,
        functionName: "totalSupply",
      }),
    },
    {
      target: lp,
      callData: encodeFunctionData({
        abi: lpAbi,
        functionName: "balanceOf",
        args: [account],
      }),
    },
  ]);

  const results = await multicall(publicClient, calls);

  const lpInfo = new Map<`0x${string}`, LPTokenInfo>();

  for (let i = 0; i < lpTokens.length; i++) {
    const token0Result = results[i * 5];
    const token1Result = results[i * 5 + 1];
    const reservesResult = results[i * 5 + 2];
    const totalSupplyResult = results[i * 5 + 3];
    const balanceResult = results[i * 5 + 4];

    if (
      token0Result.success &&
      token1Result.success &&
      reservesResult.success &&
      totalSupplyResult.success &&
      balanceResult.success
    ) {
      const token0 = decodeFunctionResult({
        abi: lpAbi,
        functionName: "token0",
        data: token0Result.returnData,
      }) as `0x${string}`;

      const token1 = decodeFunctionResult({
        abi: lpAbi,
        functionName: "token1",
        data: token1Result.returnData,
      }) as `0x${string}`;

      const [reserves0, reserves1] = decodeFunctionResult({
        abi: lpAbi,
        functionName: "getReserves",
        data: reservesResult.returnData,
      }) as [bigint, bigint, number];

      const totalSupply = decodeFunctionResult({
        abi: lpAbi,
        functionName: "totalSupply",
        data: totalSupplyResult.returnData,
      }) as bigint;

      const balance = decodeFunctionResult({
        abi: lpAbi,
        functionName: "balanceOf",
        data: balanceResult.returnData,
      }) as bigint;

      lpInfo.set(lpTokens[i], {
        token: lpTokens[i],
        token0,
        token1,
        reserves0,
        reserves1,
        totalSupply,
        balance,
      });
    }
  }

  return lpInfo;
}

/**
 * Retry failed multicall with individual calls
 */
export async function multicallWithRetry(
  publicClient: PublicClient,
  calls: Call[],
  maxRetries: number = 3
): Promise<CallResult[]> {
  let attempt = 0;
  let lastError: Error | undefined;

  while (attempt < maxRetries) {
    try {
      return await multicall(publicClient, calls);
    } catch (error) {
      lastError = error as Error;
      attempt++;

      if (attempt >= maxRetries) {
        break;
      }

      // Wait before retry (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
    }
  }

  // If all retries failed, try individual calls
  console.warn("Multicall failed, falling back to individual calls");

  const results: CallResult[] = [];

  for (const call of calls) {
    try {
      const data = await publicClient.call({
        to: call.target,
        data: call.callData,
      });

      results.push({
        success: true,
        returnData: data.data || "0x",
      });
    } catch (error) {
      results.push({
        success: false,
        returnData: "0x",
      });
    }
  }

  return results;
}

/**
 * Split large multicall into chunks
 */
export async function multicallChunked(
  publicClient: PublicClient,
  calls: Call[],
  chunkSize: number = 100
): Promise<CallResult[]> {
  const results: CallResult[] = [];

  for (let i = 0; i < calls.length; i += chunkSize) {
    const chunk = calls.slice(i, i + chunkSize);
    const chunkResults = await multicall(publicClient, chunk);
    results.push(...chunkResults);
  }

  return results;
}
