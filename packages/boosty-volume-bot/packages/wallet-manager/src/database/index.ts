/**
 * Database Module
 * Exports all database functionality
 */

export {
  masterWallets,
  wallets,
  auditLogs,
  walletGroups,
  walletGroupMembers,
  type MasterWalletEntity,
  type NewMasterWallet,
  type WalletEntity,
  type NewWallet,
  type AuditLogEntity,
  type NewAuditLog,
  type WalletGroupEntity,
  type NewWalletGroup,
  type WalletGroupMemberEntity,
  type NewWalletGroupMember,
} from './entities.js';

export {
  WalletRepositoryImpl,
  createWalletRepository,
} from './repository.js';

export {
  runMigrations,
  rollbackLastMigration,
  checkMigrationStatus,
} from './migrations/run.js';
