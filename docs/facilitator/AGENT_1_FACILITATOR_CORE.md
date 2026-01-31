# 🔧 Agent 1: Facilitator Core Engine

## 🎯 Mission

Build the core x402 Facilitator engine that processes payment verification and coordinates settlement. You are the foundation - other agents depend on your interfaces and types.

---

## 📋 Context

You are working on the `universal-crypto-mcp` repository. This is the largest MCP (Model Context Protocol) server for crypto tools. We're building a x402 Facilitator to earn 0.1% on every payment processed through our infrastructure.

**x402 Protocol Overview:**
- HTTP 402 Payment Required responses trigger payments
- Clients send payment proofs in headers
- Facilitators verify proofs and settle payments
- We take a fee for providing this service

**Key Reference Files:**
- `/workspaces/universal-crypto-mcp/x402/X402-INTEGRATION.md` - Integration docs
- `/workspaces/universal-crypto-mcp/x402/typescript/packages/` - Reference implementation
- `/workspaces/universal-crypto-mcp/packages/payments/` - Our payment infrastructure

---

## 🏗️ Phase 1: Foundation (Start Here)

### Task 1.1: Create Package Structure

Create the facilitator package with proper configuration:

```bash
# Create package at:
packages/facilitator/
├── package.json
├── tsconfig.json
├── tsup.config.ts
└── src/
    └── index.ts
```

**package.json requirements:**
```json
{
  "name": "@nirholas/x402-facilitator",
  "version": "1.0.0",
  "description": "x402 Payment Facilitator - Earn fees on every crypto payment",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "test": "vitest",
    "lint": "eslint src/"
  },
  "dependencies": {
    "@x402/core": "^1.0.0",
    "viem": "^2.0.0",
    "zod": "^3.22.0",
    "pino": "^8.0.0"
  },
  "peerDependencies": {
    "typescript": "^5.0.0"
  }
}
```

### Task 1.2: Define Core Types

Create `src/core/types.ts` with comprehensive types:

