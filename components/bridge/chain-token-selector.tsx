import React from 'react';
import { SupportedChain, SupportedToken } from '@/lib/bridge/types';

export interface ChainTokenSelectorProps {
  type: 'source' | 'destination';
  selectedChain?: SupportedChain;
  selectedToken?: SupportedToken;
  onChainChange: (chain: SupportedChain) => void;
  onTokenChange: (token: SupportedToken) => void;
  disabled?: boolean;
}

/**
 * Component for selecting chains and tokens with intelligent defaults
 * This is a placeholder component that will be implemented in later tasks
 */
export function ChainTokenSelector(props: ChainTokenSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="text-sm font-medium">
        {props.type === 'source' ? 'From' : 'To'}
      </div>
      <div className="p-4 border rounded-lg">
        <p className="text-muted-foreground text-sm">
          Chain and token selector will be implemented in upcoming tasks
        </p>
      </div>
    </div>
  );
}