[**Universal Crypto MCP API Reference v1.0.0**](../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/x402/chains/types

# defi/protocols/src/x402/chains/types

## Interfaces

### ChainConfig

Defined in: [defi/protocols/src/x402/chains/types.ts:40](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/types.ts#L40)

Unified chain configuration for all supported networks

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="caip2"></a> `caip2` | `string` | CAIP-2 identifier (e.g., "eip155:8453", "solana:5eykt...") | [defi/protocols/src/x402/chains/types.ts:42](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/types.ts#L42) |
| <a id="chainid"></a> `chainId?` | `number` | Chain ID for EVM chains (undefined for non-EVM) | [defi/protocols/src/x402/chains/types.ts:44](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/types.ts#L44) |
| <a id="cluster"></a> `cluster?` | `string` | Solana cluster name (Solana only) | [defi/protocols/src/x402/chains/types.ts:64](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/types.ts#L64) |
| <a id="explorerurl"></a> `explorerUrl` | `string` | Block explorer URL | [defi/protocols/src/x402/chains/types.ts:52](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/types.ts#L52) |
| <a id="facilitatorurl"></a> `facilitatorUrl?` | `string` | Facilitator URL for payment settlement | [defi/protocols/src/x402/chains/types.ts:58](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/types.ts#L58) |
| <a id="genesishash"></a> `genesisHash?` | `string` | Solana genesis hash (Solana only) | [defi/protocols/src/x402/chains/types.ts:66](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/types.ts#L66) |
| <a id="istestnet"></a> `isTestnet` | `boolean` | Whether this is a testnet | [defi/protocols/src/x402/chains/types.ts:54](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/types.ts#L54) |
| <a id="name"></a> `name` | `string` | Human-readable chain name | [defi/protocols/src/x402/chains/types.ts:46](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/types.ts#L46) |
| <a id="nativecurrency"></a> `nativeCurrency` | [`NativeCurrencyConfig`](/docs/api/defi/protocols/src/x402/chains/types.md#nativecurrencyconfig) | Native currency configuration | [defi/protocols/src/x402/chains/types.ts:60](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/types.ts#L60) |
| <a id="network"></a> `network` | `string` | Network identifier | [defi/protocols/src/x402/chains/types.ts:48](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/types.ts#L48) |
| <a id="paymenttoken"></a> `paymentToken` | [`PaymentTokenConfig`](/docs/api/defi/protocols/src/x402/chains/types.md#paymenttokenconfig) | Primary payment token (USDC) | [defi/protocols/src/x402/chains/types.ts:56](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/types.ts#L56) |
| <a id="rpcurl"></a> `rpcUrl` | `string` | RPC endpoint URL | [defi/protocols/src/x402/chains/types.ts:50](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/types.ts#L50) |
| <a id="viemchain"></a> `viemChain?` | `Chain` | Viem chain object (EVM only) | [defi/protocols/src/x402/chains/types.ts:62](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/types.ts#L62) |

***

### NativeCurrencyConfig

Defined in: [defi/protocols/src/x402/chains/types.ts:31](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/types.ts#L31)

Native currency configuration

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="decimals"></a> `decimals` | `number` | [defi/protocols/src/x402/chains/types.ts:34](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/types.ts#L34) |
| <a id="name-1"></a> `name` | `string` | [defi/protocols/src/x402/chains/types.ts:32](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/types.ts#L32) |
| <a id="symbol"></a> `symbol` | `string` | [defi/protocols/src/x402/chains/types.ts:33](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/types.ts#L33) |

***

### PaymentTokenConfig

Defined in: [defi/protocols/src/x402/chains/types.ts:13](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/types.ts#L13)

Payment token configuration

#### Properties

| Property | Type | Description | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="address"></a> `address` | `string` | Token contract/mint address | [defi/protocols/src/x402/chains/types.ts:15](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/types.ts#L15) |
| <a id="decimals-1"></a> `decimals` | `number` | Token decimals | [defi/protocols/src/x402/chains/types.ts:17](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/types.ts#L17) |
| <a id="name-2"></a> `name` | `string` | Token name (e.g., "USD Coin") | [defi/protocols/src/x402/chains/types.ts:21](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/types.ts#L21) |
| <a id="programid"></a> `programId?` | `string` | SPL Token program ID (Solana only) | [defi/protocols/src/x402/chains/types.ts:25](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/types.ts#L25) |
| <a id="supportseip3009"></a> `supportsEIP3009?` | `boolean` | Whether this token supports EIP-3009 gasless transfers (EVM only) | [defi/protocols/src/x402/chains/types.ts:23](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/types.ts#L23) |
| <a id="symbol-1"></a> `symbol` | `string` | Token symbol (e.g., "USDC") | [defi/protocols/src/x402/chains/types.ts:19](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/types.ts#L19) |

## Type Aliases

### ChainType

```ts
type ChainType = "evm" | "solana" | "unknown";
```

Defined in: [defi/protocols/src/x402/chains/types.ts:72](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/x402/chains/types.ts#L72)

Chain type discriminator
