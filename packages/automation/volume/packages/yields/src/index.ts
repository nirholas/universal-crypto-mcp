/**
 * @boosty/mcp-yields
 * MCP server for DeFi yield discovery and comparison
 */

// Server
export { createYieldsServer, YieldsServer } from './server';

// Tools
export { getTopYields, getTopYieldsDefinition } from './tools/getTopYields';
export { getPoolDetails, getPoolDetailsDefinition } from './tools/getPoolDetails';
export { getYieldHistory, getYieldHistoryDefinition } from './tools/getYieldHistory';
export { compareYields, compareYieldsDefinition } from './tools/compareYields';
export { getStablecoinYields, getStablecoinYieldsDefinition } from './tools/getStablecoinYields';
export { getLPYields, getLPYieldsDefinition } from './tools/getLPYields';
export { estimateReturns, estimateReturnsDefinition } from './tools/estimateReturns';
export { getRiskAssessment, getRiskAssessmentDefinition } from './tools/getRiskAssessment';

// APIs
export { DefiLlamaClient } from './apis/defillama';

// Utils
export { calculateRiskScore, RiskFactors, RiskAssessment } from './utils/risk';

// Types
export * from './types';
