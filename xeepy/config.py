# SPDX-License-Identifier: MIT
# Copyright (c) 2025 Xeepy Contributors
"""
Configuration
=============

Centralized configuration management for Xeepy.
"""

import os
from dataclasses import dataclass, field
from enum import Enum
from pathlib import Path
from typing import Optional, Dict, Any
from loguru import logger

try:
    import yaml
    HAS_YAML = True
except ImportError:
    HAS_YAML = False


# =============================================================================
# Enums
# =============================================================================


class Environment(str, Enum):
    """Environment types."""
    DEVELOPMENT = "development"
    STAGING = "staging"
    PRODUCTION = "production"


class LogLevel(str, Enum):
    """Log levels."""
    DEBUG = "DEBUG"
    INFO = "INFO"
    WARNING = "WARNING"
    ERROR = "ERROR"
    CRITICAL = "CRITICAL"


# =============================================================================
# Configuration Classes
# =============================================================================


@dataclass
class AIConfig:
    """AI provider configuration."""
    
    # Provider selection
    default_provider: str = "openai"
    
    # OpenAI
    openai_api_key: Optional[str] = None
    openai_model: str = "gpt-4"
    openai_max_tokens: int = 1000
    openai_temperature: float = 0.7
    
    # Anthropic
    anthropic_api_key: Optional[str] = None
    anthropic_model: str = "claude-3-opus-20240229"
    anthropic_max_tokens: int = 1000
    anthropic_temperature: float = 0.7
    
    # Ollama
    ollama_base_url: str = "http://localhost:11434"
    ollama_model: str = "llama2"
    ollama_max_tokens: int = 1000
    ollama_temperature: float = 0.7
    
    # General AI settings
    enable_caching: bool = True
    cache_ttl_seconds: int = 3600
    max_retries: int = 3
    timeout_seconds: int = 30
    
    @classmethod
    def from_env(cls) -> "AIConfig":
        """Load configuration from environment variables."""
        return cls(
            default_provider=os.getenv("AI_PROVIDER", "openai"),
            openai_api_key=os.getenv("OPENAI_API_KEY"),
            openai_model=os.getenv("OPENAI_MODEL", "gpt-4"),
            anthropic_api_key=os.getenv("ANTHROPIC_API_KEY"),
            anthropic_model=os.getenv("ANTHROPIC_MODEL", "claude-3-opus-20240229"),
            ollama_base_url=os.getenv("OLLAMA_BASE_URL", "http://localhost:11434"),
        )


@dataclass
class RateLimitConfig:
    """Rate limiting configuration."""
    
    enabled: bool = True
    requests_per_minute: int = 60
    requests_per_hour: int = 1000
    requests_per_day: int = 10000
    
    # Burst allowance
    burst_size: int = 10
    
    # Cooldown
    cooldown_seconds: int = 60
    
    @classmethod
    def from_env(cls) -> "RateLimitConfig":
        """Load configuration from environment variables."""
        return cls(
            enabled=os.getenv("RATE_LIMIT_ENABLED", "true").lower() == "true",
            requests_per_minute=int(os.getenv("RATE_LIMIT_PER_MINUTE", "60")),
            requests_per_hour=int(os.getenv("RATE_LIMIT_PER_HOUR", "1000")),
            requests_per_day=int(os.getenv("RATE_LIMIT_PER_DAY", "10000")),
        )


@dataclass
class AuthConfig:
    """Authentication configuration."""
    
    enabled: bool = True
    jwt_secret: str = "demo-secret-key-change-in-production"
    jwt_algorithm: str = "HS256"
    jwt_expiry_minutes: int = 60
    
    # OAuth2 for X/Twitter
    twitter_client_id: Optional[str] = None
    twitter_client_secret: Optional[str] = None
    twitter_callback_url: str = "http://localhost:8000/auth/callback"
    
    # API Keys
    require_api_key: bool = False
    api_keys: list[str] = field(default_factory=list)
    
    @classmethod
    def from_env(cls) -> "AuthConfig":
        """Load configuration from environment variables."""
        api_keys = []
        if os.getenv("API_KEYS"):
            api_keys = os.getenv("API_KEYS", "").split(",")
        
        return cls(
            enabled=os.getenv("AUTH_ENABLED", "true").lower() == "true",
            jwt_secret=os.getenv("JWT_SECRET", "demo-secret-key-change-in-production"),
            jwt_expiry_minutes=int(os.getenv("JWT_EXPIRY_MINUTES", "60")),
            twitter_client_id=os.getenv("TWITTER_CLIENT_ID"),
            twitter_client_secret=os.getenv("TWITTER_CLIENT_SECRET"),
            require_api_key=os.getenv("REQUIRE_API_KEY", "false").lower() == "true",
            api_keys=api_keys,
        )


