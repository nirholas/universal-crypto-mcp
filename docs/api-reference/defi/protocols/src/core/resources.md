[**Universal Crypto MCP API Reference v1.0.0**](../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/core/resources

# defi/protocols/src/core/resources

## Functions

### registerEVMResources()

```ts
function registerEVMResources(server: McpServer): void;
```

Defined in: [defi/protocols/src/core/resources.ts:16](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/core/resources.ts#L16)

Register EVM-related resources with the MCP server

Resources are application-driven, read-only data that clients can explicitly load.
For an AI agent use case, most data should be exposed through tools instead,
which allow the model to discover and autonomously fetch information.

The supported_networks resource provides a static reference list that clients
may want to browse when configuring which networks to use.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `server` | `McpServer` | The MCP server instance |

#### Returns

`void`

