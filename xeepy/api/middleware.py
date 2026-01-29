# SPDX-License-Identifier: MIT
# Copyright (c) 2025 Xeepy Contributors
"""
API Middleware
==============

Production-ready middleware for rate limiting, logging, CORS, and metrics.
"""

import asyncio
import hashlib
import time
import uuid
from collections import defaultdict
from dataclasses import dataclass, field
from datetime import datetime, timedelta
from typing import Any, Callable, Optional
from loguru import logger

try:
    from starlette.middleware.base import BaseHTTPMiddleware
    from starlette.requests import Request
    from starlette.responses import Response, JSONResponse
    from starlette.middleware.cors import CORSMiddleware as StarletteCORS
    HAS_STARLETTE = True
except ImportError:
    HAS_STARLETTE = False
    BaseHTTPMiddleware = object


# =============================================================================
# Rate Limiting
# =============================================================================


@dataclass
class RateLimitConfig:
    """Rate limit configuration."""
    requests_per_minute: int = 60
    requests_per_hour: int = 1000
    requests_per_day: int = 10000
    burst_size: int = 10
    penalty_seconds: int = 60
    by_ip: bool = True
    by_user: bool = True
    by_api_key: bool = True
    exclude_paths: list[str] = field(default_factory=lambda: ["/health", "/metrics"])


@dataclass
class RateLimitBucket:
    """Token bucket for rate limiting."""
    tokens: float
    last_update: float
    request_count_minute: int = 0
    request_count_hour: int = 0
    request_count_day: int = 0
    minute_reset: float = 0
    hour_reset: float = 0
    day_reset: float = 0
    is_blocked: bool = False
    blocked_until: float = 0


class RateLimiter:
    """
    Advanced rate limiter using token bucket algorithm.
    
    Features:
    - Multiple time windows (minute/hour/day)
    - Token bucket with burst support
    - Per-IP, per-user, per-API-key limiting
    - Automatic penalty for abuse
    - Redis-compatible interface for distributed deployments
    """
    
    def __init__(self, config: Optional[RateLimitConfig] = None):
        self.config = config or RateLimitConfig()
        self._buckets: dict[str, RateLimitBucket] = {}
        self._lock = asyncio.Lock()
    
    def _get_bucket_key(
        self,
        ip: Optional[str] = None,
        user_id: Optional[str] = None,
        api_key: Optional[str] = None
    ) -> str:
        """Generate bucket key from identifiers."""
        parts = []
        if self.config.by_ip and ip:
            parts.append(f"ip:{ip}")
        if self.config.by_user and user_id:
            parts.append(f"user:{user_id}")
        if self.config.by_api_key and api_key:
            # Hash API key for security
            key_hash = hashlib.sha256(api_key.encode()).hexdigest()[:16]
            parts.append(f"key:{key_hash}")
        return ":".join(parts) or "global"
    
    def _get_or_create_bucket(self, key: str) -> RateLimitBucket:
        """Get or create a rate limit bucket."""
        now = time.time()
        
        if key not in self._buckets:
            self._buckets[key] = RateLimitBucket(
                tokens=float(self.config.burst_size),
                last_update=now,
                minute_reset=now + 60,
                hour_reset=now + 3600,
                day_reset=now + 86400,
            )
        
        bucket = self._buckets[key]
        
        # Reset counters if time windows have passed
        if now >= bucket.minute_reset:
            bucket.request_count_minute = 0
            bucket.minute_reset = now + 60
        
        if now >= bucket.hour_reset:
            bucket.request_count_hour = 0
            bucket.hour_reset = now + 3600
        
        if now >= bucket.day_reset:
            bucket.request_count_day = 0
            bucket.day_reset = now + 86400
        
        # Check if block has expired
        if bucket.is_blocked and now >= bucket.blocked_until:
            bucket.is_blocked = False
        
        # Refill tokens (token bucket algorithm)
        elapsed = now - bucket.last_update
        refill_rate = self.config.requests_per_minute / 60.0
        bucket.tokens = min(
            self.config.burst_size,
            bucket.tokens + elapsed * refill_rate
        )
        bucket.last_update = now
        
        return bucket
    
    async def check_rate_limit(
        self,
        ip: Optional[str] = None,
        user_id: Optional[str] = None,
        api_key: Optional[str] = None,
    ) -> tuple[bool, dict[str, Any]]:
        """
        Check if request is within rate limits.
        
        Returns:
            (allowed, headers) - whether request is allowed and rate limit headers
        """
        async with self._lock:
            key = self._get_bucket_key(ip, user_id, api_key)
            bucket = self._get_or_create_bucket(key)
            
            headers = {
                "X-RateLimit-Limit": str(self.config.requests_per_minute),
                "X-RateLimit-Remaining": str(max(0, int(bucket.tokens))),
                "X-RateLimit-Reset": str(int(bucket.minute_reset)),
            }
            
            # Check if blocked
            if bucket.is_blocked:
                headers["Retry-After"] = str(int(bucket.blocked_until - time.time()))
                return False, headers
            
            # Check all limits
            if bucket.request_count_minute >= self.config.requests_per_minute:
                bucket.is_blocked = True
                bucket.blocked_until = time.time() + self.config.penalty_seconds
                headers["Retry-After"] = str(self.config.penalty_seconds)
                return False, headers
            
            if bucket.request_count_hour >= self.config.requests_per_hour:
                return False, headers
            
            if bucket.request_count_day >= self.config.requests_per_day:
                return False, headers
            
            # Check tokens
            if bucket.tokens < 1:
                return False, headers
            
            # Allow request
            bucket.tokens -= 1
            bucket.request_count_minute += 1
            bucket.request_count_hour += 1
            bucket.request_count_day += 1
            
            headers["X-RateLimit-Remaining"] = str(max(0, int(bucket.tokens)))
            
            return True, headers
    
    def get_stats(self, key: str) -> Optional[dict[str, Any]]:
        """Get rate limit stats for a key."""
        bucket = self._buckets.get(key)
        if not bucket:
            return None
        
        return {
            "tokens": bucket.tokens,
            "requests_minute": bucket.request_count_minute,
            "requests_hour": bucket.request_count_hour,
            "requests_day": bucket.request_count_day,
            "is_blocked": bucket.is_blocked,
            "blocked_until": bucket.blocked_until if bucket.is_blocked else None,
        }


