import assert from "node:assert/strict"
import { test } from "node:test"

import { loadCatalog, missingEnv, searchTools, selectServers } from "../src/catalog.js"
import { namespacedToolName } from "../src/gateway.js"
import { upstreamEnv } from "../src/upstream.js"
import { fixtureServer, writeCatalog } from "./helpers.js"

const keyed = fixtureServer("keyed", { env: [{ name: "KEYED_API_KEY", required: true }, { name: "KEYED_RPC", required: false }] })
const catalog = () => loadCatalog(writeCatalog([fixtureServer("alpha"), fixtureServer("beta", { categories: ["dex", "solana"] }), keyed]))

test("loadCatalog rejects malformed entries with the offending id", () => {
  assert.throws(() => loadCatalog(writeCatalog([{ id: "Bad Id", command: "x", args: [] }])), /"Bad Id".*id must match/)
  assert.throws(() => loadCatalog(writeCatalog([fixtureServer("dup"), fixtureServer("dup")])), /"dup": duplicate id/)
  assert.throws(() => loadCatalog(writeCatalog([{ id: "noargs", command: "x" }])), /args must be an array/)
  assert.throws(() => loadCatalog(writeCatalog([fixtureServer("badenv", { env: [{ name: "lower" }] })])), /bad env name/)
})

test("selectServers hides key-gated servers unless picked explicitly", () => {
  const c = catalog()
  const env = {}
  assert.deepEqual(selectServers(c, { env }).map((s) => s.id), ["alpha", "beta"])
  assert.deepEqual(selectServers(c, { servers: "keyed", env }).map((s) => s.id), ["keyed"])
  assert.deepEqual(selectServers(c, { servers: "all", env }).map((s) => s.id), ["alpha", "beta", "keyed"])
  assert.deepEqual(selectServers(c, { env: { KEYED_API_KEY: "k" } }).map((s) => s.id), ["alpha", "beta", "keyed"])
  assert.deepEqual(selectServers(c, { categories: "solana", env }).map((s) => s.id), ["beta"])
  assert.deepEqual(selectServers(c, { exclude: "alpha", env }).map((s) => s.id), ["beta"])
  assert.throws(() => selectServers(c, { servers: "alpha,nope", env }), /Unknown server id\(s\): nope/)
  assert.deepEqual(missingEnv(keyed, {}), ["KEYED_API_KEY"])
})

test("searchTools ranks tool-name matches above description and server matches", () => {
  const hits = searchTools(catalog().servers, "token price")
  assert.equal(hits[0].tool, "get_token_price")
  assert.equal(searchTools(catalog().servers, "   ").length, 0)
  assert.equal(searchTools(catalog().servers, "zzzz").length, 0)
  assert.equal(searchTools(catalog().servers, "price", { limit: 2 }).length, 2)
})

test("namespacedToolName stays within client limits and never collides", () => {
  assert.equal(namespacedToolName("dex", "get.quote"), "dex__get_quote")
  const long = namespacedToolName("a-very-long-server-identifier-xx", "and_an_even_longer_tool_name_for_testing")
  assert.ok(long.length <= 64)
  assert.match(long, /^[A-Za-z0-9_-]+$/)
  const taken = new Set(["dex__get_quote"])
  const second = namespacedToolName("dex", "get_quote", taken)
  assert.notEqual(second, "dex__get_quote")
  assert.ok(second.length <= 64)
})

test("upstreamEnv forwards only declared variables", () => {
  const env = { KEYED_API_KEY: "secret", OTHER_PRIVATE_KEY: "do-not-leak", LANG: "C.UTF-8", KEYED_RPC: "" }
  const out = upstreamEnv(keyed, env)
  assert.equal(out.KEYED_API_KEY, "secret")
  assert.equal(out.LANG, "C.UTF-8")
  assert.equal(out.OTHER_PRIVATE_KEY, undefined)
  assert.equal(out.KEYED_RPC, undefined)
  assert.equal(out.npm_config_yes, "true")
})
