[**Universal Crypto MCP API Reference v1.0.0**](../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/evm/chains

# defi/protocols/src/evm/chains

## Variables

### chainMap

```ts
const chainMap: Record<number, Chain>;
```

Defined in: [defi/protocols/src/evm/chains.ts:34](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/evm/chains.ts#L34)

***

### DEFAULT\_CHAIN\_ID

```ts
const DEFAULT_CHAIN_ID: 1 = 1;
```

Defined in: [defi/protocols/src/evm/chains.ts:31](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/evm/chains.ts#L31)

***

### DEFAULT\_RPC\_URL

```ts
const DEFAULT_RPC_URL: "https://eth.llamarpc.com" = "https://eth.llamarpc.com";
```

Defined in: [defi/protocols/src/evm/chains.ts:30](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/evm/chains.ts#L30)

***

### networkNameMap

```ts
const networkNameMap: Record<string, number>;
```

Defined in: [defi/protocols/src/evm/chains.ts:56](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/evm/chains.ts#L56)

***

### rpcUrlMap

```ts
const rpcUrlMap: Record<number, string>;
```

Defined in: [defi/protocols/src/evm/chains.ts:92](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/evm/chains.ts#L92)

## Functions

### getChain()

```ts
function getChain(chainIdentifier: string | number): Chain;
```

Defined in: [defi/protocols/src/evm/chains.ts:147](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/evm/chains.ts#L147)

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

Defined in: [defi/protocols/src/evm/chains.ts:170](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/evm/chains.ts#L170)

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

Defined in: [defi/protocols/src/evm/chains.ts:185](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/evm/chains.ts#L185)

Get a list of supported networks

#### Returns

`string`[]

Array of supported network names (excluding short aliases)

***

### resolveChainId()

```ts
function resolveChainId(chainIdentifier: string | number): number;
```

Defined in: [defi/protocols/src/evm/chains.ts:118](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/evm/chains.ts#L118)

Resolves a chain identifier (number or string) to a chain ID

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `chainIdentifier` | `string` \| `number` | Chain ID (number) or network name (string) |

#### Returns

`number`

The resolved chain ID

