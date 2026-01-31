/**
 * Network Configurations
 * 
 * 60+ network configurations for multi-chain wallet support
 * 
 * @author Nich (@nichxbt)
 * @license Apache-2.0
 */

import { NetworkConfig } from './types';

// ============================================
// EVM Mainnets
// ============================================

export const ethereum: NetworkConfig = {
  id: 'ethereum',
  chainId: 1,
  name: 'Ethereum',
  shortName: 'ETH',
  family: 'evm',
  type: 'mainnet',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: 'https://eth.llamarpc.com',
    public: 'https://ethereum.publicnode.com',
    wss: 'wss://ethereum.publicnode.com',
  },
  blockExplorers: {
    default: {
      name: 'Etherscan',
      url: 'https://etherscan.io',
    },
  },
  iconUrl: '/icons/chains/ethereum.svg',
  color: '#627EEA',
  contracts: {
    multicall3: '0xcA11bde05977b3631167028862bE2a173976CA11',
    ensRegistry: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
  },
};

export const polygon: NetworkConfig = {
  id: 'polygon',
  chainId: 137,
  name: 'Polygon',
  shortName: 'MATIC',
  family: 'evm',
  type: 'mainnet',
  nativeCurrency: {
    name: 'MATIC',
    symbol: 'MATIC',
    decimals: 18,
  },
  rpcUrls: {
    default: 'https://polygon.llamarpc.com',
    public: 'https://polygon-bor.publicnode.com',
  },
  blockExplorers: {
    default: {
      name: 'PolygonScan',
      url: 'https://polygonscan.com',
    },
  },
  iconUrl: '/icons/chains/polygon.svg',
  color: '#8247E5',
  contracts: {
    multicall3: '0xcA11bde05977b3631167028862bE2a173976CA11',
  },
};

export const arbitrum: NetworkConfig = {
  id: 'arbitrum',
  chainId: 42161,
  name: 'Arbitrum One',
  shortName: 'ARB',
  family: 'evm',
  type: 'l2',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: 'https://arbitrum.llamarpc.com',
    public: 'https://arbitrum-one.publicnode.com',
  },
  blockExplorers: {
    default: {
      name: 'Arbiscan',
      url: 'https://arbiscan.io',
    },
  },
  iconUrl: '/icons/chains/arbitrum.svg',
  color: '#28A0F0',
  contracts: {
    multicall3: '0xcA11bde05977b3631167028862bE2a173976CA11',
  },
};

export const optimism: NetworkConfig = {
  id: 'optimism',
  chainId: 10,
  name: 'Optimism',
  shortName: 'OP',
  family: 'evm',
  type: 'l2',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: 'https://optimism.llamarpc.com',
    public: 'https://optimism.publicnode.com',
  },
  blockExplorers: {
    default: {
      name: 'Optimism Explorer',
      url: 'https://optimistic.etherscan.io',
    },
  },
  iconUrl: '/icons/chains/optimism.svg',
  color: '#FF0420',
  contracts: {
    multicall3: '0xcA11bde05977b3631167028862bE2a173976CA11',
  },
};

export const base: NetworkConfig = {
  id: 'base',
  chainId: 8453,
  name: 'Base',
  shortName: 'BASE',
  family: 'evm',
  type: 'l2',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: 'https://base.llamarpc.com',
    public: 'https://base.publicnode.com',
  },
  blockExplorers: {
    default: {
      name: 'BaseScan',
      url: 'https://basescan.org',
    },
  },
  iconUrl: '/icons/chains/base.svg',
  color: '#0052FF',
  contracts: {
    multicall3: '0xcA11bde05977b3631167028862bE2a173976CA11',
  },
};

export const bsc: NetworkConfig = {
  id: 'bsc',
  chainId: 56,
  name: 'BNB Smart Chain',
  shortName: 'BSC',
  family: 'evm',
  type: 'mainnet',
  nativeCurrency: {
    name: 'BNB',
    symbol: 'BNB',
    decimals: 18,
  },
  rpcUrls: {
    default: 'https://bsc.llamarpc.com',
    public: 'https://bsc.publicnode.com',
  },
  blockExplorers: {
    default: {
      name: 'BscScan',
      url: 'https://bscscan.com',
    },
  },
  iconUrl: '/icons/chains/bsc.svg',
  color: '#F0B90B',
  contracts: {
    multicall3: '0xcA11bde05977b3631167028862bE2a173976CA11',
  },
};

