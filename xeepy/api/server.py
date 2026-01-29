# SPDX-License-Identifier: MIT
# Copyright (c) 2025 Xeepy Contributors
"""
FastAPI Server
==============

Main FastAPI application server with all routes and middleware.
"""

import time
from datetime import datetime
from pathlib import Path
from typing import Any, Optional
from loguru import logger

try:
    from fastapi import FastAPI, Request, status
    from fastapi.responses import JSONResponse, HTMLResponse, PlainTextResponse
    from fastapi.middleware.gzip import GZipMiddleware
    from fastapi.staticfiles import StaticFiles
    from fastapi.openapi.utils import get_openapi
    HAS_FASTAPI = True
except ImportError:
    HAS_FASTAPI = False
    FastAPI = object

from xeepy import __version__
from xeepy.api.auth import AuthManager
from xeepy.api.middleware import (
    RateLimitMiddleware,
    LoggingMiddleware,
    CORSMiddleware,
    MetricsMiddleware,
    RateLimitConfig,
    CORSConfig,
)
from xeepy.api.websocket import WebSocketManager, websocket_endpoint
from xeepy.api.models import (
    APIResponse,
    ErrorResponse,
    HealthCheck,
    ServiceHealth,
)


# =============================================================================
# Server Startup Time
# =============================================================================

SERVER_START_TIME = time.time()


# =============================================================================
# Custom OpenAPI Schema
# =============================================================================


def custom_openapi_schema(app: "FastAPI") -> dict[str, Any]:
    """Generate custom OpenAPI schema."""
    if app.openapi_schema:
        return app.openapi_schema
    
    openapi_schema = get_openapi(
        title="Xeepy API",
        version=__version__,
        description="""
# Xeepy - X/Twitter Automation Toolkit API

⚠️ **EDUCATIONAL PURPOSES ONLY** - This API demonstrates automation techniques for research and learning.

## Features

- 🤖 **AI-Powered Content Generation** - Generate tweets, threads, replies with AI
- 📊 **Analytics & Insights** - Comprehensive account analytics and reporting
- 🎯 **Smart Targeting** - Find and engage with relevant accounts
- 📈 **Growth Automation** - Automate follows, unfollows, and engagement
- 🔍 **Monitoring** - Real-time monitoring of followers, mentions, and keywords
- 💬 **Engagement** - Automated likes, retweets, replies, and comments
- 🪙 **Crypto Sentiment** - Track crypto token sentiment on X/Twitter
- 🤝 **WebSocket Streaming** - Real-time updates via WebSockets

## Authentication

The API supports multiple authentication methods:

- **API Key**: Include `X-API-Key` header in requests
- **JWT**: Include `Authorization: Bearer <token>` header
- **OAuth2**: Standard OAuth2 flow for X/Twitter

## Rate Limiting

Default rate limits:
- 60 requests/minute
- 1000 requests/hour
- 10000 requests/day

Rate limit headers are included in all responses.

## Support

- Documentation: https://xeepy.dev/docs
- GitHub: https://github.com/yourusername/xeepy
- Issues: https://github.com/yourusername/xeepy/issues

---

**Note**: This is a demonstration/educational API. No actual X/Twitter API calls are made.
        """,
        routes=app.routes,
    )
    
    # Custom styling
    openapi_schema["info"]["x-logo"] = {
        "url": "https://xeepy.dev/logo.png",
        "altText": "Xeepy Logo"
    }
    
    # Add security schemes
    openapi_schema["components"]["securitySchemes"] = {
        "APIKey": {
            "type": "apiKey",
            "in": "header",
            "name": "X-API-Key",
            "description": "API key authentication"
        },
        "Bearer": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
            "description": "JWT token authentication"
        },
        "OAuth2": {
            "type": "oauth2",
            "flows": {
                "authorizationCode": {
                    "authorizationUrl": "https://api.xeepy.dev/oauth/authorize",
                    "tokenUrl": "https://api.xeepy.dev/oauth/token",
                    "scopes": {
                        "read": "Read access",
                        "write": "Write access",
                        "admin": "Admin access",
                    }
                }
            }
        }
    }
    
    # Add tags metadata
    openapi_schema["tags"] = [
        {
            "name": "System",
            "description": "System health and information endpoints",
        },
        {
            "name": "Scraping",
            "description": "Scrape profiles, followers, tweets, and more",
        },
        {
            "name": "Following",
            "description": "Follow/unfollow automation and management",
        },
        {
            "name": "Engagement",
            "description": "Automated engagement (likes, retweets, replies)",
        },
        {
            "name": "Monitoring",
            "description": "Monitor followers, mentions, and keywords",
        },
        {
            "name": "AI Features",
            "description": "AI-powered content generation and analysis",
        },
        {
            "name": "Analytics",
            "description": "Analytics, insights, and reporting",
        },
    ]
    
    app.openapi_schema = openapi_schema
    return app.openapi_schema


