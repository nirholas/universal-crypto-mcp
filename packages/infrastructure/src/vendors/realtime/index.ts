/**
 * realtime Implementation
 *
 * WebSocket and real-time communication utilities
 * Native WebSocket implementation without third-party dependencies
 */

export * from './types';

// ============================================================
// Types
// ============================================================

interface SocketOptions {
  url: string;
  protocols?: string | string[];
  reconnect?: boolean;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  heartbeatInterval?: number;
}

interface ChannelOptions {
  auth?: {
    endpoint?: string;
    headers?: Record<string, string>;
  };
}

type EventHandler = (data: unknown) => void;

interface ChannelAuthorizationOptions {
  endpoint?: string;
  transport?: 'ajax' | 'jsonp';
  headers?: Record<string, string>;
}

type ChannelAuthorizationHandler = (
  channel: string,
  callback: (error: Error | null, data?: { auth: string }) => void
) => void;

type UserAuthenticationHandler = (callback: (error: Error | null, data?: unknown) => void) => void;

interface Config {
  wsHost: string;
  httpHost: string;
  useTLS: boolean;
  enableStats: boolean;
  cluster: string;
}

interface Options {
  wsHost?: string;
  httpHost?: string;
  cluster?: string;
  forceTLS?: boolean;
  enableStats?: boolean;
  authEndpoint?: string;
  authTransport?: 'ajax' | 'jsonp';
  auth?: {
    headers?: Record<string, string>;
  };
  userAuthentication?: {
    endpoint?: string;
    transport?: 'ajax' | 'jsonp';
    headers?: Record<string, string>;
  };
}

// ============================================================
// Utility Functions
// ============================================================

export function encode(s: string | object): string {
  if (typeof s === 'object') {
    return JSON.stringify(s);
  }
  return encodeURIComponent(s);
}

export function prefix(name: string): string {
  return `private-${name}`;
}

export function command(): string {
  return 'subscribe';
}

export function test(): void {
  console.log('Realtime module loaded');
}

export function after(cb: () => void): void {
  setImmediate(cb);
}

export function shouldUseTLS(opts: Options): boolean {
  return opts.forceTLS !== false;
}

export function getEnableStatsConfig(opts: Options): boolean {
  return opts.enableStats ?? false;
}

export function getWebsocketHostFromCluster(cluster: string): string {
  return `ws-${cluster}.pusher.com`;
}

export function getWebsocketHost(opts: Options): string {
  if (opts.wsHost) return opts.wsHost;
  if (opts.cluster) return getWebsocketHostFromCluster(opts.cluster);
  return 'ws.pusher.com';
}

export function getHttpHost(opts: Options): string {
  if (opts.httpHost) return opts.httpHost;
  if (opts.cluster) return `sockjs-${opts.cluster}.pusher.com`;
  return 'sockjs.pusher.com';
}

export function getConfig(opts: Options): Config {
  return {
    wsHost: getWebsocketHost(opts),
    httpHost: getHttpHost(opts),
    useTLS: shouldUseTLS(opts),
    enableStats: getEnableStatsConfig(opts),
    cluster: opts.cluster || 'mt1',
  };
}

export function buildUserAuthenticator(opts: Options): UserAuthenticationHandler {
  return (callback: (error: Error | null, data?: unknown) => void) => {
    const endpoint = opts.userAuthentication?.endpoint;
    if (!endpoint) {
      callback(new Error('No user authentication endpoint configured'));
      return;
    }

    fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...opts.userAuthentication?.headers,
      },
    })
      .then(res => res.json())
      .then(data => callback(null, data))
      .catch(err => callback(err));
  };
}

export function buildChannelAuth(opts: Options): ChannelAuthorizationOptions {
  return {
    endpoint: opts.authEndpoint || '/pusher/auth',
    transport: opts.authTransport || 'ajax',
    headers: opts.auth?.headers,
  };
}

export function buildChannelAuthorizer(opts: Options): ChannelAuthorizationHandler {
  const authOptions = buildChannelAuth(opts);

  return (channel: string, callback: (error: Error | null, data?: { auth: string }) => void) => {
    if (!authOptions.endpoint) {
      callback(new Error('No authorization endpoint configured'));
      return;
    }

    fetch(authOptions.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        ...authOptions.headers,
      },
      body: `channel_name=${encodeURIComponent(channel)}`,
    })
      .then(res => res.json())
      .then(data => callback(null, data as { auth: string }))
      .catch(err => callback(err));
  };
}

// ============================================================
// Event Dispatcher
// ============================================================

export class EventsDispatcher {
  protected listeners = new Map<string, Set<EventHandler>>();

  on(event: string, handler: EventHandler): this {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(handler);
    return this;
  }

