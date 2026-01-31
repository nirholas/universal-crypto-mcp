[**Universal Crypto MCP API Reference v1.0.0**](../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/modules/social

# defi/protocols/src/modules/social

## Functions

### registerSocial()

```ts
function registerSocial(server: McpServer): void;
```

Defined in: [defi/protocols/src/modules/social/index.ts:20](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/social/index.ts#L20)

Register social analytics module with the MCP server
Provides social sentiment, influencer tracking, and community metrics

Data sources:
- LunarCrush API (requires API key)
- CryptoCompare Social (free tier)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `server` | `McpServer` |

#### Returns

`void`
