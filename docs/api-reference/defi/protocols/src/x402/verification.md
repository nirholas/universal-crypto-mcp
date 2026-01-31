[**Universal Crypto MCP API Reference v1.0.0**](../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/x402/verification

# defi/protocols/src/x402/verification

## Interfaces

### EIP3009Authorization

Defined in: [defi/protocols/src/x402/verification.ts:339](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verification.ts#L339)

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="from"></a> `from` | `` `0x${string}` `` | Token holder address | [defi/protocols/src/x402/verification.ts:341](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verification.ts#L341) |
| <a id="nonce"></a> `nonce` | `string` | Unique nonce | [defi/protocols/src/x402/verification.ts:351](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verification.ts#L351) |
| <a id="r"></a> `r` | `string` | Signature r | [defi/protocols/src/x402/verification.ts:355](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verification.ts#L355) |
| <a id="s"></a> `s` | `string` | Signature s | [defi/protocols/src/x402/verification.ts:357](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verification.ts#L357) |
| <a id="to"></a> `to` | `` `0x${string}` `` | Recipient address | [defi/protocols/src/x402/verification.ts:343](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verification.ts#L343) |
| <a id="v"></a> `v` | `number` | Signature v | [defi/protocols/src/x402/verification.ts:353](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verification.ts#L353) |
| <a id="validafter"></a> `validAfter` | `number` | Valid after timestamp | [defi/protocols/src/x402/verification.ts:347](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verification.ts#L347) |
| <a id="validbefore"></a> `validBefore` | `number` | Valid before timestamp | [defi/protocols/src/x402/verification.ts:349](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verification.ts#L349) |
| <a id="value"></a> `value` | `string` | Amount | [defi/protocols/src/x402/verification.ts:345](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verification.ts#L345) |

***

### PaymentProof

Defined in: [defi/protocols/src/x402/verification.ts:116](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verification.ts#L116)

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="amount"></a> `amount` | `string` | Amount paid (in token's smallest unit) | [defi/protocols/src/x402/verification.ts:126](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verification.ts#L126) |
| <a id="blocknumber"></a> `blockNumber` | `number` | Block number | [defi/protocols/src/x402/verification.ts:130](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verification.ts#L130) |
| <a id="chainid"></a> `chainId` | `number` | Chain ID | [defi/protocols/src/x402/verification.ts:120](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verification.ts#L120) |
| <a id="facilitatorsignature"></a> `facilitatorSignature?` | `string` | Signature from facilitator | [defi/protocols/src/x402/verification.ts:136](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verification.ts#L136) |
| <a id="from-1"></a> `from` | `` `0x${string}` `` | Payer address | [defi/protocols/src/x402/verification.ts:122](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verification.ts#L122) |
| <a id="nonce-1"></a> `nonce` | `string` | Nonce to prevent replay | [defi/protocols/src/x402/verification.ts:134](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verification.ts#L134) |
| <a id="timestamp"></a> `timestamp` | `number` | Block timestamp | [defi/protocols/src/x402/verification.ts:132](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verification.ts#L132) |
| <a id="to-1"></a> `to` | `` `0x${string}` `` | Recipient address | [defi/protocols/src/x402/verification.ts:124](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verification.ts#L124) |
| <a id="token"></a> `token` | `` `0x${string}` `` | Token address (or 0x0 for native) | [defi/protocols/src/x402/verification.ts:128](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verification.ts#L128) |
| <a id="txhash"></a> `txHash` | `string` | Transaction hash | [defi/protocols/src/x402/verification.ts:118](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verification.ts#L118) |

***

### PaymentReceipt

Defined in: [defi/protocols/src/x402/verification.ts:427](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verification.ts#L427)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="facilitator"></a> `facilitator?` | \{ `address`: `` `0x${string}` ``; `name`: `string`; `signatureValid`: `boolean`; \} | [defi/protocols/src/x402/verification.ts:431](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verification.ts#L431) |
| `facilitator.address` | `` `0x${string}` `` | [defi/protocols/src/x402/verification.ts:432](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verification.ts#L432) |
| `facilitator.name` | `string` | [defi/protocols/src/x402/verification.ts:433](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verification.ts#L433) |
| `facilitator.signatureValid` | `boolean` | [defi/protocols/src/x402/verification.ts:434](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verification.ts#L434) |
| <a id="paymentid"></a> `paymentId` | `string` | [defi/protocols/src/x402/verification.ts:428](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verification.ts#L428) |
| <a id="proof"></a> `proof` | [`PaymentProof`](/docs/api/defi/protocols/src/x402/verification.md#paymentproof) | [defi/protocols/src/x402/verification.ts:429](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verification.ts#L429) |
| <a id="verifiedat"></a> `verifiedAt` | `Date` | [defi/protocols/src/x402/verification.ts:430](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verification.ts#L430) |

***

### ProofVerificationResult

Defined in: [defi/protocols/src/x402/verification.ts:139](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verification.ts#L139)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="details"></a> `details?` | \{ `amountMatches`: `boolean`; `notReplayed`: `boolean`; `recipientMatches`: `boolean`; `signatureValid`: `boolean`; `txExists`: `boolean`; \} | [defi/protocols/src/x402/verification.ts:144](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verification.ts#L144) |
| `details.amountMatches` | `boolean` | [defi/protocols/src/x402/verification.ts:146](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verification.ts#L146) |
| `details.notReplayed` | `boolean` | [defi/protocols/src/x402/verification.ts:149](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verification.ts#L149) |
| `details.recipientMatches` | `boolean` | [defi/protocols/src/x402/verification.ts:147](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verification.ts#L147) |
| `details.signatureValid` | `boolean` | [defi/protocols/src/x402/verification.ts:148](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verification.ts#L148) |
| `details.txExists` | `boolean` | [defi/protocols/src/x402/verification.ts:145](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verification.ts#L145) |
| <a id="errors"></a> `errors` | `string`[] | [defi/protocols/src/x402/verification.ts:142](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verification.ts#L142) |
| <a id="valid"></a> `valid` | `boolean` | [defi/protocols/src/x402/verification.ts:140](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verification.ts#L140) |
| <a id="verified"></a> `verified` | `boolean` | [defi/protocols/src/x402/verification.ts:141](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verification.ts#L141) |
| <a id="warnings"></a> `warnings` | `string`[] | [defi/protocols/src/x402/verification.ts:143](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verification.ts#L143) |

## Functions

### clearAllVerificationData()

```ts
function clearAllVerificationData(): void;
```

Defined in: [defi/protocols/src/x402/verification.ts:477](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verification.ts#L477)

#### Returns

`void`

***

### generatePaymentId()

```ts
function generatePaymentId(
   chainId: number, 
   txHash: string, 
   logIndex?: number): string;
```

Defined in: [defi/protocols/src/x402/verification.ts:413](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verification.ts#L413)

Generate a deterministic payment ID from transaction details

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `chainId` | `number` |
| `txHash` | `string` |
| `logIndex?` | `number` |

#### Returns

`string`

***

### getNonceStats()

```ts
function getNonceStats(): {
  count: number;
  newestTimestamp: number | null;
  oldestTimestamp: number | null;
};
```

Defined in: [defi/protocols/src/x402/verification.ts:99](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verification.ts#L99)

Get nonce statistics

#### Returns

```ts
{
  count: number;
  newestTimestamp: number | null;
  oldestTimestamp: number | null;
}
```

| Name | Type | Defined in |
| :------ | :------ | :------ |
| `count` | `number` | [defi/protocols/src/x402/verification.ts:100](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verification.ts#L100) |
| `newestTimestamp` | `number` \| `null` | [defi/protocols/src/x402/verification.ts:102](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verification.ts#L102) |
| `oldestTimestamp` | `number` \| `null` | [defi/protocols/src/x402/verification.ts:101](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verification.ts#L101) |

***

### getReceipt()

```ts
function getReceipt(paymentId: string): 
  | PaymentReceipt
  | undefined;
```

Defined in: [defi/protocols/src/x402/verification.ts:462](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verification.ts#L462)

Get a stored receipt

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `paymentId` | `string` |

#### Returns

  \| [`PaymentReceipt`](/docs/api/defi/protocols/src/x402/verification.md#paymentreceipt)
  \| `undefined`

***

### getRegisteredFacilitators()

```ts
function getRegisteredFacilitators(): {
  address: `0x${string}`;
  name: string;
  trusted: boolean;
}[];
```

Defined in: [defi/protocols/src/x402/verification.ts:274](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verification.ts#L274)

Get all registered facilitators

#### Returns

\{
  `address`: `` `0x${string}` ``;
  `name`: `string`;
  `trusted`: `boolean`;
\}[]

***

### isNonceUsed()

```ts
function isNonceUsed(nonce: string): boolean;
```

Defined in: [defi/protocols/src/x402/verification.ts:37](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verification.ts#L37)

Check if a nonce has been used (replay attack detection)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `nonce` | `string` |

#### Returns

`boolean`

***

### isPaymentVerified()

```ts
function isPaymentVerified(paymentId: string): boolean;
```

Defined in: [defi/protocols/src/x402/verification.ts:469](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verification.ts#L469)

Check if a payment has been verified

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `paymentId` | `string` |

#### Returns

`boolean`

***

### isTrustedFacilitator()

```ts
function isTrustedFacilitator(address: `0x${string}`): boolean;
```

Defined in: [defi/protocols/src/x402/verification.ts:266](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verification.ts#L266)

Check if a facilitator is trusted

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `address` | `` `0x${string}` `` |

#### Returns

`boolean`

***

### isValidTxHash()

```ts
function isValidTxHash(hash: string): boolean;
```

Defined in: [defi/protocols/src/x402/verification.ts:402](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verification.ts#L402)

Validate transaction hash format

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `hash` | `string` |

#### Returns

`boolean`

***

### markNonceUsed()

```ts
function markNonceUsed(nonce: string, paymentId: string): void;
```

Defined in: [defi/protocols/src/x402/verification.ts:45](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verification.ts#L45)

Mark a nonce as used

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `nonce` | `string` |
| `paymentId` | `string` |

#### Returns

`void`

***

### registerFacilitator()

```ts
function registerFacilitator(
   address: `0x${string}`, 
   name: string, 
   trusted: boolean): void;
```

Defined in: [defi/protocols/src/x402/verification.ts:249](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verification.ts#L249)

Register a known facilitator

#### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `address` | `` `0x${string}` `` | `undefined` |
| `name` | `string` | `undefined` |
| `trusted` | `boolean` | `true` |

#### Returns

`void`

***

### storeReceipt()

```ts
function storeReceipt(receipt: PaymentReceipt): void;
```

Defined in: [defi/protocols/src/x402/verification.ts:444](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verification.ts#L444)

Store a verified payment receipt

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `receipt` | [`PaymentReceipt`](/docs/api/defi/protocols/src/x402/verification.md#paymentreceipt) |

#### Returns

`void`

***

### verifyAuthorizationTiming()

```ts
function verifyAuthorizationTiming(auth: EIP3009Authorization): {
  error?: string;
  valid: boolean;
};
```

Defined in: [defi/protocols/src/x402/verification.ts:363](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verification.ts#L363)

Verify an EIP-3009 authorization hasn't expired

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `auth` | [`EIP3009Authorization`](/docs/api/defi/protocols/src/x402/verification.md#eip3009authorization) |

#### Returns

```ts
{
  error?: string;
  valid: boolean;
}
```

| Name | Type | Defined in |
| :------ | :------ | :------ |
| `error?` | `string` | [defi/protocols/src/x402/verification.ts:365](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verification.ts#L365) |
| `valid` | `boolean` | [defi/protocols/src/x402/verification.ts:364](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verification.ts#L364) |

***

### verifyFacilitatorSignature()

```ts
function verifyFacilitatorSignature(
   proof: PaymentProof, 
   signature: string, 
expectedSigner: `0x${string}`): Promise<boolean>;
```

Defined in: [defi/protocols/src/x402/verification.ts:306](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verification.ts#L306)

Verify a facilitator's signature on a payment proof

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `proof` | [`PaymentProof`](/docs/api/defi/protocols/src/x402/verification.md#paymentproof) |
| `signature` | `string` |
| `expectedSigner` | `` `0x${string}` `` |

#### Returns

`Promise`\<`boolean`\>

***

### verifyPaymentProof()

```ts
function verifyPaymentProof(
   proof: PaymentProof, 
   expectedRecipient: `0x${string}`, 
   expectedAmount: string, 
facilitatorAddress?: `0x${string}`): Promise<ProofVerificationResult>;
```

Defined in: [defi/protocols/src/x402/verification.ts:156](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verification.ts#L156)

Verify a payment proof

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `proof` | [`PaymentProof`](/docs/api/defi/protocols/src/x402/verification.md#paymentproof) |
| `expectedRecipient` | `` `0x${string}` `` |
| `expectedAmount` | `string` |
| `facilitatorAddress?` | `` `0x${string}` `` |

#### Returns

`Promise`\<[`ProofVerificationResult`](/docs/api/defi/protocols/src/x402/verification.md#proofverificationresult)\>
