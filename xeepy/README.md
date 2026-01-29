# 🚀 Xeepy - X/Twitter Automation Toolkit

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.8+](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-00a393.svg)](https://fastapi.tiangolo.com/)
[![Code style: black](https://img.shields.io/badge/code%20style-black-000000.svg)](https://github.com/psf/black)

**Xeepy** is a powerful, professional-grade X/Twitter automation toolkit featuring both a beautiful CLI and comprehensive REST API.

> ⚠️ **EDUCATIONAL PURPOSES ONLY** - This toolkit is designed for learning and demonstration. All operations are simulated and no actual X/Twitter API calls are made.

## ✨ Features

### 🤖 AI-Powered Automation
- **Content Generation** - Create tweets, threads, and replies with GPT-4, Claude, or local LLMs
- **Sentiment Analysis** - Analyze tweet sentiment and engagement potential
- **Smart Targeting** - Find and engage with relevant accounts using AI
- **Bot Detection** - Identify automated accounts with ML-powered analysis
- **Crypto Sentiment Tracking** - Monitor token sentiment across X/Twitter

### 📊 Analytics & Insights
- **Comprehensive Dashboard** - Real-time analytics and metrics
- **Engagement Tracking** - Monitor likes, retweets, replies, and impressions
- **Growth Analytics** - Track follower growth and audience insights
- **Export Reports** - Generate CSV, JSON, and PDF reports

### 🎯 Smart Automation
- **Follow Automation** - Smart following with keyword and hashtag targeting
- **Unfollow Management** - Clean up non-followers, inactive accounts, and bots
- **Auto-Engagement** - Automated likes, retweets, and thoughtful replies
- **Keyword Monitoring** - Track mentions, hashtags, and trending topics

### 🔌 Dual Interface
- **CLI** - Beautiful, user-friendly command-line interface with Rich formatting
- **REST API** - Full-featured FastAPI server with OpenAPI documentation
- **WebSocket Support** - Real-time updates and streaming data

### 🔒 Production-Ready
- **Multiple Auth Methods** - JWT, OAuth2, and API Key authentication
- **Rate Limiting** - Token bucket algorithm with configurable limits
- **Metrics & Monitoring** - Prometheus-compatible metrics export
- **Comprehensive Logging** - Structured logging with sensitive data masking

---

## 🚀 Quick Start

### Installation

```bash
# Basic installation (CLI only)
pip install xeepy

# Full installation (CLI + API + AI)
pip install 'xeepy[all]'

# Or install specific features
pip install 'xeepy[api]'      # API server
pip install 'xeepy[ai]'       # AI features
pip install 'xeepy[openai]'   # OpenAI provider
pip install 'xeepy[anthropic]' # Anthropic provider
```

### CLI Usage

```bash
# Initialize Xeepy
xeepy init

# Scrape a profile
xeepy scrape profile elonmusk --format json

# Search tweets by keyword
xeepy scrape tweets --keyword "artificial intelligence" --limit 50

# Follow users by keyword
xeepy follow by-keyword "machine learning" --limit 20

# Auto-engage with tweets
xeepy engage auto-like --keyword "python" --limit 10

# Generate AI content
xeepy ai generate --prompt "Write a tweet about AI" --provider openai

# Get analytics
xeepy analytics dashboard
```

### API Usage

```bash
# Start the API server
xeepy-api

# Or with custom options
xeepy-api --host 0.0.0.0 --port 8000 --reload

# Or using Python
python -m xeepy.api.server
```

Visit the API documentation:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health

### Python Usage

```python
from xeepy import create_app
from xeepy.config import XeepyConfig, get_config

# Create FastAPI app
app = create_app(
    debug=True,
    enable_auth=False,
    enable_websocket=True
)

# Configure settings
config = get_config()
config.ai.openai_api_key = "sk-..."
config.server.port = 8000

# Use AI features
from xeepy.ai import ContentGenerator

generator = ContentGenerator(provider="openai")
tweet = await generator.generate_tweet(
    topic="artificial intelligence",
    tone="professional",
    hashtags=["AI", "MachineLearning"]
)
print(tweet)
```

---

## 📖 Documentation

### CLI Commands

#### Scraping
```bash
# Profile information
xeepy scrape profile USERNAME [--format json|csv|table]

# Followers list
xeepy scrape followers USERNAME [--limit 100] [--format json]

# Tweets from user
xeepy scrape tweets --username USERNAME [--limit 50]

# Search tweets by keyword
xeepy scrape tweets --keyword KEYWORD [--limit 100]

# Hashtag search
xeepy scrape hashtag TAG [--limit 50]

# Tweet replies
xeepy scrape replies TWEET_ID [--limit 20]
```

#### Following
```bash
# Follow a user
xeepy follow user USERNAME

# Follow users by keyword
xeepy follow by-keyword KEYWORD [--limit 20]

# Follow users by hashtag
xeepy follow by-hashtag TAG [--limit 20]

# Follow followers of a user
xeepy follow followers-of USERNAME [--limit 50]

# Follow users who engaged with a tweet
xeepy follow engagers TWEET_ID

# Auto-follow with filters
xeepy follow auto --keyword KEYWORD --min-followers 1000
```

#### Unfollowing
```bash
# Unfollow a user
xeepy unfollow user USERNAME

# Unfollow non-followers
xeepy unfollow non-followers [--whitelist user1,user2]

# Unfollow all (with confirmation)
xeepy unfollow all --confirm

# Unfollow inactive users
xeepy unfollow inactive --days 90

# Unfollow bots
xeepy unfollow bots [--threshold 0.8]

# Unfollow by criteria
xeepy unfollow by-criteria --min-followers 10 --max-following 10000
```

#### Engagement
```bash
# Like a tweet
xeepy engage like TWEET_ID

# Retweet
xeepy engage retweet TWEET_ID

# Reply to tweet
xeepy engage reply TWEET_ID "Great insight!"

# Auto-like tweets
xeepy engage auto-like --keyword KEYWORD [--limit 10]

# Auto-comment
xeepy engage auto-comment --keyword KEYWORD --use-ai

# Auto-retweet
xeepy engage auto-retweet --keyword KEYWORD [--limit 5]
```

#### AI Features
```bash
# Generate tweet
xeepy ai generate --prompt "Topic" [--provider openai]

# Generate thread
xeepy ai thread --topic "AI Ethics" [--tweets 5]

# Generate reply
xeepy ai reply TWEET_ID --context "Reply context"

# Analyze sentiment
xeepy ai sentiment TWEET_ID

# Detect bots
xeepy ai detect-bot USERNAME

# Find crypto sentiment
xeepy ai crypto-sentiment BTC --timeframe 24h
```

#### Monitoring
```bash
# Check unfollowers
xeepy monitor unfollowers [--days 7]

# New followers
xeepy monitor new-followers [--days 1]

# Monitor keywords
xeepy monitor keywords add "machine learning"
xeepy monitor keywords list
xeepy monitor keywords results "machine learning"

# Track mentions
xeepy monitor mentions [--unread-only]

# Get alerts
xeepy monitor alerts [--type follower|mention|keyword]
```

#### Analytics
```bash
# View dashboard
xeepy analytics dashboard

# Engagement metrics
xeepy analytics engagement [--days 30]

# Growth analytics
xeepy analytics growth [--days 90]

# Audience insights
xeepy analytics audience

# Export report
xeepy analytics export --format pdf --output report.pdf
```

### API Endpoints

#### System
- `GET /` - Landing page
- `GET /health` - Health check
- `GET /metrics` - Prometheus metrics
- `GET /version` - Version information

#### Scraping (`/api/scrape`)
- `GET /api/scrape/profile/{username}` - Get profile
- `GET /api/scrape/followers/{username}` - Get followers
- `POST /api/scrape/tweets` - Search tweets
- `GET /api/scrape/hashtag/{tag}` - Search by hashtag
- `GET /api/scrape/replies/{tweet_id}` - Get replies

#### Following (`/api/follow`)
- `POST /api/follow/user/{username}` - Follow user
- `POST /api/follow/by-keyword` - Follow by keyword
- `POST /api/follow/by-hashtag/{tag}` - Follow by hashtag
- `DELETE /api/follow/user/{username}` - Unfollow user
- `DELETE /api/follow/non-followers` - Unfollow non-followers
- `POST /api/follow/whitelist` - Manage whitelist

#### Engagement (`/api/engage`)
- `POST /api/engage/like/{tweet_id}` - Like tweet
- `POST /api/engage/retweet/{tweet_id}` - Retweet
- `POST /api/engage/reply/{tweet_id}` - Reply to tweet
- `POST /api/engage/quote/{tweet_id}` - Quote tweet
- `POST /api/engage/auto/start` - Start auto-engagement
- `POST /api/engage/auto/stop` - Stop auto-engagement
- `GET /api/engage/auto/status` - Get status
- `GET /api/engage/stats` - Get statistics

#### Monitoring (`/api/monitor`)
- `GET /api/monitor/unfollowers` - Get unfollowers
- `GET /api/monitor/new-followers` - Get new followers
- `POST /api/monitor/keywords` - Monitor keyword
- `GET /api/monitor/mentions` - Get mentions
- `GET /api/monitor/alerts` - Get alerts

#### AI Features (`/api/ai`)
- `POST /api/ai/generate` - Generate content
- `POST /api/ai/sentiment` - Analyze sentiment
- `POST /api/ai/detect-bots` - Detect bots
- `POST /api/ai/find-targets` - Find target accounts
- `POST /api/ai/crypto-sentiment` - Crypto sentiment analysis

#### Analytics (`/api/analytics`)
- `GET /api/analytics/dashboard` - Get dashboard
- `GET /api/analytics/engagement` - Engagement metrics
- `GET /api/analytics/growth` - Growth analytics
- `GET /api/analytics/audience` - Audience insights
- `POST /api/analytics/reports/export` - Export report

#### WebSocket (`/ws/{client_id}`)
Real-time updates for:
- New tweets
- Mentions
- Followers/unfollowers
- Engagement events
- System notifications

---

## ⚙️ Configuration

### Environment Variables

```bash
# Environment
ENVIRONMENT=development  # development, staging, production

# AI Providers
AI_PROVIDER=openai
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
OLLAMA_BASE_URL=http://localhost:11434

# Authentication
AUTH_ENABLED=true
JWT_SECRET=your-secret-key
REQUIRE_API_KEY=false
API_KEYS=key1,key2,key3

# Twitter OAuth (for real integration)
TWITTER_CLIENT_ID=your-client-id
TWITTER_CLIENT_SECRET=your-client-secret

# Rate Limiting
RATE_LIMIT_ENABLED=true
RATE_LIMIT_PER_MINUTE=60
RATE_LIMIT_PER_HOUR=1000
RATE_LIMIT_PER_DAY=10000

# Server
HOST=0.0.0.0
PORT=8000
WORKERS=4
DEBUG=false
CORS_ENABLED=true
WEBSOCKET_ENABLED=true

# Logging
LOG_LEVEL=INFO
LOG_TO_FILE=true
LOG_FILE=xeepy.log
```

### Configuration File

Create `xeepy.yml`:

```yaml
environment: development

ai:
  default_provider: openai
  openai_api_key: sk-...
  openai_model: gpt-4
  anthropic_api_key: sk-ant-...
  ollama_base_url: http://localhost:11434

auth:
  enabled: true
  jwt_secret: your-secret-key
  jwt_expiry_minutes: 60
  require_api_key: false

rate_limit:
  enabled: true
  requests_per_minute: 60
  requests_per_hour: 1000

server:
  host: 0.0.0.0
  port: 8000
  workers: 4
  cors_enabled: true
  websocket_enabled: true

logging:
  level: INFO
  log_to_file: true
  log_file: xeepy.log

demo_mode: true
```

---

## 🎨 Examples

### Example 1: Content Generation Pipeline

```python
from xeepy.ai import ContentGenerator, SentimentAnalyzer

# Initialize
generator = ContentGenerator(provider="openai")
analyzer = SentimentAnalyzer(provider="openai")

# Generate tweet
tweet = await generator.generate_tweet(
    topic="The future of AI",
    tone="thought-provoking",
    hashtags=["AI", "Future"]
)

# Analyze before posting
sentiment = await analyzer.analyze_text(tweet)
if sentiment.engagement_potential > 0.7:
    print(f"✅ Great tweet! Score: {sentiment.engagement_potential}")
    print(tweet)
else:
    # Regenerate
    tweet = await generator.generate_tweet(topic="AI", tone="optimistic")
```

### Example 2: Smart Follow Campaign

```python
from xeepy.cli.utils import load_config
from xeepy.ai import SmartTargeting

# Load config
config = load_config()

# Initialize targeting
targeting = SmartTargeting(provider="openai")

# Find relevant accounts
targets = await targeting.find_relevant_accounts(
    interests=["machine learning", "python", "data science"],
    min_followers=1000,
    max_followers=50000,
    engagement_rate_min=2.0,
    limit=50
)

# Follow with smart filtering
for user in targets:
    if user.is_relevant and not user.is_bot:
        print(f"Following: @{user.username} (score: {user.relevance_score})")
        # await follow_user(user.username)
```

### Example 3: Monitoring & Alerts

```python
from xeepy.api.websocket import WebSocketManager
from xeepy.api.models import Channel

# Create WebSocket manager
ws_manager = WebSocketManager()

# Subscribe to channels
@ws_manager.on_message(Channel.FOLLOWERS)
async def on_new_follower(data):
    username = data["username"]
    print(f"🎉 New follower: @{username}")
    
    # Auto-follow back high-value accounts
    if data["followers_count"] > 10000:
        # await follow_user(username)
        pass

@ws_manager.on_message(Channel.MENTIONS)
async def on_mention(data):
    tweet = data["tweet"]
    print(f"💬 Mentioned in: {tweet}")
    
    # Auto-reply with AI
    # reply = await generate_reply(tweet)
    # await post_reply(tweet_id, reply)

# Start listening
await ws_manager.start()
```

---

## 🏗️ Architecture

```
xeepy/
├── __init__.py           # Package initialization
├── config.py             # Configuration management
├── cli/                  # Command-line interface
│   ├── main.py          # CLI entry point
│   ├── utils.py         # CLI utilities
│   └── commands/        # Command modules
│       ├── scrape.py    # Scraping commands
│       ├── follow.py    # Follow/unfollow commands
│       ├── engage.py    # Engagement commands
│       ├── monitor.py   # Monitoring commands
│       ├── ai.py        # AI commands
│       └── analytics.py # Analytics commands
├── api/                  # REST API
│   ├── server.py        # FastAPI application
│   ├── models.py        # Pydantic models
│   ├── auth.py          # Authentication
│   ├── middleware.py    # Middleware stack
│   ├── websocket.py     # WebSocket support
│   └── routes/          # API routes
│       ├── scrape.py    # Scraping endpoints
│       ├── follow.py    # Follow endpoints
│       ├── engage.py    # Engagement endpoints
│       ├── monitor.py   # Monitoring endpoints
│       ├── ai.py        # AI endpoints
│       └── analytics.py # Analytics endpoints
└── ai/                   # AI features
    ├── providers/       # AI providers
    │   ├── base.py      # Base provider
    │   ├── openai.py    # OpenAI integration
    │   ├── anthropic.py # Anthropic integration
    │   └── ollama.py    # Ollama integration
    └── features/        # AI features
        ├── content.py   # Content generation
        ├── sentiment.py # Sentiment analysis
        ├── spam.py      # Spam/bot detection
        ├── targeting.py # Smart targeting
        ├── crypto.py    # Crypto sentiment
        └── influencer.py # Influencer finder
```

---

## 🧪 Testing

```bash
# Run tests
pytest

# With coverage
pytest --cov=xeepy --cov-report=html

# Run specific tests
pytest tests/test_ai.py
pytest tests/test_api.py
```

---

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## ⚠️ Disclaimer

**IMPORTANT**: This toolkit is provided for **educational and demonstration purposes only**. 

- No actual X/Twitter API calls are made
- All data is simulated for learning purposes
- Use of this toolkit for production automation may violate X/Twitter's Terms of Service
- The authors are not responsible for any misuse of this software
- Always respect platform guidelines and rate limits

---

## 🙏 Acknowledgments

- [FastAPI](https://fastapi.tiangolo.com/) - Modern web framework
- [Click](https://click.palletsprojects.com/) - CLI framework
- [Rich](https://rich.readthedocs.io/) - Beautiful terminal formatting
- [Pydantic](https://pydantic-docs.helpmanual.io/) - Data validation
- [OpenAI](https://openai.com/) - AI capabilities
- [Anthropic](https://www.anthropic.com/) - Claude AI
- [Ollama](https://ollama.ai/) - Local LLM support

---

## 📞 Support

- **Documentation**: https://xeepy.dev/docs
- **GitHub Issues**: https://github.com/yourusername/xeepy/issues
- **Discord**: https://discord.gg/xeepy
- **Email**: support@xeepy.dev

---

<div align="center">

**Made with ❤️ by the Xeepy Team**

[Website](https://xeepy.dev) • [Documentation](https://xeepy.dev/docs) • [GitHub](https://github.com/yourusername/xeepy)

</div>
