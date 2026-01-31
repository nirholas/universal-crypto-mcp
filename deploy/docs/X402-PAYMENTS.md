# x402 Payment Integration Guide

Complete guide to integrating x402 payment verification into the Universal Crypto Gateway.

## Overview

The x402 protocol enables paid API access by verifying cryptocurrency payments before granting access to endpoints. The gateway supports:

- **Free Tier**: Rate-limited public endpoints
- **Paid Tier**: Full access with payment verification
- **Lightning Network**: Instant micropayments
- **EVM Chains**: ETH, USDC, USDT payments on multiple networks

## Architecture

```
┌──────────────┐
│   Client     │
│              │
│ 1. Request   │
│    + Payment │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────────────┐
│        Express Middleware            │
│                                      │
│  ┌────────────────────────────────┐ │
│  │   x402VerificationMiddleware   │ │
│  │                                │ │
│  │  • Parse payment header        │ │
│  │  • Verify signature            │ │
│  │  • Check on-chain status       │ │
│  │  • Validate amount             │ │
│  └────────────┬───────────────────┘ │
└───────────────┼──────────────────────┘
                │
                │ Payment Valid?
                │
       ┌────────┴────────┐
       │                 │
      NO                YES
       │                 │
       ▼                 ▼
  ┌────────┐      ┌──────────────┐
  │ 402    │      │  Continue to │
  │ Payment│      │  Endpoint    │
  │ Required│     │  Handler     │
  └────────┘      └──────────────┘
```

## Payment Flow

### 1. Client Makes Paid Request

```typescript
const payment = {
  txHash: '0x123...', // Transaction hash
  network: 'polygon', // Network where payment was made
  from: '0xabc...',   // Payer address
  amount: '1000000',  // Amount in wei/smallest unit
  token: 'USDC',      // Token used (ETH, USDC, USDT)
  timestamp: Date.now()
};

// Sign the payment
const signature = await wallet.signMessage(
  JSON.stringify(payment)
);

// Make request with payment proof
const response = await fetch('https://gateway.example.com/api/v1/defi/aave/markets', {
  headers: {
    'X-Payment-Proof': JSON.stringify({
      ...payment,
      signature
    })
  }
});
```

### 2. Gateway Verifies Payment

```typescript
// In x402VerificationMiddleware
const paymentProof = JSON.parse(req.headers['x-payment-proof']);

// 1. Verify signature
const signer = verifySignature(paymentProof);

// 2. Check transaction on-chain
const tx = await provider.getTransaction(paymentProof.txHash);

// 3. Validate payment details
if (tx.to !== GATEWAY_ADDRESS) {
  throw new Error('Payment sent to wrong address');
}

if (BigInt(tx.value) < requiredAmount) {
  throw new Error('Insufficient payment');
}

// 4. Check if already used (prevent replay)
if (await redis.get(`payment:${paymentProof.txHash}`)) {
  throw new Error('Payment already used');
}

// 5. Mark as used
await redis.set(`payment:${paymentProof.txHash}`, '1', 'EX', 86400);

// 6. Grant access
req.paymentVerified = true;
next();
```

## Implementation

### Environment Variables

```bash
# .env
X402_ENABLED=true
X402_GATEWAY_ADDRESS=0x1234567890123456789012345678901234567890

# Supported networks
X402_NETWORKS=mainnet,polygon,arbitrum,optimism,base

# Accepted tokens
X402_TOKENS=ETH,USDC,USDT

# Pricing (USD)
X402_PRICE_PER_REQUEST=0.001
X402_PRICE_PER_MONTH=10.00

# Provider URLs
RPC_MAINNET=https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY
RPC_POLYGON=https://polygon-mainnet.g.alchemy.com/v2/YOUR_KEY
RPC_ARBITRUM=https://arb-mainnet.g.alchemy.com/v2/YOUR_KEY
RPC_OPTIMISM=https://opt-mainnet.g.alchemy.com/v2/YOUR_KEY
RPC_BASE=https://base-mainnet.g.alchemy.com/v2/YOUR_KEY

# Redis for payment tracking
REDIS_URL=redis://localhost:6379
```