# =============================================================================
# Application Factory
# =============================================================================


class XeepyAPI:
    """
    Xeepy FastAPI application wrapper.
    
    Provides a clean interface for creating and configuring the API server.
    """
    
    def __init__(
        self,
        title: str = "Xeepy API",
        debug: bool = False,
        enable_auth: bool = True,
        enable_rate_limiting: bool = True,
        enable_cors: bool = True,
        enable_metrics: bool = True,
        enable_websocket: bool = True,
        jwt_secret: Optional[str] = None,
        static_dir: Optional[Path] = None,
    ):
        if not HAS_FASTAPI:
            raise ImportError(
                "FastAPI is required to run the API server. "
                "Install with: pip install 'xeepy[api]' or pip install fastapi uvicorn"
            )
        
        self.debug = debug
        self.enable_auth = enable_auth
        self.enable_websocket = enable_websocket
        
        # Create FastAPI app
        self.app = FastAPI(
            title=title,
            version=__version__,
            debug=debug,
            docs_url="/docs",
            redoc_url="/redoc",
            openapi_url="/openapi.json",
        )
        
        # Setup components
        self.auth_manager: Optional[AuthManager] = None
        self.ws_manager: Optional[WebSocketManager] = None
        
        if enable_auth:
            self.auth_manager = AuthManager(jwt_secret=jwt_secret or "demo-secret-key")
        
        if enable_websocket:
            self.ws_manager = WebSocketManager()
        
        # Setup middleware
        self._setup_middleware(
            enable_rate_limiting=enable_rate_limiting,
            enable_cors=enable_cors,
            enable_metrics=enable_metrics,
        )
        
        # Setup routes
        self._setup_routes()
        
        # Setup static files
        if static_dir and static_dir.exists():
            self.app.mount("/static", StaticFiles(directory=str(static_dir)), name="static")
        
        # Setup exception handlers
        self._setup_exception_handlers()
        
        # Custom OpenAPI
        self.app.openapi = lambda: custom_openapi_schema(self.app)
        
        logger.info(f"XeepyAPI initialized (version {__version__})")
    
    def _setup_middleware(
        self,
        enable_rate_limiting: bool,
        enable_cors: bool,
        enable_metrics: bool,
    ):
        """Setup middleware stack."""
        # GZip compression
        self.app.add_middleware(GZipMiddleware, minimum_size=1000)
        
        # Metrics (should be first)
        if enable_metrics:
            self.app.add_middleware(
                MetricsMiddleware,
                exclude_paths=["/health", "/metrics", "/docs", "/redoc", "/openapi.json"],
            )
        
        # Logging
        self.app.add_middleware(
            LoggingMiddleware,
            exclude_paths=["/health", "/metrics"],
        )
        
        # Rate limiting
        if enable_rate_limiting:
            self.app.add_middleware(
                RateLimitMiddleware,
                config=RateLimitConfig(
                    requests_per_minute=60,
                    requests_per_hour=1000,
                    requests_per_day=10000,
                    exclude_paths=["/health", "/metrics", "/docs", "/redoc"],
                ),
            )
        
        # CORS
        if enable_cors:
            self.app.add_middleware(
                CORSMiddleware,
                config=CORSConfig(),
            )
    
    def _setup_routes(self):
        """Setup API routes."""
        # System routes
        @self.app.get("/", tags=["System"], include_in_schema=False)
        async def root():
            """Root endpoint - API information."""
            return HTMLResponse(content=f"""
<!DOCTYPE html>
<html>
<head>
    <title>Xeepy API</title>
    <style>
        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }}
        .container {{
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }}
        h1 {{
            font-size: 3em;
            margin: 0 0 10px 0;
        }}
        .version {{
            color: #ffd700;
            font-weight: bold;
        }}
        a {{
            color: #ffd700;
            text-decoration: none;
            font-weight: 500;
        }}
        a:hover {{
            text-decoration: underline;
        }}
        .warning {{
            background: rgba(255, 193, 7, 0.2);
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
            border-radius: 5px;
        }}
        .links {{
            margin-top: 30px;
        }}
        .links a {{
            display: inline-block;
            margin: 10px 15px 10px 0;
            padding: 10px 20px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 25px;
            transition: all 0.3s;
        }}
        .links a:hover {{
            background: rgba(255, 255, 255, 0.3);
            transform: translateY(-2px);
        }}
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Xeepy API</h1>
        <p class="version">Version {__version__}</p>
        <p>X/Twitter Automation Toolkit - REST API</p>
        
        <div class="warning">
            ⚠️ <strong>EDUCATIONAL PURPOSES ONLY</strong><br>
            This API is for demonstration and learning. No actual X/Twitter API calls are made.
        </div>
        
        <div class="links">
            <a href="/docs">📚 API Documentation</a>
            <a href="/redoc">📖 ReDoc</a>
            <a href="/health">❤️ Health Check</a>
            <a href="/metrics">📊 Metrics</a>
        </div>
        
        <p style="margin-top: 30px; font-size: 0.9em; opacity: 0.8;">
            Built with FastAPI • Python • ❤️
        </p>
    </div>
</body>
</html>
            """)
        
        @self.app.get(
            "/health",
            response_model=APIResponse[HealthCheck],
            tags=["System"],
            summary="Health check",
            description="Check API health and service status",
        )
        async def health_check():
            """Health check endpoint."""
            uptime = time.time() - SERVER_START_TIME
            
            services = [
                ServiceHealth(
                    name="API Server",
                    status="healthy",
                    latency_ms=1.2,
                ),
                ServiceHealth(
                    name="Auth System",
                    status="healthy" if self.auth_manager else "disabled",
                    latency_ms=0.5,
                ),
                ServiceHealth(
                    name="WebSocket",
                    status="healthy" if self.ws_manager else "disabled",
                    latency_ms=0.8,
                ),
            ]
            
            health = HealthCheck(
                status="healthy",
                version=__version__,
                uptime_seconds=uptime,
                services=services,
            )
            
            return APIResponse.ok(health)
        
        @self.app.get(
            "/metrics",
            response_class=PlainTextResponse,
            tags=["System"],
            summary="Prometheus metrics",
            description="Get Prometheus-formatted metrics",
        )
        async def metrics():
            """Prometheus metrics endpoint."""
            metrics_data = MetricsMiddleware.get_metrics()
            
            if not metrics_data:
                return "# No metrics available\n"
            
            # Format as Prometheus
            lines = []
            lines.append(f"# Xeepy API Metrics")
            lines.append(f"# Version: {__version__}")
            lines.append(f"xeepy_uptime_seconds {time.time() - SERVER_START_TIME:.2f}")
            lines.append(f"xeepy_requests_total {metrics_data.get('total_requests', 0)}")
            lines.append(f"xeepy_errors_total {metrics_data.get('total_errors', 0)}")
            lines.append(f"xeepy_response_time_avg_ms {metrics_data.get('avg_response_time_ms', 0):.2f}")
            
            return "\n".join(lines) + "\n"
        
        @self.app.get(
            "/version",
            response_model=APIResponse[dict],
            tags=["System"],
            summary="Version info",
            description="Get API version information",
        )
        async def version_info():
            """Version information."""
            info = {
                "version": __version__,
                "python_version": "3.8+",
                "framework": "FastAPI",
                "uptime_seconds": time.time() - SERVER_START_TIME,
            }
            return APIResponse.ok(info)
        
        # Import and include routers
        try:
            from xeepy.api.routes.scrape import scrape_router
            from xeepy.api.routes.follow import follow_router
            from xeepy.api.routes.engage import engage_router
            from xeepy.api.routes.monitor import monitor_router
            from xeepy.api.routes.ai import ai_router
            from xeepy.api.routes.analytics import analytics_router
            
            if scrape_router:
                self.app.include_router(scrape_router, prefix="/api")
            if follow_router:
                self.app.include_router(follow_router, prefix="/api")
            if engage_router:
                self.app.include_router(engage_router, prefix="/api")
            if monitor_router:
                self.app.include_router(monitor_router, prefix="/api")
            if ai_router:
                self.app.include_router(ai_router, prefix="/api")
            if analytics_router:
                self.app.include_router(analytics_router, prefix="/api")
            
            logger.info("All API routers loaded successfully")
            
        except ImportError as e:
            logger.warning(f"Some routers could not be loaded: {e}")
        
        # WebSocket route
        if self.enable_websocket and self.ws_manager:
            @self.app.websocket("/ws/{client_id}")
            async def websocket_route(websocket, client_id: str):
                """WebSocket endpoint."""
                await websocket_endpoint(websocket, self.ws_manager.connections, client_id)
    
    def _setup_exception_handlers(self):
        """Setup global exception handlers."""
        
        @self.app.exception_handler(404)
        async def not_found_handler(request: Request, exc):
            """Handle 404 errors."""
            return JSONResponse(
                status_code=404,
                content=ErrorResponse.create(
                    code="NOT_FOUND",
                    message=f"Endpoint not found: {request.url.path}",
                ).model_dump(),
            )
        
        @self.app.exception_handler(500)
        async def internal_error_handler(request: Request, exc):
            """Handle 500 errors."""
            logger.exception(f"Internal error: {exc}")
            return JSONResponse(
                status_code=500,
                content=ErrorResponse.create(
                    code="INTERNAL_ERROR",
                    message="An internal server error occurred",
                ).model_dump(),
            )
        
        @self.app.exception_handler(Exception)
        async def global_exception_handler(request: Request, exc: Exception):
            """Handle all uncaught exceptions."""
            logger.exception(f"Unhandled exception: {exc}")
            return JSONResponse(
                status_code=500,
                content=ErrorResponse.create(
                    code="UNEXPECTED_ERROR",
                    message=str(exc) if self.debug else "An unexpected error occurred",
                ).model_dump(),
            )
    
    async def startup(self):
        """Startup event handler."""
        logger.info("Starting Xeepy API server...")
        
        if self.ws_manager:
            await self.ws_manager.start()
            logger.info("WebSocket manager started")
        
        logger.success(f"Xeepy API server started (version {__version__})")
    
    async def shutdown(self):
        """Shutdown event handler."""
        logger.info("Shutting down Xeepy API server...")
        
        if self.ws_manager:
            await self.ws_manager.stop()
            logger.info("WebSocket manager stopped")
        
        logger.info("Xeepy API server stopped")


