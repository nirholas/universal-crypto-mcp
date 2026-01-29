"""
Xeepy - X/Twitter Automation Toolkit

⚠️ EDUCATIONAL PURPOSES ONLY - This toolkit demonstrates automation techniques
for research and learning. Do not run these scripts against X/Twitter.
"""

from __future__ import annotations

__version__ = "0.1.0"
__author__ = "Xeepy Contributors"

from xeepy.ai import ContentGenerator, SentimentAnalyzer, SpamDetector, SmartTargeting
from xeepy.ai import CryptoAnalyzer, InfluencerFinder
from xeepy.config import Settings, get_settings

__all__ = [
    "ContentGenerator",
    "SentimentAnalyzer", 
    "SpamDetector",
    "SmartTargeting",
    "CryptoAnalyzer",
    "InfluencerFinder",
    "Settings",
    "get_settings",
]
