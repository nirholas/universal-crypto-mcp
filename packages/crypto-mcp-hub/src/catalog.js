import { readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const here = dirname(fileURLToPath(import.meta.url))
export const DEFAULT_CATALOG_PATH = join(here, "..", "catalog", "servers.json")

const ID_RE = /^[a-z0-9][a-z0-9-]{0,39}$/

/**
 * Load and validate the server catalog. Throws with a precise message when an
 * entry is malformed, because a broken catalog would otherwise surface as an
 * opaque spawn failure deep inside a client session.
 */
export function loadCatalog(path = DEFAULT_CATALOG_PATH) {
  let raw
  try {
    raw = JSON.parse(readFileSync(path, "utf8"))
  } catch (err) {
    throw new Error(`Cannot read catalog at ${path}: ${err.message}`)
  }
  const servers = Array.isArray(raw) ? raw : raw.servers
  if (!Array.isArray(servers)) throw new Error(`Catalog at ${path} has no "servers" array`)
  const seen = new Set()
  for (const s of servers) {
    const where = `catalog entry ${JSON.stringify(s?.id ?? s?.name ?? "?")}`
    if (!s || typeof s !== "object") throw new Error(`${where}: not an object`)
    if (!ID_RE.test(s.id ?? "")) throw new Error(`${where}: id must match ${ID_RE}`)
    if (seen.has(s.id)) throw new Error(`${where}: duplicate id`)
    seen.add(s.id)
    if (typeof s.command !== "string" || !s.command) throw new Error(`${where}: missing command`)
    if (!Array.isArray(s.args)) throw new Error(`${where}: args must be an array`)
    s.env = Array.isArray(s.env) ? s.env : []
    for (const e of s.env) {
      if (!/^[A-Z_][A-Z0-9_]*$/.test(e?.name ?? "")) throw new Error(`${where}: bad env name ${JSON.stringify(e?.name)}`)
    }
    s.categories = Array.isArray(s.categories) ? s.categories : []
    s.tools = Array.isArray(s.tools) ? s.tools : []
  }
  return { ...(Array.isArray(raw) ? {} : raw), servers }
}

/** Names of required env vars that are not set in `env`. */
export function missingEnv(server, env = process.env) {
  return server.env.filter((e) => e.required && !env[e.name]).map((e) => e.name)
}

export function isAvailable(server, env = process.env) {
  return missingEnv(server, env).length === 0
}

const splitList = (v) =>
  (Array.isArray(v) ? v : String(v ?? "").split(","))
    .map((x) => x.trim())
    .filter(Boolean)

/**
 * Resolve which catalog servers a hub instance exposes.
 *
 * - `servers`: explicit ids (or "all"). Explicit ids are kept even when their
 *   required env is missing so the caller gets a clear error on first use
 *   instead of a silently absent server.
 * - `categories`: keep servers tagged with any of these categories.
 * - `exclude`: ids to drop.
 * - Without explicit ids, servers whose required env vars are missing are
 *   dropped unless `includeUnavailable` is set.
 */
export function selectServers(catalog, { servers, categories, exclude, includeUnavailable = false, env = process.env } = {}) {
  const ids = splitList(servers)
  const cats = splitList(categories).map((c) => c.toLowerCase())
  const drop = new Set(splitList(exclude))
  const byId = new Map(catalog.servers.map((s) => [s.id, s]))
  let picked
  if (ids.length && !ids.includes("all")) {
    const unknown = ids.filter((id) => !byId.has(id))
    if (unknown.length) {
      throw new Error(`Unknown server id(s): ${unknown.join(", ")}. Run "crypto-mcp-hub list" to see every id.`)
    }
    picked = ids.map((id) => byId.get(id))
  } else {
    picked = catalog.servers.filter((s) => includeUnavailable || ids.includes("all") || isAvailable(s, env))
  }
  if (cats.length) picked = picked.filter((s) => s.categories.some((c) => cats.includes(c.toLowerCase())))
  return picked.filter((s) => !drop.has(s.id))
}

export function categoriesOf(catalog) {
  const counts = new Map()
  for (const s of catalog.servers) for (const c of s.categories) counts.set(c, (counts.get(c) ?? 0) + 1)
  return [...counts.entries()].sort((a, b) => b[1] - a[1])
}

const tokenize = (text) =>
  String(text ?? "")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 1)

/**
 * Rank (server, tool) pairs for a free-text query using the tool index stored
 * in the catalog, so discovery never has to spawn a single upstream process.
 */
export function searchTools(servers, query, { limit = 20 } = {}) {
  const terms = tokenize(query)
  if (!terms.length) return []
  const hits = []
  for (const s of servers) {
    const serverText = new Set(tokenize(`${s.id} ${s.name} ${s.description} ${s.categories.join(" ")}`))
    for (const t of s.tools) {
      const nameTokens = new Set(tokenize(t.name))
      const descTokens = new Set(tokenize(t.description))
      let score = 0
      for (const term of terms) {
        if (nameTokens.has(term)) score += 4
        else if ([...nameTokens].some((n) => n.startsWith(term))) score += 2
        if (descTokens.has(term)) score += 2
        if (serverText.has(term)) score += 1
      }
      if (score > 0) hits.push({ server: s.id, tool: t.name, description: t.description ?? "", score })
    }
  }
  hits.sort((a, b) => b.score - a.score || a.server.localeCompare(b.server))
  return hits.slice(0, limit)
}
