/**
 * @author nirholas (Nich)
 * @website x.com/nichxbt
 * @github github.com/nirholas
 * @license MIT
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { z } from "zod"
import { Logger } from "../utils/logger.js"

// Blur contracts
const BLUR_POOL = "0x0000000000A39bb272e79075ade125fd351887Ac"
const BLUR_EXCHANGE = "0x000000000000Ad05Ccc4F10045630fb830B95127"

export function registerBlurTools(server: McpServer) {
  // Tool 1: Get collection bids
  server.tool(
    "blur_get_collection_bids",
    "Get current bids for an NFT collection on Blur",
    {
      collectionSlug: z.string().describe("The collection slug or contract address")
    },
    async (params) => {
      try {
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              collection: params.collectionSlug,
              bidTypes: [
                { type: "Collection Bid", description: "Bid on any NFT in collection" },
                { type: "Trait Bid", description: "Bid on NFTs with specific traits" },
                { type: "Token Bid", description: "Bid on specific token IDs" }
              ],
              poolAddress: BLUR_POOL,
              note: "Use Blur API for live bid data",
              features: [
                "0% marketplace fee",
                "Trait-based bidding",
                "Bid ladder system",
                "BLUR token rewards"
              ]
            }, null, 2)
          }]
        }
      } catch (error: any) {
        Logger.error("Error getting bids:", error)
        throw new Error(`Failed to get bids: ${error.message}`)
      }
    }
  )

  // Tool 2: Get floor depth
  server.tool(
    "blur_get_floor_depth",
    "Get floor price and depth for a collection on Blur",
    {
      collectionAddress: z.string().describe("The collection contract address")
    },
    async (params) => {
      try {
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              collectionAddress: params.collectionAddress,
              depthLevels: [
                { level: "Floor", description: "Lowest listing price" },
                { level: "Floor + 5%", description: "Listings within 5% of floor" },
                { level: "Floor + 10%", description: "Listings within 10% of floor" }
              ],
              analytics: {
                listingCount: "Use API for live count",
                salesVelocity: "Use API for sales/hour",
                bidVolume: "Use API for total bid volume"
              },
              note: "Blur provides real-time depth charts and analytics"
            }, null, 2)
          }]
        }
      } catch (error: any) {
        Logger.error("Error getting floor depth:", error)
        throw new Error(`Failed to get floor depth: ${error.message}`)
      }
    }
  )

  // Tool 3: Get BLUR token info
  server.tool(
    "blur_get_token_info",
    "Get BLUR token information and staking data",
    {},
    async () => {
      try {
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              token: {
                name: "Blur",
                symbol: "BLUR",
                address: "0x5283D291DBCF85356A21bA090E6db59121208b44",
                totalSupply: "3,000,000,000 BLUR"
              },
              utility: [
                "Governance voting",
                "Trading rewards",
                "Bidding incentives",
                "Staking for multipliers"
              ],
              stakingMultipliers: {
                "No stake": "1x rewards",
                "Stake BLUR": "Up to 2x rewards based on amount"
              }
            }, null, 2)
          }]
        }
      } catch (error: any) {
        Logger.error("Error getting token info:", error)
        throw new Error(`Failed to get token info: ${error.message}`)
      }
    }
  )

  // Tool 4: Get marketplace stats
  server.tool(
    "blur_get_marketplace_stats",
    "Get overall Blur marketplace statistics",
    {},
    async () => {
      try {
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              marketplace: "Blur",
              features: {
                fees: "0% marketplace fee",
                royalties: "Optional (0.5% minimum if enabled)",
                aggregation: "Yes - aggregates listings from OpenSea, LooksRare, etc."
              },
              proFeatures: [
                "Advanced analytics",
                "Portfolio tracking",
                "Bulk listing/sweeping",
                "Real-time notifications",
                "Bid ladder management"
              ],
              contracts: {
                exchange: BLUR_EXCHANGE,
                pool: BLUR_POOL
              },
              chains: ["Ethereum Mainnet"]
            }, null, 2)
          }]
        }
      } catch (error: any) {
        Logger.error("Error getting marketplace stats:", error)
        throw new Error(`Failed to get marketplace stats: ${error.message}`)
      }
    }
  )

  Logger.info("✅ Registered Blur tools")
}
