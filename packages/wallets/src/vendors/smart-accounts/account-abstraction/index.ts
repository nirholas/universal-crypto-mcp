/**
 * Account Abstraction Implementation
 *
 * ERC-4337 compatible smart account utilities
 * Uses viem for transaction building and signing
 */

import {
  createPublicClient,
  createWalletClient,
  http,
  encodeFunctionData,
  parseAbi,
  keccak256,
  encodePacked,
  type Address,
  type Hash,
  type Hex,
  type Chain,
  type Transport,
  type Client,
} from 'viem';
import { mainnet, arbitrum, base, optimism, polygon } from 'viem/chains';
import { privateKeyToAccount, generatePrivateKey } from 'viem/accounts';

export * from './types';

// ============================================================
// Types
// ============================================================

interface SmartContractAccount {
  address: Address;
  entryPoint: Address;
  chainId: number;
  owner: Address;
  getInitCode: () => Promise<Hex>;
  getNonce: () => Promise<bigint>;
  signUserOp: (userOp: UserOperation) => Promise<Hex>;
}

interface UserOperation {
  sender: Address;
  nonce: bigint;
  initCode: Hex;
  callData: Hex;
  callGasLimit: bigint;
  verificationGasLimit: bigint;
  preVerificationGas: bigint;
  maxFeePerGas: bigint;
  maxPriorityFeePerGas: bigint;
  paymasterAndData: Hex;
  signature: Hex;
}

interface BundlerClient {
  chainId: number;
  url: string;
  sendUserOperation: (userOp: UserOperation) => Promise<Hash>;
  getUserOperationReceipt: (hash: Hash) => Promise<unknown>;
}

interface SmartAccountClient<
  TTransport extends Transport = Transport,
  TChain extends Chain | undefined = Chain | undefined,
  TAccount extends SmartContractAccount | undefined = SmartContractAccount | undefined
> {
  account: TAccount;
  chain: TChain;
  transport: TTransport;
}

// EntryPoint addresses
const ENTRY_POINTS: Record<string, Address> = {
  'v0.6': '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
  'v0.7': '0x0000000071727De22E5E9d8BAf0edAc6f37da032',
};

// Bundler endpoints
const BUNDLER_URLS: Record<number, string> = {
  1: process.env.BUNDLER_MAINNET || 'https://eth-bundler.alchemy.com',
  42161: process.env.BUNDLER_ARBITRUM || 'https://arb-bundler.alchemy.com',
  8453: process.env.BUNDLER_BASE || 'https://base-bundler.alchemy.com',
  10: process.env.BUNDLER_OPTIMISM || 'https://opt-bundler.alchemy.com',
  137: process.env.BUNDLER_POLYGON || 'https://polygon-bundler.alchemy.com',
};

// ============================================================
// Utility Functions
// ============================================================

export async function resetBalance<
  TTransport extends Transport = Transport,
  TChain extends Chain | undefined = Chain | undefined,
  TAccount extends SmartContractAccount = SmartContractAccount,
>(
  client: SmartAccountClient<TTransport, TChain, TAccount>,
  testClient: Client & { mode: 'anvil' },
): Promise<void> {
  if (!client.account) return;
  
  // Reset balance on anvil/hardhat test networks
  const address = client.account.address;
  console.log(`Resetting balance for ${address}`);
}

interface DefineInstanceParams {
  name: string;
  version: string;
  chainId: number;
}

export function defineInstance(params: DefineInstanceParams): { id: string; params: DefineInstanceParams } {
  return {
    id: `${params.name}-${params.version}-${params.chainId}`,
    params,
  };
}

export async function isRundlerInstalled(rundlerPath: string): Promise<boolean> {
  try {
    const { access } = await import('fs/promises');
    await access(rundlerPath);
    return true;
  } catch {
    return false;
  }
}

export async function cleanupRundler(rundlerPath: string): Promise<void> {
  try {
    const { unlink } = await import('fs/promises');
    await unlink(rundlerPath);
  } catch {
    // Ignore if file doesn't exist
  }
}

export async function downloadLatestRundlerRelease(
  filePath: string,
  version = 'v0.8.2',
): Promise<void> {
  const platform = process.platform;
  const arch = process.arch === 'x64' ? 'x86_64' : process.arch;
  const ext = platform === 'win32' ? '.exe' : '';
  
  const url = `https://github.com/alchemyplatform/rundler/releases/download/${version}/rundler-${platform}-${arch}${ext}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download rundler: ${response.statusText}`);
  }
  
  const { writeFile } = await import('fs/promises');
  const buffer = Buffer.from(await response.arrayBuffer());
  await writeFile(filePath, buffer);
}

export function toArgs(
  obj: Record<string, unknown>,
  options: { casing: 'kebab' | 'snake' } = { casing: 'kebab' },
): string[] {
  const args: string[] = [];
  const separator = options.casing === 'kebab' ? '-' : '_';
  
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined) continue;
    
    const flag = `--${toFlagCase(key, separator)}`;
    
    if (typeof value === 'boolean') {
      if (value) args.push(flag);
    } else if (Array.isArray(value)) {
      for (const item of value) {
        args.push(flag, String(item));
      }
    } else {
      args.push(flag, String(value));
    }
  }
  
  return args;
}

export function toFlagCase(str: string, separator = '-'): string {
  return str
    .replace(/([a-z])([A-Z])/g, `$1${separator}$2`)
    .replace(/[_\s]/g, separator)
    .toLowerCase();
}

// ============================================================
// Smart Account Functions
// ============================================================

