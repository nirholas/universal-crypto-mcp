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

function getProvider() {
  const rpc = process.env.ETH_RPC_URL || "https://eth.llamarpc.com"
  return new ethers.JsonRpcProvider(rpc)
}

export function registerENSDomainsTools(server: McpServer) {
  // Tool 1: Resolve ENS name to address
  server.tool(
    "ens_resolve_name",
    "Resolve an ENS name to an Ethereum address",
    {
      name: z.string().describe("ENS name to resolve (e.g., 'vitalik.eth')")
    },
    async (params) => {
      try {
        const provider = getProvider()
        const address = await provider.resolveName(params.name)
        
        if (!address) {
          return {
            content: [{
              type: "text",
              text: JSON.stringify({
                name: params.name,
                resolved: false,
                message: "ENS name not found or not registered"
              }, null, 2)
            }]
          }
        }
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              name: params.name,
              address,
              resolved: true
            }, null, 2)
          }]
        }
      } catch (error: any) {
        Logger.error("Error resolving ENS:", error)
        throw new Error(`Failed to resolve ENS: ${error.message}`)
      }
    }
  )

  // Tool 2: Reverse lookup - address to ENS name
  server.tool(
    "ens_reverse_lookup",
    "Look up the primary ENS name for an Ethereum address",
    {
      address: z.string().describe("Ethereum address to look up")
    },
    async (params) => {
      try {
        const provider = getProvider()
        const name = await provider.lookupAddress(params.address)
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              address: params.address,
              name: name || null,
              hasENS: !!name
            }, null, 2)
          }]
        }
      } catch (error: any) {
        Logger.error("Error in reverse lookup:", error)
        throw new Error(`Failed reverse lookup: ${error.message}`)
      }
    }
  )

  // Tool 3: Get ENS avatar
  server.tool(
    "ens_get_avatar",
    "Get the avatar URL for an ENS name",
    {
      name: z.string().describe("ENS name (e.g., 'vitalik.eth')")
    },
    async (params) => {
      try {
        const provider = getProvider()
        const resolver = await provider.getResolver(params.name)
        
        if (!resolver) {
          return {
            content: [{
              type: "text",
              text: JSON.stringify({
                name: params.name,
                avatar: null,
                message: "No resolver found for this name"
              }, null, 2)
            }]
          }
        }
        
        const avatar = await resolver.getAvatar()
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              name: params.name,
              avatar: avatar || null,
              hasAvatar: !!avatar
            }, null, 2)
          }]
        }
      } catch (error: any) {
        Logger.error("Error getting avatar:", error)
        throw new Error(`Failed to get avatar: ${error.message}`)
      }
    }
  )

  // Tool 4: Get ENS text records
  server.tool(
    "ens_get_text_records",
    "Get text records for an ENS name (email, url, twitter, github, etc.)",
    {
      name: z.string().describe("ENS name to look up"),
      keys: z.array(z.string()).optional().describe("Specific keys to query (default: common ones)")
    },
    async (params) => {
      try {
        const provider = getProvider()
        const resolver = await provider.getResolver(params.name)
        
        if (!resolver) {
          return {
            content: [{
              type: "text",
              text: JSON.stringify({
                name: params.name,
                records: {},
                message: "No resolver found"
              }, null, 2)
            }]
          }
        }
        
        const keys = params.keys || ["email", "url", "com.twitter", "com.github", "description", "avatar"]
        const records: Record<string, string | null> = {}
        
        for (const key of keys) {
          try {
            const value = await resolver.getText(key)
            records[key] = value || null
          } catch {
            records[key] = null
          }
        }
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              name: params.name,
              records,
              queriedKeys: keys
            }, null, 2)
          }]
        }
      } catch (error: any) {
        Logger.error("Error getting text records:", error)
        throw new Error(`Failed to get text records: ${error.message}`)
      }
    }
  )

  Logger.info("✅ Registered ENS Domains tools")
}
