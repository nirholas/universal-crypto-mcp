/**
 * @universal-crypto-mcp/agent-defi
 * 
 * DeFi-focused AI agents for portfolio management, yield optimization,
 * trading, and blockchain automation.
 */

import { VERSION } from '@universal-crypto-mcp/core';

// ============================================================================
// Agent Types
// ============================================================================

export interface DeFiAgentConfig {
  name: string;
  chains: string[];
  protocols?: string[];
  capabilities?: DeFiCapability[];
}

export type DeFiCapability = 
  | 'swap'
  | 'bridge'
  | 'lend'
  | 'borrow'
  | 'stake'
  | 'yield'
  | 'portfolio'
  | 'analytics';

// ============================================================================
// DeFi Agent Class
// ============================================================================

export class DeFiAgent {
  private config: DeFiAgentConfig;

  constructor(config: DeFiAgentConfig) {
    this.config = config;
  }

  getName(): string {
    return this.config.name;
  }

  getChains(): string[] {
    return this.config.chains;
  }

  getProtocols(): string[] {
    return this.config.protocols ?? [];
  }

  getCapabilities(): DeFiCapability[] {
    return this.config.capabilities ?? [];
  }

  hasCapability(capability: DeFiCapability): boolean {
    return this.getCapabilities().includes(capability);
  }

  getCoreVersion(): string {
    return VERSION;
  }
}

// ============================================================================
// Factory Functions
// ============================================================================

export function createDeFiAgent(config: DeFiAgentConfig): DeFiAgent {
  return new DeFiAgent(config);
}

export function createYieldAgent(name: string, chains: string[]): DeFiAgent {
  return new DeFiAgent({
    name,
    chains,
    capabilities: ['yield', 'stake', 'lend', 'analytics'],
  });
}

export function createTradingAgent(name: string, chains: string[]): DeFiAgent {
  return new DeFiAgent({
    name,
    chains,
    capabilities: ['swap', 'bridge', 'analytics'],
  });
}

export function createPortfolioAgent(name: string, chains: string[]): DeFiAgent {
  return new DeFiAgent({
    name,
    chains,
    capabilities: ['portfolio', 'analytics', 'swap', 'bridge'],
  });
}

// Export version
export const PACKAGE_VERSION = '1.0.0';
export const PACKAGE_NAME = '@universal-crypto-mcp/agent-defi';