```typescript
/**
 * Core types for x402 Facilitator
 * These types are the foundation - other agents will import them
 */

import { z } from 'zod';

// ═══════════════════════════════════════════════════════════════
// Network Types
// ═══════════════════════════════════════════════════════════════

export type NetworkType = 'evm' | 'solana';

export interface NetworkConfig {
  chainId: string;           // CAIP-2 format: "eip155:8453" or "solana:..."
  name: string;
  rpcUrl: string;
  nativeCurrency: string;
  blockTime: number;         // Average block time in ms
  confirmations: number;     // Required confirmations
  usdcAddress: string;       // USDC contract address
}

export const SUPPORTED_NETWORKS: Record<string, NetworkConfig> = {
  'eip155:8453': {
    chainId: 'eip155:8453',
    name: 'Base',
    rpcUrl: 'https://mainnet.base.org',
    nativeCurrency: 'ETH',
    blockTime: 2000,
    confirmations: 1,
    usdcAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  },
  'eip155:42161': {
    chainId: 'eip155:42161',
    name: 'Arbitrum One',
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    nativeCurrency: 'ETH',
    blockTime: 250,
    confirmations: 1,
    usdcAddress: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
  },
  // Add more networks...
};

// ═══════════════════════════════════════════════════════════════
// Payment Types
// ═══════════════════════════════════════════════════════════════

export const PaymentSchemeSchema = z.enum(['exact', 'upto', 'stream']);
export type PaymentScheme = z.infer<typeof PaymentSchemeSchema>;

export const PaymentStatusSchema = z.enum([
  'pending',
  'verified',
  'settling',
  'settled',
  'failed',
  'expired',
]);
export type PaymentStatus = z.infer<typeof PaymentStatusSchema>;

export interface PaymentRequirements {
  scheme: PaymentScheme;
  network: string;           // CAIP-2 chain ID
  amount: string;            // Amount in token units (e.g., "1.00" USDC)
  asset: string;             // Token address or symbol
  payTo: string;             // Recipient address
  maxAge?: number;           // Max age of payment proof in seconds
  description?: string;      // Human-readable description
  resource?: string;         // Resource being paid for
}

export interface PaymentProof {
  scheme: PaymentScheme;
  network: string;
  signature: string;         // Signed payment authorization
  payload: {
    amount: string;
    asset: string;
    from: string;            // Payer address
    to: string;              // Payee address
    nonce: string;           // Unique nonce
    deadline: number;        // Unix timestamp
    validAfter?: number;     // Optional: earliest valid time
    validBefore?: number;    // Optional: latest valid time
  };
}

export interface PaymentResult {
  success: boolean;
  paymentId: string;
  status: PaymentStatus;
  payer: string;
  payee: string;
  amount: string;
  network: string;
  transaction?: string;      // Transaction hash if settled
  settledAt?: number;        // Unix timestamp
  error?: string;
}

// ═══════════════════════════════════════════════════════════════
// Facilitator Types
// ═══════════════════════════════════════════════════════════════

export interface FacilitatorConfig {
  // Fee configuration
  feeRateBps: number;        // Fee in basis points (10 = 0.1%)
  minFee: string;            // Minimum fee in USDC
  maxFee: string;            // Maximum fee in USDC
  feeRecipient: string;      // Address to receive fees
  
  // Network configuration
  networks: NetworkConfig[];
  
  // Settlement configuration
  batchSize: number;         // Max payments per batch
  batchDelayMs: number;      // Wait time before settling batch
  minSettlementAmount: string; // Min amount to trigger settlement
  
  // Security
  maxPaymentAge: number;     // Max age of payment proof in seconds
  maxPendingPayments: number; // Max pending payments per address
  rateLimitPerSecond: number;
  
  // Storage
  databaseUrl: string;
  redisUrl?: string;
}

export interface FacilitatorStats {
  totalPaymentsProcessed: number;
  totalVolumeUsd: string;
  totalFeesCollected: string;
  pendingSettlements: number;
  averageSettlementTime: number;
  uptimePercentage: number;
  networkStats: Record<string, NetworkStats>;
}

export interface NetworkStats {
  chainId: string;
  paymentsProcessed: number;
  volumeUsd: string;
  feesCollected: string;
  averageGasCost: string;
  lastSettlement: number;
}

// ═══════════════════════════════════════════════════════════════
// Event Types (for Agent 4 analytics)
// ═══════════════════════════════════════════════════════════════

export type FacilitatorEvent =
  | { type: 'payment:received'; data: PaymentReceivedEvent }
  | { type: 'payment:verified'; data: PaymentVerifiedEvent }
  | { type: 'payment:settled'; data: PaymentSettledEvent }
  | { type: 'payment:failed'; data: PaymentFailedEvent }
  | { type: 'batch:created'; data: BatchCreatedEvent }
  | { type: 'batch:settled'; data: BatchSettledEvent };

export interface PaymentReceivedEvent {
  paymentId: string;
  payer: string;
  payee: string;
  amount: string;
  network: string;
  timestamp: number;
}

export interface PaymentVerifiedEvent {
  paymentId: string;
  verificationTime: number;
  timestamp: number;
}

export interface PaymentSettledEvent {
  paymentId: string;
  transaction: string;
  fee: string;
  settlementTime: number;
  timestamp: number;
}

export interface PaymentFailedEvent {
  paymentId: string;
  error: string;
  timestamp: number;
}

export interface BatchCreatedEvent {
  batchId: string;
  paymentCount: number;
  totalAmount: string;
  network: string;
  timestamp: number;
}

export interface BatchSettledEvent {
  batchId: string;
  transaction: string;
  totalFees: string;
  gasUsed: string;
  timestamp: number;
}
```

### Task 1.3: Build FacilitatorServer

Create `src/core/FacilitatorServer.ts`:

