/**
 * EVM Token Service
 * ERC20 token operations using viem
 */

import {
  type PublicClient,
  type WalletClient,
  type Hash,
  parseUnits,
  formatUnits,
} from 'viem';

const ERC20_ABI = [
  {
    name: 'name',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'string' }],
  },
  {
    name: 'symbol',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'string' }],
  },
  {
    name: 'decimals',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint8' }],
  },
  {
    name: 'totalSupply',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint256' }],
  },
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ type: 'uint256' }],
  },
  {
    name: 'transfer',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ type: 'bool' }],
  },
  {
    name: 'approve',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ type: 'bool' }],
  },
  {
    name: 'allowance',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    outputs: [{ type: 'uint256' }],
  },
] as const;

export interface ERC20DeployParams {
  name: string;
  symbol: string;
  decimals: number;
  initialSupply: string;
}

export interface ERC20TransferParams {
  token: `0x${string}`;
  from: `0x${string}`;
  to: `0x${string}`;
  amount: string;
}

export class EVMTokenService {
  private publicClient: PublicClient;
  private walletClient?: WalletClient;

  constructor(publicClient: PublicClient, walletClient?: WalletClient) {
    this.publicClient = publicClient;
    this.walletClient = walletClient;
  }

  async getTokenInfo(tokenAddress: `0x${string}`): Promise<{
    name: string;
    symbol: string;
    decimals: number;
    totalSupply: bigint;
  }> {
    const [name, symbol, decimals, totalSupply] = await Promise.all([
      this.publicClient.readContract({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: 'name',
      }),
      this.publicClient.readContract({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: 'symbol',
      }),
      this.publicClient.readContract({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: 'decimals',
      }),
      this.publicClient.readContract({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: 'totalSupply',
      }),
    ]);

    return { name, symbol, decimals, totalSupply };
  }

  async getBalance(
    tokenAddress: `0x${string}`,
    account: `0x${string}`
  ): Promise<{ raw: bigint; formatted: string }> {
    const [balance, decimals] = await Promise.all([
      this.publicClient.readContract({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: [account],
      }),
      this.publicClient.readContract({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: 'decimals',
      }),
    ]);

    return {
      raw: balance,
      formatted: formatUnits(balance, decimals),
    };
  }

  async transfer(params: ERC20TransferParams): Promise<Hash> {
    if (!this.walletClient) {
      throw new Error('Wallet client not configured');
    }

    const decimals = await this.publicClient.readContract({
      address: params.token,
      abi: ERC20_ABI,
      functionName: 'decimals',
    });

    const amount = parseUnits(params.amount, decimals);

    const { request } = await this.publicClient.simulateContract({
      address: params.token,
      abi: ERC20_ABI,
      functionName: 'transfer',
      args: [params.to, amount],
      account: params.from,
    });

    return this.walletClient.writeContract(request);
  }

  async approve(
    tokenAddress: `0x${string}`,
    spender: `0x${string}`,
    amount: bigint,
    account: `0x${string}`
  ): Promise<Hash> {
    if (!this.walletClient) {
      throw new Error('Wallet client not configured');
    }

    const { request } = await this.publicClient.simulateContract({
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: 'approve',
      args: [spender, amount],
      account,
    });

    return this.walletClient.writeContract(request);
  }

  async getAllowance(
    tokenAddress: `0x${string}`,
    owner: `0x${string}`,
    spender: `0x${string}`
  ): Promise<bigint> {
    return this.publicClient.readContract({
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: 'allowance',
      args: [owner, spender],
    });
  }
}
