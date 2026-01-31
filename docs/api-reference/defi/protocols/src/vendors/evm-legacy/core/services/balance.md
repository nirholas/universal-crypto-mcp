[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/evm-legacy/core/services/balance

# defi/protocols/src/vendors/evm-legacy/core/services/balance

## Functions

### getERC1155Balance()

```ts
function getERC1155Balance(
   tokenAddressOrEns: string, 
   ownerAddressOrEns: string, 
   tokenId: bigint, 
network: string): Promise<bigint>;
```

Defined in: [defi/protocols/src/vendors/evm-legacy/core/services/balance.ts:209](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/evm-legacy/core/services/balance.ts#L209)

Get the balance of an ERC1155 token for an address

#### Parameters

| Parameter | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `tokenAddressOrEns` | `string` | `undefined` | ERC1155 contract address or ENS name |
| `ownerAddressOrEns` | `string` | `undefined` | Owner address or ENS name |
| `tokenId` | `bigint` | `undefined` | Token ID to check |
| `network` | `string` | `'ethereum'` | Network name or chain ID |

#### Returns

`Promise`\<`bigint`\>

Token balance

***

### getERC20Balance()

```ts
function getERC20Balance(
   tokenAddressOrEns: string, 
   ownerAddressOrEns: string, 
   network: string): Promise<{
  formatted: string;
  raw: bigint;
  token: {
     decimals: number;
     symbol: string;
  };
}>;
```

Defined in: [defi/protocols/src/vendors/evm-legacy/core/services/balance.ts:104](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/evm-legacy/core/services/balance.ts#L104)

Get the balance of an ERC20 token for an address

#### Parameters

| Parameter | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `tokenAddressOrEns` | `string` | `undefined` | Token contract address or ENS name |
| `ownerAddressOrEns` | `string` | `undefined` | Owner address or ENS name |
| `network` | `string` | `'ethereum'` | Network name or chain ID |

#### Returns

`Promise`\<\{
  `formatted`: `string`;
  `raw`: `bigint`;
  `token`: \{
     `decimals`: `number`;
     `symbol`: `string`;
  \};
\}\>

Token balance with formatting information

***

### getERC721Balance()

```ts
function getERC721Balance(
   tokenAddressOrEns: string, 
   ownerAddressOrEns: string, 
network: string): Promise<bigint>;
```

Defined in: [defi/protocols/src/vendors/evm-legacy/core/services/balance.ts:184](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/evm-legacy/core/services/balance.ts#L184)

Get the number of NFTs owned by an address for a specific collection

#### Parameters

| Parameter | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `tokenAddressOrEns` | `string` | `undefined` | NFT contract address or ENS name |
| `ownerAddressOrEns` | `string` | `undefined` | Owner address or ENS name |
| `network` | `string` | `'ethereum'` | Network name or chain ID |

#### Returns

`Promise`\<`bigint`\>

Number of NFTs owned

***

### getETHBalance()

```ts
function getETHBalance(addressOrEns: string, network: string): Promise<{
  ether: string;
  wei: bigint;
}>;
```

Defined in: [defi/protocols/src/vendors/evm-legacy/core/services/balance.ts:81](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/evm-legacy/core/services/balance.ts#L81)

Get the ETH balance for an address

#### Parameters

| Parameter | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `addressOrEns` | `string` | `undefined` | Ethereum address or ENS name |
| `network` | `string` | `'ethereum'` | Network name or chain ID |

#### Returns

`Promise`\<\{
  `ether`: `string`;
  `wei`: `bigint`;
\}\>

Balance in wei and ether

***

### isNFTOwner()

```ts
function isNFTOwner(
   tokenAddressOrEns: string, 
   ownerAddressOrEns: string, 
   tokenId: bigint, 
network: string): Promise<boolean>;
```

Defined in: [defi/protocols/src/vendors/evm-legacy/core/services/balance.ts:152](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/evm-legacy/core/services/balance.ts#L152)

Check if an address owns a specific NFT

#### Parameters

| Parameter | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `tokenAddressOrEns` | `string` | `undefined` | NFT contract address or ENS name |
| `ownerAddressOrEns` | `string` | `undefined` | Owner address or ENS name |
| `tokenId` | `bigint` | `undefined` | Token ID to check |
| `network` | `string` | `'ethereum'` | Network name or chain ID |

#### Returns

`Promise`\<`boolean`\>

True if the address owns the NFT
