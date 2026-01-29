"""
Translation API with x402 Subscription Model

A FastAPI service offering translation with subscription-based pricing:
- Free tier: 10 translations/month
- Basic: $10/month, 1000 translations
- Pro: $50/month, unlimited translations
"""

from fastapi import FastAPI, Header, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import os
from datetime import datetime

# Import x402 SDK (conceptual - adjust based on actual Python SDK)
# from x402 import verify_payment, verify_subscription

app = FastAPI(
    title="Translation API with x402",
    description="Subscription-based translation service with cryptocurrency payments",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
WALLET_ADDRESS = os.getenv("X402_WALLET", "0x0000000000000000000000000000000000000000")
NETWORK = "eip155:8453"  # Base

# Models
class TranslationRequest(BaseModel):
    text: str
    from_lang: str
    to_lang: str

class TranslationResponse(BaseModel):
    original: str
    translated: str
    from_lang: str
    to_lang: str
    timestamp: str
    subscription_tier: str

# Mock translation function
def translate_text(text: str, from_lang: str, to_lang: str) -> str:
    """
    Mock translation - in production, use Google Translate API, DeepL, etc.
    """
    translations = {
        ("en", "es"): f"[ES] {text}",
        ("en", "fr"): f"[FR] {text}",
        ("en", "de"): f"[DE] {text}",
        ("es", "en"): f"[EN] {text}",
        ("fr", "en"): f"[EN] {text}",
    }
    return translations.get((from_lang, to_lang), f"[{to_lang.upper()}] {text}")

# Subscription verification (mock)
def verify_user_subscription(x_subscription_id: Optional[str] = Header(None)) -> str:
    """
    Verify user's subscription status
    In production, check blockchain for active subscription NFT or payment
    """
    if not x_subscription_id:
        return "free"
    
    # Mock subscription check
    if x_subscription_id.startswith("basic_"):
        return "basic"
    elif x_subscription_id.startswith("pro_"):
        return "pro"
    
    return "free"

# Routes
@app.get("/")
def root():
    return {
        "name": "Translation API with x402",
        "version": "1.0.0",
        "payment": {
            "wallet": WALLET_ADDRESS,
            "network": NETWORK,
            "token": "USDC"
        },
        "subscriptions": {
            "free": {
                "price": "$0",
                "limit": "10 translations/month"
            },
            "basic": {
                "price": "$10/month",
                "limit": "1000 translations/month"
            },
            "pro": {
                "price": "$50/month",
                "limit": "unlimited"
            }
        },
        "docs": "/docs"
    }

@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "timestamp": datetime.now().isoformat()
    }

@app.post("/api/translate", response_model=TranslationResponse)
def translate(
    request: TranslationRequest,
    subscription_tier: str = Depends(verify_user_subscription)
):
    """
    Translate text between languages
    
    Requires active subscription:
    - Free: 10 translations/month
    - Basic: 1000 translations/month ($10 USDC)
    - Pro: Unlimited ($50 USDC/month)
    """
    # Verify subscription limits (mock)
    # In production, check usage count from database
    
    translated = translate_text(request.text, request.from_lang, request.to_lang)
    
    return TranslationResponse(
        original=request.text,
        translated=translated,
        from_lang=request.from_lang,
        to_lang=request.to_lang,
        timestamp=datetime.now().isoformat(),
        subscription_tier=subscription_tier
    )

@app.get("/api/languages")
def get_supported_languages():
    """Get list of supported languages (free endpoint)"""
    return {
        "languages": [
            {"code": "en", "name": "English"},
            {"code": "es", "name": "Spanish"},
            {"code": "fr", "name": "French"},
            {"code": "de", "name": "German"},
            {"code": "ja", "name": "Japanese"},
            {"code": "zh", "name": "Chinese"},
            {"code": "ar", "name": "Arabic"},
            {"code": "ru", "name": "Russian"},
        ]
    }

@app.get("/api/subscription/status")
def get_subscription_status(
    subscription_tier: str = Depends(verify_user_subscription)
):
    """Check subscription status and usage"""
    # Mock usage data
    usage = {
        "free": {"used": 5, "limit": 10},
        "basic": {"used": 324, "limit": 1000},
        "pro": {"used": 5234, "limit": None}
    }
    
    return {
        "tier": subscription_tier,
        "usage": usage.get(subscription_tier, {"used": 0, "limit": 10}),
        "expires": "2026-02-28T23:59:59Z" if subscription_tier != "free" else None
    }

@app.post("/api/subscription/subscribe")
def subscribe(tier: str, x_payment_hash: str = Header(...)):
    """
    Subscribe to a plan
    
    Send USDC payment on Base network and include transaction hash
    """
    prices = {
        "basic": "10",
        "pro": "50"
    }
    
    if tier not in prices:
        raise HTTPException(status_code=400, detail="Invalid tier")
    
    # In production: verify payment on blockchain
    # payment = verify_payment(x_payment_hash, WALLET_ADDRESS, prices[tier])
    
    # Generate subscription ID
    subscription_id = f"{tier}_{x_payment_hash[:16]}"
    
    return {
        "success": True,
        "subscription_id": subscription_id,
        "tier": tier,
        "price": f"${prices[tier]} USDC",
        "duration": "30 days",
        "expires": "2026-02-28T23:59:59Z",
        "instructions": f"Include 'X-Subscription-Id: {subscription_id}' header in API requests"
    }

@app.get("/.well-known/x402")
def x402_discovery():
    """x402 protocol discovery endpoint"""
    return {
        "version": "1.0",
        "name": "Translation API",
        "description": "Subscription-based translation service",
        "payment": {
            "wallet": WALLET_ADDRESS,
            "network": NETWORK,
            "token": "USDC",
            "facilitator": "https://facilitator.x402.dev"
        },
        "pricing": {
            "model": "subscription",
            "tiers": {
                "basic": {
                    "price": "10",
                    "currency": "USDC",
                    "duration": "30d",
                    "limits": {
                        "translations": 1000
                    }
                },
                "pro": {
                    "price": "50",
                    "currency": "USDC",
                    "duration": "30d",
                    "limits": {
                        "translations": -1  # unlimited
                    }
                }
            }
        },
        "discovery": {
            "category": ["translation", "language", "api"],
            "tags": ["translate", "multilingual", "nlp"]
        }
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