```typescript
/**
 * Main Facilitator Server
 * Coordinates payment verification and settlement
 */

import { EventEmitter } from 'events';
import type {
  FacilitatorConfig,
  FacilitatorStats,
  FacilitatorEvent,
  PaymentProof,
  PaymentRequirements,
  PaymentResult,
} from './types.js';
import { PaymentVerifier } from './PaymentVerifier.js';
import { FeeCalculator } from './FeeCalculator.js';
import { PaymentProcessor } from './PaymentProcessor.js';
import { createLogger } from '../utils/logger.js';

const logger = createLogger('FacilitatorServer');

export class FacilitatorServer extends EventEmitter {
  private config: FacilitatorConfig;
  private verifier: PaymentVerifier;
  private feeCalculator: FeeCalculator;
  private processor: PaymentProcessor;
  private isRunning: boolean = false;

  constructor(config: FacilitatorConfig) {
    super();
    this.config = config;
    this.verifier = new PaymentVerifier(config);
    this.feeCalculator = new FeeCalculator(config);
    this.processor = new PaymentProcessor(config);
  }

  /**
   * Start the facilitator server
   */
  async start(): Promise<void> {
    logger.info('Starting facilitator server...');
    
    // Initialize components
    await this.processor.initialize();
    
    this.isRunning = true;
    logger.info('Facilitator server started', {
      networks: this.config.networks.map(n => n.name),
      feeRate: `${this.config.feeRateBps / 100}%`,
    });

    this.emit('started');
  }

  /**
   * Stop the facilitator server
   */
  async stop(): Promise<void> {
    logger.info('Stopping facilitator server...');
    
    this.isRunning = false;
    await this.processor.shutdown();
    
    logger.info('Facilitator server stopped');
    this.emit('stopped');
  }

  /**
   * Verify a payment proof
   * Called by resource servers to validate payment
   */
  async verify(
    proof: PaymentProof,
    requirements: PaymentRequirements
  ): Promise<PaymentResult> {
    if (!this.isRunning) {
      throw new Error('Facilitator server not running');
    }

    const startTime = Date.now();
    
    try {
      // Step 1: Validate proof structure
      this.verifier.validateProofStructure(proof);
      
      // Step 2: Verify signature
      await this.verifier.verifySignature(proof);
      
      // Step 3: Check requirements match
      this.verifier.checkRequirements(proof, requirements);
      
      // Step 4: Calculate fee
      const fee = this.feeCalculator.calculate(proof.payload.amount);
      
      // Step 5: Queue for settlement
      const result = await this.processor.queuePayment(proof, fee);
      
      const verificationTime = Date.now() - startTime;
      
      this.emitEvent({
        type: 'payment:verified',
        data: {
          paymentId: result.paymentId,
          verificationTime,
          timestamp: Date.now(),
        },
      });

      logger.info('Payment verified', {
        paymentId: result.paymentId,
        amount: proof.payload.amount,
        fee,
        verificationTime,
      });

      return result;
      
    } catch (error) {
      logger.error('Payment verification failed', { error });
      
      this.emitEvent({
        type: 'payment:failed',
        data: {
          paymentId: 'unknown',
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: Date.now(),
        },
      });

      throw error;
    }
  }

  /**
   * Settle a verified payment
   * Called after verification to execute on-chain transfer
   */
  async settle(paymentId: string): Promise<PaymentResult> {
    if (!this.isRunning) {
      throw new Error('Facilitator server not running');
    }

    return this.processor.settlePayment(paymentId);
  }

  /**
   * Get facilitator statistics
   */
  async getStats(): Promise<FacilitatorStats> {
    return this.processor.getStats();
  }

  /**
   * Get payment status
   */
  async getPaymentStatus(paymentId: string): Promise<PaymentResult | null> {
    return this.processor.getPaymentStatus(paymentId);
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

### Task 1.4: Build PaymentVerifier

Create `src/core/PaymentVerifier.ts`:

```typescript
/**
 * Payment Proof Verifier
 * Validates payment proofs and signatures
 */

