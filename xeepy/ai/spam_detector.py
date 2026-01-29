"""
Spam and Bot Detector for X/Twitter accounts.

Detect spam accounts, bots, and fake followers using heuristics and ML.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
from typing import Any

from loguru import logger

from xeepy.ai.providers.base import AIProvider, Message, Role


class AccountType(str, Enum):
    """Classification of account types."""
    LEGITIMATE = "legitimate"
    BOT = "bot"
    SPAM = "spam"
    FAKE = "fake"
    SUSPICIOUS = "suspicious"
    UNKNOWN = "unknown"


@dataclass
class BotScore:
    """Bot/spam detection result for a user."""
    
    username: str
    bot_probability: float  # 0-1
    spam_probability: float  # 0-1
    fake_probability: float  # 0-1
    quality_score: float  # 0-100
    account_type: AccountType
    red_flags: list[str] = field(default_factory=list)
    green_flags: list[str] = field(default_factory=list)
    evidence: dict[str, Any] = field(default_factory=dict)
    analysis_timestamp: datetime = field(default_factory=datetime.now)
    
    @property
    def is_likely_bot(self) -> bool:
        """Check if account is likely a bot."""
        return self.bot_probability > 0.7
    
    @property
    def is_likely_spam(self) -> bool:
        """Check if account is likely spam."""
        return self.spam_probability > 0.7
    
    @property
    def is_likely_fake(self) -> bool:
        """Check if account is likely fake."""
        return self.fake_probability > 0.7
    
    @property
    def is_safe(self) -> bool:
        """Check if account appears safe/legitimate."""
        return self.quality_score >= 70 and self.account_type == AccountType.LEGITIMATE
    
    @property
    def risk_level(self) -> str:
        """Get risk level based on scores."""
        max_prob = max(self.bot_probability, self.spam_probability, self.fake_probability)
        if max_prob > 0.8:
            return "high"
        elif max_prob > 0.5:
            return "medium"
        elif max_prob > 0.3:
            return "low"
        else:
            return "minimal"


@dataclass
class FollowerQualityReport:
    """Quality analysis of a user's followers."""
    
    username: str
    total_analyzed: int
    total_followers: int | None = None
    
    # Quality breakdown
    legitimate_count: int = 0
    suspicious_count: int = 0
    bot_count: int = 0
    spam_count: int = 0
    fake_count: int = 0
    
    # Scores
    average_quality_score: float = 0.0
    follower_authenticity: float = 0.0  # 0-100
    
    # Lists
    top_quality_followers: list[BotScore] = field(default_factory=list)
    worst_followers: list[BotScore] = field(default_factory=list)
    
    # Recommendations
    recommendations: list[str] = field(default_factory=list)
    
    @property
    def legitimate_ratio(self) -> float:
        """Ratio of legitimate followers."""
        if self.total_analyzed == 0:
            return 0.0
        return self.legitimate_count / self.total_analyzed
    
    @property
    def fake_ratio(self) -> float:
        """Ratio of fake/bot/spam followers."""
        if self.total_analyzed == 0:
            return 0.0
        return (self.bot_count + self.spam_count + self.fake_count) / self.total_analyzed
    
    @property
    def health_status(self) -> str:
        """Overall follower health status."""
        if self.follower_authenticity >= 80:
            return "excellent"
        elif self.follower_authenticity >= 60:
            return "good"
        elif self.follower_authenticity >= 40:
            return "moderate"
        elif self.follower_authenticity >= 20:
            return "poor"
        else:
            return "critical"


