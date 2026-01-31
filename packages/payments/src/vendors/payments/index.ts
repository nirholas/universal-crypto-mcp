/**
 * payments Implementation
 *
 * Native crypto payment solutions using on-chain verification
 * Supports: EVM chains, Solana, x402 protocol
 */

import {
  createPublicClient,
  createWalletClient,
  http,
  parseAbi,
  type Address,
  type Hash,
} from 'viem';
import { mainnet, arbitrum, base, optimism, polygon } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';
import * as crypto from 'crypto';

export * from './types';

// ============================================================
// Chain Configuration
// ============================================================

const CHAINS = { mainnet, arbitrum, base, optimism, polygon } as const;

const RPC_URLS: Record<string, string> = {
  mainnet: process.env.RPC_MAINNET || 'https://eth.llamarpc.com',
  arbitrum: process.env.RPC_ARBITRUM || 'https://arb1.arbitrum.io/rpc',
  base: process.env.RPC_BASE || 'https://mainnet.base.org',
  optimism: process.env.RPC_OPTIMISM || 'https://mainnet.optimism.io',
  polygon: process.env.RPC_POLYGON || 'https://polygon-rpc.com',
};

const USDC_ADDRESSES: Record<string, Address> = {
  mainnet: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  arbitrum: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
  base: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  optimism: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85',
  polygon: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
};

const ERC20_ABI = parseAbi([
  'function transfer(address to, uint256 amount) returns (bool)',
  'function transferFrom(address from, address to, uint256 amount) returns (bool)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function balanceOf(address account) view returns (uint256)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'event Transfer(address indexed from, address indexed to, uint256 value)',
]);

// ============================================================
// Types
// ============================================================

interface PaymentRequest {
  amount: string;
  token: 'USDC' | 'USDT' | 'ETH';
  chain: keyof typeof CHAINS;
  recipient: Address;
  memo?: string;
  expiresAt?: number;
}

interface PaymentResult {
  id: string;
  txHash?: Hash;
  status: 'pending' | 'confirmed' | 'failed';
  amount: string;
  token: string;
  chain: string;
  payer?: Address;
  recipient: Address;
  timestamp: number;
}

interface RefundRequest {
  paymentId: string;
  amount?: string; // Partial refund if specified
  reason: string;
}

interface StakingReward {
  epoch: number;
  amount: string;
  validator: string;
  timestamp: number;
}

// ============================================================
// Core Payment Functions
// ============================================================

export async function createPayment(request: PaymentRequest): Promise<PaymentResult> {
  const paymentId = `pay_${Date.now().toString(36)}_${crypto.randomBytes(4).toString('hex')}`;
  
  return {
    id: paymentId,
    status: 'pending',
    amount: request.amount,
    token: request.token,
    chain: request.chain,
    recipient: request.recipient,
    timestamp: Date.now(),
  };
}

export async function verifyPayment(
  txHash: Hash,
  chain: keyof typeof CHAINS,
  expectedAmount: string,
  expectedRecipient: Address
): Promise<{ valid: boolean; payer?: Address; error?: string }> {
  try {
    const chainConfig = CHAINS[chain];
    const client = createPublicClient({
      chain: chainConfig,
      transport: http(RPC_URLS[chain]),
    });

    const receipt = await client.getTransactionReceipt({ hash: txHash });
    
    if (receipt.status !== 'success') {
      return { valid: false, error: 'Transaction failed' };
    }

    // Parse transfer events
    for (const log of receipt.logs) {
      if (log.topics[0] === '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef') {
        const to = `0x${log.topics[2]?.slice(26)}` as Address;
        if (to.toLowerCase() === expectedRecipient.toLowerCase()) {
          const amount = BigInt(log.data);
          const expectedAmountBigInt = BigInt(expectedAmount);
          
          if (amount >= expectedAmountBigInt) {
            const from = `0x${log.topics[1]?.slice(26)}` as Address;
            return { valid: true, payer: from };
          }
        }
      }
    }

    return { valid: false, error: 'Transfer not found in transaction' };
  } catch (error) {
    return { valid: false, error: (error as Error).message };
  }
}

export async function refund(
  request: RefundRequest,
  privateKey: string,
  chain: keyof typeof CHAINS
): Promise<{ success: boolean; txHash?: Hash; error?: string }> {
  try {
    const chainConfig = CHAINS[chain];
    const account = privateKeyToAccount(privateKey as `0x${string}`);
    
    const walletClient = createWalletClient({
      account,
      chain: chainConfig,
      transport: http(RPC_URLS[chain]),
    });

    // In production, look up original payment details
    const refundAmount = BigInt(request.amount || '0');
    
    // For native ETH refund
    const txHash = await walletClient.sendTransaction({
      to: '0x0000000000000000000000000000000000000000' as Address, // Replace with actual recipient
      value: refundAmount,
    });

    return { success: true, txHash };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

// ============================================================
// Webhook Verification (for x402 protocol)
// ============================================================

export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

export function webhook(
  payload: unknown,
  signature: string,
  secret: string
): { valid: boolean; event?: unknown; error?: string } {
  const payloadString = typeof payload === 'string' ? payload : JSON.stringify(payload);
  
  if (!verifyWebhookSignature(payloadString, signature, secret)) {
    return { valid: false, error: 'Invalid signature' };
  }

  return { valid: true, event: typeof payload === 'string' ? JSON.parse(payload) : payload };
}

// ============================================================
// Solana Staking Functions
// ============================================================

const SOLANA_RPC = process.env.RPC_SOLANA || 'https://api.mainnet-beta.solana.com';

export async function listSolanaStakingRewards(wallet: string): Promise<StakingReward[]> {
  const response = await fetch(SOLANA_RPC, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'getStakeActivation',
      params: [wallet],
    }),
  });

  const data = await response.json() as { result?: { state: string; active: number; inactive: number } };
  
  // Return mock rewards structure - in production, query stake account history
  return [{
    epoch: 0,
    amount: String(data.result?.active || 0),
    validator: 'unknown',
    timestamp: Date.now(),
  }];
}

