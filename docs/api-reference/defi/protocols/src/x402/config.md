[**Universal Crypto MCP API Reference v1.0.0**](../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/x402/config

# defi/protocols/src/x402/config

## Interfaces

### LegacyX402Config

Defined in: [defi/protocols/src/x402/config.ts:79](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/config.ts#L79)

Legacy alias for backward compatibility

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="chain"></a> `chain` | [`X402Chain`](/docs/api/defi/protocols/src/x402/sdk/types.md#x402chain) | [defi/protocols/src/x402/config.ts:81](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/config.ts#L81) |
| <a id="debug"></a> `debug` | `boolean` | [defi/protocols/src/x402/config.ts:86](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/config.ts#L86) |
| <a id="enablegasless"></a> `enableGasless` | `boolean` | [defi/protocols/src/x402/config.ts:83](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/config.ts#L83) |
| <a id="facilitatorurl"></a> `facilitatorUrl?` | `string` | [defi/protocols/src/x402/config.ts:84](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/config.ts#L84) |
| <a id="mainnetenabled"></a> `mainnetEnabled` | `boolean` | [defi/protocols/src/x402/config.ts:87](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/config.ts#L87) |
| <a id="maxpaymentperrequest"></a> `maxPaymentPerRequest` | `string` | [defi/protocols/src/x402/config.ts:85](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/config.ts#L85) |
| <a id="privatekey"></a> `privateKey?` | `` `0x${string}` `` | [defi/protocols/src/x402/config.ts:80](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/config.ts#L80) |
| <a id="rpcurl"></a> `rpcUrl?` | `string` | [defi/protocols/src/x402/config.ts:82](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/config.ts#L82) |
| <a id="testnetonly"></a> `testnetOnly` | `boolean` | [defi/protocols/src/x402/config.ts:88](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/config.ts#L88) |

***

### NetworkConfig

Defined in: [defi/protocols/src/x402/config.ts:39](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/config.ts#L39)

Network configuration with CAIP-2 identifier

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="caip2"></a> `caip2` | `string` | [defi/protocols/src/x402/config.ts:40](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/config.ts#L40) |
| <a id="chaintype"></a> `chainType` | `"evm"` \| `"svm"` | [defi/protocols/src/x402/config.ts:43](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/config.ts#L43) |
| <a id="name"></a> `name` | `string` | [defi/protocols/src/x402/config.ts:41](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/config.ts#L41) |
| <a id="rpcurl-1"></a> `rpcUrl?` | `string` | [defi/protocols/src/x402/config.ts:44](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/config.ts#L44) |
| <a id="testnet"></a> `testnet` | `boolean` | [defi/protocols/src/x402/config.ts:42](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/config.ts#L42) |
| <a id="tokens"></a> `tokens` | [`TokenConfig`](/docs/api/defi/protocols/src/x402/config.md#tokenconfig)[] | [defi/protocols/src/x402/config.ts:45](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/config.ts#L45) |

***

### TokenConfig

Defined in: [defi/protocols/src/x402/config.ts:30](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/config.ts#L30)

Token address configuration per chain

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="address"></a> `address` | `string` | [defi/protocols/src/x402/config.ts:32](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/config.ts#L32) |
| <a id="decimals"></a> `decimals` | `number` | [defi/protocols/src/x402/config.ts:33](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/config.ts#L33) |
| <a id="symbol"></a> `symbol` | `string` | [defi/protocols/src/x402/config.ts:31](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/config.ts#L31) |

***

### X402Config

Defined in: [defi/protocols/src/x402/config.ts:51](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/config.ts#L51)

Full x402 configuration from environment variables

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="debug-1"></a> `debug` | `boolean` | Enable debug logging | [defi/protocols/src/x402/config.ts:67](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/config.ts#L67) |
| <a id="defaultchain"></a> `defaultChain` | [`X402Network`](/docs/api/defi/protocols/src/x402/config.md#x402network) | Default chain for payments | [defi/protocols/src/x402/config.ts:57](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/config.ts#L57) |
| <a id="enablegasless-1"></a> `enableGasless` | `boolean` | Enable gasless payments via EIP-3009 (EVM only) | [defi/protocols/src/x402/config.ts:61](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/config.ts#L61) |
| <a id="evmprivatekey"></a> `evmPrivateKey?` | `` `0x${string}` `` | EVM private key for payments (hex string with 0x prefix) | [defi/protocols/src/x402/config.ts:53](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/config.ts#L53) |
| <a id="facilitatorurl-1"></a> `facilitatorUrl?` | `string` | Facilitator URL for payment processing | [defi/protocols/src/x402/config.ts:63](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/config.ts#L63) |
| <a id="mainnetenabled-1"></a> `mainnetEnabled` | `boolean` | Is mainnet explicitly enabled | [defi/protocols/src/x402/config.ts:69](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/config.ts#L69) |
| <a id="maxpaymentperrequest-1"></a> `maxPaymentPerRequest` | `string` | Maximum payment allowed per request (in USD) | [defi/protocols/src/x402/config.ts:65](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/config.ts#L65) |
| <a id="requireapprovalabove"></a> `requireApprovalAbove` | `string` | Require payment approval for amounts above this threshold (in USD) | [defi/protocols/src/x402/config.ts:73](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/config.ts#L73) |
| <a id="rpcurls"></a> `rpcUrls` | `Partial`\<`Record`\<[`X402Network`](/docs/api/defi/protocols/src/x402/config.md#x402network), `string`\>\> | Custom RPC URLs per chain | [defi/protocols/src/x402/config.ts:59](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/config.ts#L59) |
| <a id="svmprivatekey"></a> `svmPrivateKey?` | `string` | SVM (Solana) private key for payments (base58 encoded) | [defi/protocols/src/x402/config.ts:55](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/config.ts#L55) |
| <a id="testnetonly-1"></a> `testnetOnly` | `boolean` | Is testnet-only mode enforced | [defi/protocols/src/x402/config.ts:71](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/config.ts#L71) |

## Type Aliases

### X402Network

```ts
type X402Network = 
  | X402Chain
  | X402SvmChain;
```

Defined in: [defi/protocols/src/x402/config.ts:25](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/config.ts#L25)

Combined chain type for all supported networks

## Variables

### EVM\_CHAINS

```ts
const EVM_CHAINS: Record<X402Chain, NetworkConfig>;
```

Defined in: [defi/protocols/src/x402/config.ts:112](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/config.ts#L112)

EVM chain configurations

***

### SUPPORTED\_CHAINS

```ts
const SUPPORTED_CHAINS: Record<X402Network, NetworkConfig>;
```

Defined in: [defi/protocols/src/x402/config.ts:225](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/config.ts#L225)

All supported chains (EVM + SVM)

***

### SUPPORTED\_EVM\_CHAINS

```ts
const SUPPORTED_EVM_CHAINS: Record<X402Chain, NetworkConfig> = EVM_CHAINS;
```

Defined in: [defi/protocols/src/x402/config.ts:233](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/config.ts#L233)

Legacy alias for backward compatibility

***

### SVM\_CHAINS

```ts
const SVM_CHAINS: Record<X402SvmChain, NetworkConfig>;
```

Defined in: [defi/protocols/src/x402/config.ts:198](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/config.ts#L198)

Solana (SVM) chain configurations

## Functions

### getCaip2FromChain()

```ts
function getCaip2FromChain(chain: X402Network): string;
```

Defined in: [defi/protocols/src/x402/config.ts:407](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/config.ts#L407)

Get CAIP-2 identifier from chain name

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `chain` | [`X402Network`](/docs/api/defi/protocols/src/x402/config.md#x402network) |

#### Returns

`string`

***

### getChainFromCaip2()

```ts
function getChainFromCaip2(caip2: string): 
  | X402Network
  | undefined;
```

Defined in: [defi/protocols/src/x402/config.ts:414](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/config.ts#L414)

Get chain name from CAIP-2 identifier

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `caip2` | `string` |

#### Returns

  \| [`X402Network`](/docs/api/defi/protocols/src/x402/config.md#x402network)
  \| `undefined`

***

### getChainType()

```ts
function getChainType(network: X402Network): "evm" | "svm";
```

Defined in: [defi/protocols/src/x402/config.ts:400](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/config.ts#L400)

Get chain type from network identifier

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `network` | [`X402Network`](/docs/api/defi/protocols/src/x402/config.md#x402network) |

#### Returns

`"evm"` \| `"svm"`

***

### getTokenConfig()

```ts
function getTokenConfig(chain: X402Network, symbol: string): 
  | TokenConfig
  | undefined;
```

Defined in: [defi/protocols/src/x402/config.ts:426](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/config.ts#L426)

Get token configuration for a specific chain and symbol

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `chain` | [`X402Network`](/docs/api/defi/protocols/src/x402/config.md#x402network) |
| `symbol` | `string` |

#### Returns

  \| [`TokenConfig`](/docs/api/defi/protocols/src/x402/config.md#tokenconfig)
  \| `undefined`

***

### getUsdcAddress()

```ts
function getUsdcAddress(chain: X402Network): string | undefined;
```

Defined in: [defi/protocols/src/x402/config.ts:433](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/config.ts#L433)

Get USDC address for a chain (most common payment token)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `chain` | [`X402Network`](/docs/api/defi/protocols/src/x402/config.md#x402network) |

#### Returns

`string` \| `undefined`

***

### isEvmConfigured()

```ts
function isEvmConfigured(): boolean;
```

Defined in: [defi/protocols/src/x402/config.ts:379](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/config.ts#L379)

Check if EVM payments are configured

#### Returns

`boolean`

***

### isSvmConfigured()

```ts
function isSvmConfigured(): boolean;
```

Defined in: [defi/protocols/src/x402/config.ts:386](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/config.ts#L386)

Check if SVM (Solana) payments are configured

#### Returns

`boolean`

***

### isX402Configured()

```ts
function isX402Configured(): boolean;
```

Defined in: [defi/protocols/src/x402/config.ts:393](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/config.ts#L393)

Check if any x402 payment method is configured

#### Returns

`boolean`

***

### loadLegacyX402Config()

```ts
function loadLegacyX402Config(): LegacyX402Config;
```

Defined in: [defi/protocols/src/x402/config.ts:357](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/config.ts#L357)

Load legacy x402 configuration format (for backward compatibility)

#### Returns

[`LegacyX402Config`](/docs/api/defi/protocols/src/x402/config.md#legacyx402config)

***

### loadX402Config()

```ts
function loadX402Config(): X402Config;
```

Defined in: [defi/protocols/src/x402/config.ts:256](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/config.ts#L256)

Load full x402 configuration from environment variables

Environment Variables:
- X402_EVM_PRIVATE_KEY: EVM wallet private key (hex with 0x prefix)
- X402_SVM_PRIVATE_KEY: Solana wallet private key (base58)
- X402_PRIVATE_KEY: Legacy EVM key (falls back if EVM key not set)
- X402_CHAIN: Default chain (e.g., "base", "solana-mainnet")
- X402_RPC_URL: Custom RPC URL for default chain
- X402_ENABLE_GASLESS: Enable gasless payments (default: true)
- X402_FACILITATOR_URL: Custom facilitator URL
- X402_MAX_PAYMENT: Maximum payment per request in USD (default: 1.00)
- X402_MAINNET_ENABLED: Explicitly enable mainnet chains (default: false)
- X402_TESTNET_ONLY: Force testnet-only mode (default: true unless mainnet enabled)
- X402_REQUIRE_APPROVAL_ABOVE: Threshold for requiring approval (default: 0.50)
- X402_DEBUG: Enable debug logging

#### Returns

[`X402Config`](/docs/api/defi/protocols/src/x402/config.md#x402config)

***

### validateX402Config()

```ts
function validateX402Config(config: X402Config): {
  errors: string[];
  valid: boolean;
  warnings: string[];
};
```

Defined in: [defi/protocols/src/x402/config.ts:440](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/config.ts#L440)

Validate x402 configuration

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `config` | [`X402Config`](/docs/api/defi/protocols/src/x402/config.md#x402config) |

#### Returns

```ts
{
  errors: string[];
  valid: boolean;
  warnings: string[];
}
```

| Name | Type | Defined in |
| :------ | :------ | :------ |
| `errors` | `string`[] | [defi/protocols/src/x402/config.ts:440](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/config.ts#L440) |
| `valid` | `boolean` | [defi/protocols/src/x402/config.ts:440](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/config.ts#L440) |
| `warnings` | `string`[] | [defi/protocols/src/x402/config.ts:440](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/config.ts#L440) |
