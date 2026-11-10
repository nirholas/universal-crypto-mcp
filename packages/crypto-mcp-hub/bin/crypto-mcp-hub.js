#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { parseArgs } from "node:util"

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"

import { categoriesOf, DEFAULT_CATALOG_PATH, loadCatalog, missingEnv, selectServers } from "../src/catalog.js"
import { CLIENT_NAMES, configFor, installInto } from "../src/clients.js"
import { runDoctor } from "../src/doctor.js"
import { createGatewayServer } from "../src/gateway.js"
import { startHttpServer } from "../src/http.js"
import { log } from "../src/log.js"
import { UpstreamPool } from "../src/upstream.js"

const here = dirname(fileURLToPath(import.meta.url))
const VERSION = JSON.parse(readFileSync(join(here, "..", "package.json"), "utf8")).version

const HELP = `crypto-mcp-hub ${VERSION}
One MCP server that fronts 100+ open-source crypto MCP servers.

Usage
  crypto-mcp-hub [serve] [options]      Run the hub (stdio by default)
  crypto-mcp-hub list [--json]          Show every server, its category and required keys
  crypto-mcp-hub config <client>        Print setup for: ${CLIENT_NAMES.join(", ")}
  crypto-mcp-hub install <client>       Add the hub to claude-desktop, cursor, windsurf or gemini
  crypto-mcp-hub doctor [options]       Start servers, list their tools, report failures

Serve options
  --http                 Serve Streamable HTTP (/mcp) and SSE (/sse) instead of stdio
  --port <n>             HTTP port (default $PORT or 8787)
  --host <addr>          HTTP bind address (default $HOST or 127.0.0.1)
  --servers <ids>        Comma-separated server ids, or "all" (default: every server whose keys are set)
  --category <names>     Only servers in these categories (comma-separated)
  --exclude <ids>        Drop these server ids
  --mode <m>             router | proxy | auto (default auto: proxy for <= 3 servers, else router)
  --env-file <path>      Load API keys from a .env file
  --catalog <path>       Use a different catalog file
  --verbose              Log upstream stderr

Doctor options
  --servers/--category/--exclude   Pick servers (default: all)
  --concurrency <n>      Parallel launches (default 4)
  --timeout <s>          Per-server start timeout in seconds (default 240)
  --ignore-env           Launch servers even when their required keys are missing
  --report <path>        Write full JSON results to a file

Environment
  HUB_AUTH_TOKEN         Require this bearer token (or /t/<token>/mcp path) in HTTP mode
  HUB_LOG_LEVEL          debug | info | warn | error | silent
  HUB_IDLE_SECONDS       Stop idle upstream processes after this long (default 900)
  HUB_CALL_TIMEOUT_SECONDS  Upstream tool-call timeout (default 120)
  Plus each upstream's own keys (see "crypto-mcp-hub list").
`

const argv = process.argv.slice(2)
const COMMANDS = new Set(["serve", "list", "config", "install", "doctor", "help"])
const command = COMMANDS.has(argv[0]) ? argv.shift() : "serve"

let parsed
try {
  parsed = parseArgs({
    args: argv,
    allowPositionals: true,
    options: {
      http: { type: "boolean" },
      port: { type: "string" },
      host: { type: "string" },
      servers: { type: "string" },
      category: { type: "string" },
      exclude: { type: "string" },
      mode: { type: "string" },
      "env-file": { type: "string" },
      catalog: { type: "string" },
      verbose: { type: "boolean" },
      json: { type: "boolean" },
      name: { type: "string" },
      concurrency: { type: "string" },
      timeout: { type: "string" },
      "ignore-env": { type: "boolean" },
      report: { type: "string" },
      help: { type: "boolean", short: "h" },
      version: { type: "boolean", short: "v" },
    },
  })
} catch (err) {
  process.stderr.write(`${err.message}\n\n${HELP}`)
  process.exit(2)
}
const opts = parsed.values

