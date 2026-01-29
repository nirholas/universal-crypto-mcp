-- Migration: 001_initial_schema
-- Creates the initial database schema for wallet management

-- Master wallets table
CREATE TABLE IF NOT EXISTS master_wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  encrypted_mnemonic TEXT NOT NULL,
  derived_count INTEGER DEFAULT 0 NOT NULL,
  label VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS master_wallets_created_at_idx ON master_wallets (created_at);

-- Wallets table
CREATE TABLE IF NOT EXISTS wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  address VARCHAR(44) UNIQUE NOT NULL,
  derivation_index INTEGER,
  master_wallet_id UUID REFERENCES master_wallets(id) ON DELETE CASCADE,
  encrypted_key TEXT NOT NULL,
  label VARCHAR(255),
  tags TEXT[] DEFAULT '{}' NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  last_used_at TIMESTAMP,
  total_trades INTEGER DEFAULT 0 NOT NULL,
  total_volume_sol BIGINT DEFAULT 0 NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL
);

CREATE INDEX IF NOT EXISTS wallets_address_idx ON wallets (address);
CREATE INDEX IF NOT EXISTS wallets_master_wallet_id_idx ON wallets (master_wallet_id);
CREATE INDEX IF NOT EXISTS wallets_tags_idx ON wallets USING GIN (tags);
CREATE INDEX IF NOT EXISTS wallets_is_active_idx ON wallets (is_active);
CREATE INDEX IF NOT EXISTS wallets_created_at_idx ON wallets (created_at);

-- Audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMP DEFAULT NOW() NOT NULL,
  action VARCHAR(50) NOT NULL,
  wallet_id UUID REFERENCES wallets(id) ON DELETE SET NULL,
  success BOOLEAN NOT NULL,
  ip_address VARCHAR(45),
  user_agent TEXT,
  metadata TEXT,
  error TEXT
);

CREATE INDEX IF NOT EXISTS audit_logs_timestamp_idx ON audit_logs (timestamp);
CREATE INDEX IF NOT EXISTS audit_logs_wallet_id_idx ON audit_logs (wallet_id);
CREATE INDEX IF NOT EXISTS audit_logs_action_idx ON audit_logs (action);

-- Wallet groups table
CREATE TABLE IF NOT EXISTS wallet_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS wallet_groups_name_idx ON wallet_groups (name);

-- Wallet group memberships (many-to-many)
CREATE TABLE IF NOT EXISTS wallet_group_members (
  wallet_id UUID REFERENCES wallets(id) ON DELETE CASCADE NOT NULL,
  group_id UUID REFERENCES wallet_groups(id) ON DELETE CASCADE NOT NULL,
  added_at TIMESTAMP DEFAULT NOW() NOT NULL,
  PRIMARY KEY (wallet_id, group_id)
);

CREATE INDEX IF NOT EXISTS wallet_group_members_pk ON wallet_group_members (wallet_id, group_id);

-- Add comment for documentation
COMMENT ON TABLE wallets IS 'Stores individual wallets, both derived and standalone';
COMMENT ON TABLE master_wallets IS 'Stores encrypted mnemonics for HD wallet roots';
COMMENT ON TABLE audit_logs IS 'Tracks all wallet access and operations for security';
COMMENT ON TABLE wallet_groups IS 'Organizes wallets into logical groups';
COMMENT ON TABLE wallet_group_members IS 'Many-to-many relationship between wallets and groups';
