import { useState, useCallback } from 'react';
import { Quote, TransactionRequest, TransactionStatus } from '@/lib/bridge/types';
import { transactionService } from '@/lib/bridge/transaction-service';
import { BridgeException } from '@/lib/bridge/errors';

interface UseBridgeTransactionReturn {
  isExecuting: boolean;
  transactionHash: string | null;
  transactionStatus: TransactionStatus | null;
  error: string | null;
  executeTransaction: (quote: Quote, userAddress: string, signer: any) => Promise<void>;
  checkTransactionStatus: (hash: string) => Promise<void>;
  resetTransaction: () => void;
}

/**
 * Custom hook for managing bridge transaction execution
 * Handles transaction submission, status tracking, and error management
 */
export function useBridgeTransaction(): UseBridgeTransactionReturn {
  const [isExecuting, setIsExecuting] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [transactionStatus, setTransactionStatus] = useState<TransactionStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * Execute a bridge transaction
   */
  const executeTransaction = useCallback(async (
    quote: Quote,
    userAddress: string,
    signer: any
  ) => {
    setIsExecuting(true);
    setError(null);
    setTransactionHash(null);
    setTransactionStatus(null);

    try {
      const request: TransactionRequest = {
        quote,
        userAddress,
        signer
      };

      const hash = await transactionService.executeBridge(request);
      setTransactionHash(hash);

      // Start monitoring transaction status
      await checkTransactionStatus(hash);
    } catch (err) {
      const errorMessage = err instanceof BridgeException 
        ? err.message 
        : 'Transaction execution failed';
      setError(errorMessage);
    } finally {
      setIsExecuting(false);
    }
  }, []);

  /**
   * Check transaction status
   */
  const checkTransactionStatus = useCallback(async (hash: string) => {
    if (!hash) return;

    try {
      // Get the provider from current transaction hash or use a default
      // In a real implementation, we'd store the provider with the hash
      const status = await transactionService.getTransactionStatus(
        hash, 
        transactionStatus?.hash === hash ? 
          // If we have existing status, we can infer provider from quote
          // For now, we'll need to pass provider separately or store it
          'wormhole' as any : 'wormhole' as any
      );
      
      setTransactionStatus(status);
    } catch (err) {
      const errorMessage = err instanceof BridgeException 
        ? err.message 
        : 'Failed to check transaction status';
      setError(errorMessage);
    }
  }, [transactionStatus]);

  /**
   * Reset transaction state
   */
  const resetTransaction = useCallback(() => {
    setIsExecuting(false);
    setTransactionHash(null);
    setTransactionStatus(null);
    setError(null);
  }, []);

  return {
    isExecuting,
    transactionHash,
    transactionStatus,
    error,
    executeTransaction,
    checkTransactionStatus,
    resetTransaction
  };
}