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

// Base chain contracts
const BASE_BRIDGE = "0x49048044D57e1C92A77f79988d21Fa8fAF74E97e"

export function registerBaseChainTools(server: McpServer) {
  // Tool 1: Get network status
  server.tool(
    "base_get_network_status",
    "Get Base chain network status and gas prices",
    {},
    async () => {
      try {
        const provider = new ethers.JsonRpcProvider("https://mainnet.base.org")
        const [blockNumber, gasPrice, network] = await Promise.all([
          provider.getBlockNumber(),
          provider.getFeeData(),
          provider.getNetwork()
        ])
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              network: "Base Mainnet",
              chainId: Number(network.chainId),
              latestBlock: blockNumber,
              gasPrice: ethers.formatUnits(gasPrice.gasPrice || 0n, "gwei") + " gwei",
              builtBy: "Coinbase",
              stack: "OP Stack (Optimism)",
              nativeToken: "ETH"
            }, null, 2)
          }]
        }
      } catch (error: any) {
        Logger.error("Error getting network status:", error)
        throw new Error(`Failed to get network status: ${error.message}`)
      }
    }
  )

  // Tool 2: Get Coinbase integrations
  server.tool(
    "base_get_coinbase_integrations",
    "Get Coinbase-specific integrations on Base",
    {},
    async () => {
      try {
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              coinbaseIntegrations: [
                { name: "Coinbase Wallet", type: "Wallet", feature: "Native Base support" },
                { name: "Coinbase Commerce", type: "Payments", feature: "USDC payments on Base" },
                { name: "cbETH", type: "Token", feature: "Liquid staked ETH by Coinbase" },
                { name: "Coinbase Verifications", type: "Identity", feature: "On-chain attestations" }
              ],
              advantages: [
                "Direct Coinbase CEX integration",
                "100M+ Coinbase user onramp",
                "Native USDC support",
                "Fiat onramp via Coinbase"
              ]
            }, null, 2)
          }]
        }
      } catch (error: any) {
        Logger.error("Error getting integrations:", error)
        throw new Error(`Failed to get integrations: ${error.message}`)
      }
    }
  )

  // Tool 3: Get top dApps
  server.tool(
    "base_get_top_dapps",
    "Get popular dApps on Base chain",
    {},
    async () => {
      try {
        const dapps = [
          { name: "Aerodrome", category: "DEX", description: "Leading Base DEX, ve(3,3) model" },
          { name: "Uniswap", category: "DEX", description: "Top DEX on Base" },
          { name: "Aave", category: "Lending", description: "Leading lending protocol" },
          { name: "friend.tech", category: "Social", description: "Tokenized social connections" },
          { name: "Moonwell", category: "Lending", description: "Lending/borrowing on Base" },
          { name: "BaseSwap", category: "DEX", description: "Native Base DEX" },
          { name: "Seamless", category: "Lending", description: "ILM lending protocol" },
          { name: "Extra Finance", category: "Yield", description: "Leveraged yield farming" }
        ]
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              chain: "Base",
              dapps,
              totalDapps: dapps.length,
              note: "Base has rapidly grown to be a top L2 by TVL and activity"
            }, null, 2)
          }]
        }
      } catch (error: any) {
        Logger.error("Error getting dApps:", error)
        throw new Error(`Failed to get dApps: ${error.message}`)
      }
    }
  )

  // Tool 4: Get bridge info
  server.tool(
    "base_get_bridge_info",
    "Get Base bridge information and options",
    {},
    async () => {
      try {
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              officialBridge: {
                address: BASE_BRIDGE,
                depositTime: "~1-3 minutes",
                withdrawalTime: "7 days (challenge period)",
                supportedAssets: ["ETH", "USDC", "DAI", "WBTC", "cbETH"]
              },
              fastBridges: [
                { name: "Coinbase", time: "Instant (for Coinbase users)" },
                { name: "Across", time: "~2-5 minutes" },
                { name: "Hop Protocol", time: "~5-10 minutes" },
                { name: "Stargate", time: "~5-15 minutes" }
              ],
              coinbaseOnramp: "Direct fiat to Base via Coinbase app"
            }, null, 2)
          }]
        }
      } catch (error: any) {
        Logger.error("Error getting bridge info:", error)
        throw new Error(`Failed to get bridge info: ${error.message}`)
      }
    }
  )

  Logger.info("✅ Registered Base Chain tools")
}
