/**
 * x402 Middleware for API Calls
 * @description Automatically handles 402 payments for any API call
 * @author nirholas
 * @license Apache-2.0
 */

import { getX402 } from './universal.js';
import Logger from '@/utils/logger.js';

export interface X402MiddlewareOptions {
  enabled?: boolean;
  autoRetry?: boolean;
  maxRetries?: number;
  paymentTimeout?: number;
}

/**
 * Wrap fetch with x402 payment handling
 */
export function createX402Fetch(options: X402MiddlewareOptions = {}): typeof fetch {
  const config = {
    enabled: true,
    autoRetry: true,
    maxRetries: 3,
    paymentTimeout: 30000,
    ...options
  };

  return async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const x402 = getX402();
    
    if (!config.enabled || !x402?.isEnabled()) {
      return fetch(input, init);
    }

    let retries = 0;
    
    while (retries < config.maxRetries) {
      try {
        const response = await fetch(input, init);
        
        // Check for 402 Payment Required
        if (response.status === 402) {
          Logger.info('[x402-fetch] 402 Payment Required received');
          
          const paymentInfo = extractPaymentInfoFromResponse(response);
          await x402.wrapApiCall(async () => {
            throw { response, status: 402 };
          });
          
          retries++;
          continue;
        }
        
        return response;
      } catch (error: any) {
        if (error.status === 402 && config.autoRetry && retries < config.maxRetries) {
          retries++;
          continue;
        }
        throw error;
      }
    }
    
    throw new Error('Max retries exceeded for payment');
  };
}

/**
 * Wrap axios with x402 payment handling
 */
export function createX402Axios(axios: any, options: X402MiddlewareOptions = {}): any {
  const config = {
    enabled: true,
    autoRetry: true,
    maxRetries: 3,
    ...options
  };

  // Add response interceptor
  axios.interceptors.response.use(
    (response: any) => response,
    async (error: any) => {
      const x402 = getX402();
      
      if (!config.enabled || !x402?.isEnabled()) {
        return Promise.reject(error);
      }

      if (error.response?.status === 402) {
        Logger.info('[x402-axios] 402 Payment Required received');
        
        try {
          // Extract payment info and handle payment
          await x402.wrapApiCall(async () => {
            throw error;
          });
          
          // Retry the request
          if (config.autoRetry) {
            return axios.request(error.config);
          }
        } catch (paymentError) {
          return Promise.reject(paymentError);
        }
      }
      
      return Promise.reject(error);
    }
  );

  return axios;
}

/**
 * Generic API call wrapper with x402
 */
export async function x402ApiCall<T>(
  apiCall: () => Promise<T>,
  options?: {
    toolName?: string;
    maxPayment?: string;
    chain?: string;
  }
): Promise<T> {
  const x402 = getX402();
  
  if (!x402?.isEnabled()) {
    return apiCall();
  }

  // Check if payment is required for this tool
  if (options?.toolName && x402.requiresPayment(options.toolName)) {
    const paymentInfo = x402.getToolPaymentInfo(options.toolName);
    Logger.info('[x402] Tool requires payment:', {
      tool: options.toolName,
      ...paymentInfo
    });
  }

  return x402.wrapApiCall(apiCall, {
    paymentRequired: true,
    maxPayment: options?.maxPayment,
    chain: options?.chain
  });
}

/**
 * Decorator for x402-enabled functions
 */
export function X402Enabled(options?: {
  maxPayment?: string;
  chain?: string;
  required?: boolean;
}) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const x402 = getX402();
      
      if (!x402?.isEnabled() || !options?.required) {
        return originalMethod.apply(this, args);
      }

      return x402.wrapApiCall(
        () => originalMethod.apply(this, args),
        options
      );
    };

    return descriptor;
  };
}

/**
 * Extract payment info from response headers
 */
function extractPaymentInfoFromResponse(response: Response): any {
  return {
    amount: response.headers.get('x402-amount') || response.headers.get('x-payment-amount'),
    recipient: response.headers.get('x402-address') || response.headers.get('x-payment-address'),
    chain: response.headers.get('x402-chain') || 'base',
    token: response.headers.get('x402-token') || 'USDC'
  };
}

/**
 * Create payment-enabled tool wrapper
 */
export function createPaymentEnabledTool<T extends (...args: any[]) => Promise<any>>(
  toolFn: T,
  toolName: string,
  options?: {
    requirePayment?: boolean;
    amount?: string;
    tier?: 'free' | 'basic' | 'premium';
  }
): T {
  return (async (...args: any[]) => {
    const x402 = getX402();
    
    if (!x402?.isEnabled() || !options?.requirePayment) {
      return toolFn(...args);
    }

    const paymentInfo = x402.getToolPaymentInfo(toolName);
    
    if (paymentInfo.required) {
      Logger.info(`[x402] ${toolName} requires payment: ${paymentInfo.amount} ${paymentInfo.tier}`);
    }

    return x402.wrapApiCall(() => toolFn(...args), {
      maxPayment: options?.amount || paymentInfo.amount
    });
  }) as T;
}

/**
 * Batch payment wrapper for multiple API calls
 */
export async function x402BatchCall<T>(
  calls: Array<() => Promise<T>>,
  options?: {
    sequential?: boolean;
    maxTotalPayment?: string;
  }
): Promise<T[]> {
  const x402 = getX402();
  
  if (!x402?.isEnabled()) {
    return options?.sequential
      ? sequentialExecute(calls)
      : Promise.all(calls.map(call => call()));
  }

  let totalPayment = 0;
  const maxTotal = parseFloat(options?.maxTotalPayment || '10.00');

  const wrappedCalls = calls.map(call => async () => {
    return x402.wrapApiCall(call, {
      maxPayment: (maxTotal - totalPayment).toString()
    });
  });

  return options?.sequential
    ? sequentialExecute(wrappedCalls)
    : Promise.all(wrappedCalls.map(call => call()));
}

async function sequentialExecute<T>(calls: Array<() => Promise<T>>): Promise<T[]> {
  const results: T[] = [];
  for (const call of calls) {
    results.push(await call());
  }
  return results;
}
