[**Universal Crypto MCP API Reference v1.0.0**](../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/modules/coingecko

# defi/protocols/src/modules/coingecko

## Functions

### registerCoinGecko()

```ts
function registerCoinGecko(server: McpServer): void;
```

Defined in: [defi/protocols/src/modules/coingecko/index.ts:18](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/coingecko/index.ts#L18)

Register CoinGecko module with the MCP server
Provides cryptocurrency price data, market information, and token search

Environment variables:
- COINGECKO_API_KEY: CoinGecko API key (demo or pro)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `server` | `McpServer` |

#### Returns

`void`
