[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/modules/tool-marketplace/discovery/ui

# defi/protocols/src/modules/tool-marketplace/discovery/ui

## Classes

### UIFormatter

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/ui.ts:79](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/ui.ts#L79)

UI Formatting Helpers

#### Constructors

##### Constructor

```ts
new UIFormatter(): UIFormatter;
```

###### Returns

[`UIFormatter`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/ui.md#uiformatter)

#### Methods

##### formatAlternative()

```ts
static formatAlternative(alt: ToolAlternative, rank: number): string;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/ui.ts:411](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/ui.ts#L411)

Format tool alternative

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `alt` | [`ToolAlternative`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#toolalternative) |
| `rank` | `number` |

###### Returns

`string`

##### formatAlternatives()

```ts
static formatAlternatives(alternatives: ToolAlternative[], originalTool: RegisteredTool): string;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/ui.ts:424](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/ui.ts#L424)

Format alternatives list

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `alternatives` | [`ToolAlternative`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#toolalternative)[] |
| `originalTool` | [`RegisteredTool`](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#registeredtool) |

###### Returns

`string`

##### formatBundleCard()

```ts
static formatBundleCard(bundle: ToolBundle): string;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/ui.ts:369](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/ui.ts#L369)

Format bundle card

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `bundle` | [`ToolBundle`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#toolbundle) |

###### Returns

`string`

##### formatBundlesList()

```ts
static formatBundlesList(bundles: ToolBundle[]): string;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/ui.ts:395](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/ui.ts#L395)

Format bundles list

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `bundles` | [`ToolBundle`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#toolbundle)[] |

###### Returns

`string`

##### formatComparison()

```ts
static formatComparison(comparison: ToolComparison): string;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/ui.ts:171](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/ui.ts#L171)

Format tool comparison as side-by-side table

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `comparison` | [`ToolComparison`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#toolcomparison) |

###### Returns

`string`

##### formatDiscoveryFeed()

```ts
static formatDiscoveryFeed(feed: {
  featured: FeaturedTool[];
  hot: HotTool[];
  new: NewTool[];
  risingStars: RisingStarTool[];
  trending: TrendingTool[];
}): string;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/ui.ts:436](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/ui.ts#L436)

Format discovery feed summary

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `feed` | \{ `featured`: [`FeaturedTool`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#featuredtool)[]; `hot`: [`HotTool`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#hottool)[]; `new`: [`NewTool`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#newtool)[]; `risingStars`: [`RisingStarTool`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#risingstartool)[]; `trending`: [`TrendingTool`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#trendingtool)[]; \} |
| `feed.featured` | [`FeaturedTool`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#featuredtool)[] |
| `feed.hot` | [`HotTool`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#hottool)[] |
| `feed.new` | [`NewTool`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#newtool)[] |
| `feed.risingStars` | [`RisingStarTool`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#risingstartool)[] |
| `feed.trending` | [`TrendingTool`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#trendingtool)[] |

###### Returns

`string`

##### formatFeaturedList()

```ts
static formatFeaturedList(featured: FeaturedTool[]): string;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/ui.ts:357](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/ui.ts#L357)

Format featured list

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `featured` | [`FeaturedTool`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#featuredtool)[] |

###### Returns

`string`

##### formatFeaturedTool()

```ts
static formatFeaturedTool(featured: FeaturedTool): string;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/ui.ts:344](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/ui.ts#L344)

Format featured tool

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `featured` | [`FeaturedTool`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#featuredtool) |

###### Returns

`string`

##### formatHotList()

```ts
static formatHotList(hot: HotTool[]): string;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/ui.ts:289](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/ui.ts#L289)

Format hot list

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `hot` | [`HotTool`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#hottool)[] |

###### Returns

`string`

##### formatHotTool()

```ts
static formatHotTool(hot: HotTool, rank: number): string;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/ui.ts:281](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/ui.ts#L281)

Format hot tool

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `hot` | [`HotTool`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#hottool) |
| `rank` | `number` |

###### Returns

`string`

##### formatNewList()

```ts
static formatNewList(newTools: NewTool[]): string;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/ui.ts:312](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/ui.ts#L312)

Format new tools list

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `newTools` | [`NewTool`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#newtool)[] |

###### Returns

`string`

##### formatNewTool()

```ts
static formatNewTool(newTool: NewTool, rank: number): string;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/ui.ts:301](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/ui.ts#L301)

Format new tool

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `newTool` | [`NewTool`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#newtool) |
| `rank` | `number` |

###### Returns

`string`

##### formatRecommendation()

```ts
static formatRecommendation(rec: RecommendedTool, rank: number): string;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/ui.ts:227](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/ui.ts#L227)

Format recommended tool

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `rec` | [`RecommendedTool`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#recommendedtool) |
| `rank` | `number` |

###### Returns

`string`

##### formatRecommendations()

```ts
static formatRecommendations(recommendations: RecommendedTool[], title: string): string;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/ui.ts:243](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/ui.ts#L243)

Format recommendations list

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `recommendations` | [`RecommendedTool`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#recommendedtool)[] | `undefined` |
| `title` | `string` | `"Recommendations"` |

###### Returns

`string`

##### formatRisingStar()

```ts
static formatRisingStar(star: RisingStarTool, rank: number): string;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/ui.ts:324](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/ui.ts#L324)

Format rising star

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `star` | [`RisingStarTool`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#risingstartool) |
| `rank` | `number` |

###### Returns

`string`

##### formatRisingStars()

```ts
static formatRisingStars(stars: RisingStarTool[]): string;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/ui.ts:332](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/ui.ts#L332)

Format rising stars list

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `stars` | [`RisingStarTool`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#risingstartool)[] |

###### Returns

`string`

##### formatSearchResult()

```ts
static formatSearchResult(result: SearchResult, rank: number): string;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/ui.ts:120](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/ui.ts#L120)

Format search result

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `result` | [`SearchResult`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#searchresult) |
| `rank` | `number` |

###### Returns

`string`

##### formatSearchResults()

```ts
static formatSearchResults(response: SearchResponse): string;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/ui.ts:136](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/ui.ts#L136)

Format search results as paginated list

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `response` | [`SearchResponse`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#searchresponse) |

###### Returns

`string`

##### formatToolCard()

```ts
static formatToolCard(tool: RegisteredTool): string;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/ui.ts:83](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/ui.ts#L83)

Format a single tool card in markdown

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `tool` | [`RegisteredTool`](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#registeredtool) |

###### Returns

`string`

##### formatToolInline()

```ts
static formatToolInline(tool: RegisteredTool): string;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/ui.ts:112](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/ui.ts#L112)

Format tool as compact inline

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `tool` | [`RegisteredTool`](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#registeredtool) |

###### Returns

`string`

##### formatTrendingList()

```ts
static formatTrendingList(trending: TrendingTool[], period: string): string;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/ui.ts:269](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/ui.ts#L269)

Format trending list

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `trending` | [`TrendingTool`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#trendingtool)[] | `undefined` |
| `period` | `string` | `"7d"` |

###### Returns

`string`

##### formatTrendingTool()

```ts
static formatTrendingTool(trending: TrendingTool): string;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/ui.ts:258](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/ui.ts#L258)

Format trending tool

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `trending` | [`TrendingTool`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#trendingtool) |

###### Returns

`string`

## Variables

### formatComparison()

```ts
const formatComparison: (comparison: ToolComparison) => string = UIFormatter.formatComparison;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/ui.ts:470](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/ui.ts#L470)

Format tool comparison as side-by-side table

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `comparison` | [`ToolComparison`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#toolcomparison) |

#### Returns

`string`

***

### formatSearchResults()

```ts
const formatSearchResults: (response: SearchResponse) => string = UIFormatter.formatSearchResults;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/ui.ts:471](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/ui.ts#L471)

Format search results as paginated list

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `response` | [`SearchResponse`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#searchresponse) |

#### Returns

`string`

***

### formatToolCard()

```ts
const formatToolCard: (tool: RegisteredTool) => string = UIFormatter.formatToolCard;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/ui.ts:469](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/ui.ts#L469)

Format a single tool card in markdown

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `tool` | [`RegisteredTool`](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#registeredtool) |

#### Returns

`string`
