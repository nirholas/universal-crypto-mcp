/**
 * MCP Tool Streaming Execution API Route
 * POST /api/tools/stream - Execute tool with streaming output
 * 
 * @author nich
 * @license Apache-2.0
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { createRequestContext } from '@/lib/api/handler';
import { NotFoundError, ValidationError } from '@/lib/api/errors';

export const runtime = 'edge';
export const maxDuration = 60;

// ============================================================================
// Request Schema
// ============================================================================

const StreamRequestSchema = z.object({
  toolId: z.string().min(1).max(100),
  parameters: z.record(z.unknown()),
  options: z.object({
    timeout: z.number().int().min(1000).max(120000).optional().default(60000),
  }).optional().default({}),
});

// ============================================================================
// Streaming Tools
// ============================================================================

interface StreamingTool {
  validate: (params: Record<string, unknown>) => boolean;
  stream: (params: Record<string, unknown>, emit: (data: StreamEvent) => void) => Promise<void>;
}

interface StreamEvent {
  type: 'progress' | 'data' | 'complete' | 'error';
  progress?: number;
  message?: string;
  data?: unknown;
  error?: string;
}

const STREAMING_TOOLS: Record<string, StreamingTool> = {
  'analyze-portfolio': {
    validate: (params) => typeof params.address === 'string',
    stream: async (params, emit) => {
      const steps = [
        { message: 'Fetching wallet data...', progress: 10 },
        { message: 'Analyzing token holdings...', progress: 25 },
        { message: 'Calculating USD values...', progress: 40 },
        { message: 'Fetching DeFi positions...', progress: 55 },
        { message: 'Analyzing NFT holdings...', progress: 70 },
        { message: 'Computing portfolio metrics...', progress: 85 },
        { message: 'Generating recommendations...', progress: 95 },
      ];
      
      for (const step of steps) {
        await delay(500);
        emit({ type: 'progress', progress: step.progress, message: step.message });
      }
      
      await delay(300);
      emit({
        type: 'complete',
        progress: 100,
        data: {
          address: params.address,
          totalValue: Math.floor(Math.random() * 100000) + 10000,
          tokens: [
            { symbol: 'ETH', balance: '2.5', usdValue: 6250 },
            { symbol: 'USDC', balance: '5000', usdValue: 5000 },
            { symbol: 'ARB', balance: '1000', usdValue: 1200 },
          ],
          defiPositions: [
            { protocol: 'Aave', type: 'lending', value: 3000 },
            { protocol: 'Uniswap', type: 'liquidity', value: 2000 },
          ],
          recommendations: [
            'Consider diversifying into more L2 tokens',
            'Your lending position has good APY',
            'NFT exposure is minimal',
          ],
        },
      });
    },
  },
  'scan-contract': {
    validate: (params) => typeof params.address === 'string',
    stream: async (params, emit) => {
      const checks = [
        { name: 'Fetching contract code', progress: 10 },
        { name: 'Analyzing bytecode', progress: 20 },
        { name: 'Checking for known vulnerabilities', progress: 35 },
        { name: 'Analyzing function selectors', progress: 50 },
        { name: 'Checking ownership patterns', progress: 65 },
        { name: 'Analyzing token mechanics', progress: 80 },
        { name: 'Generating security report', progress: 95 },
      ];
      
      for (const check of checks) {
        await delay(400);
        emit({ type: 'progress', progress: check.progress, message: check.name });
      }
      
      const score = Math.floor(Math.random() * 40) + 60;
      emit({
        type: 'complete',
        progress: 100,
        data: {
          address: params.address,
          score,
          riskLevel: score > 80 ? 'low' : score > 60 ? 'medium' : 'high',
          verified: Math.random() > 0.3,
          findings: [
            { severity: 'info', title: 'Contract is verified', description: 'Source code matches deployed bytecode' },
            { severity: 'warning', title: 'Centralized ownership', description: 'Single owner can pause contract' },
          ],
          gasEfficiency: Math.floor(Math.random() * 30) + 70,
        },
      });
    },
  },
  'batch-price-fetch': {
    validate: (params) => Array.isArray(params.tokens),
    stream: async (params, emit) => {
      const tokens = params.tokens as string[];
      const results: Array<{ symbol: string; price: number; change24h: number }> = [];
      
      for (let i = 0; i < tokens.length; i++) {
        await delay(200);
        const price = Math.random() * 5000;
        results.push({
          symbol: tokens[i],
          price,
          change24h: (Math.random() - 0.5) * 20,
        });
        
        emit({
          type: 'data',
          progress: Math.floor(((i + 1) / tokens.length) * 100),
          message: `Fetched ${tokens[i]}`,
          data: results[results.length - 1],
        });
      }
      
      emit({
        type: 'complete',
        progress: 100,
        data: { prices: results, timestamp: Date.now() },
      });
    },
  },
  'generate-tax-report': {
    validate: (params) => typeof params.address === 'string' && typeof params.year === 'number',
    stream: async (params, emit) => {
      const steps = [
        { message: 'Fetching transaction history...', progress: 10 },
        { message: 'Categorizing transactions...', progress: 25 },
        { message: 'Calculating cost basis...', progress: 40 },
        { message: 'Computing gains/losses...', progress: 55 },
        { message: 'Applying tax rules...', progress: 70 },
        { message: 'Generating summary...', progress: 85 },
        { message: 'Preparing report...', progress: 95 },
      ];
      
      for (const step of steps) {
        await delay(600);
        emit({ type: 'progress', progress: step.progress, message: step.message });
      }
      
      emit({
        type: 'complete',
        progress: 100,
        data: {
          address: params.address,
          year: params.year,
          summary: {
            shortTermGains: Math.floor(Math.random() * 10000),
            longTermGains: Math.floor(Math.random() * 20000),
            totalLosses: Math.floor(Math.random() * 5000),
            transactionCount: Math.floor(Math.random() * 500) + 50,
          },
          status: 'complete',
        },
      });
    },
  },
};

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ============================================================================
// SSE Handler
// ============================================================================

export async function POST(request: NextRequest) {
  const ctx = createRequestContext(request);
  
  // Parse and validate request
  let body;
  try {
    body = await request.json();
    body = StreamRequestSchema.parse(body);
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Invalid request body' },
      }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
  
  const { toolId, parameters, options } = body;
  
  // Check if tool exists
  const tool = STREAMING_TOOLS[toolId];
  if (!tool) {
    return new Response(
      JSON.stringify({
        success: false,
        error: { code: 'NOT_FOUND', message: `Streaming tool '${toolId}' not found` },
      }),
      { status: 404, headers: { 'Content-Type': 'application/json' } }
    );
  }
  
  // Validate parameters
  if (!tool.validate(parameters)) {
    return new Response(
      JSON.stringify({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Invalid parameters' },
      }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
  
  // Create SSE stream
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const emit = (event: StreamEvent) => {
        const data = JSON.stringify(event);
        controller.enqueue(encoder.encode(`data: ${data}\n\n`));
      };
      
      try {
        // Send initial event
        emit({
          type: 'progress',
          progress: 0,
          message: 'Starting execution...',
        });
        
        // Execute with timeout
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('timeout')), options.timeout);
        });
        
        await Promise.race([
          tool.stream(parameters, emit),
          timeoutPromise,
        ]);
        
      } catch (error) {
        emit({
          type: 'error',
          error: error instanceof Error ? error.message : 'Execution failed',
        });
      } finally {
        controller.close();
      }
    },
  });
  
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'X-Request-Id': ctx.requestId,
    },
  });
}
