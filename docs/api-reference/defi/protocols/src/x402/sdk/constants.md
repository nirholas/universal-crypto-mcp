[**Universal Crypto MCP API Reference v1.0.0**](../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/x402/sdk/constants

# defi/protocols/src/x402/sdk/constants

## Variables

### CHAIN\_ID\_TO\_CHAIN

```ts
const CHAIN_ID_TO_CHAIN: Record<number, X402Chain>;
```

Defined in: [defi/protocols/src/x402/sdk/constants.ts:72](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/constants.ts#L72)

Chain ID to chain name mapping

***

### DEFAULT\_TOKEN

```ts
const DEFAULT_TOKEN: Record<X402Chain, X402Token>;
```

Defined in: [defi/protocols/src/x402/sdk/constants.ts:211](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/constants.ts#L211)

Default token per chain

***

### DEFAULTS

```ts
const DEFAULTS: {
  AUTHORIZATION_VALIDITY: 300;
  FACILITATOR_URL: "http://localhost:3002";
  PLATFORM_FEE_BPS: 2000;
  TIMEOUT: 30000;
  USDS_APY: 5;
};
```

Defined in: [defi/protocols/src/x402/sdk/constants.ts:501](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/constants.ts#L501)

Default configuration values

#### Type Declaration

| Name | Type | Default value | Description | Defined in |
| :------ | :------ | :------ | :------ | :------ |
| <a id="authorization_validity"></a> `AUTHORIZATION_VALIDITY` | `300` | `300` | Default validity period for authorizations (5 minutes) | [defi/protocols/src/x402/sdk/constants.ts:506](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/constants.ts#L506) |
| <a id="facilitator_url"></a> `FACILITATOR_URL` | `"http://localhost:3002"` | `'http://localhost:3002'` | Default facilitator URL | [defi/protocols/src/x402/sdk/constants.ts:509](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/constants.ts#L509) |
| <a id="platform_fee_bps"></a> `PLATFORM_FEE_BPS` | `2000` | `2000` | Default platform fee in basis points (20%) | [defi/protocols/src/x402/sdk/constants.ts:512](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/constants.ts#L512) |
| <a id="timeout"></a> `TIMEOUT` | `30000` | `30_000` | Default timeout in milliseconds | [defi/protocols/src/x402/sdk/constants.ts:503](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/constants.ts#L503) |
| <a id="usds_apy"></a> `USDS_APY` | `5` | `5.0` | USDs APY estimate (for calculations) | [defi/protocols/src/x402/sdk/constants.ts:515](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/constants.ts#L515) |

***

### EIP3009\_ABI

```ts
const EIP3009_ABI: readonly [{
  inputs: readonly [{
     name: "from";
     type: "address";
   }, {
     name: "to";
     type: "address";
   }, {
     name: "value";
     type: "uint256";
   }, {
     name: "validAfter";
     type: "uint256";
   }, {
     name: "validBefore";
     type: "uint256";
   }, {
     name: "nonce";
     type: "bytes32";
   }, {
     name: "v";
     type: "uint8";
   }, {
     name: "r";
     type: "bytes32";
   }, {
     name: "s";
     type: "bytes32";
  }];
  name: "transferWithAuthorization";
  outputs: readonly [];
  stateMutability: "nonpayable";
  type: "function";
}, {
  inputs: readonly [{
     name: "from";
     type: "address";
   }, {
     name: "to";
     type: "address";
   }, {
     name: "value";
     type: "uint256";
   }, {
     name: "validAfter";
     type: "uint256";
   }, {
     name: "validBefore";
     type: "uint256";
   }, {
     name: "nonce";
     type: "bytes32";
   }, {
     name: "v";
     type: "uint8";
   }, {
     name: "r";
     type: "bytes32";
   }, {
     name: "s";
     type: "bytes32";
  }];
  name: "receiveWithAuthorization";
  outputs: readonly [];
  stateMutability: "nonpayable";
  type: "function";
}, {
  inputs: readonly [{
     name: "authorizer";
     type: "address";
   }, {
     name: "nonce";
     type: "bytes32";
  }];
  name: "authorizationState";
  outputs: readonly [{
     type: "bool";
  }];
  stateMutability: "view";
  type: "function";
}];
```

Defined in: [defi/protocols/src/x402/sdk/constants.ts:303](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/constants.ts#L303)

EIP-3009 Transfer With Authorization ABI

***

### EIP3009\_DOMAIN\_TYPE

```ts
const EIP3009_DOMAIN_TYPE: {
  chainId: {
     name: string;
     type: string;
  }[];
  name: {
     name: string;
     type: string;
  }[];
  verifyingContract: {
     name: string;
     type: string;
  }[];
  version: {
     name: string;
     type: string;
  }[];
};
```

Defined in: [defi/protocols/src/x402/sdk/constants.ts:473](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/constants.ts#L473)

EIP-712 domain for EIP-3009 transfers

#### Type Declaration

| Name | Type | Defined in |
| :------ | :------ | :------ |
| <a id="chainid"></a> `chainId` | \{ `name`: `string`; `type`: `string`; \}[] | [defi/protocols/src/x402/sdk/constants.ts:476](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/constants.ts#L476) |
| <a id="name"></a> `name` | \{ `name`: `string`; `type`: `string`; \}[] | [defi/protocols/src/x402/sdk/constants.ts:474](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/constants.ts#L474) |
| <a id="verifyingcontract"></a> `verifyingContract` | \{ `name`: `string`; `type`: `string`; \}[] | [defi/protocols/src/x402/sdk/constants.ts:477](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/constants.ts#L477) |
| <a id="version"></a> `version` | \{ `name`: `string`; `type`: `string`; \}[] | [defi/protocols/src/x402/sdk/constants.ts:475](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/constants.ts#L475) |

***

### ERC20\_ABI

```ts
const ERC20_ABI: readonly [{
  inputs: readonly [{
     name: "to";
     type: "address";
   }, {
     name: "amount";
     type: "uint256";
  }];
  name: "transfer";
  outputs: readonly [{
     type: "bool";
  }];
  stateMutability: "nonpayable";
  type: "function";
}, {
  inputs: readonly [{
     name: "from";
     type: "address";
   }, {
     name: "to";
     type: "address";
   }, {
     name: "amount";
     type: "uint256";
  }];
  name: "transferFrom";
  outputs: readonly [{
     type: "bool";
  }];
  stateMutability: "nonpayable";
  type: "function";
}, {
  inputs: readonly [{
     name: "account";
     type: "address";
  }];
  name: "balanceOf";
  outputs: readonly [{
     type: "uint256";
  }];
  stateMutability: "view";
  type: "function";
}, {
  inputs: readonly [{
     name: "owner";
     type: "address";
   }, {
     name: "spender";
     type: "address";
  }];
  name: "allowance";
  outputs: readonly [{
     type: "uint256";
  }];
  stateMutability: "view";
  type: "function";
}, {
  inputs: readonly [{
     name: "spender";
     type: "address";
   }, {
     name: "amount";
     type: "uint256";
  }];
  name: "approve";
  outputs: readonly [{
     type: "bool";
  }];
  stateMutability: "nonpayable";
  type: "function";
}, {
  inputs: readonly [];
  name: "decimals";
  outputs: readonly [{
     type: "uint8";
  }];
  stateMutability: "view";
  type: "function";
}, {
  inputs: readonly [];
  name: "symbol";
  outputs: readonly [{
     type: "string";
  }];
  stateMutability: "view";
  type: "function";
}, {
  inputs: readonly [];
  name: "name";
  outputs: readonly [{
     type: "string";
  }];
  stateMutability: "view";
  type: "function";
}];
```

Defined in: [defi/protocols/src/x402/sdk/constants.ts:228](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/constants.ts#L228)

ERC-20 ABI (minimal)

***

### NETWORKS

```ts
const NETWORKS: Record<X402Chain, NetworkConfig>;
```

Defined in: [defi/protocols/src/x402/sdk/constants.ts:17](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/constants.ts#L17)

Supported network configurations

***

### REVENUE\_SPLITTER\_ABI

```ts
const REVENUE_SPLITTER_ABI: readonly [{
  inputs: readonly [{
     name: "toolName";
     type: "string";
   }, {
     name: "token";
     type: "address";
   }, {
     name: "amount";
     type: "uint256";
  }];
  name: "processPayment";
  outputs: readonly [];
  stateMutability: "nonpayable";
  type: "function";
}, {
  inputs: readonly [{
     name: "toolNames";
     type: "string[]";
   }, {
     name: "token";
     type: "address";
   }, {
     name: "amounts";
     type: "uint256[]";
  }];
  name: "batchProcessPayments";
  outputs: readonly [];
  stateMutability: "nonpayable";
  type: "function";
}, {
  inputs: readonly [{
     name: "toolName";
     type: "string";
   }, {
     name: "developer";
     type: "address";
   }, {
     name: "platformFeeBps";
     type: "uint256";
  }];
  name: "registerTool";
  outputs: readonly [];
  stateMutability: "nonpayable";
  type: "function";
}, {
  inputs: readonly [{
     name: "toolName";
     type: "string";
  }];
  name: "getToolInfo";
  outputs: readonly [{
     name: "developer";
     type: "address";
   }, {
     name: "platformFeeBps";
     type: "uint256";
   }, {
     name: "totalRevenue";
     type: "uint256";
   }, {
     name: "totalCalls";
     type: "uint256";
   }, {
     name: "active";
     type: "bool";
  }];
  stateMutability: "view";
  type: "function";
}, {
  inputs: readonly [{
     name: "developer";
     type: "address";
  }];
  name: "developerEarnings";
  outputs: readonly [{
     type: "uint256";
  }];
  stateMutability: "view";
  type: "function";
}, {
  inputs: readonly [];
  name: "platformWallet";
  outputs: readonly [{
     type: "address";
  }];
  stateMutability: "view";
  type: "function";
}, {
  inputs: readonly [];
  name: "defaultPlatformFeeBps";
  outputs: readonly [{
     type: "uint256";
  }];
  stateMutability: "view";
  type: "function";
}];
```

Defined in: [defi/protocols/src/x402/sdk/constants.ts:396](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/constants.ts#L396)

Revenue Splitter Contract ABI

***

### SDK\_VERSION

```ts
const SDK_VERSION: "1.0.0" = '1.0.0';
```

Defined in: [defi/protocols/src/x402/sdk/constants.ts:526](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/constants.ts#L526)

SDK version

***

### SPERAX\_USD\_ADDRESS

```ts
const SPERAX_USD_ADDRESS: Address = '0xd74f5255d557944cf7dd0e45ff521520002d5748';
```

Defined in: [defi/protocols/src/x402/sdk/constants.ts:88](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/constants.ts#L88)

Sperax USD (USDs) contract address on Arbitrum
Auto-yield stablecoin

***

### TOKENS

```ts
const TOKENS: Record<X402Chain, Partial<Record<X402Token, TokenConfig>>>;
```

Defined in: [defi/protocols/src/x402/sdk/constants.ts:93](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/constants.ts#L93)

Token configurations per chain

***

### TRANSFER\_WITH\_AUTHORIZATION\_TYPES

```ts
const TRANSFER_WITH_AUTHORIZATION_TYPES: {
  TransferWithAuthorization: readonly [{
     name: "from";
     type: "address";
   }, {
     name: "to";
     type: "address";
   }, {
     name: "value";
     type: "uint256";
   }, {
     name: "validAfter";
     type: "uint256";
   }, {
     name: "validBefore";
     type: "uint256";
   }, {
     name: "nonce";
     type: "bytes32";
  }];
};
```

Defined in: [defi/protocols/src/x402/sdk/constants.ts:483](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/constants.ts#L483)

EIP-712 types for TransferWithAuthorization

#### Type Declaration

| Name | Type | Defined in |
| :------ | :------ | :------ |
| <a id="transferwithauthorization"></a> `TransferWithAuthorization` | readonly \[\{ `name`: `"from"`; `type`: `"address"`; \}, \{ `name`: `"to"`; `type`: `"address"`; \}, \{ `name`: `"value"`; `type`: `"uint256"`; \}, \{ `name`: `"validAfter"`; `type`: `"uint256"`; \}, \{ `name`: `"validBefore"`; `type`: `"uint256"`; \}, \{ `name`: `"nonce"`; `type`: `"bytes32"`; \}\] | [defi/protocols/src/x402/sdk/constants.ts:484](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/constants.ts#L484) |

***

### USDS\_ABI

```ts
const USDS_ABI: readonly [{
  inputs: readonly [{
     name: "to";
     type: "address";
   }, {
     name: "amount";
     type: "uint256";
  }];
  name: "transfer";
  outputs: readonly [{
     type: "bool";
  }];
  stateMutability: "nonpayable";
  type: "function";
}, {
  inputs: readonly [{
     name: "from";
     type: "address";
   }, {
     name: "to";
     type: "address";
   }, {
     name: "amount";
     type: "uint256";
  }];
  name: "transferFrom";
  outputs: readonly [{
     type: "bool";
  }];
  stateMutability: "nonpayable";
  type: "function";
}, {
  inputs: readonly [{
     name: "account";
     type: "address";
  }];
  name: "balanceOf";
  outputs: readonly [{
     type: "uint256";
  }];
  stateMutability: "view";
  type: "function";
}, {
  inputs: readonly [{
     name: "owner";
     type: "address";
   }, {
     name: "spender";
     type: "address";
  }];
  name: "allowance";
  outputs: readonly [{
     type: "uint256";
  }];
  stateMutability: "view";
  type: "function";
}, {
  inputs: readonly [{
     name: "spender";
     type: "address";
   }, {
     name: "amount";
     type: "uint256";
  }];
  name: "approve";
  outputs: readonly [{
     type: "bool";
  }];
  stateMutability: "nonpayable";
  type: "function";
}, {
  inputs: readonly [];
  name: "decimals";
  outputs: readonly [{
     type: "uint8";
  }];
  stateMutability: "view";
  type: "function";
}, {
  inputs: readonly [];
  name: "symbol";
  outputs: readonly [{
     type: "string";
  }];
  stateMutability: "view";
  type: "function";
}, {
  inputs: readonly [];
  name: "name";
  outputs: readonly [{
     type: "string";
  }];
  stateMutability: "view";
  type: "function";
}, {
  inputs: readonly [{
     name: "from";
     type: "address";
   }, {
     name: "to";
     type: "address";
   }, {
     name: "value";
     type: "uint256";
   }, {
     name: "validAfter";
     type: "uint256";
   }, {
     name: "validBefore";
     type: "uint256";
   }, {
     name: "nonce";
     type: "bytes32";
   }, {
     name: "v";
     type: "uint8";
   }, {
     name: "r";
     type: "bytes32";
   }, {
     name: "s";
     type: "bytes32";
  }];
  name: "transferWithAuthorization";
  outputs: readonly [];
  stateMutability: "nonpayable";
  type: "function";
}, {
  inputs: readonly [{
     name: "from";
     type: "address";
   }, {
     name: "to";
     type: "address";
   }, {
     name: "value";
     type: "uint256";
   }, {
     name: "validAfter";
     type: "uint256";
   }, {
     name: "validBefore";
     type: "uint256";
   }, {
     name: "nonce";
     type: "bytes32";
   }, {
     name: "v";
     type: "uint8";
   }, {
     name: "r";
     type: "bytes32";
   }, {
     name: "s";
     type: "bytes32";
  }];
  name: "receiveWithAuthorization";
  outputs: readonly [];
  stateMutability: "nonpayable";
  type: "function";
}, {
  inputs: readonly [{
     name: "authorizer";
     type: "address";
   }, {
     name: "nonce";
     type: "bytes32";
  }];
  name: "authorizationState";
  outputs: readonly [{
     type: "bool";
  }];
  stateMutability: "view";
  type: "function";
}, {
  inputs: readonly [];
  name: "rebasingCreditsPerToken";
  outputs: readonly [{
     type: "uint256";
  }];
  stateMutability: "view";
  type: "function";
}, {
  inputs: readonly [{
     name: "account";
     type: "address";
  }];
  name: "rebasingCredits";
  outputs: readonly [{
     type: "uint256";
  }];
  stateMutability: "view";
  type: "function";
}, {
  inputs: readonly [];
  name: "rebaseOptIn";
  outputs: readonly [];
  stateMutability: "nonpayable";
  type: "function";
}, {
  inputs: readonly [];
  name: "rebaseOptOut";
  outputs: readonly [];
  stateMutability: "nonpayable";
  type: "function";
}, {
  inputs: readonly [{
     name: "account";
     type: "address";
  }];
  name: "isRebaseEnabled";
  outputs: readonly [{
     type: "bool";
  }];
  stateMutability: "view";
  type: "function";
}];
```

Defined in: [defi/protocols/src/x402/sdk/constants.ts:353](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/constants.ts#L353)

USDs Rebasing Token ABI (additional methods)

***

### X402\_VERSION

```ts
const X402_VERSION: 1 = 1;
```

Defined in: [defi/protocols/src/x402/sdk/constants.ts:521](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/sdk/constants.ts#L521)

X402 Protocol version