### Middleware Configuration

```typescript
// deploy/src/gateway/index.ts
import { x402VerificationMiddleware } from './middleware/x402.js';

class UniversalCryptoGateway {
  constructor() {
    this.app = express();
    
    // Apply x402 to all /api/v1 routes
    this.app.use('/api/v1', x402VerificationMiddleware);
    
    // Or apply to specific endpoints
    this.app.get(
      '/api/v1/defi/aave/markets',
      x402VerificationMiddleware,
      this.handleAaveMarkets
    );
  }
}
```

### Middleware Implementation

```typescript
// deploy/src/gateway/middleware/x402.ts
import { Request, Response, NextFunction } from 'express';
import { ethers } from 'ethers';
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

// Provider cache
const providers = new Map<string, ethers.JsonRpcProvider>();

function getProvider(network: string): ethers.JsonRpcProvider {
  if (!providers.has(network)) {
    const url = process.env[`RPC_${network.toUpperCase()}`];
    providers.set(network, new ethers.JsonRpcProvider(url));
  }
  return providers.get(network)!;
}

interface PaymentProof {
  txHash: string;
  network: string;
  from: string;
  amount: string;
  token: string;
  timestamp: number;
  signature: string;
}

export async function x402VerificationMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // Check if endpoint is free tier
    if (isFreeEndpoint(req.path)) {
      return next();
    }

    // Get payment proof from header
    const proofHeader = req.headers['x-payment-proof'] as string;
    
    if (!proofHeader) {
      return res.status(402).json({
        error: 'Payment Required',
        message: 'This endpoint requires payment',
        pricing: {
          perRequest: parseFloat(process.env.X402_PRICE_PER_REQUEST || '0.001'),
          perMonth: parseFloat(process.env.X402_PRICE_PER_MONTH || '10.00')
        },
        acceptedTokens: ['ETH', 'USDC', 'USDT'],
        networks: ['mainnet', 'polygon', 'arbitrum', 'optimism', 'base'],
        gatewayAddress: process.env.X402_GATEWAY_ADDRESS
      });
    }

    const proof: PaymentProof = JSON.parse(proofHeader);

    // Verify signature
    const message = JSON.stringify({
      txHash: proof.txHash,
      network: proof.network,
      from: proof.from,
      amount: proof.amount,
      token: proof.token,
      timestamp: proof.timestamp
    });
    
    const signer = ethers.verifyMessage(message, proof.signature);
    
    if (signer.toLowerCase() !== proof.from.toLowerCase()) {
      return res.status(401).json({
        error: 'Invalid signature',
        message: 'Payment proof signature does not match sender'
      });
    }

    // Check timestamp (prevent old payments)
    const age = Date.now() - proof.timestamp;
    if (age > 300000) { // 5 minutes
      return res.status(401).json({
        error: 'Payment proof expired',
        message: 'Payment proof must be less than 5 minutes old'
      });
    }

    // Check if payment already used
    const paymentKey = `payment:${proof.txHash}`;
    const used = await redis.get(paymentKey);
    
    if (used) {
      return res.status(401).json({
        error: 'Payment already used',
        message: 'This payment has already been used'
      });
    }

    // Verify transaction on-chain
    const provider = getProvider(proof.network);
    const tx = await provider.getTransaction(proof.txHash);

    if (!tx) {
      return res.status(401).json({
        error: 'Transaction not found',
        message: 'Payment transaction not found on-chain'
      });
    }

    // Verify recipient
    if (tx.to?.toLowerCase() !== process.env.X402_GATEWAY_ADDRESS?.toLowerCase()) {
      return res.status(401).json({
        error: 'Invalid recipient',
        message: 'Payment sent to wrong address'
      });
    }

    // Verify sender
    if (tx.from.toLowerCase() !== proof.from.toLowerCase()) {
      return res.status(401).json({
        error: 'Sender mismatch',
        message: 'Transaction sender does not match proof'
      });
    }

    // Verify amount (for ETH payments)
    if (proof.token === 'ETH') {
      const requiredAmount = ethers.parseEther(
        process.env.X402_PRICE_PER_REQUEST || '0.001'
      );
      
      if (tx.value < requiredAmount) {
        return res.status(401).json({
          error: 'Insufficient payment',
          message: `Required: ${ethers.formatEther(requiredAmount)} ETH`
        });
      }
    } else {
      // For ERC20 tokens, decode transfer data
      const iface = new ethers.Interface([
        'function transfer(address to, uint256 amount)'
      ]);
      
      const decoded = iface.parseTransaction({ data: tx.data });
      
      if (!decoded) {
        return res.status(401).json({
          error: 'Invalid transaction',
          message: 'Could not decode token transfer'
        });
      }

      // Verify token amount
      const requiredAmount = getRequiredTokenAmount(proof.token);
      
      if (decoded.args[1] < requiredAmount) {
        return res.status(401).json({
          error: 'Insufficient payment',
          message: `Required: ${requiredAmount} ${proof.token}`
        });
      }
    }

    // Mark payment as used (24 hour expiry)
    await redis.set(paymentKey, '1', 'EX', 86400);

    // Add payment info to request
    req.payment = {
      verified: true,
      txHash: proof.txHash,
      from: proof.from,
      amount: proof.amount,
      token: proof.token,
      network: proof.network
    };

    next();
  } catch (error) {
    console.error('x402 verification error:', error);
    return res.status(500).json({
      error: 'Payment verification failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

function isFreeEndpoint(path: string): boolean {
  const freePaths = [
    '/api/v1/health',
    '/api/v1/status',
    '/api/v1/mcp-servers',
    '/api/v1/prices/btc', // Limited free tier
    '/api/v1/prices/eth'
  ];
  
  return freePaths.some(p => path.startsWith(p));
}

function getRequiredTokenAmount(token: string): bigint {
  const priceUSD = parseFloat(process.env.X402_PRICE_PER_REQUEST || '0.001');
  
  // Token decimals
  const decimals: Record<string, number> = {
    'USDC': 6,
    'USDT': 6,
    'DAI': 18
  };
  
  const dec = decimals[token] || 18;
  return BigInt(Math.floor(priceUSD * 10 ** dec));
}
```