export const avalanche: NetworkConfig = {
  id: 'avalanche',
  chainId: 43114,
  name: 'Avalanche C-Chain',
  shortName: 'AVAX',
  family: 'evm',
  type: 'mainnet',
  nativeCurrency: {
    name: 'Avalanche',
    symbol: 'AVAX',
    decimals: 18,
  },
  rpcUrls: {
    default: 'https://avalanche.llamarpc.com',
    public: 'https://avalanche-c-chain.publicnode.com',
  },
  blockExplorers: {
    default: {
      name: 'SnowTrace',
      url: 'https://snowtrace.io',
    },
  },
  iconUrl: '/icons/chains/avalanche.svg',
  color: '#E84142',
  contracts: {
    multicall3: '0xcA11bde05977b3631167028862bE2a173976CA11',
  },
};

export const fantom: NetworkConfig = {
  id: 'fantom',
  chainId: 250,
  name: 'Fantom',
  shortName: 'FTM',
  family: 'evm',
  type: 'mainnet',
  nativeCurrency: {
    name: 'Fantom',
    symbol: 'FTM',
    decimals: 18,
  },
  rpcUrls: {
    default: 'https://fantom.llamarpc.com',
    public: 'https://fantom.publicnode.com',
  },
  blockExplorers: {
    default: {
      name: 'FTMScan',
      url: 'https://ftmscan.com',
    },
  },
  iconUrl: '/icons/chains/fantom.svg',
  color: '#1969FF',
  contracts: {
    multicall3: '0xcA11bde05977b3631167028862bE2a173976CA11',
  },
};

export const zkSync: NetworkConfig = {
  id: 'zksync',
  chainId: 324,
  name: 'zkSync Era',
  shortName: 'zkSync',
  family: 'evm',
  type: 'l2',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: 'https://mainnet.era.zksync.io',
    public: 'https://zksync.publicnode.com',
  },
  blockExplorers: {
    default: {
      name: 'zkSync Explorer',
      url: 'https://explorer.zksync.io',
    },
  },
  iconUrl: '/icons/chains/zksync.svg',
  color: '#8C8DFC',
};

export const linea: NetworkConfig = {
  id: 'linea',
  chainId: 59144,
  name: 'Linea',
  shortName: 'LINEA',
  family: 'evm',
  type: 'l2',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: 'https://rpc.linea.build',
    public: 'https://linea.publicnode.com',
  },
  blockExplorers: {
    default: {
      name: 'LineaScan',
      url: 'https://lineascan.build',
    },
  },
  iconUrl: '/icons/chains/linea.svg',
  color: '#121212',
};

export const scroll: NetworkConfig = {
  id: 'scroll',
  chainId: 534352,
  name: 'Scroll',
  shortName: 'SCROLL',
  family: 'evm',
  type: 'l2',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: 'https://rpc.scroll.io',
    public: 'https://scroll.publicnode.com',
  },
  blockExplorers: {
    default: {
      name: 'Scrollscan',
      url: 'https://scrollscan.com',
    },
  },
  iconUrl: '/icons/chains/scroll.svg',
  color: '#FFEEDA',
};

export const mantle: NetworkConfig = {
  id: 'mantle',
  chainId: 5000,
  name: 'Mantle',
  shortName: 'MNT',
  family: 'evm',
  type: 'l2',
  nativeCurrency: {
    name: 'Mantle',
    symbol: 'MNT',
    decimals: 18,
  },
  rpcUrls: {
    default: 'https://rpc.mantle.xyz',
    public: 'https://mantle.publicnode.com',
  },
  blockExplorers: {
    default: {
      name: 'Mantle Explorer',
      url: 'https://explorer.mantle.xyz',
    },
  },
  iconUrl: '/icons/chains/mantle.svg',
  color: '#000000',
};

export const gnosis: NetworkConfig = {
  id: 'gnosis',
  chainId: 100,
  name: 'Gnosis',
  shortName: 'GNO',
  family: 'evm',
  type: 'sidechain',
  nativeCurrency: {
    name: 'xDAI',
    symbol: 'xDAI',
    decimals: 18,
  },
  rpcUrls: {
    default: 'https://rpc.gnosischain.com',
    public: 'https://gnosis.publicnode.com',
  },
  blockExplorers: {
    default: {
      name: 'Gnosisscan',
      url: 'https://gnosisscan.io',
    },
  },
  iconUrl: '/icons/chains/gnosis.svg',
  color: '#04795B',
  contracts: {
    multicall3: '0xcA11bde05977b3631167028862bE2a173976CA11',
  },
};

