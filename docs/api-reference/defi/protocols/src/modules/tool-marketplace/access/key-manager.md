[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/modules/tool-marketplace/access/key-manager

# defi/protocols/src/modules/tool-marketplace/access/key-manager

## Classes

### KeyManager

Defined in: [defi/protocols/src/modules/tool-marketplace/access/key-manager.ts:44](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/key-manager.ts#L44)

API Key Manager Service

#### Constructors

##### Constructor

```ts
new KeyManager(storage: AccessStorageAdapter): KeyManager;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/key-manager.ts:48](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/key-manager.ts#L48)

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `storage` | [`AccessStorageAdapter`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#accessstorageadapter) | `defaultStorage` |

###### Returns

[`KeyManager`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/key-manager.md#keymanager)

#### Methods

##### cleanupExpiredKeys()

```ts
cleanupExpiredKeys(): Promise<number>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/key-manager.ts:414](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/key-manager.ts#L414)

Cleanup expired keys

###### Returns

`Promise`\<`number`\>

##### createKey()

```ts
createKey(
   toolId: string, 
   userId: `0x${string}`, 
   options: CreateKeyOptions, 
tier: AccessTierName): Promise<APIKeyWithSecret>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/key-manager.ts:90](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/key-manager.ts#L90)

Create a new API key

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `toolId` | `string` | `undefined` |
| `userId` | `` `0x${string}` `` | `undefined` |
| `options` | [`CreateKeyOptions`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#createkeyoptions) | `undefined` |
| `tier` | [`AccessTierName`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#accesstiername-1) | `"free"` |

###### Returns

`Promise`\<[`APIKeyWithSecret`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#apikeywithsecret)\>

##### getKey()

```ts
getKey(keyId: string): Promise<
  | APIKey
| null>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/key-manager.ts:320](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/key-manager.ts#L320)

Get a key by ID

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `keyId` | `string` |

###### Returns

`Promise`\<
  \| [`APIKey`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#apikey)
  \| `null`\>

##### getKeysByTool()

```ts
getKeysByTool(toolId: string): Promise<APIKey[]>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/key-manager.ts:334](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/key-manager.ts#L334)

Get all keys for a tool

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

Defined in: [defi/protocols/src/modules/tool-marketplace/access/key-manager.ts:327](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/key-manager.ts#L327)

Get all keys for a user

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `userId` | `` `0x${string}` `` |

###### Returns

`Promise`\<[`APIKey`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#apikey)[]\>

##### getKeyUsageStats()

```ts
getKeyUsageStats(keyId: string): Promise<{
  createdAt: number;
  daysActive: number;
  lastUsedAt?: number;
  totalUsage: number;
}>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/key-manager.ts:446](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/key-manager.ts#L446)

Get key usage statistics

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `keyId` | `string` |

###### Returns

`Promise`\<\{
  `createdAt`: `number`;
  `daysActive`: `number`;
  `lastUsedAt?`: `number`;
  `totalUsage`: `number`;
\}\>

##### markUnusedKeysForExpiration()

```ts
markUnusedKeysForExpiration(): Promise<number>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/key-manager.ts:434](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/key-manager.ts#L434)

Check for unused keys and mark for expiration

###### Returns

`Promise`\<`number`\>

##### registerWebhookHandler()

```ts
registerWebhookHandler(toolId: string, handler: (event: any) => Promise<void>): void;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/key-manager.ts:471](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/key-manager.ts#L471)

Register a webhook handler for events

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |
| `handler` | (`event`: `any`) => `Promise`\<`void`\> |

###### Returns

`void`

##### revokeKey()

```ts
revokeKey(
   keyId: string, 
   revokedBy: `0x${string}`, 
reason?: string): Promise<void>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/key-manager.ts:222](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/key-manager.ts#L222)

Revoke an API key

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `keyId` | `string` |
| `revokedBy` | `` `0x${string}` `` |
| `reason?` | `string` |

###### Returns

`Promise`\<`void`\>

##### rotateKey()

```ts
rotateKey(keyId: string, rotatedBy: `0x${string}`): Promise<KeyRotationResult>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/key-manager.ts:263](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/key-manager.ts#L263)

Rotate an API key (create new, old expires in 24h)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `keyId` | `string` |
| `rotatedBy` | `` `0x${string}` `` |

###### Returns

`Promise`\<[`KeyRotationResult`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#keyrotationresult)\>

##### updateKeyPermissions()

```ts
updateKeyPermissions(
   keyId: string, 
   permissions: Permission[], 
updatedBy: `0x${string}`): Promise<void>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/key-manager.ts:364](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/key-manager.ts#L364)

Update key permissions

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `keyId` | `string` |
| `permissions` | [`Permission`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#permission)[] |
| `updatedBy` | `` `0x${string}` `` |

###### Returns

`Promise`\<`void`\>

##### updateKeyRateLimit()

```ts
updateKeyRateLimit(
   keyId: string, 
   rateLimit: RateLimit, 
updatedBy: `0x${string}`): Promise<void>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/key-manager.ts:341](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/key-manager.ts#L341)

Update key rate limit

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `keyId` | `string` |
| `rateLimit` | [`RateLimit`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#ratelimit-4) |
| `updatedBy` | `` `0x${string}` `` |

###### Returns

`Promise`\<`void`\>

##### updateKeyTier()

```ts
updateKeyTier(
   keyId: string, 
   tier: AccessTierName, 
updatedBy: `0x${string}`): Promise<void>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/key-manager.ts:387](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/key-manager.ts#L387)

Update key tier

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `keyId` | `string` |
| `tier` | [`AccessTierName`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#accesstiername-1) |
| `updatedBy` | `` `0x${string}` `` |

###### Returns

`Promise`\<`void`\>

##### validateKey()

```ts
validateKey(key: string): Promise<KeyValidationResult>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/key-manager.ts:156](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/key-manager.ts#L156)

Validate an API key

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `key` | `string` |

###### Returns

`Promise`\<[`KeyValidationResult`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#keyvalidationresult)\>

## Variables

### keyManager

```ts
const keyManager: KeyManager;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/key-manager.ts:534](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/key-manager.ts#L534)

Default key manager instance