export async function stakeOperations(options: {
  wallet: string;
  amount: string;
  validator: string;
  operation: 'stake' | 'unstake' | 'withdraw';
}): Promise<{ success: boolean; signature?: string; error?: string }> {
  // Solana stake operations require @solana/web3.js
  // This is a placeholder that returns the expected structure
  return {
    success: false,
    error: 'Solana staking requires @solana/web3.js integration',
  };
}

// ============================================================
// Utility Functions
// ============================================================

export function getTxLink(networkID: string, signature: string): string {
  const explorers: Record<string, string> = {
    'eip155:1': 'https://etherscan.io/tx/',
    'eip155:42161': 'https://arbiscan.io/tx/',
    'eip155:8453': 'https://basescan.org/tx/',
    'eip155:10': 'https://optimistic.etherscan.io/tx/',
    'eip155:137': 'https://polygonscan.com/tx/',
    'solana:mainnet': 'https://solscan.io/tx/',
    mainnet: 'https://etherscan.io/tx/',
    arbitrum: 'https://arbiscan.io/tx/',
    base: 'https://basescan.org/tx/',
    optimism: 'https://optimistic.etherscan.io/tx/',
    polygon: 'https://polygonscan.com/tx/',
    solana: 'https://solscan.io/tx/',
  };

  const explorer = explorers[networkID] || 'https://etherscan.io/tx/';
  return `${explorer}${signature}`;
}

export function replaceHome(filePath: string): string {
  const home = process.env.HOME || process.env.USERPROFILE || '';
  return filePath.replace(/^~/, home);
}

export function setFlattenedQueryParams(
  urlSearchParams: URLSearchParams,
  parameter: Record<string, unknown>,
  key: string = ''
): void {
  for (const [k, v] of Object.entries(parameter)) {
    const newKey = key ? `${key}[${k}]` : k;
    
    if (v === null || v === undefined) {
      continue;
    } else if (typeof v === 'object' && !Array.isArray(v)) {
      setFlattenedQueryParams(urlSearchParams, v as Record<string, unknown>, newKey);
    } else if (Array.isArray(v)) {
      v.forEach((item, i) => {
        if (typeof item === 'object') {
          setFlattenedQueryParams(urlSearchParams, item as Record<string, unknown>, `${newKey}[${i}]`);
        } else {
          urlSearchParams.append(`${newKey}[]`, String(item));
        }
      });
    } else {
      urlSearchParams.set(newKey, String(v));
    }
  }
}

// ============================================================
// Token Balance & Transfer Functions
// ============================================================

export async function getTokenBalance(
  address: Address,
  token: Address,
  chain: keyof typeof CHAINS
): Promise<bigint> {
  const client = createPublicClient({
    chain: CHAINS[chain],
    transport: http(RPC_URLS[chain]),
  });

  return client.readContract({
    address: token,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: [address],
  });
}

export async function transferToken(
  to: Address,
  amount: bigint,
  token: Address,
  privateKey: string,
  chain: keyof typeof CHAINS
): Promise<Hash> {
  const account = privateKeyToAccount(privateKey as `0x${string}`);
  
  const walletClient = createWalletClient({
    account,
    chain: CHAINS[chain],
    transport: http(RPC_URLS[chain]),
  });

  return walletClient.writeContract({
    address: token,
    abi: ERC20_ABI,
    functionName: 'transfer',
    args: [to, amount],
  });
}

export async function approveToken(
  spender: Address,
  amount: bigint,
  token: Address,
  privateKey: string,
  chain: keyof typeof CHAINS
): Promise<Hash> {
  const account = privateKeyToAccount(privateKey as `0x${string}`);
  
  const walletClient = createWalletClient({
    account,
    chain: CHAINS[chain],
    transport: http(RPC_URLS[chain]),
  });

  return walletClient.writeContract({
    address: token,
    abi: ERC20_ABI,
    functionName: 'approve',
    args: [spender, amount],
  });
}

// ============================================================
// x402 Protocol Integration
// ============================================================

export interface X402PaymentProof {
  signature: string;
  payer: Address;
  amount: string;
  token: string;
  chain: string;
  nonce: string;
  timestamp: number;
}

export function createX402PaymentProof(
  payer: Address,
  amount: string,
  token: string,
  chain: string
): X402PaymentProof {
  const nonce = crypto.randomBytes(16).toString('hex');
  const timestamp = Math.floor(Date.now() / 1000);
  
  return {
    signature: '', // Must be signed by payer
    payer,
    amount,
    token,
    chain,
    nonce,
    timestamp,
  };
}

export function verifyX402Proof(
  proof: X402PaymentProof,
  maxAge: number = 300 // 5 minutes
): { valid: boolean; error?: string } {
  const now = Math.floor(Date.now() / 1000);
  
  if (now - proof.timestamp > maxAge) {
    return { valid: false, error: 'Proof expired' };
  }

  if (!proof.signature) {
    return { valid: false, error: 'Missing signature' };
  }

  // Signature verification would happen here using viem's verifyMessage
  return { valid: true };
}
