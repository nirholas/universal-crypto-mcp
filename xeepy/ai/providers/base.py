"""
Base AI Provider interface.

All AI providers must implement this interface for consistent usage
across the Xeepy toolkit.
"""

from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from enum import Enum
from typing import AsyncIterator, Any


class Role(str, Enum):
    """Message roles for chat completions."""
    SYSTEM = "system"
    USER = "user"
    ASSISTANT = "assistant"


@dataclass
class Message:
    """A chat message for AI providers."""
    role: Role
    content: str
    name: str | None = None
    
    def to_dict(self) -> dict[str, str]:
        """Convert to dictionary format for API calls."""
        d = {"role": self.role.value, "content": self.content}
        if self.name:
            d["name"] = self.name
        return d


@dataclass
class Completion:
    """AI completion response."""
    content: str
    model: str
    finish_reason: str | None = None
    usage: dict[str, int] = field(default_factory=dict)
    raw_response: Any = None
    
    @property
    def prompt_tokens(self) -> int:
        """Get prompt token count."""
        return self.usage.get("prompt_tokens", 0)
    
    @property
    def completion_tokens(self) -> int:
        """Get completion token count."""
        return self.usage.get("completion_tokens", 0)
    
    @property
    def total_tokens(self) -> int:
        """Get total token count."""
        return self.usage.get("total_tokens", 0)


class AIProviderError(Exception):
    """Base exception for AI provider errors."""
    
    def __init__(
        self,
        message: str,
        provider: str | None = None,
        status_code: int | None = None,
        raw_error: Any = None,
    ):
        super().__init__(message)
        self.provider = provider
        self.status_code = status_code
        self.raw_error = raw_error


class RateLimitError(AIProviderError):
    """Rate limit exceeded error."""
    pass


class AuthenticationError(AIProviderError):
    """Authentication failed error."""
    pass


class InvalidRequestError(AIProviderError):
    """Invalid request error."""
    pass


class AIProvider(ABC):
    """
    Abstract base class for AI providers.
    
    All AI providers (OpenAI, Anthropic, local models) must implement
    this interface for consistent usage across the toolkit.
    
    Example:
        ```python
        provider = OpenAIProvider(api_key="sk-...")
        response = await provider.complete(
            messages=[Message(Role.USER, "Hello!")],
            model="gpt-4",
        )
        print(response.content)
        ```
    """
    
    def __init__(
        self,
        api_key: str | None = None,
        base_url: str | None = None,
        timeout: float = 60.0,
        max_retries: int = 3,
    ):
        """
        Initialize the AI provider.
        
        Args:
            api_key: API key for authentication
            base_url: Base URL for API requests
            timeout: Request timeout in seconds
            max_retries: Maximum number of retries for failed requests
        """
        self.api_key = api_key
        self.base_url = base_url
        self.timeout = timeout
        self.max_retries = max_retries
        self._client = None
    
    @property
    @abstractmethod
    def name(self) -> str:
        """Get the provider name."""
        pass
    
    @property
    @abstractmethod
    def default_model(self) -> str:
        """Get the default model for this provider."""
        pass
    
    @property
    @abstractmethod
    def supported_models(self) -> list[str]:
        """Get list of supported models."""
        pass
    
    @abstractmethod
    async def complete(
        self,
        messages: list[Message],
        model: str | None = None,
        temperature: float = 0.7,
        max_tokens: int = 1024,
        stop: list[str] | None = None,
        **kwargs: Any,
    ) -> Completion:
        """
        Generate a completion from the AI model.
        
        Args:
            messages: List of chat messages
            model: Model to use (defaults to provider's default)
            temperature: Sampling temperature (0-2)
            max_tokens: Maximum tokens to generate
            stop: Stop sequences
            **kwargs: Additional provider-specific parameters
            
        Returns:
            Completion object with generated content
            
        Raises:
            AIProviderError: If the request fails
        """
        pass
    
    @abstractmethod
    async def stream(
        self,
        messages: list[Message],
        model: str | None = None,
        temperature: float = 0.7,
        max_tokens: int = 1024,
        stop: list[str] | None = None,
        **kwargs: Any,
    ) -> AsyncIterator[str]:
        """
        Stream a completion from the AI model.
        
        Args:
            messages: List of chat messages
            model: Model to use (defaults to provider's default)
            temperature: Sampling temperature (0-2)
            max_tokens: Maximum tokens to generate
            stop: Stop sequences
            **kwargs: Additional provider-specific parameters
            
        Yields:
            Content chunks as they are generated
            
        Raises:
            AIProviderError: If the request fails
        """
        pass
    
    async def generate_text(
        self,
        prompt: str,
        system: str | None = None,
        model: str | None = None,
        temperature: float = 0.7,
        max_tokens: int = 1024,
    ) -> str:
        """
        Convenience method to generate text from a simple prompt.
        
        Args:
            prompt: User prompt
            system: Optional system prompt
            model: Model to use
            temperature: Sampling temperature
            max_tokens: Maximum tokens
            
        Returns:
            Generated text content
        """
        messages = []
        if system:
            messages.append(Message(Role.SYSTEM, system))
        messages.append(Message(Role.USER, prompt))
        
        response = await self.complete(
            messages=messages,
            model=model,
            temperature=temperature,
            max_tokens=max_tokens,
        )
        return response.content
    
    async def __aenter__(self) -> "AIProvider":
        """Async context manager entry."""
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb) -> None:
        """Async context manager exit."""
        await self.close()
    
    async def close(self) -> None:
        """Close the provider and cleanup resources."""
        if self._client is not None:
            if hasattr(self._client, "close"):
                await self._client.close()
            self._client = None
    
    def _validate_model(self, model: str | None) -> str:
        """Validate and return the model to use."""
        if model is None:
            return self.default_model
        if model not in self.supported_models:
            raise InvalidRequestError(
                f"Model '{model}' not supported. Supported models: {self.supported_models}",
                provider=self.name,
            )
        return model
