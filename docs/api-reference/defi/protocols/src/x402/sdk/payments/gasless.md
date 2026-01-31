[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/x402/sdk/payments/gasless

# defi/protocols/src/x402/sdk/payments/gasless

## Classes

### GaslessPayment

Defined in: [defi/protocols/src/x402/sdk/payments/gasless.ts:47](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/payments/gasless.ts#L47)

Gasless payment handler using EIP-3009 (transferWithAuthorization)

#### Constructors

##### Constructor

```ts
new GaslessPayment(
   publicClient: {
}, 
   walletClient: 
  | {
}
  | undefined, 
   chain: X402Chain, 
   privateKey?: `0x${string}`): GaslessPayment;
```

Defined in: [defi/protocols/src/x402/sdk/payments/gasless.ts:48](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/payments/gasless.ts#L48)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `publicClient` | \{ \} |
| `walletClient` | \| \{ \} \| `undefined` |
| `chain` | [`X402Chain`](/docs/api/defi/protocols/src/x402/sdk/types.md#x402chain) |
| `privateKey?` | `` `0x${string}` `` |

###### Returns

[`GaslessPayment`](/docs/api/defi/protocols/src/x402/sdk/payments/gasless.md#gaslesspayment)

#### Methods

##### createAuthorization()

```ts
createAuthorization(
   recipient: `0x${string}`, 
   amount: string, 
   token: X402Token, 
options: AuthorizationOptions): Promise<EIP3009Authorization>;
```

Defined in: [defi/protocols/src/x402/sdk/payments/gasless.ts:59](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/payments/gasless.ts#L59)

Create an EIP-3009 payment authorization
This signature can be submitted by anyone to execute the transfer

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `recipient` | `` `0x${string}` `` |
| `amount` | `string` |
| `token` | [`X402Token`](/docs/api/defi/protocols/src/x402/sdk/types.md#x402token) |
| `options` | [`AuthorizationOptions`](/docs/api/defi/protocols/src/x402/sdk/types.md#authorizationoptions) |

###### Returns

`Promise`\<[`EIP3009Authorization`](/docs/api/defi/protocols/src/x402/sdk/types.md#eip3009authorization)\>

##### executeGasless()

```ts
executeGasless(request: PaymentRequest, options: AuthorizationOptions): Promise<PaymentTransaction>;
```

Defined in: [defi/protocols/src/x402/sdk/payments/gasless.ts:215](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/payments/gasless.ts#L215)

Create and immediately settle a gasless payment

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `request` | [`PaymentRequest`](/docs/api/defi/protocols/src/x402/sdk/types.md#paymentrequest-1) |
| `options` | [`AuthorizationOptions`](/docs/api/defi/protocols/src/x402/sdk/types.md#authorizationoptions) |

###### Returns

`Promise`\<[`PaymentTransaction`](/docs/api/defi/protocols/src/x402/sdk/types.md#paymenttransaction)\>

##### isNonceUsed()

```ts
isNonceUsed(
   authorizer: `0x${string}`, 
   nonce: `0x${string}`, 
token: X402Token): Promise<boolean>;
```

Defined in: [defi/protocols/src/x402/sdk/payments/gasless.ts:232](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/payments/gasless.ts#L232)

Check if an authorization nonce has been used

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `authorizer` | `` `0x${string}` `` |
| `nonce` | `` `0x${string}` `` |
| `token` | [`X402Token`](/docs/api/defi/protocols/src/x402/sdk/types.md#x402token) |

###### Returns

`Promise`\<`boolean`\>

##### settleAuthorization()

```ts
settleAuthorization(authorization: EIP3009Authorization, token: X402Token): Promise<PaymentTransaction>;
```

Defined in: [defi/protocols/src/x402/sdk/payments/gasless.ts:135](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/payments/gasless.ts#L135)

Settle a gasless payment by submitting the authorization on-chain
This can be called by anyone (relayer, recipient, etc.)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `authorization` | [`EIP3009Authorization`](/docs/api/defi/protocols/src/x402/sdk/types.md#eip3009authorization) |
| `token` | [`X402Token`](/docs/api/defi/protocols/src/x402/sdk/types.md#x402token) |

###### Returns

`Promise`\<[`PaymentTransaction`](/docs/api/defi/protocols/src/x402/sdk/types.md#paymenttransaction)\>

##### supportsGasless()

```ts
supportsGasless(token: X402Token): boolean;
```

Defined in: [defi/protocols/src/x402/sdk/payments/gasless.ts:256](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/payments/gasless.ts#L256)

Check if a token supports EIP-3009 gasless transfers

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `token` | [`X402Token`](/docs/api/defi/protocols/src/x402/sdk/types.md#x402token) |

###### Returns

`boolean`

##### validateAuthorization()

```ts
validateAuthorization(authorization: EIP3009Authorization, token: X402Token): Promise<{
  error?: string;
  valid: boolean;
}>;
```

Defined in: [defi/protocols/src/x402/sdk/payments/gasless.ts:264](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/payments/gasless.ts#L264)

Validate an authorization without submitting it

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `authorization` | [`EIP3009Authorization`](/docs/api/defi/protocols/src/x402/sdk/types.md#eip3009authorization) |
| `token` | [`X402Token`](/docs/api/defi/protocols/src/x402/sdk/types.md#x402token) |

###### Returns

`Promise`\<\{
  `error?`: `string`;
  `valid`: `boolean`;
\}\>
