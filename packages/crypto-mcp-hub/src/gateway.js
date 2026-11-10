import { createHash } from "node:crypto"

import { Server } from "@modelcontextprotocol/sdk/server/index.js"
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js"

import { missingEnv, searchTools } from "./catalog.js"
import { log } from "./log.js"

const ROUTER_INSTRUCTIONS = `This hub fronts many crypto MCP servers (market data, DEX/CEX trading, wallets, DeFi, on-chain analytics, NFTs, prediction markets) behind four tools.
Workflow: 1) find_crypto_tools with a plain-language query (e.g. "solana token price", "uniswap swap quote", "wallet balance base") to get matching server+tool pairs. 2) describe_crypto_tool to read the exact input schema. 3) call_crypto_tool with that server, tool and arguments.
Use list_crypto_servers to browse by category or to see which servers need an API key. Tools that move funds act on real chains: confirm recipient, amount, token and chain with the user before calling them.`

const PROXY_INSTRUCTIONS = `Tools are namespaced "<server>__<tool>" and forwarded unchanged to the upstream crypto MCP server named by the prefix. Tools that move funds act on real chains: confirm recipient, amount, token and chain with the user before calling them.`

const text = (value) => ({ type: "text", text: typeof value === "string" ? value : JSON.stringify(value, null, 2) })
const fail = (message) => ({ isError: true, content: [text(message)] })

const MAX_TOOL_NAME = 64

/** Build a client-safe, unique tool name: [A-Za-z0-9_-]{1,64}. */
export function namespacedToolName(serverId, toolName, taken = new Set()) {
  const clean = (s) => s.replace(/[^A-Za-z0-9_-]/g, "_")
  let name = `${clean(serverId)}__${clean(toolName)}`
  if (name.length > MAX_TOOL_NAME || taken.has(name)) {
    const hash = createHash("sha256").update(`${serverId}/${toolName}`).digest("hex").slice(0, 6)
    name = `${name.slice(0, MAX_TOOL_NAME - 7)}_${hash}`
  }
  return name
}

function serverSummary(s, env) {
  const missing = missingEnv(s, env)
  return {
    id: s.id,
    name: s.name,
    description: s.description,
    categories: s.categories,
    available: missing.length === 0,
    ...(missing.length ? { missingEnv: missing } : {}),
    optionalEnv: s.env.filter((e) => !e.required).map((e) => e.name),
    toolCount: s.tools.length,
    repo: s.repo ? `https://github.com/${s.repo}` : undefined,
    license: s.license,
  }
}

function routerTools() {
  return [
    {
      name: "find_crypto_tools",
      description:
        "Search every connected crypto MCP server for tools matching a plain-language query (token prices, swaps, wallet balances, DeFi yields, NFT data, gas, prediction markets, exchange orders...). Returns ranked server+tool pairs to pass to describe_crypto_tool and call_crypto_tool.",
      inputSchema: {
        type: "object",
        properties: {
          query: { type: "string", description: 'What you want to do, e.g. "ethereum gas price" or "jupiter swap quote".' },
          limit: { type: "integer", minimum: 1, maximum: 50, description: "Maximum results (default 15)." },
        },
        required: ["query"],
      },
      annotations: { title: "Find crypto tools", readOnlyHint: true, openWorldHint: false },
    },
    {
      name: "list_crypto_servers",
      description:
        "List the crypto MCP servers this hub exposes, with category, tool count, license, and which API keys (if any) are still missing. Filter by category or free text.",
      inputSchema: {
        type: "object",
        properties: {
          category: { type: "string", description: "Only servers in this category (e.g. market-data, trading, dex, cex, wallet, defi, payments, prediction-markets, solana, ethereum, base)." },
          query: { type: "string", description: "Case-insensitive substring match on id, name or description." },
        },
      },
      annotations: { title: "List crypto servers", readOnlyHint: true, openWorldHint: false },
    },
    {
      name: "describe_crypto_tool",
      description:
        "Start the given upstream server if needed and return the exact input schema for one of its tools (or all of its tools when `tool` is omitted). Call this before call_crypto_tool so the arguments match.",
      inputSchema: {
        type: "object",
        properties: {
          server: { type: "string", description: "Server id from find_crypto_tools or list_crypto_servers." },
          tool: { type: "string", description: "Tool name on that server. Omit to list every tool with its schema." },
        },
        required: ["server"],
      },
      annotations: { title: "Describe crypto tool", readOnlyHint: true, openWorldHint: false },
    },
    {
      name: "call_crypto_tool",
      description:
        "Call a tool on an upstream crypto MCP server and return its result unchanged. Read tools return live data; trading and transfer tools act on real chains and exchanges, so confirm recipient, amount, token and chain with the user first.",
      inputSchema: {
        type: "object",
        properties: {
          server: { type: "string", description: "Server id." },
          tool: { type: "string", description: "Tool name on that server." },
          arguments: { type: "object", description: "Arguments matching the tool's input schema.", additionalProperties: true },
        },
        required: ["server", "tool"],
      },
      annotations: { title: "Call crypto tool", readOnlyHint: false, openWorldHint: true },
    },
  ]
}

