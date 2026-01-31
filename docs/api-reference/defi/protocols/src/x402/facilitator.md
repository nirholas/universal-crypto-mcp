[**Universal Crypto MCP API Reference v1.0.0**](../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/x402/facilitator

# defi/protocols/src/x402/facilitator

## Classes

### FacilitatorClient

Defined in: [defi/protocols/src/x402/facilitator.ts:165](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/facilitator.ts#L165)

x402 Payment Facilitator Client

Connects to a payment facilitator (Coinbase's or self-hosted) to:
- Submit gasless payments using EIP-3009 signatures
- Query payment status and history
- Verify payment settlement

#### Example

```typescript
const client = new FacilitatorClient({
  baseUrl: 'https://x402.org/facilitator',
});

// Submit a payment
const result = await client.submitPayment({
  chainId: 'eip155:8453',
  amount: '1.00',
  token: 'USDC',
  tokenAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  recipient: '0x...',
  sender: '0x...',
  reference: 'payment-123',
  deadline: Date.now() + 3600000,
  signature: '0x...',
});

// Check payment status
const status = await client.getPaymentStatus({ paymentId: result.paymentId });
```

#### Constructors

##### Constructor

```ts
new FacilitatorClient(config: FacilitatorClientConfig): FacilitatorClient;
```

Defined in: [defi/protocols/src/x402/facilitator.ts:171](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/facilitator.ts#L171)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `config` | [`FacilitatorClientConfig`](/docs/api/defi/protocols/src/x402/facilitator.md#facilitatorclientconfig) |

###### Returns

[`FacilitatorClient`](/docs/api/defi/protocols/src/x402/facilitator.md#facilitatorclient)

#### Methods

##### getPaymentStatus()

```ts
getPaymentStatus(query: PaymentQuery): Promise<FacilitatorPaymentResult>;
```

Defined in: [defi/protocols/src/x402/facilitator.ts:285](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/facilitator.ts#L285)

Get the status of a payment

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `query` | [`PaymentQuery`](/docs/api/defi/protocols/src/x402/facilitator.md#paymentquery) | Query parameters (paymentId, transactionHash, or reference) |

###### Returns

`Promise`\<[`FacilitatorPaymentResult`](/docs/api/defi/protocols/src/x402/facilitator.md#facilitatorpaymentresult)\>

Current payment status

##### getSupportedChains()

```ts
getSupportedChains(): Promise<string[]>;
```

Defined in: [defi/protocols/src/x402/facilitator.ts:344](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/facilitator.ts#L344)

Get supported chains from the facilitator

###### Returns

`Promise`\<`string`[]\>

##### healthCheck()

```ts
healthCheck(): Promise<FacilitatorHealth>;
```

Defined in: [defi/protocols/src/x402/facilitator.ts:259](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/facilitator.ts#L259)

Check if the facilitator is healthy and available

###### Returns

`Promise`\<[`FacilitatorHealth`](/docs/api/defi/protocols/src/x402/facilitator.md#facilitatorhealth)\>

##### submitPayment()

```ts
submitPayment(payload: PaymentPayload): Promise<FacilitatorPaymentResult>;
```

Defined in: [defi/protocols/src/x402/facilitator.ts:269](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/facilitator.ts#L269)

Submit a payment to the facilitator

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `payload` | [`PaymentPayload`](/docs/api/defi/protocols/src/x402/facilitator.md#paymentpayload) | Payment details including signature for gasless payments |

###### Returns

`Promise`\<[`FacilitatorPaymentResult`](/docs/api/defi/protocols/src/x402/facilitator.md#facilitatorpaymentresult)\>

Payment result with transaction hash and status

##### verifyPayment()

```ts
verifyPayment(query: PaymentQuery): Promise<boolean>;
```

Defined in: [defi/protocols/src/x402/facilitator.ts:355](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/facilitator.ts#L355)

Verify a payment was successful

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `query` | [`PaymentQuery`](/docs/api/defi/protocols/src/x402/facilitator.md#paymentquery) | Query parameters |

###### Returns

`Promise`\<`boolean`\>

True if payment is confirmed/settled

##### waitForSettlement()

```ts
waitForSettlement(query: PaymentQuery, options: {
  pollInterval?: number;
  timeout?: number;
}): Promise<FacilitatorPaymentResult>;
```

Defined in: [defi/protocols/src/x402/facilitator.ts:312](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/facilitator.ts#L312)

Wait for a payment to reach a terminal status

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `query` | [`PaymentQuery`](/docs/api/defi/protocols/src/x402/facilitator.md#paymentquery) | Query parameters |
| `options` | \{ `pollInterval?`: `number`; `timeout?`: `number`; \} | Polling options |
| `options.pollInterval?` | `number` | Polling interval in milliseconds |
| `options.timeout?` | `number` | Maximum time to wait in milliseconds |

###### Returns

`Promise`\<[`FacilitatorPaymentResult`](/docs/api/defi/protocols/src/x402/facilitator.md#facilitatorpaymentresult)\>

Final payment status

***

### FacilitatorError

Defined in: [defi/protocols/src/x402/facilitator.ts:372](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/facilitator.ts#L372)

Error from facilitator API

#### Extends

- `Error`

#### Constructors

##### Constructor

```ts
new FacilitatorError(
   message: string, 
   statusCode: number, 
   data?: unknown): FacilitatorError;
```

Defined in: [defi/protocols/src/x402/facilitator.ts:378](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/facilitator.ts#L378)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `message` | `string` |
| `statusCode` | `number` |
| `data?` | `unknown` |

###### Returns

[`FacilitatorError`](/docs/api/defi/protocols/src/x402/facilitator.md#facilitatorerror)

###### Overrides

```ts
Error.constructor
```

#### Properties

| Property | Modifier | Type | Description | Defined in |
| :------ | :------ | :------ | :------ | :------ |
| <a id="data"></a> `data?` | `readonly` | `unknown` | Additional error data | [defi/protocols/src/x402/facilitator.ts:376](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/facilitator.ts#L376) |
| <a id="statuscode"></a> `statusCode` | `readonly` | `number` | HTTP status code | [defi/protocols/src/x402/facilitator.ts:374](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/facilitator.ts#L374) |

## Interfaces

### FacilitatorClientConfig

Defined in: [defi/protocols/src/x402/facilitator.ts:109](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/facilitator.ts#L109)

Facilitator client configuration

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="apikey"></a> `apiKey?` | `string` | API key for authentication (optional) | [defi/protocols/src/x402/facilitator.ts:113](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/facilitator.ts#L113) |
| <a id="baseurl"></a> `baseUrl` | `string` | Base URL of the facilitator service | [defi/protocols/src/x402/facilitator.ts:111](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/facilitator.ts#L111) |
| <a id="debug"></a> `debug?` | `boolean` | Enable debug logging | [defi/protocols/src/x402/facilitator.ts:117](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/facilitator.ts#L117) |
| <a id="timeout"></a> `timeout?` | `number` | Request timeout in milliseconds | [defi/protocols/src/x402/facilitator.ts:115](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/facilitator.ts#L115) |

***

### FacilitatorHealth

Defined in: [defi/protocols/src/x402/facilitator.ts:93](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/facilitator.ts#L93)

Facilitator health check response

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="blocknumbers"></a> `blockNumbers?` | `Record`\<`string`, `number`\> | Current block numbers per chain | [defi/protocols/src/x402/facilitator.ts:103](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/facilitator.ts#L103) |
| <a id="healthy"></a> `healthy` | `boolean` | Whether facilitator is healthy | [defi/protocols/src/x402/facilitator.ts:95](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/facilitator.ts#L95) |
| <a id="supportedchains"></a> `supportedChains` | `string`[] | Supported chains | [defi/protocols/src/x402/facilitator.ts:99](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/facilitator.ts#L99) |
| <a id="supportedtokens"></a> `supportedTokens` | `string`[] | Supported tokens | [defi/protocols/src/x402/facilitator.ts:101](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/facilitator.ts#L101) |
| <a id="version"></a> `version` | `string` | Facilitator version | [defi/protocols/src/x402/facilitator.ts:97](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/facilitator.ts#L97) |

***

### FacilitatorPaymentResult

Defined in: [defi/protocols/src/x402/facilitator.ts:57](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/facilitator.ts#L57)

Payment result from facilitator

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="amount"></a> `amount` | `string` | Amount paid | [defi/protocols/src/x402/facilitator.ts:71](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/facilitator.ts#L71) |
| <a id="blocknumber"></a> `blockNumber?` | `number` | Block number (if confirmed) | [defi/protocols/src/x402/facilitator.ts:65](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/facilitator.ts#L65) |
| <a id="chainid"></a> `chainId` | `string` | Chain the payment was made on | [defi/protocols/src/x402/facilitator.ts:69](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/facilitator.ts#L69) |
| <a id="error"></a> `error?` | `string` | Error message (if failed) | [defi/protocols/src/x402/facilitator.ts:73](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/facilitator.ts#L73) |
| <a id="explorerurl"></a> `explorerUrl?` | `string` | Explorer URL for transaction | [defi/protocols/src/x402/facilitator.ts:75](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/facilitator.ts#L75) |
| <a id="paymentid"></a> `paymentId` | `string` | Unique payment ID from facilitator | [defi/protocols/src/x402/facilitator.ts:59](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/facilitator.ts#L59) |
| <a id="status"></a> `status` | [`PaymentStatus`](/docs/api/defi/protocols/src/x402/facilitator.md#paymentstatus) | Payment status | [defi/protocols/src/x402/facilitator.ts:63](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/facilitator.ts#L63) |
| <a id="timestamp"></a> `timestamp` | `number` | Timestamp of status update | [defi/protocols/src/x402/facilitator.ts:67](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/facilitator.ts#L67) |
| <a id="transactionhash"></a> `transactionHash?` | `` `0x${string}` `` | Transaction hash (if on-chain) | [defi/protocols/src/x402/facilitator.ts:61](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/facilitator.ts#L61) |

***

### PaymentPayload

Defined in: [defi/protocols/src/x402/facilitator.ts:20](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/facilitator.ts#L20)

Payment payload for facilitator

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="amount-1"></a> `amount` | `string` | Payment amount in human-readable format | [defi/protocols/src/x402/facilitator.ts:24](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/facilitator.ts#L24) |
| <a id="chainid-1"></a> `chainId` | `string` | CAIP-2 chain identifier | [defi/protocols/src/x402/facilitator.ts:22](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/facilitator.ts#L22) |
| <a id="deadline"></a> `deadline` | `number` | Unix timestamp deadline for payment validity | [defi/protocols/src/x402/facilitator.ts:36](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/facilitator.ts#L36) |
| <a id="recipient"></a> `recipient` | `string` | Recipient address | [defi/protocols/src/x402/facilitator.ts:30](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/facilitator.ts#L30) |
| <a id="reference"></a> `reference` | `string` | Payment reference/nonce (for idempotency) | [defi/protocols/src/x402/facilitator.ts:34](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/facilitator.ts#L34) |
| <a id="resource"></a> `resource?` | `string` | Resource being paid for | [defi/protocols/src/x402/facilitator.ts:40](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/facilitator.ts#L40) |
| <a id="sender"></a> `sender` | `string` | Sender address | [defi/protocols/src/x402/facilitator.ts:32](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/facilitator.ts#L32) |
| <a id="signature"></a> `signature?` | `string` | EIP-712 typed data signature (for gasless payments) | [defi/protocols/src/x402/facilitator.ts:38](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/facilitator.ts#L38) |
| <a id="token"></a> `token` | `string` | Payment token symbol | [defi/protocols/src/x402/facilitator.ts:26](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/facilitator.ts#L26) |
| <a id="tokenaddress"></a> `tokenAddress` | `string` | Token contract address | [defi/protocols/src/x402/facilitator.ts:28](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/facilitator.ts#L28) |

***

### PaymentQuery

Defined in: [defi/protocols/src/x402/facilitator.ts:81](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/facilitator.ts#L81)

Payment query parameters

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="paymentid-1"></a> `paymentId?` | `string` | Payment ID from facilitator | [defi/protocols/src/x402/facilitator.ts:83](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/facilitator.ts#L83) |
| <a id="reference-1"></a> `reference?` | `string` | Payment reference | [defi/protocols/src/x402/facilitator.ts:87](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/facilitator.ts#L87) |
| <a id="transactionhash-1"></a> `transactionHash?` | `` `0x${string}` `` | Transaction hash | [defi/protocols/src/x402/facilitator.ts:85](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/facilitator.ts#L85) |

## Type Aliases

### PaymentStatus

```ts
type PaymentStatus = "pending" | "processing" | "confirmed" | "settled" | "failed" | "expired";
```

Defined in: [defi/protocols/src/x402/facilitator.ts:46](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/facilitator.ts#L46)

Payment status from facilitator

## Variables

### DEFAULT\_FACILITATOR\_URL

```ts
const DEFAULT_FACILITATOR_URL: "https://x402.org/facilitator" = 'https://x402.org/facilitator';
```

Defined in: [defi/protocols/src/x402/facilitator.ts:125](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/facilitator.ts#L125)

Default Coinbase facilitator URL

***

### DEFAULT\_TIMEOUT

```ts
const DEFAULT_TIMEOUT: 30000 = 30000;
```

Defined in: [defi/protocols/src/x402/facilitator.ts:128](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/facilitator.ts#L128)

Default request timeout (30 seconds)

## Functions

### calculateDeadline()

```ts
function calculateDeadline(durationMs: number): number;
```

Defined in: [defi/protocols/src/x402/facilitator.ts:447](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/facilitator.ts#L447)

Calculate payment deadline (default: 1 hour from now)

#### Parameters

| Parameter | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `durationMs` | `number` | `3600000` | Duration in milliseconds (default: 3600000 = 1 hour) |

#### Returns

`number`

Unix timestamp in seconds

***

### createFacilitatorClient()

```ts
function createFacilitatorClient(chain?: 
  | string
  | ChainConfig, options?: Partial<FacilitatorClientConfig>): FacilitatorClient;
```

Defined in: [defi/protocols/src/x402/facilitator.ts:397](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/facilitator.ts#L397)

Create a facilitator client for a specific chain

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `chain?` | \| `string` \| [`ChainConfig`](/docs/api/defi/protocols/src/x402/chains/types.md#chainconfig) | Chain config or CAIP-2 identifier |
| `options?` | `Partial`\<[`FacilitatorClientConfig`](/docs/api/defi/protocols/src/x402/facilitator.md#facilitatorclientconfig)\> | Additional client options |

#### Returns

[`FacilitatorClient`](/docs/api/defi/protocols/src/x402/facilitator.md#facilitatorclient)

Configured FacilitatorClient

***

### createFacilitatorClientFromEnv()

```ts
function createFacilitatorClientFromEnv(): FacilitatorClient;
```

Defined in: [defi/protocols/src/x402/facilitator.ts:420](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/facilitator.ts#L420)

Create a facilitator client from environment variables

#### Returns

[`FacilitatorClient`](/docs/api/defi/protocols/src/x402/facilitator.md#facilitatorclient)

***

### generatePaymentReference()

```ts
function generatePaymentReference(): string;
```

Defined in: [defi/protocols/src/x402/facilitator.ts:435](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/facilitator.ts#L435)

Generate a unique payment reference

#### Returns

`string`

***

### validatePaymentPayload()

```ts
function validatePaymentPayload(payload: PaymentPayload): {
  errors: string[];
  valid: boolean;
};
```

Defined in: [defi/protocols/src/x402/facilitator.ts:454](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/facilitator.ts#L454)

Validate a payment payload before submission

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `payload` | [`PaymentPayload`](/docs/api/defi/protocols/src/x402/facilitator.md#paymentpayload) |

#### Returns

```ts
{
  errors: string[];
  valid: boolean;
}
```

| Name | Type | Defined in |
| :------ | :------ | :------ |
| `errors` | `string`[] | [defi/protocols/src/x402/facilitator.ts:454](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/facilitator.ts#L454) |
| `valid` | `boolean` | [defi/protocols/src/x402/facilitator.ts:454](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/facilitator.ts#L454) |
