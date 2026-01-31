[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/modules/tool-marketplace/disputes/auto-resolver

# defi/protocols/src/modules/tool-marketplace/disputes/auto-resolver

## Classes

### AutoResolver

Defined in: [defi/protocols/src/modules/tool-marketplace/disputes/auto-resolver.ts:98](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/auto-resolver.ts#L98)

Auto Resolver Service
Automatically resolves disputes based on objective criteria

#### Constructors

##### Constructor

```ts
new AutoResolver(config: Partial<AutoResolverConfig>): AutoResolver;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/disputes/auto-resolver.ts:101](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/auto-resolver.ts#L101)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `config` | `Partial`\<[`AutoResolverConfig`](/docs/api/defi/protocols/src/modules/tool-marketplace/disputes/auto-resolver.md#autoresolverconfig)\> |

###### Returns

[`AutoResolver`](/docs/api/defi/protocols/src/modules/tool-marketplace/disputes/auto-resolver.md#autoresolver)

#### Methods

##### addRule()

```ts
addRule(rule: Omit<AutoResolutionRule, "id">): AutoResolutionRule;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/disputes/auto-resolver.ts:314](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/auto-resolver.ts#L314)

Add a custom auto-resolution rule

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `rule` | `Omit`\<[`AutoResolutionRule`](/docs/api/defi/protocols/src/modules/tool-marketplace/disputes/types.md#autoresolutionrule), `"id"`\> |

###### Returns

[`AutoResolutionRule`](/docs/api/defi/protocols/src/modules/tool-marketplace/disputes/types.md#autoresolutionrule)

##### deleteRule()

```ts
deleteRule(ruleId: string): boolean;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/disputes/auto-resolver.ts:346](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/auto-resolver.ts#L346)

Delete a rule

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `ruleId` | `string` |

###### Returns

`boolean`

##### getResolutionLog()

```ts
getResolutionLog(limit: number): {
  disputeId: string;
  outcome: DisputeOutcome;
  ruleId: string;
  timestamp: number;
}[];
```

Defined in: [defi/protocols/src/modules/tool-marketplace/disputes/auto-resolver.ts:385](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/auto-resolver.ts#L385)

Get resolution log

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `limit` | `number` | `100` |

###### Returns

\{
  `disputeId`: `string`;
  `outcome`: [`DisputeOutcome`](/docs/api/defi/protocols/src/modules/tool-marketplace/disputes/types.md#disputeoutcome-1);
  `ruleId`: `string`;
  `timestamp`: `number`;
\}[]

##### getRule()

```ts
getRule(ruleId: string): 
  | AutoResolutionRule
  | null;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/disputes/auto-resolver.ts:364](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/auto-resolver.ts#L364)

Get rule by ID

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `ruleId` | `string` |

###### Returns

  \| [`AutoResolutionRule`](/docs/api/defi/protocols/src/modules/tool-marketplace/disputes/types.md#autoresolutionrule)
  \| `null`

##### getRules()

```ts
getRules(): AutoResolutionRule[];
```

Defined in: [defi/protocols/src/modules/tool-marketplace/disputes/auto-resolver.ts:357](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/auto-resolver.ts#L357)

Get all rules

###### Returns

[`AutoResolutionRule`](/docs/api/defi/protocols/src/modules/tool-marketplace/disputes/types.md#autoresolutionrule)[]

##### getStats()

```ts
getStats(): {
  byOutcome: Record<DisputeOutcome, number>;
  byRule: Record<string, number>;
  last24hCount: number;
  totalAutoResolved: number;
};
```

Defined in: [defi/protocols/src/modules/tool-marketplace/disputes/auto-resolver.ts:392](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/auto-resolver.ts#L392)

Get auto-resolution statistics

###### Returns

```ts
{
  byOutcome: Record<DisputeOutcome, number>;
  byRule: Record<string, number>;
  last24hCount: number;
  totalAutoResolved: number;
}
```

| Name | Type | Defined in |
| :------ | :------ | :------ |
| `byOutcome` | `Record`\<[`DisputeOutcome`](/docs/api/defi/protocols/src/modules/tool-marketplace/disputes/types.md#disputeoutcome-1), `number`\> | [defi/protocols/src/modules/tool-marketplace/disputes/auto-resolver.ts:395](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/auto-resolver.ts#L395) |
| `byRule` | `Record`\<`string`, `number`\> | [defi/protocols/src/modules/tool-marketplace/disputes/auto-resolver.ts:394](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/auto-resolver.ts#L394) |
| `last24hCount` | `number` | [defi/protocols/src/modules/tool-marketplace/disputes/auto-resolver.ts:396](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/auto-resolver.ts#L396) |
| `totalAutoResolved` | `number` | [defi/protocols/src/modules/tool-marketplace/disputes/auto-resolver.ts:393](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/auto-resolver.ts#L393) |

##### processOpenDisputes()

```ts
processOpenDisputes(): Promise<{
  processed: number;
  resolved: number;
}>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/disputes/auto-resolver.ts:432](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/auto-resolver.ts#L432)

Process all open disputes for auto-resolution

###### Returns

`Promise`\<\{
  `processed`: `number`;
  `resolved`: `number`;
\}\>

##### setRuleActive()

```ts
setRuleActive(ruleId: string, active: boolean): boolean;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/disputes/auto-resolver.ts:371](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/auto-resolver.ts#L371)

Enable/disable a rule

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `ruleId` | `string` |
| `active` | `boolean` |

###### Returns

`boolean`

##### tryAutoResolve()

```ts
tryAutoResolve(dispute: Dispute): Promise<{
  outcome?: DisputeOutcome;
  reason?: string;
  resolved: boolean;
  ruleApplied?: string;
}>;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/disputes/auto-resolver.ts:108](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/auto-resolver.ts#L108)

Attempt to auto-resolve a dispute

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `dispute` | [`Dispute`](/docs/api/defi/protocols/src/modules/tool-marketplace/disputes/types.md#dispute) |

###### Returns

`Promise`\<\{
  `outcome?`: [`DisputeOutcome`](/docs/api/defi/protocols/src/modules/tool-marketplace/disputes/types.md#disputeoutcome-1);
  `reason?`: `string`;
  `resolved`: `boolean`;
  `ruleApplied?`: `string`;
\}\>

##### updateRule()

```ts
updateRule(ruleId: string, updates: Partial<Omit<AutoResolutionRule, "id">>): 
  | AutoResolutionRule
  | null;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/disputes/auto-resolver.ts:329](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/auto-resolver.ts#L329)

Update a rule

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `ruleId` | `string` |
| `updates` | `Partial`\<`Omit`\<[`AutoResolutionRule`](/docs/api/defi/protocols/src/modules/tool-marketplace/disputes/types.md#autoresolutionrule), `"id"`\>\> |

###### Returns

  \| [`AutoResolutionRule`](/docs/api/defi/protocols/src/modules/tool-marketplace/disputes/types.md#autoresolutionrule)
  \| `null`

## Interfaces

### AutoResolverConfig

Defined in: [defi/protocols/src/modules/tool-marketplace/disputes/auto-resolver.ts:17](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/auto-resolver.ts#L17)

Configuration for auto resolution

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="enabled"></a> `enabled` | `boolean` | Enable auto-resolution | [defi/protocols/src/modules/tool-marketplace/disputes/auto-resolver.ts:23](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/auto-resolver.ts#L23) |
| <a id="minuptimerequired"></a> `minUptimeRequired` | `number` | Minimum uptime required (%) | [defi/protocols/src/modules/tool-marketplace/disputes/auto-resolver.ts:21](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/auto-resolver.ts#L21) |
| <a id="responsetimethreshold"></a> `responseTimeThreshold` | `number` | Response time threshold for auto-refund (ms) | [defi/protocols/src/modules/tool-marketplace/disputes/auto-resolver.ts:19](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/auto-resolver.ts#L19) |

## Variables

### autoResolver

```ts
const autoResolver: AutoResolver;
```

Defined in: [defi/protocols/src/modules/tool-marketplace/disputes/auto-resolver.ts:458](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/disputes/auto-resolver.ts#L458)

Singleton instance
