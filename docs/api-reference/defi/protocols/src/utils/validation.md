[**Universal Crypto MCP API Reference v1.0.0**](../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/utils/validation

# defi/protocols/src/utils/validation

## Classes

### RateLimiter

Defined in: [defi/protocols/src/utils/validation.ts:139](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/validation.ts#L139)

Rate limiting helper

#### Constructors

##### Constructor

```ts
new RateLimiter(maxRequests: number, windowMs: number): RateLimiter;
```

Defined in: [defi/protocols/src/utils/validation.ts:142](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/validation.ts#L142)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `maxRequests` | `number` |
| `windowMs` | `number` |

###### Returns

[`RateLimiter`](/docs/api/defi/protocols/src/utils/validation.md#ratelimiter)

#### Methods

##### isAllowed()

```ts
isAllowed(key: string): boolean;
```

Defined in: [defi/protocols/src/utils/validation.ts:147](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/validation.ts#L147)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `key` | `string` |

###### Returns

`boolean`

##### reset()

```ts
reset(key: string): void;
```

Defined in: [defi/protocols/src/utils/validation.ts:163](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/validation.ts#L163)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `key` | `string` |

###### Returns

`void`

## Variables

### chainIdSchema

```ts
const chainIdSchema: ZodNumber;
```

Defined in: [defi/protocols/src/utils/validation.ts:59](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/validation.ts#L59)

Chain ID validation

***

### ensNameSchema

```ts
const ensNameSchema: ZodEffects<ZodString, string, string>;
```

Defined in: [defi/protocols/src/utils/validation.ts:37](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/validation.ts#L37)

ENS name validation schema

***

### ethereumAddressSchema

```ts
const ethereumAddressSchema: ZodEffects<ZodString, `0x${string}`, string>;
```

Defined in: [defi/protocols/src/utils/validation.ts:12](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/validation.ts#L12)

Ethereum address validation schema

***

### gasLimitSchema

```ts
const gasLimitSchema: ZodNumber;
```

Defined in: [defi/protocols/src/utils/validation.ts:88](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/validation.ts#L88)

Gas limit validation

***

### positiveNumberSchema

```ts
const positiveNumberSchema: ZodNumber;
```

Defined in: [defi/protocols/src/utils/validation.ts:45](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/validation.ts#L45)

Positive number validation

***

### privateKeySchema

```ts
const privateKeySchema: ZodEffects<ZodString, `0x${string}`, string>;
```

Defined in: [defi/protocols/src/utils/validation.ts:29](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/validation.ts#L29)

Private key validation schema (hex format)
Note: Does NOT validate that it's a valid EC key, just format

***

### slippageSchema

```ts
const slippageSchema: ZodDefault<ZodNumber>;
```

Defined in: [defi/protocols/src/utils/validation.ts:79](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/validation.ts#L79)

Slippage validation (0-100%)

***

### tokenAmountSchema

```ts
const tokenAmountSchema: ZodString;
```

Defined in: [defi/protocols/src/utils/validation.ts:52](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/validation.ts#L52)

Token amount validation (string to handle large numbers)

***

### transactionHashSchema

```ts
const transactionHashSchema: ZodEffects<ZodString, `0x${string}`, string>;
```

Defined in: [defi/protocols/src/utils/validation.ts:20](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/validation.ts#L20)

Transaction hash validation schema

***

### urlSchema

```ts
const urlSchema: ZodEffects<ZodString, string, string>;
```

Defined in: [defi/protocols/src/utils/validation.ts:68](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/validation.ts#L68)

URL validation schema

## Functions

### normalizeNetworkName()

```ts
function normalizeNetworkName(network: string): string;
```

Defined in: [defi/protocols/src/utils/validation.ts:107](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/validation.ts#L107)

Validate and normalize network name

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `network` | `string` |

#### Returns

`string`

***

### sanitizeInput()

```ts
function sanitizeInput(input: string): string;
```

Defined in: [defi/protocols/src/utils/validation.ts:97](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/validation.ts#L97)

Sanitize user input to prevent injection

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `input` | `string` |

#### Returns

`string`

***

### validateNotBlockedAddress()

```ts
function validateNotBlockedAddress(address: string): boolean;
```

Defined in: [defi/protocols/src/utils/validation.ts:132](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/validation.ts#L132)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `address` | `string` |

#### Returns

`boolean`
