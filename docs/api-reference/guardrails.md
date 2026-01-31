[**Universal Crypto MCP API Reference v1.0.0**](index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / guardrails

# guardrails

Agent Guardrails Framework

Safety mechanisms to prevent unintended or harmful agent actions.

## Author

nich <nich@nichxbt.com>

## Classes

### AgentGuardrails

Defined in: [shared/utils/src/guardrails/index.ts:355](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/guardrails/index.ts#L355)

Agent Guardrails

Provides safety mechanisms for autonomous agents:
- Kill switch to immediately halt all operations
- Spending limits per transaction and time window
- Approval requirements for high-value actions
- Address allowlisting/blocklisting
- Contract interaction restrictions

#### Example

```typescript
const guardrails = new AgentGuardrails({
  killSwitchEnabled: false,
  spendingLimits: [{
    token: 'ETH',
    decimals: 18,
    perTransaction: parseEther('1'),
    perHour: parseEther('10'),
    perDay: parseEther('50'),
    perWeek: parseEther('200'),
  }],
  approvalRules: [{
    name: 'high-value-transfer',
    condition: (action) => action.type === 'transfer' && action.amount > parseEther('10'),
    approvers: ['admin@company.com'],
    requiredApprovals: 1,
    timeout: 3600000, // 1 hour
  }],
  blockedAddresses: new Set(['0x...']),
  allowedContracts: new Set(),
  dryRun: false,
});

// Check if action is allowed
const result = await guardrails.check({
  type: 'transfer',
  token: 'ETH',
  amount: parseEther('5'),
  to: '0x...',
});

if (!result.allowed) {
  console.error('Action blocked:', result.reason);
}
```

#### Constructors

##### Constructor

```ts
new AgentGuardrails(config: Partial<GuardrailConfig>): AgentGuardrails;
```

Defined in: [shared/utils/src/guardrails/index.ts:362](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/guardrails/index.ts#L362)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `config` | `Partial`\<[`GuardrailConfig`](/docs/api/guardrails.md#guardrailconfig)\> |

###### Returns

[`AgentGuardrails`](/docs/api/guardrails.md#agentguardrails)

#### Methods

##### activateKillSwitch()

```ts
activateKillSwitch(reason: string): void;
```

Defined in: [shared/utils/src/guardrails/index.ts:512](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/guardrails/index.ts#L512)

Activate kill switch

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `reason` | `string` |

###### Returns

`void`

##### allowContract()

```ts
allowContract(address: string): void;
```

Defined in: [shared/utils/src/guardrails/index.ts:551](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/guardrails/index.ts#L551)

Add allowed contract

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `address` | `string` |

###### Returns

`void`

##### blockAddress()

```ts
blockAddress(address: string): void;
```

Defined in: [shared/utils/src/guardrails/index.ts:535](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/guardrails/index.ts#L535)

Add blocked address

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `address` | `string` |

###### Returns

`void`

##### check()

```ts
check(action: AgentAction): Promise<GuardrailCheckResult>;
```

Defined in: [shared/utils/src/guardrails/index.ts:382](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/guardrails/index.ts#L382)

Check if an action is allowed

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `action` | [`AgentAction`](/docs/api/guardrails.md#agentaction) |

###### Returns

`Promise`\<[`GuardrailCheckResult`](/docs/api/guardrails.md#guardrailcheckresult)\>

##### deactivateKillSwitch()

```ts
deactivateKillSwitch(): void;
```

Defined in: [shared/utils/src/guardrails/index.ts:520](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/guardrails/index.ts#L520)

Deactivate kill switch

###### Returns

`void`

##### execute()

```ts
execute<T>(action: AgentAction, executor: () => Promise<T>): Promise<T>;
```

Defined in: [shared/utils/src/guardrails/index.ts:472](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/guardrails/index.ts#L472)

Execute an action with guardrails

###### Type Parameters

| Type Parameter |
| :------ |
| `T` |

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `action` | [`AgentAction`](/docs/api/guardrails.md#agentaction) |
| `executor` | () => `Promise`\<`T`\> |

###### Returns

`Promise`\<`T`\>

##### getApprovalQueue()

```ts
getApprovalQueue(): ApprovalQueue;
```

Defined in: [shared/utils/src/guardrails/index.ts:574](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/guardrails/index.ts#L574)

Get approval queue

###### Returns

[`ApprovalQueue`](/docs/api/guardrails.md#approvalqueue)

##### getSpending()

```ts
getSpending(token: string): {
  daily: bigint;
  hourly: bigint;
  weekly: bigint;
};
```

Defined in: [shared/utils/src/guardrails/index.ts:581](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/guardrails/index.ts#L581)

Get current spending

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `token` | `string` |

###### Returns

```ts
{
  daily: bigint;
  hourly: bigint;
  weekly: bigint;
}
```

| Name | Type | Defined in |
| :------ | :------ | :------ |
| `daily` | `bigint` | [shared/utils/src/guardrails/index.ts:583](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/guardrails/index.ts#L583) |
| `hourly` | `bigint` | [shared/utils/src/guardrails/index.ts:582](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/guardrails/index.ts#L582) |
| `weekly` | `bigint` | [shared/utils/src/guardrails/index.ts:584](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/guardrails/index.ts#L584) |

##### isKillSwitchActive()

```ts
isKillSwitchActive(): boolean;
```

Defined in: [shared/utils/src/guardrails/index.ts:528](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/guardrails/index.ts#L528)

Check kill switch status

###### Returns

`boolean`

##### resetSpending()

```ts
resetSpending(): void;
```

Defined in: [shared/utils/src/guardrails/index.ts:596](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/guardrails/index.ts#L596)

Reset spending tracker

###### Returns

`void`

##### unblockAddress()

```ts
unblockAddress(address: string): void;
```

Defined in: [shared/utils/src/guardrails/index.ts:543](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/guardrails/index.ts#L543)

Remove blocked address

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `address` | `string` |

###### Returns

`void`

##### updateSpendingLimit()

```ts
updateSpendingLimit(limit: SpendingLimit): void;
```

Defined in: [shared/utils/src/guardrails/index.ts:559](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/guardrails/index.ts#L559)

Update spending limit

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `limit` | [`SpendingLimit`](/docs/api/guardrails.md#spendinglimit) |

###### Returns

`void`

***

### ApprovalQueue

Defined in: [shared/utils/src/guardrails/index.ts:174](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/guardrails/index.ts#L174)

Manages approval requests for actions requiring human review

#### Constructors

##### Constructor

```ts
new ApprovalQueue(): ApprovalQueue;
```

Defined in: [shared/utils/src/guardrails/index.ts:179](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/guardrails/index.ts#L179)

###### Returns

[`ApprovalQueue`](/docs/api/guardrails.md#approvalqueue)

#### Methods

##### approve()

```ts
approve(requestId: string, approver: string): boolean;
```

Defined in: [shared/utils/src/guardrails/index.ts:222](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/guardrails/index.ts#L222)

Add an approval

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `requestId` | `string` |
| `approver` | `string` |

###### Returns

`boolean`

##### createRequest()

```ts
createRequest(action: AgentAction, rule: ApprovalRule): Promise<ApprovalRequest>;
```

Defined in: [shared/utils/src/guardrails/index.ts:186](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/guardrails/index.ts#L186)

Create an approval request

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `action` | [`AgentAction`](/docs/api/guardrails.md#agentaction) |
| `rule` | [`ApprovalRule`](/docs/api/guardrails.md#approvalrule) |

###### Returns

`Promise`\<[`ApprovalRequest`](/docs/api/guardrails.md#approvalrequest)\>

##### getPending()

```ts
getPending(): ApprovalRequest[];
```

Defined in: [shared/utils/src/guardrails/index.ts:291](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/guardrails/index.ts#L291)

Get pending requests

###### Returns

[`ApprovalRequest`](/docs/api/guardrails.md#approvalrequest)[]

##### isApproved()

```ts
isApproved(requestId: string): boolean;
```

Defined in: [shared/utils/src/guardrails/index.ts:259](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/guardrails/index.ts#L259)

Check if request is approved

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `requestId` | `string` |

###### Returns

`boolean`

##### onApprovalRequest()

```ts
onApprovalRequest(handler: ApprovalHandler): void;
```

Defined in: [shared/utils/src/guardrails/index.ts:299](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/guardrails/index.ts#L299)

Register approval handler

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `handler` | [`ApprovalHandler`](/docs/api/guardrails.md#approvalhandler) |

###### Returns

`void`

##### reject()

```ts
reject(requestId: string, _rejecter: string): boolean;
```

Defined in: [shared/utils/src/guardrails/index.ts:246](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/guardrails/index.ts#L246)

Reject an approval request

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `requestId` | `string` |
| `_rejecter` | `string` |

###### Returns

`boolean`

##### waitForApproval()

```ts
waitForApproval(requestId: string, timeoutMs: number): Promise<boolean>;
```

Defined in: [shared/utils/src/guardrails/index.ts:267](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/guardrails/index.ts#L267)

Wait for approval with timeout

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `requestId` | `string` |
| `timeoutMs` | `number` |

###### Returns

`Promise`\<`boolean`\>

## Interfaces

### AgentAction

Defined in: [shared/utils/src/guardrails/index.ts:45](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/guardrails/index.ts#L45)

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="amount"></a> `amount?` | `bigint` | Amount in wei/smallest unit | [shared/utils/src/guardrails/index.ts:51](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/guardrails/index.ts#L51) |
| <a id="contract"></a> `contract?` | `string` | Contract to interact with | [shared/utils/src/guardrails/index.ts:59](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/guardrails/index.ts#L59) |
| <a id="destinationchain"></a> `destinationChain?` | `string` | Destination chain | [shared/utils/src/guardrails/index.ts:57](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/guardrails/index.ts#L57) |
| <a id="function"></a> `function?` | `string` | Function to call | [shared/utils/src/guardrails/index.ts:61](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/guardrails/index.ts#L61) |
| <a id="metadata"></a> `metadata?` | `Record`\<`string`, `unknown`\> | Additional metadata | [shared/utils/src/guardrails/index.ts:63](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/guardrails/index.ts#L63) |
| <a id="sourcechain"></a> `sourceChain?` | `string` | Source chain | [shared/utils/src/guardrails/index.ts:55](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/guardrails/index.ts#L55) |
| <a id="to"></a> `to?` | `string` | Target address | [shared/utils/src/guardrails/index.ts:53](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/guardrails/index.ts#L53) |
| <a id="token"></a> `token?` | `string` | Token involved | [shared/utils/src/guardrails/index.ts:49](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/guardrails/index.ts#L49) |
| <a id="type"></a> `type` | \| `"sign"` \| `"transfer"` \| `"swap"` \| `"approve"` \| `"stake"` \| `"unstake"` \| `"bridge"` \| `"execute"` | Action type | [shared/utils/src/guardrails/index.ts:47](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/guardrails/index.ts#L47) |

***

### ApprovalRequest

Defined in: [shared/utils/src/guardrails/index.ts:66](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/guardrails/index.ts#L66)

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="action"></a> `action` | [`AgentAction`](/docs/api/guardrails.md#agentaction) | Action requiring approval | [shared/utils/src/guardrails/index.ts:70](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/guardrails/index.ts#L70) |
| <a id="approvals"></a> `approvals` | `string`[] | Current approvals | [shared/utils/src/guardrails/index.ts:76](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/guardrails/index.ts#L76) |
| <a id="createdat"></a> `createdAt` | `Date` | Request timestamp | [shared/utils/src/guardrails/index.ts:78](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/guardrails/index.ts#L78) |
| <a id="expiresat"></a> `expiresAt` | `Date` | Expiry timestamp | [shared/utils/src/guardrails/index.ts:80](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/guardrails/index.ts#L80) |
| <a id="id"></a> `id` | `string` | Unique request ID | [shared/utils/src/guardrails/index.ts:68](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/guardrails/index.ts#L68) |
| <a id="requiredapprovals"></a> `requiredApprovals` | `number` | Required approvals | [shared/utils/src/guardrails/index.ts:74](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/guardrails/index.ts#L74) |
| <a id="rule"></a> `rule` | `string` | Rule that triggered approval | [shared/utils/src/guardrails/index.ts:72](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/guardrails/index.ts#L72) |
| <a id="status"></a> `status` | `"pending"` \| `"approved"` \| `"rejected"` \| `"expired"` | Status | [shared/utils/src/guardrails/index.ts:82](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/guardrails/index.ts#L82) |

***

### ApprovalRule

Defined in: [shared/utils/src/guardrails/index.ts:32](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/guardrails/index.ts#L32)

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="approvers"></a> `approvers` | `string`[] | Approvers required | [shared/utils/src/guardrails/index.ts:38](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/guardrails/index.ts#L38) |
| <a id="condition"></a> `condition` | (`action`: [`AgentAction`](/docs/api/guardrails.md#agentaction)) => `boolean` | Condition for when approval is needed | [shared/utils/src/guardrails/index.ts:36](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/guardrails/index.ts#L36) |
| <a id="name"></a> `name` | `string` | Rule name | [shared/utils/src/guardrails/index.ts:34](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/guardrails/index.ts#L34) |
| <a id="requiredapprovals-1"></a> `requiredApprovals` | `number` | Number of approvals needed | [shared/utils/src/guardrails/index.ts:40](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/guardrails/index.ts#L40) |
| <a id="timeout"></a> `timeout` | `number` | Timeout for approval (ms) | [shared/utils/src/guardrails/index.ts:42](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/guardrails/index.ts#L42) |

***

### GuardrailCheckResult

Defined in: [shared/utils/src/guardrails/index.ts:104](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/guardrails/index.ts#L104)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="allowed"></a> `allowed` | `boolean` | [shared/utils/src/guardrails/index.ts:105](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/guardrails/index.ts#L105) |
| <a id="approvalrequest-1"></a> `approvalRequest?` | [`ApprovalRequest`](/docs/api/guardrails.md#approvalrequest) | [shared/utils/src/guardrails/index.ts:108](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/guardrails/index.ts#L108) |
| <a id="reason"></a> `reason?` | `string` | [shared/utils/src/guardrails/index.ts:106](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/guardrails/index.ts#L106) |
| <a id="requiresapproval"></a> `requiresApproval?` | `boolean` | [shared/utils/src/guardrails/index.ts:107](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/guardrails/index.ts#L107) |

***

### GuardrailConfig

Defined in: [shared/utils/src/guardrails/index.ts:85](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/guardrails/index.ts#L85)

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="allowedcontracts"></a> `allowedContracts` | `Set`\<`string`\> | Allowed contracts (if empty, all allowed) | [shared/utils/src/guardrails/index.ts:95](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/guardrails/index.ts#L95) |
| <a id="approvalrules"></a> `approvalRules` | [`ApprovalRule`](/docs/api/guardrails.md#approvalrule)[] | Approval rules | [shared/utils/src/guardrails/index.ts:91](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/guardrails/index.ts#L91) |
| <a id="blockedaddresses"></a> `blockedAddresses` | `Set`\<`string`\> | Blocked addresses | [shared/utils/src/guardrails/index.ts:93](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/guardrails/index.ts#L93) |
| <a id="dryrun"></a> `dryRun` | `boolean` | Dry run mode (log but don't execute) | [shared/utils/src/guardrails/index.ts:101](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/guardrails/index.ts#L101) |
| <a id="killswitchenabled"></a> `killSwitchEnabled` | `boolean` | Enable kill switch | [shared/utils/src/guardrails/index.ts:87](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/guardrails/index.ts#L87) |
| <a id="maxgasprice"></a> `maxGasPrice?` | `bigint` | Maximum gas price in gwei | [shared/utils/src/guardrails/index.ts:97](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/guardrails/index.ts#L97) |
| <a id="maxslippage"></a> `maxSlippage?` | `number` | Maximum slippage percentage | [shared/utils/src/guardrails/index.ts:99](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/guardrails/index.ts#L99) |
| <a id="spendinglimits"></a> `spendingLimits` | [`SpendingLimit`](/docs/api/guardrails.md#spendinglimit)[] | Spending limits by token | [shared/utils/src/guardrails/index.ts:89](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/guardrails/index.ts#L89) |

***

### SpendingLimit

Defined in: [shared/utils/src/guardrails/index.ts:17](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/guardrails/index.ts#L17)

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="decimals"></a> `decimals` | `number` | Token decimals | [shared/utils/src/guardrails/index.ts:29](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/guardrails/index.ts#L29) |
| <a id="perday"></a> `perDay` | `bigint` | Maximum amount per day | [shared/utils/src/guardrails/index.ts:23](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/guardrails/index.ts#L23) |
| <a id="perhour"></a> `perHour` | `bigint` | Maximum amount per hour | [shared/utils/src/guardrails/index.ts:21](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/guardrails/index.ts#L21) |
| <a id="pertransaction"></a> `perTransaction` | `bigint` | Maximum amount per transaction | [shared/utils/src/guardrails/index.ts:19](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/guardrails/index.ts#L19) |
| <a id="perweek"></a> `perWeek` | `bigint` | Maximum amount per week | [shared/utils/src/guardrails/index.ts:25](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/guardrails/index.ts#L25) |
| <a id="token-1"></a> `token` | `string` | Token symbol (e.g., 'ETH', 'USDC') | [shared/utils/src/guardrails/index.ts:27](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/guardrails/index.ts#L27) |

## Type Aliases

### ApprovalHandler()

```ts
type ApprovalHandler = (request: ApprovalRequest) => Promise<boolean>;
```

Defined in: [shared/utils/src/guardrails/index.ts:169](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/guardrails/index.ts#L169)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `request` | [`ApprovalRequest`](/docs/api/guardrails.md#approvalrequest) |

#### Returns

`Promise`\<`boolean`\>

## Functions

### createDefaultGuardrails()

```ts
function createDefaultGuardrails(): AgentGuardrails;
```

Defined in: [shared/utils/src/guardrails/index.ts:609](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/guardrails/index.ts#L609)

Create guardrails with sensible defaults

#### Returns

[`AgentGuardrails`](/docs/api/guardrails.md#agentguardrails)

***

### createStrictGuardrails()

```ts
function createStrictGuardrails(): AgentGuardrails;
```

Defined in: [shared/utils/src/guardrails/index.ts:665](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/guardrails/index.ts#L665)

Create strict guardrails for production

#### Returns

[`AgentGuardrails`](/docs/api/guardrails.md#agentguardrails)

***

### createTestGuardrails()

```ts
function createTestGuardrails(): AgentGuardrails;
```

Defined in: [shared/utils/src/guardrails/index.ts:704](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/guardrails/index.ts#L704)

Create test guardrails (permissive, with logging)

#### Returns

[`AgentGuardrails`](/docs/api/guardrails.md#agentguardrails)
