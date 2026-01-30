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

// Polygon zkEVM contracts
const ZKEVM_BRIDGE = "0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe"
const ZKEVM_ROLLUP = "0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2"

export function registerPolygonZkEvmTools(server: McpServer) {
  // Tool 1: Get network status
  server.tool(
    "polygon_zkevm_get_status",
    "Get Polygon zkEVM network status and batch info",
    {},
    async () => {
      try {
        const provider = new ethers.JsonRpcProvider("https://zkevm-rpc.com")
        const [blockNumber, gasPrice, network] = await Promise.all([
          provider.getBlockNumber(),
          provider.getFeeData(),
          provider.getNetwork()
        ])
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              network: "Polygon zkEVM",
              chainId: Number(network.chainId),
              latestBlock: blockNumber,
              gasPrice: ethers.formatUnits(gasPrice.gasPrice || 0n, "gwei") + " gwei",
              proofSystem: "zkSNARK",
              batchTime: "~30 seconds",
              finality: "~30 minutes (proof verification)"
            }, null, 2)
          }]
        }
      } catch (error: any) {
        Logger.error("Error getting status:", error)
        throw new Error(`Failed to get status: ${error.message}`)
      }
    }
  )

  // Tool 2: Get bridge info
  server.tool(
    "polygon_zkevm_get_bridge",
    "Get Polygon zkEVM bridge information",
    {},
    async () => {
      try {
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              bridgeContract: ZKEVM_BRIDGE,
              depositTime: "~15-30 minutes (proof required)",
              withdrawalTime: "~15-30 minutes (proof required)",
              supportedNetworks: ["Ethereum Mainnet", "Polygon zkEVM"],
              features: [
                "Native ETH bridging",
                "ERC-20 token bridging",
                "Message bridging",
                "Unified bridge with Polygon ecosystem"
              ],
              note: "zkEVM uses cryptographic proofs, no 7-day challenge period"
            }, null, 2)
          }]
        }
      } catch (error: any) {
        Logger.error("Error getting bridge:", error)
        throw new Error(`Failed to get bridge: ${error.message}`)
      }
    }
  )

  // Tool 3: Get batch info
  server.tool(
    "polygon_zkevm_get_batches",
    "Get information about zkEVM batches and proofs",
    {},
    async () => {
      try {
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              rollupContract: ZKEVM_ROLLUP,
              batchingProcess: [
                "1. Transactions are collected into batches",
                "2. Sequencer orders transactions",
                "3. Batch is compressed and sent to L1",
                "4. ZK proof is generated (off-chain)",
                "5. Proof is verified on L1 (trustless finality)"
              ],
              proofDetails: {
                type: "zkSNARK",
                prover: "Polygon zkProver",
                verificationTime: "~30 minutes",
                gasEfficiency: "Proof verification is constant cost"
              }
            }, null, 2)
          }]
        }
      } catch (error: any) {
        Logger.error("Error getting batches:", error)
        throw new Error(`Failed to get batches: ${error.message}`)
      }
    }
  )

  // Tool 4: Get ecosystem info
  server.tool(
    "polygon_zkevm_get_ecosystem",
    "Get Polygon zkEVM ecosystem and dApps",
    {},
    async () => {
      try {
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              dapps: [
                { name: "QuickSwap", category: "DEX" },
                { name: "Aave", category: "Lending" },
                { name: "Balancer", category: "DEX" },
                { name: "Curve", category: "Stableswap" },
                { name: "0x Protocol", category: "Aggregator" }
              ],
              advantages: [
                "Full EVM equivalence",
                "Fast finality via ZK proofs",
                "No 7-day withdrawal delay",
                "Lower gas than optimistic rollups"
              ],
              polygonEcosystem: [
                "Polygon PoS (sidechain)",
                "Polygon zkEVM (zk rollup)",
                "Polygon CDK (app-chains)",
                "Polygon Miden (zk VM)"
              ]
            }, null, 2)
          }]
        }
      } catch (error: any) {
        Logger.error("Error getting ecosystem:", error)
        throw new Error(`Failed to get ecosystem: ${error.message}`)
      }
    }
  )

  Logger.info("✅ Registered Polygon zkEVM tools")
}
