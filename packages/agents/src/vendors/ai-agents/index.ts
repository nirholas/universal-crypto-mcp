/**
 * ai-agents Implementation
 *
 * Universal agent framework supporting EVM and Solana wallet providers
 * with tool execution, memory persistence, and multi-provider support.
 */

import type { Address, PublicClient, WalletClient } from 'viem';
import type { Connection, PublicKey, Transaction } from '@solana/web3.js';

export * from './types';

// ============================================================
// Types
// ============================================================

interface AgentConfig {
  name: string;
  description?: string;
  model?: string;
  systemPrompt?: string;
  tools?: Tool[];
  memory?: MemoryStore;
  maxIterations?: number;
  verbose?: boolean;
}

interface ToolResult {
  success: boolean;
  data?: unknown;
  error?: string;
}

interface Message {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  toolCallId?: string;
  name?: string;
}

interface AgentContext {
  messages: Message[];
  toolResults: Map<string, ToolResult>;
  metadata: Record<string, unknown>;
}

// ============================================================
// Memory Store
// ============================================================

export interface MemoryStore {
  get(key: string): Promise<unknown | null>;
  set(key: string, value: unknown): Promise<void>;
  delete(key: string): Promise<void>;
  list(prefix?: string): Promise<string[]>;
  clear(): Promise<void>;
}

export class InMemoryStore implements MemoryStore {
  private store = new Map<string, unknown>();

  async get(key: string): Promise<unknown | null> {
    return this.store.get(key) ?? null;
  }

  async set(key: string, value: unknown): Promise<void> {
    this.store.set(key, value);
  }

  async delete(key: string): Promise<void> {
    this.store.delete(key);
  }

  async list(prefix?: string): Promise<string[]> {
    const keys = Array.from(this.store.keys());
    return prefix ? keys.filter(k => k.startsWith(prefix)) : keys;
  }

  async clear(): Promise<void> {
    this.store.clear();
  }
}

export class LocalFilesystemMemoryTool implements MemoryStore {
  private basePath: string;
  private fs: typeof import('fs/promises') | null = null;

  constructor(basePath: string = './.agent-memory') {
    this.basePath = basePath;
  }

  private async ensureFs(): Promise<typeof import('fs/promises')> {
    if (!this.fs) {
      this.fs = await import('fs/promises');
      await this.fs.mkdir(this.basePath, { recursive: true });
    }
    return this.fs;
  }

  private keyToPath(key: string): string {
    const safeKey = key.replace(/[^a-zA-Z0-9-_]/g, '_');
    return `${this.basePath}/${safeKey}.json`;
  }

  async get(key: string): Promise<unknown | null> {
    const fs = await this.ensureFs();
    try {
      const data = await fs.readFile(this.keyToPath(key), 'utf-8');
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  async set(key: string, value: unknown): Promise<void> {
    const fs = await this.ensureFs();
    await fs.writeFile(this.keyToPath(key), JSON.stringify(value, null, 2));
  }

  async delete(key: string): Promise<void> {
    const fs = await this.ensureFs();
    try {
      await fs.unlink(this.keyToPath(key));
    } catch {
      // File may not exist
    }
  }

  async list(prefix?: string): Promise<string[]> {
    const fs = await this.ensureFs();
    const files = await fs.readdir(this.basePath);
    const keys = files.filter(f => f.endsWith('.json')).map(f => f.slice(0, -5));
    return prefix ? keys.filter(k => k.startsWith(prefix)) : keys;
  }

  async clear(): Promise<void> {
    const fs = await this.ensureFs();
    const files = await fs.readdir(this.basePath);
    await Promise.all(files.map(f => fs.unlink(`${this.basePath}/${f}`)));
  }
}

// ============================================================
// Tool System
// ============================================================

export interface Tool<TInput = unknown, TOutput = unknown> {
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, { type: string; description?: string }>;
    required?: string[];
  };
  execute: (input: TInput) => Promise<TOutput>;
}

export function createTool<TInput = unknown, TOutput = unknown>(config: {
  name: string;
  description: string;
  parameters: Tool['parameters'];
  execute: (input: TInput) => Promise<TOutput>;
}): Tool<TInput, TOutput> {
  return {
    name: config.name,
    description: config.description,
    parameters: config.parameters,
    execute: config.execute,
  };
}

// Alias for compatibility
export const Tool = createTool;

// ============================================================
// Character System (Eliza-style)
// ============================================================

export interface Character {
  name: string;
  bio: string;
  traits: string[];
  exampleDialogue?: Array<{ user: string; assistant: string }>;
  knowledge?: string[];
  systemPrompt?: string;
}

export function createCharacter(config: Character): Character {
  return {
    ...config,
    systemPrompt:
      config.systemPrompt ||
      `You are ${config.name}. ${config.bio}\n\nTraits: ${config.traits.join(', ')}`,
  };
}

// Alias for compatibility
export const Character = createCharacter;

// ============================================================
// Memory (Conversation History)
// ============================================================

export interface ConversationMemory {
  messages: Message[];
  summary?: string;
  metadata: Record<string, unknown>;
}

export function createMemory(): ConversationMemory {
  return {
    messages: [],
    metadata: {},
  };
}

// Alias for compatibility
export const Memory = createMemory;

// ============================================================
// Wallet Providers
// ============================================================

export interface WalletProvider {
  getAddress(): Promise<string>;
  getNetwork(): Promise<{ chainId: number; name: string }>;
  signMessage(message: string): Promise<string>;
}

export abstract class EvmWalletProvider implements WalletProvider {
  protected publicClient: PublicClient;
  protected walletClient: WalletClient;
  protected address: Address;

