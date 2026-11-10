import { mkdtempSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const here = dirname(fileURLToPath(import.meta.url))
export const FIXTURE = join(here, "fixtures", "price-server.js")
export const BIN = join(here, "..", "bin", "crypto-mcp-hub.js")

export function fixtureServer(id, extra = {}) {
  return {
    id,
    name: `Fixture ${id}`,
    description: `Test upstream ${id} for token prices`,
    categories: ["market-data"],
    command: process.execPath,
    args: [FIXTURE],
    env: [],
    tools: [
      { name: "get_token_price", description: "Return the quoted price for a token symbol" },
      { name: "read_env", description: "Report which of the named environment variables this process can see" },
      { name: "crash", description: "Exit the process to exercise restart handling" },
    ],
    ...extra,
  }
}

/** Write a catalog to a temp file and return its path. */
export function writeCatalog(servers) {
  const dir = mkdtempSync(join(tmpdir(), "crypto-mcp-hub-test-"))
  const path = join(dir, "servers.json")
  writeFileSync(path, JSON.stringify({ servers }))
  return path
}

export const parseText = (result) => JSON.parse(result.content[0].text)
