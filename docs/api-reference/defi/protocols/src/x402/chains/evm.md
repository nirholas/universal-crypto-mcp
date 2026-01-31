[**Universal Crypto MCP API Reference v1.0.0**](../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/x402/chains/evm

# defi/protocols/src/x402/chains/evm

## Variables

### ARBITRUM\_ONE

```ts
const ARBITRUM_ONE: ChainConfig;
```

Defined in: [defi/protocols/src/x402/chains/evm.ts:141](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/evm.ts#L141)

Arbitrum One - L2 with wide DeFi support

***

### ARBITRUM\_SEPOLIA

```ts
const ARBITRUM_SEPOLIA: ChainConfig;
```

Defined in: [defi/protocols/src/x402/chains/evm.ts:146](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/evm.ts#L146)

Arbitrum Sepolia - Testnet

***

### BASE\_MAINNET

```ts
const BASE_MAINNET: ChainConfig;
```

Defined in: [defi/protocols/src/x402/chains/evm.ts:120](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/evm.ts#L120)

Base Mainnet - PRIMARY chain for x402 payments
Fast, low-cost L2 built by Coinbase

***

### BASE\_SEPOLIA

```ts
const BASE_SEPOLIA: ChainConfig;
```

Defined in: [defi/protocols/src/x402/chains/evm.ts:127](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/evm.ts#L127)

Base Sepolia - Testnet for development

***

### BRIDGED\_USDC\_ADDRESSES

```ts
const BRIDGED_USDC_ADDRESSES: Record<number, Address>;
```

Defined in: [defi/protocols/src/x402/chains/evm.ts:48](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/evm.ts#L48)

Bridged USDC addresses (USDC.e) where native USDC also exists
These are the older bridged versions, prefer native USDC when available

***

### BSC\_MAINNET

```ts
const BSC_MAINNET: ChainConfig;
```

Defined in: [defi/protocols/src/x402/chains/evm.ts:163](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/evm.ts#L163)

BNB Smart Chain - EVM-compatible L1

***

### ETHEREUM\_MAINNET

```ts
const ETHEREUM_MAINNET: ChainConfig;
```

Defined in: [defi/protocols/src/x402/chains/evm.ts:136](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/evm.ts#L136)

Ethereum Mainnet
Higher gas costs, but maximum security and liquidity

***

### EVM\_CHAINS

```ts
const EVM_CHAINS: Record<string, ChainConfig>;
```

Defined in: [defi/protocols/src/x402/chains/evm.ts:172](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/evm.ts#L172)

All supported EVM chains indexed by CAIP-2 identifier

***

### EVM\_CHAINS\_BY\_ID

```ts
const EVM_CHAINS_BY_ID: Record<number, ChainConfig>;
```

Defined in: [defi/protocols/src/x402/chains/evm.ts:189](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/evm.ts#L189)

EVM chains indexed by chain ID

***

### OPTIMISM\_MAINNET

```ts
const OPTIMISM_MAINNET: ChainConfig;
```

Defined in: [defi/protocols/src/x402/chains/evm.ts:158](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/evm.ts#L158)

Optimism - OP Stack L2

***

### POLYGON\_MAINNET

```ts
const POLYGON_MAINNET: ChainConfig;
```

Defined in: [defi/protocols/src/x402/chains/evm.ts:153](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/evm.ts#L153)

Polygon PoS - Low-cost L2 with wide adoption

***

### USDC\_ADDRESSES

```ts
const USDC_ADDRESSES: Record<number, Address>;
```

Defined in: [defi/protocols/src/x402/chains/evm.ts:30](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/evm.ts#L30)

Official USDC contract addresses on supported EVM chains

#### See

https://developers.circle.com/stablecoins/docs/usdc-on-main-networks

## Functions

### getDefaultEvmChain()

```ts
function getDefaultEvmChain(): ChainConfig;
```

Defined in: [defi/protocols/src/x402/chains/evm.ts:238](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/evm.ts#L238)

Get the default/primary EVM chain (Base)

#### Returns

[`ChainConfig`](/docs/api/defi/protocols/src/x402/chains/types.md#chainconfig)

***

### getEvmChainByCAIP2()

```ts
function getEvmChainByCAIP2(caip2: string): 
  | ChainConfig
  | undefined;
```

Defined in: [defi/protocols/src/x402/chains/evm.ts:210](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/evm.ts#L210)

Get EVM chain config by CAIP-2 identifier

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `caip2` | `string` |

#### Returns

  \| [`ChainConfig`](/docs/api/defi/protocols/src/x402/chains/types.md#chainconfig)
  \| `undefined`

***

### getEvmChainById()

```ts
function getEvmChainById(chainId: number): 
  | ChainConfig
  | undefined;
```

Defined in: [defi/protocols/src/x402/chains/evm.ts:203](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/evm.ts#L203)

Get EVM chain config by chain ID

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `chainId` | `number` |

#### Returns

  \| [`ChainConfig`](/docs/api/defi/protocols/src/x402/chains/types.md#chainconfig)
  \| `undefined`

***

### getEvmMainnets()

```ts
function getEvmMainnets(): ChainConfig[];
```

Defined in: [defi/protocols/src/x402/chains/evm.ts:224](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/evm.ts#L224)

List all mainnet EVM chains

#### Returns

[`ChainConfig`](/docs/api/defi/protocols/src/x402/chains/types.md#chainconfig)[]

***

### getEvmTestnets()

```ts
function getEvmTestnets(): ChainConfig[];
```

Defined in: [defi/protocols/src/x402/chains/evm.ts:231](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/evm.ts#L231)

List all testnet EVM chains

#### Returns

[`ChainConfig`](/docs/api/defi/protocols/src/x402/chains/types.md#chainconfig)[]

***

### isEvmAddress()

```ts
function isEvmAddress(address: string): boolean;
```

Defined in: [defi/protocols/src/x402/chains/evm.ts:217](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/evm.ts#L217)

Check if an address looks like a valid EVM address

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `address` | `string` |

#### Returns

`boolean`
