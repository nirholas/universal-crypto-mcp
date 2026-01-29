/**
 * Wallet Repository
 * Database operations for wallet management
 */

import { eq, and, gte, lte, sql, desc, arrayContains } from 'drizzle-orm';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import type {
  WalletRepository as IWalletRepository,
  Wallet,
  MasterWalletEntity as IMasterWalletEntity,
  CreateWalletInput,
  UpdateWalletInput,
  WalletFilter,
  AuditLogEntry,
  AuditAction,
  WalletErrorCode,
} from '../types.js';
import { WalletManagerError } from '../types.js';
import {
  wallets,
  masterWallets,
  auditLogs,
  type WalletEntity,
  type MasterWalletEntity,
  type NewWallet,
  type NewMasterWallet,
  type NewAuditLog,
} from './entities.js';

/**
 * Wallet Repository implementation
 */
export class WalletRepositoryImpl implements IWalletRepository {
  private db: PostgresJsDatabase;

  constructor(db: PostgresJsDatabase) {
    this.db = db;
  }

  /**
   * Convert database entity to domain model
   */
  private toDomainWallet(entity: WalletEntity): Wallet {
    return {
      id: entity.id,
      address: entity.address,
      derivationIndex: entity.derivationIndex,
      masterWalletId: entity.masterWalletId,
      encryptedKey: entity.encryptedKey,
      label: entity.label,
      tags: entity.tags || [],
      createdAt: entity.createdAt,
      lastUsedAt: entity.lastUsedAt,
      totalTrades: entity.totalTrades,
      totalVolumeSol: entity.totalVolumeSol,
      isActive: entity.isActive,
    };
  }

  /**
   * Convert database entity to domain model for master wallet
   */
  private toDomainMasterWallet(entity: MasterWalletEntity): IMasterWalletEntity {
    return {
      id: entity.id,
      encryptedMnemonic: entity.encryptedMnemonic,
      derivedCount: entity.derivedCount,
      label: entity.label,
      createdAt: entity.createdAt,
    };
  }

  /**
   * Create a new wallet
   */
  async createWallet(input: CreateWalletInput): Promise<Wallet> {
    const newWallet: NewWallet = {
      address: input.address,
      derivationIndex: input.derivationIndex ?? null,
      masterWalletId: input.masterWalletId ?? null,
      encryptedKey: input.encryptedKey,
      label: input.label ?? null,
      tags: input.tags ?? [],
    };

    const result = await this.db.insert(wallets).values(newWallet).returning();

    const first = result[0];
    if (!first) {
      throw new WalletManagerError(
        'DATABASE_ERROR' as WalletErrorCode,
        'Failed to create wallet'
      );
    }

    return this.toDomainWallet(first);
  }

  /**
   * Get a wallet by ID
   */
  async getWallet(walletId: string): Promise<Wallet | null> {
    const result = await this.db
      .select()
      .from(wallets)
      .where(eq(wallets.id, walletId))
      .limit(1);

    const first = result[0];
    return first ? this.toDomainWallet(first) : null;
  }

  /**
   * Get a wallet by address
   */
  async getWalletByAddress(address: string): Promise<Wallet | null> {
    const result = await this.db
      .select()
      .from(wallets)
      .where(eq(wallets.address, address))
      .limit(1);

    const first = result[0];
    return first ? this.toDomainWallet(first) : null;
  }

