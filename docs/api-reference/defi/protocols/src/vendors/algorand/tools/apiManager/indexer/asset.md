[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/algorand/tools/apiManager/indexer/asset

# defi/protocols/src/vendors/algorand/tools/apiManager/indexer/asset

## Variables

### assetTools

```ts
const assetTools: (
  | {
  description: string;
  inputSchema: {
     properties: {
        address?: undefined;
        addressRole?: undefined;
        afterTime?: undefined;
        assetId: {
           description: string;
           type: string;
        };
        beforeTime?: undefined;
        creator?: undefined;
        currencyGreaterThan?: undefined;
        currencyLessThan?: undefined;
        excludeCloseTo?: undefined;
        limit?: undefined;
        maxRound?: undefined;
        minRound?: undefined;
        name?: undefined;
        nextToken?: undefined;
        txid?: undefined;
        unit?: undefined;
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
        addressRole?: undefined;
        afterTime?: undefined;
        assetId: {
           description: string;
           type: string;
        };
        beforeTime?: undefined;
        creator?: undefined;
        currencyGreaterThan: {
           description: string;
           type: string;
        };
        currencyLessThan: {
           description: string;
           type: string;
        };
        excludeCloseTo?: undefined;
        limit: {
           description: string;
           type: string;
        };
        maxRound?: undefined;
        minRound?: undefined;
        name?: undefined;
        nextToken: {
           description: string;
           type: string;
        };
        txid?: undefined;
        unit?: undefined;
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
        addressRole: {
           description: string;
           type: string;
        };
        afterTime: {
           description: string;
           type: string;
        };
        assetId: {
           description: string;
           type: string;
        };
        beforeTime: {
           description: string;
           type: string;
        };
        creator?: undefined;
        currencyGreaterThan?: undefined;
        currencyLessThan?: undefined;
        excludeCloseTo: {
           description: string;
           type: string;
        };
        limit: {
           description: string;
           type: string;
        };
        maxRound: {
           description: string;
           type: string;
        };
        minRound: {
           description: string;
           type: string;
        };
        name?: undefined;
        nextToken: {
           description: string;
           type: string;
        };
        txid: {
           description: string;
           type: string;
        };
        unit?: undefined;
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
        addressRole?: undefined;
        afterTime?: undefined;
        assetId: {
           description: string;
           type: string;
        };
        beforeTime?: undefined;
        creator: {
           description: string;
           type: string;
        };
        currencyGreaterThan?: undefined;
        currencyLessThan?: undefined;
        excludeCloseTo?: undefined;
        limit: {
           description: string;
           type: string;
        };
        maxRound?: undefined;
        minRound?: undefined;
        name: {
           description: string;
           type: string;
        };
        nextToken: {
           description: string;
           type: string;
        };
        txid?: undefined;
        unit: {
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

Defined in: [defi/protocols/src/vendors/algorand/tools/apiManager/indexer/asset.ts:17](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/apiManager/indexer/asset.ts#L17)

***

### handleAssetTools()

```ts
const handleAssetTools: (args: any) => Promise<any>;
```

Defined in: [defi/protocols/src/vendors/algorand/tools/apiManager/indexer/asset.ts:317](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/apiManager/indexer/asset.ts#L317)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `args` | `any` |

#### Returns

`Promise`\<`any`\>

## Functions

### lookupAssetBalances()

```ts
function lookupAssetBalances(assetId: number, params?: {
  address?: string;
  currencyGreaterThan?: number;
  currencyLessThan?: number;
  limit?: number;
  nextToken?: string;
}): Promise<AssetBalancesResponse>;
```

Defined in: [defi/protocols/src/vendors/algorand/tools/apiManager/indexer/asset.ts:173](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/apiManager/indexer/asset.ts#L173)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `assetId` | `number` |
| `params?` | \{ `address?`: `string`; `currencyGreaterThan?`: `number`; `currencyLessThan?`: `number`; `limit?`: `number`; `nextToken?`: `string`; \} |
| `params.address?` | `string` |
| `params.currencyGreaterThan?` | `number` |
| `params.currencyLessThan?` | `number` |
| `params.limit?` | `number` |
| `params.nextToken?` | `string` |

#### Returns

`Promise`\<`AssetBalancesResponse`\>

***

### lookupAssetByID()

```ts
function lookupAssetByID(assetId: number): Promise<AssetResponse>;
```

Defined in: [defi/protocols/src/vendors/algorand/tools/apiManager/indexer/asset.ts:155](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/apiManager/indexer/asset.ts#L155)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `assetId` | `number` |

#### Returns

`Promise`\<`AssetResponse`\>

***

### lookupAssetTransactions()

```ts
function lookupAssetTransactions(assetId: number, params?: {
  address?: string;
  addressRole?: string;
  afterTime?: string;
  beforeTime?: string;
  excludeCloseTo?: boolean;
  limit?: number;
  maxRound?: number;
  minRound?: number;
  nextToken?: string;
  txid?: string;
}): Promise<TransactionsResponse>;
```

Defined in: [defi/protocols/src/vendors/algorand/tools/apiManager/indexer/asset.ts:212](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/apiManager/indexer/asset.ts#L212)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `assetId` | `number` |
| `params?` | \{ `address?`: `string`; `addressRole?`: `string`; `afterTime?`: `string`; `beforeTime?`: `string`; `excludeCloseTo?`: `boolean`; `limit?`: `number`; `maxRound?`: `number`; `minRound?`: `number`; `nextToken?`: `string`; `txid?`: `string`; \} |
| `params.address?` | `string` |
| `params.addressRole?` | `string` |
| `params.afterTime?` | `string` |
| `params.beforeTime?` | `string` |
| `params.excludeCloseTo?` | `boolean` |
| `params.limit?` | `number` |
| `params.maxRound?` | `number` |
| `params.minRound?` | `number` |
| `params.nextToken?` | `string` |
| `params.txid?` | `string` |

#### Returns

`Promise`\<`TransactionsResponse`\>

***

### searchForAssets()

```ts
function searchForAssets(params?: {
  assetId?: number;
  creator?: string;
  limit?: number;
  name?: string;
  nextToken?: string;
  unit?: string;
}): Promise<AssetsResponse>;
```

Defined in: [defi/protocols/src/vendors/algorand/tools/apiManager/indexer/asset.ts:271](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/apiManager/indexer/asset.ts#L271)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `params?` | \{ `assetId?`: `number`; `creator?`: `string`; `limit?`: `number`; `name?`: `string`; `nextToken?`: `string`; `unit?`: `string`; \} |
| `params.assetId?` | `number` |
| `params.creator?` | `string` |
| `params.limit?` | `number` |
| `params.name?` | `string` |
| `params.nextToken?` | `string` |
| `params.unit?` | `string` |

#### Returns

`Promise`\<`AssetsResponse`\>