## Client Integration

### JavaScript/TypeScript

```typescript
import { ethers } from 'ethers';

class GatewayClient {
  private wallet: ethers.Wallet;
  private gatewayUrl: string;
  
  constructor(privateKey: string, gatewayUrl: string) {
    this.wallet = new ethers.Wallet(privateKey);
    this.gatewayUrl = gatewayUrl;
  }
  
  async makePayment(network: string, token: string): Promise<string> {
    const provider = new ethers.JsonRpcProvider(
      process.env[`RPC_${network.toUpperCase()}`]
    );
    
    const wallet = this.wallet.connect(provider);
    
    // ETH payment
    if (token === 'ETH') {
      const tx = await wallet.sendTransaction({
        to: process.env.X402_GATEWAY_ADDRESS,
        value: ethers.parseEther('0.001')
      });
      
      await tx.wait();
      return tx.hash;
    }
    
    // ERC20 payment
    const tokenAddresses: Record<string, string> = {
      'USDC': '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      'USDT': '0xdAC17F958D2ee523a2206206994597C13D831ec7'
    };
    
    const tokenContract = new ethers.Contract(
      tokenAddresses[token],
      ['function transfer(address to, uint256 amount)'],
      wallet
    );
    
    const tx = await tokenContract.transfer(
      process.env.X402_GATEWAY_ADDRESS,
      1000000 // 1 USDC/USDT
    );
    
    await tx.wait();
    return tx.hash;
  }
  
  async callPaidEndpoint(
    endpoint: string,
    paymentTxHash: string,
    network: string,
    token: string
  ): Promise<any> {
    // Create payment proof
    const proof = {
      txHash: paymentTxHash,
      network,
      from: this.wallet.address,
      amount: token === 'ETH' ? '1000000000000000' : '1000000',
      token,
      timestamp: Date.now()
    };
    
    // Sign proof
    const signature = await this.wallet.signMessage(
      JSON.stringify(proof)
    );
    
    // Make request
    const response = await fetch(`${this.gatewayUrl}${endpoint}`, {
      headers: {
        'X-Payment-Proof': JSON.stringify({
          ...proof,
          signature
        })
      }
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }
    
    return response.json();
  }
  
  // Convenience method
  async payAndCall(
    endpoint: string,
    network: string = 'polygon',
    token: string = 'USDC'
  ): Promise<any> {
    // Make payment
    const txHash = await this.makePayment(network, token);
    
    // Wait for confirmations
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Call endpoint
    return this.callPaidEndpoint(endpoint, txHash, network, token);
  }
}

// Usage
const client = new GatewayClient(
  process.env.PRIVATE_KEY!,
  'https://gateway.example.com'
);

// Get Aave markets with payment
const markets = await client.payAndCall('/api/v1/defi/aave/markets');
console.log(markets);
```

