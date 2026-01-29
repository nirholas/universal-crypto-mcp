# Security Policy

## Reporting a Vulnerability

We take security seriously at x402-deploy. If you discover a security vulnerability, please report it responsibly.

### How to Report

**DO NOT** open a public GitHub issue for security vulnerabilities.

Instead, please email security concerns to: **security@x402.org**

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Any suggested fixes

### Response Timeline

| Stage | Timeline |
|-------|----------|
| Initial Response | Within 24 hours |
| Issue Assessment | Within 72 hours |
| Fix Development | Within 7 days (critical) / 30 days (moderate) |
| Public Disclosure | After fix is released |

---

## Security Best Practices

### Wallet Security

**Private Key Protection:**
```bash
# NEVER commit private keys
echo "X402_PRIVATE_KEY=*" >> .gitignore

# Use environment variables
export X402_PRIVATE_KEY=your_key_here

# Or use encrypted storage
x402-deploy wallet --encrypt
```

**Wallet Recommendations:**
- Use a dedicated wallet for API earnings
- Regularly withdraw to cold storage
- Enable wallet monitoring alerts
- Consider using a multisig for high-value APIs

### Configuration Security

**Secure your x402.config.json:**
```json
{
  "payment": {
    "wallet": "0x...",
    "facilitator": "https://x402.org/facilitator"
  }
}
```

**Never include in config:**
- Private keys
- API secrets
- Database credentials
- Third-party API keys

### Deployment Security

**Environment Variables:**
```bash
# Required
X402_WALLET=0xYourWallet

# Optional but sensitive - use platform secrets
X402_PRIVATE_KEY=<use platform secret manager>
RAILWAY_TOKEN=<use platform secret manager>
```

**Platform Secret Management:**

| Platform | Secret Management |
|----------|-------------------|
| Railway | Project Variables → Add Variable |
| Fly.io | `fly secrets set KEY=value` |
| Vercel | Project Settings → Environment Variables |

### Payment Verification

Always verify payments properly:

```typescript
// GOOD - Verify via facilitator
const verified = await verifyPayment({
  paymentHeader: req.headers['x-payment'],
  expectedPrice: '$0.01',
  network: 'eip155:8453',
  facilitatorUrl: 'https://x402.org/facilitator'
});

if (!verified.valid) {
  return res.status(402).json({ error: 'Invalid payment' });
}

// BAD - Trusting payment without verification
const payment = JSON.parse(atob(req.headers['x-payment']));
// DON'T DO THIS - No verification!
```

### Rate Limiting

Protect against abuse:

```json
{
  "pricing": {
    "routes": {
      "POST /api/expensive": {
        "price": "$0.10",
        "rateLimit": {
          "requests": 100,
          "window": "1h"
        }
      }
    }
  }
}
```

### Input Validation

Always validate input data:

```typescript
app.post('/api/data', (req, res) => {
  const schema = z.object({
    symbol: z.string().max(10).regex(/^[A-Z]+$/),
    amount: z.number().positive().max(1000000)
  });

  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  // Process validated data
});
```

---

## Known Security Considerations

### Payment Header Tampering

The x402 payment header is cryptographically signed. Tampering is detected during verification. Always use the official verification flow.

### Replay Attacks

Payments include nonces and expiration times. The facilitator tracks used payments to prevent replays.

### Price Manipulation

Prices are defined server-side in `x402.config.json`. Clients cannot change prices - they can only choose whether to pay.

### Network Attacks

- Always use HTTPS in production
- Use trusted RPC providers
- Monitor for unusual activity

---

## Security Checklist

Before deploying to production:

- [ ] Private keys not in source code
- [ ] x402.config.json doesn't contain secrets
- [ ] Using HTTPS
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] Payment verification via facilitator
- [ ] Logging enabled for audit trail
- [ ] Monitoring and alerting set up
- [ ] Regular dependency updates

---

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.x.x | ✅ Active support |
| 0.x.x | ❌ No longer supported |

---

## Security Updates

Security updates are released as patch versions. Keep your installation up to date:

```bash
npm update -g @nirholas/x402-deploy
```

Subscribe to security notifications:
- Watch the GitHub repository
- Follow [@x402protocol](https://twitter.com/x402protocol)

---

## Acknowledgments

We thank security researchers who have responsibly disclosed vulnerabilities:

*(No disclosures yet)*

---

## Contact

- **Security Issues:** security@x402.org
- **General Support:** support@x402.org
- **GitHub:** [github.com/nirholas/universal-crypto-mcp](https://github.com/nirholas/universal-crypto-mcp)
