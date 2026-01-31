[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/bnb/evm/services/transfer

# defi/protocols/src/vendors/bnb/evm/services/transfer

## Functions

### approveERC20()

```ts
function approveERC20(
   tokenAddressOrEns: string, 
   spenderAddressOrEns: string, 
   amount: string, 
   privateKey: string, 
   network: string): Promise<{
  amount: {
     formatted: string;
     raw: bigint;
  };
  token: {
     decimals: number;
     symbol: string;
  };
  txHash: `0x${string}`;
}>;
```

Defined in: [defi/protocols/src/vendors/bnb/evm/services/transfer.ts:145](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/bnb/evm/services/transfer.ts#L145)

Approve ERC20 token spending

#### Parameters

| Parameter | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `tokenAddressOrEns` | `string` | `undefined` | Token contract address or ENS name |
| `spenderAddressOrEns` | `string` | `undefined` | Spender address or ENS name |
| `amount` | `string` | `undefined` | Amount to approve (in token units) |
| `privateKey` | `string` | `undefined` | Owner's private key |
| `network` | `string` | `"ethereum"` | Network name or chain ID |

#### Returns

`Promise`\<\{
  `amount`: \{
     `formatted`: `string`;
     `raw`: `bigint`;
  \};
  `token`: \{
     `decimals`: `number`;
     `symbol`: `string`;
  \};
  `txHash`: `` `0x${string}` ``;
\}\>

Transaction details

***

### transferERC1155()

```ts
function transferERC1155(
   tokenAddressOrEns: string, 
   toAddressOrEns: string, 
   tokenId: bigint, 
   amount: string, 
   privateKey: string, 
   network: string): Promise<{
  amount: string;
  tokenId: string;
  txHash: `0x${string}`;
}>;
```

Defined in: [defi/protocols/src/vendors/bnb/evm/services/transfer.ts:300](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/bnb/evm/services/transfer.ts#L300)

Transfer ERC1155 tokens to an address

#### Parameters

| Parameter | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `tokenAddressOrEns` | `string` | `undefined` | Token contract address or ENS name |
| `toAddressOrEns` | `string` | `undefined` | Recipient address or ENS name |
| `tokenId` | `bigint` | `undefined` | Token ID to transfer |
| `amount` | `string` | `undefined` | Amount of tokens to transfer |
| `privateKey` | `string` | `undefined` | Owner's private key |
| `network` | `string` | `"ethereum"` | Network name or chain ID |

#### Returns

`Promise`\<\{
  `amount`: `string`;
  `tokenId`: `string`;
  `txHash`: `` `0x${string}` ``;
\}\>

Transaction details

***

### transferERC20()

```ts
function transferERC20(
   tokenAddressOrEns: string, 
   toAddressOrEns: string, 
   amount: string, 
   privateKey: string, 
   network: string): Promise<{
  amount: {
     formatted: string;
     raw: bigint;
  };
  token: {
     decimals: number;
     symbol: string;
  };
  txHash: `0x${string}`;
}>;
```

Defined in: [defi/protocols/src/vendors/bnb/evm/services/transfer.ts:65](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/bnb/evm/services/transfer.ts#L65)

Transfer ERC20 tokens to an address

#### Parameters

| Parameter | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `tokenAddressOrEns` | `string` | `undefined` | Token contract address or ENS name |
| `toAddressOrEns` | `string` | `undefined` | Recipient address or ENS name |
| `amount` | `string` | `undefined` | Amount to send (in token units) |
| `privateKey` | `string` | `undefined` | Sender's private key |
| `network` | `string` | `"ethereum"` | Network name or chain ID |

#### Returns

`Promise`\<\{
  `amount`: \{
     `formatted`: `string`;
     `raw`: `bigint`;
  \};
  `token`: \{
     `decimals`: `number`;
     `symbol`: `string`;
  \};
  `txHash`: `` `0x${string}` ``;
\}\>

Transaction details

***

### transferERC721()

```ts
function transferERC721(
   tokenAddressOrEns: string, 
   toAddressOrEns: string, 
   tokenId: bigint, 
   privateKey: string, 
   network: string): Promise<{
  token: {
     name: string;
     symbol: string;
  };
  tokenId: string;
  txHash: `0x${string}`;
}>;
```

Defined in: [defi/protocols/src/vendors/bnb/evm/services/transfer.ts:228](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/bnb/evm/services/transfer.ts#L228)

Transfer an NFT to an address

#### Parameters

| Parameter | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `tokenAddressOrEns` | `string` | `undefined` | NFT contract address or ENS name |
| `toAddressOrEns` | `string` | `undefined` | Recipient address or ENS name |
| `tokenId` | `bigint` | `undefined` | Token ID to transfer |
| `privateKey` | `string` | `undefined` | Owner's private key |
| `network` | `string` | `"ethereum"` | Network name or chain ID |

#### Returns

`Promise`\<\{
  `token`: \{
     `name`: `string`;
     `symbol`: `string`;
  \};
  `tokenId`: `string`;
  `txHash`: `` `0x${string}` ``;
\}\>

Transaction details

***

### transferETH()

```ts
function transferETH(
   privateKey: string, 
   toAddressOrEns: string, 
   amount: string, 
network: string): Promise<`0x${string}`>;
```

Defined in: [defi/protocols/src/vendors/bnb/evm/services/transfer.ts:30](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/bnb/evm/services/transfer.ts#L30)

Transfer ETH to an address

#### Parameters

| Parameter | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `privateKey` | `string` | `undefined` | Sender's private key |
| `toAddressOrEns` | `string` | `undefined` | Recipient address or ENS name |
| `amount` | `string` | `undefined` | Amount to send in ETH |
| `network` | `string` | `"ethereum"` | Network name or chain ID |

#### Returns

`Promise`\<`` `0x${string}` ``\>

Transaction hash
