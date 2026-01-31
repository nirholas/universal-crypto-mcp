# ⛓️ Agent 2: Settlement Engine & Multi-Chain

## 🎯 Mission

Build the settlement layer that executes payments across EVM chains and Solana. You handle the actual on-chain transactions, gas optimization, and chain-specific logic.

---

## 📋 Context

You are working on the `universal-crypto-mcp` repository. Agent 1 is building the core facilitator with types and verification. You implement the actual blockchain interactions.

**Your Dependencies:**
- Agent 1's types from `src/core/types.ts`
- Agent 1's `PaymentProcessor` will call your `SettlementEngine`

**Key Reference Files:**
- `/workspaces/universal-crypto-mcp/x402/typescript/packages/` - x402 reference
- `/workspaces/universal-crypto-mcp/packages/payments/` - Payment infrastructure
- `/workspaces/universal-crypto-mcp/packages/defi/` - DeFi utilities

---

## 🏗️ Phase 1: Settlement Foundation

### Task 1.1: Create Settlement Types

Create `src/settlement/types.ts`:

```typescript
/**
 * Settlement types for multi-chain payment execution
 */

import type { PaymentProof, NetworkConfig } from '../core/types.js';

// ═══════════════════════════════════════════════════════════════
// Settlement Types
// ═══════════════════════════════════════════════════════════════

export type SettlementStatus = 
  | 'pending'
  | 'submitted'
  | 'confirming'
  | 'confirmed'
  | 'failed';

export interface SettlementRequest {
  paymentId: string;
  proof: PaymentProof;
  fee: string;
  priority: 'low' | 'normal' | 'high';
  retryCount: number;
  maxRetries: number;
}

export interface SettlementResult {
  paymentId: string;
  status: SettlementStatus;
  transactionHash: string;
  blockNumber?: number;
  confirmations: number;
  gasUsed?: string;
  gasCost?: string;
  settledAt: number;
  error?: string;
}

export interface BatchSettlement {
  batchId: string;
  network: string;
  payments: SettlementRequest[];
  status: SettlementStatus;
  transactionHash?: string;
  totalAmount: string;
  totalFees: string;
  createdAt: number;
  settledAt?: number;
}

// ═══════════════════════════════════════════════════════════════
// Chain Settler Interface
// ═══════════════════════════════════════════════════════════════

export interface ChainSettler {
  readonly chainId: string;
  readonly networkType: 'evm' | 'solana';
  
  /**
   * Initialize the settler with network config
   */
  initialize(config: NetworkConfig): Promise<void>;
  
  /**
   * Settle a single payment
   */
  settle(request: SettlementRequest): Promise<SettlementResult>;
  
  /**
   * Settle multiple payments in a batch
   */
  settleBatch(requests: SettlementRequest[]): Promise<SettlementResult[]>;
  
  /**
   * Check if a transaction is confirmed
   */
  checkConfirmation(txHash: string): Promise<{
    confirmed: boolean;
    confirmations: number;
    blockNumber?: number;
  }>;
  
  /**
   * Estimate gas for a settlement
   */
  estimateGas(request: SettlementRequest): Promise<{
    gasLimit: bigint;
    gasPrice: bigint;
    totalCost: string;
  }>;
  
  /**
   * Get current gas prices
   */
  getGasPrices(): Promise<{
    slow: bigint;
    normal: bigint;
    fast: bigint;
  }>;
  
  /**
   * Get wallet balance
   */
  getBalance(): Promise<{
    native: string;
    usdc: string;
  }>;
}

// ═══════════════════════════════════════════════════════════════
// EVM-Specific Types
// ═══════════════════════════════════════════════════════════════

export interface EVMSettlementConfig {
  privateKey: string;
  rpcUrl: string;
  chainId: number;
  usdcAddress: `0x${string}`;
  maxGasPrice: bigint;
  gasLimitMultiplier: number; // e.g., 1.2 for 20% buffer
}

export interface EVMTransferParams {
  from: `0x${string}`;
  to: `0x${string}`;
  amount: bigint;
  nonce?: number;
  deadline: bigint;
  signature: `0x${string}`;
}

// ═══════════════════════════════════════════════════════════════
// Solana-Specific Types
// ═══════════════════════════════════════════════════════════════

export interface SolanaSettlementConfig {
  privateKey: string;
  rpcUrl: string;
  usdcMint: string;
  commitment: 'processed' | 'confirmed' | 'finalized';
}

export interface SolanaTransferParams {
  from: string;
  to: string;
  amount: number; // In lamports or token units
  memo?: string;
}
```

