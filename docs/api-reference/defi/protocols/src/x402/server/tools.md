[**Universal Crypto MCP API Reference v1.0.0**](../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/x402/server/tools

# defi/protocols/src/x402/server/tools

## Functions

### getProtectedEndpoints()

```ts
function getProtectedEndpoints(): Map<string, ProtectedEndpoint>;
```

Defined in: [defi/protocols/src/x402/server/tools.ts:661](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/tools.ts#L661)

Get protected endpoints (for external use)

#### Returns

`Map`\<`string`, [`ProtectedEndpoint`](/docs/api/defi/protocols/src/x402/server/types.md#protectedendpoint)\>

***

### registerProtectedEndpoint()

```ts
function registerProtectedEndpoint(endpoint: ProtectedEndpoint): void;
```

Defined in: [defi/protocols/src/x402/server/tools.ts:668](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/tools.ts#L668)

Register a protected endpoint programmatically

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `endpoint` | [`ProtectedEndpoint`](/docs/api/defi/protocols/src/x402/server/types.md#protectedendpoint) |

#### Returns

`void`

***

### registerX402ServerTools()

```ts
function registerX402ServerTools(server: McpServer): void;
```

Defined in: [defi/protocols/src/x402/server/tools.ts:70](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/tools.ts#L70)

Register x402 server tools with MCP server

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `server` | `McpServer` |

#### Returns

`void`
