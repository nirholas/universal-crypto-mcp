# SPDX-License-Identifier: MIT
# Copyright (c) 2025 Xeepy Contributors
"""
API Data Models
===============

Pydantic models for request/response validation and serialization.
"""

from datetime import datetime
from enum import Enum
from typing import Any, Generic, Optional, TypeVar
from pydantic import BaseModel, Field, ConfigDict

T = TypeVar("T")


# =============================================================================
# Enums
# =============================================================================


class TaskState(str, Enum):
    """Task execution states."""
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"
    PAUSED = "paused"


class SortOrder(str, Enum):
    """Sort order options."""
    ASC = "asc"
    DESC = "desc"


class ContentType(str, Enum):
    """Content type options."""
    TWEET = "tweet"
    REPLY = "reply"
    THREAD = "thread"
    QUOTE = "quote"
    BIO = "bio"


class SentimentType(str, Enum):
    """Sentiment analysis types."""
    POSITIVE = "positive"
    NEGATIVE = "negative"
    NEUTRAL = "neutral"
    MIXED = "mixed"


class EngagementAction(str, Enum):
    """Engagement action types."""
    LIKE = "like"
    RETWEET = "retweet"
    REPLY = "reply"
    QUOTE = "quote"
    BOOKMARK = "bookmark"
    FOLLOW = "follow"


# =============================================================================
# Base Response Models
# =============================================================================


class APIResponse(BaseModel, Generic[T]):
    """Standard API response wrapper."""
    
    model_config = ConfigDict(populate_by_name=True)
    
    success: bool = Field(default=True, description="Whether the request was successful")
    data: Optional[T] = Field(default=None, description="Response data")
    message: str = Field(default="", description="Human-readable message")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="Response timestamp")
    request_id: Optional[str] = Field(default=None, description="Unique request identifier")
    
    @classmethod
    def ok(cls, data: T, message: str = "Success") -> "APIResponse[T]":
        """Create a successful response."""
        return cls(success=True, data=data, message=message)
    
    @classmethod
    def error(cls, message: str, data: Optional[T] = None) -> "APIResponse[T]":
        """Create an error response."""
        return cls(success=False, data=data, message=message)


class PaginatedResponse(BaseModel, Generic[T]):
    """Paginated response for list endpoints."""
    
    model_config = ConfigDict(populate_by_name=True)
    
    items: list[T] = Field(default_factory=list, description="List of items")
    total: int = Field(default=0, description="Total number of items")
    page: int = Field(default=1, ge=1, description="Current page number")
    page_size: int = Field(default=20, ge=1, le=100, description="Items per page")
    pages: int = Field(default=0, description="Total number of pages")
    has_next: bool = Field(default=False, description="Whether there's a next page")
    has_prev: bool = Field(default=False, description="Whether there's a previous page")
    
    @classmethod
    def create(
        cls,
        items: list[T],
        total: int,
        page: int = 1,
        page_size: int = 20
    ) -> "PaginatedResponse[T]":
        """Create a paginated response."""
        pages = (total + page_size - 1) // page_size if page_size > 0 else 0
        return cls(
            items=items,
            total=total,
            page=page,
            page_size=page_size,
            pages=pages,
            has_next=page < pages,
            has_prev=page > 1,
        )


class ErrorResponse(BaseModel):
    """Error response model."""
    
    success: bool = Field(default=False)
    error_code: str = Field(description="Error code for programmatic handling")
    message: str = Field(description="Human-readable error message")
    details: Optional[dict[str, Any]] = Field(default=None, description="Additional error details")
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    request_id: Optional[str] = Field(default=None)
    
    @classmethod
    def create(
        cls,
        code: str,
        message: str,
        details: Optional[dict] = None
    ) -> "ErrorResponse":
        """Create an error response."""
        return cls(error_code=code, message=message, details=details)


# =============================================================================
# Health & Status Models
# =============================================================================


class ServiceHealth(BaseModel):
    """Individual service health status."""
    
    name: str = Field(description="Service name")
    status: str = Field(description="Service status: healthy, degraded, unhealthy")
    latency_ms: Optional[float] = Field(default=None, description="Response latency in milliseconds")
    last_check: datetime = Field(default_factory=datetime.utcnow)
    message: Optional[str] = Field(default=None, description="Status message")


