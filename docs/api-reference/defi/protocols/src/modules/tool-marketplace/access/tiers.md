[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/modules/tool-marketplace/access/tiers

# defi/protocols/src/modules/tool-marketplace/access/tiers

## Interfaces

### CustomTierConfig

Defined in: [defi/protocols/src/modules/tool-marketplace/access/tiers.ts:221](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/tiers.ts#L221)

Custom tier configuration for tool creators

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="customtiers"></a> `customTiers?` | [`AccessTier`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#accesstier)[] | Additional custom tiers | [defi/protocols/src/modules/tool-marketplace/access/tiers.ts:227](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/tiers.ts#L227) |
| <a id="tiers"></a> `tiers` | `Partial`\<`Record`\<[`AccessTierName`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#accesstiername-1), `Partial`\<[`AccessTier`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#accesstier)\>\>\> | Custom tiers (overrides defaults) | [defi/protocols/src/modules/tool-marketplace/access/tiers.ts:225](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/tiers.ts#L225) |
| <a id="toolid"></a> `toolId` | `string` | Tool ID | [defi/protocols/src/modules/tool-marketplace/access/tiers.ts:223](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/tiers.ts#L223) |

## Variables

### DEFAULT\_TIERS

```ts
const DEFAULT_TIERS: Record<AccessTierName, AccessTier>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/tiers.ts:13](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/tiers.ts#L13)

Default access tiers for the marketplace

***

### TIER\_ORDER

```ts
const TIER_ORDER: AccessTierName[];
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/tiers.ts:79](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/tiers.ts#L79)

Tier order for comparison (lower index = lower tier)

## Functions

### calculateProratedPrice()

```ts
function calculateProratedPrice(
   currentTier: AccessTierName, 
   newTier: AccessTierName, 
   daysRemaining: number, 
   totalDays: number): {
  amount: string;
  isCredit: boolean;
};
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/tiers.ts:183](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/tiers.ts#L183)

Calculate prorated price for tier change

#### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `currentTier` | [`AccessTierName`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#accesstiername-1) | `undefined` |
| `newTier` | [`AccessTierName`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#accesstiername-1) | `undefined` |
| `daysRemaining` | `number` | `undefined` |
| `totalDays` | `number` | `30` |

#### Returns

```ts
{
  amount: string;
  isCredit: boolean;
}
```

| Name | Type | Defined in |
| :------ | :------ | :------ |
| `amount` | `string` | [defi/protocols/src/modules/tool-marketplace/access/tiers.ts:188](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/tiers.ts#L188) |
| `isCredit` | `boolean` | [defi/protocols/src/modules/tool-marketplace/access/tiers.ts:188](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/tiers.ts#L188) |

***

### calculateRps()

```ts
function calculateRps(rateLimit: RateLimit): number;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/tiers.ts:157](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/tiers.ts#L157)

Calculate requests per second for a rate limit

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `rateLimit` | [`RateLimit`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#ratelimit-4) |

#### Returns

`number`

***

### getAllTiers()

```ts
function getAllTiers(): AccessTier[];
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/tiers.ts:91](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/tiers.ts#L91)

Get all tiers

#### Returns

[`AccessTier`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#accesstier)[]

***

### getNextTier()

```ts
function getNextTier(current: AccessTierName): 
  | AccessTierName
  | undefined;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/tiers.ts:112](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/tiers.ts#L112)

Get the next higher tier (returns undefined if already at highest)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `current` | [`AccessTierName`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#accesstiername-1) |

#### Returns

  \| [`AccessTierName`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#accesstiername-1)
  \| `undefined`

***

### getPreviousTier()

```ts
function getPreviousTier(current: AccessTierName): 
  | AccessTierName
  | undefined;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/tiers.ts:123](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/tiers.ts#L123)

Get the previous lower tier (returns undefined if already at lowest)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `current` | [`AccessTierName`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#accesstiername-1) |

#### Returns

  \| [`AccessTierName`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#accesstiername-1)
  \| `undefined`

***

### getTier()

```ts
function getTier(name: AccessTierName): AccessTier;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/tiers.ts:84](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/tiers.ts#L84)

Get tier by name

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `name` | [`AccessTierName`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#accesstiername-1) |

#### Returns

[`AccessTier`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#accesstier)

***

### getTierFeaturesDiff()

```ts
function getTierFeaturesDiff(lowerTier: AccessTierName, higherTier: AccessTierName): string[];
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/tiers.ts:210](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/tiers.ts#L210)

Get tier features diff (what's new in the higher tier)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `lowerTier` | [`AccessTierName`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#accesstiername-1) |
| `higherTier` | [`AccessTierName`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#accesstiername-1) |

#### Returns

`string`[]

***

### getTierPriceNumber()

```ts
function getTierPriceNumber(tier: AccessTierName): number;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/tiers.ts:172](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/tiers.ts#L172)

Get tier price as a number (returns -1 for custom pricing)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `tier` | [`AccessTierName`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#accesstiername-1) |

#### Returns

`number`

***

### isTierHigher()

```ts
function isTierHigher(tier: AccessTierName, compareTo: AccessTierName): boolean;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/tiers.ts:98](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/tiers.ts#L98)

Check if a tier is higher than another

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `tier` | [`AccessTierName`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#accesstiername-1) |
| `compareTo` | [`AccessTierName`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#accesstiername-1) |

#### Returns

`boolean`

***

### isTierLower()

```ts
function isTierLower(tier: AccessTierName, compareTo: AccessTierName): boolean;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/tiers.ts:105](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/tiers.ts#L105)

Check if a tier is lower than another

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `tier` | [`AccessTierName`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#accesstiername-1) |
| `compareTo` | [`AccessTierName`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#accesstiername-1) |

#### Returns

`boolean`

***

### isValidTierName()

```ts
function isValidTierName(name: string): name is AccessTierName;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/tiers.ts:165](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/tiers.ts#L165)

Validate tier name

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `name` | `string` |

#### Returns

`name is AccessTierName`

***

### mergeCustomTiers()

```ts
function mergeCustomTiers(config?: CustomTierConfig): Record<AccessTierName, AccessTier>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/tiers.ts:233](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/tiers.ts#L233)

Merge custom tier config with defaults

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `config?` | [`CustomTierConfig`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/tiers.md#customtierconfig) |

#### Returns

`Record`\<[`AccessTierName`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#accesstiername-1), [`AccessTier`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#accesstier)\>

***

### periodToMs()

```ts
function periodToMs(period: RatePeriod): number;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/tiers.ts:134](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/tiers.ts#L134)

Convert rate period to milliseconds

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `period` | [`RatePeriod`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#rateperiod) |

#### Returns

`number`

***

### periodToSeconds()

```ts
function periodToSeconds(period: RatePeriod): number;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/tiers.ts:150](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/tiers.ts#L150)

Convert rate period to seconds

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `period` | [`RatePeriod`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#rateperiod) |

#### Returns

`number`
