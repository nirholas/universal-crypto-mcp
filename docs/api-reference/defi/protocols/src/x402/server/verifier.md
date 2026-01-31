[**Universal Crypto MCP API Reference v1.0.0**](../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/x402/server/verifier

# defi/protocols/src/x402/server/verifier

## Classes

### InMemoryNonceStore

Defined in: [defi/protocols/src/x402/server/verifier.ts:140](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/verifier.ts#L140)

Simple in-memory nonce store for replay protection
Use Redis or database store in production

#### Implements

- [`NonceStore`](/docs/api/defi/protocols/src/x402/server/types.md#noncestore)

#### Constructors

##### Constructor

```ts
new InMemoryNonceStore(defaultTtlSeconds: number): InMemoryNonceStore;
```

Defined in: [defi/protocols/src/x402/server/verifier.ts:144](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/verifier.ts#L144)

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `defaultTtlSeconds` | `number` | `3600` |

###### Returns

[`InMemoryNonceStore`](/docs/api/defi/protocols/src/x402/server/verifier.md#inmemorynoncestore)

#### Accessors

##### size

###### Get Signature

```ts
get size(): number;
```

Defined in: [defi/protocols/src/x402/server/verifier.ts:178](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/verifier.ts#L178)

Get count of stored nonces (for monitoring)

###### Returns

`number`

#### Methods

##### add()

```ts
add(nonce: string, ttlSeconds?: number): Promise<void>;
```

Defined in: [defi/protocols/src/x402/server/verifier.ts:163](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/verifier.ts#L163)

Mark nonce as used

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `nonce` | `string` |
| `ttlSeconds?` | `number` |

###### Returns

`Promise`\<`void`\>

###### Implementation of

[`NonceStore`](/docs/api/defi/protocols/src/x402/server/types.md#noncestore).[`add`](/docs/api/defi/protocols/src/x402/server/types.md#add)

##### cleanup()

```ts
cleanup(): Promise<void>;
```

Defined in: [defi/protocols/src/x402/server/verifier.ts:168](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/verifier.ts#L168)

Remove expired nonces

###### Returns

`Promise`\<`void`\>

###### Implementation of

[`NonceStore`](/docs/api/defi/protocols/src/x402/server/types.md#noncestore).[`cleanup`](/docs/api/defi/protocols/src/x402/server/types.md#cleanup)

##### has()

```ts
has(nonce: string): Promise<boolean>;
```

Defined in: [defi/protocols/src/x402/server/verifier.ts:151](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/verifier.ts#L151)

Check if nonce has been used

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `nonce` | `string` |

###### Returns

`Promise`\<`boolean`\>

###### Implementation of

[`NonceStore`](/docs/api/defi/protocols/src/x402/server/types.md#noncestore).[`has`](/docs/api/defi/protocols/src/x402/server/types.md#has)

***

### X402PaymentVerifier

Defined in: [defi/protocols/src/x402/server/verifier.ts:216](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/verifier.ts#L216)

X402 Payment Verifier

Verifies payments on-chain with replay protection

#### Constructors

##### Constructor

```ts
new X402PaymentVerifier(config: VerifierConfig): X402PaymentVerifier;
```

Defined in: [defi/protocols/src/x402/server/verifier.ts:225](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/verifier.ts#L225)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `config` | [`VerifierConfig`](/docs/api/defi/protocols/src/x402/server/verifier.md#verifierconfig) |

###### Returns

[`X402PaymentVerifier`](/docs/api/defi/protocols/src/x402/server/verifier.md#x402paymentverifier)

#### Methods

##### clearCache()

```ts
clearCache(): void;
```

Defined in: [defi/protocols/src/x402/server/verifier.ts:585](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/verifier.ts#L585)

Clear verification cache

###### Returns

`void`

##### getCacheStats()

```ts
getCacheStats(): {
  hitRate?: number;
  size: number;
};
```

Defined in: [defi/protocols/src/x402/server/verifier.ts:592](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/verifier.ts#L592)

Get cache statistics

###### Returns

```ts
{
  hitRate?: number;
  size: number;
}
```

| Name | Type | Defined in |
| :------ | :------ | :------ |
| `hitRate?` | `number` | [defi/protocols/src/x402/server/verifier.ts:592](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/verifier.ts#L592) |
| `size` | `number` | [defi/protocols/src/x402/server/verifier.ts:592](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/verifier.ts#L592) |

##### getChain()

```ts
getChain(): X402Chain;
```

Defined in: [defi/protocols/src/x402/server/verifier.ts:578](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/verifier.ts#L578)

Get current chain configuration

###### Returns

[`X402Chain`](/docs/api/defi/protocols/src/x402/sdk/types.md#x402chain)

##### hasProofBeenUsed()

```ts
hasProofBeenUsed(proof: string): Promise<boolean>;
```

Defined in: [defi/protocols/src/x402/server/verifier.ts:601](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/verifier.ts#L601)

Check if a proof has been used (for replay detection)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `proof` | `string` |

###### Returns

`Promise`\<`boolean`\>

##### markProofUsed()

```ts
markProofUsed(proof: string, ttlSeconds?: number): Promise<void>;
```

Defined in: [defi/protocols/src/x402/server/verifier.ts:608](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/verifier.ts#L608)

Manually mark a proof as used

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `proof` | `string` |
| `ttlSeconds?` | `number` |

###### Returns

`Promise`\<`void`\>

##### quickCheck()

```ts
quickCheck(txHash: `0x${string}`): Promise<boolean>;
```

Defined in: [defi/protocols/src/x402/server/verifier.ts:348](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/verifier.ts#L348)

Quick check if a transaction exists and is confirmed
Does not verify amount or recipient

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `txHash` | `` `0x${string}` `` | Transaction hash |

###### Returns

`Promise`\<`boolean`\>

True if transaction exists and is confirmed

##### verify()

```ts
verify(request: VerificationRequest): Promise<VerificationResult>;
```

Defined in: [defi/protocols/src/x402/server/verifier.ts:275](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/verifier.ts#L275)

Verify a payment

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `request` | [`VerificationRequest`](/docs/api/defi/protocols/src/x402/server/types.md#verificationrequest) | Verification request |

###### Returns

`Promise`\<[`VerificationResult`](/docs/api/defi/protocols/src/x402/server/types.md#verificationresult)\>

Verification result

###### Example

```typescript
const result = await verifier.verify({
  proof: '0xabc123...',
  expected: {
    amount: '10.00',
    token: 'USDs',
    chain: 'arbitrum',
    recipient: '0x...'
  },
  allowReplay: false
});
```

##### verifyBatch()

```ts
verifyBatch(requests: VerificationRequest[]): Promise<VerificationResult[]>;
```

Defined in: [defi/protocols/src/x402/server/verifier.ts:337](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/verifier.ts#L337)

Batch verify multiple payments

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `requests` | [`VerificationRequest`](/docs/api/defi/protocols/src/x402/server/types.md#verificationrequest)[] | Array of verification requests |

###### Returns

`Promise`\<[`VerificationResult`](/docs/api/defi/protocols/src/x402/server/types.md#verificationresult)[]\>

Array of verification results

## Interfaces

### VerifierConfig

Defined in: [defi/protocols/src/x402/server/verifier.ts:190](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/verifier.ts#L190)

Verifier configuration

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="amounttolerancepercent"></a> `amountTolerancePercent?` | `number` | Allow small amount discrepancies (as percentage) | [defi/protocols/src/x402/server/verifier.ts:204](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/verifier.ts#L204) |
| <a id="cacheresults"></a> `cacheResults?` | `boolean` | Cache verification results | [defi/protocols/src/x402/server/verifier.ts:206](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/verifier.ts#L206) |
| <a id="cachettlseconds"></a> `cacheTtlSeconds?` | `number` | Cache TTL in seconds | [defi/protocols/src/x402/server/verifier.ts:208](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/verifier.ts#L208) |
| <a id="chain"></a> `chain` | [`X402Chain`](/docs/api/defi/protocols/src/x402/sdk/types.md#x402chain) | Blockchain network | [defi/protocols/src/x402/server/verifier.ts:192](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/verifier.ts#L192) |
| <a id="noncestore"></a> `nonceStore?` | [`NonceStore`](/docs/api/defi/protocols/src/x402/server/types.md#noncestore) | Nonce store for replay protection | [defi/protocols/src/x402/server/verifier.ts:198](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/verifier.ts#L198) |
| <a id="noncettlseconds"></a> `nonceTtlSeconds?` | `number` | Default nonce TTL in seconds | [defi/protocols/src/x402/server/verifier.ts:200](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/verifier.ts#L200) |
| <a id="publicclient"></a> `publicClient?` | \{ \} | Public client (optional, created if not provided) | [defi/protocols/src/x402/server/verifier.ts:196](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/verifier.ts#L196) |
| <a id="requiredconfirmations"></a> `requiredConfirmations?` | `number` | Required confirmations for on-chain verification | [defi/protocols/src/x402/server/verifier.ts:202](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/verifier.ts#L202) |
| <a id="rpcurl"></a> `rpcUrl?` | `string` | Custom RPC URL | [defi/protocols/src/x402/server/verifier.ts:194](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/verifier.ts#L194) |

## Functions

### createMultiChainVerifier()

```ts
function createMultiChainVerifier(chains: X402Chain[], options: Omit<VerifierConfig, "chain">): Map<X402Chain, X402PaymentVerifier>;
```

Defined in: [defi/protocols/src/x402/server/verifier.ts:630](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/verifier.ts#L630)

Create verifiers for multiple chains

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `chains` | [`X402Chain`](/docs/api/defi/protocols/src/x402/sdk/types.md#x402chain)[] |
| `options` | `Omit`\<[`VerifierConfig`](/docs/api/defi/protocols/src/x402/server/verifier.md#verifierconfig), `"chain"`\> |

#### Returns

`Map`\<[`X402Chain`](/docs/api/defi/protocols/src/x402/sdk/types.md#x402chain), [`X402PaymentVerifier`](/docs/api/defi/protocols/src/x402/server/verifier.md#x402paymentverifier)\>

***

### createVerifier()

```ts
function createVerifier(chain: X402Chain, options: Omit<VerifierConfig, "chain">): X402PaymentVerifier;
```

Defined in: [defi/protocols/src/x402/server/verifier.ts:620](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/verifier.ts#L620)

Create verifier for a specific chain

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `chain` | [`X402Chain`](/docs/api/defi/protocols/src/x402/sdk/types.md#x402chain) |
| `options` | `Omit`\<[`VerifierConfig`](/docs/api/defi/protocols/src/x402/server/verifier.md#verifierconfig), `"chain"`\> |

#### Returns

[`X402PaymentVerifier`](/docs/api/defi/protocols/src/x402/server/verifier.md#x402paymentverifier)

***

### createVerifierWithSharedStore()

```ts
function createVerifierWithSharedStore(
   chain: X402Chain, 
   nonceStore: NonceStore, 
   options: Omit<VerifierConfig, "chain" | "nonceStore">): X402PaymentVerifier;
```

Defined in: [defi/protocols/src/x402/server/verifier.ts:647](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/verifier.ts#L647)

Create verifier with shared nonce store
Useful for multi-instance deployments

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `chain` | [`X402Chain`](/docs/api/defi/protocols/src/x402/sdk/types.md#x402chain) |
| `nonceStore` | [`NonceStore`](/docs/api/defi/protocols/src/x402/server/types.md#noncestore) |
| `options` | `Omit`\<[`VerifierConfig`](/docs/api/defi/protocols/src/x402/server/verifier.md#verifierconfig), `"chain"` \| `"nonceStore"`\> |

#### Returns

[`X402PaymentVerifier`](/docs/api/defi/protocols/src/x402/server/verifier.md#x402paymentverifier)
