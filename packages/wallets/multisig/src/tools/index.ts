/**
 * @author nirholas (Nich)
 * @website x.com/nichxbt
 * @github github.com/nirholas
 * @license MIT
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { z } from "zod"
import { Logger } from "../utils/logger.js"

const SAFE_API_BASE = "https://safe-transaction-mainnet.safe.global/api/v1"

const CHAIN_APIS: Record<string, string> = {
  "1": "https://safe-transaction-mainnet.safe.global/api/v1",
  "137": "https://safe-transaction-polygon.safe.global/api/v1",
  "42161": "https://safe-transaction-arbitrum.safe.global/api/v1",
  "10": "https://safe-transaction-optimism.safe.global/api/v1",
  "8453": "https://safe-transaction-base.safe.global/api/v1"
}

function getApiUrl(chainId: string = "1") {
  return CHAIN_APIS[chainId] || SAFE_API_BASE
}

export function registerSafeGnosisTools(server: McpServer) {
  // Tool 1: Get Safe info
  server.tool(
    "safe_get_info",
    "Get information about a Safe multi-sig wallet",
    {
      safeAddress: z.string().describe("Safe wallet address"),
      chainId: z.string().optional().describe("Chain ID (default: 1 for mainnet)")
    },
    async (params) => {
      try {
        const api = getApiUrl(params.chainId)
        const response = await fetch(`${api}/safes/${params.safeAddress}/`)
        
        if (!response.ok) {
          if (response.status === 404) {
            return {
              content: [{
                type: "text",
                text: JSON.stringify({
                  safeAddress: params.safeAddress,
                  found: false,
                  message: "Safe not found on this chain"
                }, null, 2)
              }]
            }
          }
          throw new Error(`HTTP ${response.status}`)
        }
        
        const safe = await response.json() as {
          address: string;
          nonce: number;
          threshold: number;
          owners: string[];
          modules: string[];
          fallbackHandler: string;
          version: string;
        }
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              address: safe.address,
              nonce: safe.nonce,
              threshold: safe.threshold,
              owners: safe.owners,
              modules: safe.modules,
              fallbackHandler: safe.fallbackHandler,
              version: safe.version
            }, null, 2)
          }]
        }
      } catch (error: any) {
        Logger.error("Error getting Safe info:", error)
        throw new Error(`Failed to get Safe info: ${error.message}`)
      }
    }
  )

  // Tool 2: Get pending transactions
  server.tool(
    "safe_get_pending_transactions",
    "Get pending transactions awaiting signatures",
    {
      safeAddress: z.string().describe("Safe wallet address"),
      chainId: z.string().optional().describe("Chain ID (default: 1)")
    },
    async (params) => {
      try {
        const api = getApiUrl(params.chainId)
        const response = await fetch(`${api}/safes/${params.safeAddress}/multisig-transactions/?executed=false`)
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        
        const data = await response.json() as { results?: any[] }
        
        const transactions = data.results?.map((tx: any) => ({
          safeTxHash: tx.safeTxHash,
          to: tx.to,
          value: tx.value,
          data: tx.data?.slice(0, 66) + (tx.data?.length > 66 ? "..." : ""),
          nonce: tx.nonce,
          confirmations: tx.confirmations?.length || 0,
          confirmationsRequired: tx.confirmationsRequired,
          submissionDate: tx.submissionDate
        })) || []
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              safeAddress: params.safeAddress,
              pendingCount: transactions.length,
              transactions
            }, null, 2)
          }]
        }
      } catch (error: any) {
        Logger.error("Error getting pending transactions:", error)
        throw new Error(`Failed to get pending transactions: ${error.message}`)
      }
    }
  )

  // Tool 3: Get transaction history
  server.tool(
    "safe_get_history",
    "Get executed transaction history for a Safe",
    {
      safeAddress: z.string().describe("Safe wallet address"),
      chainId: z.string().optional().describe("Chain ID (default: 1)"),
      limit: z.number().optional().describe("Number of transactions (default: 10)")
    },
    async (params) => {
      try {
        const api = getApiUrl(params.chainId)
        const limit = params.limit || 10
        const response = await fetch(`${api}/safes/${params.safeAddress}/multisig-transactions/?executed=true&limit=${limit}`)
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        
        const data = await response.json() as { results?: any[] }
        
        const transactions = data.results?.map((tx: any) => ({
          safeTxHash: tx.safeTxHash,
          txHash: tx.transactionHash,
          to: tx.to,
          value: tx.value,
          nonce: tx.nonce,
          executionDate: tx.executionDate,
          isSuccessful: tx.isSuccessful
        })) || []
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              safeAddress: params.safeAddress,
              count: transactions.length,
              transactions
            }, null, 2)
          }]
        }
      } catch (error: any) {
        Logger.error("Error getting history:", error)
        throw new Error(`Failed to get history: ${error.message}`)
      }
    }
  )

  // Tool 4: Get Safe balances
  server.tool(
    "safe_get_balances",
    "Get token balances for a Safe wallet",
    {
      safeAddress: z.string().describe("Safe wallet address"),
      chainId: z.string().optional().describe("Chain ID (default: 1)")
    },
    async (params) => {
      try {
        const api = getApiUrl(params.chainId)
        const response = await fetch(`${api}/safes/${params.safeAddress}/balances/usd/`)
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        
        const balances = await response.json() as any[]
        
        const formatted = balances.map((b: any) => ({
          token: b.token?.symbol || "ETH",
          name: b.token?.name || "Ether",
          balance: b.balance,
          balanceUsd: b.fiatBalance
        }))
        
        const totalUsd = formatted.reduce((sum: number, b: any) => sum + parseFloat(b.balanceUsd || 0), 0)
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              safeAddress: params.safeAddress,
              totalValueUsd: `$${totalUsd.toFixed(2)}`,
              tokens: formatted
            }, null, 2)
          }]
        }
      } catch (error: any) {
        Logger.error("Error getting balances:", error)
        throw new Error(`Failed to get balances: ${error.message}`)
      }
    }
  )

  Logger.info("✅ Registered Safe (Gnosis) tools")
}
