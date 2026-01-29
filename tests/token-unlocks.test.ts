/**
 * Token Unlock Calculator Tests
 */

import { describe, it, expect } from 'vitest';
import {
  calculateUnlockEvents,
  analyzeMarketImpact,
  calculateVestingStatistics,
  daysUntilUnlock,
  formatTokenAmount,
} from '../src/modules/token-unlocks/calculator.js';
import type {
  VestingSchedule,
  TokenProject,
  UnlockEvent,
} from '../src/modules/token-unlocks/types.js';

describe('Token Unlock Calculator', () => {
  const mockProject: TokenProject = {
    id: 'test-token',
    name: 'Test Token',
    symbol: 'TEST',
    chain: 'ethereum',
    tokenAddress: '0x123...',
    totalSupply: '1000000000',
    circulatingSupply: '250000000',
    marketCap: '50000000',
    currentPrice: '0.20',
    launchDate: new Date('2024-01-01'),
  };

  describe('calculateUnlockEvents', () => {
    it('should calculate initial unlock', () => {
      const schedule: VestingSchedule = {
        id: 'test-schedule',
        projectId: 'test-token',
        beneficiaryType: 'team',
        totalTokens: '100000000',
        cliffDuration: 0,
        cliffEnd: null,
        vestingDuration: 365,
        vestingStart: new Date('2024-01-01'),
        vestingEnd: new Date('2025-01-01'),
        initialUnlock: '10000000',
        linearVesting: true,
      };

      const events = calculateUnlockEvents(schedule);
      
      expect(events.length).toBeGreaterThan(0);
      expect(events[0].tokensUnlocked).toBe('10000000');
      expect(events[0].isCliffEvent).toBe(false);
    });

    it('should calculate cliff unlock', () => {
      const schedule: VestingSchedule = {
        id: 'test-schedule',
        projectId: 'test-token',
        beneficiaryType: 'investors',
        totalTokens: '100000000',
        cliffDuration: 365,
        cliffEnd: new Date('2025-01-01'),
        vestingDuration: 1461,
        vestingStart: new Date('2024-01-01'),
        vestingEnd: new Date('2028-01-01'),
        initialUnlock: '0',
        linearVesting: true,
      };

      const events = calculateUnlockEvents(schedule);
      
      const cliffEvent = events.find(e => e.isCliffEvent);
      expect(cliffEvent).toBeDefined();
    });

    it('should calculate monthly linear vesting events', () => {
      const schedule: VestingSchedule = {
        id: 'test-schedule',
        projectId: 'test-token',
        beneficiaryType: 'team',
        totalTokens: '100000000',
        cliffDuration: 0,
        cliffEnd: null,
        vestingDuration: 365,
        vestingStart: new Date('2024-01-01'),
        vestingEnd: new Date('2025-01-01'),
        initialUnlock: '0',
        linearVesting: true,
      };

      const events = calculateUnlockEvents(schedule);
      
      // Should have ~12 monthly events
      expect(events.length).toBeGreaterThanOrEqual(10);
      expect(events.length).toBeLessThanOrEqual(14);
    });
  });

  describe('analyzeMarketImpact', () => {
    it('should analyze low impact unlock', () => {
      const unlockEvent: UnlockEvent = {
        id: 'unlock-1',
        projectId: 'test-token',
        scheduleId: 'schedule-1',
        date: new Date('2025-06-01'),
        tokensUnlocked: '5000000', // 2% of circulating
        percentageOfTotal: 0.5,
        percentageOfCirculating: 2,
        beneficiaryType: 'foundation',
        isCliffEvent: false,
      };

      const analysis = analyzeMarketImpact(unlockEvent, mockProject);
      
      expect(analysis.riskLevel).toBe('low');
      expect(analysis.impactScore).toBeLessThan(30);
      expect(analysis.factors.hodlProbability).toBeGreaterThan(70);
    });

    it('should analyze high impact unlock', () => {
      const unlockEvent: UnlockEvent = {
        id: 'unlock-2',
        projectId: 'test-token',
        scheduleId: 'schedule-2',
        date: new Date('2025-06-01'),
        tokensUnlocked: '50000000', // 20% of circulating
        percentageOfTotal: 5,
        percentageOfCirculating: 20,
        beneficiaryType: 'investors',
        isCliffEvent: true,
      };

      const analysis = analyzeMarketImpact(unlockEvent, mockProject);
      
      expect(analysis.riskLevel).toMatch(/high|critical/);
      expect(analysis.impactScore).toBeGreaterThan(60);
      expect(analysis.recommendations.length).toBeGreaterThan(0);
    });

    it('should provide price impact estimates', () => {
      const unlockEvent: UnlockEvent = {
        id: 'unlock-3',
        projectId: 'test-token',
        scheduleId: 'schedule-3',
        date: new Date('2025-06-01'),
        tokensUnlocked: '25000000',
        percentageOfTotal: 2.5,
        percentageOfCirculating: 10,
        beneficiaryType: 'team',
        isCliffEvent: false,
      };

      const analysis = analyzeMarketImpact(unlockEvent, mockProject);
      
      expect(analysis.estimatedPriceImpact.bearish).toMatch(/-\d+\.\d+%/);
      expect(analysis.estimatedPriceImpact.neutral).toMatch(/-\d+\.\d+%/);
      expect(analysis.estimatedPriceImpact.bullish).toMatch(/-\d+\.\d+%/);
    });
  });

  describe('calculateVestingStatistics', () => {
    it('should calculate correct statistics', () => {
      const schedules: VestingSchedule[] = [
        {
          id: 'schedule-1',
          projectId: 'test-token',
          beneficiaryType: 'team',
          totalTokens: '200000000',
          cliffDuration: 365,
          cliffEnd: new Date('2025-01-01'),
          vestingDuration: 1461,
          vestingStart: new Date('2024-01-01'),
          vestingEnd: new Date('2028-01-01'),
          initialUnlock: '0',
          linearVesting: true,
        },
      ];

      const unlockEvents = calculateUnlockEvents(schedules[0]);
      const stats = calculateVestingStatistics(mockProject, schedules, unlockEvents);
      
      expect(stats.projectId).toBe('test-token');
      expect(parseFloat(stats.totalVested)).toBe(200000000);
      expect(stats.percentageVested).toBeGreaterThanOrEqual(0);
      expect(stats.percentageVested).toBeLessThanOrEqual(100);
      expect(stats.unlockFrequency).toBeDefined();
    });
  });

  describe('daysUntilUnlock', () => {
    it('should calculate correct days until unlock', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30);
      
      const days = daysUntilUnlock(futureDate);
      
      expect(days).toBeGreaterThanOrEqual(29);
      expect(days).toBeLessThanOrEqual(31);
    });

    it('should handle past dates', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 30);
      
      const days = daysUntilUnlock(pastDate);
      
      expect(days).toBeLessThan(0);
    });
  });

  describe('formatTokenAmount', () => {
    it('should format billions', () => {
      expect(formatTokenAmount('1500000000')).toBe('1.50B');
    });

    it('should format millions', () => {
      expect(formatTokenAmount('2500000')).toBe('2.50M');
    });

    it('should format thousands', () => {
      expect(formatTokenAmount('1500')).toBe('1.50K');
    });

    it('should format small numbers', () => {
      expect(formatTokenAmount('123.456', 2)).toBe('123.46');
    });

    it('should respect decimal places', () => {
      expect(formatTokenAmount('1234567890', 1)).toBe('1.2B');
      expect(formatTokenAmount('1234567890', 3)).toBe('1.235B');
    });
  });
});
