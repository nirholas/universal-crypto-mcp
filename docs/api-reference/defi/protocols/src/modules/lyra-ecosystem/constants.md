[**Universal Crypto MCP API Reference v1.0.0**](../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/modules/lyra-ecosystem/constants

# defi/protocols/src/modules/lyra-ecosystem/constants

## Type Aliases

### LyraNetworkConfig

```ts
type LyraNetworkConfig = typeof LYRA_NETWORKS[LyraNetworkId];
```

Defined in: [defi/protocols/src/modules/lyra-ecosystem/constants.ts:199](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L199)

***

### LyraNetworkId

```ts
type LyraNetworkId = keyof typeof LYRA_NETWORKS;
```

Defined in: [defi/protocols/src/modules/lyra-ecosystem/constants.ts:198](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L198)

***

### PaymentToken

```ts
type PaymentToken = "USDC" | "USDT" | "USDs" | "DAI";
```

Defined in: [defi/protocols/src/modules/lyra-ecosystem/constants.ts:277](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L277)

## Variables

### DEFAULT\_TOKEN\_PER\_CHAIN

```ts
const DEFAULT_TOKEN_PER_CHAIN: Record<LyraNetworkId, PaymentToken>;
```

Defined in: [defi/protocols/src/modules/lyra-ecosystem/constants.ts:312](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L312)

Default token per chain

***

### DISCOVERABLE\_PROTOCOLS

```ts
const DISCOVERABLE_PROTOCOLS: readonly ["mcp", "openapi", "graphql", "grpc", "rest", "websocket"];
```

Defined in: [defi/protocols/src/modules/lyra-ecosystem/constants.ts:414](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L414)

***

### LYRA\_API\_VERSION

```ts
const LYRA_API_VERSION: "v1" = "v1";
```

Defined in: [defi/protocols/src/modules/lyra-ecosystem/constants.ts:356](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L356)

***

### LYRA\_CACHE\_CONFIG

```ts
const LYRA_CACHE_CONFIG: {
  defaultTtlMs: number;
  enabledByDefault: true;
  maxEntries: 1000;
};
```

Defined in: [defi/protocols/src/modules/lyra-ecosystem/constants.ts:362](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L362)

#### Type Declaration

| Name | Type | Default value | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="defaultttlms"></a> `defaultTtlMs` | `number` | - | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:363](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L363) |
| <a id="enabledbydefault"></a> `enabledByDefault` | `true` | `true` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:365](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L365) |
| <a id="maxentries"></a> `maxEntries` | `1000` | `1000` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:364](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L364) |

***

### LYRA\_CHAIN\_FACILITATORS

```ts
const LYRA_CHAIN_FACILITATORS: Partial<Record<LyraNetworkId, string>> = {};
```

Defined in: [defi/protocols/src/modules/lyra-ecosystem/constants.ts:333](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L333)

Chain-specific facilitators (if different from default)

***

### LYRA\_DEFAULT\_NETWORK

