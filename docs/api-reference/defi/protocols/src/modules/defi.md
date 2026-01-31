[**Universal Crypto MCP API Reference v1.0.0**](../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/modules/defi

# defi/protocols/src/modules/defi

## Functions

### registerDefi()

```ts
function registerDefi(server: McpServer): void;
```

Defined in: [defi/protocols/src/modules/defi/index.ts:19](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/defi/index.ts#L19)

Register DeFi analytics module with the MCP server
Provides protocol TVL, yields, fees, and DeFi ecosystem data

Data sources:
- DefiLlama API (free, no key required)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `server` | `McpServer` |

#### Returns

`void`