/**
 * Create one MCP Server instance (one per client session) on top of a shared
 * UpstreamPool. `mode` is "router" (four meta-tools, lazy upstream start) or
 * "proxy" (every upstream tool exposed directly, all upstreams started eagerly).
 */
export function createGatewayServer({ servers, hidden = [], pool, mode, version, env = process.env }) {
  const byId = new Map(servers.map((s) => [s.id, s]))
  const hiddenById = new Map(hidden.map((s) => [s.id, s]))
  // Explain why a server id the model found elsewhere is not callable here.
  const unavailable = (id) => {
    if (pool.has(id)) return null
    const s = hiddenById.get(id)
    if (!s) return `Unknown server "${id}". Use find_crypto_tools to discover ids.`
    const missing = missingEnv(s, env)
    if (missing.length) return `"${id}" is not enabled: set ${missing.join(" and ")} in the hub's environment and restart it.`
    return `"${id}" is not enabled: the hub was started with a --servers, --category or --exclude selection that leaves it out.`
  }
  const server = new Server(
    { name: "crypto-mcp-hub", title: "Crypto MCP Hub", version },
    { capabilities: { tools: { listChanged: false } }, instructions: mode === "proxy" ? PROXY_INSTRUCTIONS : ROUTER_INSTRUCTIONS },
  )

  if (mode === "proxy") {
    let routes = null
    let building = null
    const buildRoutes = async () => {
      const taken = new Set()
      const map = new Map()
      const tools = []
      const results = await Promise.allSettled(servers.map(async (s) => ({ s, tools: await pool.listTools(s.id) })))
      for (const r of results) {
        if (r.status === "rejected") {
          log.warn(r.reason?.message ?? String(r.reason))
          continue
        }
        for (const t of r.value.tools) {
          const name = namespacedToolName(r.value.s.id, t.name, taken)
          taken.add(name)
          map.set(name, { server: r.value.s.id, tool: t.name })
          tools.push({ ...t, name, title: t.title ?? `${r.value.s.name}: ${t.name}`, description: `[${r.value.s.name}] ${t.description ?? ""}`.trim() })
        }
      }
      return { map, tools }
    }
    const ensureRoutes = async () => {
      if (routes) return routes
      building ??= buildRoutes().then((r) => {
        routes = r
        return r
      })
      return building
    }
    server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: (await ensureRoutes()).tools }))
    server.setRequestHandler(CallToolRequestSchema, async (req) => {
      const route = (await ensureRoutes()).map.get(req.params.name)
      if (!route) return fail(`Unknown tool "${req.params.name}".`)
      try {
        return await pool.callTool(route.server, route.tool, req.params.arguments)
      } catch (err) {
        return fail(err.message)
      }
    })
    return server
  }

  server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: routerTools() }))
  server.setRequestHandler(CallToolRequestSchema, async (req) => {
    const args = req.params.arguments ?? {}
    try {
      switch (req.params.name) {
        case "find_crypto_tools": {
          if (!args.query || typeof args.query !== "string") return fail("`query` is required.")
          const limit = Math.min(Math.max(Number(args.limit) || 15, 1), 50)
          const hits = searchTools(servers, args.query, { limit }).map((h) => {
            const missing = missingEnv(byId.get(h.server), env)
            return { ...h, score: undefined, ...(missing.length ? { needsEnv: missing } : {}) }
          })
          if (!hits.length) {
            return { content: [text(`No tool matched "${args.query}". Try broader words (e.g. "price", "swap", "balance") or browse with list_crypto_servers.`)] }
          }
          return { content: [text({ query: args.query, results: hits, next: "describe_crypto_tool {server, tool} then call_crypto_tool {server, tool, arguments}" })] }
        }
        case "list_crypto_servers": {
          const cat = args.category?.toLowerCase()
          const q = args.query?.toLowerCase()
          const list = servers
            .filter((s) => !cat || s.categories.some((c) => c.toLowerCase() === cat))
            .filter((s) => !q || `${s.id} ${s.name} ${s.description}`.toLowerCase().includes(q))
            .map((s) => serverSummary(s, env))
          return { content: [text({ count: list.length, servers: list })] }
        }
        case "describe_crypto_tool": {
          if (!args.server) return fail("`server` is required.")
          if (unavailable(args.server)) return fail(unavailable(args.server))
          const tools = await pool.listTools(args.server)
          if (!args.tool) return { content: [text({ server: args.server, tools })] }
          const tool = tools.find((t) => t.name === args.tool)
          if (!tool) return fail(`"${args.server}" has no tool "${args.tool}". Its tools: ${tools.map((t) => t.name).join(", ")}`)
          return { content: [text({ server: args.server, tool })] }
        }
        case "call_crypto_tool": {
          if (!args.server || !args.tool) return fail("`server` and `tool` are required.")
          if (unavailable(args.server)) return fail(unavailable(args.server))
          return await pool.callTool(args.server, args.tool, args.arguments ?? {})
        }
        default:
          return fail(`Unknown tool "${req.params.name}".`)
      }
    } catch (err) {
      return fail(err.message)
    }
  })
  return server
}
