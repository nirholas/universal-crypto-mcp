[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/bnb/gnfd/services/common

# defi/protocols/src/vendors/bnb/gnfd/services/common

## Functions

### executeTransaction()

```ts
function executeTransaction<T>(
   tx: TxResponse, 
   account: BaseAccount, 
   privateKey: `0x${string}`, 
   operationName: string, 
   successDetail: string): Promise<ApiResponse<T> & {
  txHash?: string;
}>;
```

Defined in: [defi/protocols/src/vendors/bnb/gnfd/services/common.ts:22](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/bnb/gnfd/services/common.ts#L22)

Execute a transaction with proper error handling

#### Type Parameters

| Type Parameter | Default type |
| :------ | :------ |
| `T` | `void` |

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `tx` | `TxResponse` | Transaction to execute |
| `account` | `BaseAccount` | Account details |
| `privateKey` | `` `0x${string}` `` | Private key for signing |
| `operationName` | `string` | Name of operation for logging |
| `successDetail` | `string` | Additional details for success message |

#### Returns

`Promise`\<[`ApiResponse`](/docs/api/defi/protocols/src/vendors/bnb/gnfd/util.md#apiresponse)\<`T`\> & \{
  `txHash?`: `string`;
\}\>
