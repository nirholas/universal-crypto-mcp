import { execFileSync } from "node:child_process"
import { readdirSync, readFileSync } from "node:fs"

// Launchers such as npx and uvx run the real server as their own child and do
// not forward signals, so stopping the launcher can orphan the server. These
// helpers find a process's descendants and make sure they stop too.

function childrenByParent() {
  const map = new Map()
  const add = (pid, ppid) => {
    if (!map.has(ppid)) map.set(ppid, [])
    map.get(ppid).push(pid)
  }
  if (process.platform === "linux") {
    for (const entry of readdirSync("/proc")) {
      if (!/^\d+$/.test(entry)) continue
      try {
        const stat = readFileSync(`/proc/${entry}/stat`, "utf8")
        // Fields after the parenthesised command name: state ppid ...
        add(Number(entry), Number(stat.slice(stat.lastIndexOf(")") + 2).split(" ")[1]))
      } catch {
        // The process exited while we were scanning.
      }
    }
    return map
  }
  const out = execFileSync("ps", ["-A", "-o", "pid=,ppid="], { encoding: "utf8" })
  for (const line of out.split("\n")) {
    const [pid, ppid] = line.trim().split(/\s+/).map(Number)
    if (pid && ppid) add(pid, ppid)
  }
  return map
}

/** Every live descendant of `pid` (children, grandchildren, ...). */
export function descendants(pid) {
  if (!pid || process.platform === "win32") return []
  let map
  try {
    map = childrenByParent()
  } catch {
    return []
  }
  const found = []
  const queue = [pid]
  while (queue.length) {
    for (const child of map.get(queue.shift()) ?? []) {
      found.push(child)
      queue.push(child)
    }
  }
  return found
}

const alive = (pid) => {
  try {
    process.kill(pid, 0)
    return true
  } catch {
    return false
  }
}

/** SIGTERM the given processes, then SIGKILL whatever is still running after `graceMs`. */
export async function terminate(pids, graceMs = 1500) {
  const signal = (pid, sig) => {
    try {
      process.kill(pid, sig)
    } catch {
      // Already gone.
    }
  }
  const live = pids.filter(alive)
  if (!live.length) return
  live.forEach((pid) => signal(pid, "SIGTERM"))
  const deadline = Date.now() + graceMs
  while (Date.now() < deadline && live.some(alive)) await new Promise((r) => setTimeout(r, 50))
  live.filter(alive).forEach((pid) => signal(pid, "SIGKILL"))
}

/** Windows: kill the whole tree rooted at `pid` (taskkill /T). */
export function killTreeWindows(pid) {
  if (process.platform !== "win32" || !pid) return
  try {
    execFileSync("taskkill", ["/pid", String(pid), "/T", "/F"], { stdio: "ignore" })
  } catch {
    // Already gone.
  }
}