```ts
const LYRA_DEFAULT_NETWORK: 
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

Defined in: [defi/protocols/src/modules/lyra-ecosystem/constants.ts:205](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L205)

Default network for payments

***

### LYRA\_FACILITATOR\_URL

```ts
const LYRA_FACILITATOR_URL: "https://x402.org/facilitator" = "https://x402.org/facilitator";
```

Defined in: [defi/protocols/src/modules/lyra-ecosystem/constants.ts:330](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L330)

***

### LYRA\_NETWORKS

```ts
const LYRA_NETWORKS: {
  arbitrum: {
     caip2: "eip155:42161";
     chainId: 42161;
     gasToken: "ETH";
     name: "Arbitrum One";
     testnet: false;
     type: "evm";
     usdc: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831";
     usds: "0xD74f5255D557944cf7Dd0E45FF521520002D5748";
  };
  arbitrum-sepolia: {
     caip2: "eip155:421614";
     chainId: 421614;
     gasToken: "ETH";
     name: "Arbitrum Sepolia";
     testnet: true;
     type: "evm";
     usdc: "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d";
  };
  base: {
     caip2: "eip155:8453";
     chainId: 8453;
     gasToken: "ETH";
     name: "Base";
     testnet: false;
     type: "evm";
     usdc: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
  };
  base-sepolia: {
     caip2: "eip155:84532";
     chainId: 84532;
     gasToken: "ETH";
     name: "Base Sepolia";
     testnet: true;
     type: "evm";
     usdc: "0x036CbD53842c5426634e7929541eC2318f3dCF7e";
  };
  bsc: {
     caip2: "eip155:56";
     chainId: 56;
     gasToken: "BNB";
     name: "BNB Smart Chain";
     testnet: false;
     type: "evm";
     usdc: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d";
     usdt: "0x55d398326f99059fF775485246999027B3197955";
  };
  bsc-testnet: {
     caip2: "eip155:97";
     chainId: 97;
     gasToken: "BNB";
     name: "BNB Testnet";
     testnet: true;
     type: "evm";
     usdc: "0x64544969ed7EBf5f083679233325356EbE738930";
  };
  ethereum: {
     caip2: "eip155:1";
     chainId: 1;
     gasToken: "ETH";
     name: "Ethereum";
     testnet: false;
     type: "evm";
     usdc: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
  };
  optimism: {
     caip2: "eip155:10";
     chainId: 10;
     gasToken: "ETH";
     name: "Optimism";
     testnet: false;
     type: "evm";
     usdc: "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85";
  };
  polygon: {
     caip2: "eip155:137";
     chainId: 137;
     gasToken: "MATIC";
     name: "Polygon";
     testnet: false;
     type: "evm";
     usdc: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359";
  };
  solana-devnet: {
     caip2: "solana:devnet";
     chainId: "devnet";
     gasToken: "SOL";
     name: "Solana Devnet";
     testnet: true;
     type: "svm";
     usdc: "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU";
  };
  solana-mainnet: {
     caip2: "solana:mainnet";
     chainId: "mainnet-beta";
     gasToken: "SOL";
     name: "Solana Mainnet";
     testnet: false;
     type: "svm";
     usdc: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
  };
};
```

Defined in: [defi/protocols/src/modules/lyra-ecosystem/constants.ts:92](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L92)

Supported payment networks with CAIP-2 identifiers
https://github.com/ChainAgnostic/CAIPs/blob/master/CAIPs/caip-2.md

#### Type Declaration

| Name | Type | Default value | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="arbitrum"></a> `arbitrum` | \{ `caip2`: `"eip155:42161"`; `chainId`: `42161`; `gasToken`: `"ETH"`; `name`: `"Arbitrum One"`; `testnet`: `false`; `type`: `"evm"`; `usdc`: `"0xaf88d065e77c8cC2239327C5EDb3A432268e5831"`; `usds`: `"0xD74f5255D557944cf7Dd0E45FF521520002D5748"`; \} | - | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:112](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L112) |
| `arbitrum.caip2` | `"eip155:42161"` | `"eip155:42161"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:113](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L113) |
| `arbitrum.chainId` | `42161` | `42161` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:115](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L115) |
| `arbitrum.gasToken` | `"ETH"` | `"ETH"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:120](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L120) |
| `arbitrum.name` | `"Arbitrum One"` | `"Arbitrum One"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:114](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L114) |
| `arbitrum.testnet` | `false` | `false` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:117](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L117) |
| `arbitrum.type` | `"evm"` | - | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:116](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L116) |
| `arbitrum.usdc` | `"0xaf88d065e77c8cC2239327C5EDb3A432268e5831"` | `"0xaf88d065e77c8cC2239327C5EDb3A432268e5831"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:118](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L118) |
| `arbitrum.usds` | `"0xD74f5255D557944cf7Dd0E45FF521520002D5748"` | `"0xD74f5255D557944cf7Dd0E45FF521520002D5748"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:119](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L119) |
| <a id="arbitrum-sepolia"></a> `arbitrum-sepolia` | \{ `caip2`: `"eip155:421614"`; `chainId`: `421614`; `gasToken`: `"ETH"`; `name`: `"Arbitrum Sepolia"`; `testnet`: `true`; `type`: `"evm"`; `usdc`: `"0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d"`; \} | - | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:122](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L122) |
| `arbitrum-sepolia.caip2` | `"eip155:421614"` | `"eip155:421614"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:123](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L123) |
| `arbitrum-sepolia.chainId` | `421614` | `421614` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:125](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L125) |
| `arbitrum-sepolia.gasToken` | `"ETH"` | `"ETH"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:129](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L129) |
| `arbitrum-sepolia.name` | `"Arbitrum Sepolia"` | `"Arbitrum Sepolia"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:124](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L124) |
| `arbitrum-sepolia.testnet` | `true` | `true` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:127](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L127) |
| `arbitrum-sepolia.type` | `"evm"` | - | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:126](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L126) |
| `arbitrum-sepolia.usdc` | `"0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d"` | `"0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:128](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L128) |
| <a id="base"></a> `base` | \{ `caip2`: `"eip155:8453"`; `chainId`: `8453`; `gasToken`: `"ETH"`; `name`: `"Base"`; `testnet`: `false`; `type`: `"evm"`; `usdc`: `"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"`; \} | - | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:94](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L94) |
| `base.caip2` | `"eip155:8453"` | `"eip155:8453"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:95](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L95) |
| `base.chainId` | `8453` | `8453` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:97](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L97) |
| `base.gasToken` | `"ETH"` | `"ETH"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:101](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L101) |
| `base.name` | `"Base"` | `"Base"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:96](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L96) |
| `base.testnet` | `false` | `false` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:99](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L99) |
| `base.type` | `"evm"` | - | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:98](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L98) |
| `base.usdc` | `"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"` | `"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:100](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L100) |
| <a id="base-sepolia"></a> `base-sepolia` | \{ `caip2`: `"eip155:84532"`; `chainId`: `84532`; `gasToken`: `"ETH"`; `name`: `"Base Sepolia"`; `testnet`: `true`; `type`: `"evm"`; `usdc`: `"0x036CbD53842c5426634e7929541eC2318f3dCF7e"`; \} | - | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:103](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L103) |
| `base-sepolia.caip2` | `"eip155:84532"` | `"eip155:84532"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:104](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L104) |
| `base-sepolia.chainId` | `84532` | `84532` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:106](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L106) |
| `base-sepolia.gasToken` | `"ETH"` | `"ETH"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:110](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L110) |
| `base-sepolia.name` | `"Base Sepolia"` | `"Base Sepolia"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:105](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L105) |
| `base-sepolia.testnet` | `true` | `true` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:108](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L108) |
| `base-sepolia.type` | `"evm"` | - | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:107](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L107) |
| `base-sepolia.usdc` | `"0x036CbD53842c5426634e7929541eC2318f3dCF7e"` | `"0x036CbD53842c5426634e7929541eC2318f3dCF7e"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:109](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L109) |
| <a id="bsc"></a> `bsc` | \{ `caip2`: `"eip155:56"`; `chainId`: `56`; `gasToken`: `"BNB"`; `name`: `"BNB Smart Chain"`; `testnet`: `false`; `type`: `"evm"`; `usdc`: `"0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d"`; `usdt`: `"0x55d398326f99059fF775485246999027B3197955"`; \} | - | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:131](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L131) |
| `bsc.caip2` | `"eip155:56"` | `"eip155:56"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:132](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L132) |
| `bsc.chainId` | `56` | `56` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:134](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L134) |
| `bsc.gasToken` | `"BNB"` | `"BNB"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:139](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L139) |
| `bsc.name` | `"BNB Smart Chain"` | `"BNB Smart Chain"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:133](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L133) |
| `bsc.testnet` | `false` | `false` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:136](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L136) |
| `bsc.type` | `"evm"` | - | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:135](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L135) |
| `bsc.usdc` | `"0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d"` | `"0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:137](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L137) |
| `bsc.usdt` | `"0x55d398326f99059fF775485246999027B3197955"` | `"0x55d398326f99059fF775485246999027B3197955"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:138](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L138) |
| <a id="bsc-testnet"></a> `bsc-testnet` | \{ `caip2`: `"eip155:97"`; `chainId`: `97`; `gasToken`: `"BNB"`; `name`: `"BNB Testnet"`; `testnet`: `true`; `type`: `"evm"`; `usdc`: `"0x64544969ed7EBf5f083679233325356EbE738930"`; \} | - | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:141](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L141) |
| `bsc-testnet.caip2` | `"eip155:97"` | `"eip155:97"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:142](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L142) |
| `bsc-testnet.chainId` | `97` | `97` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:144](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L144) |
| `bsc-testnet.gasToken` | `"BNB"` | `"BNB"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:148](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L148) |
| `bsc-testnet.name` | `"BNB Testnet"` | `"BNB Testnet"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:143](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L143) |
| `bsc-testnet.testnet` | `true` | `true` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:146](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L146) |
| `bsc-testnet.type` | `"evm"` | - | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:145](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L145) |
| `bsc-testnet.usdc` | `"0x64544969ed7EBf5f083679233325356EbE738930"` | `"0x64544969ed7EBf5f083679233325356EbE738930"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:147](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L147) |
| <a id="ethereum"></a> `ethereum` | \{ `caip2`: `"eip155:1"`; `chainId`: `1`; `gasToken`: `"ETH"`; `name`: `"Ethereum"`; `testnet`: `false`; `type`: `"evm"`; `usdc`: `"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"`; \} | - | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:150](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L150) |
| `ethereum.caip2` | `"eip155:1"` | `"eip155:1"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:151](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L151) |
| `ethereum.chainId` | `1` | `1` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:153](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L153) |
| `ethereum.gasToken` | `"ETH"` | `"ETH"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:157](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L157) |
| `ethereum.name` | `"Ethereum"` | `"Ethereum"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:152](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L152) |
| `ethereum.testnet` | `false` | `false` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:155](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L155) |
| `ethereum.type` | `"evm"` | - | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:154](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L154) |
| `ethereum.usdc` | `"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"` | `"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:156](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L156) |
| <a id="optimism"></a> `optimism` | \{ `caip2`: `"eip155:10"`; `chainId`: `10`; `gasToken`: `"ETH"`; `name`: `"Optimism"`; `testnet`: `false`; `type`: `"evm"`; `usdc`: `"0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85"`; \} | - | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:168](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L168) |
| `optimism.caip2` | `"eip155:10"` | `"eip155:10"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:169](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L169) |
| `optimism.chainId` | `10` | `10` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:171](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L171) |
| `optimism.gasToken` | `"ETH"` | `"ETH"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:175](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L175) |
| `optimism.name` | `"Optimism"` | `"Optimism"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:170](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L170) |
| `optimism.testnet` | `false` | `false` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:173](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L173) |
| `optimism.type` | `"evm"` | - | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:172](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L172) |
| `optimism.usdc` | `"0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85"` | `"0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:174](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L174) |
| <a id="polygon"></a> `polygon` | \{ `caip2`: `"eip155:137"`; `chainId`: `137`; `gasToken`: `"MATIC"`; `name`: `"Polygon"`; `testnet`: `false`; `type`: `"evm"`; `usdc`: `"0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359"`; \} | - | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:159](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L159) |
| `polygon.caip2` | `"eip155:137"` | `"eip155:137"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:160](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L160) |
| `polygon.chainId` | `137` | `137` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:162](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L162) |
| `polygon.gasToken` | `"MATIC"` | `"MATIC"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:166](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L166) |
| `polygon.name` | `"Polygon"` | `"Polygon"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:161](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L161) |
| `polygon.testnet` | `false` | `false` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:164](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L164) |
| `polygon.type` | `"evm"` | - | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:163](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L163) |
| `polygon.usdc` | `"0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359"` | `"0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:165](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L165) |
| <a id="solana-devnet"></a> `solana-devnet` | \{ `caip2`: `"solana:devnet"`; `chainId`: `"devnet"`; `gasToken`: `"SOL"`; `name`: `"Solana Devnet"`; `testnet`: `true`; `type`: `"svm"`; `usdc`: `"4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"`; \} | - | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:187](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L187) |
| `solana-devnet.caip2` | `"solana:devnet"` | `"solana:devnet"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:188](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L188) |
| `solana-devnet.chainId` | `"devnet"` | `"devnet"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:190](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L190) |
| `solana-devnet.gasToken` | `"SOL"` | `"SOL"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:194](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L194) |
| `solana-devnet.name` | `"Solana Devnet"` | `"Solana Devnet"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:189](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L189) |
| `solana-devnet.testnet` | `true` | `true` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:192](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L192) |
| `solana-devnet.type` | `"svm"` | - | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:191](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L191) |
| `solana-devnet.usdc` | `"4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"` | `"4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:193](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L193) |
| <a id="solana-mainnet"></a> `solana-mainnet` | \{ `caip2`: `"solana:mainnet"`; `chainId`: `"mainnet-beta"`; `gasToken`: `"SOL"`; `name`: `"Solana Mainnet"`; `testnet`: `false`; `type`: `"svm"`; `usdc`: `"EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"`; \} | - | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:178](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L178) |
| `solana-mainnet.caip2` | `"solana:mainnet"` | `"solana:mainnet"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:179](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L179) |
| `solana-mainnet.chainId` | `"mainnet-beta"` | `"mainnet-beta"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:181](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L181) |
| `solana-mainnet.gasToken` | `"SOL"` | `"SOL"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:185](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L185) |
| `solana-mainnet.name` | `"Solana Mainnet"` | `"Solana Mainnet"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:180](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L180) |
| `solana-mainnet.testnet` | `false` | `false` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:183](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L183) |
| `solana-mainnet.type` | `"svm"` | - | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:182](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L182) |
| `solana-mainnet.usdc` | `"EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"` | `"EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:184](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L184) |

***

### LYRA\_PRICES

```ts
const LYRA_PRICES: {
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

Defined in: [defi/protocols/src/modules/lyra-ecosystem/constants.ts:41](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L41)

#### Type Declaration

| Name | Type | Default value | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="discovery"></a> `discovery` | \{ `basicDiscovery`: `"0.00"`; `compatibility`: `"0.02"`; `fullAssistance`: `"0.50"`; `generateConfig`: `"0.10"`; \} | - | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:57](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L57) |
| `discovery.basicDiscovery` | `"0.00"` | `"0.00"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:58](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L58) |
| `discovery.compatibility` | `"0.02"` | `"0.02"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:59](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L59) |
| `discovery.fullAssistance` | `"0.50"` | `"0.50"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:61](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L61) |
| `discovery.generateConfig` | `"0.10"` | `"0.10"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:60](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L60) |
| <a id="intel"></a> `intel` | \{ `enterpriseAnalysis`: `"1.00"`; `fileAnalysis`: `"0.00"`; `repoAudit`: `"0.10"`; `securityScan`: `"0.05"`; \} | - | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:43](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L43) |
| `intel.enterpriseAnalysis` | `"1.00"` | `"1.00"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:47](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L47) |
| `intel.fileAnalysis` | `"0.00"` | `"0.00"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:44](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L44) |
| `intel.repoAudit` | `"0.10"` | `"0.10"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:46](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L46) |
| `intel.securityScan` | `"0.05"` | `"0.05"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:45](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L45) |
| <a id="registry"></a> `registry` | \{ `browse`: `"0.00"`; `featuredListing`: `"10.00"`; `privateRegistration`: `"0.05"`; `toolDetails`: `"0.01"`; \} | - | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:50](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L50) |
| `registry.browse` | `"0.00"` | `"0.00"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:51](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L51) |
| `registry.featuredListing` | `"10.00"` | `"10.00"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:54](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L54) |
| `registry.privateRegistration` | `"0.05"` | `"0.05"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:53](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L53) |
| `registry.toolDetails` | `"0.01"` | `"0.01"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:52](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L52) |

