/**
 * @author nirholas (Nich)
 * @website x.com/nichxbt
 * @github github.com/nirholas
 * @license MIT
 */

import { ethers } from "ethers"
import WebSocket from "ws"
import { Logger } from "../utils/logger.js"

export class MempoolMonitor {
  private network: string
  private wsProvider: ethers.WebSocketProvider | null = null
  private threats: any[] = []
  private totalScanned: number = 0
  private patterns: any[] = []

  constructor(network: string) {
    this.network = network
  }

  async monitorForDuration(
    durationSeconds: number,
    targetAddress?: string,
    minValue?: bigint
  ): Promise<{ threats: any[]; totalScanned: number; patterns: any[] }> {
    this.threats = []
    this.totalScanned = 0
    this.patterns = []

    try {
      // Connect to WebSocket RPC for real-time mempool monitoring
      const wsUrl = this.getWebSocketUrl()
      this.wsProvider = new ethers.WebSocketProvider(wsUrl)

      Logger.info(`Connected to ${this.network} mempool via WebSocket`)

      // Subscribe to pending transactions
      const pendingTxs: Map<string, any> = new Map()
      
      const filter = await this.wsProvider._subscribe(
        ["newPendingTransactions"],
        ["pending"]
      )

      // Monitor for the specified duration
      const endTime = Date.now() + (durationSeconds * 1000)

      const checkTransaction = async (txHash: string) => {
        try {
          const tx = await this.wsProvider!.getTransaction(txHash)
          if (!tx) return

          this.totalScanned++

          // Filter by target address if specified
          if (targetAddress && tx.from.toLowerCase() !== targetAddress.toLowerCase() && 
              tx.to?.toLowerCase() !== targetAddress.toLowerCase()) {
            return
          }

          // Filter by minimum value if specified
          if (minValue && tx.value < minValue) {
            return
          }

          // Store transaction for pattern analysis
          pendingTxs.set(txHash, {
            hash: txHash,
            from: tx.from,
            to: tx.to,
            value: tx.value,
            gasPrice: tx.gasPrice,
            data: tx.data,
            timestamp: Date.now()
          })

          // Detect sandwich attack patterns
          this.detectSandwichPattern(pendingTxs, txHash)

          // Detect frontrunning patterns
          this.detectFrontrunPattern(pendingTxs, txHash)

        } catch (error) {
          // Transaction might have been mined already
        }
      }

      // Set up listener
      this.wsProvider.on("pending", checkTransaction)

      // Wait for monitoring duration
      await new Promise(resolve => setTimeout(resolve, durationSeconds * 1000))

      // Clean up
      await this.wsProvider.removeAllListeners("pending")
      await this.wsProvider.destroy()

      return {
        threats: this.threats,
        totalScanned: this.totalScanned,
        patterns: this.patterns
      }

    } catch (error: any) {
      Logger.error("Error monitoring mempool:", error)
      throw error
    }
  }

  private detectSandwichPattern(pendingTxs: Map<string, any>, txHash: string) {
    const tx = pendingTxs.get(txHash)
    if (!tx || !tx.to) return

    // Look for transactions to the same contract (likely a DEX router)
    const relatedTxs = Array.from(pendingTxs.values()).filter(
      t => t.to && t.to.toLowerCase() === tx.to.toLowerCase() && t.hash !== txHash
    )

    // Check if there are transactions from the same address with different gas prices
    // This is a classic sandwich attack pattern
    const sameFromAddress = relatedTxs.filter(t => t.from.toLowerCase() === tx.from.toLowerCase())
    
    if (sameFromAddress.length >= 2) {
      const gasPrices = sameFromAddress.map(t => t.gasPrice).sort((a, b) => Number(a - b))
      
      // If gas prices vary significantly, it's suspicious
      if (gasPrices[gasPrices.length - 1] > gasPrices[0] * 2n) {
        this.threats.push({
          type: "potential_sandwich",
          targetTx: txHash,
          suspiciousAddress: tx.from,
          details: "Multiple transactions to same contract with varying gas prices detected"
        })
        
        this.patterns.push({
          pattern: "sandwich_setup",
          confidence: "medium",
          transactions: sameFromAddress.length
        })
      }
    }
  }

  private detectFrontrunPattern(pendingTxs: Map<string, any>, txHash: string) {
    const tx = pendingTxs.get(txHash)
    if (!tx) return

    // Look for transactions with similar data but higher gas price
    const similarTxs = Array.from(pendingTxs.values()).filter(t => {
      return t.to === tx.to && 
             t.data.slice(0, 10) === tx.data.slice(0, 10) && // Same function selector
             t.gasPrice && tx.gasPrice && t.gasPrice > tx.gasPrice &&
             t.hash !== txHash
    })

    if (similarTxs.length > 0) {
      this.threats.push({
        type: "potential_frontrun",
        targetTx: txHash,
        frontrunTxs: similarTxs.map(t => t.hash),
        details: "Similar transaction with higher gas price detected"
      })
      
      this.patterns.push({
        pattern: "frontrun_attempt",
        confidence: "high",
        gasPriceDiff: Number(similarTxs[0].gasPrice - tx.gasPrice) / 1e9
      })
    }
  }

  private getWebSocketUrl(): string {
    const wsUrls: Record<string, string> = {
      ethereum: process.env.ETH_WS_URL || "wss://eth-mainnet.g.alchemy.com/v2/demo",
      arbitrum: process.env.ARB_WS_URL || "wss://arb-mainnet.g.alchemy.com/v2/demo",
      optimism: process.env.OP_WS_URL || "wss://opt-mainnet.g.alchemy.com/v2/demo",
      base: process.env.BASE_WS_URL || "wss://base-mainnet.g.alchemy.com/v2/demo"
    }
    
    return wsUrls[this.network] || wsUrls.ethereum
  }
}
