[**Universal Crypto MCP API Reference v1.0.0**](../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/x402/server/config

# defi/protocols/src/x402/server/config

## Functions

### clearX402ServerConfigCache()

```ts
function clearX402ServerConfigCache(): void;
```

Defined in: [defi/protocols/src/x402/server/config.ts:171](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/config.ts#L171)

Clear cached config (for testing)

#### Returns

`void`

***

### getSafeConfigForLogging()

```ts
function getSafeConfigForLogging(config: X402ServerConfig): Record<string, unknown>;
```

Defined in: [defi/protocols/src/x402/server/config.ts:189](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/config.ts#L189)

Get safe config for logging (no secrets)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `config` | [`X402ServerConfig`](/docs/api/defi/protocols/src/x402/server/types.md#x402serverconfig) |

#### Returns

`Record`\<`string`, `unknown`\>

***

### isX402ServerConfigured()

```ts
function isX402ServerConfigured(): boolean;
```

Defined in: [defi/protocols/src/x402/server/config.ts:108](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/config.ts#L108)

Check if server is properly configured

#### Returns

`boolean`

***

### loadX402ServerConfig()

```ts
function loadX402ServerConfig(): X402ServerConfig;
```

Defined in: [defi/protocols/src/x402/server/config.ts:61](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/config.ts#L61)

Load x402 server configuration from environment variables

#### Returns

[`X402ServerConfig`](/docs/api/defi/protocols/src/x402/server/types.md#x402serverconfig)

***

### logX402ServerConfig()

```ts
function logX402ServerConfig(): void;
```

Defined in: [defi/protocols/src/x402/server/config.ts:204](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/config.ts#L204)

Log current configuration

#### Returns

`void`

***

### setX402ServerConfig()

```ts
function setX402ServerConfig(config: X402ServerConfig): void;
```

Defined in: [defi/protocols/src/x402/server/config.ts:178](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/config.ts#L178)

Set config programmatically (for testing or custom setup)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `config` | [`X402ServerConfig`](/docs/api/defi/protocols/src/x402/server/types.md#x402serverconfig) |

#### Returns

`void`

***

### validateX402ServerConfig()

```ts
function validateX402ServerConfig(config: X402ServerConfig): {
  errors: string[];
  valid: boolean;
  warnings: string[];
};
```

Defined in: [defi/protocols/src/x402/server/config.ts:116](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/config.ts#L116)

Validate server configuration

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `config` | [`X402ServerConfig`](/docs/api/defi/protocols/src/x402/server/types.md#x402serverconfig) |

#### Returns

```ts
{
  errors: string[];
  valid: boolean;
  warnings: string[];
}
```

| Name | Type | Defined in |
| :------ | :------ | :------ |
| `errors` | `string`[] | [defi/protocols/src/x402/server/config.ts:118](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/config.ts#L118) |
| `valid` | `boolean` | [defi/protocols/src/x402/server/config.ts:117](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/config.ts#L117) |
| `warnings` | `string`[] | [defi/protocols/src/x402/server/config.ts:119](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/server/config.ts#L119) |
