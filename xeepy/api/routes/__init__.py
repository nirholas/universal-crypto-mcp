# SPDX-License-Identifier: MIT
# Copyright (c) 2025 Xeepy Contributors
"""
API Route Modules
=================

This package contains all API route handlers organized by feature.
"""

# Route imports will be made available when FastAPI is installed
# Each router module provides endpoints for its feature area

__all__ = [
    "scrape_router",
    "follow_router",
    "engage_router",
    "monitor_router",
    "ai_router",
    "analytics_router",
]

# Lazy imports to avoid dependency issues
def __getattr__(name):
    if name in __all__:
        from xeepy.api import routes
        return getattr(routes, name)
    raise AttributeError(f"module {__name__!r} has no attribute {name!r}")
