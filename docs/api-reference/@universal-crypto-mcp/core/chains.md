[**Universal Crypto MCP API Reference v1.0.0**](../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / @universal-crypto-mcp/core/chains

# @universal-crypto-mcp/core/chains

Chain configurations for Universal Crypto MCP

This module provides comprehensive chain configuration for all supported
EVM-compatible networks. It uses CAIP-2 identifiers for chain addressing
and integrates with viem for chain definitions.

## Example

```typescript
import { getChain, getChainName, getTxExplorerUrl } from '@universal-crypto-mcp/core';

const base = getChain('eip155:8453');
console.log(getChainName('eip155:8453')); // "Base"

const txUrl = getTxExplorerUrl('eip155:1', '0x1234...');
console.log(txUrl); // "https://etherscan.io/tx/0x1234..."
```

## Type Aliases

### SupportedChainId

```ts
type SupportedChainId = keyof typeof SUPPORTED_CHAINS;
```

Defined in: [core/src/chains.ts:40](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/core/src/chains.ts#L40)

## Variables

### CHAIN\_NAMES

```ts
const CHAIN_NAMES: Record<SupportedChainId, string>;
```

Defined in: [core/src/chains.ts:82](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/core/src/chains.ts#L82)

***

### DEFAULT\_RPC\_URLS

```ts
const DEFAULT_RPC_URLS: Record<SupportedChainId, string>;
```

Defined in: [core/src/chains.ts:103](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/core/src/chains.ts#L103)

***

### EXPLORER\_URLS

```ts
const EXPLORER_URLS: Record<SupportedChainId, string>;
```

Defined in: [core/src/chains.ts:124](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/core/src/chains.ts#L124)

***

### SUPPORTED\_CHAINS

```ts
const SUPPORTED_CHAINS: {
  eip155:1: {
  };
  eip155:10: {
  };
  eip155:137: {
  };
  eip155:42161: {
  };
  eip155:56: {
  };
  eip155:8453: {
  };
  eip155:84532: {
  };
};
```

Defined in: [core/src/chains.ts:30](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/core/src/chains.ts#L30)

#### Type Declaration

| Name | Type | Default value | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="eip1551"></a> `eip155:1` | \{ \} | `mainnet` | [core/src/chains.ts:31](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/core/src/chains.ts#L31) |
| <a id="eip15510"></a> `eip155:10` | \{ \} | `optimism` | [core/src/chains.ts:36](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/core/src/chains.ts#L36) |
| <a id="eip155137"></a> `eip155:137` | \{ \} | `polygon` | [core/src/chains.ts:35](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/core/src/chains.ts#L35) |
| <a id="eip15542161"></a> `eip155:42161` | \{ \} | `arbitrum` | [core/src/chains.ts:32](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/core/src/chains.ts#L32) |
| <a id="eip15556"></a> `eip155:56` | \{ \} | `bsc` | [core/src/chains.ts:37](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/core/src/chains.ts#L37) |
| <a id="eip1558453"></a> `eip155:8453` | \{ \} | `base` | [core/src/chains.ts:33](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/core/src/chains.ts#L33) |
| <a id="eip15584532"></a> `eip155:84532` | \{ \} | `baseSepolia` | [core/src/chains.ts:34](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/core/src/chains.ts#L34) |

## Functions

### getAddressExplorerUrl()

```ts
function getAddressExplorerUrl(caip2Id: string, address: string): string | undefined;
```

Defined in: [core/src/chains.ts:152](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/core/src/chains.ts#L152)

Gets an address URL on the block explorer

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `caip2Id` | `string` |
| `address` | `string` |

#### Returns

`string` \| `undefined`

***

### getCaip2Id()

```ts
function getCaip2Id(chainId: number): string | undefined;
```

Defined in: [core/src/chains.ts:64](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/core/src/chains.ts#L64)

Gets the CAIP-2 identifier from a numeric chain ID

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `chainId` | `number` |

#### Returns

`string` \| `undefined`

***

### getChain()

```ts
function getChain(caip2Id: string): 
  | {
}
  | {
}
  | {
}
  | {
}
  | {
}
  | {
}
  | {
};
```

Defined in: [core/src/chains.ts:49](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/core/src/chains.ts#L49)

Gets a chain by its CAIP-2 identifier

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `caip2Id` | `string` |

#### Returns

  \| \{
\}
  \| \{
\}
  \| \{
\}
  \| \{
\}
  \| \{
\}
  \| \{
\}
  \| \{
\}

***

### getChainId()

```ts
function getChainId(caip2Id: string): number;
```

Defined in: [core/src/chains.ts:56](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/core/src/chains.ts#L56)

Gets the numeric chain ID from a CAIP-2 identifier

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `caip2Id` | `string` |

#### Returns

`number`

***

### getChainName()

```ts
function getChainName(caip2Id: string): string;
```

Defined in: [core/src/chains.ts:95](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/core/src/chains.ts#L95)

Gets the human-readable name for a chain

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `caip2Id` | `string` |

#### Returns

`string`

***

### getDefaultRpcUrl()

```ts
function getDefaultRpcUrl(caip2Id: string): string | undefined;
```

Defined in: [core/src/chains.ts:116](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/core/src/chains.ts#L116)

Gets the default RPC URL for a chain

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `caip2Id` | `string` |

#### Returns

`string` \| `undefined`

***

### getExplorerUrl()

```ts
function getExplorerUrl(caip2Id: string): string | undefined;
```

Defined in: [core/src/chains.ts:137](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/core/src/chains.ts#L137)

Gets the block explorer URL for a chain

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `caip2Id` | `string` |

#### Returns

`string` \| `undefined`

***

### getMainnetChains()

```ts
function getMainnetChains(): (
  | "eip155:1"
  | "eip155:42161"
  | "eip155:8453"
  | "eip155:84532"
  | "eip155:137"
  | "eip155:10"
  | "eip155:56")[];
```

Defined in: [core/src/chains.ts:171](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/core/src/chains.ts#L171)

Gets all mainnet chains (excludes testnets)

#### Returns

(
  \| `"eip155:1"`
  \| `"eip155:42161"`
  \| `"eip155:8453"`
  \| `"eip155:84532"`
  \| `"eip155:137"`
  \| `"eip155:10"`
  \| `"eip155:56"`)[]

***

### getSupportedChainIds()

```ts
function getSupportedChainIds(): (
  | "eip155:1"
  | "eip155:42161"
  | "eip155:8453"
  | "eip155:84532"
  | "eip155:137"
  | "eip155:10"
  | "eip155:56")[];
```

Defined in: [core/src/chains.ts:164](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/core/src/chains.ts#L164)

Gets all supported chain IDs

#### Returns

(
  \| `"eip155:1"`
  \| `"eip155:42161"`
  \| `"eip155:8453"`
  \| `"eip155:84532"`
  \| `"eip155:137"`
  \| `"eip155:10"`
  \| `"eip155:56"`)[]

***

### getTestnetChains()

```ts
function getTestnetChains(): (
  | "eip155:1"
  | "eip155:42161"
  | "eip155:8453"
  | "eip155:84532"
  | "eip155:137"
  | "eip155:10"
  | "eip155:56")[];
```

Defined in: [core/src/chains.ts:178](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/core/src/chains.ts#L178)

Gets all testnet chains

#### Returns

(
  \| `"eip155:1"`
  \| `"eip155:42161"`
  \| `"eip155:8453"`
  \| `"eip155:84532"`
  \| `"eip155:137"`
  \| `"eip155:10"`
  \| `"eip155:56"`)[]

***

### getTxExplorerUrl()

```ts
function getTxExplorerUrl(caip2Id: string, txHash: string): string | undefined;
```

Defined in: [core/src/chains.ts:144](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/core/src/chains.ts#L144)

Gets a transaction URL on the block explorer

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `caip2Id` | `string` |
| `txHash` | `string` |

#### Returns

`string` \| `undefined`

***

### isChainSupported()

```ts
function isChainSupported(caip2Id: string): boolean;
```

Defined in: [core/src/chains.ts:74](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/core/src/chains.ts#L74)

Checks if a chain is supported

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `caip2Id` | `string` |

#### Returns

`boolean`

