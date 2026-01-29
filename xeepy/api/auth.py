# SPDX-License-Identifier: MIT
# Copyright (c) 2025 Xeepy Contributors
"""
Authentication & Authorization
==============================

Comprehensive auth system with OAuth2, JWT, and API key support.
"""

import hashlib
import hmac
import secrets
import time
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from datetime import datetime, timedelta
from enum import Enum
from typing import Any, Optional
from loguru import logger

try:
    import jwt
    HAS_JWT = True
except ImportError:
    HAS_JWT = False

try:
    from passlib.context import CryptContext
    HAS_PASSLIB = True
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
except ImportError:
    HAS_PASSLIB = False
    pwd_context = None


# =============================================================================
# Enums & Constants
# =============================================================================


class AuthMethod(str, Enum):
    """Supported authentication methods."""
    API_KEY = "api_key"
    JWT = "jwt"
    OAUTH2 = "oauth2"
    BASIC = "basic"


class Permission(str, Enum):
    """Permission types."""
    READ = "read"
    WRITE = "write"
    DELETE = "delete"
    ADMIN = "admin"
    SCRAPE = "scrape"
    FOLLOW = "follow"
    ENGAGE = "engage"
    AI = "ai"
    ANALYTICS = "analytics"


class Role(str, Enum):
    """User roles."""
    VIEWER = "viewer"
    USER = "user"
    POWER_USER = "power_user"
    ADMIN = "admin"
    SUPER_ADMIN = "super_admin"


# Role to permissions mapping
ROLE_PERMISSIONS: dict[Role, set[Permission]] = {
    Role.VIEWER: {Permission.READ},
    Role.USER: {Permission.READ, Permission.WRITE, Permission.SCRAPE, Permission.ENGAGE},
    Role.POWER_USER: {Permission.READ, Permission.WRITE, Permission.DELETE, Permission.SCRAPE, 
                       Permission.FOLLOW, Permission.ENGAGE, Permission.AI},
    Role.ADMIN: {Permission.READ, Permission.WRITE, Permission.DELETE, Permission.SCRAPE,
                  Permission.FOLLOW, Permission.ENGAGE, Permission.AI, Permission.ANALYTICS},
    Role.SUPER_ADMIN: set(Permission),
}


# =============================================================================
# Data Classes
# =============================================================================


@dataclass
class TokenPayload:
    """JWT token payload."""
    user_id: str
    username: str
    email: Optional[str] = None
    role: Role = Role.USER
    permissions: set[Permission] = field(default_factory=set)
    issued_at: datetime = field(default_factory=datetime.utcnow)
    expires_at: Optional[datetime] = None
    token_type: str = "access"
    jti: str = field(default_factory=lambda: secrets.token_hex(16))
    
    def is_expired(self) -> bool:
        """Check if token is expired."""
        if self.expires_at is None:
            return False
        return datetime.utcnow() > self.expires_at
    
    def has_permission(self, permission: Permission) -> bool:
        """Check if token has a specific permission."""
        if self.permissions:
            return permission in self.permissions
        return permission in ROLE_PERMISSIONS.get(self.role, set())
    
    def to_dict(self) -> dict[str, Any]:
        """Convert to dictionary for JWT encoding."""
        return {
            "sub": self.user_id,
            "username": self.username,
            "email": self.email,
            "role": self.role.value,
            "permissions": [p.value for p in self.permissions],
            "iat": int(self.issued_at.timestamp()),
            "exp": int(self.expires_at.timestamp()) if self.expires_at else None,
            "type": self.token_type,
            "jti": self.jti,
        }
    
    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> "TokenPayload":
        """Create from dictionary."""
        return cls(
            user_id=data.get("sub", ""),
            username=data.get("username", ""),
            email=data.get("email"),
            role=Role(data.get("role", "user")),
            permissions={Permission(p) for p in data.get("permissions", [])},
            issued_at=datetime.fromtimestamp(data.get("iat", time.time())),
            expires_at=datetime.fromtimestamp(data["exp"]) if data.get("exp") else None,
            token_type=data.get("type", "access"),
            jti=data.get("jti", secrets.token_hex(16)),
        )


