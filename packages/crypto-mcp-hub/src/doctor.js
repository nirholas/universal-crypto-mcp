import { UpstreamPool } from "./upstream.js"

const trimDescription = (d) => {
  const s = String(d ?? "").replace(/\s+/g, " ").trim()
  return s.length > 240 ? `${s.slice(0, 237)}...` : s
}

/**
 * Start each server, complete the MCP handshake, list its tools, and shut it
 * down again. Returns one result per server. With `ignoreMissingEnv`, servers
 * are launched even when their required keys are absent (most still list
 * their tools; the ones that refuse to boot report the reason).
 */
export async function runDoctor(servers, { concurrency = 4, startTimeoutMs = 240_000, callTimeoutMs = 60_000, ignoreMissingEnv = false, env = process.env, version, onResult } = {}) {
  const results = new Array(servers.length)
  let next = 0
  const worker = async () => {
    while (next < servers.length) {
      const i = next++
      const s = servers[i]
      const pool = new UpstreamPool([s], { env, startTimeoutMs, callTimeoutMs, idleMs: 0, ignoreMissingEnv, version })
      const started = Date.now()
      let result
      try {
        const tools = await pool.listTools(s.id)
        const info = pool.get(s.id).client?.getServerVersion?.()
        result = {
          id: s.id,
          ok: tools.length > 0,
          ms: Date.now() - started,
          serverInfo: info ? { name: info.name, version: info.version } : undefined,
          tools: tools.map((t) => ({ name: t.name, description: trimDescription(t.description) })),
          ...(tools.length ? {} : { error: "Server started but exposes no tools" }),
        }
      } catch (err) {
        result = { id: s.id, ok: false, ms: Date.now() - started, error: err.message }
      } finally {
        await pool.closeAll()
      }
      results[i] = result
      onResult?.(result, s)
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, servers.length) }, worker))
  return results
}
