/**
 * Contracts Layer
 * 
 * Smart contract utilities using viem/wagmi.
 * 
 * Reference: /vendor/contracts/
 */

import { 
  type Abi, 
  type Address,
  encodeFunctionData,
  decodeFunctionResult,
  parseAbi,
} from 'viem';

// ============================================================
// Re-exports from viem
// ============================================================

export {
  encodeFunctionData,
  decodeFunctionResult,
  parseAbi,
  encodeAbiParameters,
  decodeAbiParameters,
  keccak256,
  toHex,
  fromHex,
  parseEther,
  formatEther,
  parseUnits,
  formatUnits,
} from 'viem';

// ============================================================
// Contract Types
// ============================================================

export type { Abi, Address };

export interface ContractConfig {
  address: Address;
  abi: Abi;
  chainId: number;
}

export interface TransactionRequest {
  to: Address;
  data: `0x${string}`;
  value?: bigint;
  gas?: bigint;
  gasPrice?: bigint;
  maxFeePerGas?: bigint;
  maxPriorityFeePerGas?: bigint;
}

// ============================================================
// Common ABIs
// ============================================================

export const ERC20_ABI = parseAbi([
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address owner) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'event Transfer(address indexed from, address indexed to, uint256 value)',
  'event Approval(address indexed owner, address indexed spender, uint256 value)',
]);

export const ERC721_ABI = parseAbi([
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function tokenURI(uint256 tokenId) view returns (string)',
  'function balanceOf(address owner) view returns (uint256)',
  'function ownerOf(uint256 tokenId) view returns (address)',
  'function transferFrom(address from, address to, uint256 tokenId)',
  'function safeTransferFrom(address from, address to, uint256 tokenId)',
  'function approve(address to, uint256 tokenId)',
  'function setApprovalForAll(address operator, bool approved)',
  'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)',
]);
