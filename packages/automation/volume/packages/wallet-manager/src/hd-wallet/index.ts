/**
 * HD Wallet Module
 * Exports all HD wallet functionality
 */

export {
  generateMnemonic,
  validateMnemonic,
  mnemonicToSeed,
  mnemonicToEntropy,
  entropyToMnemonic,
  getWordCount,
  normalizeMnemonic,
} from './mnemonic.js';

export {
  SOLANA_COIN_TYPE,
  SOLANA_DERIVATION_PATH_TEMPLATE,
  buildDerivationPath,
  deriveKeypair,
  deriveKeypairBatch,
  getPublicKeyFromSecretKey,
  validateSolanaAddress,
  createDerivedWallet,
} from './derivation.js';

export {
  hdWalletFactory,
  HDWalletFactoryImpl,
} from './factory.js';
