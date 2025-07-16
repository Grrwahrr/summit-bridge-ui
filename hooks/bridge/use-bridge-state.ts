import { useState } from 'react';
import { BridgeState } from '@/lib/bridge/types';

/**
 * Hook for managing bridge state
 * This is a placeholder hook that will be implemented in later tasks
 */
export function useBridgeState() {
  const [state, setState] = useState<BridgeState>({
    amount: '',
    quotes: [],
    isLoadingQuotes: false,
    transaction: {
      status: 'idle'
    }
  });

  const updateState = (updates: Partial<BridgeState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const resetState = () => {
    setState({
      amount: '',
      quotes: [],
      isLoadingQuotes: false,
      transaction: {
        status: 'idle'
      }
    });
  };

  return {
    state,
    updateState,
    resetState
  };
}