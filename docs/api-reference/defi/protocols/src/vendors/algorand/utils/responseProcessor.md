[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/algorand/utils/responseProcessor

# defi/protocols/src/vendors/algorand/utils/responseProcessor

## Classes

### ResponseProcessor

Defined in: [defi/protocols/src/vendors/algorand/utils/responseProcessor.ts:34](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/utils/responseProcessor.ts#L34)

#### Constructors

##### Constructor

```ts
new ResponseProcessor(): ResponseProcessor;
```

###### Returns

[`ResponseProcessor`](/docs/api/defi/protocols/src/vendors/algorand/utils/responseProcessor.md#responseprocessor)

#### Methods

##### processResponse()

```ts
static processResponse(response: any, pageToken?: string): any;
```

Defined in: [defi/protocols/src/vendors/algorand/utils/responseProcessor.ts:169](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/utils/responseProcessor.ts#L169)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `response` | `any` |
| `pageToken?` | `string` |

###### Returns

`any`

##### wrapResourceHandler()

```ts
static wrapResourceHandler<T>(handler: T): T;
```

Defined in: [defi/protocols/src/vendors/algorand/utils/responseProcessor.ts:292](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/utils/responseProcessor.ts#L292)

###### Type Parameters

| Type Parameter |
| :------ |
| `T` *extends* (...`args`: `any`[]) => `Promise`\<`any`\> |

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `handler` | `T` |

###### Returns

`T`

## Interfaces

### PaginatedResponse

Defined in: [defi/protocols/src/vendors/algorand/utils/responseProcessor.ts:19](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/utils/responseProcessor.ts#L19)

#### Type Parameters

| Type Parameter |
| :------ |
| `T` |

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="data"></a> `data` | `T` | [defi/protocols/src/vendors/algorand/utils/responseProcessor.ts:20](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/utils/responseProcessor.ts#L20) |
| <a id="metadata"></a> `metadata` | [`PaginationMetadata`](/docs/api/defi/protocols/src/vendors/algorand/utils/responseProcessor.md#paginationmetadata) & \{ `arrayField?`: `string`; \} | [defi/protocols/src/vendors/algorand/utils/responseProcessor.ts:21](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/utils/responseProcessor.ts#L21) |

***

### PaginationMetadata

Defined in: [defi/protocols/src/vendors/algorand/utils/responseProcessor.ts:10](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/utils/responseProcessor.ts#L10)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="currentpage"></a> `currentPage` | `number` | [defi/protocols/src/vendors/algorand/utils/responseProcessor.ts:13](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/utils/responseProcessor.ts#L13) |
| <a id="hasnextpage"></a> `hasNextPage` | `boolean` | [defi/protocols/src/vendors/algorand/utils/responseProcessor.ts:15](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/utils/responseProcessor.ts#L15) |
| <a id="itemsperpage"></a> `itemsPerPage` | `number` | [defi/protocols/src/vendors/algorand/utils/responseProcessor.ts:12](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/utils/responseProcessor.ts#L12) |
| <a id="pagetoken"></a> `pageToken?` | `string` | [defi/protocols/src/vendors/algorand/utils/responseProcessor.ts:16](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/utils/responseProcessor.ts#L16) |
| <a id="totalitems"></a> `totalItems` | `number` | [defi/protocols/src/vendors/algorand/utils/responseProcessor.ts:11](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/utils/responseProcessor.ts#L11) |
| <a id="totalpages"></a> `totalPages` | `number` | [defi/protocols/src/vendors/algorand/utils/responseProcessor.ts:14](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/utils/responseProcessor.ts#L14) |

***

### ProcessedResponse

Defined in: [defi/protocols/src/vendors/algorand/utils/responseProcessor.ts:26](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/utils/responseProcessor.ts#L26)

#### Indexable

```ts
[key: string]: any
```

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="content"></a> `content?` | `any`[] | [defi/protocols/src/vendors/algorand/utils/responseProcessor.ts:28](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/utils/responseProcessor.ts#L28) |
| <a id="metadata-1"></a> `metadata?` | [`PaginationMetadata`](/docs/api/defi/protocols/src/vendors/algorand/utils/responseProcessor.md#paginationmetadata) & \{ `arrayField?`: `string`; \} | [defi/protocols/src/vendors/algorand/utils/responseProcessor.ts:29](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/utils/responseProcessor.ts#L29) |
