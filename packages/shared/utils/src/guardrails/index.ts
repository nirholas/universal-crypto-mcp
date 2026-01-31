/**
 * Agent Guardrails Framework
 * 
 * Safety mechanisms to prevent unintended or harmful agent actions.
 * 
 * @module guardrails
 * @author nich <nich@nichxbt.com>
 */

import { GuardrailError } from '../errors/index.js';
import { Logger, createLogger } from '../logger/index.js';

// ============================================================================
// Types
// ============================================================================

export interface SpendingLimit {
  /** Maximum amount per transaction */
  perTransaction: bigint;
  /** Maximum amount per hour */
  perHour: bigint;
  /** Maximum amount per day */
  perDay: bigint;
  /** Maximum amount per week */
  perWeek: bigint;
  /** Token symbol (e.g., 'ETH', 'USDC') */
  token: string;
  /** Token decimals */
  decimals: number;
}

export interface ApprovalRule {
  /** Rule name */
  name: string;
  /** Condition for when approval is needed */
  condition: (action: AgentAction) => boolean;
  /** Approvers required */
  approvers: string[];
  /** Number of approvals needed */
  requiredApprovals: number;
  /** Timeout for approval (ms) */
  timeout: number;
}

export interface AgentAction {
  /** Action type */
  type: 'transfer' | 'swap' | 'approve' | 'stake' | 'unstake' | 'bridge' | 'sign' | 'execute';
  /** Token involved */
  token?: string;
  /** Amount in wei/smallest unit */
  amount?: bigint;
  /** Target address */
  to?: string;
  /** Source chain */
  sourceChain?: string;
  /** Destination chain */
  destinationChain?: string;
  /** Contract to interact with */
  contract?: string;
  /** Function to call */
  function?: string;
  /** Additional metadata */
  metadata?: Record<string, unknown>;
}

export interface ApprovalRequest {
  /** Unique request ID */
  id: string;
  /** Action requiring approval */
  action: AgentAction;
  /** Rule that triggered approval */
  rule: string;
  /** Required approvals */
  requiredApprovals: number;
  /** Current approvals */
  approvals: string[];
  /** Request timestamp */
  createdAt: Date;
  /** Expiry timestamp */
  expiresAt: Date;
  /** Status */
  status: 'pending' | 'approved' | 'rejected' | 'expired';
}

export interface GuardrailConfig {
  /** Enable kill switch */
  killSwitchEnabled: boolean;
  /** Spending limits by token */
  spendingLimits: SpendingLimit[];
  /** Approval rules */
  approvalRules: ApprovalRule[];
  /** Blocked addresses */
  blockedAddresses: Set<string>;
  /** Allowed contracts (if empty, all allowed) */
  allowedContracts: Set<string>;
  /** Maximum gas price in gwei */
  maxGasPrice?: bigint;
  /** Maximum slippage percentage */
  maxSlippage?: number;
  /** Dry run mode (log but don't execute) */
  dryRun: boolean;
}

export interface GuardrailCheckResult {
  allowed: boolean;
  reason?: string;
  requiresApproval?: boolean;
  approvalRequest?: ApprovalRequest;
}

// ============================================================================
// Spending Tracker
// ============================================================================

interface SpendingRecord {
  amount: bigint;
  timestamp: Date;
}

/**
 * Tracks spending over time windows
 */
class SpendingTracker {
  private records: Map<string, SpendingRecord[]> = new Map();

  /**
   * Record a spending event
   */
  record(token: string, amount: bigint): void {
    const records = this.records.get(token) ?? [];
    records.push({ amount, timestamp: new Date() });
    this.records.set(token, records);
    this.cleanup(token);
  }

  /**
   * Get total spending in time window
   */
  getSpending(token: string, windowMs: number): bigint {
    const records = this.records.get(token) ?? [];
    const cutoff = Date.now() - windowMs;
    return records
      .filter(r => r.timestamp.getTime() > cutoff)
      .reduce((sum, r) => sum + r.amount, 0n);
  }

