/**
 * @universal-crypto-mcp/mcp-utils
 * 
 * MCP helper utilities for Universal Crypto MCP
 */

import { z } from 'zod';

// ============================================================================
// Tool Definition Helpers
// ============================================================================

export interface ToolDefinition<T extends z.ZodType = z.ZodType> {
  name: string;
  description: string;
  inputSchema: T;
  handler: (input: z.infer<T>) => Promise<ToolResult>;
}

export interface ToolResult {
  content: Array<{
    type: 'text' | 'image' | 'resource';
    text?: string;
    data?: string;
    mimeType?: string;
  }>;
  isError?: boolean;
}

/**
 * Creates a tool definition with type-safe input schema
 */
export function defineTool<T extends z.ZodType>(
  name: string,
  description: string,
  inputSchema: T,
  handler: (input: z.infer<T>) => Promise<ToolResult>
): ToolDefinition<T> {
  return {
    name,
    description,
    inputSchema,
    handler,
  };
}

/**
 * Creates a successful text response
 */
export function textResult(text: string): ToolResult {
  return {
    content: [{ type: 'text', text }],
  };
}

/**
 * Creates a JSON response
 */
export function jsonResult(data: unknown): ToolResult {
  return {
    content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
  };
}

/**
 * Creates an error response
 */
export function errorResult(message: string): ToolResult {
  return {
    content: [{ type: 'text', text: `Error: ${message}` }],
    isError: true,
  };
}

// ============================================================================
// Resource Helpers
// ============================================================================

export interface ResourceDefinition {
  uri: string;
  name: string;
  description?: string;
  mimeType?: string;
}

export function defineResource(
  uri: string,
  name: string,
  options?: { description?: string; mimeType?: string }
): ResourceDefinition {
  return {
    uri,
    name,
    description: options?.description,
    mimeType: options?.mimeType ?? 'application/json',
  };
}

// ============================================================================
// Prompt Helpers
// ============================================================================

export interface PromptDefinition {
  name: string;
  description?: string;
  arguments?: Array<{
    name: string;
    description?: string;
    required?: boolean;
  }>;
}

export function definePrompt(
  name: string,
  options?: {
    description?: string;
    arguments?: PromptDefinition['arguments'];
  }
): PromptDefinition {
  return {
    name,
    description: options?.description,
    arguments: options?.arguments,
  };
}

// Export version
export const VERSION = '1.0.0';
export const PACKAGE_NAME = '@universal-crypto-mcp/mcp-utils';