***

### LYRA\_RATE\_LIMITS

```ts
const LYRA_RATE_LIMITS: {
  discovery: {
     free: 30;
     paid: 300;
  };
  intel: {
     free: 10;
     paid: 100;
  };
  registry: {
     free: 60;
     paid: 600;
  };
};
```

Defined in: [defi/protocols/src/modules/lyra-ecosystem/constants.ts:69](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L69)

#### Type Declaration

| Name | Type | Default value | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="discovery-1"></a> `discovery` | \{ `free`: `30`; `paid`: `300`; \} | - | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:78](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L78) |
| `discovery.free` | `30` | `30` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:79](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L79) |
| `discovery.paid` | `300` | `300` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:80](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L80) |
| <a id="intel-1"></a> `intel` | \{ `free`: `10`; `paid`: `100`; \} | - | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:70](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L70) |
| `intel.free` | `10` | `10` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:71](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L71) |
| `intel.paid` | `100` | `100` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:72](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L72) |
| <a id="registry-1"></a> `registry` | \{ `free`: `60`; `paid`: `600`; \} | - | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:74](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L74) |
| `registry.free` | `60` | `60` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:75](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L75) |
| `registry.paid` | `600` | `600` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:76](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L76) |

***

### LYRA\_RECOMMENDED\_NETWORKS

