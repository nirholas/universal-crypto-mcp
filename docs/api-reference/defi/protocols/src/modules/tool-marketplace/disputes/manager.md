[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/modules/tool-marketplace/disputes/manager

# defi/protocols/src/modules/tool-marketplace/disputes/manager

## Classes

### DisputeManager

Defined in: [defi/protocols/src/modules/tool-marketplace/disputes/manager.ts:76](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/manager.ts#L76)

Dispute Manager Service
Handles creation, management, and resolution of payment disputes

#### Constructors

##### Constructor

```ts
new DisputeManager(config: Partial<DisputeManagerConfig>): DisputeManager;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/disputes/manager.ts:79](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/manager.ts#L79)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `config` | `Partial`\<[`DisputeManagerConfig`](/docs/api/defi/protocols/src/modules/tool-marketplace/disputes/manager.md#disputemanagerconfig)\> |

###### Returns

[`DisputeManager`](/docs/api/defi/protocols/src/modules/tool-marketplace/disputes/manager.md#disputemanager)

#### Methods

##### closeExpiredDispute()

```ts
closeExpiredDispute(disputeId: string): Promise<Dispute>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/disputes/manager.ts:408](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/manager.ts#L408)

Close an expired dispute

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `disputeId` | `string` |

###### Returns

`Promise`\<[`Dispute`](/docs/api/defi/protocols/src/modules/tool-marketplace/disputes/types.md#dispute)\>

##### escalateDispute()

```ts
escalateDispute(
   disputeId: string, 
   escalatorAddress: `0x${string}`, 
reason: string): Promise<Dispute>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/disputes/manager.ts:367](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/manager.ts#L367)

Escalate a dispute to arbitration

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `disputeId` | `string` |
| `escalatorAddress` | `` `0x${string}` `` |
| `reason` | `string` |

###### Returns

`Promise`\<[`Dispute`](/docs/api/defi/protocols/src/modules/tool-marketplace/disputes/types.md#dispute)\>

##### getDispute()

```ts
getDispute(disputeId: string): 
  | Dispute
  | null;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/disputes/manager.ts:160](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/manager.ts#L160)

Get dispute by ID

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `disputeId` | `string` |

###### Returns

  \| [`Dispute`](/docs/api/defi/protocols/src/modules/tool-marketplace/disputes/types.md#dispute)
  \| `null`

##### getDisputes()

```ts
getDisputes(filter: DisputeFilter): Dispute[];
```

Defined in: [defi/protocols/src/modules/tool-marketplace/disputes/manager.ts:167](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/manager.ts#L167)

Get disputes with filters

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `filter` | [`DisputeFilter`](/docs/api/defi/protocols/src/modules/tool-marketplace/disputes/types.md#disputefilter) |

###### Returns

[`Dispute`](/docs/api/defi/protocols/src/modules/tool-marketplace/disputes/types.md#dispute)[]

##### getStats()

```ts
getStats(): DisputeStats;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/disputes/manager.ts:440](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/manager.ts#L440)

Get dispute statistics

###### Returns

[`DisputeStats`](/docs/api/defi/protocols/src/modules/tool-marketplace/disputes/types.md#disputestats)

##### getToolDisputes()

```ts
getToolDisputes(toolId: string): Dispute[];
```

Defined in: [defi/protocols/src/modules/tool-marketplace/disputes/manager.ts:217](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/manager.ts#L217)

Get disputes for a tool

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |

###### Returns

[`Dispute`](/docs/api/defi/protocols/src/modules/tool-marketplace/disputes/types.md#dispute)[]

##### getUserDisputes()

```ts
getUserDisputes(userAddress: `0x${string}`): Dispute[];
```

Defined in: [defi/protocols/src/modules/tool-marketplace/disputes/manager.ts:206](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/manager.ts#L206)

Get user's disputes

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `userAddress` | `` `0x${string}` `` |

###### Returns

[`Dispute`](/docs/api/defi/protocols/src/modules/tool-marketplace/disputes/types.md#dispute)[]

##### getUserLimits()

```ts
getUserLimits(userAddress: `0x${string}`): UserDisputeLimits;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/disputes/manager.ts:228](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/manager.ts#L228)

Get user dispute limits

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `userAddress` | `` `0x${string}` `` |

###### Returns

[`UserDisputeLimits`](/docs/api/defi/protocols/src/modules/tool-marketplace/disputes/types.md#userdisputelimits)

##### markAutoResolved()

```ts
markAutoResolved(disputeId: string): void;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/disputes/manager.ts:522](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/manager.ts#L522)

Mark dispute as auto-resolved

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `disputeId` | `string` |

###### Returns

`void`

##### openDispute()

```ts
openDispute(input: CreateDisputeInput, toolOwnerAddress: `0x${string}`): Promise<Dispute>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/disputes/manager.ts:86](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/manager.ts#L86)

Open a new dispute

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `input` | [`CreateDisputeInput`](/docs/api/defi/protocols/src/modules/tool-marketplace/disputes/types.md#createdisputeinput) |
| `toolOwnerAddress` | `` `0x${string}` `` |

###### Returns

`Promise`\<[`Dispute`](/docs/api/defi/protocols/src/modules/tool-marketplace/disputes/types.md#dispute)\>

##### processExpiredDisputes()

```ts
processExpiredDisputes(): Promise<number>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/disputes/manager.ts:498](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/manager.ts#L498)

Check and close expired disputes

###### Returns

`Promise`\<`number`\>

##### resolveDispute()

```ts
resolveDispute(
   disputeId: string, 
   outcome: DisputeOutcome, 
   refundAmount?: string, 
notes?: string): Promise<Dispute>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/disputes/manager.ts:334](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/manager.ts#L334)

Resolve a dispute

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `disputeId` | `string` |
| `outcome` | [`DisputeOutcome`](/docs/api/defi/protocols/src/modules/tool-marketplace/disputes/types.md#disputeoutcome-1) |
| `refundAmount?` | `string` |
| `notes?` | `string` |

###### Returns

`Promise`\<[`Dispute`](/docs/api/defi/protocols/src/modules/tool-marketplace/disputes/types.md#dispute)\>

##### startReview()

```ts
startReview(disputeId: string, reviewerAddress: `0x${string}`): Promise<Dispute>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/disputes/manager.ts:309](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/manager.ts#L309)

Start reviewing a dispute

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `disputeId` | `string` |
| `reviewerAddress` | `` `0x${string}` `` |

###### Returns

`Promise`\<[`Dispute`](/docs/api/defi/protocols/src/modules/tool-marketplace/disputes/types.md#dispute)\>

##### submitEvidence()

```ts
submitEvidence(
   disputeId: string, 
   submitterAddress: `0x${string}`, 
   type: EvidenceType, 
   content: string, 
description?: string): Promise<DisputeEvidence>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/disputes/manager.ts:262](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/manager.ts#L262)

Submit evidence to a dispute

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `disputeId` | `string` |
| `submitterAddress` | `` `0x${string}` `` |
| `type` | [`EvidenceType`](/docs/api/defi/protocols/src/modules/tool-marketplace/disputes/types.md#evidencetype) |
| `content` | `string` |
| `description?` | `string` |

###### Returns

`Promise`\<[`DisputeEvidence`](/docs/api/defi/protocols/src/modules/tool-marketplace/disputes/types.md#disputeevidence-1)\>

## Interfaces

### DisputeManagerConfig

Defined in: [defi/protocols/src/modules/tool-marketplace/disputes/manager.ts:26](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/manager.ts#L26)

Configuration for dispute management

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="disputecooldown"></a> `disputeCooldown` | `number` | Cooldown after opening a dispute (ms) - default 1 hour | [defi/protocols/src/modules/tool-marketplace/disputes/manager.ts:34](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/manager.ts#L34) |
| <a id="disputeexpirytime"></a> `disputeExpiryTime` | `number` | Dispute expiry time (ms) - default 7 days | [defi/protocols/src/modules/tool-marketplace/disputes/manager.ts:32](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/manager.ts#L32) |
| <a id="disputewindow"></a> `disputeWindow` | `number` | Time window to open dispute after payment (ms) - default 24 hours | [defi/protocols/src/modules/tool-marketplace/disputes/manager.ts:28](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/manager.ts#L28) |
| <a id="maxopendisputesperuser"></a> `maxOpenDisputesPerUser` | `number` | Maximum open disputes per user | [defi/protocols/src/modules/tool-marketplace/disputes/manager.ts:30](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/manager.ts#L30) |

## Variables

### disputeManager

```ts
const disputeManager: DisputeManager;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/disputes/manager.ts:534](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/manager.ts#L534)

Singleton instance
