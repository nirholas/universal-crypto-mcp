// stdout carries the MCP protocol in stdio mode, so every log line goes to stderr.
const LEVELS = { debug: 10, info: 20, warn: 30, error: 40, silent: 100 }
let threshold = LEVELS[(process.env.HUB_LOG_LEVEL ?? "info").toLowerCase()] ?? LEVELS.info

const write = (level) => (msg) => {
  if (LEVELS[level] < threshold) return
  process.stderr.write(`[crypto-mcp-hub] ${level === "info" ? "" : `${level}: `}${msg}\n`)
}

export const log = {
  debug: write("debug"),
  info: write("info"),
  warn: write("warn"),
  error: write("error"),
  setLevel(level) {
    if (LEVELS[level] !== undefined) threshold = LEVELS[level]
  },
}
