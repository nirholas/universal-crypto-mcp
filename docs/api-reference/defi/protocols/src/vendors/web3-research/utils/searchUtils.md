[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/web3-research/utils/searchUtils

# defi/protocols/src/vendors/web3-research/utils/searchUtils

## Functions

### fetchContent()

```ts
function fetchContent(
   url: string, 
   format: "text" | "json" | "html" | "markdown", 
retries: number): Promise<string>;
```

Defined in: [defi/protocols/src/vendors/web3-research/utils/searchUtils.ts:69](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/web3-research/utils/searchUtils.ts#L69)

#### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `url` | `string` | `undefined` |
| `format` | `"text"` \| `"json"` \| `"html"` \| `"markdown"` | `"text"` |
| `retries` | `number` | `2` |

#### Returns

`Promise`\<`string`\>

***

### performSearch()

```ts
function performSearch(
   query: string, 
   type: "images" | "web" | "news" | "videos", 
retries: number): Promise<any>;
```

Defined in: [defi/protocols/src/vendors/web3-research/utils/searchUtils.ts:16](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/web3-research/utils/searchUtils.ts#L16)

#### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `query` | `string` | `undefined` |
| `type` | `"images"` \| `"web"` \| `"news"` \| `"videos"` | `"web"` |
| `retries` | `number` | `2` |

#### Returns

`Promise`\<`any`\>

***

### searchMultipleSources()

```ts
function searchMultipleSources(
   tokenName: string, 
   tokenTicker: string, 
sources: string[]): Promise<Record<string, any>>;
```

Defined in: [defi/protocols/src/vendors/web3-research/utils/searchUtils.ts:196](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/web3-research/utils/searchUtils.ts#L196)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `tokenName` | `string` |
| `tokenTicker` | `string` |
| `sources` | `string`[] |

#### Returns

`Promise`\<`Record`\<`string`, `any`\>\>

***

### searchSource()

```ts
function searchSource(
   tokenName: string, 
   tokenTicker: string, 
source: string): Promise<any>;
```

Defined in: [defi/protocols/src/vendors/web3-research/utils/searchUtils.ts:153](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/web3-research/utils/searchUtils.ts#L153)

Get search results for a specific source - completely open approach with additional search terms

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `tokenName` | `string` |
| `tokenTicker` | `string` |
| `source` | `string` |

#### Returns

`Promise`\<`any`\>

***

### sleep()

```ts
function sleep(ms: number): Promise<void>;
```

Defined in: [defi/protocols/src/vendors/web3-research/utils/searchUtils.ts:13](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/web3-research/utils/searchUtils.ts#L13)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `ms` | `number` |

#### Returns

`Promise`\<`void`\>
