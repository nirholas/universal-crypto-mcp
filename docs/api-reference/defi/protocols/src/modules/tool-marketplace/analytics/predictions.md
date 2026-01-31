[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/modules/tool-marketplace/analytics/predictions

# defi/protocols/src/modules/tool-marketplace/analytics/predictions

## Classes

### PredictiveAnalyticsService

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts:253](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts#L253)

Predictive Analytics Service

#### Constructors

##### Constructor

```ts
new PredictiveAnalyticsService(): PredictiveAnalyticsService;
```

###### Returns

[`PredictiveAnalyticsService`](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/predictions.md#predictiveanalyticsservice)

#### Methods

##### forecastRevenue()

```ts
forecastRevenue(toolId?: string, days?: number): Promise<RevenueForecast>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts:292](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts#L292)

Forecast revenue for a tool or the entire platform

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `toolId?` | `string` | `undefined` |
| `days?` | `number` | `30` |

###### Returns

`Promise`\<[`RevenueForecast`](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/predictions.md#revenueforecast)\>

##### predictChurn()

```ts
predictChurn(toolId?: string, limit?: number): Promise<ChurnPrediction[]>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts:400](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts#L400)

Predict churn risk for users

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `toolId?` | `string` | `undefined` |
| `limit?` | `number` | `50` |

###### Returns

`Promise`\<[`ChurnPrediction`](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/predictions.md#churnprediction)[]\>

##### predictDemand()

```ts
predictDemand(limit: number): Promise<DemandPrediction[]>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts:497](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts#L497)

Predict demand growth for tools

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `limit` | `number` | `20` |

###### Returns

`Promise`\<[`DemandPrediction`](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/predictions.md#demandprediction)[]\>

##### suggestPricing()

```ts
suggestPricing(toolId: string): Promise<PricingOptimization>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts:591](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts#L591)

Get pricing optimization suggestions

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |

###### Returns

`Promise`\<[`PricingOptimization`](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/predictions.md#pricingoptimization)\>

##### trackUserActivity()

```ts
trackUserActivity(
   userAddress: `0x${string}`, 
   toolId: string, 
   amount: number, 
   timestamp: number): void;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts:257](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts#L257)

Track user activity for churn prediction

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `userAddress` | `` `0x${string}` `` |
| `toolId` | `string` |
| `amount` | `number` |
| `timestamp` | `number` |

###### Returns

`void`

## Interfaces

### ChurnPrediction

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts:53](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts#L53)

Churn prediction for a user

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="activitytrend"></a> `activityTrend` | `"stable"` \| `"increasing"` \| `"decreasing"` | Activity trend | [defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts:63](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts#L63) |
| <a id="churnprobability"></a> `churnProbability` | `number` | Churn probability (0-100) | [defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts:57](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts#L57) |
| <a id="dayssincelastactivity"></a> `daysSinceLastActivity` | `number` | Days since last activity | [defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts:61](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts#L61) |
| <a id="recommendedactions"></a> `recommendedActions` | `string`[] | Recommended retention actions | [defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts:67](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts#L67) |
| <a id="revenueatrisk"></a> `revenueAtRisk` | `string` | Estimated revenue at risk | [defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts:69](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts#L69) |
| <a id="risklevel"></a> `riskLevel` | `"low"` \| `"medium"` \| `"high"` \| `"critical"` | Risk level | [defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts:59](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts#L59) |
| <a id="risksignals"></a> `riskSignals` | `string`[] | Signals indicating churn risk | [defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts:65](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts#L65) |
| <a id="useraddress"></a> `userAddress` | `` `0x${string}` `` | User address | [defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts:55](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts#L55) |

***

### DemandPrediction

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts:75](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts#L75)

Demand prediction for a tool

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="blockers"></a> `blockers` | `string`[] | Potential blockers | [defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts:91](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts#L91) |
| <a id="currentweeklycalls"></a> `currentWeeklyCalls` | `number` | Current weekly calls | [defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts:85](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts#L85) |
| <a id="growthprobability"></a> `growthProbability` | `number` | Growth probability (0-100) | [defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts:81](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts#L81) |
| <a id="growthsignals"></a> `growthSignals` | `string`[] | Growth signals | [defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts:89](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts#L89) |
| <a id="opportunityscore"></a> `opportunityScore` | `number` | Market opportunity score (0-100) | [defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts:93](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts#L93) |
| <a id="predictedgrowthrate"></a> `predictedGrowthRate` | `string` | Predicted growth rate | [defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts:83](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts#L83) |
| <a id="predictedweeklycalls"></a> `predictedWeeklyCalls` | `number` | Predicted weekly calls (next week) | [defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts:87](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts#L87) |
| <a id="toolid"></a> `toolId` | `string` | Tool ID | [defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts:77](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts#L77) |
| <a id="toolname"></a> `toolName` | `string` | Tool name | [defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts:79](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts#L79) |

***

### PricingOptimization

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts:99](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts#L99)

Pricing optimization suggestion

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="competitorcontext"></a> `competitorContext` | \{ `avgPrice`: `string`; `maxPrice`: `string`; `minPrice`: `string`; \} | Competitor context | [defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts:115](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts#L115) |
| `competitorContext.avgPrice` | `string` | - | [defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts:116](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts#L116) |
| `competitorContext.maxPrice` | `string` | - | [defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts:118](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts#L118) |
| `competitorContext.minPrice` | `string` | - | [defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts:117](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts#L117) |
| <a id="confidence"></a> `confidence` | `number` | Confidence | [defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts:111](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts#L111) |
| <a id="currentprice"></a> `currentPrice` | `string` | Current price | [defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts:103](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts#L103) |
| <a id="expectedrevenuechange"></a> `expectedRevenueChange` | `string` | Expected revenue change | [defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts:107](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts#L107) |
| <a id="priceelasticity"></a> `priceElasticity` | `number` | Price elasticity estimate | [defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts:109](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts#L109) |
| <a id="rationale"></a> `rationale` | `string`[] | Rationale | [defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts:113](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts#L113) |
| <a id="suggestedprice"></a> `suggestedPrice` | `string` | Suggested price | [defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts:105](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts#L105) |
| <a id="toolid-1"></a> `toolId` | `string` | Tool ID | [defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts:101](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts#L101) |

***

### RevenueForecast

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts:18](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts#L18)

Revenue forecast result

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="confidence-1"></a> `confidence` | `number` | Confidence level (0-100) | [defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts:34](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts#L34) |
| <a id="currentrunrate"></a> `currentRunRate` | `string` | Current revenue run rate | [defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts:26](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts#L26) |
| <a id="dailyforecast"></a> `dailyForecast` | \{ `date`: `string`; `high`: `string`; `low`: `string`; `mid`: `string`; \}[] | Daily forecasts | [defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts:40](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts#L40) |
| <a id="factors"></a> `factors` | `string`[] | Factors affecting forecast | [defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts:47](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts#L47) |
| <a id="forecast"></a> `forecast` | \{ `high`: `string`; `low`: `string`; `mid`: `string`; \} | Forecasted revenue | [defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts:28](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts#L28) |
| `forecast.high` | `string` | - | [defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts:31](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts#L31) |
| `forecast.low` | `string` | - | [defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts:29](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts#L29) |
| `forecast.mid` | `string` | - | [defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts:30](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts#L30) |
| <a id="period"></a> `period` | \{ `days`: `number`; `end`: `number`; `start`: `number`; \} | Forecast period | [defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts:20](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts#L20) |
| `period.days` | `number` | - | [defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts:23](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts#L23) |
| `period.end` | `number` | - | [defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts:22](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts#L22) |
| `period.start` | `number` | - | [defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts:21](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts#L21) |
| <a id="trend"></a> `trend` | `"growing"` \| `"stable"` \| `"declining"` | Trend direction | [defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts:36](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts#L36) |
| <a id="trendstrength"></a> `trendStrength` | `number` | Trend strength (-100 to 100) | [defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts:38](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts#L38) |

## Variables

### predictiveAnalytics

```ts
const predictiveAnalytics: PredictiveAnalyticsService;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts:737](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/predictions.ts#L737)
