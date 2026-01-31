[**Universal Crypto MCP API Reference v1.0.0**](../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/modules/market-data

# defi/protocols/src/modules/market-data

## Functions

### registerMarketData()

```ts
function registerMarketData(server: McpServer): void;
```

Defined in: [defi/protocols/src/modules/market-data/index.ts:20](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/market-data/index.ts#L20)

Register market data module with the MCP server
Provides cryptocurrency market data, portfolio tracking, and sentiment analysis

Integrated from:
- CoinStats MCP (MIT License)
- Crypto Fear & Greed MCP (MIT License)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `server` | `McpServer` |

#### Returns

`void`