  off(event: string, handler?: EventHandler): this {
    if (handler) {
      this.listeners.get(event)?.delete(handler);
    } else {
      this.listeners.delete(event);
    }
    return this;
  }

  emit(event: string, data?: unknown): this {
    this.listeners.get(event)?.forEach(handler => handler(data));
    return this;
  }
}

// ============================================================
// Channel Classes
// ============================================================

export class Channel extends EventsDispatcher {
  name: string;
  subscribed = false;
  protected socket: Socket | null = null;

  constructor(name: string, socket?: Socket) {
    super();
    this.name = name;
    this.socket = socket || null;
  }

  trigger(event: string, data: unknown): this {
    this.socket?.send(JSON.stringify({ event, channel: this.name, data }));
    return this;
  }

  bind(event: string, handler: EventHandler): this {
    return this.on(event, handler);
  }

  unbind(event: string, handler?: EventHandler): this {
    return this.off(event, handler);
  }
}

export class PrivateChannel extends Channel {
  private auth: string | null = null;

  authorize(authorizer: ChannelAuthorizationHandler): Promise<void> {
    return new Promise((resolve, reject) => {
      authorizer(this.name, (error, data) => {
        if (error) {
          reject(error);
        } else {
          this.auth = data?.auth || null;
          resolve();
        }
      });
    });
  }
}

export class EncryptedChannel extends PrivateChannel {
  private key: CryptoKey | null = null;

  async setEncryptionKey(keyData: ArrayBuffer): Promise<void> {
    this.key = await crypto.subtle.importKey('raw', keyData, { name: 'AES-GCM' }, false, [
      'encrypt',
      'decrypt',
    ]);
  }

  async encryptMessage(data: unknown): Promise<string> {
    if (!this.key) throw new Error('Encryption key not set');
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoded = new TextEncoder().encode(JSON.stringify(data));
    const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, this.key, encoded);
    return Buffer.from(new Uint8Array([...iv, ...new Uint8Array(encrypted)])).toString('base64');
  }

  async decryptMessage(encrypted: string): Promise<unknown> {
    if (!this.key) throw new Error('Encryption key not set');
    const data = Buffer.from(encrypted, 'base64');
    const iv = data.slice(0, 12);
    const ciphertext = data.slice(12);
    const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, this.key, ciphertext);
    return JSON.parse(new TextDecoder().decode(decrypted));
  }
}

export class Members {
  private members = new Map<string, unknown>();

  add(id: string, info: unknown): void {
    this.members.set(id, info);
  }

  remove(id: string): void {
    this.members.delete(id);
  }

  get(id: string): unknown | undefined {
    return this.members.get(id);
  }

  each(callback: (member: { id: string; info: unknown }) => void): void {
    this.members.forEach((info, id) => callback({ id, info }));
  }

  get count(): number {
    return this.members.size;
  }
}

export class PresenceChannel extends PrivateChannel {
  members = new Members();

  handleMemberAdded(data: { user_id: string; user_info: unknown }): void {
    this.members.add(data.user_id, data.user_info);
    this.emit('pusher:member_added', { id: data.user_id, info: data.user_info });
  }

  handleMemberRemoved(data: { user_id: string }): void {
    this.members.remove(data.user_id);
    this.emit('pusher:member_removed', { id: data.user_id });
  }
}

export class Channels {
  private channels = new Map<string, Channel>();

  add(name: string, socket?: Socket): Channel {
    let channel: Channel;

    if (name.startsWith('presence-')) {
      channel = new PresenceChannel(name, socket);
    } else if (name.startsWith('private-encrypted-')) {
      channel = new EncryptedChannel(name, socket);
    } else if (name.startsWith('private-')) {
      channel = new PrivateChannel(name, socket);
    } else {
      channel = new Channel(name, socket);
    }

    this.channels.set(name, channel);
    return channel;
  }

  remove(name: string): void {
    this.channels.delete(name);
  }

  find(name: string): Channel | undefined {
    return this.channels.get(name);
  }

  all(): Channel[] {
    return Array.from(this.channels.values());
  }
}

export function createChannel(name: string, socket?: Socket): Channel {
  const channels = new Channels();
  return channels.add(name, socket);
}

// ============================================================
// Socket/Connection Classes
// ============================================================

export interface Socket {
  send(data: string): void;
  close(): void;
  readyState: number;
}

export class Connection extends EventsDispatcher implements Socket {
  private ws: WebSocket | null = null;
  private options: SocketOptions;
  private reconnectAttempts = 0;
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null;

  readyState = 0;

  constructor(options: SocketOptions) {
    super();
    this.options = options;
  }

