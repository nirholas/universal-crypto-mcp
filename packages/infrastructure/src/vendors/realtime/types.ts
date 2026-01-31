/**
 * realtime Types
 *
 * Auto-extracted from vendor/realtime/
 */

// ============================================================
// Interfaces from vendor code
// ============================================================

interface AuthTransport {
  (
    context: AbstractRuntime,
    query: string,
    authOptions: InternalAuthOptions,
    authRequestType: AuthRequestType,
    callback: Function,
  ): void;
}

interface AuthTransports {
  [index: string]: AuthTransport;
}

export interface DeprecatedChannelAuthorizer {
  authorize(socketId: string, callback: ChannelAuthorizationCallback): void;
}

export interface ChannelAuthorizerGenerator {
  (
    channel: Channel,
    options: DeprecatedAuthorizerOptions,
  ): DeprecatedChannelAuthorizer;
}

export interface DeprecatedAuthOptions {
  params?: any;
  headers?: any;
}

export interface DeprecatedAuthorizerOptions {
  authTransport: 'ajax' | 'jsonp';
  authEndpoint: string;
  auth?: DeprecatedAuthOptions;
}

export interface ChannelAuthorizationData {
  auth: string;
  channel_data?: string;
  shared_secret?: string;
}

export interface ChannelAuthorizationRequestParams {
  socketId: string;
  channelName: string;
}

export interface ChannelAuthorizationHandler {
  (
    params: ChannelAuthorizationRequestParams,
    callback: ChannelAuthorizationCallback,
  ): void;
}

export interface UserAuthenticationData {
  auth: string;
  user_data: string;
}

export interface UserAuthenticationRequestParams {
  socketId: string;
}

export interface UserAuthenticationHandler {
  (
    params: UserAuthenticationRequestParams,
    callback: UserAuthenticationCallback,
  ): void;
}

export interface AuthOptionsT<AuthHandler> {
  transport: 'ajax' | 'jsonp';
  endpoint: string;
  params?: any;
  headers?: any;
  paramsProvider?: () => any;
  headersProvider?: () => any;
  customHandler?: AuthHandler;
}

export interface InternalAuthOptions {
  transport: 'ajax' | 'jsonp';
  endpoint: string;
  params?: any;
  headers?: any;
  paramsProvider?: () => any;
  headersProvider?: () => any;
}

interface ChannelTable {
  [index: string]: Channel;
}

interface Metadata {
  user_id?: string;
}

export interface Config {
  // these are all 'required' config parameters, it's not necessary for the user
  // to set them, but they have configured defaults.
  activityTimeout: number;
  enableStats: boolean;
  httpHost: string;
  httpPath: string;
  httpPort: number;
  httpsPort: number;
  pongTimeout: number;
  statsHost: string;
  unavailableTimeout: number;
  useTLS: boolean;
  wsHost: string;
  wsPath: string;
  wsPort: number;
  wssPort: number;
  userAuthenticator: UserAuthenticationHandler;
  channelAuthorizer: ChannelAuthorizationHandler;

  // these are all optional parameters or overrrides. The customer can set these
  // but it's not strictly necessary
  forceTLS?: boolean;
  cluster?: string;
  disabledTransports?: Transport[];
  enabledTransports?: Transport[];
  ignoreNullOrigin?: boolean;
  nacl?: nacl;
  timelineParams?: any;
}

export interface ErrorCallbacks {
  tls_only: (result: Action | HandshakePayload) => void;
  refused: (result: Action | HandshakePayload) => void;
  backoff: (result: Action | HandshakePayload) => void;
  retry: (result: Action | HandshakePayload) => void;
}

export interface HandshakeCallbacks {
  connected: (handshake: HandshakePayload) => void;
}

export interface ConnectionCallbacks {
  message: (message: any) => void;
  ping: () => void;
  activity: () => void;
  error: (error: any) => void;
  closed: () => void;
}

// ============================================================
// Types from vendor code
// ============================================================

export type ChannelAuthorizationCallback = (
  error: Error | null,
  authData: ChannelAuthorizationData | null,
) => void;

export type UserAuthenticationCallback = (
  error: Error | null,
  authData: UserAuthenticationData | null,
) => void;

export type AuthTransportCallback =
  | ChannelAuthorizationCallback
  | UserAuthenticationCallback;

type UserAuthenticationOptions =
  AuthOptionsT<UserAuthenticationHandler>;

type ChannelAuthorizationOptions =
  AuthOptionsT<ChannelAuthorizationHandler>;

export type AuthTransport = 'ajax' | 'jsonp';

export type Transport =
  | 'ws'
  | 'wss'
  | 'xhr_streaming'
  | 'xhr_polling'
  | 'sockjs';

export type RedisKey = string | Buffer;

export type RedisValue = string | Buffer | number;

export type ClientContext = { type: keyof ResultTypes<unknown, unknown> };

export type Result<T, Context extends ClientContext> =
  // prettier-break
  ResultTypes<T, Context>[Context["type"]];

export type ArgumentType =
  | string
  | Buffer
  | number
  | (string | Buffer | number | any[])[];

type ArgumentTransformer = (args: any[]) => any[];

type ReplyTransformer = (reply: any) => any;

type ReplyData = string | Buffer | number | Array<string | Buffer | number>;

export type FlushQueueOptions = {
  offlineQueue?: boolean;

type RedisStatus =
  | "wait"
  | "reconnecting"
  | "connecting"
  | "connect"
  | "ready"
  | "close"
  | "end";

type AddSet = CommandNameFlags["ENTER_SUBSCRIBER_MODE"][number];

type DelSet = CommandNameFlags["EXIT_SUBSCRIBER_MODE"][number];

export type DNSResolveSrvFunction = (
  hostname: string,
  callback: (
    err: NodeJS.ErrnoException | null | undefined,
    records?: SrvRecord[]
  ) => void
) => void;

// ============================================================
// UCM Expected Types (stub)
// ============================================================

export interface Socket {
  // TODO: Define based on vendor/realtime/ patterns
}

export interface SocketConfig {
  // TODO: Define based on vendor/realtime/ patterns
}

export interface Message {
  // TODO: Define based on vendor/realtime/ patterns
}

export interface Channel {
  // TODO: Define based on vendor/realtime/ patterns
}
