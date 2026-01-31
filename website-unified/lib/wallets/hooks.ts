/**
 * Wallet Hooks
 * 
 * Custom React hooks for wallet functionality with real API integrations
 * 
 * @author Nich (@nichxbt)
 * @license Apache-2.0
 */

'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useWalletStore } from './store';
import { 
  NetworkConfig, 
  TokenBalance, 
  NFT, 
  Transaction,
  TokenApproval,
  NetworkHealth,
  GasEstimate,
} from './types';
import { 
  allNetworks, 
  getNetworkByChainId,
  networkCategories,
} from './networks';
import { truncateAddress, isValidAddress } from './utils';
import * as api from './api';

// ============================================
// Network Hooks
// ============================================

/**
 * Hook to get available networks based on settings
 */
export function useAvailableNetworks(): {
  networks: NetworkConfig[];
  categories: typeof networkCategories;
  favorites: NetworkConfig[];
} {
  const settings = useWalletStore(state => state.settings);
  
  const networks = useMemo(() => {
    if (settings.showTestnets) {
      return allNetworks;
    }
    return allNetworks.filter(n => !n.testnet);
  }, [settings.showTestnets]);

  const favorites = useMemo(() => {
    return settings.favoriteNetworks
      .map(id => allNetworks.find(n => n.id === id))
      .filter((n): n is NetworkConfig => n !== undefined);
  }, [settings.favoriteNetworks]);

  return { networks, categories: networkCategories, favorites };
}

// ============================================
// ENS/SNS Resolution
// ============================================

/**
 * Hook to resolve ENS/SNS names using real APIs
 */
export function useAddressName(address: string | undefined) {
  const [name, setName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);
  const currentNetwork = useWalletStore(state => state.currentNetwork);

  useEffect(() => {
    if (!address) {
      setName(null);
      setAvatar(null);
      return;
    }

    const resolveAddress = async () => {
      setIsLoading(true);
      
      try {
        // For EVM chains, resolve ENS
        if (currentNetwork?.family === 'evm' || !currentNetwork) {
          // Use Alchemy or public ENS resolver
          const response = await fetch(
            `https://api.ensideas.com/ens/resolve/${address}`
          );
          
          if (response.ok) {
            const data = await response.json();
            if (data.name) {
              setName(data.name);
              setAvatar(data.avatar || null);
            } else {
              setName(null);
              setAvatar(null);
            }
          } else {
            setName(null);
            setAvatar(null);
          }
        } 
        // For Solana, resolve SNS
        else if (currentNetwork?.family === 'solana') {
          try {
            // Use SNS (Bonfida) API
            const response = await fetch(
              `https://sns-sdk-proxy.bonfida.workers.dev/favorite-domain/${address}`
            );
            
            if (response.ok) {
              const data = await response.json();
              if (data.result?.domain) {
                setName(`${data.result.domain}.sol`);
              } else {
                setName(null);
              }
            }
          } catch {
            setName(null);
          }
          setAvatar(null);
        }
      } catch {
        setName(null);
        setAvatar(null);
      } finally {
        setIsLoading(false);
      }
    };

    resolveAddress();
  }, [address, currentNetwork]);

  return { 
    name, 
    avatar,
    isLoading, 
    displayName: name || truncateAddress(address || '') 
  };
}

/**
 * Hook to resolve ENS/SNS name to address
 */