# =============================================================================
# Factory Function
# =============================================================================


def create_app(**kwargs) -> FastAPI:
    """
    Create and configure Xeepy FastAPI application.
    
    Args:
        **kwargs: Configuration options for XeepyAPI
        
    Returns:
        Configured FastAPI application
        
    Example:
        ```python
        from xeepy.api import create_app
        
        app = create_app(debug=True, enable_auth=False)
        
        # Run with uvicorn
        # uvicorn xeepy.api.server:create_app --factory --reload
        ```
    """
    xeepy_api = XeepyAPI(**kwargs)
    
    # Add startup/shutdown events
    @xeepy_api.app.on_event("startup")
    async def startup():
        await xeepy_api.startup()
    
    @xeepy_api.app.on_event("shutdown")
    async def shutdown():
        await xeepy_api.shutdown()
    
    return xeepy_api.app


# =============================================================================
# CLI Entry Point
# =============================================================================


def main():
    """Run the API server from command line."""
    try:
        import uvicorn
    except ImportError:
        print("uvicorn is required to run the server. Install with: pip install uvicorn")
        return
    
    import argparse
    
    parser = argparse.ArgumentParser(description="Run Xeepy API server")
    parser.add_argument("--host", default="0.0.0.0", help="Host to bind to")
    parser.add_argument("--port", type=int, default=8000, help="Port to bind to")
    parser.add_argument("--reload", action="store_true", help="Enable auto-reload")
    parser.add_argument("--debug", action="store_true", help="Enable debug mode")
    parser.add_argument("--workers", type=int, default=1, help="Number of worker processes")
    
    args = parser.parse_args()
    
    print(f"""
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   🚀 Starting Xeepy API Server                                ║
║                                                               ║
║   Version: {__version__:<50} ║
║   Host:    {args.host}:{args.port:<45} ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝

📚 API Documentation: http://{args.host}:{args.port}/docs
📖 ReDoc:             http://{args.host}:{args.port}/redoc
❤️  Health Check:      http://{args.host}:{args.port}/health

⚠️  EDUCATIONAL PURPOSES ONLY - No real API calls are made.
    """)
    
    uvicorn.run(
        "xeepy.api.server:create_app",
        host=args.host,
        port=args.port,
        reload=args.reload,
        workers=args.workers if not args.reload else 1,
        log_level="debug" if args.debug else "info",
        factory=True,
    )


if __name__ == "__main__":
    main()
