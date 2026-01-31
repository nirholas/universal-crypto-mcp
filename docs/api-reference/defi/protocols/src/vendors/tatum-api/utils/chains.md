[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/tatum-api/utils/chains

# defi/protocols/src/vendors/tatum-api/utils/chains

## Interfaces

### ChainApiConfig

Defined in: [defi/protocols/src/vendors/tatum-api/utils/chains.ts:11](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/tatum-api/utils/chains.ts#L11)

Chain protocol mapping utility

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="basepathprefix"></a> `basePathPrefix?` | `string` | [defi/protocols/src/vendors/tatum-api/utils/chains.ts:12](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/tatum-api/utils/chains.ts#L12) |
| <a id="defaultendpoints"></a> `defaultEndpoints?` | `string`[] | [defi/protocols/src/vendors/tatum-api/utils/chains.ts:13](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/tatum-api/utils/chains.ts#L13) |
| <a id="errorhandling"></a> `errorHandling?` | `"strict"` \| `"lenient"` | [defi/protocols/src/vendors/tatum-api/utils/chains.ts:14](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/tatum-api/utils/chains.ts#L14) |
| <a id="responseformat"></a> `responseFormat?` | `"text"` \| `"json"` \| `"binary"` | [defi/protocols/src/vendors/tatum-api/utils/chains.ts:15](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/tatum-api/utils/chains.ts#L15) |

## Variables

### chainApiConfigs

```ts
const chainApiConfigs: Record<string, ChainApiConfig>;
```

Defined in: [defi/protocols/src/vendors/tatum-api/utils/chains.ts:82](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/tatum-api/utils/chains.ts#L82)

Chain-specific API configurations

***

### chainProtocolMap

```ts
const chainProtocolMap: Record<string, "rest" | "jsonrpc">;
```

Defined in: [defi/protocols/src/vendors/tatum-api/utils/chains.ts:18](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/tatum-api/utils/chains.ts#L18)

## Functions

### getChainApiConfig()

```ts
function getChainApiConfig(chainName: string): ChainApiConfig;
```

Defined in: [defi/protocols/src/vendors/tatum-api/utils/chains.ts:152](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/tatum-api/utils/chains.ts#L152)

Get API configuration for a specific chain

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `chainName` | `string` |

#### Returns

[`ChainApiConfig`](/docs/api/defi/protocols/src/vendors/tatum-api/utils/chains.md#chainapiconfig)

***

### getChainProtocol()

```ts
function getChainProtocol(chainName: string): "rest" | "jsonrpc" | undefined;
```

Defined in: [defi/protocols/src/vendors/tatum-api/utils/chains.ts:124](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/tatum-api/utils/chains.ts#L124)

Get the protocol type for a given chain

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `chainName` | `string` |

#### Returns

`"rest"` \| `"jsonrpc"` \| `undefined`

***

### getChainsByProtocol()

```ts
function getChainsByProtocol(protocol: "rest" | "jsonrpc"): string[];
```

Defined in: [defi/protocols/src/vendors/tatum-api/utils/chains.ts:162](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/tatum-api/utils/chains.ts#L162)

Get chains by protocol type

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `protocol` | `"rest"` \| `"jsonrpc"` |

#### Returns

`string`[]

***

### getSupportedChains()

```ts
function getSupportedChains(): string[];
```

Defined in: [defi/protocols/src/vendors/tatum-api/utils/chains.ts:145](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/tatum-api/utils/chains.ts#L145)

Get all supported chain names

#### Returns

`string`[]

***

### isJsonRpcChain()

```ts
function isJsonRpcChain(chainName: string): boolean;
```

Defined in: [defi/protocols/src/vendors/tatum-api/utils/chains.ts:138](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/tatum-api/utils/chains.ts#L138)

Check if a chain uses JSON-RPC protocol

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `chainName` | `string` |

#### Returns

`boolean`

***

### isRestChain()

```ts
function isRestChain(chainName: string): boolean;
```

Defined in: [defi/protocols/src/vendors/tatum-api/utils/chains.ts:131](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/tatum-api/utils/chains.ts#L131)

Check if a chain uses REST protocol

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `chainName` | `string` |

#### Returns

`boolean`
