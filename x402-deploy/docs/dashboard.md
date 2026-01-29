# Dashboard Guide

Real-time earnings tracking and analytics for your monetized APIs.

---

## Quick Start

Launch the interactive dashboard:

```bash
x402-deploy dashboard
```

This opens a beautiful terminal UI showing your earnings in real-time.

---

## Dashboard Views

### Main Dashboard

```
╔══════════════════════════════════════════════════════════════╗
║  💰 x402 Earnings Dashboard                                  ║
║  API: my-trading-api | Network: Base                         ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  📊 Revenue Summary                                          ║
║  ┌────────────────────────────────────────────────────────┐  ║
║  │ Today        $12.45    ████████████████░░░  1,245 calls│  ║
║  │ This Week    $87.32    ████████████████████ 8,732 calls│  ║
║  │ This Month   $342.18   ██████████░░░░░░░░░░ 34,218 calls│ ║
║  │ All Time     $1,547.00                      154,700 calls║ ║
║  └────────────────────────────────────────────────────────┘  ║
║                                                              ║
║  📈 Live Activity (last 5 minutes)                           ║
║  ┌────────────────────────────────────────────────────────┐  ║
║  │ ▁▂▃▄▅▆▇█▇▆▅▄▃▄▅▆▇█▇▆▅▄▃▂▁▂▃▄▅▆▇█▇▆▅▄▃▂▁             │  ║
║  │                                     12 req/s avg       │  ║
║  └────────────────────────────────────────────────────────┘  ║
║                                                              ║
║  🏆 Top Routes                                               ║
║  ┌──────────────────────────┬─────────┬───────────────────┐  ║
║  │ Route                    │ Revenue │ Calls             │  ║
║  ├──────────────────────────┼─────────┼───────────────────┤  ║
║  │ POST /api/generate       │ $8.45   │ 845               │  ║
║  │ GET /api/data            │ $2.12   │ 2,120             │  ║
║  │ POST /api/analyze        │ $1.88   │ 188               │  ║
║  └──────────────────────────┴─────────┴───────────────────┘  ║
║                                                              ║
║  💳 Recent Payments                                          ║
║  ┌────────────────────────────────────────────────────────┐  ║
║  │ 12:45:32  0x7a2d...  $0.10  POST /api/generate        │  ║
║  │ 12:45:28  0x3f1c...  $0.01  GET /api/data             │  ║
║  │ 12:45:21  0x9b4e...  $0.10  POST /api/generate        │  ║
║  │ 12:45:18  0x7a2d...  $0.01  GET /api/data             │  ║
║  └────────────────────────────────────────────────────────┘  ║
║                                                              ║
║  [q] Quit  [r] Refresh  [e] Export  [w] Withdraw             ║
╚══════════════════════════════════════════════════════════════╝
```

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `q` | Quit dashboard |
| `r` | Force refresh |
| `e` | Export data |
| `w` | Withdraw earnings |
| `h` | Toggle help |
| `1` | Summary view |
| `2` | Routes view |
| `3` | Payers view |
| `4` | Timeline view |
| `↑/↓` | Scroll |

---

## Dashboard Commands

### Basic Usage

```bash
# Interactive dashboard
x402-deploy dashboard

# Specific time period
x402-deploy dashboard --days 7
x402-deploy dashboard --days 30

# JSON output (for scripts)
x402-deploy dashboard --json

# Minimal output
x402-deploy dashboard --summary
```

### Time Ranges

```bash
# Today only
x402-deploy dashboard --period today

# Last 7 days
x402-deploy dashboard --period week

# Last 30 days
x402-deploy dashboard --period month

# Custom range
x402-deploy dashboard --from 2024-01-01 --to 2024-01-31
```

### Filtering

```bash
# By route
x402-deploy dashboard --route "/api/generate"

# By payer
x402-deploy dashboard --payer 0x7a2d...

# By minimum amount
x402-deploy dashboard --min-amount 0.10
```

---

## Analytics API

Access analytics programmatically:

### Get Earnings Summary

