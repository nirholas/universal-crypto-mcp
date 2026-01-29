"""
Smart Targeting for X/Twitter growth.

AI-powered recommendations for accounts to follow and engage with.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
from typing import Any

from loguru import logger

from xeepy.ai.providers.base import AIProvider, Message, Role


class TargetGoal(str, Enum):
    """Goals for targeting."""
    GROWTH = "growth"  # Maximize follower growth
    ENGAGEMENT = "engagement"  # Maximize engagement
    SALES = "sales"  # B2B/sales leads
    COMMUNITY = "community"  # Build community
    INFLUENCE = "influence"  # Increase influence


class ActionType(str, Enum):
    """Recommended action types."""
    FOLLOW = "follow"
    ENGAGE = "engage"
    REPLY = "reply"
    RETWEET = "retweet"
    QUOTE = "quote"
    DM = "dm"


@dataclass
class TargetRecommendation:
    """A recommended account to engage with."""
    
    username: str
    score: float  # 0-100 recommendation score
    reasons: list[str] = field(default_factory=list)
    recommended_actions: list[ActionType] = field(default_factory=list)
    estimated_follow_back_chance: float = 0.0  # 0-1
    estimated_engagement_potential: float = 0.0  # 0-1
    niche_match: float = 0.0  # 0-1
    profile_data: dict[str, Any] = field(default_factory=dict)
    
    @property
    def is_high_value(self) -> bool:
        """Check if this is a high-value target."""
        return self.score >= 80
    
    @property
    def is_likely_to_follow_back(self) -> bool:
        """Check if target is likely to follow back."""
        return self.estimated_follow_back_chance >= 0.5
    
    @property
    def primary_action(self) -> ActionType | None:
        """Get the primary recommended action."""
        return self.recommended_actions[0] if self.recommended_actions else None


@dataclass
class TargetAnalysis:
    """Deep analysis of a potential target account."""
    
    username: str
    followers_count: int = 0
    following_count: int = 0
    tweet_count: int = 0
    
    # Engagement metrics
    average_likes: float = 0.0
    average_retweets: float = 0.0
    average_replies: float = 0.0
    engagement_rate: float = 0.0
    
    # Activity patterns
    tweets_per_day: float = 0.0
    active_hours: list[int] = field(default_factory=list)
    most_active_days: list[str] = field(default_factory=list)
    
    # Content analysis
    topics: list[str] = field(default_factory=list)
    hashtags: list[str] = field(default_factory=list)
    content_style: str = ""
    language: str = "en"
    
    # Interaction patterns
    reply_ratio: float = 0.0  # How often they reply to others
    retweet_ratio: float = 0.0
    original_content_ratio: float = 0.0
    
    # Recommendations
    best_time_to_engage: str | None = None
    recommended_approach: str | None = None
    talking_points: list[str] = field(default_factory=list)
    
    @property
    def is_active(self) -> bool:
        """Check if user is active."""
        return self.tweets_per_day >= 0.5
    
    @property
    def is_engaging(self) -> bool:
        """Check if user engages with others."""
        return self.reply_ratio >= 0.2


@dataclass
class TargetingCriteria:
    """Criteria for finding targets."""
    
    niche: str | None = None
    keywords: list[str] = field(default_factory=list)
    hashtags: list[str] = field(default_factory=list)
    min_followers: int = 100
    max_followers: int = 100000
    min_following: int = 50
    max_following: int = 10000
    min_engagement_rate: float = 0.01
    must_be_active: bool = True
    language: str | None = None
    location: str | None = None
    verified_only: bool = False
    exclude_bots: bool = True


class SmartTargeting:
    """
    AI-powered targeting recommendations.
    
    Find the best accounts to follow/engage with based on:
    - Niche relevance
    - Engagement patterns
    - Follow-back likelihood
    - Activity levels
    - Content alignment
    
    Example:
        ```python
        targeting = SmartTargeting(provider)
        
        # Find targets in a niche
        targets = await targeting.find_targets(
            niche="python programming",
            goal=TargetGoal.GROWTH,
            limit=50,
        )
        
        for target in targets[:10]:
            print(f"{target.username}: {target.score} - {target.reasons}")
        
        # Deep analysis of specific user
        analysis = await targeting.analyze_target("target_user")
        print(f"Best time to engage: {analysis.best_time_to_engage}")
        ```
    """
    
    def __init__(
        self,
        provider: AIProvider | None = None,
    ):
        """
        Initialize smart targeting.
        
        Args:
            provider: AI provider for analysis
        """
        self.provider = provider
    
    async def find_targets(
        self,
        candidates: list[dict[str, Any]],
        niche: str | None = None,
        goal: TargetGoal = TargetGoal.GROWTH,
        criteria: TargetingCriteria | None = None,
        limit: int = 50,
    ) -> list[TargetRecommendation]:
        """
        Find recommended accounts to engage with.
        
        Args:
            candidates: List of candidate profile data
            niche: Target niche/topic
            goal: Targeting goal
            criteria: Filtering criteria
            limit: Maximum recommendations
            
        Returns:
            Sorted list of target recommendations
        """
        if criteria is None:
            criteria = TargetingCriteria(niche=niche)
        
        recommendations = []
        
        for candidate in candidates:
            # Apply basic filters
            if not self._passes_criteria(candidate, criteria):
                continue
            
            # Score the candidate
            rec = await self._score_candidate(candidate, niche, goal)
            if rec.score > 0:
                recommendations.append(rec)
        
        # Sort by score
        recommendations.sort(key=lambda x: x.score, reverse=True)
        
        return recommendations[:limit]
    
    def _passes_criteria(
        self,
        candidate: dict[str, Any],
        criteria: TargetingCriteria,
    ) -> bool:
        """Check if candidate passes filtering criteria."""
        followers = candidate.get("followers_count", 0)
        following = candidate.get("following_count", 0)
        
        # Follower count check
        if followers < criteria.min_followers or followers > criteria.max_followers:
            return False
        
        # Following count check
        if following < criteria.min_following or following > criteria.max_following:
            return False
        
        # Verified check
        if criteria.verified_only and not candidate.get("verified"):
            return False
        
        # Location check
        if criteria.location:
            location = candidate.get("location", "").lower()
            if criteria.location.lower() not in location:
                return False
        
        return True
    
    async def _score_candidate(
        self,
        candidate: dict[str, Any],
        niche: str | None,
        goal: TargetGoal,
    ) -> TargetRecommendation:
        """Score a candidate for targeting."""
        username = candidate.get("username", "unknown")
        followers = candidate.get("followers_count", 0)
        following = candidate.get("following_count", 0)
        
        score = 50.0  # Base score
        reasons = []
        actions = []
        
        # Follow ratio scoring
        if following > 0:
            ratio = followers / following
            if 0.5 <= ratio <= 2.0:
                score += 10
                reasons.append("Balanced follower/following ratio")
            elif ratio > 5:
                score -= 10
                reasons.append("May not follow back (high follower ratio)")
        
        # Engagement potential
        if following > followers * 0.5:
            follow_back_chance = 0.3 + (following / max(followers, 1)) * 0.2
            follow_back_chance = min(follow_back_chance, 0.7)
            reasons.append("Active follower - likely to engage")
            actions.append(ActionType.FOLLOW)
        else:
            follow_back_chance = 0.1
        
        # Bio relevance
        bio = candidate.get("description", "")
        if niche and bio:
            niche_terms = niche.lower().split()
            bio_lower = bio.lower()
            matches = sum(1 for term in niche_terms if term in bio_lower)
            if matches > 0:
                niche_match = matches / len(niche_terms)
                score += niche_match * 20
                reasons.append(f"Bio matches niche ({matches} keywords)")
            else:
                niche_match = 0.0
        else:
            niche_match = 0.5
        
        # Activity check
        tweet_count = candidate.get("tweet_count", 0)
        if tweet_count > 100:
            score += 5
            reasons.append("Active tweeter")
            actions.append(ActionType.ENGAGE)
        
        # Adjust for goal
        if goal == TargetGoal.GROWTH:
            if follow_back_chance > 0.3:
                score += 10
                actions.insert(0, ActionType.FOLLOW)
        elif goal == TargetGoal.ENGAGEMENT:
            score += niche_match * 15
            actions.insert(0, ActionType.REPLY)
        elif goal == TargetGoal.SALES:
            if candidate.get("verified"):
                score += 10
            actions.insert(0, ActionType.DM)
        elif goal == TargetGoal.COMMUNITY:
            if 100 <= followers <= 10000:
                score += 15
                reasons.append("Good community member size")
            actions.insert(0, ActionType.ENGAGE)
        
        # Ensure unique actions
        actions = list(dict.fromkeys(actions))
        
        return TargetRecommendation(
            username=username,
            score=max(0, min(100, score)),
            reasons=reasons,
            recommended_actions=actions[:3],
            estimated_follow_back_chance=round(follow_back_chance, 2),
            estimated_engagement_potential=round(niche_match, 2),
            niche_match=round(niche_match, 2),
            profile_data=candidate,
        )
    
    async def analyze_target(
        self,
        profile_data: dict[str, Any],
        tweets: list[dict[str, Any]] | None = None,
    ) -> TargetAnalysis:
        """
        Deep analysis of a potential target account.
        
        Args:
            profile_data: Profile data dictionary
            tweets: Optional list of recent tweets
            
        Returns:
            Detailed target analysis
        """
        username = profile_data.get("username", "unknown")
        followers = profile_data.get("followers_count", 0)
        following = profile_data.get("following_count", 0)
        tweet_count = profile_data.get("tweet_count", 0)
        
        # Calculate basic metrics
        analysis = TargetAnalysis(
            username=username,
            followers_count=followers,
            following_count=following,
            tweet_count=tweet_count,
        )
        
        # Analyze tweets if provided
        if tweets:
            analysis = await self._analyze_tweets(analysis, tweets)
        
        # Get AI recommendations if available
        if self.provider:
            analysis = await self._get_ai_recommendations(analysis, profile_data, tweets)
        
        return analysis
    
    async def _analyze_tweets(
        self,
        analysis: TargetAnalysis,
        tweets: list[dict[str, Any]],
    ) -> TargetAnalysis:
        """Analyze tweets to extract patterns."""
        if not tweets:
            return analysis
        
        total_likes = 0
        total_retweets = 0
        total_replies = 0
        reply_count = 0
        retweet_count = 0
        original_count = 0
        hashtags: dict[str, int] = {}
        hours: dict[int, int] = {}
        
        for tweet in tweets:
            # Engagement metrics
            total_likes += tweet.get("like_count", 0) or tweet.get("favorite_count", 0)
            total_retweets += tweet.get("retweet_count", 0)
            total_replies += tweet.get("reply_count", 0)
            
            # Content type
            text = tweet.get("text", "")
            if text.startswith("RT @"):
                retweet_count += 1
            elif text.startswith("@"):
                reply_count += 1
            else:
                original_count += 1
            
            # Hashtags
            for tag in tweet.get("hashtags", []):
                tag_name = tag.get("tag", tag) if isinstance(tag, dict) else tag
                hashtags[tag_name] = hashtags.get(tag_name, 0) + 1
            
            # Timing
            created_at = tweet.get("created_at")
            if created_at:
                try:
                    if isinstance(created_at, str):
                        dt = datetime.fromisoformat(created_at.replace("Z", "+00:00"))
                    else:
                        dt = created_at
                    hours[dt.hour] = hours.get(dt.hour, 0) + 1
                except Exception:
                    pass
        
        # Calculate averages
        n = len(tweets)
        analysis.average_likes = total_likes / n if n else 0
        analysis.average_retweets = total_retweets / n if n else 0
        analysis.average_replies = total_replies / n if n else 0
        
        # Engagement rate
        if analysis.followers_count > 0:
            analysis.engagement_rate = (total_likes + total_retweets) / n / analysis.followers_count if n else 0
        
        # Content ratios
        if n > 0:
            analysis.reply_ratio = reply_count / n
            analysis.retweet_ratio = retweet_count / n
            analysis.original_content_ratio = original_count / n
        
        # Top hashtags
        sorted_hashtags = sorted(hashtags.items(), key=lambda x: x[1], reverse=True)
        analysis.hashtags = [h[0] for h in sorted_hashtags[:10]]
        
        # Active hours
        sorted_hours = sorted(hours.items(), key=lambda x: x[1], reverse=True)
        analysis.active_hours = [h[0] for h in sorted_hours[:5]]
        
        return analysis
    
    async def _get_ai_recommendations(
        self,
        analysis: TargetAnalysis,
        profile_data: dict[str, Any],
        tweets: list[dict[str, Any]] | None,
    ) -> TargetAnalysis:
        """Get AI-powered recommendations."""
        if not self.provider:
            return analysis
        
        system_prompt = """You are a Twitter/X engagement strategist. Analyze the target account and provide recommendations.

