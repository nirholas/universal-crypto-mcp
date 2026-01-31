[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/web3-research/types/external

# defi/protocols/src/vendors/web3-research/types/external

## Interfaces

### SearchResponse

Defined in: [defi/protocols/src/vendors/web3-research/types/external.ts:17](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/web3-research/types/external.ts#L17)

#### Indexable

```ts
[key: string]: any
```

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="noresults"></a> `noResults` | `boolean` | [defi/protocols/src/vendors/web3-research/types/external.ts:18](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/web3-research/types/external.ts#L18) |
| <a id="results"></a> `results` | [`SearchResult`](/docs/api/defi/protocols/src/vendors/web3-research/types/external.md#searchresult)[] | [defi/protocols/src/vendors/web3-research/types/external.ts:20](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/web3-research/types/external.ts#L20) |
| <a id="vqd"></a> `vqd?` | `string` | [defi/protocols/src/vendors/web3-research/types/external.ts:19](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/web3-research/types/external.ts#L19) |

***

### SearchResult

Defined in: [defi/protocols/src/vendors/web3-research/types/external.ts:10](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/web3-research/types/external.ts#L10)

#### Indexable

```ts
[key: string]: any
```

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="description"></a> `description` | `string` | [defi/protocols/src/vendors/web3-research/types/external.ts:13](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/web3-research/types/external.ts#L13) |
| <a id="title"></a> `title` | `string` | [defi/protocols/src/vendors/web3-research/types/external.ts:11](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/web3-research/types/external.ts#L11) |
| <a id="url"></a> `url` | `string` | [defi/protocols/src/vendors/web3-research/types/external.ts:12](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/web3-research/types/external.ts#L12) |

## Functions

### images()

```ts
function images(query: string, options?: any): Promise<any>;
```

Defined in: [defi/protocols/src/vendors/web3-research/types/external.ts:26](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/web3-research/types/external.ts#L26)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `query` | `string` |
| `options?` | `any` |

#### Returns

`Promise`\<`any`\>

***

### news()

```ts
function news(query: string, options?: any): Promise<SearchResponse>;
```

Defined in: [defi/protocols/src/vendors/web3-research/types/external.ts:25](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/web3-research/types/external.ts#L25)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `query` | `string` |
| `options?` | `any` |

#### Returns

`Promise`\<[`SearchResponse`](/docs/api/defi/protocols/src/vendors/web3-research/types/external.md#searchresponse)\>

***

### search()

```ts
function search(query: string, options?: any): Promise<SearchResponse>;
```

Defined in: [defi/protocols/src/vendors/web3-research/types/external.ts:24](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/web3-research/types/external.ts#L24)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `query` | `string` |
| `options?` | `any` |

#### Returns

`Promise`\<[`SearchResponse`](/docs/api/defi/protocols/src/vendors/web3-research/types/external.md#searchresponse)\>

***

### videos()

```ts
function videos(query: string, options?: any): Promise<any>;
```

Defined in: [defi/protocols/src/vendors/web3-research/types/external.ts:27](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/web3-research/types/external.ts#L27)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `query` | `string` |
| `options?` | `any` |

#### Returns

`Promise`\<`any`\>
