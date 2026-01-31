[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/modules/tool-marketplace/discovery/search

# defi/protocols/src/modules/tool-marketplace/discovery/search

## Classes

### FullTextSearchEngine

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/search.ts:128](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/search.ts#L128)

Full-text search engine using MiniSearch

#### Constructors

##### Constructor

```ts
new FullTextSearchEngine(config: Partial<SearchConfig>): FullTextSearchEngine;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/search.ts:135](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/search.ts#L135)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `config` | `Partial`\<[`SearchConfig`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#searchconfig)\> |

###### Returns

[`FullTextSearchEngine`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/search.md#fulltextsearchengine)

#### Accessors

##### indexedCount

###### Get Signature

```ts
get indexedCount(): number;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/search.ts:496](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/search.ts#L496)

Get total indexed count

###### Returns

`number`

##### ready

###### Get Signature

```ts
get ready(): boolean;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/search.ts:503](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/search.ts#L503)

Check if index is ready

###### Returns

`boolean`

#### Methods

##### addSynonyms()

```ts
addSynonyms(synonymMaps: SynonymMap[]): void;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/search.ts:528](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/search.ts#L528)

Add custom synonyms

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `synonymMaps` | [`SynonymMap`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#synonymmap)[] |

###### Returns

`void`

##### addTool()

```ts
addTool(tool: RegisteredTool): Promise<void>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/search.ts:267](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/search.ts#L267)

Add a single tool to the index

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `tool` | [`RegisteredTool`](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#registeredtool) |

###### Returns

`Promise`\<`void`\>

##### findSimilarQueries()

```ts
findSimilarQueries(query: string): Promise<string[]>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/search.ts:467](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/search.ts#L467)

Find similar queries for "did you mean" functionality

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `query` | `string` |

###### Returns

`Promise`\<`string`[]\>

##### getConfig()

```ts
getConfig(): SearchConfig;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/search.ts:510](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/search.ts#L510)

Get search configuration

###### Returns

[`SearchConfig`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#searchconfig)

##### getSuggestions()

```ts
getSuggestions(partialQuery: string, limit: number): Promise<string[]>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/search.ts:449](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/search.ts#L449)

Get search suggestions based on partial query

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `partialQuery` | `string` | `undefined` |
| `limit` | `number` | `5` |

###### Returns

`Promise`\<`string`[]\>

##### indexTools()

```ts
indexTools(tools: RegisteredTool[]): Promise<void>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/search.ts:241](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/search.ts#L241)

Index a collection of tools

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `tools` | [`RegisteredTool`](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#registeredtool)[] |

###### Returns

`Promise`\<`void`\>

##### removeTool()

```ts
removeTool(toolId: string): Promise<void>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/search.ts:285](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/search.ts#L285)

Remove a tool from the index

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |

###### Returns

`Promise`\<`void`\>

##### search()

```ts
search(options: FullTextSearchOptions): Promise<SearchResult[]>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/search.ts:303](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/search.ts#L303)

Search tools with full-text search

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `options` | [`FullTextSearchOptions`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#fulltextsearchoptions) |

###### Returns

`Promise`\<[`SearchResult`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#searchresult)[]\>

##### updateConfig()

```ts
updateConfig(config: Partial<SearchConfig>): void;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/search.ts:517](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/search.ts#L517)

Update search configuration

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `config` | `Partial`\<[`SearchConfig`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#searchconfig)\> |

###### Returns

`void`

##### updateTool()

```ts
updateTool(tool: RegisteredTool): Promise<void>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/search.ts:295](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/search.ts#L295)

Update a tool in the index

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `tool` | [`RegisteredTool`](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#registeredtool) |

###### Returns

`Promise`\<`void`\>

## Variables

### fullTextSearch

```ts
const fullTextSearch: FullTextSearchEngine;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/search.ts:537](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/search.ts#L537)

Singleton instance
