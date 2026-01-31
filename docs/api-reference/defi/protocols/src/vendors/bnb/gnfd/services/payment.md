[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/bnb/gnfd/services/payment

# defi/protocols/src/vendors/bnb/gnfd/services/payment

## Functions

### createPaymentAccount()

```ts
function createPaymentAccount(network: "testnet" | "mainnet", privateKey: `0x${string}`): Promise<ApiResponse<{
  txHash: string;
}>>;
```

Defined in: [defi/protocols/src/vendors/bnb/gnfd/services/payment.ts:32](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/bnb/gnfd/services/payment.ts#L32)

Creates a payment account for the specified address

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `network` | `"testnet"` \| `"mainnet"` | - |
| `privateKey` | `` `0x${string}` `` | The private key for signing the transaction |

#### Returns

`Promise`\<[`ApiResponse`](/docs/api/defi/protocols/src/vendors/bnb/gnfd/util.md#apiresponse)\<\{
  `txHash`: `string`;
\}\>\>

Transaction hash

***

### depositToPaymentAccount()

```ts
function depositToPaymentAccount(network: "testnet" | "mainnet", to: {
  amount: string;
  privateKey: `0x${string}`;
  to: string;
}): Promise<ApiResponse<void>>;
```

Defined in: [defi/protocols/src/vendors/bnb/gnfd/services/payment.ts:64](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/bnb/gnfd/services/payment.ts#L64)

Deposits funds into a payment account

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `network` | `"testnet"` \| `"mainnet"` | - |
| `to` | \{ `amount`: `string`; `privateKey`: `` `0x${string}` ``; `to`: `string`; \} | The payment account address to deposit to |
| `to.amount` | `string` | - |
| `to.privateKey` | `` `0x${string}` `` | - |
| `to.to` | `string` | - |

#### Returns

`Promise`\<[`ApiResponse`](/docs/api/defi/protocols/src/vendors/bnb/gnfd/util.md#apiresponse)\<`void`\>\>

Transaction hash

***

### disableRefundForPaymentAccount()

```ts
function disableRefundForPaymentAccount(network: "testnet" | "mainnet", address: {
  address: string;
  privateKey: `0x${string}`;
}): Promise<ApiResponse<void>>;
```

Defined in: [defi/protocols/src/vendors/bnb/gnfd/services/payment.ts:148](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/bnb/gnfd/services/payment.ts#L148)

Disables refund for a payment account

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `network` | `"testnet"` \| `"mainnet"` | - |
| `address` | \{ `address`: `string`; `privateKey`: `` `0x${string}` ``; \} | The payment account address to disable refund for |
| `address.address` | `string` | - |
| `address.privateKey` | `` `0x${string}` `` | - |

#### Returns

`Promise`\<[`ApiResponse`](/docs/api/defi/protocols/src/vendors/bnb/gnfd/util.md#apiresponse)\<`void`\>\>

Transaction hash

#### Warning

⚠️ CAUTION: This action is IRREVERSIBLE. Once disabled, ALL transfers to this payment account will become NON-REFUNDABLE.

***

### getPaymentAccountInfo()

```ts
function getPaymentAccountInfo(network: "testnet" | "mainnet", paymentAddress: string): Promise<
  | ApiResponse<void>
  | ApiResponse<{
  bufferBalance: any;
  frozenNetflowRate: any;
  lockBalance: any;
  netflowRate: any;
  owner: any;
  paymentAddress: string;
  refundable: any;
  settleDate: string;
  staticBalance: any;
  status: any;
  updateDate: string;
}>>;
```

Defined in: [defi/protocols/src/vendors/bnb/gnfd/services/payment.ts:186](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/bnb/gnfd/services/payment.ts#L186)

Get a payment account info in Greenfield

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `network` | `"testnet"` \| `"mainnet"` | The network to use |
| `paymentAddress` | `string` | The payment account address |

#### Returns

`Promise`\<
  \| [`ApiResponse`](/docs/api/defi/protocols/src/vendors/bnb/gnfd/util.md#apiresponse)\<`void`\>
  \| [`ApiResponse`](/docs/api/defi/protocols/src/vendors/bnb/gnfd/util.md#apiresponse)\<\{
  `bufferBalance`: `any`;
  `frozenNetflowRate`: `any`;
  `lockBalance`: `any`;
  `netflowRate`: `any`;
  `owner`: `any`;
  `paymentAddress`: `string`;
  `refundable`: `any`;
  `settleDate`: `string`;
  `staticBalance`: `any`;
  `status`: `any`;
  `updateDate`: `string`;
\}\>\>

The payment account info

***

### getPaymentAccountRelatedBuckets()

```ts
function getPaymentAccountRelatedBuckets(network: "testnet" | "mainnet", __namedParameters: {
  paymentAddress: string;
  privateKey: `0x${string}`;
}): Promise<ApiResponse<any>>;
```

Defined in: [defi/protocols/src/vendors/bnb/gnfd/services/payment.ts:298](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/bnb/gnfd/services/payment.ts#L298)

Get the related buckets for a payment account

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `network` | `"testnet"` \| `"mainnet"` |
| `__namedParameters` | \{ `paymentAddress`: `string`; `privateKey`: `` `0x${string}` ``; \} |
| `__namedParameters.paymentAddress` | `string` |
| `__namedParameters.privateKey` | `` `0x${string}` `` |

#### Returns

`Promise`\<[`ApiResponse`](/docs/api/defi/protocols/src/vendors/bnb/gnfd/util.md#apiresponse)\<`any`\>\>

***

### withdrawFromPaymentAccount()

```ts
function withdrawFromPaymentAccount(network: "testnet" | "mainnet", from: {
  amount: string;
  from: string;
  privateKey: `0x${string}`;
}): Promise<ApiResponse<void>>;
```

Defined in: [defi/protocols/src/vendors/bnb/gnfd/services/payment.ts:106](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/bnb/gnfd/services/payment.ts#L106)

Withdraws funds from a payment account

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `network` | `"testnet"` \| `"mainnet"` | - |
| `from` | \{ `amount`: `string`; `from`: `string`; `privateKey`: `` `0x${string}` ``; \} | The payment account to withdraw from |
| `from.amount` | `string` | - |
| `from.from` | `string` | - |
| `from.privateKey` | `` `0x${string}` `` | - |

#### Returns

`Promise`\<[`ApiResponse`](/docs/api/defi/protocols/src/vendors/bnb/gnfd/util.md#apiresponse)\<`void`\>\>

Transaction hash
