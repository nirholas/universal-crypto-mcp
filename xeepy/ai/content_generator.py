"""
AI Content Generator for X/Twitter.

Generate tweets, replies, threads, and improve existing content.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any

from loguru import logger

from xeepy.ai.providers.base import AIProvider, Message, Role


# Style presets for content generation
STYLES = {
    "helpful": "Be genuinely helpful and add value to the conversation. Provide useful insights or information.",
    "witty": "Be clever and humorous but not offensive. Use wordplay and smart observations.",
    "professional": "Maintain a professional tone suitable for business. Be clear, concise, and respectful.",
    "crypto": "Use crypto Twitter vernacular naturally (WAGMI, based, gm, etc.). Be bullish and community-focused.",
    "tech": "Be technically accurate and enthusiastic about technology. Share interesting insights.",
    "casual": "Be friendly and conversational. Use natural language and show personality.",
    "educational": "Be informative and easy to understand. Break down complex topics.",
    "provocative": "Be thought-provoking and challenge assumptions. Encourage discussion.",
    "supportive": "Be encouraging and positive. Celebrate achievements and support others.",
    "analytical": "Be data-driven and logical. Support claims with reasoning.",
}

# Tone modifiers
TONES = {
    "enthusiastic": "Show excitement and energy.",
    "calm": "Be measured and thoughtful.",
    "urgent": "Convey importance and timeliness.",
    "humorous": "Include appropriate humor.",
    "serious": "Be straightforward without jokes.",
    "empathetic": "Show understanding and compassion.",
}


@dataclass
class GeneratedContent:
    """Result of content generation."""
    
    content: str
    style: str
    tokens_used: int = 0
    metadata: dict[str, Any] = field(default_factory=dict)
    
    @property
    def length(self) -> int:
        """Get content length."""
        return len(self.content)
    
    @property
    def is_valid_tweet(self) -> bool:
        """Check if content fits in a tweet."""
        return self.length <= 280


class ContentGenerator:
    """
    Generate content using AI (comments, tweets, bios).
    
    Supports multiple styles and can generate:
    - Single tweets
    - Replies to tweets
    - Twitter threads
    - Bio text
    - Improved versions of existing content
    
    Example:
        ```python
        generator = ContentGenerator(provider)
        
        # Generate a reply
        reply = await generator.generate_reply(
            tweet_text="Just shipped my first Python package!",
            style="supportive",
        )
        
        # Generate a thread
        thread = await generator.generate_thread(
            topic="Introduction to async Python",
            num_tweets=5,
            style="educational",
        )
        ```
    """
    
    def __init__(
        self,
        provider: AIProvider,
        default_style: str = "helpful",
        max_retries: int = 3,
    ):
        """
        Initialize the content generator.
        
        Args:
            provider: AI provider to use for generation
            default_style: Default style for content
            max_retries: Max retries for generation
        """
        self.provider = provider
        self.default_style = default_style
        self.max_retries = max_retries
    
    def _get_style_prompt(self, style: str, tone: str | None = None) -> str:
        """Build the style instruction prompt."""
        style_desc = STYLES.get(style, STYLES["helpful"])
        prompt = f"Style: {style_desc}"
        
        if tone and tone in TONES:
            prompt += f"\nTone: {TONES[tone]}"
        
        return prompt
    
    async def generate_reply(
        self,
        tweet_text: str,
        style: str = "helpful",
        tone: str | None = None,
        context: dict[str, Any] | None = None,
        max_length: int = 280,
        author_info: dict[str, Any] | None = None,
    ) -> GeneratedContent:
        """
        Generate an appropriate reply to a tweet.
        
        Args:
            tweet_text: The tweet to reply to
            style: Response style ('helpful', 'witty', 'professional', etc.)
            tone: Optional tone modifier
            context: Additional context (thread, user info, etc.)
            max_length: Maximum response length
            author_info: Info about the tweet author
            
        Returns:
            Generated reply content
        """
        style_prompt = self._get_style_prompt(style, tone)
        
        system_prompt = f"""You are a Twitter/X reply generator. Generate engaging, authentic replies.

