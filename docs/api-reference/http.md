[**Universal Crypto MCP API Reference v1.0.0**](index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / http

# http

HTTP Client with Rate Limiting, Retry, Timeout, and Observability

A resilient HTTP client that combines all utility features.

## Author

nich <nich@nichxbt.com>

## Classes

### HttpClient

Defined in: [shared/utils/src/http/index.ts:82](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/http/index.ts#L82)

Resilient HTTP Client

#### Example

```typescript
const client = new HttpClient({
  baseUrl: 'https://api.coingecko.com/api/v3',
  name: 'coingecko',
  rateLimit: 'coingecko',
  retry: { maxRetries: 3 },
  timeout: 10000
});

const price = await client.get('/simple/price', {
  params: { ids: 'bitcoin', vs_currencies: 'usd' }
});
```

#### Constructors

##### Constructor

```ts
new HttpClient(config: HttpClientConfig): HttpClient;
```

Defined in: [shared/utils/src/http/index.ts:98](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/http/index.ts#L98)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `config` | [`HttpClientConfig`](/docs/api/http.md#httpclientconfig) |

###### Returns

[`HttpClient`](/docs/api/http.md#httpclient)

#### Methods

##### delete()

```ts
delete<T>(path: string, options?: Omit<RequestOptions, "method" | "body">): Promise<HttpResponse<T>>;
```

Defined in: [shared/utils/src/http/index.ts:161](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/http/index.ts#L161)

Make a DELETE request

###### Type Parameters

| Type Parameter | Default type |
| :------ | :------ |
| `T` | `unknown` |

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `path` | `string` |
| `options?` | `Omit`\<[`RequestOptions`](/docs/api/http.md#requestoptions), `"method"` \| `"body"`\> |

###### Returns

`Promise`\<[`HttpResponse`](/docs/api/http.md#httpresponse)\<`T`\>\>

##### get()

```ts
get<T>(path: string, options?: Omit<RequestOptions, "method" | "body">): Promise<HttpResponse<T>>;
```

Defined in: [shared/utils/src/http/index.ts:140](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/http/index.ts#L140)

Make a GET request

###### Type Parameters

| Type Parameter | Default type |
| :------ | :------ |
| `T` | `unknown` |

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `path` | `string` |
| `options?` | `Omit`\<[`RequestOptions`](/docs/api/http.md#requestoptions), `"method"` \| `"body"`\> |

###### Returns

`Promise`\<[`HttpResponse`](/docs/api/http.md#httpresponse)\<`T`\>\>

##### getCircuitBreakerStatus()

```ts
getCircuitBreakerStatus(): 
  | {
  failures: number;
  state: string;
}
  | undefined;
```

Defined in: [shared/utils/src/http/index.ts:319](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/http/index.ts#L319)

Get circuit breaker status

###### Returns

  \| \{
  `failures`: `number`;
  `state`: `string`;
\}
  \| `undefined`

##### getRateLimiterStatus()

```ts
getRateLimiterStatus(): 
  | {
  maxTokens: number;
  tokens: number;
}
  | undefined;
```

Defined in: [shared/utils/src/http/index.ts:328](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/http/index.ts#L328)

Get rate limiter status

###### Returns

  \| \{
  `maxTokens`: `number`;
  `tokens`: `number`;
\}
  \| `undefined`

##### patch()

```ts
patch<T>(
   path: string, 
   body?: unknown, 
options?: Omit<RequestOptions, "method" | "body">): Promise<HttpResponse<T>>;
```

Defined in: [shared/utils/src/http/index.ts:168](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/http/index.ts#L168)

Make a PATCH request

###### Type Parameters

| Type Parameter | Default type |
| :------ | :------ |
| `T` | `unknown` |

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `path` | `string` |
| `body?` | `unknown` |
| `options?` | `Omit`\<[`RequestOptions`](/docs/api/http.md#requestoptions), `"method"` \| `"body"`\> |

###### Returns

`Promise`\<[`HttpResponse`](/docs/api/http.md#httpresponse)\<`T`\>\>

##### post()

```ts
post<T>(
   path: string, 
   body?: unknown, 
options?: Omit<RequestOptions, "method" | "body">): Promise<HttpResponse<T>>;
```

Defined in: [shared/utils/src/http/index.ts:147](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/http/index.ts#L147)

Make a POST request

###### Type Parameters

| Type Parameter | Default type |
| :------ | :------ |
| `T` | `unknown` |

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `path` | `string` |
| `body?` | `unknown` |
| `options?` | `Omit`\<[`RequestOptions`](/docs/api/http.md#requestoptions), `"method"` \| `"body"`\> |

###### Returns

`Promise`\<[`HttpResponse`](/docs/api/http.md#httpresponse)\<`T`\>\>

##### put()

```ts
put<T>(
   path: string, 
   body?: unknown, 
options?: Omit<RequestOptions, "method" | "body">): Promise<HttpResponse<T>>;
```

Defined in: [shared/utils/src/http/index.ts:154](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/http/index.ts#L154)

Make a PUT request

###### Type Parameters

| Type Parameter | Default type |
| :------ | :------ |
| `T` | `unknown` |

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `path` | `string` |
| `body?` | `unknown` |
| `options?` | `Omit`\<[`RequestOptions`](/docs/api/http.md#requestoptions), `"method"` \| `"body"`\> |

###### Returns

`Promise`\<[`HttpResponse`](/docs/api/http.md#httpresponse)\<`T`\>\>

##### request()

```ts
request<T>(path: string, options: RequestOptions): Promise<HttpResponse<T>>;
```

Defined in: [shared/utils/src/http/index.ts:175](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/http/index.ts#L175)

Make a request with all resilience features

###### Type Parameters

| Type Parameter | Default type |
| :------ | :------ |
| `T` | `unknown` |

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `path` | `string` |
| `options` | [`RequestOptions`](/docs/api/http.md#requestoptions) |

###### Returns

`Promise`\<[`HttpResponse`](/docs/api/http.md#httpresponse)\<`T`\>\>

## Interfaces

### HttpClientConfig

Defined in: [shared/utils/src/http/index.ts:21](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/http/index.ts#L21)

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="baseurl"></a> `baseUrl` | `string` | Base URL for all requests | [shared/utils/src/http/index.ts:23](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/http/index.ts#L23) |
| <a id="circuitbreaker"></a> `circuitBreaker?` | [`CircuitBreakerConfig`](/docs/api/retry.md#circuitbreakerconfig) | Circuit breaker config | [shared/utils/src/http/index.ts:35](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/http/index.ts#L35) |
| <a id="headers"></a> `headers?` | `Record`\<`string`, `string`\> | Default headers | [shared/utils/src/http/index.ts:27](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/http/index.ts#L27) |
| <a id="logging"></a> `logging?` | `boolean` | Enable request/response logging | [shared/utils/src/http/index.ts:37](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/http/index.ts#L37) |
| <a id="loglevel"></a> `logLevel?` | `"debug"` \| `"info"` | Log level for requests | [shared/utils/src/http/index.ts:39](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/http/index.ts#L39) |
| <a id="name"></a> `name` | `string` | Client name (for logging and metrics) | [shared/utils/src/http/index.ts:25](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/http/index.ts#L25) |
| <a id="ratelimit"></a> `rateLimit?` | \| `"coingecko"` \| `"coingeckoPro"` \| `"etherscan"` \| `"etherscanPro"` \| `"dune"` \| `"exchange"` \| `"exchangePublic"` \| `"bitget"` \| `"gateio"` \| `"cryptocompare"` \| [`RateLimiterConfig`](/docs/api/rate-limiter.md#ratelimiterconfig) | Rate limiter config | [shared/utils/src/http/index.ts:31](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/http/index.ts#L31) |
| <a id="retry"></a> `retry?` | `Partial`\<[`RetryConfig`](/docs/api/retry.md#retryconfig)\> | Retry config | [shared/utils/src/http/index.ts:33](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/http/index.ts#L33) |
| <a id="timeout"></a> `timeout?` | `number` | Request timeout in ms | [shared/utils/src/http/index.ts:29](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/http/index.ts#L29) |

***

### HttpResponse

Defined in: [shared/utils/src/http/index.ts:53](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/http/index.ts#L53)

#### Type Parameters

| Type Parameter | Default type |
| :------ | :------ |
| `T` | `unknown` |

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="data"></a> `data` | `T` | [shared/utils/src/http/index.ts:54](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/http/index.ts#L54) |
| <a id="duration"></a> `duration` | `number` | [shared/utils/src/http/index.ts:57](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/http/index.ts#L57) |
| <a id="headers-1"></a> `headers` | `Record`\<`string`, `string`\> | [shared/utils/src/http/index.ts:56](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/http/index.ts#L56) |
| <a id="status"></a> `status` | `number` | [shared/utils/src/http/index.ts:55](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/http/index.ts#L55) |

***

### RequestOptions

Defined in: [shared/utils/src/http/index.ts:42](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/http/index.ts#L42)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="body"></a> `body?` | `unknown` | [shared/utils/src/http/index.ts:45](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/http/index.ts#L45) |
| <a id="headers-2"></a> `headers?` | `Record`\<`string`, `string`\> | [shared/utils/src/http/index.ts:44](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/http/index.ts#L44) |
| <a id="method"></a> `method?` | `"GET"` \| `"POST"` \| `"PUT"` \| `"DELETE"` \| `"PATCH"` | [shared/utils/src/http/index.ts:43](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/http/index.ts#L43) |
| <a id="params"></a> `params?` | `Record`\<`string`, `string` \| `number` \| `boolean` \| `undefined`\> | [shared/utils/src/http/index.ts:46](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/http/index.ts#L46) |
| <a id="skipcircuitbreaker"></a> `skipCircuitBreaker?` | `boolean` | [shared/utils/src/http/index.ts:50](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/http/index.ts#L50) |
| <a id="skipratelimit"></a> `skipRateLimit?` | `boolean` | [shared/utils/src/http/index.ts:48](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/http/index.ts#L48) |
| <a id="skipretry"></a> `skipRetry?` | `boolean` | [shared/utils/src/http/index.ts:49](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/http/index.ts#L49) |
| <a id="timeout-1"></a> `timeout?` | `number` | [shared/utils/src/http/index.ts:47](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/http/index.ts#L47) |

## Variables

### apiClients

```ts
const apiClients: {
  coingecko: () => HttpClient;
  dune: (apiKey?: string) => HttpClient;
  etherscan: (apiKey?: string) => HttpClient;
};
```

Defined in: [shared/utils/src/http/index.ts:367](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/http/index.ts#L367)

Pre-configured clients for common APIs

#### Type Declaration

| Name | Type | Defined in |
| :------ | :------ | :------ |
| <a id="coingecko"></a> `coingecko()` | () => [`HttpClient`](/docs/api/http.md#httpclient) | [shared/utils/src/http/index.ts:368](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/http/index.ts#L368) |
| <a id="dune"></a> `dune()` | (`apiKey?`: `string`) => [`HttpClient`](/docs/api/http.md#httpclient) | [shared/utils/src/http/index.ts:374](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/http/index.ts#L374) |
| <a id="etherscan"></a> `etherscan()` | (`apiKey?`: `string`) => [`HttpClient`](/docs/api/http.md#httpclient) | [shared/utils/src/http/index.ts:369](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/http/index.ts#L369) |

## Functions

### createApiClient()

```ts
function createApiClient(
   name: 
  | "coingecko"
  | "coingeckoPro"
  | "etherscan"
  | "etherscanPro"
  | "dune"
  | "exchange"
  | "exchangePublic"
  | "bitget"
  | "gateio"
  | "cryptocompare", 
   baseUrl: string, 
   options?: Partial<HttpClientConfig>): HttpClient;
```

Defined in: [shared/utils/src/http/index.ts:341](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/http/index.ts#L341)

Create a pre-configured HTTP client for common APIs

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `name` | \| `"coingecko"` \| `"coingeckoPro"` \| `"etherscan"` \| `"etherscanPro"` \| `"dune"` \| `"exchange"` \| `"exchangePublic"` \| `"bitget"` \| `"gateio"` \| `"cryptocompare"` |
| `baseUrl` | `string` |
| `options?` | `Partial`\<[`HttpClientConfig`](/docs/api/http.md#httpclientconfig)\> |

#### Returns

[`HttpClient`](/docs/api/http.md#httpclient)
