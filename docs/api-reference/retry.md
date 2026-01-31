[**Universal Crypto MCP API Reference v1.0.0**](index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / retry

# retry

Retry Logic with Exponential Backoff and Circuit Breaker

Provides robust retry mechanisms for handling transient failures
in distributed systems and API calls.

## Author

nich <nich@nichxbt.com>

## Enumerations

### CircuitState

Defined in: [shared/utils/src/retry/index.ts:195](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/retry/index.ts#L195)

#### Enumeration Members

| Enumeration Member | Value | Defined in |
| :------ | :------ | :------ |
| <a id="closed"></a> `CLOSED` | `"CLOSED"` | [shared/utils/src/retry/index.ts:196](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/retry/index.ts#L196) |
| <a id="half_open"></a> `HALF_OPEN` | `"HALF_OPEN"` | [shared/utils/src/retry/index.ts:198](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/retry/index.ts#L198) |
| <a id="open"></a> `OPEN` | `"OPEN"` | [shared/utils/src/retry/index.ts:197](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/retry/index.ts#L197) |

## Classes

### CircuitBreaker

Defined in: [shared/utils/src/retry/index.ts:239](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/retry/index.ts#L239)

Circuit Breaker Pattern Implementation

Prevents cascading failures by stopping requests to failing services.

#### Example

```typescript
const breaker = new CircuitBreaker({
  failureThreshold: 5,
  resetTimeout: 30000,
  successThreshold: 2
});

const result = await breaker.execute(() => api.call());
```

#### Constructors

##### Constructor

```ts
new CircuitBreaker(config: CircuitBreakerConfig): CircuitBreaker;
```

Defined in: [shared/utils/src/retry/index.ts:249](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/retry/index.ts#L249)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `config` | [`CircuitBreakerConfig`](/docs/api/retry.md#circuitbreakerconfig) |

###### Returns

[`CircuitBreaker`](/docs/api/retry.md#circuitbreaker)

#### Methods

##### canExecute()

```ts
canExecute(): boolean;
```

Defined in: [shared/utils/src/retry/index.ts:282](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/retry/index.ts#L282)

Check if execution is allowed

###### Returns

`boolean`

##### execute()

```ts
execute<T>(fn: () => Promise<T>): Promise<T>;
```

Defined in: [shared/utils/src/retry/index.ts:262](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/retry/index.ts#L262)

Execute a function through the circuit breaker

###### Type Parameters

| Type Parameter |
| :------ |
| `T` |

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `fn` | () => `Promise`\<`T`\> |

###### Returns

`Promise`\<`T`\>

##### forceClose()

```ts
forceClose(): void;
```

Defined in: [shared/utils/src/retry/index.ts:400](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/retry/index.ts#L400)

Force circuit to close (use with caution)

###### Returns

`void`

##### forceOpen()

```ts
forceOpen(): void;
```

Defined in: [shared/utils/src/retry/index.ts:407](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/retry/index.ts#L407)

Force circuit to open (use for maintenance)

###### Returns

`void`

##### getStats()

```ts
getStats(): CircuitBreakerStats;
```

Defined in: [shared/utils/src/retry/index.ts:386](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/retry/index.ts#L386)

Get current statistics

###### Returns

[`CircuitBreakerStats`](/docs/api/retry.md#circuitbreakerstats)

##### getTimeUntilReset()

```ts
getTimeUntilReset(): number;
```

Defined in: [shared/utils/src/retry/index.ts:375](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/retry/index.ts#L375)

Get time until circuit reset (if open)

###### Returns

`number`

***

### CircuitOpenError

Defined in: [shared/utils/src/retry/index.ts:415](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/retry/index.ts#L415)

Error thrown when circuit is open

#### Extends

- `Error`

#### Constructors

##### Constructor

```ts
new CircuitOpenError(message: string): CircuitOpenError;
```

Defined in: [shared/utils/src/retry/index.ts:416](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/retry/index.ts#L416)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `message` | `string` |

###### Returns

[`CircuitOpenError`](/docs/api/retry.md#circuitopenerror)

###### Overrides

```ts
Error.constructor
```

***

### ResilientExecutor

Defined in: [shared/utils/src/retry/index.ts:434](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/retry/index.ts#L434)

Combines retry logic with circuit breaker for maximum resilience

#### Constructors

##### Constructor

```ts
new ResilientExecutor(config: ResilientConfig): ResilientExecutor;
```

Defined in: [shared/utils/src/retry/index.ts:438](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/retry/index.ts#L438)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `config` | [`ResilientConfig`](/docs/api/retry.md#resilientconfig) |

###### Returns

[`ResilientExecutor`](/docs/api/retry.md#resilientexecutor)

#### Methods

##### execute()

```ts
execute<T>(fn: () => Promise<T>): Promise<RetryResult<T>>;
```

Defined in: [shared/utils/src/retry/index.ts:443](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/retry/index.ts#L443)

###### Type Parameters

| Type Parameter |
| :------ |
| `T` |

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `fn` | () => `Promise`\<`T`\> |

###### Returns

`Promise`\<[`RetryResult`](/docs/api/retry.md#retryresult)\<`T`\>\>

##### getCircuitState()

```ts
getCircuitState(): CircuitState;
```

Defined in: [shared/utils/src/retry/index.ts:450](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/retry/index.ts#L450)

###### Returns

[`CircuitState`](/docs/api/retry.md#circuitstate)

##### getStats()

```ts
getStats(): CircuitBreakerStats;
```

Defined in: [shared/utils/src/retry/index.ts:454](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/retry/index.ts#L454)

###### Returns

[`CircuitBreakerStats`](/docs/api/retry.md#circuitbreakerstats)

## Interfaces

### CircuitBreakerConfig

Defined in: [shared/utils/src/retry/index.ts:201](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/retry/index.ts#L201)

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="failurethreshold"></a> `failureThreshold` | `number` | Number of failures before opening circuit | [shared/utils/src/retry/index.ts:203](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/retry/index.ts#L203) |
| <a id="failurewindow"></a> `failureWindow?` | `number` | Time window for counting failures (ms) | [shared/utils/src/retry/index.ts:209](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/retry/index.ts#L209) |
| <a id="onstatechange"></a> `onStateChange?` | (`from`: [`CircuitState`](/docs/api/retry.md#circuitstate), `to`: [`CircuitState`](/docs/api/retry.md#circuitstate)) => `void` | Callback when circuit state changes | [shared/utils/src/retry/index.ts:211](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/retry/index.ts#L211) |
| <a id="resettimeout"></a> `resetTimeout` | `number` | Time in ms to wait before attempting recovery | [shared/utils/src/retry/index.ts:205](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/retry/index.ts#L205) |
| <a id="successthreshold"></a> `successThreshold` | `number` | Number of successes needed in half-open state to close | [shared/utils/src/retry/index.ts:207](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/retry/index.ts#L207) |

***

### CircuitBreakerStats

Defined in: [shared/utils/src/retry/index.ts:214](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/retry/index.ts#L214)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="failures"></a> `failures` | `number` | [shared/utils/src/retry/index.ts:216](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/retry/index.ts#L216) |
| <a id="lastfailure"></a> `lastFailure?` | `Date` | [shared/utils/src/retry/index.ts:218](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/retry/index.ts#L218) |
| <a id="lastsuccess"></a> `lastSuccess?` | `Date` | [shared/utils/src/retry/index.ts:219](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/retry/index.ts#L219) |
| <a id="openedat"></a> `openedAt?` | `Date` | [shared/utils/src/retry/index.ts:220](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/retry/index.ts#L220) |
| <a id="state"></a> `state` | [`CircuitState`](/docs/api/retry.md#circuitstate) | [shared/utils/src/retry/index.ts:215](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/retry/index.ts#L215) |
| <a id="successes"></a> `successes` | `number` | [shared/utils/src/retry/index.ts:217](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/retry/index.ts#L217) |

***

### ResilientConfig

Defined in: [shared/utils/src/retry/index.ts:426](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/retry/index.ts#L426)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="circuitbreaker-1"></a> `circuitBreaker` | [`CircuitBreakerConfig`](/docs/api/retry.md#circuitbreakerconfig) | [shared/utils/src/retry/index.ts:428](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/retry/index.ts#L428) |
| <a id="retry"></a> `retry` | `Partial`\<[`RetryConfig`](/docs/api/retry.md#retryconfig)\> | [shared/utils/src/retry/index.ts:427](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/retry/index.ts#L427) |

***

### RetryConfig

Defined in: [shared/utils/src/retry/index.ts:11](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/retry/index.ts#L11)

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="backoffmultiplier"></a> `backoffMultiplier?` | `number` | Backoff multiplier (default: 2 for exponential) | [shared/utils/src/retry/index.ts:19](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/retry/index.ts#L19) |
| <a id="initialdelay"></a> `initialDelay` | `number` | Initial delay in milliseconds | [shared/utils/src/retry/index.ts:15](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/retry/index.ts#L15) |
| <a id="jitter"></a> `jitter?` | `boolean` | Add random jitter to prevent thundering herd | [shared/utils/src/retry/index.ts:21](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/retry/index.ts#L21) |
| <a id="jitterfactor"></a> `jitterFactor?` | `number` | Jitter factor (0-1, default: 0.1) | [shared/utils/src/retry/index.ts:23](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/retry/index.ts#L23) |
| <a id="maxdelay"></a> `maxDelay` | `number` | Maximum delay in milliseconds | [shared/utils/src/retry/index.ts:17](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/retry/index.ts#L17) |
| <a id="maxretries"></a> `maxRetries` | `number` | Maximum number of retry attempts | [shared/utils/src/retry/index.ts:13](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/retry/index.ts#L13) |
| <a id="onretry"></a> `onRetry?` | (`error`: `Error`, `attempt`: `number`, `delay`: `number`) => `void` | Callback on each retry | [shared/utils/src/retry/index.ts:29](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/retry/index.ts#L29) |
| <a id="retryableerrors"></a> `retryableErrors?` | (...`args`: `unknown`[]) => `Error`[] | Errors to retry on (default: all errors) | [shared/utils/src/retry/index.ts:25](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/retry/index.ts#L25) |
| <a id="retryablestatuscodes"></a> `retryableStatusCodes?` | `number`[] | HTTP status codes to retry on | [shared/utils/src/retry/index.ts:27](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/retry/index.ts#L27) |

***

### RetryResult

Defined in: [shared/utils/src/retry/index.ts:32](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/retry/index.ts#L32)

#### Type Parameters

| Type Parameter |
| :------ |
| `T` |

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="attempts"></a> `attempts` | `number` | [shared/utils/src/retry/index.ts:36](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/retry/index.ts#L36) |
| <a id="data"></a> `data?` | `T` | [shared/utils/src/retry/index.ts:34](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/retry/index.ts#L34) |
| <a id="error"></a> `error?` | `Error` | [shared/utils/src/retry/index.ts:35](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/retry/index.ts#L35) |
| <a id="success"></a> `success` | `boolean` | [shared/utils/src/retry/index.ts:33](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/retry/index.ts#L33) |
| <a id="totaltime"></a> `totalTime` | `number` | [shared/utils/src/retry/index.ts:37](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/retry/index.ts#L37) |

## Functions

### createResilientExecutor()

```ts
function createResilientExecutor(name: string, overrides?: Partial<ResilientConfig>): ResilientExecutor;
```

Defined in: [shared/utils/src/retry/index.ts:462](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/retry/index.ts#L462)

Create a resilient executor with sensible defaults

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `name` | `string` |
| `overrides?` | `Partial`\<[`ResilientConfig`](/docs/api/retry.md#resilientconfig)\> |

#### Returns

[`ResilientExecutor`](/docs/api/retry.md#resilientexecutor)

***

### retry()

```ts
function retry<T>(fn: () => Promise<T>, config: Partial<RetryConfig>): Promise<RetryResult<T>>;
```

Defined in: [shared/utils/src/retry/index.ts:121](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/retry/index.ts#L121)

Retry a function with exponential backoff

#### Type Parameters

| Type Parameter |
| :------ |
| `T` |

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `fn` | () => `Promise`\<`T`\> |
| `config` | `Partial`\<[`RetryConfig`](/docs/api/retry.md#retryconfig)\> |

#### Returns

`Promise`\<[`RetryResult`](/docs/api/retry.md#retryresult)\<`T`\>\>

#### Example

```typescript
const result = await retry(
  async () => await fetch('https://api.example.com/data'),
  { maxRetries: 3, initialDelay: 1000 }
);
```

***

### withRetry()

```ts
function withRetry<T>(config: Partial<RetryConfig>): (_target: unknown, _propertyKey: string, descriptor: TypedPropertyDescriptor<T>) => TypedPropertyDescriptor<T>;
```

Defined in: [shared/utils/src/retry/index.ts:169](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/retry/index.ts#L169)

Decorator version for class methods

#### Type Parameters

| Type Parameter |
| :------ |
| `T` *extends* (...`args`: `unknown`[]) => `Promise`\<`unknown`\> |

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `config` | `Partial`\<[`RetryConfig`](/docs/api/retry.md#retryconfig)\> |

#### Returns

```ts
(
   _target: unknown, 
   _propertyKey: string, 
descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T>;
```

##### Parameters

| Parameter | Type |
| :------ | :------ |
| `_target` | `unknown` |
| `_propertyKey` | `string` |
| `descriptor` | `TypedPropertyDescriptor`\<`T`\> |

##### Returns

`TypedPropertyDescriptor`\<`T`\>
