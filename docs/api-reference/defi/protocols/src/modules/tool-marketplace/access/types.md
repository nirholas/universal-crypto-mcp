[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/modules/tool-marketplace/access/types

# defi/protocols/src/modules/tool-marketplace/access/types

## Interfaces

### AccessEvent

Defined in: [defi/protocols/src/modules/tool-marketplace/access/types.ts:445](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L445)

Access control event

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="data"></a> `data?` | `Record`\<`string`, `unknown`\> | Additional event data | [defi/protocols/src/modules/tool-marketplace/access/types.ts:457](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L457) |
| <a id="keyid"></a> `keyId?` | `string` | Key ID (if applicable) | [defi/protocols/src/modules/tool-marketplace/access/types.ts:451](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L451) |
| <a id="timestamp"></a> `timestamp` | `number` | Event timestamp | [defi/protocols/src/modules/tool-marketplace/access/types.ts:449](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L449) |
| <a id="toolid"></a> `toolId?` | `string` | Tool ID (if applicable) | [defi/protocols/src/modules/tool-marketplace/access/types.ts:455](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L455) |
| <a id="type"></a> `type` | [`AccessEventType`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#accesseventtype-1) | Event type | [defi/protocols/src/modules/tool-marketplace/access/types.ts:447](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L447) |
| <a id="userid"></a> `userId?` | `` `0x${string}` `` | User address (if applicable) | [defi/protocols/src/modules/tool-marketplace/access/types.ts:453](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L453) |

***

### AccessStorageAdapter

Defined in: [defi/protocols/src/modules/tool-marketplace/access/types.ts:519](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L519)

Storage adapter interface for access control data

#### Methods

##### deleteKey()

```ts
deleteKey(keyId: string): Promise<void>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/types.ts:527](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L527)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `keyId` | `string` |

###### Returns

`Promise`\<`void`\>

##### deleteWebhook()

```ts
deleteWebhook(webhookId: string): Promise<void>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/types.ts:563](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L563)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `webhookId` | `string` |

###### Returns

`Promise`\<`void`\>

##### getallowlist()

```ts
getallowlist(toolId: string): Promise<AllowlistEntry[]>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/types.ts:539](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L539)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |

###### Returns

`Promise`\<[`AllowlistEntry`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#allowlistentry)[]\>

##### getAuditLogs()

```ts
getAuditLogs(filter: {
  action?: AccessEventType;
  limit?: number;
  toolId?: string;
  userId?: `0x${string}`;
}): Promise<AuditLogEntry[]>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/types.ts:557](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L557)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `filter` | \{ `action?`: [`AccessEventType`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#accesseventtype-1); `limit?`: `number`; `toolId?`: `string`; `userId?`: `` `0x${string}` ``; \} |
| `filter.action?` | [`AccessEventType`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#accesseventtype-1) |
| `filter.limit?` | `number` |
| `filter.toolId?` | `string` |
| `filter.userId?` | `` `0x${string}` `` |

###### Returns

`Promise`\<[`AuditLogEntry`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#auditlogentry)[]\>

##### getBlocklist()

```ts
getBlocklist(toolId: string): Promise<BlocklistEntry[]>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/types.ts:542](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L542)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |

###### Returns

`Promise`\<[`BlocklistEntry`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#blocklistentry)[]\>

##### getGeoRestriction()

```ts
getGeoRestriction(toolId: string): Promise<
  | GeoRestriction
| null>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/types.ts:545](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L545)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |

###### Returns

`Promise`\<
  \| [`GeoRestriction`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#georestriction)
  \| `null`\>

##### getKey()

```ts
getKey(keyId: string): Promise<
  | APIKey
| null>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/types.ts:522](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L522)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `keyId` | `string` |

###### Returns

`Promise`\<
  \| [`APIKey`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#apikey)
  \| `null`\>

##### getKeyByHash()

```ts
getKeyByHash(keyHash: string): Promise<
  | APIKey
| null>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/types.ts:523](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L523)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `keyHash` | `string` |

###### Returns

`Promise`\<
  \| [`APIKey`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#apikey)
  \| `null`\>

##### getKeysByTool()

```ts
getKeysByTool(toolId: string): Promise<APIKey[]>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/types.ts:525](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L525)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |

###### Returns

`Promise`\<[`APIKey`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#apikey)[]\>

##### getKeysByUser()

```ts
getKeysByUser(userId: `0x${string}`): Promise<APIKey[]>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/types.ts:524](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L524)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `userId` | `` `0x${string}` `` |

###### Returns

`Promise`\<[`APIKey`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#apikey)[]\>

##### getQuotaUsage()

```ts
getQuotaUsage(key: string, period: string): Promise<number>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/types.ts:552](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L552)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `key` | `string` |
| `period` | `string` |

###### Returns

`Promise`\<`number`\>

##### getRateCount()

```ts
getRateCount(key: string): Promise<number>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/types.ts:548](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L548)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `key` | `string` |

###### Returns

`Promise`\<`number`\>

##### getSubscription()

```ts
getSubscription(subscriptionId: string): Promise<
  | Subscription
| null>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/types.ts:531](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L531)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `subscriptionId` | `string` |

###### Returns

`Promise`\<
  \| [`Subscription`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#subscription)
  \| `null`\>

##### getSubscriptionByUserAndTool()

```ts
getSubscriptionByUserAndTool(userId: `0x${string}`, toolId: string): Promise<
  | Subscription
| null>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/types.ts:532](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L532)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `userId` | `` `0x${string}` `` |
| `toolId` | `string` |

###### Returns

`Promise`\<
  \| [`Subscription`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#subscription)
  \| `null`\>

##### getSubscriptionsByTool()

```ts
getSubscriptionsByTool(toolId: string): Promise<Subscription[]>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/types.ts:534](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L534)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |

###### Returns

`Promise`\<[`Subscription`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#subscription)[]\>

##### getSubscriptionsByUser()

```ts
getSubscriptionsByUser(userId: `0x${string}`): Promise<Subscription[]>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/types.ts:533](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L533)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `userId` | `` `0x${string}` `` |

###### Returns

`Promise`\<[`Subscription`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#subscription)[]\>

##### getWebhooks()

```ts
getWebhooks(toolId: string): Promise<AccessWebhook[]>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/types.ts:561](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L561)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |

###### Returns

`Promise`\<[`AccessWebhook`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#accesswebhook)[]\>

##### incrementQuotaUsage()

```ts
incrementQuotaUsage(
   key: string, 
   period: string, 
amount?: number): Promise<number>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/types.ts:553](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L553)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `key` | `string` |
| `period` | `string` |
| `amount?` | `number` |

###### Returns

`Promise`\<`number`\>

##### incrementRateCount()

```ts
incrementRateCount(key: string, ttlSeconds: number): Promise<number>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/types.ts:549](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L549)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `key` | `string` |
| `ttlSeconds` | `number` |

###### Returns

`Promise`\<`number`\>

##### removeAllowlistEntry()

```ts
removeAllowlistEntry(entryId: string): Promise<void>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/types.ts:540](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L540)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `entryId` | `string` |

###### Returns

`Promise`\<`void`\>

##### removeBlocklistEntry()

```ts
removeBlocklistEntry(entryId: string): Promise<void>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/types.ts:543](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L543)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `entryId` | `string` |

###### Returns

`Promise`\<`void`\>

##### saveAllowlistEntry()

```ts
saveAllowlistEntry(entry: AllowlistEntry): Promise<void>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/types.ts:538](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L538)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `entry` | [`AllowlistEntry`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#allowlistentry) |

###### Returns

`Promise`\<`void`\>

##### saveAuditLog()

```ts
saveAuditLog(entry: AuditLogEntry): Promise<void>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/types.ts:556](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L556)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `entry` | [`AuditLogEntry`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#auditlogentry) |

###### Returns

`Promise`\<`void`\>

##### saveBlocklistEntry()

```ts
saveBlocklistEntry(entry: BlocklistEntry): Promise<void>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/types.ts:541](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L541)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `entry` | [`BlocklistEntry`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#blocklistentry) |

###### Returns

`Promise`\<`void`\>

##### saveGeoRestriction()

```ts
saveGeoRestriction(restriction: GeoRestriction): Promise<void>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/types.ts:544](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L544)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `restriction` | [`GeoRestriction`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#georestriction) |

###### Returns

`Promise`\<`void`\>

##### saveKey()

```ts
saveKey(key: APIKey): Promise<void>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/types.ts:521](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L521)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `key` | [`APIKey`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#apikey) |

###### Returns

`Promise`\<`void`\>

##### saveSubscription()

```ts
saveSubscription(subscription: Subscription): Promise<void>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/types.ts:530](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L530)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `subscription` | [`Subscription`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#subscription) |

###### Returns

`Promise`\<`void`\>

##### saveWebhook()

```ts
saveWebhook(webhook: AccessWebhook): Promise<void>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/types.ts:560](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L560)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `webhook` | [`AccessWebhook`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#accesswebhook) |

###### Returns

`Promise`\<`void`\>

##### updateKey()

```ts
updateKey(keyId: string, updates: Partial<APIKey>): Promise<void>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/types.ts:526](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L526)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `keyId` | `string` |
| `updates` | `Partial`\<[`APIKey`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#apikey)\> |

###### Returns

`Promise`\<`void`\>

##### updateSubscription()

```ts
updateSubscription(subscriptionId: string, updates: Partial<Subscription>): Promise<void>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/types.ts:535](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L535)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `subscriptionId` | `string` |
| `updates` | `Partial`\<[`Subscription`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#subscription)\> |

###### Returns

`Promise`\<`void`\>

##### updateWebhook()

```ts
updateWebhook(webhookId: string, updates: Partial<AccessWebhook>): Promise<void>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/types.ts:562](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L562)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `webhookId` | `string` |
| `updates` | `Partial`\<[`AccessWebhook`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#accesswebhook)\> |

###### Returns

`Promise`\<`void`\>

***

### AccessTier

Defined in: [defi/protocols/src/modules/tool-marketplace/access/types.ts:184](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L184)

Access tier configuration

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="custombranding"></a> `customBranding?` | `boolean` | Custom branding allowed | [defi/protocols/src/modules/tool-marketplace/access/types.ts:200](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L200) |
| <a id="description"></a> `description?` | `string` | Description | [defi/protocols/src/modules/tool-marketplace/access/types.ts:196](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L196) |
| <a id="features"></a> `features` | `string`[] | Features included in this tier | [defi/protocols/src/modules/tool-marketplace/access/types.ts:192](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L192) |
| <a id="monthlyquota"></a> `monthlyQuota` | `number` | Monthly quota (-1 for unlimited) | [defi/protocols/src/modules/tool-marketplace/access/types.ts:190](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L190) |
| <a id="name"></a> `name` | [`AccessTierName`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#accesstiername-1) | Tier name | [defi/protocols/src/modules/tool-marketplace/access/types.ts:186](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L186) |
| <a id="price"></a> `price` | `string` | Monthly price in USD | [defi/protocols/src/modules/tool-marketplace/access/types.ts:194](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L194) |
| <a id="prioritysupport"></a> `prioritySupport?` | `boolean` | Priority support | [defi/protocols/src/modules/tool-marketplace/access/types.ts:198](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L198) |
| <a id="ratelimit"></a> `rateLimit` | [`RateLimit`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#ratelimit-4) | Rate limit configuration | [defi/protocols/src/modules/tool-marketplace/access/types.ts:188](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L188) |

***

### AccessWebhook

Defined in: [defi/protocols/src/modules/tool-marketplace/access/types.ts:463](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L463)

Webhook configuration for access events

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="createdat"></a> `createdAt` | `number` | Created timestamp | [defi/protocols/src/modules/tool-marketplace/access/types.ts:477](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L477) |
| <a id="events"></a> `events` | [`AccessEventType`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#accesseventtype-1)[] | Events to subscribe to | [defi/protocols/src/modules/tool-marketplace/access/types.ts:471](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L471) |
| <a id="id"></a> `id` | `string` | Webhook ID | [defi/protocols/src/modules/tool-marketplace/access/types.ts:465](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L465) |
| <a id="isactive"></a> `isActive` | `boolean` | Is webhook active | [defi/protocols/src/modules/tool-marketplace/access/types.ts:475](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L475) |
| <a id="secret"></a> `secret` | `string` | Secret for signature verification | [defi/protocols/src/modules/tool-marketplace/access/types.ts:473](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L473) |
| <a id="toolid-1"></a> `toolId` | `string` | Tool ID | [defi/protocols/src/modules/tool-marketplace/access/types.ts:467](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L467) |
| <a id="url"></a> `url` | `string` | Webhook URL | [defi/protocols/src/modules/tool-marketplace/access/types.ts:469](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L469) |

***

### AllowlistEntry

Defined in: [defi/protocols/src/modules/tool-marketplace/access/types.ts:292](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L292)

Allowlist entry

#### Extends

- [`ListEntry`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#listentry)

#### Properties

| Property | Type | Description | Inherited from | Defined in |
| :------ | :------ | :------ | :------ | :------ |
| <a id="createdat-1"></a> `createdAt` | `number` | Creation timestamp | [`ListEntry`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#listentry).[`createdAt`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#createdat-6) | [defi/protocols/src/modules/tool-marketplace/access/types.ts:284](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L284) |
| <a id="createdby"></a> `createdBy` | `` `0x${string}` `` | Created by (address) | [`ListEntry`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#listentry).[`createdBy`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#createdby-3) | [defi/protocols/src/modules/tool-marketplace/access/types.ts:282](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L282) |
| <a id="customratelimit"></a> `customRateLimit?` | [`RateLimit`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#ratelimit-4) | Custom rate limit for allowlisted users | - | [defi/protocols/src/modules/tool-marketplace/access/types.ts:296](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L296) |
| <a id="expiresat"></a> `expiresAt?` | `number` | Expiration timestamp (undefined = permanent) | [`ListEntry`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#listentry).[`expiresAt`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#expiresat-5) | [defi/protocols/src/modules/tool-marketplace/access/types.ts:286](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L286) |
| <a id="id-1"></a> `id` | `string` | Entry ID | [`ListEntry`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#listentry).[`id`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#id-6) | [defi/protocols/src/modules/tool-marketplace/access/types.ts:272](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L272) |
| <a id="permissions"></a> `permissions?` | [`Permission`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#permission)[] | Special permissions for allowlisted users | - | [defi/protocols/src/modules/tool-marketplace/access/types.ts:294](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L294) |
| <a id="reason"></a> `reason?` | `string` | Reason for listing | [`ListEntry`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#listentry).[`reason`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#reason-2) | [defi/protocols/src/modules/tool-marketplace/access/types.ts:280](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L280) |
| <a id="toolid-2"></a> `toolId` | `string` | Tool ID this entry applies to | [`ListEntry`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#listentry).[`toolId`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#toolid-8) | [defi/protocols/src/modules/tool-marketplace/access/types.ts:274](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L274) |
| <a id="type-1"></a> `type` | [`ListEntryType`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#listentrytype-1) | Entry type | [`ListEntry`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#listentry).[`type`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#type-3) | [defi/protocols/src/modules/tool-marketplace/access/types.ts:276](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L276) |
| <a id="value"></a> `value` | `string` | Value (address, IP, or CIDR) | [`ListEntry`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#listentry).[`value`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#value-2) | [defi/protocols/src/modules/tool-marketplace/access/types.ts:278](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L278) |

***

### APIKey

Defined in: [defi/protocols/src/modules/tool-marketplace/access/types.ts:99](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L99)

API key record

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="createdat-2"></a> `createdAt` | `number` | Creation timestamp (Unix ms) | [defi/protocols/src/modules/tool-marketplace/access/types.ts:121](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L121) |
| <a id="expiresat-1"></a> `expiresAt?` | `number` | Expiration timestamp (Unix ms), undefined = never | [defi/protocols/src/modules/tool-marketplace/access/types.ts:119](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L119) |
| <a id="id-2"></a> `id` | `string` | Unique key identifier | [defi/protocols/src/modules/tool-marketplace/access/types.ts:101](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L101) |
| <a id="isactive-1"></a> `isActive` | `boolean` | Is the key active | [defi/protocols/src/modules/tool-marketplace/access/types.ts:127](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L127) |
| <a id="keyhash"></a> `keyHash` | `string` | Hashed key value (bcrypt) | [defi/protocols/src/modules/tool-marketplace/access/types.ts:107](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L107) |
| <a id="keyprefix"></a> `keyPrefix` | `string` | Key prefix for identification (e.g., "mk_abc...xyz") | [defi/protocols/src/modules/tool-marketplace/access/types.ts:109](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L109) |
| <a id="lastusedat"></a> `lastUsedAt?` | `number` | Last used timestamp (Unix ms) | [defi/protocols/src/modules/tool-marketplace/access/types.ts:123](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L123) |
| <a id="metadata"></a> `metadata?` | `Record`\<`string`, `unknown`\> | Key metadata | [defi/protocols/src/modules/tool-marketplace/access/types.ts:133](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L133) |
| <a id="name-1"></a> `name` | `string` | Human-readable name | [defi/protocols/src/modules/tool-marketplace/access/types.ts:111](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L111) |
| <a id="permissions-1"></a> `permissions` | [`Permission`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#permission)[] | Permissions granted | [defi/protocols/src/modules/tool-marketplace/access/types.ts:113](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L113) |
| <a id="ratelimit-1"></a> `rateLimit` | [`RateLimit`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#ratelimit-4) | Rate limit for this key | [defi/protocols/src/modules/tool-marketplace/access/types.ts:115](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L115) |
| <a id="revocationreason"></a> `revocationReason?` | `string` | Reason for revocation | [defi/protocols/src/modules/tool-marketplace/access/types.ts:131](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L131) |
| <a id="revokedat"></a> `revokedAt?` | `number` | Revocation timestamp if revoked | [defi/protocols/src/modules/tool-marketplace/access/types.ts:129](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L129) |
| <a id="tier"></a> `tier` | [`AccessTierName`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#accesstiername-1) | Access tier | [defi/protocols/src/modules/tool-marketplace/access/types.ts:117](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L117) |
| <a id="toolid-3"></a> `toolId` | `string` | Tool ID this key is for | [defi/protocols/src/modules/tool-marketplace/access/types.ts:103](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L103) |
| <a id="usagecount"></a> `usageCount` | `number` | Total usage count | [defi/protocols/src/modules/tool-marketplace/access/types.ts:125](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L125) |
| <a id="userid-1"></a> `userId` | `` `0x${string}` `` | User who owns this key | [defi/protocols/src/modules/tool-marketplace/access/types.ts:105](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L105) |

***

### APIKeyWithSecret

Defined in: [defi/protocols/src/modules/tool-marketplace/access/types.ts:139](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L139)

Full API key (returned only at creation)

#### Extends

- `Omit`\<[`APIKey`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#apikey), `"keyHash"`\>

#### Properties

| Property | Type | Description | Inherited from | Defined in |
| :------ | :------ | :------ | :------ | :------ |
| <a id="createdat-3"></a> `createdAt` | `number` | Creation timestamp (Unix ms) | [`APIKey`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#apikey).[`createdAt`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#createdat-2) | [defi/protocols/src/modules/tool-marketplace/access/types.ts:121](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L121) |
| <a id="expiresat-2"></a> `expiresAt?` | `number` | Expiration timestamp (Unix ms), undefined = never | [`APIKey`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#apikey).[`expiresAt`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#expiresat-1) | [defi/protocols/src/modules/tool-marketplace/access/types.ts:119](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L119) |
| <a id="id-3"></a> `id` | `string` | Unique key identifier | [`APIKey`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#apikey).[`id`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#id-2) | [defi/protocols/src/modules/tool-marketplace/access/types.ts:101](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L101) |
| <a id="isactive-2"></a> `isActive` | `boolean` | Is the key active | [`APIKey`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#apikey).[`isActive`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#isactive-1) | [defi/protocols/src/modules/tool-marketplace/access/types.ts:127](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L127) |
| <a id="key"></a> `key` | `string` | The full API key (only shown once) | - | [defi/protocols/src/modules/tool-marketplace/access/types.ts:141](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L141) |
| <a id="keyprefix-1"></a> `keyPrefix` | `string` | Key prefix for identification (e.g., "mk_abc...xyz") | [`APIKey`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#apikey).[`keyPrefix`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#keyprefix) | [defi/protocols/src/modules/tool-marketplace/access/types.ts:109](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L109) |
| <a id="lastusedat-1"></a> `lastUsedAt?` | `number` | Last used timestamp (Unix ms) | [`APIKey`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#apikey).[`lastUsedAt`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#lastusedat) | [defi/protocols/src/modules/tool-marketplace/access/types.ts:123](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L123) |
| <a id="metadata-1"></a> `metadata?` | `Record`\<`string`, `unknown`\> | Key metadata | [`APIKey`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#apikey).[`metadata`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#metadata) | [defi/protocols/src/modules/tool-marketplace/access/types.ts:133](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L133) |
| <a id="name-2"></a> `name` | `string` | Human-readable name | [`APIKey`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#apikey).[`name`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#name-1) | [defi/protocols/src/modules/tool-marketplace/access/types.ts:111](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L111) |
| <a id="permissions-2"></a> `permissions` | [`Permission`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#permission)[] | Permissions granted | [`APIKey`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#apikey).[`permissions`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#permissions-1) | [defi/protocols/src/modules/tool-marketplace/access/types.ts:113](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L113) |
| <a id="ratelimit-2"></a> `rateLimit` | [`RateLimit`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#ratelimit-4) | Rate limit for this key | [`APIKey`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#apikey).[`rateLimit`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#ratelimit-1) | [defi/protocols/src/modules/tool-marketplace/access/types.ts:115](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L115) |
| <a id="revocationreason-1"></a> `revocationReason?` | `string` | Reason for revocation | [`APIKey`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#apikey).[`revocationReason`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#revocationreason) | [defi/protocols/src/modules/tool-marketplace/access/types.ts:131](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L131) |
| <a id="revokedat-1"></a> `revokedAt?` | `number` | Revocation timestamp if revoked | [`APIKey`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#apikey).[`revokedAt`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#revokedat) | [defi/protocols/src/modules/tool-marketplace/access/types.ts:129](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L129) |
| <a id="tier-1"></a> `tier` | [`AccessTierName`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#accesstiername-1) | Access tier | [`APIKey`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#apikey).[`tier`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#tier) | [defi/protocols/src/modules/tool-marketplace/access/types.ts:117](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L117) |
| <a id="toolid-4"></a> `toolId` | `string` | Tool ID this key is for | [`APIKey`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#apikey).[`toolId`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#toolid-3) | [defi/protocols/src/modules/tool-marketplace/access/types.ts:103](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L103) |
| <a id="usagecount-1"></a> `usageCount` | `number` | Total usage count | [`APIKey`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#apikey).[`usageCount`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#usagecount) | [defi/protocols/src/modules/tool-marketplace/access/types.ts:125](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L125) |
| <a id="userid-2"></a> `userId` | `` `0x${string}` `` | User who owns this key | [`APIKey`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#apikey).[`userId`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#userid-1) | [defi/protocols/src/modules/tool-marketplace/access/types.ts:105](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L105) |

***

### AuditLogEntry

Defined in: [defi/protocols/src/modules/tool-marketplace/access/types.ts:487](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L487)

Audit log entry

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="action"></a> `action` | [`AccessEventType`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#accesseventtype-1) | Action type | [defi/protocols/src/modules/tool-marketplace/access/types.ts:493](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L493) |
| <a id="actor"></a> `actor` | `` `0x${string}` `` | Actor address | [defi/protocols/src/modules/tool-marketplace/access/types.ts:495](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L495) |
| <a id="details"></a> `details?` | `Record`\<`string`, `unknown`\> | Additional details | [defi/protocols/src/modules/tool-marketplace/access/types.ts:505](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L505) |
| <a id="error"></a> `error?` | `string` | Error message if failed | [defi/protocols/src/modules/tool-marketplace/access/types.ts:509](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L509) |
| <a id="id-4"></a> `id` | `string` | Entry ID | [defi/protocols/src/modules/tool-marketplace/access/types.ts:489](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L489) |
| <a id="ipaddress"></a> `ipAddress?` | `string` | IP address of actor | [defi/protocols/src/modules/tool-marketplace/access/types.ts:501](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L501) |
| <a id="success"></a> `success` | `boolean` | Was action successful | [defi/protocols/src/modules/tool-marketplace/access/types.ts:507](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L507) |
| <a id="target"></a> `target` | `string` | Target (key ID, subscription ID, etc.) | [defi/protocols/src/modules/tool-marketplace/access/types.ts:497](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L497) |
| <a id="targettype"></a> `targetType` | `"key"` \| `"subscription"` \| `"user"` \| `"tool"` | Target type | [defi/protocols/src/modules/tool-marketplace/access/types.ts:499](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L499) |
| <a id="timestamp-1"></a> `timestamp` | `number` | Timestamp | [defi/protocols/src/modules/tool-marketplace/access/types.ts:491](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L491) |
| <a id="useragent"></a> `userAgent?` | `string` | User agent | [defi/protocols/src/modules/tool-marketplace/access/types.ts:503](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L503) |

***

### BlocklistEntry

Defined in: [defi/protocols/src/modules/tool-marketplace/access/types.ts:302](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L302)

Blocklist entry

#### Extends

- [`ListEntry`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#listentry)

#### Properties

| Property | Type | Description | Inherited from | Defined in |
| :------ | :------ | :------ | :------ | :------ |
| <a id="createdat-4"></a> `createdAt` | `number` | Creation timestamp | [`ListEntry`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#listentry).[`createdAt`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#createdat-6) | [defi/protocols/src/modules/tool-marketplace/access/types.ts:284](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L284) |
| <a id="createdby-1"></a> `createdBy` | `` `0x${string}` `` | Created by (address) | [`ListEntry`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#listentry).[`createdBy`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#createdby-3) | [defi/protocols/src/modules/tool-marketplace/access/types.ts:282](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L282) |
| <a id="expiresat-3"></a> `expiresAt?` | `number` | Expiration timestamp (undefined = permanent) | [`ListEntry`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#listentry).[`expiresAt`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#expiresat-5) | [defi/protocols/src/modules/tool-marketplace/access/types.ts:286](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L286) |
| <a id="id-5"></a> `id` | `string` | Entry ID | [`ListEntry`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#listentry).[`id`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#id-6) | [defi/protocols/src/modules/tool-marketplace/access/types.ts:272](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L272) |
| <a id="reason-1"></a> `reason?` | `string` | Reason for listing | [`ListEntry`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#listentry).[`reason`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#reason-2) | [defi/protocols/src/modules/tool-marketplace/access/types.ts:280](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L280) |
| <a id="severity"></a> `severity` | `"low"` \| `"medium"` \| `"high"` \| `"critical"` | Severity level | - | [defi/protocols/src/modules/tool-marketplace/access/types.ts:304](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L304) |
| <a id="strikes"></a> `strikes?` | `number` | Number of strikes before this block | - | [defi/protocols/src/modules/tool-marketplace/access/types.ts:306](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L306) |
| <a id="toolid-5"></a> `toolId` | `string` | Tool ID this entry applies to | [`ListEntry`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#listentry).[`toolId`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#toolid-8) | [defi/protocols/src/modules/tool-marketplace/access/types.ts:274](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L274) |
| <a id="type-2"></a> `type` | [`ListEntryType`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#listentrytype-1) | Entry type | [`ListEntry`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#listentry).[`type`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#type-3) | [defi/protocols/src/modules/tool-marketplace/access/types.ts:276](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L276) |
| <a id="value-1"></a> `value` | `string` | Value (address, IP, or CIDR) | [`ListEntry`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#listentry).[`value`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#value-2) | [defi/protocols/src/modules/tool-marketplace/access/types.ts:278](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L278) |

***

### ChangeSubscriptionInput

Defined in: [defi/protocols/src/modules/tool-marketplace/access/types.ts:409](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L409)

Subscription upgrade/downgrade input

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="newtier"></a> `newTier` | [`AccessTierName`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#accesstiername-1) | New tier | [defi/protocols/src/modules/tool-marketplace/access/types.ts:413](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L413) |
| <a id="prorate"></a> `prorate?` | `boolean` | Prorate charges/credits | [defi/protocols/src/modules/tool-marketplace/access/types.ts:415](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L415) |
| <a id="subscriptionid"></a> `subscriptionId` | `string` | Subscription ID | [defi/protocols/src/modules/tool-marketplace/access/types.ts:411](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L411) |

***

### CreateKeyOptions

Defined in: [defi/protocols/src/modules/tool-marketplace/access/types.ts:83](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L83)

API key creation options

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="expiresat-4"></a> `expiresAt?` | `number` | Key expiration timestamp (Unix ms) | [defi/protocols/src/modules/tool-marketplace/access/types.ts:91](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L91) |
| <a id="metadata-2"></a> `metadata?` | `Record`\<`string`, `unknown`\> | Metadata for the key | [defi/protocols/src/modules/tool-marketplace/access/types.ts:93](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L93) |
| <a id="name-3"></a> `name` | `string` | Human-readable name for the key | [defi/protocols/src/modules/tool-marketplace/access/types.ts:85](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L85) |
| <a id="permissions-3"></a> `permissions?` | [`Permission`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#permission)[] | Permissions for this key | [defi/protocols/src/modules/tool-marketplace/access/types.ts:87](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L87) |
| <a id="ratelimit-3"></a> `rateLimit?` | [`RateLimit`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#ratelimit-4) | Custom rate limit (overrides tier default) | [defi/protocols/src/modules/tool-marketplace/access/types.ts:89](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L89) |

***

### CreateSubscriptionInput

Defined in: [defi/protocols/src/modules/tool-marketplace/access/types.ts:391](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L391)

Subscription creation input

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="autorenew"></a> `autoRenew?` | `boolean` | Auto-renew enabled | [defi/protocols/src/modules/tool-marketplace/access/types.ts:403](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L403) |
| <a id="paymentchain"></a> `paymentChain` | `string` | Payment chain | [defi/protocols/src/modules/tool-marketplace/access/types.ts:401](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L401) |
| <a id="paymenttoken"></a> `paymentToken` | `"USDC"` \| `"USDs"` | Payment token | [defi/protocols/src/modules/tool-marketplace/access/types.ts:399](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L399) |
| <a id="tier-2"></a> `tier` | [`AccessTierName`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#accesstiername-1) | Access tier | [defi/protocols/src/modules/tool-marketplace/access/types.ts:397](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L397) |
| <a id="toolid-6"></a> `toolId` | `string` | Tool ID | [defi/protocols/src/modules/tool-marketplace/access/types.ts:395](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L395) |
| <a id="userid-3"></a> `userId` | `` `0x${string}` `` | User address | [defi/protocols/src/modules/tool-marketplace/access/types.ts:393](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L393) |

***

### GeoRestriction

Defined in: [defi/protocols/src/modules/tool-marketplace/access/types.ts:312](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L312)

Geographic restriction

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="countries"></a> `countries` | `string`[] | Country codes (ISO 3166-1 alpha-2) | [defi/protocols/src/modules/tool-marketplace/access/types.ts:318](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L318) |
| <a id="createdat-5"></a> `createdAt` | `number` | Creation timestamp | [defi/protocols/src/modules/tool-marketplace/access/types.ts:322](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L322) |
| <a id="createdby-2"></a> `createdBy` | `` `0x${string}` `` | Created by | [defi/protocols/src/modules/tool-marketplace/access/types.ts:320](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L320) |
| <a id="mode"></a> `mode` | `"block"` \| `"allow"` | Restriction mode | [defi/protocols/src/modules/tool-marketplace/access/types.ts:316](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L316) |
| <a id="toolid-7"></a> `toolId` | `string` | Tool ID | [defi/protocols/src/modules/tool-marketplace/access/types.ts:314](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L314) |

***

### KeyRotationResult

Defined in: [defi/protocols/src/modules/tool-marketplace/access/types.ts:163](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L163)

Key rotation result

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="newkey"></a> `newKey` | [`APIKeyWithSecret`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#apikeywithsecret) | New API key | [defi/protocols/src/modules/tool-marketplace/access/types.ts:165](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L165) |
| <a id="oldkeyexpiresat"></a> `oldKeyExpiresAt` | `number` | When old key expires | [defi/protocols/src/modules/tool-marketplace/access/types.ts:169](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L169) |
| <a id="oldkeyid"></a> `oldKeyId` | `string` | Old key ID (will expire in 24h) | [defi/protocols/src/modules/tool-marketplace/access/types.ts:167](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L167) |

***

### KeyValidationResult

Defined in: [defi/protocols/src/modules/tool-marketplace/access/types.ts:147](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L147)

Key validation result

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="error-1"></a> `error?` | `string` | Error message if invalid | [defi/protocols/src/modules/tool-marketplace/access/types.ts:153](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L153) |
| <a id="errorcode"></a> `errorCode?` | \| `"INVALID_KEY"` \| `"EXPIRED"` \| `"REVOKED"` \| `"RATE_LIMITED"` \| `"QUOTA_EXCEEDED"` \| `"BLOCKED"` | Error code for programmatic handling | [defi/protocols/src/modules/tool-marketplace/access/types.ts:155](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L155) |
| <a id="key-1"></a> `key?` | [`APIKey`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#apikey) | The key record if valid | [defi/protocols/src/modules/tool-marketplace/access/types.ts:151](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L151) |
| <a id="ratelimitstatus"></a> `rateLimitStatus?` | [`RateLimitStatus`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#ratelimitstatus-1) | Rate limit status | [defi/protocols/src/modules/tool-marketplace/access/types.ts:157](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L157) |
| <a id="valid"></a> `valid` | `boolean` | Whether the key is valid | [defi/protocols/src/modules/tool-marketplace/access/types.ts:149](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L149) |

***

### ListEntry

Defined in: [defi/protocols/src/modules/tool-marketplace/access/types.ts:270](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L270)

List entry

#### Extended by

- [`AllowlistEntry`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#allowlistentry)
- [`BlocklistEntry`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#blocklistentry)

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="createdat-6"></a> `createdAt` | `number` | Creation timestamp | [defi/protocols/src/modules/tool-marketplace/access/types.ts:284](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L284) |
| <a id="createdby-3"></a> `createdBy` | `` `0x${string}` `` | Created by (address) | [defi/protocols/src/modules/tool-marketplace/access/types.ts:282](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L282) |
| <a id="expiresat-5"></a> `expiresAt?` | `number` | Expiration timestamp (undefined = permanent) | [defi/protocols/src/modules/tool-marketplace/access/types.ts:286](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L286) |
| <a id="id-6"></a> `id` | `string` | Entry ID | [defi/protocols/src/modules/tool-marketplace/access/types.ts:272](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L272) |
| <a id="reason-2"></a> `reason?` | `string` | Reason for listing | [defi/protocols/src/modules/tool-marketplace/access/types.ts:280](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L280) |
| <a id="toolid-8"></a> `toolId` | `string` | Tool ID this entry applies to | [defi/protocols/src/modules/tool-marketplace/access/types.ts:274](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L274) |
| <a id="type-3"></a> `type` | [`ListEntryType`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#listentrytype-1) | Entry type | [defi/protocols/src/modules/tool-marketplace/access/types.ts:276](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L276) |
| <a id="value-2"></a> `value` | `string` | Value (address, IP, or CIDR) | [defi/protocols/src/modules/tool-marketplace/access/types.ts:278](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L278) |

***

### Permission

Defined in: [defi/protocols/src/modules/tool-marketplace/access/types.ts:22](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L22)

Permission for a specific tool operation

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="actions"></a> `actions?` | `string`[] | Specific actions allowed (optional, defaults to all within scope) | [defi/protocols/src/modules/tool-marketplace/access/types.ts:28](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L28) |
| <a id="scope"></a> `scope` | [`PermissionScope`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#permissionscope-1) | Permission scope | [defi/protocols/src/modules/tool-marketplace/access/types.ts:26](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L26) |
| <a id="toolid-9"></a> `toolId` | `string` | Tool ID this permission applies to (or "*" for all tools) | [defi/protocols/src/modules/tool-marketplace/access/types.ts:24](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L24) |

***

### QuotaConfig

Defined in: [defi/protocols/src/modules/tool-marketplace/access/types.ts:215](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L215)

Usage quota configuration

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="dailylimit"></a> `dailyLimit?` | `number` | Daily quota limit (optional) | [defi/protocols/src/modules/tool-marketplace/access/types.ts:219](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L219) |
| <a id="monthlylimit"></a> `monthlyLimit` | `number` | Monthly quota limit | [defi/protocols/src/modules/tool-marketplace/access/types.ts:217](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L217) |
| <a id="notifythreshold"></a> `notifyThreshold?` | `number` | Notification threshold (percentage) | [defi/protocols/src/modules/tool-marketplace/access/types.ts:225](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L225) |
| <a id="overagerate"></a> `overageRate?` | `string` | Premium rate for overage (if allow_premium) | [defi/protocols/src/modules/tool-marketplace/access/types.ts:223](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L223) |
| <a id="overagestrategy"></a> `overageStrategy` | [`OverageStrategy`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#overagestrategy-1) | Overage handling strategy | [defi/protocols/src/modules/tool-marketplace/access/types.ts:221](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L221) |
| <a id="throttlerate"></a> `throttleRate?` | `number` | Throttle rate when exceeded (if throttle) | [defi/protocols/src/modules/tool-marketplace/access/types.ts:227](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L227) |

***

### QuotaStatus

Defined in: [defi/protocols/src/modules/tool-marketplace/access/types.ts:233](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L233)

Quota status

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="exceeded"></a> `exceeded` | `boolean` | Is quota exceeded | [defi/protocols/src/modules/tool-marketplace/access/types.ts:249](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L249) |
| <a id="id-7"></a> `id` | `string` | Key or user ID | [defi/protocols/src/modules/tool-marketplace/access/types.ts:235](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L235) |
| <a id="limit"></a> `limit` | `number` | Quota limit | [defi/protocols/src/modules/tool-marketplace/access/types.ts:243](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L243) |
| <a id="overage"></a> `overage?` | `number` | Overage calls (if any) | [defi/protocols/src/modules/tool-marketplace/access/types.ts:253](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L253) |
| <a id="overagecharges"></a> `overageCharges?` | `string` | Overage charges (if any) | [defi/protocols/src/modules/tool-marketplace/access/types.ts:255](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L255) |
| <a id="percentused"></a> `percentUsed` | `number` | Percentage used | [defi/protocols/src/modules/tool-marketplace/access/types.ts:247](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L247) |
| <a id="period"></a> `period` | `string` | Current period (month) | [defi/protocols/src/modules/tool-marketplace/access/types.ts:239](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L239) |
| <a id="remaining"></a> `remaining` | `number` | Remaining calls | [defi/protocols/src/modules/tool-marketplace/access/types.ts:245](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L245) |
| <a id="resetsat"></a> `resetsAt` | `number` | When quota resets (Unix ms) | [defi/protocols/src/modules/tool-marketplace/access/types.ts:251](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L251) |
| <a id="toolid-10"></a> `toolId` | `string` | Tool ID | [defi/protocols/src/modules/tool-marketplace/access/types.ts:237](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L237) |
| <a id="used"></a> `used` | `number` | Calls used this period | [defi/protocols/src/modules/tool-marketplace/access/types.ts:241](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L241) |

***

### RateLimit

Defined in: [defi/protocols/src/modules/tool-marketplace/access/types.ts:43](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L43)

Rate limit configuration

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="period-1"></a> `period` | [`RatePeriod`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#rateperiod) | Time period for the limit | [defi/protocols/src/modules/tool-marketplace/access/types.ts:47](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L47) |
| <a id="requests"></a> `requests` | `number` | Maximum requests allowed | [defi/protocols/src/modules/tool-marketplace/access/types.ts:45](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L45) |

***

### RateLimitHeaders

Defined in: [defi/protocols/src/modules/tool-marketplace/access/types.ts:69](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L69)

Rate limit headers for HTTP responses

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="retry-after"></a> `Retry-After?` | `string` | [defi/protocols/src/modules/tool-marketplace/access/types.ts:73](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L73) |
| <a id="x-ratelimit-limit"></a> `X-RateLimit-Limit` | `string` | [defi/protocols/src/modules/tool-marketplace/access/types.ts:70](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L70) |
| <a id="x-ratelimit-remaining"></a> `X-RateLimit-Remaining` | `string` | [defi/protocols/src/modules/tool-marketplace/access/types.ts:71](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L71) |
| <a id="x-ratelimit-reset"></a> `X-RateLimit-Reset` | `string` | [defi/protocols/src/modules/tool-marketplace/access/types.ts:72](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L72) |

***

### RateLimitStatus

Defined in: [defi/protocols/src/modules/tool-marketplace/access/types.ts:53](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L53)

Rate limit status for a key or user

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="limit-1"></a> `limit` | `number` | Total requests allowed | [defi/protocols/src/modules/tool-marketplace/access/types.ts:59](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L59) |
| <a id="limited"></a> `limited` | `boolean` | Whether the rate limit is exceeded | [defi/protocols/src/modules/tool-marketplace/access/types.ts:55](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L55) |
| <a id="remaining-1"></a> `remaining` | `number` | Remaining requests in current window | [defi/protocols/src/modules/tool-marketplace/access/types.ts:57](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L57) |
| <a id="resetat"></a> `resetAt` | `number` | Timestamp when limit resets (Unix ms) | [defi/protocols/src/modules/tool-marketplace/access/types.ts:63](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L63) |
| <a id="resetin"></a> `resetIn` | `number` | Time until reset (in seconds) | [defi/protocols/src/modules/tool-marketplace/access/types.ts:61](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L61) |

***

### Subscription

Defined in: [defi/protocols/src/modules/tool-marketplace/access/types.ts:343](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L343)

Subscription record

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="autorenew-1"></a> `autoRenew` | `boolean` | Auto-renew enabled | [defi/protocols/src/modules/tool-marketplace/access/types.ts:361](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L361) |
| <a id="callsused"></a> `callsUsed` | `number` | Calls used this period | [defi/protocols/src/modules/tool-marketplace/access/types.ts:363](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L363) |
| <a id="canceledat"></a> `canceledAt?` | `number` | Cancellation timestamp | [defi/protocols/src/modules/tool-marketplace/access/types.ts:379](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L379) |
| <a id="cancellationreason"></a> `cancellationReason?` | `string` | Cancellation reason | [defi/protocols/src/modules/tool-marketplace/access/types.ts:381](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L381) |
| <a id="createdat-7"></a> `createdAt` | `number` | Created timestamp | [defi/protocols/src/modules/tool-marketplace/access/types.ts:383](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L383) |
| <a id="currentperiodend"></a> `currentPeriodEnd` | `number` | Current period end | [defi/protocols/src/modules/tool-marketplace/access/types.ts:359](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L359) |
| <a id="currentperiodstart"></a> `currentPeriodStart` | `number` | Current period start | [defi/protocols/src/modules/tool-marketplace/access/types.ts:357](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L357) |
| <a id="failedpayments"></a> `failedPayments` | `number` | Failed payment count | [defi/protocols/src/modules/tool-marketplace/access/types.ts:375](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L375) |
| <a id="graceperiodend"></a> `gracePeriodEnd?` | `number` | Grace period end (if past_due) | [defi/protocols/src/modules/tool-marketplace/access/types.ts:377](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L377) |
| <a id="id-8"></a> `id` | `string` | Subscription ID | [defi/protocols/src/modules/tool-marketplace/access/types.ts:345](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L345) |
| <a id="lastpaymentamount"></a> `lastPaymentAmount?` | `string` | Last payment amount | [defi/protocols/src/modules/tool-marketplace/access/types.ts:371](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L371) |
| <a id="lastpaymentat"></a> `lastPaymentAt?` | `number` | Last payment timestamp | [defi/protocols/src/modules/tool-marketplace/access/types.ts:369](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L369) |
| <a id="lastpaymenttxhash"></a> `lastPaymentTxHash?` | `string` | Last payment tx hash | [defi/protocols/src/modules/tool-marketplace/access/types.ts:373](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L373) |
| <a id="paymentchain-1"></a> `paymentChain` | `string` | Payment chain | [defi/protocols/src/modules/tool-marketplace/access/types.ts:367](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L367) |
| <a id="paymenttoken-1"></a> `paymentToken` | `"USDC"` \| `"USDs"` | Payment token | [defi/protocols/src/modules/tool-marketplace/access/types.ts:365](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L365) |
| <a id="startedat"></a> `startedAt` | `number` | Start timestamp | [defi/protocols/src/modules/tool-marketplace/access/types.ts:355](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L355) |
| <a id="state"></a> `state` | [`SubscriptionState`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#subscriptionstate-1) | Subscription state | [defi/protocols/src/modules/tool-marketplace/access/types.ts:353](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L353) |
| <a id="tier-3"></a> `tier` | [`AccessTierName`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#accesstiername-1) | Access tier | [defi/protocols/src/modules/tool-marketplace/access/types.ts:351](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L351) |
| <a id="toolid-11"></a> `toolId` | `string` | Tool ID | [defi/protocols/src/modules/tool-marketplace/access/types.ts:349](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L349) |
| <a id="updatedat"></a> `updatedAt` | `number` | Updated timestamp | [defi/protocols/src/modules/tool-marketplace/access/types.ts:385](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L385) |
| <a id="userid-4"></a> `userId` | `` `0x${string}` `` | User address | [defi/protocols/src/modules/tool-marketplace/access/types.ts:347](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L347) |

## Type Aliases

### AccessEventType

```ts
type AccessEventType = 
  | "key_created"
  | "key_revoked"
  | "key_rotated"
  | "key_expired"
  | "rate_limit_hit"
  | "quota_exceeded"
  | "quota_warning"
  | "user_blocked"
  | "user_unblocked"
  | "subscription_created"
  | "subscription_renewed"
  | "subscription_canceled"
  | "subscription_upgraded"
  | "subscription_downgraded"
  | "payment_failed";
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/types.ts:425](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L425)

Access control event types

***

### AccessTierName

```ts
type AccessTierName = "free" | "basic" | "pro" | "enterprise";
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/types.ts:179](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L179)

Access tier names

***

### ListEntryType

```ts
type ListEntryType = "address" | "ip" | "cidr";
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/types.ts:265](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L265)

List entry type

***

### OverageStrategy

```ts
type OverageStrategy = "block" | "allow_premium" | "notify" | "throttle";
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/types.ts:210](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L210)

Overage handling strategy

***

### PermissionScope

```ts
type PermissionScope = "read" | "write" | "admin";
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/types.ts:17](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L17)

Permission scope for API keys

***

### RatePeriod

```ts
type RatePeriod = "second" | "minute" | "hour" | "day";
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/types.ts:38](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L38)

Time period for rate limiting

***

### SubscriptionState

```ts
type SubscriptionState = "active" | "past_due" | "canceled" | "expired" | "paused" | "trialing";
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/types.ts:332](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/types.ts#L332)

Subscription status
