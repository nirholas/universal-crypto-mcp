[**Universal Crypto MCP API Reference v1.0.0**](../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / core/src/types

# core/src/types

## Interfaces

### MCP

#### MCPServerConfig

Defined in: [core/src/types/index.ts:358](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/core/src/types/index.ts#L358)

Configuration options for an MCP server instance.

This interface defines all configuration options available when
creating a new Universal Crypto MCP server.

##### Example

```typescript
const config: MCPServerConfig = {
  name: 'my-crypto-mcp',
  version: '1.0.0',
  description: 'Custom crypto tools for AI agents',
  transport: 'http',
  port: 3000,
  x402: {
    payTo: '0x...',
    price: '0.01',
    network: 'base',
  },
};
```

##### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="description"></a> `description?` | `string` | Human-readable description | [core/src/types/index.ts:364](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/core/src/types/index.ts#L364) |
| <a id="name"></a> `name` | `string` | Server name identifier | [core/src/types/index.ts:360](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/core/src/types/index.ts#L360) |
| <a id="port"></a> `port?` | `number` | Port number for HTTP/SSE transports | [core/src/types/index.ts:368](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/core/src/types/index.ts#L368) |
| <a id="transport"></a> `transport?` | `"stdio"` \| `"sse"` \| `"http"` | Transport protocol for MCP communication | [core/src/types/index.ts:366](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/core/src/types/index.ts#L366) |
| <a id="version"></a> `version` | `string` | Semantic version string | [core/src/types/index.ts:362](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/core/src/types/index.ts#L362) |
| <a id="x402"></a> `x402?` | \{ `network`: `string`; `payTo`: `string`; `price`: `string`; `token?`: `string`; \} | Optional x402 payment configuration for monetized APIs | [core/src/types/index.ts:370](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/core/src/types/index.ts#L370) |
| `x402.network` | `string` | Network for payments (e.g., "base", "ethereum") | [core/src/types/index.ts:306](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/core/src/types/index.ts#L306) |
| `x402.payTo` | `string` | Address to receive payments | [core/src/types/index.ts:302](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/core/src/types/index.ts#L302) |
| `x402.price` | `string` | Price per request (in token units) | [core/src/types/index.ts:304](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/core/src/types/index.ts#L304) |
| `x402.token?` | `string` | Optional token address (defaults to native currency) | [core/src/types/index.ts:308](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/core/src/types/index.ts#L308) |

***

#### ToolResponse

Defined in: [core/src/types/index.ts:273](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/core/src/types/index.ts#L273)

Standard response wrapper for MCP tool executions.

All MCP tools return responses in this format, providing consistent
error handling and metadata across the platform.

##### Example

```typescript
const response: ToolResponse<PriceData> = {
  success: true,
  data: { symbol: 'ETH', price: 3500, timestamp: Date.now() },
  metadata: { executionTime: 150, network: 'ethereum' },
};
```

##### Type Parameters

| Type Parameter | Default type | Description |
| :------ | :------ | :------ |
| `T` | `unknown` | The type of data returned on success |

##### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="data"></a> `data?` | `T` | The response data (present when success is true) | [core/src/types/index.ts:277](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/core/src/types/index.ts#L277) |
| <a id="error"></a> `error?` | `string` | Error message (present when success is false) | [core/src/types/index.ts:279](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/core/src/types/index.ts#L279) |
| <a id="metadata"></a> `metadata?` | \{ \[`key`: `string`\]: `unknown`; `executionTime?`: `number`; `network?`: `string`; \} | Optional metadata about the execution | [core/src/types/index.ts:281](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/core/src/types/index.ts#L281) |
| `metadata.executionTime?` | `number` | Execution time in milliseconds | [core/src/types/index.ts:283](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/core/src/types/index.ts#L283) |
| `metadata.network?` | `string` | Network used for the operation | [core/src/types/index.ts:285](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/core/src/types/index.ts#L285) |
| <a id="success"></a> `success` | `boolean` | Whether the tool execution succeeded | [core/src/types/index.ts:275](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/core/src/types/index.ts#L275) |

## Type Aliases

### Core

#### Network

```ts
type Network = z.infer<typeof NetworkSchema>;
```

Defined in: [core/src/types/index.ts:86](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/core/src/types/index.ts#L86)

Represents a blockchain network configuration.

Networks define the connection parameters and metadata for interacting
with a specific blockchain. Universal Crypto MCP supports 60+ networks.

##### Example

```typescript
const base: Network = {
  chainId: 8453,
  name: 'Base',
  rpcUrl: 'https://mainnet.base.org',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  blockExplorer: 'https://basescan.org',
};
```

### Wallets

#### Wallet

```ts
type Wallet = z.infer<typeof WalletSchema>;
```

Defined in: [core/src/types/index.ts:116](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/core/src/types/index.ts#L116)

Represents an EVM wallet address with optional chain binding.

##### Example

```typescript
const wallet: Wallet = {
  address: '0x742d35Cc6634C0532925a3b844Bc9e7595f1b3e1',
  chainId: 1,
};
```

### Market Data

#### PriceData

```ts
type PriceData = z.infer<typeof PriceDataSchema>;
```

Defined in: [core/src/types/index.ts:250](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/core/src/types/index.ts#L250)

Represents market price data for a token or asset.

##### Example

```typescript
const btcPrice: PriceData = {
  symbol: 'BTC',
  price: 45000.50,
  change24h: 2.5,
  volume24h: 25000000000,
  marketCap: 880000000000,
  timestamp: Date.now(),
};
```

### Payments

#### X402Payment

```ts
type X402Payment = z.infer<typeof X402PaymentSchema>;
```

Defined in: [core/src/types/index.ts:329](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/core/src/types/index.ts#L329)

Configuration for x402 HTTP Payment Required protocol.

x402 enables pay-per-request APIs where AI agents can autonomously
pay for API access using cryptocurrency.

##### See

https://www.x402.org

##### Example

```typescript
const payment: X402Payment = {
  payTo: '0x742d35Cc6634C0532925a3b844Bc9e7595f1b3e1',
  price: '0.001',
  network: 'base',
  token: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // USDC on Base
};
```

### Tokens

#### Token

```ts
type Token = z.infer<typeof TokenSchema>;
```

Defined in: [core/src/types/index.ts:161](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/core/src/types/index.ts#L161)

Represents an ERC-20 compatible token.

Tokens are the fundamental unit of value in DeFi. This type captures
all metadata needed to interact with a token across chains.

##### Example

```typescript
const usdc: Token = {
  address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  symbol: 'USDC',
  name: 'USD Coin',
  decimals: 6,
  chainId: 1,
  logoURI: 'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png',
};
```

### Transactions

#### Transaction

```ts
type Transaction = z.infer<typeof TransactionSchema>;
```

Defined in: [core/src/types/index.ts:208](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/core/src/types/index.ts#L208)

Represents a blockchain transaction.

Transactions are the fundamental unit of state change on blockchains.
This type captures the core transaction data needed for tracking and display.

##### Example

```typescript
const tx: Transaction = {
  hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
  from: '0x742d35Cc6634C0532925a3b844Bc9e7595f1b3e1',
  to: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  value: '1000000000000000000',
  chainId: 1,
  status: 'confirmed',
};
```

## Variables

### Core

#### NetworkSchema

```ts
const NetworkSchema: ZodObject<{
  blockExplorer: ZodOptional<ZodString>;
  chainId: ZodNumber;
  name: ZodString;
  nativeCurrency: ZodObject<{
     decimals: ZodNumber;
     name: ZodString;
     symbol: ZodString;
   }, "strip", ZodTypeAny, {
     decimals: number;
     name: string;
     symbol: string;
   }, {
     decimals: number;
     name: string;
     symbol: string;
  }>;
  rpcUrl: ZodString;
}, "strip", ZodTypeAny, {
  blockExplorer?: string;
  chainId: number;
  name: string;
  nativeCurrency: {
     decimals: number;
     name: string;
     symbol: string;
  };
  rpcUrl: string;
}, {
  blockExplorer?: string;
  chainId: number;
  name: string;
  nativeCurrency: {
     decimals: number;
     name: string;
     symbol: string;
  };
  rpcUrl: string;
}>;
```

Defined in: [core/src/types/index.ts:48](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/core/src/types/index.ts#L48)

Zod schema for validating blockchain network configurations.

##### Example

```typescript
const result = NetworkSchema.safeParse({
  chainId: 1,
  name: 'Ethereum',
  rpcUrl: 'https://eth.llamarpc.com',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
});
```

### Wallets

#### WalletSchema

```ts
const WalletSchema: ZodObject<{
  address: ZodString;
  chainId: ZodOptional<ZodNumber>;
}, "strip", ZodTypeAny, {
  address: string;
  chainId?: number;
}, {
  address: string;
  chainId?: number;
}>;
```

Defined in: [core/src/types/index.ts:97](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/core/src/types/index.ts#L97)

Zod schema for validating wallet addresses.

### Market Data

#### PriceDataSchema

```ts
const PriceDataSchema: ZodObject<{
  change24h: ZodOptional<ZodNumber>;
  marketCap: ZodOptional<ZodNumber>;
  price: ZodNumber;
  symbol: ZodString;
  timestamp: ZodNumber;
  volume24h: ZodOptional<ZodNumber>;
}, "strip", ZodTypeAny, {
  change24h?: number;
  marketCap?: number;
  price: number;
  symbol: string;
  timestamp: number;
  volume24h?: number;
}, {
  change24h?: number;
  marketCap?: number;
  price: number;
  symbol: string;
  timestamp: number;
  volume24h?: number;
}>;
```

Defined in: [core/src/types/index.ts:219](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/core/src/types/index.ts#L219)

Zod schema for validating price data.

### Payments

#### X402PaymentSchema

```ts
const X402PaymentSchema: ZodObject<{
  network: ZodString;
  payTo: ZodString;
  price: ZodString;
  token: ZodOptional<ZodString>;
}, "strip", ZodTypeAny, {
  network: string;
  payTo: string;
  price: string;
  token?: string;
}, {
  network: string;
  payTo: string;
  price: string;
  token?: string;
}>;
```

Defined in: [core/src/types/index.ts:300](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/core/src/types/index.ts#L300)

Zod schema for validating x402 payment configurations.

### Tokens

#### TokenSchema

```ts
const TokenSchema: ZodObject<{
  address: ZodString;
  chainId: ZodNumber;
  decimals: ZodNumber;
  logoURI: ZodOptional<ZodString>;
  name: ZodString;
  symbol: ZodString;
}, "strip", ZodTypeAny, {
  address: string;
  chainId: number;
  decimals: number;
  logoURI?: string;
  name: string;
  symbol: string;
}, {
  address: string;
  chainId: number;
  decimals: number;
  logoURI?: string;
  name: string;
  symbol: string;
}>;
```

Defined in: [core/src/types/index.ts:127](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/core/src/types/index.ts#L127)

Zod schema for validating ERC-20 token configurations.

### Transactions

#### TransactionSchema

```ts
const TransactionSchema: ZodObject<{
  chainId: ZodNumber;
  data: ZodOptional<ZodString>;
  from: ZodString;
  hash: ZodString;
  status: ZodOptional<ZodEnum<["pending", "confirmed", "failed"]>>;
  to: ZodOptional<ZodString>;
  value: ZodString;
}, "strip", ZodTypeAny, {
  chainId: number;
  data?: string;
  from: string;
  hash: string;
  status?: "pending" | "confirmed" | "failed";
  to?: string;
  value: string;
}, {
  chainId: number;
  data?: string;
  from: string;
  hash: string;
  status?: "pending" | "confirmed" | "failed";
  to?: string;
  value: string;
}>;
```

Defined in: [core/src/types/index.ts:172](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/core/src/types/index.ts#L172)

Zod schema for validating blockchain transactions.

