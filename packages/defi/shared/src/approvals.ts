/**
 * Token approval utilities
 * 
 * Manages ERC20 token approvals for DeFi protocols.
 */

import {
  type PublicClient,
  type WalletClient,
  encodeFunctionData,
  parseUnits,
  maxUint256,
} from "viem";

/**
 * ERC20 ABI for approval operations
 */
const ERC20_ABI = [
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
  {
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
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

/**
 * Check current token allowance
 */
export async function checkAllowance(
  publicClient: PublicClient,
  tokenAddress: `0x${string}`,
  owner: `0x${string}`,
  spender: `0x${string}`
): Promise<bigint> {
  const allowance = await publicClient.readContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: "allowance",
    args: [owner, spender],
  });

  return allowance as bigint;
}

/**
 * Check if approval is needed for an amount
 */
export async function needsApproval(
  publicClient: PublicClient,
  tokenAddress: `0x${string}`,
  owner: `0x${string}`,
  spender: `0x${string}`,
  amount: bigint
): Promise<boolean> {
  const currentAllowance = await checkAllowance(
    publicClient,
    tokenAddress,
    owner,
    spender
  );

  return currentAllowance < amount;
}

/**
 * Approve exact amount
 */
export async function approveToken(
  publicClient: PublicClient,
  walletClient: WalletClient,
  tokenAddress: `0x${string}`,
  spender: `0x${string}`,
  amount: bigint
): Promise<`0x${string}`> {
  const account = walletClient.account;
  if (!account) {
    throw new Error("Wallet client has no account");
  }

  const { request } = await publicClient.simulateContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: "approve",
    args: [spender, amount],
    account: account.address,
  });

  const hash = await walletClient.writeContract(request);
  return hash;
}

/**
 * Approve unlimited amount (max uint256)
 */
export async function approveUnlimited(
  publicClient: PublicClient,
  walletClient: WalletClient,
  tokenAddress: `0x${string}`,
  spender: `0x${string}`
): Promise<`0x${string}`> {
  return approveToken(publicClient, walletClient, tokenAddress, spender, maxUint256);
}

/**
 * Ensure sufficient approval, approve if needed
 */
export async function ensureApproval(
  publicClient: PublicClient,
  walletClient: WalletClient,
  tokenAddress: `0x${string}`,
  spender: `0x${string}`,
  amount: bigint,
  useUnlimited: boolean = false
): Promise<{ approved: boolean; txHash?: `0x${string}` }> {
  const account = walletClient.account;
  if (!account) {
    throw new Error("Wallet client has no account");
  }

  const isApprovalNeeded = await needsApproval(
    publicClient,
    tokenAddress,
    account.address,
    spender,
    amount
  );

  if (!isApprovalNeeded) {
    return { approved: true };
  }

  const approvalAmount = useUnlimited ? maxUint256 : amount;
  const txHash = await approveToken(
    publicClient,
    walletClient,
    tokenAddress,
    spender,
    approvalAmount
  );

  // Wait for transaction confirmation
  await publicClient.waitForTransactionReceipt({ hash: txHash });

  return { approved: true, txHash };
}

/**
 * Revoke approval (set to 0)
 */
export async function revokeApproval(
  publicClient: PublicClient,
  walletClient: WalletClient,
  tokenAddress: `0x${string}`,
  spender: `0x${string}`
): Promise<`0x${string}`> {
  return approveToken(publicClient, walletClient, tokenAddress, spender, 0n);
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
 * Batch check multiple token allowances
 */
export async function batchCheckAllowances(
  publicClient: PublicClient,
  tokens: `0x${string}`[],
  owner: `0x${string}`,
  spender: `0x${string}`
): Promise<Map<`0x${string}`, bigint>> {
  const allowances = await Promise.all(
    tokens.map((token) => checkAllowance(publicClient, token, owner, spender))
  );

  const result = new Map<`0x${string}`, bigint>();
  tokens.forEach((token, index) => {
    result.set(token, allowances[index]);
  });

  return result;
}
