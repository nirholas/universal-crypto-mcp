[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/modules/tool-marketplace/access/lists

# defi/protocols/src/modules/tool-marketplace/access/lists

## Classes

### AccessListManager

Defined in: [defi/protocols/src/modules/tool-marketplace/access/lists.ts:45](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/lists.ts#L45)

Access List Manager

#### Constructors

##### Constructor

```ts
new AccessListManager(storage: AccessStorageAdapter): AccessListManager;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/lists.ts:48](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/lists.ts#L48)

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `storage` | [`AccessStorageAdapter`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#accessstorageadapter) | `defaultStorage` |

###### Returns

[`AccessListManager`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/lists.md#accesslistmanager)

#### Methods

##### addToAllowlist()

```ts
addToAllowlist(
   toolId: string, 
   type: ListEntryType, 
   value: string, 
   createdBy: `0x${string}`, 
   options?: {
  customRateLimit?: RateLimit;
  expiresAt?: number;
  permissions?: Permission[];
  reason?: string;
}): Promise<AllowlistEntry>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/lists.ts:103](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/lists.ts#L103)

Add an address/IP to the allowlist

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |
| `type` | [`ListEntryType`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#listentrytype-1) |
| `value` | `string` |
| `createdBy` | `` `0x${string}` `` |
| `options?` | \{ `customRateLimit?`: [`RateLimit`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#ratelimit-4); `expiresAt?`: `number`; `permissions?`: [`Permission`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#permission)[]; `reason?`: `string`; \} |
| `options.customRateLimit?` | [`RateLimit`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#ratelimit-4) |
| `options.expiresAt?` | `number` |
| `options.permissions?` | [`Permission`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#permission)[] |
| `options.reason?` | `string` |

###### Returns

`Promise`\<[`AllowlistEntry`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#allowlistentry)\>

##### addToBlocklist()

```ts
addToBlocklist(
   toolId: string, 
   type: ListEntryType, 
   value: string, 
   createdBy: `0x${string}`, 
   options?: {
  expiresAt?: number;
  reason?: string;
  severity?: "low" | "medium" | "high" | "critical";
  strikes?: number;
}): Promise<BlocklistEntry>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/lists.ts:206](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/lists.ts#L206)

Add an address/IP to the blocklist

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |
| `type` | [`ListEntryType`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#listentrytype-1) |
| `value` | `string` |
| `createdBy` | `` `0x${string}` `` |
| `options?` | \{ `expiresAt?`: `number`; `reason?`: `string`; `severity?`: `"low"` \| `"medium"` \| `"high"` \| `"critical"`; `strikes?`: `number`; \} |
| `options.expiresAt?` | `number` |
| `options.reason?` | `string` |
| `options.severity?` | `"low"` \| `"medium"` \| `"high"` \| `"critical"` |
| `options.strikes?` | `number` |

###### Returns

`Promise`\<[`BlocklistEntry`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#blocklistentry)\>

##### checkAccess()

```ts
checkAccess(toolId: string, options: {
  address?: `0x${string}`;
  countryCode?: string;
  ip?: string;
}): Promise<{
  allowed: boolean;
  allowlistEntry?: AllowlistEntry;
  blocklistEntry?: BlocklistEntry;
  reason?: string;
}>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/lists.ts:378](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/lists.ts#L378)

Comprehensive access check

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |
| `options` | \{ `address?`: `` `0x${string}` ``; `countryCode?`: `string`; `ip?`: `string`; \} |
| `options.address?` | `` `0x${string}` `` |
| `options.countryCode?` | `string` |
| `options.ip?` | `string` |

###### Returns

`Promise`\<\{
  `allowed`: `boolean`;
  `allowlistEntry?`: [`AllowlistEntry`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#allowlistentry);
  `blocklistEntry?`: [`BlocklistEntry`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#blocklistentry);
  `reason?`: `string`;
\}\>

##### getAllowlist()

```ts
getAllowlist(toolId: string): Promise<AllowlistEntry[]>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/lists.ts:149](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/lists.ts#L149)

Get allowlist for a tool

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |

###### Returns

`Promise`\<[`AllowlistEntry`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#allowlistentry)[]\>

##### getBlocklist()

```ts
getBlocklist(toolId: string): Promise<BlocklistEntry[]>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/lists.ts:252](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/lists.ts#L252)

Get blocklist for a tool

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

Defined in: [defi/protocols/src/modules/tool-marketplace/access/lists.ts:340](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/lists.ts#L340)

Get geographic restriction for a tool

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |

###### Returns

`Promise`\<
  \| [`GeoRestriction`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#georestriction)
  \| `null`\>

##### isAllowlisted()

```ts
isAllowlisted(toolId: string, address: `0x${string}`): Promise<{
  allowed: boolean;
  entry?: AllowlistEntry;
}>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/lists.ts:160](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/lists.ts#L160)

Check if an address is allowlisted

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |
| `address` | `` `0x${string}` `` |

###### Returns

`Promise`\<\{
  `allowed`: `boolean`;
  `entry?`: [`AllowlistEntry`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#allowlistentry);
\}\>

##### isBlocklisted()

```ts
isBlocklisted(toolId: string, address: `0x${string}`): Promise<{
  blocked: boolean;
  entry?: BlocklistEntry;
}>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/lists.ts:263](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/lists.ts#L263)

Check if an address is blocklisted

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |
| `address` | `` `0x${string}` `` |

###### Returns

`Promise`\<\{
  `blocked`: `boolean`;
  `entry?`: [`BlocklistEntry`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#blocklistentry);
\}\>

##### isCountryAllowed()

```ts
isCountryAllowed(toolId: string, countryCode: string): Promise<boolean>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/lists.ts:355](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/lists.ts#L355)

Check if a country is allowed

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |
| `countryCode` | `string` |

###### Returns

`Promise`\<`boolean`\>

##### isIpAllowlisted()

```ts
isIpAllowlisted(toolId: string, ip: string): Promise<{
  allowed: boolean;
  entry?: AllowlistEntry;
}>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/lists.ts:177](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/lists.ts#L177)

Check if an IP is allowlisted

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |
| `ip` | `string` |

###### Returns

`Promise`\<\{
  `allowed`: `boolean`;
  `entry?`: [`AllowlistEntry`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#allowlistentry);
\}\>

##### isIpBlocklisted()

```ts
isIpBlocklisted(toolId: string, ip: string): Promise<{
  blocked: boolean;
  entry?: BlocklistEntry;
}>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/lists.ts:280](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/lists.ts#L280)

Check if an IP is blocklisted

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |
| `ip` | `string` |

###### Returns

`Promise`\<\{
  `blocked`: `boolean`;
  `entry?`: [`BlocklistEntry`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#blocklistentry);
\}\>

##### removeFromAllowlist()

```ts
removeFromAllowlist(entryId: string): Promise<void>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/lists.ts:141](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/lists.ts#L141)

Remove from allowlist

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `entryId` | `string` |

###### Returns

`Promise`\<`void`\>

##### removeFromBlocklist()

```ts
removeFromBlocklist(entryId: string): Promise<void>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/lists.ts:244](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/lists.ts#L244)

Remove from blocklist

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `entryId` | `string` |

###### Returns

`Promise`\<`void`\>

##### removeGeoRestriction()

```ts
removeGeoRestriction(toolId: string): Promise<void>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/lists.ts:347](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/lists.ts#L347)

Remove geographic restriction

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |

###### Returns

`Promise`\<`void`\>

##### setGeoRestriction()

```ts
setGeoRestriction(
   toolId: string, 
   mode: "block" | "allow", 
   countries: string[], 
createdBy: `0x${string}`): Promise<GeoRestriction>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/lists.ts:309](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/lists.ts#L309)

Set geographic restriction for a tool

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |
| `mode` | `"block"` \| `"allow"` |
| `countries` | `string`[] |
| `createdBy` | `` `0x${string}` `` |

###### Returns

`Promise`\<[`GeoRestriction`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#georestriction)\>

***

### StrikeManager

Defined in: [defi/protocols/src/modules/tool-marketplace/access/lists.ts:459](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/lists.ts#L459)

Strike system for automatic blocking

#### Constructors

##### Constructor

```ts
new StrikeManager(storage: AccessStorageAdapter): StrikeManager;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/lists.ts:463](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/lists.ts#L463)

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `storage` | [`AccessStorageAdapter`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#accessstorageadapter) | `defaultStorage` |

###### Returns

[`StrikeManager`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/lists.md#strikemanager)

#### Methods

##### clearStrikes()

```ts
clearStrikes(toolId: string, address: `0x${string}`): void;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/lists.ts:534](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/lists.ts#L534)

Clear strikes for an address

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |
| `address` | `` `0x${string}` `` |

###### Returns

`void`

##### getStrikeCount()

```ts
getStrikeCount(toolId: string, address: `0x${string}`): number;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/lists.ts:526](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/lists.ts#L526)

Get strike count for an address

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |
| `address` | `` `0x${string}` `` |

###### Returns

`number`

##### recordStrike()

```ts
recordStrike(
   toolId: string, 
   address: `0x${string}`, 
   reason: string, 
   createdBy: `0x${string}`): Promise<{
  blocked: boolean;
  blockEntry?: BlocklistEntry;
  newStrikeCount: number;
}>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/lists.ts:470](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/lists.ts#L470)

Record a strike against an address

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |
| `address` | `` `0x${string}` `` |
| `reason` | `string` |
| `createdBy` | `` `0x${string}` `` |

###### Returns

`Promise`\<\{
  `blocked`: `boolean`;
  `blockEntry?`: [`BlocklistEntry`](/docs/api/defi/protocols/src/modules/tool-marketplace/access/types.md#blocklistentry);
  `newStrikeCount`: `number`;
\}\>

## Variables

### accessListManager

```ts
const accessListManager: AccessListManager;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/lists.ts:454](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/lists.ts#L454)

Default access list manager instance

***

### strikeManager

```ts
const strikeManager: StrikeManager;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/access/lists.ts:543](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/access/lists.ts#L543)

Default strike manager instance
