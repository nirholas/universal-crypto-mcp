[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/algorand/tools/apiManager/indexer/transaction

# defi/protocols/src/vendors/algorand/tools/apiManager/indexer/transaction

## Variables

### handleTransactionTools()

```ts
const handleTransactionTools: (args: any) => Promise<any>;
```

Defined in: [defi/protocols/src/vendors/algorand/tools/apiManager/indexer/transaction.ts:299](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/apiManager/indexer/transaction.ts#L299)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `args` | `any` |

#### Returns

`Promise`\<`any`\>

***

### transactionTools

```ts
const transactionTools: (
  | {
  description: string;
  inputSchema: {
     properties: {
        address?: undefined;
        addressRole?: undefined;
        afterTime?: undefined;
        applicationId?: undefined;
        assetId?: undefined;
        beforeTime?: undefined;
        currencyGreaterThan?: undefined;
        currencyLessThan?: undefined;
        limit?: undefined;
        maxRound?: undefined;
        minRound?: undefined;
        nextToken?: undefined;
        round?: undefined;
        txId: {
           description: string;
           type: string;
        };
        txType?: undefined;
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
        afterTime: {
           description: string;
           type: string;
        };
        applicationId?: undefined;
        assetId: {
           description: string;
           type: string;
        };
        beforeTime: {
           description: string;
           type: string;
        };
        currencyGreaterThan?: undefined;
        currencyLessThan?: undefined;
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
        nextToken?: undefined;
        round?: undefined;
        txId?: undefined;
        txType: {
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
        applicationId: {
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
        maxRound: {
           description: string;
           type: string;
        };
        minRound: {
           description: string;
           type: string;
        };
        nextToken: {
           description: string;
           type: string;
        };
        round: {
           description: string;
           type: string;
        };
        txId?: undefined;
        txType: {
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

Defined in: [defi/protocols/src/vendors/algorand/tools/apiManager/indexer/transaction.ts:15](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/apiManager/indexer/transaction.ts#L15)

## Functions

### lookupAccountTransactions()

```ts
function lookupAccountTransactions(address: string, params?: {
  afterTime?: string;
  assetId?: number;
  beforeTime?: string;
  limit?: number;
  maxRound?: number;
  minRound?: number;
  txType?: string;
}): Promise<TransactionsResponse>;
```

Defined in: [defi/protocols/src/vendors/algorand/tools/apiManager/indexer/transaction.ts:161](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/apiManager/indexer/transaction.ts#L161)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `address` | `string` |
| `params?` | \{ `afterTime?`: `string`; `assetId?`: `number`; `beforeTime?`: `string`; `limit?`: `number`; `maxRound?`: `number`; `minRound?`: `number`; `txType?`: `string`; \} |
| `params.afterTime?` | `string` |
| `params.assetId?` | `number` |
| `params.beforeTime?` | `string` |
| `params.limit?` | `number` |
| `params.maxRound?` | `number` |
| `params.minRound?` | `number` |
| `params.txType?` | `string` |

#### Returns

`Promise`\<`TransactionsResponse`\>

***

### lookupTransactionByID()

```ts
function lookupTransactionByID(txId: string): Promise<TransactionResponse>;
```

Defined in: [defi/protocols/src/vendors/algorand/tools/apiManager/indexer/transaction.ts:139](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/apiManager/indexer/transaction.ts#L139)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `txId` | `string` |

#### Returns

`Promise`\<`TransactionResponse`\>

***

### searchForTransactions()

```ts
function searchForTransactions(params?: {
  address?: string;
  addressRole?: string;
  afterTime?: string;
  applicationId?: number;
  assetId?: number;
  beforeTime?: string;
  currencyGreaterThan?: number;
  currencyLessThan?: number;
  limit?: number;
  maxRound?: number;
  minRound?: number;
  nextToken?: string;
  round?: number;
  txType?: string;
}): Promise<TransactionsResponse>;
```

Defined in: [defi/protocols/src/vendors/algorand/tools/apiManager/indexer/transaction.ts:216](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/apiManager/indexer/transaction.ts#L216)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `params?` | \{ `address?`: `string`; `addressRole?`: `string`; `afterTime?`: `string`; `applicationId?`: `number`; `assetId?`: `number`; `beforeTime?`: `string`; `currencyGreaterThan?`: `number`; `currencyLessThan?`: `number`; `limit?`: `number`; `maxRound?`: `number`; `minRound?`: `number`; `nextToken?`: `string`; `round?`: `number`; `txType?`: `string`; \} |
| `params.address?` | `string` |
| `params.addressRole?` | `string` |
| `params.afterTime?` | `string` |
| `params.applicationId?` | `number` |
| `params.assetId?` | `number` |
| `params.beforeTime?` | `string` |
| `params.currencyGreaterThan?` | `number` |
| `params.currencyLessThan?` | `number` |
| `params.limit?` | `number` |
| `params.maxRound?` | `number` |
| `params.minRound?` | `number` |
| `params.nextToken?` | `string` |
| `params.round?` | `number` |
| `params.txType?` | `string` |

#### Returns

`Promise`\<`TransactionsResponse`\>