import { verifyMessage, recoverMessageAddress } from 'viem';
import type {
  FacilitatorConfig,
  PaymentProof,
  PaymentRequirements,
  NetworkConfig,
} from './types.js';
import { FacilitatorError, ErrorCode } from '../utils/errors.js';
import { createLogger } from '../utils/logger.js';

const logger = createLogger('PaymentVerifier');

export class PaymentVerifier {
  private config: FacilitatorConfig;
  private networkMap: Map<string, NetworkConfig>;

  constructor(config: FacilitatorConfig) {
    this.config = config;
    this.networkMap = new Map(
      config.networks.map(n => [n.chainId, n])
    );
  }

  /**
   * Validate the structure of a payment proof
   */
  validateProofStructure(proof: PaymentProof): void {
    // Check required fields
    if (!proof.scheme) {
      throw new FacilitatorError(
        'Missing payment scheme',
        ErrorCode.INVALID_PROOF
      );
    }

    if (!proof.network) {
      throw new FacilitatorError(
        'Missing network',
        ErrorCode.INVALID_PROOF
      );
    }

    if (!proof.signature) {
      throw new FacilitatorError(
        'Missing signature',
        ErrorCode.INVALID_PROOF
      );
    }

    if (!proof.payload) {
      throw new FacilitatorError(
        'Missing payload',
        ErrorCode.INVALID_PROOF
      );
    }

    // Validate payload fields
    const { payload } = proof;
    
    if (!payload.amount || isNaN(parseFloat(payload.amount))) {
      throw new FacilitatorError(
        'Invalid amount',
        ErrorCode.INVALID_PROOF
      );
    }

    if (!payload.from || !this.isValidAddress(payload.from, proof.network)) {
      throw new FacilitatorError(
        'Invalid payer address',
        ErrorCode.INVALID_PROOF
      );
    }

    if (!payload.to || !this.isValidAddress(payload.to, proof.network)) {
      throw new FacilitatorError(
        'Invalid payee address',
        ErrorCode.INVALID_PROOF
      );
    }

    if (!payload.deadline || payload.deadline < Date.now() / 1000) {
      throw new FacilitatorError(
        'Payment proof expired',
        ErrorCode.EXPIRED_PROOF
      );
    }

    // Check network is supported
    if (!this.networkMap.has(proof.network)) {
      throw new FacilitatorError(
        `Unsupported network: ${proof.network}`,
        ErrorCode.UNSUPPORTED_NETWORK
      );
    }

    logger.debug('Proof structure validated', { 
      network: proof.network,
      amount: payload.amount 
    });
  }

  /**
   * Verify the cryptographic signature
   */
  async verifySignature(proof: PaymentProof): Promise<void> {
    const network = this.networkMap.get(proof.network);
    
    if (!network) {
      throw new FacilitatorError(
        `Network not configured: ${proof.network}`,
        ErrorCode.UNSUPPORTED_NETWORK
      );
    }

    // Construct the message that was signed
    const message = this.constructSignedMessage(proof);

    try {
      if (proof.network.startsWith('eip155:')) {
        await this.verifyEVMSignature(proof, message);
      } else if (proof.network.startsWith('solana:')) {
        await this.verifySolanaSignature(proof, message);
      } else {
        throw new FacilitatorError(
          'Unknown network type',
          ErrorCode.UNSUPPORTED_NETWORK
        );
      }
    } catch (error) {
      if (error instanceof FacilitatorError) throw error;
      
      logger.error('Signature verification failed', { error });
      throw new FacilitatorError(
        'Invalid signature',
        ErrorCode.INVALID_SIGNATURE
      );
    }
  }

  /**
   * Verify EVM signature using viem
   */
  private async verifyEVMSignature(
    proof: PaymentProof,
    message: string
  ): Promise<void> {
    const recoveredAddress = await recoverMessageAddress({
      message,
      signature: proof.signature as `0x${string}`,
    });

    if (recoveredAddress.toLowerCase() !== proof.payload.from.toLowerCase()) {
      throw new FacilitatorError(
        'Signature does not match payer address',
        ErrorCode.INVALID_SIGNATURE
      );
    }

    logger.debug('EVM signature verified', { 
      payer: proof.payload.from 
    });
  }

