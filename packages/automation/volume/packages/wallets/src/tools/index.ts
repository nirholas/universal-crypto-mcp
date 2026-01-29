/**
 * Tools index - export all wallet tools
 */

export {
  getWalletPortfolio,
  getWalletPortfolioDefinition,
  getWalletPortfolioSchema,
  type GetWalletPortfolioInput,
  type GetWalletPortfolioOutput,
} from './getWalletPortfolio';

export {
  getTokenBalances,
  getTokenBalancesDefinition,
  getTokenBalancesSchema,
  type GetTokenBalancesInput,
  type GetTokenBalancesOutput,
} from './getTokenBalances';

export {
  getNFTs,
  getNFTsDefinition,
  getNFTsSchema,
  type GetNFTsInput,
  type GetNFTsOutput,
} from './getNFTs';

export {
  getDeFiPositions,
  getDeFiPositionsDefinition,
  getDeFiPositionsSchema,
  type GetDeFiPositionsInput,
  type GetDeFiPositionsOutput,
} from './getDeFiPositions';

export {
  getApprovals,
  getApprovalsDefinition,
  getApprovalsSchema,
  type GetApprovalsInput,
  type GetApprovalsOutput,
} from './getApprovals';

export {
  getWalletHistory,
  getWalletHistorySchema,
  getWalletHistoryDefinition,
} from './getWalletHistory';

export {
  resolveENS,
  resolveENSSchema,
  resolveENSDefinition,
} from './resolveENS';

// All tool definitions for registration
export const walletToolDefinitions = [
  { definition: require('./getWalletPortfolio').getWalletPortfolioDefinition, handler: require('./getWalletPortfolio').getWalletPortfolio },
  { definition: require('./getTokenBalances').getTokenBalancesDefinition, handler: require('./getTokenBalances').getTokenBalances },
  { definition: require('./getNFTs').getNFTsDefinition, handler: require('./getNFTs').getNFTs },
  { definition: require('./getDeFiPositions').getDeFiPositionsDefinition, handler: require('./getDeFiPositions').getDeFiPositions },
  { definition: require('./getApprovals').getApprovalsDefinition, handler: require('./getApprovals').getApprovals },
  { definition: { name: 'getWalletHistory', schema: require('./getWalletHistory').getWalletHistorySchema }, handler: require('./getWalletHistory').getWalletHistory },
  { definition: { name: 'resolveENS', schema: require('./resolveENS').resolveENSSchema }, handler: require('./resolveENS').resolveENS },
];
