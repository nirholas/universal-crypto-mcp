import assert from "node:assert/strict"
import { execFileSync } from "node:child_process"
import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { test } from "node:test"

const PKG = fileURLToPath(new URL("..", import.meta.url))

function trackedFiles() {
  try {
    return execFileSync("git", ["ls-files", "--cached", "."], { cwd: PKG, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] })
      .split("\n")
      .filter(Boolean)
  } catch {
    return null
  }
}

const tracked = trackedFiles()

// A file the Dockerfile copies but git ignores builds locally and breaks every fresh clone.
test("every file the Dockerfile and docker build context need is tracked by git", { skip: tracked ? false : "not a git checkout" }, () => {
  const sources = readFileSync(new URL("../Dockerfile", import.meta.url), "utf8")
    .split("\n")
    .filter((line) => /^COPY\s/.test(line) && !line.includes("--from="))
    .flatMap((line) => line.replace(/^COPY\s+/, "").split(/\s+/).filter((t) => !t.startsWith("--")).slice(0, -1))
  const required = [...new Set([...sources, ".dockerignore"])]
  const missing = required.filter((src) => !tracked.some((f) => f === src || f.startsWith(`${src.replace(/\/$/, "")}/`)))
  assert.deepEqual(missing, [], `untracked files the image build needs: ${missing.join(", ")}`)
})