  /**
   * Clean up old records
   */
  private cleanup(token: string): void {
    const records = this.records.get(token) ?? [];
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const filtered = records.filter(r => r.timestamp.getTime() > weekAgo);
    this.records.set(token, filtered);
  }

  /**
   * Reset all tracking
   */
  reset(): void {
    this.records.clear();
  }
}

// ============================================================================
// Approval Queue
// ============================================================================

export type ApprovalHandler = (request: ApprovalRequest) => Promise<boolean>;

/**
 * Manages approval requests for actions requiring human review
 */
export class ApprovalQueue {
  private requests: Map<string, ApprovalRequest> = new Map();
  private handlers: ApprovalHandler[] = [];
  private logger: Logger;

  constructor() {
    this.logger = createLogger({ name: 'approval-queue' });
  }

  /**
   * Create an approval request
   */
  async createRequest(
    action: AgentAction,
    rule: ApprovalRule
  ): Promise<ApprovalRequest> {
    const id = crypto.randomUUID();
    const request: ApprovalRequest = {
      id,
      action,
      rule: rule.name,
      requiredApprovals: rule.requiredApprovals,
      approvals: [],
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + rule.timeout),
      status: 'pending',
    };

    this.requests.set(id, request);
    this.logger.info('Approval request created', {
      id,
      rule: rule.name,
      action: action.type,
    });

    // Notify handlers
    for (const handler of this.handlers) {
      handler(request).catch(err => {
        this.logger.error('Approval handler failed', { error: err });
      });
    }

    return request;
  }

  /**
   * Add an approval
   */
  approve(requestId: string, approver: string): boolean {
    const request = this.requests.get(requestId);
    if (!request) return false;
    if (request.status !== 'pending') return false;
    if (request.expiresAt.getTime() < Date.now()) {
      request.status = 'expired';
      return false;
    }

    if (!request.approvals.includes(approver)) {
      request.approvals.push(approver);
    }

    if (request.approvals.length >= request.requiredApprovals) {
      request.status = 'approved';
      this.logger.info('Approval request approved', { id: requestId });
    }

    return true;
  }

  /**
   * Reject an approval request
   */
  reject(requestId: string, _rejecter: string): boolean {
    const request = this.requests.get(requestId);
    if (!request) return false;
    if (request.status !== 'pending') return false;

    request.status = 'rejected';
    this.logger.info('Approval request rejected', { id: requestId });
    return true;
  }

  /**
   * Check if request is approved
   */
  isApproved(requestId: string): boolean {
    const request = this.requests.get(requestId);
    return request?.status === 'approved';
  }

  /**
   * Wait for approval with timeout
   */
  async waitForApproval(requestId: string, timeoutMs: number): Promise<boolean> {
    const deadline = Date.now() + timeoutMs;
    
    while (Date.now() < deadline) {
      const request = this.requests.get(requestId);
      if (!request) return false;
      
      if (request.status === 'approved') return true;
      if (request.status === 'rejected') return false;
      if (request.status === 'expired') return false;

      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    const request = this.requests.get(requestId);
    if (request && request.status === 'pending') {
      request.status = 'expired';
    }
    return false;
  }

  /**
   * Get pending requests
   */
  getPending(): ApprovalRequest[] {
    return Array.from(this.requests.values())
      .filter(r => r.status === 'pending' && r.expiresAt.getTime() > Date.now());
  }

  /**
   * Register approval handler
   */
  onApprovalRequest(handler: ApprovalHandler): void {
    this.handlers.push(handler);
  }
}

// ============================================================================
// Main Guardrails Class
// ============================================================================

