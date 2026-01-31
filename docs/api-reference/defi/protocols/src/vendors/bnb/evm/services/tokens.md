[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/bnb/evm/services/tokens

# defi/protocols/src/vendors/bnb/evm/services/tokens

## Functions

### createERC20Token()

```ts
function createERC20Token(name: {
  name: string;
  network: string;
  privateKey: `0x${string}`;
  symbol: string;
  totalSupply?: string;
}): Promise<{
  hash: `0x${string}`;
  name: string;
  owner: `0x${string}`;
  symbol: string;
  totalSupply: bigint;
}>;
```

Defined in: [defi/protocols/src/vendors/bnb/evm/services/tokens.ts:155](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/bnb/evm/services/tokens.ts#L155)

Create a new ERC20 token

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `name` | \{ `name`: `string`; `network`: `string`; `privateKey`: `` `0x${string}` ``; `symbol`: `string`; `totalSupply?`: `string`; \} | The name of the token |
| `name.name` | `string` | - |
| `name.network` | `string` | - |
| `name.privateKey` | `` `0x${string}` `` | - |
| `name.symbol` | `string` | - |
| `name.totalSupply?` | `string` | - |

#### Returns

`Promise`\<\{
  `hash`: `` `0x${string}` ``;
  `name`: `string`;
  `owner`: `` `0x${string}` ``;
  `symbol`: `string`;
  `totalSupply`: `bigint`;
\}\>

The transaction hash, token details and owner address

***

### getERC1155TokenMetadata()

```ts
function getERC1155TokenMetadata(
   tokenAddress: `0x${string}`, 
   tokenId: bigint, 
   network: string): Promise<{
  contractAddress: `0x${string}`;
  id: bigint;
  name: string;
  network: string;
  tokenURI: string;
}>;
```

Defined in: [defi/protocols/src/vendors/bnb/evm/services/tokens.ts:109](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/bnb/evm/services/tokens.ts#L109)

Get ERC1155 token URI

#### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `tokenAddress` | `` `0x${string}` `` | `undefined` |
| `tokenId` | `bigint` | `undefined` |
| `network` | `string` | `"ethereum"` |

#### Returns

`Promise`\<\{
  `contractAddress`: `` `0x${string}` ``;
  `id`: `bigint`;
  `name`: `string`;
  `network`: `string`;
  `tokenURI`: `string`;
\}\>

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

Defined in: [defi/protocols/src/vendors/bnb/evm/services/tokens.ts:19](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/bnb/evm/services/tokens.ts#L19)

Get ERC20 token information

#### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `tokenAddress` | `` `0x${string}` `` | `undefined` |
| `network` | `string` | `"ethereum"` |

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
  contractAddress: `0x${string}`;
  id: bigint;
  name: string;
  network: string;
  owner: `0x${string}`;
  symbol: string;
  tokenURI: string;
  totalSupply: bigint;
}>;
```

Defined in: [defi/protocols/src/vendors/bnb/evm/services/tokens.ts:60](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/bnb/evm/services/tokens.ts#L60)

Get ERC721 token metadata

#### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `tokenAddress` | `` `0x${string}` `` | `undefined` |
| `tokenId` | `bigint` | `undefined` |
| `network` | `string` | `"ethereum"` |

#### Returns

`Promise`\<\{
  `contractAddress`: `` `0x${string}` ``;
  `id`: `bigint`;
  `name`: `string`;
  `network`: `string`;
  `owner`: `` `0x${string}` ``;
  `symbol`: `string`;
  `tokenURI`: `string`;
  `totalSupply`: `bigint`;
\}\>
