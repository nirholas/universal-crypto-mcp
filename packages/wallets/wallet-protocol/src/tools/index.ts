/**
 * @author nirholas (Nich)
 * @website x.com/nichxbt
 * @github github.com/nirholas
 * @license MIT
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { z } from "zod"
import { Logger } from "../utils/logger.js"

const WALLETCONNECT_API = "https://explorer-api.walletconnect.com/v3"

// In-memory session store for demo
const sessions = new Map<string, any>()

export function registerWalletConnectTools(server: McpServer) {
  // Tool 1: List supported wallets
  server.tool(
    "walletconnect_list_wallets",
    "List wallets that support WalletConnect",
    {
      page: z.number().optional().describe("Page number (default: 1)"),
      limit: z.number().optional().describe("Results per page (default: 10)")
    },
    async (params) => {
      try {
        const page = params.page || 1
        const limit = Math.min(params.limit || 10, 50)
        
        const projectId = process.env.WALLETCONNECT_PROJECT_ID
        if (!projectId) {
          return {
            content: [{
              type: "text",
              text: JSON.stringify({
                error: "WALLETCONNECT_PROJECT_ID not configured",
                message: "Get a project ID from cloud.walletconnect.com"
              }, null, 2)
            }]
          }
        }
        
        const url = `${WALLETCONNECT_API}/wallets?projectId=${projectId}&page=${page}&entries=${limit}`
        const response = await fetch(url)
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        
        const data = await response.json()
        
        const wallets = Object.values(data.listings || {}).map((w: any) => ({
          id: w.id,
          name: w.name,
          homepage: w.homepage,
          chains: w.chains?.slice(0, 5),
          mobile: !!w.mobile?.native || !!w.mobile?.universal,
          desktop: !!w.desktop?.native || !!w.desktop?.universal
        }))
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              wallets: wallets.slice(0, limit),
              page,
              total: data.count || wallets.length
            }, null, 2)
          }]
        }
      } catch (error: any) {
        Logger.error("Error listing wallets:", error)
        throw new Error(`Failed to list wallets: ${error.message}`)
      }
    }
  )

  // Tool 2: Create session (simulated)
  server.tool(
    "walletconnect_create_session",
    "Create a new WalletConnect session",
    {
      chains: z.array(z.string()).describe("Chain IDs to connect (e.g., ['eip155:1', 'eip155:137'])"),
      metadata: z.object({
        name: z.string(),
        description: z.string().optional(),
        url: z.string().optional()
      }).optional()
    },
    async (params) => {
      try {
        const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        
        const session = {
          id: sessionId,
          chains: params.chains,
          metadata: params.metadata || { name: "MCP Client" },
          status: "pending",
          createdAt: new Date().toISOString(),
          uri: `wc:${sessionId}@2?relay-protocol=irn&symKey=demo`
        }
        
        sessions.set(sessionId, session)
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              session,
              message: "Session created. Use the URI to connect a wallet.",
              note: "This is a simulated session for demonstration"
            }, null, 2)
          }]
        }
      } catch (error: any) {
        Logger.error("Error creating session:", error)
        throw new Error(`Failed to create session: ${error.message}`)
      }
    }
  )

  // Tool 3: Get session status
  server.tool(
    "walletconnect_get_session",
    "Get the status of a WalletConnect session",
    {
      sessionId: z.string().describe("Session ID to query")
    },
    async (params) => {
      try {
        const session = sessions.get(params.sessionId)
        
        if (!session) {
          return {
            content: [{
              type: "text",
              text: JSON.stringify({
                sessionId: params.sessionId,
                found: false,
                message: "Session not found or expired"
              }, null, 2)
            }]
          }
        }
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              session,
              found: true
            }, null, 2)
          }]
        }
      } catch (error: any) {
        Logger.error("Error getting session:", error)
        throw new Error(`Failed to get session: ${error.message}`)
      }
    }
  )

  // Tool 4: Disconnect session
  server.tool(
    "walletconnect_disconnect",
    "Disconnect a WalletConnect session",
    {
      sessionId: z.string().describe("Session ID to disconnect")
    },
    async (params) => {
      try {
        const session = sessions.get(params.sessionId)
        
        if (!session) {
          return {
            content: [{
              type: "text",
              text: JSON.stringify({
                sessionId: params.sessionId,
                success: false,
                message: "Session not found"
              }, null, 2)
            }]
          }
        }
        
        sessions.delete(params.sessionId)
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              sessionId: params.sessionId,
              success: true,
              message: "Session disconnected"
            }, null, 2)
          }]
        }
      } catch (error: any) {
        Logger.error("Error disconnecting:", error)
        throw new Error(`Failed to disconnect: ${error.message}`)
      }
    }
  )

  Logger.info("✅ Registered WalletConnect tools")
}
