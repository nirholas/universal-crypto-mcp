'use client';

import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils/cn';
import { McpTool, CodeLanguage, GeneratedCode } from '@/lib/playground/types';
import { SAMPLE_TOOLS, getToolById } from '@/lib/playground/tools-data';
import { TOOL_CATEGORIES } from '@/lib/playground/categories';
import {
  generateCode,
  getAvailableLanguages,
} from '@/lib/playground/code-generator';
import {
  Code2,
  Play,
  Copy,
  Check,
  Download,
  Search,
  ChevronRight,
  ChevronDown,
  Terminal,
  FileCode,
  Book,
  Layers,
  ExternalLink,
  Zap,
} from 'lucide-react';

interface Template {
  id: string;
  name: string;
  description: string;
  language: CodeLanguage;
  category: string;
  code: string;
  toolIds?: string[];
}

// Pre-built templates for common use cases
const PRESET_TEMPLATES: Template[] = [
  {
    id: 'basic-balance-check',
    name: 'Check Wallet Balance',
    description: 'Fetch and display the balance of an Ethereum wallet',
    language: 'typescript',
    category: 'wallets',
    code: `import { McpClient } from '@universal-mcp/sdk';

async function checkBalance(address: string) {
  const client = new McpClient({
    apiKey: process.env.MCP_API_KEY,
  });

  const result = await client.tools.execute('wallet.getBalance', {
    address,
    chain: 'ethereum',
  });

  console.log(\`Balance: \${result.balance} ETH\`);
  return result;
}

// Example usage
checkBalance('0x742d35Cc6634C0532925a3b844Bc9e7595f0bC61');`,
  },
  {
    id: 'multi-chain-portfolio',
    name: 'Multi-Chain Portfolio',
    description: 'Aggregate token balances across multiple chains',
    language: 'typescript',
    category: 'wallets',
    code: `import { McpClient } from '@universal-mcp/sdk';

const CHAINS = ['ethereum', 'polygon', 'arbitrum', 'optimism'];

async function getPortfolio(address: string) {
  const client = new McpClient();
  const balances: Record<string, any> = {};

  for (const chain of CHAINS) {
    try {
      const result = await client.tools.execute('wallet.getTokenBalances', {
        address,
        chain,
      });
      balances[chain] = result.tokens;
    } catch (e) {
      console.warn(\`Failed to fetch \${chain}: \${e}\`);
    }
  }

  return balances;
}`,
  },
  {
    id: 'defi-swap',
    name: 'DEX Token Swap',
    description: 'Execute a token swap on a decentralized exchange',
    language: 'typescript',
    category: 'defi',
    code: `import { McpClient } from '@universal-mcp/sdk';

async function swapTokens({
  fromToken,
  toToken,
  amount,
  slippage = 0.5,
}: {
  fromToken: string;
  toToken: string;
  amount: string;
  slippage?: number;
}) {
  const client = new McpClient();

  // Get quote first
  const quote = await client.tools.execute('dex.getQuote', {
    fromToken,
    toToken,
    amount,
    slippage,
  });

  console.log(\`Quote: \${quote.expectedOutput} \${toToken}\`);
  console.log(\`Price Impact: \${quote.priceImpact}%\`);

  // Execute swap
  const result = await client.tools.execute('dex.swap', {
    ...quote.swapData,
  });

  return result.transactionHash;
}`,
  },
  {
    id: 'nft-collection',
    name: 'NFT Collection Analyzer',
    description: 'Fetch and analyze NFT collection statistics',
    language: 'python',
    category: 'nft',
    code: `from mcp_sdk import McpClient
import json

def analyze_collection(contract_address: str):
    client = McpClient()
    
    # Get collection metadata
    metadata = client.execute(
        "nft.getCollectionMetadata",
        {"contract": contract_address}
    )
    
    # Get floor price history
    floor_history = client.execute(
        "nft.getFloorPriceHistory",
        {"contract": contract_address, "period": "7d"}
    )
    
    # Get top holders
    holders = client.execute(
        "nft.getTopHolders",
        {"contract": contract_address, "limit": 10}
    )
    
    return {
        "name": metadata["name"],
        "total_supply": metadata["totalSupply"],
        "current_floor": floor_history[-1]["price"],
        "floor_change_7d": calculate_change(floor_history),
        "top_holders": holders
    }`,
  },
  {
    id: 'trading-bot-basic',
    name: 'Simple Trading Bot',
    description: 'Basic trading bot with price monitoring',
    language: 'typescript',
    category: 'trading',
    code: `import { McpClient } from '@universal-mcp/sdk';

interface TradingConfig {
  tokenPair: string;
  buyThreshold: number;
  sellThreshold: number;
  amount: string;
}

async function runTradingBot(config: TradingConfig) {
  const client = new McpClient();
  let position: 'none' | 'long' = 'none';

  while (true) {
    const price = await client.tools.execute('market.getPrice', {
      pair: config.tokenPair,
    });

    console.log(\`Current price: \${price.value}\`);

    if (position === 'none' && price.change24h <= -config.buyThreshold) {
      console.log('Buy signal detected!');
      await client.tools.execute('trading.marketBuy', {
        pair: config.tokenPair,
        amount: config.amount,
      });
      position = 'long';
    }

    if (position === 'long' && price.change24h >= config.sellThreshold) {
      console.log('Sell signal detected!');
      await client.tools.execute('trading.marketSell', {
        pair: config.tokenPair,
        amount: config.amount,
      });
      position = 'none';
    }

    await sleep(60000); // Check every minute
  }
}`,
  },
  {
    id: 'gas-tracker',
    name: 'Gas Price Tracker',
    description: 'Monitor gas prices and execute when optimal',
    language: 'typescript',
    category: 'infrastructure',
    code: `import { McpClient } from '@universal-mcp/sdk';

async function waitForGasPrice(targetGwei: number) {
  const client = new McpClient();

  while (true) {
    const gas = await client.tools.execute('network.getGasPrice', {
      chain: 'ethereum',
    });

    console.log(\`Current gas: \${gas.fast} gwei\`);

    if (gas.standard <= targetGwei) {
      console.log('Target gas price reached!');
      return gas;
    }

    await new Promise(r => setTimeout(r, 15000)); // Check every 15s
  }
}

async function executeWithOptimalGas(
  toolId: string,
  params: object,
  maxGwei: number
) {
  await waitForGasPrice(maxGwei);
  
  const client = new McpClient();
  return client.tools.execute(toolId, params);
}`,
  },
];

