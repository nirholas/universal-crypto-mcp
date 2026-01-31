/**
 * Synapse Bridge Provider
 * Integration with Synapse Protocol for cross-chain bridging
 */

import type { SupportedChain } from "../../config/chains.js";
import type { Address, Hash } from "viem";
import {
  BridgeProvider,
  type IBridgeProvider,
  type BridgeQuote,
  type BridgeQuoteRequest,
  type BridgeTransaction,
  type BridgeReceipt,
} from "./types.js";

const SYNAPSE_API = "https://api.synapseprotocol.com/v1";

// Chain IDs for Synapse
const CHAIN_IDS: Record<string, number> = {
  ethereum: 1,
  arbitrum: 42161,
  base: 8453,
  optimism: 10,
  polygon: 137,
  avalanche: 43114,
  bsc: 56,
};

// Synapse Router addresses per chain
const SYNAPSE_ROUTER: Record<number, Address> = {
  1: "0x2796317b0fF8538F253012862c06787Adfb8cEb6",
  42161: "0x6F4e8eBa4D337f874Ab57478AcC2Cb5BACdc19c9",
  8453: "0x6F4e8eBa4D337f874Ab57478AcC2Cb5BACdc19c9",
  10: "0x6F4e8eBa4D337f874Ab57478AcC2Cb5BACdc19c9",
  137: "0x6F4e8eBa4D337f874Ab57478AcC2Cb5BACdc19c9",
};

interface SynapseQuoteResponse {
  outputAmount: string;
  routerAddress: string;
  deadline: number;
  minAmountOut: string;
  bridgeFee: string;
  gasEstimate: string;
  estimatedTime: number;
  swapData: string;
}

class SynapseProvider implements IBridgeProvider {
  readonly name = BridgeProvider.SYNAPSE;
  readonly displayName = "Synapse";
  readonly estimatedTimeSeconds = 600; // ~10 minutes average

  async supportsRoute(
    sourceChain: SupportedChain,
    destinationChain: SupportedChain,
    token: Address
  ): Promise<boolean> {
    const sourceChainId = CHAIN_IDS[sourceChain];
    const destChainId = CHAIN_IDS[destinationChain];

    if (!sourceChainId || !destChainId) {
      return false;
    }

    // Check if both chains have Synapse routers
    if (!SYNAPSE_ROUTER[sourceChainId] || !SYNAPSE_ROUTER[destChainId]) {
      return false;
    }

    try {
      const response = await fetch(
        `${SYNAPSE_API}/bridge/routes?` +
        `fromChain=${sourceChainId}&toChain=${destChainId}&token=${token}`,
        { signal: AbortSignal.timeout(5000) }
      );

      if (!response.ok) return false;

      const data = await response.json() as { supported: boolean };
      return data.supported;
    } catch {
      // If API call fails, assume route is available for major chains
      return sourceChainId !== destChainId;
    }
  }

  async getQuote(request: BridgeQuoteRequest): Promise<BridgeQuote | null> {
    const sourceChainId = CHAIN_IDS[request.sourceChain];
    const destChainId = CHAIN_IDS[request.destinationChain];

    if (!sourceChainId || !destChainId) {
      return null;
    }

    try {
      const params = new URLSearchParams({
        fromChain: String(sourceChainId),
        toChain: String(destChainId),
        fromToken: request.token,
        toToken: request.destinationToken || request.token,
        amount: request.amount,
        destAddress: request.recipient,
      });

      const response = await fetch(`${SYNAPSE_API}/bridge/quote?${params}`, {
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) {
        console.error("[Synapse] Quote request failed:", await response.text());
        return null;
      }

      const data = await response.json() as SynapseQuoteResponse;

      return {
        provider: BridgeProvider.SYNAPSE,
        sourceChain: request.sourceChain,
        destinationChain: request.destinationChain,
        inputToken: request.token,
        outputToken: (request.destinationToken || request.token) as Address,
        inputAmount: request.amount,
        outputAmount: data.outputAmount,
        estimatedTimeSeconds: data.estimatedTime || this.estimatedTimeSeconds,
        totalFeeUsd: parseFloat(data.bridgeFee) / 1e6, // Assuming USDC decimals
        slippage: request.slippage || 0.005,
        deadline: data.deadline,
        routerAddress: data.routerAddress as Address,
        calldata: data.swapData as `0x${string}`,
        expiresAt: Date.now() + 60000, // 1 minute validity
      };
    } catch (error) {
      console.error("[Synapse] Quote error:", error);
      return null;
    }
  }

  async buildTransaction(quote: BridgeQuote): Promise<BridgeTransaction | null> {
    const sourceChainId = CHAIN_IDS[quote.sourceChain];

    if (!sourceChainId || !quote.calldata) {
      return null;
    }

    try {
      return {
        provider: BridgeProvider.SYNAPSE,
        chainId: sourceChainId,
        to: quote.routerAddress || SYNAPSE_ROUTER[sourceChainId],
        data: quote.calldata,
        value: "0", // Will be set for native token bridges
        gasLimit: "500000",
      };
    } catch (error) {
      console.error("[Synapse] Build transaction error:", error);
      return null;
    }
  }

  async getTransactionStatus(
    txHash: Hash,
    sourceChain: SupportedChain
  ): Promise<BridgeReceipt | null> {
    const sourceChainId = CHAIN_IDS[sourceChain];

    if (!sourceChainId) {
      return null;
    }

    try {
      const response = await fetch(
        `${SYNAPSE_API}/bridge/status?txHash=${txHash}&chainId=${sourceChainId}`,
        { signal: AbortSignal.timeout(10000) }
      );

      if (!response.ok) {
        return null;
      }

      const data = await response.json() as {
        status: string;
        destTxHash?: string;
        destChainId?: number;
        completedAt?: number;
      };

      return {
        provider: BridgeProvider.SYNAPSE,
        status: data.status as "pending" | "completed" | "failed",
        sourceTxHash: txHash,
        destinationTxHash: data.destTxHash as Hash | undefined,
        completedAt: data.completedAt,
      };
    } catch (error) {
      console.error("[Synapse] Status check error:", error);
      return null;
    }
  }
}

export function createSynapseProvider(): IBridgeProvider {
  return new SynapseProvider();
}
