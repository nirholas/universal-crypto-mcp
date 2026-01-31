[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/bnb/utils/logger

# defi/protocols/src/vendors/bnb/utils/logger

## Classes

### default

Defined in: [defi/protocols/src/vendors/bnb/utils/logger.ts:18](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/bnb/utils/logger.ts#L18)

#### Constructors

##### Constructor

```ts
new default(): default;
```

###### Returns

[`default`](/docs/api/defi/protocols/src/vendors/bnb/utils/logger.md#default)

#### Methods

##### debug()

```ts
static debug(message: string, meta?: any): void;
```

Defined in: [defi/protocols/src/vendors/bnb/utils/logger.ts:48](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/bnb/utils/logger.ts#L48)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `message` | `string` |
| `meta?` | `any` |

###### Returns

`void`

##### error()

```ts
static error(message: string, meta?: any): void;
```

Defined in: [defi/protocols/src/vendors/bnb/utils/logger.ts:66](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/bnb/utils/logger.ts#L66)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `message` | `string` |
| `meta?` | `any` |

###### Returns

`void`

##### getLevel()

```ts
static getLevel(): "DEBUG" | "INFO" | "WARN" | "ERROR";
```

Defined in: [defi/protocols/src/vendors/bnb/utils/logger.ts:72](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/bnb/utils/logger.ts#L72)

###### Returns

`"DEBUG"` \| `"INFO"` \| `"WARN"` \| `"ERROR"`

##### info()

```ts
static info(message: string, meta?: any): void;
```

Defined in: [defi/protocols/src/vendors/bnb/utils/logger.ts:54](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/bnb/utils/logger.ts#L54)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `message` | `string` |
| `meta?` | `any` |

###### Returns

`void`

##### setLogLevel()

```ts
static setLogLevel(level: "DEBUG" | "INFO" | "WARN" | "ERROR"): void;
```

Defined in: [defi/protocols/src/vendors/bnb/utils/logger.ts:44](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/bnb/utils/logger.ts#L44)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `level` | `"DEBUG"` \| `"INFO"` \| `"WARN"` \| `"ERROR"` |

###### Returns

`void`

##### warn()

```ts
static warn(message: string, meta?: any): void;
```

Defined in: [defi/protocols/src/vendors/bnb/utils/logger.ts:60](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/bnb/utils/logger.ts#L60)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `message` | `string` |
| `meta?` | `any` |

###### Returns

`void`
