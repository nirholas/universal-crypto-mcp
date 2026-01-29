# SPDX-License-Identifier: MIT
"""
Test AI Content Generation
===========================

Tests for AI content generation features.
"""

import pytest
from unittest.mock import AsyncMock, MagicMock, patch


@pytest.mark.asyncio
class TestContentGenerator:
    """Test ContentGenerator class."""
    
    async def test_generate_tweet_openai(self, mock_openai_client):
        """Test tweet generation with OpenAI."""
        from xeepy.ai.features.content import ContentGenerator
        
        with patch('xeepy.ai.providers.openai.OpenAI') as mock_class:
            mock_class.return_value = mock_openai_client
            
            generator = ContentGenerator(provider="openai", api_key="test-key")
            tweet = await generator.generate_tweet(
                topic="AI ethics",
                tone="professional",
                hashtags=["AI", "Ethics"],
            )
            
            assert isinstance(tweet, str)
            assert len(tweet) > 0
            assert len(tweet) <= 280
    
    async def test_generate_thread(self, mock_openai_client):
        """Test thread generation."""
        from xeepy.ai.features.content import ContentGenerator
        
        with patch('xeepy.ai.providers.openai.OpenAI') as mock_class:
            mock_openai_client.chat.completions.create = AsyncMock(return_value=MagicMock(
                choices=[MagicMock(
                    message=MagicMock(content="Tweet 1\n\nTweet 2\n\nTweet 3")
                )]
            ))
            mock_class.return_value = mock_openai_client
            
            generator = ContentGenerator(provider="openai", api_key="test-key")
            thread = await generator.generate_thread(
                topic="Machine Learning",
                num_tweets=3,
            )
            
            assert isinstance(thread, list)
            assert len(thread) == 3
            for tweet in thread:
                assert isinstance(tweet, str)
                assert len(tweet) <= 280
    
    async def test_generate_reply(self, mock_openai_client):
        """Test reply generation."""
        from xeepy.ai.features.content import ContentGenerator
        
        with patch('xeepy.ai.providers.openai.OpenAI') as mock_class:
            mock_class.return_value = mock_openai_client
            
            generator = ContentGenerator(provider="openai", api_key="test-key")
            reply = await generator.generate_reply(
                original_tweet="AI is amazing!",
                tone="thoughtful",
            )
            
            assert isinstance(reply, str)
            assert len(reply) > 0
            assert len(reply) <= 280
    
    async def test_invalid_provider(self):
        """Test with invalid provider."""
        from xeepy.ai.features.content import ContentGenerator
        
        with pytest.raises((ValueError, ImportError)):
            generator = ContentGenerator(provider="invalid_provider")


@pytest.mark.asyncio
class TestSentimentAnalyzer:
    """Test SentimentAnalyzer class."""
    
    async def test_analyze_positive_sentiment(self, mock_openai_client):
        """Test positive sentiment analysis."""
        from xeepy.ai.features.sentiment import SentimentAnalyzer
        
        mock_openai_client.chat.completions.create = AsyncMock(return_value=MagicMock(
            choices=[MagicMock(
                message=MagicMock(content='{"sentiment": "positive", "confidence": 0.95, "engagement_potential": 0.85}')
            )]
        ))
        
        with patch('xeepy.ai.providers.openai.OpenAI') as mock_class:
            mock_class.return_value = mock_openai_client
            
            analyzer = SentimentAnalyzer(provider="openai", api_key="test-key")
            result = await analyzer.analyze_text("This is amazing! I love it!")
            
            assert result.sentiment == "positive"
            assert result.confidence >= 0.8
            assert result.engagement_potential > 0
    
    async def test_analyze_negative_sentiment(self, mock_openai_client):
        """Test negative sentiment analysis."""
        from xeepy.ai.features.sentiment import SentimentAnalyzer
        
        mock_openai_client.chat.completions.create = AsyncMock(return_value=MagicMock(
            choices=[MagicMock(
                message=MagicMock(content='{"sentiment": "negative", "confidence": 0.90, "engagement_potential": 0.40}')
            )]
        ))
        
        with patch('xeepy.ai.providers.openai.OpenAI') as mock_class:
            mock_class.return_value = mock_openai_client
            
            analyzer = SentimentAnalyzer(provider="openai", api_key="test-key")
            result = await analyzer.analyze_text("This is terrible. I hate it.")
            
            assert result.sentiment == "negative"
            assert result.confidence >= 0.8