Return JSON with:
{
    "topics": ["main topics they discuss"],
    "content_style": "description of their style",
    "best_time_to_engage": "e.g., 9am-12pm EST weekdays",
    "recommended_approach": "how to best engage with them",
    "talking_points": ["topics that would resonate"]
}
"""
        
        profile_summary = f"""Target: @{analysis.username}
Followers: {analysis.followers_count:,}
Following: {analysis.following_count:,}
Bio: {profile_data.get('description', 'N/A')}
Engagement rate: {analysis.engagement_rate:.2%}
Reply ratio: {analysis.reply_ratio:.2%}
Top hashtags: {', '.join(analysis.hashtags[:5]) if analysis.hashtags else 'N/A'}
"""
        
        if tweets:
            sample = [t.get("text", "")[:100] for t in tweets[:5]]
            profile_summary += f"\nRecent tweets:\n" + "\n".join(f"- {t}" for t in sample)
        
        try:
            response = await self.provider.complete(
                messages=[
                    Message(Role.SYSTEM, system_prompt),
                    Message(Role.USER, f"Analyze:\n\n{profile_summary}"),
                ],
                temperature=0.5,
                max_tokens=400,
            )
            
            import json
            content = response.content.strip()
            
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0]
            elif "```" in content:
                content = content.split("```")[1].split("```")[0]
            
            data = json.loads(content)
            
            analysis.topics = data.get("topics", [])
            analysis.content_style = data.get("content_style", "")
            analysis.best_time_to_engage = data.get("best_time_to_engage")
            analysis.recommended_approach = data.get("recommended_approach")
            analysis.talking_points = data.get("talking_points", [])
            
        except Exception as e:
            logger.warning(f"AI recommendations failed: {e}")
        
        return analysis
    
    async def rank_for_engagement(
        self,
        targets: list[TargetRecommendation],
        your_niche: str,
        your_style: str = "helpful",
    ) -> list[TargetRecommendation]:
        """
        Re-rank targets specifically for engagement potential.
        
        Args:
            targets: List of targets to rank
            your_niche: Your content niche
            your_style: Your engagement style
            
        Returns:
            Re-ranked list of targets
        """
        # Adjust scores based on engagement potential
        for target in targets:
            engagement_boost = target.niche_match * 20
            engagement_boost += target.estimated_engagement_potential * 15
            
            if ActionType.REPLY in target.recommended_actions:
                engagement_boost += 10
            if ActionType.ENGAGE in target.recommended_actions:
                engagement_boost += 5
            
            target.score = min(100, target.score + engagement_boost)
        
        # Re-sort
        targets.sort(key=lambda x: x.score, reverse=True)
        
        return targets
    
    async def find_similar_accounts(
        self,
        reference_profile: dict[str, Any],
        candidates: list[dict[str, Any]],
        limit: int = 20,
    ) -> list[TargetRecommendation]:
        """
        Find accounts similar to a reference account.
        
        Args:
            reference_profile: Profile to find similar accounts to
            candidates: Pool of candidates
            limit: Maximum results
            
        Returns:
            Similar accounts ranked by similarity
        """
        ref_bio = reference_profile.get("description", "").lower()
        ref_followers = reference_profile.get("followers_count", 0)
        
        similar = []
        
        for candidate in candidates:
            # Skip the reference itself
            if candidate.get("username") == reference_profile.get("username"):
                continue
            
            # Calculate similarity score
            score = 0.0
            reasons = []
            
            # Bio similarity
            cand_bio = candidate.get("description", "").lower()
            if ref_bio and cand_bio:
                # Simple word overlap
                ref_words = set(ref_bio.split())
                cand_words = set(cand_bio.split())
                overlap = len(ref_words & cand_words)
                if overlap > 2:
                    score += min(overlap * 5, 30)
                    reasons.append(f"Similar bio ({overlap} common words)")
            
            # Follower count similarity
            cand_followers = candidate.get("followers_count", 0)
            if ref_followers > 0 and cand_followers > 0:
                ratio = min(ref_followers, cand_followers) / max(ref_followers, cand_followers)
                if ratio > 0.3:
                    score += ratio * 20
                    reasons.append("Similar audience size")
            
            if score > 10:
                similar.append(TargetRecommendation(
                    username=candidate.get("username", "unknown"),
                    score=min(100, score),
                    reasons=reasons,
                    recommended_actions=[ActionType.FOLLOW, ActionType.ENGAGE],
                    profile_data=candidate,
                ))
        
        # Sort and return
        similar.sort(key=lambda x: x.score, reverse=True)
        return similar[:limit]
