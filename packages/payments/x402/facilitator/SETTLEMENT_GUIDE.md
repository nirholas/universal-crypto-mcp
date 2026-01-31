# Fee Settlement Guide

Complete guide for managing and withdrawing collected platform fees.

## Overview

The x402 facilitator automatically collects a 0.1% platform fee on every payment. These fees accumulate in payer accounts and are periodically settled (withdrawn) to your fee recipient address.

## How Settlement Works

```
1. Payer sends payment → Fee calculated (0.1%) → Fee recorded
2. Fees accumulate across all networks/tokens
3. Auto-settlement runs every hour (configurable)
4. When accumulated fees ≥ $10, settlement is triggered
5. Fees transferred to FEE_RECIPIENT address
6. Settlement recorded in history
```

## Automatic Settlement

By default, settlement runs automatically every hour.

### Configuration

```bash
# Enable/disable auto-settlement
AUTO_SETTLEMENT=true

# Check interval (milliseconds)
SETTLEMENT_INTERVAL_MS=3600000  # 1 hour

# Minimum batch size to trigger settlement (USD)
SETTLEMENT_MIN_BATCH_SIZE=10.0  # $10

# Maximum fees per settlement (USD)
SETTLEMENT_MAX_BATCH_SIZE=100000.0  # $100K
```

### Monitor Auto-Settlement

Check if settlement is running:

```bash
curl http://localhost:3002/settlement/stats
```

Response:
```json
{
  "totalSettlements": 12,
  "successfulSettlements": 12,
  "failedSettlements": 0,
  "totalAmountSettled": "1250.50",
  "settlementsByNetwork": {
    "eip155:42161": 7,
    "eip155:8453": 5
  },
  "isCurrentlySettling": false
}
```

## Manual Settlement

For immediate fee collection, trigger manual settlement.

### 1. Set Admin Key

Generate a secure admin key:

```bash
# Generate random key
openssl rand -hex 32

# Add to .env
echo "ADMIN_KEY=$(openssl rand -hex 32)" >> .env
```

**⚠️ SECURITY**: Never commit your admin key to git!

### 2. Check Pending Fees

See how much is ready to settle:

```bash
curl http://localhost:3002/settlement/pending
```

Response:
```json
{
  "pending": [
    {
      "network": "eip155:42161",
      "token": "USDC",
      "totalAmount": "125500000",  // Raw amount (with decimals)
      "feeCount": 523,
      "payerCount": 87
    },
    {
      "network": "eip155:8453",
      "token": "USDC",
      "totalAmount": "45200000",
      "feeCount": 187,
      "payerCount": 34
    }
  ],
  "shouldSettle": true
}
```

### 3. Settle All Fees

Settle fees across all networks:

```bash
curl -X POST http://localhost:3002/settlement/settle-all \
  -H "Content-Type: application/json" \
  -d '{
    "adminKey": "your_admin_key_here"
  }'
```

Response:
```json
{
  "success": true,
  "results": [
    {
      "success": true,
      "network": "eip155:42161",
      "token": "USDC",
      "totalAmount": "125.50",
      "feeCount": 523,
      "txHash": "0x...",
      "timestamp": 1705000000000
    },
    {
      "success": true,
      "network": "eip155:8453",
      "token": "USDC",
      "totalAmount": "45.20",
      "feeCount": 187,
      "txHash": "0x...",
      "timestamp": 1705000000123
    }
  ],
  "summary": {
    "totalSettlements": 2,
    "successful": 2,
    "failed": 0
  }
}
```

### 4. Settle Specific Network

To settle only one network:

```bash
curl -X POST http://localhost:3002/settlement/settle-network \
  -H "Content-Type: application/json" \
  -d '{
    "adminKey": "your_admin_key_here",
    "network": "eip155:42161",
    "token": "USDC"
  }'
```

## Settlement History

View all past settlements:

```bash
curl http://localhost:3002/settlement/history?limit=50
```

Response:
```json
{
  "history": [
    {
      "success": true,
      "network": "eip155:42161",
      "token": "USDC",
      "totalAmount": "125.50",
      "feeCount": 523,
      "txHash": "0xabc123...",
      "timestamp": 1705000000000,
      "gasUsed": "150000"
    },
    {
      "success": true,
      "network": "eip155:8453",
      "token": "USDC",
      "totalAmount": "45.20",
      "feeCount": 187,
      "txHash": "0xdef456...",
      "timestamp": 1705000000123
    }
  ]
}
```

## Production Setup

### 1. Configure Fee Recipient

Set where fees should be sent:

```bash
# Use a dedicated treasury wallet
FEE_RECIPIENT=0xYourTreasuryWallet...
```

