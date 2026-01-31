/**
 * X402 Payment Client
 * 
 * Core client for x402 payment protocol integration
 * Handles payment creation, verification, and processing
 * 
 * @author Nich (@nichxbt)
 * @license Apache-2.0
 */

import { createPublicClient, createWalletClient, http, encodeFunctionData, type PublicClient, type WalletClient, type Account } from 'viem';
import { mainnet, polygon, arbitrum, base, optimism } from 'viem/chains';
import { v4 as uuidv4 } from 'uuid';
import type {
  X402Config,
  PaymentParams,
  PaymentRequest,
  PaymentResult,
  PaymentVerification,
  PaymentStatus,
  Address,
  Hash,
  ChainId,
  Token,
} from './types';
import { 
  DEFAULT_X402_CONFIG, 
  getToken, 
  formatTokenAmount, 
  parseTokenAmount,
  getRequiredConfirmations,
} from './config';

// ============================================
// Chain Configuration
// ============================================

const CHAIN_MAP = {
  1: mainnet,
  137: polygon,
  42161: arbitrum,
  8453: base,
  10: optimism,
} as const;

// ============================================
// Payment Contract ABI (Simplified)
// ============================================

const PAYMENT_ABI = [
  {
    name: 'pay',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'recipient', type: 'address' },
      { name: 'token', type: 'address' },
      { name: 'amount', type: 'uint256' },
      { name: 'paymentId', type: 'bytes32' },
      { name: 'nonce', type: 'bytes32' },
      { name: 'deadline', type: 'uint256' },
    ],
    outputs: [{ name: 'success', type: 'bool' }],
  },
  {
    name: 'verifyPayment',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'paymentId', type: 'bytes32' }],
    outputs: [
      { name: 'paid', type: 'bool' },
      { name: 'amount', type: 'uint256' },
      { name: 'sender', type: 'address' },
      { name: 'timestamp', type: 'uint256' },
    ],
  },
  {
    name: 'getPaymentDetails',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'paymentId', type: 'bytes32' }],
    outputs: [
      { name: 'recipient', type: 'address' },
      { name: 'token', type: 'address' },
      { name: 'amount', type: 'uint256' },
      { name: 'sender', type: 'address' },
      { name: 'timestamp', type: 'uint256' },
      { name: 'status', type: 'uint8' },
    ],
  },
] as const;

// ============================================
// ERC20 ABI
// ============================================

