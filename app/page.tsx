"use client";

import { fontUnbounded } from "@/fonts";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowUpDown, ArrowUpDown as SortIcon } from "lucide-react";
import { useRef, useState } from "react";
import { wormholeService } from "@/lib/bridge/wormhole-service";
import { usePolkadotExtension } from "@/providers/polkadot-extension-provider";
import { toast } from 'sonner';

// Network configuration
const NETWORKS = [
  {
    id: 'ethereum',
    name: 'Ethereum',
    nativeSymbol: 'ETH',
    icon: '🔷',
    color: 'bg-blue-500'
  },
  {
    id: 'arbitrum',
    name: 'Arbitrum',
    nativeSymbol: 'ETH',
    icon: '🔵',
    color: 'bg-blue-600'
  },
  {
    id: 'base',
    name: 'Base',
    nativeSymbol: 'ETH',
    icon: '🔵',
    color: 'bg-blue-400'
  },
  {
    id: 'solana',
    name: 'Solana',
    nativeSymbol: 'SOL',
    icon: '🟣',
    color: 'bg-purple-500'
  },
  {
    id: 'moonbeam',
    name: 'Moonbeam',
    nativeSymbol: 'GLMR',
    icon: '🌙',
    color: 'bg-teal-500'
  }
];

// Assets per network configuration
const ASSETS_BY_NETWORK = {
  ethereum: [
    { symbol: 'ETH', name: 'Ethereum', icon: '🔷', isNative: true },
    { symbol: 'USDC', name: 'USD Coin', icon: '💵', isNative: false },
    { symbol: 'USDT', name: 'Tether USD', icon: '💰', isNative: false },
    { symbol: 'PEPE', name: 'Pepe', icon: '🐸', isNative: false },
    { symbol: 'SHIB', name: 'Shiba Inu', icon: '🐕', isNative: false }
  ],
  arbitrum: [
    { symbol: 'ETH', name: 'Ethereum', icon: '🔷', isNative: true },
    { symbol: 'USDC', name: 'USD Coin', icon: '💵', isNative: false },
    { symbol: 'USDT', name: 'Tether USD', icon: '💰', isNative: false },
    { symbol: 'ARB', name: 'Arbitrum', icon: '🔵', isNative: false }
  ],
  base: [
    { symbol: 'ETH', name: 'Ethereum', icon: '🔷', isNative: true },
    { symbol: 'USDC', name: 'USD Coin', icon: '💵', isNative: false },
    { symbol: 'USDT', name: 'Tether USD', icon: '💰', isNative: false },
    { symbol: 'BENJI', name: 'Benji Bananas', icon: '🍌', isNative: false }
  ],
  solana: [
    { symbol: 'SOL', name: 'Solana', icon: '🟣', isNative: true },
    { symbol: 'USDC', name: 'USD Coin', icon: '💵', isNative: false },
    { symbol: 'USDT', name: 'Tether USD', icon: '💰', isNative: false },
    { symbol: 'BONK', name: 'Bonk', icon: '🐕‍🦺', isNative: false },
    { symbol: 'WIF', name: 'dogwifhat', icon: '🐶', isNative: false }
  ],
  moonbeam: [
    { symbol: 'GLMR', name: 'Moonbeam', icon: '🌙', isNative: true },
    { symbol: 'USDC', name: 'USD Coin', icon: '💵', isNative: false },
    { symbol: 'USDT', name: 'Tether USD', icon: '💰', isNative: false },
    { symbol: 'DOT', name: 'Polkadot', icon: '🔴', isNative: false }
  ]
};

type Network = typeof NETWORKS[0];
type Asset = typeof ASSETS_BY_NETWORK.ethereum[0];

// Token price map (in USD)
const TOKEN_PRICES = {
  GLMR: 0.07891,
  SOL: 175.96,
  DOT: 4.21,
  ETH: 3428.37,
  USDC: 1.0,
  USDT: 1.0,
  ARB: 4.21,
  BONK: 0.00003737,
  PEPE: 0.000008,
  SHIB: 0.000009,
  WIF: 0.15,
  BENJI: 0.02,
  MATIC: 0.42
} as const;

// Mock bridge quotes data
type BridgeQuote = {
  id: string;
  name: string;
  logo: string;
  estimatedTime: string;
  totalFees: string;
  tokensReceived: number;
  route?: string;
  isLoading?: boolean;
};