@dataclass
class APIKey:
    """API key data."""
    key_id: str
    key_hash: str
    user_id: str
    name: str
    permissions: set[Permission] = field(default_factory=set)
    rate_limit: int = 1000  # requests per hour
    created_at: datetime = field(default_factory=datetime.utcnow)
    expires_at: Optional[datetime] = None
    last_used_at: Optional[datetime] = None
    is_active: bool = True
    
    def is_valid(self) -> bool:
        """Check if key is valid."""
        if not self.is_active:
            return False
        if self.expires_at and datetime.utcnow() > self.expires_at:
            return False
        return True


@dataclass
class OAuth2Token:
    """OAuth2 token data."""
    access_token: str
    token_type: str = "bearer"
    refresh_token: Optional[str] = None
    expires_in: int = 3600
    scope: str = ""
    created_at: datetime = field(default_factory=datetime.utcnow)
    
    @property
    def expires_at(self) -> datetime:
        """Get expiration datetime."""
        return self.created_at + timedelta(seconds=self.expires_in)
    
    def is_expired(self) -> bool:
        """Check if token is expired."""
        return datetime.utcnow() > self.expires_at


@dataclass
class AuthResult:
    """Authentication result."""
    success: bool
    user_id: Optional[str] = None
    username: Optional[str] = None
    role: Optional[Role] = None
    permissions: set[Permission] = field(default_factory=set)
    error: Optional[str] = None
    auth_method: Optional[AuthMethod] = None


# =============================================================================
# Abstract Auth Handler
# =============================================================================


class AuthHandler(ABC):
    """Abstract authentication handler."""
    
    @abstractmethod
    async def authenticate(self, credentials: Any) -> AuthResult:
        """Authenticate with given credentials."""
        pass
    
    @abstractmethod
    async def validate(self, token: str) -> AuthResult:
        """Validate a token/key."""
        pass


# =============================================================================
# JWT Handler
# =============================================================================


class JWTHandler(AuthHandler):
    """JSON Web Token authentication handler."""
    
    def __init__(
        self,
        secret_key: str,
        algorithm: str = "HS256",
        access_token_expire_minutes: int = 30,
        refresh_token_expire_days: int = 7,
        issuer: Optional[str] = None,
        audience: Optional[str] = None,
    ):
        if not HAS_JWT:
            raise ImportError("PyJWT is required for JWT authentication. Install with: pip install pyjwt")
        
        self.secret_key = secret_key
        self.algorithm = algorithm
        self.access_token_expire = timedelta(minutes=access_token_expire_minutes)
        self.refresh_token_expire = timedelta(days=refresh_token_expire_days)
        self.issuer = issuer
        self.audience = audience
        self._revoked_tokens: set[str] = set()
    
    def create_access_token(
        self,
        user_id: str,
        username: str,
        role: Role = Role.USER,
        permissions: Optional[set[Permission]] = None,
        expires_delta: Optional[timedelta] = None,
    ) -> str:
        """Create a new access token."""
        now = datetime.utcnow()
        expires = now + (expires_delta or self.access_token_expire)
        
        payload = TokenPayload(
            user_id=user_id,
            username=username,
            role=role,
            permissions=permissions or set(),
            issued_at=now,
            expires_at=expires,
            token_type="access",
        )
        
        data = payload.to_dict()
        if self.issuer:
            data["iss"] = self.issuer
        if self.audience:
            data["aud"] = self.audience
        
        return jwt.encode(data, self.secret_key, algorithm=self.algorithm)
    
    def create_refresh_token(
        self,
        user_id: str,
        username: str,
        expires_delta: Optional[timedelta] = None,
    ) -> str:
        """Create a refresh token."""
        now = datetime.utcnow()
        expires = now + (expires_delta or self.refresh_token_expire)
        
        payload = TokenPayload(
            user_id=user_id,
            username=username,
            issued_at=now,
            expires_at=expires,
            token_type="refresh",
        )
        
        return jwt.encode(payload.to_dict(), self.secret_key, algorithm=self.algorithm)
    
    def decode_token(self, token: str) -> Optional[TokenPayload]:
        """Decode and validate a token."""
        try:
            options = {}
            if self.audience:
                options["audience"] = self.audience
            if self.issuer:
                options["issuer"] = self.issuer
            
            data = jwt.decode(
                token,
                self.secret_key,
                algorithms=[self.algorithm],
                **options
            )
            
            payload = TokenPayload.from_dict(data)
            
            if payload.jti in self._revoked_tokens:
                logger.warning(f"Attempt to use revoked token: {payload.jti[:8]}...")
                return None
            
            return payload
            
        except jwt.ExpiredSignatureError:
            logger.debug("Token has expired")
            return None
        except jwt.InvalidTokenError as e:
            logger.debug(f"Invalid token: {e}")
            return None
    
    def revoke_token(self, token: str) -> bool:
        """Revoke a token."""
        payload = self.decode_token(token)
        if payload:
            self._revoked_tokens.add(payload.jti)
            logger.info(f"Revoked token: {payload.jti[:8]}...")
            return True
        return False
    
    async def authenticate(self, credentials: dict[str, str]) -> AuthResult:
        """Authenticate with username/password (stub - would connect to user store)."""
        username = credentials.get("username", "")
        password = credentials.get("password", "")
        
        # Demo authentication - in production, validate against database
        if username and password:
            logger.info(f"Demo auth for user: {username}")
            return AuthResult(
                success=True,
                user_id=hashlib.sha256(username.encode()).hexdigest()[:16],
                username=username,
                role=Role.USER,
                permissions=ROLE_PERMISSIONS[Role.USER],
                auth_method=AuthMethod.JWT,
            )
        
        return AuthResult(success=False, error="Invalid credentials")
    
    async def validate(self, token: str) -> AuthResult:
        """Validate a JWT token."""
        payload = self.decode_token(token)
        
        if not payload:
            return AuthResult(success=False, error="Invalid or expired token")
        
        if payload.is_expired():
            return AuthResult(success=False, error="Token has expired")
        
        return AuthResult(
            success=True,
            user_id=payload.user_id,
            username=payload.username,
            role=payload.role,
            permissions=payload.permissions or ROLE_PERMISSIONS.get(payload.role, set()),
            auth_method=AuthMethod.JWT,
        )