  /**
   * Verify Solana signature
   */
  private async verifySolanaSignature(
    proof: PaymentProof,
    message: string
  ): Promise<void> {
    // Agent 2 will implement Solana-specific verification
    // For now, delegate to settlement layer
    throw new FacilitatorError(
      'Solana verification not yet implemented',
      ErrorCode.NOT_IMPLEMENTED
    );
  }

  /**
   * Check that proof meets requirements
   */
  checkRequirements(
    proof: PaymentProof,
    requirements: PaymentRequirements
  ): void {
    // Check scheme matches
    if (proof.scheme !== requirements.scheme) {
      throw new FacilitatorError(
        `Scheme mismatch: expected ${requirements.scheme}, got ${proof.scheme}`,
        ErrorCode.REQUIREMENTS_NOT_MET
      );
    }

    // Check network matches
    if (proof.network !== requirements.network) {
      throw new FacilitatorError(
        `Network mismatch: expected ${requirements.network}, got ${proof.network}`,
        ErrorCode.REQUIREMENTS_NOT_MET
      );
    }

    // Check amount is sufficient
    const proofAmount = parseFloat(proof.payload.amount);
    const requiredAmount = parseFloat(requirements.amount);
    
    if (proofAmount < requiredAmount) {
      throw new FacilitatorError(
        `Insufficient amount: required ${requiredAmount}, got ${proofAmount}`,
        ErrorCode.INSUFFICIENT_AMOUNT
      );
    }

    // Check recipient matches
    if (proof.payload.to.toLowerCase() !== requirements.payTo.toLowerCase()) {
      throw new FacilitatorError(
        'Payee address mismatch',
        ErrorCode.REQUIREMENTS_NOT_MET
      );
    }

    // Check age if maxAge specified
    if (requirements.maxAge) {
      const proofAge = Date.now() / 1000 - (proof.payload.validAfter || 0);
      if (proofAge > requirements.maxAge) {
        throw new FacilitatorError(
          'Payment proof too old',
          ErrorCode.EXPIRED_PROOF
        );
      }
    }

    logger.debug('Requirements check passed', {
      amount: proof.payload.amount,
      required: requirements.amount,
    });
  }

  /**
   * Construct the message that should have been signed
   */
  private constructSignedMessage(proof: PaymentProof): string {
    const { payload } = proof;
    
    // Standard x402 message format
    return [
      'x402 Payment Authorization',
      `Amount: ${payload.amount}`,
      `Asset: ${payload.asset}`,
      `From: ${payload.from}`,
      `To: ${payload.to}`,
      `Nonce: ${payload.nonce}`,
      `Deadline: ${payload.deadline}`,
    ].join('\n');
  }

  /**
   * Validate address format based on network
   */
  private isValidAddress(address: string, network: string): boolean {
    if (network.startsWith('eip155:')) {
      return /^0x[a-fA-F0-9]{40}$/.test(address);
    }
    if (network.startsWith('solana:')) {
      return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
    }
    return false;
  }
}
```

### Task 1.5: Build FeeCalculator

Create `src/core/FeeCalculator.ts`:

```typescript
/**
 * Fee Calculator
 * Calculates facilitator fees with min/max bounds
 */

import type { FacilitatorConfig } from './types.js';
import { createLogger } from '../utils/logger.js';

const logger = createLogger('FeeCalculator');

export class FeeCalculator {
  private config: FacilitatorConfig;

  constructor(config: FacilitatorConfig) {
    this.config = config;
  }

