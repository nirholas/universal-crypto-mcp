#!/usr/bin/env python3
"""
Xeepy Quick Start Example
==========================

This example demonstrates the key features of Xeepy.
"""

import asyncio
from pathlib import Path


async def cli_examples():
    """Examples using the CLI (simulated)."""
    print("\n" + "="*60)
    print("📱 CLI Examples")
    print("="*60)
    
    examples = [
        ("Scrape Profile", "xeepy scrape profile elonmusk --format json"),
        ("Search Tweets", "xeepy scrape tweets --keyword 'AI' --limit 50"),
        ("Follow Users", "xeepy follow by-keyword 'machine learning' --limit 20"),
        ("Auto Engage", "xeepy engage auto-like --keyword python --limit 10"),
        ("AI Generate", "xeepy ai generate --prompt 'Write about AI ethics'"),
        ("Analytics", "xeepy analytics dashboard"),
    ]
    
    for name, command in examples:
        print(f"\n{name}:")
        print(f"  $ {command}")


async def api_examples():
    """Examples using the API."""
    print("\n" + "="*60)
    print("🌐 API Examples")
    print("="*60)
    
    print("""
# Start the server
$ xeepy-api --port 8000 --reload

# API Documentation
http://localhost:8000/docs

# Example API calls:

# Scrape profile
curl -X GET "http://localhost:8000/api/scrape/profile/elonmusk"

# Search tweets
curl -X POST "http://localhost:8000/api/scrape/tweets" \\
  -H "Content-Type: application/json" \\
  -d '{"keyword": "AI", "limit": 50}'

# Follow user
curl -X POST "http://localhost:8000/api/follow/user/username" \\
  -H "X-API-Key: your-api-key"

# Generate AI content
curl -X POST "http://localhost:8000/api/ai/generate" \\
  -H "Content-Type: application/json" \\
  -d '{"prompt": "Write about AI", "provider": "openai"}'

# WebSocket connection
ws://localhost:8000/ws/client-123
    """)


async def python_examples():
    """Examples using Python API."""
    print("\n" + "="*60)
    print("🐍 Python API Examples")
    print("="*60)
    
    print("""
from xeepy import create_app
from xeepy.config import get_config
from xeepy.ai import ContentGenerator, SentimentAnalyzer

# 1. Create FastAPI app
app = create_app(debug=True, enable_auth=False)

# 2. Configure settings
config = get_config()
config.ai.openai_api_key = "sk-..."
config.server.port = 8000

# 3. Use AI features
async def generate_content():
    generator = ContentGenerator(provider="openai")
    
    # Generate tweet
    tweet = await generator.generate_tweet(
        topic="artificial intelligence",
        tone="professional",
        hashtags=["AI", "MachineLearning"],
        max_length=280
    )
    print(f"Generated: {tweet}")
    
    # Analyze sentiment
    analyzer = SentimentAnalyzer(provider="openai")
    sentiment = await analyzer.analyze_text(tweet)
    print(f"Sentiment: {sentiment.sentiment} ({sentiment.confidence:.2%})")
    print(f"Engagement potential: {sentiment.engagement_potential:.2%}")

# Run
asyncio.run(generate_content())

# 4. Smart following campaign
from xeepy.ai import SmartTargeting

async def smart_follow():
    targeting = SmartTargeting(provider="openai")
    
    targets = await targeting.find_relevant_accounts(
        interests=["python", "machine learning", "data science"],
        min_followers=1000,
        max_followers=50000,
        engagement_rate_min=2.0,
        limit=50
    )
    
    for user in targets:
        if user.relevance_score > 0.7 and not user.is_bot:
            print(f"Follow: @{user.username} (score: {user.relevance_score:.2f})")

# 5. Monitor with WebSocket
from xeepy.api.websocket import WebSocketManager
from xeepy.api.models import Channel

async def monitor():
    ws_manager = WebSocketManager()
    
    @ws_manager.on_message(Channel.FOLLOWERS)
    async def on_follower(data):
        print(f"New follower: @{data['username']}")
    
    @ws_manager.on_message(Channel.MENTIONS)
    async def on_mention(data):
        print(f"Mentioned: {data['tweet']}")
    
    await ws_manager.start()

# 6. Analytics dashboard
from xeepy.api.routes.analytics import get_dashboard

async def show_analytics():
    dashboard = await get_dashboard(days=30)
    print(f"Followers: {dashboard.total_followers:,}")
    print(f"Engagement rate: {dashboard.engagement_rate:.2%}")
    print(f"Growth: {dashboard.follower_growth:+,}")
    """)


