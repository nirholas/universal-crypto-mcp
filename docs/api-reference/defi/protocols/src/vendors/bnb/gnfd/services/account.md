[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/bnb/gnfd/services/account

# defi/protocols/src/vendors/bnb/gnfd/services/account

## Functions

### getAccount()

```ts
function getAccount(network: "testnet" | "mainnet", privateKey: `0x${string}`): Promise<any>;
```

Defined in: [defi/protocols/src/vendors/bnb/gnfd/services/account.ts:19](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/bnb/gnfd/services/account.ts#L19)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `network` | `"testnet"` \| `"mainnet"` |
| `privateKey` | `` `0x${string}` `` |

#### Returns

`Promise`\<`any`\>

***

### getAccountBalance()

```ts
function getAccountBalance(network: "testnet" | "mainnet", __namedParameters: {
  address?: string;
  privateKey?: `0x${string}`;
}): Promise<any>;
```

Defined in: [defi/protocols/src/vendors/bnb/gnfd/services/account.ts:30](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/bnb/gnfd/services/account.ts#L30)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `network` | `"testnet"` \| `"mainnet"` |
| `__namedParameters` | \{ `address?`: `string`; `privateKey?`: `` `0x${string}` ``; \} |
| `__namedParameters.address?` | `string` |
| `__namedParameters.privateKey?` | `` `0x${string}` `` |

#### Returns

`Promise`\<`any`\>

***

### getAddressFromPrivateKey()

```ts
function getAddressFromPrivateKey(privateKey: `0x${string}`): `0x${string}`;
```

Defined in: [defi/protocols/src/vendors/bnb/gnfd/services/account.ts:13](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/bnb/gnfd/services/account.ts#L13)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `privateKey` | `` `0x${string}` `` |

#### Returns

`` `0x${string}` ``

***

### getPaymentAccounts()

```ts
function getPaymentAccounts(network: "testnet" | "mainnet", __namedParameters: {
  address?: string;
  privateKey?: `0x${string}`;
}): Promise<any>;
```

Defined in: [defi/protocols/src/vendors/bnb/gnfd/services/account.ts:48](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/bnb/gnfd/services/account.ts#L48)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `network` | `"testnet"` \| `"mainnet"` |
| `__namedParameters` | \{ `address?`: `string`; `privateKey?`: `` `0x${string}` ``; \} |
| `__namedParameters.address?` | `string` |
| `__namedParameters.privateKey?` | `` `0x${string}` `` |

#### Returns

`Promise`\<`any`\>