```ts
const LYRA_RECOMMENDED_NETWORKS: {
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

Defined in: [defi/protocols/src/modules/lyra-ecosystem/constants.ts:208](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L208)

Recommended networks by use case

#### Type Declaration

| Name | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="lowcost"></a> `lowCost` | ( \| `"base-sepolia"` \| `"ethereum"` \| `"bsc"` \| `"base"` \| `"arbitrum"` \| `"arbitrum-sepolia"` \| `"bsc-testnet"` \| `"polygon"` \| `"optimism"` \| `"solana-mainnet"` \| `"solana-devnet"`)[] | Lowest fees, fast finality | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:210](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L210) |
| <a id="secure"></a> `secure` | ( \| `"base-sepolia"` \| `"ethereum"` \| `"bsc"` \| `"base"` \| `"arbitrum"` \| `"arbitrum-sepolia"` \| `"bsc-testnet"` \| `"polygon"` \| `"optimism"` \| `"solana-mainnet"` \| `"solana-devnet"`)[] | Most secure, battle-tested | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:212](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L212) |
| <a id="solana"></a> `solana` | ( \| `"base-sepolia"` \| `"ethereum"` \| `"bsc"` \| `"base"` \| `"arbitrum"` \| `"arbitrum-sepolia"` \| `"bsc-testnet"` \| `"polygon"` \| `"optimism"` \| `"solana-mainnet"` \| `"solana-devnet"`)[] | Best for non-EVM users | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:214](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L214) |
| <a id="testnet"></a> `testnet` | ( \| `"base-sepolia"` \| `"ethereum"` \| `"bsc"` \| `"base"` \| `"arbitrum"` \| `"arbitrum-sepolia"` \| `"bsc-testnet"` \| `"polygon"` \| `"optimism"` \| `"solana-mainnet"` \| `"solana-devnet"`)[] | For testing | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:216](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L216) |
| <a id="yieldbearing"></a> `yieldBearing` | ( \| `"base-sepolia"` \| `"ethereum"` \| `"bsc"` \| `"base"` \| `"arbitrum"` \| `"arbitrum-sepolia"` \| `"bsc-testnet"` \| `"polygon"` \| `"optimism"` \| `"solana-mainnet"` \| `"solana-devnet"`)[] | Yield-bearing payments with USDs | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:218](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L218) |

***

### LYRA\_REPOS

```ts
const LYRA_REPOS: {
  discovery: "nirholas/lyra-tool-discovery";
  intel: "nirholas/lyra-intel";
  registry: "nirholas/lyra-registry";
};
```

Defined in: [defi/protocols/src/modules/lyra-ecosystem/constants.ts:31](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L31)

#### Type Declaration

| Name | Type | Default value | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="discovery-2"></a> `discovery` | `"nirholas/lyra-tool-discovery"` | `"nirholas/lyra-tool-discovery"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:34](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L34) |
| <a id="intel-2"></a> `intel` | `"nirholas/lyra-intel"` | `"nirholas/lyra-intel"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:32](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L32) |
| <a id="registry-2"></a> `registry` | `"nirholas/lyra-registry"` | `"nirholas/lyra-registry"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:33](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L33) |