if (opts.version) {
  process.stdout.write(`${VERSION}\n`)
  process.exit(0)
}
if (opts.help || command === "help") {
  process.stdout.write(HELP)
  process.exit(0)
}
if (opts["env-file"]) {
  try {
    process.loadEnvFile(resolve(opts["env-file"]))
  } catch (err) {
    process.stderr.write(`Cannot load env file ${opts["env-file"]}: ${err.message}\n`)
    process.exit(2)
  }
}
if (opts.verbose) log.setLevel("debug")

const catalog = loadCatalog(opts.catalog ? resolve(opts.catalog) : DEFAULT_CATALOG_PATH)
const secondsEnv = (name, fallback) => {
  const n = Number(process.env[name])
  return Number.isFinite(n) && n >= 0 ? n * 1000 : fallback
}

// Forward the selection flags so an installed client config launches the same subset.
const selectionArgs = () =>
  [
    ["--servers", opts.servers],
    ["--category", opts.category],
    ["--exclude", opts.exclude],
    ["--mode", opts.mode],
  ].flatMap(([flag, v]) => (v ? [flag, v] : []))

async function serve() {
  const servers = selectServers(catalog, { servers: opts.servers, categories: opts.category, exclude: opts.exclude })
  if (!servers.length) {
    log.error("No servers selected. Check --servers/--category, or set the API keys the servers need (crypto-mcp-hub list).")
    process.exit(1)
  }
  const explicit = opts.servers && opts.servers !== "all"
  let mode = opts.mode ?? "auto"
  if (!["auto", "router", "proxy"].includes(mode)) {
    log.error(`--mode must be router, proxy or auto (got "${mode}")`)
    process.exit(2)
  }
  if (mode === "auto") mode = explicit && servers.length <= 3 ? "proxy" : "router"

  const pool = new UpstreamPool(servers, {
    version: VERSION,
    verbose: Boolean(opts.verbose),
    idleMs: secondsEnv("HUB_IDLE_SECONDS", 15 * 60_000),
    callTimeoutMs: secondsEnv("HUB_CALL_TIMEOUT_SECONDS", 120_000),
  })
  const selected = new Set(servers.map((s) => s.id))
  const hidden = catalog.servers.filter((s) => !selected.has(s.id))
  const makeGateway = () => createGatewayServer({ servers, hidden, pool, mode, version: VERSION })
  const unavailable = catalog.servers.length - selectServers(catalog, {}).length
  log.info(`${servers.length} servers in ${mode} mode${unavailable && !explicit ? ` (${unavailable} more unlock with API keys: crypto-mcp-hub list)` : ""}`)

  let closeTransport = async () => {}
  if (opts.http) {
    const host = opts.host ?? process.env.HOST ?? "127.0.0.1"
    const port = Number(opts.port ?? process.env.PORT ?? 8787)
    const authToken = process.env.HUB_AUTH_TOKEN || undefined
    if (!authToken && !["127.0.0.1", "localhost", "::1"].includes(host)) {
      log.warn(`Listening on ${host} without HUB_AUTH_TOKEN: anyone who can reach this port can call every tool, including trading tools whose keys you set.`)
    }
    const http = await startHttpServer({
      createServer: makeGateway,
      port,
      host,
      authToken,
      info: () => ({ name: "crypto-mcp-hub", version: VERSION, mode, servers: servers.length, upstreams: pool.status() }),
    })
    log.info(`HTTP on http://${host}:${http.port}  (Streamable HTTP: /mcp, SSE: /sse${authToken ? ", auth: Bearer or /t/<token>/..." : ""})`)
    closeTransport = () => http.close()
  } else {
    const gateway = makeGateway()
    await gateway.connect(new StdioServerTransport())
    closeTransport = () => gateway.close()
  }

  let shuttingDown = false
  const shutdown = async () => {
    if (shuttingDown) return
    shuttingDown = true
    await closeTransport().catch(() => {})
    await pool.closeAll()
    process.exit(0)
  }
  process.on("SIGINT", shutdown)
  process.on("SIGTERM", shutdown)
  if (!opts.http) process.stdin.on("close", shutdown)
}