```typescript
import { getEarningsSummary } from '@nirholas/x402-deploy/dashboard';

const summary = await getEarningsSummary({
  period: 'today',
  wallet: '0x...'
});

console.log(summary);
// {
//   totalRevenue: "12.45",
//   totalCalls: 1245,
//   uniquePayers: 42,
//   averagePerCall: "0.01",
//   topRoutes: [
//     { route: "POST /api/generate", revenue: "8.45", calls: 845 },
//     { route: "GET /api/data", revenue: "2.12", calls: 2120 }
//   ]
// }
```

### Get Payment History

```typescript
import { getPaymentHistory } from '@nirholas/x402-deploy/dashboard';

const payments = await getPaymentHistory({
  limit: 100,
  offset: 0,
  from: new Date('2024-01-01'),
  to: new Date()
});

for (const payment of payments) {
  console.log(`${payment.timestamp} - ${payment.from} paid ${payment.amount} for ${payment.route}`);
}
```

### Real-Time Stream

```typescript
import { streamPayments } from '@nirholas/x402-deploy/dashboard';

const stream = streamPayments({
  wallet: '0x...'
});

stream.on('payment', (payment) => {
  console.log(`New payment: ${payment.amount} from ${payment.from}`);
});

stream.on('error', (error) => {
  console.error('Stream error:', error);
});
```

---

## Webhooks

Get notified of payments in real-time.

### Configuration

```json
{
  "dashboard": {
    "webhooks": [
      {
        "url": "https://myapp.com/webhook/payments",
        "events": ["payment.received", "payment.failed"],
        "secret": "whsec_xxx"
      },
      {
        "url": "https://slack.com/webhook/xxx",
        "events": ["payment.received"],
        "format": "slack"
      }
    ]
  }
}
```

### Webhook Payload

```json
{
  "event": "payment.received",
  "timestamp": "2024-01-15T12:45:32Z",
  "data": {
    "id": "pay_abc123",
    "amount": "0.10",
    "token": "USDC",
    "from": "0x7a2d35Cc6634C0532925a3b844Bc9e7595f0bEb1",
    "to": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1",
    "route": "POST /api/generate",
    "method": "POST",
    "network": "eip155:8453",
    "txHash": "0xabc..."
  },
  "signature": "sha256=xxx"
}
```

### Verifying Webhooks

```typescript
import crypto from 'crypto';

function verifyWebhook(payload: string, signature: string, secret: string): boolean {
  const expected = `sha256=${crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex')}`;
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  );
}

// Express endpoint
app.post('/webhook/payments', (req, res) => {
  const signature = req.headers['x-webhook-signature'] as string;
  const payload = JSON.stringify(req.body);
  
  if (!verifyWebhook(payload, signature, 'whsec_xxx')) {
    return res.status(401).send('Invalid signature');
  }
  
  const { event, data } = req.body;
  
  if (event === 'payment.received') {
    console.log(`Received ${data.amount} USDC from ${data.from}`);
    // Update your database, send notification, etc.
  }
  
  res.status(200).send('OK');
});
```

---

## Export Data

Export analytics for reporting or analysis.

### CSV Export

```bash
# Export all time
x402-deploy export --csv

# Export specific period
x402-deploy export --csv --days 30

# Export to specific file
x402-deploy export --csv --output earnings-january.csv
```

**Sample CSV Output:**

```csv
timestamp,from,to,amount,token,route,method,network,txHash
2024-01-15T12:45:32Z,0x7a2d...,0x742d...,0.10,USDC,POST /api/generate,POST,eip155:8453,0xabc...
2024-01-15T12:45:28Z,0x3f1c...,0x742d...,0.01,USDC,GET /api/data,GET,eip155:8453,0xdef...
```

### JSON Export

```bash
x402-deploy export --json
x402-deploy export --json --pretty
```

### Programmatic Export

```typescript
import { exportAnalytics } from '@nirholas/x402-deploy/dashboard';

const data = await exportAnalytics({
  format: 'json',
  period: { days: 30 },
  includeMetadata: true
});

// Save to file
fs.writeFileSync('analytics.json', JSON.stringify(data, null, 2));
```

---

## Withdraw Earnings

Transfer accumulated earnings to your wallet.

### Check Balance

```bash
x402-deploy withdraw --balance
```

Output:
```
💰 Earnings Balance
───────────────────
Available:  $1,234.56 USDC
Pending:    $12.45 USDC (confirming)
Total:      $1,247.01 USDC

