[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/modules/tool-marketplace/analytics/platform

# defi/protocols/src/modules/tool-marketplace/analytics/platform

## Classes

### PlatformAnalyticsService

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/platform.ts:211](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/platform.ts#L211)

Platform Analytics Service

#### Constructors

##### Constructor

```ts
new PlatformAnalyticsService(): PlatformAnalyticsService;
```

###### Returns

[`PlatformAnalyticsService`](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/platform.md#platformanalyticsservice)

#### Methods

##### getCategoryBreakdown()

```ts
getCategoryBreakdown(): Promise<{
  categories: {
     avgPrice: string;
     avgRating: number;
     name: ToolCategory;
     revenue: string;
     tools: number;
     topTool: string;
  }[];
}>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/platform.ts:649](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/platform.ts#L649)

Get category breakdown

###### Returns

`Promise`\<\{
  `categories`: \{
     `avgPrice`: `string`;
     `avgRating`: `number`;
     `name`: [`ToolCategory`](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#toolcategory);
     `revenue`: `string`;
     `tools`: `number`;
     `topTool`: `string`;
  \}[];
\}\>

##### getOverview()

```ts
getOverview(periodDays: number): Promise<PlatformAnalyticsOverview>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/platform.ts:286](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/platform.ts#L286)

Get full platform analytics overview

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `periodDays` | `number` | `30` |

###### Returns

`Promise`\<[`PlatformAnalyticsOverview`](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/platform.md#platformanalyticsoverview)\>

##### trackDiscovery()

```ts
trackDiscovery(userId: string, timestamp: number): void;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/platform.ts:215](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/platform.ts#L215)

Track user discovery event

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `userId` | `string` |
| `timestamp` | `number` |

###### Returns

`void`

##### trackUsage()

```ts
trackUsage(
   userId: string, 
   toolId: string, 
   timestamp: number): void;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/platform.ts:240](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/platform.ts#L240)

Track tool usage event

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `userId` | `string` |
| `toolId` | `string` |
| `timestamp` | `number` |

###### Returns

`void`

##### trackView()

```ts
trackView(
   userId: string, 
   toolId: string, 
   timestamp: number): void;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/platform.ts:225](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/platform.ts#L225)

Track tool view event

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `userId` | `string` |
| `toolId` | `string` |
| `timestamp` | `number` |

###### Returns

`void`

## Interfaces

### CategoryRevenue

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/platform.ts:58](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/platform.ts#L58)

Revenue by category

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="avgrevenuepertool"></a> `avgRevenuePerTool` | `string` | Average revenue per tool | [defi/protocols/src/modules/tool-marketplace/analytics/platform.ts:68](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/platform.ts#L68) |
| <a id="category"></a> `category` | [`ToolCategory`](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#toolcategory) | Category name | [defi/protocols/src/modules/tool-marketplace/analytics/platform.ts:60](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/platform.ts#L60) |
| <a id="growthrate"></a> `growthRate` | `string` | Growth rate | [defi/protocols/src/modules/tool-marketplace/analytics/platform.ts:70](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/platform.ts#L70) |
| <a id="percentage"></a> `percentage` | `number` | Percentage of total | [defi/protocols/src/modules/tool-marketplace/analytics/platform.ts:64](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/platform.ts#L64) |
| <a id="revenue"></a> `revenue` | `string` | Total revenue | [defi/protocols/src/modules/tool-marketplace/analytics/platform.ts:62](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/platform.ts#L62) |
| <a id="toolcount"></a> `toolCount` | `number` | Number of tools | [defi/protocols/src/modules/tool-marketplace/analytics/platform.ts:66](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/platform.ts#L66) |

***

### ConversionFunnel

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/platform.ts:37](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/platform.ts#L37)

Conversion funnel metrics

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="conversionrates"></a> `conversionRates` | \{ `discoverToView`: `number`; `overall`: `number`; `useToRepeat`: `number`; `viewToUse`: `number`; \} | Conversion rates | [defi/protocols/src/modules/tool-marketplace/analytics/platform.ts:47](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/platform.ts#L47) |
| `conversionRates.discoverToView` | `number` | - | [defi/protocols/src/modules/tool-marketplace/analytics/platform.ts:48](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/platform.ts#L48) |
| `conversionRates.overall` | `number` | - | [defi/protocols/src/modules/tool-marketplace/analytics/platform.ts:51](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/platform.ts#L51) |
| `conversionRates.useToRepeat` | `number` | - | [defi/protocols/src/modules/tool-marketplace/analytics/platform.ts:50](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/platform.ts#L50) |
| `conversionRates.viewToUse` | `number` | - | [defi/protocols/src/modules/tool-marketplace/analytics/platform.ts:49](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/platform.ts#L49) |
| <a id="discover"></a> `discover` | `number` | Users who discovered tools | [defi/protocols/src/modules/tool-marketplace/analytics/platform.ts:39](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/platform.ts#L39) |
| <a id="repeat"></a> `repeat` | `number` | Users who used tools multiple times | [defi/protocols/src/modules/tool-marketplace/analytics/platform.ts:45](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/platform.ts#L45) |
| <a id="use"></a> `use` | `number` | Users who used a tool | [defi/protocols/src/modules/tool-marketplace/analytics/platform.ts:43](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/platform.ts#L43) |
| <a id="view"></a> `view` | `number` | Users who viewed tool details | [defi/protocols/src/modules/tool-marketplace/analytics/platform.ts:41](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/platform.ts#L41) |

***

### GrowthMetrics

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/platform.ts:17](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/platform.ts#L17)

Growth metrics (DAU, WAU, MAU)

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="dau"></a> `dau` | `number` | Daily Active Users | [defi/protocols/src/modules/tool-marketplace/analytics/platform.ts:19](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/platform.ts#L19) |
| <a id="mau"></a> `mau` | `number` | Monthly Active Users | [defi/protocols/src/modules/tool-marketplace/analytics/platform.ts:23](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/platform.ts#L23) |
| <a id="revenuegrowthrate"></a> `revenueGrowthRate` | `string` | Revenue growth rate (%) | [defi/protocols/src/modules/tool-marketplace/analytics/platform.ts:31](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/platform.ts#L31) |
| <a id="stickiness"></a> `stickiness` | `number` | DAU/MAU ratio (stickiness) | [defi/protocols/src/modules/tool-marketplace/analytics/platform.ts:25](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/platform.ts#L25) |
| <a id="toolgrowthrate"></a> `toolGrowthRate` | `string` | Tool growth rate (%) | [defi/protocols/src/modules/tool-marketplace/analytics/platform.ts:29](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/platform.ts#L29) |
| <a id="usergrowthrate"></a> `userGrowthRate` | `string` | User growth rate (%) | [defi/protocols/src/modules/tool-marketplace/analytics/platform.ts:27](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/platform.ts#L27) |
| <a id="wau"></a> `wau` | `number` | Weekly Active Users | [defi/protocols/src/modules/tool-marketplace/analytics/platform.ts:21](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/platform.ts#L21) |

***

### PlatformAnalyticsOverview

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/platform.ts:96](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/platform.ts#L96)

Full platform analytics overview

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="charts"></a> `charts` | \{ `newToolsByDay`: \{ `date`: `string`; `value`: `string`; \}[]; `newUsersByDay`: \{ `date`: `string`; `value`: `string`; \}[]; `transactionsByDay`: \{ `date`: `string`; `value`: `string`; \}[]; `volumeByDay`: \{ `date`: `string`; `value`: `string`; \}[]; \} | Charts | [defi/protocols/src/modules/tool-marketplace/analytics/platform.ts:146](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/platform.ts#L146) |
| `charts.newToolsByDay` | \{ `date`: `string`; `value`: `string`; \}[] | - | [defi/protocols/src/modules/tool-marketplace/analytics/platform.ts:150](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/platform.ts#L150) |
| `charts.newUsersByDay` | \{ `date`: `string`; `value`: `string`; \}[] | - | [defi/protocols/src/modules/tool-marketplace/analytics/platform.ts:149](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/platform.ts#L149) |
| `charts.transactionsByDay` | \{ `date`: `string`; `value`: `string`; \}[] | - | [defi/protocols/src/modules/tool-marketplace/analytics/platform.ts:148](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/platform.ts#L148) |
| `charts.volumeByDay` | \{ `date`: `string`; `value`: `string`; \}[] | - | [defi/protocols/src/modules/tool-marketplace/analytics/platform.ts:147](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/platform.ts#L147) |
| <a id="funnel"></a> `funnel` | [`ConversionFunnel`](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/platform.md#conversionfunnel) | Conversion funnel | [defi/protocols/src/modules/tool-marketplace/analytics/platform.ts:127](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/platform.ts#L127) |
| <a id="growth"></a> `growth` | [`GrowthMetrics`](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/platform.md#growthmetrics) | Growth metrics | [defi/protocols/src/modules/tool-marketplace/analytics/platform.ts:123](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/platform.ts#L123) |
| <a id="health"></a> `health` | [`PlatformHealth`](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/platform.md#platformhealth) | Platform health | [defi/protocols/src/modules/tool-marketplace/analytics/platform.ts:129](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/platform.ts#L129) |
| <a id="period"></a> `period` | \{ `end`: `number`; `label`: `string`; `start`: `number`; \} | Time period | [defi/protocols/src/modules/tool-marketplace/analytics/platform.ts:100](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/platform.ts#L100) |
| `period.end` | `number` | - | [defi/protocols/src/modules/tool-marketplace/analytics/platform.ts:102](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/platform.ts#L102) |
| `period.label` | `string` | - | [defi/protocols/src/modules/tool-marketplace/analytics/platform.ts:103](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/platform.ts#L103) |
| `period.start` | `number` | - | [defi/protocols/src/modules/tool-marketplace/analytics/platform.ts:101](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/platform.ts#L101) |
| <a id="revenuebycategory"></a> `revenueByCategory` | [`CategoryRevenue`](/docs/api/defi/protocols/src/modules/tool-marketplace/analytics/platform.md#categoryrevenue)[] | Revenue by category | [defi/protocols/src/modules/tool-marketplace/analytics/platform.ts:125](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/platform.ts#L125) |
| <a id="summary"></a> `summary` | \{ `activeCreators`: `number`; `activeTools`: `number`; `activeUsers`: `number`; `totalTransactions`: `number`; `totalVolume`: `string`; `transactionChange`: `string`; `volumeChange`: `string`; \} | Summary metrics | [defi/protocols/src/modules/tool-marketplace/analytics/platform.ts:106](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/platform.ts#L106) |
| `summary.activeCreators` | `number` | Active creators | [defi/protocols/src/modules/tool-marketplace/analytics/platform.ts:118](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/platform.ts#L118) |
| `summary.activeTools` | `number` | Active tools | [defi/protocols/src/modules/tool-marketplace/analytics/platform.ts:116](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/platform.ts#L116) |
| `summary.activeUsers` | `number` | Active users | [defi/protocols/src/modules/tool-marketplace/analytics/platform.ts:120](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/platform.ts#L120) |
| `summary.totalTransactions` | `number` | Total transactions | [defi/protocols/src/modules/tool-marketplace/analytics/platform.ts:112](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/platform.ts#L112) |
| `summary.totalVolume` | `string` | Total marketplace volume (USD) | [defi/protocols/src/modules/tool-marketplace/analytics/platform.ts:108](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/platform.ts#L108) |
| `summary.transactionChange` | `string` | Transaction change | [defi/protocols/src/modules/tool-marketplace/analytics/platform.ts:114](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/platform.ts#L114) |
| `summary.volumeChange` | `string` | Volume change | [defi/protocols/src/modules/tool-marketplace/analytics/platform.ts:110](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/platform.ts#L110) |
| <a id="timestamp"></a> `timestamp` | `number` | Snapshot timestamp | [defi/protocols/src/modules/tool-marketplace/analytics/platform.ts:98](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/platform.ts#L98) |
| <a id="topcreators"></a> `topCreators` | \{ `address`: `string`; `avgRating`: `number`; `toolCount`: `number`; `totalRevenue`: `string`; \}[] | Top creators | [defi/protocols/src/modules/tool-marketplace/analytics/platform.ts:139](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/platform.ts#L139) |
| <a id="toptools"></a> `topTools` | \{ `calls`: `number`; `name`: `string`; `rating`: `number`; `revenue`: `string`; `toolId`: `string`; \}[] | Top performing tools | [defi/protocols/src/modules/tool-marketplace/analytics/platform.ts:131](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/platform.ts#L131) |

***

### PlatformHealth

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/platform.ts:76](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/platform.ts#L76)

Platform health metrics

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="activeissues"></a> `activeIssues` | `number` | Active issues count | [defi/protocols/src/modules/tool-marketplace/analytics/platform.ts:86](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/platform.ts#L86) |
| <a id="apiavailability"></a> `apiAvailability` | `number` | API availability | [defi/protocols/src/modules/tool-marketplace/analytics/platform.ts:80](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/platform.ts#L80) |
| <a id="avgresponsetime"></a> `avgResponseTime` | `number` | Average response time across all tools | [defi/protocols/src/modules/tool-marketplace/analytics/platform.ts:82](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/platform.ts#L82) |
| <a id="errorrate"></a> `errorRate` | `number` | Error rate | [defi/protocols/src/modules/tool-marketplace/analytics/platform.ts:84](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/platform.ts#L84) |
| <a id="healthscore"></a> `healthScore` | `number` | Overall platform score (0-100) | [defi/protocols/src/modules/tool-marketplace/analytics/platform.ts:78](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/platform.ts#L78) |
| <a id="recommendations"></a> `recommendations` | `string`[] | Recommendations | [defi/protocols/src/modules/tool-marketplace/analytics/platform.ts:90](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/platform.ts#L90) |
| <a id="status"></a> `status` | `"critical"` \| `"healthy"` \| `"degraded"` | Status | [defi/protocols/src/modules/tool-marketplace/analytics/platform.ts:88](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/platform.ts#L88) |

## Variables

### platformAnalytics

```ts
const platformAnalytics: PlatformAnalyticsService;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/analytics/platform.ts:705](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/analytics/platform.ts#L705)
