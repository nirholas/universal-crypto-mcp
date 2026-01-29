"""
Sentiment Analyzer for X/Twitter content.

Analyze sentiment of tweets, conversations, and mentions.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from enum import Enum
from typing import Any

from loguru import logger

from xeepy.ai.providers.base import AIProvider, Message, Role


class SentimentLabel(str, Enum):
    """Sentiment classification labels."""
    POSITIVE = "positive"
    NEGATIVE = "negative"
    NEUTRAL = "neutral"
    MIXED = "mixed"


class EmotionType(str, Enum):
    """Emotion types for detailed analysis."""
    JOY = "joy"
    SADNESS = "sadness"
    ANGER = "anger"
    FEAR = "fear"
    SURPRISE = "surprise"
    DISGUST = "disgust"
    TRUST = "trust"
    ANTICIPATION = "anticipation"


@dataclass
class SentimentResult:
    """Result of sentiment analysis on a single piece of text."""
    
    text: str
    score: float  # -1 (negative) to 1 (positive)
    label: SentimentLabel
    confidence: float  # 0 to 1
    emotions: dict[str, float] = field(default_factory=dict)
    reasoning: str | None = None
    
    @property
    def is_positive(self) -> bool:
        """Check if sentiment is positive."""
        return self.label == SentimentLabel.POSITIVE
    
    @property
    def is_negative(self) -> bool:
        """Check if sentiment is negative."""
        return self.label == SentimentLabel.NEGATIVE
    
    @property
    def is_neutral(self) -> bool:
        """Check if sentiment is neutral."""
        return self.label == SentimentLabel.NEUTRAL
    
    @property
    def dominant_emotion(self) -> str | None:
        """Get the dominant emotion if any."""
        if not self.emotions:
            return None
        return max(self.emotions, key=self.emotions.get)


@dataclass
class ConversationSentiment:
    """Sentiment analysis of a conversation/thread."""
    
    tweets: list[SentimentResult]
    overall_score: float
    overall_label: SentimentLabel
    sentiment_trend: str  # 'improving', 'declining', 'stable'
    topics: list[str] = field(default_factory=list)
    summary: str | None = None
    
    @property
    def average_score(self) -> float:
        """Calculate average sentiment score."""
        if not self.tweets:
            return 0.0
        return sum(t.score for t in self.tweets) / len(self.tweets)
    
    @property
    def positive_ratio(self) -> float:
        """Ratio of positive tweets."""
        if not self.tweets:
            return 0.0
        positive = sum(1 for t in self.tweets if t.is_positive)
        return positive / len(self.tweets)


@dataclass
class MentionsSentiment:
    """Sentiment analysis of mentions for a user."""
    
    username: str
    total_analyzed: int
    positive_count: int
    negative_count: int
    neutral_count: int
    average_score: float
    top_positive: list[SentimentResult] = field(default_factory=list)
    top_negative: list[SentimentResult] = field(default_factory=list)
    emotion_breakdown: dict[str, float] = field(default_factory=dict)
    
    @property
    def positive_ratio(self) -> float:
        """Ratio of positive mentions."""
        if self.total_analyzed == 0:
            return 0.0
        return self.positive_count / self.total_analyzed
    
    @property
    def negative_ratio(self) -> float:
        """Ratio of negative mentions."""
        if self.total_analyzed == 0:
            return 0.0
        return self.negative_count / self.total_analyzed
    
    @property
    def sentiment_health(self) -> str:
        """Overall sentiment health indicator."""
        if self.average_score > 0.3:
            return "excellent"
        elif self.average_score > 0.1:
            return "good"
        elif self.average_score > -0.1:
            return "neutral"
        elif self.average_score > -0.3:
            return "concerning"
        else:
            return "critical"


class SentimentAnalyzer:
    """
    Analyze sentiment of tweets and conversations.
    
    Can use either AI providers or local models (VADER) for analysis.
    AI providers give more nuanced results but are slower and cost money.
    
    Example:
        ```python
        analyzer = SentimentAnalyzer(provider)
        
        # Analyze a single tweet
        result = await analyzer.analyze_tweet(
            "This new feature is absolutely amazing! Love it!"
        )
        print(f"Sentiment: {result.label}, Score: {result.score}")
        
        # Analyze a conversation
        conv = await analyzer.analyze_conversation([
            "Great product!",
            "Having some issues...",
            "Support fixed it quickly!",
        ])
        print(f"Overall: {conv.overall_label}, Trend: {conv.sentiment_trend}")
        ```
    """
    
    def __init__(
        self,
        provider: AIProvider | None = None,
        use_local_fallback: bool = True,
    ):
        """
        Initialize the sentiment analyzer.
        
        Args:
            provider: AI provider for advanced analysis
            use_local_fallback: Use VADER for local analysis if provider unavailable
        """
        self.provider = provider
        self.use_local_fallback = use_local_fallback
        self._vader = None
    
    def _get_vader(self):
        """Get or initialize VADER analyzer."""
        if self._vader is None:
            try:
                from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
                self._vader = SentimentIntensityAnalyzer()
            except ImportError:
                logger.warning("VADER not available. Install with: pip install vaderSentiment")
                return None
        return self._vader
    
    async def analyze_tweet(
        self,
        tweet_text: str,
        include_emotions: bool = True,
        use_ai: bool = True,
    ) -> SentimentResult:
        """
        Analyze sentiment of a single tweet.
        
        Args:
            tweet_text: The tweet text to analyze
            include_emotions: Include detailed emotion analysis
            use_ai: Use AI provider (if available)
            
        Returns:
            Sentiment analysis result
        """
        # Use AI if available and requested
        if use_ai and self.provider:
            return await self._analyze_with_ai(tweet_text, include_emotions)
        
        # Fall back to VADER
        if self.use_local_fallback:
            return self._analyze_with_vader(tweet_text)
        
        raise ValueError("No sentiment analysis method available")
    
    async def _analyze_with_ai(
        self,
        text: str,
        include_emotions: bool = True,
    ) -> SentimentResult:
        """Analyze sentiment using AI provider."""
        emotion_instruction = ""
        if include_emotions:
            emotion_instruction = """