  /**
   * Calculate the fee for a given amount
   * @param amount - Amount in token units (e.g., "100.00")
   * @returns Fee amount in token units
   */
  calculate(amount: string): string {
    const amountNum = parseFloat(amount);
    
    if (isNaN(amountNum) || amountNum <= 0) {
      return '0';
    }

    // Calculate percentage fee
    let fee = (amountNum * this.config.feeRateBps) / 10000;

    // Apply minimum fee
    const minFee = parseFloat(this.config.minFee);
    if (fee < minFee) {
      fee = minFee;
    }

    // Apply maximum fee
    const maxFee = parseFloat(this.config.maxFee);
    if (fee > maxFee) {
      fee = maxFee;
    }

    // Round to 6 decimal places (USDC precision)
    const finalFee = Math.round(fee * 1e6) / 1e6;

    logger.debug('Fee calculated', {
      amount,
      feeRate: `${this.config.feeRateBps / 100}%`,
      fee: finalFee.toString(),
    });

    return finalFee.toString();
  }

  /**
   * Calculate total cost including fee
   */
  calculateTotal(amount: string): { amount: string; fee: string; total: string } {
    const fee = this.calculate(amount);
    const total = (parseFloat(amount) + parseFloat(fee)).toFixed(6);

    return {
      amount,
      fee,
      total,
    };
  }

  /**
   * Estimate fee for display purposes
   */
  estimateFee(amount: string): {
    fee: string;
    feePercentage: string;
    effectiveRate: string;
  } {
    const fee = this.calculate(amount);
    const amountNum = parseFloat(amount);
    const feeNum = parseFloat(fee);
    
    const effectiveRate = amountNum > 0 
      ? ((feeNum / amountNum) * 100).toFixed(4)
      : '0';

    return {
      fee,
      feePercentage: `${this.config.feeRateBps / 100}%`,
      effectiveRate: `${effectiveRate}%`,
    };
  }
}
```

---

## 📋 Phase 1 Completion Checklist

Before moving to Phase 2, verify:

- [ ] Package structure created with proper config
- [ ] All types exported from `src/core/types.ts`
- [ ] `FacilitatorServer` compiles and has all methods
- [ ] `PaymentVerifier` validates proofs correctly
- [ ] `FeeCalculator` calculates fees with bounds
- [ ] Unit tests pass for all Phase 1 components
- [ ] Types are exported from main index.ts

Run:
```bash
cd packages/facilitator && pnpm build && pnpm test
```

---

## 🏗️ Phase 2: Payment Processor

### Task 2.1: Build PaymentProcessor

Create `src/core/PaymentProcessor.ts`:

```typescript
/**
 * Payment Processor
 * Manages payment queue and coordinates with settlement
 */

import { EventEmitter } from 'events';
import { randomUUID } from 'crypto';
import type {
  FacilitatorConfig,
  FacilitatorStats,
  PaymentProof,
  PaymentResult,
  PaymentStatus,
  FacilitatorEvent,
} from './types.js';
import { createLogger } from '../utils/logger.js';

const logger = createLogger('PaymentProcessor');

interface PendingPayment {
  id: string;
  proof: PaymentProof;
  fee: string;
  status: PaymentStatus;
  createdAt: number;
  verifiedAt?: number;
  settledAt?: number;
  transaction?: string;
  error?: string;
}

export class PaymentProcessor extends EventEmitter {
  private config: FacilitatorConfig;
  private pendingPayments: Map<string, PendingPayment> = new Map();
  private settlementQueue: string[] = [];
  private batchTimer: NodeJS.Timeout | null = null;
  private stats: FacilitatorStats;

  constructor(config: FacilitatorConfig) {
    super();
    this.config = config;
    this.stats = this.initializeStats();
  }

  /**
   * Initialize the processor
   */
  async initialize(): Promise<void> {
    logger.info('Initializing payment processor');
    
    // Start batch settlement timer
    this.startBatchTimer();
    
    logger.info('Payment processor initialized');
  }

  /**
   * Shutdown the processor
   */
  async shutdown(): Promise<void> {
    logger.info('Shutting down payment processor');
    
    if (this.batchTimer) {
      clearInterval(this.batchTimer);
    }

    // Settle any remaining payments
    if (this.settlementQueue.length > 0) {
      await this.processBatch();
    }

    logger.info('Payment processor shut down');
  }

