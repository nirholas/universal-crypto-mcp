[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/modules/tool-marketplace/disputes/arbitration

# defi/protocols/src/modules/tool-marketplace/disputes/arbitration

## Classes

### ArbitrationDAO

Defined in: [defi/protocols/src/modules/tool-marketplace/disputes/arbitration.ts:76](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/arbitration.ts#L76)

Arbitration DAO Service
Manages decentralized dispute arbitration with staked arbitrators

#### Constructors

##### Constructor

```ts
new ArbitrationDAO(config: Partial<ArbitrationConfig>): ArbitrationDAO;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/disputes/arbitration.ts:79](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/arbitration.ts#L79)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `config` | `Partial`\<[`ArbitrationConfig`](/docs/api/defi/protocols/src/modules/tool-marketplace/disputes/arbitration.md#arbitrationconfig)\> |

###### Returns

[`ArbitrationDAO`](/docs/api/defi/protocols/src/modules/tool-marketplace/disputes/arbitration.md#arbitrationdao)

#### Methods

##### castVote()

```ts
castVote(
   caseId: string, 
   arbitratorAddress: `0x${string}`, 
   voteForUser: boolean, 
reasoning?: string): Promise<ArbitrationVote>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/disputes/arbitration.ts:269](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/arbitration.ts#L269)

Cast a vote on an arbitration case

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `caseId` | `string` |
| `arbitratorAddress` | `` `0x${string}` `` |
| `voteForUser` | `boolean` |
| `reasoning?` | `string` |

###### Returns

`Promise`\<[`ArbitrationVote`](/docs/api/defi/protocols/src/modules/tool-marketplace/disputes/types.md#arbitrationvote)\>

##### claimRewards()

```ts
claimRewards(address: `0x${string}`): Promise<string>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/disputes/arbitration.ts:587](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/arbitration.ts#L587)

Claim pending rewards

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `address` | `` `0x${string}` `` |

###### Returns

`Promise`\<`string`\>

##### createCase()

```ts
createCase(dispute: Dispute): Promise<ArbitrationCase>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/disputes/arbitration.ts:230](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/arbitration.ts#L230)

Create an arbitration case for an escalated dispute

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `dispute` | [`Dispute`](/docs/api/defi/protocols/src/modules/tool-marketplace/disputes/types.md#dispute) |

###### Returns

`Promise`\<[`ArbitrationCase`](/docs/api/defi/protocols/src/modules/tool-marketplace/disputes/types.md#arbitrationcase)\>

##### decideCase()

```ts
decideCase(caseId: string): Promise<ArbitrationCase>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/disputes/arbitration.ts:352](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/arbitration.ts#L352)

Decide an arbitration case based on votes

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `caseId` | `string` |

###### Returns

`Promise`\<[`ArbitrationCase`](/docs/api/defi/protocols/src/modules/tool-marketplace/disputes/types.md#arbitrationcase)\>

##### expireCase()

```ts
expireCase(caseId: string): Promise<ArbitrationCase>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/disputes/arbitration.ts:499](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/arbitration.ts#L499)

Expire a case that didn't get enough votes

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `caseId` | `string` |

###### Returns

`Promise`\<[`ArbitrationCase`](/docs/api/defi/protocols/src/modules/tool-marketplace/disputes/types.md#arbitrationcase)\>

##### getActiveArbitrators()

```ts
getActiveArbitrators(): Arbitrator[];
```

Defined in: [defi/protocols/src/modules/tool-marketplace/disputes/arbitration.ts:205](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/arbitration.ts#L205)

Get all active arbitrators

###### Returns

[`Arbitrator`](/docs/api/defi/protocols/src/modules/tool-marketplace/disputes/types.md#arbitrator)[]

##### getActiveCases()

```ts
getActiveCases(): ArbitrationCase[];
```

Defined in: [defi/protocols/src/modules/tool-marketplace/disputes/arbitration.ts:551](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/arbitration.ts#L551)

Get all active cases

###### Returns

[`ArbitrationCase`](/docs/api/defi/protocols/src/modules/tool-marketplace/disputes/types.md#arbitrationcase)[]

##### getArbitrator()

```ts
getArbitrator(address: `0x${string}`): 
  | Arbitrator
  | null;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/disputes/arbitration.ts:198](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/arbitration.ts#L198)

Get arbitrator info

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `address` | `` `0x${string}` `` |

###### Returns

  \| [`Arbitrator`](/docs/api/defi/protocols/src/modules/tool-marketplace/disputes/types.md#arbitrator)
  \| `null`

##### getArbitratorCases()

```ts
getArbitratorCases(address: `0x${string}`): ArbitrationCase[];
```

Defined in: [defi/protocols/src/modules/tool-marketplace/disputes/arbitration.ts:560](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/arbitration.ts#L560)

Get cases for an arbitrator

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `address` | `` `0x${string}` `` |

###### Returns

[`ArbitrationCase`](/docs/api/defi/protocols/src/modules/tool-marketplace/disputes/types.md#arbitrationcase)[]

##### getArbitratorLeaderboard()

```ts
getArbitratorLeaderboard(limit: number): Arbitrator[];
```

Defined in: [defi/protocols/src/modules/tool-marketplace/disputes/arbitration.ts:212](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/arbitration.ts#L212)

Get arbitrator leaderboard

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `limit` | `number` | `50` |

###### Returns

[`Arbitrator`](/docs/api/defi/protocols/src/modules/tool-marketplace/disputes/types.md#arbitrator)[]

##### getCase()

```ts
getCase(caseId: string): 
  | ArbitrationCase
  | null;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/disputes/arbitration.ts:536](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/arbitration.ts#L536)

Get arbitration case by ID

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `caseId` | `string` |

###### Returns

  \| [`ArbitrationCase`](/docs/api/defi/protocols/src/modules/tool-marketplace/disputes/types.md#arbitrationcase)
  \| `null`

##### getCaseByDispute()

```ts
getCaseByDispute(disputeId: string): 
  | ArbitrationCase
  | null;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/disputes/arbitration.ts:543](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/arbitration.ts#L543)

Get case by dispute ID

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `disputeId` | `string` |

###### Returns

  \| [`ArbitrationCase`](/docs/api/defi/protocols/src/modules/tool-marketplace/disputes/types.md#arbitrationcase)
  \| `null`

##### getPendingRewards()

```ts
getPendingRewards(address: `0x${string}`): string;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/disputes/arbitration.ts:580](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/arbitration.ts#L580)

Get pending rewards for an arbitrator

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `address` | `` `0x${string}` `` |

###### Returns

`string`

##### getStats()

```ts
getStats(): {
  activeArbitrators: number;
  activeCases: number;
  avgVotesPerCase: number;
  decidedCases: number;
  expiredCases: number;
  totalArbitrators: number;
  totalCases: number;
  userWinRate: number;
};
```

Defined in: [defi/protocols/src/modules/tool-marketplace/disputes/arbitration.ts:635](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/arbitration.ts#L635)

Get arbitration statistics

###### Returns

```ts
{
  activeArbitrators: number;
  activeCases: number;
  avgVotesPerCase: number;
  decidedCases: number;
  expiredCases: number;
  totalArbitrators: number;
  totalCases: number;
  userWinRate: number;
}
```

| Name | Type | Defined in |
| :------ | :------ | :------ |
| `activeArbitrators` | `number` | [defi/protocols/src/modules/tool-marketplace/disputes/arbitration.ts:641](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/arbitration.ts#L641) |
| `activeCases` | `number` | [defi/protocols/src/modules/tool-marketplace/disputes/arbitration.ts:637](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/arbitration.ts#L637) |
| `avgVotesPerCase` | `number` | [defi/protocols/src/modules/tool-marketplace/disputes/arbitration.ts:642](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/arbitration.ts#L642) |
| `decidedCases` | `number` | [defi/protocols/src/modules/tool-marketplace/disputes/arbitration.ts:638](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/arbitration.ts#L638) |
| `expiredCases` | `number` | [defi/protocols/src/modules/tool-marketplace/disputes/arbitration.ts:639](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/arbitration.ts#L639) |
| `totalArbitrators` | `number` | [defi/protocols/src/modules/tool-marketplace/disputes/arbitration.ts:640](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/arbitration.ts#L640) |
| `totalCases` | `number` | [defi/protocols/src/modules/tool-marketplace/disputes/arbitration.ts:636](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/arbitration.ts#L636) |
| `userWinRate` | `number` | [defi/protocols/src/modules/tool-marketplace/disputes/arbitration.ts:643](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/arbitration.ts#L643) |

##### increaseStake()

```ts
increaseStake(address: `0x${string}`, additionalStake: string): Promise<Arbitrator>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/disputes/arbitration.ts:127](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/arbitration.ts#L127)

Increase arbitrator stake

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `address` | `` `0x${string}` `` |
| `additionalStake` | `string` |

###### Returns

`Promise`\<[`Arbitrator`](/docs/api/defi/protocols/src/modules/tool-marketplace/disputes/types.md#arbitrator)\>

##### processExpiredCases()

```ts
processExpiredCases(): Promise<number>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/disputes/arbitration.ts:604](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/arbitration.ts#L604)

Process expired cases

###### Returns

`Promise`\<`number`\>

##### registerArbitrator()

```ts
registerArbitrator(address: `0x${string}`, stakeAmount: string): Promise<Arbitrator>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/disputes/arbitration.ts:90](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/arbitration.ts#L90)

Register as an arbitrator

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `address` | `` `0x${string}` `` |
| `stakeAmount` | `string` |

###### Returns

`Promise`\<[`Arbitrator`](/docs/api/defi/protocols/src/modules/tool-marketplace/disputes/types.md#arbitrator)\>

##### withdrawStake()

```ts
withdrawStake(address: `0x${string}`, amount: string): Promise<Arbitrator>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/disputes/arbitration.ts:147](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/arbitration.ts#L147)

Withdraw stake (only if not participating in active cases)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `address` | `` `0x${string}` `` |
| `amount` | `string` |

###### Returns

`Promise`\<[`Arbitrator`](/docs/api/defi/protocols/src/modules/tool-marketplace/disputes/types.md#arbitrator)\>

## Interfaces

### ArbitrationConfig

Defined in: [defi/protocols/src/modules/tool-marketplace/disputes/arbitration.ts:22](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/arbitration.ts#L22)

Configuration for arbitration

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="daoburnpercent"></a> `daoBurnPercent` | `number` | Percentage of losing stake burned/kept by DAO | [defi/protocols/src/modules/tool-marketplace/disputes/arbitration.ts:34](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/arbitration.ts#L34) |
| <a id="minarbitratorstake"></a> `minArbitratorStake` | `string` | Minimum stake required to become an arbitrator | [defi/protocols/src/modules/tool-marketplace/disputes/arbitration.ts:24](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/arbitration.ts#L24) |
| <a id="minvotesrequired"></a> `minVotesRequired` | `number` | Minimum votes required to decide a case | [defi/protocols/src/modules/tool-marketplace/disputes/arbitration.ts:30](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/arbitration.ts#L30) |
| <a id="votestake"></a> `voteStake` | `string` | Stake required to vote on a case | [defi/protocols/src/modules/tool-marketplace/disputes/arbitration.ts:26](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/arbitration.ts#L26) |
| <a id="votingperiod"></a> `votingPeriod` | `number` | Voting period duration (ms) | [defi/protocols/src/modules/tool-marketplace/disputes/arbitration.ts:28](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/arbitration.ts#L28) |
| <a id="winnerrewardpercent"></a> `winnerRewardPercent` | `number` | Percentage of losing stake distributed to winners | [defi/protocols/src/modules/tool-marketplace/disputes/arbitration.ts:32](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/arbitration.ts#L32) |

## Variables

### arbitrationDAO

```ts
const arbitrationDAO: ArbitrationDAO;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/disputes/arbitration.ts:675](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/arbitration.ts#L675)

Singleton instance
