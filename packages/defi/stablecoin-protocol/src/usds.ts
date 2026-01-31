/**
 * USDs Stablecoin Client
 *
 * Provides interactions with Sperax USDs on Arbitrum.
 */

import {
  createPublicClient,
  createWalletClient,
  http,
  formatUnits,
  parseUnits,
  type PublicClient,
  type WalletClient,
  type Account,
} from "viem";
import { arbitrum } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";

/**
 * USDs contract address on Arbitrum
 */
export const USDS_ADDRESS =
  "0xD74f5255D557944cf7Dd0E45FF521520002D5748" as const;

/**
 * Collateral vault address
 */
export const VAULT_ADDRESS =
  "0x6Bbc476Ee35CBA9e9c3A59fc5b10d7a0BC6f74Ca" as const;

/**
 * USDs ABI for read operations
 */
const USDS_ABI = [
  {
    inputs: [{ name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
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
    inputs: [],
    name: "rebasingCreditsPerToken",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "account", type: "address" }],
    name: "creditsBalanceOf",
    outputs: [
      { name: "", type: "uint256" },
      { name: "", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
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
] as const;

/**
 * USDs Client Configuration
 */
export interface USDsClientConfig {
  privateKey?: `0x${string}`;
  rpcUrl?: string;
}

/**
 * Client for interacting with Sperax USDs stablecoin
 */
export class USDsClient {
  private publicClient: PublicClient;
  private walletClient?: WalletClient;
  private account?: Account;

  constructor(config: USDsClientConfig = {}) {
    const transport = http(config.rpcUrl);

    this.publicClient = createPublicClient({
      chain: arbitrum,
      transport,
    });

    if (config.privateKey) {
      this.account = privateKeyToAccount(config.privateKey);
      this.walletClient = createWalletClient({
        chain: arbitrum,
        transport,
        account: this.account,
      });
    }
  }

  /**
   * Get USDs balance for an address
   */
  async getBalance(address: `0x${string}`): Promise<string> {
    const balance = await this.publicClient.readContract({
      address: USDS_ADDRESS,
      abi: USDS_ABI,
      functionName: "balanceOf",
      args: [address],
    });

    return formatUnits(balance as bigint, 18);
  }

  /**
   * Get total USDs supply
   */
  async getTotalSupply(): Promise<string> {
    const supply = await this.publicClient.readContract({
      address: USDS_ADDRESS,
      abi: USDS_ABI,
      functionName: "totalSupply",
    });

    return formatUnits(supply as bigint, 18);
  }

  /**
   * Get rebasing credits per token (used for yield calculation)
   */
  async getRebasingCreditsPerToken(): Promise<bigint> {
    const credits = await this.publicClient.readContract({
      address: USDS_ADDRESS,
      abi: USDS_ABI,
      functionName: "rebasingCreditsPerToken",
    });

    return credits as bigint;
  }

  /**
   * Get credits balance for yield tracking
   */
  async getCreditsBalance(
    address: `0x${string}`
  ): Promise<{ credits: bigint; creditsPerToken: bigint }> {
    const [credits, creditsPerToken] = (await this.publicClient.readContract({
      address: USDS_ADDRESS,
      abi: USDS_ABI,
      functionName: "creditsBalanceOf",
      args: [address],
    })) as [bigint, bigint];

    return { credits, creditsPerToken };
  }

  /**
   * Transfer USDs to another address
   */
  async transfer(
    to: `0x${string}`,
    amount: string
  ): Promise<`0x${string}`> {
    if (!this.walletClient || !this.account) {
      throw new Error("Wallet not initialized. Provide privateKey in config.");
    }

    const amountWei = parseUnits(amount, 18);

    const hash = await this.walletClient.writeContract({
      address: USDS_ADDRESS,
      abi: USDS_ABI,
      functionName: "transfer",
      args: [to, amountWei],
      account: this.account,
      chain: arbitrum,
    });

    return hash;
  }

  /**
   * Approve USDs spending
   */
  async approve(
    spender: `0x${string}`,
    amount: string
  ): Promise<`0x${string}`> {
    if (!this.walletClient || !this.account) {
      throw new Error("Wallet not initialized. Provide privateKey in config.");
    }

    const amountWei = parseUnits(amount, 18);

    const hash = await this.walletClient.writeContract({
      address: USDS_ADDRESS,
      abi: USDS_ABI,
      functionName: "approve",
      args: [spender, amountWei],
      account: this.account,
      chain: arbitrum,
    });

    return hash;
  }

  /**
   * Get the public client for advanced operations
   */
  getPublicClient(): PublicClient {
    return this.publicClient;
  }

  /**
   * Get the wallet client for advanced operations
   */
  getWalletClient(): WalletClient | undefined {
    return this.walletClient;
  }
}