# =============================================================================
# API Key Handler
# =============================================================================


class APIKeyAuth(AuthHandler):
    """API key authentication handler."""
    
    def __init__(self, prefix: str = "xeepy_"):
        self.prefix = prefix
        self._keys: dict[str, APIKey] = {}
    
    @staticmethod
    def _hash_key(key: str) -> str:
        """Hash an API key."""
        return hashlib.sha256(key.encode()).hexdigest()
    
    def generate_key(
        self,
        user_id: str,
        name: str,
        permissions: Optional[set[Permission]] = None,
        rate_limit: int = 1000,
        expires_in_days: Optional[int] = None,
    ) -> tuple[str, APIKey]:
        """Generate a new API key."""
        # Generate key: prefix + random bytes
        raw_key = f"{self.prefix}{secrets.token_urlsafe(32)}"
        key_hash = self._hash_key(raw_key)
        key_id = secrets.token_hex(8)
        
        expires_at = None
        if expires_in_days:
            expires_at = datetime.utcnow() + timedelta(days=expires_in_days)
        
        api_key = APIKey(
            key_id=key_id,
            key_hash=key_hash,
            user_id=user_id,
            name=name,
            permissions=permissions or {Permission.READ},
            rate_limit=rate_limit,
            expires_at=expires_at,
        )
        
        self._keys[key_id] = api_key
        
        logger.info(f"Generated API key '{name}' for user {user_id}")
        return raw_key, api_key
    
    def validate_key(self, raw_key: str) -> Optional[APIKey]:
        """Validate an API key."""
        if not raw_key.startswith(self.prefix):
            return None
        
        key_hash = self._hash_key(raw_key)
        
        for api_key in self._keys.values():
            if hmac.compare_digest(api_key.key_hash, key_hash):
                if api_key.is_valid():
                    api_key.last_used_at = datetime.utcnow()
                    return api_key
                else:
                    logger.warning(f"Attempt to use invalid API key: {api_key.name}")
                    return None
        
        return None
    
    def revoke_key(self, key_id: str) -> bool:
        """Revoke an API key."""
        if key_id in self._keys:
            self._keys[key_id].is_active = False
            logger.info(f"Revoked API key: {key_id}")
            return True
        return False
    
    async def authenticate(self, credentials: str) -> AuthResult:
        """Authenticate with API key."""
        return await self.validate(credentials)
    
    async def validate(self, token: str) -> AuthResult:
        """Validate an API key."""
        api_key = self.validate_key(token)
        
        if not api_key:
            return AuthResult(success=False, error="Invalid API key")
        
        return AuthResult(
            success=True,
            user_id=api_key.user_id,
            permissions=api_key.permissions,
            auth_method=AuthMethod.API_KEY,
        )