/**
 * Agent Guardrails
 * 
 * Provides safety mechanisms for autonomous agents:
 * - Kill switch to immediately halt all operations
 * - Spending limits per transaction and time window
 * - Approval requirements for high-value actions
 * - Address allowlisting/blocklisting
 * - Contract interaction restrictions
 * 
 * @example
 * ```typescript
 * const guardrails = new AgentGuardrails({
 *   killSwitchEnabled: false,
 *   spendingLimits: [{
 *     token: 'ETH',
 *     decimals: 18,
 *     perTransaction: parseEther('1'),
 *     perHour: parseEther('10'),
 *     perDay: parseEther('50'),
 *     perWeek: parseEther('200'),
 *   }],
 *   approvalRules: [{
 *     name: 'high-value-transfer',
 *     condition: (action) => action.type === 'transfer' && action.amount > parseEther('10'),
 *     approvers: ['admin@company.com'],
 *     requiredApprovals: 1,
 *     timeout: 3600000, // 1 hour
 *   }],
 *   blockedAddresses: new Set(['0x...']),
 *   allowedContracts: new Set(),
 *   dryRun: false,
 * });
 * 
 * // Check if action is allowed
 * const result = await guardrails.check({
 *   type: 'transfer',
 *   token: 'ETH',
 *   amount: parseEther('5'),
 *   to: '0x...',
 * });
 * 
 * if (!result.allowed) {
 *   console.error('Action blocked:', result.reason);
 * }
 * ```
 */
export class AgentGuardrails {
  private config: GuardrailConfig;
  private spendingTracker: SpendingTracker;
  private approvalQueue: ApprovalQueue;
  private killSwitch: boolean = false;
  private logger: Logger;

  constructor(config: Partial<GuardrailConfig> = {}) {
    this.config = {
      killSwitchEnabled: config.killSwitchEnabled ?? false,
      spendingLimits: config.spendingLimits ?? [],
      approvalRules: config.approvalRules ?? [],
      blockedAddresses: config.blockedAddresses ?? new Set(),
      allowedContracts: config.allowedContracts ?? new Set(),
      maxGasPrice: config.maxGasPrice,
      maxSlippage: config.maxSlippage,
      dryRun: config.dryRun ?? false,
    };

    this.spendingTracker = new SpendingTracker();
    this.approvalQueue = new ApprovalQueue();
    this.logger = createLogger({ name: 'agent-guardrails' });
  }

  /**
   * Check if an action is allowed
   */
  async check(action: AgentAction): Promise<GuardrailCheckResult> {
    // Kill switch check
    if (this.killSwitch || this.config.killSwitchEnabled) {
      this.logger.warn('Kill switch active, blocking action', { action: action.type });
      return { allowed: false, reason: 'Kill switch is active' };
    }

    // Blocked address check
    if (action.to && this.config.blockedAddresses.has(action.to.toLowerCase())) {
      this.logger.warn('Blocked address', { address: action.to });
      return { allowed: false, reason: `Address ${action.to} is blocked` };
    }

    // Contract allowlist check
    if (action.contract && this.config.allowedContracts.size > 0) {
      if (!this.config.allowedContracts.has(action.contract.toLowerCase())) {
        this.logger.warn('Contract not in allowlist', { contract: action.contract });
        return { allowed: false, reason: `Contract ${action.contract} is not in allowlist` };
      }
    }

    // Spending limit check
    if (action.token && action.amount) {
      const limit = this.config.spendingLimits.find(
        l => l.token.toLowerCase() === action.token!.toLowerCase()
      );

      if (limit) {
        // Per-transaction limit
        if (action.amount > limit.perTransaction) {
          return {
            allowed: false,
            reason: `Amount ${action.amount} exceeds per-transaction limit of ${limit.perTransaction}`,
          };
        }

        // Hourly limit
        const hourlySpent = this.spendingTracker.getSpending(action.token, 60 * 60 * 1000);
        if (hourlySpent + action.amount > limit.perHour) {
          return {
            allowed: false,
            reason: `Would exceed hourly spending limit of ${limit.perHour}`,
          };
        }

        // Daily limit
        const dailySpent = this.spendingTracker.getSpending(action.token, 24 * 60 * 60 * 1000);
        if (dailySpent + action.amount > limit.perDay) {
          return {
            allowed: false,
            reason: `Would exceed daily spending limit of ${limit.perDay}`,
          };
        }

        // Weekly limit
        const weeklySpent = this.spendingTracker.getSpending(action.token, 7 * 24 * 60 * 60 * 1000);
        if (weeklySpent + action.amount > limit.perWeek) {
          return {
            allowed: false,
            reason: `Would exceed weekly spending limit of ${limit.perWeek}`,
          };
        }
      }
    }

    // Approval rules check
    for (const rule of this.config.approvalRules) {
      if (rule.condition(action)) {
        const request = await this.approvalQueue.createRequest(action, rule);
        return {
          allowed: false,
          requiresApproval: true,
          approvalRequest: request,
          reason: `Requires approval: ${rule.name}`,
        };
      }
    }

    // Dry run mode
    if (this.config.dryRun) {
      this.logger.info('Dry run: action would be allowed', { action });
      return { allowed: false, reason: 'Dry run mode active' };
    }

    return { allowed: true };
  }

