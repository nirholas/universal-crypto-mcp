/**
 * Token Unlock Tracker Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { createUnlockTracker } from '../src/modules/token-unlocks/tracker.js';
import type {
  TokenProject,
  VestingSchedule,
} from '../src/modules/token-unlocks/types.js';

describe('UnlockTracker', () => {
  let tracker: ReturnType<typeof createUnlockTracker>;

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

  const mockSchedule: VestingSchedule = {
    id: 'test-schedule',
    projectId: 'test-token',
    beneficiaryType: 'team',
    totalTokens: '200000000',
    cliffDuration: 365,
    cliffEnd: new Date('2025-01-01'),
    vestingDuration: 1461,
    vestingStart: new Date('2024-01-01'),
    vestingEnd: new Date('2028-01-01'),
    initialUnlock: '10000000',
    linearVesting: true,
  };

  beforeEach(() => {
    tracker = createUnlockTracker({
      alertThresholds: {
        minUnlockPercentage: 5,
        daysBeforeAlert: 30,
        minMarketCapForAlert: 1_000_000,
      },
    });
  });

  describe('Project Management', () => {
    it('should add and retrieve project', () => {
      tracker.addProject(mockProject);
      
      const project = tracker.getProject('test-token');
      expect(project).toBeDefined();
      expect(project?.name).toBe('Test Token');
    });

    it('should list all projects', () => {
      tracker.addProject(mockProject);
      tracker.addProject({ ...mockProject, id: 'test-token-2', name: 'Test Token 2' });
      
      const projects = tracker.getAllProjects();
      expect(projects.length).toBe(2);
    });
  });

  describe('Vesting Schedules', () => {
    beforeEach(() => {
      tracker.addProject(mockProject);
    });

    it('should add vesting schedule', () => {
      tracker.addVestingSchedule(mockSchedule);
      
      const schedules = tracker.getVestingSchedules('test-token');
      expect(schedules.length).toBe(1);
      expect(schedules[0].beneficiaryType).toBe('team');
    });

    it('should add multiple schedules', () => {
      tracker.addVestingSchedule(mockSchedule);
      tracker.addVestingSchedule({
        ...mockSchedule,
        id: 'investor-schedule',
        beneficiaryType: 'investors',
      });
      
      const schedules = tracker.getVestingSchedules('test-token');
      expect(schedules.length).toBe(2);
    });
  });

  describe('Unlock Events', () => {
    beforeEach(() => {
      tracker.addProject(mockProject);
      tracker.addVestingSchedule(mockSchedule);
    });

    it('should get upcoming unlocks', () => {
      const unlocks = tracker.getUpcomingUnlocks('test-token');
      
      expect(unlocks.length).toBeGreaterThan(0);
      expect(unlocks[0].date.getTime()).toBeGreaterThan(Date.now());
    });

    it('should limit unlock results', () => {
      const unlocks = tracker.getUpcomingUnlocks('test-token', 5);
      
      expect(unlocks.length).toBeLessThanOrEqual(5);
    });

    it('should get historical unlocks', () => {
      // Would need past schedule for this test
      const unlocks = tracker.getHistoricalUnlocks('test-token');
      expect(Array.isArray(unlocks)).toBe(true);
    });
  });

  describe('Calendar View', () => {
    beforeEach(() => {
      tracker.addProject(mockProject);
      tracker.addVestingSchedule(mockSchedule);
    });

    it('should generate unlock calendar', () => {
      const startDate = new Date('2025-01-01');
      const endDate = new Date('2025-12-31');
      
      const calendar = tracker.getUnlockCalendar(startDate, endDate);
      
      expect(Array.isArray(calendar)).toBe(true);
      calendar.forEach(day => {
        expect(day.date).toBeInstanceOf(Date);
        expect(Array.isArray(day.events)).toBe(true);
        expect(typeof day.projectsAffected).toBe('number');
      });
    });
  });

  describe('Search Functionality', () => {
    beforeEach(() => {
      tracker.addProject(mockProject);
      tracker.addVestingSchedule(mockSchedule);
    });

    it('should search by date range', () => {
      const results = tracker.searchUnlocks({
        startDate: new Date('2025-01-01'),
        endDate: new Date('2026-01-01'),
      });
      
      results.forEach(event => {
        expect(event.date.getTime()).toBeGreaterThanOrEqual(new Date('2025-01-01').getTime());
        expect(event.date.getTime()).toBeLessThanOrEqual(new Date('2026-01-01').getTime());
      });
    });

    it('should filter by beneficiary type', () => {
      const results = tracker.searchUnlocks({
        beneficiaryTypes: ['team'],
      });
      
      results.forEach(event => {
        expect(event.beneficiaryType).toBe('team');
      });
    });

    it('should filter by project', () => {
      const results = tracker.searchUnlocks({
        projectIds: ['test-token'],
      });
      
      results.forEach(event => {
        expect(event.projectId).toBe('test-token');
      });
    });
  });

  describe('Market Impact Analysis', () => {
    beforeEach(() => {
      tracker.addProject(mockProject);
      tracker.addVestingSchedule(mockSchedule);
    });

    it('should analyze market impact', () => {
      const analyses = tracker.getMarketImpactAnalysis('test-token');
      
      expect(Array.isArray(analyses)).toBe(true);
      analyses.forEach(analysis => {
        expect(analysis.riskLevel).toMatch(/low|medium|high|critical/);
        expect(analysis.impactScore).toBeGreaterThanOrEqual(0);
        expect(analysis.impactScore).toBeLessThanOrEqual(100);
        expect(Array.isArray(analysis.recommendations)).toBe(true);
      });
    });
  });

  describe('Vesting Analytics', () => {
    beforeEach(() => {
      tracker.addProject(mockProject);
      tracker.addVestingSchedule(mockSchedule);
    });

    it('should get comprehensive analytics', () => {
      const analytics = tracker.getVestingAnalytics('test-token');
      
      expect(analytics).toBeDefined();
      expect(analytics?.project.id).toBe('test-token');
      expect(analytics?.schedules.length).toBeGreaterThan(0);
      expect(analytics?.statistics).toBeDefined();
      expect(Array.isArray(analytics?.upcomingUnlocks)).toBe(true);
      expect(Array.isArray(analytics?.marketImpact)).toBe(true);
    });

    it('should return null for non-existent project', () => {
      const analytics = tracker.getVestingAnalytics('non-existent');
      expect(analytics).toBeNull();
    });
  });

  describe('Alerts', () => {
    beforeEach(() => {
      tracker.addProject(mockProject);
    });

    it('should generate alerts for significant unlocks', () => {
      // Add schedule with large unlock
      tracker.addVestingSchedule({
        ...mockSchedule,
        totalTokens: '100000000', // 40% of circulating
        cliffEnd: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
      });
      
      const alerts = tracker.getAlerts();
      expect(Array.isArray(alerts)).toBe(true);
    });

    it('should filter unacknowledged alerts', () => {
      const allAlerts = tracker.getAlerts(true);
      const unackAlerts = tracker.getAlerts(false);
      
      expect(unackAlerts.length).toBeLessThanOrEqual(allAlerts.length);
    });

    it('should acknowledge alerts', () => {
      tracker.addVestingSchedule({
        ...mockSchedule,
        totalTokens: '100000000',
        cliffEnd: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      });
      
      const alerts = tracker.getAlerts(false);
      if (alerts.length > 0) {
        const alertId = alerts[0].id;
        tracker.acknowledgeAlert(alertId);
        
        const updatedAlerts = tracker.getAlerts(false);
        expect(updatedAlerts.length).toBe(alerts.length - 1);
      }
    });
  });

  describe('Tracker Statistics', () => {
    it('should provide tracker stats', () => {
      tracker.addProject(mockProject);
      tracker.addVestingSchedule(mockSchedule);
      
      const stats = tracker.getTrackerStats();
      
      expect(stats.totalProjects).toBeGreaterThanOrEqual(1);
      expect(stats.totalSchedules).toBeGreaterThanOrEqual(1);
      expect(typeof stats.upcomingUnlocks).toBe('number');
      expect(typeof stats.criticalAlerts).toBe('number');
    });

    it('should identify next major unlock', () => {
      tracker.addProject(mockProject);
      tracker.addVestingSchedule(mockSchedule);
      
      const stats = tracker.getTrackerStats();
      
      if (stats.nextMajorUnlock) {
        expect(stats.nextMajorUnlock.project).toBeDefined();
        expect(stats.nextMajorUnlock.date).toBeInstanceOf(Date);
        expect(stats.nextMajorUnlock.amount).toBeDefined();
      }
    });
  });
});
