[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/modules/tool-marketplace/reputation/types

# defi/protocols/src/modules/tool-marketplace/reputation/types

## Interfaces

### LeaderboardEntry

Defined in: [defi/protocols/src/modules/tool-marketplace/reputation/types.ts:222](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/types.ts#L222)

Leaderboard entry

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="averagerating"></a> `averageRating` | `number` | Average rating | [defi/protocols/src/modules/tool-marketplace/reputation/types.ts:238](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/types.ts#L238) |
| <a id="badges"></a> `badges` | [`ReputationBadge`](/docs/api/defi/protocols/src/modules/tool-marketplace/reputation/types.md#reputationbadge)[] | Badges | [defi/protocols/src/modules/tool-marketplace/reputation/types.ts:234](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/types.ts#L234) |
| <a id="displayname"></a> `displayName` | `string` | Tool display name | [defi/protocols/src/modules/tool-marketplace/reputation/types.ts:228](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/types.ts#L228) |
| <a id="rank"></a> `rank` | `number` | Rank position | [defi/protocols/src/modules/tool-marketplace/reputation/types.ts:224](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/types.ts#L224) |
| <a id="score"></a> `score` | `number` | Reputation score | [defi/protocols/src/modules/tool-marketplace/reputation/types.ts:230](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/types.ts#L230) |
| <a id="tier"></a> `tier` | [`TrustTier`](/docs/api/defi/protocols/src/modules/tool-marketplace/reputation/types.md#trusttier) | Trust tier | [defi/protocols/src/modules/tool-marketplace/reputation/types.ts:232](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/types.ts#L232) |
| <a id="toolid"></a> `toolId` | `string` | Tool ID | [defi/protocols/src/modules/tool-marketplace/reputation/types.ts:226](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/types.ts#L226) |
| <a id="totalratings"></a> `totalRatings` | `number` | Total ratings | [defi/protocols/src/modules/tool-marketplace/reputation/types.ts:236](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/types.ts#L236) |

***

### Rating

Defined in: [defi/protocols/src/modules/tool-marketplace/reputation/types.ts:23](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/types.ts#L23)

Individual rating

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="id"></a> `id` | `string` | Unique rating ID | [defi/protocols/src/modules/tool-marketplace/reputation/types.ts:25](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/types.ts#L25) |
| <a id="review"></a> `review?` | `string` | Optional review text | [defi/protocols/src/modules/tool-marketplace/reputation/types.ts:33](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/types.ts#L33) |
| <a id="timestamp"></a> `timestamp` | `number` | Timestamp of rating | [defi/protocols/src/modules/tool-marketplace/reputation/types.ts:35](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/types.ts#L35) |
| <a id="toolid-1"></a> `toolId` | `string` | Tool being rated | [defi/protocols/src/modules/tool-marketplace/reputation/types.ts:27](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/types.ts#L27) |
| <a id="usagetxhash"></a> `usageTxHash?` | `string` | Transaction hash proving usage | [defi/protocols/src/modules/tool-marketplace/reputation/types.ts:41](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/types.ts#L41) |
| <a id="useraddress"></a> `userAddress` | `` `0x${string}` `` | User who submitted the rating | [defi/protocols/src/modules/tool-marketplace/reputation/types.ts:29](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/types.ts#L29) |
| <a id="value"></a> `value` | [`RatingValue`](/docs/api/defi/protocols/src/modules/tool-marketplace/reputation/types.md#ratingvalue-1) | Rating value (1-5) | [defi/protocols/src/modules/tool-marketplace/reputation/types.ts:31](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/types.ts#L31) |
| <a id="verified"></a> `verified` | `boolean` | Whether rating is verified (user actually used the tool) | [defi/protocols/src/modules/tool-marketplace/reputation/types.ts:39](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/types.ts#L39) |
| <a id="weight"></a> `weight` | `number` | Weight based on user's usage volume | [defi/protocols/src/modules/tool-marketplace/reputation/types.ts:37](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/types.ts#L37) |

***

### RatingRateLimit

Defined in: [defi/protocols/src/modules/tool-marketplace/reputation/types.ts:148](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/types.ts#L148)

Rating rate limit record

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="canrateagainat"></a> `canRateAgainAt` | `number` | Can rate again after | [defi/protocols/src/modules/tool-marketplace/reputation/types.ts:156](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/types.ts#L156) |
| <a id="lastratingat"></a> `lastRatingAt` | `number` | Last rating timestamp | [defi/protocols/src/modules/tool-marketplace/reputation/types.ts:154](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/types.ts#L154) |
| <a id="toolid-2"></a> `toolId` | `string` | Tool ID | [defi/protocols/src/modules/tool-marketplace/reputation/types.ts:152](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/types.ts#L152) |
| <a id="useraddress-1"></a> `userAddress` | `` `0x${string}` `` | User address | [defi/protocols/src/modules/tool-marketplace/reputation/types.ts:150](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/types.ts#L150) |

***

### RatingReport

Defined in: [defi/protocols/src/modules/tool-marketplace/reputation/types.ts:162](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/types.ts#L162)

Rating report (for abuse detection)

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="details"></a> `details?` | `string` | Additional details | [defi/protocols/src/modules/tool-marketplace/reputation/types.ts:172](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/types.ts#L172) |
| <a id="id-1"></a> `id` | `string` | Report ID | [defi/protocols/src/modules/tool-marketplace/reputation/types.ts:164](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/types.ts#L164) |
| <a id="ratingid-1"></a> `ratingId` | `string` | Rating being reported | [defi/protocols/src/modules/tool-marketplace/reputation/types.ts:166](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/types.ts#L166) |
| <a id="reason"></a> `reason` | `"other"` \| `"spam"` \| `"fake"` \| `"inappropriate"` \| `"manipulation"` | Reason for report | [defi/protocols/src/modules/tool-marketplace/reputation/types.ts:170](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/types.ts#L170) |
| <a id="reporteraddress"></a> `reporterAddress` | `` `0x${string}` `` | User reporting | [defi/protocols/src/modules/tool-marketplace/reputation/types.ts:168](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/types.ts#L168) |
| <a id="status"></a> `status` | `"pending"` \| `"dismissed"` \| `"upheld"` \| `"reviewed"` | Status | [defi/protocols/src/modules/tool-marketplace/reputation/types.ts:176](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/types.ts#L176) |
| <a id="timestamp-1"></a> `timestamp` | `number` | Timestamp | [defi/protocols/src/modules/tool-marketplace/reputation/types.ts:174](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/types.ts#L174) |

***

### RatingSummary

Defined in: [defi/protocols/src/modules/tool-marketplace/reputation/types.ts:47](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/types.ts#L47)

Rating summary for a tool

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="averagerating-1"></a> `averageRating` | `number` | Average rating (1-5) | [defi/protocols/src/modules/tool-marketplace/reputation/types.ts:51](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/types.ts#L51) |
| <a id="distribution"></a> `distribution` | \{ `1`: `number`; `2`: `number`; `3`: `number`; `4`: `number`; `5`: `number`; \} | Distribution of ratings | [defi/protocols/src/modules/tool-marketplace/reputation/types.ts:59](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/types.ts#L59) |
| `distribution.1` | `number` | - | [defi/protocols/src/modules/tool-marketplace/reputation/types.ts:60](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/types.ts#L60) |
| `distribution.2` | `number` | - | [defi/protocols/src/modules/tool-marketplace/reputation/types.ts:61](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/types.ts#L61) |
| `distribution.3` | `number` | - | [defi/protocols/src/modules/tool-marketplace/reputation/types.ts:62](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/types.ts#L62) |
| `distribution.4` | `number` | - | [defi/protocols/src/modules/tool-marketplace/reputation/types.ts:63](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/types.ts#L63) |
| `distribution.5` | `number` | - | [defi/protocols/src/modules/tool-marketplace/reputation/types.ts:64](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/types.ts#L64) |
| <a id="lastratingat-1"></a> `lastRatingAt?` | `number` | Last rating timestamp | [defi/protocols/src/modules/tool-marketplace/reputation/types.ts:67](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/types.ts#L67) |
| <a id="toolid-3"></a> `toolId` | `string` | Tool ID | [defi/protocols/src/modules/tool-marketplace/reputation/types.ts:49](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/types.ts#L49) |
| <a id="totalratings-1"></a> `totalRatings` | `number` | Total number of ratings | [defi/protocols/src/modules/tool-marketplace/reputation/types.ts:55](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/types.ts#L55) |
| <a id="verifiedratings"></a> `verifiedRatings` | `number` | Number of verified ratings | [defi/protocols/src/modules/tool-marketplace/reputation/types.ts:57](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/types.ts#L57) |
| <a id="weightedaveragerating"></a> `weightedAverageRating` | `number` | Weighted average rating | [defi/protocols/src/modules/tool-marketplace/reputation/types.ts:53](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/types.ts#L53) |

***

### ReputationBadge

Defined in: [defi/protocols/src/modules/tool-marketplace/reputation/types.ts:130](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/types.ts#L130)

Reputation badge

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="earnedat"></a> `earnedAt` | `number` | When badge was earned | [defi/protocols/src/modules/tool-marketplace/reputation/types.ts:138](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/types.ts#L138) |
| <a id="expiresat"></a> `expiresAt?` | `number` | When badge expires (optional) | [defi/protocols/src/modules/tool-marketplace/reputation/types.ts:140](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/types.ts#L140) |
| <a id="icon"></a> `icon` | `string` | Badge icon | [defi/protocols/src/modules/tool-marketplace/reputation/types.ts:136](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/types.ts#L136) |
| <a id="label"></a> `label` | `string` | Display label | [defi/protocols/src/modules/tool-marketplace/reputation/types.ts:134](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/types.ts#L134) |
| <a id="metadata"></a> `metadata?` | `Record`\<`string`, `unknown`\> | Additional metadata | [defi/protocols/src/modules/tool-marketplace/reputation/types.ts:142](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/types.ts#L142) |
| <a id="type"></a> `type` | [`BadgeType`](/docs/api/defi/protocols/src/modules/tool-marketplace/reputation/types.md#badgetype) | Badge type | [defi/protocols/src/modules/tool-marketplace/reputation/types.ts:132](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/types.ts#L132) |

***

### ReputationHistoryEntry

Defined in: [defi/protocols/src/modules/tool-marketplace/reputation/types.ts:208](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/types.ts#L208)

Reputation history entry

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="event"></a> `event?` | `string` | Event that caused change | [defi/protocols/src/modules/tool-marketplace/reputation/types.ts:216](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/types.ts#L216) |
| <a id="score-1"></a> `score` | `number` | Score at this point | [defi/protocols/src/modules/tool-marketplace/reputation/types.ts:212](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/types.ts#L212) |
| <a id="tier-1"></a> `tier` | [`TrustTier`](/docs/api/defi/protocols/src/modules/tool-marketplace/reputation/types.md#trusttier) | Tier at this point | [defi/protocols/src/modules/tool-marketplace/reputation/types.ts:214](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/types.ts#L214) |
| <a id="timestamp-2"></a> `timestamp` | `number` | Timestamp | [defi/protocols/src/modules/tool-marketplace/reputation/types.ts:210](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/types.ts#L210) |

***

### ReputationScore

Defined in: [defi/protocols/src/modules/tool-marketplace/reputation/types.ts:94](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/types.ts#L94)

Full reputation score

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="badges-1"></a> `badges` | [`ReputationBadge`](/docs/api/defi/protocols/src/modules/tool-marketplace/reputation/types.md#reputationbadge)[] | Earned badges | [defi/protocols/src/modules/tool-marketplace/reputation/types.ts:104](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/types.ts#L104) |
| <a id="breakdown"></a> `breakdown` | [`ReputationScoreBreakdown`](/docs/api/defi/protocols/src/modules/tool-marketplace/reputation/types.md#reputationscorebreakdown-1) | Score breakdown | [defi/protocols/src/modules/tool-marketplace/reputation/types.ts:102](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/types.ts#L102) |
| <a id="calculatedat"></a> `calculatedAt` | `number` | Last calculated | [defi/protocols/src/modules/tool-marketplace/reputation/types.ts:106](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/types.ts#L106) |
| <a id="change"></a> `change` | `number` | Score change from last calculation | [defi/protocols/src/modules/tool-marketplace/reputation/types.ts:108](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/types.ts#L108) |
| <a id="score-2"></a> `score` | `number` | Composite score (0-100) | [defi/protocols/src/modules/tool-marketplace/reputation/types.ts:98](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/types.ts#L98) |
| <a id="tier-2"></a> `tier` | [`TrustTier`](/docs/api/defi/protocols/src/modules/tool-marketplace/reputation/types.md#trusttier) | Trust tier | [defi/protocols/src/modules/tool-marketplace/reputation/types.ts:100](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/types.ts#L100) |
| <a id="toolid-4"></a> `toolId` | `string` | Tool ID | [defi/protocols/src/modules/tool-marketplace/reputation/types.ts:96](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/types.ts#L96) |
| <a id="trend"></a> `trend` | `"stable"` \| `"up"` \| `"down"` | Trend direction | [defi/protocols/src/modules/tool-marketplace/reputation/types.ts:110](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/types.ts#L110) |

***

### ReputationScoreBreakdown

Defined in: [defi/protocols/src/modules/tool-marketplace/reputation/types.ts:73](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/types.ts#L73)

Reputation score breakdown

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="agescore"></a> `ageScore` | `number` | Age score component (0-100) | [defi/protocols/src/modules/tool-marketplace/reputation/types.ts:81](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/types.ts#L81) |
| <a id="ratingscore"></a> `ratingScore` | `number` | Rating score component (0-100) | [defi/protocols/src/modules/tool-marketplace/reputation/types.ts:77](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/types.ts#L77) |
| <a id="uptimescore"></a> `uptimeScore` | `number` | Uptime score component (0-100) | [defi/protocols/src/modules/tool-marketplace/reputation/types.ts:75](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/types.ts#L75) |
| <a id="volumescore"></a> `volumeScore` | `number` | Volume score component (0-100) | [defi/protocols/src/modules/tool-marketplace/reputation/types.ts:79](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/types.ts#L79) |
| <a id="weights"></a> `weights` | \{ `age`: `number`; `rating`: `number`; `uptime`: `number`; `volume`: `number`; \} | Weights used | [defi/protocols/src/modules/tool-marketplace/reputation/types.ts:83](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/types.ts#L83) |
| `weights.age` | `number` | - | [defi/protocols/src/modules/tool-marketplace/reputation/types.ts:87](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/types.ts#L87) |
| `weights.rating` | `number` | - | [defi/protocols/src/modules/tool-marketplace/reputation/types.ts:85](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/types.ts#L85) |
| `weights.uptime` | `number` | - | [defi/protocols/src/modules/tool-marketplace/reputation/types.ts:84](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/types.ts#L84) |
| `weights.volume` | `number` | - | [defi/protocols/src/modules/tool-marketplace/reputation/types.ts:86](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/types.ts#L86) |

***

### ToolReport

Defined in: [defi/protocols/src/modules/tool-marketplace/reputation/types.ts:182](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/types.ts#L182)

Tool report (for malicious tools)

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="category"></a> `category` | `"other"` \| `"malicious"` \| `"scam"` \| `"broken"` \| `"misleading"` \| `"privacy"` | Report category | [defi/protocols/src/modules/tool-marketplace/reputation/types.ts:190](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/types.ts#L190) |
| <a id="description"></a> `description` | `string` | Description | [defi/protocols/src/modules/tool-marketplace/reputation/types.ts:194](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/types.ts#L194) |
| <a id="evidence"></a> `evidence?` | `string`[] | Evidence (URLs, screenshots, etc.) | [defi/protocols/src/modules/tool-marketplace/reputation/types.ts:196](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/types.ts#L196) |
| <a id="id-2"></a> `id` | `string` | Report ID | [defi/protocols/src/modules/tool-marketplace/reputation/types.ts:184](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/types.ts#L184) |
| <a id="reporteraddress-1"></a> `reporterAddress` | `` `0x${string}` `` | User reporting | [defi/protocols/src/modules/tool-marketplace/reputation/types.ts:188](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/types.ts#L188) |
| <a id="resolution"></a> `resolution?` | `string` | Resolution notes | [defi/protocols/src/modules/tool-marketplace/reputation/types.ts:202](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/types.ts#L202) |
| <a id="severity"></a> `severity` | `"low"` \| `"medium"` \| `"high"` \| `"critical"` | Severity | [defi/protocols/src/modules/tool-marketplace/reputation/types.ts:192](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/types.ts#L192) |
| <a id="status-1"></a> `status` | `"pending"` \| `"confirmed"` \| `"dismissed"` \| `"investigating"` | Status | [defi/protocols/src/modules/tool-marketplace/reputation/types.ts:200](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/types.ts#L200) |
| <a id="timestamp-3"></a> `timestamp` | `number` | Timestamp | [defi/protocols/src/modules/tool-marketplace/reputation/types.ts:198](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/types.ts#L198) |
| <a id="toolid-5"></a> `toolId` | `string` | Tool being reported | [defi/protocols/src/modules/tool-marketplace/reputation/types.ts:186](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/types.ts#L186) |

## Type Aliases

### BadgeType

```ts
type BadgeType = 
  | "verified"
  | "high_volume"
  | "top_rated"
  | "new"
  | "trending"
  | "premium"
  | "security_audited"
  | "fast_response"
  | "reliable";
```

Defined in: [defi/protocols/src/modules/tool-marketplace/reputation/types.ts:116](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/types.ts#L116)

Reputation badge types

***

### RatingValue

```ts
type RatingValue = 1 | 2 | 3 | 4 | 5;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/reputation/types.ts:18](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/types.ts#L18)

Rating value (1-5 stars)

***

### TrustTier

```ts
type TrustTier = "bronze" | "silver" | "gold" | "platinum";
```

Defined in: [defi/protocols/src/modules/tool-marketplace/reputation/types.ts:13](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/types.ts#L13)

Trust tier levels