  constructor(publicClient: PublicClient, walletClient: WalletClient, address: Address) {
    this.publicClient = publicClient;
    this.walletClient = walletClient;
    this.address = address;
  }

  async getAddress(): Promise<string> {
    return this.address;
  }

  async getNetwork(): Promise<{ chainId: number; name: string }> {
    const chainId = await this.publicClient.getChainId();
    return { chainId, name: this.publicClient.chain?.name || 'Unknown' };
  }

  async signMessage(message: string): Promise<string> {
    return this.walletClient.signMessage({
      account: this.address,
      message,
    });
  }

  async sendTransaction(params: { to: Address; value?: bigint; data?: `0x${string}` }): Promise<`0x${string}`> {
    const hash = await this.walletClient.sendTransaction({
      account: this.address,
      to: params.to,
      value: params.value,
      data: params.data,
      chain: this.walletClient.chain,
    });
    return hash;
  }

  async readContract(params: { address: Address; abi: unknown[]; functionName: string; args?: unknown[] }): Promise<unknown> {
    return this.publicClient.readContract(params as Parameters<PublicClient['readContract']>[0]);
  }
}

export abstract class SvmWalletProvider implements WalletProvider {
  protected connection: Connection;
  protected publicKey: PublicKey;

  constructor(connection: Connection, publicKey: PublicKey) {
    this.connection = connection;
    this.publicKey = publicKey;
  }

  async getAddress(): Promise<string> {
    return this.publicKey.toString();
  }

  async getNetwork(): Promise<{ chainId: number; name: string }> {
    const genesisHash = await this.connection.getGenesisHash();
    // Mainnet genesis hash
    if (genesisHash === '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d') {
      return { chainId: 101, name: 'Solana Mainnet' };
    }
    // Devnet
    if (genesisHash === 'EtWTRABZaYq6iMfeYKouRu166VU2xqa1wcaWoxPkrZBG') {
      return { chainId: 102, name: 'Solana Devnet' };
    }
    return { chainId: 103, name: 'Solana Testnet' };
  }

  abstract signMessage(message: string): Promise<string>;
  abstract signTransaction(tx: Transaction): Promise<Transaction>;
}

// ============================================================
// Action Provider System
// ============================================================

export abstract class ActionProvider<TWalletProvider extends WalletProvider = WalletProvider> {
  abstract name: string;
  abstract description: string;

  protected walletProvider?: TWalletProvider;

  setWalletProvider(provider: TWalletProvider): void {
    this.walletProvider = provider;
  }

  abstract getActions(): Tool[];
}

export class CustomActionProvider<TWalletProvider extends WalletProvider> extends ActionProvider<TWalletProvider> {
  name: string;
  description: string;
  private tools: Tool[];

  constructor(config: { name: string; description: string; tools: Tool[] }) {
    super();
    this.name = config.name;
    this.description = config.description;
    this.tools = config.tools;
  }

  getActions(): Tool[] {
    return this.tools;
  }
}

// ============================================================
// AgentKit (Unified Agent Toolkit)
// ============================================================

export interface AgentKitConfig {
  name: string;
  walletProvider?: WalletProvider;
  actionProviders?: ActionProvider[];
  memory?: MemoryStore;
}

export class AgentKit {
  private config: AgentKitConfig;
  private tools: Tool[] = [];

