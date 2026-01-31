[**Universal Crypto MCP API Reference v1.0.0**](../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/x402/validation

# defi/protocols/src/x402/validation

## Interfaces

### AddressValidationResult

Defined in: [defi/protocols/src/x402/validation.ts:300](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/validation.ts#L300)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="address"></a> `address?` | `` `0x${string}` `` | [defi/protocols/src/x402/validation.ts:302](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/validation.ts#L302) |
| <a id="checksummed"></a> `checksummed?` | `` `0x${string}` `` | [defi/protocols/src/x402/validation.ts:303](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/validation.ts#L303) |
| <a id="errors"></a> `errors` | `string`[] | [defi/protocols/src/x402/validation.ts:304](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/validation.ts#L304) |
| <a id="valid"></a> `valid` | `boolean` | [defi/protocols/src/x402/validation.ts:301](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/validation.ts#L301) |
| <a id="warnings"></a> `warnings` | `string`[] | [defi/protocols/src/x402/validation.ts:305](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/validation.ts#L305) |

***

### AmountValidationResult

Defined in: [defi/protocols/src/x402/validation.ts:195](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/validation.ts#L195)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="amount"></a> `amount?` | `number` | [defi/protocols/src/x402/validation.ts:197](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/validation.ts#L197) |
| <a id="errors-1"></a> `errors` | `string`[] | [defi/protocols/src/x402/validation.ts:198](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/validation.ts#L198) |
| <a id="valid-1"></a> `valid` | `boolean` | [defi/protocols/src/x402/validation.ts:196](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/validation.ts#L196) |
| <a id="warnings-1"></a> `warnings` | `string`[] | [defi/protocols/src/x402/validation.ts:199](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/validation.ts#L199) |

***

### URLValidationOptions

Defined in: [defi/protocols/src/x402/validation.ts:26](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/validation.ts#L26)

URL validation options

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="allowedprotocols"></a> `allowedProtocols?` | `string`[] | Allow specific protocols (default: ['https']) | [defi/protocols/src/x402/validation.ts:34](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/validation.ts#L34) |
| <a id="allowhttp"></a> `allowHttp?` | `boolean` | Allow HTTP (non-HTTPS) URLs (default: false for mainnet) | [defi/protocols/src/x402/validation.ts:32](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/validation.ts#L32) |
| <a id="allowlocalhost"></a> `allowLocalhost?` | `boolean` | Allow localhost URLs (default: false) | [defi/protocols/src/x402/validation.ts:28](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/validation.ts#L28) |
| <a id="allowprivateip"></a> `allowPrivateIP?` | `boolean` | Allow private IP ranges (default: false) | [defi/protocols/src/x402/validation.ts:30](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/validation.ts#L30) |
| <a id="blockeddomains"></a> `blockedDomains?` | `string`[] | Block specific domains | [defi/protocols/src/x402/validation.ts:36](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/validation.ts#L36) |
| <a id="maxlength"></a> `maxLength?` | `number` | Maximum URL length | [defi/protocols/src/x402/validation.ts:38](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/validation.ts#L38) |

***

### URLValidationResult

Defined in: [defi/protocols/src/x402/validation.ts:81](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/validation.ts#L81)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="errors-2"></a> `errors` | `string`[] | [defi/protocols/src/x402/validation.ts:84](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/validation.ts#L84) |
| <a id="url"></a> `url?` | `URL` | [defi/protocols/src/x402/validation.ts:83](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/validation.ts#L83) |
| <a id="valid-2"></a> `valid` | `boolean` | [defi/protocols/src/x402/validation.ts:82](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/validation.ts#L82) |
| <a id="warnings-2"></a> `warnings` | `string`[] | [defi/protocols/src/x402/validation.ts:85](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/validation.ts#L85) |

## Functions

### getURLValidationOptions()

```ts
function getURLValidationOptions(isTestnet: boolean): URLValidationOptions;
```

Defined in: [defi/protocols/src/x402/validation.ts:179](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/validation.ts#L179)

Get URL validation options for testnet vs mainnet

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `isTestnet` | `boolean` |

#### Returns

[`URLValidationOptions`](/docs/api/defi/protocols/src/x402/validation.md#urlvalidationoptions)

***

### sanitizeString()

```ts
function sanitizeString(input: string, options: {
  allowedPattern?: RegExp;
  maxLength?: number;
  stripHtml?: boolean;
  trim?: boolean;
}): {
  modified: boolean;
  sanitized: string;
};
```

Defined in: [defi/protocols/src/x402/validation.ts:494](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/validation.ts#L494)

Sanitize a string input

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `input` | `string` |
| `options` | \{ `allowedPattern?`: `RegExp`; `maxLength?`: `number`; `stripHtml?`: `boolean`; `trim?`: `boolean`; \} |
| `options.allowedPattern?` | `RegExp` |
| `options.maxLength?` | `number` |
| `options.stripHtml?` | `boolean` |
| `options.trim?` | `boolean` |

#### Returns

```ts
{
  modified: boolean;
  sanitized: string;
}
```

| Name | Type | Defined in |
| :------ | :------ | :------ |
| `modified` | `boolean` | [defi/protocols/src/x402/validation.ts:502](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/validation.ts#L502) |
| `sanitized` | `string` | [defi/protocols/src/x402/validation.ts:502](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/validation.ts#L502) |

***

### validateAddress()

```ts
function validateAddress(addressString: string, options: {
  blockedAddresses?: string[];
  requireChecksum?: boolean;
}): AddressValidationResult;
```

Defined in: [defi/protocols/src/x402/validation.ts:311](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/validation.ts#L311)

Validate an EVM address

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `addressString` | `string` |
| `options` | \{ `blockedAddresses?`: `string`[]; `requireChecksum?`: `boolean`; \} |
| `options.blockedAddresses?` | `string`[] |
| `options.requireChecksum?` | `boolean` |

#### Returns

[`AddressValidationResult`](/docs/api/defi/protocols/src/x402/validation.md#addressvalidationresult)

***

### validateAmount()

```ts
function validateAmount(amountString: string, options: {
  allowZero?: boolean;
  currency?: string;
  maxAmount?: number;
  minAmount?: number;
}): AmountValidationResult;
```

Defined in: [defi/protocols/src/x402/validation.ts:205](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/validation.ts#L205)

Validate a payment amount

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `amountString` | `string` |
| `options` | \{ `allowZero?`: `boolean`; `currency?`: `string`; `maxAmount?`: `number`; `minAmount?`: `number`; \} |
| `options.allowZero?` | `boolean` |
| `options.currency?` | `string` |
| `options.maxAmount?` | `number` |
| `options.minAmount?` | `number` |

#### Returns

[`AmountValidationResult`](/docs/api/defi/protocols/src/x402/validation.md#amountvalidationresult)

***

### validateChain()

```ts
function validateChain(chain: string, options: {
  requireMainnet?: boolean;
  requireTestnet?: boolean;
}): {
  chain?:   | "ethereum"
     | "bsc"
     | "base"
     | "arbitrum"
     | "arbitrum-sepolia"
     | "polygon"
     | "optimism";
  error?: string;
  isTestnet: boolean;
  valid: boolean;
};
```

Defined in: [defi/protocols/src/x402/validation.ts:442](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/validation.ts#L442)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `chain` | `string` |
| `options` | \{ `requireMainnet?`: `boolean`; `requireTestnet?`: `boolean`; \} |
| `options.requireMainnet?` | `boolean` |
| `options.requireTestnet?` | `boolean` |

#### Returns

```ts
{
  chain?:   | "ethereum"
     | "bsc"
     | "base"
     | "arbitrum"
     | "arbitrum-sepolia"
     | "polygon"
     | "optimism";
  error?: string;
  isTestnet: boolean;
  valid: boolean;
}
```

| Name | Type | Defined in |
| :------ | :------ | :------ |
| `chain?` | \| `"ethereum"` \| `"bsc"` \| `"base"` \| `"arbitrum"` \| `"arbitrum-sepolia"` \| `"polygon"` \| `"optimism"` | [defi/protocols/src/x402/validation.ts:447](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/validation.ts#L447) |
| `error?` | `string` | [defi/protocols/src/x402/validation.ts:449](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/validation.ts#L449) |
| `isTestnet` | `boolean` | [defi/protocols/src/x402/validation.ts:448](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/validation.ts#L448) |
| `valid` | `boolean` | [defi/protocols/src/x402/validation.ts:446](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/validation.ts#L446) |

***

### validateMemo()

```ts
function validateMemo(memo: string | undefined): {
  error?: string;
  sanitized?: string;
  valid: boolean;
};
```

Defined in: [defi/protocols/src/x402/validation.ts:552](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/validation.ts#L552)

Validate a memo/note field

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `memo` | `string` \| `undefined` |

#### Returns

```ts
{
  error?: string;
  sanitized?: string;
  valid: boolean;
}
```

| Name | Type | Defined in |
| :------ | :------ | :------ |
| `error?` | `string` | [defi/protocols/src/x402/validation.ts:555](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/validation.ts#L555) |
| `sanitized?` | `string` | [defi/protocols/src/x402/validation.ts:554](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/validation.ts#L554) |
| `valid` | `boolean` | [defi/protocols/src/x402/validation.ts:553](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/validation.ts#L553) |

***

### validateToken()

```ts
function validateToken(token: string): {
  error?: string;
  token?: "USDC" | "USDs" | "ETH" | "USDT" | "DAI" | "native";
  valid: boolean;
};
```

Defined in: [defi/protocols/src/x402/validation.ts:404](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/validation.ts#L404)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `token` | `string` |

#### Returns

```ts
{
  error?: string;
  token?: "USDC" | "USDs" | "ETH" | "USDT" | "DAI" | "native";
  valid: boolean;
}
```

| Name | Type | Defined in |
| :------ | :------ | :------ |
| `error?` | `string` | [defi/protocols/src/x402/validation.ts:407](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/validation.ts#L407) |
| `token?` | `"USDC"` \| `"USDs"` \| `"ETH"` \| `"USDT"` \| `"DAI"` \| `"native"` | [defi/protocols/src/x402/validation.ts:406](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/validation.ts#L406) |
| `valid` | `boolean` | [defi/protocols/src/x402/validation.ts:405](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/validation.ts#L405) |

***

### validateURL()

```ts
function validateURL(urlString: string, options: URLValidationOptions): URLValidationResult;
```

Defined in: [defi/protocols/src/x402/validation.ts:91](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/validation.ts#L91)

Validate a URL for x402 requests

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `urlString` | `string` |
| `options` | [`URLValidationOptions`](/docs/api/defi/protocols/src/x402/validation.md#urlvalidationoptions) |

#### Returns

[`URLValidationResult`](/docs/api/defi/protocols/src/x402/validation.md#urlvalidationresult)
