-- Initialize database schema for DeFi MCP Server

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Master wallets table (stores encrypted mnemonics)
CREATE TABLE IF NOT EXISTS master_wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    encrypted_mnemonic TEXT NOT NULL,
    public_key VARCHAR(44) NOT NULL,
    derived_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Derived wallets table
CREATE TABLE IF NOT EXISTS wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    address VARCHAR(44) UNIQUE NOT NULL,
    derivation_index INTEGER NOT NULL,
    master_wallet_id UUID REFERENCES master_wallets(id) ON DELETE CASCADE,
    encrypted_private_key TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_used_at TIMESTAMPTZ,
    total_trades INTEGER DEFAULT 0,
    total_volume_lamports BIGINT DEFAULT 0,
    
    UNIQUE(master_wallet_id, derivation_index)
);

-- Campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    target_token VARCHAR(44) NOT NULL,
    target_volume_24h BIGINT NOT NULL,
    target_tx_count_24h INTEGER NOT NULL,
    duration_hours INTEGER NOT NULL,
    bot_count INTEGER NOT NULL,
    wallet_tag VARCHAR(255),
    mode VARCHAR(20) NOT NULL CHECK (mode IN ('aggressive', 'moderate', 'stealth')),
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed', 'failed')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    started_at TIMESTAMPTZ,
    ended_at TIMESTAMPTZ,
    
    -- Metrics (updated periodically)
    volume_generated BIGINT DEFAULT 0,
    transaction_count INTEGER DEFAULT 0,
    unique_wallets_used INTEGER DEFAULT 0,
    total_fees_paid BIGINT DEFAULT 0
);

-- Bots table
CREATE TABLE IF NOT EXISTS bots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_id UUID REFERENCES wallets(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
    target_token VARCHAR(44) NOT NULL,
    mode VARCHAR(20) NOT NULL CHECK (mode IN ('volume', 'market-make', 'accumulate', 'distribute')),
    
    -- Configuration
    min_trade_size BIGINT NOT NULL,
    max_trade_size BIGINT NOT NULL,
    min_interval_ms INTEGER NOT NULL,
    max_interval_ms INTEGER NOT NULL,
    buy_probability DECIMAL(3,2) NOT NULL CHECK (buy_probability >= 0 AND buy_probability <= 1),
    max_daily_trades INTEGER DEFAULT 1000,
    max_daily_volume BIGINT,
    enabled BOOLEAN DEFAULT true,
    
    -- Status
    status VARCHAR(20) DEFAULT 'idle' CHECK (status IN ('idle', 'running', 'paused', 'stopped', 'error')),
    last_error TEXT,
    
    -- Stats
    total_trades INTEGER DEFAULT 0,
    successful_trades INTEGER DEFAULT 0,
    failed_trades INTEGER DEFAULT 0,
    total_volume BIGINT DEFAULT 0,
    total_fees BIGINT DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_trade_at TIMESTAMPTZ
);

-- Trades history table
CREATE TABLE IF NOT EXISTS trades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_id UUID REFERENCES wallets(id),
    bot_id UUID REFERENCES bots(id),
    campaign_id UUID REFERENCES campaigns(id),
    
    signature VARCHAR(128) UNIQUE NOT NULL,
    input_token VARCHAR(44) NOT NULL,
    output_token VARCHAR(44) NOT NULL,
    input_amount BIGINT NOT NULL,
    output_amount BIGINT NOT NULL,
    price_impact DECIMAL(10,6),
    fee BIGINT NOT NULL,
    
    dex VARCHAR(20) NOT NULL,
    pool_id VARCHAR(64),
    
    status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'confirmed', 'failed')),
    error_message TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    confirmed_at TIMESTAMPTZ
);

-- Tasks table (for queue persistence)
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(50) NOT NULL,
    payload JSONB NOT NULL,
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'critical')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'retry')),
    
    max_retries INTEGER DEFAULT 3,
    retry_count INTEGER DEFAULT 0,
    timeout_ms INTEGER DEFAULT 60000,
    
    wallet_id UUID REFERENCES wallets(id),
    bot_id UUID REFERENCES bots(id),
    campaign_id UUID REFERENCES campaigns(id),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    error TEXT,
    result JSONB
);

-- Audit log table
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_wallets_address ON wallets(address);
CREATE INDEX IF NOT EXISTS idx_wallets_tags ON wallets USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_wallets_master ON wallets(master_wallet_id);
CREATE INDEX IF NOT EXISTS idx_bots_wallet ON bots(wallet_id);
CREATE INDEX IF NOT EXISTS idx_bots_campaign ON bots(campaign_id);
CREATE INDEX IF NOT EXISTS idx_bots_status ON bots(status);
CREATE INDEX IF NOT EXISTS idx_trades_wallet ON trades(wallet_id);
CREATE INDEX IF NOT EXISTS idx_trades_campaign ON trades(campaign_id);
CREATE INDEX IF NOT EXISTS idx_trades_created ON trades(created_at);
CREATE INDEX IF NOT EXISTS idx_trades_signature ON trades(signature);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_created ON tasks(created_at);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_audit_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for master_wallets
CREATE TRIGGER update_master_wallets_updated_at
    BEFORE UPDATE ON master_wallets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to log audit events
CREATE OR REPLACE FUNCTION log_audit_event(
    p_action VARCHAR(100),
    p_entity_type VARCHAR(50),
    p_entity_id UUID,
    p_details JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_id UUID;
BEGIN
    INSERT INTO audit_logs (action, entity_type, entity_id, details)
    VALUES (p_action, p_entity_type, p_entity_id, p_details)
    RETURNING id INTO v_id;
    RETURN v_id;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions (adjust as needed)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO defi;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO defi;
