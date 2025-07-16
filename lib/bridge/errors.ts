import { BridgeProvider } from './types';

// Bridge Error Types
export enum BridgeErrorType {
  INSUFFICIENT_BALANCE = 'insufficient_balance',
  UNSUPPORTED_ROUTE = 'unsupported_route',
  NETWORK_ERROR = 'network_error',
  WALLET_ERROR = 'wallet_error',
  TRANSACTION_FAILED = 'transaction_failed',
  QUOTE_EXPIRED = 'quote_expired',
  INVALID_AMOUNT = 'invalid_amount',
  PROVIDER_ERROR = 'provider_error',
  VALIDATION_ERROR = 'validation_error'
}

// Bridge Error Interface
export interface BridgeError {
  type: BridgeErrorType;
  message: string;
  provider?: BridgeProvider;
  retryable: boolean;
  code?: string;
  details?: any;
}

// Custom Bridge Error Class
export class BridgeException extends Error {
  public readonly type: BridgeErrorType;
  public readonly provider?: BridgeProvider;
  public readonly retryable: boolean;
  public readonly code?: string;
  public readonly details?: any;

  constructor(error: BridgeError) {
    super(error.message);
    this.name = 'BridgeException';
    this.type = error.type;
    this.provider = error.provider;
    this.retryable = error.retryable;
    this.code = error.code;
    this.details = error.details;
  }
}

// Error Factory Functions
export const createBridgeError = {
  insufficientBalance: (balance: string, required: string): BridgeError => ({
    type: BridgeErrorType.INSUFFICIENT_BALANCE,
    message: `Insufficient balance. Required: ${required}, Available: ${balance}`,
    retryable: false
  }),

  unsupportedRoute: (sourceChain: string, destinationChain: string): BridgeError => ({
    type: BridgeErrorType.UNSUPPORTED_ROUTE,
    message: `Bridge route from ${sourceChain} to ${destinationChain} is not supported`,
    retryable: false
  }),

  networkError: (message: string, provider?: BridgeProvider): BridgeError => ({
    type: BridgeErrorType.NETWORK_ERROR,
    message: `Network error: ${message}`,
    provider,
    retryable: true
  }),

  walletError: (message: string): BridgeError => ({
    type: BridgeErrorType.WALLET_ERROR,
    message: `Wallet error: ${message}`,
    retryable: false
  }),

  transactionFailed: (hash: string, reason?: string): BridgeError => ({
    type: BridgeErrorType.TRANSACTION_FAILED,
    message: `Transaction failed${reason ? `: ${reason}` : ''}`,
    retryable: false,
    details: { hash }
  }),

  quoteExpired: (provider: BridgeProvider): BridgeError => ({
    type: BridgeErrorType.QUOTE_EXPIRED,
    message: 'Quote has expired, please refresh',
    provider,
    retryable: true
  }),

  invalidAmount: (amount: string, reason: string): BridgeError => ({
    type: BridgeErrorType.INVALID_AMOUNT,
    message: `Invalid amount ${amount}: ${reason}`,
    retryable: false
  }),

  providerError: (provider: BridgeProvider, message: string, code?: string): BridgeError => ({
    type: BridgeErrorType.PROVIDER_ERROR,
    message: `${provider} error: ${message}`,
    provider,
    retryable: true,
    code
  }),

  validationError: (field: string, message: string): BridgeError => ({
    type: BridgeErrorType.VALIDATION_ERROR,
    message: `Validation error for ${field}: ${message}`,
    retryable: false
  })
};

// Error Message Helpers
export const getErrorMessage = (error: BridgeError): string => {
  switch (error.type) {
    case BridgeErrorType.INSUFFICIENT_BALANCE:
      return 'You don\'t have enough balance for this transaction. Please check your wallet balance.';
    
    case BridgeErrorType.UNSUPPORTED_ROUTE:
      return 'This bridge route is not currently supported. Please try a different chain combination.';
    
    case BridgeErrorType.NETWORK_ERROR:
      return 'Network connection issue. Please check your internet connection and try again.';
    
    case BridgeErrorType.WALLET_ERROR:
      return 'Wallet connection issue. Please reconnect your wallet and try again.';
    
    case BridgeErrorType.TRANSACTION_FAILED:
      return 'Transaction failed. Please try again or contact support if the issue persists.';
    
    case BridgeErrorType.QUOTE_EXPIRED:
      return 'Quote has expired. Click refresh to get updated quotes.';
    
    case BridgeErrorType.INVALID_AMOUNT:
      return 'Please enter a valid amount within the supported range.';
    
    case BridgeErrorType.PROVIDER_ERROR:
      return `Bridge provider temporarily unavailable. ${error.retryable ? 'Please try again.' : ''}`;
    
    case BridgeErrorType.VALIDATION_ERROR:
      return error.message;
    
    default:
      return 'An unexpected error occurred. Please try again.';
  }
};

export const getErrorAction = (error: BridgeError): string => {
  if (error.retryable) {
    return 'Retry';
  }
  
  switch (error.type) {
    case BridgeErrorType.INSUFFICIENT_BALANCE:
      return 'Add Funds';
    
    case BridgeErrorType.WALLET_ERROR:
      return 'Reconnect Wallet';
    
    case BridgeErrorType.QUOTE_EXPIRED:
      return 'Refresh Quotes';
    
    default:
      return 'Dismiss';
  }
};