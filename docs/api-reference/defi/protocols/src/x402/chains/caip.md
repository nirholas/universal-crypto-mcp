[**Universal Crypto MCP API Reference v1.0.0**](../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/x402/chains/caip

# defi/protocols/src/x402/chains/caip

## Interfaces

### CAIP2Identifier

Defined in: [defi/protocols/src/x402/chains/caip.ts:12](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/caip.ts#L12)

Parsed CAIP-2 identifier components

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="full"></a> `full` | `string` | Original full identifier string | [defi/protocols/src/x402/chains/caip.ts:18](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/caip.ts#L18) |
| <a id="namespace"></a> `namespace` | `string` | Namespace (e.g., "eip155" for EVM, "solana" for Solana) | [defi/protocols/src/x402/chains/caip.ts:14](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/caip.ts#L14) |
| <a id="reference"></a> `reference` | `string` | Reference (chain-specific identifier, e.g., "8453" for Base) | [defi/protocols/src/x402/chains/caip.ts:16](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/caip.ts#L16) |

## Type Aliases

### ChainNamespace

```ts
type ChainNamespace = typeof CHAIN_NAMESPACES[keyof typeof CHAIN_NAMESPACES];
```

Defined in: [defi/protocols/src/x402/chains/caip.ts:32](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/caip.ts#L32)

## Variables

### CHAIN\_NAMESPACES

```ts
const CHAIN_NAMESPACES: {
  BITCOIN: "bip122";
  COSMOS: "cosmos";
  EVM: "eip155";
  POLKADOT: "polkadot";
  SOLANA: "solana";
};
```

Defined in: [defi/protocols/src/x402/chains/caip.ts:24](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/caip.ts#L24)

Chain namespace constants

#### Type Declaration

| Name | Type | Default value | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="bitcoin"></a> `BITCOIN` | `"bip122"` | `'bip122'` | [defi/protocols/src/x402/chains/caip.ts:28](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/caip.ts#L28) |
| <a id="cosmos"></a> `COSMOS` | `"cosmos"` | `'cosmos'` | [defi/protocols/src/x402/chains/caip.ts:27](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/caip.ts#L27) |
| <a id="evm"></a> `EVM` | `"eip155"` | `'eip155'` | [defi/protocols/src/x402/chains/caip.ts:25](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/caip.ts#L25) |
| <a id="polkadot"></a> `POLKADOT` | `"polkadot"` | `'polkadot'` | [defi/protocols/src/x402/chains/caip.ts:29](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/caip.ts#L29) |
| <a id="solana"></a> `SOLANA` | `"solana"` | `'solana'` | [defi/protocols/src/x402/chains/caip.ts:26](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/caip.ts#L26) |

***

### SOLANA\_GENESIS\_HASHES

```ts
const SOLANA_GENESIS_HASHES: {
  DEVNET: "EtWTRABZaYq6iMfeYKouRu166VU2xqa1";
  MAINNET: "5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp";
  TESTNET: "4uhcVJyU9pJkvQyS88uRDiswHXSCkY3z";
};
```

Defined in: [defi/protocols/src/x402/chains/caip.ts:37](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/caip.ts#L37)

Well-known Solana cluster genesis hashes (used as CAIP-2 references)

#### Type Declaration

| Name | Type | Default value | Description | Defined in |
| :------ | :------ | :------ | :------ | :------ |
| <a id="devnet"></a> `DEVNET` | `"EtWTRABZaYq6iMfeYKouRu166VU2xqa1"` | `'EtWTRABZaYq6iMfeYKouRu166VU2xqa1'` | Solana Devnet | [defi/protocols/src/x402/chains/caip.ts:41](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/caip.ts#L41) |
| <a id="mainnet"></a> `MAINNET` | `"5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp"` | `'5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp'` | Solana Mainnet Beta | [defi/protocols/src/x402/chains/caip.ts:39](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/caip.ts#L39) |
| <a id="testnet"></a> `TESTNET` | `"4uhcVJyU9pJkvQyS88uRDiswHXSCkY3z"` | `'4uhcVJyU9pJkvQyS88uRDiswHXSCkY3z'` | Solana Testnet | [defi/protocols/src/x402/chains/caip.ts:43](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/caip.ts#L43) |

## Functions

### caip2ToEvmChainId()

```ts
function caip2ToEvmChainId(caip2: string): number | null;
```

Defined in: [defi/protocols/src/x402/chains/caip.ts:136](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/caip.ts#L136)

Extract EVM chain ID from CAIP-2 identifier

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `caip2` | `string` | The CAIP-2 identifier |

#### Returns

`number` \| `null`

Chain ID number or null if not an EVM chain

#### Example

```typescript
caip2ToEvmChainId("eip155:8453")  // 8453
caip2ToEvmChainId("solana:...")   // null
```

***

### evmChainIdToCAIP2()

```ts
function evmChainIdToCAIP2(chainId: number): string;
```

Defined in: [defi/protocols/src/x402/chains/caip.ts:120](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/caip.ts#L120)

Generate CAIP-2 identifier for an EVM chain

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `chainId` | `number` | The EVM chain ID |

#### Returns

`string`

CAIP-2 identifier (e.g., "eip155:8453")

***

### generateCAIP2()

```ts
function generateCAIP2(namespace: string, reference: string | number): string;
```

Defined in: [defi/protocols/src/x402/chains/caip.ts:103](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/caip.ts#L103)

Generate a CAIP-2 identifier from namespace and reference

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `namespace` | `string` | The chain namespace (e.g., "eip155", "solana") |
| `reference` | `string` \| `number` | The chain reference (e.g., chain ID for EVM, genesis hash for Solana) |

#### Returns

`string`

CAIP-2 identifier string

#### Example

```typescript
generateCAIP2("eip155", "8453")  // "eip155:8453"
generateCAIP2("solana", "5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp")
```

***

### getNamespaceName()

```ts
function getNamespaceName(namespace: string): string;
```

Defined in: [defi/protocols/src/x402/chains/caip.ts:175](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/caip.ts#L175)

Get human-readable name for a chain namespace

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `namespace` | `string` |

#### Returns

`string`

***

### getSolanaCluster()

```ts
function getSolanaCluster(caip2: string): "testnet" | "devnet" | "mainnet" | null;
```

Defined in: [defi/protocols/src/x402/chains/caip.ts:192](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/caip.ts#L192)

Get Solana cluster name from CAIP-2 identifier

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `caip2` | `string` | The CAIP-2 identifier for Solana |

#### Returns

`"testnet"` \| `"devnet"` \| `"mainnet"` \| `null`

Cluster name ('mainnet', 'devnet', 'testnet') or null

***

### isEvmChain()

```ts
function isEvmChain(caip2: string): boolean;
```

Defined in: [defi/protocols/src/x402/chains/caip.ts:149](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/caip.ts#L149)

Check if a CAIP-2 identifier represents an EVM chain

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `caip2` | `string` |

#### Returns

`boolean`

***

### isSolanaChain()

```ts
function isSolanaChain(caip2: string): boolean;
```

Defined in: [defi/protocols/src/x402/chains/caip.ts:157](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/caip.ts#L157)

Check if a CAIP-2 identifier represents a Solana chain

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `caip2` | `string` |

#### Returns

`boolean`

***

### isValidCAIP2()

```ts
function isValidCAIP2(caip2: string): boolean;
```

Defined in: [defi/protocols/src/x402/chains/caip.ts:168](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/caip.ts#L168)

Validate a CAIP-2 identifier string

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `caip2` | `string` | The string to validate |

#### Returns

`boolean`

True if valid CAIP-2 format

***

### parseCAIP2()

```ts
function parseCAIP2(caip2: string): 
  | CAIP2Identifier
  | null;
```

Defined in: [defi/protocols/src/x402/chains/caip.ts:72](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/caip.ts#L72)

Parse a CAIP-2 identifier string into its components

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `caip2` | `string` | The CAIP-2 identifier string (e.g., "eip155:8453") |

#### Returns

  \| [`CAIP2Identifier`](/docs/api/defi/protocols/src/x402/chains/caip.md#caip2identifier)
  \| `null`

Parsed CAIP-2 components or null if invalid

#### Example

```typescript
parseCAIP2("eip155:8453")
// { namespace: "eip155", reference: "8453", full: "eip155:8453" }

parseCAIP2("solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp")
// { namespace: "solana", reference: "5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp", full: "..." }

parseCAIP2("invalid")
// null
```

***

### solanaClusterToCAIP2()

```ts
function solanaClusterToCAIP2(cluster: "testnet" | "devnet" | "mainnet"): string;
```

Defined in: [defi/protocols/src/x402/chains/caip.ts:216](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/caip.ts#L216)

Generate Solana CAIP-2 identifier from cluster name

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `cluster` | `"testnet"` \| `"devnet"` \| `"mainnet"` | The Solana cluster name |

#### Returns

`string`

CAIP-2 identifier