export function useNameToAddress(name: string | undefined) {
  const [address, setAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const currentNetwork = useWalletStore(state => state.currentNetwork);

  useEffect(() => {
    if (!name) {
      setAddress(null);
      setError(null);
      return;
    }

    const resolveName = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // ENS names
        if (name.endsWith('.eth')) {
          const response = await fetch(
            `https://api.ensideas.com/ens/resolve/${name}`
          );
          
          if (response.ok) {
            const data = await response.json();
            if (data.address) {
              setAddress(data.address);
            } else {
              setError('ENS name not found');
              setAddress(null);
            }
          } else {
            setError('Failed to resolve ENS name');
            setAddress(null);
          }
        }
        // SNS names
        else if (name.endsWith('.sol')) {
          const domain = name.replace('.sol', '');
          const response = await fetch(
            `https://sns-sdk-proxy.bonfida.workers.dev/resolve/${domain}`
          );
          
          if (response.ok) {
            const data = await response.json();
            if (data.result) {
              setAddress(data.result);
            } else {
              setError('SNS name not found');
              setAddress(null);
            }
          } else {
            setError('Failed to resolve SNS name');
            setAddress(null);
          }
        }
        // Unstoppable domains
        else if (name.match(/\.(crypto|nft|x|wallet|bitcoin|dao|888|zil|blockchain)$/)) {
          // Use Unstoppable Domains API
          const response = await fetch(
            `https://resolve.unstoppabledomains.com/domains/${name}`,
            {
              headers: {
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_UD_API_KEY || ''}`,
              },
            }
          );
          
          if (response.ok) {
            const data = await response.json();
            const ethAddress = data.records?.['crypto.ETH.address'];
            if (ethAddress) {
              setAddress(ethAddress);
            } else {
              setError('No ETH address found for domain');
              setAddress(null);
            }
          } else {
            setError('Failed to resolve domain');
            setAddress(null);
          }
        }
        else {
          setError('Unknown domain type');
          setAddress(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to resolve name');
        setAddress(null);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce the resolution
    const timer = setTimeout(resolveName, 300);
    return () => clearTimeout(timer);
  }, [name, currentNetwork]);

  return { address, isLoading, error };
}

// ============================================
// Token Balance Hooks
// ============================================

/**
 * Hook to fetch token balances using real APIs (Alchemy/Helius)
 */
export function useTokenBalances(address: string | undefined, chainId?: number | string) {
  const [balances, setBalances] = useState<TokenBalance[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const currentNetwork = useWalletStore(state => state.currentNetwork);
  const abortControllerRef = useRef<AbortController | null>(null);

  const effectiveChainId = chainId ? Number(chainId) : currentNetwork?.chainId || 1;

  const fetchBalances = useCallback(async () => {
    if (!address) {
      setBalances([]);
      return;
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setIsLoading(true);
    setError(null);

    try {
      const tokenBalances = await api.getBalances(address, Number(effectiveChainId));
      
      // Sort by value descending
      tokenBalances.sort((a, b) => (b.valueUsd || 0) - (a.valueUsd || 0));
      
      setBalances(tokenBalances);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return;
      setError(err instanceof Error ? err : new Error('Failed to fetch balances'));
    } finally {
      setIsLoading(false);
    }
  }, [address, effectiveChainId]);

  useEffect(() => {
    fetchBalances();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchBalances, 30000);
    
    return () => {
      clearInterval(interval);
      abortControllerRef.current?.abort();
    };
  }, [fetchBalances]);

  // Calculate totals
  const totalValueUsd = useMemo(() => 
    balances.reduce((sum, b) => sum + (b.valueUsd || 0), 0),
    [balances]
  );

  return { 
    balances, 
    totalValueUsd,
    isLoading, 
    error, 
    refetch: fetchBalances 
  };
}

// ============================================
// NFT Hooks
// ============================================

/**
 * Hook to fetch NFTs using real APIs
 */
export function useNFTs(address: string | undefined, chainId?: number | string) {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const currentNetwork = useWalletStore(state => state.currentNetwork);
  const abortControllerRef = useRef<AbortController | null>(null);

  const effectiveChainId = chainId ? Number(chainId) : currentNetwork?.chainId || 1;

  const fetchNFTs = useCallback(async (page = 1) => {
    if (!address) {
      setNfts([]);
      setTotal(0);
      return;
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setIsLoading(true);
    setError(null);

    try {
      const result = await api.getNFTs(address, Number(effectiveChainId), { page, limit: 50 });
      
      if (page === 1) {
        setNfts(result.nfts);
      } else {
        setNfts(prev => [...prev, ...result.nfts]);
      }
      setTotal(result.total);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return;
      setError(err instanceof Error ? err : new Error('Failed to fetch NFTs'));
    } finally {
      setIsLoading(false);
    }
  }, [address, effectiveChainId]);

  useEffect(() => {
    fetchNFTs(1);
    
    return () => {
      abortControllerRef.current?.abort();
    };
  }, [fetchNFTs]);

  // Group NFTs by collection
  const collections = useMemo(() => {
    const map = new Map<string, NFT[]>();
    
    nfts.forEach(nft => {
      const collectionKey = nft.contractAddress || 'uncategorized';
      if (!map.has(collectionKey)) {
        map.set(collectionKey, []);
      }
      map.get(collectionKey)!.push(nft);
    });
    
    return Array.from(map.entries()).map(([address, items]) => ({
      address,
      name: items[0]?.collection?.name || 'Unknown Collection',
      isVerified: false,
      nfts: items,
      floorPrice: items[0]?.collection?.floorPrice,
    }));
  }, [nfts]);

  return { 
    nfts, 
    collections,
    total, 
    isLoading, 
    error, 
    refetch: () => fetchNFTs(1),
    loadMore: () => fetchNFTs(Math.ceil(nfts.length / 50) + 1),
    hasMore: nfts.length < total,
  };
}

// ============================================
// Transaction History Hooks
// ============================================

/**
 * Hook to fetch transaction history using real APIs
 */
export function useTransactionHistory(
  address: string | undefined,
  options?: { chainId?: number | string; limit?: number }
) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState<string | undefined>();
  const currentNetwork = useWalletStore(state => state.currentNetwork);
  const abortControllerRef = useRef<AbortController | null>(null);

  const effectiveChainId = options?.chainId ? Number(options.chainId) : currentNetwork?.chainId || 1;
  const limit = options?.limit || 50;

  const fetchTransactions = useCallback(async (loadMore = false) => {
    if (!address) {
      setTransactions([]);
      return;
    }

    // Cancel previous request if not loading more
    if (!loadMore && abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setIsLoading(true);
    setError(null);

    try {
      const result = await api.getTransactionHistory(address, Number(effectiveChainId), {
        before: loadMore ? cursor : undefined,
        limit,
      });

      if (loadMore) {
        setTransactions(prev => [...prev, ...result.transactions]);
      } else {
        setTransactions(result.transactions);
      }
      
      setHasMore(result.hasMore);
      
      // Set cursor for pagination
      if (result.transactions.length > 0) {
        setCursor(result.transactions[result.transactions.length - 1].hash);
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return;
      setError(err instanceof Error ? err : new Error('Failed to fetch transactions'));
    } finally {
      setIsLoading(false);
    }
  }, [address, effectiveChainId, limit, cursor]);

  useEffect(() => {
    setCursor(undefined);
    fetchTransactions(false);
    
    return () => {
      abortControllerRef.current?.abort();
    };
  }, [address, effectiveChainId]);

  // Group transactions by date
  const groupedTransactions = useMemo(() => {
    const groups = new Map<string, Transaction[]>();
    
    transactions.forEach(tx => {
      const date = tx.blockTimestamp?.toLocaleDateString() || 'Unknown';
      if (!groups.has(date)) {
        groups.set(date, []);
      }
      groups.get(date)!.push(tx);
    });
    
    return Array.from(groups.entries()).map(([date, txs]) => ({
      date,
      transactions: txs,
    }));
  }, [transactions]);

  return { 
    transactions, 
    groupedTransactions,
    isLoading, 
    error, 
    hasMore, 
    loadMore: () => fetchTransactions(true),
    refetch: () => {
      setCursor(undefined);
      fetchTransactions(false);
    },
  };
}

// ============================================
// Token Approval Hooks
// ============================================

/**
 * Hook to fetch token approvals using real APIs
 */
export function useTokenApprovals(address: string | undefined, chainId?: number | string) {
  const [approvals, setApprovals] = useState<TokenApproval[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const currentNetwork = useWalletStore(state => state.currentNetwork);

  const effectiveChainId = chainId ? Number(chainId) : currentNetwork?.chainId || 1;

  const fetchApprovals = useCallback(async () => {
    if (!address) {
      setApprovals([]);
      return;
    }

    // Only fetch for EVM chains
    if (api.isSolanaChain(Number(effectiveChainId))) {
      setApprovals([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const tokenApprovals = await api.getTokenApprovals(address, Number(effectiveChainId));
      
      // Transform API response to TokenApproval format and sort
      const transformedApprovals: TokenApproval[] = tokenApprovals.map((a, idx) => ({
        id: `approval-${idx}`,
        token: {
          address: a.tokenAddress,
          symbol: a.tokenSymbol,
          name: a.tokenName,
          decimals: 18,
          chainId: effectiveChainId,
        },
        spender: a.spender,
        allowance: a.amount,
        allowanceFormatted: a.isUnlimited ? 'Unlimited' : a.amount.toString(),
        isUnlimited: a.isUnlimited,
        riskLevel: a.isUnlimited ? 'high' : 'medium',
        transactionHash: '',
      }));
      
      // Sort by risk (unlimited approvals first)
      transformedApprovals.sort((a, b) => {
        if (a.isUnlimited && !b.isUnlimited) return -1;
        if (!a.isUnlimited && b.isUnlimited) return 1;
        return 0;
      });
      
      setApprovals(transformedApprovals);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch approvals'));
    } finally {
      setIsLoading(false);
    }
  }, [address, effectiveChainId]);

  useEffect(() => {
    fetchApprovals();
  }, [fetchApprovals]);

  // Calculate security metrics
  const metrics = useMemo(() => {
    const unlimitedCount = approvals.filter(a => a.isUnlimited).length;
    const totalValueAtRisk = 0; // Would need price data to calculate
    const riskScore = Math.max(0, 100 - (unlimitedCount * 10) - (approvals.length * 2));
    
    return {
      totalApprovals: approvals.length,
      unlimitedApprovals: unlimitedCount,
      totalValueAtRisk,
      riskScore,
      riskLevel: riskScore >= 80 ? 'low' : riskScore >= 50 ? 'medium' : 'high',
    };
  }, [approvals]);

  return { 
    approvals, 
    metrics,
    isLoading, 
    error, 
    refetch: fetchApprovals 
  };
}

// ============================================
// Network Health Hooks
// ============================================

/**
 * Hook for network health monitoring with real RPC data
 */
export function useNetworkHealth(network: NetworkConfig | undefined) {
  const [health, setHealth] = useState<NetworkHealth | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!network) {
      setHealth(null);
      return;
    }

    const fetchHealth = async () => {
      setIsLoading(true);
      
      try {
        // For EVM chains
        if (network.family === 'evm') {
          // Get block number from RPC
          const response = await fetch(network.rpcUrls.default, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              jsonrpc: '2.0',
              method: 'eth_blockNumber',
              params: [],
              id: 1,
            }),
          });
          
          const blockData = await response.json();
          const blockNumber = parseInt(blockData.result, 16);
          
          // Get gas price
          const gasResponse = await fetch(network.rpcUrls.default, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              jsonrpc: '2.0',
              method: 'eth_gasPrice',
              params: [],
              id: 2,
            }),
          });
          
          const gasData = await gasResponse.json();
          const gasPrice = BigInt(gasData.result);
          
          // Try to get EIP-1559 fees
          let baseFee: bigint | undefined;
          let priorityFee: bigint | undefined;
          
          try {
            const feeResponse = await fetch(network.rpcUrls.default, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                jsonrpc: '2.0',
                method: 'eth_maxPriorityFeePerGas',
                params: [],
                id: 3,
              }),
            });
            
            const feeData = await feeResponse.json();
            if (feeData.result) {
              priorityFee = BigInt(feeData.result);
              // Approximate base fee
              baseFee = gasPrice - priorityFee;
            }
          } catch {
            // Chain doesn't support EIP-1559
          }
          
          setHealth({
            networkId: network.id,
            blockNumber,
            blockTime: 12, // Default block time
            gasPrice,
            baseFee,
            priorityFee,
            isHealthy: true,
            lastUpdated: new Date(),
          });
        }
        // For Solana
        else if (network.family === 'solana') {
          const response = await fetch(network.rpcUrls.default, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              jsonrpc: '2.0',
              method: 'getSlot',
              params: [],
              id: 1,
            }),
          });
          
          const slotData = await response.json();
          
          setHealth({
            networkId: network.id,
            blockNumber: slotData.result,
            blockTime: 0.4,
            gasPrice: BigInt(5000), // Approximate priority fee in lamports
            isHealthy: true,
            lastUpdated: new Date(),
          });
        }
      } catch (err) {
        console.error('Failed to fetch network health:', err);
        setHealth({
          networkId: network.id,
          blockNumber: 0,
          blockTime: 0,
          gasPrice: BigInt(0),
          isHealthy: false,
          lastUpdated: new Date(),
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchHealth();
    const interval = setInterval(fetchHealth, 15000);

    return () => clearInterval(interval);
  }, [network]);

  return { health, isLoading };
}

// ============================================
// Gas Estimation Hooks
// ============================================

/**
 * Hook for gas estimation with real data
 */
export function useGasEstimate(
  to: string | undefined,
  value: bigint | undefined,
  data: string | undefined
) {
  const currentNetwork = useWalletStore(state => state.currentNetwork);
  const [estimate, setEstimate] = useState<GasEstimate | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!to || !currentNetwork) {
      setEstimate(null);
      return;
    }

    const fetchEstimate = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const gasEstimate = await api.getGasPrices(Number(currentNetwork.chainId));
        
        // Estimate gas limit for the transaction
        if (api.isEvmChain(Number(currentNetwork.chainId))) {
          try {
            const response = await fetch(currentNetwork.rpcUrls.default, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                jsonrpc: '2.0',
                method: 'eth_estimateGas',
                params: [{
                  to,
                  value: value ? `0x${value.toString(16)}` : '0x0',
                  data: data || '0x',
                }],
                id: 1,
              }),
            });
            
            const gasData = await response.json();
            if (gasData.result) {
              gasEstimate.gasLimit = BigInt(gasData.result);
              
              // Calculate cost with buffer
              const bufferedGas = gasEstimate.gasLimit + (gasEstimate.gasLimit / BigInt(5)); // 20% buffer
              const gasPrice = gasEstimate.gasPrice ?? BigInt(0);
              gasEstimate.estimatedCost = bufferedGas * gasPrice;
            }
          } catch {
            // Use default gas limit for simple transfers
            gasEstimate.gasLimit = BigInt(21000);
            const gasPrice = gasEstimate.gasPrice ?? BigInt(0);
            gasEstimate.estimatedCost = gasEstimate.gasLimit * gasPrice;
          }
        }
        
        setEstimate(gasEstimate);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to estimate gas'));
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(fetchEstimate, 200);
    return () => clearTimeout(timer);
  }, [to, value, data, currentNetwork]);

  return { 
    estimate,
    gasLimit: estimate?.gasLimit || null, 
    gasPrice: estimate?.gasPrice || null, 
    estimatedCost: estimate?.estimatedCost || null,
    estimatedCostUsd: estimate?.estimatedCostUsd || null,
    isLoading,
    error,
  };
}

// ============================================
// Address Validation Hooks
// ============================================

/**
 * Hook for address validation with contract and scam detection
 */
export function useAddressValidation(address: string, chainFamily: 'evm' | 'solana' | 'cosmos' | 'bitcoin' = 'evm') {
  const isValid = useMemo(() => {
    if (!address) return false;
    return isValidAddress(address, chainFamily);
  }, [address, chainFamily]);

  const [isContract, setIsContract] = useState<boolean | null>(null);
  const [isKnownScam, setIsKnownScam] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [labels, setLabels] = useState<string[]>([]);
  const currentNetwork = useWalletStore(state => state.currentNetwork);

  useEffect(() => {
    if (!isValid || !address) {
      setIsContract(null);
      setIsKnownScam(false);
      setLabels([]);
      return;
    }

    const checkAddress = async () => {
      setIsLoading(true);

      try {
        // For EVM chains
        if (chainFamily === 'evm' && currentNetwork?.rpcUrls.default) {
          // Check if address is a contract
          const response = await fetch(currentNetwork.rpcUrls.default, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              jsonrpc: '2.0',
              method: 'eth_getCode',
              params: [address, 'latest'],
              id: 1,
            }),
          });

          const data = await response.json();
          const hasCode = data.result && data.result !== '0x' && data.result !== '0x0';
          setIsContract(hasCode);

          // Check scam database (using ChainAbuse API or similar)
          try {
            const scamResponse = await fetch(
              `https://api.gopluslabs.io/api/v1/address_security/${address}?chain_id=${currentNetwork.chainId}`
            );
            
            if (scamResponse.ok) {
              const scamData = await scamResponse.json();
              const result = scamData.result?.[address.toLowerCase()];
              
              if (result) {
                const scamIndicators = [
                  result.blacklist_doubt === '1',
                  result.honeypot_related_address === '1',
                  result.phishing_activities === '1',
                  result.stealing_attack === '1',
                  result.blackmail_activities === '1',
                ].filter(Boolean);
                
                setIsKnownScam(scamIndicators.length > 0);
                
                // Build labels
                const addressLabels: string[] = [];
                if (result.contract_address === '1') addressLabels.push('Contract');
                if (result.data_source) addressLabels.push(result.data_source);
                setLabels(addressLabels);
              }
            }
          } catch {
            // Scam check failed, not critical
          }
        }
        // For Solana
        else if (chainFamily === 'solana') {
          // Check if it's a program (contract)
          // For Solana, most addresses are either regular accounts or programs
          // Programs have specific characteristics
          setIsContract(false); // Would need actual RPC check
        }
      } catch (err) {
        console.error('Address validation error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkAddress();
  }, [address, isValid, chainFamily, currentNetwork]);

  return { isValid, isContract, isKnownScam, isLoading, labels };
}

/**
 * Hook for contact search
 */
export function useContactSearch(query: string) {
  const contacts = useWalletStore(state => state.contacts);

  const results = useMemo(() => {
    if (!query.trim()) return contacts;

    const lowerQuery = query.toLowerCase();
    return contacts.filter(contact => 
      contact.name.toLowerCase().includes(lowerQuery) ||
      contact.addresses.some(a => a.address.toLowerCase().includes(lowerQuery)) ||
      contact.addresses.some(a => a.ensName?.toLowerCase().includes(lowerQuery))
    );
  }, [contacts, query]);

  return results;
}

/**
 * Hook for recent addresses
 */
export function useRecentAddresses(limit = 5) {
  const recentAddresses = useWalletStore(state => state.recentAddresses);
  return recentAddresses.slice(0, limit);
}

/**
 * Hook for favorite contacts
 */
export function useFavoriteContacts() {
  const contacts = useWalletStore(state => state.contacts);
  return contacts.filter(c => c.isFavorite);
}
