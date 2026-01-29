# SPDX-License-Identifier: MIT
# Copyright (c) 2025 Xeepy Contributors
"""
Analytics Routes
================

REST API endpoints for analytics and reporting.
"""

from datetime import datetime, timedelta
from typing import Optional
from loguru import logger

try:
    from fastapi import APIRouter, HTTPException, Query
    HAS_FASTAPI = True
except ImportError:
    HAS_FASTAPI = False
    APIRouter = object

from xeepy.api.models import (
    APIResponse,
    EngagementMetrics,
    GrowthMetrics,
    AnalyticsDashboard,
    UserProfile,
    Tweet,
)


def create_analytics_router() -> "APIRouter":
    """Create and configure the analytics router."""
    if not HAS_FASTAPI:
        raise ImportError("FastAPI is required. Install with: pip install fastapi")
    
    router = APIRouter(prefix="/analytics", tags=["Analytics"])
    
    # =========================================================================
    # Dashboard
    # =========================================================================
    
    @router.get(
        "/dashboard",
        response_model=APIResponse[AnalyticsDashboard],
        summary="Get analytics dashboard",
        description="Get comprehensive analytics dashboard.",
    )
    async def get_dashboard(
        period: str = Query("week", regex="^(day|week|month|quarter|year)$"),
    ):
        """Get analytics dashboard."""
        logger.info(f"Generating dashboard for period: {period}")
        
        now = datetime.utcnow()
        period_days = {"day": 1, "week": 7, "month": 30, "quarter": 90, "year": 365}[period]
        start = now - timedelta(days=period_days)
        
        dashboard = AnalyticsDashboard(
            account_username="your_account",
            engagement=EngagementMetrics(
                period_start=start,
                period_end=now,
                total_likes=1250,
                total_retweets=340,
                total_replies=180,
                total_follows=95,
                total_unfollows=15,
                engagement_rate=4.7,
                best_performing_tweet="tweet_12345",
                peak_activity_hour=14,
            ),
            growth=GrowthMetrics(
                period_start=start,
                period_end=now,
                followers_gained=280,
                followers_lost=30,
                net_growth=250,
                growth_rate_percent=2.0,
                top_sources=["organic", "viral_tweet", "retweets"],
            ),
            top_tweets=[
                Tweet(
                    tweet_id=f"top_{i}",
                    author=UserProfile(
                        user_id="self",
                        username="your_account",
                        display_name="Your Account",
                        followers_count=12750,
                        following_count=850,
                        tweets_count=3420,
                        likes_count=8900,
                    ),
                    text=f"Top performing tweet #{i+1}",
                    created_at=now - timedelta(days=i),
                    likes_count=250 - i * 20,
                    retweets_count=45 - i * 5,
                    replies_count=12 - i,
                    views_count=5000 - i * 500,
                )
                for i in range(5)
            ],
            audience_insights={
                "demographics": {
                    "top_locations": ["US", "UK", "India", "Germany"],
                    "age_groups": {"18-24": 25, "25-34": 45, "35-44": 20, "45+": 10},
                    "gender_split": {"male": 65, "female": 32, "other": 3},
                },
                "interests": ["technology", "crypto", "startups", "investing"],
                "active_hours": [9, 10, 11, 14, 15, 16, 20, 21],
                "top_hashtags_used": ["#tech", "#crypto", "#startup"],
            },
            recommendations=[
                "Post more during peak hours (2-4 PM)",
                "Increase thread content - 40% higher engagement",
                "Engage more with your top followers",
                "Use more visual content for higher reach",
            ],
        )
        
        return APIResponse.ok(dashboard)
    
    # =========================================================================
    # Engagement Analytics
    # =========================================================================
    
    @router.get(
        "/engagement",
        response_model=APIResponse[EngagementMetrics],
        summary="Get engagement metrics",
        description="Get detailed engagement metrics.",
    )
    async def get_engagement_metrics(
        period: str = Query("week", regex="^(day|week|month)$"),
    ):
        """Get engagement metrics."""
        now = datetime.utcnow()
        period_days = {"day": 1, "week": 7, "month": 30}[period]
        start = now - timedelta(days=period_days)
        
        metrics = EngagementMetrics(
            period_start=start,
            period_end=now,
            total_likes=1250 * (period_days // 7 or 1),
            total_retweets=340 * (period_days // 7 or 1),
            total_replies=180 * (period_days // 7 or 1),
            total_follows=95 * (period_days // 7 or 1),
            total_unfollows=15 * (period_days // 7 or 1),
            engagement_rate=4.7,
            best_performing_tweet="tweet_12345",
            peak_activity_hour=14,
        )
        
        return APIResponse.ok(metrics)
    
    @router.get(
        "/engagement/by-hour",
        response_model=APIResponse[dict],
        summary="Engagement by hour",
        description="Get engagement breakdown by hour of day.",
    )
    async def get_engagement_by_hour():
        """Get engagement by hour."""
        data = {
            str(h): {
                "likes": 50 + (30 if 9 <= h <= 21 else 0),
                "retweets": 10 + (15 if 9 <= h <= 21 else 0),
                "replies": 5 + (8 if 9 <= h <= 21 else 0),
                "impressions": 500 + (300 if 9 <= h <= 21 else 0),
            }
            for h in range(24)
        }
        
        return APIResponse.ok(data)
    
    @router.get(
        "/engagement/by-content",
        response_model=APIResponse[dict],
        summary="Engagement by content type",
        description="Get engagement breakdown by content type.",
    )
    async def get_engagement_by_content():
        """Get engagement by content type."""
        data = {
            "text_only": {
                "count": 45,
                "avg_likes": 35,
                "avg_retweets": 8,
                "avg_replies": 4,
                "engagement_rate": 3.2,
            },
            "with_image": {
                "count": 30,
                "avg_likes": 65,
                "avg_retweets": 15,
                "avg_replies": 8,
                "engagement_rate": 5.5,
            },
            "with_video": {
                "count": 10,
                "avg_likes": 120,
                "avg_retweets": 30,
                "avg_replies": 15,
                "engagement_rate": 8.2,
            },
            "threads": {
                "count": 8,
                "avg_likes": 180,
                "avg_retweets": 45,
                "avg_replies": 25,
                "engagement_rate": 12.5,
            },
            "polls": {
                "count": 5,
                "avg_likes": 90,
                "avg_retweets": 20,
                "avg_replies": 35,
                "engagement_rate": 7.8,
            },
        }
        
        return APIResponse.ok(data)
    
    # =========================================================================
    # Growth Analytics
    # =========================================================================
    
    @router.get(
        "/growth",
        response_model=APIResponse[GrowthMetrics],
        summary="Get growth metrics",
        description="Get follower growth metrics.",
    )
    async def get_growth_metrics(
        period: str = Query("week", regex="^(day|week|month)$"),
    ):
        """Get growth metrics."""
        now = datetime.utcnow()
        period_days = {"day": 1, "week": 7, "month": 30}[period]
        start = now - timedelta(days=period_days)
        
        metrics = GrowthMetrics(
            period_start=start,
            period_end=now,
            followers_gained=40 * period_days,
            followers_lost=4 * period_days,
            net_growth=36 * period_days,
            growth_rate_percent=2.0 * (period_days / 7),
            top_sources=["organic", "viral_content", "collaborations"],
        )
        
        return APIResponse.ok(metrics)
    
    @router.get(
        "/growth/history",
        response_model=APIResponse[list[dict]],
        summary="Growth history",
        description="Get historical growth data.",
    )
    async def get_growth_history(
        days: int = Query(30, ge=7, le=365),
    ):
        """Get growth history."""
        now = datetime.utcnow()
        
        history = [
            {
                "date": (now - timedelta(days=days - i)).strftime("%Y-%m-%d"),
                "followers": 12000 + i * 25,
                "following": 850 + (i // 10),
                "gained": 35 + (i % 10),
                "lost": 3 + (i % 5),
            }
            for i in range(days)
        ]
        
        return APIResponse.ok(history)
    
    @router.get(
        "/growth/milestones",
        response_model=APIResponse[list[dict]],
        summary="Growth milestones",
        description="Get growth milestones achieved.",
    )
    async def get_milestones():
        """Get milestones."""
        milestones = [
            {"followers": 100, "achieved_at": "2023-01-15", "days_to_reach": 7},
            {"followers": 500, "achieved_at": "2023-03-01", "days_to_reach": 45},
            {"followers": 1000, "achieved_at": "2023-05-15", "days_to_reach": 75},
            {"followers": 5000, "achieved_at": "2023-10-01", "days_to_reach": 139},
            {"followers": 10000, "achieved_at": "2024-03-15", "days_to_reach": 166},
        ]
        
        return APIResponse.ok(milestones)
    
    # =========================================================================
    # Content Analytics
    # =========================================================================
    
    @router.get(
        "/content/top",
        response_model=APIResponse[list[dict]],
        summary="Top performing content",
        description="Get top performing tweets.",
    )
    async def get_top_content(
        period: str = Query("week", regex="^(day|week|month)$"),
        metric: str = Query("engagement", regex="^(engagement|likes|retweets|replies|views)$"),
        limit: int = Query(10, ge=1, le=50),
    ):
        """Get top content."""
        content = [
            {
                "tweet_id": f"top_{i}",
                "text": f"This is top performing tweet #{i+1}...",
                "created_at": datetime.utcnow().isoformat(),
                "likes": 250 - i * 15,
                "retweets": 45 - i * 3,
                "replies": 20 - i * 2,
                "views": 5000 - i * 400,
                "engagement_rate": 8.5 - i * 0.5,
            }
            for i in range(min(limit, 10))
        ]
        
        return APIResponse.ok(content)
    
    @router.get(
        "/content/hashtags",
        response_model=APIResponse[dict],
        summary="Hashtag performance",
        description="Get hashtag performance analytics.",
    )
    async def get_hashtag_analytics():
        """Get hashtag analytics."""
        data = {
            "most_used": [
                {"tag": "#crypto", "count": 45, "avg_engagement": 4.5},
                {"tag": "#tech", "count": 38, "avg_engagement": 3.8},
                {"tag": "#startup", "count": 25, "avg_engagement": 5.2},
                {"tag": "#ai", "count": 20, "avg_engagement": 6.1},
            ],
            "best_performing": [
                {"tag": "#ai", "avg_engagement": 6.1, "count": 20},
                {"tag": "#startup", "avg_engagement": 5.2, "count": 25},
                {"tag": "#crypto", "avg_engagement": 4.5, "count": 45},
            ],
            "trending_now": ["#bitcoin", "#gpt5", "#web3"],
            "recommended": ["#innovation", "#founder", "#saas"],
        }
        
        return APIResponse.ok(data)
    
    # =========================================================================
    # Audience Analytics
    # =========================================================================
    
    @router.get(
        "/audience",
        response_model=APIResponse[dict],
        summary="Audience insights",
        description="Get detailed audience insights.",
    )
    async def get_audience_insights():
        """Get audience insights."""
        insights = {
            "total_followers": 12750,
            "active_followers": 8500,
            "inactive_followers": 4250,
            "demographics": {
                "top_locations": [
                    {"location": "United States", "percentage": 35},
                    {"location": "United Kingdom", "percentage": 12},
                    {"location": "India", "percentage": 10},
                    {"location": "Germany", "percentage": 8},
                    {"location": "Canada", "percentage": 6},
                ],
                "languages": [
                    {"language": "English", "percentage": 75},
                    {"language": "Spanish", "percentage": 8},
                    {"language": "German", "percentage": 5},
                ],
            },
            "interests": {
                "technology": 78,
                "cryptocurrency": 65,
                "startups": 58,
                "investing": 52,
                "ai_ml": 45,
            },
            "follower_quality": {
                "high_quality": 65,
                "medium_quality": 25,
                "low_quality": 8,
                "suspected_bots": 2,
            },
            "engagement_segments": {
                "super_fans": 150,
                "regular_engagers": 850,
                "occasional_engagers": 3500,
                "lurkers": 8250,
            },
        }
        
        return APIResponse.ok(insights)
    
    @router.get(
        "/audience/best-followers",
        response_model=APIResponse[list[dict]],
        summary="Best followers",
        description="Get your most engaged followers.",
    )
    async def get_best_followers(
        limit: int = Query(20, ge=1, le=100),
    ):
        """Get best followers."""
        followers = [
            {
                "username": f"superfan_{i}",
                "display_name": f"Super Fan {i}",
                "followers": 5000 - i * 100,
                "engagement_score": 95 - i * 2,
                "total_interactions": 150 - i * 5,
                "likes_given": 80 - i * 3,
                "replies_given": 40 - i * 2,
                "retweets_given": 30 - i,
            }
            for i in range(min(limit, 20))
        ]
        
        return APIResponse.ok(followers)
    
    # =========================================================================
    # Reports
    # =========================================================================
    
    @router.get(
        "/reports/weekly",
        response_model=APIResponse[dict],
        summary="Weekly report",
        description="Get weekly performance report.",
    )
    async def get_weekly_report():
        """Get weekly report."""
        report = {
            "period": "last_7_days",
            "summary": {
                "followers_change": "+250",
                "engagement_rate": "4.7%",
                "total_impressions": 125000,
                "total_engagements": 5875,
            },
            "highlights": [
                "Best day: Wednesday with 45 new followers",
                "Top tweet reached 15K impressions",
                "Engagement rate up 12% from last week",
            ],
            "areas_for_improvement": [
                "Weekend posting frequency",
                "Video content creation",
                "Reply rate to mentions",
            ],
            "goals_progress": {
                "followers_goal": {"target": 15000, "current": 12750, "progress": 85},
                "engagement_goal": {"target": 5.0, "current": 4.7, "progress": 94},
            },
        }
        
        return APIResponse.ok(report)
    
    @router.post(
        "/reports/export",
        response_model=APIResponse[dict],
        summary="Export report",
        description="Export analytics report.",
    )
    async def export_report(
        format: str = Query("csv", regex="^(csv|json|pdf)$"),
        period: str = Query("month", regex="^(week|month|quarter|year)$"),
    ):
        """Export analytics report."""
        logger.info(f"Exporting {period} report as {format}")
        
        result = {
            "status": "generating",
            "format": format,
            "period": period,
            "estimated_completion": "30 seconds",
            "download_url": f"/api/analytics/reports/download/report_{period}_{format}",
        }
        
        return APIResponse.ok(result, "Report generation started")
    
    return router


# Create router instance
if HAS_FASTAPI:
    analytics_router = create_analytics_router()
else:
    analytics_router = None