@dataclass
class DatabaseConfig:
    """Database configuration."""
    
    # SQLite (default)
    sqlite_path: Path = Path("xeepy.db")
    
    # PostgreSQL (optional)
    postgres_host: Optional[str] = None
    postgres_port: int = 5432
    postgres_user: Optional[str] = None
    postgres_password: Optional[str] = None
    postgres_database: Optional[str] = None
    
    # Redis (optional for caching)
    redis_host: Optional[str] = None
    redis_port: int = 6379
    redis_password: Optional[str] = None
    redis_db: int = 0
    
    # Connection pooling
    pool_size: int = 10
    max_overflow: int = 20
    pool_timeout_seconds: int = 30
    
    @classmethod
    def from_env(cls) -> "DatabaseConfig":
        """Load configuration from environment variables."""
        return cls(
            sqlite_path=Path(os.getenv("SQLITE_PATH", "xeepy.db")),
            postgres_host=os.getenv("POSTGRES_HOST"),
            postgres_port=int(os.getenv("POSTGRES_PORT", "5432")),
            postgres_user=os.getenv("POSTGRES_USER"),
            postgres_password=os.getenv("POSTGRES_PASSWORD"),
            postgres_database=os.getenv("POSTGRES_DATABASE"),
            redis_host=os.getenv("REDIS_HOST"),
            redis_port=int(os.getenv("REDIS_PORT", "6379")),
            redis_password=os.getenv("REDIS_PASSWORD"),
        )


@dataclass
class ServerConfig:
    """Server configuration."""
    
    host: str = "0.0.0.0"
    port: int = 8000
    workers: int = 1
    reload: bool = False
    debug: bool = False
    
    # CORS
    cors_enabled: bool = True
    cors_origins: list[str] = field(default_factory=lambda: ["*"])
    cors_allow_credentials: bool = True
    
    # WebSocket
    websocket_enabled: bool = True
    websocket_heartbeat_interval: int = 30
    
    # Static files
    static_dir: Optional[Path] = None
    
    @classmethod
    def from_env(cls) -> "ServerConfig":
        """Load configuration from environment variables."""
        origins = ["*"]
        if os.getenv("CORS_ORIGINS"):
            origins = os.getenv("CORS_ORIGINS", "").split(",")
        
        return cls(
            host=os.getenv("HOST", "0.0.0.0"),
            port=int(os.getenv("PORT", "8000")),
            workers=int(os.getenv("WORKERS", "1")),
            reload=os.getenv("RELOAD", "false").lower() == "true",
            debug=os.getenv("DEBUG", "false").lower() == "true",
            cors_enabled=os.getenv("CORS_ENABLED", "true").lower() == "true",
            cors_origins=origins,
            websocket_enabled=os.getenv("WEBSOCKET_ENABLED", "true").lower() == "true",
        )


@dataclass
class LoggingConfig:
    """Logging configuration."""
    
    level: LogLevel = LogLevel.INFO
    format: str = "<green>{time:YYYY-MM-DD HH:mm:ss}</green> | <level>{level: <8}</level> | <cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - <level>{message}</level>"
    
    # File logging
    log_to_file: bool = True
    log_file: Path = Path("xeepy.log")
    log_rotation: str = "500 MB"
    log_retention: str = "10 days"
    
    # JSON logging
    json_logs: bool = False
    
    # Sensitive data masking
    mask_sensitive: bool = True
    
    @classmethod
    def from_env(cls) -> "LoggingConfig":
        """Load configuration from environment variables."""
        level_str = os.getenv("LOG_LEVEL", "INFO").upper()
        level = LogLevel[level_str] if level_str in LogLevel.__members__ else LogLevel.INFO
        
        return cls(
            level=level,
            log_to_file=os.getenv("LOG_TO_FILE", "true").lower() == "true",
            log_file=Path(os.getenv("LOG_FILE", "xeepy.log")),
            json_logs=os.getenv("JSON_LOGS", "false").lower() == "true",
        )


