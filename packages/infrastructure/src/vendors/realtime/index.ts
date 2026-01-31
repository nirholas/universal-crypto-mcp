/**
 * realtime Implementation
 *
 * Adapted from: pusher-client, redis-client, websocket-core, websocket-engine
 * See vendor/realtime/ for reference implementations.
 */

export * from './types';

// ============================================================
// Functions
// ============================================================

// From vendor code
export function encode(s: any): string {
  // TODO: Implement - see vendor/realtime/
  throw new Error('Not implemented: encode');
}

// From vendor code
export function createChannel(name: string, pusher: Pusher): Channel {
  // TODO: Implement - see vendor/realtime/
  throw new Error('Not implemented: createChannel');
}

// From vendor code
export export function getConfig(opts: Options, pusher): Config {
  // TODO: Implement - see vendor/realtime/
  throw new Error('Not implemented: getConfig');
}

// From vendor code
export function getHttpHost(opts: Options): string {
  // TODO: Implement - see vendor/realtime/
  throw new Error('Not implemented: getHttpHost');
}

// From vendor code
export function getWebsocketHost(opts: Options): string {
  // TODO: Implement - see vendor/realtime/
  throw new Error('Not implemented: getWebsocketHost');
}

// From vendor code
export function getWebsocketHostFromCluster(cluster: string): string {
  // TODO: Implement - see vendor/realtime/
  throw new Error('Not implemented: getWebsocketHostFromCluster');
}

// From vendor code
export function shouldUseTLS(opts: Options): boolean {
  // TODO: Implement - see vendor/realtime/
  throw new Error('Not implemented: shouldUseTLS');
}

// From vendor code
export function getEnableStatsConfig(opts: Options): boolean {
  // TODO: Implement - see vendor/realtime/
  throw new Error('Not implemented: getEnableStatsConfig');
}

// From vendor code
export function buildUserAuthenticator(opts: Options): UserAuthenticationHandler {
  // TODO: Implement - see vendor/realtime/
  throw new Error('Not implemented: buildUserAuthenticator');
}

// From vendor code
export function buildChannelAuth(opts: Options, pusher): ChannelAuthorizationOptions {
  // TODO: Implement - see vendor/realtime/
  throw new Error('Not implemented: buildChannelAuth');
}

// From vendor code
export function buildChannelAuthorizer(
  opts: Options,
  pusher,
): ChannelAuthorizationHandler {
  // TODO: Implement - see vendor/realtime/
  throw new Error('Not implemented: buildChannelAuthorizer');
}

// From vendor code
export function prefix(name: string): string {
  // TODO: Implement - see vendor/realtime/
  throw new Error('Not implemented: prefix');
}

// From vendor code
export function command(): string {
  // TODO: Implement - see vendor/realtime/
  throw new Error('Not implemented: command');
}

// From vendor code
export function test() {
  // TODO: Implement - see vendor/realtime/
  throw new Error('Not implemented: test');
}

// From vendor code
export function after(cb) {
  // TODO: Implement - see vendor/realtime/
  throw new Error('Not implemented: after');
}

// UCM expected export
export function createSocket(...args: unknown[]): unknown {
  // TODO: Implement based on vendor/realtime/ patterns
  throw new Error('Not implemented: createSocket');
}

// UCM expected export
export function useSocket(...args: unknown[]): unknown {
  // TODO: Implement based on vendor/realtime/ patterns
  throw new Error('Not implemented: useSocket');
}

// UCM expected export
export function emit(...args: unknown[]): unknown {
  // TODO: Implement based on vendor/realtime/ patterns
  throw new Error('Not implemented: emit');
}

// UCM expected export
export function subscribe(...args: unknown[]): unknown {
  // TODO: Implement based on vendor/realtime/ patterns
  throw new Error('Not implemented: subscribe');
}

// ============================================================
// Classes
// ============================================================

// From vendor code
export class PusherIntegration extends Pusher {
  constructor() {
    // TODO: Implement - see vendor/realtime/
    throw new Error('Not implemented: PusherIntegration');
  }
}

// From vendor code
export class Channel extends EventsDispatcher {
  constructor() {
    // TODO: Implement - see vendor/realtime/
    throw new Error('Not implemented: Channel');
  }
}

// From vendor code
export class Channels {
  constructor() {
    // TODO: Implement - see vendor/realtime/
    throw new Error('Not implemented: Channels');
  }
}

// From vendor code
export class EncryptedChannel extends PrivateChannel {
  constructor() {
    // TODO: Implement - see vendor/realtime/
    throw new Error('Not implemented: EncryptedChannel');
  }
}

// From vendor code
export class Members {
  constructor() {
    // TODO: Implement - see vendor/realtime/
    throw new Error('Not implemented: Members');
  }
}

// From vendor code
export class PresenceChannel extends PrivateChannel {
  constructor() {
    // TODO: Implement - see vendor/realtime/
    throw new Error('Not implemented: PresenceChannel');
  }
}

// From vendor code
export class PrivateChannel extends Channel {
  constructor() {
    // TODO: Implement - see vendor/realtime/
    throw new Error('Not implemented: PrivateChannel');
  }
}

// From vendor code
export class Connection extends EventsDispatcher implements Socket {
  constructor() {
    // TODO: Implement - see vendor/realtime/
    throw new Error('Not implemented: Connection');
  }
}

// From vendor code
export class ConnectionManager extends EventsDispatcher {
  constructor() {
    // TODO: Implement - see vendor/realtime/
    throw new Error('Not implemented: ConnectionManager');
  }
}

// From vendor code
export class Handshake {
  constructor() {
    // TODO: Implement - see vendor/realtime/
    throw new Error('Not implemented: Handshake');
  }
}
