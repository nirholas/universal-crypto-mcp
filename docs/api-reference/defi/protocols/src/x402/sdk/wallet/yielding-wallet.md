[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/x402/sdk/wallet/yielding-wallet

# defi/protocols/src/x402/sdk/wallet/yielding-wallet

## Classes

### YieldingWallet

Defined in: [defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts:186](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts#L186)

YieldingWallet - Smart wallet that maximizes USDs yield

Key Features:
- Auto-converts all received payments to USDs
- Tracks yield earnings in real-time
- Projects future yield earnings
- Generates monthly yield reports
- Maintains gas reserves for transactions

#### Example

```typescript
const wallet = new YieldingWallet(publicClient, walletClient, 'arbitrum');

// Check yield
const projection = await wallet.projectYield();
console.log(`Monthly passive income: $${projection.monthlyPassiveIncome}`);

// Auto-convert received payment
await wallet.receiveAndConvert('0x...', '100.00', 'USDC');

// Generate monthly report
const report = await wallet.generateMonthlyReport(1, 2026);
```

#### Constructors

##### Constructor

```ts
new YieldingWallet(
   publicClient: {
}, 
   walletClient: 
  | {
}
  | undefined, 
   chain: X402Chain, 
   config: Partial<YieldingWalletConfig>): YieldingWallet;
```

Defined in: [defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts:192](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts#L192)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `publicClient` | \{ \} |
| `walletClient` | \| \{ \} \| `undefined` |
| `chain` | [`X402Chain`](/docs/api/defi/protocols/src/x402/sdk/types.md#x402chain) |
| `config` | `Partial`\<[`YieldingWalletConfig`](/docs/api/defi/protocols/src/x402/sdk/wallet/yielding-wallet.md#yieldingwalletconfig)\> |

###### Returns

[`YieldingWallet`](/docs/api/defi/protocols/src/x402/sdk/wallet/yielding-wallet.md#yieldingwallet)

#### Methods

##### calculateCompoundInterest()

```ts
static calculateCompoundInterest(
   principal: number, 
   apy: number, 
   days: number, 
   compoundFrequency: "daily" | "weekly" | "monthly" | "yearly"): number;
```

Defined in: [defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts:683](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts#L683)

Calculate compound interest

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `principal` | `number` | `undefined` |
| `apy` | `number` | `undefined` |
| `days` | `number` | `undefined` |
| `compoundFrequency` | `"daily"` \| `"weekly"` \| `"monthly"` \| `"yearly"` | `'daily'` |

###### Returns

`number`

##### calculateYieldToTarget()

```ts
calculateYieldToTarget(targetBalance: number): Promise<{
  additionalDepositNeeded: string;
  currentBalance: string;
  estimatedTime:   | {
     days: number;
     months: number;
     years: number;
   }
     | null;
  targetBalance: string;
  yieldNeeded: string;
}>;
```

Defined in: [defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts:425](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts#L425)

Calculate yield to reach a target balance

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `targetBalance` | `number` |

###### Returns

`Promise`\<\{
  `additionalDepositNeeded`: `string`;
  `currentBalance`: `string`;
  `estimatedTime`:   \| \{
     `days`: `number`;
     `months`: `number`;
     `years`: `number`;
   \}
     \| `null`;
  `targetBalance`: `string`;
  `yieldNeeded`: `string`;
\}\>

##### formatYield()

```ts
static formatYield(amount: string, period: "daily" | "monthly" | "annual"): string;
```

Defined in: [defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts:672](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts#L672)

Format yield for display

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `amount` | `string` |
| `period` | `"daily"` \| `"monthly"` \| `"annual"` |

###### Returns

`string`

##### generateMonthlyReport()

```ts
generateMonthlyReport(month: number, year: number): Promise<MonthlyYieldReport>;
```

Defined in: [defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts:464](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts#L464)

Generate a monthly yield report

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `month` | `number` |
| `year` | `number` |

###### Returns

`Promise`\<[`MonthlyYieldReport`](/docs/api/defi/protocols/src/x402/sdk/wallet/yielding-wallet.md#monthlyyieldreport)\>

##### getAddress()

```ts
getAddress(): `0x${string}` | undefined;
```

Defined in: [defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts:651](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts#L651)

Get wallet address

###### Returns

`` `0x${string}` `` \| `undefined`

##### getBalances()

```ts
getBalances(): Promise<WalletBalances>;
```

Defined in: [defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts:249](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts#L249)

Get comprehensive wallet balances

###### Returns

`Promise`\<[`WalletBalances`](/docs/api/defi/protocols/src/x402/sdk/wallet/yielding-wallet.md#walletbalances)\>

##### getChain()

```ts
getChain(): X402Chain;
```

Defined in: [defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts:658](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts#L658)

Get chain

###### Returns

[`X402Chain`](/docs/api/defi/protocols/src/x402/sdk/types.md#x402chain)

##### getConfig()

```ts
getConfig(): YieldingWalletConfig;
```

Defined in: [defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts:224](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts#L224)

Get current configuration

###### Returns

[`YieldingWalletConfig`](/docs/api/defi/protocols/src/x402/sdk/wallet/yielding-wallet.md#yieldingwalletconfig)

##### getUsdsBalance()

```ts
getUsdsBalance(): Promise<{
  annualYield: string;
  apy: string;
  balance: string;
  dailyYield: string;
  formattedBalance: string;
  monthlyYield: string;
}>;
```

Defined in: [defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts:311](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts#L311)

Get current USDs balance with yield info

###### Returns

`Promise`\<\{
  `annualYield`: `string`;
  `apy`: `string`;
  `balance`: `string`;
  `dailyYield`: `string`;
  `formattedBalance`: `string`;
  `monthlyYield`: `string`;
\}\>

##### getYieldHistory()

```ts
getYieldHistory(days: number): Promise<{
  averageDailyYield: string;
  effectiveAPY: string;
  endingBalance: string;
  period: string;
  startingBalance: string;
  totalYield: string;
}>;
```

Defined in: [defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts:529](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts#L529)

Get yield history summary

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `days` | `number` | `30` |

###### Returns

`Promise`\<\{
  `averageDailyYield`: `string`;
  `effectiveAPY`: `string`;
  `endingBalance`: `string`;
  `period`: `string`;
  `startingBalance`: `string`;
  `totalYield`: `string`;
\}\>

##### getYieldTracker()

```ts
getYieldTracker(): YieldTracker;
```

Defined in: [defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts:665](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts#L665)

Get underlying yield tracker

###### Returns

[`YieldTracker`](/docs/api/defi/protocols/src/x402/sdk/yield/tracker.md#yieldtracker)

##### projectYield()

```ts
projectYield(customBalance?: string): Promise<YieldProjection>;
```

Defined in: [defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts:363](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts#L363)

Project future yield earnings

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `customBalance?` | `string` |

###### Returns

`Promise`\<[`YieldProjection`](/docs/api/defi/protocols/src/x402/sdk/wallet/yielding-wallet.md#yieldprojection)\>

##### receiveAndConvert()

```ts
receiveAndConvert(
   _fromAddress: `0x${string}`, 
   amount: string, 
fromToken: X402Token): Promise<ConversionResult>;
```

Defined in: [defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts:572](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts#L572)

Receive payment and optionally auto-convert to USDs
This would integrate with DEX protocols like Rubic or Uniswap

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `_fromAddress` | `` `0x${string}` `` |
| `amount` | `string` |
| `fromToken` | [`X402Token`](/docs/api/defi/protocols/src/x402/sdk/types.md#x402token) |

###### Returns

`Promise`\<[`ConversionResult`](/docs/api/defi/protocols/src/x402/sdk/wallet/yielding-wallet.md#conversionresult)\>

##### setAutoCompound()

```ts
setAutoCompound(enabled: boolean): void;
```

Defined in: [defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts:231](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts#L231)

Enable/disable auto-compound

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `enabled` | `boolean` |

###### Returns

`void`

##### setAutoConvert()

```ts
setAutoConvert(enabled: boolean): void;
```

Defined in: [defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts:238](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts#L238)

Enable/disable auto-conversion to USDs

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `enabled` | `boolean` |

###### Returns

`void`

##### shouldConvert()

```ts
shouldConvert(token: X402Token, amount: string): Promise<{
  estimatedYieldLoss: string;
  reason: string;
  recommended: boolean;
}>;
```

Defined in: [defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts:618](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts#L618)

Check if conversion is recommended

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `token` | [`X402Token`](/docs/api/defi/protocols/src/x402/sdk/types.md#x402token) |
| `amount` | `string` |

###### Returns

`Promise`\<\{
  `estimatedYieldLoss`: `string`;
  `reason`: `string`;
  `recommended`: `boolean`;
\}\>

##### updateConfig()

```ts
updateConfig(config: Partial<YieldingWalletConfig>): void;
```

Defined in: [defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts:217](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts#L217)

Update wallet configuration

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `config` | `Partial`\<[`YieldingWalletConfig`](/docs/api/defi/protocols/src/x402/sdk/wallet/yielding-wallet.md#yieldingwalletconfig)\> |

###### Returns

`void`

## Interfaces

### ConversionResult

Defined in: [defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts:81](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts#L81)

Conversion result

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="amountin"></a> `amountIn` | `string` | [defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts:85](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts#L85) |
| <a id="amountout"></a> `amountOut` | `string` | [defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts:86](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts#L86) |
| <a id="error"></a> `error?` | `string` | [defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts:88](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts#L88) |
| <a id="fromtoken"></a> `fromToken` | [`X402Token`](/docs/api/defi/protocols/src/x402/sdk/types.md#x402token) | [defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts:83](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts#L83) |
| <a id="success"></a> `success` | `boolean` | [defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts:82](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts#L82) |
| <a id="totoken"></a> `toToken` | `"USDs"` | [defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts:84](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts#L84) |
| <a id="transactionhash"></a> `transactionHash?` | `` `0x${string}` `` | [defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts:87](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts#L87) |

***

### MonthlyYieldReport

Defined in: [defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts:64](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts#L64)

Monthly yield report

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="averageapy"></a> `averageAPY` | `string` | [defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts:69](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts#L69) |
| <a id="endingbalance"></a> `endingBalance` | `string` | [defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts:71](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts#L71) |
| <a id="entries"></a> `entries` | [`YieldReportEntry`](/docs/api/defi/protocols/src/x402/sdk/wallet/yielding-wallet.md#yieldreportentry)[] | [defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts:67](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts#L67) |
| <a id="month"></a> `month` | `string` | [defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts:65](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts#L65) |
| <a id="netgrowth"></a> `netGrowth` | `string` | [defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts:74](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts#L74) |
| <a id="projectedannualyield"></a> `projectedAnnualYield` | `string` | [defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts:75](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts#L75) |
| <a id="startingbalance"></a> `startingBalance` | `string` | [defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts:70](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts#L70) |
| <a id="totaldeposits"></a> `totalDeposits` | `string` | [defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts:72](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts#L72) |
| <a id="totalwithdrawals"></a> `totalWithdrawals` | `string` | [defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts:73](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts#L73) |
| <a id="totalyieldearned"></a> `totalYieldEarned` | `string` | [defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts:68](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts#L68) |
| <a id="year"></a> `year` | `number` | [defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts:66](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts#L66) |

***

### WalletBalances

Defined in: [defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts:94](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts#L94)

Wallet balance breakdown

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="gasreserve"></a> `gasReserve` | \{ `balance`: `string`; `formattedBalance`: `string`; `sufficient`: `boolean`; \} | Gas reserve | [defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts:112](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts#L112) |
| `gasReserve.balance` | `string` | - | [defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts:113](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts#L113) |
| `gasReserve.formattedBalance` | `string` | - | [defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts:114](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts#L114) |
| `gasReserve.sufficient` | `boolean` | - | [defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts:115](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts#L115) |
| <a id="other"></a> `other` | \{ `balance`: `string`; `formattedBalance`: `string`; `token`: [`X402Token`](/docs/api/defi/protocols/src/x402/sdk/types.md#x402token); `usdValue?`: `string`; \}[] | Other token balances | [defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts:104](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts#L104) |
| <a id="totalvalueusd"></a> `totalValueUSD` | `string` | Total portfolio value in USD | [defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts:119](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts#L119) |
| <a id="usds"></a> `usds` | \{ `balance`: `string`; `formattedBalance`: `string`; `isRebasing`: `boolean`; `pendingYield`: `string`; \} | USDs balance (yield-bearing) | [defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts:96](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts#L96) |
| `usds.balance` | `string` | - | [defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts:97](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts#L97) |
| `usds.formattedBalance` | `string` | - | [defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts:98](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts#L98) |
| `usds.isRebasing` | `boolean` | - | [defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts:99](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts#L99) |
| `usds.pendingYield` | `string` | - | [defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts:100](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts#L100) |
| <a id="usdspercentage"></a> `usdsPercentage` | `string` | Percentage in yield-bearing USDs | [defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts:122](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts#L122) |

***

### YieldingWalletConfig

Defined in: [defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts:25](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts#L25)

Configuration for YieldingWallet

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="autocompound"></a> `autoCompound` | `boolean` | Enable automatic compounding of yield | [defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts:30](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts#L30) |
| <a id="autoconverttousds"></a> `autoConvertToUSDs` | `boolean` | Enable auto-conversion of all payments to USDs | [defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts:27](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts#L27) |
| <a id="enableyieldnotifications"></a> `enableYieldNotifications` | `boolean` | Enable yield notifications | [defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts:42](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts#L42) |
| <a id="gasreservetoken"></a> `gasReserveToken` | `"ETH"` \| `"native"` | Token to use for gas reserve (ETH on Arbitrum) | [defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts:36](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts#L36) |
| <a id="minconversionamount"></a> `minConversionAmount` | `string` | Minimum amount to trigger auto-conversion | [defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts:39](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts#L39) |
| <a id="mingasreserve"></a> `minGasReserve` | `string` | Minimum balance to keep as non-USDs (for gas) | [defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts:33](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts#L33) |
| <a id="yieldnotificationthreshold"></a> `yieldNotificationThreshold` | `string` | Yield notification threshold (e.g., notify when daily yield exceeds this) | [defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts:45](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts#L45) |

***

### YieldProjection

Defined in: [defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts:128](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts#L128)

Yield projection

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="annualpassiveincome"></a> `annualPassiveIncome` | `string` | [defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts:140](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts#L140) |
| <a id="apy"></a> `apy` | `string` | [defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts:130](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts#L130) |
| <a id="currentbalance"></a> `currentBalance` | `string` | [defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts:129](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts#L129) |
| <a id="monthlypassiveincome"></a> `monthlyPassiveIncome` | `string` | [defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts:139](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts#L139) |
| <a id="projections"></a> `projections` | \{ `compoundedYield`: `string`; `days`: `number`; `period`: `string`; `projectedBalance`: `string`; `projectedYield`: `string`; \}[] | [defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts:131](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts#L131) |
| <a id="timetodouble"></a> `timeToDouble` | \| \{ `days`: `number`; `months`: `number`; `years`: `number`; \} \| `null` | [defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts:138](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts#L138) |

***

### YieldReportEntry

Defined in: [defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts:51](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts#L51)

Yield report entry

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="apy-1"></a> `apy` | `string` | [defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts:58](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts#L58) |
| <a id="date"></a> `date` | `string` | [defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts:52](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts#L52) |
| <a id="deposits"></a> `deposits` | `string` | [defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts:55](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts#L55) |
| <a id="endingbalance-1"></a> `endingBalance` | `string` | [defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts:54](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts#L54) |
| <a id="startingbalance-1"></a> `startingBalance` | `string` | [defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts:53](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts#L53) |
| <a id="withdrawals"></a> `withdrawals` | `string` | [defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts:56](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts#L56) |
| <a id="yieldearned"></a> `yieldEarned` | `string` | [defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts:57](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/wallet/yielding-wallet.ts#L57) |

## References

### default

Renames and re-exports [YieldingWallet](/docs/api/defi/protocols/src/x402/sdk/wallet/yielding-wallet.md#yieldingwallet)