  /**
   * Execute an action with guardrails
   */
  async execute<T>(
    action: AgentAction,
    executor: () => Promise<T>
  ): Promise<T> {
    const checkResult = await this.check(action);

    if (!checkResult.allowed) {
      if (checkResult.requiresApproval && checkResult.approvalRequest) {
        throw new GuardrailError(
          `Action requires approval: ${checkResult.reason}`,
          { 
            guardrail: 'approval_required',
            context: { approvalId: checkResult.approvalRequest.id }
          }
        );
      }
      throw new GuardrailError(
        `Action blocked by guardrails: ${checkResult.reason}`,
        { guardrail: 'action_blocked' }
      );
    }

    // Record spending before execution
    if (action.token && action.amount) {
      this.spendingTracker.record(action.token, action.amount);
    }

    try {
      const result = await executor();
      this.logger.info('Action executed successfully', { action: action.type });
      return result;
    } catch (error) {
      this.logger.error('Action execution failed', { action: action.type, error });
      throw error;
    }
  }

  /**
   * Activate kill switch
   */
  activateKillSwitch(reason: string): void {
    this.killSwitch = true;
    this.logger.error('KILL SWITCH ACTIVATED', { reason });
  }

  /**
   * Deactivate kill switch
   */
  deactivateKillSwitch(): void {
    this.killSwitch = false;
    this.logger.warn('Kill switch deactivated');
  }

  /**
   * Check kill switch status
   */
  isKillSwitchActive(): boolean {
    return this.killSwitch || this.config.killSwitchEnabled;
  }

  /**
   * Add blocked address
   */
  blockAddress(address: string): void {
    this.config.blockedAddresses.add(address.toLowerCase());
    this.logger.info('Address blocked', { address });
  }

  /**
   * Remove blocked address
   */
  unblockAddress(address: string): void {
    this.config.blockedAddresses.delete(address.toLowerCase());
    this.logger.info('Address unblocked', { address });
  }

  /**
   * Add allowed contract
   */
  allowContract(address: string): void {
    this.config.allowedContracts.add(address.toLowerCase());
    this.logger.info('Contract allowed', { address });
  }

  /**
   * Update spending limit
   */
  updateSpendingLimit(limit: SpendingLimit): void {
    const index = this.config.spendingLimits.findIndex(
      l => l.token.toLowerCase() === limit.token.toLowerCase()
    );
    if (index >= 0) {
      this.config.spendingLimits[index] = limit;
    } else {
      this.config.spendingLimits.push(limit);
    }
    this.logger.info('Spending limit updated', { token: limit.token });
  }

  /**
   * Get approval queue
   */
  getApprovalQueue(): ApprovalQueue {
    return this.approvalQueue;
  }