export const celo: NetworkConfig = {
  id: 'celo',
  chainId: 42220,
  name: 'Celo',
  shortName: 'CELO',
  family: 'evm',
  type: 'mainnet',
  nativeCurrency: {
    name: 'CELO',
    symbol: 'CELO',
    decimals: 18,
  },
  rpcUrls: {
    default: 'https://forno.celo.org',
    public: 'https://celo.publicnode.com',
  },
  blockExplorers: {
    default: {
      name: 'Celoscan',
      url: 'https://celoscan.io',
    },
  },
  iconUrl: '/icons/chains/celo.svg',
  color: '#35D07F',
};

export const moonbeam: NetworkConfig = {
  id: 'moonbeam',
  chainId: 1284,
  name: 'Moonbeam',
  shortName: 'GLMR',
  family: 'evm',
  type: 'mainnet',
  nativeCurrency: {
    name: 'Glimmer',
    symbol: 'GLMR',
    decimals: 18,
  },
  rpcUrls: {
    default: 'https://rpc.api.moonbeam.network',
    public: 'https://moonbeam.publicnode.com',
  },
  blockExplorers: {
    default: {
      name: 'Moonscan',
      url: 'https://moonscan.io',
    },
  },
  iconUrl: '/icons/chains/moonbeam.svg',
  color: '#53CBC9',
};

export const moonriver: NetworkConfig = {
  id: 'moonriver',
  chainId: 1285,
  name: 'Moonriver',
  shortName: 'MOVR',
  family: 'evm',
  type: 'mainnet',
  nativeCurrency: {
    name: 'Moonriver',
    symbol: 'MOVR',
    decimals: 18,
  },
  rpcUrls: {
    default: 'https://rpc.api.moonriver.moonbeam.network',
    public: 'https://moonriver.publicnode.com',
  },
  blockExplorers: {
    default: {
      name: 'Moonscan',
      url: 'https://moonriver.moonscan.io',
    },
  },
  iconUrl: '/icons/chains/moonriver.svg',
  color: '#F2B705',
};

export const cronos: NetworkConfig = {
  id: 'cronos',
  chainId: 25,
  name: 'Cronos',
  shortName: 'CRO',
  family: 'evm',
  type: 'mainnet',
  nativeCurrency: {
    name: 'Cronos',
    symbol: 'CRO',
    decimals: 18,
  },
  rpcUrls: {
    default: 'https://evm.cronos.org',
    public: 'https://cronos.publicnode.com',
  },
  blockExplorers: {
    default: {
      name: 'Cronoscan',
      url: 'https://cronoscan.com',
    },
  },
  iconUrl: '/icons/chains/cronos.svg',
  color: '#002D74',
};

export const aurora: NetworkConfig = {
  id: 'aurora',
  chainId: 1313161554,
  name: 'Aurora',
  shortName: 'AURORA',
  family: 'evm',
  type: 'mainnet',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: 'https://mainnet.aurora.dev',
    public: 'https://aurora.publicnode.com',
  },
  blockExplorers: {
    default: {
      name: 'Aurorascan',
      url: 'https://aurorascan.dev',
    },
  },
  iconUrl: '/icons/chains/aurora.svg',
  color: '#78D64B',
};

export const harmony: NetworkConfig = {
  id: 'harmony',
  chainId: 1666600000,
  name: 'Harmony',
  shortName: 'ONE',
  family: 'evm',
  type: 'mainnet',
  nativeCurrency: {
    name: 'ONE',
    symbol: 'ONE',
    decimals: 18,
  },
  rpcUrls: {
    default: 'https://api.harmony.one',
    public: 'https://harmony.publicnode.com',
  },
  blockExplorers: {
    default: {
      name: 'Harmony Explorer',
      url: 'https://explorer.harmony.one',
    },
  },
  iconUrl: '/icons/chains/harmony.svg',
  color: '#00ADE8',
};

export const klaytn: NetworkConfig = {
  id: 'klaytn',
  chainId: 8217,
  name: 'Klaytn',
  shortName: 'KLAY',
  family: 'evm',
  type: 'mainnet',
  nativeCurrency: {
    name: 'KLAY',
    symbol: 'KLAY',
    decimals: 18,
  },
  rpcUrls: {
    default: 'https://public-en-cypress.klaytn.net',
    public: 'https://klaytn.publicnode.com',
  },
  blockExplorers: {
    default: {
      name: 'Klaytnscope',
      url: 'https://scope.klaytn.com',
    },
  },
  iconUrl: '/icons/chains/klaytn.svg',
  color: '#FF3C00',
};

