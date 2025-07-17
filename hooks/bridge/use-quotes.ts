import { useState, useEffect, useCallback } from 'react';
import { Quote, QuoteRequest, BridgeProvider } from '@/lib/bridge/types';
import { QuoteService } from '@/lib/bridge/quote-service';
import { BridgeException } from '@/lib/bridge/errors';

interface UseQuotesOptions {
  autoRefresh?: boolean;
  refreshInterval?: number; // in milliseconds
  debounceDelay?: number; // in milliseconds
}

interface UseQuotesReturn {
  quotes: Quote[];
  isLoading: boolean;
  error: string | null;
  fetchQuotes: (request: QuoteRequest) => Promise<void>;
  refreshQuotes: () => Promise<void>;
  clearQuotes: () => void;
  getQuoteByProvider: (provider: BridgeProvider) => Quote | undefined;
}

/**
 * Custom hook for managing bridge quotes
 * Handles fetching, caching, and refreshing of quotes from multiple providers
 */
export function useQuotes(options: UseQuotesOptions = {}): UseQuotesReturn {
  const {
    autoRefresh = true,
    refreshInterval = 30000, // 30 seconds
    debounceDelay = 500 // 500ms
  } = options;

  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRequest, setLastRequest] = useState<QuoteRequest | null>(null);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);
  const [refreshTimer, setRefreshTimer] = useState<NodeJS.Timeout | null>(null);

  /**
   * Fetch quotes for a given request
   */
  const fetchQuotes = useCallback(async (request: QuoteRequest) => {
    // Clear existing debounce timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // Set up debounced execution
    const timer = setTimeout(async () => {
      setIsLoading(true);
      setError(null);
      setLastRequest(request);

      try {
        //const newQuotes = await quoteService.getQuotes(request);
        //setQuotes(newQuotes);
      } catch (err) {
        const errorMessage = err instanceof BridgeException 
          ? err.message 
          : 'Failed to fetch quotes';
        setError(errorMessage);
        setQuotes([]);
      } finally {
        setIsLoading(false);
      }
    }, debounceDelay);

    setDebounceTimer(timer);
  }, [debounceTimer, debounceDelay]);

  /**
   * Refresh current quotes
   */
  const refreshQuotes = useCallback(async () => {
    if (!lastRequest) return;
    
    setIsLoading(true);
    setError(null);

    try {
      //const newQuotes = await quoteService.getQuotes(lastRequest);
      //setQuotes(newQuotes);
    } catch (err) {
      const errorMessage = err instanceof BridgeException 
        ? err.message 
        : 'Failed to refresh quotes';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [lastRequest]);

  /**
   * Clear all quotes and reset state
   */
  const clearQuotes = useCallback(() => {
    setQuotes([]);
    setError(null);
    setLastRequest(null);
    setIsLoading(false);
    
    // Clear timers
    if (debounceTimer) {
      clearTimeout(debounceTimer);
      setDebounceTimer(null);
    }
    if (refreshTimer) {
      clearInterval(refreshTimer);
      setRefreshTimer(null);
    }
  }, [debounceTimer, refreshTimer]);

  /**
   * Get quote by provider
   */
  const getQuoteByProvider = useCallback((provider: BridgeProvider): Quote | undefined => {
    return quotes.find(quote => quote.provider === provider);
  }, [quotes]);

  /**
   * Set up auto-refresh when quotes are available
   */
  useEffect(() => {
    if (autoRefresh && quotes.length > 0 && lastRequest) {
      const timer = setInterval(() => {
        // Check if any quotes are about to expire
        const now = Date.now();
        const hasExpiringQuotes = quotes.some(quote => 
          quote.expiresAt - now < 10000 // Less than 10 seconds until expiry
        );

        if (hasExpiringQuotes) {
          refreshQuotes();
        }
      }, refreshInterval);

      setRefreshTimer(timer);

      return () => {
        clearInterval(timer);
        setRefreshTimer(null);
      };
    }
  }, [autoRefresh, quotes, lastRequest, refreshInterval, refreshQuotes]);

  /**
   * Cleanup timers on unmount
   */
  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
      if (refreshTimer) {
        clearInterval(refreshTimer);
      }
    };
  }, [debounceTimer, refreshTimer]);

  return {
    quotes,
    isLoading,
    error,
    fetchQuotes,
    refreshQuotes,
    clearQuotes,
    getQuoteByProvider
  };
}