import assert from "node:assert/strict"
import { after, test } from "node:test"

import { Client } from "@modelcontextprotocol/sdk/client/index.js"
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js"

import { BIN, fixtureServer, parseText, writeCatalog } from "./helpers.js"

const catalogPath = writeCatalog([
  fixtureServer("alpha", { env: [{ name: "ALPHA_TOKEN", required: false }] }),
  fixtureServer("beta"),
  fixtureServer("gamma"),
  fixtureServer("keyed", { env: [{ name: "KEYED_API_KEY", required: true }] }),
])

const clients = []
after(() => Promise.all(clients.map((c) => c.close())))

async function connectHub(args, env = {}) {
  const client = new Client({ name: "hub-test", version: "1.0.0" })
  await client.connect(
    new StdioClientTransport({ command: process.execPath, args: [BIN, "--catalog", catalogPath, ...args], env: { ...env, HUB_LOG_LEVEL: "error" }, stderr: "pipe" }),
  )
  clients.push(client)
  return client
}

test("router mode: find, describe and call a tool on an upstream", async () => {
  const hub = await connectHub([], { ALPHA_TOKEN: "alpha-secret", UNRELATED_SECRET: "nope" })
  const { tools } = await hub.listTools()
  assert.deepEqual(tools.map((t) => t.name).sort(), ["call_crypto_tool", "describe_crypto_tool", "find_crypto_tools", "list_crypto_servers"])
  assert.match(hub.getInstructions(), /find_crypto_tools/)

  const servers = parseText(await hub.callTool({ name: "list_crypto_servers", arguments: {} }))
  assert.deepEqual(servers.servers.map((s) => s.id), ["alpha", "beta", "gamma"], "key-gated server is hidden when its key is missing")

  const found = parseText(await hub.callTool({ name: "find_crypto_tools", arguments: { query: "token price" } }))
  assert.equal(found.results[0].tool, "get_token_price")

  const described = parseText(await hub.callTool({ name: "describe_crypto_tool", arguments: { server: "alpha", tool: "get_token_price" } }))
  assert.deepEqual(described.tool.inputSchema.required, ["symbol"])

  const price = parseText(await hub.callTool({ name: "call_crypto_tool", arguments: { server: "alpha", tool: "get_token_price", arguments: { symbol: "sol" } } }))
  assert.deepEqual(price, { symbol: "SOL", quote: 4.5 })

  const seen = parseText(await hub.callTool({ name: "call_crypto_tool", arguments: { server: "alpha", tool: "read_env", arguments: { names: ["ALPHA_TOKEN", "UNRELATED_SECRET"] } } }))
  assert.deepEqual(seen, { ALPHA_TOKEN: "alpha-secret", UNRELATED_SECRET: null })

  const unknown = await hub.callTool({ name: "call_crypto_tool", arguments: { server: "nope", tool: "x" } })
  assert.equal(unknown.isError, true)
})

test("router mode restarts an upstream that crashed", async () => {
  const hub = await connectHub([])
  await hub.callTool({ name: "call_crypto_tool", arguments: { server: "beta", tool: "crash", arguments: {} } })
  await new Promise((r) => setTimeout(r, 300))
  const price = parseText(await hub.callTool({ name: "call_crypto_tool", arguments: { server: "beta", tool: "get_token_price", arguments: { symbol: "eth" } } }))
  assert.equal(price.symbol, "ETH")
})

test("explicit key-gated server reports the missing key instead of failing silently", async () => {
  const hub = await connectHub(["--servers", "keyed,alpha", "--mode", "router"])
  const res = await hub.callTool({ name: "call_crypto_tool", arguments: { server: "keyed", tool: "get_token_price", arguments: { symbol: "x" } } })
  assert.equal(res.isError, true)
  assert.match(res.content[0].text, /needs KEYED_API_KEY/)
})

test("a catalog server hidden for a missing key names the key to set", async () => {
  const hub = await connectHub([])
  for (const name of ["call_crypto_tool", "describe_crypto_tool"]) {
    const res = await hub.callTool({ name, arguments: { server: "keyed", tool: "get_token_price", arguments: {} } })
    assert.equal(res.isError, true)
    assert.match(res.content[0].text, /"keyed" is not enabled: set KEYED_API_KEY/)
  }
  const unknown = await hub.callTool({ name: "call_crypto_tool", arguments: { server: "nope", tool: "x" } })
  assert.match(unknown.content[0].text, /Unknown server "nope"/)
})

test("proxy mode exposes namespaced upstream tools directly", async () => {
  const hub = await connectHub(["--servers", "alpha,beta"])
  const { tools } = await hub.listTools()
  const names = tools.map((t) => t.name).sort()
  assert.deepEqual(names, ["alpha__crash", "alpha__get_token_price", "alpha__read_env", "beta__crash", "beta__get_token_price", "beta__read_env"])
  const price = parseText(await hub.callTool({ name: "beta__get_token_price", arguments: { symbol: "btc" } }))
  assert.deepEqual(price, { symbol: "BTC", quote: 4.5 })
})
