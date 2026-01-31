[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/x402/sdk/http/middleware

# defi/protocols/src/x402/sdk/http/middleware

## Interfaces

### PaymentGateConfig

Defined in: [defi/protocols/src/x402/sdk/http/middleware.ts:62](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/http/middleware.ts#L62)

Payment gate configuration

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="amount"></a> `amount` | `string` | Payment amount required | [defi/protocols/src/x402/sdk/http/middleware.ts:64](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/http/middleware.ts#L64) |
| <a id="chain"></a> `chain` | [`X402Chain`](/docs/api/defi/protocols/src/x402/sdk/types.md#x402chain) | Payment chain | [defi/protocols/src/x402/sdk/http/middleware.ts:70](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/http/middleware.ts#L70) |
| <a id="recipient"></a> `recipient` | `` `0x${string}` `` | Recipient address | [defi/protocols/src/x402/sdk/http/middleware.ts:73](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/http/middleware.ts#L73) |
| <a id="resource"></a> `resource?` | `string` | Resource name (for identification) | [defi/protocols/src/x402/sdk/http/middleware.ts:76](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/http/middleware.ts#L76) |
| <a id="token"></a> `token` | [`X402Token`](/docs/api/defi/protocols/src/x402/sdk/types.md#x402token) | Payment token | [defi/protocols/src/x402/sdk/http/middleware.ts:67](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/http/middleware.ts#L67) |
| <a id="validityperiod"></a> `validityPeriod?` | `number` | Payment validity period in seconds | [defi/protocols/src/x402/sdk/http/middleware.ts:79](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/http/middleware.ts#L79) |
| <a id="verifypayment"></a> `verifyPayment?` | (`txHash`: `string`, `request`: [`PaymentRequest`](/docs/api/defi/protocols/src/x402/sdk/types.md#paymentrequest-1)) => `Promise`\<`boolean`\> | Custom verification function | [defi/protocols/src/x402/sdk/http/middleware.ts:82](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/http/middleware.ts#L82) |

***

### PaymentVerificationOptions

Defined in: [defi/protocols/src/x402/sdk/http/middleware.ts:42](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/http/middleware.ts#L42)

Payment verification options

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="chain-1"></a> `chain` | [`X402Chain`](/docs/api/defi/protocols/src/x402/sdk/types.md#x402chain) | Expected payment chain | [defi/protocols/src/x402/sdk/http/middleware.ts:50](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/http/middleware.ts#L50) |
| <a id="publicclient"></a> `publicClient?` | \{ \} | Public client for verification (optional, created if not provided) | [defi/protocols/src/x402/sdk/http/middleware.ts:56](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/http/middleware.ts#L56) |
| <a id="recipient-1"></a> `recipient` | `` `0x${string}` `` | Recipient address that should receive payments | [defi/protocols/src/x402/sdk/http/middleware.ts:44](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/http/middleware.ts#L44) |
| <a id="rpcurl"></a> `rpcUrl?` | `string` | Custom RPC URL | [defi/protocols/src/x402/sdk/http/middleware.ts:53](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/http/middleware.ts#L53) |
| <a id="token-1"></a> `token` | [`X402Token`](/docs/api/defi/protocols/src/x402/sdk/types.md#x402token) | Expected payment token | [defi/protocols/src/x402/sdk/http/middleware.ts:47](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/http/middleware.ts#L47) |

## Functions

### create402Error()

```ts
function create402Error(message: string, paymentRequest: PaymentRequest): X402Error;
```

Defined in: [defi/protocols/src/x402/sdk/http/middleware.ts:249](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/http/middleware.ts#L249)

Create 402 error response

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `message` | `string` |
| `paymentRequest` | [`PaymentRequest`](/docs/api/defi/protocols/src/x402/sdk/types.md#paymentrequest-1) |

#### Returns

[`X402Error`](/docs/api/defi/protocols/src/x402/sdk/types.md#x402error)

***

### createDynamicPaymentGate()

```ts
function createDynamicPaymentGate(getConfig: (req: ExpressRequest) => 
  | PaymentGateConfig
| Promise<PaymentGateConfig>): (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => Promise<void>;
```

Defined in: [defi/protocols/src/x402/sdk/http/middleware.ts:170](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/http/middleware.ts#L170)

Create middleware factory for dynamic pricing

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `getConfig` | (`req`: `ExpressRequest`) => \| [`PaymentGateConfig`](/docs/api/defi/protocols/src/x402/sdk/http/middleware.md#paymentgateconfig) \| `Promise`\<[`PaymentGateConfig`](/docs/api/defi/protocols/src/x402/sdk/http/middleware.md#paymentgateconfig)\> |

#### Returns

```ts
(
   req: ExpressRequest, 
   res: ExpressResponse, 
next: NextFunction): Promise<void>;
```

##### Parameters

| Parameter | Type |
| :------ | :------ |
| `req` | `ExpressRequest` |
| `res` | `ExpressResponse` |
| `next` | `NextFunction` |

##### Returns

`Promise`\<`void`\>

***

### createPaymentGate()

```ts
function createPaymentGate(config: PaymentGateConfig): (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => Promise<void>;
```

Defined in: [defi/protocols/src/x402/sdk/http/middleware.ts:89](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/http/middleware.ts#L89)

Create Express middleware for payment gate
Requires payment for protected routes

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `config` | [`PaymentGateConfig`](/docs/api/defi/protocols/src/x402/sdk/http/middleware.md#paymentgateconfig) |

#### Returns

```ts
(
   req: ExpressRequest, 
   res: ExpressResponse, 
next: NextFunction): Promise<void>;
```

##### Parameters

| Parameter | Type |
| :------ | :------ |
| `req` | `ExpressRequest` |
| `res` | `ExpressResponse` |
| `next` | `NextFunction` |

##### Returns

`Promise`\<`void`\>

***

### extractPaymentInfo()

```ts
function extractPaymentInfo(): (req: ExpressRequest & {
  payment?: {
     proof?: string;
     verified?: boolean;
  };
}, _res: ExpressResponse, next: NextFunction) => void;
```

Defined in: [defi/protocols/src/x402/sdk/http/middleware.ts:187](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/http/middleware.ts#L187)

Middleware to extract and validate payment headers

#### Returns

```ts
(
   req: ExpressRequest & {
  payment?: {
     proof?: string;
     verified?: boolean;
  };
}, 
   _res: ExpressResponse, 
   next: NextFunction): void;
```

##### Parameters

| Parameter | Type |
| :------ | :------ |
| `req` | `ExpressRequest` & \{ `payment?`: \{ `proof?`: `string`; `verified?`: `boolean`; \}; \} |
| `_res` | `ExpressResponse` |
| `next` | `NextFunction` |

##### Returns

`void`
