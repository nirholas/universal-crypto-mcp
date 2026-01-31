[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/modules/tool-marketplace/discovery/semantic

# defi/protocols/src/modules/tool-marketplace/discovery/semantic

## Classes

### SemanticSearchEngine

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/semantic.ts:61](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/semantic.ts#L61)

Semantic search engine using OpenAI embeddings

#### Constructors

##### Constructor

```ts
new SemanticSearchEngine(options: {
  apiKey?: string;
  cacheEnabled?: boolean;
  dimensions?: number;
  model?: string;
}): SemanticSearchEngine;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/semantic.ts:70](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/semantic.ts#L70)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `options` | \{ `apiKey?`: `string`; `cacheEnabled?`: `boolean`; `dimensions?`: `number`; `model?`: `string`; \} |
| `options.apiKey?` | `string` |
| `options.cacheEnabled?` | `boolean` |
| `options.dimensions?` | `number` |
| `options.model?` | `string` |

###### Returns

[`SemanticSearchEngine`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/semantic.md#semanticsearchengine)

#### Accessors

##### embeddingsCount

###### Get Signature

```ts
get embeddingsCount(): number;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/semantic.ts:403](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/semantic.ts#L403)

Get cached embeddings count

###### Returns

`number`

##### ready

###### Get Signature

```ts
get ready(): boolean;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/semantic.ts:100](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/semantic.ts#L100)

Check if engine is ready

###### Returns

`boolean`

##### toolCount

###### Get Signature

```ts
get toolCount(): number;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/semantic.ts:410](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/semantic.ts#L410)

Get tool count

###### Returns

`number`

#### Methods

##### addTool()

```ts
addTool(tool: RegisteredTool): Promise<void>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/semantic.ts:227](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/semantic.ts#L227)

Add a single tool to the index

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `tool` | [`RegisteredTool`](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#registeredtool) |

###### Returns

`Promise`\<`void`\>

##### calculateToolSimilarity()

```ts
calculateToolSimilarity(toolIdA: string, toolIdB: string): Promise<number>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/semantic.ts:448](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/semantic.ts#L448)

Calculate similarity between two tools

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolIdA` | `string` |
| `toolIdB` | `string` |

###### Returns

`Promise`\<`number`\>

##### clearCache()

```ts
clearCache(): void;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/semantic.ts:417](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/semantic.ts#L417)

Clear embedding cache

###### Returns

`void`

##### clusterTools()

```ts
clusterTools(numClusters: number): Promise<Map<number, string[]>>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/semantic.ts:462](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/semantic.ts#L462)

Cluster tools by similarity (simple k-means-like approach)

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `numClusters` | `number` | `5` |

###### Returns

`Promise`\<`Map`\<`number`, `string`[]\>\>

##### exportEmbeddings()

```ts
exportEmbeddings(): ToolEmbedding[];
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/semantic.ts:424](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/semantic.ts#L424)

Export embeddings for persistence

###### Returns

[`ToolEmbedding`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#toolembedding)[]

##### findSimilar()

```ts
findSimilar(toolId: string, options: {
  limit?: number;
  minSimilarity?: number;
}): Promise<SearchResult[]>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/semantic.ts:326](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/semantic.ts#L326)

Find tools similar to a given tool

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |
| `options` | \{ `limit?`: `number`; `minSimilarity?`: `number`; \} |
| `options.limit?` | `number` |
| `options.minSimilarity?` | `number` |

###### Returns

`Promise`\<[`SearchResult`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#searchresult)[]\>

##### getToolEmbedding()

```ts
getToolEmbedding(toolId: string): 
  | ToolEmbedding
  | undefined;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/semantic.ts:441](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/semantic.ts#L441)

Get embedding for a specific tool

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |

###### Returns

  \| [`ToolEmbedding`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#toolembedding)
  \| `undefined`

##### importEmbeddings()

```ts
importEmbeddings(embeddings: ToolEmbedding[]): void;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/semantic.ts:431](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/semantic.ts#L431)

Import embeddings from persistence

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `embeddings` | [`ToolEmbedding`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#toolembedding)[] |

###### Returns

`void`

##### indexTools()

```ts
indexTools(tools: RegisteredTool[]): Promise<void>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/semantic.ts:143](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/semantic.ts#L143)

Index a collection of tools

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `tools` | [`RegisteredTool`](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#registeredtool)[] |

###### Returns

`Promise`\<`void`\>

##### initialize()

```ts
initialize(apiKey: string): void;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/semantic.ts:91](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/semantic.ts#L91)

Initialize with API key

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `apiKey` | `string` |

###### Returns

`void`

##### naturalLanguageSearch()

```ts
naturalLanguageSearch(query: string, options: {
  limit?: number;
  minSimilarity?: number;
}): Promise<SearchResult[]>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/semantic.ts:341](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/semantic.ts#L341)

Natural language search

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `query` | `string` |
| `options` | \{ `limit?`: `number`; `minSimilarity?`: `number`; \} |
| `options.limit?` | `number` |
| `options.minSimilarity?` | `number` |

###### Returns

`Promise`\<[`SearchResult`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#searchresult)[]\>

##### removeTool()

```ts
removeTool(toolId: string): Promise<void>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/semantic.ts:235](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/semantic.ts#L235)

Remove a tool from the index

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |

###### Returns

`Promise`\<`void`\>

##### search()

```ts
search(options: SemanticSearchOptions): Promise<SearchResult[]>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/semantic.ts:254](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/semantic.ts#L254)

Search tools using semantic similarity

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `options` | [`SemanticSearchOptions`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#semanticsearchoptions) |

###### Returns

`Promise`\<[`SearchResult`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#searchresult)[]\>

##### updateTool()

```ts
updateTool(tool: RegisteredTool): Promise<void>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/semantic.ts:243](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/semantic.ts#L243)

Update a tool in the index

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `tool` | [`RegisteredTool`](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#registeredtool) |

###### Returns

`Promise`\<`void`\>

## Variables

### semanticSearch

```ts
const semanticSearch: SemanticSearchEngine;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/semantic.ts:516](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/semantic.ts#L516)

Singleton instance
