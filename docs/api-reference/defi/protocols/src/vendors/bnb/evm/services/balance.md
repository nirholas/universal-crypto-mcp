[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/bnb/evm/services/balance

# defi/protocols/src/vendors/bnb/evm/services/balance

## Functions

### getERC20Balance()

```ts
function getERC20Balance(
   tokenAddressOrEns: string, 
   ownerAddressOrEns: string, 
   network: string): Promise<{
  decimals: number;
  formatted: string;
  network: string;
  ownerAddress: `0x${string}`;
  raw: bigint;
  symbol: string;
  tokenAddress: `0x${string}`;
}>;
```

Defined in: [defi/protocols/src/vendors/bnb/evm/services/balance.ts:52](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/bnb/evm/services/balance.ts#L52)

Get the balance of an ERC20 token for an address

#### Parameters

| Parameter | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `tokenAddressOrEns` | `string` | `undefined` | Token contract address or ENS name |
| `ownerAddressOrEns` | `string` | `undefined` | Owner address or ENS name |
| `network` | `string` | `"ethereum"` | Network name or chain ID |

#### Returns

`Promise`\<\{
  `decimals`: `number`;
  `formatted`: `string`;
  `network`: `string`;
  `ownerAddress`: `` `0x${string}` ``;
  `raw`: `bigint`;
  `symbol`: `string`;
  `tokenAddress`: `` `0x${string}` ``;
\}\>

Token balance with formatting information

***

### getNativeBalance()

```ts
function getNativeBalance(addressOrEns: string, network: string): Promise<{
  decimals: number;
  formatted: string;
  network: string;
  raw: bigint;
  symbol: string;
}>;
```

Defined in: [defi/protocols/src/vendors/bnb/evm/services/balance.ts:19](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/bnb/evm/services/balance.ts#L19)

Get the ETH balance for an address

#### Parameters

| Parameter | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `addressOrEns` | `string` | `undefined` | Ethereum address or ENS name |
| `network` | `string` | `"bsc"` | Network name or chain ID |

#### Returns

`Promise`\<\{
  `decimals`: `number`;
  `formatted`: `string`;
  `network`: `string`;
  `raw`: `bigint`;
  `symbol`: `string`;
\}\>

Balance in wei and ether