  /**
   * Queue a verified payment for settlement
   */
  async queuePayment(proof: PaymentProof, fee: string): Promise<PaymentResult> {
    const paymentId = randomUUID();
    
    const payment: PendingPayment = {
      id: paymentId,
      proof,
      fee,
      status: 'verified',
      createdAt: Date.now(),
      verifiedAt: Date.now(),
    };

    this.pendingPayments.set(paymentId, payment);
    this.settlementQueue.push(paymentId);

    // Check if we should trigger immediate batch
    if (this.settlementQueue.length >= this.config.batchSize) {
      this.processBatch().catch(err => {
        logger.error('Batch processing failed', { error: err });
      });
    }

    logger.info('Payment queued', {
      paymentId,
      amount: proof.payload.amount,
      fee,
      queueLength: this.settlementQueue.length,
    });

    return this.formatResult(payment);
  }

  /**
   * Settle a specific payment
   */
  async settlePayment(paymentId: string): Promise<PaymentResult> {
    const payment = this.pendingPayments.get(paymentId);
    
    if (!payment) {
      throw new Error(`Payment not found: ${paymentId}`);
    }

    if (payment.status === 'settled') {
      return this.formatResult(payment);
    }

    // Update status
    payment.status = 'settling';

    try {
      // Agent 2 will implement actual settlement
      // For now, emit event and mark as settled
      const transaction = await this.executeSettlement(payment);
      
      payment.status = 'settled';
      payment.settledAt = Date.now();
      payment.transaction = transaction;

      // Update stats
      this.updateStats(payment);

      this.emitEvent({
        type: 'payment:settled',
        data: {
          paymentId,
          transaction,
          fee: payment.fee,
          settlementTime: payment.settledAt - payment.verifiedAt!,
          timestamp: Date.now(),
        },
      });

      logger.info('Payment settled', {
        paymentId,
        transaction,
        settlementTime: payment.settledAt - payment.verifiedAt!,
      });

      return this.formatResult(payment);

    } catch (error) {
      payment.status = 'failed';
      payment.error = error instanceof Error ? error.message : 'Unknown error';

      this.emitEvent({
        type: 'payment:failed',
        data: {
          paymentId,
          error: payment.error,
          timestamp: Date.now(),
        },
      });

      throw error;
    }
  }

  /**
   * Get payment status
   */
  async getPaymentStatus(paymentId: string): Promise<PaymentResult | null> {
    const payment = this.pendingPayments.get(paymentId);
    return payment ? this.formatResult(payment) : null;
  }

  /**
   * Get facilitator statistics
   */
  async getStats(): Promise<FacilitatorStats> {
    return { ...this.stats };
  }

  /**
   * Execute the actual settlement
   * This will be replaced by Agent 2's settlement engine
   */
  private async executeSettlement(payment: PendingPayment): Promise<string> {
    // Placeholder - Agent 2 will implement chain-specific settlement
    // Return mock transaction hash
    return `0x${randomUUID().replace(/-/g, '')}`;
  }

  /**
   * Process a batch of settlements
   */
  private async processBatch(): Promise<void> {
    if (this.settlementQueue.length === 0) return;

    const batchIds = this.settlementQueue.splice(0, this.config.batchSize);
    
    logger.info('Processing batch', {
      batchSize: batchIds.length,
      remaining: this.settlementQueue.length,
    });

    // Agent 2 will implement batch settlement
    // For now, settle individually
    const results = await Promise.allSettled(
      batchIds.map(id => this.settlePayment(id))
    );

    const succeeded = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    logger.info('Batch complete', { succeeded, failed });
  }

  /**
   * Start the batch settlement timer
   */
  private startBatchTimer(): void {
    this.batchTimer = setInterval(() => {
      if (this.settlementQueue.length > 0) {
        this.processBatch().catch(err => {
          logger.error('Batch timer processing failed', { error: err });
        });
      }
    }, this.config.batchDelayMs);
  }

