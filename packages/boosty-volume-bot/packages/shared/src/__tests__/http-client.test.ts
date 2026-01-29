import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchWithRetry, fetchJson, HttpClient } from '../http-client.js';
import { APIError, NetworkError, RateLimitError } from '../errors.js';

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('fetchWithRetry', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('should return response on success', async () => {
    const mockResponse = new Response(JSON.stringify({ data: 'test' }), { status: 200 });
    mockFetch.mockResolvedValueOnce(mockResponse);

    const response = await fetchWithRetry('https://api.example.com/test');

    expect(response.status).toBe(200);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('should retry on 500 errors', async () => {
    mockFetch
      .mockResolvedValueOnce(new Response('Error', { status: 500 }))
      .mockResolvedValueOnce(new Response('Error', { status: 500 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ data: 'test' }), { status: 200 }));

    const response = await fetchWithRetry(
      'https://api.example.com/test',
      {},
      { baseDelayMs: 10, maxDelayMs: 50 }
    );

    expect(response.status).toBe(200);
    expect(mockFetch).toHaveBeenCalledTimes(3);
  });

  it('should throw after max retries on persistent failures', async () => {
    mockFetch.mockResolvedValue(new Response('Error', { status: 500 }));

    await expect(
      fetchWithRetry(
        'https://api.example.com/test',
        {},
        { maxRetries: 2, baseDelayMs: 10, maxDelayMs: 50 }
      )
    ).rejects.toThrow(APIError);

    expect(mockFetch).toHaveBeenCalledTimes(3); // Initial + 2 retries
  });

  it('should handle rate limiting with Retry-After header', async () => {
    mockFetch
      .mockResolvedValueOnce(
        new Response('Rate limited', {
          status: 429,
          headers: { 'Retry-After': '1' },
        })
      )
      .mockResolvedValueOnce(new Response(JSON.stringify({ data: 'test' }), { status: 200 }));

    const response = await fetchWithRetry(
      'https://api.example.com/test',
      {},
      { baseDelayMs: 10 }
    );

    expect(response.status).toBe(200);
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it('should throw RateLimitError when not retrying rate limits', async () => {
    mockFetch.mockResolvedValue(
      new Response('Rate limited', {
        status: 429,
        headers: { 'Retry-After': '60' },
      })
    );

    await expect(
      fetchWithRetry(
        'https://api.example.com/test',
        {},
        { retryOnRateLimit: false }
      )
    ).rejects.toThrow(RateLimitError);
  });

  it('should not retry on 4xx errors (except 408 and 429)', async () => {
    mockFetch.mockResolvedValue(new Response('Not Found', { status: 404 }));

    const response = await fetchWithRetry('https://api.example.com/test');

    expect(response.status).toBe(404);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('should handle timeout', async () => {
    mockFetch.mockImplementation(() => new Promise((_, reject) => {
      const error = new Error('Aborted');
      error.name = 'AbortError';
      setTimeout(() => reject(error), 50);
    }));

    await expect(
      fetchWithRetry(
        'https://api.example.com/test',
        { timeout: 10 },
        { maxRetries: 0 }
      )
    ).rejects.toThrow(NetworkError);
  });
});

describe('fetchJson', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('should parse JSON response', async () => {
    mockFetch.mockResolvedValueOnce(
      new Response(JSON.stringify({ key: 'value' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    );

    const data = await fetchJson<{ key: string }>('https://api.example.com/test');

    expect(data).toEqual({ key: 'value' });
  });

  it('should throw APIError on non-ok response', async () => {
    mockFetch.mockResolvedValueOnce(
      new Response(JSON.stringify({ error: 'Not found' }), {
        status: 404,
      })
    );

    await expect(fetchJson('https://api.example.com/test')).rejects.toThrow(APIError);
  });

  it('should include Accept header', async () => {
    mockFetch.mockResolvedValueOnce(
      new Response(JSON.stringify({}), { status: 200 })
    );

    await fetchJson('https://api.example.com/test');

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.example.com/test',
      expect.objectContaining({
        headers: expect.objectContaining({
          'Accept': 'application/json',
        }),
      })
    );
  });
});

describe('HttpClient', () => {
  let client: HttpClient;

  beforeEach(() => {
    mockFetch.mockReset();
    client = new HttpClient({
      baseUrl: 'https://api.example.com',
      headers: { 'X-API-Key': 'test-key' },
    });
  });

  describe('get', () => {
    it('should make GET request with base URL', async () => {
      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ data: 'test' }), { status: 200 })
      );

      const result = await client.get('/test');

      expect(result).toEqual({ data: 'test' });
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/test',
        expect.objectContaining({ method: 'GET' })
      );
    });

    it('should include default headers', async () => {
      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify({}), { status: 200 })
      );

      await client.get('/test');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-API-Key': 'test-key',
          }),
        })
      );
    });
  });

  describe('post', () => {
    it('should make POST request with JSON body', async () => {
      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ success: true }), { status: 200 })
      );

      const result = await client.post('/test', { key: 'value' });

      expect(result).toEqual({ success: true });
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/test',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ key: 'value' }),
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      );
    });
  });

  describe('put', () => {
    it('should make PUT request', async () => {
      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ updated: true }), { status: 200 })
      );

      await client.put('/test/1', { name: 'updated' });

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/test/1',
        expect.objectContaining({ method: 'PUT' })
      );
    });
  });

  describe('delete', () => {
    it('should make DELETE request', async () => {
      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ deleted: true }), { status: 200 })
      );

      await client.delete('/test/1');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/test/1',
        expect.objectContaining({ method: 'DELETE' })
      );
    });
  });

  it('should handle full URLs', async () => {
    mockFetch.mockResolvedValueOnce(
      new Response(JSON.stringify({}), { status: 200 })
    );

    await client.get('https://other-api.com/endpoint');

    expect(mockFetch).toHaveBeenCalledWith(
      'https://other-api.com/endpoint',
      expect.any(Object)
    );
  });
});
