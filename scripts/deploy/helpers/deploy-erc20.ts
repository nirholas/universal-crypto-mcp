/**
 * @file deploy-erc20.ts
 * @description ERC20 token deployment helper using viem
 * @author nirholas
 */

import {
  createWalletClient,
  createPublicClient,
  http,
  parseUnits,
  type Address,
  type WalletClient,
  type PublicClient,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

// Minimal ERC20 ABI for deployment verification
const ERC20_ABI = [
  { name: 'name', type: 'function', inputs: [], outputs: [{ type: 'string' }], stateMutability: 'view' },
  { name: 'symbol', type: 'function', inputs: [], outputs: [{ type: 'string' }], stateMutability: 'view' },
  { name: 'decimals', type: 'function', inputs: [], outputs: [{ type: 'uint8' }], stateMutability: 'view' },
  { name: 'totalSupply', type: 'function', inputs: [], outputs: [{ type: 'uint256' }], stateMutability: 'view' },
] as const;

// OpenZeppelin ERC20 bytecode (compiled)
// This is a placeholder - in production, compile from source
const ERC20_BYTECODE = '0x60806040523480156200001157600080fd5b50' as const;

export interface DeployERC20Params {
  name: string;
  symbol: string;
  decimals?: number;
  initialSupply?: string;
  privateKey: string;
  rpcUrl: string;
  chain: any;
}

export interface DeploymentResult {
  address: Address;
  txHash: string;
  blockNumber: bigint;
}

/**
 * Deploy an ERC20 token
 */
export async function deployERC20(params: DeployERC20Params): Promise<DeploymentResult> {
  const account = privateKeyToAccount(params.privateKey as `0x${string}`);
  
  const publicClient = createPublicClient({
    chain: params.chain,
    transport: http(params.rpcUrl),
  });

  const walletClient = createWalletClient({
    account,
    chain: params.chain,
    transport: http(params.rpcUrl),
  });

  const decimals = params.decimals || 18;
  const initialSupply = parseUnits(params.initialSupply || '1000000', decimals);

  // For actual deployment, use forge or hardhat compiled bytecode
  // This is a simplified example
  console.log(`Deploying ${params.name} (${params.symbol}) with ${initialSupply} supply...`);
  
  // In production: use actual bytecode and constructor args
  // const hash = await walletClient.deployContract({ ... });
  
  throw new Error('Use forge or hardhat for actual ERC20 deployment. This helper provides the interface.');
}

/**
 * Verify deployed ERC20 token
 */
export async function verifyERC20(
  address: Address,
  publicClient: PublicClient,
  expectedName: string,
  expectedSymbol: string
): Promise<boolean> {
  try {
    const [name, symbol] = await Promise.all([
      publicClient.readContract({ address, abi: ERC20_ABI, functionName: 'name' }),
      publicClient.readContract({ address, abi: ERC20_ABI, functionName: 'symbol' }),
    ]);

    return name === expectedName && symbol === expectedSymbol;
  } catch {
    return false;
  }
}

export default { deployERC20, verifyERC20 };