### Task 1.2: Create Base Settler

Create `src/settlement/chains/BaseSettler.ts`:

```typescript
/**
 * Base Settler Abstract Class
 * Common functionality for all chain settlers
 */

import { EventEmitter } from 'events';
import type {
  ChainSettler,
  SettlementRequest,
  SettlementResult,
  SettlementStatus,
} from '../types.js';
import type { NetworkConfig } from '../../core/types.js';
import { createLogger } from '../../utils/logger.js';

export abstract class BaseSettler extends EventEmitter implements ChainSettler {
  abstract readonly chainId: string;
  abstract readonly networkType: 'evm' | 'solana';
  
  protected config!: NetworkConfig;
  protected logger;
  protected isInitialized = false;

  constructor(name: string) {
    super();
    this.logger = createLogger(name);
  }

  async initialize(config: NetworkConfig): Promise<void> {
    this.config = config;
    await this.doInitialize();
    this.isInitialized = true;
    this.logger.info('Settler initialized', { chainId: this.chainId });
  }

  /**
   * Chain-specific initialization
   */
  protected abstract doInitialize(): Promise<void>;

  /**
   * Execute a single settlement
   */
  abstract settle(request: SettlementRequest): Promise<SettlementResult>;

  /**
   * Execute batch settlement
   */
  async settleBatch(requests: SettlementRequest[]): Promise<SettlementResult[]> {
    // Default implementation: settle individually
    // EVM can override with multicall
    const results: SettlementResult[] = [];
    
    for (const request of requests) {
      try {
        const result = await this.settle(request);
        results.push(result);
      } catch (error) {
        results.push(this.createFailedResult(request, error));
      }
    }
    
    return results;
  }

  abstract checkConfirmation(txHash: string): Promise<{
    confirmed: boolean;
    confirmations: number;
    blockNumber?: number;
  }>;

  abstract estimateGas(request: SettlementRequest): Promise<{
    gasLimit: bigint;
    gasPrice: bigint;
    totalCost: string;
  }>;

  abstract getGasPrices(): Promise<{
    slow: bigint;
    normal: bigint;
    fast: bigint;
  }>;

  abstract getBalance(): Promise<{
    native: string;
    usdc: string;
  }>;

  /**
   * Create a failed result
   */
  protected createFailedResult(
    request: SettlementRequest,
    error: unknown
  ): SettlementResult {
    return {
      paymentId: request.paymentId,
      status: 'failed',
      transactionHash: '',
      confirmations: 0,
      settledAt: Date.now(),
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }

  /**
   * Wait for confirmation with timeout
   */
  protected async waitForConfirmation(
    txHash: string,
    requiredConfirmations: number,
    timeoutMs: number = 60000
  ): Promise<{ confirmed: boolean; confirmations: number }> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeoutMs) {
      const result = await this.checkConfirmation(txHash);
      
      if (result.confirmations >= requiredConfirmations) {
        return { confirmed: true, confirmations: result.confirmations };
      }
      
      // Wait before next check
      await this.sleep(this.config.blockTime);
    }
    
    return { confirmed: false, confirmations: 0 };
  }

  protected sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

### Task 1.3: Create EVM Settler

Create `src/settlement/chains/EVMSettler.ts`:

```typescript
/**
 * EVM Chain Settler
 * Handles settlement on Ethereum, Base, Arbitrum, etc.
 */

