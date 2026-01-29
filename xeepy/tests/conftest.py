# SPDX-License-Identifier: MIT
"""
Test Configuration and Fixtures
================================

Shared test configuration and pytest fixtures.
"""

import asyncio
from pathlib import Path
from typing import AsyncGenerator, Generator
from unittest.mock import AsyncMock, MagicMock

import pytest
from loguru import logger

# Disable logging during tests
logger.disable("xeepy")


# =============================================================================
# Pytest Configuration
# =============================================================================

def pytest_configure(config):
    """Configure pytest."""
    config.addinivalue_line(
        "markers", "asyncio: mark test as async"
    )
    config.addinivalue_line(
        "markers", "slow: mark test as slow"
    )
    config.addinivalue_line(
        "markers", "integration: mark test as integration test"
    )


# =============================================================================
# Event Loop Fixtures
# =============================================================================

@pytest.fixture(scope="session")
def event_loop() -> Generator:
    """Create event loop for tests."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


# =============================================================================
# Configuration Fixtures
# =============================================================================

@pytest.fixture
def temp_config_file(tmp_path: Path) -> Path:
    """Create temporary config file."""
    config_file = tmp_path / "test_config.yml"
    config_content = """
environment: development
demo_mode: true

ai:
  default_provider: openai
  openai_api_key: test-key
  openai_model: gpt-4

rate_limit:
  enabled: false

auth:
  enabled: false
  jwt_secret: test-secret

server:
  host: 127.0.0.1
  port: 8888
  debug: true
"""
    config_file.write_text(config_content)
    return config_file


@pytest.fixture
def mock_config():
    """Create mock configuration."""
    from xeepy.config import XeepyConfig, AIConfig
    
    config = XeepyConfig()
    config.demo_mode = True
    config.ai = AIConfig(
        default_provider="openai",
        openai_api_key="test-key",
    )
    return config


# =============================================================================
# AI Provider Fixtures
# =============================================================================

@pytest.fixture
def mock_openai_client():
    """Create mock OpenAI client."""
    client = MagicMock()
    client.chat.completions.create = AsyncMock(return_value=MagicMock(
        choices=[MagicMock(
            message=MagicMock(content="Test AI response")
        )]
    ))
    return client


@pytest.fixture
def mock_anthropic_client():
    """Create mock Anthropic client."""
    client = MagicMock()
    client.messages.create = AsyncMock(return_value=MagicMock(
        content=[MagicMock(text="Test AI response")]
    ))
    return client


@pytest.fixture
def mock_ollama_client():
    """Create mock Ollama client."""
    client = MagicMock()
    client.chat = AsyncMock(return_value={"message": {"content": "Test AI response"}})
    return client


# =============================================================================
# API Fixtures
# =============================================================================

@pytest.fixture
def test_app():
    """Create test FastAPI app."""
    try:
        from xeepy.api.server import create_app
        
        app = create_app(
            debug=True,
            enable_auth=False,
            enable_rate_limiting=False,
        )
        return app
    except ImportError:
        pytest.skip("FastAPI not installed")


@pytest.fixture
async def async_client(test_app) -> AsyncGenerator:
    """Create async test client."""
    try:
        from httpx import AsyncClient
        
        async with AsyncClient(app=test_app, base_url="http://test") as client:
            yield client
    except ImportError:
        pytest.skip("httpx not installed")


# =============================================================================
# Mock Data Fixtures
# =============================================================================

@pytest.fixture
def mock_user_profile():
    """Create mock user profile data."""
    return {
        "username": "testuser",
        "display_name": "Test User",
        "bio": "Test bio",
        "followers_count": 1000,
        "following_count": 500,
        "tweet_count": 2000,
        "verified": False,
        "created_at": "2020-01-01T00:00:00Z",
    }


@pytest.fixture
def mock_tweet():
    """Create mock tweet data."""
    return {
        "id": "1234567890",
        "text": "This is a test tweet",
        "author": "testuser",
        "created_at": "2025-01-29T12:00:00Z",
        "likes": 10,
        "retweets": 5,
        "replies": 2,
    }


@pytest.fixture
def mock_tweets():
    """Create list of mock tweets."""
    return [
        {
            "id": f"{i}",
            "text": f"Test tweet {i}",
            "author": "testuser",
            "created_at": "2025-01-29T12:00:00Z",
            "likes": i * 10,
            "retweets": i * 5,
            "replies": i * 2,
        }
        for i in range(1, 11)
    ]


@pytest.fixture
def mock_followers():
    """Create list of mock followers."""
    return [
        {
            "username": f"follower{i}",
            "display_name": f"Follower {i}",
            "followers_count": i * 100,
            "following_count": i * 50,
        }
        for i in range(1, 21)
    ]


# =============================================================================
# Database Fixtures
# =============================================================================

@pytest.fixture
def mock_db_session():
    """Create mock database session."""
    session = MagicMock()
    session.add = MagicMock()
    session.commit = MagicMock()
    session.rollback = MagicMock()
    session.close = MagicMock()
    return session


# =============================================================================
# WebSocket Fixtures
# =============================================================================

@pytest.fixture
def mock_websocket():
    """Create mock WebSocket."""
    ws = AsyncMock()
    ws.accept = AsyncMock()
    ws.send_text = AsyncMock()
    ws.send_json = AsyncMock()
    ws.receive_text = AsyncMock(return_value='{"type": "ping"}')
    ws.close = AsyncMock()
    return ws


# =============================================================================
# Authentication Fixtures
# =============================================================================

@pytest.fixture
def mock_jwt_token():
    """Create mock JWT token."""
    return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0dXNlciJ9.test"


@pytest.fixture
def mock_api_key():
    """Create mock API key."""
    return "test-api-key-12345"


# =============================================================================
# CLI Fixtures
# =============================================================================

@pytest.fixture
def cli_runner():
    """Create CLI test runner."""
    try:
        from click.testing import CliRunner
        return CliRunner()
    except ImportError:
        pytest.skip("Click not installed")


@pytest.fixture
def isolated_filesystem(tmp_path):
    """Create isolated filesystem for CLI tests."""
    import os
    original_dir = os.getcwd()
    os.chdir(tmp_path)
    yield tmp_path
    os.chdir(original_dir)


# =============================================================================
# Cleanup Fixtures
# =============================================================================

@pytest.fixture(autouse=True)
def reset_singletons():
    """Reset singleton instances between tests."""
    from xeepy.config import reset_config
    yield
    reset_config()


@pytest.fixture(autouse=True)
def cleanup_temp_files(tmp_path):
    """Cleanup temporary files after tests."""
    yield
    # Cleanup happens automatically with tmp_path