### Python

```python
from web3 import Web3
from eth_account import Account
from eth_account.messages import encode_defunct
import requests
import json
import time

class GatewayClient:
    def __init__(self, private_key: str, gateway_url: str):
        self.account = Account.from_key(private_key)
        self.gateway_url = gateway_url
    
    def make_payment(self, network: str, token: str) -> str:
        w3 = Web3(Web3.HTTPProvider(os.getenv(f'RPC_{network.upper()}')))
        
        # ETH payment
        if token == 'ETH':
            tx = {
                'to': os.getenv('X402_GATEWAY_ADDRESS'),
                'value': w3.to_wei(0.001, 'ether'),
                'gas': 21000,
                'gasPrice': w3.eth.gas_price,
                'nonce': w3.eth.get_transaction_count(self.account.address)
            }
            
            signed = self.account.sign_transaction(tx)
            tx_hash = w3.eth.send_raw_transaction(signed.rawTransaction)
            
            # Wait for confirmation
            w3.eth.wait_for_transaction_receipt(tx_hash)
            return tx_hash.hex()
        
        # ERC20 payment
        # ... similar to ETH but with contract interaction
    
    def call_paid_endpoint(self, endpoint: str, payment_tx_hash: str, 
                          network: str, token: str) -> dict:
        # Create proof
        proof = {
            'txHash': payment_tx_hash,
            'network': network,
            'from': self.account.address,
            'amount': '1000000000000000' if token == 'ETH' else '1000000',
            'token': token,
            'timestamp': int(time.time() * 1000)
        }
        
        # Sign proof
        message = encode_defunct(text=json.dumps(proof))
        signature = self.account.sign_message(message).signature.hex()
        
        # Make request
        headers = {
            'X-Payment-Proof': json.dumps({
                **proof,
                'signature': signature
            })
        }
        
        response = requests.get(f'{self.gateway_url}{endpoint}', headers=headers)
        response.raise_for_status()
        
        return response.json()
    
    def pay_and_call(self, endpoint: str, network: str = 'polygon', 
                     token: str = 'USDC') -> dict:
        # Make payment
        tx_hash = self.make_payment(network, token)
        
        # Wait for confirmations
        time.sleep(5)
        
        # Call endpoint
        return self.call_paid_endpoint(endpoint, tx_hash, network, token)

# Usage
client = GatewayClient(
    os.getenv('PRIVATE_KEY'),
    'https://gateway.example.com'
)

markets = client.pay_and_call('/api/v1/defi/aave/markets')
print(markets)
```

## Subscription Model

For high-volume users, support monthly subscriptions:

```typescript
// Monthly subscription contract
contract GatewaySubscription {
  mapping(address => uint256) public subscriptions;
  
  function subscribe(uint256 months) external payable {
    require(msg.value >= 0.01 ether * months);
    subscriptions[msg.sender] = block.timestamp + (months * 30 days);
  }
  
  function isActive(address user) external view returns (bool) {
    return subscriptions[user] > block.timestamp;
  }
}

// Middleware check
async function checkSubscription(address: string): Promise<boolean> {
  const contract = new ethers.Contract(
    SUBSCRIPTION_CONTRACT_ADDRESS,
    ['function isActive(address) view returns (bool)'],
    provider
  );
  
  return await contract.isActive(address);
}
```