import {
  createWalletClient,
  createPublicClient,
  http,
  parseUnits,
  formatUnits,
  encodeFunctionData,
  type WalletClient,
  type PublicClient,
  type Chain,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { base, arbitrum, optimism, mainnet, polygon } from 'viem/chains';
import { BaseSettler } from './BaseSettler.js';
import type {
  SettlementRequest,
  SettlementResult,
  EVMSettlementConfig,
} from '../types.js';
import type { NetworkConfig } from '../../core/types.js';

// USDC ABI for transfers
const USDC_ABI = [
  {
    name: 'transfer',
    type: 'function',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    name: 'transferWithAuthorization',
    type: 'function',
    inputs: [
      { name: 'from', type: 'address' },
      { name: 'to', type: 'address' },
      { name: 'value', type: 'uint256' },
      { name: 'validAfter', type: 'uint256' },
      { name: 'validBefore', type: 'uint256' },
      { name: 'nonce', type: 'bytes32' },
      { name: 'v', type: 'uint8' },
      { name: 'r', type: 'bytes32' },
      { name: 's', type: 'bytes32' },
    ],
    outputs: [],
  },
  {
    name: 'balanceOf',
    type: 'function',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
] as const;

// Chain ID to viem chain mapping
const CHAIN_MAP: Record<number, Chain> = {
  1: mainnet,
  8453: base,
  42161: arbitrum,
  10: optimism,
  137: polygon,
};

export class EVMSettler extends BaseSettler {
  readonly networkType = 'evm' as const;
  readonly chainId: string;
  
  private walletClient!: WalletClient;
  private publicClient!: PublicClient;
  private account!: ReturnType<typeof privateKeyToAccount>;
  private evmConfig!: EVMSettlementConfig;
  private chain!: Chain;

  constructor(chainId: string, evmConfig: EVMSettlementConfig) {
    super(`EVMSettler:${chainId}`);
    this.chainId = chainId;
    this.evmConfig = evmConfig;
  }

  protected async doInitialize(): Promise<void> {
    // Parse chain ID from CAIP-2 format
    const numericChainId = parseInt(this.chainId.split(':')[1]);
    this.chain = CHAIN_MAP[numericChainId];
    
    if (!this.chain) {
      throw new Error(`Unsupported chain: ${this.chainId}`);
    }

    // Create account from private key
    this.account = privateKeyToAccount(
      this.evmConfig.privateKey as `0x${string}`
    );

    // Create clients
    this.publicClient = createPublicClient({
      chain: this.chain,
      transport: http(this.evmConfig.rpcUrl),
    });

    this.walletClient = createWalletClient({
      account: this.account,
      chain: this.chain,
      transport: http(this.evmConfig.rpcUrl),
    });

    this.logger.info('EVM settler initialized', {
      chain: this.chain.name,
      address: this.account.address,
    });
  }

  async settle(request: SettlementRequest): Promise<SettlementResult> {
    const startTime = Date.now();
    
    try {
      this.logger.info('Settling payment', {
        paymentId: request.paymentId,
        amount: request.proof.payload.amount,
      });

      // Parse the signature for EIP-3009 transferWithAuthorization
      const { v, r, s } = this.parseSignature(request.proof.signature);
      
      // Convert amount to USDC units (6 decimals)
      const amount = parseUnits(request.proof.payload.amount, 6);

      // Execute transferWithAuthorization
      const txHash = await this.walletClient.writeContract({
        address: this.evmConfig.usdcAddress,
        abi: USDC_ABI,
        functionName: 'transferWithAuthorization',
        args: [
          request.proof.payload.from as `0x${string}`,
          request.proof.payload.to as `0x${string}`,
          amount,
          BigInt(request.proof.payload.validAfter || 0),
          BigInt(request.proof.payload.deadline),
          request.proof.payload.nonce as `0x${string}`,
          v,
          r,
          s,
        ],
      });

      this.logger.info('Transaction submitted', {
        paymentId: request.paymentId,
        txHash,
      });

      // Wait for confirmation
      const receipt = await this.publicClient.waitForTransactionReceipt({
        hash: txHash,
        confirmations: this.config.confirmations,
      });

      const settledAt = Date.now();
      
      this.logger.info('Payment settled', {
        paymentId: request.paymentId,
        txHash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
        duration: settledAt - startTime,
      });

      return {
        paymentId: request.paymentId,
        status: 'confirmed',
        transactionHash: txHash,
        blockNumber: Number(receipt.blockNumber),
        confirmations: this.config.confirmations,
        gasUsed: receipt.gasUsed.toString(),
        gasCost: formatUnits(
          receipt.gasUsed * receipt.effectiveGasPrice,
          18
        ),
        settledAt,
      };

    } catch (error) {
      this.logger.error('Settlement failed', {
        paymentId: request.paymentId,
        error,
      });

      return this.createFailedResult(request, error);
    }
  }

  async settleBatch(requests: SettlementRequest[]): Promise<SettlementResult[]> {
    // For now, settle sequentially
    // TODO: Implement multicall for batch efficiency
    const results: SettlementResult[] = [];
    
    for (const request of requests) {
      const result = await this.settle(request);
      results.push(result);
    }
    
    return results;
  }

  async checkConfirmation(txHash: string): Promise<{
    confirmed: boolean;
    confirmations: number;
    blockNumber?: number;
  }> {
    try {
      const receipt = await this.publicClient.getTransactionReceipt({
        hash: txHash as `0x${string}`,
      });

      if (!receipt) {
        return { confirmed: false, confirmations: 0 };
      }

      const currentBlock = await this.publicClient.getBlockNumber();
      const confirmations = Number(currentBlock - receipt.blockNumber) + 1;

      return {
        confirmed: confirmations >= this.config.confirmations,
        confirmations,
        blockNumber: Number(receipt.blockNumber),
      };
    } catch {
      return { confirmed: false, confirmations: 0 };
    }
  }

  async estimateGas(request: SettlementRequest): Promise<{
    gasLimit: bigint;
    gasPrice: bigint;
    totalCost: string;
  }> {
    const amount = parseUnits(request.proof.payload.amount, 6);
    const { v, r, s } = this.parseSignature(request.proof.signature);

    const gasLimit = await this.publicClient.estimateContractGas({
      address: this.evmConfig.usdcAddress,
      abi: USDC_ABI,
      functionName: 'transferWithAuthorization',
      args: [
        request.proof.payload.from as `0x${string}`,
        request.proof.payload.to as `0x${string}`,
        amount,
        BigInt(request.proof.payload.validAfter || 0),
        BigInt(request.proof.payload.deadline),
        request.proof.payload.nonce as `0x${string}`,
        v,
        r,
        s,
      ],
      account: this.account,
    });

    const gasPrice = await this.publicClient.getGasPrice();
    
    // Apply multiplier for safety
    const adjustedGasLimit = BigInt(
      Math.ceil(Number(gasLimit) * this.evmConfig.gasLimitMultiplier)
    );

    return {
      gasLimit: adjustedGasLimit,
      gasPrice,
      totalCost: formatUnits(adjustedGasLimit * gasPrice, 18),
    };
  }

  async getGasPrices(): Promise<{
    slow: bigint;
    normal: bigint;
    fast: bigint;
  }> {
    const gasPrice = await this.publicClient.getGasPrice();
    
    return {
      slow: gasPrice * 80n / 100n,    // 80% of current
      normal: gasPrice,                // Current price
      fast: gasPrice * 120n / 100n,   // 120% of current
    };
  }

  async getBalance(): Promise<{
    native: string;
    usdc: string;
  }> {
    const [nativeBalance, usdcBalance] = await Promise.all([
      this.publicClient.getBalance({ address: this.account.address }),
      this.publicClient.readContract({
        address: this.evmConfig.usdcAddress,
        abi: USDC_ABI,
        functionName: 'balanceOf',
        args: [this.account.address],
      }),
    ]);

    return {
      native: formatUnits(nativeBalance, 18),
      usdc: formatUnits(usdcBalance as bigint, 6),
    };
  }

  /**
   * Parse EIP-712 signature into v, r, s components
   */
  private parseSignature(signature: string): {
    v: number;
    r: `0x${string}`;
    s: `0x${string}`;
  } {
    const sig = signature.startsWith('0x') ? signature.slice(2) : signature;
    
    return {
      r: `0x${sig.slice(0, 64)}` as `0x${string}`,
      s: `0x${sig.slice(64, 128)}` as `0x${string}`,
      v: parseInt(sig.slice(128, 130), 16),
    };
  }
}
```

---

## 🏗️ Phase 2: Solana Settler

### Task 2.1: Create Solana Settler

Create `src/settlement/chains/SolanaSettler.ts`:

```typescript
/**
 * Solana Chain Settler
 * Handles settlement on Solana mainnet and devnet
 */

import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  sendAndConfirmTransaction,
} from '@solana/web3.js';
import {
  getAssociatedTokenAddress,
  createTransferInstruction,
  getAccount,
} from '@solana/spl-token';
import { BaseSettler } from './BaseSettler.js';
import type {
  SettlementRequest,
  SettlementResult,
  SolanaSettlementConfig,
} from '../types.js';
import type { NetworkConfig } from '../../core/types.js';

// USDC mint addresses
const USDC_MINTS: Record<string, string> = {
  'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp': 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // Mainnet
  'solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1': '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU', // Devnet
};

export class SolanaSettler extends BaseSettler {
  readonly networkType = 'solana' as const;
  readonly chainId: string;
  
  private connection!: Connection;
  private keypair!: Keypair;
  private usdcMint!: PublicKey;
  private solanaConfig!: SolanaSettlementConfig;

  constructor(chainId: string, solanaConfig: SolanaSettlementConfig) {
    super(`SolanaSettler:${chainId}`);
    this.chainId = chainId;
    this.solanaConfig = solanaConfig;
  }

  protected async doInitialize(): Promise<void> {
    // Create connection
    this.connection = new Connection(
      this.solanaConfig.rpcUrl,
      this.solanaConfig.commitment
    );

    // Create keypair from private key
    const secretKey = Buffer.from(this.solanaConfig.privateKey, 'base64');
    this.keypair = Keypair.fromSecretKey(secretKey);

    // Get USDC mint
    const mintAddress = USDC_MINTS[this.chainId];
    if (!mintAddress) {
      throw new Error(`Unknown USDC mint for chain: ${this.chainId}`);
    }
    this.usdcMint = new PublicKey(mintAddress);

    this.logger.info('Solana settler initialized', {
      chain: this.chainId,
      address: this.keypair.publicKey.toBase58(),
    });
  }

  async settle(request: SettlementRequest): Promise<SettlementResult> {
    const startTime = Date.now();
    
    try {
      this.logger.info('Settling Solana payment', {
        paymentId: request.paymentId,
        amount: request.proof.payload.amount,
      });

      // Get token accounts
      const fromPubkey = new PublicKey(request.proof.payload.from);
      const toPubkey = new PublicKey(request.proof.payload.to);

      const fromAta = await getAssociatedTokenAddress(this.usdcMint, fromPubkey);
      const toAta = await getAssociatedTokenAddress(this.usdcMint, toPubkey);

      // Convert amount to USDC units (6 decimals)
      const amount = Math.floor(parseFloat(request.proof.payload.amount) * 1e6);

      // Create transfer instruction
      const transferIx = createTransferInstruction(
        fromAta,
        toAta,
        fromPubkey,
        amount
      );

      // Build transaction
      const tx = new Transaction().add(transferIx);
      tx.recentBlockhash = (
        await this.connection.getLatestBlockhash()
      ).blockhash;
      tx.feePayer = this.keypair.publicKey;

      // Note: In production, the payer would sign this
      // For now, we're using the facilitator's keypair
      
      // Send and confirm
      const signature = await sendAndConfirmTransaction(
        this.connection,
        tx,
        [this.keypair],
        { commitment: this.solanaConfig.commitment }
      );

      const settledAt = Date.now();

      this.logger.info('Solana payment settled', {
        paymentId: request.paymentId,
        signature,
        duration: settledAt - startTime,
      });

      return {
        paymentId: request.paymentId,
        status: 'confirmed',
        transactionHash: signature,
        confirmations: 1,
        settledAt,
      };

    } catch (error) {
      this.logger.error('Solana settlement failed', {
        paymentId: request.paymentId,
        error,
      });

      return this.createFailedResult(request, error);
    }
  }

  async checkConfirmation(txHash: string): Promise<{
    confirmed: boolean;
    confirmations: number;
    blockNumber?: number;
  }> {
    try {
      const status = await this.connection.getSignatureStatus(txHash);
      
      if (!status.value) {
        return { confirmed: false, confirmations: 0 };
      }

      const confirmed = status.value.confirmationStatus === 'finalized' ||
                       status.value.confirmationStatus === 'confirmed';

      return {
        confirmed,
        confirmations: confirmed ? 1 : 0,
        blockNumber: status.value.slot,
      };
    } catch {
      return { confirmed: false, confirmations: 0 };
    }
  }

  async estimateGas(request: SettlementRequest): Promise<{
    gasLimit: bigint;
    gasPrice: bigint;
    totalCost: string;
  }> {
    // Solana uses lamports, not gas
    // Typical transfer is ~5000 lamports
    const lamports = 5000n;
    
    return {
      gasLimit: lamports,
      gasPrice: 1n,
      totalCost: (Number(lamports) / 1e9).toString(), // Convert to SOL
    };
  }

  async getGasPrices(): Promise<{
    slow: bigint;
    normal: bigint;
    fast: bigint;
  }> {
    // Solana has fixed fees, but priority fees can vary
    const { feeCalculator } = await this.connection.getRecentBlockhash();
    const baseFee = BigInt(feeCalculator?.lamportsPerSignature || 5000);
    
    return {
      slow: baseFee,
      normal: baseFee * 2n,
      fast: baseFee * 5n,
    };
  }

  async getBalance(): Promise<{
    native: string;
    usdc: string;
  }> {
    const [solBalance, tokenAccount] = await Promise.all([
      this.connection.getBalance(this.keypair.publicKey),
      getAssociatedTokenAddress(this.usdcMint, this.keypair.publicKey)
        .then(ata => getAccount(this.connection, ata))
        .catch(() => null),
    ]);

    return {
      native: (solBalance / 1e9).toString(),
      usdc: tokenAccount 
        ? (Number(tokenAccount.amount) / 1e6).toString() 
        : '0',
    };
  }
}
```

---

## 🏗️ Phase 3: Settlement Engine

### Task 3.1: Create SettlementEngine

Create `src/settlement/SettlementEngine.ts`:

```typescript
/**
 * Settlement Engine
 * Coordinates settlements across multiple chains
 */

import { EventEmitter } from 'events';
import type {
  ChainSettler,
  SettlementRequest,
  SettlementResult,
  BatchSettlement,
} from './types.js';
import type {
  FacilitatorConfig,
  NetworkConfig,
  FacilitatorEvent,
} from '../core/types.js';
import { EVMSettler } from './chains/EVMSettler.js';
import { SolanaSettler } from './chains/SolanaSettler.js';
import { createLogger } from '../utils/logger.js';

const logger = createLogger('SettlementEngine');

export class SettlementEngine extends EventEmitter {
  private config: FacilitatorConfig;
  private settlers: Map<string, ChainSettler> = new Map();
  private pendingBatches: Map<string, BatchSettlement> = new Map();

  constructor(config: FacilitatorConfig) {
    super();
    this.config = config;
  }

  /**
   * Initialize all chain settlers
   */
  async initialize(): Promise<void> {
    logger.info('Initializing settlement engine');

    for (const network of this.config.networks) {
      await this.initializeSettler(network);
    }

    logger.info('Settlement engine initialized', {
      chains: Array.from(this.settlers.keys()),
    });
  }

  /**
   * Initialize a single chain settler
   */
  private async initializeSettler(network: NetworkConfig): Promise<void> {
    let settler: ChainSettler;

    if (network.chainId.startsWith('eip155:')) {
      settler = new EVMSettler(network.chainId, {
        privateKey: process.env.EVM_PRIVATE_KEY!,
        rpcUrl: network.rpcUrl,
        chainId: parseInt(network.chainId.split(':')[1]),
        usdcAddress: network.usdcAddress as `0x${string}`,
        maxGasPrice: BigInt(100e9), // 100 gwei
        gasLimitMultiplier: 1.2,
      });
    } else if (network.chainId.startsWith('solana:')) {
      settler = new SolanaSettler(network.chainId, {
        privateKey: process.env.SOLANA_PRIVATE_KEY!,
        rpcUrl: network.rpcUrl,
        usdcMint: network.usdcAddress,
        commitment: 'confirmed',
      });
    } else {
      logger.warn(`Unknown network type: ${network.chainId}`);
      return;
    }

    await settler.initialize(network);
    this.settlers.set(network.chainId, settler);
  }

  /**
   * Settle a single payment
   */
  async settle(request: SettlementRequest): Promise<SettlementResult> {
    const network = request.proof.network;
    const settler = this.settlers.get(network);

    if (!settler) {
      throw new Error(`No settler for network: ${network}`);
    }

    const result = await settler.settle(request);
    
    this.emitEvent({
      type: 'payment:settled',
      data: {
        paymentId: request.paymentId,
        transaction: result.transactionHash,
        fee: request.fee,
        settlementTime: result.settledAt - Date.now(),
        timestamp: Date.now(),
      },
    });

    return result;
  }

  /**
   * Settle a batch of payments for a network
   */
  async settleBatch(
    network: string,
    requests: SettlementRequest[]
  ): Promise<SettlementResult[]> {
    const settler = this.settlers.get(network);

    if (!settler) {
      throw new Error(`No settler for network: ${network}`);
    }

    logger.info('Settling batch', {
      network,
      count: requests.length,
    });

    const results = await settler.settleBatch(requests);
    
    // Emit batch settled event
    const totalFees = requests.reduce(
      (sum, r) => sum + parseFloat(r.fee),
      0
    );

    this.emitEvent({
      type: 'batch:settled',
      data: {
        batchId: `batch-${Date.now()}`,
        transaction: results[0]?.transactionHash || '',
        totalFees: totalFees.toString(),
        gasUsed: results.reduce(
          (sum, r) => sum + (r.gasUsed ? parseFloat(r.gasUsed) : 0),
          0
        ).toString(),
        timestamp: Date.now(),
      },
    });

    return results;
  }

  /**
   * Check if a network is supported
   */
  isNetworkSupported(network: string): boolean {
    return this.settlers.has(network);
  }

  /**
   * Get settler for a network
   */
  getSettler(network: string): ChainSettler | undefined {
    return this.settlers.get(network);
  }

  /**
   * Get all supported networks
   */
  getSupportedNetworks(): string[] {
    return Array.from(this.settlers.keys());
  }

  /**
   * Get balances across all chains
   */
  async getAllBalances(): Promise<Record<string, { native: string; usdc: string }>> {
    const balances: Record<string, { native: string; usdc: string }> = {};

    for (const [network, settler] of this.settlers) {
      balances[network] = await settler.getBalance();
    }

    return balances;
  }

  /**
   * Shutdown all settlers
   */
  async shutdown(): Promise<void> {
    logger.info('Shutting down settlement engine');
    this.settlers.clear();
  }

  /**
   * Emit typed event
   */
  private emitEvent(event: FacilitatorEvent): void {
    this.emit(event.type, event.data);
    this.emit('event', event);
  }
}
```

---

## 📋 Phase Completion Checklists

### Phase 1 Checklist
- [ ] Settlement types defined
- [ ] BaseSettler abstract class complete
- [ ] EVMSettler handles EIP-3009 transfers
- [ ] Unit tests for EVM settlement

### Phase 2 Checklist  
- [ ] SolanaSettler handles SPL token transfers
- [ ] Confirmation checking works
- [ ] Unit tests for Solana settlement

### Phase 3 Checklist
- [ ] SettlementEngine coordinates multiple chains
- [ ] Batch settlement works
- [ ] Events emitted correctly
- [ ] Integration with Agent 1's PaymentProcessor

---

## ⏭️ After Settlement Completion

### Your Next Project: Credit Purchase System

Once facilitator is complete, move to building the credit system:

**See:** `AGENT_2_PHASE2_CREDIT_SYSTEM.md`

Key components:
1. Stripe integration for fiat purchases
2. Credit balance tracking
3. Credit-to-x402 conversion
4. Auto-topup functionality

---

## 🧪 Testing Requirements

Create `tests/settlement.test.ts`:

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { EVMSettler } from '../src/settlement/chains/EVMSettler.js';
import { SolanaSettler } from '../src/settlement/chains/SolanaSettler.js';
import { SettlementEngine } from '../src/settlement/SettlementEngine.js';

describe('EVMSettler', () => {
  it('parses signatures correctly', () => {
    // Test signature parsing
  });

  it('estimates gas within bounds', async () => {
    // Test gas estimation
  });
});

describe('SettlementEngine', () => {
  it('routes to correct settler', async () => {
    // Test network routing
  });
});
```

---

## 📞 Communication Protocol

**You depend on:** Agent 1's types and interfaces
**Others depend on you:** Agent 3's API will call your SettlementEngine

When you complete a phase:
1. Run tests: `pnpm test`
2. Export types from `src/settlement/index.ts`
3. Commit: `feat(facilitator): settlement phase X complete`
4. Update checklist

---

## 🔗 Files You'll Create

```
packages/facilitator/src/settlement/
├── index.ts
├── types.ts
├── SettlementEngine.ts
├── BatchProcessor.ts
└── chains/
    ├── BaseSettler.ts
    ├── EVMSettler.ts
    └── SolanaSettler.ts
```
