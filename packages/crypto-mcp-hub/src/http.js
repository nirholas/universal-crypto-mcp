import { randomUUID, timingSafeEqual } from "node:crypto"
import { createServer } from "node:http"

import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js"
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js"
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js"

import { log } from "./log.js"

const MAX_BODY = 4 * 1024 * 1024
const SESSION_IDLE_MS = 60 * 60_000
const LOOPBACK = new Set(["127.0.0.1", "localhost", "::1"])

function readJson(req) {
  return new Promise((resolve, reject) => {
    let size = 0
    const chunks = []
    req.on("data", (c) => {
      size += c.length
      if (size > MAX_BODY) {
        reject(Object.assign(new Error("Request body too large"), { status: 413 }))
        req.destroy()
        return
      }
      chunks.push(c)
    })
    req.on("end", () => {
      if (!chunks.length) return resolve(undefined)
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString("utf8")))
      } catch {
        reject(Object.assign(new Error("Body is not valid JSON"), { status: 400, code: -32700 }))
      }
    })
    req.on("error", reject)
  })
}

function send(res, status, body, headers = {}) {
  if (res.headersSent) return
  res.writeHead(status, { "Content-Type": "application/json", ...headers })
  res.end(JSON.stringify(body))
}

const rpcError = (res, status, code, message) => send(res, status, { jsonrpc: "2.0", error: { code, message }, id: null })

function sameSecret(a, b) {
  const x = Buffer.from(String(a))
  const y = Buffer.from(String(b))
  return x.length === y.length && timingSafeEqual(x, y)
}

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Mcp-Session-Id, Mcp-Protocol-Version, Last-Event-ID")
  res.setHeader("Access-Control-Expose-Headers", "Mcp-Session-Id")
}

/**
 * Serve the hub over Streamable HTTP (`/mcp`, current spec, used by ChatGPT,
 * Claude remote connectors, Cursor, VS Code) and legacy HTTP+SSE (`/sse` +
 * `/messages`). Each client session gets its own gateway Server; all sessions
 * share one UpstreamPool so an upstream process is never started twice.
 *
 * Auth: when `authToken` is set every MCP route requires either
 * `Authorization: Bearer <token>` or the secret path prefix `/t/<token>/...`
 * (for clients such as ChatGPT that only take a URL).
 */
export function startHttpServer({ createServer: makeGateway, port, host, authToken, info }) {
  const streamSessions = new Map()
  const sseSessions = new Map()
  const loopbackOnly = LOOPBACK.has(host)

  const reaper = setInterval(() => {
    const cutoff = Date.now() - SESSION_IDLE_MS
    for (const [id, s] of streamSessions) {
      if (s.lastSeen < cutoff) {
        streamSessions.delete(id)
        s.transport.close().catch(() => {})
      }
    }
  }, 5 * 60_000)
  reaper.unref()

  const httpServer = createServer(async (req, res) => {
    setCors(res)
    if (req.method === "OPTIONS") {
      res.writeHead(204).end()
      return
    }
    const url = new URL(req.url ?? "/", "http://hub.local")
    let path = url.pathname.replace(/\/+$/, "") || "/"

    if (loopbackOnly) {
      // DNS-rebinding guard: a loopback-only hub must only answer requests
      // addressed to a loopback host name.
      const hostHeader = (req.headers.host ?? "").replace(/:\d+$/, "").replace(/^\[|\]$/g, "")
      if (!LOOPBACK.has(hostHeader)) return send(res, 403, { error: "Host not allowed" })
    }

    if (path === "/healthz") return send(res, 200, { ok: true })

    let prefix = ""
    let authed = !authToken
    const m = path.match(/^\/t\/([^/]+)(\/.*)?$/)
    if (m && authToken && sameSecret(decodeURIComponent(m[1]), authToken)) {
      authed = true
      prefix = `/t/${m[1]}`
      path = m[2] || "/"
    }
    const bearer = /^Bearer\s+(.+)$/i.exec(req.headers.authorization ?? "")?.[1]
    if (!authed && bearer && sameSecret(bearer.trim(), authToken)) authed = true

    if (path === "/") {
      // Unauthenticated callers learn only that a token is needed, not which upstreams run.
      if (!authed) return send(res, 200, { name: "crypto-mcp-hub", auth: "required" })
      return send(res, 200, { ...info(), endpoints: { streamableHttp: `${prefix}/mcp`, sse: `${prefix}/sse`, health: "/healthz" }, auth: authToken ? "required" : "none" })
    }
    if (!authed) return send(res, 401, { error: "Unauthorized: send Authorization: Bearer <HUB_AUTH_TOKEN> or use the /t/<token>/mcp URL" }, { "WWW-Authenticate": "Bearer" })

    try {
      if (path === "/mcp") return await handleStreamable(req, res)
      if (path === "/sse" && req.method === "GET") return await handleSseOpen(res, prefix)
      if (path === "/messages" && req.method === "POST") return await handleSseMessage(req, res, url)
      return send(res, 404, { error: `No route for ${req.method} ${url.pathname}` })
    } catch (err) {
      log.error(`HTTP ${req.method} ${url.pathname}: ${err.stack ?? err.message}`)
      if (err.status) return rpcError(res, err.status, err.code ?? -32600, err.message)
      return rpcError(res, 500, -32603, "Internal server error")
    }
  })

  async function handleStreamable(req, res) {
    const sessionId = req.headers["mcp-session-id"]
    const body = req.method === "POST" ? await readJson(req) : undefined
    if (sessionId) {
      const s = streamSessions.get(sessionId)
      if (!s) return rpcError(res, 404, -32001, "Session not found; re-initialize")
      s.lastSeen = Date.now()
      return s.transport.handleRequest(req, res, body)
    }
    if (req.method !== "POST" || !(Array.isArray(body) ? body.some(isInitializeRequest) : isInitializeRequest(body))) {
      return rpcError(res, 400, -32000, "Bad request: send an initialize request without Mcp-Session-Id to start a session")
    }
    const gateway = makeGateway()
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => randomUUID(),
      onsessioninitialized: (id) => {
        streamSessions.set(id, { transport, lastSeen: Date.now() })
        log.debug(`session ${id} opened (${streamSessions.size} active)`)
      },
    })
    transport.onclose = () => {
      if (transport.sessionId) streamSessions.delete(transport.sessionId)
      gateway.close().catch(() => {})
    }
    await gateway.connect(transport)
    await transport.handleRequest(req, res, body)
  }

  async function handleSseOpen(res, prefix) {
    const transport = new SSEServerTransport(`${prefix}/messages`, res)
    const gateway = makeGateway()
    sseSessions.set(transport.sessionId, transport)
    res.on("close", () => {
      sseSessions.delete(transport.sessionId)
      gateway.close().catch(() => {})
    })
    await gateway.connect(transport)
  }

  async function handleSseMessage(req, res, url) {
    const transport = sseSessions.get(url.searchParams.get("sessionId") ?? "")
    if (!transport) return rpcError(res, 404, -32001, "SSE session not found; reconnect to /sse")
    const body = await readJson(req)
    await transport.handlePostMessage(req, res, body)
  }

  return new Promise((resolve, reject) => {
    httpServer.once("error", reject)
    httpServer.listen(port, host, () => {
      httpServer.off("error", reject)
      resolve({
        httpServer,
        port: httpServer.address().port,
        async close() {
          clearInterval(reaper)
          await Promise.all([...streamSessions.values()].map((s) => s.transport.close().catch(() => {})))
          for (const t of sseSessions.values()) await t.close().catch(() => {})
          await new Promise((r) => httpServer.close(() => r()))
        },
      })
    })
  })
}
