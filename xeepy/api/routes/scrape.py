# SPDX-License-Identifier: MIT
# Copyright (c) 2025 Xeepy Contributors
"""
Scraping Routes
===============

REST API endpoints for scraping X/Twitter data.
"""

from datetime import datetime
from typing import Optional
from loguru import logger

try:
    from fastapi import APIRouter, Depends, HTTPException, Query, BackgroundTasks
    from fastapi.responses import StreamingResponse
    HAS_FASTAPI = True
except ImportError:
    HAS_FASTAPI = False
    APIRouter = object

from xeepy.api.models import (
    APIResponse,
    PaginatedResponse,
    UserProfile,
    Tweet,
    ScrapeProfileRequest,
    ScrapeFollowersRequest,
    ScrapeTweetsRequest,
)


def create_scrape_router() -> "APIRouter":
    """Create and configure the scrape router."""
    if not HAS_FASTAPI:
        raise ImportError("FastAPI is required. Install with: pip install fastapi")
    
    router = APIRouter(prefix="/scrape", tags=["Scraping"])
    
    # =========================================================================
    # Profile Scraping
    # =========================================================================
    
    @router.get(
        "/profile/{username}",
        response_model=APIResponse[UserProfile],
        summary="Scrape user profile",
        description="Fetch detailed profile information for a X/Twitter user.",
    )
    async def scrape_profile(
        username: str,
        include_tweets: bool = Query(False, description="Include recent tweets"),
        include_followers: bool = Query(False, description="Include follower count details"),
    ):
        """Scrape a user's profile."""
        logger.info(f"Scraping profile: @{username}")
        
        # Demo response
        profile = UserProfile(
            user_id=f"demo_{username}",
            username=username,
            display_name=f"{username.title()} (Demo)",
            bio="This is a demo profile for educational purposes.",
            followers_count=12500,
            following_count=850,
            tweets_count=3420,
            likes_count=8900,
            is_verified=False,
            created_at=datetime(2020, 1, 15),
        )
        
        return APIResponse.ok(profile, f"Profile scraped for @{username}")
    
    @router.post(
        "/profile",
        response_model=APIResponse[UserProfile],
        summary="Scrape profile with options",
        description="Scrape profile with advanced configuration options.",
    )
    async def scrape_profile_advanced(request: ScrapeProfileRequest):
        """Scrape profile with advanced options."""
        logger.info(f"Advanced scrape for: @{request.username}")
        
        profile = UserProfile(
            user_id=f"demo_{request.username}",
            username=request.username,
            display_name=f"{request.username.title()} (Demo)",
            bio="Demo profile with advanced scraping options.",
            followers_count=25000,
            following_count=1200,
            tweets_count=5600,
            likes_count=15000,
            is_verified=True,
        )
        
        return APIResponse.ok(profile)
    
    # =========================================================================
    # Followers/Following
    # =========================================================================
    
    @router.get(
        "/followers/{username}",
        response_model=PaginatedResponse[UserProfile],
        summary="Scrape followers",
        description="Get paginated list of a user's followers.",
    )
    async def scrape_followers(
        username: str,
        page: int = Query(1, ge=1, description="Page number"),
        page_size: int = Query(20, ge=1, le=100, description="Items per page"),
        cursor: Optional[str] = Query(None, description="Pagination cursor"),
    ):
        """Scrape a user's followers."""
        logger.info(f"Scraping followers for: @{username}")
        
        # Demo followers
        followers = [
            UserProfile(
                user_id=f"follower_{i}",
                username=f"user_{i}",
                display_name=f"Demo User {i}",
                followers_count=100 + i * 50,
                following_count=200 + i * 20,
                tweets_count=50 + i * 10,
                likes_count=500 + i * 100,
            )
            for i in range((page - 1) * page_size, page * page_size)
        ]
        
        return PaginatedResponse.create(
            items=followers,
            total=1000,
            page=page,
            page_size=page_size,
        )
    
    @router.get(
        "/following/{username}",
        response_model=PaginatedResponse[UserProfile],
        summary="Scrape following",
        description="Get paginated list of accounts a user follows.",
    )
    async def scrape_following(
        username: str,
        page: int = Query(1, ge=1),
        page_size: int = Query(20, ge=1, le=100),
    ):
        """Scrape accounts a user follows."""
        logger.info(f"Scraping following for: @{username}")
        
        following = [
            UserProfile(
                user_id=f"following_{i}",
                username=f"account_{i}",
                display_name=f"Account {i}",
                followers_count=5000 + i * 100,
                following_count=500 + i * 10,
                tweets_count=1000 + i * 50,
                likes_count=2000 + i * 100,
            )
            for i in range((page - 1) * page_size, page * page_size)
        ]
        
        return PaginatedResponse.create(
            items=following,
            total=500,
            page=page,
            page_size=page_size,
        )
    
    # =========================================================================
    # Tweets
    # =========================================================================
    
    @router.get(
        "/tweets/{username}",
        response_model=PaginatedResponse[Tweet],
        summary="Scrape user tweets",
        description="Get paginated list of a user's tweets.",
    )
    async def scrape_user_tweets(
        username: str,
        page: int = Query(1, ge=1),
        page_size: int = Query(20, ge=1, le=100),
        include_replies: bool = Query(False),
        include_retweets: bool = Query(True),
    ):
        """Scrape a user's tweets."""
        logger.info(f"Scraping tweets for: @{username}")
        
        author = UserProfile(
            user_id=f"demo_{username}",
            username=username,
            display_name=f"{username.title()}",
            followers_count=10000,
            following_count=500,
            tweets_count=2000,
            likes_count=5000,
        )
        
        tweets = [
            Tweet(
                tweet_id=f"tweet_{i}",
                author=author,
                text=f"This is demo tweet #{i} from @{username}. #demo #xeepy",
                created_at=datetime.utcnow(),
                likes_count=100 + i * 10,
                retweets_count=20 + i * 5,
                replies_count=5 + i,
                views_count=1000 + i * 100,
                hashtags=["demo", "xeepy"],
                mentions=[],
            )
            for i in range((page - 1) * page_size, page * page_size)
        ]
        
        return PaginatedResponse.create(
            items=tweets,
            total=500,
            page=page,
            page_size=page_size,
        )
    
    @router.post(
        "/tweets",
        response_model=PaginatedResponse[Tweet],
        summary="Search tweets",
        description="Search for tweets by query, hashtag, or user.",
    )
    async def search_tweets(request: ScrapeTweetsRequest):
        """Search for tweets with advanced filters."""
        logger.info(f"Searching tweets: query={request.query}, hashtag={request.hashtag}")
        
        author = UserProfile(
            user_id="search_user",
            username="searcher",
            display_name="Search Result",
            followers_count=5000,
            following_count=300,
            tweets_count=1000,
            likes_count=2500,
        )
        
        tweets = [
            Tweet(
                tweet_id=f"search_{i}",
                author=author,
                text=f"Search result #{i}: {request.query or request.hashtag or 'trending'} #trending",
                created_at=datetime.utcnow(),
                likes_count=50 + i * 5,
                retweets_count=10 + i * 2,
                replies_count=2 + i,
                views_count=500 + i * 50,
                hashtags=["trending"],
            )
            for i in range(min(request.limit, 20))
        ]
        
        return PaginatedResponse.create(
            items=tweets,
            total=request.limit,
            page=1,
            page_size=request.limit,
        )
    
    @router.get(
        "/hashtag/{tag}",
        response_model=PaginatedResponse[Tweet],
        summary="Scrape hashtag",
        description="Get tweets for a specific hashtag.",
    )
    async def scrape_hashtag(
        tag: str,
        page: int = Query(1, ge=1),
        page_size: int = Query(20, ge=1, le=100),
    ):
        """Scrape tweets with a specific hashtag."""
        logger.info(f"Scraping hashtag: #{tag}")
        
        author = UserProfile(
            user_id="hashtag_user",
            username="hashtaguser",
            display_name="Hashtag User",
            followers_count=2500,
            following_count=400,
            tweets_count=800,
            likes_count=3000,
        )
        
        tweets = [
            Tweet(
                tweet_id=f"hashtag_{i}",
                author=author,
                text=f"Tweeting about #{tag}! This is demo content #{i}.",
                created_at=datetime.utcnow(),
                likes_count=30 + i * 3,
                retweets_count=8 + i,
                replies_count=2,
                views_count=300 + i * 30,
                hashtags=[tag],
            )
            for i in range((page - 1) * page_size, page * page_size)
        ]
        
        return PaginatedResponse.create(
            items=tweets,
            total=200,
            page=page,
            page_size=page_size,
        )
    
    @router.get(
        "/tweet/{tweet_id}",
        response_model=APIResponse[Tweet],
        summary="Get single tweet",
        description="Get detailed information about a specific tweet.",
    )
    async def get_tweet(tweet_id: str):
        """Get a single tweet by ID."""
        logger.info(f"Fetching tweet: {tweet_id}")
        
        author = UserProfile(
            user_id="tweet_author",
            username="author",
            display_name="Tweet Author",
            followers_count=15000,
            following_count=600,
            tweets_count=3000,
            likes_count=8000,
            is_verified=True,
        )
        
        tweet = Tweet(
            tweet_id=tweet_id,
            author=author,
            text="This is a demo tweet fetched by ID. #demo #xeepy",
            created_at=datetime.utcnow(),
            likes_count=250,
            retweets_count=45,
            replies_count=12,
            quotes_count=5,
            views_count=5000,
            hashtags=["demo", "xeepy"],
        )
        
        return APIResponse.ok(tweet)
    
    @router.get(
        "/replies/{tweet_id}",
        response_model=PaginatedResponse[Tweet],
        summary="Get tweet replies",
        description="Get replies to a specific tweet.",
    )
    async def get_tweet_replies(
        tweet_id: str,
        page: int = Query(1, ge=1),
        page_size: int = Query(20, ge=1, le=100),
    ):
        """Get replies to a tweet."""
        logger.info(f"Fetching replies for tweet: {tweet_id}")
        
        replies = [
            Tweet(
                tweet_id=f"reply_{i}",
                author=UserProfile(
                    user_id=f"replier_{i}",
                    username=f"replier{i}",
                    display_name=f"Replier {i}",
                    followers_count=500 + i * 50,
                    following_count=200 + i * 20,
                    tweets_count=100 + i * 10,
                    likes_count=300 + i * 30,
                ),
                text=f"This is reply #{i} to the tweet. Great content!",
                created_at=datetime.utcnow(),
                likes_count=5 + i,
                retweets_count=1,
                replies_count=0,
                views_count=50 + i * 5,
                is_reply=True,
                reply_to_id=tweet_id,
            )
            for i in range((page - 1) * page_size, page * page_size)
        ]
        
        return PaginatedResponse.create(
            items=replies,
            total=50,
            page=page,
            page_size=page_size,
        )
    
    return router


# Create router instance
if HAS_FASTAPI:
    scrape_router = create_scrape_router()
else:
    scrape_router = None
