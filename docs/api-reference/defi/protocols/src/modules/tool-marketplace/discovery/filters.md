[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/modules/tool-marketplace/discovery/filters

# defi/protocols/src/modules/tool-marketplace/discovery/filters

## Classes

### FilterEngine

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/filters.ts:106](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/filters.ts#L106)

Filter Engine for advanced tool filtering

#### Constructors

##### Constructor

```ts
new FilterEngine(): FilterEngine;
```

###### Returns

[`FilterEngine`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/filters.md#filterengine)

#### Methods

##### aiTools()

```ts
static aiTools(): AdvancedFilterOptions;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/filters.ts:443](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/filters.ts#L443)

Helper: filter AI tools

###### Returns

[`AdvancedFilterOptions`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#advancedfilteroptions)

##### and()

```ts
static and(...conditions: FilterCondition[]): CombinedFilter;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/filters.ts:360](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/filters.ts#L360)

Create a combined filter with AND logic

###### Parameters

| Parameter | Type |
| :------ | :------ |
| ...`conditions` | [`FilterCondition`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#filtercondition)[] |

###### Returns

[`CombinedFilter`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#combinedfilter)

##### combine()

```ts
static combine(...options: AdvancedFilterOptions[]): AdvancedFilterOptions;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/filters.ts:465](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/filters.ts#L465)

Combine multiple filter options

###### Parameters

| Parameter | Type |
| :------ | :------ |
| ...`options` | [`AdvancedFilterOptions`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#advancedfilteroptions)[] |

###### Returns

[`AdvancedFilterOptions`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#advancedfilteroptions)

##### condition()

```ts
static condition(
   field: string, 
   operator: "eq" | "ne" | "gt" | "gte" | "lt" | "lte" | "in" | "contains", 
   value: unknown): FilterCondition;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/filters.ts:374](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/filters.ts#L374)

Create a filter condition

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `field` | `string` |
| `operator` | `"eq"` \| `"ne"` \| `"gt"` \| `"gte"` \| `"lt"` \| `"lte"` \| `"in"` \| `"contains"` |
| `value` | `unknown` |

###### Returns

[`FilterCondition`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#filtercondition)

##### dataTools()

```ts
static dataTools(): AdvancedFilterOptions;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/filters.ts:454](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/filters.ts#L454)

Helper: filter data tools

###### Returns

[`AdvancedFilterOptions`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#advancedfilteroptions)

##### defiTools()

```ts
static defiTools(): AdvancedFilterOptions;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/filters.ts:432](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/filters.ts#L432)

Helper: filter DeFi tools

###### Returns

[`AdvancedFilterOptions`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#advancedfilteroptions)

##### filter()

```ts
filter(tools: RegisteredTool[], options: AdvancedFilterOptions): RegisteredTool[];
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/filters.ts:280](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/filters.ts#L280)

Apply all filters

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `tools` | [`RegisteredTool`](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#registeredtool)[] |
| `options` | [`AdvancedFilterOptions`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#advancedfilteroptions) |

###### Returns

[`RegisteredTool`](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#registeredtool)[]

##### forChain()

```ts
static forChain(chain: string): AdvancedFilterOptions;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/filters.ts:423](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/filters.ts#L423)

Helper: filter by specific chain

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `chain` | `string` |

###### Returns

[`AdvancedFilterOptions`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#advancedfilteroptions)

##### freeTools()

```ts
static freeTools(): AdvancedFilterOptions;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/filters.ts:385](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/filters.ts#L385)

Helper: filter by free tools

###### Returns

[`AdvancedFilterOptions`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#advancedfilteroptions)

##### fromQueryParams()

```ts
static fromQueryParams(params: Record<string, string | string[]>): AdvancedFilterOptions;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/filters.ts:542](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/filters.ts#L542)

Create filter from query parameters (URL parsing)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `params` | `Record`\<`string`, `string` \| `string`[]\> |

###### Returns

[`AdvancedFilterOptions`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#advancedfilteroptions)

##### highQuality()

```ts
static highQuality(): AdvancedFilterOptions;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/filters.ts:403](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/filters.ts#L403)

Helper: filter by high-quality tools

###### Returns

[`AdvancedFilterOptions`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#advancedfilteroptions)

##### newTools()

```ts
static newTools(daysAgo: number): AdvancedFilterOptions;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/filters.ts:413](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/filters.ts#L413)

Helper: filter by new tools

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `daysAgo` | `number` | `7` |

###### Returns

[`AdvancedFilterOptions`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#advancedfilteroptions)

##### or()

```ts
static or(...conditions: FilterCondition[]): CombinedFilter;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/filters.ts:367](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/filters.ts#L367)

Create a combined filter with OR logic

###### Parameters

| Parameter | Type |
| :------ | :------ |
| ...`conditions` | [`FilterCondition`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#filtercondition)[] |

###### Returns

[`CombinedFilter`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#combinedfilter)

##### premiumTools()

```ts
static premiumTools(minPrice: string): AdvancedFilterOptions;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/filters.ts:394](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/filters.ts#L394)

Helper: filter by premium tools

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `minPrice` | `string` | `"0.01"` |

###### Returns

[`AdvancedFilterOptions`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#advancedfilteroptions)

##### priceRange()

```ts
static priceRange(min?: string, max?: string): PriceRangeFilter;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/filters.ts:353](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/filters.ts#L353)

Create a price range filter

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `min?` | `string` |
| `max?` | `string` |

###### Returns

[`PriceRangeFilter`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#pricerangefilter)

## Variables

### filterEngine

```ts
const filterEngine: FilterEngine;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/filters.ts:595](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/filters.ts#L595)

Singleton instance