Also provide emotion scores (0-1) for:
- joy
- sadness
- anger
- fear
- surprise
- trust
"""
        
        system_prompt = f"""You are a sentiment analyzer. Analyze the sentiment of the given text.

Provide your response in this exact JSON format:
{{
    "score": <float from -1 to 1>,
    "label": "<positive|negative|neutral|mixed>",
    "confidence": <float from 0 to 1>,
    "emotions": {{"joy": 0.0, "sadness": 0.0, "anger": 0.0, "fear": 0.0, "surprise": 0.0, "trust": 0.0}},
    "reasoning": "<brief explanation>"
}}

{emotion_instruction}

Score guide:
- -1.0 to -0.5: Strong negative
- -0.5 to -0.1: Negative
- -0.1 to 0.1: Neutral
- 0.1 to 0.5: Positive
- 0.5 to 1.0: Strong positive
"""
        
        try:
            response = await self.provider.complete(
                messages=[
                    Message(Role.SYSTEM, system_prompt),
                    Message(Role.USER, f"Analyze this text:\n\n\"{text}\""),
                ],
                temperature=0.3,
                max_tokens=300,
            )
            
            # Parse JSON response
            import json
            content = response.content.strip()
            
            # Extract JSON from response
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0]
            elif "```" in content:
                content = content.split("```")[1].split("```")[0]
            
            data = json.loads(content)
            
            return SentimentResult(
                text=text,
                score=float(data.get("score", 0)),
                label=SentimentLabel(data.get("label", "neutral")),
                confidence=float(data.get("confidence", 0.8)),
                emotions=data.get("emotions", {}),
                reasoning=data.get("reasoning"),
            )
            
        except Exception as e:
            logger.warning(f"AI sentiment analysis failed: {e}, falling back to VADER")
            if self.use_local_fallback:
                return self._analyze_with_vader(text)
            raise
    
    def _analyze_with_vader(self, text: str) -> SentimentResult:
        """Analyze sentiment using VADER."""
        vader = self._get_vader()
        
        if vader is None:
            # Return neutral if VADER not available
            return SentimentResult(
                text=text,
                score=0.0,
                label=SentimentLabel.NEUTRAL,
                confidence=0.5,
                emotions={},
                reasoning="VADER not available",
            )
        
        scores = vader.polarity_scores(text)
        compound = scores["compound"]
        
        # Determine label
        if compound >= 0.05:
            label = SentimentLabel.POSITIVE
        elif compound <= -0.05:
            label = SentimentLabel.NEGATIVE
        else:
            label = SentimentLabel.NEUTRAL
        
        # Calculate confidence from extremity of score
        confidence = min(abs(compound) * 1.5, 1.0)
        
        return SentimentResult(
            text=text,
            score=compound,
            label=label,
            confidence=confidence,
            emotions={
                "positive": scores["pos"],
                "negative": scores["neg"],
                "neutral": scores["neu"],
            },
            reasoning="Analyzed with VADER",
        )
    
    async def analyze_conversation(
        self,
        tweets: list[str],
        analyze_trend: bool = True,
    ) -> ConversationSentiment:
        """
        Analyze overall sentiment of a conversation/thread.
        
        Args:
            tweets: List of tweet texts in chronological order
            analyze_trend: Analyze sentiment trend over conversation
            
        Returns:
            Conversation sentiment analysis
        """
        if not tweets:
            return ConversationSentiment(
                tweets=[],
                overall_score=0.0,
                overall_label=SentimentLabel.NEUTRAL,
                sentiment_trend="stable",
            )
        
        # Analyze each tweet
        results = []
        for tweet in tweets:
            result = await self.analyze_tweet(tweet)
            results.append(result)
        
        # Calculate overall score
        overall_score = sum(r.score for r in results) / len(results)
        
        # Determine overall label
        if overall_score > 0.1:
            overall_label = SentimentLabel.POSITIVE
        elif overall_score < -0.1:
            overall_label = SentimentLabel.NEGATIVE
        else:
            overall_label = SentimentLabel.NEUTRAL
        
        # Calculate trend
        trend = "stable"
        if analyze_trend and len(results) >= 3:
            first_half = results[:len(results)//2]
            second_half = results[len(results)//2:]
            
            first_avg = sum(r.score for r in first_half) / len(first_half)
            second_avg = sum(r.score for r in second_half) / len(second_half)
            
            diff = second_avg - first_avg
            if diff > 0.15:
                trend = "improving"
            elif diff < -0.15:
                trend = "declining"
        
        return ConversationSentiment(
            tweets=results,
            overall_score=overall_score,
            overall_label=overall_label,
            sentiment_trend=trend,
        )
    
    async def analyze_mentions(
        self,
        mentions: list[str],
        username: str,
        top_count: int = 5,
    ) -> MentionsSentiment:
        """
        Analyze sentiment of mentions for a user.
        
        Args:
            mentions: List of mention texts
            username: Username being mentioned
            top_count: Number of top positive/negative to keep
            
        Returns:
            Mentions sentiment analysis
        """
        if not mentions:
            return MentionsSentiment(
                username=username,
                total_analyzed=0,
                positive_count=0,
                negative_count=0,
                neutral_count=0,
                average_score=0.0,
            )
        
        # Analyze all mentions
        results = []
        for mention in mentions:
            result = await self.analyze_tweet(mention)
            results.append(result)
        
        # Count by sentiment
        positive = [r for r in results if r.is_positive]
        negative = [r for r in results if r.is_negative]
        neutral = [r for r in results if r.is_neutral]
        
        # Sort and get top results
        positive.sort(key=lambda x: x.score, reverse=True)
        negative.sort(key=lambda x: x.score)
        
        # Aggregate emotions
        emotion_totals: dict[str, float] = {}
        for result in results:
            for emotion, score in result.emotions.items():
                emotion_totals[emotion] = emotion_totals.get(emotion, 0) + score
        
        # Normalize emotions
        emotion_breakdown = {
            k: v / len(results) for k, v in emotion_totals.items()
        }
        
        return MentionsSentiment(
            username=username,
            total_analyzed=len(results),
            positive_count=len(positive),
            negative_count=len(negative),
            neutral_count=len(neutral),
            average_score=sum(r.score for r in results) / len(results),
            top_positive=positive[:top_count],
            top_negative=negative[:top_count],
            emotion_breakdown=emotion_breakdown,
        )
    
    async def compare_sentiment(
        self,
        text_a: str,
        text_b: str,
    ) -> dict[str, Any]:
        """
        Compare sentiment between two pieces of text.
        
        Args:
            text_a: First text
            text_b: Second text
            
        Returns:
            Comparison results
        """
        result_a = await self.analyze_tweet(text_a)
        result_b = await self.analyze_tweet(text_b)
        
        return {
            "text_a": result_a,
            "text_b": result_b,
            "score_difference": result_b.score - result_a.score,
            "more_positive": "a" if result_a.score > result_b.score else "b",
            "significant_difference": abs(result_b.score - result_a.score) > 0.3,
        }
