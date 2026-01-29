"""
Local AI Provider implementations.

Supports Ollama and other local model servers.
"""

from __future__ import annotations

import os
from typing import AsyncIterator, Any

import httpx
from loguru import logger

from xeepy.ai.providers.base import (
    AIProvider,
    AIProviderError,
    Message,
    Completion,
    Role,
)


class LocalProvider(AIProvider):
    """
    Generic local AI provider using OpenAI-compatible API.
    
    Works with any server that implements the OpenAI API format,
    such as LM Studio, LocalAI, or vLLM.
    
    Example:
        ```python
        provider = LocalProvider(
            base_url="http://localhost:8080/v1",
            model="local-model",
        )
        ```
    """
    
    def __init__(
        self,
        base_url: str = "http://localhost:8080/v1",
        model: str = "local-model",
        api_key: str | None = None,
        timeout: float = 120.0,
        max_retries: int = 3,
    ):
        """
        Initialize local provider.
        
        Args:
            base_url: Base URL of the local server
            model: Default model name to use
            api_key: Optional API key (some local servers require it)
            timeout: Request timeout (longer for local inference)
            max_retries: Maximum retries
        """
        super().__init__(
            api_key=api_key or "local",
            base_url=base_url,
            timeout=timeout,
            max_retries=max_retries,
        )
        self._model = model
    
    @property
    def name(self) -> str:
        return "local"
    
    @property
    def default_model(self) -> str:
        return self._model
    
    @property
    def supported_models(self) -> list[str]:
        # Local providers support any model
        return [self._model]
    
    def _validate_model(self, model: str | None) -> str:
        """Override to allow any model for local providers."""
        return model or self._model
    
    async def _get_client(self) -> httpx.AsyncClient:
        """Get or create the HTTP client."""
        if self._client is None:
            self._client = httpx.AsyncClient(
                base_url=self.base_url,
                timeout=self.timeout,
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json",
                },
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
        """Generate a completion using local server."""
        model = self._validate_model(model)
        client = await self._get_client()
        
        payload = {
            "model": model,
            "messages": [m.to_dict() for m in messages],
            "temperature": temperature,
            "max_tokens": max_tokens,
        }
        
        if stop:
            payload["stop"] = stop
        
        payload.update(kwargs)
        
        try:
            response = await client.post("/chat/completions", json=payload)
            response.raise_for_status()
            data = response.json()
            
            choice = data["choices"][0]
            usage = data.get("usage", {})
            
            return Completion(
                content=choice["message"]["content"],
                model=data.get("model", model),
                finish_reason=choice.get("finish_reason"),
                usage={
                    "prompt_tokens": usage.get("prompt_tokens", 0),
                    "completion_tokens": usage.get("completion_tokens", 0),
                    "total_tokens": usage.get("total_tokens", 0),
                },
                raw_response=data,
            )
            
        except httpx.HTTPStatusError as e:
            raise AIProviderError(
                f"Local server error: {e.response.status_code} - {e.response.text}",
                provider=self.name,
                status_code=e.response.status_code,
                raw_error=e,
            )
        except httpx.RequestError as e:
            raise AIProviderError(
                f"Failed to connect to local server: {e}",
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
        """Stream a completion from local server."""
        model = self._validate_model(model)
        client = await self._get_client()
        
        payload = {
            "model": model,
            "messages": [m.to_dict() for m in messages],
            "temperature": temperature,
            "max_tokens": max_tokens,
            "stream": True,
        }
        
        if stop:
            payload["stop"] = stop
        
        payload.update(kwargs)
        
        try:
            async with client.stream("POST", "/chat/completions", json=payload) as response:
                response.raise_for_status()
                
                async for line in response.aiter_lines():
                    if line.startswith("data: "):
                        data_str = line[6:]
                        if data_str.strip() == "[DONE]":
                            break
                        
                        import json
                        data = json.loads(data_str)
                        
                        if data["choices"] and data["choices"][0].get("delta", {}).get("content"):
                            yield data["choices"][0]["delta"]["content"]
                            
        except Exception as e:
            logger.error(f"Local server streaming error: {e}")
            raise AIProviderError(
                f"Local server streaming error: {e}",
                provider=self.name,
                raw_error=e,
            )
    
    async def close(self) -> None:
        """Close the HTTP client."""
        if self._client is not None:
            await self._client.aclose()
            self._client = None


class OllamaProvider(AIProvider):
    """
    Ollama-specific provider.
    
    Supports all models available in Ollama including:
    - Llama 2/3
    - Mistral
    - CodeLlama
    - Phi
    - And more
    
    Example:
        ```python
        provider = OllamaProvider()
        response = await provider.complete(
            messages=[Message(Role.USER, "Hello!")],
            model="llama3:8b",
        )
        ```
    """
    
    DEFAULT_MODELS = [
        "llama3:8b",
        "llama3:70b",
        "llama2:7b",
        "llama2:13b",
        "mistral:7b",
        "mixtral:8x7b",
        "codellama:7b",
        "codellama:13b",
        "phi3:mini",
        "gemma:7b",
        "qwen2:7b",
    ]
    
    def __init__(
        self,
        base_url: str | None = None,
        model: str = "llama3:8b",
        timeout: float = 300.0,
        max_retries: int = 3,
    ):
        """
        Initialize Ollama provider.
        
        Args:
            base_url: Ollama server URL (defaults to OLLAMA_HOST or localhost)
            model: Default model to use
            timeout: Request timeout (longer for local inference)
            max_retries: Maximum retries
        """
        base_url = base_url or os.getenv("OLLAMA_HOST", "http://localhost:11434")
        
        super().__init__(
            api_key=None,
            base_url=base_url,
            timeout=timeout,
            max_retries=max_retries,
        )
        self._model = model
        self._available_models: list[str] | None = None
    
    @property
    def name(self) -> str:
        return "ollama"
    
    @property
    def default_model(self) -> str:
        return self._model
    
    @property
    def supported_models(self) -> list[str]:
        # Return cached or default models
        if self._available_models:
            return self._available_models
        return self.DEFAULT_MODELS
    
    def _validate_model(self, model: str | None) -> str:
        """Allow any model for Ollama."""
        return model or self._model
    
    async def _get_client(self) -> httpx.AsyncClient:
        """Get or create the HTTP client."""
        if self._client is None:
            self._client = httpx.AsyncClient(
                base_url=self.base_url,
                timeout=self.timeout,
                headers={"Content-Type": "application/json"},
            )
        return self._client
    
    async def list_models(self) -> list[str]:
        """
        List available models in Ollama.
        
        Returns:
            List of model names
        """
        client = await self._get_client()
        
        try:
            response = await client.get("/api/tags")
            response.raise_for_status()
            data = response.json()
            
            self._available_models = [m["name"] for m in data.get("models", [])]
            return self._available_models
            
        except Exception as e:
            logger.warning(f"Failed to list Ollama models: {e}")
            return self.DEFAULT_MODELS
    
    async def pull_model(self, model: str) -> None:
        """
        Pull a model from Ollama library.
        
        Args:
            model: Model name to pull
        """
        client = await self._get_client()
        
        try:
            response = await client.post(
                "/api/pull",
                json={"name": model},
                timeout=None,  # Pulling can take a long time
            )
            response.raise_for_status()
            logger.info(f"Successfully pulled model: {model}")
            
        except Exception as e:
            raise AIProviderError(
                f"Failed to pull model {model}: {e}",
                provider=self.name,
                raw_error=e,
            )
    
    async def complete(
        self,
        messages: list[Message],
        model: str | None = None,
        temperature: float = 0.7,
        max_tokens: int = 1024,
        stop: list[str] | None = None,
        **kwargs: Any,
    ) -> Completion:
        """Generate a completion using Ollama."""
        model = self._validate_model(model)
        client = await self._get_client()
        
        # Extract system prompt for Ollama format
        system = None
        chat_messages = []
        
        for msg in messages:
            if msg.role == Role.SYSTEM:
                system = msg.content
            else:
                chat_messages.append({
                    "role": msg.role.value,
                    "content": msg.content,
                })
        
        payload: dict[str, Any] = {
            "model": model,
            "messages": chat_messages,
            "stream": False,
            "options": {
                "temperature": temperature,
                "num_predict": max_tokens,
            },
        }
        
        if system:
            payload["system"] = system
        if stop:
            payload["options"]["stop"] = stop
        
        try:
            response = await client.post("/api/chat", json=payload)
            response.raise_for_status()
            data = response.json()
            
            return Completion(
                content=data["message"]["content"],
                model=data.get("model", model),
                finish_reason="stop" if data.get("done") else None,
                usage={
                    "prompt_tokens": data.get("prompt_eval_count", 0),
                    "completion_tokens": data.get("eval_count", 0),
                    "total_tokens": data.get("prompt_eval_count", 0) + data.get("eval_count", 0),
                },
                raw_response=data,
            )
            
        except httpx.HTTPStatusError as e:
            raise AIProviderError(
                f"Ollama error: {e.response.status_code} - {e.response.text}",
                provider=self.name,
                status_code=e.response.status_code,
                raw_error=e,
            )
        except httpx.RequestError as e:
            raise AIProviderError(
                f"Failed to connect to Ollama: {e}. Is Ollama running?",
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
        """Stream a completion from Ollama."""
        model = self._validate_model(model)
        client = await self._get_client()
        
        # Extract system prompt
        system = None
        chat_messages = []
        
        for msg in messages:
            if msg.role == Role.SYSTEM:
                system = msg.content
            else:
                chat_messages.append({
                    "role": msg.role.value,
                    "content": msg.content,
                })
        
        payload: dict[str, Any] = {
            "model": model,
            "messages": chat_messages,
            "stream": True,
            "options": {
                "temperature": temperature,
                "num_predict": max_tokens,
            },
        }
        
        if system:
            payload["system"] = system
        if stop:
            payload["options"]["stop"] = stop
        
        try:
            async with client.stream("POST", "/api/chat", json=payload) as response:
                response.raise_for_status()
                
                async for line in response.aiter_lines():
                    if line:
                        import json
                        data = json.loads(line)
                        
                        if data.get("message", {}).get("content"):
                            yield data["message"]["content"]
                        
                        if data.get("done"):
                            break
                            
        except Exception as e:
            logger.error(f"Ollama streaming error: {e}")
            raise AIProviderError(
                f"Ollama streaming error: {e}",
                provider=self.name,
                raw_error=e,
            )
    
    async def create_embedding(
        self,
        text: str,
        model: str | None = None,
    ) -> list[float]:
        """
        Create embedding for text using Ollama.
        
        Args:
            text: Text to embed
            model: Model to use (defaults to nomic-embed-text)
            
        Returns:
            Embedding vector
        """
        model = model or "nomic-embed-text"
        client = await self._get_client()
        
        try:
            response = await client.post(
                "/api/embeddings",
                json={"model": model, "prompt": text},
            )
            response.raise_for_status()
            data = response.json()
            
            return data["embedding"]
            
        except Exception as e:
            raise AIProviderError(
                f"Ollama embedding error: {e}",
                provider=self.name,
                raw_error=e,
            )
    
    async def close(self) -> None:
        """Close the HTTP client."""
        if self._client is not None:
            await self._client.aclose()
            self._client = None
