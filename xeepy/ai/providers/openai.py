"""
OpenAI Provider implementation.

Supports GPT-4, GPT-3.5-turbo, and other OpenAI models.
"""

from __future__ import annotations

import os
from typing import AsyncIterator, Any

from loguru import logger

from xeepy.ai.providers.base import (
    AIProvider,
    AIProviderError,
    AuthenticationError,
    RateLimitError,
    InvalidRequestError,
    Message,
    Completion,
)


class OpenAIProvider(AIProvider):
    """
    OpenAI API provider.
    
    Supports:
    - GPT-4 and GPT-4 Turbo
    - GPT-3.5 Turbo
    - Text embeddings
    
    Example:
        ```python
        provider = OpenAIProvider(api_key="sk-...")
        response = await provider.complete(
            messages=[Message(Role.USER, "Hello!")],
            model="gpt-4-turbo-preview",
        )
        ```
    """
    
    MODELS = [
        "gpt-4-turbo-preview",
        "gpt-4-turbo",
        "gpt-4",
        "gpt-4-0613",
        "gpt-4-32k",
        "gpt-3.5-turbo",
        "gpt-3.5-turbo-16k",
        "gpt-4o",
        "gpt-4o-mini",
    ]
    
    def __init__(
        self,
        api_key: str | None = None,
        base_url: str | None = None,
        organization: str | None = None,
        timeout: float = 60.0,
        max_retries: int = 3,
    ):
        """
        Initialize OpenAI provider.
        
        Args:
            api_key: OpenAI API key (defaults to OPENAI_API_KEY env var)
            base_url: Custom base URL (for Azure or proxies)
            organization: OpenAI organization ID
            timeout: Request timeout
            max_retries: Maximum retries
        """
        super().__init__(
            api_key=api_key or os.getenv("OPENAI_API_KEY"),
            base_url=base_url or "https://api.openai.com/v1",
            timeout=timeout,
            max_retries=max_retries,
        )
        self.organization = organization or os.getenv("OPENAI_ORG_ID")
        
        if not self.api_key:
            raise AuthenticationError(
                "OpenAI API key not provided. Set OPENAI_API_KEY environment variable.",
                provider=self.name,
            )
    
    @property
    def name(self) -> str:
        return "openai"
    
    @property
    def default_model(self) -> str:
        return "gpt-4o-mini"
    
    @property
    def supported_models(self) -> list[str]:
        return self.MODELS.copy()
    
    async def _get_client(self):
        """Get or create the OpenAI client."""
        if self._client is None:
            try:
                import openai
            except ImportError:
                raise AIProviderError(
                    "openai package not installed. Run: pip install openai",
                    provider=self.name,
                )
            
            self._client = openai.AsyncOpenAI(
                api_key=self.api_key,
                base_url=self.base_url,
                organization=self.organization,
                timeout=self.timeout,
                max_retries=self.max_retries,
            )
        return self._client
    
    async def complete(
        self,
        messages: list[Message],
        model: str | None = None,
        temperature: float = 0.7,
        max_tokens: int = 1024,
        stop: list[str] | None = None,
        **kwargs: Any,
    ) -> Completion:
        """Generate a completion using OpenAI."""
        model = model or self.default_model
        client = await self._get_client()
        
        try:
            response = await client.chat.completions.create(
                model=model,
                messages=[m.to_dict() for m in messages],
                temperature=temperature,
                max_tokens=max_tokens,
                stop=stop,
                **kwargs,
            )
            
            choice = response.choices[0]
            return Completion(
                content=choice.message.content or "",
                model=response.model,
                finish_reason=choice.finish_reason,
                usage={
                    "prompt_tokens": response.usage.prompt_tokens if response.usage else 0,
                    "completion_tokens": response.usage.completion_tokens if response.usage else 0,
                    "total_tokens": response.usage.total_tokens if response.usage else 0,
                },
                raw_response=response,
            )
            
        except Exception as e:
            error_msg = str(e)
            
            if "rate_limit" in error_msg.lower():
                raise RateLimitError(
                    f"OpenAI rate limit exceeded: {error_msg}",
                    provider=self.name,
                    raw_error=e,
                )
            elif "authentication" in error_msg.lower() or "api_key" in error_msg.lower():
                raise AuthenticationError(
                    f"OpenAI authentication failed: {error_msg}",
                    provider=self.name,
                    raw_error=e,
                )
            elif "invalid" in error_msg.lower():
                raise InvalidRequestError(
                    f"Invalid OpenAI request: {error_msg}",
                    provider=self.name,
                    raw_error=e,
                )
            else:
                raise AIProviderError(
                    f"OpenAI API error: {error_msg}",
                    provider=self.name,
                    raw_error=e,
                )
    
    async def stream(
        self,
        messages: list[Message],
        model: str | None = None,
        temperature: float = 0.7,
        max_tokens: int = 1024,
        stop: list[str] | None = None,
        **kwargs: Any,
    ) -> AsyncIterator[str]:
        """Stream a completion from OpenAI."""
        model = model or self.default_model
        client = await self._get_client()
        
        try:
            stream = await client.chat.completions.create(
                model=model,
                messages=[m.to_dict() for m in messages],
                temperature=temperature,
                max_tokens=max_tokens,
                stop=stop,
                stream=True,
                **kwargs,
            )
            
            async for chunk in stream:
                if chunk.choices and chunk.choices[0].delta.content:
                    yield chunk.choices[0].delta.content
                    
        except Exception as e:
            logger.error(f"OpenAI streaming error: {e}")
            raise AIProviderError(
                f"OpenAI streaming error: {e}",
                provider=self.name,
                raw_error=e,
            )
    
    async def create_embedding(
        self,
        text: str | list[str],
        model: str = "text-embedding-3-small",
    ) -> list[list[float]]:
        """
        Create embeddings for text.
        
        Args:
            text: Text or list of texts to embed
            model: Embedding model to use
            
        Returns:
            List of embedding vectors
        """
        client = await self._get_client()
        
        if isinstance(text, str):
            text = [text]
        
        try:
            response = await client.embeddings.create(
                model=model,
                input=text,
            )
            return [e.embedding for e in response.data]
            
        except Exception as e:
            raise AIProviderError(
                f"OpenAI embedding error: {e}",
                provider=self.name,
                raw_error=e,
            )
