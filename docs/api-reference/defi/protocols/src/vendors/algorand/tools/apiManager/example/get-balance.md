[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/algorand/tools/apiManager/example/get-balance

# defi/protocols/src/vendors/algorand/tools/apiManager/example/get-balance

## Variables

### getBalanceToolSchema

```ts
const getBalanceToolSchema: {
  properties: any;
  required: string[];
  type: "object";
};
```

Defined in: [defi/protocols/src/vendors/algorand/tools/apiManager/example/get-balance.ts:20](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/apiManager/example/get-balance.ts#L20)

Example tool to demonstrate implementation patterns
Gets account balance and assets for a given address

#### Type Declaration

| Name | Type | Defined in |
| :------ | :------ | :------ |
| <a id="properties"></a> `properties` | `any` | [defi/protocols/src/vendors/algorand/tools/apiManager/example/get-balance.ts:20](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/apiManager/example/get-balance.ts#L20) |
| <a id="required"></a> `required` | `string`[] | [defi/protocols/src/vendors/algorand/tools/apiManager/example/get-balance.ts:20](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/apiManager/example/get-balance.ts#L20) |
| <a id="type"></a> `type` | `"object"` | [defi/protocols/src/vendors/algorand/tools/apiManager/example/get-balance.ts:20](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/apiManager/example/get-balance.ts#L20) |

#### Param

Tool arguments

#### Param

Algorand address to check

#### Returns

Account balance information including assets

#### Throws

If address is invalid or operation fails

## Functions

### getBalanceTool()

```ts
function getBalanceTool(args: {
  address: string;
}): Promise<any>;
```

Defined in: [defi/protocols/src/vendors/algorand/tools/apiManager/example/get-balance.ts:31](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/apiManager/example/get-balance.ts#L31)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `args` | \{ `address`: `string`; \} |
| `args.address` | `string` |

#### Returns

`Promise`\<`any`\>
