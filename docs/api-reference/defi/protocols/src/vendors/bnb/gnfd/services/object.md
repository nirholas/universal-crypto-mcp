[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/bnb/gnfd/services/object

# defi/protocols/src/vendors/bnb/gnfd/services/object

## Functions

### createFile()

```ts
function createFile(network: "testnet" | "mainnet", __namedParameters: {
  bucketName?: string;
  filePath: string;
  privateKey: `0x${string}`;
}): Promise<ApiResponse<FileData>>;
```

Defined in: [defi/protocols/src/vendors/bnb/gnfd/services/object.ts:58](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/bnb/gnfd/services/object.ts#L58)

Create a file in Greenfield

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `network` | `"testnet"` \| `"mainnet"` |
| `__namedParameters` | \{ `bucketName?`: `string`; `filePath`: `string`; `privateKey`: `` `0x${string}` ``; \} |
| `__namedParameters.bucketName?` | `string` |
| `__namedParameters.filePath` | `string` |
| `__namedParameters.privateKey` | `` `0x${string}` `` |

#### Returns

`Promise`\<[`ApiResponse`](/docs/api/defi/protocols/src/vendors/bnb/gnfd/util.md#apiresponse)\<`FileData`\>\>

***

### createFolder()

```ts
function createFolder(network: "testnet" | "mainnet", __namedParameters: {
  bucketName?: string;
  folderName?: string;
  privateKey: `0x${string}`;
}): Promise<ApiResponse<{
  bucketName: string;
  folderName: string;
}>>;
```

Defined in: [defi/protocols/src/vendors/bnb/gnfd/services/object.ts:165](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/bnb/gnfd/services/object.ts#L165)

Create folder in Greenfield

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `network` | `"testnet"` \| `"mainnet"` |
| `__namedParameters` | \{ `bucketName?`: `string`; `folderName?`: `string`; `privateKey`: `` `0x${string}` ``; \} |
| `__namedParameters.bucketName?` | `string` |
| `__namedParameters.folderName?` | `string` |
| `__namedParameters.privateKey` | `` `0x${string}` `` |

#### Returns

`Promise`\<[`ApiResponse`](/docs/api/defi/protocols/src/vendors/bnb/gnfd/util.md#apiresponse)\<\{
  `bucketName`: `string`;
  `folderName`: `string`;
\}\>\>

***

### deleteObject()

```ts
function deleteObject(network: "testnet" | "mainnet", __namedParameters: {
  bucketName: string;
  objectName: string;
  privateKey: `0x${string}`;
}): Promise<ApiResponse<void>>;
```

Defined in: [defi/protocols/src/vendors/bnb/gnfd/services/object.ts:259](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/bnb/gnfd/services/object.ts#L259)

Delete an object in Greenfield

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `network` | `"testnet"` \| `"mainnet"` |
| `__namedParameters` | \{ `bucketName`: `string`; `objectName`: `string`; `privateKey`: `` `0x${string}` ``; \} |
| `__namedParameters.bucketName` | `string` |
| `__namedParameters.objectName` | `string` |
| `__namedParameters.privateKey` | `` `0x${string}` `` |

#### Returns

`Promise`\<[`ApiResponse`](/docs/api/defi/protocols/src/vendors/bnb/gnfd/util.md#apiresponse)\<`void`\>\>

***

### downloadObject()

```ts
function downloadObject(network: "testnet" | "mainnet", __namedParameters: {
  bucketName: string;
  objectName: string;
  privateKey: `0x${string}`;
  targetPath?: string;
}): Promise<ApiResponse<{
  file: string;
}>>;
```

Defined in: [defi/protocols/src/vendors/bnb/gnfd/services/object.ts:358](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/bnb/gnfd/services/object.ts#L358)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `network` | `"testnet"` \| `"mainnet"` |
| `__namedParameters` | \{ `bucketName`: `string`; `objectName`: `string`; `privateKey`: `` `0x${string}` ``; `targetPath?`: `string`; \} |
| `__namedParameters.bucketName` | `string` |
| `__namedParameters.objectName` | `string` |
| `__namedParameters.privateKey` | `` `0x${string}` `` |
| `__namedParameters.targetPath?` | `string` |

#### Returns

`Promise`\<[`ApiResponse`](/docs/api/defi/protocols/src/vendors/bnb/gnfd/util.md#apiresponse)\<\{
  `file`: `string`;
\}\>\>

***

### getObjectInfo()

```ts
function getObjectInfo(network: "testnet" | "mainnet", __namedParameters: {
  bucketName: string;
  objectName: string;
}): Promise<ApiResponse<ObjectInfo>>;
```

Defined in: [defi/protocols/src/vendors/bnb/gnfd/services/object.ts:235](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/bnb/gnfd/services/object.ts#L235)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `network` | `"testnet"` \| `"mainnet"` |
| `__namedParameters` | \{ `bucketName`: `string`; `objectName`: `string`; \} |
| `__namedParameters.bucketName` | `string` |
| `__namedParameters.objectName` | `string` |

#### Returns

`Promise`\<[`ApiResponse`](/docs/api/defi/protocols/src/vendors/bnb/gnfd/util.md#apiresponse)\<`ObjectInfo`\>\>

***

### listObjects()

```ts
function listObjects(network: "testnet" | "mainnet", bucketName: string): Promise<ApiResponse<{
  objects: {
     createAt: number;
     objectName: string;
  }[];
}>>;
```

Defined in: [defi/protocols/src/vendors/bnb/gnfd/services/object.ts:316](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/bnb/gnfd/services/object.ts#L316)

List objects in a bucket in Greenfield

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `network` | `"testnet"` \| `"mainnet"` | Greenfield network (testnet or mainnet) |
| `bucketName` | `string` | Name of the bucket to list objects from |

#### Returns

`Promise`\<[`ApiResponse`](/docs/api/defi/protocols/src/vendors/bnb/gnfd/util.md#apiresponse)\<\{
  `objects`: \{
     `createAt`: `number`;
     `objectName`: `string`;
  \}[];
\}\>\>

List of objects with their details
