import assert from "node:assert/strict"
import { after, before, test } from "node:test"

import { Client } from "@modelcontextprotocol/sdk/client/index.js"
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js"
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js"

import { loadCatalog, selectServers } from "../src/catalog.js"
import { createGatewayServer } from "../src/gateway.js"
import { startHttpServer } from "../src/http.js"
import { UpstreamPool } from "../src/upstream.js"
import { fixtureServer, parseText, writeCatalog } from "./helpers.js"

const TOKEN = "test-token-123"
let http
let pool
let base

before(async () => {
  const servers = selectServers(loadCatalog(writeCatalog([fixtureServer("alpha"), fixtureServer("beta")])), {})
  pool = new UpstreamPool(servers, { idleMs: 0 })
  http = await startHttpServer({
    createServer: () => createGatewayServer({ servers, pool, mode: "router", version: "test" }),
    port: 0,
    host: "127.0.0.1",
    authToken: TOKEN,
    info: () => ({ name: "crypto-mcp-hub", servers: servers.length }),
  })
  base = `http://127.0.0.1:${http.port}`
})

after(async () => {
  await http.close()
  await pool.closeAll()
})

async function callPrice(client) {
  return parseText(await client.callTool({ name: "call_crypto_tool", arguments: { server: "alpha", tool: "get_token_price", arguments: { symbol: "ton" } } }))
}

test("health and info endpoints are public, MCP routes require the token", async () => {
  assert.equal((await fetch(`${base}/healthz`)).status, 200)
  const init = { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json, text/event-stream" }, body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "initialize", params: { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "x", version: "1" } } }) }
  assert.equal((await fetch(`${base}/mcp`, init)).status, 401)
  assert.equal((await fetch(`${base}/t/wrong/mcp`, init)).status, 401)
})

test("info endpoint only shows server details to authenticated callers", async () => {
  const anon = await (await fetch(`${base}/`)).json()
  assert.deepEqual(anon, { name: "crypto-mcp-hub", auth: "required" })
  const authed = await (await fetch(`${base}/t/${TOKEN}/`)).json()
  assert.equal(authed.servers, 2)
  assert.equal(authed.endpoints.streamableHttp, `/t/${TOKEN}/mcp`)
})

test("Streamable HTTP with a bearer token", async () => {
  const client = new Client({ name: "http-test", version: "1" })
  await client.connect(new StreamableHTTPClientTransport(new URL(`${base}/mcp`), { requestInit: { headers: { Authorization: `Bearer ${TOKEN}` } } }))
  assert.deepEqual(await callPrice(client), { symbol: "TON", quote: 4.5 })
  await client.close()
})

test("Streamable HTTP with the token in the path (ChatGPT style URL)", async () => {
  const client = new Client({ name: "http-path-test", version: "1" })
  await client.connect(new StreamableHTTPClientTransport(new URL(`${base}/t/${TOKEN}/mcp`)))
  const { tools } = await client.listTools()
  assert.equal(tools.length, 4)
  await client.close()
})

test("legacy SSE transport", async () => {
  const client = new Client({ name: "sse-test", version: "1" })
  await client.connect(new SSEClientTransport(new URL(`${base}/t/${TOKEN}/sse`)))
  assert.deepEqual(await callPrice(client), { symbol: "TON", quote: 4.5 })
  await client.close()
})

test("unknown session id gets a 404 so clients re-initialize", async () => {
  const res = await fetch(`${base}/mcp`, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json", Accept: "application/json, text/event-stream", "Mcp-Session-Id": "does-not-exist" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 2, method: "tools/list" }),
  })
  assert.equal(res.status, 404)
})
