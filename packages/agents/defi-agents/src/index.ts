/**
 * @universal-crypto-mcp/agent-defi
 * 
 * DeFi-focused AI agents for portfolio management, yield optimization,
 * trading, and blockchain automation.
 * 
 * Features:
 * - Guardrails for transaction safety
 * - Human-in-the-loop for high-value actions
 * - Spending limits and approval workflows
 * - Kill switch for emergency stops
 * - Comprehensive logging and auditing
 */

import { VERSION } from '@universal-crypto-mcp/core';
import {
  Guardrails,
  GuardrailConfig,
  AgentAction,
  HITLManager,
  HITLConfig,
  createLogger,
  type Logger,
  type SpendingLimit,
  type ApprovalRule,
} from '@universal-crypto-mcp/shared-utils';

// ============================================================================
// Agent Types
// ============================================================================

export interface DeFiAgentConfig {
  name: string;
  chains: string[];
  protocols?: string[];
  capabilities?: DeFiCapability[];
  /** Guardrails configuration */
  guardrails?: Partial<GuardrailConfig>;
  /** Human-in-the-loop configuration */
  hitl?: Partial<HITLConfig>;
  /** Enable dry run mode (log but don't execute) */
  dryRun?: boolean;
}

export type DeFiCapability = 
  | 'swap'
  | 'bridge'
  | 'lend'
  | 'borrow'
  | 'stake'
  | 'yield'
  | 'portfolio'
  | 'analytics';

export interface ExecutionResult {
  success: boolean;
  action: AgentAction;
  transactionHash?: string;
  error?: Error;
  requiresApproval?: boolean;
  approvalId?: string;
}

// ============================================================================
// Default Guardrails
// ============================================================================

const DEFAULT_SPENDING_LIMITS: SpendingLimit[] = [
  {
    token: 'ETH',
    decimals: 18,
    perTransaction: BigInt('1000000000000000000'), // 1 ETH
    perHour: BigInt('5000000000000000000'), // 5 ETH
    perDay: BigInt('10000000000000000000'), // 10 ETH
    perWeek: BigInt('50000000000000000000'), // 50 ETH
  },
  {
    token: 'USDC',
    decimals: 6,
    perTransaction: BigInt('5000000000'), // 5000 USDC
    perHour: BigInt('25000000000'), // 25000 USDC
    perDay: BigInt('50000000000'), // 50000 USDC
    perWeek: BigInt('200000000000'), // 200000 USDC
  },
];

const DEFAULT_APPROVAL_RULES: ApprovalRule[] = [
  {
    name: 'large-transaction',
    condition: (action: AgentAction) => {
      if (!action.amount) return false;
      // Require approval for transactions > 1 ETH equivalent
      return action.amount > BigInt('1000000000000000000');
    },
    approvers: ['admin'],
    requiredApprovals: 1,
    timeout: 3600000, // 1 hour
  },
  {
    name: 'new-contract-interaction',
    condition: (action: AgentAction) => {
      // Require approval for first interaction with a contract
      return action.type === 'execute' && !!action.contract;
    },
    approvers: ['admin', 'security'],
    requiredApprovals: 1,
    timeout: 7200000, // 2 hours
  },
  {
    name: 'cross-chain-bridge',
    condition: (action: AgentAction) => action.type === 'bridge',
    approvers: ['admin'],
    requiredApprovals: 1,
    timeout: 1800000, // 30 minutes
  },
];

// ============================================================================
// DeFi Agent Class
// ============================================================================

export class DeFiAgent {
  private config: DeFiAgentConfig;
  private guardrails: Guardrails;
  private hitl: HITLManager;
  private logger: Logger;
  private executionHistory: ExecutionResult[] = [];

  constructor(config: DeFiAgentConfig) {
    this.config = config;
    this.logger = createLogger({ name: `agent:${config.name}` });
    
    // Initialize guardrails
    this.guardrails = new Guardrails({
      killSwitchEnabled: false,
      spendingLimits: config.guardrails?.spendingLimits ?? DEFAULT_SPENDING_LIMITS,
      approvalRules: config.guardrails?.approvalRules ?? DEFAULT_APPROVAL_RULES,
      blockedAddresses: config.guardrails?.blockedAddresses ?? new Set(),
      allowedContracts: config.guardrails?.allowedContracts ?? new Set(),
      maxSlippage: config.guardrails?.maxSlippage ?? 0.5, // 0.5%
      maxGasPrice: config.guardrails?.maxGasPrice ?? BigInt('100000000000'), // 100 gwei
      dryRun: config.dryRun ?? false,
    });

    // Initialize HITL
    this.hitl = new HITLManager({
      defaultTimeout: config.hitl?.defaultTimeout ?? 3600000, // 1 hour
      maxPendingPerAgent: config.hitl?.maxPendingPerAgent ?? 10,
      autoRejectOnTimeout: config.hitl?.autoRejectOnTimeout ?? true,
      notificationChannels: config.hitl?.notificationChannels ?? [
        { type: 'console', config: {}, enabled: true },
      ],
      escalationRules: config.hitl?.escalationRules ?? [],
    });

    this.logger.info('DeFi Agent initialized', {
      name: config.name,
      chains: config.chains,
      capabilities: config.capabilities,
      dryRun: config.dryRun,
    });
  }

  getName(): string {
    return this.config.name;
  }

  getChains(): string[] {
    return this.config.chains;
  }

  getProtocols(): string[] {
    return this.config.protocols ?? [];
  }

