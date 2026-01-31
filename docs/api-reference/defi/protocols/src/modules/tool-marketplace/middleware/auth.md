[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/modules/tool-marketplace/middleware/auth

# defi/protocols/src/modules/tool-marketplace/middleware/auth

## Interfaces

### AuthError

Defined in: [defi/protocols/src/modules/tool-marketplace/middleware/auth.ts:85](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/middleware/auth.ts#L85)

Authentication error

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="code"></a> `code` | \| `"INVALID_KEY"` \| `"RATE_LIMITED"` \| `"QUOTA_EXCEEDED"` \| `"BLOCKED"` \| `"MISSING_KEY"` \| `"EXPIRED_KEY"` \| `"REVOKED_KEY"` \| `"PAYMENT_REQUIRED"` | Error code | [defi/protocols/src/modules/tool-marketplace/middleware/auth.ts:87](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/middleware/auth.ts#L87) |
| <a id="headers"></a> `headers?` | [`RateLimitHeaders`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#ratelimitheaders) | Rate limit headers (if applicable) | [defi/protocols/src/modules/tool-marketplace/middleware/auth.ts:93](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/middleware/auth.ts#L93) |
| <a id="message"></a> `message` | `string` | Error message | [defi/protocols/src/modules/tool-marketplace/middleware/auth.ts:89](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/middleware/auth.ts#L89) |
| <a id="retryafter"></a> `retryAfter?` | `number` | Retry after (seconds) | [defi/protocols/src/modules/tool-marketplace/middleware/auth.ts:95](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/middleware/auth.ts#L95) |
| <a id="statuscode"></a> `statusCode` | `number` | HTTP status code | [defi/protocols/src/modules/tool-marketplace/middleware/auth.ts:91](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/middleware/auth.ts#L91) |

***

### AuthResult

Defined in: [defi/protocols/src/modules/tool-marketplace/middleware/auth.ts:67](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/middleware/auth.ts#L67)

Authentication result

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="key"></a> `key?` | [`APIKey`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#apikey) | Validated API key | [defi/protocols/src/modules/tool-marketplace/middleware/auth.ts:71](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/middleware/auth.ts#L71) |
| <a id="quotastatus"></a> `quotaStatus?` | [`QuotaStatus`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#quotastatus) | Quota status | [defi/protocols/src/modules/tool-marketplace/middleware/auth.ts:75](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/middleware/auth.ts#L75) |
| <a id="ratelimitstatus"></a> `rateLimitStatus?` | [`RateLimitStatus`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#ratelimitstatus-1) | Rate limit status | [defi/protocols/src/modules/tool-marketplace/middleware/auth.ts:73](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/middleware/auth.ts#L73) |
| <a id="success"></a> `success` | `boolean` | Whether authentication was successful | [defi/protocols/src/modules/tool-marketplace/middleware/auth.ts:69](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/middleware/auth.ts#L69) |
| <a id="toolid"></a> `toolId?` | `string` | Tool ID | [defi/protocols/src/modules/tool-marketplace/middleware/auth.ts:79](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/middleware/auth.ts#L79) |
| <a id="userid"></a> `userId?` | `` `0x${string}` `` | User address from key | [defi/protocols/src/modules/tool-marketplace/middleware/auth.ts:77](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/middleware/auth.ts#L77) |

***

### MarketplaceAuthOptions

Defined in: [defi/protocols/src/modules/tool-marketplace/middleware/auth.ts:29](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/middleware/auth.ts#L29)

Marketplace auth options

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="accesslistmanager"></a> `accessListManager?` | [`AccessListManager`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/lists.md#accesslistmanager) | Custom access list manager instance | [defi/protocols/src/modules/tool-marketplace/middleware/auth.ts:47](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/middleware/auth.ts#L47) |
| <a id="allowqueryparam"></a> `allowQueryParam?` | `boolean` | Allow key in query parameter | [defi/protocols/src/modules/tool-marketplace/middleware/auth.ts:51](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/middleware/auth.ts#L51) |
| <a id="apikeyheader"></a> `apiKeyHeader?` | `string` | Header name for API key (default: X-API-Key) | [defi/protocols/src/modules/tool-marketplace/middleware/auth.ts:49](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/middleware/auth.ts#L49) |
| <a id="checkaccesslists"></a> `checkAccessLists?` | `boolean` | Check allowlist/blocklist | [defi/protocols/src/modules/tool-marketplace/middleware/auth.ts:39](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/middleware/auth.ts#L39) |
| <a id="checkquota"></a> `checkQuota?` | `boolean` | Check quotas | [defi/protocols/src/modules/tool-marketplace/middleware/auth.ts:35](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/middleware/auth.ts#L35) |
| <a id="checkratelimit"></a> `checkRateLimit?` | `boolean` | Check rate limits | [defi/protocols/src/modules/tool-marketplace/middleware/auth.ts:33](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/middleware/auth.ts#L33) |
| <a id="keymanager"></a> `keyManager?` | [`KeyManager`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/key-manager.md#keymanager) | Custom key manager instance | [defi/protocols/src/modules/tool-marketplace/middleware/auth.ts:41](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/middleware/auth.ts#L41) |
| <a id="onerror"></a> `onError?` | (`error`: [`AuthError`](/docs/api/defi/protocols/src/modules/tool-marketplace/middleware/auth.md#autherror), `req`: `any`, `res`: `any`) => `void` | Custom error handler | [defi/protocols/src/modules/tool-marketplace/middleware/auth.ts:59](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/middleware/auth.ts#L59) |
| <a id="onsuccess"></a> `onSuccess?` | (`result`: [`AuthResult`](/docs/api/defi/protocols/src/modules/tool-marketplace/middleware/auth.md#authresult), `req`: `any`, `res`: `any`) => `void` | Callback after successful authentication | [defi/protocols/src/modules/tool-marketplace/middleware/auth.ts:61](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/middleware/auth.ts#L61) |
| <a id="queryparamname"></a> `queryParamName?` | `string` | Query parameter name (default: api_key) | [defi/protocols/src/modules/tool-marketplace/middleware/auth.ts:53](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/middleware/auth.ts#L53) |
| <a id="quotamanager"></a> `quotaManager?` | [`QuotaManager`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/quotas.md#quotamanager) | Custom quota manager instance | [defi/protocols/src/modules/tool-marketplace/middleware/auth.ts:45](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/middleware/auth.ts#L45) |
| <a id="ratelimiter"></a> `rateLimiter?` | [`RateLimiter`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/rate-limiter.md#ratelimiter) | Custom rate limiter instance | [defi/protocols/src/modules/tool-marketplace/middleware/auth.ts:43](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/middleware/auth.ts#L43) |
| <a id="requirepayment"></a> `requirePayment?` | `boolean` | Require payment (x402 integration) | [defi/protocols/src/modules/tool-marketplace/middleware/auth.ts:37](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/middleware/auth.ts#L37) |
| <a id="skippaths"></a> `skipPaths?` | `string`[] | Skip validation for certain paths | [defi/protocols/src/modules/tool-marketplace/middleware/auth.ts:57](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/middleware/auth.ts#L57) |
| <a id="toolid-1"></a> `toolId?` | `string` | Tool ID to check against (required if validateKey is true) | [defi/protocols/src/modules/tool-marketplace/middleware/auth.ts:55](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/middleware/auth.ts#L55) |
| <a id="validatekey"></a> `validateKey?` | `boolean` | Validate API key | [defi/protocols/src/modules/tool-marketplace/middleware/auth.ts:31](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/middleware/auth.ts#L31) |

***

### MarketplaceRequest

Defined in: [defi/protocols/src/modules/tool-marketplace/middleware/auth.ts:105](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/middleware/auth.ts#L105)

Express request extension

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="apikey"></a> `apiKey?` | [`APIKey`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#apikey) | [defi/protocols/src/modules/tool-marketplace/middleware/auth.ts:107](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/middleware/auth.ts#L107) |
| <a id="marketplaceauth"></a> `marketplaceAuth?` | [`AuthResult`](/docs/api/defi/protocols/src/modules/tool-marketplace/middleware/auth.md#authresult) | [defi/protocols/src/modules/tool-marketplace/middleware/auth.ts:106](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/middleware/auth.ts#L106) |
| <a id="userid-1"></a> `userId?` | `` `0x${string}` `` | [defi/protocols/src/modules/tool-marketplace/middleware/auth.ts:108](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/middleware/auth.ts#L108) |

***

### MiddlewareResult

Defined in: [defi/protocols/src/modules/tool-marketplace/middleware/auth.ts:381](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/middleware/auth.ts#L381)

Generic middleware result for framework-agnostic usage

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="error"></a> `error?` | [`AuthError`](/docs/api/defi/protocols/src/modules/tool-marketplace/middleware/auth.md#autherror) | [defi/protocols/src/modules/tool-marketplace/middleware/auth.ts:383](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/middleware/auth.ts#L383) |
| <a id="headers-1"></a> `headers` | `Record`\<`string`, `string`\> | [defi/protocols/src/modules/tool-marketplace/middleware/auth.ts:385](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/middleware/auth.ts#L385) |
| <a id="result"></a> `result?` | [`AuthResult`](/docs/api/defi/protocols/src/modules/tool-marketplace/middleware/auth.md#authresult) | [defi/protocols/src/modules/tool-marketplace/middleware/auth.ts:384](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/middleware/auth.ts#L384) |
| <a id="success-1"></a> `success` | `boolean` | [defi/protocols/src/modules/tool-marketplace/middleware/auth.ts:382](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/middleware/auth.ts#L382) |

## Functions

### authenticateRequest()

```ts
function authenticateRequest(apiKey: string | undefined, options: {
  checkAccessLists?: boolean;
  checkQuota?: boolean;
  checkRateLimit?: boolean;
  ip?: string;
  toolId?: string;
}): Promise<MiddlewareResult>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/middleware/auth.ts:391](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/middleware/auth.ts#L391)

Framework-agnostic authentication function

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `apiKey` | `string` \| `undefined` |
| `options` | \{ `checkAccessLists?`: `boolean`; `checkQuota?`: `boolean`; `checkRateLimit?`: `boolean`; `ip?`: `string`; `toolId?`: `string`; \} |
| `options.checkAccessLists?` | `boolean` |
| `options.checkQuota?` | `boolean` |
| `options.checkRateLimit?` | `boolean` |
| `options.ip?` | `string` |
| `options.toolId?` | `string` |

#### Returns

`Promise`\<[`MiddlewareResult`](/docs/api/defi/protocols/src/modules/tool-marketplace/middleware/auth.md#middlewareresult)\>

***

### createExpressMiddleware()

```ts
function createExpressMiddleware(options: MarketplaceAuthOptions): (req: any, res: any, next: any) => Promise<any>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/middleware/auth.ts:114](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/middleware/auth.ts#L114)

Create Express middleware for marketplace authentication

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `options` | [`MarketplaceAuthOptions`](/docs/api/defi/protocols/src/modules/tool-marketplace/middleware/auth.md#marketplaceauthoptions) |

#### Returns

```ts
(
   req: any, 
   res: any, 
next: any): Promise<any>;
```

##### Parameters

| Parameter | Type |
| :------ | :------ |
| `req` | `any` |
| `res` | `any` |
| `next` | `any` |

##### Returns

`Promise`\<`any`\>

***

### createKeyValidator()

```ts
function createKeyValidator(): (key: string) => Promise<KeyValidationResult>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/middleware/auth.ts:558](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/middleware/auth.ts#L558)

Create a simple API key validator function

#### Returns

```ts
(key: string): Promise<KeyValidationResult>;
```

##### Parameters

| Parameter | Type |
| :------ | :------ |
| `key` | `string` |

##### Returns

`Promise`\<[`KeyValidationResult`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#keyvalidationresult)\>

***

### extractApiKey()

```ts
function extractApiKey(
   headers: Record<string, string | string[] | undefined>, 
   query?: Record<string, string | string[] | undefined>, 
   options?: {
  headerName?: string;
  queryParamName?: string;
}): string | undefined;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/middleware/auth.ts:527](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/middleware/auth.ts#L527)

Extract API key from various sources

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `headers` | `Record`\<`string`, `string` \| `string`[] \| `undefined`\> |
| `query?` | `Record`\<`string`, `string` \| `string`[] \| `undefined`\> |
| `options?` | \{ `headerName?`: `string`; `queryParamName?`: `string`; \} |
| `options.headerName?` | `string` |
| `options.queryParamName?` | `string` |

#### Returns

`string` \| `undefined`

***

### fastifyMarketplaceAuth()

```ts
function fastifyMarketplaceAuth(fastify: any, options: MarketplaceAuthOptions): Promise<void>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/middleware/auth.ts:318](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/middleware/auth.ts#L318)

Fastify plugin for marketplace authentication

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `fastify` | `any` |
| `options` | [`MarketplaceAuthOptions`](/docs/api/defi/protocols/src/modules/tool-marketplace/middleware/auth.md#marketplaceauthoptions) |

#### Returns

`Promise`\<`void`\>