const ERC20_ABI = [
  {
    name: 'approve',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    name: 'allowance',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'transfer',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
] as const;

// ============================================
// X402 Client Class
// ============================================

export class X402Client {
  private config: X402Config;
  private publicClients: Map<ChainId, PublicClient> = new Map();
  private pendingPayments: Map<string, PaymentRequest> = new Map();

  constructor(config: Partial<X402Config> = {}) {
    this.config = { ...DEFAULT_X402_CONFIG, ...config };
    this.initializeClients();
  }

  /**
   * Initialize public clients for each supported chain
   */
  private initializeClients(): void {
    for (const [chainIdStr, networkConfig] of Object.entries(this.config.networks)) {
      const chainId = Number(chainIdStr) as ChainId;
      const chain = CHAIN_MAP[chainId as keyof typeof CHAIN_MAP];
      
      if (chain) {
        const client = createPublicClient({
          chain,
          transport: http(networkConfig.rpc),
        });
        this.publicClients.set(chainId, client as PublicClient);
      }
    }
  }

  /**
   * Get public client for chain
   */
  private getClient(chainId: ChainId): PublicClient {
    const client = this.publicClients.get(chainId);
    if (!client) {
      throw new Error(`No client configured for chain ${chainId}`);
    }
    return client;
  }

  /**
   * Create a new payment request
   */
  createPaymentRequest(params: PaymentParams): PaymentRequest {
    const token = getToken(params.token, params.chainId);
    if (!token) {
      throw new Error(`Token ${params.token} not supported on chain ${params.chainId}`);
    }

    const amountWei = parseTokenAmount(params.amount, token.decimals);
    
    // Validate amount limits
    if (amountWei < this.config.minPayment) {
      throw new Error(`Payment amount below minimum: ${formatTokenAmount(this.config.minPayment, token.decimals)} ${token.symbol}`);
    }
    if (amountWei > this.config.maxPayment) {
      throw new Error(`Payment amount exceeds maximum: ${formatTokenAmount(this.config.maxPayment, token.decimals)} ${token.symbol}`);
    }

    const expiresIn = params.expiresIn || this.config.paymentTimeout;
    const now = Math.floor(Date.now() / 1000);

    const paymentRequest: PaymentRequest = {
      id: uuidv4(),
      amount: params.amount,
      amountWei,
      token,
      recipient: params.recipient,
      chainId: params.chainId,
      description: params.description || params.metadata?.description || '',
      metadata: params.metadata || { description: params.description || '' },
      expiresAt: now + expiresIn,
      nonce: `0x${Buffer.from(uuidv4().replace(/-/g, ''), 'hex').toString('hex').padStart(64, '0')}`,
      createdAt: now,
    };

    // Store pending payment
    this.pendingPayments.set(paymentRequest.id, paymentRequest);

    return paymentRequest;
  }

  /**
   * Verify a payment from X-PAYMENT header
   */
  async verifyPayment(header: string): Promise<PaymentVerification> {
    try {
      // Parse X-PAYMENT header
      // Format: base64(JSON{paymentId, amount, token, sender, recipient, chainId, timestamp, expiresAt, signature})
      const decoded = JSON.parse(Buffer.from(header, 'base64').toString('utf-8'));
      
      const {
        paymentId,
        amount,
        token,
        sender,
        recipient,
        chainId,
        timestamp,
        expiresAt,
        signature,
      } = decoded;

      // Check if payment is expired
      const now = Math.floor(Date.now() / 1000);
      if (now > expiresAt) {
        return {
          isValid: false,
          paymentId,
          amount,
          token,
          sender,
          recipient,
          timestamp,
          expiresAt,
          signature,
          verified: false,
          onChainConfirmed: false,
        };
      }

      // Verify on-chain payment
      const onChainConfirmed = await this.verifyOnChain(paymentId, chainId);

      return {
        isValid: onChainConfirmed,
        paymentId,
        amount,
        token,
        sender,
        recipient,
        timestamp,
        expiresAt,
        signature,
        verified: true,
        onChainConfirmed,
      };
    } catch (error) {
      throw new Error(`Failed to verify payment header: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Verify payment on-chain
   */
  private async verifyOnChain(paymentId: string, chainId: ChainId): Promise<boolean> {
    try {
      const client = this.getClient(chainId);
      const paymentContract = this.config.networks[chainId]?.paymentContract;
      
      if (!paymentContract) {
        throw new Error(`No payment contract for chain ${chainId}`);
      }

      const paymentIdBytes = `0x${paymentId.replace(/-/g, '').padStart(64, '0')}` as Hash;
      
      const result = await client.readContract({
        address: paymentContract,
        abi: PAYMENT_ABI,
        functionName: 'verifyPayment',
        args: [paymentIdBytes],
      });

      const [paid] = result as [boolean, bigint, Address, bigint];
      return paid;
    } catch {
      // Contract call failed, payment not found
      return false;
    }
  }

  /**
   * Process a payment
   */
  async processPayment(
    request: PaymentRequest,
    walletClient: WalletClient,
    account: Account
  ): Promise<PaymentResult> {
    const { chainId, token, amountWei, recipient } = request;
    const paymentContract = this.config.networks[chainId]?.paymentContract;
    
    if (!paymentContract) {
      throw new Error(`No payment contract for chain ${chainId}`);
    }

    const client = this.getClient(chainId);

    try {
      // Check token balance
      const balance = await client.readContract({
        address: token.address,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: [account.address],
      }) as bigint;

      if (balance < amountWei) {
        return {
          success: false,
          paymentId: request.id,
          amount: request.amount,
          token: token.symbol,
          recipient,
          sender: account.address,
          chainId,
          status: 'failed',
          timestamp: Math.floor(Date.now() / 1000),
          error: `Insufficient balance: ${formatTokenAmount(balance, token.decimals)} ${token.symbol}`,
        };
      }

      // Check and set allowance
      const allowance = await client.readContract({
        address: token.address,
        abi: ERC20_ABI,
        functionName: 'allowance',
        args: [account.address, paymentContract],
      }) as bigint;

      if (allowance < amountWei) {
        // Approve spending
        const approveHash = await walletClient.writeContract({
          address: token.address,
          abi: ERC20_ABI,
          functionName: 'approve',
          args: [paymentContract, amountWei * 2n], // Approve 2x for future payments
          account,
          chain: CHAIN_MAP[chainId as keyof typeof CHAIN_MAP],
        });

        // Wait for approval confirmation
        await client.waitForTransactionReceipt({ hash: approveHash });
      }

      // Execute payment
      const paymentIdBytes = `0x${request.id.replace(/-/g, '').padStart(64, '0')}` as Hash;
      const nonceBytes = request.nonce as Hash;

      const txHash = await walletClient.writeContract({
        address: paymentContract,
        abi: PAYMENT_ABI,
        functionName: 'pay',
        args: [
          recipient,
          token.address,
          amountWei,
          paymentIdBytes,
          nonceBytes,
          BigInt(request.expiresAt),
        ],
        account,
        chain: CHAIN_MAP[chainId as keyof typeof CHAIN_MAP],
      });

      // Wait for confirmation
      const receipt = await client.waitForTransactionReceipt({ 
        hash: txHash,
        confirmations: getRequiredConfirmations(chainId),
      });

      // Remove from pending
      this.pendingPayments.delete(request.id);

      return {
        success: receipt.status === 'success',
        paymentId: request.id,
        txHash,
        amount: request.amount,
        token: token.symbol,
        recipient,
        sender: account.address,
        chainId,
        status: receipt.status === 'success' ? 'completed' : 'failed',
        timestamp: Math.floor(Date.now() / 1000),
        confirmations: getRequiredConfirmations(chainId),
      };
    } catch (error) {
      return {
        success: false,
        paymentId: request.id,
        amount: request.amount,
        token: token.symbol,
        recipient,
        sender: account.address,
        chainId,
        status: 'failed',
        timestamp: Math.floor(Date.now() / 1000),
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get payment status
   */
  async getStatus(paymentId: string, chainId?: ChainId): Promise<PaymentStatus> {
    // Check pending payments first
    const pending = this.pendingPayments.get(paymentId);
    if (pending) {
      const now = Math.floor(Date.now() / 1000);
      if (now > pending.expiresAt) {
        this.pendingPayments.delete(paymentId);
        return 'expired';
      }
      return 'pending';
    }

    // Check on-chain
    if (chainId) {
      const confirmed = await this.verifyOnChain(paymentId, chainId);
      return confirmed ? 'completed' : 'failed';
    }

    // Check all chains
    for (const chain of Object.keys(this.config.networks).map(Number)) {
      const confirmed = await this.verifyOnChain(paymentId, chain);
      if (confirmed) return 'completed';
    }

    return 'failed';
  }

  /**
   * Get pending payment request
   */
  getPendingPayment(paymentId: string): PaymentRequest | undefined {
    return this.pendingPayments.get(paymentId);
  }

  /**
   * Cancel a pending payment
   */
  cancelPayment(paymentId: string): boolean {
    return this.pendingPayments.delete(paymentId);
  }

  /**
   * Get token balance
   */
  async getTokenBalance(
    address: Address,
    token: Token
  ): Promise<{ balance: bigint; formatted: string }> {
    const client = this.getClient(token.chainId);
    
    const balance = await client.readContract({
      address: token.address,
      abi: ERC20_ABI,
      functionName: 'balanceOf',
      args: [address],
    }) as bigint;

    return {
      balance,
      formatted: formatTokenAmount(balance, token.decimals),
    };
  }

  /**
   * Generate X-PAYMENT header
   */
  generatePaymentHeader(request: PaymentRequest, sender: Address, signature: string): string {
    const payload = {
      paymentId: request.id,
      amount: request.amount,
      token: request.token.symbol,
      sender,
      recipient: request.recipient,
      chainId: request.chainId,
      timestamp: request.createdAt,
      expiresAt: request.expiresAt,
      signature,
    };

    return Buffer.from(JSON.stringify(payload)).toString('base64');
  }

  /**
   * Parse X-PAYMENT header
   */
  parsePaymentHeader(header: string): {
    paymentId: string;
    amount: string;
    token: string;
    sender: Address;
    recipient: Address;
    chainId: ChainId;
    timestamp: number;
    expiresAt: number;
    signature: string;
  } {
    return JSON.parse(Buffer.from(header, 'base64').toString('utf-8'));
  }

  /**
   * Get configuration
   */
  getConfig(): X402Config {
    return { ...this.config };
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<X402Config>): void {
    this.config = { ...this.config, ...config };
    this.initializeClients();
  }
}

// ============================================
// Singleton Instance
// ============================================

let x402ClientInstance: X402Client | null = null;

export function getX402Client(config?: Partial<X402Config>): X402Client {
  if (!x402ClientInstance || config) {
    x402ClientInstance = new X402Client(config);
  }
  return x402ClientInstance;
}

export default X402Client;
