/**
 * Multi-Chain Payment Support
 * Support payments across Base, Arbitrum, Polygon, Ethereum
 */

import { createPublicClient, http, type Chain, type PublicClient, type Transport } from "viem";
import { base, baseSepolia, arbitrum, polygon, mainnet } from "viem/chains";

export interface ChainConfig {
  chain: Chain;
  rpcUrl?: string;
  tokens: {
    USDC: `0x${string}`;
    USDT?: `0x${string}`;
    DAI?: `0x${string}`;
  };
}

/**
 * Supported chains with their token addresses
 * Uses CAIP-2 chain identifiers (eip155:chainId)
 */
export const SUPPORTED_CHAINS: Record<string, ChainConfig> = {
  "eip155:8453": {
    chain: base,
    tokens: {
      USDC: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    },
  },
  "eip155:84532": {
    chain: baseSepolia,
    tokens: {
      USDC: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
    },
  },
  "eip155:42161": {
    chain: arbitrum,
    tokens: {
      USDC: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
      USDT: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
    },
  },
  "eip155:137": {
    chain: polygon,
    tokens: {
      USDC: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
      USDT: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
    },
  },
  "eip155:1": {
    chain: mainnet,
    tokens: {
      USDC: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      USDT: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      DAI: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    },
  },
};

// ERC20 Transfer event signature
const TRANSFER_EVENT_SIGNATURE =
  "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";

// Minimal ERC20 ABI for balance checks
const ERC20_ABI = [
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "decimals",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint8" }],
  },
  {
    name: "symbol",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "string" }],
  },
] as const;

export type SupportedToken = "USDC" | "USDT" | "DAI";
export type SupportedNetwork = keyof typeof SUPPORTED_CHAINS;

export interface PaymentVerificationResult {
  valid: boolean;
  network: string;
  token: string;
  amount: bigint;
  from: `0x${string}`;
  to: `0x${string}`;
  txHash: `0x${string}`;
  blockNumber: bigint;
  error?: string;
}

/**
 * Multi-chain payment verifier
 * Supports payment verification across multiple EVM chains
 */
export class MultiChainPaymentVerifier {
  private clients: Map<string, PublicClient<Transport, Chain>>;

  constructor(customRpcUrls?: Record<string, string>) {
    this.clients = new Map();

    // Initialize clients for each chain
    for (const [caip2, config] of Object.entries(SUPPORTED_CHAINS)) {
      const rpcUrl = customRpcUrls?.[caip2] || config.rpcUrl;
      this.clients.set(
        caip2,
        createPublicClient({
          chain: config.chain,
          transport: http(rpcUrl),
        })
      );
    }
  }

  /**
   * Get all supported networks
   */
  getSupportedNetworks(): string[] {
    return Object.keys(SUPPORTED_CHAINS);
  }

  /**
   * Get supported tokens for a network
   */
  getSupportedTokens(network: string): string[] {
    const config = SUPPORTED_CHAINS[network];
    if (!config) return [];
    return Object.keys(config.tokens);
  }

  /**
   * Check if a network is supported
   */
  isNetworkSupported(network: string): boolean {
    return network in SUPPORTED_CHAINS;
  }

  /**
   * Check if a token is supported on a network
   */
  isTokenSupported(network: string, token: string): boolean {
    const config = SUPPORTED_CHAINS[network];
    if (!config) return false;
    return token in config.tokens;
  }

  /**
   * Get the public client for a network
   */
  getClient(network: string): PublicClient<Transport, Chain> | undefined {
    return this.clients.get(network);
  }

