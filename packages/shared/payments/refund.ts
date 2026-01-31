/**
 * @file refund.ts
 * @author nirholas
 * @copyright (c) 2026 nichxbt
 * @repository universal-crypto-mcp
 * @version 0.4.14.3
 *
 * Payment refund logic implementation
 * Implements: facilitator.ts#L457, payment.ts#L405, revenue.ts#L519 TODOs
 */

import {
  createPublicClient,
  createWalletClient,
  http,
  parseUnits,
  formatUnits,
  type Address,
  type Hash,
  type Hex,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base, arbitrum, mainnet, optimism } from "viem/chains";

// ERC20 ABI subset for transfers
const ERC20_ABI = [
  {
    name: "transfer",
    type: "function",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
  },
  {
    name: "balanceOf",
    type: "function",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    name: "decimals",
    type: "function",
    inputs: [],
    outputs: [{ name: "", type: "uint8" }],
    stateMutability: "view",
  },
] as const;

// USDC addresses by chain
const USDC_ADDRESSES: Record<number, Address> = {
  1: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // Ethereum
  8453: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // Base
  42161: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831", // Arbitrum
  10: "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85", // Optimism
};

// Chain configs
const CHAINS: Record<number, { chain: typeof mainnet; rpcEnv: string; defaultRpc: string }> = {
  1: { chain: mainnet, rpcEnv: "RPC_ETHEREUM", defaultRpc: "https://eth.llamarpc.com" },
  8453: { chain: base, rpcEnv: "RPC_BASE", defaultRpc: "https://mainnet.base.org" },
  42161: { chain: arbitrum, rpcEnv: "RPC_ARBITRUM", defaultRpc: "https://arb1.arbitrum.io/rpc" },
  10: { chain: optimism, rpcEnv: "RPC_OPTIMISM", defaultRpc: "https://mainnet.optimism.io" },
};

export interface RefundResult {
  success: boolean;
  txHash?: Hash;
  error?: string;
  amount?: string;
  recipient?: Address;
}

/**
 * Process a USDC refund for a payment
 */
export async function processRefund(
  recipientAddress: Address,
  amountUsdc: string,
  reason: string,
  chainId: number = 8453
): Promise<RefundResult> {
  const privateKey = process.env.REFUND_WALLET_PRIVATE_KEY;
  if (!privateKey) {
    return { success: false, error: "Refund wallet not configured" };
  }

  const chainConfig = CHAINS[chainId];
  if (!chainConfig) {
    return { success: false, error: `Unsupported chain: ${chainId}` };
  }

  const usdcAddress = USDC_ADDRESSES[chainId];
  if (!usdcAddress) {
    return { success: false, error: `USDC not supported on chain ${chainId}` };
  }

  const rpcUrl = process.env[chainConfig.rpcEnv] || chainConfig.defaultRpc;

  try {
    const account = privateKeyToAccount(privateKey as Hex);

    const publicClient = createPublicClient({
      chain: chainConfig.chain,
      transport: http(rpcUrl),
    });

    const walletClient = createWalletClient({
      account,
      chain: chainConfig.chain,
      transport: http(rpcUrl),
    });

    // Get token decimals (USDC is 6 on most chains)
    const decimals = await publicClient.readContract({
      address: usdcAddress,
      abi: ERC20_ABI,
      functionName: "decimals",
    });

    // Parse amount
    const amount = parseUnits(amountUsdc, decimals);

    // Check balance
    const balance = await publicClient.readContract({
      address: usdcAddress,
      abi: ERC20_ABI,
      functionName: "balanceOf",
      args: [account.address],
    });

    if (balance < amount) {
      return {
        success: false,
        error: `Insufficient refund balance. Need ${amountUsdc} USDC, have ${formatUnits(balance, decimals)} USDC`,
      };
    }

    // Execute transfer
    const hash = await walletClient.writeContract({
      address: usdcAddress,
      abi: ERC20_ABI,
      functionName: "transfer",
      args: [recipientAddress, amount],
    });

    // Wait for confirmation
    const receipt = await publicClient.waitForTransactionReceipt({
      hash,
      confirmations: 1,
    });

    if (receipt.status !== "success") {
      return { success: false, error: "Refund transaction reverted" };
    }

    console.log("[Refund] Processed successfully:", {
      txHash: hash,
      to: recipientAddress,
      amount: amountUsdc,
      reason,
      chainId,
    });

    return {
      success: true,
      txHash: hash,
      amount: amountUsdc,
      recipient: recipientAddress,
    };
  } catch (error) {
    console.error("[Refund] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown refund error",
    };
  }
}

