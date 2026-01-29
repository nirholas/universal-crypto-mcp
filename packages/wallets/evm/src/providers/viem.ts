/**
 * @universal-crypto-mcp/wallet-evm
 * 
 * Viem provider adapter
 * 
 * @author nich
 * @license Apache-2.0
 */

import {
  createPublicClient,
  createWalletClient,
  http,
  type Chain,
  type PublicClient,
  type WalletClient,
  type Account,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { getChain, getDefaultRpcUrl } from "@nirholas/crypto-mcp-core";

/**
 * Provider configuration
 */
export interface ViemProviderConfig {
  chainId: string;
  rpcUrl?: string;
  privateKey?: `0x${string}`;
}

/**
 * Viem provider wrapper
 */
export class ViemProvider {
  readonly chain: Chain;
  readonly chainId: string;
  readonly publicClient: PublicClient;
  readonly walletClient?: WalletClient;
  readonly account?: Account;

  constructor(config: ViemProviderConfig) {
    this.chainId = config.chainId;
    this.chain = getChain(config.chainId);

    if (!this.chain) {
      throw new Error(`Unsupported chain: ${config.chainId}`);
    }

    const rpcUrl = config.rpcUrl ?? getDefaultRpcUrl(config.chainId);
    const transport = http(rpcUrl);

    this.publicClient = createPublicClient({
      chain: this.chain,
      transport,
    });

    if (config.privateKey) {
      this.account = privateKeyToAccount(config.privateKey);
      this.walletClient = createWalletClient({
        account: this.account,
        chain: this.chain,
        transport,
      });
    }
  }

  /**
   * Check if the provider has a wallet
   */
  hasWallet(): boolean {
    return !!this.walletClient;
  }

  /**
   * Get the wallet address
   */
  getAddress(): string | undefined {
    return this.account?.address;
  }

  /**
   * Get the current block number
   */
  async getBlockNumber(): Promise<bigint> {
    return this.publicClient.getBlockNumber();
  }

  /**
   * Get the chain's native currency symbol
   */
  getNativeCurrency(): { name: string; symbol: string; decimals: number } {
    return this.chain.nativeCurrency;
  }
}

/**
 * Create a read-only provider
 */
export function createReadOnlyProvider(
  chainId: string,
  rpcUrl?: string
): ViemProvider {
  return new ViemProvider({ chainId, rpcUrl });
}

/**
 * Create a provider with signing capabilities
 */
export function createSigningProvider(
  chainId: string,
  privateKey: `0x${string}`,
  rpcUrl?: string
): ViemProvider {
  return new ViemProvider({ chainId, rpcUrl, privateKey });
}