  /**
   * Verify a payment transaction on any supported chain
   */
  async verifyPayment(
    network: string,
    token: string,
    txHash: `0x${string}`,
    expectedAmount: bigint,
    expectedRecipient: `0x${string}`
  ): Promise<PaymentVerificationResult> {
    const client = this.clients.get(network);
    if (!client) {
      return {
        valid: false,
        network,
        token,
        amount: 0n,
        from: "0x0" as `0x${string}`,
        to: "0x0" as `0x${string}`,
        txHash,
        blockNumber: 0n,
        error: `Unsupported network: ${network}`,
      };
    }

    const chainConfig = SUPPORTED_CHAINS[network];
    const tokenAddress = chainConfig.tokens[token as keyof typeof chainConfig.tokens];

    if (!tokenAddress) {
      return {
        valid: false,
        network,
        token,
        amount: 0n,
        from: "0x0" as `0x${string}`,
        to: "0x0" as `0x${string}`,
        txHash,
        blockNumber: 0n,
        error: `Token ${token} not supported on ${network}`,
      };
    }

    try {
      // Get transaction receipt
      const receipt = await client.getTransactionReceipt({ hash: txHash });

      if (!receipt || receipt.status !== "success") {
        return {
          valid: false,
          network,
          token,
          amount: 0n,
          from: receipt?.from || ("0x0" as `0x${string}`),
          to: "0x0" as `0x${string}`,
          txHash,
          blockNumber: receipt?.blockNumber || 0n,
          error: "Transaction failed or not found",
        };
      }

      // Parse transfer logs
      const transferLog = receipt.logs.find(
        (log) =>
          log.address.toLowerCase() === tokenAddress.toLowerCase() &&
          log.topics[0] === TRANSFER_EVENT_SIGNATURE
      );

      if (!transferLog) {
        return {
          valid: false,
          network,
          token,
          amount: 0n,
          from: receipt.from,
          to: "0x0" as `0x${string}`,
          txHash,
          blockNumber: receipt.blockNumber,
          error: "No transfer event found in transaction",
        };
      }

      // Decode transfer event: Transfer(address indexed from, address indexed to, uint256 value)
      const from = `0x${transferLog.topics[1]?.slice(-40)}` as `0x${string}`;
      const to = `0x${transferLog.topics[2]?.slice(-40)}` as `0x${string}`;
      const amount = BigInt(transferLog.data);

      const isValid =
        to.toLowerCase() === expectedRecipient.toLowerCase() &&
        amount >= expectedAmount;

      return {
        valid: isValid,
        network,
        token,
        amount,
        from,
        to,
        txHash,
        blockNumber: receipt.blockNumber,
        error: isValid
          ? undefined
          : `Payment mismatch: expected ${expectedAmount} to ${expectedRecipient}, got ${amount} to ${to}`,
      };
    } catch (error) {
      return {
        valid: false,
        network,
        token,
        amount: 0n,
        from: "0x0" as `0x${string}`,
        to: "0x0" as `0x${string}`,
        txHash,
        blockNumber: 0n,
        error: `Verification error: ${error}`,
      };
    }
  }

  /**
   * Get token balance for an address
   */
  async getBalance(
    network: string,
    token: string,
    address: `0x${string}`
  ): Promise<bigint> {
    const client = this.clients.get(network);
    if (!client) {
      throw new Error(`Unsupported network: ${network}`);
    }

    const chainConfig = SUPPORTED_CHAINS[network];
    const tokenAddress = chainConfig.tokens[token as keyof typeof chainConfig.tokens];

    if (!tokenAddress) {
      throw new Error(`Token ${token} not supported on ${network}`);
    }

    const balance = await client.readContract({
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: "balanceOf",
      args: [address],
    });

    return balance;
  }

  /**
   * Get token decimals
   */
  async getTokenDecimals(network: string, token: string): Promise<number> {
    const client = this.clients.get(network);
    if (!client) {
      throw new Error(`Unsupported network: ${network}`);
    }

    const chainConfig = SUPPORTED_CHAINS[network];
    const tokenAddress = chainConfig.tokens[token as keyof typeof chainConfig.tokens];

    if (!tokenAddress) {
      throw new Error(`Token ${token} not supported on ${network}`);
    }

    const decimals = await client.readContract({
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: "decimals",
    });

    return decimals;
  }

  /**
   * Get current block number for a network
   */
  async getBlockNumber(network: string): Promise<bigint> {
    const client = this.clients.get(network);
    if (!client) {
      throw new Error(`Unsupported network: ${network}`);
    }

    return client.getBlockNumber();
  }

  /**
   * Wait for a transaction to be confirmed
   */
  async waitForTransaction(
    network: string,
    txHash: `0x${string}`,
    confirmations = 1
  ): Promise<boolean> {
    const client = this.clients.get(network);
    if (!client) {
      throw new Error(`Unsupported network: ${network}`);
    }

    try {
      const receipt = await client.waitForTransactionReceipt({
        hash: txHash,
        confirmations,
      });
      return receipt.status === "success";
    } catch {
      return false;
    }
  }
}

/**
 * Get chain name from CAIP-2 identifier
 */
export function getChainName(network: string): string {
  const config = SUPPORTED_CHAINS[network];
  return config?.chain.name || "Unknown";
}

/**
 * Get chain ID from CAIP-2 identifier
 */
export function getChainId(network: string): number | undefined {
  const config = SUPPORTED_CHAINS[network];
  return config?.chain.id;
}

/**
 * Convert chain ID to CAIP-2 identifier
 */
export function toCaip2(chainId: number): string {
  return `eip155:${chainId}`;
}

/**
 * Parse CAIP-2 identifier to chain ID
 */
export function fromCaip2(caip2: string): number | undefined {
  const match = caip2.match(/^eip155:(\d+)$/);
  return match ? parseInt(match[1], 10) : undefined;
}
