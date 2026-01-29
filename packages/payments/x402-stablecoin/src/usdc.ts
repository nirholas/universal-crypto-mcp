/**
 * USDC Client for x402 payments
 *
 * Provides USDC operations across multiple chains.
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
  type Chain,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { mainnet, polygon, arbitrum, optimism, base } from "viem/chains";
import type { PaymentChain } from "@universal-crypto-mcp/payments-shared";

/**
 * USDC addresses by chain
 */
export const USDC_ADDRESSES: Record<PaymentChain, `0x${string}`> = {
  ethereum: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  polygon: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
  arbitrum: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
  optimism: "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85",
  base: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  bsc: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
};

/**
 * Chain configurations
 */
const CHAIN_CONFIGS: Record<PaymentChain, Chain> = {
  ethereum: mainnet,
  polygon: polygon,
  arbitrum: arbitrum,
  optimism: optimism,
  base: base,
  bsc: {
    id: 56,
    name: "BNB Smart Chain",
    nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
    rpcUrls: { default: { http: ["https://bsc-dataseed.binance.org"] } },
  } as Chain,
};

/**
 * ERC20 ABI for USDC operations
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

/**
 * USDC client configuration
 */
export interface USDCClientConfig {
  privateKey?: `0x${string}`;
  chain: PaymentChain;
  rpcUrl?: string;
}

/**
 * USDC Client for x402 payments
 */
export class USDCClient {
  private publicClient: PublicClient;
  private walletClient?: WalletClient;
  private account?: Account;
  private chain: PaymentChain;
  private usdcAddress: `0x${string}`;

  constructor(config: USDCClientConfig) {
    this.chain = config.chain;
    const address = USDC_ADDRESSES[config.chain];
    if (!address) {
      throw new Error(`USDC not supported on chain: ${config.chain}`);
    }
    this.usdcAddress = address;

    const chainConfig = CHAIN_CONFIGS[config.chain];
    const transport = http(config.rpcUrl);

    this.publicClient = createPublicClient({
      chain: chainConfig,
      transport,
    });

    if (config.privateKey) {
      this.account = privateKeyToAccount(config.privateKey);
      this.walletClient = createWalletClient({
        chain: chainConfig,
        transport,
        account: this.account,
      });
    }
  }

  /**
   * Get USDC balance
   */
  async getBalance(address: `0x${string}`): Promise<string> {
    const balance = await this.publicClient.readContract({
      address: this.usdcAddress,
      abi: ERC20_ABI,
      functionName: "balanceOf",
      args: [address],
    });

    return formatUnits(balance as bigint, 6); // USDC has 6 decimals
  }

  /**
   * Transfer USDC
   */
  async transfer(
    to: `0x${string}`,
    amount: string
  ): Promise<`0x${string}`> {
    if (!this.walletClient || !this.account) {
      throw new Error("Wallet not initialized");
    }

    const amountWei = parseUnits(amount, 6);

    const hash = await this.walletClient.writeContract({
      address: this.usdcAddress,
      abi: ERC20_ABI,
      functionName: "transfer",
      args: [to, amountWei],
      account: this.account,
      chain: CHAIN_CONFIGS[this.chain],
    });

    return hash;
  }

  /**
   * Approve USDC spending
   */
  async approve(
    spender: `0x${string}`,
    amount: string
  ): Promise<`0x${string}`> {
    if (!this.walletClient || !this.account) {
      throw new Error("Wallet not initialized");
    }

    const amountWei = parseUnits(amount, 6);

    const hash = await this.walletClient.writeContract({
      address: this.usdcAddress,
      abi: ERC20_ABI,
      functionName: "approve",
      args: [spender, amountWei],
      account: this.account,
      chain: CHAIN_CONFIGS[this.chain],
    });

    return hash;
  }

  /**
   * Get allowance
   */
  async getAllowance(
    owner: `0x${string}`,
    spender: `0x${string}`
  ): Promise<string> {
    const allowance = await this.publicClient.readContract({
      address: this.usdcAddress,
      abi: ERC20_ABI,
      functionName: "allowance",
      args: [owner, spender],
    });

    return formatUnits(allowance as bigint, 6);
  }

  /**
   * Get chain
   */
  getChain(): PaymentChain {
    return this.chain;
  }

  /**
   * Get USDC contract address
   */
  getAddress(): `0x${string}` {
    return this.usdcAddress;
  }
}
