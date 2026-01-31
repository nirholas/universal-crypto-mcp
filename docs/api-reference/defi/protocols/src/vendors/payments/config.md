[**Universal Crypto MCP API Reference v1.0.0**](../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/payments/config

# defi/protocols/src/vendors/payments/config

## Classes

### ConfigurationError

Defined in: [defi/protocols/src/vendors/payments/config/index.ts:13](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/config/index.ts#L13)

#### Extends

- `Error`

#### Constructors

##### Constructor

```ts
new ConfigurationError(message: string): ConfigurationError;
```

Defined in: [defi/protocols/src/vendors/payments/config/index.ts:14](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/config/index.ts#L14)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `message` | `string` |

###### Returns

[`ConfigurationError`](/docs/api/defi/protocols/src/vendors/payments/config.md#configurationerror)

###### Overrides

```ts
Error.constructor
```

## Functions

### getConfig()

```ts
function getConfig(): Configuration;
```

Defined in: [defi/protocols/src/vendors/payments/config/index.ts:159](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/config/index.ts#L159)

#### Returns

[`Configuration`](/docs/api/defi/protocols/src/vendors/payments/types.md#configuration)

***

### getMaskedConfig()

```ts
function getMaskedConfig(config: Configuration): Record<string, unknown>;
```

Defined in: [defi/protocols/src/vendors/payments/config/index.ts:134](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/config/index.ts#L134)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `config` | [`Configuration`](/docs/api/defi/protocols/src/vendors/payments/types.md#configuration) |

#### Returns

`Record`\<`string`, `unknown`\>

***

### isDevelopment()

```ts
function isDevelopment(): boolean;
```

Defined in: [defi/protocols/src/vendors/payments/config/index.ts:171](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/config/index.ts#L171)

#### Returns

`boolean`

***

### isProduction()

```ts
function isProduction(): boolean;
```

Defined in: [defi/protocols/src/vendors/payments/config/index.ts:175](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/config/index.ts#L175)

#### Returns

`boolean`

***

### isTest()

```ts
function isTest(): boolean;
```

Defined in: [defi/protocols/src/vendors/payments/config/index.ts:179](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/config/index.ts#L179)

#### Returns

`boolean`

***

### loadConfiguration()

```ts
function loadConfiguration(): Configuration;
```

Defined in: [defi/protocols/src/vendors/payments/config/index.ts:70](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/config/index.ts#L70)

#### Returns

[`Configuration`](/docs/api/defi/protocols/src/vendors/payments/types.md#configuration)

***

### maskDeviceId()

```ts
function maskDeviceId(deviceId: string): string;
```

Defined in: [defi/protocols/src/vendors/payments/config/index.ts:149](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/config/index.ts#L149)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `deviceId` | `string` |

#### Returns

`string`

***

### resetConfig()

```ts
function resetConfig(): void;
```

Defined in: [defi/protocols/src/vendors/payments/config/index.ts:166](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/config/index.ts#L166)

#### Returns

`void`