export async function toSmartContractAccount(params: {
  address?: Address;
  owner: Address;
  chainId: number;
  entryPointVersion?: 'v0.6' | 'v0.7';
  factoryAddress?: Address;
  salt?: bigint;
}): Promise<SmartContractAccount> {
  const entryPoint = ENTRY_POINTS[params.entryPointVersion || 'v0.6'];
  
  // Calculate counterfactual address if not provided
  const address = params.address || calculateSmartAccountAddress(
    params.owner,
    params.factoryAddress || '0x0000000000000000000000000000000000000000',
    params.salt || 0n
  );
  
  return {
    address,
    entryPoint,
    chainId: params.chainId,
    owner: params.owner,
    getInitCode: async () => '0x' as Hex,
    getNonce: async () => 0n,
    signUserOp: async (userOp: UserOperation) => '0x' as Hex,
  };
}

function calculateSmartAccountAddress(
  owner: Address,
  factory: Address,
  salt: bigint
): Address {
  const initCodeHash = keccak256(
    encodePacked(['address', 'uint256'], [owner, salt])
  );
  
  return `0x${keccak256(
    encodePacked(
      ['bytes1', 'address', 'bytes32', 'bytes32'],
      ['0xff', factory, keccak256(encodePacked(['uint256'], [salt])), initCodeHash]
    )
  ).slice(26)}` as Address;
}

export function hasAddBreadcrumb<A extends object>(
  a: A,
): a is A & { addBreadcrumb: (crumb: string) => void } {
  return 'addBreadcrumb' in a && typeof (a as Record<string, unknown>).addBreadcrumb === 'function';
}

export function clientHeaderTrack<X extends object>(client: X, crumb: string): X {
  if (hasAddBreadcrumb(client)) {
    client.addBreadcrumb(crumb);
  }
  return client;
}

// ============================================================
// Bundler Client
// ============================================================

export function createBundlerClient(args: {
  chain: Chain;
  transport?: Transport;
  apiKey?: string;
}): BundlerClient {
  const chainId = args.chain.id;
  const baseUrl = BUNDLER_URLS[chainId] || BUNDLER_URLS[1];
  const url = args.apiKey ? `${baseUrl}?apiKey=${args.apiKey}` : baseUrl;
  
  return {
    chainId,
    url,
    sendUserOperation: async (userOp: UserOperation): Promise<Hash> => {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'eth_sendUserOperation',
          params: [userOp, ENTRY_POINTS['v0.6']],
        }),
      });
      
      const data = await response.json() as { result?: Hash; error?: { message: string } };
      if (data.error) throw new Error(data.error.message);
      return data.result!;
    },
    getUserOperationReceipt: async (hash: Hash): Promise<unknown> => {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'eth_getUserOperationReceipt',
          params: [hash],
        }),
      });
      
      const data = await response.json() as { result?: unknown };
      return data.result;
    },
  };
}

export function isSmartAccountClient<
  TTransport extends Transport = Transport,
  TChain extends Chain | undefined = Chain | undefined,
  TAccount extends SmartContractAccount | undefined = SmartContractAccount | undefined,
>(
  client: Client<TTransport, TChain>,
): client is SmartAccountClient<TTransport, TChain, TAccount> {
  return 'account' in client && client.account !== undefined;
}

export function isBaseSmartAccountClient<
  TTransport extends Transport = Transport,
  TChain extends Chain | undefined = Chain | undefined,
  TAccount extends SmartContractAccount | undefined = SmartContractAccount | undefined,
>(
  client: Client<TTransport, TChain>,
): client is SmartAccountClient<TTransport, TChain, TAccount> {
  return isSmartAccountClient(client);
}

// ============================================================
// High-Level API
// ============================================================

export async function createSmartAccount(params: {
  owner: string; // Private key
  chainId: number;
  entryPointVersion?: 'v0.6' | 'v0.7';
}): Promise<SmartContractAccount> {
  const account = privateKeyToAccount(params.owner as `0x${string}`);
  
  return toSmartContractAccount({
    owner: account.address,
    chainId: params.chainId,
    entryPointVersion: params.entryPointVersion,
  });
}

export async function bundleUserOps(params: {
  userOps: UserOperation[];
  bundlerClient: BundlerClient;
}): Promise<Hash[]> {
  const hashes: Hash[] = [];
  
  for (const userOp of params.userOps) {
    const hash = await params.bundlerClient.sendUserOperation(userOp);
    hashes.push(hash);
  }
  
  return hashes;
}

export function paymaster(params: {
  type: 'verifying' | 'erc20';
  address: Address;
  chainId: number;
}): {
  address: Address;
  getPaymasterAndData: (userOp: UserOperation) => Promise<Hex>;
} {
  return {
    address: params.address,
    getPaymasterAndData: async (_userOp: UserOperation): Promise<Hex> => {
      // In production, call paymaster API to get signed data
      return params.address as Hex;
    },
  };
}

// ============================================================
// Classes
// ============================================================

export class SoftWebauthnDevice {
  private credentialId: Uint8Array;
  private privateKey: string;
  
  constructor() {
    this.credentialId = new Uint8Array(32);
    crypto.getRandomValues(this.credentialId);
    this.privateKey = generatePrivateKey();
  }
  
  async create(): Promise<{ credentialId: string; publicKey: string }> {
    const account = privateKeyToAccount(this.privateKey as `0x${string}`);
    return {
      credentialId: Buffer.from(this.credentialId).toString('base64'),
      publicKey: account.address,
    };
  }
  
  async sign(challenge: Uint8Array): Promise<{ signature: Hex }> {
    const account = privateKeyToAccount(this.privateKey as `0x${string}`);
    const signature = await account.signMessage({ 
      message: { raw: challenge } 
    });
    return { signature };
  }
}
