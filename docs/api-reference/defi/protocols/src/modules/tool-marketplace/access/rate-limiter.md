[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/modules/tool-marketplace/access/rate-limiter

# defi/protocols/src/modules/tool-marketplace/access/rate-limiter

## Classes

### RateLimiter

Defined in: [defi/protocols/src/modules/tool-marketplace/access/rate-limiter.ts:43](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/rate-limiter.ts#L43)

Sliding window rate limiter using the sliding log algorithm

#### Constructors

##### Constructor

```ts
new RateLimiter(storage: AccessStorageAdapter): RateLimiter;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/rate-limiter.ts:46](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/rate-limiter.ts#L46)

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `storage` | [`AccessStorageAdapter`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#accessstorageadapter) | `defaultStorage` |

###### Returns

[`RateLimiter`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/rate-limiter.md#ratelimiter)

#### Methods

##### checkAndConsume()

```ts
checkAndConsume(
   rateLimit: RateLimit, 
   scope: RateLimitScope, 
   identifier: string, 
cost: number): Promise<RateLimitStatus>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/rate-limiter.ts:139](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/rate-limiter.ts#L139)

Check and consume rate limit in one operation

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `rateLimit` | [`RateLimit`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#ratelimit-4) | `undefined` |
| `scope` | [`RateLimitScope`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/rate-limiter.md#ratelimitscope) | `undefined` |
| `identifier` | `string` | `undefined` |
| `cost` | `number` | `1` |

###### Returns

`Promise`\<[`RateLimitStatus`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#ratelimitstatus-1)\>

##### checkLimit()

```ts
checkLimit(
   rateLimit: RateLimit, 
   scope: RateLimitScope, 
   identifier: string, 
cost: number): Promise<RateLimitStatus>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/rate-limiter.ts:67](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/rate-limiter.ts#L67)

Check rate limit for a given scope

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `rateLimit` | [`RateLimit`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#ratelimit-4) | `undefined` |
| `scope` | [`RateLimitScope`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/rate-limiter.md#ratelimitscope) | `undefined` |
| `identifier` | `string` | `undefined` |
| `cost` | `number` | `1` |

###### Returns

`Promise`\<[`RateLimitStatus`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#ratelimitstatus-1)\>

##### checkMultipleLimits()

```ts
checkMultipleLimits(
   options: RateLimitCheckOptions, 
   keyRateLimit?: RateLimit, 
   userRateLimit?: RateLimit, 
   toolRateLimit?: RateLimit): Promise<{
  allowed: boolean;
  limitedBy?: RateLimitScope;
  status: {
     key?: RateLimitStatus;
     tool?: RateLimitStatus;
     user?: RateLimitStatus;
  };
}>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/rate-limiter.ts:161](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/rate-limiter.ts#L161)

Multi-level rate limit check
Checks key, user, and tool limits in order

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `options` | [`RateLimitCheckOptions`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/rate-limiter.md#ratelimitcheckoptions) |
| `keyRateLimit?` | [`RateLimit`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#ratelimit-4) |
| `userRateLimit?` | [`RateLimit`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#ratelimit-4) |
| `toolRateLimit?` | [`RateLimit`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#ratelimit-4) |

###### Returns

`Promise`\<\{
  `allowed`: `boolean`;
  `limitedBy?`: [`RateLimitScope`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/rate-limiter.md#ratelimitscope);
  `status`: \{
     `key?`: [`RateLimitStatus`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#ratelimitstatus-1);
     `tool?`: [`RateLimitStatus`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#ratelimitstatus-1);
     `user?`: [`RateLimitStatus`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#ratelimitstatus-1);
  \};
\}\>

##### consumeLimit()

```ts
consumeLimit(
   rateLimit: RateLimit, 
   scope: RateLimitScope, 
   identifier: string, 
cost: number): Promise<RateLimitStatus>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/rate-limiter.ts:103](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/rate-limiter.ts#L103)

Consume rate limit (increment counter)

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `rateLimit` | [`RateLimit`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#ratelimit-4) | `undefined` |
| `scope` | [`RateLimitScope`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/rate-limiter.md#ratelimitscope) | `undefined` |
| `identifier` | `string` | `undefined` |
| `cost` | `number` | `1` |

###### Returns

`Promise`\<[`RateLimitStatus`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#ratelimitstatus-1)\>

##### generateHeaders()

```ts
generateHeaders(status: RateLimitStatus): RateLimitHeaders;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/rate-limiter.ts:223](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/rate-limiter.ts#L223)

Generate rate limit headers for HTTP responses

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `status` | [`RateLimitStatus`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#ratelimitstatus-1) |

###### Returns

[`RateLimitHeaders`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#ratelimitheaders)

##### getRateLimitInfo()

```ts
getRateLimitInfo(
   rateLimit: RateLimit, 
   scope: RateLimitScope, 
identifier: string): Promise<RateLimitStatus>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/rate-limiter.ts:240](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/rate-limiter.ts#L240)

Get rate limit info without consuming

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `rateLimit` | [`RateLimit`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#ratelimit-4) |
| `scope` | [`RateLimitScope`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/rate-limiter.md#ratelimitscope) |
| `identifier` | `string` |

###### Returns

`Promise`\<[`RateLimitStatus`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#ratelimitstatus-1)\>

##### getUsageSummary()

```ts
getUsageSummary(
   scope: RateLimitScope, 
   identifier: string, 
rateLimits: RateLimit[]): Promise<Map<RatePeriod, RateLimitStatus>>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/rate-limiter.ts:265](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/rate-limiter.ts#L265)

Get current usage across all periods

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `scope` | [`RateLimitScope`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/rate-limiter.md#ratelimitscope) |
| `identifier` | `string` |
| `rateLimits` | [`RateLimit`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#ratelimit-4)[] |

###### Returns

`Promise`\<`Map`\<[`RatePeriod`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#rateperiod), [`RateLimitStatus`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#ratelimitstatus-1)\>\>

##### resetLimit()

```ts
resetLimit(
   scope: RateLimitScope, 
   identifier: string, 
period: RatePeriod): Promise<void>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/rate-limiter.ts:251](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/rate-limiter.ts#L251)

Reset rate limit for a specific scope and identifier

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `scope` | [`RateLimitScope`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/rate-limiter.md#ratelimitscope) |
| `identifier` | `string` |
| `period` | [`RatePeriod`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#rateperiod) |

###### Returns

`Promise`\<`void`\>

***

### TokenBucketRateLimiter

Defined in: [defi/protocols/src/modules/tool-marketplace/access/rate-limiter.ts:303](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/rate-limiter.ts#L303)

Token bucket rate limiter (alternative implementation)
More burst-friendly than sliding window

#### Constructors

##### Constructor

```ts
new TokenBucketRateLimiter(storage: AccessStorageAdapter): TokenBucketRateLimiter;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/rate-limiter.ts:307](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/rate-limiter.ts#L307)

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `storage` | [`AccessStorageAdapter`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#accessstorageadapter) | `defaultStorage` |

###### Returns

[`TokenBucketRateLimiter`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/rate-limiter.md#tokenbucketratelimiter)

#### Methods

##### consume()

```ts
consume(
   bucketId: string, 
   rateLimit: RateLimit, 
cost: number): Promise<RateLimitStatus>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/rate-limiter.ts:314](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/rate-limiter.ts#L314)

Check and consume tokens from bucket

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `bucketId` | `string` | `undefined` |
| `rateLimit` | [`RateLimit`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#ratelimit-4) | `undefined` |
| `cost` | `number` | `1` |

###### Returns

`Promise`\<[`RateLimitStatus`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#ratelimitstatus-1)\>

##### getBucketState()

```ts
getBucketState(bucketId: string): 
  | {
  lastRefill: number;
  tokens: number;
}
  | undefined;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/rate-limiter.ts:372](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/rate-limiter.ts#L372)

Get current bucket state

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `bucketId` | `string` |

###### Returns

  \| \{
  `lastRefill`: `number`;
  `tokens`: `number`;
\}
  \| `undefined`

## Interfaces

### RateLimitCheckOptions

Defined in: [defi/protocols/src/modules/tool-marketplace/access/rate-limiter.ts:27](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/rate-limiter.ts#L27)

Rate limit check options

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="cost"></a> `cost?` | `number` | Number of requests to consume (default: 1) | [defi/protocols/src/modules/tool-marketplace/access/rate-limiter.ts:37](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/rate-limiter.ts#L37) |
| <a id="ipaddress"></a> `ipAddress?` | `string` | IP address for IP-based limiting | [defi/protocols/src/modules/tool-marketplace/access/rate-limiter.ts:35](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/rate-limiter.ts#L35) |
| <a id="keyid"></a> `keyId?` | `string` | Key ID for key-level limiting | [defi/protocols/src/modules/tool-marketplace/access/rate-limiter.ts:29](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/rate-limiter.ts#L29) |
| <a id="toolid"></a> `toolId?` | `string` | Tool ID for tool-level limiting | [defi/protocols/src/modules/tool-marketplace/access/rate-limiter.ts:33](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/rate-limiter.ts#L33) |
| <a id="userid"></a> `userId?` | `string` | User address for user-level limiting | [defi/protocols/src/modules/tool-marketplace/access/rate-limiter.ts:31](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/rate-limiter.ts#L31) |

## Type Aliases

### RateLimitScope

```ts
type RateLimitScope = "key" | "user" | "tool" | "global";
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/rate-limiter.ts:22](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/rate-limiter.ts#L22)

Rate limit scope

## Variables

### GLOBAL\_RATE\_LIMITS

```ts
const GLOBAL_RATE_LIMITS: {
  tool: RateLimit;
  user: RateLimit;
};
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/rate-limiter.ts:284](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/rate-limiter.ts#L284)

Global rate limits configuration (optional additional limits)

#### Type Declaration

| Name | Type | Defined in |
| :------ | :------ | :------ |
| <a id="tool"></a> `tool` | [`RateLimit`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#ratelimit-4) | [defi/protocols/src/modules/tool-marketplace/access/rate-limiter.ts:286](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/rate-limiter.ts#L286) |
| <a id="user"></a> `user` | [`RateLimit`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#ratelimit-4) | [defi/protocols/src/modules/tool-marketplace/access/rate-limiter.ts:285](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/rate-limiter.ts#L285) |

***

### rateLimiter

```ts
const rateLimiter: RateLimiter;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/rate-limiter.ts:297](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/rate-limiter.ts#L297)

Default rate limiter instance

***

### tokenBucketLimiter

```ts
const tokenBucketLimiter: TokenBucketRateLimiter;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/rate-limiter.ts:380](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/rate-limiter.ts#L380)

Token bucket rate limiter instance
