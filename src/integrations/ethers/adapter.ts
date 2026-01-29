/**
 * Ethers.js MCP Adapter
 * 
 * Integrates ethers.js into Universal Crypto MCP
 * 
 * Original Project: ethers.js (https://github.com/ethers-io/ethers.js)
 * Original Author: Richard Moore
 * License: MIT (see vendor/ethers-integration/LICENSE)
 * 
 * This adapter provides MCP compatibility for ethers.js while maintaining
 * proper attribution to the original author.
 * 
 * @author Nicholas (github.com/nirholas) - MCP integration layer only
 * @original-author Richard Moore - ethers.js core functionality
 */

import { ethers } from 'ethers'

export interface EthersAdapterConfig {
  rpcUrl: string
  chainId: number
  privateKey?: string
}

/**
 * MCP Adapter for ethers.js
 * 
 * This class wraps ethers.js functionality for use in the MCP protocol.
 * All blockchain interaction functionality is provided by ethers.js.
 */
export class EthersAdapter {
  private provider: ethers.Provider
  private wallet?: ethers.Wallet

  constructor(config: EthersAdapterConfig) {
    // Initialize ethers.js provider
    this.provider = new ethers.JsonRpcProvider(config.rpcUrl)
    
    if (config.privateKey) {
      this.wallet = new ethers.Wallet(config.privateKey, this.provider)
    }
  }

  /**
   * Get balance for an address
   * Uses ethers.js provider.getBalance()
   */
  async getBalance(address: string): Promise<string> {
    const balance = await this.provider.getBalance(address)
    return ethers.formatEther(balance)
  }

  /**
   * Send transaction
   * Uses ethers.js wallet functionality
   */
  async sendTransaction(to: string, amount: string): Promise<string> {
    if (!this.wallet) {
      throw new Error('Wallet not initialized')
    }

    const tx = await this.wallet.sendTransaction({
      to,
      value: ethers.parseEther(amount)
    })

    return tx.hash
  }

  /**
   * Get transaction receipt
   * Uses ethers.js provider.getTransactionReceipt()
   */
  async getTransactionReceipt(txHash: string) {
    return await this.provider.getTransactionReceipt(txHash)
  }

  /**
   * Call contract method (read-only)
   * Uses ethers.js Contract functionality
   */
  async callContract(
    contractAddress: string,
    abi: any[],
    method: string,
    params: any[]
  ): Promise<any> {
    const contract = new ethers.Contract(contractAddress, abi, this.provider)
    return await contract[method](...params)
  }

  /**
   * Get provider instance
   * Returns the underlying ethers.js provider
   */
  getProvider(): ethers.Provider {
    return this.provider
  }

  /**
   * Get wallet instance
   * Returns the underlying ethers.js wallet
   */
  getWallet(): ethers.Wallet | undefined {
    return this.wallet
  }
}

/**
 * Export ethers.js types for convenience
 * All types are from ethers.js
 */
export type { Provider, Wallet, Contract, TransactionReceipt } from 'ethers'

/**
 * Re-export ethers utilities
 * All utilities are from ethers.js
 */
export { ethers }
