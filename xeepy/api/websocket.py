# SPDX-License-Identifier: MIT
# Copyright (c) 2025 Xeepy Contributors
"""
WebSocket Manager
=================

Real-time communication via WebSockets for live updates and streaming.
"""

import asyncio
import json
import time
from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
from typing import Any, Callable, Optional
from loguru import logger

try:
    from starlette.websockets import WebSocket, WebSocketDisconnect, WebSocketState
    HAS_WEBSOCKET = True
except ImportError:
    HAS_WEBSOCKET = False
    WebSocket = Any
    WebSocketDisconnect = Exception


# =============================================================================
# Enums & Types
# =============================================================================


class MessageType(str, Enum):
    """WebSocket message types."""
    PING = "ping"
    PONG = "pong"
    SUBSCRIBE = "subscribe"
    UNSUBSCRIBE = "unsubscribe"
    MESSAGE = "message"
    ERROR = "error"
    ACK = "ack"
    AUTH = "auth"
    AUTH_SUCCESS = "auth_success"
    AUTH_FAILED = "auth_failed"


class Channel(str, Enum):
    """Available channels for subscription."""
    TWEETS = "tweets"
    MENTIONS = "mentions"
    FOLLOWERS = "followers"
    ENGAGEMENT = "engagement"
    ANALYTICS = "analytics"
    TASKS = "tasks"
    AI = "ai"
    ALERTS = "alerts"


# =============================================================================
# Data Classes
# =============================================================================


@dataclass
class WebSocketClient:
    """Connected WebSocket client."""
    id: str
    websocket: WebSocket
    user_id: Optional[str] = None
    subscriptions: set[str] = field(default_factory=set)
    connected_at: datetime = field(default_factory=datetime.utcnow)
    last_ping: datetime = field(default_factory=datetime.utcnow)
    is_authenticated: bool = False
    metadata: dict[str, Any] = field(default_factory=dict)
    
    @property
    def is_connected(self) -> bool:
        """Check if client is still connected."""
        if not HAS_WEBSOCKET:
            return False
        return self.websocket.client_state == WebSocketState.CONNECTED
    
    async def send_json(self, data: dict) -> bool:
        """Send JSON message to client."""
        try:
            if self.is_connected:
                await self.websocket.send_json(data)
                return True
        except Exception as e:
            logger.debug(f"Failed to send to client {self.id}: {e}")
        return False


@dataclass
class WSMessage:
    """WebSocket message."""
    type: MessageType
    channel: Optional[str] = None
    data: dict = field(default_factory=dict)
    timestamp: datetime = field(default_factory=datetime.utcnow)
    message_id: Optional[str] = None
    
    def to_dict(self) -> dict:
        """Convert to dictionary."""
        return {
            "type": self.type.value,
            "channel": self.channel,
            "data": self.data,
            "timestamp": self.timestamp.isoformat(),
            "message_id": self.message_id,
        }
    
    @classmethod
    def from_dict(cls, data: dict) -> "WSMessage":
        """Create from dictionary."""
        return cls(
            type=MessageType(data.get("type", "message")),
            channel=data.get("channel"),
            data=data.get("data", {}),
            message_id=data.get("message_id"),
        )


# =============================================================================
# Connection Manager
# =============================================================================


