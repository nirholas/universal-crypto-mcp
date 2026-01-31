[**Universal Crypto MCP API Reference v1.0.0**](../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/utils/dx

# defi/protocols/src/utils/dx

## Classes

### Spinner

Defined in: [defi/protocols/src/utils/dx.ts:136](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L136)

Create an animated spinner

#### Constructors

##### Constructor

```ts
new Spinner(message: string): Spinner;
```

Defined in: [defi/protocols/src/utils/dx.ts:141](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L141)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `message` | `string` |

###### Returns

[`Spinner`](/docs/api/defi/protocols/src/utils/dx.md#spinner)

#### Methods

##### fail()

```ts
fail(message: string): void;
```

Defined in: [defi/protocols/src/utils/dx.ts:168](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L168)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `message` | `string` |

###### Returns

`void`

##### start()

```ts
start(): void;
```

Defined in: [defi/protocols/src/utils/dx.ts:145](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L145)

###### Returns

`void`

##### stop()

```ts
stop(finalMessage?: string): void;
```

Defined in: [defi/protocols/src/utils/dx.ts:153](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L153)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `finalMessage?` | `string` |

###### Returns

`void`

##### success()

```ts
success(message: string): void;
```

Defined in: [defi/protocols/src/utils/dx.ts:164](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L164)

###### Parameters

| Parameter | Type |
| :------ | :------ |
| `message` | `string` |

###### Returns

`void`

## Type Aliases

### StyleKey

```ts
type StyleKey = keyof typeof styles;
```

Defined in: [defi/protocols/src/utils/dx.ts:57](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L57)

## Variables

### errorMessages

```ts
const errorMessages: {
  INSUFFICIENT_BALANCE: {
     emoji: "💰";
     message: "Your wallet doesn't have enough funds for this operation.";
     suggestion: "Check your balance with x402_balance tool.\nFund your wallet by sending USDs to your address.";
     title: "Insufficient Balance";
  };
  INVALID_ADDRESS: {
     emoji: "❌";
     message: "The provided address is not a valid Ethereum address.";
     suggestion: "Addresses should:\n  • Start with 0x\n  • Be 42 characters long\n  • Contain only hex characters (0-9, a-f)";
     title: "Invalid Address";
  };
  INVALID_CHAIN: {
     emoji: "⛓️";
     message: "The specified chain is not supported.";
     suggestion: "Supported EVM chains: ethereum, arbitrum, base, polygon, optimism\nSupported SVM chains: solana-mainnet, solana-devnet";
     title: "Invalid Chain";
  };
  NETWORK_ERROR: {
     emoji: "⛓️";
     message: "Failed to connect to the blockchain network.";
     suggestion: "Try these solutions:\n  • Check your internet connection\n  • Set a custom RPC: export X402_RPC_URL=https://...\n  • Try again in a few seconds";
     title: "Network Error";
  };
  NO_PRIVATE_KEY: {
     emoji: "🔑";
     message: "X402_PRIVATE_KEY environment variable is not set.";
     suggestion:  Set your private key:
        ${string}
      ${string} Never commit your private key to git! ;
     title: "Missing Private Key";
  };
  PAYMENT_FAILED: {
     emoji: "💳";
     message: "The x402 payment could not be completed.";
     suggestion: "Possible causes:\n  • Insufficient balance\n  • Gas price too low\n  • Network congestion\n\nCheck your balance and try again.";
     title: "Payment Failed";
  };
  RATE_LIMITED: {
     emoji: "🕐";
     message: "Too many requests. Please slow down.";
     suggestion: "You're making requests too quickly.\nWait a few seconds before trying again.";
     title: "Rate Limited";
  };
};
```

Defined in: [defi/protocols/src/utils/dx.ts:207](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L207)

#### Type Declaration

| Name | Type | Default value | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="insufficient_balance"></a> `INSUFFICIENT_BALANCE` | \{ `emoji`: `"💰"`; `message`: `"Your wallet doesn't have enough funds for this operation."`; `suggestion`: "Check your balance with x402\_balance tool.\nFund your wallet by sending USDs to your address."; `title`: `"Insufficient Balance"`; \} | - | [defi/protocols/src/utils/dx.ts:218](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L218) |
| `INSUFFICIENT_BALANCE.emoji` | `"💰"` | `icons.wallet` | [defi/protocols/src/utils/dx.ts:223](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L223) |
| `INSUFFICIENT_BALANCE.message` | `"Your wallet doesn't have enough funds for this operation."` | `"Your wallet doesn't have enough funds for this operation."` | [defi/protocols/src/utils/dx.ts:220](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L220) |
| `INSUFFICIENT_BALANCE.suggestion` | "Check your balance with x402\_balance tool.\nFund your wallet by sending USDs to your address." | - | [defi/protocols/src/utils/dx.ts:221](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L221) |
| `INSUFFICIENT_BALANCE.title` | `"Insufficient Balance"` | `"Insufficient Balance"` | [defi/protocols/src/utils/dx.ts:219](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L219) |
| <a id="invalid_address"></a> `INVALID_ADDRESS` | \{ `emoji`: `"❌"`; `message`: `"The provided address is not a valid Ethereum address."`; `suggestion`: "Addresses should:\n • Start with 0x\n • Be 42 characters long\n • Contain only hex characters (0-9, a-f)"; `title`: `"Invalid Address"`; \} | - | [defi/protocols/src/utils/dx.ts:226](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L226) |
| `INVALID_ADDRESS.emoji` | `"❌"` | `icons.error` | [defi/protocols/src/utils/dx.ts:233](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L233) |
| `INVALID_ADDRESS.message` | `"The provided address is not a valid Ethereum address."` | `"The provided address is not a valid Ethereum address."` | [defi/protocols/src/utils/dx.ts:228](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L228) |
| `INVALID_ADDRESS.suggestion` | "Addresses should:\n • Start with 0x\n • Be 42 characters long\n • Contain only hex characters (0-9, a-f)" | - | [defi/protocols/src/utils/dx.ts:229](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L229) |
| `INVALID_ADDRESS.title` | `"Invalid Address"` | `"Invalid Address"` | [defi/protocols/src/utils/dx.ts:227](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L227) |
| <a id="invalid_chain"></a> `INVALID_CHAIN` | \{ `emoji`: `"⛓️"`; `message`: `"The specified chain is not supported."`; `suggestion`: "Supported EVM chains: ethereum, arbitrum, base, polygon, optimism\nSupported SVM chains: solana-mainnet, solana-devnet"; `title`: `"Invalid Chain"`; \} | - | [defi/protocols/src/utils/dx.ts:266](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L266) |
| `INVALID_CHAIN.emoji` | `"⛓️"` | `icons.chain` | [defi/protocols/src/utils/dx.ts:271](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L271) |
| `INVALID_CHAIN.message` | `"The specified chain is not supported."` | `"The specified chain is not supported."` | [defi/protocols/src/utils/dx.ts:268](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L268) |
| `INVALID_CHAIN.suggestion` | "Supported EVM chains: ethereum, arbitrum, base, polygon, optimism\nSupported SVM chains: solana-mainnet, solana-devnet" | - | [defi/protocols/src/utils/dx.ts:269](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L269) |
| `INVALID_CHAIN.title` | `"Invalid Chain"` | `"Invalid Chain"` | [defi/protocols/src/utils/dx.ts:267](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L267) |
| <a id="network_error"></a> `NETWORK_ERROR` | \{ `emoji`: `"⛓️"`; `message`: `"Failed to connect to the blockchain network."`; `suggestion`: "Try these solutions:\n • Check your internet connection\n • Set a custom RPC: export X402\_RPC\_URL=https://...\n • Try again in a few seconds"; `title`: `"Network Error"`; \} | - | [defi/protocols/src/utils/dx.ts:236](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L236) |
| `NETWORK_ERROR.emoji` | `"⛓️"` | `icons.chain` | [defi/protocols/src/utils/dx.ts:243](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L243) |
| `NETWORK_ERROR.message` | `"Failed to connect to the blockchain network."` | `"Failed to connect to the blockchain network."` | [defi/protocols/src/utils/dx.ts:238](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L238) |
| `NETWORK_ERROR.suggestion` | "Try these solutions:\n • Check your internet connection\n • Set a custom RPC: export X402\_RPC\_URL=https://...\n • Try again in a few seconds" | - | [defi/protocols/src/utils/dx.ts:239](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L239) |
| `NETWORK_ERROR.title` | `"Network Error"` | `"Network Error"` | [defi/protocols/src/utils/dx.ts:237](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L237) |
| <a id="no_private_key"></a> `NO_PRIVATE_KEY` | \{ `emoji`: `"🔑"`; `message`: `"X402_PRIVATE_KEY environment variable is not set."`; `suggestion`: `` `Set your private key: ${string} ${string} Never commit your private key to git!` ``; `title`: `"Missing Private Key"`; \} | - | [defi/protocols/src/utils/dx.ts:208](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L208) |
| `NO_PRIVATE_KEY.emoji` | `"🔑"` | `icons.key` | [defi/protocols/src/utils/dx.ts:215](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L215) |
| `NO_PRIVATE_KEY.message` | `"X402_PRIVATE_KEY environment variable is not set."` | `"X402_PRIVATE_KEY environment variable is not set."` | [defi/protocols/src/utils/dx.ts:210](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L210) |
| `NO_PRIVATE_KEY.suggestion` | `` `Set your private key: ${string} ${string} Never commit your private key to git!` `` | - | [defi/protocols/src/utils/dx.ts:211](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L211) |
| `NO_PRIVATE_KEY.title` | `"Missing Private Key"` | `"Missing Private Key"` | [defi/protocols/src/utils/dx.ts:209](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L209) |
| <a id="payment_failed"></a> `PAYMENT_FAILED` | \{ `emoji`: `"💳"`; `message`: `"The x402 payment could not be completed."`; `suggestion`: "Possible causes:\n • Insufficient balance\n • Gas price too low\n • Network congestion\n\nCheck your balance and try again."; `title`: `"Payment Failed"`; \} | - | [defi/protocols/src/utils/dx.ts:246](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L246) |
| `PAYMENT_FAILED.emoji` | `"💳"` | `icons.payment` | [defi/protocols/src/utils/dx.ts:255](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L255) |
| `PAYMENT_FAILED.message` | `"The x402 payment could not be completed."` | `"The x402 payment could not be completed."` | [defi/protocols/src/utils/dx.ts:248](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L248) |
| `PAYMENT_FAILED.suggestion` | "Possible causes:\n • Insufficient balance\n • Gas price too low\n • Network congestion\n\nCheck your balance and try again." | - | [defi/protocols/src/utils/dx.ts:249](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L249) |
| `PAYMENT_FAILED.title` | `"Payment Failed"` | `"Payment Failed"` | [defi/protocols/src/utils/dx.ts:247](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L247) |
| <a id="rate_limited"></a> `RATE_LIMITED` | \{ `emoji`: `"🕐"`; `message`: `"Too many requests. Please slow down."`; `suggestion`: "You're making requests too quickly.\nWait a few seconds before trying again."; `title`: `"Rate Limited"`; \} | - | [defi/protocols/src/utils/dx.ts:258](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L258) |
| `RATE_LIMITED.emoji` | `"🕐"` | `icons.clock` | [defi/protocols/src/utils/dx.ts:263](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L263) |
| `RATE_LIMITED.message` | `"Too many requests. Please slow down."` | `"Too many requests. Please slow down."` | [defi/protocols/src/utils/dx.ts:260](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L260) |
| `RATE_LIMITED.suggestion` | "You're making requests too quickly.\nWait a few seconds before trying again." | - | [defi/protocols/src/utils/dx.ts:261](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L261) |
| `RATE_LIMITED.title` | `"Rate Limited"` | `"Rate Limited"` | [defi/protocols/src/utils/dx.ts:259](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L259) |

***

### icons

```ts
const icons: {
  bitcoin: "₿";
  bridge: "🌉";
  chain: "⛓️";
  chart: "📊";
  clock: "🕐";
  complete: "✔️";
  debug: "🔍";
  error: "❌";
  ethereum: "⟠";
  fire: "🔥";
  gas: "⛽";
  gear: "⚙️";
  info: "ℹ️";
  key: "🔑";
  link: "🔗";
  loading: "⏳";
  lock: "🔒";
  money: "💵";
  payment: "💳";
  pending: "⏸️";
  receive: "📥";
  robot: "🤖";
  rocket: "🚀";
  running: "▶️";
  send: "📤";
  solana: "◎";
  sparkles: "✨";
  star: "⭐";
  success: "✅";
  swap: "🔄";
  wallet: "💰";
  warning: "⚠️";
  yield: "📈";
};
```

Defined in: [defi/protocols/src/utils/dx.ts:75](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L75)

#### Type Declaration

| Name | Type | Default value | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="bitcoin"></a> `bitcoin` | `"₿"` | `"₿"` | [defi/protocols/src/utils/dx.ts:102](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L102) |
| <a id="bridge"></a> `bridge` | `"🌉"` | `"🌉"` | [defi/protocols/src/utils/dx.ts:95](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L95) |
| <a id="chain"></a> `chain` | `"⛓️"` | `"⛓️"` | [defi/protocols/src/utils/dx.ts:99](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L99) |
| <a id="chart"></a> `chart` | `"📊"` | `"📊"` | [defi/protocols/src/utils/dx.ts:116](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L116) |
| <a id="clock"></a> `clock` | `"🕐"` | `"🕐"` | [defi/protocols/src/utils/dx.ts:115](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L115) |
| <a id="complete"></a> `complete` | `"✔️"` | `"✔️"` | [defi/protocols/src/utils/dx.ts:85](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L85) |
| <a id="debug"></a> `debug` | `"🔍"` | `"🔍"` | [defi/protocols/src/utils/dx.ts:81](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L81) |
| <a id="error"></a> `error` | `"❌"` | `"❌"` | [defi/protocols/src/utils/dx.ts:78](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L78) |
| <a id="ethereum"></a> `ethereum` | `"⟠"` | `"⟠"` | [defi/protocols/src/utils/dx.ts:100](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L100) |
| <a id="fire"></a> `fire` | `"🔥"` | `"🔥"` | [defi/protocols/src/utils/dx.ts:109](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L109) |
| <a id="gas"></a> `gas` | `"⛽"` | `"⛽"` | [defi/protocols/src/utils/dx.ts:117](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L117) |
| <a id="gear"></a> `gear` | `"⚙️"` | `"⚙️"` | [defi/protocols/src/utils/dx.ts:113](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L113) |
| <a id="info"></a> `info` | `"ℹ️"` | `"ℹ️"` | [defi/protocols/src/utils/dx.ts:80](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L80) |
| <a id="key"></a> `key` | `"🔑"` | `"🔑"` | [defi/protocols/src/utils/dx.ts:112](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L112) |
| <a id="link"></a> `link` | `"🔗"` | `"🔗"` | [defi/protocols/src/utils/dx.ts:114](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L114) |
| <a id="loading"></a> `loading` | `"⏳"` | `"⏳"` | [defi/protocols/src/utils/dx.ts:84](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L84) |
| <a id="lock"></a> `lock` | `"🔒"` | `"🔒"` | [defi/protocols/src/utils/dx.ts:111](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L111) |
| <a id="money"></a> `money` | `"💵"` | `"💵"` | [defi/protocols/src/utils/dx.ts:106](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L106) |
| <a id="payment"></a> `payment` | `"💳"` | `"💳"` | [defi/protocols/src/utils/dx.ts:91](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L91) |
| <a id="pending"></a> `pending` | `"⏸️"` | `"⏸️"` | [defi/protocols/src/utils/dx.ts:86](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L86) |
| <a id="receive"></a> `receive` | `"📥"` | `"📥"` | [defi/protocols/src/utils/dx.ts:93](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L93) |
| <a id="robot"></a> `robot` | `"🤖"` | `"🤖"` | [defi/protocols/src/utils/dx.ts:105](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L105) |
| <a id="rocket"></a> `rocket` | `"🚀"` | `"🚀"` | [defi/protocols/src/utils/dx.ts:108](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L108) |
| <a id="running"></a> `running` | `"▶️"` | `"▶️"` | [defi/protocols/src/utils/dx.ts:87](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L87) |
| <a id="send"></a> `send` | `"📤"` | `"📤"` | [defi/protocols/src/utils/dx.ts:92](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L92) |
| <a id="solana"></a> `solana` | `"◎"` | `"◎"` | [defi/protocols/src/utils/dx.ts:101](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L101) |
| <a id="sparkles"></a> `sparkles` | `"✨"` | `"✨"` | [defi/protocols/src/utils/dx.ts:110](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L110) |
| <a id="star"></a> `star` | `"⭐"` | `"⭐"` | [defi/protocols/src/utils/dx.ts:107](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L107) |
| <a id="success-2"></a> `success` | `"✅"` | `"✅"` | [defi/protocols/src/utils/dx.ts:77](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L77) |
| <a id="swap"></a> `swap` | `"🔄"` | `"🔄"` | [defi/protocols/src/utils/dx.ts:94](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L94) |
| <a id="wallet"></a> `wallet` | `"💰"` | `"💰"` | [defi/protocols/src/utils/dx.ts:90](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L90) |
| <a id="warning"></a> `warning` | `"⚠️"` | `"⚠️"` | [defi/protocols/src/utils/dx.ts:79](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L79) |
| <a id="yield"></a> `yield` | `"📈"` | `"📈"` | [defi/protocols/src/utils/dx.ts:96](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L96) |

***

### log

```ts
const log: {
  bridge: (msg: string) => void;
  chain: (msg: string) => void;
  debug: (msg: string) => void;
  error: (msg: string) => void;
  info: (msg: string) => void;
  payment: (msg: string) => void;
  success: (msg: string) => void;
  swap: (msg: string) => void;
  wallet: (msg: string) => void;
  warning: (msg: string) => void;
};
```

Defined in: [defi/protocols/src/utils/dx.ts:295](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L295)

Log with emoji prefix

#### Type Declaration

| Name | Type | Defined in |
| :------ | :------ | :------ |
| <a id="bridge-1"></a> `bridge()` | (`msg`: `string`) => `void` | [defi/protocols/src/utils/dx.ts:306](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L306) |
| <a id="chain-1"></a> `chain()` | (`msg`: `string`) => `void` | [defi/protocols/src/utils/dx.ts:307](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L307) |
| <a id="debug-1"></a> `debug()` | (`msg`: `string`) => `void` | [defi/protocols/src/utils/dx.ts:300](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L300) |
| <a id="error-1"></a> `error()` | (`msg`: `string`) => `void` | [defi/protocols/src/utils/dx.ts:299](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L299) |
| <a id="info-1"></a> `info()` | (`msg`: `string`) => `void` | [defi/protocols/src/utils/dx.ts:296](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L296) |
| <a id="payment-1"></a> `payment()` | (`msg`: `string`) => `void` | [defi/protocols/src/utils/dx.ts:304](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L304) |
| <a id="success-3"></a> `success()` | (`msg`: `string`) => `void` | [defi/protocols/src/utils/dx.ts:297](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L297) |
| <a id="swap-1"></a> `swap()` | (`msg`: `string`) => `void` | [defi/protocols/src/utils/dx.ts:305](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L305) |
| <a id="wallet-1"></a> `wallet()` | (`msg`: `string`) => `void` | [defi/protocols/src/utils/dx.ts:303](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L303) |
| <a id="warning-1"></a> `warning()` | (`msg`: `string`) => `void` | [defi/protocols/src/utils/dx.ts:298](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L298) |

***

### spinnerFrames

```ts
const spinnerFrames: string[];
```

Defined in: [defi/protocols/src/utils/dx.ts:121](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L121)

***

### styles

```ts
const styles: {
  bgBlue: "\u001b[44m";
  bgCyan: "\u001b[46m";
  bgGreen: "\u001b[42m";
  bgMagenta: "\u001b[45m";
  bgRed: "\u001b[41m";
  bgYellow: "\u001b[43m";
  black: "\u001b[30m";
  blue: "\u001b[34m";
  bold: "\u001b[1m";
  brightBlue: "\u001b[94m";
  brightCyan: "\u001b[96m";
  brightGreen: "\u001b[92m";
  brightMagenta: "\u001b[95m";
  brightRed: "\u001b[91m";
  brightYellow: "\u001b[93m";
  cyan: "\u001b[36m";
  dim: "\u001b[2m";
  green: "\u001b[32m";
  italic: "\u001b[3m";
  magenta: "\u001b[35m";
  red: "\u001b[31m";
  reset: "\u001b[0m";
  underline: "\u001b[4m";
  white: "\u001b[37m";
  yellow: "\u001b[33m";
};
```

Defined in: [defi/protocols/src/utils/dx.ts:20](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L20)

#### Type Declaration

| Name | Type | Default value | Defined in |
| :------ | :------ | :------ | :------ |
| <a id="bgblue"></a> `bgBlue` | "\u001b\[44m" | "\x1b\[44m" | [defi/protocols/src/utils/dx.ts:52](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L52) |
| <a id="bgcyan"></a> `bgCyan` | "\u001b\[46m" | "\x1b\[46m" | [defi/protocols/src/utils/dx.ts:54](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L54) |
| <a id="bggreen"></a> `bgGreen` | "\u001b\[42m" | "\x1b\[42m" | [defi/protocols/src/utils/dx.ts:50](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L50) |
| <a id="bgmagenta"></a> `bgMagenta` | "\u001b\[45m" | "\x1b\[45m" | [defi/protocols/src/utils/dx.ts:53](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L53) |
| <a id="bgred"></a> `bgRed` | "\u001b\[41m" | "\x1b\[41m" | [defi/protocols/src/utils/dx.ts:49](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L49) |
| <a id="bgyellow"></a> `bgYellow` | "\u001b\[43m" | "\x1b\[43m" | [defi/protocols/src/utils/dx.ts:51](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L51) |
| <a id="black"></a> `black` | "\u001b\[30m" | "\x1b\[30m" | [defi/protocols/src/utils/dx.ts:31](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L31) |
| <a id="blue"></a> `blue` | "\u001b\[34m" | "\x1b\[34m" | [defi/protocols/src/utils/dx.ts:35](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L35) |
| <a id="bold"></a> `bold` | "\u001b\[1m" | "\x1b\[1m" | [defi/protocols/src/utils/dx.ts:25](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L25) |
| <a id="brightblue"></a> `brightBlue` | "\u001b\[94m" | "\x1b\[94m" | [defi/protocols/src/utils/dx.ts:44](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L44) |
| <a id="brightcyan"></a> `brightCyan` | "\u001b\[96m" | "\x1b\[96m" | [defi/protocols/src/utils/dx.ts:46](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L46) |
| <a id="brightgreen"></a> `brightGreen` | "\u001b\[92m" | "\x1b\[92m" | [defi/protocols/src/utils/dx.ts:42](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L42) |
| <a id="brightmagenta"></a> `brightMagenta` | "\u001b\[95m" | "\x1b\[95m" | [defi/protocols/src/utils/dx.ts:45](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L45) |
| <a id="brightred"></a> `brightRed` | "\u001b\[91m" | "\x1b\[91m" | [defi/protocols/src/utils/dx.ts:41](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L41) |
| <a id="brightyellow"></a> `brightYellow` | "\u001b\[93m" | "\x1b\[93m" | [defi/protocols/src/utils/dx.ts:43](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L43) |
| <a id="cyan"></a> `cyan` | "\u001b\[36m" | "\x1b\[36m" | [defi/protocols/src/utils/dx.ts:37](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L37) |
| <a id="dim"></a> `dim` | "\u001b\[2m" | "\x1b\[2m" | [defi/protocols/src/utils/dx.ts:26](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L26) |
| <a id="green"></a> `green` | "\u001b\[32m" | "\x1b\[32m" | [defi/protocols/src/utils/dx.ts:33](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L33) |
| <a id="italic"></a> `italic` | "\u001b\[3m" | "\x1b\[3m" | [defi/protocols/src/utils/dx.ts:27](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L27) |
| <a id="magenta"></a> `magenta` | "\u001b\[35m" | "\x1b\[35m" | [defi/protocols/src/utils/dx.ts:36](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L36) |
| <a id="red"></a> `red` | "\u001b\[31m" | "\x1b\[31m" | [defi/protocols/src/utils/dx.ts:32](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L32) |
| <a id="reset"></a> `reset` | "\u001b\[0m" | "\x1b\[0m" | [defi/protocols/src/utils/dx.ts:22](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L22) |
| <a id="underline"></a> `underline` | "\u001b\[4m" | "\x1b\[4m" | [defi/protocols/src/utils/dx.ts:28](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L28) |
| <a id="white"></a> `white` | "\u001b\[37m" | "\x1b\[37m" | [defi/protocols/src/utils/dx.ts:38](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L38) |
| <a id="yellow"></a> `yellow` | "\u001b\[33m" | "\x1b\[33m" | [defi/protocols/src/utils/dx.ts:34](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L34) |

## Functions

### box()

```ts
function box(content: string, title?: string): string;
```

Defined in: [defi/protocols/src/utils/dx.ts:190](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L190)

Format a box around text

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `content` | `string` |
| `title?` | `string` |

#### Returns

`string`

***

### colorize()

```ts
function colorize(style: 
  | "bold"
  | "reset"
  | "dim"
  | "italic"
  | "underline"
  | "black"
  | "red"
  | "green"
  | "yellow"
  | "blue"
  | "magenta"
  | "cyan"
  | "white"
  | "brightRed"
  | "brightGreen"
  | "brightYellow"
  | "brightBlue"
  | "brightMagenta"
  | "brightCyan"
  | "bgRed"
  | "bgGreen"
  | "bgYellow"
  | "bgBlue"
  | "bgMagenta"
  | "bgCyan", text: string): string;
```

Defined in: [defi/protocols/src/utils/dx.ts:62](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L62)

Apply color/style to text

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `style` | \| `"bold"` \| `"reset"` \| `"dim"` \| `"italic"` \| `"underline"` \| `"black"` \| `"red"` \| `"green"` \| `"yellow"` \| `"blue"` \| `"magenta"` \| `"cyan"` \| `"white"` \| `"brightRed"` \| `"brightGreen"` \| `"brightYellow"` \| `"brightBlue"` \| `"brightMagenta"` \| `"brightCyan"` \| `"bgRed"` \| `"bgGreen"` \| `"bgYellow"` \| `"bgBlue"` \| `"bgMagenta"` \| `"bgCyan"` |
| `text` | `string` |

#### Returns

`string`

***

### formatAddress()

```ts
function formatAddress(address: string, chars: number): string;
```

Defined in: [defi/protocols/src/utils/dx.ts:325](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L325)

Format address with truncation

#### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `address` | `string` | `undefined` |
| `chars` | `number` | `6` |

#### Returns

`string`

***

### formatCurrency()

```ts
function formatCurrency(
   amount: string | number, 
   symbol: string, 
   decimals: number): string;
```

Defined in: [defi/protocols/src/utils/dx.ts:313](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L313)

Format currency amount

#### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `amount` | `string` \| `number` | `undefined` |
| `symbol` | `string` | `"USDs"` |
| `decimals` | `number` | `2` |

#### Returns

`string`

***

### formatError()

```ts
function formatError(errorKey: 
  | "RATE_LIMITED"
  | "NO_PRIVATE_KEY"
  | "INSUFFICIENT_BALANCE"
  | "INVALID_ADDRESS"
  | "NETWORK_ERROR"
  | "PAYMENT_FAILED"
  | "INVALID_CHAIN"): string;
```

Defined in: [defi/protocols/src/utils/dx.ts:278](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L278)

Format a helpful error message

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `errorKey` | \| `"RATE_LIMITED"` \| `"NO_PRIVATE_KEY"` \| `"INSUFFICIENT_BALANCE"` \| `"INVALID_ADDRESS"` \| `"NETWORK_ERROR"` \| `"PAYMENT_FAILED"` \| `"INVALID_CHAIN"` |

#### Returns

`string`

***

### formatTxHash()

```ts
function formatTxHash(hash: string): string;
```

Defined in: [defi/protocols/src/utils/dx.ts:333](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L333)

Format transaction hash

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `hash` | `string` |

#### Returns

`string`

***

### printPaymentSummary()

```ts
function printPaymentSummary(params: {
  amount: string;
  chain: string;
  newBalance: string;
  to: string;
  txHash: string;
}): void;
```

Defined in: [defi/protocols/src/utils/dx.ts:359](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L359)

Print x402 payment summary

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `params` | \{ `amount`: `string`; `chain`: `string`; `newBalance`: `string`; `to`: `string`; `txHash`: `string`; \} |
| `params.amount` | `string` |
| `params.chain` | `string` |
| `params.newBalance` | `string` |
| `params.to` | `string` |
| `params.txHash` | `string` |

#### Returns

`void`

***

### printWelcome()

```ts
function printWelcome(): void;
```

Defined in: [defi/protocols/src/utils/dx.ts:340](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L340)

Print a beautiful welcome message

#### Returns

`void`

***

### progressBar()

```ts
function progressBar(
   current: number, 
   total: number, 
   width: number): string;
```

Defined in: [defi/protocols/src/utils/dx.ts:176](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L176)

Progress bar for long operations

#### Parameters

| Parameter | Type | Default value |
| :------ | :------ | :------ |
| `current` | `number` | `undefined` |
| `total` | `number` | `undefined` |
| `width` | `number` | `30` |

#### Returns

`string`

***

### styled()

```ts
function styled(text: string, ...styleKeys: (
  | "bold"
  | "reset"
  | "dim"
  | "italic"
  | "underline"
  | "black"
  | "red"
  | "green"
  | "yellow"
  | "blue"
  | "magenta"
  | "cyan"
  | "white"
  | "brightRed"
  | "brightGreen"
  | "brightYellow"
  | "brightBlue"
  | "brightMagenta"
  | "brightCyan"
  | "bgRed"
  | "bgGreen"
  | "bgYellow"
  | "bgBlue"
  | "bgMagenta"
  | "bgCyan")[]): string;
```

Defined in: [defi/protocols/src/utils/dx.ts:69](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/utils/dx.ts#L69)

Apply multiple styles to text

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `text` | `string` |
| ...`styleKeys` | ( \| `"bold"` \| `"reset"` \| `"dim"` \| `"italic"` \| `"underline"` \| `"black"` \| `"red"` \| `"green"` \| `"yellow"` \| `"blue"` \| `"magenta"` \| `"cyan"` \| `"white"` \| `"brightRed"` \| `"brightGreen"` \| `"brightYellow"` \| `"brightBlue"` \| `"brightMagenta"` \| `"brightCyan"` \| `"bgRed"` \| `"bgGreen"` \| `"bgYellow"` \| `"bgBlue"` \| `"bgMagenta"` \| `"bgCyan"`)[] |

#### Returns

`string`