### 2. Set Batch Thresholds

Balance between gas costs and settlement frequency:

```bash
# Wait until $100 accumulated before settling
SETTLEMENT_MIN_BATCH_SIZE=100.0

# Check every 6 hours
SETTLEMENT_INTERVAL_MS=21600000
```

### 3. Monitor Settlement

Set up alerts for failed settlements:

```promql
# Prometheus alert rule
rate(facilitator_settlement_failed_total[1h]) > 0
```

### 4. Track Revenue

Create Grafana dashboard:

```promql
# Total fees collected
sum(facilitator_fees_collected_total)

# Settlement success rate
sum(facilitator_settlement_success_total) / 
  sum(facilitator_settlement_total) * 100

# Fees by network
sum by (network) (facilitator_fees_collected_total)
```

## Settlement Flow Diagram

```
┌─────────────┐
│   Payment   │
│  Processed  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Calculate   │
│ 0.1% Fee    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Record Fee │
│  (Unsettled)│
└──────┬──────┘
       │
       ▼
┌─────────────┐     Yes      ┌─────────────┐
│ Accumulated │─────────────▶│   Settle    │
│  Fees ≥ $10?│              │ to Recipient│
└──────┬──────┘              └──────┬──────┘
       │                            │
       │ No                         ▼
       │                     ┌─────────────┐
       │                     │ Mark Settled│
       │                     │   (txHash)  │
       │                     └──────┬──────┘
       │                            │
       └────────────────────────────┘
```

## Troubleshooting

### Settlement Not Running

Check auto-settlement status:

```bash
# Should show isCurrentlySettling: false (unless actively settling)
curl http://localhost:3002/settlement/stats
```

If disabled, enable in .env:
```bash
AUTO_SETTLEMENT=true
```

### Insufficient Funds for Gas

The facilitator wallet needs gas tokens (ETH, etc.) to execute settlements:

```bash
# Check facilitator balance
cast balance $PRIVATE_KEY --rpc-url $ARBITRUM_RPC_URL

# Fund wallet with ~0.1 ETH per network
```

### Settlement Failing

Check logs for errors:

```bash
docker-compose logs -f facilitator | grep settlement
```

Common issues:
- Insufficient gas in facilitator wallet
- RPC endpoint rate limiting
- Network congestion (gas too high)

### Manual Override

Force settlement regardless of batch size:

```bash
# Edit settlement.ts temporarily to skip batch size check
# Or manually call settleNetwork() for each network
```

## Revenue Projections

Based on settlement costs and volume:

| Monthly Volume | Fees Collected | Gas Costs (~) | Net Revenue |
|----------------|----------------|---------------|-------------|
| $100K | $100 | ~$10 | **$90** |
| $1M | $1,000 | ~$50 | **$950** |
| $10M | $10,000 | ~$200 | **$9,800** |
| $100M | $100,000 | ~$500 | **$99,500** |

*Gas costs assume batched settlements every 6-12 hours*

## Security Best Practices

1. **Admin Key Protection**
   - Generate strong random key: `openssl rand -hex 32`
   - Never log or expose in responses
   - Rotate periodically
   - Store in secure secrets manager (AWS Secrets, Vault, etc.)

2. **Fee Recipient Security**
   - Use multisig wallet for large volumes
   - Monitor for unexpected transactions
   - Regular audits of settlement history

3. **Rate Limiting**
   - Apply stricter limits to settlement endpoints
   - Log all settlement attempts with IP tracking
   - Alert on repeated failed auth attempts

4. **Monitoring**
   - Track settlement success rate
   - Alert on accumulation without settlement
   - Monitor gas price spikes
   - Verify txHash for each settlement

## API Reference

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/settlement/pending` | GET | No | View pending fees |
| `/settlement/stats` | GET | No | Settlement statistics |
| `/settlement/history` | GET | No | Past settlements |
| `/settlement/settle-all` | POST | Admin | Settle all pending |
| `/settlement/settle-network` | POST | Admin | Settle one network |

## Support

For issues or questions:
- GitHub Issues: [universal-crypto-mcp/issues](https://github.com/nirholas/universal-crypto-mcp/issues)
- Docs: [x402 Protocol](https://github.com/nirholas/x402)
- Discord: [x402 Community](https://discord.gg/x402)

---

**Next Steps:**
1. Generate admin key: `openssl rand -hex 32`
2. Add to .env: `ADMIN_KEY=...`
3. Monitor pending: `curl /settlement/pending`
4. Test settlement: `curl -X POST /settlement/settle-all`
5. Set up Grafana dashboard for revenue tracking