  /**
   * Format payment as result
   */
  private formatResult(payment: PendingPayment): PaymentResult {
    return {
      success: payment.status === 'settled',
      paymentId: payment.id,
      status: payment.status,
      payer: payment.proof.payload.from,
      payee: payment.proof.payload.to,
      amount: payment.proof.payload.amount,
      network: payment.proof.network,
      transaction: payment.transaction,
      settledAt: payment.settledAt,
      error: payment.error,
    };
  }

  /**
   * Initialize stats structure
   */
  private initializeStats(): FacilitatorStats {
    return {
      totalPaymentsProcessed: 0,
      totalVolumeUsd: '0',
      totalFeesCollected: '0',
      pendingSettlements: 0,
      averageSettlementTime: 0,
      uptimePercentage: 100,
      networkStats: {},
    };
  }

  /**
   * Update stats after settlement
   */
  private updateStats(payment: PendingPayment): void {
    this.stats.totalPaymentsProcessed++;
    this.stats.totalVolumeUsd = (
      parseFloat(this.stats.totalVolumeUsd) + 
      parseFloat(payment.proof.payload.amount)
    ).toString();
    this.stats.totalFeesCollected = (
      parseFloat(this.stats.totalFeesCollected) + 
      parseFloat(payment.fee)
    ).toString();
    this.stats.pendingSettlements = this.settlementQueue.length;
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

## 📋 Phase 2 Completion Checklist

- [ ] PaymentProcessor manages queue correctly
- [ ] Batch timer triggers settlement
- [ ] Stats are updated on settlement
- [ ] Events emitted for all state changes
- [ ] Integration tests pass

---

## ⏭️ Phase 3: After Core Completion

Once Phase 1-2 are complete, notify the coordinator and proceed to:

### Your Next Tasks (While Waiting for Other Agents)

1. **Add persistence layer** - Save payments to database
2. **Add Redis caching** - For fast payment lookups
3. **Add nonce tracking** - Prevent replay attacks
4. **Add rate limiting** - Per-address limits

### Then Move to Next Project: Featured Listings Contract

See: `AGENT_1_PHASE2_FEATURED_LISTINGS.md`

---

## 🧪 Testing Requirements

Create `tests/core.test.ts`:

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { FacilitatorServer } from '../src/core/FacilitatorServer.js';
import { FeeCalculator } from '../src/core/FeeCalculator.js';
import { PaymentVerifier } from '../src/core/PaymentVerifier.js';

describe('FeeCalculator', () => {
  const config = {
    feeRateBps: 10, // 0.1%
    minFee: '0.001',
    maxFee: '100',
  };

  it('calculates 0.1% fee correctly', () => {
    const calc = new FeeCalculator(config as any);
    expect(calc.calculate('100')).toBe('0.1');
  });

  it('applies minimum fee', () => {
    const calc = new FeeCalculator(config as any);
    expect(calc.calculate('0.1')).toBe('0.001');
  });

  it('applies maximum fee', () => {
    const calc = new FeeCalculator(config as any);
    expect(calc.calculate('1000000')).toBe('100');
  });
});

// Add more tests...
```

---

## 📞 Communication Protocol

When you complete a phase:

1. Run all tests: `pnpm test`
2. Build: `pnpm build`
3. Commit with message: `feat(facilitator): complete phase X - [description]`
4. Update this file's checklist
5. Proceed to next phase

If blocked on another agent:
1. Document what you need in a comment
2. Continue with independent work
3. Return when dependency is available

---

## 🔗 Files You'll Create

```
packages/facilitator/
├── package.json
├── tsconfig.json
├── tsup.config.ts
├── src/
│   ├── index.ts
│   ├── core/
│   │   ├── types.ts           ← Phase 1
│   │   ├── FacilitatorServer.ts ← Phase 1
│   │   ├── PaymentVerifier.ts  ← Phase 1
│   │   ├── FeeCalculator.ts    ← Phase 1
│   │   └── PaymentProcessor.ts ← Phase 2
│   └── utils/
│       ├── logger.ts
│       ├── config.ts
│       └── errors.ts
└── tests/
    └── core.test.ts
```
