[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/algorand/tools/apiManager/algod/application

# defi/protocols/src/vendors/algorand/tools/apiManager/algod/application

## Variables

### applicationTools

```ts
const applicationTools: (
  | {
  description: string;
  inputSchema: {
     properties: {
        appId: {
           description: string;
           type: string;
        };
        boxName?: undefined;
        maxBoxes?: undefined;
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
        appId: {
           description: string;
           type: string;
        };
        boxName: {
           description: string;
           type: string;
        };
        maxBoxes?: undefined;
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
        appId: {
           description: string;
           type: string;
        };
        boxName?: undefined;
        maxBoxes: {
           description: string;
           type: string;
        };
     };
     required: string[];
     type: string;
  };
  name: string;
})[];
```

Defined in: [defi/protocols/src/vendors/algorand/tools/apiManager/algod/application.ts:16](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/apiManager/algod/application.ts#L16)

## Functions

### getApplicationBoxByName()

```ts
function getApplicationBoxByName(appId: number, boxName: string): Promise<Box>;
```

Defined in: [defi/protocols/src/vendors/algorand/tools/apiManager/algod/application.ts:87](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/apiManager/algod/application.ts#L87)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `appId` | `number` |
| `boxName` | `string` |

#### Returns

`Promise`\<`Box`\>

***

### getApplicationBoxes()

```ts
function getApplicationBoxes(appId: number, maxBoxes?: number): Promise<any>;
```

Defined in: [defi/protocols/src/vendors/algorand/tools/apiManager/algod/application.ts:129](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/apiManager/algod/application.ts#L129)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `appId` | `number` |
| `maxBoxes?` | `number` |

#### Returns

`Promise`\<`any`\>

***

### getApplicationByID()

```ts
function getApplicationByID(appId: number): Promise<any>;
```

Defined in: [defi/protocols/src/vendors/algorand/tools/apiManager/algod/application.ts:69](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/apiManager/algod/application.ts#L69)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `appId` | `number` |

#### Returns

`Promise`\<`any`\>

***

### handleApplicationTools()

```ts
function handleApplicationTools(name: string, args: any): Promise<any>;
```

Defined in: [defi/protocols/src/vendors/algorand/tools/apiManager/algod/application.ts:154](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/apiManager/algod/application.ts#L154)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `name` | `string` |
| `args` | `any` |

#### Returns

`Promise`\<`any`\>
