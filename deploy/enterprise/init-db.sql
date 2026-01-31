-- Universal Crypto MCP - Database Schema
-- PostgreSQL initialization script
--
-- @author nirholas
-- @license Apache-2.0

-- ═══════════════════════════════════════════════════════════════
-- Extensions
-- ═══════════════════════════════════════════════════════════════

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ═══════════════════════════════════════════════════════════════
-- Payments Table - All x402 payments
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payer_address VARCHAR(42) NOT NULL,
    amount DECIMAL(20, 8) NOT NULL,
    tx_hash VARCHAR(66) UNIQUE,
    route VARCHAR(255) NOT NULL,
    network VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'confirmed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_payments_payer ON payments(payer_address);
CREATE INDEX idx_payments_created ON payments(created_at);
CREATE INDEX idx_payments_route ON payments(route);
CREATE INDEX idx_payments_network ON payments(network);

-- ═══════════════════════════════════════════════════════════════
-- Subscriptions Table - Monthly/Annual subscriptions
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_address VARCHAR(42) NOT NULL,
    tier VARCHAR(20) NOT NULL CHECK (tier IN ('basic', 'premium', 'enterprise')),
    plan VARCHAR(20) NOT NULL CHECK (plan IN ('monthly', 'annual')),
    price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'pending')),
    starts_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    auto_renew BOOLEAN DEFAULT true,
    payment_tx_hash VARCHAR(66),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_wallet ON subscriptions(wallet_address);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_expires ON subscriptions(expires_at);
CREATE UNIQUE INDEX idx_subscriptions_active ON subscriptions(wallet_address) 
    WHERE status = 'active';

-- ═══════════════════════════════════════════════════════════════
-- API Keys Table - For subscription holders
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key_hash VARCHAR(64) UNIQUE NOT NULL,
    wallet_address VARCHAR(42) NOT NULL,
    name VARCHAR(100),
    subscription_id UUID REFERENCES subscriptions(id),
    permissions JSONB DEFAULT '["read"]',
    rate_limit INTEGER DEFAULT 1000,
    last_used_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_api_keys_wallet ON api_keys(wallet_address);
CREATE INDEX idx_api_keys_status ON api_keys(status);

-- ═══════════════════════════════════════════════════════════════
-- Analytics Table - Request tracking
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS analytics (
    id BIGSERIAL PRIMARY KEY,
    route VARCHAR(255) NOT NULL,
    payer_address VARCHAR(42),
    response_time_ms INTEGER,
    status_code INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Partition by month for performance
CREATE INDEX idx_analytics_created ON analytics(created_at);
CREATE INDEX idx_analytics_route ON analytics(route);
CREATE INDEX idx_analytics_payer ON analytics(payer_address);

-- ═══════════════════════════════════════════════════════════════
-- Revenue Summary - Materialized view for dashboards
-- ═══════════════════════════════════════════════════════════════

CREATE MATERIALIZED VIEW IF NOT EXISTS revenue_daily AS
SELECT 
    DATE(created_at) as date,
    network,
    COUNT(*) as payment_count,
    SUM(amount) as total_revenue,
    COUNT(DISTINCT payer_address) as unique_payers
FROM payments
WHERE status = 'confirmed'
GROUP BY DATE(created_at), network
ORDER BY date DESC;

CREATE UNIQUE INDEX idx_revenue_daily ON revenue_daily(date, network);

-- Refresh function
CREATE OR REPLACE FUNCTION refresh_revenue_daily()
RETURNS TRIGGER AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY revenue_daily;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- ═══════════════════════════════════════════════════════════════
-- Route Stats - Materialized view for popular endpoints
-- ═══════════════════════════════════════════════════════════════

CREATE MATERIALIZED VIEW IF NOT EXISTS route_stats AS
SELECT 
    route,
    COUNT(*) as request_count,
    AVG(response_time_ms) as avg_response_time,
    PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY response_time_ms) as p95_response_time,
    SUM(CASE WHEN status_code >= 200 AND status_code < 300 THEN 1 ELSE 0 END)::float / COUNT(*) * 100 as success_rate
FROM analytics
WHERE created_at > NOW() - INTERVAL '24 hours'
GROUP BY route
ORDER BY request_count DESC;

CREATE UNIQUE INDEX idx_route_stats ON route_stats(route);

-- ═══════════════════════════════════════════════════════════════
-- Disputes Table - Payment disputes
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS disputes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payment_id UUID REFERENCES payments(id),
    disputer_address VARCHAR(42) NOT NULL,
    reason TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'rejected')),
    resolution TEXT,
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_disputes_payment ON disputes(payment_id);
CREATE INDEX idx_disputes_status ON disputes(status);

-- ═══════════════════════════════════════════════════════════════
-- Webhooks Table - Notification endpoints
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS webhooks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_address VARCHAR(42) NOT NULL,
    url VARCHAR(500) NOT NULL,
    events JSONB DEFAULT '["payment.received", "subscription.created"]',
    secret VARCHAR(64),
    status VARCHAR(20) DEFAULT 'active',
    last_triggered_at TIMESTAMP WITH TIME ZONE,
    failure_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_webhooks_wallet ON webhooks(wallet_address);
CREATE INDEX idx_webhooks_status ON webhooks(status);

-- ═══════════════════════════════════════════════════════════════
-- Functions
-- ═══════════════════════════════════════════════════════════════

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to tables
CREATE TRIGGER update_payments_updated_at
    BEFORE UPDATE ON payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_disputes_updated_at
    BEFORE UPDATE ON disputes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ═══════════════════════════════════════════════════════════════
-- Sample Data (for testing)
-- ═══════════════════════════════════════════════════════════════

-- Uncomment for development:
-- INSERT INTO subscriptions (wallet_address, tier, plan, price, expires_at)
-- VALUES ('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045', 'enterprise', 'monthly', 199.99, NOW() + INTERVAL '30 days');

-- ═══════════════════════════════════════════════════════════════
-- Grants (adjust for your setup)
-- ═══════════════════════════════════════════════════════════════

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO ucm;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO ucm;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO ucm;

