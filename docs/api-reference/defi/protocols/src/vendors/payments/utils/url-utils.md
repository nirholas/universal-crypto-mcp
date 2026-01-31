[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/payments/utils/url-utils

# defi/protocols/src/vendors/payments/utils/url-utils

## Interfaces

### EnvironmentConfig

Defined in: [defi/protocols/src/vendors/payments/utils/url-utils.ts:16](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/url-utils.ts#L16)

Configuration for different environments and their base domains

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="development"></a> `development` | `string` | [defi/protocols/src/vendors/payments/utils/url-utils.ts:17](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/url-utils.ts#L17) |
| <a id="production"></a> `production` | `string` | [defi/protocols/src/vendors/payments/utils/url-utils.ts:19](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/url-utils.ts#L19) |
| <a id="testing"></a> `testing` | `string` | [defi/protocols/src/vendors/payments/utils/url-utils.ts:18](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/url-utils.ts#L18) |

## Variables

### DEFAULT\_GATEWAY\_DOMAINS

```ts
const DEFAULT_GATEWAY_DOMAINS: EnvironmentConfig;
```

Defined in: [defi/protocols/src/vendors/payments/utils/url-utils.ts:25](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/url-utils.ts#L25)

Default base domains for Bitnovo Pay gateway URLs

## Functions

### createDisplayUrl()

```ts
function createDisplayUrl(gatewayUrl: string): string;
```

Defined in: [defi/protocols/src/vendors/payments/utils/url-utils.ts:249](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/url-utils.ts#L249)

Create a short URL for sharing (for display purposes)

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `gatewayUrl` | `string` | The full gateway URL |

#### Returns

`string`

A shortened version for display

***

### determineEnvironment()

```ts
function determineEnvironment(baseUrl: string): keyof EnvironmentConfig;
```

Defined in: [defi/protocols/src/vendors/payments/utils/url-utils.ts:108](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/url-utils.ts#L108)

Determine the appropriate environment based on the base URL configuration

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `baseUrl` | `string` | The base URL from configuration (e.g., UNIVERSAL_CRYPTO_BASE_URL) |

#### Returns

keyof [`EnvironmentConfig`](/docs/api/defi/protocols/src/vendors/payments/utils/url-utils.md#environmentconfig)

The environment type

***

### extractShortIdentifierFromUrl()

```ts
function extractShortIdentifierFromUrl(webUrl: string): string | null;
```

Defined in: [defi/protocols/src/vendors/payments/utils/url-utils.ts:41](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/url-utils.ts#L41)

Extract short identifier from a Bitnovo payment web URL

Examples:
- "https://pay.bitnovo.com/abcd1234/" -> "abcd1234"
- "https://dev-paytest.bitnovo.com/xyz789/" -> "xyz789"

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `webUrl` | `string` | The full web URL from payment response |

#### Returns

`string` \| `null`

The extracted short identifier or null if not found

***

### generateGatewayUrl()

```ts
function generateGatewayUrl(
   shortIdentifier: string, 
   environment?: keyof EnvironmentConfig, 
   customDomains?: Partial<EnvironmentConfig>): string;
```

Defined in: [defi/protocols/src/vendors/payments/utils/url-utils.ts:128](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/url-utils.ts#L128)

Generate a payment gateway URL using short identifier

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `shortIdentifier` | `string` | The short identifier extracted from payment |
| `environment?` | keyof EnvironmentConfig | The target environment (defaults to auto-detect from process.env) |
| `customDomains?` | `Partial`\<[`EnvironmentConfig`](/docs/api/defi/protocols/src/vendors/payments/utils/url-utils.md#environmentconfig)\> | Optional custom domain configuration |

#### Returns

`string`

The complete gateway URL

***

### generateGatewayUrlFromWebUrl()

```ts
function generateGatewayUrlFromWebUrl(
   webUrl: string, 
   environment?: keyof EnvironmentConfig, 
   customDomains?: Partial<EnvironmentConfig>): string | null;
```

Defined in: [defi/protocols/src/vendors/payments/utils/url-utils.ts:166](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/url-utils.ts#L166)

Generate gateway URL directly from payment web URL

This is a convenience function that combines extraction and generation

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `webUrl` | `string` | The original web URL from payment response |
| `environment?` | keyof EnvironmentConfig | Optional environment override |
| `customDomains?` | `Partial`\<[`EnvironmentConfig`](/docs/api/defi/protocols/src/vendors/payments/utils/url-utils.md#environmentconfig)\> | Optional custom domain configuration |

#### Returns

`string` \| `null`

The gateway URL or null if extraction fails

***

### getCurrentEnvironmentDomain()

```ts
function getCurrentEnvironmentDomain(customDomains?: Partial<EnvironmentConfig>): string;
```

Defined in: [defi/protocols/src/vendors/payments/utils/url-utils.ts:233](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/url-utils.ts#L233)

Get the base domain for the current environment

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `customDomains?` | `Partial`\<[`EnvironmentConfig`](/docs/api/defi/protocols/src/vendors/payments/utils/url-utils.md#environmentconfig)\> | Optional custom domain configuration |

#### Returns

`string`

The base domain string

***

### isValidGatewayUrl()

```ts
function isValidGatewayUrl(url: string): boolean;
```

Defined in: [defi/protocols/src/vendors/payments/utils/url-utils.ts:190](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/url-utils.ts#L190)

Validate that a URL appears to be a valid Bitnovo payment gateway URL

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `url` | `string` | The URL to validate |

#### Returns

`boolean`

True if the URL appears to be a valid gateway URL
