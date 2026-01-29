# Translation API with x402 Subscriptions

FastAPI translation service with subscription-based cryptocurrency payments.

## 💰 Subscription Plans

| Plan | Price | Translations/Month | Best For |
|------|-------|-------------------|----------|
| **Free** | $0 | 10 | Testing |
| **Basic** | $10 USDC | 1,000 | Small projects |
| **Pro** | $50 USDC | Unlimited | Production apps |

Payments in **USDC on Base network** (eip155:8453).

## 🚀 Quick Start

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Configure Wallet

```bash
export X402_WALLET=0xYourWalletAddress
```

### 3. Run

```bash
# Development
uvicorn main:app --reload --port 8000

# Production
python main.py
```

### 4. Deploy

```bash
npx x402-deploy deploy railway
```

## 📡 API Endpoints

### POST `/api/translate`

Translate text between languages.

**Request:**
```bash
curl -X POST "http://localhost:8000/api/translate" \
  -H "Content-Type: application/json" \
  -H "X-Subscription-Id: basic_xxx..." \
  -d '{
    "text": "Hello, world!",
    "from_lang": "en",
    "to_lang": "es"
  }'
```

**Response:**
```json
{
  "original": "Hello, world!",
  "translated": "[ES] Hello, world!",
  "from_lang": "en",
  "to_lang": "es",
  "timestamp": "2026-01-29T10:30:00.000Z",
  "subscription_tier": "basic"
}
```

### GET `/api/languages`

Get supported languages (free).

```bash
curl "http://localhost:8000/api/languages"
```

### GET `/api/subscription/status`

Check your subscription status and usage.

```bash
curl "http://localhost:8000/api/subscription/status" \
  -H "X-Subscription-Id: basic_xxx..."
```

**Response:**
```json
{
  "tier": "basic",
  "usage": {
    "used": 324,
    "limit": 1000
  },
  "expires": "2026-02-28T23:59:59Z"
}
```

### POST `/api/subscription/subscribe`

Subscribe to a plan.

**Request:**
```bash
curl -X POST "http://localhost:8000/api/subscription/subscribe?tier=basic" \
  -H "X-Payment-Hash: 0xtransactionhash"
```

**Response:**
```json
{
  "success": true,
  "subscription_id": "basic_0x1234567890abcdef",
  "tier": "basic",
  "price": "$10 USDC",
  "duration": "30 days",
  "expires": "2026-02-28T23:59:59Z",
  "instructions": "Include 'X-Subscription-Id: basic_xxx...' in requests"
}
```

## 💳 Subscribing

### 1. Choose a Plan

- **Basic**: $10/month, 1000 translations
- **Pro**: $50/month, unlimited

### 2. Send USDC Payment

Send USDC on Base network:
- **To**: Your API wallet address
- **Amount**: 10 USDC (Basic) or 50 USDC (Pro)
- **Network**: Base (Chain ID: 8453)

### 3. Subscribe with Transaction Hash

```bash
curl -X POST "http://localhost:8000/api/subscription/subscribe?tier=basic" \
  -H "X-Payment-Hash: 0xyourtransactionhash"
```

### 4. Use Subscription ID

Include the subscription ID in all requests:

```bash
curl -X POST "http://localhost:8000/api/translate" \
  -H "X-Subscription-Id: basic_xxx..." \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello", "from_lang": "en", "to_lang": "es"}'
```

## 🧪 Testing

### Test Mode

Free tier allows 10 translations without payment:

```bash
curl -X POST "http://localhost:8000/api/translate" \
  -H "Content-Type: application/json" \
  -d '{"text": "Test", "from_lang": "en", "to_lang": "es"}'
```

### Interactive Docs

FastAPI provides automatic documentation:

```bash
open http://localhost:8000/docs
```

## 🌐 Real Translation

Integrate real translation services:

### Google Translate

```bash
pip install googletrans==4.0.0rc1
```

```python
from googletrans import Translator

translator = Translator()

def translate_text(text: str, from_lang: str, to_lang: str) -> str:
    result = translator.translate(text, src=from_lang, dest=to_lang)
    return result.text
```

### DeepL (Recommended)

```bash
pip install deepl
```

```python
import deepl

translator = deepl.Translator(os.getenv("DEEPL_API_KEY"))

def translate_text(text: str, from_lang: str, to_lang: str) -> str:
    result = translator.translate_text(text, source_lang=from_lang.upper(), target_lang=to_lang.upper())
    return result.text
```

## 📊 Analytics

View subscription analytics:

```bash
npx x402-deploy dashboard
```

Shows:
- Monthly recurring revenue
- Active subscriptions by tier
- Usage statistics
- Churn rate

## 🔧 Configuration

### Custom Pricing

Edit `x402.config.json`:

```json
{
  "pricing": {
    "tiers": {
      "basic": {
        "price": "$15",
        "limits": {
          "translations": 2000
        }
      }
    }
  }
}
```

### Add API Rate Limiting

```python
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter

@app.post("/api/translate")
@limiter.limit("10/minute")
def translate(...):
    ...
```

## 📚 Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com)
- [x402 Python SDK](https://github.com/nirholas/x402-python)
- [Base Network](https://base.org)
- [Parent Project](../../README.md)
