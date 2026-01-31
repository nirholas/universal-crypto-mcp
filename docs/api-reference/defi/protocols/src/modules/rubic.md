[**Universal Crypto MCP API Reference v1.0.0**](../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/modules/rubic

# defi/protocols/src/modules/rubic

## Functions

### registerRubic()

```ts
function registerRubic(server: McpServer): void;
```

Defined in: [defi/protocols/src/modules/rubic/index.ts:18](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/rubic/index.ts#L18)

Register Rubic cross-chain bridge module with the MCP server
Provides cross-chain bridging quotes, supported chains, and transaction status

Data source:
- Rubic Exchange API (free, no key required)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `server` | `McpServer` |

#### Returns

`void`
