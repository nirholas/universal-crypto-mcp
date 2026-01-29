"""
Influencer Finder for X/Twitter.

Find and analyze influencers in specific niches.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
from typing import Any

from loguru import logger

from xeepy.ai.providers.base import AIProvider, Message, Role


class InfluencerTier(str, Enum):
    """Influencer tier based on followers."""
    NANO = "nano"  # 1K-10K
    MICRO = "micro"  # 10K-100K
    MID = "mid"  # 100K-500K
    MACRO = "macro"  # 500K-1M
    MEGA = "mega"  # 1M+


class InfluencerType(str, Enum):
    """Type of influencer."""
    THOUGHT_LEADER = "thought_leader"
    CONTENT_CREATOR = "content_creator"
    INDUSTRY_EXPERT = "industry_expert"
    BRAND = "brand"
    CELEBRITY = "celebrity"
    COMMUNITY_BUILDER = "community_builder"
    EDUCATOR = "educator"


@dataclass
class InfluencerProfile:
    """Profile of an identified influencer."""
    
    username: str
    display_name: str = ""
    bio: str = ""
    
    # Metrics
    followers_count: int = 0
    following_count: int = 0
    tweet_count: int = 0
    
    # Classification
    tier: InfluencerTier = InfluencerTier.NANO
    influencer_type: InfluencerType = InfluencerType.CONTENT_CREATOR
    
    # Engagement
    engagement_rate: float = 0.0
    avg_likes: float = 0.0
    avg_retweets: float = 0.0
    avg_replies: float = 0.0
    
    # Niche info
    niches: list[str] = field(default_factory=list)
    topics: list[str] = field(default_factory=list)
    hashtags: list[str] = field(default_factory=list)
    
    # Influence score
    influence_score: float = 0.0  # 0-100
    authenticity_score: float = 0.0  # 0-100
    
    # Contact info
    verified: bool = False
    has_website: bool = False
    website: str | None = None
    
    # Activity
    posts_per_day: float = 0.0
    last_active: datetime | None = None
    
    @property
    def is_active(self) -> bool:
        """Check if influencer is active."""
        return self.posts_per_day >= 0.5
    
    @property
    def is_highly_engaged(self) -> bool:
        """Check if influencer has high engagement."""
        return self.engagement_rate >= 0.03  # 3%+
    
    @property
    def reach_potential(self) -> str:
        """Estimate reach potential."""
        if self.tier == InfluencerTier.MEGA:
            return "massive"
        elif self.tier in [InfluencerTier.MACRO, InfluencerTier.MID]:
            return "large"
        elif self.tier == InfluencerTier.MICRO:
            return "medium"
        else:
            return "targeted"


@dataclass
class InfluencerMatch:
    """Match result for influencer search."""
    
    profile: InfluencerProfile
    match_score: float = 0.0  # 0-100
    match_reasons: list[str] = field(default_factory=list)
    recommended_approach: str | None = None
    
    @property
    def is_strong_match(self) -> bool:
        """Check if this is a strong niche match."""
        return self.match_score >= 70


@dataclass
class InfluencerReport:
    """Report of influencers found in a niche."""
    
    niche: str
    total_found: int
    
    # By tier
    mega_influencers: list[InfluencerProfile] = field(default_factory=list)
    macro_influencers: list[InfluencerProfile] = field(default_factory=list)
    mid_influencers: list[InfluencerProfile] = field(default_factory=list)
    micro_influencers: list[InfluencerProfile] = field(default_factory=list)
    nano_influencers: list[InfluencerProfile] = field(default_factory=list)
    
    # Top picks
    top_by_engagement: list[InfluencerProfile] = field(default_factory=list)
    top_by_influence: list[InfluencerProfile] = field(default_factory=list)
    top_by_authenticity: list[InfluencerProfile] = field(default_factory=list)
    
    # Insights
    common_topics: list[str] = field(default_factory=list)
    common_hashtags: list[str] = field(default_factory=list)
    avg_engagement_rate: float = 0.0
    
    @property
    def summary(self) -> dict[str, int]:
        """Get tier breakdown summary."""
        return {
            "mega": len(self.mega_influencers),
            "macro": len(self.macro_influencers),
            "mid": len(self.mid_influencers),
            "micro": len(self.micro_influencers),
            "nano": len(self.nano_influencers),
        }


class InfluencerFinder:
    """
    Find influencers in specific niches.
    
    Analyzes accounts to:
    - Identify influencers by tier
    - Calculate engagement and influence scores
    - Match influencers to specific niches
    - Provide outreach recommendations
    
    Example:
        ```python
        finder = InfluencerFinder(provider)
        
        # Find influencers in a niche
        report = await finder.find_in_niche(
            candidates=user_profiles,
            niche="python programming",
            min_followers=5000,
        )
        
        for inf in report.top_by_engagement[:5]:
            print(f"@{inf.username}: {inf.engagement_rate:.2%} engagement")
        
        # Analyze specific account
        profile = await finder.analyze_influencer(profile_data)
        print(f"Influence score: {profile.influence_score}")
        ```
    """
    
    # Tier thresholds
    TIER_THRESHOLDS = {
        InfluencerTier.MEGA: 1_000_000,
        InfluencerTier.MACRO: 500_000,
        InfluencerTier.MID: 100_000,
        InfluencerTier.MICRO: 10_000,
        InfluencerTier.NANO: 1_000,
    }
    
    def __init__(
        self,
        provider: AIProvider | None = None,
    ):
        """
        Initialize influencer finder.
        
        Args:
            provider: AI provider for analysis
        """
        self.provider = provider
    
    def _determine_tier(self, followers: int) -> InfluencerTier:
        """Determine influencer tier based on followers."""
        for tier, threshold in self.TIER_THRESHOLDS.items():
            if followers >= threshold:
                return tier
        return InfluencerTier.NANO
    
    async def analyze_influencer(
        self,
        profile_data: dict[str, Any],
        tweets: list[dict[str, Any]] | None = None,
    ) -> InfluencerProfile:
        """
        Analyze an account as an influencer.
        
        Args:
            profile_data: Profile data dictionary
            tweets: Optional recent tweets for analysis
            
        Returns:
            Influencer profile analysis
        """
        username = profile_data.get("username", "unknown")
        followers = profile_data.get("followers_count", 0)
        following = profile_data.get("following_count", 0)
        tweet_count = profile_data.get("tweet_count", 0) or profile_data.get("statuses_count", 0)
        
        # Determine tier
        tier = self._determine_tier(followers)
        
        # Create base profile
        profile = InfluencerProfile(
            username=username,
            display_name=profile_data.get("name", ""),
            bio=profile_data.get("description", ""),
            followers_count=followers,
            following_count=following,
            tweet_count=tweet_count,
            tier=tier,
            verified=profile_data.get("verified", False),
            has_website=bool(profile_data.get("url")),
            website=profile_data.get("url"),
        )
        
        # Analyze tweets if provided
        if tweets:
            profile = await self._analyze_tweets(profile, tweets)
        
        # Calculate influence score
        profile.influence_score = self._calculate_influence_score(profile)
        
        # Calculate authenticity score
        profile.authenticity_score = self._calculate_authenticity_score(profile, profile_data)
        
        # Extract niches from bio
        profile.niches = self._extract_niches(profile.bio)
        
        # Determine influencer type
        profile.influencer_type = await self._determine_type(profile, profile_data)
        
        return profile
    
    async def _analyze_tweets(
        self,
        profile: InfluencerProfile,
        tweets: list[dict[str, Any]],
    ) -> InfluencerProfile:
        """Analyze tweets to extract engagement metrics."""
        if not tweets:
            return profile
        
        total_likes = 0
        total_retweets = 0
        total_replies = 0
        hashtags: dict[str, int] = {}
        
        for tweet in tweets:
            total_likes += tweet.get("like_count", 0) or tweet.get("favorite_count", 0)
            total_retweets += tweet.get("retweet_count", 0)
            total_replies += tweet.get("reply_count", 0)
            
            # Extract hashtags
            for tag in tweet.get("hashtags", []):
                tag_name = tag.get("tag", tag) if isinstance(tag, dict) else tag
                hashtags[tag_name] = hashtags.get(tag_name, 0) + 1
        
        n = len(tweets)
        profile.avg_likes = total_likes / n
        profile.avg_retweets = total_retweets / n
        profile.avg_replies = total_replies / n
        
        # Calculate engagement rate
        total_engagement = total_likes + total_retweets + total_replies
        if profile.followers_count > 0:
            profile.engagement_rate = (total_engagement / n) / profile.followers_count
        
        # Top hashtags
        sorted_hashtags = sorted(hashtags.items(), key=lambda x: x[1], reverse=True)
        profile.hashtags = [h[0] for h in sorted_hashtags[:10]]
        
        # Calculate posts per day
        if tweets:
            try:
                first_tweet = tweets[-1]
                last_tweet = tweets[0]
                
                first_date = first_tweet.get("created_at")
                last_date = last_tweet.get("created_at")
                
                if first_date and last_date:
                    if isinstance(first_date, str):
                        first_dt = datetime.fromisoformat(first_date.replace("Z", "+00:00"))
                    else:
                        first_dt = first_date
                    if isinstance(last_date, str):
                        last_dt = datetime.fromisoformat(last_date.replace("Z", "+00:00"))
                    else:
                        last_dt = last_date
                    
                    days = max((last_dt - first_dt).days, 1)
                    profile.posts_per_day = len(tweets) / days
            except Exception:
                pass
        
        return profile
    
    def _calculate_influence_score(self, profile: InfluencerProfile) -> float:
        """Calculate overall influence score (0-100)."""
        score = 0.0
        
        # Follower component (up to 40 points)
        if profile.followers_count >= 1_000_000:
            score += 40
        elif profile.followers_count >= 100_000:
            score += 30
        elif profile.followers_count >= 10_000:
            score += 20
        elif profile.followers_count >= 1_000:
            score += 10
        
        # Engagement component (up to 30 points)
        if profile.engagement_rate >= 0.05:
            score += 30
        elif profile.engagement_rate >= 0.03:
            score += 25
        elif profile.engagement_rate >= 0.01:
            score += 15
        elif profile.engagement_rate >= 0.005:
            score += 5
        
        # Activity component (up to 15 points)
        if profile.posts_per_day >= 3:
            score += 15
        elif profile.posts_per_day >= 1:
            score += 10
        elif profile.posts_per_day >= 0.5:
            score += 5
        
        # Verification boost (up to 15 points)
        if profile.verified:
            score += 15
        
        return min(100, score)
    
    def _calculate_authenticity_score(
        self,
        profile: InfluencerProfile,
        profile_data: dict[str, Any],
    ) -> float:
        """Calculate authenticity score (0-100)."""
        score = 50.0  # Base score
        
        # Follower/following ratio
        if profile.following_count > 0:
            ratio = profile.followers_count / profile.following_count
            if ratio > 2:
                score += 15
            elif ratio > 1:
                score += 10
            elif ratio < 0.1:
                score -= 20
        
        # Profile completeness
        has_bio = len(profile.bio) > 20
        has_avatar = bool(profile_data.get("profile_image_url")) and "default" not in profile_data.get("profile_image_url", "")
        has_banner = bool(profile_data.get("profile_banner_url"))
        has_website = profile.has_website
        
        completeness_score = sum([has_bio, has_avatar, has_banner, has_website]) / 4
        score += completeness_score * 20
        
        # Engagement authenticity
        if profile.engagement_rate > 0:
            if 0.01 <= profile.engagement_rate <= 0.15:
                score += 10  # Normal range
            elif profile.engagement_rate > 0.3:
                score -= 15  # Suspiciously high
        
        # Account age (if available)
        created_at = profile_data.get("created_at")
        if created_at:
            try:
                if isinstance(created_at, str):
                    created = datetime.fromisoformat(created_at.replace("Z", "+00:00"))
                else:
                    created = created_at
                
                age_days = (datetime.now(created.tzinfo) - created).days
                if age_days > 365 * 3:
                    score += 10
                elif age_days > 365:
                    score += 5
                elif age_days < 90:
                    score -= 10
            except Exception:
                pass
        
        return max(0, min(100, score))
    
    def _extract_niches(self, bio: str) -> list[str]:
        """Extract potential niches from bio."""
        niches = []
        bio_lower = bio.lower()
        
        # Common niche keywords
        niche_keywords = {
            "crypto": ["crypto", "bitcoin", "btc", "eth", "defi", "web3", "nft"],
            "tech": ["tech", "software", "developer", "engineer", "programming", "code"],
            "ai": ["ai", "ml", "machine learning", "artificial intelligence", "data science"],
            "startup": ["startup", "founder", "entrepreneur", "ceo", "building"],
            "marketing": ["marketing", "growth", "seo", "content", "brand"],
            "finance": ["finance", "investing", "trading", "stocks", "forex"],
            "gaming": ["gaming", "gamer", "esports", "games", "twitch"],
            "art": ["artist", "art", "design", "creative", "nft art"],
            "music": ["music", "producer", "musician", "artist", "dj"],
            "fitness": ["fitness", "health", "gym", "workout", "nutrition"],
        }
        
        for niche, keywords in niche_keywords.items():
            if any(kw in bio_lower for kw in keywords):
                niches.append(niche)
        
        return niches
    
    async def _determine_type(
        self,
        profile: InfluencerProfile,
        profile_data: dict[str, Any],
    ) -> InfluencerType:
        """Determine influencer type."""
        bio_lower = profile.bio.lower()
        
        # Check for specific indicators
        if profile.verified and profile.followers_count > 500_000:
            if any(word in bio_lower for word in ["actor", "musician", "artist", "singer"]):
                return InfluencerType.CELEBRITY
        
        if any(word in bio_lower for word in ["official", "company", "brand", "inc", "ltd"]):
            return InfluencerType.BRAND
        
        if any(word in bio_lower for word in ["founder", "ceo", "cto", "built", "building"]):
            return InfluencerType.THOUGHT_LEADER
        
        if any(word in bio_lower for word in ["teacher", "educator", "professor", "teaching"]):
            return InfluencerType.EDUCATOR
        
        if any(word in bio_lower for word in ["community", "dao", "discord", "moderator"]):
            return InfluencerType.COMMUNITY_BUILDER
        
        if any(word in bio_lower for word in ["expert", "specialist", "consultant", "analyst"]):
            return InfluencerType.INDUSTRY_EXPERT
        
        return InfluencerType.CONTENT_CREATOR
    
    async def find_in_niche(
        self,
        candidates: list[dict[str, Any]],
        niche: str,
        min_followers: int = 1000,
        max_followers: int | None = None,
        min_engagement_rate: float = 0.0,
    ) -> InfluencerReport:
        """
        Find influencers in a specific niche.
        
        Args:
            candidates: List of candidate profiles
            niche: Target niche
            min_followers: Minimum followers
            max_followers: Maximum followers
            min_engagement_rate: Minimum engagement rate
            
        Returns:
            Influencer report
        """
        influencers = []
        niche_lower = niche.lower()
        niche_terms = niche_lower.split()
        
        for candidate in candidates:
            followers = candidate.get("followers_count", 0)
            
            # Apply filters
            if followers < min_followers:
                continue
            if max_followers and followers > max_followers:
                continue
            
            # Check niche relevance
            bio = candidate.get("description", "").lower()
            if not any(term in bio for term in niche_terms):
                continue
            
            # Analyze as influencer
            profile = await self.analyze_influencer(candidate)
            
            # Apply engagement filter
            if profile.engagement_rate < min_engagement_rate:
                continue
            
            influencers.append(profile)
        
        # Sort into tiers
        mega = [i for i in influencers if i.tier == InfluencerTier.MEGA]
        macro = [i for i in influencers if i.tier == InfluencerTier.MACRO]
        mid = [i for i in influencers if i.tier == InfluencerTier.MID]
        micro = [i for i in influencers if i.tier == InfluencerTier.MICRO]
        nano = [i for i in influencers if i.tier == InfluencerTier.NANO]
        
        # Sort each tier by engagement
        for tier_list in [mega, macro, mid, micro, nano]:
            tier_list.sort(key=lambda x: x.engagement_rate, reverse=True)
        
        # Calculate averages
        avg_engagement = (
            sum(i.engagement_rate for i in influencers) / len(influencers)
            if influencers else 0
        )
        
        # Collect common topics/hashtags
        all_hashtags: dict[str, int] = {}
        for inf in influencers:
            for tag in inf.hashtags:
                all_hashtags[tag] = all_hashtags.get(tag, 0) + 1
        
        common_hashtags = sorted(all_hashtags.items(), key=lambda x: x[1], reverse=True)
        
        return InfluencerReport(
            niche=niche,
            total_found=len(influencers),
            mega_influencers=mega,
            macro_influencers=macro,
            mid_influencers=mid,
            micro_influencers=micro,
            nano_influencers=nano,
            top_by_engagement=sorted(influencers, key=lambda x: x.engagement_rate, reverse=True)[:10],
            top_by_influence=sorted(influencers, key=lambda x: x.influence_score, reverse=True)[:10],
            top_by_authenticity=sorted(influencers, key=lambda x: x.authenticity_score, reverse=True)[:10],
            common_hashtags=[h[0] for h in common_hashtags[:10]],
            avg_engagement_rate=avg_engagement,
        )
    
    async def match_influencers(
        self,
        influencers: list[InfluencerProfile],
        criteria: dict[str, Any],
    ) -> list[InfluencerMatch]:
        """
        Match influencers to specific criteria.
        
        Args:
            influencers: Influencers to match
            criteria: Matching criteria
            
        Returns:
            Sorted list of matches
        """
        target_niche = criteria.get("niche", "").lower()
        target_tier = criteria.get("tier")
        min_engagement = criteria.get("min_engagement", 0)
        prefer_verified = criteria.get("prefer_verified", False)
        
        matches = []
        
        for inf in influencers:
            score = 50.0  # Base score
            reasons = []
            
            # Niche match
            if target_niche:
                niche_match = any(target_niche in n.lower() for n in inf.niches)
                bio_match = target_niche in inf.bio.lower()
                
                if niche_match:
                    score += 20
                    reasons.append("Niche match in profile")
                if bio_match:
                    score += 10
                    reasons.append("Keywords in bio")
            
            # Tier preference
            if target_tier and inf.tier.value == target_tier:
                score += 10
                reasons.append(f"Target tier ({target_tier})")
            
            # Engagement
            if inf.engagement_rate >= min_engagement:
                score += min(inf.engagement_rate * 500, 20)
                if inf.is_highly_engaged:
                    reasons.append(f"High engagement ({inf.engagement_rate:.2%})")
            
            # Verification
            if prefer_verified and inf.verified:
                score += 10
                reasons.append("Verified account")
            
            # Authenticity bonus
            if inf.authenticity_score >= 80:
                score += 10
                reasons.append("High authenticity")
            
            matches.append(InfluencerMatch(
                profile=inf,
                match_score=min(100, score),
                match_reasons=reasons,
            ))
        
        # Sort by match score
        matches.sort(key=lambda x: x.match_score, reverse=True)
        
        return matches
    
    async def get_outreach_recommendations(
        self,
        influencer: InfluencerProfile,
    ) -> dict[str, Any]:
        """
        Get recommendations for reaching out to an influencer.
        
        Args:
            influencer: Influencer to reach out to
            
        Returns:
            Outreach recommendations
        """
        recommendations = {
            "influencer": influencer.username,
            "approach": [],
            "talking_points": [],
            "timing": None,
            "warnings": [],
        }
        
        # Approach based on tier
        if influencer.tier in [InfluencerTier.MEGA, InfluencerTier.MACRO]:
            recommendations["approach"].append("Reach out through official channels or PR")
            recommendations["approach"].append("Consider paid partnership")
            recommendations["warnings"].append("May have high inquiry volume")
        elif influencer.tier == InfluencerTier.MID:
            recommendations["approach"].append("DM with personalized message")
            recommendations["approach"].append("Engage with their content first")
        else:
            recommendations["approach"].append("Direct DM or reply to tweets")
            recommendations["approach"].append("Build relationship through engagement")
        
        # Talking points based on type
        if influencer.influencer_type == InfluencerType.THOUGHT_LEADER:
            recommendations["talking_points"].append("Discuss industry trends")
            recommendations["talking_points"].append("Ask for their perspective")
        elif influencer.influencer_type == InfluencerType.EDUCATOR:
            recommendations["talking_points"].append("Reference their educational content")
            recommendations["talking_points"].append("Offer educational collaboration")
        elif influencer.influencer_type == InfluencerType.COMMUNITY_BUILDER:
            recommendations["talking_points"].append("Discuss community value")
            recommendations["talking_points"].append("Offer mutual community benefits")
        
        # Activity-based timing
        if influencer.posts_per_day >= 3:
            recommendations["timing"] = "They're very active - respond quickly to their content"
        elif influencer.posts_per_day >= 1:
            recommendations["timing"] = "Monitor their posting times and engage shortly after"
        else:
            recommendations["timing"] = "Less active - be patient with responses"
        
        return recommendations
