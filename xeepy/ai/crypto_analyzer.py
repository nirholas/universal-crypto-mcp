"""
Crypto Twitter Analyzer.

Specialized analysis for Crypto Twitter including:
- Token/project sentiment
- Influencer tracking
- Alpha detection
- Shill detection
"""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
from typing import Any

from loguru import logger

from xeepy.ai.providers.base import AIProvider, Message, Role
from xeepy.ai.sentiment_analyzer import SentimentAnalyzer, SentimentLabel


class TokenSentimentTrend(str, Enum):
    """Token sentiment trend."""
    BULLISH = "bullish"
    BEARISH = "bearish"
    NEUTRAL = "neutral"
    MIXED = "mixed"


class AlertType(str, Enum):
    """Types of crypto alerts."""
    ALPHA = "alpha"
    SHILL = "shill"
    WHALE = "whale"
    BREAKING = "breaking"
    TREND = "trend"


@dataclass
class TokenSentiment:
    """Sentiment analysis for a specific token."""
    
    token: str  # $BTC, $ETH, etc.
    tweets_analyzed: int
    sentiment_score: float  # -1 to 1
    sentiment_label: SentimentLabel
    trend: TokenSentimentTrend
    
    # Metrics
    mention_count: int = 0
    positive_mentions: int = 0
    negative_mentions: int = 0
    neutral_mentions: int = 0
    
    # Key insights
    top_bullish_tweets: list[dict[str, Any]] = field(default_factory=list)
    top_bearish_tweets: list[dict[str, Any]] = field(default_factory=list)
    key_influencers: list[str] = field(default_factory=list)
    common_narratives: list[str] = field(default_factory=list)
    
    # Timing
    analyzed_at: datetime = field(default_factory=datetime.now)
    
    @property
    def is_bullish(self) -> bool:
        """Check if overall sentiment is bullish."""
        return self.trend == TokenSentimentTrend.BULLISH
    
    @property
    def is_bearish(self) -> bool:
        """Check if overall sentiment is bearish."""
        return self.trend == TokenSentimentTrend.BEARISH
    
    @property
    def positive_ratio(self) -> float:
        """Ratio of positive mentions."""
        if self.tweets_analyzed == 0:
            return 0.0
        return self.positive_mentions / self.tweets_analyzed


@dataclass
class AlphaTweet:
    """A potential alpha/insight tweet."""
    
    tweet_id: str
    text: str
    author: str
    author_followers: int = 0
    
    # Alpha metrics
    alpha_score: float = 0.0  # 0-100
    category: str = ""  # 'launch', 'update', 'analysis', 'insider', etc.
    tokens_mentioned: list[str] = field(default_factory=list)
    
    # Context
    engagement: dict[str, int] = field(default_factory=dict)
    posted_at: datetime | None = None
    
    @property
    def is_high_alpha(self) -> bool:
        """Check if this is high-value alpha."""
        return self.alpha_score >= 70


@dataclass
class ShillAlert:
    """Detection of potential shilling activity."""
    
    token: str
    confidence: float  # 0-1
    
    # Evidence
    suspicious_accounts: list[str] = field(default_factory=list)
    coordinated_tweets: list[dict[str, Any]] = field(default_factory=list)
    shill_indicators: list[str] = field(default_factory=list)
    
    # Metrics
    tweet_count: int = 0
    unique_accounts: int = 0
    avg_account_age_days: float = 0.0
    similar_content_ratio: float = 0.0
    
    @property
    def is_likely_shill(self) -> bool:
        """Check if shilling is likely."""
        return self.confidence >= 0.7
    
    @property
    def risk_level(self) -> str:
        """Get risk level."""
        if self.confidence >= 0.8:
            return "high"
        elif self.confidence >= 0.5:
            return "medium"
        else:
            return "low"


