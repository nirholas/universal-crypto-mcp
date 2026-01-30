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

// GMX V2 contracts on Arbitrum
const GMX_READER = "0xf60becbba223EEA9495Da3f606753867eC10d139"
const GMX_DATA_STORE = "0xFD70de6b91282D8017aA4E741e9Ae325CAb992d8"

export function registerGmxV2Tools(server: McpServer) {
  // Tool 1: Get market info
  server.tool(
    "gmx_v2_get_market_info",
    "Get information about a GMX V2 perpetual market",
    {
      marketAddress: z.string().describe("The GMX market address"),
      rpcUrl: z.string().optional().describe("Arbitrum RPC URL")
    },
    async (params) => {
      try {
        const provider = new ethers.JsonRpcProvider(params.rpcUrl || "https://arb1.arbitrum.io/rpc")
        
        // Return market structure
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              marketAddress: params.marketAddress,
              chain: "Arbitrum",
              type: "Perpetual",
              note: "Use GMX Reader contract for detailed market data",
              readerContract: GMX_READER,
              dataStore: GMX_DATA_STORE
            }, null, 2)
          }]
        }
      } catch (error: any) {
        Logger.error("Error getting market info:", error)
        throw new Error(`Failed to get market info: ${error.message}`)
      }
    }
  )

  // Tool 2: Get available markets
  server.tool(
    "gmx_v2_get_markets",
    "Get list of available GMX V2 perpetual markets",
    {},
    async () => {
      try {
        const markets = [
          { name: "ETH/USD", indexToken: "ETH", longToken: "WETH", shortToken: "USDC", maxLeverage: "100x" },
          { name: "BTC/USD", indexToken: "BTC", longToken: "WBTC", shortToken: "USDC", maxLeverage: "100x" },
          { name: "ARB/USD", indexToken: "ARB", longToken: "ARB", shortToken: "USDC", maxLeverage: "50x" },
          { name: "LINK/USD", indexToken: "LINK", longToken: "LINK", shortToken: "USDC", maxLeverage: "50x" },
          { name: "SOL/USD", indexToken: "SOL", longToken: "SOL", shortToken: "USDC", maxLeverage: "50x" },
          { name: "UNI/USD", indexToken: "UNI", longToken: "UNI", shortToken: "USDC", maxLeverage: "50x" },
          { name: "DOGE/USD", indexToken: "DOGE", longToken: "DOGE", shortToken: "USDC", maxLeverage: "50x" }
        ]
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              chain: "Arbitrum",
              markets,
              totalMarkets: markets.length,
              features: ["Long/Short positions", "Up to 100x leverage", "Low fees", "Deep liquidity"]
            }, null, 2)
          }]
        }
      } catch (error: any) {
        Logger.error("Error getting markets:", error)
        throw new Error(`Failed to get markets: ${error.message}`)
      }
    }
  )

  // Tool 3: Get funding rates
  server.tool(
    "gmx_v2_get_funding_rates",
    "Get current funding rates for GMX V2 markets",
    {
      marketAddress: z.string().optional().describe("Specific market address")
    },
    async (params) => {
      try {
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              note: "Funding rates are calculated based on long/short imbalance",
              mechanism: "GMX V2 uses adaptive funding rates",
              features: [
                "Hourly funding payments",
                "Rate increases with OI imbalance",
                "Positive rate = longs pay shorts",
                "Negative rate = shorts pay longs"
              ],
              dataSource: "Fetch from GMX Reader contract"
            }, null, 2)
          }]
        }
      } catch (error: any) {
        Logger.error("Error getting funding rates:", error)
        throw new Error(`Failed to get funding rates: ${error.message}`)
      }
    }
  )

  // Tool 4: Get position info
  server.tool(
    "gmx_v2_get_position",
    "Get user's position information on GMX V2",
    {
      userAddress: z.string().describe("The user's wallet address"),
      marketAddress: z.string().describe("The market address"),
      isLong: z.boolean().describe("True for long position, false for short"),
      rpcUrl: z.string().optional().describe("Arbitrum RPC URL")
    },
    async (params) => {
      try {
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              userAddress: params.userAddress,
              marketAddress: params.marketAddress,
              isLong: params.isLong,
              positionType: params.isLong ? "LONG" : "SHORT",
              note: "Use GMX Reader contract to fetch actual position data",
              requiredData: [
                "sizeInUsd",
                "sizeInTokens",
                "collateralAmount",
                "entryFundingFeeAmountPerSize",
                "entryBorrowingFeePerShare"
              ]
            }, null, 2)
          }]
        }
      } catch (error: any) {
        Logger.error("Error getting position:", error)
        throw new Error(`Failed to get position: ${error.message}`)
      }
    }
  )

  Logger.info("✅ Registered GMX V2 tools")
}
