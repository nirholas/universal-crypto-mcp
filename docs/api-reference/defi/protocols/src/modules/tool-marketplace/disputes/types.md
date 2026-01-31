[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/modules/tool-marketplace/disputes/types

# defi/protocols/src/modules/tool-marketplace/disputes/types

## Interfaces

### ArbitrationCase

Defined in: [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:218](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L218)

Arbitration case

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="createdat"></a> `createdAt` | `number` | Created timestamp | [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:224](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L224) |
| <a id="disputeid"></a> `disputeId` | `string` | Related dispute ID | [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:222](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L222) |
| <a id="id"></a> `id` | `string` | Case ID | [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:220](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L220) |
| <a id="minvotesrequired"></a> `minVotesRequired` | `number` | Minimum votes needed | [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:232](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L232) |
| <a id="outcome"></a> `outcome?` | [`DisputeOutcome`](/docs/api/defi/protocols/src/modules/tool-marketplace/disputes/types.md#disputeoutcome-1) | Outcome (if decided) | [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:236](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L236) |
| <a id="requiredstake"></a> `requiredStake` | `string` | Required stake to vote | [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:230](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L230) |
| <a id="resolvedat"></a> `resolvedAt?` | `number` | Resolution timestamp | [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:240](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L240) |
| <a id="state"></a> `state` | `"expired"` \| `"voting"` \| `"decided"` | Case state | [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:234](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L234) |
| <a id="votes"></a> `votes` | [`ArbitrationVote`](/docs/api/defi/protocols/src/modules/tool-marketplace/disputes/types.md#arbitrationvote)[] | Votes cast | [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:228](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L228) |
| <a id="votingdeadline"></a> `votingDeadline` | `number` | Voting deadline | [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:226](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L226) |
| <a id="winningside"></a> `winningSide?` | `"user"` \| `"tool_owner"` | Winning side | [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:238](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L238) |

***

### ArbitrationVote

Defined in: [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:198](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L198)

Arbitration vote

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="arbitratoraddress"></a> `arbitratorAddress` | `` `0x${string}` `` | Arbitrator address | [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:204](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L204) |
| <a id="caseid"></a> `caseId` | `string` | Case ID | [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:202](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L202) |
| <a id="id-1"></a> `id` | `string` | Vote ID | [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:200](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L200) |
| <a id="reasoning"></a> `reasoning?` | `string` | Reasoning | [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:212](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L212) |
| <a id="stakeamount"></a> `stakeAmount` | `string` | Stake amount | [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:208](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L208) |
| <a id="votedat"></a> `votedAt` | `number` | Vote timestamp | [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:210](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L210) |
| <a id="voteforuser"></a> `voteForUser` | `boolean` | Vote: true for user, false for tool owner | [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:206](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L206) |

***

### Arbitrator

Defined in: [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:246](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L246)

Arbitrator info

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="active"></a> `active` | `boolean` | Active status | [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:262](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L262) |
| <a id="address"></a> `address` | `` `0x${string}` `` | Arbitrator address | [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:248](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L248) |
| <a id="casesparticipated"></a> `casesParticipated` | `number` | Cases participated | [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:252](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L252) |
| <a id="caseswon"></a> `casesWon` | `number` | Cases won (voted correctly) | [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:254](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L254) |
| <a id="penaltiesincurred"></a> `penaltiesIncurred` | `string` | Penalties incurred | [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:260](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L260) |
| <a id="registeredat"></a> `registeredAt` | `number` | Registered timestamp | [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:264](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L264) |
| <a id="rewardsearned"></a> `rewardsEarned` | `string` | Rewards earned | [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:258](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L258) |
| <a id="stakedamount"></a> `stakedAmount` | `string` | Total stake | [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:250](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L250) |
| <a id="winrate"></a> `winRate` | `number` | Win rate | [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:256](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L256) |

***

### AutoResolutionRule

Defined in: [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:178](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L178)

Auto-resolution rule

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="action"></a> `action` | `"full_refund"` \| `"partial_refund"` | Resolution action | [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:188](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L188) |
| <a id="active-1"></a> `active` | `boolean` | Active status | [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:192](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L192) |
| <a id="conditiontype"></a> `conditionType` | `"tool_down"` \| `"slow_response"` \| `"schema_violation"` | Condition type | [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:184](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L184) |
| <a id="id-2"></a> `id` | `string` | Rule ID | [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:180](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L180) |
| <a id="name"></a> `name` | `string` | Rule name | [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:182](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L182) |
| <a id="refundpercent"></a> `refundPercent?` | `number` | Refund percentage (for partial refund) | [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:190](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L190) |
| <a id="threshold"></a> `threshold?` | `number` | Threshold value (e.g., response time in ms) | [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:186](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L186) |

***

### CreateDisputeInput

Defined in: [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:130](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L130)

Dispute creation input

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="description"></a> `description` | `string` | Description | [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:144](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L144) |
| <a id="evidence"></a> `evidence?` | \{ `content`: `string`; `description?`: `string`; `type`: [`EvidenceType`](/docs/api/defi/protocols/src/modules/tool-marketplace/disputes/types.md#evidencetype); \}[] | Initial evidence | [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:146](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L146) |
| <a id="paymentamount"></a> `paymentAmount` | `string` | Payment amount | [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:138](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L138) |
| <a id="paymenttoken"></a> `paymentToken` | `string` | Payment token | [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:140](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L140) |
| <a id="paymenttxhash"></a> `paymentTxHash` | `string` | Payment transaction hash | [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:136](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L136) |
| <a id="reason"></a> `reason` | [`DisputeReason`](/docs/api/defi/protocols/src/modules/tool-marketplace/disputes/types.md#disputereason-1) | Dispute reason | [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:142](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L142) |
| <a id="toolid"></a> `toolId` | `string` | Tool ID | [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:132](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L132) |
| <a id="useraddress"></a> `userAddress` | `` `0x${string}` `` | User opening dispute | [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:134](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L134) |

***

### Dispute

Defined in: [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:57](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L57)

Dispute record

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="autoresolved"></a> `autoResolved` | `boolean` | Auto-resolution applied | [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:91](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L91) |
| <a id="createdat-1"></a> `createdAt` | `number` | Created timestamp | [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:85](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L85) |
| <a id="description-1"></a> `description` | `string` | Detailed description | [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:75](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L75) |
| <a id="escalation"></a> `escalation?` | [`EscalationDetails`](/docs/api/defi/protocols/src/modules/tool-marketplace/disputes/types.md#escalationdetails) | Escalation details | [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:97](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L97) |
| <a id="evidence-1"></a> `evidence` | [`DisputeEvidence`](/docs/api/defi/protocols/src/modules/tool-marketplace/disputes/types.md#disputeevidence-1)[] | Evidence submitted | [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:77](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L77) |
| <a id="id-3"></a> `id` | `string` | Unique dispute ID | [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:59](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L59) |
| <a id="outcome-1"></a> `outcome` | [`DisputeOutcome`](/docs/api/defi/protocols/src/modules/tool-marketplace/disputes/types.md#disputeoutcome-1) | Resolution outcome | [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:81](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L81) |
| <a id="paymentamount-1"></a> `paymentAmount` | `string` | Payment amount | [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:69](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L69) |
| <a id="paymenttoken-1"></a> `paymentToken` | `string` | Payment token | [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:71](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L71) |
| <a id="paymenttxhash-1"></a> `paymentTxHash` | `string` | Payment transaction hash | [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:67](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L67) |
| <a id="reason-1"></a> `reason` | [`DisputeReason`](/docs/api/defi/protocols/src/modules/tool-marketplace/disputes/types.md#disputereason-1) | Dispute reason | [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:73](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L73) |
| <a id="refundamount"></a> `refundAmount?` | `string` | Refund amount (if applicable) | [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:83](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L83) |
| <a id="resolutionnotes"></a> `resolutionNotes?` | `string` | Resolution notes | [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:93](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L93) |
| <a id="resolvedat-1"></a> `resolvedAt?` | `number` | Resolved timestamp | [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:89](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L89) |
| <a id="revieweraddress"></a> `reviewerAddress?` | `` `0x${string}` `` | Assigned reviewer (if under review) | [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:95](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L95) |
| <a id="state-1"></a> `state` | [`DisputeState`](/docs/api/defi/protocols/src/modules/tool-marketplace/disputes/types.md#disputestate-1) | Current state | [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:79](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L79) |
| <a id="toolid-1"></a> `toolId` | `string` | Tool ID involved | [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:61](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L61) |
| <a id="toolowneraddress"></a> `toolOwnerAddress` | `` `0x${string}` `` | Tool owner address | [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:65](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L65) |
| <a id="updatedat"></a> `updatedAt` | `number` | Last updated timestamp | [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:87](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L87) |
| <a id="useraddress-1"></a> `userAddress` | `` `0x${string}` `` | User who opened dispute | [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:63](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L63) |

***

### DisputeEvidence

Defined in: [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:39](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L39)

Evidence item

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="content"></a> `content` | `string` | Evidence URL or data | [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:45](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L45) |
| <a id="description-2"></a> `description?` | `string` | Description | [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:47](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L47) |
| <a id="id-4"></a> `id` | `string` | Evidence ID | [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:41](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L41) |
| <a id="submittedat"></a> `submittedAt` | `number` | Submission timestamp | [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:51](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L51) |
| <a id="submittedby"></a> `submittedBy` | `` `0x${string}` `` | Submitted by | [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:49](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L49) |
| <a id="type"></a> `type` | [`EvidenceType`](/docs/api/defi/protocols/src/modules/tool-marketplace/disputes/types.md#evidencetype) | Evidence type | [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:43](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L43) |

***

### DisputeFilter

Defined in: [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:156](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L156)

Dispute filter options

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="createdafter"></a> `createdAfter?` | `number` | Created after timestamp | [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:166](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L166) |
| <a id="createdbefore"></a> `createdBefore?` | `number` | Created before timestamp | [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:168](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L168) |
| <a id="limit"></a> `limit?` | `number` | Limit results | [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:170](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L170) |
| <a id="offset"></a> `offset?` | `number` | Offset for pagination | [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:172](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L172) |
| <a id="state-2"></a> `state?` | [`DisputeState`](/docs/api/defi/protocols/src/modules/tool-marketplace/disputes/types.md#disputestate-1) | Filter by state | [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:158](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L158) |
| <a id="toolid-2"></a> `toolId?` | `string` | Filter by tool ID | [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:160](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L160) |
| <a id="toolowneraddress-1"></a> `toolOwnerAddress?` | `` `0x${string}` `` | Filter by tool owner | [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:164](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L164) |
| <a id="useraddress-2"></a> `userAddress?` | `` `0x${string}` `` | Filter by user address | [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:162](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L162) |

***

### DisputeStats

Defined in: [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:270](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L270)

Dispute statistics

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="autoresolutionrate"></a> `autoResolutionRate` | `number` | Auto-resolution rate | [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:282](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L282) |
| <a id="avgresolutiontime"></a> `avgResolutionTime` | `number` | Average resolution time (ms) | [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:280](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L280) |
| <a id="disputesbyreason"></a> `disputesByReason` | `Record`\<[`DisputeReason`](/docs/api/defi/protocols/src/modules/tool-marketplace/disputes/types.md#disputereason-1), `number`\> | Disputes by reason | [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:288](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L288) |
| <a id="escalateddisputes"></a> `escalatedDisputes` | `number` | Escalated disputes | [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:278](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L278) |
| <a id="opendisputes"></a> `openDisputes` | `number` | Open disputes | [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:274](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L274) |
| <a id="resolveddisputes"></a> `resolvedDisputes` | `number` | Resolved disputes | [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:276](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L276) |
| <a id="totaldisputes"></a> `totalDisputes` | `number` | Total disputes | [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:272](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L272) |
| <a id="totalrefundsissued"></a> `totalRefundsIssued` | `string` | Total refunds issued | [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:286](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L286) |
| <a id="userwinrate"></a> `userWinRate` | `number` | User win rate | [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:284](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L284) |

***

### EscalationDetails

Defined in: [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:116](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L116)

Escalation details

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="arbitrationcaseid-1"></a> `arbitrationCaseId?` | `string` | Arbitration case ID | [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:122](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L122) |
| <a id="escalatedat"></a> `escalatedAt` | `number` | Escalation timestamp | [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:118](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L118) |
| <a id="escalatedby"></a> `escalatedBy` | `` `0x${string}` `` | Escalated by | [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:124](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L124) |
| <a id="reason-2"></a> `reason` | `string` | Escalation reason | [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:120](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L120) |

***

### UserDisputeLimits

Defined in: [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:294](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L294)

User dispute limits

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="canopendispute"></a> `canOpenDispute` | `boolean` | Can open new dispute | [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:302](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L302) |
| <a id="cooldownendsat"></a> `cooldownEndsAt?` | `number` | Cooldown end (if in cooldown) | [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:306](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L306) |
| <a id="maxopendisputes"></a> `maxOpenDisputes` | `number` | Max allowed open disputes | [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:300](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L300) |
| <a id="opendisputes-1"></a> `openDisputes` | `number` | Open disputes count | [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:298](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L298) |
| <a id="reason-3"></a> `reason?` | `string` | Reason if cannot open | [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:304](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L304) |
| <a id="useraddress-3"></a> `userAddress` | `` `0x${string}` `` | User address | [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:296](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L296) |

## Type Aliases

### DisputeOutcome

```ts
type DisputeOutcome = "full_refund" | "partial_refund" | "no_refund" | "dismissed" | "pending";
```

Defined in: [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:24](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L24)

Dispute resolution outcome

***

### DisputeReason

```ts
type DisputeReason = 
  | "tool_down"
  | "slow_response"
  | "invalid_response"
  | "schema_violation"
  | "wrong_result"
  | "security_concern"
  | "unauthorized_charges"
  | "other";
```

Defined in: [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:103](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L103)

Dispute reason categories

***

### DisputeState

```ts
type DisputeState = "open" | "under_review" | "resolved" | "escalated" | "closed" | "expired";
```

Defined in: [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:13](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L13)

Dispute states

***

### EvidenceType

```ts
type EvidenceType = "screenshot" | "log" | "transaction" | "api_response" | "other";
```

Defined in: [defi/protocols/src/modules/tool-marketplace/disputes/types.ts:34](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/types.ts#L34)

Evidence type