  constructor(config: AgentKitConfig) {
    this.config = config;

    // Collect all tools from action providers
    if (config.actionProviders) {
      for (const provider of config.actionProviders) {
        if (config.walletProvider) {
          provider.setWalletProvider(config.walletProvider);
        }
        this.tools.push(...provider.getActions());
      }
    }
  }

  static async create(config: AgentKitConfig): Promise<AgentKit> {
    return new AgentKit(config);
  }

  getTools(): Tool[] {
    return this.tools;
  }

  async getWalletAddress(): Promise<string | null> {
    return this.config.walletProvider?.getAddress() ?? null;
  }

  getMemory(): MemoryStore | undefined {
    return this.config.memory;
  }
}

// ============================================================
// Agent Runtime
// ============================================================

export class AgentRuntime {
  private config: AgentConfig;
  private context: AgentContext;
  private memory: MemoryStore;
  private tools: Map<string, Tool>;

  constructor(config: AgentConfig) {
    this.config = config;
    this.memory = config.memory || new InMemoryStore();
    this.tools = new Map();
    this.context = {
      messages: [],
      toolResults: new Map(),
      metadata: {},
    };

    // Register tools
    if (config.tools) {
      for (const tool of config.tools) {
        this.tools.set(tool.name, tool);
      }
    }

    // Add system prompt
    if (config.systemPrompt) {
      this.context.messages.push({
        role: 'system',
        content: config.systemPrompt,
      });
    }
  }

  async processMessage(userMessage: string): Promise<string> {
    this.context.messages.push({ role: 'user', content: userMessage });

    // Simple response generation (in production, call LLM API)
    const response = await this.generateResponse();

    this.context.messages.push({ role: 'assistant', content: response });

    return response;
  }

  private async generateResponse(): Promise<string> {
    // Check if we need to call any tools based on the message
    const lastMessage = this.context.messages[this.context.messages.length - 1];

    // Simple keyword-based tool matching (in production, use LLM function calling)
    for (const [name, tool] of this.tools) {
      if (lastMessage.content.toLowerCase().includes(name.toLowerCase())) {
        try {
          const result = await tool.execute({});
          return `Tool ${name} executed: ${JSON.stringify(result)}`;
        } catch (error) {
          return `Tool ${name} failed: ${(error as Error).message}`;
        }
      }
    }

    return `Processed: ${lastMessage.content}`;
  }

  async executeTool(name: string, input: unknown): Promise<ToolResult> {
    const tool = this.tools.get(name);
    if (!tool) {
      return { success: false, error: `Tool not found: ${name}` };
    }

    try {
      const data = await tool.execute(input);
      const result = { success: true, data };
      this.context.toolResults.set(name, result);
      return result;
    } catch (error) {
      const result = { success: false, error: (error as Error).message };
      this.context.toolResults.set(name, result);
      return result;
    }
  }

  getTools(): Tool[] {
    return Array.from(this.tools.values());
  }

  getContext(): AgentContext {
    return this.context;
  }

  getMemory(): MemoryStore {
    return this.memory;
  }
}

// ============================================================
// Agent Factory
// ============================================================

export interface CreateAgentOptions extends AgentConfig {
  character?: Character;
  kit?: AgentKit;
}

export function createAgent(options: CreateAgentOptions): AgentRuntime {
  let systemPrompt = options.systemPrompt || '';

  if (options.character) {
    systemPrompt = options.character.systemPrompt || systemPrompt;
  }

  const tools = [...(options.tools || [])];

  if (options.kit) {
    tools.push(...options.kit.getTools());
  }

  return new AgentRuntime({
    name: options.name,
    description: options.description,
    model: options.model,
    systemPrompt,
    tools,
    memory: options.memory || options.kit?.getMemory(),
    maxIterations: options.maxIterations,
    verbose: options.verbose,
  });
}

// ============================================================
// Main Entry Point
// ============================================================

export async function main(): Promise<void> {
  // Example usage
  const agent = createAgent({
    name: 'CryptoAgent',
    description: 'A crypto-native AI agent',
    systemPrompt: 'You are a helpful crypto assistant.',
    tools: [
      createTool({
        name: 'getBalance',
        description: 'Get wallet balance',
        parameters: {
          type: 'object',
          properties: {
            address: { type: 'string', description: 'Wallet address' },
          },
          required: ['address'],
        },
        execute: async (input: { address: string }) => {
          return { address: input.address, balance: '0' };
        },
      }),
    ],
  });

  const response = await agent.processMessage('Hello!');
  console.log(response);
}
