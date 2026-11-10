import { Client } from "@modelcontextprotocol/sdk/client/index.js"
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js"

import { missingEnv } from "./catalog.js"
import { log } from "./log.js"
import { descendants, killTreeWindows, terminate } from "./proctree.js"

// Process-level variables an upstream needs to install and run its package,
// beyond the SDK's own minimal default set (PATH, HOME, USER, SHELL, TERM...).
// Nothing else from the hub's environment is forwarded: each upstream only
// receives the variables its catalog entry declares, so a trading server's
// private key never reaches an unrelated market-data server.
const PASSTHROUGH = [
  "LANG",
  "LC_ALL",
  "TMPDIR",
  "TMP",
  "TEMP",
  "XDG_CACHE_HOME",
  "XDG_CONFIG_HOME",
  "XDG_DATA_HOME",
  "NPM_CONFIG_CACHE",
  "npm_config_cache",
  "NPM_CONFIG_REGISTRY",
  "npm_config_registry",
  "UV_CACHE_DIR",
  "UV_TOOL_DIR",
  "UV_PYTHON_INSTALL_DIR",
  "UV_INDEX_URL",
  "PIP_INDEX_URL",
  "HTTP_PROXY",
  "HTTPS_PROXY",
  "NO_PROXY",
  "http_proxy",
  "https_proxy",
  "no_proxy",
  "NODE_EXTRA_CA_CERTS",
  "SSL_CERT_FILE",
  "REQUESTS_CA_BUNDLE",
  "COMSPEC",
  "PATHEXT",
  "WINDIR",
]

export function upstreamEnv(server, env = process.env) {
  const out = {}
  for (const key of PASSTHROUGH) if (env[key] !== undefined) out[key] = env[key]
  for (const e of server.env) {
    if (env[e.name] !== undefined && env[e.name] !== "") out[e.name] = env[e.name]
    else if (e.default !== undefined) out[e.name] = String(e.default)
  }
  // Keep interactive installers quiet and non-blocking.
  out.npm_config_yes = "true"
  out.npm_config_update_notifier = "false"
  out.npm_config_fund = "false"
  out.npm_config_audit = "false"
  out.NO_UPDATE_NOTIFIER = "1"
  out.PYTHONUNBUFFERED = "1"
  return out
}

function withTimeout(promise, ms, what) {
  let timer
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error(`${what} timed out after ${Math.round(ms / 1000)}s`)), ms)
      timer.unref?.()
    }),
  ]).finally(() => clearTimeout(timer))
}

/**
 * Close an upstream's transport and make sure every process it started is
 * gone. The tree is captured first because once the launcher exits its
 * children are reparented and can no longer be traced back to it.
 */
async function stopProcessTree(pid, closeTransport) {
  const tree = descendants(pid)
  killTreeWindows(pid)
  await closeTransport().catch(() => {})
  await terminate(tree)
}

class Upstream {
  constructor(server, opts) {
    this.server = server
    this.opts = opts
    this.client = null
    this.transport = null
    this.connecting = null
    this.tools = null
    this.stderrTail = []
    this.lastUsed = Date.now()
    this.idleTimer = null
  }

  get connected() {
    return Boolean(this.client)
  }

  stderrSummary() {
    return this.stderrTail.join("\n").trim().slice(-1500)
  }

  async connect() {
    if (this.client) return this.client
    if (this.connecting) return this.connecting
    const missing = this.opts.ignoreMissingEnv ? [] : missingEnv(this.server, this.opts.env)
    if (missing.length) {
      throw new Error(
        `Server "${this.server.id}" needs ${missing.join(", ")}. Set ${missing.length > 1 ? "them" : "it"} in the hub's environment (or --env-file) and restart the hub.`,
      )
    }
    this.connecting = this._connect().finally(() => {
      this.connecting = null
    })
    return this.connecting
  }

