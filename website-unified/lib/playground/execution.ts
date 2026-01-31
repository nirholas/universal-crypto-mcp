/**
 * Tool Execution - Execute MCP tools and manage results
 * @module lib/playground/execution
 */

import { 
  McpTool, 
  ExecutionResult, 
  ExecutionStatus, 
  ExecutionContent,
  ExecutionHistoryItem 
} from './types';

/**
 * Generate a unique execution ID
 */
function generateExecutionId(): string {
  return `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Execute a tool with given parameters
 */
export async function executeTool(
  tool: McpTool,
  parameters: Record<string, unknown>,
  options: {
    chain?: string;
    timeout?: number;
    signal?: AbortSignal;
  } = {}
): Promise<ExecutionResult> {
  const executionId = generateExecutionId();
  const startTime = new Date();

  try {
    // Send execution request to the API
    const response = await fetch('/api/playground/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        toolId: tool.id,
        toolName: tool.name,
        parameters,
        chain: options.chain,
      }),
      signal: options.signal,
    });

    const endTime = new Date();
    const data = await response.json();

    if (!response.ok) {
      return {
        id: executionId,
        toolId: tool.id,
        toolName: tool.name,
        status: 'error',
        parameters,
        startTime,
        endTime,
        duration: endTime.getTime() - startTime.getTime(),
        error: {
          code: data.code || 'EXECUTION_ERROR',
          message: data.message || 'Tool execution failed',
          details: data.details,
        },
      };
    }

    // Parse the response content
    const content = parseExecutionContent(data.result);

    return {
      id: executionId,
      toolId: tool.id,
      toolName: tool.name,
      status: 'success',
      parameters,
      startTime,
      endTime,
      duration: endTime.getTime() - startTime.getTime(),
      content,
      metadata: data.metadata,
    };
  } catch (error: any) {
    const endTime = new Date();

    if (error.name === 'AbortError') {
      return {
        id: executionId,
        toolId: tool.id,
        toolName: tool.name,
        status: 'cancelled',
        parameters,
        startTime,
        endTime,
        duration: endTime.getTime() - startTime.getTime(),
      };
    }

    return {
      id: executionId,
      toolId: tool.id,
      toolName: tool.name,
      status: 'error',
      parameters,
      startTime,
      endTime,
      duration: endTime.getTime() - startTime.getTime(),
      error: {
        code: 'NETWORK_ERROR',
        message: error.message || 'Network request failed',
      },
    };
  }
}

/**
 * Parse execution result into displayable content
 */
function parseExecutionContent(result: unknown): ExecutionContent[] {
  if (result === null || result === undefined) {
    return [{ type: 'text', data: 'No output' }];
  }

  if (typeof result === 'string') {
    // Try to parse as JSON
    try {
      const parsed = JSON.parse(result);
      return [{ type: 'json', data: parsed }];
    } catch {
      return [{ type: 'text', data: result }];
    }
  }

  if (Array.isArray(result)) {
    // Check if it looks like table data
    if (result.length > 0 && typeof result[0] === 'object') {
      return [{ type: 'table', data: result }];
    }
    return [{ type: 'json', data: result }];
  }

  if (typeof result === 'object') {
    const obj = result as Record<string, unknown>;

    // Check for MCP content types
    if (obj.type === 'text' && typeof obj.text === 'string') {
      return [{ type: 'text', data: obj.text }];
    }

    if (obj.type === 'image' && obj.data) {
      return [{ type: 'image', data: obj.data, mimeType: obj.mimeType as string }];
    }

    // Check for chart data
    if (obj.chartType && obj.data) {
      return [{ type: 'chart', data: obj }];
    }

    return [{ type: 'json', data: result }];
  }

  return [{ type: 'text', data: String(result) }];
}

/**
 * Validate parameters against tool schema
 */
export function validateParameters(
  tool: McpTool,
  parameters: Record<string, unknown>
): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};
  const schema = tool.inputSchema;

  // Check required fields
  if (schema.required) {
    for (const field of schema.required) {
      if (parameters[field] === undefined || parameters[field] === '') {
        errors[field] = `${field} is required`;
      }
    }
  }

  // Validate field types and constraints
  if (schema.properties) {
    for (const [key, prop] of Object.entries(schema.properties)) {
      const value = parameters[key];

      if (value === undefined || value === '') continue;

      // Type validation
      switch (prop.type) {
        case 'string':
          if (typeof value !== 'string') {
            errors[key] = `${key} must be a string`;
          } else {
            // Pattern validation
            if (prop.pattern && !new RegExp(prop.pattern).test(value)) {
              errors[key] = `${key} format is invalid`;
            }
            // Length validation
            if (prop.minLength && value.length < prop.minLength) {
              errors[key] = `${key} must be at least ${prop.minLength} characters`;
            }
            if (prop.maxLength && value.length > prop.maxLength) {
              errors[key] = `${key} must be at most ${prop.maxLength} characters`;
            }
            // Enum validation
            if (prop.enum && !prop.enum.includes(value)) {
              errors[key] = `${key} must be one of: ${prop.enum.join(', ')}`;
            }
          }
          break;

        case 'number':
        case 'integer':
          const numValue = typeof value === 'string' ? parseFloat(value) : value;
          if (typeof numValue !== 'number' || isNaN(numValue)) {
            errors[key] = `${key} must be a number`;
          } else {
            if (prop.type === 'integer' && !Number.isInteger(numValue)) {
              errors[key] = `${key} must be an integer`;
            }
            if (prop.minimum !== undefined && numValue < prop.minimum) {
              errors[key] = `${key} must be at least ${prop.minimum}`;
            }
            if (prop.maximum !== undefined && numValue > prop.maximum) {
              errors[key] = `${key} must be at most ${prop.maximum}`;
            }
          }
          break;

        case 'boolean':
          if (typeof value !== 'boolean') {
            errors[key] = `${key} must be a boolean`;
          }
          break;

        case 'array':
          if (!Array.isArray(value)) {
            errors[key] = `${key} must be an array`;
          }
          break;

        case 'object':
          if (typeof value !== 'object' || Array.isArray(value)) {
            errors[key] = `${key} must be an object`;
          }
          break;
      }
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Format execution duration for display
 */
export function formatDuration(ms: number): string {
  if (ms < 1000) {
    return `${ms}ms`;
  }
  if (ms < 60000) {
    return `${(ms / 1000).toFixed(2)}s`;
  }
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return `${minutes}m ${seconds}s`;
}

/**
 * Create a mock execution for demo purposes
 */
export function createMockExecution(
  tool: McpTool,
  parameters: Record<string, unknown>
): ExecutionResult {
  const executionId = generateExecutionId();
  const startTime = new Date();
  const endTime = new Date(startTime.getTime() + Math.random() * 500 + 100);

  // Generate mock data based on tool type
  let content: ExecutionContent[];

  if (tool.id.includes('balance')) {
    content = [{
      type: 'json',
      data: {
        balance: '1234567890000000000',
        formatted: '1.234567890',
        symbol: 'ETH',
      },
    }];
  } else if (tool.id.includes('price')) {
    content = [{
      type: 'json',
      data: {
        price: 2456.78,
        change24h: 2.34,
        volume24h: 12345678900,
        marketCap: 295000000000,
      },
    }];
  } else if (tool.id.includes('gas')) {
    content = [{
      type: 'json',
      data: {
        standard: '25',
        fast: '35',
        instant: '50',
        baseFee: '20',
      },
    }];
  } else {
    content = [{
      type: 'json',
      data: {
        success: true,
        message: 'Mock execution completed',
        timestamp: new Date().toISOString(),
      },
    }];
  }

  return {
    id: executionId,
    toolId: tool.id,
    toolName: tool.name,
    status: 'success',
    parameters,
    startTime,
    endTime,
    duration: endTime.getTime() - startTime.getTime(),
    content,
  };
}

/**
 * Retry a failed execution
 */
export async function retryExecution(
  execution: ExecutionResult,
  tool: McpTool
): Promise<ExecutionResult> {
  return executeTool(tool, execution.parameters);
}
