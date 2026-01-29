# SPDX-License-Identifier: MIT
# Copyright (c) 2025 Xeepy Contributors
"""
Xeepy REST API Module
=====================

Production-ready FastAPI REST API for X/Twitter automation.

This module provides:
- RESTful endpoints for all automation features
- WebSocket support for real-time updates
- OAuth2 authentication
- Rate limiting and request validation
- Comprehensive OpenAPI documentation

⚠️  EDUCATIONAL PURPOSES ONLY - No real API calls are made.
"""

from xeepy.api.server import create_app, XeepyAPI
from xeepy.api.auth import (
    AuthManager,
    OAuth2Handler,
    APIKeyAuth,
    JWTHandler,
)
from xeepy.api.middleware import (
    RateLimitMiddleware,
    LoggingMiddleware,
    CORSMiddleware,
    MetricsMiddleware,
)
from xeepy.api.routes import (
    scrape_router,
    follow_router,
    engage_router,
    monitor_router,
    ai_router,
    analytics_router,
)
from xeepy.api.websocket import WebSocketManager, ConnectionManager
from xeepy.api.models import (
    APIResponse,
    PaginatedResponse,
    ErrorResponse,
    HealthCheck,
    TaskStatus,
)

__all__ = [
    # App
    "create_app",
    "XeepyAPI",
    # Auth
    "AuthManager",
    "OAuth2Handler",
    "APIKeyAuth",
    "JWTHandler",
    # Middleware
    "RateLimitMiddleware",
    "LoggingMiddleware",
    "CORSMiddleware",
    "MetricsMiddleware",
    # Routers
    "scrape_router",
    "follow_router",
    "engage_router",
    "monitor_router",
    "ai_router",
    "analytics_router",
    # WebSocket
    "WebSocketManager",
    "ConnectionManager",
    # Models
    "APIResponse",
    "PaginatedResponse",
    "ErrorResponse",
    "HealthCheck",
    "TaskStatus",
]
