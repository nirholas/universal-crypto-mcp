[**Universal Crypto MCP API Reference v1.0.0**](../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/core/chains

# defi/protocols/src/core/chains

## Variables

### chainMap

```ts
const chainMap: Record<number, Chain>;
```

Defined in: [defi/protocols/src/core/chains.ts:68](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/core/chains.ts#L68)

***

### DEFAULT\_CHAIN\_ID

```ts
const DEFAULT_CHAIN_ID: 1 = 1;
```

Defined in: [defi/protocols/src/core/chains.ts:65](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/core/chains.ts#L65)

***

### DEFAULT\_RPC\_URL

```ts
const DEFAULT_RPC_URL: "https://eth.llamarpc.com" = 'https://eth.llamarpc.com';
```

Defined in: [defi/protocols/src/core/chains.ts:64](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/core/chains.ts#L64)

***

### networkNameMap

```ts
const networkNameMap: Record<string, number>;
```

Defined in: [defi/protocols/src/core/chains.ts:130](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/core/chains.ts#L130)

***

### rpcUrlMap

```ts
const rpcUrlMap: Record<number, string>;
```

Defined in: [defi/protocols/src/core/chains.ts:224](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/core/chains.ts#L224)

## Functions

### getChain()

```ts
function getChain(chainIdentifier: string | number): Chain;
```

Defined in: [defi/protocols/src/core/chains.ts:320](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/core/chains.ts#L320)

Returns the chain configuration for the specified chain ID or network name

#### Parameters

| Parameter | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `chainIdentifier` | `string` \| `number` | `DEFAULT_CHAIN_ID` | Chain ID (number) or network name (string) |

#### Returns

`Chain`

The chain configuration

#### Throws

Error if the network is not supported (when string is provided)

***

### getRpcUrl()

```ts
function getRpcUrl(chainIdentifier: string | number): string;
```

Defined in: [defi/protocols/src/core/chains.ts:341](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/core/chains.ts#L341)

Gets the appropriate RPC URL for the specified chain ID or network name

#### Parameters

| Parameter | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `chainIdentifier` | `string` \| `number` | `DEFAULT_CHAIN_ID` | Chain ID (number) or network name (string) |

#### Returns

`string`

The RPC URL for the specified chain

***

### getSupportedNetworks()

```ts
function getSupportedNetworks(): string[];
```

Defined in: [defi/protocols/src/core/chains.ts:353](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/core/chains.ts#L353)

Get a list of supported networks

#### Returns

`string`[]

Array of supported network names (excluding short aliases)

***

### resolveChainId()

```ts
function resolveChainId(chainIdentifier: string | number): number;
```

Defined in: [defi/protocols/src/core/chains.ts:290](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/core/chains.ts#L290)

Resolves a chain identifier (number or string) to a chain ID

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `chainIdentifier` | `string` \| `number` | Chain ID (number) or network name (string) |

#### Returns

`number`

The resolved chain ID

