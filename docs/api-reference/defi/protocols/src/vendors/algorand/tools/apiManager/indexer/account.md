[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/algorand/tools/apiManager/indexer/account

# defi/protocols/src/vendors/algorand/tools/apiManager/indexer/account

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
        applicationId?: undefined;
        assetId?: undefined;
        currencyGreaterThan?: undefined;
        currencyLessThan?: undefined;
        limit?: undefined;
        nextToken?: undefined;
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
        applicationId?: undefined;
        assetId: {
           description: string;
           type: string;
        };
        currencyGreaterThan?: undefined;
        currencyLessThan?: undefined;
        limit: {
           description: string;
           type: string;
        };
        nextToken: {
           description: string;
           type: string;
        };
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
        address?: undefined;
        applicationId: {
           description: string;
           type: string;
        };
        assetId: {
           description: string;
           type: string;
        };
        currencyGreaterThan: {
           description: string;
           type: string;
        };
        currencyLessThan: {
           description: string;
           type: string;
        };
        limit: {
           description: string;
           type: string;
        };
        nextToken: {
           description: string;
           type: string;
        };
     };
     required?: undefined;
     type: string;
  };
  name: string;
})[];
```

Defined in: [defi/protocols/src/vendors/algorand/tools/apiManager/indexer/account.ts:19](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/apiManager/indexer/account.ts#L19)

***

### handleAccountTools()

```ts
const handleAccountTools: (args: any) => Promise<any>;
```

Defined in: [defi/protocols/src/vendors/algorand/tools/apiManager/indexer/account.ts:257](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/apiManager/indexer/account.ts#L257)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `args` | `any` |

#### Returns

`Promise`\<`any`\>

## Functions

### lookupAccountAppLocalStates()

```ts
function lookupAccountAppLocalStates(address: string): Promise<ApplicationLocalStatesResponse>;
```

Defined in: [defi/protocols/src/vendors/algorand/tools/apiManager/indexer/account.ts:175](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/apiManager/indexer/account.ts#L175)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `address` | `string` |

#### Returns

`Promise`\<`ApplicationLocalStatesResponse`\>

***

### lookupAccountAssets()

```ts
function lookupAccountAssets(address: string, params?: {
  assetId?: number;
  limit?: number;
  nextToken?: string;
}): Promise<AssetHoldingsResponse>;
```

Defined in: [defi/protocols/src/vendors/algorand/tools/apiManager/indexer/account.ts:141](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/apiManager/indexer/account.ts#L141)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `address` | `string` |
| `params?` | \{ `assetId?`: `number`; `limit?`: `number`; `nextToken?`: `string`; \} |
| `params.assetId?` | `number` |
| `params.limit?` | `number` |
| `params.nextToken?` | `string` |

#### Returns

`Promise`\<`AssetHoldingsResponse`\>

***

### lookupAccountByID()

```ts
function lookupAccountByID(address: string): Promise<AccountResponse>;
```

Defined in: [defi/protocols/src/vendors/algorand/tools/apiManager/indexer/account.ts:123](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/apiManager/indexer/account.ts#L123)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `address` | `string` |

#### Returns

`Promise`\<`AccountResponse`\>

***

### lookupAccountCreatedApplications()

```ts
function lookupAccountCreatedApplications(address: string): Promise<ApplicationsResponse>;
```

Defined in: [defi/protocols/src/vendors/algorand/tools/apiManager/indexer/account.ts:193](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/apiManager/indexer/account.ts#L193)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `address` | `string` |

#### Returns

`Promise`\<`ApplicationsResponse`\>

***

### searchAccounts()

```ts
function searchAccounts(params?: {
  applicationId?: number;
  assetId?: number;
  currencyGreaterThan?: number;
  currencyLessThan?: number;
  limit?: number;
  nextToken?: string;
}): Promise<AccountsResponse>;
```

Defined in: [defi/protocols/src/vendors/algorand/tools/apiManager/indexer/account.ts:211](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/apiManager/indexer/account.ts#L211)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `params?` | \{ `applicationId?`: `number`; `assetId?`: `number`; `currencyGreaterThan?`: `number`; `currencyLessThan?`: `number`; `limit?`: `number`; `nextToken?`: `string`; \} |
| `params.applicationId?` | `number` |
| `params.assetId?` | `number` |
| `params.currencyGreaterThan?` | `number` |
| `params.currencyLessThan?` | `number` |
| `params.limit?` | `number` |
| `params.nextToken?` | `string` |

#### Returns

`Promise`\<`AccountsResponse`\>