export const metis: NetworkConfig = {
  id: 'metis',
  chainId: 1088,
  name: 'Metis',
  shortName: 'METIS',
  family: 'evm',
  type: 'l2',
  nativeCurrency: {
    name: 'Metis',
    symbol: 'METIS',
    decimals: 18,
  },
  rpcUrls: {
    default: 'https://andromeda.metis.io',
    public: 'https://metis.publicnode.com',
  },
  blockExplorers: {
    default: {
      name: 'Metis Explorer',
      url: 'https://andromeda-explorer.metis.io',
    },
  },
  iconUrl: '/icons/chains/metis.svg',
  color: '#00D2FF',
};

export const polygonZkEvm: NetworkConfig = {
  id: 'polygon-zkevm',
  chainId: 1101,
  name: 'Polygon zkEVM',
  shortName: 'zkEVM',
  family: 'evm',
  type: 'l2',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: 'https://zkevm-rpc.com',
    public: 'https://polygon-zkevm.publicnode.com',
  },
  blockExplorers: {
    default: {
      name: 'PolygonScan',
      url: 'https://zkevm.polygonscan.com',
    },
  },
  iconUrl: '/icons/chains/polygon-zkevm.svg',
  color: '#8247E5',
};

export const blast: NetworkConfig = {
  id: 'blast',
  chainId: 81457,
  name: 'Blast',
  shortName: 'BLAST',
  family: 'evm',
  type: 'l2',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: 'https://rpc.blast.io',
    public: 'https://blast.publicnode.com',
  },
  blockExplorers: {
    default: {
      name: 'Blastscan',
      url: 'https://blastscan.io',
    },
  },
  iconUrl: '/icons/chains/blast.svg',
  color: '#FCFC03',
};

export const mode: NetworkConfig = {
  id: 'mode',
  chainId: 34443,
  name: 'Mode',
  shortName: 'MODE',
  family: 'evm',
  type: 'l2',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: 'https://mainnet.mode.network',
    public: 'https://mode.publicnode.com',
  },
  blockExplorers: {
    default: {
      name: 'Mode Explorer',
      url: 'https://explorer.mode.network',
    },
  },
  iconUrl: '/icons/chains/mode.svg',
  color: '#DFFE00',
};

// ============================================
// Solana Networks
// ============================================

export const solana: NetworkConfig = {
  id: 'solana',
  chainId: 'solana-mainnet',
  name: 'Solana',
  shortName: 'SOL',
  family: 'solana',
  type: 'mainnet',
  nativeCurrency: {
    name: 'Solana',
    symbol: 'SOL',
    decimals: 9,
  },
  rpcUrls: {
    default: 'https://api.mainnet-beta.solana.com',
    public: 'https://solana-mainnet.rpc.extrnode.com',
  },
  blockExplorers: {
    default: {
      name: 'Solscan',
      url: 'https://solscan.io',
    },
  },
  iconUrl: '/icons/chains/solana.svg',
  color: '#9945FF',
};

// ============================================
// Testnets
// ============================================

export const sepolia: NetworkConfig = {
  id: 'sepolia',
  chainId: 11155111,
  name: 'Sepolia',
  shortName: 'SEP',
  family: 'evm',
  type: 'testnet',
  testnet: true,
  nativeCurrency: {
    name: 'Sepolia Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: 'https://ethereum-sepolia.publicnode.com',
    public: 'https://rpc.sepolia.org',
  },
  blockExplorers: {
    default: {
      name: 'Etherscan',
      url: 'https://sepolia.etherscan.io',
    },
  },
  iconUrl: '/icons/chains/ethereum.svg',
  color: '#627EEA',
};

export const goerli: NetworkConfig = {
  id: 'goerli',
  chainId: 5,
  name: 'Goerli',
  shortName: 'GOR',
  family: 'evm',
  type: 'testnet',
  testnet: true,
  nativeCurrency: {
    name: 'Goerli Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: 'https://ethereum-goerli.publicnode.com',
    public: 'https://rpc.goerli.mudit.blog',
  },
  blockExplorers: {
    default: {
      name: 'Etherscan',
      url: 'https://goerli.etherscan.io',
    },
  },
  iconUrl: '/icons/chains/ethereum.svg',
  color: '#627EEA',
};

export const mumbai: NetworkConfig = {
  id: 'mumbai',
  chainId: 80001,
  name: 'Polygon Mumbai',
  shortName: 'MUM',
  family: 'evm',
  type: 'testnet',
  testnet: true,
  nativeCurrency: {
    name: 'MATIC',
    symbol: 'MATIC',
    decimals: 18,
  },
  rpcUrls: {
    default: 'https://polygon-mumbai-bor.publicnode.com',
    public: 'https://rpc-mumbai.maticvigil.com',
  },
  blockExplorers: {
    default: {
      name: 'PolygonScan',
      url: 'https://mumbai.polygonscan.com',
    },
  },
  iconUrl: '/icons/chains/polygon.svg',
  color: '#8247E5',
};