function list() {
  const servers = selectServers(catalog, { servers: opts.servers ?? "all", categories: opts.category, exclude: opts.exclude })
  if (opts.json) {
    process.stdout.write(`${JSON.stringify(servers.map((s) => ({ ...s, missingEnv: missingEnv(s) })), null, 2)}\n`)
    return
  }
  const rows = servers.map((s) => {
    const missing = missingEnv(s)
    return [s.id, String(s.tools.length), s.license ?? "", s.categories.slice(0, 3).join(","), missing.length ? `needs ${missing.join(" ")}` : "ready"]
  })
  const head = ["ID", "TOOLS", "LICENSE", "CATEGORIES", "STATUS"]
  const widths = head.map((h, i) => Math.max(h.length, ...rows.map((r) => r[i].length)))
  const fmt = (r) => r.map((c, i) => c.padEnd(widths[i])).join("  ")
  const ready = rows.filter((r) => r[4] === "ready").length
  process.stdout.write(`${fmt(head)}\n${rows.map(fmt).join("\n")}\n\n${servers.length} servers, ${ready} ready now. Categories: ${categoriesOf(catalog).map(([c, n]) => `${c}(${n})`).join(" ")}\n`)
}

async function doctor() {
  const servers = selectServers(catalog, { servers: opts.servers ?? "all", categories: opts.category, exclude: opts.exclude })
  const ignoreMissingEnv = Boolean(opts["ignore-env"])
  log.info(`checking ${servers.length} servers${ignoreMissingEnv ? " (ignoring missing keys)" : ""}...`)
  let done = 0
  const partial = []
  const reportPath = opts.report ? resolve(opts.report) : null
  // Rewrite the report after every result so an interrupted run keeps what it learned.
  const saveReport = (results) => reportPath && writeFileSync(reportPath, `${JSON.stringify(results, null, 2)}\n`)
  const results = await runDoctor(servers, {
    concurrency: Number(opts.concurrency ?? 4),
    startTimeoutMs: Number(opts.timeout ?? 240) * 1000,
    ignoreMissingEnv,
    version: VERSION,
    onResult: (r) => {
      done++
      partial.push(r)
      saveReport(partial)
      const status = r.ok ? `ok   ${String(r.tools.length).padStart(3)} tools` : "FAIL"
      process.stderr.write(`[${String(done).padStart(3)}/${servers.length}] ${status}  ${r.id.padEnd(32)} ${(r.ms / 1000).toFixed(1)}s${r.ok ? "" : `  ${r.error.split("\n")[0]}`}\n`)
    },
  })
  saveReport(results)
  const ok = results.filter((r) => r.ok).length
  process.stderr.write(`\n${ok}/${results.length} servers started and listed tools.\n`)
  process.exitCode = ok === results.length ? 0 : 1
}

try {
  if (command === "serve") await serve()
  else if (command === "list") list()
  else if (command === "doctor") {
    await doctor()
    // Some upstreams leave detached helpers behind; a one-shot check must still end.
    process.exit(process.exitCode ?? 0)
  }
  else if (command === "config") {
    const client = parsed.positionals[0]
    if (!client) throw new Error(`Usage: crypto-mcp-hub config <${CLIENT_NAMES.join("|")}>`)
    process.stdout.write(`${configFor(client, { name: opts.name, extraArgs: selectionArgs() })}\n`)
  } else if (command === "install") {
    const client = parsed.positionals[0]
    if (!client) throw new Error("Usage: crypto-mcp-hub install <claude-desktop|cursor|windsurf|gemini>")
    const r = installInto(client, { name: opts.name, extraArgs: selectionArgs() })
    process.stdout.write(`Added "${opts.name ?? "crypto"}" to ${r.label}: ${r.path}${r.backup ? ` (previous config saved to ${r.backup})` : ""}\nRestart ${r.label} to load it. Add API keys to the "env" block of that entry to unlock key-gated servers.\n`)
  }
} catch (err) {
  process.stderr.write(`${err.message}\n`)
  process.exit(1)
}
