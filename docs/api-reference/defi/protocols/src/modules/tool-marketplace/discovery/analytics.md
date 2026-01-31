[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/modules/tool-marketplace/discovery/analytics

# defi/protocols/src/modules/tool-marketplace/discovery/analytics

## Classes

### SearchAnalytics

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/analytics.ts:47](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/analytics.ts#L47)

Search Analytics Engine

#### Constructors

##### Constructor

```ts
new SearchAnalytics(options: {
  maxRecords?: number;
  retentionDays?: number;
}): SearchAnalytics;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/analytics.ts:57](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/analytics.ts#L57)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `options` | \{ `maxRecords?`: `number`; `retentionDays?`: `number`; \} |
| `options.maxRecords?` | `number` |
| `options.retentionDays?` | `number` |

###### Returns

[`SearchAnalytics`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/analytics.md#searchanalytics)

#### Methods

##### cleanup()

```ts
cleanup(): {
  clicksRemoved: number;
  conversionsRemoved: number;
  queriesRemoved: number;
};
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/analytics.ts:526](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/analytics.ts#L526)

Remove records older than retention period

###### Returns

```ts
{
  clicksRemoved: number;
  conversionsRemoved: number;
  queriesRemoved: number;
}
```

| Name | Type | Defined in |
| :------ | :------ | :------ |
| `clicksRemoved` | `number` | [defi/protocols/src/modules/tool-marketplace/discovery/analytics.ts:526](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/analytics.ts#L526) |
| `conversionsRemoved` | `number` | [defi/protocols/src/modules/tool-marketplace/discovery/analytics.ts:526](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/analytics.ts#L526) |
| `queriesRemoved` | `number` | [defi/protocols/src/modules/tool-marketplace/discovery/analytics.ts:526](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/analytics.ts#L526) |

##### export()

```ts
export(): {
  clickRecords: ClickRecord[];
  conversionRecords: ConversionRecord[];
  queryRecords: SearchQueryRecord[];
  zeroResultQueries: ZeroResultQuery[];
};
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/analytics.ts:560](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/analytics.ts#L560)

Export analytics data

###### Returns

```ts
{
  clickRecords: ClickRecord[];
  conversionRecords: ConversionRecord[];
  queryRecords: SearchQueryRecord[];
  zeroResultQueries: ZeroResultQuery[];
}
```

| Name | Type | Defined in |
| :------ | :------ | :------ |
| `clickRecords` | [`ClickRecord`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#clickrecord)[] | [defi/protocols/src/modules/tool-marketplace/discovery/analytics.ts:562](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/analytics.ts#L562) |
| `conversionRecords` | [`ConversionRecord`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#conversionrecord)[] | [defi/protocols/src/modules/tool-marketplace/discovery/analytics.ts:563](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/analytics.ts#L563) |
| `queryRecords` | [`SearchQueryRecord`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#searchqueryrecord)[] | [defi/protocols/src/modules/tool-marketplace/discovery/analytics.ts:561](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/analytics.ts#L561) |
| `zeroResultQueries` | [`ZeroResultQuery`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#zeroresultquery)[] | [defi/protocols/src/modules/tool-marketplace/discovery/analytics.ts:564](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/analytics.ts#L564) |

##### getCounts()

```ts
getCounts(): {
  clicks: number;
  conversions: number;
  queries: number;
  zeroResultQueries: number;
};
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/analytics.ts:603](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/analytics.ts#L603)

Get record counts

###### Returns

```ts
{
  clicks: number;
  conversions: number;
  queries: number;
  zeroResultQueries: number;
}
```

| Name | Type | Defined in |
| :------ | :------ | :------ |
| `clicks` | `number` | [defi/protocols/src/modules/tool-marketplace/discovery/analytics.ts:605](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/analytics.ts#L605) |
| `conversions` | `number` | [defi/protocols/src/modules/tool-marketplace/discovery/analytics.ts:606](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/analytics.ts#L606) |
| `queries` | `number` | [defi/protocols/src/modules/tool-marketplace/discovery/analytics.ts:604](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/analytics.ts#L604) |
| `zeroResultQueries` | `number` | [defi/protocols/src/modules/tool-marketplace/discovery/analytics.ts:607](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/analytics.ts#L607) |

##### getQueryPatterns()

```ts
getQueryPatterns(options: {
  limit?: number;
  minCount?: number;
  period?: "1h" | "24h" | "7d" | "30d";
}): {
  avgResults: number;
  count: number;
  term: string;
}[];
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/analytics.ts:331](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/analytics.ts#L331)

Get query patterns (common search terms)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `options` | \{ `limit?`: `number`; `minCount?`: `number`; `period?`: `"1h"` \| `"24h"` \| `"7d"` \| `"30d"`; \} |
| `options.limit?` | `number` |
| `options.minCount?` | `number` |
| `options.period?` | `"1h"` \| `"24h"` \| `"7d"` \| `"30d"` |

###### Returns

\{
  `avgResults`: `number`;
  `count`: `number`;
  `term`: `string`;
\}[]

##### getSearchFunnel()

```ts
getSearchFunnel(period: "1h" | "24h" | "7d" | "30d"): {
  clicks: number;
  conversions: number;
  conversionValue: string;
  resultsShown: number;
  searches: number;
  totalRevenue: string;
};
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/analytics.ts:265](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/analytics.ts#L265)

Get search funnel metrics

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `period` | `"1h"` \| `"24h"` \| `"7d"` \| `"30d"` |

###### Returns

```ts
{
  clicks: number;
  conversions: number;
  conversionValue: string;
  resultsShown: number;
  searches: number;
  totalRevenue: string;
}
```

| Name | Type | Defined in |
| :------ | :------ | :------ |
| `clicks` | `number` | [defi/protocols/src/modules/tool-marketplace/discovery/analytics.ts:268](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/analytics.ts#L268) |
| `conversions` | `number` | [defi/protocols/src/modules/tool-marketplace/discovery/analytics.ts:269](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/analytics.ts#L269) |
| `conversionValue` | `string` | [defi/protocols/src/modules/tool-marketplace/discovery/analytics.ts:271](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/analytics.ts#L271) |
| `resultsShown` | `number` | [defi/protocols/src/modules/tool-marketplace/discovery/analytics.ts:267](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/analytics.ts#L267) |
| `searches` | `number` | [defi/protocols/src/modules/tool-marketplace/discovery/analytics.ts:266](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/analytics.ts#L266) |
| `totalRevenue` | `string` | [defi/protocols/src/modules/tool-marketplace/discovery/analytics.ts:270](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/analytics.ts#L270) |

##### getSearchQualityIndicators()

```ts
getSearchQualityIndicators(period: "1h" | "24h" | "7d" | "30d"): {
  abandonmentRate: number;
  meanClickPosition: number;
  meanReciprocalRank: number;
  precisionAt5: number;
};
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/analytics.ts:368](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/analytics.ts#L368)

Get search quality indicators

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `period` | `"1h"` \| `"24h"` \| `"7d"` \| `"30d"` |

###### Returns

```ts
{
  abandonmentRate: number;
  meanClickPosition: number;
  meanReciprocalRank: number;
  precisionAt5: number;
}
```

| Name | Type | Defined in |
| :------ | :------ | :------ |
| `abandonmentRate` | `number` | [defi/protocols/src/modules/tool-marketplace/discovery/analytics.ts:372](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/analytics.ts#L372) |
| `meanClickPosition` | `number` | [defi/protocols/src/modules/tool-marketplace/discovery/analytics.ts:371](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/analytics.ts#L371) |
| `meanReciprocalRank` | `number` | [defi/protocols/src/modules/tool-marketplace/discovery/analytics.ts:369](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/analytics.ts#L369) |
| `precisionAt5` | `number` | [defi/protocols/src/modules/tool-marketplace/discovery/analytics.ts:370](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/analytics.ts#L370) |

##### getSuggestedSynonyms()

```ts
getSuggestedSynonyms(): {
  reason: string;
  suggestedSynonyms: string[];
  term: string;
}[];
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/analytics.ts:433](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/analytics.ts#L433)

Get suggested synonyms based on search patterns

###### Returns

\{
  `reason`: `string`;
  `suggestedSynonyms`: `string`[];
  `term`: `string`;
\}[]

##### getSummary()

```ts
getSummary(period: "1h" | "24h" | "7d" | "30d"): SearchAnalyticsSummary;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/analytics.ts:180](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/analytics.ts#L180)

Get analytics summary for a period

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `period` | `"1h"` \| `"24h"` \| `"7d"` \| `"30d"` |

###### Returns

[`SearchAnalyticsSummary`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#searchanalyticssummary)

##### getToolClickAnalytics()

```ts
getToolClickAnalytics(toolId: string, period: "1h" | "24h" | "7d" | "30d"): {
  avgPosition: number;
  conversionRate: number;
  conversions: number;
  totalClicks: number;
  uniqueSearches: number;
};
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/analytics.ts:298](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/analytics.ts#L298)

Get tool click analytics

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |
| `period` | `"1h"` \| `"24h"` \| `"7d"` \| `"30d"` |

###### Returns

```ts
{
  avgPosition: number;
  conversionRate: number;
  conversions: number;
  totalClicks: number;
  uniqueSearches: number;
}
```

| Name | Type | Defined in |
| :------ | :------ | :------ |
| `avgPosition` | `number` | [defi/protocols/src/modules/tool-marketplace/discovery/analytics.ts:301](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/analytics.ts#L301) |
| `conversionRate` | `number` | [defi/protocols/src/modules/tool-marketplace/discovery/analytics.ts:303](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/analytics.ts#L303) |
| `conversions` | `number` | [defi/protocols/src/modules/tool-marketplace/discovery/analytics.ts:302](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/analytics.ts#L302) |
| `totalClicks` | `number` | [defi/protocols/src/modules/tool-marketplace/discovery/analytics.ts:299](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/analytics.ts#L299) |
| `uniqueSearches` | `number` | [defi/protocols/src/modules/tool-marketplace/discovery/analytics.ts:300](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/analytics.ts#L300) |

##### import()

```ts
import(data: {
  clickRecords?: ClickRecord[];
  conversionRecords?: ConversionRecord[];
  queryRecords?: SearchQueryRecord[];
  zeroResultQueries?: ZeroResultQuery[];
}): void;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/analytics.ts:577](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/analytics.ts#L577)

Import analytics data

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `data` | \{ `clickRecords?`: [`ClickRecord`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#clickrecord)[]; `conversionRecords?`: [`ConversionRecord`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#conversionrecord)[]; `queryRecords?`: [`SearchQueryRecord`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#searchqueryrecord)[]; `zeroResultQueries?`: [`ZeroResultQuery`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#zeroresultquery)[]; \} |
| `data.clickRecords?` | [`ClickRecord`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#clickrecord)[] |
| `data.conversionRecords?` | [`ConversionRecord`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#conversionrecord)[] |
| `data.queryRecords?` | [`SearchQueryRecord`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#searchqueryrecord)[] |
| `data.zeroResultQueries?` | [`ZeroResultQuery`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#zeroresultquery)[] |

###### Returns

`void`

##### recordClick()

```ts
recordClick(params: {
  position: number;
  queryId: string;
  toolId: string;
}): string;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/analytics.ts:110](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/analytics.ts#L110)

Record a click on a search result

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `params` | \{ `position`: `number`; `queryId`: `string`; `toolId`: `string`; \} |
| `params.position` | `number` |
| `params.queryId` | `string` |
| `params.toolId` | `string` |

###### Returns

`string`

##### recordConversion()

```ts
recordConversion(params: {
  amountSpent: string;
  clickId: string;
  queryId: string;
  toolId: string;
}): string;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/analytics.ts:132](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/analytics.ts#L132)

Record a conversion (search -> usage)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `params` | \{ `amountSpent`: `string`; `clickId`: `string`; `queryId`: `string`; `toolId`: `string`; \} |
| `params.amountSpent` | `string` |
| `params.clickId` | `string` |
| `params.queryId` | `string` |
| `params.toolId` | `string` |

###### Returns

`string`

##### recordQuery()

```ts
recordQuery(params: {
  filtersApplied?: string[];
  query: string;
  resultsCount: number;
  searchTimeMs: number;
  searchType: "fulltext" | "semantic" | "hybrid";
  userAddress?: string;
}): string;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/analytics.ts:72](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/analytics.ts#L72)

Record a search query

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `params` | \{ `filtersApplied?`: `string`[]; `query`: `string`; `resultsCount`: `number`; `searchTimeMs`: `number`; `searchType`: `"fulltext"` \| `"semantic"` \| `"hybrid"`; `userAddress?`: `string`; \} |
| `params.filtersApplied?` | `string`[] |
| `params.query` | `string` |
| `params.resultsCount` | `number` |
| `params.searchTimeMs` | `number` |
| `params.searchType` | `"fulltext"` \| `"semantic"` \| `"hybrid"` |
| `params.userAddress?` | `string` |

###### Returns

`string`

## Variables

### searchAnalytics

```ts
const searchAnalytics: SearchAnalytics;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/analytics.ts:621](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/analytics.ts#L621)

Singleton instance
