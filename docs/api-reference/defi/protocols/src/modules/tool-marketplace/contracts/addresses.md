[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/modules/tool-marketplace/contracts/addresses

# defi/protocols/src/modules/tool-marketplace/contracts/addresses

## Interfaces

### ContractAddresses

Defined in: [defi/protocols/src/modules/tool-marketplace/contracts/addresses.ts:19](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/contracts/addresses.ts#L19)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="revenuerouter"></a> `revenueRouter` | `` `0x${string}` `` | [defi/protocols/src/modules/tool-marketplace/contracts/addresses.ts:21](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/contracts/addresses.ts#L21) |
| <a id="toolregistry"></a> `toolRegistry` | `` `0x${string}` `` | [defi/protocols/src/modules/tool-marketplace/contracts/addresses.ts:20](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/contracts/addresses.ts#L20) |
| <a id="toolstaking"></a> `toolStaking` | `` `0x${string}` `` | [defi/protocols/src/modules/tool-marketplace/contracts/addresses.ts:22](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/contracts/addresses.ts#L22) |
| <a id="usdstoken"></a> `usdsToken` | `` `0x${string}` `` | [defi/protocols/src/modules/tool-marketplace/contracts/addresses.ts:23](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/contracts/addresses.ts#L23) |

## Type Aliases

### ChainId

```ts
type ChainId = 42161 | 421614 | 8453 | 84532 | 10 | 11155420;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/contracts/addresses.ts:11](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/contracts/addresses.ts#L11)

#### File

addresses.ts

#### Author

nirholas

#### Copyright

(c) 2026 nichxbt

#### Repository

universal-crypto-mcp

#### Version

0.4.14.3

Contract addresses for deployed marketplace contracts

## Variables

### CONTRACT\_ADDRESSES

```ts
const CONTRACT_ADDRESSES: Record<ChainId, ContractAddresses>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/contracts/addresses.ts:27](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/contracts/addresses.ts#L27)

## Functions

### getChainName()

```ts
function getChainName(chainId: ChainId): string;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/contracts/addresses.ts:89](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/contracts/addresses.ts#L89)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `chainId` | [`ChainId`](/docs/api/defi/protocols/src/modules/tool-marketplace/contracts/addresses.md#chainid) |

#### Returns

`string`

***

### getContractAddresses()

```ts
function getContractAddresses(chainId: ChainId): ContractAddresses;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/contracts/addresses.ts:77](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/contracts/addresses.ts#L77)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `chainId` | [`ChainId`](/docs/api/defi/protocols/src/modules/tool-marketplace/contracts/addresses.md#chainid) |

#### Returns

[`ContractAddresses`](/docs/api/defi/protocols/src/modules/tool-marketplace/contracts/addresses.md#contractaddresses)

***

### isTestnet()

```ts
function isTestnet(chainId: ChainId): boolean;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/contracts/addresses.ts:85](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/contracts/addresses.ts#L85)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `chainId` | [`ChainId`](/docs/api/defi/protocols/src/modules/tool-marketplace/contracts/addresses.md#chainid) |

#### Returns

`boolean`
