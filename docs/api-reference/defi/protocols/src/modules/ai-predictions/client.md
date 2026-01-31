[**Universal Crypto MCP API Reference v1.0.0**](../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/modules/ai-predictions/client

# defi/protocols/src/modules/ai-predictions/client

## Classes

### PredictionClient

Defined in: [defi/protocols/src/modules/ai-predictions/client.ts:70](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/client.ts#L70)

x402-enabled AI Prediction Client
Provides ML predictions with automatic micropayments

#### Constructors

##### Constructor

```ts
new PredictionClient(config: Partial<PredictionClientConfig>): PredictionClient;
```

Defined in: [defi/protocols/src/modules/ai-predictions/client.ts:77](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/client.ts#L77)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `config` | `Partial`\<[`PredictionClientConfig`](/docs/api/defi/protocols/src/modules/ai-predictions/client.md#predictionclientconfig)\> |

###### Returns

[`PredictionClient`](/docs/api/defi/protocols/src/modules/ai-predictions/client.md#predictionclient)

#### Methods

##### clearCache()

```ts
clearCache(): void;
```

Defined in: [defi/protocols/src/modules/ai-predictions/client.ts:319](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/client.ts#L319)

Clear model cache

###### Returns

`void`

##### getPrice()

```ts
getPrice(type: 
  | "full"
  | "direction"
  | "target"
  | "confidence"
  | "backtest"
  | "bulk_per_asset"
  | "maas_monthly"): number;
```

Defined in: [defi/protocols/src/modules/ai-predictions/client.ts:140](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/client.ts#L140)

Get price for a prediction type

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `type` | \| `"full"` \| `"direction"` \| `"target"` \| `"confidence"` \| `"backtest"` \| `"bulk_per_asset"` \| `"maas_monthly"` |

###### Returns

`number`

##### getPricing()

```ts
getPricing(): {
  backtest: 0.5;
  bulk_per_asset: 0.01;
  confidence: 0.02;
  direction: 0.01;
  full: 0.1;
  maas_monthly: 10;
  target: 0.05;
};
```

Defined in: [defi/protocols/src/modules/ai-predictions/client.ts:305](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/client.ts#L305)

Get pricing information

###### Returns

| Name | Type | Default value | Description | Defined in |
| :------ | :------ | :------ | :------ | :------ |
| `backtest` | `0.5` | `0.50` | Backtesting service | [defi/protocols/src/modules/ai-predictions/types.ts:25](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L25) |
| `bulk_per_asset` | `0.01` | `0.01` | Multi-asset bulk (per asset) | [defi/protocols/src/modules/ai-predictions/types.ts:27](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L27) |
| `confidence` | `0.02` | `0.02` | Model confidence score | [defi/protocols/src/modules/ai-predictions/types.ts:21](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L21) |
| `direction` | `0.01` | `0.01` | Up/Down/Sideways prediction | [defi/protocols/src/modules/ai-predictions/types.ts:17](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L17) |
| `full` | `0.1` | `0.10` | Full report with analysis | [defi/protocols/src/modules/ai-predictions/types.ts:23](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L23) |
| `maas_monthly` | `10` | `10.00` | Model-as-a-Service monthly | [defi/protocols/src/modules/ai-predictions/types.ts:29](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L29) |
| `target` | `0.05` | `0.05` | Specific price target | [defi/protocols/src/modules/ai-predictions/types.ts:19](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/types.ts#L19) |

##### getStats()

```ts
getStats(): {
  averageCost: number;
  paymentsEnabled: boolean;
  predictionCount: number;
  totalSpent: number;
};
```

Defined in: [defi/protocols/src/modules/ai-predictions/client.ts:287](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/client.ts#L287)

Get client statistics

###### Returns

```ts
{
  averageCost: number;
  paymentsEnabled: boolean;
  predictionCount: number;
  totalSpent: number;
}
```

| Name | Type | Defined in |
| :------ | :------ | :------ |
| `averageCost` | `number` | [defi/protocols/src/modules/ai-predictions/client.ts:290](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/client.ts#L290) |
| `paymentsEnabled` | `boolean` | [defi/protocols/src/modules/ai-predictions/client.ts:291](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/client.ts#L291) |
| `predictionCount` | `number` | [defi/protocols/src/modules/ai-predictions/client.ts:289](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/client.ts#L289) |
| `totalSpent` | `number` | [defi/protocols/src/modules/ai-predictions/client.ts:288](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/client.ts#L288) |

##### getSupportedAssets()

```ts
getSupportedAssets(): readonly (
  | "BTC"
  | "ETH"
  | "SOL"
  | "ARB"
  | "AVAX"
  | "MATIC"
  | "LINK"
  | "UNI"
  | "AAVE"
  | "OP")[];
```

Defined in: [defi/protocols/src/modules/ai-predictions/client.ts:312](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/client.ts#L312)

Get supported assets

###### Returns

readonly (
  \| `"BTC"`
  \| `"ETH"`
  \| `"SOL"`
  \| `"ARB"`
  \| `"AVAX"`
  \| `"MATIC"`
  \| `"LINK"`
  \| `"UNI"`
  \| `"AAVE"`
  \| `"OP"`)[]

##### predict()

```ts
predict(asset: 
  | "BTC"
  | "ETH"
  | "SOL"
  | "ARB"
  | "AVAX"
  | "MATIC"
  | "LINK"
  | "UNI"
  | "AAVE"
  | "OP", params: {
  timeframe: "1h" | "4h" | "1d" | "1w";
  type: "full" | "direction" | "target" | "confidence";
}): Promise<
  | DirectionPrediction
  | TargetPrediction
  | ConfidencePrediction
  | FullPrediction & {
  payment?: PaymentReceipt;
}>;
```

Defined in: [defi/protocols/src/modules/ai-predictions/client.ts:212](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/client.ts#L212)

Unified predict method - route to appropriate prediction type
Auto-pays via x402: $0.01-$0.10 depending on type

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `asset` | \| `"BTC"` \| `"ETH"` \| `"SOL"` \| `"ARB"` \| `"AVAX"` \| `"MATIC"` \| `"LINK"` \| `"UNI"` \| `"AAVE"` \| `"OP"` |
| `params` | \{ `timeframe`: `"1h"` \| `"4h"` \| `"1d"` \| `"1w"`; `type`: `"full"` \| `"direction"` \| `"target"` \| `"confidence"`; \} |
| `params.timeframe` | `"1h"` \| `"4h"` \| `"1d"` \| `"1w"` |
| `params.type` | `"full"` \| `"direction"` \| `"target"` \| `"confidence"` |

###### Returns

`Promise`\<
  \| [`DirectionPrediction`](/docs/api/defi/protocols/src/modules/ai-predictions/types.md#directionprediction)
  \| [`TargetPrediction`](/docs/api/defi/protocols/src/modules/ai-predictions/types.md#targetprediction)
  \| [`ConfidencePrediction`](/docs/api/defi/protocols/src/modules/ai-predictions/types.md#confidenceprediction)
  \| [`FullPrediction`](/docs/api/defi/protocols/src/modules/ai-predictions/types.md#fullprediction) & \{
  `payment?`: [`PaymentReceipt`](/docs/api/defi/protocols/src/modules/ai-predictions/types.md#paymentreceipt);
\}\>

##### predictBulk()

```ts
predictBulk(request: BulkPredictionRequest): Promise<BulkPredictionResponse & {
  payment?: PaymentReceipt;
}>;
```

Defined in: [defi/protocols/src/modules/ai-predictions/client.ts:234](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/client.ts#L234)

Bulk predictions for multiple assets
Cost: $0.01 per asset per prediction

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `request` | [`BulkPredictionRequest`](/docs/api/defi/protocols/src/modules/ai-predictions/types.md#bulkpredictionrequest) |

###### Returns

`Promise`\<[`BulkPredictionResponse`](/docs/api/defi/protocols/src/modules/ai-predictions/types.md#bulkpredictionresponse) & \{
  `payment?`: [`PaymentReceipt`](/docs/api/defi/protocols/src/modules/ai-predictions/types.md#paymentreceipt);
\}\>

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
  | "OP", timeframe: "1h" | "4h" | "1d" | "1w"): Promise<ConfidencePrediction & {
  payment?: PaymentReceipt;
}>;
```

Defined in: [defi/protocols/src/modules/ai-predictions/client.ts:180](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/client.ts#L180)

Get model confidence score
Cost: $0.02

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `asset` | \| `"BTC"` \| `"ETH"` \| `"SOL"` \| `"ARB"` \| `"AVAX"` \| `"MATIC"` \| `"LINK"` \| `"UNI"` \| `"AAVE"` \| `"OP"` |
| `timeframe` | `"1h"` \| `"4h"` \| `"1d"` \| `"1w"` |

###### Returns

`Promise`\<[`ConfidencePrediction`](/docs/api/defi/protocols/src/modules/ai-predictions/types.md#confidenceprediction) & \{
  `payment?`: [`PaymentReceipt`](/docs/api/defi/protocols/src/modules/ai-predictions/types.md#paymentreceipt);
\}\>

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
  | "OP", timeframe: "1h" | "4h" | "1d" | "1w"): Promise<DirectionPrediction & {
  payment?: PaymentReceipt;
}>;
```

Defined in: [defi/protocols/src/modules/ai-predictions/client.ts:148](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/client.ts#L148)

Predict price direction (Up/Down/Sideways)
Cost: $0.01

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `asset` | \| `"BTC"` \| `"ETH"` \| `"SOL"` \| `"ARB"` \| `"AVAX"` \| `"MATIC"` \| `"LINK"` \| `"UNI"` \| `"AAVE"` \| `"OP"` |
| `timeframe` | `"1h"` \| `"4h"` \| `"1d"` \| `"1w"` |

###### Returns

`Promise`\<[`DirectionPrediction`](/docs/api/defi/protocols/src/modules/ai-predictions/types.md#directionprediction) & \{
  `payment?`: [`PaymentReceipt`](/docs/api/defi/protocols/src/modules/ai-predictions/types.md#paymentreceipt);
\}\>

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
  | "OP", timeframe: "1h" | "4h" | "1d" | "1w"): Promise<FullPrediction & {
  payment?: PaymentReceipt;
}>;
```

Defined in: [defi/protocols/src/modules/ai-predictions/client.ts:196](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/client.ts#L196)

Get full prediction report
Cost: $0.10

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `asset` | \| `"BTC"` \| `"ETH"` \| `"SOL"` \| `"ARB"` \| `"AVAX"` \| `"MATIC"` \| `"LINK"` \| `"UNI"` \| `"AAVE"` \| `"OP"` |
| `timeframe` | `"1h"` \| `"4h"` \| `"1d"` \| `"1w"` |

###### Returns

`Promise`\<[`FullPrediction`](/docs/api/defi/protocols/src/modules/ai-predictions/types.md#fullprediction) & \{
  `payment?`: [`PaymentReceipt`](/docs/api/defi/protocols/src/modules/ai-predictions/types.md#paymentreceipt);
\}\>

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
  | "OP", timeframe: "1h" | "4h" | "1d" | "1w"): Promise<TargetPrediction & {
  payment?: PaymentReceipt;
}>;
```

Defined in: [defi/protocols/src/modules/ai-predictions/client.ts:164](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/client.ts#L164)

Predict specific price target
Cost: $0.05

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `asset` | \| `"BTC"` \| `"ETH"` \| `"SOL"` \| `"ARB"` \| `"AVAX"` \| `"MATIC"` \| `"LINK"` \| `"UNI"` \| `"AAVE"` \| `"OP"` |
| `timeframe` | `"1h"` \| `"4h"` \| `"1d"` \| `"1w"` |

###### Returns

`Promise`\<[`TargetPrediction`](/docs/api/defi/protocols/src/modules/ai-predictions/types.md#targetprediction) & \{
  `payment?`: [`PaymentReceipt`](/docs/api/defi/protocols/src/modules/ai-predictions/types.md#paymentreceipt);
\}\>

##### runBacktest()

```ts
runBacktest(request: BacktestRequest): Promise<BacktestResult & {
  payment?: PaymentReceipt;
}>;
```

Defined in: [defi/protocols/src/modules/ai-predictions/client.ts:273](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/client.ts#L273)

Run backtesting on historical data
Cost: $0.50

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `request` | [`BacktestRequest`](/docs/api/defi/protocols/src/modules/ai-predictions/types.md#backtestrequest) |

###### Returns

`Promise`\<[`BacktestResult`](/docs/api/defi/protocols/src/modules/ai-predictions/types.md#backtestresult) & \{
  `payment?`: [`PaymentReceipt`](/docs/api/defi/protocols/src/modules/ai-predictions/types.md#paymentreceipt);
\}\>

## Interfaces

### PredictionClientConfig

Defined in: [defi/protocols/src/modules/ai-predictions/client.ts:35](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/client.ts#L35)

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="apiendpoint"></a> `apiEndpoint` | `string` | Prediction service API endpoint | [defi/protocols/src/modules/ai-predictions/client.ts:37](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/client.ts#L37) |
| <a id="debug"></a> `debug` | `boolean` | Debug mode | [defi/protocols/src/modules/ai-predictions/client.ts:49](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/client.ts#L49) |
| <a id="enablepayments"></a> `enablePayments` | `boolean` | Enable x402 payments | [defi/protocols/src/modules/ai-predictions/client.ts:45](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/client.ts#L45) |
| <a id="maxpaymentperrequest"></a> `maxPaymentPerRequest` | `number` | Max payment per request (USD) | [defi/protocols/src/modules/ai-predictions/client.ts:47](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/client.ts#L47) |
| <a id="network"></a> `network` | `"ethereum"` \| `"base"` \| `"arbitrum"` | x402 payment network | [defi/protocols/src/modules/ai-predictions/client.ts:41](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/client.ts#L41) |
| <a id="recipientaddress"></a> `recipientAddress` | `string` | x402 payment recipient address | [defi/protocols/src/modules/ai-predictions/client.ts:39](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/client.ts#L39) |
| <a id="token"></a> `token` | `"USDC"` \| `"USDs"` | x402 payment token | [defi/protocols/src/modules/ai-predictions/client.ts:43](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/client.ts#L43) |

## Functions

### getDefaultPredictionClient()

```ts
function getDefaultPredictionClient(): PredictionClient;
```

Defined in: [defi/protocols/src/modules/ai-predictions/client.ts:333](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/client.ts#L333)

Get or create default prediction client

#### Returns

[`PredictionClient`](/docs/api/defi/protocols/src/modules/ai-predictions/client.md#predictionclient)

***

### resetPredictionClient()

```ts
function resetPredictionClient(): void;
```

Defined in: [defi/protocols/src/modules/ai-predictions/client.ts:343](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/ai-predictions/client.ts#L343)

Reset default prediction client

#### Returns

`void`
