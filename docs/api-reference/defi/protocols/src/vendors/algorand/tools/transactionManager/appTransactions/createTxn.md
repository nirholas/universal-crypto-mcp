[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/createTxn

# defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/createTxn

## Functions

### handleCreateTxn()

```ts
function handleCreateTxn(args: Record<string, unknown>, suggestedParams: any): Record<string, any>;
```

Defined in: [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/createTxn.ts:73](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/createTxn.ts#L73)

Handles the application creation tool request

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

### makeApplicationCreateTxn()

```ts
function makeApplicationCreateTxn(params: AppCreateTxnParams): Transaction;
```

Defined in: [defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/createTxn.ts:17](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/createTxn.ts#L17)

Creates an application creation transaction

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `params` | [`AppCreateTxnParams`](/docs/api/defi/protocols/src/vendors/algorand/tools/transactionManager/appTransactions/types.md#appcreatetxnparams) | The parameters for creating the application |

#### Returns

`Transaction`

The created transaction

#### Throws

If the transaction creation fails