  /**
   * Get current spending
   */
  getSpending(token: string): {
    hourly: bigint;
    daily: bigint;
    weekly: bigint;
  } {
    return {
      hourly: this.spendingTracker.getSpending(token, 60 * 60 * 1000),
      daily: this.spendingTracker.getSpending(token, 24 * 60 * 60 * 1000),
      weekly: this.spendingTracker.getSpending(token, 7 * 24 * 60 * 60 * 1000),
    };
  }

  /**
   * Reset spending tracker
   */
  resetSpending(): void {
    this.spendingTracker.reset();
    this.logger.info('Spending tracker reset');
  }
}

// ============================================================================
// Factory Functions
// ============================================================================

/**
 * Create guardrails with sensible defaults
 */
export function createDefaultGuardrails(): AgentGuardrails {
  return new AgentGuardrails({
    killSwitchEnabled: false,
    spendingLimits: [
      {
        token: 'ETH',
        decimals: 18,
        perTransaction: BigInt('1000000000000000000'), // 1 ETH
        perHour: BigInt('5000000000000000000'), // 5 ETH
        perDay: BigInt('20000000000000000000'), // 20 ETH
        perWeek: BigInt('100000000000000000000'), // 100 ETH
      },
      {
        token: 'USDC',
        decimals: 6,
        perTransaction: BigInt('10000000000'), // 10,000 USDC
        perHour: BigInt('50000000000'), // 50,000 USDC
        perDay: BigInt('200000000000'), // 200,000 USDC
        perWeek: BigInt('1000000000000'), // 1,000,000 USDC
      },
    ],
    approvalRules: [
      {
        name: 'large-eth-transfer',
        condition: (action) =>
          action.type === 'transfer' &&
          action.token?.toLowerCase() === 'eth' &&
          (action.amount ?? 0n) > BigInt('5000000000000000000'), // > 5 ETH
        approvers: ['admin'],
        requiredApprovals: 1,
        timeout: 3600000, // 1 hour
      },
      {
        name: 'contract-approval',
        condition: (action) => action.type === 'approve',
        approvers: ['admin'],
        requiredApprovals: 1,
        timeout: 3600000,
      },
      {
        name: 'bridge-operation',
        condition: (action) => action.type === 'bridge',
        approvers: ['admin'],
        requiredApprovals: 1,
        timeout: 3600000,
      },
    ],
    blockedAddresses: new Set(),
    allowedContracts: new Set(),
    dryRun: false,
  });
}

/**
 * Create strict guardrails for production
 */
export function createStrictGuardrails(): AgentGuardrails {
  return new AgentGuardrails({
    killSwitchEnabled: false,
    spendingLimits: [
      {
        token: 'ETH',
        decimals: 18,
        perTransaction: BigInt('100000000000000000'), // 0.1 ETH
        perHour: BigInt('500000000000000000'), // 0.5 ETH
        perDay: BigInt('2000000000000000000'), // 2 ETH
        perWeek: BigInt('10000000000000000000'), // 10 ETH
      },
    ],
    approvalRules: [
      {
        name: 'all-transfers',
        condition: (action) =>
          action.type === 'transfer' && (action.amount ?? 0n) > 0n,
        approvers: ['admin', 'security'],
        requiredApprovals: 2,
        timeout: 7200000, // 2 hours
      },
      {
        name: 'all-swaps',
        condition: (action) => action.type === 'swap',
        approvers: ['admin', 'trader'],
        requiredApprovals: 1,
        timeout: 1800000, // 30 min
      },
    ],
    blockedAddresses: new Set(),
    allowedContracts: new Set(), // Must explicitly allow contracts
    dryRun: false,
  });
}

/**
 * Create test guardrails (permissive, with logging)
 */
export function createTestGuardrails(): AgentGuardrails {
  return new AgentGuardrails({
    killSwitchEnabled: false,
    spendingLimits: [],
    approvalRules: [],
    blockedAddresses: new Set(),
    allowedContracts: new Set(),
    dryRun: true, // Log but don't block
  });
}
