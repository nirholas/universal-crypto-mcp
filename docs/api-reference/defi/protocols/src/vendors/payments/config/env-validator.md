[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/vendors/payments/config/env-validator

# defi/protocols/src/vendors/payments/config/env-validator

## Classes

### EnvironmentValidator

Defined in: [defi/protocols/src/vendors/payments/config/env-validator.ts:28](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/config/env-validator.ts#L28)

#### Constructors

##### Constructor

```ts
new EnvironmentValidator(): EnvironmentValidator;
```

###### Returns

[`EnvironmentValidator`](/docs/api/defi/protocols/src/vendors/payments/config/env-validator.md#environmentvalidator)

#### Methods

##### generateSetupGuide()

```ts
static generateSetupGuide(validationResult: ValidationResult): string;
```

Defined in: [defi/protocols/src/vendors/payments/config/env-validator.ts:210](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/config/env-validator.ts#L210)

Generate environment setup guide for missing configuration

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `validationResult` | [`ValidationResult`](/docs/api/defi/protocols/src/vendors/payments/config/env-validator.md#validationresult) |

###### Returns

`string`

##### validate()

```ts
static validate(): ValidationResult;
```

Defined in: [defi/protocols/src/vendors/payments/config/env-validator.ts:32](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/config/env-validator.ts#L32)

Validate environment configuration at startup

###### Returns

[`ValidationResult`](/docs/api/defi/protocols/src/vendors/payments/config/env-validator.md#validationresult)

##### validateOrExit()

```ts
static validateOrExit(): Record<string, unknown>;
```

Defined in: [defi/protocols/src/vendors/payments/config/env-validator.ts:265](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/config/env-validator.ts#L265)

Validate configuration and exit if invalid

###### Returns

`Record`\<`string`, `unknown`\>

## Interfaces

### ValidationResult

Defined in: [defi/protocols/src/vendors/payments/config/env-validator.ts:21](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/config/env-validator.ts#L21)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="config"></a> `config?` | `Record`\<`string`, `unknown`\> | [defi/protocols/src/vendors/payments/config/env-validator.ts:25](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/config/env-validator.ts#L25) |
| <a id="errors"></a> `errors` | `string`[] | [defi/protocols/src/vendors/payments/config/env-validator.ts:23](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/config/env-validator.ts#L23) |
| <a id="valid"></a> `valid` | `boolean` | [defi/protocols/src/vendors/payments/config/env-validator.ts:22](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/config/env-validator.ts#L22) |
| <a id="warnings"></a> `warnings` | `string`[] | [defi/protocols/src/vendors/payments/config/env-validator.ts:24](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/vendors/payments/config/env-validator.ts#L24) |

## References

### default

Renames and re-exports [EnvironmentValidator](/docs/api/defi/protocols/src/vendors/payments/config/env-validator.md#environmentvalidator)