// Template categories
const TEMPLATE_CATEGORIES = [
  { id: 'all', name: 'All Templates' },
  { id: 'wallets', name: 'Wallets' },
  { id: 'defi', name: 'DeFi' },
  { id: 'nft', name: 'NFT' },
  { id: 'trading', name: 'Trading' },
  { id: 'infrastructure', name: 'Infrastructure' },
];

interface TemplateLibraryProps {
  onSelect: (template: Template) => void;
  selectedId?: string;
}

export function TemplateLibrary({ onSelect, selectedId }: TemplateLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredTemplates = useMemo(() => {
    return PRESET_TEMPLATES.filter(template => {
      const matchesSearch =
        !searchQuery ||
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === 'all' || template.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const getLanguageIcon = (lang: CodeLanguage) => {
    switch (lang) {
      case 'typescript':
      case 'javascript':
        return '🟨';
      case 'python':
        return '🐍';
      case 'rust':
        return '🦀';
      case 'go':
        return '🐹';
      case 'curl':
        return '🌐';
      default:
        return '📄';
    }
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search templates..."
          className="w-full h-10 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-lg focus:border-black focus:ring-0 text-sm"
        />
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {TEMPLATE_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={cn(
              'px-3 py-1.5 text-sm rounded-full transition-colors',
              selectedCategory === cat.id
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Template List */}
      <div className="space-y-2">
        {filteredTemplates.map(template => (
          <div
            key={template.id}
            className={cn(
              'border rounded-xl overflow-hidden transition-colors',
              selectedId === template.id
                ? 'border-black bg-gray-50'
                : 'border-gray-200 hover:border-gray-300'
            )}
          >
            <button
              onClick={() => setExpandedId(expandedId === template.id ? null : template.id)}
              className="w-full flex items-center justify-between p-4 text-left"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{getLanguageIcon(template.language)}</span>
                <div>
                  <h4 className="font-medium text-gray-900">{template.name}</h4>
                  <p className="text-sm text-gray-500">{template.description}</p>
                </div>
              </div>
              {expandedId === template.id ? (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {expandedId === template.id && (
              <div className="px-4 pb-4">
                <pre className="p-4 bg-gray-900 text-gray-100 rounded-lg text-sm overflow-x-auto max-h-64">
                  <code>{template.code}</code>
                </pre>
                <button
                  onClick={() => onSelect(template)}
                  className="mt-3 flex items-center gap-2 px-4 py-2 bg-black text-white font-medium rounded-lg hover:bg-gray-900 transition-colors"
                >
                  <FileCode className="w-4 h-4" />
                  Use Template
                </button>
              </div>
            )}
          </div>
        ))}

        {filteredTemplates.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Layers className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No templates found</p>
          </div>
        )}
      </div>
    </div>
  );
}

// API Reference component
interface APIReferenceProps {
  tools: McpTool[];
  onToolSelect?: (tool: McpTool) => void;
}

export function APIReference({ tools, onToolSelect }: APIReferenceProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedTool, setExpandedTool] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredTools = useMemo(() => {
    if (!searchQuery) return tools;
    const query = searchQuery.toLowerCase();
    return tools.filter(
      tool =>
        tool.name.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query)
    );
  }, [tools, searchQuery]);

  const groupedTools = useMemo(() => {
    const groups: Record<string, McpTool[]> = {};
    for (const tool of filteredTools) {
      const category = tool.category;
      if (!groups[category]) groups[category] = [];
      groups[category].push(tool);
    }
    return groups;
  }, [filteredTools]);

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search API..."
          className="w-full h-10 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-lg focus:border-black focus:ring-0 text-sm"
        />
      </div>

      {/* Grouped Tools */}
      <div className="space-y-6">
        {Object.entries(groupedTools).map(([category, categoryTools]) => {
          const categoryInfo = TOOL_CATEGORIES.find(c => c.id === category);
          return (
            <div key={category}>
              <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase mb-3">
                <span>{categoryInfo?.icon}</span>
                {categoryInfo?.name || category}
              </h3>

              <div className="space-y-2">
                {categoryTools.map(tool => (
                  <div
                    key={tool.id}
                    className="border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <button
                      onClick={() => setExpandedTool(expandedTool === tool.id ? null : tool.id)}
                      className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <code className="text-sm font-mono text-blue-600">{tool.name}</code>
                        <span className="text-xs text-gray-400">
                          {Object.keys((tool.inputSchema?.properties as object) || {}).length} params
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {tool.tags?.slice(0, 2).map(tag => (
                          <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                            {tag}
                          </span>
                        ))}
                        {expandedTool === tool.id ? (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </button>

                    {expandedTool === tool.id && (
                      <div className="p-4 bg-gray-50 border-t border-gray-200">
                        <p className="text-sm text-gray-600 mb-4">{tool.description}</p>

                        {/* Parameters */}
                        {(tool.inputSchema?.properties as object) && (
                          <div className="mb-4">
                            <h5 className="text-xs font-semibold text-gray-700 uppercase mb-2">
                              Parameters
                            </h5>
                            <div className="space-y-2">
                              {Object.entries((tool.inputSchema?.properties as Record<string, any>) || {}).map(
                                ([key, prop]) => (
                                  <div
                                    key={key}
                                    className="flex items-start gap-3 text-sm"
                                  >
                                    <code className="font-mono text-purple-600">{key}</code>
                                    <span className="text-gray-400">:</span>
                                    <span className="text-gray-600">{prop.type}</span>
                                    {(tool.inputSchema?.required as string[])?.includes(key) && (
                                      <span className="text-red-500 text-xs">required</span>
                                    )}
                                    {prop.description && (
                                      <span className="text-gray-500 text-xs">
                                        — {prop.description}
                                      </span>
                                    )}
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )}

                        {/* Quick Example */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="text-xs font-semibold text-gray-700 uppercase">
                              Quick Example
                            </h5>
                            <button
                              onClick={() => copyToClipboard(
                                `client.execute('${tool.name}', ${JSON.stringify(
                                  Object.fromEntries(
                                    Object.keys((tool.inputSchema?.properties as object) || {}).map(k => [k, '...'])
                                  ),
                                  null,
                                  2
                                )})`,
                                tool.id
                              )}
                              className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700"
                            >
                              {copiedId === tool.id ? (
                                <Check className="w-3 h-3" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                              Copy
                            </button>
                          </div>
                          <pre className="p-3 bg-gray-900 text-gray-100 rounded-lg text-xs font-mono overflow-x-auto">
                            {`client.execute('${tool.name}', {\n${Object.keys(
                              (tool.inputSchema?.properties as object) || {}
                            )
                              .map(k => `  ${k}: ...`)
                              .join(',\n')}\n})`}
                          </pre>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onToolSelect?.(tool)}
                            className="flex items-center gap-2 px-3 py-1.5 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-900 transition-colors"
                          >
                            <Zap className="w-3.5 h-3.5" />
                            Try It
                          </button>
                          <a
                            href={`/tool/${tool.id}`}
                            className="flex items-center gap-1 px-3 py-1.5 text-gray-600 text-sm hover:text-gray-900 transition-colors"
                          >
                            <Book className="w-3.5 h-3.5" />
                            Full Docs
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {Object.keys(groupedTools).length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Book className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No tools found</p>
          </div>
        )}
      </div>
    </div>
  );
}

export { PRESET_TEMPLATES };
export type { Template };