@pytest.mark.asyncio
class TestSpamDetector:
    """Test SpamDetector class."""
    
    async def test_detect_spam(self, mock_openai_client):
        """Test spam detection."""
        from xeepy.ai.features.spam import SpamDetector
        
        mock_openai_client.chat.completions.create = AsyncMock(return_value=MagicMock(
            choices=[MagicMock(
                message=MagicMock(content='{"is_spam": true, "confidence": 0.95, "spam_type": "commercial"}')
            )]
        ))
        
        with patch('xeepy.ai.providers.openai.OpenAI') as mock_class:
            mock_class.return_value = mock_openai_client
            
            detector = SpamDetector(provider="openai", api_key="test-key")
            result = await detector.is_spam("Click here to win $1000000!!!")
            
            assert result is True
    
    async def test_detect_bot(self, mock_openai_client):
        """Test bot detection."""
        from xeepy.ai.features.spam import SpamDetector
        
        mock_openai_client.chat.completions.create = AsyncMock(return_value=MagicMock(
            choices=[MagicMock(
                message=MagicMock(content='{"is_bot": true, "confidence": 0.88, "bot_indicators": ["automated posting"]}')
            )]
        ))
        
        with patch('xeepy.ai.providers.openai.OpenAI') as mock_class:
            mock_class.return_value = mock_openai_client
            
            detector = SpamDetector(provider="openai", api_key="test-key")
            result = await detector.is_likely_bot("botuser123")
            
            assert result.is_bot is True
            assert result.confidence >= 0.8


@pytest.mark.asyncio
class TestSmartTargeting:
    """Test SmartTargeting class."""
    
    async def test_find_relevant_accounts(self, mock_openai_client):
        """Test finding relevant accounts."""
        from xeepy.ai.features.targeting import SmartTargeting
        
        with patch('xeepy.ai.providers.openai.OpenAI') as mock_class:
            mock_class.return_value = mock_openai_client
            
            targeting = SmartTargeting(provider="openai", api_key="test-key")
            accounts = await targeting.find_relevant_accounts(
                interests=["AI", "Machine Learning"],
                min_followers=1000,
                limit=10,
            )
            
            assert isinstance(accounts, list)
            assert len(accounts) <= 10
            for account in accounts:
                assert hasattr(account, 'username')
                assert hasattr(account, 'relevance_score')


@pytest.mark.asyncio
class TestCryptoAnalyzer:
    """Test CryptoAnalyzer class."""
    
    async def test_analyze_token_sentiment(self, mock_openai_client):
        """Test crypto token sentiment analysis."""
        from xeepy.ai.features.crypto import CryptoAnalyzer
        
        mock_openai_client.chat.completions.create = AsyncMock(return_value=MagicMock(
            choices=[MagicMock(
                message=MagicMock(content='{"overall_sentiment": "bullish", "confidence": 0.85, "mention_count": 1500}')
            )]
        ))
        
        with patch('xeepy.ai.providers.openai.OpenAI') as mock_class:
            mock_class.return_value = mock_openai_client
            
            analyzer = CryptoAnalyzer(provider="openai", api_key="test-key")
            result = await analyzer.analyze_token_sentiment(
                token="BTC",
                timeframe="24h",
            )
            
            assert result.overall_sentiment in ["bullish", "bearish", "neutral"]
            assert result.confidence > 0
            assert result.mention_count >= 0


# =============================================================================
# Integration Tests
# =============================================================================

@pytest.mark.integration
@pytest.mark.asyncio
class TestAIIntegration:
    """Integration tests for AI features."""
    
    async def test_content_pipeline(self, mock_openai_client):
        """Test full content generation pipeline."""
        from xeepy.ai.features.content import ContentGenerator
        from xeepy.ai.features.sentiment import SentimentAnalyzer
        
        with patch('xeepy.ai.providers.openai.OpenAI') as mock_class:
            mock_class.return_value = mock_openai_client
            
            # Generate content
            generator = ContentGenerator(provider="openai", api_key="test-key")
            tweet = await generator.generate_tweet(topic="AI")
            
            # Analyze sentiment
            mock_openai_client.chat.completions.create = AsyncMock(return_value=MagicMock(
                choices=[MagicMock(
                    message=MagicMock(content='{"sentiment": "positive", "confidence": 0.9, "engagement_potential": 0.8}')
                )]
            ))
            
            analyzer = SentimentAnalyzer(provider="openai", api_key="test-key")
            sentiment = await analyzer.analyze_text(tweet)
            
            assert isinstance(tweet, str)
            assert sentiment.confidence > 0