/**
 * Verify a payment transaction on-chain
 */
export async function verifyPaymentOnChain(
  txHash: Hash,
  expectedRecipient: Address,
  expectedAmount: string,
  chainId: number = 8453
): Promise<{ valid: boolean; actualAmount?: string; error?: string }> {
  const chainConfig = CHAINS[chainId];
  if (!chainConfig) {
    return { valid: false, error: `Unsupported chain: ${chainId}` };
  }

  const usdcAddress = USDC_ADDRESSES[chainId];
  if (!usdcAddress) {
    return { valid: false, error: `USDC not supported on chain ${chainId}` };
  }

  const rpcUrl = process.env[chainConfig.rpcEnv] || chainConfig.defaultRpc;

  try {
    const publicClient = createPublicClient({
      chain: chainConfig.chain,
      transport: http(rpcUrl),
    });

    // Get transaction receipt
    const receipt = await publicClient.getTransactionReceipt({ hash: txHash });

    if (!receipt) {
      return { valid: false, error: "Transaction not found" };
    }

    if (receipt.status !== "success") {
      return { valid: false, error: "Transaction failed" };
    }

    // Parse Transfer events (ERC20 Transfer topic)
    const TRANSFER_TOPIC =
      "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";

    const transferLogs = receipt.logs.filter(
      (log) =>
        log.topics[0] === TRANSFER_TOPIC &&
        log.address.toLowerCase() === usdcAddress.toLowerCase()
    );

    if (transferLogs.length === 0) {
      return { valid: false, error: "No USDC transfer found in transaction" };
    }

    // USDC has 6 decimals
    const expectedAmount6 = parseUnits(expectedAmount, 6);

    // Check for transfer to expected recipient with sufficient amount
    for (const log of transferLogs) {
      // topics[2] is the 'to' address (padded to 32 bytes)
      const toAddress = ("0x" + log.topics[2]?.slice(-40)) as Address;
      const amount = BigInt(log.data);

      if (
        toAddress.toLowerCase() === expectedRecipient.toLowerCase() &&
        amount >= expectedAmount6
      ) {
        return {
          valid: true,
          actualAmount: formatUnits(amount, 6),
        };
      }
    }

    return { valid: false, error: "No matching transfer to recipient" };
  } catch (error) {
    return {
      valid: false,
      error: `Verification error: ${error instanceof Error ? error.message : "Unknown"}`,
    };
  }
}

/**
 * Process batch refunds efficiently
 */
export async function processBatchRefunds(
  refunds: Array<{
    recipient: Address;
    amount: string;
    reason: string;
  }>,
  chainId: number = 8453
): Promise<{
  successful: RefundResult[];
  failed: Array<{ recipient: Address; error: string }>;
}> {
  const successful: RefundResult[] = [];
  const failed: Array<{ recipient: Address; error: string }> = [];

  // Process sequentially to avoid nonce issues
  for (const refund of refunds) {
    const result = await processRefund(
      refund.recipient,
      refund.amount,
      refund.reason,
      chainId
    );

    if (result.success) {
      successful.push(result);
    } else {
      failed.push({
        recipient: refund.recipient,
        error: result.error || "Unknown error",
      });
    }

    // Small delay between transactions
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  return { successful, failed };
}

export default {
  processRefund,
  verifyPaymentOnChain,
  processBatchRefunds,
  USDC_ADDRESSES,
};
