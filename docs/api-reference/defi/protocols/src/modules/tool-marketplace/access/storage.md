[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/modules/tool-marketplace/access/storage

# defi/protocols/src/modules/tool-marketplace/access/storage

## Classes

### InMemoryStorageAdapter

Defined in: [defi/protocols/src/modules/tool-marketplace/access/storage.ts:25](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/storage.ts#L25)

In-memory storage adapter for access control data
Suitable for development and MVP, replace with Redis/database for production

#### Implements

- [`AccessStorageAdapter`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#accessstorageadapter)

#### Constructors

##### Constructor

```ts
new InMemoryStorageAdapter(): InMemoryStorageAdapter;
```

###### Returns

[`InMemoryStorageAdapter`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/storage.md#inmemorystorageadapter)

#### Methods

##### cleanupExpiredRateLimits()

```ts
cleanupExpiredRateLimits(): void;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/storage.ts:322](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/storage.ts#L322)

Cleanup expired rate limits

###### Returns

`void`

##### clear()

```ts
clear(): void;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/storage.ts:306](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/storage.ts#L306)

Clear all data (useful for testing)

###### Returns

`void`

##### deleteKey()

```ts
deleteKey(keyId: string): Promise<void>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/storage.ts:73](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/storage.ts#L73)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `keyId` | `string` |

###### Returns

`Promise`\<`void`\>

###### Implementation of

[`AccessStorageAdapter`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#accessstorageadapter).[`deleteKey`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#deletekey)

##### deleteWebhook()

```ts
deleteWebhook(webhookId: string): Promise<void>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/storage.ts:295](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/storage.ts#L295)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `webhookId` | `string` |

###### Returns

`Promise`\<`void`\>

###### Implementation of

[`AccessStorageAdapter`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#accessstorageadapter).[`deleteWebhook`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#deletewebhook)

##### getallowlist()

```ts
getallowlist(toolId: string): Promise<AllowlistEntry[]>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/storage.ts:144](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/storage.ts#L144)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |

###### Returns

`Promise`\<[`AllowlistEntry`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#allowlistentry)[]\>

###### Implementation of

[`AccessStorageAdapter`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#accessstorageadapter).[`getallowlist`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#getallowlist)

##### getAuditLogs()

```ts
getAuditLogs(filter: {
  action?: AccessEventType;
  limit?: number;
  toolId?: string;
  userId?: `0x${string}`;
}): Promise<AuditLogEntry[]>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/storage.ts:239](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/storage.ts#L239)

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

###### Implementation of

[`AccessStorageAdapter`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#accessstorageadapter).[`getAuditLogs`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#getauditlogs)

##### getBlocklist()

```ts
getBlocklist(toolId: string): Promise<BlocklistEntry[]>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/storage.ts:158](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/storage.ts#L158)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |

###### Returns

`Promise`\<[`BlocklistEntry`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#blocklistentry)[]\>

###### Implementation of

[`AccessStorageAdapter`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#accessstorageadapter).[`getBlocklist`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#getblocklist)

##### getGeoRestriction()

```ts
getGeoRestriction(toolId: string): Promise<
  | GeoRestriction
| null>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/storage.ts:172](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/storage.ts#L172)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |

###### Returns

`Promise`\<
  \| [`GeoRestriction`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#georestriction)
  \| `null`\>

###### Implementation of

[`AccessStorageAdapter`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#accessstorageadapter).[`getGeoRestriction`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#getgeorestriction)

##### getKey()

```ts
getKey(keyId: string): Promise<
  | APIKey
| null>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/storage.ts:46](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/storage.ts#L46)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `keyId` | `string` |

###### Returns

`Promise`\<
  \| [`APIKey`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#apikey)
  \| `null`\>

###### Implementation of

[`AccessStorageAdapter`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#accessstorageadapter).[`getKey`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#getkey)

##### getKeyByHash()

```ts
getKeyByHash(keyHash: string): Promise<
  | APIKey
| null>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/storage.ts:50](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/storage.ts#L50)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `keyHash` | `string` |

###### Returns

`Promise`\<
  \| [`APIKey`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#apikey)
  \| `null`\>

###### Implementation of

[`AccessStorageAdapter`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#accessstorageadapter).[`getKeyByHash`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#getkeybyhash)

##### getKeysByTool()

```ts
getKeysByTool(toolId: string): Promise<APIKey[]>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/storage.ts:62](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/storage.ts#L62)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |

###### Returns

`Promise`\<[`APIKey`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#apikey)[]\>

###### Implementation of

[`AccessStorageAdapter`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#accessstorageadapter).[`getKeysByTool`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#getkeysbytool)

##### getKeysByUser()

```ts
getKeysByUser(userId: `0x${string}`): Promise<APIKey[]>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/storage.ts:56](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/storage.ts#L56)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `userId` | `` `0x${string}` `` |

###### Returns

`Promise`\<[`APIKey`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#apikey)[]\>

###### Implementation of

[`AccessStorageAdapter`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#accessstorageadapter).[`getKeysByUser`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#getkeysbyuser)

##### getQuotaUsage()

```ts
getQuotaUsage(key: string, period: string): Promise<number>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/storage.ts:210](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/storage.ts#L210)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `key` | `string` |
| `period` | `string` |

###### Returns

`Promise`\<`number`\>

###### Implementation of

[`AccessStorageAdapter`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#accessstorageadapter).[`getQuotaUsage`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#getquotausage)

##### getRateCount()

```ts
getRateCount(key: string): Promise<number>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/storage.ts:180](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/storage.ts#L180)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `key` | `string` |

###### Returns

`Promise`\<`number`\>

###### Implementation of

[`AccessStorageAdapter`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#accessstorageadapter).[`getRateCount`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#getratecount)

##### getStats()

```ts
getStats(): {
  allowlistEntries: number;
  auditLogs: number;
  blocklistEntries: number;
  keys: number;
  subscriptions: number;
  webhooks: number;
};
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/storage.ts:334](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/storage.ts#L334)

Get storage stats

###### Returns

```ts
{
  allowlistEntries: number;
  auditLogs: number;
  blocklistEntries: number;
  keys: number;
  subscriptions: number;
  webhooks: number;
}
```

| Name | Type | Defined in |
| :------ | :------ | :------ |
| `allowlistEntries` | `number` | [defi/protocols/src/modules/tool-marketplace/access/storage.ts:337](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/storage.ts#L337) |
| `auditLogs` | `number` | [defi/protocols/src/modules/tool-marketplace/access/storage.ts:339](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/storage.ts#L339) |
| `blocklistEntries` | `number` | [defi/protocols/src/modules/tool-marketplace/access/storage.ts:338](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/storage.ts#L338) |
| `keys` | `number` | [defi/protocols/src/modules/tool-marketplace/access/storage.ts:335](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/storage.ts#L335) |
| `subscriptions` | `number` | [defi/protocols/src/modules/tool-marketplace/access/storage.ts:336](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/storage.ts#L336) |
| `webhooks` | `number` | [defi/protocols/src/modules/tool-marketplace/access/storage.ts:340](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/storage.ts#L340) |

##### getSubscription()

```ts
getSubscription(subscriptionId: string): Promise<
  | Subscription
| null>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/storage.ts:89](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/storage.ts#L89)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `subscriptionId` | `string` |

###### Returns

`Promise`\<
  \| [`Subscription`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#subscription)
  \| `null`\>

###### Implementation of

[`AccessStorageAdapter`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#accessstorageadapter).[`getSubscription`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#getsubscription)

##### getSubscriptionByUserAndTool()

```ts
getSubscriptionByUserAndTool(userId: `0x${string}`, toolId: string): Promise<
  | Subscription
| null>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/storage.ts:93](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/storage.ts#L93)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `userId` | `` `0x${string}` `` |
| `toolId` | `string` |

###### Returns

`Promise`\<
  \| [`Subscription`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#subscription)
  \| `null`\>

###### Implementation of

[`AccessStorageAdapter`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#accessstorageadapter).[`getSubscriptionByUserAndTool`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#getsubscriptionbyuserandtool)

##### getSubscriptionsByTool()

```ts
getSubscriptionsByTool(toolId: string): Promise<Subscription[]>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/storage.ts:116](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/storage.ts#L116)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |

###### Returns

`Promise`\<[`Subscription`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#subscription)[]\>

###### Implementation of

[`AccessStorageAdapter`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#accessstorageadapter).[`getSubscriptionsByTool`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#getsubscriptionsbytool)

##### getSubscriptionsByUser()

```ts
getSubscriptionsByUser(userId: `0x${string}`): Promise<Subscription[]>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/storage.ts:110](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/storage.ts#L110)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `userId` | `` `0x${string}` `` |

###### Returns

`Promise`\<[`Subscription`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#subscription)[]\>

###### Implementation of

[`AccessStorageAdapter`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#accessstorageadapter).[`getSubscriptionsByUser`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#getsubscriptionsbyuser)

##### getWebhooks()

```ts
getWebhooks(toolId: string): Promise<AccessWebhook[]>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/storage.ts:279](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/storage.ts#L279)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |

###### Returns

`Promise`\<[`AccessWebhook`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#accesswebhook)[]\>

###### Implementation of

[`AccessStorageAdapter`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#accessstorageadapter).[`getWebhooks`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#getwebhooks)

##### incrementQuotaUsage()

```ts
incrementQuotaUsage(
   key: string, 
   period: string, 
amount: number): Promise<number>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/storage.ts:215](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/storage.ts#L215)

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `key` | `string` | `undefined` |
| `period` | `string` | `undefined` |
| `amount` | `number` | `1` |

###### Returns

`Promise`\<`number`\>

###### Implementation of

[`AccessStorageAdapter`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#accessstorageadapter).[`incrementQuotaUsage`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#incrementquotausage)

##### incrementRateCount()

```ts
incrementRateCount(key: string, ttlSeconds: number): Promise<number>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/storage.ts:188](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/storage.ts#L188)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `key` | `string` |
| `ttlSeconds` | `number` |

###### Returns

`Promise`\<`number`\>

###### Implementation of

[`AccessStorageAdapter`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#accessstorageadapter).[`incrementRateCount`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#incrementratecount)

##### removeAllowlistEntry()

```ts
removeAllowlistEntry(entryId: string): Promise<void>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/storage.ts:150](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/storage.ts#L150)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `entryId` | `string` |

###### Returns

`Promise`\<`void`\>

###### Implementation of

[`AccessStorageAdapter`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#accessstorageadapter).[`removeAllowlistEntry`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#removeallowlistentry)

##### removeBlocklistEntry()

```ts
removeBlocklistEntry(entryId: string): Promise<void>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/storage.ts:164](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/storage.ts#L164)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `entryId` | `string` |

###### Returns

`Promise`\<`void`\>

###### Implementation of

[`AccessStorageAdapter`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#accessstorageadapter).[`removeBlocklistEntry`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#removeblocklistentry)

##### saveAllowlistEntry()

```ts
saveAllowlistEntry(entry: AllowlistEntry): Promise<void>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/storage.ts:140](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/storage.ts#L140)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `entry` | [`AllowlistEntry`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#allowlistentry) |

###### Returns

`Promise`\<`void`\>

###### Implementation of

[`AccessStorageAdapter`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#accessstorageadapter).[`saveAllowlistEntry`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#saveallowlistentry)

##### saveAuditLog()

```ts
saveAuditLog(entry: AuditLogEntry): Promise<void>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/storage.ts:231](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/storage.ts#L231)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `entry` | [`AuditLogEntry`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#auditlogentry) |

###### Returns

`Promise`\<`void`\>

###### Implementation of

[`AccessStorageAdapter`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#accessstorageadapter).[`saveAuditLog`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#saveauditlog)

##### saveBlocklistEntry()

```ts
saveBlocklistEntry(entry: BlocklistEntry): Promise<void>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/storage.ts:154](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/storage.ts#L154)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `entry` | [`BlocklistEntry`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#blocklistentry) |

###### Returns

`Promise`\<`void`\>

###### Implementation of

[`AccessStorageAdapter`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#accessstorageadapter).[`saveBlocklistEntry`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#saveblocklistentry)

##### saveGeoRestriction()

```ts
saveGeoRestriction(restriction: GeoRestriction): Promise<void>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/storage.ts:168](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/storage.ts#L168)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `restriction` | [`GeoRestriction`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#georestriction) |

###### Returns

`Promise`\<`void`\>

###### Implementation of

[`AccessStorageAdapter`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#accessstorageadapter).[`saveGeoRestriction`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#savegeorestriction)

##### saveKey()

```ts
saveKey(key: APIKey): Promise<void>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/storage.ts:41](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/storage.ts#L41)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `key` | [`APIKey`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#apikey) |

###### Returns

`Promise`\<`void`\>

###### Implementation of

[`AccessStorageAdapter`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#accessstorageadapter).[`saveKey`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#savekey)

##### saveSubscription()

```ts
saveSubscription(subscription: Subscription): Promise<void>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/storage.ts:85](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/storage.ts#L85)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `subscription` | [`Subscription`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#subscription) |

###### Returns

`Promise`\<`void`\>

###### Implementation of

[`AccessStorageAdapter`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#accessstorageadapter).[`saveSubscription`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#savesubscription)

##### saveWebhook()

```ts
saveWebhook(webhook: AccessWebhook): Promise<void>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/storage.ts:275](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/storage.ts#L275)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `webhook` | [`AccessWebhook`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#accesswebhook) |

###### Returns

`Promise`\<`void`\>

###### Implementation of

[`AccessStorageAdapter`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#accessstorageadapter).[`saveWebhook`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#savewebhook)

##### updateKey()

```ts
updateKey(keyId: string, updates: Partial<APIKey>): Promise<void>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/storage.ts:66](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/storage.ts#L66)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `keyId` | `string` |
| `updates` | `Partial`\<[`APIKey`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#apikey)\> |

###### Returns

`Promise`\<`void`\>

###### Implementation of

[`AccessStorageAdapter`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#accessstorageadapter).[`updateKey`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#updatekey)

##### updateSubscription()

```ts
updateSubscription(subscriptionId: string, updates: Partial<Subscription>): Promise<void>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/storage.ts:122](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/storage.ts#L122)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `subscriptionId` | `string` |
| `updates` | `Partial`\<[`Subscription`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#subscription)\> |

###### Returns

`Promise`\<`void`\>

###### Implementation of

[`AccessStorageAdapter`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#accessstorageadapter).[`updateSubscription`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#updatesubscription)

##### updateWebhook()

```ts
updateWebhook(webhookId: string, updates: Partial<AccessWebhook>): Promise<void>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/storage.ts:285](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/storage.ts#L285)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `webhookId` | `string` |
| `updates` | `Partial`\<[`AccessWebhook`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#accesswebhook)\> |

###### Returns

`Promise`\<`void`\>

###### Implementation of

[`AccessStorageAdapter`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#accessstorageadapter).[`updateWebhook`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#updatewebhook)

## Variables

### defaultStorage

```ts
const defaultStorage: InMemoryStorageAdapter;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/storage.ts:356](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/storage.ts#L356)

Default storage instance
