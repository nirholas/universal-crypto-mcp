"""
Anthropic Provider implementation.

Supports Claude models for AI-powered features.
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
    Role,
)


class AnthropicProvider(AIProvider):
    """
    Anthropic API provider for Claude models.
    
    Supports:
    - Claude 3 Opus
    - Claude 3 Sonnet
    - Claude 3 Haiku
    - Claude 3.5 Sonnet
    
    Example:
        ```python
        provider = AnthropicProvider(api_key="sk-ant-...")
        response = await provider.complete(
            messages=[Message(Role.USER, "Hello!")],
            model="claude-3-5-sonnet-20241022",
        )
        ```
    """
    
    MODELS = [
        "claude-3-5-sonnet-20241022",
        "claude-3-5-haiku-20241022",
        "claude-3-opus-20240229",
        "claude-3-sonnet-20240229",
        "claude-3-haiku-20240307",
    ]
    
    def __init__(
        self,
        api_key: str | None = None,
        base_url: str | None = None,
        timeout: float = 60.0,
        max_retries: int = 3,
    ):
        """
        Initialize Anthropic provider.
        
        Args:
            api_key: Anthropic API key (defaults to ANTHROPIC_API_KEY env var)
            base_url: Custom base URL
            timeout: Request timeout
            max_retries: Maximum retries
        """
        super().__init__(
            api_key=api_key or os.getenv("ANTHROPIC_API_KEY"),
            base_url=base_url or "https://api.anthropic.com",
            timeout=timeout,
            max_retries=max_retries,
        )
        
        if not self.api_key:
            raise AuthenticationError(
                "Anthropic API key not provided. Set ANTHROPIC_API_KEY environment variable.",
                provider=self.name,
            )
    
    @property
    def name(self) -> str:
        return "anthropic"
    
    @property
    def default_model(self) -> str:
        return "claude-3-5-sonnet-20241022"
    
    @property
    def supported_models(self) -> list[str]:
        return self.MODELS.copy()
    
    async def _get_client(self):
        """Get or create the Anthropic client."""
        if self._client is None:
            try:
                import anthropic
            except ImportError:
                raise AIProviderError(
                    "anthropic package not installed. Run: pip install anthropic",
                    provider=self.name,
                )
            
            self._client = anthropic.AsyncAnthropic(
                api_key=self.api_key,
                base_url=self.base_url,
                timeout=self.timeout,
                max_retries=self.max_retries,
            )
        return self._client
    
    def _prepare_messages(
        self,
        messages: list[Message],
    ) -> tuple[str | None, list[dict]]:
        """
        Prepare messages for Anthropic API.
        
        Anthropic requires system prompt to be separate from messages.
        
        Returns:
            Tuple of (system_prompt, messages)
        """
        system_prompt = None
        api_messages = []
        
        for msg in messages:
            if msg.role == Role.SYSTEM:
                system_prompt = msg.content
            else:
                api_messages.append({
                    "role": msg.role.value,
                    "content": msg.content,
                })
        
        return system_prompt, api_messages
    
    async def complete(
        self,
        messages: list[Message],
        model: str | None = None,
        temperature: float = 0.7,
        max_tokens: int = 1024,
        stop: list[str] | None = None,
        **kwargs: Any,
    ) -> Completion:
        """Generate a completion using Anthropic."""
        model = model or self.default_model
        client = await self._get_client()
        
        system_prompt, api_messages = self._prepare_messages(messages)
        
        try:
            create_kwargs: dict[str, Any] = {
                "model": model,
                "messages": api_messages,
                "temperature": temperature,
                "max_tokens": max_tokens,
            }
            
            if system_prompt:
                create_kwargs["system"] = system_prompt
            if stop:
                create_kwargs["stop_sequences"] = stop
            
            create_kwargs.update(kwargs)
            
            response = await client.messages.create(**create_kwargs)
            
            content = ""
            if response.content:
                content = response.content[0].text
            
            return Completion(
                content=content,
                model=response.model,
                finish_reason=response.stop_reason,
                usage={
                    "prompt_tokens": response.usage.input_tokens,
                    "completion_tokens": response.usage.output_tokens,
                    "total_tokens": response.usage.input_tokens + response.usage.output_tokens,
                },
                raw_response=response,
            )
            
        except Exception as e:
            error_msg = str(e)
            
            if "rate_limit" in error_msg.lower():
                raise RateLimitError(
                    f"Anthropic rate limit exceeded: {error_msg}",
                    provider=self.name,
                    raw_error=e,
                )
            elif "authentication" in error_msg.lower() or "api_key" in error_msg.lower():
                raise AuthenticationError(
                    f"Anthropic authentication failed: {error_msg}",
                    provider=self.name,
                    raw_error=e,
                )
            elif "invalid" in error_msg.lower():
                raise InvalidRequestError(
                    f"Invalid Anthropic request: {error_msg}",
                    provider=self.name,
                    raw_error=e,
                )
            else:
                raise AIProviderError(
                    f"Anthropic API error: {error_msg}",
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
        """Stream a completion from Anthropic."""
        model = model or self.default_model
        client = await self._get_client()
        
        system_prompt, api_messages = self._prepare_messages(messages)
        
        try:
            create_kwargs: dict[str, Any] = {
                "model": model,
                "messages": api_messages,
                "temperature": temperature,
                "max_tokens": max_tokens,
            }
            
            if system_prompt:
                create_kwargs["system"] = system_prompt
            if stop:
                create_kwargs["stop_sequences"] = stop
            
            create_kwargs.update(kwargs)
            
            async with client.messages.stream(**create_kwargs) as stream:
                async for text in stream.text_stream:
                    yield text
                    
        except Exception as e:
            logger.error(f"Anthropic streaming error: {e}")
            raise AIProviderError(
                f"Anthropic streaming error: {e}",
                provider=self.name,
                raw_error=e,
            )
