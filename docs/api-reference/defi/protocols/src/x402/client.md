[**Universal Crypto MCP API Reference v1.0.0**](../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/x402/client

# defi/protocols/src/x402/client

## Interfaces

### CreateX402ClientOptions

Defined in: [defi/protocols/src/x402/client.ts:61](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/client.ts#L61)

Options for creating an x402 client

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="config"></a> `config?` | `Partial`\<[`X402Config`](/docs/api/defi/protocols/src/x402/config.md#x402config)\> | Override config (uses env vars if not provided) | [defi/protocols/src/x402/client.ts:63](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/client.ts#L63) |
| <a id="networks"></a> `networks?` | [`X402Network`](/docs/api/defi/protocols/src/x402/config.md#x402network)[] | Specific networks to enable (enables all configured by default) | [defi/protocols/src/x402/client.ts:65](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/client.ts#L65) |
| <a id="policies"></a> `policies?` | [`PaymentPolicy`](/docs/api/defi/protocols/src/x402/client.md#paymentpolicy)[] | Custom payment policies | [defi/protocols/src/x402/client.ts:67](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/client.ts#L67) |

***

### X402ClientWrapper

Defined in: [defi/protocols/src/x402/client.ts:73](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/client.ts#L73)

Wrapper around the x402 client with additional utilities

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="client"></a> `client` | `x402Client` | The underlying x402 client | [defi/protocols/src/x402/client.ts:75](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/client.ts#L75) |
| <a id="evmsigner"></a> `evmSigner?` | `ClientEvmSigner` | Configured EVM signer (if available) | [defi/protocols/src/x402/client.ts:77](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/client.ts#L77) |
| <a id="hasnetwork"></a> `hasNetwork` | (`network`: `string`) => `boolean` | Check if a network is registered | [defi/protocols/src/x402/client.ts:87](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/client.ts#L87) |
| <a id="registerednetworks"></a> `registeredNetworks` | `string`[] | List of registered network CAIP-2 identifiers | [defi/protocols/src/x402/client.ts:81](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/client.ts#L81) |
| <a id="svmsigner"></a> `svmSigner?` | `ClientSvmSigner` | Configured SVM signer (if available) | [defi/protocols/src/x402/client.ts:79](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/client.ts#L79) |
| <a id="wrapaxios"></a> `wrapAxios` | (`axiosInstance?`: `AxiosInstance`) => `AxiosInstance` | Create an axios instance wrapped with payment handling | [defi/protocols/src/x402/client.ts:83](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/client.ts#L83) |
| <a id="wrapfetch"></a> `wrapFetch` | (`fetchFn?`: *typeof* `fetch`) => *typeof* `fetch` | Create a fetch function wrapped with payment handling | [defi/protocols/src/x402/client.ts:85](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/client.ts#L85) |

## Type Aliases

### PaymentPolicy()

```ts
type PaymentPolicy = (x402Version: number, paymentRequirements: unknown[]) => unknown[];
```

Defined in: [defi/protocols/src/x402/client.ts:56](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/client.ts#L56)

Payment policy function type (filter/transform payment requirements)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `x402Version` | `number` |
| `paymentRequirements` | `unknown`[] |

#### Returns

`unknown`[]

## Functions

### createEvmSigner()

```ts
function createEvmSigner(privateKey: `0x${string}`): ClientEvmSigner;
```

Defined in: [defi/protocols/src/x402/client.ts:97](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/client.ts#L97)

Create an EVM signer from a private key

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `privateKey` | `` `0x${string}` `` |

#### Returns

`ClientEvmSigner`

***

### createPaymentAxios()

```ts
function createPaymentAxios(options: CreateX402ClientOptions): Promise<AxiosInstance>;
```

Defined in: [defi/protocols/src/x402/client.ts:306](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/client.ts#L306)

Create an axios instance wrapped with automatic 402 payment handling

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `options` | [`CreateX402ClientOptions`](/docs/api/defi/protocols/src/x402/client.md#createx402clientoptions) |

#### Returns

`Promise`\<`AxiosInstance`\>

#### Example

```typescript
const api = await createPaymentAxios()
const response = await api.get('https://api.example.com/paid-endpoint')
```

***

### createPaymentFetch()

```ts
function createPaymentFetch(options: CreateX402ClientOptions): Promise<typeof fetch>;
```

Defined in: [defi/protocols/src/x402/client.ts:322](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/client.ts#L322)

Create a fetch function wrapped with automatic 402 payment handling

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `options` | [`CreateX402ClientOptions`](/docs/api/defi/protocols/src/x402/client.md#createx402clientoptions) |

#### Returns

`Promise`\<*typeof* `fetch`\>

#### Example

```typescript
const fetchWithPay = await createPaymentFetch()
const response = await fetchWithPay('https://api.example.com/paid-endpoint')
```

***

### createSvmSigner()

```ts
function createSvmSigner(privateKeyBase58: string): ClientSvmSigner;
```

Defined in: [defi/protocols/src/x402/client.ts:105](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/client.ts#L105)

Create an SVM (Solana) signer from a base58 private key

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `privateKeyBase58` | `string` |

#### Returns

`ClientSvmSigner`

***

### createX402Client()

```ts
function createX402Client(options: CreateX402ClientOptions): Promise<X402ClientWrapper>;
```

Defined in: [defi/protocols/src/x402/client.ts:190](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/client.ts#L190)

Create an x402 client with automatic EVM and SVM signer configuration

The client will:
1. Load configuration from environment variables
2. Create signers for configured keys (EVM and/or Solana)
3. Register appropriate payment schemes for each network
4. Support both v1 and v2 of the x402 protocol

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `options` | [`CreateX402ClientOptions`](/docs/api/defi/protocols/src/x402/client.md#createx402clientoptions) |

#### Returns

`Promise`\<[`X402ClientWrapper`](/docs/api/defi/protocols/src/x402/client.md#x402clientwrapper)\>

#### Example

```typescript
// Basic usage - uses environment variables
const { client, wrapAxios } = await createX402Client()

// With custom options
const { client } = await createX402Client({
  networks: ['base', 'solana-mainnet'],
  config: { maxPaymentPerRequest: '5.00' }
})
```

***

### detectChainType()

```ts
function detectChainType(caip2: string): "evm" | "svm";
```

Defined in: [defi/protocols/src/x402/client.ts:122](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/client.ts#L122)

Detect chain type from a CAIP-2 identifier

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `caip2` | `string` |

#### Returns

`"evm"` \| `"svm"`

#### Example

```ts
detectChainType("eip155:8453")  // "evm"
detectChainType("solana:mainnet")  // "svm"
```

***

### getDefaultClient()

```ts
function getDefaultClient(): Promise<X402ClientWrapper>;
```

Defined in: [defi/protocols/src/x402/client.ts:341](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/client.ts#L341)

Get or create the default x402 client singleton

Uses environment variables for configuration.
Call resetDefaultClient() to force recreation.

#### Returns

`Promise`\<[`X402ClientWrapper`](/docs/api/defi/protocols/src/x402/client.md#x402clientwrapper)\>

***

### isEvmNetwork()

```ts
function isEvmNetwork(caip2: string): boolean;
```

Defined in: [defi/protocols/src/x402/client.ts:136](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/client.ts#L136)

Check if a CAIP-2 identifier matches any supported EVM network

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `caip2` | `string` |

#### Returns

`boolean`

***

### isSvmNetwork()

```ts
function isSvmNetwork(caip2: string): boolean;
```

Defined in: [defi/protocols/src/x402/client.ts:152](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/client.ts#L152)

Check if a CAIP-2 identifier matches any supported SVM network

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `caip2` | `string` |

#### Returns

`boolean`

***

### resetDefaultClient()

```ts
function resetDefaultClient(): void;
```

Defined in: [defi/protocols/src/x402/client.ts:353](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/client.ts#L353)

Reset the default client singleton

Useful when environment variables change or for testing.

#### Returns

`void`
