[**Universal Crypto MCP API Reference v1.0.0**](../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/utils/cache

# defi/protocols/src/utils/cache

## Classes

### Cache

Defined in: [defi/protocols/src/utils/cache.ts:15](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/cache.ts#L15)

#### Type Parameters

| Type Parameter | Default type |
| :------ | :------ |
| `T` | `unknown` |

#### Constructors

##### Constructor

```ts
new Cache<T>(defaultTtlMs: number): Cache<T>;
```

Defined in: [defi/protocols/src/utils/cache.ts:19](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/cache.ts#L19)

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `defaultTtlMs` | `number` | `60_000` |

###### Returns

[`Cache`](/docs/api/defi/protocols/src/utils/cache.md#cache)\<`T`\>

#### Accessors

##### size

###### Get Signature

```ts
get size(): number;
```

Defined in: [defi/protocols/src/utils/cache.ts:73](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/cache.ts#L73)

Get cache size (including expired entries)

###### Returns

`number`

#### Methods

##### cleanup()

```ts
cleanup(): number;
```

Defined in: [defi/protocols/src/utils/cache.ts:80](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/cache.ts#L80)

Clean up expired entries

###### Returns

`number`

##### clear()

```ts
clear(): void;
```

Defined in: [defi/protocols/src/utils/cache.ts:66](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/cache.ts#L66)

Clear all entries from cache

###### Returns

`void`

##### delete()

```ts
delete(key: string): boolean;
```

Defined in: [defi/protocols/src/utils/cache.ts:59](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/cache.ts#L59)

Delete a key from cache

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `key` | `string` |

###### Returns

`boolean`

##### get()

```ts
get(key: string): T | undefined;
```

Defined in: [defi/protocols/src/utils/cache.ts:26](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/cache.ts#L26)

Get a value from cache

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `key` | `string` |

###### Returns

`T` \| `undefined`

##### getOrSet()

```ts
getOrSet(
   key: string, 
   factory: () => Promise<T>, 
ttlMs?: number): Promise<T>;
```

Defined in: [defi/protocols/src/utils/cache.ts:97](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/cache.ts#L97)

Get or set a value using a factory function

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `key` | `string` |
| `factory` | () => `Promise`\<`T`\> |
| `ttlMs?` | `number` |

###### Returns

`Promise`\<`T`\>

##### has()

```ts
has(key: string): boolean;
```

Defined in: [defi/protocols/src/utils/cache.ts:52](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/cache.ts#L52)

Check if key exists and is not expired

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `key` | `string` |

###### Returns

`boolean`

##### set()

```ts
set(
   key: string, 
   value: T, 
   ttlMs?: number): void;
```

Defined in: [defi/protocols/src/utils/cache.ts:44](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/cache.ts#L44)

Set a value in cache with optional TTL

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `key` | `string` |
| `value` | `T` |
| `ttlMs?` | `number` |

###### Returns

`void`

## Variables

### apiCache

```ts
const apiCache: Cache<unknown>;
```

Defined in: [defi/protocols/src/utils/cache.ts:114](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/cache.ts#L114)

***

### marketDataCache

```ts
const marketDataCache: Cache<unknown>;
```

Defined in: [defi/protocols/src/utils/cache.ts:116](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/cache.ts#L116)

***

### priceCache

```ts
const priceCache: Cache<unknown>;
```

Defined in: [defi/protocols/src/utils/cache.ts:115](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/cache.ts#L115)

## Functions

### withCache()

```ts
function withCache<T>(
   cache: Cache<T>, 
   keyFn: (...args: unknown[]) => string, 
ttlMs?: number): (fn: (...args: unknown[]) => Promise<T>) => (...args: unknown[]) => Promise<T>;
```

Defined in: [defi/protocols/src/utils/cache.ts:121](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/cache.ts#L121)

Decorator-like function for caching async function results

#### Type Parameters

| Type Parameter |
| :------ |
| `T` |

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `cache` | [`Cache`](/docs/api/defi/protocols/src/utils/cache.md#cache)\<`T`\> |
| `keyFn` | (...`args`: `unknown`[]) => `string` |
| `ttlMs?` | `number` |

#### Returns

```ts
(fn: (...args: unknown[]) => Promise<T>): (...args: unknown[]) => Promise<T>;
```

##### Parameters

| Parameter | Type |
| :------ | :------ |
| `fn` | (...`args`: `unknown`[]) => `Promise`\<`T`\> |

##### Returns

```ts
(...args: unknown[]): Promise<T>;
```

###### Parameters

| Parameter | Type |
| :------ | :------ |
| ...`args` | `unknown`[] |

###### Returns

`Promise`\<`T`\>
