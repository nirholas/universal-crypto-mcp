"""
AI-powered features for Xeepy.

This module provides AI capabilities for content generation,
sentiment analysis, spam detection, and smart targeting.
"""

from __future__ import annotations

from xeepy.ai.content_generator import ContentGenerator
from xeepy.ai.sentiment_analyzer import SentimentAnalyzer, SentimentResult
from xeepy.ai.spam_detector import SpamDetector, BotScore, FollowerQualityReport
from xeepy.ai.smart_targeting import SmartTargeting, TargetRecommendation, TargetAnalysis
from xeepy.ai.crypto_analyzer import CryptoAnalyzer, TokenSentiment
from xeepy.ai.influencer_finder import InfluencerFinder, InfluencerProfile

__all__ = [
    # Core classes
    "ContentGenerator",
    "SentimentAnalyzer",
    "SpamDetector",
    "SmartTargeting",
    "CryptoAnalyzer",
    "InfluencerFinder",
    # Data classes
    "SentimentResult",
    "BotScore",
    "FollowerQualityReport",
    "TargetRecommendation",
    "TargetAnalysis",
    "TokenSentiment",
    "InfluencerProfile",
]
