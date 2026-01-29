/**
 * EVM Transaction Builder
 * Build and manage EVM transactions using viem
 */

import {
  type PublicClient,
  type WalletClient,
  type TransactionRequest,
  type Hash,
  encodeFunctionData,
  type Abi,
} from 'viem';

export interface EVMTransactionOptions {
  from: `0x${string}`;
  to: `0x${string}`;
  value?: bigint;
  data?: `0x${string}`;
  gasLimit?: bigint;
  maxFeePerGas?: bigint;
  maxPriorityFeePerGas?: bigint;
  nonce?: number;
}

export class EVMTransactionBuilder {
  private publicClient: PublicClient;
  private walletClient?: WalletClient;

  constructor(publicClient: PublicClient, walletClient?: WalletClient) {
    this.publicClient = publicClient;
    this.walletClient = walletClient;
  }

  async estimateGas(options: EVMTransactionOptions): Promise<bigint> {
    return this.publicClient.estimateGas({
      account: options.from,
      to: options.to,
      value: options.value,
      data: options.data,
    });
  }

  async buildContractCall(
    contractAddress: `0x${string}`,
    abi: Abi,
    functionName: string,
    args: unknown[],
    options: Partial<EVMTransactionOptions>
  ): Promise<TransactionRequest> {
    const data = encodeFunctionData({
      abi,
      functionName,
      args,
    });

    const gasEstimate = await this.publicClient.estimateGas({
      account: options.from,
      to: contractAddress,
      data,
      value: options.value,
    });

    const gasPrice = await this.publicClient.getGasPrice();

    return {
      to: contractAddress,
      data,
      value: options.value ?? 0n,
      gas: gasEstimate,
      gasPrice,
    };
  }

  async sendTransaction(options: EVMTransactionOptions): Promise<Hash> {
    if (!this.walletClient) {
      throw new Error('Wallet client not configured');
    }

    const hash = await this.walletClient.sendTransaction({
      account: options.from,
      to: options.to,
      value: options.value ?? 0n,
      data: options.data,
      gas: options.gasLimit,
      maxFeePerGas: options.maxFeePerGas,
      maxPriorityFeePerGas: options.maxPriorityFeePerGas,
      nonce: options.nonce,
      chain: null,
    });

    return hash;
  }

  async waitForReceipt(hash: Hash): Promise<{
    status: 'success' | 'reverted';
    blockNumber: bigint;
    gasUsed: bigint;
  }> {
    const receipt = await this.publicClient.waitForTransactionReceipt({ hash });
    return {
      status: receipt.status,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed,
    };
  }
}