async def advanced_examples():
    """Advanced usage examples."""
    print("\n" + "="*60)
    print("🚀 Advanced Examples")
    print("="*60)
    
    print("""
# 1. Content Pipeline with AI
from xeepy.ai import ContentGenerator, SentimentAnalyzer, SpamDetector

async def content_pipeline(topic: str):
    generator = ContentGenerator(provider="openai")
    analyzer = SentimentAnalyzer(provider="openai")
    spam_detector = SpamDetector(provider="openai")
    
    # Generate multiple options
    tweets = [
        await generator.generate_tweet(topic=topic, tone=tone)
        for tone in ["professional", "casual", "enthusiastic"]
    ]
    
    # Analyze and filter
    best_tweet = None
    best_score = 0
    
    for tweet in tweets:
        # Check spam
        is_spam = await spam_detector.is_spam(tweet)
        if is_spam:
            continue
        
        # Analyze sentiment
        sentiment = await analyzer.analyze_text(tweet)
        score = sentiment.engagement_potential * sentiment.confidence
        
        if score > best_score:
            best_score = score
            best_tweet = tweet
    
    return best_tweet, best_score

# 2. Automated Engagement Loop
from xeepy.ai import SmartTargeting, ContentGenerator

async def engagement_loop():
    targeting = SmartTargeting(provider="openai")
    generator = ContentGenerator(provider="openai")
    
    while True:
        # Find trending topics
        topics = await find_trending_topics()
        
        for topic in topics:
            # Find relevant accounts
            accounts = await targeting.find_relevant_accounts(
                interests=[topic],
                limit=10
            )
            
            # Engage with top posts
            for account in accounts:
                tweets = await get_recent_tweets(account.username)
                
                for tweet in tweets[:3]:  # Top 3 tweets
                    # Like
                    await like_tweet(tweet.id)
                    
                    # Generate thoughtful reply
                    reply = await generator.generate_reply(
                        original_tweet=tweet.text,
                        tone="thoughtful",
                    )
                    await post_reply(tweet.id, reply)
        
        # Wait before next iteration
        await asyncio.sleep(3600)  # 1 hour

# 3. Crypto Sentiment Tracker
from xeepy.ai import CryptoAnalyzer

async def track_crypto_sentiment():
    analyzer = CryptoAnalyzer(provider="openai")
    
    tokens = ["BTC", "ETH", "SOL", "DOGE"]
    
    while True:
        for token in tokens:
            sentiment = await analyzer.analyze_token_sentiment(
                token=token,
                timeframe="24h"
            )
            
            print(f"\\n{token} Sentiment:")
            print(f"  Overall: {sentiment.overall_sentiment}")
            print(f"  Confidence: {sentiment.confidence:.2%}")
            print(f"  Volume: {sentiment.mention_count:,} mentions")
            print(f"  Trending: {'📈' if sentiment.trending_score > 0.7 else '📉'}")
            
            # Alert on major shifts
            if abs(sentiment.sentiment_shift) > 0.5:
                print(f"  ⚠️  ALERT: Sentiment shifted by {sentiment.sentiment_shift:+.2%}")
        
        await asyncio.sleep(300)  # 5 minutes

# 4. Custom API Server with Authentication
from xeepy.api.server import XeepyAPI
from xeepy.api.auth import AuthManager
from xeepy.config import XeepyConfig

# Create custom config
config = XeepyConfig()
config.auth.jwt_secret = "your-secret-key"
config.auth.require_api_key = True
config.auth.api_keys = ["key1", "key2"]
config.rate_limit.requests_per_minute = 120

# Create API with custom config
api = XeepyAPI(
    debug=False,
    enable_auth=True,
    enable_rate_limiting=True,
    jwt_secret=config.auth.jwt_secret,
)

# Add custom route
@api.app.get("/custom/route")
async def custom_route():
    return {"message": "Custom endpoint"}

# Run with uvicorn
import uvicorn
uvicorn.run(api.app, host="0.0.0.0", port=8000)
    """)


async def main():
    """Run all examples."""
    print("""
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   🚀 Xeepy Quick Start Guide                                  ║
║                                                               ║
║   Professional X/Twitter automation toolkit                   ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
    """)
    
    await cli_examples()
    await api_examples()
    await python_examples()
    await advanced_examples()
    
    print("\n" + "="*60)
    print("📚 Additional Resources")
    print("="*60)
    print("""
Documentation:  xeepy/README.md
Configuration:  xeepy.example.yml
API Docs:       http://localhost:8000/docs (when running)
Examples:       examples/ directory
Tests:          tests/ directory

Get Started:
1. pip install 'xeepy[all]'
2. cp xeepy.example.yml xeepy.yml
3. xeepy --help
4. xeepy-api

⚠️  Remember: This is for EDUCATIONAL PURPOSES ONLY!
    """)


if __name__ == "__main__":
    asyncio.run(main())
