[**Universal Crypto MCP API Reference v1.0.0**](../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/modules/ai-predictions/model

# defi/protocols/src/modules/ai-predictions/model

## Classes

### LSTMModel

Defined in: [defi/protocols/src/modules/ai-predictions/model.ts:156](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/model.ts#L156)

LSTM Cryptocurrency Prediction Model
Provides ML-based price predictions for supported assets

#### Constructors

##### Constructor

```ts
new LSTMModel(config: Partial<LSTMConfig>): LSTMModel;
```

Defined in: [defi/protocols/src/modules/ai-predictions/model.ts:160](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/model.ts#L160)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `config` | `Partial`\<[`LSTMConfig`](/docs/api/defi/protocols/src/modules/ai-predictions/model.md#lstmconfig)\> |

###### Returns

[`LSTMModel`](/docs/api/defi/protocols/src/modules/ai-predictions/model.md#lstmmodel)

#### Methods

##### clearCache()

```ts
clearCache(): void;
```

Defined in: [defi/protocols/src/modules/ai-predictions/model.ts:484](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/model.ts#L484)

Clear prediction cache

###### Returns

`void`

##### getModelInfo()

```ts
getModelInfo(): {
  cacheEnabled: boolean;
  endpoint: string;
  version: string;
};
```

Defined in: [defi/protocols/src/modules/ai-predictions/model.ts:492](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/model.ts#L492)

Get model info

###### Returns

```ts
{
  cacheEnabled: boolean;
  endpoint: string;
  version: string;
}
```

| Name | Type | Defined in |
| :------ | :------ | :------ |
| `cacheEnabled` | `boolean` | [defi/protocols/src/modules/ai-predictions/model.ts:492](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/model.ts#L492) |
| `endpoint` | `string` | [defi/protocols/src/modules/ai-predictions/model.ts:492](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/model.ts#L492) |
| `version` | `string` | [defi/protocols/src/modules/ai-predictions/model.ts:492](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/model.ts#L492) |

##### predictConfidence()

```ts
predictConfidence(asset: 
  | "BTC"
  | "ETH"
  | "SOL"
  | "ARB"
  | "AVAX"
  | "MATIC"
  | "LINK"
  | "UNI"
  | "AAVE"
| "OP", timeframe: "1h" | "4h" | "1d" | "1w"): Promise<ConfidencePrediction>;
```

Defined in: [defi/protocols/src/modules/ai-predictions/model.ts:301](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/model.ts#L301)

Get model confidence score

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `asset` | \| `"BTC"` \| `"ETH"` \| `"SOL"` \| `"ARB"` \| `"AVAX"` \| `"MATIC"` \| `"LINK"` \| `"UNI"` \| `"AAVE"` \| `"OP"` |
| `timeframe` | `"1h"` \| `"4h"` \| `"1d"` \| `"1w"` |

###### Returns

`Promise`\<[`ConfidencePrediction`](/docs/api/defi/protocols/src/modules/ai-predictions/types.md#confidenceprediction)\>

##### predictDirection()

```ts
predictDirection(asset: 
  | "BTC"
  | "ETH"
  | "SOL"
  | "ARB"
  | "AVAX"
  | "MATIC"
  | "LINK"
  | "UNI"
  | "AAVE"
| "OP", timeframe: "1h" | "4h" | "1d" | "1w"): Promise<DirectionPrediction>;
```

Defined in: [defi/protocols/src/modules/ai-predictions/model.ts:225](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/model.ts#L225)

Predict price direction (Up/Down/Sideways)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `asset` | \| `"BTC"` \| `"ETH"` \| `"SOL"` \| `"ARB"` \| `"AVAX"` \| `"MATIC"` \| `"LINK"` \| `"UNI"` \| `"AAVE"` \| `"OP"` |
| `timeframe` | `"1h"` \| `"4h"` \| `"1d"` \| `"1w"` |

###### Returns

`Promise`\<[`DirectionPrediction`](/docs/api/defi/protocols/src/modules/ai-predictions/types.md#directionprediction)\>

##### predictFull()

```ts
predictFull(asset: 
  | "BTC"
  | "ETH"
  | "SOL"
  | "ARB"
  | "AVAX"
  | "MATIC"
  | "LINK"
  | "UNI"
  | "AAVE"
| "OP", timeframe: "1h" | "4h" | "1d" | "1w"): Promise<FullPrediction>;
```

Defined in: [defi/protocols/src/modules/ai-predictions/model.ts:343](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/model.ts#L343)

Get full prediction report

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `asset` | \| `"BTC"` \| `"ETH"` \| `"SOL"` \| `"ARB"` \| `"AVAX"` \| `"MATIC"` \| `"LINK"` \| `"UNI"` \| `"AAVE"` \| `"OP"` |
| `timeframe` | `"1h"` \| `"4h"` \| `"1d"` \| `"1w"` |

###### Returns

`Promise`\<[`FullPrediction`](/docs/api/defi/protocols/src/modules/ai-predictions/types.md#fullprediction)\>

##### predictTarget()

```ts
predictTarget(asset: 
  | "BTC"
  | "ETH"
  | "SOL"
  | "ARB"
  | "AVAX"
  | "MATIC"
  | "LINK"
  | "UNI"
  | "AAVE"
| "OP", timeframe: "1h" | "4h" | "1d" | "1w"): Promise<TargetPrediction>;
```

Defined in: [defi/protocols/src/modules/ai-predictions/model.ts:254](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/model.ts#L254)

Predict specific price target

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `asset` | \| `"BTC"` \| `"ETH"` \| `"SOL"` \| `"ARB"` \| `"AVAX"` \| `"MATIC"` \| `"LINK"` \| `"UNI"` \| `"AAVE"` \| `"OP"` |
| `timeframe` | `"1h"` \| `"4h"` \| `"1d"` \| `"1w"` |

###### Returns

`Promise`\<[`TargetPrediction`](/docs/api/defi/protocols/src/modules/ai-predictions/types.md#targetprediction)\>

##### runBacktest()

```ts
runBacktest(request: BacktestRequest): Promise<BacktestResult>;
```

Defined in: [defi/protocols/src/modules/ai-predictions/model.ts:421](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/model.ts#L421)

Run backtesting on historical data

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `request` | [`BacktestRequest`](/docs/api/defi/protocols/src/modules/ai-predictions/types.md#backtestrequest) |

###### Returns

`Promise`\<[`BacktestResult`](/docs/api/defi/protocols/src/modules/ai-predictions/types.md#backtestresult)\>

## Interfaces

### LSTMConfig

Defined in: [defi/protocols/src/modules/ai-predictions/model.ts:31](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/model.ts#L31)

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="apiendpoint"></a> `apiEndpoint` | `string` | Model API endpoint (FastAPI backend) | [defi/protocols/src/modules/ai-predictions/model.ts:33](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/model.ts#L33) |
| <a id="apikey"></a> `apiKey?` | `string` | API key for authentication | [defi/protocols/src/modules/ai-predictions/model.ts:35](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/model.ts#L35) |
| <a id="cachettl"></a> `cacheTtl` | `number` | Cache TTL in seconds | [defi/protocols/src/modules/ai-predictions/model.ts:43](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/model.ts#L43) |
| <a id="enablecache"></a> `enableCache` | `boolean` | Enable caching | [defi/protocols/src/modules/ai-predictions/model.ts:41](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/model.ts#L41) |
| <a id="modelversion"></a> `modelVersion` | `string` | Model version | [defi/protocols/src/modules/ai-predictions/model.ts:37](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/model.ts#L37) |
| <a id="timeout"></a> `timeout` | `number` | Request timeout in ms | [defi/protocols/src/modules/ai-predictions/model.ts:39](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/model.ts#L39) |

***

### ModelPrediction

Defined in: [defi/protocols/src/modules/ai-predictions/model.ts:59](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/model.ts#L59)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="confidence"></a> `confidence` | `number` | [defi/protocols/src/modules/ai-predictions/model.ts:62](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/model.ts#L62) |
| <a id="direction"></a> `direction` | [`PriceDirection`](/docs/api/defi/protocols/src/modules/ai-predictions/types.md#pricedirection) | [defi/protocols/src/modules/ai-predictions/model.ts:61](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/model.ts#L61) |
| <a id="features"></a> `features` | \{ `ema_long`: `number`; `ema_short`: `number`; `macd`: `number`; `macd_signal`: `number`; `rsi`: `number`; `volatility`: `number`; `volume_ratio`: `number`; \} | [defi/protocols/src/modules/ai-predictions/model.ts:63](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/model.ts#L63) |
| `features.ema_long` | `number` | [defi/protocols/src/modules/ai-predictions/model.ts:68](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/model.ts#L68) |
| `features.ema_short` | `number` | [defi/protocols/src/modules/ai-predictions/model.ts:67](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/model.ts#L67) |
| `features.macd` | `number` | [defi/protocols/src/modules/ai-predictions/model.ts:65](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/model.ts#L65) |
| `features.macd_signal` | `number` | [defi/protocols/src/modules/ai-predictions/model.ts:66](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/model.ts#L66) |
| `features.rsi` | `number` | [defi/protocols/src/modules/ai-predictions/model.ts:64](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/model.ts#L64) |
| `features.volatility` | `number` | [defi/protocols/src/modules/ai-predictions/model.ts:70](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/model.ts#L70) |
| `features.volume_ratio` | `number` | [defi/protocols/src/modules/ai-predictions/model.ts:69](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/model.ts#L69) |
| <a id="predicted_price"></a> `predicted_price` | `number` | [defi/protocols/src/modules/ai-predictions/model.ts:60](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/model.ts#L60) |
