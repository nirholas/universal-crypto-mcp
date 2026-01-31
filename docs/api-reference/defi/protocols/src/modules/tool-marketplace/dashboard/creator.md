[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/modules/tool-marketplace/dashboard/creator

# defi/protocols/src/modules/tool-marketplace/dashboard/creator

## Classes

### CreatorInsightsService

Defined in: [defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts:264](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts#L264)

Creator Insights Service

#### Constructors

##### Constructor

```ts
new CreatorInsightsService(): CreatorInsightsService;
```

###### Returns

[`CreatorInsightsService`](/docs/api/defi/protocols/src/modules/tool-marketplace/dashboard/creator.md#creatorinsightsservice)

#### Methods

##### getCreatorDashboard()

```ts
getCreatorDashboard(creatorAddress: `0x${string}`, periodDays: number): Promise<CreatorDashboard>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts:334](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts#L334)

Get full creator dashboard

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `creatorAddress` | `` `0x${string}` `` | `undefined` |
| `periodDays` | `number` | `30` |

###### Returns

`Promise`\<[`CreatorDashboard`](/docs/api/defi/protocols/src/modules/tool-marketplace/dashboard/creator.md#creatordashboard)\>

##### getToolInsights()

```ts
getToolInsights(toolId: string, periodDays: number): Promise<ToolInsights>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts:500](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts#L500)

Get deep insights for a specific tool

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `toolId` | `string` | `undefined` |
| `periodDays` | `number` | `30` |

###### Returns

`Promise`\<[`ToolInsights`](/docs/api/defi/protocols/src/modules/tool-marketplace/dashboard/creator.md#toolinsights)\>

##### getUsageHeatmap()

```ts
getUsageHeatmap(toolId: string, days: number): Promise<UsageHeatmap>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts:630](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts#L630)

Get usage heatmap

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `toolId` | `string` | `undefined` |
| `days` | `number` | `7` |

###### Returns

`Promise`\<[`UsageHeatmap`](/docs/api/defi/protocols/src/modules/tool-marketplace/dashboard/creator.md#usageheatmap)\>

##### trackUserActivity()

```ts
trackUserActivity(
   toolId: string, 
   userAddress: `0x${string}`, 
   revenue: number, 
   timestamp: number): void;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts:268](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts#L268)

Track user activity for retention analysis

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |
| `userAddress` | `` `0x${string}` `` |
| `revenue` | `number` |
| `timestamp` | `number` |

###### Returns

`void`

## Interfaces

### CreatorDashboard

Defined in: [defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts:84](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts#L84)

Full creator dashboard

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="avgrating"></a> `avgRating` | `number` | Average rating across tools | [defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts:108](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts#L108) |
| <a id="callschart"></a> `callsChart` | [`TimeSeriesData`](/docs/api/defi/protocols/src/modules/tool-marketplace/dashboard/creator.md#timeseriesdata) | Calls chart data | [defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts:114](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts#L114) |
| <a id="creatoraddress"></a> `creatorAddress` | `` `0x${string}` `` | Creator address | [defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts:86](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts#L86) |
| <a id="geographicbreakdown"></a> `geographicBreakdown` | [`GeoDistribution`](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/collector.md#geodistribution) | Geographic breakdown | [defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts:116](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts#L116) |
| <a id="newusers"></a> `newUsers` | `number` | New users in period | [defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts:106](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts#L106) |
| <a id="peakusagehours"></a> `peakUsageHours` | `number`[] | Peak usage hours (UTC) | [defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts:118](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts#L118) |
| <a id="performance"></a> `performance` | [`ResponseTimeMetrics`](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/collector.md#responsetimemetrics) | Response time metrics | [defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts:122](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts#L122) |
| <a id="period"></a> `period` | \{ `end`: `number`; `label`: `string`; `start`: `number`; \} | Dashboard period | [defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts:88](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts#L88) |
| `period.end` | `number` | - | [defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts:90](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts#L90) |
| `period.label` | `string` | - | [defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts:91](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts#L91) |
| `period.start` | `number` | - | [defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts:89](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts#L89) |
| <a id="periodcalls"></a> `periodCalls` | `number` | Calls in current period | [defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts:102](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts#L102) |
| <a id="periodrevenue"></a> `periodRevenue` | `string` | Revenue in current period | [defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts:96](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts#L96) |
| <a id="revenuechange24h"></a> `revenueChange24h` | `string` | Revenue change from previous period | [defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts:98](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts#L98) |
| <a id="revenuechart"></a> `revenueChart` | [`TimeSeriesData`](/docs/api/defi/protocols/src/modules/tool-marketplace/dashboard/creator.md#timeseriesdata) | Revenue chart data | [defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts:112](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts#L112) |
| <a id="toptools"></a> `topTools` | [`ToolPerformance`](/docs/api/defi/protocols/src/modules/tool-marketplace/dashboard/creator.md#toolperformance)[] | Top performing tools | [defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts:110](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts#L110) |
| <a id="totalcalls"></a> `totalCalls` | `number` | Total calls all time | [defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts:100](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts#L100) |
| <a id="totalrevenue"></a> `totalRevenue` | `string` | Total revenue all time | [defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts:94](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts#L94) |
| <a id="uniqueusers"></a> `uniqueUsers` | `number` | Unique users all time | [defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts:104](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts#L104) |
| <a id="userretention"></a> `userRetention` | [`RetentionCohort`](/docs/api/defi/protocols/src/modules/tool-marketplace/dashboard/creator.md#retentioncohort)[] | User retention cohorts | [defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts:120](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts#L120) |

***

### RetentionCohort

Defined in: [defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts:65](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts#L65)

User retention cohort

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="cohortdate"></a> `cohortDate` | `string` | Cohort start date | [defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts:67](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts#L67) |
| <a id="cohortsize"></a> `cohortSize` | `number` | Users in cohort | [defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts:69](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts#L69) |
| <a id="retention"></a> `retention` | \{ `percentage`: `number`; `period`: `string`; `retained`: `number`; \}[] | Retention by period | [defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts:71](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts#L71) |

***

### TimeSeriesData

Defined in: [defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts:50](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts#L50)

Time series data for charts

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="data"></a> `data` | \{ `date`: `string`; `value`: `string`; \}[] | Data points | [defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts:52](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts#L52) |
| <a id="granularity"></a> `granularity` | `"day"` \| `"week"` \| `"hour"` | Granularity | [defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts:59](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts#L59) |
| <a id="period-1"></a> `period` | `string` | Period label | [defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts:57](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts#L57) |

***

### ToolInsights

Defined in: [defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts:128](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts#L128)

Tool deep-dive insights

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="description"></a> `description` | `string` | Tool description | [defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts:136](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts#L136) |
| <a id="displayname"></a> `displayName` | `string` | Display name | [defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts:134](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts#L134) |
| <a id="geography"></a> `geography` | [`GeoDistribution`](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/collector.md#geodistribution) | Geographic distribution | [defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts:186](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts#L186) |
| <a id="name"></a> `name` | `string` | Tool name | [defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts:132](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts#L132) |
| <a id="performance-1"></a> `performance` | \{ `avgResponseTime`: `number`; `p50`: `number`; `p95`: `number`; `p99`: `number`; `uptime`: `number`; \} | Performance metrics | [defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts:178](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts#L178) |
| `performance.avgResponseTime` | `number` | - | [defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts:179](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts#L179) |
| `performance.p50` | `number` | - | [defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts:180](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts#L180) |
| `performance.p95` | `number` | - | [defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts:181](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts#L181) |
| `performance.p99` | `number` | - | [defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts:182](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts#L182) |
| `performance.uptime` | `number` | - | [defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts:183](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts#L183) |
| <a id="period-2"></a> `period` | \{ `end`: `number`; `label`: `string`; `start`: `number`; \} | Period for metrics | [defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts:142](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts#L142) |
| `period.end` | `number` | - | [defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts:144](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts#L144) |
| `period.label` | `string` | - | [defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts:145](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts#L145) |
| `period.start` | `number` | - | [defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts:143](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts#L143) |
| <a id="rating"></a> `rating` | \{ `average`: `number`; `count`: `number`; `distribution`: `Record`\<`number`, `number`\>; \} | User rating | [defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts:188](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts#L188) |
| `rating.average` | `number` | - | [defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts:189](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts#L189) |
| `rating.count` | `number` | - | [defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts:190](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts#L190) |
| `rating.distribution` | `Record`\<`number`, `number`\> | - | [defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts:191](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts#L191) |
| <a id="recommendations"></a> `recommendations` | `string`[] | Recommendations for improvement | [defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts:194](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts#L194) |
| <a id="registeredat"></a> `registeredAt` | `string` | Registration date | [defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts:140](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts#L140) |
| <a id="revenue"></a> `revenue` | \{ `byChain`: `Record`\<`string`, `string`\>; `byDay`: [`TimeSeriesData`](/docs/api/defi/protocols/src/modules/tool-marketplace/dashboard/creator.md#timeseriesdata); `byToken`: `Record`\<`string`, `string`\>; `change`: `string`; `period`: `string`; `total`: `string`; \} | Revenue metrics | [defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts:148](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts#L148) |
| `revenue.byChain` | `Record`\<`string`, `string`\> | - | [defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts:154](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts#L154) |
| `revenue.byDay` | [`TimeSeriesData`](/docs/api/defi/protocols/src/modules/tool-marketplace/dashboard/creator.md#timeseriesdata) | - | [defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts:152](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts#L152) |
| `revenue.byToken` | `Record`\<`string`, `string`\> | - | [defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts:153](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts#L153) |
| `revenue.change` | `string` | - | [defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts:151](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts#L151) |
| `revenue.period` | `string` | - | [defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts:150](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts#L150) |
| `revenue.total` | `string` | - | [defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts:149](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts#L149) |
| <a id="status"></a> `status` | `string` | Current status | [defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts:138](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts#L138) |
| <a id="toolid"></a> `toolId` | `string` | Tool ID | [defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts:130](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts#L130) |
| <a id="usage"></a> `usage` | \{ `byDay`: [`TimeSeriesData`](/docs/api/defi/protocols/src/modules/tool-marketplace/dashboard/creator.md#timeseriesdata); `byHour`: \{ `count`: `number`; `hour`: `number`; \}[]; `callsChange`: `string`; `periodCalls`: `number`; `successRate`: `number`; `totalCalls`: `number`; \} | Usage metrics | [defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts:157](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts#L157) |
| `usage.byDay` | [`TimeSeriesData`](/docs/api/defi/protocols/src/modules/tool-marketplace/dashboard/creator.md#timeseriesdata) | - | [defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts:162](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts#L162) |
| `usage.byHour` | \{ `count`: `number`; `hour`: `number`; \}[] | - | [defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts:163](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts#L163) |
| `usage.callsChange` | `string` | - | [defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts:160](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts#L160) |
| `usage.periodCalls` | `number` | - | [defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts:159](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts#L159) |
| `usage.successRate` | `number` | - | [defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts:161](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts#L161) |
| `usage.totalCalls` | `number` | - | [defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts:158](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts#L158) |
| <a id="users"></a> `users` | \{ `avgCallsPerUser`: `number`; `new`: `number`; `returning`: `number`; `topUsers`: \{ `address`: `string`; `calls`: `number`; `revenue`: `string`; \}[]; `unique`: `number`; \} | User metrics | [defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts:166](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts#L166) |
| `users.avgCallsPerUser` | `number` | - | [defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts:170](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts#L170) |
| `users.new` | `number` | - | [defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts:168](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts#L168) |
| `users.returning` | `number` | - | [defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts:169](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts#L169) |
| `users.topUsers` | \{ `address`: `string`; `calls`: `number`; `revenue`: `string`; \}[] | - | [defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts:171](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts#L171) |
| `users.unique` | `number` | - | [defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts:167](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts#L167) |

***

### ToolPerformance

Defined in: [defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts:22](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts#L22)

Tool performance summary

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="avgresponsetime"></a> `avgResponseTime` | `number` | Average response time | [defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts:42](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts#L42) |
| <a id="calls"></a> `calls` | `number` | Total calls | [defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts:34](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts#L34) |
| <a id="callschange"></a> `callsChange` | `string` | Calls change percentage | [defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts:36](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts#L36) |
| <a id="displayname-1"></a> `displayName` | `string` | Display name | [defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts:28](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts#L28) |
| <a id="name-1"></a> `name` | `string` | Tool name | [defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts:26](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts#L26) |
| <a id="rating-1"></a> `rating` | `number` | User rating | [defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts:44](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts#L44) |
| <a id="revenue-1"></a> `revenue` | `string` | Total revenue | [defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts:30](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts#L30) |
| <a id="revenuechange"></a> `revenueChange` | `string` | Revenue change percentage | [defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts:32](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts#L32) |
| <a id="successrate"></a> `successRate` | `number` | Success rate | [defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts:40](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts#L40) |
| <a id="toolid-1"></a> `toolId` | `string` | Tool ID | [defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts:24](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts#L24) |
| <a id="uniqueusers-1"></a> `uniqueUsers` | `number` | Unique users | [defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts:38](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts#L38) |

***

### UsageHeatmap

Defined in: [defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts:200](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts#L200)

Usage heatmap data

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="data-1"></a> `data` | \{ `day`: `number`; `hour`: `number`; `percentage`: `number`; `value`: `number`; \}[] | Heatmap data by day and hour | [defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts:206](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts#L206) |
| <a id="peaktimes"></a> `peakTimes` | \{ `day`: `string`; `hour`: `number`; `value`: `number`; \}[] | Peak times | [defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts:213](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts#L213) |
| <a id="period-3"></a> `period` | `string` | Period | [defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts:204](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts#L204) |
| <a id="quiettimes"></a> `quietTimes` | \{ `day`: `string`; `hour`: `number`; `value`: `number`; \}[] | Quiet times | [defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts:219](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts#L219) |
| <a id="toolid-2"></a> `toolId` | `string` | Tool ID (or 'all' for platform) | [defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts:202](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts#L202) |

## Variables

### creatorInsights

```ts
const creatorInsights: CreatorInsightsService;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts:826](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/dashboard/creator.ts#L826)