class ConnectionManager:
    """
    Manages WebSocket connections and message routing.
    
    Features:
    - Connection lifecycle management
    - Channel-based pub/sub
    - Heartbeat monitoring
    - Broadcast and targeted messaging
    - Authentication integration
    """
    
    def __init__(
        self,
        heartbeat_interval: int = 30,
        max_connections: int = 1000,
        auth_timeout: int = 10,
    ):
        self.heartbeat_interval = heartbeat_interval
        self.max_connections = max_connections
        self.auth_timeout = auth_timeout
        
        self._clients: dict[str, WebSocketClient] = {}
        self._channels: dict[str, set[str]] = {}  # channel -> client_ids
        self._user_connections: dict[str, set[str]] = {}  # user_id -> client_ids
        self._lock = asyncio.Lock()
        self._running = False
        self._heartbeat_task: Optional[asyncio.Task] = None
        
        # Event handlers
        self._on_connect: Optional[Callable] = None
        self._on_disconnect: Optional[Callable] = None
        self._on_message: Optional[Callable] = None
    
    @property
    def connection_count(self) -> int:
        """Number of active connections."""
        return len(self._clients)
    
    def on_connect(self, handler: Callable):
        """Register connect handler."""
        self._on_connect = handler
        return handler
    
    def on_disconnect(self, handler: Callable):
        """Register disconnect handler."""
        self._on_disconnect = handler
        return handler
    
    def on_message(self, handler: Callable):
        """Register message handler."""
        self._on_message = handler
        return handler
    
    async def start(self):
        """Start the connection manager."""
        if self._running:
            return
        
        self._running = True
        self._heartbeat_task = asyncio.create_task(self._heartbeat_loop())
        logger.info("WebSocket connection manager started")
    
    async def stop(self):
        """Stop the connection manager."""
        self._running = False
        
        if self._heartbeat_task:
            self._heartbeat_task.cancel()
            try:
                await self._heartbeat_task
            except asyncio.CancelledError:
                pass
        
        # Close all connections
        for client_id in list(self._clients.keys()):
            await self.disconnect(client_id)
        
        logger.info("WebSocket connection manager stopped")
    
    async def connect(
        self,
        websocket: WebSocket,
        client_id: str,
        user_id: Optional[str] = None,
    ) -> WebSocketClient:
        """Accept a new WebSocket connection."""
        async with self._lock:
            if len(self._clients) >= self.max_connections:
                await websocket.close(code=1013, reason="Server at capacity")
                raise ConnectionError("Maximum connections reached")
            
            await websocket.accept()
            
            client = WebSocketClient(
                id=client_id,
                websocket=websocket,
                user_id=user_id,
            )
            
            self._clients[client_id] = client
            
            if user_id:
                if user_id not in self._user_connections:
                    self._user_connections[user_id] = set()
                self._user_connections[user_id].add(client_id)
            
            logger.info(f"WebSocket connected: {client_id}")
            
            if self._on_connect:
                await self._on_connect(client)
            
            return client
    
    async def disconnect(self, client_id: str):
        """Disconnect a client."""
        async with self._lock:
            client = self._clients.get(client_id)
            if not client:
                return
            
            # Remove from channels
            for channel in list(client.subscriptions):
                if channel in self._channels:
                    self._channels[channel].discard(client_id)
            
            # Remove from user connections
            if client.user_id and client.user_id in self._user_connections:
                self._user_connections[client.user_id].discard(client_id)
            
            # Close WebSocket
            try:
                await client.websocket.close()
            except Exception:
                pass
            
            del self._clients[client_id]
            
            logger.info(f"WebSocket disconnected: {client_id}")
            
            if self._on_disconnect:
                await self._on_disconnect(client)
    
    async def subscribe(self, client_id: str, channel: str) -> bool:
        """Subscribe a client to a channel."""
        client = self._clients.get(client_id)
        if not client:
            return False
        
        async with self._lock:
            if channel not in self._channels:
                self._channels[channel] = set()
            
            self._channels[channel].add(client_id)
            client.subscriptions.add(channel)
        
        logger.debug(f"Client {client_id} subscribed to {channel}")
        
        # Send acknowledgment
        await client.send_json(WSMessage(
            type=MessageType.ACK,
            channel=channel,
            data={"action": "subscribed"},
        ).to_dict())
        
        return True
    
    async def unsubscribe(self, client_id: str, channel: str) -> bool:
        """Unsubscribe a client from a channel."""
        client = self._clients.get(client_id)
        if not client:
            return False
        
        async with self._lock:
            if channel in self._channels:
                self._channels[channel].discard(client_id)
            client.subscriptions.discard(channel)
        
        logger.debug(f"Client {client_id} unsubscribed from {channel}")
        return True
    
    async def send_to_client(
        self,
        client_id: str,
        message: WSMessage,
    ) -> bool:
        """Send message to a specific client."""
        client = self._clients.get(client_id)
        if not client:
            return False
        
        return await client.send_json(message.to_dict())
    
    async def send_to_user(
        self,
        user_id: str,
        message: WSMessage,
    ) -> int:
        """Send message to all connections of a user."""
        client_ids = self._user_connections.get(user_id, set())
        sent = 0
        
        for client_id in client_ids:
            if await self.send_to_client(client_id, message):
                sent += 1
        
        return sent
    
    async def broadcast_to_channel(
        self,
        channel: str,
        message: WSMessage,
        exclude: Optional[set[str]] = None,
    ) -> int:
        """Broadcast message to all subscribers of a channel."""
        client_ids = self._channels.get(channel, set())
        exclude = exclude or set()
        sent = 0
        
        message.channel = channel
        
        for client_id in client_ids:
            if client_id not in exclude:
                if await self.send_to_client(client_id, message):
                    sent += 1
        
        return sent
    
    async def broadcast(
        self,
        message: WSMessage,
        exclude: Optional[set[str]] = None,
    ) -> int:
        """Broadcast message to all connected clients."""
        exclude = exclude or set()
        sent = 0
        
        for client_id in list(self._clients.keys()):
            if client_id not in exclude:
                if await self.send_to_client(client_id, message):
                    sent += 1
        
        return sent
    
    async def handle_message(
        self,
        client_id: str,
        raw_message: str,
    ):
        """Handle incoming message from client."""
        client = self._clients.get(client_id)
        if not client:
            return
        
        try:
            data = json.loads(raw_message)
            message = WSMessage.from_dict(data)
        except (json.JSONDecodeError, ValueError) as e:
            await client.send_json(WSMessage(
                type=MessageType.ERROR,
                data={"error": f"Invalid message format: {e}"},
            ).to_dict())
            return
        
        # Handle built-in message types
        if message.type == MessageType.PING:
            client.last_ping = datetime.utcnow()
            await client.send_json(WSMessage(
                type=MessageType.PONG,
                data={"timestamp": time.time()},
            ).to_dict())
        
        elif message.type == MessageType.SUBSCRIBE:
            channel = message.data.get("channel") or message.channel
            if channel:
                await self.subscribe(client_id, channel)
        
        elif message.type == MessageType.UNSUBSCRIBE:
            channel = message.data.get("channel") or message.channel
            if channel:
                await self.unsubscribe(client_id, channel)
        
        # Call custom message handler
        if self._on_message:
            await self._on_message(client, message)
    
    async def _heartbeat_loop(self):
        """Send heartbeats and cleanup dead connections."""
        while self._running:
            try:
                await asyncio.sleep(self.heartbeat_interval)
                
                now = datetime.utcnow()
                dead_clients = []
                
                for client_id, client in list(self._clients.items()):
                    # Check if client is still connected
                    if not client.is_connected:
                        dead_clients.append(client_id)
                        continue
                    
                    # Check for ping timeout
                    if (now - client.last_ping).seconds > self.heartbeat_interval * 3:
                        dead_clients.append(client_id)
                        continue
                    
                    # Send ping
                    await client.send_json(WSMessage(
                        type=MessageType.PING,
                        data={"timestamp": time.time()},
                    ).to_dict())
                
                # Cleanup dead connections
                for client_id in dead_clients:
                    await self.disconnect(client_id)
                    
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(f"Heartbeat error: {e}")
    
    def get_stats(self) -> dict[str, Any]:
        """Get connection statistics."""
        return {
            "total_connections": len(self._clients),
            "total_channels": len(self._channels),
            "connections_by_channel": {
                ch: len(clients) for ch, clients in self._channels.items()
            },
            "authenticated_connections": sum(
                1 for c in self._clients.values() if c.is_authenticated
            ),
            "unique_users": len(self._user_connections),
        }


