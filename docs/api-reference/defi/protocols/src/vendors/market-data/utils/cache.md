[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/market-data/utils/cache

# defi/protocols/src/vendors/market-data/utils/cache

## Functions

### deleteFromCache()

```ts
function deleteFromCache(key: string): Promise<void>;
```

Defined in: [defi/protocols/src/vendors/market-data/utils/cache.ts:75](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/market-data/utils/cache.ts#L75)

Deletes a key-value pair from the cache JSON file.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `key` | `string` | The key to delete. |

#### Returns

`Promise`\<`void`\>

***

### getFromCache()

```ts
function getFromCache(key: string): Promise<any>;
```

Defined in: [defi/protocols/src/vendors/market-data/utils/cache.ts:60](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/market-data/utils/cache.ts#L60)

Retrieves a value from the cache JSON file by key.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `key` | `string` | The key to retrieve. |

#### Returns

`Promise`\<`any`\>

The cached value or undefined if not found.

***

### saveToCache()

```ts
function saveToCache(key: string, value: any): Promise<void>;
```

Defined in: [defi/protocols/src/vendors/market-data/utils/cache.ts:44](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/market-data/utils/cache.ts#L44)

Saves a key-value pair to the cache JSON file.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `key` | `string` | The key to save. |
| `value` | `any` | The value to save. |

#### Returns

`Promise`\<`void`\>