class HealthCheck(BaseModel):
    """System health check response."""
    
    status: str = Field(default="healthy", description="Overall system status")
    version: str = Field(description="API version")
    uptime_seconds: float = Field(description="Server uptime in seconds")
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    services: list[ServiceHealth] = Field(default_factory=list, description="Individual service statuses")
    
    @property
    def is_healthy(self) -> bool:
        """Check if all services are healthy."""
        return all(s.status == "healthy" for s in self.services)


class TaskStatus(BaseModel):
    """Background task status."""
    
    task_id: str = Field(description="Unique task identifier")
    state: TaskState = Field(default=TaskState.PENDING, description="Current task state")
    progress: float = Field(default=0.0, ge=0.0, le=100.0, description="Progress percentage")
    result: Optional[Any] = Field(default=None, description="Task result if completed")
    error: Optional[str] = Field(default=None, description="Error message if failed")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    started_at: Optional[datetime] = Field(default=None)
    completed_at: Optional[datetime] = Field(default=None)
    metadata: dict[str, Any] = Field(default_factory=dict, description="Additional task metadata")


# =============================================================================
# User & Profile Models
# =============================================================================


class UserProfile(BaseModel):
    """X/Twitter user profile."""
    
    user_id: str = Field(description="User ID")
    username: str = Field(description="@username")
    display_name: str = Field(description="Display name")
    bio: Optional[str] = Field(default=None, description="User bio")
    location: Optional[str] = Field(default=None)
    website: Optional[str] = Field(default=None)
    followers_count: int = Field(default=0)
    following_count: int = Field(default=0)
    tweets_count: int = Field(default=0)
    likes_count: int = Field(default=0)
    is_verified: bool = Field(default=False)
    is_private: bool = Field(default=False)
    profile_image_url: Optional[str] = Field(default=None)
    banner_image_url: Optional[str] = Field(default=None)
    created_at: Optional[datetime] = Field(default=None)
    
    @property
    def follower_ratio(self) -> float:
        """Calculate follower to following ratio."""
        if self.following_count == 0:
            return float(self.followers_count)
        return self.followers_count / self.following_count


class Tweet(BaseModel):
    """Tweet/post model."""
    
    tweet_id: str = Field(description="Tweet ID")
    author: UserProfile = Field(description="Tweet author")
    text: str = Field(description="Tweet text content")
    created_at: datetime = Field(description="Tweet creation time")
    likes_count: int = Field(default=0)
    retweets_count: int = Field(default=0)
    replies_count: int = Field(default=0)
    quotes_count: int = Field(default=0)
    views_count: int = Field(default=0)
    is_reply: bool = Field(default=False)
    is_retweet: bool = Field(default=False)
    is_quote: bool = Field(default=False)
    reply_to_id: Optional[str] = Field(default=None)
    quoted_tweet_id: Optional[str] = Field(default=None)
    media_urls: list[str] = Field(default_factory=list)
    hashtags: list[str] = Field(default_factory=list)
    mentions: list[str] = Field(default_factory=list)
    urls: list[str] = Field(default_factory=list)
    language: Optional[str] = Field(default=None)


# =============================================================================
# Request Models - Scraping
# =============================================================================


class ScrapeProfileRequest(BaseModel):
    """Request to scrape a user profile."""
    
    username: str = Field(description="Username to scrape (without @)")
    include_tweets: bool = Field(default=False, description="Include recent tweets")
    include_followers: bool = Field(default=False, description="Include follower list")
    include_following: bool = Field(default=False, description="Include following list")
    tweet_limit: int = Field(default=20, ge=1, le=200, description="Max tweets to fetch")


class ScrapeFollowersRequest(BaseModel):
    """Request to scrape followers."""
    
    username: str = Field(description="Username to scrape followers from")
    limit: int = Field(default=100, ge=1, le=1000, description="Max followers to fetch")
    cursor: Optional[str] = Field(default=None, description="Pagination cursor")


class ScrapeTweetsRequest(BaseModel):
    """Request to scrape tweets."""
    
    username: Optional[str] = Field(default=None, description="Username to scrape")
    query: Optional[str] = Field(default=None, description="Search query")
    hashtag: Optional[str] = Field(default=None, description="Hashtag to search")
    limit: int = Field(default=50, ge=1, le=500, description="Max tweets to fetch")
    include_replies: bool = Field(default=False)
    since: Optional[datetime] = Field(default=None, description="Tweets since this date")
    until: Optional[datetime] = Field(default=None, description="Tweets until this date")


# =============================================================================
# Request Models - Following
# =============================================================================