***

### LYRA\_SERVICE\_URLS

```ts
const LYRA_SERVICE_URLS: {
  discovery: {
     production: "https://api.lyra-discovery.dev";
     staging: "https://staging.lyra-discovery.dev";
  };
  intel: {
     production: "https://api.lyra-intel.dev";
     staging: "https://staging.lyra-intel.dev";
  };
  registry: {
     production: "https://api.lyra-registry.dev";
     staging: "https://staging.lyra-registry.dev";
  };
};
```

Defined in: [defi/protocols/src/modules/lyra-ecosystem/constants.ts:12](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L12)

#### Type Declaration

| Name | Type | Default value | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="discovery-3"></a> `discovery` | \{ `production`: `"https://api.lyra-discovery.dev"`; `staging`: `"https://staging.lyra-discovery.dev"`; \} | - | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:21](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L21) |
| `discovery.production` | `"https://api.lyra-discovery.dev"` | `"https://api.lyra-discovery.dev"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:22](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L22) |
| `discovery.staging` | `"https://staging.lyra-discovery.dev"` | `"https://staging.lyra-discovery.dev"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:23](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L23) |
| <a id="intel-3"></a> `intel` | \{ `production`: `"https://api.lyra-intel.dev"`; `staging`: `"https://staging.lyra-intel.dev"`; \} | - | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:13](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L13) |
| `intel.production` | `"https://api.lyra-intel.dev"` | `"https://api.lyra-intel.dev"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:14](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L14) |
| `intel.staging` | `"https://staging.lyra-intel.dev"` | `"https://staging.lyra-intel.dev"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:15](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L15) |
| <a id="registry-3"></a> `registry` | \{ `production`: `"https://api.lyra-registry.dev"`; `staging`: `"https://staging.lyra-registry.dev"`; \} | - | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:17](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L17) |
| `registry.production` | `"https://api.lyra-registry.dev"` | `"https://api.lyra-registry.dev"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:18](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L18) |
| `registry.staging` | `"https://staging.lyra-registry.dev"` | `"https://staging.lyra-registry.dev"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:19](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L19) |

