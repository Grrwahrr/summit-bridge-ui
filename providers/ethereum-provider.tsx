"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { ethers } from 'ethers';
import { toast } from 'sonner';

interface EthereumContextType {
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  account: string | null;
  chainId: number | null;
  isConnecting: boolean;
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const EthereumContext = createContext<EthereumContextType>({
  provider: null,
  signer: null,
  account: null,
  chainId: null,
  isConnecting: false,
  isConnected: false,
  connect: async () => {},
  disconnect: () => {},
});

export function EthereumProvider({ children }: { children: ReactNode }) {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  // Check if MetaMask is installed
  const isMetaMaskInstalled = () => {
    return typeof window !== 'undefined' && window.ethereum !== undefined;
  };

  // Initialize provider on component mount
  useEffect(() => {
    if (isMetaMaskInstalled() && window.ethereum) {
      const ethereumProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(ethereumProvider);

      // Check if we have a previously connected account
      const checkConnection = async () => {
        try {
          const accounts = await ethereumProvider.listAccounts();
          if (accounts.length > 0) {
            const signer = await ethereumProvider.getSigner();
            const network = await ethereumProvider.getNetwork();
            
            setSigner(signer);
            setAccount(accounts[0].address);
            setChainId(Number(network.chainId));
            setIsConnected(true);
          }
        } catch (error) {
          console.error("Failed to check existing connection:", error);
        }
      };
      
      checkConnection();
    }
  }, []);

  // Set up event listeners for account and chain changes
  useEffect(() => {
    if (!isMetaMaskInstalled() || !provider) return;

    const handleAccountsChanged = async (accounts: string[]) => {
      if (accounts.length === 0) {
        // User disconnected their wallet
        disconnect();
      } else if (accounts[0] !== account) {
        // Account changed
        try {
          const newSigner = await provider.getSigner();
          setSigner(newSigner);
          setAccount(accounts[0]);
        } catch (error) {
          console.error("Failed to get signer after account change:", error);
        }
      }
    };

    const handleChainChanged = (chainIdHex: string) => {
      const newChainId = parseInt(chainIdHex, 16);
      setChainId(newChainId);
      
      // Refresh the page to ensure all state is updated correctly
      // This is recommended by MetaMask
      window.location.reload();
    };

    const handleDisconnect = (error: { code: number; message: string }) => {
      console.error("MetaMask disconnected:", error);
      disconnect();
    };

    // Add event listeners
    window.ethereum?.on('accountsChanged', handleAccountsChanged);
    window.ethereum?.on('chainChanged', handleChainChanged);
    window.ethereum?.on('disconnect', handleDisconnect);

    // Clean up event listeners
    return () => {
      window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum?.removeListener('chainChanged', handleChainChanged);
      window.ethereum?.removeListener('disconnect', handleDisconnect);
    };
  }, [provider, account]);

  // Connect to MetaMask
  const connect = async () => {
    if (!isMetaMaskInstalled()) {
      toast.error("MetaMask is not installed. Please install MetaMask to continue.");
      window.open('https://metamask.io/download/', '_blank');
      return;
    }

    if (!provider) {
      toast.error("Provider not initialized");
      return;
    }

    setIsConnecting(true);

    try {
      // Request account access
      const accounts = await window.ethereum?.request({ 
        method: 'eth_requestAccounts' 
      });
      
      if (accounts.length === 0) {
        throw new Error("No accounts found");
      }

      const newSigner = await provider.getSigner();
      const network = await provider.getNetwork();
      
      setSigner(newSigner);
      setAccount(accounts[0]);
      setChainId(Number(network.chainId));
      setIsConnected(true);
      
      toast.success("Connected to MetaMask");
    } catch (error) {
      console.error("Failed to connect to MetaMask:", error);
      if (error instanceof Error) {
        // User rejected the connection request
        if (error.message.includes("user rejected")) {
          toast.error("Connection rejected by user");
        } else {
          toast.error(`Failed to connect: ${error.message}`);
        }
      } else {
        toast.error("Failed to connect to MetaMask");
      }
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect from MetaMask
  const disconnect = () => {
    setSigner(null);
    setAccount(null);
    setIsConnected(false);
    toast.info("Disconnected from MetaMask");
  };

  return (
    <EthereumContext.Provider
      value={{
        provider,
        signer,
        account,
        chainId,
        isConnecting,
        isConnected,
        connect,
        disconnect,
      }}
    >
      {children}
    </EthereumContext.Provider>
  );
}

export function useEthereum() {
  const context = useContext(EthereumContext);
  if (!context) {
    throw new Error("useEthereum must be used within an EthereumProvider");
  }
  return context;
}

// Add TypeScript interface for window.ethereum
declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (request: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, listener: any) => void;
      removeListener: (event: string, listener: any) => void;
    };
  }
}