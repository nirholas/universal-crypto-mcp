[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/payments/utils/validation

# defi/protocols/src/vendors/payments/utils/validation

## Interfaces

### ValidationError

Defined in: [defi/protocols/src/vendors/payments/utils/validation.ts:82](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/validation.ts#L82)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="error"></a> `error` | \{ `code`: `string`; `field?`: `string`; `message`: `string`; \} | [defi/protocols/src/vendors/payments/utils/validation.ts:84](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/validation.ts#L84) |
| `error.code` | `string` | [defi/protocols/src/vendors/payments/utils/validation.ts:87](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/validation.ts#L87) |
| `error.field?` | `string` | [defi/protocols/src/vendors/payments/utils/validation.ts:86](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/validation.ts#L86) |
| `error.message` | `string` | [defi/protocols/src/vendors/payments/utils/validation.ts:85](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/validation.ts#L85) |
| <a id="success"></a> `success` | `false` | [defi/protocols/src/vendors/payments/utils/validation.ts:83](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/validation.ts#L83) |

***

### ValidationSuccess

Defined in: [defi/protocols/src/vendors/payments/utils/validation.ts:77](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/validation.ts#L77)

#### Type Parameters

| Type Parameter |
| :------ |
| `T` |

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="data"></a> `data` | `T` | [defi/protocols/src/vendors/payments/utils/validation.ts:79](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/validation.ts#L79) |
| <a id="success-1"></a> `success` | `true` | [defi/protocols/src/vendors/payments/utils/validation.ts:78](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/validation.ts#L78) |

## Type Aliases

### ValidationResult

```ts
type ValidationResult<T> = 
  | ValidationSuccess<T>
  | ValidationError;
```

Defined in: [defi/protocols/src/vendors/payments/utils/validation.ts:91](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/validation.ts#L91)

#### Type Parameters

| Type Parameter |
| :------ |
| `T` |

## Variables

### createPaymentOnchainSchema

```ts
const createPaymentOnchainSchema: ZodObject<{
  amount_eur: ZodNumber;
  fiat: ZodOptional<ZodDefault<ZodString>>;
  input_currency: ZodString;
  notes: ZodOptional<ZodString>;
}, "strip", ZodTypeAny, {
  amount_eur: number;
  fiat?: string;
  input_currency: string;
  notes?: string;
}, {
  amount_eur: number;
  fiat?: string;
  input_currency: string;
  notes?: string;
}>;
```

Defined in: [defi/protocols/src/vendors/payments/utils/validation.ts:53](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/validation.ts#L53)

***

### createPaymentRedirectSchema

```ts
const createPaymentRedirectSchema: ZodObject<{
  amount_eur: ZodNumber;
  fiat: ZodOptional<ZodDefault<ZodString>>;
  notes: ZodOptional<ZodString>;
  url_ko: ZodOptional<ZodString>;
  url_ok: ZodOptional<ZodString>;
}, "strip", ZodTypeAny, {
  amount_eur: number;
  fiat?: string;
  notes?: string;
  url_ko?: string;
  url_ok?: string;
}, {
  amount_eur: number;
  fiat?: string;
  notes?: string;
  url_ko?: string;
  url_ok?: string;
}>;
```

Defined in: [defi/protocols/src/vendors/payments/utils/validation.ts:60](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/validation.ts#L60)

***

### envConfigSchema

```ts
const envConfigSchema: ZodObject<{
  API_TIMEOUT: ZodOptional<ZodDefault<ZodNumber>>;
  LOG_LEVEL: ZodOptional<ZodDefault<ZodEnum<["error", "warn", "info", "debug"]>>>;
  MAX_RETRIES: ZodOptional<ZodDefault<ZodNumber>>;
  NGROK_AUTHTOKEN: ZodOptional<ZodString>;
  NGROK_DOMAIN: ZodOptional<ZodString>;
  NODE_ENV: ZodOptional<ZodDefault<ZodEnum<["development", "production", "test"]>>>;
  RETRY_DELAY: ZodOptional<ZodDefault<ZodNumber>>;
  TUNNEL_ENABLED: ZodEffects<ZodDefault<ZodBoolean>, boolean, unknown>;
  TUNNEL_HEALTH_CHECK_INTERVAL: ZodOptional<ZodDefault<ZodNumber>>;
  TUNNEL_PROVIDER: ZodOptional<ZodDefault<ZodEnum<["ngrok", "zrok", "manual"]>>>;
  TUNNEL_RECONNECT_BACKOFF_MS: ZodOptional<ZodDefault<ZodNumber>>;
  TUNNEL_RECONNECT_MAX_RETRIES: ZodOptional<ZodDefault<ZodNumber>>;
  UNIVERSAL_CRYPTO_BASE_URL: ZodString;
  UNIVERSAL_CRYPTO_DEVICE_ID: ZodString;
  UNIVERSAL_CRYPTO_DEVICE_SECRET: ZodOptional<ZodString>;
  WEBHOOK_ENABLED: ZodEffects<ZodDefault<ZodBoolean>, boolean, unknown>;
  WEBHOOK_EVENT_TTL_MS: ZodOptional<ZodDefault<ZodNumber>>;
  WEBHOOK_HOST: ZodOptional<ZodDefault<ZodString>>;
  WEBHOOK_MAX_EVENTS: ZodOptional<ZodDefault<ZodNumber>>;
  WEBHOOK_PATH: ZodOptional<ZodDefault<ZodString>>;
  WEBHOOK_PORT: ZodOptional<ZodDefault<ZodNumber>>;
  WEBHOOK_PUBLIC_URL: ZodOptional<ZodString>;
  ZROK_TOKEN: ZodOptional<ZodString>;
  ZROK_UNIQUE_NAME: ZodOptional<ZodString>;
}, "strip", ZodTypeAny, {
  API_TIMEOUT?: number;
  LOG_LEVEL?: "debug" | "info" | "warn" | "error";
  MAX_RETRIES?: number;
  NGROK_AUTHTOKEN?: string;
  NGROK_DOMAIN?: string;
  NODE_ENV?: "development" | "production" | "test";
  RETRY_DELAY?: number;
  TUNNEL_ENABLED: boolean;
  TUNNEL_HEALTH_CHECK_INTERVAL?: number;
  TUNNEL_PROVIDER?: "manual" | "ngrok" | "zrok";
  TUNNEL_RECONNECT_BACKOFF_MS?: number;
  TUNNEL_RECONNECT_MAX_RETRIES?: number;
  UNIVERSAL_CRYPTO_BASE_URL: string;
  UNIVERSAL_CRYPTO_DEVICE_ID: string;
  UNIVERSAL_CRYPTO_DEVICE_SECRET?: string;
  WEBHOOK_ENABLED: boolean;
  WEBHOOK_EVENT_TTL_MS?: number;
  WEBHOOK_HOST?: string;
  WEBHOOK_MAX_EVENTS?: number;
  WEBHOOK_PATH?: string;
  WEBHOOK_PORT?: number;
  WEBHOOK_PUBLIC_URL?: string;
  ZROK_TOKEN?: string;
  ZROK_UNIQUE_NAME?: string;
}, {
  API_TIMEOUT?: number;
  LOG_LEVEL?: "debug" | "info" | "warn" | "error";
  MAX_RETRIES?: number;
  NGROK_AUTHTOKEN?: string;
  NGROK_DOMAIN?: string;
  NODE_ENV?: "development" | "production" | "test";
  RETRY_DELAY?: number;
  TUNNEL_ENABLED?: unknown;
  TUNNEL_HEALTH_CHECK_INTERVAL?: number;
  TUNNEL_PROVIDER?: "manual" | "ngrok" | "zrok";
  TUNNEL_RECONNECT_BACKOFF_MS?: number;
  TUNNEL_RECONNECT_MAX_RETRIES?: number;
  UNIVERSAL_CRYPTO_BASE_URL: string;
  UNIVERSAL_CRYPTO_DEVICE_ID: string;
  UNIVERSAL_CRYPTO_DEVICE_SECRET?: string;
  WEBHOOK_ENABLED?: unknown;
  WEBHOOK_EVENT_TTL_MS?: number;
  WEBHOOK_HOST?: string;
  WEBHOOK_MAX_EVENTS?: number;
  WEBHOOK_PATH?: string;
  WEBHOOK_PORT?: number;
  WEBHOOK_PUBLIC_URL?: string;
  ZROK_TOKEN?: string;
  ZROK_UNIQUE_NAME?: string;
}>;
```

Defined in: [defi/protocols/src/vendors/payments/utils/validation.ts:216](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/validation.ts#L216)

***

### getPaymentStatusSchema

```ts
const getPaymentStatusSchema: ZodObject<{
  identifier: ZodString;
}, "strip", ZodTypeAny, {
  identifier: string;
}, {
  identifier: string;
}>;
```

Defined in: [defi/protocols/src/vendors/payments/utils/validation.ts:68](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/validation.ts#L68)

***

### listCurrenciesCatalogSchema

```ts
const listCurrenciesCatalogSchema: ZodObject<{
  filter_by_amount: ZodOptional<ZodNumber>;
}, "strip", ZodTypeAny, {
  filter_by_amount?: number;
}, {
  filter_by_amount?: number;
}>;
```

Defined in: [defi/protocols/src/vendors/payments/utils/validation.ts:72](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/validation.ts#L72)

## Functions

### getHttpStatusForValidationError()

```ts
function getHttpStatusForValidationError(code: string): number;
```

Defined in: [defi/protocols/src/vendors/payments/utils/validation.ts:376](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/validation.ts#L376)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `code` | `string` |

#### Returns

`number`

***

### isValidCurrencySymbol()

```ts
function isValidCurrencySymbol(value: string): boolean;
```

Defined in: [defi/protocols/src/vendors/payments/utils/validation.ts:346](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/validation.ts#L346)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `value` | `string` |

#### Returns

`boolean`

***

### isValidUrl()

```ts
function isValidUrl(value: string): boolean;
```

Defined in: [defi/protocols/src/vendors/payments/utils/validation.ts:350](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/validation.ts#L350)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `value` | `string` |

#### Returns

`boolean`

***

### isValidUuid()

```ts
function isValidUuid(value: string): boolean;
```

Defined in: [defi/protocols/src/vendors/payments/utils/validation.ts:342](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/validation.ts#L342)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `value` | `string` |

#### Returns

`boolean`

***

### normalizeAmount()

```ts
function normalizeAmount(amount: number): number;
```

Defined in: [defi/protocols/src/vendors/payments/utils/validation.ts:370](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/validation.ts#L370)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `amount` | `number` |

#### Returns

`number`

***

### sanitizeNotes()

```ts
function sanitizeNotes(notes: string | undefined): string | undefined;
```

Defined in: [defi/protocols/src/vendors/payments/utils/validation.ts:354](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/validation.ts#L354)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `notes` | `string` \| `undefined` |

#### Returns

`string` \| `undefined`

***

### validateAmountForCurrency()

```ts
function validateAmountForCurrency(amount: number, currency: {
  maxAmount: number | null;
  minAmount: number;
}): ValidationResult<number>;
```

Defined in: [defi/protocols/src/vendors/payments/utils/validation.ts:164](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/validation.ts#L164)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `amount` | `number` |
| `currency` | \{ `maxAmount`: `number` \| `null`; `minAmount`: `number`; \} |
| `currency.maxAmount` | `number` \| `null` |
| `currency.minAmount` | `number` |

#### Returns

[`ValidationResult`](/docs/api/defi/protocols/src/vendors/payments/utils/validation.md#validationresult)\<`number`\>

***

### validateCreatePaymentOnchain()

```ts
function validateCreatePaymentOnchain(input: unknown): ValidationResult<CreatePaymentOnchainInput>;
```

Defined in: [defi/protocols/src/vendors/payments/utils/validation.ts:139](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/validation.ts#L139)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `input` | `unknown` |

#### Returns

[`ValidationResult`](/docs/api/defi/protocols/src/vendors/payments/utils/validation.md#validationresult)\<[`CreatePaymentOnchainInput`](/docs/api/defi/protocols/src/vendors/payments/types.md#createpaymentonchaininput)\>

***

### validateCreatePaymentRedirect()

```ts
function validateCreatePaymentRedirect(input: unknown): ValidationResult<CreatePaymentRedirectInput>;
```

Defined in: [defi/protocols/src/vendors/payments/utils/validation.ts:145](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/validation.ts#L145)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `input` | `unknown` |

#### Returns

[`ValidationResult`](/docs/api/defi/protocols/src/vendors/payments/utils/validation.md#validationresult)\<[`CreatePaymentRedirectInput`](/docs/api/defi/protocols/src/vendors/payments/types.md#createpaymentredirectinput)\>

***

### validateEnvironmentConfig()

```ts
function validateEnvironmentConfig(env: Record<string, string | undefined>): ValidationResult<{
  API_TIMEOUT?: number;
  LOG_LEVEL?: "debug" | "info" | "warn" | "error";
  MAX_RETRIES?: number;
  NGROK_AUTHTOKEN?: string;
  NGROK_DOMAIN?: string;
  NODE_ENV?: "development" | "production" | "test";
  RETRY_DELAY?: number;
  TUNNEL_ENABLED: boolean;
  TUNNEL_HEALTH_CHECK_INTERVAL?: number;
  TUNNEL_PROVIDER?: "manual" | "ngrok" | "zrok";
  TUNNEL_RECONNECT_BACKOFF_MS?: number;
  TUNNEL_RECONNECT_MAX_RETRIES?: number;
  UNIVERSAL_CRYPTO_BASE_URL: string;
  UNIVERSAL_CRYPTO_DEVICE_ID: string;
  UNIVERSAL_CRYPTO_DEVICE_SECRET?: string;
  WEBHOOK_ENABLED: boolean;
  WEBHOOK_EVENT_TTL_MS?: number;
  WEBHOOK_HOST?: string;
  WEBHOOK_MAX_EVENTS?: number;
  WEBHOOK_PATH?: string;
  WEBHOOK_PORT?: number;
  WEBHOOK_PUBLIC_URL?: string;
  ZROK_TOKEN?: string;
  ZROK_UNIQUE_NAME?: string;
}>;
```

Defined in: [defi/protocols/src/vendors/payments/utils/validation.ts:314](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/validation.ts#L314)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `env` | `Record`\<`string`, `string` \| `undefined`\> |

#### Returns

[`ValidationResult`](/docs/api/defi/protocols/src/vendors/payments/utils/validation.md#validationresult)\<\{
  `API_TIMEOUT?`: `number`;
  `LOG_LEVEL?`: `"debug"` \| `"info"` \| `"warn"` \| `"error"`;
  `MAX_RETRIES?`: `number`;
  `NGROK_AUTHTOKEN?`: `string`;
  `NGROK_DOMAIN?`: `string`;
  `NODE_ENV?`: `"development"` \| `"production"` \| `"test"`;
  `RETRY_DELAY?`: `number`;
  `TUNNEL_ENABLED`: `boolean`;
  `TUNNEL_HEALTH_CHECK_INTERVAL?`: `number`;
  `TUNNEL_PROVIDER?`: `"manual"` \| `"ngrok"` \| `"zrok"`;
  `TUNNEL_RECONNECT_BACKOFF_MS?`: `number`;
  `TUNNEL_RECONNECT_MAX_RETRIES?`: `number`;
  `UNIVERSAL_CRYPTO_BASE_URL`: `string`;
  `UNIVERSAL_CRYPTO_DEVICE_ID`: `string`;
  `UNIVERSAL_CRYPTO_DEVICE_SECRET?`: `string`;
  `WEBHOOK_ENABLED`: `boolean`;
  `WEBHOOK_EVENT_TTL_MS?`: `number`;
  `WEBHOOK_HOST?`: `string`;
  `WEBHOOK_MAX_EVENTS?`: `number`;
  `WEBHOOK_PATH?`: `string`;
  `WEBHOOK_PORT?`: `number`;
  `WEBHOOK_PUBLIC_URL?`: `string`;
  `ZROK_TOKEN?`: `string`;
  `ZROK_UNIQUE_NAME?`: `string`;
\}\>

***

### validateGetPaymentStatus()

```ts
function validateGetPaymentStatus(input: unknown): ValidationResult<GetPaymentStatusInput>;
```

Defined in: [defi/protocols/src/vendors/payments/utils/validation.ts:151](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/validation.ts#L151)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `input` | `unknown` |

#### Returns

[`ValidationResult`](/docs/api/defi/protocols/src/vendors/payments/utils/validation.md#validationresult)\<[`GetPaymentStatusInput`](/docs/api/defi/protocols/src/vendors/payments/types.md#getpaymentstatusinput)\>

***

### validateInput()

```ts
function validateInput<T>(schema: ZodType<T>, input: unknown): ValidationResult<T>;
```

Defined in: [defi/protocols/src/vendors/payments/utils/validation.ts:94](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/validation.ts#L94)

#### Type Parameters

| Type Parameter |
| :------ |
| `T` |

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `schema` | `ZodType`\<`T`\> |
| `input` | `unknown` |

#### Returns

[`ValidationResult`](/docs/api/defi/protocols/src/vendors/payments/utils/validation.md#validationresult)\<`T`\>

***

### validateListCurrenciesCatalog()

```ts
function validateListCurrenciesCatalog(input: unknown): ValidationResult<ListCurrenciesCatalogInput>;
```

Defined in: [defi/protocols/src/vendors/payments/utils/validation.ts:157](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/validation.ts#L157)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `input` | `unknown` |

#### Returns

[`ValidationResult`](/docs/api/defi/protocols/src/vendors/payments/utils/validation.md#validationresult)\<[`ListCurrenciesCatalogInput`](/docs/api/defi/protocols/src/vendors/payments/types.md#listcurrenciescataloginput)\>

***

### validatePaymentStatus()

```ts
function validatePaymentStatus(status: string): ValidationResult<PaymentStatusCode>;
```

Defined in: [defi/protocols/src/vendors/payments/utils/validation.ts:194](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/validation.ts#L194)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `status` | `string` |

#### Returns

[`ValidationResult`](/docs/api/defi/protocols/src/vendors/payments/utils/validation.md#validationresult)\<[`PaymentStatusCode`](/docs/api/defi/protocols/src/vendors/payments/types.md#paymentstatuscode)\>