# =============================================================================
# WebSocket Manager (Higher-level API)
# =============================================================================


class WebSocketManager:
    """
    High-level WebSocket manager with additional features.
    
    Features:
    - Room-based messaging
    - Message history
    - Presence tracking
    - Typing indicators
    - Read receipts
    """
    
    def __init__(self, connection_manager: Optional[ConnectionManager] = None):
        self.connections = connection_manager or ConnectionManager()
        self._rooms: dict[str, set[str]] = {}  # room_id -> client_ids
        self._presence: dict[str, dict[str, Any]] = {}  # user_id -> presence data
        self._message_history: dict[str, list[WSMessage]] = {}
        self._max_history = 100
    
    async def start(self):
        """Start the WebSocket manager."""
        await self.connections.start()
    
    async def stop(self):
        """Stop the WebSocket manager."""
        await self.connections.stop()
    
    # Room Management
    
    async def join_room(self, client_id: str, room_id: str):
        """Join a client to a room."""
        if room_id not in self._rooms:
            self._rooms[room_id] = set()
        
        self._rooms[room_id].add(client_id)
        
        # Notify room members
        await self.send_to_room(room_id, WSMessage(
            type=MessageType.MESSAGE,
            data={"event": "user_joined", "client_id": client_id},
        ), exclude={client_id})
    
    async def leave_room(self, client_id: str, room_id: str):
        """Remove a client from a room."""
        if room_id in self._rooms:
            self._rooms[room_id].discard(client_id)
            
            # Notify room members
            await self.send_to_room(room_id, WSMessage(
                type=MessageType.MESSAGE,
                data={"event": "user_left", "client_id": client_id},
            ))
    
    async def send_to_room(
        self,
        room_id: str,
        message: WSMessage,
        exclude: Optional[set[str]] = None,
    ) -> int:
        """Send message to all clients in a room."""
        client_ids = self._rooms.get(room_id, set())
        exclude = exclude or set()
        sent = 0
        
        for client_id in client_ids:
            if client_id not in exclude:
                if await self.connections.send_to_client(client_id, message):
                    sent += 1
        
        # Store in history
        if room_id not in self._message_history:
            self._message_history[room_id] = []
        
        self._message_history[room_id].append(message)
        
        # Trim history
        if len(self._message_history[room_id]) > self._max_history:
            self._message_history[room_id] = self._message_history[room_id][-self._max_history:]
        
        return sent
    
    def get_room_history(self, room_id: str, limit: int = 50) -> list[dict]:
        """Get message history for a room."""
        messages = self._message_history.get(room_id, [])
        return [m.to_dict() for m in messages[-limit:]]
    
    # Presence
    
    async def update_presence(
        self,
        user_id: str,
        status: str,
        metadata: Optional[dict] = None,
    ):
        """Update user presence."""
        self._presence[user_id] = {
            "status": status,
            "last_seen": datetime.utcnow().isoformat(),
            "metadata": metadata or {},
        }
        
        # Broadcast presence update to interested clients
        await self.connections.broadcast(WSMessage(
            type=MessageType.MESSAGE,
            channel=Channel.ENGAGEMENT.value,
            data={
                "event": "presence_update",
                "user_id": user_id,
                "presence": self._presence[user_id],
            },
        ))
    
    def get_presence(self, user_id: str) -> Optional[dict]:
        """Get user presence."""
        return self._presence.get(user_id)
    
    def get_online_users(self) -> list[str]:
        """Get list of online users."""
        return [
            uid for uid, presence in self._presence.items()
            if presence.get("status") == "online"
        ]
    
    # Typing Indicators
    
    async def send_typing_indicator(
        self,
        room_id: str,
        user_id: str,
        is_typing: bool,
    ):
        """Send typing indicator to room."""
        await self.send_to_room(room_id, WSMessage(
            type=MessageType.MESSAGE,
            data={
                "event": "typing",
                "user_id": user_id,
                "is_typing": is_typing,
            },
        ))
    
    # Stream Events
    
    async def stream_tweet(self, tweet_data: dict):
        """Stream a new tweet to subscribers."""
        await self.connections.broadcast_to_channel(
            Channel.TWEETS.value,
            WSMessage(
                type=MessageType.MESSAGE,
                data={"event": "new_tweet", "tweet": tweet_data},
            ),
        )
    
    async def stream_mention(self, mention_data: dict):
        """Stream a new mention to the user."""
        user_id = mention_data.get("user_id")
        if user_id:
            await self.connections.send_to_user(user_id, WSMessage(
                type=MessageType.MESSAGE,
                channel=Channel.MENTIONS.value,
                data={"event": "new_mention", "mention": mention_data},
            ))
    
    async def stream_follower_update(
        self,
        user_id: str,
        event_type: str,  # "new_follower" or "unfollower"
        follower_data: dict,
    ):
        """Stream follower updates to a user."""
        await self.connections.send_to_user(user_id, WSMessage(
            type=MessageType.MESSAGE,
            channel=Channel.FOLLOWERS.value,
            data={"event": event_type, "follower": follower_data},
        ))
    
    async def stream_task_update(
        self,
        user_id: str,
        task_id: str,
        status: str,
        progress: float,
        result: Optional[dict] = None,
    ):
        """Stream task progress updates."""
        await self.connections.send_to_user(user_id, WSMessage(
            type=MessageType.MESSAGE,
            channel=Channel.TASKS.value,
            data={
                "event": "task_update",
                "task_id": task_id,
                "status": status,
                "progress": progress,
                "result": result,
            },
        ))
    
    async def stream_alert(
        self,
        user_id: str,
        alert_type: str,
        title: str,
        message: str,
        data: Optional[dict] = None,
    ):
        """Stream alerts to a user."""
        await self.connections.send_to_user(user_id, WSMessage(
            type=MessageType.MESSAGE,
            channel=Channel.ALERTS.value,
            data={
                "event": "alert",
                "alert_type": alert_type,
                "title": title,
                "message": message,
                "data": data or {},
            },
        ))


# =============================================================================
# WebSocket Route Handler
# =============================================================================


async def websocket_endpoint(
    websocket: WebSocket,
    manager: ConnectionManager,
    client_id: Optional[str] = None,
):
    """
    Standard WebSocket endpoint handler.
    
    Usage with FastAPI:
    
        @app.websocket("/ws/{client_id}")
        async def websocket_route(websocket: WebSocket, client_id: str):
            await websocket_endpoint(websocket, ws_manager.connections, client_id)
    """
    if not HAS_WEBSOCKET:
        raise ImportError("Starlette is required for WebSocket support")
    
    import uuid
    client_id = client_id or str(uuid.uuid4())
    
    try:
        client = await manager.connect(websocket, client_id)
        
        while True:
            try:
                data = await websocket.receive_text()
                await manager.handle_message(client_id, data)
            except WebSocketDisconnect:
                break
    finally:
        await manager.disconnect(client_id)
