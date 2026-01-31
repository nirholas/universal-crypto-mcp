[**Universal Crypto MCP API Reference v1.0.0**](../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/modules/news/premium-tools

# defi/protocols/src/modules/news/premium-tools

## Variables

### PREMIUM\_PRICING

```ts
const PREMIUM_PRICING: {
  alerts: {
     description: "Breaking news alerts via SMS/Discord/Telegram";
     period: "day";
     price: "$0.05";
  };
  bulkExport: {
     description: "Export news data in CSV/JSON format";
     period: "request";
     price: "$0.02";
  };
  customFeed: {
     description: "Custom feed with your keywords and source preferences";
     period: "month";
     price: "$0.50";
  };
  firehose: {
     description: "Real-time WebSocket feed with <1 second latency";
     period: "day";
     price: "$0.10";
  };
  historical: {
     description: "Full archive access with advanced search";
     period: "query";
     price: "$0.01";
  };
  summary: {
     description: "AI-powered article summary with key points and sentiment";
     period: "request";
     price: "$0.001";
  };
};
```

Defined in: [defi/protocols/src/modules/news/premium-tools.ts:36](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/premium-tools.ts#L36)

Premium pricing tiers (in USD)

#### Type Declaration

| Name | Type | Default value | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="alerts"></a> `alerts` | \{ `description`: `"Breaking news alerts via SMS/Discord/Telegram"`; `period`: `"day"`; `price`: `"$0.05"`; \} | - | [defi/protocols/src/modules/news/premium-tools.ts:47](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/premium-tools.ts#L47) |
| `alerts.description` | `"Breaking news alerts via SMS/Discord/Telegram"` | `"Breaking news alerts via SMS/Discord/Telegram"` | [defi/protocols/src/modules/news/premium-tools.ts:50](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/premium-tools.ts#L50) |
| `alerts.period` | `"day"` | `"day"` | [defi/protocols/src/modules/news/premium-tools.ts:49](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/premium-tools.ts#L49) |
| `alerts.price` | `"$0.05"` | `"$0.05"` | [defi/protocols/src/modules/news/premium-tools.ts:48](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/premium-tools.ts#L48) |
| <a id="bulkexport"></a> `bulkExport` | \{ `description`: `"Export news data in CSV/JSON format"`; `period`: `"request"`; `price`: `"$0.02"`; \} | - | [defi/protocols/src/modules/news/premium-tools.ts:62](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/premium-tools.ts#L62) |
| `bulkExport.description` | `"Export news data in CSV/JSON format"` | `"Export news data in CSV/JSON format"` | [defi/protocols/src/modules/news/premium-tools.ts:65](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/premium-tools.ts#L65) |
| `bulkExport.period` | `"request"` | `"request"` | [defi/protocols/src/modules/news/premium-tools.ts:64](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/premium-tools.ts#L64) |
| `bulkExport.price` | `"$0.02"` | `"$0.02"` | [defi/protocols/src/modules/news/premium-tools.ts:63](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/premium-tools.ts#L63) |
| <a id="customfeed"></a> `customFeed` | \{ `description`: `"Custom feed with your keywords and source preferences"`; `period`: `"month"`; `price`: `"$0.50"`; \} | - | [defi/protocols/src/modules/news/premium-tools.ts:57](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/premium-tools.ts#L57) |
| `customFeed.description` | `"Custom feed with your keywords and source preferences"` | `"Custom feed with your keywords and source preferences"` | [defi/protocols/src/modules/news/premium-tools.ts:60](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/premium-tools.ts#L60) |
| `customFeed.period` | `"month"` | `"month"` | [defi/protocols/src/modules/news/premium-tools.ts:59](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/premium-tools.ts#L59) |
| `customFeed.price` | `"$0.50"` | `"$0.50"` | [defi/protocols/src/modules/news/premium-tools.ts:58](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/premium-tools.ts#L58) |
| <a id="firehose"></a> `firehose` | \{ `description`: `"Real-time WebSocket feed with <1 second latency"`; `period`: `"day"`; `price`: `"$0.10"`; \} | - | [defi/protocols/src/modules/news/premium-tools.ts:37](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/premium-tools.ts#L37) |
| `firehose.description` | `"Real-time WebSocket feed with <1 second latency"` | `"Real-time WebSocket feed with <1 second latency"` | [defi/protocols/src/modules/news/premium-tools.ts:40](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/premium-tools.ts#L40) |
| `firehose.period` | `"day"` | `"day"` | [defi/protocols/src/modules/news/premium-tools.ts:39](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/premium-tools.ts#L39) |
| `firehose.price` | `"$0.10"` | `"$0.10"` | [defi/protocols/src/modules/news/premium-tools.ts:38](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/premium-tools.ts#L38) |
| <a id="historical"></a> `historical` | \{ `description`: `"Full archive access with advanced search"`; `period`: `"query"`; `price`: `"$0.01"`; \} | - | [defi/protocols/src/modules/news/premium-tools.ts:52](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/premium-tools.ts#L52) |
| `historical.description` | `"Full archive access with advanced search"` | `"Full archive access with advanced search"` | [defi/protocols/src/modules/news/premium-tools.ts:55](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/premium-tools.ts#L55) |
| `historical.period` | `"query"` | `"query"` | [defi/protocols/src/modules/news/premium-tools.ts:54](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/premium-tools.ts#L54) |
| `historical.price` | `"$0.01"` | `"$0.01"` | [defi/protocols/src/modules/news/premium-tools.ts:53](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/premium-tools.ts#L53) |
| <a id="summary"></a> `summary` | \{ `description`: `"AI-powered article summary with key points and sentiment"`; `period`: `"request"`; `price`: `"$0.001"`; \} | - | [defi/protocols/src/modules/news/premium-tools.ts:42](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/premium-tools.ts#L42) |
| `summary.description` | `"AI-powered article summary with key points and sentiment"` | `"AI-powered article summary with key points and sentiment"` | [defi/protocols/src/modules/news/premium-tools.ts:45](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/premium-tools.ts#L45) |
| `summary.period` | `"request"` | `"request"` | [defi/protocols/src/modules/news/premium-tools.ts:44](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/premium-tools.ts#L44) |
| `summary.price` | `"$0.001"` | `"$0.001"` | [defi/protocols/src/modules/news/premium-tools.ts:43](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/premium-tools.ts#L43) |

***

### REVENUE\_SPLIT

```ts
const REVENUE_SPLIT: {
  contentSources: 0.7;
  platform: 0.3;
};
```

Defined in: [defi/protocols/src/modules/news/premium-tools.ts:70](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/premium-tools.ts#L70)

Revenue split configuration

#### Type Declaration

| Name | Type | Default value | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="contentsources"></a> `contentSources` | `0.7` | `0.7` | [defi/protocols/src/modules/news/premium-tools.ts:71](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/premium-tools.ts#L71) |
| <a id="platform"></a> `platform` | `0.3` | `0.3` | [defi/protocols/src/modules/news/premium-tools.ts:72](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/premium-tools.ts#L72) |

## Functions

### registerPremiumNewsTools()

```ts
function registerPremiumNewsTools(server: McpServer): void;
```

Defined in: [defi/protocols/src/modules/news/premium-tools.ts:269](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/news/premium-tools.ts#L269)

Register premium news tools with MCP server
These tools require x402 configuration for payment handling

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `server` | `McpServer` |

#### Returns

`void`
