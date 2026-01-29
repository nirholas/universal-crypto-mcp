/**
 * @author nirholas (Nich)
 * @website x.com/nichxbt
 * @github github.com/nirholas
 * @license MIT
 */

import { ethers } from "ethers"
import { FlashbotsBundleProvider, FlashbotsBundleResolution } from "@flashbots/ethers-provider-bundle"
import { Logger } from "../utils/logger.js"

export class FlashbotsService {
  private network: string
  private provider: ethers.Provider
  private flashbotsProvider: FlashbotsBundleProvider | null = null

  constructor(network: string) {
    this.network = network
    this.provider = new ethers.JsonRpcProvider(
      network === "ethereum" 
        ? (process.env.ETH_RPC_URL || "https://eth.llamarpc.com")
        : "https://goerli.infura.io/v3/your-key"
    )
  }

  async sendPrivateTransaction(params: {
    to: string
    value: bigint
    data: string
    maxFeePerGas?: bigint
    maxPriorityFeePerGas?: bigint
    privateKey: string
  }): Promise<{
    bundleHash: string
    waitForInclusion: boolean
    estimatedBlock: number
  }> {
    try {
      // Initialize Flashbots provider
      const authSigner = new ethers.Wallet(params.privateKey, this.provider)
      
      // Get Flashbots RPC endpoint
      const flashbotsRpc = this.network === "ethereum"
        ? "https://relay.flashbots.net"
        : "https://relay-goerli.flashbots.net"

      this.flashbotsProvider = await FlashbotsBundleProvider.create(
        this.provider,
        authSigner,
        flashbotsRpc
      )

      Logger.info("Connected to Flashbots relay")

      // Get current block number
      const blockNumber = await this.provider.getBlockNumber()

      // Prepare transaction
      const transaction = {
        to: params.to,
        value: params.value,
        data: params.data,
        maxFeePerGas: params.maxFeePerGas || ethers.parseUnits("30", "gwei"),
        maxPriorityFeePerGas: params.maxPriorityFeePerGas || ethers.parseUnits("2", "gwei"),
        chainId: this.network === "ethereum" ? 1 : 5,
        type: 2
      }

      // Sign transaction
      const signedTransaction = await authSigner.signTransaction(transaction)

      // Create bundle
      const targetBlock = blockNumber + 1

      const bundleSubmission = await this.flashbotsProvider.sendBundle(
        [
          {
            signedTransaction
          }
        ],
        targetBlock
      )

      Logger.info("Bundle submitted to Flashbots")

      // Wait for bundle inclusion
      if ("wait" in bundleSubmission) {
        const waitResponse = await bundleSubmission.wait()
        
        if (waitResponse === FlashbotsBundleResolution.BundleIncluded) {
          Logger.info("Bundle included in block!")
        } else if (waitResponse === FlashbotsBundleResolution.BlockPassedWithoutInclusion) {
          Logger.warn("Bundle not included, trying next block")
        } else if (waitResponse === FlashbotsBundleResolution.AccountNonceTooHigh) {
          throw new Error("Nonce too high")
        }
      }

      return {
        bundleHash: bundleSubmission.bundleHash || "pending",
        waitForInclusion: true,
        estimatedBlock: targetBlock
      }

    } catch (error: any) {
      Logger.error("Error sending Flashbots bundle:", error)
      
      // Fallback: send as regular private transaction via Flashbots Protect RPC
      return this.sendViaFlashbotsProtect(params)
    }
  }

  private async sendViaFlashbotsProtect(params: {
    to: string
    value: bigint
    data: string
    privateKey: string
  }): Promise<{
    bundleHash: string
    waitForInclusion: boolean
    estimatedBlock: number
  }> {
    // Use Flashbots Protect RPC (simpler alternative)
    const protectRpc = "https://rpc.flashbots.net"
    const protectProvider = new ethers.JsonRpcProvider(protectRpc)
    
    const wallet = new ethers.Wallet(params.privateKey, protectProvider)
    
    const tx = await wallet.sendTransaction({
      to: params.to,
      value: params.value,
      data: params.data,
      maxFeePerGas: ethers.parseUnits("30", "gwei"),
      maxPriorityFeePerGas: ethers.parseUnits("2", "gwei")
    })

    Logger.info("Transaction sent via Flashbots Protect RPC")

    const receipt = await tx.wait()
    const blockNumber = await protectProvider.getBlockNumber()

    return {
      bundleHash: tx.hash,
      waitForInclusion: false,
      estimatedBlock: receipt?.blockNumber || blockNumber
    }
  }

  async simulateBundle(transactions: string[], targetBlock: number): Promise<any> {
    if (!this.flashbotsProvider) {
      throw new Error("Flashbots provider not initialized")
    }

    const simulation = await this.flashbotsProvider.simulate(
      transactions.map(tx => ({ signedTransaction: tx })),
      targetBlock
    )

    return {
      success: simulation.results.length > 0,
      results: simulation.results,
      coinbaseDiff: simulation.coinbaseDiff,
      gasFees: simulation.totalGasUsed,
      firstRevert: simulation.firstRevert
    }
  }
}