  async _connect() {
    const { server } = this
    this.stderrTail = []
    const transport = new StdioClientTransport({
      command: server.command,
      args: server.args,
      env: upstreamEnv(server, this.opts.env),
      stderr: "pipe",
    })
    transport.stderr?.on("data", (chunk) => {
      for (const line of String(chunk).split(/\r?\n/)) {
        if (!line.trim()) continue
        this.stderrTail.push(line)
        if (this.stderrTail.length > 40) this.stderrTail.shift()
        if (this.opts.verbose) log.debug(`[${server.id}] ${line}`)
      }
    })
    const client = new Client({ name: "crypto-mcp-hub", version: this.opts.version ?? "0.0.0" }, { capabilities: {} })
    client.onclose = () => {
      if (this.client === client) {
        log.debug(`upstream ${server.id} closed`)
        this.client = null
        this.transport = null
      }
    }
    try {
      await withTimeout(client.connect(transport), this.opts.startTimeoutMs, `Starting "${server.id}"`)
    } catch (err) {
      await stopProcessTree(transport.pid, () => transport.close())
      const tail = this.stderrSummary()
      throw new Error(`${err.message}${tail ? `\n--- ${server.id} stderr ---\n${tail}` : ""}`)
    }
    this.client = client
    this.transport = transport
    this.touch()
    log.info(`upstream ${server.id} ready`)
    return client
  }

  touch() {
    this.lastUsed = Date.now()
    if (!this.opts.idleMs) return
    clearTimeout(this.idleTimer)
    this.idleTimer = setTimeout(() => {
      log.debug(`upstream ${this.server.id} idle for ${Math.round(this.opts.idleMs / 1000)}s, stopping`)
      this.close()
    }, this.opts.idleMs)
    this.idleTimer.unref?.()
  }

  async listTools() {
    if (this.tools) return this.tools
    const client = await this.connect()
    const tools = []
    let cursor
    do {
      const page = await withTimeout(client.listTools(cursor ? { cursor } : {}), this.opts.callTimeoutMs, `Listing tools of "${this.server.id}"`)
      tools.push(...page.tools)
      cursor = page.nextCursor
    } while (cursor)
    this.tools = tools
    this.touch()
    return tools
  }

  async callTool(name, args) {
    const client = await this.connect()
    this.touch()
    try {
      return await client.callTool({ name, arguments: args ?? {} }, undefined, {
        timeout: this.opts.callTimeoutMs,
        resetTimeoutOnProgress: true,
      })
    } finally {
      this.touch()
    }
  }

  async close() {
    clearTimeout(this.idleTimer)
    const { client, transport } = this
    this.client = null
    this.transport = null
    if (client) await stopProcessTree(transport?.pid, () => client.close())
  }
}

/**
 * Lazily started, shared pool of upstream MCP servers. A process is spawned on
 * first use, reused across every client session, restarted on the next call if
 * it crashes, and stopped after `idleMs` without traffic.
 */
export class UpstreamPool {
  constructor(servers, opts = {}) {
    this.opts = {
      env: process.env,
      startTimeoutMs: 180_000,
      callTimeoutMs: 120_000,
      idleMs: 15 * 60_000,
      verbose: false,
      ...opts,
    }
    this.servers = new Map(servers.map((s) => [s.id, s]))
    this.upstreams = new Map()
  }

  has(id) {
    return this.servers.has(id)
  }

  get(id) {
    const server = this.servers.get(id)
    if (!server) {
      throw new Error(`Unknown server "${id}". Use list_crypto_servers or find_crypto_tools to see the ids this hub exposes.`)
    }
    let up = this.upstreams.get(id)
    if (!up) {
      up = new Upstream(server, this.opts)
      this.upstreams.set(id, up)
    }
    return up
  }

  listTools(id) {
    return this.get(id).listTools()
  }

  callTool(id, name, args) {
    return this.get(id).callTool(name, args)
  }

  status() {
    return [...this.upstreams.values()].map((u) => ({ id: u.server.id, connected: u.connected, lastUsed: new Date(u.lastUsed).toISOString() }))
  }

  async closeAll() {
    await Promise.all([...this.upstreams.values()].map((u) => u.close()))
  }
}
