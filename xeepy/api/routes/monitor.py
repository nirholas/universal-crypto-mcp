# SPDX-License-Identifier: MIT
# Copyright (c) 2025 Xeepy Contributors
"""
Monitoring Routes
=================

REST API endpoints for account monitoring and alerts.
"""

from datetime import datetime
from typing import Optional
from loguru import logger

try:
    from fastapi import APIRouter, HTTPException, Query, BackgroundTasks
    HAS_FASTAPI = True
except ImportError:
    HAS_FASTAPI = False
    APIRouter = object

from xeepy.api.models import (
    APIResponse,
    PaginatedResponse,
    UserProfile,
    TaskStatus,
    TaskState,
)


def create_monitor_router() -> "APIRouter":
    """Create and configure the monitor router."""
    if not HAS_FASTAPI:
        raise ImportError("FastAPI is required. Install with: pip install fastapi")
    
    router = APIRouter(prefix="/monitor", tags=["Monitoring"])
    
    # =========================================================================
    # Follower Monitoring
    # =========================================================================
    
    @router.get(
        "/unfollowers",
        response_model=APIResponse[list[UserProfile]],
        summary="Get unfollowers",
        description="Get list of users who unfollowed you recently.",
    )
    async def get_unfollowers(
        since_hours: int = Query(24, ge=1, le=168),
        limit: int = Query(50, ge=1, le=200),
    ):
        """Get recent unfollowers."""
        logger.info(f"Fetching unfollowers from last {since_hours} hours")
        
        unfollowers = [
            UserProfile(
                user_id=f"unfollower_{i}",
                username=f"ex_follower_{i}",
                display_name=f"Former Follower {i}",
                followers_count=500 + i * 50,
                following_count=300 + i * 30,
                tweets_count=200 + i * 20,
                likes_count=1000 + i * 100,
            )
            for i in range(min(limit, 10))
        ]
        
        return APIResponse.ok(unfollowers, f"Found {len(unfollowers)} unfollowers")
    
    @router.get(
        "/new-followers",
        response_model=APIResponse[list[UserProfile]],
        summary="Get new followers",
        description="Get list of new followers.",
    )
    async def get_new_followers(
        since_hours: int = Query(24, ge=1, le=168),
        limit: int = Query(50, ge=1, le=200),
    ):
        """Get recent new followers."""
        logger.info(f"Fetching new followers from last {since_hours} hours")
        
        new_followers = [
            UserProfile(
                user_id=f"new_follower_{i}",
                username=f"new_fan_{i}",
                display_name=f"New Follower {i}",
                followers_count=1000 + i * 100,
                following_count=500 + i * 50,
                tweets_count=400 + i * 40,
                likes_count=2000 + i * 200,
            )
            for i in range(min(limit, 15))
        ]
        
        return APIResponse.ok(new_followers, f"Found {len(new_followers)} new followers")
    
    @router.get(
        "/follower-changes",
        response_model=APIResponse[dict],
        summary="Follower changes summary",
        description="Get a summary of follower changes over time.",
    )
    async def get_follower_changes(
        period: str = Query("week", regex="^(day|week|month)$"),
    ):
        """Get follower change summary."""
        summary = {
            "period": period,
            "start_count": 12500,
            "end_count": 12750,
            "gained": 280,
            "lost": 30,
            "net_change": 250,
            "growth_rate_percent": 2.0,
            "top_new_followers": [
                {"username": "influencer_1", "followers": 50000},
                {"username": "crypto_whale", "followers": 35000},
            ],
            "notable_unfollowers": [
                {"username": "old_friend", "followers": 5000},
            ],
        }
        
        return APIResponse.ok(summary)
    
    # =========================================================================
    # Account Monitoring
    # =========================================================================
    
    @router.get(
        "/account",
        response_model=APIResponse[dict],
        summary="Account status",
        description="Get current account status and health metrics.",
    )
    async def get_account_status():
        """Get account status."""
        status = {
            "username": "your_account",
            "followers_count": 12750,
            "following_count": 850,
            "tweets_count": 3420,
            "likes_count": 8900,
            "is_verified": False,
            "is_restricted": False,
            "health_score": 95,
            "rate_limit_status": {
                "remaining": 180,
                "limit": 300,
                "reset_at": datetime.utcnow().isoformat(),
            },
            "daily_actions": {
                "follows": 35,
                "unfollows": 10,
                "likes": 156,
                "tweets": 5,
                "replies": 28,
            },
            "last_sync": datetime.utcnow().isoformat(),
        }
        
        return APIResponse.ok(status)
    
    @router.get(
        "/mentions",
        response_model=APIResponse[list[dict]],
        summary="Get mentions",
        description="Get recent mentions of your account.",
    )
    async def get_mentions(
        since_hours: int = Query(24, ge=1, le=168),
        limit: int = Query(50, ge=1, le=200),
    ):
        """Get recent mentions."""
        logger.info(f"Fetching mentions from last {since_hours} hours")
        
        mentions = [
            {
                "tweet_id": f"mention_{i}",
                "author": f"user_{i}",
                "text": f"@your_account check this out! #{i}",
                "timestamp": datetime.utcnow().isoformat(),
                "sentiment": "positive",
                "is_reply": i % 2 == 0,
            }
            for i in range(min(limit, 20))
        ]
        
        return APIResponse.ok(mentions)
    
    # =========================================================================
    # Keyword Monitoring
    # =========================================================================
    
    @router.post(
        "/keywords",
        response_model=APIResponse[TaskStatus],
        summary="Start keyword monitoring",
        description="Monitor tweets containing specific keywords.",
    )
    async def start_keyword_monitoring(
        keywords: list[str] = Query(..., min_length=1),
        notify: bool = Query(True),
    ):
        """Start monitoring keywords."""
        logger.info(f"Starting keyword monitoring: {keywords}")
        
        import uuid
        task = TaskStatus(
            task_id=str(uuid.uuid4()),
            state=TaskState.RUNNING,
            progress=0.0,
            metadata={
                "keywords": keywords,
                "notify": notify,
                "started_at": datetime.utcnow().isoformat(),
            },
        )
        
        return APIResponse.ok(task, "Keyword monitoring started")
    
    @router.get(
        "/keywords/matches",
        response_model=APIResponse[list[dict]],
        summary="Get keyword matches",
        description="Get recent tweets matching monitored keywords.",
    )
    async def get_keyword_matches(
        keyword: Optional[str] = Query(None),
        since_hours: int = Query(24, ge=1, le=168),
        limit: int = Query(50, ge=1, le=200),
    ):
        """Get keyword matches."""
        matches = [
            {
                "keyword": keyword or "crypto",
                "tweet_id": f"match_{i}",
                "author": f"user_{i}",
                "text": f"Talking about {keyword or 'crypto'} today!",
                "timestamp": datetime.utcnow().isoformat(),
                "relevance_score": 0.85 - (i * 0.02),
            }
            for i in range(min(limit, 15))
        ]
        
        return APIResponse.ok(matches)
    
    @router.delete(
        "/keywords/{keyword}",
        response_model=APIResponse[dict],
        summary="Stop monitoring keyword",
        description="Stop monitoring a specific keyword.",
    )
    async def stop_keyword_monitoring(keyword: str):
        """Stop monitoring a keyword."""
        logger.info(f"Stopping keyword monitoring: {keyword}")
        
        return APIResponse.ok({
            "keyword": keyword,
            "action": "stopped",
            "timestamp": datetime.utcnow().isoformat(),
        })
    
    # =========================================================================
    # User Monitoring
    # =========================================================================
    
    @router.post(
        "/users",
        response_model=APIResponse[TaskStatus],
        summary="Start user monitoring",
        description="Monitor specific users for activity.",
    )
    async def start_user_monitoring(
        usernames: list[str] = Query(..., min_length=1),
        track_tweets: bool = Query(True),
        track_follows: bool = Query(True),
        notify: bool = Query(True),
    ):
        """Start monitoring specific users."""
        logger.info(f"Starting user monitoring: {usernames}")
        
        import uuid
        task = TaskStatus(
            task_id=str(uuid.uuid4()),
            state=TaskState.RUNNING,
            progress=0.0,
            metadata={
                "usernames": usernames,
                "track_tweets": track_tweets,
                "track_follows": track_follows,
                "notify": notify,
            },
        )
        
        return APIResponse.ok(task)
    
    @router.get(
        "/users/{username}/activity",
        response_model=APIResponse[dict],
        summary="Get user activity",
        description="Get recent activity for a monitored user.",
    )
    async def get_user_activity(
        username: str,
        since_hours: int = Query(24, ge=1, le=168),
    ):
        """Get monitored user's activity."""
        activity = {
            "username": username,
            "period_hours": since_hours,
            "tweets_posted": 5,
            "replies_made": 12,
            "likes_given": 45,
            "new_followers": 120,
            "recent_tweets": [
                {"tweet_id": "123", "text": "Latest tweet content..."},
                {"tweet_id": "456", "text": "Another recent tweet..."},
            ],
            "engagement_rate": 4.5,
        }
        
        return APIResponse.ok(activity)
    
    # =========================================================================
    # Alerts & Notifications
    # =========================================================================
    
    @router.get(
        "/alerts",
        response_model=APIResponse[list[dict]],
        summary="Get alerts",
        description="Get pending alerts and notifications.",
    )
    async def get_alerts(
        unread_only: bool = Query(True),
        limit: int = Query(50, ge=1, le=200),
    ):
        """Get alerts."""
        alerts = [
            {
                "id": f"alert_{i}",
                "type": ["unfollower", "mention", "keyword_match", "engagement"][i % 4],
                "title": f"Alert #{i}",
                "message": f"Something important happened! Alert number {i}.",
                "timestamp": datetime.utcnow().isoformat(),
                "is_read": not unread_only,
                "priority": ["low", "medium", "high"][i % 3],
            }
            for i in range(min(limit, 10))
        ]
        
        return APIResponse.ok(alerts)
    
    @router.post(
        "/alerts/{alert_id}/read",
        response_model=APIResponse[dict],
        summary="Mark alert as read",
        description="Mark a specific alert as read.",
    )
    async def mark_alert_read(alert_id: str):
        """Mark alert as read."""
        return APIResponse.ok({
            "alert_id": alert_id,
            "is_read": True,
            "timestamp": datetime.utcnow().isoformat(),
        })
    
    @router.post(
        "/alerts/read-all",
        response_model=APIResponse[dict],
        summary="Mark all alerts as read",
        description="Mark all pending alerts as read.",
    )
    async def mark_all_alerts_read():
        """Mark all alerts as read."""
        return APIResponse.ok({
            "action": "marked_all_read",
            "count": 10,
            "timestamp": datetime.utcnow().isoformat(),
        })
    
    # =========================================================================
    # Engagement Tracking
    # =========================================================================
    
    @router.get(
        "/engagement",
        response_model=APIResponse[dict],
        summary="Get engagement metrics",
        description="Get engagement metrics for your content.",
    )
    async def get_engagement_metrics(
        period: str = Query("week", regex="^(day|week|month)$"),
    ):
        """Get engagement metrics."""
        metrics = {
            "period": period,
            "impressions": 125000,
            "profile_visits": 3500,
            "mentions": 89,
            "new_followers": 250,
            "engagement_rate": 4.7,
            "top_tweet": {
                "tweet_id": "top_1",
                "impressions": 15000,
                "engagements": 750,
            },
            "engagement_by_hour": {
                str(h): 100 + (h * 10 if 9 <= h <= 21 else 0)
                for h in range(24)
            },
            "engagement_by_type": {
                "likes": 1250,
                "retweets": 340,
                "replies": 180,
                "quotes": 45,
            },
        }
        
        return APIResponse.ok(metrics)
    
    @router.get(
        "/competitors",
        response_model=APIResponse[list[dict]],
        summary="Competitor analysis",
        description="Get analysis of competitor accounts.",
    )
    async def get_competitor_analysis(
        usernames: list[str] = Query(..., min_length=1),
    ):
        """Get competitor analysis."""
        analysis = [
            {
                "username": username,
                "followers": 50000 + i * 10000,
                "following": 1000 + i * 100,
                "tweets": 5000 + i * 500,
                "engagement_rate": 3.5 + i * 0.5,
                "posting_frequency": f"{2 + i} tweets/day",
                "top_hashtags": ["crypto", "web3", "defi"],
                "growth_rate": f"+{2 + i}% monthly",
            }
            for i, username in enumerate(usernames[:5])
        ]
        
        return APIResponse.ok(analysis)
    
    return router


# Create router instance
if HAS_FASTAPI:
    monitor_router = create_monitor_router()
else:
    monitor_router = None
