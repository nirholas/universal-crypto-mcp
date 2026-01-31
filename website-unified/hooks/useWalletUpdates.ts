/**
 * useWalletUpdates Hook
 * 
 * React hook for real-time wallet activity and transaction updates via WebSocket
 * 
 * @author Nich (@nichxbt)
 * @license Apache-2.0
 */

'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useWebSocketContext } from '../providers/WebSocketProvider';
import type {
  Transaction,
  TransactionStatus,
  WalletUpdate,
  BalanceChange,
  Block,
} from '../lib/websocket/types';

// ============================================================================
// Types
// ============================================================================

export interface Activity {
  id: string;
  type: 'transaction' | 'balance' | 'approval' | 'nft';
  timestamp: number;
  data: Transaction | BalanceChange | unknown;
  chain: number;
}

export interface UseWalletUpdatesOptions {
  // Enable/disable the subscription
  enabled?: boolean;
  
  // Chains to monitor (empty = all chains)
  chains?: number[];
  
  // Max activity history to keep
  maxActivity?: number;
  
  // Auto-subscribe on mount
  autoSubscribe?: boolean;
  
  // Custom update handler
  onUpdate?: (update: WalletUpdate) => void;
  
  // Transaction confirmed handler
  onConfirmation?: (tx: Transaction) => void;
  
  // Transaction failed handler
  onFailure?: (tx: Transaction, error: string) => void;
  
  // Error handler
  onError?: (error: Error) => void;
}

export interface UseWalletUpdatesReturn {
  // Pending transactions
  pendingTxs: Transaction[];
  
  // Recent activity
  recentActivity: Activity[];
  
  // Balance changes
  balanceChanges: BalanceChange[];
  
  // Loading state
  loading: boolean;
  
  // Error state
  error: Error | null;
  
  // Last update timestamp
  lastUpdate: number;
  
  // Subscribe to address
  subscribe: () => void;
  
  // Unsubscribe from address
  unsubscribe: () => void;
  
  // Watch a specific transaction
  watchTransaction: (txHash: string, chain: number) => void;
  
  // Stop watching a transaction
  unwatchTransaction: (txHash: string) => void;
  
  // Get transaction status
  getTransactionStatus: (txHash: string) => TransactionStatus | undefined;
  
  // Clear activity history
  clearActivity: () => void;
  
  // Connection status
  connected: boolean;
  
  // Subscription status
  subscribed: boolean;
}

// ============================================================================
// Hook Implementation
// ============================================================================

