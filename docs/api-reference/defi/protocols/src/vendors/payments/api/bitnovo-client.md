[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/payments/api/bitnovo-client

# defi/protocols/src/vendors/payments/api/bitnovo-client

## Classes

### BitnovoApiClient

Defined in: [defi/protocols/src/vendors/payments/api/bitnovo-client.ts:151](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/api/bitnovo-client.ts#L151)

#### Constructors

##### Constructor

```ts
new BitnovoApiClient(config: Configuration): BitnovoApiClient;
```

Defined in: [defi/protocols/src/vendors/payments/api/bitnovo-client.ts:155](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/api/bitnovo-client.ts#L155)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `config` | [`Configuration`](/docs/api/defi/protocols/src/vendors/payments/types.md#configuration) |

###### Returns

[`BitnovoApiClient`](/docs/api/defi/protocols/src/vendors/payments/api/bitnovo-client.md#bitnovoapiclient)

#### Methods

##### createOnchainPayment()

```ts
createOnchainPayment(input: CreatePaymentOnchainInput): Promise<Payment>;
```

Defined in: [defi/protocols/src/vendors/payments/api/bitnovo-client.ts:314](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/api/bitnovo-client.ts#L314)

Create on-chain payment order

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `input` | [`CreatePaymentOnchainInput`](/docs/api/defi/protocols/src/vendors/payments/types.md#createpaymentonchaininput) |

###### Returns

`Promise`\<[`Payment`](/docs/api/defi/protocols/src/vendors/payments/types.md#payment)\>

##### createRedirectPayment()

```ts
createRedirectPayment(input: CreatePaymentRedirectInput): Promise<Payment>;
```

Defined in: [defi/protocols/src/vendors/payments/api/bitnovo-client.ts:397](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/api/bitnovo-client.ts#L397)

Create web redirect payment order

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `input` | [`CreatePaymentRedirectInput`](/docs/api/defi/protocols/src/vendors/payments/types.md#createpaymentredirectinput) |

###### Returns

`Promise`\<[`Payment`](/docs/api/defi/protocols/src/vendors/payments/types.md#payment)\>

##### getCurrencies()

```ts
getCurrencies(): Promise<Currency[]>;
```

Defined in: [defi/protocols/src/vendors/payments/api/bitnovo-client.ts:768](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/api/bitnovo-client.ts#L768)

Get available currencies catalog

###### Returns

`Promise`\<[`Currency`](/docs/api/defi/protocols/src/vendors/payments/types.md#currency)[]\>

##### getPaymentDetails()

```ts
getPaymentDetails(identifier: string): Promise<Payment>;
```

Defined in: [defi/protocols/src/vendors/payments/api/bitnovo-client.ts:641](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/api/bitnovo-client.ts#L641)

Get full payment details including address and payment_uri
Uses fallback to payment status endpoint if direct details endpoint is not available

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `identifier` | `string` |

###### Returns

`Promise`\<[`Payment`](/docs/api/defi/protocols/src/vendors/payments/types.md#payment)\>

##### getPaymentStatus()

```ts
getPaymentStatus(identifier: string): Promise<PaymentStatus>;
```

Defined in: [defi/protocols/src/vendors/payments/api/bitnovo-client.ts:475](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/api/bitnovo-client.ts#L475)

Get payment status information

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `identifier` | `string` |

###### Returns

`Promise`\<[`PaymentStatus`](/docs/api/defi/protocols/src/vendors/payments/types.md#paymentstatus)\>

##### healthCheck()

```ts
healthCheck(): Promise<{
  status: string;
  timestamp: string;
}>;
```

Defined in: [defi/protocols/src/vendors/payments/api/bitnovo-client.ts:869](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/api/bitnovo-client.ts#L869)

Health check endpoint

###### Returns

`Promise`\<\{
  `status`: `string`;
  `timestamp`: `string`;
\}\>

***

### BitnovoApiError

Defined in: [defi/protocols/src/vendors/payments/api/bitnovo-client.ts:108](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/api/bitnovo-client.ts#L108)

#### Extends

- `Error`

#### Implements

- [`ApiError`](/docs/api/defi/protocols/src/vendors/payments/types.md#apierror)

#### Constructors

##### Constructor

```ts
new BitnovoApiError(
   message: string, 
   statusCode: number, 
   code: string, 
   details?: unknown): BitnovoApiError;
```

Defined in: [defi/protocols/src/vendors/payments/api/bitnovo-client.ts:113](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/api/bitnovo-client.ts#L113)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `message` | `string` |
| `statusCode` | `number` |
| `code` | `string` |
| `details?` | `unknown` |

###### Returns

[`BitnovoApiError`](/docs/api/defi/protocols/src/vendors/payments/api/bitnovo-client.md#bitnovoapierror)

###### Overrides

```ts
Error.constructor
```

#### Properties

| Property | Modifier | Type | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="code"></a> `code` | `readonly` | `string` | [defi/protocols/src/vendors/payments/api/bitnovo-client.ts:110](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/api/bitnovo-client.ts#L110) |
| <a id="details"></a> `details?` | `readonly` | `unknown` | [defi/protocols/src/vendors/payments/api/bitnovo-client.ts:111](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/api/bitnovo-client.ts#L111) |
| <a id="statuscode"></a> `statusCode` | `readonly` | `number` | [defi/protocols/src/vendors/payments/api/bitnovo-client.ts:109](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/api/bitnovo-client.ts#L109) |

#### Methods

##### fromAxiosError()

```ts
static fromAxiosError(error: AxiosError): BitnovoApiError;
```

Defined in: [defi/protocols/src/vendors/payments/api/bitnovo-client.ts:126](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/api/bitnovo-client.ts#L126)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `error` | `AxiosError` |

###### Returns

[`BitnovoApiError`](/docs/api/defi/protocols/src/vendors/payments/api/bitnovo-client.md#bitnovoapierror)

##### fromTimeout()

```ts
static fromTimeout(): BitnovoApiError;
```

Defined in: [defi/protocols/src/vendors/payments/api/bitnovo-client.ts:144](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/api/bitnovo-client.ts#L144)

###### Returns

[`BitnovoApiError`](/docs/api/defi/protocols/src/vendors/payments/api/bitnovo-client.md#bitnovoapierror)

## Interfaces

### BitnovoApiResponse

Defined in: [defi/protocols/src/vendors/payments/api/bitnovo-client.ts:45](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/api/bitnovo-client.ts#L45)

#### Type Parameters

| Type Parameter | Default type |
| :------ | :------ |
| `T` | `unknown` |

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="data"></a> `data?` | `T` | [defi/protocols/src/vendors/payments/api/bitnovo-client.ts:47](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/api/bitnovo-client.ts#L47) |
| <a id="error"></a> `error?` | `string` | [defi/protocols/src/vendors/payments/api/bitnovo-client.ts:48](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/api/bitnovo-client.ts#L48) |
| <a id="message"></a> `message?` | `string` | [defi/protocols/src/vendors/payments/api/bitnovo-client.ts:49](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/api/bitnovo-client.ts#L49) |
| <a id="status"></a> `status` | `string` | [defi/protocols/src/vendors/payments/api/bitnovo-client.ts:46](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/api/bitnovo-client.ts#L46) |

***

### BitnovoCreateOrderRequest

Defined in: [defi/protocols/src/vendors/payments/api/bitnovo-client.ts:52](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/api/bitnovo-client.ts#L52)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="expected_output_amount"></a> `expected_output_amount` | `number` | [defi/protocols/src/vendors/payments/api/bitnovo-client.ts:53](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/api/bitnovo-client.ts#L53) |
| <a id="fiat"></a> `fiat?` | `string` | [defi/protocols/src/vendors/payments/api/bitnovo-client.ts:55](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/api/bitnovo-client.ts#L55) |
| <a id="input_currency"></a> `input_currency?` | `string` | [defi/protocols/src/vendors/payments/api/bitnovo-client.ts:54](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/api/bitnovo-client.ts#L54) |
| <a id="notes"></a> `notes?` | `string` | [defi/protocols/src/vendors/payments/api/bitnovo-client.ts:56](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/api/bitnovo-client.ts#L56) |
| <a id="order_type"></a> `order_type?` | `"in"` \| `"out"` | [defi/protocols/src/vendors/payments/api/bitnovo-client.ts:60](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/api/bitnovo-client.ts#L60) |
| <a id="reference"></a> `reference?` | `string` | [defi/protocols/src/vendors/payments/api/bitnovo-client.ts:59](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/api/bitnovo-client.ts#L59) |
| <a id="url_ko"></a> `url_ko?` | `string` | [defi/protocols/src/vendors/payments/api/bitnovo-client.ts:58](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/api/bitnovo-client.ts#L58) |
| <a id="url_ok"></a> `url_ok?` | `string` | [defi/protocols/src/vendors/payments/api/bitnovo-client.ts:57](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/api/bitnovo-client.ts#L57) |

***

### BitnovoCurrencyResponse

Defined in: [defi/protocols/src/vendors/payments/api/bitnovo-client.ts:97](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/api/bitnovo-client.ts#L97)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="blockchain"></a> `blockchain` | `string` | [defi/protocols/src/vendors/payments/api/bitnovo-client.ts:103](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/api/bitnovo-client.ts#L103) |
| <a id="image"></a> `image` | `string` | [defi/protocols/src/vendors/payments/api/bitnovo-client.ts:102](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/api/bitnovo-client.ts#L102) |
| <a id="max_amount"></a> `max_amount` | `number` \| `null` | [defi/protocols/src/vendors/payments/api/bitnovo-client.ts:101](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/api/bitnovo-client.ts#L101) |
| <a id="min_amount"></a> `min_amount` | `number` | [defi/protocols/src/vendors/payments/api/bitnovo-client.ts:100](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/api/bitnovo-client.ts#L100) |
| <a id="name"></a> `name` | `string` | [defi/protocols/src/vendors/payments/api/bitnovo-client.ts:99](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/api/bitnovo-client.ts#L99) |
| <a id="original_blockchain"></a> `original_blockchain` | `string` | [defi/protocols/src/vendors/payments/api/bitnovo-client.ts:105](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/api/bitnovo-client.ts#L105) |
| <a id="original_symbol"></a> `original_symbol` | `string` | [defi/protocols/src/vendors/payments/api/bitnovo-client.ts:104](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/api/bitnovo-client.ts#L104) |
| <a id="symbol"></a> `symbol` | `string` | [defi/protocols/src/vendors/payments/api/bitnovo-client.ts:98](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/api/bitnovo-client.ts#L98) |

***

### BitnovoOrderResponse

Defined in: [defi/protocols/src/vendors/payments/api/bitnovo-client.ts:63](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/api/bitnovo-client.ts#L63)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="address"></a> `address?` | `string` | [defi/protocols/src/vendors/payments/api/bitnovo-client.ts:73](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/api/bitnovo-client.ts#L73) |
| <a id="amount"></a> `amount?` | `number` | [defi/protocols/src/vendors/payments/api/bitnovo-client.ts:70](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/api/bitnovo-client.ts#L70) |
| <a id="created_at"></a> `created_at?` | `string` | [defi/protocols/src/vendors/payments/api/bitnovo-client.ts:66](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/api/bitnovo-client.ts#L66) |
| <a id="expected_input_amount"></a> `expected_input_amount?` | `number` | [defi/protocols/src/vendors/payments/api/bitnovo-client.ts:81](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/api/bitnovo-client.ts#L81) |
| <a id="expired_at"></a> `expired_at?` | `string` | [defi/protocols/src/vendors/payments/api/bitnovo-client.ts:67](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/api/bitnovo-client.ts#L67) |
| <a id="fiat-1"></a> `fiat?` | `string` | [defi/protocols/src/vendors/payments/api/bitnovo-client.ts:68](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/api/bitnovo-client.ts#L68) |
| <a id="identifier"></a> `identifier` | `string` | [defi/protocols/src/vendors/payments/api/bitnovo-client.ts:64](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/api/bitnovo-client.ts#L64) |
| <a id="input_amount"></a> `input_amount?` | `number` | [defi/protocols/src/vendors/payments/api/bitnovo-client.ts:80](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/api/bitnovo-client.ts#L80) |
| <a id="input_currency-1"></a> `input_currency?` | `string` | [defi/protocols/src/vendors/payments/api/bitnovo-client.ts:72](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/api/bitnovo-client.ts#L72) |
| <a id="language"></a> `language?` | `string` | [defi/protocols/src/vendors/payments/api/bitnovo-client.ts:69](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/api/bitnovo-client.ts#L69) |
| <a id="notes-1"></a> `notes?` | `string` | [defi/protocols/src/vendors/payments/api/bitnovo-client.ts:83](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/api/bitnovo-client.ts#L83) |
| <a id="payment_uri"></a> `payment_uri?` | `string` | [defi/protocols/src/vendors/payments/api/bitnovo-client.ts:79](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/api/bitnovo-client.ts#L79) |
| <a id="rate"></a> `rate?` | `number` | [defi/protocols/src/vendors/payments/api/bitnovo-client.ts:82](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/api/bitnovo-client.ts#L82) |
| <a id="reference-1"></a> `reference?` | `string` | [defi/protocols/src/vendors/payments/api/bitnovo-client.ts:65](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/api/bitnovo-client.ts#L65) |
| <a id="status-1"></a> `status?` | `string` | [defi/protocols/src/vendors/payments/api/bitnovo-client.ts:71](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/api/bitnovo-client.ts#L71) |
| <a id="tag_memo"></a> `tag_memo?` | `string` | [defi/protocols/src/vendors/payments/api/bitnovo-client.ts:74](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/api/bitnovo-client.ts#L74) |
| <a id="url_ko-1"></a> `url_ko?` | `string` | [defi/protocols/src/vendors/payments/api/bitnovo-client.ts:76](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/api/bitnovo-client.ts#L76) |
| <a id="url_ok-1"></a> `url_ok?` | `string` | [defi/protocols/src/vendors/payments/api/bitnovo-client.ts:77](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/api/bitnovo-client.ts#L77) |
| <a id="url_standby"></a> `url_standby?` | `string` | [defi/protocols/src/vendors/payments/api/bitnovo-client.ts:75](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/api/bitnovo-client.ts#L75) |
| <a id="web_url"></a> `web_url?` | `string` | [defi/protocols/src/vendors/payments/api/bitnovo-client.ts:78](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/api/bitnovo-client.ts#L78) |

***

### UniversalCryptomentInfoResponse

Defined in: [defi/protocols/src/vendors/payments/api/bitnovo-client.ts:86](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/api/bitnovo-client.ts#L86)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="confirmed_amount"></a> `confirmed_amount?` | `number` | [defi/protocols/src/vendors/payments/api/bitnovo-client.ts:90](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/api/bitnovo-client.ts#L90) |
| <a id="crypto_amount"></a> `crypto_amount?` | `number` | [defi/protocols/src/vendors/payments/api/bitnovo-client.ts:89](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/api/bitnovo-client.ts#L89) |
| <a id="exchange_rate"></a> `exchange_rate?` | `number` | [defi/protocols/src/vendors/payments/api/bitnovo-client.ts:92](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/api/bitnovo-client.ts#L92) |
| <a id="expired_time"></a> `expired_time?` | `string` | [defi/protocols/src/vendors/payments/api/bitnovo-client.ts:94](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/api/bitnovo-client.ts#L94) |
| <a id="identifier-1"></a> `identifier` | `string` | [defi/protocols/src/vendors/payments/api/bitnovo-client.ts:87](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/api/bitnovo-client.ts#L87) |
| <a id="network_fee"></a> `network_fee?` | `number` | [defi/protocols/src/vendors/payments/api/bitnovo-client.ts:93](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/api/bitnovo-client.ts#L93) |
| <a id="status-2"></a> `status` | `string` | [defi/protocols/src/vendors/payments/api/bitnovo-client.ts:88](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/api/bitnovo-client.ts#L88) |
| <a id="unconfirmed_amount"></a> `unconfirmed_amount?` | `number` | [defi/protocols/src/vendors/payments/api/bitnovo-client.ts:91](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/api/bitnovo-client.ts#L91) |

## Functions

### createBitnovoApiClient()

```ts
function createBitnovoApiClient(config: Configuration): BitnovoApiClient;
```

Defined in: [defi/protocols/src/vendors/payments/api/bitnovo-client.ts:890](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/api/bitnovo-client.ts#L890)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `config` | [`Configuration`](/docs/api/defi/protocols/src/vendors/payments/types.md#configuration) |

#### Returns

[`BitnovoApiClient`](/docs/api/defi/protocols/src/vendors/payments/api/bitnovo-client.md#bitnovoapiclient)
