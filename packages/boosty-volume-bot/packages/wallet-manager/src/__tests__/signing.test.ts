/**
 * Signing Queue Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SigningQueue, createSigningQueue } from '../signing/index.js';

describe('SigningQueue', () => {
  let queue: SigningQueue;

  beforeEach(() => {
    queue = createSigningQueue({ rateLimit: 60 });
  });

  describe('rate limiting', () => {
    it('allows signing when under limit', () => {
      expect(queue.canSign()).toBe(true);
      expect(queue.getRemainingCapacity()).toBe(60);
    });

    it('tracks signing operations', () => {
      queue.recordSigning();
      queue.recordSigning();
      queue.recordSigning();
      
      expect(queue.getCurrentRate()).toBe(3);
      expect(queue.getRemainingCapacity()).toBe(57);
    });

    it('blocks when rate limit reached', () => {
      // Fill up the rate limit
      for (let i = 0; i < 60; i++) {
        queue.recordSigning();
      }
      
      expect(queue.canSign()).toBe(false);
      expect(queue.getRemainingCapacity()).toBe(0);
    });

    it('allows updating rate limit', () => {
      queue.setRateLimit(100);
      expect(queue.getRemainingCapacity()).toBe(100);
    });

    it('throws for invalid rate limit', () => {
      expect(() => queue.setRateLimit(0)).toThrow();
      expect(() => queue.setRateLimit(-1)).toThrow();
    });
  });

  describe('queue management', () => {
    it('adds entries to queue', () => {
      const entry = queue.add({
        walletId: 'test-wallet',
        transaction: {} as any,
        priority: 1,
      });
      
      expect(entry.id).toBeDefined();
      expect(entry.status).toBe('pending');
      expect(entry.createdAt).toBeInstanceOf(Date);
    });

    it('retrieves entries by id', () => {
      const entry = queue.add({
        walletId: 'test-wallet',
        transaction: {} as any,
        priority: 1,
      });
      
      const retrieved = queue.get(entry.id);
      expect(retrieved).toBeDefined();
      expect(retrieved?.walletId).toBe('test-wallet');
    });

    it('removes entries', () => {
      const entry = queue.add({
        walletId: 'test-wallet',
        transaction: {} as any,
        priority: 1,
      });
      
      expect(queue.get(entry.id)).toBeDefined();
      
      const removed = queue.remove(entry.id);
      expect(removed).toBe(true);
      expect(queue.get(entry.id)).toBeUndefined();
    });

    it('updates entry status', () => {
      const entry = queue.add({
        walletId: 'test-wallet',
        transaction: {} as any,
        priority: 1,
      });
      
      queue.updateStatus(entry.id, 'signing');
      expect(queue.get(entry.id)?.status).toBe('signing');
      
      queue.updateStatus(entry.id, 'completed');
      expect(queue.get(entry.id)?.status).toBe('completed');
      
      queue.updateStatus(entry.id, 'failed', 'Some error');
      expect(queue.get(entry.id)?.status).toBe('failed');
      expect(queue.get(entry.id)?.error).toBe('Some error');
    });

    it('clears all entries', () => {
      queue.add({ walletId: 'w1', transaction: {} as any, priority: 1 });
      queue.add({ walletId: 'w2', transaction: {} as any, priority: 2 });
      queue.add({ walletId: 'w3', transaction: {} as any, priority: 3 });
      
      expect(queue.getStats().queueSize).toBe(3);
      
      queue.clear();
      
      expect(queue.getStats().queueSize).toBe(0);
    });
  });

  describe('priority ordering', () => {
    it('returns pending entries sorted by priority', () => {
      queue.add({ walletId: 'low', transaction: {} as any, priority: 1 });
      queue.add({ walletId: 'high', transaction: {} as any, priority: 10 });
      queue.add({ walletId: 'medium', transaction: {} as any, priority: 5 });
      
      const pending = queue.getPendingEntries();
      
      expect(pending[0].walletId).toBe('high');
      expect(pending[1].walletId).toBe('medium');
      expect(pending[2].walletId).toBe('low');
    });

    it('excludes non-pending entries', () => {
      const entry1 = queue.add({ walletId: 'w1', transaction: {} as any, priority: 1 });
      queue.add({ walletId: 'w2', transaction: {} as any, priority: 2 });
      
      queue.updateStatus(entry1.id, 'completed');
      
      const pending = queue.getPendingEntries();
      expect(pending.length).toBe(1);
      expect(pending[0].walletId).toBe('w2');
    });
  });

  describe('statistics', () => {
    it('returns accurate stats', () => {
      const e1 = queue.add({ walletId: 'w1', transaction: {} as any, priority: 1 });
      const e2 = queue.add({ walletId: 'w2', transaction: {} as any, priority: 2 });
      const e3 = queue.add({ walletId: 'w3', transaction: {} as any, priority: 3 });
      const e4 = queue.add({ walletId: 'w4', transaction: {} as any, priority: 4 });
      
      queue.updateStatus(e1.id, 'signing');
      queue.updateStatus(e2.id, 'completed');
      queue.updateStatus(e3.id, 'failed', 'Error');
      
      const stats = queue.getStats();
      
      expect(stats.queueSize).toBe(4);
      expect(stats.pendingCount).toBe(1);
      expect(stats.signingCount).toBe(1);
      expect(stats.completedCount).toBe(1);
      expect(stats.failedCount).toBe(1);
    });
  });

  describe('time until next slot', () => {
    it('returns 0 when not rate limited', () => {
      expect(queue.getTimeUntilNextSlot()).toBe(0);
    });

    it('returns positive time when rate limited', () => {
      // Fill rate limit
      for (let i = 0; i < 60; i++) {
        queue.recordSigning();
      }
      
      const time = queue.getTimeUntilNextSlot();
      expect(time).toBeGreaterThan(0);
      expect(time).toBeLessThanOrEqual(60000); // Max 1 minute
    });
  });
});