***

### LYRA\_SUPPORTED\_NETWORKS

```ts
const LYRA_SUPPORTED_NETWORKS: (
  | "eip155:1"
  | "eip155:42161"
  | "eip155:8453"
  | "eip155:84532"
  | "eip155:137"
  | "eip155:10"
  | "eip155:56"
  | "eip155:421614"
  | "eip155:97"
  | "solana:mainnet"
  | "solana:devnet")[];
```

Defined in: [defi/protocols/src/modules/lyra-ecosystem/constants.ts:202](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L202)

Legacy array for backward compatibility

***

### LYRA\_TREASURY\_ADDRESS

```ts
const LYRA_TREASURY_ADDRESS: "0x742d35Cc6634C0532925a3b844Bc9e7595f50a1a" = LYRA_TREASURY_ADDRESSES.evm;
```

Defined in: [defi/protocols/src/modules/lyra-ecosystem/constants.ts:350](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L350)

Legacy single address

***

### LYRA\_TREASURY\_ADDRESSES

```ts
const LYRA_TREASURY_ADDRESSES: {
  evm: "0x742d35Cc6634C0532925a3b844Bc9e7595f50a1a";
  solana: "LyraT8kuFd5G7TnJMVpxQh5xJHHmRZQKWPDxvPZQnXk";
};
```

