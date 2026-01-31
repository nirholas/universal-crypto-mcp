/**
 * MCP Server Manager
 * 
 * Manages lifecycle and communication with MCP servers via stdio
 * 
 * @author nirholas (Nich)
 * @license Apache-2.0
 */

import { spawn, ChildProcess } from 'child_process';
import { EventEmitter } from 'events';
import { Logger } from './logger.js';

// ============================================================================
// Types
// ============================================================================

export interface MCPServerConfig {
  id: string;
  name: string;
  category: string;
  command: string;
  args: string[];
  cwd?: string;
  env?: Record<string, string>;
  autoRestart?: boolean;
}

export interface MCPTool {
  name: string;
  description: string;
  inputSchema: {
    type: string;
    properties: Record<string, unknown>;
    required?: string[];
  };
}

export interface MCPServerInfo {
  id: string;
  name: string;
  version: string;
  tools: MCPTool[];
  status: 'running' | 'stopped' | 'error';
  pid?: number;
}

// ============================================================================
// MCP Server Instance
// ============================================================================

class MCPServerInstance extends EventEmitter {
  private config: MCPServerConfig;
  private process: ChildProcess | null = null;
  private logger: Logger;
  private requestId = 0;
  private pendingRequests = new Map<number, { resolve: (value: unknown) => void; reject: (error: Error) => void }>();
  private serverInfo: MCPServerInfo | null = null;
  private buffer = '';

  constructor(config: MCPServerConfig, logger: Logger) {
    super();
    this.config = config;
    this.logger = logger.child({ component: 'MCPServer', serverId: config.id });
  }

