[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/modules/tool-marketplace/analytics/collector

# defi/protocols/src/modules/tool-marketplace/analytics/collector

## Classes

### MetricsCollectorService

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/collector.ts:231](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/collector.ts#L231)

Metrics Collector Service
Collects and provides access to marketplace metrics

#### Constructors

##### Constructor

```ts
new MetricsCollectorService(): MetricsCollectorService;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/collector.ts:234](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/collector.ts#L234)

###### Returns

[`MetricsCollectorService`](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/collector.md#metricscollectorservice)

#### Methods

##### getCallMetrics()

```ts
getCallMetrics(
   toolId: string, 
   startTime: number, 
   endTime: number): CallMetrics;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/collector.ts:361](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/collector.ts#L361)

Get call metrics for a tool

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |
| `startTime` | `number` |
| `endTime` | `number` |

###### Returns

[`CallMetrics`](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/collector.md#callmetrics)

##### getChartData()

```ts
getChartData(
   metricName: string, 
   startTime: number, 
   endTime: number, 
   granularity: "day" | "week" | "hour"): {
  date: string;
  value: string;
}[];
```

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/collector.ts:636](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/collector.ts#L636)

Get time series chart data

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `metricName` | `string` | `undefined` |
| `startTime` | `number` | `undefined` |
| `endTime` | `number` | `undefined` |
| `granularity` | `"day"` \| `"week"` \| `"hour"` | `"day"` |

###### Returns

\{
  `date`: `string`;
  `value`: `string`;
\}[]

##### getGeoDistribution()

```ts
getGeoDistribution(toolId: string): GeoDistribution;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/collector.ts:508](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/collector.ts#L508)

Get geographic distribution for a tool

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |

###### Returns

[`GeoDistribution`](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/collector.md#geodistribution)

##### getPeakUsageHours()

```ts
getPeakUsageHours(toolId: string, days: number): number[];
```

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/collector.ts:657](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/collector.ts#L657)

Get peak usage hours

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `toolId` | `string` | `undefined` |
| `days` | `number` | `7` |

###### Returns

`number`[]

##### getPlatformMetrics()

```ts
getPlatformMetrics(startTime: number, endTime: number): {
  activeUsers: number;
  callsChange: string;
  newTools: number;
  revenueChange: string;
  totalCalls: number;
  totalRevenue: string;
};
```

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/collector.ts:564](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/collector.ts#L564)

Get platform-wide metrics

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `startTime` | `number` |
| `endTime` | `number` |

###### Returns

```ts
{
  activeUsers: number;
  callsChange: string;
  newTools: number;
  revenueChange: string;
  totalCalls: number;
  totalRevenue: string;
}
```

| Name | Type | Defined in |
| :------ | :------ | :------ |
| `activeUsers` | `number` | [defi/protocols/src/modules/tool-marketplace/analytics/collector.ts:567](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/collector.ts#L567) |
| `callsChange` | `string` | [defi/protocols/src/modules/tool-marketplace/analytics/collector.ts:569](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/collector.ts#L569) |
| `newTools` | `number` | [defi/protocols/src/modules/tool-marketplace/analytics/collector.ts:568](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/collector.ts#L568) |
| `revenueChange` | `string` | [defi/protocols/src/modules/tool-marketplace/analytics/collector.ts:570](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/collector.ts#L570) |
| `totalCalls` | `number` | [defi/protocols/src/modules/tool-marketplace/analytics/collector.ts:565](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/collector.ts#L565) |
| `totalRevenue` | `string` | [defi/protocols/src/modules/tool-marketplace/analytics/collector.ts:566](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/collector.ts#L566) |

##### getResponseTimeMetrics()

```ts
getResponseTimeMetrics(
   toolId: string, 
   startTime: number, 
   endTime: number): ResponseTimeMetrics;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/collector.ts:446](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/collector.ts#L446)

Get response time metrics for a tool

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |
| `startTime` | `number` |
| `endTime` | `number` |

###### Returns

[`ResponseTimeMetrics`](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/collector.md#responsetimemetrics)

##### getRevenueMetrics()

```ts
getRevenueMetrics(
   toolId: string, 
   startTime: number, 
   endTime: number): RevenueMetrics;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/collector.ts:399](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/collector.ts#L399)

Get revenue metrics for a tool

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |
| `startTime` | `number` |
| `endTime` | `number` |

###### Returns

[`RevenueMetrics`](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/collector.md#revenuemetrics)

##### getUserMetrics()

```ts
getUserMetrics(
   toolId: string, 
   startTime: number, 
   endTime: number): UserMetrics;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/collector.ts:477](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/collector.ts#L477)

Get user metrics for a tool

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |
| `startTime` | `number` |
| `endTime` | `number` |

###### Returns

[`UserMetrics`](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/collector.md#usermetrics)

##### recordCall()

```ts
recordCall(params: {
  amount: string;
  chain: string;
  creatorAddress: `0x${string}`;
  geo?: GeoData;
  responseTime: number;
  success: boolean;
  token: string;
  toolId: string;
  userAddress: `0x${string}`;
}): void;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/collector.ts:251](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/collector.ts#L251)

Record a tool call

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `params` | \{ `amount`: `string`; `chain`: `string`; `creatorAddress`: `` `0x${string}` ``; `geo?`: [`GeoData`](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/collector.md#geodata); `responseTime`: `number`; `success`: `boolean`; `token`: `string`; `toolId`: `string`; `userAddress`: `` `0x${string}` ``; \} |
| `params.amount` | `string` |
| `params.chain` | `string` |
| `params.creatorAddress` | `` `0x${string}` `` |
| `params.geo?` | [`GeoData`](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/collector.md#geodata) |
| `params.responseTime` | `number` |
| `params.success` | `boolean` |
| `params.token` | `string` |
| `params.toolId` | `string` |
| `params.userAddress` | `` `0x${string}` `` |

###### Returns

`void`

##### recordToolRegistration()

```ts
recordToolRegistration(params: {
  category: string;
  creatorAddress: `0x${string}`;
  toolId: string;
}): void;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/collector.ts:343](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/collector.ts#L343)

Record a new tool registration

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `params` | \{ `category`: `string`; `creatorAddress`: `` `0x${string}` ``; `toolId`: `string`; \} |
| `params.category` | `string` |
| `params.creatorAddress` | `` `0x${string}` `` |
| `params.toolId` | `string` |

###### Returns

`void`

##### resetPeriod()

```ts
resetPeriod(): void;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/collector.ts:684](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/collector.ts#L684)

Reset period tracking (call at start of new day)

###### Returns

`void`

## Interfaces

### CallMetrics

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/collector.ts:27](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/collector.ts#L27)

Call metrics for a tool

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="changepercent"></a> `changePercent` | `string` | Calls change percentage from previous period | [defi/protocols/src/modules/tool-marketplace/analytics/collector.ts:37](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/collector.ts#L37) |
| <a id="failedcalls"></a> `failedCalls` | `number` | Failed calls | [defi/protocols/src/modules/tool-marketplace/analytics/collector.ts:33](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/collector.ts#L33) |
| <a id="successfulcalls"></a> `successfulCalls` | `number` | Successful calls | [defi/protocols/src/modules/tool-marketplace/analytics/collector.ts:31](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/collector.ts#L31) |
| <a id="successrate"></a> `successRate` | `number` | Success rate (0-100) | [defi/protocols/src/modules/tool-marketplace/analytics/collector.ts:35](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/collector.ts#L35) |
| <a id="totalcalls"></a> `totalCalls` | `number` | Total call count | [defi/protocols/src/modules/tool-marketplace/analytics/collector.ts:29](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/collector.ts#L29) |

***

### GeoData

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/collector.ts:15](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/collector.ts#L15)

Geographic data for analytics

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="city"></a> `city?` | `string` | City | [defi/protocols/src/modules/tool-marketplace/analytics/collector.ts:21](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/collector.ts#L21) |
| <a id="country"></a> `country` | `string` | Country code (ISO 3166-1 alpha-2) | [defi/protocols/src/modules/tool-marketplace/analytics/collector.ts:17](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/collector.ts#L17) |
| <a id="region"></a> `region?` | `string` | Region/state | [defi/protocols/src/modules/tool-marketplace/analytics/collector.ts:19](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/collector.ts#L19) |

***

### GeoDistribution

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/collector.ts:89](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/collector.ts#L89)

Geographic distribution

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="countries"></a> `countries` | \{ `code`: `string`; `count`: `number`; `name`: `string`; `percentage`: `number`; \}[] | Country breakdown | [defi/protocols/src/modules/tool-marketplace/analytics/collector.ts:91](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/collector.ts#L91) |
| <a id="topregions"></a> `topRegions` | \{ `count`: `number`; `country`: `string`; `region`: `string`; \}[] | Top regions | [defi/protocols/src/modules/tool-marketplace/analytics/collector.ts:98](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/collector.ts#L98) |

***

### ResponseTimeMetrics

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/collector.ts:57](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/collector.ts#L57)

Response time metrics

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="avg"></a> `avg` | `number` | Average response time (ms) | [defi/protocols/src/modules/tool-marketplace/analytics/collector.ts:59](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/collector.ts#L59) |
| <a id="max"></a> `max` | `number` | Maximum response time (ms) | [defi/protocols/src/modules/tool-marketplace/analytics/collector.ts:69](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/collector.ts#L69) |
| <a id="min"></a> `min` | `number` | Minimum response time (ms) | [defi/protocols/src/modules/tool-marketplace/analytics/collector.ts:67](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/collector.ts#L67) |
| <a id="p50"></a> `p50` | `number` | Median response time (ms) | [defi/protocols/src/modules/tool-marketplace/analytics/collector.ts:61](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/collector.ts#L61) |
| <a id="p95"></a> `p95` | `number` | 95th percentile (ms) | [defi/protocols/src/modules/tool-marketplace/analytics/collector.ts:63](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/collector.ts#L63) |
| <a id="p99"></a> `p99` | `number` | 99th percentile (ms) | [defi/protocols/src/modules/tool-marketplace/analytics/collector.ts:65](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/collector.ts#L65) |

***

### RevenueMetrics

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/collector.ts:43](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/collector.ts#L43)

Revenue metrics

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="bychain"></a> `byChain` | `Record`\<`string`, `string`\> | Revenue by chain | [defi/protocols/src/modules/tool-marketplace/analytics/collector.ts:51](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/collector.ts#L51) |
| <a id="bytoken"></a> `byToken` | `Record`\<`string`, `string`\> | Revenue by token | [defi/protocols/src/modules/tool-marketplace/analytics/collector.ts:49](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/collector.ts#L49) |
| <a id="changepercent-1"></a> `changePercent` | `string` | Revenue change percentage | [defi/protocols/src/modules/tool-marketplace/analytics/collector.ts:47](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/collector.ts#L47) |
| <a id="totalrevenue"></a> `totalRevenue` | `string` | Total revenue in USD | [defi/protocols/src/modules/tool-marketplace/analytics/collector.ts:45](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/collector.ts#L45) |

***

### UserMetrics

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/collector.ts:75](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/collector.ts#L75)

User metrics

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="avgcallsperuser"></a> `avgCallsPerUser` | `number` | Average calls per user | [defi/protocols/src/modules/tool-marketplace/analytics/collector.ts:83](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/collector.ts#L83) |
| <a id="newusers"></a> `newUsers` | `number` | New users | [defi/protocols/src/modules/tool-marketplace/analytics/collector.ts:79](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/collector.ts#L79) |
| <a id="returningusers"></a> `returningUsers` | `number` | Returning users | [defi/protocols/src/modules/tool-marketplace/analytics/collector.ts:81](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/collector.ts#L81) |
| <a id="uniqueusers"></a> `uniqueUsers` | `number` | Unique users | [defi/protocols/src/modules/tool-marketplace/analytics/collector.ts:77](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/collector.ts#L77) |

## Variables

### METRIC\_NAMES

```ts
const METRIC_NAMES: {
  CREATOR_REVENUE: "marketplace.creator.revenue";
  CREATOR_TOOLS: "marketplace.creator.tools";
  PLATFORM_ACTIVE_USERS: "marketplace.platform.active_users";
  PLATFORM_NEW_TOOLS: "marketplace.platform.new_tools";
  PLATFORM_TOTAL_CALLS: "marketplace.platform.total_calls";
  PLATFORM_TOTAL_REVENUE: "marketplace.platform.total_revenue";
  TOOL_CALLS: "marketplace.tool.calls";
  TOOL_ERRORS: "marketplace.tool.errors";
  TOOL_RESPONSE_TIME: "marketplace.tool.response_time";
  TOOL_REVENUE: "marketplace.tool.revenue";
};
```

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/collector.ts:108](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/collector.ts#L108)

Metric names for the marketplace

#### Type Declaration

| Name | Type | Default value | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="creator_revenue"></a> `CREATOR_REVENUE` | `"marketplace.creator.revenue"` | `"marketplace.creator.revenue"` | [defi/protocols/src/modules/tool-marketplace/analytics/collector.ts:122](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/collector.ts#L122) |
| <a id="creator_tools"></a> `CREATOR_TOOLS` | `"marketplace.creator.tools"` | `"marketplace.creator.tools"` | [defi/protocols/src/modules/tool-marketplace/analytics/collector.ts:123](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/collector.ts#L123) |
| <a id="platform_active_users"></a> `PLATFORM_ACTIVE_USERS` | `"marketplace.platform.active_users"` | `"marketplace.platform.active_users"` | [defi/protocols/src/modules/tool-marketplace/analytics/collector.ts:118](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/collector.ts#L118) |
| <a id="platform_new_tools"></a> `PLATFORM_NEW_TOOLS` | `"marketplace.platform.new_tools"` | `"marketplace.platform.new_tools"` | [defi/protocols/src/modules/tool-marketplace/analytics/collector.ts:119](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/collector.ts#L119) |
| <a id="platform_total_calls"></a> `PLATFORM_TOTAL_CALLS` | `"marketplace.platform.total_calls"` | `"marketplace.platform.total_calls"` | [defi/protocols/src/modules/tool-marketplace/analytics/collector.ts:116](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/collector.ts#L116) |
| <a id="platform_total_revenue"></a> `PLATFORM_TOTAL_REVENUE` | `"marketplace.platform.total_revenue"` | `"marketplace.platform.total_revenue"` | [defi/protocols/src/modules/tool-marketplace/analytics/collector.ts:117](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/collector.ts#L117) |
| <a id="tool_calls"></a> `TOOL_CALLS` | `"marketplace.tool.calls"` | `"marketplace.tool.calls"` | [defi/protocols/src/modules/tool-marketplace/analytics/collector.ts:110](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/collector.ts#L110) |
| <a id="tool_errors"></a> `TOOL_ERRORS` | `"marketplace.tool.errors"` | `"marketplace.tool.errors"` | [defi/protocols/src/modules/tool-marketplace/analytics/collector.ts:113](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/collector.ts#L113) |
| <a id="tool_response_time"></a> `TOOL_RESPONSE_TIME` | `"marketplace.tool.response_time"` | `"marketplace.tool.response_time"` | [defi/protocols/src/modules/tool-marketplace/analytics/collector.ts:112](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/collector.ts#L112) |
| <a id="tool_revenue"></a> `TOOL_REVENUE` | `"marketplace.tool.revenue"` | `"marketplace.tool.revenue"` | [defi/protocols/src/modules/tool-marketplace/analytics/collector.ts:111](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/collector.ts#L111) |

***

### metricsCollector

```ts
const metricsCollector: MetricsCollectorService;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/collector.ts:692](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/collector.ts#L692)