class FollowUserRequest(BaseModel):
    """Request to follow a user."""
    
    username: str = Field(description="Username to follow")
    unfollow_after_hours: Optional[int] = Field(
        default=None, ge=1, le=720,
        description="Automatically unfollow after N hours"
    )


class FollowByKeywordRequest(BaseModel):
    """Request to follow users by keyword."""
    
    keywords: list[str] = Field(description="Keywords to search for", min_length=1)
    limit: int = Field(default=10, ge=1, le=100, description="Max users to follow")
    min_followers: int = Field(default=100, ge=0, description="Minimum follower count")
    max_followers: int = Field(default=100000, ge=0, description="Maximum follower count")
    require_bio: bool = Field(default=False, description="Require a bio")
    require_profile_image: bool = Field(default=True, description="Require profile image")
    exclude_verified: bool = Field(default=False, description="Exclude verified accounts")
    language: Optional[str] = Field(default=None, description="Filter by language")


class UnfollowRequest(BaseModel):
    """Request to unfollow users."""
    
    usernames: Optional[list[str]] = Field(default=None, description="Specific usernames")
    unfollow_non_followers: bool = Field(default=False, description="Unfollow non-followers")
    unfollow_inactive_days: Optional[int] = Field(default=None, ge=30, description="Inactive days threshold")
    limit: int = Field(default=50, ge=1, le=500, description="Max to unfollow")
    whitelist: list[str] = Field(default_factory=list, description="Users to never unfollow")


# =============================================================================
# Request Models - Engagement
# =============================================================================


class EngageRequest(BaseModel):
    """Request for engagement actions."""
    
    tweet_id: Optional[str] = Field(default=None, description="Specific tweet ID")
    username: Optional[str] = Field(default=None, description="Target username")
    hashtag: Optional[str] = Field(default=None, description="Target hashtag")
    action: EngagementAction = Field(description="Action to perform")
    content: Optional[str] = Field(default=None, description="Content for reply/quote")
    limit: int = Field(default=10, ge=1, le=100, description="Max engagements")


class AutoEngageConfig(BaseModel):
    """Configuration for auto-engagement."""
    
    enabled: bool = Field(default=True)
    actions: list[EngagementAction] = Field(
        default=[EngagementAction.LIKE],
        description="Actions to perform"
    )
    hashtags: list[str] = Field(default_factory=list, description="Target hashtags")
    keywords: list[str] = Field(default_factory=list, description="Target keywords")
    usernames: list[str] = Field(default_factory=list, description="Target users")
    min_delay_seconds: int = Field(default=30, ge=5, description="Min delay between actions")
    max_delay_seconds: int = Field(default=120, ge=10, description="Max delay between actions")
    daily_limit: int = Field(default=100, ge=1, le=1000, description="Max daily actions")
    skip_verified: bool = Field(default=False)
    skip_private: bool = Field(default=True)
    require_media: bool = Field(default=False)


# =============================================================================
# Request Models - AI Features
# =============================================================================


class GenerateContentRequest(BaseModel):
    """Request to generate AI content."""
    
    content_type: ContentType = Field(description="Type of content to generate")
    topic: Optional[str] = Field(default=None, description="Topic or theme")
    style: str = Field(default="professional", description="Writing style")
    context: Optional[str] = Field(default=None, description="Additional context")
    reply_to_text: Optional[str] = Field(default=None, description="Text being replied to")
    max_length: int = Field(default=280, ge=10, le=4000)
    thread_length: int = Field(default=5, ge=2, le=25, description="Thread length")
    include_hashtags: bool = Field(default=True)
    include_emojis: bool = Field(default=True)
    language: str = Field(default="en")


class AnalyzeSentimentRequest(BaseModel):
    """Request to analyze sentiment."""
    
    texts: list[str] = Field(description="Texts to analyze", min_length=1)
    include_emotions: bool = Field(default=True, description="Include emotion detection")
    include_topics: bool = Field(default=True, description="Extract topics")


class DetectBotsRequest(BaseModel):
    """Request to detect bot accounts."""
    
    usernames: list[str] = Field(description="Usernames to analyze", min_length=1)
    deep_analysis: bool = Field(default=False, description="Perform deep analysis")
    check_tweets: bool = Field(default=True, description="Analyze recent tweets")


class FindTargetsRequest(BaseModel):
    """Request to find target accounts."""
    
    niche: str = Field(description="Target niche or industry")
    goal: str = Field(default="engagement", description="Goal: engagement, followers, leads")
    min_followers: int = Field(default=1000, ge=0)
    max_followers: int = Field(default=100000, ge=0)
    location: Optional[str] = Field(default=None)
    language: Optional[str] = Field(default=None)
    limit: int = Field(default=50, ge=1, le=200)


