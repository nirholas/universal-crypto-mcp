/**
 * Prompt Templates
 * MCP prompt templates for common operations
 */

import type { PromptDefinition, PromptMessage } from '../types.js';

export const promptDefinitions: PromptDefinition[] = [
  {
    name: 'volume_campaign_wizard',
    description: 'Interactive wizard to set up a volume generation campaign',
    arguments: [
      { name: 'tokenMint', description: 'Target token mint address', required: true },
    ],
  },
  {
    name: 'wallet_setup_guide',
    description: 'Guide for setting up wallets for trading operations',
    arguments: [
      { name: 'walletCount', description: 'Number of wallets to set up', required: false },
    ],
  },
  {
    name: 'analyze_token_for_trading',
    description: 'Comprehensive token analysis for trading decisions',
    arguments: [
      { name: 'tokenMint', description: 'Token mint address to analyze', required: true },
    ],
  },
  {
    name: 'campaign_optimization_report',
    description: 'Generate an optimization report for a running campaign',
    arguments: [
      { name: 'campaignId', description: 'Campaign ID to analyze', required: true },
    ],
  },
];

export function getPromptMessages(
  promptName: string,
  args: Record<string, string | undefined>
): PromptMessage[] {
  switch (promptName) {
    case 'volume_campaign_wizard':
      return getVolumeCampaignWizardMessages(args.tokenMint ?? '');
    case 'wallet_setup_guide':
      return getWalletSetupGuideMessages(args.walletCount ?? '10');
    case 'analyze_token_for_trading':
      return getAnalyzeTokenMessages(args.tokenMint ?? '');
    case 'campaign_optimization_report':
      return getCampaignOptimizationMessages(args.campaignId ?? '');
    default:
      return [{ role: 'user', content: { type: 'text', text: 'Unknown prompt' } }];
  }
}

function getVolumeCampaignWizardMessages(tokenMint: string): PromptMessage[] {
  return [
    {
      role: 'user',
      content: {
        type: 'text',
        text: `I want to set up a volume generation campaign for token: ${tokenMint}

Please help me configure the campaign by:
1. First, analyze the token's current liquidity and trading activity
2. Recommend an appropriate target volume based on current levels
3. Suggest the optimal number of bots and trading parameters
4. Help me understand the estimated costs and risks
5. Guide me through creating and starting the campaign

Let's start with analyzing the token.`,
      },
    },
  ];
}

function getWalletSetupGuideMessages(walletCount?: string): PromptMessage[] {
  const count = walletCount || '10';
  return [
    {
      role: 'user',
      content: {
        type: 'text',
        text: `I need to set up ${count} wallets for DeFi trading operations.

Please guide me through:
1. Creating the wallet swarm with appropriate tags
2. Funding the wallets from my main wallet
3. Verifying all wallets are properly funded
4. Best practices for wallet management and security

Let's start by creating the wallets.`,
      },
    },
  ];
}

function getAnalyzeTokenMessages(tokenMint: string): PromptMessage[] {
  return [
    {
      role: 'user',
      content: {
        type: 'text',
        text: `Please provide a comprehensive analysis of token: ${tokenMint}

Include:
1. Basic token information (name, symbol, supply)
2. Current price and 24h change
3. Liquidity analysis across DEXs
4. Top holders and distribution
5. Trading volume history
6. Slippage estimates for various trade sizes
7. Overall assessment for trading suitability`,
      },
    },
  ];
}

function getCampaignOptimizationMessages(campaignId: string): PromptMessage[] {
  return [
    {
      role: 'user',
      content: {
        type: 'text',
        text: `Generate an optimization report for campaign: ${campaignId}

Please analyze:
1. Current campaign metrics vs targets
2. Bot performance breakdown
3. Cost efficiency analysis
4. Recommendations for improving performance
5. Risk assessment and mitigation suggestions`,
      },
    },
  ];
}
