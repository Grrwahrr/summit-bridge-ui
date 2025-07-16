import React from 'react';

export interface TransactionStatusProps {
  status: 'idle' | 'pending' | 'success' | 'error';
  transactionHash?: string;
  error?: string;
  onReset: () => void;
}

/**
 * Component for showing transaction progress and results
 * This is a placeholder component that will be implemented in later tasks
 */
export function TransactionStatus(props: TransactionStatusProps) {
  return (
    <div className="space-y-4">
      <div className="text-sm font-medium">Transaction Status</div>
      <div className="p-4 border rounded-lg">
        <p className="text-muted-foreground text-sm">
          Transaction status component will be implemented in upcoming tasks
        </p>
      </div>
    </div>
  );
}