class CryptoAnalyzer:
    """
    Specialized analysis for Crypto Twitter.
    
    Features:
    - Token/project sentiment analysis
    - Alpha detection (early insights)
    - Shill/coordinated activity detection
    - Influencer identification
    - Trend analysis
    
    Example:
        ```python
        analyzer = CryptoAnalyzer(provider, sentiment_analyzer)
        
        # Analyze token sentiment
        btc_sentiment = await analyzer.analyze_token_sentiment(
            token="$BTC",
            tweets=btc_tweets,
        )
        print(f"BTC is {btc_sentiment.trend.value}: {btc_sentiment.sentiment_score}")
        
        # Find alpha
        alpha_tweets = await analyzer.find_alpha(
            tweets=all_tweets,
            keywords=["launching", "announcement"],
        )
        
        # Detect shills
        shill_alert = await analyzer.detect_shills(
            token="$SCAM",
            tweets=token_tweets,
        )
        ```
    """
    
    # Common crypto terms for context
    BULLISH_TERMS = [
        "moon", "pump", "bullish", "wagmi", "lfg", "buy",
        "accumulate", "breakout", "rally", "ath", "green",
        "100x", "alpha", "gem", "based", "send it",
    ]
    
    BEARISH_TERMS = [
        "dump", "bearish", "ngmi", "sell", "short",
        "crash", "rug", "scam", "exit", "dead",
        "rekt", "bagholder", "ponzi", "red", "down",
    ]
    
    ALPHA_INDICATORS = [
        "announcement", "launching", "partnering", "integration",
        "listing", "airdrop", "snapshot", "update", "migration",
        "breaking", "exclusive", "insider", "alpha", "early",
    ]
    
    def __init__(
        self,
        provider: AIProvider | None = None,
        sentiment_analyzer: SentimentAnalyzer | None = None,
    ):
        """
        Initialize crypto analyzer.
        
        Args:
            provider: AI provider for analysis
            sentiment_analyzer: Sentiment analyzer instance
        """
        self.provider = provider
        self.sentiment_analyzer = sentiment_analyzer or SentimentAnalyzer(provider)
    
    async def analyze_token_sentiment(
        self,
        token: str,
        tweets: list[dict[str, Any]],
    ) -> TokenSentiment:
        """
        Analyze sentiment for a specific token.
        
        Args:
            token: Token symbol (e.g., $BTC, $ETH)
            tweets: List of tweets mentioning the token
            
        Returns:
            Token sentiment analysis
        """
        if not tweets:
            return TokenSentiment(
                token=token,
                tweets_analyzed=0,
                sentiment_score=0.0,
                sentiment_label=SentimentLabel.NEUTRAL,
                trend=TokenSentimentTrend.NEUTRAL,
            )
        
        # Clean token symbol
        token = token.upper()
        if not token.startswith("$"):
            token = f"${token}"
        
        # Analyze each tweet
        positive_tweets = []
        negative_tweets = []
        neutral_count = 0
        total_score = 0.0
        
        for tweet in tweets:
            text = tweet.get("text", "")
            
            # Quick heuristic analysis
            text_lower = text.lower()
            bullish_count = sum(1 for term in self.BULLISH_TERMS if term in text_lower)
            bearish_count = sum(1 for term in self.BEARISH_TERMS if term in text_lower)
            
            if bullish_count > bearish_count:
                score = 0.5 + min(bullish_count * 0.1, 0.5)
                positive_tweets.append({"tweet": tweet, "score": score})
                total_score += score
            elif bearish_count > bullish_count:
                score = -0.5 - min(bearish_count * 0.1, 0.5)
                negative_tweets.append({"tweet": tweet, "score": score})
                total_score += score
            else:
                neutral_count += 1
        
        # Calculate averages
        avg_score = total_score / len(tweets)
        
        # Determine trend
        if avg_score > 0.2:
            trend = TokenSentimentTrend.BULLISH
            label = SentimentLabel.POSITIVE
        elif avg_score < -0.2:
            trend = TokenSentimentTrend.BEARISH
            label = SentimentLabel.NEGATIVE
        elif len(positive_tweets) > 0 and len(negative_tweets) > 0:
            trend = TokenSentimentTrend.MIXED
            label = SentimentLabel.MIXED
        else:
            trend = TokenSentimentTrend.NEUTRAL
            label = SentimentLabel.NEUTRAL
        
        # Sort and get top tweets
        positive_tweets.sort(key=lambda x: x["score"], reverse=True)
        negative_tweets.sort(key=lambda x: x["score"])
        
        # Extract influencers (accounts with high engagement)
        influencers = []
        for tweet in tweets:
            likes = tweet.get("like_count", 0) or tweet.get("favorite_count", 0)
            if likes > 100:
                author = tweet.get("author", {})
                username = author.get("username") if isinstance(author, dict) else tweet.get("author_username")
                if username and username not in influencers:
                    influencers.append(username)
        
        return TokenSentiment(
            token=token,
            tweets_analyzed=len(tweets),
            sentiment_score=round(avg_score, 3),
            sentiment_label=label,
            trend=trend,
            mention_count=len(tweets),
            positive_mentions=len(positive_tweets),
            negative_mentions=len(negative_tweets),
            neutral_mentions=neutral_count,
            top_bullish_tweets=[t["tweet"] for t in positive_tweets[:5]],
            top_bearish_tweets=[t["tweet"] for t in negative_tweets[:5]],
            key_influencers=influencers[:10],
        )
    
    async def find_alpha(
        self,
        tweets: list[dict[str, Any]],
        keywords: list[str] | None = None,
        min_engagement: int = 10,
    ) -> list[AlphaTweet]:
        """
        Find potential alpha tweets.
        
        Alpha = Early information that could be valuable
        
        Args:
            tweets: Tweets to analyze
            keywords: Additional keywords to look for
            min_engagement: Minimum engagement to consider
            
        Returns:
            List of potential alpha tweets
        """
        alpha_keywords = set(self.ALPHA_INDICATORS)
        if keywords:
            alpha_keywords.update(k.lower() for k in keywords)
        
        alpha_tweets = []
        
        for tweet in tweets:
            text = tweet.get("text", "")
            text_lower = text.lower()
            
            # Check for alpha indicators
            matches = [kw for kw in alpha_keywords if kw in text_lower]
            if not matches:
                continue
            
            # Check engagement
            likes = tweet.get("like_count", 0) or tweet.get("favorite_count", 0)
            retweets = tweet.get("retweet_count", 0)
            total_engagement = likes + retweets
            
            if total_engagement < min_engagement:
                continue
            
            # Calculate alpha score
            alpha_score = 30.0  # Base score for having keywords
            alpha_score += len(matches) * 10  # More keywords = higher score
            alpha_score += min(total_engagement / 10, 30)  # Engagement boost
            
            # Author influence boost
            author = tweet.get("author", {})
            author_followers = author.get("followers_count", 0) if isinstance(author, dict) else 0
            if author_followers > 10000:
                alpha_score += 15
            elif author_followers > 1000:
                alpha_score += 5
            
            alpha_score = min(100, alpha_score)
            
            # Extract tokens mentioned
            import re
            tokens = re.findall(r'\$[A-Za-z]{2,10}', text)
            
            # Categorize
            if any(kw in text_lower for kw in ["announcement", "launching", "release"]):
                category = "launch"
            elif any(kw in text_lower for kw in ["partnership", "partnering", "integration"]):
                category = "partnership"
            elif any(kw in text_lower for kw in ["airdrop", "snapshot"]):
                category = "airdrop"
            elif any(kw in text_lower for kw in ["breaking", "just in"]):
                category = "breaking"
            else:
                category = "insight"
            
            alpha_tweet = AlphaTweet(
                tweet_id=str(tweet.get("id", "")),
                text=text,
                author=author.get("username") if isinstance(author, dict) else tweet.get("author_username", ""),
                author_followers=author_followers,
                alpha_score=round(alpha_score, 1),
                category=category,
                tokens_mentioned=[t.upper() for t in tokens],
                engagement={"likes": likes, "retweets": retweets},
            )
            
            alpha_tweets.append(alpha_tweet)
        
        # Sort by alpha score
        alpha_tweets.sort(key=lambda x: x.alpha_score, reverse=True)
        
        return alpha_tweets
    
    async def detect_shills(
        self,
        token: str,
        tweets: list[dict[str, Any]],
        min_tweets: int = 10,
    ) -> ShillAlert:
        """
        Detect coordinated shilling activity.
        
        Args:
            token: Token being analyzed
            tweets: Tweets mentioning the token
            min_tweets: Minimum tweets needed for analysis
            
        Returns:
            Shill detection alert
        """
        token = token.upper()
        if not token.startswith("$"):
            token = f"${token}"
        
        if len(tweets) < min_tweets:
            return ShillAlert(
                token=token,
                confidence=0.0,
                shill_indicators=["Insufficient data for analysis"],
            )
        
        confidence = 0.0
        indicators = []
        suspicious_accounts = []
        
        # Analyze account characteristics
        account_ages = []
        follower_counts = []
        unique_authors = set()
        
        for tweet in tweets:
            author = tweet.get("author", {})
            if isinstance(author, dict):
                username = author.get("username")
                followers = author.get("followers_count", 0)
                created_at = author.get("created_at")
                
                if username:
                    unique_authors.add(username)
                
                follower_counts.append(followers)
                
                if created_at:
                    try:
                        if isinstance(created_at, str):
                            created = datetime.fromisoformat(created_at.replace("Z", "+00:00"))
                        else:
                            created = created_at
                        age_days = (datetime.now(created.tzinfo) - created).days
                        account_ages.append(age_days)
                        
                        # New accounts are suspicious
                        if age_days < 30:
                            suspicious_accounts.append(username)
                    except Exception:
                        pass
        
        # Check for new accounts
        if account_ages:
            avg_age = sum(account_ages) / len(account_ages)
            if avg_age < 60:
                confidence += 0.2
                indicators.append(f"Accounts are very new (avg {avg_age:.0f} days)")
            
            new_account_ratio = sum(1 for a in account_ages if a < 30) / len(account_ages)
            if new_account_ratio > 0.5:
                confidence += 0.2
                indicators.append(f"{new_account_ratio:.0%} of accounts are <30 days old")
        
        # Check for low followers
        if follower_counts:
            avg_followers = sum(follower_counts) / len(follower_counts)
            if avg_followers < 100:
                confidence += 0.15
                indicators.append(f"Low average followers ({avg_followers:.0f})")
            
            low_follower_ratio = sum(1 for f in follower_counts if f < 50) / len(follower_counts)
            if low_follower_ratio > 0.5:
                confidence += 0.15
                indicators.append(f"{low_follower_ratio:.0%} have <50 followers")
        
        # Check for similar content
        texts = [t.get("text", "").lower() for t in tweets]
        similar_pairs = 0
        total_pairs = 0
        
        for i, text1 in enumerate(texts):
            for text2 in texts[i+1:]:
                total_pairs += 1
                # Simple similarity check
                words1 = set(text1.split())
                words2 = set(text2.split())
                if len(words1 & words2) / max(len(words1 | words2), 1) > 0.6:
                    similar_pairs += 1
        
        if total_pairs > 0:
            similar_ratio = similar_pairs / total_pairs
            if similar_ratio > 0.3:
                confidence += 0.2
                indicators.append(f"High content similarity ({similar_ratio:.0%})")
        
        # Check tweet timing
        timestamps = []
        for tweet in tweets:
            created_at = tweet.get("created_at")
            if created_at:
                try:
                    if isinstance(created_at, str):
                        dt = datetime.fromisoformat(created_at.replace("Z", "+00:00"))
                    else:
                        dt = created_at
                    timestamps.append(dt)
                except Exception:
                    pass
        
        if len(timestamps) >= 5:
            timestamps.sort()
            time_diffs = [(timestamps[i+1] - timestamps[i]).total_seconds() 
                         for i in range(len(timestamps)-1)]
            
            # Check for coordinated timing
            short_intervals = sum(1 for d in time_diffs if d < 60)  # Within 1 minute
            if short_intervals / len(time_diffs) > 0.3:
                confidence += 0.15
                indicators.append("Suspicious timing patterns (coordinated posting)")
        
        confidence = min(confidence, 1.0)
        
        return ShillAlert(
            token=token,
            confidence=round(confidence, 2),
            suspicious_accounts=suspicious_accounts[:20],
            shill_indicators=indicators,
            tweet_count=len(tweets),
            unique_accounts=len(unique_authors),
            avg_account_age_days=sum(account_ages) / len(account_ages) if account_ages else 0,
            similar_content_ratio=similar_pairs / total_pairs if total_pairs > 0 else 0,
        )
    
    async def get_market_mood(
        self,
        tweets: list[dict[str, Any]],
    ) -> dict[str, Any]:
        """
        Get overall crypto market mood from tweets.
        
        Args:
            tweets: General crypto tweets
            
        Returns:
            Market mood analysis
        """
        if not tweets:
            return {
                "mood": "unknown",
                "confidence": 0,
                "indicators": [],
            }
        
        bullish_count = 0
        bearish_count = 0
        
        for tweet in tweets:
            text = tweet.get("text", "").lower()
            
            bullish = sum(1 for term in self.BULLISH_TERMS if term in text)
            bearish = sum(1 for term in self.BEARISH_TERMS if term in text)
            
            if bullish > bearish:
                bullish_count += 1
            elif bearish > bullish:
                bearish_count += 1
        
        total = bullish_count + bearish_count
        if total == 0:
            return {
                "mood": "neutral",
                "confidence": 0.5,
                "bullish_ratio": 0.5,
                "bearish_ratio": 0.5,
                "indicators": ["No strong signals"],
            }
        
        bullish_ratio = bullish_count / total
        
        if bullish_ratio > 0.7:
            mood = "very_bullish"
        elif bullish_ratio > 0.55:
            mood = "bullish"
        elif bullish_ratio > 0.45:
            mood = "neutral"
        elif bullish_ratio > 0.3:
            mood = "bearish"
        else:
            mood = "very_bearish"
        
        confidence = abs(bullish_ratio - 0.5) * 2
        
        indicators = []
        if mood in ["very_bullish", "bullish"]:
            indicators.append(f"{bullish_ratio:.0%} bullish sentiment")
        elif mood in ["very_bearish", "bearish"]:
            indicators.append(f"{1-bullish_ratio:.0%} bearish sentiment")
        
        return {
            "mood": mood,
            "confidence": round(confidence, 2),
            "bullish_ratio": round(bullish_ratio, 2),
            "bearish_ratio": round(1 - bullish_ratio, 2),
            "tweets_analyzed": len(tweets),
            "indicators": indicators,
        }
    
    async def analyze_with_ai(
        self,
        tweets: list[dict[str, Any]],
        focus: str = "market",
    ) -> dict[str, Any]:
        """
        Deep AI analysis of crypto tweets.
        
        Args:
            tweets: Tweets to analyze
            focus: Analysis focus ('market', 'token', 'alpha', 'sentiment')
            
        Returns:
            AI analysis results
        """
        if not self.provider:
            return {"error": "AI provider not available"}
        
        if not tweets:
            return {"error": "No tweets to analyze"}
        
        # Sample tweets for AI
        sample = tweets[:20]
        tweet_texts = [t.get("text", "")[:200] for t in sample]
        
        prompts = {
            "market": """Analyze these crypto tweets and provide:
1. Overall market sentiment (bullish/bearish/neutral)
2. Key narratives being discussed
3. Tokens getting attention
4. Any notable news or developments
5. Short-term outlook based on social sentiment""",
            
            "alpha": """Analyze these tweets for potential alpha:
1. Any early insights or leaked information
2. Upcoming launches or announcements mentioned
3. Partnership or integration hints
4. Airdrop or reward opportunities
5. Rate the alpha quality (low/medium/high)""",
            
            "sentiment": """Perform sentiment analysis on these crypto tweets:
1. Overall sentiment score (-1 to 1)
2. Dominant emotions (fear, greed, excitement, etc.)
3. Key concerns being raised
4. Positive factors being highlighted
5. Sentiment trajectory (improving/declining/stable)""",
        }
        
        system_prompt = f"""You are a crypto Twitter analyst. {prompts.get(focus, prompts['market'])}

Provide your analysis as JSON with relevant fields."""
        
        tweet_block = "\n".join(f"- {t}" for t in tweet_texts)
        
        try:
            response = await self.provider.complete(
                messages=[
                    Message(Role.SYSTEM, system_prompt),
                    Message(Role.USER, f"Analyze these tweets:\n\n{tweet_block}"),
                ],
                temperature=0.5,
                max_tokens=600,
            )
            
            import json
            content = response.content.strip()
            
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0]
            elif "```" in content:
                content = content.split("```")[1].split("```")[0]
            
            return json.loads(content)
            
        except Exception as e:
            logger.error(f"AI analysis failed: {e}")
            return {"error": str(e)}
