[**Universal Crypto MCP API Reference v1.0.0**](../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/tatum-api/api-client

# defi/protocols/src/vendors/tatum-api/api-client

## Classes

### TatumApiClient

Defined in: [defi/protocols/src/vendors/tatum-api/api-client.ts:10](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/tatum-api/api-client.ts#L10)

#### Constructors

##### Constructor

```ts
new TatumApiClient(context: ToolExecutionContext): TatumApiClient;
```

Defined in: [defi/protocols/src/vendors/tatum-api/api-client.ts:14](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/tatum-api/api-client.ts#L14)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `context` | [`ToolExecutionContext`](/docs/api/defi/protocols/src/vendors/tatum-api/types.md#toolexecutioncontext) |

###### Returns

[`TatumApiClient`](/docs/api/defi/protocols/src/vendors/tatum-api/api-client.md#tatumapiclient)

#### Methods

##### executeRequest()

```ts
executeRequest(
   method: string, 
   path: string, 
parameters: Record<string, any>): Promise<TatumApiResponse>;
```

Defined in: [defi/protocols/src/vendors/tatum-api/api-client.ts:42](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/tatum-api/api-client.ts#L42)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `method` | `string` |
| `path` | `string` |
| `parameters` | `Record`\<`string`, `any`\> |

###### Returns

`Promise`\<[`TatumApiResponse`](/docs/api/defi/protocols/src/vendors/tatum-api/types.md#tatumapiresponse)\>