@dataclass
class XeepyConfig:
    """Main Xeepy configuration."""
    
    environment: Environment = Environment.DEVELOPMENT
    
    # Sub-configurations
    ai: AIConfig = field(default_factory=AIConfig)
    rate_limit: RateLimitConfig = field(default_factory=RateLimitConfig)
    auth: AuthConfig = field(default_factory=AuthConfig)
    database: DatabaseConfig = field(default_factory=DatabaseConfig)
    server: ServerConfig = field(default_factory=ServerConfig)
    logging: LoggingConfig = field(default_factory=LoggingConfig)
    
    # General settings
    demo_mode: bool = True
    enable_metrics: bool = True
    enable_analytics: bool = True
    
    # Twitter simulation settings (for demo)
    simulate_delays: bool = True
    min_delay_ms: int = 100
    max_delay_ms: int = 500
    
    @classmethod
    def from_env(cls) -> "XeepyConfig":
        """Load configuration from environment variables."""
        env_str = os.getenv("ENVIRONMENT", "development").lower()
        environment = Environment(env_str) if env_str in [e.value for e in Environment] else Environment.DEVELOPMENT
        
        return cls(
            environment=environment,
            ai=AIConfig.from_env(),
            rate_limit=RateLimitConfig.from_env(),
            auth=AuthConfig.from_env(),
            database=DatabaseConfig.from_env(),
            server=ServerConfig.from_env(),
            logging=LoggingConfig.from_env(),
            demo_mode=os.getenv("DEMO_MODE", "true").lower() == "true",
            enable_metrics=os.getenv("ENABLE_METRICS", "true").lower() == "true",
            enable_analytics=os.getenv("ENABLE_ANALYTICS", "true").lower() == "true",
        )
    
    @classmethod
    def from_file(cls, path: Path) -> "XeepyConfig":
        """Load configuration from YAML file."""
        if not HAS_YAML:
            raise ImportError("PyYAML is required to load config files. Install with: pip install pyyaml")
        
        if not path.exists():
            raise FileNotFoundError(f"Config file not found: {path}")
        
        with open(path) as f:
            data = yaml.safe_load(f)
        
        # Parse sub-configs
        config = cls()
        
        if "environment" in data:
            config.environment = Environment(data["environment"])
        
        if "ai" in data:
            config.ai = AIConfig(**data["ai"])
        
        if "rate_limit" in data:
            config.rate_limit = RateLimitConfig(**data["rate_limit"])
        
        if "auth" in data:
            config.auth = AuthConfig(**data["auth"])
        
        if "database" in data:
            config.database = DatabaseConfig(**data["database"])
        
        if "server" in data:
            config.server = ServerConfig(**data["server"])
        
        if "logging" in data:
            level_str = data["logging"].get("level", "INFO").upper()
            if level_str in LogLevel.__members__:
                data["logging"]["level"] = LogLevel[level_str]
            config.logging = LoggingConfig(**data["logging"])
        
        # General settings
        config.demo_mode = data.get("demo_mode", True)
        config.enable_metrics = data.get("enable_metrics", True)
        config.enable_analytics = data.get("enable_analytics", True)
        
        return config
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert configuration to dictionary."""
        return {
            "environment": self.environment.value,
            "ai": self.ai.__dict__,
            "rate_limit": self.rate_limit.__dict__,
            "auth": {**self.auth.__dict__, "jwt_secret": "***REDACTED***"},
            "database": {**self.database.__dict__, "postgres_password": "***REDACTED***", "redis_password": "***REDACTED***"},
            "server": self.server.__dict__,
            "logging": {"level": self.logging.level.value, **{k: v for k, v in self.logging.__dict__.items() if k != "level"}},
            "demo_mode": self.demo_mode,
            "enable_metrics": self.enable_metrics,
            "enable_analytics": self.enable_analytics,
        }
    
    def save(self, path: Path):
        """Save configuration to YAML file."""
        if not HAS_YAML:
            raise ImportError("PyYAML is required to save config files. Install with: pip install pyyaml")
        
        with open(path, "w") as f:
            yaml.safe_dump(self.to_dict(), f, default_flow_style=False, sort_keys=False)
        
        logger.info(f"Configuration saved to {path}")


# =============================================================================
# Global Configuration
# =============================================================================


# Global config instance
_config: Optional[XeepyConfig] = None


def get_config() -> XeepyConfig:
    """Get global configuration instance."""
    global _config
    
    if _config is None:
        # Try to load from file
        config_path = Path("xeepy.yml")
        if config_path.exists():
            _config = XeepyConfig.from_file(config_path)
            logger.info("Configuration loaded from xeepy.yml")
        else:
            # Load from environment
            _config = XeepyConfig.from_env()
            logger.info("Configuration loaded from environment variables")
    
    return _config


def set_config(config: XeepyConfig):
    """Set global configuration instance."""
    global _config
    _config = config


def reset_config():
    """Reset global configuration."""
    global _config
    _config = None


# =============================================================================
# Configuration Template
# =============================================================================


def create_config_template(path: Path):
    """Create a configuration template file."""
    if not HAS_YAML:
        raise ImportError("PyYAML is required to create config files. Install with: pip install pyyaml")
    
    template = XeepyConfig()
    template.save(path)
    logger.success(f"Configuration template created at {path}")


# =============================================================================
# Exports
# =============================================================================


__all__ = [
    "Environment",
    "LogLevel",
    "AIConfig",
    "RateLimitConfig",
    "AuthConfig",
    "DatabaseConfig",
    "ServerConfig",
    "LoggingConfig",
    "XeepyConfig",
    "get_config",
    "set_config",
    "reset_config",
    "create_config_template",
]