class SpamDetector:
    """
    Detect spam accounts and bots.
    
    Uses a combination of heuristics and AI to identify:
    - Bot accounts (automated behavior)
    - Spam accounts (promotional/malicious)
    - Fake followers (purchased/inactive)
    - Low-quality accounts
    
    Detection factors:
    - Account age
    - Tweet patterns and frequency
    - Follower/following ratio
    - Profile completeness
    - Engagement patterns
    - Content originality
    - Temporal patterns
    
    Example:
        ```python
        detector = SpamDetector(provider)
        
        # Analyze a single user
        score = await detector.analyze_user(
            profile_data={
                "username": "example_user",
                "followers_count": 100,
                "following_count": 5000,
                "tweet_count": 10,
                "created_at": "2024-01-01",
                ...
            }
        )
        
        if score.is_likely_bot:
            print(f"Warning: {score.username} appears to be a bot!")
        ```
    """
    
    # Heuristic thresholds
    SUSPICIOUS_FOLLOW_RATIO = 10  # Following/Followers ratio
    MIN_ACCOUNT_AGE_DAYS = 30
    MIN_TWEETS_FOR_ANALYSIS = 5
    SUSPICIOUS_TWEET_FREQUENCY = 100  # Tweets per day
    
    def __init__(
        self,
        provider: AIProvider | None = None,
        use_ai_analysis: bool = True,
    ):
        """
        Initialize the spam detector.
        
        Args:
            provider: AI provider for advanced analysis
            use_ai_analysis: Whether to use AI for deeper analysis
        """
        self.provider = provider
        self.use_ai_analysis = use_ai_analysis
    
    async def analyze_user(
        self,
        username: str | None = None,
        profile_data: dict[str, Any] | None = None,
        tweets: list[str] | None = None,
    ) -> BotScore:
        """
        Analyze if a user is likely a bot/spam.
        
        Args:
            username: Username to analyze (for display)
            profile_data: Profile data dictionary
            tweets: Optional list of recent tweets
            
        Returns:
            BotScore with detection results
        """
        if profile_data is None:
            profile_data = {}
        
        username = username or profile_data.get("username", "unknown")
        
        # Collect heuristic signals
        signals = self._analyze_heuristics(profile_data)
        
        # Add AI analysis if available
        if self.use_ai_analysis and self.provider and (profile_data or tweets):
            ai_signals = await self._analyze_with_ai(profile_data, tweets)
            signals.update(ai_signals)
        
        # Calculate final scores
        return self._calculate_scores(username, signals, profile_data)
    
    def _analyze_heuristics(self, profile_data: dict[str, Any]) -> dict[str, Any]:
        """Analyze profile using heuristics."""
        signals: dict[str, Any] = {
            "red_flags": [],
            "green_flags": [],
            "evidence": {},
        }
        
        # Follower/Following ratio
        followers = profile_data.get("followers_count", 0)
        following = profile_data.get("following_count", 0)
        
        if following > 0:
            ratio = following / max(followers, 1)
            signals["evidence"]["follow_ratio"] = ratio
            
            if ratio > self.SUSPICIOUS_FOLLOW_RATIO:
                signals["red_flags"].append(f"Suspicious follow ratio ({ratio:.1f}x)")
            elif ratio < 0.5 and followers > 100:
                signals["green_flags"].append("Healthy follower/following ratio")
        
        # Account age
        created_at = profile_data.get("created_at")
        if created_at:
            try:
                if isinstance(created_at, str):
                    from datetime import datetime
                    created = datetime.fromisoformat(created_at.replace("Z", "+00:00"))
                else:
                    created = created_at
                
                age_days = (datetime.now(created.tzinfo) - created).days
                signals["evidence"]["account_age_days"] = age_days
                
                if age_days < self.MIN_ACCOUNT_AGE_DAYS:
                    signals["red_flags"].append(f"New account ({age_days} days old)")
                elif age_days > 365:
                    signals["green_flags"].append("Established account (1+ years)")
            except Exception:
                pass
        
        # Tweet frequency
        tweet_count = profile_data.get("tweet_count", 0) or profile_data.get("statuses_count", 0)
        if tweet_count and created_at:
            try:
                if isinstance(created_at, str):
                    created = datetime.fromisoformat(created_at.replace("Z", "+00:00"))
                else:
                    created = created_at
                
                age_days = max((datetime.now(created.tzinfo) - created).days, 1)
                tweets_per_day = tweet_count / age_days
                signals["evidence"]["tweets_per_day"] = tweets_per_day
                
                if tweets_per_day > self.SUSPICIOUS_TWEET_FREQUENCY:
                    signals["red_flags"].append(f"Abnormally high tweet frequency ({tweets_per_day:.0f}/day)")
            except Exception:
                pass
        
        # Profile completeness
        has_bio = bool(profile_data.get("description", "").strip())
        has_avatar = bool(profile_data.get("profile_image_url")) and "default" not in profile_data.get("profile_image_url", "")
        has_banner = bool(profile_data.get("profile_banner_url"))
        has_location = bool(profile_data.get("location", "").strip())
        has_url = bool(profile_data.get("url", "").strip())
        
        completeness = sum([has_bio, has_avatar, has_banner, has_location, has_url]) / 5
        signals["evidence"]["profile_completeness"] = completeness
        
        if completeness < 0.3:
            signals["red_flags"].append("Incomplete profile (missing bio, avatar, etc.)")
        elif completeness >= 0.8:
            signals["green_flags"].append("Complete profile with bio and images")
        
        # Default profile image
        if not has_avatar:
            signals["red_flags"].append("Default/missing profile image")
        
        # Engagement metrics
        if followers > 0:
            engagement = (profile_data.get("average_likes", 0) + profile_data.get("average_retweets", 0)) / followers
            if engagement < 0.001 and followers > 1000:
                signals["red_flags"].append("Very low engagement relative to followers")
        
        # Verified status
        if profile_data.get("verified"):
            signals["green_flags"].append("Verified account")
        
        return signals
    
    async def _analyze_with_ai(
        self,
        profile_data: dict[str, Any],
        tweets: list[str] | None = None,
    ) -> dict[str, Any]:
        """Use AI for deeper analysis."""
        signals: dict[str, Any] = {
            "red_flags": [],
            "green_flags": [],
            "evidence": {},
        }
        
        system_prompt = """You are a Twitter/X bot detection expert. Analyze the given profile data and tweets to detect:
- Bot behavior patterns
- Spam indicators
- Fake/purchased follower patterns
- Inauthentic behavior

Provide your analysis as JSON:
{
    "bot_indicators": ["list of bot-like behaviors"],
    "spam_indicators": ["list of spam-like behaviors"],
    "authenticity_indicators": ["list of authentic/human behaviors"],
    "confidence": 0.8,
    "summary": "brief summary"
}
"""
        
        profile_summary = f"""Profile:
- Username: {profile_data.get('username', 'unknown')}
- Followers: {profile_data.get('followers_count', 'unknown')}
- Following: {profile_data.get('following_count', 'unknown')}
- Tweets: {profile_data.get('tweet_count', 'unknown')}
- Bio: {profile_data.get('description', 'none')}
- Created: {profile_data.get('created_at', 'unknown')}
"""
        
        if tweets:
            tweet_sample = "\n".join(f"- {t[:100]}" for t in tweets[:10])
            profile_summary += f"\n\nRecent tweets:\n{tweet_sample}"
        
        try:
            response = await self.provider.complete(
                messages=[
                    Message(Role.SYSTEM, system_prompt),
                    Message(Role.USER, f"Analyze this profile:\n\n{profile_summary}"),
                ],
                temperature=0.3,
                max_tokens=400,
            )
            
            import json
            content = response.content.strip()
            
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0]
            elif "```" in content:
                content = content.split("```")[1].split("```")[0]
            
            data = json.loads(content)
            
            signals["red_flags"].extend(data.get("bot_indicators", []))
            signals["red_flags"].extend(data.get("spam_indicators", []))
            signals["green_flags"].extend(data.get("authenticity_indicators", []))
            signals["evidence"]["ai_confidence"] = data.get("confidence", 0.5)
            signals["evidence"]["ai_summary"] = data.get("summary", "")
            
        except Exception as e:
            logger.warning(f"AI analysis failed: {e}")
        
        return signals
    
    def _calculate_scores(
        self,
        username: str,
        signals: dict[str, Any],
        profile_data: dict[str, Any],
    ) -> BotScore:
        """Calculate final bot/spam scores from signals."""
        red_flags = signals.get("red_flags", [])
        green_flags = signals.get("green_flags", [])
        evidence = signals.get("evidence", {})
        
        # Base probabilities
        base_bot_prob = 0.1
        base_spam_prob = 0.1
        base_fake_prob = 0.1
        
        # Adjust based on red flags
        for flag in red_flags:
            flag_lower = flag.lower()
            if "bot" in flag_lower or "automated" in flag_lower:
                base_bot_prob += 0.15
            elif "spam" in flag_lower or "promotional" in flag_lower:
                base_spam_prob += 0.15
            elif "fake" in flag_lower or "purchased" in flag_lower:
                base_fake_prob += 0.15
            else:
                # General red flag increases all slightly
                base_bot_prob += 0.05
                base_spam_prob += 0.05
                base_fake_prob += 0.05
        
        # Adjust based on green flags
        for flag in green_flags:
            base_bot_prob -= 0.08
            base_spam_prob -= 0.08
            base_fake_prob -= 0.08
        
        # Clamp probabilities
        bot_prob = max(0, min(1, base_bot_prob))
        spam_prob = max(0, min(1, base_spam_prob))
        fake_prob = max(0, min(1, base_fake_prob))
        
        # Calculate quality score (inverse of average bad probability)
        avg_bad = (bot_prob + spam_prob + fake_prob) / 3
        quality_score = max(0, min(100, (1 - avg_bad) * 100))
        
        # Add weight from evidence
        if evidence.get("profile_completeness", 0.5) < 0.3:
            quality_score -= 15
        elif evidence.get("profile_completeness", 0.5) > 0.8:
            quality_score += 10
        
        quality_score = max(0, min(100, quality_score))
        
        # Determine account type
        max_prob = max(bot_prob, spam_prob, fake_prob)
        if max_prob > 0.7:
            if bot_prob == max_prob:
                account_type = AccountType.BOT
            elif spam_prob == max_prob:
                account_type = AccountType.SPAM
            else:
                account_type = AccountType.FAKE
        elif max_prob > 0.4:
            account_type = AccountType.SUSPICIOUS
        elif quality_score >= 60:
            account_type = AccountType.LEGITIMATE
        else:
            account_type = AccountType.UNKNOWN
        
        return BotScore(
            username=username,
            bot_probability=round(bot_prob, 3),
            spam_probability=round(spam_prob, 3),
            fake_probability=round(fake_prob, 3),
            quality_score=round(quality_score, 1),
            account_type=account_type,
            red_flags=red_flags,
            green_flags=green_flags,
            evidence=evidence,
        )
    
    async def analyze_followers(
        self,
        followers_data: list[dict[str, Any]],
        username: str,
        sample_size: int = 100,
    ) -> FollowerQualityReport:
        """
        Analyze quality of followers.
        
        Args:
            followers_data: List of follower profile data
            username: Username whose followers are being analyzed
            sample_size: Maximum followers to analyze
            
        Returns:
            Follower quality report
        """
        # Sample if needed
        import random
        if len(followers_data) > sample_size:
            sample = random.sample(followers_data, sample_size)
        else:
            sample = followers_data
        
        # Analyze each follower
        scores: list[BotScore] = []
        for follower in sample:
            score = await self.analyze_user(
                username=follower.get("username"),
                profile_data=follower,
            )
            scores.append(score)
        
        # Count by type
        legitimate = [s for s in scores if s.account_type == AccountType.LEGITIMATE]
        suspicious = [s for s in scores if s.account_type == AccountType.SUSPICIOUS]
        bots = [s for s in scores if s.account_type == AccountType.BOT]
        spam = [s for s in scores if s.account_type == AccountType.SPAM]
        fake = [s for s in scores if s.account_type == AccountType.FAKE]
        
        # Calculate averages
        avg_quality = sum(s.quality_score for s in scores) / len(scores) if scores else 0
        authenticity = (len(legitimate) / len(scores) * 100) if scores else 0
        
        # Sort for top/worst
        sorted_scores = sorted(scores, key=lambda x: x.quality_score, reverse=True)
        
        # Generate recommendations
        recommendations = []
        fake_ratio = (len(bots) + len(spam) + len(fake)) / len(scores) if scores else 0
        
        if fake_ratio > 0.3:
            recommendations.append("Consider removing fake/bot followers to improve authenticity")
        if fake_ratio > 0.5:
            recommendations.append("High fake follower ratio may harm engagement rates")
        if len(bots) > len(spam) + len(fake):
            recommendations.append("Bot followers detected - may be targeted by follow bots")
        if avg_quality < 50:
            recommendations.append("Focus on attracting higher-quality followers through engagement")
        
        return FollowerQualityReport(
            username=username,
            total_analyzed=len(scores),
            total_followers=len(followers_data),
            legitimate_count=len(legitimate),
            suspicious_count=len(suspicious),
            bot_count=len(bots),
            spam_count=len(spam),
            fake_count=len(fake),
            average_quality_score=round(avg_quality, 1),
            follower_authenticity=round(authenticity, 1),
            top_quality_followers=sorted_scores[:5],
            worst_followers=sorted_scores[-5:] if len(sorted_scores) >= 5 else [],
            recommendations=recommendations,
        )
    
    async def quick_check(
        self,
        profile_data: dict[str, Any],
    ) -> str:
        """
        Quick bot check returning a simple verdict.
        
        Args:
            profile_data: Profile data
            
        Returns:
            Verdict: 'safe', 'suspicious', or 'likely_bot'
        """
        # Use only heuristics for speed
        old_use_ai = self.use_ai_analysis
        self.use_ai_analysis = False
        
        try:
            score = await self.analyze_user(profile_data=profile_data)
            
            if score.quality_score >= 70 and score.account_type == AccountType.LEGITIMATE:
                return "safe"
            elif score.is_likely_bot or score.is_likely_spam or score.is_likely_fake:
                return "likely_bot"
            else:
                return "suspicious"
        finally:
            self.use_ai_analysis = old_use_ai
