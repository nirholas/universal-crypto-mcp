[**Universal Crypto MCP API Reference v1.0.0**](../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/x402/chains

# defi/protocols/src/x402/chains

## Variables

### SUPPORTED\_CHAINS

```ts
const SUPPORTED_CHAINS: Record<string, ChainConfig>;
```

Defined in: [defi/protocols/src/x402/chains/index.ts:28](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/index.ts#L28)

All supported chains indexed by CAIP-2 identifier

## Functions

### detectChainFromAddress()

```ts
function detectChainFromAddress(address: string): 
  | ChainConfig
  | null;
```

Defined in: [defi/protocols/src/x402/chains/index.ts:128](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/index.ts#L128)

Detect chain from an address format

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `address` | `string` | The address to analyze |

#### Returns

  \| [`ChainConfig`](/docs/api/defi/protocols/src/x402/chains/types.md#chainconfig)
  \| `null`

Best-guess ChainConfig based on address format, or null if unknown

#### Example

```typescript
detectChainFromAddress("0x1234...") // Returns Base (default EVM)
detectChainFromAddress("Gh9Zw...")  // Returns Solana mainnet
```

***

### formatChainInfo()

```ts
function formatChainInfo(chain: ChainConfig): string;
```

Defined in: [defi/protocols/src/x402/chains/index.ts:219](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/index.ts#L219)

Format chain info for display

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `chain` | [`ChainConfig`](/docs/api/defi/protocols/src/x402/chains/types.md#chainconfig) |

#### Returns

`string`

***

### getAllChains()

```ts
function getAllChains(): ChainConfig[];
```

Defined in: [defi/protocols/src/x402/chains/index.ts:146](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/index.ts#L146)

Get all supported chains

#### Returns

[`ChainConfig`](/docs/api/defi/protocols/src/x402/chains/types.md#chainconfig)[]

***

### getChainConfig()

```ts
function getChainConfig(caip2OrChainId: string | number): 
  | ChainConfig
  | undefined;
```

Defined in: [defi/protocols/src/x402/chains/index.ts:62](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/index.ts#L62)

Get chain configuration by CAIP-2 identifier or chain ID

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `caip2OrChainId` | `string` \| `number` | CAIP-2 string (e.g., "eip155:8453") or EVM chain ID number |

#### Returns

  \| [`ChainConfig`](/docs/api/defi/protocols/src/x402/chains/types.md#chainconfig)
  \| `undefined`

ChainConfig or undefined if not found

#### Example

```typescript
// By CAIP-2
getChainConfig("eip155:8453")         // Base
getChainConfig("solana:5eykt...")     // Solana mainnet

// By chain ID (EVM only)
getChainConfig(8453)                  // Base
getChainConfig(1)                     // Ethereum

// By name (convenience)
getChainConfig("base")                // Base (if supported)
```

***

### getChainType()

```ts
function getChainType(caip2: string): ChainType;
```

Defined in: [defi/protocols/src/x402/chains/index.ts:36](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/index.ts#L36)

Get the chain type from a CAIP-2 identifier

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `caip2` | `string` |

#### Returns

[`ChainType`](/docs/api/defi/protocols/src/x402/chains/types.md#chaintype)

***

### getDefaultChain()

```ts
function getDefaultChain(): ChainConfig;
```

Defined in: [defi/protocols/src/x402/chains/index.ts:181](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/index.ts#L181)

Get the default chain for payments (Base mainnet)

#### Returns

[`ChainConfig`](/docs/api/defi/protocols/src/x402/chains/types.md#chainconfig)

***

### getEvmChains()

```ts
function getEvmChains(): ChainConfig[];
```

Defined in: [defi/protocols/src/x402/chains/index.ts:167](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/index.ts#L167)

Get all EVM chains

#### Returns

[`ChainConfig`](/docs/api/defi/protocols/src/x402/chains/types.md#chainconfig)[]

***

### getExplorerAddressUrl()

```ts
function getExplorerAddressUrl(chain: ChainConfig, address: string): string;
```

Defined in: [defi/protocols/src/x402/chains/index.ts:207](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/index.ts#L207)

Get explorer URL for an address

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `chain` | [`ChainConfig`](/docs/api/defi/protocols/src/x402/chains/types.md#chainconfig) |
| `address` | `string` |

#### Returns

`string`

***

### getExplorerTxUrl()

```ts
function getExplorerTxUrl(chain: ChainConfig, txHash: string): string;
```

Defined in: [defi/protocols/src/x402/chains/index.ts:195](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/index.ts#L195)

Get explorer URL for a transaction

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `chain` | [`ChainConfig`](/docs/api/defi/protocols/src/x402/chains/types.md#chainconfig) |
| `txHash` | `string` |

#### Returns

`string`

***

### getMainnetChains()

```ts
function getMainnetChains(): ChainConfig[];
```

Defined in: [defi/protocols/src/x402/chains/index.ts:153](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/index.ts#L153)

Get all mainnet chains

#### Returns

[`ChainConfig`](/docs/api/defi/protocols/src/x402/chains/types.md#chainconfig)[]

***

### getSolanaChains()

```ts
function getSolanaChains(): ChainConfig[];
```

Defined in: [defi/protocols/src/x402/chains/index.ts:174](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/index.ts#L174)

Get all Solana chains

#### Returns

[`ChainConfig`](/docs/api/defi/protocols/src/x402/chains/types.md#chainconfig)[]

***

### getTestnetChains()

```ts
function getTestnetChains(): ChainConfig[];
```

Defined in: [defi/protocols/src/x402/chains/index.ts:160](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/index.ts#L160)

Get all testnet chains

#### Returns

[`ChainConfig`](/docs/api/defi/protocols/src/x402/chains/types.md#chainconfig)[]

***

### isChainSupported()

```ts
function isChainSupported(caip2OrChainId: string | number): boolean;
```

Defined in: [defi/protocols/src/x402/chains/index.ts:188](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/index.ts#L188)

Validate that a chain is supported

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `caip2OrChainId` | `string` \| `number` |

#### Returns

`boolean`

***

### listSupportedChains()

```ts
function listSupportedChains(): string;
```

Defined in: [defi/protocols/src/x402/chains/index.ts:228](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/index.ts#L228)

List all supported chains in a formatted way

#### Returns

`string`

## References

### ARBITRUM\_ONE

Re-exports [ARBITRUM_ONE](/docs/api/defi/protocols/src/x402/chains/evm.md#arbitrum_one)

***

### ARBITRUM\_SEPOLIA

Re-exports [ARBITRUM_SEPOLIA](/docs/api/defi/protocols/src/x402/chains/evm.md#arbitrum_sepolia)

***

### BASE\_MAINNET

Re-exports [BASE_MAINNET](/docs/api/defi/protocols/src/x402/chains/evm.md#base_mainnet)

***

### BASE\_SEPOLIA

Re-exports [BASE_SEPOLIA](/docs/api/defi/protocols/src/x402/chains/evm.md#base_sepolia)

***

### BRIDGED\_USDC\_ADDRESSES

Re-exports [BRIDGED_USDC_ADDRESSES](/docs/api/defi/protocols/src/x402/chains/evm.md#bridged_usdc_addresses)

***

### BSC\_MAINNET

Re-exports [BSC_MAINNET](/docs/api/defi/protocols/src/x402/chains/evm.md#bsc_mainnet)

***

### CAIP2Identifier

Re-exports [CAIP2Identifier](/docs/api/defi/protocols/src/x402/chains/caip.md#caip2identifier)

***

### caip2ToEvmChainId

Re-exports [caip2ToEvmChainId](/docs/api/defi/protocols/src/x402/chains/caip.md#caip2toevmchainid)

***

### CHAIN\_NAMESPACES

Re-exports [CHAIN_NAMESPACES](/docs/api/defi/protocols/src/x402/chains/caip.md#chain_namespaces)

***

### ChainConfig

Re-exports [ChainConfig](/docs/api/defi/protocols/src/x402/chains/types.md#chainconfig)

***

### ChainNamespace

Re-exports [ChainNamespace](/docs/api/defi/protocols/src/x402/chains/caip.md#chainnamespace)

***

### ChainType

Re-exports [ChainType](/docs/api/defi/protocols/src/x402/chains/types.md#chaintype)

***

### ETHEREUM\_MAINNET

Re-exports [ETHEREUM_MAINNET](/docs/api/defi/protocols/src/x402/chains/evm.md#ethereum_mainnet)

***

### EVM\_CHAINS

Re-exports [EVM_CHAINS](/docs/api/defi/protocols/src/x402/chains/evm.md#evm_chains)

***

### EVM\_CHAINS\_BY\_ID

Re-exports [EVM_CHAINS_BY_ID](/docs/api/defi/protocols/src/x402/chains/evm.md#evm_chains_by_id)

***

### evmChainIdToCAIP2

Re-exports [evmChainIdToCAIP2](/docs/api/defi/protocols/src/x402/chains/caip.md#evmchainidtocaip2)

***

### generateCAIP2

Re-exports [generateCAIP2](/docs/api/defi/protocols/src/x402/chains/caip.md#generatecaip2)

***

### getDefaultEvmChain

Re-exports [getDefaultEvmChain](/docs/api/defi/protocols/src/x402/chains/evm.md#getdefaultevmchain)

***

### getDefaultSolanaChain

Re-exports [getDefaultSolanaChain](/docs/api/defi/protocols/src/x402/chains/solana.md#getdefaultsolanachain)

***

### getEvmChainByCAIP2

Re-exports [getEvmChainByCAIP2](/docs/api/defi/protocols/src/x402/chains/evm.md#getevmchainbycaip2)

***

### getEvmChainById

Re-exports [getEvmChainById](/docs/api/defi/protocols/src/x402/chains/evm.md#getevmchainbyid)

***

### getEvmMainnets

Re-exports [getEvmMainnets](/docs/api/defi/protocols/src/x402/chains/evm.md#getevmmainnets)

***

### getEvmTestnets

Re-exports [getEvmTestnets](/docs/api/defi/protocols/src/x402/chains/evm.md#getevmtestnets)

***

### getNamespaceName

Re-exports [getNamespaceName](/docs/api/defi/protocols/src/x402/chains/caip.md#getnamespacename)

***

### getSolanaChainByCAIP2

Re-exports [getSolanaChainByCAIP2](/docs/api/defi/protocols/src/x402/chains/solana.md#getsolanachainbycaip2)

***

### getSolanaChainByCluster

Re-exports [getSolanaChainByCluster](/docs/api/defi/protocols/src/x402/chains/solana.md#getsolanachainbycluster)

***

### getSolanaCluster

Re-exports [getSolanaCluster](/docs/api/defi/protocols/src/x402/chains/caip.md#getsolanacluster)

***

### getSolanaExplorerAccountUrl

Re-exports [getSolanaExplorerAccountUrl](/docs/api/defi/protocols/src/x402/chains/solana.md#getsolanaexploreraccounturl)

***

### getSolanaExplorerTxUrl

Re-exports [getSolanaExplorerTxUrl](/docs/api/defi/protocols/src/x402/chains/solana.md#getsolanaexplorertxurl)

***

### getSolanaMainnets

Re-exports [getSolanaMainnets](/docs/api/defi/protocols/src/x402/chains/solana.md#getsolanamainnets)

***

### getSolanaTestnets

Re-exports [getSolanaTestnets](/docs/api/defi/protocols/src/x402/chains/solana.md#getsolanatestnets)

***

### isEvmAddress

Re-exports [isEvmAddress](/docs/api/defi/protocols/src/x402/chains/evm.md#isevmaddress)

***

### isEvmChain

Re-exports [isEvmChain](/docs/api/defi/protocols/src/x402/chains/caip.md#isevmchain)

***

### isSolanaAddress

Re-exports [isSolanaAddress](/docs/api/defi/protocols/src/x402/chains/solana.md#issolanaaddress)

***

### isSolanaChain

Re-exports [isSolanaChain](/docs/api/defi/protocols/src/x402/chains/caip.md#issolanachain)

***

### isValidCAIP2

Re-exports [isValidCAIP2](/docs/api/defi/protocols/src/x402/chains/caip.md#isvalidcaip2)

***

### NativeCurrencyConfig

Re-exports [NativeCurrencyConfig](/docs/api/defi/protocols/src/x402/chains/types.md#nativecurrencyconfig)

***

### OPTIMISM\_MAINNET

Re-exports [OPTIMISM_MAINNET](/docs/api/defi/protocols/src/x402/chains/evm.md#optimism_mainnet)

***

### parseCAIP2

Re-exports [parseCAIP2](/docs/api/defi/protocols/src/x402/chains/caip.md#parsecaip2)

***

### PaymentTokenConfig

Re-exports [PaymentTokenConfig](/docs/api/defi/protocols/src/x402/chains/types.md#paymenttokenconfig)

***

### POLYGON\_MAINNET

Re-exports [POLYGON_MAINNET](/docs/api/defi/protocols/src/x402/chains/evm.md#polygon_mainnet)

***

### SOLANA\_CHAINS

Re-exports [SOLANA_CHAINS](/docs/api/defi/protocols/src/x402/chains/solana.md#solana_chains)

***

### SOLANA\_CHAINS\_BY\_CLUSTER

Re-exports [SOLANA_CHAINS_BY_CLUSTER](/docs/api/defi/protocols/src/x402/chains/solana.md#solana_chains_by_cluster)

***

### SOLANA\_DEVNET

Re-exports [SOLANA_DEVNET](/docs/api/defi/protocols/src/x402/chains/solana.md#solana_devnet)

***

### SOLANA\_GENESIS\_HASHES

Re-exports [SOLANA_GENESIS_HASHES](/docs/api/defi/protocols/src/x402/chains/caip.md#solana_genesis_hashes)

***

### SOLANA\_MAINNET

Re-exports [SOLANA_MAINNET](/docs/api/defi/protocols/src/x402/chains/solana.md#solana_mainnet)

***

### SOLANA\_PROGRAMS

Re-exports [SOLANA_PROGRAMS](/docs/api/defi/protocols/src/x402/chains/solana.md#solana_programs)

***

### SOLANA\_TESTNET

Re-exports [SOLANA_TESTNET](/docs/api/defi/protocols/src/x402/chains/solana.md#solana_testnet)

***

### SOLANA\_USDC\_ADDRESSES

Re-exports [SOLANA_USDC_ADDRESSES](/docs/api/defi/protocols/src/x402/chains/solana.md#solana_usdc_addresses)

***

### solanaClusterToCAIP2

Re-exports [solanaClusterToCAIP2](/docs/api/defi/protocols/src/x402/chains/caip.md#solanaclustertocaip2)

***

### USDC\_ADDRESSES

Re-exports [USDC_ADDRESSES](/docs/api/defi/protocols/src/x402/chains/evm.md#usdc_addresses)