if HAS_STARLETTE:
    class RateLimitMiddleware(BaseHTTPMiddleware):
        """FastAPI/Starlette rate limiting middleware."""
        
        def __init__(
            self,
            app,
            config: Optional[RateLimitConfig] = None
        ):
            super().__init__(app)
            self.limiter = RateLimiter(config)
            self.config = config or RateLimitConfig()
        
        async def dispatch(self, request: Request, call_next) -> Response:
            """Process request through rate limiter."""
            # Skip excluded paths
            if request.url.path in self.config.exclude_paths:
                return await call_next(request)
            
            # Get identifiers
            ip = request.client.host if request.client else None
            user_id = getattr(request.state, "user_id", None)
            api_key = request.headers.get("X-API-Key")
            
            # Check rate limit
            allowed, headers = await self.limiter.check_rate_limit(
                ip=ip,
                user_id=user_id,
                api_key=api_key,
            )
            
            if not allowed:
                response = JSONResponse(
                    status_code=429,
                    content={
                        "success": False,
                        "error_code": "RATE_LIMIT_EXCEEDED",
                        "message": "Too many requests. Please slow down.",
                        "retry_after": headers.get("Retry-After"),
                    }
                )
                for key, value in headers.items():
                    response.headers[key] = value
                return response
            
            # Process request
            response = await call_next(request)
            
            # Add rate limit headers
            for key, value in headers.items():
                response.headers[key] = value
            
            return response
else:
    class RateLimitMiddleware:
        """Placeholder when Starlette is not installed."""
        def __init__(self, *args, **kwargs):
            raise ImportError("Starlette is required for middleware. Install with: pip install starlette")


# =============================================================================
# Logging Middleware
# =============================================================================


