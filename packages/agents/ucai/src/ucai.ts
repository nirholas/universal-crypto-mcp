/**
 * UCAI - Universal Crypto AI Implementation
 */

import { VERSION } from '@universal-crypto-mcp/core';

export interface UCAIConfig {
  name: string;
  chains: string[];
  capabilities?: string[];
}

export class UCAIAgent {
  private config: UCAIConfig;

  constructor(config: UCAIConfig) {
    this.config = config;
  }

  getName(): string {
    return this.config.name;
  }

  getChains(): string[] {
    return this.config.chains;
  }

  getCapabilities(): string[] {
    return this.config.capabilities ?? [];
  }

  getCoreVersion(): string {
    return VERSION;
  }
}

export function createUCAI(config: UCAIConfig): UCAIAgent {
  return new UCAIAgent(config);
}