const BRIDGE_PROVIDERS = [
  {
    id: 'snowbridge',
    name: 'Snowbridge',
    logo: '❄️',
    estimatedTime: '15-20 min',
    totalFees: '$12.50',
    feeMultiplier: 0.985, // 1.5% total fees
    route: 'Direct'
  },
  {
    id: 'wormhole',
    name: 'Wormhole',
    logo: '🌀',
    estimatedTime: '5-10 min',
    totalFees: '$8.75',
    feeMultiplier: 0.991, // 0.9% total fees
    route: 'Fast'
  },
  {
    id: 'rhino',
    name: 'Rhino.fi',
    logo: '🦏',
    estimatedTime: '3-5 min',
    totalFees: '$15.20',
    feeMultiplier: 0.982, // 1.8% total fees
    route: 'Optimized'
  }
];

const generateMockQuotes = (amount: number, sourceAsset: Asset, destinationAsset: Asset): BridgeQuote[] => {
  // Get token prices
  const sourcePrice = TOKEN_PRICES[sourceAsset.symbol as keyof typeof TOKEN_PRICES] || 1;
  const destinationPrice = TOKEN_PRICES[destinationAsset.symbol as keyof typeof TOKEN_PRICES] || 1;

  // Calculate exchange rate (how many destination tokens for 1 source token)
  const exchangeRate = sourcePrice / destinationPrice;

  // Calculate base amount in destination tokens
  const baseDestinationAmount = amount * exchangeRate;

  return BRIDGE_PROVIDERS.map(provider => {
    // Apply bridge fees to get final amount
    const finalAmount = baseDestinationAmount * provider.feeMultiplier;

    // Calculate fees in USD
    const sourceValueUSD = amount * sourcePrice;
    const destinationValueUSD = finalAmount * destinationPrice;
    const feeUSD = sourceValueUSD - destinationValueUSD;

    return {
      id: provider.id,
      name: provider.name,
      logo: provider.logo,
      estimatedTime: provider.estimatedTime,
      totalFees: `$${feeUSD.toFixed(2)}`,
      tokensReceived: finalAmount,
      route: provider.route
    };
  }).sort((a, b) => b.tokensReceived - a.tokensReceived);
};

