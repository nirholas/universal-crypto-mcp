[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/modules/tool-marketplace/reputation/rating

# defi/protocols/src/modules/tool-marketplace/reputation/rating

## Classes

### RatingService

Defined in: [defi/protocols/src/modules/tool-marketplace/reputation/rating.ts:74](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/rating.ts#L74)

Rating Service
Manages tool ratings with weighting, decay, and anti-manipulation measures

#### Constructors

##### Constructor

```ts
new RatingService(config: Partial<RatingServiceConfig>): RatingService;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/reputation/rating.ts:77](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/rating.ts#L77)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `config` | `Partial`\<[`RatingServiceConfig`](/docs/api/defi/protocols/src/modules/tool-marketplace/reputation/rating.md#ratingserviceconfig)\> |

###### Returns

[`RatingService`](/docs/api/defi/protocols/src/modules/tool-marketplace/reputation/rating.md#ratingservice)

#### Methods

##### canUserRate()

```ts
canUserRate(userAddress: `0x${string}`, toolId: string): {
  canRate: boolean;
  reason?: string;
  waitTime?: number;
};
```

Defined in: [defi/protocols/src/modules/tool-marketplace/reputation/rating.ts:365](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/rating.ts#L365)

Check if user can rate a tool

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `userAddress` | `` `0x${string}` `` |
| `toolId` | `string` |

###### Returns

```ts
{
  canRate: boolean;
  reason?: string;
  waitTime?: number;
}
```

| Name | Type | Defined in |
| :------ | :------ | :------ |
| `canRate` | `boolean` | [defi/protocols/src/modules/tool-marketplace/reputation/rating.ts:366](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/rating.ts#L366) |
| `reason?` | `string` | [defi/protocols/src/modules/tool-marketplace/reputation/rating.ts:367](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/rating.ts#L367) |
| `waitTime?` | `number` | [defi/protocols/src/modules/tool-marketplace/reputation/rating.ts:368](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/rating.ts#L368) |

##### deleteRating()

```ts
deleteRating(ratingId: string, userAddress: `0x${string}`): Promise<void>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/reputation/rating.ts:297](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/rating.ts#L297)

Delete a rating

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `ratingId` | `string` |
| `userAddress` | `` `0x${string}` `` |

###### Returns

`Promise`\<`void`\>

##### getPendingReports()

```ts
getPendingReports(): RatingReport[];
```

Defined in: [defi/protocols/src/modules/tool-marketplace/reputation/rating.ts:442](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/rating.ts#L442)

Get reports pending review

###### Returns

[`RatingReport`](/docs/api/defi/protocols/src/modules/tool-marketplace/reputation/types.md#ratingreport)[]

##### getRating()

```ts
getRating(ratingId: string): 
  | Rating
  | null;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/reputation/rating.ts:183](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/rating.ts#L183)

Get rating by ID

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `ratingId` | `string` |

###### Returns

  \| [`Rating`](/docs/api/defi/protocols/src/modules/tool-marketplace/reputation/types.md#rating)
  \| `null`

##### getRatingSummary()

```ts
getRatingSummary(toolId: string): RatingSummary;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/reputation/rating.ts:201](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/rating.ts#L201)

Get rating summary for a tool

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |

###### Returns

[`RatingSummary`](/docs/api/defi/protocols/src/modules/tool-marketplace/reputation/types.md#ratingsummary)

##### getRecentRatings()

```ts
getRecentRatings(limit: number): Rating[];
```

Defined in: [defi/protocols/src/modules/tool-marketplace/reputation/rating.ts:432](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/rating.ts#L432)

Get recent ratings across all tools

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `limit` | `number` | `20` |

###### Returns

[`Rating`](/docs/api/defi/protocols/src/modules/tool-marketplace/reputation/types.md#rating)[]

##### getToolRatings()

```ts
getToolRatings(toolId: string): Rating[];
```

Defined in: [defi/protocols/src/modules/tool-marketplace/reputation/rating.ts:190](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/rating.ts#L190)

Get all ratings for a tool

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |

###### Returns

[`Rating`](/docs/api/defi/protocols/src/modules/tool-marketplace/reputation/types.md#rating)[]

##### getTopRatedTools()

```ts
getTopRatedTools(limit: number): {
  averageRating: number;
  toolId: string;
  totalRatings: number;
}[];
```

Defined in: [defi/protocols/src/modules/tool-marketplace/reputation/rating.ts:401](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/rating.ts#L401)

Get top rated tools

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `limit` | `number` | `10` |

###### Returns

\{
  `averageRating`: `number`;
  `toolId`: `string`;
  `totalRatings`: `number`;
\}[]

##### getUserRatingForTool()

```ts
getUserRatingForTool(userAddress: `0x${string}`, toolId: string): 
  | Rating
  | null;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/reputation/rating.ts:248](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/rating.ts#L248)

Get user's rating for a tool

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `userAddress` | `` `0x${string}` `` |
| `toolId` | `string` |

###### Returns

  \| [`Rating`](/docs/api/defi/protocols/src/modules/tool-marketplace/reputation/types.md#rating)
  \| `null`

##### recordUsage()

```ts
recordUsage(userAddress: `0x${string}`, toolId: string): void;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/reputation/rating.ts:387](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/rating.ts#L387)

Record tool usage (for weighting)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `userAddress` | `` `0x${string}` `` |
| `toolId` | `string` |

###### Returns

`void`

##### reportRating()

```ts
reportRating(
   ratingId: string, 
   reporterAddress: `0x${string}`, 
   reason: "other" | "spam" | "fake" | "inappropriate" | "manipulation", 
details?: string): Promise<RatingReport>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/reputation/rating.ts:333](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/rating.ts#L333)

Report a rating for abuse

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `ratingId` | `string` |
| `reporterAddress` | `` `0x${string}` `` |
| `reason` | `"other"` \| `"spam"` \| `"fake"` \| `"inappropriate"` \| `"manipulation"` |
| `details?` | `string` |

###### Returns

`Promise`\<[`RatingReport`](/docs/api/defi/protocols/src/modules/tool-marketplace/reputation/types.md#ratingreport)\>

##### reviewReport()

```ts
reviewReport(reportId: string, status: "dismissed" | "upheld"): Promise<RatingReport>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/reputation/rating.ts:451](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/rating.ts#L451)

Review a report

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `reportId` | `string` |
| `status` | `"dismissed"` \| `"upheld"` |

###### Returns

`Promise`\<[`RatingReport`](/docs/api/defi/protocols/src/modules/tool-marketplace/reputation/types.md#ratingreport)\>

##### submitRating()

```ts
submitRating(
   toolId: string, 
   userAddress: `0x${string}`, 
   value: RatingValue, 
   review?: string, 
usageTxHash?: string): Promise<Rating>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/reputation/rating.ts:84](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/rating.ts#L84)

Submit a rating for a tool

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |
| `userAddress` | `` `0x${string}` `` |
| `value` | [`RatingValue`](/docs/api/defi/protocols/src/modules/tool-marketplace/reputation/types.md#ratingvalue-1) |
| `review?` | `string` |
| `usageTxHash?` | `string` |

###### Returns

`Promise`\<[`Rating`](/docs/api/defi/protocols/src/modules/tool-marketplace/reputation/types.md#rating)\>

##### updateRating()

```ts
updateRating(
   ratingId: string, 
   userAddress: `0x${string}`, 
   value: RatingValue, 
review?: string): Promise<Rating>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/reputation/rating.ts:264](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/rating.ts#L264)

Update a rating

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `ratingId` | `string` |
| `userAddress` | `` `0x${string}` `` |
| `value` | [`RatingValue`](/docs/api/defi/protocols/src/modules/tool-marketplace/reputation/types.md#ratingvalue-1) |
| `review?` | `string` |

###### Returns

`Promise`\<[`Rating`](/docs/api/defi/protocols/src/modules/tool-marketplace/reputation/types.md#rating)\>

## Interfaces

### RatingServiceConfig

Defined in: [defi/protocols/src/modules/tool-marketplace/reputation/rating.ts:21](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/rating.ts#L21)

Configuration for the rating service

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="decayhalflifedays"></a> `decayHalfLifeDays` | `number` | Rating decay half-life in days | [defi/protocols/src/modules/tool-marketplace/reputation/rating.ts:25](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/rating.ts#L25) |
| <a id="highvolumemultiplier"></a> `highVolumeMultiplier` | `number` | Weight multiplier for high-volume users | [defi/protocols/src/modules/tool-marketplace/reputation/rating.ts:31](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/rating.ts#L31) |
| <a id="highvolumethreshold"></a> `highVolumeThreshold` | `number` | Minimum usage count to be considered high-volume user | [defi/protocols/src/modules/tool-marketplace/reputation/rating.ts:27](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/rating.ts#L27) |
| <a id="ratelimitperiod"></a> `rateLimitPeriod` | `number` | Minimum time between ratings for same tool (ms) - default 7 days | [defi/protocols/src/modules/tool-marketplace/reputation/rating.ts:23](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/rating.ts#L23) |
| <a id="verifiedmultiplier"></a> `verifiedMultiplier` | `number` | Weight multiplier for verified ratings | [defi/protocols/src/modules/tool-marketplace/reputation/rating.ts:29](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/rating.ts#L29) |

## Variables

### ratingService

```ts
const ratingService: RatingService;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/reputation/rating.ts:483](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/rating.ts#L483)

Singleton instance
