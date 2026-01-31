[**Universal Crypto MCP API Reference v1.0.0**](../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/modules/lyra-ecosystem/client

# defi/protocols/src/modules/lyra-ecosystem/client

## Classes

### LyraClient

Defined in: [defi/protocols/src/modules/lyra-ecosystem/client.ts:100](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/client.ts#L100)

Unified Lyra Ecosystem Client

Provides a single entry point for all Lyra services with unified x402 payments.

#### Examples

```typescript
const lyra = new LyraClient({
  x402Wallet: process.env.X402_PRIVATE_KEY
});

// Intel: Security scan
const security = await lyra.intel.securityScan("https://github.com/user/repo");

// Registry: Get tool details
const tool = await lyra.registry.getToolDetails("mcp-server-filesystem");

// Discovery: Analyze API
const analysis = await lyra.discovery.analyze("https://api.example.com");
```

```typescript
const lyra = new LyraClient({
  x402Wallet: process.env.X402_PRIVATE_KEY,
  maxDailySpend: "5.00" // Limit spending to $5/day
});

// Check usage
const stats = lyra.getUsageStats("day");
console.log(`Spent today: $${stats.totalSpent}`);
```

```typescript
const lyra = new LyraClient({
  wallets: {
    evmPrivateKey: process.env.EVM_PRIVATE_KEY,  // Base, Arbitrum, BSC
    svmPrivateKey: process.env.SOL_PRIVATE_KEY,  // Solana
  },
  network: "arbitrum", // Primary network
  chainPreference: {
    primary: "arbitrum",
    fallbacks: ["base", "bsc"],
    preferLowFees: true,
  },
});
```

#### Constructors

##### Constructor

```ts
new LyraClient(config: LyraClientConfig): LyraClient;
```

Defined in: [defi/protocols/src/modules/lyra-ecosystem/client.ts:117](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/client.ts#L117)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `config` | [`LyraClientConfig`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#lyraclientconfig) |

###### Returns

[`LyraClient`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/client.md#lyraclient)

#### Properties

| Property | Modifier | Type | Description | Defined in |
| :------ | :------ | :------ | :------ | :------ |
| <a id="discovery"></a> `discovery` | `readonly` | [`LyraDiscovery`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/discovery.md#lyradiscovery) | Lyra Tool Discovery service (auto-discovery) | [defi/protocols/src/modules/lyra-ecosystem/client.ts:108](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/client.ts#L108) |
| <a id="intel"></a> `intel` | `readonly` | [`LyraIntel`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/intel.md#lyraintel) | Lyra Intel service (code analysis) | [defi/protocols/src/modules/lyra-ecosystem/client.ts:102](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/client.ts#L102) |
| <a id="registry"></a> `registry` | `readonly` | [`LyraRegistry`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/registry.md#lyraregistry) | Lyra Registry service (tool catalog) | [defi/protocols/src/modules/lyra-ecosystem/client.ts:105](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/client.ts#L105) |

#### Methods

##### canSpend()

```ts
canSpend(amount: string): boolean;
```

Defined in: [defi/protocols/src/modules/lyra-ecosystem/client.ts:363](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/client.ts#L363)

Check if a payment amount is within the daily limit

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `amount` | `string` |

###### Returns

`boolean`

##### clearPaymentHistory()

```ts
clearPaymentHistory(): void;
```

Defined in: [defi/protocols/src/modules/lyra-ecosystem/client.ts:419](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/client.ts#L419)

Clear payment history

###### Returns

`void`

##### discoverApi()

```ts
discoverApi(apiUrl: string): Promise<DiscoveryResult>;
```

Defined in: [defi/protocols/src/modules/lyra-ecosystem/client.ts:474](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/client.ts#L474)

Quick API discovery (Discovery)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `apiUrl` | `string` |

###### Returns

`Promise`\<[`DiscoveryResult`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#discoveryresult)\>

##### estimateTotalCost()

```ts
estimateTotalCost(operations: {
  count?: number;
  operation: string;
  service: LyraServiceName;
}[]): string;
```

Defined in: [defi/protocols/src/modules/lyra-ecosystem/client.ts:437](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/client.ts#L437)

Estimate total cost for a set of operations

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `operations` | \{ `count?`: `number`; `operation`: `string`; `service`: [`LyraServiceName`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#lyraservicename); \}[] |

###### Returns

`string`

##### estimateUSdsYield()

```ts
estimateUSdsYield(balance: number, days: number): {
  high: string;
  low: string;
  mid: string;
};
```

Defined in: [defi/protocols/src/modules/lyra-ecosystem/client.ts:528](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/client.ts#L528)

Estimate yield earned on idle funds

###### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `balance` | `number` | Current USDs balance in USD |
| `days` | `number` | Number of days to estimate |

###### Returns

```ts
{
  high: string;
  low: string;
  mid: string;
}
```

Estimated yield in USD

| Name | Type | Defined in |
| :------ | :------ | :------ |
| `high` | `string` | [defi/protocols/src/modules/lyra-ecosystem/client.ts:530](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/client.ts#L530) |
| `low` | `string` | [defi/protocols/src/modules/lyra-ecosystem/client.ts:529](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/client.ts#L529) |
| `mid` | `string` | [defi/protocols/src/modules/lyra-ecosystem/client.ts:531](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/client.ts#L531) |

###### Example

```typescript
// $100 USDs for 30 days at ~7.5% APY
const yield = lyra.estimateUSdsYield(100, 30);
// → ~$0.62
```

##### fromEnv()

```ts
static fromEnv(): LyraClient;
```

Defined in: [defi/protocols/src/modules/lyra-ecosystem/client.ts:154](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/client.ts#L154)

Create a LyraClient from environment variables

Environment variables:
- X402_EVM_PRIVATE_KEY or X402_PRIVATE_KEY: EVM wallet private key (Base, Arbitrum, BSC, etc.)
- X402_SVM_PRIVATE_KEY: Solana wallet private key
- LYRA_NETWORK: Primary payment network (default: "base")
- LYRA_MAX_DAILY_SPEND: Maximum daily spending limit in USD
- LYRA_PREFERRED_TOKEN: Preferred stablecoin (USDC, USDT, USDs)

###### Returns

[`LyraClient`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/client.md#lyraclient)

##### getActiveNetwork()

```ts
getActiveNetwork(): 
  | "base-sepolia"
  | "ethereum"
  | "bsc"
  | "base"
  | "arbitrum"
  | "arbitrum-sepolia"
  | "bsc-testnet"
  | "polygon"
  | "optimism"
  | "solana-mainnet"
  | "solana-devnet";
```

Defined in: [defi/protocols/src/modules/lyra-ecosystem/client.ts:223](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/client.ts#L223)

Get current active network

###### Returns

  \| `"base-sepolia"`
  \| `"ethereum"`
  \| `"bsc"`
  \| `"base"`
  \| `"arbitrum"`
  \| `"arbitrum-sepolia"`
  \| `"bsc-testnet"`
  \| `"polygon"`
  \| `"optimism"`
  \| `"solana-mainnet"`
  \| `"solana-devnet"`

##### getDefaultToken()

```ts
getDefaultToken(): PaymentToken;
```

Defined in: [defi/protocols/src/modules/lyra-ecosystem/client.ts:561](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/client.ts#L561)

Get default token for current network

###### Returns

[`PaymentToken`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/constants.md#paymenttoken)

##### getNetworkConfig()

```ts
getNetworkConfig(network?: 
  | "base-sepolia"
  | "ethereum"
  | "bsc"
  | "base"
  | "arbitrum"
  | "arbitrum-sepolia"
  | "bsc-testnet"
  | "polygon"
  | "optimism"
  | "solana-mainnet"
  | "solana-devnet"): 
  | {
  caip2: "eip155:8453";
  chainId: 8453;
  gasToken: "ETH";
  name: "Base";
  testnet: false;
  type: "evm";
  usdc: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
}
  | {
  caip2: "eip155:84532";
  chainId: 84532;
  gasToken: "ETH";
  name: "Base Sepolia";
  testnet: true;
  type: "evm";
  usdc: "0x036CbD53842c5426634e7929541eC2318f3dCF7e";
}
  | {
  caip2: "eip155:42161";
  chainId: 42161;
  gasToken: "ETH";
  name: "Arbitrum One";
  testnet: false;
  type: "evm";
  usdc: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831";
  usds: "0xD74f5255D557944cf7Dd0E45FF521520002D5748";
}
  | {
  caip2: "eip155:421614";
  chainId: 421614;
  gasToken: "ETH";
  name: "Arbitrum Sepolia";
  testnet: true;
  type: "evm";
  usdc: "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d";
}
  | {
  caip2: "eip155:56";
  chainId: 56;
  gasToken: "BNB";
  name: "BNB Smart Chain";
  testnet: false;
  type: "evm";
  usdc: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d";
  usdt: "0x55d398326f99059fF775485246999027B3197955";
}
  | {
  caip2: "eip155:97";
  chainId: 97;
  gasToken: "BNB";
  name: "BNB Testnet";
  testnet: true;
  type: "evm";
  usdc: "0x64544969ed7EBf5f083679233325356EbE738930";
}
  | {
  caip2: "eip155:1";
  chainId: 1;
  gasToken: "ETH";
  name: "Ethereum";
  testnet: false;
  type: "evm";
  usdc: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
}
  | {
  caip2: "eip155:137";
  chainId: 137;
  gasToken: "MATIC";
  name: "Polygon";
  testnet: false;
  type: "evm";
  usdc: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359";
}
  | {
  caip2: "eip155:10";
  chainId: 10;
  gasToken: "ETH";
  name: "Optimism";
  testnet: false;
  type: "evm";
  usdc: "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85";
}
  | {
  caip2: "solana:mainnet";
  chainId: "mainnet-beta";
  gasToken: "SOL";
  name: "Solana Mainnet";
  testnet: false;
  type: "svm";
  usdc: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
}
  | {
  caip2: "solana:devnet";
  chainId: "devnet";
  gasToken: "SOL";
  name: "Solana Devnet";
  testnet: true;
  type: "svm";
  usdc: "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU";
};
```

Defined in: [defi/protocols/src/modules/lyra-ecosystem/client.ts:230](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/client.ts#L230)

Get network configuration

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `network?` | \| `"base-sepolia"` \| `"ethereum"` \| `"bsc"` \| `"base"` \| `"arbitrum"` \| `"arbitrum-sepolia"` \| `"bsc-testnet"` \| `"polygon"` \| `"optimism"` \| `"solana-mainnet"` \| `"solana-devnet"` |

###### Returns

  \| \{
  `caip2`: `"eip155:8453"`;
  `chainId`: `8453`;
  `gasToken`: `"ETH"`;
  `name`: `"Base"`;
  `testnet`: `false`;
  `type`: `"evm"`;
  `usdc`: `"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"`;
\}
  \| \{
  `caip2`: `"eip155:84532"`;
  `chainId`: `84532`;
  `gasToken`: `"ETH"`;
  `name`: `"Base Sepolia"`;
  `testnet`: `true`;
  `type`: `"evm"`;
  `usdc`: `"0x036CbD53842c5426634e7929541eC2318f3dCF7e"`;
\}
  \| \{
  `caip2`: `"eip155:42161"`;
  `chainId`: `42161`;
  `gasToken`: `"ETH"`;
  `name`: `"Arbitrum One"`;
  `testnet`: `false`;
  `type`: `"evm"`;
  `usdc`: `"0xaf88d065e77c8cC2239327C5EDb3A432268e5831"`;
  `usds`: `"0xD74f5255D557944cf7Dd0E45FF521520002D5748"`;
\}
  \| \{
  `caip2`: `"eip155:421614"`;
  `chainId`: `421614`;
  `gasToken`: `"ETH"`;
  `name`: `"Arbitrum Sepolia"`;
  `testnet`: `true`;
  `type`: `"evm"`;
  `usdc`: `"0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d"`;
\}
  \| \{
  `caip2`: `"eip155:56"`;
  `chainId`: `56`;
  `gasToken`: `"BNB"`;
  `name`: `"BNB Smart Chain"`;
  `testnet`: `false`;
  `type`: `"evm"`;
  `usdc`: `"0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d"`;
  `usdt`: `"0x55d398326f99059fF775485246999027B3197955"`;
\}
  \| \{
  `caip2`: `"eip155:97"`;
  `chainId`: `97`;
  `gasToken`: `"BNB"`;
  `name`: `"BNB Testnet"`;
  `testnet`: `true`;
  `type`: `"evm"`;
  `usdc`: `"0x64544969ed7EBf5f083679233325356EbE738930"`;
\}
  \| \{
  `caip2`: `"eip155:1"`;
  `chainId`: `1`;
  `gasToken`: `"ETH"`;
  `name`: `"Ethereum"`;
  `testnet`: `false`;
  `type`: `"evm"`;
  `usdc`: `"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"`;
\}
  \| \{
  `caip2`: `"eip155:137"`;
  `chainId`: `137`;
  `gasToken`: `"MATIC"`;
  `name`: `"Polygon"`;
  `testnet`: `false`;
  `type`: `"evm"`;
  `usdc`: `"0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359"`;
\}
  \| \{
  `caip2`: `"eip155:10"`;
  `chainId`: `10`;
  `gasToken`: `"ETH"`;
  `name`: `"Optimism"`;
  `testnet`: `false`;
  `type`: `"evm"`;
  `usdc`: `"0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85"`;
\}
  \| \{
  `caip2`: `"solana:mainnet"`;
  `chainId`: `"mainnet-beta"`;
  `gasToken`: `"SOL"`;
  `name`: `"Solana Mainnet"`;
  `testnet`: `false`;
  `type`: `"svm"`;
  `usdc`: `"EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"`;
\}
  \| \{
  `caip2`: `"solana:devnet"`;
  `chainId`: `"devnet"`;
  `gasToken`: `"SOL"`;
  `name`: `"Solana Devnet"`;
  `testnet`: `true`;
  `type`: `"svm"`;
  `usdc`: `"4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"`;
\}

##### getPaymentHistory()

```ts
getPaymentHistory(limit?: number): LyraPaymentResult[];
```

Defined in: [defi/protocols/src/modules/lyra-ecosystem/client.ts:411](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/client.ts#L411)

Get payment history

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `limit?` | `number` |

###### Returns

[`LyraPaymentResult`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#lyrapaymentresult)[]

##### getPricing()

```ts
getPricing(): {
  discovery: {
     basicDiscovery: "0.00";
     compatibility: "0.02";
     fullAssistance: "0.50";
     generateConfig: "0.10";
  };
  intel: {
     enterpriseAnalysis: "1.00";
     fileAnalysis: "0.00";
     repoAudit: "0.10";
     securityScan: "0.05";
  };
  registry: {
     browse: "0.00";
     featuredListing: "10.00";
     privateRegistration: "0.05";
     toolDetails: "0.01";
  };
};
```

Defined in: [defi/protocols/src/modules/lyra-ecosystem/client.ts:430](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/client.ts#L430)

Get pricing for all Lyra services

###### Returns

```ts
{
  discovery: {
     basicDiscovery: "0.00";
     compatibility: "0.02";
     fullAssistance: "0.50";
     generateConfig: "0.10";
  };
  intel: {
     enterpriseAnalysis: "1.00";
     fileAnalysis: "0.00";
     repoAudit: "0.10";
     securityScan: "0.05";
  };
  registry: {
     browse: "0.00";
     featuredListing: "10.00";
     privateRegistration: "0.05";
     toolDetails: "0.01";
  };
}
```

| Name | Type | Default value | Defined in |
| :------ | :------ | :------ | :------ |
| `discovery` | \{ `basicDiscovery`: `"0.00"`; `compatibility`: `"0.02"`; `fullAssistance`: `"0.50"`; `generateConfig`: `"0.10"`; \} | - | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:57](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L57) |
| `discovery.basicDiscovery` | `"0.00"` | `"0.00"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:58](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L58) |
| `discovery.compatibility` | `"0.02"` | `"0.02"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:59](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L59) |
| `discovery.fullAssistance` | `"0.50"` | `"0.50"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:61](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L61) |
| `discovery.generateConfig` | `"0.10"` | `"0.10"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:60](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L60) |
| `intel` | \{ `enterpriseAnalysis`: `"1.00"`; `fileAnalysis`: `"0.00"`; `repoAudit`: `"0.10"`; `securityScan`: `"0.05"`; \} | - | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:43](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L43) |
| `intel.enterpriseAnalysis` | `"1.00"` | `"1.00"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:47](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L47) |
| `intel.fileAnalysis` | `"0.00"` | `"0.00"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:44](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L44) |
| `intel.repoAudit` | `"0.10"` | `"0.10"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:46](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L46) |
| `intel.securityScan` | `"0.05"` | `"0.05"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:45](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L45) |
| `registry` | \{ `browse`: `"0.00"`; `featuredListing`: `"10.00"`; `privateRegistration`: `"0.05"`; `toolDetails`: `"0.01"`; \} | - | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:50](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L50) |
| `registry.browse` | `"0.00"` | `"0.00"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:51](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L51) |
| `registry.featuredListing` | `"10.00"` | `"10.00"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:54](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L54) |
| `registry.privateRegistration` | `"0.05"` | `"0.05"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:53](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L53) |
| `registry.toolDetails` | `"0.01"` | `"0.01"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:52](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L52) |

##### getRecommendedNetworks()

```ts
getRecommendedNetworks(): {
  lowCost: (
     | "base-sepolia"
     | "ethereum"
     | "bsc"
     | "base"
     | "arbitrum"
     | "arbitrum-sepolia"
     | "bsc-testnet"
     | "polygon"
     | "optimism"
     | "solana-mainnet"
    | "solana-devnet")[];
  secure: (
     | "base-sepolia"
     | "ethereum"
     | "bsc"
     | "base"
     | "arbitrum"
     | "arbitrum-sepolia"
     | "bsc-testnet"
     | "polygon"
     | "optimism"
     | "solana-mainnet"
    | "solana-devnet")[];
  solana: (
     | "base-sepolia"
     | "ethereum"
     | "bsc"
     | "base"
     | "arbitrum"
     | "arbitrum-sepolia"
     | "bsc-testnet"
     | "polygon"
     | "optimism"
     | "solana-mainnet"
    | "solana-devnet")[];
  testnet: (
     | "base-sepolia"
     | "ethereum"
     | "bsc"
     | "base"
     | "arbitrum"
     | "arbitrum-sepolia"
     | "bsc-testnet"
     | "polygon"
     | "optimism"
     | "solana-mainnet"
    | "solana-devnet")[];
  yieldBearing: (
     | "base-sepolia"
     | "ethereum"
     | "bsc"
     | "base"
     | "arbitrum"
     | "arbitrum-sepolia"
     | "bsc-testnet"
     | "polygon"
     | "optimism"
     | "solana-mainnet"
    | "solana-devnet")[];
};
```

Defined in: [defi/protocols/src/modules/lyra-ecosystem/client.ts:277](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/client.ts#L277)

Get recommended networks by use case

###### Returns

| Name | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| `lowCost` | ( \| `"base-sepolia"` \| `"ethereum"` \| `"bsc"` \| `"base"` \| `"arbitrum"` \| `"arbitrum-sepolia"` \| `"bsc-testnet"` \| `"polygon"` \| `"optimism"` \| `"solana-mainnet"` \| `"solana-devnet"`)[] | Lowest fees, fast finality | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:210](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L210) |
| `secure` | ( \| `"base-sepolia"` \| `"ethereum"` \| `"bsc"` \| `"base"` \| `"arbitrum"` \| `"arbitrum-sepolia"` \| `"bsc-testnet"` \| `"polygon"` \| `"optimism"` \| `"solana-mainnet"` \| `"solana-devnet"`)[] | Most secure, battle-tested | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:212](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L212) |
| `solana` | ( \| `"base-sepolia"` \| `"ethereum"` \| `"bsc"` \| `"base"` \| `"arbitrum"` \| `"arbitrum-sepolia"` \| `"bsc-testnet"` \| `"polygon"` \| `"optimism"` \| `"solana-mainnet"` \| `"solana-devnet"`)[] | Best for non-EVM users | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:214](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L214) |
| `testnet` | ( \| `"base-sepolia"` \| `"ethereum"` \| `"bsc"` \| `"base"` \| `"arbitrum"` \| `"arbitrum-sepolia"` \| `"bsc-testnet"` \| `"polygon"` \| `"optimism"` \| `"solana-mainnet"` \| `"solana-devnet"`)[] | For testing | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:216](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L216) |
| `yieldBearing` | ( \| `"base-sepolia"` \| `"ethereum"` \| `"bsc"` \| `"base"` \| `"arbitrum"` \| `"arbitrum-sepolia"` \| `"bsc-testnet"` \| `"polygon"` \| `"optimism"` \| `"solana-mainnet"` \| `"solana-devnet"`)[] | Yield-bearing payments with USDs | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:218](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L218) |

##### getRemainingDailyAllowance()

```ts
getRemainingDailyAllowance(): string;
```

Defined in: [defi/protocols/src/modules/lyra-ecosystem/client.ts:352](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/client.ts#L352)

Get remaining daily spend allowance

###### Returns

`string`

##### getSperaxContracts()

```ts
getSperaxContracts(): 
  | {
  spa: "0x5575552988A3A80504bBaeB1311674fCFd40aD4B";
  usds: "0xD74f5255D557944cf7Dd0E45FF521520002D5748";
  vespa: "0x2e2071180682Ce6C247B1eF93d382D509F5F6A17";
  xspa: "0x0966E72256d6055145902F72F9D3B6a194B9cCc3";
}
  | {
  spa: "0xB4A3B0Faf0Ab53df58001804DdA5Bfc6a3D59008";
  vespa: "0xbF82a3212e13b2d407D10f5107b5C8404dE7F403";
  wspa: "0x2a95FE4c7e64e09856989F9eA0b57B9AB5f770CB";
}
  | {
  spa: "0x1A9Fd6eC3144Da3Dd6Ea13Ec1C25C58423a379b1";
}
  | null;
```

Defined in: [defi/protocols/src/modules/lyra-ecosystem/client.ts:494](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/client.ts#L494)

Get Sperax contract addresses for current network

###### Returns

```ts
{
  spa: "0x5575552988A3A80504bBaeB1311674fCFd40aD4B";
  usds: "0xD74f5255D557944cf7Dd0E45FF521520002D5748";
  vespa: "0x2e2071180682Ce6C247B1eF93d382D509F5F6A17";
  xspa: "0x0966E72256d6055145902F72F9D3B6a194B9cCc3";
}
```

| Name | Type | Default value | Description | Defined in |
| :------ | :------ | :------ | :------ | :------ |
| `spa` | `"0x5575552988A3A80504bBaeB1311674fCFd40aD4B"` | `"0x5575552988A3A80504bBaeB1311674fCFd40aD4B"` | SPA - Governance token | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:235](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L235) |
| `usds` | `"0xD74f5255D557944cf7Dd0E45FF521520002D5748"` | `"0xD74f5255D557944cf7Dd0E45FF521520002D5748"` | USDs - Yield-bearing stablecoin | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:233](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L233) |
| `vespa` | `"0x2e2071180682Ce6C247B1eF93d382D509F5F6A17"` | `"0x2e2071180682Ce6C247B1eF93d382D509F5F6A17"` | veSPA - Vote-escrowed SPA (proxy) | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:239](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L239) |
| `xspa` | `"0x0966E72256d6055145902F72F9D3B6a194B9cCc3"` | `"0x0966E72256d6055145902F72F9D3B6a194B9cCc3"` | xSPA - Staked SPA | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:237](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L237) |

```ts
{
  spa: "0xB4A3B0Faf0Ab53df58001804DdA5Bfc6a3D59008";
  vespa: "0xbF82a3212e13b2d407D10f5107b5C8404dE7F403";
  wspa: "0x2a95FE4c7e64e09856989F9eA0b57B9AB5f770CB";
}
```

| Name | Type | Default value | Description | Defined in |
| :------ | :------ | :------ | :------ | :------ |
| `spa` | `"0xB4A3B0Faf0Ab53df58001804DdA5Bfc6a3D59008"` | `"0xB4A3B0Faf0Ab53df58001804DdA5Bfc6a3D59008"` | SPA L1 | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:243](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L243) |
| `vespa` | `"0xbF82a3212e13b2d407D10f5107b5C8404dE7F403"` | `"0xbF82a3212e13b2d407D10f5107b5C8404dE7F403"` | veSPA (proxy) | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:247](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L247) |
| `wspa` | `"0x2a95FE4c7e64e09856989F9eA0b57B9AB5f770CB"` | `"0x2a95FE4c7e64e09856989F9eA0b57B9AB5f770CB"` | wSPA (wrapped) | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:245](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L245) |

```ts
{
  spa: "0x1A9Fd6eC3144Da3Dd6Ea13Ec1C25C58423a379b1";
}
```

| Name | Type | Default value | Description | Defined in |
| :------ | :------ | :------ | :------ | :------ |
| `spa` | `"0x1A9Fd6eC3144Da3Dd6Ea13Ec1C25C58423a379b1"` | `"0x1A9Fd6eC3144Da3Dd6Ea13Ec1C25C58423a379b1"` | SPA on BSC | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:251](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L251) |

`null`

##### getSupportedNetworks()

```ts
getSupportedNetworks(): {
  id:   | "base-sepolia"
     | "ethereum"
     | "bsc"
     | "base"
     | "arbitrum"
     | "arbitrum-sepolia"
     | "bsc-testnet"
     | "polygon"
     | "optimism"
     | "solana-mainnet"
     | "solana-devnet";
  name: string;
  testnet: boolean;
  type: "evm" | "svm";
}[];
```

Defined in: [defi/protocols/src/modules/lyra-ecosystem/client.ts:265](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/client.ts#L265)

Get all supported networks

###### Returns

\{
  `id`:   \| `"base-sepolia"`
     \| `"ethereum"`
     \| `"bsc"`
     \| `"base"`
     \| `"arbitrum"`
     \| `"arbitrum-sepolia"`
     \| `"bsc-testnet"`
     \| `"polygon"`
     \| `"optimism"`
     \| `"solana-mainnet"`
     \| `"solana-devnet"`;
  `name`: `string`;
  `testnet`: `boolean`;
  `type`: `"evm"` \| `"svm"`;
\}[]

##### getSupportedTokens()

```ts
getSupportedTokens(): PaymentToken[];
```

Defined in: [defi/protocols/src/modules/lyra-ecosystem/client.ts:551](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/client.ts#L551)

Get supported payment tokens for current network

###### Returns

[`PaymentToken`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/constants.md#paymenttoken)[]

##### getUsageStats()

```ts
getUsageStats(period: "day" | "week" | "month" | "all"): LyraUsageStats;
```

Defined in: [defi/protocols/src/modules/lyra-ecosystem/client.ts:375](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/client.ts#L375)

Get usage statistics for a time period

###### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `period` | `"day"` \| `"week"` \| `"month"` \| `"all"` | `"day"` |

###### Returns

[`LyraUsageStats`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#lyrausagestats)

##### getUSDsBenefits()

```ts
getUSDsBenefits(): {
  autoYield: true;
  estimatedApy: "5-10%";
  noStakingRequired: true;
  rebaseFrequency: "daily";
  supportedChains: readonly ["arbitrum"];
};
```

Defined in: [defi/protocols/src/modules/lyra-ecosystem/client.ts:510](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/client.ts#L510)

Get USDs benefits info

###### Returns

```ts
{
  autoYield: true;
  estimatedApy: "5-10%";
  noStakingRequired: true;
  rebaseFrequency: "daily";
  supportedChains: readonly ["arbitrum"];
}
```

| Name | Type | Default value | Defined in |
| :------ | :------ | :------ | :------ |
| `autoYield` | `true` | `true` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:266](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L266) |
| `estimatedApy` | `"5-10%"` | `"5-10%"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:267](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L267) |
| `noStakingRequired` | `true` | `true` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:268](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L268) |
| `rebaseFrequency` | `"daily"` | `"daily"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:270](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L270) |
| `supportedChains` | readonly \[`"arbitrum"`\] | - | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:269](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L269) |

##### initializePayments()

```ts
initializePayments(): Promise<void>;
```

Defined in: [defi/protocols/src/modules/lyra-ecosystem/client.ts:289](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/client.ts#L289)

Initialize the x402 payment client
Call this before making paid requests

###### Returns

`Promise`\<`void`\>

##### isPaymentEnabled()

```ts
isPaymentEnabled(): boolean;
```

Defined in: [defi/protocols/src/modules/lyra-ecosystem/client.ts:345](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/client.ts#L345)

Check if payments are enabled

###### Returns

`boolean`

##### isUsingUSDs()

```ts
isUsingUSDs(): boolean;
```

Defined in: [defi/protocols/src/modules/lyra-ecosystem/client.ts:486](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/client.ts#L486)

Check if using USDs (yield-bearing stablecoin)
USDs automatically earns ~5-10% APY while sitting in your wallet

###### Returns

`boolean`

##### isYieldBearing()

```ts
isYieldBearing(token: PaymentToken): boolean;
```

Defined in: [defi/protocols/src/modules/lyra-ecosystem/client.ts:568](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/client.ts#L568)

Check if a token is yield-bearing

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `token` | [`PaymentToken`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/constants.md#paymenttoken) |

###### Returns

`boolean`

##### lowCost()

```ts
static lowCost(privateKey: `0x${string}`): LyraClient;
```

Defined in: [defi/protocols/src/modules/lyra-ecosystem/client.ts:170](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/client.ts#L170)

Create a client optimized for low fees
Uses Base, Arbitrum, or BSC depending on availability

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `privateKey` | `` `0x${string}` `` |

###### Returns

[`LyraClient`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/client.md#lyraclient)

##### readOnly()

```ts
static readOnly(): LyraClient;
```

Defined in: [defi/protocols/src/modules/lyra-ecosystem/client.ts:195](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/client.ts#L195)

Create a read-only client (no payments, free tier only)

###### Returns

[`LyraClient`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/client.md#lyraclient)

##### searchTools()

```ts
searchTools(query: string): Promise<ToolInfo[]>;
```

Defined in: [defi/protocols/src/modules/lyra-ecosystem/client.ts:467](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/client.ts#L467)

Quick tool search (Registry)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `query` | `string` |

###### Returns

`Promise`\<[`ToolInfo`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#toolinfo)[]\>

##### securityScan()

```ts
securityScan(repoUrl: string): Promise<SecurityScanResult>;
```

Defined in: [defi/protocols/src/modules/lyra-ecosystem/client.ts:460](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/client.ts#L460)

Quick security scan (Intel)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `repoUrl` | `string` |

###### Returns

`Promise`\<[`SecurityScanResult`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/types.md#securityscanresult)\>

##### solana()

```ts
static solana(privateKey: string): LyraClient;
```

Defined in: [defi/protocols/src/modules/lyra-ecosystem/client.ts:185](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/client.ts#L185)

Create a Solana-only client

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `privateKey` | `string` |

###### Returns

[`LyraClient`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/client.md#lyraclient)

##### switchNetwork()

```ts
switchNetwork(network: 
  | "base-sepolia"
  | "ethereum"
  | "bsc"
  | "base"
  | "arbitrum"
  | "arbitrum-sepolia"
  | "bsc-testnet"
  | "polygon"
  | "optimism"
  | "solana-mainnet"
| "solana-devnet"): Promise<void>;
```

Defined in: [defi/protocols/src/modules/lyra-ecosystem/client.ts:238](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/client.ts#L238)

Switch to a different payment network

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `network` | \| `"base-sepolia"` \| `"ethereum"` \| `"bsc"` \| `"base"` \| `"arbitrum"` \| `"arbitrum-sepolia"` \| `"bsc-testnet"` \| `"polygon"` \| `"optimism"` \| `"solana-mainnet"` \| `"solana-devnet"` |

###### Returns

`Promise`\<`void`\>

##### testnet()

```ts
static testnet(evmKey?: `0x${string}`, svmKey?: string): LyraClient;
```

Defined in: [defi/protocols/src/modules/lyra-ecosystem/client.ts:204](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/client.ts#L204)

Create a testnet-only client for development

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `evmKey?` | `` `0x${string}` `` |
| `svmKey?` | `string` |

###### Returns

[`LyraClient`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/client.md#lyraclient)

##### yieldBearing()

```ts
static yieldBearing(privateKey: `0x${string}`): LyraClient;
```

Defined in: [defi/protocols/src/modules/lyra-ecosystem/client.ts:575](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/client.ts#L575)

Create a client optimized for yield-bearing payments (USDs on Arbitrum)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `privateKey` | `` `0x${string}` `` |

###### Returns

[`LyraClient`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/client.md#lyraclient)

## Functions

### getLyraClient()

```ts
function getLyraClient(): LyraClient;
```

Defined in: [defi/protocols/src/modules/lyra-ecosystem/client.ts:650](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/client.ts#L650)

Get or create the default Lyra client

#### Returns

[`LyraClient`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/client.md#lyraclient)

***

### resetLyraClient()

```ts
function resetLyraClient(): void;
```

Defined in: [defi/protocols/src/modules/lyra-ecosystem/client.ts:667](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/client.ts#L667)

Reset the default client

#### Returns

`void`

***

### setLyraClient()

```ts
function setLyraClient(client: LyraClient): void;
```

Defined in: [defi/protocols/src/modules/lyra-ecosystem/client.ts:660](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/client.ts#L660)

Set the default Lyra client

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `client` | [`LyraClient`](/docs/api/defi/protocols/src/modules/lyra-ecosystem/client.md#lyraclient) |

#### Returns

`void`
