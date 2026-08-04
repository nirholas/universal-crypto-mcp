/**
 * Idempotent tool registration.
 *
 * @author nich
 * @website x.com/nichxbt
 * @github github.com/nirholas
 * @license Apache-2.0
 */
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"

/**
 * Wrap an McpServer so registering the same tool name twice is a warning
 * instead of a thrown error.
 *
 * Why this exists: this package registers 670 tools across ~60 modules, and 12
 * names are claimed by two modules each (approve_token_spending by both wallet
 * and tokens, sign_message by three, the whole governance set by both the EVM
 * and top-level governance modules, and so on). `McpServer.tool()` throws on the
 * second registration, so `startServer()` died before it ever listened. Every
 * consumer saw the same thing: a server that exits during initialization.
 *
 * First registration wins, which keeps the module order in registerEVM() as the
 * definition of precedence. The skip is logged so a duplicate stays visible
 * rather than being silently swallowed, and the returned proxy is transparent
 * for every other member of the server.
 */
export function withDedupedTools(server: McpServer, onSkip?: (name: string) => void): McpServer {
	const claimed = new Set<string>()
	return new Proxy(server, {
		get(target, prop, receiver) {
			if (prop !== "tool" && prop !== "registerTool") {
				const value = Reflect.get(target, prop, receiver)
				return typeof value === "function" ? value.bind(target) : value
			}
			const original = Reflect.get(target, prop, receiver) as (...args: unknown[]) => unknown
			return (...args: unknown[]) => {
				const name = args[0]
				if (typeof name === "string") {
					if (claimed.has(name)) {
						onSkip?.(name)
						return undefined
					}
					claimed.add(name)
				}
				return original.apply(target, args)
			}
		},
	}) as McpServer
}