  getCapabilities(): DeFiCapability[] {
    return this.config.capabilities ?? [];
  }

  hasCapability(capability: DeFiCapability): boolean {
    return this.getCapabilities().includes(capability);
  }

  getCoreVersion(): string {
    return VERSION;
  }

  /**
   * Execute an action with guardrails
   */
  async executeAction(action: AgentAction): Promise<ExecutionResult> {
    this.logger.info('Executing action', { action });

    try {
      // Check guardrails
      const guardrailResult = await this.guardrails.checkAction(action);
      
      if (!guardrailResult.allowed) {
        this.logger.warn('Action blocked by guardrails', {
          action,
          reason: guardrailResult.reason,
          violations: guardrailResult.violations,
        });
        
        return {
          success: false,
          action,
          error: new Error(`Action blocked: ${guardrailResult.reason}`),
        };
      }

      // Check if approval is required
      if (guardrailResult.requiresApproval) {
        this.logger.info('Action requires human approval', { action, rules: guardrailResult.approvalRules });
        
        const approvalRequest = await this.hitl.requestApproval({
          agentId: this.config.name,
          action,
          description: this.generateActionDescription(action),
          risk: this.assessActionRisk(action),
          context: {
            chains: this.config.chains,
            capabilities: this.config.capabilities,
          },
        });

        return {
          success: false,
          action,
          requiresApproval: true,
          approvalId: approvalRequest.id,
        };
      }

      // Execute the action (dry run or actual)
      if (this.config.dryRun) {
        this.logger.info('Dry run - action would be executed', { action });
        const result: ExecutionResult = {
          success: true,
          action,
          transactionHash: '0x' + 'dry-run'.padEnd(64, '0'),
        };
        this.executionHistory.push(result);
        return result;
      }

      // Actual execution would go here
      // For now, we return a placeholder
      const result: ExecutionResult = {
        success: true,
        action,
        transactionHash: '0x' + Date.now().toString(16).padEnd(64, '0'),
      };
      
      this.executionHistory.push(result);
      this.logger.info('Action executed successfully', { action, result });
      
      return result;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.logger.error('Action execution failed', { action, error: err.message });
      
      const result: ExecutionResult = {
        success: false,
        action,
        error: err,
      };
      
      this.executionHistory.push(result);
      return result;
    }
  }

  /**
   * Emergency stop - activates kill switch
   */
  emergencyStop(): void {
    this.logger.fatal('EMERGENCY STOP ACTIVATED', { agent: this.config.name });
    this.guardrails.activateKillSwitch();
  }

  /**
   * Resume after emergency stop
   */
  resume(): void {
    this.logger.warn('Resuming agent after emergency stop', { agent: this.config.name });
    this.guardrails.deactivateKillSwitch();
  }

  /**
   * Get execution history
   */
  getExecutionHistory(): ExecutionResult[] {
    return [...this.executionHistory];
  }

  /**
   * Get pending approvals
   */
  async getPendingApprovals() {
    return this.hitl.getPendingRequests(this.config.name);
  }

  /**
   * Approve a pending action
   */
  async approveAction(approvalId: string, reviewer: string, notes?: string): Promise<boolean> {
    return this.hitl.approve(approvalId, reviewer, notes);
  }

  /**
   * Reject a pending action
   */
  async rejectAction(approvalId: string, reviewer: string, notes?: string): Promise<boolean> {
    return this.hitl.reject(approvalId, reviewer, notes);
  }

  private generateActionDescription(action: AgentAction): string {
    const amount = action.amount ? ` ${action.amount.toString()}` : '';
    const token = action.token ? ` ${action.token}` : '';
    const to = action.to ? ` to ${action.to.slice(0, 10)}...` : '';
    return `${action.type}${amount}${token}${to}`;
  }

  private assessActionRisk(action: AgentAction): 'low' | 'medium' | 'high' | 'critical' {
    if (action.type === 'bridge') return 'high';
    if (action.amount && action.amount > BigInt('10000000000000000000')) return 'high';
    if (action.type === 'execute') return 'medium';
    if (action.type === 'swap' || action.type === 'transfer') return 'medium';
    return 'low';
  }
}

// ============================================================================
// Factory Functions
// ============================================================================

export function createDeFiAgent(config: DeFiAgentConfig): DeFiAgent {
  return new DeFiAgent(config);
}

export function createYieldAgent(name: string, chains: string[], options?: Partial<DeFiAgentConfig>): DeFiAgent {
  return new DeFiAgent({
    name,
    chains,
    capabilities: ['yield', 'stake', 'lend', 'analytics'],
    ...options,
  });
}

export function createTradingAgent(name: string, chains: string[], options?: Partial<DeFiAgentConfig>): DeFiAgent {
  return new DeFiAgent({
    name,
    chains,
    capabilities: ['swap', 'bridge', 'analytics'],
    ...options,
  });
}

export function createPortfolioAgent(name: string, chains: string[], options?: Partial<DeFiAgentConfig>): DeFiAgent {
  return new DeFiAgent({
    name,
    chains,
    capabilities: ['portfolio', 'analytics', 'swap', 'bridge'],
    ...options,
  });
}

// Export version
export const PACKAGE_VERSION = '1.0.0';
export const PACKAGE_NAME = '@universal-crypto-mcp/agent-defi';

// Re-export types from shared utils
export type { AgentAction, SpendingLimit, ApprovalRule } from '@universal-crypto-mcp/shared-utils';
