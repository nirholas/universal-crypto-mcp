/**
 * Synapse Bridge Provider
 * Integration with Synapse Protocol cross-chain bridge
 */

import type { SupportedChain } from "../../config/chains.js";
import type {
  IBridgeProvider,
  BridgeQuote,
  BridgeQuoteRequest,
  BridgeTransaction,
  BridgeReceipt,
} from "./types.js";

export function createSynapseProvider(): IBridgeProvider {
  return {
    name: "Synapse",

    async getQuote(request: BridgeQuoteRequest): Promise<BridgeQuote | null> {
      try {
        // Synapse API endpoint
        const url = new URL("https://syn-api-x.herokuapp.com/v1/generate_unsigned_bridge_txn");
        url.searchParams.set("fromChain", getChainId(request.sourceChain).toString());
        url.searchParams.set("toChain", getChainId(request.destinationChain).toString());
        url.searchParams.set("fromToken", request.token);
        url.searchParams.set("toToken", request.token); // Same token cross-chain
        url.searchParams.set("amount", request.amount.toString());
        url.searchParams.set("fromAddress", request.userAddress);
        url.searchParams.set("toAddress", request.userAddress);

        const response = await fetch(url.toString(), {
          signal: AbortSignal.timeout(10000),
        });

        if (!response.ok) {
          return null;
        }

        const data = await response.json();

        if (!data || !data.amountToReceive) {
          return null;
        }

        // Calculate fees
        const outputAmount = BigInt(data.amountToReceive);
        const fee = request.amount - outputAmount;
        const feeUSD = Number(fee) / 1e18; // Simplified

        return {
          provider: "Synapse",
          sourceChain: request.sourceChain,
          destinationChain: request.destinationChain,
          token: request.token,
          amount: request.amount,
          outputAmount,
          estimatedTime: 5, // Minutes (Synapse is typically fast)
          fee,
          feeUSD,
          estimatedGas: BigInt(data.estimatedGas || 200000),
        };
      } catch (error) {
        console.error("[Synapse] Quote error:", error);
        return null;
      }
    },

    async executeBridge(quote: BridgeQuote): Promise<BridgeTransaction> {
      try {
        // Get unsigned transaction from Synapse
        const url = new URL("https://syn-api-x.herokuapp.com/v1/generate_unsigned_bridge_txn");
        url.searchParams.set("fromChain", getChainId(quote.sourceChain).toString());
        url.searchParams.set("toChain", getChainId(quote.destinationChain).toString());
        url.searchParams.set("fromToken", quote.token);
        url.searchParams.set("toToken", quote.token);
        url.searchParams.set("amount", quote.amount.toString());

        const response = await fetch(url.toString(), {
          signal: AbortSignal.timeout(10000),
        });

        if (!response.ok) {
          throw new Error(`Synapse API error: ${response.status}`);
        }

        const data = await response.json();

        return {
          bridgeId: `synapse-${Date.now()}`,
          to: data.to,
          data: data.data,
          value: BigInt(data.value || 0),
          chainId: getChainId(quote.sourceChain),
        };
      } catch (error) {
        throw new Error(`Synapse execution failed: ${error}`);
      }
    },

    async getReceipt(bridgeId: string): Promise<BridgeReceipt> {
      // Synapse doesn't provide a direct receipt API
      // In production, would monitor events or use explorer APIs
      return {
        bridgeId,
        status: "pending",
        sourceChain: "ethereum" as SupportedChain,
        destinationChain: "arbitrum" as SupportedChain,
        txHash: null,
        destTxHash: null,
      };
    },

    async getSupportedTokens(
      sourceChain: SupportedChain,
      destinationChain: SupportedChain
    ): Promise<`0x${string}`[]> {
      // Common tokens supported by Synapse
      return [
        "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
        "0xdAC17F958D2ee523a2206206994597C13D831ec7", // USDT
        "0x6B175474E89094C44Da98b954EedeAC495271d0F", // DAI
        "0x853d955aCEf822Db058eb8505911ED77F175b99e", // FRAX
      ];
    },
  };
}

/**
 * Get chain ID for Synapse API
 */
function getChainId(chain: SupportedChain): number {
  const chainIds: Record<string, number> = {
    ethereum: 1,
    arbitrum: 42161,
    optimism: 10,
    polygon: 137,
    base: 8453,
    avalanche: 43114,
    bsc: 56,
  };
  return chainIds[chain] || 1;
}
