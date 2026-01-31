/**
 * contracts Implementation
 *
 * Adapted from: abi-types, ethers, foundry-toolkit, permit-approvals
 * See vendor/contracts/ for reference implementations.
 */

import {
  createPublicClient,
  createWalletClient,
  http,
  getContract as viemGetContract,
  type Abi,
  type AbiParameter,
  type AbiEvent,
  type Address,
  type Hash,
  type PublicClient,
  type WalletClient,
  type Transport,
  type Chain,
} from 'viem';
import { mainnet, arbitrum, base, optimism, polygon } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';

export * from './types';

// ============================================================
// Type Definitions
// ============================================================

type AbiEventParameter = AbiParameter & { indexed?: boolean };

type FormatAbi<T> = T extends readonly unknown[] ? string[] : never;
type FormatAbiItem<T> = string;
type FormatAbiParameter<T> = string;
type FormatAbiParameters<T> = string;
type ParseAbi<T> = Abi;
type Signatures<T> = T;

// Chain registry
const CHAINS: Record<string, Chain> = {
  mainnet,
  ethereum: mainnet,
  arbitrum,
  base,
  optimism,
  polygon,
};

const RPC_URLS: Record<string, string> = {
  mainnet: process.env.RPC_MAINNET || 'https://eth.llamarpc.com',
  arbitrum: process.env.RPC_ARBITRUM || 'https://arb1.arbitrum.io/rpc',
  base: process.env.RPC_BASE || 'https://mainnet.base.org',
  optimism: process.env.RPC_OPTIMISM || 'https://mainnet.optimism.io',
  polygon: process.env.RPC_POLYGON || 'https://polygon-rpc.com',
};

// ============================================================
// ABI Formatting Functions
// ============================================================

export function formatAbi<const TAbi extends Abi | readonly unknown[]>(
  abi: TAbi,
): FormatAbi<TAbi> {
  if (!Array.isArray(abi)) {
    return [] as unknown as FormatAbi<TAbi>;
  }

  return abi.map(item => formatAbiItem(item as Abi[number])) as FormatAbi<TAbi>;
}

export function formatAbiItem<const TAbiItem extends Abi[number]>(
  abiItem: TAbiItem,
): FormatAbiItem<TAbiItem> {
  if (!abiItem || typeof abiItem !== 'object') {
    return '';
  }

  const item = abiItem as { type: string; name?: string; inputs?: AbiParameter[]; outputs?: AbiParameter[] };

  switch (item.type) {
    case 'function': {
      const inputs = item.inputs?.map(formatAbiParameter).join(', ') || '';
      const outputs = item.outputs?.map(formatAbiParameter).join(', ') || '';
      return `function ${item.name}(${inputs})${outputs ? ` returns (${outputs})` : ''}`;
    }
    case 'event': {
      const inputs = item.inputs?.map(formatAbiParameter).join(', ') || '';
      return `event ${item.name}(${inputs})`;
    }
    case 'error': {
      const inputs = item.inputs?.map(formatAbiParameter).join(', ') || '';
      return `error ${item.name}(${inputs})`;
    }
    case 'constructor': {
      const inputs = item.inputs?.map(formatAbiParameter).join(', ') || '';
      return `constructor(${inputs})`;
    }
    case 'fallback':
      return 'fallback()';
    case 'receive':
      return 'receive()';
    default:
      return '';
  }
}

export function formatAbiParameter<
  const TAbiParameter extends AbiParameter | AbiEventParameter,
>(abiParameter: TAbiParameter): FormatAbiParameter<TAbiParameter> {
  const param = abiParameter as AbiParameter & { indexed?: boolean };
  const indexed = param.indexed ? ' indexed' : '';
  const name = param.name ? ` ${param.name}` : '';
  return `${param.type}${indexed}${name}`;
}

export function formatAbiParameters<
  const TAbiParameters extends readonly [
    AbiParameter | AbiEventParameter,
    ...(readonly (AbiParameter | AbiEventParameter)[]),
  ],
>(abiParameters: TAbiParameters): FormatAbiParameters<TAbiParameters> {
  return abiParameters.map(formatAbiParameter).join(', ');
}

