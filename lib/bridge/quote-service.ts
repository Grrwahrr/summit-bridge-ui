import { Quote, QuoteRequest, BridgeProvider } from './types';

// Quote Service Interface
export interface QuoteService {
  getQuotes(request: QuoteRequest): Promise<Quote[]>;
  getQuoteFromProvider(
    provider: BridgeProvider,
    request: QuoteRequest
  ): Promise<Quote>;
  refreshQuote(quote: Quote, request: QuoteRequest): Promise<Quote>;
}

// Abstract Base Quote Service
export abstract class BaseQuoteService implements QuoteService {
  abstract getQuotes(request: QuoteRequest): Promise<Quote[]>;
  abstract getQuoteFromProvider(
    provider: BridgeProvider,
    request: QuoteRequest
  ): Promise<Quote>;
  abstract refreshQuote(quote: Quote, request: QuoteRequest): Promise<Quote>;

  protected createLoadingQuote(provider: BridgeProvider): Quote {
    return {
      provider,
      estimatedReceiveAmount: '0',
      fees: {
        bridgeFee: '0',
        gasFee: '0',
        total: '0'
      },
      estimatedTime: '0',
      isLoading: true,
      expiresAt: Date.now() + 30000 // 30 seconds from now
    };
  }

  protected isQuoteExpired(quote: Quote): boolean {
    return Date.now() > quote.expiresAt;
  }
}