[**Universal Crypto MCP API Reference v1.0.0**](../../../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/modules/tool-marketplace/contracts/abis

# defi/protocols/src/modules/tool-marketplace/contracts/abis

## Variables

### ERC20\_ABI

```ts
const ERC20_ABI: readonly [{
  inputs: readonly [{
     name: "spender";
     type: "address";
   }, {
     name: "amount";
     type: "uint256";
  }];
  name: "approve";
  outputs: readonly [{
     name: "";
     type: "bool";
  }];
  stateMutability: "nonpayable";
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
     name: "";
     type: "uint256";
  }];
  stateMutability: "view";
  type: "function";
}, {
  inputs: readonly [{
     name: "account";
     type: "address";
  }];
  name: "balanceOf";
  outputs: readonly [{
     name: "";
     type: "uint256";
  }];
  stateMutability: "view";
  type: "function";
}];
```

Defined in: [defi/protocols/src/modules/tool-marketplace/contracts/abis.ts:480](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/contracts/abis.ts#L480)

***

### REVENUE\_ROUTER\_ABI

```ts
const REVENUE_ROUTER_ABI: readonly [{
  inputs: readonly [{
     indexed: true;
     name: "toolId";
     type: "bytes32";
   }, {
     indexed: true;
     name: "payer";
     type: "address";
   }, {
     indexed: false;
     name: "amount";
     type: "uint256";
   }, {
     indexed: false;
     name: "platformFee";
     type: "uint256";
  }];
  name: "PaymentReceived";
  type: "event";
}, {
  inputs: readonly [{
     indexed: true;
     name: "toolId";
     type: "bytes32";
   }, {
     indexed: true;
     name: "recipient";
     type: "address";
   }, {
     indexed: false;
     name: "amount";
     type: "uint256";
  }];
  name: "RevenueDistributed";
  type: "event";
}, {
  inputs: readonly [{
     indexed: true;
     name: "recipient";
     type: "address";
   }, {
     indexed: false;
     name: "amount";
     type: "uint256";
  }];
  name: "PayoutClaimed";
  type: "event";
}, {
  inputs: readonly [{
     indexed: false;
     name: "recipients";
     type: "address[]";
   }, {
     indexed: false;
     name: "amounts";
     type: "uint256[]";
   }, {
     indexed: false;
     name: "totalAmount";
     type: "uint256";
  }];
  name: "BatchPayoutExecuted";
  type: "event";
}, {
  inputs: readonly [{
     name: "toolId";
     type: "bytes32";
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
     name: "toolId";
     type: "bytes32";
   }, {
     name: "from";
     type: "address";
   }, {
     name: "amount";
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
  name: "processPaymentWithAuthorization";
  outputs: readonly [];
  stateMutability: "nonpayable";
  type: "function";
}, {
  inputs: readonly [];
  name: "claimPayout";
  outputs: readonly [];
  stateMutability: "nonpayable";
  type: "function";
}, {
  inputs: readonly [{
     name: "recipients";
     type: "address[]";
  }];
  name: "executeBatchPayout";
  outputs: readonly [];
  stateMutability: "nonpayable";
  type: "function";
}, {
  inputs: readonly [{
     name: "account";
     type: "address";
  }];
  name: "getPendingBalance";
  outputs: readonly [{
     name: "";
     type: "uint256";
  }];
  stateMutability: "view";
  type: "function";
}, {
  inputs: readonly [{
     name: "account";
     type: "address";
  }];
  name: "canClaim";
  outputs: readonly [{
     name: "";
     type: "bool";
  }];
  stateMutability: "view";
  type: "function";
}, {
  inputs: readonly [{
     name: "amount";
     type: "uint256";
  }];
  name: "calculatePlatformFee";
  outputs: readonly [{
     name: "";
     type: "uint256";
  }];
  stateMutability: "view";
  type: "function";
}, {
  inputs: readonly [];
  name: "platformFeeBps";
  outputs: readonly [{
     name: "";
     type: "uint256";
  }];
  stateMutability: "view";
  type: "function";
}, {
  inputs: readonly [];
  name: "minimumPayoutThreshold";
  outputs: readonly [{
     name: "";
     type: "uint256";
  }];
  stateMutability: "view";
  type: "function";
}, {
  inputs: readonly [];
  name: "totalRevenueProcessed";
  outputs: readonly [{
     name: "";
     type: "uint256";
  }];
  stateMutability: "view";
  type: "function";
}];
```

Defined in: [defi/protocols/src/modules/tool-marketplace/contracts/abis.ts:227](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/contracts/abis.ts#L227)

***

### TOOL\_REGISTRY\_ABI

```ts
const TOOL_REGISTRY_ABI: readonly [{
  inputs: readonly [{
     indexed: true;
     name: "toolId";
     type: "bytes32";
   }, {
     indexed: true;
     name: "owner";
     type: "address";
   }, {
     indexed: false;
     name: "name";
     type: "string";
   }, {
     indexed: false;
     name: "endpoint";
     type: "string";
   }, {
     indexed: false;
     name: "pricePerCall";
     type: "uint256";
  }];
  name: "ToolRegistered";
  type: "event";
}, {
  inputs: readonly [{
     indexed: true;
     name: "toolId";
     type: "bytes32";
   }, {
     indexed: false;
     name: "metadataURI";
     type: "string";
   }, {
     indexed: false;
     name: "pricePerCall";
     type: "uint256";
  }];
  name: "ToolUpdated";
  type: "event";
}, {
  inputs: readonly [{
     indexed: true;
     name: "toolId";
     type: "bytes32";
  }];
  name: "ToolPaused";
  type: "event";
}, {
  inputs: readonly [{
     indexed: true;
     name: "toolId";
     type: "bytes32";
  }];
  name: "ToolActivated";
  type: "event";
}, {
  inputs: readonly [{
     indexed: true;
     name: "toolId";
     type: "bytes32";
   }, {
     indexed: false;
     name: "verifier";
     type: "address";
  }];
  name: "ToolVerified";
  type: "event";
}, {
  inputs: readonly [{
     indexed: true;
     name: "toolId";
     type: "bytes32";
   }, {
     indexed: true;
     name: "previousOwner";
     type: "address";
   }, {
     indexed: true;
     name: "newOwner";
     type: "address";
  }];
  name: "OwnershipTransferred";
  type: "event";
}, {
  inputs: readonly [{
     indexed: true;
     name: "toolId";
     type: "bytes32";
   }, {
     indexed: true;
     name: "payer";
     type: "address";
   }, {
     indexed: false;
     name: "amount";
     type: "uint256";
   }, {
     indexed: false;
     name: "totalCalls";
     type: "uint256";
  }];
  name: "UsageRecorded";
  type: "event";
}, {
  inputs: readonly [{
     name: "name";
     type: "string";
   }, {
     name: "endpoint";
     type: "string";
   }, {
     name: "metadataURI";
     type: "string";
   }, {
     name: "pricePerCall";
     type: "uint256";
   }, {
     name: "revenueRecipients";
     type: "address[]";
   }, {
     name: "revenueShares";
     type: "uint256[]";
  }];
  name: "registerTool";
  outputs: readonly [{
     name: "toolId";
     type: "bytes32";
  }];
  stateMutability: "nonpayable";
  type: "function";
}, {
  inputs: readonly [{
     name: "toolId";
     type: "bytes32";
   }, {
     name: "newMetadataURI";
     type: "string";
   }, {
     name: "newPricePerCall";
     type: "uint256";
  }];
  name: "updateTool";
  outputs: readonly [];
  stateMutability: "nonpayable";
  type: "function";
}, {
  inputs: readonly [{
     name: "toolId";
     type: "bytes32";
   }, {
     name: "newEndpoint";
     type: "string";
  }];
  name: "updateEndpoint";
  outputs: readonly [];
  stateMutability: "nonpayable";
  type: "function";
}, {
  inputs: readonly [{
     name: "toolId";
     type: "bytes32";
  }];
  name: "pauseTool";
  outputs: readonly [];
  stateMutability: "nonpayable";
  type: "function";
}, {
  inputs: readonly [{
     name: "toolId";
     type: "bytes32";
  }];
  name: "activateTool";
  outputs: readonly [];
  stateMutability: "nonpayable";
  type: "function";
}, {
  inputs: readonly [{
     name: "toolId";
     type: "bytes32";
   }, {
     name: "newOwner";
     type: "address";
  }];
  name: "transferOwnership";
  outputs: readonly [];
  stateMutability: "nonpayable";
  type: "function";
}, {
  inputs: readonly [{
     name: "toolId";
     type: "bytes32";
   }, {
     name: "recipients";
     type: "address[]";
   }, {
     name: "shares";
     type: "uint256[]";
  }];
  name: "updateRevenueSplit";
  outputs: readonly [];
  stateMutability: "nonpayable";
  type: "function";
}, {
  inputs: readonly [{
     name: "toolId";
     type: "bytes32";
  }];
  name: "getTool";
  outputs: readonly [{
     components: readonly [{
        name: "owner";
        type: "address";
      }, {
        name: "name";
        type: "string";
      }, {
        name: "endpoint";
        type: "string";
      }, {
        name: "metadataURI";
        type: "string";
      }, {
        name: "pricePerCall";
        type: "uint256";
      }, {
        name: "active";
        type: "bool";
      }, {
        name: "verified";
        type: "bool";
      }, {
        name: "totalCalls";
        type: "uint256";
      }, {
        name: "totalRevenue";
        type: "uint256";
      }, {
        name: "createdAt";
        type: "uint256";
      }, {
        name: "updatedAt";
        type: "uint256";
     }];
     name: "tool";
     type: "tuple";
  }];
  stateMutability: "view";
  type: "function";
}, {
  inputs: readonly [{
     name: "toolId";
     type: "bytes32";
  }];
  name: "getRevenueSplit";
  outputs: readonly [{
     name: "recipients";
     type: "address[]";
   }, {
     name: "shares";
     type: "uint256[]";
  }];
  stateMutability: "view";
  type: "function";
}, {
  inputs: readonly [{
     name: "toolId";
     type: "bytes32";
  }];
  name: "toolExists";
  outputs: readonly [{
     name: "exists";
     type: "bool";
  }];
  stateMutability: "view";
  type: "function";
}, {
  inputs: readonly [{
     name: "name";
     type: "string";
   }, {
     name: "owner";
     type: "address";
  }];
  name: "getToolId";
  outputs: readonly [{
     name: "toolId";
     type: "bytes32";
  }];
  stateMutability: "pure";
  type: "function";
}, {
  inputs: readonly [{
     name: "owner";
     type: "address";
  }];
  name: "getToolsByOwner";
  outputs: readonly [{
     name: "toolIds";
     type: "bytes32[]";
  }];
  stateMutability: "view";
  type: "function";
}, {
  inputs: readonly [];
  name: "totalTools";
  outputs: readonly [{
     name: "count";
     type: "uint256";
  }];
  stateMutability: "view";
  type: "function";
}, {
  inputs: readonly [{
     name: "offset";
     type: "uint256";
   }, {
     name: "limit";
     type: "uint256";
  }];
  name: "getAllTools";
  outputs: readonly [{
     name: "toolIds";
     type: "bytes32[]";
  }];
  stateMutability: "view";
  type: "function";
}];
```

Defined in: [defi/protocols/src/modules/tool-marketplace/contracts/abis.ts:14](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/contracts/abis.ts#L14)

#### File

abis.ts

#### Author

nichxbt

#### Copyright

(c) 2026 nirholas

#### Repository

universal-crypto-mcp

Contract ABIs for the marketplace contracts

***

### TOOL\_STAKING\_ABI

```ts
const TOOL_STAKING_ABI: readonly [{
  inputs: readonly [{
     indexed: true;
     name: "staker";
     type: "address";
   }, {
     indexed: false;
     name: "amount";
     type: "uint256";
   }, {
     indexed: false;
     name: "totalStake";
     type: "uint256";
  }];
  name: "Staked";
  type: "event";
}, {
  inputs: readonly [{
     indexed: true;
     name: "staker";
     type: "address";
   }, {
     indexed: false;
     name: "amount";
     type: "uint256";
   }, {
     indexed: false;
     name: "unlockTime";
     type: "uint256";
  }];
  name: "UnstakeRequested";
  type: "event";
}, {
  inputs: readonly [{
     indexed: true;
     name: "staker";
     type: "address";
   }, {
     indexed: false;
     name: "amount";
     type: "uint256";
  }];
  name: "Unstaked";
  type: "event";
}, {
  inputs: readonly [{
     indexed: true;
     name: "staker";
     type: "address";
   }, {
     indexed: false;
     name: "amount";
     type: "uint256";
   }, {
     indexed: false;
     name: "reason";
     type: "string";
  }];
  name: "Slashed";
  type: "event";
}, {
  inputs: readonly [{
     name: "amount";
     type: "uint256";
  }];
  name: "stake";
  outputs: readonly [];
  stateMutability: "nonpayable";
  type: "function";
}, {
  inputs: readonly [{
     name: "amount";
     type: "uint256";
  }];
  name: "requestUnstake";
  outputs: readonly [];
  stateMutability: "nonpayable";
  type: "function";
}, {
  inputs: readonly [];
  name: "cancelUnstake";
  outputs: readonly [];
  stateMutability: "nonpayable";
  type: "function";
}, {
  inputs: readonly [];
  name: "unstake";
  outputs: readonly [];
  stateMutability: "nonpayable";
  type: "function";
}, {
  inputs: readonly [{
     name: "user";
     type: "address";
  }];
  name: "getStake";
  outputs: readonly [{
     name: "";
     type: "uint256";
  }];
  stateMutability: "view";
  type: "function";
}, {
  inputs: readonly [{
     name: "user";
     type: "address";
  }];
  name: "getStakeInfo";
  outputs: readonly [{
     components: readonly [{
        name: "amount";
        type: "uint256";
      }, {
        name: "lockedUntil";
        type: "uint256";
      }, {
        name: "pendingUnstake";
        type: "uint256";
      }, {
        name: "unstakeRequestTime";
        type: "uint256";
      }, {
        name: "hasActiveUnstake";
        type: "bool";
     }];
     name: "";
     type: "tuple";
  }];
  stateMutability: "view";
  type: "function";
}, {
  inputs: readonly [{
     name: "user";
     type: "address";
  }];
  name: "meetsMinimumStake";
  outputs: readonly [{
     name: "";
     type: "bool";
  }];
  stateMutability: "view";
  type: "function";
}, {
  inputs: readonly [];
  name: "minimumStake";
  outputs: readonly [{
     name: "";
     type: "uint256";
  }];
  stateMutability: "view";
  type: "function";
}, {
  inputs: readonly [];
  name: "totalStaked";
  outputs: readonly [{
     name: "";
     type: "uint256";
  }];
  stateMutability: "view";
  type: "function";
}, {
  inputs: readonly [];
  name: "UNSTAKE_DELAY";
  outputs: readonly [{
     name: "";
     type: "uint256";
  }];
  stateMutability: "view";
  type: "function";
}];
```

Defined in: [defi/protocols/src/modules/tool-marketplace/contracts/abis.ts:356](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/modules/tool-marketplace/contracts/abis.ts#L356)
