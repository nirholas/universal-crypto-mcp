import { useEffect, useRef, useState, useCallback } from 'react';
import type { WebSocketMessage } from '../types/analytics';

interface UseWebSocketOptions {
  onMessage?: (message: WebSocketMessage) => void;
  channels?: string[];
  reconnectInterval?: number;
  maxRetries?: number;
}

interface UseWebSocketReturn {
  isConnected: boolean;
  lastMessage: WebSocketMessage | null;
  send: (message: unknown) => void;
  reconnect: () => void;
}

export function useWebSocket(
  url: string,
  options: UseWebSocketOptions = {}
): UseWebSocketReturn {
  const {
    onMessage,
    channels = ['stats'],
    reconnectInterval = 3000,
    maxRetries = 10,
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const retriesRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      const ws = new WebSocket(url);

      ws.onopen = () => {
        setIsConnected(true);
        retriesRef.current = 0;

        // Subscribe to channels
        ws.send(
          JSON.stringify({
            type: 'subscribe',
            channels,
          })
        );
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as WebSocketMessage;
          setLastMessage(data);
          onMessage?.(data);
        } catch (e) {
          console.error('Failed to parse WebSocket message:', e);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);

        // Attempt reconnection
        if (retriesRef.current < maxRetries) {
          retriesRef.current++;
          reconnectTimeoutRef.current = setTimeout(connect, reconnectInterval);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      wsRef.current = ws;
    } catch (e) {
      console.error('Failed to create WebSocket:', e);
    }
  }, [url, channels, onMessage, reconnectInterval, maxRetries]);

  const send = useCallback((message: unknown) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    }
  }, []);

  const reconnect = useCallback(() => {
    wsRef.current?.close();
    retriesRef.current = 0;
    connect();
  }, [connect]);

  useEffect(() => {
    connect();

    return () => {
      clearTimeout(reconnectTimeoutRef.current);
      wsRef.current?.close();
    };
  }, [connect]);

  return { isConnected, lastMessage, send, reconnect };
}
