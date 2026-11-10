import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { homedir, platform } from "node:os"
import { dirname, join } from "node:path"

export const PACKAGE_SPEC = "@nirholas/crypto-mcp-hub@latest"

export function stdioLaunch(extraArgs = []) {
  return { command: "npx", args: ["-y", PACKAGE_SPEC, ...extraArgs] }
}

function claudeDesktopPath() {
  const home = homedir()
  if (platform() === "darwin") return join(home, "Library", "Application Support", "Claude", "claude_desktop_config.json")
  if (platform() === "win32") return join(process.env.APPDATA ?? join(home, "AppData", "Roaming"), "Claude", "claude_desktop_config.json")
  return join(process.env.XDG_CONFIG_HOME ?? join(home, ".config"), "Claude", "claude_desktop_config.json")
}

/** Clients whose config is a JSON file with an `mcpServers` map. */
export const JSON_CLIENTS = {
  "claude-desktop": { label: "Claude Desktop", path: claudeDesktopPath, key: "mcpServers" },
  cursor: { label: "Cursor", path: () => join(homedir(), ".cursor", "mcp.json"), key: "mcpServers" },
  windsurf: { label: "Windsurf", path: () => join(homedir(), ".codeium", "windsurf", "mcp_config.json"), key: "mcpServers" },
  gemini: { label: "Gemini CLI", path: () => join(homedir(), ".gemini", "settings.json"), key: "mcpServers" },
}

export const CLIENT_NAMES = ["claude-desktop", "claude-code", "cursor", "vscode", "windsurf", "gemini", "codex", "chatgpt"]

/** Human-readable setup instructions for one client. */
export function configFor(client, { name = "crypto", extraArgs = [] } = {}) {
  const launch = stdioLaunch(extraArgs)
  const argv = [launch.command, ...launch.args].join(" ")
  const json = (obj) => JSON.stringify(obj, null, 2)
  switch (client) {
    case "claude-desktop":
    case "cursor":
    case "windsurf":
    case "gemini": {
      const c = JSON_CLIENTS[client]
      return `${c.label}: add this to ${c.path()} (or run: npx -y ${PACKAGE_SPEC} install ${client})\n\n${json({ [c.key]: { [name]: launch } })}`
    }
    case "claude-code":
      return `Claude Code: run\n\n  claude mcp add ${name} -- ${argv}\n\nAdd "--scope user" to make it available in every project.`
    case "vscode":
      return `VS Code (Copilot agent mode): add to .vscode/mcp.json\n\n${json({ servers: { [name]: { type: "stdio", ...launch } } })}`
    case "codex":
      return `OpenAI Codex CLI: add to ~/.codex/config.toml\n\n[mcp_servers.${name}]\ncommand = "npx"\nargs = [${launch.args.map((a) => JSON.stringify(a)).join(", ")}]`
    case "chatgpt":
      return [
        "ChatGPT (and any remote MCP client: Claude.ai connectors, the OpenAI Responses API, Le Chat):",
        "",
        "1. Run the hub over HTTP with a secret token:",
        `     HUB_AUTH_TOKEN=$(openssl rand -hex 24) npx -y ${PACKAGE_SPEC} --http --host 0.0.0.0`,
        "   or with Docker:",
        "     docker build -t crypto-mcp-hub https://github.com/nirholas/universal-crypto-mcp.git#main:packages/crypto-mcp-hub",
        "     docker run -p 8787:8787 -e HUB_AUTH_TOKEN=<token> --env-file .env crypto-mcp-hub",
        "2. Expose it over HTTPS (deploy the container to Cloud Run/Fly/Render, or tunnel: cloudflared tunnel --url http://localhost:8787).",
        "3. ChatGPT: Settings > Apps & Connectors > Advanced > enable Developer mode, then Create connector:",
        "     URL:            https://<your-host>/t/<token>/mcp",
        "     Authentication: No authentication (the token in the path is the secret)",
        "   Clients that send headers can use https://<your-host>/mcp with Authorization: Bearer <token>.",
      ].join("\n")
    default:
      throw new Error(`Unknown client "${client}". Choose one of: ${CLIENT_NAMES.join(", ")}`)
  }
}

/**
 * Merge the hub into a JSON-config client. Existing entries are preserved and
 * the original file is backed up next to itself before it is rewritten.
 */
export function installInto(client, { name = "crypto", extraArgs = [], envVars = {} } = {}) {
  const c = JSON_CLIENTS[client]
  if (!c) throw new Error(`"install" supports ${Object.keys(JSON_CLIENTS).join(", ")}. For ${client}, run: crypto-mcp-hub config ${client}`)
  const path = c.path()
  let current = {}
  const hadFile = existsSync(path)
  if (hadFile) {
    const raw = readFileSync(path, "utf8")
    if (raw.trim()) {
      try {
        current = JSON.parse(raw)
      } catch (err) {
        throw new Error(`${path} is not valid JSON (${err.message}); fix it first so nothing in it is lost.`)
      }
    }
    copyFileSync(path, `${path}.bak`)
  } else {
    mkdirSync(dirname(path), { recursive: true })
  }
  const entry = { ...stdioLaunch(extraArgs), ...(Object.keys(envVars).length ? { env: envVars } : {}) }
  current[c.key] = { ...(current[c.key] ?? {}), [name]: entry }
  writeFileSync(path, `${JSON.stringify(current, null, 2)}\n`)
  return { path, label: c.label, backup: hadFile ? `${path}.bak` : null }
}
