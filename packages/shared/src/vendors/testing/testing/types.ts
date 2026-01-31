/**
 * testing Types
 *
 * Auto-extracted from vendor/testing/
 */

// ============================================================
// Interfaces from vendor code
// ============================================================

export interface StringifiedResponse extends ResponseInit {
  body: string | ArrayBuffer | ReadableStream<Uint8Array> | null
}

export interface StartOptions extends SharedOptions {
  /**
   * Service Worker registration options.
   */
  serviceWorker?: {
    /**
     * Custom url to the worker script.
     * @default "/mockServiceWorker.js"
     */
    url?: string
    options?: RegistrationOptions
  }

export interface SetupWorker {
  /**
   * Registers and activates the mock Service Worker.
   *
   * @see {@link https://mswjs.io/docs/api/setup-worker/start `worker.start()` API reference}

export interface WorkerChannelOptions {
  worker: Promise<ServiceWorker>
}

export interface IncomingWorkerRequest
  extends Omit<
    Request,
    | 'text'
    | 'body'
    | 'json'
    | 'blob'
    | 'arrayBuffer'
    | 'formData'
    | 'clone'
    | 'signal'
    | 'isHistoryNavigation'
    | 'isReloadNavigation'
  > {
  /**
   * Unique ID of the request generated once the request is
   * intercepted by the "fetch" event in the Service Worker.
   */
  id: string
  interceptedAt: number
  body?: ArrayBuffer | null
}

export interface HttpResponseInit extends ResponseInit {
  type?: ResponseType
}

export interface StrictRequest<BodyType extends JsonBodyType> extends Request {
  json(): Promise<BodyType>
  clone(): StrictRequest<BodyType>
}

export interface GraphQLLinkHandlers {
  query: GraphQLRequestHandler
  mutation: GraphQLRequestHandler
  operation: GraphQLOperationHandler
}

export interface DocumentTypeDecoration<
  Result = { [key: string]: any },
  Variables = { [key: string]: any },
> {
  __apiType?: (variables: Variables) => Result
  __resultType?: Result
  __variablesType?: Variables
}

export interface GraphQLHandlerInfo extends RequestHandlerDefaultInfo {
  operationType: GraphQLOperationType
  operationName: GraphQLHandlerNameSelector | GraphQLCustomPredicate
}

export interface GraphQLJsonRequestBody<Variables extends GraphQLVariables> {
  query: string
  variables?: Variables
}

export interface HttpHandlerInfo extends RequestHandlerDefaultInfo {
  method: HttpHandlerMethod
  path: HttpRequestPredicate<PathParams>
}

export interface RequestHandlerDefaultInfo {
  header: string
}

export interface RequestHandlerInternalInfo {
  callFrame?: string
}

export interface RequestHandlerArgs<
  HandlerInfo,
  HandlerOptions extends RequestHandlerOptions,
> {
  info: HandlerInfo
  resolver: ResponseResolver<any>
  options?: HandlerOptions
}

export interface RequestHandlerOptions {
  once?: boolean
}

export interface WebSocketHandlerConnection {
  client: WebSocketClientConnectionProtocol
  server: WebSocketServerConnectionProtocol
  info: WebSocketConnectionData['info']
  params: PathParams
}

export interface WebSocketResolutionContext {
  baseUrl?: string
}

interface Post {
  title: string
  url: string
  date: {
    time: number
    string: string
  }

export interface Contributor {
  name: string
  avatar: string
}

// ============================================================
// Types from vendor code
// ============================================================

export type HttpHandlerMethod = string | RegExp

export interface HttpHandlerInfo extends RequestHandlerDefaultInfo {
  method: HttpHandlerMethod
  path: HttpRequestPredicate<PathParams>
}

export enum HttpMethods {
  HEAD = 'HEAD',
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  OPTIONS = 'OPTIONS',
  DELETE = 'DELETE',
}

export type RequestQuery = {
  [queryName: string]: string
}

export type HttpRequestParsedResult = {
  match: Match
  cookies: Record<string, string>
}

export type HttpRequestResolverExtras<Params extends PathParams> = {
  params: Params
  cookies: Record<string, string>
}

export type HttpCustomPredicate<Params extends PathParams> = (args: {
  request: Request
  cookies: Record<string, string>
}) =>
  | HttpCustomPredicateResult<Params>
  | Promise<HttpCustomPredicateResult<Params>>

export type HttpCustomPredicateResult<Params extends PathParams> =
  | boolean
  | {
      matches: boolean
      params: Params
    }

export type HttpRequestPredicate<Params extends PathParams> =
  | Path
  | HttpCustomPredicate<Params>

/**
 * Request handler for HTTP requests.
 * Provides request matching based on method and URL.
 */
export class HttpHandler extends RequestHandler<
  HttpHandlerInfo,
  HttpRequestParsedResult,
  HttpRequestResolverExtras<any>
> {
  constructor(
    method: HttpHandlerMethod,
    predicate: HttpRequestPredicate<PathParams>,
    resolver: ResponseResolver<HttpRequestResolverExtras<any>, any, any>,
    options?: RequestHandlerOptions,
  ) {
    const displayPath =
      typeof predicate === 'function' ? '[custom predicate]' : predicate

    super({
      info: {
        header: `${method}${displayPath ? ` ${displayPath}` : ''}`,
        path: predicate,
        method,
      },
      resolver,
      options,
    })

    this.checkRedundantQueryParameters()
  }

  private checkRedundantQueryParameters() {
    const { method, path } = this.info

    if (!path || path instanceof RegExp || typeof path === 'function') {
      return
    }

    const url = cleanUrl(path)

    // Bypass request handler URLs that have no redundant characters.
    if (url === path) {
      return
    }

    devUtils.warn(
      `Found a redundant usage of query parameters in the request handler URL for "${method} ${path}". Please match against a path instead and access query parameters using "new URL(request.url).searchParams" instead. Learn more: https://mswjs.io/docs/http/intercepting-requests#querysearch-parameters`,
    )
  }

  async parse(args: {
    request: Request
    resolutionContext?: ResponseResolutionContext
  }) {
    const url = new URL(args.request.url)
    const cookies = getAllRequestCookies(args.request)

    /**
     * Handle custom predicate functions.
     * @note Invoke this during parsing so the user can parse the path parameters
     * manually. Otherwise, `params` is always an empty object, which isn't nice.
     */
    if (typeof this.info.path === 'function') {
      const customPredicateResult = await this.info.path({
        request: args.request,
        cookies,
      })

      const match =
        typeof customPredicateResult === 'boolean'
          ? {
              matches: customPredicateResult,
              params: {},
            }
          : customPredicateResult

      return {
        match,
        cookies,
      }
    }

    const match = this.info.path
      ? matchRequestUrl(url, this.info.path, args.resolutionContext?.baseUrl)
      : { matches: false, params: {} }

    return {
      match,
      cookies,
    }
  }

  async predicate(args: {
    request: Request
    parsedResult: HttpRequestParsedResult
    resolutionContext?: ResponseResolutionContext
  }) {
    const hasMatchingMethod = this.matchMethod(args.request.method)
    const hasMatchingUrl = args.parsedResult.match.matches
    return hasMatchingMethod && hasMatchingUrl
  }

  private matchMethod(actualMethod: string): boolean {
    return this.info.method instanceof RegExp
      ? this.info.method.test(actualMethod)
      : isStringEqual(this.info.method, actualMethod)
  }

  protected extendResolverArgs(args: {
    request: Request
    parsedResult: HttpRequestParsedResult
  }) {
    return {
      params: args.parsedResult.match?.params || {},
      cookies: args.parsedResult.cookies,
    }
  }

  async log(args: { request: Request;

// ============================================================
// UCM Expected Types (stub)
// ============================================================

export interface TestContext {
  // TODO: Define based on vendor/testing/ patterns
}

export interface Matcher {
  // TODO: Define based on vendor/testing/ patterns
}

export interface Mock {
  // TODO: Define based on vendor/testing/ patterns
}

export interface Spy {
  // TODO: Define based on vendor/testing/ patterns
}
