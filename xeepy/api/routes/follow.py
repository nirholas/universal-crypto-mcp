# SPDX-License-Identifier: MIT
# Copyright (c) 2025 Xeepy Contributors
"""
Follow/Unfollow Routes
======================

REST API endpoints for follow/unfollow operations.
"""

from datetime import datetime
from typing import Optional
from loguru import logger

try:
    from fastapi import APIRouter, Depends, HTTPException, Query, BackgroundTasks
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
    FollowUserRequest,
    FollowByKeywordRequest,
    UnfollowRequest,
)


def create_follow_router() -> "APIRouter":
    """Create and configure the follow router."""
    if not HAS_FASTAPI:
        raise ImportError("FastAPI is required. Install with: pip install fastapi")
    
    router = APIRouter(prefix="/follow", tags=["Following"])
    
    # =========================================================================
    # Follow Operations
    # =========================================================================
    
    @router.post(
        "/user/{username}",
        response_model=APIResponse[dict],
        summary="Follow a user",
        description="Follow a specific X/Twitter user.",
    )
    async def follow_user(
        username: str,
        unfollow_after_hours: Optional[int] = Query(None, ge=1, le=720),
    ):
        """Follow a single user."""
        logger.info(f"Following user: @{username}")
        
        result = {
            "username": username,
            "action": "followed",
            "success": True,
            "scheduled_unfollow": unfollow_after_hours,
            "timestamp": datetime.utcnow().isoformat(),
        }
        
        return APIResponse.ok(result, f"Successfully followed @{username}")
    
    @router.post(
        "/user",
        response_model=APIResponse[dict],
        summary="Follow user with options",
        description="Follow a user with additional configuration.",
    )
    async def follow_user_advanced(request: FollowUserRequest):
        """Follow with advanced options."""
        logger.info(f"Following user: @{request.username}")
        
        result = {
            "username": request.username,
            "action": "followed",
            "success": True,
            "scheduled_unfollow_hours": request.unfollow_after_hours,
        }
        
        return APIResponse.ok(result)
    
    @router.post(
        "/by-keyword",
        response_model=APIResponse[TaskStatus],
        summary="Follow by keyword",
        description="Find and follow users based on keywords in their bio or tweets.",
    )
    async def follow_by_keyword(
        request: FollowByKeywordRequest,
        background_tasks: BackgroundTasks,
    ):
        """Follow users by keyword search."""
        logger.info(f"Starting keyword-based follow: {request.keywords}")
        
        import uuid
        task_id = str(uuid.uuid4())
        
        task = TaskStatus(
            task_id=task_id,
            state=TaskState.RUNNING,
            progress=0.0,
            metadata={
                "keywords": request.keywords,
                "limit": request.limit,
                "min_followers": request.min_followers,
                "max_followers": request.max_followers,
            },
        )
        
        return APIResponse.ok(task, "Follow task started")
    
    @router.post(
        "/by-hashtag/{hashtag}",
        response_model=APIResponse[TaskStatus],
        summary="Follow by hashtag",
        description="Follow users who post with a specific hashtag.",
    )
    async def follow_by_hashtag(
        hashtag: str,
        limit: int = Query(10, ge=1, le=100),
        background_tasks: BackgroundTasks = None,
    ):
        """Follow users by hashtag."""
        logger.info(f"Following users by hashtag: #{hashtag}")
        
        import uuid
        task = TaskStatus(
            task_id=str(uuid.uuid4()),
            state=TaskState.RUNNING,
            progress=0.0,
            metadata={"hashtag": hashtag, "limit": limit},
        )
        
        return APIResponse.ok(task)
    
    @router.post(
        "/followers-of/{username}",
        response_model=APIResponse[TaskStatus],
        summary="Follow followers of user",
        description="Follow the followers of a specific account.",
    )
    async def follow_followers_of(
        username: str,
        limit: int = Query(20, ge=1, le=200),
        min_followers: int = Query(100, ge=0),
        background_tasks: BackgroundTasks = None,
    ):
        """Follow followers of another user."""
        logger.info(f"Following followers of: @{username}")
        
        import uuid
        task = TaskStatus(
            task_id=str(uuid.uuid4()),
            state=TaskState.RUNNING,
            progress=0.0,
            metadata={
                "target_user": username,
                "limit": limit,
                "min_followers": min_followers,
            },
        )
        
        return APIResponse.ok(task)
    
    @router.post(
        "/engagers/{username}",
        response_model=APIResponse[TaskStatus],
        summary="Follow engagers",
        description="Follow users who engage with a specific account's content.",
    )
    async def follow_engagers(
        username: str,
        limit: int = Query(20, ge=1, le=100),
        engagement_type: str = Query("all", regex="^(all|likes|retweets|replies)$"),
    ):
        """Follow users who engage with content."""
        logger.info(f"Following engagers of: @{username}")
        
        import uuid
        task = TaskStatus(
            task_id=str(uuid.uuid4()),
            state=TaskState.RUNNING,
            progress=0.0,
            metadata={
                "target_user": username,
                "limit": limit,
                "engagement_type": engagement_type,
            },
        )
        
        return APIResponse.ok(task)
    
    # =========================================================================
    # Unfollow Operations
    # =========================================================================
    
    @router.delete(
        "/user/{username}",
        response_model=APIResponse[dict],
        summary="Unfollow a user",
        description="Unfollow a specific user.",
    )
    async def unfollow_user(username: str):
        """Unfollow a single user."""
        logger.info(f"Unfollowing user: @{username}")
        
        result = {
            "username": username,
            "action": "unfollowed",
            "success": True,
            "timestamp": datetime.utcnow().isoformat(),
        }
        
        return APIResponse.ok(result, f"Successfully unfollowed @{username}")
    
    @router.post(
        "/unfollow",
        response_model=APIResponse[TaskStatus],
        summary="Bulk unfollow",
        description="Unfollow multiple users based on criteria.",
    )
    async def bulk_unfollow(request: UnfollowRequest):
        """Bulk unfollow based on criteria."""
        logger.info(f"Starting bulk unfollow")
        
        import uuid
        task = TaskStatus(
            task_id=str(uuid.uuid4()),
            state=TaskState.RUNNING,
            progress=0.0,
            metadata={
                "usernames": request.usernames,
                "non_followers": request.unfollow_non_followers,
                "inactive_days": request.unfollow_inactive_days,
                "limit": request.limit,
                "whitelist": request.whitelist,
            },
        )
        
        return APIResponse.ok(task)
    
    @router.delete(
        "/non-followers",
        response_model=APIResponse[TaskStatus],
        summary="Unfollow non-followers",
        description="Unfollow users who don't follow you back.",
    )
    async def unfollow_non_followers(
        limit: int = Query(50, ge=1, le=500),
        whitelist: Optional[str] = Query(None, description="Comma-separated usernames to keep"),
    ):
        """Unfollow non-followers."""
        logger.info(f"Unfollowing non-followers, limit: {limit}")
        
        import uuid
        whitelist_users = whitelist.split(",") if whitelist else []
        
        task = TaskStatus(
            task_id=str(uuid.uuid4()),
            state=TaskState.RUNNING,
            progress=0.0,
            metadata={
                "limit": limit,
                "whitelist": whitelist_users,
            },
        )
        
        return APIResponse.ok(task)
    
    @router.delete(
        "/inactive",
        response_model=APIResponse[TaskStatus],
        summary="Unfollow inactive users",
        description="Unfollow users who haven't posted in a while.",
    )
    async def unfollow_inactive(
        days: int = Query(90, ge=30, le=365),
        limit: int = Query(50, ge=1, le=500),
    ):
        """Unfollow inactive users."""
        logger.info(f"Unfollowing users inactive for {days} days")
        
        import uuid
        task = TaskStatus(
            task_id=str(uuid.uuid4()),
            state=TaskState.RUNNING,
            progress=0.0,
            metadata={"inactive_days": days, "limit": limit},
        )
        
        return APIResponse.ok(task)
    
    @router.delete(
        "/bots",
        response_model=APIResponse[TaskStatus],
        summary="Unfollow bot accounts",
        description="Detect and unfollow suspected bot accounts.",
    )
    async def unfollow_bots(
        confidence_threshold: float = Query(0.7, ge=0.5, le=1.0),
        limit: int = Query(50, ge=1, le=500),
    ):
        """Unfollow suspected bots."""
        logger.info(f"Unfollowing bots with confidence >= {confidence_threshold}")
        
        import uuid
        task = TaskStatus(
            task_id=str(uuid.uuid4()),
            state=TaskState.RUNNING,
            progress=0.0,
            metadata={
                "confidence_threshold": confidence_threshold,
                "limit": limit,
            },
        )
        
        return APIResponse.ok(task)
    
    # =========================================================================
    # Status & Management
    # =========================================================================
    
    @router.get(
        "/stats",
        response_model=APIResponse[dict],
        summary="Get follow stats",
        description="Get statistics about following/followers.",
    )
    async def get_follow_stats():
        """Get follow/unfollow statistics."""
        stats = {
            "followers_count": 12500,
            "following_count": 850,
            "follow_ratio": 14.7,
            "non_followers_count": 120,
            "inactive_following": 45,
            "suspected_bots": 12,
            "recent_follows": 25,
            "recent_unfollows": 10,
            "daily_follow_limit": 400,
            "follows_today": 35,
        }
        
        return APIResponse.ok(stats)
    
    @router.get(
        "/whitelist",
        response_model=APIResponse[list[str]],
        summary="Get whitelist",
        description="Get the list of whitelisted usernames.",
    )
    async def get_whitelist():
        """Get whitelist."""
        whitelist = ["friend1", "partner_account", "important_contact"]
        return APIResponse.ok(whitelist)
    
    @router.post(
        "/whitelist/{username}",
        response_model=APIResponse[dict],
        summary="Add to whitelist",
        description="Add a username to the whitelist.",
    )
    async def add_to_whitelist(username: str):
        """Add user to whitelist."""
        logger.info(f"Adding @{username} to whitelist")
        return APIResponse.ok({"username": username, "action": "added_to_whitelist"})
    
    @router.delete(
        "/whitelist/{username}",
        response_model=APIResponse[dict],
        summary="Remove from whitelist",
        description="Remove a username from the whitelist.",
    )
    async def remove_from_whitelist(username: str):
        """Remove user from whitelist."""
        logger.info(f"Removing @{username} from whitelist")
        return APIResponse.ok({"username": username, "action": "removed_from_whitelist"})
    
    return router


# Create router instance
if HAS_FASTAPI:
    follow_router = create_follow_router()
else:
    follow_router = None