  connect(): void {
    this.ws = new WebSocket(this.options.url, this.options.protocols);

    this.ws.onopen = () => {
      this.readyState = 1;
      this.reconnectAttempts = 0;
      this.emit('connected');
      this.startHeartbeat();
    };

    this.ws.onmessage = event => {
      try {
        const data = JSON.parse(event.data);
        this.emit('message', data);
        if (data.event) {
          this.emit(data.event, data.data);
        }
      } catch {
        this.emit('message', event.data);
      }
    };

    this.ws.onclose = () => {
      this.readyState = 3;
      this.stopHeartbeat();
      this.emit('disconnected');
      this.maybeReconnect();
    };

    this.ws.onerror = error => {
      this.emit('error', error);
    };
  }

  send(data: string): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(data);
    }
  }

  close(): void {
    this.options.reconnect = false;
    this.ws?.close();
  }

  private startHeartbeat(): void {
    if (this.options.heartbeatInterval) {
      this.heartbeatTimer = setInterval(() => {
        this.send(JSON.stringify({ event: 'pusher:ping', data: {} }));
      }, this.options.heartbeatInterval);
    }
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  private maybeReconnect(): void {
    const maxAttempts = this.options.maxReconnectAttempts ?? 5;
    if (this.options.reconnect && this.reconnectAttempts < maxAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        this.emit('reconnecting', this.reconnectAttempts);
        this.connect();
      }, this.options.reconnectInterval ?? 1000);
    }
  }
}

export class Handshake {
  private connection: Connection;
  private timeout: number;

  constructor(connection: Connection, timeout = 5000) {
    this.connection = connection;
    this.timeout = timeout;
  }

  async perform(): Promise<{ socket_id: string }> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error('Handshake timeout'));
      }, this.timeout);

      this.connection.on('pusher:connection_established', (data: unknown) => {
        clearTimeout(timer);
        resolve(data as { socket_id: string });
      });

      this.connection.on('error', error => {
        clearTimeout(timer);
        reject(error);
      });
    });
  }
}

export class ConnectionManager extends EventsDispatcher {
  private connection: Connection | null = null;
  private state: 'initialized' | 'connecting' | 'connected' | 'disconnected' = 'initialized';

  connect(options: SocketOptions): void {
    this.state = 'connecting';
    this.connection = new Connection(options);

    this.connection.on('connected', () => {
      this.state = 'connected';
      this.emit('state_change', { current: 'connected' });
    });

    this.connection.on('disconnected', () => {
      this.state = 'disconnected';
      this.emit('state_change', { current: 'disconnected' });
    });

    this.connection.connect();
  }

  disconnect(): void {
    this.connection?.close();
  }

  getState(): string {
    return this.state;
  }
}

// ============================================================
// Main Pusher-like Client
// ============================================================

export class PusherIntegration extends EventsDispatcher {
  private options: SocketOptions & Options;
  private connection: ConnectionManager;
  private channels: Channels;
  socketId: string | null = null;

  constructor(key: string, options: Partial<SocketOptions & Options> = {}) {
    super();
    const config = getConfig(options);
    const protocol = config.useTLS ? 'wss' : 'ws';
    const port = config.useTLS ? 443 : 80;

    this.options = {
      url: `${protocol}://${config.wsHost}:${port}/app/${key}?protocol=7`,
      reconnect: true,
      reconnectInterval: 1000,
      maxReconnectAttempts: 5,
      heartbeatInterval: 30000,
      ...options,
    };

    this.connection = new ConnectionManager();
    this.channels = new Channels();
  }

  connect(): void {
    this.connection.connect(this.options);

    this.connection.on('state_change', (state: { current: string }) => {
      this.emit('state_change', state);
    });
  }

  disconnect(): void {
    this.connection.disconnect();
  }

  subscribe(channelName: string): Channel {
    const channel = this.channels.add(channelName);
    return channel;
  }

  unsubscribe(channelName: string): void {
    this.channels.remove(channelName);
  }

  channel(name: string): Channel | undefined {
    return this.channels.find(name);
  }
}

// ============================================================
// Convenience Functions
// ============================================================

let defaultSocket: Connection | null = null;

export function createSocket(options: SocketOptions): Connection {
  const socket = new Connection(options);
  socket.connect();
  return socket;
}

export function useSocket(options?: SocketOptions): Connection {
  if (!defaultSocket && options) {
    defaultSocket = createSocket(options);
  }
  if (!defaultSocket) {
    throw new Error('Socket not initialized. Call createSocket first.');
  }
  return defaultSocket;
}

export function emit(event: string, data?: unknown): void {
  defaultSocket?.send(JSON.stringify({ event, data }));
}

export function subscribe(channel: string, event: string, handler: EventHandler): () => void {
  const ch = createChannel(channel, defaultSocket || undefined);
  ch.on(event, handler);
  return () => ch.off(event, handler);
}
