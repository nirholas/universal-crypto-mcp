# SPDX-License-Identifier: MIT
"""
Test REST API Endpoints
========================

Tests for FastAPI REST API.
"""

import pytest
from unittest.mock import patch


@pytest.mark.asyncio
class TestSystemEndpoints:
    """Test system endpoints."""
    
    async def test_root_endpoint(self, async_client):
        """Test root endpoint."""
        response = await async_client.get("/")
        assert response.status_code == 200
        assert "Xeepy" in response.text
    
    async def test_health_check(self, async_client):
        """Test health check endpoint."""
        response = await async_client.get("/health")
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] is True
        assert "data" in data
        assert data["data"]["status"] == "healthy"
    
    async def test_version_endpoint(self, async_client):
        """Test version endpoint."""
        response = await async_client.get("/version")
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] is True
        assert "version" in data["data"]
    
    async def test_metrics_endpoint(self, async_client):
        """Test metrics endpoint."""
        response = await async_client.get("/metrics")
        assert response.status_code == 200
        assert "xeepy" in response.text.lower()


@pytest.mark.asyncio
class TestScrapeEndpoints:
    """Test scraping endpoints."""
    
    async def test_scrape_profile(self, async_client, mock_user_profile):
        """Test profile scraping endpoint."""
        response = await async_client.get("/api/scrape/profile/testuser")
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] is True
        assert "username" in data["data"]
    
    async def test_scrape_followers(self, async_client):
        """Test followers scraping endpoint."""
        response = await async_client.get(
            "/api/scrape/followers/testuser",
            params={"limit": 10, "page": 1}
        )
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] is True
        assert "items" in data["data"]
        assert "total" in data["data"]
    
    async def test_scrape_tweets(self, async_client):
        """Test tweet scraping endpoint."""
        response = await async_client.post(
            "/api/scrape/tweets",
            json={"keyword": "test", "limit": 10}
        )
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] is True
    
    async def test_scrape_hashtag(self, async_client):
        """Test hashtag scraping endpoint."""
        response = await async_client.get(
            "/api/scrape/hashtag/AI",
            params={"limit": 10}
        )
        assert response.status_code == 200


@pytest.mark.asyncio
class TestFollowEndpoints:
    """Test follow/unfollow endpoints."""
    
    async def test_follow_user(self, async_client):
        """Test follow user endpoint."""
        response = await async_client.post("/api/follow/user/testuser")
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] is True
    
    async def test_unfollow_user(self, async_client):
        """Test unfollow user endpoint."""
        response = await async_client.delete("/api/follow/user/testuser")
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] is True
    
    async def test_follow_by_keyword(self, async_client):
        """Test follow by keyword endpoint."""
        response = await async_client.post(
            "/api/follow/by-keyword",
            json={
                "keyword": "AI",
                "limit": 10,
                "min_followers": 100
            }
        )
        assert response.status_code == 200
    
    async def test_unfollow_non_followers(self, async_client):
        """Test unfollow non-followers endpoint."""
        response = await async_client.delete(
            "/api/follow/non-followers",
            params={"whitelist": "user1,user2"}
        )
        assert response.status_code == 200


@pytest.mark.asyncio
class TestEngageEndpoints:
    """Test engagement endpoints."""
    
    async def test_like_tweet(self, async_client):
        """Test like tweet endpoint."""
        response = await async_client.post("/api/engage/like/123456")
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] is True
    
    async def test_retweet(self, async_client):
        """Test retweet endpoint."""
        response = await async_client.post("/api/engage/retweet/123456")
        assert response.status_code == 200
    
    async def test_reply_tweet(self, async_client):
        """Test reply endpoint."""
        response = await async_client.post(
            "/api/engage/reply/123456",
            json={"text": "Great tweet!"}
        )
        assert response.status_code == 200
    
    async def test_auto_engagement_start(self, async_client):
        """Test start auto-engagement endpoint."""
        response = await async_client.post(
            "/api/engage/auto/start",
            json={
                "keyword": "AI",
                "like_enabled": True,
                "retweet_enabled": False,
                "reply_enabled": True,
                "max_actions_per_hour": 10
            }
        )
        assert response.status_code == 200
    
    async def test_auto_engagement_status(self, async_client):
        """Test auto-engagement status endpoint."""
        response = await async_client.get("/api/engage/auto/status")
        assert response.status_code == 200
    
    async def test_engagement_stats(self, async_client):
        """Test engagement stats endpoint."""
        response = await async_client.get("/api/engage/stats")
        assert response.status_code == 200


@pytest.mark.asyncio
class TestAIEndpoints:
    """Test AI feature endpoints."""
    
    async def test_generate_content(self, async_client, mock_openai_client):
        """Test content generation endpoint."""
        with patch('xeepy.ai.providers.openai.OpenAI') as mock_class:
            mock_class.return_value = mock_openai_client
            
            response = await async_client.post(
                "/api/ai/generate",
                json={
                    "prompt": "AI ethics",
                    "provider": "openai",
                    "content_type": "tweet"
                }
            )
            assert response.status_code == 200
    
    async def test_sentiment_analysis(self, async_client, mock_openai_client):
        """Test sentiment analysis endpoint."""
        with patch('xeepy.ai.providers.openai.OpenAI') as mock_class:
            mock_class.return_value = mock_openai_client
            
            response = await async_client.post(
                "/api/ai/sentiment",
                json={"text": "This is amazing!", "provider": "openai"}
            )
            assert response.status_code == 200
    
    async def test_detect_bots(self, async_client, mock_openai_client):
        """Test bot detection endpoint."""
        with patch('xeepy.ai.providers.openai.OpenAI') as mock_class:
            mock_class.return_value = mock_openai_client
            
            response = await async_client.post(
                "/api/ai/detect-bots",
                json={"usernames": ["user1", "user2"], "provider": "openai"}
            )
            assert response.status_code == 200


@pytest.mark.asyncio
class TestAnalyticsEndpoints:
    """Test analytics endpoints."""
    
    async def test_dashboard(self, async_client):
        """Test analytics dashboard endpoint."""
        response = await async_client.get(
            "/api/analytics/dashboard",
            params={"days": 30}
        )
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] is True
    
    async def test_engagement_metrics(self, async_client):
        """Test engagement metrics endpoint."""
        response = await async_client.get(
            "/api/analytics/engagement",
            params={"days": 7}
        )
        assert response.status_code == 200
    
    async def test_growth_analytics(self, async_client):
        """Test growth analytics endpoint."""
        response = await async_client.get(
            "/api/analytics/growth",
            params={"days": 30}
        )
        assert response.status_code == 200


# =============================================================================
# Error Handling Tests
# =============================================================================

@pytest.mark.asyncio
class TestErrorHandling:
    """Test API error handling."""
    
    async def test_404_error(self, async_client):
        """Test 404 error handling."""
        response = await async_client.get("/nonexistent")
        assert response.status_code == 404
    
    async def test_invalid_json(self, async_client):
        """Test invalid JSON handling."""
        response = await async_client.post(
            "/api/scrape/tweets",
            content="invalid json",
            headers={"Content-Type": "application/json"}
        )
        assert response.status_code == 422


# =============================================================================
# Rate Limiting Tests
# =============================================================================

@pytest.mark.asyncio
class TestRateLimiting:
    """Test rate limiting (if enabled)."""
    
    async def test_rate_limit_headers(self, async_client):
        """Test rate limit headers are present."""
        response = await async_client.get("/health")
        
        # Rate limiting might not be enabled in test mode
        if response.status_code == 429:
            assert "X-RateLimit-Remaining" in response.headers
