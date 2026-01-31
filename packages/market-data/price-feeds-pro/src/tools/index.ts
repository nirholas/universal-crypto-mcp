/**
 * @author nirholas (Nich)
 * @website x.com/nichxbt
 * @github github.com/nirholas
 * @license MIT
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { z } from "zod"
import { Logger } from "../utils/logger.js"

const COINGECKO_API = "https://api.coingecko.com/api/v3"
const COINGECKO_PRO_API = "https://pro-api.coingecko.com/api/v3"

export function registerCoinGeckoProTools(server: McpServer) {
  // Tool 1: Get coin price
  server.tool(
    "coingecko_get_price",
    "Get current price for one or more cryptocurrencies",
    {
      ids: z.string().describe("Coin IDs (comma-separated, e.g., 'bitcoin,ethereum,solana')"),
      vsCurrencies: z.string().optional().describe("Target currencies (default: 'usd')"),
      includeMarketCap: z.boolean().optional().describe("Include market cap"),
      include24hChange: z.boolean().optional().describe("Include 24h change")
    },
    async (params) => {
      try {
        const vsCurrencies = params.vsCurrencies || "usd"
        const url = new URL(`${COINGECKO_API}/simple/price`)
        url.searchParams.set("ids", params.ids)
        url.searchParams.set("vs_currencies", vsCurrencies)
        if (params.includeMarketCap) url.searchParams.set("include_market_cap", "true")
        if (params.include24hChange) url.searchParams.set("include_24hr_change", "true")
        
        const response = await fetch(url.toString())
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        
        const data = await response.json()
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify(data, null, 2)
          }]
        }
      } catch (error: any) {
        Logger.error("Error getting price:", error)
        throw new Error(`Failed to get price: ${error.message}`)
      }
    }
  )

  // Tool 2: Get top coins
  server.tool(
    "coingecko_get_top_coins",
    "Get top cryptocurrencies by market cap",
    {
      limit: z.number().optional().describe("Number of coins (default: 10, max: 250)"),
      sparkline: z.boolean().optional().describe("Include 7-day sparkline")
    },
    async (params) => {
      try {
        const limit = Math.min(params.limit || 10, 250)
        const url = new URL(`${COINGECKO_API}/coins/markets`)
        url.searchParams.set("vs_currency", "usd")
        url.searchParams.set("order", "market_cap_desc")
        url.searchParams.set("per_page", limit.toString())
        url.searchParams.set("page", "1")
        url.searchParams.set("sparkline", params.sparkline ? "true" : "false")
        
        const response = await fetch(url.toString())
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        
        const coins = await response.json() as any[]
        
        const formatted = coins.map((c: any) => ({
          rank: c.market_cap_rank,
          name: c.name,
          symbol: c.symbol.toUpperCase(),
          price: `$${c.current_price?.toLocaleString()}`,
          marketCap: `$${(c.market_cap / 1e9).toFixed(2)}B`,
          change24h: `${c.price_change_percentage_24h?.toFixed(2)}%`,
          volume24h: `$${(c.total_volume / 1e9).toFixed(2)}B`
        }))
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              coins: formatted,
              lastUpdated: new Date().toISOString()
            }, null, 2)
          }]
        }
      } catch (error: any) {
        Logger.error("Error getting top coins:", error)
        throw new Error(`Failed to get top coins: ${error.message}`)
      }
    }
  )

  // Tool 3: Get trending coins
  server.tool(
    "coingecko_get_trending",
    "Get trending cryptocurrencies on CoinGecko",
    {},
    async () => {
      try {
        const response = await fetch(`${COINGECKO_API}/search/trending`)
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        
        const data = await response.json() as { coins?: any[] }
        
        const trending = data.coins?.map((c: any) => ({
          rank: c.item.market_cap_rank,
          name: c.item.name,
          symbol: c.item.symbol,
          score: c.item.score,
          priceBtc: c.item.price_btc
        })) || []
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              trending: trending.slice(0, 10),
              note: "Based on search popularity in the last 24 hours"
            }, null, 2)
          }]
        }
      } catch (error: any) {
        Logger.error("Error getting trending:", error)
        throw new Error(`Failed to get trending: ${error.message}`)
      }
    }
  )

  // Tool 4: Get coin details
  server.tool(
    "coingecko_get_coin_details",
    "Get detailed information about a specific coin",
    {
      coinId: z.string().describe("The CoinGecko coin ID (e.g., 'bitcoin', 'ethereum')")
    },
    async (params) => {
      try {
        const response = await fetch(`${COINGECKO_API}/coins/${params.coinId}?localization=false&tickers=false&community_data=false&developer_data=false`)
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        
        const coin = await response.json() as any
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              id: coin.id,
              name: coin.name,
              symbol: coin.symbol?.toUpperCase(),
              currentPrice: coin.market_data?.current_price?.usd,
              marketCap: coin.market_data?.market_cap?.usd,
              marketCapRank: coin.market_cap_rank,
              totalVolume: coin.market_data?.total_volume?.usd,
              high24h: coin.market_data?.high_24h?.usd,
              low24h: coin.market_data?.low_24h?.usd,
              priceChange24h: coin.market_data?.price_change_percentage_24h,
              priceChange7d: coin.market_data?.price_change_percentage_7d,
              priceChange30d: coin.market_data?.price_change_percentage_30d,
              ath: coin.market_data?.ath?.usd,
              athChangePercentage: coin.market_data?.ath_change_percentage?.usd,
              categories: coin.categories?.slice(0, 5),
              platforms: Object.keys(coin.platforms || {}).slice(0, 5)
            }, null, 2)
          }]
        }
      } catch (error: any) {
        Logger.error("Error getting coin details:", error)
        throw new Error(`Failed to get coin details: ${error.message}`)
      }
    }
  )

  Logger.info("✅ Registered CoinGecko Pro tools")
}