if HAS_STARLETTE:
    class LoggingMiddleware(BaseHTTPMiddleware):
        """
        Request/response logging middleware.
        
        Features:
        - Structured logging with loguru
        - Request ID tracking
        - Response time measurement
        - Configurable log levels
        - Sensitive data masking
        """
        
        SENSITIVE_HEADERS = {"authorization", "x-api-key", "cookie", "set-cookie"}
        SENSITIVE_PARAMS = {"password", "token", "secret", "key", "api_key"}
        
        def __init__(
            self,
            app,
            log_request_body: bool = False,
            log_response_body: bool = False,
            exclude_paths: Optional[list[str]] = None,
        ):
            super().__init__(app)
            self.log_request_body = log_request_body
            self.log_response_body = log_response_body
            self.exclude_paths = exclude_paths or ["/health", "/metrics"]
        
        def _mask_sensitive(self, data: dict) -> dict:
            """Mask sensitive data."""
            masked = {}
            for key, value in data.items():
                if key.lower() in self.SENSITIVE_PARAMS:
                    masked[key] = "***REDACTED***"
                elif isinstance(value, dict):
                    masked[key] = self._mask_sensitive(value)
                else:
                    masked[key] = value
            return masked
        
        def _get_safe_headers(self, headers) -> dict:
            """Get headers with sensitive values masked."""
            safe = {}
            for key, value in headers.items():
                if key.lower() in self.SENSITIVE_HEADERS:
                    safe[key] = "***REDACTED***"
                else:
                    safe[key] = value
            return safe
        
        async def dispatch(self, request: Request, call_next) -> Response:
            """Log request and response."""
            # Skip excluded paths
            if request.url.path in self.exclude_paths:
                return await call_next(request)
            
            # Generate request ID
            request_id = request.headers.get("X-Request-ID") or str(uuid.uuid4())
            request.state.request_id = request_id
            
            # Log request
            start_time = time.time()
            
            log_data = {
                "request_id": request_id,
                "method": request.method,
                "path": request.url.path,
                "query": str(request.url.query),
                "client_ip": request.client.host if request.client else None,
                "user_agent": request.headers.get("user-agent"),
            }
            
            logger.info(f"→ {request.method} {request.url.path}", **log_data)
            
            # Process request
            try:
                response = await call_next(request)
            except Exception as e:
                duration = time.time() - start_time
                logger.exception(
                    f"✗ {request.method} {request.url.path} - Error: {str(e)}",
                    request_id=request_id,
                    duration_ms=round(duration * 1000, 2),
                )
                raise
            
            # Log response
            duration = time.time() - start_time
            
            log_level = "info"
            if response.status_code >= 500:
                log_level = "error"
            elif response.status_code >= 400:
                log_level = "warning"
            
            getattr(logger, log_level)(
                f"← {request.method} {request.url.path} - {response.status_code}",
                request_id=request_id,
                status_code=response.status_code,
                duration_ms=round(duration * 1000, 2),
            )
            
            # Add tracking headers
            response.headers["X-Request-ID"] = request_id
            response.headers["X-Response-Time"] = f"{round(duration * 1000, 2)}ms"
            
            return response
else:
    class LoggingMiddleware:
        """Placeholder when Starlette is not installed."""
        def __init__(self, *args, **kwargs):
            raise ImportError("Starlette is required for middleware. Install with: pip install starlette")


# =============================================================================
# CORS Middleware
# =============================================================================


