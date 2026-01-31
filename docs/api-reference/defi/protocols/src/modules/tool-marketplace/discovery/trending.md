[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/modules/tool-marketplace/discovery/trending

# defi/protocols/src/modules/tool-marketplace/discovery/trending

## Classes

### TrendingEngine

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/trending.ts:33](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/trending.ts#L33)

Trending & Featured Tools Engine

#### Constructors

##### Constructor

```ts
new TrendingEngine(): TrendingEngine;
```

###### Returns

[`TrendingEngine`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/trending.md#trendingengine)

#### Methods

##### addFeatured()

```ts
addFeatured(toolId: string, options: {
  durationDays?: number;
  editorsPick?: boolean;
  reason: string;
  stakeAmount?: string;
}): 
  | FeaturedTool
  | null;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/trending.ts:355](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/trending.ts#L355)

Add a featured tool (platform curated or staked)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |
| `options` | \{ `durationDays?`: `number`; `editorsPick?`: `boolean`; `reason`: `string`; `stakeAmount?`: `string`; \} |
| `options.durationDays?` | `number` |
| `options.editorsPick?` | `boolean` |
| `options.reason` | `string` |
| `options.stakeAmount?` | `string` |

###### Returns

  \| [`FeaturedTool`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#featuredtool)
  \| `null`

##### cleanupExpiredFeatured()

```ts
cleanupExpiredFeatured(): number;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/trending.ts:442](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/trending.ts#L442)

Clean up expired featured tools

###### Returns

`number`

##### getDiscoveryFeed()

```ts
getDiscoveryFeed(options: {
  category?: string;
  limit?: number;
}): {
  featured: FeaturedTool[];
  hot: HotTool[];
  new: NewTool[];
  risingStars: RisingStarTool[];
  trending: TrendingTool[];
};
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/trending.ts:467](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/trending.ts#L467)

Get combined discovery feed

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `options` | \{ `category?`: `string`; `limit?`: `number`; \} |
| `options.category?` | `string` |
| `options.limit?` | `number` |

###### Returns

```ts
{
  featured: FeaturedTool[];
  hot: HotTool[];
  new: NewTool[];
  risingStars: RisingStarTool[];
  trending: TrendingTool[];
}
```

| Name | Type | Defined in |
| :------ | :------ | :------ |
| `featured` | [`FeaturedTool`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#featuredtool)[] | [defi/protocols/src/modules/tool-marketplace/discovery/trending.ts:475](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/trending.ts#L475) |
| `hot` | [`HotTool`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#hottool)[] | [defi/protocols/src/modules/tool-marketplace/discovery/trending.ts:472](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/trending.ts#L472) |
| `new` | [`NewTool`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#newtool)[] | [defi/protocols/src/modules/tool-marketplace/discovery/trending.ts:473](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/trending.ts#L473) |
| `risingStars` | [`RisingStarTool`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#risingstartool)[] | [defi/protocols/src/modules/tool-marketplace/discovery/trending.ts:474](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/trending.ts#L474) |
| `trending` | [`TrendingTool`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#trendingtool)[] | [defi/protocols/src/modules/tool-marketplace/discovery/trending.ts:471](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/trending.ts#L471) |

##### getFeatured()

```ts
getFeatured(options: {
  category?: string;
  editorsPickOnly?: boolean;
  limit?: number;
}): FeaturedTool[];
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/trending.ts:397](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/trending.ts#L397)

Get featured tools

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `options` | \{ `category?`: `string`; `editorsPickOnly?`: `boolean`; `limit?`: `number`; \} |
| `options.category?` | `string` |
| `options.editorsPickOnly?` | `boolean` |
| `options.limit?` | `number` |

###### Returns

[`FeaturedTool`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#featuredtool)[]

##### getHot()

```ts
getHot(options: {
  category?: string;
  limit?: number;
  minCalls?: number;
}): HotTool[];
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/trending.ts:203](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/trending.ts#L203)

Get hot tools (most used in last 24 hours)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `options` | \{ `category?`: `string`; `limit?`: `number`; `minCalls?`: `number`; \} |
| `options.category?` | `string` |
| `options.limit?` | `number` |
| `options.minCalls?` | `number` |

###### Returns

[`HotTool`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#hottool)[]

##### getMoversAndShakers()

```ts
getMoversAndShakers(options: {
  limit?: number;
  period?: TrendingPeriod;
}): {
  gainers: TrendingTool[];
  losers: TrendingTool[];
};
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/trending.ts:517](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/trending.ts#L517)

Get movers and shakers (biggest changes)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `options` | \{ `limit?`: `number`; `period?`: [`TrendingPeriod`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#trendingperiod); \} |
| `options.limit?` | `number` |
| `options.period?` | [`TrendingPeriod`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#trendingperiod) |

###### Returns

```ts
{
  gainers: TrendingTool[];
  losers: TrendingTool[];
}
```

| Name | Type | Defined in |
| :------ | :------ | :------ |
| `gainers` | [`TrendingTool`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#trendingtool)[] | [defi/protocols/src/modules/tool-marketplace/discovery/trending.ts:520](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/trending.ts#L520) |
| `losers` | [`TrendingTool`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#trendingtool)[] | [defi/protocols/src/modules/tool-marketplace/discovery/trending.ts:520](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/trending.ts#L520) |

##### getNew()

```ts
getNew(options: {
  limit?: number;
  maxAgeDays?: number;
  verifiedOnly?: boolean;
}): NewTool[];
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/trending.ts:248](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/trending.ts#L248)

Get new tools (recently registered, verified)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `options` | \{ `limit?`: `number`; `maxAgeDays?`: `number`; `verifiedOnly?`: `boolean`; \} |
| `options.limit?` | `number` |
| `options.maxAgeDays?` | `number` |
| `options.verifiedOnly?` | `boolean` |

###### Returns

[`NewTool`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#newtool)[]

##### getRisingStars()

```ts
getRisingStars(options: {
  limit?: number;
  maxCalls?: number;
  minRating?: number;
  minRatingCount?: number;
}): RisingStarTool[];
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/trending.ts:293](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/trending.ts#L293)

Get rising stars (high ratings, low volume - underrated gems)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `options` | \{ `limit?`: `number`; `maxCalls?`: `number`; `minRating?`: `number`; `minRatingCount?`: `number`; \} |
| `options.limit?` | `number` |
| `options.maxCalls?` | `number` |
| `options.minRating?` | `number` |
| `options.minRatingCount?` | `number` |

###### Returns

[`RisingStarTool`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#risingstartool)[]

##### getTrending()

```ts
getTrending(options: {
  category?: string;
  limit?: number;
  minGrowth?: number;
  period?: TrendingPeriod;
}): TrendingTool[];
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/trending.ts:129](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/trending.ts#L129)

Get trending tools (high growth in last 7 days)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `options` | \{ `category?`: `string`; `limit?`: `number`; `minGrowth?`: `number`; `period?`: [`TrendingPeriod`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#trendingperiod); \} |
| `options.category?` | `string` |
| `options.limit?` | `number` |
| `options.minGrowth?` | `number` |
| `options.period?` | [`TrendingPeriod`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#trendingperiod) |

###### Returns

[`TrendingTool`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#trendingtool)[]

##### getTrendingByCategory()

```ts
getTrendingByCategory(options: {
  limitPerCategory?: number;
  period?: TrendingPeriod;
}): Map<string, TrendingTool[]>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/trending.ts:491](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/trending.ts#L491)

Get trending by category

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `options` | \{ `limitPerCategory?`: `number`; `period?`: [`TrendingPeriod`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#trendingperiod); \} |
| `options.limitPerCategory?` | `number` |
| `options.period?` | [`TrendingPeriod`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#trendingperiod) |

###### Returns

`Map`\<`string`, [`TrendingTool`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#trendingtool)[]\>

##### loadTools()

```ts
loadTools(tools: RegisteredTool[]): void;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/trending.ts:44](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/trending.ts#L44)

Load tools

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `tools` | [`RegisteredTool`](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#registeredtool)[] |

###### Returns

`void`

##### loadUsageRecords()

```ts
loadUsageRecords(records: ToolUsageRecord[]): void;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/trending.ts:56](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/trending.ts#L56)

Load usage records

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `records` | [`ToolUsageRecord`](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#toolusagerecord)[] |

###### Returns

`void`

##### removeFeatured()

```ts
removeFeatured(toolId: string): void;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/trending.ts:390](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/trending.ts#L390)

Remove featured status

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |

###### Returns

`void`

##### setCacheExpiry()

```ts
setCacheExpiry(ms: number): void;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/trending.ts:566](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/trending.ts#L566)

Set cache expiry time

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `ms` | `number` |

###### Returns

`void`

## Variables

### trendingEngine

```ts
const trendingEngine: TrendingEngine;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/trending.ts:574](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/trending.ts#L574)

Singleton instance
