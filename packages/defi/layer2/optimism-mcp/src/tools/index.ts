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

// Optimism contracts
const OP_STANDARD_BRIDGE = "0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1"
const OP_SEQUENCER = "0x6887246668a3b87F54DeB3b94Ba47a6f63F32985"

export function registerOptimismTools(server: McpServer) {
  // Tool 1: Get network status
  server.tool(
    "optimism_get_network_status",
    "Get Optimism network status and sequencer info",
    {},
    async () => {
      try {
        const provider = new ethers.JsonRpcProvider("https://mainnet.optimism.io")
        const [blockNumber, gasPrice, network] = await Promise.all([
          provider.getBlockNumber(),
          provider.getFeeData(),
          provider.getNetwork()
        ])
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              network: "Optimism Mainnet",
              chainId: Number(network.chainId),
              latestBlock: blockNumber,
              gasPrice: ethers.formatUnits(gasPrice.gasPrice || 0n, "gwei") + " gwei",
              sequencerStatus: "Operational",
              l1DataFee: "Variable based on L1 gas",
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

  // Tool 2: Get bridge info
  server.tool(
    "optimism_get_bridge_info",
    "Get Optimism bridge information and supported tokens",
    {},
    async () => {
      try {
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              standardBridge: OP_STANDARD_BRIDGE,
              depositTime: "~1-3 minutes",
              withdrawalTime: "7 days (challenge period)",
              supportedTokens: ["ETH", "USDC", "USDT", "DAI", "WBTC", "OP", "SNX", "LINK"],
              fastBridges: [
                { name: "Hop Protocol", time: "~5-10 min" },
                { name: "Across", time: "~2-5 min" },
                { name: "Stargate", time: "~5-15 min" }
              ]
            }, null, 2)
          }]
        }
      } catch (error: any) {
        Logger.error("Error getting bridge info:", error)
        throw new Error(`Failed to get bridge info: ${error.message}`)
      }
    }
  )

  // Tool 3: Get OP token info
  server.tool(
    "optimism_get_op_token",
    "Get OP token information and governance stats",
    {},
    async () => {
      try {
        const provider = new ethers.JsonRpcProvider("https://mainnet.optimism.io")
        const opToken = "0x4200000000000000000000000000000000000042"
        
        const tokenAbi = [
          "function totalSupply() view returns (uint256)",
          "function name() view returns (string)",
          "function symbol() view returns (string)"
        ]
        
        const token = new ethers.Contract(opToken, tokenAbi, provider)
        const [totalSupply, name, symbol] = await Promise.all([
          token.totalSupply(),
          token.name(),
          token.symbol()
        ])
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              name,
              symbol,
              address: opToken,
              totalSupply: ethers.formatUnits(totalSupply, 18) + " OP",
              utility: ["Governance voting", "Protocol incentives", "Retroactive public goods funding"],
              governance: "Optimism Collective (Token House + Citizens House)"
            }, null, 2)
          }]
        }
      } catch (error: any) {
        Logger.error("Error getting OP token:", error)
        throw new Error(`Failed to get OP token: ${error.message}`)
      }
    }
  )

  // Tool 4: Get Superchain info
  server.tool(
    "optimism_get_superchain",
    "Get information about the Optimism Superchain ecosystem",
    {},
    async () => {
      try {
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              description: "Network of L2s sharing security, communication layer, and open-source tech stack",
              chains: [
                { name: "OP Mainnet", chainId: 10, status: "Live" },
                { name: "Base", chainId: 8453, status: "Live" },
                { name: "Zora", chainId: 7777777, status: "Live" },
                { name: "Mode", chainId: 34443, status: "Live" },
                { name: "Frax", chainId: 252, status: "Live" }
              ],
              features: [
                "Shared sequencer (future)",
                "Native cross-chain messaging",
                "Shared security model",
                "OP Stack compatibility"
              ]
            }, null, 2)
          }]
        }
      } catch (error: any) {
        Logger.error("Error getting Superchain:", error)
        throw new Error(`Failed to get Superchain: ${error.message}`)
      }
    }
  )

  Logger.info("✅ Registered Optimism tools")
}