function ChainSelector({
  label,
  selectedChain,
  onChainSelect,
  excludeChain
}: {
  label: string;
  selectedChain: Network | null;
  onChainSelect: (chain: Network) => void;
  excludeChain?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const availableChains = NETWORKS.filter(chain => chain.id !== excludeChain);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-muted-foreground">{label}</label>
      <div className="relative">
        <Button
          variant="outline"
          className="w-full justify-between h-16"
          onClick={() => setIsOpen(!isOpen)}
        >
          {selectedChain ? (
            <div className="flex items-center gap-3">
              <span className="text-2xl">{selectedChain.icon}</span>
              <div className="text-left">
                <div className="font-medium">{selectedChain.name}</div>
                <div className="text-sm text-muted-foreground">{selectedChain.nativeSymbol}</div>
              </div>
            </div>
          ) : (
            <span className="text-muted-foreground">Select chain</span>
          )}
        </Button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-lg z-10">
            {availableChains.map((chain) => (
              <Button
                key={chain.id}
                variant="ghost"
                className="w-full justify-start h-16 rounded-none"
                onClick={() => {
                  onChainSelect(chain);
                  setIsOpen(false);
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{chain.icon}</span>
                  <div className="text-left">
                    <div className="font-medium">{chain.name}</div>
                    <div className="text-sm text-muted-foreground">{chain.nativeSymbol}</div>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AssetSelector({
  label,
  selectedAsset,
  onAssetSelect,
  networkId,
  disabled
}: {
  label: string;
  selectedAsset: Asset | null;
  onAssetSelect: (asset: Asset) => void;
  networkId?: string;
  disabled?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const availableAssets = networkId ? ASSETS_BY_NETWORK[networkId as keyof typeof ASSETS_BY_NETWORK] || [] : [];

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-muted-foreground">{label}</label>
      <div className="relative">
        <Button
          variant="outline"
          className="w-full justify-between h-16"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
        >
          {selectedAsset ? (
            <div className="flex items-center gap-3">
              <span className="text-2xl">{selectedAsset.icon}</span>
              <div className="text-left">
                <div className="font-medium">{selectedAsset.symbol}</div>
                <div className="text-sm text-muted-foreground">{selectedAsset.name}</div>
              </div>
            </div>
          ) : (
            <span className="text-muted-foreground">
              {disabled ? "Select chain first" : "Select asset"}
            </span>
          )}
        </Button>

        {isOpen && !disabled && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-lg z-10">
            {availableAssets.map((asset) => (
              <Button
                key={asset.symbol}
                variant="ghost"
                className="w-full justify-start h-16 rounded-none"
                onClick={() => {
                  onAssetSelect(asset);
                  setIsOpen(false);
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{asset.icon}</span>
                  <div className="text-left">
                    <div className="font-medium">{asset.symbol}</div>
                    <div className="text-sm text-muted-foreground">{asset.name}</div>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  const { selectedAccount, isInitializing } = usePolkadotExtension();
  const [sourceChain, setSourceChain] = useState<Network | null>(null);
  const [destinationChain, setDestinationChain] = useState<Network | null>(null);
  const [sourceAsset, setSourceAsset] = useState<Asset | null>(null);
  const [destinationAsset, setDestinationAsset] = useState<Asset | null>(null);
  const [showQuotes, setShowQuotes] = useState(false);
  const [amount, setAmount] = useState('');
  const [quotes, setQuotes] = useState<BridgeQuote[]>([]);
  const [sortBy, setSortBy] = useState<'tokensReceived' | 'estimatedTime'>('tokensReceived');
  const [loadingQuotes, setLoadingQuotes] = useState<string[]>([]);
  const requestIdRef = useRef(0);
  const [bridgeStatus, setBridgeStatus] = useState<{
    status: 'idle' | 'signing' | 'sending' | 'success' | 'error';
    message: string;
    txHash?: string;
  }>({ status: 'idle', message: '' });

  const invalidateRequests = () => {
    requestIdRef.current += 1;
  };


  // Check if we have complete data and automatically fetch quotes
  const checkAndFetchQuotes = () => {
    if (sourceChain && destinationChain && sourceAsset && destinationAsset) {
      handleContinue();
    }
  };

  const swapChains = () => {
    const tempChain = sourceChain;
    const tempAsset = sourceAsset;
    setSourceChain(destinationChain);
    setSourceAsset(destinationAsset);
    setDestinationChain(tempChain);
    setDestinationAsset(tempAsset);
  };

  const handleSourceChainChange = (chain: Network) => {
    setSourceChain(chain);
    // Auto-select the native token for the chain
    const chainAssets = ASSETS_BY_NETWORK[chain.id as keyof typeof ASSETS_BY_NETWORK] || [];
    const nativeAsset = chainAssets.find(asset => asset.isNative);
    setSourceAsset(nativeAsset || null);

    // Check if we can fetch quotes after this change with the new values
    setTimeout(() => {
      if (chain && destinationChain && nativeAsset && destinationAsset) {
        handleContinue();
      }
    }, 100);

    invalidateRequests();
  };

  const handleDestinationChainChange = (chain: Network) => {
    setDestinationChain(chain);
    // Auto-select the native token for the chain
    const chainAssets = ASSETS_BY_NETWORK[chain.id as keyof typeof ASSETS_BY_NETWORK] || [];
    const nativeAsset = chainAssets.find(asset => asset.isNative);
    setDestinationAsset(nativeAsset || null);

    // Check if we can fetch quotes after this change with the new values
    setTimeout(() => {
      if (sourceChain && chain && sourceAsset && nativeAsset) {
        handleContinue();
      }
    }, 100);

    invalidateRequests();
  };

  const handleContinue = () => {
    setShowQuotes(true);
    setQuotes([]);
    setLoadingQuotes(BRIDGE_PROVIDERS.map(p => p.id));

    // Generate new request ID
    requestIdRef.current += 1;
    const currentRequestId = requestIdRef.current;

    // Start loading quotes immediately with staggered delays
    BRIDGE_PROVIDERS.forEach((provider, index) => {
      const delay = Math.random() * 5400 + 1000; // Random delay

      setTimeout(async () => {
        // Check if request is still valid
        if (requestIdRef.current !== currentRequestId) {
          setLoadingQuotes(prev => prev.filter(id => id !== provider.id));
          return;
        }

        const currentAmount = parseFloat(amount) || 1; // Default to 1 if no amount

        let newQuote: BridgeQuote;

        if (provider.id === 'wormhole') {
          // Use real Wormhole API for Wormhole quotes (always Moonbeam GLMR -> Solana USDC)
          try {
            const wormholeQuote = await wormholeService.getQuote(
              currentAmount,
              'moonbeam',
              'solana',
              'GLMR',
              'SOL'
            );

            console.log("quote received: ", wormholeQuote);

            newQuote = {
              id: provider.id,
              name: provider.name,
              logo: provider.logo,
              estimatedTime: wormholeQuote.estimatedTime,
              totalFees: wormholeQuote.totalFees,
              tokensReceived: wormholeQuote.tokensReceived,
              route: wormholeQuote.route,
              isLoading: false
            };
          } catch (error) {
            console.error('Wormhole quote failed:', error);
            // Fallback to mock data if Wormhole fails
            newQuote = {
              id: provider.id,
              name: provider.name,
              logo: provider.logo,
              estimatedTime: provider.estimatedTime,
              totalFees: provider.totalFees,
              tokensReceived: currentAmount * provider.feeMultiplier,
              route: 'Error - Using Mock Data',
              isLoading: false
            };
          }
        } else {
          // Use mock data for other providers with realistic calculations
          const sourcePrice = TOKEN_PRICES[sourceAsset?.symbol as keyof typeof TOKEN_PRICES] || 1;
          const destinationPrice = TOKEN_PRICES[destinationAsset?.symbol as keyof typeof TOKEN_PRICES] || 1;
          const exchangeRate = sourcePrice / destinationPrice;
          const baseDestinationAmount = currentAmount * exchangeRate;
          const finalAmount = baseDestinationAmount * provider.feeMultiplier;
          const sourceValueUSD = currentAmount * sourcePrice;
          const destinationValueUSD = finalAmount * destinationPrice;
          const feeUSD = sourceValueUSD - destinationValueUSD;

          newQuote = {
            id: provider.id,
            name: provider.name,
            logo: provider.logo,
            estimatedTime: provider.estimatedTime,
            totalFees: `$${feeUSD.toFixed(2)}`,
            tokensReceived: finalAmount,
            route: provider.route,
            isLoading: false
          };
        }

        // Double-check validity before updating state
        if (requestIdRef.current !== currentRequestId) {
          setLoadingQuotes(prev => prev.filter(id => id !== provider.id));
          return;
        }

        // Add the new quote and remove from loading
        setQuotes(prevQuotes => {
          const updatedQuotes = [...prevQuotes, newQuote];
          // Re-sort quotes each time a new one arrives
          return updatedQuotes.sort((a, b) => {
            if (sortBy === 'tokensReceived') {
              return b.tokensReceived - a.tokensReceived;
            } else {
              const getMinutes = (time: string) => {
                const match = time.match(/(\d+)-?(\d+)?\s*min/);
                return match ? parseInt(match[1]) : 999;
              };
              return getMinutes(a.estimatedTime) - getMinutes(b.estimatedTime);
            }
          });
        });

        setLoadingQuotes(prev => prev.filter(id => id !== provider.id));
      }, delay);
    });
  };

  const handleAmountChange = (value: string) => {
    setAmount(value);
    invalidateRequests();

    // Regenerate quotes when amount changes
    if (value && sourceAsset && destinationAsset) {
      const mockQuotes = generateMockQuotes(parseFloat(value), sourceAsset, destinationAsset);
      setQuotes(mockQuotes);
    }
  };

  const sortQuotes = (criteria: 'tokensReceived' | 'estimatedTime') => {
    setSortBy(criteria);
    const sorted = [...quotes].sort((a, b) => {
      if (criteria === 'tokensReceived') {
        return b.tokensReceived - a.tokensReceived;
      } else {
        // Sort by time (convert to minutes for comparison)
        const getMinutes = (time: string) => {
          const match = time.match(/(\d+)-?(\d+)?\s*min/);
          return match ? parseInt(match[1]) : 999;
        };
        return getMinutes(a.estimatedTime) - getMinutes(b.estimatedTime);
      }
    });
    setQuotes(sorted);
  };

  const handleQuoteSelect = async (quote: BridgeQuote) => {
    try {
      // Check if wallet is connected
      if (!selectedAccount) {
        //TODO instead open the connect wallet thing here
        toast.error('Wallet not connected');
        return;
      }

      // Handle wormhole
      if (quote.id === 'wormhole') {
        // For demo purposes - in real app you would collect recipient address
        const recipient = '8F8Amu87zBsNqxzSQipQUVmvVwwhJ9tgpTwtu9F4qXPx';
        
        await executeWormholeBridge(
          parseFloat(amount) || 1,
          recipient
        );
      } else {
        alert(`${quote.name} bridge is not implemented in this demo`);
      }
    } catch (error) {
      console.error('Error handling quote selection:', error);
      alert('Failed to sign message. Please try again.');
    }
  };

  const executeWormholeBridge = async (
    amount: number,
    recipient: string
  ) => {
    if (!selectedAccount) {
      toast.error('Wallet not connected');
      return;
    }
  
    try {
      setBridgeStatus({
        status: 'signing',
        message: 'Requesting transaction signature...'
      });
  
      // Connect to Moonbeam network
      const provider = new WsProvider('wss://wss.api.moonbeam.network');
      const api = await ApiPromise.create({ provider });
  
      // Get wallet extension
      const injector = await web3FromSource(selectedAccount.meta.source);
      
      setBridgeStatus({
        status: 'sending',
        message: 'Sending transaction to network...'
      });
  
      // Execute bridge transaction (simplified example)
      const tx = api.tx.ethereumXcm.transactThroughProxy(
        {
          V2: {
            gasLimit: 200000,
            action: { Call: '0xWORMHOLE_CONTRACT_ADDRESS' },
            value: amount * 1e18, // GLMR has 18 decimals
            input: `0xBRIDGE_CALLDATA${recipient}`,
          }
        }
      );
  
      const txHash = await new Promise<string>((resolve, reject) => {
        tx.signAndSend(
          selectedAccount.address,
          { signer: injector.signer },
          ({ status, txHash }) => {
            if (status.isInBlock) {
              resolve(txHash.toString());
            }
          }
        ).catch(reject);
      });
  
      setBridgeStatus({
        status: 'success',
        message: 'Transaction successful!',
        txHash
      });
      
      // Monitor bridge completion (would be handled by backend in real app)
      setTimeout(() => {
        toast.success('Bridge completed! Funds arrived at destination.');
      }, 30000);
  
    } catch (error) {
      console.error('Bridge execution error:', error);
      setBridgeStatus({
        status: 'error',
        message: `Error: ${error instanceof Error ? error.message : 'Transaction failed'}`
      });
    }
  };

  return (
    <main className="flex min-h-screen p-6 sm:p-8 pb-20 flex-col gap-8 items-center justify-center relative">
      <div className="text-center space-y-4">
        <h1
          className={cn(
            "text-5xl lg:text-6xl leading-[1.2] bg-clip-text text-transparent bg-gradient-to-r from-foreground/70 via-foreground to-foreground/70",
            fontUnbounded.className,
          )}
        >
          ACDC Bridge
        </h1>
        <p className="text-lg text-muted-foreground">Your crypto where you need it, when you need it!</p>
      </div>

      <Card className="w-full max-w-lg">
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <ChainSelector
              label="From Chain"
              selectedChain={sourceChain}
              onChainSelect={handleSourceChainChange}
              excludeChain={destinationChain?.id}
            />
            <AssetSelector
              label="Asset"
              selectedAsset={sourceAsset}
              onAssetSelect={(asset) => {
                setSourceAsset(asset);
                setTimeout(() => checkAndFetchQuotes(), 100);
              }}
              networkId={sourceChain?.id}
              disabled={!sourceChain}
            />
          </div>

          <div className="flex justify-center">
            <Button
              variant="outline"
              size="icon"
              onClick={swapChains}
              disabled={!sourceChain || !destinationChain}
              className="rounded-full"
            >
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <ChainSelector
              label="To Chain"
              selectedChain={destinationChain}
              onChainSelect={handleDestinationChainChange}
              excludeChain={sourceChain?.id}
            />
            <AssetSelector
              label="Asset"
              selectedAsset={destinationAsset}
              onAssetSelect={(asset) => {
                setDestinationAsset(asset);
                setTimeout(() => checkAndFetchQuotes(), 100);
              }}
              networkId={destinationChain?.id}
              disabled={!destinationChain}
            />
          </div>


        </CardContent>
      </Card>

      {showQuotes && (
        <div className="w-full max-w-6xl space-y-6">
          {/* Amount Input Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Enter Amount</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{sourceAsset?.icon}</span>
                  <span className="font-medium">{sourceAsset?.symbol}</span>
                </div>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  className="text-center text-xl font-medium w-48"
                />
              </div>
            </CardContent>
          </Card>

          {/* Bridge Quotes Table */}
          {(quotes.length > 0 || loadingQuotes.length > 0) && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Bridge Options</CardTitle>
                  <div className="flex space-x-2">
                    <Button
                      variant={sortBy === 'tokensReceived' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => sortQuotes('tokensReceived')}
                    >
                      Best Rate
                    </Button>
                    <Button
                      variant={sortBy === 'estimatedTime' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => sortQuotes('estimatedTime')}
                    >
                      Fastest
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Bridge</th>
                        <th className="text-left py-3 px-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => sortQuotes('estimatedTime')}
                            className="p-0 h-auto font-semibold"
                          >
                            Est. Time
                            {sortBy === 'estimatedTime' && <SortIcon className="ml-1 h-3 w-3" />}
                          </Button>
                        </th>
                        <th className="text-left py-3 px-4">Total Fees</th>
                        <th className="text-left py-3 px-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => sortQuotes('tokensReceived')}
                            className="p-0 h-auto font-semibold"
                          >
                            You Receive
                            {sortBy === 'tokensReceived' && <SortIcon className="ml-1 h-3 w-3" />}
                          </Button>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Loading skeleton rows */}
                      {loadingQuotes.map((loadingId) => {
                        const provider = BRIDGE_PROVIDERS.find(p => p.id === loadingId);
                        return (
                          <tr key={`loading-${loadingId}`} className="border-b animate-pulse">
                            <td className="py-4 px-4">
                              <div className="flex items-center space-x-3">
                                <span className="text-2xl opacity-50">{provider?.logo}</span>
                                <div>
                                  <div className="font-medium text-muted-foreground">{provider?.name}</div>
                                  <div className="text-sm text-muted-foreground">Loading...</div>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="h-4 bg-gray-200 rounded animate-pulse w-12"></div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                            </td>

                          </tr>
                        );
                      })}

                      {/* Actual quote rows */}
                      {quotes.map((quote, index) => {
                        // Find the fastest quote (shortest time)
                        const fastestQuote = quotes.reduce((fastest, current) => {
                          const getFastestTime = (time: string) => {
                            const match = time.match(/(\d+)-?(\d+)?\s*min/);
                            return match ? parseInt(match[1]) : 999;
                          };
                          return getFastestTime(current.estimatedTime) < getFastestTime(fastest.estimatedTime) ? current : fastest;
                        });

                        // Find the top value quote (most tokens received)
                        const topValueQuote = quotes.reduce((topValue, current) => {
                          return current.tokensReceived > topValue.tokensReceived ? current : topValue;
                        });

                        const isFastest = quote.id === fastestQuote.id;
                        const isTopValue = quote.id === topValueQuote.id;

                        return (
                          <tr
                            key={quote.id}
                            className="border-b hover:bg-muted/50 cursor-pointer transition-colors"
                            onClick={() => handleQuoteSelect(quote)}
                          >
                            <td className="py-4 px-4">
                              <div className="flex items-center space-x-3">
                                <span className="text-2xl">{quote.logo}</span>
                                <div>
                                  <div className="font-medium">{quote.name}</div>
                                  {quote.route && (
                                    <div className="text-sm text-muted-foreground">{quote.route}</div>
                                  )}
                                </div>
                                <div className="flex flex-col gap-1">
                                  {isFastest && (
                                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                      Fastest
                                    </span>
                                  )}
                                  {isTopValue && (
                                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                      Top Value
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <span className="font-medium">{quote.estimatedTime}</span>
                            </td>
                            <td className="py-4 px-4">
                              <span className="font-medium">{quote.totalFees}</span>
                            </td>
                            <td className="py-4 px-4">
                              <div className="font-medium">
                                {quote.tokensReceived.toFixed(6)} {destinationAsset?.symbol}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <Card className="fixed bottom-4 right-4 w-80 z-50">
        <CardHeader>
          <CardTitle>Bridge Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            {bridgeStatus.status === 'idle' && (
              <div className="text-muted-foreground">No transaction in progress</div>
            )}
            
            {bridgeStatus.status === 'signing' && (
              <>
                <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse" />
                <span>{bridgeStatus.message}</span>
              </>
            )}
            
            {bridgeStatus.status === 'sending' && (
              <>
                <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
                <span>{bridgeStatus.message}</span>
              </>
            )}
            
            {bridgeStatus.status === 'success' && (
              <>
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <div>
                  <p>{bridgeStatus.message}</p>
                  {bridgeStatus.txHash && (
                    <a 
                      href={`https://moonscan.io/tx/${bridgeStatus.txHash}`} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 text-sm"
                    >
                      View transaction
                    </a>
                  )}
                </div>
              </>
            )}
            
            {bridgeStatus.status === 'error' && (
              <>
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-red-500">{bridgeStatus.message}</span>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
