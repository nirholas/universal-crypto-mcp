[**Universal Crypto MCP API Reference v1.0.0**](../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/server/sse

# defi/protocols/src/server/sse

## Functions

### ~~startSSEServer()~~

```ts
function startSSEServer(): Promise<McpServer>;
```

Defined in: [defi/protocols/src/server/sse.ts:25](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/server/sse.ts#L25)

SSE-based MCP Server (Legacy)

This is maintained for backwards compatibility.
For ChatGPT Developer Mode, consider using the HTTP server instead.

#### Returns

`Promise`\<`McpServer`\>

#### Deprecated

Use startHTTPServer for new integrations
