/**
 * @author nirholas (Nich)
 * @website x.com/nichxbt
 * @github github.com/nirholas
 * @license MIT
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { z } from "zod"
import { Logger } from "../utils/logger.js"

export function registerAxieInfinityTools(server: McpServer) {
  // Tool 1: Get Axie info
  server.tool(
    "axie_get_axie_info",
    "Get information about a specific Axie",
    {
      axieId: z.string().describe("The Axie ID to look up")
    },
    async (params) => {
      try {
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              axieId: params.axieId,
              apiEndpoint: `https://api.axieinfinity.com/graphql`,
              queryType: "GetAxieDetail",
              attributes: [
                "class (Beast, Aquatic, Plant, Bug, Bird, Reptile, Mech, Dawn, Dusk)",
                "parts (eyes, ears, back, mouth, horn, tail)",
                "stats (health, speed, skill, morale)",
                "genes (dominant, recessive)",
                "breedCount",
                "birthDate"
              ],
              note: "Use Axie GraphQL API for live data"
            }, null, 2)
          }]
        }
      } catch (error: any) {
        Logger.error("Error getting Axie:", error)
        throw new Error(`Failed to get Axie: ${error.message}`)
      }
    }
  )

  // Tool 2: Get marketplace listings
  server.tool(
    "axie_get_marketplace",
    "Get Axie marketplace listings and filters",
    {
      class: z.enum(["Beast", "Aquatic", "Plant", "Bug", "Bird", "Reptile", "Mech", "Dawn", "Dusk"]).optional(),
      priceRange: z.object({
        min: z.number().optional(),
        max: z.number().optional()
      }).optional()
    },
    async (params) => {
      try {
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              filters: {
                class: params.class || "All",
                priceRange: params.priceRange || "Any"
              },
              marketplace: "https://app.axieinfinity.com/marketplace/axies",
              sortOptions: ["Lowest Price", "Highest Price", "Latest", "Highest ID"],
              filterOptions: [
                "Class",
                "Body Parts",
                "Stats",
                "Breed Count",
                "Purity (genes)",
                "Price"
              ],
              currency: "ETH/WETH (on Ronin)"
            }, null, 2)
          }]
        }
      } catch (error: any) {
        Logger.error("Error getting marketplace:", error)
        throw new Error(`Failed to get marketplace: ${error.message}`)
      }
    }
  )

  // Tool 3: Get breeding info
  server.tool(
    "axie_get_breeding_info",
    "Get information about Axie breeding mechanics",
    {},
    async () => {
      try {
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              breedingMechanics: {
                maxBreedCount: 7,
                breedingCost: "Varies by breed count (AXS + SLP)",
                genetics: {
                  dominant: "37.5% chance",
                  recessive1: "9.375% chance", 
                  recessive2: "3.125% chance"
                }
              },
              tokens: {
                AXS: "Governance token, required for breeding",
                SLP: "Smooth Love Potion, earned through gameplay"
              },
              purityLevels: [
                "6/6 pure (all parts match class)",
                "5/6 pure",
                "4/6 pure"
              ],
              breeding: "Create offspring with inherited traits"
            }, null, 2)
          }]
        }
      } catch (error: any) {
        Logger.error("Error getting breeding info:", error)
        throw new Error(`Failed to get breeding info: ${error.message}`)
      }
    }
  )

  // Tool 4: Get Ronin ecosystem
  server.tool(
    "axie_get_ronin_info",
    "Get information about Ronin blockchain and ecosystem",
    {},
    async () => {
      try {
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              ronin: {
                type: "EVM-compatible sidechain",
                chainId: 2020,
                rpcUrl: "https://api.roninchain.com/rpc",
                explorer: "https://explorer.roninchain.com"
              },
              tokens: {
                RON: "Native gas token",
                AXS: "Axie Infinity Shards - governance",
                SLP: "Smooth Love Potion - utility",
                WETH: "Wrapped ETH for marketplace"
              },
              dApps: [
                { name: "Katana DEX", type: "DEX" },
                { name: "Ronin Bridge", type: "Bridge to Ethereum" },
                { name: "Mavis Market", type: "NFT Marketplace" }
              ],
              games: ["Axie Infinity Classic", "Axie Infinity Origins", "Axie Homeland"]
            }, null, 2)
          }]
        }
      } catch (error: any) {
        Logger.error("Error getting Ronin info:", error)
        throw new Error(`Failed to get Ronin info: ${error.message}`)
      }
    }
  )

  Logger.info("✅ Registered Axie Infinity tools")
}
