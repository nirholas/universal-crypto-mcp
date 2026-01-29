/**
 * @universal-crypto-mcp/wallet-evm
 * 
 * EVM-specific type definitions
 * 
 * @author nich
 * @license Apache-2.0
 */

import type { Chain } from "viem";

/**
 * EVM wallet configuration
 */
export interface EVMWalletConfig {
  /** Private key with 0x prefix */
  privateKey: `0x${string}`;
  /** Chain ID in CAIP-2 format (e.g., "eip155:1") */
  chainId: string;
  /** Custom RPC URL */
  rpcUrl?: string;
  /** Viem chain object (optional, derived from chainId) */
  chain?: Chain;
}

/**
 * ERC20 token information
 */
export interface ERC20Token {
  address: `0x${string}`;
  symbol: string;
  name: string;
  decimals: number;
  balance?: string;
}

/**
 * ERC721/ERC1155 NFT information
 */
export interface EVMNft {
  contractAddress: `0x${string}`;
  tokenId: string;
  standard: "ERC721" | "ERC1155";
  name?: string;
  description?: string;
  imageUri?: string;
  metadataUri?: string;
  balance?: string; // For ERC1155
}

/**
 * Transaction options
 */
export interface TransactionOptions {
  /** Gas limit */
  gasLimit?: bigint;
  /** Max fee per gas (EIP-1559) */
  maxFeePerGas?: bigint;
  /** Max priority fee per gas (EIP-1559) */
  maxPriorityFeePerGas?: bigint;
  /** Gas price (legacy) */
  gasPrice?: bigint;
  /** Nonce override */
  nonce?: number;
}

/**
 * Gas estimation result
 */
export interface GasEstimate {
  /** Estimated gas limit */
  gasLimit: string;
  /** Current gas price */
  gasPrice: string;
  /** Max fee per gas (EIP-1559) */
  maxFeePerGas?: string;
  /** Max priority fee per gas (EIP-1559) */
  maxPriorityFeePerGas?: string;
  /** Estimated total cost in wei */
  estimatedCost: string;
  /** Estimated total cost in native token */
  estimatedCostFormatted: string;
}

/**
 * Signature result
 */
export interface SignatureResult {
  /** Full signature */
  signature: string;
  /** R component */
  r: string;
  /** S component */
  s: string;
  /** V component */
  v: number;
  /** Recovery ID */
  recoveryId?: number;
}

/**
 * Contract call options
 */
export interface ContractCallOptions {
  /** Contract address */
  address: `0x${string}`;
  /** ABI of the contract */
  abi: readonly unknown[];
  /** Function name to call */
  functionName: string;
  /** Function arguments */
  args?: readonly unknown[];
  /** Value to send (for payable functions) */
  value?: bigint;
}
