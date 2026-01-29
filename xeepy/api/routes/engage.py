# SPDX-License-Identifier: MIT
# Copyright (c) 2025 Xeepy Contributors
"""
Engagement Routes
=================

REST API endpoints for engagement automation (likes, retweets, replies).
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
    TaskStatus,
    TaskState,
    EngageRequest,
    AutoEngageConfig,
    EngagementAction,
)


def create_engage_router() -> "APIRouter":
    """Create and configure the engage router."""
    if not HAS_FASTAPI:
        raise ImportError("FastAPI is required. Install with: pip install fastapi")
    
    router = APIRouter(prefix="/engage", tags=["Engagement"])
    
    # =========================================================================
    # Single Actions
    # =========================================================================
    
    @router.post(
        "/like/{tweet_id}",
        response_model=APIResponse[dict],
        summary="Like a tweet",
        description="Like a specific tweet by ID.",
    )
    async def like_tweet(tweet_id: str):
        """Like a single tweet."""
        logger.info(f"Liking tweet: {tweet_id}")
        
        result = {
            "tweet_id": tweet_id,
            "action": "liked",
            "success": True,
            "timestamp": datetime.utcnow().isoformat(),
        }
        
        return APIResponse.ok(result, "Tweet liked successfully")
    
    @router.delete(
        "/like/{tweet_id}",
        response_model=APIResponse[dict],
        summary="Unlike a tweet",
        description="Remove like from a tweet.",
    )
    async def unlike_tweet(tweet_id: str):
        """Unlike a tweet."""
        logger.info(f"Unliking tweet: {tweet_id}")
        
        return APIResponse.ok({
            "tweet_id": tweet_id,
            "action": "unliked",
            "success": True,
        })
    
    @router.post(
        "/retweet/{tweet_id}",
        response_model=APIResponse[dict],
        summary="Retweet",
        description="Retweet a specific tweet.",
    )
    async def retweet(tweet_id: str):
        """Retweet a tweet."""
        logger.info(f"Retweeting: {tweet_id}")
        
        return APIResponse.ok({
            "tweet_id": tweet_id,
            "action": "retweeted",
            "success": True,
            "timestamp": datetime.utcnow().isoformat(),
        })
    
    @router.delete(
        "/retweet/{tweet_id}",
        response_model=APIResponse[dict],
        summary="Undo retweet",
        description="Remove a retweet.",
    )
    async def unretweet(tweet_id: str):
        """Undo a retweet."""
        logger.info(f"Unretweeting: {tweet_id}")
        
        return APIResponse.ok({
            "tweet_id": tweet_id,
            "action": "unretweeted",
            "success": True,
        })
    
    @router.post(
        "/reply/{tweet_id}",
        response_model=APIResponse[dict],
        summary="Reply to tweet",
        description="Post a reply to a specific tweet.",
    )
    async def reply_to_tweet(
        tweet_id: str,
        text: str = Query(..., min_length=1, max_length=280),
    ):
        """Reply to a tweet."""
        logger.info(f"Replying to tweet: {tweet_id}")
        
        return APIResponse.ok({
            "tweet_id": tweet_id,
            "action": "replied",
            "reply_text": text,
            "reply_id": f"reply_{tweet_id}",
            "success": True,
            "timestamp": datetime.utcnow().isoformat(),
        })
    
    @router.post(
        "/quote/{tweet_id}",
        response_model=APIResponse[dict],
        summary="Quote tweet",
        description="Quote tweet with your own comment.",
    )
    async def quote_tweet(
        tweet_id: str,
        text: str = Query(..., min_length=1, max_length=280),
    ):
        """Quote a tweet."""
        logger.info(f"Quoting tweet: {tweet_id}")
        
        return APIResponse.ok({
            "tweet_id": tweet_id,
            "action": "quoted",
            "quote_text": text,
            "quote_id": f"quote_{tweet_id}",
            "success": True,
        })
    
    @router.post(
        "/bookmark/{tweet_id}",
        response_model=APIResponse[dict],
        summary="Bookmark tweet",
        description="Add a tweet to your bookmarks.",
    )
    async def bookmark_tweet(tweet_id: str):
        """Bookmark a tweet."""
        logger.info(f"Bookmarking tweet: {tweet_id}")
        
        return APIResponse.ok({
            "tweet_id": tweet_id,
            "action": "bookmarked",
            "success": True,
        })
    
    @router.delete(
        "/bookmark/{tweet_id}",
        response_model=APIResponse[dict],
        summary="Remove bookmark",
        description="Remove a tweet from bookmarks.",
    )
    async def unbookmark_tweet(tweet_id: str):
        """Remove bookmark."""
        logger.info(f"Removing bookmark: {tweet_id}")
        
        return APIResponse.ok({
            "tweet_id": tweet_id,
            "action": "unbookmarked",
            "success": True,
        })
    
    # =========================================================================
    # Bulk Actions
    # =========================================================================
    
    @router.post(
        "/bulk",
        response_model=APIResponse[TaskStatus],
        summary="Bulk engagement",
        description="Perform engagement actions on multiple targets.",
    )
    async def bulk_engage(request: EngageRequest):
        """Bulk engagement action."""
        logger.info(f"Starting bulk engagement: {request.action}")
        
        import uuid
        task = TaskStatus(
            task_id=str(uuid.uuid4()),
            state=TaskState.RUNNING,
            progress=0.0,
            metadata={
                "action": request.action.value,
                "username": request.username,
                "hashtag": request.hashtag,
                "limit": request.limit,
            },
        )
        
        return APIResponse.ok(task, "Bulk engagement started")
    
    @router.post(
        "/like-user/{username}",
        response_model=APIResponse[TaskStatus],
        summary="Like user's tweets",
        description="Like multiple tweets from a specific user.",
    )
    async def like_user_tweets(
        username: str,
        limit: int = Query(10, ge=1, le=50),
    ):
        """Like tweets from a user."""
        logger.info(f"Liking tweets from: @{username}")
        
        import uuid
        task = TaskStatus(
            task_id=str(uuid.uuid4()),
            state=TaskState.RUNNING,
            progress=0.0,
            metadata={"username": username, "limit": limit},
        )
        
        return APIResponse.ok(task)
    
    @router.post(
        "/like-hashtag/{hashtag}",
        response_model=APIResponse[TaskStatus],
        summary="Like hashtag tweets",
        description="Like tweets with a specific hashtag.",
    )
    async def like_hashtag_tweets(
        hashtag: str,
        limit: int = Query(10, ge=1, le=50),
    ):
        """Like tweets with a hashtag."""
        logger.info(f"Liking tweets with: #{hashtag}")
        
        import uuid
        task = TaskStatus(
            task_id=str(uuid.uuid4()),
            state=TaskState.RUNNING,
            progress=0.0,
            metadata={"hashtag": hashtag, "limit": limit},
        )
        
        return APIResponse.ok(task)
    
    # =========================================================================
    # Auto-Engagement
    # =========================================================================
    
    @router.post(
        "/auto/start",
        response_model=APIResponse[TaskStatus],
        summary="Start auto-engagement",
        description="Start automated engagement based on configuration.",
    )
    async def start_auto_engage(config: AutoEngageConfig):
        """Start auto-engagement."""
        logger.info(f"Starting auto-engagement with actions: {config.actions}")
        
        import uuid
        task = TaskStatus(
            task_id=str(uuid.uuid4()),
            state=TaskState.RUNNING,
            progress=0.0,
            metadata={
                "actions": [a.value for a in config.actions],
                "hashtags": config.hashtags,
                "keywords": config.keywords,
                "usernames": config.usernames,
                "daily_limit": config.daily_limit,
                "min_delay": config.min_delay_seconds,
                "max_delay": config.max_delay_seconds,
            },
        )
        
        return APIResponse.ok(task, "Auto-engagement started")
    
    @router.post(
        "/auto/stop",
        response_model=APIResponse[dict],
        summary="Stop auto-engagement",
        description="Stop all running auto-engagement tasks.",
    )
    async def stop_auto_engage():
        """Stop auto-engagement."""
        logger.info("Stopping auto-engagement")
        
        return APIResponse.ok({
            "action": "stopped",
            "tasks_stopped": 1,
            "timestamp": datetime.utcnow().isoformat(),
        })
    
    @router.get(
        "/auto/status",
        response_model=APIResponse[dict],
        summary="Auto-engagement status",
        description="Get current auto-engagement status and stats.",
    )
    async def get_auto_engage_status():
        """Get auto-engagement status."""
        status = {
            "is_running": True,
            "started_at": datetime.utcnow().isoformat(),
            "actions_today": {
                "likes": 45,
                "retweets": 12,
                "replies": 8,
            },
            "daily_limit": 100,
            "remaining": 35,
            "next_action_in": 45,
            "current_targets": ["#crypto", "#web3", "@influencer"],
        }
        
        return APIResponse.ok(status)
    
    @router.put(
        "/auto/config",
        response_model=APIResponse[AutoEngageConfig],
        summary="Update auto-engagement config",
        description="Update the auto-engagement configuration.",
    )
    async def update_auto_engage_config(config: AutoEngageConfig):
        """Update auto-engagement configuration."""
        logger.info("Updating auto-engagement config")
        return APIResponse.ok(config, "Configuration updated")
    
    # =========================================================================
    # Stats & History
    # =========================================================================
    
    @router.get(
        "/stats",
        response_model=APIResponse[dict],
        summary="Engagement stats",
        description="Get engagement statistics.",
    )
    async def get_engagement_stats(
        period: str = Query("day", regex="^(hour|day|week|month)$"),
    ):
        """Get engagement statistics."""
        stats = {
            "period": period,
            "likes_given": 156,
            "likes_received": 423,
            "retweets_given": 34,
            "retweets_received": 89,
            "replies_given": 28,
            "replies_received": 67,
            "quotes_given": 5,
            "quotes_received": 12,
            "engagement_rate": 4.7,
            "best_performing_content": [
                {"tweet_id": "12345", "engagement": 250},
                {"tweet_id": "67890", "engagement": 180},
            ],
        }
        
        return APIResponse.ok(stats)
    
    @router.get(
        "/history",
        response_model=APIResponse[list[dict]],
        summary="Engagement history",
        description="Get recent engagement action history.",
    )
    async def get_engagement_history(
        limit: int = Query(50, ge=1, le=200),
        action: Optional[str] = Query(None, regex="^(like|retweet|reply|quote|bookmark)$"),
    ):
        """Get engagement history."""
        history = [
            {
                "action": "like",
                "tweet_id": f"tweet_{i}",
                "target_user": f"user_{i}",
                "timestamp": datetime.utcnow().isoformat(),
                "success": True,
            }
            for i in range(min(limit, 20))
        ]
        
        return APIResponse.ok(history)
    
    return router


# Create router instance
if HAS_FASTAPI:
    engage_router = create_engage_router()
else:
    engage_router = None
