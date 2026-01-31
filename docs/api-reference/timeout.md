[**Universal Crypto MCP API Reference v1.0.0**](index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / timeout

# timeout

Timeout Utilities

Provides timeout handling for async operations to prevent hanging.

## Author

nich <nich@nichxbt.com>

## Interfaces

### TimeoutConfig

Defined in: [shared/utils/src/timeout/index.ts:16](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/timeout/index.ts#L16)

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="message"></a> `message?` | `string` | Custom error message | [shared/utils/src/timeout/index.ts:20](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/timeout/index.ts#L20) |
| <a id="operation"></a> `operation?` | `string` | Operation name for error context | [shared/utils/src/timeout/index.ts:22](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/timeout/index.ts#L22) |
| <a id="timeoutms"></a> `timeoutMs` | `number` | Timeout in milliseconds | [shared/utils/src/timeout/index.ts:18](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/timeout/index.ts#L18) |

## Variables

### DEFAULT\_TIMEOUTS

```ts
const DEFAULT_TIMEOUTS: {
  BLOCKCHAIN_RPC: 15000;
  CONFIRMATION: 120000;
  DATABASE: 10000;
  FAST_API: 5000;
  HTTP_REQUEST: 30000;
  SLOW_API: 60000;
  TRANSACTION: 30000;
  WEBSOCKET: 10000;
};
```

Defined in: [shared/utils/src/timeout/index.ts:29](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/timeout/index.ts#L29)

#### Type Declaration

| Name | Type | Default value | Description | Defined in |
| :------ | :------ | :------ | :------ | :------ |
| <a id="blockchain_rpc"></a> `BLOCKCHAIN_RPC` | `15000` | `15000` | Blockchain RPC calls | [shared/utils/src/timeout/index.ts:37](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/timeout/index.ts#L37) |
| <a id="confirmation"></a> `CONFIRMATION` | `120000` | `120000` | Transaction confirmation | [shared/utils/src/timeout/index.ts:41](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/timeout/index.ts#L41) |
| <a id="database"></a> `DATABASE` | `10000` | `10000` | Database query | [shared/utils/src/timeout/index.ts:45](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/timeout/index.ts#L45) |
| <a id="fast_api"></a> `FAST_API` | `5000` | `5000` | Fast API calls (price checks, etc.) | [shared/utils/src/timeout/index.ts:33](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/timeout/index.ts#L33) |
| <a id="http_request"></a> `HTTP_REQUEST` | `30000` | `30000` | Default HTTP request timeout | [shared/utils/src/timeout/index.ts:31](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/timeout/index.ts#L31) |
| <a id="slow_api"></a> `SLOW_API` | `60000` | `60000` | Slow API calls (large data fetches) | [shared/utils/src/timeout/index.ts:35](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/timeout/index.ts#L35) |
| <a id="transaction"></a> `TRANSACTION` | `30000` | `30000` | Transaction submission | [shared/utils/src/timeout/index.ts:39](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/timeout/index.ts#L39) |
| <a id="websocket"></a> `WEBSOCKET` | `10000` | `10000` | WebSocket connection | [shared/utils/src/timeout/index.ts:43](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/timeout/index.ts#L43) |

## Functions

### allWithTimeout()

```ts
function allWithTimeout<T>(promises: Promise<T>[], config: TimeoutConfig): Promise<T[]>;
```

Defined in: [shared/utils/src/timeout/index.ts:244](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/timeout/index.ts#L244)

All promises with timeout

#### Type Parameters

| Type Parameter |
| :------ |
| `T` |

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `promises` | `Promise`\<`T`\>[] |
| `config` | [`TimeoutConfig`](/docs/api/timeout.md#timeoutconfig) |

#### Returns

`Promise`\<`T`[]\>

***

### createDeadline()

```ts
function createDeadline(timeoutMs: number): {
  createdAt: number;
  expired: boolean;
  expiresAt: number;
  remaining: number;
};
```

Defined in: [shared/utils/src/timeout/index.ts:191](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/timeout/index.ts#L191)

Create a deadline (absolute timeout)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `timeoutMs` | `number` |

#### Returns

```ts
{
  createdAt: number;
  expired: boolean;
  expiresAt: number;
  remaining: number;
}
```

| Name | Type | Defined in |
| :------ | :------ | :------ |
| `createdAt` | `number` | [shared/utils/src/timeout/index.ts:194](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/timeout/index.ts#L194) |
| `expired` | `boolean` | [shared/utils/src/timeout/index.ts:192](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/timeout/index.ts#L192) |
| `expiresAt` | `number` | [shared/utils/src/timeout/index.ts:195](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/timeout/index.ts#L195) |
| `remaining` | `number` | [shared/utils/src/timeout/index.ts:193](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/timeout/index.ts#L193) |

#### Example

```typescript
const deadline = createDeadline(5000);

while (!deadline.expired) {
  // Do work
  if (deadline.remaining < 1000) break;
}
```

***

### createTimeoutAbortController()

```ts
function createTimeoutAbortController(timeoutMs: number): AbortController & {
  timeoutId: Timeout;
};
```

Defined in: [shared/utils/src/timeout/index.ts:222](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/timeout/index.ts#L222)

AbortController with timeout

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `timeoutMs` | `number` |

#### Returns

`AbortController` & \{
  `timeoutId`: `Timeout`;
\}

#### Example

```typescript
const controller = createTimeoutAbortController(5000);

const response = await fetch(url, { signal: controller.signal });
```

***

### createTimeoutWrapper()

```ts
function createTimeoutWrapper<T>(fn: T, config: TimeoutConfig): T;
```

Defined in: [shared/utils/src/timeout/index.ts:104](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/timeout/index.ts#L104)

Create a timeout-wrapped version of an async function

#### Type Parameters

| Type Parameter |
| :------ |
| `T` *extends* (...`args`: `unknown`[]) => `Promise`\<`unknown`\> |

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `fn` | `T` |
| `config` | [`TimeoutConfig`](/docs/api/timeout.md#timeoutconfig) |

#### Returns

`T`

#### Example

```typescript
const fetchWithTimeout = createTimeoutWrapper(
  fetch,
  { timeoutMs: 5000 }
);
const response = await fetchWithTimeout('https://api.example.com');
```

***

### raceWithTimeout()

```ts
function raceWithTimeout<T>(promises: Promise<T>[], config: TimeoutConfig): Promise<T>;
```

Defined in: [shared/utils/src/timeout/index.ts:234](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/timeout/index.ts#L234)

Race multiple promises with a timeout

#### Type Parameters

| Type Parameter |
| :------ |
| `T` |

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `promises` | `Promise`\<`T`\>[] |
| `config` | [`TimeoutConfig`](/docs/api/timeout.md#timeoutconfig) |

#### Returns

`Promise`\<`T`\>

***

### sleep()

```ts
function sleep(ms: number): Promise<void>;
```

Defined in: [shared/utils/src/timeout/index.ts:174](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/timeout/index.ts#L174)

Sleep for a specified duration

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `ms` | `number` |

#### Returns

`Promise`\<`void`\>

***

### timeout()

```ts
function timeout(config: TimeoutConfig): <T>(_target: unknown, propertyKey: string, descriptor: TypedPropertyDescriptor<T>) => TypedPropertyDescriptor<T>;
```

Defined in: [shared/utils/src/timeout/index.ts:116](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/timeout/index.ts#L116)

Decorator for adding timeout to class methods

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `config` | [`TimeoutConfig`](/docs/api/timeout.md#timeoutconfig) |

#### Returns

```ts
<T>(
   _target: unknown, 
   propertyKey: string, 
descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T>;
```

##### Type Parameters

| Type Parameter |
| :------ |
| `T` *extends* (...`args`: `unknown`[]) => `Promise`\<`unknown`\> |

##### Parameters

| Parameter | Type |
| :------ | :------ |
| `_target` | `unknown` |
| `propertyKey` | `string` |
| `descriptor` | `TypedPropertyDescriptor`\<`T`\> |

##### Returns

`TypedPropertyDescriptor`\<`T`\>

***

### waitFor()

```ts
function waitFor(condition: () => boolean | Promise<boolean>, config: TimeoutConfig & {
  pollInterval?: number;
}): Promise<void>;
```

Defined in: [shared/utils/src/timeout/index.ts:146](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/timeout/index.ts#L146)

Wait for a condition with timeout

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `condition` | () => `boolean` \| `Promise`\<`boolean`\> |
| `config` | [`TimeoutConfig`](/docs/api/timeout.md#timeoutconfig) & \{ `pollInterval?`: `number`; \} |

#### Returns

`Promise`\<`void`\>

#### Example

```typescript
await waitFor(
  async () => await isTransactionConfirmed(txHash),
  { timeoutMs: 60000, pollInterval: 1000 }
);
```

***

### withTimeout()

```ts
function withTimeout<T>(promise: Promise<T>, config: number | TimeoutConfig): Promise<T>;
```

Defined in: [shared/utils/src/timeout/index.ts:63](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/timeout/index.ts#L63)

Wrap a promise with a timeout

#### Type Parameters

| Type Parameter |
| :------ |
| `T` |

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `promise` | `Promise`\<`T`\> |
| `config` | `number` \| [`TimeoutConfig`](/docs/api/timeout.md#timeoutconfig) |

#### Returns

`Promise`\<`T`\>

#### Example

```typescript
const result = await withTimeout(
  fetch('https://api.example.com'),
  { timeoutMs: 5000, operation: 'fetch-data' }
);
```
