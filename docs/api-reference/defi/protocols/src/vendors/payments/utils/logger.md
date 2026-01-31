[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/payments/utils/logger

# defi/protocols/src/vendors/payments/utils/logger

## Classes

### DataMasker

Defined in: [defi/protocols/src/vendors/payments/utils/logger.ts:23](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/logger.ts#L23)

#### Constructors

##### Constructor

```ts
new DataMasker(): DataMasker;
```

###### Returns

[`DataMasker`](/docs/api/defi/protocols/src/vendors/payments/utils/logger.md#datamasker)

#### Methods

##### maskAmount()

```ts
static maskAmount(amount: number | undefined, precision: number): string;
```

Defined in: [defi/protocols/src/vendors/payments/utils/logger.ts:126](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/logger.ts#L126)

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `amount` | `number` \| `undefined` | `undefined` |
| `precision` | `number` | `2` |

###### Returns

`string`

##### maskObject()

```ts
static maskObject(obj: unknown): unknown;
```

Defined in: [defi/protocols/src/vendors/payments/utils/logger.ts:67](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/logger.ts#L67)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `obj` | `unknown` |

###### Returns

`unknown`

##### maskString()

```ts
static maskString(str: string): string;
```

Defined in: [defi/protocols/src/vendors/payments/utils/logger.ts:109](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/logger.ts#L109)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `str` | `string` |

###### Returns

`string`

## Functions

### getLogger()

```ts
function getLogger(): Logger;
```

Defined in: [defi/protocols/src/vendors/payments/utils/logger.ts:311](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/logger.ts#L311)

#### Returns

`Logger`

***

### resetLogger()

```ts
function resetLogger(): void;
```

Defined in: [defi/protocols/src/vendors/payments/utils/logger.ts:318](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/utils/logger.ts#L318)

#### Returns

`void`
