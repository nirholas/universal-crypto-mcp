/**
 * Audit Logger
 */

import { createChildLogger } from '../utils/logger.js';
import type { AuditLogEntry } from '../types.js';

const logger = createChildLogger('audit');

export class AuditLogger {
  private entries: AuditLogEntry[] = [];
  private maxEntries: number;

  constructor(maxEntries: number = 10000) {
    this.maxEntries = maxEntries;
  }

  log(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): void {
    const fullEntry: AuditLogEntry = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      timestamp: new Date().toISOString(),
      ...entry,
    };

    this.entries.push(fullEntry);
    
    // Trim if needed
    if (this.entries.length > this.maxEntries) {
      this.entries = this.entries.slice(-this.maxEntries);
    }

    // Log to console
    if (entry.result === 'error') {
      logger.error({ ...fullEntry }, 'Tool execution failed');
    } else {
      logger.info({ tool: entry.tool, duration: entry.duration }, 'Tool executed');
    }
  }

  getEntries(limit: number = 100): AuditLogEntry[] {
    return this.entries.slice(-limit);
  }

  getEntriesByTool(tool: string, limit: number = 100): AuditLogEntry[] {
    return this.entries.filter(e => e.tool === tool).slice(-limit);
  }

  clear(): void {
    this.entries = [];
    logger.info('Audit log cleared');
  }
}
