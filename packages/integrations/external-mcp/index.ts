/**
 * Universal Crypto MCP - External MCP Servers Index
 * 
 * This file exports all 20+ integrated MCP servers for crypto/blockchain operations.
 * 
 * Author: Nich (@nichxbt) - x.com/nichxbt
 * GitHub: github.com/nirholas
 */

// Solana & DeFi (Ranks 21-27)
export { SolanaAgentKit, registerSolanaAgentKit } from "./solana-agent-kit/src/index.js";
export { CryptoPriceOracle, registerCryptoPriceOracle } from "./crypto-price-oracle/src/index.js";
export { DeFiLlamaClient, registerDeFiLlama } from "./defillama-mcp/src/index.js";
export { CoinGeckoEnhanced, registerCoinGeckoEnhanced } from "./coingecko-enhanced-mcp/src/index.js";
export { DuneAnalytics, registerDuneAnalytics } from "./dune-analytics-mcp/src/index.js";
export { NansenClient, registerNansen } from "./nansen-mcp/src/index.js";
export { ArkhamIntelligence, registerArkham } from "./arkham-intelligence-mcp/src/index.js";

// Block Explorers (Ranks 28-34)
export { EtherscanAdvanced, registerEtherscanAdvanced } from "./etherscan-advanced-mcp/src/index.js";
export { PolygonScan, registerPolygonScan } from "./polygonscan-mcp/src/index.js";
export { BscScan, registerBscScan } from "./bscscan-mcp/src/index.js";
export { ArbitrumScan, registerArbitrumScan } from "./arbitrum-scan-mcp/src/index.js";
export { OptimismScan, registerOptimismScan } from "./optimism-scan-mcp/src/index.js";
export { BaseScan, registerBaseScan } from "./base-scan-mcp/src/index.js";
export { AvalancheExplorer, registerAvalancheExplorer } from "./avalanche-explorer-mcp/src/index.js";

// L1 Chains (Ranks 35-40)
export { CosmosHub, registerCosmosHub } from "./cosmos-hub-mcp/src/index.js";
export { NearProtocol, registerNearProtocol } from "./near-protocol-mcp/src/index.js";
export { Aptos, registerAptos } from "./aptos-mcp/src/index.js";
export { SuiNetwork, registerSuiNetwork } from "./sui-network-mcp/src/index.js";
export { Polkadot, registerPolkadot } from "./polkadot-mcp/src/index.js";
export { Cardano, registerCardano } from "./cardano-mcp/src/index.js";

// Shared utilities
export { BaseBlockExplorer, registerBaseExplorer } from "./shared/base-explorer.js";

// Existing servers
export { default as RugChecker } from "./rugcheck-mcp/src/index.js";
export { default as WhaleWatcher } from "./whale-watcher-mcp/src/index.js";
export { default as DexAggregator } from "./dex-aggregator-mcp/src/index.js";
export { default as TokenTracker } from "./token-tracker-mcp/src/index.js";
export { default as Web3MCP } from "./web3-mcp/src/index.js";

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

/**
 * Register all external MCP servers with a single function
 */
export function registerAllExternalServers(server: McpServer) {
  // Solana & DeFi
  const { registerSolanaAgentKit } = require("./solana-agent-kit/src/index.js");
  const { registerCryptoPriceOracle } = require("./crypto-price-oracle/src/index.js");
  const { registerDeFiLlama } = require("./defillama-mcp/src/index.js");
  const { registerCoinGeckoEnhanced } = require("./coingecko-enhanced-mcp/src/index.js");
  const { registerDuneAnalytics } = require("./dune-analytics-mcp/src/index.js");
  const { registerNansen } = require("./nansen-mcp/src/index.js");
  const { registerArkham } = require("./arkham-intelligence-mcp/src/index.js");

  // Block Explorers
  const { registerEtherscanAdvanced } = require("./etherscan-advanced-mcp/src/index.js");
  const { registerPolygonScan } = require("./polygonscan-mcp/src/index.js");
  const { registerBscScan } = require("./bscscan-mcp/src/index.js");
  const { registerArbitrumScan } = require("./arbitrum-scan-mcp/src/index.js");
  const { registerOptimismScan } = require("./optimism-scan-mcp/src/index.js");
  const { registerBaseScan } = require("./base-scan-mcp/src/index.js");
  const { registerAvalancheExplorer } = require("./avalanche-explorer-mcp/src/index.js");

  // L1 Chains
  const { registerCosmosHub } = require("./cosmos-hub-mcp/src/index.js");
  const { registerNearProtocol } = require("./near-protocol-mcp/src/index.js");
  const { registerAptos } = require("./aptos-mcp/src/index.js");
  const { registerSuiNetwork } = require("./sui-network-mcp/src/index.js");
  const { registerPolkadot } = require("./polkadot-mcp/src/index.js");
  const { registerCardano } = require("./cardano-mcp/src/index.js");

  // Register all
  registerSolanaAgentKit(server);
  registerCryptoPriceOracle(server);
  registerDeFiLlama(server);
  registerCoinGeckoEnhanced(server);
  registerDuneAnalytics(server);
  registerNansen(server);
  registerArkham(server);
  registerEtherscanAdvanced(server);
  registerPolygonScan(server);
  registerBscScan(server);
  registerArbitrumScan(server);
  registerOptimismScan(server);
  registerBaseScan(server);
  registerAvalancheExplorer(server);
  registerCosmosHub(server);
  registerNearProtocol(server);
  registerAptos(server);
  registerSuiNetwork(server);
  registerPolkadot(server);
  registerCardano(server);

  console.log("✅ All 20 external MCP servers registered!");
}

/**
 * Server categories for selective registration
 */
export const ServerCategories = {
  DEFI: ["solana-agent-kit", "crypto-price-oracle", "defillama-mcp", "coingecko-enhanced-mcp", "dune-analytics-mcp"],
  INTELLIGENCE: ["nansen-mcp", "arkham-intelligence-mcp"],
  EVM_EXPLORERS: ["etherscan-advanced-mcp", "polygonscan-mcp", "bscscan-mcp", "arbitrum-scan-mcp", "optimism-scan-mcp", "base-scan-mcp", "avalanche-explorer-mcp"],
  L1_CHAINS: ["cosmos-hub-mcp", "near-protocol-mcp", "aptos-mcp", "sui-network-mcp", "polkadot-mcp", "cardano-mcp"]
};
