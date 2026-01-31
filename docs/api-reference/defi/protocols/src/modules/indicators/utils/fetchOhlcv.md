[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/modules/indicators/utils/fetchOhlcv

# defi/protocols/src/modules/indicators/utils/fetchOhlcv

## Interfaces

### OhlcvAsset

Defined in: [defi/protocols/src/modules/indicators/utils/fetchOhlcv.ts:11](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/indicators/utils/fetchOhlcv.ts#L11)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="closings"></a> `closings` | `number`[] | [defi/protocols/src/modules/indicators/utils/fetchOhlcv.ts:16](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/indicators/utils/fetchOhlcv.ts#L16) |
| <a id="dates"></a> `dates` | `Date`[] | [defi/protocols/src/modules/indicators/utils/fetchOhlcv.ts:12](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/indicators/utils/fetchOhlcv.ts#L12) |
| <a id="highs"></a> `highs` | `number`[] | [defi/protocols/src/modules/indicators/utils/fetchOhlcv.ts:14](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/indicators/utils/fetchOhlcv.ts#L14) |
| <a id="lows"></a> `lows` | `number`[] | [defi/protocols/src/modules/indicators/utils/fetchOhlcv.ts:15](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/indicators/utils/fetchOhlcv.ts#L15) |
| <a id="openings"></a> `openings` | `number`[] | [defi/protocols/src/modules/indicators/utils/fetchOhlcv.ts:13](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/indicators/utils/fetchOhlcv.ts#L13) |
| <a id="volumes"></a> `volumes` | `number`[] | [defi/protocols/src/modules/indicators/utils/fetchOhlcv.ts:17](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/indicators/utils/fetchOhlcv.ts#L17) |

## Functions

### fetchOhlcvData()

```ts
function fetchOhlcvData(
   symbol: string, 
   timeframe: string, 
limit: number): Promise<OhlcvAsset>;
```

Defined in: [defi/protocols/src/modules/indicators/utils/fetchOhlcv.ts:38](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/indicators/utils/fetchOhlcv.ts#L38)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `symbol` | `string` |
| `timeframe` | `string` |
| `limit` | `number` |

#### Returns

`Promise`\<[`OhlcvAsset`](/docs/api/defi/protocols/src/modules/indicators/utils/fetchOhlcv.md#ohlcvasset)\>
