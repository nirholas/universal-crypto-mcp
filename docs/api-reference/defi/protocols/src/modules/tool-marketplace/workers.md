[**Universal Crypto MCP API Reference v1.0.0**](../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/modules/tool-marketplace/workers

# defi/protocols/src/modules/tool-marketplace/workers

## Classes

### VerificationWorkerManager

Defined in: [defi/protocols/src/modules/tool-marketplace/workers.ts:73](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/workers.ts#L73)

Verification Worker Manager
Manages background workers for periodic verification tasks

#### Constructors

##### Constructor

```ts
new VerificationWorkerManager(config: Partial<WorkerConfig>): VerificationWorkerManager;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/workers.ts:77](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/workers.ts#L77)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `config` | `Partial`\<[`WorkerConfig`](/docs/api/defi/protocols/src/modules/tool-marketplace/workers.md#workerconfig)\> |

###### Returns

[`VerificationWorkerManager`](/docs/api/defi/protocols/src/modules/tool-marketplace/workers.md#verificationworkermanager)

#### Methods

##### addJob()

```ts
addJob(
   toolId: string, 
   type: "full" | "security" | "endpoint" | "schema", 
   priority: number): VerificationJob;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/workers.ts:396](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/workers.ts#L396)

Add a job to the queue

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `toolId` | `string` | `undefined` |
| `type` | `"full"` \| `"security"` \| `"endpoint"` \| `"schema"` | `undefined` |
| `priority` | `number` | `0` |

###### Returns

[`VerificationJob`](/docs/api/defi/protocols/src/modules/tool-marketplace/verification/types.md#verificationjob)

##### getJob()

```ts
getJob(jobId: string): 
  | VerificationJob
  | null;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/workers.ts:420](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/workers.ts#L420)

Get job status

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `jobId` | `string` |

###### Returns

  \| [`VerificationJob`](/docs/api/defi/protocols/src/modules/tool-marketplace/verification/types.md#verificationjob)
  \| `null`

##### getPendingJobs()

```ts
getPendingJobs(): VerificationJob[];
```

Defined in: [defi/protocols/src/modules/tool-marketplace/workers.ts:427](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/workers.ts#L427)

Get all pending jobs

###### Returns

[`VerificationJob`](/docs/api/defi/protocols/src/modules/tool-marketplace/verification/types.md#verificationjob)[]

##### getStats()

```ts
getStats(): {
  pendingJobs: number;
  registeredTools: number;
  registeredWebhooks: number;
  running: boolean;
  workers: string[];
};
```

Defined in: [defi/protocols/src/modules/tool-marketplace/workers.ts:436](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/workers.ts#L436)

Get worker statistics

###### Returns

```ts
{
  pendingJobs: number;
  registeredTools: number;
  registeredWebhooks: number;
  running: boolean;
  workers: string[];
}
```

| Name | Type | Defined in |
| :------ | :------ | :------ |
| `pendingJobs` | `number` | [defi/protocols/src/modules/tool-marketplace/workers.ts:440](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/workers.ts#L440) |
| `registeredTools` | `number` | [defi/protocols/src/modules/tool-marketplace/workers.ts:438](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/workers.ts#L438) |
| `registeredWebhooks` | `number` | [defi/protocols/src/modules/tool-marketplace/workers.ts:439](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/workers.ts#L439) |
| `running` | `boolean` | [defi/protocols/src/modules/tool-marketplace/workers.ts:437](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/workers.ts#L437) |
| `workers` | `string`[] | [defi/protocols/src/modules/tool-marketplace/workers.ts:441](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/workers.ts#L441) |

##### registerTool()

```ts
registerTool(toolId: string, endpoint: string): void;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/workers.ts:305](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/workers.ts#L305)

Register a tool for monitoring

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |
| `endpoint` | `string` |

###### Returns

`void`

##### registerWebhook()

```ts
registerWebhook(
   toolId: string, 
   ownerAddress: `0x${string}`, 
   webhookUrl: string, 
   events: VerificationEventType[]): VerificationWebhook;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/workers.ts:321](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/workers.ts#L321)

Register a webhook for notifications

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |
| `ownerAddress` | `` `0x${string}` `` |
| `webhookUrl` | `string` |
| `events` | [`VerificationEventType`](/docs/api/defi/protocols/src/modules/tool-marketplace/verification/types.md#verificationeventtype)[] |

###### Returns

[`VerificationWebhook`](/docs/api/defi/protocols/src/modules/tool-marketplace/verification/types.md#verificationwebhook)

##### start()

```ts
start(): void;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/workers.ts:84](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/workers.ts#L84)

Start all workers

###### Returns

`void`

##### stop()

```ts
stop(): void;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/workers.ts:118](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/workers.ts#L118)

Stop all workers

###### Returns

`void`

##### unregisterTool()

```ts
unregisterTool(toolId: string): void;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/workers.ts:313](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/workers.ts#L313)

Unregister a tool from monitoring

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `toolId` | `string` |

###### Returns

`void`

##### unregisterWebhook()

```ts
unregisterWebhook(webhookId: string): boolean;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/workers.ts:347](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/workers.ts#L347)

Unregister a webhook

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `webhookId` | `string` |

###### Returns

`boolean`

## Interfaces

### WorkerConfig

Defined in: [defi/protocols/src/modules/tool-marketplace/workers.ts:21](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/workers.ts#L21)

Queue configuration

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="arbitrationinterval"></a> `arbitrationInterval` | `number` | Arbitration processing interval (ms) - default 1 hour | [defi/protocols/src/modules/tool-marketplace/workers.ts:31](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/workers.ts#L31) |
| <a id="disputeprocessinterval"></a> `disputeProcessInterval` | `number` | Dispute processing interval (ms) - default 15 minutes | [defi/protocols/src/modules/tool-marketplace/workers.ts:29](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/workers.ts#L29) |
| <a id="enabled"></a> `enabled` | `boolean` | Enable workers | [defi/protocols/src/modules/tool-marketplace/workers.ts:33](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/workers.ts#L33) |
| <a id="endpointcheckinterval"></a> `endpointCheckInterval` | `number` | Endpoint check interval (ms) - default 5 minutes | [defi/protocols/src/modules/tool-marketplace/workers.ts:23](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/workers.ts#L23) |
| <a id="reputationinterval"></a> `reputationInterval` | `number` | Reputation recalculation interval (ms) - default 1 hour | [defi/protocols/src/modules/tool-marketplace/workers.ts:27](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/workers.ts#L27) |
| <a id="securityscaninterval"></a> `securityScanInterval` | `number` | Security scan interval (ms) - default 24 hours | [defi/protocols/src/modules/tool-marketplace/workers.ts:25](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/workers.ts#L25) |

## Variables

### workerManager

```ts
const workerManager: VerificationWorkerManager;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/workers.ts:456](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/workers.ts#L456)

Singleton instance