Defined in: [defi/protocols/src/modules/lyra-ecosystem/constants.ts:342](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L342)

#### Type Declaration

| Name | Type | Default value | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="evm"></a> `evm` | `"0x742d35Cc6634C0532925a3b844Bc9e7595f50a1a"` | `"0x742d35Cc6634C0532925a3b844Bc9e7595f50a1a"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:344](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L344) |
| <a id="solana-1"></a> `solana` | `"LyraT8kuFd5G7TnJMVpxQh5xJHHmRZQKWPDxvPZQnXk"` | `"LyraT8kuFd5G7TnJMVpxQh5xJHHmRZQKWPDxvPZQnXk"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:346](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L346) |

***

### PAYMENT\_TOKENS

```ts
const PAYMENT_TOKENS: Record<PaymentToken, {
  chains: LyraNetworkId[];
  decimals: number;
  name: string;
  yieldBearing: boolean;
}>;
```

Defined in: [defi/protocols/src/modules/lyra-ecosystem/constants.ts:279](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L279)

***

### SPERAX\_CONTRACTS

```ts
const SPERAX_CONTRACTS: {
  arbitrum: {
     spa: "0x5575552988A3A80504bBaeB1311674fCFd40aD4B";
     usds: "0xD74f5255D557944cf7Dd0E45FF521520002D5748";
     vespa: "0x2e2071180682Ce6C247B1eF93d382D509F5F6A17";
     xspa: "0x0966E72256d6055145902F72F9D3B6a194B9cCc3";
  };
  bsc: {
     spa: "0x1A9Fd6eC3144Da3Dd6Ea13Ec1C25C58423a379b1";
  };
  ethereum: {
     spa: "0xB4A3B0Faf0Ab53df58001804DdA5Bfc6a3D59008";
     vespa: "0xbF82a3212e13b2d407D10f5107b5C8404dE7F403";
     wspa: "0x2a95FE4c7e64e09856989F9eA0b57B9AB5f770CB";
  };
};
```

Defined in: [defi/protocols/src/modules/lyra-ecosystem/constants.ts:230](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L230)

Sperax ecosystem contract addresses
USDs is a yield-bearing stablecoin - holders automatically earn yield!
https://docs.sperax.io/

#### Type Declaration

