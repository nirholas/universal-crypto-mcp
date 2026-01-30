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

// Arbitrum contracts
const ARBITRUM_GATEWAY_ROUTER = "0x72Ce9c846789fdB6fC1f34aC4AD25Dd9ef7031ef"
const ARBITRUM_INBOX = "0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"

export function registerArbitrumTools(server: McpServer) {
  // Tool 1: Get network status
  server.tool(
    "arbitrum_get_network_status",
    "Get Arbitrum network status and statistics",
    {
      network: z.enum(["one", "nova"]).optional().describe("Arbitrum network (one or nova)")
    },
    async (params) => {
      try {
        const network = params.network || "one"
        const rpcUrl = network === "one" 
          ? "https://arb1.arbitrum.io/rpc" 
          : "https://nova.arbitrum.io/rpc"
        
        const provider = new ethers.JsonRpcProvider(rpcUrl)
        const [blockNumber, gasPrice, network_] = await Promise.all([
          provider.getBlockNumber(),
          provider.getFeeData(),
          provider.getNetwork()
        ])
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              network: network === "one" ? "Arbitrum One" : "Arbitrum Nova",
              chainId: Number(network_.chainId),
              latestBlock: blockNumber,
              gasPrice: ethers.formatUnits(gasPrice.gasPrice || 0n, "gwei") + " gwei",
              maxFeePerGas: ethers.formatUnits(gasPrice.maxFeePerGas || 0n, "gwei") + " gwei",
              status: "Operational"
            }, null, 2)
          }]
        }
      } catch (error: any) {
        Logger.error("Error getting network status:", error)
        throw new Error(`Failed to get network status: ${error.message}`)
      }
    }
  )

  // Tool 2: Estimate bridge cost
  server.tool(
    "arbitrum_estimate_bridge",
    "Estimate cost to bridge assets to/from Arbitrum",
    {
      direction: z.enum(["deposit", "withdraw"]).describe("Bridge direction"),
      amount: z.string().describe("Amount in ETH to bridge"),
      rpcUrl: z.string().optional().describe("Ethereum mainnet RPC URL")
    },
    async (params) => {
      try {
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              direction: params.direction,
              amount: params.amount + " ETH",
              estimatedL1Gas: params.direction === "deposit" ? "~100,000" : "~500,000",
              estimatedL2Gas: params.direction === "deposit" ? "~300,000" : "~100,000",
              estimatedTime: params.direction === "deposit" ? "~10 minutes" : "~7 days (challenge period)",
              bridgeContract: ARBITRUM_GATEWAY_ROUTER,
              note: params.direction === "withdraw" 
                ? "Withdrawals require 7-day challenge period, or use fast bridge services"
                : "Deposits are confirmed after ~10 minutes on Arbitrum"
            }, null, 2)
          }]
        }
      } catch (error: any) {
        Logger.error("Error estimating bridge:", error)
        throw new Error(`Failed to estimate bridge: ${error.message}`)
      }
    }
  )

  // Tool 3: Get gas prices comparison
  server.tool(
    "arbitrum_get_gas_comparison",
    "Compare gas prices between Ethereum L1 and Arbitrum",
    {},
    async () => {
      try {
        const [l1Provider, l2Provider] = await Promise.all([
          new ethers.JsonRpcProvider("https://eth.llamarpc.com"),
          new ethers.JsonRpcProvider("https://arb1.arbitrum.io/rpc")
        ])
        
        const [l1Gas, l2Gas] = await Promise.all([
          l1Provider.getFeeData(),
          l2Provider.getFeeData()
        ])
        
        const l1Gwei = Number(ethers.formatUnits(l1Gas.gasPrice || 0n, "gwei"))
        const l2Gwei = Number(ethers.formatUnits(l2Gas.gasPrice || 0n, "gwei"))
        const savings = ((l1Gwei - l2Gwei) / l1Gwei * 100).toFixed(1)
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              ethereumL1: {
                gasPrice: l1Gwei.toFixed(2) + " gwei",
                estimatedSwapCost: "$" + (l1Gwei * 150000 * 0.000000001 * 2500).toFixed(2)
              },
              arbitrumL2: {
                gasPrice: l2Gwei.toFixed(4) + " gwei",
                estimatedSwapCost: "$" + (l2Gwei * 150000 * 0.000000001 * 2500).toFixed(4)
              },
              savings: savings + "% cheaper on Arbitrum"
            }, null, 2)
          }]
        }
      } catch (error: any) {
        Logger.error("Error getting gas comparison:", error)
        throw new Error(`Failed to get gas comparison: ${error.message}`)
      }
    }
  )

  // Tool 4: Get popular dApps
  server.tool(
    "arbitrum_get_top_dapps",
    "Get list of popular dApps on Arbitrum",
    {},
    async () => {
      try {
        const dapps = [
          { name: "GMX", category: "Perpetuals", tvl: "$500M+", url: "gmx.io" },
          { name: "Uniswap", category: "DEX", tvl: "$400M+", url: "uniswap.org" },
          { name: "Aave", category: "Lending", tvl: "$300M+", url: "aave.com" },
          { name: "Camelot", category: "DEX", tvl: "$100M+", url: "camelot.exchange" },
          { name: "Radiant", category: "Lending", tvl: "$80M+", url: "radiant.capital" },
          { name: "Pendle", category: "Yield", tvl: "$70M+", url: "pendle.finance" },
          { name: "SushiSwap", category: "DEX", tvl: "$50M+", url: "sushi.com" },
          { name: "Dopex", category: "Options", tvl: "$40M+", url: "dopex.io" }
        ]
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              network: "Arbitrum One",
              dapps,
              totalDapps: dapps.length,
              note: "TVL estimates - check DeFiLlama for current values"
            }, null, 2)
          }]
        }
      } catch (error: any) {
        Logger.error("Error getting dApps:", error)
        throw new Error(`Failed to get dApps: ${error.message}`)
      }
    }
  )

  Logger.info("✅ Registered Arbitrum tools")
}
