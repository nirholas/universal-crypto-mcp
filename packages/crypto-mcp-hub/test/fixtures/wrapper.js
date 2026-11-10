#!/usr/bin/env node
// Launches the price server as a child the way `npx` does: stdio is inherited
// and signals are not forwarded, so killing this wrapper orphans the child.
import { spawn } from "node:child_process"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

spawn(process.execPath, [join(dirname(fileURLToPath(import.meta.url)), "price-server.js")], { stdio: "inherit" })
process.on("SIGTERM", () => process.exit(0))
