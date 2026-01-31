[**Universal Crypto MCP API Reference v1.0.0**](index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / hitl

# hitl

Human-in-the-Loop (HITL) System

Provides approval workflows for agent actions requiring human oversight.

## Author

nich <nich@nichxbt.com>

## Classes

### HITLManager

Defined in: [shared/utils/src/hitl/index.ts:273](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/hitl/index.ts#L273)

Human-in-the-Loop Manager

Manages approval workflows for agent actions requiring human oversight.

#### Example

```typescript
const hitl = new HITLManager({
  defaultTimeout: 3600000, // 1 hour
  maxPendingPerAgent: 10,
  notificationChannels: [
    { type: 'console', config: {}, enabled: true },
    { type: 'slack', config: { webhookUrl: 'https://...' }, enabled: true },
  ],
  autoRejectOnTimeout: true,
  escalationRules: [],
});

// Request approval
const request = await hitl.requestApproval({
  agentId: 'trading-agent',
  action: { type: 'transfer', token: 'ETH', amount: BigInt('5000000000000000000') },
  description: 'Transfer 5 ETH to external wallet',
  risk: 'high',
});

// Wait for human decision
const approved = await hitl.waitForDecision(request.id, 60000);
if (approved) {
  // Proceed with action
}
```

#### Constructors

##### Constructor

```ts
new HITLManager(config: Partial<HITLConfig>): HITLManager;
```

Defined in: [shared/utils/src/hitl/index.ts:281](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/hitl/index.ts#L281)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `config` | `Partial`\<[`HITLConfig`](/docs/api/hitl.md#hitlconfig)\> |

###### Returns

[`HITLManager`](/docs/api/hitl.md#hitlmanager)

#### Methods

##### approve()

```ts
approve(
   requestId: string, 
   reviewer: string, 
notes?: string): Promise<boolean>;
```

Defined in: [shared/utils/src/hitl/index.ts:362](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/hitl/index.ts#L362)

Approve a request

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `requestId` | `string` |
| `reviewer` | `string` |
| `notes?` | `string` |

###### Returns

`Promise`\<`boolean`\>

##### cancel()

```ts
cancel(requestId: string): Promise<boolean>;
```

Defined in: [shared/utils/src/hitl/index.ts:431](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/hitl/index.ts#L431)

Cancel a request (by the agent)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `requestId` | `string` |

###### Returns

`Promise`\<`boolean`\>

##### clear()

```ts
clear(): void;
```

Defined in: [shared/utils/src/hitl/index.ts:592](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/hitl/index.ts#L592)

Clear all requests (for testing)

###### Returns

`void`

##### getHistory()

```ts
getHistory(limit: number): HITLRequest[];
```

Defined in: [shared/utils/src/hitl/index.ts:491](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/hitl/index.ts#L491)

Get request history

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `limit` | `number` | `100` |

###### Returns

[`HITLRequest`](/docs/api/hitl.md#hitlrequest)[]

##### getPending()

```ts
getPending(): HITLRequest[];
```

Defined in: [shared/utils/src/hitl/index.ts:476](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/hitl/index.ts#L476)

Get all pending requests

###### Returns

[`HITLRequest`](/docs/api/hitl.md#hitlrequest)[]

##### getPendingForAgent()

```ts
getPendingForAgent(agentId: string): HITLRequest[];
```

Defined in: [shared/utils/src/hitl/index.ts:484](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/hitl/index.ts#L484)

Get pending requests for an agent

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `agentId` | `string` |

###### Returns

[`HITLRequest`](/docs/api/hitl.md#hitlrequest)[]

##### getRequest()

```ts
getRequest(requestId: string): HITLRequest | undefined;
```

Defined in: [shared/utils/src/hitl/index.ts:469](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/hitl/index.ts#L469)

Get request by ID

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `requestId` | `string` |

###### Returns

[`HITLRequest`](/docs/api/hitl.md#hitlrequest) \| `undefined`

##### onEvent()

```ts
onEvent(handler: HITLEventHandler): void;
```

Defined in: [shared/utils/src/hitl/index.ts:500](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/hitl/index.ts#L500)

Register event handler

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `handler` | [`HITLEventHandler`](/docs/api/hitl.md#hitleventhandler) |

###### Returns

`void`

##### reject()

```ts
reject(
   requestId: string, 
   reviewer: string, 
notes?: string): Promise<boolean>;
```

Defined in: [shared/utils/src/hitl/index.ts:396](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/hitl/index.ts#L396)

Reject a request

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `requestId` | `string` |
| `reviewer` | `string` |
| `notes?` | `string` |

###### Returns

`Promise`\<`boolean`\>

##### requestApproval()

```ts
requestApproval(params: {
  action: AgentAction;
  agentId: string;
  context?: Record<string, unknown>;
  description: string;
  risk: "low" | "medium" | "high" | "critical";
  timeout?: number;
}): Promise<HITLRequest>;
```

Defined in: [shared/utils/src/hitl/index.ts:308](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/hitl/index.ts#L308)

Request human approval for an action

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `params` | \{ `action`: [`AgentAction`](/docs/api/guardrails.md#agentaction); `agentId`: `string`; `context?`: `Record`\<`string`, `unknown`\>; `description`: `string`; `risk`: `"low"` \| `"medium"` \| `"high"` \| `"critical"`; `timeout?`: `number`; \} |
| `params.action` | [`AgentAction`](/docs/api/guardrails.md#agentaction) |
| `params.agentId` | `string` |
| `params.context?` | `Record`\<`string`, `unknown`\> |
| `params.description` | `string` |
| `params.risk` | `"low"` \| `"medium"` \| `"high"` \| `"critical"` |
| `params.timeout?` | `number` |

###### Returns

`Promise`\<[`HITLRequest`](/docs/api/hitl.md#hitlrequest)\>

##### waitForDecision()

```ts
waitForDecision(requestId: string, pollInterval: number): Promise<boolean>;
```

Defined in: [shared/utils/src/hitl/index.ts:452](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/hitl/index.ts#L452)

Wait for a decision on a request

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `requestId` | `string` | `undefined` |
| `pollInterval` | `number` | `1000` |

###### Returns

`Promise`\<`boolean`\>

## Interfaces

### EscalationRule

Defined in: [shared/utils/src/hitl/index.ts:63](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/hitl/index.ts#L63)

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="afterms"></a> `afterMs` | `number` | Time after which to escalate (ms) | [shared/utils/src/hitl/index.ts:67](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/hitl/index.ts#L67) |
| <a id="message"></a> `message` | `string` | Escalation message | [shared/utils/src/hitl/index.ts:71](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/hitl/index.ts#L71) |
| <a id="name"></a> `name` | `string` | Rule name | [shared/utils/src/hitl/index.ts:65](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/hitl/index.ts#L65) |
| <a id="notifychannels"></a> `notifyChannels` | `string`[] | Additional notifiers to alert | [shared/utils/src/hitl/index.ts:69](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/hitl/index.ts#L69) |

***

### HITLConfig

Defined in: [shared/utils/src/hitl/index.ts:44](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/hitl/index.ts#L44)

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="autorejectontimeout"></a> `autoRejectOnTimeout` | `boolean` | Auto-reject after timeout | [shared/utils/src/hitl/index.ts:52](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/hitl/index.ts#L52) |
| <a id="defaulttimeout"></a> `defaultTimeout` | `number` | Default timeout for requests (ms) | [shared/utils/src/hitl/index.ts:46](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/hitl/index.ts#L46) |
| <a id="escalationrules"></a> `escalationRules` | [`EscalationRule`](/docs/api/hitl.md#escalationrule)[] | Escalation rules | [shared/utils/src/hitl/index.ts:54](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/hitl/index.ts#L54) |
| <a id="maxpendingperagent"></a> `maxPendingPerAgent` | `number` | Maximum pending requests per agent | [shared/utils/src/hitl/index.ts:48](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/hitl/index.ts#L48) |
| <a id="notificationchannels"></a> `notificationChannels` | [`NotificationChannel`](/docs/api/hitl.md#notificationchannel)[] | Notification channels | [shared/utils/src/hitl/index.ts:50](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/hitl/index.ts#L50) |

***

### HITLRequest

Defined in: [shared/utils/src/hitl/index.ts:17](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/hitl/index.ts#L17)

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="action"></a> `action` | [`AgentAction`](/docs/api/guardrails.md#agentaction) | Action requiring approval | [shared/utils/src/hitl/index.ts:23](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/hitl/index.ts#L23) |
| <a id="agentid"></a> `agentId` | `string` | Agent that initiated the request | [shared/utils/src/hitl/index.ts:21](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/hitl/index.ts#L21) |
| <a id="context"></a> `context?` | `Record`\<`string`, `unknown`\> | Additional context for review | [shared/utils/src/hitl/index.ts:41](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/hitl/index.ts#L41) |
| <a id="createdat"></a> `createdAt` | `Date` | Request timestamp | [shared/utils/src/hitl/index.ts:29](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/hitl/index.ts#L29) |
| <a id="description"></a> `description` | `string` | Human-readable description | [shared/utils/src/hitl/index.ts:25](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/hitl/index.ts#L25) |
| <a id="expiresat"></a> `expiresAt` | `Date` | Expiry timestamp | [shared/utils/src/hitl/index.ts:31](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/hitl/index.ts#L31) |
| <a id="id"></a> `id` | `string` | Unique request ID | [shared/utils/src/hitl/index.ts:19](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/hitl/index.ts#L19) |
| <a id="notes"></a> `notes?` | `string` | Reviewer notes | [shared/utils/src/hitl/index.ts:39](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/hitl/index.ts#L39) |
| <a id="reviewedat"></a> `reviewedAt?` | `Date` | Review timestamp | [shared/utils/src/hitl/index.ts:37](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/hitl/index.ts#L37) |
| <a id="reviewer"></a> `reviewer?` | `string` | Reviewer who processed the request | [shared/utils/src/hitl/index.ts:35](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/hitl/index.ts#L35) |
| <a id="risk"></a> `risk` | `"low"` \| `"medium"` \| `"high"` \| `"critical"` | Risk assessment | [shared/utils/src/hitl/index.ts:27](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/hitl/index.ts#L27) |
| <a id="status"></a> `status` | `"pending"` \| `"approved"` \| `"rejected"` \| `"expired"` \| `"cancelled"` | Status | [shared/utils/src/hitl/index.ts:33](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/hitl/index.ts#L33) |

***

### NotificationChannel

Defined in: [shared/utils/src/hitl/index.ts:57](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/hitl/index.ts#L57)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="config"></a> `config` | `Record`\<`string`, `unknown`\> | [shared/utils/src/hitl/index.ts:59](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/hitl/index.ts#L59) |
| <a id="enabled"></a> `enabled` | `boolean` | [shared/utils/src/hitl/index.ts:60](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/hitl/index.ts#L60) |
| <a id="type"></a> `type` | `"webhook"` \| `"email"` \| `"slack"` \| `"discord"` \| `"telegram"` \| `"console"` | [shared/utils/src/hitl/index.ts:58](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/hitl/index.ts#L58) |

## Type Aliases

### HITLEventHandler()

```ts
type HITLEventHandler = (event: HITLEventType, request: HITLRequest) => void | Promise<void>;
```

Defined in: [shared/utils/src/hitl/index.ts:82](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/hitl/index.ts#L82)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `event` | [`HITLEventType`](/docs/api/hitl.md#hitleventtype) |
| `request` | [`HITLRequest`](/docs/api/hitl.md#hitlrequest) |

#### Returns

`void` \| `Promise`\<`void`\>

***

### HITLEventType

```ts
type HITLEventType = 
  | "request:created"
  | "request:approved"
  | "request:rejected"
  | "request:expired"
  | "request:cancelled"
  | "request:escalated";
```

Defined in: [shared/utils/src/hitl/index.ts:74](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/hitl/index.ts#L74)

## Functions

### createConsoleHITL()

```ts
function createConsoleHITL(): HITLManager;
```

Defined in: [shared/utils/src/hitl/index.ts:607](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/hitl/index.ts#L607)

Create HITL manager with console notifications only

#### Returns

[`HITLManager`](/docs/api/hitl.md#hitlmanager)

***

### createSlackHITL()

```ts
function createSlackHITL(webhookUrl: string, channel?: string): HITLManager;
```

Defined in: [shared/utils/src/hitl/index.ts:651](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/hitl/index.ts#L651)

Create HITL manager with Slack notifications

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `webhookUrl` | `string` |
| `channel?` | `string` |

#### Returns

[`HITLManager`](/docs/api/hitl.md#hitlmanager)

***

### createWebhookHITL()

```ts
function createWebhookHITL(webhookUrl: string): HITLManager;
```

Defined in: [shared/utils/src/hitl/index.ts:622](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/hitl/index.ts#L622)

Create HITL manager with webhook notifications

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `webhookUrl` | `string` |

#### Returns

[`HITLManager`](/docs/api/hitl.md#hitlmanager)

***

### requireHumanApproval()

```ts
function requireHumanApproval(hitl: HITLManager, options: {
  agentId: string;
  risk?: "low" | "medium" | "high" | "critical";
  timeout?: number;
}): <T>(_target: unknown, propertyKey: string, descriptor: TypedPropertyDescriptor<T>) => TypedPropertyDescriptor<T>;
```

Defined in: [shared/utils/src/hitl/index.ts:678](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/shared/utils/src/hitl/index.ts#L678)

Decorator to require human approval for a method

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `hitl` | [`HITLManager`](/docs/api/hitl.md#hitlmanager) |
| `options` | \{ `agentId`: `string`; `risk?`: `"low"` \| `"medium"` \| `"high"` \| `"critical"`; `timeout?`: `number`; \} |
| `options.agentId` | `string` |
| `options.risk?` | `"low"` \| `"medium"` \| `"high"` \| `"critical"` |
| `options.timeout?` | `number` |

#### Returns

```ts
<T>(
   _target: unknown, 
   propertyKey: string, 
descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T>;
```

##### Type Parameters

| Type Parameter |
| :------ |
| `T` *extends* (...`args`: `unknown`[]) => `Promise`\<`unknown`\> |

##### Parameters

| Parameter | Type |
| :------ | :------ |
| `_target` | `unknown` |
| `propertyKey` | `string` |
| `descriptor` | `TypedPropertyDescriptor`\<`T`\> |

##### Returns

`TypedPropertyDescriptor`\<`T`\>
