[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/algorand/tools/utilityManager

# defi/protocols/src/vendors/algorand/tools/utilityManager

## Classes

### UtilityManager

Defined in: [defi/protocols/src/vendors/algorand/tools/utilityManager.ts:86](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/utilityManager.ts#L86)

#### Constructors

##### Constructor

```ts
new UtilityManager(): UtilityManager;
```

###### Returns

[`UtilityManager`](/docs/api/defi/protocols/src/vendors/algorand/tools/utilityManager.md#utilitymanager)

#### Properties

| Property | Modifier | Type | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="utilitytools"></a> `utilityTools` | `readonly` | ( \| \{ `description`: `string`; `inputSchema`: \{ `properties`: \{ \}; `required`: `never`[]; `type`: `string`; \}; `name`: `string`; \} \| \{ `description`: `string`; `inputSchema`: \{ `properties`: \{ `address`: \{ `description`: `string`; `type`: `string`; \}; \}; `required`: `string`[]; `type`: `string`; \}; `name`: `string`; \} \| \{ `description`: `string`; `inputSchema`: \{ `properties`: \{ `publicKey`: \{ `description`: `string`; `type`: `string`; \}; \}; `required`: `string`[]; `type`: `string`; \}; `name`: `string`; \} \| \{ `description`: `string`; `inputSchema`: \{ `properties`: \{ `appId`: \{ `description`: `string`; `type`: `string`; \}; \}; `required`: `string`[]; `type`: `string`; \}; `name`: `string`; \} \| \{ `description`: `string`; `inputSchema`: \{ `properties`: \{ `bytes`: \{ `description`: `string`; `type`: `string`; \}; \}; `required`: `string`[]; `type`: `string`; \}; `name`: `string`; \} \| \{ `description`: `string`; `inputSchema`: \{ `properties`: \{ `value`: \{ `description`: `string`; `type`: `string`; \}; \}; `required`: `string`[]; `type`: `string`; \}; `name`: `string`; \} \| \{ `description`: `string`; `inputSchema`: \{ `properties`: \{ `bytes`: \{ `description`: `string`; `type`: `string`; \}; `obj?`: `undefined`; `sk`: \{ `description`: `string`; `type`: `string`; \}; \}; `required`: `string`[]; `type`: `string`; \}; `name`: `string`; \} \| \{ `description`: `string`; `inputSchema`: \{ `properties`: \{ `bytes?`: `undefined`; `obj`: \{ `description`: `string`; `type`: `string`; \}; `sk?`: `undefined`; \}; `required`: `string`[]; `type`: `string`; \}; `name`: `string`; \})[] | [defi/protocols/src/vendors/algorand/tools/utilityManager.ts:87](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/utilityManager.ts#L87) |

#### Methods

##### bigIntToBytes()

```ts
static bigIntToBytes(value: bigint, size: number): Uint8Array;
```

Defined in: [defi/protocols/src/vendors/algorand/tools/utilityManager.ts:476](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/utilityManager.ts#L476)

Converts a BigInt to bytes

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `value` | `bigint` | The BigInt value to convert |
| `size` | `number` | The size of the resulting byte array |

###### Returns

`Uint8Array`

The bytes representation

##### bytesToBigInt()

```ts
static bytesToBigInt(bytes: Uint8Array): bigint;
```

Defined in: [defi/protocols/src/vendors/algorand/tools/utilityManager.ts:458](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/utilityManager.ts#L458)

Converts bytes to a BigInt

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `bytes` | `Uint8Array` | The bytes to convert |

###### Returns

`bigint`

The BigInt value

##### decodeAddress()

```ts
static decodeAddress(address: string): Uint8Array;
```

Defined in: [defi/protocols/src/vendors/algorand/tools/utilityManager.ts:424](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/utilityManager.ts#L424)

Decodes an Algorand address to a public key

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `address` | `string` | The address to decode |

###### Returns

`Uint8Array`

The decoded public key

##### decodeUint64()

```ts
static decodeUint64(bytes: Uint8Array): bigint;
```

Defined in: [defi/protocols/src/vendors/algorand/tools/utilityManager.ts:511](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/utilityManager.ts#L511)

Decodes bytes to a uint64

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `bytes` | `Uint8Array` | The bytes to decode |

###### Returns

`bigint`

The decoded uint64 value

##### encodeAddress()

```ts
static encodeAddress(publicKey: Buffer): string;
```

Defined in: [defi/protocols/src/vendors/algorand/tools/utilityManager.ts:407](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/utilityManager.ts#L407)

Encodes a public key to an Algorand address

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `publicKey` | `Buffer` | The public key to encode |

###### Returns

`string`

The encoded address

##### encodeUint64()

```ts
static encodeUint64(value: bigint): Uint8Array;
```

Defined in: [defi/protocols/src/vendors/algorand/tools/utilityManager.ts:494](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/utilityManager.ts#L494)

Encodes a uint64 to bytes

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `value` | `bigint` | The uint64 value to encode |

###### Returns

`Uint8Array`

The encoded bytes

##### getApplicationAddress()

```ts
static getApplicationAddress(appId: number): string;
```

Defined in: [defi/protocols/src/vendors/algorand/tools/utilityManager.ts:441](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/utilityManager.ts#L441)

Gets the application address for a given application ID

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `appId` | `number` | The application ID |

###### Returns

`string`

The application address

##### handleTool()

```ts
static handleTool(name: string, args: Record<string, unknown>): Promise<{
  content: {
     text: string;
     type: string;
  }[];
}>;
```

Defined in: [defi/protocols/src/vendors/algorand/tools/utilityManager.ts:177](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/utilityManager.ts#L177)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `name` | `string` |
| `args` | `Record`\<`string`, `unknown`\> |

###### Returns

`Promise`\<\{
  `content`: \{
     `text`: `string`;
     `type`: `string`;
  \}[];
\}\>

##### isValidAddress()

```ts
static isValidAddress(address: string): boolean;
```

Defined in: [defi/protocols/src/vendors/algorand/tools/utilityManager.ts:390](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/utilityManager.ts#L390)

Checks if an address is valid

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `address` | `string` | The address to validate |

###### Returns

`boolean`

True if the address is valid, false otherwise

##### verifyBytes()

```ts
static verifyBytes(
   bytes: Uint8Array, 
   signature: Uint8Array, 
   address: string): boolean;
```

Defined in: [defi/protocols/src/vendors/algorand/tools/utilityManager.ts:530](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/utilityManager.ts#L530)

Verifies a signature against bytes with a public key

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `bytes` | `Uint8Array` | The bytes that were signed |
| `signature` | `Uint8Array` | The signature to verify |
| `address` | `string` | The Algorand address of the signer |

###### Returns

`boolean`

True if the signature is valid

## Variables

### utilityToolSchemas

```ts
const utilityToolSchemas: {
  bigintToBytes: {
     properties: {
        size: {
           description: string;
           type: string;
        };
        value: {
           description: string;
           type: string;
        };
     };
     required: string[];
     type: string;
  };
  bytesToBigint: {
     properties: {
        bytes: {
           description: string;
           type: string;
        };
     };
     required: string[];
     type: string;
  };
  decodeAddress: {
     properties: {
        address: {
           description: string;
           type: string;
        };
     };
     required: string[];
     type: string;
  };
  decodeUint64: {
     properties: {
        bytes: {
           description: string;
           type: string;
        };
     };
     required: string[];
     type: string;
  };
  encodeAddress: {
     properties: {
        publicKey: {
           description: string;
           type: string;
        };
     };
     required: string[];
     type: string;
  };
  encodeUint64: {
     properties: {
        value: {
           description: string;
           type: string;
        };
     };
     required: string[];
     type: string;
  };
  getApplicationAddress: {
     properties: {
        appId: {
           description: string;
           type: string;
        };
     };
     required: string[];
     type: string;
  };
  ping: {
     properties: {
     };
     required: never[];
     type: string;
  };
  validateAddress: {
     properties: {
        address: {
           description: string;
           type: string;
        };
     };
     required: string[];
     type: string;
  };
  verifyBytes: {
     properties: {
        address: {
           description: string;
           type: string;
        };
        bytes: {
           description: string;
           type: string;
        };
        signature: {
           description: string;
           type: string;
        };
     };
     required: string[];
     type: string;
  };
};
```

Defined in: [defi/protocols/src/vendors/algorand/tools/utilityManager.ts:12](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/utilityManager.ts#L12)

#### Type Declaration

| Name | Type | Default value | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="biginttobytes-2"></a> `bigintToBytes` | \{ `properties`: \{ `size`: \{ `description`: `string`; `type`: `string`; \}; `value`: \{ `description`: `string`; `type`: `string`; \}; \}; `required`: `string`[]; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/utilityManager.ts:53](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/utilityManager.ts#L53) |
| `bigintToBytes.properties` | \{ `size`: \{ `description`: `string`; `type`: `string`; \}; `value`: \{ `description`: `string`; `type`: `string`; \}; \} | - | [defi/protocols/src/vendors/algorand/tools/utilityManager.ts:55](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/utilityManager.ts#L55) |
| `bigintToBytes.properties.size` | \{ `description`: `string`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/utilityManager.ts:57](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/utilityManager.ts#L57) |
| `bigintToBytes.properties.size.description` | `string` | `'Size of the resulting byte array'` | [defi/protocols/src/vendors/algorand/tools/utilityManager.ts:57](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/utilityManager.ts#L57) |
| `bigintToBytes.properties.size.type` | `string` | `'integer'` | [defi/protocols/src/vendors/algorand/tools/utilityManager.ts:57](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/utilityManager.ts#L57) |
| `bigintToBytes.properties.value` | \{ `description`: `string`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/utilityManager.ts:56](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/utilityManager.ts#L56) |
| `bigintToBytes.properties.value.description` | `string` | `'BigInt value as a string to convert to bytes'` | [defi/protocols/src/vendors/algorand/tools/utilityManager.ts:56](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/utilityManager.ts#L56) |
| `bigintToBytes.properties.value.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/utilityManager.ts:56](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/utilityManager.ts#L56) |
| `bigintToBytes.required` | `string`[] | - | [defi/protocols/src/vendors/algorand/tools/utilityManager.ts:59](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/utilityManager.ts#L59) |
| `bigintToBytes.type` | `string` | `'object'` | [defi/protocols/src/vendors/algorand/tools/utilityManager.ts:54](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/utilityManager.ts#L54) |
| <a id="bytestobigint-2"></a> `bytesToBigint` | \{ `properties`: \{ `bytes`: \{ `description`: `string`; `type`: `string`; \}; \}; `required`: `string`[]; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/utilityManager.ts:46](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/utilityManager.ts#L46) |
| `bytesToBigint.properties` | \{ `bytes`: \{ `description`: `string`; `type`: `string`; \}; \} | - | [defi/protocols/src/vendors/algorand/tools/utilityManager.ts:48](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/utilityManager.ts#L48) |
| `bytesToBigint.properties.bytes` | \{ `description`: `string`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/utilityManager.ts:49](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/utilityManager.ts#L49) |
| `bytesToBigint.properties.bytes.description` | `string` | `'Bytes in hexadecimal format to convert to a BigInt'` | [defi/protocols/src/vendors/algorand/tools/utilityManager.ts:49](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/utilityManager.ts#L49) |
| `bytesToBigint.properties.bytes.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/utilityManager.ts:49](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/utilityManager.ts#L49) |
| `bytesToBigint.required` | `string`[] | - | [defi/protocols/src/vendors/algorand/tools/utilityManager.ts:51](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/utilityManager.ts#L51) |
| `bytesToBigint.type` | `string` | `'object'` | [defi/protocols/src/vendors/algorand/tools/utilityManager.ts:47](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/utilityManager.ts#L47) |
| <a id="decodeaddress-2"></a> `decodeAddress` | \{ `properties`: \{ `address`: \{ `description`: `string`; `type`: `string`; \}; \}; `required`: `string`[]; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/utilityManager.ts:32](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/utilityManager.ts#L32) |
| `decodeAddress.properties` | \{ `address`: \{ `description`: `string`; `type`: `string`; \}; \} | - | [defi/protocols/src/vendors/algorand/tools/utilityManager.ts:34](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/utilityManager.ts#L34) |
| `decodeAddress.properties.address` | \{ `description`: `string`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/utilityManager.ts:35](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/utilityManager.ts#L35) |
| `decodeAddress.properties.address.description` | `string` | `'Address in standard Algorand format (58 characters) to decode'` | [defi/protocols/src/vendors/algorand/tools/utilityManager.ts:35](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/utilityManager.ts#L35) |
| `decodeAddress.properties.address.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/utilityManager.ts:35](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/utilityManager.ts#L35) |
| `decodeAddress.required` | `string`[] | - | [defi/protocols/src/vendors/algorand/tools/utilityManager.ts:37](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/utilityManager.ts#L37) |
| `decodeAddress.type` | `string` | `'object'` | [defi/protocols/src/vendors/algorand/tools/utilityManager.ts:33](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/utilityManager.ts#L33) |
| <a id="decodeuint64-2"></a> `decodeUint64` | \{ `properties`: \{ `bytes`: \{ `description`: `string`; `type`: `string`; \}; \}; `required`: `string`[]; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/utilityManager.ts:68](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/utilityManager.ts#L68) |
| `decodeUint64.properties` | \{ `bytes`: \{ `description`: `string`; `type`: `string`; \}; \} | - | [defi/protocols/src/vendors/algorand/tools/utilityManager.ts:70](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/utilityManager.ts#L70) |
| `decodeUint64.properties.bytes` | \{ `description`: `string`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/utilityManager.ts:71](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/utilityManager.ts#L71) |
| `decodeUint64.properties.bytes.description` | `string` | `'Bytes in hexadecimal format to decode into a uint64'` | [defi/protocols/src/vendors/algorand/tools/utilityManager.ts:71](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/utilityManager.ts#L71) |
| `decodeUint64.properties.bytes.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/utilityManager.ts:71](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/utilityManager.ts#L71) |
| `decodeUint64.required` | `string`[] | - | [defi/protocols/src/vendors/algorand/tools/utilityManager.ts:73](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/utilityManager.ts#L73) |
| `decodeUint64.type` | `string` | `'object'` | [defi/protocols/src/vendors/algorand/tools/utilityManager.ts:69](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/utilityManager.ts#L69) |
| <a id="encodeaddress-2"></a> `encodeAddress` | \{ `properties`: \{ `publicKey`: \{ `description`: `string`; `type`: `string`; \}; \}; `required`: `string`[]; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/utilityManager.ts:25](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/utilityManager.ts#L25) |
| `encodeAddress.properties` | \{ `publicKey`: \{ `description`: `string`; `type`: `string`; \}; \} | - | [defi/protocols/src/vendors/algorand/tools/utilityManager.ts:27](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/utilityManager.ts#L27) |
| `encodeAddress.properties.publicKey` | \{ `description`: `string`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/utilityManager.ts:28](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/utilityManager.ts#L28) |
| `encodeAddress.properties.publicKey.description` | `string` | `'Public key in hexadecimal format to encode into an address'` | [defi/protocols/src/vendors/algorand/tools/utilityManager.ts:28](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/utilityManager.ts#L28) |
| `encodeAddress.properties.publicKey.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/utilityManager.ts:28](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/utilityManager.ts#L28) |
| `encodeAddress.required` | `string`[] | - | [defi/protocols/src/vendors/algorand/tools/utilityManager.ts:30](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/utilityManager.ts#L30) |
| `encodeAddress.type` | `string` | `'object'` | [defi/protocols/src/vendors/algorand/tools/utilityManager.ts:26](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/utilityManager.ts#L26) |
| <a id="encodeuint64-2"></a> `encodeUint64` | \{ `properties`: \{ `value`: \{ `description`: `string`; `type`: `string`; \}; \}; `required`: `string`[]; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/utilityManager.ts:61](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/utilityManager.ts#L61) |
| `encodeUint64.properties` | \{ `value`: \{ `description`: `string`; `type`: `string`; \}; \} | - | [defi/protocols/src/vendors/algorand/tools/utilityManager.ts:63](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/utilityManager.ts#L63) |
| `encodeUint64.properties.value` | \{ `description`: `string`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/utilityManager.ts:64](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/utilityManager.ts#L64) |
| `encodeUint64.properties.value.description` | `string` | `'Uint64 value as a string to encode into bytes'` | [defi/protocols/src/vendors/algorand/tools/utilityManager.ts:64](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/utilityManager.ts#L64) |
| `encodeUint64.properties.value.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/utilityManager.ts:64](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/utilityManager.ts#L64) |
| `encodeUint64.required` | `string`[] | - | [defi/protocols/src/vendors/algorand/tools/utilityManager.ts:66](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/utilityManager.ts#L66) |
| `encodeUint64.type` | `string` | `'object'` | [defi/protocols/src/vendors/algorand/tools/utilityManager.ts:62](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/utilityManager.ts#L62) |
| <a id="getapplicationaddress-2"></a> `getApplicationAddress` | \{ `properties`: \{ `appId`: \{ `description`: `string`; `type`: `string`; \}; \}; `required`: `string`[]; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/utilityManager.ts:39](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/utilityManager.ts#L39) |
| `getApplicationAddress.properties` | \{ `appId`: \{ `description`: `string`; `type`: `string`; \}; \} | - | [defi/protocols/src/vendors/algorand/tools/utilityManager.ts:41](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/utilityManager.ts#L41) |
| `getApplicationAddress.properties.appId` | \{ `description`: `string`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/utilityManager.ts:42](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/utilityManager.ts#L42) |
| `getApplicationAddress.properties.appId.description` | `string` | `'Application ID to get the address for'` | [defi/protocols/src/vendors/algorand/tools/utilityManager.ts:42](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/utilityManager.ts#L42) |
| `getApplicationAddress.properties.appId.type` | `string` | `'integer'` | [defi/protocols/src/vendors/algorand/tools/utilityManager.ts:42](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/utilityManager.ts#L42) |
| `getApplicationAddress.required` | `string`[] | - | [defi/protocols/src/vendors/algorand/tools/utilityManager.ts:44](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/utilityManager.ts#L44) |
| `getApplicationAddress.type` | `string` | `'object'` | [defi/protocols/src/vendors/algorand/tools/utilityManager.ts:40](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/utilityManager.ts#L40) |
| <a id="ping"></a> `ping` | \{ `properties`: \{ \}; `required`: `never`[]; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/utilityManager.ts:13](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/utilityManager.ts#L13) |
| `ping.properties` | \{ \} | `{}` | [defi/protocols/src/vendors/algorand/tools/utilityManager.ts:15](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/utilityManager.ts#L15) |
| `ping.required` | `never`[] | `[]` | [defi/protocols/src/vendors/algorand/tools/utilityManager.ts:16](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/utilityManager.ts#L16) |
| `ping.type` | `string` | `'object'` | [defi/protocols/src/vendors/algorand/tools/utilityManager.ts:14](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/utilityManager.ts#L14) |
| <a id="validateaddress"></a> `validateAddress` | \{ `properties`: \{ `address`: \{ `description`: `string`; `type`: `string`; \}; \}; `required`: `string`[]; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/utilityManager.ts:18](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/utilityManager.ts#L18) |
| `validateAddress.properties` | \{ `address`: \{ `description`: `string`; `type`: `string`; \}; \} | - | [defi/protocols/src/vendors/algorand/tools/utilityManager.ts:20](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/utilityManager.ts#L20) |
| `validateAddress.properties.address` | \{ `description`: `string`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/utilityManager.ts:21](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/utilityManager.ts#L21) |
| `validateAddress.properties.address.description` | `string` | `'Address in standard Algorand format (58 characters)'` | [defi/protocols/src/vendors/algorand/tools/utilityManager.ts:21](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/utilityManager.ts#L21) |
| `validateAddress.properties.address.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/utilityManager.ts:21](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/utilityManager.ts#L21) |
| `validateAddress.required` | `string`[] | - | [defi/protocols/src/vendors/algorand/tools/utilityManager.ts:23](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/utilityManager.ts#L23) |
| `validateAddress.type` | `string` | `'object'` | [defi/protocols/src/vendors/algorand/tools/utilityManager.ts:19](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/utilityManager.ts#L19) |
| <a id="verifybytes-2"></a> `verifyBytes` | \{ `properties`: \{ `address`: \{ `description`: `string`; `type`: `string`; \}; `bytes`: \{ `description`: `string`; `type`: `string`; \}; `signature`: \{ `description`: `string`; `type`: `string`; \}; \}; `required`: `string`[]; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/utilityManager.ts:75](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/utilityManager.ts#L75) |
| `verifyBytes.properties` | \{ `address`: \{ `description`: `string`; `type`: `string`; \}; `bytes`: \{ `description`: `string`; `type`: `string`; \}; `signature`: \{ `description`: `string`; `type`: `string`; \}; \} | - | [defi/protocols/src/vendors/algorand/tools/utilityManager.ts:77](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/utilityManager.ts#L77) |
| `verifyBytes.properties.address` | \{ `description`: `string`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/utilityManager.ts:80](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/utilityManager.ts#L80) |
| `verifyBytes.properties.address.description` | `string` | `'Algorand account address'` | [defi/protocols/src/vendors/algorand/tools/utilityManager.ts:80](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/utilityManager.ts#L80) |
| `verifyBytes.properties.address.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/utilityManager.ts:80](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/utilityManager.ts#L80) |
| `verifyBytes.properties.bytes` | \{ `description`: `string`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/utilityManager.ts:78](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/utilityManager.ts#L78) |
| `verifyBytes.properties.bytes.description` | `string` | `'Bytes in hexadecimal format to verify'` | [defi/protocols/src/vendors/algorand/tools/utilityManager.ts:78](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/utilityManager.ts#L78) |
| `verifyBytes.properties.bytes.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/utilityManager.ts:78](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/utilityManager.ts#L78) |
| `verifyBytes.properties.signature` | \{ `description`: `string`; `type`: `string`; \} | - | [defi/protocols/src/vendors/algorand/tools/utilityManager.ts:79](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/utilityManager.ts#L79) |
| `verifyBytes.properties.signature.description` | `string` | `'Base64-encoded signature to verify'` | [defi/protocols/src/vendors/algorand/tools/utilityManager.ts:79](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/utilityManager.ts#L79) |
| `verifyBytes.properties.signature.type` | `string` | `'string'` | [defi/protocols/src/vendors/algorand/tools/utilityManager.ts:79](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/utilityManager.ts#L79) |
| `verifyBytes.required` | `string`[] | - | [defi/protocols/src/vendors/algorand/tools/utilityManager.ts:82](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/utilityManager.ts#L82) |
| `verifyBytes.type` | `string` | `'object'` | [defi/protocols/src/vendors/algorand/tools/utilityManager.ts:76](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/algorand/tools/utilityManager.ts#L76) |
