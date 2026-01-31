---
title: "x402 Python SDK"
description: "x402 payment protocol implementation for Python applications"
category: "x402"
keywords: ["x402", "python", "fastapi", "flask", "payments"]
order: 1
---

# x402 Python SDK

The x402 Python SDK brings HTTP 402 payments to Python applications. It provides middleware for popular frameworks like FastAPI and Flask.

## Installation

```bash
pip install x402
# or
poetry add x402
```

## Quick Start

### FastAPI Server

```python
from fastapi import FastAPI
from x402 import PaymentMiddleware, PaymentRoute

app = FastAPI()

# Define payment routes
routes = {
    "GET /api/premium": PaymentRoute(
        scheme="exact",
        network="eip155:8453",
        pay_to="0xYourAddress",
        price="$0.01",
        description="Premium API access",
    ),
}

# Add middleware
app.add_middleware(
    PaymentMiddleware,
    facilitator_url="https://x402.org/facilitator",
    routes=routes,
)

@app.get("/api/premium")
async def premium_endpoint():
    return {"data": "Premium content!"}
```

### Flask Server

```python
from flask import Flask
from x402.flask import payment_required

app = Flask(__name__)

@app.route("/api/premium")
@payment_required(
    facilitator_url="https://x402.org/facilitator",
    scheme="exact",
    network="eip155:8453",
    pay_to="0xYourAddress",
    price="$0.01",
)
def premium_endpoint():
    return {"data": "Premium content!"}
```

## Client Usage

### With httpx

```python
from x402.client import X402Client
from x402.mechanisms.evm import ExactEvmScheme
import httpx

# Create client with EVM support
client = X402Client()
client.register("eip155:*", ExactEvmScheme(private_key="0x..."))

# Make request
async with httpx.AsyncClient() as http:
    response = await http.get("https://api.example.com/premium")
    
    if response.status_code == 402:
        # Parse payment requirements
        payment_required = client.parse_402_response(response)
        
        # Create payment
        payment = await client.create_payment(payment_required)
        
        # Retry with payment
        response = await http.get(
            "https://api.example.com/premium",
            headers=client.encode_payment_header(payment),
        )
        
        print(response.json())
```

### With requests

```python
from x402.client import X402Client
from x402.mechanisms.evm import ExactEvmScheme
import requests

client = X402Client()
client.register("eip155:*", ExactEvmScheme(private_key="0x..."))

response = requests.get("https://api.example.com/premium")

if response.status_code == 402:
    payment_required = client.parse_402_response(response)
    payment = client.create_payment_sync(payment_required)
    
    response = requests.get(
        "https://api.example.com/premium",
        headers=client.encode_payment_header(payment),
    )
```

## Configuration

### Environment Variables

```bash
export X402_FACILITATOR_URL=https://x402.org/facilitator
export X402_PAYMENT_ADDRESS=0xYourAddress
export X402_PRIVATE_KEY=0x...  # For client
```

### Programmatic Configuration

```python
from x402 import X402Config

config = X402Config(
    facilitator_url="https://x402.org/facilitator",
    default_network="eip155:8453",
    timeout=30,
)
```

## FastAPI Integration

### Dependency Injection

```python
from fastapi import FastAPI, Depends
from x402.fastapi import get_payment_info, PaymentInfo

app = FastAPI()

@app.get("/api/premium")
async def premium_endpoint(payment: PaymentInfo = Depends(get_payment_info)):
    return {
        "data": "Premium content!",
        "paid_by": payment.payer,
        "amount": str(payment.amount),
    }
```

### Dynamic Pricing

```python
from fastapi import FastAPI, Request
from x402 import PaymentMiddleware, PaymentRoute

async def calculate_price(request: Request) -> str:
    body = await request.json()
    tokens = body.get("max_tokens", 100)
    return f"${tokens * 0.0001:.4f}"

routes = {
    "POST /api/generate": PaymentRoute(
        scheme="exact",
        network="eip155:8453",
        pay_to="0xYourAddress",
        price=calculate_price,
    ),
}
```

### Multiple Payment Options

```python
routes = {
    "GET /api/data": PaymentRoute(
        accepts=[
            {
                "scheme": "exact",
                "network": "eip155:8453",
                "pay_to": "0xEvmAddress",
                "price": "$0.01",
            },
            {
                "scheme": "exact",
                "network": "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp",
                "pay_to": "SolanaAddress...",
                "price": "$0.01",
            },
        ],
    ),
}
```

## Flask Integration

### Blueprint Support

```python
from flask import Blueprint
from x402.flask import PaymentBlueprint

api = PaymentBlueprint(
    "api",
    __name__,
    facilitator_url="https://x402.org/facilitator",
)

@api.route("/premium")
@api.payment_required(
    scheme="exact",
    network="eip155:8453",
    pay_to="0xYourAddress",
    price="$0.01",
)
def premium():
    return {"data": "Premium!"}
```

## Error Handling

```python
from x402.exceptions import (
    X402Error,
    PaymentRequiredError,
    InsufficientFundsError,
    PaymentVerificationError,
)

try:
    payment = await client.create_payment(payment_required)
except InsufficientFundsError as e:
    print(f"Need {e.required}, have {e.available}")
except PaymentVerificationError as e:
    print(f"Payment invalid: {e.message}")
except X402Error as e:
    print(f"x402 error: {e}")
```

## Type Hints

The SDK is fully typed for better IDE support:

```python
from x402.types import PaymentRequired, PaymentPayload, SettleResult

def process_payment(
    required: PaymentRequired,
) -> PaymentPayload:
    ...
```

## Testing

### Mock Server

```python
from x402.testing import MockFacilitator

@pytest.fixture
def facilitator():
    return MockFacilitator()

async def test_payment(facilitator):
    # Payments are auto-approved in test mode
    response = await client.get("/api/premium")
    assert response.status_code == 200
```

### Test Client

```python
from x402.testing import TestX402Client

client = TestX402Client()  # Auto-approves all payments
```

## See Also

- [FastAPI Adapter](./adapters/fastapi.md)
- [Flask Adapter](./adapters/flask.md)
- [TypeScript SDK](../typescript/overview.md)