class CryptoSentimentRequest(BaseModel):
    """Request for crypto sentiment analysis."""
    
    tokens: list[str] = Field(description="Token symbols to analyze", min_length=1)
    include_influencers: bool = Field(default=True)
    time_range_hours: int = Field(default=24, ge=1, le=168)
    detect_shills: bool = Field(default=True)


# =============================================================================
# Response Models - AI Features
# =============================================================================


class GeneratedContent(BaseModel):
    """Generated content response."""
    
    content_type: ContentType
    text: str = Field(description="Generated text")
    texts: list[str] = Field(default_factory=list, description="For threads")
    hashtags: list[str] = Field(default_factory=list)
    estimated_engagement: float = Field(default=0.0, ge=0, le=100)
    alternatives: list[str] = Field(default_factory=list, description="Alternative versions")
    metadata: dict[str, Any] = Field(default_factory=dict)


class SentimentResult(BaseModel):
    """Sentiment analysis result."""
    
    text: str
    sentiment: SentimentType
    confidence: float = Field(ge=0.0, le=1.0)
    scores: dict[str, float] = Field(default_factory=dict)
    emotions: dict[str, float] = Field(default_factory=dict)
    topics: list[str] = Field(default_factory=list)


class BotDetectionResult(BaseModel):
    """Bot detection result."""
    
    username: str
    is_bot: bool
    bot_probability: float = Field(ge=0.0, le=1.0)
    account_type: str = Field(description="human, bot, suspicious, organization")
    red_flags: list[str] = Field(default_factory=list)
    analysis_details: dict[str, Any] = Field(default_factory=dict)


class TargetRecommendation(BaseModel):
    """Target account recommendation."""
    
    username: str
    display_name: str
    followers_count: int
    engagement_rate: float
    relevance_score: float = Field(ge=0.0, le=1.0)
    recommended_actions: list[str] = Field(default_factory=list)
    reasoning: str


class CryptoSentimentResult(BaseModel):
    """Crypto sentiment analysis result."""
    
    token: str
    overall_sentiment: SentimentType
    sentiment_score: float = Field(ge=-1.0, le=1.0)
    tweet_volume: int
    influencer_mentions: int
    shill_alerts: int
    trending_topics: list[str] = Field(default_factory=list)
    key_influencers: list[str] = Field(default_factory=list)
    price_correlation: Optional[float] = Field(default=None)


# =============================================================================
# WebSocket Models
# =============================================================================


class WebSocketMessage(BaseModel):
    """WebSocket message format."""
    
    type: str = Field(description="Message type")
    channel: str = Field(description="Channel/topic")
    data: dict[str, Any] = Field(default_factory=dict)
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class StreamUpdate(BaseModel):
    """Real-time stream update."""
    
    stream_id: str
    update_type: str  # tweet, follow, unfollow, mention, etc.
    payload: dict[str, Any]
    timestamp: datetime = Field(default_factory=datetime.utcnow)


# =============================================================================
# Analytics Models
# =============================================================================


class EngagementMetrics(BaseModel):
    """Engagement analytics."""
    
    period_start: datetime
    period_end: datetime
    total_likes: int = Field(default=0)
    total_retweets: int = Field(default=0)
    total_replies: int = Field(default=0)
    total_follows: int = Field(default=0)
    total_unfollows: int = Field(default=0)
    engagement_rate: float = Field(default=0.0)
    best_performing_tweet: Optional[str] = Field(default=None)
    peak_activity_hour: Optional[int] = Field(default=None, ge=0, le=23)


class GrowthMetrics(BaseModel):
    """Account growth metrics."""
    
    period_start: datetime
    period_end: datetime
    followers_gained: int = Field(default=0)
    followers_lost: int = Field(default=0)
    net_growth: int = Field(default=0)
    growth_rate_percent: float = Field(default=0.0)
    top_sources: list[str] = Field(default_factory=list)


class AnalyticsDashboard(BaseModel):
    """Complete analytics dashboard."""
    
    account_username: str
    generated_at: datetime = Field(default_factory=datetime.utcnow)
    engagement: EngagementMetrics
    growth: GrowthMetrics
    top_tweets: list[Tweet] = Field(default_factory=list)
    audience_insights: dict[str, Any] = Field(default_factory=dict)
    recommendations: list[str] = Field(default_factory=list)