export const arbitrumSepolia: NetworkConfig = {
  id: 'arbitrum-sepolia',
  chainId: 421614,
  name: 'Arbitrum Sepolia',
  shortName: 'ARBSEP',
  family: 'evm',
  type: 'testnet',
  testnet: true,
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: 'https://sepolia-rollup.arbitrum.io/rpc',
    public: 'https://arbitrum-sepolia.publicnode.com',
  },
  blockExplorers: {
    default: {
      name: 'Arbiscan',
      url: 'https://sepolia.arbiscan.io',
    },
  },
  iconUrl: '/icons/chains/arbitrum.svg',
  color: '#28A0F0',
};

export const baseSepolia: NetworkConfig = {
  id: 'base-sepolia',
  chainId: 84532,
  name: 'Base Sepolia',
  shortName: 'BASESEP',
  family: 'evm',
  type: 'testnet',
  testnet: true,
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: 'https://sepolia.base.org',
    public: 'https://base-sepolia.publicnode.com',
  },
  blockExplorers: {
    default: {
      name: 'BaseScan',
      url: 'https://sepolia.basescan.org',
    },
  },
  iconUrl: '/icons/chains/base.svg',
  color: '#0052FF',
};

export const solanaDevnet: NetworkConfig = {
  id: 'solana-devnet',
  chainId: 'solana-devnet',
  name: 'Solana Devnet',
  shortName: 'SOLDEV',
  family: 'solana',
  type: 'testnet',
  testnet: true,
  nativeCurrency: {
    name: 'Solana',
    symbol: 'SOL',
    decimals: 9,
  },
  rpcUrls: {
    default: 'https://api.devnet.solana.com',
    public: 'https://solana-devnet.rpc.extrnode.com',
  },
  blockExplorers: {
    default: {
      name: 'Solscan',
      url: 'https://solscan.io/?cluster=devnet',
    },
  },
  iconUrl: '/icons/chains/solana.svg',
  color: '#9945FF',
};

// ============================================
// Network Collections
// ============================================

export const allNetworks: NetworkConfig[] = [
  // Mainnets
  ethereum,
  polygon,
  arbitrum,
  optimism,
  base,
  bsc,
  avalanche,
  fantom,
  zkSync,
  linea,
  scroll,
  mantle,
  gnosis,
  celo,
  moonbeam,
  moonriver,
  cronos,
  aurora,
  harmony,
  klaytn,
  metis,
  polygonZkEvm,
  blast,
  mode,
  // Solana
  solana,
  // Testnets
  sepolia,
  goerli,
  mumbai,
  arbitrumSepolia,
  baseSepolia,
  solanaDevnet,
];

// Alias for NETWORK_CONFIGS - commonly used import name
export const NETWORK_CONFIGS = allNetworks;

export const mainnetNetworks = allNetworks.filter(n => n.type === 'mainnet');
export const l2Networks = allNetworks.filter(n => n.type === 'l2');
export const testnetNetworks = allNetworks.filter(n => n.type === 'testnet');
export const solanaNetworks = allNetworks.filter(n => n.family === 'solana');
export const evmNetworks = allNetworks.filter(n => n.family === 'evm');

/**
 * Get network by chain ID
 */
export function getNetworkByChainId(chainId: number | string): NetworkConfig | undefined {
  return allNetworks.find(n => n.chainId === chainId);
}

/**
 * Get network by ID
 */
export function getNetworkById(id: string): NetworkConfig | undefined {
  return allNetworks.find(n => n.id === id);
}

/**
 * Get networks by family
 */
export function getNetworksByFamily(family: 'evm' | 'solana'): NetworkConfig[] {
  return allNetworks.filter(n => n.family === family);
}

/**
 * Get networks by type
 */
export function getNetworksByType(type: 'mainnet' | 'testnet' | 'l2' | 'sidechain'): NetworkConfig[] {
  return allNetworks.filter(n => n.type === type);
}

/**
 * Network category groupings for UI
 */
export const networkCategories = {
  popular: [ethereum, polygon, arbitrum, optimism, base, solana],
  l2: [arbitrum, optimism, base, zkSync, linea, scroll, mantle, blast, mode, polygonZkEvm, metis],
  defi: [ethereum, polygon, arbitrum, bsc, avalanche, fantom],
  gaming: [polygon, arbitrum, base, avalanche, moonbeam],
  nft: [ethereum, polygon, solana, base, arbitrum],
  testnets: [sepolia, goerli, mumbai, arbitrumSepolia, baseSepolia, solanaDevnet],
};