  async start(): Promise<void> {
    if (this.process) {
      throw new Error(`Server ${this.config.id} is already running`);
    }

    this.logger.info(`Starting MCP server: ${this.config.name}`);

    this.process = spawn(this.config.command, this.config.args, {
      cwd: this.config.cwd,
      env: { ...process.env, ...this.config.env },
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    if (!this.process.stdout || !this.process.stdin) {
      throw new Error('Failed to create stdio pipes');
    }

    // Handle stdout (MCP protocol messages)
    this.process.stdout.on('data', (data: Buffer) => {
      this.handleStdout(data.toString());
    });

    // Handle stderr (logs)
    this.process.stderr?.on('data', (data: Buffer) => {
      this.logger.debug(`[${this.config.id} stderr]`, data.toString().trim());
    });

    // Handle process exit
    this.process.on('exit', (code) => {
      this.logger.warn(`Server ${this.config.id} exited with code ${code}`);
      this.process = null;
      
      if (this.config.autoRestart && code !== 0) {
        this.logger.info(`Auto-restarting ${this.config.id}...`);
        setTimeout(() => this.start(), 5000);
      }
      
      this.emit('exit', code);
    });

    this.process.on('error', (error) => {
      this.logger.error(`Server ${this.config.id} error:`, error);
      this.emit('error', error);
    });

    // Initialize the server
    await this.initialize();
  }

  async stop(): Promise<void> {
    if (!this.process) {
      return;
    }

    this.logger.info(`Stopping MCP server: ${this.config.name}`);
    this.process.kill('SIGTERM');
    this.process = null;
    this.serverInfo = null;
  }

  private handleStdout(data: string): void {
    this.buffer += data;
    const lines = this.buffer.split('\n');
    this.buffer = lines.pop() || '';

    for (const line of lines) {
      if (!line.trim()) continue;
      
      try {
        const message = JSON.parse(line);
        this.handleMessage(message);
      } catch (error) {
        this.logger.debug(`Non-JSON output from ${this.config.id}:`, line);
      }
    }
  }

  private handleMessage(message: any): void {
    if ('id' in message && this.pendingRequests.has(message.id)) {
      const pending = this.pendingRequests.get(message.id)!;
      this.pendingRequests.delete(message.id);

      if ('error' in message) {
        pending.reject(new Error(message.error.message || 'MCP error'));
      } else {
        pending.resolve(message.result);
      }
    } else {
      // Notification or other message
      this.emit('message', message);
    }
  }

  private async sendRequest(method: string, params?: unknown): Promise<any> {
    if (!this.process || !this.process.stdin) {
      throw new Error(`Server ${this.config.id} is not running`);
    }

    const id = ++this.requestId;
    const request = {
      jsonrpc: '2.0',
      id,
      method,
      params: params || {},
    };

    return new Promise((resolve, reject) => {
      this.pendingRequests.set(id, { resolve, reject });

      const timeout = setTimeout(() => {
        if (this.pendingRequests.has(id)) {
          this.pendingRequests.delete(id);
          reject(new Error(`Request timeout for ${method}`));
        }
      }, 30000);

      this.process!.stdin!.write(JSON.stringify(request) + '\n', (error) => {
        if (error) {
          clearTimeout(timeout);
          this.pendingRequests.delete(id);
          reject(error);
        }
      });
    });
  }

  private async initialize(): Promise<void> {
    try {
      const initResult = await this.sendRequest('initialize', {
        protocolVersion: '1.0',
        capabilities: {},
        clientInfo: {
          name: 'universal-crypto-mcp-gateway',
          version: '1.0.0',
        },
      });

      this.serverInfo = {
        id: this.config.id,
        name: initResult.serverInfo?.name || this.config.name,
        version: initResult.serverInfo?.version || '1.0.0',
        tools: [],
        status: 'running',
        pid: this.process?.pid,
      };

      // Get available tools
      const toolsResult = await this.sendRequest('tools/list');
      this.serverInfo.tools = toolsResult.tools || [];

      this.logger.info(`Initialized ${this.config.name} with ${this.serverInfo.tools.length} tools`);
    } catch (error) {
      this.logger.error(`Failed to initialize ${this.config.id}:`, error as Error);
      throw error;
    }
  }

  async callTool(name: string, args: unknown): Promise<any> {
    return this.sendRequest('tools/call', { name, arguments: args });
  }

  async listTools(): Promise<MCPTool[]> {
    if (this.serverInfo) {
      return this.serverInfo.tools;
    }
    const result = await this.sendRequest('tools/list');
    return result.tools || [];
  }

  getInfo(): MCPServerInfo | null {
    return this.serverInfo;
  }
}

// ============================================================================
// MCP Manager
// ============================================================================

export class MCPManager {
  private servers = new Map<string, MCPServerInstance>();
  private logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger.child({ component: 'MCPManager' });
  }

  registerServer(config: MCPServerConfig): void {
    if (this.servers.has(config.id)) {
      throw new Error(`Server ${config.id} is already registered`);
    }

    const instance = new MCPServerInstance(config, this.logger);
    this.servers.set(config.id, instance);
    this.logger.info(`Registered MCP server: ${config.name}`);
  }

  async startServer(id: string): Promise<void> {
    const server = this.servers.get(id);
    if (!server) {
      throw new Error(`Server ${id} not found`);
    }
    await server.start();
  }

  async stopServer(id: string): Promise<void> {
    const server = this.servers.get(id);
    if (!server) {
      throw new Error(`Server ${id} not found`);
    }
    await server.stop();
  }

  async startAll(): Promise<void> {
    this.logger.info(`Starting ${this.servers.size} MCP servers...`);
    const promises = Array.from(this.servers.values()).map(server => 
      server.start().catch(error => {
        this.logger.error(`Failed to start server:`, error);
      })
    );
    await Promise.all(promises);
    this.logger.info('All MCP servers started');
  }

  async stopAll(): Promise<void> {
    this.logger.info('Stopping all MCP servers...');
    const promises = Array.from(this.servers.values()).map(server => server.stop());
    await Promise.all(promises);
    this.logger.info('All MCP servers stopped');
  }

  async callTool(serverId: string, toolName: string, args: unknown): Promise<any> {
    const server = this.servers.get(serverId);
    if (!server) {
      throw new Error(`Server ${serverId} not found`);
    }
    return server.callTool(toolName, args);
  }

  async listServerTools(serverId: string): Promise<MCPTool[]> {
    const server = this.servers.get(serverId);
    if (!server) {
      throw new Error(`Server ${serverId} not found`);
    }
    return server.listTools();
  }

  async listAllTools(): Promise<{ serverId: string; tools: MCPTool[] }[]> {
    const results: { serverId: string; tools: MCPTool[] }[] = [];
    
    for (const [id, server] of this.servers) {
      try {
        const tools = await server.listTools();
        results.push({ serverId: id, tools });
      } catch (error) {
        this.logger.error(`Failed to list tools for ${id}:`, error as Error);
      }
    }
    
    return results;
  }

  getServerInfo(id: string): MCPServerInfo | null {
    const server = this.servers.get(id);
    return server?.getInfo() || null;
  }

  getAllServerInfo(): MCPServerInfo[] {
    return Array.from(this.servers.values())
      .map(server => server.getInfo())
      .filter((info): info is MCPServerInfo => info !== null);
  }
}

export default MCPManager;