Wallet: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1
Network: Base (eip155:8453)
```

### Withdraw

```bash
# Withdraw all available
x402-deploy withdraw

# Withdraw specific amount
x402-deploy withdraw --amount 100

# Withdraw to different address
x402-deploy withdraw --to 0xAnotherWallet...

# Dry run (estimate gas)
x402-deploy withdraw --dry-run
```

### Automatic Withdrawals

Configure automatic withdrawals in your config:

```json
{
  "dashboard": {
    "autoWithdraw": {
      "enabled": true,
      "threshold": "$100",
      "destination": "0x...",
      "schedule": "weekly"
    }
  }
}
```

---

## Alerts & Notifications

Set up alerts for important events.

### Configuration

```json
{
  "dashboard": {
    "alerts": [
      {
        "type": "revenue_milestone",
        "threshold": "$100",
        "channel": "email",
        "email": "you@example.com"
      },
      {
        "type": "high_volume",
        "threshold": "1000 calls/hour",
        "channel": "slack",
        "webhook": "https://hooks.slack.com/..."
      },
      {
        "type": "error_rate",
        "threshold": "5%",
        "channel": "webhook",
        "url": "https://myapp.com/alerts"
      }
    ]
  }
}
```

### Alert Types

| Type | Description |
|------|-------------|
| `revenue_milestone` | Total revenue reaches threshold |
| `daily_revenue` | Daily revenue reaches threshold |
| `high_volume` | Request rate exceeds threshold |
| `error_rate` | Error rate exceeds threshold |
| `new_payer` | First payment from new address |
| `large_payment` | Single payment exceeds threshold |

---

## Dashboard Customization

### Theme

```bash
# Use dark theme (default)
x402-deploy dashboard --theme dark

# Use light theme
x402-deploy dashboard --theme light

# Use minimal theme
x402-deploy dashboard --theme minimal
```

### Refresh Rate

```bash
# Refresh every 5 seconds (default)
x402-deploy dashboard --refresh 5

# Refresh every second
x402-deploy dashboard --refresh 1

# Manual refresh only
x402-deploy dashboard --refresh 0
```

### Layout

```bash
# Full dashboard
x402-deploy dashboard --layout full

# Compact view
x402-deploy dashboard --layout compact

# Focus on specific metric
x402-deploy dashboard --focus revenue
x402-deploy dashboard --focus routes
x402-deploy dashboard --focus payers
```

---

## Integration Examples

### Grafana Integration

Export metrics in Prometheus format:

```bash
x402-deploy metrics --prometheus
```

Configure in Grafana:
```yaml
scrape_configs:
  - job_name: 'x402-api'
    static_configs:
      - targets: ['localhost:9090']
```

### Slack Integration

```json
{
  "dashboard": {
    "webhooks": [
      {
        "url": "https://hooks.slack.com/services/xxx",
        "events": ["payment.received"],
        "format": "slack",
        "minAmount": "$1.00"
      }
    ]
  }
}
```

### Discord Integration

```json
{
  "dashboard": {
    "webhooks": [
      {
        "url": "https://discord.com/api/webhooks/xxx",
        "events": ["payment.received"],
        "format": "discord"
      }
    ]
  }
}
```

---

## Troubleshooting

### No Data Showing

1. Check if analytics is enabled:
```bash
x402-deploy status --analytics
```

2. Verify deployment is receiving requests:
```bash
x402-deploy logs -f
```

3. Check network connectivity:
```bash
x402-deploy dashboard --debug
```

### Webhook Not Firing

1. Test webhook manually:
```bash
x402-deploy webhook --test
```

2. Check webhook logs:
```bash
x402-deploy logs --filter webhook
```

### Slow Dashboard

1. Reduce time range:
```bash
x402-deploy dashboard --days 7
```

2. Disable real-time updates:
```bash
x402-deploy dashboard --refresh 0
```

---

## Next Steps

- [API Reference](api.md) - Programmatic access
- [Configuration](configuration.md) - Full config options
- [Pricing Strategies](pricing.md) - Optimize your pricing

---

[← Back to Docs](../README.md)
