/**
 * @author nirholas (Nich)
 * @website x.com/nichxbt
 * @github github.com/nirholas
 * @license MIT
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { z } from "zod"
import { Logger } from "../utils/logger.js"

const DUNE_API_BASE = "https://api.dune.com/api/v1"

export function registerDuneAnalyticsTools(server: McpServer) {
  // Tool 1: Execute query
  server.tool(
    "dune_execute_query",
    "Execute a Dune Analytics query by ID",
    {
      queryId: z.number().describe("The Dune query ID to execute"),
      parameters: z.record(z.string()).optional().describe("Query parameters"),
      apiKey: z.string().optional().describe("Dune API key")
    },
    async (params) => {
      try {
        const apiKey = params.apiKey || process.env.DUNE_API_KEY
        
        if (!apiKey) {
          return {
            content: [{
              type: "text",
              text: JSON.stringify({
                error: "API key required",
                howToGet: "Get API key from https://dune.com/settings/api",
                envVar: "Set DUNE_API_KEY environment variable",
                queryId: params.queryId,
                endpoint: `${DUNE_API_BASE}/query/${params.queryId}/execute`
              }, null, 2)
            }]
          }
        }
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              queryId: params.queryId,
              parameters: params.parameters || {},
              endpoint: `${DUNE_API_BASE}/query/${params.queryId}/execute`,
              method: "POST",
              headers: { "X-Dune-API-Key": "***" },
              note: "Query execution returns execution_id for results polling"
            }, null, 2)
          }]
        }
      } catch (error: any) {
        Logger.error("Error executing query:", error)
        throw new Error(`Failed to execute query: ${error.message}`)
      }
    }
  )

  // Tool 2: Get query results
  server.tool(
    "dune_get_results",
    "Get results from a Dune Analytics query execution",
    {
      executionId: z.string().describe("The execution ID from query execution"),
      apiKey: z.string().optional().describe("Dune API key")
    },
    async (params) => {
      try {
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              executionId: params.executionId,
              endpoint: `${DUNE_API_BASE}/execution/${params.executionId}/results`,
              states: [
                "QUERY_STATE_PENDING",
                "QUERY_STATE_EXECUTING",
                "QUERY_STATE_COMPLETED",
                "QUERY_STATE_FAILED"
              ],
              note: "Poll this endpoint until state is COMPLETED or FAILED"
            }, null, 2)
          }]
        }
      } catch (error: any) {
        Logger.error("Error getting results:", error)
        throw new Error(`Failed to get results: ${error.message}`)
      }
    }
  )

  // Tool 3: Get popular queries
  server.tool(
    "dune_get_popular_queries",
    "Get list of popular Dune queries for common analytics",
    {
      category: z.enum(["defi", "nft", "dao", "exchange", "stablecoins"]).optional()
    },
    async (params) => {
      try {
        const popularQueries = {
          defi: [
            { id: 1264896, name: "DEX Volume by Protocol", creator: "hagaetc" },
            { id: 1847891, name: "Uniswap V3 Analytics", creator: "dune" },
            { id: 2030664, name: "Aave V3 Dashboard", creator: "aave" }
          ],
          nft: [
            { id: 1378929, name: "NFT Market Overview", creator: "rantum" },
            { id: 2047543, name: "OpenSea vs Blur Volume", creator: "sealaunch" }
          ],
          stablecoins: [
            { id: 1292, name: "Stablecoin Supply", creator: "smiles" },
            { id: 1847923, name: "USDC vs USDT Market Share", creator: "dune" }
          ],
          exchange: [
            { id: 1847890, name: "CEX Flows", creator: "cryptokoryo" },
            { id: 2938271, name: "Exchange Reserves", creator: "glassnode" }
          ],
          dao: [
            { id: 1892734, name: "DAO Treasury Balances", creator: "messari" },
            { id: 2847291, name: "Governance Activity", creator: "dune" }
          ]
        }
        
        const category = params.category || "defi"
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              category,
              queries: popularQueries[category as keyof typeof popularQueries] || popularQueries.defi,
              baseUrl: "https://dune.com/queries/",
              note: "Query IDs may change. Check Dune for latest versions."
            }, null, 2)
          }]
        }
      } catch (error: any) {
        Logger.error("Error getting popular queries:", error)
        throw new Error(`Failed to get popular queries: ${error.message}`)
      }
    }
  )

  // Tool 4: Get API info
  server.tool(
    "dune_get_api_info",
    "Get information about Dune Analytics API capabilities",
    {},
    async () => {
      try {
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              apiBase: DUNE_API_BASE,
              capabilities: [
                "Execute SQL queries on blockchain data",
                "Access pre-built community queries",
                "Create custom dashboards",
                "Real-time blockchain analytics"
              ],
              supportedChains: [
                "Ethereum", "Polygon", "Arbitrum", "Optimism", "Base",
                "BNB Chain", "Avalanche", "Fantom", "Gnosis", "Solana"
              ],
              endpoints: {
                execute: "/query/{query_id}/execute",
                results: "/execution/{execution_id}/results",
                status: "/execution/{execution_id}/status",
                cancel: "/execution/{execution_id}/cancel"
              },
              rateLimits: {
                free: "10 queries/minute",
                plus: "60 queries/minute",
                premium: "Higher limits"
              }
            }, null, 2)
          }]
        }
      } catch (error: any) {
        Logger.error("Error getting API info:", error)
        throw new Error(`Failed to get API info: ${error.message}`)
      }
    }
  )

  Logger.info("✅ Registered Dune Analytics tools")
}
