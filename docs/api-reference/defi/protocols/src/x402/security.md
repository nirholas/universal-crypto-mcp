[**Universal Crypto MCP API Reference v1.0.0**](../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/x402/security

# defi/protocols/src/x402/security

## Interfaces

### ExternalSigner

Defined in: [defi/protocols/src/x402/security.ts:342](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/security.ts#L342)

#### Methods

##### getAddress()

```ts
getAddress(): Promise<`0x${string}`>;
```

Defined in: [defi/protocols/src/x402/security.ts:343](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/security.ts#L343)

###### Returns

`Promise`\<`` `0x${string}` ``\>

##### signMessage()

```ts
signMessage(message: string): Promise<`0x${string}`>;
```

Defined in: [defi/protocols/src/x402/security.ts:344](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/security.ts#L344)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `message` | `string` |

###### Returns

`Promise`\<`` `0x${string}` ``\>

##### signTransaction()

```ts
signTransaction(tx: Record<string, unknown>): Promise<`0x${string}`>;
```

Defined in: [defi/protocols/src/x402/security.ts:345](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/security.ts#L345)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `tx` | `Record`\<`string`, `unknown`\> |

###### Returns

`Promise`\<`` `0x${string}` ``\>

***

### SecurityEvent

Defined in: [defi/protocols/src/x402/security.ts:217](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/security.ts#L217)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="details"></a> `details` | `Record`\<`string`, `unknown`\> | [defi/protocols/src/x402/security.ts:220](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/security.ts#L220) |
| <a id="event"></a> `event` | [`SecurityEventType`](/docs/api/defi/protocols/src/x402/security.md#securityeventtype) | [defi/protocols/src/x402/security.ts:219](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/security.ts#L219) |
| <a id="severity"></a> `severity` | `"critical"` \| `"info"` \| `"warning"` | [defi/protocols/src/x402/security.ts:221](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/security.ts#L221) |
| <a id="timestamp"></a> `timestamp` | `Date` | [defi/protocols/src/x402/security.ts:218](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/security.ts#L218) |

## Type Aliases

### SecurityEventType

```ts
type SecurityEventType = 
  | "key_loaded"
  | "key_validation_failed"
  | "payment_limit_exceeded"
  | "daily_limit_exceeded"
  | "untrusted_service"
  | "invalid_address"
  | "invalid_url"
  | "replay_detected"
  | "mainnet_access"
  | "large_payment_warning"
  | "config_changed";
```

Defined in: [defi/protocols/src/x402/security.ts:224](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/security.ts#L224)

## Functions

### clearExternalSigner()

```ts
function clearExternalSigner(): void;
```

Defined in: [defi/protocols/src/x402/security.ts:376](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/security.ts#L376)

Clear external signer (for testing)

#### Returns

`void`

***

### clearSecurityEvents()

```ts
function clearSecurityEvents(): void;
```

Defined in: [defi/protocols/src/x402/security.ts:295](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/security.ts#L295)

Clear security events (for testing only)

#### Returns

`void`

***

### generateSecureNonce()

```ts
function generateSecureNonce(): string;
```

Defined in: [defi/protocols/src/x402/security.ts:402](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/security.ts#L402)

Generate a secure random nonce

#### Returns

`string`

***

### getExternalSigner()

```ts
function getExternalSigner(): 
  | ExternalSigner
  | null;
```

Defined in: [defi/protocols/src/x402/security.ts:369](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/security.ts#L369)

Get the external signer

#### Returns

  \| [`ExternalSigner`](/docs/api/defi/protocols/src/x402/security.md#externalsigner)
  \| `null`

***

### getSecurityEvents()

```ts
function getSecurityEvents(limit: number, filterSeverity?: "critical" | "info" | "warning"): SecurityEvent[];
```

Defined in: [defi/protocols/src/x402/security.ts:279](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/security.ts#L279)

Get recent security events

#### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `limit` | `number` | `100` |
| `filterSeverity?` | `"critical"` \| `"info"` \| `"warning"` | `undefined` |

#### Returns

[`SecurityEvent`](/docs/api/defi/protocols/src/x402/security.md#securityevent)[]

***

### hasExternalSigner()

```ts
function hasExternalSigner(): boolean;
```

Defined in: [defi/protocols/src/x402/security.ts:362](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/security.ts#L362)

Check if external signer is available

#### Returns

`boolean`

***

### isChecksumValid()

```ts
function isChecksumValid(address: string): boolean;
```

Defined in: [defi/protocols/src/x402/security.ts:145](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/security.ts#L145)

Check if an address matches its checksum

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `address` | `string` |

#### Returns

`boolean`

***

### isKeySourceSecure()

```ts
function isKeySourceSecure(): {
  secure: boolean;
  warnings: string[];
};
```

Defined in: [defi/protocols/src/x402/security.ts:84](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/security.ts#L84)

Check if the private key source is secure

#### Returns

```ts
{
  secure: boolean;
  warnings: string[];
}
```

| Name | Type | Defined in |
| :------ | :------ | :------ |
| `secure` | `boolean` | [defi/protocols/src/x402/security.ts:85](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/security.ts#L85) |
| `warnings` | `string`[] | [defi/protocols/src/x402/security.ts:86](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/security.ts#L86) |

***

### isProductionEnvironment()

```ts
function isProductionEnvironment(): boolean;
```

Defined in: [defi/protocols/src/x402/security.ts:309](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/security.ts#L309)

Check if current environment is production

#### Returns

`boolean`

***

### isTestnetOnly()

```ts
function isTestnetOnly(): boolean;
```

Defined in: [defi/protocols/src/x402/security.ts:334](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/security.ts#L334)

Check if running in testnet-only mode

#### Returns

`boolean`

***

### loadPrivateKeySecure()

```ts
function loadPrivateKeySecure(): `0x${string}` | null;
```

Defined in: [defi/protocols/src/x402/security.ts:66](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/security.ts#L66)

Securely load private key from environment
Never logs or exposes the actual key value

#### Returns

`` `0x${string}` `` \| `null`

***

### logSecurityEvent()

```ts
function logSecurityEvent(
   event: SecurityEventType, 
   details: Record<string, unknown>, 
   severity: "critical" | "info" | "warning"): void;
```

Defined in: [defi/protocols/src/x402/security.ts:243](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/security.ts#L243)

Log a security event

#### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `event` | [`SecurityEventType`](/docs/api/defi/protocols/src/x402/security.md#securityeventtype) | `undefined` |
| `details` | `Record`\<`string`, `unknown`\> | `undefined` |
| `severity` | `"critical"` \| `"info"` \| `"warning"` | `"info"` |

#### Returns

`void`

***

### maskSensitiveData()

```ts
function maskSensitiveData(data: string, visibleChars: number): string;
```

Defined in: [defi/protocols/src/x402/security.ts:164](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/security.ts#L164)

Mask sensitive data for logging

#### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `data` | `string` | `undefined` |
| `visibleChars` | `number` | `4` |

#### Returns

`string`

***

### registerExternalSigner()

```ts
function registerExternalSigner(signer: ExternalSigner): void;
```

Defined in: [defi/protocols/src/x402/security.ts:353](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/security.ts#L353)

Register an external signer (hardware wallet, etc.)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `signer` | [`ExternalSigner`](/docs/api/defi/protocols/src/x402/security.md#externalsigner) |

#### Returns

`void`

***

### requireMainnetOptIn()

```ts
function requireMainnetOptIn(): boolean;
```

Defined in: [defi/protocols/src/x402/security.ts:319](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/security.ts#L319)

Require explicit mainnet opt-in

#### Returns

`boolean`

***

### sanitizeForLogging()

```ts
function sanitizeForLogging(obj: Record<string, unknown>): Record<string, unknown>;
```

Defined in: [defi/protocols/src/x402/security.ts:177](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/security.ts#L177)

Sanitize data before logging
Removes or masks private keys and other sensitive information

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `obj` | `Record`\<`string`, `unknown`\> |

#### Returns

`Record`\<`string`, `unknown`\>

***

### secureRandomBytes()

```ts
function secureRandomBytes(length: number): Uint8Array;
```

Defined in: [defi/protocols/src/x402/security.ts:387](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/security.ts#L387)

Generate cryptographically secure random bytes

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `length` | `number` |

#### Returns

`Uint8Array`

***

### validateAndChecksumAddress()

```ts
function validateAndChecksumAddress(address: string): `0x${string}` | null;
```

Defined in: [defi/protocols/src/x402/security.ts:126](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/security.ts#L126)

Validate and checksum an EVM address

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `address` | `string` | Address to validate |

#### Returns

`` `0x${string}` `` \| `null`

Checksummed address or null if invalid

***

### validatePrivateKeyFormat()

```ts
function validatePrivateKeyFormat(key: string | undefined): {
  error?: string;
  valid: boolean;
};
```

Defined in: [defi/protocols/src/x402/security.ts:32](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/security.ts#L32)

Validate private key format without exposing it

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `key` | `string` \| `undefined` |

#### Returns

```ts
{
  error?: string;
  valid: boolean;
}
```

Validation result with sanitized error messages

| Name | Type | Defined in |
| :------ | :------ | :------ |
| `error?` | `string` | [defi/protocols/src/x402/security.ts:34](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/security.ts#L34) |
| `valid` | `boolean` | [defi/protocols/src/x402/security.ts:33](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/security.ts#L33) |