# =============================================================================
# OAuth2 Handler
# =============================================================================


class OAuth2Handler(AuthHandler):
    """OAuth2 authentication handler for X/Twitter."""
    
    def __init__(
        self,
        client_id: str,
        client_secret: str,
        redirect_uri: str,
        scopes: Optional[list[str]] = None,
    ):
        self.client_id = client_id
        self.client_secret = client_secret
        self.redirect_uri = redirect_uri
        self.scopes = scopes or ["tweet.read", "users.read", "follows.read"]
        
        # OAuth2 endpoints (X/Twitter)
        self.authorize_url = "https://twitter.com/i/oauth2/authorize"
        self.token_url = "https://api.twitter.com/2/oauth2/token"
        
        # State management
        self._states: dict[str, datetime] = {}
        self._tokens: dict[str, OAuth2Token] = {}
    
    def generate_auth_url(self, state: Optional[str] = None) -> tuple[str, str]:
        """Generate OAuth2 authorization URL."""
        if not state:
            state = secrets.token_urlsafe(32)
        
        self._states[state] = datetime.utcnow()
        
        params = {
            "response_type": "code",
            "client_id": self.client_id,
            "redirect_uri": self.redirect_uri,
            "scope": " ".join(self.scopes),
            "state": state,
            "code_challenge": secrets.token_urlsafe(43),  # PKCE
            "code_challenge_method": "S256",
        }
        
        query = "&".join(f"{k}={v}" for k, v in params.items())
        auth_url = f"{self.authorize_url}?{query}"
        
        return auth_url, state
    
    def validate_state(self, state: str) -> bool:
        """Validate OAuth2 state parameter."""
        if state not in self._states:
            return False
        
        created = self._states[state]
        # State expires after 10 minutes
        if datetime.utcnow() - created > timedelta(minutes=10):
            del self._states[state]
            return False
        
        del self._states[state]
        return True
    
    async def exchange_code(self, code: str, state: str) -> Optional[OAuth2Token]:
        """Exchange authorization code for tokens."""
        if not self.validate_state(state):
            logger.error("Invalid OAuth2 state")
            return None
        
        # Demo implementation - in production, make actual HTTP request
        logger.info(f"Would exchange code for tokens (demo mode)")
        
        token = OAuth2Token(
            access_token=secrets.token_urlsafe(32),
            refresh_token=secrets.token_urlsafe(32),
            expires_in=7200,
            scope=" ".join(self.scopes),
        )
        
        self._tokens[token.access_token] = token
        return token
    
    async def refresh_tokens(self, refresh_token: str) -> Optional[OAuth2Token]:
        """Refresh access token using refresh token."""
        # Demo implementation
        logger.info("Would refresh tokens (demo mode)")
        
        new_token = OAuth2Token(
            access_token=secrets.token_urlsafe(32),
            refresh_token=refresh_token,
            expires_in=7200,
            scope=" ".join(self.scopes),
        )
        
        self._tokens[new_token.access_token] = new_token
        return new_token
    
    async def authenticate(self, credentials: dict[str, str]) -> AuthResult:
        """Authenticate with OAuth2 code."""
        code = credentials.get("code", "")
        state = credentials.get("state", "")
        
        token = await self.exchange_code(code, state)
        
        if not token:
            return AuthResult(success=False, error="OAuth2 authentication failed")
        
        return AuthResult(
            success=True,
            auth_method=AuthMethod.OAUTH2,
        )
    
    async def validate(self, token: str) -> AuthResult:
        """Validate an OAuth2 access token."""
        oauth_token = self._tokens.get(token)
        
        if not oauth_token:
            return AuthResult(success=False, error="Invalid access token")
        
        if oauth_token.is_expired():
            return AuthResult(success=False, error="Access token expired")
        
        return AuthResult(
            success=True,
            auth_method=AuthMethod.OAUTH2,
        )


# =============================================================================
# Auth Manager
# =============================================================================


