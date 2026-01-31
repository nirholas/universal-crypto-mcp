[**Universal Crypto MCP API Reference v1.0.0**](../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/server/http

# defi/protocols/src/server/http

## Interfaces

### HTTPServerConfig

Defined in: [defi/protocols/src/server/http.ts:24](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/server/http.ts#L24)

HTTP Server Configuration

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="hostedconfig"></a> `hostedConfig?` | `any` | Optional hosted server config (if already loaded) | [defi/protocols/src/server/http.ts:30](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/server/http.ts#L30) |
| <a id="port"></a> `port?` | `number` | Port to listen on (default: 3001 or PORT env var) | [defi/protocols/src/server/http.ts:26](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/server/http.ts#L26) |
| <a id="subdomain"></a> `subdomain?` | `string` | Optional subdomain to load hosted server config | [defi/protocols/src/server/http.ts:28](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/server/http.ts#L28) |

## Functions

### startHTTPServer()

```ts
function startHTTPServer(config: HTTPServerConfig): Promise<{
  sessions: Map<string, {
     server: any;
     transport: StreamableHTTPServerTransport;
  }>;
}>;
```

Defined in: [defi/protocols/src/server/http.ts:48](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/server/http.ts#L48)

HTTP-based MCP Server for ChatGPT Developer Mode

Supports:
- Streamable HTTP transport (recommended for ChatGPT)
- Session management for stateful connections
- CORS for cross-origin requests
- Health check endpoint
- Optional subdomain routing for hosted servers

ChatGPT Developer Mode requires:
- SSE or Streamable HTTP protocol
- No authentication (or OAuth)
- readOnlyHint annotations on tools

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `config` | [`HTTPServerConfig`](/docs/api/defi/protocols/src/server/http.md#httpserverconfig) |

#### Returns

`Promise`\<\{
  `sessions`: `Map`\<`string`, \{
     `server`: `any`;
     `transport`: `StreamableHTTPServerTransport`;
  \}\>;
\}\>
