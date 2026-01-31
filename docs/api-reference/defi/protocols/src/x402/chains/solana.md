[**Universal Crypto MCP API Reference v1.0.0**](../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/x402/chains/solana

# defi/protocols/src/x402/chains/solana

## Variables

### SOLANA\_CHAINS

```ts
const SOLANA_CHAINS: Record<string, ChainConfig>;
```

Defined in: [defi/protocols/src/x402/chains/solana.ts:139](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/solana.ts#L139)

All supported Solana chains indexed by CAIP-2 identifier

***

### SOLANA\_CHAINS\_BY\_CLUSTER

```ts
const SOLANA_CHAINS_BY_CLUSTER: Record<string, ChainConfig>;
```

Defined in: [defi/protocols/src/x402/chains/solana.ts:148](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/solana.ts#L148)

Solana chains indexed by cluster name

***

### SOLANA\_DEVNET

```ts
const SOLANA_DEVNET: ChainConfig;
```

Defined in: [defi/protocols/src/x402/chains/solana.ts:92](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/solana.ts#L92)

Solana Devnet configuration
CAIP-2: solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1

***

### SOLANA\_MAINNET

```ts
const SOLANA_MAINNET: ChainConfig;
```

Defined in: [defi/protocols/src/x402/chains/solana.ts:69](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/solana.ts#L69)

Solana Mainnet Beta configuration
CAIP-2: solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp

***

### SOLANA\_PROGRAMS

```ts
const SOLANA_PROGRAMS: {
  ATA_PROGRAM: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";
  TOKEN_2022_PROGRAM: "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb";
  TOKEN_PROGRAM: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
};
```

Defined in: [defi/protocols/src/x402/chains/solana.ts:33](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/solana.ts#L33)

Solana token program IDs

#### Type Declaration

| Name | Type | Default value | Description | Defined in |
| :------ | :------ | :------ | :------ | :------ |
| <a id="ata_program"></a> `ATA_PROGRAM` | `"ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"` | `'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'` | Associated Token Account Program | [defi/protocols/src/x402/chains/solana.ts:39](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/solana.ts#L39) |
| <a id="token_2022_program"></a> `TOKEN_2022_PROGRAM` | `"TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"` | `'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb'` | SPL Token-2022 Program (for newer token features) | [defi/protocols/src/x402/chains/solana.ts:37](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/solana.ts#L37) |
| <a id="token_program"></a> `TOKEN_PROGRAM` | `"TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"` | `'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'` | SPL Token Program | [defi/protocols/src/x402/chains/solana.ts:35](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/solana.ts#L35) |

***

### SOLANA\_TESTNET

```ts
const SOLANA_TESTNET: ChainConfig;
```

Defined in: [defi/protocols/src/x402/chains/solana.ts:115](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/solana.ts#L115)

Solana Testnet configuration (less commonly used)
CAIP-2: solana:4uhcVJyU9pJkvQyS88uRDiswHXSCkY3z

***

### SOLANA\_USDC\_ADDRESSES

```ts
const SOLANA_USDC_ADDRESSES: {
  DEVNET: "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU";
  MAINNET: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
};
```

Defined in: [defi/protocols/src/x402/chains/solana.ts:23](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/solana.ts#L23)

Official USDC SPL token mint addresses on Solana

#### Type Declaration

| Name | Type | Default value | Description | Defined in |
| :------ | :------ | :------ | :------ | :------ |
| <a id="devnet"></a> `DEVNET` | `"4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"` | `'4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'` | Solana Devnet USDC (test token) | [defi/protocols/src/x402/chains/solana.ts:27](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/solana.ts#L27) |
| <a id="mainnet"></a> `MAINNET` | `"EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"` | `'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'` | Solana Mainnet USDC (native, issued by Circle) | [defi/protocols/src/x402/chains/solana.ts:25](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/solana.ts#L25) |

#### See

https://developers.circle.com/stablecoins/docs/usdc-on-main-networks

## Functions

### getDefaultSolanaChain()

```ts
function getDefaultSolanaChain(): ChainConfig;
```

Defined in: [defi/protocols/src/x402/chains/solana.ts:187](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/solana.ts#L187)

Get the default/primary Solana chain (mainnet)

#### Returns

[`ChainConfig`](/docs/api/defi/protocols/src/x402/chains/types.md#chainconfig)

***

### getSolanaChainByCAIP2()

```ts
function getSolanaChainByCAIP2(caip2: string): 
  | ChainConfig
  | undefined;
```

Defined in: [defi/protocols/src/x402/chains/solana.ts:158](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/solana.ts#L158)

Get Solana chain config by CAIP-2 identifier

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `caip2` | `string` |

#### Returns

  \| [`ChainConfig`](/docs/api/defi/protocols/src/x402/chains/types.md#chainconfig)
  \| `undefined`

***

### getSolanaChainByCluster()

```ts
function getSolanaChainByCluster(cluster: string): 
  | ChainConfig
  | undefined;
```

Defined in: [defi/protocols/src/x402/chains/solana.ts:165](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/solana.ts#L165)

Get Solana chain config by cluster name

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `cluster` | `string` |

#### Returns

  \| [`ChainConfig`](/docs/api/defi/protocols/src/x402/chains/types.md#chainconfig)
  \| `undefined`

***

### getSolanaExplorerAccountUrl()

```ts
function getSolanaExplorerAccountUrl(address: string, cluster: string): string;
```

Defined in: [defi/protocols/src/x402/chains/solana.ts:218](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/solana.ts#L218)

Get explorer URL for a Solana account/address

#### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `address` | `string` | `undefined` |
| `cluster` | `string` | `'mainnet-beta'` |

#### Returns

`string`

***

### getSolanaExplorerTxUrl()

```ts
function getSolanaExplorerTxUrl(signature: string, cluster: string): string;
```

Defined in: [defi/protocols/src/x402/chains/solana.ts:208](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/solana.ts#L208)

Get explorer URL for a Solana transaction

#### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `signature` | `string` | `undefined` |
| `cluster` | `string` | `'mainnet-beta'` |

#### Returns

`string`

***

### getSolanaMainnets()

```ts
function getSolanaMainnets(): ChainConfig[];
```

Defined in: [defi/protocols/src/x402/chains/solana.ts:194](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/solana.ts#L194)

List all mainnet Solana chains

#### Returns

[`ChainConfig`](/docs/api/defi/protocols/src/x402/chains/types.md#chainconfig)[]

***

### getSolanaTestnets()

```ts
function getSolanaTestnets(): ChainConfig[];
```

Defined in: [defi/protocols/src/x402/chains/solana.ts:201](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/solana.ts#L201)

List all testnet Solana chains

#### Returns

[`ChainConfig`](/docs/api/defi/protocols/src/x402/chains/types.md#chainconfig)[]

***

### isSolanaAddress()

```ts
function isSolanaAddress(address: string): boolean;
```

Defined in: [defi/protocols/src/x402/chains/solana.ts:172](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/solana.ts#L172)

Check if an address looks like a valid Solana address (base58, 32-44 chars)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `address` | `string` |

#### Returns

`boolean`
