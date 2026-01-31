[**Universal Crypto MCP API Reference v1.0.0**](index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / secrets

# secrets

Secrets Management Abstraction

Provides a unified interface for secret management with support for
environment variables, file-based secrets, and vault integrations.

## Author

nich <nich@nichxbt.com>

## Classes

### EnvSecretProvider

Defined in: [shared/utils/src/secrets/index.ts:53](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/secrets/index.ts#L53)

Provider that reads secrets from environment variables

#### Implements

- [`SecretProvider`](/docs/api/secrets.md#secretprovider)

#### Constructors

##### Constructor

```ts
new EnvSecretProvider(prefix: string): EnvSecretProvider;
```

Defined in: [shared/utils/src/secrets/index.ts:57](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/secrets/index.ts#L57)

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `prefix` | `string` | `''` |

###### Returns

[`EnvSecretProvider`](/docs/api/secrets.md#envsecretprovider)

#### Properties

| Property | Type | Default value | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="name"></a> `name` | `string` | `'env'` | [shared/utils/src/secrets/index.ts:54](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/secrets/index.ts#L54) |

#### Methods

##### delete()

```ts
delete(key: string): Promise<void>;
```

Defined in: [shared/utils/src/secrets/index.ts:73](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/secrets/index.ts#L73)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `key` | `string` |

###### Returns

`Promise`\<`void`\>

###### Implementation of

[`SecretProvider`](/docs/api/secrets.md#secretprovider).[`delete`](/docs/api/secrets.md#delete-4)

##### get()

```ts
get(key: string): Promise<string | undefined>;
```

Defined in: [shared/utils/src/secrets/index.ts:61](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/secrets/index.ts#L61)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `key` | `string` |

###### Returns

`Promise`\<`string` \| `undefined`\>

###### Implementation of

[`SecretProvider`](/docs/api/secrets.md#secretprovider).[`get`](/docs/api/secrets.md#get-8)

##### has()

```ts
has(key: string): Promise<boolean>;
```

Defined in: [shared/utils/src/secrets/index.ts:65](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/secrets/index.ts#L65)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `key` | `string` |

###### Returns

`Promise`\<`boolean`\>

###### Implementation of

[`SecretProvider`](/docs/api/secrets.md#secretprovider).[`has`](/docs/api/secrets.md#has-8)

##### list()

```ts
list(): Promise<string[]>;
```

Defined in: [shared/utils/src/secrets/index.ts:77](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/secrets/index.ts#L77)

###### Returns

`Promise`\<`string`[]\>

###### Implementation of

[`SecretProvider`](/docs/api/secrets.md#secretprovider).[`list`](/docs/api/secrets.md#list-6)

##### set()

```ts
set(key: string, value: string): Promise<void>;
```

Defined in: [shared/utils/src/secrets/index.ts:69](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/secrets/index.ts#L69)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `key` | `string` |
| `value` | `string` |

###### Returns

`Promise`\<`void`\>

###### Implementation of

[`SecretProvider`](/docs/api/secrets.md#secretprovider).[`set`](/docs/api/secrets.md#set-4)

***

### FileSecretProvider

Defined in: [shared/utils/src/secrets/index.ts:91](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/secrets/index.ts#L91)

Provider that reads secrets from files (Docker secrets, Kubernetes, etc.)

#### Implements

- [`SecretProvider`](/docs/api/secrets.md#secretprovider)

#### Constructors

##### Constructor

```ts
new FileSecretProvider(basePath: string): FileSecretProvider;
```

Defined in: [shared/utils/src/secrets/index.ts:96](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/secrets/index.ts#L96)

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `basePath` | `string` | `'/run/secrets'` |

###### Returns

[`FileSecretProvider`](/docs/api/secrets.md#filesecretprovider)

#### Properties

| Property | Type | Default value | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="name-1"></a> `name` | `string` | `'file'` | [shared/utils/src/secrets/index.ts:92](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/secrets/index.ts#L92) |

#### Methods

##### get()

```ts
get(key: string): Promise<string | undefined>;
```

Defined in: [shared/utils/src/secrets/index.ts:100](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/secrets/index.ts#L100)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `key` | `string` |

###### Returns

`Promise`\<`string` \| `undefined`\>

###### Implementation of

[`SecretProvider`](/docs/api/secrets.md#secretprovider).[`get`](/docs/api/secrets.md#get-8)

##### has()

```ts
has(key: string): Promise<boolean>;
```

Defined in: [shared/utils/src/secrets/index.ts:117](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/secrets/index.ts#L117)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `key` | `string` |

###### Returns

`Promise`\<`boolean`\>

###### Implementation of

[`SecretProvider`](/docs/api/secrets.md#secretprovider).[`has`](/docs/api/secrets.md#has-8)

##### list()

```ts
list(): Promise<string[]>;
```

Defined in: [shared/utils/src/secrets/index.ts:122](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/secrets/index.ts#L122)

###### Returns

`Promise`\<`string`[]\>

###### Implementation of

[`SecretProvider`](/docs/api/secrets.md#secretprovider).[`list`](/docs/api/secrets.md#list-6)

***

### MemorySecretProvider

Defined in: [shared/utils/src/secrets/index.ts:139](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/secrets/index.ts#L139)

In-memory provider for testing

#### Implements

- [`SecretProvider`](/docs/api/secrets.md#secretprovider)

#### Constructors

##### Constructor

```ts
new MemorySecretProvider(initial?: Record<string, string>): MemorySecretProvider;
```

Defined in: [shared/utils/src/secrets/index.ts:143](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/secrets/index.ts#L143)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `initial?` | `Record`\<`string`, `string`\> |

###### Returns

[`MemorySecretProvider`](/docs/api/secrets.md#memorysecretprovider)

#### Properties

| Property | Type | Default value | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="name-2"></a> `name` | `string` | `'memory'` | [shared/utils/src/secrets/index.ts:140](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/secrets/index.ts#L140) |

#### Methods

##### delete()

```ts
delete(key: string): Promise<void>;
```

Defined in: [shared/utils/src/secrets/index.ts:163](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/secrets/index.ts#L163)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `key` | `string` |

###### Returns

`Promise`\<`void`\>

###### Implementation of

[`SecretProvider`](/docs/api/secrets.md#secretprovider).[`delete`](/docs/api/secrets.md#delete-4)

##### get()

```ts
get(key: string): Promise<string | undefined>;
```

Defined in: [shared/utils/src/secrets/index.ts:151](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/secrets/index.ts#L151)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `key` | `string` |

###### Returns

`Promise`\<`string` \| `undefined`\>

###### Implementation of

[`SecretProvider`](/docs/api/secrets.md#secretprovider).[`get`](/docs/api/secrets.md#get-8)

##### has()

```ts
has(key: string): Promise<boolean>;
```

Defined in: [shared/utils/src/secrets/index.ts:155](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/secrets/index.ts#L155)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `key` | `string` |

###### Returns

`Promise`\<`boolean`\>

###### Implementation of

[`SecretProvider`](/docs/api/secrets.md#secretprovider).[`has`](/docs/api/secrets.md#has-8)

##### list()

```ts
list(): Promise<string[]>;
```

Defined in: [shared/utils/src/secrets/index.ts:167](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/secrets/index.ts#L167)

###### Returns

`Promise`\<`string`[]\>

###### Implementation of

[`SecretProvider`](/docs/api/secrets.md#secretprovider).[`list`](/docs/api/secrets.md#list-6)

##### set()

```ts
set(key: string, value: string): Promise<void>;
```

Defined in: [shared/utils/src/secrets/index.ts:159](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/secrets/index.ts#L159)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `key` | `string` |
| `value` | `string` |

###### Returns

`Promise`\<`void`\>

###### Implementation of

[`SecretProvider`](/docs/api/secrets.md#secretprovider).[`set`](/docs/api/secrets.md#set-4)

***

### SecretsManager

Defined in: [shared/utils/src/secrets/index.ts:179](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/secrets/index.ts#L179)

Unified secrets manager with caching and multiple providers

#### Constructors

##### Constructor

```ts
new SecretsManager(config: SecretsConfig): SecretsManager;
```

Defined in: [shared/utils/src/secrets/index.ts:189](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/secrets/index.ts#L189)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `config` | [`SecretsConfig`](/docs/api/secrets.md#secretsconfig) |

###### Returns

[`SecretsManager`](/docs/api/secrets.md#secretsmanager)

#### Methods

##### clearCache()

```ts
clearCache(): void;
```

Defined in: [shared/utils/src/secrets/index.ts:307](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/secrets/index.ts#L307)

Clear the cache

###### Returns

`void`

##### get()

```ts
get(key: string): Promise<string | undefined>;
```

Defined in: [shared/utils/src/secrets/index.ts:201](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/secrets/index.ts#L201)

Get a secret value

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `key` | `string` |

###### Returns

`Promise`\<`string` \| `undefined`\>

##### getCacheStats()

```ts
getCacheStats(): {
  hits: number;
  misses: number;
  size: number;
};
```

Defined in: [shared/utils/src/secrets/index.ts:314](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/secrets/index.ts#L314)

Get cache statistics

###### Returns

```ts
{
  hits: number;
  misses: number;
  size: number;
}
```

| Name | Type | Defined in |
| :------ | :------ | :------ |
| `hits` | `number` | [shared/utils/src/secrets/index.ts:314](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/secrets/index.ts#L314) |
| `misses` | `number` | [shared/utils/src/secrets/index.ts:314](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/secrets/index.ts#L314) |
| `size` | `number` | [shared/utils/src/secrets/index.ts:314](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/secrets/index.ts#L314) |

##### getMany()

```ts
getMany(keys: string[]): Promise<Record<string, string | undefined>>;
```

Defined in: [shared/utils/src/secrets/index.ts:294](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/secrets/index.ts#L294)

Get multiple secrets at once

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `keys` | `string`[] |

###### Returns

`Promise`\<`Record`\<`string`, `string` \| `undefined`\>\>

##### getOrDefault()

```ts
getOrDefault(key: string, defaultValue: string): Promise<string>;
```

Defined in: [shared/utils/src/secrets/index.ts:248](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/secrets/index.ts#L248)

Get a secret with a default value

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `key` | `string` |
| `defaultValue` | `string` |

###### Returns

`Promise`\<`string`\>

##### getRequired()

```ts
getRequired(key: string): Promise<string>;
```

Defined in: [shared/utils/src/secrets/index.ts:237](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/secrets/index.ts#L237)

Get a required secret (throws if missing)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `key` | `string` |

###### Returns

`Promise`\<`string`\>

##### has()

```ts
has(key: string): Promise<boolean>;
```

Defined in: [shared/utils/src/secrets/index.ts:256](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/secrets/index.ts#L256)

Check if a secret exists

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `key` | `string` |

###### Returns

`Promise`\<`boolean`\>

##### validate()

```ts
validate(): Promise<void>;
```

Defined in: [shared/utils/src/secrets/index.ts:271](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/secrets/index.ts#L271)

Validate all required secrets exist

###### Returns

`Promise`\<`void`\>

## Interfaces

### ApiCredentials

Defined in: [shared/utils/src/secrets/index.ts:383](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/secrets/index.ts#L383)

API credentials structure

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="apikey"></a> `apiKey` | `string` | [shared/utils/src/secrets/index.ts:384](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/secrets/index.ts#L384) |
| <a id="apisecret"></a> `apiSecret?` | `string` | [shared/utils/src/secrets/index.ts:385](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/secrets/index.ts#L385) |
| <a id="passphrase"></a> `passphrase?` | `string` | [shared/utils/src/secrets/index.ts:386](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/secrets/index.ts#L386) |

***

### CachedSecret

Defined in: [shared/utils/src/secrets/index.ts:41](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/secrets/index.ts#L41)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="expiresat"></a> `expiresAt` | `number` | [shared/utils/src/secrets/index.ts:43](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/secrets/index.ts#L43) |
| <a id="value"></a> `value` | `string` | [shared/utils/src/secrets/index.ts:42](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/secrets/index.ts#L42) |

***

### SecretProvider

Defined in: [shared/utils/src/secrets/index.ts:17](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/secrets/index.ts#L17)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="name-3"></a> `name` | `string` | [shared/utils/src/secrets/index.ts:18](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/secrets/index.ts#L18) |

#### Methods

##### delete()?

```ts
optional delete(key: string): Promise<void>;
```

Defined in: [shared/utils/src/secrets/index.ts:22](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/secrets/index.ts#L22)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `key` | `string` |

###### Returns

`Promise`\<`void`\>

##### get()

```ts
get(key: string): Promise<string | undefined>;
```

Defined in: [shared/utils/src/secrets/index.ts:19](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/secrets/index.ts#L19)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `key` | `string` |

###### Returns

`Promise`\<`string` \| `undefined`\>

##### has()

```ts
has(key: string): Promise<boolean>;
```

Defined in: [shared/utils/src/secrets/index.ts:20](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/secrets/index.ts#L20)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `key` | `string` |

###### Returns

`Promise`\<`boolean`\>

##### list()?

```ts
optional list(): Promise<string[]>;
```

Defined in: [shared/utils/src/secrets/index.ts:23](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/secrets/index.ts#L23)

###### Returns

`Promise`\<`string`[]\>

##### set()?

```ts
optional set(key: string, value: string): Promise<void>;
```

Defined in: [shared/utils/src/secrets/index.ts:21](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/secrets/index.ts#L21)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `key` | `string` |
| `value` | `string` |

###### Returns

`Promise`\<`void`\>

***

### SecretsConfig

Defined in: [shared/utils/src/secrets/index.ts:26](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/secrets/index.ts#L26)

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="cache"></a> `cache?` | `boolean` | Cache secrets in memory | [shared/utils/src/secrets/index.ts:32](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/secrets/index.ts#L32) |
| <a id="cachettl"></a> `cacheTtl?` | `number` | Cache TTL in milliseconds | [shared/utils/src/secrets/index.ts:34](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/secrets/index.ts#L34) |
| <a id="fallback"></a> `fallback?` | [`SecretProvider`](/docs/api/secrets.md#secretprovider)[] | Fallback providers (checked in order) | [shared/utils/src/secrets/index.ts:30](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/secrets/index.ts#L30) |
| <a id="prefix"></a> `prefix?` | `string` | Secret key prefix | [shared/utils/src/secrets/index.ts:38](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/secrets/index.ts#L38) |
| <a id="provider"></a> `provider` | [`SecretProvider`](/docs/api/secrets.md#secretprovider) | Primary provider | [shared/utils/src/secrets/index.ts:28](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/secrets/index.ts#L28) |
| <a id="required"></a> `required?` | `string`[] | Required secrets (throw if missing) | [shared/utils/src/secrets/index.ts:36](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/secrets/index.ts#L36) |

## Variables

### secrets

```ts
const secrets: SecretsManager;
```

Defined in: [shared/utils/src/secrets/index.ts:374](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/secrets/index.ts#L374)

Default secrets manager using environment variables

## Functions

### createEnvSecretsManager()

```ts
function createEnvSecretsManager(options?: {
  prefix?: string;
  required?: string[];
}): SecretsManager;
```

Defined in: [shared/utils/src/secrets/index.ts:330](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/secrets/index.ts#L330)

Create a secrets manager with environment variables

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `options?` | \{ `prefix?`: `string`; `required?`: `string`[]; \} |
| `options.prefix?` | `string` |
| `options.required?` | `string`[] |

#### Returns

[`SecretsManager`](/docs/api/secrets.md#secretsmanager)

***

### createFileSecretsManager()

```ts
function createFileSecretsManager(basePath?: string, options?: {
  required?: string[];
}): SecretsManager;
```

Defined in: [shared/utils/src/secrets/index.ts:343](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/secrets/index.ts#L343)

Create a secrets manager with file-based secrets

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `basePath?` | `string` |
| `options?` | \{ `required?`: `string`[]; \} |
| `options.required?` | `string`[] |

#### Returns

[`SecretsManager`](/docs/api/secrets.md#secretsmanager)

***

### createTestSecretsManager()

```ts
function createTestSecretsManager(secrets: Record<string, string>): SecretsManager;
```

Defined in: [shared/utils/src/secrets/index.ts:358](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/secrets/index.ts#L358)

Create a testing secrets manager

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `secrets` | `Record`\<`string`, `string`\> |

#### Returns

[`SecretsManager`](/docs/api/secrets.md#secretsmanager)

***

### getApiCredentials()

```ts
function getApiCredentials(manager: SecretsManager, prefix: string): Promise<ApiCredentials | undefined>;
```

Defined in: [shared/utils/src/secrets/index.ts:392](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/secrets/index.ts#L392)

Get API credentials from secrets

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `manager` | [`SecretsManager`](/docs/api/secrets.md#secretsmanager) |
| `prefix` | `string` |

#### Returns

`Promise`\<[`ApiCredentials`](/docs/api/secrets.md#apicredentials) \| `undefined`\>

***

### getBlockchainCredentials()

```ts
function getBlockchainCredentials(manager: SecretsManager): Promise<{
  mnemonic?: string;
  privateKey?: string;
}>;
```

Defined in: [shared/utils/src/secrets/index.ts:409](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/secrets/index.ts#L409)

Get blockchain credentials

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `manager` | [`SecretsManager`](/docs/api/secrets.md#secretsmanager) |

#### Returns

`Promise`\<\{
  `mnemonic?`: `string`;
  `privateKey?`: `string`;
\}\>