class AuthManager:
    """
    Central authentication manager.
    
    Coordinates multiple authentication methods and provides
    a unified interface for auth operations.
    """
    
    def __init__(
        self,
        jwt_secret: Optional[str] = None,
        oauth_client_id: Optional[str] = None,
        oauth_client_secret: Optional[str] = None,
        oauth_redirect_uri: Optional[str] = None,
    ):
        self.handlers: dict[AuthMethod, AuthHandler] = {}
        
        # Initialize JWT handler
        if jwt_secret:
            self.handlers[AuthMethod.JWT] = JWTHandler(secret_key=jwt_secret)
        
        # Initialize API key handler
        self.handlers[AuthMethod.API_KEY] = APIKeyAuth()
        
        # Initialize OAuth2 handler
        if oauth_client_id and oauth_client_secret and oauth_redirect_uri:
            self.handlers[AuthMethod.OAUTH2] = OAuth2Handler(
                client_id=oauth_client_id,
                client_secret=oauth_client_secret,
                redirect_uri=oauth_redirect_uri,
            )
        
        logger.info(f"AuthManager initialized with methods: {list(self.handlers.keys())}")
    
    @property
    def jwt(self) -> Optional[JWTHandler]:
        """Get JWT handler."""
        return self.handlers.get(AuthMethod.JWT)
    
    @property
    def api_key(self) -> Optional[APIKeyAuth]:
        """Get API key handler."""
        return self.handlers.get(AuthMethod.API_KEY)
    
    @property
    def oauth2(self) -> Optional[OAuth2Handler]:
        """Get OAuth2 handler."""
        return self.handlers.get(AuthMethod.OAUTH2)
    
    async def authenticate(
        self,
        method: AuthMethod,
        credentials: Any
    ) -> AuthResult:
        """Authenticate with specified method."""
        handler = self.handlers.get(method)
        
        if not handler:
            return AuthResult(
                success=False,
                error=f"Authentication method '{method}' not configured"
            )
        
        return await handler.authenticate(credentials)
    
    async def validate_token(
        self,
        token: str,
        method: Optional[AuthMethod] = None
    ) -> AuthResult:
        """Validate a token, auto-detecting method if not specified."""
        if method:
            handler = self.handlers.get(method)
            if handler:
                return await handler.validate(token)
        
        # Try to auto-detect
        if token.startswith("xeepy_"):
            handler = self.handlers.get(AuthMethod.API_KEY)
            if handler:
                return await handler.validate(token)
        
        # Try JWT
        handler = self.handlers.get(AuthMethod.JWT)
        if handler:
            result = await handler.validate(token)
            if result.success:
                return result
        
        # Try OAuth2
        handler = self.handlers.get(AuthMethod.OAUTH2)
        if handler:
            return await handler.validate(token)
        
        return AuthResult(success=False, error="Unable to validate token")
    
    def check_permission(
        self,
        auth_result: AuthResult,
        required_permission: Permission
    ) -> bool:
        """Check if authenticated user has required permission."""
        if not auth_result.success:
            return False
        
        if auth_result.permissions:
            return required_permission in auth_result.permissions
        
        if auth_result.role:
            role_perms = ROLE_PERMISSIONS.get(auth_result.role, set())
            return required_permission in role_perms
        
        return False
    
    def require_permissions(
        self,
        auth_result: AuthResult,
        *permissions: Permission
    ) -> tuple[bool, Optional[str]]:
        """Check multiple permissions, return (success, error_message)."""
        if not auth_result.success:
            return False, "Not authenticated"
        
        missing = []
        for perm in permissions:
            if not self.check_permission(auth_result, perm):
                missing.append(perm.value)
        
        if missing:
            return False, f"Missing permissions: {', '.join(missing)}"
        
        return True, None


# =============================================================================
# Password Utilities
# =============================================================================


def hash_password(password: str) -> str:
    """Hash a password securely."""
    if HAS_PASSLIB and pwd_context:
        return pwd_context.hash(password)
    # Fallback to simple hash (not for production!)
    return hashlib.sha256(password.encode()).hexdigest()


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash."""
    if HAS_PASSLIB and pwd_context:
        return pwd_context.verify(plain_password, hashed_password)
    # Fallback
    return hmac.compare_digest(
        hashlib.sha256(plain_password.encode()).hexdigest(),
        hashed_password
    )


def generate_password(length: int = 16) -> str:
    """Generate a secure random password."""
    return secrets.token_urlsafe(length)
