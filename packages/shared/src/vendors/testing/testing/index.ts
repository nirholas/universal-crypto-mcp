/**
 * testing Implementation
 *
 * Adapted from: api-mocking, e2e-browser, react-testing, test-runner
 * See vendor/testing/ for reference implementations.
 */

export * from './types';

// ============================================================
// Functions
// ============================================================

// From vendor code
export async function copyServiceWorker(
  sourceFilePath: string,
  destFilePath: string,
  checksum: string,
): Promise<void> {
  // TODO: Implement - see vendor/testing/
  throw new Error('Not implemented: copyServiceWorker');
}

// From vendor code
export function getChecksum(contents: string): string {
  // TODO: Implement - see vendor/testing/
  throw new Error('Not implemented: getChecksum');
}

// From vendor code
export export function getWorkerChecksum(): string {
  // TODO: Implement - see vendor/testing/
  throw new Error('Not implemented: getWorkerChecksum');
}

// From vendor code
export export function copyWorkerPlugin(checksum: string): Plugin {
  // TODO: Implement - see vendor/testing/
  throw new Error('Not implemented: copyWorkerPlugin');
}

// From vendor code
export export function forceEsmExtensionsPlugin(): Plugin {
  // TODO: Implement - see vendor/testing/
  throw new Error('Not implemented: forceEsmExtensionsPlugin');
}

// From vendor code
export function modifyRelativeImports(contents: string, isEsm: boolean): string {
  // TODO: Implement - see vendor/testing/
  throw new Error('Not implemented: modifyRelativeImports');
}

// From vendor code
export export function graphqlImportPlugin(): Plugin {
  // TODO: Implement - see vendor/testing/
  throw new Error('Not implemented: graphqlImportPlugin');
}

// From vendor code
export export function resolveCoreImportsPlugin(): Plugin {
  // TODO: Implement - see vendor/testing/
  throw new Error('Not implemented: resolveCoreImportsPlugin');
}

// From vendor code
export export function setupWorker(
  ...handlers: Array<RequestHandler | WebSocketHandler>
): SetupWorker {
  // TODO: Implement - see vendor/testing/
  throw new Error('Not implemented: setupWorker');
}

// From vendor code
export export function createFallbackRequestListener(
  context: SetupWorkerInternalContext,
  options: RequiredDeep<StartOptions>,
): Interceptor<HttpRequestEventMap> {
  // TODO: Implement - see vendor/testing/
  throw new Error('Not implemented: createFallbackRequestListener');
}

// From vendor code
export export function createResponseListener(
  context: SetupWorkerInternalContext,
): Emitter.ListenerType<typeof context.workerChannel, 'RESPONSE'> {
  // TODO: Implement - see vendor/testing/
  throw new Error('Not implemented: createResponseListener');
}

// From vendor code
export function start(options, customOptions) {
  // TODO: Implement - see vendor/testing/
  throw new Error('Not implemented: start');
}

// From vendor code
export export function checkWorkerIntegrity(
  context: SetupWorkerInternalContext,
): Promise<void> {
  // TODO: Implement - see vendor/testing/
  throw new Error('Not implemented: checkWorkerIntegrity');
}

// From vendor code
export export function deserializeRequest(
  serializedRequest: ServiceWorkerIncomingRequest,
): Request {
  // TODO: Implement - see vendor/testing/
  throw new Error('Not implemented: deserializeRequest');
}

// From vendor code
export export function getAbsoluteWorkerUrl(workerUrl: string): string {
  // TODO: Implement - see vendor/testing/
  throw new Error('Not implemented: getAbsoluteWorkerUrl');
}

// UCM expected export
export function test(...args: unknown[]): unknown {
  // TODO: Implement based on vendor/testing/ patterns
  throw new Error('Not implemented: test');
}

// UCM expected export
export function describe(...args: unknown[]): unknown {
  // TODO: Implement based on vendor/testing/ patterns
  throw new Error('Not implemented: describe');
}

// UCM expected export
export function expect(...args: unknown[]): unknown {
  // TODO: Implement based on vendor/testing/ patterns
  throw new Error('Not implemented: expect');
}

// UCM expected export
export function mock(...args: unknown[]): unknown {
  // TODO: Implement based on vendor/testing/ patterns
  throw new Error('Not implemented: mock');
}

// UCM expected export
export function spy(...args: unknown[]): unknown {
  // TODO: Implement based on vendor/testing/ patterns
  throw new Error('Not implemented: spy');
}

// ============================================================
// Classes
// ============================================================

// From vendor code
export export class HttpResponse<
  BodyType extends DefaultBodyType,
> extends FetchResponse {
  constructor() {
    // TODO: Implement - see vendor/testing/
    throw new Error('Not implemented: HttpResponse');
  }
}

// From vendor code
export export abstract class HandlersController {
  constructor() {
    // TODO: Implement - see vendor/testing/
    throw new Error('Not implemented: HandlersController');
  }
}

// From vendor code
export export class InMemoryHandlersController implements HandlersController {
  constructor() {
    // TODO: Implement - see vendor/testing/
    throw new Error('Not implemented: InMemoryHandlersController');
  }
}

// From vendor code
export export abstract class SetupApi<EventsMap extends EventMap> extends Disposable {
  constructor() {
    // TODO: Implement - see vendor/testing/
    throw new Error('Not implemented: SetupApi');
  }
}

// From vendor code
export export class WebSocketHandler {
  constructor() {
    // TODO: Implement - see vendor/testing/
    throw new Error('Not implemented: WebSocketHandler');
  }
}

// From vendor code
export export class MyButton extends LitElement {
  constructor() {
    // TODO: Implement - see vendor/testing/
    throw new Error('Not implemented: MyButton');
  }
}