export function parseAbi<const TSignatures extends readonly string[]>(
  signatures: TSignatures,
): ParseAbi<TSignatures> {
  const abi: Abi = [];

  for (const sig of signatures) {
    const trimmed = sig.trim();
    
    if (trimmed.startsWith('function ')) {
      const match = trimmed.match(/^function\s+(\w+)\s*\(([^)]*)\)(?:\s*(?:view|pure|payable))?\s*(?:returns\s*\(([^)]*)\))?$/);
      if (match) {
        abi.push({
          type: 'function',
          name: match[1],
          inputs: parseParams(match[2]),
          outputs: match[3] ? parseParams(match[3]) : [],
          stateMutability: trimmed.includes('view') ? 'view' : trimmed.includes('pure') ? 'pure' : 'nonpayable',
        });
      }
    } else if (trimmed.startsWith('event ')) {
      const match = trimmed.match(/^event\s+(\w+)\s*\(([^)]*)\)$/);
      if (match) {
        abi.push({
          type: 'event',
          name: match[1],
          inputs: parseParams(match[2]).map(p => ({ ...p, indexed: false })),
        } as unknown as AbiEvent);
      }
    } else if (trimmed.startsWith('error ')) {
      const match = trimmed.match(/^error\s+(\w+)\s*\(([^)]*)\)$/);
      if (match) {
        abi.push({
          type: 'error',
          name: match[1],
          inputs: parseParams(match[2]),
        });
      }
    }
  }

  return abi as ParseAbi<TSignatures>;
}

function parseParams(params: string): AbiParameter[] {
  if (!params.trim()) return [];
  
  return params.split(',').map((p, i) => {
    const parts = p.trim().split(/\s+/);
    return {
      type: parts[0],
      name: parts[1] || `arg${i}`,
    };
  });
}

// ============================================================
// Contract Interaction Functions
// ============================================================

export interface ContractConfig {
  address: Address;
  abi: Abi;
  chain?: string;
  rpcUrl?: string;
}

export interface WriteConfig extends ContractConfig {
  privateKey: string;
}

export function getContract(config: ContractConfig): ReturnType<typeof viemGetContract> {
  const chain = CHAINS[config.chain || 'mainnet'] || mainnet;
  const rpcUrl = config.rpcUrl || RPC_URLS[config.chain || 'mainnet'];

  const client = createPublicClient({
    chain,
    transport: http(rpcUrl),
  });

  return viemGetContract({
    address: config.address,
    abi: config.abi,
    client,
  });
}

export async function readContract(config: ContractConfig & {
  functionName: string;
  args?: unknown[];
}): Promise<unknown> {
  const chain = CHAINS[config.chain || 'mainnet'] || mainnet;
  const rpcUrl = config.rpcUrl || RPC_URLS[config.chain || 'mainnet'];

  const client = createPublicClient({
    chain,
    transport: http(rpcUrl),
  });

  return client.readContract({
    address: config.address,
    abi: config.abi,
    functionName: config.functionName,
    args: config.args || [],
  });
}

export async function writeContract(config: WriteConfig & {
  functionName: string;
  args?: unknown[];
  value?: bigint;
}): Promise<Hash> {
  const chain = CHAINS[config.chain || 'mainnet'] || mainnet;
  const rpcUrl = config.rpcUrl || RPC_URLS[config.chain || 'mainnet'];

  const account = privateKeyToAccount(config.privateKey as `0x${string}`);

  const walletClient = createWalletClient({
    account,
    chain,
    transport: http(rpcUrl),
  });

  return walletClient.writeContract({
    address: config.address,
    abi: config.abi,
    functionName: config.functionName,
    args: config.args || [],
    value: config.value,
  });
}

export function watchEvent(config: ContractConfig & {
  eventName: string;
  onLogs: (logs: unknown[]) => void;
  onError?: (error: Error) => void;
}): () => void {
  const chain = CHAINS[config.chain || 'mainnet'] || mainnet;
  const rpcUrl = config.rpcUrl || RPC_URLS[config.chain || 'mainnet'];

  const client = createPublicClient({
    chain,
    transport: http(rpcUrl),
  });

  const unwatch = client.watchContractEvent({
    address: config.address,
    abi: config.abi,
    eventName: config.eventName,
    onLogs: config.onLogs as Parameters<typeof client.watchContractEvent>[0]['onLogs'],
    onError: config.onError,
  });

  return unwatch;
}

// ============================================================
// Error Classes
// ============================================================

export class BaseError extends Error {
  public readonly shortMessage: string;
  public readonly details?: string;
  public readonly cause?: Error;

  constructor(shortMessage: string, options?: { details?: string; cause?: Error }) {
    super(shortMessage);
    this.name = 'BaseError';
    this.shortMessage = shortMessage;
    this.details = options?.details;
    this.cause = options?.cause;
  }
}

export class ContractFunctionExecutionError extends BaseError {
  constructor(
    public readonly contractAddress: Address,
    public readonly functionName: string,
    options?: { details?: string; cause?: Error }
  ) {
    super(`Contract function "${functionName}" failed`, options);
    this.name = 'ContractFunctionExecutionError';
  }
}

export class ContractFunctionRevertedError extends BaseError {
  constructor(
    public readonly reason: string,
    options?: { details?: string; cause?: Error }
  ) {
    super(`Contract reverted: ${reason}`, options);
    this.name = 'ContractFunctionRevertedError';
  }
}
