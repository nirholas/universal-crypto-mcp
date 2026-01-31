[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/payments/utils/retry

# defi/protocols/src/vendors/payments/utils/retry

## Classes

### RateLimiter

Defined in: [defi/protocols/src/vendors/payments/utils/retry.ts:245](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/retry.ts#L245)

#### Constructors

##### Constructor

```ts
new RateLimiter(maxRequests: number, timeWindowMs: number): RateLimiter;
```

Defined in: [defi/protocols/src/vendors/payments/utils/retry.ts:248](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/retry.ts#L248)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `maxRequests` | `number` |
| `timeWindowMs` | `number` |

###### Returns

[`RateLimiter`](/docs/api/defi/protocols/src/vendors/payments/utils/retry.md#ratelimiter)

#### Methods

##### getRetryAfter()

```ts
getRetryAfter(): number;
```

Defined in: [defi/protocols/src/vendors/payments/utils/retry.ts:275](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/retry.ts#L275)

Get time until next request is allowed

###### Returns

`number`

##### getStats()

```ts
getStats(): {
  currentRequests: number;
  maxRequests: number;
  nextResetMs: number;
  timeWindowMs: number;
};
```

Defined in: [defi/protocols/src/vendors/payments/utils/retry.ts:296](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/retry.ts#L296)

Get current usage statistics

###### Returns

```ts
{
  currentRequests: number;
  maxRequests: number;
  nextResetMs: number;
  timeWindowMs: number;
}
```

| Name | Type | Defined in |
| :------ | :------ | :------ |
| `currentRequests` | `number` | [defi/protocols/src/vendors/payments/utils/retry.ts:297](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/retry.ts#L297) |
| `maxRequests` | `number` | [defi/protocols/src/vendors/payments/utils/retry.ts:298](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/retry.ts#L298) |
| `nextResetMs` | `number` | [defi/protocols/src/vendors/payments/utils/retry.ts:300](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/retry.ts#L300) |
| `timeWindowMs` | `number` | [defi/protocols/src/vendors/payments/utils/retry.ts:299](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/retry.ts#L299) |

##### isAllowed()

```ts
isAllowed(): boolean;
```

Defined in: [defi/protocols/src/vendors/payments/utils/retry.ts:256](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/retry.ts#L256)

Check if request is allowed under rate limit

###### Returns

`boolean`

##### reset()

```ts
reset(): void;
```

Defined in: [defi/protocols/src/vendors/payments/utils/retry.ts:289](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/retry.ts#L289)

Reset rate limiter

###### Returns

`void`

***

### RetryableError

Defined in: [defi/protocols/src/vendors/payments/utils/retry.ts:28](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/retry.ts#L28)

#### Extends

- `Error`

#### Constructors

##### Constructor

```ts
new RetryableError(message: string, retryAfter?: number): RetryableError;
```

Defined in: [defi/protocols/src/vendors/payments/utils/retry.ts:29](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/retry.ts#L29)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `message` | `string` |
| `retryAfter?` | `number` |

###### Returns

[`RetryableError`](/docs/api/defi/protocols/src/vendors/payments/utils/retry.md#retryableerror)

###### Overrides

```ts
Error.constructor
```

#### Properties

| Property | Modifier | Type | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="retryafter"></a> `retryAfter?` | `readonly` | `number` | [defi/protocols/src/vendors/payments/utils/retry.ts:31](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/retry.ts#L31) |

***

### RetryExhaustedError

Defined in: [defi/protocols/src/vendors/payments/utils/retry.ts:38](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/retry.ts#L38)

#### Extends

- `Error`

#### Constructors

##### Constructor

```ts
new RetryExhaustedError(
   message: string, 
   attempts: number, 
   lastError?: Error): RetryExhaustedError;
```

Defined in: [defi/protocols/src/vendors/payments/utils/retry.ts:39](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/retry.ts#L39)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `message` | `string` |
| `attempts` | `number` |
| `lastError?` | `Error` |

###### Returns

[`RetryExhaustedError`](/docs/api/defi/protocols/src/vendors/payments/utils/retry.md#retryexhaustederror)

###### Overrides

```ts
Error.constructor
```

#### Properties

| Property | Modifier | Type | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="attempts"></a> `attempts` | `readonly` | `number` | [defi/protocols/src/vendors/payments/utils/retry.ts:41](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/retry.ts#L41) |
| <a id="lasterror"></a> `lastError?` | `readonly` | `Error` | [defi/protocols/src/vendors/payments/utils/retry.ts:42](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/retry.ts#L42) |

***

### RetryManager

Defined in: [defi/protocols/src/vendors/payments/utils/retry.ts:49](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/retry.ts#L49)

#### Constructors

##### Constructor

```ts
new RetryManager(options: Partial<RetryOptions>): RetryManager;
```

Defined in: [defi/protocols/src/vendors/payments/utils/retry.ts:58](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/retry.ts#L58)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `options` | `Partial`\<[`RetryOptions`](/docs/api/defi/protocols/src/vendors/payments/utils/retry.md#retryoptions)\> |

###### Returns

[`RetryManager`](/docs/api/defi/protocols/src/vendors/payments/utils/retry.md#retrymanager)

#### Methods

##### createRateLimitError()

```ts
static createRateLimitError(retryAfterMs?: number): RetryableError;
```

Defined in: [defi/protocols/src/vendors/payments/utils/retry.ts:232](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/retry.ts#L232)

Create retry-specific error for rate limiting

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `retryAfterMs?` | `number` |

###### Returns

[`RetryableError`](/docs/api/defi/protocols/src/vendors/payments/utils/retry.md#retryableerror)

##### createServiceUnavailableError()

```ts
static createServiceUnavailableError(retryAfterMs?: number): RetryableError;
```

Defined in: [defi/protocols/src/vendors/payments/utils/retry.ts:239](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/retry.ts#L239)

Create retry-specific error for service unavailable

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `retryAfterMs?` | `number` |

###### Returns

[`RetryableError`](/docs/api/defi/protocols/src/vendors/payments/utils/retry.md#retryableerror)

##### executeWithRetry()

```ts
executeWithRetry<T>(operation: (context: RetryContext) => Promise<T>, operationName?: string): Promise<T>;
```

Defined in: [defi/protocols/src/vendors/payments/utils/retry.ts:65](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/retry.ts#L65)

Execute function with retry logic

###### Type Parameters

| Type Parameter |
| :------ |
| `T` |

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `operation` | (`context`: [`RetryContext`](/docs/api/defi/protocols/src/vendors/payments/utils/retry.md#retrycontext)) => `Promise`\<`T`\> |
| `operationName?` | `string` |

###### Returns

`Promise`\<`T`\>

## Interfaces

### RetryContext

Defined in: [defi/protocols/src/vendors/payments/utils/retry.ts:21](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/retry.ts#L21)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="attempt"></a> `attempt` | `number` | [defi/protocols/src/vendors/payments/utils/retry.ts:22](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/retry.ts#L22) |
| <a id="lasterror-1"></a> `lastError?` | `Error` | [defi/protocols/src/vendors/payments/utils/retry.ts:24](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/retry.ts#L24) |
| <a id="totalattempts"></a> `totalAttempts` | `number` | [defi/protocols/src/vendors/payments/utils/retry.ts:23](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/retry.ts#L23) |
| <a id="totaldelay"></a> `totalDelay` | `number` | [defi/protocols/src/vendors/payments/utils/retry.ts:25](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/retry.ts#L25) |

***

### RetryOptions

Defined in: [defi/protocols/src/vendors/payments/utils/retry.ts:13](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/retry.ts#L13)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="backofffactor"></a> `backoffFactor` | `number` | [defi/protocols/src/vendors/payments/utils/retry.ts:17](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/retry.ts#L17) |
| <a id="basedelay"></a> `baseDelay` | `number` | [defi/protocols/src/vendors/payments/utils/retry.ts:15](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/retry.ts#L15) |
| <a id="jitter"></a> `jitter` | `boolean` | [defi/protocols/src/vendors/payments/utils/retry.ts:18](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/retry.ts#L18) |
| <a id="maxdelay"></a> `maxDelay` | `number` | [defi/protocols/src/vendors/payments/utils/retry.ts:16](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/retry.ts#L16) |
| <a id="maxretries"></a> `maxRetries` | `number` | [defi/protocols/src/vendors/payments/utils/retry.ts:14](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/retry.ts#L14) |

## Functions

### createRateLimiter()

```ts
function createRateLimiter(maxRequests: number, timeWindowMs: number): RateLimiter;
```

Defined in: [defi/protocols/src/vendors/payments/utils/retry.ts:325](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/retry.ts#L325)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `maxRequests` | `number` |
| `timeWindowMs` | `number` |

#### Returns

[`RateLimiter`](/docs/api/defi/protocols/src/vendors/payments/utils/retry.md#ratelimiter)

***

### createRetryManager()

```ts
function createRetryManager(options?: Partial<RetryOptions>): RetryManager;
```

Defined in: [defi/protocols/src/vendors/payments/utils/retry.ts:319](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/retry.ts#L319)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `options?` | `Partial`\<[`RetryOptions`](/docs/api/defi/protocols/src/vendors/payments/utils/retry.md#retryoptions)\> |

#### Returns

[`RetryManager`](/docs/api/defi/protocols/src/vendors/payments/utils/retry.md#retrymanager)

## References

### default

Renames and re-exports [RetryManager](/docs/api/defi/protocols/src/vendors/payments/utils/retry.md#retrymanager)
