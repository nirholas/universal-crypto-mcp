/**
 * @universal-crypto-mcp/wallet-evm
 * 
 * EVM Wallet implementation using viem
 * 
 * @author nich
 * @license Apache-2.0
 */

import {
  createWalletClient,
  createPublicClient,
  http,
  formatEther,
  parseEther,
  formatUnits,
  parseUnits,
  type WalletClient,
  type PublicClient,
  type Chain,
  type Account,
  type TransactionReceipt,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import type {
  WalletProvider,
  Balance,
  TransactionResult,
  TransactionRequest,
  TypedData,
} from "@universal-crypto-mcp/wallets-shared";
import { getChain, getDefaultRpcUrl } from "@nirholas/crypto-mcp-core";
import type { EVMWalletConfig, ERC20Token, TransactionOptions, GasEstimate } from "./types.js";

// ERC20 ABI for balance and transfer
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
  {
    inputs: [],
    name: "name",
    outputs: [{ name: "", type: "string" }],
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
] as const;

/**
 * EVM Wallet implementation
 */
export class EVMWallet implements WalletProvider {
  readonly chain: string;
  readonly address: string;

  private walletClient: WalletClient;
  private publicClient: PublicClient;
  private viemChain: Chain;
  private account: Account;

  constructor(config: EVMWalletConfig) {
    this.chain = config.chainId;
    this.viemChain = config.chain ?? getChain(config.chainId);

    if (!this.viemChain) {
      throw new Error(`Unsupported chain: ${config.chainId}`);
    }

    this.account = privateKeyToAccount(config.privateKey);
    this.address = this.account.address;

    const rpcUrl = config.rpcUrl ?? getDefaultRpcUrl(config.chainId);
    const transport = http(rpcUrl);

    this.walletClient = createWalletClient({
      account: this.account,
      chain: this.viemChain,
      transport,
    });

    this.publicClient = createPublicClient({
      chain: this.viemChain,
      transport,
    });
  }

  // ==========================================================================
  // Balance Operations
  // ==========================================================================

  async getBalance(): Promise<Balance> {
    const balance = await this.publicClient.getBalance({
      address: this.address as `0x${string}`,
    });

    return {
      raw: balance.toString(),
      formatted: formatEther(balance),
      decimals: 18,
      symbol: this.viemChain.nativeCurrency.symbol,
    };
  }

  async getBalanceOf(address: string): Promise<Balance> {
    const balance = await this.publicClient.getBalance({
      address: address as `0x${string}`,
    });

    return {
      raw: balance.toString(),
      formatted: formatEther(balance),
      decimals: 18,
      symbol: this.viemChain.nativeCurrency.symbol,
    };
  }

  async getTokenBalance(tokenAddress: string): Promise<Balance> {
    const token = await this.getTokenInfo(tokenAddress);

    const balance = await this.publicClient.readContract({
      address: tokenAddress as `0x${string}`,
      abi: ERC20_ABI,
      functionName: "balanceOf",
      args: [this.address as `0x${string}`],
    });

    return {
      raw: balance.toString(),
      formatted: formatUnits(balance, token.decimals),
      decimals: token.decimals,
      symbol: token.symbol,
    };
  }

  async getTokenInfo(tokenAddress: string): Promise<ERC20Token> {
    const [symbol, name, decimals] = await Promise.all([
      this.publicClient.readContract({
        address: tokenAddress as `0x${string}`,
        abi: ERC20_ABI,
        functionName: "symbol",
      }),
      this.publicClient.readContract({
        address: tokenAddress as `0x${string}`,
        abi: ERC20_ABI,
        functionName: "name",
      }),
      this.publicClient.readContract({
        address: tokenAddress as `0x${string}`,
        abi: ERC20_ABI,
        functionName: "decimals",
      }),
    ]);

    return {
      address: tokenAddress as `0x${string}`,
      symbol,
      name,
      decimals,
    };
  }

  // ==========================================================================
  // Transfer Operations
  // ==========================================================================

  async transfer(
    to: string,
    amount: string,
    options?: TransactionOptions
  ): Promise<TransactionResult> {
    const hash = await this.walletClient.sendTransaction({
      to: to as `0x${string}`,
      value: parseEther(amount),
      ...this.buildTxOptions(options),
    });

    return {
      hash,
      status: "pending",
    };
  }

  async transferToken(
    tokenAddress: string,
    to: string,
    amount: string,
    options?: TransactionOptions
  ): Promise<TransactionResult> {
    const token = await this.getTokenInfo(tokenAddress);
    const rawAmount = parseUnits(amount, token.decimals);

    const hash = await this.walletClient.writeContract({
      address: tokenAddress as `0x${string}`,
      abi: ERC20_ABI,
      functionName: "transfer",
      args: [to as `0x${string}`, rawAmount],
      ...this.buildTxOptions(options),
    });

    return {
      hash,
      status: "pending",
    };
  }

  // ==========================================================================
  // Signing Operations
  // ==========================================================================

  async signMessage(message: string): Promise<string> {
    return this.walletClient.signMessage({
      message,
    });
  }

  async signTypedData(data: TypedData): Promise<string> {
    return this.walletClient.signTypedData({
      domain: data.domain as any,
      types: data.types as any,
      primaryType: data.primaryType,
      message: data.message as any,
    });
  }

  // ==========================================================================
  // Transaction Operations
  // ==========================================================================

  async sendTransaction(
    tx: TransactionRequest,
    options?: TransactionOptions
  ): Promise<TransactionResult> {
    const hash = await this.walletClient.sendTransaction({
      to: tx.to as `0x${string}`,
      value: tx.value ? BigInt(tx.value) : undefined,
      data: tx.data as `0x${string}` | undefined,
      ...this.buildTxOptions(options),
    });

    return {
      hash,
      status: "pending",
    };
  }

  async waitForTransaction(hash: string): Promise<TransactionResult> {
    const receipt = await this.publicClient.waitForTransactionReceipt({
      hash: hash as `0x${string}`,
    });

    return this.formatReceipt(receipt);
  }

  async getTransactionReceipt(hash: string): Promise<TransactionResult | null> {
    try {
      const receipt = await this.publicClient.getTransactionReceipt({
        hash: hash as `0x${string}`,
      });
      return this.formatReceipt(receipt);
    } catch {
      return null;
    }
  }

  // ==========================================================================
  // Gas Estimation
  // ==========================================================================

  async estimateGas(tx: TransactionRequest): Promise<GasEstimate> {
    const [gasLimit, feeData] = await Promise.all([
      this.publicClient.estimateGas({
        to: tx.to as `0x${string}`,
        value: tx.value ? BigInt(tx.value) : undefined,
        data: tx.data as `0x${string}` | undefined,
        account: this.account,
      }),
      this.publicClient.estimateFeesPerGas(),
    ]);

    const maxFeePerGas = feeData.maxFeePerGas ?? 0n;
    const estimatedCost = gasLimit * maxFeePerGas;

    return {
      gasLimit: gasLimit.toString(),
      gasPrice: maxFeePerGas.toString(),
      maxFeePerGas: feeData.maxFeePerGas?.toString(),
      maxPriorityFeePerGas: feeData.maxPriorityFeePerGas?.toString(),
      estimatedCost: estimatedCost.toString(),
      estimatedCostFormatted: formatEther(estimatedCost),
    };
  }

  // ==========================================================================
  // Utility Methods
  // ==========================================================================

  /**
   * Get the current nonce for the wallet
   */
  async getNonce(): Promise<number> {
    return this.publicClient.getTransactionCount({
      address: this.address as `0x${string}`,
    });
  }

  /**
   * Get the chain ID
   */
  getChainId(): number {
    return this.viemChain.id;
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
  getWalletClient(): WalletClient {
    return this.walletClient;
  }

  // ==========================================================================
  // Private Helpers
  // ==========================================================================

  private buildTxOptions(options?: TransactionOptions): Record<string, unknown> {
    if (!options) return {};

    return {
      gas: options.gasLimit,
      maxFeePerGas: options.maxFeePerGas,
      maxPriorityFeePerGas: options.maxPriorityFeePerGas,
      gasPrice: options.gasPrice,
      nonce: options.nonce,
    };
  }

  private formatReceipt(receipt: TransactionReceipt): TransactionResult {
    return {
      hash: receipt.transactionHash,
      status: receipt.status === "success" ? "confirmed" : "failed",
      blockNumber: Number(receipt.blockNumber),
      gasUsed: receipt.gasUsed.toString(),
    };
  }
}

/**
 * Create an EVM wallet from a private key
 */
export function createEVMWallet(
  privateKey: `0x${string}`,
  chainId: string,
  rpcUrl?: string
): EVMWallet {
  return new EVMWallet({
    privateKey,
    chainId,
    rpcUrl,
  });
}
