[**Universal Crypto MCP API Reference v1.0.0**](index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / feature-flags

# feature-flags

Feature Flags System

Simple but robust feature flags for controlling functionality.
Supports environment-based, config-based, and percentage rollouts.

## Author

nich <nich@nichxbt.com>

## Classes

### FeatureFlagManager

Defined in: [shared/utils/src/feature-flags/index.ts:72](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/feature-flags/index.ts#L72)

Feature Flag Manager

#### Example

```typescript
const flags = new FeatureFlagManager({
  flags: [
    { name: 'new-trading-ui', defaultValue: false, rolloutPercentage: 50 },
    { name: 'experimental-agent', defaultValue: false, envVar: 'ENABLE_EXPERIMENTAL_AGENT' }
  ]
});

if (flags.isEnabled('new-trading-ui', { userId: 'user123' })) {
  // Show new UI
}
```

#### Constructors

##### Constructor

```ts
new FeatureFlagManager(config: FeatureFlagConfig): FeatureFlagManager;
```

Defined in: [shared/utils/src/feature-flags/index.ts:78](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/feature-flags/index.ts#L78)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `config` | [`FeatureFlagConfig`](/docs/api/feature-flags.md#featureflagconfig) |

###### Returns

[`FeatureFlagManager`](/docs/api/feature-flags.md#featureflagmanager)

#### Methods

##### activateKillSwitch()

```ts
activateKillSwitch(): void;
```

Defined in: [shared/utils/src/feature-flags/index.ts:205](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/feature-flags/index.ts#L205)

Activate global kill switch

###### Returns

`void`

##### clearAllOverrides()

```ts
clearAllOverrides(): void;
```

Defined in: [shared/utils/src/feature-flags/index.ts:173](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/feature-flags/index.ts#L173)

Clear all overrides

###### Returns

`void`

##### clearOverride()

```ts
clearOverride(name: string): void;
```

Defined in: [shared/utils/src/feature-flags/index.ts:166](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/feature-flags/index.ts#L166)

Clear a local override

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `name` | `string` |

###### Returns

`void`

##### deactivateKillSwitch()

```ts
deactivateKillSwitch(): void;
```

Defined in: [shared/utils/src/feature-flags/index.ts:212](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/feature-flags/index.ts#L212)

Deactivate global kill switch

###### Returns

`void`

##### getAllFlags()

```ts
getAllFlags(context?: EvaluationContext): Record<string, boolean>;
```

Defined in: [shared/utils/src/feature-flags/index.ts:180](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/feature-flags/index.ts#L180)

Get all flags status

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `context?` | [`EvaluationContext`](/docs/api/feature-flags.md#evaluationcontext) |

###### Returns

`Record`\<`string`, `boolean`\>

##### getFlag()

```ts
getFlag(name: string): FeatureFlag | undefined;
```

Defined in: [shared/utils/src/feature-flags/index.ts:198](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/feature-flags/index.ts#L198)

Get flag metadata

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `name` | `string` |

###### Returns

[`FeatureFlag`](/docs/api/feature-flags.md#featureflag) \| `undefined`

##### getValue()

```ts
getValue<T>(
   name: string, 
   defaultValue: T, 
   context?: EvaluationContext): T;
```

Defined in: [shared/utils/src/feature-flags/index.ts:148](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/feature-flags/index.ts#L148)

Get a flag value with type coercion

###### Type Parameters

| Type Parameter |
| :------ |
| `T` |

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `name` | `string` |
| `defaultValue` | `T` |
| `context?` | [`EvaluationContext`](/docs/api/feature-flags.md#evaluationcontext) |

###### Returns

`T`

##### isEnabled()

```ts
isEnabled(name: string, context?: EvaluationContext): boolean;
```

Defined in: [shared/utils/src/feature-flags/index.ts:90](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/feature-flags/index.ts#L90)

Check if a feature flag is enabled

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `name` | `string` |
| `context?` | [`EvaluationContext`](/docs/api/feature-flags.md#evaluationcontext) |

###### Returns

`boolean`

##### registerFlag()

```ts
registerFlag(flag: FeatureFlag): void;
```

Defined in: [shared/utils/src/feature-flags/index.ts:191](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/feature-flags/index.ts#L191)

Register a new flag

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `flag` | [`FeatureFlag`](/docs/api/feature-flags.md#featureflag) |

###### Returns

`void`

##### setOverride()

```ts
setOverride(name: string, value: boolean): void;
```

Defined in: [shared/utils/src/feature-flags/index.ts:159](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/feature-flags/index.ts#L159)

Set a local override for a flag

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `name` | `string` |
| `value` | `boolean` |

###### Returns

`void`

## Interfaces

### EvaluationContext

Defined in: [shared/utils/src/feature-flags/index.ts:44](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/feature-flags/index.ts#L44)

#### Indexable

```ts
[key: string]: unknown
```

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="environment"></a> `environment?` | `string` | [shared/utils/src/feature-flags/index.ts:47](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/feature-flags/index.ts#L47) |
| <a id="sessionid"></a> `sessionId?` | `string` | [shared/utils/src/feature-flags/index.ts:46](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/feature-flags/index.ts#L46) |
| <a id="userid"></a> `userId?` | `string` | [shared/utils/src/feature-flags/index.ts:45](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/feature-flags/index.ts#L45) |

***

### FeatureFlag

Defined in: [shared/utils/src/feature-flags/index.ts:15](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/feature-flags/index.ts#L15)

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="allowedusers"></a> `allowedUsers?` | `string`[] | Specific user IDs that should have the flag enabled | [shared/utils/src/feature-flags/index.ts:27](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/feature-flags/index.ts#L27) |
| <a id="blockedusers"></a> `blockedUsers?` | `string`[] | Specific user IDs that should have the flag disabled | [shared/utils/src/feature-flags/index.ts:29](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/feature-flags/index.ts#L29) |
| <a id="defaultvalue"></a> `defaultValue` | `boolean` | Whether the flag is enabled by default | [shared/utils/src/feature-flags/index.ts:21](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/feature-flags/index.ts#L21) |
| <a id="description"></a> `description?` | `string` | Human-readable description | [shared/utils/src/feature-flags/index.ts:19](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/feature-flags/index.ts#L19) |
| <a id="envvar"></a> `envVar?` | `string` | Override from environment variable | [shared/utils/src/feature-flags/index.ts:23](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/feature-flags/index.ts#L23) |
| <a id="expiresat"></a> `expiresAt?` | `Date` | Expiration date (auto-disable after) | [shared/utils/src/feature-flags/index.ts:33](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/feature-flags/index.ts#L33) |
| <a id="name"></a> `name` | `string` | Unique identifier | [shared/utils/src/feature-flags/index.ts:17](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/feature-flags/index.ts#L17) |
| <a id="rolloutpercentage"></a> `rolloutPercentage?` | `number` | Percentage rollout (0-100) | [shared/utils/src/feature-flags/index.ts:25](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/feature-flags/index.ts#L25) |
| <a id="tags"></a> `tags?` | `string`[] | Tags for organization | [shared/utils/src/feature-flags/index.ts:31](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/feature-flags/index.ts#L31) |

***

### FeatureFlagConfig

Defined in: [shared/utils/src/feature-flags/index.ts:36](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/feature-flags/index.ts#L36)

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="flags"></a> `flags` | [`FeatureFlag`](/docs/api/feature-flags.md#featureflag)[] | - | [shared/utils/src/feature-flags/index.ts:37](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/feature-flags/index.ts#L37) |
| <a id="globalkillswitch"></a> `globalKillSwitch?` | `boolean` | Global kill switch - disables all flags | [shared/utils/src/feature-flags/index.ts:39](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/feature-flags/index.ts#L39) |
| <a id="overrideall"></a> `overrideAll?` | `boolean` | Override all flags (for testing) | [shared/utils/src/feature-flags/index.ts:41](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/feature-flags/index.ts#L41) |

## Variables

### DEFAULT\_FLAGS

```ts
const DEFAULT_FLAGS: FeatureFlag[];
```

Defined in: [shared/utils/src/feature-flags/index.ts:238](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/feature-flags/index.ts#L238)

Default feature flags for Universal Crypto MCP

***

### featureFlags

```ts
const featureFlags: FeatureFlagManager;
```

Defined in: [shared/utils/src/feature-flags/index.ts:341](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/feature-flags/index.ts#L341)

## Functions

### isFeatureEnabled()

```ts
function isFeatureEnabled(name: string, context?: EvaluationContext): boolean;
```

Defined in: [shared/utils/src/feature-flags/index.ts:352](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/feature-flags/index.ts#L352)

Check if a feature is enabled (convenience function)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `name` | `string` |
| `context?` | [`EvaluationContext`](/docs/api/feature-flags.md#evaluationcontext) |

#### Returns

`boolean`

***

### requireFeature()

```ts
function requireFeature(flagName: string, fallbackValue?: unknown): <T>(_target: unknown, _propertyKey: string, descriptor: TypedPropertyDescriptor<T>) => TypedPropertyDescriptor<T>;
```

Defined in: [shared/utils/src/feature-flags/index.ts:359](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/feature-flags/index.ts#L359)

Decorator for enabling features on methods

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `flagName` | `string` |
| `fallbackValue?` | `unknown` |

#### Returns

```ts
<T>(
   _target: unknown, 
   _propertyKey: string, 
descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T>;
```

##### Type Parameters

| Type Parameter |
| :------ |
| `T` *extends* (...`args`: `unknown`[]) => `unknown` |

##### Parameters

| Parameter | Type |
| :------ | :------ |
| `_target` | `unknown` |
| `_propertyKey` | `string` |
| `descriptor` | `TypedPropertyDescriptor`\<`T`\> |

##### Returns

`TypedPropertyDescriptor`\<`T`\>

***

### withFeature()

```ts
function withFeature<T>(
   flagName: string, 
   fn: () => Promise<T>, 
   fallback?: T, 
context?: EvaluationContext): Promise<T | undefined>;
```

Defined in: [shared/utils/src/feature-flags/index.ts:384](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/feature-flags/index.ts#L384)

Execute function only if feature is enabled

#### Type Parameters

| Type Parameter |
| :------ |
| `T` |

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `flagName` | `string` |
| `fn` | () => `Promise`\<`T`\> |
| `fallback?` | `T` |
| `context?` | [`EvaluationContext`](/docs/api/feature-flags.md#evaluationcontext) |

#### Returns

`Promise`\<`T` \| `undefined`\>
