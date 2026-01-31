[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/payments/utils/crypto

# defi/protocols/src/vendors/payments/utils/crypto

## Classes

### CryptoError

Defined in: [defi/protocols/src/vendors/payments/utils/crypto.ts:19](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/crypto.ts#L19)

#### Extends

- `Error`

#### Constructors

##### Constructor

```ts
new CryptoError(message: string): CryptoError;
```

Defined in: [defi/protocols/src/vendors/payments/utils/crypto.ts:20](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/crypto.ts#L20)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `message` | `string` |

###### Returns

[`CryptoError`](/docs/api/defi/protocols/src/vendors/payments/utils/crypto.md#cryptoerror)

###### Overrides

```ts
Error.constructor
```

***

### NonceCache

Defined in: [defi/protocols/src/vendors/payments/utils/crypto.ts:176](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/crypto.ts#L176)

Simple nonce cache for replay attack prevention
In production, consider using Redis or similar for distributed systems

#### Constructors

##### Constructor

```ts
new NonceCache(maxAge: number): NonceCache;
```

Defined in: [defi/protocols/src/vendors/payments/utils/crypto.ts:180](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/crypto.ts#L180)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `maxAge` | `number` |

###### Returns

[`NonceCache`](/docs/api/defi/protocols/src/vendors/payments/utils/crypto.md#noncecache)

#### Methods

##### add()

```ts
add(nonce: string): boolean;
```

Defined in: [defi/protocols/src/vendors/payments/utils/crypto.ts:185](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/crypto.ts#L185)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `nonce` | `string` |

###### Returns

`boolean`

##### clear()

```ts
clear(): void;
```

Defined in: [defi/protocols/src/vendors/payments/utils/crypto.ts:210](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/crypto.ts#L210)

###### Returns

`void`

##### size()

```ts
size(): number;
```

Defined in: [defi/protocols/src/vendors/payments/utils/crypto.ts:205](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/crypto.ts#L205)

###### Returns

`number`

## Interfaces

### WebhookValidationResult

Defined in: [defi/protocols/src/vendors/payments/utils/crypto.ts:14](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/crypto.ts#L14)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="error"></a> `error?` | `string` | [defi/protocols/src/vendors/payments/utils/crypto.ts:16](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/crypto.ts#L16) |
| <a id="isvalid"></a> `isValid` | `boolean` | [defi/protocols/src/vendors/payments/utils/crypto.ts:15](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/crypto.ts#L15) |

## Functions

### createTestSignature()

```ts
function createTestSignature(
   deviceSecret: string, 
   nonce: string, 
   body: string): string;
```

Defined in: [defi/protocols/src/vendors/payments/utils/crypto.ts:124](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/crypto.ts#L124)

Creates HMAC signature for testing purposes

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `deviceSecret` | `string` |
| `nonce` | `string` |
| `body` | `string` |

#### Returns

`string`

***

### generateNonce()

```ts
function generateNonce(length: number): string;
```

Defined in: [defi/protocols/src/vendors/payments/utils/crypto.ts:116](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/crypto.ts#L116)

Generates a secure random nonce for testing purposes

#### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `length` | `number` | `32` |

#### Returns

`string`

***

### getNonceCache()

```ts
function getNonceCache(): NonceCache;
```

Defined in: [defi/protocols/src/vendors/payments/utils/crypto.ts:218](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/crypto.ts#L218)

#### Returns

[`NonceCache`](/docs/api/defi/protocols/src/vendors/payments/utils/crypto.md#noncecache)

***

### resetNonceCache()

```ts
function resetNonceCache(): void;
```

Defined in: [defi/protocols/src/vendors/payments/utils/crypto.ts:225](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/crypto.ts#L225)

#### Returns

`void`

***

### validateNonce()

```ts
function validateNonce(
   nonce: string, 
   maxAge: number, 
   seenNonces: Set<string>): {
  error?: string;
  isValid: boolean;
};
```

Defined in: [defi/protocols/src/vendors/payments/utils/crypto.ts:138](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/crypto.ts#L138)

Validates nonce format and freshness
Prevents replay attacks by ensuring nonces are unique within a timeframe

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `nonce` | `string` |
| `maxAge` | `number` |
| `seenNonces` | `Set`\<`string`\> |

#### Returns

```ts
{
  error?: string;
  isValid: boolean;
}
```

| Name | Type | Defined in |
| :------ | :------ | :------ |
| `error?` | `string` | [defi/protocols/src/vendors/payments/utils/crypto.ts:142](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/crypto.ts#L142) |
| `isValid` | `boolean` | [defi/protocols/src/vendors/payments/utils/crypto.ts:142](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/crypto.ts#L142) |

***

### validateWebhookSignature()

```ts
function validateWebhookSignature(
   deviceSecret: string, 
   nonce: string, 
   rawBody: string, 
   receivedSignature: string): WebhookValidationResult;
```

Defined in: [defi/protocols/src/vendors/payments/utils/crypto.ts:35](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/crypto.ts#L35)

Validates webhook HMAC signature using timing-safe comparison
Formula: hex(hmac_sha256(device_secret, nonce + raw_body))

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `deviceSecret` | `string` | The device secret key |
| `nonce` | `string` | The nonce from X-NONCE header |
| `rawBody` | `string` | The raw webhook body |
| `receivedSignature` | `string` | The signature from X-SIGNATURE header |

#### Returns

[`WebhookValidationResult`](/docs/api/defi/protocols/src/vendors/payments/utils/crypto.md#webhookvalidationresult)
