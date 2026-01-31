[**Universal Crypto MCP API Reference v1.0.0**](../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/utils/rateLimiter

# defi/protocols/src/utils/rateLimiter

## Classes

### RateLimiter

Defined in: [defi/protocols/src/utils/rateLimiter.ts:16](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/rateLimiter.ts#L16)

#### Constructors

##### Constructor

```ts
new RateLimiter(options: RateLimiterOptions): RateLimiter;
```

Defined in: [defi/protocols/src/utils/rateLimiter.ts:23](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/rateLimiter.ts#L23)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `options` | `RateLimiterOptions` |

###### Returns

[`RateLimiter`](/docs/api/defi/protocols/src/utils/rateLimiter.md#ratelimiter)

#### Methods

##### acquire()

```ts
acquire(tokens: number): Promise<void>;
```

Defined in: [defi/protocols/src/utils/rateLimiter.ts:62](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/rateLimiter.ts#L62)

Wait until a token is available

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `tokens` | `number` | `1` |

###### Returns

`Promise`\<`void`\>

##### canAcquire()

```ts
canAcquire(tokens: number): boolean;
```

Defined in: [defi/protocols/src/utils/rateLimiter.ts:83](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/rateLimiter.ts#L83)

Check if rate limit would allow request

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `tokens` | `number` | `1` |

###### Returns

`boolean`

##### getAvailableTokens()

```ts
getAvailableTokens(): number;
```

Defined in: [defi/protocols/src/utils/rateLimiter.ts:75](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/rateLimiter.ts#L75)

Get current token count

###### Returns

`number`

##### tryAcquire()

```ts
tryAcquire(tokens: number): boolean;
```

Defined in: [defi/protocols/src/utils/rateLimiter.ts:48](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/rateLimiter.ts#L48)

Try to acquire a token. Returns true if successful.

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `tokens` | `number` | `1` |

###### Returns

`boolean`

## Variables

### binanceRateLimiter

```ts
const binanceRateLimiter: RateLimiter;
```

Defined in: [defi/protocols/src/utils/rateLimiter.ts:96](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/rateLimiter.ts#L96)

***

### coingeckoRateLimiter

```ts
const coingeckoRateLimiter: RateLimiter;
```

Defined in: [defi/protocols/src/utils/rateLimiter.ts:102](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/rateLimiter.ts#L102)

***

### defaultRateLimiter

```ts
const defaultRateLimiter: RateLimiter;
```

Defined in: [defi/protocols/src/utils/rateLimiter.ts:90](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/rateLimiter.ts#L90)

## Functions

### batchWithRateLimit()

```ts
function batchWithRateLimit<T, R>(
   items: T[], 
   processor: (item: T) => Promise<R>, 
   limiter: RateLimiter, 
batchSize: number): Promise<R[]>;
```

Defined in: [defi/protocols/src/utils/rateLimiter.ts:148](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/rateLimiter.ts#L148)

Batch requests with rate limiting

#### Type Parameters

| Type Parameter |
| :------ |
| `T` |
| `R` |

#### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `items` | `T`[] | `undefined` |
| `processor` | (`item`: `T`) => `Promise`\<`R`\> | `undefined` |
| `limiter` | [`RateLimiter`](/docs/api/defi/protocols/src/utils/rateLimiter.md#ratelimiter) | `undefined` |
| `batchSize` | `number` | `5` |

#### Returns

`Promise`\<`R`[]\>

***

### getRateLimiter()

```ts
function getRateLimiter(key: string, options?: RateLimiterOptions): RateLimiter;
```

Defined in: [defi/protocols/src/utils/rateLimiter.ts:114](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/rateLimiter.ts#L114)

Get or create a rate limiter for a specific endpoint

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `key` | `string` |
| `options?` | `RateLimiterOptions` |

#### Returns

[`RateLimiter`](/docs/api/defi/protocols/src/utils/rateLimiter.md#ratelimiter)

***

### withRateLimit()

```ts
function withRateLimit<T, R>(limiter: RateLimiter, tokens: number): (fn: (...args: T) => Promise<R>) => (...args: T) => Promise<R>;
```

Defined in: [defi/protocols/src/utils/rateLimiter.ts:133](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/rateLimiter.ts#L133)

Decorator-like function for rate limiting async functions

#### Type Parameters

| Type Parameter |
| :------ |
| `T` *extends* `unknown`[] |
| `R` |

#### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `limiter` | [`RateLimiter`](/docs/api/defi/protocols/src/utils/rateLimiter.md#ratelimiter) | `undefined` |
| `tokens` | `number` | `1` |

#### Returns

```ts
(fn: (...args: T) => Promise<R>): (...args: T) => Promise<R>;
```

##### Parameters

| Parameter | Type |
| :------ | :------ |
| `fn` | (...`args`: `T`) => `Promise`\<`R`\> |

##### Returns

```ts
(...args: T): Promise<R>;
```

###### Parameters

| Parameter | Type |
| :------ | :------ |
| ...`args` | `T` |

###### Returns

`Promise`\<`R`\>