{style_prompt}

Rules:
- Keep replies under {max_length} characters
- Be natural and human-like
- Don't use hashtags unless relevant
- Don't be sycophantic or generic
- Add value to the conversation
- Match the energy of the original tweet
"""
        
        user_prompt = f"Generate a reply to this tweet:\n\n\"{tweet_text}\""
        
        if context:
            user_prompt += f"\n\nAdditional context: {context}"
        
        if author_info:
            user_prompt += f"\n\nAbout the author: {author_info}"
        
        user_prompt += "\n\nReply (just the text, no quotes):"
        
        try:
            response = await self.provider.complete(
                messages=[
                    Message(Role.SYSTEM, system_prompt),
                    Message(Role.USER, user_prompt),
                ],
                temperature=0.8,
                max_tokens=150,
            )
            
            content = response.content.strip().strip('"').strip("'")
            
            # Ensure it fits
            if len(content) > max_length:
                content = content[:max_length - 3] + "..."
            
            return GeneratedContent(
                content=content,
                style=style,
                tokens_used=response.total_tokens,
                metadata={"original_tweet": tweet_text},
            )
            
        except Exception as e:
            logger.error(f"Failed to generate reply: {e}")
            raise
    
    async def generate_tweet(
        self,
        topic: str,
        style: str = "informative",
        tone: str | None = None,
        hashtags: list[str] | None = None,
        max_length: int = 280,
        include_emoji: bool = True,
    ) -> GeneratedContent:
        """
        Generate a tweet about a topic.
        
        Args:
            topic: Topic to tweet about
            style: Tweet style
            tone: Optional tone modifier
            hashtags: Hashtags to include
            max_length: Maximum length
            include_emoji: Whether to include emojis
            
        Returns:
            Generated tweet content
        """
        style_prompt = self._get_style_prompt(style, tone)
        
        hashtag_budget = 0
        if hashtags:
            hashtag_str = " ".join(f"#{h.lstrip('#')}" for h in hashtags)
            hashtag_budget = len(hashtag_str) + 1
        
        available_length = max_length - hashtag_budget
        
        system_prompt = f"""You are a Twitter/X content creator. Generate engaging tweets.

{style_prompt}

Rules:
- Keep the tweet under {available_length} characters
- Be authentic and interesting
- {"Use appropriate emojis" if include_emoji else "Don't use emojis"}
- Don't include hashtags (they'll be added separately)
- Make it shareable and engaging
"""
        
        user_prompt = f"Create a tweet about: {topic}\n\nTweet (just the text):"
        
        try:
            response = await self.provider.complete(
                messages=[
                    Message(Role.SYSTEM, system_prompt),
                    Message(Role.USER, user_prompt),
                ],
                temperature=0.9,
                max_tokens=100,
            )
            
            content = response.content.strip().strip('"').strip("'")
            
            # Add hashtags
            if hashtags:
                hashtag_str = " ".join(f"#{h.lstrip('#')}" for h in hashtags)
                content = f"{content} {hashtag_str}"
            
            # Ensure it fits
            if len(content) > max_length:
                content = content[:max_length - 3] + "..."
            
            return GeneratedContent(
                content=content,
                style=style,
                tokens_used=response.total_tokens,
                metadata={"topic": topic, "hashtags": hashtags},
            )
            
        except Exception as e:
            logger.error(f"Failed to generate tweet: {e}")
            raise
    
    async def improve_text(
        self,
        text: str,
        goal: str = "engagement",
        preserve_meaning: bool = True,
        max_length: int | None = None,
    ) -> GeneratedContent:
        """
        Improve existing text for better engagement.
        
        Args:
            text: Original text to improve
            goal: Improvement goal ('engagement', 'clarity', 'professionalism')
            preserve_meaning: Keep the original meaning
            max_length: Maximum length for result
            
        Returns:
            Improved text content
        """
        goals = {
            "engagement": "Make it more engaging and likely to get likes/retweets",
            "clarity": "Make it clearer and easier to understand",
            "professionalism": "Make it more professional and polished",
            "concise": "Make it shorter while keeping the message",
            "viral": "Make it more likely to go viral",
        }
        
        goal_desc = goals.get(goal, goals["engagement"])
        max_len = max_length or len(text) + 50
        
        system_prompt = f"""You are a Twitter/X copywriting expert. Improve the given text.

