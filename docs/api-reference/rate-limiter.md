[**Universal Crypto MCP API Reference v1.0.0**](index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / rate-limiter

# rate-limiter

Token Bucket Rate Limiter

Implements a token bucket algorithm for rate limiting API calls.
Supports multiple buckets per key (e.g., per API endpoint or per user).

## Author

nich <nich@nichxbt.com>

## Classes

### RateLimiter

Defined in: [shared/utils/src/rate-limiter/index.ts:54](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/rate-limiter/index.ts#L54)

Token Bucket Rate Limiter

#### Example

```typescript
const limiter = new RateLimiter({
  maxTokens: 100,
  refillRate: 10,
  refillInterval: 1000 // 10 tokens per second
});

const result = await limiter.acquire('api-key');
if (result.allowed) {
  // Make API call
} else {
  // Wait or reject
  console.log(`Retry after ${result.retryAfter}ms`);
}
```

#### Constructors

##### Constructor

```ts
new RateLimiter(config: RateLimiterConfig): RateLimiter;
```

Defined in: [shared/utils/src/rate-limiter/index.ts:58](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/rate-limiter/index.ts#L58)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `config` | [`RateLimiterConfig`](/docs/api/rate-limiter.md#ratelimiterconfig) |

###### Returns

[`RateLimiter`](/docs/api/rate-limiter.md#ratelimiter)

#### Methods

##### acquire()

```ts
acquire(key: string, tokens: number): Promise<RateLimitResult>;
```

Defined in: [shared/utils/src/rate-limiter/index.ts:128](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/rate-limiter/index.ts#L128)

Acquire a token, waiting if necessary

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `key` | `string` | `'default'` |
| `tokens` | `number` | `1` |

###### Returns

`Promise`\<[`RateLimitResult`](/docs/api/rate-limiter.md#ratelimitresult)\>

##### getStatus()

```ts
getStatus(key: string): {
  maxTokens: number;
  refillRate: number;
  tokens: number;
};
```

Defined in: [shared/utils/src/rate-limiter/index.ts:151](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/rate-limiter/index.ts#L151)

Get current status for a key

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `key` | `string` | `'default'` |

###### Returns

```ts
{
  maxTokens: number;
  refillRate: number;
  tokens: number;
}
```

| Name | Type | Defined in |
| :------ | :------ | :------ |
| `maxTokens` | `number` | [shared/utils/src/rate-limiter/index.ts:151](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/rate-limiter/index.ts#L151) |
| `refillRate` | `number` | [shared/utils/src/rate-limiter/index.ts:151](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/rate-limiter/index.ts#L151) |
| `tokens` | `number` | [shared/utils/src/rate-limiter/index.ts:151](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/rate-limiter/index.ts#L151) |

##### reset()

```ts
reset(key: string): void;
```

Defined in: [shared/utils/src/rate-limiter/index.ts:164](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/rate-limiter/index.ts#L164)

Reset a specific bucket

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `key` | `string` |

###### Returns

`void`

##### resetAll()

```ts
resetAll(): void;
```

Defined in: [shared/utils/src/rate-limiter/index.ts:171](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/rate-limiter/index.ts#L171)

Reset all buckets

###### Returns

`void`

##### tryAcquire()

```ts
tryAcquire(key: string, tokens: number): RateLimitResult;
```

Defined in: [shared/utils/src/rate-limiter/index.ts:100](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/rate-limiter/index.ts#L100)

Try to acquire a token immediately (non-blocking)

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `key` | `string` | `'default'` |
| `tokens` | `number` | `1` |

###### Returns

[`RateLimitResult`](/docs/api/rate-limiter.md#ratelimitresult)

***

### RateLimiterRegistry

Defined in: [shared/utils/src/rate-limiter/index.ts:303](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/rate-limiter/index.ts#L303)

Rate limiter registry for managing multiple limiters

#### Constructors

##### Constructor

```ts
new RateLimiterRegistry(): RateLimiterRegistry;
```

###### Returns

[`RateLimiterRegistry`](/docs/api/rate-limiter.md#ratelimiterregistry)

#### Methods

##### acquire()

```ts
acquire(name: string, key?: string): Promise<RateLimitResult>;
```

Defined in: [shared/utils/src/rate-limiter/index.ts:324](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/rate-limiter/index.ts#L324)

Acquire a token from a named limiter

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `name` | `string` |
| `key?` | `string` |

###### Returns

`Promise`\<[`RateLimitResult`](/docs/api/rate-limiter.md#ratelimitresult)\>

##### get()

```ts
get(name: string, config?: RateLimiterConfig): RateLimiter;
```

Defined in: [shared/utils/src/rate-limiter/index.ts:309](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/rate-limiter/index.ts#L309)

Get or create a rate limiter for an API

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `name` | `string` |
| `config?` | [`RateLimiterConfig`](/docs/api/rate-limiter.md#ratelimiterconfig) |

###### Returns

[`RateLimiter`](/docs/api/rate-limiter.md#ratelimiter)

##### tryAcquire()

```ts
tryAcquire(name: string, key?: string): RateLimitResult;
```

Defined in: [shared/utils/src/rate-limiter/index.ts:331](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/rate-limiter/index.ts#L331)

Try to acquire without waiting

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `name` | `string` |
| `key?` | `string` |

###### Returns

[`RateLimitResult`](/docs/api/rate-limiter.md#ratelimitresult)

***

### SlidingWindowRateLimiter

Defined in: [shared/utils/src/rate-limiter/index.ts:186](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/rate-limiter/index.ts#L186)

Sliding Window Rate Limiter

More accurate than token bucket for strict rate limits.
Tracks individual request timestamps.

#### Constructors

##### Constructor

```ts
new SlidingWindowRateLimiter(config: {
  maxRequests: number;
  windowSizeMs: number;
}): SlidingWindowRateLimiter;
```

Defined in: [shared/utils/src/rate-limiter/index.ts:191](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/rate-limiter/index.ts#L191)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `config` | \{ `maxRequests`: `number`; `windowSizeMs`: `number`; \} |
| `config.maxRequests` | `number` |
| `config.windowSizeMs` | `number` |

###### Returns

[`SlidingWindowRateLimiter`](/docs/api/rate-limiter.md#slidingwindowratelimiter)

#### Methods

##### acquire()

```ts
acquire(key: string, maxWaitTime: number): Promise<RateLimitResult>;
```

Defined in: [shared/utils/src/rate-limiter/index.ts:233](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/rate-limiter/index.ts#L233)

Acquire with waiting

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `key` | `string` | `'default'` |
| `maxWaitTime` | `number` | `30000` |

###### Returns

`Promise`\<[`RateLimitResult`](/docs/api/rate-limiter.md#ratelimitresult)\>

##### reset()

```ts
reset(key: string): void;
```

Defined in: [shared/utils/src/rate-limiter/index.ts:252](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/rate-limiter/index.ts#L252)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `key` | `string` |

###### Returns

`void`

##### resetAll()

```ts
resetAll(): void;
```

Defined in: [shared/utils/src/rate-limiter/index.ts:256](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/rate-limiter/index.ts#L256)

###### Returns

`void`

##### tryAcquire()

```ts
tryAcquire(key: string): RateLimitResult;
```

Defined in: [shared/utils/src/rate-limiter/index.ts:199](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/rate-limiter/index.ts#L199)

Check if request is allowed and record it

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `key` | `string` | `'default'` |

###### Returns

[`RateLimitResult`](/docs/api/rate-limiter.md#ratelimitresult)

## Interfaces

### RateLimiterBucket

Defined in: [shared/utils/src/rate-limiter/index.ts:22](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/rate-limiter/index.ts#L22)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="lastrefill"></a> `lastRefill` | `number` | [shared/utils/src/rate-limiter/index.ts:24](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/rate-limiter/index.ts#L24) |
| <a id="tokens"></a> `tokens` | `number` | [shared/utils/src/rate-limiter/index.ts:23](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/rate-limiter/index.ts#L23) |

***

### RateLimiterConfig

Defined in: [shared/utils/src/rate-limiter/index.ts:11](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/rate-limiter/index.ts#L11)

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="maxtokens"></a> `maxTokens` | `number` | Maximum number of tokens in the bucket | [shared/utils/src/rate-limiter/index.ts:13](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/rate-limiter/index.ts#L13) |
| <a id="maxwaittime"></a> `maxWaitTime?` | `number` | Optional: Maximum wait time for acquiring a token (ms) | [shared/utils/src/rate-limiter/index.ts:19](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/rate-limiter/index.ts#L19) |
| <a id="refillinterval"></a> `refillInterval` | `number` | Refill interval in milliseconds | [shared/utils/src/rate-limiter/index.ts:17](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/rate-limiter/index.ts#L17) |
| <a id="refillrate"></a> `refillRate` | `number` | Number of tokens to refill per interval | [shared/utils/src/rate-limiter/index.ts:15](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/rate-limiter/index.ts#L15) |

***

### RateLimitResult

Defined in: [shared/utils/src/rate-limiter/index.ts:27](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/rate-limiter/index.ts#L27)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="allowed"></a> `allowed` | `boolean` | [shared/utils/src/rate-limiter/index.ts:28](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/rate-limiter/index.ts#L28) |
| <a id="remainingtokens"></a> `remainingTokens` | `number` | [shared/utils/src/rate-limiter/index.ts:29](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/rate-limiter/index.ts#L29) |
| <a id="resettime"></a> `resetTime` | `number` | [shared/utils/src/rate-limiter/index.ts:30](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/rate-limiter/index.ts#L30) |
| <a id="retryafter"></a> `retryAfter?` | `number` | [shared/utils/src/rate-limiter/index.ts:31](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/rate-limiter/index.ts#L31) |

## Variables

### API\_RATE\_LIMITS

```ts
const API_RATE_LIMITS: {
  bitget: {
     maxTokens: 10;
     refillInterval: 1000;
     refillRate: 10;
  };
  coingecko: {
     maxTokens: 10;
     refillInterval: 60000;
     refillRate: 10;
  };
  coingeckoPro: {
     maxTokens: 500;
     refillInterval: 60000;
     refillRate: 500;
  };
  cryptocompare: {
     maxTokens: 50;
     refillInterval: 60000;
     refillRate: 50;
  };
  dune: {
     maxTokens: 40;
     refillInterval: 60000;
     refillRate: 40;
  };
  etherscan: {
     maxTokens: 5;
     refillInterval: 1000;
     refillRate: 5;
  };
  etherscanPro: {
     maxTokens: 10;
     refillInterval: 1000;
     refillRate: 10;
  };
  exchange: {
     maxTokens: 10;
     refillInterval: 1000;
     refillRate: 10;
  };
  exchangePublic: {
     maxTokens: 20;
     refillInterval: 1000;
     refillRate: 20;
  };
  gateio: {
     maxTokens: 300;
     refillInterval: 60000;
     refillRate: 300;
  };
};
```

Defined in: [shared/utils/src/rate-limiter/index.ts:264](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/rate-limiter/index.ts#L264)

Pre-configured rate limiters for common APIs

#### Type Declaration

| Name | Type | Default value | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="bitget"></a> `bitget` | \{ `maxTokens`: `10`; `refillInterval`: `1000`; `refillRate`: `10`; \} | - | [shared/utils/src/rate-limiter/index.ts:281](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/rate-limiter/index.ts#L281) |
| `bitget.maxTokens` | `10` | `10` | [shared/utils/src/rate-limiter/index.ts:281](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/rate-limiter/index.ts#L281) |
| `bitget.refillInterval` | `1000` | `1000` | [shared/utils/src/rate-limiter/index.ts:281](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/rate-limiter/index.ts#L281) |
| `bitget.refillRate` | `10` | `10` | [shared/utils/src/rate-limiter/index.ts:281](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/rate-limiter/index.ts#L281) |
| <a id="coingecko"></a> `coingecko` | \{ `maxTokens`: `10`; `refillInterval`: `60000`; `refillRate`: `10`; \} | - | [shared/utils/src/rate-limiter/index.ts:266](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/rate-limiter/index.ts#L266) |
| `coingecko.maxTokens` | `10` | `10` | [shared/utils/src/rate-limiter/index.ts:266](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/rate-limiter/index.ts#L266) |
| `coingecko.refillInterval` | `60000` | `60000` | [shared/utils/src/rate-limiter/index.ts:266](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/rate-limiter/index.ts#L266) |
| `coingecko.refillRate` | `10` | `10` | [shared/utils/src/rate-limiter/index.ts:266](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/rate-limiter/index.ts#L266) |
| <a id="coingeckopro"></a> `coingeckoPro` | \{ `maxTokens`: `500`; `refillInterval`: `60000`; `refillRate`: `500`; \} | - | [shared/utils/src/rate-limiter/index.ts:267](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/rate-limiter/index.ts#L267) |
| `coingeckoPro.maxTokens` | `500` | `500` | [shared/utils/src/rate-limiter/index.ts:267](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/rate-limiter/index.ts#L267) |
| `coingeckoPro.refillInterval` | `60000` | `60000` | [shared/utils/src/rate-limiter/index.ts:267](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/rate-limiter/index.ts#L267) |
| `coingeckoPro.refillRate` | `500` | `500` | [shared/utils/src/rate-limiter/index.ts:267](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/rate-limiter/index.ts#L267) |
| <a id="cryptocompare"></a> `cryptocompare` | \{ `maxTokens`: `50`; `refillInterval`: `60000`; `refillRate`: `50`; \} | - | [shared/utils/src/rate-limiter/index.ts:287](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/rate-limiter/index.ts#L287) |
| `cryptocompare.maxTokens` | `50` | `50` | [shared/utils/src/rate-limiter/index.ts:287](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/rate-limiter/index.ts#L287) |
| `cryptocompare.refillInterval` | `60000` | `60000` | [shared/utils/src/rate-limiter/index.ts:287](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/rate-limiter/index.ts#L287) |
| `cryptocompare.refillRate` | `50` | `50` | [shared/utils/src/rate-limiter/index.ts:287](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/rate-limiter/index.ts#L287) |
| <a id="dune"></a> `dune` | \{ `maxTokens`: `40`; `refillInterval`: `60000`; `refillRate`: `40`; \} | - | [shared/utils/src/rate-limiter/index.ts:274](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/rate-limiter/index.ts#L274) |
| `dune.maxTokens` | `40` | `40` | [shared/utils/src/rate-limiter/index.ts:274](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/rate-limiter/index.ts#L274) |
| `dune.refillInterval` | `60000` | `60000` | [shared/utils/src/rate-limiter/index.ts:274](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/rate-limiter/index.ts#L274) |
| `dune.refillRate` | `40` | `40` | [shared/utils/src/rate-limiter/index.ts:274](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/rate-limiter/index.ts#L274) |
| <a id="etherscan"></a> `etherscan` | \{ `maxTokens`: `5`; `refillInterval`: `1000`; `refillRate`: `5`; \} | - | [shared/utils/src/rate-limiter/index.ts:270](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/rate-limiter/index.ts#L270) |
| `etherscan.maxTokens` | `5` | `5` | [shared/utils/src/rate-limiter/index.ts:270](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/rate-limiter/index.ts#L270) |
| `etherscan.refillInterval` | `1000` | `1000` | [shared/utils/src/rate-limiter/index.ts:270](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/rate-limiter/index.ts#L270) |
| `etherscan.refillRate` | `5` | `5` | [shared/utils/src/rate-limiter/index.ts:270](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/rate-limiter/index.ts#L270) |
| <a id="etherscanpro"></a> `etherscanPro` | \{ `maxTokens`: `10`; `refillInterval`: `1000`; `refillRate`: `10`; \} | - | [shared/utils/src/rate-limiter/index.ts:271](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/rate-limiter/index.ts#L271) |
| `etherscanPro.maxTokens` | `10` | `10` | [shared/utils/src/rate-limiter/index.ts:271](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/rate-limiter/index.ts#L271) |
| `etherscanPro.refillInterval` | `1000` | `1000` | [shared/utils/src/rate-limiter/index.ts:271](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/rate-limiter/index.ts#L271) |
| `etherscanPro.refillRate` | `10` | `10` | [shared/utils/src/rate-limiter/index.ts:271](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/rate-limiter/index.ts#L271) |
| <a id="exchange"></a> `exchange` | \{ `maxTokens`: `10`; `refillInterval`: `1000`; `refillRate`: `10`; \} | - | [shared/utils/src/rate-limiter/index.ts:277](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/rate-limiter/index.ts#L277) |
| `exchange.maxTokens` | `10` | `10` | [shared/utils/src/rate-limiter/index.ts:277](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/rate-limiter/index.ts#L277) |
| `exchange.refillInterval` | `1000` | `1000` | [shared/utils/src/rate-limiter/index.ts:277](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/rate-limiter/index.ts#L277) |
| `exchange.refillRate` | `10` | `10` | [shared/utils/src/rate-limiter/index.ts:277](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/rate-limiter/index.ts#L277) |
| <a id="exchangepublic"></a> `exchangePublic` | \{ `maxTokens`: `20`; `refillInterval`: `1000`; `refillRate`: `20`; \} | - | [shared/utils/src/rate-limiter/index.ts:278](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/rate-limiter/index.ts#L278) |
| `exchangePublic.maxTokens` | `20` | `20` | [shared/utils/src/rate-limiter/index.ts:278](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/rate-limiter/index.ts#L278) |
| `exchangePublic.refillInterval` | `1000` | `1000` | [shared/utils/src/rate-limiter/index.ts:278](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/rate-limiter/index.ts#L278) |
| `exchangePublic.refillRate` | `20` | `20` | [shared/utils/src/rate-limiter/index.ts:278](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/rate-limiter/index.ts#L278) |
| <a id="gateio"></a> `gateio` | \{ `maxTokens`: `300`; `refillInterval`: `60000`; `refillRate`: `300`; \} | - | [shared/utils/src/rate-limiter/index.ts:284](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/rate-limiter/index.ts#L284) |
| `gateio.maxTokens` | `300` | `300` | [shared/utils/src/rate-limiter/index.ts:284](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/rate-limiter/index.ts#L284) |
| `gateio.refillInterval` | `60000` | `60000` | [shared/utils/src/rate-limiter/index.ts:284](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/rate-limiter/index.ts#L284) |
| `gateio.refillRate` | `300` | `300` | [shared/utils/src/rate-limiter/index.ts:284](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/rate-limiter/index.ts#L284) |

***

### rateLimiters

```ts
const rateLimiters: RateLimiterRegistry;
```

Defined in: [shared/utils/src/rate-limiter/index.ts:337](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/rate-limiter/index.ts#L337)

## Functions

### createApiRateLimiter()

```ts
function createApiRateLimiter(api: 
  | "coingecko"
  | "coingeckoPro"
  | "etherscan"
  | "etherscanPro"
  | "dune"
  | "exchange"
  | "exchangePublic"
  | "bitget"
  | "gateio"
  | "cryptocompare"
  | RateLimiterConfig): RateLimiter;
```

Defined in: [shared/utils/src/rate-limiter/index.ts:293](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/rate-limiter/index.ts#L293)

Create a rate limiter for a specific API

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `api` | \| `"coingecko"` \| `"coingeckoPro"` \| `"etherscan"` \| `"etherscanPro"` \| `"dune"` \| `"exchange"` \| `"exchangePublic"` \| `"bitget"` \| `"gateio"` \| `"cryptocompare"` \| [`RateLimiterConfig`](/docs/api/rate-limiter.md#ratelimiterconfig) |

#### Returns

[`RateLimiter`](/docs/api/rate-limiter.md#ratelimiter)
