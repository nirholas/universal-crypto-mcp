[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/modules/tool-marketplace/reputation/score

# defi/protocols/src/modules/tool-marketplace/reputation/score

## Classes

### ReputationScorer

Defined in: [defi/protocols/src/modules/tool-marketplace/reputation/score.ts:132](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/score.ts#L132)

Reputation Score Service
Calculates composite reputation scores and manages trust badges

#### Constructors

##### Constructor

```ts
new ReputationScorer(config: Partial<ReputationScorerConfig>): ReputationScorer;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/reputation/score.ts:135](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/score.ts#L135)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `config` | `Partial`\<[`ReputationScorerConfig`](/docs/api/defi/protocols/src/modules/tool-marketplace/reputation/score.md#reputationscorerconfig)\> |

###### Returns

[`ReputationScorer`](/docs/api/defi/protocols/src/modules/tool-marketplace/reputation/score.md#reputationscorer)

#### Methods

##### awardBadge()

```ts
awardBadge(
   toolId: string, 
   badgeType: BadgeType, 
   expiresAt?: number): ReputationBadge;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/reputation/score.ts:366](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/score.ts#L366)

Award a badge manually (e.g., for verified endpoint, security audited)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |
| `badgeType` | [`BadgeType`](/docs/api/defi/protocols/src/modules/tool-marketplace/reputation/types.md#badgetype) |
| `expiresAt?` | `number` |

###### Returns

[`ReputationBadge`](/docs/api/defi/protocols/src/modules/tool-marketplace/reputation/types.md#reputationbadge)

##### calculateScore()

```ts
calculateScore(toolId: string): Promise<ReputationScore>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/reputation/score.ts:148](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/score.ts#L148)

Calculate reputation score for a tool

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |

###### Returns

`Promise`\<[`ReputationScore`](/docs/api/defi/protocols/src/modules/tool-marketplace/reputation/types.md#reputationscore)\>

##### getBadges()

```ts
getBadges(toolId: string): ReputationBadge[];
```

Defined in: [defi/protocols/src/modules/tool-marketplace/reputation/score.ts:351](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/score.ts#L351)

Get badges for a tool

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |

###### Returns

[`ReputationBadge`](/docs/api/defi/protocols/src/modules/tool-marketplace/reputation/types.md#reputationbadge)[]

##### getLeaderboard()

```ts
getLeaderboard(limit: number): LeaderboardEntry[];
```

Defined in: [defi/protocols/src/modules/tool-marketplace/reputation/score.ts:528](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/score.ts#L528)

Get reputation leaderboard

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `limit` | `number` | `50` |

###### Returns

[`LeaderboardEntry`](/docs/api/defi/protocols/src/modules/tool-marketplace/reputation/types.md#leaderboardentry)[]

##### getMetrics()

```ts
getMetrics(toolId: string): ToolMetrics | null;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/reputation/score.ts:430](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/score.ts#L430)

Get tool metrics

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |

###### Returns

`ToolMetrics` \| `null`

##### getPendingReports()

```ts
getPendingReports(): ToolReport[];
```

Defined in: [defi/protocols/src/modules/tool-marketplace/reputation/score.ts:483](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/score.ts#L483)

Get all pending reports

###### Returns

[`ToolReport`](/docs/api/defi/protocols/src/modules/tool-marketplace/reputation/types.md#toolreport)[]

##### getScore()

```ts
getScore(toolId: string): 
  | ReputationScore
  | null;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/reputation/score.ts:337](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/score.ts#L337)

Get reputation score for a tool

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |

###### Returns

  \| [`ReputationScore`](/docs/api/defi/protocols/src/modules/tool-marketplace/reputation/types.md#reputationscore)
  \| `null`

##### getScoreHistory()

```ts
getScoreHistory(toolId: string): ReputationHistoryEntry[];
```

Defined in: [defi/protocols/src/modules/tool-marketplace/reputation/score.ts:344](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/score.ts#L344)

Get score history for a tool

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |

###### Returns

[`ReputationHistoryEntry`](/docs/api/defi/protocols/src/modules/tool-marketplace/reputation/types.md#reputationhistoryentry)[]

##### getTierStats()

```ts
getTierStats(): Record<TrustTier, number>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/reputation/score.ts:560](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/score.ts#L560)

Get tier statistics

###### Returns

`Record`\<[`TrustTier`](/docs/api/defi/protocols/src/modules/tool-marketplace/reputation/types.md#trusttier), `number`\>

##### getToolReports()

```ts
getToolReports(toolId: string): ToolReport[];
```

Defined in: [defi/protocols/src/modules/tool-marketplace/reputation/score.ts:472](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/score.ts#L472)

Get reports for a tool

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |

###### Returns

[`ToolReport`](/docs/api/defi/protocols/src/modules/tool-marketplace/reputation/types.md#toolreport)[]

##### hasBadge()

```ts
hasBadge(toolId: string, badgeType: BadgeType): boolean;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/reputation/score.ts:358](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/score.ts#L358)

Check if tool has a specific badge

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |
| `badgeType` | [`BadgeType`](/docs/api/defi/protocols/src/modules/tool-marketplace/reputation/types.md#badgetype) |

###### Returns

`boolean`

##### recalculateAll()

```ts
recalculateAll(): Promise<void>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/reputation/score.ts:578](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/score.ts#L578)

Recalculate all scores (batch operation)

###### Returns

`Promise`\<`void`\>

##### reportTool()

```ts
reportTool(
   toolId: string, 
   reporterAddress: string, 
   category: "other" | "malicious" | "scam" | "broken" | "misleading" | "privacy", 
   severity: "low" | "medium" | "high" | "critical", 
   description: string, 
evidence?: string[]): Promise<ToolReport>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/reputation/score.ts:437](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/score.ts#L437)

Report a tool

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |
| `reporterAddress` | `string` |
| `category` | `"other"` \| `"malicious"` \| `"scam"` \| `"broken"` \| `"misleading"` \| `"privacy"` |
| `severity` | `"low"` \| `"medium"` \| `"high"` \| `"critical"` |
| `description` | `string` |
| `evidence?` | `string`[] |

###### Returns

`Promise`\<[`ToolReport`](/docs/api/defi/protocols/src/modules/tool-marketplace/reputation/types.md#toolreport)\>

##### reviewReport()

```ts
reviewReport(
   reportId: string, 
   status: "confirmed" | "dismissed", 
resolution?: string): Promise<ToolReport>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/reputation/score.ts:498](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/score.ts#L498)

Review a tool report

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `reportId` | `string` |
| `status` | `"confirmed"` \| `"dismissed"` |
| `resolution?` | `string` |

###### Returns

`Promise`\<[`ToolReport`](/docs/api/defi/protocols/src/modules/tool-marketplace/reputation/types.md#toolreport)\>

##### revokeBadge()

```ts
revokeBadge(toolId: string, badgeType: BadgeType): boolean;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/reputation/score.ts:389](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/score.ts#L389)

Revoke a badge

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |
| `badgeType` | [`BadgeType`](/docs/api/defi/protocols/src/modules/tool-marketplace/reputation/types.md#badgetype) |

###### Returns

`boolean`

##### updateMetrics()

```ts
updateMetrics(toolId: string, metrics: Partial<ToolMetrics>): void;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/reputation/score.ts:406](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/score.ts#L406)

Update tool metrics

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |
| `metrics` | `Partial`\<`ToolMetrics`\> |

###### Returns

`void`

## Interfaces

### ReputationScorerConfig

Defined in: [defi/protocols/src/modules/tool-marketplace/reputation/score.ts:24](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/score.ts#L24)

Configuration for reputation scoring

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="badges"></a> `badges` | \{ `fastResponseMaxMs`: `number`; `highVolumeMinCalls`: `number`; `premiumMinStake`: `string`; `reliableMinUptime`: `number`; `topRatedMinCount`: `number`; `topRatedMinRating`: `number`; `trendingGrowthPercent`: `number`; \} | [defi/protocols/src/modules/tool-marketplace/reputation/score.ts:37](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/score.ts#L37) |
| `badges.fastResponseMaxMs` | `number` | [defi/protocols/src/modules/tool-marketplace/reputation/score.ts:43](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/score.ts#L43) |
| `badges.highVolumeMinCalls` | `number` | [defi/protocols/src/modules/tool-marketplace/reputation/score.ts:40](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/score.ts#L40) |
| `badges.premiumMinStake` | `string` | [defi/protocols/src/modules/tool-marketplace/reputation/score.ts:42](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/score.ts#L42) |
| `badges.reliableMinUptime` | `number` | [defi/protocols/src/modules/tool-marketplace/reputation/score.ts:44](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/score.ts#L44) |
| `badges.topRatedMinCount` | `number` | [defi/protocols/src/modules/tool-marketplace/reputation/score.ts:39](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/score.ts#L39) |
| `badges.topRatedMinRating` | `number` | [defi/protocols/src/modules/tool-marketplace/reputation/score.ts:38](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/score.ts#L38) |
| `badges.trendingGrowthPercent` | `number` | [defi/protocols/src/modules/tool-marketplace/reputation/score.ts:41](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/score.ts#L41) |
| <a id="tierthresholds"></a> `tierThresholds` | \{ `gold`: `number`; `platinum`: `number`; `silver`: `number`; \} | [defi/protocols/src/modules/tool-marketplace/reputation/score.ts:31](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/score.ts#L31) |
| `tierThresholds.gold` | `number` | [defi/protocols/src/modules/tool-marketplace/reputation/score.ts:33](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/score.ts#L33) |
| `tierThresholds.platinum` | `number` | [defi/protocols/src/modules/tool-marketplace/reputation/score.ts:32](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/score.ts#L32) |
| `tierThresholds.silver` | `number` | [defi/protocols/src/modules/tool-marketplace/reputation/score.ts:34](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/score.ts#L34) |
| <a id="weights"></a> `weights` | \{ `age`: `number`; `rating`: `number`; `uptime`: `number`; `volume`: `number`; \} | [defi/protocols/src/modules/tool-marketplace/reputation/score.ts:25](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/score.ts#L25) |
| `weights.age` | `number` | [defi/protocols/src/modules/tool-marketplace/reputation/score.ts:29](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/score.ts#L29) |
| `weights.rating` | `number` | [defi/protocols/src/modules/tool-marketplace/reputation/score.ts:27](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/score.ts#L27) |
| `weights.uptime` | `number` | [defi/protocols/src/modules/tool-marketplace/reputation/score.ts:26](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/score.ts#L26) |
| `weights.volume` | `number` | [defi/protocols/src/modules/tool-marketplace/reputation/score.ts:28](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/score.ts#L28) |

## Variables

### reputationScorer

```ts
const reputationScorer: ReputationScorer;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/reputation/score.ts:594](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/reputation/score.ts#L594)

Singleton instance
