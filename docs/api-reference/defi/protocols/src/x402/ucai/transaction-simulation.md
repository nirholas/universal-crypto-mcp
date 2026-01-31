[**Universal Crypto MCP API Reference v1.0.0**](../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/x402/ucai/transaction-simulation

# defi/protocols/src/x402/ucai/transaction-simulation

## Classes

### TransactionSimulationService

Defined in: [defi/protocols/src/x402/ucai/transaction-simulation.ts:76](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/transaction-simulation.ts#L76)

Transaction Simulation Service

Simulates transactions before execution to preview outcomes,
catch errors, and analyze state changes.

#### Constructors

##### Constructor

```ts
new TransactionSimulationService(): TransactionSimulationService;
```

###### Returns

[`TransactionSimulationService`](/docs/api/defi/protocols/src/x402/ucai/transaction-simulation.md#transactionsimulationservice)

#### Methods

##### compareWithExecution()

```ts
compareWithExecution(simulation: SimulationResult, receipt: TransactionReceipt): Promise<{
  eventsMatch: boolean;
  gasDifference: bigint;
  gasMatch: boolean;
  warnings: string[];
}>;
```

Defined in: [defi/protocols/src/x402/ucai/transaction-simulation.ts:446](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/transaction-simulation.ts#L446)

Compare simulation with actual execution

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `simulation` | [`SimulationResult`](/docs/api/defi/protocols/src/x402/ucai/types.md#simulationresult) |
| `receipt` | `TransactionReceipt` |

###### Returns

`Promise`\<\{
  `eventsMatch`: `boolean`;
  `gasDifference`: `bigint`;
  `gasMatch`: `boolean`;
  `warnings`: `string`[];
\}\>

##### getPricing()

```ts
getPricing(): string;
```

Defined in: [defi/protocols/src/x402/ucai/transaction-simulation.ts:486](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/transaction-simulation.ts#L486)

Get simulation pricing

###### Returns

`string`

##### simulateBatch()

```ts
simulateBatch(requests: SimulationRequest[]): Promise<SimulationResult[]>;
```

Defined in: [defi/protocols/src/x402/ucai/transaction-simulation.ts:424](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/transaction-simulation.ts#L424)

Batch simulate multiple transactions

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `requests` | [`SimulationRequest`](/docs/api/defi/protocols/src/x402/ucai/types.md#simulationrequest)[] |

###### Returns

`Promise`\<[`SimulationResult`](/docs/api/defi/protocols/src/x402/ucai/types.md#simulationresult)[]\>

##### simulateTransaction()

```ts
simulateTransaction(request: SimulationRequest): Promise<SimulationResult>;
```

Defined in: [defi/protocols/src/x402/ucai/transaction-simulation.ts:85](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/transaction-simulation.ts#L85)

Simulate a transaction and return detailed results

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `request` | [`SimulationRequest`](/docs/api/defi/protocols/src/x402/ucai/types.md#simulationrequest) | Simulation request |

###### Returns

`Promise`\<[`SimulationResult`](/docs/api/defi/protocols/src/x402/ucai/types.md#simulationresult)\>

Simulation result with state changes, events, and transfers

## Functions

### getTransactionSimulationService()

```ts
function getTransactionSimulationService(): TransactionSimulationService;
```

Defined in: [defi/protocols/src/x402/ucai/transaction-simulation.ts:497](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/ucai/transaction-simulation.ts#L497)

Get or create transaction simulation service

#### Returns

[`TransactionSimulationService`](/docs/api/defi/protocols/src/x402/ucai/transaction-simulation.md#transactionsimulationservice)

## References

### default

Renames and re-exports [TransactionSimulationService](/docs/api/defi/protocols/src/x402/ucai/transaction-simulation.md#transactionsimulationservice)
