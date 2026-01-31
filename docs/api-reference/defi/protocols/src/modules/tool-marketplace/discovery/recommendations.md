[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/modules/tool-marketplace/discovery/recommendations

# defi/protocols/src/modules/tool-marketplace/discovery/recommendations

## Classes

### RecommendationEngine

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/recommendations.ts:62](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/recommendations.ts#L62)

Recommendation Engine

#### Constructors

##### Constructor

```ts
new RecommendationEngine(): RecommendationEngine;
```

###### Returns

[`RecommendationEngine`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/recommendations.md#recommendationengine)

#### Methods

##### buildUserProfileFromUsage()

```ts
buildUserProfileFromUsage(address: `0x${string}`): UserProfile;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/recommendations.ts:128](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/recommendations.ts#L128)

Build user profile from usage records

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `address` | `` `0x${string}` `` |

###### Returns

[`UserProfile`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#userprofile)

##### getBecauseYouUsedRecommendations()

```ts
getBecauseYouUsedRecommendations(toolId: string, options: {
  limit?: number;
}): RecommendedTool[];
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/recommendations.ts:555](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/recommendations.ts#L555)

Get "because you used X" recommendations

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |
| `options` | \{ `limit?`: `number`; \} |
| `options.limit?` | `number` |

###### Returns

[`RecommendedTool`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#recommendedtool)[]

##### getCollaborativeRecommendations()

```ts
getCollaborativeRecommendations(toolId: string, options: {
  limit?: number;
  minCoUsage?: number;
}): RecommendedTool[];
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/recommendations.ts:276](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/recommendations.ts#L276)

Get collaborative filtering recommendations for a tool
"Users who used X also used Y"

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |
| `options` | \{ `limit?`: `number`; `minCoUsage?`: `number`; \} |
| `options.limit?` | `number` |
| `options.minCoUsage?` | `number` |

###### Returns

[`RecommendedTool`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#recommendedtool)[]

##### getContentBasedRecommendations()

```ts
getContentBasedRecommendations(toolId: string, options: {
  limit?: number;
  minSimilarity?: number;
}): RecommendedTool[];
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/recommendations.ts:387](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/recommendations.ts#L387)

Get content-based recommendations for a tool

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |
| `options` | \{ `limit?`: `number`; `minSimilarity?`: `number`; \} |
| `options.limit?` | `number` |
| `options.minSimilarity?` | `number` |

###### Returns

[`RecommendedTool`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#recommendedtool)[]

##### getNewUserRecommendations()

```ts
getNewUserRecommendations(options: {
  limit?: number;
}): RecommendedTool[];
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/recommendations.ts:598](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/recommendations.ts#L598)

Get discovery recommendations for new users

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `options` | \{ `limit?`: `number`; \} |
| `options.limit?` | `number` |

###### Returns

[`RecommendedTool`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#recommendedtool)[]

##### getPersonalizedRecommendations()

```ts
getPersonalizedRecommendations(userProfile: UserProfile, options: {
  limit?: number;
}): Promise<RecommendedTool[]>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/recommendations.ts:462](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/recommendations.ts#L462)

Get personalized recommendations for a user

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `userProfile` | [`UserProfile`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#userprofile) |
| `options` | \{ `limit?`: `number`; \} |
| `options.limit?` | `number` |

###### Returns

`Promise`\<[`RecommendedTool`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#recommendedtool)[]\>

##### getSameCategoryRecommendations()

```ts
getSameCategoryRecommendations(category: ToolCategory, options: {
  excludeToolIds?: string[];
  limit?: number;
}): RecommendedTool[];
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/recommendations.ts:430](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/recommendations.ts#L430)

Get same-category recommendations

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `category` | [`ToolCategory`](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#toolcategory) |
| `options` | \{ `excludeToolIds?`: `string`[]; `limit?`: `number`; \} |
| `options.excludeToolIds?` | `string`[] |
| `options.limit?` | `number` |

###### Returns

[`RecommendedTool`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#recommendedtool)[]

##### getUserProfile()

```ts
getUserProfile(address: `0x${string}`): 
  | UserProfile
  | undefined;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/recommendations.ts:642](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/recommendations.ts#L642)

Get user profile

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `address` | `` `0x${string}` `` |

###### Returns

  \| [`UserProfile`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#userprofile)
  \| `undefined`

##### loadTools()

```ts
loadTools(tools: RegisteredTool[]): void;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/recommendations.ts:72](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/recommendations.ts#L72)

Load tools for recommendations

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `tools` | [`RegisteredTool`](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#registeredtool)[] |

###### Returns

`void`

##### loadUsageRecords()

```ts
loadUsageRecords(records: ToolUsageRecord[]): void;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/recommendations.ts:85](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/recommendations.ts#L85)

Load usage records for collaborative filtering

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `records` | [`ToolUsageRecord`](/docs/api/defi/protocols/src/modules/tool-marketplace/types.md#toolusagerecord)[] |

###### Returns

`void`

##### refreshCaches()

```ts
refreshCaches(): void;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/recommendations.ts:649](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/recommendations.ts#L649)

Refresh all caches

###### Returns

`void`

##### updateUserProfile()

```ts
updateUserProfile(address: `0x${string}`, updates: Partial<UserProfile>): UserProfile;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/recommendations.ts:105](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/recommendations.ts#L105)

Update or create user profile

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `address` | `` `0x${string}` `` |
| `updates` | `Partial`\<[`UserProfile`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#userprofile)\> |

###### Returns

[`UserProfile`](/docs/api/defi/protocols/src/modules/tool-marketplace/discovery/types.md#userprofile)

## Variables

### recommendationEngine

```ts
const recommendationEngine: RecommendationEngine;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/discovery/recommendations.ts:660](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/discovery/recommendations.ts#L660)

Singleton instance