Goal: {goal_desc}

Rules:
- {"Preserve the original meaning" if preserve_meaning else "Feel free to restructure significantly"}
- Keep it under {max_len} characters
- Make it sound natural, not robotic
- Output only the improved text
"""
        
        user_prompt = f"Improve this text:\n\n\"{text}\"\n\nImproved version:"
        
        try:
            response = await self.provider.complete(
                messages=[
                    Message(Role.SYSTEM, system_prompt),
                    Message(Role.USER, user_prompt),
                ],
                temperature=0.7,
                max_tokens=150,
            )
            
            content = response.content.strip().strip('"').strip("'")
            
            if max_length and len(content) > max_length:
                content = content[:max_length - 3] + "..."
            
            return GeneratedContent(
                content=content,
                style=goal,
                tokens_used=response.total_tokens,
                metadata={"original": text, "goal": goal},
            )
            
        except Exception as e:
            logger.error(f"Failed to improve text: {e}")
            raise
    
    async def generate_thread(
        self,
        topic: str,
        num_tweets: int = 5,
        style: str = "educational",
        tone: str | None = None,
        include_hook: bool = True,
        include_cta: bool = True,
    ) -> list[GeneratedContent]:
        """
        Generate a thread on a topic.
        
        Args:
            topic: Topic for the thread
            num_tweets: Number of tweets in thread
            style: Thread style
            tone: Optional tone modifier
            include_hook: Include a hook in first tweet
            include_cta: Include call-to-action at end
            
        Returns:
            List of generated tweets for the thread
        """
        style_prompt = self._get_style_prompt(style, tone)
        
        system_prompt = f"""You are a Twitter/X thread creator. Create engaging, valuable threads.

{style_prompt}

Rules:
- Each tweet must be under 280 characters
- {"Start with a compelling hook" if include_hook else "Start directly with content"}
- {"End with a call-to-action" if include_cta else "End naturally"}
- Make each tweet valuable on its own
- Use natural flow between tweets
- Number format: 1/ 2/ 3/ etc.
- Total tweets: {num_tweets}
"""
        
        user_prompt = f"Create a {num_tweets}-tweet thread about: {topic}\n\nThread:"
        
        try:
            response = await self.provider.complete(
                messages=[
                    Message(Role.SYSTEM, system_prompt),
                    Message(Role.USER, user_prompt),
                ],
                temperature=0.8,
                max_tokens=num_tweets * 100,
            )
            
            # Parse the thread
            content = response.content.strip()
            tweets = []
            
            # Try to split by numbered format
            import re
            pattern = r'(\d+)[/\.]\s*'
            parts = re.split(pattern, content)
            
            # Filter and clean
            current_tweet = ""
            for part in parts:
                part = part.strip()
                if not part:
                    continue
                if part.isdigit():
                    if current_tweet:
                        tweets.append(current_tweet)
                    current_tweet = ""
                else:
                    current_tweet = part.strip('"').strip("'")
            
            if current_tweet:
                tweets.append(current_tweet)
            
            # Ensure we have the right number
            tweets = tweets[:num_tweets]
            
            # Convert to GeneratedContent
            results = []
            for i, tweet in enumerate(tweets):
                if len(tweet) > 280:
                    tweet = tweet[:277] + "..."
                
                results.append(GeneratedContent(
                    content=tweet,
                    style=style,
                    tokens_used=response.total_tokens // len(tweets) if tweets else 0,
                    metadata={"thread_position": i + 1, "topic": topic},
                ))
            
            return results
            
        except Exception as e:
            logger.error(f"Failed to generate thread: {e}")
            raise
    
    async def generate_bio(
        self,
        interests: list[str],
        profession: str | None = None,
        style: str = "professional",
        max_length: int = 160,
        include_emoji: bool = True,
    ) -> GeneratedContent:
        """
        Generate a Twitter/X bio.
        
        Args:
            interests: List of interests/topics
            profession: Professional title/role
            style: Bio style
            max_length: Maximum bio length (Twitter limit is 160)
            include_emoji: Whether to include emojis
            
        Returns:
            Generated bio content
        """
        style_prompt = self._get_style_prompt(style)
        
        system_prompt = f"""You are a Twitter/X bio writer. Create compelling, authentic bios.

