/**
 * @author nirholas (Nich)
 * @website x.com/nichxbt
 * @github github.com/nirholas
 * @license MIT
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { z } from "zod"
import { Logger } from "../utils/logger.js"

const DEFILLAMA_API = "https://api.llama.fi"
const YIELDS_API = "https://yields.llama.fi"

export function registerDefiLlamaTools(server: McpServer) {
  // Tool 1: Get protocol TVL
  server.tool(
    "defillama_get_protocol",
    "Get TVL and data for a specific DeFi protocol",
    {
      protocol: z.string().describe("Protocol slug (e.g., 'aave', 'uniswap', 'curve')")
    },
    async (params) => {
      try {
        const response = await fetch(`${DEFILLAMA_API}/protocol/${params.protocol}`)
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        
        const data = await response.json() as any
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              name: data.name,
              symbol: data.symbol,
              tvl: `$${(data.tvl / 1e9).toFixed(2)}B`,
              chains: data.chains?.slice(0, 10),
              category: data.category,
              change1h: data.change_1h,
              change1d: data.change_1d,
              change7d: data.change_7d,
              url: data.url
            }, null, 2)
          }]
        }
      } catch (error: any) {
        Logger.error("Error getting protocol:", error)
        throw new Error(`Failed to get protocol: ${error.message}`)
      }
    }
  )

  // Tool 2: Get top protocols
  server.tool(
    "defillama_get_top_protocols",
    "Get top DeFi protocols by TVL",
    {
      limit: z.number().optional().describe("Number of protocols (default: 10)")
    },
    async (params) => {
      try {
        const response = await fetch(`${DEFILLAMA_API}/protocols`)
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        
        const protocols = await response.json() as any[]
        const limit = params.limit || 10
        
        const top = protocols.slice(0, limit).map((p: any) => ({
          rank: protocols.indexOf(p) + 1,
          name: p.name,
          tvl: `$${(p.tvl / 1e9).toFixed(2)}B`,
          category: p.category,
          chains: p.chains?.length || 0
        }))
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              topProtocols: top,
              totalProtocols: protocols.length,
              lastUpdated: new Date().toISOString()
            }, null, 2)
          }]
        }
      } catch (error: any) {
        Logger.error("Error getting top protocols:", error)
        throw new Error(`Failed to get top protocols: ${error.message}`)
      }
    }
  )

  // Tool 3: Get chain TVL
  server.tool(
    "defillama_get_chain_tvl",
    "Get TVL for a specific blockchain",
    {
      chain: z.string().describe("Chain name (e.g., 'Ethereum', 'Arbitrum', 'Solana')")
    },
    async (params) => {
      try {
        const response = await fetch(`${DEFILLAMA_API}/v2/chains`)
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        
        const chains = await response.json() as any[]
        const chain = chains.find((c: any) => 
          c.name.toLowerCase() === params.chain.toLowerCase() ||
          c.gecko_id?.toLowerCase() === params.chain.toLowerCase()
        )
        
        if (!chain) {
          return {
            content: [{
              type: "text",
              text: JSON.stringify({
                error: `Chain "${params.chain}" not found`,
                availableChains: chains.slice(0, 20).map((c: any) => c.name)
              }, null, 2)
            }]
          }
        }
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              name: chain.name,
              tvl: `$${(chain.tvl / 1e9).toFixed(2)}B`,
              tokenSymbol: chain.tokenSymbol,
              chainId: chain.chainId
            }, null, 2)
          }]
        }
      } catch (error: any) {
        Logger.error("Error getting chain TVL:", error)
        throw new Error(`Failed to get chain TVL: ${error.message}`)
      }
    }
  )

  // Tool 4: Get yields
  server.tool(
    "defillama_get_yields",
    "Get top yield opportunities from DeFiLlama yields",
    {
      limit: z.number().optional().describe("Number of results (default: 10)"),
      chain: z.string().optional().describe("Filter by chain")
    },
    async (params) => {
      try {
        const response = await fetch(`${YIELDS_API}/pools`)
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        
        const data = await response.json() as { data?: any[] }
        let pools = data.data || []
        
        if (params.chain) {
          pools = pools.filter((p: any) => 
            p.chain?.toLowerCase() === params.chain?.toLowerCase()
          )
        }
        
        // Sort by APY
        pools.sort((a: any, b: any) => (b.apy || 0) - (a.apy || 0))
        
        const limit = params.limit || 10
        const topYields = pools.slice(0, limit).map((p: any) => ({
          pool: p.pool,
          project: p.project,
          chain: p.chain,
          symbol: p.symbol,
          apy: `${p.apy?.toFixed(2)}%`,
          tvl: `$${((p.tvlUsd || 0) / 1e6).toFixed(2)}M`
        }))
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              yields: topYields,
              totalPools: pools.length,
              filter: params.chain || "all chains"
            }, null, 2)
          }]
        }
      } catch (error: any) {
        Logger.error("Error getting yields:", error)
        throw new Error(`Failed to get yields: ${error.message}`)
      }
    }
  )

  Logger.info("✅ Registered DeFiLlama tools")
}
