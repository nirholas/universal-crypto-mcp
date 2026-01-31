[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/algorand/tools/apiManager/algod/account

# defi/protocols/src/vendors/algorand/tools/apiManager/algod/account

## Variables

### accountTools

```ts
const accountTools: (
  | {
  description: string;
  inputSchema: {
     properties: {
        address: {
           description: string;
           type: string;
        };
        appId?: undefined;
        assetId?: undefined;
     };
     required: string[];
     type: string;
  };
  name: string;
}
  | {
  description: string;
  inputSchema: {
     properties: {
        address: {
           description: string;
           type: string;
        };
        appId: {
           description: string;
           type: string;
        };
        assetId?: undefined;
     };
     required: string[];
     type: string;
  };
  name: string;
}
  | {
  description: string;
  inputSchema: {
     properties: {
        address: {
           description: string;
           type: string;
        };
        appId?: undefined;
        assetId: {
           description: string;
           type: string;
        };
     };
     required: string[];
     type: string;
  };
  name: string;
})[];
```

Defined in: [defi/protocols/src/vendors/algorand/tools/apiManager/algod/account.ts:16](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/apiManager/algod/account.ts#L16)

## Functions

### getAccountApplicationInfo()

```ts
function getAccountApplicationInfo(address: string, appId: number): Promise<AccountApplicationResponse>;
```

Defined in: [defi/protocols/src/vendors/algorand/tools/apiManager/algod/account.ts:96](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/apiManager/algod/account.ts#L96)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `address` | `string` |
| `appId` | `number` |

#### Returns

`Promise`\<`AccountApplicationResponse`\>

***

### getAccountAssetInfo()

```ts
function getAccountAssetInfo(address: string, assetId: number): Promise<AccountAssetResponse>;
```

Defined in: [defi/protocols/src/vendors/algorand/tools/apiManager/algod/account.ts:119](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/apiManager/algod/account.ts#L119)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `address` | `string` |
| `assetId` | `number` |

#### Returns

`Promise`\<`AccountAssetResponse`\>

***

### getAccountInfo()

```ts
function getAccountInfo(address: string): Promise<Account>;
```

Defined in: [defi/protocols/src/vendors/algorand/tools/apiManager/algod/account.ts:69](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/apiManager/algod/account.ts#L69)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `address` | `string` |

#### Returns

`Promise`\<`Account`\>

***

### handleAccountTools()

```ts
function handleAccountTools(name: string, args: any): Promise<any>;
```

Defined in: [defi/protocols/src/vendors/algorand/tools/apiManager/algod/account.ts:142](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/apiManager/algod/account.ts#L142)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `name` | `string` |
| `args` | `any` |

#### Returns

`Promise`\<`any`\>
