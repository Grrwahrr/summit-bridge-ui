"use client";

import { fontUnbounded } from "@/fonts";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowUpDown, ArrowUpDown as SortIcon } from "lucide-react";
import { useState } from "react";

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

// Mock bridge quotes data
type BridgeQuote = {
  id: string;
  name: string;
  logo: string;
  estimatedTime: string;
  totalFees: string;
  tokensReceived: number;
  route?: string;
};

const generateMockQuotes = (amount: number, sourceAsset: Asset, destinationAsset: Asset): BridgeQuote[] => {
  const baseAmount = amount;
  return [
    {
      id: 'snowbridge',
      name: 'Snowbridge',
      logo: '❄️',
      estimatedTime: '15-20 min',
      totalFees: '$12.50',
      tokensReceived: baseAmount * 0.985, // 1.5% total fees
      route: 'Direct'
    },
    {
      id: 'wormhole',
      name: 'Wormhole',
      logo: '🌀',
      estimatedTime: '5-10 min',
      totalFees: '$8.75',
      tokensReceived: baseAmount * 0.991, // 0.9% total fees
      route: 'Fast'
    },
    {
      id: 'rhino',
      name: 'Rhino.fi',
      logo: '🦏',
      estimatedTime: '3-5 min',
      totalFees: '$15.20',
      tokensReceived: baseAmount * 0.982, // 1.8% total fees
      route: 'Optimized'
    }
  ].sort((a, b) => b.tokensReceived - a.tokensReceived); // Sort by tokens received (descending)
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
  const [sourceChain, setSourceChain] = useState<Network | null>(null);
  const [destinationChain, setDestinationChain] = useState<Network | null>(null);
  const [sourceAsset, setSourceAsset] = useState<Asset | null>(null);
  const [destinationAsset, setDestinationAsset] = useState<Asset | null>(null);
  const [showQuotes, setShowQuotes] = useState(false);
  const [amount, setAmount] = useState('');
  const [quotes, setQuotes] = useState<BridgeQuote[]>([]);
  const [sortBy, setSortBy] = useState<'tokensReceived' | 'estimatedTime'>('tokensReceived');

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
    setSourceAsset(null); // Reset asset when chain changes
  };

  const handleDestinationChainChange = (chain: Network) => {
    setDestinationChain(chain);
    setDestinationAsset(null); // Reset asset when chain changes
  };

  const handleContinue = () => {
    setShowQuotes(true);
    // Generate mock quotes when amount is available
    if (amount && sourceAsset && destinationAsset) {
      const mockQuotes = generateMockQuotes(parseFloat(amount), sourceAsset, destinationAsset);
      setQuotes(mockQuotes);
    }
  };

  const handleAmountChange = (value: string) => {
    setAmount(value);
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

  return (
    <main className="flex min-h-screen p-6 sm:p-8 pb-20 flex-col gap-8 items-center justify-center relative">
      <div className="text-center space-y-4">
        <h1
          className={cn(
            "text-5xl lg:text-6xl leading-[1.2] bg-clip-text text-transparent bg-gradient-to-r from-foreground/70 via-foreground to-foreground/70",
            fontUnbounded.className,
          )}
        >
          Summit Bridge
        </h1>
        <p className="text-lg text-muted-foreground">Send cross chain with ease.</p>
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
              onAssetSelect={setSourceAsset}
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
              onAssetSelect={setDestinationAsset}
              networkId={destinationChain?.id}
              disabled={!destinationChain}
            />
          </div>

          <Button
            className="w-full"
            disabled={!sourceChain || !destinationChain || !sourceAsset || !destinationAsset}
            onClick={handleContinue}
          >
            Continue
          </Button>
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
          {amount && quotes.length > 0 && (
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
                        <th className="text-right py-3 px-4">Action</th>
                      </tr>
                    </thead>
                    <tbody>
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
                          <tr key={quote.id} className="border-b hover:bg-muted/50">
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
                            <td className="py-4 px-4 text-right">
                              <Button size="sm">
                                Select
                              </Button>
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
    </main>
  );
}
