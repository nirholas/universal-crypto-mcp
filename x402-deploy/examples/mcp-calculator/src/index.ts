/**
 * Calculator MCP Server with x402 Payments
 * 
 * A simple calculator that accepts cryptocurrency payments via x402.
 * Each calculation costs $0.001 in USDC on Base network.
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { wrapMCPServer } from "@nirholas/x402-deploy";

/**
 * Calculator tool implementations
 */
const tools = {
  add: (a: number, b: number) => a + b,
  subtract: (a: number, b: number) => a - b,
  multiply: (a: number, b: number) => a * b,
  divide: (a: number, b: number) => {
    if (b === 0) throw new Error("Division by zero");
    return a / b;
  },
  power: (a: number, b: number) => Math.pow(a, b),
  sqrt: (a: number) => {
    if (a < 0) throw new Error("Cannot calculate square root of negative number");
    return Math.sqrt(a);
  },
};

/**
 * Create the MCP server
 */
const server = new Server(
  {
    name: "calculator-x402",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

/**
 * List available tools
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "add",
        description: "Add two numbers",
        inputSchema: {
          type: "object",
          properties: {
            a: { type: "number", description: "First number" },
            b: { type: "number", description: "Second number" },
          },
          required: ["a", "b"],
        },
      },
      {
        name: "subtract",
        description: "Subtract two numbers",
        inputSchema: {
          type: "object",
          properties: {
            a: { type: "number", description: "First number" },
            b: { type: "number", description: "Second number" },
          },
          required: ["a", "b"],
        },
      },
      {
        name: "multiply",
        description: "Multiply two numbers",
        inputSchema: {
          type: "object",
          properties: {
            a: { type: "number", description: "First number" },
            b: { type: "number", description: "Second number" },
          },
          required: ["a", "b"],
        },
      },
      {
        name: "divide",
        description: "Divide two numbers",
        inputSchema: {
          type: "object",
          properties: {
            a: { type: "number", description: "Numerator" },
            b: { type: "number", description: "Denominator" },
          },
          required: ["a", "b"],
        },
      },
      {
        name: "power",
        description: "Raise a number to a power",
        inputSchema: {
          type: "object",
          properties: {
            a: { type: "number", description: "Base" },
            b: { type: "number", description: "Exponent" },
          },
          required: ["a", "b"],
        },
      },
      {
        name: "sqrt",
        description: "Calculate square root",
        inputSchema: {
          type: "object",
          properties: {
            a: { type: "number", description: "Number" },
          },
          required: ["a"],
        },
      },
    ],
  };
});

/**
 * Handle tool calls
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (!(name in tools)) {
    throw new Error(`Unknown tool: ${name}`);
  }

  try {
    const tool = tools[name as keyof typeof tools];
    const result = tool(args.a as number, args.b as number);

    return {
      content: [
        {
          type: "text",
          text: `Result: ${result}`,
        },
      ],
    };
  } catch (error: any) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

/**
 * Wrap with x402 payment gateway
 * 
 * This adds cryptocurrency payment requirements to the MCP server.
 * Users must pay $0.001 in USDC on Base network before calculations.
 */
const wrappedServer = wrapMCPServer(server, {
  name: "calculator-x402",
  payment: {
    wallet: process.env.X402_WALLET || "0x40252CFDF8B20Ed757D61ff157719F33Ec332402",
    network: "eip155:8453", // Base
    token: "USDC",
  },
  pricing: {
    default: "$0.001", // $0.001 per calculation
    routes: {
      "tool:add": "$0.001",
      "tool:subtract": "$0.001",
      "tool:multiply": "$0.002", // Premium operation
      "tool:divide": "$0.002",
      "tool:power": "$0.003",
      "tool:sqrt": "$0.001",
    },
  },
  discovery: {
    enabled: true,
    instructions: "A calculator MCP server that accepts cryptocurrency payments. Each calculation requires a small USDC payment on Base network.",
  },
});

/**
 * Start the server
 */
async function main() {
  const transport = new StdioServerTransport();
  await wrappedServer.connect(transport);
  console.error("Calculator MCP server with x402 payments running on stdio");
}

main().catch(console.error);
