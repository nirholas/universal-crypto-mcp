import assert from "node:assert/strict"
import { mkdtempSync, readFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { dirname, join } from "node:path"
import { test } from "node:test"

import { UpstreamPool } from "../src/upstream.js"
import { FIXTURE, fixtureServer } from "./helpers.js"

const alive = (pid) => {
  try {
    process.kill(pid, 0)
    return true
  } catch {
    return false
  }
}

test("closing an upstream also stops processes its launcher spawned", async () => {
  const pidFile = join(mkdtempSync(join(tmpdir(), "crypto-mcp-hub-pid-")), "pid")
  const server = fixtureServer("wrapped", {
    args: [join(dirname(FIXTURE), "wrapper.js")],
    env: [
      { name: "FIXTURE_PID_FILE", default: pidFile },
      { name: "FIXTURE_LINGER", default: "1" },
    ],
  })
  const pool = new UpstreamPool([server], { idleMs: 0 })
  assert.equal((await pool.listTools("wrapped")).length, 3)
  const grandchild = Number(readFileSync(pidFile, "utf8"))
  assert.ok(alive(grandchild))
  await pool.closeAll()
  for (let i = 0; i < 40 && alive(grandchild); i++) await new Promise((r) => setTimeout(r, 50))
  const leaked = alive(grandchild)
  if (leaked) process.kill(grandchild, "SIGKILL")
  assert.equal(leaked, false, "server process outlived the hub's close()")
})
