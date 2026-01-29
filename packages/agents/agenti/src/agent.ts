/**
 * Agenti Agent Implementation
 */

import { VERSION } from '@universal-crypto-mcp/core';

export interface AgentConfig {
  name: string;
  description?: string;
}

export class Agent {
  private config: AgentConfig;

  constructor(config: AgentConfig) {
    this.config = config;
  }

  getName(): string {
    return this.config.name;
  }

  getDescription(): string {
    return this.config.description ?? 'No description';
  }

  getCoreVersion(): string {
    return VERSION;
  }
}

export function createAgent(config: AgentConfig): Agent {
  return new Agent(config);
}
