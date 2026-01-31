[**Universal Crypto MCP API Reference v1.0.0**](../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/x402/verify

# defi/protocols/src/x402/verify

## Interfaces

### BatchVerificationResult

Defined in: [defi/protocols/src/x402/verify.ts:549](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verify.ts#L549)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="results"></a> `results` | [`PaymentVerification`](/docs/api/defi/protocols/src/x402/verify.md#paymentverification)[] | [defi/protocols/src/x402/verify.ts:550](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verify.ts#L550) |
| <a id="totalamount"></a> `totalAmount` | `string` | [defi/protocols/src/x402/verify.ts:553](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verify.ts#L553) |
| <a id="totalinvalid"></a> `totalInvalid` | `number` | [defi/protocols/src/x402/verify.ts:552](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verify.ts#L552) |
| <a id="totalvalid"></a> `totalValid` | `number` | [defi/protocols/src/x402/verify.ts:551](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verify.ts#L551) |

***

### PaymentVerification

Defined in: [defi/protocols/src/x402/verify.ts:43](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verify.ts#L43)

#### Extends

- [`USDCTransferVerification`](/docs/api/defi/protocols/src/x402/verify.md#usdctransferverification)

#### Properties

| Property | Type | Inherited from | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="actualamount"></a> `actualAmount` | `string` | [`USDCTransferVerification`](/docs/api/defi/protocols/src/x402/verify.md#usdctransferverification).[`actualAmount`](/docs/api/defi/protocols/src/x402/verify.md#actualamount-1) | [defi/protocols/src/x402/verify.ts:33](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verify.ts#L33) |
| <a id="actualamountraw"></a> `actualAmountRaw` | `bigint` | [`USDCTransferVerification`](/docs/api/defi/protocols/src/x402/verify.md#usdctransferverification).[`actualAmountRaw`](/docs/api/defi/protocols/src/x402/verify.md#actualamountraw-1) | [defi/protocols/src/x402/verify.ts:34](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verify.ts#L34) |
| <a id="blocknumber"></a> `blockNumber` | `bigint` | [`USDCTransferVerification`](/docs/api/defi/protocols/src/x402/verify.md#usdctransferverification).[`blockNumber`](/docs/api/defi/protocols/src/x402/verify.md#blocknumber-1) | [defi/protocols/src/x402/verify.ts:37](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verify.ts#L37) |
| <a id="cached"></a> `cached` | `boolean` | - | [defi/protocols/src/x402/verify.ts:46](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verify.ts#L46) |
| <a id="chainid"></a> `chainId` | `number` | [`USDCTransferVerification`](/docs/api/defi/protocols/src/x402/verify.md#usdctransferverification).[`chainId`](/docs/api/defi/protocols/src/x402/verify.md#chainid-1) | [defi/protocols/src/x402/verify.ts:39](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verify.ts#L39) |
| <a id="error"></a> `error?` | `string` | [`USDCTransferVerification`](/docs/api/defi/protocols/src/x402/verify.md#usdctransferverification).[`error`](/docs/api/defi/protocols/src/x402/verify.md#error-1) | [defi/protocols/src/x402/verify.ts:40](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verify.ts#L40) |
| <a id="expectedamount"></a> `expectedAmount` | `string` | - | [defi/protocols/src/x402/verify.ts:45](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verify.ts#L45) |
| <a id="recipient"></a> `recipient` | `` `0x${string}` `` | [`USDCTransferVerification`](/docs/api/defi/protocols/src/x402/verify.md#usdctransferverification).[`recipient`](/docs/api/defi/protocols/src/x402/verify.md#recipient-1) | [defi/protocols/src/x402/verify.ts:36](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verify.ts#L36) |
| <a id="sender"></a> `sender` | `` `0x${string}` `` | [`USDCTransferVerification`](/docs/api/defi/protocols/src/x402/verify.md#usdctransferverification).[`sender`](/docs/api/defi/protocols/src/x402/verify.md#sender-1) | [defi/protocols/src/x402/verify.ts:35](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verify.ts#L35) |
| <a id="toolname"></a> `toolName` | `string` | - | [defi/protocols/src/x402/verify.ts:44](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verify.ts#L44) |
| <a id="transactionhash"></a> `transactionHash` | `` `0x${string}` `` | [`USDCTransferVerification`](/docs/api/defi/protocols/src/x402/verify.md#usdctransferverification).[`transactionHash`](/docs/api/defi/protocols/src/x402/verify.md#transactionhash-1) | [defi/protocols/src/x402/verify.ts:38](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verify.ts#L38) |
| <a id="valid"></a> `valid` | `boolean` | [`USDCTransferVerification`](/docs/api/defi/protocols/src/x402/verify.md#usdctransferverification).[`valid`](/docs/api/defi/protocols/src/x402/verify.md#valid-1) | [defi/protocols/src/x402/verify.ts:32](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verify.ts#L32) |

***

### USDCTransferVerification

Defined in: [defi/protocols/src/x402/verify.ts:31](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verify.ts#L31)

#### Extended by

- [`PaymentVerification`](/docs/api/defi/protocols/src/x402/verify.md#paymentverification)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="actualamount-1"></a> `actualAmount` | `string` | [defi/protocols/src/x402/verify.ts:33](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verify.ts#L33) |
| <a id="actualamountraw-1"></a> `actualAmountRaw` | `bigint` | [defi/protocols/src/x402/verify.ts:34](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verify.ts#L34) |
| <a id="blocknumber-1"></a> `blockNumber` | `bigint` | [defi/protocols/src/x402/verify.ts:37](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verify.ts#L37) |
| <a id="chainid-1"></a> `chainId` | `number` | [defi/protocols/src/x402/verify.ts:39](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verify.ts#L39) |
| <a id="error-1"></a> `error?` | `string` | [defi/protocols/src/x402/verify.ts:40](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verify.ts#L40) |
| <a id="recipient-1"></a> `recipient` | `` `0x${string}` `` | [defi/protocols/src/x402/verify.ts:36](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verify.ts#L36) |
| <a id="sender-1"></a> `sender` | `` `0x${string}` `` | [defi/protocols/src/x402/verify.ts:35](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verify.ts#L35) |
| <a id="transactionhash-1"></a> `transactionHash` | `` `0x${string}` `` | [defi/protocols/src/x402/verify.ts:38](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verify.ts#L38) |
| <a id="valid-1"></a> `valid` | `boolean` | [defi/protocols/src/x402/verify.ts:32](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verify.ts#L32) |

## Type Aliases

### SupportedChainId

```ts
type SupportedChainId = 1 | 8453 | 42161;
```

Defined in: [defi/protocols/src/x402/verify.ts:49](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verify.ts#L49)

## Variables

### default

```ts
default: {
  getCacheStats: () => {
     count: number;
     expiryHours: number;
     maxSize: number;
  };
  getChainName: (chainId: SupportedChainId) => string;
  getSupportedChains: () => {
     chainId: SupportedChainId;
     name: string;
     usdcAddress: `0x${string}`;
  }[];
  getUSDCAddress: (chainId: SupportedChainId) => `0x${string}`;
  getVerifiedPayment: (txHash: `0x${string}`, chainId: SupportedChainId) => VerifiedPayment | undefined;
  isPaymentUsed: (txHash: `0x${string}`, chainId: SupportedChainId) => boolean;
  isSupportedChain: (chainId: number) => chainId is SupportedChainId;
  USDC_ADDRESSES: Record<SupportedChainId, `0x${string}`>;
  USDC_DECIMALS: number;
  verifyBatchPayments: (payments: {
     chainId: SupportedChainId;
     toolName: string;
     txHash: `0x${string}`;
  }[], recipient?: `0x${string}`) => Promise<BatchVerificationResult>;
  verifyPaymentForTool: (toolName: string, txHash: `0x${string}`, chainId: SupportedChainId, recipient?: `0x${string}`) => Promise<PaymentVerification>;
  verifyUSDCTransfer: (txHash: `0x${string}`, expectedAmount: string, expectedRecipient: `0x${string}`, chainId: SupportedChainId) => Promise<USDCTransferVerification>;
};
```

Defined in: [defi/protocols/src/x402/verify.ts:636](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verify.ts#L636)

#### Type Declaration

| Name | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="getcachestats-3"></a> `getCacheStats()` | () => \{ `count`: `number`; `expiryHours`: `number`; `maxSize`: `number`; \} | Get cache statistics | [defi/protocols/src/x402/verify.ts:642](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verify.ts#L642) |
| <a id="getchainname-3"></a> `getChainName()` | (`chainId`: [`SupportedChainId`](/docs/api/defi/protocols/src/x402/verify.md#supportedchainid)) => `string` | Get chain name from chain ID | [defi/protocols/src/x402/verify.ts:645](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verify.ts#L645) |
| <a id="getsupportedchains-3"></a> `getSupportedChains()` | () => \{ `chainId`: [`SupportedChainId`](/docs/api/defi/protocols/src/x402/verify.md#supportedchainid); `name`: `string`; `usdcAddress`: `` `0x${string}` ``; \}[] | List all supported chains | [defi/protocols/src/x402/verify.ts:646](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verify.ts#L646) |
| <a id="getusdcaddress-3"></a> `getUSDCAddress()` | (`chainId`: [`SupportedChainId`](/docs/api/defi/protocols/src/x402/verify.md#supportedchainid)) => `` `0x${string}` `` | Get USDC address for a chain | [defi/protocols/src/x402/verify.ts:644](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verify.ts#L644) |
| <a id="getverifiedpayment-3"></a> `getVerifiedPayment()` | (`txHash`: `` `0x${string}` ``, `chainId`: [`SupportedChainId`](/docs/api/defi/protocols/src/x402/verify.md#supportedchainid)) => `VerifiedPayment` \| `undefined` | Get a verified payment from cache | [defi/protocols/src/x402/verify.ts:641](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verify.ts#L641) |
| <a id="ispaymentused-3"></a> `isPaymentUsed()` | (`txHash`: `` `0x${string}` ``, `chainId`: [`SupportedChainId`](/docs/api/defi/protocols/src/x402/verify.md#supportedchainid)) => `boolean` | Check if a payment has already been verified and used | [defi/protocols/src/x402/verify.ts:640](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verify.ts#L640) |
| <a id="issupportedchain-3"></a> `isSupportedChain()` | (`chainId`: `number`) => `chainId is SupportedChainId` | Check if a chain ID is supported | [defi/protocols/src/x402/verify.ts:643](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verify.ts#L643) |
| <a id="usdc_addresses"></a> `USDC_ADDRESSES` | `Record`\<[`SupportedChainId`](/docs/api/defi/protocols/src/x402/verify.md#supportedchainid), `` `0x${string}` ``\> | USDC contract addresses per supported chain | [defi/protocols/src/x402/verify.ts:647](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verify.ts#L647) |
| <a id="usdc_decimals"></a> `USDC_DECIMALS` | `number` | USDC decimals (6 for all supported chains) | [defi/protocols/src/x402/verify.ts:648](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verify.ts#L648) |
| <a id="verifybatchpayments-3"></a> `verifyBatchPayments()` | (`payments`: \{ `chainId`: [`SupportedChainId`](/docs/api/defi/protocols/src/x402/verify.md#supportedchainid); `toolName`: `string`; `txHash`: `` `0x${string}` ``; \}[], `recipient?`: `` `0x${string}` ``) => `Promise`\<[`BatchVerificationResult`](/docs/api/defi/protocols/src/x402/verify.md#batchverificationresult)\> | Verify multiple tool payments in batch | [defi/protocols/src/x402/verify.ts:639](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verify.ts#L639) |
| <a id="verifypaymentfortool-3"></a> `verifyPaymentForTool()` | (`toolName`: `string`, `txHash`: `` `0x${string}` ``, `chainId`: [`SupportedChainId`](/docs/api/defi/protocols/src/x402/verify.md#supportedchainid), `recipient?`: `` `0x${string}` ``) => `Promise`\<[`PaymentVerification`](/docs/api/defi/protocols/src/x402/verify.md#paymentverification)\> | Verify a payment for a specific tool call | [defi/protocols/src/x402/verify.ts:638](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verify.ts#L638) |
| <a id="verifyusdctransfer-3"></a> `verifyUSDCTransfer()` | (`txHash`: `` `0x${string}` ``, `expectedAmount`: `string`, `expectedRecipient`: `` `0x${string}` ``, `chainId`: [`SupportedChainId`](/docs/api/defi/protocols/src/x402/verify.md#supportedchainid)) => `Promise`\<[`USDCTransferVerification`](/docs/api/defi/protocols/src/x402/verify.md#usdctransferverification)\> | Verify a USDC transfer on-chain | [defi/protocols/src/x402/verify.ts:637](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verify.ts#L637) |

***

### USDC\_ADDRESSES

```ts
const USDC_ADDRESSES: Record<SupportedChainId, Address>;
```

Defined in: [defi/protocols/src/x402/verify.ts:58](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verify.ts#L58)

USDC contract addresses per supported chain

***

### USDC\_DECIMALS

```ts
const USDC_DECIMALS: 6 = 6;
```

Defined in: [defi/protocols/src/x402/verify.ts:67](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verify.ts#L67)

USDC decimals (6 for all supported chains)

## Functions

### getCacheStats()

```ts
function getCacheStats(): {
  count: number;
  expiryHours: number;
  maxSize: number;
};
```

Defined in: [defi/protocols/src/x402/verify.ts:194](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verify.ts#L194)

Get cache statistics

#### Returns

```ts
{
  count: number;
  expiryHours: number;
  maxSize: number;
}
```

| Name | Type | Defined in |
| :------ | :------ | :------ |
| `count` | `number` | [defi/protocols/src/x402/verify.ts:195](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verify.ts#L195) |
| `expiryHours` | `number` | [defi/protocols/src/x402/verify.ts:197](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verify.ts#L197) |
| `maxSize` | `number` | [defi/protocols/src/x402/verify.ts:196](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verify.ts#L196) |

***

### getChainName()

```ts
function getChainName(chainId: SupportedChainId): string;
```

Defined in: [defi/protocols/src/x402/verify.ts:613](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verify.ts#L613)

Get chain name from chain ID

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `chainId` | [`SupportedChainId`](/docs/api/defi/protocols/src/x402/verify.md#supportedchainid) |

#### Returns

`string`

***

### getSupportedChains()

```ts
function getSupportedChains(): {
  chainId: SupportedChainId;
  name: string;
  usdcAddress: `0x${string}`;
}[];
```

Defined in: [defi/protocols/src/x402/verify.ts:620](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verify.ts#L620)

List all supported chains

#### Returns

\{
  `chainId`: [`SupportedChainId`](/docs/api/defi/protocols/src/x402/verify.md#supportedchainid);
  `name`: `string`;
  `usdcAddress`: `` `0x${string}` ``;
\}[]

***

### getUSDCAddress()

```ts
function getUSDCAddress(chainId: SupportedChainId): `0x${string}`;
```

Defined in: [defi/protocols/src/x402/verify.ts:606](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verify.ts#L606)

Get USDC address for a chain

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `chainId` | [`SupportedChainId`](/docs/api/defi/protocols/src/x402/verify.md#supportedchainid) |

#### Returns

`` `0x${string}` ``

***

### getVerifiedPayment()

```ts
function getVerifiedPayment(txHash: `0x${string}`, chainId: SupportedChainId): VerifiedPayment | undefined;
```

Defined in: [defi/protocols/src/x402/verify.ts:127](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verify.ts#L127)

Get a verified payment from cache

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `txHash` | `` `0x${string}` `` |
| `chainId` | [`SupportedChainId`](/docs/api/defi/protocols/src/x402/verify.md#supportedchainid) |

#### Returns

`VerifiedPayment` \| `undefined`

***

### isPaymentUsed()

```ts
function isPaymentUsed(txHash: `0x${string}`, chainId: SupportedChainId): boolean;
```

Defined in: [defi/protocols/src/x402/verify.ts:119](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verify.ts#L119)

Check if a payment has already been verified and used

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `txHash` | `` `0x${string}` `` |
| `chainId` | [`SupportedChainId`](/docs/api/defi/protocols/src/x402/verify.md#supportedchainid) |

#### Returns

`boolean`

***

### isSupportedChain()

```ts
function isSupportedChain(chainId: number): chainId is SupportedChainId;
```

Defined in: [defi/protocols/src/x402/verify.ts:599](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verify.ts#L599)

Check if a chain ID is supported

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `chainId` | `number` |

#### Returns

`chainId is SupportedChainId`

***

### verifyBatchPayments()

```ts
function verifyBatchPayments(payments: {
  chainId: SupportedChainId;
  toolName: string;
  txHash: `0x${string}`;
}[], recipient?: `0x${string}`): Promise<BatchVerificationResult>;
```

Defined in: [defi/protocols/src/x402/verify.ts:559](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verify.ts#L559)

Verify multiple tool payments in batch

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `payments` | \{ `chainId`: [`SupportedChainId`](/docs/api/defi/protocols/src/x402/verify.md#supportedchainid); `toolName`: `string`; `txHash`: `` `0x${string}` ``; \}[] |
| `recipient?` | `` `0x${string}` `` |

#### Returns

`Promise`\<[`BatchVerificationResult`](/docs/api/defi/protocols/src/x402/verify.md#batchverificationresult)\>

***

### verifyPaymentForTool()

```ts
function verifyPaymentForTool(
   toolName: string, 
   txHash: `0x${string}`, 
   chainId: SupportedChainId, 
recipient?: `0x${string}`): Promise<PaymentVerification>;
```

Defined in: [defi/protocols/src/x402/verify.ts:416](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verify.ts#L416)

Verify a payment for a specific tool call

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `toolName` | `string` | Name of the tool being called |
| `txHash` | `` `0x${string}` `` | Transaction hash of the payment |
| `chainId` | [`SupportedChainId`](/docs/api/defi/protocols/src/x402/verify.md#supportedchainid) | Chain ID where payment was made |
| `recipient?` | `` `0x${string}` `` | Optional recipient address (defaults to FEE_RECIPIENT) |

#### Returns

`Promise`\<[`PaymentVerification`](/docs/api/defi/protocols/src/x402/verify.md#paymentverification)\>

Payment verification result

***

### verifyUSDCTransfer()

```ts
function verifyUSDCTransfer(
   txHash: `0x${string}`, 
   expectedAmount: string, 
   expectedRecipient: `0x${string}`, 
chainId: SupportedChainId): Promise<USDCTransferVerification>;
```

Defined in: [defi/protocols/src/x402/verify.ts:246](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/verify.ts#L246)

Verify a USDC transfer on-chain

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `txHash` | `` `0x${string}` `` | Transaction hash to verify |
| `expectedAmount` | `string` | Expected amount in USD (e.g., "0.01" for 1 cent) |
| `expectedRecipient` | `` `0x${string}` `` | Expected recipient address |
| `chainId` | [`SupportedChainId`](/docs/api/defi/protocols/src/x402/verify.md#supportedchainid) | Chain ID (1 = Ethereum, 8453 = Base, 42161 = Arbitrum) |

#### Returns

`Promise`\<[`USDCTransferVerification`](/docs/api/defi/protocols/src/x402/verify.md#usdctransferverification)\>

Verification result with transaction details