| Name | Type | Default value | Description | Defined in |
| :------ | :------ | :------ | :------ | :------ |
| <a id="arbitrum-1"></a> `arbitrum` | \{ `spa`: `"0x5575552988A3A80504bBaeB1311674fCFd40aD4B"`; `usds`: `"0xD74f5255D557944cf7Dd0E45FF521520002D5748"`; `vespa`: `"0x2e2071180682Ce6C247B1eF93d382D509F5F6A17"`; `xspa`: `"0x0966E72256d6055145902F72F9D3B6a194B9cCc3"`; \} | - | - | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:231](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L231) |
| `arbitrum.spa` | `"0x5575552988A3A80504bBaeB1311674fCFd40aD4B"` | `"0x5575552988A3A80504bBaeB1311674fCFd40aD4B"` | SPA - Governance token | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:235](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L235) |
| `arbitrum.usds` | `"0xD74f5255D557944cf7Dd0E45FF521520002D5748"` | `"0xD74f5255D557944cf7Dd0E45FF521520002D5748"` | USDs - Yield-bearing stablecoin | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:233](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L233) |
| `arbitrum.vespa` | `"0x2e2071180682Ce6C247B1eF93d382D509F5F6A17"` | `"0x2e2071180682Ce6C247B1eF93d382D509F5F6A17"` | veSPA - Vote-escrowed SPA (proxy) | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:239](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L239) |
| `arbitrum.xspa` | `"0x0966E72256d6055145902F72F9D3B6a194B9cCc3"` | `"0x0966E72256d6055145902F72F9D3B6a194B9cCc3"` | xSPA - Staked SPA | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:237](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L237) |
| <a id="bsc-1"></a> `bsc` | \{ `spa`: `"0x1A9Fd6eC3144Da3Dd6Ea13Ec1C25C58423a379b1"`; \} | - | - | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:249](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L249) |
| `bsc.spa` | `"0x1A9Fd6eC3144Da3Dd6Ea13Ec1C25C58423a379b1"` | `"0x1A9Fd6eC3144Da3Dd6Ea13Ec1C25C58423a379b1"` | SPA on BSC | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:251](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L251) |
| <a id="ethereum-1"></a> `ethereum` | \{ `spa`: `"0xB4A3B0Faf0Ab53df58001804DdA5Bfc6a3D59008"`; `vespa`: `"0xbF82a3212e13b2d407D10f5107b5C8404dE7F403"`; `wspa`: `"0x2a95FE4c7e64e09856989F9eA0b57B9AB5f770CB"`; \} | - | - | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:241](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L241) |
| `ethereum.spa` | `"0xB4A3B0Faf0Ab53df58001804DdA5Bfc6a3D59008"` | `"0xB4A3B0Faf0Ab53df58001804DdA5Bfc6a3D59008"` | SPA L1 | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:243](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L243) |
| `ethereum.vespa` | `"0xbF82a3212e13b2d407D10f5107b5C8404dE7F403"` | `"0xbF82a3212e13b2d407D10f5107b5C8404dE7F403"` | veSPA (proxy) | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:247](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L247) |
| `ethereum.wspa` | `"0x2a95FE4c7e64e09856989F9eA0b57B9AB5f770CB"` | `"0x2a95FE4c7e64e09856989F9eA0b57B9AB5f770CB"` | wSPA (wrapped) | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:245](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L245) |

***

### SUPPORTED\_LANGUAGES

```ts
const SUPPORTED_LANGUAGES: readonly ["typescript", "javascript", "python", "rust", "go", "java", "kotlin", "swift", "c", "cpp", "csharp", "ruby", "php", "solidity", "move", "cairo"];
```

Defined in: [defi/protocols/src/modules/lyra-ecosystem/constants.ts:372](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L372)

***

### TOOL\_CATEGORIES

```ts
const TOOL_CATEGORIES: readonly ["ai-ml", "blockchain", "data", "devops", "finance", "gaming", "media", "productivity", "security", "social", "utilities", "web3"];
```

Defined in: [defi/protocols/src/modules/lyra-ecosystem/constants.ts:395](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L395)

***

### USDS\_BENEFITS

```ts
const USDS_BENEFITS: {
  autoYield: true;
  estimatedApy: "5-10%";
  noStakingRequired: true;
  rebaseFrequency: "daily";
  supportedChains: readonly ["arbitrum"];
};
```

Defined in: [defi/protocols/src/modules/lyra-ecosystem/constants.ts:265](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L265)

Why use USDs for Lyra payments?

1. **Auto-Yield**: Earn ~5-10% APY just by holding USDs
2. **No Staking Required**: Yield is automatic, no lock-up
3. **AI Agent Friendly**: Agents earn while idle
4. **Arbitrum Native**: Low fees, fast transactions

Example: An AI agent with $100 in USDs earns ~$5-10/year passively

#### Type Declaration

| Name | Type | Default value | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="autoyield"></a> `autoYield` | `true` | `true` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:266](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L266) |
| <a id="estimatedapy"></a> `estimatedApy` | `"5-10%"` | `"5-10%"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:267](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L267) |
| <a id="nostakingrequired"></a> `noStakingRequired` | `true` | `true` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:268](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L268) |
| <a id="rebasefrequency"></a> `rebaseFrequency` | `"daily"` | `"daily"` | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:270](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L270) |
| <a id="supportedchains"></a> `supportedChains` | readonly \[`"arbitrum"`\] | - | [defi/protocols/src/modules/lyra-ecosystem/constants.ts:269](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/lyra-ecosystem/constants.ts#L269) |
