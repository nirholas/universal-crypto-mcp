[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/bnb/gnfd/services/sp

# defi/protocols/src/vendors/bnb/gnfd/services/sp

## Functions

### getAllSps()

```ts
function getAllSps(network: "testnet" | "mainnet"): Promise<any>;
```

Defined in: [defi/protocols/src/vendors/bnb/gnfd/services/sp.ts:16](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/bnb/gnfd/services/sp.ts#L16)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `network` | `"testnet"` \| `"mainnet"` |

#### Returns

`Promise`\<`any`\>

***

### getSps()

```ts
function getSps(network: "testnet" | "mainnet"): Promise<any>;
```

Defined in: [defi/protocols/src/vendors/bnb/gnfd/services/sp.ts:9](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/bnb/gnfd/services/sp.ts#L9)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `network` | `"testnet"` \| `"mainnet"` |

#### Returns

`Promise`\<`any`\>

***

### selectSp()

```ts
function selectSp(network: "testnet" | "mainnet"): Promise<{
  endpoint: any;
  id: any;
  primarySpAddress: any;
  sealAddress: any;
  secondarySpAddresses: any[];
}>;
```

Defined in: [defi/protocols/src/vendors/bnb/gnfd/services/sp.ts:28](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/bnb/gnfd/services/sp.ts#L28)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `network` | `"testnet"` \| `"mainnet"` |

#### Returns

`Promise`\<\{
  `endpoint`: `any`;
  `id`: `any`;
  `primarySpAddress`: `any`;
  `sealAddress`: `any`;
  `secondarySpAddresses`: `any`[];
\}\>