export function useWalletUpdates(
  address: string,
  options: UseWalletUpdatesOptions = {}
): UseWalletUpdatesReturn {
  const {
    enabled = true,
    chains = [],
    maxActivity = 50,
    autoSubscribe = true,
    onUpdate,
    onConfirmation,
    onFailure,
    onError,
  } = options;

  // Get WebSocket context
  const { connected, client, subscribe: wsSubscribe, unsubscribe: wsUnsubscribe, onMessage } = useWebSocketContext();
  
  // State
  const [pendingTxs, setPendingTxs] = useState<Transaction[]>([]);
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [balanceChanges, setBalanceChanges] = useState<BalanceChange[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdate, setLastUpdate] = useState(0);
  const [subscribed, setSubscribed] = useState(false);
  
  // Refs
  const watchedTxs = useRef<Map<string, TransactionStatus>>(new Map());
  const onUpdateRef = useRef(onUpdate);
  const onConfirmationRef = useRef(onConfirmation);
  const onFailureRef = useRef(onFailure);
  const onErrorRef = useRef(onError);
  
  // Keep refs updated
  useEffect(() => {
    onUpdateRef.current = onUpdate;
    onConfirmationRef.current = onConfirmation;
    onFailureRef.current = onFailure;
    onErrorRef.current = onError;
  }, [onUpdate, onConfirmation, onFailure, onError]);
  
  // Normalize address
  const normalizedAddress = useMemo(() => {
    return address?.toLowerCase() || '';
  }, [address]);
  
  // Add activity
  const addActivity = useCallback((activity: Activity) => {
    setRecentActivity(prev => {
      const next = [activity, ...prev];
      return next.slice(0, maxActivity);
    });
    setLastUpdate(Date.now());
  }, [maxActivity]);
  
  // Handle wallet updates
  useEffect(() => {
    if (!connected || !enabled || !normalizedAddress) return;
    
    const handleWalletUpdate = (data: unknown) => {
      try {
        const update = data as WalletUpdate;
        const updateChain = typeof update.chain === 'string' ? parseInt(update.chain, 10) : update.chain;
        
        // Filter by chain if specified
        if (chains.length > 0 && !chains.includes(updateChain)) return;
        
        // Call update handler
        onUpdateRef.current?.(update);
        
        // Process by type
        switch (update.type) {
          case 'transaction': {
            const tx = update.data as unknown as Transaction;
            
            // Add to activity
            addActivity({
              id: tx.hash,
              type: 'transaction',
              timestamp: update.timestamp,
              data: tx,
              chain: updateChain,
            });
            
            // Update pending txs
            if (tx.status === 'pending') {
              setPendingTxs(prev => [...prev, tx]);
            } else if (tx.status === 'confirmed') {
              setPendingTxs(prev => prev.filter(t => t.hash !== tx.hash));
              onConfirmationRef.current?.(tx);
            } else if (tx.status === 'failed') {
              setPendingTxs(prev => prev.filter(t => t.hash !== tx.hash));
              onFailureRef.current?.(tx, 'Transaction failed');
            }
            
            // Update watched tx status
            if (watchedTxs.current.has(tx.hash)) {
              watchedTxs.current.set(tx.hash, {
                hash: tx.hash,
                chain: updateChain,
                status: tx.status,
                confirmations: tx.confirmations || 0,
                requiredConfirmations: 12,
                blockNumber: tx.blockNumber,
                timestamp: update.timestamp,
              });
            }
            break;
          }
          
          case 'balance': {
            const change = update.data as BalanceChange;
            
            setBalanceChanges(prev => {
              const next = [change, ...prev];
              return next.slice(0, 20); // Keep last 20 changes
            });
            
            addActivity({
              id: `balance-${update.timestamp}`,
              type: 'balance',
              timestamp: update.timestamp,
              data: change,
              chain: updateChain,
            });
            break;
          }
          
          case 'approval': {
            addActivity({
              id: `approval-${update.timestamp}`,
              type: 'approval',
              timestamp: update.timestamp,
              data: update.data,
              chain: updateChain,
            });
            break;
          }
          
          case 'nft': {
            addActivity({
              id: `nft-${update.timestamp}`,
              type: 'nft',
              timestamp: update.timestamp,
              data: update.data,
              chain: updateChain,
            });
            break;
          }
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        onErrorRef.current?.(error);
      }
    };
    
    const unsubscribe = onMessage<WalletUpdate>('wallet:update', handleWalletUpdate);
    
    return () => unsubscribe();
  }, [connected, enabled, normalizedAddress, chains, addActivity, onMessage]);
  
  // Handle transaction status updates
  useEffect(() => {
    if (!connected || !enabled) return;
    
    const handleTxStatus = (data: unknown) => {
      const status = data as TransactionStatus;
      
      if (watchedTxs.current.has(status.hash)) {
        watchedTxs.current.set(status.hash, status);
        
        // Trigger update
        setLastUpdate(Date.now());
        
        // Check for completion
        if (status.status === 'confirmed') {
          const tx: Transaction = {
            hash: status.hash,
            status: 'confirmed',
            confirmations: status.confirmations,
            blockNumber: status.blockNumber,
            timestamp: status.timestamp,
            from: '',
            to: '',
            value: '',
            chainId: 0,
          };
          onConfirmationRef.current?.(tx);
        } else if (status.status === 'failed') {
          const tx: Transaction = {
            hash: status.hash,
            status: 'failed',
            confirmations: 0,
            timestamp: status.timestamp,
            from: '',
            to: '',
            value: '',
            chainId: 0,
          };
          onFailureRef.current?.(tx, 'Transaction failed');
        }
      }
    };
    
    const unsubscribe = onMessage<TransactionStatus>('tx:status', handleTxStatus);
    
    return () => unsubscribe();
  }, [connected, enabled, onMessage]);
  
  // Subscribe to wallet updates
  const subscribe = useCallback(async () => {
    if (!client || !connected || !normalizedAddress) return;
    if (subscribed) return;
    
    try {
      setLoading(true);
      
      await wsSubscribe(`wallet:${normalizedAddress}`);
      setSubscribed(true);
      
      // Request initial state
      const response = await client.request<{
        pendingTxs: Transaction[];
        recentActivity: Activity[];
      }>('wallet:getState', { address: normalizedAddress });
      
      if (response.pendingTxs) {
        setPendingTxs(response.pendingTxs);
      }
      if (response.recentActivity) {
        setRecentActivity(response.recentActivity);
      }
      
      setLoading(false);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      setLoading(false);
      onErrorRef.current?.(error);
    }
  }, [client, connected, normalizedAddress, subscribed, wsSubscribe]);
  
  // Unsubscribe from wallet updates
  const unsubscribe = useCallback(async () => {
    if (!connected || !normalizedAddress) return;
    if (!subscribed) return;
    
    try {
      await wsUnsubscribe(`wallet:${normalizedAddress}`);
      setSubscribed(false);
    } catch (err) {
      // Ignore unsubscribe errors
    }
  }, [connected, normalizedAddress, subscribed, wsUnsubscribe]);
  
  // Watch a specific transaction
  const watchTransaction = useCallback(async (txHash: string, chain: number) => {
    if (!client || !connected) return;
    
    watchedTxs.current.set(txHash, {
      hash: txHash,
      chain,
      status: 'pending',
      confirmations: 0,
      requiredConfirmations: 12,
      timestamp: Date.now(),
    });
    
    try {
      await wsSubscribe(`tx:${txHash}`);
      
      // Request current status
      const response = await client.request<{ status: TransactionStatus }>(
        'tx:getStatus',
        { hash: txHash, chain }
      );
      
      if (response.status) {
        watchedTxs.current.set(txHash, response.status);
      }
    } catch (err) {
      // Keep watching, status will update via subscription
    }
  }, [client, connected, wsSubscribe]);
  
  // Stop watching a transaction
  const unwatchTransaction = useCallback(async (txHash: string) => {
    if (!connected) return;
    
    watchedTxs.current.delete(txHash);
    
    try {
      await wsUnsubscribe(`tx:${txHash}`);
    } catch (err) {
      // Ignore unsubscribe errors
    }
  }, [connected, wsUnsubscribe]);
  
  // Get transaction status
  const getTransactionStatus = useCallback((txHash: string): TransactionStatus | undefined => {
    return watchedTxs.current.get(txHash);
  }, []);
  
  // Clear activity history
  const clearActivity = useCallback(() => {
    setRecentActivity([]);
    setBalanceChanges([]);
  }, []);
  
  // Auto-subscribe
  useEffect(() => {
    if (!connected || !enabled || !autoSubscribe || !normalizedAddress) {
      setLoading(false);
      return;
    }
    
    subscribe();
    
    return () => {
      unsubscribe();
    };
  }, [connected, enabled, autoSubscribe, normalizedAddress, subscribe, unsubscribe]);
  
  return {
    pendingTxs,
    recentActivity,
    balanceChanges,
    loading,
    error,
    lastUpdate,
    subscribe,
    unsubscribe,
    watchTransaction,
    unwatchTransaction,
    getTransactionStatus,
    clearActivity,
    connected,
    subscribed,
  };
}

// ============================================================================
// Convenience Hooks
// ============================================================================

/**
 * Hook for watching a single transaction
 */
export function useTransactionStatus(
  txHash: string | undefined,
  chain: number,
  options: {
    onConfirmed?: (tx: Transaction) => void;
    onFailed?: (tx: Transaction, error: string) => void;
  } = {}
): {
  status: TransactionStatus | undefined;
  loading: boolean;
  error: Error | null;
} {
  const { connected, client, onMessage, subscribe: wsSubscribe, unsubscribe: wsUnsubscribe } = useWebSocketContext();
  const [status, setStatus] = useState<TransactionStatus | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const onConfirmedRef = useRef(options.onConfirmed);
  const onFailedRef = useRef(options.onFailed);
  
  useEffect(() => {
    onConfirmedRef.current = options.onConfirmed;
    onFailedRef.current = options.onFailed;
  }, [options.onConfirmed, options.onFailed]);
  
  useEffect(() => {
    if (!connected || !txHash) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    
    // Subscribe to transaction updates
    wsSubscribe(`tx:${txHash}`).catch(() => {});
    
    // Get initial status
    client?.request<{ status: TransactionStatus }>('tx:getStatus', { hash: txHash, chain })
      .then(response => {
        if (response.status) {
          setStatus(response.status);
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err instanceof Error ? err : new Error(String(err)));
        setLoading(false);
      });
    
    // Listen for updates
    const unsubscribe = onMessage<TransactionStatus>('tx:status', (data) => {
      if (data.hash === txHash) {
        setStatus(data);
        
        if (data.status === 'confirmed') {
          onConfirmedRef.current?.({
            hash: data.hash,
            status: 'confirmed',
            confirmations: data.confirmations,
            blockNumber: data.blockNumber,
            timestamp: data.timestamp,
            from: '',
            to: '',
            value: '',
            chainId: chain,
          });
        } else if (data.status === 'failed') {
          onFailedRef.current?.({
            hash: data.hash,
            status: 'failed',
            confirmations: 0,
            timestamp: data.timestamp,
            from: '',
            to: '',
            value: '',
            chainId: chain,
          }, 'Transaction failed');
        }
      }
    });
    
    return () => {
      unsubscribe();
      wsUnsubscribe(`tx:${txHash}`).catch(() => {});
    };
  }, [connected, txHash, chain, client, wsSubscribe, wsUnsubscribe, onMessage]);
  
  return { status, loading, error };
}

/**
 * Hook for new block notifications
 */
export function useBlocks(
  chain: number,
  options: { enabled?: boolean; onBlock?: (block: Block) => void } = {}
): {
  latestBlock: Block | undefined;
  loading: boolean;
  error: Error | null;
} {
  const { enabled = true, onBlock } = options;
  const { connected, client, onMessage, subscribe: wsSubscribe, unsubscribe: wsUnsubscribe } = useWebSocketContext();
  const [latestBlock, setLatestBlock] = useState<Block | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const onBlockRef = useRef(onBlock);
  
  useEffect(() => {
    onBlockRef.current = onBlock;
  }, [onBlock]);
  
  useEffect(() => {
    if (!connected || !enabled) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    
    // Subscribe to blocks
    wsSubscribe(`blocks:${chain}`).catch(() => {});
    
    // Get latest block
    client?.request<{ block: Block }>('blocks:latest', { chain })
      .then(response => {
        if (response.block) {
          setLatestBlock(response.block);
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err instanceof Error ? err : new Error(String(err)));
        setLoading(false);
      });
    
    // Listen for new blocks
    const unsubscribe = onMessage<Block>('blocks:new', (block) => {
      if (block.chainId === chain) {
        setLatestBlock(block);
        onBlockRef.current?.(block);
      }
    });
    
    return () => {
      unsubscribe();
      wsUnsubscribe(`blocks:${chain}`).catch(() => {});
    };
  }, [connected, enabled, chain, client, wsSubscribe, wsUnsubscribe, onMessage]);
  
  return { latestBlock, loading, error };
}

// ============================================================================
// Export
// ============================================================================

export default useWalletUpdates;
