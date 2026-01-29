/**
 * Protocol Registry for DeFi integrations
 */

import type { DeFiProtocol, Protocol } from "./types.js";

/**
 * Protocol configuration interface
 */
export interface ProtocolConfig {
  name: string;
  displayName: string;
  chains: string[];
  type: "dex" | "lending" | "yield" | "stablecoin";
  website: string;
  docs?: string;
}

/**
 * Registry of supported DeFi protocols
 */
export const PROTOCOL_REGISTRY: Record<Protocol, ProtocolConfig> = {
  uniswap: {
    name: "uniswap",
    displayName: "Uniswap",
    chains: ["ethereum", "polygon", "arbitrum", "optimism", "base"],
    type: "dex",
    website: "https://uniswap.org",
    docs: "https://docs.uniswap.org",
  },
  sushiswap: {
    name: "sushiswap",
    displayName: "SushiSwap",
    chains: ["ethereum", "polygon", "arbitrum", "avalanche", "fantom"],
    type: "dex",
    website: "https://sushi.com",
    docs: "https://docs.sushi.com",
  },
  curve: {
    name: "curve",
    displayName: "Curve Finance",
    chains: ["ethereum", "polygon", "arbitrum", "optimism", "avalanche"],
    type: "dex",
    website: "https://curve.fi",
    docs: "https://curve.readthedocs.io",
  },
  aave: {
    name: "aave",
    displayName: "Aave",
    chains: ["ethereum", "polygon", "arbitrum", "optimism", "avalanche"],
    type: "lending",
    website: "https://aave.com",
    docs: "https://docs.aave.com",
  },
  compound: {
    name: "compound",
    displayName: "Compound",
    chains: ["ethereum", "polygon", "arbitrum", "base"],
    type: "lending",
    website: "https://compound.finance",
    docs: "https://docs.compound.finance",
  },
  sperax: {
    name: "sperax",
    displayName: "Sperax",
    chains: ["arbitrum"],
    type: "stablecoin",
    website: "https://sperax.io",
    docs: "https://docs.sperax.io",
  },
  pancakeswap: {
    name: "pancakeswap",
    displayName: "PancakeSwap",
    chains: ["bsc", "ethereum", "arbitrum", "base"],
    type: "dex",
    website: "https://pancakeswap.finance",
    docs: "https://docs.pancakeswap.finance",
  },
};

/**
 * Get protocols by chain
 */
export function getProtocolsByChain(chain: string): ProtocolConfig[] {
  return Object.values(PROTOCOL_REGISTRY).filter((p) =>
    p.chains.includes(chain.toLowerCase())
  );
}

/**
 * Get protocols by type
 */
export function getProtocolsByType(
  type: "dex" | "lending" | "yield" | "stablecoin"
): ProtocolConfig[] {
  return Object.values(PROTOCOL_REGISTRY).filter((p) => p.type === type);
}

/**
 * Protocol adapter registry for runtime protocol instances
 */
const protocolAdapters = new Map<Protocol, DeFiProtocol>();

/**
 * Register a protocol adapter
 */
export function registerProtocol(
  protocol: Protocol,
  adapter: DeFiProtocol
): void {
  protocolAdapters.set(protocol, adapter);
}

/**
 * Get a registered protocol adapter
 */
export function getProtocol(protocol: Protocol): DeFiProtocol | undefined {
  return protocolAdapters.get(protocol);
}

/**
 * Get all registered protocol adapters
 */
export function getAllProtocols(): Map<Protocol, DeFiProtocol> {
  return new Map(protocolAdapters);
}