{style_prompt}

Rules:
- Keep it under {max_length} characters
- {"Use appropriate emojis" if include_emoji else "No emojis"}
- Be memorable and unique
- Show personality
- Don't use clichés
"""
        
        interests_str = ", ".join(interests)
        user_prompt = f"Create a Twitter bio for someone interested in: {interests_str}"
        
        if profession:
            user_prompt += f"\nProfession: {profession}"
        
        user_prompt += "\n\nBio:"
        
        try:
            response = await self.provider.complete(
                messages=[
                    Message(Role.SYSTEM, system_prompt),
                    Message(Role.USER, user_prompt),
                ],
                temperature=0.9,
                max_tokens=80,
            )
            
            content = response.content.strip().strip('"').strip("'")
            
            if len(content) > max_length:
                content = content[:max_length - 3] + "..."
            
            return GeneratedContent(
                content=content,
                style=style,
                tokens_used=response.total_tokens,
                metadata={"interests": interests, "profession": profession},
            )
            
        except Exception as e:
            logger.error(f"Failed to generate bio: {e}")
            raise
    
    async def generate_quote_tweet(
        self,
        original_tweet: str,
        perspective: str = "agree",
        style: str = "thoughtful",
        max_length: int = 200,  # Leave room for quote
    ) -> GeneratedContent:
        """
        Generate a quote tweet comment.
        
        Args:
            original_tweet: The tweet being quoted
            perspective: 'agree', 'disagree', 'expand', 'question'
            style: Comment style
            max_length: Maximum length
            
        Returns:
            Generated quote tweet content
        """
        perspectives = {
            "agree": "Express agreement and add supporting points",
            "disagree": "Respectfully disagree and explain why",
            "expand": "Expand on the idea with additional insights",
            "question": "Ask a thought-provoking follow-up question",
            "context": "Add helpful context or background",
        }
        
        perspective_desc = perspectives.get(perspective, perspectives["expand"])
        
        system_prompt = f"""You are generating a quote tweet comment.

Perspective: {perspective_desc}
Style: {self._get_style_prompt(style)}

Rules:
- Keep under {max_length} characters
- Be substantive, not just "This!"
- Add value to the conversation
- Be authentic and thoughtful
"""
        
        user_prompt = f"Generate a quote tweet for:\n\n\"{original_tweet}\"\n\nComment:"
        
        try:
            response = await self.provider.complete(
                messages=[
                    Message(Role.SYSTEM, system_prompt),
                    Message(Role.USER, user_prompt),
                ],
                temperature=0.8,
                max_tokens=100,
            )
            
            content = response.content.strip().strip('"').strip("'")
            
            if len(content) > max_length:
                content = content[:max_length - 3] + "..."
            
            return GeneratedContent(
                content=content,
                style=style,
                tokens_used=response.total_tokens,
                metadata={"original": original_tweet, "perspective": perspective},
            )
            
        except Exception as e:
            logger.error(f"Failed to generate quote tweet: {e}")
            raise
