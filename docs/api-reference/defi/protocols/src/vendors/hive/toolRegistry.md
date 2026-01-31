[**Universal Crypto MCP API Reference v1.0.0**](../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/hive/toolRegistry

# defi/protocols/src/vendors/hive/toolRegistry

## Variables

### CategoryEndpoints

```ts
const CategoryEndpoints: {
[key: number]: string;
};
```

Defined in: [defi/protocols/src/vendors/hive/toolRegistry.ts:334](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/hive/toolRegistry.ts#L334)

#### Index Signature

```ts
[key: number]: string
```

***

### ToolRegistry

```ts
ToolRegistry: {
  category: string;
  description: string;
  name: string;
  tools: string[];
}[];
```

Defined in: [defi/protocols/src/vendors/hive/toolRegistry.ts:9](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/hive/toolRegistry.ts#L9)

#### Type Declaration

| Name | Type | Default value | Defined in |
| :------ | :------ | :------ | :------ |
| `category` | `string` | `"Market Data and Price"` | [defi/protocols/src/vendors/hive/toolRegistry.ts:11](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/hive/toolRegistry.ts#L11) |
| `description` | `string` | `"Endpoints to retrieve real-time and historical cryptocurrency prices, market caps, trading volumes, OHLC data, global market statistics, supported currencies, basic market performance metrics across different timeframes and asset platforms, stablecoin market analytics, stablecoin price tracking, comprehensive stablecoin market cap data across multiple chains, social sentiment-enhanced market metrics including Galaxy Score™ and AltRank™ rankings, centralized exchange (CEX) trading data including real-time tickers, order books, recent trades, candlestick charts, best bid/ask prices, derivatives pricing (index, mark, and premium), and perpetual futures funding rates across major exchanges."` | [defi/protocols/src/vendors/hive/toolRegistry.ts:13](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/hive/toolRegistry.ts#L13) |
| `name` | `string` | `"get_market_and_price_endpoints"` | [defi/protocols/src/vendors/hive/toolRegistry.ts:12](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/hive/toolRegistry.ts#L12) |
| `tools` | `string`[] | - | [defi/protocols/src/vendors/hive/toolRegistry.ts:14](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/hive/toolRegistry.ts#L14) |

## Functions

### getAllToolsInCategory()

```ts
function getAllToolsInCategory(category: string): any[];
```

Defined in: [defi/protocols/src/vendors/hive/toolRegistry.ts:304](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/hive/toolRegistry.ts#L304)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `category` | `string` |

#### Returns

`any`[]

***

### getToolByCategory()

```ts
function getToolByCategory(category: number): {
  tool: any;
}[];
```

Defined in: [defi/protocols/src/vendors/hive/toolRegistry.ts:347](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/hive/toolRegistry.ts#L347)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `category` | `number` |

#### Returns

\{
  `tool`: `any`;
\}[]
