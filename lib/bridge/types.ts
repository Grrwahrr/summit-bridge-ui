import { ReactNode } from 'react';

// Bridge Provider Enum
export enum BridgeProvider {
  WORMHOLE = 'wormhole',
  RHINO = 'rhino',
  AXELAR = 'axelar',
  SNOWBRIDGE = 'snowbridge'
}

// Supported Chain Interface
export interface SupportedChain {
  id: string;
  name: string;
  icon: ReactNode;
  nativeToken: string;
  supportedBridges: BridgeProvider[];
  chainType: 'evm' | 'solana' | 'substrate';
  rpcUrl?: string;
  explorerUrl?: string;
}

// Supported Token Interface
export interface SupportedToken {
  symbol: string;
  name: string;
  decimals: number;
  addresses: Record<string, string>; // chainId -> token address
  icon?: string;
  coingeckoId?: string;
}

// Quote Interface
export interface Quote {
  provider: BridgeProvider;
  estimatedReceiveAmount: string;
  fees: {
    bridgeFee: string;
    gasFee: string;
    total: string;
  };
  estimatedTime: string;
  route?: string;
  isLoading: boolean;
  error?: string;
  expiresAt: number; // timestamp
  providerData?: any; // provider-specific data for execution
}

// Quote Request Interface
export interface QuoteRequest {
  sourceChain: SupportedChain;
  destinationChain: SupportedChain;
  sourceToken: SupportedToken;
  destinationToken: SupportedToken;
  amount: string;
}

// Bridge State Interface
export interface BridgeState {
  sourceChain?: SupportedChain;
  destinationChain?: SupportedChain;
  sourceToken?: SupportedToken;
  destinationToken?: SupportedToken;
  amount: string;
  quotes: Quote[];
  selectedQuote?: Quote;
  isLoadingQuotes: boolean;
  transaction: {
    status: 'idle' | 'pending' | 'success' | 'error';
    hash?: string;
    error?: string;
  };
}

// Transaction Request Interface
export interface TransactionRequest {
  quote: Quote;
  userAddress: string;
  signer: any; // Wallet-specific signer
}

// Transaction Status Interface
export interface TransactionStatus {
  hash: string;
  status: 'pending' | 'confirmed' | 'failed';
  confirmations?: number;
  blockNumber?: number;
  timestamp?: number;
}

// Bridge Provider Configuration Interface
export interface BridgeProviderConfig {
  name: BridgeProvider;
  supportedChains: string[];
  supportedTokens: string[];
  sdkConfig: any;
  enabled: boolean;
}

// Chain Token Pair Interface (for validation)
export interface ChainTokenPair {
  chainId: string;
  tokenSymbol: string;
}

// Bridge Route Interface
export interface BridgeRoute {
  sourceChain: string;
  destinationChain: string;
  sourceToken: string;
  destinationToken: string;
  providers: BridgeProvider[];
  minAmount?: string;
  maxAmount?: string;
}