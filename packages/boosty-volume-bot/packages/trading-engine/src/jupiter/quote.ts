/**
 * Jupiter Quote Service
 * 
 * Handles fetching quotes from Jupiter V6 API with rate limiting, caching,
 * timeouts, and automatic retry with exponential backoff.
 */

import type {
  QuoteParams,
  QuoteResponse,
  TradingEngineConfig,
} from '../types.js';
import { HttpClient, type HttpClientConfig } from '../utils/http.js';
import { NoRouteError, RateLimitError } from '../errors.js';

/**
 * Jupiter Quote service for fetching optimal swap routes
 */
export class JupiterQuote {
  private readonly apiUrl: string;
  private readonly defaultSlippageBps: number;
  private readonly httpClient: HttpClient;

  // Request tracking for rate limiting
  private requestCount: number = 0;
  private lastResetTime: number = Date.now();
  private readonly rateLimit: number;

  constructor(config: TradingEngineConfig) {
    this.apiUrl = config.jupiterApiUrl;
    this.defaultSlippageBps = config.defaultSlippageBps;
    this.rateLimit = config.jupiterRateLimit;

    // Create HTTP client with appropriate settings
    const httpConfig: Partial<HttpClientConfig> = {
      baseUrl: config.jupiterApiUrl,
      timeoutMs: 15000, // 15 second timeout
      retryConfig: {
        maxAttempts: 3,
        initialDelayMs: 500,
        maxDelayMs: 5000,
        backoffMultiplier: 2,
        jitterFactor: 0.1,
      },
    };

    this.httpClient = new HttpClient(httpConfig);
  }

  /**
   * Check and update rate limit
   */
  private checkRateLimit(): void {
    const now = Date.now();
    const elapsed = now - this.lastResetTime;

    // Reset counter every minute
    if (elapsed >= 60000) {
      this.requestCount = 0;
      this.lastResetTime = now;
    }

    // Check if we're over the limit
    if (this.requestCount >= this.rateLimit) {
      const retryAfter = 60000 - elapsed;
      throw new RateLimitError('Jupiter API', retryAfter);
    }

    this.requestCount++;
  }

  /**
   * Build quote request URL with parameters
   */
  private buildQuoteUrl(params: QuoteParams): string {
    const url = new URL(`${this.apiUrl}/quote`);
    
    url.searchParams.set('inputMint', params.inputMint);
    url.searchParams.set('outputMint', params.outputMint);
    url.searchParams.set('amount', params.amount.toString());
    url.searchParams.set('slippageBps', (params.slippageBps ?? this.defaultSlippageBps).toString());
    
    if (params.swapMode) {
      url.searchParams.set('swapMode', params.swapMode);
    }
    
    if (params.onlyDirectRoutes) {
      url.searchParams.set('onlyDirectRoutes', 'true');
    }
    
    if (params.includeDexes && params.includeDexes.length > 0) {
      url.searchParams.set('dexes', params.includeDexes.join(','));
    }
    
    if (params.excludeDexes && params.excludeDexes.length > 0) {
      url.searchParams.set('excludeDexes', params.excludeDexes.join(','));
    }
    
    if (params.maxAccounts) {
      url.searchParams.set('maxAccounts', params.maxAccounts.toString());
    }
    
    if (params.platformFeeBps) {
      url.searchParams.set('platformFeeBps', params.platformFeeBps.toString());
    }

    // Restrict intermediate tokens for better quality routes
    if (params.restrictIntermediateTokens !== false) {
      url.searchParams.set('restrictIntermediateTokens', 'true');
    }

    return url.toString();
  }

  /**
   * Fetch a quote from Jupiter with retry and timeout
   */
  async getQuote(params: QuoteParams): Promise<QuoteResponse> {
    // Check rate limit before making request
    this.checkRateLimit();

    const url = this.buildQuoteUrl(params);
    
    try {
      const data = await this.httpClient.get<QuoteResponse>(url);
      
      // Validate response
      if (!data.inputMint || !data.outputMint || !data.inAmount || !data.outAmount) {
        throw new NoRouteError(params.inputMint, params.outputMint, params.amount);
      }

      return data;
    } catch (error) {
      // Convert generic errors to typed errors
      if (error instanceof Error) {
        if (error.message.includes('No routes found') || error.message.includes('404')) {
          throw new NoRouteError(params.inputMint, params.outputMint, params.amount);
        }
        if (error.message.includes('429')) {
          throw new RateLimitError('Jupiter API');
        }
      }
      throw error;
    }
  }

  /**
   * Fetch multiple quotes for comparison
   */
  async getQuotes(params: QuoteParams, variations: Partial<QuoteParams>[] = []): Promise<QuoteResponse[]> {
    const requests = [
      this.getQuote(params),
      ...variations.map(v => this.getQuote({ ...params, ...v })),
    ];

    const results = await Promise.allSettled(requests);
    
    return results
      .filter((r): r is PromiseFulfilledResult<QuoteResponse> => r.status === 'fulfilled')
      .map(r => r.value);
  }

  /**
   * Get the best quote from multiple options
   */
  async getBestQuote(params: QuoteParams): Promise<QuoteResponse> {
    // Try different routing options and return the best one
    const variations: Partial<QuoteParams>[] = [
      { onlyDirectRoutes: true }, // Direct route only
      { maxAccounts: 20 }, // Limited accounts for smaller tx
      { maxAccounts: 64 }, // More accounts for potentially better routes
    ];

    const quotes = await this.getQuotes(params, variations);
    
    if (quotes.length === 0) {
      throw new Error('No valid quotes found');
    }

    // Sort by output amount (descending) - best quote has highest output
    if (params.swapMode === 'ExactOut') {
      // For ExactOut, we want the lowest input amount
      quotes.sort((a, b) => BigInt(a.inAmount) < BigInt(b.inAmount) ? -1 : 1);
    } else {
      // For ExactIn (default), we want the highest output amount
      quotes.sort((a, b) => BigInt(b.outAmount) > BigInt(a.outAmount) ? -1 : 1);
    }

    return quotes[0]!;
  }

  /**
   * Calculate effective price from quote
   */
  calculatePrice(quote: QuoteResponse, inputDecimals: number, outputDecimals: number): number {
    const inAmount = Number(quote.inAmount) / Math.pow(10, inputDecimals);
    const outAmount = Number(quote.outAmount) / Math.pow(10, outputDecimals);
    return outAmount / inAmount;
  }

  /**
   * Calculate price impact from quote
   */
  getPriceImpact(quote: QuoteResponse): number {
    return parseFloat(quote.priceImpactPct);
  }

  /**
   * Validate slippage is within acceptable range
   */
  validateSlippage(slippageBps: number, maxSlippageBps: number): void {
    if (slippageBps < 0) {
      throw new Error('Slippage cannot be negative');
    }
    if (slippageBps > maxSlippageBps) {
      throw new Error(`Slippage ${slippageBps} bps exceeds maximum ${maxSlippageBps} bps`);
    }
  }
}
