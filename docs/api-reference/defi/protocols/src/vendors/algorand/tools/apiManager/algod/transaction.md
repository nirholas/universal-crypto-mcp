[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/algorand/tools/apiManager/algod/transaction

# defi/protocols/src/vendors/algorand/tools/apiManager/algod/transaction

## Variables

### transactionTools

```ts
const transactionTools: (
  | {
  description: string;
  inputSchema: {
     properties: {
        address?: undefined;
        maxTxns?: undefined;
        round?: undefined;
        txId: {
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
        maxTxns?: undefined;
        round?: undefined;
        txId?: undefined;
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
        maxTxns: {
           description: string;
           type: string;
        };
        round?: undefined;
        txId?: undefined;
     };
     required?: undefined;
     type: string;
  };
  name: string;
}
  | {
  description: string;
  inputSchema: {
     properties: {
        address?: undefined;
        maxTxns?: undefined;
        round?: undefined;
        txId?: undefined;
     };
     required?: undefined;
     type: string;
  };
  name: string;
}
  | {
  description: string;
  inputSchema: {
     properties: {
        address?: undefined;
        maxTxns?: undefined;
        round: {
           description: string;
           type: string;
        };
        txId?: undefined;
     };
     required: string[];
     type: string;
  };
  name: string;
})[];
```

Defined in: [defi/protocols/src/vendors/algorand/tools/apiManager/algod/transaction.ts:16](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/apiManager/algod/transaction.ts#L16)

## Functions

### getNodeStatus()

```ts
function getNodeStatus(): Promise<NodeStatusResponse>;
```

Defined in: [defi/protocols/src/vendors/algorand/tools/apiManager/algod/transaction.ts:166](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/apiManager/algod/transaction.ts#L166)

#### Returns

`Promise`\<`NodeStatusResponse`\>

***

### getNodeStatusAfterBlock()

```ts
function getNodeStatusAfterBlock(round: number): Promise<NodeStatusResponse>;
```

Defined in: [defi/protocols/src/vendors/algorand/tools/apiManager/algod/transaction.ts:184](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/apiManager/algod/transaction.ts#L184)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `round` | `number` |

#### Returns

`Promise`\<`NodeStatusResponse`\>

***

### getPendingTransaction()

```ts
function getPendingTransaction(txId: string): Promise<PendingTransactionResponse>;
```

Defined in: [defi/protocols/src/vendors/algorand/tools/apiManager/algod/transaction.ts:90](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/apiManager/algod/transaction.ts#L90)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `txId` | `string` |

#### Returns

`Promise`\<`PendingTransactionResponse`\>

***

### getPendingTransactions()

```ts
function getPendingTransactions(maxTxns?: number): Promise<PendingTransactionsResponse>;
```

Defined in: [defi/protocols/src/vendors/algorand/tools/apiManager/algod/transaction.ts:126](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/apiManager/algod/transaction.ts#L126)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `maxTxns?` | `number` |

#### Returns

`Promise`\<`PendingTransactionsResponse`\>

***

### getPendingTransactionsByAddress()

```ts
function getPendingTransactionsByAddress(address: string): Promise<PendingTransactionsResponse>;
```

Defined in: [defi/protocols/src/vendors/algorand/tools/apiManager/algod/transaction.ts:108](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/apiManager/algod/transaction.ts#L108)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `address` | `string` |

#### Returns

`Promise`\<`PendingTransactionsResponse`\>

***

### getTransactionParams()

```ts
function getTransactionParams(): Promise<SuggestedParamsWithMinFee>;
```

Defined in: [defi/protocols/src/vendors/algorand/tools/apiManager/algod/transaction.ts:148](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/apiManager/algod/transaction.ts#L148)

#### Returns

`Promise`\<`SuggestedParamsWithMinFee`\>

***

### handleTransactionTools()

```ts
function handleTransactionTools(name: string, args: any): Promise<any>;
```

Defined in: [defi/protocols/src/vendors/algorand/tools/apiManager/algod/transaction.ts:202](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/apiManager/algod/transaction.ts#L202)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `name` | `string` |
| `args` | `any` |

#### Returns

`Promise`\<`any`\>
