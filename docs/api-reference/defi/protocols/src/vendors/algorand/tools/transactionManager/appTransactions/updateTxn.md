[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/updateTxn

# defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/updateTxn

## Functions

### handleUpdateTxn()

```ts
function handleUpdateTxn(args: Record<string, unknown>, suggestedParams: any): Record<string, any>;
```

Defined in: [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/updateTxn.ts:54](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/updateTxn.ts#L54)

Handles the application update tool request

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `args` | `Record`\<`string`, `unknown`\> | The tool arguments |
| `suggestedParams` | `any` | The suggested transaction parameters |

#### Returns

`Record`\<`string`, `any`\>

The transaction parameters

#### Throws

If the parameters are invalid

***

### makeApplicationUpdateTxn()

```ts
function makeApplicationUpdateTxn(params: AppUpdateTxnParams): Transaction;
```

Defined in: [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/updateTxn.ts:17](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/updateTxn.ts#L17)

Creates an application update transaction

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `params` | [`AppUpdateTxnParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#appupdatetxnparams) | The parameters for updating the application |

#### Returns

`Transaction`

The created transaction

#### Throws

If the transaction creation fails
