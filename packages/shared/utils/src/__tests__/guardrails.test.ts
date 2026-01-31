/**
 * Guardrails Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Guardrails, AgentAction, SpendingLimit, ApprovalRule } from '../guardrails/index.js';

describe('Guardrails', () => {
  let guardrails: Guardrails;

  const defaultSpendingLimits: SpendingLimit[] = [
    {
      token: 'ETH',
      decimals: 18,
      perTransaction: BigInt('1000000000000000000'), // 1 ETH
      perHour: BigInt('5000000000000000000'), // 5 ETH
      perDay: BigInt('10000000000000000000'), // 10 ETH
      perWeek: BigInt('50000000000000000000'), // 50 ETH
    },
  ];

  const defaultApprovalRules: ApprovalRule[] = [
    {
      name: 'large-transaction',
      condition: (action: AgentAction) => {
        if (!action.amount) return false;
        return action.amount > BigInt('500000000000000000'); // > 0.5 ETH
      },
      approvers: ['admin'],
      requiredApprovals: 1,
      timeout: 3600000,
    },
  ];

  beforeEach(() => {
    guardrails = new Guardrails({
      killSwitchEnabled: false,
      spendingLimits: defaultSpendingLimits,
      approvalRules: defaultApprovalRules,
      blockedAddresses: new Set(['0xbad0000000000000000000000000000000000bad']),
      allowedContracts: new Set(),
      maxSlippage: 0.5,
      maxGasPrice: BigInt('100000000000'), // 100 gwei
      dryRun: false,
    });
  });

  describe('checkAction', () => {
    it('should allow simple actions within limits', async () => {
      const action: AgentAction = {
        type: 'transfer',
        token: 'ETH',
        amount: BigInt('100000000000000000'), // 0.1 ETH
        to: '0x1234567890123456789012345678901234567890',
      };

      const result = await guardrails.checkAction(action);

      expect(result.allowed).toBe(true);
      expect(result.requiresApproval).toBe(false);
    });

    it('should block actions exceeding per-transaction limit', async () => {
      const action: AgentAction = {
        type: 'transfer',
        token: 'ETH',
        amount: BigInt('2000000000000000000'), // 2 ETH (exceeds 1 ETH limit)
        to: '0x1234567890123456789012345678901234567890',
      };

      const result = await guardrails.checkAction(action);

      expect(result.allowed).toBe(false);
      expect(result.reason).toContain('spending limit');
    });

    it('should block actions to blocked addresses', async () => {
      const action: AgentAction = {
        type: 'transfer',
        token: 'ETH',
        amount: BigInt('100000000000000000'),
        to: '0xbad0000000000000000000000000000000000bad',
      };

      const result = await guardrails.checkAction(action);

      expect(result.allowed).toBe(false);
      expect(result.reason).toContain('blocked');
    });

    it('should require approval for large transactions', async () => {
      const action: AgentAction = {
        type: 'transfer',
        token: 'ETH',
        amount: BigInt('600000000000000000'), // 0.6 ETH (requires approval)
        to: '0x1234567890123456789012345678901234567890',
      };

      const result = await guardrails.checkAction(action);

      expect(result.allowed).toBe(true);
      expect(result.requiresApproval).toBe(true);
      expect(result.approvalRules).toContain('large-transaction');
    });

    it('should block all actions when kill switch is active', async () => {
      guardrails.activateKillSwitch();

      const action: AgentAction = {
        type: 'transfer',
        token: 'ETH',
        amount: BigInt('100000000000000'),
        to: '0x1234567890123456789012345678901234567890',
      };

      const result = await guardrails.checkAction(action);

      expect(result.allowed).toBe(false);
      expect(result.reason).toContain('kill switch');
    });

    it('should allow actions after kill switch is deactivated', async () => {
      guardrails.activateKillSwitch();
      guardrails.deactivateKillSwitch();

      const action: AgentAction = {
        type: 'transfer',
        token: 'ETH',
        amount: BigInt('100000000000000'),
        to: '0x1234567890123456789012345678901234567890',
      };

      const result = await guardrails.checkAction(action);

      expect(result.allowed).toBe(true);
    });
  });

  describe('spending tracking', () => {
    it('should track cumulative spending', async () => {
      const action: AgentAction = {
        type: 'transfer',
        token: 'ETH',
        amount: BigInt('400000000000000000'), // 0.4 ETH
        to: '0x1234567890123456789012345678901234567890',
      };

      // First transaction should succeed
      const result1 = await guardrails.checkAction(action);
      expect(result1.allowed).toBe(true);

      // Record the spending
      guardrails.recordSpending('ETH', action.amount!);

      // Second transaction should still succeed (0.4 + 0.4 = 0.8 < 1.0 per tx limit)
      const result2 = await guardrails.checkAction(action);
      expect(result2.allowed).toBe(true);

      // Record more spending
      guardrails.recordSpending('ETH', action.amount!);

      // Check hourly spending is tracking
      const spending = guardrails.getCurrentSpending('ETH');
      expect(spending.hourly).toBe(BigInt('800000000000000000'));
    });

    it('should block when hourly limit exceeded', async () => {
      // Spend 4.5 ETH in small increments
      for (let i = 0; i < 9; i++) {
        guardrails.recordSpending('ETH', BigInt('500000000000000000')); // 0.5 ETH each
      }

      // Next transaction of 0.6 ETH would exceed 5 ETH hourly limit
      const action: AgentAction = {
        type: 'transfer',
        token: 'ETH',
        amount: BigInt('600000000000000000'),
        to: '0x1234567890123456789012345678901234567890',
      };

      const result = await guardrails.checkAction(action);
      expect(result.allowed).toBe(false);
      expect(result.reason).toContain('hourly');
    });
  });

  describe('address management', () => {
    it('should add and check blocked addresses', () => {
      const address = '0xnewblocked00000000000000000000000000000';
      
      expect(guardrails.isAddressBlocked(address)).toBe(false);
      
      guardrails.blockAddress(address);
      
      expect(guardrails.isAddressBlocked(address)).toBe(true);
    });

    it('should remove blocked addresses', () => {
      const address = '0xbad0000000000000000000000000000000000bad';
      
      expect(guardrails.isAddressBlocked(address)).toBe(true);
      
      guardrails.unblockAddress(address);
      
      expect(guardrails.isAddressBlocked(address)).toBe(false);
    });
  });

  describe('contract management', () => {
    it('should manage allowed contracts', () => {
      const contract = '0xsafecontract000000000000000000000000000';
      
      guardrails.allowContract(contract);
      
      expect(guardrails.isContractAllowed(contract)).toBe(true);
    });
  });

  describe('dry run mode', () => {
    it('should log but allow all actions in dry run mode', async () => {
      const dryRunGuardrails = new Guardrails({
        killSwitchEnabled: true, // Even with kill switch
        spendingLimits: defaultSpendingLimits,
        approvalRules: defaultApprovalRules,
        blockedAddresses: new Set(),
        allowedContracts: new Set(),
        dryRun: true,
      });

      const action: AgentAction = {
        type: 'transfer',
        token: 'ETH',
        amount: BigInt('100000000000000000000'), // Way over limit
        to: '0x1234567890123456789012345678901234567890',
      };

      const result = await dryRunGuardrails.checkAction(action);

      // In dry run, actions are allowed but violations are logged
      expect(result.allowed).toBe(true);
      expect(result.violations).toBeDefined();
      expect(result.violations!.length).toBeGreaterThan(0);
    });
  });
});
