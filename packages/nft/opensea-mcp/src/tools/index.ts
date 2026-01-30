/**
 * @author nirholas (Nich)
 * @website x.com/nichxbt
 * @github github.com/nirholas
 * @license MIT
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { z } from "zod"
import { Logger } from "../utils/logger.js"

// OpenSea Seaport contract
const SEAPORT_ADDRESS = "0x00000000000000ADc04C56Bf30aC9d3c0aAF14dC"

export function registerOpenSeaTools(server: McpServer) {
  // Tool 1: Get collection info
  server.tool(
    "opensea_get_collection",
    "Get information about an NFT collection on OpenSea",
    {
      collectionSlug: z.string().describe("The OpenSea collection slug (e.g., 'boredapeyachtclub')"),
      apiKey: z.string().optional().describe("OpenSea API key for higher rate limits")
    },
    async (params) => {
      try {
        // Would use OpenSea API in production
        const collections: Record<string, any> = {
          "boredapeyachtclub": {
            name: "Bored Ape Yacht Club",
            slug: "boredapeyachtclub",
            contractAddress: "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D",
            totalSupply: 10000,
            floorPrice: "~25 ETH",
            totalVolume: "800K+ ETH",
            owners: "~5,500"
          },
          "cryptopunks": {
            name: "CryptoPunks",
            slug: "cryptopunks",
            contractAddress: "0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB",
            totalSupply: 10000,
            floorPrice: "~50 ETH",
            totalVolume: "1M+ ETH",
            owners: "~3,500"
          },
          "azuki": {
            name: "Azuki",
            slug: "azuki",
            contractAddress: "0xED5AF388653567Af2F388E6224dC7C4b3241C544",
            totalSupply: 10000,
            floorPrice: "~10 ETH",
            totalVolume: "400K+ ETH",
            owners: "~5,000"
          }
        }
        
        const collection = collections[params.collectionSlug.toLowerCase()] || {
          slug: params.collectionSlug,
          note: "Use OpenSea API for live data",
          apiEndpoint: `https://api.opensea.io/api/v2/collections/${params.collectionSlug}`
        }
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify(collection, null, 2)
          }]
        }
      } catch (error: any) {
        Logger.error("Error getting collection:", error)
        throw new Error(`Failed to get collection: ${error.message}`)
      }
    }
  )

  // Tool 2: Get top collections
  server.tool(
    "opensea_get_top_collections",
    "Get top NFT collections by volume on OpenSea",
    {
      limit: z.number().optional().describe("Number of collections to return"),
      period: z.enum(["24h", "7d", "30d", "all"]).optional().describe("Time period for volume")
    },
    async (params) => {
      try {
        const limit = params.limit || 10
        
        const topCollections = [
          { rank: 1, name: "CryptoPunks", floor: "~50 ETH", volume24h: "~500 ETH" },
          { rank: 2, name: "Bored Ape Yacht Club", floor: "~25 ETH", volume24h: "~400 ETH" },
          { rank: 3, name: "Mutant Ape Yacht Club", floor: "~5 ETH", volume24h: "~200 ETH" },
          { rank: 4, name: "Azuki", floor: "~10 ETH", volume24h: "~150 ETH" },
          { rank: 5, name: "Pudgy Penguins", floor: "~15 ETH", volume24h: "~100 ETH" },
          { rank: 6, name: "Doodles", floor: "~3 ETH", volume24h: "~80 ETH" },
          { rank: 7, name: "CloneX", floor: "~2 ETH", volume24h: "~70 ETH" },
          { rank: 8, name: "Moonbirds", floor: "~2 ETH", volume24h: "~60 ETH" },
          { rank: 9, name: "Milady Maker", floor: "~3 ETH", volume24h: "~50 ETH" },
          { rank: 10, name: "DeGods", floor: "~4 ETH", volume24h: "~40 ETH" }
        ]
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              period: params.period || "24h",
              collections: topCollections.slice(0, limit),
              note: "Prices are approximate - use OpenSea API for live data"
            }, null, 2)
          }]
        }
      } catch (error: any) {
        Logger.error("Error getting top collections:", error)
        throw new Error(`Failed to get top collections: ${error.message}`)
      }
    }
  )

  // Tool 3: Get NFT details
  server.tool(
    "opensea_get_nft",
    "Get details about a specific NFT on OpenSea",
    {
      contractAddress: z.string().describe("The NFT contract address"),
      tokenId: z.string().describe("The NFT token ID")
    },
    async (params) => {
      try {
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              contractAddress: params.contractAddress,
              tokenId: params.tokenId,
              apiEndpoint: `https://api.opensea.io/api/v2/chain/ethereum/contract/${params.contractAddress}/nfts/${params.tokenId}`,
              note: "Use OpenSea API for live NFT data including traits, owner, and listings",
              requiredFields: ["name", "description", "image_url", "traits", "owner", "last_sale"]
            }, null, 2)
          }]
        }
      } catch (error: any) {
        Logger.error("Error getting NFT:", error)
        throw new Error(`Failed to get NFT: ${error.message}`)
      }
    }
  )

  // Tool 4: Get Seaport info
  server.tool(
    "opensea_get_seaport_info",
    "Get information about the Seaport protocol used by OpenSea",
    {},
    async () => {
      try {
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              protocol: "Seaport",
              version: "1.5",
              address: SEAPORT_ADDRESS,
              features: [
                "Gas-efficient listings",
                "Collection offers",
                "Trait-based offers",
                "Criteria-based orders",
                "Bundle trades"
              ],
              feeStructure: {
                openSeaFee: "2.5%",
                creatorRoyalties: "Enforced on supported collections"
              },
              supportedChains: ["Ethereum", "Polygon", "Arbitrum", "Optimism", "Base", "Avalanche"]
            }, null, 2)
          }]
        }
      } catch (error: any) {
        Logger.error("Error getting Seaport info:", error)
        throw new Error(`Failed to get Seaport info: ${error.message}`)
      }
    }
  )

  Logger.info("✅ Registered OpenSea tools")
}