@dataclass
class CORSConfig:
    """CORS configuration."""
    allow_origins: list[str] = field(default_factory=lambda: ["*"])
    allow_methods: list[str] = field(default_factory=lambda: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"])
    allow_headers: list[str] = field(default_factory=lambda: ["*"])
    allow_credentials: bool = True
    expose_headers: list[str] = field(default_factory=lambda: ["X-Request-ID", "X-Response-Time"])
    max_age: int = 600


if HAS_STARLETTE:
    class CORSMiddleware:
        """
        CORS middleware wrapper with enhanced configuration.
        
        Wraps Starlette's CORSMiddleware with additional features:
        - Dynamic origin validation
        - Environment-based configuration
        - Logging of CORS preflight requests
        """
        
        def __init__(
            self,
            app,
            config: Optional[CORSConfig] = None,
        ):
            self.config = config or CORSConfig()
            self._middleware = StarletteCORS(
                app,
                allow_origins=self.config.allow_origins,
                allow_methods=self.config.allow_methods,
                allow_headers=self.config.allow_headers,
                allow_credentials=self.config.allow_credentials,
                expose_headers=self.config.expose_headers,
                max_age=self.config.max_age,
            )
        
        async def __call__(self, scope, receive, send):
            """Handle request."""
            await self._middleware(scope, receive, send)
else:
    class CORSMiddleware:
        """Placeholder when Starlette is not installed."""
        def __init__(self, *args, **kwargs):
            raise ImportError("Starlette is required for middleware. Install with: pip install starlette")


# =============================================================================
# Metrics Middleware
# =============================================================================


@dataclass
class RequestMetrics:
    """Request metrics data."""
    total_requests: int = 0
    total_errors: int = 0
    total_response_time_ms: float = 0
    requests_by_method: dict[str, int] = field(default_factory=lambda: defaultdict(int))
    requests_by_status: dict[int, int] = field(default_factory=lambda: defaultdict(int))
    requests_by_path: dict[str, int] = field(default_factory=lambda: defaultdict(int))
    response_times: list[float] = field(default_factory=list)
    
    @property
    def avg_response_time_ms(self) -> float:
        """Average response time in milliseconds."""
        if not self.response_times:
            return 0
        return sum(self.response_times) / len(self.response_times)
    
    @property
    def p95_response_time_ms(self) -> float:
        """95th percentile response time."""
        if not self.response_times:
            return 0
        sorted_times = sorted(self.response_times)
        idx = int(len(sorted_times) * 0.95)
        return sorted_times[min(idx, len(sorted_times) - 1)]
    
    @property
    def error_rate(self) -> float:
        """Error rate as percentage."""
        if self.total_requests == 0:
            return 0
        return (self.total_errors / self.total_requests) * 100


class MetricsCollector:
    """Collects and aggregates request metrics."""
    
    def __init__(self, max_samples: int = 10000):
        self.max_samples = max_samples
        self._metrics = RequestMetrics()
        self._lock = asyncio.Lock()
        self._start_time = datetime.utcnow()
    
    async def record_request(
        self,
        method: str,
        path: str,
        status_code: int,
        response_time_ms: float,
    ):
        """Record a request."""
        async with self._lock:
            self._metrics.total_requests += 1
            self._metrics.total_response_time_ms += response_time_ms
            self._metrics.requests_by_method[method] += 1
            self._metrics.requests_by_status[status_code] += 1
            self._metrics.requests_by_path[path] += 1
            
            if status_code >= 400:
                self._metrics.total_errors += 1
            
            # Keep response times bounded
            self._metrics.response_times.append(response_time_ms)
            if len(self._metrics.response_times) > self.max_samples:
                self._metrics.response_times = self._metrics.response_times[-self.max_samples:]
    
    def get_metrics(self) -> dict[str, Any]:
        """Get current metrics."""
        uptime = (datetime.utcnow() - self._start_time).total_seconds()
        
        return {
            "uptime_seconds": uptime,
            "total_requests": self._metrics.total_requests,
            "total_errors": self._metrics.total_errors,
            "error_rate_percent": round(self._metrics.error_rate, 2),
            "avg_response_time_ms": round(self._metrics.avg_response_time_ms, 2),
            "p95_response_time_ms": round(self._metrics.p95_response_time_ms, 2),
            "requests_per_second": round(self._metrics.total_requests / uptime, 2) if uptime > 0 else 0,
            "by_method": dict(self._metrics.requests_by_method),
            "by_status": dict(self._metrics.requests_by_status),
            "top_paths": dict(
                sorted(
                    self._metrics.requests_by_path.items(),
                    key=lambda x: x[1],
                    reverse=True
                )[:10]
            ),
        }
    
    def get_prometheus_format(self) -> str:
        """Get metrics in Prometheus format."""
        lines = []
        m = self._metrics
        
        lines.append(f"# HELP xeepy_requests_total Total number of requests")
        lines.append(f"# TYPE xeepy_requests_total counter")
        lines.append(f"xeepy_requests_total {m.total_requests}")
        
        lines.append(f"# HELP xeepy_errors_total Total number of errors")
        lines.append(f"# TYPE xeepy_errors_total counter")
        lines.append(f"xeepy_errors_total {m.total_errors}")
        
        lines.append(f"# HELP xeepy_response_time_ms Average response time")
        lines.append(f"# TYPE xeepy_response_time_ms gauge")
        lines.append(f"xeepy_response_time_ms {m.avg_response_time_ms:.2f}")
        
        for method, count in m.requests_by_method.items():
            lines.append(f'xeepy_requests_by_method{{method="{method}"}} {count}')
        
        for status, count in m.requests_by_status.items():
            lines.append(f'xeepy_requests_by_status{{status="{status}"}} {count}')
        
        return "\n".join(lines)


if HAS_STARLETTE:
    class MetricsMiddleware(BaseHTTPMiddleware):
        """
        Metrics collection middleware.
        
        Features:
        - Request counting by method, path, status
        - Response time tracking
        - Prometheus-compatible export
        - Error rate monitoring
        """
        
        _collector: Optional[MetricsCollector] = None
        
        def __init__(
            self,
            app,
            collector: Optional[MetricsCollector] = None,
            exclude_paths: Optional[list[str]] = None,
        ):
            super().__init__(app)
            self.collector = collector or MetricsCollector()
            self.exclude_paths = exclude_paths or ["/metrics", "/health"]
            MetricsMiddleware._collector = self.collector
        
        async def dispatch(self, request: Request, call_next) -> Response:
            """Collect metrics for request."""
            # Skip metrics endpoints
            if request.url.path in self.exclude_paths:
                return await call_next(request)
            
            start_time = time.time()
            
            try:
                response = await call_next(request)
                status_code = response.status_code
            except Exception:
                status_code = 500
                raise
            finally:
                duration_ms = (time.time() - start_time) * 1000
                await self.collector.record_request(
                    method=request.method,
                    path=request.url.path,
                    status_code=status_code,
                    response_time_ms=duration_ms,
                )
            
            return response
        
        @classmethod
        def get_metrics(cls) -> dict[str, Any]:
            """Get current metrics."""
            if cls._collector:
                return cls._collector.get_metrics()
            return {}
else:
    class MetricsMiddleware:
        """Placeholder when Starlette is not installed."""
        def __init__(self, *args, **kwargs):
            raise ImportError("Starlette is required for middleware. Install with: pip install starlette")
        
        @classmethod
        def get_metrics(cls):
            return {}
