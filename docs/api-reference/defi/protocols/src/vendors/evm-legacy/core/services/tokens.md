[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/evm-legacy/core/services/tokens

# defi/protocols/src/vendors/evm-legacy/core/services/tokens

## Functions

### getERC1155TokenURI()

```ts
function getERC1155TokenURI(
   tokenAddress: `0x${string}`, 
   tokenId: bigint, 
network: string): Promise<string>;
```

Defined in: [defi/protocols/src/vendors/evm-legacy/core/services/tokens.ts:157](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/evm-legacy/core/services/tokens.ts#L157)

Get ERC1155 token URI

#### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `tokenAddress` | `` `0x${string}` `` | `undefined` |
| `tokenId` | `bigint` | `undefined` |
| `network` | `string` | `'ethereum'` |

#### Returns

`Promise`\<`string`\>

***

### getERC20TokenInfo()

```ts
function getERC20TokenInfo(tokenAddress: `0x${string}`, network: string): Promise<{
  decimals: number;
  formattedTotalSupply: string;
  name: string;
  symbol: string;
  totalSupply: bigint;
}>;
```

Defined in: [defi/protocols/src/vendors/evm-legacy/core/services/tokens.ts:87](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/evm-legacy/core/services/tokens.ts#L87)

Get ERC20 token information

#### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `tokenAddress` | `` `0x${string}` `` | `undefined` |
| `network` | `string` | `'ethereum'` |

#### Returns

`Promise`\<\{
  `decimals`: `number`;
  `formattedTotalSupply`: `string`;
  `name`: `string`;
  `symbol`: `string`;
  `totalSupply`: `bigint`;
\}\>

***

### getERC721TokenMetadata()

```ts
function getERC721TokenMetadata(
   tokenAddress: `0x${string}`, 
   tokenId: bigint, 
   network: string): Promise<{
  name: string;
  symbol: string;
  tokenURI: string;
}>;
```

Defined in: [defi/protocols/src/vendors/evm-legacy/core/services/tokens.ts:124](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/evm-legacy/core/services/tokens.ts#L124)

Get ERC721 token metadata

#### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `tokenAddress` | `` `0x${string}` `` | `undefined` |
| `tokenId` | `bigint` | `undefined` |
| `network` | `string` | `'ethereum'` |

#### Returns

`Promise`\<\{
  `name`: `string`;
  `symbol`: `string`;
  `tokenURI`: `string`;
\}\>
