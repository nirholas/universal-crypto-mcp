import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

interface WalletState {
  provider: ethers.providers.Web3Provider | null;
  signer: ethers.Signer | null;
  account: string | null;
  chainId: string | null;
  isConnected: boolean;
}

interface TransactionRequest {
  to: string;
  value?: ethers.BigNumber;
  data?: string;
  gasLimit?: ethers.BigNumber;
  chainId?: number;
}

export function useWallet() {
  const [walletState, setWalletState] = useState<WalletState>({
    provider: null,
    signer: null,
    account: null,
    chainId: null,
    isConnected: false,
  });
  
  // Initialize wallet
  useEffect(() => {
    const initializeWallet = async () => {
      // Check if window.ethereum is available
      if (typeof window.ethereum !== 'undefined') {
        try {
          // Get accounts
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          
          if (accounts.length > 0) {
            // User is already connected
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const network = await provider.getNetwork();
            
            setWalletState({
              provider,
              signer,
              account: accounts[0],
              chainId: network.chainId.toString(),
              isConnected: true,
            });
          }
        } catch (error) {
          console.error('Error initializing wallet:', error);
        }
      }
    };
    
    initializeWallet();
    
    // Setup event listeners
    if (typeof window.ethereum !== 'undefined') {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected
          setWalletState({
            provider: null,
            signer: null,
            account: null,
            chainId: null,
            isConnected: false,
          });
        } else {
          // Account changed
          setWalletState(prevState => ({
            ...prevState,
            account: accounts[0],
            isConnected: true,
          }));
        }
      };
      
      const handleChainChanged = (chainIdHex: string) => {
        const chainId = parseInt(chainIdHex, 16).toString();
        
        // Chain changed
        setWalletState(prevState => ({
          ...prevState,
          chainId,
        }));
      };
      
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
      
      // Clean up event listeners
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, []);
  
  // Connect wallet
  const connect = async () => {
    if (typeof window.ethereum === 'undefined') {
      throw new Error('MetaMask is not installed');
    }
    
    try {
      // Request accounts
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }
      
      // Initialize provider and signer
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const network = await provider.getNetwork();
      
      setWalletState({
        provider,
        signer,
        account: accounts[0],
        chainId: network.chainId.toString(),
        isConnected: true,
      });
      
      return accounts[0];
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    }
  };
  
  // Switch chain
  const switchChain = async (chainId: string) => {
    if (!walletState.provider) {
      throw new Error('Wallet not connected');
    }
    
    try {
      // Convert chainId to hex
      const chainIdHex = '0x' + parseInt(chainId).toString(16);
      
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainIdHex }],
      });
      
      // Update state with new chainId
      setWalletState(prevState => ({
        ...prevState,
        chainId,
      }));
    } catch (error: any) {
      // If the chain is not added to MetaMask
      if (error.code === 4902) {
        // Add the chain
        try {
          await addChain(chainId);
        } catch (addError) {
          console.error('Error adding chain:', addError);
          throw addError;
        }
      } else {
        console.error('Error switching chain:', error);
        throw error;
      }
    }
  };
  
  // Add chain
  const addChain = async (chainId: string) => {
    if (!walletState.provider) {
      throw new Error('Wallet not connected');
    }
    
    try {
      // Define chain parameters
      const chainParams = getChainParams(chainId);
      
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [chainParams],
      });
      
      // Update state with new chainId
      setWalletState(prevState => ({
        ...prevState,
        chainId,
      }));
    } catch (error) {
      console.error('Error adding chain:', error);
      throw error;
    }
  };
  
  // Sign transaction
  const signTransaction = async (txRequest: TransactionRequest) => {
    if (!walletState.signer) {
      throw new Error('Wallet not connected');
    }
    
    try {
      // Create transaction
      const tx = await walletState.signer.signTransaction(txRequest);
      return tx;
    } catch (error) {
      console.error('Error signing transaction:', error);
      throw error;
    }
  };
  
  // Send transaction
  const sendTransaction = async (txRequest: TransactionRequest) => {
    if (!walletState.signer) {
      throw new Error('Wallet not connected');
    }
    
    try {
      // Send transaction
      const tx = await walletState.signer.sendTransaction(txRequest);
      return tx;
    } catch (error) {
      console.error('Error sending transaction:', error);
      throw error;
    }
  };
  
  // Disconnect wallet
  const disconnect = () => {
    setWalletState({
      provider: null,
      signer: null,
      account: null,
      chainId: null,
      isConnected: false,
    });
  };
  
  return {
    ...walletState,
    connect,
    disconnect,
    switchChain,
    signTransaction,
    sendTransaction,
  };
}

// Helper function to get chain parameters
function getChainParams(chainId: string) {
  switch (chainId) {
    case '1':
      return {
        chainId: '0x1',
        chainName: 'Ethereum Mainnet',
        nativeCurrency: {
          name: 'Ether',
          symbol: 'ETH',
          decimals: 18,
        },
        rpcUrls: ['https://mainnet.infura.io/v3/'],
        blockExplorerUrls: ['https://etherscan.io/'],
      };
    case '11155111':
      return {
        chainId: '0xaa36a7',
        chainName: 'Sepolia Testnet',
        nativeCurrency: {
          name: 'Sepolia Ether',
          symbol: 'ETH',
          decimals: 18,
        },
        rpcUrls: ['https://sepolia.infura.io/v3/'],
        blockExplorerUrls: ['https://sepolia.etherscan.io/'],
      };
    case '137':
      return {
        chainId: '0x89',
        chainName: 'Polygon Mainnet',
        nativeCurrency: {
          name: 'MATIC',
          symbol: 'MATIC',
          decimals: 18,
        },
        rpcUrls: ['https://polygon-rpc.com/'],
        blockExplorerUrls: ['https://polygonscan.com/'],
      };
    case '80001':
      return {
        chainId: '0x13881',
        chainName: 'Polygon Mumbai Testnet',
        nativeCurrency: {
          name: 'MATIC',
          symbol: 'MATIC',
          decimals: 18,
        },
        rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
        blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
      };
    default:
      throw new Error(`Chain ID ${chainId} not supported`);
  }
}

// Add Ethereum to Window object
declare global {
  interface Window {
    ethereum: any;
  }
}
