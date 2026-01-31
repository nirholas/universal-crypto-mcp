[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/modules/tool-marketplace/access/quotas

# defi/protocols/src/modules/tool-marketplace/access/quotas

## Classes

### QuotaManager

Defined in: [defi/protocols/src/modules/tool-marketplace/access/quotas.ts:54](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/quotas.ts#L54)

Usage Quota Manager

#### Constructors

##### Constructor

```ts
new QuotaManager(storage: AccessStorageAdapter): QuotaManager;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/quotas.ts:58](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/quotas.ts#L58)

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `storage` | [`AccessStorageAdapter`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#accessstorageadapter) | `defaultStorage` |

###### Returns

[`QuotaManager`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/quotas.md#quotamanager)

#### Methods

##### checkAndConsumeQuota()

```ts
checkAndConsumeQuota(
   keyId: string, 
   toolId: string, 
   config: QuotaConfig, 
   cost: number): Promise<{
  allowed: boolean;
  dailyStatus?:   | QuotaStatus
     | null;
  overageCharge?: string;
  reason?: string;
  status: QuotaStatus;
}>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/quotas.ts:179](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/quotas.ts#L179)

Check and consume quota
Returns whether the request is allowed

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `keyId` | `string` | `undefined` |
| `toolId` | `string` | `undefined` |
| `config` | [`QuotaConfig`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#quotaconfig) | `undefined` |
| `cost` | `number` | `1` |

###### Returns

`Promise`\<\{
  `allowed`: `boolean`;
  `dailyStatus?`:   \| [`QuotaStatus`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#quotastatus)
     \| `null`;
  `overageCharge?`: `string`;
  `reason?`: `string`;
  `status`: [`QuotaStatus`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#quotastatus);
\}\>

##### createCustomQuotaConfig()

```ts
createCustomQuotaConfig(baseConfig: QuotaConfig, overrides: Partial<QuotaConfig>): QuotaConfig;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/quotas.ts:404](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/quotas.ts#L404)

Create custom quota config

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `baseConfig` | [`QuotaConfig`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#quotaconfig) |
| `overrides` | `Partial`\<[`QuotaConfig`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#quotaconfig)\> |

###### Returns

[`QuotaConfig`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#quotaconfig)

##### estimateOverageCharges()

```ts
estimateOverageCharges(
   currentUsage: number, 
   projectedUsage: number, 
   config: QuotaConfig): string;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/quotas.ts:327](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/quotas.ts#L327)

Calculate estimated overage charges

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `currentUsage` | `number` |
| `projectedUsage` | `number` |
| `config` | [`QuotaConfig`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#quotaconfig) |

###### Returns

`string`

##### getDailyQuotaStatus()

```ts
getDailyQuotaStatus(
   keyId: string, 
   toolId: string, 
   config: QuotaConfig): Promise<
  | QuotaStatus
| null>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/quotas.ts:145](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/quotas.ts#L145)

Get daily quota status for a key

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `keyId` | `string` |
| `toolId` | `string` |
| `config` | [`QuotaConfig`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#quotaconfig) |

###### Returns

`Promise`\<
  \| [`QuotaStatus`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#quotastatus)
  \| `null`\>

##### getDaysRemainingInPeriod()

```ts
getDaysRemainingInPeriod(): number;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/quotas.ts:343](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/quotas.ts#L343)

Get days remaining in current period

###### Returns

`number`

##### getQuotaConfigForTier()

```ts
getQuotaConfigForTier(tier: AccessTierName): QuotaConfig;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/quotas.ts:397](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/quotas.ts#L397)

Get quota config for a tier

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `tier` | [`AccessTierName`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#accesstiername-1) |

###### Returns

[`QuotaConfig`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#quotaconfig)

##### getQuotaHistory()

```ts
getQuotaHistory(keyId: string, months: number): Promise<{
  period: string;
  usage: number;
}[]>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/quotas.ts:297](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/quotas.ts#L297)

Get quota usage history

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `keyId` | `string` | `undefined` |
| `months` | `number` | `6` |

###### Returns

`Promise`\<\{
  `period`: `string`;
  `usage`: `number`;
\}[]\>

##### getQuotaStatus()

```ts
getQuotaStatus(
   keyId: string, 
   toolId: string, 
config: QuotaConfig): Promise<QuotaStatus>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/quotas.ts:99](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/quotas.ts#L99)

Get quota status for a key

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `keyId` | `string` |
| `toolId` | `string` |
| `config` | [`QuotaConfig`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#quotaconfig) |

###### Returns

`Promise`\<[`QuotaStatus`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#quotastatus)\>

##### projectMonthlyUsage()

```ts
projectMonthlyUsage(currentUsage: number): number;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/quotas.ts:352](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/quotas.ts#L352)

Project usage for the month based on current rate

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `currentUsage` | `number` |

###### Returns

`number`

##### registerNotificationHandler()

```ts
registerNotificationHandler(keyId: string, handler: (data: any) => Promise<void>): void;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/quotas.ts:366](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/quotas.ts#L366)

Register a notification handler

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `keyId` | `string` |
| `handler` | (`data`: `any`) => `Promise`\<`void`\> |

###### Returns

`void`

##### resetQuota()

```ts
resetQuota(keyId: string, period?: string): Promise<void>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/quotas.ts:317](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/quotas.ts#L317)

Reset quota for a specific period (admin function)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `keyId` | `string` |
| `period?` | `string` |

###### Returns

`Promise`\<`void`\>

## Interfaces

### QuotaCheckResult

Defined in: [defi/protocols/src/modules/tool-marketplace/access/quotas.ts:420](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/quotas.ts#L420)

Quota check result type for middleware

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="allowed"></a> `allowed` | `boolean` | [defi/protocols/src/modules/tool-marketplace/access/quotas.ts:421](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/quotas.ts#L421) |
| <a id="dailyquotastatus"></a> `dailyQuotaStatus?` | \| [`QuotaStatus`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#quotastatus) \| `null` | [defi/protocols/src/modules/tool-marketplace/access/quotas.ts:423](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/quotas.ts#L423) |
| <a id="overagecharge"></a> `overageCharge?` | `string` | [defi/protocols/src/modules/tool-marketplace/access/quotas.ts:424](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/quotas.ts#L424) |
| <a id="quotastatus"></a> `quotaStatus` | [`QuotaStatus`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#quotastatus) | [defi/protocols/src/modules/tool-marketplace/access/quotas.ts:422](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/quotas.ts#L422) |
| <a id="reason"></a> `reason?` | `string` | [defi/protocols/src/modules/tool-marketplace/access/quotas.ts:425](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/quotas.ts#L425) |

## Variables

### DEFAULT\_QUOTA\_CONFIG

```ts
const DEFAULT_QUOTA_CONFIG: Record<AccessTierName, QuotaConfig>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/quotas.ts:23](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/quotas.ts#L23)

Default quota configurations by tier

***

### quotaManager

```ts
const quotaManager: QuotaManager;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/quotas.ts:415](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/quotas.ts#L415)

Default quota manager instance

## Functions

### checkQuota()

```ts
function checkQuota(
   keyId: string, 
   toolId: string, 
   tier: AccessTierName, 
cost: number): Promise<QuotaCheckResult>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/quotas.ts:431](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/quotas.ts#L431)

Utility function for quick quota check

#### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `keyId` | `string` | `undefined` |
| `toolId` | `string` | `undefined` |
| `tier` | [`AccessTierName`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#accesstiername-1) | `undefined` |
| `cost` | `number` | `1` |

#### Returns

`Promise`\<[`QuotaCheckResult`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/quotas.md#quotacheckresult)\>
