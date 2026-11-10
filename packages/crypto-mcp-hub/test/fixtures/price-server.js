#!/usr/bin/env node
// Minimal MCP server used as an upstream in the hub's integration tests.
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { writeFileSync } from "node:fs"

import { z } from "zod"

// FIXTURE_PID_FILE + FIXTURE_LINGER: record our pid and keep running after
// stdin closes, like upstream servers that also hold sockets or timers open.
if (process.env.FIXTURE_PID_FILE) writeFileSync(process.env.FIXTURE_PID_FILE, String(process.pid))
if (process.env.FIXTURE_LINGER) setInterval(() => {}, 60_000)

const server = new McpServer({ name: "fixture-price", version: "1.0.0" })

server.registerTool(
  "get_token_price",
  { description: "Return the quoted price for a token symbol", inputSchema: { symbol: z.string() } },
  async ({ symbol }) => ({ content: [{ type: "text", text: JSON.stringify({ symbol: symbol.toUpperCase(), quote: symbol.length * 1.5 }) }] }),
)

server.registerTool(
  "read_env",
  { description: "Report which of the named environment variables this process can see", inputSchema: { names: z.array(z.string()) } },
  async ({ names }) => ({ content: [{ type: "text", text: JSON.stringify(Object.fromEntries(names.map((n) => [n, process.env[n] ?? null]))) }] }),
)

server.registerTool("crash", { description: "Exit the process to exercise restart handling" }, async () => {
  setImmediate(() => process.exit(3))
  return { content: [{ type: "text", text: "bye" }] }
})

await server.connect(new StdioServerTransport())
