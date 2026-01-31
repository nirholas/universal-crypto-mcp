[**Universal Crypto MCP API Reference v1.0.0**](../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / core/src/utils

# core/src/utils

## Classes

### MCPError

Defined in: [core/src/utils/index.ts:335](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/core/src/utils/index.ts#L335)

Wraps an error with additional context

#### Extends

- `Error`

#### Constructors

##### Constructor

```ts
new MCPError(
   message: string, 
   code: string, 
   details?: Record<string, unknown>): MCPError;
```

Defined in: [core/src/utils/index.ts:336](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/core/src/utils/index.ts#L336)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `message` | `string` |
| `code` | `string` |
| `details?` | `Record`\<`string`, `unknown`\> |

###### Returns

[`MCPError`](/docs/api/core/src/utils.md#mcperror)

###### Overrides

```ts
Error.constructor
```

#### Properties

| Property | Modifier | Type | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="code"></a> `code` | `public` | `string` | [core/src/utils/index.ts:338](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/core/src/utils/index.ts#L338) |
| <a id="details"></a> `details?` | `public` | `Record`\<`string`, `unknown`\> | [core/src/utils/index.ts:339](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/core/src/utils/index.ts#L339) |

## Functions

### Core

#### formatJson()

```ts
function formatJson(obj: unknown, indent: number): string;
```

Defined in: [core/src/utils/index.ts:253](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/core/src/utils/index.ts#L253)

Formats an object as pretty-printed JSON.

##### Parameters

| Parameter | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `obj` | `unknown` | `undefined` | The object to format |
| `indent` | `number` | `2` | Indentation spaces (default: 2) |

##### Returns

`string`

Pretty-printed JSON string

***

#### safeJsonParse()

```ts
function safeJsonParse<T>(json: string, fallback: T): T;
```

Defined in: [core/src/utils/index.ts:237](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/core/src/utils/index.ts#L237)

Safely parses JSON with a fallback value.

##### Type Parameters

| Type Parameter | Description |
| :------ | :------ |
| `T` | The expected type of the parsed value |

##### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `json` | `string` | The JSON string to parse |
| `fallback` | `T` | Value to return if parsing fails |

##### Returns

`T`

The parsed value or fallback

##### Example

```typescript
const data = safeJsonParse('{"key": "value"}', {}); // { key: 'value' }
const invalid = safeJsonParse('not json', {}); // {}
```

***

#### sleep()

```ts
function sleep(ms: number): Promise<void>;
```

Defined in: [core/src/utils/index.ts:273](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/core/src/utils/index.ts#L273)

Delays execution for specified milliseconds.

##### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `ms` | `number` | Milliseconds to sleep |

##### Returns

`Promise`\<`void`\>

Promise that resolves after the delay

##### Example

```typescript
await sleep(1000); // Wait 1 second
```

***

#### withRetry()

```ts
function withRetry<T>(fn: () => Promise<T>, options: {
  initialDelay?: number;
  maxDelay?: number;
  maxRetries?: number;
}): Promise<T>;
```

Defined in: [core/src/utils/index.ts:300](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/core/src/utils/index.ts#L300)

Retries a function with exponential backoff.

Useful for handling transient network errors or rate limits.

##### Type Parameters

| Type Parameter | Description |
| :------ | :------ |
| `T` | Return type of the function |

##### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `fn` | () => `Promise`\<`T`\> | Async function to retry |
| `options` | \{ `initialDelay?`: `number`; `maxDelay?`: `number`; `maxRetries?`: `number`; \} | Retry configuration |
| `options.initialDelay?` | `number` | Initial delay in ms (default: 1000) |
| `options.maxDelay?` | `number` | Maximum delay in ms (default: 10000) |
| `options.maxRetries?` | `number` | Maximum retry attempts (default: 3) |

##### Returns

`Promise`\<`T`\>

Result of the function

##### Throws

The last error if all retries fail

##### Example

```typescript
const result = await withRetry(
  () => fetchPriceData('BTC'),
  { maxRetries: 5, initialDelay: 500 }
);
```

### Wallets

#### checksumAddress()

```ts
function checksumAddress(address: string): `0x${string}`;
```

Defined in: [core/src/utils/index.ts:76](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/core/src/utils/index.ts#L76)

Validates and returns a checksummed Ethereum address.

##### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `address` | `string` | The address to checksum |

##### Returns

`` `0x${string}` ``

The checksummed address

##### Throws

Error if the address format is invalid

##### Example

```typescript
const checksummed = checksumAddress('0x742d35cc6634c0532925a3b844bc9e7595f1b3e1');
// Returns: '0x742d35Cc6634C0532925a3b844Bc9e7595f1b3e1'
```

***

#### isValidAddress()

```ts
function isValidAddress(address: string): address is `0x${string}`;
```

Defined in: [core/src/utils/index.ts:58](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/core/src/utils/index.ts#L58)

Validates an Ethereum address format.

Checks if the address is a valid 0x-prefixed 40-character hex string.
Does NOT validate checksums - use `checksumAddress` for that.

##### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `address` | `string` | The address string to validate |

##### Returns

`` address is `0x${string}` ``

True if the address format is valid

##### Example

```typescript
isValidAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f1b3e1'); // true
isValidAddress('0x123'); // false
isValidAddress('invalid'); // false
```

***

#### truncateAddress()

```ts
function truncateAddress(address: string, chars: number): string;
```

Defined in: [core/src/utils/index.ts:100](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/core/src/utils/index.ts#L100)

Truncates an address for display purposes.

##### Parameters

| Parameter | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `address` | `string` | `undefined` | The full address to truncate |
| `chars` | `number` | `4` | Number of characters to show on each end (default: 4) |

##### Returns

`string`

Truncated address like "0x742d...b3e1"

##### Example

```typescript
truncateAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f1b3e1'); 
// Returns: "0x742d...b3e1"

truncateAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f1b3e1', 6);
// Returns: "0x742d35...f1b3e1"
```

### Market Data

#### formatCurrency()

```ts
function formatCurrency(value: number, currency: string): string;
```

Defined in: [core/src/utils/index.ts:211](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/core/src/utils/index.ts#L211)

Formats a number as currency.

##### Parameters

| Parameter | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `value` | `number` | `undefined` | The value to format |
| `currency` | `string` | `'USD'` | ISO 4217 currency code (default: 'USD') |

##### Returns

`string`

Formatted currency string

##### Example

```typescript
formatCurrency(1234.56); // "$1,234.56"
formatCurrency(1234.56, 'EUR'); // "€1,234.56"
```

***

#### formatNumber()

```ts
function formatNumber(num: number, decimals: number): string;
```

Defined in: [core/src/utils/index.ts:190](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/core/src/utils/index.ts#L190)

Formats a number for display with thousands separators.

##### Parameters

| Parameter | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `num` | `number` | `undefined` | The number to format |
| `decimals` | `number` | `2` | Maximum decimal places (default: 2) |

##### Returns

`string`

Formatted string with commas

##### Example

```typescript
formatNumber(1234567.89); // "1,234,567.89"
formatNumber(1234567.89, 0); // "1,234,568"
```

### Other

#### createErrorResponse()

```ts
function createErrorResponse(error: unknown): {
  code: string;
  error: string;
};
```

Defined in: [core/src/utils/index.ts:349](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/core/src/utils/index.ts#L349)

Creates a standardized error response

##### Parameters

| Parameter | Type |
| :------ | :------ |
| `error` | `unknown` |

##### Returns

```ts
{
  code: string;
  error: string;
}
```

| Name | Type | Defined in |
| :------ | :------ | :------ |
| `code` | `string` | [core/src/utils/index.ts:349](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/core/src/utils/index.ts#L349) |
| `error` | `string` | [core/src/utils/index.ts:349](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/core/src/utils/index.ts#L349) |

### Tokens

#### formatUnits()

```ts
function formatUnits(value: bigint, decimals: number): string;
```

Defined in: [core/src/utils/index.ts:132](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/core/src/utils/index.ts#L132)

Formats a bigint value with decimal places.

Converts a raw token amount (in smallest units) to a human-readable
decimal string. This is the inverse of `parseUnits`.

##### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `value` | `bigint` | The raw value as bigint |
| `decimals` | `number` | Number of decimal places |

##### Returns

`string`

Formatted decimal string

##### Example

```typescript
// Format 1 ETH (18 decimals)
formatUnits(1000000000000000000n, 18); // "1"

// Format 1 USDC (6 decimals)
formatUnits(1000000n, 6); // "1"

// Format with fractional part
formatUnits(1500000n, 6); // "1.5"
```

***

#### parseUnits()

```ts
function parseUnits(value: string, decimals: number): bigint;
```

Defined in: [core/src/utils/index.ts:170](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/core/src/utils/index.ts#L170)

Parses a decimal string into bigint with specified decimals.

Converts a human-readable decimal amount to raw token units.
This is the inverse of `formatUnits`.

##### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` | The decimal string to parse |
| `decimals` | `number` | Number of decimal places |

##### Returns

`bigint`

The value as bigint in smallest units

##### Example

```typescript
// Parse 1 ETH
parseUnits("1", 18); // 1000000000000000000n

// Parse 1.5 USDC
parseUnits("1.5", 6); // 1500000n

// Parse with many decimals
parseUnits("0.001", 18); // 1000000000000000n
```

