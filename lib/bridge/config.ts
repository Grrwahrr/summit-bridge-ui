import { SupportedChain, SupportedToken, BridgeProvider, BridgeProviderConfig } from './types';

// Supported Chains Configuration
export const supportedChains: SupportedChain[] = [
  {
    id: 'ethereum',
    name: 'Ethereum',
    icon: null, // Will be replaced with actual icon component
    nativeToken: 'ETH',
    supportedBridges: [BridgeProvider.WORMHOLE, BridgeProvider.RHINO, BridgeProvider.AXELAR],
    chainType: 'evm',
    rpcUrl: 'https://eth.llamarpc.com',
    explorerUrl: 'https://etherscan.io'
  },
  {
    id: 'solana',
    name: 'Solana',
    icon: null, // Will be replaced with actual icon component
    nativeToken: 'SOL',
    supportedBridges: [BridgeProvider.WORMHOLE, BridgeProvider.RHINO],
    chainType: 'solana',
    rpcUrl: 'https://api.mainnet-beta.solana.com',
    explorerUrl: 'https://solscan.io'
  },
  {
    id: 'polygon',
    name: 'Polygon',
    icon: null, // Will be replaced with actual icon component
    nativeToken: 'MATIC',
    supportedBridges: [BridgeProvider.WORMHOLE, BridgeProvider.AXELAR],
    chainType: 'evm',
    rpcUrl: 'https://polygon.llamarpc.com',
    explorerUrl: 'https://polygonscan.com'
  },
  {
    id: 'arbitrum',
    name: 'Arbitrum',
    icon: null, // Will be replaced with actual icon component
    nativeToken: 'ETH',
    supportedBridges: [BridgeProvider.WORMHOLE, BridgeProvider.AXELAR],
    chainType: 'evm',
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    explorerUrl: 'https://arbiscan.io'
  },
  {
    id: 'polkadot',
    name: 'Polkadot',
    icon: null, // Will be replaced with actual icon component
    nativeToken: 'DOT',
    supportedBridges: [BridgeProvider.SNOWBRIDGE],
    chainType: 'substrate',
    rpcUrl: 'wss://rpc.polkadot.io',
    explorerUrl: 'https://polkadot.subscan.io'
  },
  {
    id: 'polkadot-asset-hub',
    name: 'Polkadot Asset Hub',
    icon: null, // Will be replaced with actual icon component
    nativeToken: 'DOT',
    supportedBridges: [BridgeProvider.SNOWBRIDGE],
    chainType: 'substrate',
    rpcUrl: 'wss://polkadot-asset-hub-rpc.polkadot.io',
    explorerUrl: 'https://assethub-polkadot.subscan.io'
  }
];

// Supported Tokens Configuration
export const supportedTokens: SupportedToken[] = [
  {
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    addresses: {
      ethereum: '0xA0b86a33E6441E6C7D3E4C5B4B6B8B8B8B8B8B8B',
      solana: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
      polygon: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
      arbitrum: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831'
    },
    icon: '/tokens/usdc.svg',
    coingeckoId: 'usd-coin'
  },
  {
    symbol: 'USDT',
    name: 'Tether USD',
    decimals: 6,
    addresses: {
      ethereum: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      solana: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
      polygon: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
      arbitrum: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9'
    },
    icon: '/tokens/usdt.svg',
    coingeckoId: 'tether'
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    decimals: 18,
    addresses: {
      ethereum: '0x0000000000000000000000000000000000000000', // Native ETH
      arbitrum: '0x0000000000000000000000000000000000000000', // Native ETH on Arbitrum
      polygon: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619' // Wrapped ETH on Polygon
    },
    icon: '/tokens/eth.svg',
    coingeckoId: 'ethereum'
  },
  {
    symbol: 'SOL',
    name: 'Solana',
    decimals: 9,
    addresses: {
      solana: '11111111111111111111111111111111' // Native SOL
    },
    icon: '/tokens/sol.svg',
    coingeckoId: 'solana'
  },
  {
    symbol: 'DOT',
    name: 'Polkadot',
    decimals: 10,
    addresses: {
      polkadot: 'native',
      'polkadot-asset-hub': 'native'
    },
    icon: '/tokens/dot.svg',
    coingeckoId: 'polkadot'
  },
  {
    symbol: 'MATIC',
    name: 'Polygon',
    decimals: 18,
    addresses: {
      polygon: '0x0000000000000000000000000000000000000000', // Native MATIC
      ethereum: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0' // MATIC on Ethereum
    },
    icon: '/tokens/matic.svg',
    coingeckoId: 'matic-network'
  }
];

// Bridge Provider Configurations
export const bridgeProviderConfigs: BridgeProviderConfig[] = [
  {
    name: BridgeProvider.WORMHOLE,
    supportedChains: ['ethereum', 'solana', 'polygon', 'arbitrum'],
    supportedTokens: ['USDC', 'USDT', 'ETH', 'SOL'],
    sdkConfig: {
      network: 'Mainnet',
      platforms: ['evm', 'solana']
    },
    enabled: true
  },
  {
    name: BridgeProvider.RHINO,
    supportedChains: ['ethereum', 'solana', 'polygon', 'arbitrum'],
    supportedTokens: ['USDC', 'USDT', 'ETH'],
    sdkConfig: {
      apiUrl: 'https://api.rhino.fi',
      version: 'v1'
    },
    enabled: true
  },
  {
    name: BridgeProvider.AXELAR,
    supportedChains: ['ethereum', 'polygon', 'arbitrum'],
    supportedTokens: ['USDC', 'USDT', 'ETH'],
    sdkConfig: {
      environment: 'mainnet',
      rpcUrls: {}
    },
    enabled: true
  },
  {
    name: BridgeProvider.SNOWBRIDGE,
    supportedChains: ['ethereum', 'polkadot', 'polkadot-asset-hub'],
    supportedTokens: ['ETH', 'DOT'],
    sdkConfig: {
      polkadotRpc: 'wss://rpc.polkadot.io',
      ethereumRpc: 'https://eth.llamarpc.com'
    },
    enabled: true
  }
];

// Utility functions for configuration
export const getChainById = (chainId: string): SupportedChain | undefined => {
  return supportedChains.find(chain => chain.id === chainId);
};

export const getTokenBySymbol = (symbol: string): SupportedToken | undefined => {
  return supportedTokens.find(token => token.symbol === symbol);
};

export const getTokensForChain = (chainId: string): SupportedToken[] => {
  return supportedTokens.filter(token => token.addresses[chainId]);
};

export const getBridgeProvidersForRoute = (
  sourceChainId: string,
  destinationChainId: string
): BridgeProvider[] => {
  const sourceChain = getChainById(sourceChainId);
  const destinationChain = getChainById(destinationChainId);
  
  if (!sourceChain || !destinationChain) {
    return [];
  }
  
  // Find providers that support both chains
  return sourceChain.supportedBridges.filter(provider =>
    destinationChain.supportedBridges.includes(provider)
  );
};

export const isRouteSupported = (
  sourceChainId: string,
  destinationChainId: string,
  sourceTokenSymbol: string,
  destinationTokenSymbol: string
): boolean => {
  const providers = getBridgeProvidersForRoute(sourceChainId, destinationChainId);
  
  if (providers.length === 0) {
    return false;
  }
  
  // Check if at least one provider supports both tokens
  return providers.some(provider => {
    const config = bridgeProviderConfigs.find(c => c.name === provider);
    return config && 
           config.supportedTokens.includes(sourceTokenSymbol) &&
           config.supportedTokens.includes(destinationTokenSymbol);
  });
};