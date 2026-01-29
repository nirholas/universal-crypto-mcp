/**
 * Payment Tools - x402 payment-related tool definitions
 */

import type { Tool } from '@modelcontextprotocol/sdk/types.js';

export const paymentToolDefinitions: Tool[] = [
  {
    name: 'get_payment_pricing',
    description: 'Get pricing information for all available tools. Shows which tools require x402 payments and their costs in USDC.',
    inputSchema: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          description: 'Filter by tool category (wallet, trading, campaign, bot, analysis)',
          enum: ['wallet', 'trading', 'campaign', 'bot', 'analysis'],
        },
      },
    },
  },
  {
    name: 'get_tool_price',
    description: 'Get the price for a specific tool call',
    inputSchema: {
      type: 'object',
      properties: {
        tool_name: {
          type: 'string',
          description: 'The name of the tool to get pricing for',
        },
      },
      required: ['tool_name'],
    },
  },
  {
    name: 'get_payment_networks',
    description: 'Get supported payment networks and their USDC contract addresses. Includes Base, Ethereum, Arbitrum, Optimism, Polygon, and Solana.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_payment_analytics',
    description: 'Get payment analytics and revenue statistics. Shows total payments, revenue, success rate, and breakdown by tool and network.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'validate_payment_network',
    description: 'Validate if a payment network is supported and get its USDC token information',
    inputSchema: {
      type: 'object',
      properties: {
        network: {
          type: 'string',
          description: 'Network identifier (e.g., eip155:8453 for Base, eip155:42161 for Arbitrum)',
        },
      },
      required: ['network'],
    },
  },
];