  /**
   * List wallets with optional filtering
   */
  async listWallets(filter?: WalletFilter): Promise<Wallet[]> {
    let query = this.db.select().from(wallets).$dynamic();

    const conditions = [];

    if (filter?.masterWalletId) {
      conditions.push(eq(wallets.masterWalletId, filter.masterWalletId));
    }

    if (filter?.isActive !== undefined) {
      conditions.push(eq(wallets.isActive, filter.isActive));
    }

    if (filter?.minTrades !== undefined) {
      conditions.push(gte(wallets.totalTrades, filter.minTrades));
    }

    if (filter?.minVolume !== undefined) {
      conditions.push(gte(wallets.totalVolumeSol, filter.minVolume));
    }

    if (filter?.createdAfter) {
      conditions.push(gte(wallets.createdAt, filter.createdAfter));
    }

    if (filter?.createdBefore) {
      conditions.push(lte(wallets.createdAt, filter.createdBefore));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    query = query.orderBy(desc(wallets.createdAt));

    if (filter?.limit) {
      query = query.limit(filter.limit);
    }

    if (filter?.offset) {
      query = query.offset(filter.offset);
    }

    const result = await query;
    return result.map(this.toDomainWallet);
  }

  /**
   * Update a wallet
   */
  async updateWallet(walletId: string, update: UpdateWalletInput): Promise<Wallet> {
    const updateData: Partial<NewWallet> = {};

    if (update.label !== undefined) {
      updateData.label = update.label;
    }

    if (update.tags !== undefined) {
      updateData.tags = update.tags;
    }

    if (update.lastUsedAt !== undefined) {
      updateData.lastUsedAt = update.lastUsedAt;
    }

    if (update.totalTrades !== undefined) {
      updateData.totalTrades = update.totalTrades;
    }

    if (update.totalVolumeSol !== undefined) {
      updateData.totalVolumeSol = update.totalVolumeSol;
    }

    if (update.isActive !== undefined) {
      updateData.isActive = update.isActive;
    }

    const result = await this.db
      .update(wallets)
      .set(updateData)
      .where(eq(wallets.id, walletId))
      .returning();

    const first = result[0];
    if (!first) {
      throw new WalletManagerError(
        'WALLET_NOT_FOUND' as WalletErrorCode,
        'Wallet not found'
      );
    }

    return this.toDomainWallet(first);
  }

  /**
   * Delete a wallet
   */
  async deleteWallet(walletId: string): Promise<void> {
    const result = await this.db
      .delete(wallets)
      .where(eq(wallets.id, walletId))
      .returning({ id: wallets.id });

    if (result.length === 0) {
      throw new WalletManagerError(
        'WALLET_NOT_FOUND' as WalletErrorCode,
        'Wallet not found'
      );
    }
  }

  /**
   * Add a tag to a wallet
   */
  async addTag(walletId: string, tag: string): Promise<void> {
    await this.db.execute(
      sql`UPDATE wallets SET tags = array_append(tags, ${tag}) WHERE id = ${walletId} AND NOT (${tag} = ANY(tags))`
    );
  }

  /**
   * Remove a tag from a wallet
   */
  async removeTag(walletId: string, tag: string): Promise<void> {
    await this.db.execute(
      sql`UPDATE wallets SET tags = array_remove(tags, ${tag}) WHERE id = ${walletId}`
    );
  }

  /**
   * Get wallets by tag
   */
  async getWalletsByTag(tag: string): Promise<Wallet[]> {
    const result = await this.db
      .select()
      .from(wallets)
      .where(arrayContains(wallets.tags, [tag]));

    return result.map(this.toDomainWallet);
  }

  /**
   * Get wallet count with optional filtering
   */
  async getWalletCount(filter?: WalletFilter): Promise<number> {
    const conditions = [];

    if (filter?.masterWalletId) {
      conditions.push(eq(wallets.masterWalletId, filter.masterWalletId));
    }

    if (filter?.isActive !== undefined) {
      conditions.push(eq(wallets.isActive, filter.isActive));
    }

    let query = this.db
      .select({ count: sql<number>`count(*)` })
      .from(wallets);

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    const result = await query;
    return Number(result[0]?.count ?? 0);
  }

  // =========================================================================
  // Master Wallet Operations
  // =========================================================================

  /**
   * Create a master wallet
   */
  async createMasterWallet(
    encryptedMnemonic: string,
    label?: string
  ): Promise<IMasterWalletEntity> {
    const newMasterWallet: NewMasterWallet = {
      encryptedMnemonic,
      label: label ?? null,
    };

    const result = await this.db
      .insert(masterWallets)
      .values(newMasterWallet)
      .returning();

    const first = result[0];
    if (!first) {
      throw new WalletManagerError(
        'DATABASE_ERROR' as WalletErrorCode,
        'Failed to create master wallet'
      );
    }

    return this.toDomainMasterWallet(first);
  }

  /**
   * Get a master wallet by ID
   */
  async getMasterWallet(id: string): Promise<IMasterWalletEntity | null> {
    const result = await this.db
      .select()
      .from(masterWallets)
      .where(eq(masterWallets.id, id))
      .limit(1);

    const first = result[0];
    return first ? this.toDomainMasterWallet(first) : null;
  }

  /**
   * Update the derived count for a master wallet
   */
  async updateMasterWalletDerivedCount(id: string, count: number): Promise<void> {
    await this.db
      .update(masterWallets)
      .set({ derivedCount: count })
      .where(eq(masterWallets.id, id));
  }

  /**
   * List all master wallets
   */
  async listMasterWallets(): Promise<IMasterWalletEntity[]> {
    const result = await this.db
      .select()
      .from(masterWallets)
      .orderBy(desc(masterWallets.createdAt));

    return result.map(this.toDomainMasterWallet);
  }

  /**
   * Delete a master wallet
   */
  async deleteMasterWallet(id: string): Promise<void> {
    const result = await this.db
      .delete(masterWallets)
      .where(eq(masterWallets.id, id))
      .returning({ id: masterWallets.id });

    if (result.length === 0) {
      throw new WalletManagerError(
        'WALLET_NOT_FOUND' as WalletErrorCode,
        'Master wallet not found'
      );
    }
  }

  // =========================================================================
  // Audit Log Operations
  // =========================================================================

  /**
   * Log an audit entry
   */
  async logAudit(
    action: AuditAction,
    walletId: string | undefined,
    success: boolean,
    metadata?: Record<string, unknown>,
    error?: string
  ): Promise<void> {
    const newLog: NewAuditLog = {
      action,
      walletId: walletId ?? null,
      success,
      metadata: metadata ? JSON.stringify(metadata) : null,
      error: error ?? null,
    };

    await this.db.insert(auditLogs).values(newLog);
  }

  /**
   * Get audit entries for a wallet
   */
  async getAuditEntries(walletId: string, limit: number = 100): Promise<AuditLogEntry[]> {
    const result = await this.db
      .select()
      .from(auditLogs)
      .where(eq(auditLogs.walletId, walletId))
      .orderBy(desc(auditLogs.timestamp))
      .limit(limit);

    return result.map(this.toAuditLogEntry);
  }

  /**
   * Get recent audit entries
   */
  async getRecentAuditEntries(limit: number = 100): Promise<AuditLogEntry[]> {
    const result = await this.db
      .select()
      .from(auditLogs)
      .orderBy(desc(auditLogs.timestamp))
      .limit(limit);

    return result.map(this.toAuditLogEntry);
  }

  /**
   * Convert audit log entity to domain model
   */
  private toAuditLogEntry(entity: typeof auditLogs.$inferSelect): AuditLogEntry {
    return {
      id: entity.id,
      timestamp: entity.timestamp,
      action: entity.action as AuditAction,
      walletId: entity.walletId ?? undefined,
      success: entity.success,
      ipAddress: entity.ipAddress ?? undefined,
      userAgent: entity.userAgent ?? undefined,
      metadata: entity.metadata ? JSON.parse(entity.metadata) : undefined,
      error: entity.error ?? undefined,
    };
  }
}

/**
 * Create a wallet repository instance
 */
export function createWalletRepository(db: PostgresJsDatabase): IWalletRepository {
  return new WalletRepositoryImpl(db);
}
