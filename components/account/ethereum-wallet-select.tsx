"use client"

import { useState } from 'react';
import { useEthereum } from '@/providers/ethereum-provider';
import { Button } from '@/components/ui/button';
import { Wallet } from 'lucide-react';
import { toast } from 'sonner';

export function EthereumWalletSelect() {
  const { isConnected, isConnecting, account, chainId, connect, disconnect } = useEthereum();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const getNetworkName = (chainId: number | null) => {
    if (!chainId) return 'Unknown Network';
    
    switch (chainId) {
      case 1:
        return 'Ethereum';
      case 5:
        return 'Goerli';
      case 11155111:
        return 'Sepolia';
      case 1284:
        return 'Moonbeam';
      case 1285:
        return 'Moonriver';
      case 1287:
        return 'Moonbase Alpha';
      case 137:
        return 'Polygon';
      case 80001:
        return 'Mumbai';
      case 42161:
        return 'Arbitrum';
      case 421613:
        return 'Arbitrum Goerli';
      case 10:
        return 'Optimism';
      case 420:
        return 'Optimism Goerli';
      case 56:
        return 'BNB Chain';
      case 97:
        return 'BNB Testnet';
      case 43114:
        return 'Avalanche';
      case 43113:
        return 'Fuji';
      default:
        return `Chain ID: ${chainId}`;
    }
  };

  const handleConnect = async () => {
    try {
      await connect();
    } catch (error) {
      console.error('Failed to connect:', error);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    setIsDropdownOpen(false);
  };

  const copyAddressToClipboard = () => {
    if (account) {
      navigator.clipboard.writeText(account);
      toast.success('Address copied to clipboard');
    }
  };

  return (
    <div className="relative">
      {!isConnected ? (
        <Button
          variant="outline"
          onClick={handleConnect}
          disabled={isConnecting}
          className="flex items-center gap-2"
        >
          <Wallet className="w-4 h-4" />
          {isConnecting ? 'Connecting...' : 'Connect MetaMask'}
        </Button>
      ) : (
        <>
          <Button
            variant="outline"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2"
          >
            <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
            <span className="hidden sm:inline">{formatAddress(account)}</span>
            <span className="text-xs text-muted-foreground hidden sm:inline">
              ({getNetworkName(chainId)})
            </span>
          </Button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-background border z-10">
              <div className="py-1">
                <div className="px-4 py-2 text-sm">
                  <div className="font-medium">Connected to MetaMask</div>
                  <div className="text-muted-foreground">{getNetworkName(chainId)}</div>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700"></div>
                <button
                  onClick={copyAddressToClipboard}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Copy Address
                </button>
                <button
                  onClick={() => {
                    window.open(`https://etherscan.io/address/${account}`, '_blank');
                  }}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  View on Explorer
                </button>
                <div className="border-t border-gray-200 dark:border-gray-700"></div>
                <button
                  onClick={handleDisconnect}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Disconnect
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}