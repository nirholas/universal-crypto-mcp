[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/optInTxn

# defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/optInTxn

## Functions

### handleOptInTxn()

```ts
function handleOptInTxn(args: Record<string, unknown>, suggestedParams: any): Record<string, any>;
```

Defined in: [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/optInTxn.ts:55](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/optInTxn.ts#L55)

Handles the application opt-in tool request

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

### makeApplicationOptInTxn()

```ts
function makeApplicationOptInTxn(params: AppOptInTxnParams): Transaction;
```

Defined in: [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/optInTxn.ts:17](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/optInTxn.ts#L17)

Creates an application opt-in transaction

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `params` | [`AppOptInTxnParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#appoptintxnparams) | The parameters for opting into the application |

#### Returns

`Transaction`

The created transaction

#### Throws

If the transaction creation fails
