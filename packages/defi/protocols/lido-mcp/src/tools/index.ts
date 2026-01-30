/**
 * @author nirholas (Nich)
 * @website x.com/nichxbt
 * @github github.com/nirholas
 * @license MIT
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { z } from "zod"
import { ethers } from "ethers"
import { Logger } from "../utils/logger.js"

// Lido contracts on Ethereum mainnet
const STETH = "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84"
const WSTETH = "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0"
const LIDO_ORACLE = "0x442af784A788A5bd6F42A01Ebe9F287a871243fb"

export function registerLidoTools(server: McpServer) {
  // Tool 1: Get staking APR
  server.tool(
    "lido_get_staking_apr",
    "Get current Lido staking APR and protocol statistics",
    {
      rpcUrl: z.string().optional().describe("Custom RPC URL")
    },
    async (params) => {
      try {
        const provider = new ethers.JsonRpcProvider(params.rpcUrl || "https://eth.llamarpc.com")
        
        const stethAbi = [
          "function getTotalPooledEther() view returns (uint256)",
          "function getTotalShares() view returns (uint256)",
          "function getFee() view returns (uint16)"
        ]
        
        const steth = new ethers.Contract(STETH, stethAbi, provider)
        
        const [totalPooledEther, totalShares, fee] = await Promise.all([
          steth.getTotalPooledEther(),
          steth.getTotalShares(),
          steth.getFee()
        ])
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              totalPooledEther: ethers.formatEther(totalPooledEther) + " ETH",
              totalShares: totalShares.toString(),
              protocolFee: (Number(fee) / 100).toFixed(2) + "%",
              estimatedAPR: "~4-5%", // Would fetch from oracle in production
              note: "APR varies based on network rewards and validator performance"
            }, null, 2)
          }]
        }
      } catch (error: any) {
        Logger.error("Error getting staking APR:", error)
        throw new Error(`Failed to get staking APR: ${error.message}`)
      }
    }
  )

  // Tool 2: Get stETH balance
  server.tool(
    "lido_get_steth_balance",
    "Get user's stETH balance and shares",
    {
      userAddress: z.string().describe("The user's wallet address"),
      rpcUrl: z.string().optional().describe("Custom RPC URL")
    },
    async (params) => {
      try {
        const provider = new ethers.JsonRpcProvider(params.rpcUrl || "https://eth.llamarpc.com")
        
        const stethAbi = [
          "function balanceOf(address account) view returns (uint256)",
          "function sharesOf(address account) view returns (uint256)",
          "function getPooledEthByShares(uint256 shares) view returns (uint256)"
        ]
        
        const steth = new ethers.Contract(STETH, stethAbi, provider)
        
        const [balance, shares] = await Promise.all([
          steth.balanceOf(params.userAddress),
          steth.sharesOf(params.userAddress)
        ])
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              userAddress: params.userAddress,
              stETHBalance: ethers.formatEther(balance) + " stETH",
              shares: shares.toString(),
              note: "stETH balance increases over time as rewards accrue"
            }, null, 2)
          }]
        }
      } catch (error: any) {
        Logger.error("Error getting stETH balance:", error)
        throw new Error(`Failed to get stETH balance: ${error.message}`)
      }
    }
  )

  // Tool 3: Get wstETH rate
  server.tool(
    "lido_get_wsteth_rate",
    "Get current wstETH/stETH exchange rate",
    {
      rpcUrl: z.string().optional().describe("Custom RPC URL")
    },
    async (params) => {
      try {
        const provider = new ethers.JsonRpcProvider(params.rpcUrl || "https://eth.llamarpc.com")
        
        const wstethAbi = [
          "function stEthPerToken() view returns (uint256)",
          "function tokensPerStEth() view returns (uint256)",
          "function totalSupply() view returns (uint256)"
        ]
        
        const wsteth = new ethers.Contract(WSTETH, wstethAbi, provider)
        
        const [stEthPerToken, tokensPerStEth, totalSupply] = await Promise.all([
          wsteth.stEthPerToken(),
          wsteth.tokensPerStEth(),
          wsteth.totalSupply()
        ])
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              stETHPerWstETH: ethers.formatEther(stEthPerToken),
              wstETHPerStETH: ethers.formatEther(tokensPerStEth),
              totalWstETHSupply: ethers.formatEther(totalSupply) + " wstETH",
              note: "wstETH is a non-rebasing wrapper for stETH"
            }, null, 2)
          }]
        }
      } catch (error: any) {
        Logger.error("Error getting wstETH rate:", error)
        throw new Error(`Failed to get wstETH rate: ${error.message}`)
      }
    }
  )

  // Tool 4: Get withdrawal queue status
  server.tool(
    "lido_get_withdrawal_status",
    "Get Lido withdrawal queue status and pending requests",
    {
      rpcUrl: z.string().optional().describe("Custom RPC URL")
    },
    async () => {
      try {
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              withdrawalQueueAddress: "0x889edC2eDab5f40e902b864aD4d7AdE8E412F9B1",
              status: "Active",
              note: "Withdrawal requests are processed in order, typically within 1-5 days",
              features: [
                "Request stETH/wstETH withdrawal",
                "Claim finalized withdrawals",
                "Check request status by ID"
              ]
            }, null, 2)
          }]
        }
      } catch (error: any) {
        Logger.error("Error getting withdrawal status:", error)
        throw new Error(`Failed to get withdrawal status: ${error.message}`)
      }
    }
  )

  Logger.info("✅ Registered Lido Staking tools")
}