## Lightning Network Integration

For instant micropayments:

```typescript
import * as lnservice from 'ln-service';

async function createInvoice(amountSats: number): Promise<string> {
  const { lnd } = lnservice.authenticatedLndGrpc({
    cert: process.env.LND_CERT,
    macaroon: process.env.LND_MACAROON,
    socket: process.env.LND_SOCKET
  });
  
  const invoice = await lnservice.createInvoice({
    lnd,
    tokens: amountSats,
    description: 'Gateway API access'
  });
  
  return invoice.request;
}

async function verifyInvoice(paymentHash: string): Promise<boolean> {
  const { lnd } = lnservice.authenticatedLndGrpc({
    cert: process.env.LND_CERT,
    macaroon: process.env.LND_MACAROON,
    socket: process.env.LND_SOCKET
  });
  
  const invoice = await lnservice.getInvoice({
    lnd,
    id: paymentHash
  });
  
  return invoice.is_confirmed;
}
```

## Rate Limiting

Combine with rate limiting for tiered access:

```typescript
// Free tier: 10 req/min
// Paid (per-request): 100 req/min
// Subscription: Unlimited

const rateLimits = {
  free: rateLimit({
    windowMs: 60 * 1000,
    max: 10
  }),
  paid: rateLimit({
    windowMs: 60 * 1000,
    max: 100
  }),
  subscription: rateLimit({
    windowMs: 60 * 1000,
    max: 1000
  })
};

app.use((req, res, next) => {
  if (req.payment?.subscription) {
    return rateLimits.subscription(req, res, next);
  } else if (req.payment?.verified) {
    return rateLimits.paid(req, res, next);
  } else {
    return rateLimits.free(req, res, next);
  }
});
```

## Security Best Practices

1. **Payment Replay Prevention**: Store used tx hashes in Redis with 24h TTL
2. **Signature Verification**: Always verify payment proof signatures
3. **On-Chain Verification**: Check actual transactions, don't trust client data
4. **Rate Limiting**: Apply limits even for paid tier
5. **Payment Expiry**: Reject old payment proofs (>5 min)
6. **Network Validation**: Only accept payments on supported networks
7. **Amount Validation**: Verify minimum payment amounts
8. **Token Whitelist**: Only accept whitelisted tokens

## Monitoring

Track payment metrics:

```typescript
// Prometheus metrics
const paymentCounter = new Counter({
  name: 'gateway_payments_total',
  help: 'Total payments received',
  labelNames: ['network', 'token', 'status']
});

const revenueGauge = new Gauge({
  name: 'gateway_revenue_usd',
  help: 'Total revenue in USD'
});

// Track in middleware
paymentCounter.inc({ network: 'polygon', token: 'USDC', status: 'success' });
revenueGauge.inc(0.001);
```

## Testing

```typescript
describe('x402 Payment Verification', () => {
  it('should accept valid payment', async () => {
    const tx = await wallet.sendTransaction({
      to: GATEWAY_ADDRESS,
      value: ethers.parseEther('0.001')
    });
    await tx.wait();
    
    const response = await request(app)
      .get('/api/v1/defi/aave/markets')
      .set('X-Payment-Proof', createPaymentProof(tx.hash));
    
    expect(response.status).toBe(200);
  });
  
  it('should reject insufficient payment', async () => {
    const tx = await wallet.sendTransaction({
      to: GATEWAY_ADDRESS,
      value: ethers.parseEther('0.0001') // Too low
    });
    await tx.wait();
    
    const response = await request(app)
      .get('/api/v1/defi/aave/markets')
      .set('X-Payment-Proof', createPaymentProof(tx.hash));
    
    expect(response.status).toBe(401);
  });
});
```

