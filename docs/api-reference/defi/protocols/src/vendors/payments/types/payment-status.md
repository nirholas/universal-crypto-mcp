[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/payments/types/payment-status

# defi/protocols/src/vendors/payments/types/payment-status

## Interfaces

### PaymentStatusInfo

Defined in: [defi/protocols/src/vendors/payments/types/payment-status.ts:23](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/payment-status.ts#L23)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="actionrequired"></a> `actionRequired` | `string` | [defi/protocols/src/vendors/payments/types/payment-status.ts:28](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/payment-status.ts#L28) |
| <a id="code"></a> `code` | [`PaymentStatusCode`](/docs/api/defi/protocols/src/vendors/payments/types.md#paymentstatuscode) | [defi/protocols/src/vendors/payments/types/payment-status.ts:24](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/payment-status.ts#L24) |
| <a id="description"></a> `description` | `string` | [defi/protocols/src/vendors/payments/types/payment-status.ts:26](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/payment-status.ts#L26) |
| <a id="issuccessful"></a> `isSuccessful` | `boolean` | [defi/protocols/src/vendors/payments/types/payment-status.ts:30](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/payment-status.ts#L30) |
| <a id="isterminal"></a> `isTerminal` | `boolean` | [defi/protocols/src/vendors/payments/types/payment-status.ts:29](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/payment-status.ts#L29) |
| <a id="name"></a> `name` | `string` | [defi/protocols/src/vendors/payments/types/payment-status.ts:25](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/payment-status.ts#L25) |
| <a id="usermessage"></a> `userMessage` | `string` | [defi/protocols/src/vendors/payments/types/payment-status.ts:27](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/payment-status.ts#L27) |

## Variables

### PaymentStatus

```ts
const PaymentStatus: {
  AC: "AC";
  CA: "CA";
  CO: "CO";
  EX: "EX";
  FA: "FA";
  IA: "IA";
  NR: "NR";
  OC: "OC";
  PE: "PE";
};
```

Defined in: [defi/protocols/src/vendors/payments/types/payment-status.ts:11](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/payment-status.ts#L11)

#### Type Declaration

| Name | Type | Default value | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="ac"></a> `AC` | `"AC"` | `'AC'` | [defi/protocols/src/vendors/payments/types/payment-status.ts:14](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/payment-status.ts#L14) |
| <a id="ca"></a> `CA` | `"CA"` | `'CA'` | [defi/protocols/src/vendors/payments/types/payment-status.ts:18](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/payment-status.ts#L18) |
| <a id="co"></a> `CO` | `"CO"` | `'CO'` | [defi/protocols/src/vendors/payments/types/payment-status.ts:17](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/payment-status.ts#L17) |
| <a id="ex"></a> `EX` | `"EX"` | `'EX'` | [defi/protocols/src/vendors/payments/types/payment-status.ts:19](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/payment-status.ts#L19) |
| <a id="fa"></a> `FA` | `"FA"` | `'FA'` | [defi/protocols/src/vendors/payments/types/payment-status.ts:20](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/payment-status.ts#L20) |
| <a id="ia"></a> `IA` | `"IA"` | `'IA'` | [defi/protocols/src/vendors/payments/types/payment-status.ts:15](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/payment-status.ts#L15) |
| <a id="nr"></a> `NR` | `"NR"` | `'NR'` | [defi/protocols/src/vendors/payments/types/payment-status.ts:12](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/payment-status.ts#L12) |
| <a id="oc"></a> `OC` | `"OC"` | `'OC'` | [defi/protocols/src/vendors/payments/types/payment-status.ts:16](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/payment-status.ts#L16) |
| <a id="pe"></a> `PE` | `"PE"` | `'PE'` | [defi/protocols/src/vendors/payments/types/payment-status.ts:13](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/payment-status.ts#L13) |

***

### PaymentStatusMap

```ts
const PaymentStatusMap: Record<PaymentStatusCode, PaymentStatusInfo>;
```

Defined in: [defi/protocols/src/vendors/payments/types/payment-status.ts:33](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/payment-status.ts#L33)

## Functions

### canTransitionTo()

```ts
function canTransitionTo(fromStatus: PaymentStatusCode, toStatus: PaymentStatusCode): boolean;
```

Defined in: [defi/protocols/src/vendors/payments/types/payment-status.ts:136](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/payment-status.ts#L136)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `fromStatus` | [`PaymentStatusCode`](/docs/api/defi/protocols/src/vendors/payments/types.md#paymentstatuscode) |
| `toStatus` | [`PaymentStatusCode`](/docs/api/defi/protocols/src/vendors/payments/types.md#paymentstatuscode) |

#### Returns

`boolean`

***

### getPaymentStatusInfo()

```ts
function getPaymentStatusInfo(status: PaymentStatusCode): PaymentStatusInfo;
```

Defined in: [defi/protocols/src/vendors/payments/types/payment-status.ts:118](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/payment-status.ts#L118)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `status` | [`PaymentStatusCode`](/docs/api/defi/protocols/src/vendors/payments/types.md#paymentstatuscode) |

#### Returns

[`PaymentStatusInfo`](/docs/api/defi/protocols/src/vendors/payments/types/payment-status.md#paymentstatusinfo)

***

### getStatusPriority()

```ts
function getStatusPriority(status: PaymentStatusCode): number;
```

Defined in: [defi/protocols/src/vendors/payments/types/payment-status.ts:156](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/payment-status.ts#L156)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `status` | [`PaymentStatusCode`](/docs/api/defi/protocols/src/vendors/payments/types.md#paymentstatuscode) |

#### Returns

`number`

***

### isSuccessfulStatus()

```ts
function isSuccessfulStatus(status: PaymentStatusCode): boolean;
```

Defined in: [defi/protocols/src/vendors/payments/types/payment-status.ts:128](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/payment-status.ts#L128)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `status` | [`PaymentStatusCode`](/docs/api/defi/protocols/src/vendors/payments/types.md#paymentstatuscode) |

#### Returns

`boolean`

***

### isTerminalStatus()

```ts
function isTerminalStatus(status: PaymentStatusCode): boolean;
```

Defined in: [defi/protocols/src/vendors/payments/types/payment-status.ts:124](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/payment-status.ts#L124)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `status` | [`PaymentStatusCode`](/docs/api/defi/protocols/src/vendors/payments/types.md#paymentstatuscode) |

#### Returns

`boolean`

***

### requiresUserAction()

```ts
function requiresUserAction(status: PaymentStatusCode): boolean;
```

Defined in: [defi/protocols/src/vendors/payments/types/payment-status.ts:132](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/types/payment-status.ts#L132)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `status` | [`PaymentStatusCode`](/docs/api/defi/protocols/src/vendors/payments/types.md#paymentstatuscode) |

#### Returns

`boolean`
