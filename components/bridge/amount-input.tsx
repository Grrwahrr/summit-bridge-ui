import React from 'react';
import { SupportedToken } from '@/lib/bridge/types';

export interface AmountInputProps {
  value: string;
  onChange: (value: string) => void;
  token?: SupportedToken;
  balance?: string;
  disabled?: boolean;
}

/**
 * Input component for bridge amount with validation
 * This is a placeholder component that will be implemented in later tasks
 */
export function AmountInput(props: AmountInputProps) {
  return (
    <div className="space-y-2">
      <div className="text-sm font-medium">Amount</div>
      <div className="p-4 border rounded-lg">
        <p className="text-muted-foreground text-sm">
          Amount input component will be implemented in upcoming tasks
        </p>
      </div>
    </div>
  );
}